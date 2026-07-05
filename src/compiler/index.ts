import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compile } from "@mdx-js/mdx";
import { build as esbuild } from "esbuild";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { allowedComponentNames } from "../runtime/index.js";

export type BuildArtifactOptions = {
  input: string;
  outDir?: string;
};

export type CreateArtifactOptions = {
  mdx: string;
  outDir?: string;
};

export type BuildArtifactResult = {
  id: string;
  mdxPath: string;
  htmlPath: string;
  warnings: string[];
};

export type ValidationResult = {
  ok: boolean;
  errors: string[];
  warnings: string[];
};

export type ArtifactTocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

const rawHtmlTags = new Set([
  "a",
  "article",
  "aside",
  "blockquote",
  "button",
  "div",
  "footer",
  "form",
  "header",
  "iframe",
  "img",
  "input",
  "label",
  "main",
  "nav",
  "script",
  "section",
  "select",
  "span",
  "style",
  "textarea",
]);

const allowedProps: Record<string, string[]> = {
  Section: ["title", "description"],
  Stack: ["gap"],
  Grid: ["columns"],
  Card: ["title", "description"],
  Callout: ["variant", "title"],
  Stat: ["label", "value", "description"],
  Timeline: ["items"],
  Tabs: ["items"],
  Accordion: ["items"],
  Badge: ["variant"],
  Separator: [],
  KeyValueList: ["items"],
  Checklist: ["items"],
  Progress: ["label", "value", "description"],
  Quote: ["by"],
  ProsCons: ["pros", "cons"],
  ComparisonTable: ["columns", "rows"],
  DataTable: ["title", "columns", "rows", "searchable", "searchPlaceholder"],
  Carousel: ["title", "slides"],
  Tooltip: ["term", "content"],
  HoverCard: ["trigger", "title", "content"],
  Resizable: ["title", "panels"],
  Slider: ["label", "value", "min", "max", "description"],
  Chart: ["title", "type", "data", "xKey", "yKey"],
  MermaidDiagram: ["title", "type", "chart"],
};

export function artifactIdForMdx(mdx: string) {
  return createHash("sha256").update(mdx).digest("hex").slice(0, 12);
}

function escapeAnglePlaceholders(mdx: string) {
  // Let agents write placeholders like http://<hub-ip> without MDX treating them as JSX.
  // Real artifact components are PascalCase, so lowercase hyphenated placeholders are safe to escape.
  return mdx.replace(/<([a-z][a-z0-9]*-[a-z0-9-]*)>/g, "&lt;$1&gt;");
}

function slugForHeading(text: string) {
  return (
    text
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "section"
  );
}

function textFromMarkdownNode(node: any): string {
  if (!node) return "";
  if (typeof node.value === "string") return node.value;
  if (Array.isArray(node.children))
    return node.children.map(textFromMarkdownNode).join("");
  return "";
}

function stringAttribute(node: any, name: string) {
  const attr = node.attributes?.find(
    (item: any) => item?.type === "mdxJsxAttribute" && item.name === name,
  );
  return typeof attr?.value === "string" ? attr.value : undefined;
}

export function extractArtifactToc(mdx: string): ArtifactTocItem[] {
  const tree = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .parse(escapeAnglePlaceholders(mdx));
  const seen = new Map<string, number>();
  const toc: ArtifactTocItem[] = [];

  const addItem = (text: string, level: 2 | 3) => {
    const base = slugForHeading(text);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    toc.push({
      id: count === 0 ? base : `${base}-${count + 1}`,
      text: text.trim() || base,
      level,
    });
  };

  visit(tree, (node: any) => {
    if (node.type === "heading" && (node.depth === 2 || node.depth === 3)) {
      addItem(textFromMarkdownNode(node), node.depth);
      return;
    }

    if (node.type !== "mdxJsxFlowElement") return;
    if (node.name === "Section") {
      const title = stringAttribute(node, "title");
      if (title) addItem(title, 2);
    } else if (node.name === "DataTable") {
      const title = stringAttribute(node, "title");
      if (title) addItem(title, 3);
    }
  });

  return toc;
}

export function validateMdx(mdx: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const seen = new Set<string>();

  let tree: unknown;
  try {
    tree = unified()
      .use(remarkParse)
      .use(remarkMdx)
      .parse(escapeAnglePlaceholders(mdx));
  } catch (error) {
    return {
      ok: false,
      errors: [
        `Could not parse MDX: ${error instanceof Error ? error.message : String(error)}`,
      ],
      warnings,
    };
  }

  visit(tree, (node: any) => {
    if (node.type === "mdxjsEsm") {
      errors.push("Do not use import or export statements in artifacts.");
      return;
    }

    if (node.type !== "mdxJsxFlowElement" && node.type !== "mdxJsxTextElement")
      return;
    const name = String(node.name ?? "");
    if (!name) return;

    if (name.includes(".")) {
      errors.push(
        `Do not use member JSX component <${name}>. Use only approved artifact components.`,
      );
      return;
    }

    const first = name[0];
    const isComponent =
      first === first.toUpperCase() && first !== first.toLowerCase();
    if (!isComponent) {
      // Be precise: don't treat text placeholders like <hub-ip>, HUB_BIND_ADDR=..., or F=0x01 as props/components.
      // Only block obvious raw HTML tags and scripts/styles.
      if (rawHtmlTags.has(name.toLowerCase())) {
        errors.push(
          `Raw HTML tag <${name}> is not allowed. Use markdown or approved artifact components.`,
        );
      }
      return;
    }

    seen.add(name);
    if (!allowedComponentNames.includes(name)) {
      errors.push(
        `Unknown artifact component <${name}>. Allowed components: ${allowedComponentNames.join(", ")}.`,
      );
      return;
    }

    const props = allowedProps[name] ?? [];
    for (const attr of node.attributes ?? []) {
      if (!attr || attr.type === "mdxJsxExpressionAttribute") continue;
      const prop = String(attr.name ?? "");
      if (!props.includes(prop)) {
        errors.push(
          `<${name}> does not support prop "${prop}". Allowed props: ${props.join(", ") || "none"}.`,
        );
      }
      if (prop === "className")
        errors.push(
          "Do not use className; presentation is owned by the artifact runtime.",
        );
      if (prop === "style")
        errors.push(
          "Do not use inline styles; presentation is owned by the artifact runtime.",
        );
    }
  });

  if (seen.size > 8)
    warnings.push(
      "This artifact uses many component types. Prefer markdown unless components improve clarity.",
    );
  return { ok: errors.length === 0, errors: [...new Set(errors)], warnings };
}

async function readArtifactCss() {
  const runtimeDir = path.dirname(
    fileURLToPath(new URL("../runtime/index.js", import.meta.url)),
  );
  return readFile(path.join(runtimeDir, "globals.css"), "utf8");
}

async function bundleArtifactClient(mdx: string) {
  const runtimePath = fileURLToPath(
    new URL("../runtime/index.js", import.meta.url),
  );
  const runtimeDir = path.dirname(runtimePath);
  const artifactToc = extractArtifactToc(mdx);
  const compiledMdx = String(
    await compile(escapeAnglePlaceholders(mdx), {
      outputFormat: "program",
      jsx: true,
      jsxImportSource: "react",
      remarkPlugins: [remarkGfm],
      rehypePlugins: [[rehypePrettyCode, { theme: "github-dark" }]],
    }),
  );

  const result = await esbuild({
    stdin: {
      contents: `
        import React from "react";
        import { createRoot } from "react-dom/client";
        import { ArtifactShell, artifactComponents } from ${JSON.stringify(runtimePath)};
        import Content from "artifact:mdx";
        const artifactToc = ${JSON.stringify(artifactToc)};
        createRoot(document.getElementById("root")).render(
          React.createElement(ArtifactShell, { toc: artifactToc }, React.createElement(Content, { components: artifactComponents }))
        );
      `,
      resolveDir: runtimeDir,
      loader: "js",
    },
    bundle: true,
    write: false,
    format: "iife",
    platform: "browser",
    jsx: "automatic",
    plugins: [
      {
        name: "artifact-mdx",
        setup(build) {
          build.onResolve({ filter: /^artifact:mdx$/ }, (args) => ({
            path: args.path,
            namespace: "artifact-mdx",
          }));
          build.onLoad({ filter: /.*/, namespace: "artifact-mdx" }, () => ({
            contents: compiledMdx,
            loader: "jsx",
            resolveDir: runtimeDir,
          }));
        },
      },
    ],
  });
  return result.outputFiles[0]?.text ?? "";
}

export async function renderArtifactHtml(mdx: string): Promise<string> {
  const validation = validateMdx(mdx);
  if (!validation.ok)
    throw new Error(
      `Invalid artifact MDX:\n${validation.errors.map((e) => `- ${e}`).join("\n")}`,
    );

  const css = await readArtifactCss();
  const client = await bundleArtifactClient(mdx);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Agent Artifact</title>
<script>document.documentElement.classList.toggle('dark', window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)</script>
<style>${css}</style>
</head>
<body>
<main id="root"></main>
<script>${client}</script>
</body>
</html>
`;
}

export async function createArtifact(
  options: CreateArtifactOptions,
): Promise<BuildArtifactResult> {
  const outDir = path.resolve(options.outDir ?? ".agents/artifacts");
  const mdx = options.mdx;
  const validation = validateMdx(mdx);
  if (!validation.ok)
    throw new Error(
      `Invalid artifact MDX:\n${validation.errors.map((e) => `- ${e}`).join("\n")}`,
    );

  const id = artifactIdForMdx(mdx);
  await mkdir(outDir, { recursive: true });
  const mdxPath = path.join(outDir, `${id}.mdx`);
  const htmlPath = path.join(outDir, `${id}.html`);
  const html = await renderArtifactHtml(mdx);
  await writeFile(mdxPath, mdx);
  await writeFile(htmlPath, html);
  return { id, mdxPath, htmlPath, warnings: validation.warnings };
}

export async function buildArtifact(
  options: BuildArtifactOptions,
): Promise<BuildArtifactResult> {
  const input = path.resolve(options.input);
  const mdx = await readFile(input, "utf8");
  return createArtifact({ mdx, outDir: options.outDir });
}

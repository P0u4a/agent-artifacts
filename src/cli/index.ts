#!/usr/bin/env node
import { spawn } from "node:child_process";
import { existsSync, lstatSync } from "node:fs";
import { cp, mkdir, rm, stat, symlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createArtifact } from "../compiler/index.js";

async function init() {
  const cwd = process.cwd();
  const here = path.dirname(fileURLToPath(import.meta.url));
  let sourceSkill = path.resolve(here, "../skills/artifact");
  if (!existsSync(sourceSkill))
    sourceSkill = path.resolve(here, "../../skills/artifact");
  if (!existsSync(sourceSkill))
    throw new Error(`Could not find bundled artifact skill from ${here}`);

  const agentsSkill = path.join(cwd, ".agents/skills/artifact");
  const artifactsDir = path.join(cwd, ".agents/artifacts");
  const claudeSkillsDir = path.join(cwd, ".claude/skills");
  const claudeSkillLink = path.join(claudeSkillsDir, "artifact");

  await mkdir(path.dirname(agentsSkill), { recursive: true });
  await mkdir(artifactsDir, { recursive: true });
  await cp(sourceSkill, agentsSkill, { recursive: true, force: true });

  await mkdir(claudeSkillsDir, { recursive: true });
  if (existsSync(claudeSkillLink)) {
    const stat = lstatSync(claudeSkillLink);
    if (stat.isSymbolicLink()) await rm(claudeSkillLink);
  }
  if (!existsSync(claudeSkillLink)) {
    await symlink("../../.agents/skills/artifact", claudeSkillLink, "dir");
  }

  console.log("Initialized agent artifacts:");
  console.log("- .agents/skills/artifact");
  console.log("- .agents/artifacts");
  console.log("- .claude/skills/artifact -> ../../.agents/skills/artifact");
}

async function readStdin() {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin)
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf8");
}

async function create(args: string[]) {
  const mdx = args.length > 0 ? args.join(" ") : await readStdin();
  if (!mdx.trim())
    throw new Error(
      'Usage: agent-artifacts create "<MDX-code>"\nOr pipe MDX on stdin: agent-artifacts create < artifact.mdx',
    );

  const result = await createArtifact({ mdx, outDir: ".agents/artifacts" });
  console.log(`Artifact created: ${result.id}`);
  console.log(`MDX: ${result.mdxPath}`);
  console.log(`HTML: ${result.htmlPath}`);
  console.log(`View: agent-artifacts view ${result.id}`);
  for (const warning of result.warnings) console.warn(`Warning: ${warning}`);
}

async function view(args: string[]) {
  const id = args[0]?.replace(/\.html$/, "");
  if (!id) throw new Error("Usage: agent-artifacts view <artifact-id>");
  if (!/^[a-f0-9]{12}$/i.test(id))
    throw new Error(
      "Artifact id must be the 12-character id printed by agent-artifacts create",
    );

  const artifactsDir = path.resolve(".agents/artifacts");
  const htmlPath = path.join(artifactsDir, `${id}.html`);
  const htmlStat = await stat(htmlPath).catch(() => undefined);
  if (!htmlStat?.isFile())
    throw new Error(`Artifact HTML not found: ${htmlPath}`);

  const command =
    process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
        ? "cmd"
        : "xdg-open";
  const openArgs =
    process.platform === "win32" ? ["/c", "start", "", htmlPath] : [htmlPath];
  const child = spawn(command, openArgs, { detached: true, stdio: "ignore" });
  child.on("error", (error) => {
    console.error(`Could not open artifact automatically: ${error.message}`);
    console.log(`HTML: ${htmlPath}`);
  });
  child.unref();
  console.log(`Opening artifact ${id}`);
  console.log(`HTML: ${htmlPath}`);
}

function usage() {
  console.log(`Usage:
  agent-artifacts init
  agent-artifacts create "<MDX-code>"
  agent-artifacts create < artifact.mdx
  agent-artifacts view <artifact-id>`);
}

const command = process.argv[2] ?? "help";
const args = process.argv.slice(3);

const commands: Record<string, () => Promise<void>> = {
  init,
  create: () => create(args),
  view: () => view(args),
};

const action = commands[command];
if (action) {
  action().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
} else {
  usage();
  process.exit(
    command === "help" || command === "--help" || command === "-h" ? 0 : 1,
  );
}

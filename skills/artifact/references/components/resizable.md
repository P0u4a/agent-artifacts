# Resizable

Use `Resizable` for bento-style layouts, side-by-side dense summaries, dashboards, or comparisons where panel sizing helps scanning.

## Props

- `title?`: string
- `panels`: array of objects with:
  - `title?`: string
  - `content`: string
  - `defaultSize?`: number

## Example

```mdx
<Resizable
  title="Architecture bento"
  panels={[
    { title: "Skill", content: "Teaches the authoring workflow and component docs.", defaultSize: 35 },
    { title: "Compiler", content: "Validates MDX and emits standalone HTML.", defaultSize: 35 },
    { title: "Runtime", content: "Owns shadcn-based presentation.", defaultSize: 30 }
  ]}
/>
```

## Rules

- Use when a bento/dashboard layout is appropriate.
- Keep panel content concise.

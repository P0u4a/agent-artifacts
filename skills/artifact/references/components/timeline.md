# Timeline

Use `Timeline` to show chronological findings, events, milestones, or decisions.

## Props

- `items`: array of objects with:
  - `title`: string
  - `description?`: string
  - `date?`: string

## Example

```mdx
<Timeline items={[
  { title: "Initialize package", description: "Install the artifact skill and create `.agents/artifacts`." },
  { title: "Author draft", description: "Write semantic MDX to `draft.mdx`." },
  { title: "Compile", description: "Build script validates and writes final HTML." }
]} />
```

## Rules

- Keep descriptions concise.
- Use chronological or step-by-step ordering.

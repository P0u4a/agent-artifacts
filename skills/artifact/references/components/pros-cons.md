# ProsCons

Use `ProsCons` to compare advantages and disadvantages of an approach.

## Props

- `pros`: array of objects with:
  - `title`: string
  - `description?`: string
- `cons`: array of objects with:
  - `title`: string
  - `description?`: string

## Example

```mdx
<ProsCons
  pros={[
    { title: "Portable", description: "Works across Pi, Claude Code, and Codex through files and scripts." },
    { title: "Simple", description: "No custom tool protocol required for MVP." }
  ]}
  cons={[
    { title: "Requires install", description: "The package must exist in project dependencies for the script import." }
  ]}
/>
```

## Rules

- Use balanced, concise items.
- Prefer `ComparisonTable` when comparing more than two options.

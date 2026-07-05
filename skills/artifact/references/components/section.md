# Section

Use `Section` for major titled areas in the artifact.

## Props

- `title?`: string
- `description?`: string
- `children`: markdown/MDX content

## Example

```mdx
<Section title="Current Architecture" description="How artifact creation is split across skill, package, and compiler">
  The agent writes semantic MDX. The package validates and compiles the final deliverable.
</Section>
```

## Rules

- Use sections for top-level structure.
- Markdown headings are also fine when a component is unnecessary.

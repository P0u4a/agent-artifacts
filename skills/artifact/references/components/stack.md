# Stack

Use `Stack` to arrange child components vertically with consistent spacing.

## Props

- `gap?`: `"sm" | "md" | "lg"` default `"md"`
- `children`: MDX content

## Example

```mdx
<Stack gap="lg">
  <Card title="Input">The agent writes `.agents/artifacts/draft.mdx`.</Card>
  <Card title="Output">The build script creates the final HTML artifact.</Card>
</Stack>
```

## Rules

- Use when grouping multiple cards, callouts, or sections.

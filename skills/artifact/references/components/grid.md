# Grid

Use `Grid` for responsive two- or three-column layouts.

## Props

- `columns?`: `2 | 3` default `2`
- `children`: usually `Card` or `Stat` components

## Example

```mdx
<Grid columns={3}>
  <Stat label="Adapters" value="3" description="Pi, Claude Code, and Codex" />
  <Stat label="Output" value="HTML" description="Single-file deliverable" />
  <Stat label="Artifact dir" value=".agents" description="Always `.agents/artifacts`" />
</Grid>
```

## Rules

- Use `columns={2}` or `columns={3}` only.
- Keep grid children visually comparable.

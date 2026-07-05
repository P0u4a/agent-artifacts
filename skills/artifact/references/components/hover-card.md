# HoverCard

Use `HoverCard` for richer hover/focus context than a tooltip.

## Props

- `trigger`: string
- `title?`: string
- `content`: string

## Example

```mdx
<HoverCard
  trigger="deterministic ID"
  title="Content-addressed artifact ID"
  content="The build script hashes the MDX content and uses the hash prefix as the final filename."
/>
```

## Rules

- Use for optional context, definitions, or references.
- Keep content to one short paragraph.

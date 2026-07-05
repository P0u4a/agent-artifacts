# Card

Use `Card` to group related details, decisions, examples, or explanations.

## Props

- `title?`: string
- `description?`: string
- `children`: markdown/MDX content

## Example

```mdx
<Card title="Design Decision" description="Why adapters stay thin">
  The shared core owns artifact IDs, validation, and compilation. Agent-specific setup only teaches the workflow.
</Card>
```

## Rules

- Prefer one clear idea per card.
- Do not use `Card` for every paragraph.

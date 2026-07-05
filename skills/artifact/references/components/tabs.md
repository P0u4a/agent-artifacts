# Tabs

Use `Tabs` to present alternate views or compact grouped text.

## Props

- `items`: array of objects with:
  - `label`: string
  - `content`: string

## Example

```mdx
<Tabs items={[
  { label: "Pi", content: "Pi can discover the skill through the package manifest." },
  { label: "Claude Code", content: "Claude Code can use the symlinked `.claude/skills/artifact` skill." },
  { label: "Codex", content: "Codex can use the `.agents/skills/artifact` skill convention." }
]} />
```

## Rules

- `content` is plain text.
- Use for short alternate explanations, not long sections.

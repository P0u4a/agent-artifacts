# Checklist

Use `Checklist` for requirements, findings, readiness checks, or implementation status.

## Props

- `items`: array of objects with:
  - `label`: string
  - `checked?`: boolean, default checked
  - `description?`: string

## Example

```mdx
<Checklist items={[
  { label: "Skill installed", description: "Available under `.agents/skills/artifact`." },
  { label: "Claude symlinked", description: "`.claude/skills/artifact` points to the shared skill." },
  { label: "Codex verified", checked: false, description: "Confirm Codex skill discovery in the target project." }
]} />
```

## Rules

- Use `checked: false` for incomplete or uncertain items.
- Keep labels short.

# DataTable

Use `DataTable` for structured rows that benefit from search/filtering. The artifact runtime renders a generic searchable table.

## Props

- `title?`: string
- `columns`: array of `{ key: string, label: string }`
- `rows`: array of objects whose keys match the column keys
- `searchable?`: boolean, default `true`
- `searchPlaceholder?`: string

## Example

```mdx
<DataTable
  title="Adapter support matrix"
  columns={[
    { key: "agent", label: "Agent" },
    { key: "skill", label: "Skill" },
    { key: "notes", label: "Notes" }
  ]}
  rows={[
    { agent: "Pi", skill: "Native package manifest", notes: "Loads from pi.skills" },
    { agent: "Claude Code", skill: "Symlinked", notes: "Uses .claude/skills/artifact" },
    { agent: "Codex", skill: ".agents", notes: "Uses shared skill convention" }
  ]}
/>
```

## Rules

- Use only for larger structured datasets, usually 10+ rows, or when search/filtering is genuinely useful.
- Do not use for 2–5 rows; use markdown lists, `KeyValueList`, `ComparisonTable`, or a normal markdown table instead.
- Keep cell values short.

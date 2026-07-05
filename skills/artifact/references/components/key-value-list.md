# KeyValueList

Use `KeyValueList` for metadata, ownership, configuration, constraints, or summary facts.

## Props

- `items`: array of objects with:
  - `key`: string
  - `value`: string

## Example

```mdx
<KeyValueList items={[
  { key: "Artifact directory", value: ".agents/artifacts" },
  { key: "Draft file", value: ".agents/artifacts/draft.mdx" },
  { key: "Final format", value: "Standalone HTML" }
]} />
```

## Rules

- Use for compact facts, not long prose.
- Keep values short.

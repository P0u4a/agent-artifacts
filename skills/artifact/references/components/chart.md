# Chart

Use `Chart` to visualize small datasets. It is based on the shadcn chart pattern and rendered with Recharts by the artifact runtime.

## Props

- `title?`: string
- `type?`: `"bar" | "line" | "pie"` default `"bar"`
- `data`: array of objects
- `xKey?`: string, default `"name"`
- `yKey?`: string, default `"value"`

## Example

```mdx
<Chart
  title="Adapter coverage"
  type="bar"
  data={[
    { name: "Pi", value: 100 },
    { name: "Claude Code", value: 80 },
    { name: "Codex", value: 80 }
  ]}
/>
```

## Line chart example

```mdx
<Chart
  title="Artifact readiness over time"
  type="line"
  data={[
    { name: "Prototype", value: 30 },
    { name: "Skill", value: 60 },
    { name: "Compiler", value: 85 }
  ]}
/>
```

## Rules

- Use for small, clear datasets only.
- Keep labels short.
- Use `ComparisonTable` when exact text comparison matters more than visual trend.

# Slider

Use `Slider` to show a bounded value such as threshold, confidence, maturity, risk, or completion.

## Props

- `label`: string
- `value`: number
- `min?`: number, default `0`
- `max?`: number, default `100`
- `description?`: string

## Example

```mdx
<Slider label="Confidence" value={82} description="Based on passing build checks and a local artifact compile test." />
```

## Rules

- Use when the bounded scale is meaningful.
- Prefer `Progress` for completion; prefer `Slider` for thresholds or tunable values.

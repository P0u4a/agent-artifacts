# Progress

Use `Progress` for bounded completion, confidence, coverage, maturity, or readiness.

## Props

- `label`: string
- `value`: number from 0 to 100
- `description?`: string

## Example

```mdx
<Progress label="Implementation readiness" value={80} description="Core flow is implemented; richer components can be added over time." />
```

## Rules

- `value` must be a number between 0 and 100.
- Do not use for vague unbounded concepts unless you define what the percentage means.

# Tooltip

Use `Tooltip` for short inline explanations of terms, metrics, chart labels, or caveats.

## Props

- `term`: string
- `content`: string

## Example

```mdx
The chart shows <Tooltip term="coverage" content="The percent of requested behavior currently implemented." /> by adapter.
```

## Rules

- Keep tooltip content short.
- Use tooltips for supplemental context only; do not hide critical conclusions.
- Tooltips are useful near charts and metrics.

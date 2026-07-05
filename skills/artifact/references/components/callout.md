# Callout

Use `Callout` for important notes, recommendations, risks, warnings, or decisions. It renders with the shadcn `Alert` component.

## Props

- `variant?`: `"info" | "warning"` default `"info"`
- `title?`: string
- `children`: markdown/MDX content

## Examples

```mdx
<Callout variant="info" title="Implementation note">
  The build script owns final artifact IDs and output paths.
</Callout>
```

```mdx
<Callout variant="warning" title="Tradeoff">
  This approach simplifies setup but makes local package installation required for compilation.
</Callout>
```

## Rules

- Keep callouts short.
- Use `info` for notes, context, recommendations, and helpful observations.
- Use `warning` for risks, caveats, tradeoffs, and things that need attention.

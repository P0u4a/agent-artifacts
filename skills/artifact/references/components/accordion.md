# Accordion

Use `Accordion` for secondary details that should be accessible but not always visible.

## Props

- `items`: array of objects with:
  - `title`: string
  - `content`: string

## Example

```mdx
<Accordion items={[
  { title: "Why no CSS?", content: "The artifact runtime owns presentation so artifacts stay consistent and easy to validate." },
  { title: "Who picks filenames?", content: "The build script deterministically generates the final artifact ID." }
]} />
```

## Rules

- `content` is plain text.
- Do not hide critical conclusions in an accordion.

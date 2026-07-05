# Carousel

Use `Carousel` for step-through slides, grouped examples, or a sequence of alternatives.

## Props

- `title?`: string
- `slides`: array of objects with:
  - `title?`: string
  - `content`: string

## Example

```mdx
<Carousel
  title="Artifact workflow"
  slides={[
    { title: "1. Draft", content: "The agent writes `.agents/artifacts/draft.mdx`." },
    { title: "2. Validate", content: "The build script validates approved components and props." },
    { title: "3. Deliver", content: "The compiler writes a standalone HTML artifact." }
  ]}
/>
```

## Rules

- Use for ordered slides or grouped examples.
- Prefer `Tabs` when all groups should be directly selectable by label.

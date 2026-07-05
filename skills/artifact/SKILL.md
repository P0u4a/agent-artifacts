---
name: artifact
description: Create MDX artifacts explaining architecture, findings, feature behavior, design decisions, tradeoffs, technical plans, or project summaries. Use when the user asks to create an artifact, write up findings, document architecture, explain a design decision, teach a concept or produce a standalone technical deliverable.
---

# Artifact Skill

Write a single MDX artifact and compile it to standalone HTML.

## Workflow

- Generate the complete artifact MDX in memory.
- Create the artifact by passing that MDX to the CLI:

Use a heredoc:

```bash
npx agent-artifacts create <<'EOF'
# Artifact title

Markdown and approved components go here.
EOF
```

If validation fails, fix the MDX and run `npx agent-artifacts create` again.

- To modify an existing artifact, edit `.agents/artifacts/<id>.mdx`, then run:

```bash
npx agent-artifacts compile <id>
```

This regenerates `.agents/artifacts/<id>.html` in place.

- Run `npx agent-artifacts view <id>` to open the HTML file in the browser and report the HTML path to the user.

## Rules

- Do not write CSS.
- Do not use `style`, `className`, imports, exports, scripts, or raw HTML.
- Do not import components. The compiler provides them by name.
- Use only approved artifact components from the component list below.
- Read the reference file of a component to know what props it accepts.
- Prefer markdown for prose. Use components only when you need visuals or interactivity.
- Use `DataTable` only for larger structured datasets, usually 10+ rows or when search/filtering is genuinely useful. For small data, use markdown lists, `KeyValueList`, or a normal markdown table.
- When drawing diagrams, prefer multiple small diagrams over one large diagram.
- The artifact should be self-contained and understandable without the chat history.

## Components

### Layout

- `Section` — Major titled document sections. Reference: `references/components/section.md`
- `Stack` — Vertical layout with consistent spacing. Reference: `references/components/stack.md`
- `Grid` — Responsive two- or three-column layout. Reference: `references/components/grid.md`

### Content

- `Card` — Group related explanation, decisions, examples, or details. Reference: `references/components/card.md`
- `Callout` — Highlight notes, risks, recommendations, warnings, or decisions. Reference: `references/components/callout.md`
- `Badge` — Inline status, category, or small label. Reference: `references/components/badge.md`
- `Stat` — Display important metrics, counts, or summarized values. Reference: `references/components/stat.md`
- `KeyValueList` — Show metadata, configuration, ownership, or summary facts. Reference: `references/components/key-value-list.md`
- `Checklist` — Show completed/pending requirements, findings, or tasks. Reference: `references/components/checklist.md`
- `Progress` — Show bounded completion, confidence, coverage, or maturity. Reference: `references/components/progress.md`
- `Quote` — Emphasize a key principle, constraint, or quoted finding. Reference: `references/components/quote.md`
- `ProsCons` — Compare advantages and disadvantages of an approach. Reference: `references/components/pros-cons.md`
- `DataTable` — Searchable/filterable generic table for structured data. Reference: `references/components/data-table.md`
- `Carousel` — Step-through slides or grouped examples. Reference: `references/components/carousel.md`
- `HoverCard` — Extra context revealed on hover/focus. Reference: `references/components/hover-card.md`
- `Tooltip` — Short inline explanations, including chart terms or metrics. Reference: `references/components/tooltip.md`
- `Resizable` — Bento-style resizable panel layout for dense dashboards. Reference: `references/components/resizable.md`
- `Slider` — Show a bounded value/range such as confidence or threshold. Reference: `references/components/slider.md`
- `Chart` — Visualize small datasets with bar, line, or pie charts. Tooltips are built in. Reference: `references/components/chart.md`
- `Timeline` — Show chronological findings, events, milestones, or decisions. Reference: `references/components/timeline.md`

### Organization

- `Tabs` — Present alternate views or compact grouped text. Reference: `references/components/tabs.md`
- `Accordion` — Hide secondary details while keeping them accessible. Reference: `references/components/accordion.md`
- `Separator` — Visually separate major areas when headings are not enough. Reference: `references/components/separator.md`

### Diagrams

- `MermaidDiagram` — Flowcharts, sequence diagrams, state diagrams, ER diagrams, timelines, mind maps, and other Mermaid diagrams. Reference: `references/components/mermaid-diagram.md`

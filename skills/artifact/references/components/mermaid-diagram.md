# MermaidDiagram

Use `MermaidDiagram` for diagrams that are easier to author as text: flowcharts, sequence diagrams, state diagrams, class diagrams, ER diagrams, timelines, mind maps, pie charts, git graphs, and journey maps.

The artifact runtime renders Mermaid. Do not write React diagram code.

## Props

- `title?`: string
- `type?`: `"flowchart" | "sequence" | "class" | "state" | "er" | "journey" | "gantt" | "pie" | "git" | "mindmap" | "timeline"`
- `chart`: Mermaid source string

## Flowchart example

```mdx
<MermaidDiagram
  title="Movement command flow"
  type="flowchart"
  chart={`flowchart LR
    subgraph iOS
      app[Mobile App]
    end
    subgraph Hub
      api[Command API]
      queue[Command Queue]
    end
    subgraph ESP
      firmware[Motor Firmware]
    end
    app -->|POST /move| api
    api -->|enqueue| queue
    queue -->|serial command| firmware`}
/>
```

## Sequence diagram example

```mdx
<MermaidDiagram
  title="Command acknowledgement"
  type="sequence"
  chart={`sequenceDiagram
    participant App
    participant Hub
    participant ESP
    App->>Hub: POST /move
    Hub->>ESP: Serial command
    ESP-->>Hub: ACK
    Hub-->>App: 202 Accepted`}
/>
```

## Rules

- Prefer `flowchart LR` for command/request/data flows.
- Use `sequenceDiagram` for interactions over time.
- In sequence diagrams, valid arrows include `->>`, `-->>`, `->`, and `-->`. Do not use `==>>` or `==>`.
- Use `stateDiagram-v2` for state machines.
- Use `erDiagram` for data models.
- Keep labels short and readable.
- Use Mermaid `subgraph` blocks for lanes or groups such as “iOS”, “Hub”, “ESP”, and “External clients”.

# agent-artifacts

Agent-authored MDX artifacts compiled to standalone HTML.

## Setup

```bash
npm install -D @p0u4a/agent-artifacts
npx agent-artifacts init
```

`init` creates:

```txt
.agents/skills/artifact/
.agents/artifacts/
.claude/skills/artifact -> ../../.agents/skills/artifact
```

Ask your agent to create an artifact, your agent handles the rest.

## CLI

```bash
agent-artifacts create < artifact.mdx
agent-artifacts compile <id>
agent-artifacts view <id>
```

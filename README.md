# agent-artifacts


Agent-authored MDX artifacts compiled to standalone HTML.

## Preview

<img width="1033" height="772" alt="Screenshot 2026-07-04 at 3 12 23 pm" src="https://github.com/user-attachments/assets/9387f9a8-41e9-4e06-a722-a7dbf9542691" />
<img width="1491" height="791" alt="Screenshot 2026-07-04 at 11 19 10 pm" src="https://github.com/user-attachments/assets/bbdfb288-6332-4fe0-9c2b-460f636f46b5" />


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

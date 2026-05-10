---
name: c4-diagrams
description: Use when explaining existing code architecture, visualizing a new system before detailed design, mapping software boundaries, or creating C4-style diagrams in ASCII or Mermaid.
---

# C4 Diagrams

## Overview

Use C4 diagrams to clarify software architecture before detailed design. Focus on boundaries, responsibilities, actors, dependencies, and data flow; draw only the levels that add value.

## First Gates

Before diagramming, determine these choices. If the user already specified one, honor it. If multiple choices are ambiguous, ask one concise combined question.

| Choice | Options | Default behavior |
| --- | --- | --- |
| Purpose | Existing code, new system, design review | Existing code requires codebase exploration first; new systems require assumptions called out. |
| Format | ASCII, Mermaid | Ask the user. Mermaid means plain Mermaid syntax, not C4-specific Mermaid. |
| Rigor | Strict C4, lightweight C4-inspired, hybrid | Ask the user. Do not decide silently. |

If the user asks to skip questions for speed, still preserve unresolved choices as explicit assumptions and keep the first diagram lightweight.

## Workflow

1. Establish purpose, format, and rigor.
2. For existing code, inspect entry points, runtime boundaries, integrations, and persistence before drawing. For a quick pass, inspect enough to identify language/framework, launch entry points, major directories, external integrations, and data stores; label anything else as unknown.
3. Pick the smallest useful diagram set. Start with system context or container; add component, dynamic, or deployment only when it answers a real question.
4. Draw the diagram using ASCII or plain Mermaid.
5. Explain the diagram in 3-6 bullets: boundaries, responsibilities, key relationships, assumptions, and open questions.
6. Stop before detailed design unless the user approves the diagram and asks to continue.

## C4 Level Selection

| Level | Use when | Avoid when |
| --- | --- | --- |
| System context | Identifying users, external systems, and scope | The scope is already obvious and local. |
| Container | Showing deployable/runnable units, data stores, APIs, CLIs, queues | You only need code-level call flow. |
| Component | Explaining internals of one container | The container has few meaningful internal parts. |
| Code | Rarely, for critical classes/modules | A normal component diagram would be enough. |
| Dynamic | Showing request, event, or workflow sequence | Static structure is the actual question. |
| Deployment | Showing infrastructure, nodes, networks, runtime placement | Deployment is unknown or irrelevant. |

For small systems, challenge requests for all four C4 levels and offer a smaller set. If the user still wants all four, produce them but mark low-value levels as lightweight sketches and explain why they may not be worth maintaining.

## Output Rules

- Mermaid diagrams must use plain `flowchart` or `sequenceDiagram` syntax for portability.
- ASCII diagrams should favor readable boxes and arrows over decorative complexity.
- Keep labels concrete: actor, system, container, component, database, queue, external service.
- Do not mix levels accidentally: containers are runnable/deployable units; components live inside one container.
- Always include assumptions when diagramming a future system or incomplete codebase.
- Always include open questions when boundaries, ownership, data flow, or deployment are uncertain.

## Templates

Use `templates.md` in this skill directory for compact ASCII and Mermaid starting points.

## Common Mistakes

| Mistake | Fix |
| --- | --- |
| Drawing all four C4 levels by default | Draw only levels that answer the current question. |
| Jumping into detailed design immediately | Validate context/container boundaries first. |
| Using C4-specific Mermaid syntax | Use plain Mermaid `flowchart` or `sequenceDiagram`. |
| Treating modules as containers | Containers are runnable/deployable units; modules are usually components. |
| Hiding uncertainty | State assumptions and open questions after the diagram. |

# Intent-Driven Template

This is a template project for intent-driven software delivery with OpenSpec,
OpenCode, and reusable engineering skills.

It is intended for teams that want changes to start from clear intent, move
through explicit behaviour and design artifacts, and finish with implementation
tasks that preserve the reasoning behind the work.

## Walkthrough

Read the full walkthrough: [Spec-Driven Development with OpenSpec and OpenCode](https://intent-driven.dev/blog/2026/05/10/spec-driven-development-openspec-opencode/).

[![Spec-Driven Development with OpenSpec and OpenCode](https://img.youtube.com/vi/M3dp9u1wZes/maxresdefault.jpg)](https://www.youtube.com/watch?v=M3dp9u1wZes)

## What This Template Uses

- OpenSpec for setup, proposal, specification, design, ADR, and task artifacts.
- Custom schemas from https://github.com/intent-driven-dev/openspec-schemas.
- A bundled local copy of the `intent-driven` custom schema from
  https://github.com/intent-driven-dev/openspec-schemas/tree/main/openspec/schemas/intent-driven
  for the full `proposal -> specs -> design -> adr -> tasks` lifecycle.
- OpenSpec git discipline so proposals land on `main` before apply, and
  implementation lands on `main` before archive.
- OpenCode skills for repeatable collaboration and implementation workflows,
  including C4 diagrams, ADR authoring, and OpenSpec lifecycle commands.
- Superpowers from https://github.com/obra/superpowers for guided practices such
  as brainstorming, planning, debugging, TDD, verification, worktrees, and
  subagent-driven parallel work.
- A `grill-me` style of rigorous design interrogation, inspired by
  https://github.com/mattpocock/skills/blob/main/skills/productivity/grill-me/SKILL.md.
- ADRs for durable architectural decisions.
- C4 diagrams for communicating architecture boundaries and relationships.
- Gherkin-style requirements and scenarios for observable behaviour.

The bundled OpenSpec schema is a local copy of the `intent-driven` schema from
https://github.com/intent-driven-dev/openspec-schemas/tree/main/openspec/schemas/intent-driven.

## Workflow

The intent-driven workflow moves through these artifacts in order:

```text
proposal -> specs -> design -> adr -> tasks
```

- `proposal` captures why the change matters.
- `specs` describe observable behaviour with Gherkin-style scenarios.
- `design` explains the implementation approach and trade-offs.
- `adr` records durable architectural decisions.
- `tasks` turn the accepted intent, behaviour, design, and decisions into work.

## Schema

This repository includes a bundled local copy of the `intent-driven` schema at
`openspec/schemas/intent-driven/`. The upstream schema lives in
https://github.com/intent-driven-dev/openspec-schemas/tree/main/openspec/schemas/intent-driven.

To activate the schema, set this in `openspec/config.yaml`:

```yaml
schema: intent-driven
```

To validate it, run:

```bash
openspec schema validate intent-driven
```

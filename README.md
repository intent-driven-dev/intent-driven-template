# Intent-Driven Template

This is a template project for intent-driven software delivery with OpenSpec,
OpenCode, and reusable engineering skills.

It is intended for teams that want changes to start from clear intent, move
through explicit behaviour and design artifacts, and finish with implementation
tasks that preserve the reasoning behind the work.

## What This Template Uses

- OpenSpec for proposal, specification, design, ADR, and task artifacts.
- OpenCode skills for repeatable collaboration and implementation workflows.
- Superpowers from https://github.com/obra/superpowers for guided practices such
  as brainstorming, planning, debugging, TDD, and verification.
- A `grill-me` style of rigorous design interrogation, inspired by
  https://github.com/mattpocock/skills/blob/main/skills/productivity/grill-me/SKILL.md.
- ADRs for durable architectural decisions.
- C4 diagrams for communicating architecture boundaries and relationships.
- Gherkin-style requirements and scenarios for observable behaviour.

The bundled OpenSpec schema follows the intent-driven schema from
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

This repository includes the local schema README at
`openspec/schemas/intent-driven/README.md`.

To activate the schema, set this in `openspec/config.yaml`:

```yaml
schema: intent-driven
```

To validate it, run:

```bash
openspec schema validate intent-driven
```

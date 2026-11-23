# Intent-Driven Template

An [OpenSpec](https://github.com/Fission-AI/OpenSpec) template for Intent-Driven Development using OpenCode, Codex CLI, GitHub Copilot CLI, and Claude Code with the `proposal -> specs -> design -> adr -> tasks` workflow and optional collaboration workflows.

## What's New In 2.0

2.0 adds a basic setup for several agents: OpenCode, Codex CLI, GitHub Copilot CLI, and Claude Code. All of them share the same OpenSpec configuration, skills, and role instructions (`.agents/`), so you can switch between agents in the same repository at any time. Adding another agent is a small, additive change: a thin agent definition that points to the shared instructions in `.agents/agents/`.

> **2.0.0 is still evolving.** Please [report issues](https://github.com/intent-driven-dev/intent-driven-template/issues) you run into.

### Using OpenSpec 1.x And OpenCode Only (Legacy)

The previous setup supported only OpenCode and OpenSpec 1.x. It remains available as the [`v1.0.0` tag](https://github.com/intent-driven-dev/intent-driven-template/releases/tag/v1.0.0) and the [`1.x` branch](https://github.com/intent-driven-dev/intent-driven-template/tree/1.x):

```bash
git clone --branch v1.0.0 https://github.com/intent-driven-dev/intent-driven-template.git
```

The `1.x` branch is maintenance-only; new capabilities land in 2.x.

## Walkthrough (OpenCode)

[![Spec-Driven Development with OpenSpec and OpenCode](https://img.youtube.com/vi/o1w3V3DElV4/maxresdefault.jpg)](https://www.youtube.com/watch?v=o1w3V3DElV4)

Read the full walkthrough:

[Spec-Driven Development with OpenSpec and OpenCode](https://intent-driven.dev/blog/2026/05/10/spec-driven-development-openspec-opencode/)

[SDD with Multi-Model Spec Review and Glossary](https://intent-driven.dev/blog/2026/06/27/sdd-adversarial-authoring-glossary/)

## Requirements

- OpenSpec 2.0 or later
- OpenCode 2.0 or later, Codex CLI, GitHub Copilot CLI, or Claude Code (any one is enough)

## How To Use This Template

### Start A New Project From This Template

Clone this repository, open it with OpenCode, Codex CLI, GitHub Copilot CLI, or Claude Code, and start working
from the bundled OpenSpec configuration, skills, and schema.

### Add This Template To An Existing Project

Open your existing project with any of the supported CLIs and ask it to install the template:

```text
Read and understand https://raw.githubusercontent.com/intent-driven-dev/intent-driven-template/refs/heads/main/INSTALL_TEMPLATE.md and follow the instructions there.
```

## What This Template Uses

- OpenSpec for setup, proposal, specification, design, ADR, and task artifacts.
- Custom schemas from https://github.com/intent-driven-dev/openspec-schemas.
- A bundled local copy of the `intent-driven` custom schema from
  https://github.com/intent-driven-dev/openspec-schemas/tree/main/openspec/schemas/intent-driven
  for the full `proposal -> specs -> design -> adr -> tasks` lifecycle.
- OpenSpec git discipline so proposals land on `main` before apply, and
  implementation lands on `main` before archive.
- Shared skills for repeatable collaboration and implementation workflows,
  including C4 diagrams, ADR authoring, and the OpenSpec lifecycle.
- A bundled `test-driven-development` skill plus `senior-dev` and `senior-qa`
  subagents for test-first implementation and
  acceptance-test work, routed via the `context` block in `openspec/config.yaml`.
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

`openspec/config.yaml` already selects the bundled [`intent-driven` schema](openspec/schemas/intent-driven/schema.yaml). Learn how to tailor artifact workflows in [OpenSpec Custom Schemas](https://intent-driven.dev/blog/2026/02/12/openspec-custom-schemas/).

## Skills

OpenCode, Codex CLI, and Copilot CLI discover the bundled skills in `.agents/skills/`. Claude Code
discovers them through the symlinks in `.claude/skills/`, which point back to `.agents/skills/`;
add a symlink there when you add a new skill. To invoke a
workflow, ask the CLI to use the skill by name, for example `Use openspec-propose to plan add-auth`.

The bundled OpenSpec lifecycle skills are `openspec-new-change`, `openspec-propose`,
`openspec-continue-change`, `openspec-explore`, `openspec-apply-change`,
`openspec-verify-change`, `openspec-sync-specs`, `openspec-archive-change`, and
`openspec-bulk-archive-change`.

| Skill | Location | Purpose | Enabled Or Updated By |
|-------|----------|---------|-----------------------|
| `openspec-bulk-apply-change` | `.agents/skills/` | Applies multiple active changes concurrently in isolated worktrees with parallel verification. | Ask any supported CLI to use the skill for named changes or for all active changes. |
| `adversarial-authoring` | `.agents/skills/` | Runs author and reviewer agents in sequence to reduce model bias in drafts. | Refer to the skill under rule in the rules section of `openspec/config.yaml`. |
| `grill-me` | `.agents/skills/` | Interrogates plans and designs with probing questions to surface hidden assumptions. | Refer to this skill under rules section in `openspec/config.yaml`. |
| `c4-diagrams` | `.agents/skills/` | Visualises system architecture using C4 model levels in ASCII or Mermaid. | Refer to this skill under `design` rule in `openspec/config.yaml`. |
| `architectural-decision-records` | `.agents/skills/` | Captures architectural decisions with rationale, tradeoffs, and supersession chains. | Used automatically by the schema: `design` uses it to read existing ADRs from earlier changes, and `adr` uses it to write new ones (as `proposed` until you accept them). Uncomment the `adr` rule in `openspec/config.yaml` to be asked which decisions to record. |
| `gherkin-authoring` | `.agents/skills/` | Drafts and improves Gherkin scenarios for observable, domain-language behaviour. | Required by `spec-as-source` during the `specs` phase. |
| `glossary` | `.agents/skills/` | Maintains business and technical terminology and companion glossary references for specification artifacts. | Can be referred to under `proposal` and/or `design` rule in `openspec/config.yaml`. |
| `openspec-git-discipline` | `.agents/skills/` | Enforces that proposals reach `main` before apply, and implementation merges before archive. | Enabled through `AGENTS.md`. |
| `spec-as-source` | `.agents/skills/` | Adds executable acceptance specifications to the intent-driven workflow. | Explicitly opt in by uncommenting both the `specs` and `tasks` rules in `openspec/config.yaml`. |
| `acceptance-test-authoring` | `.agents/skills/` | Configures the acceptance runner, extraction, linting, and step definitions for `spec-as-source`. | Required by `spec-as-source` when configuring or changing acceptance-test infrastructure. |
| `test-driven-development` | `.agents/skills/` | Guides strict red-green-refactor TDD: one behaviour per test, minimal implementation to pass, refactoring on green, with best-practice patterns and collaborator mocking guidance. | Loaded by `senior-dev`; enable routing by uncommenting the `context` lines in `openspec/config.yaml`. |

Example configurations are available in `openspec/config.yaml` and `AGENTS.md`. You can comment/uncomment the skill references to enable them.

OpenCode V2's native subagents power `openspec-bulk-apply-change` without extra plugins. Claude Code
subagents cannot launch other subagents, so run the specialist roles from the main session there.

## Experimental: Spec As Source

The `spec-as-source` skill is an opt-in layer on the intent-driven schema that uses fenced Gherkin in OpenSpec specifications as the source for generating acceptance tests. To enable `spec-as-source` capability add the skill reference under both the `specs` and `tasks` rules in `openspec/config.yaml`.

During `specs`, `spec-as-source` requires `gherkin-authoring` to author the fenced Gherkin scenarios. During `tasks`, it replaces the standard task template with acceptance-test-first work: configure and run the acceptance suite, then implement application work. Use `acceptance-test-authoring` to configure the runner, extraction, linting, and step definitions that execute the specifications. See [Behavior-Driven Development and Spec-Driven Development with OpenSpec](https://intent-driven.dev/blog/2026/07/17/behavior-driven-development-sdd-openspec/).

## Further Reading

- Template overview: [Spec-Driven Development with OpenSpec and OpenCode](https://intent-driven.dev/blog/2026/05/10/spec-driven-development-openspec-opencode/)
- Schema customization: [OpenSpec Custom Schemas](https://intent-driven.dev/blog/2026/02/12/openspec-custom-schemas/)
- Durable architecture: [Architectural Decision Records with Spec-Driven Development using OpenSpec](https://intent-driven.dev/blog/2026/04/29/spec-driven-development-with-adr/)
- Multi-model review and glossary: [SDD with Multi-Model Spec Review and Glossary](https://intent-driven.dev/blog/2026/06/27/sdd-adversarial-authoring-glossary/)
- Parallel implementation: [OpenSpec, Git WorkTrees and OpenCode](https://intent-driven.dev/blog/2026/04/01/openspec-git-worktrees-opencode/)
- Spec-As-Source Spec-Driven Development: [Behavior-Driven Development and Spec-Driven Development with OpenSpec](https://intent-driven.dev/blog/2026/07/17/behavior-driven-development-sdd-openspec/)
- Brownfield adoption: [Spec-Driven Development with Brownfield Projects](https://intent-driven.dev/blog/2026/03/10/spec-driven-development-brownfield/)
- SDD + BDD + TDD: [How TDD and BDD Actually Fit Into Spec-Driven Development](https://intent-driven.dev/blog/2026/08/23/tdd-bdd-spec-driven-development/)

## Agents

Edit shared role instructions in `.agents/agents/`. Each platform-specific agent
definition loads the corresponding shared file before starting a task.

| Agent | Purpose |
|-------|---------|
| `adversarial-author` | Writes an initial draft of a specification artifact or design document. |
| `adversarial-reviewer` | Reviews the author's draft with challenges and improvement suggestions. |
| `senior-dev` | Implements src work test-first through strict red-green-refactor, following the `test-driven-development` skill. |
| `senior-qa` | Authors acceptance tests, step definitions, and runner configuration, following the `acceptance-test-authoring` skill. |

### Adding Another Agent

Create that agent's native definitions (for example `.<agent>/agents/<role>.md`) so each one tells the agent to read and follow `.agents/agents/<role>.md`. Skills in `.agents/skills/` and guidance in `AGENTS.md` are shared, so most agents need nothing more. Then add a short section below describing its model settings.

### OpenCode

Set `model` in the frontmatter of `.opencode/agents/<role>.md` using
`provider/model` or `provider/model#variant`. The adversarial author and reviewer
inherit the parent session's model by default. For cross-model review, set
different `model` values in `.opencode/agents/adversarial-author.md` and
`.opencode/agents/adversarial-reviewer.md`.

### Codex CLI

Set `model` and optionally `model_reasoning_effort` at the top level of
`.codex/agents/<role>.toml`, before any table such as `[features]`. By default,
subagents inherit the parent agent's model and reasoning effort. Use distinct
`model` values for cross-model review and choose models and reasoning levels
available in your Codex CLI. See the [Codex subagent model documentation](https://learn.chatgpt.com/docs/agent-configuration/subagents#model-choice).

Add these lines above `[features]` in `.codex/agents/adversarial-author.toml`.

```toml
model = "gpt-6.1-sol"
model_reasoning_effort = "medium"
```

Add these lines above `[features]` in `.codex/agents/adversarial-reviewer.toml`.

```toml
model = "gpt-6-astra"
model_reasoning_effort = "high"
```

### Claude Code

Subagents live in `.claude/agents/<role>.md` and point to the shared instructions in
`.agents/agents/<role>.md`. The adversarial author is limited to `Read, Grep, Glob` and the
reviewer to `Read`; `senior-dev` and `senior-qa` inherit all tools. Claude Code
(v2.1.277 or later) reads `AGENTS.md` directly, so the repository guidance applies without a
`CLAUDE.md`. If you add a `CLAUDE.md`, Claude reads only that file, so start it with `@AGENTS.md`.
Claude Code subagents cannot launch other subagents, so delegate to them from the main session.

Subagents inherit the parent session's model by default. For cross-model review, add a `model`
line (`sonnet`, `opus`, `haiku`, a full model ID, or `inherit`) to the frontmatter of
`.claude/agents/adversarial-author.md` and `.claude/agents/adversarial-reviewer.md`, using
different values for each.

### Hermes (Claude Code CLI)

Hermes agent definitions live in `.hermes/agents/<role>.md` and point to the shared instructions
in `.agents/agents/<role>.md`. Each agent's frontmatter configures `model`, `thinking_budget`,
and optional `tools` restrictions. Hermes discovers the shared skills in `.agents/skills/`
through symlinks in `.hermes/skills/` and reads `AGENTS.md` for repository guidance.

Spawn subagents with `delegate_task` and include the shared role instructions from
`.agents/agents/<role>.md` in the delegation context. Hermes supports granular per-agent
model and thinking budget control in frontmatter:

```yaml
---
name: adversarial-author
model: anthropic/claude-opus-4-20250514  # or sonnet/opus/haiku/inherit
thinking_budget: high                     # or low/medium/max
tools: [read_file, search_files]          # optional tool restrictions
---
```

**Model values:**
- Full model ID: `anthropic/claude-sonnet-4-5-20250929`, `anthropic/claude-opus-4-20250514`
- Short aliases: `sonnet`, `opus`, `haiku` (map to latest versions)
- `inherit` - use parent session's model (default if omitted)

**Thinking budget:** `low`, `medium`, `high`, or `max` (controls reasoning depth and speed).

For cross-model adversarial review, set different `model` values in
`.hermes/agents/adversarial-author.md` (e.g., `opus`) and
`.hermes/agents/adversarial-reviewer.md` (e.g., `sonnet`).

### GitHub Copilot CLI

Repository custom agents live in `.github/agents/<role>.agent.md`. The four
profiles in that directory point to the shared instructions in
`.agents/agents/<role>.md`; the adversarial author and reviewer profiles are
read-only, while the development and QA profiles retain the tools needed for
their work. Select a profile with `/agent` in an interactive session or start a
session with `copilot --agent <role>`. Copilot CLI already discovers the shared
skills in `.agents/skills/` and repository guidance in `AGENTS.md`.

These are Copilot's repository-level custom-agent profiles, so other compatible
Copilot surfaces may also discover them; this template documents their use from
Copilot CLI.

Repository model and reasoning-effort settings belong in
`.github/copilot/settings.json`; local overrides belong in
`.github/copilot/settings.local.json`. Use `/model` for session or repository
model defaults and `/subagents` for per-subagent model and effort settings.
There is no separate `.copilot/` repository configuration folder.
# Install Intent-Driven Template

Follow these instructions in OpenCode or Codex CLI when a user asks you to add
this template to an existing project.

## Goal

Install the intent-driven OpenSpec template files into the user's
current project without overwriting project-specific work blindly.

This first-time install guide does not cover upgrade/version tracking. Handle
upgrade instructions in a separate change.

## Source Template

Clone a fresh local copy of the template repository outside the target project:

```bash
git clone https://github.com/intent-driven-dev/intent-driven-template.git
```

If the user already has a local clone, you may use it after checking its current
branch and status.

## Target Project Review

Before copying files, inspect the target project:

- Check `README.md`, `AGENTS.md`, `opencode.json`, `openspec/`, `.opencode/`,
  `.codex/`, and `.agents/` if they exist.
- Identify existing OpenSpec, agent, or skill configuration for either CLI.
- Preserve user-specific instructions and project conventions.
- Do not delete or replace existing files without explaining the conflict and
  getting user approval.

## Files To Install

Copy these template files and directories into the target project when they do
not already exist:

- `openspec/`
- `.agents/skills/` for shared skills that both CLIs discover automatically
- `.agents/agents/` for shared agent definitions and their renderer
- `.opencode/agents/` and `.opencode/agent-models.json` for OpenCode
- `.codex/agents/` and `.codex/agent-models.json` for Codex CLI
- `opencode.json`

Merge these files when they already exist:

- `AGENTS.md`
- `README.md`, only if the user explicitly wants project documentation updated

## Install Steps

1. Clone or locate the source template repository.
2. Inspect the target project for existing configuration and documentation.
3. Copy missing template directories and files into the target project.
4. Merge `AGENTS.md` by adding the OpenSpec git-discipline instruction without
   removing existing user instructions.
5. If `opencode.json`, `openspec/`, `.opencode/`, `.codex/`, or `.agents/` already exist,
   compare the template version with the target version and ask the user before
   replacing or restructuring anything. Check `.opencode/agent/` for older
   definitions with the same agent names before installing the new ones.
6. Keep the target project's product code, package files, application docs, and
   existing tests unchanged unless the user explicitly asks for changes.
7. Verify the resulting file tree and summarize exactly what changed. To start
   a workflow, ask either CLI to use a skill by name, such as `openspec-propose`.

The native agent files are ready to use after copying. To customize a role, edit
its Markdown source in `.agents/agents/` or its CLI's `agent-models.json`, then
run `node .agents/agents/render.mjs` from the project root.

## Validation

After installation, run the safest available checks for the target project:

```bash
git status --short
```

If OpenSpec is available, also run:

```bash
openspec schema validate intent-driven
```

If the selected CLI or OpenSpec is unavailable, report that clearly and leave
the installed files in place for the user to verify later.

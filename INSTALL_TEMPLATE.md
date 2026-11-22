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
- `.agents/agents/` for shared agent instructions
- `.opencode/agents/` for OpenCode role definitions that point to the shared instructions
- `.codex/agents/` for Codex CLI role registrations
- `opencode.json`

Merge these files when they already exist:

- `AGENTS.md`
- `README.md`, only if the user explicitly wants project documentation updated

## Install Steps

1. Clone or locate the source template repository.
2. Inspect the target project for existing configuration and documentation.
3. Copy missing template directories and files into the target project.
4. Merge the OpenSpec git-discipline and Codex delegation instructions from
   `AGENTS.md`, preserving existing user instructions.
5. If `opencode.json`, `openspec/`, `.opencode/`, `.codex/`, or `.agents/` already exist,
   compare the template version with the target version and ask the user before
   replacing or restructuring anything. Check `.opencode/agent/` and the
   project's OpenCode JSON configuration for existing definitions with the same
   names before copying the new role files.
6. Keep the target project's product code, package files, application docs, and
   existing tests unchanged unless the user explicitly asks for changes.
7. Verify the resulting file tree and summarize exactly what changed. To start
   a workflow, ask either CLI to use a skill by name, such as `openspec-propose`.

Edit shared role instructions in `.agents/agents/`. Set model and effort
overrides in the corresponding role file under `.opencode/agents/` or
`.codex/agents/`.

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

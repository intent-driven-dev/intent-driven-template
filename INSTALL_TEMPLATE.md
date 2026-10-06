# Install Intent-Driven Template

This file is for OpenCode and Command Code. Follow these instructions when a
user asks you to add this template to an existing project.

## Goal

Install the intent-driven OpenSpec template files into the user's current
project without overwriting project-specific work blindly. The same workflow is
available to OpenCode and Command Code through their native configuration
directories.

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
  `.commandcode/`, and `.agents/` if they exist.
- Identify existing OpenSpec, OpenCode, Command Code, agent, or skill
  configuration.
- Preserve user-specific instructions and project conventions.
- Do not delete or replace existing files without explaining the conflict and
  getting user approval.

## Files To Install

Copy these template files and directories into the target project when they do
not already exist:

- `openspec/` — OpenSpec schema, templates, and configuration (required by both
  OpenCode and Command Code).
- `.agents/` — shared collaboration skills (grill-me, c4-diagrams, ADR, etc.)
  that both OpenCode and Command Code discover.
- `.opencode/` — OpenCode commands, skills, and subagents.
- `.commandcode/` — Command Code commands, skills, and subagents (a mirror of
  the OpenCode workflow with tool names adapted to Command Code).
- `opencode.json` — OpenCode plugin configuration.

Merge these files when they already exist:

- `AGENTS.md`
- `README.md`, only if the user explicitly wants project documentation updated

## Install Steps

1. Clone or locate the source template repository.
2. Inspect the target project for existing configuration and documentation.
3. Copy the missing template directories and files into the target project.
4. Merge `AGENTS.md` by adding the OpenSpec git-discipline instruction without
   removing existing user instructions.
5. If `opencode.json`, `openspec/`, `.opencode/`, `.commandcode/`, or `.agents/`
   already exist, compare the template version with the target version and ask
   the user before replacing or restructuring anything.
6. Keep the target project's product code, package files, application docs, and
   existing tests unchanged unless the user explicitly asks for changes.
7. Verify the resulting file tree and summarize exactly what changed.

## Which Files Does Each Tool Use?

| Tool | Directories |
|------|-------------|
| OpenCode | `openspec/`, `.opencode/`, `.agents/`, `opencode.json`, `AGENTS.md` |
| Command Code | `openspec/`, `.commandcode/`, `.agents/`, `AGENTS.md` |

`openspec/` is shared by both tools — it holds the `intent-driven` schema and
per-change artifacts. The `.opencode/` and `.commandcode/` directories each
contain the tool's own commands, skills, and subagents. The `.agents/` directory
holds collaboration skills that both tools load unchanged.

## Validation

After installation, run the safest available checks for the target project:

```bash
git status --short
```

If OpenSpec is available, also run:

```bash
openspec schema validate intent-driven
```

If Command Code is available, verify that it discovered the project skills:

```bash
cmd skills list
```

If OpenCode, Command Code, or OpenSpec commands are unavailable, report that
clearly and leave the installed files in place for the user to verify later.

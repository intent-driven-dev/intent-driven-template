# Install Intent-Driven Template

Follow these instructions in OpenCode, Codex CLI, GitHub Copilot CLI, or Claude Code when a user asks you to add
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
  `.codex/`, `.claude/`, `CLAUDE.md`, and `.agents/` if they exist.
- Identify existing OpenSpec, agent, or skill configuration for any supported CLI.
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
- `.github/agents/` for GitHub Copilot CLI role profiles
- `.claude/skills/` for Claude Code skill symlinks that point to `.agents/skills/`
- `.claude/agents/` for Claude Code role definitions that point to the shared instructions
- `opencode.json`

Merge these files when they already exist:

- `AGENTS.md`
- `CLAUDE.md`, if it exists: make sure it imports `AGENTS.md` with an `@AGENTS.md` line, because
  Claude Code ignores `AGENTS.md` when a `CLAUDE.md` is present
- `README.md`, only if the user explicitly wants project documentation updated

## Install Steps

1. Clone or locate the source template repository.
2. Inspect the target project for existing configuration and documentation.
   Before copying OpenCode role files, check existing files in
   `.opencode/agents/` and `.claude/agents/` for name collisions with the template roles. Explain any
   conflict and ask the user before overwriting; preserve their configuration
   unless they approve the replacement.
3. Copy missing template directories and files into the target project.
4. Merge the OpenSpec git-discipline and Codex delegation instructions from
   `AGENTS.md`, preserving existing user instructions.
5. If `opencode.json`, `openspec/`, `.opencode/`, `.codex/`, `.claude/`, or `.agents/` already exist,
   compare the template version with the target version and ask the user before
   replacing or restructuring anything.
6. Keep the target project's product code, package files, application docs, and
   existing tests unchanged unless the user explicitly asks for changes.
7. Verify the resulting file tree and summarize exactly what changed. To start
   a workflow, ask the CLI to use a skill by name, such as `openspec-propose`.

This installer targets OpenCode V2 and manages OpenCode agents only in
`.opencode/agents/`. It does not inspect or migrate legacy `.opencode/agent/`
definitions or scan OpenCode JSON configuration for agent-name collisions.
Users are responsible for ensuring that template agent IDs are not also defined
in their OpenCode JSON configuration. Still review an existing `opencode.json`
for general installation safety and obtain approval before replacing or
restructuring it.

The `.claude/skills/` entries are relative symlinks to `.agents/skills/`. Preserve
them when copying (for example `cp -R`, not `cp -L`); where symlinks are not
supported, copy the skill directories into `.claude/skills/` instead.

Edit shared role instructions in `.agents/agents/`. Set model and effort
overrides in the corresponding role file under `.opencode/agents/`,
`.codex/agents/`, or `.claude/agents/`.

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

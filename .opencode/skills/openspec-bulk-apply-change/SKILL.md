---
name: openspec-bulk-apply-change
description: Use when multiple active OpenSpec changes should be applied concurrently in isolated worktrees with delegated verification and no merge.
license: MIT
compatibility: Requires git, OpenSpec CLI, and OpenCode subagents.
metadata:
  author: openspec
  version: "1.0"
  generatedBy: "1.3.1"
---

# OpenSpec Bulk Apply

Apply multiple active OpenSpec changes by creating isolated worktrees, dispatching delegated apply flows in parallel subagents, running verification in each flow, and reporting back without merging or archiving.

**REQUIRED SUB-SKILL:** Use `openspec-git-discipline` before any apply or worktree workflow.

## When to Use

- More than one active OpenSpec change exists
- `/opsx-bulk-apply` was invoked without an explicit single-change target
- The user wants multiple changes applied in parallel
- The user asks to apply all active OpenSpec changes

Do not use bulk mode when only one candidate change remains. Stop and tell the user to use `/opsx-apply <change>` instead.

## Steps

1. **Get candidate changes**

   Run:

   ```bash
   openspec list --json
   ```

   - If command input included change names, limit analysis to those changes.
   - If fewer than 2 active candidate changes remain, stop and tell the user to use `/opsx-apply <change>`.
   - Do not ask the user to choose one change when 2 or more candidates remain and the request is clearly bulk apply.

2. **Run git discipline checks**

   For each candidate change, verify apply is allowed before creating worktrees:

   - Run `git status --short`.
   - Verify `openspec/changes/<change>/` has no uncommitted proposal files.
   - Verify the proposal change exists on `main` before applying from any branch or worktree.

   If any candidate fails the gate, exclude it from execution and report the reason. If fewer than 2 executable candidates remain, stop and report that bulk apply is not appropriate.

3. **Collect change context**

   For each executable candidate change:

   ```bash
   openspec status --change "<name>" --json
   openspec instructions apply --change "<name>" --json
   ```

   Then:

   - Read all listed `contextFiles`.
   - Read the tasks artifact and summarize pending work.
   - Note the implementation scope needed by the delegated apply flow.
   - Exclude blocked or all-done changes from execution and include them in the final report.

4. **Create isolated worktrees**

   For each executable candidate change:

   - Create a git worktree under `.worktrees/<change>` unless the user specified another root.
   - Keep the parent agent out of direct implementation work in the main workspace.
   - Do not create commits, branches, or merges unless the user explicitly approved them.

5. **Dispatch subagents in parallel**

   For each executable candidate change:

   - Dispatch one subagent in that change's worktree.
   - Run all delegated apply flows in parallel.
   - Do not apply any change directly in the parent agent.

   Subagent prompt requirements:

   - Work only in the assigned worktree.
   - Use `openspec-git-discipline` before applying.
   - Run `/opsx-apply <change>`.
   - Run `/opsx-verify <change>` after apply work is complete.
   - Stop after verification.
   - Do not merge, archive, or commit unless explicitly instructed by the parent prompt.
   - Return implementation outcome, verification status, changed files, blockers, and unresolved warnings.

6. **Collect and normalize reports**

   For each executed change, capture:

   - Worktree path
   - Apply status: `complete`, `paused`, or `failed`
   - Verify status: `ready`, `warnings`, `critical`, or `failed`
   - Files changed summary
   - Blockers or unresolved warnings

7. **Report back without merging**

   Present a final bulk-apply report:

   - Changes analyzed
   - Changes skipped and why
   - Worktrees created
   - Apply result per change
   - `/opsx-verify` result per change
   - Which changes are ready for human review

   End with: "No merge or archive was performed. Explicit user approval is required before any merge or archive."

## Quick Reference

| Situation | Action |
| --- | --- |
| 2+ active candidates | Bulk apply in isolated worktrees |
| Explicit list of 2+ changes | Bulk apply only those changes |
| 1 candidate | Stop and use `/opsx-apply <change>` |
| Proposal not on `main` | Exclude or stop before apply |
| Blocked or all-done change | Skip execution and report status |
| Subagent finishes apply | Require `/opsx-verify <change>` before review-ready |
| User asks to merge/archive | Stop and require explicit follow-up approval |

## Common Mistakes

| Mistake | Fix |
| --- | --- |
| Asking user to pick one change for a bulk request | Keep all executable candidates when 2+ remain |
| Running apply in the parent workspace | Dispatch one subagent per worktree |
| Processing changes sequentially | Dispatch independent apply flows in parallel |
| Reporting ready after apply only | Require `/opsx-verify <change>` first |
| Treating verify as permission to merge | Report only; merge needs explicit approval |
| Archiving after verify | Never archive during bulk apply |

## Guardrails

- Do not auto-merge.
- Do not auto-archive.
- Do not bulk-apply when only one candidate change remains.
- Do not perform apply work in the parent agent; use subagents only.
- Do not run bulk apply in the main workspace; use isolated worktrees only.
- Keep `.worktrees/` as the default worktree root unless the user specifies another location.
- Require `/opsx-verify` in every delegated apply flow before reporting a change as review-ready.
- Preserve OpenSpec git discipline: apply only changes whose proposal state has reached `main`.

---
name: openspec-bulk-apply-change
description: Use when multiple active OpenSpec changes should be applied concurrently in isolated worktrees with delegated verification and no merge.
license: MIT
compatibility: Requires git, OpenSpec CLI, and subagents that can work in separate git worktrees.
metadata:
  author: openspec
  version: "1.0"
  generatedBy: "1.3.1"
---

# OpenSpec Bulk Apply

Apply multiple active OpenSpec changes by creating isolated worktrees, dispatching delegated apply flows in parallel subagents, running verification in each flow, and reporting back without merging or archiving.

**REQUIRED SUB-SKILL:** Use `openspec-git-discipline` before any apply or worktree workflow.

## Input

Use this skill for requests to apply multiple OpenSpec changes in parallel. The user can name the changes, for example `Use openspec-bulk-apply-change for add-auth and improve-search`, or omit the names to discover all active changes.

## Steps

1. **Get candidate changes**

   Run:

   ```bash
   openspec list --json
   ```

   - If the user named changes, limit analysis to those changes.
   - If one active candidate remains, stop and direct the user to `openspec-apply-change` for that change. If none remain, report that there are no active candidates.
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

   **Check worker routing before creating worktrees:**

   - Read applicable project instructions and the apply/verify skills to determine whether each worker may implement and verify the change itself or must delegate to roles such as `senior-dev` and `senior-qa`.
   - When no further delegation is required, default to the built-in `general` worker to implement and verify its assigned change itself. Do not invent specialist routing where the project does not require it.
   - When project instructions require nested delegation, select an already configured custom worker capable of launching the required specialists, rather than `general`. Verify that the parent can launch that worker and that the worker can launch the required roles. Do not silently replace required specialists with self-implementation or self-verification.
   - **OpenCode V2-specific:** The built-in `general` subagent cannot launch children. The default `experimental.subagent_depth` is `1`; a direct parent → worker → specialist flow needs at least `2` (and more if the current session is already nested or further levels are required). Depth alone is insufficient: the relevant agents' `subagent` permissions must also permit each required child. Use native subagents, not plugins.
   - **Codex and other harnesses:** Use their native subagents and check their own delegation capabilities, nesting limits, and permissions; OpenCode configuration keys and built-in restrictions are not portable settings.
   - If a required worker, nesting depth, or permission is missing or cannot be confirmed, pause the affected change before dispatch. Report the required roles, the missing capability, and the action needed: ask the user to identify an existing delegation-capable worker, enable sufficient depth, or permit the specific parent/worker child launches, as applicable. Resume only after those prerequisites are confirmed. Do not add a dedicated worker or change global configuration by default, and do not bypass project routing as a fallback.
   - Include routing pauses in the final report. If fewer than 2 executable candidates remain, stop rather than dispatching a single-change bulk flow.

4. **Create isolated worktrees**

   For each executable candidate change:

   - Create a git worktree under `.worktrees/<change>` unless the user specified another root.
   - Resolve each created worktree directory to its absolute canonical path (resolving symlinks) and record it as the worker's expected root. Do not infer that root from the worker's inherited directory.
   - Keep the parent agent out of direct implementation work in the main workspace.
   - Do not create commits, branches, or merges unless the user explicitly approved them.

5. **Dispatch subagents in parallel**

   For each executable candidate change:

   - Dispatch one subagent per change using the worker selected by the routing check. Pass its expected canonical root and set its working directory when supported. A path in prompt text does not automatically change any tool's working directory; require explicit tool targeting as described below. If reliable worktree targeting is unavailable, pause the affected change rather than falling back to the parent workspace.
   - Run all delegated apply flows in parallel.
   - Do not apply any change directly in the parent agent.

   Subagent prompt requirements:

   - Before implementation, run `git rev-parse --show-toplevel` with the shell tool's `workdir` explicitly set to the assigned worktree. Canonicalize the returned path and compare it with the expected canonical root supplied by the parent. On command failure or mismatch, halt the assigned work and report both paths or the error; do not continue in another workspace.
   - For all delegated project work, including reading project instructions and tooling, use absolute file-tool paths scoped to the assigned worktree and set every shell operation's `workdir` explicitly to that worktree. Resolve paths before use; do not follow symlinks outside it or rely on inherited directories, a previous `cd`, or prompt text. These worker requirements do not apply to the parent's discovery or worktree creation steps.
   - Propagate the expected canonical root, absolute-path boundary, and explicit shell `workdir` requirements to every nested delegate, including implementation and verification specialists. Require each child to perform the same git-root check before its assigned work; pause if a child cannot reliably target the worktree or halt if its check fails.
   - Use `openspec-git-discipline` before applying.
   - Load and follow `openspec-apply-change` for the assigned change.
   - Load and follow `openspec-verify-change` for that change after apply work is complete.
   - Follow applicable project role routing: implement and verify directly only when further delegation is not required; otherwise use the required specialists through the confirmed native delegation path. If a required child launch is unavailable, pause and report the blocker instead of bypassing it.
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
   - Verification result per change
   - Which changes are ready for human review

   End with: "No merge or archive was performed. Explicit user approval is required before any merge or archive."

## Quick Reference

| Situation | Action |
| --- | --- |
| 2+ active candidates | Bulk apply in isolated worktrees |
| Explicit list of 2+ changes | Bulk apply only those changes |
| 1 candidate | Stop and direct the user to `openspec-apply-change` |
| Proposal not on `main` | Exclude or stop before apply |
| Blocked or all-done change | Skip execution and report status |
| Subagent finishes apply | Require `openspec-verify-change` before reporting ready for review |
| User asks to merge/archive | Stop and require explicit follow-up approval |

## Common Mistakes

| Mistake | Fix |
| --- | --- |
| Asking user to pick one change for a bulk request | Keep all executable candidates when 2+ remain |
| Running apply in the parent workspace | Dispatch one subagent per worktree |
| Processing changes sequentially | Dispatch independent apply flows in parallel |
| Reporting ready after apply only | Require `openspec-verify-change` first |
| Treating verify as permission to merge | Report only; merge needs explicit approval |
| Archiving after verify | Never archive during bulk apply |

## Guardrails

- Worktree checks and explicit paths are operational guardrails against accidental cross-workspace work, not a security sandbox or filesystem access control.
- Do not auto-merge.
- Do not auto-archive.
- Do not bulk-apply when only one candidate change remains.
- Do not perform apply work in the parent agent; use subagents only.
- Do not run bulk apply in the main workspace; use isolated worktrees only.
- Keep `.worktrees/` as the default worktree root unless the user specifies another location.
- Require verification in every delegated apply flow before reporting a change as ready for review.
- Preserve OpenSpec git discipline: apply only changes whose proposal state has reached `main`.

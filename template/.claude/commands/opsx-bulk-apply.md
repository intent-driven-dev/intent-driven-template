---
description: Apply multiple OpenSpec changes concurrently in isolated worktrees
---

Apply multiple active OpenSpec changes concurrently.

**Input**: Optionally specify two or more change names (e.g., `/opsx-bulk-apply add-auth improve-search`). If omitted, discover active changes with `openspec list --json`.

**Required skill**: Use `openspec-bulk-apply-change`.

**Steps**

1. **Get candidate changes**

   Run:

   ```bash
   openspec list --json
   ```

   If change names were provided, limit candidates to those names.

2. **Check candidate count**

   - If fewer than 2 active candidate changes remain, stop and tell the user to use `/opsx-apply <change>`.
   - If 2 or more candidates remain, continue with `openspec-bulk-apply-change`.

3. **Follow the bulk apply skill exactly**

   The skill must:

   - Run OpenSpec git discipline checks before apply.
   - Create isolated worktrees under `.worktrees/<change>` unless another root is requested.
   - Dispatch one subagent per change.
   - Run `/opsx-apply <change>` and `/opsx-verify <change>` in each subagent.
   - Collect normalized apply and verify reports.
   - Report results without merging or archiving.

**Output**

```markdown
## Bulk Apply Report

### Changes Analyzed
- <change>

### Worktrees
- `<path>`

### Results
| Change | Apply | Verify | Review Ready |
| --- | --- | --- | --- |
| <change> | complete | ready | yes |

### Blockers and Warnings
- <change>: <details>

No merge or archive was performed. Explicit user approval is required before any merge or archive.
```

**Guardrails**

- Do not modify existing single-change `/opsx-apply` behavior.
- Do not ask the user to choose one change when the request is clearly bulk apply and 2 or more candidates exist.
- Do not apply changes directly in the parent workspace.
- Do not merge, archive, or commit unless the user explicitly asks for that follow-up action.

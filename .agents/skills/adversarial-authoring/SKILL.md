---
name: adversarial-authoring
description: Use when rules or instructions mention "adversarial-authoring", "adversarial authoring", "must use adversarial-authoring skill", "model council", "cross-model review", or "mixture of models"; coordinates adversarial authoring and review subagents and records council notes.
license: MIT
compatibility: Requires named subagents adversarial-author and adversarial-reviewer.
---

# Adversarial Authoring

Use this skill when an artifact rule, user request, or instruction says to use adversarial authoring, a model council, cross-model review, or a mixture of models.

The goal is to reduce single-perspective bias by having one configured subagent author the work and another configured subagent challenge it before the primary agent writes the final artifact.

## Required Workflow

1. Identify the artifact or task being authored, including its target output path.
2. Gather the full task context before calling subagents:
   - User request
   - Relevant OpenSpec instruction JSON
   - Artifact template
   - Project context
   - Artifact-specific rules
   - Dependency artifacts already completed
3. Start the authoring round with the `adversarial-author` subagent. Require a completed, successful report containing the full draft; wait for it before starting the reviewer.
4. Send that full draft and the original task context to the `adversarial-reviewer` subagent. Require a completed, successful review report before proceeding.
5. Reconcile the completed review yourself as the primary agent:
   - Accept corrections that improve correctness, clarity, requirements coverage, or risk handling.
   - Reject suggestions that conflict with the user request, artifact template, OpenSpec instructions, or project rules.
   - Ask the user only if the disagreement changes product intent or cannot be resolved from available context.
6. Only after both stages complete successfully, write the final artifact to the requested output path as the primary agent.
7. As the primary agent, write council notes beside the artifact using the naming convention below.

### Completion gates (all CLIs)

- A launch acknowledgement, child/session ID, progress update, or blocked report is not successful completion. Inspect the returned report for stage completion and the required content; do not infer success from a notification alone.
- For background children, wait for the harness's native completion notification/report before advancing. OpenCode children run in the background and report when idle; idle does not necessarily mean success. Do not poll or invent wait/status tools.
- If either stage fails, is unavailable, blocked, or returns an incomplete report (including a missing full author draft), report an incomplete round and ask the user before proceeding with primary-only fallback. Do not fabricate a completed review, final artifact, or completed council notes.
- If the user authorizes fallback, the primary agent writes both the artifact and notes. Explicitly identify the omitted or incomplete stage and the authorization in the notes; do not claim a complete council round or invent that stage's findings.

## Subagents

Use these named subagents:

- `adversarial-author`: authors the initial draft.
- `adversarial-reviewer`: reviews and challenges the draft.

Do not substitute other agents unless the user explicitly requests it.

## Council Notes

For every artifact authored through this skill, create or update a sibling council-notes file.

Naming convention:

- `proposal.md` -> `proposal.council.md`
- `design.md` -> `design.council.md`
- `tasks.md` -> `tasks.council.md`
- `spec.md` -> `spec.council.md`

If the artifact path is nested, keep the council notes in the same directory as the artifact.

Use this structure:

```markdown
# Council Notes: <artifact-id-or-file-name>

## Author Summary
<Concise summary of the author draft. Do not include hidden reasoning or raw transcript.>

## Reviewer Challenges
- <Specific objection, gap, ambiguity, or risk raised by the reviewer>

## Resolutions
- Accepted: <Change incorporated into the final artifact and why>
- Rejected: <Suggestion not incorporated and why>
- Deferred: <Issue left unresolved or moved to later work>

## Remaining Risks
- <Risk or uncertainty that remains after reconciliation>
```

Council notes are an audit trail, not the canonical artifact. Keep them concise and useful.

## Guardrails

- Do not include raw model dialogue, hidden chain-of-thought, or full transcripts in the artifact or council notes.
- Keep the authored artifact clean and canonical; put process details in the `.council.md` file.
- Follow the original artifact template and OpenSpec instructions exactly.
- Do not copy project context or rules verbatim into the final artifact unless the template requires it.
- Prefer one author round and one review round. Add a second author revision round only when the reviewer identifies a concrete correctness issue.
- If subagent output conflicts, the primary agent owns the final synthesis.
- Never bypass the completion gates without explicit user authorization for primary-only fallback.

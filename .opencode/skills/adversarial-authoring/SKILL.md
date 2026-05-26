---
name: adversarial-authoring
description: Use when rules or instructions mention "adversarial-authoring", "adversarial authoring", "must use adversarial-authoring skill", "model council", "cross-model review", or "mixture of models"; coordinates adversarial authoring and review subagents and records council notes.
license: MIT
compatibility: Requires opencode subagents named adversarial-author and adversarial-reviewer.
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
3. Start the authoring round with the `adversarial-author` subagent.
4. Send the author draft and the original task context to the `adversarial-reviewer` subagent.
5. Reconcile the review yourself as the primary agent:
   - Accept corrections that improve correctness, clarity, requirements coverage, or risk handling.
   - Reject suggestions that conflict with the user request, artifact template, OpenSpec instructions, or project rules.
   - Ask the user only if the disagreement changes product intent or cannot be resolved from available context.
6. Write the final artifact to the requested output path.
7. Write council notes beside the artifact using the naming convention below.

## Subagents

Use these hard-coded opencode subagents:

- `adversarial-author`: authors the initial draft.
- `adversarial-reviewer`: reviews and challenges the draft.

The specific model providers are intentionally defined only in the agent files, so changing model families only requires updating each agent's `model` frontmatter.

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
- If subagent execution is unavailable, state that adversarial authoring could not be completed and ask whether to proceed with primary-agent authoring only.

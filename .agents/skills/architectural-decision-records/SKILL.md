---
name: architectural-decision-records
description: Use when documenting, drafting, reviewing, or updating architectural decisions, ADRs, decision logs, tradeoffs, rationale, consequences, alternatives, or architecture decision history.
---

# Architectural Decision Records

## Overview

An Architectural Decision Record captures one architecturally significant decision, its rationale, tradeoffs, and consequences. Optimize for future readers reconstructing decision history.

## When to Use

Use when creating, updating, reviewing, or explaining an ADR, architecture decision, decision log, tradeoff analysis, rationale, consequences, alternatives, or status.

Do not use ADRs for transient implementation details, meeting notes, or insignificant decisions. If significance is unclear, ask what future maintainers will need to know.

## Workflow

1. Identify the single decision. Split multiple decisions into multiple ADRs.
2. Check `preferences.md` for `preferred-style`.
3. If `preferred-style: unset`, ask the user which style to use, then record it in `preferences.md` before drafting.
4. Use the matching file under `templates/`.
5. Capture known facts only: context, requirements, constraints, options, rationale, decision makers, consequences.
6. If facts are missing, mark them as `Unknown` or ask a focused question; do not invent context, options, or quality attributes.
7. Write honest consequences: benefits, downsides, follow-up.
8. Preserve history: supersede old accepted ADRs; do not rewrite them away.

## Template Choice

| Situation | Template |
| --- | --- |
| Detailed tradeoff record | `templates/madr-full.md` |
| Concise tradeoff record | `templates/madr-minimal.md` |
| Classic lightweight ADR | `templates/nygard.md` |
| One-sentence summary | `templates/y-statement.md` |
| Project-specific style | `templates/custom.md` |
| Too little evidence | ADR review notes/questions, not accepted ADR |

## Status Values

| Status | Use when |
| --- | --- |
| Proposed | Under review |
| Accepted | Team committed |
| Deprecated | Historically relevant but no longer recommended |
| Superseded | Replaced by another ADR; link it |

## Preference Prompt

If no preference is recorded, ask:

> Which ADR style should I use and remember for this project: MADR full, MADR minimal, Nygard, Y-Statement, or custom?

After the user answers, update `preferences.md` with the selected `preferred-style`. Do not ask again unless the user asks to change style.

## Review Checklist

- One decision, not a bundle
- Significant: affects structure, quality attributes, constraints, or evolution
- Context explains why it existed
- Rejected options/tradeoffs are explicit
- Rationale is tied to requirements, not preference
- Downsides and follow-up work are recorded
- Status is clear
- Unknowns are marked, not invented

## Example

```markdown
# ADR-012: Use PostgreSQL for Orders

## Status

Accepted

## Context

Orders need relational constraints, consistency, and reporting joins. The team operates PostgreSQL well.

## Considered Options

- PostgreSQL: integrity, SQL reporting, familiar operations; migrations required.
- MongoDB: flexible schema; weaker fit for consistency and joins.

## Decision

We will use PostgreSQL because consistency, joins, and operational familiarity matter more than schema flexibility.

## Consequences

- Positive: Integrity and reporting align with needs.
- Negative: Schema changes need migrations.
- Follow-up: Define migration practice.
```

## Common Mistakes

| Mistake | Fix |
| --- | --- |
| Several decisions in one ADR | Split them. |
| Sales pitch | Include rejected options and negative consequences. |
| Invented context | Mark unknowns or ask. |
| Treating status as decoration | Use status to show lifecycle and link superseding ADRs. |
| Rewriting history | Keep old ADR; create/link superseding ADR. |
| Omitting alternatives under pressure | Include at least the rejected option and why it lost. |

## Sources

adr.github.io: home, ADR templates, AD practices. See `templates/` for captured template variants.

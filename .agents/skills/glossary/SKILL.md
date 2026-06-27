---
name: glossary
description: Use when authoring or reviewing specifications, requirements, design docs, decision records, implementation plans, domain terminology, technical terms, glossary entries, or wording consistency across related artifacts
---

# Glossary

## Overview

Use this skill to keep domain and technical terminology consistent while authoring or reviewing specification artifacts.

The goal is higher information density: artifacts can use precise shared terms because those terms are defined once in the repository glossary.

OpenSpec artifacts such as `proposal.md`, `spec.md`, `design.md`, `adr.md`, and `tasks.md` are one example. The skill applies equally to other specification, requirements, design, decision, and planning documents.

## Required Files

Project glossary files should live at the repository root when the project needs them:

| File | Purpose |
| --- | --- |
| `glossary/business.md` | Domain, product, user, workflow, and business terms |
| `glossary/technical.md` | Architecture, implementation, tool, platform, and protocol terms |

Do not assume these files already exist. If a glossary is needed and either file is missing, create it from the reference templates in this skill folder:

- `.agents/skills/glossary/business-template.md`
- `.agents/skills/glossary/technical-template.md`

## Workflow

1. Identify the specification artifact being authored or reviewed.
2. Check whether `glossary/business.md` and `glossary/technical.md` exist at the repository root.
3. If glossary files are needed but missing, create them from the skill reference templates.
4. Read the relevant glossary files before editing or reviewing the artifact.
5. Extract terms from the artifact that are domain-specific, technical, overloaded, abbreviated, ambiguous, or repeatedly used.
6. Compare extracted terms with existing glossary entries.
7. Update glossary files when a useful term is missing or an existing definition needs clearer wording.
8. Suggest updates to the artifact itself so it uses glossary terms consistently.
9. Do not add generic dictionary words or one-off implementation details.

## Entry Format

Use this table format for both glossary files:

```markdown
| Term | Definition | Use When | Avoid |
| --- | --- | --- | --- |
| Capability | One concise sentence defining the term in this repository. | Where this term should appear in specifications, requirements, design docs, decision records, or plans. | Near-synonyms, overloaded alternatives, or wording that should not be used. |
```

Keep definitions short. If a definition needs multiple paragraphs, the term is probably hiding a decision, requirement, or design detail that belongs in a specification artifact.

## Review Checklist

When reviewing an artifact against the glossary, report:

- Missing terms that should be added to `glossary/business.md` or `glossary/technical.md`.
- Existing glossary terms used inconsistently in the artifact.
- Artifact wording that should change to match glossary terminology.
- Glossary entries that are stale, unclear, duplicated, or too broad.

## Common Mistakes

| Mistake | Fix |
| --- | --- |
| Defining every noun | Define only terms that carry project-specific meaning. |
| Updating glossary but not artifact text | Also suggest or apply changes to the artifact being authored. |
| Adding synonyms as separate terms | Pick one preferred term and list alternatives under `Avoid`. |
| Treating glossary as design documentation | Keep definitions concise; put decisions and trade-offs in design or decision artifacts. |

## Example Review Output

```markdown
Glossary updates:
- Add `Capability` to `glossary/business.md` as an observable behavior area owned by a specification.
- Add `Decision Record` to `glossary/technical.md` as a durable record of an architectural or technical decision.

Artifact updates:
- Replace "feature area" with "Capability" in `proposal.md` to match the glossary.
- Replace "architecture note" with "Decision Record" in `design.md` to match the glossary.
```

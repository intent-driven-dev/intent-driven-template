---
name: glossary
description: Maintain project terminology and companion references when explicitly asked to use the glossary skill.
---

# Glossary

Apply this workflow only when a direct request or an applicable workflow rule
explicitly asks to use the `glossary` skill by name. Apply it only to the requested
artifact or artifacts. Routine drafting, editing, reviewing, and passing mentions
of a glossary do not activate the skill.

Use existing repository terms before creating new ones.

## Workflow

1. Identify the artifact being authored or reviewed.
2. Read `glossary/business.md` and/or `glossary/technical.md` when present.
3. Extract project-specific, technical, overloaded, ambiguous, or repeated concepts.
4. Compare extracted concepts with existing glossary terms.
5. If existing terms look close, ask the user whether to reuse one or define a new term.
6. Use the chosen term consistently in the artifact.
7. Add new terms to the appropriate glossary file.
8. For non-glossary artifacts, create or update the artifact's companion glossary reference document.

Do not add generic dictionary words or one-off implementation details.

## Glossary Files

- `glossary/business.md`: domain, product, workflow, and business terms.
- `glossary/technical.md`: architecture, implementation, platform, and protocol terms.

If a needed glossary file is missing, create it with this table:

```markdown
| Term | Definition | Use When | Avoid |
| --- | --- | --- | --- |
```

New entries use the same table format. Keep definitions to one concise sentence.

## Close-Term Question

Ask before creating a new term when existing terms may fit:

```text
These glossary terms look close to "<concept>":

- `<existing-term>`: <why it may fit>
- `<another-term>`: <why it may fit>

Do you want to use one of these existing terms, or define a new term?
```

Do not proceed with a new term until the user answers, unless no plausible existing term exists.

## Marking Terms in Artifacts

In non-glossary artifacts, such as proposals, designs, specs, ADRs, and tasks, bold glossary terms that appear in the artifact's companion glossary reference.

Apply bolding in prose only. Do not bold terms in code blocks, frontmatter, links, or places where markdown formatting would make the artifact harder to read.

## Companion Reference

Every authored or edited non-glossary artifact gets a companion file in the same directory.

Do not create companion glossary reference files for glossary source files themselves, such as `glossary/business.md` or `glossary/technical.md`.

Name: remove `.md`, then append `-glossary-reference.md`.

Examples: `proposal-glossary-reference.md`, `design-glossary-reference.md`, `spec-glossary-reference.md`, `adr-glossary-reference.md`, `tasks-glossary-reference.md`.

Format:

```markdown
# Glossary Reference

| Term | Source Glossary | Context |
| --- | --- | --- |
| <Term> | `glossary/business.md` | <Short context for how the artifact uses this glossary term.> |
```

`Source Glossary` is the glossary file the term came from or was added to, such as `glossary/business.md` or `glossary/technical.md`.

If no glossary terms are used, write:

```markdown
# Glossary Reference

No glossary terms referenced.
```

Do not copy definitions into companion files.

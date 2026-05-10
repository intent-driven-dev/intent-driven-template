# Intent-Driven OpenSpec Schema

`intent-driven` is a proposal-to-tasks workflow for changes where contributor
intent, observable behaviour, technical design, and durable architectural
decisions should all be captured before implementation.

It keeps specs mergeable by default OpenSpec archive by generating
`specs/<capability>/spec.md` files. The Markdown headings are the OpenSpec
wrapper; the content inside each requirement and scenario should be written in
Gherkin style with `GIVEN`, `WHEN`, and `THEN` steps.

- Good fit: product or platform changes with meaningful behaviour and
  long-lived design decisions, cross-module work, or architecture choices that
  future changes should honor.
- Not a good fit: small tactical fixes, docs-only changes, dependency bumps, or
  behaviour-only work where `behaviour-driven` is enough.

## Activate

Set this in `openspec/config.yaml`:

```yaml
schema: intent-driven
```

## Stage Gates

Artifact order:

```text
proposal -> specs -> design -> adr -> tasks
```

Gate expectations:

- `proposal` states why the change matters and lists the capabilities that need
  behaviour specs.
- `specs` creates one OpenSpec Markdown delta file per capability at
  `specs/<capability>/spec.md`.
- `design` explains the implementation approach and accounts for currently
  in-force ADRs.
- `adr` records durable architecture decisions after design and before task
  planning.
- `tasks` are planned only after proposal, specs, design, and ADR artifacts are
  complete.

## Spec Format

Use OpenSpec Markdown delta headers so archive can merge the change:

```md
## ADDED Requirements

### Requirement: User data export
Feature: User data export

Rule: Users can export their own data

#### Scenario: Successful CSV export
- **GIVEN** a user has saved data
- **WHEN** the user exports their data as CSV
- **THEN** the system provides a CSV file containing the user's data
```

Do not create `.feature` files for this schema. External Gherkin linting can be
run by the target project, but the schema package intentionally does not include
Gherkin lint configuration.

## ADR Persistence

ADR files are generated under the target repository's top-level `adr/` folder,
not inside the OpenSpec change folder. Accepted ADRs are immutable. If a future
decision changes a prior ADR, create a new ADR that supersedes the old one and
leave the original file unchanged.

## Validate

```bash
openspec schema validate intent-driven
```

For more schemas, refer to https://github.com/intent-driven-dev/openspec-schemas.

---
name: gherkin-authoring
description: Use when drafting, reviewing, or improving Gherkin, Cucumber scenarios, BDD acceptance criteria, feature examples, Scenario Outlines, Backgrounds, Rules, Doc Strings, Data Tables, tags, or Gherkin embedded in Markdown.
---

# Gherkin Authoring

## Overview

Write Gherkin as executable examples of business behavior. Optimize for domain language, concrete examples, and observable outcomes; keep implementation and UI mechanics inside step definitions.

## Scope

Use this for standalone `.feature` files and Gherkin embedded in Markdown or other prose. When Gherkin is inside a Markdown wrapper, review or rewrite only the Gherkin section unless the user asks for broader document edits. Preserve fences, headings, and surrounding prose. If the input includes Markdown around the Gherkin, return the Markdown wrapper with only the Gherkin block changed.

## Workflow

1. Identify the Gherkin region: whole `.feature` file, fenced `gherkin` block, indented block, quoted acceptance criteria, or inline scenario text.
2. Preserve the surrounding wrapper unless explicitly asked to change it. For Markdown input, return the heading/prose/fence context, not just the fenced Gherkin block.
3. Clarify the behavior as examples: initial state, event, observable outcome.
4. Choose the smallest structure that expresses the behavior: `Feature`, optional `Rule`, `Background`, `Scenario`/`Example`, or `Scenario Outline` with `Examples`.
5. Keep scenarios concrete and short, usually 3-5 steps.
6. Review syntax and readability before returning: colons, step keywords, duplicate step text, observable outcomes, and table/doc string formatting.

## Quick Reference

| Construct | Use for | Syntax note |
| --- | --- | --- |
| `Feature:` | One high-level capability per feature document or block | Requires `:` |
| `Rule:` | Group scenarios under one business rule | Requires `:` |
| `Scenario:` / `Example:` | One concrete example | Requires `:` |
| `Background:` | Short shared context for following scenarios | Requires `:`; one per `Feature` or `Rule` |
| `Scenario Outline:` | Same behavior with varied data | Requires `Examples:` and `<parameter>` placeholders |
| `Examples:` | Data rows for an outline | Requires `:` and a table |
| `Given` | Known state or precondition | No `:` |
| `When` | Event or action | No `:` |
| `Then` | Observable outcome | No `:` |
| `And` / `But` | Continue the previous step type | No `:` |
| `*` | Bullet-like step list | Use sparingly for list-style setup |
| `@tag` | Group or filter features/scenarios | Place above the item tagged |
| `#` | Line comment | Line comments only; no block comments |
| `"""` | Doc String | Passed as final step argument |
| `|` | Data Table | Passed as final step argument |

## Authoring Rules

- Use the language domain experts use. Avoid translating business behavior into UI clicks, HTTP calls, database rows, queues, mocks, or implementation details.
- `Given` puts the system in a known state. Avoid user interaction in `Given` steps.
- `When` describes one meaningful event.
- `Then` describes an outcome visible to a user or external system. Do not assert hidden database state unless that is the actual external contract.
- Use `And` and `But` to improve flow, not to hide new phases of the scenario.
- Avoid identical step text under different step keywords; Cucumber ignores `Given`/`When`/`Then` when matching step definitions.
- Use two-space indentation unless preserving existing style.
- Keep `Background` short and vivid. If it grows beyond about four lines, use higher-level steps or split by `Rule`/`Feature`.
- Use `Scenario Outline` only when examples share the same behavior and differ by data.
- Escape `|` as `\|`, newline as `\n`, and backslash as `\\` inside Data Table cells.

## Example

Markdown wrapper preserved; only the Gherkin block is authored:

````markdown
## Acceptance Criteria

```gherkin
Feature: Password reset
  Rule: Reset links expire after their allowed lifetime

    Scenario: Customer resets their password before the link expires
      Given Priya has requested a password reset
      And the reset link is still valid
      When Priya chooses a new password with the reset link
      Then she can sign in with the new password

    Scenario: Customer uses an expired reset link
      Given Priya has requested a password reset
      And the reset link has expired
      When Priya tries to choose a new password with the reset link
      Then she is told the reset link has expired
      And her password is unchanged
```
````

## Common Mistakes

| Mistake | Fix |
| --- | --- |
| Complaining about Markdown around a Gherkin block | Preserve the wrapper and work only on the Gherkin section. |
| Returning only a fenced Gherkin block when the input was Markdown | Return the original Markdown wrapper with only the Gherkin content changed. |
| `Feature Checkout` or `Scenario: Place order:` | Add the missing colon after `Feature`; remove extra colon from the scenario title. |
| `Given I click the checkout button` | Move interaction to `When`; describe state in `Given`. |
| `Then an order row exists in the database` | Prefer an observable result, such as an order confirmation. |
| Reusing the same step text for `Given` and `Then` | Change the wording so the domain meaning is distinct. |
| Long scripts with many UI actions | Raise the abstraction and keep the scenario to the behavior. |
| Large `Background` sections | Use higher-level context or split scenarios by `Rule` or `Feature`. |

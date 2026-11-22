## 1. Acceptance setup

- [x] 1.1 Confirm the acceptance stack in `openspec/config.yaml` and configure it if needed.
- [ ] 1.2 Set up a bootable application skeleton and an independent acceptance-test project using the selected stack.
- [ ] 1.3 Configure the spec-as-source extractor, runner, Gherkin lint, HTML reporting, generated-file exclusions, and run instructions using the acceptance-test-authoring skill.

## 2. Voting scenarios

- [ ] 2.1 Establish failing acceptance steps for an existing poll with an option, then provide the test setup needed to create that state.
- [ ] 2.2 Establish a failing vote submission step, then implement the poll page and server-side submission and validation.
- [ ] 2.3 Establish failing confirmation and total steps, then persist individual votes and derive totals from them, treating missing vote collections as empty.
- [ ] 2.4 Establish a failing step for a previously cast vote, then provide the test setup needed to create that state.
- [ ] 2.5 Establish failing duplicate rejection and unchanged-vote steps, then enforce per-poll email uniqueness and preserve the original vote.
- [ ] 2.6 Establish failing steps for a vote in another poll, then ensure email uniqueness is scoped to each poll.
- [ ] 2.7 Establish failing vote-change and rejection steps, then ensure accepted votes cannot be modified.
- [ ] 2.8 Verify concurrent submissions and retries preserve one accepted vote per poll and email, using serialized JSON updates and atomic replacement as described in the accepted ADR.

## 3. Completion

- [ ] 3.1 Run the full acceptance suite with no pending or undefined steps, generate its HTML report, and run the Gherkin lint.
- [ ] 3.2 Run `openspec validate add-poll-voting --type change --strict` and resolve applicable findings before archive.

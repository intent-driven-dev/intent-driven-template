## Why

PollCast participants need a way to vote in an existing poll. Limiting each email address to one final vote per poll keeps repeat submissions from changing the result.

## What Changes

- Let a participant submit a vote for an option in an existing poll using their email address.
- Use the email address as the unique voter identifier within each poll. Reject a second submission from the same address for that poll, even if it selects a different option.
- Make each accepted vote final once it is cast.

## Capabilities

### New Capabilities

- `poll-voting` — Casting a vote in an existing poll, enforcing one vote per email address per poll, and keeping accepted votes final.

### Modified Capabilities

## Impact

- Poll voting interface and server-side vote submission.
- Vote storage and duplicate detection within each poll.

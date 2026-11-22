## Context

PollCast uses a server-rendered Express application and a JSON file store. The repository currently contains planning infrastructure and no application implementation or existing ADRs. Participants need to select an option in an existing poll and identify themselves by email. Each accepted vote is final and each email can vote once per poll.

## Goals / Non-Goals

**Goals:**

- Accept and confirm a valid vote, reject duplicates, and preserve accepted votes.
- Keep vote totals consistent with accepted votes, including concurrent submissions and retries.
- Support polls created before voting data exists.

**Non-Goals:**

- Poll creation and changes to poll configuration.
- Authentication or verification of email ownership.

## Decisions

### Submit votes through the poll page

Render the existing poll's options with an email field and submit the selection to an Express handler. The server validates the poll, option, and email before recording a vote and displays confirmation or an actionable rejection. Server-side checks remain authoritative for direct submissions. A client-only check would be bypassable.

### Store individual votes with each poll

Represent each accepted vote with its poll, option, and email identity. Derive totals from accepted votes so a duplicate cannot increase a separate counter. Treat absent vote collections on existing polls as empty. Aggregate-only counts were considered but cannot enforce uniqueness or preserve the selected option for each voter.

Trim surrounding whitespace and compare email addresses case-insensitively for duplicate detection. Do not collapse provider-specific aliases. This gives consistent matching for common spelling variants while avoiding assumptions about mailbox providers. The precise email validation rules should be shared by the form and server where practical.

### Serialize file updates

Within a single application process, serialize the complete read, duplicate check, and write operation for the JSON store. Persist a complete replacement through a temporary file and atomic rename, and report success only after persistence succeeds. A retry after success is rejected as a duplicate. Multiple application processes writing the same file require a shared interprocess lock or a transactional store before deployment in that configuration. An unlocked read-modify-write can lose votes or accept duplicates.

Expose only vote creation through the application and reject subsequent submissions for the same poll and email. Do not provide a vote update operation. The stored vote remains unchanged when a duplicate is rejected.

## Risks / Trade-offs

- Email addresses are self-reported, so one person can vote with multiple addresses or use someone else's address. Email ownership verification is outside this change.
- A JSON file and serialized writes limit throughput. Move to transactional storage when deployment or load requires it, preserving the per-poll uniqueness and finality rules.
- A lost response after a successful write leaves the participant seeing a duplicate on retry. The rejection should explain that a vote has already been recorded.

## Migration Plan

Read missing vote collections as empty, retaining existing poll data. Deploy the voting handler and page together, and back up the JSON store before changing its format. On rollback, retain the updated store and accepted votes so a later deployment can recover them. Confirm older application versions can read the expanded format before using them for rollback.

## Open Questions

- The existing poll data structure and deployment topology need confirmation during implementation. The file-write strategy must enforce uniqueness across every writer in the actual deployment.

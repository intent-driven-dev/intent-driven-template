# Use JSON file storage

- Status: accepted
- Date: 2026-11-22

## Context and Problem Statement

PollCast needs persistent storage for polls and their votes. The project starts with a JSON file store, and vote submission must preserve accepted votes and enforce one vote per email address per poll.

## Considered Options

- Store poll and vote data in a JSON file.
- Store poll and vote data in a transactional database.

## Decision Outcome

Use JSON file storage initially, consistent with the project stack. Serialize each read, duplicate check, and write within the application process, and replace the file atomically. A deployment with multiple writers requires shared interprocess coordination or transactional storage.

### Consequences

- The initial deployment has a simple storage setup.
- Serialized file writes limit throughput, and multiple writers require additional coordination.
- A later move to a transactional store must preserve accepted votes and per-poll email uniqueness.

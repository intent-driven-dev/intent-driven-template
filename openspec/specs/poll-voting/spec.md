# poll-voting Specification

## Purpose

Let participants cast a vote in an existing poll using their email address, allow one final vote per email address per poll, and keep accepted votes unchanged.

## Requirements

### Requirement: Cast a vote

The system SHALL allow a participant to cast a vote for an option in an existing poll using an email address, and SHALL confirm an accepted vote.

#### Scenario: Vote in an existing poll

```gherkin
Given an existing poll "Lunch" has the option "Soup"
When a participant votes for "Soup" in "Lunch" using "alex@example.com"
Then the vote is accepted and confirmed
And "Soup" has one vote in "Lunch"
```

### Requirement: One vote per email address per poll

The system SHALL reject a further vote using an email address that has already voted in the same poll, and SHALL preserve the original vote.

#### Scenario: Repeat submission for a different option

```gherkin
Given "alex@example.com" has voted for "Soup" in the poll "Lunch"
When a participant votes for "Salad" in "Lunch" using "alex@example.com"
Then the vote is rejected as a duplicate
And the vote for "Soup" remains unchanged
```

#### Scenario: Vote in another poll

```gherkin
Given "alex@example.com" has voted in the poll "Lunch"
And an existing poll "Dinner" has the option "Pasta"
When a participant votes for "Pasta" in "Dinner" using "alex@example.com"
Then the vote is accepted and confirmed
```

### Requirement: Votes are final

The system SHALL prevent modification of an accepted vote.

#### Scenario: Attempt to change a vote

```gherkin
Given "alex@example.com" has voted for "Soup" in the poll "Lunch"
When a participant attempts to change that vote to "Salad"
Then the change is rejected
And the vote for "Soup" remains unchanged
```

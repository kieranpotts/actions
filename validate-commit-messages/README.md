# Validate commit messages

This action validates the format of commit messages. The action checks all commits added since the last push.

Commit message conventions are defined in [TS-9: Version Control](https://github.com/kieranpotts/standards/tree/dev/src/009). Commit messages are expected to follow this format:

```
<type>: <description>

Optional body and/or trailers.
```

Where `<type>` is one of the following:

**Standard revision types (for code/executable repositories)**:

- `behavior`: User-facing operation change.
- `quality`: Change to a dynamic quality attribute (latency, availability, security, etc.), observable outside the system.
- `fix`: Defect resolution (bug, regression, vulnerability, incident).
- `step`: Incremental change toward a larger behavior change or fix (not yet user-facing).
- `refactor`: Improvement to internal structure without behavioral change.
- `style`: Presentation-only code changes (whitespace, formatter runs).
- `maintenance`: Required upkeep (dependencies, CI, documentation, security patches).
- `chore`: Small, insignificant housekeeping.
- `release`: Version bumps and release-preparation commits.
- `merge`: Merge commits (when not fast-forwarded away).
- `revert`: Reverting a prior commit.

**Extended revision types (for non-executable content repositories)**, usable
in conjunction with the standard set above:

- `create`: New content — new documents, sections, or substantial new material.
- `update`: Edits to existing content.
- `delete`: Removal of outdated or redundant content.

I've also published a [pre-commit-hook](https://github.com/kieranpotts/pre-commit-hooks/blob/dev/hooks/validate_commit_message.py), compatible with the [pre-commit framework](https://pre-commit.com/), that does the same checks at time of commit.

## Usage

```yaml
name: Validate commit messages

on:
  push:
    branches:
      - dev

jobs:
  validate-commit-messages:
    name: Validate commit messages on the trunk
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Validate new commit messages
        uses: kieranpotts/actions/validate-commit-messages@latest/dev
```

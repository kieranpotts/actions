# Validate commit messages

This action validates the format of commit messages. The action checks all commits added since the last push.

Commit message conventions are defined in [TS-3: Version Control](https://github.com/kieranpotts/standards/tree/main/ts/003/). Commit messages are expected to follow this format:

```
<type>: <description>

Optional body and/or trailers.
```

Where `<type>` is one of the following:

**Standard revision types (for code/executable repositories)**:

- `feature`: User-facing operation or behavior change.
- `performance`: External runtime optimization.
- `fix`: Defect resolution (bug, regression, vulnerability, incident).
- `step`: Incremental change toward a larger feature or fix (not yet user-facing).
- `refactor`: Improvement to internal structure without behavioral change.
- `format`: Presentation-only code changes (whitespace, style).
- `maintenance`: Required upkeep (dependencies, CI, documentation, security patches).
- `chore`: Small, insignificant housekeeping.
- `release`: Version bumps and release-preparation commits.
- `merge`: Merge commits (when not fast-forwarded away).
- `revert`: Reverting a prior commit.

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
        uses: kieranpotts/actions/validate-commit-messages@dev
```

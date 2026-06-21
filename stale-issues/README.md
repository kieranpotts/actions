# Stale issues

This action checks all open issues in a repository and applies a warning label, and an optional comment, the first time each age threshold is crossed. It is designed to be run on a schedule.

## Inputs

| Input         | Description                    | Default          |
|---------------|--------------------------------|------------------|
| `token`       | GitHub token                   | -                |
| `threshold-1` | Days before the first warning  | `90`             |
| `threshold-2` | Days before the second warning | -                |
| `threshold-3` | Days before the third warning  | -                |
| `label-1`     | Label for first threshold      | `age: 3 months`  |
| `label-2`     | Label for second threshold     | `age: 6 months`  |
| `label-3`     | Label for third threshold      | `age: 12 months` |
| `comment-1`   | Comment at first threshold     | _(none)_         |
| `comment-2`   | Comment at second threshold    | _(none)_         |
| `comment-3`   | Comment at third threshold     | _(none)_         |

The GitHub token is required and must have read/write permission on issues.

By default, only the first threshold is active (90 days), applying the label `age: 3 months` with no comment. The second and third thresholds are disabled unless explicitly configured.

Age is measured from when the issue was created (`created_at`). The action is idempotent. Once a threshold label has been applied, no further notifications are sent for that threshold.

Labels are created automatically if they do not already exist in the repository.

Comments are optional. If a threshold is configured with a corresponding comment, the comment will be added to the issue's thread when the theshold is passed.

## Usage

```yaml
name: Flag stale issues

on:
  schedule:
    - cron: '0 9 * * 1'  # Every Monday at 09:00 UTC.

jobs:
  stale-issues:
    name: Check for stale issues
    runs-on: ubuntu-latest
    steps:
      - name: Check for stale issues
        uses: kieranpotts/actions/stale-issues@latest/dev
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
```

With custom thresholds and labels:

```yaml
      - name: Check for stale issues
        uses: kieranpotts/actions/stale-issues@latest/dev
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          threshold-1: '60'
          threshold-2: '120'
          threshold-3: '240'
          label-1: 'stale: 2 months'
          label-2: 'stale: 4 months'
          label-3: 'stale: 8 months'
```

With comments for the first two thresholds only:

```yaml
          comment-1: 'Is this issue still relevant?'
          comment-2: 'Is this issue still relevant? It was opened 6 months ago.'
          comment-3: '' # Disabled.
```

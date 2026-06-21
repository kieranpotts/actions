# GitHub Actions

My custom actions for reuse in GitHub Actions CI/CD pipelines.

## Usage

```yaml
name: Commit validation

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

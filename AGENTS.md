# GitHub Actions

My custom actions for reuse in GitHub Actions CI/CD pipelines. Each
subdirectory at the repo root is one standalone, independently versioned
action, referenced by consumers as `kieranpotts/actions/<name>@<ref>`.

The capitalized words REQUIRED, MUST, MUST NOT, RECOMMENDED, SHOULD,
SHOULD NOT, OPTIONAL, and MAY are to be interpreted as described in
[IETF RFC 2119](https://www.ietf.org/rfc/rfc2119.txt).

## Tech stack

- GitHub Actions (`action.yaml` metadata files).
- Composite actions written in Bash. `change-string-case` uses a plain
  shell/JS mix; most others are pure `composite` steps with inline `bash`.
- `change-string-case`, `select-from`, and `stale-issues` are JavaScript
  actions using `@actions/core`, with dependencies checked into
  `node_modules/`. There is no build step; `index.js` is run directly by
  Node.
- `json-validate` is a Docker container action: Python 3.8 (`validate.py` +
  `jsonschema`) wrapped in a `Dockerfile`/`entrypoint.sh`.
- `pre-commit` (via [kieranpotts/pre-commit-hooks](https://github.com/kieranpotts/pre-commit-hooks))
  for commit-message validation.

## Project structure

- `change-string-case/`, `hosts-entry/`, `json-validate/`, `select-from/`,
  `ssh-cmd/`, `sslyze/`, `stale-issues/`, `validate-commit-messages/` \
  One action per directory. Each has its own `action.yaml` and `README.md`
  documenting its inputs/outputs/usage.

- `.github/workflows/` \
  One workflow per action, used to self-test/dogfood that action on this
  repo (e.g. `validate-commit-messages.yaml` runs
  `validate-commit-messages` against this repo's own commits).

## Rules

- MUST keep each action self-contained in its own directory, with its own
  `action.yaml` and `README.md` — consumers reference actions by path
  (`kieranpotts/actions/<name>@<ref>`), so an action's files MUST NOT
  depend on files outside its own directory.

- MUST commit `node_modules/` for JavaScript actions (`change-string-case`,
  `select-from`, `stale-issues`) — GitHub Actions runs `index.js` directly
  with no install step, so dependencies must be present in the repo.

- MUST follow the commit message format enforced by
  `validate-commit-messages` and `.pre-commit-config.yaml`: `<type>:
  <description>`, where `<type>` is one of `chore`, `feature`, `fix`,
  `maintenance`, `merge`, `refactor`, `revert`, `runtime`,
  `step`, `style`, `version`.

## References

The following technical standards (TS) govern this project. Fetch and ingest
the relevant standards as-and-when required for the task at hand.

- [**TS-9: Version Control**](https://kieranpotts.com/standards/009) \
  Use when working with Git. Covers commits, branching, merging, integration
  strategies, cutting releases, and configuring Git/PR/CI tooling.

- [**TS-32: Bash**](https://kieranpotts.com/standards/032) \
  Use when authoring or modifying scripts that target Bash specifically, and
  which use Bash extensions ("Bashisms").

- [**TS-35: Python**](https://kieranpotts.com/standards/035) \
  Use when writing, reviewing, or refactoring Python code.

- [**TS-36: ECMAScript (JavaScript/TypeScript)**](https://kieranpotts.com/standards/036) \
  Use when writing or reviewing JavaScript or TypeScript source code. Covers
  syntax, modules, async programming, functional patterns, and testing.

- [**TS-58: Docker**](https://kieranpotts.com/standards/058) \
  Use when designing Dockerfiles, building Docker images, or running Docker
  containers.

- [**TS-60: GitHub Actions**](https://kieranpotts.com/standards/060) \
  Use when designing, authoring, reviewing, or securing GitHub Actions workflows
  or custom actions.

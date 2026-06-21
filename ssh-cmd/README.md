# SSH Command

Run a script over SSH.

## Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| host | string | | The host string |
| command | string | | The command string |

## Usage

```yaml
runs:
  using: composite
  steps:
    - uses: kieranpotts/actions/ssh-cmd@latest/dev
      with:
        host: user@some.hostname.com
        command: echo "Hello, world!"
```

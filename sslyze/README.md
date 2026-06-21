# SSLyze

Scan a URL with SSLyze. See [the project page](https://pypi.org/project/sslyze/) on PyPI for more information.

## Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| url | string | | The URL to scan with SSLyze |
| config | string | intermediate | The Mozilla SSLyze configuration to use: modern, intermediate, old |

## Usage

```yaml
steps:
  - uses: kieranpotts/actions/sslyze@latest/dev
    with:
      url: https://example.com
      config: modern
```

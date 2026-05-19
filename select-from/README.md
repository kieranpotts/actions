# Select-from

This action selects a value from a list of key/value pairs, so the value can be used in subsequent steps. Typically used to build workflow inputs.

## Inputs

| Name | Type | Description |
|------|------|-------------|
| select | string | The item to select |
| from | string | The list of key/value pairs, separated by the = sign |
| default | string | The default value |

## Outputs

| Name | Type | Description |
|------|------|-------------|
| value | string | The selected value |

## Usage

```yaml
steps:
  - id: select-environment
    uses: kieranpotts/actions/select-from@dev
    with:
      select: ${{ inputs.environment }}
      from: |
        dev=development
        test=staging
        prod=production
  - run: echo "Selected environment: ${{ steps.select-environment.outputs.value }}"
```

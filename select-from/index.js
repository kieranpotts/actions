'use strict'

const core = require('@actions/core')

async function main() {
  try {
    let outputValue = core.getInput('default')

    const select = core.getInput('select')
    const from = core.getInput('from')

    from.split(/\r?\n/).forEach((row) => {
      const [key, value] = row.split(/=(.*)/, 2)
      if (key === select) {
        outputValue = value
      }
    })

    console.log(`Selected value: ${outputValue}`)
    core.setOutput('value', outputValue)
  } catch(error) {
    core.setFailed(error.message)
  }
}

main()


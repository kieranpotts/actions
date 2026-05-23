'use strict'

const core = require('@actions/core')
const github = require('@actions/github')

/**
 * @typedef {Object} Threshold
 * @property {number} days - Minimum issue age in days before this threshold fires.
 * @property {string} label - Label to apply when the threshold is first crossed.
 * @property {string} comment - Comment body to post; empty string disables commenting.
 */

/**
 * Reads the three threshold configurations from action inputs and drops any
 * that are effectively disabled — either unset (empty string parses to NaN)
 * or explicitly set to zero or a negative number.
 *
 * @returns {Threshold[]}
 */
function readThresholds() {
  return [
    {
      days: parseInt(core.getInput('threshold-1'), 10),
      label: core.getInput('label-1'),
      comment: core.getInput('comment-1'),
    },
    {
      days: parseInt(core.getInput('threshold-2'), 10),
      label: core.getInput('label-2'),
      comment: core.getInput('comment-2'),
    },
    {
      days: parseInt(core.getInput('threshold-3'), 10),
      label: core.getInput('label-3'),
      comment: core.getInput('comment-3'),
    },
  ].filter(t => t.days)
}

/**
 * Ensures every threshold label exists in the repository, creating any that
 * are missing. This avoids a separate manual setup step for first-time users.
 *
 * @param {import('@octokit/core').Octokit} octokit
 * @param {string} owner
 * @param {string} repo
 * @param {Threshold[]} thresholds
 *
 * @returns {Promise<void>}
 */
async function ensureLabelsExist(octokit, owner, repo, thresholds) {
  const existing = new Set(
    (await octokit.paginate(octokit.rest.issues.listLabelsForRepo, {
      owner,
      repo,
      per_page: 100,
    })).map(l => l.name)
  )

  for (const threshold of thresholds) {
    if (!existing.has(threshold.label)) {
      await octokit.rest.issues.createLabel({
        owner,
        repo,
        name: threshold.label,
        color: 'e4e669',
      })
      core.info(`Created label: "${threshold.label}"`)
    }
  }
}

/**
 * Fetches all open issues in the repository, excluding pull requests (which
 * are returned by the same API endpoint but carry a `pull_request` field).
 *
 * @param {import('@octokit/core').Octokit} octokit
 * @param {string} owner
 * @param {string} repo
 *
 * @returns {Promise<Object[]>}
 */
async function fetchOpenIssues(octokit, owner, repo) {
  const all = await octokit.paginate(octokit.rest.issues.listForRepo, {
    owner,
    repo,
    state: 'open',
    per_page: 100,
  })
  return all.filter(issue => !issue.pull_request)
}

/**
 * Applies a threshold label to an issue and, if configured, posts a comment.
 * Both operations are skipped if the label is already present, making the
 * action safe to run on a recurring schedule.
 *
 * @param {import('@octokit/core').Octokit} octokit
 * @param {string} owner
 * @param {string} repo
 * @param {Object} issue - Issue object from the GitHub API.
 * @param {Threshold} threshold
 * @param {number} ageDays - Calculated age of the issue in fractional days.
 *
 * @returns {Promise<void>}
 */
async function notifyThreshold(octokit, owner, repo, issue, threshold, ageDays) {
  await octokit.rest.issues.addLabels({
    owner,
    repo,
    issue_number: issue.number,
    labels: [threshold.label],
  })
  core.info(`Issue #${issue.number}: applied label "${threshold.label}" (age: ${Math.floor(ageDays)} days)`)

  if (threshold.comment) {
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: issue.number,
      body: threshold.comment,
    })
  }
}

/**
 * Entry point. Reads inputs, checks every open issue against each threshold,
 * and fires notifications for any threshold crossed since the last run.
 *
 * @returns {Promise<void>}
 */
async function main() {
  const token = core.getInput('token', { required: true })
  const octokit = github.getOctokit(token)
  const { owner, repo } = github.context.repo

  const thresholds = readThresholds()
  const now = Date.now()

  await ensureLabelsExist(octokit, owner, repo, thresholds)

  const issues = await fetchOpenIssues(octokit, owner, repo)
  core.info(`Checking ${issues.length} open issues`)

  for (const issue of issues) {
    const ageDays = (now - new Date(issue.created_at).getTime()) / (1000 * 60 * 60 * 24)
    const issueLabels = new Set(issue.labels.map(l => l.name))

    for (const threshold of thresholds) {
      if (ageDays >= threshold.days && !issueLabels.has(threshold.label)) {
        await notifyThreshold(octokit, owner, repo, issue, threshold, ageDays)
      }
    }
  }
}

main().catch(error => core.setFailed(error.message))

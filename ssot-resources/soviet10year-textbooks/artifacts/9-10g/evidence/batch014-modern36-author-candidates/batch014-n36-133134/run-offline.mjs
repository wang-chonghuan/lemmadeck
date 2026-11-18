import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
assert.equal(process.cwd(), repo)
const batch = path.join(repo, '.tmp/s10y-image/batch014-n36-133134')
const script = path.join(batch, 'offline-display-check.mjs')
const startedAt = new Date().toISOString()
const call = spawnSync('node', [script], { cwd: repo, encoding: 'utf8' })
const report = {
  schema: 'bounded-offline-display-call@1',
  command: ['node', script], workdir: repo, startedAt, finishedAt: new Date().toISOString(),
  scriptSha256: crypto.createHash('sha256').update(fs.readFileSync(script)).digest('hex'),
  exitCode: call.status, stdout: call.stdout, stderr: call.stderr,
  imagePayloadsLoadedIntoAuthorContext: 0, figureRendererCalls: 0, paidCalls: 0,
}
fs.writeFileSync(path.join(batch, 'offline-display.call.json'), JSON.stringify(report, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify(report, null, 2))
process.exitCode = call.status ?? 1

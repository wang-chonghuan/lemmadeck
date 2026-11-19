import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/d9b1/lemmadeck'
assert.equal(process.cwd(), repo)
const directory = path.join(repo, '.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n43-modern-author')
const receipt = path.join(directory, 'check-command-FIRST.json')
assert.equal(fs.existsSync(receipt), false, 'Never overwrite the FIRST receipt')
const command = [process.execPath, path.join(directory, 'collect-evidence.mjs'), 'outputs']
const startedAt = new Date().toISOString()
const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8' })
const hash = (value) => createHash('sha256').update(value).digest('hex')
fs.writeFileSync(receipt, `${JSON.stringify({
  cwd: repo,
  command,
  startedAt,
  finishedAt: new Date().toISOString(),
  exit: result.status,
  signal: result.signal,
  error: result.error?.message ?? null,
  stdout: result.stdout,
  stderr: result.stderr,
  checkerSha256: hash(fs.readFileSync(command[1])),
  wrapperSha256: hash(fs.readFileSync(import.meta.filename)),
}, null, 2)}\n`, { flag: 'wx', mode: 0o444 })
process.stdout.write(result.stdout ?? '')
process.stderr.write(result.stderr ?? '')
process.exitCode = result.status ?? 1

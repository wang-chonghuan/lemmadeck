import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const own = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d942-n87-display-composition')
const started = path.join(own, 'FIRST-started.json')
assert.ok(!fs.existsSync(started), 'Do not replay the FIRST composition')
const command = [process.execPath, path.join(own, 'compose-once.mjs')]
fs.writeFileSync(started, JSON.stringify({ command, cwd: repo, at: new Date().toISOString() }) + '\n',
  { flag: 'wx' })
const result = spawnSync(command[0], command.slice(1), {
  cwd: repo, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024,
})
fs.writeFileSync(path.join(own, 'FIRST-stdout.txt'), result.stdout ?? '', { flag: 'wx' })
fs.writeFileSync(path.join(own, 'FIRST-stderr.txt'), result.stderr ?? '', { flag: 'wx' })
fs.writeFileSync(path.join(own, 'FIRST-receipt.json'), JSON.stringify({
  command, cwd: repo, exitCode: result.status, error: result.error?.message ?? null,
  parentNewImages: 0, nativeCalls: 0, evidenceCompositionOnly: true,
}, null, 2) + '\n', { flag: 'wx' })
console.log(result.stdout)
if (result.stderr) console.error(result.stderr)
if (result.status !== 0) process.exitCode = 1

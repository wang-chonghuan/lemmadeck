import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), root)
const out = path.dirname(new URL(import.meta.url).pathname)
const args = [path.join(out, 'display-check.mjs')]
const start = new Date().toISOString()
const result = spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8' })
for (const [name, content] of [['display.stdout.txt', result.stdout || ''], ['display.stderr.txt', result.stderr || '']]) {
  fs.writeFileSync(path.join(out, name), content, { flag: 'wx' })
}
fs.writeFileSync(path.join(out, 'display.command.json'), `${JSON.stringify({
  cwd: root, command: process.execPath, args, start, finish: new Date().toISOString(),
  exitCode: result.status, signal: result.signal, error: result.error?.message || null,
  stdout: path.join(out, 'display.stdout.txt'), stderr: path.join(out, 'display.stderr.txt'),
  rendererCalls: 0, contentChanges: 0, browserMode: 'headless local offline screenshot',
}, null, 2)}\n`, { flag: 'wx' })
console.log(result.stdout)
if (result.stderr) console.error(result.stderr)
process.exitCode = result.status ?? 1

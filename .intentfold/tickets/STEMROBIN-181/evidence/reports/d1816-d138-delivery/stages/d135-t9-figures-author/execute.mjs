import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import assert from 'node:assert/strict'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
const own = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d135-t9-figures-author')
assert.equal(process.cwd(), cwd)
const stage = process.argv[2]
assert.ok(['repair', 'preview'].includes(stage))
const command = 'node'
const args = [path.join(own, 'author.mjs'), stage]
const output = path.join(own, `${stage}.command.receipt.json`)
assert.ok(!fs.existsSync(output))
const result = spawnSync(command, args, {
  cwd, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
})
fs.writeFileSync(output, `${JSON.stringify({
  schema: 'd135/command-receipt@1', cwd, command, args,
  exitCode: result.status, signal: result.signal, error: result.error?.message || null,
  stdout: result.stdout || '', stderr: result.stderr || '',
  executionRecoveryResetsUsage: false,
}, null, 2)}\n`)
console.log(result.stdout)
console.error(result.stderr)
console.log(JSON.stringify({ receipt: output, exitCode: result.status }))
process.exitCode = result.status ?? 1

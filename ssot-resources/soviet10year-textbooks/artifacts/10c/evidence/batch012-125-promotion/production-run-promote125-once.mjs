import assert from 'node:assert/strict'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'

const tmp = '.intentfold/tickets/STEMROBIN-184/tmp'
const output = `${tmp}/production-promote125-command`
const script = `${tmp}/production-promote10c125-once.mjs`
assert(!fs.existsSync(output), 'Only the first promotion command; no automatic retry')
fs.mkdirSync(output)
const started = new Date().toISOString()
const args = [script]
const result = spawnSync(process.execPath, args, { cwd: process.cwd(), encoding: 'utf8' })
const receipt = {
  executable: process.execPath, args, cwd: process.cwd(), started, finished: new Date().toISOString(),
  exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
  scriptSha256: createHash('sha256').update(fs.readFileSync(script)).digest('hex'),
  stdout: result.stdout ?? '', stderr: result.stderr ?? '',
}
for (const [name, bytes] of [
  ['command.json', JSON.stringify(receipt, null, 2) + '\n'],
  ['stdout.txt', receipt.stdout], ['stderr.txt', receipt.stderr],
]) fs.writeFileSync(`${output}/${name}`, bytes, { flag: 'wx' })
console.log(JSON.stringify(receipt, null, 2))
if (result.status !== 0) process.exitCode = 1

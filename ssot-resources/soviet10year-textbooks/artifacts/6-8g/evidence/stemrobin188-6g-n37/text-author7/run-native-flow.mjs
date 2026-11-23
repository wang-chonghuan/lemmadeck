import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

const W = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188'
if (process.cwd() !== W) throw new Error('Unauthorized cwd')
const A = path.join(W, '.intentfold/tickets/STEMROBIN-188/tmp/n37-text-author7')
const input = path.join(A, 'candidate/lesson.template.json')
const script = path.join(W, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs')
const receipt = path.join(A, 'prose-flow.execution.json')
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
if (fs.existsSync(receipt)) throw new Error('Native flow receipt exists; no replay authorized')
const inputHash = sha(input)
const argv = [script, input]
const started = new Date().toISOString()
const result = spawnSync(process.execPath, argv, { cwd: W, encoding: 'utf8' })
const stdout = path.join(A, 'prose-flow.stdout')
const stderr = path.join(A, 'prose-flow.stderr')
fs.writeFileSync(stdout, result.stdout ?? '', { flag: 'wx' })
fs.writeFileSync(stderr, result.stderr ?? '', { flag: 'wx' })
const record = {
  stage: 'prose-flow',
  cwd: W,
  command: process.execPath,
  argv,
  started,
  finished: new Date().toISOString(),
  exitCode: result.status,
  signal: result.signal,
  error: result.error?.message ?? null,
  input: { path: input, sha256: inputHash },
  tool: { path: script, sha256: sha(script) },
  streams: {
    stdout: { path: stdout, sha256: sha(stdout) },
    stderr: { path: stderr, sha256: sha(stderr) },
  },
}
fs.writeFileSync(receipt, `${JSON.stringify(record, null, 2)}\n`, { flag: 'wx' })
console.log(result.stdout)
console.error(result.stderr)
console.log(JSON.stringify({ receipt, sha256: sha(receipt), exitCode: result.status }))
process.exitCode = result.status ?? 1

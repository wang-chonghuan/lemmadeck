import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const own = path.join(tmp, 'n29-choice369-locus-repair-08')
const argv = ['python3', '-B', '.agents/skills/ld-s10y-choice/scripts/validate.py',
  '--repo', repo, '--seed', path.join(tmp, 'n29-choice-author-first-07/seed.json'),
  '--draft', path.join(own, 'draft.json')]
const startedAt = new Date().toISOString()
const result = spawnSync(argv[0], argv.slice(1), { cwd: repo, encoding: 'utf8' })
const streams = {}
for (const kind of ['stdout', 'stderr']) {
  const file = path.join(own, `structural.${kind}`)
  fs.writeFileSync(file, result[kind] ?? '', { flag: 'wx' })
  streams[kind] = bind(file)
}
const receipt = path.join(own, 'structural.execution.json')
save(receipt, { cwd: repo, argv, startedAt, finishedAt: new Date().toISOString(),
  exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
  streams, changedQuestionOnly: 'n29-center-locus', semanticApproval: false })
console.log(JSON.stringify({ receipt: bind(receipt), exitCode: result.status,
  stdout: result.stdout, stderr: result.stderr }))
process.exitCode = result.status ?? 1

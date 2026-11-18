import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const base = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const input = path.join(base, 'd660-n78-flow-affected-repair/candidate/en/lesson.template.json')
const out = path.join(base, 'd665-n78-qualifier-affected-repair')
const old = JSON.parse(fs.readFileSync(input, 'utf8'))
const candidate = structuredClone(old)
const before = candidate.prose[7].text
candidate.prose[7].text = before
  .replace('Stopping down makes a range', 'Stopping down can make a range')
  .replace('This holds where geometrical defocus dominates.', 'This depth-of-field increase applies where geometrical defocus dominates.')
assert.notEqual(candidate.prose[7].text, before)
fs.mkdirSync(out, { recursive: true })
const output = path.join(out, 'lesson.template.json')
fs.writeFileSync(output, `${JSON.stringify(candidate, null, 2)}\n`)
const flow = spawnSync(process.execPath, [
  path.join(repo, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs'), '--json', output,
], { cwd: repo, encoding: 'utf8' })
fs.writeFileSync(path.join(out, 'prose-flow.stdout.json'), flow.stdout)
fs.writeFileSync(path.join(out, 'prose-flow.stderr.txt'), flow.stderr)
assert.equal(flow.status, 0, flow.stderr)
const restored = structuredClone(candidate)
restored.prose[7].text = before
assert.deepEqual(restored, old)
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const report = {
  ticket: 'STEMROBIN-181', lesson: 'phy10-c2-s2-n78',
  status: 'SINGLE-QUALIFIER-AFFECTED-REPAIR-PENDING-REVIEW',
  finding: 'N78-AFFECTED-EN-COHERENCE-01',
  input: { path: input, sha256: sha(input) },
  candidate: { path: output, sha256: sha(output) },
  pointer: '/prose/7/text', before, after: candidate.prose[7].text,
  nativeFlowExitCode: flow.status, anchorsUnchanged: true,
  otherFieldsUnchanged: true, imagesOpened: 0,
}
fs.writeFileSync(path.join(out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`)
console.log(JSON.stringify({ candidate: report.candidate, nativeFlowExitCode: flow.status }))

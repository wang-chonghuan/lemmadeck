import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
assert.equal(process.cwd(), repo)
const [figure, stage, revision = 'initial'] = process.argv.slice(2)
assert(['fig-133', 'fig-134'].includes(figure))
assert(['validate', 'render', 'review', 'failed-review'].includes(stage))
assert(['initial', 'r1'].includes(revision))
const initialDir = path.join(repo, '.tmp/s10y-image/batch014-n36-133134', figure)
const dir = revision === 'initial' ? initialDir : path.join(initialDir, revision)
const spec = path.join(dir, 'spec.json')
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const notes = `AUTHOR SELF-CHECK ONLY, not independent review or parent gate approval. The complete n36 modern lesson/exercises templates were read before each corrected original was opened once. The full current preview was inspected once. Source labels, solid edges, projected crossing and endpoint marks are preserved; no solution construction, numeric answer or cultural art was added. Spatial claims are checked in 3D by the initial spatial-check.json, not by projected Euclidean angles; r1/repair-check.json binds the unchanged mathematical geometry to this label-only repaired spec. Fixed product scroll media is 640px; renderer and offline browser screen-transform checks meet >=16px text. This is batch-local scratch only, with no durable promotion, manifest edits or full product acceptance. ${figure === 'fig-134' ? 'N remains top and M bottom; MN crosses AC in projection only.' : 'MC crosses AD in projection only; all eight source segments remain solid.'} The separate parent-arranged independent gate remains pending.`
const failedNotes = `AUTHOR SELF-CHECK FAIL, not independent review. Complete current failed preview inspected once after the corrected source crop was opened once. Source/topology/spatial givens match, all five labels are present, no answer or cultural art added, and text at 640px is 32px. Renderer nevertheless fails on the upper ${figure === 'fig-133' ? 'M' : 'N'} label's padded clearance against its endpoint dot (score 23.746849060058594). This failed output is not approved. Initial spec, render, SVG, PNG and call receipt remain intact. Only a separately retained label offset repair is authorized; dependent product acceptance/promotion did not run.`
const stages = {
  validate: ['python3', ['.agents/skills/ld-s10y-image/scripts/validate_spec.py', spec, '--stage', 'draft', '--json']],
  render: ['node', ['.agents/skills/ld-s10y-image/scripts/render_spec.mjs', '--spec', spec,
    '--svg', path.join(dir, 'figure.svg'), '--png', path.join(dir, 'full-preview.png'), '--report', path.join(dir, 'render.json')]],
  review: ['python3', ['.agents/skills/ld-s10y-image/scripts/record_review.py',
    '--spec', spec, '--render', path.join(dir, 'render.json'), '--output', path.join(dir, 'self-review.json'),
    '--status', 'pass', '--notes', notes]],
  'failed-review': ['python3', ['.agents/skills/ld-s10y-image/scripts/record_review.py',
    '--spec', spec, '--render', path.join(dir, 'render.json'), '--output', path.join(dir, 'self-review.json'),
    '--status', 'fail', '--notes', failedNotes]],
}
const [command, args] = stages[stage]
const receipt = path.join(dir, `${stage}.call.json`)
assert(!fs.existsSync(receipt), `Do not overwrite a real call or failure: ${receipt}`)
const startedAt = new Date().toISOString()
const result = spawnSync(command, args, {
  cwd: repo, encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
})
const record = {
  schema: 'ld-s10y-image/bounded-author-call@1', figure, stage, revision,
  command: [command, ...args], workdir: repo, startedAt, finishedAt: new Date().toISOString(),
  exitCode: result.status, signal: result.signal, stdout: result.stdout, stderr: result.stderr,
  spec: { path: spec, sha256: hash(spec) }, paidCalls: 0,
}
fs.writeFileSync(receipt, JSON.stringify(record, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify(record, null, 2))
process.exitCode = result.status ?? 1

import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), root)
const out = path.dirname(new URL(import.meta.url).pathname)
const prior = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n42-image-author')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const write = (name, value) => fs.writeFileSync(path.join(out, name), value, { flag: 'wx' })
const bind = file => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size })
const original = path.join(prior, 'fig-g10-02.label-repair.spec.json')
const bytes = fs.readFileSync(original)
const before = JSON.parse(bytes)
assert.equal(hash(original), '116a4b670df30a73482ef60af6a6c0ce5a2a44b5908751cfc59130c4d2869c08')
assert.equal(hash(before.source.image.path), before.source.image.sha256)
const candidate = structuredClone(before)
const label = candidate.objects.find(item => item.id === 'box-k-label')
const mark = candidate.objects.find(item => item.id === 'vector-mark-box-k-label')
const mapping = candidate.assertions.find(item => item.id === 'connects-vector-mark-box-k-label')
assert.deepEqual(label.at, [328, 154])
assert.deepEqual(mark.from, [319, 179])
assert.deepEqual(mark.to, [337, 179])
assert.equal(label.fontSize, 28)
label.at[1] -= 16
mark.from[1] -= 16
mark.to[1] -= 16
mapping.from = [...mark.from]
mapping.to = [...mark.to]
const delta = []
function compare(a, b, pointer = '') {
  if (JSON.stringify(a) === JSON.stringify(b)) return
  if (a !== null && b !== null && typeof a === 'object' && typeof b === 'object') {
    assert.deepEqual(Object.keys(a), Object.keys(b))
    for (const key of Object.keys(a)) compare(a[key], b[key], `${pointer}/${key}`)
  } else delta.push({ pointer, before: a, after: b })
}
compare(before, candidate)
assert.equal(delta.length, 5)
const labelIndex = candidate.objects.indexOf(label)
const markIndex = candidate.objects.indexOf(mark)
const mappingIndex = candidate.assertions.indexOf(mapping)
assert.deepEqual(delta.map(item => item.pointer).sort(), [
  `/objects/${labelIndex}/at/1`,
  `/objects/${markIndex}/from/1`,
  `/objects/${markIndex}/to/1`,
  `/assertions/${mappingIndex}/from/1`,
  `/assertions/${mappingIndex}/to/1`,
].sort())
write('fig-g10-02.before.spec.json', bytes)
write('fig-g10-02.candidate.spec.json', `${JSON.stringify(candidate, null, 2)}\n`)
const spec = path.join(out, 'fig-g10-02.candidate.spec.json')
fs.chmodSync(spec, 0o644)
assert.ok(fs.statSync(spec).mode & 0o200)
const provenanceFiles = {
  oldSpec: original,
  oldSvg: path.join(prior, 'fig-g10-02.label-repair.svg'),
  oldRender: path.join(prior, 'fig-g10-02.label-repair.render.json'),
  old480: path.join(prior, 'fig-g10-02.label-repair.preview.png'),
  firstIndependentFailure: path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n42-modern-figure-review/report.json'),
  firstIndependentFailureMd: path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n42-modern-figure-review/report.md'),
  oldContentCounter: path.join(prior, 'label-repair-attempts.json'),
  oldRenderStdout: path.join(prior, 'fig-g10-02.label-repair.render.attempt-2.stdout.txt'),
  oldRenderStderr: path.join(prior, 'fig-g10-02.label-repair.render.attempt-2.stderr.txt'),
  approved300PresentationScript: path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/display-n42-current.mjs'),
  old300Receipt: path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n42-current-display/display.json'),
  source: before.source.image.path,
}
const provenance = Object.fromEntries(Object.entries(provenanceFiles).map(([name, file]) => [name, bind(file)]))
write('provenance.json', `${JSON.stringify({
  ticket: 'STEMROBIN-188', session: 'SAME188-6', cwd: root,
  originalStatus: 'N42 fig02 visual HOLD / real content FAIL, never relabelled PASS',
  defect: 'N42-F02-01',
  authorization: 'Latest direct user continuation authorizes a deterministic next-batch layout fix with explicit source/review support. Historical exhausted/1/1 counters remain evidence, not a new approval gate. Do not reset counters.',
  bindings: provenance,
  beforeCopy: bind(path.join(out, 'fig-g10-02.before.spec.json')),
  candidate: bind(spec),
  changedFields: delta,
  contentRevisionCounter: { prior: 1, newDelta: 1, cumulative: 2, reset: false },
  scopeVerification: {
    sourceInventoryAndAuthoritativeTextUnchanged: true,
    allSpatialCoordinatesEdgesAndDirectionsUnchanged: true,
    allOtherLabelsAndTextUnchanged: true,
    onlyKAnnotationLayoutAndAssociatedConnectsMappingChanged: true,
    kNotationDirection: 'rightward overarrow; actual upward box-k unit vector unchanged',
    fontSize480: 28, fontSize300: 17.5,
  },
}, null, 2)}\n`)
const args = [
  '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '--spec', spec,
  '--svg', path.join(out, 'fig-g10-02.candidate.svg'),
  '--report', path.join(out, 'fig-g10-02.candidate.render.json'),
  '--png', path.join(out, 'fig-g10-02.candidate.width-480.png'),
]
const start = new Date().toISOString()
const result = spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })
write('render.stdout.txt', result.stdout || '')
write('render.stderr.txt', result.stderr || '')
write('render.command.json', `${JSON.stringify({
  cwd: root, command: process.execPath, args, start, finish: new Date().toISOString(),
  exitCode: result.status, signal: result.signal, error: result.error?.message || null,
  stdout: bind(path.join(out, 'render.stdout.txt')),
  stderr: bind(path.join(out, 'render.stderr.txt')),
  rendererCalls: 1,
  validation: 'Renderer runs the existing draft validator internally once; no separate duplicate validation.',
  contentRevisionCounter: { prior: 1, newDelta: 1, cumulative: 2, reset: false },
}, null, 2)}\n`)
for (const value of Object.values(provenance)) assert.equal(hash(value.path), value.sha256)
console.log(JSON.stringify({ exitCode: result.status, output: out, changedFields: delta }))
process.exitCode = result.status ?? 1

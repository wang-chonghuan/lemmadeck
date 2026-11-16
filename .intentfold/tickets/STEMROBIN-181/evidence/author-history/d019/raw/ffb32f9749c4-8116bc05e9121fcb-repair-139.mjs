import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const work = '.tmp/STEMROBIN-181/9p-d019-n73-figures'
const initial = `${work}/fig-139/initial`
const out = `${work}/fig-139/repair-1`
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const writeNew = (file, value) => {
  assert(!fs.existsSync(file), `Preserve existing evidence: ${file}`)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}
const context = load(`${work}/context.json`)
assert.equal(sha(context.bindings.lesson.path), context.bindings.lesson.sha256)
assert.equal(sha(context.bindings.proseFreeze.path), context.bindings.proseFreeze.sha256)
const spec = load(`${initial}/spec.json`)
const before = load(`${initial}/native-failure.json`)
assert.equal(before.status, 'fail')
assert.equal(before.spec.sha256, sha(`${initial}/spec.json`))
assert(!fs.existsSync(out))
const curve = t => [470 - 300 * t, spec.canvas.height - (370 + 320 * t * (1 - t))]
const changes = []
for (const [index, parameter] of [0.2, 0.5, 0.8].entries()) {
  const id = `curve-direction-${index + 1}`
  const object = spec.objects.find(object => object.id === id)
  const previous = structuredClone(object)
  object.from = curve(parameter - 0.05)
  object.to = curve(parameter + 0.05)
  const endpoints = spec.assertions.find(assertion => assertion.id === `${id}-endpoints`)
  endpoints.from = object.from
  endpoints.to = object.to
  const displacement = spec.assertions.find(assertion => assertion.id === `${id}-directed-displacement`)
  displacement.from = object.from
  displacement.to = object.to
  displacement.dx = object.to[0] - object.from[0]
  displacement.dy = object.to[1] - object.from[1]
  changes.push({ id, previous, corrected: object })
}
spec.source.inventory[0].description += ' Sole native-marker repair lengthens the three existing curve-direction strokes along that same curve; their count and1-to2 direction are unchanged. This is a native readability/marker regularization, not a change to the source field, path endpoints or stair construction.'
writeNew(`${out}/spec.json`, spec)
writeNew(`${out}/repair.json`, {
  role: 'sole-targeted-fig139-author-repair-not-independent-review',
  initialSpec: bind(`${initial}/spec.json`), initialNativeFailure: bind(`${initial}/native-failure.json`),
  context: bind(`${work}/context.json`), helper: bind(`${work}/repair-139.mjs`),
  reason: 'Central direction stroke was shorter than the native arrowhead footprint, triggering unsupported marker aspect ratio before output serialization.',
  changes, repairedSpec: bind(`${out}/spec.json`),
  unchanged: ['Full final authoritativeText', 'Source PNG hash and retained source inventory', 'Six field arrows', 'Both plate signs', 'Numbered endpoints', 'Bowed quadratic curve', 'All staircase legs', 'Font/display contracts', 'Fig138 entire initial candidate'],
  repairsUsed: 1, remainingRepairs: 0, repairRenderInvocationsAtAuthoring: 0,
  noSourcePixelsReopened: true, nativeToolsChanged: false, svgHandEdited: false,
  independentApproval: false,
})
console.log(JSON.stringify({ spec: bind(`${out}/spec.json`), repair: bind(`${out}/repair.json`), remainingRepairs: 0 }, null, 2))

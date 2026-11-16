import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const base = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const hash = value => crypto.createHash('sha256').update(value).digest('hex')
const current = fs.readFileSync(path.join(base, 'commands/author.mjs'), 'utf8')
let initial = current
function replaceOnce(before, after) {
  assert.equal(initial.split(before).length, 2)
  initial = initial.replace(before, after)
}
// Recover the exact pre-repair driver and verify against its already-saved execution hash.
replaceOnce(
  "function checkContracts(specFilename = 'spec/fig-171.spec.json', suffix = 'initial') {",
  'function checkContracts() {',
)
replaceOnce(
  "  const spec = json(path.join(base, specFilename))",
  "  const spec = json(path.join(base, 'spec/fig-171.spec.json'))",
)
replaceOnce(
  "  put(`outputs/source-contracts.${suffix}.json`, { status: 'pass', checks })",
  "  put('outputs/source-contracts.initial.json', { status: 'pass', checks })",
)
replaceOnce(
  "    else put('outputs/selected-candidate.json', {\n      spec: 'spec/fig-171.spec.json', svg: 'candidate/fig-171.svg',\n      render: 'candidate/fig-171.render.json', repairs: 0,\n    })\n",
  '',
)
const start = initial.indexOf('function repair() {')
const end = initial.indexOf('function previews() {', start)
assert.ok(start > 0 && end > start)
initial = initial.slice(0, start) + initial.slice(end)
replaceOnce(
  "  const selected = json(path.join(base, 'outputs/selected-candidate.json'))\n  assert.equal(json(path.join(base, selected.render)).status, 'pass')",
  "  assert.equal(json(path.join(base, 'candidate/fig-171.render.json')).status, 'pass')",
)
replaceOnce(
  "  const selected = json(path.join(base, 'outputs/selected-candidate.json'))\n  const render = json(path.join(base, selected.render))",
  "  const render = json(path.join(base, 'candidate/fig-171.render.json'))",
)
replaceOnce(
  "      spec: binding(path.join(base, selected.spec)),\n      render: binding(path.join(base, selected.render)),\n      svg: binding(path.join(base, selected.svg)),",
  "      spec: binding(path.join(base, 'spec/fig-171.spec.json')),\n      render: binding(path.join(base, 'candidate/fig-171.render.json')),\n      svg: binding(path.join(base, 'candidate/fig-171.svg')),",
)
replaceOnce(
  "      imageOpens: pixels.imageOpens, repairCount: selected.repairs,\n      buildContextRuns: 1, explicitValidateRuns: 1 + selected.repairs, renderRuns: 1 + selected.repairs,\n      rendererInternalDraftValidation: 1 + selected.repairs, previewCaptureRuns: 1,",
  "      imageOpens: pixels.imageOpens, repairCount: 0,\n      buildContextRuns: 1, explicitValidateRuns: 1, renderRuns: 1,\n      rendererInternalDraftValidation: 1, previewCaptureRuns: 1,",
)
replaceOnce("else if (action === 'repair') repair()\n", '')
replaceOnce(
  "else throw new Error('Expected prepare, native, repair, previews or freeze')",
  "else throw new Error('Expected prepare, native, previews or freeze')",
)
const receipt = JSON.parse(fs.readFileSync(path.join(base, 'commands/render-spec-initial.json'), 'utf8'))
assert.equal(hash(initial), receipt.inputs[0].sha256)
const filename = path.join(base, 'commands/author.initial.mjs')
assert.ok(!fs.existsSync(filename))
fs.writeFileSync(filename, initial)
const output = path.join(base, 'outputs/command-version-preservation.json')
assert.ok(!fs.existsSync(output))
fs.writeFileSync(output, `${JSON.stringify({
  status: 'pass',
  initialDriver: { path: filename, sha256: hash(initial) },
  repairedDriver: { path: path.join(base, 'commands/author.mjs'), sha256: hash(current) },
  matchesOriginalExecutionReceipt: true,
  method: 'Mechanical reversal of only the documented repair-driver patch, accepted only after SHA-256 equality with the preexisting initial execution receipt. Native inputs, specs, SVGs, reports and receipts were not edited.',
}, null, 2)}\n`)
console.log(`Preserved exact initial driver ${hash(initial)}`)

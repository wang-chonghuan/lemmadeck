import assert from 'node:assert/strict'
import { G, W, bind, read, write, command } from './author.mjs'

const report = read(`${G}/initial/fig-72.render.json`)
assert.equal(report.status, 'fail')
assert.deepEqual(report.collisions.map(item => item.id), ['source-v-symbol-label'])
const spec = read(`${G}/initial/fig-72.spec.json`)
const label = spec.objects.find(item => item.id === 'source-v-symbol')
assert.deepEqual(label.at, [613.5, 165])
label.at = [613.5, 158]
write(`${G}/repair/fig-72.spec.json`, spec)
write(`${G}/receipts/sole-targeted-repair.json`, {
  status: 'one-targeted-repair-after-actual-native-fail',
  initialSpec: bind(`${G}/initial/fig-72.spec.json`),
  initialSvg: bind(`${G}/initial/fig-72.svg`),
  initialReport: bind(`${G}/initial/fig-72.render.json`),
  initialPreview: bind(`${G}/initial/fig-72.full.png`),
  initialRenderCommand: bind(`${G}/receipts/initial-render.json`),
  changedObject: 'source-v-symbol',
  change: { field: 'at', before: [613.5, 165], after: [613.5, 158] },
  diagnosis: 'The padded v text footprint just overlaps the visible native vector-accent anchor clearance. Move the v text down by 7 uncalibrated layout units (6.46 CSS pixels). Keep both velocity arrows, their endpoints, curve mathematics, all assertions, and all other labels unchanged.',
  geometryChanged: false, svgEdited: false,
  targetedRepairsUsed: 1, targetedRepairsAllowed: 1,
})
const draft = command('repair-validation', 'python3', [
  `${W}/.agents/skills/ld-s10y-image/scripts/validate_spec.py`,
  'fig-72.spec.json', '--stage', 'draft', '--json',
], `${G}/repair`)
assert.equal(draft.status, 0, draft.stdout + draft.stderr)
const render = command('repair-render', 'node', [
  `${W}/.agents/skills/ld-s10y-image/scripts/render_spec.mjs`,
  '--spec', 'fig-72.spec.json', '--svg', 'fig-72.svg',
  '--report', 'fig-72.render.json', '--png', 'fig-72.full.png',
], `${G}/repair`)
console.log(JSON.stringify({ exitCode: render.status, stdout: render.stdout, stderr: render.stderr }))

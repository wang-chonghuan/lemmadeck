import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const W = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const A = path.dirname(fileURLToPath(import.meta.url))
const initial = `${A}/fig-301/initial`
const repair = `${A}/fig-301/repair-1`
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const bind = file => ({ path: file, sha256: sha(file) })
const write = (file, value) => {
  assert(file.startsWith(`${A}/`) && !fs.existsSync(file))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}
const initialFiles = ['fig-301.spec.json', 'fig-301.svg', 'fig-301.render.json',
  'fig-301.native.png', 'author-geometry.json'].map(name => bind(`${initial}/${name}`))
write(`${initial}/author-visual-observation.json`, {
  schema: 'ld-s10y-image/author-visual-observation@1',
  status: 'FAIL', mechanicalRenderStatus: 'PASS', imagesOpened: 1,
  sourceImageOpensCarriedForward: 2, cumulativeImagesOpened: 3,
  reason: 'Fine visible join artifacts break the clean solid-curve appearance at 640 px.',
  geometryAndLabelsOtherwisePreserved: true,
  targetedRepair: 'Replace the dense native segment chain with one native svgPath using identical cubic controls.',
  specAndOutputs: initialFiles, independentApproval: false,
})
const spec = structuredClone(read(`${initial}/fig-301.spec.json`))
const geometry = read(`${initial}/author-geometry.json`)
const screen = point => [point[0], spec.canvas.height - point[1]]
const controls = geometry.unmeasuredControls
const pathData = [`M ${screen(controls[0][0]).join(' ')}`,
  ...controls.map(control => `C ${control.slice(1).map(point => screen(point).join(' ')).join(' ')}`)].join(' ')
spec.objects = spec.objects.filter(object => object.type !== 'segment')
spec.objects.push({
  id: '301-initial-curve', type: 'svgPath', d: pathData,
  stroke: 'ink', strokeWidth: 4.2, fillOpacity: 0,
})
spec.assertions = spec.assertions.filter(item =>
  !item.id.startsWith('301-initial-curve-') && item.id !== '301-single-open-curve-chain')
spec.assertions.push({
  id: '301-one-continuous-initial-curve', type: 'objectCount', objectType: 'svgPath', count: 1,
}, {
  id: '301-uncalibrated-curve-endpoint-offset', type: 'displacement',
  from: controls[0][0], to: controls.at(-1).at(-1), dx: 360, dy: 292,
})
const inventory = spec.source.inventory.find(group => group.id === '301-source-single-initial-curve')
inventory.description = inventory.description.replace(
  'The dense native segment chain is modern smooth-line regularization, not sampled experimental data.',
  'One renderer-native cubic path is modern smooth-line regularization, not experimental data. '
    + 'The same two unmeasured cubic controls are preserved from the initial attempt; no curve labels, '
    + 'ticks, points or measurements are embedded in the path.',
)
inventory.objects = ['301-initial-curve']
inventory.assertions = ['301-one-continuous-initial-curve',
  '301-uncalibrated-curve-endpoint-offset', '301-origin-on-horizontal-axis',
  '301-origin-on-vertical-axis']
write(`${repair}/fig-301.spec.json`, spec)
write(`${repair}/source-inventory.json`, spec.source.inventory)
write(`${repair}/repair-proof.json`, {
  status: 'PASS', repairNumber: 1, reason: 'Solid-curve visual continuity',
  initial: initialFiles, unmeasuredControlsBefore: controls, unmeasuredControlsAfter: controls,
  sourceAndCurrentBilingualTextUnchanged:
    JSON.stringify(spec.source.authoritativeText) ===
      JSON.stringify(read(`${initial}/fig-301.spec.json`).source.authoritativeText),
  axesLabelsDisplayCanvasUnchanged:
    JSON.stringify(spec.objects.filter(item => item.type !== 'svgPath')) ===
      JSON.stringify(read(`${initial}/fig-301.spec.json`).objects.filter(item => item.type !== 'segment')),
  continuousNativePath: pathData, handEditedSvg: false,
  independentApproval: false,
})
const run = (name, command, args) => {
  const result = spawnSync(command, args, {
    cwd: W, encoding: 'utf8',
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: `${A}/browser-tmp/` },
  })
  write(`${repair}/${name}.json`, {
    command, args, cwd: W, exitCode: result.status,
    status: result.status === 0 ? 'PASS' : 'FAIL',
    stdout: result.stdout, stderr: result.stderr, spec: bind(`${repair}/fig-301.spec.json`),
  })
  return result.status === 0
}
const validator = `${W}/.agents/skills/ld-s10y-image/scripts/validate_spec.py`
const draftPass = run('draft-validation', 'python3',
  [validator, `${repair}/fig-301.spec.json`, '--stage', 'draft', '--json'])
let renderPass = false
if (draftPass) renderPass = run('render-command', 'node', [
  `${W}/.agents/skills/ld-s10y-image/scripts/render_spec.mjs`,
  '--spec', `${repair}/fig-301.spec.json`, '--svg', `${repair}/fig-301.svg`,
  '--png', `${repair}/fig-301.native.png`, '--report', `${repair}/fig-301.render.json`,
])
if (renderPass) run('rendered-validation', 'python3',
  [validator, `${repair}/fig-301.spec.json`, '--stage', 'rendered', '--json'])
for (const item of initialFiles) assert.equal(sha(item.path), item.sha256)
console.log(JSON.stringify({ figure: 'fig-301', repair: 1,
  draft: draftPass ? 'PASS' : 'FAIL', render: renderPass ? 'PASS' : 'FAIL',
  spec: bind(`${repair}/fig-301.spec.json`), initialArtifactsUnchanged: true }))

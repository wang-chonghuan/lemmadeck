import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

const W = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const A = `${W}/.intentfold/tickets/STEMROBIN-181/tmp/d040-9p-fig300-author`
const INPUT = `${W}/.intentfold/tickets/STEMROBIN-181/tmp/d039-9p-n133-author`
const SOURCE = `${W}/ssot-resources/soviet10year-textbooks/artifacts/9p/figures/fig-300.png`
const CARD = 'phy9-c2-s7-n133'
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (file, value) => {
  if (!path.resolve(file).startsWith(`${A}/`)) throw new Error('Outside author ownership')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}
const copy = (from, to) => {
  if (!path.resolve(to).startsWith(`${A}/`)) throw new Error('Outside author ownership')
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to)
}

if (sha(`${INPUT}/author-freeze.json`) !== '89adf059997cbbd6b59853c1e284735fb0b505f8fec06786daf88606994547de') {
  throw new Error('Frozen prose receipt mismatch')
}
if (sha(SOURCE) !== '0347b7a9e27ee0ff88402fd4ebb826232e4f8e2dd176b7405b7adc2e7445277e') {
  throw new Error('Original PNG mismatch')
}
const freeze = read(`${INPUT}/author-freeze.json`)
for (const locale of freeze.frozen) {
  for (const binding of [...locale.templates, locale.prose, locale.markdown]) {
    if (sha(binding.path) !== binding.sha256) throw new Error(`Stale input ${binding.path}`)
  }
}

if (process.argv[2] === 'prepare') {
  copy(SOURCE, `${A}/root/9p/figures/fig-300.png`)
  for (const language of ['zh', 'en']) {
    const edition = `${A}/context-inputs/${language}/9p/editions/modern-us-neutral`
    copy(SOURCE, `${A}/context-inputs/${language}/9p/figures/fig-300.png`)
    copy(`${INPUT}/frozen/${language}/lesson.template.json`, `${edition}/lessons/${CARD}/lesson.json`)
    copy(`${INPUT}/frozen/${language}/exercises.template.json`, `${edition}/lessons/${CARD}/exercises.json`)
  }
  const crop = spawnSync(`${W}/.claude/skills/ld-s10y-lesson/.venv/bin/python`,
    ['-c', 'from PIL import Image; import sys; im=Image.open(sys.argv[1]); im.crop((560,90,788,315)).resize((684,675),Image.Resampling.NEAREST).save(sys.argv[2])',
      SOURCE, `${A}/source-meter-detail.png`], { encoding: 'utf8' })
  if (crop.status !== 0) throw new Error(crop.stderr)
  console.log(JSON.stringify({ status: 'inputs-bound', owner: A, sourceSha256: sha(SOURCE) }))
  process.exit(0)
}

const objects = []
const assertions = []
const groups = new Map()
let group
const inventoryGroup = (id, description) => {
  group = { id, description, objects: [], assertions: [] }
  groups.set(id, group)
}
const object = value => {
  objects.push(value)
  if (value.visible !== false) group.objects.push(value.id)
  return value.id
}
const assertion = value => {
  assertions.push(value)
  group.assertions.push(value.id)
}
const point = (id, x, y, visible = false, extra = {}) =>
  object({ id, type: 'point', at: [x, 1000 - y], visible, ...extra })
const line = (id, from, to, extra = {}) => {
  object({ id, type: 'segment', from, to, stroke: 'ink', strokeWidth: 3, ...extra })
  assertion({ id: `${id}-connects`, type: 'connects', arrow: id, from, to })
}
const poly = (id, coordinates, extra = {}) => object({
  id, type: 'polygon', points: coordinates.map(([x, y]) => [x, 1000 - y]),
  stroke: 'ink', strokeWidth: 3, fill: 'paper', fillOpacity: 1, ...extra,
})
const circle = (id, x, y, radius, extra = {}) => object({
  id, type: 'circle', center: [x, 1000 - y], radius,
  stroke: 'ink', strokeWidth: 3, ...extra,
})
const text = (id, x, y, value, extra = {}) => object({
  id, type: 'text', at: [x, 1000 - y], text: value, fontSize: 34,
  fontWeight: 500, labelPlacement: { position: 'CENTER' }, ...extra,
})
const route = (prefix, coordinates, extra = {}) => {
  const nodes = coordinates.map(([x, y], i) => point(`${prefix}-node-${i}`, x, y))
  nodes.slice(1).forEach((to, i) => line(`${prefix}-wire-${i + 1}`, nodes[i], to, extra))
  return nodes
}

inventoryGroup('300-source-primary-dc-loop',
  'One left rectangular battery with a negative sign under its left top terminal and a positive sign under its right top terminal. The left battery terminal has a broad rising lead to the upper-left winding contact. The right battery terminal leads down/right to the left switch contact. One front knife switch has two contacts, a raised blade and a low rectangular base; its other contact returns to the lower winding through a lead at the support right. These form the primary DC circuit only. Source lengths and fine winding count are not calibrated facts. Modern battery plates replace the perspective box, without adding cells as a given; the source polarity and open blade are retained.')
const primaryNodes = []
const leftReturn = route('primary-left-return', [[60, 840], [60, 260], [278, 260]])
primaryNodes.push(...leftReturn)
const windingNodes = []
for (let i = 0; i < 12; i += 1) {
  const y = 260 + i * 20
  const left = point(`primary-turn-${i + 1}-left`, 278, y)
  const right = point(`primary-turn-${i + 1}-right`, 376, y)
  windingNodes.push(left, right)
  line(`primary-turn-${i + 1}-front`, left, right)
  if (i > 0) line(`primary-turn-${i}-back`, windingNodes[(i - 1) * 2 + 1], left,
    { dash: 1, stroke: 'muted', strokeWidth: 2 })
}
primaryNodes.push(...windingNodes)
const rightReturn = route('primary-right-return', [[376, 480], [412, 480], [412, 840], [335, 840]])
primaryNodes.push(...rightReturn)
const batterySwitch = route('primary-battery-switch', [[140, 840], [260, 840]])
primaryNodes.push(...batterySwitch)
point('primary-switch-pivot', 260, 840, true, { size: 4, fill: 'paper', stroke: 'ink' })
point('primary-switch-contact', 335, 840, true, { size: 4, fill: 'paper', stroke: 'ink' })
const bladeEnd = point('primary-switch-blade-end', 319, 813)
line('primary-switch-blade', 'primary-switch-pivot', bladeEnd, { strokeWidth: 4 })
poly('primary-switch-base', [[246, 855], [350, 855], [350, 868], [246, 868]],
  { stroke: 'muted', fill: 'paper', strokeWidth: 2 })
route('primary-battery-left', [[60, 840], [87, 840]])
route('primary-battery-right', [[113, 840], [140, 840]])
line('primary-battery-short-plate', [87, 1000 - 825], [87, 1000 - 855], { strokeWidth: 4 })
line('primary-battery-long-plate', [113, 1000 - 810], [113, 1000 - 870], { strokeWidth: 4 })
text('primary-negative', 88, 792, '-')
text('primary-positive', 126, 792, '+')
assertion({ id: 'primary-winding-front-alignment', type: 'parallel',
  a: windingNodes[0], b: windingNodes[1], c: windingNodes[22], d: windingNodes[23] })
assertion({ id: 'primary-switch-gap', type: 'distance', a: bladeEnd,
  b: 'primary-switch-contact', value: Math.hypot(16, 27) })

inventoryGroup('300-source-coaxial-windings-and-support',
  'One upright cylindrical winding assembly occupies the center, with a dark oval upper flange/opening, a lower flange, dense transverse windings and a front vertical seam. It rests on a rectangular horizontally grained support with small face fittings and a right-side sloping lead. The prose distinguishes the long primary from the smaller secondary wound over it; pixels do not establish exact turn counts or a separately detached core. Preserve one shared vertical axis, a long primary and a shorter over-winding, plus the support. Modern regularization uses clean insulating end flanges, a small secondary band and three nonquantitative support hatch strokes, not a grained photograph.')
poly('coil-top-flange', [[266, 238], [388, 238], [388, 247], [266, 247]],
  { fill: 'paper', strokeWidth: 3 })
poly('coil-lower-flange', [[266, 501], [388, 501], [388, 513], [266, 513]],
  { fill: 'paper', strokeWidth: 3 })
line('coil-left-body', [274, 1000 - 247], [274, 1000 - 501], { stroke: 'muted', strokeWidth: 2 })
line('coil-right-body', [380, 1000 - 247], [380, 1000 - 501], { stroke: 'muted', strokeWidth: 2 })
poly('support-block', [[246, 523], [402, 523], [402, 566], [246, 566]],
  { fill: 'paper', stroke: 'muted', strokeWidth: 2 })
for (let i = 0; i < 3; i += 1) {
  line(`support-hatch-${i + 1}`, [300 + 25 * i, 1000 - 560], [315 + 25 * i, 1000 - 529],
    { stroke: 'muted', strokeWidth: 1 })
}
circle('support-fitting-upper', 270, 536, 4, { stroke: 'muted', strokeWidth: 2 })
circle('support-fitting-lower', 270, 554, 4, { stroke: 'muted', strokeWidth: 2 })
assertion({ id: 'coils-shared-vertical-axis', type: 'collinear',
  a: [327, 1000 - 238], b: [327, 1000 - 375], c: [327, 1000 - 513] })
assertion({ id: 'support-below-coils', type: 'displacement',
  from: [327, 1000 - 513], to: [327, 1000 - 523], dx: 0, dy: -10 })

inventoryGroup('300-source-secondary-independent-loop',
  'Two distinct leads leave the right side of the winding assembly at different heights and run to two separate galvanometer terminals, one above/right of the other in the perspective source. Neither lead joins the battery, knife switch or primary contacts. The smaller secondary coil is around the primary, not alongside it and not electrically bonded to it. Modern secondary overlay masks underlying winding strokes at the shared insulating band, and routes its two external leads without cross-circuit crossings. Three illustrative secondary turns are schematic, not a source turn-number reading.')
poly('secondary-insulating-band', [[258, 330], [396, 330], [396, 418], [258, 418]],
  { stroke: 'muted', fill: 'paper', strokeWidth: 2 })
const secondaryNodes = []
for (let i = 0; i < 3; i += 1) {
  const right = point(`secondary-turn-${i + 1}-right`, 392, 342 + 23 * i)
  const left = point(`secondary-turn-${i + 1}-left`, 262, 342 + 23 * i)
  secondaryNodes.push(right, left)
  line(`secondary-turn-${i + 1}-front`, right, left, { strokeWidth: 4 })
  if (i > 0) line(`secondary-turn-${i}-back`, secondaryNodes[(i - 1) * 2 + 1], right,
    { stroke: 'muted', dash: 1, strokeWidth: 2 })
}
const secondaryEnd = point('secondary-lower-end', 392, 410)
line('secondary-turn-3-back', secondaryNodes[5], secondaryEnd, { stroke: 'muted', dash: 1, strokeWidth: 2 })
const secondaryUpper = route('secondary-upper-return', [[392, 342], [630, 342], [630, 762], [595, 762], [595, 730]])
const secondaryLower = route('secondary-lower-return', [[392, 410], [430, 410], [430, 762], [470, 762], [470, 730]])
assertion({ id: 'secondary-over-primary-center', type: 'inside',
  point: [327, 1000 - 375], container: 'secondary-insulating-band' })
assertion({ id: 'secondary-winding-front-alignment', type: 'parallel',
  a: secondaryNodes[0], b: secondaryNodes[1], c: secondaryNodes[4], d: secondaryNodes[5] })

inventoryGroup('300-source-galvanometer',
  'One large right rectangular analog galvanometer with a lower foot, two wired terminal fittings, an arched scale of short radial ticks, a central 0, apparent 5 endpoint numerals on both sides, and a vertical pointer aligned with the central mark. Below the scale is a small rectangular internal mechanism containing a pivot/coil detail; the lower face has two adjustment-like round fittings. Preserve the zero-centered pointer, ticked symmetric scale, terminal separation and simplified mechanism, without a deflection result or a scale unit. Source endpoint numeral reading is confirmed separately from an enlarged pixel crop; no calibrated current, flux, permeability, pulse trace or outcome is added.')
poly('meter-frame', [[450, 525], [615, 525], [615, 730], [450, 730]],
  { fill: 'paper', strokeWidth: 3 })
poly('meter-foot', [[440, 732], [622, 732], [622, 747], [440, 747]],
  { fill: 'paper', stroke: 'muted', strokeWidth: 2 })
const scaleCenter = [532, 1000 - 655]
const radius = 70
const scalePoint = angle => [532 + radius * Math.cos(angle), 1000 - 655 + radius * Math.sin(angle)]
object({ id: 'meter-scale-arc', type: 'arc', center: scaleCenter,
  start: scalePoint(Math.PI * 0.22), end: scalePoint(Math.PI * 0.78),
  stroke: 'ink', strokeWidth: 3 })
object({ id: 'meter-inner-scale-arc', type: 'arc', center: scaleCenter,
  start: [532 + 54 * Math.cos(Math.PI * 0.22), 1000 - 655 + 54 * Math.sin(Math.PI * 0.22)],
  end: [532 + 54 * Math.cos(Math.PI * 0.78), 1000 - 655 + 54 * Math.sin(Math.PI * 0.78)],
  stroke: 'muted', strokeWidth: 2 })
for (let i = 0; i < 9; i += 1) {
  const angle = Math.PI * (0.22 + 0.56 * i / 8)
  line(`meter-scale-tick-${i + 1}`,
    [532 + 70 * Math.cos(angle), 1000 - 655 + 70 * Math.sin(angle)],
    [532 + 80 * Math.cos(angle), 1000 - 655 + 80 * Math.sin(angle)],
    { strokeWidth: 2 })
}
text('meter-zero', 532, 547, '0')
text('meter-left-five', 476, 568, '5')
text('meter-right-five', 588, 568, '5')
poly('meter-internal-mechanism', [[518, 644], [546, 644], [546, 711], [518, 711]],
  { stroke: 'muted', strokeWidth: 2, fill: 'paper' })
circle('meter-pivot', 532, 655, 4, { fill: 'ink', fillOpacity: 1, strokeWidth: 2 })
for (let i = 0; i < 3; i += 1) {
  poly(`meter-internal-coil-${i + 1}`, [[524, 668 + i * 10], [540, 668 + i * 10],
    [540, 674 + i * 10], [524, 674 + i * 10]], { strokeWidth: 1, stroke: 'muted', fill: 'paper' })
}
const pointerBase = point('meter-pointer-base', 532, 655)
const pointerTip = point('meter-pointer-tip', 532, 581)
line('meter-pointer', pointerBase, pointerTip, { strokeWidth: 3 })
circle('meter-left-adjustment', 483, 707, 5, { strokeWidth: 2, stroke: 'muted' })
circle('meter-right-adjustment', 582, 707, 5, { strokeWidth: 2, stroke: 'muted' })
point('secondary-meter-left-terminal', 470, 730, true, { size: 4, stroke: 'ink', fill: 'paper' })
point('secondary-meter-right-terminal', 595, 730, true, { size: 4, stroke: 'ink', fill: 'paper' })
assertion({ id: 'meter-pointer-at-central-zero', type: 'collinear',
  a: pointerBase, b: pointerTip, c: [532, 1000 - 547] })
assertion({ id: 'meter-terminal-separation', type: 'distance',
  a: 'secondary-meter-left-terminal', b: 'secondary-meter-right-terminal', value: 125 })

inventoryGroup('300-modern-core-and-english-identifications',
  'Explicit modern additions from the frozen bilingual prose: an axially aligned removable iron-core rod partially shown above the upper opening; its continuation into the winding bore is muted and dashed to distinguish hidden core from an electric lead. A clean flanged tube opening substitutes for the perspective ellipse. The source pixels do not show a detached rod or motion arrow. English Primary coil, Secondary coil, Removable iron core, DC battery, Switch and Galvanometer identify existing/prose-described components. Thin muted leader segments are nonconductive label guides, not circuit connections. No current/flux direction, quantitative response or answer is disclosed.')
poly('core-exposed-rod', [[313, 82], [341, 82], [341, 238], [313, 238]],
  { fill: 'accentSoft', fillOpacity: 0.16, stroke: 'muted', strokeWidth: 2 })
line('core-hidden-left', [313, 1000 - 248], [313, 1000 - 498],
  { stroke: 'muted', strokeWidth: 1, dash: 2 })
line('core-hidden-right', [341, 1000 - 248], [341, 1000 - 498],
  { stroke: 'muted', strokeWidth: 1, dash: 2 })
text('core-removable-label', 475, 104, 'Removable')
text('core-material-label', 475, 145, 'iron core')
line('core-label-leader', [361, 1000 - 145], [341, 1000 - 145],
  { stroke: 'muted', strokeWidth: 1 })
text('primary-name-label', 167, 167, 'Primary')
text('primary-coil-label', 167, 208, 'coil')
line('primary-label-leader', [230, 1000 - 208], [272, 1000 - 251],
  { stroke: 'muted', strokeWidth: 1 })
text('secondary-name-label', 143, 364, 'Secondary')
text('secondary-coil-label', 143, 405, 'coil')
line('secondary-label-leader', [236, 1000 - 384], [258, 1000 - 384],
  { stroke: 'muted', strokeWidth: 1 })
text('battery-name-label', 110, 917, 'DC battery')
text('switch-name-label', 300, 917, 'Switch')
text('meter-name-label', 505, 791, 'Galvanometer')
assertion({ id: 'removable-core-coaxial', type: 'collinear',
  a: [327, 1000 - 82], b: [327, 1000 - 238], c: [327, 1000 - 513] })
assertion({ id: 'core-into-primary-bore', type: 'inside',
  point: [327, 1000 - 375], container: 'secondary-insulating-band' })

const authoritativeText = ['zh', 'en'].flatMap(language => {
  const template = read(`${INPUT}/frozen/${language}/lesson.template.json`)
  return template.prose.filter(block => block.text?.trim())
    .map(block => ({ lesson: CARD, text: block.text }))
})
const spec = {
  schema: 'ld-s10y-image/figure-spec@2', id: 'fig-300', mode: 'deterministic',
  description: 'Inspect the independent primary battery-and-open-switch DC circuit and coaxial secondary galvanometer circuit, with a removable iron core in the common bore. Apparatus identification only: no measured deflection, field arrows, current direction, permeability ratio or answer annotation.',
  source: { image: { path: '../../figures/fig-300.png', sha256: sha(SOURCE) },
    authoritativeText, inventory: [...groups.values()] },
  canvas: { width: 640, height: 1000, boundingBox: [0, 1000, 640, 0],
    background: 'paper', keepAspectRatio: true },
  display: { purpose: 'instructional', layout: 'inline', maxWidthPx: 640,
    widths: [316, 640], minTextPx: 16 },
  objects: [
    ...objects.filter(item => /^core-hidden-/.test(item.id)),
    ...objects.filter(item => !/^core-hidden-/.test(item.id) && !/^secondary-(upper|lower)-return-wire-/.test(item.id)),
    ...objects.filter(item => /^secondary-(upper|lower)-return-wire-/.test(item.id)),
  ], assertions, layout: { minLabelGap: 3 },
}
write(`${A}/root/9p/editions/modern-us-neutral/figures/fig-300.spec.json`, spec)
write(`${A}/input-bindings.json`, {
  schema: 'ld-s10y-image/bounded-author-inputs@1', ticket: 'STEMROBIN-181', figure: 'fig-300',
  owner: A, inputFreeze: { path: `${INPUT}/author-freeze.json`, sha256: sha(`${INPUT}/author-freeze.json`) },
  source: { path: SOURCE, sha256: sha(SOURCE) },
  texts: ['zh', 'en'].map(language => ({
    language, files: ['lesson.template.json', 'prose.md'].map(name => ({
      path: `${INPUT}/frozen/${language}/${name}`, sha256: sha(`${INPUT}/frozen/${language}/${name}`),
    })),
  })),
  sourceObservation: { originalImageOpened: true, openedCountSoFar: 2,
    meterDetail: { path: `${A}/source-meter-detail.png`, sha256: sha(`${A}/source-meter-detail.png`) } },
  pathResolution: {
    base: 'edition working directory, not FigureSpec parent directory',
    sourcePath: '../../figures/fig-300.png',
    canonicalBase: `${W}/ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral`,
    canonicalResolvedSource: SOURCE,
    authorResolvedSource: `${A}/root/9p/figures/fig-300.png`,
    justification: 'validate_spec.py uses Path(image_path); render reports use portablePath relative to cwd. Source is two levels above edition base, three above edition/figures.',
  },
  referenceExamples: ['231', '283'].map(id => ({
    spec: `${W}/ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/figures/fig-${id}.spec.json`,
    sha256: sha(`${W}/ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/figures/fig-${id}.spec.json`),
    use: 'Text-only reference for clean deterministic apparatus, semantic roles and actual-width display contract; not copied source inventory.',
  })),
})
console.log(JSON.stringify({ status: 'spec-authored', objects: objects.length, assertions: assertions.length }))

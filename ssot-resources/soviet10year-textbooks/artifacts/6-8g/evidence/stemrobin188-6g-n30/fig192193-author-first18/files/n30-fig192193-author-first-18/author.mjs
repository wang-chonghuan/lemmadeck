import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const W = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
if (process.cwd() !== W) throw new Error('Wrong cwd')
const inputRoot = path.resolve(root, '../n30-draft-first-18')
const lessonPath = path.join(inputRoot, 'work/adapt/6-8g/modern-us-neutral/lessons/geo68-c2-s4-n30/lesson.template.json')
const lesson = JSON.parse(fs.readFileSync(lessonPath, 'utf8'))
const inventoryPath = path.join(root, 'source-inventory.json')
const observation = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const write = (p, data) => {
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n')
}
const normalize = text => text.replaceAll('\u0430', 'a').replaceAll('\u0431', 'b').replaceAll('\u0432', 'c')
const taskIndex = lesson.prose.findIndex(b => b.kind === 'p' && b.source_refs.includes('p0139#12'))
if (taskIndex < 0) throw new Error('Full tangent context not found')
const relevant = lesson.prose.slice(taskIndex)
const context = {
  schema: 'ld-s10y-image/context@1',
  status: 'AUTHOR_DRAFT_NOT_REVIEW',
  book: '6-8g',
  edition: 'modern-us-neutral',
  lesson: lesson.id,
  inputLesson: { path: lessonPath, sha256: hash(lessonPath) },
  inventory: { path: inventoryPath, sha256: hash(inventoryPath) },
  authoritativeRule: 'Full supplied tangent-task prose; mathematics unchanged. Only Cyrillic subfigure/list references normalized to Latin a/b/c. No answer-key input.',
  blocks: relevant.map(b => ({
    ...b,
    text: normalize(b.text),
    suppliedText: b.text,
    suppliedSourceText: b.source_text,
    referenceNormalizationOnly: normalize(b.text) !== b.text
  })),
  unknowns: [
    ...observation['fig-192'].panels.flatMap(p => p.unknowns),
    observation['fig-193'].source141Marker
  ],
  excludedScope: 'C/c fig-190/fig-191 remains untouched and not approved.'
}
write(path.join(root, 'context.json'), context)

function base(id, height) {
  const image = path.join(inputRoot, `artifacts/6-8g/figures/${id}.png`)
  return {
    schema: 'ld-s10y-image/figure-spec@2',
    id,
    mode: 'deterministic',
    description: id === 'fig-192'
      ? 'Instructional interior-point secants and on-circle tangent construction; damaged oblique dash/glyph identity remains UNKNOWN.'
      : 'Instructional exterior-point tangent analysis, two auxiliary-circle intersections, and equal tangent segments; all three source panels retained.',
    source: {
      image: { path: image, sha256: hash(image) },
      authoritativeText: relevant.filter(b => b.text.trim()).map(b => ({ lesson: lesson.id, text: normalize(b.text) })),
      inventory: []
    },
    canvas: { width: 716, height, boundingBox: [0, height, 716, 0], background: 'paper', keepAspectRatio: true },
    display: { purpose: 'instructional', layout: 'inline', maxWidthPx: 716, minTextPx: 16, widths: [331, 358, 640, 716] },
    objects: [],
    assertions: []
  }
}
function panel(spec, id, description, action) {
  const oStart = spec.objects.length
  const aStart = spec.assertions.length
  action()
  spec.source.inventory.push({
    id,
    description,
    requires: ['pointRelationships'],
    objects: spec.objects.slice(oStart).map(o => o.id),
    assertions: spec.assertions.slice(aStart).map(a => a.id)
  })
}
function point(s, id, at, label, position) {
  s.objects.push({ id, type: 'point', at, label, size: 3.5, strokeWidth: 1, stroke: 'ink', fill: 'ink', fontSize: 36, fontWeight: 500,
    ...(position ? { labelPlacement: { position, gap: 42 } } : {}) })
}
function text(s, id, at, value, position = 'CENTER') {
  s.objects.push({ id, type: 'text', at, text: value, fontSize: 36, fontWeight: 500, labelPlacement: { position, gap: 0 } })
}
function circle(s, id, center, radius) {
  s.objects.push({ id, type: 'circle', center, radius, stroke: 'ink', strokeWidth: 3.4 })
}
function segment(s, id, from, to, thin = false, dash = 0) {
  s.objects.push({ id, type: 'segment', from, to, stroke: thin ? 'muted' : 'ink', strokeWidth: thin ? 2 : 3.4, dash })
  s.assertions.push({ id: `${id}-connection`, type: 'connects', arrow: id, from, to })
}
function relation(s, id, type, fields) {
  s.assertions.push({ id, type, ...fields, tolerance: 1e-6 })
}
function tick(s, id, a, b, count) {
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy)
  for (let i = 0; i < count; i++) {
    const offset = (i - (count - 1) / 2) * 10
    const cx = (a[0] + b[0]) / 2 + offset * dx / len
    const cy = (a[1] + b[1]) / 2 + offset * dy / len
    segment(s, `${id}-${i + 1}`, [cx - 8 * dy / len, cy + 8 * dx / len], [cx + 8 * dy / len, cy - 8 * dx / len])
  }
}
function exterior(O, r, d, angle = 0) {
  const x = r * r / d, y = Math.sqrt(r * r - x * x)
  const theta = angle * Math.PI / 180
  const p = (x, y) => [O[0] + x * Math.cos(theta) - y * Math.sin(theta), O[1] + x * Math.sin(theta) + y * Math.cos(theta)]
  return { A: p(d, 0), M1: p(x, y), M2: p(x, -y), B1: p(2 * x, 2 * y), B2: p(2 * x, -2 * y) }
}

const s192 = base('fig-192', 1120)
panel(s192, '192-a', observation['fig-192'].panels[0].sourceFacts.join(' ') + ' UNKNOWN oblique dash/glyph identity retained. Exact complete circle and perpendicular-foot interpretation are separately text-justified modern clarity choices; no right-angle square added.', () => {
  text(s192, '192-a-panel', [55, 1060], 'a)')
  const O = [300, 820], A = [290, 958], M = [364, 884]
  point(s192, '192-a-O', O, 'O', 'SW')
  point(s192, '192-a-A', A, 'A', 'NE')
  s192.objects.at(-1).labelPlacement.gap = 30
  point(s192, '192-a-M', M, 'M', 'E')
  circle(s192, '192-a-circle', '192-a-O', 210)
  const H1 = [40, 958], H2 = [656, 958], D1 = [140, 1108], D2 = [586, 662]
  segment(s192, '192-a-horizontal-secant', H1, H2)
  segment(s192, '192-a-oblique-UNKNOWN-dash', D1, D2, true)
  segment(s192, '192-a-OA', '192-a-O', '192-a-A', true)
  segment(s192, '192-a-OM', '192-a-O', '192-a-M', true)
  relation(s192, '192-a-A-on-horizontal', 'pointOnLine', { point: '192-a-A', a: H1, b: H2 })
  relation(s192, '192-a-A-on-oblique', 'pointOnLine', { point: '192-a-A', a: D1, b: D2 })
  relation(s192, '192-a-M-on-oblique', 'pointOnLine', { point: '192-a-M', a: D1, b: D2 })
  relation(s192, '192-a-foot-perpendicular-text-regularization', 'perpendicular', { a: '192-a-O', b: '192-a-M', c: '192-a-A', d: D2 })
  relation(s192, '192-a-interior-distance', 'distance', { a: '192-a-O', b: '192-a-A', value: Math.hypot(10, 138) })
})
panel(s192, '192-b', observation['fig-192'].panels[1].sourceFacts.join(' ') + ' Exact on-circle membership and perpendicular tangent from instructional text.', () => {
  text(s192, '192-b-panel', [55, 505], 'b)')
  point(s192, '192-b-O', [350, 250], 'O', 'SW')
  point(s192, '192-b-A', [350, 460], 'A', 'N')
  circle(s192, '192-b-circle', '192-b-O', 210)
  const P1 = [70, 460], P2 = [656, 460]
  segment(s192, '192-b-tangent-p', P1, P2)
  text(s192, '192-b-p', [650, 497], 'p')
  segment(s192, '192-b-OA', '192-b-O', '192-b-A')
  segment(s192, '192-b-right-angle-1', [350, 440], [370, 440], true)
  segment(s192, '192-b-right-angle-2', [370, 440], [370, 460], true)
  relation(s192, '192-b-contact-on-circle', 'pointOnCircle', { point: '192-b-A', center: '192-b-O', radius: 210 })
  relation(s192, '192-b-contact-on-p', 'pointOnLine', { point: '192-b-A', a: P1, b: P2 })
  relation(s192, '192-b-exact-tangency', 'perpendicular', { a: '192-b-O', b: '192-b-A', c: P1, d: P2 })
})

const s193 = base('fig-193', 1900)
panel(s193, '193-a', observation['fig-193'].panels[0].sourceFacts.join(' ') + ' Exact midpoint, circle contact, equal lengths and tangent perpendicularity are supplied instructional mathematics. Source141 a-shaped prose marker identity remains UNKNOWN; Latin panel mapping is authorized, not pixel certainty.', () => {
  text(s193, '193-a-panel', [55, 1820], 'a)')
  const O = [210, 1530], r = 140
  const { A, M1: M, B1: B } = exterior(O, r, 375, 7)
  point(s193, '193-a-O', O, 'O', 'W')
  point(s193, '193-a-A', A, 'A', 'E')
  point(s193, '193-a-M', M, 'M', 'NW')
  point(s193, '193-a-B', B, 'B', 'NW')
  circle(s193, '193-a-circle', '193-a-O', r)
  segment(s193, '193-a-OM', '193-a-O', '193-a-M')
  segment(s193, '193-a-MB', '193-a-M', '193-a-B')
  segment(s193, '193-a-OA', '193-a-O', '193-a-A')
  segment(s193, '193-a-BA', '193-a-B', '193-a-A')
  segment(s193, '193-a-MA', '193-a-M', '193-a-A')
  tick(s193, '193-a-OM-single', O, M, 1)
  tick(s193, '193-a-MB-single', M, B, 1)
  tick(s193, '193-a-OA-double', O, A, 2)
  tick(s193, '193-a-BA-double', B, A, 2)
  relation(s193, '193-a-contact', 'pointOnCircle', { point: '193-a-M', center: '193-a-O', radius: r })
  relation(s193, '193-a-O-M-B-collinear', 'collinear', { a: '193-a-O', b: '193-a-M', c: '193-a-B' })
  relation(s193, '193-a-midpoint', 'equalDistance', { a: '193-a-O', b: '193-a-M', c: '193-a-M', d: '193-a-B' })
  relation(s193, '193-a-equal-AO-AB', 'equalDistance', { a: '193-a-A', b: '193-a-O', c: '193-a-A', d: '193-a-B' })
  relation(s193, '193-a-tangent', 'perpendicular', { a: '193-a-O', b: '193-a-M', c: '193-a-A', d: '193-a-M' })
})
panel(s193, '193-b', observation['fig-193'].panels[1].sourceFacts.join(' ') + ' Text binds inner r, outer 2r and partial auxiliary circle centered A with radius |OA|. Solid construction strokes remain thin, not dashed.', () => {
  text(s193, '193-b-panel', [55, 1215], 'b)')
  const O = [275, 925], r = 115, d = 370
  const { A, M1, M2, B1, B2 } = exterior(O, r, d, 5)
  point(s193, '193-b-O', O, 'O', 'W')
  point(s193, '193-b-A', A, 'A', 'E')
  point(s193, '193-b-M1', M1, 'M\u2081', 'NE')
  point(s193, '193-b-M2', M2, 'M\u2082', 'SE')
  point(s193, '193-b-B1', B1, 'B\u2081', 'NW')
  point(s193, '193-b-B2', B2, 'B\u2082', 'SW')
  s193.objects.at(-1).labelPlacement.gap = 60
  circle(s193, '193-b-inner-circle', '193-b-O', r)
  circle(s193, '193-b-outer-circle', '193-b-O', 2 * r)
  const polar = deg => [A[0] + d * Math.cos(deg * Math.PI / 180), A[1] + d * Math.sin(deg * Math.PI / 180)]
  s193.objects.push({ id: '193-b-auxiliary-arc', type: 'arc', center: '193-b-A', start: polar(135), end: polar(235), stroke: 'muted', strokeWidth: 2, dash: 0 })
  segment(s193, '193-b-OB1', '193-b-O', '193-b-B1', true)
  segment(s193, '193-b-OB2', '193-b-O', '193-b-B2', true)
  segment(s193, '193-b-AM1', '193-b-A', '193-b-M1')
  segment(s193, '193-b-AM2', '193-b-A', '193-b-M2')
  for (const n of [1, 2]) {
    const B = `193-b-B${n}`, M = `193-b-M${n}`
    relation(s193, `193-b-B${n}-outer`, 'pointOnCircle', { point: B, center: '193-b-O', radius: 2 * r })
    relation(s193, `193-b-B${n}-auxiliary`, 'pointOnCircle', { point: B, center: '193-b-A', radius: d })
    relation(s193, `193-b-M${n}-inner`, 'pointOnCircle', { point: M, center: '193-b-O', radius: r })
    relation(s193, `193-b-O-M${n}-B${n}`, 'collinear', { a: '193-b-O', b: M, c: B })
    relation(s193, `193-b-M${n}-midpoint`, 'equalDistance', { a: '193-b-O', b: M, c: M, d: B })
    relation(s193, `193-b-tangent-${n}`, 'perpendicular', { a: '193-b-O', b: M, c: '193-b-A', d: M })
  }
  relation(s193, '193-b-O-on-auxiliary', 'pointOnCircle', { point: '193-b-O', center: '193-b-A', radius: d })
})
panel(s193, '193-c', observation['fig-193'].panels[2].sourceFacts.join(' ') + ' Exact tangent contacts and equal lengths are supplied prose; no visible radial links or right-angle squares added.', () => {
  text(s193, '193-c-panel', [55, 510], 'c)')
  const O = [245, 250], r = 140
  const { A, M1, M2 } = exterior(O, r, 375)
  point(s193, '193-c-O', O, 'O', 'W')
  point(s193, '193-c-A', A, 'A', 'E')
  point(s193, '193-c-M1', M1, 'M\u2081', 'N')
  point(s193, '193-c-M2', M2, 'M\u2082', 'S')
  circle(s193, '193-c-circle', '193-c-O', r)
  segment(s193, '193-c-OA', '193-c-O', '193-c-A')
  for (const [n, M] of [[1, M1], [2, M2]]) {
    segment(s193, `193-c-AM${n}`, '193-c-A', `193-c-M${n}`)
    segment(s193, `193-c-tangent-${n}-extension`, `193-c-M${n}`, [A[0] + 1.6 * (M[0] - A[0]), A[1] + 1.6 * (M[1] - A[1])])
    tick(s193, `193-c-AM${n}-single`, A, M, 1)
    relation(s193, `193-c-M${n}-contact`, 'pointOnCircle', { point: `193-c-M${n}`, center: '193-c-O', radius: r })
    relation(s193, `193-c-tangent-${n}`, 'perpendicular', { a: '193-c-O', b: `193-c-M${n}`, c: '193-c-A', d: `193-c-M${n}` })
  }
  relation(s193, '193-c-equal-tangent-lengths', 'equalDistance', { a: '193-c-A', b: '193-c-M1', c: '193-c-A', d: '193-c-M2' })
  relation(s193, '193-c-contact-reflection-x', 'displacement', { from: '193-c-M1', to: '193-c-M2', dx: 0, dy: M2[1] - M1[1] })
  relation(s193, '193-c-reflection-bisector', 'perpendicular', { a: '193-c-O', b: '193-c-A', c: '193-c-M1', d: '193-c-M2' })
})
for (const spec of [s192, s193]) {
  write(path.join(root, spec.id, 'spec.json'), spec)
}
write(path.join(root, 'input-bindings.json'), {
  lesson: { path: lessonPath, sha256: hash(lessonPath) },
  sources: [s192, s193].map(s => ({ figure: s.id, ...s.source.image })),
  context: { path: path.join(root, 'context.json'), sha256: hash(path.join(root, 'context.json')) },
  pixelInventory: { path: inventoryPath, sha256: hash(inventoryPath) },
  authorScript: { path: fileURLToPath(import.meta.url), sha256: hash(fileURLToPath(import.meta.url)) }
})
console.log(JSON.stringify({ status: 'DRAFT_AUTHORED', figures: [s192, s193].map(s => ({ id: s.id, objects: s.objects.length, assertions: s.assertions.length, inventoryGroups: s.source.inventory.length })) }, null, 2))

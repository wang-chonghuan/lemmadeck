import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const owner = `${repo}/.intentfold/tickets/STEMROBIN-181/tmp/d743-n82-fig195-first-author`
const oldOwner = `${repo}/tmp/d743-n82-fig195-first-author`
const ticketTmp = `${repo}/.intentfold/tickets/STEMROBIN-181/tmp`
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const write = (name, data) => fs.writeFileSync(path.join(owner, name), `${JSON.stringify(data, null, 2)}\n`)
const inputs = {
  requirements: `${ticketTmp}/d730-source221222-consume-prepare82/preauthor-source-requirements.json`,
  en: `${ticketTmp}/d732-n82-first-bilingual-text-author/candidates/en/phy10-c2-s3-n82/lesson.template.json`,
  zh: `${ticketTmp}/d732-n82-first-bilingual-text-author/candidates/zh/phy10-c2-s3-n82/lesson.template.json`,
}
const requirements = JSON.parse(fs.readFileSync(inputs.requirements, 'utf8'))
const editions = Object.fromEntries(['en', 'zh'].map(locale => [locale, JSON.parse(fs.readFileSync(inputs[locale], 'utf8'))]))
assert.equal(requirements.status, 'SOURCE-CLOSED-PREAUTHOR-FROZEN')
for (const edition of Object.values(editions)) {
  assert.equal(edition.card_id, 'phy10-c2-s3-n82')
  assert.equal(edition.exercise_count, 0)
}
const observation = `${owner}/retained-source-observation.json`
assert.ok(!fs.existsSync(`${owner}/fig-195.spec.json`), 'Do not replay a completed author')
assert.ok(!fs.existsSync(observation), 'Retain only one exact observation copy')
fs.copyFileSync(`${oldOwner}/source-inventory.json`, observation)
assert.equal(hash(observation), hash(`${oldOwner}/source-inventory.json`))

const span = 4.8
const incident = [0.6, -0.8]
const refracted = [0.48, -Math.sqrt(1 - 0.48 ** 2)]
const radius = span * refracted[0]
const A = [0, 0]
const B = [span, 0]
const add = (p, u, t) => [p[0] + u[0] * t, p[1] + u[1] * t]
const C = add(B, incident, -span * incident[0])
const D = add(A, refracted, radius)
const points = {
  M: [-2.6, 0], A, B, N: [7.35, 0],
  A1: add(A, incident, -3.4),
  B1: add(C, incident, -1.6),
  C, D,
  A2: add(A, refracted, 4.7),
  B2: add(B, refracted, 3.05),
}
const objects = []
const assertions = []
const point = (id, labelPlacement) => objects.push({
  id, type: 'point', at: points[id], label: id,
  size: 1.3, strokeWidth: 1, stroke: 'ink', fill: 'ink',
  fontSize: 24, fontWeight: 500, labelPlacement,
})
point('M', { position: 'N', gap: 28 })
point('N', { position: 'N', gap: 28 })
point('A', { position: 'SW', gap: 14, offset: [-3, 5] })
point('B', { position: 'NE', gap: 14, offset: [0, -8] })
point('A1', { position: 'SW', gap: 12, offset: [0, 14] })
point('B1', { position: 'NE', gap: 12 })
point('C', { position: 'NE', gap: 14 })
point('D', { position: 'SE', gap: 14, offset: [30, 15] })
point('A2', { position: 'NE', gap: 14 })
point('B2', { position: 'SW', gap: 14 })
const segment = (id, from, to, stroke = 'ink', strokeWidth = 3) => {
  objects.push({ id, type: 'segment', from, to, stroke, strokeWidth })
  assertions.push({ id: `${id}-connects`, type: 'connects', arrow: id, from, to })
}
segment('interface-MN', 'M', 'N', 'ink', 3.2)
segment('normal-A', [0, 3.65], [0, -3.15], 'muted', 2.8)
segment('incident-A1-A', 'A1', 'A')
segment('incident-B1-B', 'B1', 'B')
segment('refracted-A-A2', 'A', 'A2')
segment('refracted-B-B2', 'B', 'B2')
segment('wavefront-AC', 'A', 'C', 'accent', 3.4)
segment('wavefront-DB', 'D', 'B', 'accent', 3.4)
const arrow = (id, from, to, rayStart, rayEnd) => {
  objects.push({ id, type: 'arrow', from, to, stroke: 'ink', strokeWidth: 3 })
  assertions.push(
    { id: `${id}-connects`, type: 'connects', arrow: id, from, to },
    { id: `${id}-start-on-ray`, type: 'pointOnLine', point: from, a: rayStart, b: rayEnd },
    { id: `${id}-end-on-ray`, type: 'pointOnLine', point: to, a: rayStart, b: rayEnd },
  )
}
arrow('arrow-A1-A', add(points.A1, incident, 0.1), add(points.A1, incident, 0.7), 'A1', 'A')
arrow('arrow-B1-B', add(points.B1, incident, 0.1), add(points.B1, incident, 0.7), 'B1', 'B')
arrow('arrow-A-A2', add(points.A2, refracted, -0.6), 'A2', 'A', 'A2')
arrow('arrow-B-B2', add(points.B2, refracted, -0.6), 'B2', 'B', 'B2')
const wavelets = [
  { id: 'wavelet-A', center: 'A', at: A, radius, contact: D },
  ...[2.52, 3.84].map((x, index) => {
    const r = (span - x) * refracted[0]
    return { id: `wavelet-secondary-${index + 1}`, center: [x, 0], at: [x, 0], radius: r, contact: add([x, 0], refracted, r) }
  }),
]
for (const wavelet of wavelets) {
  const { id, center, at, radius: r, contact } = wavelet
  const start = [at[0] - r, 0]
  const end = [at[0] + r, 0]
  objects.push({ id, type: 'arc', center, start, end, stroke: 'muted', strokeWidth: 2.8 })
  assertions.push(
    { id: `${id}-start-incidence`, type: 'pointOnCircle', point: start, center, radius: r },
    { id: `${id}-end-incidence`, type: 'pointOnCircle', point: end, center, radius: r },
    { id: `${id}-contact-incidence`, type: 'pointOnCircle', point: id === 'wavelet-A' ? 'D' : contact, center, radius: r },
    { id: `${id}-contact-on-DB`, type: 'pointOnLine', point: contact, a: 'D', b: 'B' },
    { id: `${id}-tangent`, type: 'perpendicular', a: center, b: contact, c: 'D', d: 'B' },
    { id: `${id}-center-on-MN`, type: 'pointOnLine', point: center, a: 'M', b: 'N' },
  )
}
const alphaRadius = 0.86
const betaRadius = 0.73
const alphaStart = [0, alphaRadius]
const alphaEnd = [-incident[0] * alphaRadius, -incident[1] * alphaRadius]
const betaStart = [0, -betaRadius]
const betaEnd = add(A, refracted, betaRadius)
objects.push(
  { id: 'angle-alpha', type: 'arc', center: 'A', start: alphaStart, end: alphaEnd, stroke: 'ink', strokeWidth: 2.8 },
  { id: 'angle-beta', type: 'arc', center: 'A', start: betaStart, end: betaEnd, stroke: 'ink', strokeWidth: 2.8 },
  { id: 'alpha', type: 'text', at: [-0.58, 1.32], text: '\u03b1', fontSize: 24, fontWeight: 500, labelPlacement: { position: 'CENTER' } },
  { id: 'beta', type: 'text', at: [0.38, -1.45], text: '\u03b2', fontSize: 24, fontWeight: 500, labelPlacement: { position: 'CENTER' } },
)
assertions.push(
  { id: 'M-A-B-collinear', type: 'collinear', a: 'M', b: 'A', c: 'B' },
  { id: 'A-B-N-collinear', type: 'collinear', a: 'A', b: 'B', c: 'N' },
  { id: 'normal-perpendicular-MN', type: 'perpendicular', a: [0, 3.65], b: [0, -3.15], c: 'M', d: 'N' },
  { id: 'A-on-normal', type: 'pointOnLine', point: 'A', a: [0, 3.65], b: [0, -3.15] },
  { id: 'B1-C-B-collinear', type: 'collinear', a: 'B1', b: 'C', c: 'B' },
  { id: 'A-D-A2-collinear', type: 'collinear', a: 'A', b: 'D', c: 'A2' },
  { id: 'incident-parallel', type: 'parallel', a: 'A1', b: 'A', c: 'B1', d: 'B' },
  { id: 'refracted-parallel', type: 'parallel', a: 'A', b: 'A2', c: 'B', d: 'B2' },
  { id: 'right-triangle-ACB', type: 'perpendicular', a: 'A', b: 'C', c: 'C', d: 'B' },
  { id: 'AC-perpendicular-A1A', type: 'perpendicular', a: 'A', b: 'C', c: 'A1', d: 'A' },
  { id: 'right-triangle-ADB', type: 'perpendicular', a: 'A', b: 'D', c: 'D', d: 'B' },
  { id: 'DB-perpendicular-BB2', type: 'perpendicular', a: 'D', b: 'B', c: 'B', d: 'B2' },
  { id: 'alpha-start-normal', type: 'pointOnLine', point: alphaStart, a: [0, 3.65], b: 'A' },
  { id: 'alpha-end-incident', type: 'pointOnLine', point: alphaEnd, a: 'A1', b: 'A' },
  { id: 'alpha-radius-start', type: 'pointOnCircle', point: alphaStart, center: 'A', radius: alphaRadius },
  { id: 'alpha-radius-end', type: 'pointOnCircle', point: alphaEnd, center: 'A', radius: alphaRadius },
  { id: 'beta-start-normal', type: 'pointOnLine', point: betaStart, a: 'A', b: [0, -3.15] },
  { id: 'beta-end-refracted', type: 'pointOnLine', point: betaEnd, a: 'A', b: 'A2' },
  { id: 'beta-radius-start', type: 'pointOnCircle', point: betaStart, center: 'A', radius: betaRadius },
  { id: 'beta-radius-end', type: 'pointOnCircle', point: betaEnd, center: 'A', radius: betaRadius },
  { id: 'four-source-arrowheads', type: 'objectCount', objectType: 'arrow', count: 4 },
  { id: 'three-wavelets-two-angle-arcs', type: 'objectCount', objectType: 'arc', count: 5 },
)
for (const [from, to] of [['M', 'A'], ['A', 'B'], ['B', 'N'], ['B1', 'C'], ['C', 'B'], ['A', 'D'], ['D', 'A2']]) {
  assertions.push({ id: `${from}-${to}-ordered-displacement`, type: 'displacement', from, to, dx: points[to][0] - points[from][0], dy: points[to][1] - points[from][1] })
}
const retained = JSON.parse(fs.readFileSync(observation, 'utf8'))
const group = (index, mappedObjects, mappedAssertions) => ({
  id: retained.inventory[index].id,
  description: retained.inventory[index].description,
  objects: mappedObjects,
  assertions: mappedAssertions,
  requires: ['pointRelationships'],
})
const waveletAssertions = assertions.filter(item => item.id.startsWith('wavelet-')).map(item => item.id)
const inventory = [
  group(0, ['M', 'A', 'B', 'N', 'interface-MN', 'normal-A'], ['M-A-B-collinear', 'A-B-N-collinear', 'M-A-ordered-displacement', 'A-B-ordered-displacement', 'B-N-ordered-displacement', 'interface-MN-connects', 'normal-perpendicular-MN', 'A-on-normal']),
  group(1, ['A1', 'A', 'B1', 'C', 'B', 'incident-A1-A', 'incident-B1-B', 'wavefront-AC', 'arrow-A1-A', 'arrow-B1-B'], ['incident-A1-A-connects', 'incident-B1-B-connects', 'wavefront-AC-connects', 'B1-C-B-collinear', 'B1-C-ordered-displacement', 'C-B-ordered-displacement', 'incident-parallel', 'right-triangle-ACB', 'AC-perpendicular-A1A', 'arrow-A1-A-connects', 'arrow-B1-B-connects', 'arrow-A1-A-start-on-ray', 'arrow-A1-A-end-on-ray', 'arrow-B1-B-start-on-ray', 'arrow-B1-B-end-on-ray']),
  group(2, ['A', 'B', 'D', 'A2', 'B2', 'refracted-A-A2', 'refracted-B-B2', 'wavefront-DB', 'arrow-A-A2', 'arrow-B-B2'], ['refracted-A-A2-connects', 'refracted-B-B2-connects', 'wavefront-DB-connects', 'A-D-A2-collinear', 'A-D-ordered-displacement', 'D-A2-ordered-displacement', 'refracted-parallel', 'right-triangle-ADB', 'DB-perpendicular-BB2', 'arrow-A-A2-connects', 'arrow-B-B2-connects', 'arrow-A-A2-start-on-ray', 'arrow-A-A2-end-on-ray', 'arrow-B-B2-start-on-ray', 'arrow-B-B2-end-on-ray']),
  group(3, ['A', 'B', 'C', 'D', 'interface-MN', 'wavefront-AC', 'wavefront-DB', ...wavelets.map(item => item.id)], ['right-triangle-ACB', 'right-triangle-ADB', 'wavefront-AC-connects', 'wavefront-DB-connects', ...waveletAssertions]),
  group(4, ['A', 'A1', 'A2', 'normal-A', 'angle-alpha', 'angle-beta', 'alpha', 'beta'], ['incident-A1-A-connects', 'refracted-A-A2-connects', ...assertions.filter(item => /^(alpha|beta)-/.test(item.id)).map(item => item.id)]),
  group(5, ['A1', 'A', 'B1', 'B', 'A2', 'B2', 'arrow-A1-A', 'arrow-B1-B', 'arrow-A-A2', 'arrow-B-B2'], ['four-source-arrowheads', 'incident-A1-A-connects', 'incident-B1-B-connects', 'refracted-A-A2-connects', 'refracted-B-B2-connects', ...assertions.filter(item => item.id.startsWith('arrow-')).map(item => item.id)]),
]
const authoritativeText = ['en', 'zh'].flatMap(locale => editions[locale].prose
  .filter(item => typeof item.text === 'string' && item.text.trim())
  .map(item => ({ lesson: `phy10-c2-s3-n82:${locale}`, text: item.text })))
const spec = {
  schema: 'ld-s10y-image/figure-spec@2', id: 'fig-195', mode: 'deterministic',
  description: 'The source wavefront construction of refraction: one shared interface MN, incoming wavefront AC, outgoing tangent DB, right triangles ACB and ADB, four directed rays and three secondary wavelets. This is the schematic slower-second-medium case, not measured numerical data.',
  source: {
    image: { path: retained.source.path, sha256: retained.source.sha256 },
    authoritativeText, inventory,
  },
  canvas: { width: 640, height: 600, boundingBox: [-2.85, 4.5, 7.816666666666666, -5.5], background: 'paper', keepAspectRatio: true },
  display: { layout: 'scroll', purpose: 'instructional', minTextPx: 16, widths: [640] },
  objects, assertions, layout: { minLabelGap: 3 },
}
write('fig-195.spec.json', spec)
write('inventory-mapping.json', {
  schema: 'd743/source-inventory-mapping@1',
  independentObservation: { path: observation, sha256: hash(observation), copiedExactlyOnce: true, originalOpenCount: 1 },
  originalFailure: { path: `${oldOwner}/first-fail.json`, sha256: hash(`${oldOwner}/first-fail.json`), resolvedCause: 'Incorrect repo/tmp path; corrected by direct human instruction to ticket/tmp. Inputs were not missing.' },
  mappedGroups: inventory,
  modernRegularization: [
    'Exact straight lines, isotropic circular arcs and derived tangent contacts replace scanned stroke irregularities.',
    'Small endpoint/intersection dots, sans-serif ASCII point labels and Greek mathematical angle symbols.',
    'Internal layout coordinates and schematic direction ratios are not source measured values; no invented numbers are displayed.',
  ],
  approval: 'none',
})
write('inputs.json', Object.fromEntries(Object.entries(inputs).map(([name, file]) => [name, { path: file, sha256: hash(file) }])))
console.log(`AUTHORED: ${owner}/fig-195.spec.json (${objects.length} objects; ${assertions.length} native assertions; ${authoritativeText.length} complete modern text blocks)`)

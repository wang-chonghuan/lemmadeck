import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const root = process.cwd()
const owned = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d577-n75-fig164165-first-modern-author')
const hash = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'))
const save = (p, value) => {
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const manifestPath = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d572-n75-first-figure-contexts/manifest.json')
if (hash(manifestPath) !== '1181e47dc32d727dd8c83ddead74ca7c01f76d07e33b331b2de46ca491855936') throw Error('Context manifest changed')
const manifest = read(manifestPath)
const bound = [manifest.fullEN, manifest.fullZH, manifest.textReview]
for (const entry of bound) if (hash(entry.path) !== entry.sha256) throw Error(`Changed authority: ${entry.path}`)
const textReview = read(manifest.textReview.path)
if (textReview.SCI !== 'PASS' || textReview.ZHEN !== 'PASS') throw Error('Inherited text review is not PASS')
const en = read(manifest.fullEN.path)
const zh = read(manifest.fullZH.path)
const authoritativeText = [en, zh].flatMap((lesson, language) => lesson.prose
  .flatMap((block, index) => block.text ? [{
    lesson: lesson.id,
    text: `${language === 0 ? 'EN' : 'ZH'} /prose/${index}/text\n${block.text}`,
  }] : []))
const font = 32
const text = (id, at, value, extra = {}) => ({
  id, type: 'text', at, text: value, fontSize: font,
  fontWeight: 500, labelPlacement: { position: 'CENTER' }, ...extra,
})
const display = { layout: 'inline', purpose: 'instructional', maxWidthPx: 640, minTextPx: 16, widths: [331, 342, 640] }
const distance = (id, a, b, value) => ({ id, type: 'distance', a, b, value, tolerance: 1e-7 })
const circle = (id, point, center, radius) => ({ id, type: 'pointOnCircle', point, center, radius, tolerance: 1e-7 })
const connects = (object) => ({ id: `${object.id}-connects`, type: 'connects', arrow: object.id, from: object.from, to: object.to })
const group = (id, description, objects, assertions, requires = []) => ({ id, description, objects, assertions, ...(requires.length ? { requires } : {}) })
const base = (id, description, canvas, inventory, objects, assertions) => ({
  schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic', description,
  source: {
    image: manifest.contexts.find((entry) => entry.figure === id).originalImage,
    authoritativeText, inventory,
  },
  canvas: { ...canvas, background: 'paper', keepAspectRatio: true },
  display, objects, assertions, layout: { minLabelGap: 4 },
})

const c1 = [1, 0]
const c2 = [11, 0]
const r1 = 8.3
const r2 = 4.9
const vertexA = [c2[0] - r2, 0]
const vertexB = [c1[0] + r1, 0]
const tipX = c1[0] + (r1 ** 2 - r2 ** 2 + 10 ** 2) / 20
const tipY = Math.sqrt(r1 ** 2 - (tipX - c1[0]) ** 2)
const top = [tipX, tipY]
const bottom = [tipX, -tipY]
const radiusEnd1 = [c1[0] + Math.sqrt(r1 ** 2 - 2.3 ** 2), 2.3]
const radiusEnd2 = [c2[0] - Math.sqrt(r2 ** 2 - 1.8 ** 2), -1.8]
const side1 = []
const side2 = []
for (let index = 0; index <= 96; index += 1) {
  const y = -tipY + 2 * tipY * index / 96
  side1.push([c1[0] + Math.sqrt(r1 ** 2 - y ** 2), y])
  side2.push([c2[0] - Math.sqrt(r2 ** 2 - y ** 2), y])
}
const points164 = [
  { id: 's164-o1', at: c1, label: 'O1', labelPlacement: { position: 'S', gap: 30 } },
  { id: 's164-o2', at: c2, label: 'O2', labelPlacement: { position: 'S', gap: 30 } },
  { id: 's164-o', at: [7.6, 0], label: 'O', labelPlacement: { position: 'N', gap: 30 } },
  { id: 's164-a', at: vertexA, label: 'A', labelPlacement: { position: 'SW', gap: 26 } },
  { id: 's164-b', at: vertexB, label: 'B', labelPlacement: { position: 'NE', gap: 26 } },
].map((p) => ({ type: 'point', fontSize: font, size: 3, fill: 'ink', stroke: 'ink', ...p }))
const edges164 = [
  { id: 's164-axis', type: 'segment', from: [0.35, 0], to: [12.3, 0], stroke: 'muted', strokeWidth: 3 },
  { id: 's164-radius1', type: 'arrow', from: 's164-o1', to: radiusEnd1, stroke: 'accent', strokeWidth: 4 },
  { id: 's164-radius2', type: 'arrow', from: 's164-o2', to: radiusEnd2, stroke: 'accent', strokeWidth: 4 },
  { id: 'm164-thickness', type: 'segment', from: [vertexA[0], -4.65], to: [vertexB[0], -4.65], stroke: 'accent', strokeWidth: 3 },
  { id: 'm164-guide-a', type: 'segment', from: 's164-a', to: [vertexA[0], -4.65], stroke: 'muted', strokeWidth: 1.5, dash: 2 },
  { id: 'm164-guide-b', type: 'segment', from: 's164-b', to: [vertexB[0], -4.65], stroke: 'muted', strokeWidth: 1.5, dash: 2 },
  ...[vertexA, vertexB].map((p, index) => ({
    id: `m164-cap-${index}`, type: 'segment', from: [p[0], -4.49], to: [p[0], -4.81], stroke: 'accent', strokeWidth: 3,
  })),
]
const objects164 = [
  { id: 's164-material', type: 'polygon', points: [...side1, ...side2.reverse()], fill: 'accentSoft', fillOpacity: 0.18, stroke: 'accentSoft', strokeWidth: 0.1 },
  ...points164,
  { id: 's164-left-surface', type: 'arc', center: 's164-o2', start: top, end: bottom, stroke: 'ink', strokeWidth: 4 },
  { id: 's164-right-surface', type: 'arc', center: 's164-o1', start: bottom, end: top, stroke: 'ink', strokeWidth: 4 },
  ...edges164,
  text('s164-r1-label', [(c1[0] + radiusEnd1[0]) / 2, 1.15], 'R1', { labelPlacement: { position: 'N', gap: 30 } }),
  text('s164-r2-label', [(c2[0] + radiusEnd2[0]) / 2, -0.9], 'R2', { labelPlacement: { position: 'S', gap: 30 } }),
  text('m164-thickness-label', [(vertexA[0] + vertexB[0]) / 2, -5.3], 'l = |AB|'),
  text('m164-axis-label', [2.95, -1.65], 'Principal axis', { labelColor: 'muted' }),
]
const assertions164 = [
  ...['s164-a', 's164-o', 's164-b'].map((p) => ({ id: `${p}-on-axis`, type: 'collinear', a: 's164-o1', b: p, c: 's164-o2' })),
  { id: 's164-order-a', type: 'displacement', from: 's164-o1', to: 's164-a', dx: vertexA[0] - c1[0], dy: 0 },
  { id: 's164-order-o', type: 'displacement', from: 's164-a', to: 's164-o', dx: 7.6 - vertexA[0], dy: 0 },
  { id: 's164-order-b', type: 'displacement', from: 's164-o', to: 's164-b', dx: vertexB[0] - 7.6, dy: 0 },
  { id: 's164-order-o2', type: 'displacement', from: 's164-b', to: 's164-o2', dx: c2[0] - vertexB[0], dy: 0 },
  circle('s164-vertex-a-on-left', 's164-a', 's164-o2', r2),
  circle('s164-vertex-b-on-right', 's164-b', 's164-o1', r1),
  circle('s164-top-on-left', top, 's164-o2', r2),
  circle('s164-top-on-right', top, 's164-o1', r1),
  circle('s164-bottom-on-left', bottom, 's164-o2', r2),
  circle('s164-bottom-on-right', bottom, 's164-o1', r1),
  circle('s164-r1-ends-on-right', radiusEnd1, 's164-o1', r1),
  circle('s164-r2-ends-on-left', radiusEnd2, 's164-o2', r2),
  distance('s164-radius1-length', 's164-o1', radiusEnd1, r1),
  distance('s164-radius2-length', 's164-o2', radiusEnd2, r2),
  distance('s164-thickness-ab', 's164-a', 's164-b', vertexB[0] - vertexA[0]),
  { id: 's164-o-inside', type: 'inside', point: 's164-o', container: 's164-material', margin: 0.2 },
  { id: 'm164-bracket-matches-ab', type: 'equalDistance', a: 's164-a', b: 's164-b', c: edges164[3].from, d: edges164[3].to },
  { id: 'm164-bracket-parallel-ab', type: 'parallel', a: 's164-a', b: 's164-b', c: edges164[3].from, d: edges164[3].to },
  { id: 's164-named-point-count', type: 'objectCount', objectType: 'point', count: 5 },
  { id: 's164-surface-count', type: 'objectCount', objectType: 'arc', count: 2 },
  ...edges164.map(connects),
]
const inv164 = read(path.join(owned, 'fig-164/source-inventory.json'))
const groups164 = [
  group('s164-lens',
    `Independent sealed pixel inventory SHA ${hash(path.join(owned, 'fig-164/source-inventory.json'))}: one lens, five named points, seven readable source labels, one principal axis, two radius segments, two curved surfaces, two joined tips. O1 and O2 are curvature centers. Hatch stroke count and exact heavy arrow strokes remain HOLD; material shading is regularized, not pixel stroke replication.`,
    ['s164-material', 's164-left-surface', 's164-right-surface', ...points164.map((p) => p.id), 's164-axis', 's164-radius1', 's164-radius2', 's164-r1-label', 's164-r2-label'],
    assertions164.filter((a) => a.id.startsWith('s164')).map((a) => a.id), ['pointRelationships']),
  group('m164-edition-thickness',
    'MODERN ADDITION from complete EN/ZH prose /prose/12 and /prose/14: external l = |AB| bracket and vertex guides. Not a recovered visible l source label. O remains an illustrative thin-lens reference; finite drawn thickness is not a thick-lens nodal construction.',
    ['s164-a', 's164-b', ...edges164.filter((o) => o.id.startsWith('m164')).map((o) => o.id), 'm164-thickness-label'],
    ['s164-thickness-ab', 'm164-bracket-matches-ab', 'm164-bracket-parallel-ab', ...edges164.filter((o) => o.id.startsWith('m164')).map((o) => `${o.id}-connects`)], ['pointRelationships']),
  group('m164-axis-translation', 'MODERN ADDITION: English principal-axis caption for the source shared axis; no secondary axis or rays added.',
    ['s164-axis', 'm164-axis-label'], ['s164-axis-connects']),
]
const spec164 = base('fig-164',
  'Inspect the spherical curvature centers O1/O2, their shared principal axis, surface vertices A/B, radii R1/R2 and edition-defined thickness l = |AB|. O is distinct from curvature centers. Source counts are preserved; no light-ray claim is drawn.',
  { width: 640, height: 600, boundingBox: [0, 6.1, 13, -6.0875] }, groups164, objects164, assertions164)

const objects165 = []
const assertions165 = []
const groups165 = []
const profiles = [
  { id: 's165-left', tipX: 88, leftSag: 20, rightSag: 55, leftSign: 1, label: 'Meniscus', labelX: 125 },
  { id: 's165-middle', tipX: 308, leftSag: 27, rightSag: 42, leftSign: -1, label: 'Biconvex', labelX: 320 },
  { id: 's165-right', tipX: 508, leftSag: 0, rightSag: 49, leftSign: 0, label: 'Plano-convex', labelX: 529 },
]
const h = 110
const cy = 220
for (const profile of profiles) {
  const ptop = [profile.tipX, cy + h]
  const pbottom = [profile.tipX, cy - h]
  const lr = profile.leftSag ? (h ** 2 + profile.leftSag ** 2) / (2 * profile.leftSag) : null
  const rr = (h ** 2 + profile.rightSag ** 2) / (2 * profile.rightSag)
  const lc = profile.leftSign === 1
    ? profile.tipX + profile.leftSag - lr
    : profile.tipX - profile.leftSag + lr
  const rc = profile.tipX + profile.rightSag - rr
  const leftX = (y) => profile.leftSign === 0 ? profile.tipX
    : lc + profile.leftSign * Math.sqrt(lr ** 2 - y ** 2)
  const rightX = (y) => rc + Math.sqrt(rr ** 2 - y ** 2)
  const left = []
  const right = []
  for (let index = 0; index <= 96; index += 1) {
    const y = -h + 2 * h * index / 96
    left.push([leftX(y), cy + y])
    right.push([rightX(y), cy + y])
  }
  const region = { id: `${profile.id}-material`, type: 'polygon', points: [...left, ...right.reverse()], fill: 'accentSoft', fillOpacity: 0.18, stroke: 'accentSoft', strokeWidth: 0.1 }
  const boundaryLeft = profile.leftSign === 0
    ? { id: `${profile.id}-left-boundary`, type: 'segment', from: ptop, to: pbottom, stroke: 'ink', strokeWidth: 4 }
    : { id: `${profile.id}-left-boundary`, type: 'arc', center: [lc, cy], start: profile.leftSign === 1 ? pbottom : ptop, end: profile.leftSign === 1 ? ptop : pbottom, stroke: 'ink', strokeWidth: 4 }
  const boundaryRight = { id: `${profile.id}-right-boundary`, type: 'arc', center: [rc, cy], start: pbottom, end: ptop, stroke: 'ink', strokeWidth: 4 }
  objects165.push(region, boundaryLeft, boundaryRight)
  const local = [
    distance(`${profile.id}-central-thickness`, [leftX(0), cy], [rightX(0), cy], rightX(0) - leftX(0)),
    distance(`${profile.id}-upper-thickness`, [leftX(h * 0.9), cy + h * 0.9], [rightX(h * 0.9), cy + h * 0.9], rightX(h * 0.9) - leftX(h * 0.9)),
    distance(`${profile.id}-lower-thickness`, [leftX(-h * 0.9), cy - h * 0.9], [rightX(-h * 0.9), cy - h * 0.9], rightX(-h * 0.9) - leftX(-h * 0.9)),
    distance(`${profile.id}-top-join`, left[96], right[0], 0),
    distance(`${profile.id}-bottom-join`, left[0], right[96], 0),
    circle(`${profile.id}-right-top`, ptop, [rc, cy], rr),
    circle(`${profile.id}-right-bottom`, pbottom, [rc, cy], rr),
  ]
  if (profile.leftSign !== 0) local.push(
    circle(`${profile.id}-left-top`, ptop, [lc, cy], lr),
    circle(`${profile.id}-left-bottom`, pbottom, [lc, cy], lr),
  )
  else local.push(connects(boundaryLeft), {
    id: `${profile.id}-plane-vertical`, type: 'displacement', from: pbottom, to: ptop, dx: 0, dy: h * 2,
  })
  if (!(local[0].value > local[1].value && local[0].value > local[2].value && local[1].value > 0)) throw Error(`${profile.id} is not central-thicker`)
  assertions165.push(...local)
  groups165.push(group(profile.id,
    `${profile.id}: independently observed profile in its original left-to-right slot; closed ${profile.label.toLowerCase()} boundaries, center thicker than both ends, hatch detail HOLD. Counts and classification come from sealed PNG inventory, not an old spec. Native distances pin the center and two near-edge thicknesses; joined tips and spherical surfaces are executable.`,
    [region.id, boundaryLeft.id, boundaryRight.id], local.map((a) => a.id)))
}
objects165.push(
  text('m165-medium-label', [320, 401], 'Glass lenses in air'),
  ...profiles.map((p) => text(`${p.id}-modern-label`, [p.labelX, 53], p.label)),
)
assertions165.push(
  { id: 's165-profile-count', type: 'objectCount', objectType: 'polygon', count: 3 },
  { id: 's165-curved-boundary-count', type: 'objectCount', objectType: 'arc', count: 5 },
  { id: 's165-straight-boundary-count', type: 'objectCount', objectType: 'segment', count: 1 },
  { id: 's165-single-row', type: 'collinear', a: [88, cy], b: [308, cy], c: [508, cy] },
  { id: 'm165-first-gap', type: 'displacement', from: [88, cy], to: [308, cy], dx: 220, dy: 0 },
  { id: 'm165-second-gap', type: 'displacement', from: [308, cy], to: [508, cy], dx: 200, dy: 0 },
)
groups165.push(group('s165-order',
  `Sealed independent source inventory SHA ${hash(path.join(owned, 'fig-165/source-inventory.json'))}: EXACTLY three profiles in one row, five curved and one straight boundary, six joined tips, zero named points, zero source labels, zero rays. Preserve meniscus / biconvex / plano-convex order. No lattice is present; row/column language describes layout, not a grid.`,
  profiles.map((p) => `${p.id}-material`), ['s165-profile-count', 's165-curved-boundary-count', 's165-straight-boundary-count', 's165-single-row']))
groups165.push(group('m165-edition-labels',
  'MODERN ADDITIONS: English profile names, glass-in-air qualification from complete EN/ZH /prose/10, regularized heights and spacing, neutral semantic material fill replacing unresolved hatch strokes. Geometry is a sectional diagram, not a photograph, icon or ray experiment.',
  ['m165-medium-label', ...profiles.map((p) => `${p.id}-modern-label`)], ['m165-first-gap', 'm165-second-gap']))
const spec165 = base('fig-165',
  'Compare the three source central-thicker converging profiles for glass lenses in air: meniscus, biconvex and plano-convex, preserving their order and actual source profile count. No rays, focal points or numerical optical properties are invented.',
  { width: 640, height: 440, boundingBox: [0, 440, 640, 0] }, groups165, objects165, assertions165)

for (const [id, spec] of [['fig-164', spec164], ['fig-165', spec165]]) {
  const entry = manifest.contexts.find((c) => c.figure === id)
  if (hash(entry.context.path) !== entry.context.sha256 || hash(entry.originalImage.path) !== entry.originalImage.sha256) throw Error(`Changed input: ${id}`)
  const inventoryPath = path.join(owned, id, 'source-inventory.json')
  if ((fs.statSync(inventoryPath).mode & 0o777) !== 0o444) throw Error('Original inventory not sealed')
  save(path.join(owned, id, 'first/spec.json'), spec)
}
const provenance = {
  schema: 'd577-author-provenance@1', ticket: 'STEMROBIN-181', batch: 'd577', card: en.id,
  ownedDirectory: owned, authorityManifest: { path: manifestPath, sha256: hash(manifestPath) },
  fullEN: manifest.fullEN, fullZH: manifest.fullZH, textReview: manifest.textReview,
  contexts: manifest.contexts.filter((c) => ['fig-164', 'fig-165'].includes(c.figure)),
  completeAuthority: { enBlocks: en.prose.length, zhBlocks: zh.prose.length, boundNonemptyTexts: authoritativeText.length, scope: 'Full current edition prose, not context-window snippets or source.data alone' },
  inventorySealedBeforeContextOrGeometry: true,
  firstSourceObservations: [
    { figure: 'fig-164', open: 1, inventorySha256: hash(path.join(owned, 'fig-164/source-inventory.json')) },
    { figure: 'fig-165', open: 2, inventorySha256: hash(path.join(owned, 'fig-165/source-inventory.json')) },
  ],
  source164DimensionDisclosure: {
    preservedInventoryReportedHeight: 332, actualPngHeight: 334, actualPngWidth: 444,
    finding: 'First visual inventory estimated 332 displayed rows. Later metadata-only sips confirms 334 actual PNG rows. Sealed first bytes remain unchanged; geometry and source hash do not depend on that estimate.',
    cropOrReopen: false,
  },
  routes: { 'fig-164': 'deterministic JSXGraph native arcs / points / segments / arrows / sampled material polygon', 'fig-165': 'deterministic JSXGraph native spherical arcs / one straight segment / sampled material polygons' },
  sourceCounts: { 'fig-164': inv164.sourceCount, 'fig-165': read(path.join(owned, 'fig-165/source-inventory.json')).sourceCount },
  geometry: {
    'fig-164': { centers: { O1: c1, O2: c2 }, vertices: { A: vertexA, B: vertexB }, tipCoordinates: [top, bottom], radiusEndpoints: [radiusEnd1, radiusEnd2], radii: { R1: r1, R2: r2 }, thickness: vertexB[0] - vertexA[0], scaleIsModernRegularizationNotSourceGiven: true },
    'fig-165': profiles.map((p) => ({ sourceId: p.id, sourceOrder: profiles.indexOf(p) + 1, boundaryTypes: [p.leftSign === 0 ? 'plane' : 'spherical', 'spherical'], thicknessAssertions: assertions165.filter((a) => a.id.startsWith(p.id) && a.id.endsWith('thickness')) })),
  },
  additions: {
    'fig-164': ['English principal-axis caption', 'Edition-defined external l = |AB| bracket with guides and caps', 'Neutral semantic fill in place of unresolved hatch stroke count', 'Exact unequal circular arcs, clean point markers and dimensionless coordinates, not asserted pixel measurements'],
    'fig-165': ['English profile captions and glass-in-air header', 'Regularized height / spacing and circular curvature', 'Neutral semantic fill in place of unresolved hatch stroke count'],
  },
  holdsPreserved: [
    'All preexisting original fine-detail FAIL/HOLD; no reclassification or retest',
    'Exact source hatch strokes and heavy radius arrow construction unresolved',
    'Source201 ordering qualification is inherited, not repaired or hidden',
  ],
  SCI: 'PASS-INHERITED-NOT-REPLAYED', ZHEN: 'PASS-INHERITED-NOT-REPLAYED',
  FIG: 'pending independent review', DISPLAY: 'pending independent review', completeCard: false,
  oldSpecsRead: false, gitCommands: 0, dbActions: 0, deployActions: 0, paidCalls: 0,
}
save(path.join(owned, 'provenance.json'), provenance)
console.log(JSON.stringify({ authored: ['fig-164', 'fig-165'], nativeSpecs: ['fig-164/first/spec.json', 'fig-165/first/spec.json'], paidCalls: 0 }))

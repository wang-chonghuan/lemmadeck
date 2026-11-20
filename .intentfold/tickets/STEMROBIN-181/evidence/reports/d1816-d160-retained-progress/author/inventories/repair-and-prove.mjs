import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), cwd)
const author = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d160-fig11-classification-author')
const outputs = path.join(cwd, '.tmp/STEMROBIN-181/d1816-d160/figures/fig-11')
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const binding = (file) => {
  const bytes = fs.readFileSync(file)
  return { path: file, bytes: bytes.length, sha256: hash(bytes) }
}
const write = (file, data) => fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
const freezePath = path.join(author, 'input-freeze.json')
assert.equal(binding(freezePath).sha256, 'e843ad8637a9559ee4f238912f4fadd469a180c8af614b29c39901fd79c19398')
const freeze = JSON.parse(fs.readFileSync(freezePath))
for (const input of [...Object.values(freeze).filter((value) => value?.path), ...freeze.nativeContractFiles]) {
  assert.deepEqual(binding(input.path), input)
}
const observedPath = path.join(author, 'inventories/fig-11.source-first.json')
const observed = JSON.parse(fs.readFileSync(observedPath))
assert.equal(observed.classification.axisAligned2DGridObserved, false)
assert.equal(observed.budgets.contentRepairsUsedAtRecord, 0)
assert.equal(observed.visibleSlots.length, 26)
const baseline = JSON.parse(fs.readFileSync(freeze.baseline.path))
const context = JSON.parse(fs.readFileSync(freeze.figureContext.path))
assert.deepEqual(
  baseline.source.authoritativeText.map((item) => item.text),
  [context.languages.zh.fullText, context.languages.en.fullText],
)
const originalFailure = JSON.parse(fs.readFileSync(freeze.originalFailure.path))
assert.deepEqual(binding(originalFailure.nativeReceipt.path), originalFailure.nativeReceipt)

const rows = { top: 0, middle: 1, bottom: 2 }
const columns = { left: 0, middle: 1, right: 2 }
const layers = { front: 'front', middle: 'middle', rear: 'back' }
const expectedSites = observed.visibleSlots.map((slot) => ({
  ...slot,
  id: `${layers[slot.layer]}-r${rows[slot.row]}-c${columns[slot.column]}`,
}))
const pointObjects = baseline.objects.filter((object) => object.type === 'point')
assert.deepEqual(pointObjects.map((point) => point.id).sort(), expectedSites.map((site) => site.id).sort())
assert.equal(baseline.objects.some((object) => object.type === 'grid'), false)
const byId = new Map(baseline.objects.map((object) => [object.id, object]))
const assertionsById = new Map(baseline.assertions.map((item) => [item.id, item]))
const segments = baseline.objects.filter((object) => object.type === 'segment')
const expectedEdges = []
const add = (id, from, to) => expectedEdges.push({ id, from, to })
for (const layer of Object.values(layers)) {
  for (let row = 0; row < 3; row += 1) {
    const sites = [0, 1, 2].map((column) => `${layer}-r${row}-c${column}`).filter((id) => byId.has(id))
    for (let index = 1; index < sites.length; index += 1) add(`row-${layer}-${row}-${index}`, sites[index - 1], sites[index])
  }
  for (let column = 0; column < 3; column += 1) {
    const sites = [0, 1, 2].map((row) => `${layer}-r${row}-c${column}`).filter((id) => byId.has(id))
    for (let index = 1; index < sites.length; index += 1) add(`column-${layer}-${column}-${index}`, sites[index - 1], sites[index])
  }
}
for (let row = 0; row < 3; row += 1) {
  for (let column = 0; column < 3; column += 1) {
    add(`depth-${row}-${column}-front-middle`, `front-r${row}-c${column}`, `middle-r${row}-c${column}`)
    const back = `back-r${row}-c${column}`
    // Preserve the existing projected rod terminal, not a hidden marker or ideal site.
    add(`depth-${row}-${column}-middle-back`, `middle-r${row}-c${column}`, byId.has(back) ? back : [288, 286])
  }
}
assert.equal(expectedEdges.length, 52)
assert.equal(segments.length, 52)
assert.deepEqual(segments.map((segment) => segment.id).sort(), expectedEdges.map((edge) => edge.id).sort())
const resolve = (reference) => typeof reference === 'string' ? byId.get(reference).at : reference
const edgeProof = expectedEdges.map((edge) => {
  const segment = byId.get(edge.id)
  assert.deepEqual({ id: segment.id, from: segment.from, to: segment.to }, edge)
  const connects = assertionsById.get(`${edge.id}-connects`)
  const displacement = assertionsById.get(`${edge.id}-projected-displacement`)
  assert.equal(connects.type, 'connects')
  assert.equal(connects.arrow, edge.id)
  assert.deepEqual([connects.from, connects.to], [edge.from, edge.to])
  assert.equal(displacement.type, 'displacement')
  assert.deepEqual([displacement.from, displacement.to], [edge.from, edge.to])
  const from = resolve(edge.from)
  const to = resolve(edge.to)
  assert.equal(displacement.dx, to[0] - from[0])
  assert.equal(displacement.dy, to[1] - from[1])
  assert.equal(segment.dash, ['column-back-0-1', 'column-back-0-2'].includes(edge.id) ? 2 : 0)
  return { ...edge, connects: connects.id, displacement: displacement.id, dx: displacement.dx, dy: displacement.dy, dash: segment.dash }
})
assert.equal(baseline.assertions.filter((item) => item.type === 'connects').length, 52)
assert.equal(baseline.assertions.filter((item) => item.type === 'displacement').length, 52)
assert.equal(pointObjects.filter((point) => point.fill === 'ink').length, 13)
assert.equal(pointObjects.filter((point) => point.fill === 'paper').length, 13)

const spec = structuredClone(baseline)
spec.description = 'Source-faithful oblique projected point-edge graph of a table-salt ionic crystal. Three finite layers each retain three row and three column slots; 26 separately visible source sites have two marker appearances. All 52 rods and projected displacements, including rear dashed portions and occluded continuations, remain in the original uncalibrated projection. No axis-aligned two-dimensional grid, hidden marker, or measured three-dimensional geometry is asserted.'
const shared = spec.source.inventory[0]
assert.deepEqual(shared.requires, ['pointRelationships', 'gridDimensions'])
shared.requires = ['pointRelationships']
shared.description = 'Fresh D160 PNG classification: a projected finite point-edge graph, not an axis-aligned two-dimensional grid. Front/middle/rear layers have three row and three column slots, with visible row counts 3/3/3, 3/3/3, and 3/2/3. The rear middle-row middle-column slot has no separately visible marker: retain the observed spanning row/column rods and the existing projected occluded continuation terminal without adding a point. Preserve all 26 filled/open sites (13 each), all 52 connectors and their 52 projected displacements, and both rear-left dashed column portions. Layer/row/column names describe source slots, not calibrated three-dimensional coordinates. Native pointRelationships covers every point wholly within this group; supplemental source-bound structural proof checks the exact slots and adjacency.'
const connectorCount = { id: 'visible-source-connector-count', type: 'objectCount', objectType: 'segment', count: 52 }
spec.assertions.push(connectorCount)
shared.assertions.push(connectorCount.id)
for (const [sourceLayer, layer] of Object.entries(layers)) {
  const sites = expectedSites.filter((site) => site.layer === sourceLayer)
  const edges = expectedEdges.filter((edge) => edge.id.startsWith(`row-${layer}-`) || edge.id.startsWith(`column-${layer}-`))
  spec.source.inventory.push({
    id: `salt-${layer}-finite-slots`,
    description: `Source ${sourceLayer} layer: three row slots by three column slots; visible row counts ${sourceLayer === 'rear' ? '3/2/3 with no separately visible middle-row middle-column marker' : '3/3/3'}. Retain ${sites.length} observed sites and ${edges.length} row/column rods in their irregular projected positions. Each mapped point has a wholly in-layer native relationship. These slots are not an axis-aligned grid object.`,
    objects: [...sites.map((site) => site.id), ...edges.map((edge) => edge.id)],
    assertions: edges.flatMap((edge) => [`${edge.id}-connects`, `${edge.id}-projected-displacement`]),
    requires: ['pointRelationships'],
  })
}
// Only edition-supported label clearance changes; source geometry stays byte-equivalent as data.
spec.canvas.height = 720
spec.canvas.boundingBox[3] = -61
for (const object of spec.objects) {
  if (['ion-type-1-label', 'ion-type-2-label'].includes(object.id)) object.at[1] = -13
  if (['ion-type-1-swatch', 'ion-type-2-swatch'].includes(object.id)) object.center[1] = -13
  if (object.id === 'projection-note') object.at[1] = -42
}
assert.deepEqual(spec.objects.filter((object) => ['point', 'segment'].includes(object.type)), baseline.objects.filter((object) => ['point', 'segment'].includes(object.type)))
assert.deepEqual(spec.assertions.slice(0, baseline.assertions.length), baseline.assertions)
assert.deepEqual(spec.source.authoritativeText, baseline.source.authoritativeText)
assert.deepEqual(spec.display, { purpose: 'instructional', layout: 'scroll', widths: [640], minTextPx: 16 })

const pointProof = expectedSites.map((site) => {
  const object = byId.get(site.id)
  assert.equal(object.fill, site.appearance === 'filled' ? 'ink' : 'paper')
  const projectedSourcePixel = [object.at[0], 420 - object.at[1]]
  const pixelDelta = projectedSourcePixel.map((value, index) => value - site.pixelApprox[index])
  assert.ok(pixelDelta.every((value) => Math.abs(value) <= 5))
  const inGroup = edgeProof.filter((edge) => typeof edge.from === 'string' && typeof edge.to === 'string' && (edge.from === site.id || edge.to === site.id))
  assert.ok(inGroup.length > 0)
  return { ...site, at: object.at, projectedSourcePixel, pixelDelta, whollyInGroupAssertions: inGroup.flatMap((edge) => [edge.connects, edge.displacement]) }
})
const layerProof = Object.entries(layers).map(([sourceLayer, layer]) => {
  const sites = pointProof.filter((site) => site.layer === sourceLayer)
  const rowVisibleCounts = [0, 1, 2].map((row) => sites.filter((site) => rows[site.row] === row).length)
  assert.deepEqual(rowVisibleCounts, sourceLayer === 'rear' ? [3, 2, 3] : [3, 3, 3])
  const columnVisibleCounts = [0, 1, 2].map((column) => sites.filter((site) => columns[site.column] === column).length)
  assert.deepEqual(columnVisibleCounts, sourceLayer === 'rear' ? [3, 2, 3] : [3, 3, 3])
  return { layer, rowSlots: 3, columnSlots: 3, rowVisibleCounts, columnVisibleCounts, visibleSites: sites.length }
})
const candidatePath = path.join(outputs, 'candidate-02.spec.json')
fs.mkdirSync(outputs, { recursive: true })
write(candidatePath, spec)
const proof = {
  schema: 'D160/source-structural-proof@1',
  batch: 'D160',
  figure: 'fig-11',
  role: 'author; supplemental proof, not native validation or independent approval',
  status: 'pass',
  sourceFirstInventory: binding(observedPath),
  inputFreeze: binding(freezePath),
  baseline: binding(freeze.baseline.path),
  candidate: binding(candidatePath),
  originalFailure: freeze.originalFailure,
  nativeOriginalFailureReceipt: originalFailure.nativeReceipt,
  layers: layerProof,
  sourceSites: pointProof,
  connectors: edgeProof,
  counts: { visibleSites: 26, filledSites: 13, openSites: 13, connectors: 52, connects: 52, projectedDisplacements: 52, dashedConnectors: 2, absentSeparateMarkers: 1 },
  occlusion: {
    missingMarkerId: 'back-r1-c1',
    noObjectAdded: !spec.objects.some((object) => object.id === 'back-r1-c1'),
    spanningRods: ['row-back-1-1', 'column-back-1-1'],
    retainedContinuation: { segment: 'depth-1-1-middle-back', terminal: [288, 286], meaning: 'uncalibrated projected rod termination; not an observed or ideal hidden marker' },
  },
  checks: {
    sourcePointAndConnectorObjectsUnchanged: true,
    allOriginalAssertionsUnchanged: true,
    fullFrozenBilingualTextExact: true,
    sourcePixelApproximationMaximumPerAxisPx: Math.max(...pointProof.flatMap((point) => point.pixelDelta.map(Math.abs))),
    sourceGroupsContainNativeCoverageForEveryPoint: true,
    finiteSlotAndAdjacencyChecksExecuted: true,
    gridObjectAdded: false,
    schemaOrSharedToolChanges: false,
    minTextPx: 16,
    fixedScrollMediaWidth: 640,
  },
  oneRepair: {
    inherited: 0,
    used: 1,
    total: 1,
    classification: 'gridDimensions removed only because reopened pixels show projected point-edge graph',
    sourceInventoryMapping: 'added in-layer relationship groups and segment count; no removed source facts',
    labelClearance: { legendY: { before: 12, after: -13 }, projectionNoteY: { before: -8, after: -42 }, canvasHeight: { before: 660, after: 720 }, sourceCoordinatesChanged: false },
  },
  approval: false,
}
write(path.join(author, 'inventories/fig-11.structural-proof.json'), proof)
for (const [name, input] of [['D160-inherited-D153-first-failure.json', freeze.originalFailure], ['D160-inherited-D153-native-001-raw.json', originalFailure.nativeReceipt]]) {
  fs.copyFileSync(input.path, path.join(author, 'receipts', name), fs.constants.COPYFILE_EXCL)
}
console.log(JSON.stringify({ status: 'repaired-candidate-written', candidate: binding(candidatePath), structuralProof: binding(path.join(author, 'inventories/fig-11.structural-proof.json')), contentRepairsTotal: 1 }, null, 2))

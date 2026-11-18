import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const root = process.cwd()
const owned = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d577-n75-fig164165-first-modern-author')
const hash = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bound = (p) => ({ path: path.resolve(p), sha256: hash(p) })
const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'))
const save = (p, value) => fs.writeFileSync(p, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
const files = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const p = path.join(directory, entry.name)
  if (entry.isSymbolicLink()) throw Error(`Unexpected symlink: ${p}`)
  return entry.isDirectory() ? files(p) : entry.isFile() ? [p] : []
})
const provenance = read(path.join(owned, 'provenance.json'))
const browser = read(path.join(owned, 'screenshots.json'))
assert.equal(browser.browserClosed, true)
assert.equal(read(path.join(owned, 'screenshots.commands.json')).exitCode, 0)
for (const binding of [provenance.authorityManifest, provenance.fullEN, provenance.fullZH, provenance.textReview]) {
  assert.equal(hash(binding.path), binding.sha256)
}
for (const context of provenance.contexts) {
  assert.equal(hash(context.context.path), context.context.sha256)
  assert.equal(hash(context.originalImage.path), context.originalImage.sha256)
}
const actualImageOpens = [
  { figure: 'fig-164', path: provenance.contexts[0].originalImage.path, purpose: 'FIRST original pixels; independent inventory subsequently sealed before context or geometry' },
  { figure: 'fig-165', path: provenance.contexts[1].originalImage.path, purpose: 'FIRST original pixels; independent inventory subsequently sealed before context or geometry' },
  { figure: 'fig-164', path: path.join(owned, 'fig-164/first/native.full.png'), purpose: 'Necessary repair observation of actual first native FAIL' },
  { figure: 'fig-164', path: path.join(owned, 'fig-164/repair/native.full.png'), purpose: 'Final full-resolution native output; second FAIL terminal' },
  { figure: 'fig-165', path: path.join(owned, 'fig-165/first/native.full.png'), purpose: 'Final full-resolution native output' },
  { figure: 'fig-164', path: path.join(owned, 'fig-164/isolated-342.png'), purpose: 'Final actual 342px isolated Chromium screenshot of unchanged SVG, CSS variables resolved' },
  { figure: 'fig-165', path: path.join(owned, 'fig-165/isolated-342.png'), purpose: 'Final actual 342px isolated Chromium screenshot of unchanged SVG, CSS variables resolved' },
].map((o, index) => ({ sequence: index + 1, ...o, ...bound(o.path), tool: 'functions.view_image', detail: 'original', crop: false, reopen: false }))
assert.ok(actualImageOpens.length <= 8)
const imageBudget = {
  contextInitial: 0, batchLimit: 8, contextLimit: 24, actualCount: actualImageOpens.length,
  contextFinal: actualImageOpens.length, parentCount: 24, parentReopens: 0,
  reopens: 0, crops: 0, newShortLivedReadImageContextAuthorized: true,
  newPermanentWorker: false, imageHistoryReturned: false, actualSequence: actualImageOpens,
}
const perFigure = []
for (const [figure, finalAttempt] of [['fig-164', 'repair'], ['fig-165', 'first']]) {
  const directory = path.join(owned, figure)
  const firstDirectory = path.join(directory, 'first')
  const finalDirectory = path.join(directory, finalAttempt)
  const firstCommands = read(path.join(firstDirectory, 'commands.json'))
  const finalCommands = read(path.join(finalDirectory, 'commands.json'))
  const firstRender = read(path.join(firstDirectory, 'native.render.json'))
  const finalRender = read(path.join(finalDirectory, 'native.render.json'))
  const specPath = path.join(finalDirectory, 'spec.json')
  const spec = read(specPath)
  const pointIds = new Set(spec.objects.filter((o) => o.type === 'point').map((o) => o.id))
  const referenceFields = {
    distance: ['a', 'b'], equalDistance: ['a', 'b', 'c', 'd'], collinear: ['a', 'b', 'c'],
    parallel: ['a', 'b', 'c', 'd'], perpendicular: ['a', 'b', 'c', 'd'],
    pointOnLine: ['point', 'a', 'b'], pointOnCircle: ['point', 'center'],
    connects: ['from', 'to'], displacement: ['from', 'to'],
  }
  const groups = spec.source.inventory.map((group) => {
    const mappedPoints = new Set(group.objects.filter((id) => pointIds.has(id)))
    const relations = group.assertions.map((id) => spec.assertions.find((a) => a.id === id))
      .filter(Boolean).map((a) => ({
        id: a.id, type: a.type,
        points: [...new Set((referenceFields[a.type] || []).map((f) => a[f]).filter((p) => pointIds.has(p)))],
      })).filter((a) => a.points.length >= 2 && a.points.every((p) => mappedPoints.has(p)))
    const uncovered = [...mappedPoints].filter((p) => !relations.some((a) => a.points.includes(p)))
    if (group.requires?.includes('pointRelationships')) assert.deepEqual(uncovered, [])
    return { sourceGroup: group.id, objects: group.objects, assertions: group.assertions, mappedPoints: [...mappedPoints], whollyInsidePointRelations: relations, uncoveredSourcePoints: uncovered }
  })
  const sourceInventoryPath = path.join(directory, 'source-inventory.json')
  const sourceInventory = read(sourceInventoryPath)
  assert.equal(hash(sourceInventoryPath), provenance.firstSourceObservations.find((o) => o.figure === figure).inventorySha256)
  assert.equal(fs.statSync(sourceInventoryPath).mode & 0o777, 0o444)
  assert.equal(finalCommands.spec.sha256, hash(specPath))
  assert.equal(finalRender.output.svg.sha256, hash(path.join(finalDirectory, `${figure}.svg`)))
  const widths = browser.observations.find((o) => o.figure === figure).widthChecks
  const native = finalCommands.nativeRender
  const sourceElements = figure === 'fig-164' ? {
    points: sourceInventory.subfigures[0].points.map((p) => ({
      sourceId: p.id, sourceLabel: p.sourceLabel, nativePoint: p.id,
      meaningfulWhollyInsideRelations: groups[0].whollyInsidePointRelations.filter((a) => a.points.includes(p.id)).map((a) => a.id),
    })),
    relationships: [
      { sourceId: 's164-axis', objects: ['s164-axis'], assertions: ['s164-a-on-axis', 's164-o-on-axis', 's164-b-on-axis', 's164-order-a', 's164-order-o', 's164-order-b', 's164-order-o2', 's164-axis-connects'] },
      { sourceId: 's164-radius1', objects: ['s164-radius1', 's164-r1-label'], assertions: ['s164-radius1-connects', 's164-r1-ends-on-right', 's164-radius1-length', 's164-vertex-b-on-right'] },
      { sourceId: 's164-radius2', objects: ['s164-radius2', 's164-r2-label'], assertions: ['s164-radius2-connects', 's164-r2-ends-on-left', 's164-radius2-length', 's164-vertex-a-on-left'] },
      { sourceId: 's164-boundaries', objects: ['s164-left-surface', 's164-right-surface', 's164-material'], assertions: ['s164-top-on-left', 's164-top-on-right', 's164-bottom-on-left', 's164-bottom-on-right', 's164-surface-count'] },
      { sourceId: 's164-interior', objects: ['s164-o', 's164-material'], assertions: ['s164-o-inside', 's164-order-o', 's164-order-b'] },
    ],
    sourceLabels: [
      { label: 'O1', object: 's164-o1' }, { label: 'O2', object: 's164-o2' },
      { label: 'O', object: 's164-o' }, { label: 'A', object: 's164-a' },
      { label: 'B', object: 's164-b' }, { label: 'R1', object: 's164-r1-label' },
      { label: 'R2', object: 's164-r2-label' },
    ],
    joinedTips: provenance.geometry[figure].tipCoordinates.map((coordinate, index) => ({
      sourceRole: index === 0 ? 'upper joined tip' : 'lower joined tip', nativeCoordinate: coordinate,
      assertions: index === 0 ? ['s164-top-on-left', 's164-top-on-right'] : ['s164-bottom-on-left', 's164-bottom-on-right'],
    })),
  } : {
    namedPoints: [], sourceLabels: [],
    profiles: sourceInventory.subfigures.map((s, index) => ({
      sourceId: s.id, sourceSlot: index + 1, boundaryCounts: s.counts,
      closedBoundary: { sourceRelationship: `${s.id}-closed`, objects: [`${s.id}-left-boundary`, `${s.id}-right-boundary`, `${s.id}-material`], assertions: [`${s.id}-top-join`, `${s.id}-bottom-join`, `${s.id}-right-top`, `${s.id}-right-bottom`] },
      centralThicker: { sourceRelationship: `${s.id}-thickness`, assertions: [`${s.id}-central-thickness`, `${s.id}-upper-thickness`, `${s.id}-lower-thickness`], recoveredInequality: 'center > upper near-edge and center > lower near-edge; encoded by native exact distance values, also asserted by the author generator' },
    })),
    sourceOrder: { sourceRelationship: 's165-order', nativeMaterialObjects: ['s165-left-material', 's165-middle-material', 's165-right-material'], assertions: ['s165-profile-count', 's165-curved-boundary-count', 's165-straight-boundary-count', 's165-single-row'] },
  }
  const report = {
    schema: 'd577-first-modern-author-report@1', ticket: 'STEMROBIN-181', batch: 'd577', figure, card: provenance.card,
    status: native === 'FAIL' ? 'FAIL-SECOND-NATIVE-RESULT-TERMINAL' : 'HOLD-INDEPENDENT-FIG-DISPLAY-PENDING',
    route: { mode: 'deterministic', renderer: 'JSXGraph', selectedFrom: 'source pixels plus complete bilingual edition prose', paidGenerationRequired: false, hybridGeneratedHoldBeforePaidGeneration: 'Not applicable to these geometric figures; paid calls prohibited' },
    native: { validation: finalCommands.nativeValidation, render: native, independentPASS: false, finalAttempt, unchangedSpecRerenders: 0, firstExplicitValidationInvocations: firstCommands.explicitValidateInvocations, firstRenderInvocations: firstCommands.renderInvocations, repairInvocations: finalAttempt === 'repair' ? 1 : 0, rendererInternalValidationDisclosed: true },
    source: { image: spec.source.image, inventory: bound(sourceInventoryPath), sourceCount: sourceInventory.sourceCount, sourceInventorySealedBeforeExposure: true, mapping: groups, sourceElements, fineDetailHOLD: sourceInventory.subfigures.flatMap((s) => s.fineDetailHolds), ...(figure === 'fig-164' ? { pixelDimensionDisclosure: provenance.source164DimensionDisclosure } : {}) },
    editionBinding: { fullEN: provenance.fullEN, fullZH: provenance.fullZH, contexts: provenance.contexts.find((c) => c.figure === figure).context, completeProse: provenance.completeAuthority, textReview: provenance.textReview, SCI: provenance.SCI, ZHEN: provenance.ZHEN, replayed: false },
    artifacts: { spec: bound(specPath), svg: bound(path.join(finalDirectory, `${figure}.svg`)), render: bound(path.join(finalDirectory, 'native.render.json')), fullResolution: bound(path.join(finalDirectory, 'native.full.png')), actual342: bound(path.join(directory, 'isolated-342.png')), commands: bound(path.join(finalDirectory, 'commands.json')), browser: bound(path.join(owned, 'screenshots.json')), browserCommand: bound(path.join(owned, 'screenshots.commands.json')) },
    firstResult: { validation: firstCommands.nativeValidation, nativeRender: firstCommands.nativeRender, actualFirstFAIL: firstRender.status === 'fail' ? firstRender.collisions : null, spec: bound(path.join(firstDirectory, 'spec.json')), svg: bound(path.join(firstDirectory, `${figure}.svg`)), render: bound(path.join(firstDirectory, 'native.render.json')), commands: bound(path.join(firstDirectory, 'commands.json')), preserved0444: true, firstBytesNeverOverwritten: true, repairWrittenSeparately: finalAttempt === 'repair' },
    repair: figure === 'fig-164'
      ? { used: 1, limit: 1, delta: bound(path.join(directory, 'repair-delta.json')), before: bound(path.join(firstDirectory, 'spec.json')), after: bound(specPath), targetedFieldsOnly: ['s164-o1.labelPlacement', 's164-o2.labelPlacement', 's164-r2-label.labelPlacement'], secondFAIL: finalRender.collisions, terminal: true, nextRepairAuthorized: false }
      : { used: 0, limit: 1, firstPassedNoRerender: true },
    additions: provenance.additions[figure],
    authorObservations: figure === 'fig-164'
      ? ['Five original named points and seven original labels are present; the external thickness bracket is edition-driven modern addition.', 'Both radius endpoints lie on their respective opposite curved surfaces, with O1/O2 distinct from O.', 'The final full and 342px images are nonblank. Principal axis remains too close to O1 per the native collision gate; second FAIL is terminal.']
      : ['Actual source count is three; source order and concave/convex/plane boundary distinctions remain visible at full and 342px sizes.', 'Glass-in-air header binds the edition condition; the profile captions are modern additions, not recovered source labels.', 'No rays, focus marks, source photographs or generic substitute icons were authored.'],
    display: { purpose: 'instructional', widths: [331, 342, 640], measuredTextPx: widths.map((w) => ({ width: w.width, minTextPx: w.minTextPx })), final342TargetPx: 17, final342ActualPx: 17.1, min16AllWidths: true, actualSvgBytesUnmodified: true, CSSvariablesResolved: true, browser: 'isolated headless Chromium, existing app Playwright', browserClosed: true, independentDISPLAY: false, fullCardAcceptance: false },
    imageBudget, figureImageOpens: actualImageOpens.filter((o) => o.figure === figure).map((o) => o.sequence),
    gate: { FIG: 'pending independent review', DISPLAY: 'pending independent review', reviewAt1Written: false, promoted: false, nativeValidationIsNotIndependentPASS: true },
    preserved: { oldFAILHOLD: true, source201OrderingQualification: true, otherAuthorsBytesUntouched: true },
    prohibitedActions: { git: 0, db: 0, deploy: 0, paidCalls: 0, canonicalEdits: 0, svgManualPathEdits: 0, standingWorkersCreated: 0 },
  }
  const reportPath = path.join(directory, 'report.json')
  save(reportPath, report)
  perFigure.push({ figure, route: 'deterministic', nativeValidation: finalCommands.nativeValidation, nativeRender: native, status: report.status, repairUsed: report.repair.used, report: bound(reportPath) })
}
const reportPath = path.join(owned, 'report.json')
save(reportPath, {
  schema: 'd577-bounded-first-modern-author-batch@1', ticket: 'STEMROBIN-181', batch: 'd577', card: provenance.card,
  status: 'BOUNDED-BATCH-CLOSED-FIG164-TERMINAL-NATIVE-FAIL-FIG165-NATIVE-PASS-NO-INDEPENDENT-SIGNOFF',
  ownedDirectory: owned, figures: perFigure, provenance: bound(path.join(owned, 'provenance.json')),
  imageBudget, SCI: provenance.SCI, ZHEN: provenance.ZHEN,
  FIG: 'pending independent review', DISPLAY: 'pending independent review', completeCard: false,
  nativeValidationNotIndependentPASS: true, reviewAt1Written: false, promotion: false,
  historicalFAILHOLDPreserved: true, browserClosed: true, paidCalls: 0,
  gitDBDeployCanonicalEdits: false, otherBytesUntouched: true,
  freezePlan: 'All owned regular files 0444; per-figure author-freeze.json plus root author-freeze.json. Each freeze excludes its own recursive hash, returned externally.',
})
const freezeEntries = []
for (const { figure } of perFigure) {
  const directory = path.join(owned, figure)
  const freezePath = path.join(directory, 'author-freeze.json')
  const included = files(directory).sort()
  for (const p of included) fs.chmodSync(p, 0o444)
  save(freezePath, {
    schema: 'd577-author-freeze@1', figure, scope: directory,
    files: included.map((p) => ({ ...bound(p), mode: '0444' })),
    report: bound(path.join(directory, 'report.json')),
    selfHash: 'Returned externally; intentionally excluded from own file list',
    noIndependentFIGorDISPLAY: true, sourceFineDetailHOLDPreserved: true,
  })
  fs.chmodSync(freezePath, 0o444)
  freezeEntries.push(bound(freezePath))
}
const rootFreezePath = path.join(owned, 'author-freeze.json')
const included = files(owned).sort()
for (const p of included) fs.chmodSync(p, 0o444)
save(rootFreezePath, {
  schema: 'd577-author-freeze@1', batch: 'd577', ticket: 'STEMROBIN-181', ownedDirectory: owned,
  report: bound(reportPath), figureFreezes: freezeEntries,
  files: included.map((p) => ({ ...bound(p), mode: '0444' })),
  readOnlyInputs: [
    provenance.authorityManifest, provenance.fullEN, provenance.fullZH, provenance.textReview,
    ...provenance.contexts.flatMap((c) => [c.context, c.originalImage]),
    ...['references/routing.md', 'references/figure-spec.md', 'references/quality-gate.md', 'assets/figure-spec.schema.json', 'scripts/validate_spec.py', 'scripts/render_spec.mjs']
      .map((p) => bound(path.join(root, '.agents/skills/ld-s10y-image', p))),
  ],
  selfHash: 'Returned externally; intentionally excluded from own file list',
  allOwnedFilesMode: '0444', batchActualImageOpens: 7, parentImageCountUnchanged: 24,
  terminalNativeFAILPreserved: true, noIndependentFIGorDISPLAY: true, noReviewAt1: true, noPromotion: true,
})
fs.chmodSync(rootFreezePath, 0o444)
const freeze = read(rootFreezePath)
for (const file of freeze.files) {
  assert.equal(hash(file.path), file.sha256)
  assert.equal(fs.statSync(file.path).mode & 0o777, 0o444)
}
for (const p of files(owned)) assert.equal(fs.statSync(p).mode & 0o777, 0o444)
console.log(JSON.stringify({
  report: bound(reportPath), freeze: bound(rootFreezePath), figureFreezes: freezeEntries,
  figures: perFigure.map(({ figure, nativeRender, repairUsed }) => ({ figure, nativeRender, repairUsed })),
  actualImageOpens: 7, allOwnedFiles0444: true, ownedFileCount: files(owned).length,
}, null, 2))

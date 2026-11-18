import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const read = file => JSON.parse(fs.readFileSync(path.join(own, file), 'utf8'))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const pin = file => ({
  path: file, sha256: sha(file), bytes: fs.statSync(file).size,
  mode: (fs.statSync(file).mode & 0o777).toString(8).padStart(4, '0'),
})
const write = (name, data) => {
  const file = path.join(own, name)
  assert(!fs.existsSync(file), `Refusing overwrite: ${file}`)
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n')
}
assert(!fs.existsSync(path.join(own, 'author-freeze.json')), 'No repeated freeze')
const inputs = read('input-pins.json')
for (const input of inputs.files) assert.equal(sha(input.path), input.sha256)
const browser = read('native-svg-browser-check.json')
assert.equal(browser.screenshotsCreated, 4)
const opens = [
  {open: 1, kind: 'original-only-before-context', figure: 'fig-179', detail: 'original',
    path: inputs.files.find(p => p.path.endsWith('/fig-179.png')).path},
  {open: 2, kind: 'original-only-before-context', figure: 'fig-180', detail: 'original',
    path: inputs.files.find(p => p.path.endsWith('/fig-180.png')).path},
  {open: 3, kind: 'original-reopen-to-resolve-first-inventory-FAIL-after-context', figure: 'fig-180', detail: 'original',
    path: inputs.files.find(p => p.path.endsWith('/fig-180.png')).path},
  {open: 4, kind: 'full-native-svg-chromium-screenshot', figure: 'fig-179', detail: 'original',
    path: path.join(own, 'fig-179.repair1.full-native.png')},
  {open: 5, kind: 'full-native-svg-chromium-screenshot', figure: 'fig-180', detail: 'original',
    path: path.join(own, 'fig-180.repair1.full-native.png')},
  {open: 6, kind: 'actual342-native-svg-chromium-screenshot', figure: 'fig-179', detail: 'original',
    path: path.join(own, 'fig-179.repair1.actual342.png')},
  {open: 7, kind: 'actual342-native-svg-chromium-screenshot', figure: 'fig-180', detail: 'original',
    path: path.join(own, 'fig-180.repair1.actual342.png')},
].map(o => ({...o, sha256: sha(o.path)}))
write('actual-opens-ledger.json', {
  status: 'SINGLE-BOUNDED-BATCH-ENDED', contextBefore: 0, actualOpens: 7,
  batchLimit: 8, contextLimit: 24, contextAfter: 7, parentBeforeAndAfter: 24,
  oldBeforeAndAfter: 24, parentOpens: 0, oldContextImagesAdded: 0,
  crops: 0, failedPreviewOpens: 0, originalReopens: 1,
  screenshotOpens: 4, returnedImagePayloads: 0, noBudgetReset: true, opens,
})

const pointKeys = {
  distance: ['a', 'b'], equalDistance: ['a', 'b', 'c', 'd'],
  collinear: ['a', 'b', 'c'], parallel: ['a', 'b', 'c', 'd'],
  perpendicular: ['a', 'b', 'c', 'd'], pointOnLine: ['point', 'a', 'b'],
  displacement: ['from', 'to'], connects: ['from', 'to'],
}
const figures = []
for (const n of [179, 180]) {
  const spec = read(`fig-${n}.repair1.spec.json`)
  const rendered = read(`fig-${n}.repair1.render.json`)
  const first = read(`fig-${n}.render.json`)
  assert.equal(first.status, 'fail')
  assert.equal(rendered.status, 'pass')
  assert.equal(rendered.spec.sha256, sha(path.join(own, `fig-${n}.repair1.spec.json`)))
  assert.equal(rendered.output.svg.sha256, sha(path.join(own, `fig-${n}.repair1.svg`)))
  const byObject = new Map(spec.objects.map(o => [o.id, o]))
  const byAssertion = new Map(spec.assertions.map(a => [a.id, a]))
  const groups = spec.source.inventory.map(group => {
    const points = group.objects.filter(id => byObject.get(id).type === 'point')
    const pointSet = new Set(points)
    const rows = group.assertions.map(id => {
      const assertion = byAssertion.get(id)
      assert(assertion)
      const references = (pointKeys[assertion.type] || [])
        .map(key => assertion[key]).filter(value => typeof value === 'string' && byObject.get(value)?.type === 'point')
      return {id, type: assertion.type, references: [...new Set(references)],
        whollyContained: references.every(id => pointSet.has(id))}
    })
    const pointCoverage = points.map(point => ({
      point, label: byObject.get(point).label,
      containedMultiPointAssertions: rows.filter(row =>
        row.whollyContained && row.references.length >= 2 && row.references.includes(point)).map(row => row.id),
    }))
    if (group.requires?.includes('pointRelationships'))
      assert(pointCoverage.every(row => row.containedMultiPointAssertions.length > 0))
    return {...group, pointCoverage, assertionCoverage: rows, missing: [], status: 'EXECUTABLE-MAP-COMPLETE'}
  })
  const arrows = spec.objects.filter(o => o.type === 'arrow').map(o => {
    assert(spec.assertions.some(a => a.type === 'connects' && a.arrow === o.id))
    const from = typeof o.from === 'string' ? byObject.get(o.from).at : o.from
    const to = typeof o.to === 'string' ? byObject.get(o.to).at : o.to
    return {id: o.id, from, to, dx: to[0] - from[0], dy: to[1] - from[1],
      kind: o.id.includes('backward') ? 'construction-only-not-actual-ray'
        : o.id.includes('secondary') ? 'secondary-axis-construction' : 'source-direction',
      connects: spec.assertions.find(a => a.type === 'connects' && a.arrow === o.id).id}
  })
  const model = read(`fig-${n}.physical-geometry.json`)
  assert.equal(arrows.length, model.expectedArrowheads)
  const actualObservation = browser.observations.find(o => o.figure === `fig-${n}` && o.cssWidth === 342)
  assert(actualObservation && actualObservation.measuredMinPx >= 17)
  const files = {
    source: pin(spec.source.image.path),
    independentInventory: pin(path.join(own, `fig${n}.source-inventory.json`)),
    ...(n === 180 ? {inventoryReconciliation: pin(path.join(own, 'fig180.inventory-reconciliation.json'))} : {}),
    fullZH: inputs.files.find(p => p.path.endsWith('/candidate/zh/lesson.template.json')),
    fullEN: inputs.files.find(p => p.path.endsWith('/candidate/en/lesson.template.json')),
    context: inputs.files.find(p => p.path.endsWith(`/fig-${n}.context.json`)),
    firstFAILSpec: pin(path.join(own, `fig-${n}.spec.json`)),
    firstFAILRender: pin(path.join(own, `fig-${n}.render.json`)),
    firstFAILSVG: pin(path.join(own, `fig-${n}.svg`)),
    spec: pin(path.join(own, `fig-${n}.repair1.spec.json`)),
    svg: pin(path.join(own, `fig-${n}.repair1.svg`)),
    render: pin(path.join(own, `fig-${n}.repair1.render.json`)),
    repairBeforeAfter: pin(path.join(own, `fig-${n}.repair1.before-after.json`)),
    physicalGeometry: pin(path.join(own, `fig-${n}.physical-geometry.json`)),
    fullNativeScreenshot: pin(path.join(own, `fig-${n}.repair1.full-native.png`)),
    actual342Screenshot: pin(path.join(own, `fig-${n}.repair1.actual342.png`)),
  }
  write(`fig-${n}.assertion-coverage.json`, {
    status: 'NATIVE-SOURCE-RELATION-MAP-COMPLETE-NOT-INDEPENDENT-REVIEW',
    figure: spec.id, groups, arrows,
    visiblePoints: spec.objects.filter(o => o.type === 'point').map(o => ({id: o.id, at: o.at, label: o.label})),
    allObjectsMapped: spec.objects.every(o => groups.some(g => g.objects.includes(o.id))),
    actual342StrokeAndLabelEvidence: actualObservation,
    modernAdditions: [
      'Normalized f=1 paraxial example and exact analytic intersections; no claim of numerical source measurements.',
      'Small outlined point and terminal markers clarify named anchors without introducing any label.',
      'Neutral semantic muted role distinguishes auxiliary axes and dashed backward construction; solid/dashed source distinction retained.',
      'Collision-safe label offsets, 32 px source-canvas labels (17.1 CSS px at 342), clean sans-serif mathematical subscripts.',
    ],
    sourceFirstInventoryCorrection: n === 180 ? 'One append-only correction after context; initial erroneous B-Q group preserved and explicitly rejected.' : null,
    unresolvedSourceInstructionalRelations: [],
    furtherSpecRepairAllowed: false,
  })
  figures.push({
    figure: spec.id, status: 'FIRST-MODERN-AUTHOR-DRAFT-READY-INDEPENDENT-GATES-PENDING',
    files, sourceInventoryAssertionCoverage: pin(path.join(own, `fig-${n}.assertion-coverage.json`)),
    localCounts: {
      originalOpens: n === 179 ? 1 : 2, fullNativeOpens: 1, actual342Opens: 1,
      nativeValidatorInvocations: 2, nativeRendererInvocations: 2,
      firstNativeFAIL: 1, passedNativeRenderInvocations: 1,
      specRepairs: 1, repairWave: 1, repeatedPassedNativeRuns: 0,
      inventoryFAIL: n === 180 ? 1 : 0, inventoryCorrections: n === 180 ? 1 : 0,
    },
    authorVisualObservation: 'Inspected exact unmodified native SVG rasterized in isolated Chromium at full 640x520 and actual 342x278; required labels, source directions, shared intersections, strokes and dashed distinctions are present. No new unresolved author finding.',
    authorMechanicalStatus: 'PASS', originalExtractionStatus: 'PASS-INHERITED-NOT-REPEATED',
    FIG: 'pending', DISPLAY: 'pending', fullcard: 'pending',
    reviewAt1Written: false, canonicalPromoted: false,
  })
}

// Freeze every payload first so all report pins state the final read-only mode.
for (const file of fs.readdirSync(own)) {
  const target = path.join(own, file)
  if (fs.statSync(target).isFile()) fs.chmodSync(target, 0o444)
}
for (const figure of figures) {
  for (const entry of Object.values(figure.files)) {
    if (entry.path.startsWith(own + '/')) entry.mode = '0444'
  }
  figure.sourceInventoryAssertionCoverage.mode = '0444'
}
write('report.json', {
  schema: 'd604/n76-fig179180-first-modern-author@1',
  ticket: 'STEMROBIN-181', card: 'phy10-c2-s2-n76', ownedRoot: own,
  role: 'Fresh one-off single bounded FIRST modern figure author; not permanent or replacement A-D.',
  status: 'FIRST-MODERN-AUTHOR-DRAFTS-READY-INDEPENDENT-FIG-DISPLAY-FULLCARD-PENDING',
  figures,
  SCI: 'PASS-INHERITED-NO-TEXT-RE-REVIEW', ZHEN: 'PASS-INHERITED-NO-TEXT-RE-REVIEW',
  textReview: inputs.files.find(p => p.path.endsWith('/d598-n76-r08-first-affected-text-review/report.json')),
  old_d585_HOLD: {...inputs.files.find(p => p.path.endsWith('/d585-n76-first-independent-text-review/report.json')), retainedUnchanged: true},
  firstInventoryFAIL: pin(path.join(own, 'first-fail.json')),
  actualOpensLedger: pin(path.join(own, 'actual-opens-ledger.json')),
  browserEvidence: pin(path.join(own, 'native-svg-browser-check.json')),
  counts: {
    imageOpens: 7, batchLimit: 8, contextLimit: 24, contextStart: 0, contextEnd: 7,
    parentBefore: 24, parentAfter: 24, oldBefore: 24, oldAfter: 24, parentImageOpens: 0,
    nativeFirstFAILs: 2, sourceInventoryFAILs: 1, firstFAILsTotal: 3,
    targetedRepairWaves: 1, repairedSpecFiles: 2, specRepairsPerFigure: 1,
    nativeRendererInvocations: 4, nativeValidatorInvocations: 4,
    passedNativeRendererInvocations: 2, repeatedPassedNativeRuns: 0,
    originalReopens: 1, cropsOrFailedPreviewOpens: 0,
    screenshotsCreatedAndInspected: 4, returnedImagePayloads: 0,
  },
  constraints: {
    onlyOwnedFilesWrittenOrChmodded: true, sharedDirtyBytesOutsideOwnUnchangedByThisAuthor: true,
    noNewWorktree: true, noNewBranch: true, gitOperations: 0, paidCalls: 0,
    directSVGEdits: 0, directResvg: false, canonicalWrites: 0, indexWrites: 0,
    meterWrites: 0, DBOperations: 0, deployOperations: 0,
    nativeValidatorAndRendererUnmodified: true, reviewAt1Writes: 0,
    noTextReReview: true, historicalHOLDAndFirstFAILsRetained: true,
  },
  gates: {FIG: 'pending-independent-review', DISPLAY: 'pending-independent-headed-product-gate',
    fullcard: 'pending', completeCard: false},
  boundedBatchEnded: true, moreRepairsAllowed: false, moreImageOpensPlanned: false,
  authorFreeze: {path: path.join(own, 'author-freeze.json'), mode: '0444',
    policy: 'All owned files 0444; full hashes of every non-self file. Self hash returned separately.'},
})
fs.chmodSync(path.join(own, 'report.json'), 0o444)
const files = fs.readdirSync(own).map(name => pin(path.join(own, name)))
assert(files.every(file => file.mode === '0444'))
write('author-freeze.json', {
  schema: 'd604/author-freeze@1', ownedRoot: own,
  status: 'FROZEN-0444-BOUNDED-BATCH-ENDED',
  files, fullExternalInputPins: inputs.files,
  nativeToolPins: ['validate_spec.py', 'render_spec.mjs', 'materialize_arrowheads.mjs']
    .map(name => pin(path.join('/Users/yong/.codex/worktrees/00b1/lemmadeck/.agents/skills/ld-s10y-image/scripts', name))),
  figures: figures.map(figure => ({figure: figure.figure, files: figure.files,
    coverage: figure.sourceInventoryAssertionCoverage})),
  actualOpens: 7, independentFIG: 'pending', independentDISPLAY: 'pending', fullcard: 'pending',
  selfHashOmittedToAvoidCircularHash: true,
})
fs.chmodSync(path.join(own, 'author-freeze.json'), 0o444)
for (const input of inputs.files) assert.equal(sha(input.path), input.sha256)
for (const file of read('author-freeze.json').files) assert.equal(sha(file.path), file.sha256)
console.log(JSON.stringify({
  report: pin(path.join(own, 'report.json')),
  freeze: pin(path.join(own, 'author-freeze.json')),
  filesFrozen: fs.readdirSync(own).length, actualOpens: 7,
  status: 'AUTHOR-READY; FIG/DISPLAY/fullcard PENDING; BATCH ENDED',
}, null, 2))

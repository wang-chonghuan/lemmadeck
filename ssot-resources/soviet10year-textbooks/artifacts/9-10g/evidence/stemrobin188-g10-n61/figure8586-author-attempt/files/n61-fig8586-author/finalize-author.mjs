import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const repo = process.cwd()
const root = path.resolve('.intentfold/tickets/STEMROBIN-188/tmp/n61-fig8586-author')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'))
const write = (name, value) => fs.writeFileSync(path.join(root, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
const manifestPath = path.resolve('.intentfold/tickets/STEMROBIN-188/tmp/n61-fig8586-author-inputs-01/manifest.json')
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
const before = read('bindings.before.json')
const after = {
  manifest: { path: path.relative(repo, manifestPath), sha256: hash(manifestPath) },
  bindings: manifest.bindings.map(binding => ({
    ...binding, actualSha256: hash(binding.path), bytes: fs.statSync(binding.path).size,
    matchesManifest: hash(binding.path) === binding.sha256,
    unchangedFromBefore: hash(binding.path) === before.bindings.find(item => item.path === binding.path)?.actualSha256,
  })),
}
write('bindings.after.json', after)
const contexts = [85, 86].map(number => JSON.parse(fs.readFileSync(path.resolve(`.intentfold/tickets/STEMROBIN-188/tmp/n61-fig8586-author-inputs-01/fig-g10-${number}.context.json`), 'utf8')))
const textAdmission = JSON.parse(fs.readFileSync(contexts[0].textAdmission.path, 'utf8'))
const objectBindings = name => {
  const spec = read(name)
  const pointIds = new Set(spec.objects.filter(item => item.type === 'point').map(item => item.id))
  const fields = {
    distance: ['a', 'b'], equalDistance: ['a', 'b', 'c', 'd'], collinear: ['a', 'b', 'c'],
    parallel: ['a', 'b', 'c', 'd'], perpendicular: ['a', 'b', 'c', 'd'],
    pointOnCircle: ['point', 'center'], pointOnLine: ['point', 'a', 'b'],
    connects: ['from', 'to'], displacement: ['from', 'to'],
  }
  return spec.source.inventory.map(group => {
    const mappedPoints = group.objects.filter(id => pointIds.has(id))
    const relations = group.assertions.map(id => spec.assertions.find(item => item.id === id)).map(assertion => ({
      assertion: assertion.id, type: assertion.type,
      pointRefs: [...new Set((fields[assertion.type] || []).map(field => assertion[field]).filter(value => pointIds.has(value)))],
    }))
    return {
      group: group.id, requires: group.requires,
      allMappedObjects: group.objects,
      allMappedAssertions: group.assertions,
      definingNamedPointRelationships: mappedPoints.map(point => ({
        point,
        relationships: relations.filter(relation => relation.pointRefs.includes(point) && relation.pointRefs.length >= 2 && relation.pointRefs.every(id => mappedPoints.includes(id))),
      })),
      unlabeledConstructionCoordinates: spec.id === 'fig-g10-85'
        ? { role: 'unmarked contact', mapping: ['contact-on-sector', 'contact-on-base', 'external-circle-tangency', 'contact-normal-alignment'], construction: 'fig-g10-85.construction.json' }
        : { role: 'unmarked silhouette endpoints and disk-visibility transition anchors', mapping: ['left-silhouette-connectivity', 'right-silhouette-connectivity', 'rear-transition-on-generator', 'axis-transition-on-height', 'rear-generator-exposed-connectivity', 'rear-generator-hidden-connectivity', 'axis-exposed-connectivity', 'axis-hidden-connectivity'], construction: 'fig-g10-86.construction.json', analyticRelations: 'Exact projected silhouette tangency residuals and upper-disk clipping equations; no extra visible points or labels.' },
    }
  })
}
const receiptFiles = fs.readdirSync(root).filter(file => file.endsWith('.command.json')).sort()
const commandRecords = receiptFiles.map(file => {
  const receipt = read(file)
  return { ...receipt, receipt: file, result: read(receipt.exit) }
})
const sourceImages = contexts.map(context => {
  const png = fs.readFileSync(context.sourceImage.path)
  const number = context.figure.endsWith('85') ? 85 : 86
  const first = read(`fig-g10-${number}.first-pixel-inventory.json`)
  return {
    ...context.sourceImage, actualSha256: hash(context.sourceImage.path),
    pngHeaderDimensions: { width: png.readUInt32BE(16), height: png.readUInt32BE(20) },
    firstRecordedFrame: first.pixel_frame,
    frameMetadataMatches: png.readUInt32BE(16) === first.pixel_frame.width && png.readUInt32BE(20) === first.pixel_frame.height,
    metadataReadIsNotImageReopen: true,
  }
})
const imageLedger = {
  limitBatch: 8, limitContext: 24,
  originalLoads: 2, initialSnapshotLoads: 2, affectedSnapshotLoads: 1,
  diagnosticLoads: 0, reopens: 0, failedImageLoads: 0,
  totalImageToolLoads: 5,
  conservativeCountIncludingEachContactSheetWidth: 8,
  furtherImageLoadsAuthorizedInThisBatch: 0,
  entries: [
    { ordinal: 1, figure: 'fig-g10-85', role: 'original-alone-before-context', path: contexts[0].sourceImage.path, sha256: contexts[0].sourceImage.sha256, imageUnits: 1 },
    { ordinal: 2, figure: 'fig-g10-86', role: 'original-alone-after85sealed-before-context', path: contexts[1].sourceImage.path, sha256: contexts[1].sourceImage.sha256, imageUnits: 1 },
    ...[
      ['85', 'initial'], ['86', 'initial'], ['86', 'repair1'],
    ].map(([number, draft], i) => ({
      ordinal: i + 3, figure: `fig-g10-${number}`, role: 'single author inspection of actual draft',
      path: `fig-g10-${number}.${draft}.widths480-300.png`,
      sha256: hash(path.join(root, `fig-g10-${number}.${draft}.widths480-300.png`)),
      actualWidths: [480, 300], imageUnits: 2,
    })),
  ],
}
const allBindingsUnchanged = after.bindings.length === 12 && after.bindings.every(item => item.matchesManifest && item.unchangedFromBefore) && before.manifest.sha256 === after.manifest.sha256
const result = {
  schema: 'stemrobin188-figure-author-result@1',
  assignment: 'SAME188-6', ticket: 'STEMROBIN-188', lesson: 'geo910-c2-s3-n61',
  role: 'FIGURE AUTHOR ONLY',
  status: 'AUTHOR_OUTPUTS_WITH_LOCAL_HOLD_NOT_REVIEWED',
  writeRoot: root,
  beforeAfter12Bindings: { before, after, allBindingsUnchanged },
  firstInventories: [85, 86].map(number => ({
    figure: `fig-g10-${number}`, path: `fig-g10-${number}.first-pixel-inventory.json`,
    sha256: hash(path.join(root, `fig-g10-${number}.first-pixel-inventory.json`)),
    mode: (fs.statSync(path.join(root, `fig-g10-${number}.first-pixel-inventory.json`)).mode & 0o777).toString(8),
    sealedBeforeContextOrSpec: true,
  })),
  sourceImages,
  routesAndNative: read('routes-and-native.json'),
  currentDrafts: [
    {
      figure: 'fig-g10-85', state: 'DRAFT_READY_FOR_PARENT_COLLECTION_NOT_REVIEWED', currentDraft: 'initial',
      spec: 'fig-g10-85.initial.spec.json', svg: 'fig-g10-85.initial.svg', render: 'fig-g10-85.initial.render.json',
      specSha256: hash(path.join(root, 'fig-g10-85.initial.spec.json')),
      svgSha256: hash(path.join(root, 'fig-g10-85.initial.svg')),
      snapshot: 'fig-g10-85.initial.widths480-300.png',
      explicitValidatorCalls: 1, nativeRendererCalls: 1, actualDraftInspections: 1, repairCount: 0,
      technicalNativeReport: read('fig-g10-85.initial.render.json'),
      relationshipMapping: objectBindings('fig-g10-85.initial.spec.json'),
      construction: read('fig-g10-85.construction.json'),
      observedAuthorDefects: [], reviewerVerdict: null, approved: false,
    },
    {
      figure: 'fig-g10-86', state: 'LOCAL_HOLD_NATIVE_COLLISION_REPAIR_EXHAUSTED', currentDraft: 'repair1',
      spec: 'fig-g10-86.repair1.spec.json', svg: 'fig-g10-86.repair1.svg', render: 'fig-g10-86.repair1.render.json',
      specSha256: hash(path.join(root, 'fig-g10-86.repair1.spec.json')),
      svgSha256: hash(path.join(root, 'fig-g10-86.repair1.svg')),
      snapshot: 'fig-g10-86.repair1.widths480-300.png',
      explicitValidatorCalls: 2, nativeRendererCalls: 2, actualDraftInspections: 2, repairCount: 1, repairsRemaining: 0,
      technicalNativeReport: read('fig-g10-86.repair1.render.json'),
      relationshipMapping: objectBindings('fig-g10-86.repair1.spec.json'),
      construction: read('fig-g10-86.construction.json'),
      repairChanges: read('fig-g10-86.repair1.changes.json'),
      observedAuthorDefects: ['A1-label touches left silhouette at both widths'],
      reviewerVerdict: null, approved: false,
    },
  ],
  failures: [
    {
      figure: 'fig-g10-86', draft: 'initial', stage: 'native-render', exitCode: 2,
      collisions: read('fig-g10-86.initial.render.json').collisions,
      originalSpec: 'fig-g10-86.initial.spec.json', originalRender: 'fig-g10-86.initial.render.json',
      originalSvg: 'fig-g10-86.initial.svg', originalSnapshot: 'fig-g10-86.initial.widths480-300.png',
      receipt: 'fig86-initial-native.command.json', stdout: 'fig86-initial-native.stdout.txt', stderr: 'fig86-initial-native.stderr.txt', exit: 'fig86-initial-native.exit.json',
      additionalVisualDefect: 'Native hidden segments looked dotted instead of source dashed.',
    },
    {
      figure: 'fig-g10-86', draft: 'repair1', stage: 'native-render', exitCode: 2,
      collisions: read('fig-g10-86.repair1.render.json').collisions,
      receipt: 'fig86-repair1-native.command.json', stdout: 'fig86-repair1-native.stdout.txt', stderr: 'fig86-repair1-native.stderr.txt', exit: 'fig86-repair1-native.exit.json',
      disposition: 'Local HOLD; no further repair, rerender or image reopen.',
    },
  ],
  repairCounts: { 'fig-g10-85': 0, 'fig-g10-86': 1 },
  holds: [
    { id: 'FIG86-REPAIR-EXHAUSTED-A1-COLLISION', scope: 'fig-g10-86', status: 'HOLD', reason: 'Second native result still reports A1-label collision; actual affected snapshot confirms contact with left silhouette.' },
    { id: 'INITIAL-MANIFEST-PROJECTION-DEVIATION', scope: 'session strict FIRST procedural approval', status: 'HOLD', reason: read('first-author-observations.json').initialManifestReadDisclosure },
    { id: 'SOURCE-HISTORICAL-HOLDS', scope: 'source and whole lesson', status: 'HOLD_UNCHANGED', details: contexts.map(context => ({ figure: context.figure, sourceHolds: context.sourceHolds, strictFIRSTProcessApproved: context.strictFIRSTProcessApproved })) },
    { id: 'TEXT-ADMISSION-NOT-PROMOTION', scope: 'source/procedure/whole lesson/figure approval', status: 'HOLD_UNCHANGED', reason: 'Separate N61 text semanticPASS exists; source and historical late FIRST0444 procedural HOLDs remain. This author does not recheck or override the admission.', boundExistingAdmission: { ...contexts[0].textAdmission, content: textAdmission } },
    { id: 'PARENT-COLLECTION-AND-CLOSE', scope: 'parent consumption', status: 'HOLD', reason: 'Parent collects and CLOSES this author first. No peer messages, descendants, reviewer record, promotion, template application or whole lesson approval.' },
    ...(!allBindingsUnchanged ? [{ id: 'INPUT-BINDING-DRIFT', scope: 'all author outputs', status: 'HOLD', reason: 'At least one of the 12 input bindings changed; inspect before/after record.' }] : []),
  ],
  imageLedger,
  actualCommands: commandRecords,
  priorReadAndSealCommands: 'session-actions.json',
  nativeValidatorNote: 'Exactly one explicit validator and one native renderer invocation per actual draft. The unmodified native renderer additionally invokes its own built-in draft validator internally, as its contract requires. No passed stage was independently repeated.',
  governance: {
    generatedSvgEdits: 0, sourceOrTextEdits: 0, templateApplications: 0, reviewerRecords: 0,
    promotion: false, wholeLessonApproved: false, paidModelCalls: 0, networkCalls: 0, dbCalls: 0,
    dependencyChanges: 0, gitWrites: 0, formalTestRuns: 0, peerMessages: 0, descendants: 0,
    freshnessSetupGrill: false, productionResumeFollowedWithinDirectAuthorization: true,
    manualEdits: 'apply_patch only; generated artifacts emitted by author-local structured scripts and unmodified native renderer.',
    allExecSessionsFinishedBeforeReturn: true,
    boundImagePayloadReturn: false,
  },
}
for (const figure of result.currentDrafts) {
  if (figure.relationshipMapping.some(group => group.definingNamedPointRelationships.some(item => !item.relationships.length))) throw new Error('Uncovered defining source point')
}
for (const source of sourceImages.filter(item => !item.frameMetadataMatches)) {
  result.failures.push({
    figure: path.basename(source.path).replace('.png', ''),
    stage: 'FIRST-inventory metadata transcription',
    reason: 'Pixel-only FIRST inventory frame dimensions were estimated incorrectly; actual PNG-header dimensions are recorded separately. Immutable FIRST is retained, not silently rewritten.',
    firstRecorded: source.firstRecordedFrame, actual: source.pngHeaderDimensions,
    mathematicalGeometryChanged: false,
  })
}
write('author-result.json', result)
console.log(JSON.stringify({
  authorResult: 'author-result.json', sha256: hash(path.join(root, 'author-result.json')),
  all12BindingsUnchanged: allBindingsUnchanged,
  figure85: 'unreviewed initial draft',
  figure86: 'local HOLD after single repair',
  imageLoads: imageLedger.totalImageToolLoads, conservativeImageUnits: imageLedger.conservativeCountIncludingEachContactSheetWidth,
  sourceHeaderDimensions: sourceImages.map(item => ({ figure: path.basename(item.path), dimensions: item.pngHeaderDimensions, firstFrameMetadataMatches: item.frameMetadataMatches })),
}))

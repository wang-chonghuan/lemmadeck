import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), root)
const work = path.join(root, '.tmp/STEMROBIN-181/d1816-d344')
const evidence = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d344-fig277-label-repair')
const priorEvidence = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d333-fig277-first-author')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const bind = file => {
  const absolute = path.resolve(root, file)
  const bytes = fs.readFileSync(absolute)
  return { path: absolute, sha256: crypto.createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length }
}
const writeNew = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
const original = bind('.tmp/STEMROBIN-181/d1816-d333/fig-277.spec.json')
assert.equal(original.sha256, 'bdee7015054c8bb86c8cfd05f72057c5355aa4c16233a791632192990c218857')
const before = read(original.path)
const spec = bind(path.join(work, 'fig-277.spec.json'))
const after = read(spec.path)
const priorReport = read(path.join(priorEvidence, 'report.json'))
const priorFreeze = read(path.join(priorEvidence, 'author-freeze.json'))
const context = read(path.join(priorEvidence, 'contextual-observations.json'))
const labelBefore = before.objects.find(object => object.id === 'positron-label')
const labelAfter = structuredClone(after.objects.find(object => object.id === 'positron-label'))
assert.deepEqual(labelAfter.labelPlacement, { position: 'CENTER', gap: 0, offset: [0, -8] })
const restored = structuredClone(after)
delete restored.objects.find(object => object.id === 'positron-label').labelPlacement.offset
assert.deepEqual(restored, before)
const source = bind(after.source.image.path)
assert.equal(source.sha256, after.source.image.sha256)
const render = bind(path.join(work, 'fig-277.render.json'))
const svg = bind(path.join(work, 'fig-277.svg'))
const preview = bind(path.join(work, 'fig-277.png'))
const rendered = read(render.path)
assert.equal(rendered.spec.sha256, spec.sha256)
assert.equal(rendered.output.svg.sha256, svg.sha256)
assert.equal(rendered.status, 'pass')
assert.deepEqual(rendered.collisions, [])
assert.equal(rendered.objects, before.objects.length)
assert.equal(rendered.labels, 11)
assert.deepEqual(rendered.displayChecks, [
  { width: 640, minTextPx: 16, measuredMinPx: 24, failures: [], status: 'pass' },
])
const receiptPaths = ['validate-spec', 'render-spec'].map(stage => path.join(evidence, `${stage}.receipt.json`))
const receipts = receiptPaths.map(read)
for (const receipt of receipts) {
  assert.equal(receipt.cwd, root)
  assert.equal(receipt.exitCode, 0)
  assert.equal(receipt.spec.sha256, spec.sha256)
  assert.equal(receipt.code.sha256Before, receipt.code.sha256After)
}
assert.equal(read(receiptPaths[0]).stage, 'validate-spec')
assert.equal(JSON.parse(receipts[0].stdout).status, 'pass')
const recoveredRender = bind('.tmp/STEMROBIN-181/d1816-d342/fig-277.render.json')
const recovered = read(recoveredRender.path)
assert.equal(recovered.spec.sha256, original.sha256)
assert.equal(recovered.status, 'fail')
assert.equal(recovered.collisions.length, 1)
assert.equal(recovered.collisions[0].id, 'positron-label-label')
const priorReceiptBindings = priorReport.nativeReceipts.map(receipt => {
  const current = bind(receipt.path)
  assert.equal(current.sha256, receipt.sha256)
  return current
})
const authority = bind(priorFreeze.authoritativeText.path)
assert.equal(authority.sha256, priorFreeze.authoritativeText.sha256)
const inventory = bind(priorFreeze.ownInventory.path)
assert.equal(inventory.sha256, priorFreeze.ownInventory.sha256)
const qualifications = context.qualifiedHolds
const usageDelta = {
  authorBuilds: 0,
  reusedD333Specs: 1,
  candidateSpecs: 1,
  contentAttempts: 1,
  contentRepairsUsed: 1,
  layoutRepairsUsed: 1,
  technicalRepairsUsed: 0,
  standaloneNativeValidateSpecCalls: 1,
  embeddedNativeValidateSpecCalls: 1,
  totalNativeValidateSpecCalls: 2,
  unmodifiedNativeRenderSpecCalls: 1,
  diagnosticNativeRenderSpecCalls: 0,
  totalRenderSpecCalls: 1,
  actualRenderMetadataFiles: 1,
  nativePngPreviewFiles: 1,
  resvgCalls: 0,
  imagesOpened: 3,
  sourceImagesOpened: 1,
  candidateImagesOpened: 2,
  localImageReopens: 0,
  maximumImageOpens: 8,
  paidCalls: 0,
  nestedDelegations: 0,
  chatOperations: 0,
  readOnlyPlaneHelperInvocations: 2,
  readOnlyPlaneApiCalls: 3,
  planeWrites: 0,
  independentReviewPasses: 0,
  promotions: 0,
  originalTasksAdded: 0,
  addedTasks: 0,
  sourcePagesAdded: 0,
  sourceFiguresAdded: 0,
  completeCoursesAdded: 0,
  databaseWrites: 0,
  canonicalEdits: 0,
  meterEdits: 0,
  templateEdits: 0,
  repositoryRendererCodeEdits: 0,
  otherProductCodeEdits: 0,
  oldEvidenceEdits: 0,
  gitMutations: 0,
  publishOperations: 0,
  deployOperations: 0,
  mergeOperations: 0,
  closureOperations: 0,
}
const imageLedger = {
  schema: 'stemrobin-181/image-open-ledger@1',
  scope: 'D344 author context only; prior batches and parent usage are not reset',
  maximumImageOpens: 8,
  actualImagesOpened: 3,
  opens: [
    { ordinal: 1, kind: 'exact original PNG', ...source },
    { ordinal: 2, kind: 'D342 recovered current PNG', ...bind('.tmp/STEMROBIN-181/d1816-d342/fig-277.png') },
    { ordinal: 3, kind: 'D344 repaired native PNG at full 640 px product width', ...preview },
  ],
  crops: 0,
  localReopens: 0,
  furtherImagesLoaded: false,
  returnedImagePayloadsToParent: false,
}
writeNew(path.join(evidence, 'image-open-ledger.json'), imageLedger)
const common = {
  stage: 'D344',
  ticket: 'STEMROBIN-181',
  role: 'AUTHOR_ONLY',
  cwd: root,
  frozenAtUtc: new Date().toISOString(),
  status: 'AUTHOR_FROZEN_PENDING_INDEPENDENT_REVIEW',
  scope: 'One positron-label placement repair in the same authorized production invocation; no source reinterpretation.',
  writeRoots: [work, evidence],
  authorization: {
    basis: 'Latest direct human instruction authorizes ordinary reversible repairs and this additional layout repair.',
    invocation: 'Continuation, not a new IntentFold capability invocation or new production authorization.',
    historicalSingleRepairLimit: 'D333 contentRepairsUsed=1 is retained as actual historical usage, not treated as a new approval barrier.',
  },
  source,
  authority,
  authorityFreeze: bind(priorFreeze.authority.path),
  originalSpec: original,
  spec,
  render,
  svg,
  preview,
  sourceInventory: inventory,
  qualifiedHolds: qualifications,
  repair: {
    object: 'positron-label',
    field: 'labelPlacement.offset',
    before: null,
    after: [0, -8],
    beforeObject: labelBefore,
    afterObject: labelAfter,
    coordinateSpace: 'Renderer screen pixels: 8 px upward, no horizontal displacement.',
    rationale: 'Clear the sole recovered e-plus collision while retaining the label above the solid A-to-B positron track.',
    additionalContentRepairsUsed: 1,
    knownFigureContentRepairOrdinal: 2,
    semanticsUnchanged: true,
  },
  preservation: {
    comparison: 'Full parsed FigureSpec equals D333 after removing the sole new positron-label.labelPlacement.offset.',
    completeSourceUnchanged: true,
    sourceInventoryUnchanged: true,
    authoritativeTextUnchanged: true,
    objectsUnchangedExceptLabelPlacement: true,
    objectCount: after.objects.length,
    assertionCount: after.assertions.length,
    allAssertionsUnchanged: true,
    geometryUnchanged: true,
    displayUnchanged: true,
    sourceInterpretationRepeated: false,
    constructionMap: bind(priorReport.sourceConstruction.initialConstructionMap.path),
    constructionMapQualification: 'Original construction map stays bound to the initial D333 spec; D333 preserved changes and this exact D344 delta remain separately recorded.',
  },
  mechanicalEvidence: {
    validationStatus: 'pass',
    renderStatus: rendered.status,
    collisions: rendered.collisions,
    displayChecks: rendered.displayChecks,
    nativeReceipts: receiptPaths.map(bind),
    rendererAtExecution: receipts[1].code,
    validatorAtExecution: receipts[0].code,
    qualification: 'Native figure-stage results only; not an independent visual review or approval.',
  },
  historicalEvidence: {
    priorAuthorReport: bind(path.join(priorEvidence, 'report.json')),
    priorAuthorFreeze: bind(path.join(priorEvidence, 'author-freeze.json')),
    initialFailureReceipts: priorReceiptBindings,
    historicalSpecSnapshots: priorFreeze.specSnapshots,
    priorTechnicalCorrection: bind(priorReport.preservedChanges.technicalReceipt.path),
    priorContentRepair: bind(priorReport.preservedChanges.contentRepairReceipt.path),
    recoveredInitialCollisionRender: recoveredRender,
    recoveredInitialSvg: bind('.tmp/STEMROBIN-181/d1816-d342/fig-277.svg'),
    recoveredInitialPng: bind('.tmp/STEMROBIN-181/d1816-d342/fig-277.png'),
    recoveredCollision: recovered.collisions[0],
    copiedPackages: 0,
  },
  imageLedger: bind(path.join(evidence, 'image-open-ledger.json')),
  authorVisualInspection: {
    status: 'AUTHOR_OBSERVATION_ONLY',
    observation: 'Exact source was opened before candidates. The repaired e-plus remains above the solid A-to-B positron track, with clear separation and no altered track, junction, wave, arrow or label content. This is author inspection, not source re-interpretation, independent review or approval.',
    fullResolutionAndDeclaredWidthPx: 640,
    wholeLessonOrProductReviewPerformed: false,
  },
  usage: {
    historicalD333: { report: bind(path.join(priorEvidence, 'report.json')), actualUsage: priorReport.usage },
    deltaD344: usageDelta,
    recordedAuthorTotalsD333PlusD344Only: {
      authorBuilds: priorReport.usage.authorBuilds,
      contentAttempts: priorReport.usage.contentAttempts + usageDelta.contentAttempts,
      contentRepairsUsed: priorReport.usage.contentRepairsUsed + usageDelta.contentRepairsUsed,
      totalNativeValidateSpecCalls: priorReport.usage.totalNativeValidateSpecCalls + usageDelta.totalNativeValidateSpecCalls,
      totalRenderSpecCalls: priorReport.usage.totalRenderSpecCalls + usageDelta.totalRenderSpecCalls,
      imagesOpened: priorReport.usage.imagesOpened + usageDelta.imagesOpened,
      paidCalls: priorReport.usage.paidCalls + usageDelta.paidCalls,
      qualification: 'Only these two author calls are summed. Parent D342 recovery and other invocation usage stay in parent records; no invocation total, remaining quota or limit reset is invented.',
    },
  },
  approvals: {
    sourceText: false,
    sourceScriptIdentity: false,
    modernFigure: false,
    independentReview: false,
    promotion: false,
    fullLessonDisplay: false,
    completeCourse: false,
  },
  review: null,
  promotion: null,
  parentHandoff: 'Frozen D344 author candidate only. Independent review remains required and all D333 qualifications remain. Parent owns concurrent N149 text reconciliation, renderer regression, meter, canonical evidence and any later promotion. No report PASS, self-approval, review file or promotion was created.',
}
const freezePath = path.join(evidence, 'author-freeze.json')
writeNew(freezePath, { schema: 'STEMROBIN-181/fig277-label-repair-author-freeze@1', ...common })
const reportPath = path.join(evidence, 'report.json')
writeNew(reportPath, {
  schema: 'STEMROBIN-181/fig277-label-repair-author-report@1',
  ...common,
  authorFreeze: bind(freezePath),
  evidenceScripts: [bind(path.join(evidence, 'native-stage.mjs')), bind(import.meta.filename)],
})
console.log(JSON.stringify({
  status: common.status,
  spec,
  render,
  svg,
  preview,
  source,
  authorFreeze: bind(freezePath),
  report: bind(reportPath),
  additionalContentRepairsUsed: 1,
  knownAuthorContentRepairsUsed: 2,
  imagesOpenedThisContext: 3,
  independentReviewPasses: 0,
  promotions: 0,
}, null, 2))

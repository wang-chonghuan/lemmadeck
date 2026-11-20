import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, core, read, bind, save, retain } from './retain-scoped-evidence-02.mjs'

const root = path.join(tmp, 'n60-fig8182-author')
const collectionPath = path.join(tmp, 'n60-fig8182-author-collection-01.json')
const collection = read(collectionPath)
assert.equal(collection.outputsVerified, 32)
assert.equal(collection.outputIndex.sha256,
  '9604b6cc8faddec2932a35f946178d4d37585ae3fb619725dd0240c4ed40cdbf')
const reportPath = path.join(root, 'author-result.json')
const report = read(reportPath)
const [figure81, figure82] = report.figures
assert.equal(figure81.id, 'fig-g10-81')
assert.equal(figure81.currentDraftBinding.authorContentStatus, 'fail')
assert.equal(figure81.oneRepair.count, 1)
assert.equal(figure82.id, 'fig-g10-82')
assert.equal(figure82.currentDraftBinding.nativeStatus, 'pass')
assert.equal(figure82.oneRepair.count, 0)
const inputPath = path.join(tmp, 'n60-fig8182-author-inputs-01/manifest.json')
const input = read(inputPath)
const textAdmissionPath = path.join(tmp, 'n60-modern-text-admission-01.json')
const script = new URL(import.meta.url).pathname
const files = [...new Set([
  collectionPath, collection.outputIndex.path, reportPath, inputPath, textAdmissionPath,
  ...collection.outputs.map(b => b.path), ...input.bindings.map(b => b.path), script,
])]
const target = path.join(core, 'evidence/stemrobin188-g10-n60/figure8182-author-attempt')
if (process.argv[2] === 'retain') {
  retain(target, files, {
    schema: 'stemrobin188-n60-fig8182-author-attempt-retention@1',
    status: 'modern81-source-label-FAIL-exhausted-and82-nativePASS-only',
    report: bind(reportPath), collection: bind(collectionPath), imagesLoaded: 6,
    contentRepairs: { figure81: 1, figure82: 0 },
    figure81NativePassNotSourceFidelity: true, source81DAndCNotChangedToOInSource: true,
    figure82LeadingGlyphHOLDNotCleared: true, passedStageReruns: 0,
    independentReviewPending: true,
  })
} else {
  assert.equal(process.argv[2], 'review')
  const retentionPath = path.join(target, 'bindings.json')
  read(retentionPath)
  const modernText = bind(path.join(tmp, 'n62-modern-text-review-inputs-01/manifest.json'))
  const source82 = input.figures.find(f => f.id === 'fig-g10-82')
  const directory = path.join(tmp, 'n62-text-n60fig8182-review-inputs-01')
  assert.ok(!fs.existsSync(directory), directory)
  fs.mkdirSync(directory)
  const manifestPath = path.join(directory, 'manifest.json')
  save(manifestPath, {
    schema: 'stemrobin188-n62-text-and82-figure-independent-review-inputs@1',
    status: 'pending-first-independent-N62-text-and-figure82-review',
    ticket: 'STEMROBIN-188', assignment: 'SAME188-6', book: '9-10g',
    modernText, figure82Source: source82.sourceImage,
    figure82Context: source82.context, figure82CurrentDraft: figure82.currentDraftBinding,
    figure82AuthorFIRST: figure82.inventories.first,
    sourceLeadingGlyphAndPanelHoldsPreserved: true,
    n60TextAdmission: bind(textAdmissionPath), figureAuthorReport: bind(reportPath),
    collection: bind(collectionPath), authorRetention: bind(retentionPath),
    source81FailureStateOnly: {
      status: 'author-source-label-FAIL-exhausted; no affected acceptance requested',
      FIRST: figure81.inventories.first,
      failure: figure81.inventories.supplementalDiagnosticInventory.binding,
      currentSpec: figure81.currentDraftBinding.spec,
      contentRepairs: 1, remainingRepairs: 0,
      noNewSource81OrFailedDraftSnapshotImages: true,
    },
    imagesPlanned: 2, optionalSource82Diagnostics: 2,
    maxImageLoads: 8, maxContextImageLoads: 24,
    original82FIRSTBeforeAnyAuthorSpecReceiptTextOrManifest: true,
    producerChecksNativeFlowRenderOrPassedStagesAllowed: false,
    candidateEditsAuthorized: false, wholeLessonApproved: false, published: false,
    bindings: [...new Set([...files, modernText.path, retentionPath])].map(bind),
  })
  save(path.join(directory, 'blind-intake.json'), {
    schema: 'stemrobin188-blind-single-figure-before-text-review-intake@1',
    ticket: 'STEMROBIN-188', assignment: 'SAME188-6', book: '9-10g',
    figure: 'fig-g10-82', original: source82.sourceImage,
    afterOriginalFIRSTSealed: bind(manifestPath),
    outputRoot: path.join(tmp, 'n62-text-n60fig8182-review-01'),
    noAuthorCandidateSpecReceiptContextOrModernTextBeforeSource82FIRST: true,
    maxImageLoads: 8, maxContextImageLoads: 24,
  })
  console.log(JSON.stringify({ directory, imagesPlanned: 2, optionalDiagnostics: 2,
    N62TextObjects: 20, source81Images: 0 }))
}

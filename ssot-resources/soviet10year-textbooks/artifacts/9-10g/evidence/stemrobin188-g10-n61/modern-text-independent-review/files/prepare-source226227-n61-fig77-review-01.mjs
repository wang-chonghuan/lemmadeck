import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, read, bind, save } from './retain-scoped-evidence-02.mjs'

const sourceDirectory = path.join(tmp, 'source226227-FIRST-review-inputs-01')
const sourceBlind = read(path.join(sourceDirectory, 'blind-intake.json'))
const sourceManifest = bind(path.join(sourceDirectory, 'manifest.json'))
const modernText = bind(path.join(tmp, 'n61-modern-text-review-inputs-01/manifest.json'))
const figuresManifest = bind(path.join(tmp, 'n60-fig7778-author-inputs-01/manifest.json'))
const figures = read(figuresManifest.path).figures
const figureAuthorCollection = bind(path.join(tmp, 'n60-fig7778-author-collection-01.json'))
assert.equal(read(figureAuthorCollection.path).outputsVerified, 36)
const figureRoot = path.join(tmp, 'n60-fig7778-author')
const figureAuthorReport = bind(path.join(figureRoot, 'author-result.json'))
const n60TextAdmission = bind(path.join(tmp, 'n60-modern-text-admission-01.json'))
assert.equal(read(n60TextAdmission.path).status,
  'pass-for-modern-n60-text-only-with-inherited-source-holds')
const figureFiles = [
  figureAuthorReport.path, figureAuthorCollection.path, figuresManifest.path,
  n60TextAdmission.path,
  ...figures.flatMap(f => [f.sourceImage.path, f.context.path]),
  'fig-g10-77.FIRST.source-inventory.json', 'fig-g10-78.FIRST.source-inventory.json',
  'fig-g10-78.diagnostic-addendum.json', 'fig-g10-77.draft01.spec.json',
  'fig-g10-77.draft01.render.json', 'fig-g10-77.draft02.spec.json',
  'fig-g10-77.draft02.render.json', 'fig-g10-77.draft02.svg',
  'fig-g10-77.draft02.png', 'fig-g10-77.repair01.json',
].map(p => path.isAbsolute(p) ? p : path.join(figureRoot, p))
const directory = path.join(tmp, 'source226227-n61-fig77-review-inputs-01')
assert.ok(!fs.existsSync(directory), directory)
fs.mkdirSync(directory)
const manifestPath = path.join(directory, 'manifest.json')
save(manifestPath, {
  schema: 'stemrobin188-combined-source-text-figure-review-inputs@1',
  status: 'pending-first-independent-review-of-four-disjoint-scopes',
  ticket: 'STEMROBIN-188', assignment: 'SAME188-6', book: '9-10g',
  sourceManifest, modernText, figuresManifest, figureAuthorCollection,
  figureAuthorReport, n60TextAdmission,
  figure77CurrentSpec: bind(path.join(figureRoot, 'fig-g10-77.draft02.spec.json')),
  figure77CurrentRender: bind(path.join(figureRoot, 'fig-g10-77.draft02.render.json')),
  figure77CurrentSnapshot: bind(path.join(figureRoot, 'fig-g10-77.draft02.png')),
  figure78HasNoSpecOrRender: true,
  imagesPlanned: { sourceOriginals: 2, sourceNativeCrop96: 1,
    figureOriginals: 2, figure77CurrentSnapshot: 1, modernText: 0 },
  totalImagesPlanned: 6, optionalDiagnosticImages: 2, maxImageLoads: 8, maxContextImageLoads: 24,
  allSourceAndFigureFIRSTsBeforeManifestCandidatesReceiptsOrModernText: true,
  sourceRepairsUsed: { 226: 0, 227: 0 }, n61TextRepairsUsed: 0,
  figure77RepairsUsed: 1, figure77RepairLimit: 1, candidateEditsAuthorized: false,
  figure78AssociationHOLDNotAutomaticallyCleared: true,
  originalFigure78FIRSTAndDiagnosticFailurePreserved: true,
  nativeParserCounterRenderFlowOrPassedChecksAllowed: false,
  peerOrModelOrPaidCallsAllowed: false, wholeLessonApproved: false, published: false,
  bindings: [...new Set([sourceManifest.path, modernText.path, ...figureFiles,
    new URL(import.meta.url).pathname])].map(bind),
})
save(path.join(directory, 'blind-intake.json'), {
  schema: 'stemrobin188-blind-source-and-figure-intake@1',
  ticket: 'STEMROBIN-188', assignment: 'SAME188-6', book: '9-10g',
  sourceOriginals: sourceBlind.originals,
  figureOriginals: figures.map(f => ({ figure: f.id, original: f.sourceImage })),
  afterAllFourOriginalFIRSTsSealed: bind(manifestPath),
  outputRoot: path.join(tmp, 'source226227-FIRST-review-01'),
  noCandidateReceiptLayoutPredecessorAuthorSpecOrModernTextBeforeAllSeals: true,
  maxImageLoads: 8, maxContextImageLoads: 24,
})
console.log(JSON.stringify({ directory, totalImages: 6, optionalDiagnostics: 2,
  independentScopes: ['source226227', 'N61text', 'figure77', 'figure78HOLD'] }))

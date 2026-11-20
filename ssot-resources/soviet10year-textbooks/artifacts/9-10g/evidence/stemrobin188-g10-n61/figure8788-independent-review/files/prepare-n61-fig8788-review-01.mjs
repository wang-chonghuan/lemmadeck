import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, core, read, bind, save } from './retain-scoped-evidence-02.mjs'

const root = path.join(tmp, 'n61-fig8788-author')
const inputPath = path.join(tmp, 'n61-fig8788-author-inputs-01/manifest.json')
const input = read(inputPath)
const authorPath = path.join(root, 'author-result.json')
const author = read(authorPath)
const collectionPath = path.join(tmp, 'n61-fig8788-author-collection-01.json')
const collection = read(collectionPath)
assert.equal(collection.outputsVerified, 94)
const retentionPath = path.join(core, 'evidence/stemrobin188-g10-n61/figure8788-author-attempt/bindings.json')
read(retentionPath)
const figures = author.figures.map(f => {
  const current = Object.fromEntries(Object.entries(f.current).map(([key, value]) => {
    const file = path.join(root, value.path)
    const binding = bind(file)
    assert.equal(binding.sha256, value.sha256)
    return [key, binding]
  }))
  assert.equal(read(current.render.path).status, 'pass')
  return { id: f.id, source: input.figures.find(s => s.id === f.id),
    current, repairsUsed: f.contentRepairCounter, snapshotImageUnits: 2 }
})
assert.deepEqual(figures.map(f => f.id), ['fig-g10-87', 'fig-g10-88'])
const directory = path.join(tmp, 'n61-fig8788-review-inputs-01')
assert.ok(!fs.existsSync(directory), directory)
fs.mkdirSync(directory)
const manifestPath = path.join(directory, 'manifest.json')
const files = [...new Set([
  inputPath, authorPath, collectionPath, retentionPath,
  ...input.bindings.map(b => b.path), ...collection.outputs.map(b => b.path),
  new URL(import.meta.url).pathname,
])]
save(manifestPath, {
  schema: 'stemrobin188-bounded-independent-modern-figure-review-inputs@1',
  status: 'pending-first-independent-current-draft-review',
  ticket: 'STEMROBIN-188', assignment: 'SAME188-6', book: '9-10g',
  lesson: 'geo910-c2-s3-n61', figures, authorReport: bind(authorPath),
  n61TextAdmission: bind(path.join(tmp, 'n61-modern-text-admission-01.json')),
  inheritedSourceAndProceduralHoldsPreserved: true,
  authorLocalProcedureHOLD: author.HOLDs.localProcedure,
  bindings: files.map(bind),
  originalFIRSTsBeforeAnyCandidateSpecAuthorReceiptContextOrManifest: true,
  imagesPlanned: 6, maxImageLoads: 8, optionalDiagnostics: 2, maxContextImageLoads: 24,
  snapshotsCountedByRenderedImageUnits: true, candidateEditsAuthorized: false,
  nativeRenderOrPassedChecksAllowed: false, wholeLessonApproved: false,
  promoted: false, published: false,
})
save(path.join(directory, 'blind-intake.json'), {
  schema: 'stemrobin188-blind-figure-intake@1',
  ticket: 'STEMROBIN-188', assignment: 'SAME188-6', book: '9-10g',
  originals: figures.map(f => ({ figure: f.id, original: f.source.sourceImage })),
  afterAllOriginalFIRSTsSealed: bind(manifestPath),
  outputRoot: path.join(tmp, 'n61-fig8788-review-01'),
  FIRSTActual0444BeforeAllLaterMaterial: true, noOtherSourceOrFailedCandidateImages: true,
  plannedImageUnits: 6, maxImageLoads: 8, maxContextImageLoads: 24,
})
console.log(JSON.stringify({ directory, figures: figures.map(f => f.id),
  bindings: files.length, plannedImageUnits: 6 }))

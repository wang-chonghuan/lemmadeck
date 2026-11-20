import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, core, read, bind, save } from './retain-scoped-evidence-02.mjs'

const group = process.argv[2]
assert.ok(['8990', '91'].includes(group), group)
const name = `n62-fig${group}-author`
const root = path.join(tmp, name)
const collectionPath = path.join(tmp, `${name}-collection-01.json`)
const collection = read(collectionPath)
assert.equal(collection.status, 'collected-and-closed-then-output-bindings-verified-once')
const inputPath = path.join(tmp, `${name}-inputs-01/manifest.json`)
const input = read(inputPath)
const reportPath = path.join(root, 'author-result.json')
const report = read(reportPath)
const retentionPath = path.join(core,
  `evidence/stemrobin188-g10-n62/figure${group}-author-attempt/bindings.json`)
read(retentionPath)
const figures = report.figures.filter(f => f.current?.spec && f.current?.render && f.current?.image)
  .map(f => {
    const current = Object.fromEntries(Object.entries(f.current)
      .filter(([, value]) => value && typeof value === 'object' && typeof value.path === 'string')
      .map(([key, value]) => {
      const file = value.path.startsWith(path.relative(repo, root) + path.sep)
        ? path.resolve(repo, value.path) : path.resolve(root, value.path)
      assert.ok(file.startsWith(root + path.sep), file)
      const binding = bind(file)
      assert.equal(binding.sha256, value.sha256, file)
      return [key, binding]
    }))
    assert.equal(read(current.render.path).status, 'pass')
    return {
      id: f.id, source: input.figures.find(s => s.id === f.id), current,
      repairsUsed: f.contentRepairCounter, snapshotImageUnits: 2,
    }
  })
assert.ok(figures.length > 0, 'No native-pass current drafts; stop only this review stage')
figures.forEach(f => assert.ok(f.source, f.id))
const directory = path.join(tmp, `n62-fig${group}-review-inputs-01`)
assert.ok(!fs.existsSync(directory), directory)
fs.mkdirSync(directory)
const manifestPath = path.join(directory, 'manifest.json')
const files = [...new Set([
  inputPath, reportPath, collectionPath, retentionPath,
  ...input.bindings.map(b => b.path), ...collection.outputs.map(b => b.path),
  new URL(import.meta.url).pathname,
])]
const imagesPlanned = figures.length * 3
save(manifestPath, {
  schema: 'stemrobin188-bounded-independent-modern-figure-review-inputs@1',
  status: 'pending-first-independent-current-draft-review',
  ticket: 'STEMROBIN-188', assignment: 'SAME188-6', book: '9-10g',
  lesson: 'geo910-c2-s3-n62', figures, authorReport: bind(reportPath),
  n62TextAdmission: bind(path.join(tmp, 'n62-modern-text-admission-01.json')),
  authorFailedOrHeldFiguresStateOnly: report.figures.filter(f => !figures.some(g => g.id === f.id))
    .map(f => ({ id: f.id, status: f.status, contentRepairCounter: f.contentRepairCounter,
      holds: f.holds, noNewFailedImageReviewRequested: true })),
  inheritedSourceAndProceduralHoldsPreserved: true, bindings: files.map(bind),
  originalFIRSTsBeforeAnyCandidateSpecAuthorReceiptContextOrManifest: true,
  imagesPlanned, maxImageLoads: 8, optionalDiagnostics: 8 - imagesPlanned,
  maxContextImageLoads: 24, snapshotsCountedByRenderedImageUnits: true,
  candidateEditsAuthorized: false, nativeRenderOrPassedChecksAllowed: false,
  wholeLessonApproved: false, promoted: false, published: false,
})
save(path.join(directory, 'blind-intake.json'), {
  schema: 'stemrobin188-blind-figure-intake@1',
  ticket: 'STEMROBIN-188', assignment: 'SAME188-6', book: '9-10g',
  originals: figures.map(f => ({ figure: f.id, original: f.source.sourceImage })),
  afterAllOriginalFIRSTsSealed: bind(manifestPath),
  outputRoot: path.join(tmp, `n62-fig${group}-review-01`),
  FIRSTActual0444BeforeAllLaterMaterial: true, noOtherSourceOrFailedCandidateImages: true,
  plannedImageUnits: imagesPlanned, maxImageLoads: 8, maxContextImageLoads: 24,
})
console.log(JSON.stringify({ directory, figures: figures.map(f => f.id),
  bindings: files.length, plannedImageUnits: imagesPlanned }))

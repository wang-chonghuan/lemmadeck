import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, core, read, bind, save } from './retain-scoped-evidence-02.mjs'

const input83Path = path.join(tmp, 'n61-fig8384-author-inputs-01/manifest.json')
const input85Path = path.join(tmp, 'n61-fig8586-author-inputs-01/manifest.json')
const input83 = read(input83Path)
const input85 = read(input85Path)
const author83Path = path.join(tmp, 'n61-fig8384-author/author-result.json')
const author85Path = path.join(tmp, 'n61-fig8586-author/author-result.json')
const author83 = read(author83Path)
const author85 = read(author85Path)
const groups = [
  ...author83.figures.map(f => ({
    id: f.id, source: input83.figures.find(s => s.id === f.id),
    spec: f.currentDraft.spec, render: f.currentDraft.render,
    svg: f.currentDraft.svg, snapshot: f.currentDraft.snapshot,
    snapshotImageUnits: 1, repairsUsed: 1,
  })),
  ...author85.currentDrafts.filter(f => f.figure === 'fig-g10-85').map(f => ({
    id: f.figure, source: input85.figures.find(s => s.id === f.figure),
    ...Object.fromEntries(['spec', 'render', 'svg', 'snapshot']
      .map(key => [key, bind(path.join(tmp, 'n61-fig8586-author', f[key]))])),
    snapshotImageUnits: 2, repairsUsed: 0,
  })),
]
assert.deepEqual(groups.map(f => f.id), ['fig-g10-83', 'fig-g10-84', 'fig-g10-85'])
groups.forEach(f => assert.equal(read(f.render.path).status, 'pass'))
const collectionPaths = ['8384', '8586']
  .map(group => path.join(tmp, `n61-fig${group}-author-collection-01.json`))
const retentionPaths = ['8384', '8586']
  .map(group => path.join(core, `evidence/stemrobin188-g10-n61/figure${group}-author-attempt/bindings.json`))
collectionPaths.forEach(p => assert.equal(read(p).status,
  'collected-and-closed-then-output-bindings-verified-once'))
retentionPaths.forEach(read)
const directory = path.join(tmp, 'n61-fig838485-review-inputs-01')
assert.ok(!fs.existsSync(directory), directory)
fs.mkdirSync(directory)
const manifestPath = path.join(directory, 'manifest.json')
const files = [...new Set([
  input83Path, input85Path, author83Path, author85Path,
  ...input83.bindings.map(b => b.path), ...input85.bindings.map(b => b.path),
  ...collectionPaths, ...retentionPaths,
  ...collectionPaths.flatMap(p => read(p).outputs.map(b => b.path)),
  ...groups.flatMap(f => [f.spec.path, f.render.path, f.svg.path, f.snapshot.path]),
  new URL(import.meta.url).pathname,
])]
save(manifestPath, {
  schema: 'stemrobin188-bounded-independent-modern-figure-review-inputs@1',
  status: 'pending-first-independent-current-draft-review',
  ticket: 'STEMROBIN-188', assignment: 'SAME188-6', book: '9-10g',
  lesson: 'geo910-c2-s3-n61', figures: groups, authorReports: [bind(author83Path), bind(author85Path)],
  n61TextAdmission: bind(path.join(tmp, 'n61-modern-text-admission-01.json')),
  inheritedSourceAndProceduralHoldsPreserved: true,
  figure85FIRSTEstimatedHeightHOLDPreserved: true,
  figure86StateOnly: 'native A1-label collision remains after repair1/1; no failed image or new acceptance requested',
  bindings: files.map(bind),
  originalFIRSTsBeforeAnyCandidateSpecAuthorReceiptContextOrManifest: true,
  imagesPlanned: 7, maxImageLoads: 8, optionalDiagnostics: 1, maxContextImageLoads: 24,
  snapshotsCountedByRenderedImageUnits: true,
  candidateEditsAuthorized: false, nativeRenderOrPassedChecksAllowed: false,
  wholeLessonApproved: false, promoted: false, published: false,
})
save(path.join(directory, 'blind-intake.json'), {
  schema: 'stemrobin188-blind-figure-intake@1',
  ticket: 'STEMROBIN-188', assignment: 'SAME188-6', book: '9-10g',
  originals: groups.map(f => ({ figure: f.id, original: f.source.sourceImage })),
  afterAllOriginalFIRSTsSealed: bind(manifestPath),
  outputRoot: path.join(tmp, 'n61-fig838485-review-01'),
  FIRSTActual0444BeforeAllLaterMaterial: true,
  noOtherSourceOrFailedCandidateImages: true,
  plannedImageUnits: 7, maxImageLoads: 8, maxContextImageLoads: 24,
})
console.log(JSON.stringify({ directory, figures: groups.map(f => f.id), bindings: files.length,
  plannedImageUnits: 7, optionalDiagnostics: 1 }))

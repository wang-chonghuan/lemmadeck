import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, core, read, bind, save, inventory, retain } from './retain-scoped-evidence-02.mjs'

const root = path.join(tmp, 'source222224-author')
const reportPath = path.join(root, 'next-source-author.json')
const report = read(reportPath)
const collectionPath = path.join(tmp, 'source222224-author-collection-01.json')
const collection = read(collectionPath)
assert.equal(collection.outputsVerified, 61)
assert.equal(collection.outputIndex.sha256,
  '950b0df512f382057ee9ae690e9e0cf5a4865a9e274260707a177ee2796a42d8')
assert.deepEqual(report.pages.map(p => [p.physical_page, p.native_printed_rows, p.native_candidate_rows]),
  [[222, 18, 18], [223, 16, 16], [224, 18, 18]])
assert.deepEqual(report.content_repairs[224], 1)
const inputPath = path.join(tmp, 'source222224-author-inputs-01/manifest.json')
const input = read(inputPath)
const target = path.join(core, 'evidence/stemrobin188-source222224/author-attempt')
const script = new URL(import.meta.url).pathname
if (process.argv[2] === 'retain') {
  retain(target, [...inventory(root), inputPath, input.predecessor.path,
    read(input.predecessor.path).source.path, input.namespaceSource.path,
    path.join(tmp, 'n60-heading-contract-probe-01/toc-snapshot.json'), collectionPath, script], {
    schema: 'stemrobin188-source222224-author-retention@1',
    status: 'author-only22218over18-22316over16-22418over18-FIRST-review-pending',
    report: bind(reportPath), collection: bind(collectionPath),
    nativeCalls: { 222: 1, 223: 1, 224: 2 }, contentRepairs: { 222: 0, 223: 0, 224: 1 },
    source224OriginalCropOverlapFAILPreserved: true, authorImages: 8,
    allAuthorHoldsPreserved: report.holds, sourceIndependentApproval: false,
  })
} else {
  assert.ok(['review222223', 'review224'].includes(process.argv[2]))
  const numbers = process.argv[2] === 'review224' ? [224] : [222, 223]
  const retentionPath = path.join(target, 'bindings.json')
  read(retentionPath)
  const pages = report.pages.filter(p => numbers.includes(p.physical_page)).map(p => {
    const page = p.physical_page
    const work = path.join(root, 'work/9-10g/pages', String(page).padStart(4, '0'))
    const ownOriginal = path.join(work, 'page.png')
    const known = collection.outputs.find(f => f.path === ownOriginal)
    assert.equal(known.sha256, p.original.sha256)
    return {
      page, original: bind(ownOriginal), preparedLayout: bind(path.join(work, 'layout.json')),
      authorFIRST: p.FIRST, candidateMD: p.candidate, candidateJSON: p.structured_candidate,
      audit: p.audit, nativeAttempts: p.attempts, repairsUsed: report.content_repairs[page],
    }
  })
  const crops = pages.flatMap(p => read(p.audit.path).figures.map(f => ({
    page: p.page, id: f.id, box: f.box,
    ...bind(path.join(root, 'work/9-10g/pages', String(p.page).padStart(4, '0'), 'figures', `${f.id}.png`)),
  })))
  assert.equal(crops.length, numbers.length === 1 ? 2 : 3)
  const predecessor = numbers.length === 1
    ? bind(path.join(root, 'artifacts/9-10g/pages/0223/page.json')) : input.predecessor
  const files = [...new Set([
    ...pages.flatMap(p => [p.original.path, p.preparedLayout.path,
      p.authorFIRST.path, p.authorFIRST.seal.path, p.candidateMD.path, p.candidateJSON.path, p.audit.path,
      ...p.nativeAttempts.flatMap(a => [a.candidate.path, a.command.path, a.stdout.path, a.stderr.path,
        a.result.path, ...a.first_failure_preserved.map(f => f.path)])]),
    ...crops.map(f => f.path), predecessor.path, reportPath, collectionPath, retentionPath, script,
    path.join(tmp, 'n60-heading-contract-probe-01/toc-snapshot.json'),
    ...(numbers.length === 1 ? [report.content_repairs.evidence.path] : []),
  ])]
  const directory = path.join(tmp, `source${numbers.join('')}-FIRST-review-inputs-01`)
  assert.ok(!fs.existsSync(directory), directory)
  fs.mkdirSync(directory)
  const manifestPath = path.join(directory, 'manifest.json')
  save(manifestPath, {
    schema: 'stemrobin188-source222224-FIRST-independent-review-inputs@1',
    status: 'pending-receipt-blind-FIRST-review', ticket: 'STEMROBIN-188', assignment: 'SAME188-6',
    book: '9-10g', pages, nativeCrops: crops, predecessor, predecessorTextOnly: true,
    originalSourceFIRSTMustSealBeforeCandidateReceiptPredecessorTOC: true,
    nativePrepareFinalizeCounterRenderOrPassedStageRerunsAllowed: false,
    contentRepairsUsed: Object.fromEntries(pages.map(p => [p.page, p.repairsUsed])),
    contentRepairLimitPerPage: 1, imagesPlanned: pages.length + crops.length,
    optionalOriginalDiagnostics: 8 - pages.length - crops.length,
    maxImageLoads: 8, maxContextImageLoads: 24, bindings: files.map(bind),
    wholeLessonApproved: false, modernFigureApproved: false, published: false,
  })
  save(path.join(directory, 'blind-intake.json'), {
    schema: 'stemrobin188-source-receipt-blind-intake@1',
    ticket: 'STEMROBIN-188', assignment: 'SAME188-6', book: '9-10g',
    originals: pages.map(p => ({ page: p.page, original: p.original })),
    afterAllOriginalFIRSTsSealed: bind(manifestPath),
    outputRoot: path.join(tmp, `source${numbers.join('')}-FIRST-review-01`),
    noCandidateAuthorReceiptPredecessorLayoutReadBeforeAllSeals: true,
    maxImageLoads: 8, maxContextImageLoads: 24,
  })
  console.log(JSON.stringify({ directory, bindings: files.length,
    images: pages.length + crops.length, repairsUsed: pages.map(p => [p.page, p.repairsUsed]) }))
}

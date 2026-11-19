import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { isDeepStrictEqual } from 'node:util'

const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck'
const batch = path.join(root, '.intentfold/tickets/STEMROBIN-182/tmp/resume182-13')
const out = path.dirname(fileURLToPath(import.meta.url))
const oldSource = path.join(batch, 'n40-source-stage/artifacts/7a')
const newSource = path.join(batch, 'n40-source-stage-affected/artifacts/7a')
const firstDir = path.join(batch, 'n40-modern-author/first-authored')
const oldTemplates = path.join(batch, 'n40-adapt-work/adapt/7a/modern-us-neutral/lessons/alg7-c4-s2-n40')
const newTemplates = path.join(batch, 'n40-adapt-work-affected/adapt/7a/modern-us-neutral/lessons/alg7-c4-s2-n40')
const digest = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const inputs = new Map()
const checks = []

if (process.cwd() !== root) throw new Error('Wrong checkout')
const branch = execFileSync('git', ['branch', '--show-current'], { cwd: root, encoding: 'utf8' }).trim()
const head = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim()
if (branch !== 'codex/STEMROBIN-182-textbooks') throw new Error('Wrong branch')
function read(filename) {
  const bytes = fs.readFileSync(filename)
  inputs.set(filename, { path: filename, sha256: digest(bytes), bytes: bytes.length })
  return bytes
}
const json = (filename) => JSON.parse(read(filename).toString('utf8'))
function check(name, pass, details) {
  checks.push({ name, pass: Boolean(pass), ...(details ? { details } : {}) })
}
function write(name, value) {
  const filename = path.join(out, name)
  if (path.dirname(filename) !== out) throw new Error('Output outside review directory')
  fs.writeFileSync(filename, typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const firstReview = json(path.join(out, 'review-FIRST.json'))
const prescriptionPath = path.join(out, 'erratum-prescription-FIRST.json')
const prescription = json(prescriptionPath)
const applicationPath = path.join(batch, 'n40-erratum-application.json')
const application = json(applicationPath)
const sourceBindingPath = path.join(batch, 'n40-source-stage-affected/binding.json')
const sourceBinding = json(sourceBindingPath)
check('Application binds exact FIRST prescription',
  application.sourcePrescription.path === path.relative(root, prescriptionPath)
  && application.sourcePrescription.sha256 === inputs.get(prescriptionPath).sha256)

const firstFiles = [
  ['review-FIRST.json', 'ae1edabdb474e83f7f63afe3378f8409232b2b08cbe4d3e0c1026afdb7d8b154'],
  ['review-FIRST.md', 'a58bd19d05da3b205b707432131d35ee5e93b9f05a4ece5abc67f0c472d33b06'],
  ['erratum-prescription-FIRST.json', '967501160b859ad62bc1c3821fc1cb24c4e7f2946c416f129398cc345e7432c1'],
  ['bindings-FIRST.json', 'd14356d6ca38b111644cdc43d7d005b918b706723071fd2ed2e40c252e2c72b0'],
  ['hashes-FIRST.sha256', 'f13f1f7bd5b1f9d38c05aca726ee55983841aa770e129099c26ec1a026c452db'],
  ['image-ledger-FIRST.json', 'd88b1066bc5095accbdc6e38c45c7c403869ec2c6a6bb39724a556925f11395c'],
  ['prose-flow-FIRST.json', '5dede4b5a15824b56cc0c8a243ffd8871660269fd8fe1dc85929008c6a4559a6'],
  ['collect-FIRST.mjs', 'ab8fe6315039c0b35b78cb17a0b8e3caa62670099f02aac38f4a04c47120e761'],
]
for (const [name, expected] of firstFiles) {
  const filename = path.join(out, name)
  read(filename)
  check(`Original FIRST evidence preserved: ${name}`, inputs.get(filename).sha256 === expected)
}
const firstBindings = json(path.join(out, 'bindings-FIRST.json'))
for (const name of ['author-report.md', 'author-check-FIRST.json', 'input-hashes.json', 'prose-flow-FIRST.json']) {
  const filename = path.join(batch, 'n40-modern-author', name)
  read(filename)
  const expected = firstBindings.files.find((item) => item.path === filename)
  check(`Original author evidence preserved: ${name}`, inputs.get(filename).sha256 === expected?.sha256)
}

const receiptNames = [
  'source243-erratum-affected1',
  'n40-erratum-stage-affected1',
  'n40-erratum-modern-prepare-affected1',
  'n40-erratum-template-affected1',
  'n40-assembly-FIRST',
]
const receipts = receiptNames.map((name) => {
  const filename = path.join(batch, `stages/${name}.receipt.json`)
  const receipt = json(filename)
  check(`Receipt exit and checkout: ${name}`, receipt.exit === 0 && receipt.cwd === root && !receipt.error)
  for (const stream of receipt.streams) {
    const streamPath = path.join(root, stream.path)
    read(streamPath)
    check(`Receipt stream binding: ${stream.path}`, inputs.get(streamPath).sha256 === stream.sha256)
  }
  return { name, path: filename, sha256: inputs.get(filename).sha256, ...receipt }
})
const prepareReceipt = receipts.find((item) => item.name === 'n40-erratum-modern-prepare-affected1')
check('Prepare receipt targets affected source and work only',
  prepareReceipt.command.includes('adapt-prepare')
  && prepareReceipt.command.includes(path.relative(root, path.dirname(newSource)))
  && prepareReceipt.command.includes(path.relative(root, path.join(batch, 'n40-adapt-work-affected')))
  && prepareReceipt.command.at(-1) === 'alg7-c4-s2-n40')
const reusedReceipt = receipts.find((item) => item.name === 'n40-assembly-FIRST')
check('Original assembly receipt reused exactly',
  sourceBinding.rawAssemblyReused.path === path.relative(root, reusedReceipt.path)
  && sourceBinding.rawAssemblyReused.sha256 === reusedReceipt.sha256
  && reusedReceipt.sha256 === '009b60a2e4b28f0fcb4cd1e95dd4bf03d8793d97bf01f1fdda297998cc8ea049')

for (const item of sourceBinding.inputs) {
  const suffix = item.path.split('/pages/')[1]
  const filename = path.join(newSource, 'pages', suffix)
  const bytes = read(filename)
  check(`Affected staged page matches source binding: ${suffix}`, digest(bytes) === item.sha256)
  if (!suffix.startsWith('0243/')) {
    check(`Unaffected source page bytes preserved: ${suffix}`,
      bytes.equals(read(path.join(oldSource, 'pages', suffix))))
  }
}
const page = json(path.join(newSource, 'pages/0243/page.json'))
const oldPage = json(path.join(oldSource, 'pages/0243/page.json'))
check('p0243 faithful blocks deep-equal FIRST', isDeepStrictEqual(page.blocks, oldPage.blocks))
const expectedMeta = structuredClone(oldPage.meta)
expectedMeta.errata = page.meta.errata
check('p0243 metadata differs only by errata', isDeepStrictEqual(page.meta, expectedMeta))
function markdownBody(filename) {
  const text = read(filename).toString('utf8')
  const delimiter = text.indexOf('\n---\n', 4)
  if (!text.startsWith('---\n') || delimiter < 0) throw new Error('Unexpected page frontmatter')
  return text.slice(delimiter + 5)
}
check('p0243 faithful Markdown body bytes preserved',
  markdownBody(path.join(newSource, 'pages/0243/page.md')) === markdownBody(path.join(oldSource, 'pages/0243/page.md')))
const audit = json(path.join(newSource, 'pages/0243/audit.json'))
check('Existing affected page audit: 24 rows, zero normalizations, one erratum',
  audit.lines_printed === 24 && audit.lines_md === 24 && audit.normalizations.length === 0
  && audit.errata === 1 && audit.errors.length === 0)
check('One normalized source erratum',
  page.meta.errata.length === 1 && page.meta.errata[0].id === 'p0243-math-1'
  && page.meta.errata[0].block === 'p0243#9'
  && page.meta.errata[0].original === prescription.original
  && !page.meta.errata[0].original.includes(String.fromCodePoint(0x21b5))
  && page.meta.errata[0].reason.trim().length > 0)
check('Printed formula literal unchanged in p0243#9',
  page.blocks[8].lines[0] === prescription.exactPageBlockText)

const lessonSuffix = 'lessons/alg7-c4-s2-n40/lesson.json'
const rawLessonPath = path.join(newSource, lessonSuffix)
const rawLesson = json(rawLessonPath)
for (const suffix of [
  lessonSuffix, 'lessons/alg7-c4-s2-n40/lesson.md',
  'lessons/alg7-c4-s2-n40/exercises.json', 'book.json',
]) {
  const current = read(path.join(newSource, suffix))
  check(`RAW bytes reused, not re-reviewed: ${suffix}`, current.equals(read(path.join(oldSource, suffix))))
}
check('RAW lesson remains FIRST-bound', inputs.get(rawLessonPath).sha256 === prescription.rawLessonSha256)
check('RAW exercise remains FIRST-bound',
  inputs.get(path.join(newSource, 'lessons/alg7-c4-s2-n40/exercises.json')).sha256
  === '7d782a72a94eeea15c0d3f26b9e763a34f08a0fd42d8a02e500c1647385748c6')

const first = json(path.join(firstDir, 'lesson.template.json'))
const currentPath = path.join(newTemplates, 'lesson.template.json')
const current = json(currentPath)
for (const snapshot of firstReview.snapshots) {
  read(snapshot.snapshotPath)
  check(`Authored FIRST snapshot hash preserved: ${path.basename(snapshot.snapshotPath)}`,
    inputs.get(snapshot.snapshotPath).sha256 === snapshot.sha256)
}
for (const name of ['lesson', 'exercises', 'figures']) {
  const filename = path.join(newTemplates, `${name}.template.json`)
  read(filename)
  const declared = application.templates.find((item) => item.path === path.relative(root, filename))
  check(`Application binds affected ${name} template`, inputs.get(filename).sha256 === declared?.sha256)
  const oldPath = path.join(oldTemplates, `${name}.template.json`)
  const firstPath = path.join(firstDir, `${name}.template.json`)
  read(oldPath)
  check(`Original editable ${name} template unchanged`,
    inputs.get(oldPath).sha256 === inputs.get(firstPath).sha256)
  if (name !== 'lesson') {
    check(`Affected ${name} template byte-identical to FIRST`,
      inputs.get(filename).sha256 === inputs.get(firstPath).sha256)
  }
}

const sourceRecord = page.meta.errata[0]
const expectedRecord = {
  id: sourceRecord.id,
  target: 'lesson.prose[18]',
  source: {
    page: page.meta.page,
    printed_page: page.meta.printed_page,
    block: sourceRecord.block,
    sha256: inputs.get(path.join(newSource, 'pages/0243/page.json')).sha256,
    pdf_sha256: page.meta.source.pdf_sha256,
  },
  original: sourceRecord.original,
  corrected: prescription.corrected,
  reason: sourceRecord.reason,
}
check('Source-derived edition record exact', isDeepStrictEqual(current.errata, [expectedRecord]))
check('New page hash replaces pre-registration hash',
  expectedRecord.source.sha256 !== prescription.currentPageJsonSha256)
check('Unique original and source target binding',
  isDeepStrictEqual(rawLesson.prose[18].source_refs, ['p0243#9'])
  && rawLesson.prose[18].text.split(prescription.original).length === 2)
check('Embedded immutable RAW still exact',
  isDeepStrictEqual(current.source.data, rawLesson)
  && current.source.sha256 === inputs.get(rawLessonPath).sha256)
check('Unchanged 18 authored prose objects',
  current.prose.length === 19 && current.prose.slice(0, 18).every((item, index) =>
    isDeepStrictEqual(item, first.prose[index])))
check('Five FIRST anchors unchanged', current.section_breaks.length === 5
  && isDeepStrictEqual(current.section_breaks, first.section_breaks))
const expected = structuredClone(first)
expected.prose[18].text = first.prose[18].text.replace(prescription.original, prescription.corrected)
expected.prose[18].changes = ['layout', 'math-correction']
expected.errata = [expectedRecord]
check('Entire lesson differs only by prescribed text, declaration and bound erratum',
  isDeepStrictEqual(current, expected))
check('Single-minus correction exact',
  prescription.corrected === prescription.original.replace('=\\sqrt{(-a)^2}', '=-\\sqrt{(-a)^2}')
  && current.prose[18].text.split(prescription.corrected).length === 2
  && !current.prose[18].text.includes(prescription.original))
check('Changed formula and negative premise bound to FIRST',
  current.prose[18].text.startsWith('如果$a<0$，那么$-a>0$，\n')
  && isDeepStrictEqual(current.prose[18].source_refs, ['p0243#9'])
  && current.prose[18].source_text === first.prose[18].source_text)

const bindings = [...inputs.values()].map((item) => ({
  ...item,
  unchangedAtEnd: digest(fs.readFileSync(item.path)) === item.sha256,
}))
check('All review inputs stable during collection', bindings.every((item) => item.unchangedAtEnd))
const failures = checks.filter((item) => !item.pass)
const report = {
  schema: 'stemrobin182/n40-modern-review-affected1@1',
  capturedAt: new Date().toISOString(),
  checkout: root,
  branch,
  head,
  status: failures.length ? 'hold' : 'pass',
  scope: 'Only FIRST finding n40-FIRST-p0243-negative-a-minus; inherited unrelated FIRST verdicts are not repeated.',
  supersedesHoldForFinding: failures.length ? null : prescription.id,
  originalFirstReviewPreserved: true,
  counts: {
    affectedSourceErrata: 1,
    affectedModernProseObjects: 1,
    changedFormulaOccurrencesReviewed: 1,
    sourcePagesContentReReviewed: 0,
    unchangedProseObjectsInherited: 18,
    exercisesInherited: 14,
    figures: 0,
    unchangedBoundaryAnchorsInherited: 5,
    allFormulaSetReReviewed: false,
    imagesOpenedThisReview: 0,
    imageCountBefore: 1,
    imageCountAfter: 1,
    reviewerFinalizersRun: 0,
    outstandingFindings: failures.length,
  },
  sourceRecord: expectedRecord,
  reviewedText: current.prose[18].text,
  mathematics: {
    judgment: 'The prescribed chain is valid for every a<0: sqrt((-a)^2)=|-a|=-a, so the newly negative radical product equals a*sqrt(2), as do its neighboring terms.',
    signedSubstitution: { a: -1, correctedTerms: Array(5).fill('-sqrt(2)') },
    imageAdjudication: 'Inherited from the sole FIRST pixel load; no additional image read.',
  },
  templateHashes: application.templates.map((item) => ({
    path: path.join(root, item.path), sha256: inputs.get(path.join(root, item.path)).sha256,
  })),
  checks,
  failures,
  parentReceiptsReadOnly: receipts,
  boundaries: {
    unchanged: isDeepStrictEqual(current.section_breaks, first.section_breaks),
    parserRerun: false,
    inheritedResolvedIndices: firstReview.resolvedBoundaryIndices,
  },
  limitations: {
    sourceOrTemplateEdited: false,
    durableProductionPageReopened: false,
    unchangedFormulaSetReReviewed: false,
    answersKeysChoicesRead: false,
    networkOrDbAccess: false,
    finalizationRenderTests: false,
    contentFinalizationApproval: 'This is affected text/source-binding approval, not proof of parent adapt-finalize or its normalized output.',
  },
  next: failures.length ? 'Resolve only reported affected findings.' : 'Parent owns the single adapt-finalize; retain context for hash-only output binding if normalization changes bytes.',
}
write('review-affected1.json', report)
write('bindings-affected1.json', {
  schema: 'stemrobin182/n40-modern-review-bindings-affected1@1',
  checkout: root, branch, head, files: bindings,
})
write('hashes-affected1.sha256', bindings.map((item) => `${item.sha256}  ${item.path}`).join('\n') + '\n')
console.log(JSON.stringify({
  status: report.status, counts: report.counts, failures, output: out,
  pageJsonSha256: expectedRecord.source.sha256,
  templateHashes: report.templateHashes,
}, null, 2))

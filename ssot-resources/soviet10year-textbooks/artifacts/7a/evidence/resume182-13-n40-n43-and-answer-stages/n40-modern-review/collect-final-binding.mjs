import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { isDeepStrictEqual } from 'node:util'

const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck'
const batch = path.join(root, '.intentfold/tickets/STEMROBIN-182/tmp/resume182-13')
const out = path.dirname(fileURLToPath(import.meta.url))
const templates = path.join(batch, 'n40-adapt-work-affected/adapt/7a/modern-us-neutral/lessons/alg7-c4-s2-n40')
const outputs = path.join(batch, 'n40-source-stage-affected/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s2-n40')
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const bindings = new Map()
const checks = []

if (process.cwd() !== root) throw new Error('Wrong checkout')
const branch = execFileSync('git', ['branch', '--show-current'], { cwd: root, encoding: 'utf8' }).trim()
const head = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim()
if (branch !== 'codex/STEMROBIN-182-textbooks') throw new Error('Wrong branch')
function read(filename) {
  const bytes = fs.readFileSync(filename)
  bindings.set(filename, { path: filename, sha256: hash(bytes), bytes: bytes.length })
  return bytes.toString('utf8')
}
const json = (filename) => JSON.parse(read(filename))
function check(name, pass) { checks.push({ name, pass: Boolean(pass) }) }
function write(name, value) {
  const filename = path.join(out, name)
  if (path.dirname(filename) !== out) throw new Error('Output outside authorized review directory')
  fs.writeFileSync(filename, typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
function difference(a, b, location = '') {
  if (isDeepStrictEqual(a, b)) return []
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    return [...new Set([...Object.keys(a), ...Object.keys(b)])]
      .flatMap((key) => difference(a[key], b[key], `${location}/${key}`))
  }
  return [{ path: location, before: a, after: b }]
}

const priorPath = path.join(out, 'review-affected1.json')
const prior = json(priorPath)
check('Prior affected PASS is exact preserved evidence',
  prior.status === 'pass' && bindings.get(priorPath).sha256 === 'b73873a772d4c22f3449ef7c1dd7ef6ec4e6f72966a6fb9f35484139034f70a5')
const repairPath = path.join(batch, 'n40-punctuation-repair.json')
const repair = json(repairPath)
const firstPath = path.join(root, repair.first.path)
const first = json(firstPath)
check('Saved pre-punctuation template is the approved affected template',
  bindings.get(firstPath).sha256 === repair.first.sha256
  && repair.first.sha256 === prior.templateHashes[0].sha256)
const currentPath = path.join(templates, 'lesson.template.json')
const current = json(currentPath)
check('Current repaired template matches repair hash',
  repair.current.path === path.relative(root, currentPath)
  && bindings.get(currentPath).sha256 === repair.current.sha256)
const savedFlowPath = path.join(batch, 'n40-punctuation-prose-flow.json')
const savedFlow = json(savedFlowPath)
const firstFlow = json(path.join(out, 'prose-flow-FIRST.json'))
const indices = firstFlow.resolvedBreaks
check('Saved flow indices retain prior boundaries',
  isDeepStrictEqual(indices, [3, 6, 8, 12, 15])
  && isDeepStrictEqual(repair.boundaryIndicesUnchanged, indices))
const punctuationOnly = structuredClone(first)
punctuationOnly.prose[3].text = punctuationOnly.prose[3].text.replace('因数4。', '因数4.')
punctuationOnly.prose[6].text = punctuationOnly.prose[6].text.replace('因数5。', '因数5.')
check('Exactly two punctuation-only prose changes',
  isDeepStrictEqual(difference(first.prose, punctuationOnly.prose).map((item) => item.path), ['/3/text', '/6/text']))
const recovery1Path = path.join(templates, 'lesson.template.json.finalize-RECOVERY1.json')
const recovery1 = json(recovery1Path)
check('Failed-anchor checkpoint contains only punctuation changes',
  isDeepStrictEqual(recovery1, punctuationOnly))
check('Saved valid unanchored flow matches current approved paragraphs',
  savedFlow.paragraphs.length === 19
  && savedFlow.paragraphs.every((item, index) => item.index === index
    && item.blockIndex === index && item.paragraphInBlock === 0
    && item.text === punctuationOnly.prose[index].text)
  && savedFlow.resolvedBreaks.length === 0)
const expectedCurrent = structuredClone(punctuationOnly)
expectedCurrent.section_breaks = indices.map((index) => ({
  before: savedFlow.paragraphs[index - 1].text,
  after: savedFlow.paragraphs[index].text,
}))
check('Repaired lesson equals only two punctuation and two anchor updates',
  isDeepStrictEqual(current, expectedCurrent))
check('Only the two corresponding after anchors changed',
  isDeepStrictEqual(difference(first.section_breaks, current.section_breaks).map((item) => item.path),
    ['/0/after', '/1/after']))
check('Source erratum and approved correction unchanged',
  isDeepStrictEqual(first.errata, [prior.sourceRecord])
  && isDeepStrictEqual(current.errata, first.errata)
  && isDeepStrictEqual(current.prose[18], first.prose[18]))

const receiptSpecs = [
  ['n40-modern-finalize-FIRST', 2],
  ['n40-modern-finalize-RECOVERY1', 2],
  ['n40-punctuation-anchor-RECOVERY2', 1],
  ['n40-punctuation-anchor-RECOVERY3', 0],
  ['n40-modern-finalize-RECOVERY2', 0],
]
const receipts = receiptSpecs.map(([name, expectedExit]) => {
  const filename = path.join(batch, `stages/${name}.receipt.json`)
  const receipt = json(filename)
  check(`Existing parent receipt checkout/exit: ${name}`,
    receipt.cwd === root && receipt.exit === expectedExit && !receipt.error)
  for (const stream of receipt.streams) {
    const streamPath = path.join(root, stream.path)
    read(streamPath)
    check(`Existing stream hash: ${stream.path}`, bindings.get(streamPath).sha256 === stream.sha256)
  }
  return { name, path: filename, sha256: bindings.get(filename).sha256, ...receipt }
})
const successReceipt = receipts.at(-1)
check('Successful parent finalize targets exact affected scope',
  successReceipt.command.includes('adapt-finalize')
  && successReceipt.command.includes(path.relative(root, path.join(batch, 'n40-source-stage-affected/artifacts')))
  && successReceipt.command.includes(path.relative(root, path.join(batch, 'n40-adapt-work-affected')))
  && successReceipt.command.at(-1) === 'alg7-c4-s2-n40')
read(path.join(batch, 'repair-n40-punctuation-anchors.FIRST.cjs'))
read(path.join(batch, 'repair-n40-punctuation-anchors.cjs'))
read(path.join(root, '.claude/skills/ld-s10y-lesson/tools/edition.py'))

const exerciseTemplatePath = path.join(templates, 'exercises.template.json')
const figureTemplatePath = path.join(templates, 'figures.template.json')
const exerciseTemplate = json(exerciseTemplatePath)
const figureTemplate = json(figureTemplatePath)
check('Exercise template remains prior PASS-bound',
  bindings.get(exerciseTemplatePath).sha256 === prior.templateHashes[1].sha256)
check('Figure template remains prior PASS-bound',
  bindings.get(figureTemplatePath).sha256 === prior.templateHashes[2].sha256)
const lessonPath = path.join(outputs, 'lesson.json')
const exercisePath = path.join(outputs, 'exercises.json')
const figurePath = path.join(outputs, 'figures.json')
const auditPath = path.join(outputs, 'adaptation.audit.json')
const lessonOutput = json(lessonPath)
const exerciseOutput = json(exercisePath)
const figureOutput = json(figurePath)
const audit = json(auditPath)
const expectedLesson = structuredClone(current)
expectedLesson.status = 'ready'
check('Ready lesson equals current template except status', isDeepStrictEqual(lessonOutput, expectedLesson))
const expectedFigures = structuredClone(figureTemplate)
expectedFigures.status = 'ready'
check('Ready figure manifest equals current template except status', isDeepStrictEqual(figureOutput, expectedFigures))

const expectedExercises = structuredClone(exerciseTemplate)
expectedExercises.status = 'ready'
const expectedWhitespace = [
  [9, ['\n这两种方法当中']],
  [11, ['\n取', '\n如果']],
]
for (const [index, segments] of expectedWhitespace) {
  const item = expectedExercises.exercises[index]
  for (const segment of segments) item.text = item.text.replace(segment, ` ${segment.slice(1)}`)
  item.lines = item.text.split('\n')
  const sourceText = exerciseTemplate.exercises[index].text
  check(`Normalized exercise ${item.number} changes whitespace only`,
    item.text.replace(/\s/g, '') === sourceText.replace(/\s/g, ''))
}
check('Ready exercises equal templates plus only documented tail whitespace normalization',
  isDeepStrictEqual(exerciseOutput, expectedExercises))
check('Output source erratum exactly retains prior PASS record',
  isDeepStrictEqual(lessonOutput.errata, [prior.sourceRecord]))
const resolvedAnchors = indices.map((index, position) => ({ index, ...current.section_breaks[position] }))
check('Audit records ready-object counts and exact final anchors',
  audit.status === 'pass' && audit.errors.length === 0
  && audit.lesson === 'alg7-c4-s2-n40' && audit.edition === 'modern-us-neutral'
  && audit.proseBlocks === lessonOutput.prose.length && audit.proseBlocks === 19
  && audit.exercises === exerciseOutput.exercises.length && audit.exercises === 14
  && audit.figures === figureOutput.figures.length && audit.figures === 0
  && audit.errata === 1 && audit.sectionBreaks === 5
  && isDeepStrictEqual(audit.resolvedSectionBreaks, resolvedAnchors))
check('Audit source hashes equal unchanged embedded RAW bindings',
  audit.sourceLessonSha256 === current.source.sha256
  && audit.sourceExercisesSha256 === exerciseTemplate.source.sha256)

const allBindings = [...bindings.values()].map((item) => ({
  ...item, unchangedAtEnd: hash(fs.readFileSync(item.path)) === item.sha256,
}))
check('All input/output bindings stable during review', allBindings.every((item) => item.unchangedAtEnd))
const failures = checks.filter((item) => !item.pass)
const report = {
  schema: 'stemrobin182/n40-final-punctuation-output-binding@1',
  capturedAt: new Date().toISOString(),
  checkout: root, branch, head,
  status: failures.length ? 'hold' : 'pass',
  scope: 'Affected punctuation/anchor review and current ready-output binding only; source and mathematics PASS inherited.',
  counts: {
    punctuationOccurrencesReviewed: 2,
    proseObjectsAffectedByPunctuation: 2,
    boundaryAnchorsUpdated: 2,
    normalizedExerciseObjects: 2,
    newMathematicsReviewed: 0,
    sourcePagesReReviewed: 0,
    imagesOpenedThisReview: 0,
    cumulativeImagesBefore: 1,
    cumulativeImagesAfter: 1,
    reviewerFinalizersRun: 0,
    readyProseObjects: 19,
    readyExercises: 14,
    readyFigures: 0,
    resolvedBoundaries: 5,
    preservedErrata: 1,
    outstandingFindings: failures.length,
  },
  priorPass: { path: priorPath, sha256: bindings.get(priorPath).sha256 },
  repair: { path: repairPath, sha256: bindings.get(repairPath).sha256 },
  savedFlow: { path: savedFlowPath, sha256: bindings.get(savedFlowPath).sha256, parserRerun: false },
  approvedTemplateBeforePunctuation: { path: firstPath, sha256: bindings.get(firstPath).sha256 },
  templateChanges: difference(first, current),
  readyOutputDifferences: {
    lesson: difference(current, lessonOutput),
    exercises: difference(exerciseTemplate, exerciseOutput),
    figures: difference(figureTemplate, figureOutput),
  },
  normalizationMeaning: 'The two instruction tails in exercises 829 and 831 are retained verbatim; only their line separators become spaces inside the last subpart. Each numbered/Latin subpart still starts its own line. No mathematical/quantity/instruction edits occur.',
  finalBindings: [lessonPath, exercisePath, figurePath, auditPath].map((filename) => bindings.get(filename)),
  templateBindings: [currentPath, exerciseTemplatePath, figureTemplatePath].map((filename) => bindings.get(filename)),
  sourceErratumInheritedExact: prior.sourceRecord,
  resolvedAnchors,
  checks, failures,
  parentReceiptsReadOnly: receipts,
  recoveryInterpretation: {
    firstFinalize: 'Existing exit 2: numeric-scanner token discrepancy beside the two translated sentence terminators.',
    recovery1Finalize: 'Existing exit 2: stale adjacent-paragraph anchor after punctuation repair.',
    failedRepair: 'Existing exit 1: saved unanchored flow includes the already-approved negative-a correction, unlike the pre-erratum FIRST flow. Preserved FIRST script asserts before writing the template; the failed stage saved valid flow/checkpoint but did not replace the template.',
    repairRecovery: 'Existing exit 0: reuses saved flow and compares against the approved erratum-aware baseline before replacing only the two affected anchors.',
    recovery2Finalize: 'Existing exit 0 and audit pass. No finalizer was rerun in this review.',
  },
  limitations: {
    newImages: false,
    fullSourceOrMathReviewRepeated: false,
    sourceOrTemplateOrDurableWrites: false,
    finalizeOrRenderOrTestsRun: false,
    networkDbAppAnswersOrChoicesAccess: false,
    productionPromotionOrPublicationApproval: false,
  },
  stop: 'Final affected binding report saved; stop. Only this review directory was written.',
}
write('final-binding.json', report)
write('final-binding-inputs.json', {
  schema: 'stemrobin182/n40-final-binding-inputs@1',
  checkout: root, branch, head, files: allBindings,
})
write('final-binding-hashes.sha256', allBindings.map((item) => `${item.sha256}  ${item.path}`).join('\n') + '\n')
console.log(JSON.stringify({ status: report.status, counts: report.counts, failures, finalBindings: report.finalBindings, output: out }, null, 2))

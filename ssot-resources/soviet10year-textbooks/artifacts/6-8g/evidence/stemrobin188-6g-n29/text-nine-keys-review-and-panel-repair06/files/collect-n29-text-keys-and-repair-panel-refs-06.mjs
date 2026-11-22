import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const shaObject = object => createHash('sha256').update(JSON.stringify(object)).digest('hex')
const reportFile = path.join(tmp, 'n29-text-nine-answers-independent-review-06/Report.json')
assert.equal(hash(reportFile), 'fbf0200062d7aff9d2ce103878ed30e0b4ebb1b89f7963527634f12b70f454fa')
const report = read(reportFile)
assert.equal(report.verdicts.modernText, 'REVISE')
assert.equal(report.verdicts.allNinePrompts, 'APPROVE')
assert.equal(report.counters.allOwnSessionsEnded0, true)
assert.equal(report.counters.imagesOpened, 0)
const references = new Map([[reportFile, bind(reportFile)]])
function add(item) {
  assert.equal(hash(item.path), item.sha256, item.path)
  references.set(item.path, { path: item.path, sha256: item.sha256 })
}
for (const item of report.ownedFilesManifest)
  if (item.sha256) add(item)
for (const item of report.retainedOldEvidence)
  if (item.sha256) add(item)
function addBindings(value) {
  if (!value || typeof value !== 'object') return
  if (value.path && value.sha256) add(value)
  else for (const child of Object.values(value)) addBindings(child)
}
addBindings(report.currentBindings)
addBindings(report.sealOrderEvidence)
add(report.sourceFirst)
assert.equal(fs.statSync(report.sourceFirst.path).mode & 0o777, 0o444)
assert.equal(report.sealOrderEvidence.receiptWrittenBeforeCandidateManifest, true)
const keys = read(report.currentBindings.answerCandidate.path)
assert.equal(keys.answers.length, 9)
assert.equal(report.answerVerdicts.length, 9)
for (const answer of keys.answers) {
  const verdict = report.answerVerdicts.find(item => item.exercise === answer.exercise)
  assert.equal(verdict.verdict, 'APPROVE')
  assert.equal(shaObject(answer), verdict.objectJsonStringifySha256)
}
const collectionRoot = path.join(tmp, 'n29-text-keys-independent-collection-06')
fs.mkdirSync(collectionRoot)
const collectionFile = path.join(collectionRoot, 'collection.json')
save(collectionFile, {
  status: 'N29_NINE_EXACT_KEYS_APPROVED_TEXT_PANEL_REFS_REVISE',
  report: bind(reportFile), verdicts: report.verdicts, counters: report.counters,
  currentBindings: report.currentBindings, sourceFirst: report.sourceFirst,
  sealOrderEvidence: report.sealOrderEvidence, answerVerdicts: report.answerVerdicts,
  finding: report.scopedCrossReferenceFinding,
  historicalLimitation: report.historicalLimitation,
  reviewerLookupDiagnostics: report.ownReadLookupFailuresRetained,
  completedChildReportsAllOwnSessionsEnded: true,
  approvedAnswersNotFinalizedYet: true,
  parentImageLoads: 0, wholeLessonApproved: false, published: false,
})
add(bind(collectionFile))
const approvedKeysFile = path.join(collectionRoot, 'answer-keys.nine-approved-draft.json')
fs.copyFileSync(report.currentBindings.answerCandidate.path, approvedKeysFile, fs.constants.COPYFILE_EXCL)
assert.equal(hash(approvedKeysFile), report.currentBindings.answerCandidate.sha256)
fs.chmodSync(approvedKeysFile, 0o444)
add(bind(approvedKeysFile))

const repairRoot = path.join(tmp, 'n29-panel-reference-repair-06')
fs.mkdirSync(repairRoot)
const original = read(report.currentBindings.lessonCandidate.path)
const repaired = structuredClone(original)
const changes = new Map()
for (const correction of report.scopedCrossReferenceFinding.proposedCorrectionsOnly) {
  const match = /^\/prose\/(\d+)\/text$/.exec(correction.pointer)
  assert.ok(match)
  const index = Number(match[1])
  const old = original.prose[index]
  assert.equal(shaObject(old), correction.currentObjectJsonStringifySha256)
  assert.deepEqual(old.source_refs, correction.sourceRefs)
  const replacement = old.text.replaceAll('\u0430', '(a)')
    .replaceAll('\u0431', '(b)').replaceAll('\u0432', '(c)')
  assert.equal(replacement, correction.replacement)
  repaired.prose[index].text = replacement
  changes.set(old.text, replacement)
}
for (const [index, field, proseIndex] of [[0, 'before', 0], [1, 'before', 6], [2, 'after', 11]]) {
  assert.equal(original.section_breaks[index][field], original.prose[proseIndex].text)
  repaired.section_breaks[index][field] = repaired.prose[proseIndex].text
}
const restored = structuredClone(repaired)
for (const index of [0, 6, 8, 11]) restored.prose[index].text = original.prose[index].text
for (const [index, field] of [[0, 'before'], [1, 'before'], [2, 'after']])
  restored.section_breaks[index][field] = original.section_breaks[index][field]
assert.deepEqual(restored, original)
const repairedFile = path.join(repairRoot, 'lesson.panel-refs-repaired.candidate.json')
save(repairedFile, repaired)
fs.chmodSync(repairedFile, 0o444)
add(bind(repairedFile))
const argv = ['.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--json', repairedFile]
const startedAt = new Date().toISOString()
const result = spawnSync(process.execPath, argv, { cwd: repo, encoding: 'utf8' })
const streams = {}
for (const name of ['stdout', 'stderr']) {
  const file = path.join(repairRoot, `prose-flow.${name}`)
  fs.writeFileSync(file, result[name] ?? '', { flag: 'wx' })
  streams[name] = bind(file)
  add(streams[name])
}
const receiptFile = path.join(repairRoot, 'prose-flow.execution.json')
save(receiptFile, {
  cwd: repo, argv: [process.execPath, ...argv], startedAt,
  finishedAt: new Date().toISOString(), exitCode: result.status,
  signal: result.signal, error: result.error?.message ?? null, streams,
  affectedTextOnly: true, sourceOrFigureProducerReplay: false,
})
add(bind(receiptFile))
assert.equal(result.status, 0, result.stderr || result.stdout)
const flow = JSON.parse(result.stdout)
const repairFile = path.join(repairRoot, 'repair.json')
save(repairFile, {
  status: 'N29_FOUR_PANEL_REFS_AND_THREE_ANCHORS_REPAIRED_AFFECTED_REVIEW_PENDING',
  independentReview: bind(reportFile), originalLesson: report.currentBindings.lessonCandidate,
  repairedLesson: bind(repairedFile),
  exactCorrections: report.scopedCrossReferenceFinding,
  changedObjects: [0, 6, 8, 11].map(index => ({
    pointer: `/prose/${index}`, oldSha256: shaObject(original.prose[index]),
    repairedSha256: shaObject(repaired.prose[index]),
  })),
  proseFlow: flow, proseFlowExecution: bind(receiptFile),
  allOtherFieldsAndSourceSnapshotsUnchanged: true,
  approvedNineAnswers: bind(approvedKeysFile),
  noAnswerOrPromptDelta: true, textRepairCount: 1,
  parentImageLoads: 0, independentAffectedReviewPending: true,
  wholeLessonApproved: false, published: false,
})
add(bind(repairFile))
const affectedInput = path.join(repairRoot, 'affected-review-input.json')
save(affectedInput, {
  status: 'N29_PANEL_REFERENCE_AFFECTED_TEXT_REVIEW_ONLY',
  priorReview: bind(reportFile), priorSourceFIRST: report.sourceFirst,
  originalLesson: report.currentBindings.lessonCandidate,
  repairedLesson: bind(repairedFile), repair: bind(repairFile),
  unchangedPrompts: report.currentBindings.promptCandidate,
  approvedNineAnswers: bind(approvedKeysFile),
  expectedImageRequests: 0, noAnswerOrSourceOrFigureReReview: true,
  originalFIRSTAndFailedCandidatesUnchanged: true,
})
add(bind(affectedInput))

// Figure188 embeds two of the changed prose paragraphs as provenance only.
const oldFigureSpecFile = path.join(tmp, 'n29-fig187189-author-first-06/figures/fig-188.spec.json')
const oldFigureSpec = read(oldFigureSpecFile)
const spec = structuredClone(oldFigureSpec)
for (const item of spec.source.authoritativeText)
  if (changes.has(item.text)) item.text = changes.get(item.text)
const restoredSpec = structuredClone(spec)
restoredSpec.source.authoritativeText = oldFigureSpec.source.authoritativeText
assert.deepEqual(restoredSpec, oldFigureSpec)
const updatedSpecFile = path.join(repairRoot, 'fig-188.text-bound.spec.json')
save(updatedSpecFile, spec)
const oldSvgFile = path.join(tmp, 'n29-fig187189-author-first-06/figures/fig-188.svg')
const updatedSvgFile = path.join(repairRoot, 'fig-188.text-bound.svg')
fs.copyFileSync(oldSvgFile, updatedSvgFile, fs.constants.COPYFILE_EXCL)
const oldRenderFile = path.join(tmp, 'n29-fig187189-author-first-06/figures/fig-188.render.json')
const metadata = read(oldRenderFile)
assert.equal(metadata.status, 'pass')
metadata.spec = bind(updatedSpecFile)
metadata.output.svg.path = updatedSvgFile
const updatedRenderFile = path.join(repairRoot, 'fig-188.text-bound.render.json')
save(updatedRenderFile, metadata)
for (const file of [updatedSpecFile, updatedSvgFile, updatedRenderFile]) {
  fs.chmodSync(file, 0o444)
  add(bind(file))
}
assert.equal(hash(updatedSvgFile), hash(oldSvgFile))
const figureBindingFile = path.join(repairRoot, 'fig-188.provenance-text-rebinding.json')
save(figureBindingFile, {
  status: 'SOURCE_PROSE_REFERENCE_TEXT_ONLY_GEOMETRY_SVG_AND_DISPLAY_UNCHANGED',
  originalSpec: bind(oldFigureSpecFile), originalRender: bind(oldRenderFile),
  originalSvg: bind(oldSvgFile),
  current: { spec: bind(updatedSpecFile), svg: bind(updatedSvgFile), render: bind(updatedRenderFile) },
  currentModernText: bind(repairedFile), geometrySourceInventoryDisplayAndSvgUnchanged: true,
  rendererReplays: 0, sourceReopens: 0, independentReviewPending: true,
})
add(bind(figureBindingFile))
const oldQueue = path.join(tmp, 'fig186188189-independent-FIRST-inputs-06')
const queue = path.join(tmp, 'fig186188189-text-sync-independent-FIRST-inputs-06')
fs.mkdirSync(path.join(queue, 'source-only'), { recursive: true })
fs.mkdirSync(path.join(queue, 'post-FIRST'))
const sourceOnly = read(path.join(oldQueue, 'source-only/originals.json'))
sourceOnly.modernProse[1] = { lesson: 'geo68-c2-s4-n29', ...bind(repairedFile) }
const sourceOnlyFile = path.join(queue, 'source-only/originals.json')
save(sourceOnlyFile, sourceOnly)
const post = read(path.join(oldQueue, 'post-FIRST/candidates.json'))
const figure188 = post.figures.find(figure => figure.id === 'fig-188')
Object.assign(figure188, {
  spec: bind(updatedSpecFile), svg: bind(updatedSvgFile), render: bind(updatedRenderFile),
  originalNativeRender: bind(oldRenderFile), sourceTextOnlyRebinding: bind(figureBindingFile),
})
post.currentModernN29Text = bind(repairedFile)
post.modernTextPanelRefsAffectedReviewPending = true
const postFile = path.join(queue, 'post-FIRST/candidates.json')
save(postFile, post)
add(bind(sourceOnlyFile))
add(bind(postFile))
add(bind(path.join(tmp, 'collect-n29-text-keys-and-repair-panel-refs-06.mjs')))
const retained = retainCurrent6g(
  'evidence/stemrobin188-6g-n29/text-nine-keys-review-and-panel-repair06',
  [...references.values()],
  [
    'evidence/stemrobin188-6g-n29/assembly-and-prepare-first06/retention.json',
    'evidence/stemrobin188-6g-n29/text-and-answers-author-first06/retention.json',
    'evidence/stemrobin188-6g-n29/fig187189-author-first06/retention.json',
  ],
  {
    status: 'N29_NINE_EXACT_KEYS_APPROVED_TEXT_REPAIRED_AFFECTED_REVIEW_PENDING',
    nineAnswerObjectsApproved: true, answerChanges: 0, promptChanges: 0,
    changedProseReferenceObjects: 4, dependentAnchorFields: 3, textRepairCount: 1,
    sourceSnapshotsUnchanged: true, fig188ProvenanceTextOnlyRebound: true,
    fig188GeometryInventoryDisplaySvgUnchanged: true, rendererReplays: 0,
    parentImageLoads: 0, reviewerReadOnlyDiagnostics: 2,
    failedHistoricalFullExerciseSnapshotStillUnavailable: true,
  },
)
console.log(JSON.stringify({
  collection: bind(collectionFile), approvedKeys: bind(approvedKeysFile),
  repair: bind(repairFile), affectedInput: bind(affectedInput), retained,
  nextFiguresSourceOnly: bind(sourceOnlyFile), nextFiguresPostFIRST: bind(postFile),
}))

import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { isDeepStrictEqual } from 'node:util'
import { spawnSync } from 'node:child_process'

const cwd = '/Users/yong/.codex/worktrees/d9b1/lemmadeck'
assert.equal(process.cwd(), cwd)
const B = path.join(cwd, '.intentfold/tickets/STEMROBIN-182/tmp/resume182-12')
const review = path.join(B, 'n38-n39-modern-review')
const currentDir = path.join(B, 'n38-n39-modern-work/adapt/7a/modern-us-neutral/lessons/alg7-c4-s2-n39')
const frozenDir = path.join(B, 'n38-n39-modern-author/snapshots/TEXT-FROZEN/alg7-c4-s2-n39')
const rawDir = path.join(B, 'n38-n39-source-stage/artifacts/7a/lessons/alg7-c4-s2-n39')
const sha = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const json = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const objectHash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex')
const bindings = []
function bind(file, expected, role) {
  assert(file.startsWith(`${cwd}/`))
  assert(!/\.(?:png|jpg|jpeg|webp|svg|pdf)$/i.test(file))
  const actual = sha(file)
  if (expected) assert.equal(actual, expected, role)
  const entry = { role, path: file, sha256: actual, expectedSha256: expected ?? null,
    mode: (fs.statSync(file).mode & 0o777).toString(8) }
  bindings.push(entry)
  return entry
}
const firstFile = path.join(review, 'reports/return.json')
bind(firstFile, 'd291b9ad7562716c7595f5374d4c6bf27298d99d03992d3b50f336826035195d', 'preserved-FIRST-return')
const first = json(firstFile)
assert.equal(first.n39.lessonTextVerdict, 'REVISE')
assert.equal(first.n39.exerciseTextVerdict, 'PASS')
for (const item of first.reports) bind(item.path, item.sha256, `preserved-FIRST-${item.role}`)
const firstProbe = json(first.reports.find((x) => x.role.includes('all-bindings')).path)
const frozenLessonFile = path.join(frozenDir, 'lesson.template.json')
bind(frozenLessonFile, '7bb0d75094540710884273718cb9f18d27f81f6611511837b3fc9c8b240b6fb9', 'original-TEXT-FROZEN-lesson')
assert.equal(fs.statSync(frozenLessonFile).mode & 0o222, 0)
const currentLessonFile = path.join(currentDir, 'lesson.template.json')
bind(currentLessonFile, 'dac34df757bb08a2e0275b9b0239ff88f4086caf6a5c2131482275311840fda9', 'affected-current-lesson')
const frozen = json(frozenLessonFile)
const current = json(currentLessonFile)
function diff(a, b, pointer = '') {
  if (isDeepStrictEqual(a, b)) return []
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    return [...new Set([...Object.keys(a), ...Object.keys(b)])]
      .flatMap((key) => diff(a[key], b[key], `${pointer}/${key}`))
  }
  return [{ pointer, first: a, current: b }]
}
const delta = diff(frozen, current)
assert.deepEqual(delta.map((x) => x.pointer), ['/prose/10/text', '/prose/16/text', '/section_breaks/1/after'])
const affected = [10, 16].map((index) => {
  const before = frozen.prose[index], after = current.prose[index]
  const math = (text) => [...text.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs)].map((x) => x[1] ?? x[2])
  const digits = (text) => text.match(/\d+(?:\.\d+)?/g) ?? []
  assert.deepEqual(math(before.text), math(after.text))
  assert.deepEqual(digits(before.text), digits(after.text))
  assert.equal(after.source_text, before.source_text)
  assert.deepEqual(after.source_refs, before.source_refs)
  return { pointer: `/prose/${index}/text`, original: before.text, revised: after.text,
    sourceText: after.source_text, sourceRefs: after.source_refs,
    formulaArrayUnchanged: true, numericTokenSequenceUnchanged: true,
    sourceTextAndRefsUnchanged: true }
})
assert.deepEqual(current.source, frozen.source)
assert.deepEqual(current.errata, frozen.errata)
assert.equal(current.errata.length, 0)
bind(path.join(rawDir, 'lesson.json'), first.n39.sourceLessonSha256, 'unchanged-raw-lesson-hash-only')
bind(path.join(rawDir, 'exercises.json'), first.n39.sourceExercisesSha256, 'unchanged-raw-exercises-hash-only')
const currentExercisesFile = path.join(currentDir, 'exercises.template.json')
const frozenExercisesFile = path.join(frozenDir, 'exercises.template.json')
const exerciseSha = 'e50a97986c1e4f115049e9ae5003c4ff5b658f3fb25ad8a83a4e3aa48c14d907'
bind(currentExercisesFile, exerciseSha, 'unchanged-current-exercise-template-including-819')
bind(frozenExercisesFile, exerciseSha, 'original-TEXT-FROZEN-exercise-template')
const exercise819 = json(currentExercisesFile).exercises.find((x) => x.number === '819')
const frozen819 = json(frozenExercisesFile).exercises.find((x) => x.number === '819')
assert(exercise819)
assert.deepEqual(exercise819, frozen819)
const figureSha = '040b4729046efcb3804ee194fc3c26b610af91e26e6d2a1957f8b49513b9074c'
bind(path.join(currentDir, 'figures.template.json'), figureSha, 'unchanged-figure-placeholder-metadata-only')
bind(path.join(frozenDir, 'figures.template.json'), figureSha, 'original-TEXT-FROZEN-figure-placeholder-metadata-only')
const flowTool = path.join(cwd, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs')
for (const file of [flowTool, path.join(cwd, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js')]) {
  const prior = firstProbe.inputBindings.find((x) => x.path === file)
  assert(prior)
  bind(file, prior.sha256, 'unchanged-existing-prose-flow-tool')
}
const flow = spawnSync(process.execPath, [flowTool, '--json', currentLessonFile], { cwd, encoding: 'utf8' })
assert.equal(flow.status, 0, flow.stderr)
const parsedFlow = JSON.parse(flow.stdout)
assert.equal(parsedFlow.paragraphs.length, 28)
assert.deepEqual(parsedFlow.resolvedBreaks, first.n39.resolvedSectionBreaks)
const revisedBoundary = parsedFlow.boundaries.find((x) => x.index === 10)
assert(revisedBoundary)
assert.equal(revisedBoundary.before, frozen.section_breaks[1].before)
assert.equal(revisedBoundary.after, current.prose[10].text)
assert.deepEqual(current.section_breaks[1], { before: revisedBoundary.before, after: revisedBoundary.after })
const firstFlow = firstProbe.targets['alg7-c4-s2-n39'].flow
assert.deepEqual(parsedFlow.boundaries.filter((x) => x.index !== 10), firstFlow.boundaries.filter((x) => x.index !== 10))
const reviewFile = path.join(review, 'reports/affected-R1-review.md')
bind(reviewFile, null, 'new-affected-only-human-review')
bind(path.join(review, 'probes/affected-R1-probe.mjs'), null, 'new-affected-only-probe')
for (const entry of bindings) assert.equal(sha(entry.path), entry.sha256, `concurrent drift: ${entry.path}`)
const lessonProjection = {
  id: current.id, card_id: current.card_id, title: current.title, printed_title: current.printed_title,
  number: current.number, start_page: current.start_page, start_printed: current.start_printed,
  prose: current.prose, section_breaks: current.section_breaks, source: current.source, errata: current.errata,
}
const result = {
  schema: 'n38-n39-modern-review/affected-R1-return@1', recordedAt: new Date().toISOString(),
  cwd, ticket: 'STEMROBIN-182', invocation: 'same existing invocation', finish: 'review', independent: true,
  scope: ['/prose/10/text', '/prose/16/text', '/section_breaks/1/after'],
  target: 'alg7-c4-s2-n39', verdict: 'PASS', R1Status: 'RESOLVED',
  affectedSemanticAssessment: [
    { pointer: '/prose/10/text', verdict: 'PASS', reason: 'The half-last-unit bound now applies only to main-table values obtained by directly rounding exact values. This follows from nearest-place rounding and is not asserted for the rounded-base-plus-correction result 6.734.' },
    { pointer: '/prose/16/text', verdict: 'PASS', reason: 'Four significant digits are correctly described as the correction method target, not a guarantee that corrected results satisfy the preceding half-unit bound. The inherited example and every formula remain intact.' },
    { pointer: '/section_breaks/1/after', verdict: 'PASS', reason: 'The revised after anchor exactly matches revised prose 10, following unchanged prose 9 at actual paragraph boundary 10. The completed correction example still transitions to a precisely scoped accuracy discussion.' },
  ],
  deltaFromOriginalTextFrozen: delta, affectedTextBindings: affected,
  currentLessonSha256: sha(currentLessonFile), originalTextFrozenLessonSha256: sha(frozenLessonFile),
  currentLessonTextProjectionSha256: objectHash(lessonProjection),
  flowEvidence: {
    command: [process.execPath, flowTool, '--json', currentLessonFile], cwd, exit: flow.status,
    paragraphCount: parsedFlow.paragraphs.length, resolvedBreaks: parsedFlow.resolvedBreaks,
    changedBoundary: revisedBoundary, otherBoundariesUnchanged: true,
    scope: 'Existing read-only prose-flow parser, not a producer/finalizer/test suite.',
  },
  exercise819HashBinding: {
    path: currentExercisesFile, sha256: exerciseSha, originalTextFrozenSha256: exerciseSha,
    sameAsFIRST: true, objectNumber: '819', objectSha256: objectHash(exercise819),
    objectHashRule: 'SHA-256 of compact JSON.stringify of the complete exercise 819 object in file property order.',
    exactObjectEqualityToTextFrozen: true, semanticReReviewPerformed: false,
    priorVerdictReused: 'PASS, text semantics only; no graph inspection or graphical values inferred.',
  },
  immutability: {
    exactThreeFieldDeltaOnly: true, sourceDataUnchanged: true, sourceTextUnchanged: true,
    sourceRefsUnchanged: true, identitiesUnchanged: true, preparedLinesUnchanged: true,
    rawSourceHashesUnchanged: true, unchangedProseNotReReviewed: true,
    allExercisesTemplateByteIdentical: true, figureMetadataByteIdentical: true,
    formulaAndNumericTokensUnchanged: true, errataAdded: 0, sourceOrTemplateWritesByReviewer: 0,
  },
  FIRSTPreservation: {
    return: firstFile, returnSha256: sha(firstFile), review: path.join(review, 'reports/review.md'),
    reviewSha256: sha(path.join(review, 'reports/review.md')),
    allFIRSTReviewFilesUnchanged: true, originalTextFrozenLessonReadOnly: true,
    n38FirstFailureExit: first.n38.firstPreservation.firstExit,
    n38RecoveryExit: first.n38.firstPreservation.recoveryExit,
    n38EvidenceRecheckedOrRerun: false,
    oldREVISEVerdictPreservedInFIRST: true,
  },
  reuseDecision: {
    n38: 'Reuse FIRST PASS; no n38 review or pipeline rerun performed.',
    n39Lesson: 'PASS text/math by combining FIRST approval of unchanged content with this affected-only R1 approval. Bind to the current lesson hash above.',
    n39Exercises: 'Reuse FIRST PASS at the unchanged complete exercise-template hash, including 819 text only.',
    figure55: 'NOT REVIEWED. Independent pixel/inventory/render/review approval remains required.',
    parentFinalization: 'Parent may finalize only after independent Figure 55 approval. Reuse this text PASS unless reviewed text, source evidence or identities change. Final status-only changes require new byte bindings, not repeated semantic review.',
  },
  imageCount: 0, imageOpens: 0, imageFilesRead: 0, figureApproval: false,
  wholeReviewRepeated: false, n38ContentRead: false, finalizeOrPipelineTestsRun: false,
  forbiddenActionsPerformed: {
    sourceTemplateFIRSTEdit: false, imageOrAnswerKeyOrChoiceRead: false, producerSuiteRerun: false,
    database: false, network: false, app: false, dependencies: false, publish: false,
    interactionCap3E: false, merge: false, deploy: false, closure: false, gitWrite: false,
    agentsOrChats: false, outsideReviewReportsProbesWrite: false,
  },
  fileBindings: bindings,
}
const returnFile = path.join(review, 'reports/affected-R1-return.json')
assert(!fs.existsSync(returnFile), 'Preserve existing affected review; do not overwrite.')
fs.writeFileSync(returnFile, `${JSON.stringify(result, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ verdict: result.verdict, R1Status: result.R1Status, return: returnFile,
  returnSha256: sha(returnFile), currentLessonSha256: result.currentLessonSha256,
  exercise819TemplateSha256: exerciseSha, exercise819ObjectSha256: objectHash(exercise819),
  changedPointers: delta.map((x) => x.pointer), resolvedBreaks: parsedFlow.resolvedBreaks,
  FIRSTPreserved: true, imageCount: 0 }, null, 2))

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-181')
const tmp = path.join(ticket, 'tmp')
const own = path.dirname(new URL(import.meta.url).pathname)
const durable = path.join(ticket, 'evidence/reports/d1059-n91')
const raw = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10p')
const modern = path.join(raw, 'editions/modern-us-neutral')
const card = 'phy10-c2-s3-n91'
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.relative(repo, file), sha256: sha(file) })
const verify = binding => assert.equal(sha(path.resolve(repo, binding.path)), binding.sha256)
const save = (file, data) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', { flag: 'wx' })
  return bind(file)
}
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  if (fs.existsSync(to)) assert.equal(sha(from), sha(to), to)
  else fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  return bind(to)
}
const meterFile = path.join(ticket, 'production-meter.json')
const indexFile = path.join(ticket, 'evidence/index.json')
const meter = read(meterFile)
const index = read(indexFile)
const known = new Map(index.reports.map(binding => [binding.sha256, binding]))
const retain = (file, name) => {
  const old = known.get(sha(file))
  if (old && fs.existsSync(path.resolve(repo, old.path))) return old
  const binding = { ...copy(file, path.join(durable, name)), originalPath: path.relative(repo, file), batch: 'D035' }
  known.set(binding.sha256, binding)
  index.reports.push(binding)
  return binding
}
const nativeFile = path.join(tmp, 'd1044-n91-first-bilingual-native/report.json')
const native = read(nativeFile)
assert.equal(native.status, 'FIRST-BILINGUAL-NATIVE-TEXT-READONLY-ANSWERS-PASS')
const textReviewFile = path.join(tmp, 'd1017-n91-f1-phase-affected-review/report.json')
const textReview = read(textReviewFile)
for (const gate of ['SCI', 'ZHEN', 'pedagogy'])
  assert.equal(textReview.effectiveComposedGate[gate], 'PASS')
assert.deepEqual(textReview.effectiveComposedGate.openFindingIds, [])
const answerReviewFile = path.join(tmp, 'd1034-n91-first-written-answer-review/report.json')
assert.equal(read(answerReviewFile).verdict, 'PASS_READONLY_WRITTEN_ANSWERS')
const choiceFile = path.join(tmp, 'd1046-n91-native-choice-binding/report.json')
const choices = read(choiceFile)
assert.equal(choices.status, 'NATIVE-CHOICE-PROVENANCE-REBINDING-MECHANICAL-PASS')
const attestationFile = path.join(tmp, 'd1038-n91-first-independent-choice-review/native-rebinding-attestation.json')
assert.equal(read(attestationFile).status, 'PASS')
const captureFile = path.join(tmp, 'd1047-n91-first-display/report.json')
const capture = read(captureFile)
assert.equal(capture.status, 'FIRST-SIXTEEN-SURFACE-DOM-CAPTURE-PASS-VISUAL-PENDING')
assert.equal(capture.checks.length, 16)
assert.equal(capture.targets.length, 45)
verify(capture.native)
verify(capture.choiceBinding)
verify(capture.attestation)
const observations = []
const reviewBindings = []
const imageAgents = ['01a1f1fe-424e-7e90-b931-c43b4469805b', '01a1f1fe-4288-7252-86af-a5a2a873c6c1',
  '01a1f1fe-42be-7751-ad2e-4b2e2473879d', '01a1f1fe-42e9-7e12-b1b9-17b6090e484a',
  '01a1f1fe-4314-7cf0-b922-dad1fe020f11', '01a1f201-12c0-7623-a9af-c347b53bc7bd']
for (const batchIndex of [0, 1, 2, 3, 4, 5]) {
  const directory = `d${1051 + batchIndex}-n91-display-review-batch${batchIndex + 1}`
  const reportFile = path.join(tmp, directory, 'report.json')
  const review = read(reportFile)
  assert.equal(review.status, 'PASS')
  assert.equal(review.reviewBatchIndex, batchIndex)
  assert.equal(review.targets.length, capture.reviewBatches[batchIndex].targets.length)
  assert.equal(review.actualImageOpens, capture.reviewBatches[batchIndex].targets.length)
  for (const result of review.targets) {
    assert.equal(result.verdict, 'PASS')
    const expected = capture.reviewBatches[batchIndex].targets.find(target => target.image.path === result.target.image.path)
    assert.ok(expected)
    assert.deepEqual(result.target, expected)
    verify(expected.image)
    verify(expected.original)
    observations.push({ target: expected, review: bind(reportFile), evidence: result.evidence })
  }
  reviewBindings.push(retain(reportFile, `display-reviews/batch-${batchIndex + 1}.json`))
  const usage = retain(path.join(tmp, directory, 'usage.json'), `display-reviews/batch-${batchIndex + 1}-usage.json`)
  meter.activeHumanDirection.ephemeralImageBatches.push({
    id: imageAgents[batchIndex], batch: 'd' + (1051 + batchIndex), scope: 'N91-FIRST-DISPLAY',
    actualImages: review.actualImageOpens, maximumImages: 8, contextLimit: 24,
    status: 'COMPLETED-CLOSED', imagesReturnedToParent: 0, usage,
  })
}
assert.equal(new Set(observations.map(item => item.target.image.path)).size, 45)
assert.ok(!fs.existsSync(path.join(raw, 'lessons', card)))
assert.ok(!fs.existsSync(path.join(modern, 'lessons', card)))
assert.ok(!meter.currentCheckpoint.completeUnbatchedCards.includes(card))
save(path.join(own, 'started.json'), { card, native: bind(nativeFile), capture: bind(captureFile), offlineOnly: true })
const display = save(path.join(durable, 'display-composition.json'), {
  card, status: 'DISPLAY-PASS-SIXTEEN-SURFACES-45-INDEPENDENT-TILES', fullDISPLAY: true,
  checks: capture.checks, observations, reviews: reviewBindings,
  capture: retain(captureFile, 'capture.json'), actualReviewerImageOpens: 45,
  parentNewImageOpens: 0, noNativeOrSemanticReplay: true,
  formalHeadedAcceptance: false, limitation: capture.limitation,
})
index.reports.push({ ...display, batch: 'D035' })
for (const target of capture.targets) retain(target.image.path, 'display-pixels/' + path.basename(target.image.path))
for (const screenshot of capture.screenshots) retain(screenshot.path, 'display-full/' + path.basename(screenshot.path))
for (const html of capture.html) retain(html.path, `${html.locale}/html/${html.surface}.html`)
retain(path.join(tmp, 'd1047-n91-first-display/capture.mjs'), 'display-execution/capture.mjs')
const textBinding = retain(textReviewFile, 'text-effective-review.json')
const answerBinding = retain(answerReviewFile, 'answer-independent-review.json')
const choiceBinding = retain(choiceFile, 'choice-native-binding.json')
const attestation = retain(attestationFile, 'choice-native-attestation.json')
retain(path.join(tmp, 'd1038-n91-first-independent-choice-review/report.json'), 'choice-first-independent-report.json')
retain(path.join(tmp, 'd1038-n91-first-independent-choice-review/usage.json'), 'choice-first-independent-usage.json')
for (const [directory, name] of [
  ['d986-n91-first-independent-text-review', 'FIRST-text-failure'],
  ['d1007-n91-two-finding-affected-review', 'FIRST-affected-text-failure'],
  ['d1016-n91-f1-phase-only-repair', 'F1-phase-repair'],
]) retain(path.join(tmp, directory, 'report.json'), name + '.json')
const nativeBinding = retain(nativeFile, 'native-report.json')
for (const call of native.calls) retain(call.path, 'calls/' + path.relative(path.join(tmp, 'd1044-n91-first-bilingual-native/native'), call.path))
const outputs = []
const zh = native.outputs.zh
for (const name of ['lesson.json', 'lesson.md', 'exercises.json'])
  outputs.push(copy(path.join(zh.raw, 'lessons', card, name), path.join(raw, 'lessons', card, name)))
for (const [locale, packet] of Object.entries(native.outputs)) {
  for (const binding of [...packet.nativeFiles, ...packet.html]) verify(binding)
  assert.equal(read(path.join(packet.target, 'adaptation.audit.json')).status, 'pass')
  assert.equal(read(path.join(packet.target, 'exercises.json')).count, 5)
  assert.deepEqual(read(path.join(packet.target, 'figures.json')).figures, [])
  const answers = read(path.join(packet.target, 'answer-keys.json'))
  assert.equal(answers.status, 'ready')
  assert.equal(answers.answers.length, 5)
  assert.ok(answers.answers.every(answer => answer.grading === 'ungraded' && answer.parts.length === 0))
  for (const binding of packet.nativeFiles)
    if (locale === 'zh') outputs.push(copy(binding.path, path.join(modern, 'lessons', card, path.basename(binding.path))))
    else retain(binding.path, 'en/native/' + path.basename(binding.path))
  assert.ok(!fs.existsSync(path.join(packet.target, 'interactions.json')))
  for (const key of ['seed', 'draft', 'review']) {
    verify(choices.outputs[locale][key])
    if (locale === 'en') retain(choices.outputs[locale][key].path, 'en/choice-set/' + key + '.json')
  }
  const draft = read(choices.outputs[locale].draft.path)
  assert.equal(draft.questions.length, 5)
  assert.equal(draft.questions.filter(question => question.view.mode === 'multiple').length, 1)
}
const audit = read(path.join(modern, 'lessons', card, 'adaptation.audit.json'))
assert.equal(sha(path.join(raw, 'lessons', card, 'lesson.json')), audit.sourceLessonSha256)
assert.equal(sha(path.join(raw, 'lessons', card, 'exercises.json')), audit.sourceExercisesSha256)
const run = (name, args) => {
  const command = [path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python'), '-B', ...args]
  const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000, maxBuffer: 8 * 1024 * 1024 })
  const receipt = save(path.join(own, name + '.receipt.json'), { command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr })
  retain(path.resolve(repo, receipt.path), 'calls/' + name + '.json')
  assert.equal(result.status, 0, result.stdout + result.stderr)
}
run('raw-index', ['.claude/skills/ld-s10y-lesson/tools/p2c.py', 'reindex', '--book', '10p',
  '--toc', 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json', '--root', path.dirname(raw), '--work', path.join(own, 'index-work')])
const lesson = read(path.join(modern, 'lessons', card, 'lesson.json'))
const row = path.join(own, 'modern-row.json')
save(row, [{ id: card, number: lesson.number, title: lesson.title, prose_blocks: lesson.prose.length, exercises: 5,
  figures: 0, source_lesson_sha256: audit.sourceLessonSha256, source_exercises_sha256: audit.sourceExercisesSha256 }])
run('modern-index', ['-c', 'import sys,json; from pathlib import Path; sys.path.insert(0,".claude/skills/ld-s10y-lesson/tools"); from edition import update_book_index; update_book_index(Path(sys.argv[1]),Path(sys.argv[2]),Path(sys.argv[3]),json.loads(Path(sys.argv[4]).read_text()))',
  raw, modern, path.join(repo, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json'), row])
run('retain-choice-current', ['.claude/skills/ld-s10y-lesson/tools/retain_choices.py',
  '--repo', repo, '--book', '10p', '--lesson', card, '--source', choices.outputs.zh.current])
for (const name of ['seed.json', 'draft.json', 'review.json'])
  outputs.push(bind(path.join(modern, 'lessons', card, 'choice-set', name)))
assert.ok(!fs.existsSync(path.join(modern, 'lessons', card, 'interactions.json')))
const ready = save(path.join(durable, 'readiness.json'), {
  ticket: 'STEMROBIN-181', batch: 'D035', card, completeCard: true, status: 'complete-unbatched-local-only',
  SOURCE: 'PASS-CLOSED-COMPOSED', SCI: 'PASS-AFFECTED-COMPOSED', ZHEN: 'PASS-AFFECTED-COMPOSED',
  FIG: 'N/A-ZERO-SOURCE-FIGURES', ANSWER: 'PASS-FIVE-READONLY-BILINGUAL',
  CHOICE: 'PASS-FIVE-BILINGUAL-NATIVE-BOUND', DISPLAY: 'PASS-SIXTEEN-SURFACES',
  sourceTextReview: textBinding, answerReview: answerBinding, native: nativeBinding,
  choiceNativeBinding: choiceBinding, choiceAttestation: attestation, display, outputs,
  counts: { sourceQuestions: 5, modernFigures: 0, readonlyStandards: 5, choiceQuestions: 5, singles: 4, multiples: 1 },
  cumulativeTextContentRepairs: 2, choiceContentRepairs: 0, parentNewImageOpens: 0,
  actualReviewerImageOpens: 45, paidCalls: 0, nativePassReplays: 0, originalFailuresPreserved: true,
  legacyInteractionsProduced: false, sourceAndNativeBytesUnchanged: true,
  databaseWrites: false, publisher: false, commitPush: false, formalHandoff: false,
  limitation: capture.limitation,
})
index.reports.push({ ...ready, batch: 'D035' })
meter.currentCheckpoint.completeUnbatchedCards.push(card)
meter.currentCheckpoint.modernReadyArtifacts += 1
meter.currentCheckpoint.nextBatch.completeCards = [...meter.currentCheckpoint.completeUnbatchedCards]
meter.currentCheckpoint.nextBatch.latestReadiness.push({ card, binding: ready })
Object.assign(meter.activeHumanDirection.nextSourceCheckpoints.n91, {
  status: 'COMPLETE-OFFLINE-UNBATCHED', completeCard: true, textReview: textBinding, answerReview: answerBinding,
  native: nativeBinding, choice: choiceBinding, display, readiness: ready,
})
meter.currentCheckpoint.productionContinuation.n91 = 'COMPLETE-OFFLINE-UNBATCHED'
meter.currentCheckpoint.productionContinuation.latestReadiness = ready
meter.currentCheckpoint.readyDoesNotMeanDelivered = '105 complete offline cards pushed; n90/n91/n92 complete offline unbatched. No DB publication or formal handoff.'
meter.currentCheckpoint.indexedSourceCards['10p'] = read(path.join(raw, 'book.json')).lessons.length
index.updatedAt = meter.updatedAt = new Date().toISOString()
fs.writeFileSync(indexFile, JSON.stringify(index, null, 2) + '\n')
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n')
console.log(JSON.stringify({ readiness: ready, completeUnbatchedCards: meter.currentCheckpoint.completeUnbatchedCards }))

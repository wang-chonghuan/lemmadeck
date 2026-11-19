import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-181')
const tmp = path.join(ticket, 'tmp')
const durable = path.join(ticket, 'evidence/reports/d875-n71')
const raw = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10p')
const modern = path.join(raw, 'editions/modern-us-neutral')
const card = 'phy10-c2-s2-n71'
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'))
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')
const bind = f => ({ path: path.relative(repo, f), sha256: sha(f) })
const indexFile = path.join(ticket, 'evidence/index.json')
const meterFile = path.join(ticket, 'production-meter.json')
const index = read(indexFile)
const meter = read(meterFile)
const known = new Map(index.reports.map(b => [b.sha256, b]))
const add = f => {
  const b = known.get(sha(f)) ?? { ...bind(f), batch: 'D034' }
  if (!known.has(b.sha256)) { index.reports.push(b); known.set(b.sha256, b) }
  return b
}
function collect(root) {
  for (const item of fs.readdirSync(root, { withFileTypes: true })) {
    const f = path.join(root, item.name)
    if (item.isDirectory()) collect(f)
    else if (item.isFile()) add(f)
  }
}
assert.ok(!fs.existsSync(path.join(durable, 'readiness.json')))
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 102)
assert.equal(meter.imageCalls, 12)
assert.ok(!meter.currentCheckpoint.completeUnbatchedCards.includes(card))
for (const name of ['choice-durable-retention', 'fig-147-durable-review', 'fig-148-durable-review', 'modern-working-index', 'raw-working-reindex'])
  assert.equal(read(path.join(tmp, 'd875-n71-promotion', name + '.receipt.json')).exitCode, 0)
const native = read(path.join(tmp, 'd846-n71-native-recovery/report.json'))
const outputs = []
for (const directory of ['lessons/' + card, 'editions/modern-us-neutral/lessons/' + card]) {
  const source = path.join(native.outputs.zh.artifactRoot, '10p', directory)
  for (const name of fs.readdirSync(source)) {
    assert.equal(sha(path.join(source, name)), sha(path.join(raw, directory, name)))
    outputs.push(bind(path.join(raw, directory, name)))
  }
}
for (const id of ['fig-147', 'fig-148']) {
  for (const ext of ['spec.json', 'svg', 'render.json', 'review.json']) outputs.push(bind(path.join(modern, 'figures', id + '.' + ext)))
  const review = read(path.join(modern, 'figures', id + '.review.json'))
  assert.equal(review.status, 'pass')
  for (const entry of [review.spec, review.render, review.outputs.svg])
    assert.equal(sha(path.resolve(repo, entry.path)), entry.sha256)
}
for (const name of ['seed.json', 'draft.json', 'review.json']) {
  const file = path.join(modern, 'lessons', card, 'choice-set', name)
  assert.equal(sha(file), sha(path.join(tmp, 'd864-n71-choice-package-composition/zh/choice-set', name)))
  outputs.push(bind(file))
}
const original = path.join(tmp, 'd875-n71-promotion')
for (const name of ['promote-once.mjs', 'FIRST-finish-failure.json']) {
  const target = path.join(durable, name)
  if (fs.existsSync(target)) assert.equal(sha(target), sha(path.join(original, name)))
  else fs.copyFileSync(path.join(original, name), target, fs.constants.COPYFILE_EXCL)
}
collect(durable)
const stage = meter.activeHumanDirection.nextSourceCheckpoints.n71
const nativeBinding = known.get(sha(path.join(tmp, 'd846-n71-native-recovery/report.json')))
assert.ok(nativeBinding)
assert.equal(sha(path.resolve(repo, nativeBinding.path)), nativeBinding.sha256)
const composition = add(path.join(durable, 'choice-composition/report.json'))
const heading = add(path.join(durable, 'heading-review.json'))
const choices = read(path.join(modern, 'lessons', card, 'choice-set/draft.json'))
const counts = { originalWrittenQuestions: 3, readonlyStandards: 3, choiceResponseUnits: 4,
  choiceOptions: choices.questions.reduce((n, q) => n + q.view.options.length, 0), sharedModernFigures: 2 }
assert.equal(counts.choiceOptions, 22)
const readyFile = path.join(durable, 'readiness.json')
fs.writeFileSync(readyFile, JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D034', card, status: 'complete-unbatched-local-only',
  SOURCE: 'PASS-CLOSED-COMPOSED', SCI: 'PASS-EFFECTIVE', ZHEN: 'PASS-EFFECTIVE',
  FIG: 'PASS-CURRENT-147148', ANSWER: 'PASS-THREE-READONLY-STANDARDS',
  CHOICE: 'PASS-THREE-TASKS-FOUR-RESPONSE-UNITS', DISPLAY: 'PASS-COMPOSED-FIRST-PLUS-HEADING',
  native: nativeBinding, choiceComposition: composition, counts, outputs,
  display: { textExercises: stage.firstTextExercisesDisplay, dom: stage.firstDOMCapture,
    choicesAnswersBody: add(path.join(durable, 'FIRST-choices-answers-display/report.json')), affectedHeading: heading },
  scope: 'Bilingual offline 1440/390 text/exercises/choices/answers. Reviewed representative screenshots and sixteen DOM surfaces reused. Not live product acceptance.',
  sourceAndNativeBytesUnchanged: true, questionOptionKeyFieldsUnchanged: true,
  firstFailuresPreserved: true, finishFailure: add(path.join(durable, 'FIRST-finish-failure.json')),
  recovery: 'Only final counter corrected to question.view.options; all successful producer/retention calls reused.',
  nativeFinalizationReplays: 0, renderReplays: 0, successfulPromotionStageReplays: 0,
  parentNewImages: 0, paidCalls: 0, databaseWrites: false, commitPushPendingBatch: true,
}, null, 2) + '\n', { flag: 'wx' })
const ready = add(readyFile)
meter.currentCheckpoint.completeUnbatchedCards.push(card)
meter.currentCheckpoint.modernReadyArtifacts += 1
meter.currentCheckpoint.nextBatch.completeCards = [...meter.currentCheckpoint.completeUnbatchedCards]
meter.currentCheckpoint.nextBatch.latestReadiness ??= []
meter.currentCheckpoint.nextBatch.latestReadiness.push({ card, binding: ready })
meter.currentCheckpoint.readyDoesNotMeanDelivered = '102 complete offline cards pushed; n67 and n71 complete offline and unbatched. No DB publication or formal handoff.'
meter.currentCheckpoint.productionContinuation.n71 = 'COMPLETE-OFFLINE-UNBATCHED-PENDING-COMMIT-PUSH'
Object.assign(stage, { status: 'COMPLETE-OFFLINE-UNBATCHED-PENDING-COMMIT-PUSH',
  completeCard: true, DISPLAY: 'PASS-COMPOSED-FIRST-PLUS-HEADING', readiness: ready, choiceComposition: composition })
index.updatedAt = meter.updatedAt = new Date().toISOString()
fs.writeFileSync(indexFile, JSON.stringify(index, null, 2) + '\n')
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n')
console.log(JSON.stringify({ readiness: ready, counts, completePushed: 102,
  completeUnbatched: meter.currentCheckpoint.completeUnbatchedCards, noProducerReplays: true, commitPush: false }))

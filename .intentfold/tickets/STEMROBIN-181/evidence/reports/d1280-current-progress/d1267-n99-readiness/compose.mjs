import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-181')
const tmp = path.join(ticket, 'tmp')
const durable = path.join(ticket, 'evidence/reports/d1267-n99-readiness')
const card = 'phy10-c2-s4-n99'
const modern = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10p/editions/modern-us-neutral')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.relative(repo, file), sha256: sha(file) })
const verify = item => assert.equal(sha(path.resolve(repo, item.path)), item.sha256, item.path)
const indexFile = path.join(ticket, 'evidence/index.json')
const meterFile = path.join(ticket, 'production-meter.json')
const index = read(indexFile)
const meter = read(meterFile)
const checkpoint = meter.activeHumanDirection.nextSourceCheckpoints.n99
const known = new Map(index.reports.map(item => [item.sha256, item]))
assert.ok(!meter.currentCheckpoint.completeUnbatchedCards.includes(card))
assert.ok(checkpoint.SCI.startsWith('PASS'))
assert.ok(checkpoint.ZHEN.startsWith('PASS'))
assert.equal(checkpoint.FIG, 'PASS-DURABLE')
for (const name of ['requirements', 'firstTextReview', 'textRepair', 'fig227Review',
  'sourceErrataAuthor', 'errataRegistration']) verify(checkpoint[name])
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
  const item = { ...bind(file), batch: 'D037' }
  index.reports.push(item)
  return item
}
const retain = (file, name) => {
  const existing = known.get(sha(file))
  if (existing && fs.existsSync(path.resolve(repo, existing.path))) return existing
  const target = path.join(durable, name)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  if (fs.existsSync(target)) assert.equal(sha(target), sha(file), target)
  else fs.copyFileSync(file, target, fs.constants.COPYFILE_EXCL)
  const item = { ...bind(target), originalPath: path.relative(repo, file), batch: 'D037' }
  index.reports.push(item)
  known.set(item.sha256, item)
  return item
}
const bindings = (value, result = []) => {
  if (Array.isArray(value)) value.forEach(item => bindings(item, result))
  else if (value && typeof value === 'object') {
    if (typeof value.path === 'string' && /^[a-f0-9]{64}$/.test(value.sha256 || ''))
      result.push(value)
    Object.values(value).forEach(item => bindings(item, result))
  }
  return result
}
const nativeFile = path.join(tmp, 'd1253-n98n99-bottom-padding-repair/n99/report.json')
const captureFile = path.join(tmp, 'd1243-n98n99-first-display/n99-recovery/report.json')
const native = read(nativeFile)
const capture = read(captureFile)
assert.equal(native.status, 'FIRST-BILINGUAL-NATIVE-TEXT-FIGURES-PASS')
assert.equal(capture.status, 'FIRST-EIGHT-SURFACE-DOM-CAPTURE-PASS-VISUAL-PENDING')
verify(capture.native)
assert.equal(path.resolve(repo, capture.native.path), nativeFile)
assert.equal(capture.checks.length, 8)
assert.equal(capture.targets.length, 29)
const outputs = []
for (const [locale, packet] of Object.entries(native.outputs)) {
  assert.equal(read(path.join(packet.target, 'exercises.json')).count, 0)
  assert.equal(read(path.join(packet.target, 'figures.json')).figures.length, 1)
  for (const item of packet.nativeFiles) {
    verify(item)
    if (locale === 'zh') {
      const current = path.join(modern, 'lessons', card, path.basename(item.path))
      assert.equal(sha(current), item.sha256)
      outputs.push(bind(current))
    } else retain(item.path, 'en/native/' + path.basename(item.path))
  }
  for (const item of packet.html) {
    verify(item)
    retain(item.path, locale + '/html/' + path.basename(item.path))
  }
  assert.ok(!fs.existsSync(path.join(packet.target, 'interactions.json')))
}
const reviews = []
for (let i = 0; i < capture.reviewBatches.length; i++) {
  const directory = path.join(tmp, 'd1254-n98n99-first-display-reviews/n99/batch-' + (i + 1))
  const file = path.join(directory, i === 2 ? 'report-recovery.json' : 'report.json')
  const review = read(file)
  assert.equal(review.status, 'PASS')
  let reviewed = bindings(review)
  if (i === 2) {
    const original = review.retainedEvidence.firstReport
    verify(original)
    const originalReview = read(path.resolve(repo, original.path))
    assert.equal(originalReview.visualStatus, 'PASS')
    assert.equal(review.recovery.visualObservationsChanged, false)
    reviewed = [...reviewed, ...bindings(originalReview)]
  }
  for (const target of capture.reviewBatches[i].targets) {
    verify(target.image)
    assert.ok(reviewed.some(item => path.resolve(repo, item.path) === target.image.path &&
      item.sha256 === target.image.sha256), 'Unreviewed target: ' + target.image.path)
  }
  reviews.push(retain(file, 'display-reviews/batch-' + (i + 1) + '.json'))
  const usageFile = path.join(directory, 'usage.json')
  if (fs.existsSync(usageFile)) retain(usageFile, 'display-reviews/batch-' + (i + 1) + '-usage.json')
  if (i === 2) retain(path.join(directory, 'report.json'), 'display-reviews/batch-3-FIRST-HOLD.json')
  const batch = 'd1254-n99-batch-' + (i + 1)
  assert.ok(!meter.activeHumanDirection.ephemeralImageBatches.some(item => item.batch === batch))
  meter.activeHumanDirection.ephemeralImageBatches.push({
    id: null, batch, scope: 'N99-FIRST-DISPLAY',
    actualImages: capture.reviewBatches[i].targets.length, maximumImages: 8, contextLimit: 24,
    status: 'COMPLETED-CLOSED', imagesReturnedToParent: 0, review: reviews.at(-1),
    technicalRecoveryImages: 0,
  })
}
for (const target of capture.targets)
  retain(target.image.path, 'display-pixels/' + path.basename(target.image.path))
for (const screenshot of capture.screenshots)
  retain(screenshot.path, 'display-full/' + path.basename(screenshot.path))
const nativeBinding = retain(nativeFile, 'native/report.json')
for (const [i, call] of native.calls.entries())
  retain(path.resolve(repo, call.path), 'native/call-' + (i + 1) + '.json')
for (const field of ['diagnosis', 'originalNative', 'firstDisplayFailure']) {
  const item = native[field]
  if (item?.path) {
    verify(item)
    retain(path.resolve(repo, item.path), 'history/' + field + '.json')
  }
}
const display = save(path.join(durable, 'display-composition.json'), {
  card, status: 'PASS-EIGHT-OFFLINE-SURFACES-ALL-29-PIXELS',
  checks: capture.checks, capture: retain(captureFile, 'capture.json'), reviews,
  targets: capture.targets.map(item => item.image), native: nativeBinding,
  parentImageOpens: 0, nativePassReplays: 0, semanticReviewsReplayed: 0,
  firstFailuresPreserved: true, formalHeadedAcceptance: false, limitation: capture.limitation,
})
const ready = save(path.join(durable, 'readiness.json'), {
  ticket: 'STEMROBIN-181', batch: 'D037', card, completeCard: true,
  status: 'complete-unbatched-local-only', SOURCE: 'PASS-CLOSED-COMPOSED',
  SCI: checkpoint.SCI, ZHEN: checkpoint.ZHEN, FIG: checkpoint.FIG,
  ANSWER: 'N/A-ZERO-ORIGINAL-QUESTIONS', CHOICE: 'N/A-ZERO-ORIGINAL-QUESTIONS',
  DISPLAY: 'PASS-EIGHT-OFFLINE-SURFACES-ALL-29-PIXELS',
  textReview: checkpoint.firstTextReview, textRepair: checkpoint.textRepair,
  figureReview: checkpoint.fig227Review, native: nativeBinding, display, outputs,
  counts: { sourceQuestions: 0, modernFigures: 1, readonlyStandards: 0, choiceQuestions: 0 },
  parentImageOpens: 0, paidCalls: 0, nativePassReplays: 0, firstFailuresPreserved: true,
  legacyInteractionsProduced: false, databaseWrites: false, publisher: false,
  commitPush: false, formalHandoff: false, limitation: capture.limitation,
})
meter.currentCheckpoint.completeUnbatchedCards.push(card)
meter.currentCheckpoint.modernReadyArtifacts += 1
meter.currentCheckpoint.nextBatch.completeCards = [...meter.currentCheckpoint.completeUnbatchedCards]
meter.currentCheckpoint.nextBatch.latestReadiness.push({ card, binding: ready })
meter.currentCheckpoint.readyDoesNotMeanDelivered =
  `111 complete offline cards pushed; ${card} complete offline unbatched. No DB publication or formal handoff.`
Object.assign(checkpoint, { status: 'COMPLETE-OFFLINE-UNBATCHED', completeCard: true,
  readiness: ready, display, DISPLAY: 'PASS-EIGHT-OFFLINE-SURFACES-ALL-29-PIXELS' })
meter.currentCheckpoint.productionContinuation.n99 = 'COMPLETE-OFFLINE-UNBATCHED'
meter.countsStaleReason = 'Source pages504 and pushed complete cards111 exact; n99 complete unbatched. Other aggregates remain stale.'
index.updatedAt = meter.updatedAt = new Date().toISOString()
fs.writeFileSync(indexFile, JSON.stringify(index, null, 2) + '\n')
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n')
console.log(JSON.stringify({ ready, completeUnbatchedCards: meter.currentCheckpoint.completeUnbatchedCards }))

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const own = path.dirname(new URL(import.meta.url).pathname)
const tmp = path.dirname(own)
const ticket = path.dirname(tmp)
const durable = path.join(ticket, 'evidence/reports/d1274-n98-readiness')
const card = 'phy10-c2-s4-n98'
const modern = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10p/editions/modern-us-neutral')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.relative(repo, file), sha256: sha(file) })
const verify = item => assert.equal(sha(path.resolve(repo, item.path)), item.sha256, item.path)
const indexFile = path.join(ticket, 'evidence/index.json')
const meterFile = path.join(ticket, 'production-meter.json')
const index = read(indexFile)
const meter = read(meterFile)
const checkpoint = meter.activeHumanDirection.nextSourceCheckpoints.n98
const known = new Map(index.reports.map(item => [item.sha256, item]))
const outputs = []
assert.ok(!meter.currentCheckpoint.completeUnbatchedCards.includes(card))
assert.equal(checkpoint.SCI, 'PASS-FIRST-INDEPENDENT')
assert.equal(checkpoint.ZHEN, 'PASS-FIRST-INDEPENDENT')
assert.equal(checkpoint.FIG, 'PASS-DURABLE')
for (const field of ['requirements', 'textReview', 'answerReview', 'answerBindingRecovery'])
  verify(checkpoint[field])
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
  const item = { ...bind(file), batch: 'D037' }
  index.reports.push(item)
  return item
}
const copy = (file, target) => {
  fs.mkdirSync(path.dirname(target), { recursive: true })
  if (fs.existsSync(target)) assert.equal(sha(target), sha(file), target)
  else fs.copyFileSync(file, target, fs.constants.COPYFILE_EXCL)
  return bind(target)
}
const retain = (file, name) => {
  const existing = known.get(sha(file))
  if (existing && fs.existsSync(path.resolve(repo, existing.path))) return existing
  const item = { ...copy(file, path.join(durable, name)),
    originalPath: path.relative(repo, file), batch: 'D037' }
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
const nativeFile = path.join(tmp, 'd1253-n98n99-bottom-padding-repair/n98/report.json')
const native = read(nativeFile)
assert.equal(native.status, 'FIRST-BILINGUAL-NATIVE-TEXT-FIGURES-PASS')
const basicFile = path.join(tmp, 'd1243-n98n99-first-display/n98-recovery/report.json')
const additionalFile = path.join(tmp, 'd1261-n98-first-answer-choice-display/report.json')
const basic = read(basicFile)
const additional = read(additionalFile)
assert.equal(basic.status, 'FIRST-EIGHT-SURFACE-DOM-CAPTURE-PASS-VISUAL-PENDING')
assert.equal(additional.status, 'FIRST-EIGHT-ANSWER-CHOICE-SURFACE-DOM-PASS-VISUAL-PENDING')
for (const capture of [basic, additional]) {
  verify(capture.native)
  assert.equal(path.resolve(repo, capture.native.path), nativeFile)
  assert.equal(capture.checks.length, 8)
}
assert.equal(basic.targets.length, 20)
assert.equal(additional.targets.length, 16)
const reviews = []
const groups = [
  ...basic.reviewBatches.map((group, i) => ({ capture: basic, group,
    directory: path.join(tmp, 'd1254-n98n99-first-display-reviews/n98/batch-' + (i + 1)),
    batch: 'd1254-n98-batch-' + (i + 1), name: 'basic-' + (i + 1) })),
  ...additional.reviewBatches.map(group => ({ capture: additional, group,
    directory: path.join(tmp, 'd1272-n98-answer-choice-display-reviews', group.id),
    batch: 'd1272-n98-' + group.id, name: group.id })),
]
for (const { group, directory, batch, name } of groups) {
  const file = path.join(directory, 'report.json')
  const review = read(file)
  assert.equal(review.status, 'PASS')
  const reviewed = bindings(review)
  for (const target of group.targets) {
    verify(target.image)
    assert.ok(reviewed.some(item => path.resolve(repo, item.path) === target.image.path &&
      item.sha256 === target.image.sha256), 'Unreviewed image: ' + target.image.path)
  }
  const binding = retain(file, 'display-reviews/' + name + '.json')
  reviews.push(binding)
  const usage = path.join(directory, 'usage.json')
  if (fs.existsSync(usage)) retain(usage, 'display-reviews/' + name + '-usage.json')
  assert.ok(!meter.activeHumanDirection.ephemeralImageBatches.some(item => item.batch === batch))
  meter.activeHumanDirection.ephemeralImageBatches.push({
    id: null, batch, scope: 'N98-FIRST-DISPLAY-' + name,
    actualImages: group.targets.length, maximumImages: 8, contextLimit: 24,
    status: 'COMPLETED-CLOSED', imagesReturnedToParent: 0, review: binding,
  })
}
const choiceReviewFile = path.join(tmp, 'd1265-n98-q7-definition-affected-review/report.json')
assert.equal(read(choiceReviewFile).status, 'pass')
const choiceReview = retain(choiceReviewFile, 'choice-review/report.json')
for (const entry of fs.readdirSync(path.dirname(choiceReviewFile), { withFileTypes: true })) {
  if (entry.isFile() && /\.(json|mjs|md)$/.test(entry.name))
    retain(path.join(path.dirname(choiceReviewFile), entry.name), 'choice-review/' + entry.name)
}
for (const locale of ['zh', 'en']) {
  const packet = native.outputs[locale]
  assert.equal(read(path.join(packet.target, 'exercises.json')).count, 8)
  const answers = read(path.join(packet.target, 'answer-keys.json'))
  assert.equal(answers.status, 'ready')
  assert.equal(answers.answers.length, 8)
  assert.ok(answers.answers.every(item => item.grading === 'ungraded' && item.parts.length === 0))
  for (const item of packet.nativeFiles) {
    verify(item)
    if (locale === 'zh') {
      const file = path.join(modern, 'lessons', card, path.basename(item.path))
      assert.equal(sha(file), item.sha256)
      outputs.push(bind(file))
    } else retain(item.path, 'en/native/' + path.basename(item.path))
  }
  for (const item of packet.html) {
    verify(item)
    retain(item.path, locale + '/html/' + path.basename(item.path))
  }
  const reviewed = path.join(tmp, 'd1265-n98-q7-definition-affected-review', locale, 'review.json')
  assert.equal(read(reviewed).outcome, 'pass')
  const draft = path.join(tmp, 'd1251-n98-first-choice/author', locale, 'draft.json')
  const questions = read(draft).questions
  assert.equal(questions.length, 8)
  assert.equal(questions.reduce((sum, item) => sum + item.view.options.length, 0), 34)
  retain(draft, locale + '/choice/draft.json')
  retain(reviewed, locale + '/choice/review.json')
  assert.ok(!fs.existsSync(path.join(packet.target, 'interactions.json')))
}
const source = path.join(own, 'approved-choice')
for (const [file, name] of [
  [path.join(tmp, 'd1251-n98-first-choice/seed.json'), 'seed.json'],
  [path.join(tmp, 'd1251-n98-first-choice/author/zh/draft.json'), 'draft.json'],
  [path.join(tmp, 'd1265-n98-q7-definition-affected-review/zh/review.json'), 'review.json'],
]) copy(file, path.join(source, name))
const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
  '.claude/skills/ld-s10y-lesson/tools/retain_choices.py', '--repo', repo,
  '--book', '10p', '--lesson', card, '--source', source]
const result = spawnSync(command[0], command.slice(1), {
  cwd: repo, encoding: 'utf8', timeout: 120000, maxBuffer: 4 * 1024 * 1024,
})
const retention = save(path.join(durable, 'choice-retention.json'), {
  command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
})
assert.equal(result.status, 0, result.stdout + result.stderr)
for (const name of ['seed.json', 'draft.json', 'review.json'])
  outputs.push(bind(path.join(modern, 'lessons', card, 'choice-set', name)))
const affectedFigureFile = path.join(tmp, 'd1239-fig226-vector-glyph-affected-review/report.json')
assert.equal(read(affectedFigureFile).status, 'PASS')
const affectedFigure = retain(affectedFigureFile, 'figure-affected-review.json')
for (const capture of [basic, additional]) {
  const prefix = capture === basic ? 'basic' : 'answer-choice'
  for (const target of capture.targets)
    retain(target.image.path, prefix + '/pixels/' + path.basename(target.image.path))
  for (const screenshot of capture.screenshots)
    retain(screenshot.path, prefix + '/full/' + path.basename(screenshot.path))
  if (capture === additional)
    for (const html of capture.html) retain(html.path, prefix + '/html/' + html.locale + '-' + path.basename(html.path))
}
const nativeBinding = retain(nativeFile, 'native/report.json')
for (const [i, item] of native.calls.entries())
  retain(path.resolve(repo, item.path), 'native/call-' + (i + 1) + '.json')
for (const field of ['diagnosis', 'originalNative', 'firstDisplayFailure'])
  if (native[field]?.path) {
    verify(native[field])
    retain(path.resolve(repo, native[field].path), 'history/' + field + '.json')
  }
const display = save(path.join(durable, 'display-composition.json'), {
  card, status: 'PASS-ALL-SIXTEEN-OFFLINE-SURFACES-36-PIXELS',
  basic: retain(basicFile, 'basic/capture.json'),
  additional: retain(additionalFile, 'answer-choice/capture.json'),
  checks: [...basic.checks, ...additional.checks], reviews, native: nativeBinding,
  parentImageOpens: 0, nativePassReplays: 0, semanticReviewsReplayed: 0,
  formalHeadedAcceptance: false, limitation: additional.limitation,
})
const ready = save(path.join(durable, 'readiness.json'), {
  ticket: 'STEMROBIN-181', batch: 'D037', card, completeCard: true,
  status: 'complete-unbatched-local-only', SOURCE: 'PASS-CLOSED-COMPOSED',
  SCI: checkpoint.SCI, ZHEN: checkpoint.ZHEN, FIG: checkpoint.FIG,
  ANSWER: 'PASS-EIGHT-BILINGUAL-READONLY-STANDARDS',
  CHOICE: 'PASS-EIGHT-BILINGUAL-QUESTIONS-34-OPTIONS-5-SINGLE-3-MULTIPLE',
  DISPLAY: 'PASS-ALL-SIXTEEN-OFFLINE-SURFACES-36-PIXELS',
  textReview: checkpoint.textReview, answerReview: checkpoint.answerReview,
  answerBindingRecovery: checkpoint.answerBindingRecovery,
  figureReview: checkpoint.figureReview, affectedFigure, choiceReview, retention,
  native: nativeBinding, display, outputs,
  counts: { sourceQuestions: 8, modernFigures: 1, readonlyStandards: 8, choiceQuestions: 8, choiceOptions: 34 },
  parentImageOpens: 0, paidCalls: 0, nativePassReplays: 0, firstFailuresPreserved: true,
  legacyInteractionsProduced: false, databaseWrites: false, publisher: false,
  commitPush: false, formalHandoff: false, limitation: additional.limitation,
})
meter.currentCheckpoint.completeUnbatchedCards.push(card)
meter.currentCheckpoint.modernReadyArtifacts += 1
meter.currentCheckpoint.nextBatch.completeCards = [...meter.currentCheckpoint.completeUnbatchedCards]
meter.currentCheckpoint.nextBatch.latestReadiness.push({ card, binding: ready })
Object.assign(checkpoint, { status: 'COMPLETE-OFFLINE-UNBATCHED', completeCard: true,
  readiness: ready, display,
  choices: 'PASS-EIGHT-BILINGUAL-QUESTIONS-34-OPTIONS-5-SINGLE-3-MULTIPLE',
  DISPLAY: 'PASS-ALL-SIXTEEN-OFFLINE-SURFACES-36-PIXELS' })
meter.currentCheckpoint.productionContinuation.n98 = 'COMPLETE-OFFLINE-UNBATCHED'
meter.currentCheckpoint.readyDoesNotMeanDelivered =
  `111 complete offline cards pushed; ${meter.currentCheckpoint.completeUnbatchedCards.join(',')} complete offline unbatched. No DB or formal handoff.`
meter.countsStaleReason =
  `Source pages504 and pushed complete cards111 exact; ${meter.currentCheckpoint.completeUnbatchedCards.join(',')} complete unbatched. Other aggregates remain stale.`
index.updatedAt = meter.updatedAt = new Date().toISOString()
fs.writeFileSync(indexFile, JSON.stringify(index, null, 2) + '\n')
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n')
console.log(JSON.stringify({ ready, completeUnbatchedCards: meter.currentCheckpoint.completeUnbatchedCards }))

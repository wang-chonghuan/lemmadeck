import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-181')
const tmp = path.join(ticket, 'tmp')
const out = path.dirname(new URL(import.meta.url).pathname)
const durable = path.join(ticket, 'evidence/reports/d875-n71')
const raw = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10p')
const modern = path.join(raw, 'editions/modern-us-neutral')
const card = 'phy10-c2-s2-n71'
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'))
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')
const bind = f => ({ path: path.relative(repo, f), sha256: sha(f) })
const indexFile = path.join(ticket, 'evidence/index.json')
const meterFile = path.join(ticket, 'production-meter.json')
const index = read(indexFile)
const meter = read(meterFile)
const known = new Map(index.reports.map(b => [b.sha256, b]))
function save(f, value) {
  fs.mkdirSync(path.dirname(f), { recursive: true })
  fs.writeFileSync(f, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
  return bind(f)
}
function copy(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  if (fs.existsSync(to)) assert.equal(sha(to), sha(from), to)
  else fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  return bind(to)
}
function retain(f, name) {
  const prior = known.get(sha(f))
  if (prior && fs.existsSync(path.resolve(repo, prior.path))) {
    assert.equal(sha(path.resolve(repo, prior.path)), prior.sha256)
    return prior
  }
  const b = { ...copy(f, path.join(durable, name)), originalPath: path.relative(repo, f), batch: 'D034' }
  index.reports.push(b)
  known.set(b.sha256, b)
  return b
}
function retainTree(root, prefix) {
  for (const item of fs.readdirSync(root, { withFileTypes: true })) {
    const f = path.join(root, item.name)
    if (item.isDirectory()) retainTree(f, path.join(prefix, item.name))
    else if (item.isFile()) retain(f, path.join(prefix, item.name))
  }
}
function run(name, args) {
  const result = spawnSync(python, ['-B', ...args], { cwd: repo, encoding: 'utf8', timeout: 120000 })
  const receipt = save(path.join(out, name + '.receipt.json'), {
    command: [python, '-B', ...args], cwd: repo,
    exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  })
  retain(path.resolve(repo, receipt.path), 'calls/' + name + '.receipt.json')
  assert.equal(result.status, 0, result.stdout + result.stderr)
  return receipt
}
assert.equal(meter.imageCalls, 12)
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 102)
assert.ok(!meter.currentCheckpoint.completeUnbatchedCards.includes(card))
assert.ok(!fs.existsSync(path.join(modern, 'lessons', card)))
assert.ok(!fs.existsSync(path.join(durable, 'readiness.json')))
const nativeFile = path.join(tmp, 'd846-n71-native-recovery/report.json')
const native = read(nativeFile)
const compositionFile = path.join(tmp, 'd864-n71-choice-package-composition/report.json')
assert.equal(sha(compositionFile), '50692fdd35d8a0a67579acf83552fdda1fa266b1bdc7216070248d12ab355c8a')
assert.equal(read(compositionFile).status, 'PASS')
const headingFile = path.join(tmp, 'd868-n71-heading-affected-review/report.json')
assert.equal(sha(headingFile), '2cbde48401f1fb1a7cb07c7753a771e84fccf202c6509897da088390d42a0624')
assert.equal(read(headingFile).status, 'PASS')
const gates = meter.activeHumanDirection.nextSourceCheckpoints.n71
assert.equal(gates.SCI, 'PASS')
assert.equal(gates.ZHEN, 'PASS')
assert.equal(gates.answerSCI, 'PASS')
assert.equal(gates.answerZHEN, 'PASS')
assert.equal(gates.completeChoiceCoverage, true)
assert.equal(gates.FIG, 'PASS-CURRENT-AFFECTED-147148')
const nativeBinding = retain(nativeFile, 'native-report.json')
const composition = retain(compositionFile, 'choice-composition/report.json')
const heading = retain(headingFile, 'heading-review.json')
save(path.join(out, 'started.json'), { card, native: nativeBinding, composition, heading, initialMeter: bind(meterFile) })
const outputs = []
const zhRaw = path.join(native.outputs.zh.artifactRoot, '10p')
for (const name of ['lesson.json', 'lesson.md', 'exercises.json'])
  outputs.push(copy(path.join(zhRaw, 'lessons', card, name), path.join(raw, 'lessons', card, name)))
const audit = read(path.join(native.outputs.zh.target, 'adaptation.audit.json'))
assert.equal(audit.status, 'pass')
assert.equal(sha(path.join(raw, 'lessons', card, 'lesson.json')), audit.sourceLessonSha256)
assert.equal(sha(path.join(raw, 'lessons', card, 'exercises.json')), audit.sourceExercisesSha256)
for (const packet of Object.values(native.outputs))
  for (const status of ['adapt', 'render', 'answers', 'interactions']) assert.equal(packet[status], 'PASS')
for (const locale of ['zh', 'en']) {
  const packet = native.outputs[locale]
  const seed = read(path.join(tmp, 'd864-n71-choice-package-composition', locale, 'choice-set/seed.json'))
  for (const entry of seed.trace.slice(1))
    assert.equal(sha(path.join(packet.target, path.basename(entry.path))), entry.sha256)
  assert.equal(read(path.join(packet.target, 'exercises.json')).exercises.length, 3)
  const keys = read(path.join(packet.target, 'answer-keys.json'))
  assert.equal(keys.status, 'ready')
  assert.equal(keys.answers.length, 3)
  assert.ok(keys.answers.every(a => a.grading === 'ungraded' && a.displayAnswer && a.parts.length === 0))
  for (const name of fs.readdirSync(packet.target)) {
    const file = path.join(packet.target, name)
    assert.ok(fs.statSync(file).isFile())
    if (locale === 'zh') outputs.push(copy(file, path.join(modern, 'lessons', card, name)))
    else retain(file, 'en/native/' + name)
  }
  retainTree(path.join(tmp, 'd864-n71-choice-package-composition', locale), 'choice-composition/' + locale)
}
for (const id of ['fig-147', 'fig-148']) {
  const source = path.join(zhRaw, 'editions/modern-us-neutral/figures', id)
  const target = path.join(modern, 'figures', id)
  for (const ext of ['spec.json', 'svg']) outputs.push(copy(source + '.' + ext, target + '.' + ext))
  const render = read(source + '.render.json')
  assert.equal(render.status, 'pass')
  assert.equal(render.spec.sha256, sha(target + '.spec.json'))
  assert.equal(render.output.svg.sha256, sha(target + '.svg'))
  render.spec.path = path.relative(repo, target + '.spec.json')
  render.output.svg.path = path.relative(repo, target + '.svg')
  outputs.push(save(target + '.render.json', render))
  run(id + '-durable-review', [
    '.agents/skills/ld-s10y-image/scripts/record_review.py',
    '--spec', target + '.spec.json', '--render', target + '.render.json',
    '--output', target + '.review.json', '--status', 'pass',
    '--notes', `Inherited exact d814 independent geometry/SVG PASS and d838 affected source-text PASS. Current d850 figure-label context review reused; d853/d854 body display PASS plus d868 heading-only PASS. Only durable render metadata paths changed. Original FIRST figure/native/display failures retained; no content review, rendering or geometry replay. ${gates.latestFigureReview.path} SHA256 ${gates.latestFigureReview.sha256}; ${gates.latestAffectedTextReview.path} SHA256 ${gates.latestAffectedTextReview.sha256}.`,
  ])
  outputs.push(bind(target + '.review.json'))
}
run('raw-working-reindex', [
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'reindex', '--book', '10p',
  '--toc', 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json',
  '--root', path.dirname(raw), '--work', path.join(out, 'index-work'),
])
const lesson = read(path.join(modern, 'lessons', card, 'lesson.json'))
const rowFile = path.join(out, 'modern-row.json')
save(rowFile, [{
  id: card, number: lesson.number, title: lesson.title, prose_blocks: lesson.prose.length,
  exercises: 3, figures: 2, source_lesson_sha256: audit.sourceLessonSha256,
  source_exercises_sha256: audit.sourceExercisesSha256,
}])
run('modern-working-index', [
  '-c', 'import sys,json; from pathlib import Path; sys.path.insert(0,".claude/skills/ld-s10y-lesson/tools"); from edition import update_book_index; update_book_index(Path(sys.argv[1]),Path(sys.argv[2]),Path(sys.argv[3]),json.loads(Path(sys.argv[4]).read_text()))',
  raw, modern, path.join(repo, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json'), rowFile,
])
run('choice-durable-retention', [
  '.claude/skills/ld-s10y-lesson/tools/retain_choices.py', '--repo', repo,
  '--book', '10p', '--lesson', card,
  '--source', path.join(tmp, 'd864-n71-choice-package-composition/zh/choice-set'),
])
for (const name of ['seed.json', 'draft.json', 'review.json'])
  outputs.push(bind(path.join(modern, 'lessons', card, 'choice-set', name)))
const domFile = path.join(tmp, 'd852-n71-first-dom-capture/report.json')
for (const entry of read(domFile).html) {
  assert.equal(sha(entry.path), entry.sha256)
  const repaired = entry.locale === 'zh' && ['answers', 'choices'].includes(entry.surface)
  const file = repaired ? path.join(tmp, 'd863-n71-preview-heading-repair/zh', entry.surface + '.html') : entry.path
  retain(file, entry.locale + '/html/' + entry.surface + '.html')
}
retainTree(path.join(tmp, 'd854-n71-first-choices-answers-display-review'), 'FIRST-choices-answers-display')
retainTree(path.join(tmp, 'd863-n71-preview-heading-repair'), 'heading-repair')
retain(path.join(tmp, 'd864-n71-choice-package-composition/provenance-manifest.json'), 'choice-composition/provenance-manifest.json')
const display = {
  textExercises: gates.firstTextExercisesDisplay,
  choicesAnswersBody: retain(path.join(tmp, 'd854-n71-first-choices-answers-display-review/report.json'), 'FIRST-choices-answers-display/report.json'),
  affectedHeading: heading,
  dom: gates.firstDOMCapture,
}
const ready = save(path.join(durable, 'readiness.json'), {
  ticket: 'STEMROBIN-181', batch: 'D034', card, status: 'complete-unbatched-local-only',
  SOURCE: 'PASS-CLOSED-COMPOSED', SCI: 'PASS-EFFECTIVE', ZHEN: 'PASS-EFFECTIVE',
  FIG: 'PASS-CURRENT-147148', ANSWER: 'PASS-THREE-READONLY-STANDARDS',
  CHOICE: 'PASS-THREE-TASKS-FOUR-RESPONSE-UNITS', DISPLAY: 'PASS-COMPOSED-FIRST-PLUS-HEADING',
  native: nativeBinding, display, choiceComposition: composition, outputs,
  counts: { originalWrittenQuestions: 3, readonlyStandards: 3, choiceResponseUnits: 4,
    choiceOptions: read(path.join(modern, 'lessons', card, 'choice-set/draft.json')).questions.reduce((n, q) => n + q.options.length, 0),
    sharedModernFigures: 2 },
  scope: 'Bilingual offline 1440/390 text/exercises/choices/answers; existing reviewed representative screenshots and sixteen DOM surfaces reused. Not live product acceptance.',
  sourceAndNativeBytesUnchanged: true, questionOptionKeyFieldsUnchanged: true,
  newIndependentFullReviewClaim: false, firstFailuresPreserved: true,
  nativeFinalizationReplays: 0, rendersDuringPromotion: 0, parentNewImages: 0,
  paidCalls: 0, databaseWrites: false, commitPushPendingBatch: true,
})
index.reports.push({ ...ready, batch: 'D034' })
meter.currentCheckpoint.completeUnbatchedCards.push(card)
meter.currentCheckpoint.modernReadyArtifacts += 1
meter.currentCheckpoint.nextBatch.completeCards = [...meter.currentCheckpoint.completeUnbatchedCards]
meter.currentCheckpoint.nextBatch.latestReadiness ??= []
meter.currentCheckpoint.nextBatch.latestReadiness.push({ card, binding: ready })
meter.currentCheckpoint.readyDoesNotMeanDelivered = '102 complete offline cards pushed; n67 and n71 complete offline and unbatched. No DB publication or formal handoff.'
meter.currentCheckpoint.productionContinuation.n71 = 'COMPLETE-OFFLINE-UNBATCHED-PENDING-COMMIT-PUSH'
Object.assign(gates, { status: 'COMPLETE-OFFLINE-UNBATCHED-PENDING-COMMIT-PUSH', completeCard: true,
  DISPLAY: 'PASS-COMPOSED-FIRST-PLUS-HEADING', readiness: ready, choiceComposition: composition })
index.updatedAt = meter.updatedAt = new Date().toISOString()
fs.writeFileSync(indexFile, JSON.stringify(index, null, 2) + '\n')
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n')
console.log(JSON.stringify({ readiness: ready, completePushed: 102, completeUnbatched: meter.currentCheckpoint.completeUnbatchedCards, paidCalls: 0, commitPush: false }))

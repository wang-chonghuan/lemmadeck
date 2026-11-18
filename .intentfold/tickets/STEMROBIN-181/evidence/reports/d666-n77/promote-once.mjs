import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-181')
const recovery = path.join(ticket, 'tmp/d659-n77-output-recovery')
const packet = JSON.parse(fs.readFileSync(path.join(recovery, 'promotion-inputs.json'), 'utf8'))
const out = path.join(ticket, 'tmp/d666-n77-promotion')
const durable = path.join(ticket, 'evidence/reports/d666-n77')
const raw = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10p')
const modern = path.join(raw, 'editions/modern-us-neutral')
const card = 'phy10-c2-s2-n77'
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const text = (value) => `${JSON.stringify(value, null, 2)}\n`
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = (file) => ({ path: path.relative(repo, file), sha256: hash(file) })
const writeNew = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, value, { flag: 'wx' })
  return bind(file)
}
const verify = (row) => assert.equal(hash(path.resolve(repo, row.path)), row.sha256, row.path)
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const outputs = []
fs.mkdirSync(out, { recursive: true })
assert.equal(fs.existsSync(path.join(durable, 'readiness.json')), false)
assert.equal(fs.existsSync(path.join(modern, 'lessons', card)), false)
assert.equal(packet.status, 'RECOVERY-COMPLETE-PARENT-PROMOTION-ONLY')
for (const row of packet.source) verify(row)
for (const locale of ['zh', 'en']) {
  for (const group of ['native', 'sharedFigure', 'approvedChoicePacket', 'html']) {
    for (const row of packet.packets[locale][group]) verify(row)
  }
}
verify(packet.affectedDisplay)
assert.equal(read(path.resolve(repo, packet.affectedDisplay.path)).status, 'PASS-AFFECTED-ONLY-BOUNDED-DISPLAY')
for (const row of packet.retainedGateReports) verify(row)
const indexPath = path.join(ticket, 'evidence/index.json')
const meterPath = path.join(ticket, 'production-meter.json')
const indexBytes = fs.readFileSync(indexPath)
const meterBytes = fs.readFileSync(meterPath)
const index = JSON.parse(indexBytes)
const meter = JSON.parse(meterBytes)
const sourceIndex = read(path.join(raw, 'book.json'))
const modernIndexBefore = read(path.join(modern, 'book.json'))
const oldCounts = structuredClone(meter.activeHumanDirection.currentImageCounts)
const stage = meter.activeHumanDirection.nextSourceCheckpoints.n77
assert.equal(stage.CHOICE, 'PASS-FIRST-INDEPENDENT-ZH-EN')
assert.equal(stage.ANSWER, 'PASS-EFFECTIVE-COMPOSED-Q1Q7-ONLY-REPAIRED')
assert.ok(!meter.currentCheckpoint.completeUnbatchedCards.includes(card))
const shared = path.join(modern, 'figures/fig-179')
for (const suffix of ['.spec.json', '.svg']) {
  assert.equal(hash(`${shared}${suffix}`), hash(path.join(recovery, `zh/root/10p/editions/modern-us-neutral/figures/fig-179${suffix}`)))
}
const sharedReview = read(`${shared}.review.json`)
assert.equal(sharedReview.status, 'pass')
for (const row of [sharedReview.source, sharedReview.spec, sharedReview.render, sharedReview.outputs.svg]) verify(row)

const projection = path.join(recovery, 'choice-source/ssot-resources/soviet10year-textbooks/artifacts/10p/editions/modern-us-neutral/lessons', card)
const nativeZH = path.join(recovery, 'zh/root/10p/editions/modern-us-neutral/lessons', card)
const oldLesson = read(path.join(projection, 'lesson.json'))
const finalLesson = read(path.join(nativeZH, 'lesson.json'))
assert.equal(oldLesson.prose.length, finalLesson.prose.length)
const compact = (value) => value.replace(/\s/g, '')
const bridge = oldLesson.prose.map((block, i) => {
  const next = finalLesson.prose[i]
  const restored = { ...next, text: block.text }
  assert.deepEqual(restored, block, `Unexpected prose field change ${i}`)
  assert.equal(compact(block.text), compact(next.text), `Substantive source text changed ${i}`)
  return { block: i, onlyWhitespaceChanged: block.text !== next.text }
})
const oldExercises = read(path.join(projection, 'exercises.json'))
const finalExercises = read(path.join(nativeZH, 'exercises.json'))
assert.deepEqual(
  oldExercises.exercises.map(({ changes, ...item }) => item),
  finalExercises.exercises.map(({ changes, ...item }) => item),
)
assert.equal(read(path.join(projection, 'figures.json')).figures.length, 1)
assert.equal(read(path.join(nativeZH, 'figures.json')).figures[0].id, 'fig-179')
writeNew(path.join(out, 'started.json'), text({
  packet: bind(path.join(recovery, 'promotion-inputs.json')), bridge,
  sourceTextChanges: 'Whitespace only; exact other prose fields and written exercise bodies',
  sharedFigure: { spec: bind(`${shared}.spec.json`), svg: bind(`${shared}.svg`), review: bind(`${shared}.review.json`) },
  substantiveReviewOrBaseRenderRepeated: false,
}))
for (const row of packet.source) outputs.push(writeNew(path.join(raw, 'lessons', card, path.basename(row.path)), fs.readFileSync(row.path)))
for (const row of packet.packets.zh.native) outputs.push(writeNew(path.join(modern, 'lessons', card, path.basename(row.path)), fs.readFileSync(row.path)))
const rawLesson = read(path.join(raw, 'lessons', card, 'lesson.json'))
const rawExercises = read(path.join(raw, 'lessons', card, 'exercises.json'))
assert.ok(!sourceIndex.lessons.some((row) => row.id === card))
const sourceRow = {
  id: card, card_id: card, title: rawLesson.title, number: rawLesson.number,
  start_printed: rawLesson.start_printed,
  prose_blocks: rawLesson.prose.length, exercises: rawExercises.exercises.length,
  figures: rawLesson.figures.length,
}
sourceIndex.lessons.push(sourceRow)
sourceIndex.audit.exercise_count = sourceIndex.lessons.reduce((sum, row) => sum + row.exercises, 0)
fs.writeFileSync(path.join(raw, 'book.json'), text(sourceIndex))
const audit = read(path.join(nativeZH, 'adaptation.audit.json'))
const modernRow = {
  id: card, number: finalLesson.number, title: finalLesson.title,
  prose_blocks: finalLesson.prose.length, exercises: finalExercises.exercises.length,
  figures: read(path.join(nativeZH, 'figures.json')).figures.length,
  source_lesson_sha256: audit.sourceLessonSha256,
  source_exercises_sha256: audit.sourceExercisesSha256,
}
writeNew(path.join(out, 'modern-row.json'), text([modernRow]))
const update = spawnSync(python, [
  '-B', '-c',
  'import sys,json; from pathlib import Path; sys.path.insert(0,".claude/skills/ld-s10y-lesson/tools"); import edition; edition.update_book_index(Path(sys.argv[1]),Path(sys.argv[2]),Path(sys.argv[3]),json.loads(Path(sys.argv[4]).read_text()))',
  raw, modern, path.join(repo, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json'), path.join(out, 'modern-row.json'),
], { cwd: repo, encoding: 'utf8' })
writeNew(path.join(out, 'modern-index.receipt.json'), text({ exitCode: update.status, stdout: update.stdout, stderr: update.stderr }))
assert.equal(update.status, 0, update.stderr)
assert.deepEqual(read(path.join(modern, 'book.json')).lessons.filter((row) => row.id !== card), modernIndexBefore.lessons)

// Preserve the reviewed authoring trace; rebind only the deterministic finalization projection and hash fields.
const rebound = spawnSync(python, [
  '-B', '-c',
  [
    'import sys,json,copy',
    'from pathlib import Path',
    'sys.path.insert(0,".agents/skills/ld-s10y-choice/scripts")',
    'from prepare import prepare_seed,load_json,digest',
    'repo,oldroot,out=map(Path,sys.argv[1:])',
    'oldseed=load_json(oldroot/"zh/seed.json")',
    'seed=prepare_seed(repo,"10p","phy10-c2-s2-n77",[x["number"] for x in oldseed["exercises"]],[x["block"] for x in oldseed["concepts"]],oldseed["source"]["concept_figure_ids"])',
    'assert seed["source"]==oldseed["source"] and seed["exercises"]==oldseed["exercises"] and seed["figures"]==oldseed["figures"]',
    'assert [x["block"] for x in seed["concepts"]]==[x["block"] for x in oldseed["concepts"]]',
    'assert all("".join(a["text"].split())=="".join(b["text"].split()) for a,b in zip(seed["concepts"],oldseed["concepts"]))',
    'for locale in ("zh","en"):',
    ' draft=load_json(oldroot/locale/"draft.json"); review=load_json(oldroot/locale/"review.json")',
    ' original_draft=copy.deepcopy(draft); original_review=copy.deepcopy(review)',
    ' draft["seed_sha256"]=digest(seed); review["seed_sha256"]=digest(seed); review["draft_sha256"]=digest(draft)',
    ' check=copy.deepcopy(draft); check["seed_sha256"]=original_draft["seed_sha256"]; assert check==original_draft',
    ' check=copy.deepcopy(review); check["seed_sha256"]=original_review["seed_sha256"]; check["draft_sha256"]=original_review["draft_sha256"]; assert check==original_review',
    ' directory=out/locale; directory.mkdir(parents=True,exist_ok=True)',
    ' for name,document in (("seed.json",seed),("draft.json",draft),("review.json",review)):',
    '  with (directory/name).open("x") as f: json.dump(document,f,ensure_ascii=True,indent=2); f.write("\\n")',
    'print("PASS exact question/options/keys/review verdicts; normalized concepts and final source trace/hash rebind only")',
  ].join('\n'),
  repo, path.join(recovery, 'choices'), path.join(out, 'choice-rebound'),
], { cwd: repo, encoding: 'utf8' })
writeNew(path.join(out, 'choice-rebinding.receipt.json'), text({ exitCode: rebound.status, stdout: rebound.stdout, stderr: rebound.stderr }))
assert.equal(rebound.status, 0, rebound.stderr)
for (const locale of ['zh', 'en']) {
  const choices = path.join(out, 'choice-rebound', locale)
  const gate = spawnSync(python, [
    '-B', path.join(repo, '.agents/skills/ld-s10y-choice/scripts/validate.py'),
    '--repo', repo, '--seed', path.join(choices, 'seed.json'),
    '--draft', path.join(choices, 'draft.json'), '--review', path.join(choices, 'review.json'),
  ], { cwd: repo, encoding: 'utf8' })
  writeNew(path.join(out, `choice-${locale}-validation.receipt.json`), text({ exitCode: gate.status, stdout: gate.stdout, stderr: gate.stderr }))
  assert.equal(gate.status, 0, gate.stdout + gate.stderr)
}
const retention = spawnSync(python, [
  '-B', path.join(repo, '.claude/skills/ld-s10y-lesson/tools/retain_choices.py'),
  '--repo', repo, '--book', '10p', '--lesson', card,
  '--source', path.join(out, 'choice-rebound/zh'),
], { cwd: repo, encoding: 'utf8' })
writeNew(path.join(out, 'choice-retention.receipt.json'), text({ exitCode: retention.status, stdout: retention.stdout, stderr: retention.stderr }))
assert.equal(retention.status, 0, retention.stdout + retention.stderr)
for (const name of ['seed.json', 'draft.json', 'review.json']) outputs.push(bind(path.join(modern, 'lessons', card, 'choice-set', name)))
const retained = []
function retain(file, relative) {
  const bytes = fs.readFileSync(file)
  const existing = index.reports.find((row) => row.sha256 === hash(file))
  if (existing && fs.existsSync(path.resolve(repo, existing.path))) {
    verify(existing)
    return existing
  }
  const row = { ...writeNew(path.join(durable, relative), bytes), originalPath: path.relative(repo, file), batch: 'D033' }
  index.reports.push(row)
  retained.push(row)
  return row
}
const retainedRecovery = retain(path.join(recovery, 'promotion-inputs.json'), 'promotion-inputs.json')
const retainedDisplay = retain(path.resolve(repo, packet.affectedDisplay.path), 'display-recovery.json')
retain(path.join(recovery, 'recovery.json'), 'recovery.json')
retain(path.join(recovery, 'choices/zh/seed.json'), 'original-choice-seed.json')
for (const locale of ['zh', 'en']) {
  for (const row of packet.packets[locale].html) retain(row.path, `${locale}/html/${path.basename(row.path)}`)
  if (locale === 'en') for (const row of packet.packets.en.native) retain(row.path, `en/native/${path.basename(row.path)}`)
  for (const name of ['seed.json', 'draft.json', 'review.json']) retain(path.join(out, 'choice-rebound', locale, name), `${locale}/choice-rebound/${name}`)
}
for (const row of read(path.resolve(repo, packet.affectedDisplay.path)).screenshots) {
  if (typeof row === 'string') retain(path.resolve(repo, row), `display-images/${path.basename(row)}`)
  else if (row.path) retain(path.resolve(repo, row.path), `display-images/${path.basename(row.path)}`)
}
for (const name of fs.readdirSync(out)) {
  const file = path.join(out, name)
  if (fs.statSync(file).isFile()) retain(file, name)
}
const provenance = {
  schema: 'STEMROBIN-181/choice-finalization-rebinding@1', card,
  originalSeed: index.reports.find((row) => row.sha256 === hash(path.join(recovery, 'choices/zh/seed.json'))),
  originalChoiceReview: stage.firstChoiceReview,
  finalLesson: bind(path.join(modern, 'lessons', card, 'lesson.json')),
  finalExercises: bind(path.join(modern, 'lessons', card, 'exercises.json')),
  bridge, sourcePayloadPreservedExceptWhitespace: true,
  questionOptionsKeysIntentAndReviewVerdictsUnchanged: true,
  originalReviewIdentityDateAndFailureHistoryPreserved: true,
  changes: 'Seed concepts whitespace and source file hashes; draft seed hash; review seed/draft hashes. No new options, solutions or review verdicts.',
  sharedFigureApprovalReused: bind(`${shared}.review.json`),
}
outputs.push(writeNew(path.join(modern, 'lessons', card, 'choice-set', 'source-rebinding.json'), text(provenance)))
const readiness = {
  ticket: 'STEMROBIN-181', batch: 'D033', card, status: 'complete-unbatched-local-only',
  SOURCE: 'PASS-EFFECTIVE-COMPOSED', SCI: 'PASS', ZHEN: 'PASS', ANSWER: 'PASS', CHOICE: 'PASS', FIG: 'PASS', DISPLAY: 'PASS',
  recovery: retainedRecovery, display: retainedDisplay,
  inheritedGates: packet.inheritedGates, historicalDisplay: packet.d658Reuse,
  retainedGateReports: packet.retainedGateReports, outputs, provenance,
  counts: { sourceTasks: 8, choiceQuestions: 8, choiceOptionsPerLocale: 34, readOnlyStandardAnswersPerLocale: 8, sharedModernFigures: 1 },
  retainedEnglishEvidence: true, nativeFinalizeOrBaseRenderRepeated: false,
  independentDisplayLimit: 'Inherited full DOM plus8 representative original observations; new affected8surface DOM+8images. Not exhaustive37tile inspection.',
  originalFAILHOLDPreserved: true, paidCalls: 0, databaseWrites: false, commitPushPendingBatch: true,
}
const readinessBinding = writeNew(path.join(durable, 'readiness.json'), text(readiness))
index.reports.push({ ...readinessBinding, batch: 'D033' })
meter.currentCheckpoint.completeUnbatchedCards.push(card)
meter.currentCheckpoint.modernReadyArtifacts += 1
meter.currentCheckpoint.indexedSourceCards['10p'] = sourceIndex.lessons.length
meter.currentCheckpoint.nextBatch.completeCards = [...meter.currentCheckpoint.completeUnbatchedCards]
meter.currentCheckpoint.nextBatch.latestReadiness = readinessBinding
meter.currentCheckpoint.nextBatch.latestProgress = readinessBinding
meter.currentCheckpoint.readyDoesNotMeanDelivered = '98 pushed complete offline cards; n76/n77 complete offline unbatched, not committed or published.'
Object.assign(stage, {
  status: 'COMPLETE-OFFLINE-UNBATCHED-PENDING-COMMIT-PUSH', completeCard: true,
  readiness: readinessBinding, recovery: retainedRecovery, DISPLAY: 'PASS-EFFECTIVE-COMPOSED-RECOVERED-AND-AFFECTED',
  choiceFinalizationRebinding: bind(path.join(modern, 'lessons', card, 'choice-set', 'source-rebinding.json')),
})
assert.deepEqual(meter.activeHumanDirection.currentImageCounts, oldCounts)
meter.activeHumanDirection.ephemeralImageBatches.push({
  id: '01a1ef78-7995-7273-bd08-5b591c02d46a', batch: 'd659', scope: 'N77-output-recovery-and-affected-DISPLAY',
  actualImages: 8, maximumImages: 8, contextLimit: 24, status: 'COMPLETED-CLOSED', imagesReturnedToParent: 0,
})
assert.deepEqual(fs.readFileSync(indexPath), indexBytes)
assert.deepEqual(fs.readFileSync(meterPath), meterBytes)
index.updatedAt = meter.updatedAt = new Date().toISOString()
fs.writeFileSync(indexPath, text(index))
fs.writeFileSync(meterPath, text(meter))
console.log(JSON.stringify({ readiness: readinessBinding, completeUnbatchedCards: meter.currentCheckpoint.completeUnbatchedCards, retained: retained.length, deliveredUnchanged: 98 }))

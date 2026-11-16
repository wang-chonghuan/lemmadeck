import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const book = 'ssot-resources/soviet10year-textbooks/artifacts/10c'
const lesson = 'ana10-c6-s2-n79'
const modern = `${book}/editions/modern-us-neutral/lessons/${lesson}`
const root = `${book}/evidence/batch007-n79`
const target = `${modern}/choice-set`
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const seed = `${ticket}/ana10-n79-choice-seed.json`
const draft = `${ticket}/ana10-n79-choice-draft.json`
const review = `${ticket}/ana10-n79-choice-peirce-review.json`
assert(!fs.existsSync(root))
assert(!fs.existsSync(target))
assert.equal(hash(draft), 'aa42d3d2eca2a262439aedb271c51fb9ead4fd85215338b1f6f9cef16d3a75a6')
assert.equal(hash(review), 'e3d3160252fe6550a3822bb942c7315b7d86a1e153d4a63c20d8fc03cdd2832d')
assert.equal(hash(`${ticket}/ana10-n79-choice-peirce-review.serialization-first.json`), '6b0fc52af618a390a7986cdd8ad2f33925a3e144fe0a0ef6bb625afdb27fb46c')
const reviewDoc = read(review)
assert.equal(reviewDoc.outcome, 'pass')
assert.equal(reviewDoc.reviewer.kind, 'independent_agent')
assert.equal(reviewDoc.source_reviews.length, 6)
assert.equal(reviewDoc.question_reviews.length, 10)
assert.equal(reviewDoc.question_reviews.flatMap(item => item.mathematics.option_checks).length, 45)
for (const kind of ['lesson', 'exercises', 'figures', 'answer-keys']) {
  assert.equal(read(`${modern}/${kind}.json`).status, 'ready')
}
assert.equal(read(`${modern}/answer-keys.json`).answers.length, 6)
assert.equal(read(`${modern}/figures.json`).figures.length, 6)
const offline = `${ticket}/offline/${lesson}`
assert.equal(read(`${offline}/report.json`).status, 'pass')
assert.equal(read(`${offline}/choices-report.json`).status, 'pass')
for (const id of ['q2', 'q3', 'q7']) {
  const report = read(`${offline}/choices-${id}-report.json`)
  assert.equal(report.status, 'pass')
  assert.deepEqual(report.questionIds, [id])
  assert.equal(report.observations.length, 2)
  for (const result of report.observations) assert.equal(hash(result.screenshot), result.screenshotSha256)
}
const args = [
  '-B', '.agents/skills/ld-s10y-choice/scripts/validate.py', '--repo', '.',
  '--seed', seed, '--draft', draft, '--review', review,
]
const result = spawnSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', args, { encoding: 'utf8' })
fs.mkdirSync(root, { recursive: true })
fs.writeFileSync(`${root}/validation.stdout.txt`, result.stdout || '')
fs.writeFileSync(`${root}/validation.stderr.txt`, result.stderr || '')
fs.writeFileSync(`${root}/validation-command.json`, JSON.stringify({
  executable: '.claude/skills/ld-s10y-lesson/.venv/bin/python',
  args, exit: result.status, signal: result.signal, runCount: 1,
}, null, 2) + '\n')
assert.equal(result.status, 0, 'Current independently approved snapshot must validate')
const copied = []
const copy = (from, to) => {
  const stat = fs.statSync(from)
  if (stat.isDirectory()) {
    fs.mkdirSync(to, { recursive: true })
    for (const entry of fs.readdirSync(from)) copy(path.join(from, entry), path.join(to, entry))
    return
  }
  assert(stat.isFile())
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(from), hash(to))
  copied.push({ path: path.relative(root, to), sha256: hash(to) })
}
fs.mkdirSync(target, { recursive: true })
for (const [from, name] of [[seed, 'seed.json'], [draft, 'draft.json'], [review, 'review.json']]) {
  fs.copyFileSync(from, `${target}/${name}`, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(from), hash(`${target}/${name}`))
}
for (const name of [
  'ana10-n79-modern-author.md',
  'ana10-n79-independent-text-review.md',
  'ana10-n79-modern-marker-repair.md',
  'ana10-n79-parent-figure-source-first.md',
  'ana10-n79-figure-author-source-inventory.md',
  'ana10-n79-modern-figures-author.md',
  'ana10-n79-independent-figure-review.md',
  'ana10-n79-choice-seed.json',
  'ana10-n79-choice-draft.json',
  'ana10-n79-choice-views.json',
  'ana10-n79-choice-views-repaired.json',
  'ana10-n79-choice-source-solve.md',
  'ana10-n79-choice-author-notes.md',
  'ana10-n79-choice-targeted-repair.md',
  'ana10-n79-choice-peirce-source-first.md',
  'ana10-n79-choice-peirce-stage2.md',
  'ana10-n79-choice-peirce-stage3.md',
  'ana10-n79-choice-peirce-review-rejected.json',
  'ana10-n79-choice-peirce-affected-stage2.md',
  'ana10-n79-choice-peirce-affected-stage3.md',
  'ana10-n79-choice-peirce-review.serialization-first.json',
  'ana10-n79-choice-peirce-review.json',
  'ana10-n79-choice-display-only.json',
  'ana10-n79-choice-display-only-repaired.json',
  'render-choice-preview.mjs',
  'render-n79-choice-view.mjs',
  'render-n79-choice-affected.mjs',
  'offline-check.mjs',
  'record-promote-n79-figures.mjs',
  'retain-n79-complete.mjs',
]) copy(`${ticket}/${name}`, `${root}/${name}`)
for (const name of ['ana10-n79-choice-initial', 'ana10-n79-choice-targeted-repair-evidence', 'ana10-n79-modern-first-contract-fail', 'ana10-n79-modern-marker-repaired']) {
  copy(`${ticket}/${name}`, `${root}/${name}`)
}
copy(offline, `${root}/offline`)
copy(`.tmp/ld-s10y-lesson/render/10c/modern-us-neutral/${lesson}`, `${root}/offline-html`)
for (const id of ['fig-05', 'fig-06', 'fig-07', 'fig-08', 'tbl-p0021-01', 'fig-09']) {
  copy(`.tmp/s10y-image/batch007/10c/${id}`, `${root}/figures/${id}`)
}
fs.writeFileSync(`${root}/retention.json`, JSON.stringify({
  status: 'Complete offline n79; seventh batch1 ready lesson, not a committed batch or product publication',
  counts: { writtenExercises: 6, standardAnswers: 6, choiceQuestions: 10, choiceOptions: 45, figures: 6 },
  choiceDraftSha256: hash(draft),
  choiceReviewSha256: hash(review),
  officialChoiceValidatorExit: result.status,
  displayBasis: 'Passed original full text/written/choice desktop-mobile evidence reused. Current repaired view differs only atQ2(e)/Q3(d)/Q7(e); each affected whole question rendered once at1440/390 and all six complete screenshots actually opened. Original full choices.html and screenshots are explicitly initial-only, not a full repaired-page claim.',
  semanticBasis: 'Peirce sole initial full source/view/internal gate REVISE; one3option author repair; same reviewer affected-view-first then affected internals PASS. Remaining42 option checks/all6 source coverage reused verbatim. Parent is not a second semantic choice reviewer.',
  reviewSerializationRepair: 'Parent guard failed before the official validator. Peirce added exactly three commas, with no semantic strings changed; parent strict diff verified separators only. Invalid first snapshot retained, current review hash e3d3160252fe6550a3822bb942c7315b7d86a1e153d4a63c20d8fc03cdd2832d.',
  limitations: 'Proof and graph construction remain full ungraded written tasks. Choice recognition does not certify autonomous differentiation/proof/drawing. Offline isolated headless only, no product judging/DB/publishing/OS or print-pagination proof. All failures preserved; historical scratch paths record observations, not runtime dependencies.',
  readyUncommitted: { lessons: 1, standardAnswers: 6, choiceQuestions: 10, choiceOptions: 45 },
  cumulativePreviouslyPushed: { lessons: 19, standardAnswers: 173, choiceQuestions: 155, choiceOptions: 657 },
  copied,
}, null, 2) + '\n')
console.log((result.stdout || '') + (result.stderr || ''))
console.log(`n79 complete offline: ${copied.length} evidence files copied byte-identically; batch1 ready lesson, no commit/push`)

import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { core6g, retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const stage = process.argv[2]
assert.ok(['retain', 'display'].includes(stage))
const lesson = 'geo68-c3-s1-n32'
const own = path.join(tmp, `n32-choice-${stage}-16`)
const seedFile = path.join(tmp, 'n32-formal-choice-seed-16/seed.json')
const draftFile = path.join(tmp, 'n32-choice-authoring-from-FIRST-16/draft.json')
const source = path.join(own, 'approved-inputs')
const target = path.join(core6g, 'editions/modern-us-neutral/lessons', lesson, 'choice-set')
const refs = []
const add = file => { const item = bind(file); refs.push(item); return item }
let argv
let record
let prior
if (stage === 'retain') {
  const reviewFile = path.resolve(process.argv[3] ?? '')
  assert.ok(reviewFile.startsWith(path.join(tmp, 'n32-choice-first-independent-review-16') + path.sep))
  const review = read(reviewFile)
  assert.equal(review.outcome, 'pass')
  assert.equal(review.reviewer.kind, 'independent_agent')
  assert.equal(hash(seedFile), 'f4f84696ce28d72f64ced2fdcef4c4266ae2f9d0bbf68ab339c077335e4dd778')
  assert.equal(hash(draftFile), '27acc13b9c28b9d3788b0846f7b7000fa5d57ec137f11c5460d12474fc446c6e')
  const draft = read(draftFile)
  assert.deepEqual(draft.new_figures, [])
  assert.ok(!fs.existsSync(target))
  assert.ok(!fs.existsSync(own))
  fs.mkdirSync(source, { recursive: true })
  for (const [from, name] of [[seedFile, 'seed.json'], [draftFile, 'draft.json'], [reviewFile, 'review.json']]) {
    const to = path.join(source, name)
    fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
    assert.equal(hash(to), hash(from))
    add(from)
  }
  argv = [path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python'), '-B',
    '.claude/skills/ld-s10y-lesson/tools/retain_choices.py', '--repo', repo,
    '--book', '6-8g', '--lesson', lesson, '--source', source]
  record = { status: 'N32_APPROVED_CHOICES_RETAINED_CHOICES_DISPLAY_PENDING',
    review: bind(reviewFile), questions: draft.questions.length,
    options: draft.questions.reduce((sum, item) => sum + item.view.options.length, 0),
    allNineSourcesCovered: true, noAuthoredFigures: true,
    semanticReviewReplays: 0, toolInherentWithReviewValidation: true }
  prior = ['evidence/stemrobin188-6g-n32/choice-author-draft16/retention.json']
} else {
  const retainFile = path.join(tmp, 'n32-choice-retain-16/record.json')
  assert.equal(read(retainFile).status, 'N32_APPROVED_CHOICES_RETAINED_CHOICES_DISPLAY_PENDING')
  assert.ok(!fs.existsSync(own))
  fs.mkdirSync(own)
  add(retainFile)
  argv = ['node', path.join(tmp, 'offline-display.mjs'), '--choices-only',
    `--render-work=${path.join(tmp, 'n32-offline-render-15')}`, `6-8g:${lesson}`]
  record = { status: 'N32_FIRST_CHOICES_DESKTOP_MOBILE_MECHANICAL_PASS_VISUAL_PENDING',
    priorTextAndExerciseSurfacesPASSReused: true, firstChoicesDisplay: true,
    headless: true, offline: true, visualReviewPending: true }
  prior = ['evidence/stemrobin188-6g-n32/choice-retain16/retention.json']
}
const startedAt = new Date().toISOString()
const result = spawnSync(argv[0], argv.slice(1), {
  cwd: repo, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
})
const streams = {}
for (const stream of ['stdout', 'stderr']) {
  const file = path.join(own, `${stage}.${stream}`)
  fs.writeFileSync(file, result[stream] ?? '', { flag: 'wx' })
  streams[stream] = add(file)
}
const receiptFile = path.join(own, `${stage}.execution.json`)
save(receiptFile, { cwd: repo, argv, startedAt, endedAt: new Date().toISOString(),
  exitCode: result.status, signal: result.signal, streams })
add(receiptFile)
console.log(JSON.stringify({ stage, receipt: bind(receiptFile), exitCode: result.status,
  stdout: result.stdout, stderr: result.stderr }))
assert.equal(result.status, 0, result.stderr || result.stdout)
if (stage === 'retain') {
  record.outputs = ['seed.json', 'draft.json', 'review.json'].map(name => add(path.join(target, name)))
} else {
  const resultFile = path.join(tmp, `offline-display-6-8g_${lesson}-choices/result.json`)
  const display = read(resultFile)
  assert.equal(display.results.length, 2)
  record.result = add(resultFile)
  for (const item of display.results) {
    assert.equal(item.questionCount, 9)
    assert.equal(hash(item.screenshot), item.screenshotSha256)
    add(item.screenshot)
  }
}
record.receipt = bind(receiptFile)
record.parentImageLoads = 0
record.wholeLessonApproved = false
record.published = false
const recordFile = path.join(own, 'record.json')
save(recordFile, record)
add(recordFile)
add(path.join(tmp, 'retain-display-n32-choices-16.mjs'))
console.log(JSON.stringify(retainCurrent6g(
  `evidence/stemrobin188-6g-n32/choice-${stage}16`, refs, prior, record)))

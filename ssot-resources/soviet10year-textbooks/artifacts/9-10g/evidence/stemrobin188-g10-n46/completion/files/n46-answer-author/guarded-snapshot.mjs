import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const own = path.dirname(fileURLToPath(import.meta.url))
const expectedOwn = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n46-answer-author')
const book = '9-10g'
const lesson = 'geo910-c2-s1-n46'
const edition = 'modern-us-neutral'
const core = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts', book)
const artifacts = path.join(own, 'artifacts')
const work = path.join(own, 'work')
const sourceModern = path.join(core, 'editions', edition, 'lessons', lesson)
const ownModern = path.join(artifacts, book, 'editions', edition, 'lessons', lesson)
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const record = file => {
  const bytes = fs.readFileSync(file)
  return { path: file, sha256: sha(bytes), bytes: bytes.length }
}
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'))

assert.equal(process.cwd(), repo, 'Every execution must use the authorized cwd')
assert.equal(own, expectedOwn)
assert.equal(fs.realpathSync(own), expectedOwn, 'Owned root must not be a symlink')

function guarded(file) {
  assert.ok(file.startsWith(`${own}${path.sep}`), `Write outside owned root: ${file}`)
  let parent = path.dirname(file)
  while (!fs.existsSync(parent)) parent = path.dirname(parent)
  assert.ok(fs.realpathSync(parent) === own || fs.realpathSync(parent).startsWith(`${own}${path.sep}`))
}

function newJson(file, value) {
  guarded(file)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}

function copyNew(source, target) {
  guarded(target)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL)
  assert.equal(record(source).sha256, record(target).sha256)
  fs.chmodSync(target, 0o444)
}

const inputs = [
  ...['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json'].map(name => ({
    role: `current-modern-${name}`,
    source: path.join(sourceModern, name),
    snapshot: path.join(ownModern, name),
  })),
  { role: 'raw-numbering-book', source: path.join(core, 'book.json'), snapshot: path.join(artifacts, book, 'book.json') },
  ...['lesson.json', 'exercises.json'].map(name => ({
    role: `raw-source-identity-only-${name}`,
    source: path.join(core, 'lessons', lesson, name),
    snapshot: path.join(artifacts, book, 'lessons', lesson, name),
  })),
]
const toolPaths = [
  path.join(repo, '.claude/skills/ld-s10y-answer/tools/lesson_answers.py'),
  path.join(repo, '.claude/skills/ld-s10y-lesson/tools/assemble.py'),
  path.join(repo, 'app/src/lib/textbook-answer.ts'),
  path.join(repo, 'app/src/lib/answer-normalize.ts'),
  path.join(repo, '.claude/skills/ld-s10y-answer/tools/check_math_expressions.mjs'),
  path.join(repo, '.claude/skills/ld-s10y-answer/SKILL.md'),
  path.join(repo, '.claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md'),
  path.join(repo, '.claude/skills/ld-s10y-lesson/references/production-resume.md'),
  path.join(repo, '.intentfold/readme.md'),
  path.join(repo, '.intentfold/charter/engineering.md'),
  path.join(repo, '.intentfold/charter/operations.md'),
]

function inputState() {
  const answerPath = path.join(core, 'answers.json')
  return {
    schema: 'n46-answer-author/inputbindings@1',
    time: new Date().toISOString(),
    cwd: repo,
    ownedRoot: own,
    book,
    edition,
    lesson,
    files: inputs.map(input => ({ role: input.role, source: record(input.source), snapshotPath: input.snapshot })),
    toolingAndInstructions: toolPaths.map(record),
    capturedRawAnswers: fs.existsSync(answerPath)
      ? { exists: true, source: record(answerPath) }
      : { exists: false, path: answerPath },
    rawCoreLabelResolution: {
      requestedLabel: 'core9-10g',
      literalRepoPathExists: fs.existsSync(path.join(repo, 'core9-10g')),
      literalArtifactsPathExists: fs.existsSync(path.join(path.dirname(core), 'core9-10g')),
      resolvedSourceBookPath: core,
      authority: 'Current edition source.path, source.sha256 and adaptation audit bind the raw files below this book root.',
    },
  }
}

function unchanged(before, after) {
  assert.deepEqual(after.files, before.files, 'Bound N46 input changed')
  assert.deepEqual(after.toolingAndInstructions, before.toolingAndInstructions, 'Bound tooling/instruction changed')
  assert.deepEqual(after.capturedRawAnswers, before.capturedRawAnswers, 'Raw answers changed')
  assert.deepEqual(after.rawCoreLabelResolution, before.rawCoreLabelResolution)
  for (const input of inputs) assert.equal(record(input.snapshot).sha256, record(input.source).sha256)
}

function capture() {
  assert.ok(!fs.existsSync(artifacts), 'Refuse existing artifact tree')
  const before = inputState()
  newJson(path.join(own, 'inputbindings.before.json'), before)
  for (const input of inputs) copyNew(input.source, input.snapshot)
  const modernLesson = json(path.join(ownModern, 'lesson.json'))
  const exercises = json(path.join(ownModern, 'exercises.json'))
  const figures = json(path.join(ownModern, 'figures.json'))
  const audit = json(path.join(ownModern, 'adaptation.audit.json'))
  const numbering = json(path.join(artifacts, book, 'book.json'))
  assert.equal(numbering.book, book)
  assert.equal(numbering.exercise_numbering, 'book')
  assert.equal(modernLesson.id, lesson)
  for (const doc of [modernLesson, exercises, figures]) {
    assert.equal(doc.edition, edition)
    assert.equal(doc.status, 'ready')
  }
  assert.equal(audit.status, 'pass')
  assert.deepEqual(exercises.exercises.map(item => item.number), ['34', '35', '36', '37', '38', '39'])
  assert.equal(exercises.count, 6)
  for (const item of exercises.exercises) {
    assert.deepEqual(item.figure_refs, [])
    assert.deepEqual(item.figures, [])
  }
  const rawIdentity = []
  for (const [name, auditField] of [['lesson.json', 'sourceLessonSha256'], ['exercises.json', 'sourceExercisesSha256']]) {
    const modern = json(path.join(ownModern, name))
    const rawPath = path.join(artifacts, book, 'lessons', lesson, name)
    const rawHash = record(rawPath).sha256
    assert.equal(modern.source.path, `lessons/${lesson}/${name}`)
    assert.equal(modern.source.sha256, rawHash)
    assert.equal(audit[auditField], rawHash)
    rawIdentity.push({ file: record(rawPath), currentSourceSha256: modern.source.sha256, auditSha256: audit[auditField] })
  }
  // Read only identity fields from raw exercises; no raw prose drives solving.
  const rawExercises = json(path.join(artifacts, book, 'lessons', lesson, 'exercises.json'))
  const identity = item => Object.fromEntries(['number', 'source_number', 'group_id', 'group', 'figure_refs', 'figures']
    .filter(key => Object.hasOwn(item, key)).map(key => [key, item[key]]))
  assert.deepEqual(rawExercises.exercises.map(identity), exercises.exercises.map(identity))
  let captured = []
  if (before.capturedRawAnswers.exists) {
    const document = json(before.capturedRawAnswers.source.path)
    assert.equal(document.schema, 'ld-s10y-answer/book@1')
    assert.equal(document.status, 'captured', 'Only captured raw book answers may be used')
    assert.equal(document.book, book)
    captured = document.answers.filter(item => ['34', '35', '36', '37', '38', '39'].includes(String(item.exercise)))
    assert.equal(new Set(captured.map(item => String(item.exercise))).size, captured.length)
    const projection = { ...document, answers: captured }
    newJson(path.join(artifacts, book, 'answers.json'), projection)
    fs.chmodSync(path.join(artifacts, book, 'answers.json'), 0o444)
  }
  const after = inputState()
  unchanged(before, after)
  newJson(path.join(own, 'inputbindings.after-snapshot.json'), after)
  newJson(path.join(own, 'snapshot.receipt.json'), {
    status: 'captured-current-inputs-not-semantic-approval',
    cwd: repo,
    before: record(path.join(own, 'inputbindings.before.json')),
    after: record(path.join(own, 'inputbindings.after-snapshot.json')),
    copied: inputs.map(input => ({ role: input.role, source: record(input.source), snapshot: record(input.snapshot) })),
    rawIdentity,
    capturedRawAnswerCount: captured.length,
    capturedRawAnswerExercises: captured.map(item => String(item.exercise)),
    imageRefsInExercises: 0,
    imagesCopied: 0,
    imagesViewed: 0,
    imagesFabricated: 0,
    proseFigureMetadataCount: modernLesson.figures.length,
    rawReadingScope: 'Raw book numbering and raw lesson/exercise source identity only; captured raw answers projected to six exercise numbers if present.',
  })
  console.log(JSON.stringify({ status: 'snapshot-complete', ownedRoot: own, copiedFiles: inputs.length, capturedRawAnswers: captured.length, images: 0 }))
}

function prepare() {
  const receiptPath = path.join(own, 'prepare.receipt.json')
  assert.ok(!fs.existsSync(receiptPath), 'Native prepare may run only once')
  assert.ok(!fs.existsSync(work), 'Refuse existing prepare work')
  unchanged(json(path.join(own, 'inputbindings.before.json')), inputState())
  newJson(path.join(own, 'prepare.once.json'), { time: new Date().toISOString(), attemptsAuthorized: 1 })
  const command = ['python3', path.join(repo, '.claude/skills/ld-s10y-answer/tools/lesson_answers.py'),
    'prepare', '--book', book, '--edition', edition, '--lesson', lesson, '--root', artifacts, '--work', work]
  const result = spawnSync(command[0], command.slice(1), {
    cwd: repo,
    encoding: 'utf8',
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  for (const [name, text] of [['prepare.stdout.txt', result.stdout], ['prepare.stderr.txt', result.stderr]]) {
    const target = path.join(own, name)
    guarded(target)
    fs.writeFileSync(target, text ?? '', { flag: 'wx' })
  }
  const template = path.join(work, book, edition, 'lessons', lesson, 'answer-keys.template.json')
  const receipt = {
    schema: 'n46-answer-author/prepare-receipt@1',
    time: new Date().toISOString(),
    command,
    cwd: repo,
    attempts: 1,
    exitCode: result.status,
    signal: result.signal,
    error: result.error?.message ?? null,
    stdout: record(path.join(own, 'prepare.stdout.txt')),
    stderr: record(path.join(own, 'prepare.stderr.txt')),
    tool: record(command[1]),
    template: fs.existsSync(template) ? record(template) : null,
    prepareOnly: true,
    finalizeRun: false,
    mathliveRun: false,
    publishRun: false,
    semanticApproval: false,
  }
  newJson(receiptPath, receipt)
  assert.equal(result.status, 0, 'Native prepare failed; preserve receipt and stop dependent work')
  const document = json(template)
  assert.equal(document.status, 'draft')
  assert.deepEqual(document.answers.map(item => item.exercise), ['34', '35', '36', '37', '38', '39'])
  assert.ok(document.answers.every(item => item.figureEvidence.length === 0))
  const after = inputState()
  unchanged(json(path.join(own, 'inputbindings.before.json')), after)
  newJson(path.join(own, 'inputbindings.after-prepare.json'), after)
  console.log(JSON.stringify({ status: 'prepare-complete', receipt: record(receiptPath), template: record(template), exercises: 6, imageEvidence: 0 }))
}

function verify() {
  const before = json(path.join(own, 'inputbindings.before.json'))
  const after = inputState()
  unchanged(before, after)
  newJson(path.join(own, 'inputbindings.after.json'), after)
  console.log(JSON.stringify({ status: 'inputs-unchanged', after: record(path.join(own, 'inputbindings.after.json')), images: 0 }))
}

const actions = { capture, prepare, verify }
assert.ok(Object.hasOwn(actions, process.argv[2]), 'Use capture, prepare or verify')
actions[process.argv[2]]()

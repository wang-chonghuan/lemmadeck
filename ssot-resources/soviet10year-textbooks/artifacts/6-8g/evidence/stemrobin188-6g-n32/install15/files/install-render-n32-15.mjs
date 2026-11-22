import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { core6g, retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const lesson = 'geo68-c3-s1-n32'
const working = path.join(tmp, 'n32-finalize-working-inputs-15')
const book = path.join(working, 'artifacts/6-8g')
const modern = path.join(book, 'editions/modern-us-neutral/lessons', lesson)
const work = path.join(tmp, 'n32-offline-render-15')
const stage = process.argv[2]
assert.equal(process.cwd(), repo)
assert.ok(['install', 'render', 'surfaces'].includes(stage))
const own = path.join(tmp, `n32-${stage}-15`)
assert.ok(!fs.existsSync(own), 'Preserve completed stages without replay.')
fs.mkdirSync(own)
const references = []
const remember = file => {
  const item = bind(file)
  references.push(item)
  return item
}
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const run = (name, argv) => {
  const startedAt = new Date().toISOString()
  const result = spawnSync(argv[0], argv.slice(1), {
    cwd: repo, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  const streams = {}
  for (const kind of ['stdout', 'stderr']) {
    const file = path.join(own, `${name}.${kind}`)
    fs.writeFileSync(file, result[kind] ?? '', { flag: 'wx' })
    streams[kind] = remember(file)
  }
  const receiptFile = path.join(own, `${name}.execution.json`)
  save(receiptFile, { cwd: repo, argv, startedAt, endedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message ?? null, streams })
  remember(receiptFile)
  console.log(JSON.stringify({ name, exitCode: result.status,
    stdout: result.stdout, stderr: result.stderr, receipt: bind(receiptFile) }))
  assert.equal(result.status, 0, result.stderr || result.stdout)
  return bind(receiptFile)
}
let record
let prior
if (stage === 'install') {
  const native = []
  for (const name of ['modern', 'answers', 'interactions-prepare', 'interactions-finalize']) {
    const receiptStage = name === 'modern' ? 'modern-recovery1' : name
    const file = path.join(working, 'native', receiptStage, 'execution.json')
    const receipt = read(file)
    assert.equal(receipt.cwd, repo)
    assert.equal(receipt.exitCode, 0)
    remember(file)
    for (const item of Object.values(receipt.streams)) {
      assert.equal(hash(item.path), item.sha256)
      references.push(item)
    }
    native.push({ name, receipt: bind(file) })
  }
  for (const name of ['adaptation.audit.json', 'answer-keys.audit.json'])
    assert.equal(read(path.join(modern, name)).status, 'pass')
  const interactions = read(path.join(modern, 'interactions.json'))
  assert.equal(interactions.interactions.length, 9)
  assert.ok(interactions.interactions.every(item => !item.needsAuthoring))
  const installed = []
  for (const [from, to, names] of [
    [path.join(book, 'lessons', lesson), path.join(core6g, 'lessons', lesson),
      ['lesson.json', 'lesson.md', 'exercises.json']],
    [modern, path.join(core6g, 'editions/modern-us-neutral/lessons', lesson),
      ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json',
        'answer-keys.json', 'answer-keys.audit.json', 'interactions.json']],
  ]) {
    for (const name of names) assert.ok(!fs.existsSync(path.join(to, name)))
    fs.mkdirSync(to, { recursive: true })
    for (const name of names) {
      const source = path.join(from, name)
      const output = path.join(to, name)
      fs.copyFileSync(source, output, fs.constants.COPYFILE_EXCL)
      assert.equal(hash(output), hash(source))
      installed.push({ source: bind(source), output: remember(output) })
    }
  }
  const beforeIndexes = []
  for (const [name, file] of [
    ['source-index.before.json', path.join(core6g, 'book.json')],
    ['edition-index.before.json', path.join(core6g, 'editions/modern-us-neutral/book.json')],
  ]) {
    const snapshot = path.join(own, name)
    fs.copyFileSync(file, snapshot, fs.constants.COPYFILE_EXCL)
    assert.equal(hash(snapshot), hash(file))
    fs.chmodSync(snapshot, 0o444)
    beforeIndexes.push({ path: file, snapshot: remember(snapshot) })
  }
  const sourceIndex = run('source-reindex', [python, '-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'reindex', '--book', '6-8g',
    '--root', path.dirname(core6g), '--toc', 'ssot-resources/soviet10year-textbooks/toc/6-8g/zh.json'])
  const editionIndex = run('edition-index', [python, '-B', '-c',
    'import json,sys; from pathlib import Path; sys.path.insert(0,".claude/skills/ld-s10y-lesson/tools"); import edition; book=Path(sys.argv[1]); rows=json.loads(Path(sys.argv[2]).read_text())["lessons"]; assert [r["id"] for r in rows]==["geo68-c3-s1-n32"]; edition.update_book_index(book,book/"editions/modern-us-neutral",Path(".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json"),rows)',
    core6g, path.join(book, 'editions/modern-us-neutral/book.json')])
  for (const name of ['staging.json', 'ready.json']) remember(path.join(working, name))
  remember(path.join(tmp, 'run-n32-scoped-native-15.mjs'))
  record = {
    status: 'N32_FIRST_NATIVE_OUTPUTS_INSTALLED_CHOICES_DISPLAY_PENDING',
    installed, native, beforeIndexes, sourceIndex, editionIndex,
    sourceIndexesOnlyReconciledNotReassembled: true,
    counts: { prose: read(path.join(modern, 'lesson.json')).prose.length,
      exercises: 9, figures: 5, answers: 9, interactions: 9 },
    answerGrading: read(path.join(modern, 'answer-keys.json')).answers.map(item =>
      ({ exercise: item.exercise, grading: item.grading, parts: item.parts?.length ?? 0 })),
    pendingInteractionAuthoring: [], choicesPending: true, displayPending: true,
    sourceGlyphIdentityHoldsPreserved: true,
  }
  prior = [
    'evidence/stemrobin188-6g-n32/assembly-and-prepare-first10/retention.json',
    'evidence/stemrobin188-6g-n32/approved204-assets15/retention.json',
    'evidence/stemrobin188-6g-n32/approved206-assets16/retention.json',
    'evidence/stemrobin188-6g-n32/205208-review-recording14/retention.json',
    'evidence/stemrobin188-6g-n32/205208-finite-independent-review14/retention.json',
  ]
} else {
  const installRecord = path.join(tmp, 'n32-install-15/record.json')
  assert.equal(read(installRecord).status, 'N32_FIRST_NATIVE_OUTPUTS_INSTALLED_CHOICES_DISPLAY_PENDING')
  remember(installRecord)
  let receipt
  if (stage === 'render') {
    receipt = run('first-offline-render', [python, '-B',
      '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'render', '--book', '6-8g',
      '--edition', 'modern-us-neutral', '--lesson', lesson,
      '--root', path.dirname(core6g), '--work', work])
    record = { status: 'N32_FIRST_OFFLINE_TEXT_EXERCISES_HTML_RENDER_PASS_DISPLAY_PENDING',
      renderWork: work, receipt, figuresNotRerendered: true }
  } else {
    assert.equal(read(path.join(tmp, 'n32-render-15/first-offline-render.execution.json')).exitCode, 0)
    receipt = run('first-surfaces', ['node', path.join(tmp, 'offline-display.mjs'),
      '--surfaces-only', `--render-work=${work}`, `6-8g:${lesson}`])
    const resultFile = path.join(tmp, `offline-display-6-8g_${lesson}-surfaces/result.json`)
    const result = read(resultFile)
    assert.equal(result.results.length, 4)
    remember(resultFile)
    for (const item of result.results) {
      assert.equal(hash(item.screenshot), item.screenshotSha256)
      remember(item.screenshot)
    }
    record = { status: 'N32_FIRST_FOUR_OFFLINE_SURFACES_MECHANICAL_PASS_VISUAL_PENDING',
      receipt, result: bind(resultFile), headless: true, offline: true,
      visualReviewPending: true, currentChoicesNotApproved: true }
  }
  prior = [`evidence/stemrobin188-6g-n32/${stage === 'render' ? 'install' : 'render'}15/retention.json`]
}
record = { ...record, parentImageLoads: 0, sourceAssemblyPrepareFigureReplays: 0,
  wholeLessonApproved: false, published: false }
const recordFile = path.join(own, 'record.json')
save(recordFile, record)
remember(recordFile)
remember(path.join(tmp, 'install-render-n32-15.mjs'))
console.log(JSON.stringify(retainCurrent6g(
  `evidence/stemrobin188-6g-n32/${stage}15`, references, prior, record)))

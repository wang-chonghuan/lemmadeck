import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, core, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const lesson = 'geo910-c2-s3-n62'
const isolated = path.join(tmp, 'g10-n62/artifacts/9-10g')
const target = path.join(core, 'editions/modern-us-neutral/lessons', lesson)
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const stage = process.argv[2]
assert.ok(['adopt', 'answer-prepare', 'answer-admit', 'answer-finalize', 'interaction-prepare',
  'interaction-finalize'].includes(stage))
const recovery = process.argv[3] === '--technical-recovery-02'
assert.ok(!recovery || stage === 'interaction-prepare')
if (recovery) {
  const failure = read(path.join(tmp, 'n62-completion-interaction-prepare-01',
    'interaction-prepare.command.json'))
  assert.equal(failure.exitCode, 2)
  assert.ok(failure.stderr.includes('unrecognized arguments: --work'))
}
const receiptRoot = path.join(tmp, `n62-completion-${stage}-${recovery ? '02' : '01'}`)
assert.ok(!fs.existsSync(receiptRoot), receiptRoot)
fs.mkdirSync(receiptRoot)
function run(name, args) {
  const result = spawnSync(python, ['-B', ...args], { cwd: repo, encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024 })
  save(path.join(receiptRoot, `${name}.command.json`), {
    command: python, args: ['-B', ...args], cwd: repo, exitCode: result.status,
    stdout: result.stdout, stderr: result.stderr, error: result.error?.message,
  })
  assert.equal(result.status, 0, `${name}: ${result.stderr || result.stdout}`)
  return result.stdout
}
if (stage === 'adopt') {
  assert.equal(read(path.join(tmp, 'n62-modern-adapt-finalize-01/result.json')).status, 'pass')
  assert.equal(read(path.join(tmp, 'n62-modern-render-01/result.json')).status, 'pass')
  const source = read(path.join(tmp, 'n62-source-admission-01.json'))
  source.bindings.forEach(b => assert.equal(hash(b.path), b.sha256, b.path))
  const modern = read(path.join(tmp, 'n62-modern-text-admission-01.json'))
  assert.equal(hash(modern.review.path), modern.review.sha256)
  const bindings = []
  const copy = (from, to) => {
    fs.mkdirSync(path.dirname(to), { recursive: true })
    if (fs.existsSync(to)) assert.equal(hash(to), hash(from), to)
    else fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
    bindings.push({ original: bind(from), retained: bind(to) })
  }
  for (const file of ['lesson.json', 'lesson.md', 'exercises.json'])
    copy(path.join(isolated, 'lessons', lesson, file), path.join(core, 'lessons', lesson, file))
  for (const page of [222, 223, 224])
    for (const file of ['page.md', 'page.json', 'audit.json'])
      copy(path.join(isolated, 'pages', String(page).padStart(4, '0'), file),
        path.join(core, 'pages', String(page).padStart(4, '0'), file))
  for (const number of [89, 90, 91])
    for (const extension of ['png', 'svg'])
      copy(path.join(isolated, 'figures', `fig-g10-${number}.${extension}`),
        path.join(core, 'figures', `fig-g10-${number}.${extension}`))
  for (const file of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json'])
    copy(path.join(isolated, 'editions/modern-us-neutral/lessons', lesson, file),
      path.join(target, file))
  copy(path.join(core, 'book.json'), path.join(receiptRoot, 'source-book.before.json'))
  copy(path.join(core, 'editions/modern-us-neutral/book.json'),
    path.join(receiptRoot, 'edition-book.before.json'))
  run('source-reindex', ['.claude/skills/ld-s10y-lesson/tools/p2c.py', 'reindex',
    '--book', '9-10g', '--toc', 'ssot-resources/soviet10year-textbooks/toc/9-10g/zh.json'])
  run('edition-index-only', ['-c',
    'import json,sys; from pathlib import Path; sys.path.insert(0,sys.argv[1]); import edition; b=Path(sys.argv[2]); rows=json.loads(Path(sys.argv[3]).read_text())["lessons"]; assert len(rows)==1 and rows[0]["id"]=="geo910-c2-s3-n62"; edition.update_book_index(b,b/"editions/modern-us-neutral",Path(sys.argv[4]),rows)',
    path.join(repo, '.claude/skills/ld-s10y-lesson/tools'), core,
    path.join(isolated, 'editions/modern-us-neutral/book.json'),
    path.join(repo, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json')])
  save(path.join(receiptRoot, 'result.json'), {
    status: 'existing-N62-native-and-reviewed-bytes-retained-completion-pending',
    bindings, prose: 13, exercises: 7, figures: 3,
    producerRuns: 0, indexOnlyRuns: 2, sourceHolds: source.localHolds,
    sourceFutureHeadingNotApproved: 'p0224#4 excluded from N62',
    answersApproved: false, choicesApproved: false, wholeLessonApproved: false,
  })
} else if (stage === 'answer-admit') {
  const reviewPath = path.join(tmp, 'n62-answer-review-01/report.json')
  const review = read(reviewPath)
  assert.equal(review.result, 'PASS')
  assert.deepEqual(review.findings, [])
  assert.deepEqual(review.perExercise.map(item => item.exercise),
    ['216', '217', '218', '219', '220', '221', '222'])
  assert.ok(review.perExercise.every(item => item.result === 'PASS'))
  review.inputBindings.forEach(item => assert.equal(hash(item.path), item.sha256After))
  const candidate = path.join(tmp, 'n62-answer-author/answer-keys.candidate.json')
  assert.ok(!fs.existsSync(path.join(target, 'answer-keys.json')))
  fs.copyFileSync(candidate, path.join(target, 'answer-keys.json'),
    fs.constants.COPYFILE_EXCL)
  fs.chmodSync(path.join(target, 'answer-keys.json'), 0o644)
  assert.equal(hash(candidate), hash(path.join(target, 'answer-keys.json')))
  save(path.join(receiptRoot, 'result.json'), {
    status: 'pass-for-answer-candidate-only',
    candidate: bind(candidate), review: bind(reviewPath),
    nativeFinalizationPending: true, published: false, wholeLessonApproved: false,
  })
} else {
  const answer = stage.startsWith('answer')
  const tool = answer ? 'lesson_answers.py' : 'lesson_interactions.py'
  const action = stage.endsWith('prepare') ? 'prepare' : 'finalize'
  const file = path.join(target, answer ? 'answer-keys.json' : 'interactions.json')
  if (action === 'prepare') {
    assert.ok(!fs.existsSync(file), file)
    if (answer)
      assert.ok(!fs.existsSync(path.join(tmp,
        'n62-answer-author/work/9-10g/modern-us-neutral/lessons', lesson,
        'answer-keys.template.json')))
  }
  const args = [`.claude/skills/ld-s10y-answer/tools/${tool}`, action,
    '--book', '9-10g', '--edition', 'modern-us-neutral', '--lesson', lesson,
    '--root', path.dirname(core)]
  if (answer) args.push('--work', path.join(tmp, 'n62-answer-author/work'))
  run(stage, args)
  save(path.join(receiptRoot, 'result.json'), {
    status: 'pass', stage, outputs: action === 'finalize' ? [bind(file)] : [],
    published: false, wholeLessonApproved: false,
  })
}
console.log(JSON.stringify({ stage, receiptRoot, published: false }))

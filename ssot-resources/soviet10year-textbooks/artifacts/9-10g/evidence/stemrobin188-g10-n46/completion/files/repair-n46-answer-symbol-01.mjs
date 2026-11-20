import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp')
const lesson = 'geo910-c2-s1-n46'
const core = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g')
const target = path.join(core, 'editions/modern-us-neutral/lessons', lesson)
const work = path.join(tmp, 'g10-n46/work')
const templates = path.join(work, 'adapt/9-10g/modern-us-neutral/lessons', lesson)
const output = path.join(tmp, 'n46-answer-symbol-repair-01')
const reviewRoot = path.join(tmp, 'n46-answer-choice-display-source-review-01')
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file) })
const save = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(from), hash(to))
}
const action = process.argv[2]
if (action === 'repair') {
  assert.ok(!fs.existsSync(output))
  assert.equal(json(path.join(reviewRoot, 'convention-review.json')).outcome, 'pass')
  assert.equal(json(path.join(reviewRoot, 'answer-review.json')).outcome, 'revise')
  assert.equal(json(path.join(reviewRoot, 'answer-review.json')).mathematical_outcome, 'pass')
  assert.equal(json(path.join(reviewRoot, 'visual-review.json')).outcome, 'revise')
  assert.equal(json(path.join(reviewRoot, 'review.json')).outcome, 'pass')
  fs.mkdirSync(output)
  const candidatePath = path.join(tmp, 'n46-answer-author/answer-keys.json')
  assert.equal(hash(candidatePath), '5a753f2d5beecb0f3ba83abd009fea37bd7573f44d2b31468d3c2c5c0fc0bb84')
  copy(candidatePath, path.join(output, 'before/answer-keys.json'))
  const candidate = json(candidatePath)
  const answer = candidate.answers.find(item => item.exercise === '36')
  const oldIntroduction = '1）题面写作“对称 $z_0$”，但当前课文没有明确给出这个符号的定义。若此处表示第 35 题第 1 小题中以 $O(0,0,0)$ 为中心的中心对称，则'
  const newIntroduction = '1）题面保留记号“对称 $z_0$”。根据“利用上题的结果”、第 35 题第 1 项以及本册 §14 中以 $O$ 为中心的中心对称定义，这里指以 $O(0,0,0)$ 为中心的中心对称。因此'
  assert.ok(answer.displayAnswer.includes(oldIntroduction))
  answer.displayAnswer = answer.displayAnswer.replace(oldIntroduction, newIntroduction)
    .replace('因此在这一解释下，像平面的方程为', '因此，像平面的方程为')
    .replace('\n这一小题的符号含义仍需澄清；以上是明确以原点中心对称为条件的答案，不是对未定义符号的无条件认定。', '')
  answer.notes = 'N46-36-1-SYMBOL 的中心角色已由独立 scoped convention-review 明确：本册 §14 定义以 O 为中心的中心对称，第35题第1项指定 O(0,0,0)，第36题明确利用上题三项结果。原题小写 z_0 不改；历史下标 O/0 精确字形 UNKNOWN 保留，不冒称旧整页来源通过。第2、3项及全部数学公式未变。平面方程仍允许任意非零整式倍数及等价移项，当前没有可靠开放零集判分合同，故整题 ungraded；原作者条件/HOLD候选与首次REVISE均保留。'
  const oldAnswers = json(candidatePath).answers
  assert.deepEqual(candidate.answers.filter(item => item.exercise !== '36'),
    oldAnswers.filter(item => item.exercise !== '36'))
  assert.equal(answer.displayAnswer.slice(answer.displayAnswer.indexOf('\n\n2）')),
    oldAnswers.find(item => item.exercise === '36').displayAnswer.slice(
      oldAnswers.find(item => item.exercise === '36').displayAnswer.indexOf('\n\n2）')))
  save(path.join(output, 'answer-keys.json'), candidate)
  const templatePath = path.join(templates, 'exercises.template.json')
  copy(templatePath, path.join(output, 'before/exercises.template.json'))
  const template = json(templatePath)
  const exercise = template.exercises.find(item => item.number === '36')
  assert.ok(exercise.text.startsWith('36*. '))
  assert.ok(exercise.lines[0].startsWith('36*. '))
  exercise.text = '36* ' + exercise.text.slice('36*. '.length)
  exercise.lines[0] = '36* ' + exercise.lines[0].slice('36*. '.length)
  assert.deepEqual(template.exercises.filter(item => item.number !== '36'),
    json(templatePath).exercises.filter(item => item.number !== '36'))
  save(path.join(output, 'exercises.template.json'), template)
  for (const name of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json'])
    copy(path.join(target, name), path.join(output, 'before/modern', name))
  fs.copyFileSync(path.join(output, 'exercises.template.json'), templatePath)
  save(path.join(output, 'repair.json'), {
    status: 'candidate-awaiting-affected-wording-display-and-trace-review', lesson,
    answerChanged: '36(1) conditional-role introduction/conclusion and HOLD note only',
    exerciseChanged: '36 printed prefix36*. ->36* only; existing renderer supplies one period',
    sourceAndFigureChanged: false, mathematicalFormulaChanged: false,
    otherFiveAnswersAnd36Parts23ByteContentUnchanged: true,
    originalAuthorWordingRepairs: 1, newAnswerSymbolWordingRepairs: 1,
    exercisePresentationRepairs: 1, historyReset: false, oldReviewsPreserved: true,
    bindings: [bind(candidatePath), bind(path.join(output, 'answer-keys.json')),
      bind(templatePath), ...['convention-review.json', 'answer-review.json', 'visual-review.json', 'review.json']
        .map(name => bind(path.join(reviewRoot, name)))],
  })
  console.log(JSON.stringify({ output, answerChanges: 1, exercisePresentationChanges: 1 }))
} else {
  assert.ok(['adapt-finalize-01', 'render-01', 'choice-seed-refresh-01'].includes(action))
  if (action !== 'adapt-finalize-01')
    assert.equal(json(path.join(output, 'adapt-finalize-01/command.json')).exitCode, 0)
  const receipt = path.join(output, action)
  assert.ok(!fs.existsSync(receipt))
  fs.mkdirSync(receipt)
  const tool = path.join(repo, '.claude/skills/ld-s10y-lesson/tools/p2c.py')
  const command = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
  let args
  if (action === 'choice-seed-refresh-01') {
    args = ['-B', '.agents/skills/ld-s10y-choice/scripts/prepare.py', 'prepare',
      '--repo', repo, '--book', '9-10g', '--lesson', lesson,
      ...['34', '35', '36', '37', '38', '39'].flatMap(number => ['--exercise', number]),
      ...['0', '4', '12'].flatMap(index => ['--concept-block', index]),
      '--out', path.join(output, 'seed.json')]
  } else {
    args = ['-B', tool, action === 'render-01' ? 'render' : 'adapt-finalize',
      '--book', '9-10g', '--root', path.dirname(core), '--work', work,
      '--edition', 'modern-us-neutral', '--lesson', lesson]
  }
  const run = spawnSync(command, args, { cwd: repo, encoding: 'utf8' })
  save(path.join(receipt, 'command.json'), {
    cwd: repo, command, args, exitCode: run.status, error: run.error?.message,
    offline: true, published: false, earlierSuccessfulSnapshotNotRerun: true,
  })
  fs.writeFileSync(path.join(receipt, 'stdout.txt'), run.stdout || '', { flag: 'wx' })
  fs.writeFileSync(path.join(receipt, 'stderr.txt'), run.stderr || '', { flag: 'wx' })
  if (run.status === 0 && action === 'adapt-finalize-01') {
    for (const name of ['lesson.json', 'figures.json'])
      assert.equal(hash(path.join(target, name)), hash(path.join(output, 'before/modern', name)))
    save(path.join(output, 'modern-transition.json'), {
      status: 'pass-for-exercise36-presentation-only', lesson,
      before: bind(path.join(output, 'before/modern/exercises.json')),
      after: bind(path.join(target, 'exercises.json')),
      lessonAndFiguresUnchanged: true, mathematicsChanged: false, originalOverallRevisePreserved: true,
    })
  }
  console.log(run.stdout)
  if (run.stderr) console.error(run.stderr)
  process.exitCode = run.status ?? 1
}

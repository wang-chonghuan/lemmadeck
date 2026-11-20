import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp')
const output = path.join(tmp, 'n42-mobile-layout-repair-01')
const lesson = 'geo910-c2-s1-n42'
const core = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts')
const target = path.join(core, '9-10g/editions/modern-us-neutral/lessons', lesson)
const template = path.join(tmp, 'g10-n42n43/work/adapt/9-10g/modern-us-neutral/lessons',
  lesson, 'lesson.template.json')
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const save = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
const action = process.argv[2]
const files = ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']

if (action === 'snapshot' || action === 'snapshot-recovery-01') {
  if (action === 'snapshot') fs.mkdirSync(output)
  else save(path.join(output, 'snapshot-first-failure.json'), {
    action: 'snapshot', exitCode: 1, error: 'ENOENT modern lesson.md does not exist',
    copiedBeforeFailure: ['before/lesson.json'], contentChanged: false,
    recovery: 'Use actual modern JSON artifact inventory; reuse exact copied lesson.json',
  })
  const before = path.join(output, 'before')
  if (!fs.existsSync(before)) fs.mkdirSync(before)
  for (const file of [...files.map(name => path.join(target, name)), template]) {
    const to = path.join(before, file === template ? 'lesson.template.json' : path.basename(file))
    if (!fs.existsSync(to)) fs.copyFileSync(file, to, fs.constants.COPYFILE_EXCL)
    assert.equal(hash(file), hash(to))
  }
  save(path.join(output, 'snapshot.json'), {
    issue: 'N42-VIS-01', scope: 'modern prose[15] layout only',
    sourceRef: 'p0154#1', historyReset: false,
    bindings: [...files.map(name => path.join(target, name)), template]
      .map(file => ({ path: file, sha256: hash(file) })),
  })
} else if (action === 'verify') {
  const before = json(path.join(output, 'before/lesson.template.json'))
  const after = json(template)
  const original = before.prose[15].text
  assert.notEqual(after.prose[15].text, original)
  const withoutLayout = text => text.replaceAll('$', '').replace(/\s/g, '')
  assert.equal(withoutLayout(after.prose[15].text), withoutLayout(original))
  const comparable = structuredClone(after)
  comparable.prose[15].text = original
  assert.deepEqual(comparable, before)
  save(path.join(output, 'template-transition.json'), {
    issue: 'N42-VIS-01', status: 'pass', field: 'prose[15].text',
    before: { path: path.join(output, 'before/lesson.template.json'),
      sha256: hash(path.join(output, 'before/lesson.template.json')) },
    after: { path: template, sha256: hash(template) },
    mathematicalTokenSequenceUnchanged: true, sourceDataUnchanged: true,
    allOtherTemplateFieldsUnchanged: true, contentRepairDelta: 1, historyReset: false,
  })
} else if (['adapt-finalize', 'adapt-finalize-recovery-01', 'render'].includes(action)) {
  assert.equal(json(path.join(output, 'template-transition.json')).status, 'pass')
  const receipt = path.join(output, action)
  fs.mkdirSync(receipt)
  const tool = path.join(repo, '.claude/skills/ld-s10y-lesson/tools/p2c.py')
  const executable = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
  const work = action === 'render' ? path.join(repo, '.tmp/ld-s10y-lesson')
    : path.join(tmp, 'g10-n42n43/work')
  const stage = action.startsWith('adapt-finalize') ? 'adapt-finalize' : action
  const args = [tool, stage, '--root', core, '--work', work, '--book', '9-10g',
    '--edition', 'modern-us-neutral', '--lesson', lesson]
  const result = spawnSync(executable, args, { cwd: repo, encoding: 'utf8' })
  fs.writeFileSync(path.join(receipt, 'stdout.txt'), result.stdout || '', { flag: 'wx' })
  fs.writeFileSync(path.join(receipt, 'stderr.txt'), result.stderr || '', { flag: 'wx' })
  save(path.join(receipt, 'command.json'), {
    command: executable, args, cwd: repo, exitCode: result.status,
    offline: true, published: false, issue: 'N42-VIS-01',
  })
  console.log(result.stdout)
  if (result.stderr) console.error(result.stderr)
  assert.equal(result.status, 0)
  if (stage === 'adapt-finalize') {
    for (const name of ['exercises.json', 'figures.json'])
      assert.equal(hash(path.join(target, name)), hash(path.join(output, 'before', name)))
    const before = json(path.join(output, 'before/lesson.json'))
    const after = json(path.join(target, 'lesson.json'))
    const comparable = structuredClone(after)
    comparable.prose[15].text = before.prose[15].text
    assert.deepEqual(comparable, before)
    save(path.join(output, 'modern-transition.json'), {
      status: 'pass', issue: 'N42-VIS-01', field: 'prose[15].text',
      before: { path: path.join(output, 'before/lesson.json'),
        sha256: hash(path.join(output, 'before/lesson.json')) },
      after: { path: path.join(target, 'lesson.json'),
        sha256: hash(path.join(target, 'lesson.json')) },
      sourceDataUnchanged: true, allExercisesAndFiguresUnchanged: true,
      mathematicalTokenSequenceUnchanged: true, historyReset: false,
    })
  }
} else throw new Error(`Unknown action: ${action}`)

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const out = path.dirname(fileURLToPath(import.meta.url))
const raw = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10p')
const root = path.join(out, 'root')
const work = path.join(out, 'work')
const card = 'phy10-c2-s3-n88'
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'))
const bind = f => ({ path: f, sha256: sha(f) })
const inputs = []
const save = (f, value) => {
  fs.mkdirSync(path.dirname(f), { recursive: true })
  fs.writeFileSync(f, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
  return bind(f)
}
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  fs.chmodSync(to, 0o644)
  assert.equal(sha(from), sha(to))
  inputs.push({ input: bind(from), output: bind(to) })
}
assert.ok(!fs.existsSync(path.join(out, 'started.json')))
save(path.join(out, 'started.json'), { ticket: 'STEMROBIN-181', card, stage: 'FIRST-PREPARATION-ONLY' })
const stream = []
for (const page of ['0233', '0234', '0235', '0236']) {
  for (const name of ['page.md', 'page.json', 'audit.json'])
    copy(path.join(raw, 'pages', page, name), path.join(root, '10p/pages', page, name))
  read(path.join(raw, 'pages', page, 'page.json')).blocks.forEach((block, i) =>
    stream.push({ ref: 'p' + page + '#' + (i + 1), ...block }))
}
for (const id of ['fig-203', 'fig-204', 'fig-205', 'tbl-p0236-01'])
  for (const ext of ['png', 'svg'])
    copy(path.join(raw, 'figures', id + '.' + ext), path.join(root, '10p/figures', id + '.' + ext))
save(path.join(out, 'input-bindings.json'), inputs)
const calls = []
function native(name, args) {
  const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', ...args,
    '--book', '10p', '--root', root, '--work', work]
  save(path.join(out, 'calls', name, 'started.json'), { command, cwd: repo })
  const r = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000 })
  const receipt = save(path.join(out, 'calls', name, 'receipt.json'), {
    command, cwd: repo, exit: r.status, stdout: r.stdout, stderr: r.stderr,
    error: r.error?.message ?? null, firstFailurePreserved: r.status !== 0,
  })
  calls.push(receipt)
  assert.equal(r.status, 0, r.stdout + r.stderr)
  return receipt
}
const assembly = native('assemble-FIRST', [
  'assemble', '--toc', 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json'])
const lessonFile = path.join(root, '10p/lessons', card, 'lesson.json')
const exercisesFile = path.join(root, '10p/lessons', card, 'exercises.json')
const lesson = read(lessonFile)
const exercises = read(exercisesFile)
const start = stream.findIndex(block => block.ref === 'p0233#4')
const end = stream.findIndex(block => block.ref === 'p0236#7')
assert.ok(start >= 0 && end > start)
assert.match(stream[start].lines.join('\n'), /^88\./)
assert.match(stream[end].lines.join('\n'), /^89\./)
assert.equal(exercises.count, 0)
assert.deepEqual(lesson.figures.map(f => f.id).sort(),
  ['fig-203', 'fig-204', 'fig-205', 'tbl-p0236-01'].sort())
const blocks = stream.slice(start, end).filter(block => block.kind !== 'foot')
const refs = blocks.map(block => block.ref)
const actualRefs = lesson.prose.flatMap(block => block.source_refs)
assert.deepEqual(actualRefs, refs.slice(1))
const requirements = save(path.join(out, 'source-requirements.json'), {
  ticket: 'STEMROBIN-181', card, status: 'SOURCE-CLOSED-FIRST-PREPARATION-NOT-CARD-APPROVAL',
  boundary: { first: 'p0233#4', last: 'p0236#6', nextHeading: 'p0236#7' },
  sourceQuestions: 0, blocks, sourceFigureIds: lesson.figures.map(f => f.id),
  restrictions: [
    'Original layer remains unchanged; modern figures must be delegated.',
    'No original unsolved questions: invent no choice, input or standard answer task.',
    'No paid calls; portrait generation/reuse permission and modern figure approvals remain separate gates.',
    'No DB, publisher, deploy, commit/push, formal handoff or full-card claim.',
    'Historical SOURCE235 helper boundary HOLD retained; source fidelity was separately composed and consumed.',
  ],
})
const preparation = native('adapt-prepare-FIRST', [
  'adapt-prepare', '--edition', 'modern-us-neutral', '--lesson', card])
save(path.join(out, 'report.json'), {
  ticket: 'STEMROBIN-181', card, status: 'FIRST-SOURCE-ASSEMBLY-AND-MODERN-PREPARATION-PASS',
  root, work, assembly, preparation, requirements,
  rawLesson: bind(lessonFile), rawExercises: bind(exercisesFile),
  sourceQuestions: 0, figures: 4, sourcePagesAdded: 0, completeCardsAdded: 0,
  sourceProducerReplays: 0, parentNewImages: 0, paidCalls: 0,
  independentBoundaryAndModernReviewPending: true, completeCard: false, calls,
})
console.log(JSON.stringify({ card, status: 'FIRST-PREPARATION-PASS', sourceQuestions: 0, figures: 4,
  report: bind(path.join(out, 'report.json')), paidCalls: 0 }))

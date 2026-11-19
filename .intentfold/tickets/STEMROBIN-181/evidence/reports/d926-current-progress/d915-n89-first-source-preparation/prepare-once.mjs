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
const card = 'phy10-c2-s3-n89'
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'))
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')
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
for (const page of ['0236', '0237', '0238', '0239']) {
  for (const name of ['page.md', 'page.json', 'audit.json'])
    copy(path.join(raw, 'pages', page, name), path.join(root, '10p/pages', page, name))
  read(path.join(raw, 'pages', page, 'page.json')).blocks.forEach((block, i) =>
    stream.push({ ref: 'p' + page + '#' + (i + 1), ...block }))
}
for (const id of ['tbl-p0236-01', 'fig-206', 'fig-207', 'fig-208'])
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
const start = stream.findIndex(b => b.ref === 'p0236#7')
const end = stream.findIndex(b => b.ref === 'p0239#1')
assert.ok(start >= 0 && end > start)
assert.match(stream[start].lines.join('\n'), /^89\./)
assert.match(stream[end].lines.join('\n'), /^90\./)
const blocks = stream.slice(start, end).filter(b => b.kind !== 'foot')
const expected = blocks.slice(1).map(b => b.ref)
const actual = lesson.prose.flatMap(b => b.source_refs)
assert.deepEqual([...actual].sort(), [...expected].sort())
assert.equal(new Set(actual).size, actual.length)
const positions = new Map(stream.map((b, i) => [b.ref, i]))
for (const block of lesson.prose) {
  const indices = block.source_refs.map(ref => positions.get(ref))
  assert.ok(indices.every(Number.isInteger))
  assert.deepEqual(indices, [...indices].sort((a, b) => a - b))
}
assert.equal(read(exercisesFile).count, 0)
assert.deepEqual(lesson.figures.map(f => f.id).sort(), ['fig-206', 'fig-207'])
const requirements = save(path.join(out, 'source-requirements.json'), {
  ticket: 'STEMROBIN-181', card, status: 'SOURCE-CLOSED-PREAUTHOR-FROZEN',
  boundary: { first: 'p0236#7', last: 'p0238#6', nextHeading: 'p0239#1' },
  blocks, sourceQuestions: 0, sourceFigureIds: lesson.figures.map(f => f.id),
  exactSourceReferenceCoverage: true, noDuplicateOrOutsideReferences: true,
  perObjectPhysicalReferenceOrder: true, transparentFigureContinuationPreserved: true,
  restrictions: [
    'No original tasks: invent no choices, input tasks or standard answers.',
    'No paid calls; modern figures and colour-plate IV approval remain separate gates.',
    'Printed IV2,3 is retained in original source, not a silently corrected confirmed erratum.',
    'Source fidelity and zero-task closure do not approve modern text or whole-card display.',
    'No DB, publisher, deploy, commit/push or formal handoff.',
  ],
})
const preparation = native('adapt-prepare-FIRST', [
  'adapt-prepare', '--edition', 'modern-us-neutral', '--lesson', card])
const report = save(path.join(out, 'report.json'), {
  ticket: 'STEMROBIN-181', card, status: 'FIRST-SOURCE-ASSEMBLY-AND-MODERN-PREPARATION-PASS',
  root, work, assembly, preparation, requirements,
  rawLesson: bind(lessonFile), rawExercises: bind(exercisesFile),
  sourceQuestions: 0, figures: 2, sourcePagesAdded: 0, completeCardsAdded: 0,
  assembleReplays: 0, sourceProducerReplays: 0, parentNewImages: 0, paidCalls: 0,
  independentBoundaryAndModernReviewPending: true, completeCard: false, calls,
})
console.log(JSON.stringify({ report, sourceQuestions: 0, figures: 2, paidCalls: 0 }))

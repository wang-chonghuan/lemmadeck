import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const out = path.dirname(fileURLToPath(import.meta.url))
const prior = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d904-n88-first-source-preparation')
const root = path.join(prior, 'root')
const work = path.join(prior, 'work')
const card = 'phy10-c2-s3-n88'
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'))
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')
const bind = f => ({ path: f, sha256: sha(f) })
const save = (f, value) => {
  fs.mkdirSync(path.dirname(f), { recursive: true })
  fs.writeFileSync(f, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
  return bind(f)
}
assert.ok(!fs.existsSync(path.join(out, 'report.json')))
const assemblyFile = path.join(prior, 'calls/assemble-FIRST/receipt.json')
assert.equal(read(assemblyFile).exit, 0)
for (const b of read(path.join(prior, 'input-bindings.json'))) {
  assert.equal(sha(b.input.path), b.input.sha256)
  assert.equal(sha(b.output.path), b.output.sha256)
}
const stream = []
for (const page of ['0233', '0234', '0235', '0236'])
  read(path.join(root, '10p/pages', page, 'page.json')).blocks.forEach((block, i) =>
    stream.push({ ref: 'p' + page + '#' + (i + 1), ...block }))
const start = stream.findIndex(b => b.ref === 'p0233#4')
const end = stream.findIndex(b => b.ref === 'p0236#7')
assert.match(stream[start].lines.join('\n'), /^88\./)
assert.match(stream[end].lines.join('\n'), /^89\./)
const blocks = stream.slice(start, end).filter(b => b.kind !== 'foot')
const expected = blocks.slice(1).map(b => b.ref)
const lessonFile = path.join(root, '10p/lessons', card, 'lesson.json')
const exercisesFile = path.join(root, '10p/lessons', card, 'exercises.json')
const lesson = read(lessonFile)
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
assert.deepEqual(lesson.figures.map(f => f.id).sort(),
  ['fig-203', 'fig-204', 'fig-205', 'tbl-p0236-01'].sort())
const requirements = save(path.join(out, 'source-requirements.json'), {
  ticket: 'STEMROBIN-181', card, status: 'SOURCE-CLOSED-PREAUTHOR-FROZEN',
  boundary: { first: 'p0233#4', last: 'p0236#6', nextHeading: 'p0236#7' },
  blocks, sourceQuestions: 0, sourceFigureIds: lesson.figures.map(f => f.id),
  exactSourceReferenceCoverage: true, noDuplicateOrOutsideReferences: true,
  perObjectPhysicalReferenceOrder: true, transparentFigureContinuationPreserved: true,
  restrictions: [
    'Original source unchanged. Independent boundary/content/modern review not yet claimed.',
    'No original tasks: invent no choice/input/standard answer task.',
    'Modern figures/portrait are separate gates; no paid generation/reuse authorization inferred.',
    'Historical SOURCE235 helper boundary HOLD retained; faithful source gate separately composed.',
    'No DB, publisher, deploy, commit/push or formal handoff.',
  ],
})
const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'adapt-prepare', '--book', '10p',
  '--edition', 'modern-us-neutral', '--lesson', card, '--root', root, '--work', work]
save(path.join(out, 'calls/adapt-prepare-FIRST/started.json'), { command, cwd: repo })
const r = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000 })
const preparation = save(path.join(out, 'calls/adapt-prepare-FIRST/receipt.json'), {
  command, cwd: repo, exit: r.status, stdout: r.stdout, stderr: r.stderr,
  error: r.error?.message ?? null, firstFailurePreserved: r.status !== 0,
})
assert.equal(r.status, 0, r.stdout + r.stderr)
const report = save(path.join(out, 'report.json'), {
  ticket: 'STEMROBIN-181', card, status: 'FIRST-SOURCE-ASSEMBLY-AND-MODERN-PREPARATION-PASS',
  root, work, assembly: bind(assemblyFile), preparation, requirements,
  rawLesson: bind(lessonFile), rawExercises: bind(exercisesFile),
  sourceQuestions: 0, figures: 4, sourcePagesAdded: 0, completeCardsAdded: 0,
  firstFailure: bind(path.join(prior, 'FIRST-postassembly-failure.json')),
  recoveryScope: 'Post-assembly assertion corrected, native assembly bytes reused; only pending adapt-prepare executed.',
  assembleReplays: 0, sourceProducerReplays: 0, parentNewImages: 0, paidCalls: 0,
  independentBoundaryAndModernReviewPending: true, completeCard: false,
})
console.log(JSON.stringify({ report, sourceQuestions: 0, figures: 4, paidCalls: 0 }))

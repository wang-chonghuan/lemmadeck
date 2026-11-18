import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const cwd = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
assert.equal(process.cwd(), cwd)
const root = path.join(cwd, '.tmp/s10y-image/batch014-n36-131132')
const templateRoot = path.join(cwd, '.tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/geo910-c1-s3-n36')
const sourceRoot = path.join(cwd, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures')
const contextRoot = path.join(root, 'context-input')
const lessonRoot = path.join(contextRoot, '9-10g/editions/modern-us-neutral/lessons/geo910-c1-s3-n36')
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const record = p => ({ path: p, sha256: hash(p) })
const write = (p, value) => {
  assert.ok(p.startsWith(`${root}/`))
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const link = (target, p) => {
  assert.ok(p.startsWith(`${root}/`))
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.symlinkSync(target, p)
}
const lessonPath = path.join(templateRoot, 'lesson.template.json')
const exercisesPath = path.join(templateRoot, 'exercises.template.json')
const lesson = JSON.parse(fs.readFileSync(lessonPath, 'utf8'))
const exercises = JSON.parse(fs.readFileSync(exercisesPath, 'utf8'))
assert.equal(lesson.id, 'geo910-c1-s3-n36')
assert.equal(lesson.exercise_count, 11)
assert.equal(exercises.count, 11)
assert.deepEqual(exercises.exercises.map(e => e.number), Array.from({ length: 11 }, (_, i) => String(331 + i)))
assert.equal(lesson.prose.filter(p => p.kind === 'p').length, 4)
assert.ok(lesson.prose.some(p => p.text.startsWith('充分性.')))
assert.ok(lesson.prose.some(p => p.text.startsWith('必要性.')))
link(lessonPath, path.join(lessonRoot, 'lesson.json'))
link(exercisesPath, path.join(lessonRoot, 'exercises.json'))
link(sourceRoot, path.join(contextRoot, '9-10g/figures'))
write(path.join(root, 'input-receipt.json'), {
  schema: 'bounded-figure-inputs@1', ticket: 'STEMROBIN-184-3',
  cwd, ownedRoot: root, readCompleteTemplatesBeforeImages: true,
  templates: [record(lessonPath), record(exercisesPath)],
  sourceImages: ['fig-131', 'fig-132'].map(id => record(path.join(sourceRoot, `${id}.png`))),
  theoremProofAndTasks: {
    preserved: true, lessonProseBlocks: 4, exerciseCount: 11,
    taskNumbers: exercises.exercises.map(e => e.number),
    untouchedInputLinksOnly: true,
  },
  buildContextInput: 'Read-only symlinks to current complete templates and existing durable source figures; no copied or edited manifests.',
  createdAt: new Date().toISOString(),
})
for (const id of ['fig-131', 'fig-132']) {
  const output = path.join(root, id, 'context.json')
  const args = [
    '.agents/skills/ld-s10y-image/scripts/build_context.py',
    '--book', '9-10g', '--edition', 'modern-us-neutral',
    '--figure', id, '--root', contextRoot, '--output', output,
  ]
  const startedAt = new Date().toISOString()
  const result = spawnSync('python3', args, { cwd, encoding: 'utf8' })
  write(path.join(root, id, 'build-context.call.json'), {
    cwd, command: 'python3', args, startedAt, endedAt: new Date().toISOString(),
    exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
    error: result.error?.message ?? null,
  })
  assert.equal(result.status, 0, result.stderr)
  const context = JSON.parse(fs.readFileSync(output, 'utf8'))
  assert.equal(context.lessons.length, 1)
  assert.equal(context.lessons[0].lesson, lesson.id)
  assert.equal(context.sourceImage.sha256, hash(path.join(sourceRoot, `${id}.png`)))
  console.log(JSON.stringify({ figure: id, context: record(output), data: context }, null, 2))
}

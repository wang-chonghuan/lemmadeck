import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const tmp = '.intentfold/tickets/STEMROBIN-184/tmp'
const root = `${tmp}/production-assembly10c125-corrected`
const work = `${tmp}/production-answers10c125`
const id = 'ana10-c9-s2-n125'
const lesson = `${root}/10c/editions/modern-us-neutral/lessons/${id}`
const template = `${work}/10c/modern-us-neutral/lessons/${id}/answer-keys.template.json`
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const mode = process.argv[2]
assert(['prepare', 'draft', 'finalize'].includes(mode))
assert.equal(read(`${tmp}/production-modern10c125/first-finalize/command.json`).exitCode, 0)
assert.equal(read(`${lesson}/exercises.json`).count, 0)
assert.deepEqual(read(`${lesson}/exercises.json`).exercises, [])
assert.deepEqual(read(`${root}/10c/lessons/${id}/exercises.json`).exercises, [])
const record = `${work}/first-${mode}`
assert(!fs.existsSync(record))
fs.mkdirSync(record, { recursive: true })
if (mode === 'draft') {
  const doc = read(template)
  assert.equal(doc.lesson, id)
  assert.deepEqual(doc.answers, [])
  assert(!fs.existsSync(`${lesson}/answer-keys.json`))
  fs.copyFileSync(template, `${lesson}/answer-keys.json`, fs.constants.COPYFILE_EXCL)
  fs.copyFileSync(template, `${record}/answer-keys.json`, fs.constants.COPYFILE_EXCL)
  fs.writeFileSync(`${record}/empty-answer-disposition.md`, [
    '# Empty Answer Disposition',
    '',
    'Corrected faithful125 and modern125 contain no written exercises.',
    'The official prepared answer template is copied exactly, with zero answers.',
    'The separate incomplete supplement is not an answer or choice seed for125.',
    'No mathematical solution, choice, option or MathLive input event is invented.',
    'This establishes only empty cardinality, not math, browser or publication approval.',
    '',
  ].join('\n'), { flag: 'wx' })
  console.log(JSON.stringify({ answers: 0, templateSha256: hash(template), draftSha256: hash(`${lesson}/answer-keys.json`) }))
  process.exit(0)
}
if (mode === 'prepare') assert(!fs.existsSync(template))
if (mode === 'finalize') {
  assert(!fs.existsSync(`${lesson}/answer-keys.audit.json`))
  assert.equal(read(`${lesson}/answer-keys.json`).status, 'draft')
}
const executable = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const args = ['-B', '.claude/skills/ld-s10y-answer/tools/lesson_answers.py', mode,
  '--book', '10c', '--edition', 'modern-us-neutral', '--lesson', id,
  '--root', root, '--work', work]
const started = new Date().toISOString()
const result = spawnSync(executable, args, { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })
fs.writeFileSync(`${record}/command.json`, JSON.stringify({
  executable, args, cwd: process.cwd(), started, finished: new Date().toISOString(),
  exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
  programSha256: hash(args[1]), qualification: 'First legitimate empty125 answer operation; no publisher, old PASS rerun or math/input chain claim.',
}, null, 2) + '\n', { flag: 'wx' })
for (const [name, text] of [['stdout', result.stdout], ['stderr', result.stderr]])
  fs.writeFileSync(`${record}/${name}.txt`, text ?? '', { flag: 'wx' })
for (const file of mode === 'prepare' ? [template] : [`${lesson}/answer-keys.json`, `${lesson}/answer-keys.audit.json`])
  if (fs.existsSync(file))
    fs.copyFileSync(file, `${record}/${file.split('/').at(-1)}`, fs.constants.COPYFILE_EXCL)
process.stdout.write(result.stdout ?? '')
process.stderr.write(result.stderr ?? '')
process.exitCode = result.status ?? 1

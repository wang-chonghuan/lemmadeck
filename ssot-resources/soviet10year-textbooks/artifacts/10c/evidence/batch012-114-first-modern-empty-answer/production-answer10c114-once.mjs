import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const root = `${ticket}/production-assembly10c114-heading-fixed`
const work = `${ticket}/production-answers10c114`
const id = 'ana10-c8-s2-n114'
const lesson = `${root}/10c/editions/modern-us-neutral/lessons/${id}`
const template = `${work}/10c/modern-us-neutral/lessons/${id}/answer-keys.template.json`
const mode = process.argv[2]
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
assert(['prepare', 'draft', 'finalize'].includes(mode))
const record = `${work}/first-${mode}`
assert(!fs.existsSync(record), 'Only the first operation for this empty-answer lesson')
assert.equal(read(`${ticket}/production-modern10c114/first-finalize/command.json`).exitCode, 0)
assert.equal(hash(`${lesson}/exercises.json`), 'b8a8f96bceb1d07ade671c176a939593a09d2cabbd7ae80c811872be115417c3')
assert.deepEqual(read(`${lesson}/exercises.json`).exercises, [])
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
    'The faithful and modern n114 exercise inventories contain zero exercises.',
    'The official prepared answer template contains the same empty answers list.',
    'This draft is an exact byte copy of that legitimate template.',
    'Gate 2 per-exercise requirements have no members to solve or review.',
    'No question, answer, choice seed, option or figure has been fabricated.',
    'The first official answer finalizer remains the mechanical gate.',
    'This is cardinality evidence, not mathematics, browser or publication approval.',
    '',
  ].join('\n'), { flag: 'wx' })
  console.log(JSON.stringify({ mode, answers: 0, templateSha256: hash(template),
    draftSha256: hash(`${lesson}/answer-keys.json`), inventedQuestions: 0 }))
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
  programSha256: hash(args[1]), qualification: 'First empty n114 answer operation only; no old PASS rerun or publisher.',
}, null, 2) + '\n', { flag: 'wx' })
for (const [name, text] of [['stdout', result.stdout], ['stderr', result.stderr]])
  fs.writeFileSync(`${record}/${name}.txt`, text ?? '', { flag: 'wx' })
const files = mode === 'prepare' ? [template] : [
  `${lesson}/answer-keys.json`, `${lesson}/answer-keys.audit.json`,
]
for (const file of files) if (fs.existsSync(file))
  fs.copyFileSync(file, `${record}/${file.split('/').at(-1)}`, fs.constants.COPYFILE_EXCL)
process.stdout.write(result.stdout ?? '')
process.stderr.write(result.stderr ?? '')
process.exitCode = result.status ?? 1

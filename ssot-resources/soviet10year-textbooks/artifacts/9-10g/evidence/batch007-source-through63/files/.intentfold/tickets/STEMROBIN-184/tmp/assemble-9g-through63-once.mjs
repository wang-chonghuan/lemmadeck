import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const source = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g'
const root = `${ticket}/assembly-9g-p8-p63`
const book = `${root}/9-10g`
const work = `${root}-work`
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const p2c = '.claude/skills/ld-s10y-lesson/tools/p2c.py'
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file))
const record = file => ({ path: file, sha256: hash(file) })
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(from), hash(to))
}
for (const [file, sha] of [
  [`${ticket}/source-9g-p63-affected-review.md`, process.argv[2]],
  [`${ticket}/source-9g-p60-p62-affected-review.md`,
    '0a01413956bf8b79ab84c4744f743ce8e5ae40cf0fabc952886054118ec79583'],
  [`${ticket}/source-9g-p59-affected-review.md`,
    'b79701309c8b708e798592a4f9fd904fd7d994e6d89137d2df1f5161791c4210'],
]) {
  assert.match(sha || '', /^[a-f0-9]{64}$/, 'Explicit consumed affected approval required')
  assert.equal(hash(file), sha)
}
assert(fs.existsSync(`${source}/evidence/batch007-n14-math-checkpoint/retention.json`),
  'Freeze prior n14 book identity before appending')
assert.equal(hash(`${source}/book.json`), '08e88b0cb16e0d0a200fa515d023579f59118d9086a2944cdb71638e64e0b7b0')
assert(!fs.existsSync(root), 'First assembly of newly approved source only')
const previous = read(`${source}/book.json`)
const complete = ['geo910-c1-s2-n15', 'geo910-c1-s2-n16']
const preserved = previous.lessons.filter(item => item.id !== complete[0])
const protectedFiles = preserved.flatMap(item => ['lesson.json', 'lesson.md', 'exercises.json']
  .map(name => record(`${source}/lessons/${item.id}/${name}`)))
protectedFiles.push(...['lesson', 'exercises'].map(name =>
  record(`${source}/editions/modern-us-neutral/lessons/geo910-c1-s1-t14/${name}.json`)))
fs.mkdirSync(`${root}/operations`, { recursive: true })
copy(`${source}/book.json`, `${root}/before-book.json`)
const run = (name, executable, args) => {
  const prefix = `${root}/operations/${name}`
  const startedAtUtc = new Date().toISOString()
  const result = spawnSync(executable, args, { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 })
  fs.writeFileSync(`${prefix}.stdout.txt`, result.stdout || '', { flag: 'wx' })
  fs.writeFileSync(`${prefix}.stderr.txt`, result.stderr || '', { flag: 'wx' })
  fs.writeFileSync(`${prefix}.command.json`, JSON.stringify({
    executable, args, cwd: process.cwd(), startedAtUtc, finishedAtUtc: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message || null, invocationCount: 1,
  }, null, 2) + '\n', { flag: 'wx' })
  console.log(result.stdout)
  assert.equal(result.status, 0, `Preserve first ${name} failure`)
}
for (const number of [59, 60, 61, 62, 63]) {
  const id = String(number).padStart(4, '0')
  const document = read(`${source}/pages/${id}/page.json`)
  assert.deepEqual(read(`${source}/pages/${id}/audit.json`).errors, [])
  for (const figure of document.meta.figures)
    assert(!fs.existsSync(`.tmp/ld-s10y-lesson/9-10g/pages/${id}/figures/${figure.id}.svg`),
      'Only first vectorization of approved source crops')
  run(`vectorize-${id}`, python, ['-B', p2c, 'vectorize', '--book', '9-10g', '--page', String(number)])
}
const inputs = []
for (let number = 8; number <= 63; number++) {
  const id = String(number).padStart(4, '0')
  assert.deepEqual(read(`${source}/pages/${id}/audit.json`).errors, [])
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const from = `${source}/pages/${id}/${name}`
    copy(from, `${book}/pages/${id}/${name}`)
    inputs.push(record(from))
  }
  for (const figure of read(`${source}/pages/${id}/page.json`).meta.figures) {
    for (const extension of ['png', 'svg']) {
      const from = `.tmp/ld-s10y-lesson/9-10g/pages/${id}/figures/${figure.id}.${extension}`
      if (!fs.existsSync(from)) {
        assert.equal(extension, 'svg', `Required original PNG missing: ${from}`)
        continue
      }
      copy(from, `${work}/9-10g/pages/${id}/figures/${figure.id}.${extension}`)
      inputs.push(record(from))
    }
  }
}
fs.writeFileSync(`${root}/inputs.json`, JSON.stringify({ inputs, protectedFiles }, null, 2) + '\n', { flag: 'wx' })
run('assemble', python, ['-B', p2c, 'assemble', '--book', '9-10g',
  '--toc', 'ssot-resources/soviet10year-textbooks/toc/9-10g/zh.json', '--root', root, '--work', work])
const index = read(`${book}/book.json`)
assert.deepEqual(index.audit.errors, [])
assert.equal(index.audit.exercise_count, 167)
assert.equal(index.audit.figure_numbers.length, 67)
assert.equal(index.lessons.length, 18)
for (const [id, expected] of [
  [complete[0], [159, 160, 161, 162, 163]],
  [complete[1], [164, 165, 166, 167]],
]) assert.deepEqual(read(`${book}/lessons/${id}/exercises.json`).exercises.map(item => Number(item.number)), expected)
for (const item of preserved)
  for (const name of ['lesson.json', 'lesson.md', 'exercises.json'])
    assert.equal(hash(`${book}/lessons/${item.id}/${name}`), hash(`${source}/lessons/${item.id}/${name}`))
for (const item of index.lessons)
  if (complete.includes(item.id) || !previous.lessons.some(old => old.id === item.id))
    fs.cpSync(`${book}/lessons/${item.id}`, `${source}/lessons/${item.id}`, { recursive: true })
for (const name of fs.readdirSync(`${book}/figures`)) {
  const from = `${book}/figures/${name}`
  const to = `${source}/figures/${name}`
  if (fs.existsSync(to)) assert.equal(hash(to), hash(from))
  else copy(from, to)
}
fs.copyFileSync(`${book}/book.json`, `${source}/book.json`)
for (const item of [...inputs, ...protectedFiles]) assert.equal(hash(item.path), item.sha256)
for (const id of complete)
  run(`prepare-${id}`, python, ['-B', p2c, 'adapt-prepare', '--book', '9-10g',
    '--edition', 'modern-us-neutral', '--lesson', id])
run('prior-choice-trace', 'python3', [`${ticket}/rebind-book-trace.py`, '9-10g',
  'geo910-c1-s1-n3', 'geo910-c1-s1-n4', 'geo910-c1-s1-n7', 'geo910-c1-s1-n10'])
fs.writeFileSync(`${root}/promotion.json`, JSON.stringify({
  status: 'SOURCE_PRECURSOR_ONLY', book: record(`${source}/book.json`),
  completeSourceUnits: complete, audit: index.audit,
  protectedFiles, source63AffectedReview: record(`${ticket}/source-9g-p63-affected-review.md`),
  nextUnit: 'geo910-c1-s2-n17 remains open;64/65 unassembled',
  limits: 'No complete modern lesson, formal answers/choices, new original review, or glyph-UNKNOWN clearance.',
}, null, 2) + '\n', { flag: 'wx' })
console.log('Source167 tasks/67 figures/18 units; n15/n16 closed; n17 open; previous source triples unchanged.')

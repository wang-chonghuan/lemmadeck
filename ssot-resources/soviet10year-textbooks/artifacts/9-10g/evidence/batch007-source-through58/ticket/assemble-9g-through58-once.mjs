import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const source = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g'
const root = `${ticket}/assembly-9g-p8-p58`
const book = `${root}/9-10g`
const work = `${root}-work`
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const p2c = '.claude/skills/ld-s10y-lesson/tools/p2c.py'
const complete = 'geo910-c1-s2-n14'
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file))
const record = file => ({ path: file, sha256: hash(file) })
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(from), hash(to))
}
for (const [file, supplied] of [
  [`${ticket}/source-9g-p59-affected-review.md`, process.argv[2]],
  [`${ticket}/geo910-t14-text-affected-review.md`, process.argv[3]],
]) {
  assert.match(supplied || '', /^[a-f0-9]{64}$/, 'Explicit consumed limited-review SHA required')
  assert.equal(hash(file), supplied)
}
assert.equal(hash(`${ticket}/source-9g-p56-p59-independent-review.md`),
  '065360b056bfcedf6e17cdceb2ed1b7deef294b90ddf23cbe4e62c0ffc69ae22')
assert.equal(hash(`${source}/book.json`), '09b7503438ca530df95ef569c48d762e1f8fb8e8fc8ceb384995074008065e24')
assert(!fs.existsSync(root), 'No repeated assembly')
const previous = read(`${source}/book.json`)
const protectedFiles = previous.lessons.filter(item => item.id !== complete)
  .flatMap(item => ['lesson.json', 'lesson.md', 'exercises.json'].map(name => record(`${source}/lessons/${item.id}/${name}`)))
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
    exitCode: result.status, signal: result.signal, error: result.error?.message || null,
  }, null, 2) + '\n', { flag: 'wx' })
  console.log(result.stdout)
  assert.equal(result.status, 0, `Preserve first ${name} failure`)
}
for (const page of [56, 58]) {
  const id = String(page).padStart(4, '0')
  const doc = read(`${source}/pages/${id}/page.json`)
  assert.deepEqual(read(`${source}/pages/${id}/audit.json`).errors, [])
  for (const figure of doc.meta.figures)
    assert(!fs.existsSync(`.tmp/ld-s10y-lesson/9-10g/pages/${id}/figures/${figure.id}.svg`), 'Only first source vector')
  run(`vectorize-${id}`, python, ['-B', p2c, 'vectorize', '--book', '9-10g', '--page', String(page)])
}
const inputs = []
for (let page = 8; page <= 58; page++) {
  const id = String(page).padStart(4, '0')
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
        assert.equal(extension, 'svg', `Required PNG missing: ${from}`)
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
assert.equal(index.audit.exercise_count, 158)
assert.equal(index.audit.figure_numbers.length, 60)
assert.deepEqual(read(`${book}/lessons/${complete}/exercises.json`).exercises.map(item => Number(item.number)), [153, 154, 155, 156, 157, 158])
for (const item of previous.lessons.filter(item => item.id !== complete))
  for (const name of ['lesson.json', 'lesson.md', 'exercises.json'])
    assert.equal(hash(`${book}/lessons/${item.id}/${name}`), hash(`${source}/lessons/${item.id}/${name}`))
for (const item of index.lessons)
  if (item.id === complete || !previous.lessons.some(old => old.id === item.id))
    fs.cpSync(`${book}/lessons/${item.id}`, `${source}/lessons/${item.id}`, { recursive: true })
for (const name of fs.readdirSync(`${book}/figures`)) {
  const from = `${book}/figures/${name}`
  const to = `${source}/figures/${name}`
  if (fs.existsSync(to)) assert.equal(hash(to), hash(from))
  else copy(from, to)
}
fs.copyFileSync(`${book}/book.json`, `${source}/book.json`)
for (const item of [...inputs, ...protectedFiles]) assert.equal(hash(item.path), item.sha256)
run('prepare-n14', python, ['-B', p2c, 'adapt-prepare', '--book', '9-10g',
  '--edition', 'modern-us-neutral', '--lesson', complete])
run('prior-choice-trace', 'python3', [`${ticket}/rebind-book-trace.py`, '9-10g',
  'geo910-c1-s1-n3', 'geo910-c1-s1-n4', 'geo910-c1-s1-n7', 'geo910-c1-s1-n10'])
fs.writeFileSync(`${root}/promotion.json`, JSON.stringify({
  status: 'SOURCE_PRECURSOR', book: record(`${source}/book.json`), completeSourceUnit: complete,
  audit: index.audit, nextUnit: 'geo910-c1-s2-n15 remains open;59-63 deliberately unassembled',
  protectedFiles, limits: 'No complete modern lesson or official answers/choices; p58 C1/C2 remain UNKNOWN.',
}, null, 2) + '\n', { flag: 'wx' })
console.log(`Source158 tasks/60 figures; n14 source closed; prior n1-n13/t14 and approved t14 DRAFT unchanged.`)

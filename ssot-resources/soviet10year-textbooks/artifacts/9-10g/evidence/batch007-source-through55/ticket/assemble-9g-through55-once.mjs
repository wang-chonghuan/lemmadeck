import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const source = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g'
const root = `${ticket}/assembly-9g-p8-p55`
const work = `${root}-work`
const book = `${root}/9-10g`
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const p2c = '.claude/skills/ld-s10y-lesson/tools/p2c.py'
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file))
const review = `${ticket}/source-9g-p50-p55-targeted-repair-independent-review.md`
assert.equal(hash(review), '41d2904b22abe4cbb7404de1390bd21c86c5ac03f05ce83dfa1d431897468784')
const resume = process.argv[2] === 'resume-after-copy-failure'
assert.equal(fs.existsSync(root), resume, 'Explicitly resume only the preserved copy failure')
assert(!fs.existsSync(`${root}/operations/assemble.command.json`), 'Assembly has not run')
const previous = read(`${source}/book.json`)
fs.mkdirSync(`${root}/operations`, { recursive: true })
if (!resume) fs.copyFileSync(`${source}/book.json`, `${root}/before-book.json`)
const run = (name, executable, args) => {
  const result = spawnSync(executable, args, { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 })
  const prefix = `${root}/operations/${name}`
  fs.writeFileSync(`${prefix}.stdout.txt`, result.stdout || '')
  fs.writeFileSync(`${prefix}.stderr.txt`, result.stderr || '')
  fs.writeFileSync(`${prefix}.command.json`, JSON.stringify({
    executable, args, cwd: process.cwd(), exitCode: result.status, signal: result.signal,
    error: result.error?.message || null,
  }, null, 2) + '\n')
  console.log(result.stdout)
  assert.equal(result.status, 0, `Preserve first ${name} failure`)
}
for (const page of [50, 51, 54, 55]) {
  const id = String(page).padStart(4, '0')
  const doc = read(`${source}/pages/${id}/page.json`)
  assert.deepEqual(read(`${source}/pages/${id}/audit.json`).errors, [])
  assert(doc.meta.figures.length > 0)
  if (resume) {
    assert.equal(read(`${root}/operations/vectorize-${id}.command.json`).exitCode, 0)
    for (const figure of doc.meta.figures)
      assert(fs.existsSync(`.tmp/ld-s10y-lesson/9-10g/pages/${id}/figures/${figure.id}.svg`))
  } else {
    for (const figure of doc.meta.figures)
      assert(!fs.existsSync(`.tmp/ld-s10y-lesson/9-10g/pages/${id}/figures/${figure.id}.svg`))
    run(`vectorize-${id}`, python, ['-B', p2c, 'vectorize', '--book', '9-10g', '--page', String(page)])
  }
}
const inputs = []
for (let page = 8; page <= 55; page++) {
  const id = String(page).padStart(4, '0')
  assert.deepEqual(read(`${source}/pages/${id}/audit.json`).errors, [])
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const from = `${source}/pages/${id}/${name}`
    const to = `${book}/pages/${id}/${name}`
    fs.mkdirSync(path.dirname(to), { recursive: true })
    fs.copyFileSync(from, to)
    inputs.push({ path: from, sha256: hash(from) })
  }
  for (const figure of read(`${source}/pages/${id}/page.json`).meta.figures) {
    for (const extension of ['png', 'svg']) {
      const from = `.tmp/ld-s10y-lesson/9-10g/pages/${id}/figures/${figure.id}.${extension}`
      const to = `${work}/9-10g/pages/${id}/figures/${figure.id}.${extension}`
      if (!fs.existsSync(from)) {
        assert.equal(extension, 'svg', `Missing source PNG: ${from}`)
        continue
      }
      fs.mkdirSync(path.dirname(to), { recursive: true })
      fs.copyFileSync(from, to)
      inputs.push({ path: from, sha256: hash(from) })
    }
  }
}
fs.writeFileSync(`${root}/inputs.json`, JSON.stringify(inputs, null, 2) + '\n')
run('assemble', python, ['-B', p2c, 'assemble', '--book', '9-10g',
  '--toc', 'ssot-resources/soviet10year-textbooks/toc/9-10g/zh.json', '--root', root, '--work', work])
const index = read(`${book}/book.json`)
assert.deepEqual(index.audit.errors, [])
assert.equal(index.audit.exercise_count, 152)
assert.equal(index.audit.figure_numbers.length, 57)
const complete = 'geo910-c1-s1-t14'
assert.deepEqual(read(`${book}/lessons/${complete}/exercises.json`).exercises.map(item => Number(item.number)),
  Array.from({ length: 32 }, (_, i) => i + 121))
for (const lesson of previous.lessons.filter(item => item.id !== complete)) {
  for (const name of ['lesson.json', 'lesson.md', 'exercises.json'])
    assert.equal(hash(`${book}/lessons/${lesson.id}/${name}`), hash(`${source}/lessons/${lesson.id}/${name}`))
}
for (const lesson of index.lessons) {
  if (lesson.id === complete || !previous.lessons.some(item => item.id === lesson.id))
    fs.cpSync(`${book}/lessons/${lesson.id}`, `${source}/lessons/${lesson.id}`, { recursive: true })
}
for (const name of fs.readdirSync(`${book}/figures`)) {
  const from = `${book}/figures/${name}`
  const to = `${source}/figures/${name}`
  if (fs.existsSync(to)) assert.equal(hash(from), hash(to))
  else fs.copyFileSync(from, to)
}
fs.copyFileSync(`${book}/book.json`, `${source}/book.json`)
for (const item of inputs) assert.equal(hash(item.path), item.sha256)
run('prepare-t14', python, ['-B', p2c, 'adapt-prepare', '--book', '9-10g',
  '--edition', 'modern-us-neutral', '--lesson', complete])
run('prior-choice-trace', 'python3', [`${ticket}/rebind-book-trace.py`, '9-10g',
  'geo910-c1-s1-n3', 'geo910-c1-s1-n4', 'geo910-c1-s1-n7', 'geo910-c1-s1-n10'])
console.log(`Promoted source152 tasks/57 figures; ${complete} closed, nextchapter n14 open; prior n1-n13 bytes unchanged`)

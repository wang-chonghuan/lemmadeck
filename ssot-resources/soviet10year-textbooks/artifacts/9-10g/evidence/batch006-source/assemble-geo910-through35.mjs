import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const source = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g'
const root = '.intentfold/tickets/STEMROBIN-184/tmp/assembly-9g-p8-p35'
const work = `${root}-work`
const book = path.join(root, '9-10g')
const hash = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
assert(!fs.existsSync(root), 'Preserve initial assembly evidence')
const previous = JSON.parse(fs.readFileSync(path.join(source, 'book.json')))
const inputs = []
for (let page = 8; page <= 35; page++) {
  const id = String(page).padStart(4, '0')
  const pageRoot = path.join(source, 'pages', id)
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(pageRoot, 'audit.json'))).errors, [])
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const from = path.join(pageRoot, name)
    const to = path.join(book, 'pages', id, name)
    fs.mkdirSync(path.dirname(to), { recursive: true })
    fs.copyFileSync(from, to)
    inputs.push({ path: from, sha256: hash(from) })
  }
  const pageDoc = JSON.parse(fs.readFileSync(path.join(pageRoot, 'page.json')))
  for (const figure of pageDoc.meta.figures) {
    for (const extension of ['png', 'svg']) {
      const from = `.tmp/ld-s10y-lesson/9-10g/pages/${id}/figures/${figure.id}.${extension}`
      if (extension === 'svg' && !fs.existsSync(from)) continue
      const to = path.join(work, '9-10g', 'pages', id, 'figures', `${figure.id}.${extension}`)
      fs.mkdirSync(path.dirname(to), { recursive: true })
      fs.copyFileSync(from, to)
      inputs.push({ path: from, sha256: hash(from) })
    }
  }
}
const command = [
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'assemble',
  '--book', '9-10g', '--toc', 'ssot-resources/soviet10year-textbooks/toc/9-10g/zh.json',
  '--root', root, '--work', work,
]
const result = spawnSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', command, { encoding: 'utf8' })
console.log(result.stdout)
console.error(result.stderr)
fs.writeFileSync(path.join(root, 'result.json'), JSON.stringify({
  command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr, inputs,
  sourceReview: 'Existing8-31 reused. Sole independent32-35 review:33PASS;32noise-only metadata and35two omitted source characters restored, actual finalize18/18 and22/22PASS.34 mathematical text and boundary PASS with a tiny final dot honestly unresolved, no guessed punctuation. Five new vectorizations fidelityPASS.',
}, null, 2) + '\n')
assert.equal(result.status, 0)
const index = JSON.parse(fs.readFileSync(path.join(book, 'book.json')))
assert.deepEqual(index.audit.errors, [])
const targets = new Map([
  ['geo910-c1-s1-n8', [57, 68]],
  ['geo910-c1-s1-n9', [69, 76]],
])
for (const [id, [first, last]] of targets) {
  const exercises = JSON.parse(fs.readFileSync(path.join(book, 'lessons', id, 'exercises.json')))
  assert.deepEqual(exercises.exercises.map((exercise) => Number(exercise.number)),
    Array.from({ length: last - first + 1 }, (_, offset) => first + offset))
}
for (const lesson of previous.lessons.filter((lesson) => !targets.has(lesson.id))) {
  for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) {
    assert.equal(hash(path.join(book, 'lessons', lesson.id, name)),
      hash(path.join(source, 'lessons', lesson.id, name)), `Unchanged ${lesson.id}/${name}`)
  }
}
for (const lesson of index.lessons) {
  fs.cpSync(path.join(book, 'lessons', lesson.id), path.join(source, 'lessons', lesson.id), { recursive: true })
}
for (const name of fs.readdirSync(path.join(book, 'figures'))) {
  const from = path.join(book, 'figures', name)
  const to = path.join(source, 'figures', name)
  if (fs.existsSync(to)) assert.equal(hash(from), hash(to), `Unchanged old figure ${name}`)
  else fs.copyFileSync(from, to)
}
fs.copyFileSync(path.join(book, 'book.json'), path.join(source, 'book.json'))
console.log('Promoted8-35; n8 and n9 written boundaries closed; existing other source lessons byte-identical')

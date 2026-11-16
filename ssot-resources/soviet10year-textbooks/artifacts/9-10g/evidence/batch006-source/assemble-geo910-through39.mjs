import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const source = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g'
const root = '.intentfold/tickets/STEMROBIN-184/tmp/assembly-9g-p8-p39'
const work = `${root}-work`
const book = path.join(root, '9-10g')
const hash = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = (file) => JSON.parse(fs.readFileSync(file))
assert(!fs.existsSync(root), 'Preserve earlier assembly evidence')
const previous = read(path.join(source, 'book.json'))
const inputs = []
for (let page = 8; page <= 39; page++) {
  const id = String(page).padStart(4, '0')
  const pageRoot = path.join(source, 'pages', id)
  assert.deepEqual(read(path.join(pageRoot, 'audit.json')).errors, [])
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const from = path.join(pageRoot, name)
    const to = path.join(book, 'pages', id, name)
    fs.mkdirSync(path.dirname(to), { recursive: true })
    fs.copyFileSync(from, to)
    inputs.push({ path: from, sha256: hash(from) })
  }
  for (const figure of read(path.join(pageRoot, 'page.json')).meta.figures) {
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
  sourceReview: 'Approved8-35 reused including p33 metadata-only endpoint erratum. Sole36-39 review:36/37 specified source glyph/word/notes repairs changed-only PASS, actual21/21 each;38 PASS;39 faithful text/crop PASS with upper-plane glyph identity uncertainty retained. All6 new source vectorizations PASS.88 remains open.',
}, null, 2) + '\n')
assert.equal(result.status, 0)
const index = read(path.join(book, 'book.json'))
assert.deepEqual(index.audit.errors, [])
const id = 'geo910-c1-s1-n10'
assert.deepEqual(read(path.join(book, 'lessons', id, 'exercises.json')).exercises.map((item) => Number(item.number)),
  Array.from({ length: 8 }, (_, offset) => offset + 77))
for (const lesson of previous.lessons.filter((lesson) => lesson.id !== id)) {
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
  if (fs.existsSync(to)) assert.equal(hash(from), hash(to), `Unchanged figure ${name}`)
  else fs.copyFileSync(from, to)
}
fs.copyFileSync(path.join(book, 'book.json'), path.join(source, 'book.json'))
console.log('Promoted8-39; n10 written77-84 closed; all prior n1-n9 source triples byte-identical; n11 incomplete')

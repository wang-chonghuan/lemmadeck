import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const source = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g'
const endPage = Number(process.argv[2] || 39)
assert([39, 43, 49].includes(endPage), 'Only the approved source boundaries')
const root = `.intentfold/tickets/STEMROBIN-184/tmp/assembly-9g-p8-p${endPage}`
const work = `${root}-work`
const book = path.join(root, '9-10g')
const hash = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = (file) => JSON.parse(fs.readFileSync(file))
assert(!fs.existsSync(root), 'Preserve earlier assembly evidence')
const previous = read(path.join(source, 'book.json'))
const inputs = []
for (let page = 8; page <= endPage; page++) {
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
  sourceReview: endPage === 39
    ? 'Approved8-35 reused including p33 metadata-only endpoint erratum. Sole36-39 review:36/37 specified source glyph/word/notes repairs changed-only PASS, actual21/21 each;38 PASS;39 faithful text/crop PASS with upper-plane glyph identity uncertainty retained. All6 new source vectorizations PASS.88 remains open.'
    : endPage === 43
      ? 'Approved8-39 reused. Sole40-43 source review PASS after affected-only98/99 filled-marker repair;40-42 and all5crops reuse initial PASS. Current43 MD eaa38ab1722b74f07cbe932df430948afc596def6c143a1a10a55088167ad564/JSON b9d68497172f6c7f7cb1f25be9178cc7e1ac1ad5789dfdabe0795905b38aa0ad/audit unchanged. Five new vectorizations PASS.41 weak punctuation and39 upper-plane glyph identities unresolved. n11/n12 closed, n13 paragraph remains open.'
      : 'Approved8-43 reused. Sole44-47 source StageB and three-word/punctuation affected-only repairs PASS; all12 original crops retained.48 original StageB plus trailing-space/separator metadata affected-only PASS.49 original StageB plus literal118体->形 and122comma->periodspace affected-only PASS. Initial48 countFAIL and49 sourceREVISE retained. Source119 cube+3:2:1 literal not corrected. Twelve44-47 vectorizations already ran once PASS; no rerun. n13 closes107-120; chapter-review123 remains open.',
}, null, 2) + '\n')
assert.equal(result.status, 0)
const index = read(path.join(book, 'book.json'))
assert.deepEqual(index.audit.errors, [])
const id = 'geo910-c1-s1-n10'
assert.deepEqual(read(path.join(book, 'lessons', id, 'exercises.json')).exercises.map((item) => Number(item.number)),
  Array.from({ length: 8 }, (_, offset) => offset + 77))
const changedId = endPage === 39 ? id
  : endPage === 43 ? 'geo910-c1-s1-n11' : 'geo910-c1-s1-n13'
for (const lesson of previous.lessons.filter((lesson) => lesson.id !== changedId)) {
  for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) {
    assert.equal(hash(path.join(book, 'lessons', lesson.id, name)),
      hash(path.join(source, 'lessons', lesson.id, name)), `Unchanged ${lesson.id}/${name}`)
  }
}
if (endPage === 49) {
  const lessonId = 'geo910-c1-s1-n13'
  assert.deepEqual(
    read(path.join(book, 'lessons', lessonId, 'exercises.json')).exercises.map(item => Number(item.number)),
    Array.from({ length: 14 }, (_, offset) => offset + 107),
  )
  const finalPage = read(path.join(source, 'pages/0049/page.json'))
  const openRefs = finalPage.blocks.flatMap((block, index) =>
    block.open ? [`p0049#${index + 1}`] : [])
  assert.deepEqual(openRefs, ['p0049#8'])
  assert.equal(index.audit.warnings.length, 1)
  assert(index.audit.warnings[0].includes(openRefs[0]))
  assert.deepEqual(index.audit.exercise_range, [1, 123])
  assert.equal(index.audit.exercise_count, 123)
  assert.equal(index.audit.figure_numbers.length, 53)
  for (const input of inputs) assert.equal(hash(input.path), input.sha256)
}
if (endPage === 43) {
  for (const [lessonId, start, count] of [
    ['geo910-c1-s1-n11', 85, 12],
    ['geo910-c1-s1-n12', 97, 10],
  ]) {
    assert.deepEqual(
      read(path.join(book, 'lessons', lessonId, 'exercises.json')).exercises.map((item) => Number(item.number)),
      Array.from({ length: count }, (_, offset) => start + offset),
    )
  }
  assert.equal(index.audit.warnings.length, 1)
  assert(index.audit.warnings[0].includes('p0043#11'), 'Only n13 remains open')
  assert.deepEqual(index.audit.exercise_range, [1, 106])
  assert.equal(index.audit.exercise_count, 106)
  assert.equal(index.audit.figure_numbers.length, 41)
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
console.log(endPage === 39
  ? 'Promoted8-39; n10 written77-84 closed; all prior n1-n9 source triples byte-identical; n11 incomplete'
  : endPage === 43
    ? 'Promoted8-43; n11 written85-96/n12 written97-106 closed; all prior n1-n10 source triples byte-identical; n13 incomplete'
    : 'Promoted8-49; n13 written107-120 closed; prior n1-n12 source triples byte-identical; chapter-review123 open')

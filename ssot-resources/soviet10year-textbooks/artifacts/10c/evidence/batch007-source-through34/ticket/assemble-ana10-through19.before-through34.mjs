import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const source = 'ssot-resources/soviet10year-textbooks/artifacts/10c'
const endPage = Number(process.argv[2] || 19)
assert([19, 22, 28].includes(endPage), 'Only individually approved source boundaries')
const root = `.intentfold/tickets/STEMROBIN-184/tmp/assembly-10c-p7-p${endPage}`
const work = `${root}-work`
const book = path.join(root, '10c')
const hash = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = (file) => JSON.parse(fs.readFileSync(file))
assert(!fs.existsSync(root), 'Preserve earlier assembly evidence')
const previous = read(path.join(source, 'book.json'))
const inputs = []
for (let page = 7; page <= endPage; page++) {
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
      const from = `.tmp/ld-s10y-lesson/10c/pages/${id}/figures/${figure.id}.${extension}`
      if (extension === 'svg' && !fs.existsSync(from)) continue
      const to = path.join(work, '10c', 'pages', id, 'figures', `${figure.id}.${extension}`)
      fs.mkdirSync(path.dirname(to), { recursive: true })
      fs.copyFileSync(from, to)
      inputs.push({ path: from, sha256: hash(from) })
    }
  }
}
const command = [
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'assemble',
  '--book', '10c', '--toc', 'ssot-resources/soviet10year-textbooks/toc/10c/zh.json',
  '--root', root, '--work', work,
]
const result = spawnSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', command, { encoding: 'utf8' })
console.log(result.stdout)
console.error(result.stderr)
fs.writeFileSync(path.join(root, 'result.json'), JSON.stringify({
  command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr, inputs,
  sourceReview: endPage === 19
    ? 'Approved7-16 reused.17 sourcePASS;18 count/metadata and complete math/figure PASS with five r-like text-subscript codepoints UNRESOLVED, explicit note retained after targeted diagnosis; no formula or source character replacement.19 exact four markers/punctuation and bottom scan-only metadata changed-onlyPASS,20/20.78 closes42-45;79 remains incomplete. Figure04 vector fidelityPASS0.039%. Heading separator focused6PASS reused.'
    : endPage === 22
      ? 'Approved7-19 reused, including18 unresolved r-like codepoint limitations.20-22 source fidelity and six actual crops reuse sole complete/affected-only PASS with original observation-order limits retained.22 metadata-only full-real-interval erratum supported by parent and independent mathematics; faithful body/blocks unchanged, only errata count changes; actualfinalize23/23PASS. Six new sourcevectorizationsPASS. n79 closed46-51; n80 incomplete at22. No source glyph uncertainty is silently resolved.'
      : 'Approved7-22 reused with all existing glyph limitations.23-26 sole source review and23-25 count-only metadataPASS reused.26 two phase-coordinate errata independently supported, faithful positive spans unchanged and actual23/23.27 scan-only counting exclusion22/22 and28 exact colon13/13, sole affected26-29reviewPASS 013fbd380c4390ea43caa15ac6cc14af41c09e98ba58eecff8e154f3f9313c16; no whole review repeated. Four new23/28vectorizationsPASS. n80 closes52-59 at27; n81 begins28 and remains incomplete. Task55 numeric adjacency and26 A micro-mark stay unresolved, not accepted as an unconditional answer-key interpretation.29/30 future source excluded from this assembly.',
}, null, 2) + '\n')
assert.equal(result.status, 0)
const index = read(path.join(book, 'book.json'))
assert.deepEqual(index.audit.errors, [])
assert.deepEqual(read(path.join(book, 'lessons', 'ana10-c6-s1-n78', 'exercises.json'))
  .exercises.map((item) => Number(item.number)), [42, 43, 44, 45])
const changedId = endPage === 19 ? 'ana10-c6-s1-n78'
  : endPage === 22 ? 'ana10-c6-s2-n79' : 'ana10-c6-s2-n80'
for (const lesson of previous.lessons.filter((lesson) => lesson.number !== null && lesson.id !== changedId)) {
  for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) {
    assert.equal(hash(path.join(book, 'lessons', lesson.id, name)),
      hash(path.join(source, 'lessons', lesson.id, name)), `Unchanged ${lesson.id}/${name}`)
  }
}
if (endPage >= 22) {
  assert.deepEqual(read(path.join(book, 'lessons', 'ana10-c6-s2-n79', 'exercises.json'))
    .exercises.map((item) => Number(item.number)), [46, 47, 48, 49, 50, 51])
}
if (endPage === 28) {
  assert.deepEqual(read(path.join(book, 'lessons', 'ana10-c6-s2-n80', 'exercises.json'))
    .exercises.map((item) => Number(item.number)), [52, 53, 54, 55, 56, 57, 58, 59])
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
for (const obsolete of previous.lessons.filter((lesson) => !index.lessons.some((item) => item.id === lesson.id))) {
  assert.equal(obsolete.number, null)
  assert(obsolete.id.startsWith('x4-78-'))
  const from = path.join(source, 'lessons', obsolete.id)
  fs.cpSync(from, path.join(root, 'obsolete-source-snapshot', obsolete.id), { recursive: true })
  fs.rmSync(from, { recursive: true })
}
fs.copyFileSync(path.join(book, 'book.json'), path.join(source, 'book.json'))
console.log(endPage === 19
  ? 'Promoted7-19; n78 recognized/closed42-45;75/76/77 byte-identical; glyph ambiguity retained;79 incomplete'
  : endPage === 22
    ? 'Promoted7-22; n79 closed46-51; previous completed source triples byte-identical; no glyph recovery claimed'
    : 'Promoted7-28; n80 closed52-59;75-79 source triples byte-identical;n81 incomplete;55 interpretation remains a formal-answer hold')

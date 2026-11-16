import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const configurations = {
  '10c': {
    start: 7, end: 51, vectors: [43, 44, 46],
    complete: 'ana10-c6-s3-n85', next: 'ana10-c6-s3-n86',
    firstTask: 119, lastTask: 146, lastFigure: 28,
    beforeBook: '93d6d63d1572316e8ecda7b296911b593279a6a425be0261939d619e924f1565',
    reviews: [
      ['source-10c-p43-p46-independent-review.md', '711c6ade6097c9315deb9020882044a041e72bbdafad0bcfa3903af29b069151'],
      ['source-10c-p43-p46-targeted-repair-independent-review.md', '6ce604336bf414fdd22edbf3fa2b6266db4364d66821ad1f83f968e7abf6708c'],
      ['source-10c-p47-p51-independent-review.md', '95276911747d2ce7d6e60deeb465b07ee21534dfb37b894b2f19bf6576dd2043'],
      ['source-10c-p47-p49-targeted-repair-independent-review.md', '483a4a1f8ad96942d1e0e27f545494bc820c29d77ab6e6bbd738244f0957693a'],
      ['source-10c-interval-row-tool-repair.md', '77c13a05470fff14970cc7b66f451768fb5aa76eaa2f7344573a3d1a5b2b77c3'],
    ],
    traceLessons: [
      'ana10-c6-s1-n75', 'ana10-c6-s1-n76', 'ana10-c6-s1-n77',
      'ana10-c6-s1-n78', 'ana10-c6-s2-n79',
    ],
    limits: 'Reuses the sole source and affected literal/noise decisions and focused generic counter repair. Initial count failures remain retained. Source T/tau and final a/q UNKNOWN and property6 literal x remain unchanged. n86 is only an unassembled-media source beginning; its referred fig29/table is not present. No math, modern figure, answer, choice, or complete-lesson approval is implied by source assembly.',
  },
  '6-8g': {
    start: 11, end: 68, vectors: [64, 65, 67, 68],
    complete: 'geo68-c1-ex', next: 'geo68-c2-s1-n15',
    firstTask: 152, lastTask: 181, lastFigure: 80,
    reviews: [
      ['source-geo68-p64-p67-independent-review.md', '54f896c1b984ad204deed0fd1543464ade12f9cb885852ff332fecd1f7c3d4a9'],
      ['source-geo68-p64-p67-targeted-repair-independent-review.md', 'aeff9288dbde2a6149cf8f678f04f881e11c1f1d74a91445edaeb548b4c5e0c3'],
      ['source-geo68-p68-p69-independent-review.md', 'd7d5f00d3452f5ed2194dc9d6f30765d23f17ba985b46319571a8cd9f2c57c06'],
    ],
    traceLessons: [],
    limits: 'Reuses sole source/affected review. 154 cap,160 bars,164 word remain UNKNOWN and166 literal square is unchanged. p68 confirms chapter supplement closure after181; n15 remains open. Approved p69 is deliberately not assembled before its future figure81 is available. p68-69 packaging guard FAIL from concurrently authorized179 punctuation remains retained, not rerun or relabeled.',
  },
}
const bookId = process.argv[2]
const config = configurations[bookId]
assert(config, 'Only these approved, previously unattempted source boundaries')
const source = `ssot-resources/soviet10year-textbooks/artifacts/${bookId}`
const root = `${ticket}/assembly-${bookId}-p${config.start}-p${config.end}-nov16`
const work = `${root}-work`
const book = `${root}/${bookId}`
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const p2c = '.claude/skills/ld-s10y-lesson/tools/p2c.py'
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file))
assert(!fs.existsSync(root), 'Never overwrite or repeat first-attempt evidence')
const reviewInputs = config.reviews.map(([name, sha256]) => {
  const file = `${ticket}/${name}`
  assert.equal(hash(file), sha256)
  return { path: file, sha256 }
})
if (config.beforeBook) assert.equal(hash(`${source}/book.json`), config.beforeBook)
const previous = read(`${source}/book.json`)
const protectedFiles = previous.lessons.flatMap(lesson =>
  ['lesson.md', 'lesson.json', 'exercises.json'].map(name => ({
    path: `${source}/lessons/${lesson.id}/${name}`,
    lesson: lesson.id, sha256: hash(`${source}/lessons/${lesson.id}/${name}`),
  })))
fs.mkdirSync(`${root}/operations`, { recursive: true })
fs.copyFileSync(`${source}/book.json`, `${root}/before-book.json`)
for (const item of protectedFiles) {
  const to = `${root}/before-lessons/${item.lesson}/${path.basename(item.path)}`
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(item.path, to)
}
fs.writeFileSync(`${root}/protected-files.json`, JSON.stringify(protectedFiles, null, 2) + '\n')
fs.writeFileSync(`${root}/decisions.json`, JSON.stringify({
  book: bookId, range: [config.start, config.end], reviews: reviewInputs,
  limits: config.limits, complete: config.complete, incomplete: config.next,
}, null, 2) + '\n')
const run = (name, executable, args) => {
  const startedAtUtc = new Date().toISOString()
  const result = spawnSync(executable, args, {
    encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PLAYWRIGHT_HTML_OPEN: 'never' },
  })
  const prefix = `${root}/operations/${name}`
  fs.writeFileSync(`${prefix}.stdout.txt`, result.stdout || '')
  fs.writeFileSync(`${prefix}.stderr.txt`, result.stderr || '')
  fs.writeFileSync(`${prefix}.command.json`, JSON.stringify({
    executable, args, cwd: process.cwd(), startedAtUtc,
    finishedAtUtc: new Date().toISOString(), exitCode: result.status,
    signal: result.signal, error: result.error?.message || null,
  }, null, 2) + '\n')
  console.log(result.stdout)
  console.error(result.stderr)
  assert.equal(result.status, 0, `Preserve first ${name} failure; no automatic rerun`)
}
for (const page of config.vectors) {
  const id = String(page).padStart(4, '0')
  const doc = read(`${source}/pages/${id}/page.json`)
  assert.deepEqual(read(`${source}/pages/${id}/audit.json`).errors, [])
  assert(doc.meta.figures.length > 0, 'Derive nonempty source-image inputs')
  const crops = doc.meta.figures.map(figure => {
    const file = `.tmp/ld-s10y-lesson/${bookId}/pages/${id}/figures/${figure.id}.png`
    assert(!fs.existsSync(file.replace(/\.png$/, '.svg')), 'Do not rerun a vectorization')
    return { path: file, sha256: hash(file) }
  })
  fs.writeFileSync(`${root}/operations/vectorize-${id}.inputs.json`, JSON.stringify(crops, null, 2) + '\n')
  run(`vectorize-${id}`, python, ['-B', p2c, 'vectorize', '--book', bookId, '--page', String(page)])
  for (const crop of crops) assert.equal(hash(crop.path), crop.sha256)
}
const inputs = []
for (let page = config.start; page <= config.end; page++) {
  const id = String(page).padStart(4, '0')
  assert.deepEqual(read(`${source}/pages/${id}/audit.json`).errors, [], `Approved page ${id}`)
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const from = `${source}/pages/${id}/${name}`
    const to = `${book}/pages/${id}/${name}`
    fs.mkdirSync(path.dirname(to), { recursive: true })
    fs.copyFileSync(from, to)
    inputs.push({ path: from, sha256: hash(from) })
  }
  for (const figure of read(`${source}/pages/${id}/page.json`).meta.figures) {
    for (const extension of ['png', 'svg']) {
      const from = `.tmp/ld-s10y-lesson/${bookId}/pages/${id}/figures/${figure.id}.${extension}`
      if (!fs.existsSync(from)) {
        assert.equal(extension, 'svg', `Source PNG is mandatory: ${from}`)
        continue
      }
      const to = `${work}/${bookId}/pages/${id}/figures/${figure.id}.${extension}`
      fs.mkdirSync(path.dirname(to), { recursive: true })
      fs.copyFileSync(from, to)
      inputs.push({ path: from, sha256: hash(from) })
    }
  }
}
fs.writeFileSync(`${root}/inputs.json`, JSON.stringify(inputs, null, 2) + '\n')
run('assemble', python, ['-B', p2c, 'assemble', '--book', bookId,
  '--toc', `ssot-resources/soviet10year-textbooks/toc/${bookId}/zh.json`,
  '--root', root, '--work', work])
const index = read(`${book}/book.json`)
assert.deepEqual(index.audit.errors, [])
assert.equal(index.audit.exercise_count, config.lastTask)
assert.equal(index.audit.figure_numbers.length, config.lastFigure)
const completeExercises = read(`${book}/lessons/${config.complete}/exercises.json`).exercises
assert.deepEqual(completeExercises.map(item => Number(item.number)),
  Array.from({ length: config.lastTask - config.firstTask + 1 }, (_, i) => config.firstTask + i))
assert(index.lessons.some(item => item.id === config.next), 'Next unit is an incomplete precursor')
for (const item of protectedFiles) {
  assert.equal(hash(item.path), item.sha256, 'No concurrent old-source edit')
  if (item.lesson !== config.complete)
    assert.equal(hash(`${book}/lessons/${item.lesson}/${path.basename(item.path)}`), item.sha256,
      `Previous completed source triple changed: ${item.path}`)
}
for (const item of inputs) assert.equal(hash(item.path), item.sha256)
const promoted = []
for (const lesson of index.lessons) {
  if (lesson.id === config.complete || !previous.lessons.some(item => item.id === lesson.id)) {
    fs.cpSync(`${book}/lessons/${lesson.id}`, `${source}/lessons/${lesson.id}`, { recursive: true })
    promoted.push(lesson.id)
  }
}
for (const name of fs.readdirSync(`${book}/figures`)) {
  const from = `${book}/figures/${name}`
  const to = `${source}/figures/${name}`
  if (fs.existsSync(to)) assert.equal(hash(from), hash(to), `Previous source figure changed: ${name}`)
  else fs.copyFileSync(from, to)
}
fs.copyFileSync(`${book}/book.json`, `${source}/book.json`)
fs.writeFileSync(`${root}/promotion.json`, JSON.stringify({
  book: bookId, book_sha256: hash(`${source}/book.json`), promoted,
  complete: config.complete, tasks: completeExercises.length,
  totalSourceTasks: index.audit.exercise_count, totalSourceFigures: index.audit.figure_numbers.length,
  warnings: index.audit.warnings, incomplete: config.next, limits: config.limits,
}, null, 2) + '\n')
run('prepare-complete', python, ['-B', p2c, 'adapt-prepare', '--book', bookId,
  '--edition', 'modern-us-neutral', '--lesson', config.complete])
if (config.traceLessons.length)
  run('prior-choice-trace', 'python3', [`${ticket}/rebind-book-trace.py`, bookId, ...config.traceLessons])
console.log(`Promoted ${config.complete}: ${completeExercises.length} source tasks; ${config.next} incomplete; no completed modern lesson claimed`)

import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const source = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g'
const lesson = 'geo910-c1-s1-t14'
const templates = `.tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/${lesson}`
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file))
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
}
const record = file => ({ path: file, sha256: hash(file) })
const sourceReview = `${ticket}/source-9g-p56-p59-independent-review.md`
const textReview = `${ticket}/geo910-t14-math-independent-review.md`
const mode = process.argv[2]

if (mode === 'before-source') {
  assert.equal(hash(sourceReview), '065360b056bfcedf6e17cdceb2ed1b7deef294b90ddf23cbe4e62c0ffc69ae22')
  const root = `${ticket}/source-9g-p59-targeted-repair-evidence`
  assert(!fs.existsSync(root), 'Preserve all prior source repair evidence')
  const targets = ['page.md', 'page.json', 'audit.json'].map(name => `${source}/pages/0059/${name}`)
  const protectedFiles = []
  for (const page of [56, 57, 58]) {
    const id = String(page).padStart(4, '0')
    for (const name of ['page.md', 'page.json', 'audit.json'])
      protectedFiles.push(`${source}/pages/${id}/${name}`)
  }
  const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(file) : [file]
  })
  for (const page of [56, 57, 58, 59])
    protectedFiles.push(...walk(`.tmp/ld-s10y-lesson/9-10g/pages/${String(page).padStart(4, '0')}`))
  protectedFiles.push(
    sourceReview, `${ticket}/source-9g-p56-p59-independent-source-first.md`,
    `${ticket}/source-9g-p56-p59-author.md`, `${ticket}/source-9g-p56-p59-author.manifest.json`,
    `${source}/book.json`,
  )
  for (const file of targets) copy(file, `${root}/before/0059/${path.basename(file)}`)
  fs.writeFileSync(`${root}/before.json`, JSON.stringify({
    targets: targets.map(record), protected: protectedFiles.map(record),
    review: record(sourceReview),
    permitted: ['p0059#5 first reflexivity formula restores the original right subscript 1',
      'notes[1] specifies picture orientation, not perpendicularity'],
    limits: 'No source mathematical correction; p58 punctuation C1/C2 remains UNKNOWN and unchanged.',
  }, null, 2) + '\n')
} else if (mode === 'finalize-source') {
  const root = `${ticket}/source-9g-p59-targeted-repair-evidence`
  const before = read(`${root}/before.json`)
  assert(!fs.existsSync(`${root}/finalize.command.json`), 'Only one affected finalize')
  for (const item of before.protected) assert.equal(hash(item.path), item.sha256)
  const executable = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
  const args = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
    'finalize', '--book', '9-10g', '--page', '59']
  const startedAtUtc = new Date().toISOString()
  const result = spawnSync(executable, args, { encoding: 'utf8' })
  fs.writeFileSync(`${root}/finalize.stdout.txt`, result.stdout || '')
  fs.writeFileSync(`${root}/finalize.stderr.txt`, result.stderr || '')
  fs.writeFileSync(`${root}/finalize.command.json`, JSON.stringify({
    executable, args, cwd: process.cwd(), startedAtUtc,
    finishedAtUtc: new Date().toISOString(), exitCode: result.status,
    signal: result.signal, error: result.error?.message || null,
  }, null, 2) + '\n')
  for (const item of before.targets) copy(item.path, `${root}/after/0059/${path.basename(item.path)}`)
  const unchanged = before.protected.map(item => ({ ...item, unchanged: hash(item.path) === item.sha256 }))
  fs.writeFileSync(`${root}/after.json`, JSON.stringify({
    targets: before.targets.map(item => record(item.path)), unchanged,
    interpretation: 'Author affected-repair evidence only, not independent PASS',
  }, null, 2) + '\n')
  console.log(result.stdout)
  console.error(result.stderr)
  assert.equal(result.status, 0, 'Preserve any first affected failure')
  assert(unchanged.every(item => item.unchanged), 'Protected pixel/layout/crop/source bytes changed')
} else if (mode === 'repair-text') {
  assert.equal(hash(textReview), 'e30c20739b1b8d6cf3808456caa4cfbc3e85e14d8a9df9ab0e27363cd8418411')
  const root = `${ticket}/geo910-t14-text-targeted-repair-evidence`
  assert(!fs.existsSync(root), 'Only this initial four-task text repair')
  const file = `${templates}/exercises.template.json`
  assert.equal(hash(file), '8babaa464a64583a42111608f9ca5425a7686d4b0971131bcea0d0f1ccb93333')
  const original = read(file)
  const after = structuredClone(original)
  const protectedFiles = [
    `${templates}/lesson.template.json`, `${templates}/figures.template.json`,
    `${source}/book.json`, textReview,
    ...['lesson.json', 'lesson.md', 'exercises.json'].map(name => `${source}/lessons/${lesson}/${name}`),
    ...['geo910-t14-math-author.md', 'geo910-t14-math-author.manifest.json',
      'geo910-t14-derived-answer-precursor.json', 'geo910-t14-math-independent-source-first.md']
      .map(name => `${ticket}/${name}`),
  ].map(record)
  copy(file, `${root}/before/exercises.template.json`)
  const replacements = {
    '133': [['图55，а', '图55，a'], ['图55，б', '图55，b'], ['图55а，б', '图55a，b'], ['图55，в', '图55，c']],
    '150': [['图56，а', '图56，a']],
    '151': [['图56，б', '图56，b']],
  }
  const changes = []
  for (const item of after.exercises) {
    assert.deepEqual(item.lines, item.text.split('\n'), `Initial text/lines differ in ${item.number}`)
    const previous = item.text
    if (replacements[item.number]) {
      for (const [from, to] of replacements[item.number]) {
        assert(item.text.includes(from), `Known panel occurrence missing: ${item.number}/${from}`)
        item.text = item.text.replaceAll(from, to)
      }
      assert(!/[а-яА-Я]/u.test(item.text), 'Do not leave a known Cyrillic panel label in adapted text')
      item.changes.push('culture-label')
    } else if (item.number === '135') {
      const from = '这个论断正确吗？2) 利用1)'
      const to = '这个论断正确吗？\n2) 利用1)'
      assert.equal(item.text.split(from).length, 2, 'Only the actual second subpart')
      item.text = item.text.replace(from, to)
    } else continue
    item.lines = item.text.split('\n')
    changes.push({ number: item.number, before: previous, after: item.text, metadata: item.changes })
    const beforeItem = original.exercises.find(candidate => candidate.number === item.number)
    const untouched = value => Object.fromEntries(Object.entries(value)
      .filter(([key]) => !['text', 'lines', 'changes'].includes(key)))
    assert.deepEqual(untouched(item), untouched(beforeItem), 'Only adapted text/lines/change declarations')
  }
  assert.deepEqual(changes.map(item => item.number), ['133', '135', '150', '151'])
  for (const item of original.exercises.filter(item => !changes.some(change => change.number === item.number)))
    assert.deepEqual(after.exercises.find(candidate => candidate.number === item.number), item)
  assert.deepEqual(after.source, original.source, 'Embedded original source unchanged')
  fs.writeFileSync(file, JSON.stringify(after, null, 2) + '\n')
  copy(file, `${root}/after/exercises.template.json`)
  for (const item of protectedFiles) assert.equal(hash(item.path), item.sha256)
  fs.writeFileSync(`${root}/repair.json`, JSON.stringify({
    review: record(textReview), before_sha256: hash(`${root}/before/exercises.template.json`),
    after: record(file), changes, protected: protectedFiles,
    mapping: { 'fig-55': 'source Cyrillic a/be/ve -> Latin a/b/c', 'fig-56': 'source Cyrillic a/be -> Latin a/b' },
    limits: 'No source or mathematical change, no independent PASS, no finalization/render or figure approval',
  }, null, 2) + '\n')
  console.log(JSON.stringify({ repairedTasks: changes.map(item => item.number), after: record(file) }, null, 2))
} else throw new Error('Expected before-source, finalize-source or repair-text')

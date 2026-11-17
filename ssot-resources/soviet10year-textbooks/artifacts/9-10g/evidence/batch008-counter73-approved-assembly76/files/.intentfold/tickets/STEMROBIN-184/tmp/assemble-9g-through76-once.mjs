import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const source = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g'
const edition = `${source}/editions/modern-us-neutral`
const root = `${ticket}/assembly-9g-p8-p76`
const book = `${root}/9-10g`
const work = `${root}/work`
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const p2c = '.claude/skills/ld-s10y-lesson/tools/p2c.py'
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file))
const record = path => ({ path, sha256: hash(path) })
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(from), hash(to))
}
const releaseFile = process.argv[2]
const releaseSha = process.argv[3]
assert(releaseFile?.startsWith(`${ticket}/`) && /^[a-f0-9]{64}$/.test(releaseSha || ''))
assert.equal(hash(releaseFile), releaseSha, 'Explicitly consumed counter release required')
const release = read(releaseFile)
assert.equal(release.status, 'COUNTER73_PROMOTED_AFFECTED_FINALIZE_PASS')
assert.equal(release.production.sha256, hash('.claude/skills/ld-s10y-lesson/tools/layout.py'))
assert.equal(hash(`${source}/book.json`), '3f45753a2dc5398ed5ae9612770a535d831c3dd5d6b80b289963160bd78d6c35')
assert(!fs.existsSync(root), 'First assembly of this scope only')
assert.equal(read(`${ticket}/source-9g-p76-first-finalize/result.json`).status,
  'SOURCE76_FIRST_FINALIZE_PASS_PRECURSOR_ONLY')
const prior = read(`${source}/book.json`)
const closed = 'geo910-c1-s2-n20'
const next = 'geo910-c1-s2-n21'
const traces = fs.readdirSync(`${edition}/lessons`).filter(id => {
  const dir = `${edition}/lessons/${id}/choice-set`
  return ['seed', 'draft', 'review'].every(name => fs.existsSync(`${dir}/${name}.json`))
    && read(`${dir}/review.json`).outcome === 'pass'
})
const protectedFiles = prior.lessons.filter(item => item.id !== closed).flatMap(item =>
  ['lesson.json', 'lesson.md', 'exercises.json'].map(name => record(`${source}/lessons/${item.id}/${name}`)))
for (const id of fs.readdirSync(`${edition}/lessons`)) {
  for (const name of ['lesson', 'exercises', 'figures']) {
    const file = `${edition}/lessons/${id}/${name}.json`
    if (fs.existsSync(file)) protectedFiles.push(record(file))
  }
}
fs.mkdirSync(`${root}/operations`, { recursive: true })
copy(`${source}/book.json`, `${root}/before-book.json`)
for (const id of traces) {
  for (const name of ['seed', 'draft', 'review']) {
    copy(`${edition}/lessons/${id}/choice-set/${name}.json`, `${root}/before-choice/${id}/${name}.json`)
  }
}
fs.writeFileSync(`${root}/protected-files.json`, JSON.stringify(protectedFiles, null, 2) + '\n', { flag: 'wx' })
const run = (name, executable, args) => {
  const prefix = `${root}/operations/${name}`
  const startedAtUtc = new Date().toISOString()
  const result = spawnSync(executable, args, { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PWDEBUG: '', PLAYWRIGHT_HTML_OPEN: 'never' } })
  for (const [suffix, data] of [['stdout.txt', result.stdout || ''], ['stderr.txt', result.stderr || '']]) {
    fs.writeFileSync(`${prefix}.${suffix}`, data, { flag: 'wx' })
  }
  fs.writeFileSync(`${prefix}.command.json`, JSON.stringify({
    executable, args, cwd: process.cwd(), startedAtUtc, finishedAtUtc: new Date().toISOString(),
    exit: result.status, error: result.error?.message || null, signal: result.signal, invocationCount: 1,
  }, null, 2) + '\n', { flag: 'wx' })
  console.log(result.stdout)
  console.error(result.stderr)
  assert.equal(result.status, 0, `Preserve first ${name} failure; do not repeat completed phases`)
}
for (const page of [72, 74, 75, 76]) {
  const id = String(page).padStart(4, '0')
  assert.deepEqual(read(`${source}/pages/${id}/audit.json`).errors, [])
  for (const figure of read(`${source}/pages/${id}/page.json`).meta.figures) {
    assert(!fs.existsSync(`.tmp/ld-s10y-lesson/9-10g/pages/${id}/figures/${figure.id}.svg`))
  }
  run(`vectorize-${id}`, python, ['-B', p2c, 'vectorize', '--book', '9-10g', '--page', String(page)])
}
const inputs = []
for (let page = 8; page <= 76; page++) {
  const id = String(page).padStart(4, '0')
  assert.deepEqual(read(`${source}/pages/${id}/audit.json`).errors, [])
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const from = `${source}/pages/${id}/${name}`
    copy(from, `${book}/pages/${id}/${name}`)
    inputs.push(record(from))
  }
  for (const figure of read(`${source}/pages/${id}/page.json`).meta.figures) {
    for (const extension of ['png', 'svg']) {
      const from = [
        `.tmp/ld-s10y-lesson/9-10g/pages/${id}/figures/${figure.id}.${extension}`,
        `${source}/figures/${figure.id}.${extension}`,
      ].find(file => fs.existsSync(file))
      if (!from) {
        assert.equal(extension, 'svg', 'Every original PNG is mandatory')
        continue
      }
      const durable = `${source}/figures/${figure.id}.${extension}`
      if (fs.existsSync(durable)) assert.equal(hash(durable), hash(from))
      copy(from, `${work}/9-10g/pages/${id}/figures/${figure.id}.${extension}`)
      inputs.push(record(from))
    }
  }
}
fs.writeFileSync(`${root}/inputs.json`, JSON.stringify({
  inputs, release: record(releaseFile), scope: 'Source n20 closure and n21 OPEN only; residual source77-79 and n18 image holds retained',
}, null, 2) + '\n', { flag: 'wx' })
run('assemble', python, ['-B', p2c, 'assemble', '--book', '9-10g',
  '--toc', 'ssot-resources/soviet10year-textbooks/toc/9-10g/zh.json', '--root', root, '--work', work])
const index = read(`${book}/book.json`)
assert.deepEqual(index.audit.errors, [])
assert.deepEqual(read(`${book}/lessons/${closed}/exercises.json`).exercises.map(item => Number(item.number)),
  [192, 193, 194, 195, 196, 197])
assert(index.lessons.some(item => item.id === next))
for (const item of protectedFiles) {
  assert.equal(hash(item.path), item.sha256, 'Protected original or edition changed')
  if (item.path.startsWith(`${source}/lessons/`)) assert.equal(hash(item.path.replace(source, book)), item.sha256)
}
for (const item of inputs) assert.equal(hash(item.path), item.sha256)
for (const item of index.lessons) {
  if (item.id === closed || !prior.lessons.some(old => old.id === item.id)) {
    fs.cpSync(`${book}/lessons/${item.id}`, `${source}/lessons/${item.id}`, { recursive: true })
  }
}
for (const name of fs.readdirSync(`${book}/figures`)) {
  const from = `${book}/figures/${name}`
  const to = `${source}/figures/${name}`
  if (fs.existsSync(to)) assert.equal(hash(to), hash(from))
  else copy(from, to)
}
fs.copyFileSync(`${book}/book.json`, `${source}/book.json`)
run(`prepare-${closed}`, python, ['-B', p2c, 'adapt-prepare', '--book', '9-10g',
  '--edition', 'modern-us-neutral', '--lesson', closed])
const modeRecords = traces.flatMap(id => ['seed', 'draft', 'review'].map(name => {
  const file = `${edition}/lessons/${id}/choice-set/${name}.json`
  return { path: file, mode: fs.statSync(file).mode & 0o777 }
}))
try {
  for (const item of modeRecords) fs.chmodSync(item.path, item.mode | 0o200)
  run('prior-choice-trace', 'python3', [`${ticket}/rebind-book-trace.py`, '9-10g', ...traces])
} finally {
  for (const item of modeRecords) fs.chmodSync(item.path, item.mode)
}
fs.writeFileSync(`${root}/promotion.json`, JSON.stringify({
  status: 'SOURCE_N20_CLOSED_N21_OPEN_ONLY', book: record(`${source}/book.json`),
  closedSourceUnit: closed, nextOpenUnit: next, audit: index.audit,
  protectedFiles, traceLessons: traces, permissionModesRestored: true,
  limits: 'No complete modern n20, repaired194(4), source77-79 clearance, n18/n15/n17 repair, answer or choice approval claimed.',
}, null, 2) + '\n', { flag: 'wx' })

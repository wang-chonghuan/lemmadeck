import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, bind, save, hash } from './retain-scoped-evidence-02.mjs'

const base = path.join(tmp, 'g10-n60')
const root = path.join(base, 'artifacts')
const work = path.join(base, 'work')
const lesson = 'geo910-c2-s3-n60'
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(from), hash(to))
}
function verifyAssembly() {
  const book = path.join(root, '9-10g')
  const index = read(path.join(book, 'book.json'))
  assert.deepEqual(index.audit.errors, [])
  assert.deepEqual(index.audit.exercise_range, [195, 205])
  assert.deepEqual(index.audit.figure_numbers, [77, 78, 79, 80, 81, 82])
  assert.deepEqual(index.lessons.map(l => l.id), [lesson])
  const exercises = read(path.join(book, 'lessons', lesson, 'exercises.json')).exercises
  assert.deepEqual(exercises.map(e => e.number), Array.from({ length: 11 }, (_, i) => String(195 + i)))
  assert.deepEqual(exercises.find(e => e.number === '198').pages, ['p0217#12', 'p0218#1'])
  assert.ok(exercises.every(e => !e.pages.some(ref => /^p0215#(?:1|2|3|4)$/.test(ref))))
  const prose = read(path.join(book, 'lessons', lesson, 'lesson.json')).prose
  assert.ok(prose.some(p => p.source_refs.includes('p0215#6')))
  assert.ok(prose.every(p => !p.source_refs.some(ref => /^p0218#(?:9|10|11|12|13)$/.test(ref))))
  return index
}
const action = process.argv[2]
if (action === 'seed') {
  const admissionPath = path.join(tmp, 'n60-source-admission-01.json')
  const admission = read(admissionPath)
  assert.equal(admission.status, 'pass-for-readable-n60-source-only-with-local-holds')
  assert.equal(admission.preheadingFigure77OwnershipApproved, true)
  assert.equal(admission.namespaceIntegrationApproved, true)
  admission.bindings.forEach(b => assert.equal(hash(b.path), b.sha256, b.path))
  assert.ok(!fs.existsSync(base), base)
  fs.mkdirSync(base)
  copy(admissionPath, path.join(base, 'source-admission.json'))
  const bindings = admission.bindings.map(b => ({ from: b.path, sha256: b.sha256 }))
  for (const p of admission.pages) {
    const relative = `9-10g/pages/${String(p.physical).padStart(4, '0')}`
    const pairs = [
      ...['page.md', 'page.json', 'audit.json'].map(n => [path.join(p.artifactDirectory, n), path.join(root, relative, n)]),
      [p.original.path, path.join(work, relative, 'page.png')],
      [p.preparedLayout.path, path.join(work, relative, 'layout.json')],
      ...p.selectedFigures.map(f => [f.path, path.join(work, relative, 'figures', `${f.id}.png`)]),
    ]
    for (const [from, to] of pairs) {
      assert.ok(admission.bindings.some(b => b.path === from), from)
      copy(from, to)
      bindings.push({ from, to, sha256: hash(from) })
    }
  }
  save(path.join(base, 'source-bindings.json'), bindings)
  console.log(JSON.stringify({ action, bindings: bindings.length, sourceBodyChanges: 0,
    outOfScopeCropsCopied: 0, wholeLessonApproved: false }))
} else {
  const tool = path.join(repo, '.claude/skills/ld-s10y-lesson/tools/p2c.py')
  const actions = {
    'assemble-source-01': [path.join(tmp, 'assemble-n60.py')],
    'vectorize-source-01': [tool, 'vectorize', '--book', '9-10g', '--root', root, '--work', work],
    'assemble-source-02': [path.join(tmp, 'assemble-n60.py')],
    'adapt-prepare-isolated-01': [tool, 'adapt-prepare', '--book', '9-10g', '--root', root,
      '--work', work, '--edition', 'modern-us-neutral', '--lesson', lesson],
  }
  assert.ok(actions[action], action)
  const previous = {
    'vectorize-source-01': 'assemble-source-01',
    'assemble-source-02': 'vectorize-source-01',
    'adapt-prepare-isolated-01': 'assemble-source-02',
  }[action]
  read(path.join(base, 'source-bindings.json')).forEach(b => assert.equal(hash(b.from), b.sha256, b.from))
  if (previous) assert.equal(read(path.join(base, previous, 'command.json')).exitCode, 0)
  if (action !== 'assemble-source-01') verifyAssembly()
  const receiptRoot = path.join(base, action)
  assert.ok(!fs.existsSync(receiptRoot), receiptRoot)
  fs.mkdirSync(receiptRoot)
  const command = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
  const args = ['-B', ...actions[action]]
  save(path.join(receiptRoot, 'started.json'), { command, args, cwd: repo,
    startedAt: new Date().toISOString(), runner: bind(new URL(import.meta.url).pathname) })
  const result = spawnSync(command, args, { cwd: repo, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 })
  fs.writeFileSync(path.join(receiptRoot, 'stdout.txt'), result.stdout || '', { flag: 'wx' })
  fs.writeFileSync(path.join(receiptRoot, 'stderr.txt'), result.stderr || '', { flag: 'wx' })
  save(path.join(receiptRoot, 'command.json'), { command, args, cwd: repo,
    endedAt: new Date().toISOString(), exitCode: result.status, error: result.error?.message,
    offline: true, coreWritten: false, sourceChanged: false, images: 0,
    paidCalls: 0, published: false, wholeLessonApproved: false })
  if (result.status === 0 && action.startsWith('assemble-source')) verifyAssembly()
  console.log(result.stdout || '')
  if (result.stderr) console.error(result.stderr)
  process.exitCode = result.status ?? 1
}

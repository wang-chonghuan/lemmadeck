import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
assert.equal(process.cwd(), repo)
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-184/tmp')
const evidence = path.join(ticket, 'n80-finalize-display')
const lesson = 'ana10-c6-s2-n80'
const edition = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral')
const templates = path.join(repo, '.tmp/ld-s10y-lesson/adapt/10c/modern-us-neutral/lessons', lesson)
const durable = path.join(edition, 'lessons', lesson)
const render = path.join(repo, '.tmp/ld-s10y-lesson/render/10c/modern-us-neutral', lesson)
const offline = path.join(ticket, 'offline', lesson)
const sha = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const descriptor = file => ({ path: file, bytes: fs.statSync(file).size, sha256: sha(file) })
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'))
function write(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
}
function copy(source, destination) {
  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL)
  assert.equal(sha(source), sha(destination))
  return { source: descriptor(source), snapshot: descriptor(destination) }
}
function list(directory) {
  if (!fs.existsSync(directory)) return []
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name)
    assert(!entry.isSymbolicLink(), `Unexpected symlink: ${file}`)
    return entry.isDirectory() ? list(file) : [file]
  }).sort()
}
function snapshot(stage) {
  const rows = []
  for (const name of ['lesson', 'exercises', 'figures']) {
    const source = path.join(templates, `${name}.template.json`)
    rows.push(copy(source, path.join(evidence, stage, `${name}.template.json`)))
  }
  for (const file of list(durable)) {
    rows.push(copy(file, path.join(evidence, stage, 'durable-n80', path.basename(file))))
  }
  rows.push(copy(path.join(edition, 'book.json'), path.join(evidence, stage, 'edition-book.json')))
  write(path.join(evidence, `${stage}.manifest.json`), { observedAt: new Date().toISOString(), rows })
}
function withoutStatus(document) {
  const result = structuredClone(document)
  delete result.status
  return result
}
function invariant(stage) {
  const comparisons = []
  for (const name of ['lesson', 'exercises']) {
    const original = json(path.join(evidence, 'before', `${name}.template.json`))
    for (const file of [path.join(templates, `${name}.template.json`), path.join(durable, `${name}.json`)]) {
      const current = json(file)
      assert.deepEqual(withoutStatus(current), withoutStatus(original), `Non-status change: ${file}`)
      comparisons.push({ ...descriptor(file), status: current.status, nonStatusFieldsUnchanged: true })
    }
  }
  for (const row of json(path.join(evidence, 'before.manifest.json')).protected) {
    assert.equal(sha(row.path), row.sha256, `Protected bytes changed: ${row.path}`)
  }
  write(path.join(evidence, `${stage}.invariants.json`), {
    comparisons,
    protectedUnchanged: true,
    scope: 'Byte/JSON provenance only; no mathematical or semantic re-review.',
  })
}
function run(name, argv, cwd = repo, extraEnv = {}) {
  const command = path.join(evidence, `${name}.argv.json`)
  assert(!fs.existsSync(command), `${name} already invoked; no automatic repeat`)
  const env = { ...process.env, PLAYWRIGHT_HTML_OPEN: 'never', PYTHONDONTWRITEBYTECODE: '1', ...extraEnv }
  delete env.PWDEBUG
  write(command, { argv, cwd, startedAt: new Date().toISOString(), envOverrides: {
    PWDEBUG: null, PLAYWRIGHT_HTML_OPEN: 'never', PYTHONDONTWRITEBYTECODE: '1', ...extraEnv,
  } })
  const result = spawnSync(argv[0], argv.slice(1), { cwd, env, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 })
  fs.writeFileSync(path.join(evidence, `${name}.stdout.txt`), result.stdout || '', { flag: 'wx' })
  fs.writeFileSync(path.join(evidence, `${name}.stderr.txt`), result.stderr || '', { flag: 'wx' })
  write(path.join(evidence, `${name}.result.json`), {
    finishedAt: new Date().toISOString(), exit: result.status, signal: result.signal,
    error: result.error ? String(result.error) : null,
    stdout: descriptor(path.join(evidence, `${name}.stdout.txt`)),
    stderr: descriptor(path.join(evidence, `${name}.stderr.txt`)),
  })
  console.log(`${name}: exit ${result.status}`)
  if (result.stdout) console.log(result.stdout.length > 1600 ? result.stdout.slice(0, 1600) + '\n[Full stdout retained]' : result.stdout)
  if (result.stderr) console.error(result.stderr)
  assert.equal(result.status, 0, `${name} failed; retained, no retry`)
}
const action = process.argv[2]
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const p2c = path.join(repo, '.claude/skills/ld-s10y-lesson/tools/p2c.py')
const args = ['--book', '10c', '--edition', 'modern-us-neutral', '--lesson', lesson]
if (action === 'snapshot') {
  const expected = {
    lesson: '4fe86dbb51c4668aa69e60a229941318ac26500ff5dddde4b81e2d4b146f6d39',
    exercises: '8a35b97edf24c8111f54c22ae5ec80b8a9d6dc516f19a2c84e86903e4b9db387',
  }
  for (const [name, hash] of Object.entries(expected)) {
    for (const file of [path.join(templates, `${name}.template.json`), path.join(durable, `${name}.json`)]) {
      assert.equal(sha(file), hash)
      assert.equal(json(file).status, 'draft')
    }
  }
  assert.deepEqual(fs.readdirSync(durable).sort(), ['exercises.json', 'lesson.json'])
  assert(!fs.existsSync(render), 'Preserve earlier render; do not rerun')
  assert(!fs.existsSync(offline), 'Preserve earlier offline evidence; do not rerun')
  const approval = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/batch007-n80-figures')
  const retention = json(path.join(approval, 'retention.json'))
  assert.equal(sha(path.join(approval, retention.independentReview.path)), '006a9454da2230c1e57dc160a78f7378969bd69bb2807228ed69bb784d69eadd')
  const protectedFiles = [
    ...retention.promotions.flatMap(row => row.outputs.map(output => path.join(repo, output.path))),
    path.join(repo, '.claude/skills/ld-s10y-lesson/tools/edition.py'),
    path.join(repo, '.claude/skills/ld-s10y-lesson/tools/render_lesson.js'),
    path.join(ticket, 'bind-approved-figure-manifest.mjs'),
    path.join(ticket, 'offline-check.mjs'),
    path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10c/lessons', lesson, 'lesson.json'),
    path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10c/lessons', lesson, 'exercises.json'),
  ]
  for (const row of retention.promotions.flatMap(row => row.outputs)) assert.equal(sha(path.join(repo, row.path)), row.sha256)
  snapshot('before')
  const file = path.join(evidence, 'before.manifest.json')
  const document = json(file)
  document.protected = protectedFiles.map(descriptor)
  // The snapshot manifest is amended only during its initial creation.
  fs.writeFileSync(file, JSON.stringify(document, null, 2) + '\n')
  copy(path.join(ticket, 'bind-approved-figure-manifest.mjs'), path.join(evidence, 'bind-approved-used.mjs'))
  copy(path.join(ticket, 'offline-check.mjs'), path.join(evidence, 'offline-check-used.mjs'))
  console.log(`Before snapshot: ${document.rows.length} files; protected bindings retained`)
} else if (action === 'bind') {
  invariant('before-bind')
  run('bind-approved-first', ['node', path.join(ticket, 'bind-approved-figure-manifest.mjs'), lesson], repo, { FIGURE_BOOK: '10c' })
  snapshot('after-bind')
  invariant('after-bind')
} else if (action === 'finalize') {
  assert.equal(json(path.join(evidence, 'bind-approved-first.result.json')).exit, 0)
  snapshot('before-finalize')
  run('adapt-finalize-first', [python, p2c, 'adapt-finalize', ...args])
  snapshot('after-finalize')
  invariant('after-finalize')
  const before = json(path.join(evidence, 'before-finalize', 'edition-book.json'))
  const after = json(path.join(edition, 'book.json'))
  const oldRows = before.lessons.filter(row => row.id !== lesson)
  assert.deepEqual(after.lessons.filter(row => row.id !== lesson), oldRows)
  assert.equal(after.lessons.filter(row => row.id === lesson).length, 1)
  assert.deepEqual({ ...before, lessons: [] }, { ...after, lessons: [] })
  write(path.join(evidence, 'edition-index-diff.json'), {
    onlyAddedLesson: lesson, allOtherRowsAndBookFieldsUnchanged: true,
    before: descriptor(path.join(evidence, 'before-finalize', 'edition-book.json')),
    after: descriptor(path.join(edition, 'book.json')),
    row: after.lessons.find(row => row.id === lesson),
  })
} else if (action === 'render') {
  assert.equal(json(path.join(evidence, 'adapt-finalize-first.result.json')).exit, 0)
  assert(!fs.existsSync(render), 'Render already exists; no repeat')
  run('render-first', [python, p2c, 'render', ...args])
  for (const file of list(render)) copy(file, path.join(evidence, 'render-first-output', path.basename(file)))
  write(path.join(evidence, 'render-first.outputs.json'), { outputs: list(render).map(descriptor) })
} else if (action === 'offline') {
  assert.equal(json(path.join(evidence, 'render-first.result.json')).exit, 0)
  assert(!fs.existsSync(offline), 'Offline already exists; no repeat')
  run('offline-first', ['node', path.join(ticket, 'offline-check.mjs'), '10c', lesson], path.join(repo, 'app'))
  for (const file of list(offline)) copy(file, path.join(evidence, 'offline-first-output', path.basename(file)))
  write(path.join(evidence, 'offline-first.outputs.json'), { outputs: list(offline).map(descriptor) })
  invariant('after-offline')
} else {
  throw Error('Expected snapshot, bind, finalize, render or offline')
}

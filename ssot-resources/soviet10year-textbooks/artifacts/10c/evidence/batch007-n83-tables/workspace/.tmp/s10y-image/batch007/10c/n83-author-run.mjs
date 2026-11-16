import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const id = process.argv[2]
if (!['tbl-p0036-01', 'tbl-p0038-01'].includes(id)) {
  throw new Error('Only the two assigned n83 tables are permitted')
}
if (process.env.PWDEBUG || process.env.PLAYWRIGHT_HTML_OPEN !== 'never') {
  throw new Error('Run with env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never')
}
const root = process.cwd()
const dir = path.join(root, '.tmp/s10y-image/batch007/10c', id)
const attempt = path.join(dir, 'attempt-01')
if (fs.existsSync(attempt)) throw new Error('First attempt already exists; stop')
const lessonDir = path.join(
  root,
  'ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-s3-n83',
)
const python = path.join(root, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const specPath = path.join(dir, 'spec.json')
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'))
const context = JSON.parse(fs.readFileSync(path.join(dir, 'context.json'), 'utf8'))
const expectedText = context.lessons.flatMap(lesson =>
  lesson.prose.flatMap(prose =>
    prose.nearbyText.map(text => ({ lesson: lesson.lesson, text })),
  ),
)
if (JSON.stringify(spec.source.authoritativeText) !== JSON.stringify(expectedText)) {
  throw new Error('authoritativeText is not the complete exact context projection')
}
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const approved = {
  'lesson.json': 'd4db11167eea1ec208f6d30039e3b9befaa94e48fbce03e5ccedb4a7b102ff8e',
  'exercises.json': '3174f166733abd18869f76197cec5577573b6e3468e729b194b0a583af110266',
}
for (const [name, sha] of Object.entries(approved)) {
  if (hash(path.join(lessonDir, name)) !== sha) throw new Error(`Approved ${name} changed`)
}
if (hash(path.join(root, spec.source.image.path)) !== spec.source.image.sha256) {
  throw new Error('Original source identity changed')
}
fs.mkdirSync(attempt)
const inputs = [
  ['spec.json', specPath],
  ['context.json', path.join(dir, 'context.json')],
  ['approved-lesson.json', path.join(lessonDir, 'lesson.json')],
  ['approved-exercises.json', path.join(lessonDir, 'exercises.json')],
  ['original.png', path.join(root, spec.source.image.path)],
  ['source-inventory.md', path.join(root, '.intentfold/tickets/STEMROBIN-184/tmp/ana10-n83-table-author-source-inventory.md')],
]
for (const [name, file] of inputs) fs.copyFileSync(file, path.join(attempt, name))
const write = (name, value) =>
  fs.writeFileSync(path.join(attempt, name), `${JSON.stringify(value, null, 2)}\n`)
write('inputs.json', inputs.map(([name, file]) => ({
  source: path.relative(root, file),
  snapshot: name,
  sha256: hash(file),
  bytes: fs.statSync(file).size,
})))
const run = (name, executable, args, extraEnv = {}) => {
  const started = new Date().toISOString()
  const result = spawnSync(executable, args, {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, ...extraEnv },
    maxBuffer: 16 * 1024 * 1024,
  })
  fs.writeFileSync(path.join(attempt, `${name}.stdout.txt`), result.stdout || '')
  fs.writeFileSync(path.join(attempt, `${name}.stderr.txt`), result.stderr || '')
  const record = {
    executable,
    argv: args,
    cwd: root,
    environment: {
      PWDEBUG: null,
      PLAYWRIGHT_HTML_OPEN: 'never',
      ...(extraEnv.PYTHON ? { PYTHON: extraEnv.PYTHON } : {}),
    },
    started,
    finished: new Date().toISOString(),
    exit: result.status,
    signal: result.signal,
    error: result.error?.message || null,
  }
  write(`${name}.command.json`, record)
  console.log(`${id}: ${name} exit=${result.status}`)
  if (result.stdout) console.log(result.stdout.trimEnd())
  if (result.stderr) console.error(result.stderr.trimEnd())
  return result.status
}
const validateExit = run('draft-validation', python, [
  path.join(root, '.agents/skills/ld-s10y-image/scripts/validate_spec.py'),
  specPath, '--stage', 'draft', '--json',
])
if (validateExit !== 0) {
  write('outcome.json', { validateExit, renderAttempted: false, repairs: 0 })
  process.exitCode = validateExit || 1
} else {
  const renderExit = run('render', process.execPath, [
    path.join(root, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs'),
    '--spec', specPath,
    '--svg', path.join(dir, 'table.svg'),
    '--png', path.join(dir, 'table.png'),
    '--report', path.join(dir, 'table.render.json'),
  ], { PYTHON: python })
  const outputs = []
  for (const name of ['table.svg', 'table.png', 'table.render.json']) {
    const file = path.join(dir, name)
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join(attempt, name))
      outputs.push({ name, sha256: hash(file), bytes: fs.statSync(file).size })
    }
  }
  write('outcome.json', { validateExit, renderAttempted: true, renderExit, repairs: 0, outputs })
  process.exitCode = renderExit || 0
}

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const cwd = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
if (process.cwd() !== cwd) throw new Error('Unexpected working directory')
const evidence = path.dirname(fileURLToPath(import.meta.url))
const book = '6-8g'
const pages = [68, 69]
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const files = directory => fs.readdirSync(directory, { withFileTypes: true })
  .flatMap(entry => entry.isDirectory()
    ? files(path.join(directory, entry.name))
    : [path.join(directory, entry.name)])
const inventory = directory => files(directory).map(file => ({
  path: file,
  bytes: fs.statSync(file).size,
  sha256: sha(file),
}))
const locations = page => {
  const id = String(page).padStart(4, '0')
  return {
    id,
    work: path.join(cwd, '.tmp/ld-s10y-lesson', book, 'pages', id),
    durable: path.join(cwd, 'ssot-resources/soviet10year-textbooks/artifacts', book, 'pages', id),
  }
}
const snapshot = (target, page) => {
  const { work, durable } = locations(page)
  fs.mkdirSync(target, { recursive: true })
  fs.cpSync(work, path.join(target, 'prepared'), { recursive: true, errorOnExist: true, force: false })
  if (fs.existsSync(durable)) {
    fs.cpSync(durable, path.join(target, 'durable'), { recursive: true, errorOnExist: true, force: false })
  }
  const absent = ['page.md', 'page.json', 'audit.json']
    .filter(name => !fs.existsSync(path.join(durable, name)))
    .map(name => path.join(durable, name))
  fs.writeFileSync(path.join(target, 'snapshot.json'), `${JSON.stringify({
    physicalPage: page,
    capturedAt: new Date().toISOString(),
    absent,
    files: inventory(target),
  }, null, 2)}\n`)
}

if (process.argv[2] === 'baseline') {
  const target = path.join(evidence, 'before-author')
  if (fs.existsSync(target)) throw new Error('Baseline already captured')
  for (const page of pages) {
    const { durable } = locations(page)
    if (fs.existsSync(durable)) throw new Error(`Durable page ${page} already exists`)
  }
  for (const page of pages) snapshot(path.join(target, locations(page).id), page)
  const previous = path.join(cwd, 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/pages/0067/page.md')
  fs.copyFileSync(previous, path.join(target, 'p0067-tail-source.page.md'), fs.constants.COPYFILE_EXCL)
  fs.writeFileSync(path.join(target, 'bindings.json'), `${JSON.stringify({
    schema: 'STEMROBIN-184/source-author-baseline@1',
    book,
    pages,
    cwd,
    capturedAt: new Date().toISOString(),
    previousPageText: { path: previous, sha256: sha(previous) },
    files: inventory(target),
  }, null, 2)}\n`)
  console.log(`Captured before-author baseline: ${target}`)
} else {
  const page = Number(process.argv[2])
  if (!pages.includes(page)) throw new Error('Only physical pages 68-69 are authorized')
  const { id, durable } = locations(page)
  const target = path.join(evidence, id, 'attempt-01')
  if (fs.existsSync(target)) throw new Error('First attempt already captured; retry is forbidden')
  if (!fs.existsSync(path.join(durable, 'page.md'))) throw new Error('Missing faithful first draft')
  if (fs.existsSync(path.join(durable, 'audit.json')) || fs.existsSync(path.join(durable, 'page.json'))) {
    throw new Error('Page already has finalize artifacts; do not replay')
  }
  snapshot(path.join(target, 'before'), page)
  const executable = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
  const argv = ['.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize', '--book', book, '--page', String(page)]
  const executableSha256 = sha(path.join(cwd, executable))
  const p2cSha256 = sha(path.join(cwd, argv[0]))
  const startedAt = new Date().toISOString()
  const result = spawnSync(executable, argv, { cwd, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 })
  const finishedAt = new Date().toISOString()
  fs.writeFileSync(path.join(target, 'stdout.txt'), result.stdout || '')
  fs.writeFileSync(path.join(target, 'stderr.txt'), result.stderr || '')
  snapshot(path.join(target, 'after'), page)
  const record = {
    schema: 'STEMROBIN-184/source-first-finalize@1',
    book,
    physicalPage: page,
    attempt: 1,
    cwd,
    executable,
    argv,
    fullArgv: [executable, ...argv],
    executableSha256,
    p2cSha256,
    p2cSha256After: sha(path.join(cwd, argv[0])),
    startedAt,
    finishedAt,
    exitCode: result.status,
    signal: result.signal,
    spawnError: result.error?.message || null,
    status: result.status === 0 ? 'FIRST-FINALIZE-COMMAND-SUCCESS' : 'FIRST-FAIL-STOPPED-NO-RETRY',
    independentReview: 'NOT-PERFORMED-AUTHOR-ONLY',
    files: inventory(target),
  }
  fs.writeFileSync(path.join(target, 'command.json'), `${JSON.stringify(record, null, 2)}\n`)
  process.stdout.write(result.stdout || '')
  process.stderr.write(result.stderr || '')
  console.log(`CAPTURED physical ${page}; first attempt exit ${result.status}; ${target}`)
  process.exitCode = result.status === null ? 125 : result.status
}

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const page = Number(process.argv[2])
if (![54, 55].includes(page)) throw new Error('Only physical pages 54-55 are authorized')
const cwd = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
if (process.cwd() !== cwd) throw new Error('Unexpected working directory')
const evidence = path.dirname(fileURLToPath(import.meta.url))
const id = String(page).padStart(4, '0')
const work = path.join(cwd, '.tmp/ld-s10y-lesson/9-10g/pages', id)
const durable = path.join(cwd, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages', id)
const target = path.join(evidence, id, 'attempt-01')
if (fs.existsSync(target)) throw new Error('First attempt already captured; retry is forbidden')
if (!fs.existsSync(path.join(durable, 'page.md'))) throw new Error('Missing faithful first draft')
if (fs.existsSync(path.join(durable, 'audit.json')) || fs.existsSync(path.join(durable, 'page.json'))) {
  throw new Error('Page already has finalize artifacts; do not replay')
}
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const files = directory => fs.readdirSync(directory, { withFileTypes: true })
  .flatMap(entry => entry.isDirectory()
    ? files(path.join(directory, entry.name))
    : [path.join(directory, entry.name)])
fs.mkdirSync(target, { recursive: true })
fs.cpSync(work, path.join(target, 'before', 'work'), { recursive: true, errorOnExist: true, force: false })
fs.cpSync(durable, path.join(target, 'before', 'durable'), { recursive: true, errorOnExist: true, force: false })
const executable = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const argv = ['.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize', '--book', '9-10g', '--page', String(page)]
const startedAt = new Date().toISOString()
const result = spawnSync(executable, argv, { cwd, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 })
const finishedAt = new Date().toISOString()
fs.writeFileSync(path.join(target, 'stdout.txt'), result.stdout || '')
fs.writeFileSync(path.join(target, 'stderr.txt'), result.stderr || '')
fs.cpSync(work, path.join(target, 'after', 'work'), { recursive: true, errorOnExist: true, force: false })
fs.cpSync(durable, path.join(target, 'after', 'durable'), { recursive: true, errorOnExist: true, force: false })
const exitCode = result.status === null ? 125 : result.status
const record = {
  schema: 'STEMROBIN-184/source-first-finalize@1',
  book: '9-10g',
  physicalPage: page,
  attempt: 1,
  cwd,
  executable,
  argv,
  executableSha256: sha(path.join(cwd, executable)),
  p2cSha256: sha(path.join(cwd, argv[0])),
  startedAt,
  finishedAt,
  exitCode,
  signal: result.signal,
  spawnError: result.error?.message || null,
  status: exitCode === 0 ? 'FIRST-FINALIZE-COMMAND-SUCCESS' : 'FIRST-FAIL-STOPPED-NO-RETRY',
  files: files(target).map(file => ({
    path: path.relative(cwd, file),
    bytes: fs.statSync(file).size,
    sha256: sha(file),
  })),
}
fs.writeFileSync(path.join(target, 'command.json'), `${JSON.stringify(record, null, 2)}\n`)
process.stdout.write(result.stdout || '')
process.stderr.write(result.stderr || '')
console.log(`CAPTURED physical ${page}; first attempt exit ${exitCode}; ${path.relative(cwd, target)}`)
process.exitCode = exitCode

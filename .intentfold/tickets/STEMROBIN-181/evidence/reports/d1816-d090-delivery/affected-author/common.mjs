import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

export const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), repo)
export const output = '.tmp/STEMROBIN-181/d1816-d092'
export const evidence = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d092-n128-affected-author'
export const lessonId = 'phy9-c2-s6-n128'
export const editions = ['modern-us-neutral', 'modern-us-neutral-en']
export const changedBlocks = [8, 9, 10, 12]
export const load = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
export const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
export const bind = (file) => {
  const bytes = fs.readFileSync(file)
  return { path: path.resolve(repo, file), sha256: hash(bytes), bytes: bytes.length }
}
export const ensureOwned = (file) => {
  const absolute = path.resolve(repo, file)
  assert.ok([output, evidence].some((root) =>
    absolute.startsWith(`${path.resolve(repo, root)}/`)), `Unowned write: ${file}`)
}
export const write = (file, bytes) => {
  ensureOwned(file)
  assert.ok(!fs.existsSync(file), `Refusing to overwrite: ${file}`)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, bytes, { flag: 'wx' })
}
export const dump = (file, data) => write(file, `${JSON.stringify(data, null, 2)}\n`)
export const copy = (source, destination) => {
  ensureOwned(destination)
  assert.ok(!fs.existsSync(destination), `Refusing to overwrite: ${destination}`)
  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL)
  fs.chmodSync(destination, 0o644)
  assert.equal(bind(source).sha256, bind(destination).sha256)
}
export const template = (edition) =>
  `${output}/work/adapt/9p/${edition}/lessons/${lessonId}/lesson.template.json`
export const oldTemplate = (edition) =>
  `.tmp/STEMROBIN-181/d1816-d079/work/adapt/9p/${edition}/lessons/${lessonId}/lesson.template.json`
export const currentFigure = (id) =>
  `.tmp/STEMROBIN-181/d1816-${id === 'fig-290' ? 'd086' : 'd079'}/modern/${id}`
export const run = (name, argv) => {
  const receiptPath = `${evidence}/native/${name}/receipt.json`
  assert.ok(!fs.existsSync(receiptPath), `Existing call: ${name}`)
  const started = new Date().toISOString()
  const result = spawnSync(argv[0], argv.slice(1), {
    cwd: repo, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  const stdout = `${evidence}/native/${name}/stdout.txt`
  const stderr = `${evidence}/native/${name}/stderr.txt`
  write(stdout, result.stdout ?? '')
  write(stderr, result.stderr ?? '')
  const receipt = {
    workdir: repo, argv, started, finished: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
    stdout: bind(stdout), stderr: bind(stderr),
  }
  dump(receiptPath, receipt)
  return receipt
}

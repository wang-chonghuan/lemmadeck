import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

export const R = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
export const OWN = path.join(R, '.intentfold/tickets/STEMROBIN-188/tmp/n29-fig187189-author-first-06')
export const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
export function bind(p) {
  const s = fs.statSync(p)
  return { path: p, sha256: hash(p), bytes: s.size, mode: (s.mode & 0o777).toString(8).padStart(4, '0'), birthtime: s.birthtime.toISOString(), mtime: s.mtime.toISOString() }
}
export function write(p, value) {
  if (!path.resolve(p).startsWith(OWN + '/')) throw new Error('outside own root')
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
}
export function seal(id) {
  if (process.cwd() !== R) throw new Error('wrong cwd')
  const p = path.join(OWN, 'first', `${id}.FIRST.json`)
  const first = JSON.parse(fs.readFileSync(p))
  if (hash(first.source.path) !== first.source.sha256) throw new Error('source hash drift')
  fs.chmodSync(p, 0o444)
  const record = { status: 'SEALED_SOURCE_FIRST_AUTHOR_ONLY', sealedAt: new Date().toISOString(), cwd: process.cwd(), inventory: bind(p), source: bind(first.source.path), sourceImageOpenedOnceBeforeSeal: true, openingTimestamp: 'not exposed by view_image; source inventory filesystem timestamps and actual seal timestamp retained', newFigureSpecAuthoredBeforeSeal: false }
  const target = path.join(OWN, 'first', `${id}.seal.json`)
  write(target, record)
  fs.chmodSync(target, 0o444)
  console.log(JSON.stringify({ inventory: bind(p), seal: bind(target) }))
}
export function run(stage, argv, outputs = []) {
  const stem = path.join(OWN, 'receipts', stage)
  if (fs.existsSync(stem + '.json')) throw new Error('stage already executed; use an affected repair stage name')
  const startedAt = new Date().toISOString()
  const helperBefore = bind(new URL(import.meta.url).pathname)
  const helpersBefore = argv.filter(p => path.isAbsolute(p) && fs.existsSync(p) && fs.statSync(p).isFile() && /\.(mjs|js|py)$/.test(p)).map(bind)
  const result = spawnSync(argv[0], argv.slice(1), { cwd: R, encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } })
  write(stem + '.stdout', result.stdout || '')
  write(stem + '.stderr', result.stderr || '')
  const receipt = { stage, cwd: R, argv, startedAt, completedAt: new Date().toISOString(), exitCode: result.status, signal: result.signal, error: result.error?.message || null, helperBefore, helpersBefore, streams: { stdout: bind(stem + '.stdout'), stderr: bind(stem + '.stderr') }, outputs: outputs.filter(p => fs.existsSync(p)).map(bind), imageCountersAtCall: fs.existsSync(path.join(OWN, 'image-ledger.json')) ? JSON.parse(fs.readFileSync(path.join(OWN, 'image-ledger.json'))) : null }
  write(stem + '.json', receipt)
  if (result.status !== 0) {
    write(path.join(OWN, 'failures', stage + '.helper-before.mjs'), fs.readFileSync(new URL(import.meta.url), 'utf8'))
    for (const helper of helpersBefore) write(path.join(OWN, 'failures', `${stage}.${path.basename(helper.path)}.before`), fs.readFileSync(helper.path, 'utf8'))
    write(path.join(OWN, 'failures', stage + '.json'), receipt)
    throw new Error(`${stage} failed; exact receipt and helper snapshot preserved`)
  }
  console.log(JSON.stringify({ stage, exitCode: result.status, receipt: bind(stem + '.json'), stdout: result.stdout }))
  return receipt
}
if (process.argv[2] === 'seal') seal(process.argv[3])

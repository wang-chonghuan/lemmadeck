import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

export const W = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
export const A = path.join(W, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d057-n22-author')
export const F = path.join(W, '.tmp/STEMROBIN-181/d1816-d057/n22-figure-author')
export const T = path.join(W, '.tmp/STEMROBIN-181/d1816-d057/n22-work/adapt/10p')
export const id = 'phy10-c1-s3-n22'
export const editions = ['modern-us-neutral', 'modern-us-neutral-en']
export const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
export const load = p => JSON.parse(fs.readFileSync(p, 'utf8'))
export function save(p, data) {
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', { flag: 'wx' })
}
export function receipt(name, command, args, options = {}) {
  const target = path.join(A, 'receipts', name)
  if (fs.existsSync(target + '.json')) throw new Error(`Already executed: ${name}`)
  const started = new Date().toISOString()
  const r = spawnSync(command, args, {
    cwd: W, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, ...options,
  })
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target + '.stdout.txt', r.stdout || '', { flag: 'wx' })
  fs.writeFileSync(target + '.stderr.txt', r.stderr || '', { flag: 'wx' })
  const data = {
    command: [command, ...args], cwd: W, started, ended: new Date().toISOString(),
    exitCode: r.status, signal: r.signal, error: r.error?.message ?? null,
    stdout: { path: target + '.stdout.txt', sha256: hash(target + '.stdout.txt') },
    stderr: { path: target + '.stderr.txt', sha256: hash(target + '.stderr.txt') },
  }
  save(target + '.json', data)
  console.log(JSON.stringify(data))
  return r
}
if (process.argv[2] === 'run') receipt(process.argv[3], process.argv[4], process.argv.slice(5))

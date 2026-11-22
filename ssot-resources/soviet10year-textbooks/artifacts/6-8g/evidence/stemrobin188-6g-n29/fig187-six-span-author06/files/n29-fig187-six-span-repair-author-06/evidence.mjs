import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

export const root = path.dirname(fileURLToPath(import.meta.url))
export const repo = path.resolve(root, '../../../../..')
export const inputPath = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n29-fig187-label-repair-author-collection-06/six-span-repair-author-input.json')
export const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
export const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
export function record(file) {
  const stat = fs.statSync(file)
  return {
    path: path.resolve(file), sha256: hash(fs.readFileSync(file)), bytes: stat.size,
    mode: (stat.mode & 0o777).toString(8).padStart(4, '0'),
    birthtime: stat.birthtime.toISOString(), mtime: stat.mtime.toISOString(),
    ctime: stat.ctime.toISOString(),
  }
}
export function owned(file) {
  const target = path.resolve(root, file)
  assert(target.startsWith(`${root}/`), 'write outside owned root')
  return target
}
export function write(file, value) {
  const target = owned(file)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
  return record(target)
}
export function charge(kind, extra = {}) {
  const target = owned('image-ledger.json')
  const ledger = read(target)
  assert(ledger.chargedImages < 8, 'fresh image budget exhausted')
  ledger.events.push({ ordinal: ledger.chargedImages + 1, at: new Date().toISOString(), kind, charge: 1, ...extra })
  ledger.chargedImages++
  ledger.cumulativeChargedImages = 16 + ledger.chargedImages
  fs.writeFileSync(target, `${JSON.stringify(ledger, null, 2)}\n`)
}
export function run(name, argv, inputs, outputs, helpers = []) {
  const helperFiles = [...new Set([fileURLToPath(import.meta.url), ...helpers])]
  const beforeBytes = new Map([...inputs, ...helperFiles].map((file) => [file, fs.readFileSync(file)]))
  const before = {
    cwd: repo, argv, startedAt: new Date().toISOString(),
    inputs: inputs.map(record), helpers: helperFiles.map(record),
    counters: read(owned('image-ledger.json')),
  }
  write(`receipts/${name}.before.json`, before)
  const result = spawnSync(argv[0], argv.slice(1), {
    cwd: repo, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
  })
  const streams = {}
  for (const channel of ['stdout', 'stderr']) {
    const file = owned(`receipts/${name}.${channel}`)
    fs.writeFileSync(file, result[channel] || '', { flag: 'wx' })
    streams[channel] = { ...record(file), text: result[channel] || '' }
  }
  const receipt = {
    ...before, completedAt: new Date().toISOString(), exitCode: result.status,
    signal: result.signal, error: result.error?.message || null, streams,
    inputsAfter: inputs.map(record),
    outputs: outputs.filter(fs.existsSync).map(record),
    countersAfter: read(owned('image-ledger.json')),
  }
  write(`receipts/${name}.json`, receipt)
  if (result.status !== 0) {
    const snapshotRoot = owned(`failures/${name}`)
    fs.mkdirSync(snapshotRoot, { recursive: true })
    const snapshots = [...inputs, ...helperFiles, ...outputs.filter(fs.existsSync)].map((file, index) => {
      const target = path.join(snapshotRoot, `${index}-${path.basename(file)}.before`)
      fs.writeFileSync(target, beforeBytes.get(file) || fs.readFileSync(file), { flag: 'wx' })
      fs.chmodSync(target, 0o444)
      return { original: record(file), snapshot: record(target) }
    })
    write(`failures/${name}/failure.json`, { receipt, snapshots, beforeInputCounters: before.counters })
    throw new Error(`${name} failed with exitCode ${result.status}; exact call retained`)
  }
  return receipt
}

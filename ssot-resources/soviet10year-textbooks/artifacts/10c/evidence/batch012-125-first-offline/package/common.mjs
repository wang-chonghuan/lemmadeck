import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'

export const root = path.dirname(fileURLToPath(import.meta.url))
export const repo = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
export const lessonId = 'ana10-c9-s2-n125'
export const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex')
export function fileReceipt(file) {
  const bytes = fs.readFileSync(file)
  return { path: path.resolve(file), bytes: bytes.length, sha256: sha256(bytes) }
}
export function save(file, bytes) {
  const target = path.resolve(root, file)
  if (!target.startsWith(`${root}/`)) throw new Error('Write outside owned scratch')
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, bytes, { flag: 'wx' })
  return fileReceipt(target)
}
export const saveJson = (file, value) => save(file, `${JSON.stringify(value, null, 2)}\n`)
export const json = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))
const lessonRoot = `.intentfold/tickets/STEMROBIN-184/tmp/production-assembly10c125-corrected/10c/editions/modern-us-neutral/lessons/${lessonId}`
const renderRoot = `.intentfold/tickets/STEMROBIN-184/tmp/production-modern10c125/render/10c/modern-us-neutral/${lessonId}`
export const inputs = [
  ['lesson.json', lessonRoot, '65454edd9207564e335e7a7b7015de1cfb5ec7384896b7fb0d1204b62bb068bf'],
  ['exercises.json', lessonRoot, '9b769a226b2f09217ef26d2b0b4da980776ead3bd30dca8b8dd87ec9a3eae386'],
  ['figures.json', lessonRoot, 'f64c87686e8b4c0f30b1862a3f9ea7fcc8264480753d0bfc8cfec46bde2b7747'],
  ['adaptation.audit.json', lessonRoot, 'c20ce6a1c4b66facb107c0e1fa9caccf63d7fef584451b494cc9ee6724ac8377'],
  ['text.html', renderRoot, '8a6aacfce44e719388eb98eb435bb6fadd980d5de2a868a772e42372df63e264'],
  ['exercises.html', renderRoot, 'b96441ec2bd7b96e0f5c31690490e0563247f14d582b9c645f93199077fdf203'],
].map(([name, directory, expectedSha256]) => ({
  name, source: path.join(repo, directory, name), expectedSha256,
  snapshot: path.join(root, 'inputs', name),
}))

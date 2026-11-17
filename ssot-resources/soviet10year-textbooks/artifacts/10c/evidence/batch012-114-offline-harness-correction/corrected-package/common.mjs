import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'

export const root = path.dirname(fileURLToPath(import.meta.url))
export const repo = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
export const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex')
export function fileReceipt(file) {
  const bytes = fs.readFileSync(file)
  return { path: path.resolve(file), bytes: bytes.length, sha256: sha256(bytes) }
}
export function save(file, bytes) {
  const target = path.resolve(root, file)
  if (!target.startsWith(`${root}/`)) throw new Error('Write outside owned evidence root')
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, bytes, { flag: 'wx' })
  return fileReceipt(target)
}
export const saveJson = (file, value) => save(file, `${JSON.stringify(value, null, 2)}\n`)
export const json = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))
export const lessonId = 'ana10-c8-s2-n114'
const lessonRoot = `.intentfold/tickets/STEMROBIN-184/tmp/production-assembly10c114-heading-fixed/10c/editions/modern-us-neutral/lessons/${lessonId}`
const htmlRoot = `.intentfold/tickets/STEMROBIN-184/tmp/production-modern10c114/render/10c/modern-us-neutral/${lessonId}`
export const inputs = [
  ['lesson.json', lessonRoot, 30165, 'b16249580939068e2b88b2135ba73cdeb65071f6d75443361398aa2555d79f42'],
  ['exercises.json', lessonRoot, 425, 'b8a8f96bceb1d07ade671c176a939593a09d2cabbd7ae80c811872be115417c3'],
  ['figures.json', lessonRoot, 155, '4f4d4b1787c3d2ca9c6922621e442b35c2aa3e79fda42d69ea251f54e492ca0d'],
  ['adaptation.audit.json', lessonRoot, 1505, '0e5538e9f37135dc39b54ba64b5f62f97e9347f599ac53b242a2396370b102d0'],
  ['text.html', htmlRoot, 515855, '0259c8d9ba3fec4caf9fe4cb4836cf4d4a92c811c3c3a0207da81ff35eaaa605'],
  ['exercises.html', htmlRoot, 371895, '5ec3ced356dc4ce599657894adef936c77c6afa347bf3f52e9a7a68cd417429d'],
].map(([name, directory, bytes, hash]) => ({
  name, original: path.join(repo, directory, name), expectedBytes: bytes, expectedSha256: hash,
  frozen: path.join(root, 'inputs', name),
}))
export const guidance = [
  '.intentfold/readme.md',
  '.intentfold/charter/operations.md',
  '.intentfold/charter/engineering.md',
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.claude/skills/ld-s10y-lesson/SKILL.md',
  '.intentfold/tickets/STEMROBIN-184/tmp/offline-check.mjs',
  '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js',
  'app/node_modules/playwright-core/lib/tools/cli-client/skill/SKILL.md',
].map((file) => path.join(repo, file))

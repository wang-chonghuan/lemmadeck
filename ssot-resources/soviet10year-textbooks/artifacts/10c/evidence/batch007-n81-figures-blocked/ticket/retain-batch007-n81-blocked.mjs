import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const root = 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/batch007-n81-figures-blocked'
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const manifestPath = '.tmp/s10y-image/batch007/10c/fig-12/author-package-hashes.json'
assert(!fs.existsSync(root), 'Preserve earlier retention')
assert.equal(hash(manifestPath), '5a031de96167b0849f23055a6cfe533593a46154146f75466a803958bf37090a')
assert.equal(hash(`${ticket}/ana10-n81-figures-independent-review.md`),
  '829570cea329a92d006e22f55916224fec2f41d98b66e20a3cbd554379c707cd')
const manifest = JSON.parse(fs.readFileSync(manifestPath))
assert.equal(manifest.allRawFiles.length, 331)
const copied = []
const copy = (from, to, expected = hash(from)) => {
  assert(fs.lstatSync(from).isFile(), 'Retain regular files only')
  const original = fs.readFileSync(from)
  assert.equal(hash(from), expected)
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  assert(fs.readFileSync(to).equals(original))
  copied.push({ path: path.relative(root, to), sha256: expected, bytes: original.length })
}
for (const entry of manifest.allRawFiles) {
  const prefix = '.tmp/s10y-image/batch007/10c/'
  assert(entry.path.startsWith(prefix), 'Only assigned scratch figure evidence')
  copy(entry.path, `${root}/figures/${entry.path.slice(prefix.length)}`, entry.sha256)
}
copy(manifestPath, `${root}/author-package-hashes.json`)
for (const name of [
  'ana10-n81-modern-author.md', 'ana10-n81-parent-text-review.md',
  'ana10-n81-modern-text-contract.stdout.json', 'ana10-n81-modern-text-contract.stderr.txt',
  'ana10-n81-modern-prose-flow.stdout.txt', 'ana10-n81-modern-prose-flow.stderr.txt',
  'ana10-n81-figure-author-source-inventory.md',
  'ana10-n81-independent-figure-source-first.md',
  'ana10-n81-modern-figures-author.md', 'ana10-n81-figures-independent-review.md',
  'retain-batch007-n81-blocked.mjs',
]) copy(`${ticket}/${name}`, `${root}/ticket/${name}`)
for (const name of ['lesson', 'exercises']) {
  copy(`.tmp/ld-s10y-lesson/adapt/10c/modern-us-neutral/lessons/ana10-c6-s2-n81/${name}.template.json`,
    `${root}/approved-text-draft/${name}.template.json`)
}
fs.writeFileSync(`${root}/retention.json`, JSON.stringify({
  status: 'BLOCKED: incomplete n81; no candidate promoted or lesson completed',
  independentReviewSha256: '829570cea329a92d006e22f55916224fec2f41d98b66e20a3cbd554379c707cd',
  figure13: 'Initial machinePASS but wrong-side marker; sole repair collisionFAIL; terminal allowance exhausted. No accepted initial alternative or further repair.',
  otherFigures: 'Seven origin-notation HOLD;18 also source-label-attribution REVISE. Narrow curve/topology/legibility observations are not semantic approval.',
  renders: 12,
  repairs: ['fig-12', 'fig-13', 'fig-17'],
  figureApprovals: 0,
  completedLessons: 0,
  basis: 'Original independent gate reused; byte-copy retention only. No render, source review, finalization, DB or publication.',
  copied,
}, null, 2) + '\n')
console.log(`n81 blocked evidence: ${copied.length} files retained byte-identically; no promotion`)

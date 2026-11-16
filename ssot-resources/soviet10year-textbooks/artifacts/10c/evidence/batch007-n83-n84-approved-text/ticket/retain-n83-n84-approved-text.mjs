import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const base = 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence'
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const inputs = [
  'ana10-n83-parent-source-first.md', 'ana10-n83-author-source-solve.md',
  'ana10-n83-parent-math-comparison.md', 'ana10-n83-modern-author.md',
  'ana10-n83-modern-author-evidence', 'ana10-n83-parent-text-review.md',
  'ana10-n84-parent-math-source-first.md', 'ana10-n84-author-math-source-first.md',
  'ana10-n84-parent-math-comparison.md', 'n84-source-erratum-once.mjs',
  'n84-source-erratum', 'source-10c-p41-erratum-metadata-only-review.md',
  'ana10-n84-modern-author.md', 'ana10-n84-modern-author-evidence',
  'ana10-n84-parent-text-review.md', 'stage-batch007-approved-text.mjs',
  'prepare-n83-table-contexts-once.mjs', 'n83-table-contexts',
  'retain-n83-n84-approved-text.mjs',
]
const root = `${base}/batch007-n83-n84-approved-text`
assert(!fs.existsSync(root), 'Preserve every initial text/math/source freeze')
for (const name of inputs) assert(fs.existsSync(`${ticket}/${name}`), name)
const copied = []
const copy = (from, to) => {
  const stat = fs.lstatSync(from)
  if (stat.isDirectory()) {
    fs.mkdirSync(to, { recursive: true })
    for (const entry of fs.readdirSync(from)) copy(path.join(from, entry), path.join(to, entry))
    return
  }
  assert(stat.isFile(), from)
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(from), hash(to))
  copied.push({ path: path.relative(root, to), sha256: hash(to) })
}
fs.mkdirSync(root, { recursive: true })
for (const name of inputs) copy(`${ticket}/${name}`, `${root}/ticket/${name}`)
for (const id of ['tbl-p0036-01', 'tbl-p0038-01']) {
  copy(`.tmp/s10y-image/batch007/10c/${id}/context.json`, `${root}/contexts/${id}.json`)
}
fs.writeFileSync(`${root}/retention.json`, JSON.stringify({
  status: 'n83/n84 sole text approvals and math/source erratum evidence retained as DRAFT only',
  n83: '30 objects/48 tasks preserved;47 determinate results and101 conditional-only comparison. No single101 parse/key, table approval, formal answers or choice approval.',
  n84: '8 objects/0 tasks preserved;one exact source-bound g(y)->g(y0) correction and strictness explanation. Source literal remains; original terminology premise not independently established.',
  source41: 'Only meta.errata/audit.errata changed; actual affected finalize21/21 exit0; original source reviewer metadata-only limitedPASS. No second mathematical review.',
  limit: 'No modern figure/finalize/display/complete-lesson approval here; initial/author/independent chronology and source UNKNOWNs preserved.',
  copied,
}, null, 2) + '\n')
console.log(`${copied.length} approved text/math/source-erratum files retained byte-identically`)

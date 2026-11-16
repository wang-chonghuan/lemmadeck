import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const root = 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/batch007-source-through34'
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
assert(!fs.existsSync(root))
const bookSha = '6e182565f1c54bbcfd2e112755262887d73979f7c4874e96d1bcc2826bfb468c'
assert.equal(hash('ssot-resources/soviet10year-textbooks/artifacts/10c/book.json'), bookSha)
const inputs = [
  'source-10c-p19-p22-author.md', 'source-10c-p23-p26-author.md',
  'source-review-10c-p23-p26.md', 'source-10c-p27-p30-author.md',
  'source-review-10c-p27-p30.md', 'source-10c-p26-p29-changed-only-review.md',
  'source-10c-p27-p29-targeted-repair.md', 'source-10c-p27-p29-targeted-repair-evidence',
  'source-10c-p31-p34-author.md', 'source-10c-p31-p34-evidence',
  'source-review-10c-p31-p34-source-first.md', 'source-review-10c-p31-p34.md',
  'source-10c-p31-p34-targeted-repair.md', 'source-10c-p31-p34-targeted-repair-evidence',
  'source-10c-p31-p34-changed-only-review.md',
  '10c-p19-p20-p22-before-source-repair', '10c-p23-p25-before-count-metadata',
  '10c-p23-p25-count-diagnostic', '10c-p23-p25-count-diagnostic.md',
  '10c-p26-phase-metadata', '10c-p27-count-diagnostic', '10c-p27-count-diagnostic.md',
  'assembly-10c-p7-p34', 'assembly-10c-p7-p34-work', 'vectorize-10c-p29-p33',
  'assemble-ana10-through19.mjs', 'assemble-ana10-through19.before-through34.mjs',
  'rebind-10c-through34', 'rebind-book-trace.py',
  'rebind-book-trace.before-scalar-serialization.py', 'rebind-choice-provenance-once.py',
  'provenance-before-current/10c', 'retain-source-10c-through34.mjs',
]
for (const name of inputs) assert(fs.existsSync(`${ticket}/${name}`), name)
const copied = []
const copy = (from, to) => {
  const stat = fs.lstatSync(from)
  if (stat.isDirectory()) {
    fs.mkdirSync(to, { recursive: true })
    for (const entry of fs.readdirSync(from)) copy(path.join(from, entry), path.join(to, entry))
    return
  }
  assert(stat.isFile(), `Not a regular retained evidence file: ${from}`)
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(from), hash(to))
  copied.push({ path: path.relative(root, to), sha256: hash(to) })
}
fs.mkdirSync(root, { recursive: true })
for (const name of inputs) copy(`${ticket}/${name}`, `${root}/ticket/${name}`)
for (let page = 20; page <= 34; page++) {
  const id = String(page).padStart(4, '0')
  copy(`.tmp/ld-s10y-lesson/10c/pages/${id}`, `${root}/source-pixels/${id}`)
}
fs.writeFileSync(`${root}/retention.json`, JSON.stringify({
  status: 'Approved source closure7-34 and current book-trace evidence retained; only n79 is a complete new modern lesson',
  bookSha256: bookSha,
  sourceExerciseCount: 68,
  sourceFigureCount: 20,
  n81: 'Source60-68/nine figures closed. Modern templates prepared once, content gates pending.',
  n82: 'Physical34 source beginning only, no complete modern lesson claim.',
  sourceBasis: 'Sole full source reviews reused;31/33 prefix and33/34 notes affected-only PASS. Initial31 charset/count failures and all existing original evidence retained.',
  priorChoices: '75-79 book trace/dependent string digests only, all other bytes and semantic records unchanged. Each current-binding validator once exit0; no mathematical/display review repeated.',
  limitations: 'Source glyph18/26/33/34 and n80 task55 limits remain. No DB, publication, merge, closure, deployment or formal handoff.',
  copied,
}, null, 2) + '\n')
console.log(`Source-through34: ${copied.length} evidence files retained byte-identically`)

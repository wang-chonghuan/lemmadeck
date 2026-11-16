import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const root = 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/batch007-source-through42'
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bookSha = '93d6d63d1572316e8ecda7b296911b593279a6a425be0261939d619e924f1565'
assert.equal(hash('ssot-resources/soviet10year-textbooks/artifacts/10c/book.json'), bookSha)
const inputs = [
  'source-10c-p35-p38-author.md', 'source-10c-p35-p38-evidence',
  'source-review-10c-p35-p38-source-first.md', 'source-review-10c-p35-p38.md',
  'source-10c-p38-metadata-changed-only-review.md', '10c-p38-count-diagnostic',
  'diagnose-10c-p38-count.py', 'inspect-10c-p38-extra-bands.py',
  'finalize-10c-p38-count-metadata.mjs', 'test-10c-p38-count-exclusions.py',
  'source-10c-p39-p42-author.md', 'source-10c-p39-p42-evidence',
  'source-review-10c-p39-p42-source-first.md', 'source-review-10c-p39-p40.md',
  'source-10c-p41-p42-author.md', 'source-10c-p41-p42-evidence',
  'source-review-10c-p41-p42.md', 'source-10c-p40-count-diagnostic.md',
  '10c-p40-count-diagnostic', 'source-10c-p40-metadata-changed-only-review.md',
  'finalize-10c-p40-count-metadata.mjs',
  'advance-10c-through35.mjs', 'advance-10c-through35',
  'advance-10c-through42.mjs', 'advance-10c-through42',
  'advance-10c-through42-wrapper-failure.md',
  'promote-existing-assembly-10c-through42.mjs',
  'assemble-ana10-through19.mjs', 'assemble-ana10-through19.before-through35.mjs',
  'assemble-ana10-through19.before-through42.mjs',
  'assembly-10c-p7-p35', 'assembly-10c-p7-p42',
  'vectorize-batch007-approved-precursors.mjs',
  'rebind-10c-through42-once.mjs', 'rebind-10c-through42',
  'rebind-book-trace.py', 'rebind-choice-provenance-once.py',
  'provenance-before-current/10c',
  'retain-source-10c-through42.mjs',
]
assert(!fs.existsSync(root), 'Retain first-copy evidence rather than overwrite')
for (const name of inputs) assert(fs.existsSync(`${ticket}/${name}`), name)
const copied = []
const copy = (from, to) => {
  const stat = fs.lstatSync(from)
  if (stat.isDirectory()) {
    fs.mkdirSync(to, { recursive: true })
    for (const entry of fs.readdirSync(from)) copy(path.join(from, entry), path.join(to, entry))
    return
  }
  assert(stat.isFile(), `Only regular evidence files: ${from}`)
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(from), hash(to))
  copied.push({ path: path.relative(root, to), sha256: hash(to) })
}
fs.mkdirSync(root, { recursive: true })
for (const name of inputs) copy(`${ticket}/${name}`, `${root}/ticket/${name}`)
for (let page = 35; page <= 42; page++) {
  const id = String(page).padStart(4, '0')
  copy(`.tmp/ld-s10y-lesson/10c/pages/${id}`, `${root}/source-pixels/${id}`)
}
fs.writeFileSync(`${root}/retention.json`, JSON.stringify({
  status: 'Source-through42 evidence retained, not modern lesson completion',
  bookSha256: bookSha, pages: 36, units: 11, tasks: 118,
  numberedFigures: 23, tables: 2,
  source: 'Sole StageB and affected-only metadata approvals reused. First38/40 count failures preserved.',
  assembly: 'Official strict isolated assembly first exit0. Parent wrapper exit1 from zero-based reference preserved; promote existing successful output only, official reruns0.',
  choices: '75-79 book trace and dependent serialized scalars only; all other bytes/evidence unchanged. Current validators each once exit0. No semantic/display rerun.',
  limits: '101 literal parse UNKNOWN,84 g(y) literal retained pending independent mathematical erratum confirmation;22 endpoint/0-O UNKNOWN. n81 exhausted and n82 pre-render HOLD remain. No DB/publication/merge/closure/deployment/formal handoff.',
  copied,
}, null, 2) + '\n')
console.log(`${copied.length} source-through42 evidence files retained byte-identically`)

import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const root = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g/evidence/batch007-source-through49'
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bookSha = '64cef3281fdfe97c724fea1e9cbac38aef44ef4cd674855ae7ffa763e6651eed'
assert.equal(hash('ssot-resources/soviet10year-textbooks/artifacts/9-10g/book.json'), bookSha)
const inputs = [
  'source-geo910-p44-p47-author.md', 'source-geo910-p44-p47-evidence',
  'source-review-geo910-p44-p47-source-first.md', 'source-review-geo910-p44-p47.md',
  'source-geo910-p44-p47-targeted-repair.md', 'source-geo910-p44-p47-targeted-repair-evidence',
  'source-geo910-p44-p47-changed-only-review.md',
  'source-9g-p48-p49-author.md', 'source-9g-p48-p49-evidence',
  'source-review-9g-p48-p49-source-first.md', 'source-review-9g-p48.md',
  'source-9g-p48-targeted-repair.md', '9g-p48-count-diagnostic',
  'diagnose-9g-p48-count.py', 'finalize-9g-p48-targeted.mjs',
  'source-9g-p48-targeted-repair-review.md',
  'source-9g-p49-author.md', 'source-9g-p49-evidence',
  'source-review-9g-p49.md', 'source-9g-p49-targeted-repair.md',
  'source-9g-p49-targeted-repair-evidence', 'source-9g-p49-targeted-repair-review.md',
  'assemble-geo910-through39.mjs', 'assemble-geo910-through39.before-through49.mjs',
  'assembly-9g-p8-p49', 'advance-9g-through49-once.mjs', 'advance-9g-through49',
  'prepare-n13-rebind9g-through49-once.mjs', 'prepare-n13-rebind9g-through49',
  'rebind-book-trace.py', 'rebind-choice-provenance-once.py',
  'provenance-before-current/9-10g', 'geo910-n13-figure-author-source-inventory.md',
  'retain-source-9g-through49.mjs',
]
assert(!fs.existsSync(root))
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
for (let page = 44; page <= 49; page++) {
  const id = String(page).padStart(4, '0')
  copy(`.tmp/ld-s10y-lesson/9-10g/pages/${id}`, `${root}/source-pixels/${id}`)
}
fs.writeFileSync(`${root}/retention.json`, JSON.stringify({
  status: 'Source closure8-49 retained, not modern n13 completion',
  bookSha256: bookSha, pages: 42, units: 14, tasksIncludingOpen123: 123,
  numberedFigures: 53, n13: '43 prose objects,14 complete tasks107-120,12 source figures; prepare once only.',
  source: 'Sole original-first StageB and affected-only repairs reused; all firstFAIL/REVISE bytes preserved.',
  spaces: '48 two affected physical lines each gain one ASCII space, total two. Corrects inherited summary claim of two spaces per line.',
  literalLimits: '118 second request prints正方形;119 prints正方体 with3:2:1. Faithful literals not silently corrected. Chapter review121/122 complete,123 open; no partial-review lesson promotion.',
  priorChoices: '3/4/7/10 trace/derived serialized scalars only; all other bytes and semantics retained. Current validators each once exit0; no display/mathematics rerun.',
  limits: 'n11 exhausted figure failures and n12 rejected choice coverage remain. James12figure inventory is author preparation, not an independent modern PASS. No DB/publication/merge/closure/deployment/formal handoff.',
  copied,
}, null, 2) + '\n')
console.log(`${copied.length} source-through49 evidence files retained byte-identically`)

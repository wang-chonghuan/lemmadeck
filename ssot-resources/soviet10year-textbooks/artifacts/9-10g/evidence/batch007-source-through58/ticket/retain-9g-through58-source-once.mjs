import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const source = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g'
const evidence = `${source}/evidence/batch007-source-through58`
const pending = `${evidence}.pending-${process.pid}`
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file))
const record = file => ({ path: file, bytes: fs.statSync(file).size, sha256: hash(file) })
for (const [file, sha] of [
  [`${ticket}/source-9g-p56-p59-independent-review.md`, '065360b056bfcedf6e17cdceb2ed1b7deef294b90ddf23cbe4e62c0ffc69ae22'],
  [`${ticket}/source-9g-p59-affected-review.md`, 'b79701309c8b708e798592a4f9fd904fd7d994e6d89137d2df1f5161791c4210'],
  [`${source}/book.json`, '08e88b0cb16e0d0a200fa515d023579f59118d9086a2944cdb71638e64e0b7b0'],
]) assert.equal(hash(file), sha)
assert(!fs.existsSync(evidence) && !fs.existsSync(pending), 'Preserve every prior retention')
fs.mkdirSync(pending, { recursive: true })
const copied = []
const retain = (from, relative, role) => {
  const stat = fs.lstatSync(from)
  if (stat.isDirectory()) {
    for (const name of fs.readdirSync(from).sort()) retain(path.join(from, name), path.join(relative, name), role)
    return
  }
  assert(stat.isFile(), `No symlink/environment content: ${from}`)
  const to = path.join(pending, relative)
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  const before = record(from)
  assert.equal(hash(to), before.sha256)
  copied.push({ ...before, output: relative, role })
}
for (const name of [
  'source-9g-p56-p59-author.md', 'source-9g-p56-p59-author.manifest.json',
  'source-9g-p56-p59-author-evidence.mjs', 'source-9g-p56-p59-author-evidence',
  'source-9g-p56-p59-independent-source-first.md', 'source-9g-p56-p59-independent-review.md',
  'source-9g-p59-affected-review.md', 'source-9g-p59-targeted-repair-evidence',
  'repair-t14-text-and-9g59-once.mjs', 'assemble-9g-through58-once.mjs',
  'retain-9g-through58-source-once.mjs',
]) retain(`${ticket}/${name}`, `ticket/${name}`, 'original-or-sole-affected-evidence')
retain(`${ticket}/assembly-9g-p8-p58`, 'assembly', 'first-strict-assembly-and-source-vectors')
for (const page of [56, 57, 58, 59])
  retain(`${source}/pages/${String(page).padStart(4, '0')}`, `current-pages/${page}`, 'approved-limited-source-precursor')
retain(`${source}/book.json`, 'source/book.json', 'first-through58-source-index')
retain(`${source}/lessons/geo910-c1-s2-n14`, 'source/geo910-c1-s2-n14', 'new-closed-source-unit')
fs.writeFileSync(`${pending}/retention.json`, JSON.stringify({
  status: 'SOURCE_PRECURSOR', sourceBook: record(`${source}/book.json`),
  audit: read(`${source}/book.json`).audit,
  sourceUnit: { id: 'geo910-c1-s2-n14', proseObjects: 23, tasks: 6, media: 3 },
  limits: [
    'First56/58 vectors and first8-58 assembly reused; no source math/full review rerun.',
    'P59 literal reflexivity subscript restored without mathematical correction; orientation note narrowed only.',
    'P58 punctuation C1/C2 and every original optical UNKNOWN remain; n15 open atp0058#10.',
    'Approved59 retained but deliberately unassembled; source60-63 incomplete independent review and excluded.',
    'Prior1-13/t14 source triples and approved t14 DRAFT remain equal; no complete modern n14, official answers or choices.',
  ],
  completeModernLesson: false, productionWrites: 0, copied,
}, null, 2) + '\n', { flag: 'wx' })
fs.renameSync(pending, evidence)
console.log(JSON.stringify({ retainedFiles: copied.length, retention: record(`${evidence}/retention.json`) }, null, 2))

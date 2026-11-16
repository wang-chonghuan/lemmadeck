import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const configurations = {
  '10c': {
    start: 7, end: 51, newStart: 43, retainedEnd: 51,
    outputs: ['ana10-c6-s3-n85', 'ana10-c6-s3-n86'],
    ticketInputs: [
      'source-10c-p43-p46-author.md', 'source-10c-p43-p46-author.manifest.json',
      'source-10c-p43-p46-author-evidence',
      'source-10c-p43-p46-independent-source-first.md', 'source-10c-p43-p46-independent-review.md',
      'source-10c-p43-p46-targeted-repair-author.md', 'source-10c-p43-p46-targeted-repair-author.manifest.json',
      'source-10c-p43-p46-targeted-repair-independent-review.md', 'source-10c-p43-p46-targeted-repair-evidence',
      'source-10c-p43-p46-after-counter-repair', 'finalize-10c43-46-after-counter-repair.mjs',
      'source-10c-interval-row-tool-repair', 'source-10c-interval-row-tool-repair.md',
      'source-10c-interval-row-tool-repair.manifest.json',
      'source-10c-p47-p51-author.md', 'source-10c-p47-p51-author-manifest.json',
      'source-10c-p47-p51-author-evidence',
      'source-10c-p47-p51-independent-source-first.md', 'source-10c-p47-p51-independent-review.md',
      'source-10c-p47-p49-targeted-repair-author.md', 'source-10c-p47-p49-targeted-repair-manifest.json',
      'source-10c-p47-p49-targeted-repair-independent-review.md', 'source-10c-p47-p49-targeted-repair-evidence',
      'rebind-book-trace.py', 'rebind-choice-provenance-once.py',
    ],
    rootScratchInputs: [],
    traces: [
      'ana10-c6-s1-n75', 'ana10-c6-s1-n76', 'ana10-c6-s1-n77',
      'ana10-c6-s1-n78', 'ana10-c6-s2-n79',
    ],
    limitations: [
      'Source T/tau, final a/q optical identity and property6 printed x remain literal/UNKNOWN.',
      'Assembly warning p0047#1 cont after a locally closed paragraph remains honestly recorded; no extra source interpretation or marker repair is certified.',
      'n86 source beginning refers to future fig29/table; no pixels invented and not a complete lesson.',
      'Initial43/46/48/49 count FAILs and the focused generic counter repair attempts/tests are preserved, not rerun.',
      'Book-trace dependent scalar updates/current validators each once are retained; no new old-course semantic or display approval.',
    ],
  },
  '6-8g': {
    start: 11, end: 68, newStart: 64, retainedEnd: 69,
    outputs: ['geo68-c1-ex', 'geo68-c2-s1-n15'],
    ticketInputs: [
      'source-geo68-p64-p67-independent-source-first.md', 'source-geo68-p64-p67-independent-review.md',
      'source-geo68-p64-p67-independent-review.manifest.json',
      'source-geo68-p64-p67-targeted-repair-independent-review.md',
      'source-geo68-p64-p67-targeted-repair-evidence', 'geo68-p64-p67-repair-evidence.mjs',
      'source-geo68-p68-p69-author.md', 'source-geo68-p68-p69-author-manifest.json',
      'source-geo68-p68-p69-author-evidence',
      'source-geo68-p68-p69-independent-source-first.md', 'source-geo68-p68-p69-independent-review.md',
    ],
    rootScratchInputs: [
      'source-geo68-p64-p67-author.md', 'source-geo68-p64-p67-author.manifest.json',
      'source-geo68-p64-p67-author',
    ],
    traces: [],
    limitations: [
      'Original author64-67 package lives in repo-root tmp; copied unchanged into durable evidence, not relocated or silently rewritten.',
      'Original154 cap/160 bars/164 word UNKNOWN and166 literal square remain unchanged.',
      'p68-69 initial packaging guard FAIL from concurrent authorized179 punctuation is preserved. Source181 closure is supported by the sole source review, not a rerun of the guard.',
      'Approved p69 is retained as an unassembled precursor; future actual fig81 is absent from this assembly.',
      'Supplement152-181 is source-complete30 tasks; no modern text, figures, answers or choices are approved by this archive.',
    ],
  },
}
const bookId = process.argv[2]
const config = configurations[bookId]
assert(config, 'Only the two first completed source assemblies')
const source = `ssot-resources/soviet10year-textbooks/artifacts/${bookId}`
const root = `${source}/evidence/batch007-source-through${config.end}`
const assemblyName = `assembly-${bookId}-p${config.start}-p${config.end}-nov16`
const assembly = `${ticket}/${assemblyName}`
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file))
const promotion = read(`${assembly}/promotion.json`)
assert.equal(hash(`${source}/book.json`), promotion.book_sha256)
assert(!fs.existsSync(root), 'Keep all prior copies, never overwrite a retention bundle')
const entries = []
const add = (from, destination, category) => {
  for (const part of from.split(path.sep))
    assert(!/^(?:\.env(?:\..*)?|\.venv|node_modules|secrets?)$/i.test(part), `Forbidden archive input: ${from}`)
  const stat = fs.lstatSync(from)
  assert(!stat.isSymbolicLink(), `No archived symlink: ${from}`)
  if (stat.isDirectory()) {
    for (const name of fs.readdirSync(from).sort())
      add(path.join(from, name), path.join(destination, name), category)
    return
  }
  assert(stat.isFile(), `Only regular evidence files: ${from}`)
  entries.push({ sourcePath: from, path: destination, sha256: hash(from), bytes: stat.size, category })
}
for (const name of config.ticketInputs) add(`${ticket}/${name}`, `ticket/${name}`, 'author-review-repair-evidence')
for (const name of config.rootScratchInputs) add(`tmp/${name}`, `original-root-tmp/${name}`, 'original-author-package')
for (const name of [
  'before-book.json', 'before-lessons', 'protected-files.json', 'decisions.json',
  'operations', 'inputs.json', 'promotion.json',
]) add(`${assembly}/${name}`, `ticket/${assemblyName}/${name}`, 'first-assembly')
add(`${assembly}/${bookId}/book.json`, `ticket/${assemblyName}/${bookId}/book.json`, 'source-output')
for (const lesson of config.outputs)
  add(`${assembly}/${bookId}/lessons/${lesson}`, `ticket/${assemblyName}/${bookId}/lessons/${lesson}`, 'source-output')
for (let page = config.newStart; page <= config.retainedEnd; page++) {
  const id = String(page).padStart(4, '0')
  add(`${source}/pages/${id}`, `approved-pages/${id}`, page > config.end ? 'approved-unassembled-precursor' : 'new-source-input')
  add(`.tmp/ld-s10y-lesson/${bookId}/pages/${id}`, `source-pixels/${id}`, 'prepared-original-pixels')
}
for (const lesson of config.traces) {
  add(`${ticket}/provenance-before-current/${bookId}/${lesson}/93d6d63d1572`,
    `immediate-prior-traces/${lesson}`, 'previous-trace-bytes')
  add(`${source}/editions/modern-us-neutral/lessons/${lesson}/choice-set`,
    `current-traces/${lesson}`, 'current-trace-bytes')
}
for (const name of ['assemble-approved-nov16-once.mjs', 'retain-approved-nov16-source-once.mjs'])
  add(`${ticket}/${name}`, `ticket/${name}`, 'used-wrapper')
const paths = entries.map(entry => `${root}/${entry.path}`)
paths.push(`${root}/retention.json`, `${root}/retained-files.txt`)
assert.equal(new Set(paths).size, paths.length, 'No overlapping destinations')
entries.sort((a, b) => a.path.localeCompare(b.path))
fs.mkdirSync(root, { recursive: true })
for (const entry of entries) {
  const bytes = fs.readFileSync(entry.sourcePath)
  assert.equal(createHash('sha256').update(bytes).digest('hex'), entry.sha256, 'Concurrent evidence change')
  const destination = `${root}/${entry.path}`
  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.writeFileSync(destination, bytes, { flag: 'wx' })
  assert(bytes.equals(fs.readFileSync(destination)), `Retained bytes changed: ${destination}`)
}
fs.writeFileSync(`${root}/retained-files.txt`, paths.sort().join('\n') + '\n', { flag: 'wx' })
fs.writeFileSync(`${root}/retention.json`, JSON.stringify({
  ticket: 'STEMROBIN-184', status: 'Source/first-assembly/prepare evidence only, NOT modern complete',
  promotion, approvedUnassembledPages: config.retainedEnd > config.end ? [config.retainedEnd] : [],
  limitations: config.limitations,
  mechanics: {
    meaning: 'Byte-copy integrity only; no semantic review or acceptance run',
    evidenceFiles: entries.length + 2, retainedBytes: entries.reduce((n, entry) => n + entry.bytes, 0),
    paths: 'retained-files.txt', imagesOpened: 0, productionWrites: 0,
    stage: false, commit: false, push: false, formalHandoff: false, projectChecks: false,
  },
  copied: entries,
}, null, 2) + '\n', { flag: 'wx' })
console.log(`${bookId}: ${entries.length + 2} durable evidence files copied unchanged`)
console.log(`${hash(`${root}/retention.json`)}  ${path.resolve(`${root}/retention.json`)}`)

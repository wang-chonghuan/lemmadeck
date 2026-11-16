import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(import.meta.filename)
const bind = file => ({
  path: path.resolve(file), bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
})
const json = (file, data) => fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
const read = file => JSON.parse(fs.readFileSync(path.join(out, file), 'utf8'))
assert.equal(process.cwd(), root)
assert(!fs.existsSync(path.join(out, 'author-freeze.json')))
const beforePrepare = read('inputs-before-prepare.json')
const beforeCounts = read('bindings-before-native-call.json')
for (const before of [...beforePrepare.bindings, ...beforeCounts.bindings]) {
  assert.equal(bind(before.path).sha256, before.sha256, `Input changed: ${before.path}`)
}
const counts = read('author-counts.stdout.json')
const observations = read('author-observations.json')
const commands = read('author-counts.command.json')
assert.equal(commands.exitCode, 0)
assert(counts.pages.every(page => page.block_rows_match_author))
const pages = [220, 221, 222, 223]
const receipts = pages.map(page => read(`prepare-${page}.json`))
for (const receipt of receipts) {
  assert.equal(receipt.exitCode, 0)
  assert(receipt.prepareCalls <= 1)
  for (const before of [...receipt.outputs, ...receipt.snapshots]) {
    assert.equal(bind(before.path).sha256, before.sha256, `Preparation changed: ${before.path}`)
  }
}
const countsBinding = bind(path.join(out, 'author-counts.stdout.json'))
const geometry = path.join(out, 'native-memory-geometry.json')
json(geometry, {
  role: 'native-memory-measurement-only-not-approved-geometry',
  nativeCountResult: countsBinding,
  figures: counts.pages.flatMap(page => page.figures.map(figure => ({ pdfPage: page.pdf_page, ...figure }))),
  cropWrites: false, figureWrites: false, geometryApproved: false,
})
const checkpoint = path.join(out, 'preparation-checkpoint.json')
json(checkpoint, {
  ticket: 'STEMROBIN-181', purpose: 'preparation-for-next-D023-not-delivered-cards',
  mainOwnership: { D021: 'completed-by-main', D022: 'progressing-by-main-not-this-author' },
  authorDirectory: out,
  candidates: counts.pages.map(page => ({
    ...bind(page.candidate), pdfPage: page.pdf_page, printedPage: page.printed_page,
    visualRows: page.visually_authored_printed_rows, candidateRows: page.candidate_rows,
    nativeRows: page.native_masked_rows, figures: page.figures.length,
  })),
  nativeCounts: countsBinding, geometry: bind(geometry),
  imageBudget: observations.image_budget,
  unresolved: [
    {
      kind: 'affected-counter-correction-required', pdfPage: 220,
      candidateRows: 23, nativeRows: 24, bandOneBased: 24, bandY: [2151, 2173],
      sourceObservation: 'Right-bottom black scan corner below the footer, not printed content.',
      changesMade: 'None; default count and faithful candidate frozen. No figure modification or counter override.',
      remaining: 'Affected correction owner must resolve the false scan band; author count is not a SOURCE/SCI gate.',
    },
    {
      kind: 'incoming-caption-owner-resolution-required',
      incomingOriginal: beforePrepare.bindings.find(file => file.path.endsWith('/d022-source216-219-correction/0219.page.md')),
      incomingFrozen: bind(path.join(out, 'bound-inputs/incoming-0219.page.md')),
      marker: 'cap 欧姆 open', provisional: true,
      observationOn220: 'Normal resistance prose, no biographical caption continuation; no cap cont authored.',
      incomingChanged: false, source89CompleteClaim: false,
    },
    {
      kind: 'outgoing-source-boundary', pdfPage: 223, printedPage: 214,
      heading: '93. 电路 导体的串联和并联', marker: 'p open',
      literalTail: '通常在电', nextPhysicalPage: 224, nextPageOpened: false,
    },
    {
      kind: 'literal-and-source-review-pending',
      targets: observations.literal_review_targets,
      unreadableGlyphBlockers: observations.unreadable_glyph_blockers,
      geometryApproved: false, independentSCI_SOURCEGate: false,
    },
  ],
  sourceBoundaries: observations.source_boundaries,
  forbiddenActionsPerformed: [],
  finalizeVectorizeAssemble: false, modernTextsOrFigures: false,
  gitDatabaseBrowserFullTestsChildrenOtherChats: false, cardsDelivered: false,
})
const candidateHashes = path.join(out, 'candidate-sha256.txt')
fs.writeFileSync(candidateHashes, counts.pages.map(page => {
  const file = bind(page.candidate)
  return `${file.sha256}  ${file.path}`
}).join('\n') + '\n', { flag: 'wx' })
const localFiles = [
  ...counts.pages.map(page => page.candidate),
  'prepare-once.mjs', 'author-counts.py', 'count-once.mjs', 'freeze-author.mjs',
  'author-observations.json', 'inputs-before-prepare.json', 'bindings-before-native-call.json',
  'author-counts.stdout.json', 'author-counts.stderr.txt', 'author-counts.command.json',
  'native-memory-geometry.json', 'preparation-checkpoint.json', 'candidate-sha256.txt',
  'bound-inputs/source-manifest-9p.json', 'bound-inputs/incoming-0219.page.md',
  ...pages.flatMap(page => [`prepare-${page}.json`, `prepare-${page}.stdout.txt`, `prepare-${page}.stderr.txt`]),
].map(file => path.isAbsolute(file) ? file : path.join(out, file))
const allBindings = [
  ...beforePrepare.bindings, ...beforeCounts.bindings, ...localFiles.map(bind),
  ...receipts.flatMap(receipt => [...receipt.outputs, ...receipt.snapshots]),
]
const uniqueBindings = [...new Map(allBindings.map(file => [file.path, file])).values()]
const freeze = path.join(out, 'author-freeze.json')
json(freeze, {
  schema: 'STEMROBIN-181/source-author-freeze@1',
  role: 'author-preparation-not-independent-SCI-SOURCE-approval',
  ticket: 'STEMROBIN-181', existingInvocation: true,
  checkpoint: bind(checkpoint), nativeCountResult: countsBinding, geometry: bind(geometry),
  exactBindings: uniqueBindings,
  preservation: {
    pdf: 'Exact existing PDF path/hash only; no corpus copy.',
    manifest: 'Exact original path/hash and bounded 9p record snapshot only.',
    incoming: 'Exact original path/hash and frozen TEXT copy; no incoming pixel open.',
    prepare: 'Exactly four native output sets and their bounded snapshots; stdout/stderr receipts preserved.',
    runtime: 'Native helper paths/hashes and runtime identity only; no all-runtime or all-corpus capture.',
    candidate: 'Authored once; byte hashes frozen; no normalization or later edit.',
  },
  imageBudget: observations.image_budget,
  sourceWrites: false, geometryApproved: false, cardsDelivered: false,
})
for (const file of uniqueBindings) {
  if (file.path.startsWith(`${out}/`)) fs.chmodSync(file.path, 0o444)
}
fs.chmodSync(freeze, 0o444)
console.log(JSON.stringify({
  freeze: bind(freeze), checkpoint: bind(checkpoint), nativeCountResult: countsBinding,
  geometry: bind(geometry), candidateHashes: bind(candidateHashes),
  candidates: counts.pages.map(page => bind(page.candidate)), exactBindings: uniqueBindings.length,
}, null, 2))

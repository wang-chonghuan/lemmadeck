import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const cwd = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
const ticket = path.join(cwd, '.intentfold/tickets/STEMROBIN-184/tmp')
const configurations = {
  '6g70-71': {
    book: '6-8g', pages: [70, 71], destination: 'batch007-source-p70-p71',
    directories: [
      'source-6g-p70-p71-author-20261116T122412Z',
      'source-6g-p70-p71-notes-repair', 'prepare-6g-p70-p71-first',
    ],
    documents: [
      'source-6g-p70-p71-independent-source-first.md',
      'source-6g-p70-p71-independent-review.md',
      'source-6g-p70-p71-affected-review.md',
      'repair-6g70-71-notes-once.mjs', 'prepare-6g-p70-p71-first.mjs',
    ],
    bindings: {
      'source-6g-p70-p71-author-20261116T122412Z/author-report-final.md': '4b8c4e8e8a33107d5123c37393a0af727533d1584400477ff2f45819cb9c1cc4',
      'source-6g-p70-p71-author-20261116T122412Z/manifest-final.json': '680a1a86b141efc9f82d5f5678b11b390c94e753ac0ef7bd704c4b9ab80bdfa2',
      'source-6g-p70-p71-author-20261116T122412Z/author-report.md': 'dac305fad60efe28729d5d0208c57fef31e2d3bd10e3eb9100e4c878db08fce5',
      'source-6g-p70-p71-author-20261116T122412Z/manifest.json': 'f02b7769c085148261d2e56cee384958b2b1d4e55470cb562a5846620986aa0a',
      'source-6g-p70-p71-independent-source-first.md': 'c00e337bdbd14de28eec94d22fcbf4bb8386f86fa7ab17af832de31b0757cdcc',
      'source-6g-p70-p71-independent-review.md': '4c8a0e8c05ef9675e8dfe99f7f7eb1ecb1daef40841e111a31d419e65ae65e56',
      'source-6g-p70-p71-affected-review.md': '2802057d1931c791f9e3b17691114cb8ca73a73ccf76e5956a9c3a32a9dfea74',
    },
    currentJson: [
      'e1b12f3b7a196de06355de9185e55fee1210b7047a08940933f5343812d35ba2',
      '475126047f239e9b5f42b27fc0565562ce96e7347354deeef6b50eeee87ae1b1',
    ],
    conditions: [
      'Unique StageB supports source text/crop inventories; affected comparison resolves R1 notes only.',
      'Original final packaging helper exit1/TypeError retained without retry.',
      'Old official differences23116/48620 remain INVALID unpadded-versus-padded comparisons; aligned differences UNKNOWN.',
      'Historical helper hashes remain historical observations, not current/execution-time certificates.',
      'Full weight spans UNKNOWN; exercise182 OPEN; figure83 unseen; no completed unit.',
    ],
  },
  '9g64-65': {
    book: '9-10g', pages: [64, 65], destination: 'batch007-source-p64-p65',
    directories: ['source-9g-p64-p65-author-evidence', 'prepare-9g-p64-p65-first'],
    documents: [
      'source-9g-p64-p65-author-report.md', 'source-9g-p64-p65-author-manifest.json',
      'source-9g-p64-p65-independent-source-first.md', 'source-9g-p64-p65-independent-review.md',
      'prepare-9g-p64-p65-first.mjs',
    ],
    bindings: {
      'source-9g-p64-p65-author-report.md': 'c1fcfd9530a47a7507e5d76f9bd37a07e50dd15ed1acaf2a4f29536cb87752f1',
      'source-9g-p64-p65-author-manifest.json': '7ac1f52f6e5d0db3ad82bfbef80dc9528f114ad8a274fa775b637f6f1f014cac',
      'source-9g-p64-p65-independent-source-first.md': '6201d836f4bda8053434b801c796ddc62e1be656cbbadafb5f44f0207ee66171',
      'source-9g-p64-p65-independent-review.md': 'ddb8cb7e4406aa508d3aa3b45507aa08b50df1fb158ca39bda021295ead07066',
    },
    currentJson: [
      '132b55ebdbc8b3ca88cf22e8f94feb703eaa5d2d469de2de397211a843e0dfd6',
      '724ffc851c879302145129c0b7b76c2ab81b91293df40017d5cc09bf4efd82a8',
    ],
    conditions: [
      'Unique StageB SOURCE_ONLY_WITH_RETAINED_UNKNOWNS; no new substantive review.',
      'Figure69 O/0 labels and central interrupted-shaft intent UNKNOWN.',
      '169 raised-circle purpose UNKNOWN; task174 OPEN at 经; section17 right boundary unseen.',
      'Book34ae066f remains unchanged for the ongoing n15/n16 comparison; no assembly.',
    ],
  },
}
assert.equal(process.cwd(), cwd)
const config = configurations[process.argv[2]]
assert(config, 'Expected 6g70-71 or 9g64-65')
const base = path.join(cwd, 'ssot-resources/soviet10year-textbooks/artifacts', config.book)
const destination = path.join(base, 'evidence', config.destination)
assert(!fs.existsSync(destination), 'First retention only; no overwrite or retry')
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(dir, entry.name)
  assert(!entry.isSymbolicLink(), `No archival symlink: ${file}`)
  return entry.isDirectory() ? walk(file) : [file]
})
for (const [relative, expected] of Object.entries(config.bindings))
  assert.equal(hash(path.join(ticket, relative)), expected, relative)
for (const [index, page] of config.pages.entries())
  assert.equal(hash(path.join(base, 'pages', String(page).padStart(4, '0'), 'page.json')), config.currentJson[index])
const plans = new Map()
const add = (source, retainedRelativePath) => {
  const stat = fs.lstatSync(source)
  assert(stat.isFile() && !stat.isSymbolicLink(), source)
  const previous = plans.get(source)
  if (previous) return assert.equal(previous.retainedRelativePath, retainedRelativePath)
  plans.set(source, { source, retainedRelativePath, sha256: hash(source), bytes: stat.size })
}
for (const directory of config.directories)
  for (const file of walk(path.join(ticket, directory)))
    add(file, path.join('historical', path.relative(ticket, file)))
for (const document of config.documents)
  add(path.join(ticket, document), path.join('historical', document))
add(fileURLToPath(import.meta.url), 'historical/retain-reviewed-source-pairs-once.mjs')
for (const page of config.pages) {
  const number = String(page).padStart(4, '0')
  for (const file of walk(path.join(base, 'pages', number)))
    add(file, path.join('inputs', path.relative(base, file)))
  const prepared = path.join(cwd, '.tmp/ld-s10y-lesson', config.book, 'pages', number)
  for (const file of walk(prepared))
    add(file, path.join('inputs/prepared/pages', number, path.relative(prepared, file)))
}
add(path.join(base, 'book.json'), 'inputs/book-before-append.json')
const startedAtUtc = new Date().toISOString()
fs.mkdirSync(destination)
for (const plan of plans.values()) {
  const target = path.join(destination, plan.retainedRelativePath)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.copyFileSync(plan.source, target, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(target), plan.sha256)
  assert.equal(hash(plan.source), plan.sha256)
  fs.chmodSync(target, 0o444)
}
const retention = {
  status: 'SOURCE_PRECURSOR_NOT_COMPLETE', ticket: 'STEMROBIN-184', book: config.book,
  physicalPages: config.pages, role: 'MECHANICAL_EXACT_BYTE_RETENTION_ONLY',
  reportedConditions: config.conditions,
  evidencePolicy: 'Historical absolute/scratch paths are provenance only, not runtime dependencies. Full historical bytes are retained with their limitations, not repaired or recertified.',
  runtimeDependencies: [],
  files: [...plans.values()].map(({ source, ...record }) => ({
    ...record, sourcePathProvenanceOnly: source, fullFileExactByteCopy: true,
  })),
  counts: { copiedFiles: plans.size, copiedBytes: [...plans.values()].reduce((sum, item) => sum + item.bytes, 0) },
  execution: { executable: process.execPath, argv: process.argv.slice(1), cwd, startedAtUtc, finishedAtUtc: new Date().toISOString(), invokedOnce: true },
  operations: {
    newImages: 0, newSemanticReviews: 0, counter: false, finalize: false, helperRetry: false,
    vectorize: false, assembly: false, modernPromotion: false, formalAnswers: 0, choices: 0,
    Git: false, database: false, production: false, currentArtifactsModified: false,
  },
}
const retentionPath = path.join(destination, 'retention.json')
fs.writeFileSync(retentionPath, JSON.stringify(retention, null, 2) + '\n', { flag: 'wx', mode: 0o444 })
console.log(JSON.stringify({ status: retention.status, ...retention.counts, totalFiles: plans.size + 1, retentionPath, sha256: hash(retentionPath) }, null, 2))

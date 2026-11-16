import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
const T = path.join(root, '.intentfold/tickets/STEMROBIN-184/tmp')
const base = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts')
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const configs = [
  {
    book: '6-8g', pages: [72, 73], prefix: 'source-6g-p72-p73',
    destination: 'batch007-source-p72-p73-first-hold',
    packageDirectory: 'source-6g-p72-p73-author-evidence',
    extra: ['source-6g-p72-p73-author-report.md', 'source-6g-p72-p73-author-manifest.json',
      'source-6g-p72-p73-independent-source-first.md', 'source-6g-p72-p73-independent-review.md'],
    fixed: {
      'source-6g-p72-p73-author-report.md': 'a92b15602610b37222ed14962bbc82625b63deea39ca521ccc2567e847dc0d4b',
      'source-6g-p72-p73-author-manifest.json': '58598e8d983329c0d8bd40551fa5ef6d0da5b85b366df784a0eb7947daec8bc5',
      'source-6g-p72-p73-independent-review.md': 'bb946445c4157aacfcb703104bd536f9a3cc380b4128418a77774e38f6e0d409',
    },
    status: 'SOURCE_HOLD_UNRESOLVED',
    disposition: 'First finalize each exit0/18,25; ONE StageB HOLD. R01 过-versus-着 and R02 period-versus-colon not settled by authorized crops. R03 explicit number-prefix emphasis missing. No repair at this retained state.',
    limits: 'All fine anchors/damage/glyph UNKNOWNs and187/unit15 OPEN retained;30 legitimate cross-page KaTeX warnings retained;no vectorization/assembly/promotion.',
  },
  {
    book: '9-10g', pages: [66, 67], prefix: 'source-9g-p66-p67',
    destination: 'batch007-source-p66-p67-qualified-disposition',
    packageDirectory: 'source-9g-p66-p67-author-evidence',
    extra: ['source-9g-p66-p67-author-report.md', 'source-9g-p66-p67-author-manifest.json',
      'source-9g-p66-p67-independent-source-first.md', 'source-9g-p66-p67-independent-review.md',
      'source-9g-p66-p67-full-consumption.json', 'consume-9g66-67-package-once.mjs',
      'consume-9g66-67-package-first-client-failure.mjs', 'consume-9g66-67-package-second-client-failure.mjs'],
    fixed: {
      'source-9g-p66-p67-author-report.md': 'fc65988a4200c64e2c2ac3f3186024fa54dcf56f04c20bce9a29ea295c5b0f84',
      'source-9g-p66-p67-author-manifest.json': '86ffeb80c989a319c60f71f8c4bb55c96c0fe68bf7e79cc18107aae62a0355a8',
    },
    status: 'SOURCE_LITERAL_AGREEMENT_WITH_RETAINED_UNKNOWNS',
    disposition: 'First finalize each exit0/18,17; ONE StageB supports two author cdot tokens from filled source dots, not mathematical convention. Exact declared emphasis spans remain unverified;fleck coverage remains UNKNOWN.',
    limits: 'Coarse figures only,not pixel-PASS/promotion;71/72 fine incidence/subscripts/heads/wedge UNKNOWN;§17 boundary source-observed CLOSED,§18 final映射成 OPEN. Parent two consumer client failures remain failures,not source/pipeline failures.',
  },
  {
    book: '10c', pages: [54, 55], prefix: 'source-10c-p54-p55',
    destination: 'batch007-source-p54-p55-first-failure',
    packageDirectory: 'source-10c-p54-p55-author-evidence',
    extra: ['source-10c-p54-p55-independent-source-first.md',
      'source-10c-p54-p55-full-consumption.json', 'consume-10c54-55-package-once.mjs'],
    fixed: {},
    status: 'SOURCE_FIRST_FAILURE_NOT_ACCEPTED_STAGEB_PENDING',
    disposition: '54first finalize ONCE0/23vs23;55first ONCE1/17vs15;immediate pipeline stop. Full author report/manifest/inventory consumed,ONEStageB disclosed and pending. No repair or retry at this retained state.',
    limits: 'Tool snapshot1fc40bd0 historical;parent shared layout changed during continuation,not an execution-time module certificate. Glyph/spacing/punctuation discrepancies pending source adjudication;32/33 gaps/repeated a and unit86 OPEN retained. Parent ec3333 shape-reader TypeError retained as diagnostic client failure,not author/pipeline failure.',
  },
]
const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(item => {
  assert(!item.isSymbolicLink(), 'No archival symlink')
  const file = path.join(directory, item.name)
  return item.isDirectory() ? walk(file) : [file]
})
for (const config of configs) {
  const destination = path.join(base, config.book, 'evidence', config.destination)
  assert(!fs.existsSync(destination), 'First retention only')
  const plans = new Map()
  const add = (source, relative, expected) => {
    const stat = fs.lstatSync(source)
    assert(stat.isFile() && !stat.isSymbolicLink(), source)
    const sha256 = hash(source)
    if (expected) assert.equal(sha256, expected, source)
    assert(!plans.has(source), 'Unique source mapping')
    plans.set(source, { sourcePathProvenanceOnly: source, retainedRelativePath: relative, sha256, bytes: stat.size })
  }
  const packageRoot = path.join(T, config.packageDirectory)
  for (const file of walk(packageRoot)) add(file, `historical/author/${path.relative(packageRoot, file)}`)
  for (const relative of config.extra) add(path.join(T, relative), `historical/${relative}`, config.fixed[relative])
  for (const page of config.pages) {
    const pageId = String(page).padStart(4, '0')
    for (const name of ['page.md', 'page.json', 'audit.json'])
      add(path.join(base, config.book, 'pages', pageId, name), `inputs/pages/${pageId}/${name}`)
  }
  add(path.join(base, config.book, 'book.json'), 'inputs/book-before-append.json')
  add(fileURLToPath(import.meta.url), 'historical/retain-current-source-dispositions-once.mjs')
  fs.mkdirSync(destination)
  for (const item of plans.values()) {
    const target = path.join(destination, item.retainedRelativePath)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.copyFileSync(item.sourcePathProvenanceOnly, target, fs.constants.COPYFILE_EXCL)
    assert.equal(hash(target), item.sha256)
    assert.equal(hash(item.sourcePathProvenanceOnly), item.sha256)
    fs.chmodSync(target, 0o444)
  }
  const result = {
    role: 'MECHANICAL_EXACT_BYTE_RETENTION_ONLY', ticket: 'STEMROBIN-184',
    book: config.book, physicalPages: config.pages, status: config.status,
    disposition: config.disposition, limits: config.limits,
    runtimeDependencies: [], provenancePolicy: 'Absolute source paths are PROVENANCE_ONLY; use retainedRelativePath and SHA256.',
    operations: {
      invokedOnce: true, newImageLoads: 0, newReviews: 0, counter: false,
      finalize: false, sourceEdits: false, retries: false, assembly: false,
      formalAnswers: 0, choices: 0, git: false, database: false, production: false,
    },
    counts: { copiedFiles: plans.size, copiedBytes: [...plans.values()].reduce((sum, item) => sum + item.bytes, 0) },
    files: [...plans.values()],
  }
  const output = path.join(destination, 'retention.json')
  fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n', { flag: 'wx', mode: 0o444 })
  console.log(JSON.stringify({ book: config.book, ...result.counts, totalFiles: plans.size + 1, retentionPath: output, sha256: hash(output) }))
}

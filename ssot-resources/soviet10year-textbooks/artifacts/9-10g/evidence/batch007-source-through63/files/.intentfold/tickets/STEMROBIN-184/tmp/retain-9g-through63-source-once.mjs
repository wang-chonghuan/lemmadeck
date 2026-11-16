import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const ticket = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(ticket, '../../../..')
const source = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g')
const destination = path.join(source, 'evidence/batch007-source-through63')
const assembly = path.join(ticket, 'assembly-9g-p8-p63')
const expectedReview = 'daeac0e19983d8b4de4a9cad17626c5dea96802d29f5c817353ceb8828451a4b'
const expectedBook = '34ae066f8c1369116330f6b423c4b5a2e5b743b40c0901bfdd45f427c48a07f7'
const expectedBeforeBook = '08e88b0cb16e0d0a200fa515d023579f59118d9086a2944cdb71638e64e0b7b0'
const args = process.argv.slice(2)
assert.deepEqual(args, ['--go', '--review-sha', expectedReview, '--book-sha', expectedBook],
  'Explicit go and the exact parent-supplied review/book hashes are required')
assert(!fs.existsSync(destination), 'Never overwrite or resume an existing checkpoint')

const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const fullHash = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value)
const relative = file => path.relative(root, file).split(path.sep).join('/')
const excluded = file => file.split(path.sep).some(part =>
  ['node_modules', '.venv', 'venv', '.git', '__pycache__'].includes(part) ||
  part === '.env' || part.startsWith('.env.'))
const absolute = file => {
  assert.equal(typeof file, 'string')
  const resolved = path.resolve(root, file)
  assert(resolved.startsWith(`${root}${path.sep}`), `Outside this workspace: ${file}`)
  return resolved
}
const regular = file => {
  const resolved = absolute(file)
  assert(!excluded(resolved), `Excluded environment/dependency path: ${file}`)
  let current = root
  for (const part of path.relative(root, resolved).split(path.sep)) {
    current = path.join(current, part)
    assert(!fs.lstatSync(current).isSymbolicLink(), `No symlink traversal: ${current}`)
  }
  assert(fs.lstatSync(resolved).isFile(), `Expected an actual regular file: ${resolved}`)
  return resolved
}
const check = (file, sha256) => {
  assert(fullHash(sha256), `Invalid raw hash: ${file}`)
  const resolved = regular(file)
  assert.equal(hash(resolved), sha256, `Raw bytes changed: ${resolved}`)
  return resolved
}
const planned = new Map()
const skips = []
const external = []
const bindings = []
const preservedAbsentDeclarations = []
const add = (file, category, expected, declaration) => {
  const resolved = regular(file)
  const sha256 = hash(resolved)
  if (expected !== undefined) assert.equal(sha256, expected, `Declared bytes changed: ${resolved}`)
  let entry = planned.get(resolved)
  if (!entry) {
    entry = {
      sourcePathProvenanceOnly: resolved,
      retainedRelativePath: `files/${relative(resolved)}`,
      sha256,
      bytes: fs.statSync(resolved).size,
      categories: [],
      declarations: [],
      runtimeDependency: false,
      fullFileExactByteCopy: true,
    }
    planned.set(resolved, entry)
  }
  assert.equal(entry.sha256, sha256, `Concurrent source change: ${resolved}`)
  if (!entry.categories.includes(category)) entry.categories.push(category)
  if (declaration) entry.declarations.push(declaration)
  return entry
}
const tree = (directory, category) => {
  const resolved = absolute(directory)
  assert(fs.lstatSync(resolved).isDirectory(), `Required evidence tree missing: ${resolved}`)
  for (const entry of fs.readdirSync(resolved, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name))) {
    const file = path.join(resolved, entry.name)
    if (excluded(file) || entry.isSymbolicLink()) {
      skips.push({ sourcePathProvenanceOnly: file, reason: 'environment/dependency/symlink excluded' })
    } else if (entry.isDirectory()) {
      tree(file, category)
    } else {
      assert(entry.isFile(), `Unsupported evidence file type: ${file}`)
      add(file, category)
    }
  }
}

const fixed = [
  ['source-9g-p60-p63-author.md', 'bda299305fc8e166c50a145c6c831b7445b9e38b6924493fe1bb16452e7d72a8'],
  ['source-9g-p60-p63-author.manifest.json', '6913a8f2b75e1b6402e5532bca066ce9dc4996be9fd14fcaf18add47dbea5bee'],
  ['source-9g-p60-p62-independent-review.md', '8b61a753606e5b58b14628e976dc56d93dbd7eb88f560a6451da647e060ec569'],
  ['source-9g-p60-p62-independent-review-after-disclosure.md', 'a11557d938fcec548ca638a1d9f4443ab1046686f0c26d3ec69c7cdbc10bef94'],
  ['source-9g-p60-p62-affected-review.md', '0a01413956bf8b79ab84c4744f743ce8e5ae40cf0fabc952886054118ec79583'],
  ['source-9g-p60-p63-independent-source-first.md', '5383c0ab85d33e07716d73cf642c706419f10ce16bb56c5146187fa5d6b2c970'],
  ['source-9g-p63-independent-review.md', '08106168dc44a191a7f691739e757e8e6c528704f28221e35ad7c77a43c17afa'],
  ['source-9g-p63-emphasis-clarification.md', 'e38d2b53bd0353e55909a1cc470f998adbaece1b49d39ee28bdd167e13f7957e'],
  ['source-9g-p63-affected-review.md', expectedReview],
]
for (const [name, sha256] of fixed) add(path.join(ticket, name), 'complete-author-or-review-record', sha256)
add(path.join(root, 'tmp/source-9g-p63-author.md'), 'root-first-failure-report',
  'e5a4e8dea61d22ddfb8aed1e9528f92ac7b044759f227a5b2963aaecbcaea735')
add(path.join(root, 'tmp/source-9g-p63-author.manifest.json'), 'root-first-failure-manifest',
  'ec8808cf4806c0fc1c1aad7a7f226f562c629f2385eafa39c20721693c1bbea7')
for (const name of [
  'evidence/usedhelper/source-9g-p60-p63-author',
  'source-9g-p60-p62-corrected-disclosure',
  'source-9g-p60-p62-targeted-repair-evidence',
  'source-9g-p63-targeted-repair',
  'source-9g-p63-row-diagnostic',
  'source-9g-p63-selection-diagnostic',
  'source-9g-p63-counter-repair',
  'prepare-9g-p60-p63-first',
]) tree(path.join(ticket, name), 'complete-original-and-before-after-evidence')
tree(path.join(root, 'tmp/source-9g-p63-author'), 'complete-root-first-failure-evidence')
for (const name of [
  'prepare-9g-p60-p63-first.mjs',
  'repair-9g60-62-targeted-once.mjs',
  'repair-9g63-targeted-once.mjs',
  'diagnose-9g63-component-selection-once.py',
  'diagnose-9g63-row-collapse-once.py',
  'verify-9g63-row-repair-once.py',
  'assemble-9g-through63-once.mjs',
  path.basename(fileURLToPath(import.meta.url)),
]) add(path.join(ticket, name), 'helper-byte-copy-not-executed-by-retention')

const counterVerificationFile = path.join(ticket, 'source-9g-p63-counter-repair/verification.json')
const counterVerification = json(counterVerificationFile)
add(counterVerification.toolAfter.path, 'current-counter-tool', counterVerification.toolAfter.sha256)
add(path.join(root, '.claude/skills/ld-s10y-lesson/tests/test_vector_arrow_rows.py'), 'current-counter-test-byte-copy')
const counterBefore = json(path.join(ticket, 'source-9g-p63-counter-repair/before.json'))
add(path.join(ticket, 'source-9g-p63-counter-repair/layout.before.py'),
  'original-counter-tool', counterBefore.tool.sha256)

const priorIndex = new Map()
const priorArchives = []
for (const [name, expected] of [
  ['batch007-source-through58', 'dfdd56d2d78c87d6069d3f8610a726a9aa4b898320a5e56d9658f08037f3628c'],
  ['batch007-n14-math-checkpoint', 'db70c015cbd20e1e36de3edf2d5f5ee0e359a280418c4034ee330befc3504be7'],
]) {
  const manifestPath = path.join(source, 'evidence', name, 'retention.json')
  check(manifestPath, expected)
  const manifest = json(manifestPath)
  const ledger = manifest.copied ?? manifest.files
  assert(Array.isArray(ledger) && ledger.length > 0, `No prior durable raw ledger: ${name}`)
  priorArchives.push({
    retainedManifestPath: manifestPath,
    sha256: expected,
    statusAsRecorded: manifest.status,
    completeArchiveRecopied: false,
  })
  for (const entry of ledger) {
    const retainedRelativePath = entry.output ?? entry.retainedRelativePath
    assert.equal(typeof retainedRelativePath, 'string')
    const file = path.resolve(path.dirname(manifestPath), retainedRelativePath)
    assert(file.startsWith(`${path.dirname(manifestPath)}${path.sep}`))
    assert(fullHash(entry.sha256))
    const witness = {
      retainedPath: file,
      sha256: entry.sha256,
      bytes: entry.bytes,
      archiveManifestPath: manifestPath,
      archiveManifestSha256: expected,
      historicalPathProvenanceOnly: entry.path ?? entry.historicalSource?.path ?? null,
      runtimeDependency: false,
    }
    const values = priorIndex.get(entry.sha256) ?? []
    values.push(witness)
    priorIndex.set(entry.sha256, values)
  }
}
const priorWitness = (historicalPath, sha256) => {
  const candidates = priorIndex.get(sha256) ?? []
  const witness = candidates.find(entry =>
    entry.historicalPathProvenanceOnly &&
    absolute(entry.historicalPathProvenanceOnly) === absolute(historicalPath)) ??
    candidates.find(entry => path.basename(entry.retainedPath) === path.basename(historicalPath))
  if (!witness) return null
  check(witness.retainedPath, sha256)
  assert.equal(fs.statSync(witness.retainedPath).size, witness.bytes)
  if (!external.some(entry => entry.retainedPath === witness.retainedPath)) external.push(witness)
  return witness
}

const inputsFile = path.join(assembly, 'inputs.json')
const promotionFile = path.join(assembly, 'promotion.json')
const inputs = json(inputsFile)
const promotion = json(promotionFile)
assert(Array.isArray(inputs.inputs) && inputs.inputs.length > 0)
assert.equal(promotion.book.sha256, expectedBook)
assert.equal(promotion.source63AffectedReview.sha256, expectedReview)
assert.equal(absolute(promotion.book.path), path.join(source, 'book.json'))
assert.equal(absolute(promotion.source63AffectedReview.path), path.join(ticket, 'source-9g-p63-affected-review.md'))
add(inputsFile, 'actual-assembly-input-map')
add(promotionFile, 'parent-promotion-metadata-only-not-executed')
add(path.join(assembly, 'before-book.json'), 'unchanged-original-before-book', expectedBeforeBook)
add(promotion.book.path, 'resulting-source-book', expectedBook)
add(path.join(assembly, '9-10g/book.json'), 'first-assembly-result-book', expectedBook)
tree(path.join(assembly, 'operations'), 'parent-operations-command-and-output-byte-copies')

const currentInputBindings = []
for (const entry of inputs.inputs) {
  const file = check(entry.path, entry.sha256)
  const isNew = /\/(?:0059|006[0-3])\//.test(file)
  const witness = isNew ? null : priorWitness(file, entry.sha256)
  const retained = witness ? null : add(file, 'actual-assembly-input', entry.sha256, inputsFile)
  currentInputBindings.push({
    sourcePathProvenanceOnly: file,
    sha256: entry.sha256,
    retainedPath: witness?.retainedPath ?? path.join(destination, retained.retainedRelativePath),
    referencedPriorArchive: Boolean(witness),
    runtimeDependency: false,
  })
}
const protectedBindings = []
assert(Array.isArray(inputs.protectedFiles) && Array.isArray(promotion.protectedFiles))
for (const entry of [...inputs.protectedFiles, ...promotion.protectedFiles]) {
  const file = check(entry.path, entry.sha256)
  const witness = priorWitness(file, entry.sha256)
  const retained = witness ? null : add(file, 'unchanged-protected-source-or-approved-draft', entry.sha256)
  if (!protectedBindings.some(binding => binding.sourcePathProvenanceOnly === file)) {
    protectedBindings.push({
      sourcePathProvenanceOnly: file,
      sha256: entry.sha256,
      retainedPath: witness?.retainedPath ?? path.join(destination, retained.retainedRelativePath),
      runtimeDependency: false,
    })
  }
}
for (const page of [59, 60, 61, 62, 63]) {
  const padded = String(page).padStart(4, '0')
  const prepared = path.join(root, '.tmp/ld-s10y-lesson/9-10g/pages', padded)
  for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) regular(path.join(prepared, name))
  tree(prepared, 'current-original-grid-layout-template-and-actual-crops')
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const file = path.join(source, 'pages', padded, name)
    const entry = inputs.inputs.find(candidate => absolute(candidate.path) === file)
    assert(entry, `Final page absent from actual assembly inputs: ${file}`)
    add(file, 'current-final-page-triple', entry.sha256)
  }
}
const mediaInputs = inputs.inputs.filter(entry => /\/fig-(?:6[1-7])\.(?:png|svg)$/.test(entry.path))
assert.equal(mediaInputs.length, 14, 'Exactly seven source PNG/SVG pairs must be bound')
for (const entry of mediaInputs) {
  add(entry.path, 'new-original-figures-61-through67', entry.sha256)
  const assembled = path.join(assembly, '9-10g/figures', path.basename(entry.path))
  add(assembled, 'first-assembly-original-media-copy', entry.sha256)
  const durable = path.join(source, 'figures', path.basename(entry.path))
  add(durable, 'durable-original-media-copy', entry.sha256)
}
const book = json(promotion.book.path)
const newUnits = book.lessons.filter(unit => /-n1[567]$/.test(unit.id))
assert.equal(newUnits.length, 3, 'Derive all three source units from the current book')
for (const unit of newUnits) {
  assert(/^[a-z0-9-]+$/.test(unit.id))
  for (const name of ['lesson.md', 'lesson.json', 'exercises.json']) {
    const current = path.join(source, 'lessons', unit.id, name)
    const firstAssembly = path.join(assembly, '9-10g/lessons', unit.id, name)
    const entry = add(current, 'new-original-source-unit-triple')
    add(firstAssembly, 'first-assembly-source-unit-triple', entry.sha256)
  }
}

// Snapshot/copy fields identify historical bytes; never bind their old hashes to mutable originals.
const snapshotBindings = (value, declaredBy, field = '$') => {
  if (!value || typeof value !== 'object') return
  if (Array.isArray(value)) {
    value.forEach((item, index) => snapshotBindings(item, declaredBy, `${field}[${index}]`))
    return
  }
  const copy = value.snapshot_path ?? value.copy
  if (typeof copy === 'string' && fullHash(value.sha256)) {
    if (excluded(copy)) {
      skips.push({ sourcePathProvenanceOnly: copy, reason: 'declared dependency excluded', declaredBy, field })
    } else {
      const retained = add(copy, 'structured-historical-snapshot', value.sha256, { declaredBy, field })
      bindings.push({
        declaredByProvenanceOnly: declaredBy,
        field,
        originalPathProvenanceOnly: value.path ?? null,
        sha256: value.sha256,
        retainedPath: path.join(destination, retained.retainedRelativePath),
        runtimeDependency: false,
      })
    }
  }
  if (value.exists === false && typeof value.path === 'string') {
    preservedAbsentDeclarations.push({ declaredByProvenanceOnly: declaredBy, field, pathProvenanceOnly: value.path })
  }
  for (const [key, child] of Object.entries(value)) snapshotBindings(child, declaredBy, `${field}.${key}`)
}
for (const file of [
  path.join(ticket, 'source-9g-p60-p63-author.manifest.json'),
  path.join(root, 'tmp/source-9g-p63-author.manifest.json'),
]) snapshotBindings(json(file), file)
const frozenDisclosure = json(path.join(ticket, 'source-9g-p60-p62-corrected-disclosure/disclosure.json'))
for (const key of ['frozenManifest', 'frozenReport', 'preservedBindingFailure']) {
  const entry = frozenDisclosure[key]
  add(entry.path, 'corrected-immutable-disclosure-binding', entry.sha256)
}
const rootManifest = json(path.join(root, 'tmp/source-9g-p63-author.manifest.json'))
for (const entry of rootManifest.evidence_files) {
  if (!excluded(entry.path)) add(entry.absolute_path ?? entry.path, 'complete-root-manifest-evidence', entry.sha256)
}
for (const phase of ['before', 'after']) {
  const manifestFile = path.join(ticket, 'source-9g-p63-targeted-repair', `${phase}.json`)
  const manifest = json(manifestFile)
  for (const entry of [...manifest.targets, ...manifest.crops]) {
    const suffix = /\/figures\//.test(entry.path) ? `figures/${path.basename(entry.path)}` : path.basename(entry.path)
    add(path.join(ticket, 'source-9g-p63-targeted-repair', phase, suffix),
      'sole-targeted-repair-bound-before-after', entry.sha256, { declaredBy: manifestFile, phase })
  }
}

const files = [...planned.values()].sort((a, b) =>
  a.retainedRelativePath.localeCompare(b.retainedRelativePath))
const start = new Date().toISOString()
// Validate the complete copy plan before the exclusive destination claim; no command replay.
for (const entry of files) {
  check(entry.sourcePathProvenanceOnly, entry.sha256)
  assert.equal(fs.statSync(entry.sourcePathProvenanceOnly).size, entry.bytes)
}
fs.mkdirSync(destination)
for (const entry of files) {
  const retained = path.join(destination, entry.retainedRelativePath)
  assert(retained.startsWith(`${destination}${path.sep}`))
  fs.mkdirSync(path.dirname(retained), { recursive: true })
  fs.copyFileSync(entry.sourcePathProvenanceOnly, retained, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(retained), entry.sha256, `Copy mismatch: ${retained}`)
  assert.equal(hash(entry.sourcePathProvenanceOnly), entry.sha256, 'Original changed during retention')
  assert.equal(fs.statSync(retained).size, entry.bytes)
  entry.retainedPath = retained
}
for (const witness of external) check(witness.retainedPath, witness.sha256)
const retention = {
  status: 'SOURCE_PRECURSOR_NOT_COMPLETE',
  ticket: 'STEMROBIN-184',
  role: 'MECHANICAL_BYTE_RETENTION_ONLY',
  frozenAtUtc: new Date().toISOString(),
  scope: { book: '9-10g', newPreparedPages: [59, 60, 61, 62, 63], newOriginalFigures: [61, 62, 63, 64, 65, 66, 67] },
  authorization: {
    explicitGo: true,
    approvedAffectedReviewSha256: expectedReview,
    currentBookSha256: expectedBook,
    reviewClaim: 'Parent consumed full PASS for current bytes only; no new review by retention',
  },
  bookEvidence: {
    beforeBookSha256: expectedBeforeBook,
    currentBookSha256: expectedBook,
    resultingBookRetainedPath: path.join(destination, planned.get(path.join(source, 'book.json')).retainedRelativePath),
    parentRecordedAudit: promotion.audit,
    parentReportedSourceUnits: [
      { id: 'geo910-c1-s2-n15', state: 'closed-source-only', proseObjects: 11, tasks: 5, taskRange: [159, 163], media: 2 },
      { id: 'geo910-c1-s2-n16', state: 'closed-source-only', proseObjects: 17, tasks: 4, taskRange: [164, 167], media: 4 },
      { id: 'geo910-c1-s2-n17', state: 'open' },
    ],
    actualBookUnitMetadata: newUnits,
    reportedFirstAssembly: { exit: 0, tasks: 167, figures: 67, units: 18, pageRange: [8, 63] },
    reportedFirstVectors: { pages: [59, 60, 61, 62, 63], invocationsPerPage: 1, exitPerPage: 0, totalSvg: 7 },
    reportedAdaptPrepare: { units: ['geo910-c1-s2-n15', 'geo910-c1-s2-n16'], invocationsPerUnit: 1, exitPerUnit: 0 },
  },
  limitations: [
    'All first failures, first partial-binding REVISE, corrected disclosure, original reports and sole repairs remain byte exact.',
    'Earlier disclosed manifest ad14607f3f40d7dabdba588f48507fce05791d145fd1e4c2ee73180a8d17cb36 has no retained earlier-byte snapshot, as disclosed; none manufactured.',
    'Retained StageA, StageB, clarification and affected reviews keep their complete original limitations; no source reinterpretation or semantic gate performed.',
    'Approved p63 affected review binds current bytes only; no broader or downstream PASS.',
    'n17 remains open; source64/65 is not assembled here.',
    'Prior source-global inverse gap, F58 tail underdescription, optical UNKNOWN and access exception remain in the referenced n14 checkpoint.',
    '151 separator UNKNOWN and fig54 p-rho UNKNOWN are not cleared; modern fig55 exhausted HOLD and fig56 source-order mismatch are not promoted.',
    'Prior1-13/t14/n14 source triples and approved t14 DRAFT are unchanged raw bindings, not new approvals.',
    'No complete modern lesson, formal answers, choices, official record, glyph-UNKNOWN clearance or promotion is certified.',
  ],
  priorArchives,
  exactPriorDurableRawBindings: external,
  currentInputBindings,
  protectedBindings,
  historicalSnapshotBindings: bindings,
  historicalAbsentDeclarations: preservedAbsentDeclarations,
  exclusionLedger: skips,
  provenancePolicy: {
    originalPaths: 'PROVENANCE_ONLY_NOT_RUNTIME_DEPENDENCIES',
    copiedReportsAndManifests: 'FULL_ORIGINAL_BYTES_WITHOUT_REWRITING_HISTORICAL_PATHS',
    runtimeReads: 'RETAINED_FILES_OR_EXACT_DURABLE_ARCHIVE_BINDINGS_ONLY',
    originalFilesPreserved: true,
    media: 'BLIND_BINARY_COPY_NO_IMAGE_OPENS',
  },
  operations: {
    formalAnswers: 0, choices: 0, sourceWrites: 0, bookWrites: 0,
    toolWrites: 0, templateWrites: 0, imageWritesOutsideCheckpoint: 0,
    sourceCommands: 0, repair: 0, render: 0, reprobe: 0, regate: 0,
    semanticReviews: 0, imageLoads: 0, officialRecords: 0, promotionExecuted: 0,
    gitWrites: 0, databaseOperations: 0, services: 0, browserOperations: 0, agentMessages: 0,
  },
  execution: {
    helper: path.join(destination, planned.get(fileURLToPath(import.meta.url)).retainedRelativePath),
    argv: process.argv.slice(2),
    startedAtUtc: start,
    completedAtUtc: new Date().toISOString(),
    invocationCount: 1,
    result: 'EXCLUSIVE_COPY_AND_RAW_HASH_RETENTION_FINISHED',
  },
  counts: {
    copiedFiles: files.length,
    copiedBytes: files.reduce((total, entry) => total + entry.bytes, 0),
    priorDurableReferencedFiles: external.length,
    assemblyInputBindings: currentInputBindings.length,
    protectedBindings: protectedBindings.length,
    historicalSnapshotBindings: bindings.length,
    mediaFilesCopiedWithoutOpening: files.filter(entry => /\.(?:png|svg|pdf)$/i.test(entry.retainedRelativePath)).length,
    imageLoads: 0,
    retentionManifestAdditionalFiles: 1,
  },
  files,
}
const retentionPath = path.join(destination, 'retention.json')
fs.writeFileSync(retentionPath, `${JSON.stringify(retention, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({
  actualExit: 0,
  status: retention.status,
  copiedFiles: files.length,
  totalCheckpointFiles: files.length + 1,
  copiedBytes: retention.counts.copiedBytes,
  priorDurableReferencedFiles: external.length,
  imageLoads: 0,
  retentionPath,
  retentionSha256: hash(retentionPath),
}, null, 2))

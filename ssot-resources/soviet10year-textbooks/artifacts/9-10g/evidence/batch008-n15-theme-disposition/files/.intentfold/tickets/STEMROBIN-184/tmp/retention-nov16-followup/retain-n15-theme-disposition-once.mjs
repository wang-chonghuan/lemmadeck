import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
const tmp = path.join(root, '.intentfold/tickets/STEMROBIN-184/tmp')
const work = path.join(tmp, 'retention-nov16-followup')
const book = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g')
const edition = path.join(book, 'editions/modern-us-neutral')
const evidenceRoot = path.join(book, 'evidence')
const destination = path.join(evidenceRoot, 'batch008-n15-theme-disposition')
const reportPath = path.join(destination, 'report.md')
const manifestPath = path.join(destination, 'retention.json')
const resultPath = path.join(work, 'n15-theme-disposition-result.json')
const self = fileURLToPath(import.meta.url)
const firstRoot = path.join(tmp, 'geo910-n15-offline-themes')
const repairRoot = path.join(tmp, 'geo910-n15-offline-themes-fig61-scroll-repair')
const htmlRoot = path.join(root, '.tmp/ld-s10y-lesson/render/9-10g/modern-us-neutral/geo910-c1-s2-n15')
const priorN15 = path.join(evidenceRoot, 'retention-nov16-followup-n15-approved-choice')
const priorN17 = path.join(evidenceRoot, 'batch008-n17-figure-disposition')
const rel = file => path.relative(root, file)
const inside = (file, directory) => file === directory || file.startsWith(`${directory}/`)
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const digest = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value)
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const selected = new Map()
const index = new Map()
const protectedFiles = new Map()
const copied = []
const exclusions = []
const unresolved = []
const references = []
const dependencies = []
const forbidden = /(^|\/)(?:node_modules|\.?venv|__pycache__|\.git|\.env(?:\..*)?|credentials?(?:\..*)?|secrets?(?:\..*)?|id_rsa|id_ed25519)(?:\/|$)|\.(?:pyc|pyo|pem|key|p12|pfx)$/i
const runtime = /(^|\/)(?:python(?:\d+(?:\.\d+)*)?|node|uv|activate(?:\..*)?|pyvenv\.cfg)$/
assert.equal(process.cwd(), root)
for (const file of [destination, resultPath]) assert(!fs.existsSync(file), `Immutable output already exists: ${file}`)

function raw(file) {
  file = path.resolve(file)
  assert(inside(file, root) && file !== root, 'Outside workspace')
  if (forbidden.test(file) || runtime.test(file)) {
    exclusions.push({ sourcePathProvenanceOnly: rel(file), reason: 'SECRET_ENVIRONMENT_DEPENDENCY_INTERPRETER_PATH_EXCLUDED', remainsLocal: true })
    return null
  }
  for (let part = file; part !== root; part = path.dirname(part)) {
    let stat
    try { stat = fs.lstatSync(part) } catch (error) {
      if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return null
      throw error
    }
    if (stat.isSymbolicLink()) {
      exclusions.push({ sourcePathProvenanceOnly: rel(part), reason: 'SYMLINK_NOT_FOLLOWED_OR_COPIED', linkText: fs.readlinkSync(part), remainsLocal: true })
      return null
    }
  }
  if (!fs.lstatSync(file).isFile()) return null
  const bytes = fs.readFileSync(file)
  const magic = bytes.subarray(0, 4).toString('hex')
  if (['7f454c46', 'feedface', 'feedfacf', 'cefaedfe', 'cffaedfe', 'cafebabe', 'bebafeca', 'cafebabf', 'bfbafeca'].includes(magic) || bytes.subarray(0, 2).toString() === 'MZ') {
    exclusions.push({ sourcePathProvenanceOnly: rel(file), sha256: hash(bytes), reason: 'EXECUTABLE_RUNTIME_BINARY_EXCLUDED', remainsLocal: true })
    return null
  }
  if (/\.(?:json|md|mjs|js|py|log|txt|svg|css|html)$/.test(file) && /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|(?:postgres(?:ql)?):\/\/[^@\s"']+:[^@\s"']+@|sk-(?:proj-)?[A-Za-z0-9_-]{32,}|gh[pousr]_[A-Za-z0-9]{30,}/.test(bytes.toString('utf8'))) {
    exclusions.push({ sourcePathProvenanceOnly: rel(file), reason: 'POSSIBLE_SECRET_PAYLOAD_EXCLUDED_WITHOUT_DISCLOSURE', remainsLocal: true })
    return null
  }
  return { file, sha256: hash(bytes), bytes: bytes.length }
}

function protect(file, expected) {
  const value = raw(file)
  assert(value, `Required protected bytes unavailable: ${rel(file)}`)
  if (expected) assert.equal(value.sha256, expected, `Existing immutable report changed: ${rel(file)}`)
  protectedFiles.set(file, value)
  return value
}

for (const [file, sha256] of [
  [path.join(priorN15, 'retention.json'), '5c8471299bb787ecb49171cb2c018f553af7440c05121aae8af3085af01022d9'],
  [path.join(priorN15, 'report.md'), '00c9cebc899bb4409cbd07c33438c874557a0f6e84898fc8f657d8c079f80a92'],
  [path.join(priorN17, 'retention.json'), '8ab6c446698b0009877893097c834435733f81c6b1223b5ab079b2b552f32151'],
  [path.join(priorN17, 'report.md'), '04ffff39396107b34080e90cad3f66438b749ef8d95c5619805ab352e5e0bab9'],
]) protect(file, sha256)

// Only manifest metadata is indexed; the old 297-file group is not recopied.
const indexedManifests = []
for (const name of fs.readdirSync(evidenceRoot).sort()) {
  const file = path.join(evidenceRoot, name, 'retention.json')
  if (!fs.existsSync(file)) continue
  const value = raw(file)
  if (!value) continue
  protect(file, value.sha256)
  indexedManifests.push({ path: rel(file), sha256: value.sha256, metadataIndexOnly: true })
  const base = path.dirname(file)
  const visit = item => {
    if (!item || typeof item !== 'object') return
    if (digest(item.sha256)) {
      const locators = [item.retainedPath, item.retainedRelativePath, item.relative, item.relativePath, item.output]
      if (typeof item.path === 'string' && Number.isInteger(item.bytes)) locators.push(item.path)
      for (const locator of locators.filter(item => typeof item === 'string')) {
        const target = path.isAbsolute(locator) ? locator : path.resolve(locator.startsWith('ssot-resources/') ? root : base, locator)
        if (!inside(target, evidenceRoot) || inside(target, destination)) continue
        if (!index.has(item.sha256)) index.set(item.sha256, [])
        if (!index.get(item.sha256).some(candidate => candidate.file === target)) index.get(item.sha256).push({ file: target, manifest: file })
      }
    }
    for (const nested of Object.values(item)) if (nested && typeof nested === 'object') visit(nested)
  }
  visit(read(file))
}
const counterpartCache = new Map()
function counterpart(sha256) {
  if (counterpartCache.has(sha256)) return counterpartCache.get(sha256)
  for (const candidate of index.get(sha256) || []) {
    const observed = raw(candidate.file)
    if (!observed || observed.sha256 !== sha256) continue
    protectedFiles.set(candidate.file, observed)
    const value = { retainedPath: rel(candidate.file), sha256, bytes: observed.bytes, referenceManifest: rel(candidate.manifest) }
    counterpartCache.set(sha256, value)
    return value
  }
  counterpartCache.set(sha256, null)
  return null
}

function select(file, role, expected, forceCopy = false) {
  const value = raw(file)
  if (!value) {
    unresolved.push({ kind: 'REQUESTED_BYTES_UNAVAILABLE_OR_EXCLUDED', sourcePath: rel(file), role, noSubstitution: true })
    return
  }
  if (expected) assert.equal(value.sha256, expected, `Source changed since report: ${rel(file)}`)
  if (selected.has(file)) return selected.get(file)
  const existing = forceCopy ? null : counterpart(value.sha256)
  const target = existing ? path.resolve(root, existing.retainedPath) : path.join(destination, 'files', rel(file))
  const item = { ...value, sourcePathProvenanceOnly: rel(file), role, retainedPath: rel(target), action: existing ? 'REUSED_EXISTING_EXACT_DURABLE_BYTES' : 'NEW_EXCLUSIVE_EXACT_BYTE_COPY', runtimeDependency: false, fullFileExactByteCopy: true }
  selected.set(file, item)
  if (!existing) copied.push({ source: file, target, sha256: item.sha256, bytes: item.bytes })
  return item
}

const firstExpected = {
  'check.mjs': 'd8c548a249c5968bc4397945ca93e0a72912002e431d943a62d631d713f6f2fe',
  'fig-60-accent-640.png': '3c8292ecce43588d158f3d10577eb6f07f69823d09876d1cae6d8b0873a68a38',
  'fig-60-print-640.png': '3c8292ecce43588d158f3d10577eb6f07f69823d09876d1cae6d8b0873a68a38',
  'measurements.json': 'faa5729bf90d05cd7437fed9874d2240eee5d9d98d1895bd74518e2c1b6b5553',
  'report.md': 'aa1df86402201cea61034198ccb39c71bea6e83d82c50e6ed7956d59b618656d',
  'run-once.json': 'bdbed4ddb75c02929e09443077241586aa8d1b9a88baed32de9f25425b38dfe7',
}
const repairExpected = {
  'check.mjs': '5291d8fa884d5412ced01585e649f2d9682d355f128e91d8673e49c8c78cad50',
  'fig-61-accent-left-visible.png': 'f8bbe1acf21fbd578bae344be5d48cf0bf96d405defb5035fa581c21e09d406b',
  'measurements.json': '0f357ae0b3d91ddc94b6f7e62f333a0b8518912863eb8cc53d4be448dd8f21a0',
  'report.md': 'ac5cd15b36fa5feef4fdcc94f51ea5507f9c48ad5762fcea4f0160ae878f7164',
  'run-once.json': '97299e615c48cacbc1e0c90078d64c28c399c096159b57c973a10455467e6e7d',
}
const inventories = []
for (const [directory, expected, role] of [[firstRoot, firstExpected, 'INITIAL_THEME_ATTEMPT_ALL_SIX_ORIGINAL_FILES'], [repairRoot, repairExpected, 'SOLE_FIG61_SCROLL_HARNESS_REPAIR_ALL_FIVE_ORIGINAL_FILES']]) {
  const names = fs.readdirSync(directory).sort()
  assert.deepEqual(names, Object.keys(expected).sort(), 'Bounded directory changed; do not silently broaden scope')
  for (const name of names) select(path.join(directory, name), role, expected[name], true)
  inventories.push({ sourcePathProvenanceOnly: rel(directory), allOriginalFiles: names, fileCount: names.length })
}
select(self, 'THIS_ONCE_ONLY_RAW_RETENTION_HELPER_INERT_SOURCE', undefined, true)
const first = read(path.join(firstRoot, 'measurements.json'))
const repair = read(path.join(repairRoot, 'measurements.json'))
assert.equal(first.status, 'fail-stop-no-repair')
assert.equal(repair.status, 'fail-stop-no-repeat-no-figure-repair')
assert.equal(first.cases.filter(item => item.status === 'pass' && item.figure === 'fig-60').length, 2)
assert.equal(repair.cases.length, 1)
assert.equal(repair.cases[0].figure, 'fig-61')
assert.notEqual(repair.cases[0].status, 'pass')
assert.equal(repair.cases[0].left.screenshot.width, 627)
assert.equal(repair.cases[0].left.screenshot.height, 541)
const currentInputs = []
for (const input of first.inputs) {
  assert(inside(input.path, htmlRoot) && ['text.html', 'exercises.html'].includes(path.basename(input.path)))
  const item = select(input.path, 'EXISTING_EXACT_HTML_INPUT_NO_RENDER_OR_DOM_RECHECK', input.sha256)
  currentInputs.push({
    sourcePathProvenanceOnly: rel(input.path), sha256: input.sha256, retainedPath: item?.retainedPath,
    figure: input.figure, previouslyRecordedInlineSvgSha256: input.inlineSvgSha256,
    inlineDigestKind: 'HISTORICALLY_OBSERVED_EMBEDDED_SVG_NOT_RAW_OFFICIAL_FILE_DIGEST',
    noExtractionOrNewDOMCheck: true,
  })
}
assert.equal(repair.input.sha256, first.inputs.find(item => item.figure === 'fig-61').sha256)

const currentFigureBindings = []
for (const number of [60, 61]) {
  const entries = {}
  for (const ext of ['spec.json', 'render.json', 'review.json', 'svg']) {
    const file = path.join(edition, `figures/fig-${number}.${ext}`)
    const item = select(file, 'CURRENT_DURABLE_FIGURE_PROVENANCE_ONLY_NO_APPROVAL_CHANGE')
    entries[ext] = { pathProvenanceOnly: rel(file), sha256: item?.sha256, retainedPath: item?.retainedPath }
  }
  const review = read(path.join(edition, `figures/fig-${number}.review.json`))
  const sourceFile = path.resolve(root, review.source.path)
  assert(inside(sourceFile, path.join(book, 'figures')) && path.basename(sourceFile) === `fig-${number}.png`)
  const source = select(sourceFile, 'EXISTING_ORIGINAL_SOURCE_HASH_PROVENANCE_ONLY_NO_IMAGE_OPEN', review.source.sha256)
  currentFigureBindings.push({ figure: `fig-${number}`, entries, source: { pathProvenanceOnly: rel(sourceFile), sha256: source?.sha256, retainedPath: source?.retainedPath }, existingReviewStatusPreserved: review.status, themeAggregateApproval: false })
}

// The previous n16 helper is a historical command locator, not an authorized
// new copy source. Reuse already retained bytes if available; otherwise state it.
const inherited = first.inheritedHelper
const inheritedCopy = counterpart(inherited.sha256)
references.push({
  sourcePathProvenanceOnly: rel(inherited.path), sha256: inherited.sha256,
  role: 'INHERITED_N16_HELPER_HISTORICAL_LOCATOR_ONLY_NOT_CURRENT_N16_PROCESSING',
  runtimeDependency: false, retained: Boolean(inheritedCopy), ...(inheritedCopy || {}),
})
if (!inheritedCopy) unresolved.push({
  kind: 'HISTORICAL_INHERITED_HELPER_BYTES_OUTSIDE_APPROVED_COPY_SCOPE',
  sourcePath: rel(inherited.path), sha256: inherited.sha256,
  existingDurableCounterpartFound: false, currentBytesNotReadOrCopied: true,
  notNeededToReadRetainedResults: true, noSubstitution: true,
})
function bind(value, declaringFile, field = '$') {
  if (!value || typeof value !== 'object') return
  if (typeof value.path === 'string' && digest(value.sha256)) {
    const file = path.isAbsolute(value.path) ? value.path
      : path.resolve(/^(?:ssot-resources|\.tmp|\.intentfold|\.agents|\.claude|app)\//.test(value.path) ? root : path.dirname(declaringFile), value.path)
    const selectedItem = selected.get(file)
    const existing = selectedItem?.sha256 === value.sha256 ? null : counterpart(value.sha256)
    const mapping = selectedItem?.sha256 === value.sha256 ? { retainedPath: selectedItem.retainedPath, bytes: selectedItem.bytes } : existing
    const isInherited = file === inherited.path && value.sha256 === inherited.sha256
    dependencies.push({
      sourcePathProvenanceOnly: rel(file), sha256: value.sha256, declaredBy: `${rel(declaringFile)}:${field}`,
      resolved: Boolean(mapping), runtimeDependency: false,
      classification: isInherited ? 'HISTORICAL_HELPER_LOCATOR_NOT_IN_NEW_COPY_SCOPE' : 'EXPLICIT_RETAINED_RAW_FILE_BYTES',
      ...(mapping || {}),
    })
    if (!mapping && !isInherited) unresolved.push({ kind: 'DECLARED_EXACT_BYTES_UNAVAILABLE', sourcePath: rel(file), sha256: value.sha256, noSubstitution: true })
  }
  for (const [key, nested] of Object.entries(value)) if (nested && typeof nested === 'object') bind(nested, declaringFile, `${field}.${key}`)
}
for (const item of selected.values()) if (item.file.endsWith('.json')) bind(read(item.file), item.file)
const missingPlanned = []
for (const [directory, names] of [
  [firstRoot, ['fig-61-accent-640.png', 'fig-61-print-640.png']],
  [repairRoot, ['fig-61-accent-right-visible.png', 'fig-61-print-left-visible.png', 'fig-61-print-right-visible.png']],
]) {
  for (const name of names) {
    const file = path.join(directory, name)
    assert(!fs.existsSync(file), 'Previously absent unrun output appeared; scope must not claim old bytes')
    missingPlanned.push({ historicalPlannedPathOnly: rel(file), existsAtRetention: false, outcome: 'NOT_EXECUTED_OR_NOT_PRODUCED_AFTER_FIRST_FAILURE', notReconstructed: true, notFigureDefectEvidence: true })
  }
}
const disposition = {
  status: 'HOLD_INCOMPLETE_N15_THEME_EVIDENCE',
  authority: 'Parent consumed both original reports and expressly assigned this retention-only disposition.',
  fig60: { accent: 'EXISTING_SCOPED_PASS', actualPrint: 'EXISTING_SCOPED_PASS', noNewInspection: true, fullThemeAggregatePass: false },
  fig61: {
    initialHelperAttempt: 'FAIL_STOP_FIT_AND_LABEL_BOUNDS_BEFORE_PNG',
    soleScrollHarnessRepair: 'FAIL_STOP_FAITHFUL_VISIBLE_CLIP_HEIGHT_ASSERTION',
    recordedLeftVisibleDom: { width: 627.234375, height: 560 },
    recordedLeftScreenshot: { width: 627, height: 541, fullHeightEvidence: false },
    rightEndExecuted: false, actualPrintExecuted: false, rightEndOrPrintPass: false,
    caseStatusRunningInOriginalJsonIsIncompleteNotPass: true,
    noFigureDefectClaim: true, noAdditionalRepair: true,
  },
  whole: 'HOLD', completedLessons: 0, oldUnknownReport: 'UNCHANGED_NOT_RETROACTIVELY_REWRITTEN',
}
const operations = {
  helperExecutions: 1, rawCopyHashVerificationOnly: true,
  imagesOpened: 0, imagesDecoded: 0, browser: 0, renders: 0, validators: 0,
  semanticReviews: 0, gates: 0, newRepairs: 0, database: false, envAccess: false,
  applicationOperations: false, dependencyChanges: false, git: false, staging: false,
  publishing: false, parentPlanEdits: false, otherChatOperations: false,
}
const boundaries = [
  'The only new evidence sources are all six original first-attempt files, all five sole-scroll-repair files, this helper source, the exact existing text/exercises HTML, and current fig60/61 metadata/source hash provenance.',
  'Two distinct original fig60 PNG files have identical bytes. Both original files are retained separately; their equality is not new visual evidence or a screenshot substitution.',
  'All copied reports/JSON/helpers retain their original bytes and historical locators. Manifest mappings supply retained counterparts; historical command locators are not runtime dependencies.',
  'Recorded inline SVG hashes describe embedded observed DOM bytes, not raw official SVG file hashes. Both bindings are preserved without extraction, repair, or a new equivalence claim.',
  'Existing n15 figure-level or choice approval does not close this theme evidence gap. New aggregate status is HOLD; completed whole lessons=0.',
  'No initial failure, old UNKNOWN report, old manifest, current figure, HTML or other worker edit is overwritten. Prior n15 297 files and n17 998 files are not recopied.',
  'Runtime packages, interpreters, executable binaries, secrets, symlinks and environments are excluded. Existing historical path strings remain inert and are never executed.',
  'No source/math/neutral/mobile/full-package/product/PDF/print-pagination verification, additional harness or figure repair, image open, renderer, validator, database or Git operation.',
]
for (const item of [...selected.values(), ...protectedFiles.values()]) assert.equal(raw(item.file)?.sha256, item.sha256, `Concurrent change before retention: ${rel(item.file)}`)
assert(!fs.existsSync(destination))
assert(!fs.existsSync(resultPath))
fs.mkdirSync(destination)
for (const item of copied) {
  fs.mkdirSync(path.dirname(item.target), { recursive: true })
  fs.copyFileSync(item.source, item.target, fs.constants.COPYFILE_EXCL)
  assert.equal(raw(item.target)?.sha256, item.sha256, 'Copied bytes mismatch')
  assert.equal(raw(item.source)?.sha256, item.sha256, 'Source changed during copy')
}
const endHashBindings = [...selected.values()].map(item => {
  const end = raw(item.file)
  assert.equal(end?.sha256, item.sha256, `Concurrent change at end: ${rel(item.file)}`)
  assert.equal(raw(path.resolve(root, item.retainedPath))?.sha256, item.sha256, 'Retained counterpart mismatch')
  return { sourcePathProvenanceOnly: rel(item.file), startSha256: item.sha256, endSha256: end.sha256, unchanged: true }
})
for (const item of protectedFiles.values()) assert.equal(raw(item.file)?.sha256, item.sha256, 'Existing durable changed')
const files = [...selected.values()].map(({ file, ...item }) => item)
const counts = {
  firstAttemptFiles: 6, soleScrollRepairFiles: 5, originalNewEvidenceFiles: 11,
  observedSourcePaths: files.length, newlyCopiedFiles: copied.length,
  newlyCopiedBytes: copied.reduce((sum, item) => sum + item.bytes, 0),
  sourcePathsReusingExistingDurable: files.filter(item => item.action === 'REUSED_EXISTING_EXACT_DURABLE_BYTES').length,
  explicitDependencyDeclarations: dependencies.length,
  unresolvedRequiredByteDependencies: dependencies.filter(item => !item.resolved && item.classification !== 'HISTORICAL_HELPER_LOCATOR_NOT_IN_NEW_COPY_SCOPE').length,
  historicalHelperScopeLimitations: unresolved.filter(item => item.kind === 'HISTORICAL_INHERITED_HELPER_BYTES_OUTSIDE_APPROVED_COPY_SCOPE').length,
  unresolvedRetentionIssues: unresolved.length, skippedUnsafeEntries: exclusions.length,
  missingUnrunPlannedScreenshots: missingPlanned.length, completedWholeLessons: 0, newAggregateApprovals: 0,
}
const report = [
  '# STEMROBIN-184 n15 Theme Disposition Raw Retention',
  '',
  'Status: HOLD_INCOMPLETE_N15_THEME_EVIDENCE. Retention only; no new semantic, image, browser, render, validator or gate work.',
  '',
  `Workspace: ${root}`,
  `Manifest: ${manifestPath}`,
  `Report: ${reportPath}`,
  '',
  '## Preserved Disposition',
  '',
  '- Fig60: existing accent and actual-print scoped PASS only; both original PNGs preserved.',
  '- Fig61 initial attempt: Fit and label bounds assertion failed before PNG. No figure defect established.',
  '- Fig61 sole scroll-harness repair: faithful visible clip assertion failed; recorded 627x541 PNG is shorter than the 627.234375x560 DOM surface.',
  '- Right-end scrolling and fig61 actual print were not executed. Original running case is incomplete, never PASS.',
  '- Whole n15 theme disposition HOLD. No additional repair, aggregate PASS, or whole-lesson completion; count whole=0.',
  '',
  '## Counts',
  '',
  ...Object.entries(counts).map(([key, value]) => `- ${key}: ${value}`),
  '- report.md and retention.json are two additional generated documents, not copied-evidence counts.',
  '',
  '## Exact Inputs And Provenance',
  '',
  ...currentInputs.map(item => `- ${path.resolve(root, item.sourcePathProvenanceOnly)}: raw HTML ${item.sha256}; retained ${path.resolve(root, item.retainedPath)}; historically observed inline SVG ${item.previouslyRecordedInlineSvgSha256}.`),
  ...currentFigureBindings.flatMap(item => Object.entries(item.entries).map(([name, value]) => `- ${item.figure}.${name}: ${value.sha256}; retained ${path.resolve(root, value.retainedPath)}; current official start/end bytes unchanged.`)),
  '',
  '## Limitations',
  '',
  ...(unresolved.length ? unresolved.map(item => `- ${JSON.stringify(item)}`) : ['- No unresolved exact-byte retention dependency in this bounded scope. This is not an approval result.']),
  ...missingPlanned.map(item => `- ${JSON.stringify(item)}`),
  '',
  '## Unchanged Prior Archives',
  '',
  `- ${path.join(priorN15, 'retention.json')}: 5c8471299bb787ecb49171cb2c018f553af7440c05121aae8af3085af01022d9; 297 files not recopied.`,
  `- ${path.join(priorN15, 'report.md')}: 00c9cebc899bb4409cbd07c33438c874557a0f6e84898fc8f657d8c079f80a92; old UNKNOWN unchanged.`,
  `- ${path.join(priorN17, 'retention.json')}: 8ab6c446698b0009877893097c834435733f81c6b1223b5ab079b2b552f32151; unchanged.`,
  '',
  '## Exclusions And Boundaries',
  '',
  ...exclusions.map(item => `- ${JSON.stringify(item)}`),
  ...boundaries.map(item => `- ${item}`),
  '',
].join('\n')
fs.writeFileSync(reportPath, `${report}\n`, { flag: 'wx' })
const reportHash = raw(reportPath).sha256
const manifest = {
  schema: 'STEMROBIN-184/raw-retention@1', ticket: 'STEMROBIN-184', lesson: 'geo910-c1-s2-n15',
  status: disposition.status, operation: 'DISJOINT_BOUNDED_THEME_DISPOSITION_RETENTION_ONLY',
  retainedAtUtc: new Date().toISOString(), manifestPath: rel(manifestPath), reportPath: rel(reportPath),
  reportRawSha256: reportHash, reportBytes: Buffer.byteLength(`${report}\n`),
  disposition, counts, files, dependencyMappings: dependencies, historicalReferences: references,
  currentInputs, currentFigureBindings, inventories, missingPlannedScreenshots: missingPlanned,
  unresolvedRetentionIssues: unresolved, excludedEntries: exclusions, boundaries, operations,
  endHashBindings, protectedExistingDurableBindings: [...protectedFiles.values()].map(item => ({ path: rel(item.file), sha256: item.sha256, bytes: item.bytes, unchanged: true })),
  indexedManifestsMetadataOnly: indexedManifests,
  rawRetentionVerification: { exactCopiedBytes: true, allSelectedStartEndHashesUnchanged: true, priorReportsUnchanged: true, noNewGateResult: true },
}
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, { flag: 'wx' })
const result = {
  status: disposition.status, reportPath, reportSha256: reportHash,
  manifestPath, manifestSha256: raw(manifestPath).sha256, counts,
  helperPath: self, helperSha256: selected.get(self).sha256,
  unresolvedRetentionIssues: unresolved,
  previousN17: { reportPath: path.join(priorN17, 'report.md'), reportSha256: '04ffff39396107b34080e90cad3f66438b749ef8d95c5619805ab352e5e0bab9', manifestPath: path.join(priorN17, 'retention.json'), manifestSha256: '8ab6c446698b0009877893097c834435733f81c6b1223b5ab079b2b552f32151', newCopiedFiles: 141, newCopiedBytes: 933201 },
}
fs.writeFileSync(resultPath, `${JSON.stringify(result, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ ...result, resultPath, resultSha256: raw(resultPath).sha256 }, null, 2))

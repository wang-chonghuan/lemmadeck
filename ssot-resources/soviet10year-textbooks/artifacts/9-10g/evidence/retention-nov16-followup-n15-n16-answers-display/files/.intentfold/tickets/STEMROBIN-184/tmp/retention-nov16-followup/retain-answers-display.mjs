import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
const ticket = 'STEMROBIN-184'
const T = path.join(root, `.intentfold/tickets/${ticket}/tmp`)
const work = path.join(T, 'retention-nov16-followup')
const book = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g')
const edition = path.join(book, 'editions/modern-us-neutral')
const destination = path.join(book, 'evidence/retention-nov16-followup-n15-n16-answers-display')
const manifestFile = path.join(destination, 'retention.json')
const planFile = path.join(work, 'answers-display-plan.json')
const self = fileURLToPath(import.meta.url)
const mode = process.argv[2] || 'plan'
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const relative = file => path.relative(root, file)
const exclusions = []
const issues = []
const selected = new Map()
const bindings = []
const inventories = []
const officialPaths = []
const forbidden = /(^|\/)(node_modules|\.?venv|__pycache__|\.git|\.env(?:\..*)?|credentials?(?:\..*)?|secrets?(?:\..*)?|id_rsa|id_ed25519)(\/|$)|\.(?:pyc|pyo|pem|key|p12|pfx)$/i
const interpreter = /(^|\/)(python(?:\d+(?:\.\d+)*)?|node|uv|activate(?:\..*)?|pyvenv\.cfg)$/
const choice = /(^|\/)[^/]*choice[^/]*(\/|$)/i
const smallText = /\.(?:json|md|mjs|cjs|js|py|log|txt|svg|css|tsx)$/
assert.equal(process.cwd(), root)
assert(['plan', 'copy', 'verify'].includes(mode))

function permitted(file) {
  return file.startsWith(`${root}/`) && !forbidden.test(file) && !interpreter.test(file) && !choice.test(file)
}

function noSymlink(file) {
  for (let current = file; current !== root; current = path.dirname(current)) {
    assert(current.startsWith(`${root}/`), `Outside workspace: ${file}`)
    assert(!fs.lstatSync(current).isSymbolicLink(), `Symlink: ${current}`)
  }
}

function raw(file) {
  assert(permitted(file), `Excluded evidence: ${file}`)
  noSymlink(file)
  assert(fs.lstatSync(file).isFile(), `Not regular evidence: ${file}`)
  const bytes = fs.readFileSync(file)
  assert(!['7f454c46', 'cffaedfe', 'cefaedfe', 'feedfacf', 'feedface', 'cafebabe', 'bebafeca'].includes(bytes.subarray(0, 4).toString('hex')), `Executable: ${file}`)
  assert(bytes.subarray(0, 2).toString() !== 'MZ', `Executable: ${file}`)
  if (smallText.test(file)) {
    assert(!/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|(?:postgres(?:ql)?):\/\/[^@\s"']+:[^@\s"']+@|sk-(?:proj-)?[A-Za-z0-9_-]{32,}|gh[pousr]_[A-Za-z0-9]{30,}/.test(bytes.toString('utf8')), `Possible secret payload: ${file}`)
  }
  return { file, sha256: hash(bytes), bytes: bytes.length }
}

function walk(directory, recordExclusions = false) {
  if (!fs.existsSync(directory)) return []
  noSymlink(directory)
  const result = []
  for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const file = path.join(directory, entry.name)
    if (file === work || file === destination) continue
    if (!permitted(file) || entry.isSymbolicLink()) {
      if (recordExclusions) exclusions.push({ sourcePath: relative(file), reason: 'CHOICE_ENVIRONMENT_SECRET_OR_SYMLINK_NOT_RETAINED' })
    } else if (entry.isDirectory()) {
      result.push(...walk(file, recordExclusions))
    } else if (entry.isFile()) {
      result.push(file)
    } else if (recordExclusions) {
      exclusions.push({ sourcePath: relative(file), reason: 'NOT_REGULAR_FILE' })
    }
  }
  return result
}

function select(file, role = 'REQUESTED_EXACT_BYTE_EVIDENCE') {
  file = path.resolve(root, file)
  if (!permitted(file)) {
    exclusions.push({ sourcePath: relative(file), reason: 'CHOICE_ENVIRONMENT_OR_SECRET_NOT_RETAINED', role })
    return
  }
  if (!fs.existsSync(file)) {
    issues.push({ kind: 'REQUESTED_FILE_UNAVAILABLE', sourcePath: relative(file), role })
    return
  }
  if (!selected.has(file)) selected.set(file, { ...raw(file), roles: [] })
  if (!selected.get(file).roles.includes(role)) selected.get(file).roles.push(role)
}

function directory(file, role) {
  file = path.resolve(root, file)
  const files = walk(file, true)
  inventories.push({ sourcePath: relative(file), files: files.map(relative), role })
  for (const item of files) select(item, role)
}

function normalize(file, base = root) {
  if (path.isAbsolute(file)) return path.normalize(file)
  if (/^(?:\.tmp|\.intentfold|ssot-resources|app|\.agents|\.claude|tmp)\//.test(file)) return path.resolve(root, file)
  return path.resolve(base, file)
}

function bind(source, sha256, declaredBy, base = root, snapshot) {
  if (!/^[a-f0-9]{64}$/.test(sha256 || '')) return
  const file = normalize(source, base)
  const binding = { sourcePath: relative(file), sha256, declaredBy }
  if (snapshot) binding.snapshotPath = relative(normalize(snapshot, base))
  if (!permitted(file)) {
    exclusions.push({ ...binding, reason: 'CHOICE_OR_ENVIRONMENT_METADATA_NOT_A_RETAINED_DEPENDENCY' })
    return
  }
  if (bindings.some(item => JSON.stringify(item) === JSON.stringify(binding))) return
  bindings.push(binding)
  const physical = snapshot ? normalize(snapshot, base) : file
  if (fs.existsSync(physical) && raw(physical).sha256 === sha256) select(physical, 'EXPLICIT_HASH_BOUND_DEPENDENCY')
}

function structured(value, declaredBy, base = root) {
  if (!value || typeof value !== 'object') return
  if (Array.isArray(value)) {
    value.forEach((item, index) => structured(item, `${declaredBy}[${index}]`, base))
    return
  }
  if (typeof value.path === 'string' && typeof value.sha256 === 'string') bind(value.path, value.sha256, declaredBy, base, value.snapshot)
  for (const [key, item] of Object.entries(value)) structured(item, `${declaredBy}.${key}`, base)
}

function tablePath(cell) {
  const link = /\[[^\]]+\]\(([^)]+)\)/.exec(cell)
  const code = /^`([^`]+)`/.exec(cell)
  const value = link?.[1] || code?.[1] || cell
  return /\/.+\.[a-z0-9]+$/i.test(value) ? value : undefined
}

function markdown(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/)
  for (const [index, line] of lines.entries()) {
    if (line.startsWith('|')) {
      const cells = line.split('|').slice(1, -1).map(cell => cell.trim())
      const source = cells.map(tablePath).find(Boolean)
      const digest = cells.map(cell => /^`?([a-f0-9]{64})`?$/.exec(cell)?.[1]).find(Boolean)
      if (source && digest) bind(source, digest, `${relative(file)}:table-line-${index + 1}`)
    }
    const source = /(?:^Path:\s*|^)(?:`)([^`]+\/[^`]+\.[a-z0-9]+)`\.?$/i.exec(line)?.[1]
    if (source) {
      for (const following of lines.slice(index + 1, index + 4)) {
        const digest = /SHA-256:\s*`([a-f0-9]{64})`/.exec(following)?.[1]
        if (digest) bind(source, digest, `${relative(file)}:labelled-path-line-${index + 1}`)
      }
    }
  }
}

function snapshotDependency(source, declaredBy, role) {
  const file = normalize(source)
  if (!permitted(file)) {
    exclusions.push({ sourcePath: relative(file), declaredBy, reason: 'ENVIRONMENT_OR_CHOICE_REFERENCE_ONLY' })
    return
  }
  if (!fs.existsSync(file)) {
    issues.push({ kind: 'REFERENCED_FILE_UNAVAILABLE', sourcePath: relative(file), declaredBy })
    return
  }
  select(file, role)
  bind(file, selected.get(file).sha256, `${declaredBy}:CURRENT_OBSERVED_BYTES_NOT_EXECUTION_VERSION_PROOF`)
}

function verify() {
  const manifest = read(manifestFile)
  assert.deepEqual(manifest.capture, read(planFile), 'Manifest capture differs from frozen plan')
  for (const entry of manifest.capture.files) assert.equal(raw(path.join(root, entry.retainedPath)).sha256, entry.sha256)
  for (const item of manifest.capture.dependencyMappings) {
    if (item.retainedPath) assert.equal(raw(path.join(root, item.retainedPath)).sha256, item.sha256)
  }
  for (const item of manifest.endHashBindings.files) {
    assert.equal(raw(path.join(root, item.retainedPath)).sha256, item.endSha256)
    assert.equal(raw(path.join(root, item.sourcePath)).sha256, item.endSha256, 'Official bytes changed after capture')
  }
  const files = walk(destination)
  const expected = [relative(manifestFile), ...manifest.capture.files.filter(item => item.action === 'NEW_EXCLUSIVE_COPY').map(item => item.retainedPath)]
  assert.deepEqual(files.map(relative).sort(), expected.sort())
  for (const file of files) assert.equal(fs.statSync(file).mode & 0o222, 0)
  const result = {
    operation: 'RAW_RETENTION_VERIFICATION_ONLY_NO_SEMANTICS_OR_GATES',
    manifestPath: relative(manifestFile), manifestSha256: raw(manifestFile).sha256,
    counts: manifest.capture.counts, actualNewFilesIncludingManifest: files.length,
    actualNewBytesIncludingManifest: files.reduce((sum, file) => sum + fs.statSync(file).size, 0),
    endHashBindings: manifest.endHashBindings,
    unresolvedRetentionIssues: manifest.capture.unresolvedRetentionIssues,
    inheritedLimitations: manifest.capture.inheritedLimitations,
  }
  fs.writeFileSync(path.join(work, 'answers-display-verify-result.json'), `${JSON.stringify(result, null, 2)}\n`, { flag: 'wx' })
  console.log(JSON.stringify(result, null, 2))
}

if (mode === 'verify') {
  verify()
  process.exit(0)
}
assert(!fs.existsSync(destination), 'Separate follow-up already exists; never overwrite')
noSymlink(path.dirname(destination))
const mainReports = [
  'geo910-n14-n16-standard-answer-independent-review.md',
  'geo910-n14-n16-standard-answer-independent-review-addendum.md',
  'geo910-n14-n16-standard-answer-independent-review-final-affected-addendum.md',
  'geo910-n15-offline-display-independent-review.md',
  'n15-n16-offline-parent-display.md',
]
for (const name of [
  'geo910-n14-n16-standard-answer-prose-first.json',
  'geo910-n14-n16-standard-answer-prose-second-rejected.json',
  'geo910-n14-n16-standard-answer-prose.json',
  ...mainReports,
]) select(path.join(T, name))
for (const name of mainReports) markdown(path.join(T, name))
directory(path.join(T, 'n14-n16-production'), 'ALL_EXISTING_PRODUCTION_COMMAND_LOGS_AND_BINDINGS_NOT_EXECUTED')
directory(path.join(T, 'n15-n16-unicode-prefix-repair'), 'FULL_FIRST_DISPLAY_FREEZE_AND_PREFIX_REPAIR_EVIDENCE')
for (const number of [15, 16]) {
  const id = `geo910-c1-s2-n${number}`
  directory(`.tmp/ld-s10y-answer/9-10g/modern-us-neutral/lessons/${id}`, 'FORMAL_TEMPLATE_CANDIDATE_AND_REPAIRED_CANDIDATE')
  directory(path.join(T, `offline/${id}`), 'ALL_CURRENT_OFFLINE_FILES')
  directory(`.tmp/ld-s10y-lesson/render/9-10g/modern-us-neutral/${id}`, 'ALL_CURRENT_OFFLINE_HTML_NO_RENDER')
  for (const name of ['lesson.template.json', 'exercises.template.json', 'figures.template.json']) {
    select(`.tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/${id}/${name}`, 'CURRENT_TEMPLATE_BINDING_BYTES')
  }
  for (const name of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json', 'answer-keys.json', 'answer-keys.audit.json']) {
    const file = path.join(edition, `lessons/${id}/${name}`)
    select(file, 'CURRENT_FINALIZED_OUTPUT_OR_PROTECTED_INPUT_BYTES')
    if (name.startsWith('answer-keys.') && fs.existsSync(file)) officialPaths.push(file)
  }
}
for (const name of [
  'advance-modern-n14-n16.first-helper.mjs', 'advance-modern-n14-n16.mjs',
  'retain-approved-figures.before-absolute-source.mjs', 'retain-approved-figures.mjs',
  'bind-n15-n16-formal-answer-candidates.mjs', 'n15-n16-unicode-prefix-affected.mjs',
  'unicode-circle-prefix-focused.cjs', 'offline-check.mjs',
]) select(path.join(T, name), 'INERT_HELPER_OR_FOCUSED_FIXTURE_SOURCE_NOT_EXECUTED')
select('.claude/skills/ld-s10y-lesson/tools/render_lesson.js', 'CHANGED_RENDERER_BYTES_ONLY_NOT_EXECUTED')
select(self, 'RETENTION_HELPER_SOURCE_NOT_ARCHIVE_RUNTIME_DEPENDENCY')
select(path.join(work, 'answers-display-scope.md'), 'RETENTION_SCOPE')

const prior = [
  ['n14-text', 'fc9fade690177f45fee7db1fef2bc401da26838c8149d2be2f041d5133d8baab'],
  ['n14-figures', 'd06b0f8f5f6b40204f04d6ecc8d5c9ac0352d7fdfa161d5c967acaa1309b0424'],
  ['n15-n16-figures', '3a57f0acb96a8b5f49dad48933591980c3199b7a90a6d0049259d4989db415e4'],
].map(([id, sha256]) => {
  const file = path.join(book, `evidence/retention-nov16-followup-${id}/retention.json`)
  assert.equal(raw(file).sha256, sha256, 'Existing retention changed')
  select(file, 'UNCHANGED_PREEXISTING_RETENTION_REFERENCE_NO_RECOPY')
  return { path: relative(file), sha256 }
})

// Resolve only explicit file dependencies; captured helper source is not run.
const parsed = new Set()
function parseSelected() {
  const pending = [...selected.keys()].filter(file => /\.json$/.test(file) && !relative(file).includes('/evidence/') && !parsed.has(file))
  for (const file of pending) {
    parsed.add(file)
    const value = read(file)
    const base = /\/figures\/fig-\d+\./.test(file) ? edition : root
    if (value.schema === 'ld-s10y-lesson/edition-figures@1' || file.endsWith('/figures.template.json')) {
      for (const figure of value.figures || []) {
        for (const kind of ['png', 'svg']) {
          const source = figure.source?.[kind]
          if (source) bind(source.path, source.sha256, `${relative(file)}:${figure.id}:original-${kind}`, book)
        }
        for (const key of ['spec', 'svg', 'render', 'review']) {
          if (typeof figure[key] === 'string') {
            const dependency = normalize(figure[key], edition)
            select(dependency, 'EXPLICIT_FIGURE_METADATA_DEPENDENCY_NOT_BLIND_ASSET_COPY')
            if (selected.has(dependency)) bind(dependency, selected.get(dependency).sha256, `${relative(file)}:${figure.id}:${key}:OBSERVED_BYTES`)
          }
        }
      }
    } else {
      structured(value, relative(file), base)
    }
    for (const answer of value.answers || []) {
      for (const figure of answer.figureEvidence || []) {
        for (const key of ['originalPng', 'editionAsset', 'figureSpec']) {
          if (typeof figure[key] === 'string') snapshotDependency(figure[key], `${relative(file)}:${figure.id}:${key}`, 'EXPLICIT_FORMAL_ANSWER_FIGURE_DEPENDENCY')
        }
      }
    }
    if (Array.isArray(value.results)) {
      for (const [index, result] of value.results.entries()) {
        if (result.screenshot && result.screenshotSha256) bind(result.screenshot, result.screenshotSha256, `${relative(file)}:results[${index}].screenshot`)
        if (result.kind && result.fileSha256) bind(`.tmp/ld-s10y-lesson/render/9-10g/modern-us-neutral/${value.lesson}/${result.kind}.html`, result.fileSha256, `${relative(file)}:results[${index}].html`)
      }
    }
    if (Array.isArray(value.args)) {
      for (const argument of value.args) {
        if (typeof argument === 'string' && /^(?:\.claude|\.agents|\.intentfold)\//.test(argument) && /\.(?:py|mjs|cjs|js)$/.test(argument)) {
          snapshotDependency(argument, relative(file), 'CAPTURED_COMMAND_HELPER_CURRENT_OBSERVED_BYTES_ONLY')
        }
      }
    }
  }
  return pending.length
}
while (parseSelected()) {}

const index = new Map()
const addIndex = item => {
  if (!index.has(item.sha256)) index.set(item.sha256, [])
  if (!index.get(item.sha256).some(entry => entry.file === item.file)) index.get(item.sha256).push(item)
}
const sizes = new Set([...selected.values()].map(item => item.bytes))
for (const file of walk(path.join(book, 'evidence'))) {
  const bytes = fs.statSync(file).size
  if (sizes.has(bytes) || (smallText.test(file) && bytes < 100000)) addIndex(raw(file))
}
for (const file of walk(path.join(root, 'ssot-resources/soviet10year-textbooks/sources'))) {
  if (/\.pdf$/i.test(file) && sizes.has(fs.statSync(file).size)) addIndex(raw(file))
}
const scratch = new Map()
const wanted = new Set(bindings.map(item => item.sha256))
for (const directoryName of ['.tmp', `.intentfold/tickets/${ticket}/tmp`, 'tmp']) {
  for (const file of walk(path.join(root, directoryName))) {
    if (!smallText.test(file) || fs.statSync(file).size > 100000) continue
    const item = raw(file)
    if (wanted.has(item.sha256) && !scratch.has(item.sha256)) scratch.set(item.sha256, item)
  }
}
for (let cursor = 0; cursor < bindings.length; cursor++) {
  const binding = bindings[cursor]
  const match = [...selected.values()].find(item => item.sha256 === binding.sha256)
    || index.get(binding.sha256)?.[0] || scratch.get(binding.sha256)
  if (match) {
    select(match.file, 'RESOLVED_EXACT_HISTORICAL_DEPENDENCY_BYTES')
    binding.resolvedPhysicalSource = relative(match.file)
    while (parseSelected()) {}
  }
}

const files = []
const plannedByHash = new Map()
for (const item of [...selected.values()].sort((a, b) => a.file.localeCompare(b.file))) {
  const existing = (index.get(item.sha256) || []).filter(entry => entry.bytes === item.bytes)
    .sort((a, b) => a.file.length - b.file.length || a.file.localeCompare(b.file))[0]
  const shared = plannedByHash.get(item.sha256)
  const retainedPath = existing ? relative(existing.file) : shared || relative(path.join(destination, 'files', relative(item.file)))
  files.push({
    sourcePath: relative(item.file), sha256: item.sha256, bytes: item.bytes, retainedPath,
    action: existing ? 'REUSED_PREEXISTING_DURABLE_BYTES' : shared ? 'REUSED_IDENTICAL_FOLLOWUP_BYTES' : 'NEW_EXCLUSIVE_COPY',
    roles: item.roles, fullFileExactByteCopy: true,
  })
  if (!existing && !shared) plannedByHash.set(item.sha256, retainedPath)
}
const dependencyMappings = bindings.map(binding => {
  const entry = files.find(file => file.sha256 === binding.sha256)
  if (!entry) issues.push({ kind: 'EXACT_HISTORICAL_VERSION_UNAVAILABLE', ...binding, noReconstructionOrSubstitution: true })
  return { ...binding, resolved: Boolean(entry), ...(entry ? { retainedPath: entry.retainedPath } : {}) }
})
const uniqueIssues = [...new Map(issues.map(issue => [JSON.stringify([issue.kind, issue.sourcePath, issue.sha256]), issue])).values()]
const capture = {
  schema: 's10y-disjoint-answers-display-retention-capture-v1',
  ticket, date: '2026-11-16', id: 'n15-n16-answers-display',
  manifestPath: relative(manifestFile), priorRetention: prior,
  disposition: {
    role: 'RETENTION_ONLY_NOT_NEW_APPROVAL_OR_COMPLETION',
    currentProse: 'EXISTING_AUTHORIZED_AFFECTED_PASS_WITH_REUSED_PRIOR_RESULTS',
    firstAndSecondProse: 'REJECTED_VERSIONS_AND_ORIGINAL_FINDINGS_UNCHANGED',
    finalizedAnswers: 'EXISTING_FINALIZED_OUTPUT_BYTES_ONLY_NO_FINALIZE_RERUN',
    firstOfflineDisplay: 'ORIGINAL_VISUAL_FAIL_AND_MECHANICAL_PASS_COEXIST_UNCHANGED',
    repairedDisplay: 'EXISTING_PREFIX_REPAIR_AND_PARENT_OFFLINE_CLOSURE_LIMITS_UNCHANGED',
    choices: 'CURRENT_UNAPPROVED_CHOICE_AUTHOR_OUTPUTS_EXCLUDED',
    lessonOrTicketCompletion: false, promotion: false, publication: false,
  },
  operations: {
    rawRetentionOnly: true, semanticReviews: 0, gateReruns: 0, fixtureRuns: 0,
    rendererRuns: 0, imageLoads: 0, browserRuns: 0, pipelineExecutions: 0,
    database: false, publisher: false, applicationRunsOrChanges: false,
    dependencyChanges: false, GitOrHistory: false, otherChats: false,
    existingFilesModified: false, parentPlanOrUsageUpdated: false,
  },
  provenancePolicy: {
    historicalPaths: 'OBSERVED_ONLY_RESOLVE_SOURCE_PATH_AND_RAW_SHA256_THROUGH_DEPENDENCY_MAPPINGS',
    originalReportAndMetadataBytesUnmodified: true,
    helperSources: 'INERT_EVIDENCE_NOT_RUNTIME_DEPENDENCIES_OR_EXECUTION_VERSION_PROOF_UNLESS_EXPLICITLY_HASH_BOUND',
    dynamicOfficialAnswers: 'CAPTURE_PLUS_END_OF_COPY_RAW_HASH_BINDING_NOT_A_PERMANENT_MUTABLE_PATH_GUARANTEE',
    runtimeDependencies: [], interpretersEnvironmentsSecretsRetained: false,
  },
  helper: { sourcePath: relative(self), sha256: raw(self).sha256 },
  sourceInventories: inventories, files, dependencyMappings,
  excludedReferences: exclusions, unresolvedRetentionIssues: uniqueIssues,
  inheritedLimitations: [
    {
      sourcePath: '.tmp/s10y-image/9-10g/fig-60/fig-60.svg',
      sha256: 'ccdde12d94d65c486383643409ca5692e66afb2567bd4dd51294dc42e5df7afc',
      status: 'INITIAL_SVG_UNAVAILABLE_NO_RESEARCH_RECONSTRUCTION_OR_COPY_IN_THIS_GROUP',
      priorManifest: prior[2].path,
    },
    {
      sourcePath: '.tmp/s10y-image/9-10g/fig-61/fig-61.svg',
      sha256: 'faa0033e0bd1612317ba398c6da40da1baf3f500b5c7d37f02417b4cc92955ff',
      status: 'INITIAL_SVG_UNAVAILABLE_NO_RESEARCH_RECONSTRUCTION_OR_COPY_IN_THIS_GROUP',
      priorManifest: prior[2].path,
    },
  ],
  requestedDisplayReportObservedPath: relative(path.join(T, 'geo910-n15-offline-display-independent-review.md')),
  officialAnswerCapture: officialPaths.map(file => {
    const item = files.find(entry => entry.sourcePath === relative(file))
    return { sourcePath: item.sourcePath, captureSha256: item.sha256, bytes: item.bytes, retainedPath: item.retainedPath }
  }),
  counts: {
    evidenceFileMappings: files.length,
    uniqueRetainedFiles: new Set(files.map(file => file.retainedPath)).size,
    newlyCopiedFiles: files.filter(file => file.action === 'NEW_EXCLUSIVE_COPY').length,
    newlyCopiedBytes: files.filter(file => file.action === 'NEW_EXCLUSIVE_COPY').reduce((sum, file) => sum + file.bytes, 0),
    reusedPreexistingMappings: files.filter(file => file.action === 'REUSED_PREEXISTING_DURABLE_BYTES').length,
    reusedIdenticalFollowupMappings: files.filter(file => file.action === 'REUSED_IDENTICAL_FOLLOWUP_BYTES').length,
    dependencyMappings: dependencyMappings.length, unresolvedRetentionIssues: uniqueIssues.length,
    officialAnswerEndHashBindingsRequired: officialPaths.length,
    totalNewFilesIncludingManifest: files.filter(file => file.action === 'NEW_EXCLUSIVE_COPY').length + 1,
  },
}
if (mode === 'plan') {
  fs.writeFileSync(planFile, `${JSON.stringify(capture, null, 2)}\n`, { flag: 'wx' })
  console.log(JSON.stringify({ operation: 'RAW_RETENTION_PLAN_ONLY', counts: capture.counts, issues: uniqueIssues }, null, 2))
  process.exit(0)
}
assert.deepEqual(JSON.parse(JSON.stringify(capture)), read(planFile), 'Concurrent inventory or byte change; preserve existing files and do not copy')
fs.mkdirSync(destination)
for (const entry of files) {
  const source = path.join(root, entry.sourcePath)
  const retained = path.join(root, entry.retainedPath)
  assert.equal(raw(source).sha256, entry.sha256, `Source changed: ${source}`)
  if (entry.action === 'NEW_EXCLUSIVE_COPY') {
    fs.mkdirSync(path.dirname(retained), { recursive: true })
    fs.copyFileSync(source, retained, fs.constants.COPYFILE_EXCL)
    fs.chmodSync(retained, 0o444)
  }
  assert.equal(raw(retained).sha256, entry.sha256, `Retained bytes mismatch: ${retained}`)
}
for (const item of files) assert.equal(raw(path.join(root, item.sourcePath)).sha256, item.sha256, 'Source changed during retention')
for (const item of dependencyMappings) {
  if (item.retainedPath) assert.equal(raw(path.join(root, item.retainedPath)).sha256, item.sha256)
}
const endHashBindings = {
  role: 'END_OF_COPY_RAW_FILE_BINDING_ONLY',
  observedAt: new Date().toISOString(),
  files: capture.officialAnswerCapture.map(item => {
    const actual = raw(path.join(root, item.sourcePath))
    assert.equal(actual.sha256, item.captureSha256, 'Current official answer/audit changed before end binding')
    return { ...item, endSha256: actual.sha256, matchesCapture: true }
  }),
}
const manifest = { schema: 's10y-disjoint-answers-display-retention-v1', capture, endHashBindings }
fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`, { flag: 'wx', mode: 0o444 })
const result = {
  operation: 'EXCLUSIVE_RAW_RETENTION_COPY_ONLY',
  manifestPath: relative(manifestFile), manifestSha256: raw(manifestFile).sha256,
  counts: capture.counts, endHashBindings, unresolvedRetentionIssues: uniqueIssues,
}
fs.writeFileSync(path.join(work, 'answers-display-copy-result.json'), `${JSON.stringify(result, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify(result, null, 2))

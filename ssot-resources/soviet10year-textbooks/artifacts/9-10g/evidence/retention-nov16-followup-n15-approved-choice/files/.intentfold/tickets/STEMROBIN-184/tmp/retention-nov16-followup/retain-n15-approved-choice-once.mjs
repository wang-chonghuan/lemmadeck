import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
const ticket = 'STEMROBIN-184'
const tmp = path.join(root, `.intentfold/tickets/${ticket}/tmp`)
const work = path.join(tmp, 'retention-nov16-followup')
const book = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g')
const edition = path.join(book, 'editions/modern-us-neutral')
const id = 'geo910-c1-s2-n15'
const modern = path.join(edition, 'lessons', id)
const target = path.join(modern, 'choice-set')
const evidence = path.join(book, 'evidence/retention-nov16-followup-n15-approved-choice')
const manifestPath = path.join(evidence, 'retention.json')
const reportPath = path.join(evidence, 'report.md')
const self = fileURLToPath(import.meta.url)
const resultPath = path.join(work, 'n15-choice-retention-result.json')
const scratchReport = path.join(work, 'n15-choice-retention-report.md')
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const rel = file => path.relative(root, file)
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const files = new Map()
const index = new Map()
const dependencies = []
const issues = []
const inventories = []
const dynamic = new Set()
const noParse = new Set()
const forbidden = /(^|\/)(node_modules|\.?venv|__pycache__|\.git|\.env(?:\..*)?|credentials?(?:\..*)?|secrets?(?:\..*)?|id_rsa|id_ed25519)(\/|$)|\.(?:pyc|pyo|pem|key|p12|pfx)$/i
const interpreter = /(^|\/)(python(?:\d+(?:\.\d+)*)?|node|uv|activate(?:\..*)?|pyvenv\.cfg)$/
const n16 = /(^|\/)(?:geo910-c1-s2-n16|geo910-n16[^/]*|n16-[^/]*|fig-6[2-5])(?:\/|$)|\/fig-6[2-5]\./
const text = /\.(?:json|md|mjs|cjs|js|py|log|txt|svg|css|html)$/
assert.equal(process.cwd(), root)
for (const file of [target, evidence, resultPath, scratchReport]) {
  assert(!fs.existsSync(file), `Exclusive destination already exists: ${file}`)
}

function safe(file) {
  assert(file.startsWith(`${root}/`) && !forbidden.test(file) && !interpreter.test(file), `Forbidden evidence: ${file}`)
  assert(!n16.test(file), `n16 is outside scope: ${file}`)
  for (let part = file; part !== root; part = path.dirname(part)) {
    assert(part.startsWith(`${root}/`) && !fs.lstatSync(part).isSymbolicLink(), `Symlink or outside root: ${part}`)
  }
}

function raw(file) {
  safe(file)
  assert(fs.statSync(file).isFile(), `Not a regular file: ${file}`)
  const bytes = fs.readFileSync(file)
  assert(!['7f454c46', 'cffaedfe', 'cefaedfe', 'feedfacf', 'feedface', 'cafebabe', 'bebafeca'].includes(bytes.subarray(0, 4).toString('hex')), `Executable: ${file}`)
  assert(bytes.subarray(0, 2).toString() !== 'MZ', `Executable: ${file}`)
  if (text.test(file)) {
    assert(!/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|(?:postgres(?:ql)?):\/\/[^@\s"']+:[^@\s"']+@|sk-(?:proj-)?[A-Za-z0-9_-]{32,}|gh[pousr]_[A-Za-z0-9]{30,}/.test(bytes.toString('utf8')), `Possible secret payload: ${file}`)
  }
  return { file, sha256: hash(bytes), bytes: bytes.length }
}

function walk(directory) {
  if (!fs.existsSync(directory)) return []
  const result = []
  for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const file = path.join(directory, entry.name)
    if (forbidden.test(file) || interpreter.test(file) || n16.test(file) || entry.isSymbolicLink()) continue
    if (entry.isDirectory()) result.push(...walk(file))
    else if (entry.isFile()) result.push(file)
  }
  return result
}

function select(file, role, parse = true, isDynamic = false) {
  file = path.resolve(root, file)
  if (!fs.existsSync(file)) {
    issues.push({ kind: 'REQUESTED_FILE_UNAVAILABLE', sourcePath: rel(file), role, noSubstitution: true })
    return
  }
  const isNew = !files.has(file)
  if (isNew) files.set(file, { ...raw(file), roles: [] })
  if (!files.get(file).roles.includes(role)) files.get(file).roles.push(role)
  if (isNew && !parse) noParse.add(file)
  if (isDynamic) dynamic.add(file)
}

function directory(file, role, predicate = () => true) {
  const names = walk(file).filter(predicate)
  inventories.push({ sourcePath: rel(file), role, fileCount: names.length, files: names.map(rel) })
  for (const name of names) select(name, role)
}

function addIndex(item) {
  if (!index.has(item.sha256)) index.set(item.sha256, [])
  if (!index.get(item.sha256).some(value => value.file === item.file)) index.get(item.sha256).push(item)
}

function normalize(value, base = root) {
  if (path.isAbsolute(value)) return path.normalize(value)
  return path.resolve(/^(?:\.tmp|\.intentfold|ssot-resources|\.agents|\.claude|app)\//.test(value) ? root : base, value)
}

function bind(sourcePath, sha256, declaredBy, base = root, kind = 'RAW_FILE_SHA256') {
  if (!/^[a-f0-9]{64}$/.test(sha256 || '')) return
  const file = normalize(sourcePath, base)
  const value = { sourcePath: rel(file), sha256, digestKind: kind, declaredBy }
  if (n16.test(file)) return
  if (!dependencies.some(item => JSON.stringify(item) === JSON.stringify(value))) dependencies.push(value)
  if (kind === 'RAW_FILE_SHA256' && fs.existsSync(file) && raw(file).sha256 === sha256) {
    select(file, 'EXACT_HASH_BOUND_DEPENDENCY')
  }
}

// The skill contract's canonical JSON digest is not a raw file digest.
function canonical(value) {
  const encode = item => {
    if (Array.isArray(item)) return `[${item.map(encode).join(',')}]`
    if (item && typeof item === 'object') {
      return `{${Object.keys(item).sort().map(key => `${JSON.stringify(key)}:${encode(item[key])}`).join(',')}}`
    }
    return JSON.stringify(item)
  }
  return hash(encode(value).replace(/[\u007f-\uffff]/g, character => `\\u${character.charCodeAt(0).toString(16).padStart(4, '0')}`))
}

const triplet = [
  ['seed', 'geo910-n15-choice-seed.json', '82f1fd1612b771d07daa7a3413c1f22fb7c926dd16bc19e2845855ee510ccd01'],
  ['draft', 'geo910-n15-choice-draft.json', '9f61e1d6f719824b543f8a670f697153753de2547675e316f69319e1865616a1'],
  ['review', 'geo910-n15-choice-independent-review-repaired.json', 'f0f5a0b5f8ac24a5b7c20cef308fe061a4a3d0bdfc404c1813c681286573e312'],
].map(([kind, name, sha256]) => {
  const file = path.join(tmp, name)
  assert.equal(raw(file).sha256, sha256, 'Approved source changed since read')
  select(file, 'CURRENT_APPROVED_TRIPLET_EXACT_BYTES', true, true)
  files.get(file).fixedDestination = path.join(target, `${kind}.json`)
  return { kind, file, sha256, canonicalSha256: canonical(read(file)) }
})
assert.equal(triplet[0].canonicalSha256, '2c596f209e0dd6a1bd07c074f2b0dd9703be5cb506994d6bbc3b48d252916c70')
assert.equal(triplet[1].canonicalSha256, '0e1db13722819b5ed8fd532fd298339125970a963b5d085e772dd556ff8e2ba6')
const approvedReview = read(triplet[2].file)
assert.equal(approvedReview.outcome, 'pass')
assert.equal(approvedReview.reviewer.kind, 'independent_agent')
assert.equal(approvedReview.seed_sha256, triplet[0].canonicalSha256)
assert.equal(approvedReview.draft_sha256, triplet[1].canonicalSha256)
for (const entry of triplet) {
  assert(!/\.intentfold\/|\.tmp\/|(?:^|["\s])tmp\/|(?:^|["\s])T\//.test(fs.readFileSync(entry.file, 'utf8')), 'Current choice JSON has scratch dependency')
}

for (const name of fs.readdirSync(tmp).filter(name => name.startsWith('geo910-n15-choice-') && fs.statSync(path.join(tmp, name)).isFile())) {
  select(path.join(tmp, name), 'N15_EXISTING_AUTHOR_REVIEW_AND_PROVENANCE_HISTORY_UNMODIFIED')
}
directory(path.join(tmp, 'geo910-n15-choice-book-trace-before'), 'N15_ORIGINAL_REJECTED_SEED_AND_DRAFT')
directory(path.join(tmp, 'geo910-n15-choice-figure-view'), 'ORIGINAL_AUTHOR_FIGURE_VIEW_BYTES_NO_IMAGE_OPEN')
for (const name of ['n15-choice-definition-affected-display.md', 'n15-n16-choice-offline-independent-display.md']) {
  select(path.join(tmp, name), 'HISTORICAL_DISPLAY_TEXT_NO_NEW_REVIEW', false)
}
directory(path.join(tmp, 'offline', id), 'N15_EXISTING_FULL_AFFECTED_AND_INHERITED_OFFLINE_BYTES')
directory(path.join(root, '.tmp/ld-s10y-lesson/render/9-10g/modern-us-neutral', id), 'N15_EXISTING_HTML_BYTES_NO_RENDER')
for (const name of ['lesson', 'exercises', 'figures', 'adaptation.audit', 'answer-keys', 'answer-keys.audit']) {
  select(path.join(modern, `${name}.json`), 'INHERITED_N15_OFFICIAL_OUTPUT_END_BINDING', true, true)
}
for (const number of [60, 61]) {
  for (const name of ['spec.json', 'render.json', 'review.json', 'svg']) {
    select(path.join(edition, `figures/fig-${number}.${name}`), 'INHERITED_N15_PROMOTED_FIGURE_METADATA_OR_ASSET_NO_MUTATION', true, true)
  }
}
const prior = [
  ['retention-nov16-followup-n15-n16-figures', '3a57f0acb96a8b5f49dad48933591980c3199b7a90a6d0049259d4989db415e4'],
  ['retention-nov16-followup-n15-n16-answers-display', '836fdb4dff4562a5fe58463a19d642f0ed73878692fa7748ba66afb78b17b916'],
].map(([name, sha256]) => {
  const file = path.join(book, 'evidence', name, 'retention.json')
  assert.equal(raw(file).sha256, sha256, 'Inherited retention manifest changed')
  select(file, 'UNCHANGED_INHERITED_RETENTION_REFERENCE', false)
  const record = read(file).capture || read(file)
  for (const entry of [...record.files, ...(record.dependencyMappings || [])]) {
    if (!entry.retainedPath || n16.test(entry.retainedPath)) continue
    const retained = path.join(root, entry.retainedPath)
    if (fs.existsSync(retained)) {
      const actual = raw(retained)
      assert.equal(actual.sha256, entry.sha256, 'Existing counterpart disagrees with manifest')
      addIndex(actual)
    }
  }
  return { path: rel(file), sha256 }
})
for (const name of [
  'geo910-n15-n16-modern-text-author.md', 'geo910-n15-n16-modern-text-independent-review.md',
  'geo910-n14-n16-standard-answer-independent-review.md',
  'geo910-n14-n16-standard-answer-independent-review-addendum.md',
  'geo910-n14-n16-standard-answer-independent-review-final-affected-addendum.md',
  'geo910-n15-offline-display-independent-review.md', 'n15-n16-offline-parent-display.md',
]) select(path.join(tmp, name), 'INHERITED_N15_TEXT_ANSWER_FIGURE_AND_DISPLAY_REPORT_REFERENCE', false)
select(self, 'RETENTION_HELPER_SOURCE_INERT_NOT_RUNTIME_DEPENDENCY', false)
select(path.join(work, 'n15-choice-scope.md'), 'HUMAN_BOUND_RETENTION_SCOPE', false)

const four = [3, 4, 7, 10].map(number => `geo910-c1-s1-n${number}`)
for (const lesson of four) {
  directory(path.join(tmp, 'provenance-before-current/9-10g', lesson), 'PRIOR_APPROVED_CHOICE_SET_PROVENANCE_BEFORE_CURRENT')
  for (const name of ['seed', 'draft', 'review']) {
    select(path.join(edition, 'lessons', lesson, 'choice-set', `${name}.json`), 'PRIOR_APPROVED_CHOICE_CURRENT_BYTES_CAPTURE_ONLY', true, true)
  }
}
const rebindReports = []
for (const directoryName of [
  'prepare-n13-rebind9g-through49', 'assembly-9g-p8-p55/operations',
  'assembly-9g-p8-p58/operations', 'assembly-9g-p8-p63/operations',
]) {
  for (const suffix of ['command.json', 'stdout.txt', 'stderr.txt']) {
    const file = path.join(tmp, directoryName, `prior-choice-trace.${suffix}`)
    select(file, 'EXISTING_FOUR_APPROVED_CHOICE_REBIND_COMMAND_EVIDENCE_NO_EXECUTION', false)
    if (suffix === 'stdout.txt' && fs.existsSync(file)) {
      const records = fs.readFileSync(file, 'utf8').trim().split(/\r?\n/).filter(line => line.startsWith('{')).map(line => JSON.parse(line))
      for (const record of records) {
        assert(four.includes(record.lesson), 'Unrelated choice set in optional evidence')
        for (const key of ['prior_book_sha256', 'current_book_sha256']) bind(path.join(book, 'book.json'), record[key], `${rel(file)}:${record.lesson}:${key}`)
      }
      rebindReports.push({ sourcePath: rel(file), records })
    }
  }
}
for (const name of ['rebind-book-trace.py', 'rebind-book-trace.before-scalar-serialization.py', 'rebind-choice-provenance-once.py']) {
  select(path.join(tmp, name), 'INERT_ORIGINAL_PROVENANCE_HELPER_SOURCE_NO_EXECUTION', false)
}

// Only explicit file/hash pairs are dependencies; canonical package bindings
// are resolved separately, never matched against a raw file hash.
function structured(value, declaredBy, base = root) {
  if (!value || typeof value !== 'object') return
  if (typeof value.path === 'string' && typeof value.sha256 === 'string') bind(value.path, value.sha256, declaredBy, base)
  if (value.asset_path && value.asset_sha256) bind(value.asset_path, value.asset_sha256, `${declaredBy}:asset`)
  if (value.screenshot && value.screenshotSha256) bind(value.screenshot, value.screenshotSha256, `${declaredBy}:screenshot`)
  for (const [key, item] of Object.entries(value)) structured(item, `${declaredBy}.${key}`, base)
}
const parsed = new Set()
function parseSelected() {
  const pending = [...files.keys()].filter(file => file.endsWith('.json') && !parsed.has(file) && !noParse.has(file) && !rel(file).includes('/evidence/'))
  for (const file of pending) {
    parsed.add(file)
    const value = read(file)
    structured(value, rel(file), book)
    for (const figure of value.schema === 'ld-s10y-lesson/edition-figures@1' ? value.figures : []) {
      for (const key of ['spec', 'svg', 'render', 'review']) {
        if (typeof figure[key] !== 'string') continue
        const source = normalize(figure[key], edition)
        if (fs.existsSync(source)) bind(source, raw(source).sha256, `${rel(file)}:${figure.id}:${key}:OBSERVED_CURRENT_BYTES`)
      }
    }
    if (value.htmlSha256) {
      const name = path.basename(file).replace(/-report\.json$/, '.html')
      bind(path.join(root, '.tmp/ld-s10y-lesson/render/9-10g/modern-us-neutral', id, name), value.htmlSha256, `${rel(file)}:html`)
    }
    for (const result of value.results || []) {
      if (result.kind && result.fileSha256) {
        bind(path.join(root, '.tmp/ld-s10y-lesson/render/9-10g/modern-us-neutral', id, `${result.kind}.html`), result.fileSha256, `${rel(file)}:${result.kind}:html`)
      }
    }
  }
  return pending.length
}
while (parseSelected()) {}
const handoff = read(path.join(tmp, 'geo910-n15-choice-handoff.json'))
for (const key of ['seed', 'draft', 'learner_views_json']) {
  bind(handoff[`${key}_path`], handoff[`${key}_sha256`], `ORIGINAL_AUTHOR_HANDOFF:${key}`, root, 'CANONICAL_JSON_SHA256')
}
for (const key of ['learner_views_markdown', 'solve_checkpoint', 'figure_render']) {
  bind(handoff[`${key}_path`], handoff[`${key}_bytes_sha256`], `ORIGINAL_AUTHOR_HANDOFF:${key}`)
}
const rebound = read(path.join(tmp, 'geo910-n15-choice-book-trace-rebinding.json'))
for (const key of ['prior_book_sha256', 'current_book_sha256']) bind(path.join(book, 'book.json'), rebound[key], `N15_PROVENANCE_ONLY:${key}`)
bind(path.join(tmp, 'geo910-n15-choice-draft.json'), rebound.current_draft_sha256, 'N15_INTERMEDIATE_PROVENANCE_ONLY_DRAFT', root, 'CANONICAL_JSON_SHA256')
bind(path.join(tmp, 'geo910-n15-choice-seed.json'), '44ab111e16ac35919a1286e3b29741e4d443911bb8f25f9f050e8a7e587fd2dc', 'N15_STAGE1_ORIGINAL_SEED_RAW')
const expected = {
  'geo910-n15-choice-independent-source-first.md': '7b5cab1757d90eab76407653412602f54e1b490c8327a92e8feda508e50f0d6d',
  'geo910-n15-choice-independent-view-only.md': 'ee3d2a187fffe8b4cc0baccc065f1a73b1ee05e56c60ae693529851a957c8f87',
  'geo910-n15-choice-independent-review-rejected-1.json': '226ecd0d87605588e58dc2207f473a38a566a0b559768be89d93a3add714070d',
  'geo910-n15-choice-book-trace-before/geo910-n15-choice-draft.json': 'bdc8f4e9b34c6e495ad43c89f15219087351e9326a6eeb62ee3d3bc7ec9b64b1',
  'n15-n16-choice-offline-independent-display.md': 'c26aaa7398530db8a448844d1e7aba21593df2bacae5d0211333c59e3bb566eb',
}
for (const [name, sha256] of Object.entries(expected)) assert.equal(raw(path.join(tmp, name)).sha256, sha256, 'Historical evidence was changed')
const definition = path.join(book, 'lessons/geo910-c1-s2-n14/lesson.md')
select(definition, 'EXACT_AUTHORITATIVE_N14_DEFINITION_FILE_REFERENCED_BY_STAGE3', false)
const definitionLine = fs.readFileSync(definition, 'utf8').match(/[^\n]*\n|[^\n]+$/g)[34]
assert.equal(hash(definitionLine), '18ba6ef2ae2715c96c33f50b6c46cd7db654ad61368597ac923df744f17f893a', 'Referenced line changed')

// Size-filtered raw comparison avoids recopying historical PNGs. No images are
// decoded or displayed, and no unrelated scratch/environment tree is read.
const sizes = new Set([...files.values()].map(item => item.bytes))
for (const file of walk(path.join(book, 'evidence'))) {
  if (sizes.has(fs.statSync(file).size) || file.endsWith('.json') || (text.test(file) && fs.statSync(file).size < 100000)) addIndex(raw(file))
}
for (let cursor = 0; cursor < dependencies.length; cursor++) {
  const item = dependencies[cursor]
  if (item.digestKind !== 'RAW_FILE_SHA256') continue
  const source = [...files.values()].find(file => file.sha256 === item.sha256) || index.get(item.sha256)?.[0]
  if (source) {
    select(source.file, 'RESOLVED_EXACT_HISTORICAL_VERSION', false)
    item.resolvedPhysicalSource = rel(source.file)
  }
}

const canonicalIndex = new Map()
for (const item of files.values()) {
  if (!item.file.endsWith('.json') || noParse.has(item.file) || rel(item.file).includes('/evidence/')) continue
  const digest = canonical(read(item.file))
  if (!canonicalIndex.has(digest)) canonicalIndex.set(digest, item)
}
const mappings = []
const planned = new Map()
const bySource = new Map()
const order = [...files.values()].sort((a, b) => Number(Boolean(b.fixedDestination)) - Number(Boolean(a.fixedDestination)) || a.file.localeCompare(b.file))
for (const item of order) {
  const existing = index.get(item.sha256)?.filter(entry => entry.bytes === item.bytes).sort((a, b) => a.file.length - b.file.length || a.file.localeCompare(b.file))[0]
  const shared = planned.get(item.sha256)
  const retainedPath = rel(item.fixedDestination || existing?.file || shared || path.join(evidence, 'files', rel(item.file)))
  const action = item.fixedDestination ? 'NEW_APPROVED_CHOICE_SET_EXCLUSIVE_COPY' : existing ? 'REUSED_PREEXISTING_DURABLE_BYTES' : shared ? 'REUSED_IDENTICAL_FOLLOWUP_BYTES' : 'NEW_EVIDENCE_EXCLUSIVE_COPY'
  const entry = { sourcePath: rel(item.file), retainedPath, sha256: item.sha256, bytes: item.bytes, action, roles: item.roles, exactFullFileBytes: true }
  mappings.push(entry)
  bySource.set(item.file, entry)
  if (item.fixedDestination || (!existing && !shared)) planned.set(item.sha256, path.join(root, retainedPath))
}
const dependencyMappings = dependencies.map(item => {
  const source = item.digestKind === 'CANONICAL_JSON_SHA256' ? canonicalIndex.get(item.sha256) : [...files.values()].find(file => file.sha256 === item.sha256)
  const counterpart = source && bySource.get(source.file)
  if (!counterpart) issues.push({ kind: item.digestKind === 'CANONICAL_JSON_SHA256' ? 'CANONICAL_VERSION_FULL_FILE_UNAVAILABLE' : 'EXACT_HISTORICAL_VERSION_UNAVAILABLE', ...item, noReconstructionOrSubstitution: true })
  return { ...item, resolved: Boolean(counterpart), ...(counterpart ? { retainedPath: counterpart.retainedPath, retainedRawSha256: counterpart.sha256 } : {}) }
})
const inherited = {
  role: 'FILE_PRESENCE_HASH_AND_EXISTING_METADATA_ONLY_NOT_SEMANTIC_REVIEW',
  outputs: ['lesson', 'exercises', 'figures', 'adaptation.audit', 'answer-keys', 'answer-keys.audit'].map(name => bySource.get(path.join(modern, `${name}.json`))),
  proseBlockCount: read(path.join(modern, 'lesson.json')).prose.length,
  renderedParagraphCountDeclaredByExistingReport: 14,
  writtenExerciseCount: read(path.join(modern, 'exercises.json')).count,
  officialAnswerCount: read(path.join(modern, 'answer-keys.json')).answers.length,
  officialAnswerAudit: read(path.join(modern, 'answer-keys.audit.json')),
  figures: [60, 61].map(number => ({
    id: `fig-${number}`,
    declaredReviewStatus: read(path.join(edition, `figures/fig-${number}.review.json`)).status,
    files: ['spec.json', 'render.json', 'review.json', 'svg'].map(name => bySource.get(path.join(edition, `figures/fig-${number}.${name}`))),
    scope: 'EXISTING_SOURCE_CURRENT_FIDELITY_AND_NATIVE_640PX_ONLY; FIG61_PRIOR_SPEC_EXPOSURE_QUALIFICATION_RETAINED',
  })),
  display: 'EXISTING_FULL_TEXT_AND_EXERCISE_REPORTS_FIRST_VISUAL_FAIL_PLUS_PREFIX_AFFECTED_CLOSURE_RETAINED; NO_NEW_DISPLAY_PASS',
  themePrint: 'UNKNOWN: NO_SCOPED_ACCENT_AND_PRINT_DISPLAY_EVIDENCE_FOUND; CSS_VARIABLE_ROLES_AND_UNAPPROVED_HEADED_FRAGMENT_ARE_NOT_ACCEPTANCE',
  initialSvgLimitations: [
    { figure: 'fig-60', sha256: 'ccdde12d94d65c486383643409ca5692e66afb2567bd4dd51294dc42e5df7afc', status: 'INHERITED_INITIAL_SVG_UNAVAILABLE_NOT_COPIED_OR_RECONSTRUCTED' },
    { figure: 'fig-61', sha256: 'faa0033e0bd1612317ba398c6da40da1baf3f500b5c7d37f02417b4cc92955ff', status: 'INHERITED_INITIAL_SVG_UNAVAILABLE_NOT_COPIED_OR_RECONSTRUCTED' },
  ],
  mobileLimits: 'CHOICE_FIGURE_RIGHT_END_ONLY_LEFT_282PX_UNKNOWN; EARLIER_WRITTEN_FIG61_ENDPOINTS_LEAVE_20PX_UNSAMPLED_STRIP; NO_TOUCH_OR_INTERMEDIATE_SCROLL_PROOF',
}
const oldSeed = path.join(tmp, 'geo910-n15-choice-book-trace-before/geo910-n15-choice-seed.json')
const oldDraft = path.join(tmp, 'geo910-n15-choice-book-trace-before/geo910-n15-choice-draft.json')
const oldReview = path.join(tmp, 'geo910-n15-choice-independent-review-rejected-1.json')
const history = {
  old: [oldSeed, oldDraft, oldReview].map(file => ({ ...bySource.get(file), canonicalSha256: canonical(read(file)), declaredOutcome: file === oldReview ? 'revise' : undefined })),
  current: triplet.map(item => ({ kind: item.kind, ...bySource.get(item.file), canonicalSha256: item.canonicalSha256 })),
  intermediateDraftCanonicalSha256: rebound.current_draft_sha256,
  originalViews: [path.join(tmp, 'geo910-n15-choice-views.json'), path.join(tmp, 'geo910-n15-choice-views.md')].map(file => bySource.get(file)),
  repairedStandaloneViews: 'NO_NEW_FULL_LEARNER_VIEW_JSON_OR_FULL_REPAIRED_CHOICES_HTML_SYNTHESIZED; ORIGINAL_VIEWS_ARE_HISTORICAL_ONLY',
}
const uniqueIssues = [...new Map(issues.map(item => [JSON.stringify([item.kind, item.sourcePath, item.sha256]), item])).values()]
const newCopies = mappings.filter(item => item.action.startsWith('NEW_'))
const counts = {
  fileMappings: mappings.length,
  uniqueRetainedMappedFiles: new Set(mappings.map(item => item.retainedPath)).size,
  newChoiceSetFiles: newCopies.filter(item => item.action === 'NEW_APPROVED_CHOICE_SET_EXCLUSIVE_COPY').length,
  newEvidenceCopies: newCopies.filter(item => item.action === 'NEW_EVIDENCE_EXCLUSIVE_COPY').length,
  newCopiedBytes: newCopies.reduce((sum, item) => sum + item.bytes, 0),
  reusedPreexistingMappings: mappings.filter(item => item.action === 'REUSED_PREEXISTING_DURABLE_BYTES').length,
  reusedIdenticalFollowupMappings: mappings.filter(item => item.action === 'REUSED_IDENTICAL_FOLLOWUP_BYTES').length,
  dependencyMappings: dependencyMappings.length,
  unresolvedRetentionIssues: uniqueIssues.length,
  priorApprovedChoiceSetsProvenanceOnly: four.length,
  dynamicSourceEndBindings: dynamic.size,
  totalNewDurableFilesIncludingManifestAndReport: newCopies.length + 2,
}
const validation = {
  role: 'EXISTING_COMMAND_RESULT_DECLARATIONS_RETAINED_NOT_RERUN',
  final: {
    source: bySource.get(path.join(tmp, 'geo910-n15-choice-independent-affected-addendum.md')),
    declaredInvocations: 1, declaredExitCode: 0,
    declaredOutput: 'mechanical checks passed; declared semantic review: pass (not automatically proved)',
    separateStandaloneCommandStdoutStderrFile: 'NOT_LOCATED_NO_RECONSTRUCTION; RESULT_IS_PRESERVED_IN_ORIGINAL_ADDENDUM',
  },
  firstAuthorMechanicalOnly: handoff.validation,
}
const priorChoiceCapture = four.map(lesson => ({
  lesson,
  current: ['seed', 'draft', 'review'].map(name => {
    const file = path.join(edition, 'lessons', lesson, 'choice-set', `${name}.json`)
    return { ...bySource.get(file), canonicalSha256: canonical(read(file)) }
  }),
  historical: mappings.filter(item => item.sourcePath.startsWith(rel(path.join(tmp, 'provenance-before-current/9-10g', lesson)) + '/')),
}))
const capture = {
  schema: 's10y-approved-n15-choice-retention-v1', ticket, date: '2026-11-16',
  operation: 'RETENTION_ONLY_NOT_APPROVAL_PUBLICATION_OR_COMPLETION',
  manifestPath: rel(manifestPath), reportPath: rel(reportPath), priorRetention: prior,
  counts, files: mappings, dependencyMappings, history, inheritedN15: inherited,
  existingValidationEvidence: validation, priorChoiceCapture, existingRebindReports: rebindReports,
  sourceInventories: inventories, unresolvedRetentionIssues: uniqueIssues,
  limitations: [
    'Historical report/command/metadata tmp paths are observation locators resolved through raw or canonical dependency mappings, never runtime dependencies.',
    'Current choice-set JSON has no scratch path dependencies; all three approved files are exact original bytes.',
    'Original author checkpoint, old seed/draft, Stage1/2 freezes and first rejected review remain unchanged; repaired PASS is a distinct review.',
    'Original full choice screenshots bind pre-repair views. Q1/Q2 have affected screenshots; Q3-Q7 reuse is an existing declaration, not a new full display run.',
    'Original n15 display P3 Q7-D column overrun and mobile Q7-B/F punctuation wraps remain recorded; mobile left figure region remains UNKNOWN.',
    'Combined n15/n16 text is retained whole; n16 locators and findings remain historical out-of-scope text, with no n16 file capture.',
    'The unrelated 6-8g provenance-before directory is not retained in this bounded scope.',
    'Available four-choice rebind command reports cover older book hashes through 34ae066f8c13. Current snapshots bind d58eaec04808; no separate latest d58 rebind command log was located or recreated.',
    'Inert retained helpers do not prove an execution version unless a preexisting explicit raw binding does so. No interpreters, environments or secrets are retained.',
  ],
  operations: {
    helperInvocations: 1, rawRetentionChecksOnly: true, semanticReviews: 0,
    validatorRuns: 0, gateReruns: 0, browserRuns: 0, imageOpens: 0, rendererRuns: 0,
    database: false, environment: false, applicationChangesOrRuns: false,
    dependencyChanges: false, GitHistoryStageCommit: false, publisher: false,
    otherChats: false, n16Operations: false, parentPlanUsageUpdates: false,
    existingFilesOverwritten: false, runtimeDependencies: [],
  },
}

fs.mkdirSync(evidence)
fs.mkdirSync(target)
for (const item of mappings) {
  const source = path.join(root, item.sourcePath)
  const retained = path.join(root, item.retainedPath)
  assert.equal(raw(source).sha256, item.sha256, `Concurrent source change: ${source}`)
  if (item.action.startsWith('NEW_')) {
    fs.mkdirSync(path.dirname(retained), { recursive: true })
    fs.copyFileSync(source, retained, fs.constants.COPYFILE_EXCL)
    fs.chmodSync(retained, 0o444)
  }
  assert.equal(raw(retained).sha256, item.sha256, `Retained bytes mismatch: ${retained}`)
}
for (const item of mappings) assert.equal(raw(path.join(root, item.sourcePath)).sha256, item.sha256, 'Source changed during retention')
for (const item of dependencyMappings) {
  if (item.resolved) assert.equal(raw(path.join(root, item.retainedPath)).sha256, item.retainedRawSha256)
}
const endHashBindings = {
  role: 'CAPTURE_AND_END_OF_COPY_RAW_BINDING_ONLY_NOT_PERMANENT_MUTABLE_PATH_GUARANTEE',
  observedAt: new Date().toISOString(),
  files: [...dynamic].sort().map(file => {
    const entry = bySource.get(file)
    const actual = raw(file)
    assert.equal(actual.sha256, entry.sha256, 'Dynamic source changed before end binding')
    return { sourcePath: entry.sourcePath, retainedPath: entry.retainedPath, captureSha256: entry.sha256, endSha256: actual.sha256, matchesCapture: true }
  }),
}
const table = (entries, label) => [
  `## ${label}`, '', '| Source / Role | Raw SHA-256 | Retained Path |',
  '| --- | --- | --- |',
  ...entries.map(item => `| ${item.kind || item.sourcePath} | ${item.sha256} | ${item.retainedPath} |`), '',
].join('\n')
const report = [
  '# n15 Approved Choice: Raw Retention Report', '',
  `Ticket: ${ticket}. Date: 2026-11-16. Workspace: ${root}.`,
  'Disposition: RETENTION ONLY. No new semantic/display approval, publication, lesson completion or ticket completion.', '',
  `Manifest: ${manifestPath}`,
  'The manifest raw hash is externally bound by the accompanying scratch result JSON; no self-hash recursion.', '',
  '## Counts', '', '```json', JSON.stringify(counts, null, 2), '```', '',
  table(history.current, 'Current Approved Triplet'),
  table(history.old, 'Original Rejected History'),
  '## Canonical Digests', '',
  ...history.current.map(item => `- Current ${item.kind}: ${item.canonicalSha256}.`),
  ...history.old.map(item => `- Original ${path.basename(item.sourcePath)}: ${item.canonicalSha256}.`),
  `- Intermediate provenance-only draft: ${history.intermediateDraftCanonicalSha256}; full bytes unavailable unless resolved in the manifest.`,
  'Canonical JSON digests are not raw file hashes. No missing snapshot was synthesized.', '',
  '## Existing Results, Not Reruns', '',
  'The final repaired independent review declares pass and binds the captured seed/draft canonical digests.',
  'The existing affected addendum records one official validator invocation, exit 0, with the original output:',
  '`mechanical checks passed; declared semantic review: pass (not automatically proved)`.',
  'The older author handoff still declares semantic review pending. Original REVISE and Stage 1/2/3 remain unchanged.',
  'There is no new validation invocation or invented standalone stdout/stderr capture.', '',
  '## Inherited n15 Evidence', '',
  `Observed files: ${inherited.proseBlockCount} prose blocks; existing report declares 14 rendered paragraphs; ${inherited.writtenExerciseCount} written exercises; ${inherited.officialAnswerCount} official answers.`,
  'The six official output files, five answers/audit, fig60/61 original source and promoted metadata/assets have exact durable counterparts.',
  'Their presence/hashes and existing status fields were inspected only; no source solve, answer comparison or figure inspection was repeated.',
  'Existing first-prefix visual FAIL and mechanical PASS coexist in history; the prefix affected closure is separate.',
  `Theme/print evidence: ${inherited.themePrint}.`,
  `Mobile bounds: ${inherited.mobileLimits}.`,
  'Missing initial fig60/61 SVG bytes remain an inherited retention limitation, not a current SVG substitute:', '',
  ...inherited.initialSvgLimitations.map(item => `- ${item.figure}: ${item.sha256}; ${item.status}.`), '',
  '## Full Versus Affected Choice Display', '',
  'The original full 1440/390 screenshots and HTML remain pre-repair snapshots. Their independent text retains qualified visible-text/control display PASS, P3 findings, and mobile figure UNKNOWN.',
  'Affected Q1/Q2 reports, four screenshots and HTML are preserved separately. Existing Q3-Q7 display reuse is not a new full-current screenshot or visual certificate.',
  'Original learner-view JSON/Markdown and solve checkpoint remain historical; no repaired standalone learner views were manufactured.', '',
  '## Four Prior Choice Sets', '',
  `Provenance-only retention: ${four.join(', ')}.`,
  'All surviving scoped provenance-before-current triplets and available through49/55/58/63 command reports are mapped.',
  'Current four official triplets are retained with end hashes without modification. Their book trace matches the captured current book bytes.',
  'No separate latest d58 rebind command capture was located; historical command success is not relabelled as a current validator run.', '',
  '## Retention Issues', '', '```json', JSON.stringify(uniqueIssues, null, 2), '```', '',
  '## End Hash Bindings', '', '```json', JSON.stringify(endHashBindings, null, 2), '```', '',
  '## Boundary', '',
  ...capture.limitations.map(value => `- ${value}`), '',
  'Only this helper ran once. Raw file comparison/copy/hash verification only; no images opened, browser/validator/gate/renderer/DB/env/app/dependency/Git/history/publisher/chat/parent plan operation.',
  'New evidence and the approved triplet were created exclusively; no old file was overwritten. The exact source-to-counterpart inventory is in retention.json.', '',
].join('\n')
fs.writeFileSync(reportPath, report, { flag: 'wx', mode: 0o444 })
const reportBinding = raw(reportPath)
const manifest = { ...capture, endHashBindings, reportRawSha256: reportBinding.sha256, reportBytes: reportBinding.bytes }
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, { flag: 'wx', mode: 0o444 })
const actualNew = [...walk(evidence), ...walk(target)]
const expectedNew = [...newCopies.map(item => path.join(root, item.retainedPath)), reportPath, manifestPath].sort()
assert.deepEqual(actualNew.sort(), expectedNew)
for (const file of actualNew) assert.equal(fs.statSync(file).mode & 0o222, 0)
for (const item of mappings) assert.equal(raw(path.join(root, item.retainedPath)).sha256, item.sha256)
for (const item of prior) assert.equal(raw(path.join(root, item.path)).sha256, item.sha256)
for (const item of endHashBindings.files) assert.equal(raw(path.join(root, item.sourcePath)).sha256, item.endSha256)
fs.copyFileSync(reportPath, scratchReport, fs.constants.COPYFILE_EXCL)
assert.equal(raw(scratchReport).sha256, reportBinding.sha256)
const result = {
  operation: 'RAW_RETENTION_VERIFICATION_ONLY',
  manifestPath, manifestSha256: raw(manifestPath).sha256,
  reportPath, reportSha256: reportBinding.sha256, scratchReportPath: scratchReport,
  counts, actualNewDurableFileCount: actualNew.length,
  actualNewDurableBytes: actualNew.reduce((sum, file) => sum + fs.statSync(file).size, 0),
  oldAndNewRawHashes: history, unchangedPriorManifestHashes: prior,
  unresolvedRetentionIssues: uniqueIssues, inheritedLimitations: inherited.initialSvgLimitations,
  themePrintStatus: inherited.themePrint, helperInvocations: 1,
}
fs.writeFileSync(resultPath, `${JSON.stringify(result, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ manifestPath, manifestSha256: result.manifestSha256, reportPath, reportSha256: result.reportSha256, resultPath, counts, actualNewDurableFileCount: actualNew.length, unresolvedRetentionIssues: uniqueIssues }, null, 2))

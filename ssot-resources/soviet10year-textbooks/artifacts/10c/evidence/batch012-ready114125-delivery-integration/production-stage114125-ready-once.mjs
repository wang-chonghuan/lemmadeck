import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184'
const root = 'ssot-resources/soviet10year-textbooks/artifacts/10c'
const evidence = `${root}/evidence/batch012-ready114125-delivery-integration`
const manifestPath = `${ticket}/tmp/production-stage114125-ready-files.json`
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const git = args => execFileSync('git', args, { encoding: 'utf8' })
const lessons = ['ana10-c8-s2-n114', 'ana10-c9-s2-n125']
assert(!fs.existsSync(evidence) && !fs.existsSync(manifestPath))
assert.equal(git(['branch', '--show-current']).trim(), 'codex/STEMROBIN-184-textbooks')
assert.equal(git(['diff', '--cached', '--name-only', '-z']), '')
assert.equal(git(['rev-parse', 'HEAD']).trim(),
  git(['rev-parse', 'origin/codex/STEMROBIN-184-textbooks']).trim())

const bindings = []
for (const [number, id] of [[114, lessons[0]], [125, lessons[1]]]) {
  const promotionRoot = `${root}/evidence/batch012-${number === 114 ? '114-canonical-promotion' : '125-promotion'}/promotion`
  const decision = read(`${promotionRoot}/decision.json`)
  assert.equal(decision.status, 'APPROVED_OFFLINE_ONLY')
  for (const key of ['retainedVisualManifest', 'retainedFindings']) {
    const binding = decision[key]
    assert.equal(hash(fs.readFileSync(binding.path)), binding.sha256)
    bindings.push(binding)
  }
  const promotion = read(`${promotionRoot}/promotion.json`)
  for (const binding of promotion.copies) {
    assert.equal(hash(fs.readFileSync(binding.to)), binding.sha256)
    bindings.push({ path: binding.to, sha256: binding.sha256 })
  }
  const modern = `${root}/editions/modern-us-neutral/lessons/${id}`
  assert.equal(read(`${modern}/adaptation.audit.json`).status, 'pass')
  assert.equal(read(`${modern}/answer-keys.audit.json`).status, 'pass')
  assert.deepEqual(fs.readdirSync(`${modern}/choice-set`), ['README.md'])
}
for (const file of ['book.json', 'editions/modern-us-neutral/book.json']) {
  const current = read(`${root}/${file}`)
  const previous = JSON.parse(git(['show', `HEAD:${root}/${file}`]))
  assert.deepEqual(current.lessons.filter(row => !lessons.includes(row.id)), previous.lessons)
  assert.deepEqual(current.audit, previous.audit)
}

const scopes = [
  ...lessons.flatMap(id => [`${root}/lessons/${id}`,
    `${root}/editions/modern-us-neutral/lessons/${id}`]),
  ...[168, 169, 170, 171, 220, 221].map(number =>
    `${root}/pages/${String(number).padStart(4, '0')}`),
  ...[
    'batch012-114-canonical-promotion',
    'batch012-114-first-modern-empty-answer',
    'batch012-114-math-erratum-before-registration',
    'batch012-114-offline-first-harness-failure',
    'batch012-114-offline-harness-correction',
    'batch012-114-text172-first',
    'batch012-125-factorial-layout-before-repair',
    'batch012-125-first-boundary-failure-and221-retry',
    'batch012-125-first-modern-empty-answer',
    'batch012-125-first-modern-text',
    'batch012-125-first-offline',
    'batch012-125-promotion',
    'batch012-source168-author155-retry156-first',
    'batch012-native144-151-and168-171-stageA',
    'batch012-source168-stageB172-author166-first',
    'batch012-source164-affected168-first114-assembly',
    'batch012-source176-author-stageA164-first-parser',
    'batch012-source220221-first-author',
    'batch012-source220221-stageA',
    'batch012-source220221-stageB',
    'batch012-source220221-first-finalize',
    'batch012-source221-affected-text',
    'batch012-source221-boundary-affected-classification',
  ].map(name => `${root}/evidence/${name}`),
]
const forbidden = new Set(['.env', '.venv', 'node_modules', '__pycache__', '8-python', '9-node'])
const files = [
  `${ticket}/plan.md`, `${ticket}/usage.json`,
  '.claude/skills/ld-s10y-lesson/tools/assemble.py',
  '.claude/skills/ld-s10y-lesson/tools/edition.py',
  `${root}/book.json`, `${root}/editions/modern-us-neutral/book.json`,
]
function collect(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    assert(!entry.isSymbolicLink() && !forbidden.has(entry.name), file)
    if (entry.isDirectory()) collect(file)
    else files.push(file)
  }
}
for (const scope of scopes) collect(scope)

fs.mkdirSync(evidence)
const retained = []
for (const source of [
  `${ticket}/tmp/production-125-factorial-affected-check-once.py`,
  `${ticket}/tmp/production-125-factorial-affected-check/receipt.json`,
  process.argv[1],
]) {
  const target = `${evidence}/${path.basename(source)}`
  fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL)
  retained.push({ source, retained: target, sha256: hash(fs.readFileSync(target)) })
}
const integration = {
  startedAt: new Date().toISOString(), completeLessons: lessons, bindings, retained,
  existingIndexEntriesAndAuditUnchanged: true,
  completePushedBefore: 29, completeAfterSuccessfulPush: 31,
  sourcePages: [168, 169, 170, 171, 220, 221],
  scope: 'Byte-bound delivery only; source/text/answer/desktop/mobile checks reused, not rerun.',
  qualifications: 'OFFLINE ONLY; all four books incomplete; no DB/product/quiz acceptance. Historical 本世纪 perspective and all prior FAIL/HOLD/UNKNOWN preserved. Adjacent drafts exist only in evidence, not the active lesson index.',
}
fs.writeFileSync(`${evidence}/integration.json`,
  JSON.stringify(integration, null, 2) + '\n', { flag: 'wx' })
collect(evidence)
const selected = [...new Set(files)].sort()
fs.writeFileSync(manifestPath, JSON.stringify({
  files: selected, completeLessons: lessons, exclusions: [], evidenceScopes: scopes,
}, null, 2) + '\n', { flag: 'wx' })
execFileSync('git', ['add', '-f', '--pathspec-from-file=-', '--pathspec-file-nul'], {
  input: selected.join('\0') + '\0', stdio: ['pipe', 'inherit', 'inherit'],
})
const staged = git(['diff', '--cached', '--name-only', '-z']).split('\0').filter(Boolean)
assert(staged.length > 0 && staged.every(file => selected.includes(file)))
const prohibited = staged.filter(file =>
  /(^|\/)\.env$|(^|\/)T\/|\/\.venv\/|\/node_modules\/|^app\/|^ssot-schemas\/|\/charter\//.test(file))
assert.deepEqual(prohibited, [])
const rules = [
  ['private-key', /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/],
  ['github-token', /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{50,})\b/],
  ['openai-token', /\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{32,}\b/],
  ['database-credentials', /(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?):\/\/[^\s"'<>]*:[^@\s"'<>]+@/],
]
const secretMatches = []
for (const file of staged) {
  const bytes = execFileSync('git', ['show', `:${file}`], { maxBuffer: 64 * 1024 * 1024 })
  assert(bytes.equals(fs.readFileSync(file)), `Index mismatch: ${file}`)
  if (!bytes.includes(0))
    for (const [rule, expression] of rules)
      if (expression.test(bytes.toString('utf8'))) secretMatches.push({ file, rule })
}
assert.deepEqual(secretMatches, [], 'Potential secret; do not commit')
console.log(JSON.stringify({
  completeLessons: lessons, stagedChanges: staged.length,
  stagedBytes: staged.reduce((sum, file) => sum + fs.statSync(file).size, 0),
  oldGateExecutions: 0, prohibited, secretMatches, productionWrites: 0,
}, null, 2))

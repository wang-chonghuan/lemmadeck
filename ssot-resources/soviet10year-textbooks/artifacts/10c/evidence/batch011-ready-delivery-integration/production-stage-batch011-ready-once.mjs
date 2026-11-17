import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184'
const root = 'ssot-resources/soviet10year-textbooks/artifacts/10c'
const evidence = `${root}/evidence/batch011-ready-delivery-integration`
const manifest = `${ticket}/tmp/production-stage-batch011-ready-files.json`
const git = args => execFileSync('git', args, { encoding: 'utf8' })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
assert(!fs.existsSync(evidence) && !fs.existsSync(manifest), 'Stage this batch once')
assert.equal(git(['branch', '--show-current']).trim(), 'codex/STEMROBIN-184-textbooks')
assert.equal(git(['diff', '--cached', '--name-only', '-z']), '',
  'Preserve unrelated staging')
const integration = read(`${ticket}/tmp/production-batch011-ready-integration/index-integration.json`)
assert.equal(integration.afterBookSha256, hash(fs.readFileSync(`${root}/book.json`)))
assert.equal(read(`${ticket}/tmp/production-batch011-ready-integration/command.json`).exitCode, 0)
const lessons = ['ana10-c7-s2-n102', 'ana10-c7-s2-n103']
for (const id of lessons) {
  const directory = `${root}/editions/modern-us-neutral/lessons/${id}`
  assert.equal(read(`${directory}/adaptation.audit.json`).status, 'pass')
  assert.equal(read(`${directory}/answer-keys.audit.json`).status, 'pass')
}
const noSeeds = `${root}/editions/modern-us-neutral/lessons/${lessons[0]}/choice-set`
assert.deepEqual(fs.readdirSync(noSeeds), ['README.md'])
assert.equal(read(`${root}/editions/modern-us-neutral/lessons/${lessons[1]}/choice-set/review.json`).outcome,
  'pass')
const forbidden = new Set(['.env', '.venv', 'node_modules', '__pycache__',
  '8-python', '9-node'])
const copied = []
function retain(source, target) {
  const stat = fs.lstatSync(source)
  assert(!stat.isSymbolicLink() && !forbidden.has(path.basename(source)),
    `Forbidden retention input ${source}`)
  if (stat.isDirectory()) {
    fs.mkdirSync(target, { recursive: true })
    for (const entry of fs.readdirSync(source)) retain(`${source}/${entry}`, `${target}/${entry}`)
  } else {
    assert(stat.isFile())
    fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL)
    const bytes = fs.readFileSync(source)
    assert(bytes.equals(fs.readFileSync(target)))
    copied.push({ source, retained: target, bytes: bytes.length, sha256: hash(bytes) })
  }
}
fs.mkdirSync(evidence)
retain(`${ticket}/tmp/production-batch011-ready-integration`, `${evidence}/integration`)
retain(`${ticket}/tmp/production-promoted10c102-103`, `${evidence}/faithful-promotion`)
for (const file of ['production-integrate-batch011-ready-once.mjs',
  'production-stage-batch011-ready-once.mjs']) {
  retain(`${ticket}/tmp/${file}`, `${evidence}/${file}`)
}
fs.writeFileSync(`${evidence}/copy-manifest.json`, JSON.stringify({
  copied, totalFiles: copied.length,
  totalBytes: copied.reduce((sum, item) => sum + item.bytes, 0),
  exclusions: [],
  scope: 'Exact integration bytes; source, semantic and display gates not rerun.',
}, null, 2) + '\n', { flag: 'wx' })
const files = [
  `${ticket}/plan.md`, `${ticket}/usage.json`,
  '.claude/skills/ld-s10y-lesson/tools/edition.py',
  '.claude/skills/ld-s10y-lesson/tools/layout.py',
  '.claude/skills/ld-s10y-lesson/tools/test_edition_partial_index.py',
  ...['carrier_ancillary_rows', 'carrier_rows', 'integral_limit_rows',
    'nested_fraction_rows', 'offset_rules', 'page134_rows'].map(name =>
    `.claude/skills/ld-s10y-lesson/tools/test_layout_${name}.py`),
  `${root}/book.json`, `${root}/editions/modern-us-neutral/book.json`,
]
for (let number = 120; number <= 124; number++) {
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    files.push(`${root}/pages/${String(number).padStart(4, '0')}/${name}`)
  }
}
const scopes = lessons.flatMap(id => [
  `${root}/lessons/${id}`, `${root}/editions/modern-us-neutral/lessons/${id}`,
])
for (const row of read(`${root}/book.json`).lessons) {
  const choices = `${root}/editions/modern-us-neutral/lessons/${row.id}/choice-set`
  if (fs.existsSync(`${choices}/review.json`)) {
    for (const name of ['seed', 'draft', 'review']) files.push(`${choices}/${name}.json`)
  }
}
for (const name of [
  'batch011-modern102-103-first', 'batch011-choice103-repaired',
  'batch011-source110-133', 'batch011-counter110-121',
  'batch011-counter125-133-diagnosis', 'batch011-counter133-and-edition-index',
  'batch011-counter134-residual-integrals', 'batch011-counter137-142-diagnosis',
  'batch011-counter140-141-ancillary-partial',
  'batch011-ready-delivery-integration',
]) scopes.push(`${root}/evidence/${name}`)
const excluded = []
function collect(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isSymbolicLink() || forbidden.has(entry.name)) excluded.push(file)
    else if (entry.isDirectory()) collect(file)
    else files.push(file)
  }
}
for (const scope of [...new Set(scopes)]) collect(scope)
const selected = [...new Set(files)].sort()
for (const file of selected) {
  assert(fs.lstatSync(file).isFile(), `Missing selected file ${file}`)
  assert(!file.startsWith('T/') && !file.startsWith(`${ticket}/tmp/`))
}
fs.writeFileSync(manifest, JSON.stringify({
  files: selected, excluded, completeLessons: lessons,
  heldSourceAndModernObjectsNotStaged: true,
  oldGateEvidenceReused: true,
}, null, 2) + '\n', { flag: 'wx' })
execFileSync('git', ['add', '-f', '--pathspec-from-file=-', '--pathspec-file-nul'], {
  input: selected.join('\0') + '\0', stdio: ['pipe', 'inherit', 'inherit'],
})
const staged = git(['diff', '--cached', '--name-only', '-z']).split('\0').filter(Boolean)
assert(staged.every(file => selected.includes(file)))
assert(!staged.some(file =>
  /(^|\/)\.env$|(^|\/)T\/|\/\.venv\/|\/node_modules\/|^app\/|^ssot-schemas\/|\/charter\/|\/pages\/01(?:3[4-9]|4\d|5\d)\//.test(file)))
assert(!staged.some(file => /\/lessons\/ana10-c7-s2-n107\//.test(file)
  && !file.includes('/evidence/')))
console.log(JSON.stringify({
  completeLessons: lessons, stagedChanges: staged.length,
  stagedBytes: staged.reduce((sum, file) => sum + fs.statSync(file).size, 0),
  exclusions: excluded, integrationRetainedFiles: copied.length,
  integrationRetainedBytes: copied.reduce((sum, item) => sum + item.bytes, 0),
  checkReuse: 'No old source, semantic or display PASS rerun.',
}, null, 2))

import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const repo = process.cwd()
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-184/tmp')
const book = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g')
const lesson = 'geo910-c1-s2-n16'
const modern = path.join(book, 'editions/modern-us-neutral/lessons', lesson)
const target = path.join(modern, 'choice-set')
const evidence = path.join(book, 'evidence/batch008-n16-complete')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const record = file => ({ path: path.relative(repo, file), sha256: hash(file) })
const prefix = 'geo910-n16-choice'
const input = {
  seed: path.join(tmp, `${prefix}-seed.json`),
  draft: path.join(tmp, `${prefix}-draft.json`),
  review: path.join(tmp, `${prefix}-independent-repaired-review.json`),
}
assert(!fs.existsSync(target) && !fs.existsSync(evidence), 'Never overwrite completed retention')
assert.equal(hash(input.draft), '62a26133e3dc226bb6332000a5f6d96bd9c5e1c09488086e0d969c38bf1f4592')
const review = read(input.review)
const draft = read(input.draft)
assert.equal(review.outcome, 'pass')
assert.equal(review.reviewer.kind, 'independent_agent')
assert.equal(review.question_reviews.length, 6)
assert.equal(review.question_reviews.flatMap(q => q.mathematics.option_checks).length, 48)
assert.equal(draft.questions.length, 6)
assert.equal(draft.questions.flatMap(q => q.view.options).length, 48)
assert.equal(draft.new_figures.length, 0)
for (const name of ['lesson', 'exercises', 'figures', 'answer-keys']) {
  assert.equal(read(path.join(modern, `${name}.json`)).status, 'ready')
}
assert.equal(read(path.join(modern, 'answer-keys.json')).answers.length, 4)
assert.equal(read(path.join(modern, 'exercises.json')).exercises.length, 4)
for (const figure of read(path.join(modern, 'figures.json')).figures) {
  assert.equal(read(path.join(book, 'editions/modern-us-neutral', figure.review)).status, 'pass')
}
const validationFile = path.join(tmp, `${prefix}-independent-repaired-validation.md`)
const validationText = fs.readFileSync(validationFile, 'utf8')
assert(validationText.includes('mechanical checks passed; declared semantic review: pass (not automatically proved)'))
assert(/Exit status:\s*\*\*0\*\*|Exit status:\s*`0`|exit\s*`0`|exit status.*\b0\b/i.test(validationText),
  'Actual independent validator exit0 must have been recorded')
const offline = path.join(tmp, 'offline', lesson)
assert.equal(read(path.join(offline, 'choices-report.json')).status, 'pass')
assert.equal(read(path.join(offline, 'choices-geo910-n16-choice-166-common-opposite-proof-report.json')).status, 'pass')
const displayFile = path.join(tmp, `${prefix}-affected-display.md`)
assert.equal(hash(displayFile), '23a74d6c7ed1f334055e785f2c94af2bcc861f5e27adb6deecf27e4dbb296887')
const planned = []
const add = (source, relative) => {
  const stat = fs.lstatSync(source)
  assert(stat.isFile() && !stat.isSymbolicLink(), `Expected regular evidence: ${source}`)
  planned.push({ source, relative, sha256: hash(source), bytes: stat.size })
}
for (const name of fs.readdirSync(tmp).sort()) {
  if (name.startsWith(prefix) && fs.lstatSync(path.join(tmp, name)).isFile()) {
    add(path.join(tmp, name), `history/${name}`)
  }
}
const addTree = (directory, relative) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    assert(!entry.isSymbolicLink(), 'Choice evidence must not contain symlinks')
    const source = path.join(directory, entry.name)
    if (entry.isDirectory()) addTree(source, `${relative}/${entry.name}`)
    else add(source, `${relative}/${entry.name}`)
  }
}
addTree(path.join(tmp, `${prefix}-book-trace-before`), 'history/book-trace-before')
for (const name of fs.readdirSync(offline).filter(name => name.startsWith('choices')).sort()) {
  add(path.join(offline, name), `display/${name}`)
}
const htmlRoot = path.join(repo, '.tmp/ld-s10y-lesson/render/9-10g/modern-us-neutral', lesson)
for (const name of ['choices.html', 'choices-geo910-n16-choice-166-common-opposite-proof.html']) {
  add(path.join(htmlRoot, name), `display/${name}`)
}
add(path.join(tmp, 'n15-n16-choice-offline-independent-display.md'), 'display/independent-full-display.md')
add(fileURLToPath(import.meta.url), 'history/retention-helper.mjs')
assert.equal(new Set(planned.map(item => item.relative)).size, planned.length)
for (const item of planned) assert.equal(hash(item.source), item.sha256)
fs.mkdirSync(evidence)
fs.mkdirSync(target)
for (const [kind, source] of Object.entries(input)) {
  const destination = path.join(target, `${kind}.json`)
  fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(destination), hash(source))
}
for (const item of planned) {
  const destination = path.join(evidence, item.relative)
  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.copyFileSync(item.source, destination, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(destination), item.sha256)
  assert.equal(hash(item.source), item.sha256)
}
const manifest = {
  status: 'COMPLETE_OFFLINE_NOT_PUBLISHED',
  ticket: 'STEMROBIN-184',
  lesson,
  completedAtUtc: new Date().toISOString(),
  counts: { lessons: 1, standardAnswers: 4, writtenExercises: 4, choiceQuestions: 6, choiceOptions: 48 },
  approvedSnapshots: Object.fromEntries(Object.keys(input).map(kind =>
    [kind, record(path.join(target, `${kind}.json`))])),
  modernHashes: Object.fromEntries(['lesson', 'exercises', 'figures', 'answer-keys'].map(name =>
    [name, record(path.join(modern, `${name}.json`))])),
  evidenceReuse: {
    standardProseAndDisplay: 'Previously retained n15/n16 independent answer/source/text/prefix/theme evidence; no rerun.',
    sourceAndFigures: 'Previously approved current modern text and fig62-65; exact retained files reused.',
    choices: 'Blind source/view and first Stage3 records reused; sole Q5.d repair and Q4/Q5 affected comparison passed.',
    validation: { retainedRelativePath: `history/${path.basename(validationFile)}`, exit: 0, invocations: 1 },
    firstRejections: 'Original trace exit2, first semantic exit3, old learner projection and pre-repair draft retained unchanged.',
  },
  files: planned.map(({ source, ...item }) => ({
    ...item, sourcePathProvenanceOnly: path.relative(repo, source), runtimeDependency: false,
  })),
  limitations: 'Choice recognition does not certify independently produced proofs, drawings or classifications. Full read-only written tasks and ungraded standard answers remain. Only isolated headless offline rendering, not judging, persistence, publication, live integration or OS behavior.',
  operations: { byteRetentionOnly: true, semanticReviews: 0, renders: 0, validatorRuns: 0, imageOpens: 0, database: false, git: false },
}
const manifestFile = path.join(evidence, 'retention.json')
fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({
  status: manifest.status, ...manifest.counts,
  copiedEvidenceFiles: planned.length, copiedEvidenceBytes: planned.reduce((sum, item) => sum + item.bytes, 0),
  manifest: record(manifestFile), snapshots: manifest.approvedSnapshots,
}, null, 2))

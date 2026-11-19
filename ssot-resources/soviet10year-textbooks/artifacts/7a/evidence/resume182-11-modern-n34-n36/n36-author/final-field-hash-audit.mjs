import fs from 'node:fs'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck'
assert.equal(process.cwd(), root)
const out = '.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n36-author'
const durable = 'ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s2-n36'
const read = path => JSON.parse(fs.readFileSync(path, 'utf8'))
const hash = path => crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex')
const lesson = read(`${durable}/lesson.json`)
const exercises = read(`${durable}/exercises.json`)
const seed = read(`${out}/seed.json`)
const draft = read(`${out}/draft.json`)
const numbers = Array.from({length: 16}, (_, i) => String(i + 761))
assert.equal(lesson.title, '恒 等 式')
assert.equal(lesson.title, lesson.source.data.title)
assert.equal(lesson.source.sha256, 'beeb61bc2ec0a7ef5691c74202ac3f217163a06d96cb1dc4ef7839cee819111e')
assert.equal(exercises.source.sha256, '079768886ed4820a2a9f8fa8ccdfe4b4801dca05ea053614acc8a36d76468891')
for (const [name, current] of [['lesson', lesson], ['exercises', exercises]]) {
  const before = read(`${out}/finalize-FIRST-failed/${name}.template.json`)
  assert.deepEqual(current.source, before.source, `${name}: immutable source object changed`)
  const nowItems = current.prose ?? current.exercises
  const oldItems = before.prose ?? before.exercises
  for (let i = 0; i < nowItems.length; i++) {
    assert.equal(nowItems[i].source_text, oldItems[i].source_text)
    assert.deepEqual(nowItems[i].numeric_changes, oldItems[i].numeric_changes)
    assert(!/[\u0400-\u04ff]/u.test(nowItems[i].text))
  }
}
assert.equal(lesson.section_breaks.length, 5)
assert.deepEqual(exercises.exercises.map(item => item.number), numbers)
assert.deepEqual(seed.exercises.map(item => item.number), numbers)
assert.deepEqual(seed.concepts.map(item => item.block), [0, 1, 3, 5])
assert.deepEqual(exercises.exercises.find(item => item.number === '776').changes, [])
assert(exercises.exercises.find(item => item.number === '765').text.includes('b) $\\sqrt{a^2}$，设 $a>0$；'))
assert.equal(lesson.figures.length, 0)
assert.equal(read(`${durable}/figures.json`).figures.length, 0)
assert.equal(seed.figures.length, 0)
assert.equal(draft.new_figures.length, 0)
for (const q of draft.questions) {
  assert.equal(q.view.figure_ids.length, 0)
  assert.equal(q.intent.figure_observations.length, 0)
  for (const option of q.view.options) assert.equal(option.figure_ids.length, 0)
  const visible = JSON.stringify(q.view)
  assert(!/source_solution|source_numbers|misconception|rationales|correct/.test(visible))
  assert(!numbers.some(number => new RegExp(`\\b${number}\\b`).test(visible)))
}
const solutionsPath = `${out}/source-solutions.md`
assert.equal(hash(solutionsPath), '209b65e1c9e852103c1423d08cc0c2db64d26e53602c03af61fd3daeb927580c')
const audit = read(`${durable}/adaptation.audit.json`)
assert.equal(audit.status, 'pass')
const canonicalDigest = path => {
  const result = spawnSync('python3', [
    '-B', '.agents/skills/ld-s10y-choice/scripts/prepare.py', 'digest', path,
  ], {cwd: root, encoding: 'utf8', env: {...process.env, PYTHONDONTWRITEBYTECODE: '1'}})
  assert.equal(result.status, 0, result.stderr)
  return result.stdout.trim()
}
const seedDigest = canonicalDigest(`${out}/seed.json`)
assert.equal(seedDigest, draft.seed_sha256)
const draftDigest = canonicalDigest(`${out}/draft.json`)
const command = [
  'python3', '-B', '.agents/skills/ld-s10y-choice/scripts/validate.py',
  '--repo', '.', '--seed', `${out}/seed.json`, '--draft', `${out}/draft.json`,
]
assert(!fs.existsSync(`${out}/structural-check-receipt.json`), 'structural checker must not repeat')
const checked = spawnSync(command[0], command.slice(1), {
  cwd: root, encoding: 'utf8', env: {...process.env, PYTHONDONTWRITEBYTECODE: '1'},
})
fs.writeFileSync(`${out}/structural-check.stdout.txt`, checked.stdout ?? '', {flag: 'wx'})
fs.writeFileSync(`${out}/structural-check.stderr.txt`, checked.stderr ?? '', {flag: 'wx'})
fs.writeFileSync(`${out}/structural-check-receipt.json`, `${JSON.stringify({
  cwd: root,
  command,
  invocations: 1,
  exit_code: checked.status,
  stdout: `${out}/structural-check.stdout.txt`,
  stderr: `${out}/structural-check.stderr.txt`,
  seed_sha256: seedDigest,
  draft_sha256: draftDigest,
  semantic_review: 'not performed; independent reviewer pending',
  approval: 'candidate only; no self approval',
}, null, 2)}\n`, {flag: 'wx'})
assert.equal(checked.status, 0, checked.stderr || checked.stdout)

const files = [
  `${out}/seed.json`, `${out}/draft.json`, solutionsPath,
  `${out}/structural-check-receipt.json`,
  `${durable}/lesson.json`, `${durable}/exercises.json`, `${durable}/figures.json`,
  `${durable}/adaptation.audit.json`,
]
const hashes = Object.fromEntries(files.map(path => [path, hash(path)]))
const receipt = {
  status: 'FROZEN_CANDIDATES_STRUCTURAL_PASS_INDEPENDENT_REVIEW_PENDING',
  cwd: root,
  parent_finalization: 'affected recovery succeeded exit0; parent notice 23:38:41Z',
  authority_title: lesson.title,
  immutable_source_objects_source_text_numeric_changes: 'unchanged vs frozen first-failure templates',
  source_hashes: {lesson: lesson.source.sha256, exercises: exercises.source.sha256},
  modern_latin_labels: 'retained; no Cyrillic in root text',
  source765b: 'a>0 retained without erratum',
  source776_changes: [],
  section_breaks: 5,
  selected_definition_blocks: [0, 1, 3, 5],
  excluded_worked_examples: 'all example blocks excluded from seed concepts',
  source_numbers: numbers,
  question_count: draft.questions.length,
  native_modes: {
    single: draft.questions.filter(q => q.view.mode === 'single').length,
    multiple: draft.questions.filter(q => q.view.mode === 'multiple').length,
  },
  coverage_count: draft.coverage.length,
  images: {source: 0, authored: 0, visible: 0},
  graph_capacity_losses: draft.coverage.filter(row => ['773', '774'].includes(row.source_number)),
  canonical_sha256: {seed: seedDigest, draft: draftDigest},
  hashes,
  visible_internal_field_separation: 'views have no keys, rationales, source mapping, solution or source exercise numbers',
  structural_checker: {invocations: 1, exit_code: checked.status},
  semantic_review: 'pending independent reviewer; not performed by author',
  approval: 'candidate only; no self approval',
  parent_owned_next_stages: 'review, retain and answers; no author publisher/DB/app/cap3 interactions',
}
fs.writeFileSync(`${out}/final-field-hash-audit.json`, `${JSON.stringify(receipt, null, 2)}\n`, {flag: 'wx'})
for (const path of [`${out}/seed.json`, `${out}/draft.json`, `${out}/structural-check-receipt.json`, `${out}/final-field-hash-audit.json`]) {
  fs.chmodSync(path, 0o444)
}
console.log(JSON.stringify(receipt, null, 2))

import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const root = path.dirname(new URL(import.meta.url).pathname)
const archive = path.join(root, 'history/repeated-eight-position-run-before')
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'))
const stable = value => Array.isArray(value) ? value.map(stable) :
  value && typeof value === 'object' ? Object.fromEntries(
    Object.keys(value).sort().map(key => [key, stable(value[key])])) : value
const digest = value => crypto.createHash('sha256').update(JSON.stringify(stable(value))
  .replace(/[\u007f-\uffff]/g, c => '\\u' +
    c.charCodeAt(0).toString(16).padStart(4, '0'))).digest('hex')
const byteHash = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
assert(!fs.existsSync(archive))
const before = read('draft.json')
const oldView = read('view.json')
assert.equal(digest(before),
  '15ff8d15bbe2989a790a25bcbf7c10d8b87343769034c4be5ba721754cf84157')
fs.mkdirSync(archive, { recursive: true })
for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (!entry.isFile()) continue
  const bytes = fs.readFileSync(path.join(root, entry.name))
  fs.writeFileSync(path.join(archive, entry.name), bytes, { flag: 'wx' })
  assert(bytes.equals(fs.readFileSync(path.join(archive, entry.name))))
}
const after = structuredClone(before)
const question = after.questions[24]
assert.equal(question.id, 'hat-and-shoe-pair-prices')
const map = { A: 'A', B: 'D', C: 'C', D: 'B' }
function swap(q) {
  const options = structuredClone(q.view.options)
  const rationales = structuredClone(q.key.rationales)
  q.view.options = ['A', 'B', 'C', 'D'].map(id =>
    ({ ...options.find(option => option.id === map[id]), id }))
  q.key.rationales = ['A', 'B', 'C', 'D'].map(id =>
    ({ ...rationales.find(rationale => rationale.option_id === map[id]), option_id: id }))
  q.key.correct = q.key.correct.map(id => map[id]).sort()
}
swap(question)
const restored = structuredClone(after)
swap(restored.questions[24])
assert.deepEqual(restored, before)
const delta = []
function compare(a, b, at = '') {
  if (JSON.stringify(a) === JSON.stringify(b)) return
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
      compare(a[key], b[key], `${at}/${key}`)
    }
  } else delta.push({ path: at, before: a, after: b })
}
compare(before, after)
assert.equal(delta.length, 9)
assert(delta.every(item => item.path.startsWith('/questions/24/')))
const view = { questions: after.questions.map(({ id, source_numbers, view }) =>
  ({ id, source_numbers, view })) }
assert.deepEqual(oldView, { questions: before.questions.map(({ id, source_numbers, view }) =>
  ({ id, source_numbers, view })) })
for (const [name, value] of [['draft.json', after], ['view.json', view]]) {
  fs.writeFileSync(path.join(root, name), JSON.stringify(value, null, 2) + '\n')
  assert.deepEqual(read(name), value)
}
const record = {
  stage: 'single-question-position-only-second-repair',
  role: 'Parent repair author, not a fresh semantic reviewer',
  archive: path.relative(process.cwd(), archive),
  question_id: question.id, zero_based_index: 24,
  old_to_new: map, new_position_old_candidate_order: ['A', 'D', 'C', 'B'],
  draft_before_sha256: digest(before), draft_after_sha256: digest(after),
  view_before_sha256: digest(oldView), view_after_sha256: digest(view),
  draft_after_byte_sha256: byteHash(fs.readFileSync(path.join(root, 'draft.json'))),
  view_after_byte_sha256: byteHash(fs.readFileSync(path.join(root, 'view.json'))),
  exact_field_deltas: delta, unchanged_question_count: 27,
  inverse_permutation_restores_entire_input: true,
  no_mathematical_text_program_truth_coverage_or_source_change: true,
  label_reference_changes: [],
  delta_check_executions: 1, delta_check_exit_code: 0,
  structural_executions: 0, canonical_executions: 0, browser_executions: 0
}
fs.writeFileSync(path.join(root, 'repeated-run-repair-evidence.json'),
  JSON.stringify(record, null, 2) + '\n', { flag: 'wx' })
fs.writeFileSync(path.join(root, 'repeated-run-view-map.json'),
  JSON.stringify({ question_id: question.id, old_to_new: map,
    new_position_old_candidate_order: record.new_position_old_candidate_order,
    view_before_sha256: record.view_before_sha256,
    view_after_sha256: record.view_after_sha256,
    all_option_contents_unchanged: true, other_27_questions_unchanged: true }, null, 2) + '\n',
  { flag: 'wx' })
console.log(JSON.stringify({ draft_sha256: digest(after), view_sha256: digest(view),
  exact_field_deltas: delta.length, unchanged_questions: 27 }))

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'

const scope = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(scope, '../../../../..')
const tools = path.join(repo, '.claude/skills/ld-s10y-lesson/tools')
const require = createRequire(import.meta.url)
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const local = (name) => {
  assert.equal(path.basename(name), name)
  return path.join(scope, name)
}
const read = (filename) => JSON.parse(fs.readFileSync(filename, 'utf8'))
const write = (name, data) => fs.writeFileSync(local(name), `${JSON.stringify(data, null, 2)}\n`)
const binding = (filename) => {
  const bytes = fs.readFileSync(filename)
  const stat = fs.statSync(filename)
  return {
    path: filename,
    hash: hash(bytes),
    bytes: bytes.length,
    mode: (stat.mode & 0o7777).toString(8).padStart(4, '0'),
  }
}

if (process.argv[2] === 'flow') {
  assert.ok(!fs.existsSync(local('prose-flow.receipt.json')), 'prose_flow may run only once')
  const command = [path.join(tools, 'prose_flow.mjs'), local('lesson.template.json')]
  const input = binding(local('lesson.template.json'))
  const run = spawnSync(process.execPath, command, { cwd: repo, encoding: 'utf8' })
  fs.writeFileSync(local('prose-flow.stdout.txt'), run.stdout ?? '')
  fs.writeFileSync(local('prose-flow.stderr.txt'), run.stderr ?? '')
  write('prose-flow.receipt.json', {
    executable: process.execPath,
    args: command,
    cwd: repo,
    input,
    exit_code: run.status,
    error: run.error?.message ?? null,
    stdout: binding(local('prose-flow.stdout.txt')),
    stderr: binding(local('prose-flow.stderr.txt')),
  })
  process.stdout.write(run.stdout ?? '')
  process.stderr.write(run.stderr ?? '')
  process.exit(run.status ?? 1)
}

assert.equal(process.argv[2], 'verify')
const before = read(local('input-bindings.before.json'))
const after = {
  captured_at: new Date().toISOString(),
  inputs: before.inputs.map((item) => binding(item.path)),
  first: before.first.map((item) => binding(item.path)),
}
write('input-bindings.after.json', after)
assert.deepEqual(after.inputs, before.inputs, 'input bindings changed')
assert.deepEqual(after.first, before.first, 'FIRST bindings changed')
assert.ok(after.first.every((item) => item.mode === '0444'))
assert.equal(before.first[0].hash, before.inputs[0].hash)
assert.equal(before.first[1].hash, before.inputs[1].hash)

const lesson = read(local('lesson.template.json'))
const exercises = read(local('exercises.template.json'))
const firstLesson = read(local('lesson.FIRST.json'))
const firstExercises = read(local('exercises.FIRST.json'))
const rawLesson = read(before.inputs[2].path)
const rawExercises = read(before.inputs[3].path)
assert.equal(lesson.prose.length, 16)
assert.equal(exercises.exercises.length, 1)
assert.deepEqual(lesson.source, firstLesson.source)
assert.deepEqual(exercises.source, firstExercises.source)
assert.deepEqual(lesson.source.data, rawLesson)
assert.deepEqual(exercises.source.data, rawExercises)
assert.equal(lesson.source.sha256, before.inputs[2].hash)
assert.equal(exercises.source.sha256, before.inputs[3].hash)

const omit = (object, fields) => Object.fromEntries(
  Object.entries(object).filter(([key]) => !fields.includes(key)),
)
assert.deepEqual(omit(lesson, ['prose', 'section_breaks']), omit(firstLesson, ['prose', 'section_breaks']))
assert.deepEqual(omit(exercises, ['exercises']), omit(firstExercises, ['exercises']))
assert.deepEqual(lesson.errata, [])

const math = (text) => [...text.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs)]
  .map((match) => match[1] ?? match[2])
const outside = (text) => text.replace(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs, '')
const numbers = (text) => outside(text).match(/\d+(?:\.\d+)?/g) ?? []
const refs = (text) => outside(text).match(/图[ \u3000]*\d+/g) ?? []
const punctuationMoves = []
const targets = []
function compareText(first, candidate, raw, label, fields) {
  assert.deepEqual(omit(candidate, fields), omit(first, fields), `${label}: metadata`)
  assert.equal(candidate.source_text, first.source_text, `${label}: source_text`)
  assert.equal(candidate.source_text, raw.text, `${label}: faithful object text`)
  assert.deepEqual(numbers(candidate.text), numbers(first.source_text), `${label}: ordered numbers`)
  assert.deepEqual(refs(candidate.text), refs(first.source_text), `${label}: verbatim figure references`)
  const original = math(first.source_text)
  const modern = math(candidate.text)
  assert.equal(modern.length, original.length, `${label}: formula count`)
  for (let index = 0; index < original.length; index += 1) {
    if (original[index] === modern[index]) continue
    assert.ok(/[,.]$/.test(original[index]), `${label}: unexpected formula change`)
    assert.equal(modern[index], original[index].slice(0, -1), `${label}: exact formula bytes`)
    punctuationMoves.push({ target: label, formula_index: index, before: original[index], after: modern[index] })
  }
  assert.ok(modern.every((item) => !/[、，；。？！：]/.test(item)), `${label}: Chinese punctuation in math`)
  assert.deepEqual(candidate.numeric_changes, [])
  assert.deepEqual(candidate.historical_entities, [])
  assert.ok(!candidate.changes.includes('math-correction'))
  const changed = candidate.text !== first.text
  if (changed) assert.deepEqual(candidate.changes, ['wording', 'layout'])
  else assert.deepEqual(candidate, first, `${label}: unchanged non-text object`)
  targets.push({
    target: label,
    kind: candidate.kind ?? 'exercise',
    changed,
    source_text_hash: hash(Buffer.from(first.source_text)),
    candidate_text_hash: hash(Buffer.from(candidate.text)),
    ordered_original_formulas: original,
    ordered_candidate_formulas: modern,
    ordered_numbers: numbers(candidate.text),
    ordered_figure_references: refs(candidate.text),
    metadata_equal: true,
    source_text_equal: true,
  })
}
lesson.prose.forEach((item, index) => compareText(
  firstLesson.prose[index], item, rawLesson.prose[index], `prose[${index}]`, ['text', 'changes'],
))
exercises.exercises.forEach((item, index) => {
  compareText(firstExercises.exercises[index], item, rawExercises.exercises[index],
    `exercises[${index}]`, ['text', 'lines', 'changes'])
  assert.deepEqual(item.lines, item.text.split('\n'))
  const subparts = item.lines.filter((line) => /^[1-6]）/.test(line))
  assert.deepEqual(subparts.map((line) => line.match(/^([1-6])）/)[1]), ['1', '2', '3', '4', '5', '6'])
  const originalParts = rawExercises.exercises[index].lines.filter((line) => /^[1-6]）/.test(line))
  assert.deepEqual(subparts.map(math), originalParts.map(math), 'all six given boundaries must stay exact')
  assert.equal(item.lines.length, 8)
})
assert.equal(targets.filter((item) => item.changed && item.kind === 'p').length, 8)
assert.ok(lesson.prose[7].text.includes('S_{(x+\\Delta x)}'))
assert.equal(lesson.prose[7].text.match(/S_\{\(x\+\\Delta x\)\}/g).length, 2)

const flowReceipt = read(local('prose-flow.receipt.json'))
assert.equal(flowReceipt.exit_code, 0)
assert.deepEqual(binding(local('prose-flow.stdout.txt')), flowReceipt.stdout)
assert.deepEqual(binding(local('prose-flow.stderr.txt')), flowReceipt.stderr)
const printedAnchors = fs.readFileSync(local('prose-flow.stdout.txt'), 'utf8').split('\n')
  .filter((line) => line.startsWith('    break: '))
  .map((line) => JSON.parse(line.slice('    break: '.length)))
assert.equal(lesson.section_breaks.length, 2)
lesson.section_breaks.forEach((anchor) => assert.ok(
  printedAnchors.some((printed) => JSON.stringify(printed) === JSON.stringify(anchor)),
  'anchor must be copied verbatim from actual prose_flow output',
))
const { proseOutline, sectionBreakIndices, proseFlow } = require(path.join(tools, 'htmlfrag.js'))
const outline = proseOutline(lesson.prose)
const resolvedBreaks = sectionBreakIndices(lesson.prose, lesson.section_breaks)
const flow = proseFlow(lesson.prose, lesson.section_breaks)
const paragraphLayout = outline.map((paragraph) => {
  const sentenceCount = [...paragraph.text.matchAll(/。/g)].length
  assert.ok(sentenceCount >= 1 && sentenceCount <= 3, 'paragraph must be short')
  for (const line of paragraph.text.split('\n')) {
    assert.ok(!/。[^（■\s]/.test(line), 'sentences need their own line')
  }
  return { ...paragraph, complete_sentences: sentenceCount }
})
assert.equal(flow.filter((item) => item.kind !== 'p').length, 8)
const canonicalCommand = [
  '-B', local('canonical-check.py'), repo, local('lesson.template.json'), local('exercises.template.json'),
]
const canonical = spawnSync(
  path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python'),
  canonicalCommand,
  { cwd: repo, encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } },
)
fs.writeFileSync(local('canonical-check.stdout.json'), canonical.stdout ?? '')
fs.writeFileSync(local('canonical-check.stderr.txt'), canonical.stderr ?? '')
write('canonical-check.receipt.json', {
  executable: path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python'),
  args: canonicalCommand,
  cwd: repo,
  exit_code: canonical.status,
  error: canonical.error?.message ?? null,
  stdout: binding(local('canonical-check.stdout.json')),
  stderr: binding(local('canonical-check.stderr.txt')),
})
assert.equal(canonical.status, 0, canonical.stderr || canonical.stdout)
const canonicalResult = read(local('canonical-check.stdout.json'))
assert.deepEqual(canonicalResult.errors, [])
write('reconciliation.json', {
  status: 'author-mechanical-checks-ok',
  independent_review: false,
  input_bindings_unchanged: true,
  first_bindings_unchanged: true,
  source_snapshots_equal_faithful_objects: true,
  ordered_math_bytes_equal_except_sentence_punctuation: true,
  punctuation_moves: punctuationMoves,
  targets,
  paragraphs: paragraphLayout,
  paragraph_count: outline.length,
  section_breaks: lesson.section_breaks,
  resolved_breaks: resolvedBreaks,
  anchors_copied_from_actual_cli_output: true,
  canonical_check: canonicalResult,
})
write('author-report.json', {
  ticket: 'STEMROBIN-188',
  assignment: 'SAME188-6',
  lesson: lesson.id,
  role: 'offline-modern-text-author',
  status: 'candidate-only',
  scope,
  candidates: ['lesson.template.json', 'exercises.template.json'].map((name) => binding(local(name))),
  first: after.first,
  input_bindings: { before: before.inputs, after: after.inputs, unchanged: true },
  counts: {
    prose_objects: 16,
    prose_text_objects: 8,
    untouched_figure_placeholders: 4,
    untouched_captions: 4,
    exercise_objects: 1,
    exercise_number: '242',
    subparts: 6,
    final_text_paragraphs: outline.length,
    section_breaks: 2,
    initial_authoring_passes: 1,
    actual_content_repair_passes: 0,
    source_repairs: 0,
    technical_recoveries: 0,
    prose_flow_cli_runs: 1,
    canonical_check_runs: 1,
    ordered_reconciliation_runs: 1,
    image_reads: 0,
    image_outputs: 0,
    image_generation_calls: 0,
    paid_model_calls: 0,
  },
  preserved: [
    'source/source_text/source_refs/pages/identity/order',
    'all numbers and all six given subpart boundaries',
    'all mathematical expression bytes except final sentence punctuation moved outside math',
    'verbatim figure references 98/99/100/101 and all figure/caption objects',
    'S_{(x+\\Delta x)} twice, V_{(b)} and V_{(a)}',
    'no inferred errata, no exercise solutions, no imported p0229 O/0 issue',
  ],
  not_run: ['source-page review', 'assemble', 'vectorize', 'adapt-prepare', 'adapt-finalize', 'render', 'publish', 'DB', 'Git', 'other chats'],
  evidence: ['input-bindings.before.json', 'input-bindings.after.json', 'prose-flow.receipt.json', 'reconciliation.json', 'canonical-check.receipt.json'],
  remaining_issues: [],
  required_following_stages_not_authorized_here: [
    'independent modern-text review',
    'modern-figure production/review by its separate owner',
    'parent integration and any separately authorized finalize/publication',
  ],
  independent_review: false,
  whole_lesson_pass_claimed: false,
})
const owned = new Set([
  'lesson.FIRST.json', 'exercises.FIRST.json', 'lesson.template.json', 'exercises.template.json',
  'input-bindings.before.json', 'input-bindings.after.json', 'author-check.mjs', 'canonical-check.py',
  'prose-flow.stdout.txt', 'prose-flow.stderr.txt', 'prose-flow.receipt.json',
  'canonical-check.stdout.json', 'canonical-check.stderr.txt', 'canonical-check.receipt.json',
  'reconciliation.json', 'author-report.json', 'output-index.json',
])
const files = fs.readdirSync(scope).sort()
assert.ok(files.every((name) => owned.has(name)), 'unexpected file in author scope')
write('output-index.json', {
  schema: 'n66-text-author-output-index@1',
  scope,
  outputs: files.filter((name) => name !== 'output-index.json').map((name) => binding(local(name))),
})
console.log(JSON.stringify({
  counts: read(local('author-report.json')).counts,
  candidates: read(local('author-report.json')).candidates,
  output_index: binding(local('output-index.json')),
  remaining_issues: [],
}, null, 2))

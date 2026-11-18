import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const manifestPath = path.join(tmp, 'd488-n74-t13-first-source-preparation/manifest.json')
const sourcePath = path.join(tmp, 'd488-n74-t13-first-source-preparation/root/10p/lessons/phy10-c2-s2-t13/exercises.json')
const ledgerPath = path.join(tmp, 'd489-n74-t13-first-bilingual-text-author/actual-opens.json')
const sha = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const read = (filename) => JSON.parse(fs.readFileSync(filename, 'utf8'))
const describe = (filename) => ({
  path: filename,
  sha256: sha(fs.readFileSync(filename)),
  bytes: fs.statSync(filename).size,
})
const writeBytes = (filename, bytes) => {
  assert(filename.startsWith(`${root}/`))
  fs.mkdirSync(path.dirname(filename), { recursive: true })
  fs.writeFileSync(filename, bytes, { flag: 'wx' })
}
const write = (filename, value) => writeBytes(filename, `${JSON.stringify(value, null, 2)}\n`)
const copy = (from, to) => writeBytes(to, fs.readFileSync(from))
assert(!fs.existsSync(path.join(root, 'input-bindings.json')), 'First candidate production already started; no rerun')
assert.equal(describe(manifestPath).sha256, 'b8e95fb8de48e2055fc09ea7b1aba056fa096646b80d167465ae12afa1669c9a')
assert.equal(describe(sourcePath).sha256, 'e8bef689832bb9530d3497a7791f6f10b9c8bb00c4036901b98e34a4b2c22034')
assert.equal(describe(ledgerPath).sha256, 'ed1732e01d2e34c90a283ff265a08a7b0d31257bdd890003763c352587b73925')
const manifest = read(manifestPath)
const raw = read(sourcePath)
const prior = read(ledgerPath)
const content = read(path.join(root, 'answer-content.json'))
const solutionPath = path.join(root, 'source-solution.json')
const solution = read(solutionPath)
assert.equal(prior.context_cumulative_opens, 18)
assert.equal(raw.lesson, 'phy10-c2-s2-t13')
assert.equal(raw.count, 7)
assert.equal(content.answers.length, 7)
assert.equal(solution.solutions.length, 7)
fs.chmodSync(solutionPath, 0o444)
const sealedSolution = { ...describe(solutionPath), mode: '0444', phase: 'Before candidate hydration' }
const inputs = [describe(manifestPath), describe(sourcePath), describe(ledgerPath)]
copy(manifestPath, path.join(root, 'source/preparation-manifest.json'))
copy(sourcePath, path.join(root, 'source/exercises.json'))
copy(ledgerPath, path.join(root, 'source/prior-actual-opens.json'))

// Retain field shapes only; reference answer text and mathematics are never used.
const shape = (value) => Array.isArray(value)
  ? { type: 'array', item: value.length ? shape(value[0]) : null }
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.entries(value).map(([key, child]) => [key, shape(child)]))
    : value === null ? 'null' : typeof value
const formatReferences = []
for (const locale of ['zh', 'en']) {
  const reference = path.join(tmp, 'd443-n71-first-written-answer-author', locale, 'answer-keys.candidate.json')
  const referenceDocument = read(reference)
  inputs.push(describe(reference))
  formatReferences.push({
    locale,
    reference: describe(reference),
    field_shapes_only: shape(referenceDocument),
    solutions_or_mathematics_used_as_expectation: false,
    reference_solution_text_not_copied: true,
  })
}
write(path.join(root, 'format-reference.json'), {
  purpose: 'd443 written-answer structure only; no t13 mathematical expectations obtained from it',
  references: formatReferences,
})
write(path.join(root, 'input-bindings.json'), {
  schema: 'd495-input-bindings@1',
  inputs,
  accepted_raw_exercises: describe(sourcePath),
  independently_derived_solution_pre_candidate_seal: sealedSolution,
  prohibited_answers_or_reviewer_baselines_read: false,
})

const candidates = []
const checks = []
const tokens = (text) => text.match(/\$[^$]*\$/g) ?? []
for (const locale of ['zh', 'en']) {
  const answers = raw.exercises.map((exercise, index) => {
    const supplied = content.answers[index]
    assert.equal(exercise.source_number, String(index + 1))
    assert.equal(exercise.group_id, 'g0')
    assert.equal(supplied.source_number, exercise.source_number)
    assert.equal(solution.solutions[index].source_number, exercise.source_number)
    assert.deepEqual(tokens(supplied.displayAnswer.zh), tokens(supplied.displayAnswer.en))
    for (const language of ['zh', 'en']) {
      assert.equal((supplied.displayAnswer[language].match(/\$/g) ?? []).length % 2, 0)
      assert(supplied.displayAnswer[language].length > 0)
    }
    return {
      exercise: exercise.number,
      source_number: exercise.source_number,
      group: exercise.group,
      group_id: exercise.group_id,
      prompt: exercise.text,
      promptLanguage: 'zh',
      source_text: exercise.text,
      source_refs: exercise.pages,
      pages: exercise.pages,
      figure_refs: exercise.figure_refs,
      figures: exercise.figures,
      figureEvidence: exercise.figure_refs.map((id) => ({
        id,
        RAW: manifest[`RAW${id.replace('fig-', '')}`],
        SVG: manifest[`SVG${id.replace('fig-', '')}`],
        pixelObservationInThisBatch: false,
        approval: false,
      })),
      grading: 'ungraded',
      source: 'derived',
      displayAnswer: supplied.displayAnswer[locale],
      parts: [],
      historical_entities: [],
      taskCoverage: supplied.taskCoverage,
      conditions: supplied.conditions[locale],
      unresolved: supplied.hold?.[locale] ?? null,
      authorStatus: supplied.authorStatus,
      reviewStatus: 'PENDING-INDEPENDENT-SCI-ZHEN',
      scientificApproval: false,
      figureApproval: false,
      displayApproval: false,
      solution_binding: sealedSolution,
    }
  })
  const document = {
    schema: 'ld-s10y-answer/lesson-answers@1',
    book: '10p',
    lesson: raw.lesson,
    edition: 'modern-us-neutral',
    language: locale,
    status: 'draft',
    answers,
    readOnlyWrittenResponses: true,
    automaticGradingKeys: 0,
    completeCard: false,
    nativeFinalizeRun: false,
    independentReview: 'pending',
    SCI: 'pending-independent',
    ZHEN: 'pending-independent',
    FIG: 'pending-independent',
    DISPLAY: 'pending-independent',
    source: { ...describe(sourcePath), data: raw },
    noBookRawEvidenceInvented: true,
    promptsPreservedAsRawChineseBindings: true,
  }
  const destination = path.join(root, 'candidate', locale, 'answer-keys.candidate.json')
  write(destination, document)
  candidates.push(describe(destination))
  for (const [index, answer] of answers.entries()) {
    const original = raw.exercises[index]
    for (const field of ['source_number', 'group', 'group_id', 'pages', 'figure_refs', 'figures']) {
      assert.deepEqual(answer[field], original[field])
    }
    assert.equal(answer.prompt, original.text)
    assert.equal(answer.source_text, original.text)
    assert.deepEqual(answer.source_refs, original.pages)
    assert.equal(answer.grading, 'ungraded')
    assert.deepEqual(answer.parts, [])
    assert.equal(answer.bookRaw, undefined)
    assert.equal(answer.expected, undefined)
  }
  checks.push({
    locale,
    answer_count: 7,
    source_numbers: answers.map((answer) => answer.source_number),
    group_ids: answers.map((answer) => answer.group_id),
    prompts_source_snapshots_and_references_byte_content_preserved: true,
    bilingual_answer_math_token_sequence_equal: true,
    automatic_grading_parts_or_choices: 0,
    bookRaw_invented: false,
    status: 'STRUCTURAL-MATCH-ONLY-NOT-SCIENTIFIC-VALIDATION',
  })
}
write(path.join(root, 'structural-bindings.json'), { checks, native_answer_or_latex_validation_run: false })
const ledger = {
  schema: 'd495-zero-image-batch@1',
  ticket: 'STEMROBIN-181',
  prior_record: describe(ledgerPath),
  prior_actual_opens: 18,
  batch_actual_opens: 0,
  context_cumulative_opens: 18,
  context_cumulative_limit: 24,
  no_budget_reset: true,
  entries: [],
  reopens: 0,
  source_or_candidate_images_opened: 0,
  images_returned_to_parent: 0,
  batch_complete: true,
}
write(path.join(root, 'actual-opens.json'), ledger)
const report = {
  schema: 'd495-first-bilingual-written-answer-author-report@1',
  ticket: 'STEMROBIN-181',
  batch: 'd495-t13-first-bilingual-written-answer-author',
  status: 'FIRST-SEVEN-WRITTEN-ANSWER-CANDIDATES-FROZEN-INDEPENDENT-PENDING',
  input: describe(sourcePath),
  source_snapshot: path.join(root, 'source/exercises.json'),
  preparation_manifest: describe(manifestPath),
  candidates,
  independent_source_solution: sealedSolution,
  structure_reference_only: path.join(root, 'format-reference.json'),
  source_question_count: 7,
  source_numbers: ['1', '2', '3', '4', '5', '6', '7'],
  group_id: 'g0',
  source_pages: ['p0196#10', 'p0196#11', 'p0196#12', 'p0196#13', 'p0196#14', 'p0197#1', 'p0197#2'],
  read_only_standard_written_answers: true,
  automatic_grading_keys: 0,
  choices_authored: 0,
  original_prompts_unchanged_and_separate_from_solutions: true,
  bookRaw: 'Absent: no legal book-answer evidence was supplied or inspected.',
  per_question: content.answers.map((entry) => ({
    source_number: entry.source_number,
    group_id: 'g0',
    authorStatus: entry.authorStatus,
    unresolved: entry.hold,
    mathematical_coverage: entry.taskCoverage,
    scientific_independent_review: 'pending',
  })),
  conditional_models: {
    Q1: 'Symbolic relative-index ratios; no accepted source values, numerical HOLD.',
    Q2: 'HOLD: perpendicular outgoing separation yields conditional1.4cm only under the stated two-dimensional equal-surrounding-medium definition; internal separation requires r, face separation gives x=l. No branch endorsed unconditionally.',
    Q3: 'Ordinary denser-prism two-refraction viewing branch; base ray deviation versus apex apparent-image shift.',
    Q4: '45-degree TIR requires glass/water index ratio strictly above sqrt2, if that internal angle is established. Figures161/162 and numerical data remain HOLD.',
    Q5: 'Same prism, no silently supplied immersion or air. Near-normal short-face/long-face paths are conditional; oblique transmission and weak reflection prevent a universal visibility claim. HOLD.',
    Q6: 'Plane-parallel homogeneous layers conserve n sin(theta); original water-air TIR prevents final propagation into air. Tilt, curvature, and scattering excluded explicitly.',
    Q7: 'Relative-index limiting bound2; equality is exterior grazing, actual nongrazing traversal is strict. Exterior-index convention and unequal-exterior variant explicit.',
  },
  inherited: {
    SOURCE196ProceduralHOLD: manifest.SOURCE196ProceduralHOLD,
    SOURCE197LaterPunctuationHOLDExcludedNotRepaired: manifest.SOURCE197LaterPunctuationHOLDExcludedNotRepaired,
    RAW160: manifest.RAW160, SVG160: manifest.SVG160,
    RAW161: manifest.RAW161, SVG161: manifest.SVG161,
    RAW162: manifest.RAW162, SVG162: manifest.SVG162,
    RAW163: manifest.RAW163, SVG163: manifest.SVG163,
    inherited_PASS_is_not_current_answer_or_modern_approval: true,
  },
  SCI: 'pending-independent',
  ZHEN: 'pending-independent',
  FIG: 'pending-independent',
  DISPLAY: 'pending-independent',
  full: false,
  completeCard: false,
  historicalFAILHOLDPreserved: true,
  native_answer_finalize_or_render: 0,
  full_project_tests: 0,
  new_images: 0,
  cumulative_images: 18,
  no_budget_reset: true,
  no_source_or_d489_modification: true,
  no_d493_or_other_author_key_read: true,
  no_DB_Git_index_meter_consume_paid_newworker_worktree_branch: true,
  queued_d497_not_started_during_d495: true,
  freeze_policy: 'All regular output files0444; SHA-bound author artifacts only, no semantic approval.',
}
write(path.join(root, 'report.json'), report)
for (const input of inputs) assert.equal(describe(input.path).sha256, input.sha256)
const listFiles = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  assert(!entry.isSymbolicLink())
  const filename = path.join(directory, entry.name)
  return entry.isDirectory() ? listFiles(filename) : [filename]
}).sort()
const files = listFiles(root)
for (const filename of files) fs.chmodSync(filename, 0o444)
write(path.join(root, 'author-freeze.json'), {
  schema: 'd495-author-freeze@1',
  ticket: 'STEMROBIN-181',
  status: 'FIRST-AUTHOR-FROZEN-INDEPENDENT-PENDING-HOLDS-PRESERVED',
  files: files.map((filename) => ({ ...describe(filename), mode: '0444' })),
  candidates,
  independently_derived_solution: sealedSolution,
  image_ledger: ledger,
  full: false,
  SCI: 'pending-independent',
  ZHEN: 'pending-independent',
  FIG: 'pending-independent',
  DISPLAY: 'pending-independent',
  self_hash: 'Returned in textual receipt; not embedded recursively.',
})
fs.chmodSync(path.join(root, 'author-freeze.json'), 0o444)
for (const filename of listFiles(root)) assert.equal(fs.statSync(filename).mode & 0o777, 0o444)
for (const input of inputs) assert.equal(describe(input.path).sha256, input.sha256)
console.log(JSON.stringify({
  report: describe(path.join(root, 'report.json')),
  candidates,
  author_freeze: describe(path.join(root, 'author-freeze.json')),
  actual_opens: describe(path.join(root, 'actual-opens.json')),
  files_0444: listFiles(root).length,
  new_images: 0,
  cumulative_images: 18,
  scientific_review: 'pending-independent',
}, null, 2))

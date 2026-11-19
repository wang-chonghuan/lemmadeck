import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
assert.equal(process.cwd(), root, 'exact authorized cwd required');
const output = path.join(root,
  '.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n39-choice-affected-author');
const first = path.join(output, 'FIRST');
const read = name => JSON.parse(fs.readFileSync(path.join(first, name), 'utf8'));
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const ascii = value => JSON.stringify(value).replace(/[^\x00-\x7f]/g,
  character => '\\u' + character.charCodeAt(0).toString(16).padStart(4, '0'));
const canonical = value => {
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (value !== null && typeof value === 'object') {
    return '{' + Object.keys(value).sort().map(
      key => ascii(key) + ':' + canonical(value[key])).join(',') + '}';
  }
  return ascii(value);
};
const digest = value => sha(canonical(value));
const write = (name, value, bytes = false) => {
  const destination = path.join(output, name);
  assert.equal(path.dirname(destination), output, 'output escapes ownership root');
  fs.writeFileSync(destination, bytes ? value : JSON.stringify(value, null, 2) + '\n',
    { flag: 'wx' });
};
const clone = value => structuredClone(value);
const receipt = JSON.parse(fs.readFileSync(path.join(output, 'FIRST-receipt.json'), 'utf8'));
for (const item of receipt.inputs) {
  assert.equal(sha(fs.readFileSync(item.snapshot)), item.sha256);
  assert.deepEqual(fs.readFileSync(item.source), fs.readFileSync(item.snapshot),
    `current authorized input changed after FIRST: ${item.name}`);
}

const seed = read('seed.json');
const original = read('draft.json');
const sourceSolutions = read('source-solutions-counted.json');
const sourceCells = read('source-cells.json');
const originalViews = read('reviewer-views.json');
const plan = JSON.parse(fs.readFileSync(path.join(output, 'replacements.json'), 'utf8'));
const replacements = new Map(plan.questions.map(question => [question.id, question]));
const expectedAffected = ['q01', 'q02', 'q04', 'q05', 'q23'];
assert.deepEqual([...replacements.keys()], expectedAffected);
assert.equal(original.seed_sha256, digest(seed));
assert.equal(sourceSolutions.source_originals, 14);
assert.equal(sourceSolutions.source_tasks, 76);
assert.equal(sourceSolutions.sources.reduce((sum, item) => sum + item.task_ids.length, 0), 76);
assert.deepEqual(originalViews, original.questions.map(({ id, view }) => ({ id, view })));

const draft = clone(original);
const changeMap = [];
for (const question of draft.questions) {
  const before = original.questions.find(item => item.id === question.id);
  const replacement = replacements.get(question.id);
  let preservedTable = null;
  if (replacement) {
    let suffix = '';
    if (replacement.reuse_literal_table_suffix) {
      const start = before.view.stem.indexOf('\n\nTable IV ');
      assert.ok(start > 0, `literal Table IV suffix absent for ${question.id}`);
      suffix = before.view.stem.slice(start);
      preservedTable = { exact_text_equal: true, sha256: sha(suffix) };
    }
    question.view.stem = replacement.stem_prefix + suffix;
    question.view.options = clone(replacement.options);
    Object.assign(question.intent, clone(replacement.intent_updates));
    question.key = clone(replacement.key);
  }
  const beforeOrdering = clone(question.view.options);
  const beforeRationales = clone(question.key.rationales);
  const ordering = plan.option_permutations[question.id]
    ?? beforeOrdering.map(option => option.id);
  assert.deepEqual([...ordering].sort(), beforeOrdering.map(option => option.id).sort());
  const optionMapping = ordering.map((identity, index) => {
    const option = beforeOrdering.find(item => item.id === identity);
    return {
      input_id: identity,
      input_position: beforeOrdering.indexOf(option) + 1,
      output_id: String.fromCharCode(65 + index),
      output_position: index + 1,
      text_sha256: sha(option.text),
    };
  });
  const idMap = new Map(optionMapping.map(item => [item.input_id, item.output_id]));
  question.view.options = ordering.map(identity => ({
    ...beforeOrdering.find(item => item.id === identity), id: idMap.get(identity),
  }));
  question.key.correct = ordering.filter(identity => question.key.correct.includes(identity))
    .map(identity => idMap.get(identity));
  question.key.rationales = ordering.map(identity => ({
    ...beforeRationales.find(item => item.option_id === identity),
    option_id: idMap.get(identity),
  }));
  for (const mapping of optionMapping) {
    const oldOption = beforeOrdering.find(item => item.id === mapping.input_id);
    const newOption = question.view.options.find(item => item.id === mapping.output_id);
    assert.deepEqual({ ...newOption, id: oldOption.id }, oldOption);
    const oldRationale = beforeRationales.find(item => item.option_id === mapping.input_id);
    const newRationale = question.key.rationales.find(item => item.option_id === mapping.output_id);
    assert.deepEqual({ ...newRationale, option_id: oldRationale.option_id }, oldRationale);
  }
  const kind = replacement ? 'affected_content_replacement'
    : canonical(question) === canonical(before) ? 'exact_question_reuse' : 'option_order_id_remap_only';
  changeMap.push({
    question_id: question.id,
    kind,
    original_question_sha256: digest(before),
    repaired_question_sha256: digest(question),
    original_option_ids_removed: replacement ? before.view.options.map(option => option.id) : [],
    option_map_basis: replacement ? 'new_authored_semantic_ids' : 'FIRST_option_ids',
    option_map: optionMapping,
    source_numbers_unchanged: canonical(before.source_numbers) === canonical(question.source_numbers),
    source_solution_unchanged: before.intent.source_solution === question.intent.source_solution,
    figure_observations_unchanged:
      canonical(before.intent.figure_observations) === canonical(question.intent.figure_observations),
    literal_table: preservedTable,
    repair_reason: replacement?.repair_reason ?? null,
    supplementary_conditions: replacement?.supplementary_conditions ?? [],
  });
}

for (const coverage of draft.coverage) {
  if (!draft.questions.some(question =>
    replacements.has(question.id) && question.source_numbers.includes(coverage.source_number))) continue;
  const questions = draft.questions.filter(question => question.source_numbers.includes(coverage.source_number));
  coverage.omitted_tasks = [...new Set(questions.flatMap(question => question.intent.limitations))];
  coverage.reason = 'All original source task IDs remain assigned to the same questions. ' +
    'These are coherent recognition units, with visibly supplementary conditions where stated; ' +
    'independent written production and unconditional original-precision performance are not claimed. ' +
    questions.map(question => question.intent.unit_reason).join(' ');
}

const semanticQuestion = question => ({
  id: question.id,
  source_numbers: question.source_numbers,
  view: {
    mode: question.view.mode, stem: question.view.stem, figure_ids: question.view.figure_ids,
  },
  intent: question.intent,
  // Bind truth and reasoning to the assertion, not its output letter or position.
  assertions: question.view.options.map(option => {
    const rationale = question.key.rationales.find(item => item.option_id === option.id);
    return {
      text: option.text, figure_ids: option.figure_ids,
      correct: question.key.correct.includes(option.id),
      truth: rationale.truth, derivation: rationale.derivation, misconception: rationale.misconception,
    };
  }).sort((a, b) => canonical(a).localeCompare(canonical(b), 'en')),
});
const unchanged = [];
for (const question of draft.questions) {
  const before = original.questions.find(item => item.id === question.id);
  assert.equal(question.intent.source_solution, before.intent.source_solution);
  assert.deepEqual(question.intent.figure_observations, before.intent.figure_observations);
  assert.deepEqual(question.source_numbers, before.source_numbers);
  assert.equal(question.view.mode, before.view.mode);
  assert.deepEqual(question.view.figure_ids, before.view.figure_ids);
  if (replacements.has(question.id)) continue;
  const beforeSemantic = semanticQuestion(before);
  const afterSemantic = semanticQuestion(question);
  assert.deepEqual(afterSemantic, beforeSemantic, `changed unowned semantics: ${question.id}`);
  unchanged.push({
    question_id: question.id,
    semantic_sha256_before: digest(beforeSemantic),
    semantic_sha256_after: digest(afterSemantic),
    assertions_keys_rationales_identical_modulo_ids_order: true,
    exact_question_equal: canonical(before) === canonical(question),
  });
}
assert.equal(unchanged.length, 19);
assert.deepEqual(draft.new_figures, original.new_figures);
assert.deepEqual(draft.coverage.map(({ source_number, question_ids }) => ({ source_number, question_ids })),
  original.coverage.map(({ source_number, question_ids }) => ({ source_number, question_ids })));

const coverage = read('task-coverage.json');
const mappingBefore = coverage.mapping.map(({ source_number, question_id, source_task_ids }) =>
  ({ source_number, question_id, source_task_ids }));
for (const row of coverage.mapping) {
  if (replacements.has(row.question_id)) {
    row.losses = clone(draft.questions.find(question => question.id === row.question_id).intent.limitations);
  }
}
coverage.production_or_original_precision_losses = clone(draft.coverage);
coverage.conditional_tasks['806.a1-a6'] =
  'Original full direct-main root values retained, with additionally authored nearest-0.1 reporting.';
coverage.conditional_tasks['806.b1-b5'] =
  'Original full direct-main root values and address steps retained, with additionally authored nearest-0.01 reporting.';
coverage.conditional_tasks['807.a-f'] =
  'Original full direct-main root values retained, with additionally authored nearest-0.01 reporting.';
assert.deepEqual(coverage.mapping.map(({ source_number, question_id, source_task_ids }) =>
  ({ source_number, question_id, source_task_ids })), mappingBefore);
const taskPairs = coverage.mapping.flatMap(row => row.source_task_ids.map(
  task => `${row.source_number}:${task}`));
const sourcePairs = sourceSolutions.sources.flatMap(row => row.task_ids.map(
  task => `${row.source_number}:${task}`));
assert.equal(taskPairs.length, 76);
assert.equal(new Set(taskPairs).size, 76);
assert.deepEqual([...taskPairs].sort(), [...sourcePairs].sort());
assert.equal(coverage.uncovered_mathematical_task_ids.length, 0);

const assumptions = read('method-assumptions.json');
assumptions['806a_affected'] =
  'Explicit supplementary nearest-0.1 report of the actual table numbers, retaining each full original root approximation; not a historical rule or replacement of the original input.';
assumptions['806b_affected'] =
  'Original main-column step regimes retained. Additionally report actual table numbers to nearest0.01 while retaining each full original approximation; not a historical requirement.';
assumptions['807a_f_affected'] =
  'Original six direct-main inputs retained. Additionally report actual table numbers to nearest0.01 while retaining their full approximations; no new cell or root-scale factor is introduced.';

const views = draft.questions.map(({ id, view }) => ({ id, view: clone(view) }));
assert.deepEqual(views, draft.questions.map(({ id, view }) => ({ id, view })));
for (const projection of views) {
  assert.deepEqual(Object.keys(projection), ['id', 'view']);
  assert.deepEqual(Object.keys(projection.view), ['mode', 'stem', 'figure_ids', 'options']);
  for (const option of projection.view.options) {
    assert.deepEqual(Object.keys(option), ['id', 'text', 'figure_ids']);
  }
}

const differences = [];
const escape = value => value.replace(/~/g, '~0').replace(/\//g, '~1');
const diff = (before, after, pointer = '') => {
  if (canonical(before) === canonical(after)) return;
  const bothArrays = Array.isArray(before) && Array.isArray(after);
  const bothObjects = before !== null && after !== null &&
    typeof before === 'object' && typeof after === 'object' &&
    !Array.isArray(before) && !Array.isArray(after);
  if (bothArrays && before.length === after.length) {
    before.forEach((value, index) => diff(value, after[index], `${pointer}/${index}`));
  } else if (bothObjects) {
    for (const key of [...new Set([...Object.keys(before), ...Object.keys(after)])].sort()) {
      if (!Object.hasOwn(before, key) || !Object.hasOwn(after, key)) {
        differences.push({ pointer: `${pointer}/${escape(key)}`,
          before: before[key] ?? null, after: after[key] ?? null });
      } else diff(before[key], after[key], `${pointer}/${escape(key)}`);
    }
  } else differences.push({ pointer, before, after });
};
diff(original, draft);
const counts = {
  source_originals: 14, source_tasks: 76,
  choice_questions: draft.questions.length,
  options: draft.questions.reduce((sum, question) => sum + question.view.options.length, 0),
  modes: {
    single: draft.questions.filter(question => question.view.mode === 'single').length,
    multiple: draft.questions.filter(question => question.view.mode === 'multiple').length,
  },
  affected_content_replacements: 5,
  unchanged_semantics: unchanged.length,
  exact_question_reuse: changeMap.filter(item => item.kind === 'exact_question_reuse').length,
  option_order_id_remap_only: changeMap.filter(item => item.kind === 'option_order_id_remap_only').length,
  source_cells_reused: sourceCells.cells.length,
  source_tasks_omitted: 0,
  new_source_solves: 0, new_image_loads: 0, new_renders: 0, new_figures: 0,
};
assert.equal(counts.choice_questions, 24);
assert.equal(counts.modes.single, 20);
assert.equal(counts.modes.multiple, 4);
assert.equal(counts.exact_question_reuse + counts.option_order_id_remap_only, 19);
const firstFourteen = draft.questions.slice(0, 14).map(question => ({
  question_id: question.id,
  original_correct_ids: original.questions.find(item => item.id === question.id).key.correct,
  repaired_correct_ids: question.key.correct,
}));
assert.notDeepEqual(firstFourteen.map(item => item.repaired_correct_ids[0]),
  firstFourteen.map(item => item.original_correct_ids[0]));

write('seed.json', fs.readFileSync(path.join(first, 'seed.json')), true);
write('draft.json', draft);
write('reviewer-views.json', views);
write('task-coverage.json', coverage);
write('method-assumptions.json', assumptions);
write('change-map.json', {
  schema: 'n39-affected-change-map@1',
  scope: expectedAffected, counts, questions: changeMap,
  first_fourteen_position_id_dispersion: firstFourteen,
  semantic_approval: 'not claimed; independent affected review pending',
});
write('diff.json', {
  schema: 'n39-affected-exhaustive-draft-diff@1',
  before: path.join(first, 'draft.json'), after: path.join(output, 'draft.json'),
  before_canonical_sha256: digest(original), after_canonical_sha256: digest(draft),
  changed_leaf_or_array_count: differences.length, differences,
});
write('preservation-proof.json', {
  schema: 'n39-affected-preservation-proof@1',
  scope: 'mechanical identity evidence, not independent mathematical or fidelity approval',
  counts,
  normalization: 'Ignore option position/ID only; bind assertion text, figure IDs, correctness, truth, derivation and misconception. All other question fields remain exact.',
  unchanged_questions: unchanged,
  all_24_source_solution_strings_identical: true,
  original_14_source_76_task_solution_snapshot_sha256:
    sha(fs.readFileSync(path.join(first, 'source-solutions-counted.json'))),
  all_24_original_task_mappings_identical: true,
  source_task_pairs_sha256: digest([...sourcePairs].sort()),
  all_76_original_task_ids_covered_once: true,
  graph_observations_identical: true,
  new_figures_identical: true,
  seed_exact_byte_equal: true,
  projection_matches_full_draft_view_subtrees: true,
  view_projection_contains_no_internal_subtrees: true,
  current_inputs_still_equal_FIRST: true,
});
write('repair-provenance.json', {
  schema: 'n39-affected-author-provenance@1',
  write_root: output,
  authority: 'Only the nine authorized FIRST input snapshots and the choice/production-resume instructions. Original solutions and actual fig55 observations reused without re-solving or opening images.',
  input_snapshots: receipt.inputs,
  source_provenance_snapshot: path.join(first, 'source-provenance.json'),
  source_cells_snapshot: path.join(first, 'source-cells.json'),
  source_solutions_snapshot: path.join(first, 'source-solutions-counted.json'),
  image_observations_snapshot: path.join(first, 'image-observations.json'),
  revised_method_assumptions: path.join(output, 'method-assumptions.json'),
  seed_canonical_sha256: digest(seed),
  draft_canonical_sha256: digest(draft),
  draft_file_sha256: sha(fs.readFileSync(path.join(output, 'draft.json'))),
  view_projection_file_sha256: sha(fs.readFileSync(path.join(output, 'reviewer-views.json'))),
  source_table_cells_modified: false,
  historical_equivalence_claimed: false,
  independent_review_complete_sets_or_math_read: false,
  durable_answers_read: false,
  original_math_re_solved: false,
  semantic_review: 'pending; no independent PASS, self-review PASS or review-v1 artifact produced',
  structural_validator: 'not run yet; authorized exactly once after this export',
});
console.log(JSON.stringify({
  counts,
  draft_file_sha256: sha(fs.readFileSync(path.join(output, 'draft.json'))),
  draft_canonical_sha256: digest(draft),
  views_file_sha256: sha(fs.readFileSync(path.join(output, 'reviewer-views.json'))),
  differences: differences.length,
}, null, 2));

import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const repo = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-182/tmp');
const reviewer = path.join(ticket, 'reviewer-5m-n40');
const author = path.join(ticket, '5m-n40');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const ordered = value => {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(ordered);
  return Object.fromEntries(Object.keys(value).sort().map(key => [key, ordered(value[key])]));
};
const canonical = value => JSON.stringify(ordered(value)).replace(
  /[\u007f-\uffff]/g,
  char => '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0'),
);
const digest = value => hash(canonical(value));
const sourcePath = path.join(reviewer, 'source-solutions.json');
const priorChecksPath = path.join(reviewer, 'view-checks.json');
const priorViewPath = path.join(reviewer, 'view-reviewed-snapshot.json');
const currentViewPath = path.join(author, 'view.json');
const evidencePath = path.join(author, 'position-cycle-repair-evidence.json');
const immutableHashes = new Map([
  [sourcePath, 'bb04f7b69f5b6d509c3f236985c1c0fa4fc85df3e5b5f46cb1ba2523d1ee5d62'],
  [priorChecksPath, '0961eb9c1c4a9b299bef8b5db79e21015e7e0954e8383c26bece2090e87f8926'],
  [priorViewPath, '1081506135003fc6a2f240a116b94feb9ee74b146eaec29f1a379c4c0875a33f'],
]);
for (const [file, expected] of immutableHashes) assert.equal(hash(fs.readFileSync(file)), expected);
const before = JSON.parse(fs.readFileSync(priorViewPath, 'utf8'));
const prior = JSON.parse(fs.readFileSync(priorChecksPath, 'utf8'));
const currentBytes = fs.readFileSync(currentViewPath);
const current = JSON.parse(currentBytes);
const supplied = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));
assert.equal(digest(current), 'e6e4112ac5fa0242d3328cb12ee8787fbfdad59c5ab60bf29a407b740a515138');
assert.deepEqual(Object.keys(current), ['questions']);
assert.equal(current.questions.length, 28);
assert.equal(before.questions.length, 28);

const expectedIndices = [6, 10, 14, 20, 24];
const labelMaps = [];
const visibleDeltas = [];
const unchanged = [];
const rebindings = [];
const restored = structuredClone(current);
const candidate = option => ({ text: option.text, figure_ids: option.figure_ids });
const withoutOptions = question => ({
  id: question.id,
  source_numbers: question.source_numbers,
  view: {
    mode: question.view.mode,
    stem: question.view.stem,
    figure_ids: question.view.figure_ids,
  },
});
for (let index = 0; index < 28; index++) {
  const oldQuestion = before.questions[index];
  const newQuestion = current.questions[index];
  assert.deepEqual(Object.keys(newQuestion).sort(), ['id', 'source_numbers', 'view']);
  assert.deepEqual(Object.keys(newQuestion.view).sort(), ['figure_ids', 'mode', 'options', 'stem']);
  assert.deepEqual(withoutOptions(newQuestion), withoutOptions(oldQuestion));
  assert.equal(newQuestion.view.mode, 'single');
  assert.equal(newQuestion.view.options.length, 4);
  assert.equal(prior.question_reviews[index].question_id, oldQuestion.id);
  const oldToNew = {};
  const newToOld = {};
  for (const oldOption of oldQuestion.view.options) {
    const matches = newQuestion.view.options.filter(option =>
      canonical(candidate(option)) === canonical(candidate(oldOption)));
    assert.equal(matches.length, 1);
    const newOption = matches[0];
    oldToNew[oldOption.id] = newOption.id;
    newToOld[newOption.id] = oldOption.id;
    const check = prior.question_reviews[index].mathematics.option_checks.find(
      option => option.option_id === oldOption.id,
    );
    assert.ok(check);
    rebindings.push({
      question_id: oldQuestion.id,
      pre_repair_option_id: oldOption.id,
      revised_option_id: newOption.id,
      candidate_sha256: digest(candidate(oldOption)),
      independent_truth: check.truth,
      independent_evidence: check.evidence,
      candidate_text_and_figures_exactly_equal: true,
    });
  }
  for (let optionIndex = 0; optionIndex < 4; optionIndex++) {
    const oldOption = oldQuestion.view.options[optionIndex];
    const newOption = newQuestion.view.options[optionIndex];
    assert.deepEqual(Object.keys(newOption).sort(), ['figure_ids', 'id', 'text']);
    assert.equal(oldOption.id, newOption.id);
    assert.deepEqual(oldOption.figure_ids, newOption.figure_ids);
    if (oldOption.text !== newOption.text) visibleDeltas.push({
      path: `/questions/${index}/view/options/${optionIndex}/text`,
      before: oldOption.text,
      after: newOption.text,
    });
  }
  const changed = canonical(oldQuestion) !== canonical(newQuestion);
  const suppliedMap = supplied.permutation_map.find(item => item.zero_based_index === index);
  assert.ok(suppliedMap);
  assert.equal(suppliedMap.question_id, oldQuestion.id);
  assert.deepEqual(suppliedMap.old_to_new, oldToNew);
  const oldCorrect = prior.question_reviews[index].mathematics.correct;
  labelMaps.push({
    zero_based_index: index,
    question_id: oldQuestion.id,
    changed,
    old_to_new: oldToNew,
    new_to_old: newToOld,
    independent_correct_before: oldCorrect,
    independent_correct_after: oldCorrect.map(id => oldToNew[id]),
    authority: 'Exact visible candidate-content matching plus saved pre-disclosure independent truths; supplied correct labels are not authority.',
  });
  if (!changed) unchanged.push(oldQuestion.id);
  restored.questions[index].view.options = oldQuestion.view.options.map(oldOption => {
    const found = newQuestion.view.options.find(option => option.id === oldToNew[oldOption.id]);
    return { ...found, id: oldOption.id };
  });
}
assert.deepEqual(labelMaps.filter(item => item.changed).map(item => item.zero_based_index), expectedIndices);
assert.equal(unchanged.length, 23);
assert.equal(visibleDeltas.length, 10);
assert.equal(rebindings.length, 112);
assert.deepEqual(restored, before);
assert.deepEqual(visibleDeltas, supplied.exact_json_field_deltas.filter(item => item.path.includes('/view/')));
const truthSequence = labelMaps.flatMap(item => item.independent_correct_after);
const positionCounts = Object.fromEntries(['A', 'B', 'C', 'D'].map(
  id => [id, truthSequence.filter(label => label === id).length],
));
const shortPeriodRuns = [];
for (let period = 1; period <= 4; period++) {
  for (let start = 0; start < truthSequence.length; start++) {
    let end = start + period;
    while (end < truthSequence.length && truthSequence[end] === truthSequence[end - period]) end++;
    if (end - start >= 8) shortPeriodRuns.push({
      period, one_based_start: start + 1, one_based_end: end,
      sequence: truthSequence.slice(start, end).join(''),
    });
  }
}
assert.equal(shortPeriodRuns.length, 0);
const firstBlock = truthSequence.slice(6, 14).join('');
const secondBlock = truthSequence.slice(20, 28).join('');
assert.equal(firstBlock, 'CBCDDBCD');
assert.equal(firstBlock, secondBlock);
const repeatIndices = [...Array.from({ length: 8 }, (_, i) => i + 6),
  ...Array.from({ length: 8 }, (_, i) => i + 20)];
const originalCycleIndices = [...Array.from({ length: 11 }, (_, i) => i + 6),
  ...Array.from({ length: 8 }, (_, i) => i + 20)];
const residual = {
  id: 'n40-view-002',
  verdict: 'revise',
  category: 'package-repeated-answer-position-template',
  evidence: 'Original long contiguous ABCD cycles are removed. However questions 7-14 and 21-28 still have the identical eight-position template CBCDDBCD. The two blocks were both ABCDABCD before repair; matching A/C swaps at 7/21 and A/D swaps at 11/25 preserve their exact copied position relationship. A previously learned first-block response-position template still predicts all eight positions of the later block without its mathematics. This is a residual package ordering signal, not a false option or a literal stem disclosure.',
  affected_one_based_ranges: [[7, 14], [21, 28]],
  repeated_sequence: firstBlock,
  affected_question_ids: repeatIndices.map(index => current.questions[index].id),
  minimal_repair: 'Use a non-mirrored candidate permutation in one or a few already affected author units, keeping mathematical content unchanged and rebinding internal labels only after authorization. Review the resulting whole-package sequence rather than fixing aggregate counts to an exact quota.',
  limits: 'The label counts A3/B9/C9/D7 are recorded, not independently treated as a defect. No probability or empirical learner-performance claim is made. No explicit cross-stem answer disclosure was found.',
};

const replacement = {
  6: {
    redundancy: 'A/C retain the same numerical vector but differ on a=0: revised C excludes zero; revised A falsely includes it. B reciprocates, D divides numerators alone. Complete propositions remain distinct.',
    target: 'C/A share 2/3,5/4,1/2,4/3, but B gives 3/2,4/5,2,3/4 and D gives 2/6,5/12,1/(140a),4/60. C/B/D exclude zero, A includes zero. All required value/domain targets still vary.',
    solution: 'Reused pre-repair independent result: 2/3,5/4,1/2 on the original a!=0 domain,4/3. The complete candidate formerly A is now C; current true set{C}.',
  },
  10: {
    redundancy: 'D is the complete correct record; B reciprocates, C operates on denominators, A misreads mixed numbers as products. A shares the first two correct results with D, not the complete proposition.',
    target: 'In revised A/B/C/D order the first slot is 4/5,5/4,2/5,4/5; second 3/10,10/3,undefined,3/10; third 13/8,4/5,undefined,5/4; fourth 9/2,2,undefined,1/2. Every target still varies.',
    solution: 'Reused pre-repair independent results: 12/15=4/5,6/20=3/10,1+2/8=5/4,6/12=1/2. Former A is revised D; current true set{D}.',
  },
  14: {
    redundancy: 'B has valid complete chains; A has incorrect proportional conversions; C drops mixed whole parts; D reverses operation signs. Shared unmixed lines in C do not duplicate complete B.',
    target: 'Revised B has (1/15,5/6,5/4,7/2,1/10,11/14,7/4,5/2); A has (1/3,11/18,3/2,10/3,1/2,4/7,3/2,13/6); C has (1/15,5/6,1/4,1/2,1/10,11/14,3/4,1/2); D has (13/15,1/18,9/4,7/6,17/10,1/14,3/4,29/6). Exact operand strings also only moved A/B, so all prior operand/result distinctions persist.',
    solution: 'Reused pre-repair independent equivalent-chain results: 1/15,5/6,5/4,7/2,1/10,11/14,7/4,5/2. Former A is revised B; current true set{B}.',
  },
  20: {
    redundancy: 'C contains complete terminal forms; B their reciprocals; A numerator-only reductions; D denominator-only reductions. These remain four distinct complete records.',
    target: 'Revised C and B differ at all twelve slots, including 8/9 versus 9/8,5 versus1/5,and8 versus1/8. The already coprime component remains genuinely tested.',
    solution: 'Reused pre-repair independent rows: (2/5,8/9,2/3,3/4),(1/4,1/4,5,1/5),(1/4,8,1/50,1/2). Former A is revised C; current true set{C}.',
  },
  24: {
    redundancy: 'D is the correct price pair; B reverses the difference direction; C reports two hats as one; A uses a one-hat difference. All full pairs and declared relationships remain distinct.',
    target: 'In revised A/B/C/D order hats are 7.35,143/30,9.8,4.9 and shoes 7.15,146/15,9.6,9.6. Both the requested hat price and linked shoe price still vary.',
    solution: 'Reused pre-repair independent model: s+h=14.5 and2h=s+.2 give h=4.9,s=9.6. Former A is revised D; current true set{D}.',
  },
};
const revised = structuredClone(prior);
revised.stage = 'Revised visible candidate permutation review; all112truth calculations reused from the saved pre-internal independent snapshot; no full author internal comparison.';
revised.view_path = path.relative(repo, currentViewPath);
revised.view_snapshot = path.relative(repo, path.join(reviewer, 'view-reviewed-revised-snapshot.json'));
revised.view_sha256 = digest(current);
revised.view_byte_sha256 = hash(currentBytes);
revised.prior_review = {
  path: path.relative(repo, priorChecksPath),
  byte_sha256: immutableHashes.get(priorChecksPath),
  source_and_original_review_bytes_preserved: true,
  unchanged_mathematics_count: 112,
  changed_candidate_positions: 10,
  unchanged_whole_visible_questions: 23,
};
revised.independence = {
  ...prior.independence,
  input_read_at_this_stage: 'Authorized repair evidence, revised pure view, and own preserved prior evidence only.',
  author_draft_read: false,
  author_key_read: 'Limited five-question key delta snippets were displayed in the authorized repair evidence before compaction; no draft read or key authority used.',
  author_intents_or_rationales_read: 'Limited five-question rationale delta snippets were displayed in that evidence; no full rationale/intent review.',
  repair_payload_exposure_notice: 'The authorized repair-evidence payload included internal before/after key/rationale snippets. Source and every original option truth were already independently saved before that exposure. This revised review therefore claims independent original mathematics with exact visible-content label rebinding, not a wholly unexposed new solution.',
};
for (let index = 0; index < 28; index++) {
  const check = revised.question_reviews[index];
  const map = labelMaps[index];
  if (map.changed) {
    check.pre_repair_labelled_evidence = {
      redundancy: check.redundancy,
      target_variation: check.target_variation,
      independent_solution: check.mathematics.independent_solution,
    };
    check.label_rebinding = map;
    check.redundancy = { verdict: 'pass', evidence: replacement[index].redundancy };
    check.target_variation = { verdict: 'pass', evidence: replacement[index].target };
    check.mathematics.independent_solution = replacement[index].solution;
    check.mathematics.correct = map.independent_correct_after;
    check.mathematics.option_checks = current.questions[index].view.options.map(option => {
      const oldId = map.new_to_old[option.id];
      const saved = prior.question_reviews[index].mathematics.option_checks.find(item => item.option_id === oldId);
      return {
        ...saved,
        option_id: option.id,
        pre_repair_option_id: oldId,
        reused_evidence_snapshot: path.relative(repo, priorChecksPath),
        candidate_sha256: digest(candidate(option)),
      };
    });
  }
  if (originalCycleIndices.includes(index)) {
    check.pre_repair_answer_leakage = check.answer_leakage;
    check.answer_leakage = repeatIndices.includes(index) ? {
      verdict: 'revise',
      evidence: 'Local candidate content/target variation is unchanged and valid. Original period4 leakage removed, but this unit belongs to the exact repeated eight-question position template at7-14and21-28, n40-view-002. See package evidence; no new literal stem disclosure.',
    } : {
      verdict: 'pass',
      evidence: 'Prior local content and target-variation evidence reused. This unit at15-17 no longer belongs to a long period1-4 run and is outside the residual repeated blocks7-14and21-28. No cross-stem answer disclosure introduced by candidate reordering.',
    };
  }
}
revised.package_checks.resolved_original_position_finding = {
  finding_id: 'n40-view-001',
  original_sequences: ['ABCDABCDABC', 'ABCDABCD'],
  revised_sequences_at_original_ranges: [
    truthSequence.slice(6, 17).join(''), truthSequence.slice(20, 28).join(''),
  ],
  verdict: 'pass',
  evidence: 'No contiguous run of at least eight positions with period1,2,3or4 remains. This resolves the specific original long short-period runs, not the residual copied block finding.',
};
revised.package_checks.position_leakage = {
  verdict: 'revise',
  finding_id: residual.id,
  independent_true_sequence: truthSequence,
  position_counts: positionCounts,
  period1_through4_runs_at_least8: shortPeriodRuns,
  repeated_blocks: {
    first_one_based_range: [7, 14],
    second_one_based_range: [21, 28],
    sequence: firstBlock,
    paired_old_to_new_swaps: [{ first_question: 7, second_question: 21, swap: 'A/C' },
      { first_question: 11, second_question: 25, swap: 'A/D' }],
  },
  evidence: residual.evidence,
  minimal_repair: residual.minimal_repair,
  limits: residual.limits,
};
revised.package_checks.author_internal_gate = 'Not performed. Full draft, keys, all wrong procedures and coverage await explicit authorization;35claimedinternaldeltafields not independently validated.';
revised.findings = [residual];
revised.resolved_prior_findings = prior.findings;
revised.visible_question_outcome = 'revise';
revised.source_scope_outcome = 'blocked';
revised.outcome = 'blocked';
revised.execution_evidence = {
  canonical_validation_run: false,
  structural_validation_run: false,
  source_math_recomputed: false,
  option_math_recomputed: false,
  visible_permutation_comparison_performed: true,
  source_record_modified: false,
  author_files_modified: false,
  durable_files_modified: false,
  browser_started: false,
  browser_or_sessions_running_after_command: false,
  next_stage: 'Report revised-view residual position finding and wait for full internal authority or another authorized repair snapshot.',
};
const comparison = {
  schema: 'independent-visible-permutation-comparison-v1',
  reviewer: prior.reviewer,
  view_sha256: digest(current),
  view_byte_sha256: hash(currentBytes),
  prior_evidence_hashes: Object.fromEntries([...immutableHashes].map(
    ([file, sha256]) => [path.relative(repo, file), sha256])),
  repair_evidence_path: path.relative(repo, evidencePath),
  repair_evidence_byte_sha256: hash(fs.readFileSync(evidencePath)),
  changed_question_count: 5,
  unchanged_question_count: 23,
  independently_verified_visible_leaf_delta_count: 10,
  reported_draft_leaf_delta_count: 45,
  unverified_internal_leaf_delta_count: 35,
  reported_draft_sha256_not_independently_verified: supplied.digests.draft_after_sha256,
  no_draft_opened: true,
  exact_inverse_permutation_restores_prior_projection: true,
  stems_ids_modes_sources_figures_and_question_order_unchanged: true,
  all112candidate_contents_and_prior_truths_preserved: true,
  label_maps: labelMaps,
  visible_leaf_deltas: visibleDeltas,
  unchanged_question_ids: unchanged,
  all_option_rebindings: rebindings,
  current_independent_true_sequence: truthSequence,
  position_counts: positionCounts,
  residual_position_finding: residual,
};
assert.deepEqual(revised.source_task_coverage, prior.source_task_coverage);
assert.deepEqual(revised.counts, prior.counts);
assert.equal(revised.question_reviews.flatMap(item => item.mathematics.option_checks).length, 112);
assert.equal(revised.question_reviews.flatMap(item => item.mathematics.option_checks)
  .filter(item => item.truth === 'correct').length, 28);
assert.deepEqual(fs.readFileSync(currentViewPath), currentBytes);
for (const [file, expected] of immutableHashes) assert.equal(hash(fs.readFileSync(file)), expected);
const outputs = [
  ['view-reviewed-revised-snapshot.json', currentBytes],
  ['view-repair-comparison.json', Buffer.from(JSON.stringify(comparison, null, 2) + '\n')],
  ['view-checks-revised.json', Buffer.from(JSON.stringify(revised, null, 2) + '\n')],
];
for (const [name] of outputs) assert.equal(fs.existsSync(path.join(reviewer, name)), false);
for (const [name, bytes] of outputs) fs.writeFileSync(path.join(reviewer, name), bytes, { flag: 'wx' });
console.log(JSON.stringify({
  saved: outputs.map(([name, bytes]) => ({ path: path.join(reviewer, name), byte_sha256: hash(bytes) })),
  questions: 28, options: 112, true: 28, false: 84,
  changed_questions: 5, unchanged_visible_questions: 23, visible_leaf_deltas: 10,
  view_sha256: digest(current), visible_outcome: 'revise', source721: 'blocked',
  total_outcome: revised.outcome,
  canonical_run: false, structural_run: false, draft_read: false,
}, null, 2));

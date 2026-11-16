import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const repo = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-182/tmp');
const own = path.join(tmp, 'reviewer-5m-n40');
const author = path.join(tmp, '5m-n40');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const sorted = value => value === null || typeof value !== 'object' ? value :
  Array.isArray(value) ? value.map(sorted) :
    Object.fromEntries(Object.keys(value).sort().map(key => [key, sorted(value[key])]));
const canonical = value => JSON.stringify(sorted(value)).replace(
  /[\u007f-\uffff]/g, c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));
const digest = value => sha(canonical(value));
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const precedingFiles = [
  'source-solutions.json', 'view-checks.json', 'view-reviewed-snapshot.json',
  'view-checks-revised.json', 'view-reviewed-revised-snapshot.json',
  'view-repair-comparison.json', 'rebind-visible-checks.mjs',
];
const precedingBytes = new Map(precedingFiles.map(name => [name, fs.readFileSync(path.join(own, name))]));
const precedingHashes = Object.fromEntries([...precedingBytes].map(([name, bytes]) => [name, sha(bytes)]));
assert.equal(precedingHashes['source-solutions.json'], 'bb04f7b69f5b6d509c3f236985c1c0fa4fc85df3e5b5f46cb1ba2523d1ee5d62');
assert.equal(precedingHashes['view-checks.json'], '0961eb9c1c4a9b299bef8b5db79e21015e7e0954e8383c26bece2090e87f8926');
assert.equal(precedingHashes['view-checks-revised.json'], '619256d404f6615aedcaf630c6fc55079c8ef19433c05c5a2b51b7f5b4f3944a');
const old = JSON.parse(precedingBytes.get('view-reviewed-revised-snapshot.json'));
const prior = JSON.parse(precedingBytes.get('view-checks-revised.json'));
const initial = JSON.parse(precedingBytes.get('view-checks.json'));
const finalBytes = fs.readFileSync(path.join(author, 'view.json'));
const final = JSON.parse(finalBytes);
const supplied = read(path.join(author, 'repeated-run-view-map.json'));
assert.deepEqual(Object.keys(final), ['questions']);
assert.equal(final.questions.length, 28);
assert.equal(digest(old), supplied.view_before_sha256);
assert.equal(digest(final), 'a5c7c78aaf340b0367d104967921cc6f6c61cb61eb1c1e08c23961586c501cb3');
assert.equal(digest(final), supplied.view_after_sha256);
const changed = [];
const visibleDeltas = [];
const content = option => ({ text: option.text, figure_ids: option.figure_ids });
const candidateMap = [];
for (let i = 0; i < 28; i++) {
  if (canonical(old.questions[i]) !== canonical(final.questions[i])) changed.push(i);
  const before = structuredClone(old.questions[i]);
  const after = structuredClone(final.questions[i]);
  delete before.view.options;
  delete after.view.options;
  assert.deepEqual(after, before);
  assert.equal(final.questions[i].view.options.length, 4);
  const map = {};
  for (const option of old.questions[i].view.options) {
    const matches = final.questions[i].view.options.filter(
      current => canonical(content(current)) === canonical(content(option)));
    assert.equal(matches.length, 1);
    map[option.id] = matches[0].id;
  }
  candidateMap.push(map);
  for (let j = 0; j < 4; j++) {
    const a = old.questions[i].view.options[j];
    const b = final.questions[i].view.options[j];
    assert.deepEqual(Object.keys(b).sort(), ['figure_ids', 'id', 'text']);
    assert.equal(a.id, b.id);
    assert.deepEqual(a.figure_ids, b.figure_ids);
    if (a.text !== b.text) visibleDeltas.push({
      path: `/questions/${i}/view/options/${j}/text`, before: a.text, after: b.text,
    });
  }
}
assert.deepEqual(changed, [24]);
assert.equal(final.questions[24].id, 'hat-and-shoe-pair-prices');
assert.equal(supplied.question_id, final.questions[24].id);
assert.deepEqual(candidateMap[24], { A: 'A', B: 'D', C: 'C', D: 'B' });
assert.deepEqual(candidateMap[24], supplied.old_to_new);
assert.equal(visibleDeltas.length, 2);
const restored = structuredClone(final);
restored.questions[24].view.options = old.questions[24].view.options.map(option => ({
  ...final.questions[24].view.options.find(item => item.id === candidateMap[24][option.id]),
  id: option.id,
}));
assert.deepEqual(restored, old);
const labels = prior.question_reviews.flatMap(
  (question, index) => question.mathematics.correct.map(id => candidateMap[index][id]));
assert.equal(labels.length, 28);
const shortRuns = [];
for (let period = 1; period <= 4; period++) {
  for (let start = 0; start < labels.length; start++) {
    let end = start + period;
    while (end < labels.length && labels[end] === labels[end - period]) end++;
    if (end - start >= 8) shortRuns.push({ period, start: start + 1, end });
  }
}
const repeatedEight = [];
for (let a = 0; a + 8 <= labels.length; a++) {
  for (let b = a + 8; b + 8 <= labels.length; b++) {
    if (labels.slice(a, a + 8).join('') === labels.slice(b, b + 8).join('')) {
      repeatedEight.push({ first_start: a + 1, second_start: b + 1 });
    }
  }
}
assert.deepEqual(shortRuns, []);
assert.deepEqual(repeatedEight, []);
assert.equal(labels.slice(6, 14).join(''), 'CBCDDBCD');
assert.equal(labels.slice(20, 28).join(''), 'CBCDBBCD');
const labelCounts = Object.fromEntries(['A', 'B', 'C', 'D'].map(
  id => [id, labels.filter(label => label === id).length]));
const review = structuredClone(prior);
review.stage = 'Final pure-view review after the second one-question position repair; all112initial pre-internal truths reused without new source solving or full author internal access.';
review.view_path = path.relative(repo, path.join(author, 'view.json'));
review.view_snapshot = path.relative(repo, path.join(own, 'view-reviewed-final-snapshot.json'));
review.view_sha256 = digest(final);
review.view_byte_sha256 = sha(finalBytes);
review.independence.input_read_at_this_stage = 'Pure repeated-run-view-map.json, final view.json, and own preserved source/view evidence. Full repeated-run-repair-evidence and draft not read.';
review.independence.new_internal_exposure_this_stage = false;
review.preceding_revised_review = {
  path: path.relative(repo, path.join(own, 'view-checks-revised.json')),
  byte_sha256: precedingHashes['view-checks-revised.json'],
};
const q = review.question_reviews[24];
q.first_repair_label_rebinding = q.label_rebinding;
q.label_rebinding = {
  previous_view_to_final: candidateMap[24],
  initial_view_to_final: { A: 'B', B: 'D', C: 'C', D: 'A' },
  independent_correct_initial: ['A'],
  independent_correct_previous: ['D'],
  independent_correct_final: ['B'],
  evidence: 'Exact candidate-content equality, not author keys. Original correct (4.9,9.6) moved A->D->B.',
};
q.redundancy = {
  verdict: 'pass',
  evidence: 'Final B is the complete correct price pair; D reverses the difference; C reports two hats as one; A uses a one-hat difference. The four candidate contents and mathematical relationships are unchanged.',
};
q.target_variation = {
  verdict: 'pass',
  evidence: 'Final A/B/C/D hats7.35,4.9,9.8,143/30 and shoes7.15,9.6,9.6,146/15. Both required quantities still have competing results; no fixed-answer cue introduced.',
};
q.mathematics.independent_solution = 'Initial independent equations s+h=14.5,2h=s+.2 gave h=4.9,s=9.6. That exact candidate was initial A, first-repair D, now final B. Complete final true set{B}; no new mathematical computation or author-key inference.';
q.mathematics.correct = ['B'];
q.mathematics.option_checks = final.questions[24].view.options.map(option => {
  const oldId = Object.keys(candidateMap[24]).find(id => candidateMap[24][id] === option.id);
  const previous = prior.question_reviews[24].mathematics.option_checks.find(item => item.option_id === oldId);
  assert.equal(previous.candidate_sha256, digest(content(option)));
  return { ...previous, option_id: option.id, previous_view_option_id: oldId };
});
const affected = [...Array.from({ length: 8 }, (_, i) => i + 6),
  ...Array.from({ length: 8 }, (_, i) => i + 20)];
for (const i of affected) {
  review.question_reviews[i].preceding_repeated_template_leakage = prior.question_reviews[i].answer_leakage;
  review.question_reviews[i].answer_leakage = {
    verdict: 'pass',
    evidence: 'Unchanged local target variation and no cross-stem disclosure. The former copied eight-position template is now CBCDDBCD at7-14versusCBCDBBCD at21-28; the B/D swap at25breaks their exact position equivalence. No long period1-4 run or disjoint repeated eight-position block remains in the final28-label sequence.',
  };
}
review.resolved_prior_findings = [...prior.resolved_prior_findings, ...prior.findings];
review.findings = [];
review.package_checks.position_leakage = {
  verdict: 'pass',
  independent_true_sequence: labels,
  position_counts: labelCounts,
  period1_through4_runs_at_least8: shortRuns,
  disjoint_repeated_eight_position_windows: repeatedEight,
  formerly_repeated_blocks: {
    first_one_based_range: [7, 14], first_sequence: 'CBCDDBCD',
    second_one_based_range: [21, 28], second_sequence: 'CBCDBBCD',
  },
  evidence: 'One content-preserving B/D swap at25removes exact copied eight-position relationship. Original long short-period runs remain absent. Local content/target checks and cross-question stem relationships are unchanged.',
  limits: 'Finite inspection of this snapshot, not proof of randomness or learner-performance testing. Counts A3/B10/C9/D6 are observations; exact uniform quotas are not required.',
};
review.package_checks.visible_question_outcome = 'pass';
review.package_checks.outcome = 'blocked';
review.package_checks.author_internal_gate = 'Full author intent/key/misconception/coverage comparison still awaits authorization. Earlier five-question delta-fragment exposure remains honestly recorded; initial all112truths predate it.';
review.visible_question_outcome = 'pass';
review.source_scope_outcome = 'blocked';
review.outcome = 'blocked';
review.execution_evidence = {
  canonical_validation_run: false, structural_validation_run: false,
  source_math_recomputed: false, option_math_recomputed: false,
  visible_permutation_comparison_performed: true,
  source_record_modified: false, author_files_modified: false, durable_files_modified: false,
  browser_started: false, browser_or_sessions_running_after_command: false,
  next_stage: 'Final pure view ready; wait for explicit full internal comparison authorization.',
};
assert.deepEqual(review.source_task_coverage, prior.source_task_coverage);
assert.deepEqual(review.counts, prior.counts);
const finalChecks = review.question_reviews.flatMap(question => question.mathematics.option_checks);
assert.equal(finalChecks.length, 112);
assert.equal(finalChecks.filter(option => option.truth === 'correct').length, 28);
for (let i = 0; i < 28; i++) {
  if (i !== 24) assert.deepEqual(review.question_reviews[i].mathematics, prior.question_reviews[i].mathematics);
}
const comparison = {
  schema: 'independent-final-visible-permutation-comparison-v1',
  reviewer: initial.reviewer, view_sha256: digest(final), view_byte_sha256: sha(finalBytes),
  pure_map_path: path.relative(repo, path.join(author, 'repeated-run-view-map.json')),
  pure_map_byte_sha256: sha(fs.readFileSync(path.join(author, 'repeated-run-view-map.json'))),
  reported_draft_sha256_unread_and_unverified: '204e3b6898a8a5927b90d8d307b9df6178323fc8c26aaa97dcd38fb7e26b2447',
  changed_question_ids: ['hat-and-shoe-pair-prices'], unchanged_question_count: 27,
  visible_leaf_delta_count: 2, visible_leaf_deltas: visibleDeltas,
  exact_inverse_restores_preceding_projection: true,
  all112candidate_texts_figures_and_independent_truths_unchanged: true,
  immediate_label_map: candidateMap[24], initial_to_final_label_map: q.label_rebinding.initial_view_to_final,
  final_question_option_checks: q.mathematics.option_checks,
  position_package: review.package_checks.position_leakage,
  preceding_byte_hashes: precedingHashes,
  no_full_repair_evidence_or_draft_read: true,
  old_internal_fragment_exposure_retained: review.independence.repair_payload_exposure_notice,
};
const archive = path.join(own, 'review-history/before-second-position-repair');
const outputs = [
  ['view-reviewed-final-snapshot.json', finalBytes],
  ['view-final-repair-comparison.json', Buffer.from(JSON.stringify(comparison, null, 2) + '\n')],
  ['view-checks-final.json', Buffer.from(JSON.stringify(review, null, 2) + '\n')],
];
for (const [file, bytes] of precedingBytes) assert.deepEqual(fs.readFileSync(path.join(own, file)), bytes);
assert.deepEqual(fs.readFileSync(path.join(author, 'view.json')), finalBytes);
assert.equal(fs.existsSync(archive), false);
for (const [name] of outputs) assert.equal(fs.existsSync(path.join(own, name)), false);
fs.mkdirSync(archive, { recursive: true });
for (const [name, bytes] of precedingBytes) {
  fs.writeFileSync(path.join(archive, name), bytes, { flag: 'wx' });
  assert.equal(sha(fs.readFileSync(path.join(archive, name))), precedingHashes[name]);
}
for (const [name, bytes] of outputs) fs.writeFileSync(path.join(own, name), bytes, { flag: 'wx' });
console.log(JSON.stringify({
  saved: outputs.map(([name, bytes]) => ({ path: path.join(own, name), byte_sha256: sha(bytes) })),
  archive, archived_file_count: precedingFiles.length,
  view_sha256: digest(final), changed_question: final.questions[24],
  questions: 28, options: 112, true_options: 28, false_options: 84,
  visible_outcome: 'pass', position_outcome: 'pass', source721: 'blocked', overall_outcome: 'blocked',
  draft_read: false, full_repair_evidence_read: false, structural_or_canonical_run: false,
}, null, 2));

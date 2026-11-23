import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = '.intentfold/tickets/STEMROBIN-181/tmp/';
const oldRoot = root + 'd1816-d1917-t6-first-en-review/';
const repairedRoot = root + 'd1816-d1931-t6-wetting-choice-repair/';
const ownRoot = root + 'd1816-d1932-t6-wetting-affected-review/';
const load = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const sort = value => Array.isArray(value) ? value.map(sort) :
  value && typeof value === 'object' ?
    Object.fromEntries(Object.keys(value).sort().map(key => [key, sort(value[key])])) : value;
const canonical = value => JSON.stringify(sort(value)).replace(/[\u007f-\uffff]/g,
  char => '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0'));
const digest = value => sha(canonical(value));
const snapshot = path => ({
  path, byte_sha256: sha(fs.readFileSync(path)), canonical_sha256: digest(load(path))
});
const english = load(oldRoot + 'english-review.json');
const oldReview = load(oldRoot + 'review.json');
const oldSeedPath = english.current_snapshots.find(row => row.id === 'seed').path;
const oldDraftPath = english.current_snapshots.find(row => row.id === 'draft').path;
const oldSeed = load(oldSeedPath);
const oldDraft = load(oldDraftPath);
const seed = load(repairedRoot + 'seed.json');
const draft = load(repairedRoot + 'draft.json');
const provenance = load(repairedRoot + 'provenance.json');
const affected = load(repairedRoot + 'affected-view.json');
const blind = load(ownRoot + 'blind-affected-review.json');
assert.equal(digest(oldSeed), english.seed_sha256);
assert.equal(digest(oldDraft), english.draft_sha256);
assert.equal(digest(oldDraft), oldReview.draft_sha256);
assert.deepEqual(oldSeed, seed);
assert.equal(digest(seed), draft.seed_sha256);
assert.equal(digest(seed), provenance.seed_sha256);
assert.equal(digest(draft), provenance.draft_sha256);
assert.equal(sha(fs.readFileSync(repairedRoot + 'draft.json')), provenance.draft_raw_sha256);
assert.equal(sha(fs.readFileSync(repairedRoot + 'affected-view.json')), blind.bindings.affected_view_sha256);
assert.equal(sha(fs.readFileSync(ownRoot + 'source-reasoning.json')), blind.bindings.source_reasoning_sha256);
const questionDiffs = draft.questions.filter(question =>
  digest(question) !== digest(oldDraft.questions.find(row => row.id === question.id))).map(row => row.id);
const coverageDiffs = draft.coverage.filter(row =>
  digest(row) !== digest(oldDraft.coverage.find(old => old.source_number === row.source_number))).map(row => row.source_number);
assert.deepEqual(questionDiffs, ['t6-wetting-set']);
assert.deepEqual(coverageDiffs, ['3']);
assert.deepEqual(Object.keys(oldDraft), Object.keys(draft));
for (const key of Object.keys(draft).filter(key => !['questions', 'coverage'].includes(key))) {
  assert.deepEqual(draft[key], oldDraft[key]);
}
assert.deepEqual(draft.questions.map(row => row.id), oldDraft.questions.map(row => row.id));
assert.deepEqual(draft.coverage.map(row => row.source_number), oldDraft.coverage.map(row => row.source_number));
const first = draft.questions[0];
assert.deepEqual(first.view, affected);
assert.deepEqual(first.source_numbers, ['3']);
assert.deepEqual(first.source_numbers, oldDraft.questions[0].source_numbers);
assert.deepEqual(first.key.correct, blind.complete_true_set);
assert.deepEqual(first.key.rationales.map(row => row.option_id), affected.options.map(row => row.id));
for (const row of first.key.rationales) {
  assert.equal(row.truth, blind.option_truth[row.option_id].truth ? 'correct' : 'incorrect');
}
assert.equal(oldReview.outcome, 'revise');
assert.equal(english.status, 'REVISE');
assert.equal(english.translation_status, 'PASS');
assert.equal(english.findings.length, 1);
assert.equal(english.findings[0].id, 'F1');
for (const row of oldReview.source_reviews.filter(row => row.source_number !== '3')) {
  assert.equal(row.coverage.verdict, 'pass');
}
for (const row of oldReview.question_reviews.filter(row => row.question_id !== first.id)) {
  for (const name of ['task_fidelity', 'redundancy', 'answer_leakage', 'mathematics']) {
    assert.equal(row[name].verdict, 'pass');
  }
}
const retainedIds = ['zh_lesson', 'zh_written', 'zh_answers', 'zh_figures_inventory',
  'en_lesson', 'en_written', 'en_answers', 'en_figures_inventory', 'zh_draft'];
const unchangedSnapshots = english.current_snapshots.filter(row => retainedIds.includes(row.id)).map(row => {
  const current = snapshot(row.path);
  assert.equal(current.byte_sha256, row.byte_sha256, row.id + ' byte binding');
  assert.equal(current.canonical_sha256, row.canonical_sha256, row.id + ' canonical binding');
  return { id: row.id, ...current, unchanged_from_D1917: true };
});
for (const id of ['seed', 'draft']) {
  const row = english.current_snapshots.find(row => row.id === id);
  assert.deepEqual(snapshot(row.path), {
    path: row.path, byte_sha256: row.byte_sha256, canonical_sha256: row.canonical_sha256
  });
}
assert.deepEqual(snapshot(oldRoot + 'review.json'), {
  path: oldRoot + 'review.json',
  byte_sha256: english.choice_review.byte_sha256,
  canonical_sha256: english.choice_review.canonical_sha256
});
const enWritten = load(english.current_snapshots.find(row => row.id === 'en_written').path);
const zhWritten = load(english.current_snapshots.find(row => row.id === 'zh_written').path);
const enAnswers = load(english.current_snapshots.find(row => row.id === 'en_answers').path);
const zhAnswers = load(english.current_snapshots.find(row => row.id === 'zh_answers').path);
const answerItems = object => {
  const result = [];
  const visit = value => {
    if (!value || typeof value !== 'object') return;
    if ('bookRaw' in value) result.push({ exercise: String(value.number ?? value.source_number ?? value.exercise), value: value.bookRaw });
    Object.values(value).forEach(visit);
  };
  visit(object);
  return result;
};
const bookRaw = answerItems(enAnswers);
assert.deepEqual(bookRaw, answerItems(zhAnswers));
assert.deepEqual(bookRaw, english.bookRaw_observation.values);
assert.equal(enWritten.exercises.length, 11);
assert.equal(zhWritten.exercises.length, 11);
assert.equal(english.written_answer_observations.length, 11);
assert(english.written_answer_observations.every(row => row.status === 'PASS'));
const reusedChoices = english.choice_translation_observations.filter(row => row.question_id !== first.id);
assert.equal(reusedChoices.length, 5);
for (const row of reusedChoices) {
  assert.equal(row.translation_status, 'PASS');
  assert.equal(row.semantic_status, 'PASS');
  assert.equal(row.en_question_sha256, digest(draft.questions.find(question => question.id === row.question_id)));
  assert.equal(row.en_coverage_sha256, digest(draft.coverage.find(coverage => coverage.source_number === row.source_numbers[0])));
}
const bindings = {
  schema: 'd1932-affected-review-bindings-v1',
  canonical_definition: "SHA-256 of UTF-8 json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(',', ':')). Raw byte hashes are separate.",
  original_seed: snapshot(oldSeedPath),
  original_draft: snapshot(oldDraftPath),
  original_review: snapshot(oldRoot + 'review.json'),
  original_english_review: snapshot(oldRoot + 'english-review.json'),
  repaired_seed: snapshot(repairedRoot + 'seed.json'),
  repaired_draft: snapshot(repairedRoot + 'draft.json'),
  repaired_provenance: snapshot(repairedRoot + 'provenance.json'),
  affected_view: snapshot(repairedRoot + 'affected-view.json'),
  source_reasoning: snapshot(ownRoot + 'source-reasoning.json'),
  blind_affected_review: snapshot(ownRoot + 'blind-affected-review.json'),
  authoritative_original_chinese: snapshot('ssot-resources/soviet10year-textbooks/artifacts/9p/lessons/phy9-c1-s5-t6/exercises.json'),
  unchanged_snapshots: unchangedSnapshots,
  comparisons: {
    original_and_repaired_seed_identical: true,
    changed_question_ids: questionDiffs,
    changed_coverage_sources: coverageDiffs,
    other_five_question_objects_and_coverage_rows_identical: true,
    question_and_coverage_order_unchanged: true,
    affected_view_equals_repaired_first_view: true,
    sealed_true_set_matches_repaired_key_without_normalization: true,
    source_number_mapping_unchanged: true,
    all_nine_retained_D1917_package_snapshots_byte_and_canonical_identical: true,
    original_seed_draft_and_failed_review_still_match_D1917_bindings: true,
    all_eleven_written_and_answer_translation_passes_reusable: true,
    all_five_unchanged_choice_translation_and_semantic_passes_reusable: true,
    all_bookRaw_values_equal_D1917_and_approved_Chinese: true,
    original_chinese_source_unchanged_basis: 'User-specified unchanged original source; current raw/canonical hash bound here. D1917 retained approved Chinese package hashes independently checked unchanged; no new historical-source rereview.'
  },
  first_question_sha256: digest(first),
  first_view_sha256: digest(first.view),
  first_intent_sha256: digest(first.intent),
  first_key_sha256: digest(first.key),
  first_coverage_sha256: digest(draft.coverage[0]),
  images: 0
};
if (!fs.existsSync(ownRoot + 'bindings.json')) {
  console.log(JSON.stringify(bindings, null, 2));
} else {
  assert.deepEqual(load(ownRoot + 'bindings.json'), bindings);
  const review = load(ownRoot + 'review.json');
  const differences = [];
  for (const key of ['source_reviews', 'question_reviews']) {
    const idKey = key === 'source_reviews' ? 'source_number' : 'question_id';
    const affectedId = key === 'source_reviews' ? '3' : first.id;
    for (const row of oldReview[key].filter(row => row[idKey] !== affectedId)) {
      const retained = review[key].find(current => current[idKey] === row[idKey]);
      if (digest(row) !== digest(retained)) {
        differences.push({ collection: key, id: row[idKey], expected: row, actual: retained });
      }
    }
  }
  if (differences.length) {
    console.log(JSON.stringify({ reused_record_mismatches: differences }, null, 2));
    process.exitCode = 1;
  } else {
    console.log(JSON.stringify({
      status: 'PASS',
      bindings: snapshot(ownRoot + 'bindings.json'),
      repaired_review: snapshot(ownRoot + 'review.json'),
      exact_reused_source_records: 5,
      exact_reused_question_records: 5,
      exact_reused_option_checks: 20,
      independently_new_source_records: 1,
      independently_new_question_records: 1,
      independently_new_option_checks: 6,
      reused_written_answer_record_ids: english.written_answer_observations.map(row => row.number),
      reused_written_answer_records_sha256: digest(english.written_answer_observations),
      reused_choice_record_ids: reusedChoices.map(row => row.question_id),
      reused_choice_records_sha256: digest(reusedChoices),
      original_finding_sha256: digest(english.findings[0]),
      images: 0
    }, null, 2));
  }
}

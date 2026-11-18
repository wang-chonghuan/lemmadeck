import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const current = path.join(root, '.intentfold/tickets/STEMROBIN-182/tmp/batch340-7a-n14-qualified-repair');
const prior = path.join(root, '.intentfold/tickets/STEMROBIN-182/tmp/batch339-7a-n14-math-notation-repair');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
const raw = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const oldSeed = read(path.join(prior, 'seed.json'));
const oldDraft = read(path.join(prior, 'draft.json'));
const oldReview = read(path.join(prior, 'review.json'));
const seed = read(path.join(current, 'seed.json'));
const draft = read(path.join(current, 'draft.json'));
assert.deepEqual(seed, oldSeed);
assert.equal(oldReview.outcome, 'blocked');
assert.equal(raw(path.join(prior, 'review.json')), 'f1e0494813a85567691357830347801a97dff29269e89b290065a69619c50225');
seed.exercises = seed.exercises.filter(row => row.number !== '321');
draft.questions = draft.questions.filter(row => !row.source_numbers.includes('321'));
draft.coverage = draft.coverage.filter(row => row.source_number !== '321');
write(path.join(current, 'seed.json'), seed);
const digestResult = spawnSync('python3', ['-B', '.agents/skills/ld-s10y-choice/scripts/prepare.py',
  'digest', path.join(current, 'seed.json')], { cwd: root, encoding: 'utf8' });
assert.equal(digestResult.status, 0, digestResult.stderr);
draft.seed_sha256 = digestResult.stdout.trim();
write(path.join(current, 'draft.json'), draft);

function diff(a, b, prefix = '') {
  if (JSON.stringify(a) === JSON.stringify(b)) return [];
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
    return [{ path: prefix, before: a, after: b }];
  }
  return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap(key =>
    diff(a[key], b[key], `${prefix}/${key}`));
}
const oldSelected = structuredClone(oldDraft);
oldSelected.questions = oldSelected.questions.filter(row => !row.source_numbers.includes('321'));
oldSelected.coverage = oldSelected.coverage.filter(row => row.source_number !== '321');
const differences = diff(oldSelected, draft);
const changed = new Set(['b338-308-constant-gap', 'b338-310-constant-proof-identities',
  'b338-320-divisibility-relationship']);
const unchanged = draft.questions.filter(row => !changed.has(row.id));
for (const question of unchanged) {
  assert.deepEqual(question, oldDraft.questions.find(row => row.id === question.id));
}
for (const question of draft.questions) {
  const previous = oldDraft.questions.find(row => row.id === question.id);
  if (question.id !== 'b338-320-divisibility-relationship') assert.deepEqual(question.key, previous.key);
  for (const option of previous.view.options) {
    const currentOption = question.view.options.find(row => row.id === option.id);
    if (question.id === 'b338-310-constant-proof-identities' && ['A', 'D'].includes(option.id)) {
      assert.equal(currentOption.id, option.id);
      assert.deepEqual(currentOption.figure_ids, option.figure_ids);
    } else {
      assert.deepEqual(currentOption, option);
    }
  }
}
assert.deepEqual(seed, { ...oldSeed, exercises: oldSeed.exercises.filter(row => row.number !== '321') });
assert.deepEqual(draft.new_figures, oldDraft.new_figures);
assert.equal(seed.exercises.length, 16);
assert.equal(draft.questions.length, 22);
assert.equal(draft.questions.reduce((sum, row) => sum + row.view.options.length, 0), 96);
assert.equal(unchanged.length, 19);
assert.equal(unchanged.reduce((sum, row) => sum + row.view.options.length, 0), 78);
const request = {
  scope: 'Incremental affected-unit review only; no repeated FIRST source/math/figure review',
  current: {
    seed: { path: path.relative(root, path.join(current, 'seed.json')), raw_sha256: raw(path.join(current, 'seed.json')) },
    draft: { path: path.relative(root, path.join(current, 'draft.json')), raw_sha256: raw(path.join(current, 'draft.json')) },
    sources: 16, questions: 22, options: 96, figures: 0
  },
  prior: {
    seed: { path: path.relative(root, path.join(prior, 'seed.json')), raw_sha256: raw(path.join(prior, 'seed.json')) },
    draft: { path: path.relative(root, path.join(prior, 'draft.json')), raw_sha256: raw(path.join(prior, 'draft.json')) },
    review: { path: path.relative(root, path.join(prior, 'review.json')), raw_sha256: raw(path.join(prior, 'review.json')) },
    reviewer: oldReview.reviewer,
    actual_outcome: oldReview.outcome,
    all_24_true_sets_and_100_option_mathematics_pass: true
  },
  full_selected_draft_diff: differences,
  inherited_unchanged_questions: unchanged.map(row => row.id),
  inherited_unchanged_questions_count: 19,
  inherited_unchanged_options_count: 78,
  affected: {
    stem_only: ['b338-308-constant-gap'],
    neutral_stem_and_equivalent_conclusion_references: ['b338-310-constant-proof-identities'],
    added_complete_relation_options: ['b338-320-divisibility-relationship:G', 'b338-320-divisibility-relationship:H'],
    unchanged_math_precisely_inherited: '308 A-D,310 A-D,320 A-F;14 existing option truths; no re-solving',
    scope: 'Evaluate repaired leakage/fidelity, independently derive complete relation before new G/H/key, loss/coverage and removal321 dependencies',
    excluded_entire_source: '321',
    excluded_source_original_questions_and_SOURCE_HOLD_preserved: true
  },
  allowed_output_paths: [path.relative(root, path.join(current, 'review.json'))],
  current_approval: false,
  display_pending: true,
  parent_new_images: 0,
  parent_cumulative_images: 24,
  source_or_trace_or_FIRST_checks_rerun: false,
  whole_lesson_APP_independent_production_or881_approved: false
};
write(path.join(current, 'affected-review-request.json'), request);
write(path.join(current, 'review-projection.view.json'), draft.questions.filter(row => changed.has(row.id))
  .map(row => ({ id: row.id, view: row.view })));
write(path.join(current, 'review-last.intent-key.json'), draft.questions.filter(row => changed.has(row.id))
  .map(row => ({ id: row.id, source_numbers: row.source_numbers, intent: row.intent, key: row.key })));
console.log(JSON.stringify({ sources: 16, questions: 22, options: 96, changed_questions: 3,
  unchanged_questions: 19, unchanged_options: 78, request_raw_sha256: raw(path.join(current, 'affected-review-request.json')),
  seed_digest: draft.seed_sha256, selected_diff_paths: differences.map(row => row.path) }, null, 2));

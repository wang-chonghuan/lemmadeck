import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  chmodSync,
  existsSync,
  readFileSync,
  realpathSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
const base = '.intentfold/tickets/STEMROBIN-182/tmp/resume182-13';
const owned = `${base}/n38-choice-review`;
const author = `${base}/n38-choice-affected-author`;
const receiptPath = `${owned}/stage3-validation.json`;
const manifestPath = `${owned}/stage3-hashes.json`;
assert.equal(realpathSync(process.cwd()), realpathSync(repo));
assert(!existsSync(receiptPath), 'Single-run validator receipt already exists');
assert(!existsSync(manifestPath), 'Never overwrite a prior Stage3 manifest');

const load = (file) => JSON.parse(readFileSync(path.join(repo, file), 'utf8'));
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const byteHash = (file) => sha(readFileSync(path.join(repo, file)));
const sorted = (value) => {
  if (Array.isArray(value)) return value.map(sorted);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, sorted(value[key])]),
    );
  }
  return value;
};
const canonicalHash = (value) => sha(
  JSON.stringify(sorted(value)).replace(
    /[\u007f-\uffff]/g,
    (character) => `\\u${character.charCodeAt(0).toString(16).padStart(4, '0')}`,
  ),
);
const mode = (file) => `0${(statSync(path.join(repo, file)).mode & 0o777).toString(8)}`;
const inheritedExpected = {
  'stage1-independent-solves.md': '1642034ff8a92968da4916d691e8d6f5adaa71f26e9637bc1a15074176532452',
  'stage1-provenance-missing.md': 'c4432e5e2897e50ef643387063dd07b34733cd08f5ef3c762fdcd06a4da9caa8',
  'stage1-verification.mjs': '42db74beb90080b48a9784cfcc426aabb49ac58a2f6042f4de019c56281b30d8',
  'stage1-hashes.json': '5820c3c7252bfba53d37cf66546222ef6a9f2cd052ea13db1c6775f4fe85aa0c',
  'stage2-fidelity-leakage.md': '0d668153b5d00fdac47e68e30fe98dc250739d6da059e63003825a39e1651faf',
  'stage2-option-mathematics.md': '8d4fc13b9a2ad1a250227966dbb6278ab95ebe61b5f490c9529bea9dfae9ff99',
  'stage2-verification.mjs': '99e38f2525067d4f3851178dc11d42c1306e057325f8fdccedf74a1f88c40f46',
  'stage2-hashes.json': '697e291e05f8e3ba66e082ff7744b77ecdbeca1b932f2e8ba4af15b5fe8e0ef7',
  'stage2-affected-fidelity.md': '5d83bdefbc52ed27e48a637d846feabc3d95adae22b5f07a3190de824648e4aa',
  'stage2-affected-mathematics.md': '3ade1841ea561d487f879f4bb350567a88f551669147c2e4740cb36713bf6e45',
  'stage2-affected-verification.mjs': '7a9dcff4201c25a12190a2f227bb19a6f696228e88171b4b0b8ec9d49fcb58d2',
  'stage2-affected-hashes.json': '34b0f56448478133a8ced3657c86e256e66bdf0c2e591615afddbbff8393f780',
};
const assertInheritance = () => {
  for (const [file, hash] of Object.entries(inheritedExpected)) {
    assert.equal(byteHash(`${owned}/${file}`), hash, `${file}: changed inherited bytes`);
    assert.equal(mode(`${owned}/${file}`), '0444', `${file}: changed inherited mode`);
  }
};
assertInheritance();

const seedPath = `${author}/source.json`;
const draftPath = `${author}/draft.json`;
const viewsPath = `${author}/views.json`;
const reviewPath = `${owned}/review.json`;
const seed = load(seedPath);
const draft = load(draftPath);
const views = load(viewsPath);
const review = load(reviewPath);
const first = load(`${owned}/stage2-hashes.json`);
const affected = load(`${owned}/stage2-affected-hashes.json`);
assert.equal(byteHash(seedPath), '77bf17157ed5f78d99c9fe777a8ee7780bf133aaa08bbdffbfeea351e282df37');
assert.equal(canonicalHash(seed), '7408cddfd1708375927eedd577eed061db345b7befc28caead8e875c72826875');
assert.equal(byteHash(draftPath), 'f6de1066dc5b039484561f64c1694ff9321aaf899c79ac5cf60f682b47123e25');
assert.equal(canonicalHash(draft), 'd45b2967119c97624e24ea324f17f958a0719146ce37db435613a9422c81ad7b');
assert.equal(byteHash(viewsPath), 'c714bf73152f28cdfaf3db95cfd09008831da026c5d6c51a8901bfbc088c9da5');
assert.deepEqual(
  draft.questions.map((question) => ({ question_id: question.id, view: question.view })),
  views,
  'Repaired draft does not project to independently reviewed affected views',
);
assert.equal(seed.exercises.length, 7);
assert.equal(draft.questions.length, 13);
assert.equal(review.source_reviews.length, 7);
assert.equal(review.question_reviews.length, 13);
assert.equal(review.reviewer.kind, 'independent_agent');
assert.equal(review.seed_sha256, canonicalHash(seed));
assert.equal(review.draft_sha256, canonicalHash(draft));
assert.equal(review.outcome, 'pass');
assert.deepEqual(seed.figures, []);
assert.deepEqual(draft.new_figures, []);
assert.deepEqual(review.figure_checks, []);
assert.deepEqual(review.new_figure_reviews, []);
const sets = new Map(first.complete_independent_true_sets.map(
  (entry) => [entry.question_id, entry.correct],
));
for (const entry of affected.complete_affected_true_sets) {
  sets.set(entry.question_id, entry.correct);
}
const reviews = new Map(review.question_reviews.map((entry) => [entry.question_id, entry]));
let options = 0;
let trueOptions = 0;
let falseOptions = 0;
let distractors = 0;
for (const question of draft.questions) {
  const frozen = sets.get(question.id);
  const row = reviews.get(question.id);
  assert(frozen && row, `Missing inherited or canonical question:${question.id}`);
  assert.deepEqual(question.key.correct, frozen, `${question.id}: author key differs from freeze`);
  assert.deepEqual(row.mathematics.correct, frozen, `${question.id}: review differs from freeze`);
  assert.deepEqual(
    row.mathematics.option_checks.map((check) => check.option_id),
    question.view.options.map((option) => option.id),
  );
  assert.equal(question.key.rationales.length, question.view.options.length);
  for (const check of row.mathematics.option_checks) {
    const rationale = question.key.rationales.find((item) => item.option_id === check.option_id);
    const truth = frozen.includes(check.option_id) ? 'correct' : 'incorrect';
    assert.equal(check.truth, truth);
    assert.equal(rationale.truth, truth);
    assert(check.evidence.length > 40);
    assert(rationale.derivation.length > 20);
    if (truth === 'correct') {
      assert.equal(rationale.misconception, null);
      trueOptions += 1;
    } else {
      assert.equal(typeof rationale.misconception, 'string');
      assert(rationale.misconception.length > 20);
      falseOptions += 1;
      distractors += 1;
    }
    options += 1;
  }
  assert.deepEqual(question.view.figure_ids, []);
  for (const option of question.view.options) assert.deepEqual(option.figure_ids, []);
}
assert.deepEqual([options, trueOptions, falseOptions, distractors], [55, 16, 39, 39]);
assert.equal(draft.questions.filter((question) => question.view.mode === 'single').length, 11);
assert.equal(draft.questions.filter((question) => question.view.mode === 'multiple').length, 2);

for (const file of ['review.json', 'stage3-comparison.md', 'stage3-validation.mjs']) {
  assert.equal(mode(`${owned}/${file}`), '0444', `${file}: freeze before validator`);
}
const boundInputs = [seedPath, draftPath, viewsPath, reviewPath].map(
  (file) => ({ path: file, sha256: byteHash(file), mode: mode(file) }),
);
const validatorPath = '.agents/skills/ld-s10y-choice/scripts/validate.py';
const validatorHash = byteHash(validatorPath);
const args = [
  validatorPath, '--repo', '.', '--seed', seedPath,
  '--draft', draftPath, '--review', reviewPath,
];
const command = `PYTHONDONTWRITEBYTECODE=1 python3 ${args.join(' ')}`;
const started = new Date().toISOString();

// This is the only validator invocation; its immutable receipt survives failure.
const result = spawnSync('python3', args, {
  cwd: repo,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  encoding: 'utf8',
  maxBuffer: 1024 * 1024,
  timeout: 120000,
});
const receipt = {
  schema: 'n38-canonical-choice-validation-receipt@1',
  ticket: 'STEMROBIN-182',
  date: '2026-11-19',
  cwd: repo,
  command,
  executable: 'python3',
  argv: args,
  environment_override: { PYTHONDONTWRITEBYTECODE: '1' },
  started_at_utc: started,
  finished_at_utc: new Date().toISOString(),
  validator: { path: validatorPath, sha256: validatorHash },
  invocation_count: 1,
  exit_code: result.status,
  signal: result.signal,
  execution_error: result.error ? { code: result.error.code, message: result.error.message } : null,
  stdout: result.stdout ?? '',
  stderr: result.stderr ?? '',
  input_snapshots: boundInputs,
  canonical_seed_sha256: canonicalHash(seed),
  canonical_draft_sha256: canonicalHash(draft),
  canonical_review_sha256: canonicalHash(review),
  semantic_scope: 'Existing validator checks mechanical consistency and declared pass, not automatic mathematical proof.',
};
writeFileSync(path.join(repo, receiptPath), `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx' });
chmodSync(path.join(repo, receiptPath), 0o444);

assertInheritance();
for (const input of boundInputs) {
  assert.equal(byteHash(input.path), input.sha256, `${input.path}: changed during validation`);
}
const newOutputs = [
  'review.json', 'stage3-comparison.md', 'stage3-validation.mjs', 'stage3-validation.json',
].map((file) => {
  const relative = `${owned}/${file}`;
  return {
    path: relative,
    sha256: byteHash(relative),
    mode: mode(relative),
    ...(file === 'review.json' ? { canonical_sha256: canonicalHash(review) } : {}),
  };
});
const manifest = {
  schema: 'n38-canonical-choice-stage3-freeze@1',
  ticket: 'STEMROBIN-182',
  date: '2026-11-19',
  checkout: repo,
  branch: 'codex/STEMROBIN-182-textbooks',
  write_directory: owned,
  reviewer: review.reviewer,
  review_outcome: review.outcome,
  validator_exit_code: result.status,
  validator_invocation_count: 1,
  validator_receipt: receiptPath,
  validation_meaning: 'Exit0 is mechanical consistency plus declared semantic pass, not automatically proved mathematics.',
  inputs: boundInputs,
  canonical_seed_sha256: canonicalHash(seed),
  canonical_draft_sha256: canonicalHash(draft),
  inherited_evidence: Object.entries(inheritedExpected).map(
    ([file, hash]) => ({ path: `${owned}/${file}`, sha256: hash, mode: '0444' }),
  ),
  rejected_first_preserved: {
    outcome: first.outcome,
    findings: first.findings.map((finding) => ({ id: finding.id, verdict: finding.verdict })),
    bytes_and_modes_unchanged: true,
  },
  affected_inheritance: {
    affected_question_ids: affected.affected_question_ids,
    unchanged_other_questions: 11,
    unchanged_rounding_options: 5,
    original_view_inverse_delta_sha256: affected.delta_evidence.original_view_byte_sha256_reconstructed_in_memory,
    repaired_draft_projection_equals_affected_views: true,
    resolved_findings: affected.resolved_findings,
  },
  complete_independent_true_sets: draft.questions.map(
    (question) => ({ question_id: question.id, correct: sets.get(question.id) }),
  ),
  counts: {
    source_reviews: 7,
    original_source_tasks_inherited: 49,
    captured_correction_occurrences_inherited: 18,
    captured_add_occurrences: 14,
    captured_next_subtract_occurrences: 4,
    question_reviews: 13,
    options_compared_to_freezes: options,
    correct_option_derivations_compared: trueOptions,
    distractor_derivations_and_misconceptions_compared: distractors,
    true_options: trueOptions,
    false_options: falseOptions,
    single_questions: 11,
    multiple_questions: 2,
    source_re_solves: 0,
    stage2_rechecks: 0,
    images: 0,
    new_figures: 0,
  },
  historical_limitations: {
    uncaptured_required_main_addresses: 28,
    uncaptured_correction_addresses: 5,
    missing_historical_cells_remain_missing: true,
    new_math_context_independently_reviewed_as_new_not_printed: true,
    source_seed_unchanged: true,
    no_personal_pixel_inspection_claimed: true,
  },
  outputs: newOutputs,
  manifest_mode: '0444',
  manifest_self_hash: 'Returned separately; not embedded recursively.',
  stop: 'Offline paths/hashes/results only; no images, DB, app, deps, network, paid, promotion, finalizer, publication, commit or other writes.',
};
writeFileSync(path.join(repo, manifestPath), `${JSON.stringify(manifest, null, 2)}\n`, { flag: 'wx' });
chmodSync(path.join(repo, manifestPath), 0o444);
console.log(JSON.stringify({
  outcome: review.outcome,
  validator_exit_code: result.status,
  validator_invocations: 1,
  stdout: receipt.stdout,
  stderr: receipt.stderr,
  counts: manifest.counts,
  outputs: [
    ...newOutputs,
    { path: manifestPath, sha256: byteHash(manifestPath), mode: mode(manifestPath) },
  ],
}, null, 2));
process.exitCode = result.status ?? 2;

import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

const workdir = '/Users/yong/.codex/worktrees/a07e/lemmadeck';
const own = '.tmp/s10y-choice/batch013-independent35-affected/';
const priorRoot = '.tmp/s10y-choice/batch013-independent35/';
const seedPath = '.tmp/s10y-choice/batch013-author3435/n35.seed.json';
const oldPath = '.tmp/s10y-choice/batch013-author3435/n35.draft.json';
const draftPath = '.tmp/s10y-choice/batch013-repair35/draft.json';
const priorPath = priorRoot + 'review.json';
const reviewPath = own + 'review.json';
const hash = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const load = (path) => JSON.parse(readFileSync(path, 'utf8'));
const save = (path, value) => writeFileSync(path, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const env = { ...process.env, PYTHONDONTWRITEBYTECODE: '1' };
const digest = (path) => {
  const result = spawnSync('python3', [
    '.agents/skills/ld-s10y-choice/scripts/prepare.py', 'digest', path,
  ], { cwd: workdir, env, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
};
const original = load(oldPath);
const candidate = load(draftPath);
const prior = load(priorPath);
const priorValidation = load(priorRoot + 'validation.json');
assert.equal(hash(oldPath), 'aeb9f42b4c9f18b2e3e8d0922b24f59d2f62df37cef2d74a2e229868b9d22d20');
assert.equal(hash(draftPath), '7ba2a6db81f31538a7f9d2a9fa2a4b4909ddf32b6c3744c4c99f1730b369f18f');
assert.equal(hash(priorPath), 'b4ed17163b88420a4040428af46d92825bfc77d9315bc45b805c025cddb27663');
assert.equal(prior.outcome, 'revise');
assert.equal(priorValidation.semantic_outcome, 'revise');
assert.equal(digest(oldPath), prior.draft_sha256);
assert.equal(digest(seedPath), prior.seed_sha256);
const candidateDigest = digest(draftPath);
assert.equal(candidateDigest, '5f21af1d619f14e0b0ebe57b281c22774c509cb6f12002516b1ff3c6025ac3ae');

const differences = [];
function compare(a, b, path) {
  if (JSON.stringify(a) === JSON.stringify(b)) return;
  if (a && b && typeof a === 'object' && typeof b === 'object' &&
      Array.isArray(a) === Array.isArray(b)) {
    for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
      compare(a[key], b[key], `${path}/${key}`);
    }
  } else {
    differences.push({ path, before: a, after: b });
  }
}
compare(original, candidate, '');
assert.equal(differences.length, 1);
assert.equal(differences[0].path, '/questions/4/intent/task');
assert.equal(original.questions[4].id, 'q328');
assert.equal(candidate.questions[4].id, 'q328');
const oldPhrase = '\u4e24\u5c42\u7b49\u8170\u76f4\u89d2\u5206\u89e3\u8ba1\u7b97';
const newPhrase = '\u4e24\u6b21\u52fe\u80a1\u8ba1\u7b97';
assert.ok(differences[0].before.includes(oldPhrase));
assert.equal(differences[0].after, differences[0].before.replace(oldPhrase, newPhrase));

const failures = [];
for (const source of prior.source_reviews) {
  if (source.coverage.verdict !== 'pass') failures.push(`source:${source.source_number}`);
}
for (const question of prior.question_reviews) {
  for (const field of ['task_fidelity', 'redundancy', 'answer_leakage', 'mathematics']) {
    if (question[field].verdict !== 'pass') failures.push(`${question.question_id}:${field}`);
  }
}
assert.deepEqual(failures, ['q328:mathematics']);
assert.deepEqual(prior.new_figure_reviews, []);
for (const figure of prior.figure_checks) assert.equal(hash(figure.asset_path), figure.asset_sha256);

const review = structuredClone(prior);
review.draft_sha256 = candidateDigest;
review.reviewer.identity +=
  '; authorized affected-only follow-up: reused prior unchanged source, option, coverage and figure evidence ' +
  'from batch013-independent35/review.json (file SHA256 b4ed17163b88420a4040428af46d92825bfc77d9315bc45b805c025cddb27663). ' +
  'Only q328.intent.task wording was reviewed anew; no images or answer files reopened. See batch013-independent35-affected/diff.json.';
const affected = review.question_reviews.find((q) => q.question_id === 'q328');
affected.mathematics.verdict = 'pass';
affected.mathematics.independent_solution =
  'Affected-only wording follow-up: exact structured diff changes only q328.intent.task from the erroneous ' +
  'isosceles-right decomposition claim to two Pythagorean calculations. This now correctly describes the ' +
  'unchanged source_solution: first UC^2=a^2-(a/2)^2=3a^2/4, then UV^2=UC^2-(a/2)^2=a^2/2. ' +
  'No claim that either right triangle is isosceles remains. Prior independent midpoint proof, exact true set D, ' +
  'all four option checks and their derivations are reused unchanged from the hash-bound prior review; ' +
  'they were not independently solved again in this follow-up. The sole prior internal wording defect is repaired.';
review.outcome = 'pass';
assert.deepEqual(review.source_reviews, prior.source_reviews);
assert.deepEqual(review.figure_checks, prior.figure_checks);
assert.deepEqual(review.new_figure_reviews, prior.new_figure_reviews);
for (const question of review.question_reviews) {
  const previous = prior.question_reviews.find((q) => q.question_id === question.question_id);
  if (question.question_id !== 'q328') {
    assert.deepEqual(question, previous);
  } else {
    for (const field of ['task_fidelity', 'redundancy', 'answer_leakage']) {
      assert.deepEqual(question[field], previous[field]);
    }
    assert.deepEqual(question.mathematics.correct, previous.mathematics.correct);
    assert.deepEqual(question.mathematics.option_checks, previous.mathematics.option_checks);
  }
}

save(reviewPath, review);
save(own + 'diff.json', {
  schema: 'same184-3/affected-only-diff@1',
  outcome: 'pass',
  workdir,
  seed: { path: seedPath, file_sha256: hash(seedPath), canonical_sha256: prior.seed_sha256 },
  original_draft: { path: oldPath, file_sha256: hash(oldPath), canonical_sha256: prior.draft_sha256 },
  candidate_draft: { path: draftPath, file_sha256: hash(draftPath), canonical_sha256: candidateDigest },
  prior_review: { path: priorPath, file_sha256: hash(priorPath), outcome: 'revise', retained_untouched: true },
  differences,
  changed_item_count: 1,
  reviewed_new_semantics: 'Only q328.intent.task: two Pythagorean calculations accurately describes the unchanged two right-triangle reductions.',
  unchanged_draft_fields: 'All views, keys, source_solution, other intent fields, other questions, source bindings, new_figures and coverage are identical as structured JSON.',
  reuse: {
    source_reviews: 'All six copied verbatim from prior evidence, not re-reviewed.',
    unaffected_questions: ['q324', 'q325', 'q326', 'q327', 'q329'],
    affected_question_unchanged_checks: 'q328 fidelity, redundancy, leakage, independent true set and all four option checks copied verbatim.',
    figure_checks: 'All copied verbatim; current figure bytes rehashed solely for binding, no images viewed.',
    new_figures: 'None before or after.',
    prior_answer_gate: {
      path: priorRoot + 'answerGate.json',
      previously_recorded_file_sha256: '03820b1a2d9ed590e363f3e236d73b83b04b170d68946e3d039e38956734efd6',
      previously_bound_answer_keys_sha256: '599f2a4a21f74f2a358544d8862b48a4d1868a3f329e6dfe3252452f03170092',
      status: 'Prior seven-answer semantic pass reused; outside this sole choice-intent change. No answer or answerGate file read, modified or re-reviewed in this follow-up.',
    },
  },
  new_review: { path: reviewPath, file_sha256: hash(reviewPath), outcome: review.outcome },
  images_opened: 0,
  preliminary_check_note: 'An initial shorthand-substitution assertion duplicated the word calculation. The assertion expectation was corrected to compare the exact complete before/after wording; the candidate was not changed. This was not a strict-validator run or a candidate semantic failure.',
});

const args = [
  '.agents/skills/ld-s10y-choice/scripts/validate.py',
  '--repo', '.', '--seed', seedPath, '--draft', draftPath, '--review', reviewPath,
];
const result = spawnSync('python3', args, { cwd: workdir, env, encoding: 'utf8' });
save(own + 'validation.json', {
  schema: 'same184-3/affected-only-validation@1',
  command: 'env PYTHONDONTWRITEBYTECODE=1 python3 ' + args.join(' '),
  workdir,
  strict_validator_invocations: 1,
  exit_code: result.status,
  stdout: result.stdout,
  stderr: result.stderr,
  spawn_error: result.error ? String(result.error) : null,
  seed_canonical_sha256: prior.seed_sha256,
  draft_canonical_sha256: candidateDigest,
  review_file_sha256: hash(reviewPath),
  review_canonical_sha256: digest(reviewPath),
  prior_review_retained_untouched: hash(priorPath) === 'b4ed17163b88420a4040428af46d92825bfc77d9315bc45b805c025cddb27663',
  candidate_retained_untouched: hash(draftPath) === '7ba2a6db81f31538a7f9d2a9fa2a4b4909ddf32b6c3744c4c99f1730b369f18f',
  diff_file_sha256: hash(own + 'diff.json'),
  semantic_outcome: review.outcome,
  new_images_opened: 0,
  repeated_semantic_reviews: 0,
});
console.log(JSON.stringify({
  outcome: review.outcome,
  validatorExitCode: result.status,
  validatorOutput: result.stdout.trim(),
  review: reviewPath,
  reviewFileSha256: hash(reviewPath),
  reviewCanonicalSha256: digest(reviewPath),
  draftFileSha256: hash(draftPath),
  draftCanonicalSha256: candidateDigest,
  diff: own + 'diff.json',
  diffFileSha256: hash(own + 'diff.json'),
  validation: own + 'validation.json',
  validationFileSha256: hash(own + 'validation.json'),
  imagesOpened: 0,
}, null, 2));
assert.equal(result.status, 0, result.stderr || result.stdout);

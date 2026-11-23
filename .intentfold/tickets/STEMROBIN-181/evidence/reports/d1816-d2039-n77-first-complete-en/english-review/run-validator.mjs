import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';

const repo = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-181';
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp');
const input = path.join(tmp, 'd1816-d2034-n77-en-choice-review-inputs');
const prior = path.join(tmp, 'd1816-d2038-n77-first-en-review');
const own = path.join(tmp, 'd1816-n77-q2-inline-wrap-review');
const resultPath = path.join(own, 'validator-result.json');
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const read = filename => JSON.parse(fs.readFileSync(filename, 'utf8'));
const bind = filename => {
  const bytes = fs.readFileSync(filename);
  return { path: filename, bytes: bytes.length, sha256: sha256(bytes) };
};
const requireFact = (condition, message) => {
  if (!condition) throw new Error(message);
};

// Refuse a second invocation or input drift; verify reuse without reopening product units.
for (const filename of ['validator-result.json', 'validator.stdout.txt', 'validator.stderr.txt']) {
  requireFact(!fs.existsSync(path.join(own, filename)), `Existing validator evidence: ${filename}`);
}
const english = read(path.join(own, 'english-review.json'));
const review = read(path.join(own, 'review.json'));
const oldReview = read(path.join(prior, 'review.json'));
const currentBindings = [
  ...Object.entries(english.input_bindings).map(([id, binding]) => {
    const actual = bind(path.join(repo, binding.path));
    requireFact(actual.sha256 === binding.sha256 && actual.bytes === binding.bytes, `Input drift: ${id}`);
    return { id, ...actual };
  }),
  { id: 'composite_review', ...bind(path.join(own, 'review.json')) },
  { id: 'affected_english_review', ...bind(path.join(own, 'english-review.json')) }
];
for (const field of ['source_reviews', 'figure_checks', 'new_figure_reviews']) {
  requireFact(isDeepStrictEqual(review[field], oldReview[field]), `Changed retained ${field}`);
}
for (const index of [0, 2, 3, 4, 5, 6, 7]) {
  requireFact(isDeepStrictEqual(review.question_reviews[index], oldReview.question_reviews[index]),
    `Changed retained question review ${index + 1}`);
}
const draft = read(path.join(input, 'draft.json'));
const before = read(path.join(input, 'draft.first-approved-before-wrap.json'));
const views = read(path.join(input, 'views.json'));
const beforeViews = read(path.join(input, 'views.first-approved-before-wrap.json'));
requireFact(isDeepStrictEqual(draft.questions.map(q => q.view), views), 'Current view projection mismatch');
requireFact(isDeepStrictEqual(before.questions.map(q => q.view), beforeViews), 'Preserved view projection mismatch');
for (const delta of english.exact_delta) {
  const index = ['A', 'B', 'C', 'D'].indexOf(delta.option_id);
  requireFact(before.questions[1].view.options[index].text === delta.before, 'Unexpected before text');
  requireFact(draft.questions[1].view.options[index].text === delta.after, 'Unexpected current text');
  const relations = [...delta.after.matchAll(/\$([^$]+)\$/g)].map(match => match[1]);
  const oldRelations = delta.before.slice(1, delta.before.indexOf('$', 1)).split(',\\quad ');
  requireFact(relations.length === 3 && isDeepStrictEqual(relations, oldRelations),
    `Equation delta in ${delta.option_id}`);
  draft.questions[1].view.options[index].text = delta.before;
}
requireFact(isDeepStrictEqual(draft, before), 'Draft changes beyond the four declared text deltas');

const command = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
const argv = [
  '-B',
  '.agents/skills/ld-s10y-choice/scripts/validate.py',
  '--repo', repo,
  '--seed', path.join(input, 'seed.json'),
  '--draft', path.join(input, 'draft.json'),
  '--review', path.join(own, 'review.json'),
  '--edition', 'modern-us-neutral-en'
];
const startedAt = new Date().toISOString();
const child = spawnSync(command, argv, {
  cwd: repo,
  encoding: null,
  maxBuffer: 1024 * 1024,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' }
});
const finishedAt = new Date().toISOString();
const stdout = child.stdout ?? Buffer.alloc(0);
const stderr = child.stderr ?? Buffer.alloc(0);
const stdoutPath = path.join(own, 'validator.stdout.txt');
const stderrPath = path.join(own, 'validator.stderr.txt');
fs.writeFileSync(stdoutPath, stdout, { flag: 'wx' });
fs.writeFileSync(stderrPath, stderr, { flag: 'wx' });
const changedInputs = currentBindings.flatMap(binding => {
  const after = bind(binding.path);
  return after.sha256 === binding.sha256 ? [] : [{ before: binding, after }];
});
const result = {
  card: english.card,
  scope: 'Q2 A-D inline-wrap affected-only independent content/format review',
  cwd: repo,
  command,
  argv,
  invocations: 1,
  startedAt,
  finishedAt,
  exitCode: child.status,
  signal: child.signal,
  error: child.error ? { code: child.error.code, message: child.error.message } : null,
  streams: { stdout: bind(stdoutPath), stderr: bind(stderrPath) },
  currentInputBindings: currentBindings,
  changedInputs,
  unchangedInspectedUnitBindings: {
    path: path.join(prior, 'english-review.json'),
    sha256: english.input_bindings.original_english_review.sha256,
    pointer: '/inspected_inputs',
    qualification: 'Original qualified bindings reused by reference; no full product/package rehash'
  },
  affectedOutcome: review.outcome,
  closesReady: child.status === 0 && !child.error && changedInputs.length === 0 && review.outcome === 'pass',
  closesReadyScope: 'Affected-only independent content/format review, not repaired mobile-display/native/DOM/pixel/publication/ticket closure'
};
fs.writeFileSync(resultPath, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
process.stdout.write(stdout);
process.stderr.write(stderr);
console.log(JSON.stringify({
  validatorResult: resultPath,
  exitCode: result.exitCode,
  signal: result.signal,
  error: result.error,
  changedInputs: result.changedInputs,
  affectedOutcome: result.affectedOutcome,
  closesReady: result.closesReady,
  closesReadyScope: result.closesReadyScope
}, null, 2));
process.exitCode = child.status ?? 2;

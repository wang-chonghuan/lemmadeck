const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const out = path.join(process.cwd(), '.intentfold/tickets/STEMROBIN-188/tmp/n46-answer-choice-display-source-review-01');
const read = name => JSON.parse(fs.readFileSync(path.join(out, name), 'utf8'));
const exact = (value, keys, label) => {
  if (Object.keys(value).sort().join(',') !== [...keys].sort().join(',')) throw new Error(`Output field mismatch: ${label}`);
};
const r = read('review.json');
exact(r, ['schema', 'seed_sha256', 'draft_sha256', 'reviewer', 'source_reviews', 'figure_checks', 'new_figure_reviews', 'question_reviews', 'outcome'], 'review');
if (r.schema !== 's10y-choice-review-v1' || r.outcome !== 'pass') throw new Error('Unexpected native review schema/outcome');
for (const s of r.source_reviews) {
  exact(s, ['source_number', 'independent_solution', 'coverage'], 'source review');
  exact(s.coverage, ['verdict', 'evidence'], 'source coverage');
}
for (const q of r.question_reviews) {
  exact(q, ['question_id', 'task_fidelity', 'redundancy', 'answer_leakage', 'mathematics'], 'question review');
  for (const field of ['task_fidelity', 'redundancy', 'answer_leakage']) exact(q[field], ['verdict', 'evidence'], field);
  exact(q.mathematics, ['verdict', 'independent_solution', 'correct', 'option_checks'], 'mathematics');
  for (const o of q.mathematics.option_checks) exact(o, ['option_id', 'truth', 'evidence'], 'option check');
}
const after = read('bindings-after.json');
if (after.files.some(x => !x.matches) || after.changed_since_before.length) throw new Error('Input binding instability');
if (r.source_reviews.length !== 6 || r.question_reviews.length !== 11 || r.question_reviews.reduce((n, q) => n + q.mathematics.option_checks.length, 0) !== 44) throw new Error('Review count mismatch');
const files = fs.readdirSync(out).sort().filter(name => name !== 'output-index.json').map(name => {
  const p = path.join(out, name);
  const bytes = fs.readFileSync(p);
  if (name.endsWith('.json')) JSON.parse(bytes.toString('utf8'));
  return {name, path: p, raw_sha256: crypto.createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length};
});
const summary = {
  assignment: 'SAME188-6 / STEMROBIN-188 sole independent reviewer',
  status: 'complete-for-collection',
  review_directory: out,
  verdicts: {choice: 'pass', answer_mathematics: 'pass', answer_learner_ready: 'revise', convention_role: 'pass', display: 'revise', source_affected_fidelity: 'pass'},
  failures: read('counters.json').semantic_failures,
  retained_unknowns: ['Historical p0056 O/0 typography', 'p0172 label-49 exact round glyph and broader annotation convention'],
  input_bindings: {files: after.files.length, mismatches_before: 0, mismatches_after: 0, changes: 0},
  canonical_sha256: {seed: r.seed_sha256, draft: r.draft_sha256},
  image_loads: {planned: 7, actual: 7, reopens: 0, reviewer_created_crops: 0, collages: 0, batch_peak: 7, context_peak: 7},
  verification_scope: 'JSON parse, exact native review output field sets, declared counts/sets, projection comparison and before/after actual-byte binding only. Not the native validator, browser, render or prior PASS rerun.',
  output_files: files,
  native_validate_executed: false,
  human_or_parent_approval: false,
  parent_message_sent: false
};
const target = path.join(out, 'output-index.json');
if (fs.existsSync(target)) throw new Error(`Refusing overwrite: ${target}`);
fs.writeFileSync(target, JSON.stringify(summary, null, 2) + '\n');
const indexHash = crypto.createHash('sha256').update(fs.readFileSync(target)).digest('hex');
console.log(JSON.stringify({output_index: target, output_index_raw_sha256: indexHash, input_files: after.files.length, input_mismatches: 0, input_changes: 0, files: files.filter(x => ['review.json', 'answer-review.json', 'convention-review.json', 'visual-review.json', 'source-affected-review.json', 'report.md'].includes(x.name)), image_loads: 7, failures: summary.failures}, null, 2));

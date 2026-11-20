import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
if (process.cwd() !== root) throw new Error('Unexpected cwd');
const base = '.intentfold/tickets/STEMROBIN-188/tmp';
const out = path.join(root, base, 'n42-answer-choice-review');
const hash = x => crypto.createHash('sha256').update(x).digest('hex');
const canonical = x => JSON.stringify(x, (k, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v)
  .replace(/[\u007f-\uffff]/g, c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));
const bindings = [];
const read = (file, role) => {
  const absolute = path.resolve(root, file);
  const bytes = fs.readFileSync(absolute);
  const value = JSON.parse(bytes);
  bindings.push({ path: absolute, sha256: hash(bytes), canonical_sha256: hash(canonical(value)), role });
  return value;
};
const firstSeal = read(path.join(out, 'FIRST-seal.json'), 'earlier source seal');
const prekeySeal = read(path.join(out, 'PREKEY-seal.json'), 'earlier visible seal');
for (const seal of [firstSeal, prekeySeal]) {
  for (const binding of seal.bindings) {
    if (hash(fs.readFileSync(binding.path)) !== binding.sha256) throw new Error(`Changed sealed bytes: ${binding.path}`);
  }
}
const source = read(path.join(root, base, 'n42-review-inputs/source-only.json'), 'first independent source');
const views = read(path.join(out, 'PREKEY-views.json'), 'sealed visible semantic review');
const truths = read(path.join(out, 'PREKEY-truth.json'), 'sealed independent truth');
const comparison = read(path.join(out, 'choice-comparison.json'), 'manual independent author comparison');
const seed = read(path.join(root, base, 'n42-choice-prerequisite-repair-01/seed.json'), 'current seed');
const draft = read(path.join(root, base, 'n42-choice-prerequisite-repair-01/draft.json'), 'choice keys read only after PREKEY');
const preservation = read(path.join(root, base, 'n42-choice-prerequisite-repair-01/preservation-evidence.json'), 'preservation report');
const repairReport = read(path.join(root, base, 'n42-choice-prerequisite-repair-01/report.json'), 'current author report');
const priorReport = read(path.join(root, base, 'n42-choice-author/report.json'), 'authorized prior author history, not prior semantic review');
if (canonical(seed) !== canonical(source.seed)) throw new Error('Seed differs from source-only');
const receiptChecks = [];
for (const question of draft.questions) {
  const view = views.question_reviews.find(v => v.question_id === question.id);
  const math = truths.question_reviews.find(v => v.question_id === question.id);
  const snapshot = JSON.parse(fs.readFileSync(path.join(out, 'PREKEY-visible-snapshot.json'))).questions.find(v => v.id === question.id);
  const authorAgree = canonical([...question.key.correct].sort()) === canonical([...math.mathematics.correct].sort());
  const truthAgree = question.key.rationales.every(r => math.mathematics.option_checks.find(o => o.option_id === r.option_id)?.truth === r.truth);
  if (!view || !snapshot || canonical(snapshot.view) !== canonical(question.view) || !authorAgree || !truthAgree) throw new Error(`Post-PREKEY discrepancy: ${question.id}`);
  receiptChecks.push({ question_id: question.id, view_canonical_sha256: hash(canonical(question.view)), independent_author_set_agreement: authorAgree, every_option_truth_agreement: truthAgree });
}
const preservationChecks = preservation.original_question_canonical_sha256.map(entry => ({
  id: entry.id,
  expected_sha256: entry.sha256,
  actual_sha256: hash(canonical(draft.questions.find(q => q.id === entry.id))),
}));
const historicalHolds = repairReport.prior_hold_snapshots.map(entry => ({
  source_number: entry.original_record.source_number,
  retained_record: entry.original_record,
  equals_prior_author_coverage: canonical(entry.original_record) === canonical(priorReport.coverage.find(c => c.source_number === entry.original_record.source_number)),
}));
if (preservationChecks.some(c => c.expected_sha256 !== c.actual_sha256) || historicalHolds.some(c => !c.equals_prior_author_coverage)) throw new Error('Preservation discrepancy');
for (const entry of preservation.original_files) {
  const actual = hash(fs.readFileSync(entry.path));
  bindings.push({ path: entry.path, sha256: actual, role: 'preserved original author bytes; no prior review/test output' });
  if (entry.sha256 !== actual) throw new Error('Historical author byte discrepancy');
}
const review = {
  schema: 's10y-choice-review-v1',
  seed_sha256: hash(canonical(seed)),
  draft_sha256: hash(canonical(draft)),
  reviewer: { kind: 'independent_agent', identity: 'Codex sole independent reviewer STEMROBIN-188/SAME188-6 N42; separate from authors' },
  source_reviews: comparison.source_reviews,
  figure_checks: [{
    figure_id: 'fig-g10-01',
    asset_path: seed.figures[0].assets[0].path,
    asset_sha256: seed.figures[0].assets[0].sha256,
    observation: 'Actually opened original crop once and current complete SVG rendered with installed resvg at480x400 once. All three shared-origin i lower-left, j right and k up rays, endpoint arrowheads and separate vector accents are visible, including bottommost i and rightmost j. Ordered orthonormal status is supplied by prose, not perspective angles. Opened PNG hash c9b4a0b557e52e4230194aecc525ad9d5fe170ecad978d06da6134d0bf710bfa; no answer text. This is source-choice observation, not renewed formal figure approval.',
  }],
  new_figure_reviews: [],
  question_reviews: draft.questions.map(q => ({
    ...views.question_reviews.find(v => v.question_id === q.id),
    ...truths.question_reviews.find(v => v.question_id === q.id),
  })),
  outcome: comparison.status,
};
const write = (name, value) => fs.writeFileSync(path.join(out, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
write('review.json', review);
write('choice-comparison-receipt.json', {
  schema: 'n42-choice-comparison-receipt-v1',
  recorded_at: new Date().toISOString(),
  first_seal_sha256: hash(fs.readFileSync(path.join(out, 'FIRST-seal.json'))),
  prekey_seal_sha256: hash(fs.readFileSync(path.join(out, 'PREKEY-seal.json'))),
  author_choice_keys_read_after_both_seals: true,
  answer_candidate_not_read_yet: true,
  bindings,
  receiptChecks,
  preservationChecks,
  historicalHolds,
  prior_author_holds_retained_as_history: priorReport.holds,
  review_sha256: hash(fs.readFileSync(path.join(out, 'review.json'))),
  structural_validator_run: false,
  parent_reviewed_checker_pending: true,
});
console.log(JSON.stringify({ outcome: review.outcome, review_sha256: hash(fs.readFileSync(path.join(out, 'review.json'))), seed_sha256: review.seed_sha256, draft_sha256: review.draft_sha256, questions: review.question_reviews.length, options: truths.counts.options, preservationChecks, historical_holds_preserved: historicalHolds.length }, null, 2));

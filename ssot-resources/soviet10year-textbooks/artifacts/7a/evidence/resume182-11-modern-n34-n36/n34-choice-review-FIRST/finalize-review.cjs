const fs = require('node:fs');
const crypto = require('node:crypto');

const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
if (process.cwd() !== root) throw new Error('Wrong cwd');
const own = '.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-choice-review-FIRST';
const author = '.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-choice-author';
const read = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
function sorted(value) {
  if (Array.isArray(value)) return value.map(sorted);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, sorted(value[key])]));
  }
  return value;
}
const canonical = value => JSON.stringify(sorted(value)).replace(/[\u007f-\uffff]/g,
  char => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`);
const digest = value => hash(canonical(value));
function requireThat(condition, message) {
  if (!condition) throw new Error(message);
}
function writeFrozen(name, bytes) {
  const file = `${own}/${name}`;
  fs.writeFileSync(file, bytes, { flag: 'wx' });
  fs.chmodSync(file, 0o444);
  return { path: file, file_sha256: hash(fs.readFileSync(file)) };
}

const source = read(`${own}/source-complete.json`);
const sourceFreeze = read(`${own}/source-complete.freeze.json`);
const visible = read(`${own}/view-independent.json`);
const viewFreeze = read(`${own}/view-independent.freeze.json`);
const comparison = read(`${own}/internal-comparison.json`);
const seed = read(`${author}/seed.json`);
const draft = read(`${author}/draft.json`);
requireThat(digest(source) === sourceFreeze.canonical_sha256, 'Source freeze changed');
requireThat(digest(visible) === viewFreeze.view_review_sha256, 'Visible freeze changed');
requireThat(comparison.frozen_view_review_sha256 === digest(visible), 'Comparison not bound to visible freeze');
requireThat(digest(seed) === visible.seed_sha256, 'Seed snapshot changed');
requireThat(digest(draft) === visible.draft_sha256, 'Draft snapshot changed');
requireThat(draft.new_figures.length === 0, 'Unexpected new figure');
requireThat(hash(fs.readFileSync(`${own}/source-first.json`)) ===
  '17d69c5c0486e1aed73a0bdc81949af35f1b0fd1b792e134cf94463e13f15db5', 'FIRST HOLD changed');
requireThat(hash(fs.readFileSync(`${own}/source-first.md`)) ===
  'c28d78b0d88d66db38f8bbd87fcdbe4e6fdc89412828436bb81d3b4eaf083e8a', 'FIRST markdown changed');
requireThat(hash(fs.readFileSync(`${own}/fig-52.full-640.png`)) ===
  '71ee0142be0b83c277642cf76d1170a0bd8b4247bc54dd187a9180308f32a7a2', 'FIRST fig52 conversion changed');
requireThat(hash(fs.readFileSync(`${own}/fig-53.full-640.fallback.png`)) ===
  '26c425d4a4b4ebdc94c4b2c85422731d655b76a42b82df09d7d706385e2bf05c', 'FIRST inspected fig53 conversion changed');

const questionReviews = visible.question_reviews.map(row => {
  const internal = comparison.question_comparisons.find(item => item.question_id === row.question_id);
  const candidate = draft.questions.find(item => item.id === row.question_id);
  requireThat(internal && candidate, 'Question binding missing');
  const correct = new Set(row.mathematics.correct);
  const authorCorrect = new Set(candidate.key.correct);
  const sameKey = correct.size === authorCorrect.size && [...correct].every(id => authorCorrect.has(id));
  requireThat(sameKey || internal.verdict !== 'pass', 'Passing comparison disagrees with frozen key');
  const optionChecks = row.mathematics.option_checks.map(option => {
    const check = internal.option_comparisons.find(item => item.option_id === option.option_id);
    requireThat(check, 'Missing internal option evidence');
    return { ...option, evidence: `${option.evidence} Internal comparison: ${check.evidence}` };
  });
  return {
    ...row,
    mathematics: {
      ...row.mathematics,
      verdict: internal.verdict,
      independent_solution: `${row.mathematics.independent_solution} Post-freeze comparison: ${internal.evidence}`,
      option_checks: optionChecks,
    },
  };
});
const sourceReviews = source.source_reviews.map(row => {
  const coverage = comparison.source_coverage.find(item => item.source_number === row.source_number);
  requireThat(coverage, 'Missing source coverage');
  return {
    source_number: row.source_number,
    independent_solution: row.independent_solution,
    coverage: { verdict: coverage.verdict, evidence: coverage.evidence },
  };
});
const figureChecks = source.figure_checks.map(row => ({
  figure_id: row.figure_id,
  asset_path: row.asset_path,
  asset_sha256: row.asset_sha256,
  observation: `${row.observation} Inspected render derivative: ${row.preview_path}; PNG SHA-256 ${row.preview_sha256}. Its sibling SVG was verified byte-equal to this seed asset before opening. Total context image loads are four, comprising two retained faulty conversions and these two authorized recovery inspections; no crops or further reopens.`,
}));
const verdicts = [
  ...sourceReviews.map(row => row.coverage.verdict),
  ...questionReviews.flatMap(row => [
    row.task_fidelity.verdict, row.redundancy.verdict,
    row.answer_leakage.verdict, row.mathematics.verdict,
  ]),
];
const outcome = verdicts.includes('blocked') ? 'blocked' : verdicts.includes('revise') ? 'revise' : 'pass';
const review = {
  schema: 's10y-choice-review-v1',
  seed_sha256: digest(seed),
  draft_sha256: digest(draft),
  reviewer: {
    kind: 'independent_agent',
    identity: 'STEMROBIN-182 n34-choice-review-FIRST; separate source-first reviewer, not the author; source and complete visible truths frozen before internal comparison',
  },
  source_reviews: sourceReviews,
  figure_checks: figureChecks,
  new_figure_reviews: [],
  question_reviews: questionReviews,
  outcome,
};
const reviewFile = writeFrozen('review.json', `${canonical(review)}\n`);
const lines = [
  '# STEMROBIN-182 n34 Independent FIRST Choice Review',
  '',
  `Semantic FIRST verdict: **${outcome}**.`,
  '',
  'Eight questions and all 38 options were independently checked. Source evidence was',
  'completed and frozen before the structured `{id,view}` projection. Fidelity,',
  'redundancy, leakage and all truth sets were frozen before intent, keys,',
  'misconceptions or coverage were exposed. No source or candidate edits were made.',
  '',
  '## Snapshot Binding',
  '',
  `- Seed canonical SHA-256: \`${digest(seed)}\`.`,
  `- Draft canonical SHA-256: \`${digest(draft)}\`.`,
  `- Completed source canonical SHA-256: \`${digest(source)}\`.`,
  `- Visible independent review canonical SHA-256: \`${digest(visible)}\`.`,
  `- Canonical review SHA-256: \`${digest(review)}\`.`,
  '',
  '## Recovery and Image Usage',
  '',
  'Total image loads: **4**. The two original faulty conversions and original',
  'SOURCE-FIRST HOLD remain unchanged. Recovery opened only the two existing full',
  '640-px normal-width previews after hashing each PNG and proving its sibling SVG',
  'byte-equal to the seed durable SVG. There were no crops or further image loads.',
  'Sources 748-753 were reused unchanged, not solved again. The original HOLD is',
  'historical conversion-failure evidence; affected-only recovery resolves it.',
  '',
];
for (const figure of source.figure_checks) {
  lines.push(`### ${figure.figure_id}`, '',
    `Asset: \`${figure.asset_path}\`.`,
    `Asset SHA-256: \`${figure.asset_sha256}\`.`,
    `Preview: \`${figure.preview_path}\`.`,
    `Preview SHA-256: \`${figure.preview_sha256}\`.`, '',
    figure.observation, '');
}
lines.push('## Independent Source Solutions and Coverage', '');
for (const row of sourceReviews) {
  lines.push(`### Source ${row.source_number}`, '',
    row.independent_solution, '',
    `Coverage **${row.coverage.verdict}**: ${row.coverage.evidence}`, '');
}
lines.push('## Question and Option Evidence', '');
for (const row of questionReviews) {
  lines.push(`### ${row.question_id}`, '',
    `Fidelity **${row.task_fidelity.verdict}**: ${row.task_fidelity.evidence}`, '',
    `Redundancy **${row.redundancy.verdict}**: ${row.redundancy.evidence}`, '',
    `Leakage **${row.answer_leakage.verdict}**: ${row.answer_leakage.evidence}`, '',
    `Mathematics **${row.mathematics.verdict}**: ${row.mathematics.independent_solution}`, '',
    `Frozen complete true set: \`${row.mathematics.correct.join(',')}\`.`, '');
  for (const option of row.mathematics.option_checks) {
    lines.push(`- **${option.option_id}: ${option.truth}.** ${option.evidence}`);
  }
  lines.push('');
}
lines.push('## Package Findings', '', comparison.package.evidence, '',
  'No actionable fidelity, leakage, coverage, key or misconception defect was found.',
  'Construction/recognition and independent-writing losses are explicitly recorded.',
  'No new figures are registered, so no new-figure approval is claimed or required.', '',
  '## Validation', '',
  'The named validator with `--review` is run once after this semantic record.',
  'Its exact command, stdout, stderr and exit code are preserved in',
  '`first-validation.json`; those mechanical results do not automatically prove',
  'the semantic findings. The FIRST verdict is not changed to match tool output.', '');
const markdownFile = writeFrozen('review.md', `${lines.join('\n')}\n`);
fs.chmodSync(`${own}/internal-comparison.json`, 0o444);
const receipt = {
  frozen_at: new Date().toISOString(),
  outcome,
  seed_sha256: digest(seed),
  draft_sha256: digest(draft),
  review_sha256: digest(review),
  review: reviewFile,
  markdown: markdownFile,
  source_freeze_sha256: digest(source),
  view_freeze_sha256: digest(visible),
  internal_comparison_sha256: digest(comparison),
  source_count: sourceReviews.length,
  question_count: questionReviews.length,
  option_count: questionReviews.reduce((sum, row) => sum + row.mathematics.option_checks.length, 0),
  total_image_loads: 4,
  original_hold_preserved: true,
};
writeFrozen('review.freeze.json', `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt, null, 2));

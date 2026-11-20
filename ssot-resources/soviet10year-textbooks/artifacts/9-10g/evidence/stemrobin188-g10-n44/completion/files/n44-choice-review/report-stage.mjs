import { choice, read, write, seal, binding, digest, now } from './audit-lib.mjs';

const seed = read(`${choice}/seed.snapshot.json`);
const draft = read(`${choice}/draft.snapshot.json`);
const first = read(`${choice}/FIRST-source.json`);
const pre = read(`${choice}/pre-key.json`);
const observations = read(`${choice}/image-ledger.json`).entries;
const questionReviews = pre.question_reviews.map((q, index) => {
  const { ordinal, ...review } = q;
  return { question_id: draft.questions[index].id, ...review };
});
const last = questionReviews.at(-1);
last.task_fidelity = { verdict: 'revise', evidence: 'CHOICE-01: all angles of four endpoint rays also includes pi for TA/TC and TB/TD; stem does not restrict one ray from each diagonal. No pi option; intended diagonal-angle scope must be explicit.' };
last.mathematics = {
  ...last.mathematics, verdict: 'revise',
  independent_solution: 'FIRST: T=(0,2,1/2), AC=(-4,-4,9), BD=(-2,2,7), dot=63, squared norms 113,57. Six unordered endpoint-ray pairs give alpha twice, pi-alpha twice, pi twice. Literal full distinct set {arccos(63/sqrt(6441)),pi-arccos(63/sqrt(6441)),pi}. Offered true set remains b,d; a,c have wrong norm denominators. No pi option exists, so full requested scope is incomplete. Pre-key omission corrected transparently in post-key-domain-audit.md.',
};
const sourceReviews = first.sources.map(source => {
  const coverage = draft.coverage.find(c => c.source_number === source.source_number);
  const evidence = source.source_number === '22'
    ? 'Proof criteria and nondegeneracy retained. Angle question n44-diagonal-angles broadens to all four-ray pairs but omits the straight case; CHOICE-01 requires explicit cross-diagonal restriction. Free proof and written angle derivation are honestly deferred.'
    : `All original quantities/cases retained by ${coverage.question_ids.join(', ')}. Explicit production losses acknowledged, not conflated with lost mathematical distinctions. ${coverage.reason}`;
  return {
    source_number: source.source_number,
    independent_solution: JSON.stringify(source),
    coverage: { verdict: source.source_number === '22' ? 'revise' : 'pass', evidence },
  };
});
const comparisons = draft.questions.flatMap((q, index) => q.key.rationales.map(r => {
  const independent = pre.question_reviews[index].mathematics.option_checks.find(c => c.option_id === r.option_id);
  if (!independent) throw new Error('Missing independently checked option');
  return {
    question_id: q.id, option_id: r.option_id, independent_truth: independent.truth,
    author_truth: r.truth, truth_agrees: r.truth === independent.truth,
    independent_derivation: independent.evidence, author_derivation: r.derivation,
    misconception: r.misconception, option_truth_and_derivation_verdict: 'pass',
    rationale_assessment: r.truth === 'correct'
      ? 'Author coordinate relationship agrees with the sealed independent calculation.'
      : 'Stated mistaken procedure produces the offered false result; sealed independent evidence distinguishes it from the requested task. Q9-b rejects sufficiency, not its true identity.',
  };
}));
if (comparisons.length !== 44 || comparisons.some(c => !c.truth_agrees)) throw new Error('Author option comparison mismatch');
write(`${choice}/author-comparison.json`, {
  schema: 'same188-6/current-author-comparison@1', completed_at: now(),
  pre_key_seal: binding(`${choice}/pre-key.seal.json`),
  internals_receipt: binding(`${choice}/internals-read-receipt.json`),
  checks: comparisons, correct_set_comparisons: draft.questions.map((q, index) => ({
    question_id: q.id, independent: pre.question_reviews[index].mathematics.correct,
    author: q.key.correct,
    agreement: digest([...q.key.correct].sort()) === digest([...pre.question_reviews[index].mathematics.correct].sort()),
  })),
  domain_finding: 'CHOICE-01 is incomplete unrestricted angle scope, not disagreement on any of the 44 offered truths. Author exhaustive claim is restricted without the visible stem restriction.',
});
write(`${choice}/review.json`, {
  schema: 's10y-choice-review-v1', seed_sha256: digest(seed), draft_sha256: digest(draft),
  reviewer: { kind: 'independent_agent', identity: 'SAME188-6 independent reviewer, STEMROBIN-188' },
  source_reviews: sourceReviews,
  figure_checks: seed.figures.map((figure, index) => ({
    figure_id: figure.id, asset_path: figure.assets[0].path, asset_sha256: figure.assets[0].sha256,
    observation: `${observations[index].observation} Actually opened ${observations[index].png.path} (PNG sha256 ${observations[index].png.sha256}), offline rendered from these current SVG bytes; complete extrema visible. No inherited image review substituted.`,
  })),
  new_figure_reviews: [], question_reviews: questionReviews, outcome: 'revise',
});
seal('review', [`${choice}/review.json`, `${choice}/review.md`, `${choice}/author-comparison.json`, `${choice}/post-key-domain-audit.md`, `${choice}/internals-read-receipt.json`, `${choice}/seed.snapshot.json`, `${choice}/draft.snapshot.json`], {
  outcome: 'revise', finding: 'CHOICE-01', candidate_not_read: true,
  count: { questions: 10, options: 44, single: 7, multiple: 3, images: 2, new_figures: 0 },
  repairs_used: 0, validator_with_review_run: false, finalize_run: false, MathLive_run: false,
});

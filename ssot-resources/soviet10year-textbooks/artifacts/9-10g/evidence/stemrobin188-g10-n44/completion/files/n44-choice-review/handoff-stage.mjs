import fs from 'node:fs';
import { absolute, choice, answer, seedPath, draftPath, read, write, binding, sha, now } from './audit-lib.mjs';

const sealPaths = [
  `${choice}/FIRST-source.seal.json`, `${choice}/pre-key.seal.json`,
  `${choice}/review.seal.json`, `${answer}/answer-review.seal.json`,
];
for (const name of sealPaths) {
  for (const file of read(name).files) {
    if (sha(fs.readFileSync(file.path)) !== file.sha256) throw new Error(`Sealed evidence changed: ${file.path}`);
  }
}
const firstSeal = read(sealPaths[0]);
const viewReceipt = read(`${choice}/views-read-receipt.json`);
const preSeal = read(sealPaths[1]);
const internalReceipt = read(`${choice}/internals-read-receipt.json`);
const reviewSeal = read(sealPaths[2]);
const candidateReceipt = read(`${answer}/candidate-read-receipt.json`);
const answerSeal = read(sealPaths[3]);
const chronology = [
  { event: 'FIRST_SOURCE_SEALED', at: firstSeal.sealed_at, evidence: binding(sealPaths[0]) },
  { event: 'ONLY_QUESTIONS_VIEW_CAPTURED', at: viewReceipt.captured_at, evidence: binding(`${choice}/views-read-receipt.json`) },
  { event: 'PRE_KEY_FIDELITY_AND_ALL_44_TRUTHS_SEALED', at: preSeal.sealed_at, evidence: binding(sealPaths[1]) },
  { event: 'CURRENT_DRAFT_INTERNALS_OPENED', at: internalReceipt.opened_at, evidence: binding(`${choice}/internals-read-receipt.json`) },
  { event: 'CHOICE_REVIEW_REVISE_PERSISTED', at: reviewSeal.sealed_at, evidence: binding(sealPaths[2]) },
  { event: 'NEW_STANDARD_CANDIDATE_OPENED', at: candidateReceipt.opened_at, evidence: binding(`${answer}/candidate-read-receipt.json`) },
  { event: 'ANSWER_SEMANTIC_PASS_REPORT_SEALED', at: answerSeal.sealed_at, evidence: binding(sealPaths[3]) },
];
if (!chronology.every((event, index) => !index || Date.parse(event.at) > Date.parse(chronology[index - 1].at))) {
  throw new Error('Chronology ordering failure');
}
const files = [
  `${choice}/FIRST-source.md`, `${choice}/FIRST-source.json`, ...sealPaths,
  `${choice}/pre-key.md`, `${choice}/pre-key.json`,
  `${choice}/review.md`, `${choice}/review.json`,
  `${choice}/post-key-domain-audit.md`, `${choice}/author-comparison.json`,
  `${choice}/views-only.json`, `${choice}/views-read-receipt.json`,
  `${choice}/internals-read-receipt.json`, `${choice}/source-projection.json`,
  `${choice}/image-ledger.json`, `${choice}/preview-bindings.json`,
  `${answer}/answer-review.md`, `${answer}/answer-review.json`,
  `${answer}/candidate-read-receipt.json`, `${answer}/candidate.raw.json`,
];
const preview = read(`${choice}/preview-bindings.json`);
const metadata = read('ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c2-s1-n44/figures.json');
const review = read(`${choice}/review.json`);
const answerReview = read(`${answer}/answer-review.json`);
write(`${choice}/handoff.json`, {
  schema: 'same188-6/ordered-n44-independent-review-handoff@1',
  ticket: 'STEMROBIN-188', reviewer_run: 'SAME188-6', created_at: now(),
  workdir: absolute('.'), owned_output_directories: [absolute(choice), absolute(answer)],
  role: 'Only independent reviewer; no authors/prior reviewers contacted or reopened.',
  outcomes: { choices: 'REVISE', standard_answers: 'SEMANTIC_PASS', MathLive_exact_edit: 'PENDING_PARENT', finalize: 'PENDING_PARENT' },
  findings: [{
    id: 'CHOICE-01', kind: 'essential_finite_case_scope', unit: 'n44-diagonal-angles',
    verdict: 'REVISE',
    evidence: 'Four endpoint rays have six unordered pairs; same-diagonal pairs make pi. Literal all-angle set has alpha,pi-alpha,pi, but no pi option. All 44 offered option truth checks otherwise agree.',
    smallest_repair: 'Explicitly require one ray from each diagonal (or non-straight cross-diagonal angles), and align the exhaustive internal claim. No new figure or option count change needed.',
    repair_owner: 'parent later', repair_allowance_per_affected_unit: 1, repairs_used: 0,
  }],
  answer_findings: [],
  reports: files.map(binding),
  input_bytes_and_canonical_digests: {
    seed: binding(seedPath), seed_snapshot: binding(`${choice}/seed.snapshot.json`),
    draft: binding(draftPath), draft_snapshot: binding(`${choice}/draft.snapshot.json`),
    candidate: candidateReceipt.candidate, requested_candidate_raw_sha256: candidateReceipt.expected_sha256,
    candidate_snapshot: binding(`${answer}/candidate.raw.json`),
    canonical_contract: 'SHA-256 of Python-equivalent json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(\",\", \":\")), UTF-8. These JSON snapshots use strings, booleans, nulls, integers and ordinary 0.01 numeric tolerance.',
    review_seed_canonical_sha256: review.seed_sha256, review_draft_canonical_sha256: review.draft_sha256,
  },
  source_input_bindings: read(`${choice}/FIRST-source.json`).permitted_input_bindings,
  figures: {
    actual_viewed_source_svg_and_png_bindings: preview.records,
    declared_original_assets_not_opened: metadata.figures.filter(f => ['fig-g10-06', 'fig-g10-07'].includes(f.id)).map(f => ({
      figure_id: f.id, source: f.source, spec: f.spec,
      original_png_opened: false, original_svg_opened: false, spec_opened: false,
      declared_hashes_are_manifest_metadata_not_reviewer_byte_hashes: true,
    })),
    ledger: binding(`${choice}/image-ledger.json`),
    actual_image_loads: 2, batches: 1, largest_batch: 2, context_loads: 2,
    limits: { batch: 8, context: 24 }, reopens: 0, crops: 0, inherited_image_payloads: 0, new_figures: 0,
    image_timestamp_semantics: 'Ledger opened_at is observation-recording time, not an instrumented tool-open timestamp. Actual view_image loads occurred after each SVG preview render and before FIRST seal; no exact tool timestamp is claimed.',
  },
  chronology, ordered_gate_disclosure_and_persistence_confirmed: true,
  independence_and_disclosures: {
    source_solve_count: 7, independent_solve_count_per_source: 1, candidate_induced_resolves: 0,
    author_FIRST_private_keys_prior_choices_old_answers_core_key_history_read: false,
    initial_projection_overread: 'Initial source lesson.prose projection mistakenly exposed its current worked-example paragraphs beyond approved definitions; disclosed in FIRST. No author/key/history exposure; not used as independent evidence.',
    pre_key_correction: 'Sealed pre-key review overlooked pi by implicitly considering cross-diagonal pairs. Preserved unchanged; post-key-domain-audit records the independently justified visible-stem correction.',
    author_option_comparison: 'All 44 offered truths and derivations agree; scope finding not waived.',
  },
  counts: { choice_questions: 10, option_truth_checks: 44, single: 7, multiple: 3, ...answerReview.counts },
  retained_inherited_gates: 'Source/authors/figures/text/surface passed evidence remains inherited, not rerun or repaired. Figure8 author note not a reviewer image-open claim.',
  pending_parent: [
    'Repair only CHOICE-01 affected choice unit within one content-repair allowance, then obtain review of that changed snapshot.',
    'Real MathLive keyboard edit/delete/input-event and resserialization gate for all 3 exact parts; 0 reviewer attempts, no unrun MathLive PASS claim.',
    'Parent-only validator-with-review/finalize once after applicable PASS; none run by this reviewer.',
  ],
  repairs_used: { choices: 0, answers: 0 },
  actions_not_run: ['setup', 'freshness workflow', 'Grill', 'backend', 'DB', 'env reads', 'install', 'network/paid service calls', 'Git', 'publish', 'deploy', 'closure', 'contact', 'core edits', 'content producers', 'MathLive gate', 'validator with review', 'finalize'],
});
fs.rmSync(absolute(`${choice}/previews/browser-profile`), { recursive: true, force: true });
console.log(JSON.stringify({
  handoff: binding(`${choice}/handoff.json`),
  choice_review: binding(`${choice}/review.json`),
  answer_review: binding(`${answer}/answer-review.json`),
  candidate: candidateReceipt.candidate,
  seed: binding(`${choice}/seed.snapshot.json`),
  draft: binding(`${choice}/draft.snapshot.json`),
  chronological_events: chronology.map(e => ({ event: e.event, at: e.at })),
  outcome: { choice: 'REVISE', answer: 'SEMANTIC_PASS', parent_gates: 'PENDING' },
}, null, 2));

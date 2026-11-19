const fs = require("node:fs");
const crypto = require("node:crypto");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const file = ".intentfold/tickets/STEMROBIN-182/usage.json";
const usage = JSON.parse(fs.readFileSync(file, "utf8"));
usage.recorded_at = new Date().toISOString();
Object.assign(usage.resume182_13, {
  n39_choice_canonical_FIRST_outcome: "revise-internal-reference-only",
  n39_choice_canonical_FIRST_validator_exit: 3,
  n39_choice_canonical_FIRST_review_sha256: hash(`${base}/n39-choice-review/review.json`),
  n39_choice_reference_affected_draft_sha256: hash(`${base}/n39-choice-reference-affected/draft.json`),
  n39_choice_reference_affected_questions: ["q19", "q20"],
  n39_choice_reference_scope: "two duplicated supplementary sum/root strings only; views/keys/rationales/coverage unchanged",
  n39_choice_canonical_status: "reference-only-affected-review-active",
  n44_normalized_binding_status: "independent-PASS-status-only-change",
  n44_normalized_binding_sha256: hash(`${base}/n44-modern-review/output-binding/report.json`),
  n44_raw_and_modern_promoted: true,
  n44_promotion_exit: 0,
  n44_choice_author_agent: "01a1f27b-4124-7cd2-ac43-19d0ba2f5fb4",
  n44_choice_author_status: "source-first-independent-author-active",
  n44_original_root_source_capture_images: 1,
  n44_original_root_source_capture_sha256: hash(`${base}/n44-original-root-capture/capture.json`),
  n44_original_root_printed_cells: { 17: "4.123", 21: "4.583", 27: "5.196", 73: "8.544" },
  n44_original_root_printed_tie_rule_found: false,
  n44_answer_source_status: "source-first-active-same-book-four-cells-available-before-key-disclosure",
  n45_author_status: "RAW19-originals-modern44-subparts86-formulas-candidate-frozen-closed",
  n45_modern_figure_author_agent: "01a1f280-9b2d-7ef1-9424-a6e0eefb8589",
  n45_modern_figure_author_status: "three-deterministic-figures-active-no-paid-call",
  next_source275_282_prepare_exits: [0, 0],
  next_source275_282_status: "prepared-only",
  source274_counter_diagnosis_status: "both21-scratch2-line-join20-exact-bands-genuine-product-two-rows-preserved",
  source274_counter_candidate_sha256: "83782b51e116d57b3050aabf1fc97daa3ded98637fb36bfcb845b6529eaa79c4",
  source274_counter_review_agent: "01a1f27e-8246-7142-ad0c-4c49ac684c57",
  source274_counter_review_status: "independent-affected-only-active-no-passed71-tests-repeated",
  source274_erratum: "p0274-math-1-registered-source-expression-literally-unchanged-independent-review-active",
  source274_affected_source_status: "MD-exponent-and-metadata-only-review-active-finalize-pending",
  current_continuation_new_commit: null,
  cost: "unknown", host_tokens: "unknown", active_time: "unknown",
});
fs.writeFileSync(file, `${JSON.stringify(usage, null, 2)}\n`);
console.log(JSON.stringify({ recordedAt: usage.recorded_at, updated: "resume182_13" }));

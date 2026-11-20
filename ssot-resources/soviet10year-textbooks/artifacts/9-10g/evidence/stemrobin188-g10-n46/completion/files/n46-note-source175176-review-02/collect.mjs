import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const root = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
assert.equal(process.cwd(), root);
const out = path.join(root, ".intentfold/tickets/STEMROBIN-188/tmp/n46-note-source175176-review-02");
const read = name => JSON.parse(fs.readFileSync(path.join(out, name), "utf8"));
const sha = p => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const bind = name => ({ path: path.join(out, name), raw_sha256: sha(path.join(out, name)) });
const answer = read("answer-review.json");
const source = read("source-review.json");
const delta = read("answer-delta.json");
const after = read("bindings-after.json");
const ledger = read("image-ledger.json");
const pixels = read("crop-pixels-native.json");
const comparison = read("source-comparison.json");
const verificationFailures = [];
const verifyBindings = value => {
  if (!value || typeof value !== "object") return;
  if (value.path && value.raw_sha256) {
    const actual = sha(value.path);
    if (actual !== value.raw_sha256) verificationFailures.push({ path: value.path, expected: value.raw_sha256, actual });
  }
  for (const child of Object.values(value)) verifyBindings(child);
};
verifyBindings(answer);
verifyBindings(source);
assert.deepEqual(verificationFailures, []);
assert.equal(answer.status, "pass");
assert.equal(source.status, "hold");
assert.equal(source.readableScopedStatus, "pass");
assert.equal(delta.exact_single_field, true);
assert.equal(delta.exact_phrase_replacement, true);
assert.equal(delta.whole_object_restored_equals_before, true);
assert.equal(after.identical_to_before, true);
assert.deepEqual(after.failures, []);
assert.equal(after.counts.repair117.matched, 117);
assert.equal(after.counts.source16.matched, 16);
assert.equal(after.counts.direct.matched, 4);
assert.equal(ledger.actual_total, ledger.events.length);
assert.equal(ledger.actual_total, 6);
assert.ok(ledger.actual_total <= ledger.hard_total);
assert.equal(ledger.answer_image_loads, 0);
assert.equal(pixels.status, "pass");
assert.ok(pixels.results.every(r => r.array_equal && r.interior_array_equal && r.mismatched_pixels === 0));
assert.ok(comparison.pages.every(p => p.blocks_equal && p.metadata_equal && p.row_counts_agree && p.figures_agree));

const report = {
  schema: "same188-6/independent-bounded-report@1",
  ticket: "STEMROBIN-188",
  assignment: "SAME188-6",
  date: "2026-11-20",
  reviewer: { role: "sole independent reviewer", previous_Descartes_session: "User states collected/closed; not reopened or messaged" },
  status: "review_complete_for_collection__source_local_and_boundary_holds_retained",
  scopeA: {
    kind: "N46 notes-only affected repair",
    status: answer.status,
    answer_review: bind("answer-review.json"),
    candidate_binding: answer.candidate_binding,
    exact_change: { pointer: "/answers/2/notes", from: answer.affected_wording.from, to: answer.affected_wording.to },
    whole_object_single_field_delta: true,
    inherited_mathematics: { status: "pass", answers: 6, fresh_solutions: 0 },
    inherited_display: { status: "pass", unchanged_displayAnswer_fields: 6 },
    affected_notes_readiness: "pass",
    grading: { answers: 6, auto: 0, ungraded: 6, parts: 0 },
    center_role_O_unchanged: true,
    historical_O_or_0: "UNKNOWN retained",
    literal_source_z_0_unchanged: true,
    prior_REVISE_and_HOLD_receipts_preserved: true,
    answer_image_loads: 0,
    mathematical_recomputations: 0,
    full_Gate2_rerun: false
  },
  scopeB: {
    kind: "FIRST source175/176 and four exact native crops",
    status: source.status,
    readableScopedStatus: source.readableScopedStatus,
    source_review: bind("source-review.json"),
    input_manifest: source.inputManifestBinding,
    first_observations: [bind("FIRST-0175.md"), bind("FIRST-0176.md")],
    original_pixels_before_candidate_or_author_text: true,
    source_comparison: bind("source-comparison.json"),
    printed_rows: { physical175_printed168: 18, physical176_printed169: 15 },
    native_crop_pixels: { status: "pass", crops: 4, existing_white_padding_px: 12, differing_pixels: 0, differing_channels: 0, evidence: bind("crop-pixels-native.json") },
    preserved_initial_failure: bind("crop-pixels.json"),
    recovery_receipt: bind("pixel-check-failure.json"),
    local_holds: source.holds,
    predecessor174_text_metadata_only: true,
    predecessor174_pixel_loads: 0,
    whole_predecessor174_approval_inferred: false,
    page177_or_TOC_read: false,
    N48_completion_inferred: false,
    N49_completion_inferred: false,
    wholepage_or_all_ink_approval: false,
    modern_or_whole_lesson_approval: false
  },
  integrity: {
    repair_manifest117: { before: 117, after: 117, total: 117 },
    source_manifest16: { before: 16, after: 16, total: 16 },
    direct_bindings4: { before: 4, after: 4, total: 4 },
    before_after_identical: true,
    snapshots: [bind("bindings-before.json"), bind("bindings-after.json")],
    readonly_preflight_binding_passes: 1,
    formal_before_after_snapshot_passes: 2,
    binding_failures: [],
    report_reference_hash_failures: [],
    candidate_core_input_shared_files_written_by_reviewer: 0,
    original_candidate_native_author_files_unchanged: true,
    output_write_boundary: out,
    all_exec_cwds: root
  },
  actual_image_ledger: bind("image-ledger.json"),
  actual_counters: {
    planned_context_images: 6,
    hard_context_image_total: 8,
    actual_context_images: 6,
    original_page_image_loads: 2,
    exact_native_crop_image_loads: 4,
    reopens: 0,
    answer_image_loads: 0,
    other_image_loads: 0,
    image_call_failures: 0,
    pixel_comparison_attempts: 2,
    initial_failed_pixel_contract_checks: 1,
    recovered_failed_stage_checks: 1,
    nonvisual_original_file_decodes: 4,
    nonvisual_native_file_decodes: 8,
    pixel_check_image_payloads_or_files: 0,
    source_candidate_comparisons: 2,
    source_or_answer_recomputations: 0,
    reviewer_content_revisions: 0,
    native_finalize: 0,
    prepare: 0,
    assemble: 0,
    modern_adapt: 0,
    render: 0,
    choice_seed_or_answer_producer_refresh: 0,
    passed_pipeline_stage_reruns: 0,
    database_calls: 0,
    paid_calls: 0,
    model_service_calls: 0,
    network_or_backend_calls: 0,
    credentials_reads_or_writes: 0,
    dependency_or_install_changes: 0,
    setup_or_freshness_calls: 0,
    git_commits: 0,
    peer_messages: 0,
    other_in_flight_agents_read: 0
  },
  human_or_parent_approval: false,
  publication_or_source_promotion: false,
  report_markdown: bind("report.md"),
  output_index_path: path.join(out, "output-index.json"),
  next_action: "STOP for collection/closure; no further source/native repair or review stage authorized.",
  returned_payload: "Text paths and raw SHA-256 only; no images or image-bearing history"
};
fs.writeFileSync(path.join(out, "independent_report.json"), JSON.stringify(report, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({
  artifact_integrity: "pass",
  answer_review: bind("answer-review.json"),
  source_review: bind("source-review.json"),
  independent_report: bind("independent_report.json"),
  report_markdown: bind("report.md")
}, null, 2));

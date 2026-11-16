import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const tmp = '.intentfold/tickets/STEMROBIN-181/tmp';
const proof = `${tmp}/source-review-9p-0204-0207-correction-proof`;
async function bind(relative, expected) {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(path.join(root, relative))) hash.update(chunk);
  const sha256 = hash.digest('hex');
  if (expected) assert.equal(sha256, expected, `Binding changed: ${relative}`);
  return { path: relative, sha256 };
}
const json = async relative => JSON.parse(await readFile(path.join(root, relative), 'utf8'));
const deltaBinding = await bind(`${proof}/delta-proof.json`,
  '641aa52f9b40fbe397bf6a644ffae8d39b4d9420e029f0965cb156ec89230228');
const delta = await json(deltaBinding.path);
assert.equal(delta.status, 'pass');
assert.equal(delta.native_structure.invocations, 1);
assert.equal(delta.limits.counting_reruns, 0);
// Recheck compressed file bytes and text bindings only; never repeat native parsing or image loads.
for (const binding of delta.verified_files) await bind(binding.path, binding.sha256);
const review = await json(delta.original_partial_gate.path);
const correction = await json(delta.correction_freeze.path);
const cropBinding = await bind(`${proof}/crop160-review.json`);
const crop = await json(cropBinding.path);
const original160 = review.figures.find(figure => figure.id === 'fig-160');
assert.deepEqual(crop.candidate, original160.candidate);
assert.equal(crop.original_review.sha256, delta.original_partial_gate.sha256);
assert.equal(crop.original_author_freeze_sha256, delta.original_author_freeze.sha256);
assert.equal(crop.correction_freeze_sha256, delta.correction_freeze.sha256);
assert.equal(crop.binding.source_ref, original160.binding.source_ref);
assert.equal(crop.binding.caption_ref, original160.binding.caption_ref);
assert.equal(crop.binding.owner, original160.binding.owner);
assert.equal(crop.binding.owner_object, original160.binding.owner_object);
assert.deepEqual(crop.binding.frozen_exact_extraction_box_xywh,
  original160.binding.frozen_exact_extraction_box_xywh);
assert.equal(crop.observation.actual_candidate_opens, 1);
assert.equal(crop.observation.reopens, 0);
assert.ok(original160.neighbor_exclusions_for_fresh_crop_reviewer.includes(
  crop.leakage.original_reviewer_exclusion));
assert.equal(crop.inventory_comparison.length, original160.source_inventory.objects.length);
assert.deepEqual(crop.inventory_comparison.map(item => item.id),
  original160.source_inventory.objects.map(item => item.id));
const conditions = [
  { id: 'original-review-and-author-freeze-exact-bindings', pass: true },
  { id: 'correction-freeze-exact-binding', pass: true },
  { id: '204-206-only-exact-authorized-counting-additions', pass: true },
  { id: 'byte-reversal-and-source-body-math-block-flags-rough-boxes-preserved', pass: true },
  { id: '205-207-unchanged-and-original-frozen-drafts-untouched', pass: true },
  { id: 'original-reviewer-native17-24-probes-reused-with-no-counter-rerun', pass: true },
  { id: '156-159-original-reviewer-approval-retained-with-no-reopen', pass: true },
  { id: '160-source-caption-owner-and-exact-extraction-bindings', pass: true },
  { id: '160-actual-candidate-opened-exactly-once', pass: true },
  { id: '160-all-inventoried-objects-d-x-l-complete',
    pass: crop.completeness_status === 'pass' },
  { id: '160-caption-and-neighbor-prose-excluded',
    pass: crop.leakage.text_leakage_status === 'pass' },
  { id: '160-original-reviewer-scanning-speck-exclusion-met',
    pass: crop.leakage.scan_speck_exclusion_status === 'pass' },
];
const passed = conditions.every(condition => condition.pass);
assert.equal(crop.status, passed ? 'pass' : 'needs-correction');
assert.equal(crop.blockers.length, passed ? 0 : 1);
const self = await bind(path.relative(root, fileURLToPath(import.meta.url)));
const report = {
  schema: 'STEMROBIN-181/source-review@1',
  ticket: 'STEMROBIN-181', book: '9p', batch: 'D021-source-preparation',
  role: 'unique-independent-affected-only-SOURCE-review',
  date: '2026-11-16', workspace: root,
  status: passed ? 'pass' : 'needs-correction',
  completion: 'affected-only-review-complete-combined-gate-not-passed',
  scope: {
    pdf_pages: [204, 205, 206, 207], printed_pages: [195, 196, 197, 198],
    newly_reviewed_metadata_deltas: [204, 206],
    newly_reviewed_actual_candidate_crops: ['fig-160'],
    source_text_review: 'reuse-bound-original-independent-approval-only',
    inherited_actual_candidate_crop_approvals: ['fig-156', 'fig-157', 'fig-158', 'fig-159'],
    image_inventory_authority: 'original-independent-reviewer-whole-page207-inventory',
    no_new_SOURCE_text_or_SCI_approval: true,
    output_path: `${tmp}/source-review-9p-0204-0207-correction.json`,
    helper_directory: proof,
  },
  original_partial_gate: delta.original_partial_gate,
  original_author_freeze: {
    ...delta.original_author_freeze,
    preserved: delta.preserved_author_freeze,
    ordered_text_manifest_sha256: delta.ordered_text_manifest_binding,
    file_sha_and_ordered_manifest_sha_are_distinct: true,
    original_record_untouched: true,
  },
  correction_freeze: {
    ...delta.correction_freeze,
    original_status: correction.status,
    original_record_untouched: true,
  },
  proof: {
    delta: deltaBinding, crop160: cropBinding,
    original_configured_counter_probes: delta.configured_counter_proof,
    native_structure: delta.native_structure,
    helpers: { ...delta.helpers, write_report: self },
  },
  combined_SOURCE_gate: {
    status: passed ? 'pass' : 'needs-correction',
    pass: passed, conditions,
    passed_components: [
      'All original SOURCE text approvals retained by exact original and corrected draft bindings.',
      '204/206 exact counting metadata corrections independently verified and byte-reversible.',
      'Native configured17/24 and frozen default23/21 provenance retained without any rerun.',
      'Original actual candidate156-159 approvals retained unchanged.',
      'Actual160 diagram completeness and caption/neighbor-prose exclusion pass.',
    ],
    actual160_crop_approved: passed,
    blocker: crop.blockers[0] ?? null,
  },
  pages: delta.pages.map(page => ({
    ...page,
    metadata_delta_status: 'pass',
    source_text_status: 'inherited-pass',
    source_text_approval_provenance: {
      path: delta.original_partial_gate.path, sha256: delta.original_partial_gate.sha256,
      original_pdf_page: page.pdf_page,
    },
    source_reading_or_math_reapproved_this_task: false,
  })),
  approved_corrected_drafts: delta.pages.map(page => ({
    pdf_page: page.pdf_page, ...page.corrected_draft,
    scope: 'original-bound-SOURCE-text-and-exact-authorized-counting-metadata-only',
    original_review: {
      path: delta.original_partial_gate.path, sha256: delta.original_partial_gate.sha256,
    },
    correction_freeze: delta.correction_freeze,
    approval_does_not_approve_fig160_crop_or_SCI_or_promotion: true,
  })),
  figures: delta.figures.map(figure => figure.id === 'fig-160' ? {
    ...figure, status: crop.status, image_opened_this_task: true,
    actually_opened_candidate: true,
    source_inventory: original160.source_inventory,
    source_inventory_provenance: crop.original_review,
    no_original_page_reopen: true,
    completeness_status: crop.completeness_status,
    text_leakage_status: crop.leakage.text_leakage_status,
    scan_speck_exclusion_status: crop.leakage.scan_speck_exclusion_status,
    crop_review: cropBinding, crop_gate_approved: passed,
    findings: crop.inventory_comparison,
    blocking_finding: crop.leakage.finding,
  } : {
    ...figure, status: 'inherited-pass',
    original_review: {
      path: delta.original_partial_gate.path, sha256: delta.original_partial_gate.sha256,
    },
    approval_scope: 'original-SOURCE-crop-completeness-and-no-text-leakage-only',
    actually_opened_candidate_this_task: false,
  }),
  approved_candidates: delta.figures.filter(figure => figure.id !== 'fig-160')
    .map(figure => ({
      id: figure.id, ...figure.candidate, inherited_original_reviewer_approval: true,
      original_review: {
        path: delta.original_partial_gate.path, sha256: delta.original_partial_gate.sha256,
      },
    })),
  unapproved_candidates: [{ id: 'fig-160', ...crop.candidate, reason: crop.blockers[0].finding }],
  boundaries: review.boundaries,
  boundary_approval_basis: 'inherited-original-review-with-proven-unchanged-source-bodies-and-flags',
  cards: {
    closed_source_boundaries: [
      {
        id: 'phy9-c2-s2-n82', printed_number: 82, closed_at: 'p0204#7',
        status: 'tail-boundary-closed-not-whole-card-approval',
        counting_delta_resolved: true, predecessor_approval_outside_this_task: true,
      },
      {
        id: 'phy9-c2-s2-n83', printed_number: 83, starts_at: 'p0204#8', closed_at: 'p0206#5',
        status: 'source-boundary-closed-not-SCI-or-finalized-lesson',
        counting_deltas_resolved: true, figures_source_approved: ['fig-158', 'fig-159'],
      },
    ],
    provisional_open: [{
      id: 'phy9-c2-s2-n84', printed_number: 84, starts_at: 'p0206#6',
      status: 'open-to208', worked_example_number: '1',
      worked_example_complete: false, terminal_ref: 'p0207#11',
      terminal_literal: review.cards.provisional_open[0].terminal_literal,
      pending: ['actual160 crop exclusion gate', 'unviewed continuation208'],
    }],
    finalized_or_assembled_cards: [], science_approved_cards: [],
  },
  image_ledger: [{
    load: 1, kind: 'actual-candidate-crop', ...crop.candidate,
    detail: 'original', actually_opened: true,
  }],
  summary: {
    accepted_rows_by_page: { 204: 17, 205: 23, 206: 24, 207: 21 },
    accepted_rows_total: 85, footer_rows: 4,
    explanatory_footnote_rows_within204207: 0,
    metadata_corrections_verified: 2, source_text_changes: 0,
    whole_drafts_unchanged: [205, 207],
    new_SOURCE_text_or_math_approvals: 0,
    inherited_candidate_crops_passed: ['fig-156', 'fig-157', 'fig-158', 'fig-159'],
    newly_approved_candidate_crops: [],
    candidate160_completeness: 'pass', candidate160_text_leakage: 'pass',
    candidate160_original_scan_speck_exclusion: 'fail',
    combined_affected_only_SOURCE_pass: false,
    worked_examples: 1, worked_examples_closed: 0,
  },
  blockers: crop.blockers,
  remaining_scope_boundaries: [
    '84/example1 remains open to unviewed208; this is not newly treated as a failure of source transcription.',
    'No source math claim is scientifically endorsed; original literal C on207 remains unchanged.',
    'No native finalize/vectorize/assemble, SCI, promotion, browser, DB or Git operation is authorized by this report.',
    'No source or candidate edit was made; no new crop or pixel-whitening correction is authorized.',
  ],
  preservation_and_limits: {
    visual_images_loaded: 1, visual_actual_candidate_crops_loaded: 1,
    crop160_visual_loads: 1, visual_original_pages_loaded: 0,
    candidate156159_visual_loads: 0, visual_reopens: 0,
    unrelated_image_loads: 0, grid_loads: 0, detail_loads: 0,
    contact_sheet_loads: 0, masked_copy_visual_loads: 0,
    image_payload_returned_to_user: false, return_mode: 'text-only',
    native_structural_parse_invocations: 1, native_parse_calls: 4,
    native_image_counting_calls: 0, native_text_printed_lines_calls: 0,
    counting_reruns: 0, parameter_sweeps: 0,
    native_prepare_finalize_vectorize_assemble_adapt_runs: 0,
    image_files_written: 0, source_or_author_files_written: 0,
    source_or_corrected_drafts_written: 0,
    tool_skill_index_global_files_written: 0,
    SCI_or_modern_figure_work: false, promotion: false,
    browser_DB_Git_or_global_tool_operations: false,
    ticket_backend_operations_this_review: 0,
    source_math_endorsed_or_errata_authored: false,
    other_agents_changes_preserved: true,
    outputs_only_in_owned_report_and_proof_directory: true,
    in_flight_processes: [],
  },
};
await writeFile(path.join(root, report.scope.output_path),
  `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({
  status: report.status, combined_SOURCE_pass: passed,
  report: await bind(report.scope.output_path),
  opens: report.preservation_and_limits.visual_images_loaded,
  native_structural_invocations: 1, counting_reruns: 0,
  blockers: report.blockers,
}, null, 2));

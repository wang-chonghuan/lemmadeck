import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const tmp = '.intentfold/tickets/STEMROBIN-181/tmp';
const proof = `${tmp}/source-review-9p-0204-0207-correction-proof`;
async function boundJson(relative, expected) {
  const bytes = await readFile(path.join(root, relative));
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  if (expected) assert.equal(sha256, expected, `Text evidence changed: ${relative}`);
  return { binding: { path: relative, sha256 }, value: JSON.parse(bytes) };
}
const initial = await boundJson(`${tmp}/source-review-9p-0204-0207-correction.json`,
  '08f0de6dc5155ac5f2b2243af18a691a25724b6b564f94ef62c534ff09f7413a');
const report = initial.value;
const crop = await boundJson(report.proof.crop160.path, report.proof.crop160.sha256);
const delta = await boundJson(report.proof.delta.path, report.proof.delta.sha256);
const original = await boundJson(report.original_partial_gate.path, report.original_partial_gate.sha256);
await boundJson(report.original_author_freeze.path, report.original_author_freeze.sha256);
await boundJson(report.correction_freeze.path, report.correction_freeze.sha256);
await boundJson(report.proof.original_configured_counter_probes.path,
  report.proof.original_configured_counter_probes.sha256);
assert.equal(initial.value.status, 'needs-correction');
assert.equal(delta.value.status, 'pass');
assert.equal(report.combined_SOURCE_gate.conditions.filter(item => !item.pass).length, 1);
assert.equal(report.combined_SOURCE_gate.conditions.find(item => !item.pass).id,
  '160-original-reviewer-scanning-speck-exclusion-met');
assert.equal(crop.value.status, 'needs-correction');
assert.equal(crop.value.completeness_status, 'pass');
assert.equal(crop.value.leakage.text_leakage_status, 'pass');
assert.equal(crop.value.leakage.caption160_excluded, true);
assert.equal(crop.value.leakage.left_worked_example_prose_excluded, true);
assert.equal(crop.value.leakage.full_width_solution_prose_below_excluded, true);
assert.equal(crop.value.leakage.neighboring_figures_or_uninventoried_labels_present, false);
assert.equal(crop.value.inventory_comparison.length, 6);
assert.ok(crop.value.inventory_comparison.every(item => item.status === 'pass'));
assert.equal(crop.value.observation.actual_candidate_opens, 1);
assert.equal(crop.value.observation.reopens, 0);
assert.deepEqual(crop.value.leakage.approximate_candidate_location_xy, [205, 9]);
assert.deepEqual(crop.value.binding.frozen_exact_extraction_box_xywh, [966, 1050, 271, 552]);
assert.deepEqual(crop.value.binding.frozen_snapped_box_xywh, [978, 1062, 247, 528]);
assert.equal(crop.value.binding.padding_px, 12);
const borderTop = crop.value.binding.frozen_snapped_box_xywh[1]
  - crop.value.binding.frozen_exact_extraction_box_xywh[1];
assert.equal(borderTop, 12);
assert.ok(crop.value.leakage.approximate_candidate_location_xy[1] < borderTop);
const original160 = original.value.figures.find(figure => figure.id === 'fig-160');
assert.deepEqual(original160.candidate, crop.value.candidate);
assert.deepEqual(original160.source_inventory.objects.map(item => item.id),
  crop.value.inventory_comparison.map(item => item.id));
assert.equal(crop.value.original_review.author_inventory_used_as_authority, false);
assert.deepEqual(report.approved_corrected_drafts.map(item => item.pdf_page), [204, 205, 206, 207]);
assert.deepEqual(report.approved_candidates.map(item => item.id),
  ['fig-156', 'fig-157', 'fig-158', 'fig-159']);

const skillPath = '.claude/skills/ld-s10y-lesson/SKILL.md';
const skillBytes = await readFile(path.join(root, skillPath));
const skillSha = createHash('sha256').update(skillBytes).digest('hex');
assert.equal(skillSha, delta.value.verified_files.find(item => item.path === skillPath).sha256);
const selfPath = path.relative(root, fileURLToPath(import.meta.url));
const selfSha = createHash('sha256').update(await readFile(path.join(root, selfPath))).digest('hex');
const judgments = {
  classification: 'retained-source-scan-noise-in-default-exact-border',
  observation_basis: 'existing-single-actual-candidate160-observation-only',
  finding_erased_or_retracted: false,
  original_finding: crop.value.leakage.finding,
  original_approximate_candidate_location_xy: crop.value.leakage.approximate_candidate_location_xy,
  original_location_basis: crop.value.leakage.location_basis,
  estimated_source_y: 1050 + 9,
  snapped_diagram_top_source_y: 1062,
  default_top_border_px: borderTop,
  border_location_status: 'within-top12px-border-based-on-existing-visual-estimate',
  obscures_any_given: false,
  obscures_any_required_object_or_label: false,
  can_be_confused_with_a_diagram_symbol: false,
  rationale: [
    'The existing observation identifies an isolated speck above the right plate and to the right of the top d dimension, separate from every inventoried diagram object.',
    'All six inventoried objects, including complete d/x/l labels, dimension lines and guides, both outer plates and leads, and the full hatched slab, already passed the actual-crop completeness check.',
    'In the single observed crop the speck has no attachment to a plate, hatch, dimension line or label, and is not positioned as part of a given. Its isolated border position does not ambiguate d, x or l or resemble an additional diagram symbol.',
    'The original source inventory contains no numeric values; this remote speck is not an adjacent decimal point or any additional printed given.',
    'The existing approximate y=9 is inside the unchanged top12px source border: extraction begins at source y1050 and the snapped diagram begins at y1062. This is metadata arithmetic applied to an already recorded visual estimate, not new pixel measurement.',
    'Caption160, left worked-example prose, solution prose below and neighboring figure or label content were already excluded. A separate non-obscuring scan speck is not content leakage.',
  ],
  decision: 'document-and-retain-without-recrop-or-whitening',
  new_pixel_observation_or_measurement: false,
};
const conditions = [
  ...report.combined_SOURCE_gate.conditions.filter(item =>
    item.id !== '160-original-reviewer-scanning-speck-exclusion-met').map(item => ({
    ...item, basis: 'unchanged-bound-initial-report-and-existing-proof',
  })),
  {
    id: 'retained-scan-noise-neither-obscures-givens-nor-creates-symbol-ambiguity',
    pass: !judgments.obscures_any_given
      && !judgments.obscures_any_required_object_or_label
      && !judgments.can_be_confused_with_a_diagram_symbol,
    basis: 'disposition-of-existing-single-crop-observation-under-human-clarified-governing-criterion',
  },
];
const passed = conditions.every(item => item.pass);
assert.equal(passed, true);
const disposition = {
  schema: 'STEMROBIN-181/source-review-disposition@1',
  ticket: 'STEMROBIN-181', book: '9p', batch: 'D021-source-preparation',
  date: '2026-11-16', workspace: root,
  role: 'same-unique-independent-affected-only-SOURCE-reviewer-text-only-disposition',
  status: 'pass', completion: 'affected-only-SOURCE-gate-complete',
  scope: {
    decision: 'governing-criterion-disposition-only-no-second-inspection',
    affected_figure: 'fig-160', pdf_pages: [204, 205, 206, 207],
    metadata_verification: 'reuse-existing-bound204206-delta-proof',
    source_text_approval: 'reuse-original-bound-independent-review-only',
    no_new_source_reading_or_SCI_approval: true,
    output_path: `${tmp}/source-review-9p-0204-0207-correction-disposition.json`,
  },
  governing_criterion: {
    authority: 'human-clarification-in-current-message-and-lesson-extraction-contract',
    requirement: 'Complete faithful actual source crop, with no neighboring source-text or figure content leakage and no obscured or ambiguously represented given.',
    completeness_standard_unchanged: true,
    zero_scan_noise_is_not_a_requirement: true,
    default_exact12px_source_border_retained: true,
    lesson_skill: { path: skillPath, sha256: skillSha, lines: [231, 240] },
    lesson_contract: 'Default12px border; padding adjustment addresses adjacent prose, and exclude_figures addresses adjacent figure ink. Neither imposes zero-noise source pixels.',
    original_reviewer_proposal: crop.value.leakage.original_reviewer_exclusion,
    proposal_status: 'proposed-exclusion-not-higher-priority-ticket-requirement',
    initial_gate_error: 'The initial report treated the reviewer-proposed speck exclusion as a mandatory zero-noise gate. This disposition corrects that criterion classification, not any completeness or content-leakage observation.',
    cosmetic_recrop_or_whitening_authorized: false,
  },
  initial_report: {
    ...initial.binding, status_at_issue: report.status, immutable: true,
    original_blockers: report.blockers,
    original_gate_conditions: report.combined_SOURCE_gate.conditions,
  },
  original_partial_gate: report.original_partial_gate,
  original_author_freeze: report.original_author_freeze,
  correction_freeze: report.correction_freeze,
  proof: {
    initial_delta: delta.binding, initial_actual_crop_observations: crop.binding,
    original_configured_counter_probes: report.proof.original_configured_counter_probes,
    initial_native_structure: report.proof.native_structure,
    inherited_helpers: report.proof.helpers,
    disposition_helper: { path: selfPath, sha256: selfSha },
    current_operation: 'JSON-and-skill-text-read-and-SHA-binding-only',
    source_or_candidate_image_files_read_this_disposition: false,
    previous_evidence_checks_not_reperformed: true,
  },
  initial_crop_record_preserved: crop.value,
  speck_disposition: judgments,
  resolved_initial_blocker: {
    id: report.blockers[0].id,
    original_finding: report.blockers[0].finding,
    original_decision: 'withhold-SOURCE-pass-under-zero-speck-interpretation',
    new_decision: 'nonblocking-retained-source-noise-under-governing-fidelity-and-no-content-leakage-criterion',
    observation_unchanged: true,
    requires_pixel_correction: false,
    resolution_changes_only_criterion_disposition: true,
  },
  combined_affected_only_SOURCE_gate: {
    status: 'pass', pass: passed, conditions,
    actual160_crop_approved: true,
    candidate160: crop.value.candidate,
    candidate160_binding: crop.value.binding,
    default_padding_px: 12,
    completeness: 'pass-existing-actual-crop-observation',
    content_leakage: 'pass-existing-actual-crop-observation',
    noise_and_symbol_ambiguity: 'nonblocking-scan-noise-no-obscuration-or-symbol-confusion',
    author_inventory_or_crop_self_approval_used: false,
  },
  approved_corrected_drafts: report.approved_corrected_drafts,
  native_count_provenance: report.pages.map(page => ({
    pdf_page: page.pdf_page, accepted_rows_including_footer: page.accepted_rows_including_footer,
    provenance: page.native_count_provenance,
  })),
  approved_candidates: [
    ...report.approved_candidates,
    {
      id: 'fig-160', ...crop.value.candidate,
      approval_scope: 'SOURCE-crop-fidelity-completeness-and-no-content-leakage-only',
      source_ref: crop.value.binding.source_ref,
      caption_ref: crop.value.binding.caption_ref,
      owner: crop.value.binding.owner, owner_object: crop.value.binding.owner_object,
      original_inventory_provenance: crop.value.original_review,
      actual_crop_observations: crop.binding,
      approved_by_existing_single_actual_crop_observation_plus_this_disposition: true,
      nonblocking_scan_noise_finding_retained: true,
    },
  ],
  boundaries: report.boundaries,
  cards: {
    closed_source_boundaries: report.cards.closed_source_boundaries,
    provisional_open: report.cards.provisional_open.map(card => ({
      ...card, pending: ['unviewed continuation208'],
      actual160_SOURCE_crop_gate_resolved: true,
    })),
    finalized_or_assembled_cards: [], science_approved_cards: [],
  },
  summary: {
    combined_affected_only_SOURCE_pass: true,
    accepted_rows_by_page: report.summary.accepted_rows_by_page,
    accepted_rows_total: report.summary.accepted_rows_total,
    metadata_corrections_verified_previously: 2,
    approved_candidates: ['fig-156', 'fig-157', 'fig-158', 'fig-159', 'fig-160'],
    retained_noise_findings: 1, actionable_SOURCE_blockers: 0,
    source_boundaries_closed: [82, 83], card84_example1_open_to208: true,
    no_card84_or_example1_completion_approval: true,
  },
  blockers: [],
  preservation_and_limits: {
    initial_report_and_observation_records_modified: false,
    new_image_opens: 0, cumulative_actual_candidate160_opens: 1,
    second_inspection: false, new_pixel_measurements: 0, new_counter_calls: 0,
    new_native_parse_calls: 0, new_native_pipeline_runs: 0,
    new_source_reading_or_math_approval: false, SCI: false,
    source_or_corrected_draft_changes: 0, image_or_candidate_changes: 0,
    recrop: false, whitening: false, promotion: false, browser: false, DB: false, Git: false,
    return_mode: 'text-only', image_payload_returned: false,
    other_agents_edits_preserved: true,
    writes_only_to_new_disposition_and_its_owned_proof_helper: true,
    in_flight_processes: [],
  },
};
await writeFile(path.join(root, disposition.scope.output_path),
  `${JSON.stringify(disposition, null, 2)}\n`, { flag: 'wx' });
await boundJson(initial.binding.path, initial.binding.sha256);
await boundJson(crop.binding.path, crop.binding.sha256);
await boundJson(delta.binding.path, delta.binding.sha256);
const output = await boundJson(disposition.scope.output_path);
console.log(JSON.stringify({
  status: output.value.status, report: output.binding,
  initial_report_unchanged: true, initial_observations_unchanged: true,
  nonblocking_finding_retained: true,
  new_image_opens: 0, cumulative160_opens: 1, new_counter_calls: 0,
  blockers: output.value.blockers,
}, null, 2));

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const inputPath = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d380-t18-thickness-layout-and-tail/report.json');
const expectedInputHash = '044cf5fe422f5a7b52de778076a078347c40d351d159adc518ad6a92c6b35310';
function binding(p) {
  const bytes = fs.readFileSync(p);
  return { path: p, sha256: crypto.createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length };
}
function write(name, value) {
  const p = path.join(root, name);
  assert(!fs.existsSync(p), `Already frozen/generated: ${p}`);
  fs.writeFileSync(p, JSON.stringify(value, null, 2) + '\n');
}
function verify(entry) {
  const actual = binding(entry.path);
  assert.equal(actual.sha256, entry.sha256);
  if (entry.bytes !== undefined) assert.equal(actual.bytes, entry.bytes);
}
const input = binding(inputPath);
assert.equal(input.sha256, expectedInputHash);
const report = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const observations = JSON.parse(fs.readFileSync(path.join(root, 'observations.json'), 'utf8'));
assert.equal(report.card, 'phy9-c2-s4-t18');
assert.equal(report.layoutOnly.exercise, '15');
assert.equal(report.layoutOnly.mathematicalTokensExactlyPreserved, true);
const images = report.images.slice(0, 4).map((entry, index) => {
  assert.equal(entry.role, 'affected-thickness-equation');
  assert.equal(entry.originalPixels, true);
  assert.equal(entry.resampled, false);
  const absolutePath = path.resolve(repo, entry.path);
  verify({ path: absolutePath, sha256: entry.sha256 });
  const bytes = fs.readFileSync(absolutePath);
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  return {
    index, ...entry, path: absolutePath, bytes: bytes.length,
    png_dimensions: { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) },
  };
});
assert.equal(images.length, 4);
assert.equal(images[1].sha256, images[3].sha256);
assert.equal(new Set(images.map(x => x.sha256)).size, 3);
for (const open of observations.actual_open_order) {
  assert.equal(open.sha256, images[open.input_image_index].sha256);
}
assert.deepEqual(observations.actual_open_order.map(x => x.cumulative_ordinal), [20, 21, 22]);
const originals = report.originalFindings.map(finding => {
  const entry = { ...finding.binding, path: path.resolve(repo, finding.binding.path) };
  verify(entry);
  return { id: finding.id, binding: binding(entry.path) };
});
assert.deepEqual(originals.map(x => x.id), [
  'b09-013-thickness-formula-right-clipping', 'D369-B12-DISPLAY-F001',
]);
const surfaces = report.surfaces.slice(0, 4).map((surface, index) => {
  assert.equal(surface.language, images[index].language);
  assert.deepEqual(surface.viewport, images[index].viewport);
  assert.equal(surface.geometry.annotation, report.layoutOnly.afterTeX);
  assert(parseFloat(surface.geometry.font) >= 16);
  assert(surface.geometry.visual.left >= surface.geometry.body.left);
  assert(surface.geometry.visual.right <= surface.geometry.body.right);
  assert.equal(surface.errors.length, 0);
  assert.equal(surface.cutoffs.length, 0);
  assert.equal(surface.collisions.length, 0);
  return {
    ...surface,
    computed_base_font_px: parseFloat(surface.geometry.font),
    body_right_clearance_px: surface.geometry.body.right - surface.geometry.visual.right,
    precise_measurements_basis: 'Existing input report; no reviewer browser or rerender.',
  };
});
const htmlBindings = report.outputs.map(entry => {
  const absolutePath = path.resolve(repo, entry.path);
  verify({ path: absolutePath, sha256: entry.sha256 });
  return { language: entry.language, ...binding(absolutePath) };
});
write('input-bindings.json', {
  schema: 't18-thickness-affected-display-inputs@1',
  input_report: input, images, surfaces, html_bindings: htmlBindings, original_FAIL_findings: originals,
  screenshot_scope: 'Only report.images[0..3]; images[4] is not hashed, copied or opened.',
  mathematical_tokens_preservation: {
    basis: 'Parent layoutOnly.mathematicalTokensExactlyPreserved assertion bound by the exact input report hash.',
    reviewer_SCI_repeated: false,
    before_tex: report.layoutOnly.beforeTeX, after_tex: report.layoutOnly.afterTeX,
  },
});
write('actual-opens.json', {
  schema: 't18-thickness-affected-display-actual-opens@1',
  history_images: 19, batch_new_images: 3, cumulative_images: 22,
  batch_maximum: 4, applicable_cumulative_maximum: 23, global_context_maximum: 24,
  image_count_reset: false,
  actual_tool_opens: observations.actual_open_order.map(open => ({
    ...open, path: images[open.input_image_index].path,
    tool: 'functions.view_image', detail: 'original', succeeded: true,
  })),
  same_hash_reuse: { ...observations.same_pixel_reuse, path: images[3].path, reused_path: images[1].path },
  fifth_final_answer_PNG_opens: 0, original93_image_opens: 0,
  reopens_crops_screenshots_rasterizations: 0, parent_image_payloads: 0,
  binary_hashing_is_not_visual_image_tool_open: true,
});
write('exact-binding.json', {
  schema: 't18-thickness-affected-display-exact-binding@1',
  report_input: input, image_bindings: images,
  four_viewports_to_actual_pixels: [
    { input_image_index: 0, actual_batch_open: 1 },
    { input_image_index: 1, actual_batch_open: 2 },
    { input_image_index: 2, actual_batch_open: 3 },
    { input_image_index: 3, actual_batch_open: 2, byte_identical_reuse: true },
  ],
  original_FAIL_findings: originals,
  observations: binding(path.join(root, 'observations.json')),
  actual_opens: binding(path.join(root, 'actual-opens.json')),
  input_bindings: binding(path.join(root, 'input-bindings.json')),
  precise_font_and_bounds: surfaces,
});
const protectedBindings = [input, ...images, ...htmlBindings, ...originals.map(x => x.binding)];
protectedBindings.forEach(verify);
write('report.json', {
  schema: 't18-thickness-affected-independent-display-review@1',
  ticket: 'STEMROBIN-181', card: 'phy9-c2-s4-t18', exercise: '15', root,
  status: 'PASS-AFFECTED-THICKNESS-DISPLAY-ONLY', independent_actual_pixel_review: true,
  scope: 'Only four equation PNG entries images[0..3], three unique original-pixel images actually opened.',
  input_report: input,
  cleared_display_findings: originals.map(finding => ({
    ...finding, affected_display_verdict: 'PASS', original_FAIL_preserved: true,
    basis: 'All four aligned h rows, numerals, exponents, unit m/mm and final period are readable; no internal overlap or right-end clipping in original pixels. Existing hash-bound DOM records confirm >=16px base font and body containment.',
  })),
  counts: { prior_images: 19, new_actual_images: 3, cumulative_images: 22, same_hash_reuses_without_open: 1, reset: false },
  font: {
    status: 'PASS', computed_base_font_px_all_four_viewports: 20.1344, minimum_base_font_px: 16,
    source: 'Hash-bound d380 surfaces, supported by original-scale pixel legibility.',
    superscripts: 'Conventional reduced KaTeX scripts remain readable; not a claim that all script glyph CSS sizes are >=16px.',
  },
  equation_rows: observations.independent_readings_in_all_observed_pixels,
  original_FAIL_files_unchanged: originals,
  actual_opens: binding(path.join(root, 'actual-opens.json')),
  observations: binding(path.join(root, 'observations.json')),
  exact_binding: binding(path.join(root, 'exact-binding.json')),
  input_bindings: binding(path.join(root, 'input-bindings.json')),
  unchanged_out_of_scope: {
    exercise_1_HOLD: 'NOT_CLEARED',
    exercise_9_HOLD: 'NOT_CLEARED',
    exercise_14_HOLD: 'NOT_CLEARED',
    exercise_16_HOLD: 'NOT_CLEARED',
    conditional_assumption_HOLD: 'NOT_CLEARED',
    fifth_final_answer_display: 'NOT_REVIEWED; reserved for the original Huygens reviewer',
    other_source_SCI_RAW_or_display_findings: 'NOT_REVIEWED_OR_CLEARED',
  },
  science_recomputation_or_reapproval: false,
  fullGate2PASS: false, wholeCardPASS: false, completeCardClaim: false,
  original93_opens: 0, fifth_final_answer_PNG_opens: 0,
  native_rerender_browser_vectorize_raster_crop_generation_runs: 0,
  workers_chats_branches_worktrees_created: 0,
  canonical_index_meter_Git_DB_written: false,
  original_candidate_or_FAIL_files_written: false,
  protected_input_bindings_unchanged: true,
  parent_image_payloads: 0, intended_file_mode: '0444',
  disposition: 'Stop after freeze; only these two thickness display findings are discharged.',
});
const owned = fs.readdirSync(root).sort().map(name => binding(path.join(root, name)));
write('review-freeze.json', {
  schema: 't18-thickness-affected-independent-display-review-freeze@1',
  frozen: true, status: 'PASS-AFFECTED-THICKNESS-DISPLAY-ONLY',
  independent_actual_pixel_review: true, root, files: owned,
  report: binding(path.join(root, 'report.json')), self_hash_excluded: true,
  history_images: 19, batch_new_images: 3, cumulative_images: 22, reset: false,
  fullGate2PASS: false, completeCardClaim: false, file_mode: '0444',
});
write('freeze-seal.json', {
  schema: 't18-thickness-affected-display-seal@1',
  review_freeze: binding(path.join(root, 'review-freeze.json')),
  report: binding(path.join(root, 'report.json')),
  actual_opens: binding(path.join(root, 'actual-opens.json')),
  self_hash_excluded: true, file_mode: '0444',
});
for (const name of fs.readdirSync(root)) fs.chmodSync(path.join(root, name), 0o444);
owned.forEach(verify);
protectedBindings.forEach(verify);
for (const name of fs.readdirSync(root)) assert.equal(fs.statSync(path.join(root, name)).mode & 0o777, 0o444);
console.log(JSON.stringify({
  report: binding(path.join(root, 'report.json')),
  review_freeze: binding(path.join(root, 'review-freeze.json')),
  frozen_files: fs.readdirSync(root).length,
  history_images: 19, batch_new_images: 3, cumulative_images: 22,
}, null, 2));

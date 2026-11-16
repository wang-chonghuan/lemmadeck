import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const out = path.dirname(fileURLToPath(import.meta.url));
const previous = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/9p-next-source-0144-0147');
const binding = file => ({
  path: file,
  sha256: createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
});
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const freezePath = path.join(out, 'author-freeze.json');
assert(!fs.existsSync(freezePath), 'Do not overwrite a frozen author package.');
const checkPath = path.join(out, 'author-check.json');
const observations = read(checkPath);
const assertBindings = value => {
  if (value && typeof value === 'object' && value.path && value.sha256) {
    assert.equal(binding(value.path).sha256, value.sha256);
  } else if (value && typeof value === 'object') {
    for (const child of Object.values(value)) assertBindings(child);
  }
};
assertBindings(observations);
for (const page of observations.pages) {
  assert.equal(page.draft_printed_rows, page.author_observed_printed_rows_including_footer);
  assert.deepEqual(page.normalizations_needed, []);
  assert.deepEqual(page.charset_findings, []);
  assert.deepEqual(page.math_errors, []);
  assert.deepEqual(page.math_warnings, []);
  assert.equal(page.source_png_and_ink_unchanged, true);
  if (page.pdf_page === 149) {
    assert.equal(page.configured_native_count, 24);
    assert.equal(page.draft_printed_rows, 25);
    assert.deepEqual(page.native_author_errors, ['Configured native counter differs from author physical rows']);
  } else {
    assert.equal(page.configured_native_count, page.author_observed_printed_rows_including_footer);
    assert.deepEqual(page.native_author_errors, []);
  }
}
const previousHashesAtStart = {
  '0144.page.md': '636efa27dcc45c086c67e02f32afea0900bc90fca2e1b7dc07b1b84c36169fef',
  '0145.page.md': 'cecfd7b8340dd9412d7621c0025f72c5d17fe8a69ed1024d5b183e97189d6285',
  '0146.page.md': '7a72b67c090f82aa28b95ca564754d6326dea3fe6ca94435aa9df6356d006443',
  '0147.page.md': '5313e914effd04659f8cfc94d88f887110418a595845024a7d6eb3737f803b28',
  'author-freeze.json': '4119059c7909009ba93aad1f091ca6bf4437ffa74a4f323d215bad628eeba3be',
};
const preservedPrevious = Object.entries(previousHashesAtStart).map(([name, sha256]) => {
  const current = binding(path.join(previous, name));
  assert.equal(current.sha256, sha256, 'Do not overwrite upstream changes.');
  return current;
});
const figures = observations.pages.flatMap(page => page.source_figures);
assert.deepEqual(figures.map(figure => figure.id), ['fig-104', 'fig-105']);
const page149 = observations.pages.find(page => page.pdf_page === 149);
const footnote149 = page149.block_inventory.find(block => block.ref === 'p0149#9');
assert.equal(footnote149.kind, 'p');
assert.equal(footnote149.physical_rows, 3);
const countingFinding = {
  id: 'author-native-count-149-footnote',
  status: 'unresolved-native-counting-discrepancy-not-independent-gate',
  pdf_page: 149,
  printed_page: 140,
  block: 'p0149#9',
  draft: page149.draft,
  source: page149.source,
  actual_printed_rows_including_footer: 25,
  draft_printed_rows: 25,
  native_count: 24,
  native_band_merging_two_real_rows: [1865, 1946],
  independently_expected_from_source_pixels: 'The footnote prints three rows:①不久前...夸克.;假定质子...用实;验发现夸克. The fraction belongs to the first single row.',
  evidence: binding(path.join(out, 'evidence/0149-footnote-rows-detail.png')),
  counting_override: null,
  requested_next_action: 'Main/independent source reviewer confirms the printed rows and owns any minimal native counter repair. Do not delete text, merge physical lines, add empty lines, add WRAP or invent margin overrides.',
};
const record = {
  ticket: 'STEMROBIN-181',
  role: 'faithful-source-author-only',
  status: 'frozen-with-native-counting-finding-pending-first-independent-source-gate',
  scope: { book: '9p', pdf_pages: [148, 149, 150, 151], printed_pages: [139, 140, 141, 142] },
  created_at: new Date().toISOString(),
  author_asserts_no_in_flight_writes: true,
  native_prepare: { pages: [148, 149, 150, 151], dpi: 300, run_once_per_previously_absent_page: true },
  context: observations.context,
  pages: observations.pages,
  counts: {
    physical_rows_including_footers: [26, 25, 26, 26],
    draft_physical_rows_including_footers: [26, 25, 26, 26],
    configured_native_counts: [26, 24, 26, 26],
    total_actual_physical_rows_including_footers: 103,
    blocks: observations.pages.reduce((total, page) => total + page.blocks, 0),
    original_written_tasks: 0,
    numbered_figures: ['fig-104', 'fig-105'],
    tables: 0,
    footnote_printed_lines: 6,
  },
  author_actual_pixel_reading: [
    { pdf_page: 148, full_resolution_page_read_separately: true, actual_rows: 26, figures: [] },
    { pdf_page: 149, full_resolution_page_read_separately: true, actual_rows: 25, figures: [], footnote_three_rows_locally_inspected: true },
    { pdf_page: 150, full_resolution_page_read_separately: true, actual_rows: 26, actual_native_candidates_inspected: ['fig-104'] },
    { pdf_page: 151, full_resolution_page_read_separately: true, actual_rows: 26, actual_native_candidates_inspected: ['fig-105'] },
  ],
  boundaries: [
    { pdf_page: 148, incoming: { block: 'p0148#1', kind: 'p cont', from: 'p0147#10', previous_terminal_text: '则就', first_text: '说它们具有电荷' }, outgoing: { block: 'p0148#6', kind: 'p open', last_text: '他带电粒子的寿命只有百万分之几秒. 它们是在高速基本粒' }, note: 'Bold subheads两种电荷/基本电荷 remain inside original paragraphs, not new headings/tasks.' },
    { pdf_page: 149, incoming: { block: 'p0149#1', kind: 'p cont', from: 'p0148#6', first_text: '子碰撞时诞生' }, closed_lesson: '59', new_lesson: { block: 'p0149#5', kind: 'h3', printed_title: '60. 带电物体 物体的起电' }, footnote: { block: 'p0149#9', physical_rows: 3, marker: '①', owner: 'p0149#4 in printed59, before60 heading', transparent_to_body_boundaries: true } },
    { pdf_page: 150, incoming: 'New paragraph within60, not p cont', within_page: { from: 'p0150#2 p open', through: ['p0150#3 fig104', 'p0150#4 cap104 samerow'], to: 'p0150#5 p cont', same_original_paragraph: true }, footnote: { block: 'p0150#6', physical_rows: 3, marker: '①', owner: 'p0150#1', transparent_to_body_boundaries: true }, outgoing: 'Long paragraph complete;60 continues with a new paragraph on151' },
    { pdf_page: 151, incoming: 'New paragraph within60, not p cont', within_page: { from: 'p0151#1 p open', through: ['p0151#2 fig105', 'p0151#3 cap105 samerow'], to: 'p0151#4 p cont', source_reference_wrap: '(图 / 105)', same_original_paragraph: true }, outgoing: { block: 'p0151#9', kind: 'p open', last_text: '在印刷厂里，当退下大卷筒纸时，工人们都带上橡皮手', next_page_not_prepared_or_read: true } },
  ],
  source_crop_author_observations: figures.map(figure => ({
    id: figure.id,
    candidate: figure.candidate,
    rough_box: figure.rough_box,
    snapped_box: figure.snapped_box,
    exact_source_extraction_box: figure.exact_source_extraction_box,
    padding_px: figure.padding_px,
    source_owned_apparatus_or_material_regions_observed_present: true,
    neighboring_prose_or_caption_observed_in_candidate: false,
    source_inventory: figure.source_inventory,
    independent_review_status: 'not-performed',
  })),
  counting_boundaries: [
    { pdf_page: 148, edge_margin_px: 100, extra_bottom_shadow_band: [2155, 2197], no_source_text_in_excluded_edges_observed: true },
    { pdf_page: 149, counting_override: null, finding: countingFinding.id },
    { pdf_page: 150, edge_margin_px: 100, extra_bottom_shadow_band: [2150, 2182], no_source_text_in_excluded_edges_observed: true },
    { pdf_page: 151, counting_override: null },
  ],
  native_author_counting_findings: [countingFinding],
  native_author_text_normalization_charset_math: { status: 'pass', findings: [], note: 'Mechanical author checks only, not source fidelity or science approval.' },
  native_author_line_count_status: 'partial-3-pages-match/149-unresolved-24-vs25',
  native_author_observations: binding(checkPath),
  detail_evidence: [
    binding(path.join(out, 'evidence/0148-exponent-detail.png')),
    binding(path.join(out, 'evidence/0149-experiment-name-detail.png')),
    binding(path.join(out, 'evidence/0149-footnote-rows-detail.png')),
  ],
  source_reading_notes: [
    'Original10^39 and10^-8cm retained without numerical modernization.',
    '密立根和约飞 is actually visible; locally inspected evidence supplied, no invented missing name glyph.',
    'Both historical quark-footnote wording and source60 experimental/hazard descriptions remain original; no author SCI changes.',
    'Merged contact/transfer ink infig105 preserved wholly; no speculative particle/arrow count added.',
    'No formal tables or numbered written exercises occur on these four source pages.',
    'Closed per-page bold fragments are retained without editing the previous147 frozen fragment; the cross-page paragraph is explicitly source-bound.',
  ],
  protected_previous_package: { byte_identical_to_start: true, bindings: preservedPrevious },
  native_tools: observations.native_tools,
  profile: observations.profile,
  helpers: [observations.helper, binding(fileURLToPath(import.meta.url))],
  preservation: {
    no_prior_page_pixels_or_gate_repeated: true,
    original_pngs_unmodified: true,
    candidate_pngs_are_native_padded_source_extractions_without_repainting: true,
    no_source_science_corrections_or_errata_authored: true,
    no_invented_words_missing_glyphs_measurements_or_tasks: true,
    no_row_fitting_empty_lines_or_fabricated_WRAP: true,
    no_shared_tool_or_D016_template_edits: true,
    no_multi_page_montage: true,
  },
  pending: ['Unique independent initial source fidelity/crop/boundary gate', 'Main-owned native149 footnote-row counter resolution after independent confirmation'],
  self_independent_approval: false,
  durable_writes_finalize_vectorize_assemble_science_browser_db_git_or_dependencies: [],
  in_flight_processes: 0,
};
fs.writeFileSync(freezePath, JSON.stringify(record, null, 2) + '\n');
console.log(JSON.stringify({
  freeze: binding(freezePath),
  status: record.status,
  pages: observations.pages.map(page => ({
    pdf_page: page.pdf_page, printed_page: page.printed_page,
    draft: page.draft, source: page.source,
    actual_rows: page.author_observed_printed_rows_including_footer,
    native_rows: page.configured_native_count,
  })),
  counting_finding: countingFinding,
  in_flight_processes: 0,
}, null, 2));

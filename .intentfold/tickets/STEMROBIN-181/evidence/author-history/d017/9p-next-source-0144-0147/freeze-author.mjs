import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const out = path.dirname(fileURLToPath(import.meta.url));
const binding = file => ({
  path: file,
  sha256: createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
});
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const freezePath = path.join(out, 'author-freeze.json');
assert(!fs.existsSync(freezePath), 'Preserve a frozen source author artifact.');
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
  assert.deepEqual(page.native_author_errors, []);
  assert.deepEqual(page.normalizations_needed, []);
  assert.deepEqual(page.charset_findings, []);
  assert.deepEqual(page.math_errors, []);
  assert.deepEqual(page.math_warnings, []);
  assert.equal(page.draft_printed_rows, page.author_observed_printed_rows_including_footer);
  assert.equal(page.configured_native_count, page.author_observed_printed_rows_including_footer);
  assert.equal(page.source_png_and_ink_unchanged, true);
}
const inventories = observations.pages.flatMap(page => page.source_figures);
assert.deepEqual(inventories.map(figure => figure.id), ['fig-102', 'tbl-p0146-01', 'fig-103']);
const readScopes = [
  { pdf_page: 144, original_full_resolution_page_separately_read: true, crop_ids_actually_inspected: ['fig-102'], author_count_including_footer: 16 },
  { pdf_page: 145, original_full_resolution_page_separately_read: true, crop_ids_actually_inspected: [], author_count_including_footer: 21 },
  { pdf_page: 146, original_full_resolution_page_separately_read: true, crop_ids_actually_inspected: ['tbl-p0146-01'], author_count_including_footer: 26 },
  { pdf_page: 147, original_full_resolution_page_separately_read: true, crop_ids_actually_inspected: ['fig-103'], author_count_including_footer: 22 },
];
const record = {
  ticket: 'STEMROBIN-181',
  role: 'faithful-source-author-only',
  status: 'frozen-pending-first-independent-source-gate',
  scope: { book: '9p', pdf_pages: [144, 145, 146, 147], printed_pages: [135, 136, 137, 138] },
  created_at: new Date().toISOString(),
  author_asserts_no_in_flight_writes: true,
  native_prepare: { performed_once_per_previously_absent_page: true, pages: [144, 145, 146, 147], dpi: 300 },
  context: observations.context,
  pages: observations.pages,
  author_native_observations: binding(checkPath),
  author_actual_pixel_reading: readScopes,
  counts: {
    physical_rows_including_footers: [16, 21, 26, 22],
    total_physical_rows_including_footers: 85,
    blocks: 34,
    original_written_tasks_on_these_pages: 5,
    original_task_numbers: ['3', '4', '5', '6', '7'],
    numbered_figures: ['fig-102', 'fig-103'],
    unnumbered_source_portraits: ['tbl-p0146-01'],
    footnote_printed_lines: 1,
  },
  boundaries: [
    { page: 144, incoming: 'Printed exercise8 from143; tasks3-7, no duplicate heading or ex cont', outgoing: 'Task7 complete; exercise8 ends before new part on145', figure_ownership: 'fig102 owner-ex7' },
    { page: 145, incoming: 'Second part heading; printed58 begins', outgoing_block: 'p0145#6', outgoing_kind: 'p open', last_text: '在自然界最小的系统——原子核中的粒子相互作用时，', footnote: 'p0145#7 independent explanatory footnote①; transparent to open/cont' },
    { page: 146, incoming_block: 'p0146#1', incoming_kind: 'p cont', continues: 'p0145#6', outgoing: 'Printed58 closes with我们的任务是掌握电磁相互作用的基本规律.', portrait_and_biography: 'One original unnumbered portrait, eight-row adjacent biography kept as independent prose' },
    { page: 147, incoming: '第八章h2 and printed59h3', within_page: 'p0147#4 open -> fig103 -> same-row caption -> p0147#7 cont; original atom paragraph preserved as one object', outgoing_block: 'p0147#10', outgoing_kind: 'p open', last_text: '有引力要大很多倍. **如果粒子具有这种相互作用本领，则就**', next_page_not_read_or_prepared: true },
  ],
  native_crop_author_observations: inventories.map(figure => ({
    id: figure.id, candidate: figure.candidate,
    exact_source_extraction_box: figure.exact_source_extraction_box,
    padding_px: figure.padding_px,
    all_source_owned_ink_observed_present: true,
    neighboring_prose_or_caption_observed_in_candidate: false,
    independent_review_status: 'not-performed',
  })),
  counting_boundary_notes: [
    { pdf_page: 144, edge_margin_px: 100, removed_native_band: [2151, 2188], reason: 'Actually observed bottom edge shadow; source text begins beyond edges; only counting copy changes' },
    { pdf_page: 146, edge_margin_px: 100, removed_native_band: [2151, 2189], reason: 'Actually observed bottom edge shadow; all text and portrait beyond edges; only counting copy changes' },
    { pdf_page: 145, counting_override: null },
    { pdf_page: 147, counting_override: null },
  ],
  source_reading_notes: [
    'PDF145 definition emphasis spans two physical rows without creating a new paragraph.',
    'PDF145失重段保留原印万有引力措辞，细部证据供独立读字；不登记作者科学修正。',
    'PDF146J/C和A/C初始字形按可见字形记录，Latin/Cyrillic同形不凭像素假称确定字母表。',
    'PDF147原图103只保留示意对象，不推原子种类、真实轨道或测量尺寸。',
    'PDF147尾字以单页实际细部确认为则就，不补未读148文字。',
  ],
  detail_evidence: [
    binding(path.join(out, 'evidence/0144-ex3-word-detail.png')),
    binding(path.join(out, 'evidence/0145-gravity-word-detail.png')),
    binding(path.join(out, 'evidence/0147-outgoing-word-detail.png')),
    binding(path.join(out, 'evidence/0147-basic-particle-emphasis-detail.png')),
  ],
  native_tools: observations.native_tools,
  profile: observations.profile,
  helpers: [observations.helper, binding(fileURLToPath(import.meta.url))],
  preservation: {
    source_pngs_and_crops_not_mutated: true,
    no_silent_source_science_or_historical_corrections: true,
    zero_invented_exercises_or_observations: true,
    no_new_formula_wraps_or_row_fitting: true,
    no_figure_crops_montage_or_multiple_source_pages_in_one_image: true,
    no_shared_tool_changes: true,
    D016_four_frozen_templates_untouched: true,
  },
  pending: ['Main-designated unique independent initial source fidelity/crop/boundary gate'],
  self_independent_approval: false,
  durable_writes_finalize_vectorize_assemble_science_browser_db_git_or_dependency_actions: [],
  in_flight_processes: 0,
};
fs.writeFileSync(freezePath, JSON.stringify(record, null, 2) + '\n');
console.log(JSON.stringify({
  freeze: binding(freezePath),
  pages: observations.pages.map(page => ({
    pdf_page: page.pdf_page, printed_page: page.printed_page,
    draft: page.draft, source: page.source,
    actual_rows: page.author_observed_printed_rows_including_footer,
    native_configured_rows: page.configured_native_count,
  })),
  status: record.status, in_flight_processes: 0,
}, null, 2));

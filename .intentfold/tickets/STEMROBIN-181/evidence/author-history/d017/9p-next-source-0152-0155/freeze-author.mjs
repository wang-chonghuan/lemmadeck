import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const out = path.dirname(fileURLToPath(import.meta.url));
const freeze = path.join(out, 'author-freeze.json');
const checkPath = path.join(out, 'author-check.json');
const beforeCheckPath = path.join(out, 'before-counting-metadata/author-check.json');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const binding = file => ({
  path: file,
  sha256: createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
});
const assertBindings = value => {
  if (!value || typeof value !== 'object') return;
  if (value.path && value.sha256) {
    assert.equal(binding(value.path).sha256, value.sha256, value.path);
  } else {
    for (const child of Object.values(value)) assertBindings(child);
  }
};
assert(!fs.existsSync(freeze), 'Do not overwrite frozen author evidence.');
const observations = read(checkPath);
const initial = read(beforeCheckPath);
assertBindings(observations);
const expected = [23, 27, 25, 25];
assert.deepEqual(observations.pages.map(page => page.pdf_page), [152, 153, 154, 155]);
for (const [index, page] of observations.pages.entries()) {
  assert.equal(page.author_observed_printed_rows_including_footer, expected[index]);
  assert.equal(page.draft_printed_rows, expected[index]);
  assert.equal(page.configured_native_count, expected[index]);
  for (const field of [
    'normalizations_needed', 'charset_findings', 'math_errors', 'math_warnings',
    'native_author_errors',
  ]) assert.deepEqual(page[field], []);
  assert.equal(page.source_png_and_ink_unchanged, true);
  const before = initial.pages[index];
  assert.deepEqual(page.source, before.source);
  assert.deepEqual(page.source_figures, before.source_figures);
  if ([153, 155].includes(page.pdf_page)) assert.deepEqual(page.draft, before.draft);
}
const metadataCheckCode = `
import json, sys
from pathlib import Path
root, out = map(Path, sys.argv[1:])
sys.path.insert(0, str(root / ".claude/skills/ld-s10y-lesson/tools"))
import blocks
checks = []
for page in (152, 154):
    name = f"{page:04d}.page.md"
    before = out / "before-counting-metadata" / name
    current = out / name
    old_meta, old_blocks = blocks.load(before)
    new_meta, new_blocks = blocks.load(current)
    counting = new_meta.pop("counting")
    assert counting["edge_margin_px"] == 100 and counting["reason"].strip()
    assert old_meta == new_meta and old_blocks == new_blocks
    assert before.read_bytes().split(b"---", 2)[2] == current.read_bytes().split(b"---", 2)[2]
    checks.append({
        "pdf_page": page, "only_added_counting_metadata": True,
        "raw_body_bytes_identical": True, "parsed_blocks_deep_equal": True,
        "counting": counting
    })
print(json.dumps(checks, ensure_ascii=False))
`;
const metadataChecks = JSON.parse(execFileSync(
  path.join(root, '.claude/skills/ld-s10y-lesson/.venv/bin/python'),
  ['-c', metadataCheckCode, root, out], { encoding: 'utf8' },
));
const figures = observations.pages.flatMap(page => page.source_figures);
assert.deepEqual(figures.map(figure => figure.id), ['tbl-p0153-01', 'fig-106', 'fig-107']);
assert.equal(observations.pages.reduce((total, page) => total + page.blocks, 0), 41);
assert.equal(observations.pages.flatMap(page => page.block_inventory).some(block => block.kind === 'ex'), false);
const record = {
  ticket: 'STEMROBIN-181',
  role: 'faithful-source-author-only',
  status: 'frozen-pending-unique-independent-initial-source-gate',
  created_at: new Date().toISOString(),
  scope: { book: '9p', pdf_pages: [152, 153, 154, 155], printed_pages: [143, 144, 145, 146] },
  author_asserts_no_in_flight_writes: true,
  native_prepare: { pages: [152, 153, 154, 155], dpi: 300, run_once_per_previously_absent_page: true },
  context: observations.context,
  pages: observations.pages,
  counts: {
    actual_physical_rows_including_footer: expected,
    draft_rows_including_footer: expected,
    configured_native_counts: expected,
    total_actual_rows_including_footer: 100,
    blocks: 41,
    original_written_tasks: 0,
    numbered_figures: ['fig-106', 'fig-107'],
    unnumbered_figures: ['tbl-p0153-01'],
    tables: 0,
    footnote_printed_lines: 8,
  },
  source_boundaries: [
    {
      pdf_page: 152,
      incoming: { from: 'p0151#9', previous_terminal_text: '橡皮手', block: 'p0152#1', kind: 'p cont', first_text: '套，预防带电的纸和手之间放电.' },
      source60_closed: true,
      source61: { heading: 'p0152#2', title: '61. 电荷守恒定律', complete: true, last_body: 'p0152#7', footnote: 'p0152#10', marker_owner: 'p0152#6' },
      source62: { heading: 'p0152#8', title: '62. 静电学的基本定律——库仑定律' },
      outgoing: { block: 'p0152#9', kind: 'p open', terminal_text: '我们首先讨' },
    },
    {
      pdf_page: 153,
      incoming: { from: 'p0152#9', block: 'p0153#1', kind: 'p cont', first_text: '论当带电体处于静止时这种最' },
      source_unit: 62,
      portrait: { block: 'p0153#2', id: 'tbl-p0153-01', internal_label_not_printed_number: '库仑像', caption: 'p0153#4', caption_rows: 6, caption_samerow_with: 'p0153#3 first six printed rows' },
      footnotes: [
        { block: 'p0153#6', marker: '①', owner: 'p0153#1', physical_rows: 4 },
        { block: 'p0153#7', marker: '②', owner: 'p0153#3', physical_rows: 3 },
      ],
      outgoing: { block: 'p0153#5', complete: true, next_page_starts_new_paragraph: true },
    },
    {
      pdf_page: 154,
      source_unit: 62,
      within_page: { from: 'p0154#1 p open', figure: 'p0154#2 fig106', to: 'p0154#3 p cont', caption: 'p0154#4 cap samerow', same_original_apparatus_paragraph: true },
      outgoing_formula: { block: 'p0154#8', label: '(8-2)', complete: true, explanation_on_next_page: 'p0155#1' },
    },
    {
      pdf_page: 155,
      incoming: { block: 'p0155#1', kind: 'p', role: 'Post-formula explanation of k; no cut math token.' },
      within_page: { from: 'p0155#4 p open', figure: 'p0155#5 fig107', caption: 'p0155#6 cap samerow', to: 'p0155#7 p cont', same_original_direction_paragraph: true },
      source62_closed: { last_block: 'p0155#8', terminal_text: '本粒子有电荷，就表示它们按照库仑定律彼此相互作用.' },
      source63: { heading: 'p0155#9', title: '63. 电量的单位', complete: false },
      outgoing: { block: 'p0155#12', kind: 'p open', terminal_text: '人们这样地选取电量单位，使', next_page_not_prepared_or_read: true },
    },
  ],
  author_actual_pixel_reading: observations.pages.map(page => ({
    pdf_page: page.pdf_page,
    full_resolution_page_and_grid_read_separately: true,
    actual_rows_including_footer: page.author_observed_printed_rows_including_footer,
    candidate_ids_actually_viewed: page.source_figures.map(figure => figure.id),
  })),
  source_crop_author_observations: figures.map(figure => ({
    ...figure,
    native_candidate_and_36px_prospective_margin_actually_viewed: true,
    full_source_owned_ink_observed_present: true,
    neighboring_prose_or_caption_observed_in_default_candidate: false,
    byte_identical_after_counting_metadata: true,
    independent_review: 'not-performed',
  })),
  uncertainty_notes: [
    {
      pdf_page: 153, block: 'p0153#4',
      issue: 'Printed C/A name initials have indistinguishable Latin/Cyrillic glyphs.',
      retained_glyphs: 'C. A.', codepoint_certification: 'unresolved; Latin transcription declared, not a modernization or invented reading',
    },
    {
      pdf_page: 154, figure: 'fig-106',
      issue: 'Small apparatus labels and overlapping marks do not certify exact geometric positions or tick count.',
      treatment: 'Original ink retained wholly; apparatus relationships declared only from explicit original prose.',
    },
  ],
  author_targeted_correction: {
    rounds: 1,
    scope: 'Only added counting.edge_margin_px:100/reason on152/154 after actual side/bottom-shadow inspection.',
    native_checks: metadataChecks,
    before_drafts: [152, 154].map(page => binding(path.join(out, `before-counting-metadata/${String(page).padStart(4, '0')}.page.md`))),
    initial_native_observations: binding(beforeCheckPath),
    current_native_observations: binding(checkPath),
    source_image_rough_boxes_all_body_math_and_candidate_pixels_unchanged: true,
  },
  detail_evidence: [
    '0153-footnotes-detail.png', '0152-bottom-shadow-detail.png', '0154-right-shadow-detail.png',
  ].map(name => binding(path.join(out, 'evidence', name))),
  mechanical_author_checks: { status: 'pass', note: 'Native normalization/charset/math/count observations only, not SCI or independent fidelity approval.' },
  preservation: {
    source_scientific_or_historical_claims_and_printed_errors_not_corrected: true,
    source_pngs_unmodified: true,
    no_invented_tasks_words_measurements_or_missing_glyphs: true,
    no_row_fitting_empty_lines_or_fabricated_wrap: true,
    previous148_151_and_t4_passed_evidence_not_repeated_or_edited: true,
    no_multi_page_montage: true,
    no_shared_tool_or_durable_source_edits: true,
  },
  native_tools: observations.native_tools,
  profile: observations.profile,
  helpers: [observations.helper, binding(fileURLToPath(import.meta.url))],
  pending: [
    'Unique independent initial source fidelity/row/crop/footnote/boundary gate.',
    'Source63 remains incomplete until outgoing paragraph and remaining source arrive.',
  ],
  self_independent_approval: false,
  finalize_vectorize_assemble_science_browser_db_git_dependencies_or_durable_writes: [],
  in_flight_processes: 0,
};
fs.writeFileSync(freeze, JSON.stringify(record, null, 2) + '\n');
console.log(JSON.stringify({
  freeze: binding(freeze),
  status: record.status,
  counts: record.counts,
  drafts: observations.pages.map(page => ({ pdf_page: page.pdf_page, draft: page.draft })),
  complete_source_units: [60, 61, 62],
  outgoing_source63_open: true,
  in_flight_processes: 0,
}, null, 2));

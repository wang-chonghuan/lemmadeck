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
const expected = [25, 23, 24, 23];
assert.deepEqual(observations.pages.map(page => page.pdf_page), [156, 157, 158, 159]);
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
  if ([157, 159].includes(page.pdf_page)) assert.deepEqual(page.draft, before.draft);
}
const metadataCheckCode = `
import json, sys
from pathlib import Path
root, out = map(Path, sys.argv[1:])
sys.path.insert(0, str(root / ".claude/skills/ld-s10y-lesson/tools"))
import blocks
checks = []
for page in (156, 158):
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
const inventory = observations.pages.flatMap(page => page.block_inventory);
assert.deepEqual(figures.map(figure => figure.id), ['fig-108']);
assert.equal(observations.pages.reduce((total, page) => total + page.blocks, 0), 52);
assert.equal(inventory.some(block => ['ex', 'exhead'].includes(block.kind)), false);
assert.equal(inventory.find(block => block.ref === 'p0156#1').cont, true);
assert.equal(inventory.find(block => block.ref === 'p0158#1').kind, 'h3');
assert.equal(inventory.find(block => block.ref === 'p0159#12').samerow, true);
assert.equal(inventory.find(block => block.ref === 'p0159#13').open, true);
const pdf = binding(path.join(root, 'ssot-resources/soviet10year-textbooks/sources/soviet10years/9p 苏联中学课本 物理 九年级.pdf'));
assert.equal(pdf.sha256, 'df0ea9c3417b7ba0166872b33a8ec81ef20cfb9e15b512a44993174fe92162c0');
const record = {
  ticket: 'STEMROBIN-181',
  role: 'faithful-source-author-only',
  status: 'frozen-pending-unique-independent-initial-source-gate',
  created_at: new Date().toISOString(),
  scope: { book: '9p', pdf_pages: [156, 157, 158, 159], printed_pages: [147, 148, 149, 150] },
  author_asserts_no_in_flight_writes: true,
  native_prepare: { pages: [156, 157, 158, 159], dpi: 300, run_once_per_previously_absent_page: true },
  context: { ...observations.context, pdf },
  pages: observations.pages,
  counts: {
    actual_physical_rows_including_footer: expected,
    draft_rows_including_footer: expected,
    configured_native_counts: expected,
    total_actual_rows_including_footer: 95,
    blocks: 52,
    original_written_tasks: 0,
    worked_examples_in_prose: 3,
    numbered_figures: ['fig-108'],
    unnumbered_figures: [],
    tables: 0,
    footnote_printed_lines: 0,
    footer_rows: 4,
    math_fragments: observations.pages.map(page => page.math_fragments),
  },
  source_boundaries: [
    {
      pdf_page: 156,
      source_unit: 63,
      lesson_id: 'phy9-c2-s2-n63',
      incoming: {
        from: 'p0155#12', previous_terminal_text: '人们这样地选取电量单位，使',
        block: 'p0156#1', kind: 'p cont', first_text: '得公式(8-2)中的系数',
      },
      outgoing: {
        block: 'p0156#8', complete_paragraph: true,
        terminal_text: '泡中，当电压为127 伏特时，其电流比1 安培稍小一点.',
      },
      source_unit_complete: false,
    },
    {
      pdf_page: 157,
      source_unit: 63,
      lesson_id: 'phy9-c2-s2-n63',
      incoming: { block: 'p0157#1', kind: 'p', new_paragraph_not_cut_continuation: true },
      source63_closed: {
        last_block: 'p0157#16', last_formula_label: '(8-8)',
        next_heading: 'p0158#1', complete: true,
      },
    },
    {
      pdf_page: 158,
      source_unit: 64,
      lesson_id: 'phy9-c2-s2-n64',
      heading: { block: 'p0158#1', title: '64. 在均匀电介质内部静电荷的相互作用' },
      outgoing: {
        block: 'p0158#11', complete_paragraph: true,
        terminal_text: '在书末附表中，列举了一些物质介电常数的数值.',
        following_worked_examples_belong_to_same_unit: true,
      },
      table_reference_only_no_printed_table_on_page: true,
      source_unit_complete: false,
    },
    {
      pdf_page: 159,
      source_unit: 64,
      lesson_id: 'phy9-c2-s2-n64',
      worked_examples: {
        heading: 'p0159#1', kind: 'p', printed_heading: '例题',
        example1: { question: 'p0159#2', solution: 'p0159#3', complete: true },
        example2: { question: 'p0159#4', solution: ['p0159#5', 'p0159#6', 'p0159#7'], complete: true },
        example3: { question: 'p0159#8', solution: ['p0159#9', 'p0159#10', 'p0159#13'], question_complete: true, solution_complete: false },
        original_written_tasks: 0,
      },
      figure108: {
        block: 'p0159#11', caption: 'p0159#12',
        caption_samerow_with: 'p0159#10 last printed row量相平衡：',
        reference_owner: 'p0159#9',
      },
      outgoing: {
        block: 'p0159#13', kind: 'p open',
        terminal_text: '$F-F_{\\text{弹}}\\sin\\alpha=0$.',
        printed_formula_complete: true, example3_solution_incomplete: true,
        next_page_not_prepared_or_read: true,
        next_page_actual_continuation_must_be_verified: true,
      },
      source_unit_complete: false,
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
    caption_visible_only_in_larger_prospective_margin: true,
    byte_identical_after_counting_metadata: true,
    independent_review: 'not-performed',
  })),
  source_error_and_uncertainty_notes: [
    {
      pdf_page: 156, block: 'p0156#6', original_reading: '电波为1 安培时',
      issue: 'Magnified actual pixels read电波, despite电流 context.',
      treatment: 'Preserved exactly as printed; no source correction or modern SCI.',
      detail_evidence: binding(path.join(out, 'evidence/0156-current-word-detail.png')),
    },
    {
      pdf_page: 157, block: 'p0157#14', formula_label: '(8-7)',
      issue: 'First line prints库仑 squared; second line prints库仑 without the square.',
      treatment: 'Preserved both printed units; one native wrap denotes the actual two physical formula rows, not row fitting.',
      detail_evidence: binding(path.join(out, 'evidence/0157-permittivity-units-detail.png')),
    },
    {
      pdf_page: 158, blocks: ['p0158#2', 'p0158#3', 'p0158#10'],
      issue: 'Printed dielectric claims are scientifically broad or conditional.',
      treatment: 'Raw wording preserved; no scientific modernization or errata authored.',
    },
    {
      pdf_page: 159, figure: 'fig-108',
      issue: 'Some original arrow/line marks overlap and diagram positions are schematic.',
      treatment: 'Whole source ink retained; no extra measurement, angle or force magnitude inferred.',
    },
  ],
  author_targeted_correction: {
    rounds: 1,
    scope: 'Only counting.edge_margin_px:100/reason added on156/158 after actual side/bottom-shadow inspection.',
    native_checks: metadataChecks,
    before_drafts: [156, 158].map(page => binding(path.join(out, `before-counting-metadata/${String(page).padStart(4, '0')}.page.md`))),
    initial_native_observations: binding(beforeCheckPath),
    current_native_observations: binding(checkPath),
    source_image_rough_boxes_all_body_math_and_candidate_pixels_unchanged: true,
  },
  detail_evidence: [
    '0156-current-word-detail.png', '0157-permittivity-units-detail.png',
    '0159-example-text-detail.png', '0156-bottom-shadow-detail.png',
    '0156-right-edge-detail.png', '0158-bottom-shadow-detail.png', '0158-right-edge-detail.png',
  ].map(name => binding(path.join(out, 'evidence', name))),
  mechanical_author_checks: { status: 'pass', note: 'Native normalization/charset/math/count observations only, not SCI or independent fidelity approval.' },
  preservation: {
    source_scientific_or_historical_claims_and_printed_errors_not_corrected: true,
    source_pngs_unmodified: true,
    no_invented_tasks_words_measurements_or_missing_glyphs: true,
    no_row_fitting_empty_lines_or_fabricated_wrap: true,
    previous152_155_passed_evidence_not_repeated_or_edited: true,
    no_multi_page_montage: true,
    no_shared_tool_or_durable_source_edits: true,
  },
  native_tools: observations.native_tools,
  profile: observations.profile,
  helpers: [observations.helper, binding(fileURLToPath(import.meta.url))],
  pending: [
    'Unique independent initial source fidelity/row/crop/boundary gate.',
    'Source64 remains incomplete because example3 solution continues160.',
    'Any future modern SCI must assess retained printed wording/unit errors separately.',
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
  complete_source_units: [63],
  outgoing_source64_example3_open: true,
  in_flight_processes: 0,
}, null, 2));

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const out = path.dirname(fileURLToPath(import.meta.url));
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const binding = file => ({
  path: file,
  sha256: createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
});
const assertBindings = value => {
  if (!value || typeof value !== 'object') return;
  if (value.path && value.sha256) assert.equal(binding(value.path).sha256, value.sha256, value.path);
  else for (const child of Object.values(value)) assertBindings(child);
};
const fileInventory = directory => fs.readdirSync(directory, { withFileTypes: true })
  .sort((a, b) => a.name.localeCompare(b.name))
  .flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? fileInventory(file) : [binding(file)];
  });
const freezePath = path.join(out, 'author-freeze.json');
assert(!fs.existsSync(freezePath), 'Do not overwrite frozen author evidence');
const checkPath = path.join(out, 'author-check.json');
const initialPath = path.join(out, 'before-counting-metadata/author-check.json');
assert.equal(binding(initialPath).sha256, '836bb7f16cd34b17591a5f40e671984266fe1763230f5015d0fb737ba1ad2bc5');
const current = read(checkPath);
const initial = read(initialPath);
assertBindings(current);
const expectedPages = [164, 165, 166, 167];
const expectedRows = [26, 21, 25, 26];
assert.deepEqual(current.pages.map(page => page.pdf_page), expectedPages);
assert.deepEqual(current.native_tools, initial.native_tools);
assert.deepEqual(current.helper, initial.helper);
assert.deepEqual(current.context, initial.context);
assert.deepEqual(current.detail_evidence, initial.detail_evidence);
const metadataChecks = current.pages.map((page, index) => {
  const beforePath = path.join(out, 'before-counting-metadata', `${page.pdf_page.toString().padStart(4, '0')}.page.md`);
  const old = initial.pages[index];
  assert.equal(binding(beforePath).sha256, old.draft.sha256);
  assert.equal(page.author_observed_printed_rows_including_footer, expectedRows[index]);
  assert.equal(page.draft_printed_rows, expectedRows[index]);
  assert.equal(page.configured_native_count, expectedRows[index]);
  assert.equal(page.source_png_and_ink_unchanged, true);
  for (const field of [
    'normalizations_needed', 'charset_findings', 'math_errors', 'math_warnings', 'native_author_errors',
  ]) assert.deepEqual(page[field], []);
  for (const field of [
    'source', 'grid', 'prepare_layout', 'prepare_template', 'source_figures',
    'masked_default_bands_evidence', 'default_native_bands', 'default_native_count', 'block_inventory',
  ]) assert.deepEqual(page[field], old[field]);
  const beforeParts = fs.readFileSync(beforePath, 'utf8').split('---');
  const afterParts = fs.readFileSync(page.draft.path, 'utf8').split('---');
  const beforeMeta = JSON.parse(beforeParts[1]);
  const afterMeta = JSON.parse(afterParts[1]);
  assert.equal(afterParts.slice(2).join('---'), beforeParts.slice(2).join('---'));
  if (page.pdf_page !== 167) {
    assert.equal(afterMeta.counting.edge_margin_px, 100);
    assert(afterMeta.counting.reason.trim());
    assert.deepEqual(Object.keys(afterMeta.counting).sort(), ['edge_margin_px', 'reason']);
    delete afterMeta.counting;
    assert.deepEqual(afterMeta, beforeMeta);
  } else {
    assert.equal(page.draft.sha256, old.draft.sha256);
    assert.equal(page.counting, null);
  }
  return {
    pdf_page: page.pdf_page, before: binding(beforePath), counting: page.counting,
    raw_body_bytes_identical: true, all_source_words_math_emphasis_rows_blocks_flags_order_and_geometry_unchanged: true,
    entire_draft_byte_identical: page.pdf_page === 167,
  };
});
assert.equal(binding(path.join(out, 'before-counting-metadata/author-check.py')).sha256, current.helper.sha256);
const allBlocks = current.pages.flatMap(page => page.block_inventory);
const figures = current.pages.flatMap(page => page.source_figures);
const block = ref => {
  const result = allBlocks.find(item => item.ref === ref);
  assert(result, ref);
  return result;
};
assert.equal(allBlocks.length, 36);
assert.equal(allBlocks.filter(item => item.kind === 'ex').length, 0);
assert.deepEqual(figures.map(figure => figure.id), ['fig-110', 'tbl-p0165-01', 'fig-111', 'fig-112']);
assert.equal(block('p0164#1').cont, false);
assert.equal(block('p0164#1').open, true);
assert.equal(block('p0164#3').cont, true);
assert.equal(block('p0164#3').open, true);
assert.equal(block('p0164#4').samerow, true);
assert.equal(block('p0164#5').cont, true);
assert.equal(block('p0164#5').open, false);
assert.equal(block('p0164#8').open, true);
assert.equal(block('p0165#1').cont, true);
assert.equal(block('p0165#1').open, false);
assert.equal(block('p0165#2').kind, 'h3');
assert.equal(block('p0165#2').text, '66. 电场');
assert.equal(block('p0165#5').physical_rows, 12);
assert.equal(block('p0165#6').open, true);
assert.equal(block('p0165#10').samerow, true);
assert.equal(block('p0166#1').cont, true);
assert.equal(block('p0166#8').open, false);
assert.equal(block('p0167#1').cont, false);
assert.equal(block('p0167#5').open, true);
assert.equal(block('p0167#6').footnote, true);
assert.equal(block('p0167#6').physical_rows, 3);
assert.equal(allBlocks.filter(item => item.footnote).length, 1);
assert(block('p0167#1').text.endsWith('①.'));
assert(block('p0167#6').text.startsWith('① '));
assert(block('p0166#6').text.includes('$t=\\frac{AB}{C}$'));
assert(block('p0166#7').text.includes('$c$'));
assert(block('p0167#6').text.includes('300000 千米.秒'));
const incomingText = fs.readFileSync(current.context.incoming163_text_only.path, 'utf8');
assert(incomingText.includes(current.context.incoming_terminal_text));
const pdf = binding(path.join(root, 'ssot-resources/soviet10year-textbooks/sources/soviet10years/9p 苏联中学课本 物理 九年级.pdf'));
assert.equal(pdf.sha256, 'df0ea9c3417b7ba0166872b33a8ec81ef20cfb9e15b512a44993174fe92162c0');
const supplementalDetails = [
  {
    pdf_page: 165, id: '0165-left-edge-detail',
    box: [0, 0, 100, 2289], expected_sha256: '7fec42d9fdf4c576399fe52754fda6b21e2690c3d8f63c04342719864ced97e1',
  },
  {
    pdf_page: 165, id: '0165-right-edge-detail',
    box: [1404, 0, 100, 2289], expected_sha256: '184afe1cfd159463c0b1d5ba6cbc7bcc5096c914b63df4b4e05d71c9381e5823',
  },
].map(({ expected_sha256, ...item }) => {
  const image = binding(path.join(out, 'evidence', `${item.id}.png`));
  assert.equal(image.sha256, expected_sha256);
  return {
    ...item, source: current.pages.find(page => page.pdf_page === item.pdf_page).source,
    padding_px: 0, exact_source_extraction_box: item.box, image,
    native_generation: 'layout.crop(source, box, target, pad=0); generated once after initial author-check',
  };
});
const detailObservations = {
  '0164-bottom-shadow-detail': 'Only scan corner shadows below the actual footer; extra default band2147..2182 is not a printed row.',
  '0164-left-edge-detail': 'Left100px full height shows scan line/specks and bottom shadow only, no readable page-owned text, figure, caption or footer.',
  '0164-right-edge-detail': 'Right100px full height shows scan edge specks and corner shadow only, no readable page-owned text, figure, caption or footer.',
  '0165-left-edge-detail': 'Left100px full height shows specks/edge traces only; no readable page-owned text, caption, footer or figure.',
  '0165-right-edge-detail': 'Right100px full height shows scan spots and a rectangular/vertical marginal ink fragment; extra default band1640..1664 is not prose or bottom shadow.',
  '0165-figure111-right-label-detail': 'Right-hand label retains separate upper marks and a lower curved fragment; a complete glyph cannot be reliably read. No B reconstructed from166 prose.',
  '0166-equation-case-detail': 'Actual equation denominator is uppercaseC; AB numerator, t, equals sign and following comma preserved.',
  '0166-c-definition-detail': 'Actual explanatory symbol is lowercasec and source numeric speed is300000千米/秒; preserved separately from uppercaseC in the equation.',
  '0166-bottom-shadow-detail': 'Below the footer only corner scan shadows/specks remain; extra default band2125..2189 is not a printed row.',
  '0166-left-edge-detail': 'Left100px full height includes spine line, marginal rectangular ink, specks and bottom shadow, not readable page-owned text or footer.',
  '0166-right-edge-detail': 'Right100px full height contains specks and corner shadow only; no readable page-owned text or footer.',
  '0167-footnote-detail': 'Three actual small-print footnote rows. The separator between千米 and秒 is point-like, without a clear slash; baseline period versus centered dot remains uncertain.',
};
const details = [...current.detail_evidence, ...supplementalDetails];
assert.deepEqual(Object.keys(detailObservations).sort(), details.map(item => item.id).sort());
const record = {
  ticket: 'STEMROBIN-181', invocation: 'D018', author: 'Einstein',
  role: 'faithful-source-author-only',
  status: 'frozen-with-unresolved-source-glyphs-pending-main-unique-independent-initial-source-gate',
  created_at: new Date().toISOString(),
  scope: { book: '9p', pdf_pages: expectedPages, printed_pages: [155, 156, 157, 158], scratch_only: true },
  native_prepare: {
    pages: expectedPages, dpi: 300, once_per_previously_absent_page: true,
    original_and_grid_read_one_page_at_a_time: true, prepare_not_repeated_on_resume: true,
    command: '.claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py prepare --book 9p --page <page>',
  },
  context: {
    ...current.context, pdf,
    prior160_163_freeze: binding(path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/9p-next-source-0160-0163/author-freeze.json')),
    previous_frozen_drafts_unmodified_by_this_author: true,
  },
  pages: current.pages,
  counts: {
    actual_physical_rows_including_footer: expectedRows,
    draft_rows_including_footer: current.pages.map(page => page.draft_printed_rows),
    configured_native_counts: current.pages.map(page => page.configured_native_count),
    default_native_counts_after_masking_figures: current.pages.map(page => page.default_native_count),
    total_actual_rows_including_footer: expectedRows.reduce((sum, value) => sum + value, 0),
    blocks: allBlocks.length, original_written_tasks: allBlocks.filter(item => item.kind === 'ex').length,
    numbered_figures: figures.filter(figure => /^fig-/.test(figure.id)).map(figure => figure.id),
    unnumbered_figures: figures.filter(figure => !/^fig-/.test(figure.id)).map(figure => figure.id),
    tables: 0, captions: allBlocks.filter(item => item.kind === 'cap').length,
    footer_rows: allBlocks.filter(item => item.kind === 'foot').reduce((sum, item) => sum + item.physical_rows, 0),
    footnote_printed_lines: allBlocks.filter(item => item.footnote).reduce((sum, item) => sum + item.physical_rows, 0),
    portrait_caption_printed_rows: block('p0165#5').physical_rows,
    math_fragments: current.pages.map(page => page.math_fragments),
    registered_confirmed_math_print_errata: 0,
  },
  source_boundaries: [
    {
      pdf_page: 164, source_unit: 65, lesson_id: 'phy9-c2-s2-n65',
      incoming_paragraph_on163_complete: true, first_block: 'p0164#1', first_block_not_cont: true,
      internal_continuation: {
        open: 'p0164#1', figure: 'p0164#2', cont_open: 'p0164#3', caption: 'p0164#4', cont_close: 'p0164#5',
        figure_id: 'fig-110', caption_same_physical_row_as_prose: true,
      },
      outgoing: { block: 'p0164#8', kind: 'p open', terminal_text: '首先应当是求力的数学表达', to: 'p0165#1' },
      source_unit_complete: false,
    },
    {
      pdf_page: 165,
      source65_closed: { incoming: 'p0165#1', from: 'p0164#8', terminal_text: '式，而后才可能解释它们的本质.', before_heading: 'p0165#2' },
      source_unit: 66, lesson_id: 'phy9-c2-s2-n66', heading: { block: 'p0165#2', printed_title: '66. 电场' },
      portrait: { block: 'p0165#4', id: 'tbl-p0165-01', caption: 'p0165#5', caption_printed_rows: 12, table: false },
      figure111: { block: 'p0165#7', caption: 'p0165#9' },
      figure112: { block: 'p0165#8', caption: 'p0165#10', same_row_as_figure111_caption: true },
      outgoing: { block: 'p0165#6', kind: 'p open', terminal_text: '作用在另', to: 'p0166#1', transparent_figures_captions_footer: true },
      source_unit_complete: false,
    },
    {
      pdf_page: 166, source_unit: 66, lesson_id: 'phy9-c2-s2-n66',
      incoming: { block: 'p0166#1', kind: 'p cont', from: 'p0165#6', first_text: '一个电荷B上的力立即改变大小.' },
      source_formula: { block: 'p0166#6', raw: '$t=\\frac{AB}{C}$', printed_number: '(8-10)', explanatory_symbol: '$c$', case_difference_preserved: true },
      outgoing: { block: 'p0166#8', open: false, complete_paragraph: true, next167_starts_new_paragraph: true },
      source_unit_complete: false,
    },
    {
      pdf_page: 167, source_unit: 66, lesson_id: 'phy9-c2-s2-n66',
      first_block: 'p0167#1', first_block_not_cont: true,
      footnote: { block: 'p0167#6', marker: '①', reference_owner: 'p0167#1', source_unit: 66, printed_rows: 3, transparent_to_open_cont: true },
      outgoing: { block: 'p0167#5', kind: 'p open', terminal_text: '这些性质不同于周围世界其他', next_page168_not_prepared_or_read: true },
      source_unit_complete: false,
    },
  ],
  author_actual_pixel_reading: current.pages.map(page => ({
    pdf_page: page.pdf_page,
    original: { ...page.source, actuallyOpened: true, detail: 'original' },
    grid: { ...page.grid, actuallyOpened: true, detail: 'original' },
    masked_default_bands: { ...page.masked_default_bands_evidence, actuallyOpened: true, detail: 'original' },
    original_and_grid_opened_separately: true,
    actual_rows_including_footer: page.author_observed_printed_rows_including_footer,
    same_byte_openings_reused_after_metadata_only_correction: true,
  })),
  source_crop_author_observations: figures.map(figure => ({
    ...figure,
    candidate: { ...figure.candidate, actuallyOpened: true, detail: 'original' },
    prospective_margin: { ...figure.prospective_margin, actuallyOpened: true, detail: 'original' },
    full_available_source_owned_ink_observed_present: true,
    neighboring_prose_or_caption_observed_in_12px_candidate: false,
    larger_36px_margin_observation: figure.id === 'fig-110'
      ? 'Upper neighboring prose fragments and lower caption visible; not adopted as candidate.'
      : 'No neighboring prose or caption observed in the prospective margin.',
    candidate_and_margin_bytes_identical_after_counting_metadata_correction: true,
    author_crop_repairs: 0, independent_review: 'not-performed',
  })),
  detail_evidence: details.map(item => ({
    ...item, image: { ...item.image, actuallyOpened: true, detail: 'original' },
    concrete_observation: detailObservations[item.id],
    opening_reused_from_before_resume: item.id === '0167-footnote-detail',
    bytes_unchanged_after_counting_metadata_correction: true,
  })),
  author_targeted_correction: {
    rounds: 1, scope: 'Counting-only edge100/reason on164/165/166; no body or source pixel edits;167 untouched.',
    before_drafts: metadataChecks.map(item => item.before),
    initial_native_observations: binding(initialPath), current_native_observations: binding(checkPath),
    before_helper: binding(path.join(out, 'before-counting-metadata/author-check.py')),
    checks: metadataChecks, one_author_native_check_before_and_one_after_metadata_correction: true,
    source_grid_default_band_evidence_all_figure_crops_byte_identical: true,
    no_independent_gate_or_repeated_prepare: true,
    historical_preliminary_notes_retained: '164/166 notes about suspected default overcounts are earlier observations; counting.reason records the completed actual edge evidence.',
  },
  source_error_and_uncertainty_notes: [
    {
      pdf_page: 165, figure: 'fig-111', classification: 'unresolved-source-glyph',
      issue: 'Right-hand printed label is partly missing; exact glyph cannot be established from actual source ink.',
      treatment: 'Retain every actual pixel; do not fill in B using166 prose.',
      detail_evidence: details.find(item => item.id === '0165-figure111-right-label-detail').image,
    },
    {
      pdf_page: 166, block: 'p0166#6', classification: 'source-symbol-case-inconsistency-preserved',
      issue: 'Printed equation denominator uppercaseC, explanatory prose lowercasec.',
      treatment: 'Preserve both source forms; no numerical printing erratum or SCI correction inferred.',
      detail_evidence: details.filter(item => ['0166-equation-case-detail', '0166-c-definition-detail'].includes(item.id)).map(item => item.image),
    },
    {
      pdf_page: 167, block: 'p0167#6', classification: 'unresolved-source-separator-typography',
      issue: 'Point-like separator between千米 and秒 lacks a clear slash; exact baseline period versus centered dot remains uncertain.',
      provisional_draft_reading: '300000 千米.秒',
      treatment: 'Explicit provisional reading only; retain actual detail PNG and do not silently normalize to a speed unit slash.',
      detail_evidence: details.find(item => item.id === '0167-footnote-detail').image,
    },
    {
      pdf_pages: expectedPages, classification: 'historical-and-scientific-source-claims-preserved',
      issue: 'Broad distance-action, field composition and historical claims, including original4分多钟 and引力场脚注, may require modern qualifications later.',
      treatment: 'Source author does not assess or modernize these claims, wording, historical names or numeric data.',
    },
  ],
  unresolved_findings: [
    'Fig111 damaged right label: exact source glyph unresolved; actual ink faithfully retained, no reconstruction.',
    '167 footnote unit separator: provisional千米.秒; baseline period versus centered dot unresolved, no clear slash.',
    'Source66 remains incomplete, with p0167#5 open into168; no complete-unit claim or downstream integration authorized.',
    'Main unique independent source fidelity/count/crop/boundary gate pending; author has not approved it.',
  ],
  mechanical_author_checks: {
    status: 'native-author-parse-normalize-charset-math-and-configured-row-checks-have-no-mechanical-findings',
    source_scientific_correctness_not_assessed: true, not_independent_fidelity_approval: true,
  },
  preservation: {
    source_scientific_historical_wording_and_numeric_data_preserved: true,
    no_confirmed_math_print_error_found_no_erratum_invented: true,
    no_row_fitting_empty_lines_or_fabricated_wrap: true,
    source_pngs_and_grids_unmodified: true, previous163_pixels_not_opened: true,
    previous160_163_frozen_files_not_edited: true, no_modern_artifact_revisited_or_edited: true,
    no_multi_page_montage_new_ocr_or_shared_tool_edits: true,
  },
  native_tools: current.native_tools, lesson_skill: current.lesson_skill, profile: current.profile,
  reference_helpers_read_only: current.reference_helpers_read_only,
  helpers: [current.helper, binding(fileURLToPath(import.meta.url))],
  candidate_and_detail_file_inventory: [
    ...fileInventory(path.join(out, 'candidate-figures')), ...fileInventory(path.join(out, 'evidence')),
  ],
  self_independent_approval: false,
  source_finalize_assemble_vectorize_modern_science_browser_db_git_dependencies_or_durable_writes: [],
  author_asserts_no_in_flight_writes: true, in_flight_processes: 0,
};
assertBindings(record);
fs.writeFileSync(freezePath, JSON.stringify(record, null, 2) + '\n');
console.log(JSON.stringify({
  freeze: binding(freezePath), status: record.status, counts: record.counts,
  drafts: current.pages.map(page => ({ pdf_page: page.pdf_page, draft: page.draft })),
  source65_closed_structural_only: true, source66_still_incomplete: true,
  source_glyph_blockers: record.unresolved_findings.slice(0, 2), in_flight_processes: 0,
}, null, 2));

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
const freeze = path.join(out, 'author-freeze.json');
assert(!fs.existsSync(freeze), 'Do not overwrite frozen author evidence');
const checkPath = path.join(out, 'author-check.json');
const initialPath = path.join(out, 'before-author-correction/author-check.json');
const current = read(checkPath);
const initial = read(initialPath);
assertBindings(current);
const expectedPages = [160, 161, 162, 163];
const expectedRows = [20, 25, 27, 26];
assert.deepEqual(current.pages.map(page => page.pdf_page), expectedPages);
assert.deepEqual(current.native_tools, initial.native_tools);
assert.deepEqual(current.helper, initial.helper);
assert.deepEqual(current.detail_evidence, initial.detail_evidence);
const metadataChecks = [];
for (const [index, page] of current.pages.entries()) {
  assert.equal(page.author_observed_printed_rows_including_footer, expectedRows[index]);
  assert.equal(page.draft_printed_rows, expectedRows[index]);
  assert.equal(page.configured_native_count, expectedRows[index]);
  for (const field of [
    'normalizations_needed', 'charset_findings', 'math_errors',
    'math_warnings', 'native_author_errors',
  ]) assert.deepEqual(page[field], []);
  assert.equal(page.source_png_and_ink_unchanged, true);
  const old = initial.pages[index];
  for (const field of [
    'source', 'grid', 'prepare_layout', 'prepare_template',
    'source_figures', 'masked_default_bands_evidence',
  ]) assert.deepEqual(page[field], old[field]);
  const beforePath = path.join(out, 'before-author-correction', `${String(page.pdf_page).padStart(4, '0')}.page.md`);
  assert.equal(binding(beforePath).sha256, old.draft.sha256);
  const beforeParts = fs.readFileSync(beforePath, 'utf8').split('---');
  const afterParts = fs.readFileSync(page.draft.path, 'utf8').split('---');
  const beforeMeta = JSON.parse(beforeParts[1]);
  const afterMeta = JSON.parse(afterParts[1]);
  const beforeBody = beforeParts.slice(2).join('---');
  const afterBody = afterParts.slice(2).join('---');
  if ([160, 162].includes(page.pdf_page)) {
    assert.equal(afterMeta.counting.edge_margin_px, 100);
    assert(afterMeta.counting.reason.trim());
    delete afterMeta.counting;
    assert.deepEqual(afterMeta.notes.slice(0, -1), beforeMeta.notes.slice(0, -1));
    delete beforeMeta.notes;
    delete afterMeta.notes;
    assert.deepEqual(afterMeta, beforeMeta);
    assert.equal(
      afterBody,
      page.pdf_page === 160
        ? beforeBody.replace('**细线的张力**约', '**细线的张力约**')
        : beforeBody,
    );
    const textPreserved = page.block_inventory.map(block => block.text.replaceAll('**', ''));
    const oldText = old.block_inventory.map(block => block.text.replaceAll('**', ''));
    assert.deepEqual(textPreserved, oldText);
    const blockStructure = list => list.map(({ text, ...structure }) => structure);
    assert.deepEqual(blockStructure(page.block_inventory), blockStructure(old.block_inventory));
    metadataChecks.push({
      pdf_page: page.pdf_page,
      before: binding(beforePath),
      counting: page.counting,
      notes_last_entry_updated_for_actual_evidence: true,
      physical_rows_all_words_formulas_blocks_flags_order_and_geometry_unchanged: true,
      raw_body_bytes_identical: page.pdf_page === 162,
      only_body_delimiter_change: page.pdf_page === 160 ? 'Move closing emphasis delimiter after printed约' : null,
    });
  } else {
    assert.equal(page.draft.sha256, old.draft.sha256);
    metadataChecks.push({ pdf_page: page.pdf_page, before: binding(beforePath), entire_draft_byte_identical: true });
  }
}
const allBlocks = current.pages.flatMap(page => page.block_inventory);
const figures = current.pages.flatMap(page => page.source_figures);
const exercises = allBlocks.filter(block => block.kind === 'ex');
assert.deepEqual(exercises.map(block => Number(block.label)), Array.from({ length: 11 }, (_, index) => index + 1));
assert(exercises.every(block => !block.open && !block.cont));
assert.equal(allBlocks.length, 48);
assert.deepEqual(figures.map(figure => figure.id), ['fig-109', 'tbl-p0163-01']);
const block = ref => allBlocks.find(item => item.ref === ref);
assert.equal(block('p0160#1').cont, true);
assert.equal(block('p0160#10').open, true);
assert.equal(block('p0161#1').cont, true);
assert.equal(block('p0161#10').kind, 'exhead');
assert.equal(block('p0162#5').kind, 'h3');
assert.equal(block('p0162#7').open, true);
assert.equal(block('p0163#1').cont, true);
assert.equal(block('p0163#2').open, true);
assert.equal(block('p0163#4').cont, true);
assert.equal(block('p0163#8').open, false);
const incomingParts = fs.readFileSync(current.context.incoming159_text_only.path, 'utf8').split('---');
assert(incomingParts.slice(2).join('---').includes('<!-- p open -->\n$F-F_{\\text{弹}}\\sin\\alpha=0$.'));
const pdf = binding(path.join(root, 'ssot-resources/soviet10year-textbooks/sources/soviet10years/9p 苏联中学课本 物理 九年级.pdf'));
assert.equal(pdf.sha256, 'df0ea9c3417b7ba0166872b33a8ec81ef20cfb9e15b512a44993174fe92162c0');
const details = {
  '0160-tension-emphasis-detail': 'Printed heavy type ends after约;等于 and the numeric result are not included in that emphasis delimiter.',
  '0160-bottom-shadow-detail': 'No printed text below the footer; bottom corner shadows cause the extra default band2145..2178.',
  '0160-left-edge-detail': 'Left100px contains scan spine line, specks and lower shadow only; no page-owned text or figure ink.',
  '0160-right-edge-detail': 'Right100px contains specks and lower shadow only; no page-owned text, caption, footer or figure ink.',
  '0162-ex10-exponents-detail': 'Actual ex10 first row prints1.0 times10^-8 and2.0 times10^-8; no mathematical printing erratum inferred.',
  '0162-bottom-shadow-detail': 'Only scan shadows under footer; default band2086..2193 is not a printed row.',
  '0162-left-edge-detail': 'Left100px contains spine line, specks and lower shadow only; no page-owned text.',
  '0162-right-edge-detail': 'Right100px contains scan specks and lower shadow only; no page-owned text or footer.',
  '0163-near-action-emphasis-detail': 'Three printed rows form the heavy-type near-action conclusion, with the parenthetical或介质 retained.',
};
assert.deepEqual(Object.keys(details).sort(), current.detail_evidence.map(item => item.id).sort());
const record = {
  ticket: 'STEMROBIN-181',
  invocation: 'D018',
  author: 'Einstein',
  role: 'faithful-source-author-only',
  status: 'frozen-pending-main-unique-independent-initial-source-gate',
  created_at: new Date().toISOString(),
  scope: {
    book: '9p', pdf_pages: expectedPages, printed_pages: [151, 152, 153, 154],
    scratch_only: true,
  },
  native_prepare: {
    pages: expectedPages, dpi: 300,
    once_per_previously_absent_page: true,
    original_and_grid_read_one_page_at_a_time: true,
    command: '.claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py prepare --book 9p --page <page>',
  },
  context: {
    ...current.context, pdf,
    source_manifest: binding(path.join(root, 'ssot-resources/soviet10year-textbooks/sources/manifest.json')),
  },
  pages: current.pages,
  counts: {
    actual_physical_rows_including_footer: expectedRows,
    draft_rows_including_footer: current.pages.map(page => page.draft_printed_rows),
    configured_native_counts: current.pages.map(page => page.configured_native_count),
    default_native_counts_after_masking_figures: current.pages.map(page => page.default_native_count),
    total_actual_rows_including_footer: expectedRows.reduce((sum, value) => sum + value, 0),
    blocks: allBlocks.length, original_written_tasks: exercises.length,
    numbered_figures: figures.filter(figure => /^fig-/.test(figure.id)).map(figure => figure.id),
    unnumbered_figures: figures.filter(figure => !/^fig-/.test(figure.id)).map(figure => figure.id),
    tables: 0, captions: allBlocks.filter(item => item.kind === 'cap').length,
    footer_rows: allBlocks.filter(item => item.kind === 'foot').length,
    footnote_printed_lines: 0,
    math_fragments: current.pages.map(page => page.math_fragments),
    worked_examples_touched_in_prose: [
      { source_number: 3, inherited_question_not_repeated: true, solution_completed_on: 160 },
      { source_number: 4, question_page: 160, original_solution_completed_on: 161 },
    ],
    registered_confirmed_math_print_errata: 0,
  },
  source_boundaries: [
    {
      pdf_page: 160, source_unit: 64, lesson_id: 'phy9-c2-s2-n64',
      incoming: {
        from: 'p0159#13', block: 'p0160#1', kind: 'p cont',
        previous_terminal_text: current.context.incoming_terminal_text,
        first_text: '因为sin alpha=r/(2l)，所以',
      },
      example3_closed: { last_block: 'p0160#2', source_result: '细线的张力约等于3.5乘10^-3牛顿.' },
      example4: { question: 'p0160#3', solution_blocks: ['p0160#4', 'p0160#5', 'p0160#6', 'p0160#7', 'p0160#8', 'p0160#9', 'p0160#10'], original_written_task: false },
      figure109: { block: 'p0160#11', caption: 'p0160#12', reference_owner: 'p0160#10', caption_has_own_printed_row: true },
      outgoing: {
        block: 'p0160#10', kind: 'p open', across_transparent_figure_caption_footer: true,
        terminal_text: block('p0160#10').text, to: 'p0161#1',
      },
      source_unit_complete: false,
    },
    {
      pdf_page: 161, source_unit: 64, lesson_id: 'phy9-c2-s2-n64',
      incoming: { block: 'p0161#1', from: 'p0160#10', kind: 'p cont' },
      source64_closed: { last_block: 'p0161#9', following_boundary: 'p0161#10', source_only_structural_fact_not_independent_approval: true },
      exercise_card: {
        lesson_id: 'phy9-c2-s2-t7', printed_heading: '练习9', block: 'p0161#10',
        complete_tasks_here: [1, 2, 3, 4, 5, 6, 7],
        task7_last_block: 'p0161#17', task7_complete: true,
        no_empty_open_task_at_page_boundary: true, next_page_starts_new_task8: true,
      },
    },
    {
      pdf_page: 162,
      exercise_card_closed: {
        lesson_id: 'phy9-c2-s2-t7', complete_tasks_here: [8, 9, 10, 11],
        last_block: 'p0162#4', all11_tasks_complete: true, next_heading: 'p0162#5',
      },
      source_unit: 65, lesson_id: 'phy9-c2-s2-n65',
      heading: { block: 'p0162#5', printed_title: '65. 近距作用和超距作用' },
      outgoing: {
        block: 'p0162#7', kind: 'p open',
        terminal_text: '利用从一点传', to: 'p0163#1',
      },
      source_unit_complete: false,
    },
    {
      pdf_page: 163, source_unit: 65, lesson_id: 'phy9-c2-s2-n65',
      incoming: { block: 'p0163#1', kind: 'p cont', from: 'p0162#7', first_text: '到另一点的这个过程' },
      internal_continuation: {
        open: 'p0163#2', transparent_figure: 'p0163#3', cont: 'p0163#4',
        terminal_and_incoming: '任何媒/介物',
        figure_id: 'tbl-p0163-01', figure_has_no_printed_caption: true,
      },
      outgoing: {
        block: 'p0163#8', complete_paragraph: true, open: false,
        terminal_text: '这完全是没有必要的.',
        source65_still_incomplete: true, page164_not_prepared_or_read: true,
      },
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
  })),
  source_crop_author_observations: figures.map(figure => ({
    ...figure,
    candidate: { ...figure.candidate, actuallyOpened: true, detail: 'original' },
    prospective_margin: { ...figure.prospective_margin, actuallyOpened: true, detail: 'original' },
    full_source_owned_ink_observed_present: true,
    neighboring_prose_or_caption_observed_in_12px_candidate: false,
    larger_36px_margin_observation: figure.id === 'fig-109'
      ? 'Upper neighboring prose fragments and lower caption fragment are visible; not adopted as candidate.'
      : 'Lower neighboring prose fragments are visible; not adopted as candidate.',
    candidate_and_margin_bytes_identical_after_author_correction: true,
    independent_review: 'not-performed',
  })),
  detail_evidence: current.detail_evidence.map(item => ({
    ...item, image: { ...item.image, actuallyOpened: true, detail: 'original' },
    concrete_observation: details[item.id],
    bytes_unchanged_after_author_correction: true,
  })),
  author_targeted_correction: {
    rounds: 1,
    scope: 'Only edge100 counting/reason and evidence notes on160/162, plus160 closing emphasis delimiter after约.',
    before_drafts: expectedPages.map(page => binding(path.join(out, 'before-author-correction', `${String(page).padStart(4, '0')}.page.md`))),
    initial_native_observations: binding(initialPath),
    current_native_observations: binding(checkPath),
    before_helper: binding(path.join(out, 'before-author-correction/author-check.py')),
    checks: metadataChecks,
    source_grid_default_band_evidence_all_figure_crops_byte_identical: true,
    no_pixels_or_shared_tool_changes: true,
    one_author_native_check_before_and_one_after_targeted_correction: true,
  },
  source_error_and_uncertainty_notes: [
    {
      pdf_page: 160, block: 'p0160#2', issue: 'Actual emphasis ends after约, not before it.',
      treatment: 'Delimiter corrected to exact visible range; no word or row changed.',
      detail_evidence: current.detail_evidence.find(item => item.id === '0160-tension-emphasis-detail').image,
    },
    {
      pdf_page: 162, block: 'p0162#3', issue: 'Second printed exponent is visibly-8 despite heavy ink.',
      treatment: 'Preserved actual1.0/2.0 times10^-8; no invented erratum.',
      detail_evidence: current.detail_evidence.find(item => item.id === '0162-ex10-exponents-detail').image,
    },
    {
      pdf_page: 163, blocks: ['p0163#4', 'p0163#5', 'p0163#6', 'p0163#7', 'p0163#8'],
      issue: 'Original broad near-action assertions and historical explanations may require modern scientific qualification.',
      treatment: 'Source wording and historical names preserved exactly; no SCI or modern text correction.',
    },
    {
      pdf_page: 163, figure: 'tbl-p0163-01',
      issue: 'Curved short marks are schematic and several small ink strokes are separate.',
      treatment: 'All actual original ink retained; no guessed physical wavefront count, direction, speed or calibration.',
    },
  ],
  unresolved_findings: [
    'Unique independent source fidelity/count/crop/boundary gate remains pending; author has not approved it.',
    'Source65 remains incomplete after163; do not finalize an assembled modern unit from this boundary alone.',
    'Unnumbered illustration has no printed caption or numeric label; native tbl-prefix is an ID convention, not a claim that this is a table.',
  ],
  mechanical_author_checks: {
    status: 'no-findings-in-native-author-parse-normalize-charset-math-and-configured-row-checks',
    source_scientific_correctness_not_assessed: true,
    not_independent_fidelity_approval: true,
  },
  preservation: {
    source_scientific_historical_wording_and_numeric_data_preserved: true,
    no_confirmed_math_print_error_found_no_erratum_invented: true,
    no_row_fitting_empty_lines_or_fabricated_wrap: true,
    actual_two_row_source_equation_has_one_wrap_only_on160: true,
    source_pngs_and_grids_unmodified: true,
    previous159_pixels_not_opened: true,
    previous156_159_emphasis_correction_owned_by_main_not_edited: true,
    modern60_or_any_other_modern_artifact_not_revisited_or_edited: true,
    no_multi_page_montage_or_new_ocr: true,
    no_shared_tool_or_durable_source_edits: true,
  },
  native_tools: current.native_tools,
  lesson_skill: current.lesson_skill,
  profile: current.profile,
  reference_helpers_read_only: current.reference_helpers_read_only,
  helpers: [current.helper, binding(fileURLToPath(import.meta.url))],
  self_independent_approval: false,
  source_finalize_assemble_vectorize_modern_science_browser_db_git_dependencies_or_durable_writes: [],
  author_asserts_no_in_flight_writes: true,
  in_flight_processes: 0,
};
assertBindings(record);
fs.writeFileSync(freeze, JSON.stringify(record, null, 2) + '\n');
console.log(JSON.stringify({
  freeze: binding(freeze), status: record.status, counts: record.counts,
  drafts: current.pages.map(page => ({ pdf_page: page.pdf_page, draft: page.draft })),
  source64_closed: true, t7_tasks11_closed: true, source65_still_incomplete: true,
  in_flight_processes: 0,
}, null, 2));

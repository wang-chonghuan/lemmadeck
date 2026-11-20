import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const read = (path) => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
const digest = (path) => {
  const bytes = readFileSync(path);
  return { path, bytes: bytes.length, sha256: sha(bytes) };
};
const save = (path, data) => writeFileSync(resolve(root, path), `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' });
for (const path of ['row-comparison.json', 'report.json', 'review-freeze.json']) {
  if (existsSync(resolve(root, path))) throw new Error(`Refuse overwrite: ${path}`);
}
const inputPath = resolve(root, 'input-freeze.json');
const inputSha = sha(readFileSync(inputPath));
if (inputSha !== 'd6d27f73ccd73098f70acdaa41a73c6422f3942341baff25ab479c1976b8f524') {
  throw new Error('Input freeze changed');
}
const input = read('input-freeze.json');
const after = read('after-inventory.json');
const original = read('source-only.json');
const independent = read('independent-freeze.json');
const supplement = read('post-comparison-supplement.json');
for (const file of independent.files) {
  const actual = digest(resolve(root, file.path));
  if (actual.sha256 !== file.sha256 || actual.bytes !== file.bytes) throw new Error(`Independent evidence changed: ${file.path}`);
}
const bound = [
  input.sourceOnly, input.afterInventory,
  ...original.pages.map((page) => page.original),
  ...after.candidates.flatMap((page) => page.files),
  after.native, after.authorReport, after.authorFreeze,
];
const bindings = bound.map((file) => {
  const actual = digest(file.path);
  const matches = actual.sha256 === file.sha256 && actual.bytes === file.bytes;
  if (!matches) throw new Error(`Prepared binding changed: ${file.path}`);
  return { ...actual, matches };
});

// Normalize only explicit representation changes; colon/full-stop differences remain visible.
const superscript = (text) => [...text].map((char) => ({ '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³' })[char] ?? char).join('');
const normalize = (line) => line
  .replace(/\*\*/g, '')
  .replace(/\$/g, '')
  .replace(/\\frac\{2\}\{3\}/g, '⅔')
  .replace(/\\frac\{1\}\{3\}/g, '⅓')
  .replace(/\\(pi|eta|Omega|lambda|gamma)/g, (_, name) => ({ pi: 'π', eta: 'η', Omega: 'Ω', lambda: 'λ', gamma: 'γ' })[name])
  .replace(/\^\{(-?\d+)\}/g, (_, exponent) => superscript(exponent))
  .replace(/\^(-|0)/g, (_, exponent) => superscript(exponent))
  .replace(/\./g, '。')
  .replace(/\(/g, '（')
  .replace(/\)/g, '）')
  .replace(/\s+/g, '');
const pages = after.candidates.map((candidate) => {
  const path = candidate.files.find((file) => file.path.endsWith('/page.json')).path;
  const data = JSON.parse(readFileSync(path, 'utf8'));
  const inventory = read(`independent-source${candidate.page}.json`);
  const sourceRows = candidate.page === 387
    ? inventory.outside_table_rows
    : [...inventory.rows, inventory.typography.footer];
  const actualRows = data.blocks.flatMap((block) => block.lines);
  const rows = sourceRows.map((source, index) => {
    const actual = actualRows[index] ?? null;
    const correction = supplement.corrections.find((entry) => entry.page === candidate.page && entry.row === index + 1);
    const effective = correction?.pixel_confirmed_text ?? source;
    const matches = actual !== null && normalize(effective) === normalize(actual);
    const hold = candidate.page === 388 && index + 1 === 18;
    return {
      row: index + 1,
      independently_frozen: source,
      pixel_correction: correction?.pixel_confirmed_text ?? null,
      candidate: actual,
      representation_normalized_match: matches,
      disposition: hold ? 'HOLD_QUOTE_PUNCTUATION' : matches ? correction ? 'MATCH_AFTER_PIXEL_CONFIRMED_REVIEWER_CORRECTION' : 'MATCH' : 'UNRESOLVED_MISMATCH',
    };
  });
  return {
    page: candidate.page,
    printed_page: data.meta.printed_page,
    source_row_count: sourceRows.length,
    candidate_printed_lines: data.meta.printed_lines,
    candidate_actual_text_rows: actualRows.length,
    count_match: sourceRows.length === data.meta.printed_lines && sourceRows.length === actualRows.length,
    row_count_scope: candidate.page === 387 ? 'OUTSIDE_TABLE_ONLY_TITLE_AND_FOOTER' : 'VISIBLE_TEXT_ROWS_INCLUDING_FOOTER',
    rows,
    block_structure: data.blocks.map(({ kind, label, cont, open, lines, id, box }) => ({ kind, label, cont, open, row_count: lines.length, id, box })),
    candidate_existing_holds: data.meta.notes.filter((note) => note.startsWith('HOLD')),
  };
});
const unexpected = pages.flatMap((page) => page.rows.filter((row) => row.disposition === 'UNRESOLVED_MISMATCH'));
if (unexpected.length) throw new Error(`Unexpected row mismatches: ${JSON.stringify(unexpected)}`);
save('row-comparison.json', {
  batch: 'D327',
  purpose: 'Bounded source-text evidence comparison, not a producer, native stage, test or validator',
  normalization: 'Whitespace, dollar math wrappers, bold wrappers, explicitly present Greek commands, stacked fractions, raised digits, ASCII/fullwidth parentheses and dot/full-stop forms only. Colon is not normalized to full stop.',
  pages,
  total_counted_rows: 48,
  matching_rows_after_pixel_correction: pages.flatMap((page) => page.rows).filter((row) => row.representation_normalized_match).length,
  held_punctuation_rows: 1,
  source387_table_cells: 'Independent inventory frozen; candidate embeds a raw image with no cell-text rows. Candidate raw-image pixel equivalence and SVG/display fidelity were not examined.',
});
const tasks = read('independent-source386.json').original_tasks;
const report = {
  batch: 'D327',
  ticket: 'STEMROBIN-181',
  review: 'FIRST_BOUNDED_INDEPENDENT_SOURCE386_388_TEXT_ROWS_TABLE_INVENTORY_HEADINGS_TASKS_BOUNDARIES',
  status: 'HOLD_NO_SOURCE_OR_DISPLAY_APPROVAL',
  created_at: new Date().toISOString(),
  input_sha256: inputSha,
  independent_freeze_sha256: sha(readFileSync(resolve(root, 'independent-freeze.json'))),
  independence: {
    initial_originals_order: [386, 387, 388],
    initial_inventories_sealed_before_after_inventory_read: true,
    author_report_or_native_rationale_contents_read: false,
    author_native_files_hash_bound_only: true,
    candidate_notes_read_only_after_seal: true,
    initial_freeze_preserved: true,
    reviewer_transcription_correction: 'SOURCE386 row6 corrected only after direct source crop usage8. This is a disclosed post-comparison supplement, not silently rewritten independence.',
  },
  exact_row_counts: {
    SOURCE386: { content: 24, footer: 1, counted_total: 25, candidate: 25 },
    SOURCE387: { outside_table: 2, outside_components: ['基本粒子表 title', '377 footer'], candidate: 2, logical_table_records: 19, table_data_text_baselines: 20, physical_leaf_columns: 7, named_data_leaf_columns: 6 },
    SOURCE388: { content: 20, footer: 1, counted_total: 21, candidate: 21 },
    counted_total: 48,
    not_a_valid_count: 'SOURCE387 19 or 20 table records/baselines must not replace or be added to the outside-table printed_lines identity 2.',
  },
  source_findings: [
    { id: 'S386-CHARGES', status: 'SOURCE_SHAPE_MATCH', finding: 'p-like charge visibly +2/3 e; n-like and lambda-like charge visibly 1/3 e with no minus before it. Candidate preserves both; no physics-driven erratum accepted.' },
    { id: 'S386-R6', status: 'SOURCE_SHAPE_MATCH_AFTER_REVIEWER_CORRECTION', finding: 'Source says 基本性程度. Candidate matches. Initial independent 基本性质 was the reviewer transcription error, corrected by image8; original freeze remains intact.' },
    { id: 'S386-TASKS', status: 'TEXT_INVENTORY_MATCH', finding: 'Five original numbered tasks, physical row spans 2/2/1/2/2; no missing or duplicated task. Task3 refers to task2; gamma glyphs and lifetime raised minus23 are preserved.' },
    { id: 'S387-TABLE', status: 'INDEPENDENT_INVENTORY_FROZEN_WITH_HOLD', finding: 'Whole original table inventoried: headers, all 19 records, each name/symbol/mass/charge/readable lifetime, K-zero two-lifetime relationship and all category/name merges. Raw-image candidate has no table cell transcription to compare; pixel gate is deferred.' },
    { id: 'S387-SIGNS', status: 'SOURCE_SHAPE_INVENTORY_ONLY', finding: 'Barred Sigma/Xi/Omega antiparticle glyphs retain the original displayed superscript signs; do not invert them from known physics. Raised neutrino dash sits to the right, not an approved centered overline.' },
    { id: 'S388-HEADINGS', status: 'TEXT_STRUCTURE_MATCH', finding: 'Two chapter-title rows, section151 heading, and same-row bold 世界的力学图景 are represented without an extra counted row.' },
    { id: 'BOUNDARIES', status: 'LOCAL_BOUNDARY_MATCH_ONLY', finding: 'SOURCE386 starts a continuation fragment and closes all five tasks; SOURCE387 is a complete standalone table; SOURCE388 begins a new chapter/section151 and ends mid-sentence 大小不. No completeness claim about N150/N151 or preceding/following pages.' },
  ],
  glyph_holds: supplement.remaining_holds,
  confirmed_candidate_text_defects: [],
  original_tasks: tasks,
  table_inventory: 'independent-source387.json',
  comparison_summary: {
    counted_rows: 48,
    normalized_text_matches_after_pixel_correction: 47,
    punctuation_hold_rows: 1,
    heading_task_and_local_boundary_structure: 'MATCH_WITHIN_TEXT_SCOPE',
    exact_script_identity: 'HOLD',
    entire_table_readable_value_approval: false,
    native_success_is_source_proof: false,
  },
  image_usage: {
    maximum: 8,
    actual: 8,
    original_opens: 3,
    source_crop_opens: 5,
    reopens: 0,
    grid_opens: 0,
    candidate_image_opens: 0,
    ledger: ['image-usage.json (usages1-7, pre-comparison frozen)', 'post-comparison-supplement.json (usage8)'],
  },
  separate_gates: {
    raw_cropped_candidate_pixels: 'NOT_REVIEWED',
    svg_pixels: 'NOT_REVIEWED',
    display: 'NOT_REVIEWED',
    native: 'NOT_RUN_OR_USED_AS_SOURCE_PROOF',
  },
  authority: {
    source_pages_added: 0,
    complete_courses_added: 0,
    complete_N150_claim: false,
    complete_N151_claim: false,
    source_approval: false,
    course_approval: false,
    modern_approval: false,
    display_approval: false,
    candidate_or_code_edits: 0,
    producer_runs: 0,
    validator_runs: 0,
    native_runs: 0,
    tests_run: 0,
    backend_actions: 0,
    database_writes: 0,
    publisher_runs: 0,
    deploys: 0,
    merges: 0,
    closure_actions: 0,
    new_paid_calls: 0,
    nested_agents: 0,
    messages_sent_to_other_chats: 0,
    repeated_freshness_or_live_ticket_actions: 0,
  },
  immutable_binding_verification: bindings,
  next_action_scope: 'Resolve held source glyph/punctuation/script evidence in a separately authorized pass; independently review raw/SVG pixels and display. No automatic repairs, promotion or increments from this report.',
};
save('report.json', report);
const owned = [
  'independent-source386.json', 'independent-source387.json', 'independent-source388.json',
  'independent-freeze.json', 'image-usage.json', 'post-comparison-supplement.json',
  'row-comparison.json', 'report.json',
  'source386-charge-2x.png', 'source387-table-top-2x.png',
  'source387-table-bottom-2x.png', 'source387-sigma0-exponent-6x.png',
  'source386-row6-3x-post-freeze.png', 'seal-independent.mjs', 'compare-and-freeze.mjs',
];
save('review-freeze.json', {
  batch: 'D327',
  status: report.status,
  created_at: new Date().toISOString(),
  input_sha256: inputSha,
  independent_freeze_sha256: report.independent_freeze_sha256,
  report_sha256: sha(readFileSync(resolve(root, 'report.json'))),
  actual_image_usage: 8,
  source_pages_added: 0,
  complete_courses_added: 0,
  source_approval: false,
  modern_approval: false,
  display_approval: false,
  files: owned.map((path) => ({ ...digest(resolve(root, path)), path })),
  prepared_bindings: bindings,
});
console.log(JSON.stringify({
  status: report.status,
  rows: report.exact_row_counts,
  holds: report.glyph_holds.map((hold) => hold.id),
  images: 8,
  report: digest(resolve(root, 'report.json')),
  review_freeze: digest(resolve(root, 'review-freeze.json')),
}, null, 2));

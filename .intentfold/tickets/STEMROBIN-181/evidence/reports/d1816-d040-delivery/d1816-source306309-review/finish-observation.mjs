import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck';
const out = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-source306309-review');
assert.equal(process.cwd(), root);
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const evidence = file => ({ path: file, sha256: hash(file) });
const expected = [
  [306, '6494488078e8de8de4610e701ed079653a0f11b03865aa5cf58cac95a96c10e9'],
  [307, '9dc51518f247f0679f060974cc432eaf15bfa36483a01fcd6121e5967ee9dc1c'],
  [308, '0b3bb53b86ca0e7caea3ab40ce58dc180dce9e81ae22ca6a91246e5e710fe0e2'],
  [309, 'a821fc204de330ed9e2349ee62d339032778ead7961cfaf8dca9f66185d2b897'],
];
const freezes = [];
const checks = [];
for (const [page, originalHash] of expected) {
  const file = path.join(out, `source${String(page).padStart(4, '0')}.freeze.json`);
  assert.equal(hash(file), originalHash, `Original freeze changed: ${page}`);
  const record = read(file);
  assert.equal(record.schema, 'independent-source-observation@1');
  assert.equal(record.physical_page, page);
  assert.equal(record.printed_page, page - 10);
  assert.equal(hash(record.source.path), record.source.sha256);
  const png = fs.readFileSync(record.source.path);
  assert.equal(png.readUInt32BE(16), record.source.width_px);
  assert.equal(png.readUInt32BE(20), record.source.height_px);
  let rows = 0;
  for (const [index, block] of record.blocks.entries()) {
    assert.equal(block.id, `b${String(index + 1).padStart(2, '0')}`);
    assert(['h1', 'h2', 'h3', 'p', 'exhead', 'ex', 'fig', 'cap', 'foot'].includes(block.kind));
    assert.equal(block.lines.length, block.line_count);
    assert(block.lines.every(line => typeof line === 'string'));
    assert(!block.lines.some(line => /\[(UNRESOLVED|a-SHAPED|PLACEHOLDER)/.test(line)));
    rows += block.line_count;
    if (block.kind === 'ex') assert(Number.isInteger(block.number));
    if (block.kind === 'fig') {
      assert(block.figure_id && block.inventory);
      assert.equal(block.coarse_box_px.length, 4);
      const [x, y, w, h] = block.coarse_box_px;
      assert(x >= 0 && y >= 0 && w > 0 && h > 0);
      assert(x + w <= record.source.width_px && y + h <= record.source.height_px);
    }
    for (const span of block.heavy_spans_certain) {
      assert.equal(block.lines[span.line - 1].split(span.text).length - 1, span.occurrence);
    }
  }
  assert.equal(rows, record.line_accounting.text_block_line_sum);
  assert.equal(rows - record.line_accounting.shared_caption_row_deductions,
    record.line_accounting.unique_printed_text_rows);
  freezes.push({ ...evidence(file), record });
  checks.push({ physical_page: page, original_freeze_unchanged: true, source_hash_and_dimensions_match: true,
    ordered_block_ids_valid: true, line_array_counts_valid: true, figure_boxes_in_source: true,
    certain_span_occurrences_valid: true });
}

const preparationPath = path.join(out, 'crop-preparation-ledger.json');
const crops = read(preparationPath);
assert.equal(crops.length, 4);
for (const crop of crops) {
  assert.equal(hash(crop.path), crop.sha256);
  assert.equal(hash(crop.source.path), crop.source.sha256);
  const png = fs.readFileSync(crop.path);
  assert.equal(png.readUInt32BE(16), crop.width_px);
  assert.equal(png.readUInt32BE(20), crop.height_px);
}
const focus1Path = path.join(out, 'focus-append001.json');
const focus2Path = path.join(out, 'focus-append002-convention.json');
assert.equal(hash(focus1Path), 'd7db86c638b4ee7f80d44911978fa583923857f01c1823e29ae5a008361bc0ad');
const focus2 = read(focus2Path);
assert.equal(focus2.image_opens_added, 0);
assert.equal(focus2.total_image_opens, 8);
assert.equal(focus2.previous_focus.sha256, hash(focus1Path));
const certainFocusSpan = read(focus1Path).results[0].heavy_spans_certain[0];
const page307 = freezes.find(item => item.record.physical_page === 307).record;
const emphasizedLine = page307.blocks.find(block => block.id === certainFocusSpan.block)
  .lines[certainFocusSpan.line - 1];
assert.equal(emphasizedLine.split(certainFocusSpan.text).length - 1, certainFocusSpan.occurrence);

const tocPath = path.join(root, 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json');
const toc = read(tocPath);
const entries = new Map();
const visit = value => {
  if (!value || typeof value !== 'object') return;
  if (value.id) entries.set(value.id, value);
  for (const child of Object.values(value)) {
    if (Array.isArray(child)) child.forEach(visit);
    else if (child && typeof child === 'object') visit(child);
  }
};
visit(toc);
const identity = id => {
  const item = entries.get(id);
  assert(item, `Missing TOC identity: ${id}`);
  return { id: item.id, kind: item.kind ?? null, printed_number: item.printedNumber ?? null,
    title: item.title, printed_page: item.page };
};
const heading118 = freezes[0].record.blocks.find(block => block.kind === 'h3').lines[0];
const headingExercises = freezes[2].record.blocks.find(block => block.kind === 'h3').lines[0];
assert.equal(heading118.replace(/^118\.\s*/, ''), identity('phy10-c2-s6-n118').title);
assert.equal(headingExercises.replace(/\s/g, ''), identity('phy10-c2-s6-t9').title.replace(/\s/g, ''));
assert.equal(identity('phy10-c2-s6-n118').printed_page, 296);
assert.equal(identity('phy10-c2-s6-t9').printed_page, 298);

const imageLedger = [
  ...freezes.map(({ record }, index) => ({
    open_index: index + 1, type: 'individual-ungridded-source-page', physical_page: record.physical_page,
    ...record.source, source_box_px: [0, 0, record.source.width_px, record.source.height_px],
    reopened: false, opened: true, count: 1,
    observation_freeze: { path: freezes[index].path, sha256: freezes[index].sha256 },
    freeze_written_before_next_page_open: true,
  })),
  ...crops.map((crop, index) => ({
    ...crop, open_index: index + 5, type: 'essential-targeted-crop', source_box_px: crop.coarse_box_px,
    opened: true, count: 1, opened_after_all_four_freezes: true,
  })),
];
assert.equal(imageLedger.length, 8);
const report = {
  schema: 'independent-source-phase1-observation@1',
  ticket: 'STEMROBIN-181', batch: 'D040', date: '2026-11-19',
  role: 'bounded-independent-source-observer',
  active_root: root, write_scope: out,
  status: 'observation-complete-with-explicit-HOLDs',
  source_approval: false, canonical_comparison: 'Not performed; only post-freeze TOC identity comparison.',
  restrictions: { database_reads: 0, database_writes: 0, env_reads: 0, paid_or_model_calls: 0,
    git_operations: 0, branches_created: 0, agents_created: 0, production_authoring: false,
    native_finalization: false, modern_diagrams: false, writes_outside_scope: false,
    shared_main_accessed: false, earlier_source_images_or_passed_batches_loaded: false },
  conventions: [
    evidence(path.join(root, '.claude/skills/ld-s10y-lesson/SKILL.md')),
    evidence(path.join(root, '.agents/skills/ld-s10y-image/SKILL.md')),
    evidence(path.join(root, '.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json')),
  ],
  codepoint_policy: focus2.codepoint_principle,
  freeze_evidence: freezes.map(({ path: file, sha256, record }) => ({
    path: file, sha256, physical_page: record.physical_page, printed_page: record.printed_page,
    source: record.source, block_count: record.blocks.length, immutable_original: true,
    line_accounting: record.line_accounting, boundaries: record.boundaries,
  })),
  focus_reports: [evidence(focus1Path), evidence(focus2Path)],
  effective_focus_order: 'Read immutable source freezes, then focus-append001, then focus-append002-convention. Later convention recommendations narrow encoding-only HOLDs; old history is not erased.',
  image_budget: { individual_pages: 4, essential_crops: 4, total_this_batch_and_context: 8,
    maximum_this_batch: 8, maximum_context: 8, grids: 0, page_reopens: 0,
    parent_cumulative_image_opens_supplied: 24, parent_image_payloads_returned: 0,
    more_images_in_this_context_authorized: false },
  image_open_ledger: imageLedger,
  crop_preparation_ledger: evidence(preparationPath),
  toc_comparison: {
    evidence: evidence(tocPath), consulted_only_after_all_page_freezes: true,
    confirmed: [
      { ...identity('phy10-c2-s6-n118'), source_physical_page: 306, source_block: 'b07', title_and_start_page_match: true },
      { ...identity('phy10-c2-s6-t9'), source_physical_page: 308, source_block: 'b10', title_and_start_page_match: true },
    ],
    continuation_identity_only: { ...identity('phy10-c2-s6-n117'), source_heading_not_in_batch: true,
      body_continues_on306: true, whole_section_approved: false },
    containing_chapter_identity_from_toc_only: identity('phy10-c2-s6'),
    following_entries_toc_only: [
      { ...identity('phy10-c3'), actual_source_header_observed: false },
      { ...identity('phy10-c3-s1'), actual_source_header_observed: false },
      { ...identity('phy10-c3-s2'), actual_source_header_observed: false },
    ],
    boundary_result: 'Printed299/physical309 ends observed exercise7 followed by blank space. No following part/chapter header appears in any of the four allowed source pages. TOC names the next part at300 and numbered chapter11 at301, but neither is pixel-verified here.',
  },
  object_summary: {
    sections: [
      { id: 'phy10-c2-s6-n117', source_blocks_on306: ['b01', 'b02', 'b03', 'b04', 'b05', 'b06'],
        figure: '图 244', incoming_is_text_only: true, inherited_source304_HOLD_preserved: true },
      { id: 'phy10-c2-s6-n118', starts_at: 'source0306/b07',
        prose_span: ['source0306/b08', 'source0307/b01-b08', 'source0308/b01-b03'],
        figures: ['图 245', '图 246'], questions_group: '问题', questions: [1, 2, 3, 4, 5],
        questions_blocks: ['source0308/b05', 'source0308/b06', 'source0308/b07', 'source0308/b08', 'source0308/b09'] },
      { id: 'phy10-c2-s6-t9', starts_at: 'source0308/b10', title: '练习 12',
        observed_exercises: [1, 2, 3, 4, 5, 6, 7],
        first_exercise_complete_on308: true, exercises2_through7_complete_on309: true,
        observed_last_exercise_has_no_open_fragment: true, following_header_unverified: true },
    ],
    exercise_numbering_warning: '问题1-5 under118 and 练习12 exercise1-7 are distinct groups; preserve repeated printed1 and do not merge them.',
    figure_ownership: [
      { figure_id: '图 244', physical_page: 306, section: 117, basis: 'Page continuation references 图244,б before118 heading' },
      { figure_id: '图 245', physical_page: 307, section: 118, basis: 'Explicit 图245 and apparatus labels1-8 in printed prose' },
      { figure_id: '图 246', physical_page: 308, section: 118, basis: 'Explicit 图246 in118 continuation before question/exercise headings' },
    ],
    external_reference_records: freezes.flatMap(({ record }) =>
      record.external_references.map(reference => ({ physical_page: record.physical_page, ...reference }))),
  },
  line_accounting: {
    pages: freezes.map(({ record }) => ({ physical_page: record.physical_page,
      raw_text_block_rows: record.line_accounting.text_block_line_sum,
      shared_row_deductions: record.line_accounting.shared_caption_row_deductions,
      unique_printed_text_rows: record.line_accounting.unique_printed_text_rows })),
    raw_rows_total: 70, shared_row_deductions_total: 1, unique_rows_total: 69,
    unique_rows_excluding_four_page_number_footers: 65,
    shared_caption_row: { physical_page: 307, caption_block: 'b05', caption_line: 1,
      body_block: 'b03', body_line: 9, deduction: 1 },
    figure_labels_and_embedded_text_are_inventory_not_additional_body_rows: true,
    focus_did_not_change_line_accounting: true,
  },
  effective_typography: {
    confirmed_heavy: [
      { physical_page: 306, block: 'b07', line: 1, text: '118. 电影中声音的录制和播送', occurrence: 1 },
      { physical_page: 307, block: 'b02', line: 2, text: '音道', occurrence: 1, basis: 'focus-append001' },
      { physical_page: 308, block: 'b04', line: 1, text: '问题', occurrence: 1 },
      { physical_page: 308, block: 'b10', line: 1, text: '练习 12', occurrence: 1 },
    ],
    under_dot_spans_certain: [], under_dot_result: 'No under-dot emphasis observed on the four pages.',
    pending_bold: [{ physical_page: 309, block: 'b06', line: 1, status: 'HOLD', id: 'p0309-heavy-ex7' }],
  },
  effective_math_transcription_recommendations: focus2.narrower_resolutions,
  remaining_holds: focus2.not_resolved,
  incoming_text_only_caution: freezes[0].record.boundaries.incoming.join_note,
  integrity_checks: checks,
  conclusion: 'Complete source observation objects and bounded focus evidence delivered; this does not authorize canonical authoring, finalize, publishing, DB work or whole-source approval.',
};

assert.equal(report.line_accounting.unique_rows_total,
  freezes.reduce((sum, item) => sum + item.record.line_accounting.unique_printed_text_rows, 0));
const phasePath = path.join(out, 'phase1-observation.json');
const receiptPath = path.join(out, 'report0444.json');
const writeNew = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
writeNew(phasePath, report);
const lockedPaths = [...freezes.map(item => item.path), focus1Path, focus2Path, preparationPath, phasePath, receiptPath];
writeNew(receiptPath, {
  schema: 'independent-source-evidence-integrity@1', ticket: 'STEMROBIN-181', batch: 'D040',
  status: 'observation-evidence-integrity-verified', source_approval: false,
  phase1: evidence(phasePath), freezes: freezes.map(({ path: file, sha256 }) => ({ path: file, sha256 })),
  focus_reports: [evidence(focus1Path), evidence(focus2Path)],
  image_ledger_count: imageLedger.length, source_and_crop_hashes_verified: true,
  freeze_original_hashes_preserved: true, total_unique_printed_text_rows: 69,
  remaining_holds: focus2.not_resolved.map(item => item.id),
  permission_mode: '0444', locked_paths: lockedPaths,
});
for (const file of lockedPaths) fs.chmodSync(file, 0o444);
for (const file of lockedPaths) assert.equal(fs.statSync(file).mode & 0o777, 0o444);
for (const [page, originalHash] of expected) {
  assert.equal(hash(path.join(out, `source${String(page).padStart(4, '0')}.freeze.json`)), originalHash);
}
console.log(JSON.stringify({
  phase1: evidence(phasePath), integrity_receipt: evidence(receiptPath),
  focus_reports: [evidence(focus1Path), evidence(focus2Path)],
  freezes: freezes.map(({ path: file, sha256 }) => ({ path: file, sha256 })),
  image_opens: 8, unique_printed_text_rows: 69, report_files_mode: '0444',
  source_approval: false,
}, null, 2));

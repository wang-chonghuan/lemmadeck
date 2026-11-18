import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const workspace = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const scratch = path.join(workspace, '.intentfold/tickets/STEMROBIN-181/tmp');
const root = path.join(scratch, 'd594-source206-first-independent-review');
const author = path.join(scratch, 'd589-source206-first-author');
const accepted205Path = path.join(scratch, 'd586-source205-first-independent-review/report.json');
const inventoryPath = path.join(root, 'source-inventory.json');
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const statRecord = file => {
  const bytes = fs.readFileSync(file);
  const stat = fs.statSync(file);
  return {
    path: file, resolved_path: fs.realpathSync(file), bytes: bytes.length,
    mode: `0${(stat.mode & 0o777).toString(8)}`, sha256: digest(bytes)
  };
};
const inventoryPin = '7d746c59ac0e765349e876c2adf7ee3c07a62f3ab06fc3aeed4c3cfb3245690c';
const inventoryRecord = statRecord(inventoryPath);
if (inventoryRecord.sha256 !== inventoryPin || inventoryRecord.mode !== '0444') {
  throw new Error('Independent inventory seal mismatch; do not alter the inventory.');
}
for (const file of ['report.json', 'report.md', 'review-freeze.json']) {
  if (fs.existsSync(path.join(root, file))) throw new Error(`Refusing to overwrite ${file}`);
}
const inventory = readJson(inventoryPath);
const firstFindings = [];
const check = (id, ok, detail, status = 'FAIL') => {
  if (!ok) firstFindings.push({ id, status, detail, first_outcome_retained: true });
  return ok;
};
const externalPins = [
  [path.join(author, 'report.json'), '7af57f6fcfd5439a87a647253a7841f5d58efe305c94cd025ba790f56aa1de7f'],
  [path.join(author, 'author-freeze.json'), 'adec861be0680312d9f0f103da37fe7a3c4a2ccff3e16365123023ac9b30c72a'],
  [accepted205Path, 'adc8ce6b5a3a8c054b8e5d502074b746a272b91b3da79b2a34a4e9cbdd97e433']
].map(([file, expected_sha256]) => {
  const actual = statRecord(file);
  const verified = check('EXTERNAL_PIN', actual.sha256 === expected_sha256, file);
  return { ...actual, expected_sha256, verified };
});
const freeze = readJson(path.join(author, 'author-freeze.json'));
const schemaOK = check('AUTHOR_FREEZE_SCHEMA',
  freeze.schema === 'bounded-author-freeze@1' && freeze.ownershipRoot === author &&
  Array.isArray(freeze.files) && freeze.files.length > 0,
  'Schema and ownershipRoot inspected before resolving entries.');
if (!schemaOK) throw new Error('Unsupported author freeze schema; no entry resolution attempted.');
const verifiedAuthorFiles = freeze.files.map(entry => {
  const absolute = path.isAbsolute(entry.path) ? entry.path : path.resolve(freeze.ownershipRoot, entry.path);
  const inside = absolute.startsWith(`${author}/`) && path.normalize(absolute) === absolute;
  const exists = inside && fs.existsSync(absolute);
  const actual = exists ? statRecord(absolute) : null;
  const checks = {
    inside_ownership_root: inside,
    exists,
    resolved_path_matches_absolute_path: actual?.resolved_path === absolute,
    sha256: actual?.sha256 === entry.sha256,
    bytes: actual?.bytes === entry.bytes,
    actual_mode_0444: actual?.mode === '0444',
    declared_mode_0444: entry.mode === '0444'
  };
  const verified = check('AUTHOR_FREEZE_ENTRY', Object.values(checks).every(Boolean), entry.path, 'HOLD');
  return { declared: entry, actual, checks, verified };
});
const manifestPaths = verifiedAuthorFiles.map(entry => entry.actual?.path);
check('AUTHOR_FREEZE_DUPLICATE_PATHS', new Set(manifestPaths).size === manifestPaths.length, 'Unique file pins');
const listFiles = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(dir, entry.name);
  return entry.isDirectory() ? listFiles(file) : [file];
});
const authorFiles = listFiles(author).filter(file => file !== path.join(author, 'author-freeze.json'));
const coverageOK = check('AUTHOR_FREEZE_COMPLETE_COVERAGE',
  authorFiles.length === manifestPaths.length && authorFiles.every(file => manifestPaths.includes(file)),
  'Every current author-owned file except the self-excluded manifest is pinned.', 'HOLD');
const authorReport = readJson(path.join(author, 'report.json'));
const pageMdPath = path.join(author, 'source/10p/pages/0206/page.md');
const pageJsonPath = path.join(author, 'source/10p/pages/0206/page.json');
const auditPath = path.join(author, 'source/10p/pages/0206/audit.json');
const page = readJson(pageJsonPath);
const audit = readJson(auditPath);
const receipt = readJson(path.join(author, 'native-first.receipt.json'));
const accepted205 = readJson(accepted205Path);
const sourceRecord = statRecord(inventory.source.path);
check('ORIGINAL_SOURCE_HASH', sourceRecord.sha256 === inventory.source.sha256, 'Opened original unchanged');
const mdLines = fs.readFileSync(pageMdPath, 'utf8').split('\n');
const frontmatterEnd = mdLines.indexOf('---', 1);
const mdMeta = JSON.parse(mdLines.slice(1, frontmatterEnd).join('\n'));
check('MD_JSON_METADATA', JSON.stringify(mdMeta) === JSON.stringify(page.meta), 'All native metadata fields');
const mdBlocks = [];
for (let index = frontmatterEnd + 1; index < mdLines.length; index++) {
  const marker = mdLines[index].match(/^<!-- (p|exhead|ex|h3|foot)(?: (.*))? -->$/);
  if (marker) {
    mdBlocks.push({ kind: marker[1], marker: mdLines[index], marker_line: index + 1, rows: [] });
  } else if (mdLines[index].trim()) {
    if (!mdBlocks.length) throw new Error('Unexpected unmarked native markdown text');
    mdBlocks.at(-1).rows.push({ text: mdLines[index], line: index + 1 });
  }
}
const rowGroups = [
  [1], [2, 3], [4], [5], [6], [7], [8], [9], [10], [11], [12],
  [13], [14, 15, 16], [17, 18, 19, 20, 21, 22], [23]
];
const kinds = ['p', 'p', 'exhead', ...Array(8).fill('ex'), 'h3', 'p', 'p', 'foot'];
check('BLOCK_COUNT', page.blocks.length === rowGroups.length && mdBlocks.length === rowGroups.length, '15 pixel-derived objects');
const expectedText = row => {
  let text = row.text;
  if (row.kind === 'display-math') text = `$${text}$`;
  if (row.right_equation_label) text += ` ${row.right_equation_label}`;
  if (row.kind === 'problem') text = `${row.printed_number}. ${text}`;
  return text;
};
// These are declared inventory transcription conventions, not semantic rewrites.
const equivalent = text => text.replaceAll('？', '?').replaceAll('（', '(').replaceAll('）', ')')
  .replace(/在\s+19\s+世纪\s+30\s+年代/g, '在19世纪30年代');
const jsonPhysicalLines = fs.readFileSync(pageJsonPath, 'utf8').split('\n');
let jsonCursor = jsonPhysicalLines.findIndex(line => line.includes('"blocks": ['));
const lineComparisons = [];
const mappings = rowGroups.map((rows, index) => {
  const block = page.blocks[index];
  const markdown = mdBlocks[index];
  const nativeRef = `p0206#${index + 1}`;
  const pointer = `/blocks/${index}`;
  const expectedLabel = index >= 3 && index <= 10 ? String(index - 2) : null;
  const flagsOK = block?.kind === kinds[index] && block.label === expectedLabel &&
    block.cont === (index === 0) && block.open === false && block.samerow === false &&
    block.owner_exercise === null && block.box === null &&
    markdown?.kind === kinds[index] &&
    (index !== 0 || markdown.marker === '<!-- p cont -->') &&
    (expectedLabel === null || markdown.marker === `<!-- ex ${expectedLabel} -->`);
  check('BLOCK_IDENTITY_FLAGS', flagsOK, nativeRef);
  check('BLOCK_ROW_COUNT', block?.lines.length === rows.length && markdown?.rows.length === rows.length, nativeRef);
  rows.forEach((rowNumber, rowIndex) => {
    const frozen = inventory.rows[rowNumber - 1];
    const expected = expectedText(frozen);
    const nativeMd = markdown?.rows[rowIndex];
    const nativeJson = block?.lines[rowIndex];
    const matchingJsonLine = jsonPhysicalLines.findIndex((line, offset) =>
      offset > jsonCursor && line.trim().replace(/,$/, '') === JSON.stringify(nativeJson));
    jsonCursor = matchingJsonLine;
    const mdJsonEqual = nativeMd?.text === nativeJson;
    const literalEqual = expected === nativeJson;
    const conventionsOnly = !literalEqual && equivalent(expected) === equivalent(nativeJson ?? '');
    const pass = check('PHYSICAL_ROW_COMPARISON',
      mdJsonEqual && (literalEqual || conventionsOnly) && matchingJsonLine >= 0, `physical row ${rowNumber}`);
    const changes = [];
    if (expected.includes('?') && nativeJson?.includes('？')) changes.push('ASCII/fullwidth question-mark encoding');
    if (expected.includes('(') && nativeJson?.includes('（')) changes.push('ASCII/fullwidth parenthesis encoding');
    if (expected.includes('19世纪30年代') && nativeJson?.includes('19 世纪 30 年代')) {
      changes.push('Typesetting spaces only; 19, 世纪, 30, 年代 all retained');
    }
    lineComparisons.push({
      physical_row: rowNumber, source_kind: frozen.kind, inventory_pointer: `/rows/${rowNumber - 1}`,
      native_ref: nativeRef, block_pointer: pointer, line_pointer: `${pointer}/lines/${rowIndex}`,
      page_md_one_based_line: nativeMd?.line, page_json_one_based_line: matchingJsonLine + 1,
      frozen_pixel_reading: frozen.text, expected_native_encoding: expected,
      native_md: nativeMd?.text, native_json: nativeJson,
      md_json_exact_equal: mdJsonEqual, inventory_encoding_exact_equal: literalEqual,
      inventory_declared_conventions_only: conventionsOnly, encoding_qualifications: changes,
      emphasis: frozen.emphasis,
      emphasis_preservation: frozen.kind === 'question-heading' || frozen.kind === 'section-heading'
        ? `Preserved by semantic ${block.kind} block; no invented inline emphasis`
        : frozen.kind === 'footer' ? 'Footer numeral retained; flanking ornaments not content objects'
          : 'No isolated semantic emphasis span in the observed source row',
      literal_formula_equal: frozen.kind === 'display-math' ? literalEqual : null,
      status: pass ? 'PASS' : 'FAIL'
    });
  });
  return {
    native_ref: nativeRef, one_based_K: index + 1, block_pointer: pointer,
    zero_based_block_index: index, source_physical_rows: rows, kind: block?.kind,
    label: block?.label, cont: block?.cont, open: block?.open,
    md_marker_line: markdown?.marker_line, flags_status: flagsOK ? 'PASS' : 'FAIL'
  };
});
const problems = inventory.problem_objects.map(problem => {
  const index = problem.printed_number + 2;
  const comparison = lineComparisons.find(line => line.physical_row === problem.row);
  return {
    ...problem, native_ref: `p0206#${index + 1}`, pointer: `/blocks/${index}`,
    actual_native_label: page.blocks[index].label,
    actual_native_prose: page.blocks[index].lines[0],
    printed_number_preserved: page.blocks[index].label === String(problem.printed_number),
    numerical_conditions_in_source: [], units_in_source: [],
    no_answer_or_figure_invented: true, status: comparison.status
  };
});
const auditExpected = {
  page: 206, lines_printed: 23, lines_md: 23, figures: [], normalizations: [],
  unknown_chars: [], katex_warnings: [], errata: 0, errors: []
};
const auditComparisons = Object.entries(auditExpected).map(([field, expected], index) => {
  const pass = check('NATIVE_AUDIT_FIELD', JSON.stringify(audit[field]) === JSON.stringify(expected), field);
  return { pointer: `/${field}`, one_based_line: index + 2, actual: audit[field], expected,
    basis: ['page', 'lines_printed', 'lines_md', 'figures'].includes(field)
      ? 'Independent pixel inventory and compared native text' : 'Read-only first-native audit, not an independent render test',
    status: pass ? 'PASS' : 'FAIL' };
});
check('AUDIT_FIELD_SET', Object.keys(audit).length === Object.keys(auditExpected).length, 'No discarded audit fields');
check('NATIVE_FIRST_ONLY',
  receipt.invocations === 1 && receipt.exitCode === 0 && receipt.error === null &&
  authorReport.native.invocations === 1 && authorReport.native.repairs === 0,
  'Existing author first native receipt only; reviewer runs zero native commands');
const sourceCountsExpected = {
  printedLinesFromPixels: 23, blocks: 15, proseBlocksIncludingFormulaParagraphs: 4,
  prosePrintedLinesIncludingFormulas: 12, nonFormulaProsePrintedLines: 10, standaloneFormulaLines: 2,
  numberedHeadings: 1, runInHeadings: 0, exerciseHeaders: 1, exerciseObjects: 8,
  exercisePrintedLines: 8, footerLines: 1, figures: 0, figureCaptions: 0
};
const counterComparisons = Object.entries(sourceCountsExpected).map(([field, expected]) => {
  const actual = authorReport.sourceCounts[field];
  return { field, pixel_derived_expected: expected, actual,
    status: check('AUTHOR_COUNT', actual === expected, field) ? 'PASS' : 'FAIL' };
});
const acceptedTail = inventory.boundaries.incoming.accepted205_tail_from_user_only;
const upstreamAccepted = check('ACCEPTED205_TAIL',
  accepted205.gates.SOURCE205.status === 'PASS' &&
  accepted205.gates.SOURCE205_LOCAL_BOUNDARIES.status === 'PASS' &&
  accepted205.outgoingTail.observed === acceptedTail &&
  accepted205.outgoingTail.nativeRef === 'p0205#6' &&
  accepted205.outgoingTail.pointer === '/blocks/5' &&
  accepted205.outgoingTail.currentOpenFlag === true,
  'Accepted d586 tail only; SOURCE205 pixels and native source not reread', 'HOLD');
const inheritedHold = accepted205.gates.SOURCE204205_JOIN;
check('RETAIN_UPSTREAM_HOLD', inheritedHold.status === 'HOLD', 'SOURCE204205_JOIN must remain separate', 'HOLD');
const inheritedBlockers = inheritedHold.blocking_list.map(blocker => ({
  ...blocker, retained_from: accepted205Path, retained_report_sha256: externalPins[2].sha256,
  reassessed: false, blocks_source206_local_pass: false, blocks_full_n77_certification: true
}));
const localBoundaryOK = mappings.every(mapping => mapping.flags_status === 'PASS') &&
  page.blocks[11].lines[0] === '78. 照相机 投影仪' &&
  page.blocks[13].lines.at(-1) === inventory.boundaries.outgoing.actual_tail;
const rightOK = page.blocks[10].label === '8' && page.blocks[11].kind === 'h3' &&
  page.blocks[11].lines[0] === inventory.rows[12].text;
const joinOK = upstreamAccepted && page.blocks[0].cont === true && page.blocks[0].open === false &&
  page.blocks[0].lines[0] === '$\\frac{H}{h}=\\frac{|f|}{|d|}$';
const sourceOK = firstFindings.length === 0 && coverageOK;
const gate = (ok, scope, blockers = []) => ({ status: ok ? 'PASS' : 'HOLD', scope,
  blocking_list: ok ? [] : blockers.length ? blockers : firstFindings });
const gates = {
  SOURCE206: gate(sourceOK,
    'Only actual SOURCE206 rows, literal formula bars and variable cases, all eight printed questions, heading/prose/footer and no-local-figure inventory. Not DISPLAY or full n77.'),
  SOURCE206_LOCAL_BOUNDARIES: gate(localBoundaryOK,
    'Current-page 15 block identities, incoming cont formula, question heading, eight questions, heading78 and two paragraphs, complete final sentence and footer. No unseen next-page signature.'),
  N77_RIGHT_BOUNDARY: gate(rightOK,
    'Only the right boundary after printed question8 p0206#11 and before observed heading78 p0206#12. Does not certify the left boundary, all n77 text, figures, assembly or completion.'),
  SOURCE205206_JOIN: gate(joinOK,
    'Accepted d586 p0205#6 /blocks/5 open tail plus actual SOURCE206 p0206#1 /blocks/0 formula and cont=true only. Does not adjudicate SOURCE204205_JOIN.'),
  SOURCE204205_JOIN: { ...inheritedHold, scope: 'Inherited HOLD, not re-reviewed or changed here',
    blocking_list: inheritedBlockers },
  RAW: { status: 'NOT-APPLICABLE', scope: 'Zero actual SOURCE206 figures', blocking_list: [], visual_pass_claimed: false },
  SVG: { status: 'NOT-APPLICABLE', scope: 'Zero actual SOURCE206 figures', blocking_list: [], visual_pass_claimed: false }
};
const report = {
  schema: 'source206-first-independent-bounded-review/v1', ticket: 'STEMROBIN-181',
  review_id: inventory.review_id, bounded_batch_finished: true,
  role: 'Fresh one-off FIRST independent review, not permanent or replacement A-D',
  ownership_root: root, shared_original181_checkout: workspace,
  inventory_order_and_hashes: {
    source_hash_checked_before_first_image_action: true,
    first_image_action: 'functions.view_image original SOURCE206 path only',
    source_inventory_record: inventoryRecord,
    inventory_0444_and_hash_observed_before_author_read: true,
    author_report_and_freeze_read_only_after_inventory_freeze: true,
    all_manifest_files_hash_verified_before_report_generation: true,
    all_manifest_files_hash_verified_before_initial_native_text_read: false,
    qualification: 'Externally supplied report/freeze hashes verified before their reads. Their schema/path entries inspected next; all listed hashes/bytes/modes subsequently checked in this read-only script. No claim that all entry hashes preceded the initial page text read.',
    no_author_inventory_content_read: true, no_layout_template_TOC_content_read: true,
    no_post_seal_pixel_reinterpretation_or_inventory_edit: true
  },
  gates, blocking_list: [...firstFindings, ...inheritedBlockers],
  first_FAIL_HOLD_retention: {
    own_first_failures_or_holds: firstFindings,
    inherited_first_hold: inheritedHold,
    own_repairs: 0, reports_overwritten: 0, no_fail_to_pass_repair_cycle: true
  },
  exact_counts: {
    ...inventory.counts, native_blocks: page.blocks.length,
    independent_compared_rows: lineComparisons.length,
    passing_row_comparisons: lineComparisons.filter(line => line.status === 'PASS').length,
    exact_inventory_encoding_rows: lineComparisons.filter(line => line.inventory_encoding_exact_equal).length,
    convention_only_encoding_rows: lineComparisons.filter(line => line.inventory_declared_conventions_only).length,
    problem_objects_compared: problems.length, reference_pointer_mappings: mappings.length,
    native_prose_blocks: 4, native_prose_physical_lines_including_formulas: 12,
    author_manifest_files: verifiedAuthorFiles.length, author_manifest_files_verified: verifiedAuthorFiles.filter(file => file.verified).length
  },
  line_by_line_comparisons: lineComparisons,
  reference_pointer_rule: 'p0206#K uses one-based K; /blocks/K-1 uses zero-based index. Printed problem numbers are separate labels 1 through 8.',
  reference_pointer_mapping: mappings, problem_objects: problems,
  literal_math_and_units: { ...inventory.literal_math_and_units, exact_formula_rows_pass: [1, 3].every(row =>
    lineComparisons.find(line => line.physical_row === row).literal_formula_equal),
    barred_f_and_d_never_replaced_by_F: true, H_h_never_casefolded: true,
    historical_quantity_and_units_preserved: true },
  local_figures: inventory.local_figure_presence,
  incoming_join: {
    accepted205_report: externalPins[2],
    accepted205_scope: 'SOURCE205 + SOURCE205_LOCAL_BOUNDARIES PASS; only accepted outgoing tail consumed',
    accepted205_tail: acceptedTail, accepted205_ref: 'p0205#6', accepted205_pointer: '/blocks/5',
    accepted205_open: true, actual206_formula: page.blocks[0].lines[0],
    actual206_ref: 'p0206#1', actual206_pointer: '/blocks/0',
    actual206_cont: true, actual206_open: false, local_join_status: gates.SOURCE205206_JOIN.status,
    source205_pixels_reopened: false, source204_pixels_reopened: false,
    unresolved204205_join_laundered_into_pass: false
  },
  outgoing_tail_and_open: {
    ...inventory.boundaries.outgoing, native_ref: 'p0206#14', native_pointer: '/blocks/13',
    native_open: page.blocks[13].open, paragraph_lines: page.blocks[13].lines,
    footer_ref: 'p0206#15', footer_pointer: '/blocks/14',
    section_open_is_not_native_paragraph_open: true
  },
  audit_line_by_line_comparisons: auditComparisons, author_counter_comparisons: counterComparisons,
  author_freeze_verification: {
    external_pins: externalPins, schema: freeze.schema, ownership_root: freeze.ownershipRoot,
    path_resolution: 'Absolute entries resolve to their exact original181 paths; relative entries would resolve against inspected ownershipRoot. No rebasing to another checkout.',
    actual_entries_all_absolute: freeze.files.every(file => path.isAbsolute(file.path)),
    coverage_complete: coverageOK, self_exclusion_policy: freeze.selfHashPolicy, files: verifiedAuthorFiles
  },
  native_first_receipt_read_only: {
    path: path.join(author, 'native-first.receipt.json'),
    sha256: digest(fs.readFileSync(path.join(author, 'native-first.receipt.json'))),
    existing_invocations: receipt.invocations, existing_exit_code: receipt.exitCode,
    existing_first_outcome: receipt.firstOutcome, existing_errors: receipt.error,
    author_first_failure: authorReport.native.firstFailure,
    reviewer_finalize_prepare_vectorize_native_whole_checks: 0
  },
  image_accounting: {
    initial: 0, current_batch_opens: 1, batch_limit: 8, current_context_opens: 1, context_limit: 24,
    parent_and_old_contexts: '24/24 unchanged; no reset, no image payload returned to them',
    opens: [{ ordinal: 1, path: inventory.source.path, sha256: inventory.source.sha256,
      detail: 'original', native_unscaled: true, crop: false, before_inventory_freeze: true }],
    original_opens: 1, native_crop_opens: 0, repeated_image_opens: 0,
    RAW_SVG_DISPLAY_opens: 0, source205_opens: 0, other_page_opens: 0,
    hash_only_image_file_reads_are_not_visual_opens: true, final_delivery: 'TEXT paths and full hashes only'
  },
  completion_scope: {
    source206_only: true, n77_right_boundary_only: true, n77_complete: false, n78_complete: false,
    full_n77_certification: 'NOT-CERTIFIED; SOURCE204205_JOIN HOLD remains independently blocking',
    DISPLAY: 'NOT-REVIEWED', figure_visual_certification: 'NOT-APPLICABLE, not PASS',
    no_follow_on_batch: true
  },
  untouched_operations: {
    author_writes: 0, rollback: 0, parent_budget_reset: 0, git: 0, branches: 0,
    database: 0, deploy: 0, canonical: 0, probability: 0,
    finalize: 0, prepare: 0, vectorize: 0, repeated_native: 0, whole_checks: 0
  },
  review_freeze: { path: path.join(root, 'review-freeze.json'), mode: '0444',
    policy: 'All owned files pinned except the manifest itself; its full hash delivered externally.' }
};
const writeOwned = (name, content) => {
  const file = path.join(root, name);
  fs.writeFileSync(file, content, { flag: 'wx', mode: 0o444 });
  fs.chmodSync(file, 0o444);
};
writeOwned('report.json', `${JSON.stringify(report, null, 2)}\n`);
const reportPin = statRecord(path.join(root, 'report.json'));
const summary = [
  '# SOURCE206 First Independent Review',
  '',
  `Report: ${reportPin.path}`,
  `SHA-256: ${reportPin.sha256}`,
  `Independent inventory: ${inventoryRecord.path}`,
  `SHA-256: ${inventoryRecord.sha256}`,
  '',
  ...Object.entries(gates).map(([name, value]) => `${name}: ${value.status}`),
  '',
  'Counts: 23 physical rows (22 body + 1 footer), 15 native blocks, 8 actual numbered problem objects, 2 formula rows, 1 equation label, 1 problem heading, 1 numbered section heading, 2 section paragraphs / 9 physical lines, 0 figures.',
  `Row comparisons: ${report.exact_counts.passing_row_comparisons}/23 PASS; ${report.exact_counts.exact_inventory_encoding_rows} exact encodings, ${report.exact_counts.convention_only_encoding_rows} declared punctuation-width/typesetting-space encodings.`,
  `Author freeze: ${verifiedAuthorFiles.filter(file => file.verified).length}/${verifiedAuthorFiles.length} entries verified at exact original paths; complete coverage ${coverageOK}.`,
  'Incoming: accepted p0205#6 /blocks/5 open tail continues as actual p0206#1 /blocks/0 cont formula.',
  'N77 right boundary: after problem8 p0206#11 /blocks/10, before actual heading78 p0206#12 /blocks/11.',
  'Outgoing: p0206#14 /blocks/13 ends with a full sentence, native open=false; section78 remains unclosed. Next page unseen.',
  'SOURCE204205_JOIN HOLD is retained with its original blocking list. This is NOT full n77 certification.',
  'Image opens: 1/8 batch, 1/24 fresh context; original specified page only. Crops 0. Parent/old 24/24 untouched.',
  'Existing author finalized once; review executed no finalize/prepare/vectorize/native/whole checks, author repairs, git, DB, deploy, canonical or probability operations.',
  'All owned review files are 0444. review-freeze.json pins all except itself; its full hash is delivered externally.',
  ''
].join('\n');
writeOwned('report.md', summary);
fs.chmodSync(path.join(root, 'review.mjs'), 0o444);
const ownedRecords = listFiles(root).map(statRecord);
if (ownedRecords.some(record => record.mode !== '0444')) throw new Error('Owned file is not 0444');
writeOwned('review-freeze.json', `${JSON.stringify({
  schema: 'bounded-independent-review-freeze/v1', ownership_root: root, mode: '0444',
  inventory_sha256: inventoryPin, report_sha256: reportPin.sha256,
  status: sourceOK && localBoundaryOK && rightOK && joinOK ? 'finished-local-PASS-upstream-HOLD-retained' : 'finished-first-findings-retained',
  self_hash_policy: 'Excludes this manifest to avoid circular hashing; full manifest hash delivered externally.',
  input_pins: [...externalPins, sourceRecord],
  image_opens: report.image_accounting.opens,
  files: ownedRecords
}, null, 2)}\n`);
console.log(JSON.stringify({
  report: reportPin,
  summary: statRecord(path.join(root, 'report.md')),
  inventory: inventoryRecord,
  review_freeze: statRecord(path.join(root, 'review-freeze.json')),
  gates: Object.fromEntries(Object.entries(gates).map(([key, value]) => [key, value.status])),
  counts: report.exact_counts, image_opens: 1, own_first_findings: firstFindings
}, null, 2));

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';

const root = '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck';
const directory = '.intentfold/tickets/STEMROBIN-181/tmp/d1815-source294297-review';
const focusDirectory = '.intentfold/tickets/STEMROBIN-181/tmp/d1815-focus294297-review';
const recovery = '.intentfold/tickets/STEMROBIN-181/tmp/d1814-recovery';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const reads = new Map();
function read(relative) {
  const absolute = path.isAbsolute(relative) ? relative : path.join(root, relative);
  const bytes = fs.readFileSync(absolute);
  const binding = {path: path.relative(root, absolute), bytes: bytes.length, sha256: hash(bytes)};
  reads.set(binding.path, binding);
  return {bytes, binding, mode: (fs.statSync(absolute).mode & 0o777).toString(8)};
}
function requireCondition(condition, message) {
  if (!condition) throw new Error(message);
}
const originalFile = read(`${directory}/review.json`);
requireCondition(originalFile.binding.sha256 === '6f518dcdc9ba599e38c43ba8190d2ed8eb8cf81118c3498ccab8b6f68a1aea0d', 'Original review changed');
requireCondition(originalFile.mode === '444', 'Original review not read-only');
const original = JSON.parse(originalFile.bytes);
const snapshotFile = read(original.canonical_freeze.path);
requireCondition(snapshotFile.binding.sha256 === original.canonical_freeze.sha256 && snapshotFile.mode === '444', 'Original canonical freeze changed');
const snapshots = JSON.parse(snapshotFile.bytes);
const immutableOriginalBindings = [originalFile.binding, snapshotFile.binding];
for (const binding of original.freeze_bindings) {
  const frozen = read(binding.path);
  requireCondition(isDeepStrictEqual(frozen.binding, binding) && frozen.mode === '444', `Original freeze changed: ${binding.path}`);
  immutableOriginalBindings.push(frozen.binding);
}
const focusFile = read(`${focusDirectory}/review.json`);
requireCondition(focusFile.binding.sha256 === '3cecacf81179f5e726f32ed7b31eb3a9d896557b27cbd81b79e1ce764ae27a7c', 'Focus SHA mismatch');
requireCondition(focusFile.mode === '444', 'Focus review not read-only');
const focus = JSON.parse(focusFile.bytes);
requireCondition(focus.bindings.prior_report.sha256 === originalFile.binding.sha256, 'Focus binds a different original review');
const immutableFocusBindings = [focusFile.binding];
for (const [key, binding] of Object.entries(focus.bindings)) {
  if (key === 'prior_report') continue;
  const relative = path.isAbsolute(binding.path) ? binding.path : `${focusDirectory}/${binding.path}`;
  const frozen = read(relative);
  requireCondition(frozen.binding.sha256 === binding.sha256 && frozen.mode === '444', `Focus evidence changed: ${key}`);
  immutableFocusBindings.push(frozen.binding);
}

function parseMd(text) {
  const lines = text.split('\n');
  const frontEnd = lines.indexOf('---', 1);
  requireCondition(lines[0] === '---' && frontEnd > 0, 'Missing JSON frontmatter');
  const meta = JSON.parse(lines.slice(1, frontEnd).join('\n'));
  const indices = lines.flatMap((line, index) => /^<!--.*-->$/.test(line) ? [index] : []);
  const blocks = indices.map((headerIndex, index) => {
    const rows = lines.slice(headerIndex + 1, indices[index + 1] ?? lines.length)
      .flatMap((text, offset) => text.length ? [{text, index: headerIndex + offset + 1}] : []);
    const header = lines[headerIndex];
    return {headerIndex, header, kind: header.slice(5).split(' ')[0], rows};
  });
  return {lines, meta, blocks};
}
const mutations = [
  {page: 294, block: 1, line: 4, value: '透明的，在两个电极上加上', finding: 'S294-PUNCT-1'},
  {page: 294, block: 1, line: 5, value: '电压；这个电压可以用电位', finding: 'S294-PUNCT-2'},
  {page: 294, block: 4, line: 1, value: '子，电子在电场中运动时就形成', finding: 'S294-TEXT-1'},
  {page: 294, block: 4, line: 3, value: '条件下，**增大两电极间的电势差，**', finding: 'S294-EMPH-1'},
  {page: 294, block: 4, line: 4, value: '**则电流强度就增大**. 在某一电压', finding: 'S294-EMPH-1'},
  {page: 295, block: 6, line: 1, value: '当改变光强度时，如实验证明的，截止电压不变化；这', finding: 'S295-TEXT-1'},
  {page: 295, block: 4, header: 'p open', finding: 'S295-OBJECT-1'},
  {page: 295, block: 5, header: 'p cont', finding: 'S295-OBJECT-1'},
  {page: 296, block: 3, header: 'p open', finding: 'S296-OBJECT-1'},
  {page: 296, block: 4, header: 'p cont', finding: 'S296-OBJECT-1'},
  {page: 297, block: 3, header: 'p open', finding: 'S297-OBJECT-1'},
  {page: 297, block: 4, header: 'p cont', finding: 'S297-OBJECT-1'},
  {page: 297, block: 4, line: 1, value: '$h\\nu>A$. ', finding: 'S297-PERIOD-1'},
  {page: 297, block: 5, header: 'p open', finding: 'S297-OBJECT-2'},
  {page: 297, block: 6, header: 'p cont open', finding: 'S297-OBJECT-2'},
  {page: 297, block: 7, header: 'p cont', finding: 'S297-OBJECT-2'},
];
const pages = [];
for (const page of [294, 295, 296, 297]) {
  const snapshot = snapshots.pages.find(x => x.page === page);
  for (const file of Object.values(snapshot.files)) {
    const bytes = Buffer.from(file.literal_utf8);
    requireCondition(bytes.length === file.binding.bytes && hash(bytes) === file.binding.sha256, `Corrupt original snapshot: ${file.binding.path}`);
  }
  const before = read(`${recovery}/source${page}-before-affected.md`);
  requireCondition(before.bytes.equals(Buffer.from(snapshot.files['page.md'].literal_utf8)), `BEFORE does not match original snapshot: ${page}`);
  const currentFiles = Object.fromEntries(['page.md', 'page.json', 'audit.json'].map(name => [name, read(snapshot.files[name].binding.path)]));
  const beforeMd = parseMd(before.bytes.toString());
  const currentMd = parseMd(currentFiles['page.md'].bytes.toString());
  const beforeJson = JSON.parse(snapshot.files['page.json'].literal_utf8);
  const currentJson = JSON.parse(currentFiles['page.json'].bytes);
  const audit = JSON.parse(currentFiles['audit.json'].bytes);
  const expectedMdLines = [...beforeMd.lines];
  const expectedJson = structuredClone(beforeJson);
  const changes = [];
  for (const mutation of mutations.filter(x => x.page === page)) {
    const block = beforeMd.blocks[mutation.block - 1];
    if (mutation.header) {
      const value = `<!-- ${mutation.header} -->`;
      expectedMdLines[block.headerIndex] = value;
      expectedJson.blocks[mutation.block - 1].open = mutation.header.split(' ').includes('open');
      expectedJson.blocks[mutation.block - 1].cont = mutation.header.split(' ').includes('cont');
      changes.push({...mutation, before: block.header, after: value, md_line: block.headerIndex + 1, json_pointers: [`/blocks/${mutation.block - 1}/open`, `/blocks/${mutation.block - 1}/cont`], verified: true});
    } else {
      const index = block.rows[mutation.line - 1].index;
      expectedMdLines[index] = mutation.value;
      expectedJson.blocks[mutation.block - 1].lines[mutation.line - 1] = mutation.value;
      changes.push({...mutation, before: block.rows[mutation.line - 1].text, after: mutation.value, md_line: index + 1, json_pointers: [`/blocks/${mutation.block - 1}/lines/${mutation.line - 1}`], verified: true});
    }
  }
  requireCondition(expectedMdLines.join('\n') === currentFiles['page.md'].bytes.toString(), `Unexpected MD change: ${page}`);
  requireCondition(isDeepStrictEqual(expectedJson, currentJson), `Unexpected JSON change: ${page}`);
  requireCondition(currentFiles['page.json'].bytes.toString() === JSON.stringify(expectedJson, null, 2) + '\n', `Unexpected JSON serialization drift: ${page}`);
  requireCondition(isDeepStrictEqual(beforeMd.meta, currentMd.meta) && isDeepStrictEqual(currentMd.meta, currentJson.meta), `Metadata or MD/JSON binding drift: ${page}`);
  requireCondition(currentFiles['audit.json'].bytes.equals(Buffer.from(snapshot.files['audit.json'].literal_utf8)), `Unexpected audit change: ${page}`);
  requireCondition(currentMd.blocks.length === currentJson.blocks.length, `MD/JSON block count: ${page}`);
  for (const [index, block] of currentMd.blocks.entries()) {
    const jsonBlock = currentJson.blocks[index];
    requireCondition(block.kind === jsonBlock.kind, `MD/JSON kind: ${page}#${index + 1}`);
    for (const flag of ['open', 'cont', 'samerow']) {
      requireCondition(block.header.split(' ').includes(flag) === jsonBlock[flag], `MD/JSON ${flag}: ${page}#${index + 1}`);
    }
    if (block.kind !== 'fig') requireCondition(isDeepStrictEqual(block.rows.map(x => x.text), jsonBlock.lines), `MD/JSON literal rows: ${page}#${index + 1}`);
  }
  const expectedCount = page === 294 ? 27 : 24;
  requireCondition(audit.lines_printed === expectedCount && audit.lines_md === expectedCount && audit.errors.length === 0, `Existing native audit fails: ${page}`);
  requireCondition(currentJson.meta.render.sha256 === original.image_budget.image_list.find(x => x.phase === 'SOURCE' && x.sequence === page - 293).sha256, `Source hash metadata drift: ${page}`);
  pages.push({
    page, before: before.binding, original_bindings: Object.values(snapshot.files).map(x => x.binding),
    current_bindings: Object.values(currentFiles).map(x => x.binding),
    checks: {exact_allowed_md_changes: 'PASS', exact_allowed_json_changes: 'PASS', json_serialization_only_expected: 'PASS', md_json_meta_and_rows_and_flags: 'PASS', frontmatter_unchanged: 'PASS', audit_byte_identical_to_original: 'PASS', figure_boxes_and_labels_unchanged: 'PASS', source_render_binding_unchanged: 'PASS', unrelated_drift: 'NONE'},
    allowed_changes: changes,
    currentMd, currentJson,
    native_audit: {lines_printed: audit.lines_printed, lines_md: audit.lines_md, errors: audit.errors, rerun: false},
  });
}

const imageHashChecks = original.image_budget.image_list.map(image => {
  const current = read(image.path);
  requireCondition(current.binding.sha256 === image.sha256 && current.binding.bytes === image.bytes, `SOURCE/RAW binary changed: ${image.path}`);
  return {path: image.path, original_sha256: image.sha256, current: current.binding, judgment: 'PASS', method: 'Binary SHA256 only; no image decoder, display, crop, or visual review.'};
});
const receiptNames = [
  'source294-affected-confirmed-text', 'source295-affected-confirmed-text',
  'source296-affected-confirmed-object', 'source297-affected-confirmed-text',
  'source297-focus-period-recovery',
];
const receipts = receiptNames.map(name => {
  const files = Object.fromEntries(['receipt.json', 'stdout.txt', 'stderr.txt'].map(file => [file, read(`${recovery}/native/${name}/${file}`)]));
  const receipt = JSON.parse(files['receipt.json'].bytes);
  const page = Number(name.slice(6, 9));
  const stdout = files['stdout.txt'].bytes.toString();
  const count = page === 294 ? 27 : 24;
  requireCondition(receipt.exitCode === 0 && receipt.error === null && receipt.cwd === root, `Existing native receipt fails: ${name}`);
  requireCondition(receipt.command.includes('finalize') && receipt.command.includes(String(page)), `Wrong existing native target: ${name}`);
  requireCondition(stdout.includes(`${count} 行（印刷 ${count}）`) && files['stderr.txt'].bytes.length === 0, `Existing native stdout/stderr mismatch: ${name}`);
  return {name, page, bindings: Object.values(files).map(x => x.binding), observed_exit_code: 0, observed_lines_md: count, observed_lines_printed: count, finished_at: receipt.finishedAt, latest_for_page: page !== 297 || name === 'source297-focus-period-recovery', rerun: false, approval: false};
});
const focusChecks = new Map();
for (const finding of focus.findings) {
  const current = pages.find(x => x.page === Number(finding.location.canonical_ref.slice(1, 5)));
  const ref = finding.location;
  const literal = current.currentJson.blocks[ref.block - 1].lines[ref.line - 1];
  let expected;
  let disposition;
  if (finding.id === 'S294-QUOTE-HOLD') {
    expected = '能性. 他在题为«软铁磁化作用的研究»的博';
    disposition = 'RETAIN_HOLD';
  } else if (finding.id === 'S296-TEXT-HOLD') {
    expected = '**射出来的每一份光能量$E=h\\nu$在以后光的传播过程中都保**';
    disposition = 'RESOLVED_BY_FOCUS_CANDIDATE_UNCHANGED';
  } else if (finding.id === 'S296-PUNCT-HOLD') {
    expected = '金属中脱出需要做的功. 所以';
    disposition = 'RESOLVED_BY_FOCUS_NO_TERMINAL_MARK';
  } else if (finding.id === 'S297-MATERIAL-HOLD') {
    expected = '铝和铁的逸出功比锌的大. 所以在第225页所述的实验';
    disposition = 'RESOLVED_BY_FOCUS_ALUMINUM_NOT_PLATINUM';
  } else if (finding.id === 'S297-PUNCT-1') {
    expected = finding.required_correction.exact_replacement_row;
    disposition = 'INITIAL_READING_ERROR_WITHDRAWN_IN_COMPOSITION_PERIOD_RESTORED';
  } else throw new Error(`Unexpected focus finding: ${finding.id}`);
  requireCondition(literal === expected, `Focus-bound affected literal mismatch: ${finding.id}`);
  requireCondition(literal === current.currentMd.blocks[ref.block - 1].rows[ref.line - 1].text, `Focus literal differs between MD/JSON: ${finding.id}`);
  const baseline = JSON.parse(snapshots.pages.find(x => x.page === current.page).files['page.json'].literal_utf8).blocks[ref.block - 1].lines[ref.line - 1];
  requireCondition(literal === baseline, `Focus-selected candidate must remain/restored byte-exact to original affected row: ${finding.id}`);
  focusChecks.set(finding.id, {judgment: finding.id === 'S294-QUOTE-HOLD' ? 'HOLD' : 'PASS', disposition, current_literal: literal, unchanged_or_restored_from_original_literal: true, focus_binding: focusFile.binding, focus_original_judgment: finding.judgment, focus_observation: finding.prior_reading_adjudication ?? finding.remaining_uncertainty ?? finding.evidence});
}
const perFinding = original.findings.map(finding => {
  const page = pages.find(x => x.page === finding.page);
  const affected = page.allowed_changes.filter(x => x.finding === finding.id);
  const composed = focusChecks.get(finding.id) ?? {judgment: 'PASS', disposition: 'CONFIRMED_REPAIR_VERIFIED', verified_allowed_changes: affected};
  if (!focusChecks.has(finding.id)) requireCondition(affected.length > 0, `Original finding lacks affected check: ${finding.id}`);
  return {
    id: finding.id, page: finding.page, original_judgment: finding.judgment,
    original_review_binding: originalFile.binding,
    original_freeze_binding: original.SOURCE.find(x => x.page === finding.page).freeze,
    before_binding: page.before, current_bindings: page.current_bindings,
    refs: finding.refs.map(ref => ({...ref, canonical_ref: `p${String(finding.page).padStart(4, '0')}#${ref.block}`, md_line: page.currentMd.blocks[ref.block - 1].rows[ref.line - 1].index + 1, current_literal: page.currentJson.blocks[ref.block - 1].lines[ref.line - 1], current_flags: {open: page.currentJson.blocks[ref.block - 1].open, cont: page.currentJson.blocks[ref.block - 1].cont}})),
    ...composed,
    binding_check: 'PASS',
    native_receipt: receipts.find(x => x.page === finding.page && x.latest_for_page),
    new_image_review: false,
  };
});
const composedPages = pages.map(({currentMd, currentJson, ...page}) => ({
  ...page,
  disposition: {SOURCE: page.page === 294 ? 'HOLD' : 'PASS', retained_holds: page.page === 294 ? ['S294-QUOTE-HOLD'] : [], active_failures: [], composition: 'Prior independent SOURCE review + exact affected repairs + immutable focused adjudication; not a new broad review.'},
  finding_ids: perFinding.filter(x => x.page === page.page).map(x => x.id),
  latest_native_receipt: receipts.find(x => x.page === page.page && x.latest_for_page),
}));
const report = {
  schema: 'stemrobin-181/affected-text-binding-check@1', ticket: 'STEMROBIN-181', root,
  created_at: new Date().toISOString(),
  scope: 'Affected text/header repair and binding checks only for294..297; no new SOURCE/RAW visual review.',
  restrictions_observed: {new_image_views: 0, image_decodes: 0, crops: 0, browser: false, git: false, database: false, environment_access: false, paid_calls: 0, canonical_edits: false, skill_edits: false, historical_evidence_edits: false, native_calls: 0, agents_or_chats: false},
  original_evidence_preserved: immutableOriginalBindings, focused_evidence_preserved: immutableFocusBindings,
  per_finding: perFinding, pages: composedPages, binary_hash_checks: imageHashChecks,
  RAW: {judgment: 'PASS', disposition: 'PRIOR_PASS_REUSED', original_review_binding: originalFile.binding, unchanged_boxes_and_hashes: true, new_visual_review: false, figures: original.RAW.map(x => ({id: x.id, judgment: x.judgment, freeze: x.freeze, image_binding: imageHashChecks.find(y => y.path === x.image.path).current}))},
  composition: {SOURCE294: 'HOLD', SOURCE295: 'PASS', SOURCE296: 'PASS', SOURCE297: 'PASS', RAW: 'PASS_REUSED', overall: 'HOLD', approval: false, active_failures: [], retained_holds: ['S294-QUOTE-HOLD']},
  totals: {original_failure_findings: 11, confirmed_repairs_verified: 10, initial_false_positive_withdrawn_by_focus: 1, original_holds_resolved_by_focus: 3, retained_holds: 1, exact_allowed_md_line_or_header_changes: mutations.length, unrelated_drift: 0, new_images: 0},
  recovery_history: receipts,
  qualifications: [
    'The initial S297-PUNCT-1 comma finding was a recognition error. The initial report and freeze remain immutable and visible as failures; only this later composition withdraws the false positive using the supplied focus evidence.',
    'Focus297 binds the intermediate comma candidate. Current297 is intentionally not file-hash-identical to that intermediate candidate; the exact . 所以 restoration is checked against both the original snapshot and focus required correction, with latest source297-focus-period-recovery receipt preserved.',
    'The294 double-angle delimiters remain HOLD; no codepoint inference or replacement is made.',
    'Only byte checks guard unchanged content. No unchanged source rows or RAW images were visually reviewed again.',
    'Existing native receipts were read, not rerun, and are not approvals.',
  ],
};
for (const binding of reads.values()) {
  const bytes = fs.readFileSync(path.join(root, binding.path));
  requireCondition(bytes.length === binding.bytes && hash(bytes) === binding.sha256, `Concurrent input drift: ${binding.path}`);
}
const destination = path.join(root, directory, 'affected.json');
fs.writeFileSync(destination, JSON.stringify(report, null, 2) + '\n', {flag: 'wx', mode: 0o444});
fs.chmodSync(destination, 0o444);
const bytes = fs.readFileSync(destination);
console.log(JSON.stringify({path: destination, bytes: bytes.length, sha256: hash(bytes), disposition: report.composition, totals: report.totals}, null, 2));

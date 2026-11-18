import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const workspace = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const ticketRoot = path.join(workspace, '.intentfold/tickets/STEMROBIN-181');
const root = path.join(ticketRoot, 'tmp/d553-source201-first-independent-review');
const authorRoot = path.join(ticketRoot, 'tmp/d542-source201-first-author');
const absolute = file => path.resolve(workspace, file);
const read = file => JSON.parse(fs.readFileSync(absolute(file), 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(absolute(file))).digest('hex');
const bind = file => ({
  path: absolute(file),
  sha256: hash(file),
  bytes: fs.statSync(absolute(file)).size,
  mode: `0${(fs.statSync(absolute(file)).mode & 0o777).toString(8)}`
});
const checkedInputs = [];
function verify(file, expected, role) {
  const row = bind(file);
  assert.equal(row.sha256, expected, file);
  checkedInputs.push({ ...row, role, verified: true });
  return row;
}
function writeOnce(name, value) {
  const target = path.join(root, name);
  assert.equal(path.dirname(target), root);
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx', mode: 0o444 });
}

verify(`${authorRoot}/report.json`, 'fb27002c2e1646694a1d401d0f9a50856532495018f8606de35027125e94dbfa', 'authorized_author_report');
verify(`${authorRoot}/author-freeze.json`, '708b4beaff5a9406c07b471b6067a365a251e34e22f4bc275933e5b056680dde', 'authorized_author_freeze');
verify(`${authorRoot}/boundary-fig174-owner.json`, '5d100c7bec19c5bfe43e6a342d85a9003182df982bd81481b48fdd2a47fb3578', 'authorized_author_boundary_not_pixel_truth');
const authorFreeze = read(`${authorRoot}/author-freeze.json`);
for (const row of authorFreeze.files) {
  assert.equal(hash(row.path), row.sha256, row.path);
  assert.equal(bind(row.path).mode, '0444', row.path);
}
verify(`${root}/inventory.json`, '8d657b61301b06194a4a11682d89e830b1bf6279fb34d8260b9fa4472860592c', 'independent_source_inventory_frozen_before_candidate_full_text');
assert.equal(bind(`${root}/inventory.json`).mode, '0444');
const inventory = read(`${root}/inventory.json`);
const opens = read(`${root}/actual-opens.json`);
assert.equal(opens.total, 7);
assert.equal(opens.opens.length, 7);
assert.equal(opens.starting_images, 0);
assert.equal(opens.crop_opens, 2);
assert.equal(opens.batch_closed, true);
assert.ok(opens.total <= 8 && opens.total <= 24);
for (const [index, row] of opens.opens.entries()) {
  assert.equal(row.sequence, index + 1);
  assert.equal(row.observed, true);
  verify(row.path, row.sha256, row.role);
}
const previewPath = path.join(ticketRoot, 'tmp/d551-source201-svg-and-source202-preparation/source201-previews.json');
const previews = read(previewPath);
checkedInputs.push({ ...bind(previewPath), role: 'parent_first_SVG_preview_manifest', verified: true });
assert.equal(previews.authorFreeze.sha256, hash(`${authorRoot}/author-freeze.json`));
assert.equal(previews.rasterizationInvocations, 2);
for (const figure of previews.previews) {
  assert.equal(figure.firstNativePreview, true);
  assert.equal(figure.previewCount, 1);
  for (const role of ['RAW', 'svg', 'preview']) {
    verify(figure[role].path, figure[role].sha256, `${figure.figure}_${role}_manifest_binding`);
  }
}

const pagePath = `${authorRoot}/source/10p/pages/0201/page.json`;
const page = read(pagePath);
const auditPath = `${authorRoot}/source/10p/pages/0201/audit.json`;
const audit = read(auditPath);
checkedInputs.push({ ...bind(pagePath), role: 'compared_candidate_page_json', verified: true });
checkedInputs.push({ ...bind(`${authorRoot}/source/10p/pages/0201/page.md`), role: 'compared_candidate_page_md', verified: true });
checkedInputs.push({ ...bind(auditPath), role: 'existing_native_audit_not_visual_truth', verified: true });
const clean = text => text.replaceAll('**', '').replaceAll('$F$', 'F').replaceAll('$D$', 'D')
  .replaceAll('$D=\\frac{1}{F}$', 'D = 1/F').replace(/\s/gu, '');
const mapping = [
  [1, 0, 0], [2, 0, 1], [3, 1, 0], [4, 1, 1], [5, 1, 2],
  [6, 1, 3], [7, 1, 4], [8, 1, 5], [10, 6, 0], [11, 6, 1],
  [12, 6, 2], [13, 7, 0], [14, 7, 1], [15, 8, 0], [16, 8, 1], [17, 9, 0]
];
const lineChecks = mapping.map(([row, block, line]) => {
  const expected = inventory.printed_rows.find(item => item.row === row).literal;
  const actual = page.blocks[block].lines[line];
  assert.equal(clean(actual), clean(expected), `printed row ${row}`);
  return { printed_row: row, native_ref: `p0201#${block + 1}`, pointer: `/blocks/${block}/lines/${line}`, matches: true };
});
assert.equal(page.blocks[4].kind, 'cap');
assert.equal(page.blocks[5].kind, 'cap');
assert.equal(page.blocks[5].samerow, true);
assert.equal(clean(page.blocks[4].lines[0]), clean('图175'));
assert.equal(clean(page.blocks[5].lines[0]), clean('图176'));
lineChecks.push({ printed_row: 9, native_refs: ['p0201#5', 'p0201#6'], matches: true, samerow: true });
assert.equal(page.blocks[0].cont, true);
assert.equal(page.blocks[0].open, false);
assert.equal(page.blocks[8].open, false);
assert.equal(page.blocks[9].kind, 'foot');
assert.equal(page.blocks.some(block => ['h1', 'h2', 'h3'].includes(block.kind)), false);
assert.equal(page.blocks[1].lines[0].startsWith('**发散透镜**'), true);
assert.equal(page.blocks[6].lines[0].startsWith('**透镜的光焦度**'), true);
assert.equal(page.blocks[6].lines[0].includes('**焦距的倒数值叫做透镜的光焦度**'), true);
assert.equal(page.blocks[6].lines[2], '$D=\\frac{1}{F}$.');
assert.equal(inventory.line_accounting.independently_counted_total, 17);
assert.equal(audit.lines_printed, 17);
assert.equal(audit.lines_md, 17);
assert.deepEqual(audit.errors, []);

const d547Path = path.join(ticketRoot, 'evidence/reports/d547-source200-consumed-and-first-modern-figures.json');
verify(d547Path, '414a9be73d1c45b07320822012cf5bee7b58853b3291903a0acdad10cf7f0b7e', 'existing_SOURCE200_consumption_receipt');
const d547 = read(d547Path);
assert.equal(d547.sourcePagesFinalized, 432);
assert.equal(d547.source200.SOURCE, 'PASS');
assert.equal(d547.source200.fig174Owner, 'HOLD-PENDING-ACTUAL-NEXT-PAGE-REFERENCE');
verify(d547.source200.firstIndependentReview.path, '02e5a268e3c1aaf9c0e775fb59aea8e684125ebf96838bc9978d87bfbcde375e', 'retained_d540_SOURCE200_review');
verify(d547.source200.firstIndependentReviewFreeze.path, '6112fa34f23b065ff434755dd7276af098d6beebbeb24ff93eb1359b30afa9ea', 'retained_d540_SOURCE200_review_freeze');
const d498Path = path.join(ticketRoot, 'evidence/reports/d498-source197-consumed-and-next-source-prepared.json');
verify(d498Path, 'd0dc058a4ff830a7fd195f99d5755e561ec7a2b31e75a911e04bc9e8d88fed15', 'existing_SOURCE197_consumption_receipt');
const d498 = read(d498Path);
const priorPages = [
  [197, '94d3c61213d55ae5ce5b936c7126cf878f44da0ef2199e9ec4e2387185928194'],
  [198, '307f82bf3775f1204501be899995b3e619cbc5b75e8c4630e33b231023f3f4a2'],
  [199, '12f6b5ffe35135c46908db81f29b7fbd02f08f84c252014025cf9abc3fcf1334'],
  [200, '6e4caa9a1c1e8d2df3ed9c07024d0c5820475bb2423d5c5ab28b491fd24b6737']
];
const pages = new Map();
for (const [number, expected] of priorPages) {
  const file = path.join(workspace, `ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0${number}/page.json`);
  verify(file, expected, `existing_SOURCE${number}_text_only_owner_chain`);
  pages.set(number, read(file));
}
assert.equal(d498.outputs.find(row => row.path.endsWith('/0197/page.json')).sha256, hash(checkedInputs.find(row => row.role === 'existing_SOURCE197_text_only_owner_chain').path));
assert.equal(d547.outputs.find(row => row.path.endsWith('/0200/page.json')).sha256, hash(checkedInputs.find(row => row.role === 'existing_SOURCE200_text_only_owner_chain').path));
assert.equal(pages.get(197).blocks[2].kind, 'h3');
assert.deepEqual(pages.get(197).blocks[2].lines, ['75. 透镜']);
for (const number of [198, 199, 200]) {
  assert.equal(pages.get(number).blocks.some(block => ['h1', 'h2', 'h3'].includes(block.kind)), false);
}
const tail = pages.get(200).blocks[5];
assert.equal(tail.kind, 'p');
assert.equal(tail.cont, true);
assert.equal(tail.open, true);
assert.equal(tail.lines[0], inventory.paragraph_and_owner_observations.source200_tail_supplied_by_user_not_reopened);
assert.equal(pages.get(200).blocks[6].id, 'fig-174');
assert.equal(pages.get(200).blocks[7].label, '图 174');
assert.equal(pages.get(199).blocks[13].open, true);
assert.equal(pages.get(200).blocks[3].cont, true);
assert.equal(pages.get(200).blocks[3].open, true);
const fig174ReferencingBlocks = page.blocks.flatMap((block, index) => block.kind === 'p' && block.lines.some(line => line.includes('图174')) ? [index] : []);
assert.deepEqual(fig174ReferencingBlocks, [0]);
assert.ok(page.blocks[0].lines[0].includes('图174а'));
assert.ok(page.blocks[0].lines[1].includes('图174б'));

const findings = read(`${root}/findings.json`);
for (const gate of ['SOURCE201', 'RAW', 'FIRST_ORIGINAL_SVG_NECESSARY', 'SOURCE174_OWNER']) {
  assert.equal(findings.gates[gate].status, 'PASS');
  assert.deepEqual(findings.gates[gate].blocking_list, []);
}
assert.equal(findings.signoffs.fullcard, false);
assert.equal(findings.signoffs.strict_blind_ordering, false);
const verification = {
  schema: 'stemrobin181/d553-scoped-readonly-verification@1',
  checked_at: new Date().toISOString(),
  independent_inventory_frozen_at_before_candidate_full_text: '2026-11-18T11:16:15.428Z',
  author_freeze_files_checked: authorFreeze.files.length,
  author_freeze_mismatches: 0,
  line_checks: lineChecks.sort((a, b) => a.printed_row - b.printed_row),
  normalization: 'Only Markdown bold/math wrappers, exact D=1/F serialization and whitespace; no word or punctuation replacement.',
  all_17_printed_rows_checked: true,
  source_and_candidate_lines: [17, 17],
  fig174_owner: findings.gates.SOURCE174_OWNER,
  images_actually_opened: opens.total,
  no_additional_image_loads_in_this_script: true,
  prepare_finalize_vectorize_render_reruns: 0,
  git_DB_paid_publish_or_whole_project_commands: 0,
  source202_not_read: true
};
writeOnce('verification.json', verification);
writeOnce('input-bindings.json', {
  schema: 'stemrobin181/d553-input-bindings@1',
  inputs: checkedInputs,
  author_freeze_files_verified: authorFreeze.files.length,
  existing_parent_preview_bindings_verified: 2,
  checks_are_hash_or_text_only_not_additional_image_opens: true
});
const report = {
  schema: 'stemrobin181/source201-first-independent-review@1',
  ticket: 'STEMROBIN-181',
  batch: 'd553',
  status: 'READY',
  ready_scope: 'One-shot SOURCE201 necessary text/RAW175176/first original SVG175176 and unique source fig174 n75 owner; retain ordering disclosure; no canonical consumption, modern gate, publication or fullcard.',
  owned_root: root,
  authorization: 'Latest direct user short-batch restoration; independent one-off reviewer, not new or replacement resident A-D.',
  requested_branch_not_queried_or_modified: 'original STEMROBIN-181 shared checkout; no git commands',
  completed_at: new Date().toISOString(),
  inputs: checkedInputs,
  gates: findings.gates,
  per_figure: findings.per_figure,
  necessary_blocking_list: findings.necessary_blocking_list,
  process_disclosure: findings.process_disclosure,
  retained_holds_and_unsigned_gates: findings.retained_holds_and_unsigned_gates,
  historical_statuses: findings.historical_statuses,
  actual_opens: { ...bind(`${root}/actual-opens.json`), total: 7, wholepage: 1, crop: 2, RAW: 2, first_SVG_preview: 2, starting_context: 0, ending_context: 7, batch_limit: 8, context_limit: 24, reopens: 0 },
  signoffs: findings.signoffs,
  guardrails: {
    git_commands: 0, DB_operations: 0, paid_operations: 0, prepare_finalize_vectorize_or_rasterization_reruns: 0,
    new_agents_or_replacement_A_D: 0, new_branches_worktrees: 0, source_or_candidate_edits: 0,
    whole_project_validation: 0, canonical_index_meter_writes: 0, publication_or_deployment: 0,
    rollback_cleanup_or_shared_changes_reverted: 0, source200_image_reopens: 0, fig174_image_reopens: 0,
    source202_image_opens: 0, old_HOLD_history_edits: 0, old_image_budgets_reset: false,
    writes_only_under: root
  },
  artifacts: Object.fromEntries(['inventory.json', 'raw-inventory.json', 'findings.json', 'actual-opens.json', 'verification.json', 'input-bindings.json'].map(name => [name, bind(`${root}/${name}`)])),
  review_freeze_path: `${root}/review-freeze.json`,
  final_file_mode: '0444',
  batch_closed: true,
  n75_complete: false,
  n75_approved_complete: false,
  fullcard: false,
  no_further_image_batch_accepted: true,
  image_payload_in_return: false,
  source_pages_consumed: 0,
  complete_cards_consumed: 0,
  disposition: 'Return only textual statuses and report/freeze paths and hashes. No further image opens.'
};
writeOnce('report.json', report);
for (const name of fs.readdirSync(root)) {
  assert.equal(fs.statSync(path.join(root, name)).isFile(), true);
  fs.chmodSync(path.join(root, name), 0o444);
}
const files = fs.readdirSync(root).sort().map(name => bind(`${root}/${name}`));
writeOnce('review-freeze.json', {
  schema: 'stemrobin181/d553-independent-review-freeze@1',
  ticket: 'STEMROBIN-181', batch: 'd553', frozen_at: new Date().toISOString(),
  root, files, file_count_excluding_self_and_READY: files.length,
  excludes: ['review-freeze.json', 'READY.json'],
  all_listed_modes: '0444', self_mode: '0444',
  strict_blind_ordering_claimed: false,
  process_disclosure: findings.process_disclosure,
  report: bind(`${root}/report.json`),
  actual_images: 7, batch_closed: true, no_further_image_opens: true
});
writeOnce('READY.json', {
  schema: 'stemrobin181/d553-ready@1', ticket: 'STEMROBIN-181', batch: 'd553',
  status: 'READY', scope: report.ready_scope,
  report: bind(`${root}/report.json`), review_freeze: bind(`${root}/review-freeze.json`),
  source201: 'PASS', RAW175176: 'PASS', first_original_SVG175176: 'PASS',
  fig174_unique_n75_owner: 'PASS', necessary_blocking_list: [],
  strict_blind_ordering: 'NOT_SIGNED_ORDERING_DISCLOSURE',
  source202_right_boundary: 'HOLD_UNSEEN', n75_modern_SCI_FIG_DISPLAY_fullcard: 'NOT_SIGNED',
  actual_images: 7, file_mode: '0444', writes_only_under: root,
  batch_closed: true, further_whole_batches_accepted: false, images_returned_to_parent: 0,
  no_git_DB_publish_paid_native_or_project_replays: true
});
const freeze = read(`${root}/review-freeze.json`);
for (const row of freeze.files) {
  assert.equal(hash(row.path), row.sha256);
  assert.equal(bind(row.path).mode, '0444');
}
for (const name of fs.readdirSync(root)) assert.equal(bind(`${root}/${name}`).mode, '0444');
console.log(JSON.stringify({
  report: bind(`${root}/report.json`),
  review_freeze: bind(`${root}/review-freeze.json`),
  READY: bind(`${root}/READY.json`),
  actual_images: 7, gates: Object.fromEntries(Object.entries(findings.gates).map(([name, gate]) => [name, gate.status])),
  necessary_blocking_list: [], file_count: fs.readdirSync(root).length, all_modes: '0444',
  ordering_disclosure_preserved: true, batch_closed: true
}, null, 2));

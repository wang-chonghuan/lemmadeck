import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scratch = path.dirname(fileURLToPath(import.meta.url));
const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
assert.equal(process.cwd(), repo);
assert.equal(scratch, path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1206-source267-caption-enum-repair'));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const read = filename => fs.readFileSync(filename);
const load = filename => JSON.parse(read(filename));
const entry = filename => ({ path: filename, sha256: sha(read(filename)), bytes: fs.statSync(filename).size });
const baseline = load(path.join(scratch, 'baseline.json'));
for (const original of baseline.preserved) {
  assert.deepEqual(entry(original.path), original, `Original changed: ${original.path}`);
}
const source = path.join(baseline.original_author, 'root/10p/pages/0267');
const current = path.join(scratch, 'root/10p/pages/0267');
const sourcePage = load(path.join(source, 'page.json'));
const currentPage = load(path.join(current, 'page.json'));
const expectedPage = structuredClone(sourcePage);
expectedPage.meta.printed_lines = 25;
expectedPage.blocks[6].samerow = true;
assert.deepEqual(currentPage, expectedPage);
const expectedMarkdown = read(path.join(source, 'page.md')).toString('utf8')
  .replace('"printed_lines": 26,', '"printed_lines": 25,')
  .replace('<!-- cap \u56fe 228a -->', '<!-- cap \u56fe 228a samerow -->');
assert.deepEqual(read(path.join(current, 'page.md')), Buffer.from(expectedMarkdown));
const sourceAudit = load(path.join(source, 'audit.json'));
const audit = load(path.join(current, 'audit.json'));
const expectedAudit = structuredClone(sourceAudit);
expectedAudit.lines_md = 25;
expectedAudit.errors = [];
assert.deepEqual(audit, expectedAudit);
assert.equal(audit.lines_printed, 25);
assert.equal(audit.lines_md, 25);
assert.deepEqual(audit.errors, []);
assert.deepEqual(audit.normalizations, []);
assert.equal(currentPage.blocks.length, 10);
assert.equal(currentPage.blocks[0].lines[0], '**100. \u540c\u6b65\u56de\u65cb\u52a0\u901f\u5668**');
assert.equal(currentPage.blocks[6].kind, 'cap');
assert.equal(currentPage.blocks[6].label, '\u56fe 228a');
assert.equal(currentPage.blocks[4].open, true);
assert.equal(currentPage.blocks[7].cont, true);
assert.equal(currentPage.blocks[8].open, true);
assert.ok(currentPage.blocks[8].lines.at(-1).endsWith('\u4fdd\u6301'));
assert.ok(currentPage.blocks.every(block => !['ex', 'exhead'].includes(block.kind)));

const files = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(item => {
  const filename = path.join(directory, item.name);
  assert.ok(!item.isSymbolicLink(), filename);
  return item.isDirectory() ? files(filename) : [filename];
}).sort();
const tree = directory => {
  const manifest = files(directory).map(filename => ({
    relative_path: path.relative(directory, filename),
    ...entry(filename),
  }));
  return {
    path: directory,
    sha256: sha(JSON.stringify(manifest.map(({ relative_path, sha256, bytes }) => ({ relative_path, sha256, bytes })))),
    hash_definition: 'SHA-256 of compact JSON sorted relative_path/sha256/bytes manifest.',
    files: manifest,
  };
};
const root = tree(path.join(scratch, 'root'));
const work = tree(path.join(scratch, 'work'));
assert.deepEqual(root.files.map(item => item.relative_path), files(path.join(baseline.original_author, 'root'))
  .map(filename => path.relative(path.join(baseline.original_author, 'root'), filename)));
assert.deepEqual(work.files.map(item => item.relative_path), files(path.join(baseline.original_author, 'work'))
  .map(filename => path.relative(path.join(baseline.original_author, 'work'), filename)));
for (const file of work.files) {
  assert.deepEqual(read(file.path), read(path.join(baseline.original_author, 'work', file.relative_path)));
}
const sourcePng = work.files.find(item => item.relative_path === '10p/pages/0267/page.png');
const cropPng = work.files.find(item => item.relative_path === '10p/pages/0267/figures/fig-228.png');
assert.equal(sourcePng.sha256, '82108a0d862859bf75d8c29ae33c00f641c305ad3f5971d0fbd85159efdcdead');
assert.equal(cropPng.sha256, '30e2beac18aa789e30dc4d70feef9e5db91d608b4027c5d0c80efaa5d9c01195');
assert.ok(work.files.every(item => !item.path.endsWith('.svg')));

const recorded = directory => {
  const receipt = load(path.join(directory, 'receipt.json'));
  const started = load(path.join(directory, 'started.json'));
  assert.equal(receipt.exit, 0);
  assert.equal(receipt.signal, null);
  assert.equal(receipt.error, null);
  assert.equal(receipt.stdoutSha256, sha(read(path.join(directory, 'stdout.txt'))));
  assert.equal(receipt.stderrSha256, sha(read(path.join(directory, 'stderr.txt'))));
  assert.deepEqual(receipt.command, started.command);
  assert.equal(receipt.cwd, repo);
  return {
    ...receipt,
    files: ['started.json', 'receipt.json', 'stdout.txt', 'stderr.txt']
      .map(filename => entry(path.join(directory, filename))),
  };
};
const checks = recorded(path.join(scratch, 'checks'));
const tests = load(path.join(scratch, 'checks/stdout.txt'));
assert.equal(tests.passed, 16);
assert.equal(tests.failed, 0);
assert.ok(tests.results.every(result => result.pass));
const finalize = recorded(path.join(scratch, 'finalize'));
assert.deepEqual(finalize.command.slice(3, 8), ['finalize', '--book', '10p', '--page', '267']);
assert.equal(finalize.command[finalize.command.indexOf('--root') + 1], root.path);
assert.equal(finalize.command[finalize.command.indexOf('--work') + 1], work.path);
assert.equal(load(path.join(baseline.original_failure, 'receipt.json')).exit, 1);

const tool = entry(path.join(repo, '.claude/skills/ld-s10y-lesson/tools/p2c.py'));
const beforeTool = entry(path.join(scratch, 'p2c.before.py'));
assert.equal(beforeTool.sha256, baseline.p2c_before.sha256);
const codeChanges = [
  'Extract the existing page enum scan into _validate_page_enums; preserve all-block checking and Cyrillic/numeric acceptance.',
  'Use per-marker positions to exempt only prose parenthetical figure references split before an ASCII suffix, with an exact current fig/cap label match.',
];
const candidateChanges = [
  { file: path.join(current, 'page.md'), change: 'cap \u56fe 228a gains samerow; computed printed_lines 26 -> 25. All other bytes unchanged.' },
  { file: path.join(current, 'page.json'), changes: [
    { pointer: '/blocks/6/samerow', before: false, after: true },
    { pointer: '/meta/printed_lines', before: 26, after: 25 },
  ] },
  { file: path.join(current, 'audit.json'), changes: [
    { pointer: '/lines_md', before: 26, after: 25 },
    { pointer: '/errors', before: sourceAudit.errors, after: [] },
  ] },
];
const usage = {
  schema: 'source267-caption-enum-repair-usage/v1',
  ticket: 'STEMROBIN-181',
  date: '2026-11-19',
  phase: 'BOUNDED_TECHNICAL_AND_LAYOUT_REPAIR',
  actual_image_opens: 0,
  image_payloads: 0,
  image_generation_calls: 0,
  source_content_reauthors: 0,
  source_layout_metadata_repairs: 1,
  technical_helper_repairs: 1,
  focused_check_runs: 1,
  focused_checks_passed: 16,
  finalize_runs: 1,
  prepare_vectorize_assemble_render_runs: 0,
  full_project_checks: 0,
  paid_network_chat_operations: 0,
  git_status_operations: 0,
  database_publisher_operations: 0,
  dependency_skill_global_meter_changes: 0,
  new_worktrees_permanent_workers: 0,
  writes_outside_owned_code_and_scratch: 0,
  source_and_original_crop_writes: 0,
  crop_note: 'Required native finalize deterministically rewrote only the copied crop; full PNG bytes verified identical. No agent image viewing.',
  exact_changes: { code: codeChanges, candidate: candidateChanges, work_bytes_changed: 0 },
  original_evidence_and_others_edits_preserved: true,
  promotion_vectorization_rendering_publication: 'NOT_AUTHORIZED_NOT_PERFORMED',
};
const write = (filename, value) => fs.writeFileSync(filename, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
write(path.join(scratch, 'usage.json'), usage);
const report = {
  schema: 'source267-caption-enum-repair/v1',
  ticket: 'STEMROBIN-181',
  date: '2026-11-19',
  book: '10p',
  page: 267,
  cwd: repo,
  status: 'NATIVE_PASS; AFFECTED_SOURCE_REVIEW_PENDING; NOT_PROMOTED',
  independent_review: baseline.independent_review,
  original_failure_preserved: baseline.original_failure,
  immutable_originals: baseline.preserved,
  current_root: root,
  current_work: work,
  p2c: { current: tool, before: beforeTool, exact_changes: codeChanges },
  source_layout: {
    caption: '\u56fe 228a',
    separate_semantic_caption: true,
    shared_physical_row: 'R20',
    body_rows: 23,
    heading_rows: 1,
    footer_rows: 1,
    caption_additional_rows: 0,
    computed_rows: 25,
    exact_changes: candidateChanges,
  },
  assertions: {
    native_errors: audit.errors,
    lines_printed: audit.lines_printed,
    lines_md: audit.lines_md,
    exact_source_blocks_except_caption_samerow: true,
    exact_source_metadata_except_printed_lines: true,
    exact_markdown_bytes_except_caption_header_and_printed_lines: true,
    math_prose_heading_100_and_open_cont_unchanged: true,
    no_exercise_or_n99_invented: true,
    source_and_all_work_png_bytes_unchanged: true,
    RAW_audit_geometry_and_original_from_box_unchanged: true,
    all_20_preserved_original_files_hash_unchanged: baseline.preserved.length === 20,
    original_native_failure_exit: 1,
    no_SVG_or_render_created: true,
  },
  focused_tests: {
    script: entry(path.join(scratch, 'focused-checks.py')),
    specification_basis: tests.specification,
    passed: tests.passed,
    failed: tests.failed,
    results: tests.results,
    receipt: checks,
  },
  single_finalize_receipt: finalize,
  usage: entry(path.join(scratch, 'usage.json')),
  repair_evidence: ['baseline.json', 'prepare-copy.mjs', 'verify-report.mjs']
    .map(filename => entry(path.join(scratch, filename))),
  image_usage: { actual_image_opens: 0, image_payloads: 0 },
  next_step: 'Affected SOURCE reviewer decides candidate promotion. No vectorization or rendering yet.',
};
write(path.join(scratch, 'report.json'), report);
console.log(JSON.stringify({
  report: entry(path.join(scratch, 'report.json')),
  usage: entry(path.join(scratch, 'usage.json')),
  current_root_sha256: root.sha256,
  current_work_sha256: work.sha256,
  p2c_sha256: tool.sha256,
  focused_checks: tests.passed,
  native_rows: `${audit.lines_md}/${audit.lines_printed}`,
  errors: audit.errors,
  preserved_original_files: baseline.preserved.length,
}, null, 2));

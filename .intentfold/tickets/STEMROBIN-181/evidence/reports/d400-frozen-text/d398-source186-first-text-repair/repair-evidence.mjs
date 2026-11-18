import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const tmp = path.dirname(root);
const baseline = path.join(tmp, 'd393-source186-first-author');
const review = path.join(tmp, 'd396-source186-first-text-review');
const page = 'source/10p/pages/0186/';
const tools = path.join(repo, '.claude/skills/ld-s10y-lesson/tools');
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
const candidateDirs = ['source', 'work', 'first-svg-preview'];
const expectedPointers = ['/blocks/0/lines/5', '/blocks/8/lines/1'];
const affectedIds = ['D396-S186-W001', 'D396-S186-E001'];
const requiredLines = [
  '$D$. 因此，点 $D$ 同时位于焦平面和光轴上，即位于它们的交',
  '出点 $A_1$，取上面列举的光线中的**任意两条**就行了. 入射到镜',
];
const reviewHashes = {
  'report.json': '9d72c7496e8eaf22b31f950d5e97ed76a4ab33978be882b37e140900d18653df',
  'review-freeze.json': '208741140e9a8b1b30aad5e6e1e813f96d0fdea0000cb20485fb03d3fdd3651c',
  'independent-text-inventory.json': '303ddd09419877c350dadd1b3d0b106ec2c95f7ab9bdcd8149115656881847bd',
  'independent-text-freeze.json': 'f6480625df94d18d56464046dd60d02b880900e46649b2f5b423c83d5f872d85',
  'bindings.json': '18e826fe23de1d4d790ce3a0ffc70e97f7fff57826e6c51f19ed0590d75799fd',
};
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
function binding(p) {
  const bytes = fs.readFileSync(p);
  return { path: p, sha256: crypto.createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length };
}
function write(relative, value) {
  const target = path.resolve(root, relative);
  assert(target.startsWith(root + '/'));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
}
function files(dir) {
  return fs.readdirSync(dir).sort().flatMap(name => {
    const p = path.join(dir, name);
    const stat = fs.lstatSync(p);
    assert(!stat.isSymbolicLink(), `Symlink outside bounded copy contract: ${p}`);
    return stat.isDirectory() ? files(p) : [p];
  });
}
function verify({ path: p, sha256, bytes }) {
  assert.deepEqual(binding(p), { path: p, sha256, bytes });
}
function verifyProtected(entries) {
  for (const entry of entries) {
    verify(entry);
    assert.equal(fs.statSync(entry.path).mode & 0o777, entry.mode);
  }
  assert.deepEqual([...files(baseline), ...files(review)], entries.map(entry => entry.path));
}
function copy(src, relative, mode = 0o444) {
  const dest = path.resolve(root, relative);
  assert(dest.startsWith(root + '/'));
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(dest, mode);
  const original = binding(src);
  const copied = binding(dest);
  assert.equal(original.sha256, copied.sha256);
  assert.equal(original.bytes, copied.bytes);
  return { relative, original, copy: copied };
}
function differences(a, b, pointer = '') {
  if (JSON.stringify(a) === JSON.stringify(b)) return [];
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
    return [{ pointer, before: a, after: b }];
  }
  assert.equal(Array.isArray(a), Array.isArray(b), `Container type changed at ${pointer}`);
  if (Array.isArray(a)) assert.equal(a.length, b.length, `Array length changed at ${pointer}`);
  const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])];
  return keys.flatMap(key => differences(a[key], b[key],
    `${pointer}/${key.replaceAll('~', '~0').replaceAll('/', '~1')}`));
}
function compareText() {
  const before = read(path.join(root, 'before/page.json'));
  const after = read(path.join(root, page, 'page.json'));
  const report = read(path.join(root, 'inputs/review/report.json'));
  const findings = report.findings.filter(finding => finding.status === 'FAIL');
  assert.deepEqual(findings.map(finding => finding.id), affectedIds);
  const expectedDiff = findings.map((finding, i) => {
    assert.equal(finding.jsonPointer, expectedPointers[i]);
    assert.equal(finding.requiredAffectedCandidate, requiredLines[i]);
    const [, , block, , line] = finding.jsonPointer.split('/');
    assert.equal(before.blocks[Number(block)].lines[Number(line)], finding.candidate);
    return { pointer: finding.jsonPointer, before: finding.candidate, after: requiredLines[i] };
  });
  const jsonDiff = differences(before, after);
  assert.deepEqual(jsonDiff, expectedDiff);
  const oldMd = fs.readFileSync(path.join(root, 'before/page.md'), 'utf8').split('\n');
  const newMd = fs.readFileSync(path.join(root, page, 'page.md'), 'utf8').split('\n');
  assert.equal(oldMd.length, newMd.length);
  const mdDiff = oldMd.flatMap((before, i) => before === newMd[i] ? [] : [
    { line: i + 1, before, after: newMd[i] },
  ]);
  const expectedMdLines = expectedDiff.map(diff => {
    const matches = oldMd.flatMap((line, i) => line === diff.before ? [i + 1] : []);
    assert.equal(matches.length, 1);
    return matches[0];
  });
  assert.deepEqual(mdDiff.map(diff => diff.line), expectedMdLines);
  assert.deepEqual(mdDiff.map(({ before, after }) => ({ before, after })),
    expectedDiff.map(({ before, after }) => ({ before, after })));
  return { json_diff: jsonDiff, md_diff: mdDiff };
}
function toolBindings() {
  return [python,
    ...['p2c.py', 'blocks.py', 'layout.py', 'normalize.py', 'mathcheck.py', 'katex_check.js']
      .map(name => path.join(tools, name)),
    path.resolve(tools, '../profiles/soviet-cn.json'),
  ].map(binding);
}
function candidateBindings() {
  return candidateDirs.flatMap(dir => files(path.join(root, dir))).map(binding);
}

const mode = process.argv[2];
if (mode === 'init') {
  assert(!fs.existsSync(path.join(root, 'input-bindings.json')));
  assert(!fs.existsSync(path.join(root, 'source')));
  const frozen = read(path.join(review, 'review-freeze.json'));
  for (const [name, sha256] of Object.entries(reviewHashes)) {
    assert.equal(binding(path.join(review, name)).sha256, sha256);
  }
  frozen.artifacts.forEach(verify);
  const report = read(path.join(review, 'report.json'));
  assert.equal(report.SOURCE_TEXT, 'FAIL');
  assert.equal(report.SOURCE186, 'HOLD');
  assert.equal(report.RAW148, 'HOLD');
  assert.equal(report.SVG148, 'HOLD');
  assert(report.findings.some(finding => finding.id === 'D396-S186-T001' &&
    finding.status === 'HOLD' && finding.jsonPointer === '/blocks/9/lines/0'));
  for (const [key, value] of Object.entries(report.authorBinding)) {
    if (key === 'authorFilesModified') continue;
    assert.equal(binding(value.path).sha256, value.sha256);
  }
  const originalAuthorFreeze = read(path.join(baseline, 'author-freeze.json'));
  originalAuthorFreeze.files.forEach(verify);
  assert.equal(read(path.join(baseline, 'report.json')).author_repairs, 0);
  const protectedFiles = [...files(baseline), ...files(review)].map(p => ({
    ...binding(p), mode: fs.statSync(p).mode & 0o777,
  }));
  const copies = candidateDirs.flatMap(dir => files(path.join(baseline, dir))
    .map(src => copy(src, path.relative(baseline, src), 0o644)));
  for (const name of Object.keys(reviewHashes)) copy(path.join(review, name), `inputs/review/${name}`);
  for (const name of ['actual-opens.json', 'freeze-seal.json']) {
    const src = path.join(review, name);
    if (fs.existsSync(src)) copy(src, `inputs/review/${name}`);
  }
  for (const name of ['report.json', 'author-freeze.json', 'freeze-seal.json',
    'source-inventory.json', 'source-inventory-freeze.json', 'input-bindings.json',
    'actual-opens.json', 'author-input-page.md']) {
    copy(path.join(baseline, name), `inputs/author/${name}`);
  }
  for (const src of files(path.join(baseline, 'native'))) {
    copy(src, `inputs/author/native/${path.relative(path.join(baseline, 'native'), src)}`);
  }
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    copy(path.join(baseline, page, name), `before/${name}`);
  }
  write('input-bindings.json', {
    schema: 'source186-first-text-repair-inputs@1', root, candidate_root: baseline,
    review_authority: Object.keys(reviewHashes).map(name => binding(path.join(review, name))),
    review_freeze_verified: true, baseline_author_freeze_verified: true, copies,
    original_SOURCE_TEXT_FAIL: binding(path.join(review, 'report.json')),
    original_author_HOLD: binding(path.join(baseline, 'report.json')),
    protected_files: protectedFiles, tools: toolBindings(), author_text_repair_count_before: 0,
    reused_evidence_method: binding(path.join(tmp, 'd390-source185-first-text-repair/repair-evidence.mjs')),
  });
  write('before-freeze.json', {
    schema: 'source186-first-text-repair-before-freeze@1', root,
    frozen_before_author_repair: true, frozen_at: new Date().toISOString(),
    input_bindings: binding(path.join(root, 'input-bindings.json')),
    snapshots: files(path.join(root, 'before')).map(binding),
    authority_copies: files(path.join(root, 'inputs')).map(binding),
    candidate_copies: copies.map(entry => entry.copy),
    author_text_repair_count_before: 0, history_images: 24, batch_new_images: 0,
    file_mode: '0444',
  });
  for (const name of ['before-freeze.json', 'input-bindings.json']) {
    fs.chmodSync(path.join(root, name), 0o444);
  }
  write('actual-opens.json', {
    schema: 'source186-first-text-repair-actual-opens@1',
    history_images: 24, batch_new_images: 0, cumulative_images: 24, context_limit: 24,
    actual_image_tool_opens: [], count_reset: false, compaction_reset: false,
    source_raw_svg_crop_raster_preview_opens: 0, image_payloads_returned_to_parent: 0,
    distinction: 'Byte copying/hashing and native internal image IO are not visual tool/model opens. No pixels inspected; exhausted permanent budget remains 24/24.',
  });
  verifyProtected(protectedFiles);
  console.log(JSON.stringify({ initialized: root, candidate_files_copied: copies.length,
    protected_files_bound: protectedFiles.length, batch_new_images: 0 }));
} else if (mode === 'run') {
  assert(!fs.existsSync(path.join(root, 'native/finalize-186.started.json')));
  const beforeFreeze = read(path.join(root, 'before-freeze.json'));
  [beforeFreeze.input_bindings, ...beforeFreeze.snapshots, ...beforeFreeze.authority_copies].forEach(verify);
  const input = read(path.join(root, 'input-bindings.json'));
  verifyProtected(input.protected_files);
  input.tools.forEach(verify);
  const preDiff = compareText();
  write('before-native-bindings.json', candidateBindings());
  write('before-native-exactdiff.json', preDiff);
  const argv = [python, path.join(tools, 'p2c.py'), 'finalize', '--book', '10p',
    '--page', '186', '--root', path.join(root, 'source'), '--work', path.join(root, 'work')];
  const overrides = { PYTHONDONTWRITEBYTECODE: '1', TMPDIR: path.join(root, 'runtime-tmp') };
  fs.mkdirSync(overrides.TMPDIR, { recursive: true });
  const started = {
    schema: 'source186-text-repair-native-started@1', invocation_ordinal: 1,
    argv, exact_invocation: argv.join(' '), cwd: repo, environment_overrides: overrides,
    started_at: new Date().toISOString(), tool_bindings_before: toolBindings(),
    exact_prior_audit: binding(path.join(root, page, 'audit.json')),
  };
  write('native/finalize-186.started.json', started);
  const result = spawnSync(argv[0], argv.slice(1), {
    cwd: repo, env: { ...process.env, ...overrides }, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
  });
  fs.writeFileSync(path.join(root, 'native/finalize-186.stdout.txt'), result.stdout ?? '', { flag: 'wx' });
  fs.writeFileSync(path.join(root, 'native/finalize-186.stderr.txt'), result.stderr ?? '', { flag: 'wx' });
  const receipt = {
    ...started, finished_at: new Date().toISOString(), exit_code: result.status,
    signal: result.signal, launch_error: result.error?.message ?? null,
    stdout: binding(path.join(root, 'native/finalize-186.stdout.txt')),
    stderr: binding(path.join(root, 'native/finalize-186.stderr.txt')),
    tool_bindings_after: toolBindings(), native_finalize_runs: 1,
    prepare_runs: 0, vectorize_runs: 0, raster_runs: 0, standalone_crop_runs: 0,
    existing_geometry_reused_from_copied_audit: true,
    native_note: 'Native finalize internally rewrites the existing RAW148 PNG using the frozen precise audit box. No separate crop command or new image path; PNG, SVG and first preview byte identity checked separately. No images displayed.',
  };
  write('native/finalize-186.receipt.json', receipt);
  const failures = [];
  let postDiff = null;
  try { postDiff = compareText(); } catch (error) { failures.push(`Exact text diff: ${error.message}`); }
  const afterNative = candidateBindings();
  write('after-bindings.json', afterNative);
  const fileDiff = input.copies.map(({ relative, original }) => {
    const after = binding(path.join(root, relative));
    return { relative, before: original, after,
      bytes_identical: original.sha256 === after.sha256 && original.bytes === after.bytes };
  });
  const unexpectedFiles = fileDiff.filter(entry => !entry.bytes_identical &&
    ![page + 'page.md', page + 'page.json'].includes(entry.relative));
  if (unexpectedFiles.length) failures.push('Unexpected changes outside the two authorized MD/JSON lines.');
  const newPaths = afterNative.filter(entry => !input.copies.some(copy => copy.copy.path === entry.path));
  if (newPaths.length) failures.push('Unexpected new candidate asset paths.');
  const raw = fileDiff.filter(entry => /\/figures\/fig-148\.(png|svg)$/.test(entry.relative));
  const previews = fileDiff.filter(entry => entry.relative.startsWith('first-svg-preview/'));
  if (raw.length !== 2 || raw.some(entry => !entry.bytes_identical)) failures.push('RAW148 PNG/SVG byte mismatch.');
  if (previews.length !== 1 || previews.some(entry => !entry.bytes_identical)) failures.push('First preview byte mismatch.');
  try { verifyProtected(input.protected_files); } catch (error) { failures.push(`Protected original binding: ${error.message}`); }
  if (JSON.stringify(receipt.tool_bindings_before) !== JSON.stringify(receipt.tool_bindings_after)) {
    failures.push('Native tools changed during invocation.');
  }
  const audit = read(path.join(root, page, 'audit.json'));
  if (result.status !== 0 || audit.lines_printed !== 25 || audit.lines_md !== 25 || audit.errors.length) {
    failures.push('First repair native finalize did not pass 25/25.');
  }
  const auditIdentical = fileDiff.find(entry => entry.relative === page + 'audit.json').bytes_identical;
  write('exactdiff.json', {
    schema: 'source186-first-text-repair-exactdiff@1',
    comparison: 'Full recursive JSON deep comparison and complete MD line comparison; mechanical checks only, not independent source or visual self-review.',
    status: failures.length ? 'FAIL' : 'PASS', expected_json_pointers: expectedPointers,
    pre_native: preDiff, post_native: postDiff, file_bindings: fileDiff,
    raw_png_svg: raw, first_svg_preview: previews, new_candidate_paths: newPaths,
    unexpected_file_changes: unexpectedFiles, all_other_json_values_unchanged: Boolean(postDiff),
    metadata_figframes_samerow_captions_footer_unchanged: Boolean(postDiff),
    summary_line_and_weight_unchanged: Boolean(postDiff), audit_bytes_unchanged: auditIdentical,
    protected_originals_unchanged: !failures.some(failure => failure.startsWith('Protected')),
    failures,
  });
  write('report.json', {
    schema: 'source186-first-local-text-repair-report@1', ticket: 'STEMROBIN-181', root,
    status: failures.length ? 'AUTHOR_REPAIR_FAIL_FIRST_OUTPUTS_RETAINED' : 'AUTHOR_TEXT_REPAIR_NATIVE_PASS_PENDING_INDEPENDENT_AFFECTED_REVIEW',
    author_text_repair_count: 1, figure_repair_count_this_batch: 0,
    source_truth: 'd396 frozen independent readings and exact two authorized requirements; no reopened pixels and no physics inference.',
    authority: input.review_authority, affected_findings: affectedIds,
    changed_json_pointers: expectedPointers, changed_md_lines: postDiff?.md_diff.map(diff => diff.line) ?? [],
    native: { author_only: true, exit_code: result.status, lines_printed: audit.lines_printed,
      lines_md: audit.lines_md, errors: audit.errors, receipt: binding(path.join(root, 'native/finalize-186.receipt.json')) },
    exact_diff: binding(path.join(root, 'exactdiff.json')), raw_png_svg: raw,
    first_svg_preview: previews, before_freeze: binding(path.join(root, 'before-freeze.json')),
    before_bindings: binding(path.join(root, 'input-bindings.json')),
    after_bindings: binding(path.join(root, 'after-bindings.json')),
    candidate_page_md: binding(path.join(root, page, 'page.md')),
    candidate_page_json: binding(path.join(root, page, 'page.json')),
    candidate_audit: binding(path.join(root, page, 'audit.json')),
    actual_opens: binding(path.join(root, 'actual-opens.json')),
    history_images: 24, batch_new_images: 0, cumulative_images: 24, image_count_reset: false,
    native_finalize_runs: 1, prepare_runs: 0, vectorize_runs: 0, raster_runs: 0,
    standalone_crop_runs: 0, new_image_asset_paths: 0, visual_reviews_this_batch: 0,
    SOURCE_TEXT: 'PENDING_ORIGINAL_REVIEWER_AFFECTED_ONLY_REVIEW; original d396 FAIL permanently retained',
    SOURCE186: 'HOLD', SOURCE186_independent_PASS: false,
    RAW148: 'HOLD_UNOPENED_UNCHANGED', SVG148: 'HOLD_UNOPENED_UNCHANGED',
    saved_first_svg_preview: 'HOLD_UNOPENED_UNCHANGED', independent_RAW_or_SVG_PASS: false,
    hard_HOLDs_preserved: [
      { id: 'D396-S186-T001', pointer: '/blocks/9/lines/0', status: 'HOLD',
        reason: 'Final summary exact weight unresolved; text and markers byte-identical, no guess.' },
      { id: 'RAW148_C_CPrime', status: 'HOLD',
        reason: 'RAW/SVG lower mirror C versus CPrime glyph and full visual fidelity unresolved; assets byte-identical, no image opens.' },
    ],
    historical_failures_and_HOLDs: {
      d396_SOURCE_TEXT_FAIL: input.original_SOURCE_TEXT_FAIL,
      d393_author_HOLD: input.original_author_HOLD,
      frozen_d396_copy: binding(path.join(root, 'inputs/review/report.json')),
      frozen_d393_copy: binding(path.join(root, 'inputs/author/report.json')),
    },
    all_other_lines_blocks_metadata_figframes_samerow_preserved: failures.length === 0,
    n71_complete_or_publishable_claimed: false, fullGate2_or_wholeCard_PASS_claimed: false,
    page_counts_added: 0, canonical_promotions: 0,
    old_files_or_index_meter_canonical_written: false,
    workers_chats_worktrees_branches_db_git_generation_project_checks: 0,
    disposition: 'Stop after 0444 sealing. Parent submits the two affected strings to the original reviewer for zero-image affected-only review. Summary and RAW148 hard HOLDs remain.',
    failures, intended_file_mode: '0444',
  });
  console.log(JSON.stringify({ exit_code: result.status, lines: `${audit.lines_printed}/${audit.lines_md}`,
    exact_two_line_diff: Boolean(postDiff), raw_files_identical: raw.every(entry => entry.bytes_identical),
    preview_identical: previews.every(entry => entry.bytes_identical), audit_identical: auditIdentical, failures }));
} else if (mode === 'seal') {
  assert(fs.existsSync(path.join(root, 'report.json')));
  assert(!fs.existsSync(path.join(root, 'author-freeze.json')));
  const input = read(path.join(root, 'input-bindings.json'));
  verifyProtected(input.protected_files);
  const owned = files(root).map(binding);
  write('author-freeze.json', {
    schema: 'source186-first-text-repair-author-freeze@1', frozen: true, root,
    frozen_at: new Date().toISOString(), files: owned, self_hash_excluded: true,
    author_text_repair_count: 1, native_finalize_runs: 1,
    SOURCE_or_independent_RAW_PASS_claimed: false, affected_only_independent_review_pending: true,
    SOURCE186: 'HOLD', summary_typography_HOLD: true, RAW148_SVG148_C_CPrime_HOLD: true,
    history_images: 24, batch_new_images: 0, cumulative_images: 24, image_count_reset: false,
    protected_originals_unchanged: true, file_mode: '0444',
  });
  write('freeze-seal.json', {
    schema: 'source186-first-text-repair-seal@1',
    author_freeze: binding(path.join(root, 'author-freeze.json')),
    report: binding(path.join(root, 'report.json')),
    exactdiff: binding(path.join(root, 'exactdiff.json')),
    actual_opens: binding(path.join(root, 'actual-opens.json')),
    file_mode: '0444', self_hash_excluded: true,
  });
  for (const p of files(root)) fs.chmodSync(p, 0o444);
  for (const p of files(root)) assert.equal(fs.statSync(p).mode & 0o777, 0o444);
  owned.forEach(verify);
  verifyProtected(input.protected_files);
  console.log(JSON.stringify({
    frozen_files: files(root).length, report: binding(path.join(root, 'report.json')),
    author_freeze: binding(path.join(root, 'author-freeze.json')),
    exactdiff: binding(path.join(root, 'exactdiff.json')),
    seal: binding(path.join(root, 'freeze-seal.json')),
    image_count: '24+0=24/24',
  }, null, 2));
} else {
  throw new Error('Use init, run, or seal exactly once per phase.');
}

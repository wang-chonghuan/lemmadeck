import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const tmp = path.dirname(root);
const baseline = path.join(tmp, 'd364-source185-first-author');
const review = path.join(tmp, 'd386-source185-typography-affected-review');
const priorReview = path.join(tmp, 'd376-source185-first-independent-review');
const page = 'source/10p/pages/0185/';
const tools = path.join(repo, '.claude/skills/ld-s10y-lesson/tools');
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
const expectedPointers = [
  '/blocks/7/lines/0', '/blocks/7/lines/1',
];
const reviewNames = [
  'report.json', 'review-freeze.json', 'crop-provenance.json',
];
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
function binding(p) {
  const bytes = fs.readFileSync(p);
  return { path: p, sha256: crypto.createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length };
}
function write(relative, value) {
  const target = path.resolve(root, relative);
  assert(target.startsWith(root + '/'));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, JSON.stringify(value, null, 2) + '\n');
}
function files(dir) {
  return fs.readdirSync(dir).sort().flatMap(name => {
    const p = path.join(dir, name);
    const stat = fs.lstatSync(p);
    assert(!stat.isSymbolicLink(), `Symlink is outside this bounded copy contract: ${p}`);
    return stat.isDirectory() ? files(p) : [p];
  });
}
function verify(entry) {
  assert.deepEqual(binding(entry.path), entry);
}
function differences(a, b, pointer = '') {
  if (JSON.stringify(a) === JSON.stringify(b)) return [];
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
    return [{ pointer, before: a, after: b }];
  }
  const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])];
  return keys.flatMap(key => differences(a[key], b[key], `${pointer}/${key.replaceAll('~', '~0').replaceAll('/', '~1')}`));
}
function compareText() {
  const before = read(path.join(root, 'before/page.json'));
  const after = read(path.join(root, page, 'page.json'));
  const expected = read(path.join(root, 'inputs/review/report.json')).exactRepairRequirements.rows;
  const jsonDiff = differences(before, after);
  const expectedDiff = expected.map(({ jsonPointer: pointer, required: after, original }) => {
    const [, , block, , line] = pointer.split('/');
    const beforeLine = before.blocks[Number(block)].lines[Number(line)];
    assert.equal(beforeLine, original);
    assert.equal(after.replaceAll('**', ''), beforeLine);
    return { pointer, before: beforeLine, after };
  });
  assert.deepEqual(jsonDiff, expectedDiff);
  assert.deepEqual(jsonDiff.map(d => d.pointer), expectedPointers);
  const oldMd = fs.readFileSync(path.join(root, 'before/page.md'), 'utf8').split('\n');
  const newMd = fs.readFileSync(path.join(root, page, 'page.md'), 'utf8').split('\n');
  assert.equal(oldMd.length, newMd.length);
  const mdDiff = oldMd.flatMap((before, i) => before === newMd[i] ? [] : [
    { line: i + 1, before, after: newMd[i] },
  ]);
  const expectedMdLines = expectedDiff.map(d => {
    const matches = oldMd.flatMap((line, i) => line === d.before ? [i + 1] : []);
    assert.equal(matches.length, 1);
    return matches[0];
  });
  assert.deepEqual(mdDiff.map(d => d.line), expectedMdLines);
  assert.deepEqual(mdDiff.map(d => ({ before: d.before, after: d.after })),
    expectedDiff.map(d => ({ before: d.before, after: d.after })));
  return { json_diff: jsonDiff, md_diff: mdDiff };
}
function toolBindings() {
  return [
    python, ...['p2c.py', 'blocks.py', 'layout.py', 'normalize.py', 'mathcheck.py', 'katex_check.js']
      .map(name => path.join(tools, name)),
    path.join(tools, '../profiles/soviet-cn.json'),
  ].map(p => binding(path.resolve(p)));
}
function candidateBindings() {
  return ['source', 'work'].flatMap(dir => files(path.join(root, dir))).map(binding);
}

const mode = process.argv[2];
if (mode === 'init') {
  assert(!fs.existsSync(path.join(root, 'input-bindings.json')));
  assert(!fs.existsSync(path.join(root, 'source')));
  const frozen = read(path.join(review, 'review-freeze.json'));
  const report = read(path.join(review, 'report.json'));
  assert.equal(binding(path.join(review, 'report.json')).sha256,
    '2cae55c3caadb1a69d9841d7814c42d265da1146701e5d87421d417ce231215d');
  for (const { path, sha256, bytes } of frozen.artifacts) verify({ path, sha256, bytes });
  for (const key of ['priorD376Report', 'authorJSON', 'authorMD']) verify(frozen[key]);
  assert.equal(report.decision, 'BOLD-CONFIRMED');
  assert.equal(report.affectedVerdict, 'REVISE');
  assert.deepEqual(report.exactRepairRequirements.rows.map(x => x.jsonPointer),
    expectedPointers);
  const prior = read(path.join(priorReview, 'report.json'));
  assert.equal(binding(path.join(priorReview, 'report.json')).sha256, report.scope.priorReportSHA256);
  assert.equal(binding(path.join(priorReview, 'source-pixel-freeze.json')).sha256,
    report.scope.sourcePixelFreezeSHA256);
  assert.equal(prior.verdicts.SOURCE185, 'HOLD');
  for (const id of ['RAW145', 'RAW146', 'RAW147']) assert.equal(prior.verdicts[id], 'PASS');
  const authorFreeze = read(path.join(baseline, 'author-freeze.json'));
  assert.equal(binding(path.join(baseline, 'author-freeze.json')).sha256, prior.inputAuthorFreezeSHA256);
  assert.equal(binding(path.join(baseline, 'report.json')).sha256, prior.inputReportSHA256);
  assert.equal(authorFreeze.author_repairs, 0);
  authorFreeze.files.forEach(verify);
  const protectedDirs = [
    'd364-source185-first-author', 'd376-source185-first-independent-review',
    'd386-source185-typography-affected-review',
  ];
  const protectedFiles = protectedDirs.flatMap(dir => files(path.join(tmp, dir))).map(binding);
  const copies = [];
  for (const dir of ['source', 'work']) {
    for (const src of files(path.join(baseline, dir))) {
      const relative = path.relative(baseline, src);
      const dest = path.join(root, relative);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest, fs.constants.COPYFILE_EXCL);
      fs.chmodSync(dest, 0o644);
      const original = binding(src);
      const copy = binding(dest);
      assert.equal(original.sha256, copy.sha256);
      copies.push({ relative, original, copy });
    }
  }
  for (const name of reviewNames) {
    const dest = path.join(root, 'inputs/review', name);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(path.join(review, name), dest, fs.constants.COPYFILE_EXCL);
    fs.chmodSync(dest, 0o444);
  }
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const dest = path.join(root, 'before', name);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(path.join(baseline, page, name), dest, fs.constants.COPYFILE_EXCL);
    fs.chmodSync(dest, 0o444);
  }
  write('input-bindings.json', {
    schema: 'source185-first-text-repair-inputs@1',
    candidate_root: baseline, review_authority: reviewNames.map(name => binding(path.join(review, name))),
    review_freeze_verified: true, exact_repair_requirements_verified: true, copies,
    original_HOLD: binding(path.join(priorReview, 'report.json')),
    original_pixel_freeze: binding(path.join(priorReview, 'source-pixel-freeze.json')),
    original_REVISE: binding(path.join(review, 'report.json')),
    protected_files: protectedFiles, tools: toolBindings(),
    author_text_repair_count_before: 0,
    reused_evidence_method: binding(path.join(tmp, 'd379-source184-first-text-repair/repair-evidence.mjs')),
  });
  write('before-freeze.json', {
    schema: 'source185-first-text-repair-before-freeze@1', frozen_before_author_repair: true,
    input_bindings: binding(path.join(root, 'input-bindings.json')),
    snapshots: files(path.join(root, 'before')).map(binding),
    authority_copies: files(path.join(root, 'inputs/review')).map(binding),
    author_text_repair_count_before: 0, history_images: 22, batch_new_images: 0,
    file_mode: '0444',
  });
  for (const name of ['before-freeze.json', 'input-bindings.json']) {
    fs.chmodSync(path.join(root, name), 0o444);
  }
  write('actual-opens.json', {
    schema: 'source185-first-text-repair-actual-opens@1',
    history_images: 22, batch_new_images: 0, cumulative_images: 22, context_limit: 24,
    actual_image_tool_opens: [], count_reset: false,
    source_raw_svg_crop_raster_preview_opens: 0, parent_image_payloads: 0,
    distinction: 'Binary copying/hashing and native finalize internal image IO are not visual model/tool opens. No pixels were inspected in this repair.',
  });
  console.log(JSON.stringify({ initialized: root, candidate_files_copied: copies.length,
    protected_files_bound: protectedFiles.length, batch_new_images: 0 }));
} else if (mode === 'run') {
  assert(!fs.existsSync(path.join(root, 'native/finalize-185.started.json')));
  const beforeFreeze = read(path.join(root, 'before-freeze.json'));
  [beforeFreeze.input_bindings, ...beforeFreeze.snapshots, ...beforeFreeze.authority_copies].forEach(verify);
  const input = read(path.join(root, 'input-bindings.json'));
  input.protected_files.forEach(verify);
  input.tools.forEach(verify);
  const preDiff = compareText();
  const beforeNative = candidateBindings();
  write('before-native-bindings.json', beforeNative);
  write('before-native-exactdiff.json', preDiff);
  const argv = [python, path.join(tools, 'p2c.py'), 'finalize', '--book', '10p',
    '--page', '185', '--root', path.join(root, 'source'), '--work', path.join(root, 'work')];
  const overrides = { PYTHONDONTWRITEBYTECODE: '1', TMPDIR: path.join(root, 'runtime-tmp') };
  fs.mkdirSync(overrides.TMPDIR, { recursive: true });
  const started = {
    schema: 'source185-text-repair-native-started@1', invocation_ordinal: 1,
    argv, exact_invocation: argv.join(' '), cwd: repo, environment_overrides: overrides,
    started_at: new Date().toISOString(), tool_bindings_before: toolBindings(),
    exact_prior_audit: binding(path.join(root, page, 'audit.json')),
  };
  write('native/finalize-185.started.json', started);
  const result = spawnSync(argv[0], argv.slice(1), {
    cwd: repo, env: { ...process.env, ...overrides }, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
  });
  fs.writeFileSync(path.join(root, 'native/finalize-185.stdout.txt'), result.stdout ?? '');
  fs.writeFileSync(path.join(root, 'native/finalize-185.stderr.txt'), result.stderr ?? '');
  const receipt = {
    ...started, finished_at: new Date().toISOString(), exit_code: result.status,
    signal: result.signal, launch_error: result.error?.message ?? null,
    stdout: binding(path.join(root, 'native/finalize-185.stdout.txt')),
    stderr: binding(path.join(root, 'native/finalize-185.stderr.txt')),
    tool_bindings_after: toolBindings(), native_finalize_runs: 1,
    vectorize_runs: 0, raster_runs: 0, standalone_crop_runs: 0,
    existing_geometry_reused_from_copied_audit: true,
    native_note: 'Unmodified native finalize refreshes the three existing PNG paths internally. No standalone crop, new image asset path, SVG or raster is created; byte identity is checked separately.',
  };
  write('native/finalize-185.receipt.json', receipt);
  const failures = [];
  let postDiff;
  try { postDiff = compareText(); } catch (error) { failures.push(`exact text diff: ${error.message}`); }
  const afterNative = candidateBindings();
  write('after-bindings.json', afterNative);
  const fileDiff = input.copies.map(({ relative, original }) => {
    const after = binding(path.join(root, relative));
    return { relative, before: original, after, bytes_identical: original.sha256 === after.sha256 };
  });
  const unexpectedFiles = fileDiff.filter(x => !x.bytes_identical &&
    ![page + 'page.md', page + 'page.json'].includes(x.relative));
  if (unexpectedFiles.length) failures.push('Unexpected changes outside the two MD/JSON text lines.');
  const newPaths = afterNative.filter(x => !input.copies.some(c => c.copy.path === x.path));
  if (newPaths.length) failures.push('Unexpected new candidate asset paths.');
  const raw = fileDiff.filter(x => /\/figures\/fig-(145|146|147)\.(png|svg)$/.test(x.relative));
  if (raw.length !== 6 || raw.some(x => !x.bytes_identical)) failures.push('RAW145/146/147 byte mismatch.');
  try { input.protected_files.forEach(verify); } catch (error) { failures.push(`Protected original binding: ${error.message}`); }
  if (JSON.stringify(receipt.tool_bindings_before) !== JSON.stringify(receipt.tool_bindings_after)) {
    failures.push('Native tools changed during the invocation.');
  }
  const audit = read(path.join(root, page, 'audit.json'));
  if (result.status !== 0 || audit.lines_printed !== 18 || audit.lines_md !== 18 || audit.errors.length) {
    failures.push('First repair native finalize did not pass 18/18.');
  }
  write('exactdiff.json', {
    schema: 'source185-first-text-repair-exactdiff@1', comparison: 'Complete recursive JSON comparison and complete MD line comparison; no visual self-review.',
    status: failures.length ? 'FAIL' : 'PASS', expected_json_pointers: expectedPointers,
    pre_native: preDiff, post_native: postDiff ?? null, file_bindings: fileDiff,
    raw_png_svg: raw, new_candidate_paths: newPaths, unexpected_file_changes: unexpectedFiles,
    all_other_json_values_unchanged: Boolean(postDiff), metadata_frames_flags_captions_unchanged: Boolean(postDiff),
    two_physical_rows_retained_and_only_cross_row_bold_markers_added: Boolean(postDiff),
    audit_bytes_unchanged: fileDiff.find(x => x.relative === page + 'audit.json').bytes_identical,
    protected_originals_unchanged: !failures.some(x => x.startsWith('Protected')),
    failures,
  });
  write('report.json', {
    schema: 'source185-first-local-text-repair-report@1', ticket: 'STEMROBIN-181',
    root, status: failures.length ? 'AUTHOR_REPAIR_FAIL' : 'AUTHOR_TEXT_REPAIR_NATIVE_PASS_PENDING_REVIEW',
    author_text_repair_count: 1, figure_repair_count_this_batch: 0,
    source_truth: 'd386 frozen BOLD-CONFIRMED exact two-row requirements; no reopened pixels.',
    authority: input.review_authority, affected_findings: ['D376-S185-H001'],
    changed_json_pointers: expectedPointers, changed_md_lines: postDiff?.md_diff.map(x => x.line) ?? [],
    native: { author_only: true, exit_code: result.status, lines_printed: audit.lines_printed,
      lines_md: audit.lines_md, errors: audit.errors, receipt: binding(path.join(root, 'native/finalize-185.receipt.json')) },
    exact_diff: binding(path.join(root, 'exactdiff.json')), raw_png_svg: raw,
    before_bindings: binding(path.join(root, 'input-bindings.json')),
    after_bindings: binding(path.join(root, 'after-bindings.json')),
    candidate_page_md: binding(path.join(root, page, 'page.md')),
    candidate_page_json: binding(path.join(root, page, 'page.json')),
    candidate_audit: binding(path.join(root, page, 'audit.json')),
    actual_opens: binding(path.join(root, 'actual-opens.json')),
    history_images: 22, batch_new_images: 0, cumulative_images: 22, image_count_reset: false,
    native_finalize_runs: 1, prepare_runs: 0, vectorize_runs: 0, raster_runs: 0,
    standalone_crop_runs: 0, new_image_asset_paths: 0, visual_reviews_this_batch: 0,
    SOURCE185: 'NOT_CLAIMED; original Huygens reviewer affected-only review pending',
    RAW145_RAW146_RAW147: 'd376 independent PASS retained for byte-identical assets; no new independent review claimed',
    historical_failures: {
      d376_SOURCE185_HOLD: input.original_HOLD,
      d386_typography_REVISE: input.original_REVISE,
    },
    preserved_two_physical_rows_and_all_other_lines_blocks_metadata_figframes_samerow: failures.length === 0,
    d387_n70_prefix_assembly: 'NOT_READ_MODIFIED_OR_REEXECUTED',
    old_files_or_index_meter_canonical_written: false, canonical_promotions: 0,
    workers_chats_worktrees_branches_db_git_generation_project_checks: 0,
    disposition: 'Stop after sealing. Parent submits only the two affected strings to the original Huygens reviewer for zero-image affected-only review.',
    failures, intended_file_mode: '0444',
  });
  console.log(JSON.stringify({ exit_code: result.status, lines: `${audit.lines_printed}/${audit.lines_md}`,
    exact_two_line_diff: Boolean(postDiff), raw_files_identical: raw.every(x => x.bytes_identical), failures }));
} else if (mode === 'seal') {
  assert(fs.existsSync(path.join(root, 'report.json')));
  assert(!fs.existsSync(path.join(root, 'author-freeze.json')));
  const input = read(path.join(root, 'input-bindings.json'));
  input.protected_files.forEach(verify);
  const owned = files(root).map(binding);
  write('author-freeze.json', {
    schema: 'source185-first-text-repair-author-freeze@1', frozen: true,
    root, files: owned, self_hash_excluded: true,
    author_text_repair_count: 1, native_finalize_runs: 1,
    SOURCE_or_independent_RAW_PASS_claimed: false, affected_only_independent_review_pending: true,
    history_images: 22, batch_new_images: 0, cumulative_images: 22, image_count_reset: false,
    protected_originals_unchanged: true, file_mode: '0444',
  });
  write('freeze-seal.json', {
    schema: 'source185-first-text-repair-seal@1',
    author_freeze: binding(path.join(root, 'author-freeze.json')),
    report: binding(path.join(root, 'report.json')),
    exactdiff: binding(path.join(root, 'exactdiff.json')),
    actual_opens: binding(path.join(root, 'actual-opens.json')),
    file_mode: '0444', self_hash_excluded: true,
  });
  for (const p of files(root)) fs.chmodSync(p, 0o444);
  for (const p of files(root)) assert.equal(fs.statSync(p).mode & 0o777, 0o444);
  owned.forEach(verify);
  console.log(JSON.stringify({
    frozen_files: files(root).length,
    report: binding(path.join(root, 'report.json')),
    author_freeze: binding(path.join(root, 'author-freeze.json')),
    seal: binding(path.join(root, 'freeze-seal.json')),
  }, null, 2));
} else {
  throw new Error('Use init, run, or seal exactly once per phase.');
}

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const history = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d413-source188189-first-author');
const review = path.join(repo,
  '.intentfold/tickets/STEMROBIN-181/tmp/d420-source189-first-independent-text-raw151152-review/report.json');
const oldLine = '不大的角度放一屏，就可以示出光束的光路. 在鱼缸内染了';
const newLine = '不大的角度放一屏，就可以示出光束的光路. 在鱼缸的染了';
const mdRel = 'source/10p/pages/0189/page.md';
const jsonRel = 'source/10p/pages/0189/page.json';
const auditRel = 'source/10p/pages/0189/audit.json';
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
function binding(p) {
  const b = fs.readFileSync(p);
  return { path: p, sha256: crypto.createHash('sha256').update(b).digest('hex'), bytes: b.length };
}
function files(d) {
  return fs.readdirSync(d).sort().flatMap(n => {
    const p = path.join(d, n), s = fs.lstatSync(p);
    assert(!s.isSymbolicLink(), p);
    return s.isDirectory() ? files(p) : [p];
  });
}
function write(rel, value) {
  const p = path.resolve(root, rel);
  assert(p.startsWith(root + '/'));
  assert(!fs.existsSync(p), `Refuse repeat or overwrite: ${p}`);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(value, null, 2) + '\n');
}
function copy(from, rel, mode = 0o644) {
  const to = path.resolve(root, rel);
  assert(to.startsWith(root + '/'));
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(to, mode);
  assert.equal(binding(from).sha256, binding(to).sha256);
  return { original: binding(from), copy: binding(to) };
}
function verify(b) {
  assert.equal(binding(b.path).sha256, b.sha256, b.path);
}
function verifyHistory(before) {
  assert.deepEqual(files(history), before.history_files.map(b => b.path));
  before.history_files.forEach(b => {
    verify(b);
    assert.equal(fs.statSync(b.path).mode & 0o777, 0o444, b.path);
  });
  verify(before.review_report);
}
function expectedRepair(rel) {
  const oldBytes = fs.readFileSync(path.join(root, 'before', rel));
  const text = oldBytes.toString('utf8');
  assert.equal(text.split(oldLine).length - 1, 1);
  return Buffer.from(text.replace(oldLine, newLine), 'utf8');
}
function checkLiteral() {
  for (const rel of [mdRel, jsonRel])
    assert(fs.readFileSync(path.join(root, rel)).equals(expectedRepair(rel)), rel);
  const before = read(path.join(root, 'before', jsonRel));
  const after = read(path.join(root, jsonRel));
  assert.equal(before.blocks[9].lines[2], oldLine);
  assert.equal(after.blocks[9].lines[2], newLine);
  before.blocks[9].lines[2] = newLine;
  assert.deepEqual(after, before);
  const lines = fs.readFileSync(path.join(root, mdRel), 'utf8').split('\n');
  assert.equal(lines[113], newLine);
}
const mode = process.argv[2];
if (mode === 'init') {
  const reviewBinding = binding(review);
  assert.equal(reviewBinding.sha256, 'af75e5e9f576988463a308310a338a150594b8af0c4fe49aecb15489d08ad6ce');
  const r = read(review);
  assert.deepEqual(r.SOURCE189.first_FAIL_ids, ['SOURCE189-TEXT-01']);
  const finding = r.first_FAIL_this_batch.find(x => x.id === 'SOURCE189-TEXT-01');
  assert.equal(finding.candidate_line, 114);
  assert.equal(finding.candidate_json_ref, 'blocks[9].lines[2]');
  assert.equal(finding.candidate_token, '内');
  assert.equal(finding.source_token, '的');
  assert.equal(binding(path.join(history, 'author-freeze.json')).sha256,
    '95372d40d5efa08c991e844808d6e20d51253b86ae73e96fd63cacf8dcbe0561');
  read(path.join(history, 'author-freeze.json')).files.forEach(verify);
  const historyFiles = files(history).map(binding);
  for (const b of historyFiles) assert.equal(fs.statSync(b.path).mode & 0o777, 0o444);
  const originals = [
    ...files(path.join(history, 'source/10p/pages/0189')),
    ...files(path.join(history, 'work/10p/pages/0189')),
    ...[151, 152, 153, 154].map(n => path.join(history, `first-svg-preview/fig-${n}.png`)),
  ];
  const copies = originals.map(p => copy(p, path.relative(history, p)));
  for (const rel of [mdRel, jsonRel, auditRel]) copy(path.join(history, rel), `before/${rel}`, 0o444);
  for (const rel of [
    'native/finalize-189.receipt.json', 'native/finalize-189.stdout.txt', 'native/finalize-189.stderr.txt',
    'native/vectorize-189.receipt.json', 'actual-opens.json', 'report.json', 'author-freeze.json',
  ]) copy(path.join(history, rel), `history/${rel}`, 0o444);
  copy(review, 'history/first-independent-review-report.json', 0o444);
  const originalReport = read(path.join(history, 'report.json'));
  originalReport.inputs.tools.forEach(verify);
  const sourceInputs = read(originalReport.reference_input_bindings.path);
  verify(sourceInputs.pdf);
  verify(sourceInputs.source_manifest);
  const before = {
    schema: 'source189-text01-before-freeze@1', frozen_at: new Date().toISOString(),
    root, role: 'ORIGINAL-FIRST-AUTHOR-ZERO-IMAGE-AFFECTED-TEXT-REPAIR',
    review_report: reviewBinding, original_first_FAIL: finding,
    history_files: historyFiles, copies, tools: originalReport.inputs.tools,
    source_pdf: sourceInputs.pdf, source_manifest: sourceInputs.source_manifest,
    literal_only: { before: oldLine, after: newLine, md_line: 114, json_pointer: '/blocks/9/lines/2' },
    inventories_or_source_glyphs_not_reinterpreted: true,
    frozen_before_manual_candidate_edit: true,
    prior_author_images: 8, this_task_images: 0, cumulative_author_images: 8,
    parent_permanent_images: 24, image_budget_reset: false, file_mode: '0444',
  };
  write('before-freeze.json', before);
  fs.chmodSync(path.join(root, 'before-freeze.json'), 0o444);
  verifyHistory(before);
  console.log(JSON.stringify({ before_frozen: true, copied_files: copies.length, image_opens: 0 }));
} else if (mode === 'finalize') {
  const before = read(path.join(root, 'before-freeze.json'));
  verifyHistory(before);
  before.tools.forEach(verify);
  checkLiteral();
  const priorAudit = read(path.join(root, 'before', auditRel));
  const page = read(path.join(root, jsonRel));
  assert.equal(page.meta.provenance.normalized, true);
  assert.equal(page.meta.render.sha256, binding(path.join(root, 'work/10p/pages/0189/page.png')).sha256);
  const reuse = priorAudit.figures.map(f => {
    const item = page.meta.figures.find(x => x.id === f.id);
    assert.deepEqual(item.box, f.box);
    const label = f.label;
    assert(fs.readFileSync(path.join(root, mdRel), 'utf8')
      .includes(`<!-- fig ${label} box ${f.box.join(',')} -->`));
    return { id: f.id, exact_box: f.box, original_rough_from_retained: f.from, reusable_predicates_satisfied: true };
  });
  const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
  const argv = [python, '-B', path.join(repo, '.claude/skills/ld-s10y-lesson/tools/p2c.py'),
    'finalize', '--book', '10p', '--page', '189', '--root', path.join(root, 'source'),
    '--work', path.join(root, 'work')];
  const env = { PYTHONDONTWRITEBYTECODE: '1', TMPDIR: path.join(root, 'runtime-tmp') };
  fs.mkdirSync(env.TMPDIR, { recursive: true });
  const started = {
    invocation_count: 1, argv, exact_command: argv.join(' '), cwd: repo,
    started_at: new Date().toISOString(), environment_overrides: env,
    before_freeze: binding(path.join(root, 'before-freeze.json')), exact_geometry_reuse: reuse,
    edited_md: binding(path.join(root, mdRel)), edited_json: binding(path.join(root, jsonRel)),
    audit_input: binding(path.join(root, auditRel)), tools_before: before.tools.map(b => binding(b.path)),
    no_extra_crop_command: true,
    native_internal_png_rewrites: 'Existing finalize internally crops four PNG copies at reused geometry. This is disclosed, not reported as zero internal crop operations.',
    prepare_vectorize_render_generate_test_browser_image_open_commands: 0,
  };
  write('native/finalize-189.started.json', started);
  const result = spawnSync(argv[0], argv.slice(1), {
    cwd: repo, env: { ...process.env, ...env }, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
  });
  const out = path.join(root, 'native/finalize-189.stdout.txt');
  const err = path.join(root, 'native/finalize-189.stderr.txt');
  fs.writeFileSync(out, result.stdout ?? '', { flag: 'wx' });
  fs.writeFileSync(err, result.stderr ?? '', { flag: 'wx' });
  write('native/finalize-189.receipt.json', {
    ...started, finished_at: new Date().toISOString(), exit_code: result.status,
    signal: result.signal, launch_error: result.error?.message ?? null,
    stdout: binding(out), stderr: binding(err), tools_after: before.tools.map(b => binding(b.path)),
  });
  console.log(JSON.stringify({ finalize_exit_code: result.status, stdout: result.stdout, stderr: result.stderr }));
} else if (mode === 'seal') {
  const before = read(path.join(root, 'before-freeze.json'));
  verifyHistory(before);
  before.tools.forEach(verify);
  verify(before.source_pdf);
  verify(before.source_manifest);
  checkLiteral();
  const unchanged = before.copies.filter(b => ![mdRel, jsonRel].includes(path.relative(root, b.copy.path)));
  unchanged.forEach(b => verify(b.copy));
  const audit = read(path.join(root, auditRel));
  assert.deepEqual(audit, read(path.join(root, 'before', auditRel)));
  const media = before.copies.filter(b => /\/figures\/fig-15[1-4]\.(png|svg)$/.test(b.copy.path)
    || b.copy.path.includes('/first-svg-preview/'));
  assert.equal(media.length, 12);
  const differences = [mdRel, jsonRel].map(rel => {
    const original = fs.readFileSync(path.join(root, 'before', rel));
    const current = fs.readFileSync(path.join(root, rel));
    let first = 0;
    while (first < original.length && original[first] === current[first]) first++;
    let last = original.length;
    while (last > first && original[last - 1] === current[last - 1]) last--;
    return {
      file: rel, before: binding(path.join(root, 'before', rel)), after: binding(path.join(root, rel)),
      same_byte_length: original.length === current.length, changed_utf8_byte_range_half_open: [first, last],
      before_bytes_hex: original.subarray(first, last).toString('hex'),
      after_bytes_hex: current.subarray(first, last).toString('hex'),
      unchanged_prefix_and_suffix: original.subarray(0, first).equals(current.subarray(0, first))
        && original.subarray(last).equals(current.subarray(last)),
      expected_literal_replacement_only: current.equals(expectedRepair(rel)),
    };
  });
  write('exactdiff.json', {
    schema: 'source189-text01-exactdiff@1', id: 'SOURCE189-TEXT-01',
    before_line: oldLine, after_line: newLine, token_before: '内', token_after: '的',
    exact_md_line: 114, exact_json_pointer: '/blocks/9/lines/2',
    differences, changed_files: [mdRel, jsonRel], no_other_bytes_changed: true,
    JSON_structural_diff_only_pointer: true, punctuation_whitespace_all_other_characters_unchanged: true,
    unchanged_audit: binding(path.join(root, auditRel)),
    byteidentical_four_raw_PNG_four_SVG_four_first_previews: media.map(b => ({
      original: b.original, candidate: binding(b.copy.path), byteidentical: true,
    })),
    unchanged_other_copied_assets: unchanged.map(b => binding(b.copy.path)),
  });
  write('actual-opens.json', {
    schema: 'source189-text01-zero-image-opens@1', prior_author_opens: 8,
    this_task_opens: 0, new_image_opens: 0, actual_tool_opens: [],
    cumulative_author_opens: 8, author_limit: 24, image_budget_reset: false,
    parent_permanent_opens: 24, source_raw_SVG_preview_reopens: 0, browser_OS_CDP_activity: 0,
    copied_or_hashed_image_bytes_are_not_model_image_opens: true,
    native_pixel_processing_not_visual_review: true,
  });
  const receipt = read(path.join(root, 'native/finalize-189.receipt.json'));
  write('report.json', {
    schema: 'source189-text01-literal-repair-report@1', ticket: 'STEMROBIN-181', root,
    role: 'ORIGINAL-FIRST-AUTHOR-ZERO-IMAGE-AFFECTED-TEXT-REPAIR',
    only_affected_finding: 'SOURCE189-TEXT-01', page: 189, printed_page: 179,
    status: receipt.exit_code === 0 ? 'NATIVE-PASS-LITERAL-REPAIRED-INDEPENDENT-AFFECTED-REVIEW-PENDING'
      : 'FIRST-REPAIR-NATIVE-FAIL-RETAINED',
    exactpointer: '/blocks/9/lines/2', page_md_line: 114,
    before_line: oldLine, after_line: newLine,
    no_other_bytes_changed: true, exactdiff: binding(path.join(root, 'exactdiff.json')),
    native: {
      finalize_invocations: 1, exit_code: receipt.exit_code,
      rows_printed: audit.lines_printed, rows_md: audit.lines_md, errors: audit.errors,
      exact_geometry_reused: receipt.exact_geometry_reuse, original_audit_byteidentical: true,
      receipt: binding(path.join(root, 'native/finalize-189.receipt.json')),
      command: receipt.exact_command,
      prepare_vectorize_extra_crop_render_generation_tests: 0,
      internal_finalize_crop_writes_at_identical_geometry: 4,
      internal_crop_write_note: receipt.native_internal_png_rewrites,
      four_raw_PNG_four_SVG_four_first_previews_byteidentical: true,
    },
    SOURCE189: 'PENDING-ORIGINAL-INDEPENDENT-AFFECTED-REVIEW',
    author_cannot_clear_original_SOURCE_FAIL: true,
    historical_first_FAIL_retained: before.original_first_FAIL,
    historical_independent_review: before.review_report,
    historical_d413_retained_0444_unchanged: true,
    prior_RAW_nativeSVG_verdicts_not_superseded_or_newly_approved: true,
    open_tail_retained: '在十七世纪用实验确定的折射定律表述如下：**入射线、折**',
    card_completion_or_publishability: 'HOLD-NOT-ASSEMBLED-NOT-COMPLETE',
    original_source188_work188_untouched: true,
    before_freeze: binding(path.join(root, 'before-freeze.json')),
    page_md: binding(path.join(root, mdRel)), page_json: binding(path.join(root, jsonRel)),
    audit: binding(path.join(root, auditRel)), actual_opens: binding(path.join(root, 'actual-opens.json')),
    prior_author_images: 8, task_images: 0, cumulative_author_images: 8, parent_images: 24,
    image_budget_reset: false, only_written_root: root,
    preserve_others_edits_no_revert_cleanup: true,
    promotion_index_meter_DB_git_paid_generation_permanent_worker_worktree_branch: 0,
    all_outputs_before_report: files(root).map(binding),
    file_mode: '0444', disposition: 'Stop. Only SOURCE189-TEXT-01 candidate repaired; original affected independent review still pending.',
  });
  write('author-freeze.json', {
    schema: 'source189-text01-author-freeze@1', root, frozen_at: new Date().toISOString(),
    files: files(root).map(binding), report: binding(path.join(root, 'report.json')),
    exactdiff: binding(path.join(root, 'exactdiff.json')), actual_opens: binding(path.join(root, 'actual-opens.json')),
    self_hash_excluded: true, file_mode: '0444', cumulative_author_images: 8, task_images: 0,
    SOURCE189: 'PENDING-ORIGINAL-INDEPENDENT-AFFECTED-REVIEW',
  });
  for (const p of files(root)) fs.chmodSync(p, 0o444);
  read(path.join(root, 'author-freeze.json')).files.forEach(verify);
  verifyHistory(before);
  for (const p of files(root)) assert.equal(fs.statSync(p).mode & 0o777, 0o444);
  console.log(JSON.stringify({
    status: '0444-FROZEN', rows: [audit.lines_printed, audit.lines_md], task_images: 0,
    files: ['report.json', 'exactdiff.json', 'actual-opens.json', 'author-freeze.json', mdRel, jsonRel]
      .map(rel => binding(path.join(root, rel))),
  }, null, 2));
} else {
  throw new Error('Use init, finalize, seal exactly once each. Manual MD/JSON edit uses apply_patch between init and finalize.');
}

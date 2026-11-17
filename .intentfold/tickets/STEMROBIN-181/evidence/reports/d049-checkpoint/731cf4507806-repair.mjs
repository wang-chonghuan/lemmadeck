import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const owner = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(owner, '../../../../..');
const original = path.join(path.dirname(owner), 'd047-10p-source128-131-author');
const expectedFreeze = 'a978a990d57f6624343b3b8db9926321aa39aea2f94cb937b8cf60adbba26b6c';
const pages = [129, 131];
const reviewInputs = [
  ['d048-source128-129-review.json', '8ad7e7738c897ec538fdc80b1a711dce187815c21d99b1bfbbdef882adba19fc'],
  ['d048-source130-131-review.json', '42e6e3b049d4d4cca3654e8288f777c2be5120bf237976c72cbeb8d8a207231e'],
];
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const read = file => fs.readFileSync(file);
const load = file => JSON.parse(read(file).toString('utf8'));
const digest = file => sha(read(file));
const rel = file => path.relative(owner, file);
const pagePath = (base, layer, page) =>
  path.join(base, layer, '10p/pages', String(page).padStart(4, '0'));

function owned(file) {
  assert(file.startsWith(owner + path.sep), `Write outside owner: ${file}`);
}

function writeExclusive(file, bytes, immutable = true) {
  owned(file);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, bytes, { flag: 'wx', mode: immutable ? 0o444 : 0o644 });
}

function writeJson(file, value) {
  writeExclusive(file, JSON.stringify(value, null, 2) + '\n');
}

function files(dir) {
  assert(fs.lstatSync(dir).isDirectory(), `Not a directory: ${dir}`);
  return fs.readdirSync(dir).sort().flatMap(name => {
    const file = path.join(dir, name);
    const stat = fs.lstatSync(file);
    assert(!stat.isSymbolicLink(), `Unexpected symlink: ${file}`);
    return stat.isDirectory() ? files(file) : [file];
  });
}

function binding(file) {
  const bytes = read(file);
  return { path: rel(file), absolute_path: file, sha256: sha(bytes), bytes: bytes.length };
}

function inventory(dir) {
  return files(dir).map(file => ({
    path: path.relative(dir, file), sha256: digest(file), bytes: fs.statSync(file).size,
  }));
}

function copyFile(from, to, immutable = true) {
  const bytes = read(from);
  writeExclusive(to, bytes, immutable);
  assert(read(to).equals(bytes));
  assert.notEqual(fs.statSync(from).ino, fs.statSync(to).ino, 'Copy must not be a hard link');
  return { original: from, ...binding(to) };
}

function copyTree(from, to, immutable = true) {
  owned(to);
  fs.mkdirSync(to, { recursive: true });
  return files(from).map(file => copyFile(file, path.join(to, path.relative(from, file)), immutable));
}

function verifyFreeze() {
  const file = path.join(original, 'author-freeze.json');
  assert.equal(digest(file), expectedFreeze, 'Frozen author SHA changed');
  const freeze = load(file);
  for (const item of freeze.inventory) {
    const input = path.join(original, item.path);
    assert.equal(digest(input), item.sha256, `Frozen input changed: ${item.path}`);
    assert.equal(fs.statSync(input).size, item.bytes);
  }
  return freeze;
}

function verifyInputSnapshots() {
  const inputs = load(path.join(owner, 'history/inputs.json'));
  for (const item of inputs.snapshots) {
    assert.equal(digest(path.join(owner, item.path)), item.sha256, `History changed: ${item.path}`);
    assert.equal(digest(item.original), item.sha256, `Original changed: ${item.original}`);
  }
  for (const item of inputs.native_inputs) {
    assert.equal(digest(item.original), item.sha256, `Native dependency changed: ${item.original}`);
    assert.equal(fs.statSync(item.original).size, item.bytes);
  }
  return inputs;
}

function replaceOnce(text, from, to) {
  const at = text.indexOf(from);
  assert(at >= 0, `Missing confirmed candidate: ${from}`);
  assert.equal(text.indexOf(from, at + from.length), -1, `Candidate occurs more than once: ${from}`);
  return text.slice(0, at) + to + text.slice(at + from.length);
}

function expectedPage(page, suffix) {
  let text = read(path.join(pagePath(path.join(owner, 'history/before'), 'source', page), suffix))
    .toString('utf8');
  for (const correction of load(path.join(owner, 'history/corrections.json')).filter(c => c.page === page)) {
    text = replaceOnce(text, correction.before, correction.after);
  }
  return Buffer.from(text, 'utf8');
}

function checkPage(page, finalized) {
  const before = path.join(owner, 'history/before');
  const source = pagePath(owner, 'source', page);
  const oldSource = pagePath(before, 'source', page);
  assert(read(path.join(source, 'page.md')).equals(expectedPage(page, 'page.md')),
    'MD must differ only by the confirmed substitutions');
  assert(read(path.join(source, 'page.json')).equals(finalized
    ? expectedPage(page, 'page.json') : read(path.join(oldSource, 'page.json'))),
  'JSON must be unchanged before finalize, then differ only by the confirmed substitutions');
  assert(read(path.join(source, 'audit.json')).equals(read(path.join(oldSource, 'audit.json'))),
    'Audit and exact figure geometry must remain byte-identical');
  assert.deepEqual(inventory(pagePath(owner, 'work', page)), inventory(pagePath(before, 'work', page)),
    'All work bytes, including layout, page PNG, raw crop PNG and SVG, must remain identical');
}

function init() {
  assert(!fs.existsSync(path.join(owner, 'history')), 'Owner already initialized');
  const freeze = verifyFreeze();
  const treeBefore = inventory(original);
  const snapshots = [];
  const saveInput = (file, name) => snapshots.push(
    copyFile(file, path.join(owner, 'history/inputs', name)));
  saveInput(path.join(original, 'author-freeze.json'), 'author-freeze.json');
  saveInput(path.join(original, 'author-freeze.sha256'), 'author-freeze.sha256');
  saveInput(path.join(original, 'receipts/inputs.json'), 'original-inputs.json');
  saveInput(path.join(original, 'observations.json'), 'observations.json');
  saveInput(path.join(original, 'observations.draft.json'), 'observations.draft.json');
  saveInput(path.join(original, 'process-notes.json'), 'process-notes.json');
  const reviews = reviewInputs.map(([name, expected]) => {
    const file = path.join(path.dirname(owner), name);
    assert.equal(digest(file), expected, `Review SHA mismatch: ${name}`);
    saveInput(file, name);
    return load(file);
  });
  const originalInputs = load(path.join(original, 'receipts/inputs.json'));
  const nativeInputs = originalInputs.files.filter(item =>
    !item.original.includes('/d046-10p-source124-127-author/'));
  for (const item of nativeInputs) {
    assert.equal(digest(item.original), item.sha256, `Native input differs from original receipt: ${item.original}`);
    assert.equal(fs.statSync(item.original).size, item.bytes);
  }
  const defects129 = reviews[0].pages.find(p => p.pdf_page === 129).actual_author_defects;
  const defects131 = reviews[1].defects.filter(d => d.pdf_page === 131);
  assert.equal(defects129.length, 2);
  assert.equal(defects131.length, 1);
  const corrections = [
    ...defects129.map(finding => ({
      page: 129, block: finding.block, block_line: finding.block_line,
      before: finding.frozen_author, after: finding.printed_source,
      original_review: reviewInputs[0][0], original_finding: finding,
    })),
    ...defects131.map(finding => ({
      page: 131, block: finding.block, block_line: finding.block_line,
      before: finding.candidate, after: finding.source,
      original_review: reviewInputs[1][0], original_finding: finding,
    })),
  ];
  writeJson(path.join(owner, 'history/corrections.json'), corrections);
  for (const page of pages) {
    const entry = freeze.pages.find(p => p.page === page);
    assert.equal(entry.lines_md, page === 129 ? 20 : 26);
    for (const layer of ['source', 'work']) {
      const from = pagePath(original, layer, page);
      snapshots.push(...copyTree(from, pagePath(path.join(owner, 'history/before'), layer, page)));
      copyTree(from, pagePath(owner, layer, page), false);
    }
    for (const op of ['prepare', 'finalize', 'vectorize']) {
      for (const suffix of ['invocation.json', 'json', 'stdout.txt', 'stderr.txt']) {
        const name = `${op}-${page}-initial.${suffix}`;
        saveInput(path.join(original, 'receipts', name), path.join('original-receipts', name));
      }
    }
    for (const name of [`observed-p0${page}.json`, `reconstructed-observation-v1-p0${page}.json`]) {
      saveInput(path.join(original, 'history', name), path.join('original-history', name));
    }
    saveInput(path.join(original, `history/finalize-${page}-initial/page.authored.md`),
      `original-history/finalize-${page}-initial.page.authored.md`);
    assert.deepEqual(inventory(pagePath(owner, 'source', page)), inventory(pagePath(original, 'source', page)));
    assert.deepEqual(inventory(pagePath(owner, 'work', page)), inventory(pagePath(original, 'work', page)));
  }
  fs.mkdirSync(path.join(owner, 'work/native-tmp'), { recursive: true });
  writeJson(path.join(owner, 'history/original-tree-before.json'), treeBefore);
  writeJson(path.join(owner, 'history/inputs.json'), {
    schema: 'bounded-source-repair-inputs@1', original, original_freeze_sha256: expectedFreeze,
    pages, snapshots, native_inputs: nativeInputs, exact_original_inputs: originalInputs,
    image_opens: 0, review_repeated: false,
  });
  console.log(`Exclusive clones and immutable before snapshots ready: ${snapshots.length} files; 0 image opens.`);
}

function finalize(page) {
  assert(pages.includes(page), 'Only physical pages 129 and 131 are owned');
  verifyInputSnapshots();
  verifyFreeze();
  checkPage(page, false);
  const label = `finalize-${page}-repair1`;
  const receiptFile = path.join(owner, 'receipts', label + '.json');
  const invocationFile = path.join(owner, 'receipts', label + '.invocation.json');
  assert(!fs.existsSync(invocationFile), 'Finalize already reserved or invoked; no rerun permitted');
  const source = pagePath(owner, 'source', page);
  const history = path.join(owner, 'history', label);
  const authored = copyFile(path.join(source, 'page.md'), path.join(history, 'page.authored.md'));
  const before = [
    ...copyTree(source, path.join(history, 'before/source')),
    ...copyTree(pagePath(owner, 'work', page), path.join(history, 'before/work')),
  ];
  const old = load(path.join(owner, 'history/inputs/original-receipts', `finalize-${page}-initial.invocation.json`));
  const args = old.args.map(arg => arg === path.join(original, 'source')
    ? path.join(owner, 'source') : arg === path.join(original, 'work') ? path.join(owner, 'work') : arg);
  assert.deepEqual(args.slice(0, 8), old.args.slice(0, 8));
  const started = new Date().toISOString();
  const environment = { TMPDIR: path.join(owner, 'work/native-tmp'), PYTHONDONTWRITEBYTECODE: '1' };
  writeJson(invocationFile, {
    ...old, args, started, attempt: 'repair1', temp_root: environment.TMPDIR,
    environment, invocation_count_limit: 1, original_receipt: old,
    authored_md: authored, exact_before_binding: before,
  });
  const result = spawnSync(old.executable, args, {
    cwd: old.cwd, maxBuffer: 16 * 1024 * 1024, env: { ...process.env, ...environment },
  });
  const stdoutFile = path.join(owner, 'receipts', label + '.stdout.txt');
  const stderrFile = path.join(owner, 'receipts', label + '.stderr.txt');
  writeExclusive(stdoutFile, result.stdout ?? Buffer.alloc(0));
  writeExclusive(stderrFile, result.stderr ?? Buffer.alloc(0));
  writeExclusive(path.join(owner, 'receipts', label + '.code.txt'), String(result.status) + '\n');
  const outputs = [
    ...copyTree(source, path.join(history, 'after/source')),
    ...copyTree(pagePath(owner, 'work', page), path.join(history, 'after/work')),
  ];
  writeJson(receiptFile, {
    label, started, ended: new Date().toISOString(), exit_code: result.status,
    signal: result.signal, error: result.error?.message ?? null,
    invocation: binding(invocationFile), authored_md: authored, outputs,
    stdout: binding(stdoutFile), stderr: binding(stderrFile),
    code: binding(path.join(owner, 'receipts', label + '.code.txt')),
  });
  process.stdout.write(result.stdout ?? Buffer.alloc(0));
  process.stderr.write(result.stderr ?? Buffer.alloc(0));
  console.log(`${label}: exit ${result.status}; native receipt ${rel(receiptFile)}`);
  process.exitCode = result.status ?? 1;
}

function finish() {
  const inputs = verifyInputSnapshots();
  const freeze = verifyFreeze();
  const corrections = load(path.join(owner, 'history/corrections.json'));
  assert.equal(corrections.length, 3);
  const results = pages.map(page => {
    checkPage(page, true);
    const source = pagePath(owner, 'source', page);
    const json = load(path.join(source, 'page.json'));
    const oldJson = load(path.join(pagePath(path.join(owner, 'history/before'), 'source', page), 'page.json'));
    assert.deepEqual(json.meta, oldJson.meta, 'Every metadata value, note and HOLD must be unchanged');
    const expected = structuredClone(oldJson);
    for (const correction of corrections.filter(c => c.page === page)) {
      const blockIndex = Number(correction.block.split('#')[1]) - 1;
      const lineIndex = correction.block_line - 1;
      expected.blocks[blockIndex].lines[lineIndex] = replaceOnce(
        expected.blocks[blockIndex].lines[lineIndex], correction.before, correction.after);
    }
    assert.deepEqual(json, expected, 'Only the three exact block lines may change');
    const audit = load(path.join(source, 'audit.json'));
    assert.equal(audit.lines_printed, page === 129 ? 20 : 26);
    assert.equal(audit.lines_md, page === 129 ? 20 : 26);
    assert.deepEqual(audit.errors, []);
    assert.deepEqual(audit.normalizations, []);
    const receiptFile = path.join(owner, 'receipts', `finalize-${page}-repair1.json`);
    const receipt = load(receiptFile);
    assert.equal(receipt.exit_code, 0);
    assert.equal(receipt.signal, null);
    assert.equal(receipt.error, null);
    for (const item of [receipt.invocation, receipt.authored_md, receipt.stdout, receipt.stderr, receipt.code, ...receipt.outputs]) {
      assert.equal(digest(path.join(owner, item.path)), item.sha256, `Native receipt binding changed: ${item.path}`);
    }
    const authored = read(path.join(owner, receipt.authored_md.path));
    assert(authored.equals(read(path.join(source, 'page.md'))), 'Native output must preserve the exact authored MD');
    return {
      physical_page: page, printed_page: json.meta.printed_page,
      confirmed_defects_corrected: corrections.filter(c => c.page === page).length,
      status: 'CONFIRMED_DEFECTS_CORRECTED_NATIVE_PASS_REVIEW_PENDING',
      native_pass: true, review_pending: true, native_invocations: 1,
      lines_printed: audit.lines_printed, lines_md: audit.lines_md, blocks: json.blocks.length,
      unchanged_notes_and_holds: json.meta.notes, unchanged_geometry: audit.figures,
      exact_old_binding: inputs.snapshots.filter(item => item.path.includes(`/pages/0${page}/`)),
      exact_authored_md: receipt.authored_md,
      final_outputs: files(source).map(binding),
      unchanged_work_and_raw_binding: files(pagePath(owner, 'work', page)).map(binding),
      receipt_binding: binding(receiptFile), native_receipt: receipt,
      stdout: read(path.join(owner, receipt.stdout.path)).toString('utf8'),
      stderr: read(path.join(owner, receipt.stderr.path)).toString('utf8'),
      exit_code: receipt.exit_code,
    };
  });
  const treeAfter = inventory(original);
  assert.deepEqual(treeAfter, load(path.join(owner, 'history/original-tree-before.json')),
    'Entire original author folder must remain byte-unchanged');
  writeJson(path.join(owner, 'history/original-tree-after.json'), treeAfter);
  const observations = load(path.join(owner, 'history/inputs/observations.json'));
  const review129 = load(path.join(owner, 'history/inputs', reviewInputs[0][0]));
  const review131 = load(path.join(owner, 'history/inputs', reviewInputs[1][0]));
  const result = {
    schema: 'bounded-source-transcription-repair@1', ticket: 'STEMROBIN-181',
    owner, book: '10p', physical_pages: pages, date: '2026-11-17',
    status: 'CONFIRMED_DEFECTS_CORRECTED_NATIVE_PASS_REVIEW_PENDING',
    confirmed_defects_corrected: 3, native_pass: true, review_pending: true,
    independent_approval: false, source_approval_granted: false,
    image_opens: 0, maximum_image_opens: 0, repeated_review: false,
    native_image_processing_only: 'Authorized finalize internally reads pixels; no visual image opens, source review, new crop inspection or rasterization was performed.',
    original_author: {
      path: original, freeze_sha256: expectedFreeze, actual_freeze_sha256: digest(path.join(original, 'author-freeze.json')),
      byte_unchanged: true, frozen_inventory_entries_verified: freeze.inventory.length,
      all_original_files_verified_unchanged: treeAfter.length,
      before: binding(path.join(owner, 'history/original-tree-before.json')),
      after: binding(path.join(owner, 'history/original-tree-after.json')),
    },
    exact_original_reviews: reviewInputs.map(([name, expected]) => ({
      original_path: path.join(path.dirname(owner), name), expected_sha256: expected,
      immutable_copy: binding(path.join(owner, 'history/inputs', name)),
      findings_used_without_repeat_review: corrections.filter(c => c.original_review === name).map(c => c.original_finding),
    })),
    exact_original_inputs: inputs,
    corrections,
    results,
    retained_holds: {
      disposition: 'Every old HOLD and note is retained verbatim; confirmed defect corrections do not clear any other uncertainty or grant source approval.',
      exact_author_source_holds: observations.source_holds,
      exact_author_open_closure: observations.open_closure,
      exact_author_freeze_open_closure: freeze.open_closure,
      exact_reviewer129_ambiguities: review129.pages.find(p => p.pdf_page === 129).ambiguities,
      exact_reviewer130_holds_outside_repair_scope: review131.pages.find(p => p.pdf_page === 130).holds,
      exact_reviewer131_remaining_holds: review131.pages.find(p => p.pdf_page === 131).remaining_holds,
      inherited_resolved_text_observation_not_rewritten: review131.pages.find(p => p.pdf_page === 131).resolved_author_uncertainty,
      original_process_notes_unchanged: load(path.join(owner, 'history/inputs/process-notes.json')),
      stale_candidate_note_handling: 'Old notes still mention the defective candidates and the earlier textual uncertainty. They are retained as requested; the exact corrections and inherited findings are additive evidence, not rewritten history.',
    },
    assertions: {
      whole_md_and_json_only_three_substitutions: true, all_other_characters_and_format_unchanged: true,
      authored_md_equals_final_native_md: true, metadata_and_notes_unchanged: true,
      block_order_line_counts_and_row_topology_unchanged: true, all_geometry_and_audit_bytes_unchanged: true,
      layout_page_png_raw_crop_png_svg_and_template_bytes_unchanged: true,
      original_history_unchanged: true, old_and_new_history_created_exclusively: true,
      native_finalize_once_per_page: true,
    },
    prohibited_actions_performed: {
      prepare: 0, vectorize: 0, assemble: 0, adapt: 0, render: 0,
      canonical: false, index: false, meter: false, database: false, app: false,
      dependency: false, tool_source: false, git: false, backend_writes: false,
      promotion_claims: false, other_agent_files: false,
    },
    newly_closed_tasks: 0, newly_closed_units_counted: 0,
  };
  const file = path.join(owner, 'repair-result.json');
  writeJson(file, result);
  writeExclusive(path.join(owner, 'repair-result.sha256'), `${digest(file)}  repair-result.json\n`);
  console.log(JSON.stringify({
    path: file, sha256: digest(file), status: result.status,
    image_opens: 0, corrected: 3, native_invocations: 2,
    lines: results.map(p => [p.physical_page, p.lines_printed, p.lines_md]),
    original_freeze_sha256: expectedFreeze,
    residual_hold: 'v/nu, Latin/Cyrillic homographs, exact punctuation/footnote bold extent, prior 126/127 and unit47 boundary; unchanged historical notes and process caveat.',
  }, null, 2));
}

const [operation, value] = process.argv.slice(2);
if (operation === 'init') init();
else if (operation === 'finalize') finalize(Number(value));
else if (operation === 'finish') finish();
else throw new Error('Only init, finalize <129|131>, finish are permitted');

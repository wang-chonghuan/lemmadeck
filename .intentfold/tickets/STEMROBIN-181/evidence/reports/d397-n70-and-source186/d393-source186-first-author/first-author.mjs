import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const preparation = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d391-source186-preparation');
const manifestPath = path.join(preparation, 'manifest.json');
const manifestHash = 'e2c56f1187c1d5c996acee6dcdd174af304119fb9bd010bb29c9134b4107174d';
const tools = path.join(repo, '.claude/skills/ld-s10y-lesson/tools');
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
const pdir = path.join(root, 'source/10p/pages/0186');
const wdir = path.join(root, 'work/10p/pages/0186');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
function binding(p) {
  const b = fs.readFileSync(p);
  return { path: p, sha256: crypto.createHash('sha256').update(b).digest('hex'), bytes: b.length };
}
function write(name, value) {
  const target = path.resolve(root, name);
  assert(target.startsWith(root + '/'));
  assert(!fs.existsSync(target), `Already produced: ${target}`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, JSON.stringify(value, null, 2) + '\n');
}
function files(dir) {
  return fs.readdirSync(dir).sort().flatMap(name => {
    const p = path.join(dir, name);
    const stat = fs.lstatSync(p);
    assert(!stat.isSymbolicLink());
    return stat.isDirectory() ? files(p) : [p];
  });
}
function verify(entry) {
  const actual = binding(entry.path);
  assert.equal(actual.sha256, entry.sha256);
  if (entry.bytes !== undefined) assert.equal(actual.bytes, entry.bytes);
}
function toolBindings() {
  return [
    python, ...['p2c.py', 'blocks.py', 'layout.py', 'normalize.py', 'mathcheck.py',
      'katex_check.js', 'vectorize.py', 'svg_raster.js'].map(name => path.join(tools, name)),
    path.join(tools, '../profiles/soviet-cn.json'),
  ].map(p => binding(path.resolve(p)));
}
function native(name, argv) {
  const environment = { PYTHONDONTWRITEBYTECODE: '1', TMPDIR: path.join(root, 'runtime-tmp') };
  fs.mkdirSync(environment.TMPDIR, { recursive: true });
  const started = {
    invocation_count: 1, argv, exact_invocation: argv.join(' '), cwd: repo,
    environment_overrides: environment, started_at: new Date().toISOString(),
    tool_bindings_before: toolBindings(),
    page_md_before: binding(path.join(pdir, 'page.md')),
    inventory_freeze: binding(path.join(root, 'source-inventory-freeze.json')),
  };
  write(`native/${name}.started.json`, started);
  const result = spawnSync(argv[0], argv.slice(1), {
    cwd: repo, env: { ...process.env, ...environment }, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
  });
  fs.writeFileSync(path.join(root, `native/${name}.stdout.txt`), result.stdout ?? '');
  fs.writeFileSync(path.join(root, `native/${name}.stderr.txt`), result.stderr ?? '');
  const receipt = {
    ...started, finished_at: new Date().toISOString(), exit_code: result.status,
    signal: result.signal, launch_error: result.error?.message ?? null,
    stdout: binding(path.join(root, `native/${name}.stdout.txt`)),
    stderr: binding(path.join(root, `native/${name}.stderr.txt`)),
    tool_bindings_after: toolBindings(),
    page_md_after: binding(path.join(pdir, 'page.md')),
    image_tool_opens_during_native: 0,
  };
  write(`native/${name}.receipt.json`, receipt);
  return receipt;
}
const mode = process.argv[2];
if (mode === 'init') {
  assert.equal(binding(manifestPath).sha256, manifestHash);
  const manifest = read(manifestPath);
  assert.deepEqual(manifest.pages, [186]);
  verify({ ...manifest.receipt, path: path.resolve(repo, manifest.receipt.path) });
  assert.equal(read(path.resolve(repo, manifest.receipt.path)).invocationCount, 1);
  const protectedFiles = files(preparation).map(binding);
  const copies = [];
  assert.equal(manifest.inputs.length, 4);
  for (const entry of manifest.inputs) {
    const original = binding(path.resolve(repo, entry.path));
    assert.equal(original.sha256, entry.sha256);
    for (const destination of [pdir, wdir]) {
      fs.mkdirSync(destination, { recursive: true });
      const target = path.join(destination, path.basename(original.path));
      fs.copyFileSync(original.path, target, fs.constants.COPYFILE_EXCL);
      fs.chmodSync(target, 0o644);
      const copy = binding(target);
      assert.equal(copy.sha256, original.sha256);
      copies.push({ original, copy });
    }
  }
  for (const name of ['manifest.json', 'prepare-186.receipt.json']) {
    const dest = path.join(root, 'inputs', name);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(path.join(preparation, name), dest, fs.constants.COPYFILE_EXCL);
    fs.chmodSync(dest, 0o444);
  }
  write('input-bindings.json', {
    schema: 'source186-first-author-inputs@1', preparation_manifest: binding(manifestPath),
    copies, protected_files: protectedFiles, tools: toolBindings(),
    prepare_invocations_by_this_author: 0,
    previous_source185_author_is_continuity_hint_only: true,
    permanent_history_images_before_batch: 22, batch_maximum: 2, cumulative_maximum: 24,
  });
  fs.chmodSync(path.join(root, 'input-bindings.json'), 0o444);
  console.log(JSON.stringify({
    copied_prepared_files: copies.length,
    original_images: ['page.png', 'page.grid.png'].map(name => {
      const p = path.join(pdir, name), b = fs.readFileSync(p);
      assert.equal(b.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
      return { ...binding(p), header_wh: [b.readUInt32BE(16), b.readUInt32BE(20)] };
    }),
  }, null, 2));
} else if (mode === 'freeze-inventory') {
  assert(!fs.existsSync(path.join(pdir, 'page.md')));
  const inventory = read(path.join(root, 'source-inventory.json'));
  const opens = read(path.join(root, 'actual-opens.json'));
  assert.equal(opens.history_images, 22);
  assert.equal(opens.batch_new_images, 2);
  assert.equal(opens.cumulative_images, 24);
  assert.equal(opens.actual_tool_opens.length, 2);
  assert.deepEqual(opens.actual_tool_opens.map(x => path.basename(x.path)), ['page.png', 'page.grid.png']);
  write('source-inventory-freeze.json', {
    schema: 'source186-first-author-inventory-freeze@1',
    frozen_before_page_md: true, source_inventory: binding(path.join(root, 'source-inventory.json')),
    actual_opens: binding(path.join(root, 'actual-opens.json')),
    preparation: binding(path.join(root, 'input-bindings.json')),
    independently_observed_printed_rows: inventory.printed_line_count,
    author_input_is_not_independent_SOURCE_or_RAW_review: true,
    no_remaining_image_capacity: true, file_mode: '0444',
  });
  for (const name of ['source-inventory.json', 'actual-opens.json', 'source-inventory-freeze.json']) {
    fs.chmodSync(path.join(root, name), 0o444);
  }
  console.log(JSON.stringify({ frozen_before_authoring: true, inventory_rows: inventory.printed_line_count,
    cumulative_images: 24 }));
} else if (mode === 'run') {
  const input = read(path.join(root, 'input-bindings.json'));
  input.protected_files.forEach(verify);
  input.tools.forEach(verify);
  const frozen = read(path.join(root, 'source-inventory-freeze.json'));
  verify(frozen.source_inventory);
  verify(frozen.actual_opens);
  fs.copyFileSync(path.join(pdir, 'page.md'), path.join(root, 'author-input-page.md'), fs.constants.COPYFILE_EXCL);
  fs.chmodSync(path.join(root, 'author-input-page.md'), 0o444);
  const base = [python, path.join(tools, 'p2c.py')];
  const scope = ['--book', '10p', '--page', '186', '--root', path.join(root, 'source'),
    '--work', path.join(root, 'work')];
  const finalize = native('finalize-186', [...base, 'finalize', ...scope]);
  const auditPath = path.join(pdir, 'audit.json');
  const audit = fs.existsSync(auditPath) ? read(auditPath) : null;
  let vectorize = null;
  const previews = [];
  if (finalize.exit_code === 0 && audit?.figures.length) {
    vectorize = native('vectorize-186', [...base, 'vectorize', ...scope]);
    if (vectorize.exit_code === 0) {
      for (const figure of audit.figures) {
        const svg = path.join(wdir, 'figures', `${figure.id}.svg`);
        const png = path.join(root, 'first-svg-preview', `${figure.id}.png`);
        fs.mkdirSync(path.dirname(png), { recursive: true });
        previews.push(native(`first-svg-preview-${figure.id}`,
          ['node', path.join(tools, 'svg_raster.js'), svg, png]));
      }
    }
  }
  const inventory = read(path.join(root, 'source-inventory.json'));
  const outputs = [...files(pdir), ...files(wdir)].map(binding);
  const raw = outputs.filter(x => /\/figures\/.*\.(png|svg)$/.test(x.path));
  const previewFiles = fs.existsSync(path.join(root, 'first-svg-preview')) ?
    files(path.join(root, 'first-svg-preview')).map(binding) : [];
  input.protected_files.forEach(verify);
  write('report.json', {
    schema: 'source186-first-author-report@1', ticket: 'STEMROBIN-181', book: '10p', page: 186, root,
    role: 'FIRST-AUTHOR-ONLY',
    status: finalize.exit_code === 0 ? 'NATIVE-AUTHOR-PASS-INDEPENDENT-REVIEWS-PENDING' : 'FIRST-NATIVE-FAIL-RETAINED',
    native_finalize_runs: 1, native_vectorize_runs: vectorize ? 1 : 0,
    first_svg_preview_runs: previews.length, prepare_runs: 0, author_repairs: 0,
    native_finalize: binding(path.join(root, 'native/finalize-186.receipt.json')),
    native_vectorize: vectorize ? binding(path.join(root, 'native/vectorize-186.receipt.json')) : null,
    first_svg_preview_receipts: previews.map((_, i) =>
      binding(path.join(root, `native/first-svg-preview-${audit.figures[i].id}.receipt.json`))),
    author_input_md: binding(path.join(root, 'author-input-page.md')),
    page_md: binding(path.join(pdir, 'page.md')),
    page_json: fs.existsSync(path.join(pdir, 'page.json')) ? binding(path.join(pdir, 'page.json')) : null,
    audit: audit ? binding(auditPath) : null,
    independently_observed_printed_rows: inventory.printed_line_count,
    lines_printed_native: audit?.lines_printed ?? null, lines_md_native: audit?.lines_md ?? null,
    native_errors: audit?.errors ?? ['Native did not produce an audit.'],
    initial_source_inventory: binding(path.join(root, 'source-inventory.json')),
    source_inventory_freeze: binding(path.join(root, 'source-inventory-freeze.json')),
    actual_opens: binding(path.join(root, 'actual-opens.json')),
    input_bindings: binding(path.join(root, 'input-bindings.json')),
    outputs, raw_png_svg: raw, unopened_first_svg_previews: previewFiles,
    initial_rough_figure_boxes: inventory.figures.map(f => ({ id: f.id, box: f.rough_box_xywh })),
    first_native_exact_figure_geometry: audit?.figures ?? [],
    visual_crop_or_svg_review_performed: false, source_review_performed_by_independent_reviewer: false,
    SOURCE186: 'HOLD-independent-source-review-pending',
    RAW: 'HOLD-unopened-native-crops-and-SVGs; mechanical contour checks cannot establish visual fidelity',
    unresolved_source_observations: inventory.unresolved_source_observations,
    prior_permanent_image_opens: 22, new_image_opens: 2, cumulative_permanent_image_opens: 24,
    image_budget_reset: false, raw_svg_preview_crop_other_page_opens: 0,
    source187_opened_or_prepared: false, n71_complete_or_published: false,
    canonical_promoted: false, pages_or_card_counts_added: 0, index_or_meter_writes: 0,
    workers_chats_worktrees_branches_db_git_generation_project_checks: 0,
    original_preparation_files_unchanged: true, intended_file_mode: '0444',
    disposition: 'Stop at 24/24. Parent assigns independent SOURCE/RAW reviewers; no visual PASS is inferred from native receipts.',
  });
  console.log(JSON.stringify({
    finalize_exit_code: finalize.exit_code, printed: audit?.lines_printed, md: audit?.lines_md,
    vectorize_exit_code: vectorize?.exit_code, figures: audit?.figures.length,
    preview_runs: previews.length, additional_image_tool_opens: 0,
  }));
} else if (mode === 'seal') {
  const input = read(path.join(root, 'input-bindings.json'));
  input.protected_files.forEach(verify);
  const owned = files(root).map(binding);
  write('author-freeze.json', {
    schema: 'source186-first-author-freeze@1', ticket: 'STEMROBIN-181', frozen: true, root,
    files: owned, report: binding(path.join(root, 'report.json')), self_hash_excluded: true,
    prior_permanent_image_opens: 22, new_image_opens: 2, cumulative_permanent_image_opens: 24,
    image_budget_reset: false, source_pass_claimed: false, independent_raw_or_svg_pass_claimed: false,
    canonical_promoted: false, n71_complete: false, file_mode: '0444',
  });
  write('freeze-seal.json', {
    schema: 'source186-first-author-seal@1',
    report: binding(path.join(root, 'report.json')),
    author_freeze: binding(path.join(root, 'author-freeze.json')),
    actual_opens: binding(path.join(root, 'actual-opens.json')), self_hash_excluded: true, file_mode: '0444',
  });
  for (const p of files(root)) fs.chmodSync(p, 0o444);
  owned.forEach(verify);
  input.protected_files.forEach(verify);
  for (const p of files(root)) assert.equal(fs.statSync(p).mode & 0o777, 0o444);
  console.log(JSON.stringify({ report: binding(path.join(root, 'report.json')),
    author_freeze: binding(path.join(root, 'author-freeze.json')),
    frozen_files: files(root).length, cumulative_images: 24 }, null, 2));
} else {
  throw new Error('Use init, freeze-inventory, run, or seal exactly once per phase.');
}

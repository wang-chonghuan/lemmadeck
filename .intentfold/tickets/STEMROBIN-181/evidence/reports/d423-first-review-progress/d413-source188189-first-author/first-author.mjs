import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const prep = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d408-source188189-first-preparation');
const tools = path.join(repo, '.claude/skills/ld-s10y-lesson/tools');
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
const pages = [188, 189];
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const pd = n => path.join(root, 'source/10p/pages', String(n).padStart(4, '0'));
const wd = n => path.join(root, 'work/10p/pages', String(n).padStart(4, '0'));
function binding(p) {
  const b = fs.readFileSync(p);
  return { path: p, sha256: crypto.createHash('sha256').update(b).digest('hex'), bytes: b.length };
}
function write(name, value) {
  const p = path.resolve(root, name);
  assert(p.startsWith(root + '/'));
  assert(!fs.existsSync(p), `Existing output, not rerunning: ${p}`);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n');
}
function files(dir) {
  return fs.readdirSync(dir).sort().flatMap(name => {
    const p = path.join(dir, name);
    const s = fs.lstatSync(p);
    assert(!s.isSymbolicLink(), p);
    return s.isDirectory() ? files(p) : [p];
  });
}
function verify(b) { assert.equal(binding(b.path).sha256, b.sha256, b.path); }
function toolBindings() {
  return [
    python, ...['p2c.py', 'blocks.py', 'layout.py', 'normalize.py', 'mathcheck.py',
      'katex_check.js', 'vectorize.py', 'svg_raster.js'].map(n => path.join(tools, n)),
    path.resolve(tools, '../profiles/soviet-cn.json'),
  ].map(binding);
}
function native(name, argv, page) {
  const env = {
    PYTHONDONTWRITEBYTECODE: '1', TMPDIR: path.join(root, 'runtime-tmp'),
    PWDEBUG: '0', PLAYWRIGHT_HTML_OPEN: 'never',
  };
  fs.mkdirSync(env.TMPDIR, { recursive: true });
  const started = {
    invocation_count: 1, argv, exact_invocation: argv.join(' '), cwd: repo,
    started_at: new Date().toISOString(), environment_overrides: env,
    tool_bindings_before: toolBindings(), page_md_before: binding(path.join(pd(page), 'page.md')),
    inventory_freeze: binding(path.join(root, 'source-inventory-freeze.json')),
    browser_launches: 0, renderer: name.startsWith('first-svg') ? 'existing-native-Resvg-no-browser' : null,
  };
  write(`native/${name}.started.json`, started);
  const r = spawnSync(argv[0], argv.slice(1), {
    cwd: repo, env: { ...process.env, ...env }, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
  });
  write(`native/${name}.stdout.txt`, r.stdout ?? '');
  write(`native/${name}.stderr.txt`, r.stderr ?? '');
  const receipt = {
    ...started, finished_at: new Date().toISOString(), exit_code: r.status, signal: r.signal,
    launch_error: r.error?.message ?? null,
    stdout: binding(path.join(root, `native/${name}.stdout.txt`)),
    stderr: binding(path.join(root, `native/${name}.stderr.txt`)),
    page_md_after: binding(path.join(pd(page), 'page.md')), tool_bindings_after: toolBindings(),
    images_loaded_into_author_context: 0,
  };
  write(`native/${name}.receipt.json`, receipt);
  return receipt;
}
const mode = process.argv[2];
if (mode === 'init') {
  const manifest = binding(path.join(prep, 'manifest.json'));
  assert.equal(manifest.sha256, 'c421d2502cc725b3992b1d9b15178717c80b849679d0d1e8e6ab60f150c8012f');
  const m = read(manifest.path);
  assert.deepEqual(m.pages, pages);
  assert.equal(m.inputs.length, 8);
  for (const r of m.receipts) verify({ ...r, path: path.resolve(repo, r.path) });
  const protectedFiles = files(prep).map(binding);
  const copies = [];
  for (const e of m.inputs) {
    const original = binding(path.resolve(repo, e.path));
    assert.equal(original.sha256, e.sha256);
    for (const dir of [pd(e.page), wd(e.page)]) {
      fs.mkdirSync(dir, { recursive: true });
      const p = path.join(dir, path.basename(original.path));
      fs.copyFileSync(original.path, p, fs.constants.COPYFILE_EXCL);
      fs.chmodSync(p, 0o644);
      copies.push({ original, copy: binding(p) });
    }
  }
  for (const name of ['manifest.json', 'prepare-188.receipt.json', 'prepare-189.receipt.json']) {
    const p = path.join(root, 'inputs', name);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.copyFileSync(path.join(prep, name), p, fs.constants.COPYFILE_EXCL);
    fs.chmodSync(p, 0o444);
  }
  write('input-bindings.json', {
    schema: 'source188189-first-author-inputs@1', manifest, protected_files: protectedFiles,
    copies, tools: toolBindings(), preparation_invocations_this_author: 0,
    parent_permanent_images: 24, fresh_author_initial_images: 0,
    author_batch_maximum: 8, author_lifetime_maximum: 24, parent_budget_reset: false,
    helper_reference: binding(path.join(repo,
      '.intentfold/tickets/STEMROBIN-181/tmp/d393-source186-first-author/first-author.mjs')),
    helper_used_for_syntax_only: true,
    scope: 'Finite scratch authoring, no IntentFold capability, product change, DB, git, worker or publication.',
  });
  fs.chmodSync(path.join(root, 'input-bindings.json'), 0o444);
  console.log(JSON.stringify({ input_hashes_verified: 8, copies: copies.length, image_opens: 0 }));
} else if (mode === 'freeze-inventory') {
  for (const page of pages) assert(!fs.existsSync(path.join(pd(page), 'page.md')));
  const opens = read(path.join(root, 'actual-opens.json'));
  assert.equal(opens.actual_tool_opens.length, 4);
  assert.equal(opens.fresh_author_initial_images, 0);
  assert.equal(opens.parent_permanent_images, 24);
  const inventory = binding(path.join(root, 'source-inventory.json'));
  write('source-inventory-freeze.json', {
    schema: 'source188189-inventory-freeze@1', frozen_at: new Date().toISOString(),
    frozen_before_any_candidate: true, inventory, opens_at_inventory_freeze: opens,
    input_bindings: binding(path.join(root, 'input-bindings.json')),
    inventories_composed_from_four_source_opens_not_preparation_counts_or_prior_author: true,
    file_mode: '0444',
  });
  for (const n of ['source-inventory.json', 'source-inventory-freeze.json'])
    fs.chmodSync(path.join(root, n), 0o444);
  console.log(JSON.stringify({ frozen_before_candidates: true, new_opens: 4 }));
} else if (mode === 'run') {
  const inputs = read(path.join(root, 'input-bindings.json'));
  inputs.protected_files.forEach(verify);
  inputs.tools.forEach(verify);
  verify(read(path.join(root, 'source-inventory-freeze.json')).inventory);
  const results = [];
  for (const page of pages) {
    const snapshot = `author-input-${page}-page.md`;
    write(snapshot, fs.readFileSync(path.join(pd(page), 'page.md'), 'utf8'));
    fs.chmodSync(path.join(root, snapshot), 0o444);
    const scope = ['--book', '10p', '--page', String(page), '--root', path.join(root, 'source'),
      '--work', path.join(root, 'work')];
    const base = [python, '-B', path.join(tools, 'p2c.py')];
    const finalize = native(`finalize-${page}`, [...base, 'finalize', ...scope], page);
    const ap = path.join(pd(page), 'audit.json');
    const audit = fs.existsSync(ap) ? read(ap) : null;
    let vectorize = null;
    const previews = [];
    if (finalize.exit_code === 0 && audit?.figures.length) {
      vectorize = native(`vectorize-${page}`, [...base, 'vectorize', ...scope], page);
      if (vectorize.exit_code === 0) {
        for (const f of audit.figures) {
          const svg = path.join(wd(page), 'figures', `${f.id}.svg`);
          const png = path.join(root, 'first-svg-preview', `${f.id}.png`);
          fs.mkdirSync(path.dirname(png), { recursive: true });
          assert(!fs.existsSync(png));
          const name = `first-svg-preview-${f.id}`;
          native(name, ['node', path.join(tools, 'svg_raster.js'), svg, png], page);
          previews.push(binding(path.join(root, `native/${name}.receipt.json`)));
        }
      }
    }
    results.push({
      page, first_finalize_receipt: binding(path.join(root, `native/finalize-${page}.receipt.json`)),
      finalize_exit_code: finalize.exit_code, audit: audit ? binding(ap) : null,
      lines_printed_native: audit?.lines_printed ?? null, lines_md_native: audit?.lines_md ?? null,
      errors: audit?.errors ?? ['No native audit produced'], figure_ids: audit?.figures.map(f => f.id) ?? [],
      first_native_geometry: audit?.figures ?? [], native_finalize_runs: 1,
      native_vectorize_runs: vectorize ? 1 : 0, vectorize_exit_code: vectorize?.exit_code ?? null,
      vectorize_receipt: vectorize ? binding(path.join(root, `native/vectorize-${page}.receipt.json`)) : null,
      previews, author_input_md: binding(path.join(root, snapshot)), author_repairs: 0,
    });
    console.log(JSON.stringify(results.at(-1)));
  }
  inputs.protected_files.forEach(verify);
  write('native-results.json', results);
} else if (mode === 'seal') {
  const inputs = read(path.join(root, 'input-bindings.json'));
  inputs.protected_files.forEach(verify);
  const opens = read(path.join(root, 'actual-opens.json'));
  assert(opens.actual_tool_opens.length <= 8);
  assert.equal(opens.actual_tool_opens.length, opens.new_image_opens);
  const inventory = read(path.join(root, 'source-inventory.json'));
  const results = read(path.join(root, 'native-results.json'));
  const sourceManifestPath = path.join(repo, 'ssot-resources/soviet10year-textbooks/sources/manifest.json');
  const sourceManifest = read(sourceManifestPath);
  const catalog = sourceManifest.catalogs.find(c => c.book === '10p');
  const pdfRecord = sourceManifest.pdfs.find(p => p.book === catalog.sourcePdf);
  const pdf = binding(path.resolve(repo, sourceManifest.pdfRoot, pdfRecord.file));
  assert.equal(pdf.sha256, pdfRecord.sha256);
  for (const page of pages)
    assert.equal(read(path.join(pd(page), 'page.json')).meta.source.pdf_sha256, pdf.sha256);
  const references = [
    '.intentfold/readme.md', '.intentfold/project.json',
    '.intentfold/charter/engineering.md', '.intentfold/charter/operations.md',
    '.claude/skills/ld-s10y-lesson/SKILL.md',
    '.claude/skills/ld-s10y-lesson/references/figure-generation.md',
    '.agents/skills/ld-s10y-image/SKILL.md',
  ].map(p => binding(path.join(repo, p)));
  references.push(binding('/Users/yong/.agents/skills/ips-chrome-background/SKILL.md'));
  references.push(binding('/Users/yong/.agents/skills/intentfold/SKILL.md'));
  write('reference-input-bindings.json', {
    pdf, source_manifest: binding(sourceManifestPath), catalog, pdf_record: pdfRecord,
    loaded_references: references, applicable_extraction_contracts: inputs.tools,
    note: 'Read-only source PDF hashing and native access; no additional source image opens. Modern routing reference read only to confirm no modern figure work is performed.',
    commands: [
      'node .intentfold/tickets/STEMROBIN-181/tmp/d413-source188189-first-author/first-author.mjs init',
      'node .intentfold/tickets/STEMROBIN-181/tmp/d413-source188189-first-author/first-author.mjs freeze-inventory',
      'node .intentfold/tickets/STEMROBIN-181/tmp/d413-source188189-first-author/first-author.mjs run',
      'node .intentfold/tickets/STEMROBIN-181/tmp/d413-source188189-first-author/first-author.mjs seal',
    ],
    native_commands: results.flatMap(r => [
      read(r.first_finalize_receipt.path).exact_invocation,
      ...(r.vectorize_receipt ? [read(r.vectorize_receipt.path).exact_invocation] : []),
      ...r.previews.map(p => read(p.path).exact_invocation),
    ]),
  });
  const out = files(root).map(binding);
  write('report.json', {
    schema: 'source188189-first-author-report@1', ticket: 'STEMROBIN-181', book: '10p', root,
    role: 'FINITE-FIRST-AUTHOR-ONLY', pages: results.map(r => ({
      ...r, blocks_count: read(path.join(pd(r.page), 'page.json')).blocks.length,
      inventory: inventory.pages.find(p => p.physical_page === r.page),
      status: r.finalize_exit_code === 0 ? 'NATIVE-AUTHOR-PASS-INDEPENDENT-PENDING' : 'FIRST-FAIL-RETAINED',
    })),
    inputs, outputs_before_report: out, actual_opens: binding(path.join(root, 'actual-opens.json')),
    source_inventory_freeze: binding(path.join(root, 'source-inventory-freeze.json')),
    reference_input_bindings: binding(path.join(root, 'reference-input-bindings.json')),
    author_crop_observations: binding(path.join(root, 'author-crop-observations.json')),
    first_FAIL_this_batch: results.filter(r => r.finalize_exit_code !== 0),
    all_prior_FAIL_HOLD_retained_outside_owned_root: true,
    raw_crop_opens: opens.raw_crops_opened,
    parent_permanent_images: 24, parent_budget_reset: false, fresh_author_initial_images: 0,
    new_image_opens: opens.new_image_opens, actual_open_paths: opens.actual_tool_opens,
    first_task_batch_maximum: 8, total_author_limit: 24,
    SOURCE188: 'PENDING-INDEPENDENT', SOURCE189: 'PENDING-INDEPENDENT',
    RAW: 'PENDING-INDEPENDENT', nativeSVG: 'PENDING-INDEPENDENT',
    publishable_cards: 'PENDING-INDEPENDENT-NOT-ASSEMBLED-NOT-COMPLETE',
    native_pass_is_not_semantic_source_raw_svg_or_card_approval: true,
    first_raw_svg_previews: out.filter(b => b.path.includes('/first-svg-preview/')),
    first_raw_svg_previews_opened: false,
    open_tails: inventory.pages.map(p => ({ page: p.physical_page, continuity: p.continuity })),
    ownership: {
      only_written_root: root, prepared_inputs_verified_unchanged: true,
      others_edits_preserved_no_reverts: true, source187_pixels_opened: false,
      toc_context_only_no_semantic_heading_import: true,
      old_FAIL_HOLD_unchanged: true, no_author_reruns_or_count_overrides: true,
      canonical_DB_git_index_meter_modern_generation_full_tests_paid_generation: 0,
      descendants_worktrees_branches_workers: 0,
    },
    browser: {
      browser_activity: 0, OS_foreground_CDP_activity: 0,
      entrypoints_inspected: ['p2c.py', 'vectorize.py', 'svg_raster.js'],
      native_preview_engine: 'Resvg; no browser launcher; no visible surface',
      headless_only_boundary_satisfied_without_browser_launch: true,
    },
    disposition: 'Stop after these two pages. SOURCE/RAW/nativeSVG/cards remain pending independent review.',
    file_mode: '0444',
  });
  write('author-freeze.json', {
    schema: 'source188189-first-author-freeze@1', frozen_at: new Date().toISOString(),
    root, files: files(root).map(binding), report: binding(path.join(root, 'report.json')),
    self_hash_excluded: true, new_image_opens: opens.new_image_opens,
    parent_permanent_images: 24, all_independent_approvals_pending: true, file_mode: '0444',
  });
  write('freeze-seal.json', {
    report: binding(path.join(root, 'report.json')),
    author_freeze: binding(path.join(root, 'author-freeze.json')),
    actual_opens: binding(path.join(root, 'actual-opens.json')), self_hash_excluded: true,
  });
  for (const p of files(root)) fs.chmodSync(p, 0o444);
  read(path.join(root, 'author-freeze.json')).files.forEach(verify);
  inputs.protected_files.forEach(verify);
  console.log(JSON.stringify(read(path.join(root, 'freeze-seal.json')), null, 2));
} else {
  throw new Error('Use init, freeze-inventory, run, seal once per phase.');
}

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const preparation = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d412-source190192-first-preparation');
const manifestPath = path.join(preparation, 'manifest.json');
const manifestHash = '995dd9325913f18e725bd320646883b21b0e24f5d3dd0ac5fc19158eeb6175ef';
const tools = path.join(repo, '.claude/skills/ld-s10y-lesson/tools');
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
const pdf = path.join(repo, 'ssot-resources/soviet10year-textbooks/sources/soviet10years/10p 苏联中学课本 物理 十年级 .pdf');
const pages = [190, 191, 192];
const pageDir = (base, page) => path.join(root, base, '10p/pages', String(page).padStart(4, '0'));
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
function binding(p) {
  const b = fs.readFileSync(p);
  return { path: path.resolve(p), sha256: crypto.createHash('sha256').update(b).digest('hex'), bytes: b.length };
}
function write(name, value) {
  const target = path.resolve(root, name);
  assert(target.startsWith(root + '/'));
  assert(!fs.existsSync(target), `Already produced: ${target}`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
}
function files(dir) {
  return fs.readdirSync(dir).sort().flatMap(name => {
    const p = path.join(dir, name);
    const stat = fs.lstatSync(p);
    assert(!stat.isSymbolicLink(), p);
    return stat.isDirectory() ? files(p) : [p];
  });
}
function verify(entry) {
  const actual = binding(entry.path);
  assert.equal(actual.sha256, entry.sha256, entry.path);
  if (entry.bytes !== undefined) assert.equal(actual.bytes, entry.bytes, entry.path);
}
function toolBindings() {
  return [
    fs.realpathSync(python), process.execPath, path.join(root, 'first-author.mjs'),
    ...['p2c.py', 'blocks.py', 'layout.py', 'normalize.py', 'mathcheck.py',
      'katex_check.js', 'vectorize.py', 'svg_raster.js'].map(name => path.join(tools, name)),
    path.join(tools, '../profiles/soviet-cn.json'),
    path.join(root, 'headless-preview.mjs'),
    path.join(root, 'raw-crop.mjs'),
    path.join(repo, 'ssot-resources/soviet10year-textbooks/sources/manifest.json'),
    path.join(repo, 'app/node_modules/playwright/package.json'),
    path.join(repo, 'app/node_modules/playwright-core/package.json'),
  ].map(p => binding(path.resolve(p)));
}
function native(name, argv, page) {
  const overrides = {
    PYTHONDONTWRITEBYTECODE: '1', TMPDIR: path.join(root, 'runtime-tmp'),
    PWDEBUG: '0', PLAYWRIGHT_HTML_OPEN: 'never',
  };
  fs.mkdirSync(overrides.TMPDIR, { recursive: true });
  const started = {
    invocation_count: 1, argv, exact_invocation: argv.join(' '), cwd: repo,
    command_sha256: crypto.createHash('sha256').update(JSON.stringify(argv)).digest('hex'),
    environment_overrides: overrides, started_at: new Date().toISOString(),
    tool_bindings_before: toolBindings(),
    page_md_before: binding(path.join(pageDir('source', page), 'page.md')),
    inventory_freeze: binding(path.join(root, 'source-inventory-freeze.json')),
  };
  write(`native/${name}.started.json`, started);
  const result = spawnSync(argv[0], argv.slice(1), {
    cwd: repo, env: { ...process.env, ...overrides }, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
  });
  for (const stream of ['stdout', 'stderr']) {
    fs.writeFileSync(path.join(root, `native/${name}.${stream}.txt`), result[stream] ?? '', { flag: 'wx' });
  }
  const receipt = {
    ...started, finished_at: new Date().toISOString(), exit_code: result.status,
    signal: result.signal, launch_error: result.error?.message ?? null,
    stdout: binding(path.join(root, `native/${name}.stdout.txt`)),
    stderr: binding(path.join(root, `native/${name}.stderr.txt`)),
    tool_bindings_after: toolBindings(),
    page_md_after: binding(path.join(pageDir('source', page), 'page.md')),
    image_context_opens_during_native: 0,
  };
  write(`native/${name}.receipt.json`, receipt);
  return receipt;
}
const mode = process.argv[2];
if (mode === 'init') {
  assert.equal(binding(manifestPath).sha256, manifestHash);
  const manifest = read(manifestPath);
  assert.deepEqual(manifest.pages, pages);
  assert.equal(manifest.inputs.length, 12);
  const protectedFiles = files(preparation).map(binding);
  const copies = [];
  for (const receipt of manifest.receipts) {
    verify({ ...receipt, path: path.resolve(repo, receipt.path) });
    assert.equal(read(path.resolve(repo, receipt.path)).invocationCount, 1);
  }
  for (const entry of manifest.inputs) {
    const original = binding(path.resolve(repo, entry.path));
    assert.equal(original.sha256, entry.sha256);
    for (const base of ['source', 'work']) {
      const destination = pageDir(base, entry.page);
      fs.mkdirSync(destination, { recursive: true });
      const target = path.join(destination, path.basename(original.path));
      fs.copyFileSync(original.path, target, fs.constants.COPYFILE_EXCL);
      fs.chmodSync(target, 0o644);
      const copy = binding(target);
      assert.equal(copy.sha256, original.sha256);
      copies.push({ original, copy });
    }
  }
  for (const name of ['manifest.json', ...pages.map(p => `prepare-${p}.receipt.json`)]) {
    const dest = path.join(root, 'inputs', name);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(path.join(preparation, name), dest, fs.constants.COPYFILE_EXCL);
    fs.chmodSync(dest, 0o444);
  }
  write('input-bindings.json', {
    schema: 'source190192-first-author-inputs@1',
    preparation_manifest: binding(manifestPath), copies, protected_files: protectedFiles,
    prepare_invocations_by_this_author: 0, parent_image_count_unchanged: 24,
    this_is_genuinely_fresh_image_context: true, context_image_count_at_start: 0,
    image_budget: 8, source_image_budget: 6, additional_raw_crop_open_budget: 2,
    previous189_is_context_only_not_reopened: true,
    prior_helper_used_only_for_syntax_and_native_preview_pattern: true,
    initialization_argv: [process.execPath, path.join(root, 'first-author.mjs'), 'init'],
  });
  fs.chmodSync(path.join(root, 'input-bindings.json'), 0o444);
  console.log(JSON.stringify({ verified_inputs: manifest.inputs.length, copied_files: copies.length, images_opened: 0 }));
} else if (mode === 'freeze-inventory') {
  for (const page of pages) assert(!fs.existsSync(path.join(pageDir('source', page), 'page.md')));
  const inventory = read(path.join(root, 'source-inventory.json'));
  const opens = read(path.join(root, 'actual-opens.json'));
  assert.equal(opens.parent_image_count_unchanged, 24);
  assert.equal(opens.context_image_count_at_start, 0);
  assert.equal(opens.actual_tool_opens.length, 7);
  assert.equal(opens.context_image_count_now, 7);
  assert.deepEqual(inventory.pages.map(p => p.physical_page), pages);
  write('source-inventory-freeze.json', {
    schema: 'source190192-first-author-inventory-freeze@1', frozen_before_any_page_md: true,
    frozen_at: new Date().toISOString(),
    source_inventory: binding(path.join(root, 'source-inventory.json')),
    actual_opens: binding(path.join(root, 'actual-opens.json')),
    input_bindings: binding(path.join(root, 'input-bindings.json')),
    per_page_printed_rows: inventory.pages.map(p => ({ page: p.physical_page, observed: p.printed_line_count })),
    observations_independent_of_author_candidate: true,
    author_observation_is_not_independent_SOURCE_RAW_SVG_review: true, file_mode: '0444',
  });
  for (const name of ['source-inventory.json', 'actual-opens.json', 'source-inventory-freeze.json']) {
    fs.chmodSync(path.join(root, name), 0o444);
  }
  console.log(JSON.stringify({ frozen_before_authoring: true, per_page: inventory.pages.map(p => [p.physical_page, p.printed_line_count]) }));
} else if (mode === 'run') {
  const input = read(path.join(root, 'input-bindings.json'));
  input.protected_files.forEach(verify);
  const frozen = read(path.join(root, 'source-inventory-freeze.json'));
  verify(frozen.source_inventory);
  verify(frozen.actual_opens);
  const inventory = read(frozen.source_inventory.path);
  const opens = read(frozen.actual_opens.path);
  opens.actual_tool_opens.forEach(verify);
  const pdfBinding = binding(pdf);
  assert.equal(pdfBinding.sha256, '7190041b66182e5f6c5a4ef7ae0b04ee3f1afa0df1f5b3ff6317b2c2d1cb8f40');
  write('command-bindings.json', {
    schema: 'source190192-first-author-command-bindings@1',
    driver_phases: ['init', 'freeze-inventory', 'run', 'seal'].map(mode => {
      const argv = [process.execPath, path.join(root, 'first-author.mjs'), mode];
      return { argv, command_sha256: crypto.createHash('sha256').update(JSON.stringify(argv)).digest('hex'),
        expected_invocation_count: 1 };
    }),
    native_commands: 'Each exact native argv and SHA256 is preserved in its started.json and receipt.json.',
    raw_crop_command: binding(path.join(root, 'raw-crop.receipt.json')),
    source_pdf: pdfBinding,
    loaded_contracts: [
      '.claude/skills/ld-s10y-lesson/SKILL.md',
      '.agents/skills/ld-s10y-image/SKILL.md',
      '.intentfold/readme.md', '.intentfold/charter/engineering.md', '.intentfold/charter/operations.md',
      '/Users/yong/.agents/skills/ips-chrome-background/SKILL.md',
      '/Users/yong/.agents/skills/intentfold/SKILL.md',
    ].map(p => binding(path.resolve(repo, p))),
    native_preview_launcher_inspection: binding(path.join(root, 'headless-preview.mjs')),
    launcher_contract: 'Only isolated chromium.launch({headless:true}) and newContext; no persistent profile, CDP, OS input or foreground action. Native svg_raster.js uses resvg and has no browser launcher.',
  });
  const results = [];
  for (const page of pages) {
    const pdir = pageDir('source', page);
    const candidate = path.join(root, 'author-input', `${page}.page.md`);
    fs.mkdirSync(path.dirname(candidate), { recursive: true });
    fs.copyFileSync(path.join(pdir, 'page.md'), candidate, fs.constants.COPYFILE_EXCL);
    fs.chmodSync(candidate, 0o444);
    const scope = ['--book', '10p', '--page', String(page), '--root', path.join(root, 'source'), '--work', path.join(root, 'work')];
    const finalize = native(`finalize-${page}`, [python, path.join(tools, 'p2c.py'), 'finalize', ...scope], page);
    const auditPath = path.join(pdir, 'audit.json');
    const audit = fs.existsSync(auditPath) ? read(auditPath) : null;
    const observed = inventory.pages.find(p => p.physical_page === page);
    let vectorize = null;
    const previews = [];
    if (finalize.exit_code === 0 && audit?.errors.length === 0 && observed.unresolved_glyphs.length === 0 && audit.figures.length) {
      const isolatedWork = path.join(root, 'passing-page-work', String(page));
      const dest = path.join(isolatedWork, '10p/pages', String(page).padStart(4, '0'));
      fs.mkdirSync(dest, { recursive: true });
      fs.cpSync(pageDir('work', page), dest, { recursive: true, errorOnExist: true, force: false });
      const passingScope = ['--book', '10p', '--page', String(page), '--root', path.join(root, 'source'), '--work', isolatedWork];
      vectorize = native(`vectorize-${page}`, [python, path.join(tools, 'p2c.py'), 'vectorize', ...passingScope], page);
      if (vectorize.exit_code === 0) {
        for (const figure of audit.figures) {
          const svg = path.join(dest, 'figures', `${figure.id}.svg`);
          const png = path.join(root, 'first-svg-preview', `${figure.id}.native.png`);
          const screenshot = path.join(root, 'first-svg-preview', `${figure.id}.headless.png`);
          fs.mkdirSync(path.dirname(png), { recursive: true });
          const raster = native(`first-svg-preview-${figure.id}`, [process.execPath, path.join(tools, 'svg_raster.js'), svg, png], page);
          const headless = raster.exit_code === 0
            ? native(`headless-preview-${figure.id}`, [process.execPath, path.join(root, 'headless-preview.mjs'), svg, screenshot], page)
            : null;
          previews.push({ figure: figure.id, raster, headless, native_png: fs.existsSync(png) ? binding(png) : null, headless_png: fs.existsSync(screenshot) ? binding(screenshot) : null, opened_in_image_context: false });
        }
      }
    }
    results.push({
      page, printed_page: observed.printed_page,
      status: finalize.exit_code !== 0 ? 'FIRST-NATIVE-FAIL-RETAINED' : observed.unresolved_glyphs.length ? 'NATIVE-COUNT-PASS-GLYPH-HOLD' : 'NATIVE-AUTHOR-PASS-INDEPENDENT-REVIEWS-PENDING',
      native_finalize_runs: 1, native_vectorize_runs: vectorize ? 1 : 0,
      independently_observed_printed_rows: observed.printed_line_count,
      lines_printed_native: audit?.lines_printed ?? null, lines_md_native: audit?.lines_md ?? null,
      observed_minus_native: audit ? observed.printed_line_count - audit.lines_printed : null,
      native_errors: audit?.errors ?? ['No audit produced'], native_normalizations: audit?.normalizations ?? [],
      finalize_receipt: binding(path.join(root, `native/finalize-${page}.receipt.json`)),
      vectorize_receipt: vectorize ? binding(path.join(root, `native/vectorize-${page}.receipt.json`)) : null,
      author_input_md: binding(candidate), page_md: binding(path.join(pdir, 'page.md')),
      page_json: fs.existsSync(path.join(pdir, 'page.json')) ? binding(path.join(pdir, 'page.json')) : null,
      audit: audit ? binding(auditPath) : null,
      observed_rough_figures: observed.figures, first_native_exact_figures: audit?.figures ?? [],
      previews, unresolved_glyphs: observed.unresolved_glyphs,
      SOURCE: 'PENDING-independent-review', RAW: 'PENDING-independent-review', SVG: 'PENDING-independent-review',
    });
    console.log(JSON.stringify({ page, status: results.at(-1).status, observed: observed.printed_line_count,
      native: audit?.lines_printed, md: audit?.lines_md, figures: audit?.figures.map(f => f.id), vectorize_exit: vectorize?.exit_code }));
  }
  input.protected_files.forEach(verify);
  write('report.json', {
    schema: 'source190192-first-author-report@1', ticket: 'STEMROBIN-181', book: '10p',
    role: 'FINITE-FRESH-FIRST-AUTHOR-ONLY', root, pages: results,
    status: results.some(p => p.status === 'FIRST-NATIVE-FAIL-RETAINED') ? 'FIRST-FAIL-RETAINED-UNAFFECTED-PAGES-CONTINUED' : 'FIRST-AUTHOR-NATIVE-RESULTS-INDEPENDENT-REVIEWS-PENDING',
    source_inventory: binding(path.join(root, 'source-inventory.json')),
    source_inventory_freeze: binding(path.join(root, 'source-inventory-freeze.json')),
    actual_opens: binding(path.join(root, 'actual-opens.json')),
    input_bindings: binding(path.join(root, 'input-bindings.json')),
    inputs: input.copies, protected_preparation: input.protected_files, source_pdf: pdfBinding,
    commands: binding(path.join(root, 'command-bindings.json')),
    tools: toolBindings(), outputs_before_report: files(root).map(binding),
    parent_image_count_unchanged: 24, fresh_context_initial_images: 0, actual_images_opened: 7,
    image_budget: 8, additional_raw_crop_opens: 1, preview_opens: 0, other_page_opens: 0,
    source_inventory_from_pixels_before_candidate: true, first_finalize_once_per_page: true,
    first_fail_receipts_retained: true, reruns: 0, author_repairs_after_finalize: 0,
    profile_counter_counting_flags_changes: 0, row_deletions_to_match_counter: 0,
    all_browser_launchers_inspected_headless_isolated_only: true,
    SVG_previews_saved_unopened: true,
    continuations_and_owners: inventory.continuations_and_owners,
    independent_reviews: { SOURCE: 'PENDING', RAW: 'PENDING', SVG: 'PENDING', n72: 'PENDING', n73: 'PENDING', card: 'PENDING' },
    no_native_counter_SOURCE_or_card_PASS_claim: true, source_or_card_pass: false,
    original_preparation_files_unchanged: true, canonical_writes: 0,
    pages_added_to_meter: 0, complete_cards_added: 0, n72_complete: false, n73_complete: false,
    descendants_worktrees_branches_indexes_meters_DB_git_paidgeneration_fulltests: 0,
    stop_after_physical_pages: pages, file_mode: '0444',
  });
} else if (mode === 'seal') {
  const input = read(path.join(root, 'input-bindings.json'));
  input.protected_files.forEach(verify);
  const report = read(path.join(root, 'report.json'));
  const owned = files(root).map(binding);
  write('author-freeze.json', {
    schema: 'source190192-first-author-freeze@1', ticket: 'STEMROBIN-181', root,
    frozen: true, frozen_at: new Date().toISOString(), report: binding(path.join(root, 'report.json')),
    files: owned, self_hash_excluded: true,
    per_page_first_counts_status_figures: report.pages.map(p => ({
      page: p.page, observed_rows: p.independently_observed_printed_rows,
      native_rows: p.lines_printed_native, md_rows: p.lines_md_native,
      status: p.status, figures: p.first_native_exact_figures.map(f => f.id),
    })),
    parent_image_count_unchanged: 24, actual_images_opened: 7, source_or_card_pass: false,
    independent_reviews: report.independent_reviews, file_mode: '0444',
  });
  for (const p of files(root)) fs.chmodSync(p, 0o444);
  owned.forEach(verify);
  input.protected_files.forEach(verify);
  for (const p of files(root)) assert.equal(fs.statSync(p).mode & 0o777, 0o444);
  console.log(JSON.stringify({ report: binding(path.join(root, 'report.json')),
    author_freeze: binding(path.join(root, 'author-freeze.json')),
    actual_opens: binding(path.join(root, 'actual-opens.json')), frozen_files: files(root).length }, null, 2));
} else {
  throw new Error('Use init, freeze-inventory, run, seal once each.');
}

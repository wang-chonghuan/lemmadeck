import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const preparation = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d406-source187-first-preparation');
const manifestPath = path.join(preparation, 'manifest.json');
const manifestHash = '03fd98f523ea7ae9de7a2e278fb59bf6d86c911113209e3f4884b5e58a1133a6';
const tools = path.join(repo, '.claude/skills/ld-s10y-lesson/tools');
const pdir = path.join(root, 'source/10p/pages/0187');
const wdir = path.join(root, 'work/10p/pages/0187');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
function binding(p) {
  const data = fs.readFileSync(p);
  return { path: p, sha256: crypto.createHash('sha256').update(data).digest('hex'), bytes: data.length };
}
function owned(p) {
  const target = path.resolve(root, p);
  assert(target.startsWith(root + '/'), `Outside ownership: ${target}`);
  return target;
}
function write(name, value) {
  const target = owned(name);
  assert(!fs.existsSync(target), `Already produced: ${target}`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
}
function files(dir) {
  return fs.readdirSync(dir).sort().flatMap(name => {
    const p = path.join(dir, name);
    const stat = fs.lstatSync(p);
    assert(!stat.isSymbolicLink(), `Unexpected symlink: ${p}`);
    return stat.isDirectory() ? files(p) : [p];
  });
}
function verify(entry) {
  const current = binding(path.resolve(repo, entry.path));
  assert.equal(current.sha256, entry.sha256);
  if (entry.bytes !== undefined) assert.equal(current.bytes, entry.bytes);
  return current;
}
function init() {
  assert.equal(binding(manifestPath).sha256, manifestHash);
  assert(!fs.existsSync(path.join(root, 'input-bindings.json')));
  const manifest = read(manifestPath);
  assert.equal(manifest.ticket, 'STEMROBIN-181');
  assert.equal(manifest.book, '10p');
  assert.deepEqual(manifest.pages, [187]);
  assert.equal(manifest.newImageOpens, 0);
  assert.equal(manifest.parentImageCount, 24);
  assert.equal(manifest.sourcePagesAdded, 0);
  const inputs = manifest.inputs.map(verify);
  const receipt = verify(manifest.receipt);
  const previous = verify(manifest.previous);
  assert.equal(read(receipt.path).exitCode, 0);
  assert.equal(read(receipt.path).invocationCount, 1);
  const preparedFiles = files(path.resolve(repo, manifest.sourceWork)).map(binding);
  const protectedFiles = files(preparation).map(binding);
  const copies = preparedFiles.map(entry => {
    const relative = path.relative(path.resolve(repo, manifest.sourceWork), entry.path);
    const destination = owned(path.join('work', relative));
    assert(!fs.existsSync(destination));
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(entry.path, destination, fs.constants.COPYFILE_EXCL);
    const copied = binding(destination);
    assert.equal(copied.sha256, entry.sha256);
    return { original: entry, copy: copied };
  });
  fs.mkdirSync(pdir, { recursive: true });
  fs.mkdirSync(owned('inputs'), { recursive: true });
  for (const entry of [binding(manifestPath), receipt]) {
    fs.copyFileSync(entry.path, owned(path.join('inputs', path.basename(entry.path))), fs.constants.COPYFILE_EXCL);
  }
  const template = fs.readFileSync(path.join(wdir, 'page.template.md'), 'utf8');
  const meta = JSON.parse(template.split('---')[1]);
  assert.equal(meta.render.sha256, inputs.find(p => p.path.endsWith('/page.png')).sha256);
  write('input-bindings.json', {
    schema: 'source187-first-author/input-bindings@1',
    verified_at: new Date().toISOString(),
    manifest: binding(manifestPath), receipt, inputs, copies, protectedFiles,
    previous_context_only: { ...previous, text_read: false, image_opens: 0, semantic_use: false },
    source_root: path.join(root, 'source'), work_root: path.join(root, 'work'),
    prepared_work_unmodified: true,
    initial_image_opens: 0, parent_image_count: 24, no_image_budget_reset: true,
    ownership: { only: root, external_writes: false },
  });
  console.log(JSON.stringify({ status: 'BINDINGS-VERIFIED-WORK-COPIED', work: wdir, images: 0 }));
}
function inventoryFreeze() {
  assert(!fs.existsSync(path.join(pdir, 'page.md')));
  assert(!fs.existsSync(path.join(pdir, 'page.json')));
  const inventory = read(owned('source-inventory.json'));
  const opens = read(owned('actual-opens.json'));
  assert.equal(inventory.candidate_read, false);
  assert.equal(opens.cumulative_context_images, opens.events.length);
  for (const event of opens.events) verify(event.input);
  write('source-inventory-freeze.json', {
    schema: 'source187-first-author/source-reading-freeze@1',
    frozen_at: new Date().toISOString(),
    source_inventory: binding(owned('source-inventory.json')),
    actual_opens_at_reading: binding(owned('actual-opens.json')),
    input_bindings: binding(owned('input-bindings.json')),
    candidate_exists: false, candidate_read: false, native_finalize_runs: 0,
    independently_read_from_prepared_pixels_before_candidate: true,
    independent_source_approval: false,
  });
  fs.chmodSync(owned('source-inventory.json'), 0o444);
  fs.chmodSync(owned('source-inventory-freeze.json'), 0o444);
  console.log(JSON.stringify(binding(owned('source-inventory-freeze.json'))));
}

function toolBindings() {
  return [
    path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python'),
    ...['p2c.py', 'blocks.py', 'layout.py', 'normalize.py', 'mathcheck.py',
      'katex_check.js', 'vectorize.py', 'svg_raster.js'].map(name => path.join(tools, name)),
    path.resolve(tools, '../profiles/soviet-cn.json'),
    path.resolve(tools, '../package.json'),
    path.resolve(tools, '../package-lock.json'),
  ].map(binding);
}
function sourcePdfBinding() {
  const manifest = path.join(repo, 'ssot-resources/soviet10year-textbooks/sources/manifest.json');
  const data = read(manifest);
  const catalog = data.catalogs.find(item => item.book === '10p');
  const record = data.pdfs.find(item => item.book === catalog.sourcePdf);
  const candidates = [path.resolve(repo, data.pdfRoot), path.resolve(path.dirname(manifest), data.pdfRoot)];
  const pdfRoot = candidates.find(p => fs.existsSync(p));
  const pdf = binding(path.join(pdfRoot, record.file));
  const template = JSON.parse(fs.readFileSync(path.join(wdir, 'page.template.md'), 'utf8').split('---')[1]);
  assert.equal(pdf.sha256, template.source.pdf_sha256);
  return { manifest: binding(manifest), pdf };
}
function authorRows(md) {
  let kind = null;
  let block = 0;
  return md.split('---').slice(2).join('---').split(/\r?\n/).flatMap(line => {
    const header = line.match(/^<!--\s+(h1|h2|h3|p|exhead|ex|fig|cap|foot)\b.*-->$/);
    if (header) {
      kind = header[1];
      block += 1;
      return [];
    }
    if (!kind || kind === 'fig' || !line.trim() || line.startsWith('![')) return [];
    return [{
      block, kind, authored: line,
      literal: line.replace(/\$([^$]+)\$/g, '$1').replace(/\*/g, '').trimEnd(),
      italic_math: [...line.matchAll(/\$([^$]+)\$/g)].map(m => m[1]),
    }];
  });
}
function compareRows(md, inventory) {
  const rows = authorRows(md);
  return {
    independently_observed_rows: inventory.observed_text_row_count,
    authored_rows: rows.length,
    count_matches: rows.length === inventory.rows.length,
    rows: inventory.rows.map((source, index) => {
      const author = rows[index];
      const expectedItalic = source.italic.filter(text => text !== '177');
      return {
        source_row: source.id, source_text: source.text,
        source_kind: source.kind, source_bold: source.bold, source_italic: source.italic,
        authored: author?.authored ?? null,
        author_block: author ? `p0187#${author.block}` : null,
        literal_matches: author?.literal === source.text,
        kind_matches: author?.kind === source.kind,
        italic_math_matches: JSON.stringify(author?.italic_math) === JSON.stringify(expectedItalic),
        bold_matches: source.bold.every(text =>
          author?.authored.includes(`**${text}**`) || author?.authored.includes(`***${text}***`)),
        footer_italic_matches: source.id !== 'r23' || author?.authored.includes('***177***'),
      };
    }),
  };
}
function native(name, argv) {
  assert(!fs.existsSync(owned(`native/${name}.started.json`)), 'No native reruns permitted');
  const overrides = {
    PYTHONDONTWRITEBYTECODE: '1',
    TMPDIR: owned('runtime-tmp'),
    PLAYWRIGHT_HTML_OPEN: 'never',
  };
  fs.mkdirSync(overrides.TMPDIR, { recursive: true });
  const env = { ...process.env, ...overrides };
  delete env.PWDEBUG;
  const started = {
    invocation_count: 1, argv, exact_invocation: argv.join(' '), cwd: repo,
    environment_overrides: overrides, unset_environment: ['PWDEBUG'],
    started_at: new Date().toISOString(),
    tool_bindings_before: toolBindings(),
    source_pdf_bindings: sourcePdfBinding(),
    page_md_before: binding(path.join(pdir, 'page.md')),
    source_inventory_freeze: binding(owned('source-inventory-freeze.json')),
    image_tool_opens_during_native: 0,
  };
  write(`native/${name}.started.json`, started);
  const result = spawnSync(argv[0], argv.slice(1), {
    cwd: repo, env, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
  });
  for (const stream of ['stdout', 'stderr']) {
    fs.writeFileSync(owned(`native/${name}.${stream}.txt`), result[stream] ?? '', { flag: 'wx' });
  }
  const receipt = {
    ...started, finished_at: new Date().toISOString(),
    exit_code: result.status, signal: result.signal,
    launch_error: result.error?.message ?? null,
    stdout: binding(owned(`native/${name}.stdout.txt`)),
    stderr: binding(owned(`native/${name}.stderr.txt`)),
    stdout_text: result.stdout ?? '', stderr_text: result.stderr ?? '',
    tool_bindings_after: toolBindings(),
    page_md_after: binding(path.join(pdir, 'page.md')),
  };
  write(`native/${name}.receipt.json`, receipt);
  return receipt;
}
function runFirst() {
  assert(!fs.existsSync(owned('native/finalize-187.started.json')));
  const frozen = read(owned('source-inventory-freeze.json'));
  verify(frozen.source_inventory);
  verify(frozen.actual_opens_at_reading);
  const inputBindings = read(owned('input-bindings.json'));
  inputBindings.protectedFiles.forEach(verify);
  const inventory = read(owned('source-inventory.json'));
  const md = fs.readFileSync(path.join(pdir, 'page.md'), 'utf8');
  const meta = JSON.parse(md.split('---')[1]);
  assert(!meta.counting && !meta.figure_crops);
  const rowMatch = compareRows(md, inventory);
  write('pre-native-row-match.json', rowMatch);
  assert(rowMatch.count_matches);
  assert(rowMatch.rows.every(row => row.literal_matches && row.kind_matches &&
    row.italic_math_matches && row.bold_matches && row.footer_italic_matches));
  fs.copyFileSync(path.join(pdir, 'page.md'), owned('author-input-page.md'), fs.constants.COPYFILE_EXCL);
  fs.chmodSync(owned('author-input-page.md'), 0o444);
  write('author-candidate-freeze.json', {
    frozen_at: new Date().toISOString(),
    author_input: binding(owned('author-input-page.md')),
    source_inventory_freeze: binding(owned('source-inventory-freeze.json')),
    row_match: binding(owned('pre-native-row-match.json')),
    observed_rows: inventory.observed_text_row_count,
    native_runs_before: 0, counting_override: false, figure_crop_override: false,
  });
  const base = [path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python'),
    '-B', path.join(tools, 'p2c.py')];
  const scope = ['--book', '10p', '--page', '187',
    '--root', path.join(root, 'source'), '--work', path.join(root, 'work')];
  const finalize = native('finalize-187', [...base, 'finalize', ...scope]);
  const audit = fs.existsSync(path.join(pdir, 'audit.json')) ? read(path.join(pdir, 'audit.json')) : null;
  const previews = [];
  let vectorize = null;
  if (finalize.exit_code === 0) {
    assert(audit && audit.errors.length === 0);
    assert.deepEqual(fs.readdirSync(path.join(root, 'work/10p/pages')), ['0187']);
    assert.deepEqual(fs.readdirSync(path.join(root, 'source/10p/pages')), ['0187']);
    vectorize = native('vectorize-187', [...base, 'vectorize', ...scope]);
    if (vectorize.exit_code === 0) {
      fs.mkdirSync(owned('first-svg-preview'), { recursive: true });
      for (const figure of audit.figures) {
        previews.push(native(`first-svg-preview-${figure.id}`, [
          'node', path.join(tools, 'svg_raster.js'),
          path.join(wdir, 'figures', `${figure.id}.svg`),
          owned(`first-svg-preview/${figure.id}.png`),
        ]));
      }
    }
  }
  write('native-results.json', { finalize, vectorize, previews });
  console.log(JSON.stringify({
    status: finalize.exit_code === 0 ? 'FIRST-NATIVE-AUTHOR-PASS' : 'FIRST-NATIVE-AUTHOR-FAIL-PRESERVED',
    printed_rows: audit?.lines_printed, author_rows: audit?.lines_md,
    errors: audit?.errors ?? [finalize.launch_error],
    figure_ids: audit?.figures.map(f => f.id) ?? [],
    vectorize_exit_code: vectorize?.exit_code ?? null,
    first_previews: previews.map(r => ({ exit_code: r.exit_code, stdout: r.stdout_text })),
    image_tool_opens: read(owned('actual-opens.json')).cumulative_context_images,
  }));
}
function finish() {
  assert(!fs.existsSync(owned('report.json')));
  const inputs = read(owned('input-bindings.json'));
  inputs.protectedFiles.forEach(verify);
  inputs.copies.forEach(entry => verify(entry.copy));
  verify(inputs.previous_context_only);
  const inventory = read(owned('source-inventory.json'));
  const results = read(owned('native-results.json'));
  const auditPath = path.join(pdir, 'audit.json');
  const audit = fs.existsSync(auditPath) ? read(auditPath) : null;
  const pagePath = path.join(pdir, 'page.json');
  const page = fs.existsSync(pagePath) ? read(pagePath) : null;
  const nativeMd = fs.readFileSync(path.join(pdir, 'page.md'), 'utf8');
  const postMatch = compareRows(nativeMd, inventory);
  write('post-native-row-match.json', postMatch);
  const completeMatch = postMatch.count_matches && postMatch.rows.every(row =>
    row.literal_matches && row.kind_matches && row.italic_math_matches &&
    row.bold_matches && row.footer_italic_matches);
  const opens = read(owned('actual-opens.json'));
  assert.equal(opens.cumulative_context_images, 4);
  const figureBindings = (audit?.figures ?? []).map(figure => {
    const png = path.join(wdir, 'figures', `${figure.id}.png`);
    const svg = path.join(wdir, 'figures', `${figure.id}.svg`);
    const preview = owned(`first-svg-preview/${figure.id}.png`);
    return {
      id: figure.id, label: figure.label,
      source_inventory: binding(owned('source-inventory.json')),
      source_image: binding(path.join(wdir, 'page.png')),
      rough_frame: inventory.figures.find(f => f.id === figure.id)?.rough_frame_xywh,
      native_snapped_frame: figure.box, native_geometry: figure,
      raw_png: fs.existsSync(png) ? binding(png) : null,
      new_svg: fs.existsSync(svg) ? binding(svg) : null,
      first_saved_preview: fs.existsSync(preview) ? binding(preview) : null,
      first_saved_preview_opened: false,
      raw_png_opened: false, svg_opened: false,
      owner_source_reference: 'p0187#8 / 练习 7 / printed exercise 3',
      caption_source_reference: 'p0187#10 / r17',
      RAW_approval: 'pending-independent', new_SVG_approval: 'pending-independent',
    };
  });
  const instructionInputs = [
    path.join(repo, '.claude/skills/ld-s10y-lesson/SKILL.md'),
    path.join(repo, '.claude/skills/ld-s10y-lesson/references/figure-generation.md'),
    path.join(repo, '.agents/skills/ld-s10y-image/SKILL.md'),
    '/Users/yong/.agents/skills/ips-chrome-background/SKILL.md',
    '/Users/yong/.agents/skills/intentfold/SKILL.md',
    path.join(repo, '.intentfold/readme.md'),
    path.join(repo, '.intentfold/charter/engineering.md'),
    path.join(repo, '.intentfold/charter/operations.md'),
    path.join(repo, '.intentfold/project.json'),
    path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d393-source186-first-author/first-author.mjs'),
  ].map(binding);
  const status = results.finalize.exit_code !== 0 ? 'FIRST-NATIVE-AUTHOR-FAIL-PRESERVED' :
    !completeMatch ? 'FIRST-NATIVE-PASS-AUTHOR-ROW-MISMATCH-HOLD' :
    results.vectorize?.exit_code !== 0 ? 'FIRST-NATIVE-AUTHOR-PASS-VECTORIZE-FAIL-HOLD' :
    results.previews.some(r => r.exit_code !== 0) ? 'FIRST-NATIVE-AUTHOR-PASS-PREVIEW-FAIL-HOLD' :
    'FIRST-NATIVE-AUTHOR-PASS-PENDING-INDEPENDENT';
  const vectorCounts = results.vectorize?.stdout_text.match(/\[vectorize\] (\d+) 张通过, (\d+) 张不匹配超限/);
  const reportedMismatch = [...(results.vectorize?.stdout_text ?? '').matchAll(
    /0187\/(\S+)\s+不匹配 ([0-9.]+)%/g,
  )].map(match => ({ figure_id: match[1], reported_mismatch_percent: Number(match[2]),
    precision: 'Native stdout percent rounded to 3 decimals; no unreported exact pixel totals inferred.' }));
  const nativeCounts = {
    prepare_runs_here: 0, finalize_invocations: 1,
    vectorize_invocations: results.vectorize ? 1 : 0,
    first_saved_preview_invocations: results.previews.length,
    observed_rows: inventory.observed_text_row_count,
    native_printed_rows: audit?.lines_printed ?? null,
    native_author_rows: audit?.lines_md ?? null,
    native_blocks: page?.blocks.length ?? null,
    native_figures: audit?.figures.length ?? null,
    native_normalizations: audit?.normalizations.length ?? null,
    native_errors: audit?.errors ?? [],
    vectorize_passed: vectorCounts ? Number(vectorCounts[1]) : null,
    vectorize_failed: vectorCounts ? Number(vectorCounts[2]) : null,
    vectorize_reported_mismatch: reportedMismatch,
    saved_preview_dimensions: results.previews.map(receipt => ({
      name: path.basename(receipt.argv[receipt.argv.length - 1]),
      ...(receipt.exit_code === 0 ? JSON.parse(receipt.stdout_text) : { ok: false }),
    })),
    repairs: 0, reruns: 0, line_deletions: 0, counting_overrides: 0,
  };
  write('report.json', {
    schema: 'source187-first-author/report@1',
    ticket: 'STEMROBIN-181', author: 'd407-source187-first-author',
    status, finished_at: new Date().toISOString(),
    scope: { source_root: path.join(root, 'source'), work_root: path.join(root, 'work'),
      only_source_page: 187, printed_page: 177, new_owner_root: root },
    all_preparation_bindings: inputs,
    instruction_inputs: instructionInputs,
    native_source_pdf_inputs: sourcePdfBinding(),
    native_tool_inputs: toolBindings(),
    inventory: binding(owned('source-inventory.json')),
    independent_from_candidate_reading_freeze: binding(owned('source-inventory-freeze.json')),
    candidate_input: binding(owned('author-input-page.md')),
    candidate_freeze: binding(owned('author-candidate-freeze.json')),
    pre_native_row_match: binding(owned('pre-native-row-match.json')),
    post_native_row_match: binding(owned('post-native-row-match.json')),
    all_rows_match_frozen_reading_after_native: completeMatch,
    native_counts: nativeCounts, exact_native_commands_stdout_stderr_status: results,
    first_finalize_failure_preserved: results.finalize.exit_code !== 0,
    exact_first_finalize_defects: audit?.errors ?? [],
    figures: figureBindings,
    browser_and_preview_execution: {
      browser_launches: 0, foreground_or_CUA_or_OS_input: false,
      method: 'Existing svg_raster.js entrypoint (resvg), headless non-browser raster subprocess; isolated task-owned TMPDIR, no browser profile, CDP or GUI.',
      entrypoint_inspected_before_execution: true,
      temporary_vectorize_fidelity_rasters: 'Native vectorize uses svg_raster.js inside task TMPDIR; not opened or counted as visual context images.',
      saved_previews: 'First explicitly saved previews from new SVGs; all remain unopened for separately assigned independent review.',
      no_snapshot_or_existing_page_native_reruns: true,
    },
    actual_opens: binding(owned('actual-opens.json')),
    cumulative_images: opens.cumulative_context_images,
    parent_images: 24, parent_received_images: 0,
    sourceopen_tail: opens.sourceopen_tail, refownership: opens.refownership,
    approvals: {
      native_author_pass_is_independent_source_or_raw_approval: false,
      SOURCE187: 'pending-independent',
      RAW: 'pending-independent',
      new_SVG: 'pending-independent',
      full_n71: 'pending-independent-not-complete-not-claimed',
      full_card: 'pending-independent-not-complete-not-claimed',
      old_FAIL_HOLD: 'untouched',
    },
    boundaries: inventory.boundaries,
    protected_inputs_unchanged: true,
    prohibited_actions: {
      canonical_writes: 0, index_writes: 0, meter_writes: 0,
      git_writes: 0, DB_writes: 0, paid_generation: 0,
      whole_book_vectorize: 0, modern_figures: 0,
      full_tests_or_build: 0, existing_page_native_reruns: 0,
      descendants: 0, worktrees: 0, branches: 0, permanent_chats: 0,
      edits_or_reverts_to_others: 0, automatic_compaction_reset: false,
    },
    output_bindings_before_report: files(root).map(binding),
  });
  const sealedFiles = files(root).filter(p => !p.includes('/runtime-tmp/')).map(binding);
  const frozen = {
    schema: 'source187-first-author/author-freeze@1',
    frozen_at: new Date().toISOString(), mode: '0444',
    status, ticket: 'STEMROBIN-181', owner_root: root,
    report: binding(owned('report.json')),
    source_inventory: binding(owned('source-inventory.json')),
    source_inventory_freeze: binding(owned('source-inventory-freeze.json')),
    actual_opens: binding(owned('actual-opens.json')),
    native_counts: nativeCounts, figures: figureBindings,
    inputs: { preparation: inputs, native_source: sourcePdfBinding(),
      tools: toolBindings(), instructions: instructionInputs },
    outputs: sealedFiles,
    cumulative_images: opens.cumulative_context_images, parent_images: 24,
    sourceopen_tail: opens.sourceopen_tail, refownership: opens.refownership,
    approval_scope: 'Author native result only. SOURCE187, RAW, new SVG, full n71 and full card pending independent; old FAIL/HOLD untouched.',
    exclusion: 'This freeze cannot self-hash. freeze-seal.json binds its final bytes and 0444 mode.',
  };
  write('author-freeze.json', frozen);
  for (const entry of [...sealedFiles, binding(owned('author-freeze.json'))]) {
    assert(entry.path.startsWith(root + '/'));
    verify(entry);
    fs.chmodSync(entry.path, 0o444);
  }
  const freeze = binding(owned('author-freeze.json'));
  const report = binding(owned('report.json'));
  write('freeze-seal.json', {
    schema: 'source187-first-author/freeze-seal@1',
    author_freeze: freeze, author_freeze_mode: (fs.statSync(freeze.path).mode & 0o777).toString(8),
    report, report_mode: (fs.statSync(report.path).mode & 0o777).toString(8),
    all_frozen_files: sealedFiles,
    all_frozen_bindings_verified: true,
  });
  fs.chmodSync(owned('freeze-seal.json'), 0o444);
  console.log(JSON.stringify({ status, observed_rows: inventory.observed_text_row_count,
    native_printed_rows: audit?.lines_printed, native_author_rows: audit?.lines_md,
    figure_ids: figureBindings.map(f => f.id), cumulative_images: opens.cumulative_context_images,
    report, author_freeze: freeze, source_inventory_freeze: binding(owned('source-inventory-freeze.json')),
    freeze_seal: binding(owned('freeze-seal.json')) }, null, 2));
}

const mode = process.argv[2];
if (mode === 'init') init();
else if (mode === 'inventory-freeze') inventoryFreeze();
else if (mode === 'run-first') runFirst();
else if (mode === 'finish') finish();
else throw new Error(`Unknown mode: ${mode}`);

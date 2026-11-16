import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const cwd = '/Users/yong/.codex/worktrees/a07e/lemmadeck';
const root = path.join(cwd, '.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p56-p59-author-evidence');
const pages = [56, 57, 58, 59];
const estimates = [26, 25, 26, 25];
const workBase = path.join(cwd, '.tmp/ld-s10y-lesson/9-10g/pages');
const durableBase = path.join(cwd, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages');
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const writeJson = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
};

function filesBelow(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? filesBelow(file) : entry.isFile() ? [file] : [];
  }).sort();
}

function fileRecord(file) {
  return { path: file, bytes: fs.statSync(file).size, sha256: sha(file) };
}

function snapshot(page, stage) {
  const id = String(page).padStart(4, '0');
  const target = path.join(root, id, stage);
  if (fs.existsSync(target)) throw new Error(`Snapshot already exists: ${target}`);
  fs.mkdirSync(target, { recursive: true });
  const groups = [];
  for (const [label, source] of [
    ['prepared', path.join(workBase, id)],
    ['durable', path.join(durableBase, id)],
  ]) {
    const exists = fs.existsSync(source);
    const records = [];
    if (exists) {
      for (const file of filesBelow(source)) {
        const saved = path.join(target, label, path.relative(source, file));
        fs.mkdirSync(path.dirname(saved), { recursive: true });
        fs.copyFileSync(file, saved, fs.constants.COPYFILE_EXCL);
        records.push({ ...fileRecord(file), snapshot: saved, snapshot_sha256: sha(saved) });
      }
    }
    groups.push({ label, source, exists, files: records });
  }
  writeJson(path.join(target, 'manifest.json'), {
    schema: 'source-author-snapshot@1', page, stage, cwd,
    captured_at: new Date().toISOString(), groups,
  });
  return target;
}

const [mode, pageArg] = process.argv.slice(2);
if (mode === 'init') {
  if (fs.existsSync(root)) throw new Error(`Evidence already exists: ${root}`);
  fs.mkdirSync(root, { recursive: true });
  const prepared = pages.map((page, index) => {
    const id = String(page).padStart(4, '0');
    for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) {
      if (!fs.existsSync(path.join(workBase, id, name))) throw new Error(`Missing preparation ${id}/${name}`);
    }
    if (fs.existsSync(path.join(durableBase, id, 'audit.json'))) throw new Error(`Page ${id} already finalized`);
    return {
      page, parent_reported_prepare_exit: 0,
      parent_reported_prefigure_line_estimate: estimates[index],
      estimate_provenance: 'User-supplied parent observation; not a post-mask expectation or override.',
      initial_snapshot: snapshot(page, 'before-author'),
    };
  });
  writeJson(path.join(root, 'initial.json'), { cwd, book: '9-10g', scope: pages, prepared });
  console.log(JSON.stringify({ root, prepared }, null, 2));
} else if (mode === 'finalize') {
  const page = Number(pageArg);
  if (!pages.includes(page)) throw new Error('Outside author scope');
  const id = String(page).padStart(4, '0');
  const operations = path.join(root, id, 'operation');
  fs.mkdirSync(operations, { recursive: true });
  const once = path.join(operations, 'finalize-once.json');
  fs.writeFileSync(once, `${JSON.stringify({ page, started_at: new Date().toISOString() })}\n`, { flag: 'wx' });
  const before = snapshot(page, 'before-finalize');
  const argv = [
    '.claude/skills/ld-s10y-lesson/.venv/bin/python',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py',
    'finalize', '--book', '9-10g', '--page', String(page),
  ];
  const started = new Date().toISOString();
  const result = spawnSync(argv[0], argv.slice(1), { cwd, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  const stdout = path.join(operations, 'finalize.stdout.txt');
  const stderr = path.join(operations, 'finalize.stderr.txt');
  fs.writeFileSync(stdout, result.stdout ?? '');
  fs.writeFileSync(stderr, result.stderr ?? '');
  const after = snapshot(page, 'after-finalize');
  const command = {
    cwd, argv, started_at: started, ended_at: new Date().toISOString(),
    exit_code: result.status, signal: result.signal,
    spawn_error: result.error ? String(result.error) : null,
    stdout: fileRecord(stdout), stderr: fileRecord(stderr),
    before_snapshot: before, after_snapshot: after,
  };
  writeJson(path.join(operations, 'finalize.command.json'), command);
  process.stdout.write(result.stdout ?? '');
  process.stderr.write(result.stderr ?? '');
  console.log(JSON.stringify(command, null, 2));
  process.exitCode = result.status ?? 2;
} else if (mode === 'freeze') {
  const author = path.join(cwd, '.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p56-p59-author.md');
  const integrity = [];
  for (const page of pages) {
    const id = String(page).padStart(4, '0');
    for (const stage of ['before-author', 'before-finalize', 'after-finalize']) {
      const manifestFile = path.join(root, id, stage, 'manifest.json');
      const saved = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
      for (const group of saved.groups) {
        for (const record of group.files) {
          if (sha(record.snapshot) !== record.snapshot_sha256) throw new Error(`Snapshot changed: ${record.snapshot}`);
          if (stage === 'after-finalize' && sha(record.path) !== record.sha256) throw new Error(`Output changed: ${record.path}`);
        }
      }
    }
    const initial = JSON.parse(fs.readFileSync(path.join(root, id, 'before-author/manifest.json'), 'utf8'));
    const immutable = initial.groups.find(group => group.label === 'prepared').files;
    for (const record of immutable) {
      if (sha(record.path) !== record.sha256) throw new Error(`Preparation changed: ${record.path}`);
    }
    const commandFile = path.join(root, id, 'operation/finalize.command.json');
    const command = JSON.parse(fs.readFileSync(commandFile, 'utf8'));
    const audit = JSON.parse(fs.readFileSync(path.join(durableBase, id, 'audit.json'), 'utf8'));
    integrity.push({
      page, finalizer_invocations: 1, exit_code: command.exit_code,
      lines_printed: audit.lines_printed, lines_md: audit.lines_md,
      audit_errors: audit.errors, figures: audit.figures.map(figure => figure.id),
      command: fileRecord(commandFile),
      prepared_inputs_unchanged: true,
      snapshots_unchanged: true,
      outputs_match_after_snapshot: true,
    });
  }
  const viewed = [
    [56, 'page.grid.png'], [56, 'figures/fig-58.png'], [56, 'figures/fig-59.png'],
    [57, 'page.grid.png'], [58, 'page.grid.png'], [58, 'figures/fig-60.png'],
    [59, 'page.grid.png'], [59, 'figures/fig-61.png'],
  ];
  const imageViews = viewed.map(([page, name], index) => ({
    ordinal: index + 1, page, kind: name === 'page.grid.png' ? 'prepared-page' : 'actual-first-finalize-crop',
    tool: 'functions.view_image', detail: 'original', observed_views: 1,
    ...fileRecord(path.join(workBase, String(page).padStart(4, '0'), name)),
  }));
  writeJson(path.join(root, 'image-views.json'), {
    schema: 'source-author-image-views@1', batch_images: imageViews.length,
    context_images: imageViews.length, maximum_authorized_images: 8,
    prior_page_images: 0, reopens: 0, remaining_unviewed_crops: [],
    evidence_kind: 'Author ledger of actual tool calls; not independent review.',
    image_views: imageViews,
  });
  writeJson(path.join(root, 'freeze-integrity.json'), {
    schema: 'source-author-freeze-integrity@1',
    purpose: 'Byte consistency with retained observations; no independent semantic PASS.',
    cwd, pages: integrity,
  });
  const outputs = pages.flatMap(page => {
    const id = String(page).padStart(4, '0');
    return [
      ...filesBelow(path.join(durableBase, id)),
      ...filesBelow(path.join(workBase, id, 'figures')),
    ];
  });
  const manifest = {
    schema: 'source-author-frozen-manifest@1', cwd, book: '9-10g',
    requested_pages: pages, frozen_at: new Date().toISOString(),
    image_views: imageViews, actual_finalize_results: integrity,
    author_report: fileRecord(author),
    evidence_script: fileRecord(path.join(cwd, '.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p56-p59-author-evidence.mjs')),
    outputs: outputs.map(fileRecord),
    evidence: filesBelow(root).map(fileRecord),
  };
  const target = path.join(cwd, '.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p56-p59-author.manifest.json');
  if (fs.existsSync(target)) throw new Error(`Frozen manifest already exists: ${target}`);
  writeJson(target, manifest);
  console.log(JSON.stringify({ manifest: fileRecord(target), author: fileRecord(author), outputs: manifest.outputs }, null, 2));
} else {
  throw new Error('Expected init, finalize PAGE, or freeze');
}

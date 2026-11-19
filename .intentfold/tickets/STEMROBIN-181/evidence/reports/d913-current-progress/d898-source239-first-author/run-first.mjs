import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
if (process.cwd() !== repo) throw new Error('The sole explicit workdir must be R.');
const root = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d898-source239-first-author');
const work = path.join(root, 'work');
const page = path.join(root, '10p/pages/0239');
const workPage = path.join(work, '10p/pages/0239');
const preparation = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d892-source239-first-preparation/work/10p/pages/0239');
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
const p2c = path.join(repo, '.claude/skills/ld-s10y-lesson/tools/p2c.py');
const phase = process.argv[2];

function owned(file) {
  if (!path.resolve(file).startsWith(`${root}/`)) throw new Error(`Outside write scope: ${file}`);
  return file;
}
function hash(file) {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
}
function writeJson(file, value) {
  fs.writeFileSync(owned(file), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
}
function snapshot(file, destination) {
  fs.copyFileSync(file, owned(destination), fs.constants.COPYFILE_EXCL);
  fs.chmodSync(owned(destination), 0o444);
  return hash(destination);
}
function filesUnder(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Unexpected symlink in owned outputs: ${file}`);
    return entry.isDirectory() ? filesUnder(file) : [file];
  }).sort();
}
function invoke(name, executable, args) {
  const receipt = path.join(root, 'receipts', `${name}.0001.json`);
  const started = path.join(root, 'receipts', `${name}.0001.started.json`);
  const stdout = path.join(root, 'receipts', `${name}.0001.stdout`);
  const stderr = path.join(root, 'receipts', `${name}.0001.stderr`);
  const tmp = path.join(root, 'runtime-tmp');
  fs.mkdirSync(owned(tmp), { recursive: true });
  const command = {
    attempt: 1, phase: name, cwd: repo, executable, argv: args,
    started_at: new Date().toISOString(), root, work,
    environment_overrides: { PYTHONDONTWRITEBYTECODE: '1', TMPDIR: tmp, TMP: tmp, TEMP: tmp },
  };
  writeJson(started, command);
  const result = spawnSync(executable, args, {
    cwd: repo,
    env: { ...process.env, ...command.environment_overrides },
    maxBuffer: 64 * 1024 * 1024,
  });
  fs.writeFileSync(owned(stdout), result.stdout ?? Buffer.alloc(0), { flag: 'wx' });
  fs.writeFileSync(owned(stderr), result.stderr ?? Buffer.alloc(0), { flag: 'wx' });
  const record = {
    ...command, finished_at: new Date().toISOString(),
    exit_code: result.status, signal: result.signal,
    execution_error: result.error ? String(result.error) : null,
    stdout: hash(stdout), stderr: hash(stderr),
    source_gate: 'HOLD', fullcard_gate: 'HOLD',
    retry_authorized: false,
  };
  return { result, record, receipt };
}
const nativeArgs = name => [
  p2c, name, '--book', '10p', '--page', '239', '--root', root, '--work', work,
];

if (phase === 'verify-copy') {
  const names = ['page.png', 'page.grid.png', 'page.template.md', 'layout.json', 'prepare.0001.stdout', 'prepare.0001.stderr'];
  const inputs = names.map(name => {
    const original = hash(path.join(preparation, name));
    const local = hash(path.join(workPage, name));
    fs.accessSync(local.path, fs.constants.W_OK);
    if (original.sha256 !== local.sha256 || original.bytes !== local.bytes) throw new Error(`Copy differs: ${name}`);
    return { original, local, byte_exact: true, local_writable: true };
  });
  const contracts = [
    '.claude/skills/ld-s10y-lesson/SKILL.md',
    '.claude/skills/ld-s10y-lesson/references/production-resume.md',
    '.agents/skills/ld-s10y-image/SKILL.md',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py',
    '.claude/skills/ld-s10y-lesson/tools/blocks.py',
    '.claude/skills/ld-s10y-lesson/tools/layout.py',
    '.claude/skills/ld-s10y-lesson/tools/normalize.py',
    '.claude/skills/ld-s10y-lesson/tools/mathcheck.py',
    '.claude/skills/ld-s10y-lesson/tools/vectorize.py',
    '.claude/skills/ld-s10y-lesson/tools/svg_raster.js',
    '.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json',
  ].map(file => hash(path.join(repo, file)));
  writeJson(path.join(root, 'receipts/preparation-reuse.json'), {
    schema: 'd898/preparation-reuse@1', inputs, contracts,
    prepare_calls_this_author: 0, source_gate: 'HOLD', fullcard_gate: 'HOLD',
  });
  console.log(JSON.stringify({ verified_byte_exact_writable_copies: names.length, prepare_calls: 0 }));
} else if (phase === 'finalize') {
  for (const file of ['page.json', 'audit.json']) {
    if (fs.existsSync(path.join(page, file))) throw new Error('FIRST requires no prior candidate output.');
  }
  const author = snapshot(path.join(page, 'page.md'), path.join(root, 'first/author/page.md'));
  const inventory = snapshot(path.join(root, 'source-inventory.md'), path.join(root, 'first/author/source-inventory.md'));
  const execution = invoke('finalize', python, nativeArgs('finalize'));
  const outputs = ['page.md', 'page.json', 'audit.json'].flatMap(name =>
    fs.existsSync(path.join(page, name))
      ? [snapshot(path.join(page, name), path.join(root, 'first/finalize', name))]
      : []);
  const figures = path.join(workPage, 'figures');
  if (fs.existsSync(figures)) {
    for (const file of filesUnder(figures)) {
      outputs.push(snapshot(file, path.join(root, 'first/finalize', path.basename(file))));
    }
  }
  const audit = fs.existsSync(path.join(page, 'audit.json'))
    ? JSON.parse(fs.readFileSync(path.join(page, 'audit.json'), 'utf8')) : null;
  writeJson(execution.receipt, { ...execution.record, author, inventory, outputs, audit });
  console.log(JSON.stringify({ phase, exit_code: execution.result.status, audit, receipt: execution.receipt }));
  process.exitCode = execution.result.status === 0 ? 0 : 1;
} else if (phase === 'vectorize') {
  const prior = JSON.parse(fs.readFileSync(path.join(root, 'receipts/finalize.0001.json'), 'utf8'));
  if (prior.exit_code !== 0 || !prior.audit || prior.audit.errors.length) throw new Error('STOP: FIRST finalize failed.');
  const figures = filesUnder(path.join(workPage, 'figures')).filter(file => file.endsWith('.png'));
  if (figures.length !== 1 || path.basename(figures[0]) !== 'fig-208.png') throw new Error('Owned source inventory requires exactly fig-208.');
  const execution = invoke('vectorize', python, nativeArgs('vectorize'));
  const outputs = filesUnder(path.join(workPage, 'figures')).filter(file => file.endsWith('.svg'))
    .map(file => snapshot(file, path.join(root, 'first/vectorize', path.basename(file))));
  writeJson(execution.receipt, { ...execution.record, inputs: figures.map(hash), outputs });
  console.log(JSON.stringify({ phase, exit_code: execution.result.status, receipt: execution.receipt, outputs }));
  process.exitCode = execution.result.status === 0 ? 0 : 1;
} else if (phase === 'preview') {
  const prior = JSON.parse(fs.readFileSync(path.join(root, 'receipts/vectorize.0001.json'), 'utf8'));
  if (prior.exit_code !== 0) throw new Error('STOP: FIRST vectorize failed.');
  const svg = path.join(workPage, 'figures/fig-208.svg');
  const png = path.join(root, 'observations/fig-208-first-svg-raster.png');
  const execution = invoke('svg-preview', 'node', [
    path.join(repo, '.claude/skills/ld-s10y-lesson/tools/svg_raster.js'), svg, png,
  ]);
  writeJson(execution.receipt, { ...execution.record, input: hash(svg), output: fs.existsSync(png) ? hash(png) : null });
  console.log(JSON.stringify({ phase, exit_code: execution.result.status, receipt: execution.receipt, png }));
  process.exitCode = execution.result.status === 0 ? 0 : 1;
} else if (phase === 'freeze') {
  const usage = {
    schema: 'd898/first-local-usage@1',
    ticket: 'STEMROBIN-181', successor: 'successor181-3', source: 239,
    author_revisions: 1, content_repairs: 0, prepare_calls: 0,
    reused_existing_preparation: true,
    finalize_calls: fs.existsSync(path.join(root, 'receipts/finalize.0001.json')) ? 1 : 0,
    vectorize_calls: fs.existsSync(path.join(root, 'receipts/vectorize.0001.json')) ? 1 : 0,
    svg_preview_calls: fs.existsSync(path.join(root, 'receipts/svg-preview.0001.json')) ? 1 : 0,
    image_batch_count: 1, model_context_image_loads: Number(process.argv[3]),
    image_batch_limit: 8, context_image_limit: 24,
    image_loads: [
      'existing d892 SOURCE239 page.png',
      'observations/source239-top.png',
      'observations/source239-bottom.png',
      'observations/source239-middle.png',
      'observations/source239-figure-context.png (unusable; counted)',
      'work/10p/pages/0239/figures/fig-208.png',
      'observations/fig-208-first-svg-raster.png',
    ].slice(0, Number(process.argv[3])),
    paid_calls: 0, api_calls: 0, db_calls: 0, git_calls: 0,
    other_chat_calls: 0, publish_calls: 0, assemble_calls: 0,
    index_calls: 0, meter_calls: 0, canonical_writes: 0,
    pipeline_replays: 0, source_gate: 'HOLD', fullcard_gate: 'HOLD',
    approval: 'Independent approval pending. FIRST production is not acceptance.',
    token_usage: 'Not available; no value inferred.',
  };
  if (usage.model_context_image_loads > 8) throw new Error('Image batch limit exceeded.');
  writeJson(path.join(root, 'FIRST-usage.json'), usage);
  const files = filesUnder(root).map(hash);
  writeJson(path.join(root, 'FIRST-manifest.json'), {
    schema: 'd898/first-output-freeze@1', frozen_at: new Date().toISOString(),
    root, files, source_gate: 'HOLD', fullcard_gate: 'HOLD',
    manifest_self_hash: 'Reported externally; intentionally not self-referential.',
  });
  for (const file of filesUnder(root)) {
    if (file.startsWith(`${workPage}/`) && !file.includes('/figures/')) continue;
    fs.chmodSync(owned(file), 0o444);
  }
  console.log(JSON.stringify({
    manifest: hash(path.join(root, 'FIRST-manifest.json')),
    usage: hash(path.join(root, 'FIRST-usage.json')),
    candidate: hash(path.join(page, 'page.md')),
    page_json: hash(path.join(page, 'page.json')),
    audit: hash(path.join(page, 'audit.json')),
  }, null, 2));
} else {
  throw new Error('Expected verify-copy, finalize, vectorize, preview, or freeze.');
}

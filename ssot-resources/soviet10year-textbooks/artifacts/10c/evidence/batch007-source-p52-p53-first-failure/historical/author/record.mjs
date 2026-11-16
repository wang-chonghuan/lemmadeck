import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/a07e/lemmadeck';
const evidence = path.dirname(fileURLToPath(import.meta.url));
const python = path.join(root, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
const tool = path.join(root, '.claude/skills/ld-s10y-lesson/tools/p2c.py');
const pages = [52, 53];
const work = n => path.join(root, '.tmp/ld-s10y-lesson/10c/pages', String(n).padStart(4, '0'));
const durable = n => path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/10c/pages', String(n).padStart(4, '0'));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const now = () => new Date().toISOString();

function immutable(file, bytes) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, bytes, { flag: 'wx', mode: 0o444 });
}

function json(file, value) {
  immutable(file, Buffer.from(JSON.stringify(value, null, 2) + '\n'));
}

function inventory(file, rawRoot, entries) {
  if (!fs.existsSync(file)) {
    entries.push({ path: file, exists: false });
    return;
  }
  const stat = fs.statSync(file);
  if (stat.isDirectory()) {
    entries.push({ path: file, exists: true, type: 'directory' });
    for (const name of fs.readdirSync(file).sort()) inventory(path.join(file, name), rawRoot, entries);
    return;
  }
  const bytes = fs.readFileSync(file);
  const raw = path.join(rawRoot, path.relative(root, file));
  immutable(raw, bytes);
  entries.push({ path: file, exists: true, type: 'file', bytes: bytes.length, sha256: sha(bytes), mtime: stat.mtime.toISOString(), raw });
}

function snapshot(name) {
  const base = path.join(evidence, name);
  const entries = [];
  const targets = pages.flatMap(n => [work(n), durable(n)]);
  targets.push(
    tool,
    path.join(root, '.claude/skills/ld-s10y-lesson/tools/layout.py'),
    path.join(root, '.claude/skills/ld-s10y-lesson/tools/blocks.py'),
    path.join(root, '.claude/skills/ld-s10y-lesson/tools/normalize.py'),
    path.join(root, '.claude/skills/ld-s10y-lesson/tools/mathcheck.py'),
    path.join(root, '.claude/skills/ld-s10y-lesson/tools/katex_check.js'),
    path.join(root, '.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json'),
    path.join(root, 'ssot-resources/soviet10year-textbooks/sources/manifest.json'),
    path.join(root, 'ssot-resources/soviet10year-textbooks/toc/10c/zh.json')
  );
  const started = now();
  for (const target of targets) inventory(target, path.join(base, 'raw'), entries);
  const pdf = path.join(root, 'ssot-resources/soviet10year-textbooks/sources/soviet10years/10c 苏联十年制学校数学教材 代数和分析初步 十年级.pdf');
  const pdfBytes = fs.readFileSync(pdf);
  entries.push({ path: pdf, exists: true, type: 'file', bytes: pdfBytes.length, sha256: sha(pdfBytes), raw: null, note: 'Existing source PDF hashed only; no pixels outside the two prepared pages read.' });
  const result = { schema: 'source-page-author/snapshot@1', name, cwd: root, started, ended: now(), entries };
  json(path.join(base, 'snapshot.json'), result);
  return result;
}

function existingJson(file) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
}

function manifest() {
  const snapshots = fs.readdirSync(evidence).filter(name => fs.existsSync(path.join(evidence, name, 'snapshot.json'))).sort().map(name => existingJson(path.join(evidence, name, 'snapshot.json')));
  const invocations = fs.readdirSync(evidence).filter(name => /^finalize-\d{4}\.json$/.test(name)).sort().map(name => existingJson(path.join(evidence, name)));
  const ledger = fs.existsSync(path.join(evidence, 'image-ledger')) ? fs.readdirSync(path.join(evidence, 'image-ledger')).sort().map(name => existingJson(path.join(evidence, 'image-ledger', name))) : [];
  const current = [];
  for (const n of pages) {
    for (const dir of [work(n), durable(n)]) {
      const collect = file => {
        if (!fs.existsSync(file)) {
          current.push({ path: file, exists: false });
          return;
        }
        if (fs.statSync(file).isDirectory()) {
          for (const name of fs.readdirSync(file).sort()) collect(path.join(file, name));
          return;
        }
        const bytes = fs.readFileSync(file);
        current.push({ path: file, bytes: bytes.length, sha256: sha(bytes) });
      };
      collect(dir);
    }
  }
  const failure = invocations.find(item => item.exit_code !== 0 || item.signal !== null || item.spawn_error !== null);
  const result = {
    schema: 'source-page-author/full-manifest@1',
    created: now(),
    cwd: root,
    ticket: 'STEMROBIN-184',
    role: 'SOURCE PAGE AUTHOR ONLY',
    scope: { book: '10c', physical_pages: pages, unit_identity: 'ana10-c6-s3-n86', unit_right_boundary: 'SOURCE_UNKNOWN: unseen; not completed from TOC', prefigure_estimates_only: { 52: 16, 53: 22 } },
    parent_layout_sha256: '1fc40bd09c423c94c1497de995b43c98f497710c29c7fd753076414b9c96ed48',
    independent_review: 'NOT_PERFORMED; author evidence only; no independent PASS',
    stop_on_first_actual_finalize_failure: true,
    first_actual_finalize_failure: failure ?? null,
    snapshots,
    invocations,
    image_ledger: ledger,
    image_count: ledger.length,
    image_budget: { batch_max: 8, context_max: 24, requested_originals: 2, crop_views_max: 6 },
    current_files: current,
    recorder: { path: fileURLToPath(import.meta.url), sha256: sha(fs.readFileSync(fileURLToPath(import.meta.url))) }
  };
  json(path.join(evidence, 'full-manifest.json'), result);
  console.log(JSON.stringify({ manifest: path.join(evidence, 'full-manifest.json'), image_count: ledger.length, invocations: invocations.map(x => ({ page: x.page, exit_code: x.exit_code })), current_files: current }, null, 2));
}

const [action, ...args] = process.argv.slice(2);
if (action === 'snapshot') {
  const result = snapshot(args[0]);
  console.log(JSON.stringify({ name: result.name, entries: result.entries.map(x => ({ path: x.path, exists: x.exists, sha256: x.sha256, bytes: x.bytes })) }, null, 2));
} else if (action === 'view') {
  const [index, input, kind, page, box] = args;
  const ledgerDir = path.join(evidence, 'image-ledger');
  const count = fs.existsSync(ledgerDir) ? fs.readdirSync(ledgerDir).length : 0;
  if (count >= 8) throw new Error('Image batch limit reached; no further view permitted.');
  const bytes = fs.readFileSync(input);
  json(path.join(ledgerDir, `${String(index).padStart(2, '0')}.json`), { index: Number(index), recorded_at: now(), path: input, kind, physical_page: Number(page), source_box: box ? JSON.parse(box) : null, sha256: sha(bytes), bytes: bytes.length, requested_detail: 'original', outcome: 'loaded once by functions.view_image; no reopening' });
} else if (action === 'crop') {
  const [page, name, box] = args;
  const source = path.join(work(Number(page)), 'page.png');
  const output = path.join(evidence, 'cropviews', `${page}-${name}.png`);
  if (fs.existsSync(output)) throw new Error('Crop already exists; do not overwrite.');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const code = 'from PIL import Image; import json,sys; b=json.loads(sys.argv[3]); Image.open(sys.argv[1]).crop((b[0],b[1],b[0]+b[2],b[1]+b[3])).save(sys.argv[2])';
  const started = now();
  const command = [python, '-c', code, source, output, box];
  const run = spawnSync(command[0], command.slice(1), { cwd: root, encoding: null });
  immutable(path.join(evidence, 'cropviews', `${page}-${name}.stdout.bin`), run.stdout ?? Buffer.alloc(0));
  immutable(path.join(evidence, 'cropviews', `${page}-${name}.stderr.bin`), run.stderr ?? Buffer.alloc(0));
  json(path.join(evidence, 'cropviews', `${page}-${name}.json`), { argv: command, cwd: root, started, ended: now(), exit_code: run.status, signal: run.signal, error: run.error ? String(run.error) : null, source, source_sha256: sha(fs.readFileSync(source)), box: JSON.parse(box), output, sha256: fs.existsSync(output) ? sha(fs.readFileSync(output)) : null });
  if (fs.existsSync(output)) fs.chmodSync(output, 0o444);
  console.log(output);
  process.exitCode = run.status ?? 1;
} else if (action === 'finalize') {
  for (const page of pages) {
    const record = path.join(evidence, `finalize-${String(page).padStart(4, '0')}.json`);
    if (fs.existsSync(record)) throw new Error('First finalize already recorded; no retries allowed.');
    snapshot(`before-finalize-${String(page).padStart(4, '0')}`);
    const argv = [python, tool, 'finalize', '--book', '10c', '--page', String(page)];
    const started = now();
    const run = spawnSync(argv[0], argv.slice(1), { cwd: root, encoding: null });
    const ended = now();
    const stdout = run.stdout ?? Buffer.alloc(0);
    const stderr = run.stderr ?? Buffer.alloc(0);
    const stdoutPath = path.join(evidence, `finalize-${String(page).padStart(4, '0')}.stdout.bin`);
    const stderrPath = path.join(evidence, `finalize-${String(page).padStart(4, '0')}.stderr.bin`);
    immutable(stdoutPath, stdout);
    immutable(stderrPath, stderr);
    snapshot(`after-finalize-${String(page).padStart(4, '0')}`);
    json(record, { schema: 'source-page-author/official-invocation@1', page, invocation: 'first and only official finalize', cwd: root, argv, started, ended, exit_code: run.status, signal: run.signal, spawn_error: run.error ? String(run.error) : null, stdout: { path: stdoutPath, bytes: stdout.length, sha256: sha(stdout), text: stdout.toString('utf8') }, stderr: { path: stderrPath, bytes: stderr.length, sha256: sha(stderr), text: stderr.toString('utf8') } });
    console.log(stdout.toString('utf8'));
    console.error(stderr.toString('utf8'));
    if (run.status !== 0 || run.signal || run.error) {
      console.log(`STOP: first actual finalize failure on physical page ${page}; later page not invoked, no corrections or retries.`);
      process.exitCode = run.status ?? 1;
      break;
    }
  }
} else if (action === 'manifest') {
  manifest();
} else {
  throw new Error('Use snapshot, view, crop, finalize, or manifest.');
}

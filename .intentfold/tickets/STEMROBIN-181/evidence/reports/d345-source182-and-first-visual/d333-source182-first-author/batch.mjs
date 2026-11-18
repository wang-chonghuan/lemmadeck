import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const base = path.dirname(fileURLToPath(import.meta.url));
const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const preparation = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d332-source182-preparation');
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const record = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size });
const json = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const save = (p, value) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  if (hash(from) !== hash(to)) throw new Error(`Copy mismatch: ${from}`);
  return { source: record(from), copy: record(to), byteIdentical: true };
};
const page = path.join(base, 'source/10p/pages/0182');
const work = path.join(base, 'work/10p/pages/0182');
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
const native = path.join(repo, '.claude/skills/ld-s10y-lesson/tools/p2c.py');

if (process.argv[2] === 'initialize') {
  const manifest = path.join(preparation, 'manifest.json');
  if (hash(manifest) !== '53fd286a9ccdd63c2b08f401804d6dc6b2f1a90ed5c03c4662f571722e2dad63') {
    throw new Error('Frozen preparation manifest hash mismatch');
  }
  const copies = [
    copy(manifest, path.join(base, 'inputs/preparation-manifest.json')),
    copy(path.join(preparation, 'prepare-182.receipt.json'), path.join(base, 'inputs/prepare-182.receipt.json')),
  ];
  for (const input of json(manifest).inputs) {
    const from = path.join(repo, input.path);
    if (hash(from) !== input.sha256) throw new Error(`Input hash mismatch: ${from}`);
    const name = path.basename(from);
    copies.push(copy(from, path.join(work, name)));
    copies.push(copy(from, path.join(page, name)));
  }
  fs.mkdirSync(path.join(base, 'native-tmp'), { recursive: true });
  save(path.join(base, 'inputs/receipt.json'), {
    ticket: 'STEMROBIN-181', page: 182, preparedAgain: false,
    recordedUtc: new Date().toISOString(), copies,
    previousPageAccess: 'Only previousObject text in preparation-manifest.json; no prior page opened',
  });
  console.log(JSON.stringify({ initialized: base, copiedFiles: copies.length, nativeInvocations: 0 }));
} else if (['finalize', 'vectorize'].includes(process.argv[2])) {
  const operation = process.argv[2];
  const receipt = path.join(base, `native/${operation}-182.receipt.json`);
  if (fs.existsSync(receipt)) throw new Error(`${operation} already invoked; no second invocation permitted`);
  if (operation === 'vectorize' && json(path.join(base, 'native/finalize-182.receipt.json')).exitCode !== 0) {
    throw new Error('Cannot vectorize an unfinalized page');
  }
  const command = [
    python, '-B', native, operation, '--book', '10p', '--page', '182',
    '--root', path.join(base, 'source'), '--work', path.join(base, 'work'),
  ];
  const inputs = [path.join(page, 'page.md'), path.join(work, 'page.png'), native].map(record);
  if (operation === 'finalize') {
    for (const [from, name] of [
      [path.join(page, 'page.md'), 'page.md'],
      [path.join(base, 'row-figure-inventory.json'), 'row-figure-inventory.json'],
      [path.join(base, 'actual-opens.json'), 'actual-opens.json'],
    ]) copy(from, path.join(base, 'author-initial', name));
  }
  if (operation === 'vectorize') {
    inputs.push(record(path.join(work, 'figures/fig-139.png')));
    inputs.push(record(path.join(repo, '.claude/skills/ld-s10y-lesson/tools/vectorize.py')));
  }
  const startedUtc = new Date().toISOString();
  const result = spawnSync(command[0], command.slice(1), {
    cwd: repo, encoding: 'utf8',
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: path.join(base, 'native-tmp') },
  });
  const outputs = [];
  for (const p of ['page.md', 'page.json', 'audit.json'].map(n => path.join(page, n))) {
    if (fs.existsSync(p)) outputs.push(record(p));
  }
  const figureDir = path.join(work, 'figures');
  if (fs.existsSync(figureDir)) {
    for (const name of fs.readdirSync(figureDir)) outputs.push(record(path.join(figureDir, name)));
  }
  save(receipt, {
    command, cwd: repo, temporaryRoot: path.join(base, 'native-tmp'),
    startedUtc, finishedUtc: new Date().toISOString(), invocationCount: 1,
    exitCode: result.status, signal: result.signal,
    stdout: result.stdout ?? '', stderr: result.stderr ?? '',
    error: result.error?.message ?? null, inputs, outputs,
  });
  const snapshot = path.join(base, `native/${operation}-${result.status === 0 ? 'PASS' : 'FAIL'}-initial`);
  for (const output of outputs) copy(output.path, path.join(snapshot, path.relative(base, output.path)));
  console.log(result.stdout);
  if (result.stderr) console.error(result.stderr);
  console.log(JSON.stringify(record(receipt)));
  process.exitCode = result.status ?? 1;
} else if (process.argv[2] === 'svg-detail') {
  const svg = path.join(work, 'figures/fig-139.svg');
  const output = path.join(base, 'details/fig-139.svg-render.png');
  const receipt = path.join(base, 'native/svg-detail-139.receipt.json');
  if (fs.existsSync(output) || fs.existsSync(receipt)) throw new Error('SVG detail already rendered');
  const command = [
    'node', path.join(repo, '.claude/skills/ld-s10y-lesson/tools/svg_raster.js'), svg, output,
  ];
  const startedUtc = new Date().toISOString();
  const result = spawnSync(command[0], command.slice(1), {
    cwd: repo, encoding: 'utf8',
    env: { ...process.env, TMPDIR: path.join(base, 'native-tmp') },
  });
  save(receipt, {
    command, cwd: repo, purpose: 'One RAW139 SVG raster detail, not a screenshot or lesson render',
    rootWorkFlags: 'Not supported by svg_raster.js; all SVG input and PNG output paths are inside this batch',
    startedUtc, finishedUtc: new Date().toISOString(), invocationCount: 1,
    exitCode: result.status, stdout: result.stdout ?? '', stderr: result.stderr ?? '',
    inputs: [record(svg), record(command[1])],
    outputs: fs.existsSync(output) ? [record(output)] : [],
  });
  console.log(JSON.stringify(record(receipt)));
  process.exitCode = result.status ?? 1;
} else {
  throw new Error('Expected initialize, finalize, vectorize or svg-detail');
}

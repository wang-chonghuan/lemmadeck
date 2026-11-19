import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const D = path.join(R, '.intentfold/tickets/STEMROBIN-181/tmp/d834-source234-first-author');
const skill = '.claude/skills/ld-s10y-lesson';
const tools = [
  'tools/p2c.py', 'tools/layout.py', 'tools/blocks.py', 'tools/normalize.py',
  'tools/mathcheck.py', 'tools/katex_check.js', 'tools/vectorize.py',
  'tools/svg_raster.js', 'profiles/soviet-cn.json',
].map(file => path.join(R, skill, file));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const fileHash = file => hash(fs.readFileSync(file));
const toolHashes = () => Object.fromEntries(tools.map(file => [file, fileHash(file)]));
const page = path.join(D, 'root/10p/pages/0234');
const workPage = path.join(D, 'work/10p/pages/0234');

function writeOnce(file, value) {
  if (!file.startsWith(D + path.sep)) throw new Error('Write escaped authorized scratch');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, typeof value === 'string' || Buffer.isBuffer(value)
    ? value : JSON.stringify(value, null, 2) + '\n', { flag: 'wx', mode: 0o444 });
}

function snapshot(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Unexpected symlink: ${file}`);
    return entry.isDirectory() ? snapshot(file)
      : [{ path: file, bytes: fs.statSync(file).size, sha256: fileHash(file) }];
  });
}

if (process.cwd() !== R) throw new Error('Incorrect explicit cwd');
const stage = process.argv[2];
if (stage === 'init') {
  const preparation = path.join(R,
    '.intentfold/tickets/STEMROBIN-181/tmp/d833-source234-first-preparation/work/10p/pages/0234');
  const files = ['page.png', 'page.grid.png', 'layout.json', 'page.template.md'];
  writeOnce(path.join(D, 'inputs.json'), files.map(name => {
    const source = path.join(preparation, name);
    const copy = path.join(workPage, name);
    if (fileHash(source) !== fileHash(copy)) throw new Error(`Copy mismatch: ${name}`);
    return { source, copy, sha256: fileHash(source), bytes: fs.statSync(source).size };
  }));
  writeOnce(path.join(D, 'tool-hashes.before.json'), toolHashes());
  writeOnce(path.join(D, 'author-first/page.md'), fs.readFileSync(path.join(page, 'page.md')));
  console.log('Reused preparation verified; original author input and current tool hashes frozen.');
} else if (stage === 'finalize' || stage === 'vectorize') {
  const first = path.join(D, 'FIRST', stage);
  if (fs.existsSync(first)) throw new Error(`FIRST ${stage} already exists; no repeat authorized`);
  if (stage === 'vectorize') {
    const prior = JSON.parse(fs.readFileSync(path.join(D, 'FIRST/finalize/receipt.json'), 'utf8'));
    const audit = JSON.parse(fs.readFileSync(path.join(page, 'audit.json'), 'utf8'));
    if (prior.exit !== 0 || audit.errors.length) throw new Error('Finalize failed; dependent stage stopped');
    const figures = fs.readdirSync(path.join(workPage, 'figures')).filter(file => file.endsWith('.png'));
    if (figures.length !== 1 || figures[0] !== 'fig-204.png') {
      throw new Error('Expected exactly the actual local figure 204');
    }
  }
  const command = [
    path.join(R, skill, '.venv/bin/python'), '-B',
    path.join(R, skill, 'tools/p2c.py'), stage, '--book', '10p', '--page', '234',
    '--root', path.join(D, 'root'), '--work', path.join(D, 'work'),
  ];
  const startedAt = new Date().toISOString();
  const before = toolHashes();
  writeOnce(path.join(first, 'started.json'), { command, cwd: R, startedAt, toolHashes: before });
  const result = spawnSync(command[0], command.slice(1), {
    cwd: R, encoding: 'buffer', maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: path.join(D, 'runtime-tmp') },
  });
  const stdout = result.stdout ?? Buffer.alloc(0);
  const stderr = result.stderr ?? Buffer.alloc(0);
  writeOnce(path.join(first, 'stdout.txt'), stdout);
  writeOnce(path.join(first, 'stderr.txt'), stderr);
  writeOnce(path.join(first, 'receipt.json'), {
    command, cwd: R, startedAt, finishedAt: new Date().toISOString(),
    exit: result.status, signal: result.signal, error: result.error?.message ?? null,
    stdoutSha256: hash(stdout), stderrSha256: hash(stderr),
    toolHashesBefore: before, toolHashesAfter: toolHashes(),
    outputs: [...snapshot(path.join(D, 'root')), ...snapshot(path.join(D, 'work'))],
  });
  process.stdout.write(stdout);
  process.stderr.write(stderr);
  process.exitCode = result.status ?? 2;
} else if (stage === 'freeze') {
  const after = toolHashes();
  const before = JSON.parse(fs.readFileSync(path.join(D, 'tool-hashes.before.json'), 'utf8'));
  writeOnce(path.join(D, 'tool-hashes.after.json'), after);
  writeOnce(path.join(D, 'freeze.json'), {
    frozenAt: new Date().toISOString(), cwd: R, root: D,
    toolsUnchanged: JSON.stringify(before) === JSON.stringify(after),
    files: snapshot(D),
    status: 'FROZEN; author-only candidate; independent approval not granted',
  });
  function lock(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) lock(file);
      else fs.chmodSync(file, 0o444);
    }
    fs.chmodSync(directory, 0o555);
  }
  lock(D);
  console.log(JSON.stringify({
    freeze: path.join(D, 'freeze.json'), sha256: fileHash(path.join(D, 'freeze.json')),
    toolsUnchanged: JSON.stringify(before) === JSON.stringify(after),
  }, null, 2));
} else {
  throw new Error('Expected init, finalize, vectorize, or freeze');
}

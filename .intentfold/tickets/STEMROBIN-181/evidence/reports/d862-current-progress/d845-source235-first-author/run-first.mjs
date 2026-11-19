import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const D = path.join(R, '.intentfold/tickets/STEMROBIN-181/tmp/d845-source235-first-author');
const preparation = path.join(R,
  '.intentfold/tickets/STEMROBIN-181/tmp/d843-source235-first-preparation');
const skill = path.join(R, '.claude/skills/ld-s10y-lesson');
const page = path.join(D, 'root/10p/pages/0235');
const work = path.join(D, 'work/10p/pages/0235');
const tools = [
  'tools/p2c.py', 'tools/layout.py', 'tools/blocks.py', 'tools/normalize.py',
  'tools/mathcheck.py', 'tools/katex_check.js', 'tools/vectorize.py',
  'tools/svg_raster.js', 'profiles/soviet-cn.json',
].map(file => path.join(skill, file));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const fileHash = file => hash(fs.readFileSync(file));
const toolHashes = () => Object.fromEntries(tools.map(file => [file, fileHash(file)]));

function writeOnce(file, value) {
  if (!file.startsWith(D + path.sep)) throw new Error('Write escaped authorized directory');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, typeof value === 'string' || Buffer.isBuffer(value)
    ? value : JSON.stringify(value, null, 2) + '\n', { flag: 'wx', mode: 0o444 });
}

function snapshot(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name)).flatMap(entry => {
    const file = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Unexpected symlink: ${file}`);
    return entry.isDirectory() ? snapshot(file)
      : [{ path: file, bytes: fs.statSync(file).size, sha256: fileHash(file) }];
  });
}

if (process.cwd() !== R || fs.realpathSync(R) !== R) throw new Error('Incorrect explicit cwd');
if (fs.realpathSync(D) !== D) throw new Error('Unexpected output symlink');
const stage = process.argv[2];

if (stage === 'init') {
  const prior = JSON.parse(fs.readFileSync(path.join(preparation, 'FIRST/receipt.json'), 'utf8'));
  if (prior.exit !== 0) throw new Error('Existing preparation did not succeed');
  for (const stream of ['stdout', 'stderr']) {
    if (fileHash(path.join(preparation, `FIRST/${stream}.txt`)) !== prior[`${stream}Sha256`]) {
      throw new Error(`Preparation ${stream} receipt hash mismatch`);
    }
  }
  const files = ['page.png', 'page.grid.png', 'layout.json', 'page.template.md'];
  const copied = files.map(name => {
    const source = path.join(preparation, 'work/10p/pages/0235', name);
    const copy = path.join(work, name);
    fs.mkdirSync(path.dirname(copy), { recursive: true });
    fs.copyFileSync(source, copy, fs.constants.COPYFILE_EXCL);
    if (fileHash(source) !== fileHash(copy)) throw new Error(`Copy mismatch: ${name}`);
    return { source, copy, sha256: fileHash(source), bytes: fs.statSync(source).size };
  });
  fs.mkdirSync(path.join(D, 'runtime-tmp'), { recursive: true });
  fs.mkdirSync(page, { recursive: true });
  writeOnce(path.join(D, 'inputs.json'), {
    preparationReceipt: { path: path.join(preparation, 'FIRST/receipt.json'),
      sha256: fileHash(path.join(preparation, 'FIRST/receipt.json')), exit: prior.exit },
    files: copied,
    ruleFiles: [
      '.intentfold/readme.md', '.intentfold/project.json',
      '.intentfold/charter/engineering.md', '.intentfold/charter/operations.md',
      '.claude/skills/ld-s10y-lesson/SKILL.md',
      '.claude/skills/ld-s10y-lesson/references/production-resume.md',
      '.agents/skills/ld-s10y-image/SKILL.md',
    ].map(file => ({ path: path.join(R, file), sha256: fileHash(path.join(R, file)) })),
    userBoundary: {
      prior234ClosedSuffix: '即直线传播.',
      incomingOpenObjects: 0, prior234Approval: 'pending; not changed',
      source236Read: false, previousPageImagesRead: false,
    },
    ownership: 'Shared checkout may have other writers; this invocation owns only D.',
  });
  writeOnce(path.join(D, 'tool-hashes.before.json'), toolHashes());
  console.log(JSON.stringify({ copied, prepareCalls: 0 }, null, 2));
} else if (stage === 'capture') {
  writeOnce(path.join(D, 'author-first/page.md'), fs.readFileSync(path.join(page, 'page.md')));
  writeOnce(path.join(D, 'actual-opens.json'), {
    schema: 'local-image-observations@1',
    batch: 1, imagesLoaded: 2, batchLimit: 8, contextLimit: 24,
    opens: [
      { sequence: 1, path: path.join(preparation, 'work/10p/pages/0235/page.png'),
        sha256: fileHash(path.join(work, 'page.png')), purpose: 'original SOURCE235 first' },
      { sequence: 2, path: path.join(preparation, 'work/10p/pages/0235/page.grid.png'),
        sha256: fileHash(path.join(work, 'page.grid.png')), purpose: 'coarse figure geometry' },
    ],
    previousPageImageLoads: 0, source236ImageLoads: 0,
  });
  console.log('Original author input and actual original-first image opens preserved.');
} else if (stage === 'finalize' || stage === 'vectorize') {
  const first = path.join(D, 'FIRST', stage);
  if (fs.existsSync(first)) throw new Error(`FIRST ${stage} exists; no repeat authorized`);
  if (!fs.existsSync(path.join(D, 'author-first/page.md'))) throw new Error('Capture FIRST input first');
  if (stage === 'vectorize') {
    const prior = JSON.parse(fs.readFileSync(path.join(D, 'FIRST/finalize/receipt.json'), 'utf8'));
    const audit = JSON.parse(fs.readFileSync(path.join(page, 'audit.json'), 'utf8'));
    if (prior.exit !== 0 || audit.errors.length) throw new Error('Finalize failed; stop dependencies');
    const pngs = fs.readdirSync(path.join(work, 'figures')).filter(file => file.endsWith('.png'));
    if (pngs.length !== 1 || pngs[0] !== 'fig-205.png') throw new Error('Unexpected local figures');
  }
  const command = [
    path.join(skill, '.venv/bin/python'), '-B', path.join(skill, 'tools/p2c.py'),
    stage, '--book', '10p', '--page', '235',
    '--root', path.join(D, 'root'), '--work', path.join(D, 'work'),
    '--books', path.join(R, 'ssot-resources/soviet10year-textbooks/sources'),
  ];
  const before = toolHashes();
  const baseline = JSON.parse(fs.readFileSync(path.join(D, 'tool-hashes.before.json'), 'utf8'));
  if (JSON.stringify(before) !== JSON.stringify(baseline)) throw new Error('Tools changed before FIRST');
  const startedAt = new Date().toISOString();
  const environment = {
    PYTHONDONTWRITEBYTECODE: '1', TMPDIR: path.join(D, 'runtime-tmp'),
    TMP: path.join(D, 'runtime-tmp'), TEMP: path.join(D, 'runtime-tmp'),
  };
  writeOnce(path.join(first, 'started.json'), {
    command, cwd: R, startedAt, toolHashes: before, environment,
    runnerSha256: fileHash(path.join(D, 'run-first.mjs')),
    executableSha256: fileHash(command[0]), executableRealPath: fs.realpathSync(command[0]),
  });
  const result = spawnSync(command[0], command.slice(1), {
    cwd: R, encoding: 'buffer', maxBuffer: 32 * 1024 * 1024,
    env: { ...process.env, ...environment },
  });
  const stdout = result.stdout ?? Buffer.alloc(0);
  const stderr = result.stderr ?? Buffer.alloc(0);
  writeOnce(path.join(first, 'stdout.txt'), stdout);
  writeOnce(path.join(first, 'stderr.txt'), stderr);
  writeOnce(path.join(first, 'receipt.json'), {
    command, cwd: R, startedAt, finishedAt: new Date().toISOString(),
    exit: result.status, signal: result.signal, error: result.error?.message ?? null,
    stdoutSha256: hash(stdout), stderrSha256: hash(stderr),
    toolHashesBefore: before, toolHashesAfter: toolHashes(), environment,
    runnerSha256: fileHash(path.join(D, 'run-first.mjs')),
    executableSha256: fileHash(command[0]),
    outputs: [...snapshot(path.join(D, 'root')), ...snapshot(path.join(D, 'work'))],
  });
  process.stdout.write(stdout);
  process.stderr.write(stderr);
  process.exitCode = result.status ?? 2;
} else if (stage === 'freeze') {
  const after = toolHashes();
  const before = JSON.parse(fs.readFileSync(path.join(D, 'tool-hashes.before.json'), 'utf8'));
  const usage = JSON.parse(fs.readFileSync(path.join(D, 'usage.json'), 'utf8'));
  writeOnce(path.join(D, 'tool-hashes.after.json'), after);
  writeOnce(path.join(D, 'freeze.json'), {
    frozenAt: new Date().toISOString(), cwd: R, root: D,
    toolsUnchanged: JSON.stringify(before) === JSON.stringify(after),
    files: snapshot(D), usage,
    status: 'FROZEN FIRST author candidate only; independent approval not granted',
  });
  function lock(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) throw new Error(`Unexpected symlink: ${file}`);
      if (entry.isDirectory()) lock(file);
      else fs.chmodSync(file, 0o444);
    }
    fs.chmodSync(directory, 0o555);
  }
  lock(D);
  console.log(JSON.stringify({
    freeze: path.join(D, 'freeze.json'), sha256: fileHash(path.join(D, 'freeze.json')),
    toolsUnchanged: JSON.stringify(before) === JSON.stringify(after),
    files: snapshot(D),
  }, null, 2));
} else {
  throw new Error('Expected init, capture, finalize, vectorize, or freeze');
}

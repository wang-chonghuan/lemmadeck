import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const root = '/Users/yong/.codex/worktrees/a07e/lemmadeck';
const tmp = path.join(root, '.intentfold/tickets/STEMROBIN-184/tmp');
const evidence = path.join(tmp, 'source-6g-p72-p73-author-evidence');
const skill = path.join(root, '.claude/skills/ld-s10y-lesson');
const durable = n => path.join(root, `ssot-resources/soviet10year-textbooks/artifacts/6-8g/pages/${n}`);
const work = n => path.join(root, `.tmp/ld-s10y-lesson/6-8g/pages/${n}`);
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const writeJson = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};

function binding(file, copy) {
  if (!fs.existsSync(file) && !fs.lstatSync(path.dirname(file)).isSymbolicLink()) {
    try { fs.lstatSync(file); } catch (error) {
      if (error.code === 'ENOENT') return { path: file, state: 'absent' };
      throw error;
    }
  }
  const s = fs.lstatSync(file);
  const entry = {
    path: file, state: 'present', mode: s.mode, uid: s.uid, gid: s.gid,
    size: s.size, dev: s.dev, ino: s.ino, nlink: s.nlink,
    atimeMs: s.atimeMs, mtimeMs: s.mtimeMs, ctimeMs: s.ctimeMs, birthtimeMs: s.birthtimeMs,
    type: s.isSymbolicLink() ? 'symlink' : s.isDirectory() ? 'directory' : 'file',
  };
  if (s.isSymbolicLink()) {
    entry.linkTarget = fs.readlinkSync(file);
    entry.realpath = fs.realpathSync(file);
    entry.resolvedSha256 = hash(fs.readFileSync(entry.realpath));
  } else if (s.isFile()) {
    const bytes = fs.readFileSync(file);
    entry.sha256 = hash(bytes);
    if (copy) {
      fs.mkdirSync(path.dirname(copy), { recursive: true });
      fs.copyFileSync(file, copy, fs.constants.COPYFILE_EXCL);
      entry.bytecopy = copy;
    }
  } else if (s.isDirectory()) {
    entry.children = fs.readdirSync(file).sort().map(name =>
      binding(path.join(file, name), copy ? path.join(copy, name) : undefined));
  }
  return entry;
}

function snapshot(name) {
  const dest = path.join(evidence, name);
  fs.mkdirSync(dest, { recursive: true });
  const targets = ['0072', '0073'].map(n => ({
    page: n,
    durable: binding(durable(n), path.join(dest, 'durable', n)),
    workFigures: binding(path.join(work(n), 'figures'), path.join(dest, 'work-figures', n)),
  }));
  const record = { capturedAt: new Date().toISOString(), targets };
  writeJson(path.join(dest, 'metadata.json'), record);
  return record;
}

function tools() {
  return [
    root, skill, path.join(skill, 'tools'),
    path.join(skill, '.venv/bin/python'), process.execPath,
    ...['p2c.py', 'blocks.py', 'layout.py', 'normalize.py', 'mathcheck.py', 'katex_check.js']
      .map(name => path.join(skill, 'tools', name)),
    path.join(skill, 'profiles/soviet-cn.json'),
    path.join(skill, 'node_modules/katex/package.json'),
  ].map(file => {
    if ([root, skill, path.join(skill, 'tools')].includes(file)) {
      const s = fs.lstatSync(file);
      return { path: file, realpath: fs.realpathSync(file), type: 'directory',
        mode: s.mode, uid: s.uid, gid: s.gid, dev: s.dev, ino: s.ino,
        mtimeMs: s.mtimeMs, ctimeMs: s.ctimeMs };
    }
    return binding(file);
  });
}

const mode = process.argv[2];
if (mode === 'initial') {
  fs.mkdirSync(evidence, { recursive: false });
  const before = snapshot('targetbefore');
  const inputs = ['0072', '0073'].map(n => ({
    page: n,
    files: ['page.png', 'page.grid.png', 'layout.json', 'page.template.md'].map(name =>
      binding(path.join(work(n), name), path.join(evidence, 'source-bytecopies', n, name))),
  }));
  const toc = binding(path.join(root, 'ssot-resources/soviet10year-textbooks/toc/6-8g/zh.json'),
    path.join(evidence, 'source-bytecopies', 'toc-6-8g-zh.json'));
  writeJson(path.join(evidence, 'initial-bindings.json'), {
    recordedAt: new Date().toISOString(), cwd: process.cwd(), root,
    script: binding(new URL(import.meta.url).pathname), before, inputs, toc, tools: tools(),
    derivedRoots: { p2cRepo: root, p2cSkill: skill, p2cTools: path.join(skill, 'tools'),
      artifactRoot: path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts'),
      workRoot: path.join(root, '.tmp/ld-s10y-lesson') },
    limits: { pages: [72, 73], imageBatch: 8, imageContext: 24, prepareAttempts: 0,
      finalizeAttemptsPerPageMax: 1, reruns: 0, repairs: 0 },
    prepare: { observedInThisInvocation: false, userSupplied: 'prepare72/73 already ran once0; DO NOT reprepare' },
  });
  console.log(path.join(evidence, 'initial-bindings.json'));
} else if (mode === 'finalize') {
  const n = process.argv[3];
  if (!['0072', '0073'].includes(n)) throw new Error('Page outside authorized batch');
  if (fs.existsSync(path.join(evidence, 'firstfailure.json'))) throw new Error('First failure already retained; no further pipeline invocation');
  const commandDir = path.join(evidence, `finalize-${n}-first`);
  fs.mkdirSync(commandDir, { recursive: false });
  snapshot(`before-finalize-${n}`);
  const executable = path.join(skill, '.venv/bin/python');
  const args = ['-B', path.join(skill, 'tools/p2c.py'), 'finalize', '--book', '6-8g', '--page', String(Number(n))];
  const start = { status: 'started', startedAt: new Date().toISOString(), executable, args,
    cwd: root, shell: false, attempt: 1, tools: tools(), timeoutMs: 120000,
    stdout: path.join(commandDir, 'stdout.bin'), stderr: path.join(commandDir, 'stderr.bin'),
    before: path.join(evidence, `before-finalize-${n}/metadata.json`) };
  writeJson(path.join(commandDir, 'start.json'), start);
  writeJson(path.join(commandDir, 'result-before-call.json'), { status: 'pending', exit: null });
  const stdout = fs.openSync(start.stdout, 'wx');
  const stderr = fs.openSync(start.stderr, 'wx');
  const began = process.hrtime.bigint();
  const result = spawnSync(executable, args, {
    cwd: root, stdio: ['ignore', stdout, stderr], timeout: start.timeoutMs,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  fs.closeSync(stdout);
  fs.closeSync(stderr);
  const elapsedMs = Number(process.hrtime.bigint() - began) / 1e6;
  snapshot(`after-finalize-${n}`);
  const end = { status: result.status === 0 && !result.error ? 'success' : 'failure',
    endedAt: new Date().toISOString(), elapsedMs, exit: result.status,
    signal: result.signal, error: result.error ? String(result.error) : null,
    stdout: binding(start.stdout), stderr: binding(start.stderr),
    after: path.join(evidence, `after-finalize-${n}/metadata.json`), tools: tools() };
  writeJson(path.join(commandDir, 'result.json'), end);
  if (end.status === 'failure') writeJson(path.join(evidence, 'firstfailure.json'), { page: n, ...start, result: end });
  console.log(JSON.stringify(end, null, 2));
  console.log(fs.readFileSync(start.stdout, 'utf8'));
  console.error(fs.readFileSync(start.stderr, 'utf8'));
  process.exitCode = end.status === 'success' ? 0 : 1;
} else if (mode === 'end') {
  snapshot('targetafter');
  writeJson(path.join(evidence, 'end-bindings.json'), {
    recordedAt: new Date().toISOString(), tools: tools(),
    inputs: ['0072', '0073'].map(n => ({ page: n,
      files: ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']
        .map(name => binding(path.join(work(n), name))) })),
  });
} else {
  throw new Error('Expected initial, finalize, or end');
}

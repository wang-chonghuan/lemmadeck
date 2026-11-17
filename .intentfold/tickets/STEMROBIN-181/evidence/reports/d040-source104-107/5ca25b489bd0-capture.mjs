import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const cwd = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
assert.equal(process.cwd(), cwd);
const out = path.dirname(import.meta.filename);
const pages = [104, 105, 106, 107];
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
const tools = '.claude/skills/ld-s10y-lesson/tools';
const work = '.tmp/ld-s10y-lesson';
const stem = page => String(page).padStart(4, '0');
const prepared = page => `${work}/10p/pages/${stem(page)}`;
const candidate = page => path.join(out, 'candidate', '10p', 'pages', stem(page), 'page.md');
const relative = file => path.relative(cwd, path.resolve(file));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: relative(file), sha256: sha(bytes), bytes: bytes.length };
};
const write = (file, bytes) => {
  assert(path.resolve(file).startsWith(`${out}${path.sep}`));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, bytes, { flag: 'wx' });
};
const json = (file, value) => write(file, `${JSON.stringify(value, null, 2)}\n`);
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bindingsPath = path.join(out, 'input-bindings.json');
const checkInputs = () => {
  for (const item of read(bindingsPath).inputs) {
    assert.equal(bind(item.path).sha256, item.sha256, `Input changed: ${item.path}`);
  }
};
const run = (prefix, command) => {
  json(`${prefix}.started.json`, { startedAt: new Date().toISOString(), cwd, command });
  const result = spawnSync(command[0], command.slice(1), {
    cwd, timeout: 180000, env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  write(`${prefix}.stdout.txt`, result.stdout ?? Buffer.alloc(0));
  write(`${prefix}.stderr.txt`, result.stderr ?? Buffer.alloc(0));
  json(`${prefix}.command.json`, {
    cwd, command, exitCode: result.status, signal: result.signal ?? null,
    error: result.error?.message ?? null, processesFinished: true,
    started: bind(`${prefix}.started.json`),
    stdout: bind(`${prefix}.stdout.txt`), stderr: bind(`${prefix}.stderr.txt`),
    invocations: 1, retry: false,
  });
  console.log(result.stdout?.toString('utf8') ?? '');
  if (result.stderr?.length) console.error(result.stderr.toString('utf8'));
  return result;
};
const files = dir => fs.readdirSync(dir, { withFileTypes: true })
  .flatMap(entry => entry.isDirectory() ? files(path.join(dir, entry.name)) : [path.join(dir, entry.name)])
  .sort();
const [mode] = process.argv.slice(2);

if (mode === 'prepare') {
  for (const page of pages) assert(!fs.existsSync(prepared(page)), 'Preparation already exists');
  const tracked = [
    'AGENTS.md', '.intentfold/charter/engineering.md', '.intentfold/charter/operations.md',
    '.claude/skills/ld-s10y-lesson/SKILL.md', '.agents/skills/ld-s10y-image/SKILL.md',
    'ssot-resources/soviet10year-textbooks/sources/manifest.json',
    'ssot-resources/soviet10year-textbooks/toc/10p/zh.json',
    'ssot-resources/soviet10year-textbooks/sources/soviet10years/10p 苏联中学课本 物理 十年级 .pdf',
    '.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json',
    ...['p2c.py', 'layout.py', 'blocks.py', 'normalize.py', 'mathcheck.py'].map(name => `${tools}/${name}`),
  ];
  json(bindingsPath, {
    ticket: 'STEMROBIN-181', cwd, pages, printedPages: pages.map(page => page - 10),
    inputs: tracked.map(bind), allowedWriteRoots: [relative(out), ...pages.map(prepared)],
    predecessor: {
      requestedPath: 'tmp/d039-10p-source100-103-author',
      existsAtStart: fs.existsSync('tmp/d039-10p-source100-103-author'),
      textFromUser: 'Physical 103: exercise 3 questions 1-9 complete; no outgoing open.',
      predecessorPixelsOpened: false, canonicalPredecessorRead: false,
    },
  });
  for (const page of pages) {
    checkInputs();
    const command = [python, '-B', `${tools}/p2c.py`, 'prepare', '--book', '10p', '--page', String(page)];
    const result = run(path.join(out, 'receipts', `prepare-${page}`), command);
    json(path.join(out, 'receipts', `prepare-${page}.outputs.json`), {
      page, outputs: fs.existsSync(prepared(page)) ? files(prepared(page)).map(bind) : [],
      advisoryCanonicalPathNotWritten: true,
    });
    assert.equal(result.status, 0, `Prepare failed for ${page}; retained without retry`);
  }
  checkInputs();
} else if (mode === 'finalize') {
  checkInputs();
  assert(!fs.existsSync(path.join(out, 'native')), 'Native run already exists; no retry');
  for (const page of pages) assert(fs.existsSync(candidate(page)), `Missing candidate ${page}`);
  for (const page of pages) {
    const nativePage = path.join(out, 'native', '10p', 'pages', stem(page));
    write(path.join(nativePage, 'page.md'), fs.readFileSync(candidate(page)));
    for (const file of files(prepared(page))) {
      write(path.join(out, 'native-work', '10p', 'pages', stem(page), path.relative(prepared(page), file)),
        fs.readFileSync(file));
    }
  }
  json(path.join(out, 'receipts', 'finalize-inputs.json'), {
    candidates: pages.map(page => bind(candidate(page))),
    prepared: pages.flatMap(page => files(prepared(page)).map(bind)),
    isolatedWorkCopies: files(path.join(out, 'native-work')).map(bind),
    sourceApproval: false, initialRunOnly: true,
  });
  const results = [];
  for (const page of pages) {
    checkInputs();
    const command = [
      python, '-B', `${tools}/p2c.py`, 'finalize', '--book', '10p', '--page', String(page),
      '--root', relative(path.join(out, 'native')),
      '--work', relative(path.join(out, 'native-work')),
    ];
    const result = run(path.join(out, 'receipts', `finalize-${page}.initial`), command);
    const auditPath = path.join(out, 'native', '10p', 'pages', stem(page), 'audit.json');
    results.push({
      page, exitCode: result.status,
      audit: fs.existsSync(auditPath) ? read(auditPath) : null,
      native: files(path.join(out, 'native', '10p', 'pages', stem(page))).map(bind),
    });
  }
  json(path.join(out, 'receipts', 'finalize.initial.result.json'), {
    status: results.every(result => result.exitCode === 0) ? 'PASS' : 'FAIL',
    results, invocationsPerPage: 1, retries: 0, sourceApproval: false,
  });
  checkInputs();
} else if (mode === 'freeze') {
  checkInputs();
  const finalization = read(path.join(out, 'receipts', 'finalize.initial.result.json'));
  const opens = read(path.join(out, 'image-opens.json'));
  assert(opens.entries.length <= 8, 'Image budget exceeded');
  for (const entry of opens.entries) assert.equal(bind(entry.path).sha256, entry.sha256);
  const before = read(path.join(out, 'receipts', 'finalize-inputs.json'));
  for (const entry of before.candidates) assert.equal(bind(entry.path).sha256, entry.sha256);
  for (const entry of before.prepared) assert.equal(bind(entry.path).sha256, entry.sha256);
  const artifacts = files(out).map(bind);
  json(path.join(out, 'author-freeze.json'), {
    schema: 'ld-s10y-source-author-freeze@1', ticket: 'STEMROBIN-181',
    frozenAt: new Date().toISOString(), status: 'AUTHOR-FROZEN-NOT-SOURCE-PASS',
    sourceApproval: false, independentSourceReviewRequired: true,
    cwd, pages, printedPages: pages.map(page => page - 10), artifacts,
    prepared: before.prepared, initialNativeStatus: finalization.status,
    initialFailures: finalization.results.filter(result => result.exitCode !== 0),
    prepareInvocations: 4, finalizeInvocations: 4, retries: 0,
    imagesOpened: opens.entries.length, observations: bind(path.join(out, 'source-observations.json')),
    assembly: false, modern: false, canonicalWrites: false, database: false,
    git: false, browserWindows: false, agents: false, supervisorMessages: false,
    existingToolsOrSkillsChanged: false, predecessorPixelsOpened: false,
  });
  for (const file of files(out)) fs.chmodSync(file, 0o444);
  const changed = artifacts.filter(item => bind(item.path).sha256 !== item.sha256);
  assert.equal(changed.length, 0);
  console.log(JSON.stringify(bind(path.join(out, 'author-freeze.json')), null, 2));
} else {
  throw new Error('Only prepare, finalize, or freeze are supported');
}

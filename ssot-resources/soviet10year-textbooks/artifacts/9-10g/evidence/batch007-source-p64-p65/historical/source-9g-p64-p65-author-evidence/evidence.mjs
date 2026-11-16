import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/a07e/lemmadeck';
const here = path.dirname(new URL(import.meta.url).pathname);
const durable = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages');
const work = path.join(repo, '.tmp/ld-s10y-lesson/9-10g/pages');
const tool = path.join(repo, '.claude/skills/ld-s10y-lesson/tools/p2c.py');
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
const tools = ['p2c.py', 'layout.py', 'blocks.py', 'normalize.py', 'mathcheck.py', 'katex_check.js'];
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const json = (file, data) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
};
function files(root) {
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root, { withFileTypes: true }).flatMap(item => {
    const file = path.join(root, item.name);
    return item.isDirectory() ? files(file) : item.isFile() ? [file] : [];
  }).sort();
}
function toolHashes() {
  return Object.fromEntries(tools.map(name => {
    const file = path.join(path.dirname(tool), name);
    return [file, hash(fs.readFileSync(file))];
  }));
}
function snapshot(page, phase) {
  const dir = path.join(here, page, phase);
  if (fs.existsSync(dir)) throw new Error(`Refusing to overwrite snapshot: ${dir}`);
  fs.mkdirSync(dir, { recursive: true });
  const roots = [path.join(work, page), path.join(durable, page)];
  const records = roots.flatMap(root => files(root)).map(file => {
    const bytes = fs.readFileSync(file);
    const relative = path.relative(repo, file);
    const copy = path.join(dir, 'files', relative);
    fs.mkdirSync(path.dirname(copy), { recursive: true });
    fs.writeFileSync(copy, bytes);
    const stat = fs.statSync(file);
    return { path: file, sha256: hash(bytes), bytes: bytes.length,
      mtime: stat.mtime.toISOString(), evidence_copy: copy };
  });
  const result = { schema: 'source-page-author/snapshot@1', page, phase,
    captured_at: new Date().toISOString(), cwd: repo,
    roots: roots.map(root => ({ path: root, exists: fs.existsSync(root) })),
    tools: toolHashes(), files: records };
  json(path.join(dir, 'manifest.json'), result);
  return result;
}
const [mode, page] = process.argv.slice(2);
if (mode === 'baseline') {
  snapshot('0064', 'before-author');
  snapshot('0065', 'before-author');
  console.log('Saved both before-author snapshots.');
} else if (mode === 'snapshot' && ['0064', '0065'].includes(page)) {
  console.log(JSON.stringify(snapshot(page, 'current'), null, 2));
} else if (mode === 'finalize' && ['0064', '0065'].includes(page)) {
  const guard = path.join(here, page, 'first-finalize-attempt.json');
  if (fs.existsSync(guard)) throw new Error('First finalize already attempted; no retry permitted.');
  if (page === '0065') {
    const previous = path.join(here, '0064', 'finalize-result.json');
    if (!fs.existsSync(previous) || JSON.parse(fs.readFileSync(previous, 'utf8')).exit_code !== 0) {
      throw new Error('0064 did not complete successfully; stop before 0065.');
    }
  }
  const baseline = JSON.parse(fs.readFileSync(path.join(here, page, 'before-author/manifest.json'), 'utf8'));
  const currentTools = toolHashes();
  if (JSON.stringify(baseline.tools) !== JSON.stringify(currentTools)) {
    throw new Error('Tool hash changed since before-author snapshot.');
  }
  if (currentTools[path.join(path.dirname(tool), 'layout.py')] !==
      '1fc40bd09c423c94c1497de995b43c98f497710c29c7fd753076414b9c96ed48') {
    throw new Error('Parent layout hash mismatch.');
  }
  snapshot(page, 'before-finalize');
  const argv = [python, tool, 'finalize', '--book', '9-10g', '--page', String(Number(page))];
  const started = new Date().toISOString();
  json(guard, { cwd: repo, argv, started_at: started, attempt: 1 });
  const result = spawnSync(argv[0], argv.slice(1), { cwd: repo, encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024, env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } });
  const ended = new Date().toISOString();
  fs.writeFileSync(path.join(here, page, 'finalize.stdout.txt'), result.stdout ?? '');
  fs.writeFileSync(path.join(here, page, 'finalize.stderr.txt'), result.stderr ?? '');
  json(path.join(here, page, 'finalize-result.json'), {
    cwd: repo, argv, started_at: started, ended_at: ended,
    exit_code: result.status, signal: result.signal, spawn_error: result.error?.message ?? null,
    stdout: result.stdout ?? '', stderr: result.stderr ?? '',
    stdout_sha256: hash(Buffer.from(result.stdout ?? '')),
    stderr_sha256: hash(Buffer.from(result.stderr ?? '')),
    tools_before: currentTools, tools_after: toolHashes(), attempt: 1,
  });
  snapshot(page, 'after-finalize');
  process.stdout.write(result.stdout ?? '');
  process.stderr.write(result.stderr ?? '');
  process.exitCode = result.status ?? 2;
} else {
  throw new Error('Expected baseline, finalize 0064/0065, or snapshot 0064/0065.');
}

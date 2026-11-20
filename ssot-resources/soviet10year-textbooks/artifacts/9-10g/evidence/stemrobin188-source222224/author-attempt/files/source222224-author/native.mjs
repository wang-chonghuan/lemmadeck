import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const own = path.dirname(new URL(import.meta.url).pathname);
const repo = path.resolve(own, '../../../../..');
const page = process.argv[2];
const attempt = process.argv[3] ?? 'first';
if (!['222', '223', '224'].includes(page) || !['first', 'repair1'].includes(attempt)) {
  throw new Error('Outside authorized page/attempt');
}
const pad = `0${page}`;
const artifacts = path.join(own, 'artifacts');
const work = path.join(own, 'work');
const pageDirectory = path.join(artifacts, '9-10g/pages', pad);
const directory = path.join(own, 'native', pad, attempt);
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const write = (name, data) => fs.writeFileSync(
  path.join(directory, name), `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' },
);
if (attempt === 'repair1') {
  const first = JSON.parse(fs.readFileSync(path.join(own, 'native', pad, 'first', 'result.json')));
  if (first.exit_code === 0) throw new Error('Cannot repeat PASS');
  const authorization = JSON.parse(fs.readFileSync(path.join(own, `repair-${page}.json`)));
  if (authorization.kind !== 'definite-content-failure' || authorization.repair_count !== 1) {
    throw new Error('No definite content repair');
  }
}
fs.mkdirSync(directory, { recursive: true });
const candidate = path.join(directory, 'candidate.md');
fs.copyFileSync(path.join(pageDirectory, 'page.md'), candidate, fs.constants.COPYFILE_EXCL);
fs.chmodSync(candidate, 0o444);
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
const tool = path.join(repo, '.claude/skills/ld-s10y-lesson/tools/p2c.py');
const args = [tool, 'finalize', '--book', '9-10g', '--page', page, '--root', artifacts, '--work', work];
write('command.json', {
  cwd: repo, executable: python, argv: args,
  environment_override: { PYTHONDONTWRITEBYTECODE: '1' },
  tool_sha256: hash(tool),
  candidate: { path: candidate, sha256: hash(candidate) },
});
const result = spawnSync(python, args, {
  cwd: repo, env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  encoding: 'utf8', maxBuffer: 8 * 1024 * 1024,
});
fs.writeFileSync(path.join(directory, 'stdout.txt'), result.stdout ?? '', { flag: 'wx' });
fs.writeFileSync(path.join(directory, 'stderr.txt'), result.stderr ?? '', { flag: 'wx' });
const outputs = ['page.md', 'page.json', 'audit.json']
  .map(name => path.join(pageDirectory, name))
  .filter(file => fs.existsSync(file))
  .map(file => ({ path: file, sha256: hash(file) }));
const failureSnapshots = [];
if (result.status !== 0) {
  for (const output of outputs) {
    const file = path.join(directory, `failure-${path.basename(output.path)}`);
    fs.copyFileSync(output.path, file, fs.constants.COPYFILE_EXCL);
    fs.chmodSync(file, 0o444);
    failureSnapshots.push({ path: file, sha256: hash(file) });
  }
}
write('result.json', {
  page: Number(page), attempt, exit_code: result.status, signal: result.signal,
  error: result.error?.message ?? null, outputs, failure_snapshots: failureSnapshots,
  dependent_stages_not_run: ['assemble', 'vectorize', 'adapt', 'import', 'publish', 'approval'],
});
for (const name of ['command.json', 'stdout.txt', 'stderr.txt', 'result.json']) {
  fs.chmodSync(path.join(directory, name), 0o444);
}
console.log(JSON.stringify({ page: Number(page), attempt, exit_code: result.status, directory }));
console.log(result.stdout ?? '');
if (result.stderr) console.error(result.stderr);
if (result.status !== 0) process.exitCode = 1;

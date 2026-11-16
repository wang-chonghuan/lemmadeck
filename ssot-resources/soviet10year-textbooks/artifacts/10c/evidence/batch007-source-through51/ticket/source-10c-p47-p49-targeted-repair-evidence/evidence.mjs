import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const scratch = '.intentfold/tickets/STEMROBIN-184/tmp';
const out = `${scratch}/source-10c-p47-p49-targeted-repair-evidence`;
const durable = 'ssot-resources/soviet10year-textbooks/artifacts/10c/pages';
const prepared = '.tmp/ld-s10y-lesson/10c/pages';
const first = `${scratch}/source-10c-p47-p51-author-evidence`;
const sha = raw => crypto.createHash('sha256').update(raw).digest('hex');
const binding = file => {
  const raw = fs.readFileSync(file);
  return { path: file, bytes: raw.length, sha256: sha(raw) };
};
const files = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(dir, entry.name);
  return entry.isDirectory() ? files(file) : [file];
});
const write = (file, value) => {
  if (fs.existsSync(file)) throw new Error(`Preserve existing evidence: ${file}`);
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
};
const copy = (source, target) => {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL);
  if (sha(fs.readFileSync(source)) !== sha(fs.readFileSync(target))) throw new Error(target);
  return { original: binding(source), snapshot: binding(target) };
};
const [mode, pageArg] = process.argv.slice(2);
if (mode === 'before') {
  const report = `${scratch}/source-10c-p47-p51-independent-review.md`;
  if (binding(report).sha256 !== '95276911747d2ce7d6e60deeb465b07ee21534dfb37b894b2f19bf6576dd2043') {
    throw new Error('Stage B hash mismatch');
  }
  const snapshots = [];
  for (const page of [47, 48, 49]) {
    const p = String(page).padStart(4, '0');
    for (const file of ['page.md', 'page.json', 'audit.json']) {
      snapshots.push(copy(`${durable}/${p}/${file}`, `${out}/${p}/before/${file}`));
      snapshots.push(copy(`${first}/${p}/after-durable/${file}`, `${out}/${p}/first-finalize/${file}`));
    }
    for (const file of ['command.json', 'result.json', 'stdout.txt', 'stderr.txt', 'attempt.manifest.json']) {
      snapshots.push(copy(`${first}/${p}/${file}`, `${out}/${p}/first-finalize/${file}`));
    }
    snapshots.push(copy(`${first}/${p}/first-draft-before-finalize/page.md`, `${out}/${p}/first-draft/page.md`));
  }
  for (const name of [
    'source-10c-p47-p51-independent-review.md',
    'source-10c-p47-p51-independent-source-first.md',
    'source-10c-p47-p51-author.md',
    'source-10c-p47-p51-author-manifest.json',
  ]) snapshots.push(copy(`${scratch}/${name}`, `${out}/first-reports/${name}`));
  const protectedFiles = [
    ...[47, 48, 49, 50, 51].flatMap(page => files(`${prepared}/${String(page).padStart(4, '0')}`)),
    ...[50, 51].flatMap(page => files(`${durable}/${String(page).padStart(4, '0')}`)),
    ...files(first),
    ...files('.claude/skills/ld-s10y-lesson/tools'),
    ...snapshots.map(item => item.original.path).filter(file => file.startsWith(`${scratch}/source-10c-p47-p51-`) && !file.startsWith(first)),
  ].map(binding);
  write(`${out}/before.manifest.json`, { root, snapshots, protectedFiles });
  console.log(JSON.stringify({ evidence: binding(`${out}/before.manifest.json`), snapshots: snapshots.length, protectedFiles: protectedFiles.length }));
} else if (mode === 'finalize') {
  const page = Number(pageArg);
  if (![47, 48, 49].includes(page)) throw new Error('Page outside scope');
  const p = String(page).padStart(4, '0');
  const commandFile = `${out}/${p}/finalize.command.json`;
  if (fs.existsSync(commandFile)) throw new Error('No finalize retry');
  for (const file of ['page.md', 'page.json', 'audit.json']) {
    copy(`${durable}/${p}/${file}`, `${out}/${p}/before-finalize/${file}`);
  }
  const executable = 'env';
  const argv = ['-u', 'PWDEBUG', 'PLAYWRIGHT_HTML_OPEN=never',
    '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize', '--book', '10c', '--page', String(page)];
  write(commandFile, { cwd: root, executable, argv, targeted_attempt: 1, started_at: new Date().toISOString() });
  const run = spawnSync(executable, argv, { cwd: root, encoding: 'utf8' });
  fs.writeFileSync(`${out}/${p}/finalize.stdout.txt`, run.stdout ?? '', { flag: 'wx' });
  fs.writeFileSync(`${out}/${p}/finalize.stderr.txt`, run.stderr ?? '', { flag: 'wx' });
  write(`${out}/${p}/finalize.result.json`, {
    exit: run.status, signal: run.signal, error: run.error?.message ?? null,
    finished_at: new Date().toISOString(), status: run.status === 0 ? 'PASS' : 'FAIL',
  });
  for (const file of ['page.md', 'page.json', 'audit.json']) {
    copy(`${durable}/${p}/${file}`, `${out}/${p}/after/${file}`);
  }
  console.log(run.stdout ?? '');
  console.error(run.stderr ?? '');
  process.exitCode = run.status ?? 2;
} else {
  throw new Error('Use before or finalize');
}

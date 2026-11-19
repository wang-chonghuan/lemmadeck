import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const cwd = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const own = path.dirname(new URL(import.meta.url).pathname);
const prepared = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1298-source278281-first-preparation/work/10p/pages');
const receipts = path.join(own, 'receipts');
fs.mkdirSync(receipts, { recursive: true });
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const dump = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const mode = process.argv[2];

if (mode === 'setup') {
  const entries = [];
  for (const page of ['0278', '0279', '0280', '0281']) {
    const work = path.join(own, 'work/10p/pages', page);
    fs.mkdirSync(work, { recursive: true });
    fs.mkdirSync(path.join(own, 'root/10p/pages', page), { recursive: true });
    for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) {
      const source = path.join(prepared, page, name);
      const target = path.join(work, name);
      const before = hash(source);
      fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL);
      const after = hash(source);
      const copied = hash(target);
      if (before !== after || before !== copied) throw new Error(`Hash mismatch: ${source}`);
      entries.push({ page, name, source, target, sha256: before, copied_sha256: copied, original_unchanged: true });
    }
  }
  dump(path.join(receipts, 'prepared-copy.json'), {
    operation: 'exclusive mechanical copy; no prepare replay; original inputs read-only by policy',
    cwd, entries
  });
  console.log(JSON.stringify({ copied: entries.length, receipt: path.join(receipts, 'prepared-copy.json') }));
} else if (mode === 'command') {
  const id = process.argv[3];
  const command = process.argv[4];
  const args = process.argv.slice(5);
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  fs.writeFileSync(path.join(receipts, `${id}.stdout`), result.stdout || '', { flag: 'wx' });
  fs.writeFileSync(path.join(receipts, `${id}.stderr`), result.stderr || '', { flag: 'wx' });
  dump(path.join(receipts, `${id}.json`), {
    cwd, command, args, exit_code: result.status, signal: result.signal,
    error: result.error ? String(result.error) : null,
    stdout: path.join(receipts, `${id}.stdout`),
    stderr: path.join(receipts, `${id}.stderr`),
    stdout_sha256: hash(path.join(receipts, `${id}.stdout`)),
    stderr_sha256: hash(path.join(receipts, `${id}.stderr`))
  });
  process.stdout.write(result.stdout || '');
  process.stderr.write(result.stderr || '');
  process.exitCode = result.status ?? 1;
} else {
  throw new Error(`Unknown mode: ${mode}`);
}

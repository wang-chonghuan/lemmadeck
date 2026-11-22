import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const root = path.dirname(import.meta.filename);
const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const [name, command, ...args] = process.argv.slice(2);
if (!name || !/^[a-z0-9-]+$/.test(name) || !command) {
  throw new Error('Usage: receipt-runner.mjs receipt-name executable [argv...]');
}
const receiptPath = path.join(root, 'receipts', `${name}.execution.json`);
if (fs.existsSync(receiptPath)) throw new Error('Never overwrite a receipt');
const startedAt = new Date().toISOString();
const child = spawnSync(command, args, {
  cwd: repo,
  encoding: 'utf8',
  maxBuffer: 16 * 1024 * 1024,
});
const stream = (kind, text) => {
  const output = path.join(root, 'receipts', `${name}.${kind}`);
  fs.writeFileSync(output, text ?? '', { flag: 'wx' });
  return {
    path: output,
    sha256: crypto.createHash('sha256').update(text ?? '').digest('hex'),
  };
};
const receipt = {
  schema: 'same188-6/actual-execution@1',
  cwd: repo,
  argv: [command, ...args],
  startedAt,
  completedAt: new Date().toISOString(),
  exitCode: child.status,
  signal: child.signal,
  error: child.error?.message ?? null,
  streams: {
    stdout: stream('stdout', child.stdout),
    stderr: stream('stderr', child.stderr),
  },
};
fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx' });
process.stdout.write(child.stdout ?? '');
process.stderr.write(child.stderr ?? '');
console.log(JSON.stringify({ receiptPath, exitCode: child.status, signal: child.signal }));
if (name === '12-seal-evidence' && child.status === 0) {
  const bindings = [];
  const visit = directory => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const item = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(item);
      else if (entry.isFile() && item !== path.join(root, 'hashes.json')) {
        const bytes = fs.readFileSync(item);
        bindings.push({
          path: item,
          sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
          bytes: bytes.length,
          mode: `0${(fs.statSync(item).mode & 0o777).toString(8)}`,
        });
      }
    }
  };
  visit(root);
  const hashes = {
    schema: 'same188-6/recovery-hashes@1',
    role: 'AUTHOR_ONLY',
    files: bindings,
    exclusions: ['hashes.json has no recursive self-hash; its SHA is returned in the actual sealing tool stdout.'],
    activeExecSessions: [],
  };
  const hashesPath = path.join(root, 'hashes.json');
  fs.writeFileSync(hashesPath, `${JSON.stringify(hashes, null, 2)}\n`, { flag: 'wx' });
  console.log(JSON.stringify({
    hashes: { path: hashesPath, sha256: crypto.createHash('sha256').update(fs.readFileSync(hashesPath)).digest('hex') },
    manifest: { path: path.join(root, 'manifest.json'), sha256: crypto.createHash('sha256').update(fs.readFileSync(path.join(root, 'manifest.json'))).digest('hex') },
    receipt: { path: receiptPath, sha256: crypto.createHash('sha256').update(fs.readFileSync(receiptPath)).digest('hex') },
    files: bindings.length,
    activeExecSessions: [],
  }));
}
process.exitCode = child.status ?? 1;

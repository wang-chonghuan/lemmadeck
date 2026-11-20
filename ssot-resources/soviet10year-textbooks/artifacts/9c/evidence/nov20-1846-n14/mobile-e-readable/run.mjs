import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const cwd = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
const startedAt = new Date().toISOString();
const stdout = fs.createWriteStream(path.join(root, 'stdout.log'), { flags: 'wx' });
const stderr = fs.createWriteStream(path.join(root, 'stderr.log'), { flags: 'wx' });
const child = spawn(process.execPath, [path.join(root, 'probe.mjs')], {
  cwd, env: { ...process.env, TMPDIR: root },
  stdio: ['ignore', 'pipe', 'pipe'],
});
child.stdout.on('data', bytes => { stdout.write(bytes); process.stdout.write(bytes); });
child.stderr.on('data', bytes => { stderr.write(bytes); process.stderr.write(bytes); });
child.on('error', error => { stderr.write(error.stack + '\n'); });
child.on('close', async (code, signal) => {
  await Promise.all([stdout, stderr].map(stream =>
    new Promise(resolve => stream.end(resolve))));
  fs.writeFileSync(path.join(root, 'exit.json'), JSON.stringify({
    command: [process.execPath, path.join(root, 'probe.mjs')],
    cwd, startedAt, finishedAt: new Date().toISOString(), code, signal,
    stdout: path.join(root, 'stdout.log'), stderr: path.join(root, 'stderr.log'),
  }, null, 2) + '\n', { flag: 'wx' });
  process.exitCode = code ?? 1;
});

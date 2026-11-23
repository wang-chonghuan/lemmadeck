import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';

const ROOT = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
const OUT = path.join(ROOT, '.tmp/stemrobin-184-six/c6-display-range-recovery');
const script = path.join(OUT, 'recovery-check.mjs');
const receipt = path.join(OUT, 'execution.json');
if (process.cwd() !== ROOT || fs.existsSync(receipt) ||
    fs.existsSync(path.join(OUT, 'browser.stdout.txt'))) throw new Error('Wrong cwd or replay');
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const streams = {};
for (const name of ['stdout', 'stderr']) {
  const file = path.join(OUT, `browser.${name}.txt`);
  streams[name] = { path: file, fd: fs.openSync(file, 'wx') };
}
const startedAt = new Date().toISOString();
const argv = [process.execPath, script];
const child = spawn(argv[0], argv.slice(1), { cwd: ROOT, stdio: ['pipe', 'pipe', 'pipe'] });
let error = null;
let timedOut = false;
child.on('error', e => { error = String(e); });
for (const name of ['stdout', 'stderr']) child[name].on('data', chunk => {
  fs.writeSync(streams[name].fd, chunk);
  process[name].write(chunk);
});
process.stdin.on('data', chunk => child.stdin.write(chunk));
const timer = setTimeout(() => {
  timedOut = true;
  child.kill('SIGTERM');
}, 240000);
child.on('close', (exitCode, signal) => {
  clearTimeout(timer);
  process.stdin.pause();
  child.stdin.destroy();
  for (const name of ['stdout', 'stderr']) {
    fs.closeSync(streams[name].fd);
    delete streams[name].fd;
    streams[name].bytes = fs.statSync(streams[name].path).size;
    streams[name].sha256 = digest(streams[name].path);
  }
  const result = {
    schema: 'stemrobin-184/c6-display-recovery-execution@1',
    cwd: ROOT, argv, wrapperArgv: process.argv, startedAt,
    finishedAt: new Date().toISOString(), exitCode, signal, error, streams,
    script: { path: script, sha256: digest(script) },
    attempts: 1, browserInvocations: 1,
    truncation: { timedOut, truncated: false, captureLimit: null },
  };
  fs.writeFileSync(receipt, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify({ receipt, exitCode, signal, timedOut, streams }));
  process.exit(exitCode ?? 1);
});

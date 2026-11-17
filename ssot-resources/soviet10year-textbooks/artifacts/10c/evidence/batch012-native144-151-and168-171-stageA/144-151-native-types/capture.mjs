import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const out = path.dirname(fileURLToPath(import.meta.url));
const [name, executable, ...args] = process.argv.slice(2);
if (!name || !/^[a-z0-9-]+$/.test(name) || !executable) throw new Error('Name and executable required');
if (fs.existsSync(path.join(out, 'manifest.json'))) throw new Error('Already frozen');
const dir = path.join(out, 'commands', name);
fs.mkdirSync(dir, { recursive: true });
const stdoutPath = path.join(dir, 'stdout.raw');
const stderrPath = path.join(dir, 'stderr.raw');
const stdout = fs.openSync(stdoutPath, 'wx');
const stderr = fs.openSync(stderrPath, 'wx');
const hash = (data) => crypto.createHash('sha256').update(data).digest('hex');
const started = new Date().toISOString();
const result = spawnSync(executable, args, { cwd: process.cwd(), stdio: ['ignore', stdout, stderr] });
fs.closeSync(stdout);
fs.closeSync(stderr);
const receipt = {
  executable, args, cwd: process.cwd(), started, finished: new Date().toISOString(),
  exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
  launcher: { executable: process.execPath, args: process.argv.slice(1) },
  scriptInputsAfterChild: args.filter((arg) => /\.(py|mjs)$/.test(arg) && fs.existsSync(arg)).map(
    (filename) => ({ path: path.resolve(filename), sha256: hash(fs.readFileSync(filename)) }),
  ),
  stdout: { path: stdoutPath, bytes: fs.statSync(stdoutPath).size, sha256: hash(fs.readFileSync(stdoutPath)) },
  stderr: { path: stderrPath, bytes: fs.statSync(stderrPath).size, sha256: hash(fs.readFileSync(stderrPath)) },
  capture: 'Exact child stream descriptors opened before spawn; no reconstructed streams or tee claims',
};
fs.writeFileSync(path.join(dir, 'command.json'), JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
console.log(fs.readFileSync(stdoutPath, 'utf8'));
console.log(JSON.stringify(receipt, null, 2));
process.exitCode = result.status ?? 1;

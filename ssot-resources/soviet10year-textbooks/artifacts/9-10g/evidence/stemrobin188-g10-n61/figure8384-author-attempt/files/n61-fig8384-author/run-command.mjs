import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import crypto from 'node:crypto';

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const root = path.dirname(fileURLToPath(import.meta.url));
if (root !== path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n61-fig8384-author') || process.cwd() !== repo) throw new Error('Wrong scope');
const [name, program, ...args] = process.argv.slice(2);
if (!/^[a-zA-Z0-9-]+$/.test(name) || !program) throw new Error('Missing command');
const out = path.join(root, 'commands', name);
if (fs.existsSync(out)) throw new Error('No duplicate command receipt');
fs.mkdirSync(out, { recursive: true });
const tmp = path.join(root, 'runtime-tmp');
fs.mkdirSync(tmp, { recursive: true });
const require = createRequire(path.join(repo, '.agents/skills/package.json'));
const { chromium } = require('playwright-core');
const executable = [
  chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find(file => fs.existsSync(file));
if (!executable) throw new Error('Existing isolated Chromium unavailable; no install or fallback authorized');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const env = {
  TMPDIR: tmp,
  PYTHON: 'python3',
  PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH: executable,
};
const startedAt = new Date().toISOString();
const result = spawnSync(program, args, {
  cwd: repo, env: { ...process.env, ...env }, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
});
fs.writeFileSync(path.join(out, 'stdout.txt'), result.stdout ?? '', { flag: 'wx' });
fs.writeFileSync(path.join(out, 'stderr.txt'), result.stderr ?? '', { flag: 'wx' });
const receipt = {
  schema: 'bounded-author/actual-command@1', name, cwd: repo,
  program, args, command: [program, ...args].join(' '),
  environmentOverrides: env, startedAt, completedAt: new Date().toISOString(),
  exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
  stdout: { path: path.join(out, 'stdout.txt'), sha256: hash(path.join(out, 'stdout.txt')) },
  stderr: { path: path.join(out, 'stderr.txt'), sha256: hash(path.join(out, 'stderr.txt')) },
  ...(fs.existsSync(program) ? { executableSha256: hash(program) } : {}),
  browserUse: 'Existing isolated headless Chromium only, if command renders; no user window.',
  contextImageOpens: 0, semanticApproval: false,
};
fs.writeFileSync(path.join(out, 'receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx' });
for (const file of ['stdout.txt', 'stderr.txt', 'receipt.json']) fs.chmodSync(path.join(out, file), 0o444);
console.log(JSON.stringify(receipt, null, 2));
if (result.stdout) console.log(result.stdout);
if (result.stderr) console.error(result.stderr);
process.exitCode = result.status ?? 1;

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const root = path.dirname(new URL(import.meta.url).pathname);
const [number, attempt] = process.argv.slice(2);
if (!['81', '82'].includes(number) || !['draft-01', 'draft-02'].includes(attempt)) throw new Error('Invalid actual draft');
const figure = `fig-g10-${number}`;
const dir = path.join(root, figure, attempt);
const specPath = path.join(dir, 'spec.json');
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const binding = { path: specPath, sha256: sha(specPath) };
const receiptPath = path.join(dir, 'native.commands.json');
if (fs.existsSync(receiptPath)) throw new Error('No duplicate actual-draft runs');
const commands = [];
const run = (stage, command, argv) => {
  const startedAt = new Date().toISOString();
  const result = spawnSync(command, argv, {
    cwd: process.cwd(), encoding: 'utf8',
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
    maxBuffer: 16 * 1024 * 1024,
  });
  const receipt = {
    stage, command, argv, actualCommand: [command, ...argv].join(' '),
    cwd: process.cwd(), startedAt, finishedAt: new Date().toISOString(),
    spec: binding, exitCode: result.status, signal: result.signal,
    stdout: result.stdout || '', stderr: result.stderr || '',
    error: result.error ? String(result.error) : null,
  };
  commands.push(receipt);
  fs.writeFileSync(receiptPath, JSON.stringify({ figure, attempt, spec: binding, commands }, null, 2) + '\n');
  console.log(JSON.stringify(receipt, null, 2));
  return result.status === 0 && !result.error;
};
const retainFirstFailure = stage => {
  const target = path.join(root, figure, 'FIRST.native-fail.json');
  if (!fs.existsSync(target)) fs.writeFileSync(target, JSON.stringify({
    schema: 'stemrobin188-first-genuine-native-failure@1',
    figure, attempt, stage, spec: binding, commands,
    renderReport: fs.existsSync(path.join(dir, 'render.json')) ? JSON.parse(fs.readFileSync(path.join(dir, 'render.json'))) : null,
    deliberatelyInjected: false,
  }, null, 2) + '\n');
};
if (!run('draft-validation', 'python3', ['.agents/skills/ld-s10y-image/scripts/validate_spec.py', specPath, '--stage', 'draft', '--json'])) {
  retainFirstFailure('draft-validation');
  process.exitCode = 2;
} else if (!run('native-render', 'node', [
  '.agents/skills/ld-s10y-image/scripts/render_spec.mjs', '--spec', specPath,
  '--svg', path.join(dir, 'figure.svg'), '--png', path.join(dir, 'snapshot.png'),
  '--report', path.join(dir, 'render.json'),
])) {
  retainFirstFailure('native-render');
  process.exitCode = 2;
}

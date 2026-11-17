import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const base = path.dirname(fileURLToPath(import.meta.url));
const attempt = process.argv[2] || 'initial';
if (!['initial', 'repair1'].includes(attempt)) throw new Error('Only initial or one finding-bound repair allowed');
const dir = path.join(base, attempt);
const spec = path.join(dir, 'fig-114.spec.json');
const env = { ...process.env, PLAYWRIGHT_HTML_OPEN: 'never' };
delete env.PWDEBUG;
const run = (stage, executable, args) => {
  const receipt = path.join(dir, `${stage}.command.json`);
  if (fs.existsSync(receipt)) throw new Error(`Refusing repeated ${stage}`);
  const startedAt = new Date().toISOString();
  const result = spawnSync(executable, args, { cwd: root, env, encoding: 'utf8', timeout: 120000 });
  fs.writeFileSync(receipt, `${JSON.stringify({
    stage, executable, args, cwd: root, startedAt, endedAt: new Date().toISOString(),
    exit: result.status, signal: result.signal, error: result.error?.message || null,
    stdout: result.stdout, stderr: result.stderr,
  }, null, 2)}\n`, { flag: 'wx' });
  console.log(JSON.stringify({ stage, exit: result.status, stdout: result.stdout, stderr: result.stderr }));
  return result.status;
};
if (attempt === 'initial') {
  const exit = run('draft', 'python3', [
    path.join(root, '.agents/skills/ld-s10y-image/scripts/validate_spec.py'),
    spec, '--stage', 'draft', '--json',
  ]);
  if (exit !== 0) process.exit(exit || 1);
}
const exit = run('native', 'node', [
  path.join(root, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs'),
  '--spec', spec,
  '--svg', path.join(dir, 'fig-114.svg'),
  '--png', path.join(dir, 'fig-114.native.png'),
  '--report', path.join(dir, 'fig-114.render.json'),
]);
process.exitCode = exit ?? 1;

import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const out = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d593-n25-figures-first';
const file = `${out}/fig-40.spec.json`;
fs.writeFileSync(`${out}/first-failure/fig-40.before-label-repair.spec.json`, fs.readFileSync(file), { flag: 'wx' });
fs.writeFileSync(`${out}/first-failure/fig-40.before-label-repair.render.json`, fs.readFileSync(`${out}/fig-40.render.json`), { flag: 'wx' });
fs.writeFileSync(`${out}/first-failure/fig-40.before-label-repair.svg`, fs.readFileSync(`${out}/fig-40.svg`), { flag: 'wx' });
const spec = JSON.parse(fs.readFileSync(file));
spec.objects.find(object => object.id === 'dc-positive-label').at = [35, 328];
fs.writeFileSync(file, JSON.stringify(spec, null, 2) + '\n');
for (const [stage, executable, args] of [
  ['validate', 'python3', ['.agents/skills/ld-s10y-image/scripts/validate_spec.py', file, '--stage', 'draft']],
  ['render', 'node', ['.agents/skills/ld-s10y-image/scripts/render_spec.mjs', '--spec', file, '--svg', `${out}/fig-40.svg`, '--report', `${out}/fig-40.render.json`]],
]) {
  const result = spawnSync(executable, args, { encoding: 'utf8' });
  fs.writeFileSync(`${out}/fig-40.${stage}.label-repair-receipt.json`, JSON.stringify({
    executable, args, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
    scope: 'Move only the plus label 8px downward to clear the canvas padding; circuit geometry unchanged.',
  }, null, 2) + '\n', { flag: 'wx' });
  console.log(result.stdout.trim() || result.stderr.trim());
  if (result.status !== 0) {
    process.exitCode = result.status || 1;
    break;
  }
}

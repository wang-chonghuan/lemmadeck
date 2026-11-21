import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const out = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d593-n25-figures-first';
for (const id of ['fig-40', 'fig-41', 'fig-42']) {
  const file = `${out}/${id}.spec.json`;
  const original = fs.readFileSync(file);
  const spec = JSON.parse(original);
  const removed = spec.objects.filter(object => object.fill === 'none').map(object => object.id);
  fs.mkdirSync(`${out}/first-failure`, { recursive: true });
  fs.writeFileSync(`${out}/first-failure/${id}.spec.json`, original, { flag: 'wx' });
  for (const object of spec.objects) {
    if (object.fill === 'none') delete object.fill;
  }
  fs.writeFileSync(file, JSON.stringify(spec, null, 2) + '\n');
  for (const [stage, executable, args] of [
    ['validate', 'python3', ['.agents/skills/ld-s10y-image/scripts/validate_spec.py', file, '--stage', 'draft']],
    ['render', 'node', ['.agents/skills/ld-s10y-image/scripts/render_spec.mjs', '--spec', file, '--svg', `${out}/${id}.svg`, '--report', `${out}/${id}.render.json`]],
  ]) {
    const result = spawnSync(executable, args, { cwd: process.cwd(), encoding: 'utf8' });
    fs.writeFileSync(`${out}/${id}.${stage}.recovery-receipt.json`, JSON.stringify({ executable, args,
      exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
      removedInvalidFillField: removed, geometryUnchanged: true }, null, 2) + '\n', { flag: 'wx' });
    console.log(result.stdout.trim() || result.stderr.trim());
    if (result.status !== 0) {
      process.exitCode = result.status || 1;
      break;
    }
  }
}

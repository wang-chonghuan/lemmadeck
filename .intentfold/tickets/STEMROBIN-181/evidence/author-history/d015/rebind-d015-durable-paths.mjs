import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const ticket = '.intentfold/tickets/STEMROBIN-181';
const candidate = '.tmp/STEMROBIN-181/9p-n52-figures';
const evidence = `${ticket}/evidence/figures/candidates/9p/9p-n52-figures`;
const durable = 'ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/figures';
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const bind = async file => ({ path: file, sha256: hash(await fs.readFile(file)) });
const trace = [];
for (const id of ['fig-89', 'fig-90']) {
  const file = `${durable}/${id}.render.json`;
  const bytes = await fs.readFile(file);
  const render = JSON.parse(bytes);
  const before = await bind(file);
  const rebind = render.contextOnlyRebind;
  assert.equal(rebind.rerendered, false);
  const replacements = [];
  for (const key of ['originalNativeReport', 'previousSpec', 'currentSpec', 'evidence']) {
    const binding = rebind[key];
    assert.ok(binding.path.startsWith(`${candidate}/`));
    assert.deepEqual(await bind(binding.path), binding);
    const destination = `${evidence}/${path.relative(candidate, binding.path)}`;
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.copyFile(binding.path, destination, fs.constants.COPYFILE_EXCL);
    replacements.push({ key, original: binding, retained: await bind(destination) });
    rebind[key] = await bind(destination);
  }
  await fs.writeFile(`${ticket}/tmp/${id}-before-durable-paths.render.json`, bytes, { flag: 'wx' });
  await fs.writeFile(file, JSON.stringify(render, null, 2) + '\n');
  execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', [
    '.agents/skills/ld-s10y-image/scripts/record_review.py',
    '--spec', `${durable}/${id}.spec.json`, '--render', file,
    '--output', `${durable}/${id}.review.json`, '--status', 'pass',
    '--notes', 'Existing independent original/current-context/pixel PASS reused. Only historical evidence paths moved to retained files, their bytes unchanged; current spec/SVG unchanged. This updates native hash bindings, not a new visual gate or render.',
  ], { stdio: 'inherit' });
  trace.push({ id, before, current: await bind(file), replacements,
    geometrySpecAndSvgUnchanged: true, repeatedPixelGateOrRender: false });
}
await fs.writeFile(`${ticket}/tmp/d015-durable-path-binding.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'pass', scope: 'Historical metadata-path retention only', figures: trace,
}, null, 2) + '\n', { flag: 'wx' });

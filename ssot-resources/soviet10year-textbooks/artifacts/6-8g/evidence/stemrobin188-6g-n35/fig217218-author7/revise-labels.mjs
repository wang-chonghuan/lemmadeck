import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const cwd = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188';
const own = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n35-fig217218-author7');
if (process.cwd() !== cwd) throw new Error('Wrong cwd');
for (const id of ['fig-217', 'fig-218']) {
  const report = JSON.parse(fs.readFileSync(path.join(own, `${id}.render.json`), 'utf8'));
  if (report.status !== 'fail') continue;
  const snapshot = path.join(own, 'first-failure', id);
  if (fs.existsSync(snapshot)) throw new Error('First failure already preserved');
  fs.mkdirSync(snapshot, { recursive: true });
  for (const suffix of ['spec.json', 'svg', 'render.json', 'execution.json', 'native.stdout.txt', 'native.stderr.txt']) {
    fs.copyFileSync(path.join(own, `${id}.${suffix}`), path.join(snapshot, `${id}.${suffix}`));
  }
  const specPath = path.join(own, `${id}.spec.json`);
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const changes = [];
  for (const collision of report.collisions) {
    const object = spec.objects.find(o => `${o.id}-label` === collision.id);
    if (!object) throw new Error('Unknown collision');
    const before = object.labelPlacement;
    object.labelPlacement = { ...before, gap: 28, offset: [0, 0] };
    changes.push({ id: object.id, before, after: object.labelPlacement });
  }
  fs.writeFileSync(specPath, `${JSON.stringify(spec, null, 2)}\n`);
  const result = spawnSync(process.execPath, [path.join(own, 'render-candidate.mjs'),
    '--spec', specPath, '--svg', path.join(own, `${id}.svg`),
    '--report', path.join(own, `${id}.render.json`)], { cwd, encoding: 'utf8' });
  fs.writeFileSync(path.join(own, `${id}.native.stdout.txt`), result.stdout || '');
  fs.writeFileSync(path.join(own, `${id}.native.stderr.txt`), result.stderr || '');
  fs.writeFileSync(path.join(own, `${id}.execution.json`), `${JSON.stringify({
    exitCode: result.status, signal: result.signal, error: result.error?.message || null,
    rendererInvocation: 2, sourceOpens: 1, candidateOnly: true, changes,
    failedStage: 'label-clearance', reusedPassedStage: '640px-font-size',
  }, null, 2)}\n`);
  console.log(`${id}: revised native renderer exit ${result.status}`);
}

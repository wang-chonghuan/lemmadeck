import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const cwd = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188';
const own = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n35-fig217218-author7');
if (process.cwd() !== cwd) throw new Error('Wrong cwd');
const id = 'fig-217';
const report = JSON.parse(fs.readFileSync(path.join(own, `${id}.render.json`), 'utf8'));
if (report.status !== 'fail' || report.collisions.length !== 1 ||
    report.collisions[0].id !== 'f217-A1-label') throw new Error('Unexpected failure');
const snapshot = path.join(own, 'revision-1', id);
if (fs.existsSync(snapshot)) throw new Error('Revision already preserved');
fs.mkdirSync(snapshot, { recursive: true });
for (const suffix of ['spec.json', 'svg', 'render.json', 'execution.json', 'native.stdout.txt', 'native.stderr.txt']) {
  fs.copyFileSync(path.join(own, `${id}.${suffix}`), path.join(snapshot, `${id}.${suffix}`));
}
const specPath = path.join(own, `${id}.spec.json`);
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
const object = spec.objects.find(o => o.id === 'f217-A1');
object.labelPlacement.position = 'NE';
fs.writeFileSync(specPath, `${JSON.stringify(spec, null, 2)}\n`);
const result = spawnSync(process.execPath, [path.join(own, 'render-candidate.mjs'),
  '--spec', specPath, '--svg', path.join(own, `${id}.svg`),
  '--report', path.join(own, `${id}.render.json`)], { cwd, encoding: 'utf8' });
fs.writeFileSync(path.join(own, `${id}.native.stdout.txt`), result.stdout || '');
fs.writeFileSync(path.join(own, `${id}.native.stderr.txt`), result.stderr || '');
fs.writeFileSync(path.join(own, `${id}.execution.json`), `${JSON.stringify({
  exitCode: result.status, rendererInvocation: 3, sourceOpens: 1, candidateOnly: true,
  changes: [{ id: object.id, field: 'labelPlacement.position', before: 'N', after: 'NE' }],
  preserved: 'revision-1/fig-217', unaffectedFigure218Reused: true,
}, null, 2)}\n`);
console.log(`${id}: corrected A1 native renderer exit ${result.status}`);

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const firstSpec = path.join(root, 'fig-g10-87.FIRST.spec.json');
const firstRender = path.join(root, 'fig-g10-87.FIRST.render.json');
const render = JSON.parse(fs.readFileSync(firstRender));
if (render.status !== 'fail' || render.spec.sha256 !== sha(firstSpec)) throw new Error('Repair requires actual current FIRST failure');
const expected = ['G87-S-label', 'G87-O-label', 'G87-B-label', 'G87-A1-label', 'G87-O1-label', 'G87-B1-label'];
if (render.collisions.map(c => c.id).sort().join(',') !== expected.sort().join(',')) throw new Error('Unexpected defect scope');
const spec = JSON.parse(fs.readFileSync(firstSpec));
const gaps = { 'G87-S': 35, 'G87-O': 36, 'G87-B': 50, 'G87-A1': 50, 'G87-O1': 100, 'G87-B1': 40 };
const changed = [];
for (const object of spec.objects) if (Object.hasOwn(gaps, object.id)) {
  const before = { ...object.labelPlacement };
  object.labelPlacement = { ...object.labelPlacement, gap: gaps[object.id] };
  changed.push({ id: object.id, before, after: object.labelPlacement });
}
const specFile = path.join(root, 'fig-g10-87.REPAIR1.spec.json');
fs.writeFileSync(specFile, JSON.stringify(spec, null, 2) + '\n', { flag: 'wx' });
const priorMapping = JSON.parse(fs.readFileSync(path.join(root, 'fig-g10-87.FIRST.relationship-mapping.json')));
const mappingFile = path.join(root, 'fig-g10-87.REPAIR1.relationship-mapping.json');
fs.writeFileSync(mappingFile, JSON.stringify({
  ...priorMapping, actualDraft: 'REPAIR1', nativeValidation: 'NOT YET RUN',
  repair: {
    contentRepairCounter: 1, limit: 1, cause: 'Six actual native label/stroke collision failures, confirmed by inspecting the actual FIRST exported SVG snapshot once.',
    firstSpec: { path: path.basename(firstSpec), sha256: sha(firstSpec) },
    firstRender: { path: path.basename(firstRender), sha256: sha(firstRender), nativeStatus: 'fail' },
    changed, unchanged: ['coordinates', 'projection', 'spatial cone', 'all curves and circles', 'solid/dashed visibility', 'labels', 'font size', 'inventory groups', 'all assertions', 'figure 88'],
    nextFailure: 'EXHAUSTED_FAIL; stop affected figure without further repairs or downstream stages.',
  },
}, null, 2) + '\n', { flag: 'wx' });
for (const file of [specFile, mappingFile]) fs.chmodSync(file, 0o444);
console.log(JSON.stringify({ spec: { path: path.basename(specFile), sha256: sha(specFile) }, relationshipMapping: { path: path.basename(mappingFile), sha256: sha(mappingFile) }, changed, contentRepairCounter: 1 }));

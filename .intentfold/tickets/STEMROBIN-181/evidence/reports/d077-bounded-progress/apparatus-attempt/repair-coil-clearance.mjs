import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const base = path.dirname(fileURLToPath(import.meta.url));
const from = path.join(base, 'initial/fig-114.spec.json');
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const initialSHA = hash(from);
assert.equal(initialSHA, '3264c671a2e4a0edf2945a72ad5d45149d295ed4516432ab13d33e7ec892a755');
const spec = JSON.parse(fs.readFileSync(from, 'utf8'));
const changes = [];
const shift = (obj, field, pointer) => {
  const before = [...obj[field]];
  obj[field][0] -= 10;
  changes.push({ pointer, before, after: [...obj[field]] });
};
spec.objects.forEach((obj, i) => {
  if (['feedback-top', 'feedback-bottom'].includes(obj.id)) {
    shift(obj, 'at', `/objects/${i}/at`);
  }
  if (obj.id.startsWith('feedback-winding-lobe-')) {
    for (const field of ['center', 'start', 'end']) shift(obj, field, `/objects/${i}/${field}`);
  }
});
spec.assertions.forEach((obj, i) => {
  if (obj.id.startsWith('feedback-winding-lobe-')) {
    for (const field of ['center', 'point']) shift(obj, field, `/assertions/${i}/${field}`);
  }
});
assert.equal(changes.length, 23);
const dir = path.join(base, 'repair1');
fs.mkdirSync(dir);
const to = path.join(dir, 'fig-114.spec.json');
fs.writeFileSync(to, `${JSON.stringify(spec, null, 2)}\n`, { flag: 'wx' });
const finding = {
  schema: 'd067/fig114-targeted-author-repair@1',
  finding: 'N58-FIG114-COIL-03',
  authorObservation: 'The initial full native preview makes the upper coupled-winding tips look electrically joined: 1px centerline clearance is smaller than their combined stroke half-widths.',
  targetedChange: 'Move only the left feedback winding and its top/bottom connection nodes 10px left. All component topology, labels, source binding, other coordinates and display settings are unchanged.',
  initial: { spec: from, sha256: initialSHA, render: path.join(base, 'initial/fig-114.render.json'), visualAuthorFinding: 'winding strokes appear joined despite native label PASS' },
  repaired: { spec: to, sha256: hash(to), expectedTipCenterlineClearancePx: 11, expectedStrokeGapPx: 8 },
  changes,
  geometryRepairsConsumed: 1,
  additionalRepairsAllowed: 0,
  initialBytesPreserved: hash(from) === initialSHA,
  independentFigureReview: 'pending',
};
fs.writeFileSync(path.join(dir, 'repair-finding.json'), `${JSON.stringify(finding, null, 2)}\n`, { flag: 'wx' });
const geometry = JSON.parse(fs.readFileSync(path.join(base, 'geometry.json'), 'utf8'));
geometry.previousGeometry = { path: path.join(base, 'geometry.json'), sha256: hash(path.join(base, 'geometry.json')) };
geometry.spec = { path: to, sha256: hash(to) };
geometry.targetedRepair = finding;
fs.writeFileSync(path.join(dir, 'geometry.json'), `${JSON.stringify(geometry, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ spec: to, sha256: hash(to), changes: changes.length, repairsConsumed: 1 }));

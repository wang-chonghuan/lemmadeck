import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const out = path.dirname(fileURLToPath(import.meta.url));
const bind = file => ({
  path: file,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
});
const first = path.join(out, 'fig-26.native2.spec.json');
const before = bind(first);
const spec = JSON.parse(fs.readFileSync(first));
const screen = ([x, y]) => [50 + 1.16 * x, 30 + (y <= 300 ? 0.9 * y : 270 + 1.3 * (y - 300))];
const user = value => {
  const [x, y] = screen(value);
  return [x, spec.canvas.height - y];
};
const changes = [];
const change = (id, field, value) => {
  const object = spec.objects.find(object => object.id === id);
  assert(object);
  changes.push({ object: id, field, before: object[field], after: value });
  object[field] = value;
};
change('north-pole-label', 'at', user([187, 421]));
change('coil-leader', 'to', user([126.5, 341]));
change('contacts-leader', 'to', user([84, 402.25]));
for (const id of ['coil', 'contacts']) {
  const edge = spec.objects.find(object => object.id === `${id}-leader`);
  const assertion = spec.assertions.find(item => item.id === `${id}-leader-endpoints`);
  assertion.to = edge.to;
}
const candidate = path.join(out, 'fig-26.repair.spec.json');
fs.writeFileSync(candidate, JSON.stringify(spec, null, 2) + '\n', { flag: 'wx' });
assert.equal(bind(first).sha256, before.sha256);
fs.writeFileSync(path.join(out, 'content-repair.json'), JSON.stringify({
  schema: 'd282/one-targeted-content-repair@1',
  repairCount: 1, reason: 'Annotation clearance and accurate visible-part attachment.',
  firstSpec: before,
  firstObservation: bind(path.join(out, 'first-observation.json')),
  firstSvg: bind(path.join(out, 'fig-26.svg')),
  firstRender: bind(path.join(out, 'fig-26.render.json')),
  firstPreview: bind(path.join(out, 'fig-26.preview.png')),
  candidate: bind(candidate), changes,
  assertionChanges: ['coil-leader-endpoints.to', 'contacts-leader-endpoints.to'],
  apparatusCoordinatesChanged: false, poleIdentityChanged: false, windingCountChanged: false,
  rotationChanged: false, ringOrBrushShapeChanged: false, netlistAdded: false,
  sourceAndTextChanged: false, paidCalls: 0, furtherContentRepairAuthorized: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ candidate: bind(candidate), repair: bind(path.join(out, 'content-repair.json')), changes }));

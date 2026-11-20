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
const original = path.join(out, 'fig-26.spec.json');
const candidate = path.join(out, 'fig-26.native.spec.json');
const before = bind(original);
const spec = JSON.parse(fs.readFileSync(original, 'utf8'));
const arrow = spec.objects.find(object => object.id === 'rotation-tip');
assert.equal(arrow.strokeWidth, 2.8);
arrow.strokeWidth = 3;
fs.writeFileSync(candidate, JSON.stringify(spec, null, 2) + '\n', { flag: 'wx' });
assert.equal(bind(original).sha256, before.sha256);
fs.writeFileSync(path.join(out, 'native-recovery.json'), JSON.stringify({
  schema: 'd282/native-technical-recovery@1',
  firstSpec: before, candidateSpec: bind(candidate),
  firstFailure: bind(path.join(out, 'native/d282-render-first/receipt.json')),
  firstFailureStderr: bind(path.join(out, 'native/d282-render-first/stderr.txt')),
  diagnosis: 'The existing arrowhead materializer rejects unequal exact ratios of markerWidth/viewBox.width and markerHeight/viewBox.height. The first native call failed on the 2.8px rotation-tip marker before producing SVG/report. Integer 3px is used for this arrow only to avoid the nonintegral marker-ratio compatibility fault; success remains to be established by retrying the failed native stage.',
  changed: [{ object: 'rotation-tip', field: 'strokeWidth', from: 2.8, to: 3 }],
  endpointsChanged: false, rotationDirectionChanged: false, geometryCoordinatesChanged: false,
  sourceChanged: false, textChanged: false, rendererChanged: false, globalFilesChanged: false,
  contentRepairs: 0, toolRecoveryAttempts: 1, imageOpens: 0, paidCalls: 0,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ candidate: bind(candidate), recovery: bind(path.join(out, 'native-recovery.json')) }));

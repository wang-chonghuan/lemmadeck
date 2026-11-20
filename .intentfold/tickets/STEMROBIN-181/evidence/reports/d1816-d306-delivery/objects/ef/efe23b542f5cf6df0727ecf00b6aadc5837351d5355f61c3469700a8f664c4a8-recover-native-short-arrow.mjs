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
const candidate = path.join(out, 'fig-26.native2.spec.json');
const before = bind(original);
const spec = JSON.parse(fs.readFileSync(original, 'utf8'));
const arrow = spec.objects.find(object => object.id === 'rotation-tip');
assert.equal(arrow.strokeWidth, 2.8);
arrow.strokeWidth = 2;
fs.writeFileSync(candidate, JSON.stringify(spec, null, 2) + '\n', { flag: 'wx' });
assert.equal(bind(original).sha256, before.sha256);
fs.writeFileSync(path.join(out, 'native-recovery2.json'), JSON.stringify({
  schema: 'd282/native-technical-recovery@1',
  firstSpec: before, candidateSpec: bind(candidate),
  firstFailure: bind(path.join(out, 'native/d282-render-first/receipt.json')),
  secondFailure: bind(path.join(out, 'native/d282-render-technical-recovery/receipt.json')),
  diagnostic: bind(path.join(out, 'native/d282-diagnose-short-arrow-marker/stdout.txt')),
  correctedDiagnosis: 'Actual isolated JSXGraph execution shows zero-sized markers (viewBox 0x0; marker 0x0) for this short arrow at both 2.8px and 3px. At 2px the marker is 12x12 with viewBox 20x20, satisfying the existing materializer. The earlier nonintegral-ratio hypothesis was not confirmed. Thin 2px arrow stroke is the measured compatible setting.',
  changed: [{ object: 'rotation-tip', field: 'strokeWidth', from: 2.8, to: 2 }],
  endpointsChanged: false, rotationDirectionChanged: false, geometryCoordinatesChanged: false,
  sourceChanged: false, textChanged: false, rendererChanged: false, globalFilesChanged: false,
  contentRepairs: 0, toolRecoveryAttempts: 2, imageOpens: 0, paidCalls: 0,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ candidate: bind(candidate), recovery: bind(path.join(out, 'native-recovery2.json')) }));

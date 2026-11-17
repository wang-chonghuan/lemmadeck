import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  ticket, absolute, read, bytes, bind, verify, immutableWrite, exists,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const folder = `${ticket}/tmp/d030-n111-ready`;
const output = `${folder}/result.json`;
assert.ok(!await exists(output));
const retention = `${ticket}/evidence/reports/d030-n111-retention-manifest.json`;
await verify(retention, '5e40a683d740099ccd43093964f4451e31f11e4cfd0521e0b1bbcb7aa4a297a4');
const manifest = await read(retention);
await verify(manifest.pixels.path, manifest.pixels.sha256);
assert.equal((await read(manifest.pixels.path)).status, 'pass');
const meterPath = `${ticket}/production-meter.json`;
const before = await bytes(meterPath);
const meter = JSON.parse(before);
const checkpoint = meter.currentCheckpoint;
assert.equal(checkpoint.completeDeliveredCards, 80);
assert.equal(checkpoint.sourcePagesFinalized, 316);
assert.equal(checkpoint.sourceWrittenExercises, 186);
assert.deepEqual(checkpoint.completeUnbatchedCards, []);
await immutableWrite(`${folder}/before/production-meter.json`, before);
const root = 'ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral';
const card = 'phy9-c2-s4-n111';
const outputs = await Promise.all(['lesson.json', 'exercises.json', 'figures.json',
  'adaptation.audit.json'].map(name => bind(`${root}/lessons/${card}/${name}`)));
await immutableWrite(output, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card, status: 'complete-unbatched-local-only',
  retention: await bind(retention), outputs,
  sourceTasks: 0, workedExamples: 0, newUnsolvedTasks: 0,
  completeDeliveredCardsUnchanged: 80,
  limits: 'Consumes existing independent SCI/figure/native/browser/body-pixel evidence and affected-heading PASS. No gate replay, new render/browser/image, commit/push, DB or formal handoff.',
}, null, 2)}\n`);
checkpoint.completeUnbatchedCards = [card];
checkpoint.modernReadyArtifacts = 81;
checkpoint.readyDoesNotMeanDelivered = '80 complete cards pushed;111 complete locally and unbatched, not an additional delivery.';
const target = checkpoint.nextBatch.targets.find(row => row.card === card);
assert.ok(target);
target.status = 'complete-unbatched-local-only';
target.readiness = await bind(output);
checkpoint.nextBatch.completeCards = [card];
checkpoint.nextBatch.completeCardClaim = false;
checkpoint.nextBatch.verification = '111 complete locally with retained original heading FAIL and separate repaired-heading PASS;113/114 frozen prose in independentSCI;316 source pages and186 source objects. Delivered80 unchanged.';
assert.deepEqual(await bytes(meterPath), before);
meter.updatedAt = new Date().toISOString();
await fs.writeFile(absolute(meterPath), `${JSON.stringify(meter, null, 2)}\n`);
console.log(JSON.stringify({ readiness: await bind(output), completeUnbatched: [card],
  deliveredUnchanged: 80 }));

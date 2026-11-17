import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  ticket, absolute, read, bytes, bind, verify, immutableWrite, exists,
} from './retain-d016-evidence.mjs';

const [execute, card] = process.argv.slice(2);
assert.equal(execute, '--execute');
assert.ok(['phy9-c2-s4-n113', 'phy9-c2-s5-n114'].includes(card));
const number = card.split('-').at(-1);
const output = `${ticket}/tmp/d031-${number}-ready/result.json`;
assert.ok(!await exists(output));
const retentionPath = `${ticket}/evidence/reports/d031-${number}-retention-manifest.json`;
const retention = await read(retentionPath);
assert.equal(retention.status, 'exact-complete-card-evidence-retained');
assert.equal(retention.card, card);
await verify(retention.pixels.path, retention.pixels.sha256);
assert.equal((await read(retention.pixels.path)).status, 'pass');
await verify(retention.native.path, retention.native.sha256);
const native = await read(retention.native.path);
for (const row of native.outputs) await verify(row.path, row.sha256);
const meterPath = `${ticket}/production-meter.json`;
const before = await bytes(meterPath);
const meter = JSON.parse(before);
const checkpoint = meter.currentCheckpoint;
assert.equal(checkpoint.completeDeliveredCards, 80);
assert.equal(checkpoint.sourcePagesFinalized, 316);
assert.equal(checkpoint.sourceWrittenExercises, 186);
assert.ok(!checkpoint.completeUnbatchedCards.includes(card));
await immutableWrite(`${ticket}/tmp/d031-${number}-ready/before/production-meter.json`, before);
await immutableWrite(output, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card, status: 'complete-unbatched-local-only',
  retention: await bind(retentionPath), outputs: native.outputs,
  workedExamples: number === 'n113' ? 2 : 0, sourceTasks: 0, newUnsolvedTasks: 0,
  completeDeliveredCardsUnchanged: 80,
  limits: 'Existing complete-card evidence consumed. No gate replay, DB, commit/push or formal handoff.',
}, null, 2)}\n`);
checkpoint.completeUnbatchedCards.push(card);
checkpoint.completeUnbatchedCards.sort();
checkpoint.modernReadyArtifacts = 80 + checkpoint.completeUnbatchedCards.length;
checkpoint.readyDoesNotMeanDelivered = `80 complete cards pushed;${checkpoint.completeUnbatchedCards.length} complete local cards await their ordinary batch commit/push.`;
const target = checkpoint.nextBatch.targets.find(row => row.card === card);
assert.ok(target);
target.status = 'complete-unbatched-local-only';
target.readiness = await bind(output);
if (target.figureProgress) target.figureProgress.fullCardComplete = true;
checkpoint.nextBatch.completeCards = [...checkpoint.completeUnbatchedCards];
checkpoint.nextBatch.completeCardClaim = false;
checkpoint.nextBatch.verification = 'Complete local cards consume exact retained passing stages; remaining targets stay in their recorded stages. Source316 pages/186 exercise objects and delivered80 unchanged.';
assert.deepEqual(await bytes(meterPath), before);
meter.updatedAt = new Date().toISOString();
await fs.writeFile(absolute(meterPath), `${JSON.stringify(meter, null, 2)}\n`);
console.log(JSON.stringify({ readiness: await bind(output),
  completeUnbatched: checkpoint.completeUnbatchedCards, deliveredUnchanged: 80 }));

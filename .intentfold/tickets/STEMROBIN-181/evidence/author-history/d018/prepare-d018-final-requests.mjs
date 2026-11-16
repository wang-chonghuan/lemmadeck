import assert from 'node:assert/strict';
import { ticket, exerciseCard, read, bind, immutableWrite } from './retain-d018-evidence.mjs';

const work = `${ticket}/tmp`;
const review = `${work}/d018-t7-screenshot-review.json`;
assert.equal((await read(review)).status, 'pass');
const interactionGates = await Promise.all([
  ['answers', 'd018-t7-answer-native-finalization.json'],
  ['choices', '9p-t7-choice-validation.json'],
].map(async ([surface, file]) => {
  const report = await bind(`${work}/${file}`);
  assert.equal((await read(report.path)).status, 'pass');
  return { card: exerciseCard, surface, report };
}));
await immutableWrite(`${work}/d018-combine-request.json`, `${JSON.stringify({
  batch: 'D018', final: true,
  t7: {
    result: await bind(`${work}/offline-d018/result-${exerciseCard}.json`),
    tiles: await bind(`${work}/offline-d018/d018-t7-screenshot-tiles.json`),
    review: await bind(review),
  },
  interactionGates,
}, null, 2)}\n`);
await immutableWrite(`${work}/d018-retention-composer-plan.json`, `${JSON.stringify({
  batch: 'D018', final: true,
  aliases: [], aliasManifests: [], extraEvidence: [],
  frozenReports: [], bindingReports: [], bindingProofs: [], outputReports: [],
}, null, 2)}\n`);
console.log('D018 explicit combine and retention composer requests ready; no gate or product write.');

import assert from 'node:assert/strict';
import {
  ticket, completeCards, excludedCard, inputsPath, blockerReportPath, finalResultPath,
  bind, read, immutableWrite,
} from './retain-d017-evidence.mjs';

const work = `${ticket}/tmp`;
const finalized = await read(`${work}/d017-finalization-binding.json`);
assert.equal(finalized.status, 'pass');
assert.deepEqual(finalized.cards.map(item => item.card), completeCards);
const extra = [
  'answer-review-9p-ex8-capture.json',
  'answer-review-9p-ex8-capture-promotion.json',
  'promote-ex8-book-answers.mjs',
  '9p-ex7-answer-capture/author-freeze.json',
  '9p-ex7-answer-capture/exercise8.candidate.json',
  '9p-ex7-answer-capture/snippets/exercise8.png',
  '9p-ex7-answer-capture/native/9p/answers.template.json',
  'prepare-d017-retention-inputs.mjs',
];
const input = {
  ticket: 'STEMROBIN-181',
  batch: 'D-017',
  completeCards: finalized.cards.map(item => ({ id: item.card, science: item.science })),
  excludedCards: [{ id: excludedCard, status: 'blocked', report: await bind(blockerReportPath) }],
  screens: {
    result: await bind(finalResultPath),
    tiles: await bind(`${work}/offline-d017/d017-screenshot-tiles.json`),
    review: await bind(`${work}/d017-screenshot-review.json`),
  },
  interactionGates: await Promise.all([
    ['answers', '9p-t4-answer-review.json'],
    ['choices', '9p-t4-choice-review.json'],
  ].map(async ([surface, report]) => ({
    card: excludedCard, surface, report: await bind(`${work}/${report}`),
  }))),
  extraEvidence: await Promise.all(extra.map(name => bind(`${work}/${name}`))),
  scope: 'Only58/59/61 complete. t4 valid stages and failed display retained without staging its modern card or101/102. Source156+ excluded.',
};
await immutableWrite(inputsPath, `${JSON.stringify(input, null, 2)}\n`);
console.log('D017 actual final retention inputs frozen; no reviews or product edits.');

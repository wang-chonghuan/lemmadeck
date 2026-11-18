import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  ticket, absolute, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`;
const folder = `${base}/d548-n75-source200-requirement-extension`;
const baseline = `${base}/d538-n75-preauthor-confirmed-source-requirements`;
await verify(`${baseline}/report.json`,
  '7d7e3baa08ab549567a51eae644783c2bdbfe7a86133889412e37565f333bbd8');
await verify(`${baseline}/freeze.json`,
  '78e6aaa992061f6c5306d70690c1f94d37c529240beaae110eee86a74a9f71b5');
const receiptPath = `${ticket}/evidence/reports/d547-source200-consumed-and-first-modern-figures.json`;
await verify(receiptPath, '414a9be73d1c45b07320822012cf5bee7b58853b3291903a0acdad10cf7f0b7e');
const receipt = await read(receiptPath);
assert.equal(receipt.source200.SOURCE, 'PASS');
assert.equal(receipt.source200.sourcePagesAdded, 1);
assert.equal(await exists(folder), false);
const pagePath = 'ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0200/page.json';
const page = await read(pagePath);
const pageBinding = receipt.outputs.find(row => row.path === pagePath);
assert.ok(pageBinding);
await verify(pagePath, pageBinding.sha256);
const blocks = page.blocks.map((block, index) => ({ ref: `p0200#${index}`, pointer: `/blocks/${index}`, ...block }));
const body = blocks.filter(row => row.kind === 'p');
assert.deepEqual(body.map(row => row.ref), ['p0200#3', 'p0200#5']);
assert.equal(body.at(-1).open, true);
const reportPath = `${folder}/report.json`;
await immutableWrite(reportPath, serialize({
  schema: 'STEMROBIN-181/n75-preauthor-source-requirement-extension@1',
  ticket: 'STEMROBIN-181', status: 'APPEND-ONLY-SOURCE200-REQUIREMENTS-NOT-MODERN-PASS',
  baseline: await bind(`${baseline}/source-requirements.json`),
  baselineReport: await bind(`${baseline}/report.json`),
  acceptedSourceReceipt: await bind(receiptPath), page: pageBinding,
  newlyAcceptedBlocks: blocks.filter(row => row.kind !== 'foot'),
  requirements: [
    {
      id: 'N75-R17', source_refs: ['p0199#13', 'p0200#3', 'p0200#0', 'p0200#4'],
      requirement: 'Join only the accepted literal 199/200 continuation. Preserve the source focal-plane statement: differently tilted parallel beams meet in the plane perpendicular to the principal axis through the principal focus, with fig172b. Retain the bold focal-plane name, the previously stated thin-lens/paraxial scope, and both subfigures without treating every arbitrary-angle/aperture ray as exactly concurrent.',
      new_refs: ['p0200#3', 'p0200#0', 'p0200#4'],
    },
    {
      id: 'N75-R18', source_refs: ['p0200#3', 'p0200#5', 'p0200#1', 'p0200#2', 'p0200#4'],
      requirement: 'Retain the reverse placement experiment: a luminous point at the lens focus, or another point in its focal plane, gives a parallel outgoing beam after refraction. Join the split 得/到 phrase across the transparent fig172 caption. Preserve fig173; distinguish a beam parallel internally from one necessarily parallel to the principal axis. Do not add unseen numerical distances or angles.',
    },
    {
      id: 'N75-R19', source_refs: ['p0200#5', 'p0200#6', 'p0200#7'],
      requirement: 'Preserve the unfinished statement about moving the source away from the lens. Its final words are 光线经过透镜. Keep the open tail. Fig174 is present but this page contains no prose reference to it; actual subsequent source must establish unique ownership. Neither the TOC nor proximity supplies a continuation or owner.',
    },
  ],
  continuation: {
    previousOpenRef: 'p0199#13', newlyObservedContinuationRef: 'p0200#3',
    currentOpenRef: 'p0200#5', currentTail: body.at(-1).lines.at(-1),
    fig174Owner: 'HOLD-PENDING-ACTUAL-SOURCE-REFERENCE',
    source201Or202NotReadOrInferred: true,
  },
  earlierBaselineNotRebuiltOrReReviewed: true, baselineHistoricalStatusesUnchanged: true,
  sourceReviewNotRepeated: true, newImages: 0, parentImageCount: 24,
  wholeN75SourceComplete: false, modernSCI: 'NOT-AUTHORED-OR-REVIEWED',
  modernZHEN: 'NOT-AUTHORED-OR-REVIEWED', FIG: 'NOT-REVIEWED', DISPLAY: 'NOT-REVIEWED',
  fullcard: false, completeCardsAdded: 0, sourcePagesAdded: 0,
}));
await fs.chmod(absolute(reportPath), 0o444);
console.log(JSON.stringify(await bind(reportPath)));

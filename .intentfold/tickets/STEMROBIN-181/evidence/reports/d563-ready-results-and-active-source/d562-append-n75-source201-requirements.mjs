import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  ticket, absolute, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`;
const folder = `${base}/d562-n75-source201-requirement-extension`;
const receiptPath = `${ticket}/evidence/reports/d558-source201-consumed-and-first-figure-records.json`;
await verify(receiptPath, 'f8b22b248abb6e7f0b093ae10945e5bc0af1a21185affcc6e9f2d969efe2d7ae');
const receipt = await read(receiptPath);
assert.equal(receipt.source201.SOURCE, 'PASS-SCOPED');
assert.equal(receipt.source201.sourcePagesAdded, 1);
assert.equal(await exists(folder), false);
const pagePath = 'ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0201/page.json';
const page = await read(pagePath);
const pageBinding = receipt.outputs.find(row => row.path === pagePath);
assert.ok(pageBinding);
await verify(pagePath, pageBinding.sha256);
const blocks = page.blocks.map((block, index) => ({
  ref: `p0201#${index + 1}`, pointer: `/blocks/${index}`, ...block,
}));
const body = blocks.filter(row => row.kind === 'p');
assert.equal(body[0].cont, true);
assert.ok(body.every(row => !row.open));
assert.deepEqual(body.map(row => row.ref), ['p0201#1', 'p0201#2', 'p0201#7', 'p0201#8', 'p0201#9']);
const reportPath = `${folder}/report.json`;
await immutableWrite(reportPath, serialize({
  schema: 'STEMROBIN-181/n75-preauthor-source-requirement-extension@1',
  ticket: 'STEMROBIN-181', status: 'APPEND-ONLY-SOURCE201-REQUIREMENTS-NOT-MODERN-PASS',
  baseline: await bind(`${base}/d552-n75-native-ref-adapter/source-requirements.native-refs.json`),
  source200Extension: await bind(`${base}/d552-n75-native-ref-adapter/source200-extension.native-refs.json`),
  acceptedSourceReceipt: await bind(receiptPath), page: pageBinding,
  referenceConvention: 'Native pNNNN#K is one-based; JSON /blocks/K is zero-based.',
  newlyAcceptedBlocks: blocks.filter(row => row.kind !== 'foot'),
  requirements: [
    {
      id: 'N75-R20', source_refs: ['p0200#6', 'p0201#1', 'p0200#7', 'p0200#8'],
      requirement: 'Join the actual open 200/201 continuation. Retain convergence to a real image for the source beyond the focus and divergence with a virtual image for a source closer than the focus, with both fig174a/b. State the inherited thin-lens/paraxial scope; distinguish actual ray intersection from back-extension intersection and do not claim a source at the focus forms a finite real image. Unique fig174 ownership is n75 from actual prose, not heading proximity.',
    },
    {
      id: 'N75-R21', source_refs: ['p0201#2', 'p0201#3', 'p0201#4', 'p0201#5', 'p0201#6'],
      requirement: 'Retain the diverging-lens experiment in its original order: fix the lens at the disk center, send rays parallel to the principal axis, observe outgoing divergence, and locate the principal focus by backward extensions. Preserve fig175 and both fig176a/b. Explain the source wording 它是虚像 as a virtual focus/image of the distant axial source, never an actual forward ray intersection. Retain the same-medium condition for the second virtual principal focus at equal distance on the opposite side. Do not invent source angles or unseen marker counts.',
    },
    {
      id: 'N75-R22', source_refs: ['p0201#7'],
      requirement: 'Retain the bold optical-power lead and definition: the reciprocal of focal length is optical power, symbol D, source formula D=1/F. Preserve the formula and distinguish the source use of F for a focus point and a length. Any modern signed-focal-length notation must be an explicit clarification consistently applied to both languages, not a correction to the faithful page or an implicit positive diverging power.',
    },
    {
      id: 'N75-R23', source_refs: ['p0201#8'],
      requirement: 'Retain the qualitative relation: closer foci mean stronger convergence or divergence and larger absolute optical power. Preserve the absolute-value qualification, rather than comparing signed negative diverging power as a monotonically greater number.',
    },
    {
      id: 'N75-R24', source_refs: ['p0201#9'],
      requirement: 'Retain dioptres as the optical-power unit and the source one-metre/one-dioptre example. State metres as the length unit when evaluating D=1/F. Preserve literal 屈光焦度 in the faithful snapshot; modern terminology may consistently use 光焦度/optical power without claiming a source erratum. No new worked exercise or invented source task.',
    },
  ],
  continuation: {
    previousOpenRef: 'p0200#6', newlyObservedContinuationRef: 'p0201#1',
    finalProseRef: 'p0201#9', finalTail: body.at(-1).lines.at(-1),
    fig174Owner: 'PASS-FIRST-ACTUAL-UNIQUE-N75-OWNER-CONSUMED',
    nextPageBoundary: 'PENDING-FIRST-INDEPENDENT-SOURCE202',
  },
  processQualificationRetained: receipt.source201.processQualificationRetained,
  earlierBaselineNotRebuiltOrReReviewed: true, historicalStatusesUnchanged: true,
  sourceReviewNotRepeated: true, newImages: 0, parentImageCount: 24,
  wholeN75SourceComplete: false, modernSCI: 'NOT-AUTHORED-OR-REVIEWED',
  modernZHEN: 'NOT-AUTHORED-OR-REVIEWED', FIG: 'NOT-REVIEWED', DISPLAY: 'NOT-REVIEWED',
  fullcard: false, completeCardsAdded: 0, sourcePagesAdded: 0,
}));
await fs.chmod(absolute(reportPath), 0o444);
console.log(JSON.stringify(await bind(reportPath)));

import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  ticket, absolute, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`;
const folder = `${base}/d573-n76-preauthor-source202-requirements`;
const reviewPath = `${base}/d560-source202-first-independent-review/report.json`;
await verify(reviewPath, '26be6ba4f2b576018b03e3807663fb026b9bd1117e6ed73a5167a2c8b9e1355e');
const review = await read(reviewPath);
assert.equal(review.gates.SOURCE202.status, 'PASS');
assert.equal(await exists(folder), false);
const pagePath = 'ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0202/page.json';
const page = await read(pagePath);
const blocks = page.blocks.map((block, index) => ({
  ref: `p0202#${index + 1}`, pointer: `/blocks/${index}`, ...block,
}));
assert.equal(blocks[0].lines.join(''), '76. 透镜成像作图法');
assert.equal(blocks[8].open, true);
await immutableWrite(`${folder}/source-blocks.json`, serialize({
  ticket: 'STEMROBIN-181', source: await bind(pagePath),
  acceptedReview: await bind(reviewPath), blocks,
  referenceConvention: 'Native refs one-based, JSON block pointers zero-based.',
}));
await immutableWrite(`${folder}/source-requirements.json`, serialize({
  schema: 'STEMROBIN-181/n76-preauthor-source-requirements@1',
  ticket: 'STEMROBIN-181', card: 'phy10-c2-s2-n76',
  status: 'FIRST-PREAUTHOR-ACCEPTED-SOURCE202-COVERAGE-ONLY',
  sourceBlocks: await bind(`${folder}/source-blocks.json`),
  requirements: [
    {
      id: 'N76-R01', source_refs: ['p0202#1'],
      requirement: 'Retain the actual numbered heading 76. 透镜成像作图法. No preceding n75 prose belongs to this new unit.',
    },
    {
      id: 'N76-R02', source_refs: ['p0202#2', 'p0202#3', 'p0202#4', 'p0202#5', 'p0202#6'],
      requirement: 'Retain that focal positions specify the elementary thin-lens model and that object distance and focal length determine image distance without tracing the internal path or drawing the exact spherical surfaces. Preserve the separate converging/diverging symbols in fig177 and fig178 and their caption objects. Literal 图.178 remains in faithful source; modern wording may normalize the reference. Do not infer exact focal-marker fill, arrows, point coordinates or lens dimensions from prose; the image author independently inventories actual source pixels.',
    },
    {
      id: 'N76-R03', source_refs: ['p0202#7'],
      requirement: 'Retain point-to-point imaging and hence imaging of the whole object, including the original italic statement. Carry the inherited thin-lens/paraxial approximation and distinguish actual-ray intersections from backward-extension virtual images where necessary; do not approve exact concurrency for all unrestricted rays or silently exclude virtual images from the model.',
    },
    {
      id: 'N76-R04', source_refs: ['p0202#8'],
      requirement: 'Retain the original set of three special converging-lens rays and each distinct rule: a ray parallel to the principal axis refracts through the far focus; a ray through the near focus emerges parallel to the principal axis by reversibility; a ray through the optical center retains its direction with a small translation, neglected in the thin-lens approximation. Preserve known foci and optical-center context. Do not turn the real-lens small translation into exact zero or interchange the near and far focus.',
    },
    {
      id: 'N76-R05', source_refs: ['p0202#9'],
      requirement: 'Retain the start of constructing the image of AB in fig179, selecting A and sending AC parallel to the principal axis so its refracted continuation passes through the focus. The source ends at 使 with open=true. Do not complete the second ray, claim fig179 source fidelity, or close n76 until actual newly accepted continuation and right-boundary evidence are available.',
    },
  ],
  knownFigureReferences: ['fig-177', 'fig-178', 'fig-179'],
  localSourceFigureObjects: ['fig-177', 'fig-178'],
  rightmostRef: 'p0202#9', rightmostTail: blocks[8].lines.at(-1), open: true,
  source203ContentNotReadOrGuessed: true, source204BoundaryNotInferred: true,
  appendOnlyForNewlyAcceptedSource: true, modernDraftsNotRead: true,
  SCI: 'NOT-AUTHORED-OR-REVIEWED', ZHEN: 'NOT-AUTHORED-OR-REVIEWED',
  FIG: 'PENDING-FIRST-MODERN-AUTHOR', DISPLAY: 'NOT-RUN',
  imageOpens: 0, parentImageCount: 24, oldBudgetReset: false, fullcard: false,
}));
const reportPath = `${folder}/report.json`;
await immutableWrite(reportPath, serialize({
  ticket: 'STEMROBIN-181', status: 'FIRST-N76-SOURCE202-PREAUTHOR-REQUIREMENTS-FROZEN',
  sourceBlocks: await bind(`${folder}/source-blocks.json`),
  requirements: await bind(`${folder}/source-requirements.json`),
  acceptedReview: await bind(reviewPath), firstRequirements: 5,
  newParentImages: 0, previousPASSReviewsRepeated: 0, sourcePagesAdded: 0,
  completeCardsAdded: 0, historicalFAILHOLDPreserved: true,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeploy: false,
}));
for (const file of ['source-blocks.json', 'source-requirements.json', 'report.json']) {
  await fs.chmod(absolute(`${folder}/${file}`), 0o444);
}
console.log(JSON.stringify(await bind(reportPath)));

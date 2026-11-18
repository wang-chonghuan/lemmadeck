import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  ticket, absolute, bytes, read, bind, verify, exists, immutableWrite, walk,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`;
const folder = `${base}/d591-n77-preauthor-source204-requirements`;
const reviewPath = `${base}/d575-source204-first-independent-review/report.json`;
await verify(reviewPath, '000a788b79fec1d627e7ddc9336bc3d04b32b944caf8cb310ac35cc11440bf33');
const review = await read(reviewPath);
assert.equal(review.gates.SOURCE204.status, 'PASS');
assert.deepEqual(review.gates.SOURCE204.blocking_list, []);
assert.equal(await exists(folder), false);
const pagePath = 'ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0204/page.json';
await verify(pagePath, '8dc12b02ea24152edb7a3d76d2c63069b9e401aa3df0d9d7203ade0b64ce3fbd');
const page = await read(pagePath);
const blocks = page.blocks.map((block, index) => ({
  ref: `p0204#${index + 1}`, pointer: `/blocks/${index}`, ...block,
}));
await immutableWrite(`${folder}/source-page.json`, await bytes(pagePath));
await immutableWrite(`${folder}/source-blocks.json`, serialize({
  schema: 'STEMROBIN-181/accepted-preauthor-source-blocks@1',
  page: await bind(pagePath), acceptedReview: await bind(reviewPath), blocks,
  referenceConvention: 'Native refs one-based; JSON pointers zero-based.',
}));
const requirementsPath = `${folder}/source-requirements.json`;
await immutableWrite(requirementsPath, serialize({
  schema: 'STEMROBIN-181/n77-preauthor-source-requirements@1',
  ticket: 'STEMROBIN-181', card: 'phy10-c2-s2-n77',
  status: 'FIRST-PREAUTHOR-ACCEPTED-SOURCE204-COVERAGE-ONLY',
  sourceBlocks: await bind(`${folder}/source-blocks.json`),
  requirements: [
    {
      id: 'N77-R01', source_refs: ['p0204#1'],
      requirement: 'Retain actual section77 and both title topics: thin-lens formula and lens magnification. No preceding n76 body enters this unit. Do not declare the magnification topic complete before actual accepted continuation.',
    },
    {
      id: 'N77-R02', source_refs: ['p0204#2'],
      requirement: 'Retain the three distinct variables: object-to-lens distance d, image-to-lens distance f, and focal length F. State their thin-lens/paraxial context. Never interchange lower-case f with capital F; any necessary modern signed convention must be explicit and consistent with subsequent accepted source, not guessed before that source arrives.',
    },
    {
      id: 'N77-R03', source_refs: ['p0204#3'],
      requirement: 'Retain the fig179-bound derivation from similar triangles ABF and DOF, with |OD|/|AB|=|OF|/|BF|, |OD|=|A_1B_1|, and numbered (6.15): |A_1B_1|/|AB|=|OF|/|BF|=F/(d-F). Keep all absolute-value pairs, subscripts, original numerator/denominator, and the distinct points. An independent image inventory, not the prose, establishes the actual point/ray layout.',
    },
    {
      id: 'N77-R04', source_refs: ['p0204#3'],
      requirement: 'Retain the second similarity COF with A_1B_1F, |A_1B_1|/|OC|=|B_1F|/|OF|, |OC|=|AB|, and numbered (6.16): |A_1B_1|/|AB|=(f-F)/F. Distinguish lower-case image distance f from focal length F and retain all absolute values and subscripts.',
    },
    {
      id: 'N77-R05', source_refs: ['p0204#3'],
      requirement: 'Retain equating the right sides of (6.15)/(6.16), F/(d-F)=(f-F)/F, then F^2=fd-fF-Fd+F^2, fF+Fd=fd, and division by Ffd. Preserve original formula tokens and their order; modern explanatory wording must make the converging-real-image construction and nonzero denominators clear without treating this diagram as all possible signed-image cases.',
    },
    {
      id: 'N77-R06', source_refs: ['p0204#3'],
      requirement: 'Retain numbered (6.17), 1/d+1/f=1/F, and (6.18), 1/d+1/f=D. Do not add a completed magnification formula or a missing continuation from memory. Future statements about virtual image distance, diverging-lens focal length, optical power and magnification require actual accepted continuation and explicit modern sign conventions.',
    },
  ],
  knownFigureReferences: ['fig-179'], localSourceFigureObjects: [],
  rightmostRef: 'p0204#3', rightmostTail: blocks[2].lines.at(-1),
  open: blocks[2].open,
  source204205Join: 'FIRST-INDEPENDENT-PENDING; original open=true preserved',
  source205IndependentNotAssumed: true, source206ContentNotReadOrGuessed: true,
  appendOnlyForNewlyAcceptedSource: true, modernDraftsNotRead: true,
  SCI: 'NOT-AUTHORED-OR-REVIEWED', ZHEN: 'NOT-AUTHORED-OR-REVIEWED',
  FIG: 'PENDING-SHARED-FIG179-FIRST-MODERN-REVIEW', DISPLAY: 'NOT-RUN',
  imageOpens: 0, parentImageCount: 24, oldBudgetReset: false, fullcard: false,
}));
await immutableWrite(`${folder}/report.json`, serialize({
  ticket: 'STEMROBIN-181', card: 'phy10-c2-s2-n77',
  status: 'FIRST-ACCEPTED-SOURCE204-PREAUTHOR-REQUIREMENTS-FROZEN-NOT-CARD-PASS',
  requirements: await bind(requirementsPath), source: await bind(pagePath),
  review: await bind(reviewPath), sourceQuestions: 0,
  incompleteMagnificationAndRightBoundaryRetained: true,
  noSourceOrModernEdits: true, imageOpens: 0, fullcard: false,
}));
for (const file of await walk(folder)) await fs.chmod(absolute(file), 0o444);
console.log(JSON.stringify({
  requirements: await bind(requirementsPath), report: await bind(`${folder}/report.json`),
}));

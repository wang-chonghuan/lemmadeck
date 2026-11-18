import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const output = path.dirname(fileURLToPath(import.meta.url));
const planPath = path.join(root, '.intentfold/tickets/STEMROBIN-181/evidence/reports/d339-t18-first-display-progress.json');
const planSha256 = '65564acc9947d2b8e46a818685f2f31177cca4840f21a7e3979730274be70552';
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const bind = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size });
const save = (name, value) => fs.writeFileSync(path.join(output, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });

if (hash(planPath) !== planSha256) throw new Error('Frozen plan hash mismatch');
const batch = JSON.parse(fs.readFileSync(planPath, 'utf8')).pendingBatches[8];
if (batch.batch !== 10 || batch.tiles.length !== 8) throw new Error('Wrong batch selection');
const tiles = batch.tiles.map((tile, index) => {
  const absolute = path.resolve(root, tile.path);
  const bytes = fs.readFileSync(absolute);
  if (!absolute.endsWith(`en-answers-390-sheet-${String(index + 1).padStart(3, '0')}.png`)) throw new Error('Wrong tile order');
  if (hash(absolute) !== tile.sha256) throw new Error('Tile hash mismatch');
  if (!bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) || bytes.toString('ascii', 12, 16) !== 'IHDR') {
    throw new Error('Invalid PNG header');
  }
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  if (width !== 390 || height !== 844 || width !== tile.crop.width || height !== tile.crop.height) {
    throw new Error('PNG dimensions mismatch');
  }
  return { ordinal: index + 1, path: absolute, sha256: tile.sha256, width, height, bytes: bytes.length, crop: tile.crop };
});

// These observations were authored only after the eight successful original pixel loads.
const pixelObservations = [
  {
    tile: '001',
    visibleContent: 'Two-line Exercise 14 - Written Questions and Standard Answers heading; question 2; expanded Standard answer and its vacuum/metal discussion.',
    text: 'Heading wraps cleanly into two lines. Question and answer prose are sharp and legible, with consistent line spacing and no colliding lines.',
    formulas: 'The vector E, charge -e with e > 0, mass m_e, inline acceleration expression, and s_vac distance fraction have visible vector marks, subscripts, superscript 2 and fraction bars. They stay inside the prose column and do not overlap adjacent text.',
    units: 'No explicit measurement-unit expression is visible in this tile; mathematical variables are distinct from prose.',
    slicingSeams: {
      top: 'Document heading and its top margin are intact; no seam cuts the heading.',
      bottom: 'The next prose line beginning entire time ... is visibly cut by the bottom tile boundary. Tile 002 supplies the same continued line at its top. This is a fixed slice seam, not evidence of product-side clipping.',
    },
  },
  {
    tile: '002',
    visibleContent: 'Continuation and ending of question 2 answer; horizontal separator; question 3 and the beginning of its expanded Standard answer.',
    text: 'Prose remains legible and contained. The section separator, question 3 and answer label are distinct, with no overlap or blank answer region.',
    formulas: 'No displayed formula or complex mathematical expression is visible.',
    units: 'No numerical measurement unit is visible.',
    slicingSeams: {
      top: 'Upper strokes of the continued entire time ... line meet the top boundary, matching the line cut at the bottom of 001.',
      bottom: 'The answer continues after the visible applies, the solvent’s viscous resistance line. Tile 003 starts the following generally decreases line. This is text continuing across slices, not a product crop.',
    },
  },
  {
    tile: '003',
    visibleContent: 'Continuation of question 3 answer, including the conductivity expression; separator and beginning of question 4 at the bottom.',
    text: 'The paragraphs and lower separator are crisp. Ordinary words wrap within the visible right boundary; the prose around the formula is not displaced into other lines.',
    formulas: 'The sigma expression with summation, n_i, absolute-value bars around q_i and mu_i is legible. The summation’s small subscript and the prose definitions remain separate from surrounding lines.',
    units: 'No explicit numerical measurement unit is visible.',
    slicingSeams: {
      top: 'Starts with the intact generally decreases continuation from 002.',
      bottom: 'The second line of question 4, beginning electroplate the inner surface of a hollow ..., is cut at the lower tile edge and continues at the top of 004.',
    },
  },
  {
    tile: '004',
    visibleContent: 'Continuation of question 4, expanded Standard answer, and paragraphs about the cathode, anode and cavity arrangement.',
    text: 'The question continuation, answer label and long paragraphs are readable, with stable margins and no line overlap. The visible DC abbreviation is rendered as ordinary clear text.',
    formulas: 'No displayed formula is visible.',
    units: 'No explicit numerical measurement unit is visible; DC is an abbreviation, not treated here as a unit.',
    slicingSeams: {
      top: 'The top boundary cuts the upper portion of the question line continuing from 003; the following metal object by electrolysis? line is intact.',
      bottom: 'The answer reaches but this arrangement alone does not and continues with guarantee ... in 005. The text crossing is a slice boundary, not a product-side truncation.',
    },
  },
  {
    tile: '005',
    visibleContent: 'Ending of question 4 answer; separator; question 5 and most of the first portion of its expanded Standard answer.',
    text: 'The ending paragraph, separator, wrapped question and answer label are all legible. Answer paragraphs fit the column without crowding or large unexplained blank areas.',
    formulas: 'No substantial formula is visible in the tile interior; the next formula-bearing line continues in 006.',
    units: 'The ordinary prose word moles is readable; no numerical unit expression is visible.',
    slicingSeams: {
      top: 'The intact guarantee ... line continues the previous tile’s sentence.',
      bottom: 'The prose ends near the boundary with through each cell during the same interval. The formula-bearing Faraday’s law line lies across the 005/006 seam; its readable portion is in 006. Boundary content is not used to infer product clipping.',
    },
  },
  {
    tile: '006',
    visibleContent: 'Continuation of question 5 answer: Faraday’s law expressions, equal-current discussion and qualifications; final cell. line at the bottom.',
    text: 'The long prose block remains sharp and regularly spaced. The concluding cell. is visible; no blank or damaged interior region is present.',
    formulas: 'The visible expressions m = kQ, Q = It and m = kIt are readable and fit inline. Their symbols are not superimposed on prose or neighboring lines.',
    units: 'No explicit numerical measurement-unit expression is visible.',
    slicingSeams: {
      top: 'The Faraday’s law formula-bearing row sits at the top boundary; its uppermost strokes are seam-limited. The visible equation body is readable. This boundary is recorded separately from product cropping.',
      bottom: 'The last cell. line is intact near the bottom; tile 007 begins a separated new question rather than a cut continuation of that word.',
    },
  },
  {
    tile: '007',
    visibleContent: 'Question 6, expanded Standard answer, current expression, and start of the following explanatory paragraph.',
    text: 'The question, answer label and explanatory prose are readable. Numerals in the question are distinct and remain inside the text column.',
    formulas: 'The displayed I = (3 C + 2 C)/(1 s) = 5 A expression has a clean fraction bar, readable numerator and denominator, and clear equality signs, without collision with paragraphs above or below.',
    units: 'C, s and A are visibly readable and separated from their numerals; coulombs, second and amperes in the prose are clear.',
    slicingSeams: {
      top: 'A separator and question start have intact margins; no clipped glyph is visible at the top.',
      bottom: 'The paragraph reaches current equal to the total current inside the and continues with cell. in 008. It is a sentence crossing a tile seam, not observed product truncation.',
    },
  },
  {
    tile: '008',
    visibleContent: 'Ending of question 6 answer; separator; question 7, expanded Standard answer and its electrolyte discussion.',
    text: 'The continued sentence, wrapped question 7 and answer paragraphs are crisp and well separated. The lower line external field causes the existing ions to drift. is visible and readable.',
    formulas: 'No displayed formula is visible.',
    units: 'The prose references to 5 amperes are clear and complete; there is no unit glyph collision.',
    slicingSeams: {
      top: 'The intact cell. continuation completes the previous tile’s sentence.',
      bottom: 'The visible drift. line is intact. Question 7’s further answer content beyond this tile was not opened and is not assessed or claimed complete.',
    },
  },
];

const actualOpens = tiles.map(tile => ({
  path: tile.path,
  sha256: tile.sha256,
  detail: 'original',
  successfulPixelLoad: true,
  openCount: 1,
}));
const totals = {
  thisBatch: 8,
  previousImages: 8,
  cumulativeImages: 16,
  contextMaximum: 24,
  cumulative: '16/24',
  batchMaximum: 8,
  reopens: 0,
  budgetReset: false,
  compactionClearsImages: false,
};
const recordedUtc = new Date().toISOString();
save('actual-opens.json', {
  schema: 'bounded-first-display/actual-opens@1',
  ticket: 'STEMROBIN-181',
  batch: 10,
  directory: output,
  scopeSelection: 'pendingBatches[8].tiles',
  tool: 'functions.view_image',
  actualOpens,
  totals,
  recordedUtc,
});
save('report.json', {
  schema: 'bounded-first-display/pixel-report@1',
  ticket: 'STEMROBIN-181',
  task: 't18 English mobile readonly written answers first display',
  batch: 10,
  status: 'BATCH10-PIXEL-OBSERVED-SCOPE-LIMITED-FULL-GATES-HOLD',
  scope: {
    plan: { path: planPath, sha256: planSha256 },
    selection: 'pendingBatches[8].tiles',
    surface: 'en-answers-390',
    language: 'en',
    viewport: { width: 390, height: 844 },
    selectedTiles: 'en-answers-390-sheet-001.png through en-answers-390-sheet-008.png',
    selectedPixelExtentY: [0, 6752],
    onlyTheseTilesViewed: true,
    parentCaptureOpened: false,
    source182OrEarlierImagesReopened: false,
    answerKeysOrDraftsRead: false,
  },
  verification: {
    planSha256Matched: true,
    allEightPathsAndSha256Matched: true,
    pngHeadersAndDimensionsMatched: true,
    dimensions: '390x844 for every tile',
    observedUsing: 'Eight successful functions.view_image calls, each detail original and openCount 1',
    pixelJudgmentNotDom: true,
  },
  observations: pixelObservations.map((observation, index) => ({
    ...observation,
    path: tiles[index].path,
    sha256: tiles[index].sha256,
    pngDimensions: { width: tiles[index].width, height: tiles[index].height },
    inputCropFromPlan: tiles[index].crop,
    result: 'VISIBLE-CONTENT-CLEAR; SLICE-SEAMS-RECORDED-SEPARATELY',
    interior: {
      unexpectedBlank: false,
      imageDamageObserved: false,
      overlapObserved: false,
      productClippingObserved: false,
      horizontalOverflowObserved: false,
    },
    limitation: 'Judgment covers only visible pixels in this tile, not unseen continuation, DOM behavior, answer correctness or scientific approval.',
  })),
  summary: {
    selectedTilesObserved: 8,
    visibleTextFormulasAndUnits: 'Readable in the selected tile interiors; formulas near fixed slicing boundaries are described separately.',
    productDisplayDefectsObservedInSelectedTiles: [],
    slicingSeams: 'Fixed tile boundaries cut some text rows at 001/002, 003/004 and 005/006; they are not treated as product cropping. Sentence continuations are separately recorded per tile.',
    noFullDisplayClaim: true,
    noCompleteCardClaim: true,
  },
  preservedHolds: {
    sourceSubset: { covered: 14, total: 16, status: 'SUBSET-ONLY-HOLD-UNCHANGED' },
    question1: 'HOLD-UNCHANGED',
    question9: 'HOLD-UNCHANGED',
    conditions: 'HOLD-UNCHANGED',
    fullGate2: 'HOLD-NOT-PASS',
    fullDISPLAY: 'HOLD-NOT-PASS',
    completeCard: 'HOLD-NOT-PASS',
    scientificReview: 'NOT-REPEATED-UNCHANGED',
    unseenTilesAndContinuation: 'NOT-OBSERVED',
  },
  actualOpens: bind(path.join(output, 'actual-opens.json')),
  totals,
  restrictions: {
    outputOnlyInNewDirectory: output,
    noOtherBytesChangedByThisBatch: true,
    noIndexOrMeterUpdates: true,
    noScreenshotsBrowserRenderCropResizeNativeOrGeneration: true,
    noNewAgentsChatsWorkersOrWorktrees: true,
    noDbGitCommitPushOrCleanup: true,
    imagesReturnedToParent: false,
    stopAfterThisBatch: true,
  },
  recordedUtc,
});
save('output-frozen-manifest.json', {
  schema: 'bounded-first-display/frozen-output@1',
  ticket: 'STEMROBIN-181',
  batch: 10,
  outputDirectory: output,
  scopeSelection: 'pendingBatches[8].tiles',
  plan: { path: planPath, sha256: planSha256 },
  inputs: tiles.map(tile => ({
    path: tile.path, sha256: tile.sha256, width: tile.width, height: tile.height,
    bytes: tile.bytes, unchangedAtFreeze: true,
  })),
  outputs: ['report.json', 'actual-opens.json', 'freeze.mjs'].map(name => bind(path.join(output, name))),
  mode: '0444',
  totals,
  fullGate2: 'HOLD-NOT-PASS',
  fullDISPLAY: 'HOLD-NOT-PASS',
  completeCard: 'HOLD-NOT-PASS',
  selfHash: 'Excluded from self inventory to avoid circular hashing; returned separately',
  recordedUtc,
});
for (const name of fs.readdirSync(output)) {
  const p = path.join(output, name);
  if (!fs.lstatSync(p).isFile()) throw new Error(`Unexpected non-file in output: ${p}`);
  fs.chmodSync(p, 0o444);
}
const frozen = JSON.parse(fs.readFileSync(path.join(output, 'output-frozen-manifest.json'), 'utf8'));
for (const entry of [...frozen.inputs, ...frozen.outputs]) {
  if (hash(entry.path) !== entry.sha256) throw new Error('Frozen hash mismatch');
}
for (const name of fs.readdirSync(output)) {
  if ((fs.statSync(path.join(output, name)).mode & 0o777) !== 0o444) throw new Error('Wrong output mode');
}
console.log(JSON.stringify({
  outputs: ['report.json', 'actual-opens.json', 'output-frozen-manifest.json'].map(name => bind(path.join(output, name))),
  totals,
  frozen0444: true,
  completeCard: 'HOLD',
}, null, 2));

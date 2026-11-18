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
const batch = JSON.parse(fs.readFileSync(planPath, 'utf8')).pendingBatches[9];
if (batch.batch !== 11 || batch.tiles.length !== 8) throw new Error('Wrong batch selection');
const tiles = batch.tiles.map((tile, index) => {
  const absolute = path.resolve(root, tile.path);
  const bytes = fs.readFileSync(absolute);
  if (!absolute.endsWith(`en-answers-390-sheet-${String(index + 9).padStart(3, '0')}.png`)) throw new Error('Wrong tile order');
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

// Authored after exactly eight successful original pixel loads; no further image calls.
const pixelObservations = [
  {
    tile: '009',
    visibleContent: 'Continuation and ending of question 7 answer about gas ionization; separator; question 8 about cooling the carbon rods begins below.',
    text: 'Prose is crisp and regularly spaced. The carrier- line wrap is legible. The separator clearly distinguishes the ending answer from question 8, whose question lines fit inside the margins.',
    formulas: 'No displayed formula or complex mathematical expression is visible.',
    units: 'No numerical measurement-unit expression is visible.',
    slicingSeams: {
      top: 'The visible Gas ionization ... line is intact. This continues the prior batch by text composition only; tile 008 was not reopened.',
      bottom: 'The question reaches What happens when the carbon rod of the near the lower boundary; 010 continues with positive electrode is cooled?. This is a sentence crossing a fixed tile seam, not observed product clipping.',
    },
  },
  {
    tile: '010',
    visibleContent: 'Question 8 continuation, expanded Standard answer, and separate Negative carbon rod and Positive carbon rod prose sections.',
    text: 'The question continuation and answer label are legible. Both labelled prose sections wrap cleanly. The larger vertical gap between the negative and positive sections clearly separates them and is not an unexplained blank or damaged area.',
    formulas: 'No displayed formula is visible; the DC abbreviation is clear ordinary text.',
    units: 'No explicit numerical measurement unit is visible; DC is not treated as a unit.',
    slicingSeams: {
      top: 'Starts with the intact positive electrode is cooled? continuation from 009.',
      bottom: 'The sentence reaches extinguish the arc, so anode cooling is not and continues with always harmless. in 011. It crosses the tile boundary without evidence of product-side truncation.',
    },
  },
  {
    tile: '011',
    visibleContent: 'Ending of question 8 answer, including a separate contrast paragraph; separator; question 10 and the beginning of its expanded Standard answer about a candle flame.',
    text: 'The answer-ending paragraph, separator, wrapped question 10, Why? line and Standard answer label are well separated. Prose stays legible and within the visible right margin.',
    formulas: 'No displayed formula or complex mathematical expression is visible.',
    units: 'No explicit numerical measurement unit is visible.',
    slicingSeams: {
      top: 'The continued always harmless. line meets the upper slice boundary; it is described as a seam, not product cropping.',
      bottom: 'The answer continues through the net negative-electrode-directed flow and deformation wording at the lower boundary; 012 begins the next continuation produced by charge transport .... Boundary-adjacent prose is not treated as a product display defect.',
    },
  },
  {
    tile: '012',
    visibleContent: 'Continuation and ending of question 10 answer; separator; question 11 about evacuation of cathode-ray and vacuum tubes, followed by its expanded Standard answer.',
    text: 'Paragraphs are crisp, with a clear gap before the This does not ... paragraph. The separator and question/answer division are visible. Long words and hyphenated terms wrap within the column without collision.',
    formulas: 'No displayed formula is visible.',
    units: 'No explicit numerical measurement unit is visible.',
    slicingSeams: {
      top: 'The intact produced by charge transport ... line continues the previous tile.',
      bottom: 'The answer reaches electron beam reach the screen or target near the bottom; 013 continues with along the electrically controlled path .... This is a sentence continuation across slices, not product clipping.',
    },
  },
  {
    tile: '013',
    visibleContent: 'Continuation and ending of question 11 answer; separator; question 12 about mobile charge carriers in a pure semiconductor, followed by its expanded Standard answer.',
    text: 'The vacuum discussion, question 12 and answer label are sharp and well spaced. The particle- line wrap is legible and does not cross the right margin. No blank or damaged interior region is visible.',
    formulas: 'No displayed formula or complex mathematical expression is visible.',
    units: 'The prose word pressure is visible, but no numerical pressure value or measurement-unit expression appears.',
    slicingSeams: {
      top: 'The intact along the electrically controlled path ... line continues 012.',
      bottom: 'The line beginning band. Exciting an electron from the valence is cut at the bottom edge and continues at the upper boundary of 014. This is a fixed slicing seam, not a product crop.',
    },
  },
  {
    tile: '014',
    visibleContent: 'Continuation and ending of question 12 answer, including n = p; separator; question 13 and the beginning of its expanded Standard answer.',
    text: 'The semiconductor prose, separator, question 13 and answer label are legible and distinct. The question occupies two clean lines; the following answer has normal paragraph spacing.',
    formulas: 'The inline n = p expression is clearly readable, with distinct italic variables and equality sign. It fits beside the prose without overlap or horizontal overflow.',
    units: 'No numerical measurement-unit expression is visible; the prose absolute-zero wording is readable.',
    slicingSeams: {
      top: 'The band. Exciting an electron from the valence line is cut across the top edge, matching the lower edge of 013.',
      bottom: 'The visible answer reaches usual semiconductor band description, a and continues with conduction-band electron ... in 015. The sentence continuation is a tile seam rather than observed product truncation.',
    },
  },
  {
    tile: '015',
    visibleContent: 'Continuation and ending of question 13 answer about recombination; separator; beginning of question 14 near the bottom.',
    text: 'The two answer paragraphs are sharp and comfortably spaced. Hyphenated conduction-band and valence-band terms are legible. The ending carriers. line and separator clearly precede question 14.',
    formulas: 'No displayed formula or complex mathematical expression is visible.',
    units: 'No numerical measurement-unit expression is visible.',
    slicingSeams: {
      top: 'The intact conduction-band electron ... line continues 014.',
      bottom: 'Question 14 begins directly at the lower boundary, where its first line meets the slice edge. Tile 016 shows the remaining question below the seam; edge-limited strokes are not recorded as product clipping.',
    },
  },
  {
    tile: '016',
    visibleContent: 'Continuation of question 14 about chemical purity; expanded Standard answer and its paragraphs on impurities, starting material and controlled doping.',
    text: 'The remaining question lines, Standard answer label and long answer are crisp and contained. Paragraph spacing is consistent; the lower visible contamination, not to confuse intentional line is readable without collision.',
    formulas: 'No displayed formula or complex mathematical expression is visible.',
    units: 'No numerical measurement-unit expression is visible.',
    slicingSeams: {
      top: 'A tiny residual stroke is visible at the very upper edge from the boundary-adjacent prior question row; the semiconductor devices ... and chemical purity? lines below are intact. This is recorded as a fixed slice seam.',
      bottom: 'The answer continues beyond contamination, not to confuse intentional. Tile 017 and all later tiles were not read, so the continuation and completeness are not assessed.',
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
  previousImages: 16,
  cumulativeImages: 24,
  contextMaximum: 24,
  cumulative: '24/24',
  batchMaximum: 8,
  reopens: 0,
  budgetReset: false,
  compactionClearsImages: false,
  remainingImageOpens: 0,
  imageLimitReached: true,
  noFurtherImageReads: true,
};
const recordedUtc = new Date().toISOString();
save('actual-opens.json', {
  schema: 'bounded-first-display/actual-opens@1',
  ticket: 'STEMROBIN-181',
  batch: 11,
  directory: output,
  scopeSelection: 'pendingBatches[9].tiles',
  tool: 'functions.view_image',
  actualOpens,
  totals,
  recordedUtc,
});
save('report.json', {
  schema: 'bounded-first-display/pixel-report@1',
  ticket: 'STEMROBIN-181',
  task: 't18 English mobile readonly written answers first display',
  batch: 11,
  status: 'BATCH11-PIXEL-OBSERVED-SCOPE-LIMITED-FULL-GATES-HOLD',
  scope: {
    plan: { path: planPath, sha256: planSha256 },
    selection: 'pendingBatches[9].tiles',
    surface: 'en-answers-390',
    language: 'en',
    viewport: { width: 390, height: 844 },
    selectedTiles: 'en-answers-390-sheet-009.png through en-answers-390-sheet-016.png',
    selectedPixelExtentY: [6752, 13504],
    onlyTheseTilesViewed: true,
    parentCaptureOpened: false,
    source182OrEarlierImagesReopened: false,
    historicalImagesReopened: false,
    tiles001to008Reopened: false,
    tiles017to021Opened: false,
    answerKeysOrDraftsRead: false,
    priorBatchComposition: 'User-accepted d365 batch10 visible PASS is carried as text only; no reobservation or gate expansion.',
  },
  verification: {
    planSha256Matched: true,
    allEightPathsAndSha256Matched: true,
    pngHeadersAndDimensionsMatched: true,
    dimensions: '390x844 for every tile',
    observedUsing: 'Eight successful functions.view_image calls, each detail original and openCount 1, after path/hash/PNG-header checks',
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
    visibleTextFormulasAndUnits: 'Visible prose and section divisions are clear. The n = p expression is readable; no numerical measurement-unit expression appears in these selected tiles.',
    productDisplayDefectsObservedInSelectedTiles: [],
    slicingSeams: 'Sentence continuations and boundary-limited rows are recorded separately per tile, including the visible 013/014 and 015/016 cuts. They are not promoted to product-clipping findings.',
    noFullDisplayClaim: true,
    noCompleteCardClaim: true,
    noFurtherImageReads: true,
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
    unseenTilesAndContinuation: '017-021-NOT-OBSERVED-BY-THIS-AGENT',
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
    stopAllImageReadsAt24: true,
  },
  recordedUtc,
});
save('output-frozen-manifest.json', {
  schema: 'bounded-first-display/frozen-output@1',
  ticket: 'STEMROBIN-181',
  batch: 11,
  outputDirectory: output,
  scopeSelection: 'pendingBatches[9].tiles',
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

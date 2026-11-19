import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const O = path.join(R, '.intentfold/tickets/STEMROBIN-181/tmp/d861-source234-two-spaces-crop-affected-review');
assert.equal(process.cwd(), R);
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const info = p => {
  const b = fs.readFileSync(p);
  return { path: p, bytes: b.length, sha256: sha(b) };
};
const read = name => JSON.parse(fs.readFileSync(path.join(O, name), 'utf8'));
const write = (name, value) => fs.writeFileSync(path.join(O, name),
  JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const inputs = read('inputhashes.json');
const text = read('text-contract-findings.json');
const pixels = read('pixel-inspection.json');
const speck = read('svg-speck-inspection.json');
const rechecks = inputs.inputs.map(expected => {
  assert.ok(expected.path.startsWith(`${R}/`));
  const actual = info(expected.path);
  return { ...actual, matchesStart: actual.sha256 === expected.sha256 && actual.bytes === expected.bytes };
});
assert.ok(rechecks.every(x => x.matchesStart), 'Frozen input drift: do not issue PASS');
assert.equal(text.status, 'PASS');
assert.equal(pixels.status, 'PASS');
assert.equal(speck.status, 'PASS');
const report = {
  schema: 'source234-raw204-affected-independent-review@1',
  recordedAt: new Date().toISOString(), cwd: R, root: O,
  ticket: 'STEMROBIN-181', successor: 'successor181-3', review: 'd861',
  status: 'SCOPED_PASS_AFFECTED_SOURCE234_RAW204_ONLY',
  findings: { SOURCE: 'PASS_EXACTLY_TWO_ASCII_JOINSPACES',
    unaffectedSource: 'FIRST_RETAINED_PASS_HASH_MATCH_NO_WHOLE_REREVIEW',
    RAW204: 'PASS_ALL_7086_SUBSTANTIVE_INK_ZERO_PROSE_CAPTION',
    SVG204: 'PASS_SAME_SCHEMATIC_1PX_VECTOR_TOLERANCE',
    cropContract: 'PASS_EXACT_SOURCE_BLOCK4_LINE3_COPY_ONLY',
    native: 'PASS_REUSED_RETRY2_26_OF_26_VECTOR_0.014_PERCENT',
    focusedChecks: 'PASS_REUSED_15_OF_15_NOT_REPLAYED',
    firstRecords: 'RETAINED_UNCHANGED_NOT_REPLACED',
    inputIntegrity: 'PASS_ALL_74_START_AND_FINAL_BINDINGS' },
  issues: [], holdReasons: [],
  vectorPrecision: { pixelIdentical: false, mismatchPercent: pixels.svgVersusPNG.mismatchPercent,
    tolerancePx: 1, missingPx: 1, extraPx: 0, missingSourceXY: [818, 1570],
    missingOwner: 'isolated source speck', substantiveFigureInkMissingWithinTolerance: 0 },
  visualComparison: {
    status: 'PASS', imageFirst: true,
    elements: ['S', 'R', 'a', 'b', 'B', 'star', 'full visible partial wavefront arc',
      'radius and arrowhead', 'emphasized ab patch', 'horizontal S-B ray', 'B observation dot'],
    noNeighborProseOrCaptionPNGAndSVG: true,
    note: 'Visual fidelity and exact PNG preservation separately verified; vector agreement alone is insufficient.'
  },
  usage: {
    currentImageLoads: 4, batchLimit: 8, currentContextImagePayloads: 4, contextLimit: 24,
    batches: 1, cropLoads: 1, svgRasterLoads: 1, directReopens: 0, otherPageImages: 0,
    currentReviewerRasterizations: 1, currentReviewerSourceCrops: 1,
    currentReviewerScripts: 2, scriptAttempts: [1, 1], scriptFailures: 0,
    currentSupplementaryReadOnlyPixelDiagnostics: 1,
    currentFreezeHelperInvocations: 1,
    directoryExistenceProbeAbsent: 1,
    currentContentRepairRounds: 0, historicalD857ContentRepairRounds: 1,
    historicalD841ContextImages: 5, historicalD857ParentImages: 1,
    producerReruns: 0, focusedCheckReplays: 0, candidateEdits: 0, coreEdits: 0,
    paidCalls: 0, fullTests: 0, builds: 0, sharedIndexWrites: 0, meterWrites: 0,
    canonicalWrites: 0, productionAdvances: 0, modernWork: 0, dbActions: 0,
    publisherActions: 0, deployActions: 0, gitCommands: 0, planeActions: 0,
    chatActions: 0, newBranches: 0, newWorktrees: 0
  },
  sourceOutputHashes: {
    originalScan: '6e0e5864355beb7ec14e9f00217bfc99c8769434b49050c519b7c4f380dcef13',
    repairedPageMD: 'feb5699485a6e7c45364531968a8fc00b1932ff4133ad000e7d66d22cd4ba914',
    repairedPageJSON: 'd83784eb795f827626d689ddd4c5fc23a0376c963bb7d4524abb3ba2ec00f210',
    repairedAudit: 'db56d29cdfa2c15d1ca2c72e91d1f14794a4d959c96e0bb035b467f49a76fe61',
    repairedPNG: '125d19f5abfcd0bb0f79a1e178fc8fe40c4d012cae2ec8f0b60568f3743b5cc4',
    repairedSVG: 'ae0fa0b65de756a4b13795d740a7977a0d19e04f8a5192226b58afd531e5133f'
  },
  evidence: ['review.md', 'inputhashes.json', 'text-contract-findings.json',
    'pixel-inspection.json', 'svg-speck-inspection.json', 'source234-raw204-region-review.png',
    'raw204-repaired-svg-review.png'].map(name => info(path.join(O, name))),
  processNote: 'Initial registered image-skill reference read used the primary-checkout registry path, then active R instructions were read; all task input/command cwd/write boundaries remained R/O. No other checkout candidate was used.',
  approvalBoundary: 'Affected review only. No modern/canonical/card/DB/publisher/meter/production authorization.',
  stop: true
};
write('review.json', report);
const files = fs.readdirSync(O).sort().map(name => {
  const p = path.join(O, name);
  assert.ok(fs.statSync(p).isFile(), 'Unexpected non-file in owned review directory');
  return info(p);
});
write('freeze.json', {
  schema: 'source234-raw204-affected-review-freeze@1', frozenAt: new Date().toISOString(),
  cwd: R, root: O, status: report.status, inputRechecks: rechecks, files,
  readOnlyMode: '0444', selfHashDisposition: 'External SHA256; manifest does not contain its own hash'
});
for (const entry of [...files, info(path.join(O, 'freeze.json'))]) {
  assert.equal(path.dirname(entry.path), O);
  fs.chmodSync(entry.path, 0o444);
}
console.log(JSON.stringify({
  status: report.status, finalInputHashMatches: rechecks.length,
  report: info(path.join(O, 'review.md')), reportJSON: info(path.join(O, 'review.json')),
  inputhashes: info(path.join(O, 'inputhashes.json')), freeze: info(path.join(O, 'freeze.json')),
  currentContextImages: 4, producerReruns: 0, paidCalls: 0, stop: true
}, null, 2));

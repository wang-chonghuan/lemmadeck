import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const out = path.dirname(fileURLToPath(import.meta.url));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const binding = file => ({ path: file, bytes: fs.statSync(file).size, sha256: hash(file) });
const read = file => JSON.parse(fs.readFileSync(path.join(out, file), 'utf8'));
const write = (file, value) => fs.writeFileSync(path.join(out, file),
  JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const intake = read('intake.json');
const targets = read('targets.json');
const desktop = read('desktop-evidence/browser-evidence.json');
const captureRecovery = read('desktop-capture-recovery/capture-evidence.json');
const mobile = read('mobile-evidence/browser-evidence.json');
const visual = read('visual-observations.json');
assert.equal(visual.actualNewImageViews, 8);
assert.equal(visual.observations.length, 8);
assert.equal(visual.status, 'HOLD');
assert.equal(desktop.boundaries.length, 5);
assert.equal(mobile.boundaries.length, 5);
assert.equal(mobile.status, 'DOM_LAYOUT_PASS_PENDING_NEW_VISUAL_INSPECTION');
assert(desktop.paragraphs.every(p => p.layoutStatus === 'PASS'));
assert(mobile.paragraphs.every(p => p.layoutStatus === 'PASS'));
const captures = [...desktop.captures, ...captureRecovery.captures, ...mobile.captures];
assert.equal(captures.length, 8);
for (const capture of captures) {
  assert.equal(hash(capture.path), capture.sha256);
  const observation = visual.observations.find(o => path.join(out, o.file) === capture.path);
  assert(observation);
  assert.equal(observation.sha256, capture.sha256);
  assert.equal(observation.actualViews, 1);
  const bytes = fs.readFileSync(capture.path);
  assert.equal(bytes.subarray(1, 4).toString(), 'PNG');
  capture.actualPNGDimensions = { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  capture.dimensionCheck = 'PNG IHDR metadata only; no pixel checking or image reload.';
}
assert.equal(captures[0].actualPNGDimensions.height, 804);
assert.equal(captures[0].clip.height, 2065);
assert(captures[0].actualPNGDimensions.height < captures[0].clip.height);
const receipts = [];
for (const stage of ['intake-first','targets-recovery','desktop-first','desktop-capture-only','mobile-first']) {
  const file = path.join(out, stage, 'execution.json');
  const receipt = JSON.parse(fs.readFileSync(file, 'utf8'));
  assert.equal(receipt.cwd, root);
  assert.equal(receipt.signal, null);
  assert.equal(receipt.launchError, null);
  for (const stream of Object.values(receipt.streams)) {
    assert.equal(hash(stream.path), stream.sha256);
    assert.equal(fs.statSync(stream.path).size, stream.bytes);
  }
  receipts.push({ ...binding(file), cwd: receipt.cwd, command: receipt.command,
    argv: receipt.argv, exitCode: receipt.exitCode, status: receipt.status, streams: receipt.streams });
}
assert.deepEqual(receipts.map(r => r.exitCode), [1,0,1,0,0]);
const groups = targets.affectedBlocks.map(blockIndex => {
  const paragraphs = desktop.paragraphs.filter(p => p.blockIndex === blockIndex && p.affected);
  assert.deepEqual(paragraphs.map(p => p.text),
    mobile.paragraphs.filter(p => p.blockIndex === blockIndex && p.affected).map(p => p.text));
  return {
    blockIndex,
    paragraphIndices: paragraphs.map(p => p.index),
    lineCounts: paragraphs.map(p => p.text.split('\n').length),
    groupChecks: paragraphs.map(p => {
      const lines = p.text.split('\n');
      const standaloneFormula = line => /^\$[^$]+\$[。．.,，;；!?！？]*$/.test(line.trim());
      let units = 0;
      let attachedFormulaRows = 0;
      for (const [index, line] of lines.entries()) {
        if (index > 0 && standaloneFormula(line)) attachedFormulaRows++;
        else units++;
      }
      assert(units <= 3, `block${blockIndex}/paragraph${p.index}: excessive independent sentence rows`);
      assert(lines.length <= 3 || attachedFormulaRows > 0);
      return { index: p.index, completeTextAndJoinsExact: true, rows: lines.length,
        independentRows: units, attachedFormulaRows,
        shortTail: units === 1,
        interpretation: units === 1
          ? 'Short final bridge, qualifier, formula or equation label; retained rather than merged across a boundary.'
          : 'Two or three independent sentence rows; an additional attached formula is not a new prose sentence.',
        status: 'PASS' };
    }),
  };
});
const unchanged = intake.files.map(item => {
  assert.equal(hash(item.canonical.path), item.canonical.sha256);
  return { ...item.canonical, unchangedAtClose: true };
});
assert.equal(hash(intake.textHTML.path), intake.textHTML.sha256);
assert.equal(hash(intake.promotion.path), intake.promotion.sha256);
const usage = {
  inherited: { parentPermanentImageViews: 24, parentPermanentLimit: 24,
    charges: 74, paid: 0, fees: 'UNKNOWN', complete: 0, unchanged: true },
  actualThisReview: { screenshotCallAttempts: 9, successfulNewScreenshotFiles: 8,
    screenshotFailedCalls: 1, newImageViews: 8, singleImageBatch: 8, contextImageLoads: 8,
    sourceCropOrModernFigureViews: 0, oldScreenshotViews: 0, parentReturnedImagePayloads: 0,
    figureRenders: 0, modelCalls: 0, paidCalls: 0, finalizerReplays: 0,
    networkCalls: 0, backendOrDatabaseCalls: 0, installs: 0, gitCommands: 0,
    canonicalEdits: 0, appEdits: 0, ticketEdits: 0, newCompletedLessons: 0 },
  allReviewBrowsersClosed: desktop.browserClosed && captureRecovery.browserClosed && mobile.browserClosed,
  allReviewContextsClosed: desktop.contextClosed && captureRecovery.contextClosed && mobile.contextClosed,
};
assert(usage.allReviewBrowsersClosed && usage.allReviewContextsClosed);
write('usage.json', usage);
const findings = {
  schema: 'stemrobin1846/n88-ready-affected-final@1', status: 'HOLD', finish: 'review',
  date: '2026-11-22', cwd: root,
  scope: 'Eight affected prose blocks, all five boundaries, metadata-only figure transfer.',
  findings: visual.holdFindings,
  passes: {
    metadataTransfer: { figures: 4, soleSpecChange: '/source/image/path', svgByteExact: true,
      currentSpecRenderReviewHashesAndPathsValid: true, substantiveReviewNotesReusedExactly: true,
      historicalProvenanceNotRuntimeDependencies: true },
    canonicalRawReadyByteExact: { files: 4, canonicalFiles: unchanged },
    actualHeadedLayout: {
      desktop: { viewport: desktop.viewport, affectedParagraphs: desktop.paragraphs.filter(p => p.affected).length,
        boundaryPairs: 5, paragraphCount: desktop.census.paragraphs,
        proseFlowItemCount: targets.proseFlowItemCount, chineseBodyMinPx: desktop.bodyBaseline.fontPx,
        documentWidth: desktop.census.documentWidth, clientWidth: desktop.census.clientWidth,
        noIndent: true, fontConsistency: true, noChineseClipping: true, noPageHorizontalOverflow: true },
      mobile: { viewport: mobile.viewport, affectedParagraphs: mobile.paragraphs.filter(p => p.affected).length,
        boundaryPairs: 5, paragraphCount: mobile.census.paragraphs,
        proseFlowItemCount: targets.proseFlowItemCount, chineseBodyMinPx: mobile.bodyBaseline.fontPx,
        documentWidth: mobile.census.documentWidth, clientWidth: mobile.census.clientWidth,
        noIndent: true, fontConsistency: true, noChineseClipping: true, noPageHorizontalOverflow: true },
    },
    grouping: groups,
    nativeCanonicalFinalizeReused: intake.nativeFinalizerReused,
  },
  countClarification: targets.countClarification,
  screenshotEvidence: captures,
  visualObservations: binding(path.join(out, 'visual-observations.json')),
  actualReviewReceipts: receipts,
  firstFailuresPreserved: {
    intakeCount: binding(path.join(out, 'intake-first/execution.json')),
    desktopScreenshot: binding(path.join(out, 'desktop-first/execution.json')),
    firstScript: captureRecovery.retainedFirstScript,
    orientationErrors: binding(path.join(out, 'orientation-failures.json')),
  },
  unchangedAuthoritativeHTML: intake.textHTML,
  promotion: intake.promotion,
  usage,
  limitations: [
    'HOLD is missing or masked new visual observation, not an observed scientific/content failure.',
    'No mathematical, original source, crop, glyph, figure-pixel, choice or written-display reassessment.',
    'Encoding/decorative/offscale UNKNOWN and all inherited limitations remain unchanged.',
    'Visibility-only figure suppression and white screenshot masks retain occupied geometry; blank masked regions are not claimed as content defects.',
    'First four read-only orientation failures predate the wrapper and retain actual tool-output references, not invented local full-stream receipts.',
    'No budget remains for a ninth screenshot image view. Do not rerun passed viewport assertions.',
  ],
  narrowRemainingReview: [
    'New desktop visual observation of block5, block8 paragraph7 and section boundary1 only.',
    'If requiring visual rather than DOM rule proof: mobile boundary2 rule only, with figure pixels still excluded.',
  ],
};
write('findings.json', findings);
const report = `# N88 Ready Prose Affected-Only Review

Status: HOLD (visual coverage only). SAME STEMROBIN-184 /184-6, finish=review.
Date: 2026-11-22. Sole write root: ${out}.

## Findings

- P2: Desktop block5, block8 paragraph7 and section boundary1 lack a new actual visual
  observation. First screenshot saved successfully but its IHDR is 736x804, whereas
  its requested clip was 736x2065. The first non-full-page screenshot was truncated
  at the original viewport bottom. DOM checks for those regions PASS.
- P3: Mobile boundary2's exact anchors and DOM rule/spacing PASS. The rule cannot be
  independently distinguished in the figure-masked new image.
- Eight successful screenshots were viewed once each in a single batch of eight.
  No ninth capture/view or old screenshot replay was performed.

## Passed Evidence

All eight affected blocks comprise 21 paragraphs. Each viewport inspected these
plus ${desktop.paragraphs.length - desktop.paragraphs.filter(p => p.affected).length} additional boundary-anchor paragraphs: ${desktop.paragraphs.length} actual paragraph observations,
with all five adjacent pairs exact. Desktop1440x960 and mobile390x844 ran headed
Chromium149.0.7827.55 using the installed app Playwright copy and an offline file URL.
Chinese body size16.96px, font/weight consistent, text-indent0, Chinese glyph clipping0.
Document/client widths desktop1425/1425, mobile375/375; no full-page horizontal overflow.
Sentence grouping uses 2-3 independent rows, with attached formula rows and short
bridge/qualifier/equation-label tails explicitly recorded, not counted as long prose.

The actual HTML has42 p.para nodes, not50 paragraphs. The50 proseFlow items are
42 paragraphs +4 figure items +4 captions. Count preparation's first exit1 was
preserved; only this mapping was recovered. No render/finalizer was replayed.

Four canonical lesson/exercise/figure-manifest/audit files byte-match raw ready and
retain the four supplied SHA-256 hashes. Four promoted specs differ only at
/source/image/path; four SVGs are byte-exact. Active current spec/render/review/source
and output bindings are valid, durable and hash-current. Substantive old notes and
render measurements are exact, not repeated. Historical promotion provenance is not
a runtime dependency. Native canonical finalizer's original actual exit0 receipt
and both complete streams were checked and reused.

## Actual Receipts

intake-first exit1 (42 vs50); targets-recovery exit0; desktop-first exit1
(second screenshot clip); desktop-capture-only exit0 (remaining bands2-4 only);
mobile-first exit0. Each local execution.json records cwd, executable, argv,
exit/status, timestamps and complete stdout/stderr bindings. First desktop script
was retained before the one-line fullPage correction for the unrun mobile stage.
No passed desktop assertion stage was replayed.

findings.json binds receipts, all eight PNG paths/hashes, actual dimensions,
observations, canonical files and usage.json. seal's own receipt is in seal-first/.
No PNG/SVG or source/crop image is returned to the parent; these paths are evidence
references, not an invitation to reopen the whole batch.

## Usage And Limits

Parent permanent24/24, inheritedcharges74, paid0, feesUNKNOWN, complete0 unchanged.
Actual screenshot attempts9: successfulfiles8, failedcalls1, imageviews8.
Singlebatch8, contextloads8/24. Figure/source/crop/old-image views0, model/paid calls0,
render/finalizer replay0, network/backend/DB/Git/install0, canonical/app/ticket edits0.
All browser contexts, browsers and subprocesses closed.
Original science/source/crop/math/figure/choice/written-display PASS is reused.
Encoding, decorative and offscale UNKNOWN remain. No completed lesson is claimed.

Only a separately authorized bounded new visual observation of the named missing
regions remains; already passed assertions and inherited image reviews must not
be repeated.
`;
fs.writeFileSync(path.join(out, 'report.md'), report, { flag: 'wx' });
const files = [];
const visit = dir => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'runtime' || entry.name === 'seal-first') continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) visit(file);
    else if (entry.isFile() && entry.name !== 'manifest.json') files.push(binding(file));
  }
};
visit(out);
write('manifest.json', { schema: 'stemrobin1846/new-review-files@1', cwd: root, files });
console.log(JSON.stringify({
  status: findings.status, findings: findings.findings,
  report: binding(path.join(out, 'report.md')), findingsFile: binding(path.join(out, 'findings.json')),
  manifest: binding(path.join(out, 'manifest.json')), usage: binding(path.join(out, 'usage.json')),
  receiptExitCodes: receipts.map(r => r.exitCode), canonicalFiles: unchanged,
  screenshotFiles: captures.map(c => ({ path: c.path, sha256: c.sha256, dimensions: c.actualPNGDimensions })),
  usageSummary: usage,
}, null, 2));

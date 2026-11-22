import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const out = path.dirname(fileURLToPath(import.meta.url));
const first = path.dirname(out);
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const binding = file => ({ path: file, bytes: fs.statSync(file).size, sha256: hash(file) });
const read = file => JSON.parse(fs.readFileSync(path.join(out, file), 'utf8'));
const write = (file, value) => fs.writeFileSync(path.join(out, file),
  JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const visual = read('visual-observations.json');
const desktop = read('desktop-capture/capture-evidence.json');
const mobile = read('mobile-capture/capture-evidence.json');
assert.equal(visual.status, 'PASS');
assert.equal(visual.actualNewViews, 2);
assert.equal(visual.cumulativeContextImageLoads, 10);
const captures = [desktop, mobile].flatMap(report => report.captures);
assert.equal(captures.length, 2);
assert.equal(visual.observations.length, 2);
for (const report of [desktop, mobile]) {
  assert.equal(report.captureAttempts, 1);
  assert.equal(report.successfulScreenshots, 1);
  assert.equal(report.status, 'CAPTURE_PASS_PENDING_ONE_NEW_VISUAL_VIEW');
  assert(report.browserClosed && report.contextClosed);
  assert.deepEqual(report.forbiddenRequests, []);
}
for (const capture of captures) {
  assert.equal(hash(capture.path), capture.sha256);
  const observation = visual.observations.find(item => path.join(out, item.file) === capture.path);
  assert(observation);
  assert.equal(observation.sha256, capture.sha256);
  assert.equal(observation.actualViews, 1);
  assert.deepEqual(capture.actualPNGDimensions, {
    width: capture.clip.width, height: capture.clip.height,
  });
}
const receipts = ['desktop-first', 'mobile-first'].map(stage => {
  const file = path.join(out, stage, 'execution.json');
  const receipt = JSON.parse(fs.readFileSync(file, 'utf8'));
  assert.equal(receipt.cwd, root);
  assert.equal(receipt.exitCode, 0);
  assert.equal(receipt.signal, null);
  assert.equal(receipt.launchError, null);
  for (const stream of Object.values(receipt.streams)) {
    assert.equal(hash(stream.path), stream.sha256);
    assert.equal(fs.statSync(stream.path).size, stream.bytes);
  }
  return { ...binding(file), cwd: receipt.cwd, command: receipt.command,
    argv: receipt.argv, exitCode: receipt.exitCode, status: receipt.status,
    scriptBinding: receipt.scriptBinding, streams: receipt.streams };
});
const baseline = {
  findings: binding(path.join(first, 'findings.json')),
  manifest: binding(path.join(first, 'manifest.json')),
  seal: binding(path.join(first, 'seal-first/execution.json')),
  desktopAssertions: desktop.existingAssertionsReused,
  mobileAssertions: mobile.existingAssertionsReused,
  metadataTransferIntake: binding(path.join(first, 'intake.json')),
  usage: binding(path.join(first, 'usage.json')),
};
const usage = {
  inheritedFrozenFirstBatch: {
    screenshots: 8, actualViews: 8, screenshotAttempts: 9,
    screenshotFailedCalls: 1, unchanged: true,
  },
  recovery02Actual: {
    screenshotAttempts: 2, successfulScreenshots: 2, actualNewViews: 2,
    singleBatchViews: 2, screenshotFailedCalls: 0, successfulCaptureReplays: 0,
  },
  cumulativeActual: {
    successfulScreenshots: 10, actualImageViews: 10, contextImageLoads: 10,
    contextLimit: 24, screenshotAttempts: 11, screenshotFailedCalls: 1,
  },
  inheritedParent: {
    permanentImageViews: 24, permanentLimit: 24,
    charges: 74, paid: 0, fees: 'UNKNOWN', complete: 0, unchanged: true,
  },
  prohibitedOperationsThisRecovery: {
    passedDOMFontLayoutViewportAssertionReplays: 0,
    metadataCheckerReplays: 0, rendererOrFinalizerReplays: 0,
    sourceCropModernFigureChoiceWrittenOrOldScreenshotViews: 0,
    modelCalls: 0, paidCalls: 0, networkBackendOrDatabaseCalls: 0,
    installs: 0, gitOperations: 0, canonicalOrAppOrTicketEdits: 0,
    firstBatchFileEdits: 0, imagePayloadsReturnedToParent: 0,
  },
  allBrowsersAndContextsClosed: true,
  allCaptureProcessesExited: true,
};
write('usage.json', usage);
const result = {
  schema: 'stemrobin1846/n88-screenshot-gap-recovery02@1',
  cwd: root, status: 'PASS', finish: 'review', date: '2026-11-22',
  newWriteScope: out,
  approvedScope: 'Only desktop block5/block8 paragraph7/boundary1 visual coverage and mobile boundary2 border-rule visibility.',
  baselineRetained: baseline,
  reusedUnchangedPASS: {
    affectedBlocks: [0,5,8,12,17,21,23,26],
    affectedProseParagraphs: 21, adjacentBoundaryAssertions: 5,
    metadataOnlyFigureTransfers: 4,
    originalScienceSourceCropMathFigureChoiceWrittenDisplay: 'PASS reused, not repeated',
    chineseFontIndentClippingAndFullPageOverflowChecks: 'Existing desktop/mobile PASS reused, not repeated',
  },
  qualificationsUnchanged: {
    encoding: 'UNKNOWN', decorative: 'UNKNOWN', offscale: 'UNKNOWN',
    canonicalFinalize: 'Original actual exit0 reused; no replay',
    completion: 0,
  },
  authoritativeHTMLBindingReused: desktop.htmlBindingReusedUnchanged,
  newCaptureEvidence: captures,
  newVisualObservations: visual.observations,
  requestedMissingObservationsRemaining: [],
  actualCaptureReceipts: receipts,
  usage,
  limitations: [
    'Mobile preceding-anchor context is cropped at the top. Its complete new visual review is not claimed.',
    'Only the mobile rule was a missing observation; it and the following anchor are visible. Existing before/after-anchor observations and pair assertions remain reused.',
    'Figure media paint alone was hidden; no screenshot masks covered prose or section rules. Occupied figure dimensions were not edited.',
    'PNG dimensions equal the bound requested crop. This is screenshot nontruncation evidence, not a new typography/layout or mathematical validation.',
    'First-batch HOLD files, failures, images, receipts and scripts remain frozen. This separate report supplies the missing observations without rewriting them.',
    'No lesson publication, source/science reapproval or completed lesson is claimed.',
  ],
};
write('recovery-report.json', result);
const report = `# N88 Screenshot Gap Recovery02

Status: PASS for the two authorized missing visual observations.
SAME STEMROBIN-184 /184-6; finish=review; 2026-11-22.
Cwd: ${root}
Sole new write root: ${out}

## New Observations

Desktop: one image shows all of block5 (three-sentence first group and final
bridge), block8 paragraph7 (entire range paragraph), and boundary1. The before
bridge, preserved figure39 region/caption, horizontal rule and complete after
paragraph are all visible. No requested desktop text is truncated or masked.

Mobile: one image clearly shows boundary2's previously hidden horizontal rule
below the retained figure40 caption, with the complete after-anchor below it.
The preceding-anchor context is cropped at the top. This is not claimed as a new
full-anchor or full-pair review: those existing PASS observations/assertions are
reused. The only missing mobile target was the rule, and it is fully visible.
No requested missing observation remains.

Figure-media paint and descendants alone use visibility:hidden!important.
No display/dimension/parent changes or screenshot masks were used. Figure space
and captions remain. No modern figure pixels were viewed.

## Actual Acquisition

Existing installed app Playwright; headed Chromium149.0.7827.55, offline file URL.
Desktop viewport1440x960: prebound document clip x362 y1334 701x755;
actual PNG701x755, 42942 bytes.
Mobile viewport390x844: prebound document clip x8 y3013 359x716;
actual PNG359x716, 16844 bytes.
Both geometry records were saved before screenshot acquisition. The only
assertions were genuine bounded capture and nontruncated PNG dimensions.
Both capture receipts have actual exit0, exact cwd/argv, script SHA and complete
stdout/stderr bindings. No capture failed or successful capture was repeated.
Each new image was inspected exactly once in one batch of2.

## Reused Evidence

First findings SHA ${baseline.findings.sha256}
First manifest SHA ${baseline.manifest.sha256}
First seal SHA ${baseline.seal.sha256}
Existing21 affected paragraphs / all5 boundary assertions and4 figure metadata
transfer PASS are referenced without replay. Original science/source/crop/math/
figure/choice/written-display PASS and encoding/decorative/offscale UNKNOWN remain.
No native producer, authoring change, key access or metadata checker ran.

## Usage And Retention

Frozen first batch8 screenshots/8views, attempts9/failure1.
Recovery02: screenshots2/views2, attempts2/failures0.
Cumulative: screenshots10/views10, context10/24, attempts11/failures1.
Parent permanent24/24, charges74, paid0, feesUNKNOWN, complete0 unchanged.
All capture browsers, contexts and processes closed; no model/network/backend/DB/
install/Git/app/canonical/ticket operation or first-batch edit.

manifest.json has cwd, statusPASS, and absolute retentionFiles with sha256 and
image booleans for necessary new evidence and referenced frozen first files.
The seal-first/ execution receipt and complete streams are separate native
receipts created after this manifest; the parent can bind them directly.
No image payload is returned in the final response.
`;
fs.writeFileSync(path.join(out, 'report.md'), report, { flag: 'wx' });
const retentionFiles = [];
const walk = dir => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'runtime' || entry.name === 'seal-first') continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.isFile() && entry.name !== 'manifest.json') retentionFiles.push({
      path: file, sha256: hash(file), image: path.extname(file).toLowerCase() === '.png',
    });
  }
};
walk(out);
for (const retained of Object.values(baseline)) retentionFiles.push({
  path: retained.path, sha256: retained.sha256, image: false,
});
const uniqueRetention = [...new Map(retentionFiles.map(file => [file.path, file])).values()];
write('manifest.json', {
  schema: 'stemrobin1846/recovery02-retention@1',
  cwd: root, status: 'PASS', newWriteScope: out, finish: 'review',
  retentionFiles: uniqueRetention,
  separateNativeSealReceipt: path.join(out, 'seal-first/execution.json'),
  counts: {
    retentionFiles: uniqueRetention.length,
    retainedNewImages: uniqueRetention.filter(file => file.image).length,
    newActualViews: 2, cumulativeContextLoads: 10, contextLimit: 24,
  },
});
console.log(JSON.stringify({
  cwd: root, status: result.status,
  report: binding(path.join(out, 'report.md')),
  recoveryReport: binding(path.join(out, 'recovery-report.json')),
  manifest: binding(path.join(out, 'manifest.json')),
  usage: binding(path.join(out, 'usage.json')),
  receipts, screenshots: captures.map(file => ({
    path: file.path, sha256: file.sha256, bytes: file.bytes, dimensions: file.actualPNGDimensions,
  })),
  usageSummary: usage, remainingRequestedGaps: [],
}, null, 2));

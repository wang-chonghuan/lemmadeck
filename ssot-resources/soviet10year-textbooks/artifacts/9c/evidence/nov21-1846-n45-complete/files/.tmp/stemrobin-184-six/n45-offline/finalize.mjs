import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const scratch = path.join(root, '.tmp/stemrobin-184-six/n45-offline');
const prefix = path.join(root, '.tmp/stemrobin-184-six/stages/n45-first-offline-check-nov21');
const recoveryPrefix = path.join(root, '.tmp/stemrobin-184-six/stages/n45-offline-written-number-recovery-nov21');
const recoveryPath = path.join(scratch, 'written-number-recovery.json');
const evidencePath = path.join(scratch, 'evidence.json');
const observationsPath = path.join(scratch, 'observations.json');
const evidence = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));
const observations = JSON.parse(fs.readFileSync(observationsPath, 'utf8'));
const receipt = JSON.parse(fs.readFileSync(`${prefix}.receipt.json`, 'utf8'));
const recovery = JSON.parse(fs.readFileSync(recoveryPath, 'utf8'));
const recoveryReceipt = JSON.parse(fs.readFileSync(`${recoveryPrefix}.receipt.json`, 'utf8'));
assert.equal(receipt.stage, 'n45-first-offline-check-nov21');
assert.equal(receipt.exitCode, 1);
assert.equal(evidence.assertionVerdict, 'FAIL');
assert.equal(recoveryReceipt.exitCode, 0);
assert.equal(recovery.correctedAssertionVerdict, 'PASS');
assert.deepEqual(recovery.originalFailures, evidence.failures);
assert.deepEqual(recovery.unresolvedFailures, []);
assert.equal(recovery.affectedChecks.length, 2);
assert.equal(evidence.accounting.screenshotsCaptured, 6);
assert.equal(observations.views.length, 6);
assert(observations.views.every((view, index) => view.views === 1 && view.ordinal === index + 1));

// Hash encoded file bytes as streams; never parse or decode a screenshot.
async function bind(file) {
  const hash = crypto.createHash('sha256');
  let bytes = 0;
  for await (const chunk of fs.createReadStream(file)) {
    bytes += chunk.length;
    hash.update(chunk);
  }
  return { path: file, bytes, sha256: hash.digest('hex') };
}
const inputs = {};
for (const [name, binding] of Object.entries(evidence.inputs)) {
  inputs[name] = await bind(binding.path);
  assert.equal(inputs[name].sha256, binding.sha256, `${name} changed after stage`);
}
const screenshots = [];
for (const [index, view] of evidence.views.entries()) {
  const observation = observations.views[index];
  assert.equal(view.id, observation.id);
  screenshots.push({
    id: view.id,
    viewport: view.viewport,
    fullPage: true,
    ...await bind(view.screenshot.path),
    actualToolViews: 1,
    toolViewOrdinal: observation.ordinal,
    observation: observation.observation,
    visualVerdict: observation.verdict,
    capturedInnerScrollerPositions: view.innerScrollers.map(({ index, screenshotAt }) => ({ index, screenshotAt })),
  });
}
const stdout = await bind(`${prefix}.stdout`);
const stderr = await bind(`${prefix}.stderr`);
assert.equal(stdout.sha256, receipt.outputs.stdout.sha256);
assert.equal(stdout.bytes, receipt.outputs.stdout.bytes);
assert.equal(stderr.sha256, receipt.outputs.stderr.sha256);
assert.equal((await bind(evidencePath)).sha256, recovery.bindings.evidence.sha256);
const recoveryStdout = await bind(`${recoveryPrefix}.stdout`);
const recoveryStderr = await bind(`${recoveryPrefix}.stderr`);
assert.equal(recoveryStdout.sha256, recoveryReceipt.outputs.stdout.sha256);
assert.equal(recoveryStderr.sha256, recoveryReceipt.outputs.stderr.sha256);
const report = {
  scope: evidence.scope,
  stage: recoveryReceipt.stage,
  stageExit: recoveryReceipt.exitCode,
  originalStage: receipt.stage,
  originalStageExit: receipt.exitCode,
  started: receipt.started,
  ended: recoveryReceipt.ended,
  finalizedAt: new Date().toISOString(),
  assertionVerdict: recovery.correctedAssertionVerdict,
  visualVerdict: observations.visualVerdict,
  semanticVerdict: evidence.semanticVerdict,
  failures: recovery.unresolvedFailures,
  firstFailures: evidence.failures,
  technicalRecovery: {
    cause: 'Body-only comparator omitted separately rendered number label374.',
    affectedChecks: recovery.affectedChecks,
    newBrowserRuns: 0,
    passedAssertionReplays: 0,
    originalEvidenceUnchanged: true,
  },
  bindings: {
    inputs,
    choicesHtml: await bind(evidence.choices.path),
    evidence: await bind(evidencePath),
    observations: await bind(observationsPath),
    receipt: await bind(`${prefix}.receipt.json`),
    rawStdout: stdout,
    rawStderr: stderr,
    stageRunner: await bind(path.join(root, '.tmp/stemrobin-184-six/run-stage.mjs')),
    finalizer: await bind(path.join(scratch, 'finalize.mjs')),
    diagnosis: await bind(path.join(scratch, 'diagnosis.json')),
    recovery: await bind(recoveryPath),
    recoveryScript: await bind(path.join(scratch, 'recover-written-number.mjs')),
    recoveryReceipt: await bind(`${recoveryPrefix}.receipt.json`),
    recoveryStdout,
    recoveryStderr,
  },
  screenshots,
  accounting: {
    ...evidence.accounting,
    actualImageToolViews: 6,
    viewToolCalls: 6,
    requestedNewScreenshotDecodesForInspection: 6,
    originalSourceImageViewsOrDecodes: 0,
    screenshotRawByteHashStreamsAfterStage: 6,
    screenshotRawByteHashingIsImageDecoding: false,
    allScreenshotReadsAfterStageCompletion: true,
    hiddenRendererInternalLoadsAndDecodes: 'UNKNOWN',
    hiddenImageToolInternalLoadsAndDecodes: 'UNKNOWN',
    batchImageViews: '6/8',
    newContextImageViews: '6/24',
  },
  charge: { ...evidence.charge, imageViews: 6, screenshotByteHashStreams: 6 },
  network: {
    offline: evidence.network.contextOffline,
    routePolicy: evidence.network.routePolicy,
    remoteAttempts: evidence.network.remoteAttempts.length,
    remoteResponses: evidence.network.remoteResponses.length,
    remoteDependencies: evidence.network.dependencyCount,
    filePageRequests: evidence.network.requests.filter(({ url }) => url.startsWith('file:')).length,
    otherPageRequests: evidence.network.requests.filter(({ url }) => !url.startsWith('file:')).length,
    hiddenBrowserBackgroundActivity: evidence.network.hiddenBrowserBackgroundActivity,
  },
  preservation: 'Existing canonical renders and product inputs unchanged; writes confined to n45-offline and unique stage files. No rerun, product edit, source-image view, network/model/paid/DB/publish/deploy/closure call.',
  stop: 'FULL parent TEXT intake; no image payload returned',
};
const reportPath = path.join(scratch, 'report.json');
fs.writeFileSync(reportPath, JSON.stringify(report) + '\n', { flag: 'wx' });
console.log(JSON.stringify({
  report: await bind(reportPath),
  stage: report.stage,
  exit: report.stageExit,
  assertion: report.assertionVerdict,
  visual: report.visualVerdict,
  screenshots: screenshots.map(({ id, path, bytes, sha256 }) => ({ id, path, bytes, sha256 })),
  rawStdout: stdout,
  accounting: { captures: 6, actualViews: 6, screenshotHashStreams: 6, hiddenInternals: 'UNKNOWN' },
  charge: report.charge,
  stop: report.stop,
}));

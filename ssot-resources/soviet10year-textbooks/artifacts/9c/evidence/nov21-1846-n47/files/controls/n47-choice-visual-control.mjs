import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const base = path.join(root, '.tmp/stemrobin-184-six');
const progressPath = path.join(base, 'source-progress.json');
const usagePath = path.join(root, '.intentfold/tickets/STEMROBIN-184/usage.json');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.relative(root, file), bytes: bytes.length, sha256: sha(bytes) };
};
const [mode, agent, detail] = process.argv.slice(2);
const progress = read(progressPath);
assert.equal(progress.n47.offline.closed, true);
const receipt = {
  schema: 'stemrobin1846/n47-missing-choice-visual-followup-control@1',
  at: new Date().toISOString(), mode, finish: 'review', completeLessonDelta: 0,
  parentNewImagesOrDecodes: 0, parentPermanentBudget: '24/24; never reset',
  originalSartreViews: 8, originalAssignmentLimitAndActual: '8/8 unchanged',
  authority: 'Latest same-184-6 delegated continuation explicitly authorizes one new two-image missing-stage batch; not a new human prompt or production chat',
  noPassedSourceMathTextAnswerChoiceKeyDOMOrClickReplays: true,
};
if (mode === 'dispatch') {
  assert(!progress.n47.choiceVisualFollowup);
  assert(agent && detail);
  receipt.agent = agent;
  receipt.nickname = detail;
  receipt.historyFork = false;
  receipt.freshContextMaximum = 24;
  receipt.newBatchImageMaximum = 2;
  receipt.root = '.tmp/stemrobin-184-six/n47-choice-visual-followup';
  receipt.scope = 'Standalone repaired choices top-level file only; two actual new desktop/mobile captures; no below-fold iframe';
  receipt.closed = false;
  receipt.accepted = false;
  progress.n47.choiceVisualFollowup = receipt;
  progress.status = 'n47 missing standalone choices visual followup active; original HOLD preserved';
} else if (mode === 'intake') {
  const followup = progress.n47.choiceVisualFollowup;
  assert.equal(followup.closed, false);
  assert(!followup.intake);
  const directory = path.join(base, 'n47-choice-visual-followup');
  const manifestPath = path.join(directory, 'hash-manifest.json');
  const manifest = read(manifestPath);
  const rows = [];
  const leafCount = value => value !== null && typeof value === 'object'
    ? Object.values(value).reduce((count, child) => count + leafCount(child), 0) : 1;
  function intakeFile(file) {
    assert(!fs.lstatSync(file).isSymbolicLink());
    assert.equal(fs.statSync(file).mode & 0o777, 0o444);
    const row = bind(file);
    row.intake = file.endsWith('.png') ? 'Hash custody only, zero parent views/decodes'
      : 'Complete UTF-8 read; primary text consumed separately';
    if (!file.endsWith('.png')) fs.readFileSync(file, 'utf8');
    if (file.endsWith('.json')) {
      row.intake = 'Complete structured JSON parse and all-leaf traversal; not a claim of verbatim printing';
      row.scalarLeaves = leafCount(read(file));
    }
    rows.push(row);
  }
  function walk(folder) {
    assert.equal(fs.statSync(folder).mode & 0o777, 0o555);
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
      const file = path.join(folder, entry.name);
      assert(!entry.isSymbolicLink());
      if (entry.isDirectory()) walk(file);
      else intakeFile(file);
    }
  }
  walk(directory);
  const stage = 'n47-independent-choice-capture-followup-first';
  for (const extension of ['stdout', 'stderr', 'receipt.json']) {
    intakeFile(path.join(base, 'stages', `${stage}.${extension}`));
  }
  assert(Array.isArray(manifest.outputs));
  for (const binding of manifest.outputs) {
    const actual = rows.find(row => row.path === binding.path);
    assert(actual);
    assert.equal(actual.bytes, binding.bytes);
    assert.equal(actual.sha256, binding.sha256);
  }
  assert.equal(rows.length, manifest.outputs.length + 1);
  const reportPath = path.join(directory, 'report.json');
  const report = read(reportPath);
  const evidence = read(path.join(directory, 'evidence.json'));
  const ledger = read(path.join(directory, 'image-observation-ledger.json'));
  const stageReceipt = read(path.join(base, 'stages', `${stage}.receipt.json`));
  const stdout = fs.readFileSync(path.join(base, 'stages', `${stage}.stdout`), 'utf8')
    .trim().split('\n').map(line => JSON.parse(line));
  const verifyBinding = binding => {
    const actual = bind(path.resolve(root, binding.path));
    assert.equal(actual.bytes, binding.bytes);
    assert.equal(actual.sha256, binding.sha256);
  };
  assert.equal(stageReceipt.stage, stage);
  assert.equal(stageReceipt.cwd, root);
  assert.equal(stageReceipt.exitCode, 0);
  for (const binding of Object.values(stageReceipt.outputs)) verifyBinding(binding);
  assert.equal(stdout.length, 3);
  assert.equal(stdout[2].assertionVerdict, 'PASS');
  assert.equal(evidence.stage, stage);
  assert.equal(evidence.launchOptions.headless, true);
  assert.equal(evidence.assertionVerdict, 'PASS');
  assert.equal(evidence.visualVerdict, 'PENDING_TWO_ACTUAL_IMAGE_TOOL_OBSERVATIONS');
  assert.equal(evidence.assertions.length, 19);
  assert(evidence.assertions.every(assertion => assertion.passed === true));
  assert.equal(new Set(evidence.assertions.map(assertion => assertion.id)).size, 19);
  assert.equal(report.newAffectedAcquisitionAssertions, 19);
  assert.deepEqual(evidence.errors, []);
  assert.deepEqual(evidence.unresolvedFailures, []);
  assert.equal(evidence.accounting.browserLaunches, 1);
  assert.equal(evidence.accounting.screenshotCreations, 2);
  assert.equal(evidence.accounting.newNativeClicks, 0);
  assert.equal(evidence.accounting.networkRequests, 0);
  assert.equal(evidence.views.length, 2);
  assert.equal(evidence.screenshots.length, 2);
  assert.equal(report.captures.length, 2);
  assert.equal(report.observations.length, 2);
  assert.deepEqual(report.observations, ledger.entries);
  verifyBinding(report.evidence);
  verifyBinding(report.actualManifestBinding);
  assert.deepEqual(evidence.actualManifestBinding, report.actualManifestBinding);
  for (const binding of evidence.inputs) verifyBinding(binding);
  for (let index = 0; index < 2; index++) {
    const view = evidence.views[index];
    const capture = report.captures[index];
    const acquired = evidence.screenshots[index];
    const observation = read(path.resolve(root, capture.observation.path));
    verifyBinding(capture);
    verifyBinding(capture.observation);
    assert.deepEqual(observation.capture, bind(path.resolve(root, capture.path)));
    assert.equal(observation.actualCalls, 1);
    assert.equal(observation.actualObservation, true);
    assert.equal(observation.reopened, false);
    assert.equal(observation.cropped, false);
    assert.equal(observation.visualVerdict, 'PASS');
    assert.equal(observation.viewportId, view.id);
    assert.deepEqual(observation.viewport, capture.viewport);
    assert.deepEqual(observation.observedFullImageSize,
      { width: capture.fullContent.width, height: capture.fullContent.height });
    assert.equal(observation.findings.optionsVisiblyPresent, 16);
    assert.equal(observation.findings.visibleRadios, 16);
    assert.equal(capture.sha256, acquired.sha256);
    assert.deepEqual(capture.fullContent, acquired.fullContent);
    assert.deepEqual(capture.finalOptionReachability, view.finalOptionReachability);
    assert.equal(capture.imageObservation, 'PASS');
    assert.equal(acquired.imageObservation, 'PENDING');
    assert.equal(view.layout.topLevel, true);
    assert.equal(view.layout.iframeCount, 0);
    assert.deepEqual(view.layout.questions.map(question => question.questionId),
      report.actualQuestionIds);
    assert.equal(view.layout.questions.flatMap(question => question.options).length, 16);
    assert(view.layout.questions.flatMap(question => question.options)
      .every(option => option.visible && option.optionText.trim().length > 0));
    assert.equal(view.finalOptionReachability.reachable, true);
    assert.deepEqual(view.captureReset, { x: 0, y: 0, nonzero: [] });
    assert.deepEqual(view.pageErrors, []);
    assert.equal(stdout[index].screenshot.sha256, capture.sha256);
    assert.equal(stdout[index].options, 16);
  }
  assert.equal(report.accounting.actualImageToolViews, 2);
  assert.equal(report.accounting.historicalSartreImageViews, 8);
  assert.equal(report.accounting.totalKnownN47ImageViews, 10);
  assert.equal(report.accounting.parentImagesOrDecodes, 0);
  assert.equal(report.accounting.hiddenBrowserImageInternals, 'UNKNOWN');
  assert.equal(report.accounting.newNativeClicks, 0);
  assert.equal(report.accounting.inheritedNativeClicks, 64);
  assert.equal(report.accounting.inheritedDOMAssertions, 111);
  assert.equal(report.accounting.historicalCounterReset, false);
  assert.equal(report.inheritedAssertionsRerun, 0);
  assert.equal(report.inheritedNativeClicksRerun, 0);
  assert.equal(report.cleanup.browserClosed, true);
  assert(report.cleanup.contexts.every(context => context.closed));
  assert.deepEqual(evidence.cleanup, report.cleanup);
  assert.deepEqual(ledger.accounting, report.accounting);
  receipt.crossLinkedAcquisitionAssertions = 19;
  receipt.stage = bind(path.join(base, 'stages', `${stage}.receipt.json`));
  receipt.evidence = bind(path.join(directory, 'evidence.json'));
  receipt.childAuthorityQualification = 'Child human-supplied/user-authorization wording refers to inherited parent-delegated facts under existing same-184-6 authority, not a new direct human prompt';
  receipt.files = rows;
  receipt.manifest = bind(manifestPath);
  receipt.report = bind(reportPath);
  receipt.assertionVerdict = report.assertionVerdict;
  receipt.visualVerdict = report.visualVerdict;
  receipt.unresolvedFailures = report.unresolvedFailures;
  receipt.accepted = report.assertionVerdict === 'PASS' && report.visualVerdict === 'PASS'
    && Array.isArray(report.unresolvedFailures) && report.unresolvedFailures.length === 0;
  receipt.primaryTextConsumption = detail;
  assert(detail);
  followup.intake = receipt;
  followup.accepted = receipt.accepted;
  progress.status = receipt.accepted
    ? 'n47 standalone choices visual PASS fully received; actual reviewer close next'
    : 'n47 standalone choices new failure received; original HOLD preserved; affected cause only';
} else if (mode === 'close') {
  const followup = progress.n47.choiceVisualFollowup;
  assert(followup.intake);
  assert.equal(followup.closed, false);
  assert.equal(agent, followup.agent);
  assert.equal(detail, 'completed');
  receipt.agent = agent;
  receipt.actualPriorStatus = detail;
  receipt.accepted = followup.accepted;
  followup.closed = true;
  followup.closure = receipt;
} else throw new Error(`Unknown mode: ${mode}`);
const target = path.join(base, `n47-choice-visual-${mode}-parent-receipt.json`);
fs.writeFileSync(target, JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
if (mode === 'intake') progress.n47.choiceVisualFollowup.intakeBinding = bind(target);
if (mode === 'dispatch') progress.n47.choiceVisualFollowup.dispatchBinding = bind(target);
const usage = read(usagePath);
usage[`nov21_1846_n47_choice_visual_followup_${mode}`] = receipt;
fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2) + '\n');
fs.writeFileSync(usagePath, JSON.stringify(usage, null, 2) + '\n');
console.log(JSON.stringify({
  mode, agent: receipt.agent, accepted: receipt.accepted,
  assertionVerdict: receipt.assertionVerdict, visualVerdict: receipt.visualVerdict,
  files: receipt.files?.length, report: receipt.report,
  originalCheckerViewsUnchanged: 8, newBatchMaximum: 2, parentImagesOrDecodes: 0,
}));

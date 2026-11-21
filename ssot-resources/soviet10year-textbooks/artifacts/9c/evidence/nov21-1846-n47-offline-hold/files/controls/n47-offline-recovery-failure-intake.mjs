import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const base = path.join(root, '.tmp/stemrobin-184-six');
const directory = path.join(base, 'n47-offline-recovery');
const progressPath = path.join(base, 'source-progress.json');
const usagePath = path.join(root, '.intentfold/tickets/STEMROBIN-184/usage.json');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.relative(root, file), bytes: bytes.length, sha256: sha(bytes) };
};
const leaves = value => value !== null && typeof value === 'object'
  ? Object.values(value).reduce((count, child) => count + leaves(child), 0) : 1;
const [mode, agent, actualPriorStatus] = process.argv.slice(2);
const progress = read(progressPath);
const usage = read(usagePath);
const receipt = {
  schema: 'stemrobin1846/n47-offline-recovery-failure-custody@1',
  at: new Date().toISOString(), mode, accepted: false, completeLessonDelta: 0,
  parentImagesOrDecodes: 0, actualCumulativeCheckerViews: 8,
  parentPermanentBudget: '24/24; never reset', finish: 'review',
};
if (mode === 'intake') {
  assert(!progress.n47.offline.recoveryFailureIntake);
  const manifest = read(path.join(directory, 'hash-manifest.json'));
  assert.equal(bind(path.join(directory, 'hash-manifest.json')).sha256,
    '91aaed51f7c60b50fd00b37277aaa39e2036f457133b8c4b64bb7b35d02d4bcb');
  const parsed = new Map(), rows = [];
  function walk(folder) {
    assert.equal(fs.statSync(folder).mode & 0o777, 0o555);
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
      const file = path.join(folder, entry.name);
      assert(!entry.isSymbolicLink());
      if (entry.isDirectory()) walk(file);
      else {
        assert.equal(fs.statSync(file).mode & 0o777, 0o444);
        const row = bind(file);
        if (entry.name.endsWith('.json')) {
          const value = read(file);
          parsed.set(path.relative(directory, file), value);
          row.scalarLeaves = leaves(value);
          row.intake = 'Complete structured JSON parse/traversal';
        } else row.intake = entry.name.endsWith('.png')
          ? 'Hash custody only; no parent view/open/decode'
          : 'Complete UTF-8 read; primary code/report independently consumed';
        rows.push(row);
      }
    }
  }
  walk(directory);
  for (const binding of manifest.outputs) {
    const actual = rows.find(row => row.path === binding.path);
    assert(actual);
    assert.equal(actual.bytes, binding.bytes);
    assert.equal(actual.sha256, binding.sha256);
  }
  assert.equal(rows.length, manifest.outputs.length + 1);
  const report = parsed.get('report.json');
  const evidence = parsed.get('browser-evidence-headless.json');
  const headed = parsed.get('browser-evidence.json');
  const images = parsed.get('image-observations.json');
  assert.equal(report.assertionVerdict, 'FAIL');
  assert.equal(report.visualVerdict, 'FAIL');
  assert.equal(report.overallVerdict, 'FAIL');
  assert.equal(report.browserDomAssertionVerdict, 'PASS');
  assert.equal(evidence.assertions.length, 111);
  assert(evidence.assertions.every(x => x.passed));
  assert.deepEqual(report.observations, images.observations);
  assert.deepEqual(report.finalPaintedCoverageAssertions.map(x => ({
    id: x.id, passed: x.passed, classification: x.classification, reason: x.reason,
  })), images.observations.map(x => x.coverageAssertion));
  assert.equal(report.unresolvedFailures.length, 2);
  assert.equal(report.accounting.actualImageToolViews, 2);
  assert.equal(report.accounting.cumulativeImageToolViews, 8);
  assert.equal(report.accounting.remainingImageViews, 0);
  assert.equal(report.accounting.newNativeClicks, 0);
  assert.equal(report.accounting.inheritedNativeClicks, 64);
  assert.equal(report.cleanup.browserClosed, true);
  assert.equal(report.cleanup.stoppedHeadedBrowserClosed, true);
  assert.equal(evidence.cleanup.browserClosed, true);
  assert.equal(headed.cleanup.browserClosed, true);
  assert.deepEqual(evidence.launchOptions, { headless: true, timeout: 30000 });
  const entries = ['headed-first', 'headless-prelaunch-first', 'headless-entry'];
  assert.deepEqual(entries.map(label => parsed.get(`execution/${label}.receipt.json`).exitCode),
    [1, 1, 0]);
  assert.deepEqual(report.inheritedEvidence, evidence.inherited);
  for (const image of images.observations) {
    assert.equal(image.actualToolCalls, 1);
    assert.equal(image.actualObserved, true);
    assert.equal(image.textVisualVerdict, 'PASS_AFFECTED_TEXT_ONLY');
    assert.equal(image.choicesVisualVerdict, 'HOLD_UNOBSERVED');
    assert.equal(rows.find(x => x.path === image.path).sha256, image.sha256);
  }
  for (const view of evidence.views) {
    for (const frame of view.frames) {
      assert(frame.measurement.containers.every(x => x.maxTopExcess === 0 && x.maxBottomExcess === 0));
      assert(frame.endpoints.every(x => x.passed));
    }
  }
  receipt.files = rows;
  receipt.report = bind(path.join(directory, 'report.json'));
  receipt.manifest = bind(path.join(directory, 'hash-manifest.json'));
  receipt.completeStructuredConsumption = {
    JSONFiles: parsed.size,
    all111AssertionsCrossChecked: true,
    allFrameContainerEndPointAndBodyBindingRecordsTraversed: true,
    primaryCode: 'Full original checker plus exact full headless-entry and prelaunch-copy diffs; full packager, report Markdown, manifest, entry history and observations consumed as text',
    microscopicCaptureFiles: 'Fully read/parsed and hash-bound, not falsely claimed individually verbatim-displayed',
    noImagePayloadToParent: true,
  };
  receipt.actualEntries = {
    headedRecovery: { exit: 1, assertions: 54, screenshots: 0, views: 0, closed: true },
    headlessPrelaunch: { exit: 1, browserLaunches: 0, screenshots: 0, views: 0 },
    headlessRecovery: { exit: 0, DOMAssertions: 111, screenshots: 2, actualViews: 2, closed: true },
  };
  receipt.unresolvedFailures = report.unresolvedFailures;
  receipt.status = 'CHOICES_VISUAL_HOLD_CAPTURE_HARNESS_FAILURE_NOT_PRODUCT_ATTRIBUTION';
  progress.n47.offline.recoveryFailureIntake = receipt;
  progress.n47.status = receipt.status;
  progress.status = 'n47 visual HOLD; checker8/8 exhausted; SOURCE170 remains unread/unprepared';
} else if (mode === 'close') {
  assert(progress.n47.offline.recoveryFailureIntake);
  assert.equal(agent, progress.n47.offline.agent);
  assert.equal(actualPriorStatus, 'completed');
  assert.equal(progress.n47.offline.closed, false);
  receipt.agent = agent;
  receipt.actualPriorStatus = actualPriorStatus;
  receipt.status = 'EXHAUSTED_CHECKER_ACTUALLY_CLOSED_AFTER_FULL_FAILURE_INTAKE';
  progress.n47.offline.closed = true;
  progress.n47.offline.closure = receipt;
} else if (mode === 'retain') {
  assert.equal(progress.n47.offline.closed, true);
  const target = path.join(root,
    'ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov21-1846-n47-offline-hold');
  assert(!fs.existsSync(target));
  const rows = [];
  function copy(file, relative) {
    const destination = path.join(target, 'files', relative);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(file, destination, fs.constants.COPYFILE_EXCL);
    fs.chmodSync(destination, 0o444);
    const source = bind(file);
    assert.equal(bind(destination).sha256, source.sha256);
    rows.push({ origin: source.path, path: path.relative(target, destination),
      bytes: source.bytes, sha256: source.sha256 });
  }
  function copyTree(folder, relative) {
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
      assert(!entry.isSymbolicLink());
      const file = path.join(folder, entry.name);
      if (entry.isDirectory()) copyTree(file, path.join(relative, entry.name));
      else copy(file, path.join(relative, entry.name));
    }
  }
  fs.mkdirSync(target);
  for (const name of ['n47-offline', 'n47-offline-diagnosis', 'n47-offline-recovery']) {
    copyTree(path.join(base, name), name);
  }
  for (const name of fs.readdirSync(path.join(base, 'stages'))) {
    if (name.startsWith('n47-offline-') || name.startsWith('n47-affected-css-')
      || name.startsWith('n47-exhausted-offline-reviewer-actual-close-first.')) {
      copy(path.join(base, 'stages', name), `stages/${name}`);
    }
  }
  for (const name of fs.readdirSync(base)) {
    if (/^n47-offline-.*parent-receipt\.json$/.test(name)
      || name === 'n47-layout-repair-parent-receipt.json') {
      copy(path.join(base, name), `controls/${name}`);
    }
  }
  for (const name of ['n47-offline-failure-intake.mjs',
    'n47-offline-recovery-failure-intake.mjs', 'n47-layout-repair.mjs',
    'n47-layout-repair-first-failed.mjs', 'n47-parent-operation-notes.json']) {
    copy(path.join(base, name), `controls/${name}`);
  }
  copy(path.join(base, 'n47-preview/manifest.json'), 'controls/original-preview-manifest.json');
  copy(path.join(base, 'n47-preview-repaired/manifest.json'), 'controls/repaired-preview-manifest.json');
  const manifest = {
    schema: 'stemrobin1846/n47-offline-hold-retention@1',
    at: receipt.at, rows, completeLessonDelta: 0, strictCompliance: false,
    accepted: false, finish: 'review', noHistoricalRecount: true,
    status: 'CHOICES_VISUAL_HOLD_UNOBSERVED',
    actualCheckerImageViews: 8, parentNewImagesOrDecodes: 0,
    visualText: 'PASS affected text only', visualChoices: 'HOLD unobserved repaired choices',
    DOM111: 'PASS; not a visual substitute',
    allFirstFailAndHoldUnknownUnchanged: true,
    reviewerActuallyClosed: true, hiddenBrowserImageInternals: 'UNKNOWN',
    source170Plus: 'UNREAD_UNPREPARED_NOT_PREFETCHED',
    next: 'No further images under exhausted assignment; any additional bounded observation batch needs authorization',
    rendererRepair: bind(path.join(root, '.claude/skills/ld-s10y-lesson/tools/render_lesson.js')),
    duplicatePackagePolicy: 'Retained once; later complete n47 evidence must reference this package, not recopy it',
  };
  const output = path.join(target, 'manifest.json');
  fs.writeFileSync(output, JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx', mode: 0o444 });
  function freeze(folder) {
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
      if (entry.isDirectory()) freeze(path.join(folder, entry.name));
    }
    fs.chmodSync(folder, 0o555);
  }
  freeze(target);
  receipt.status = manifest.status;
  receipt.evidence = bind(output);
  receipt.retainedFiles = rows.length;
  progress.n47.offline.holdEvidence = receipt.evidence;
} else throw new Error(`Unknown mode ${mode}`);
const output = path.join(base, `n47-offline-recovery-failure-${mode}-parent-receipt.json`);
fs.writeFileSync(output, JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
usage[`nov21_1846_n47_offline_recovery_failure_${mode}`] = receipt;
fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2) + '\n');
fs.writeFileSync(usagePath, JSON.stringify(usage, null, 2) + '\n');
console.log(JSON.stringify({
  mode, status: receipt.status, accepted: false,
  files: receipt.files?.length ?? receipt.retainedFiles,
  report: receipt.report, evidence: receipt.evidence,
  actualCheckerViews: 8, parentImagesOrDecodes: 0,
  unresolvedFailures: receipt.unresolvedFailures,
}));

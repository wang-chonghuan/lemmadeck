import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

export function acceptOfflineEvidence(repo, base, report) {
  const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
  const verify = row => {
    const file = path.resolve(repo, row.path);
    const bytes = fs.readFileSync(file);
    assert.equal(bytes.length, row.bytes, row.path);
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),
      row.sha256, row.path);
    return row;
  };
  const first = read(verify(report.bindings.evidence).path);
  const recovery = read(verify(report.bindings.recoveryEvidence).path);
  const firstReceipt = read(verify(report.bindings.stageReceipt).path);
  const recoveryReceipt = read(verify(report.bindings.recoveryReceipt).path);
  const ids = ['desktop-text', 'desktop-written', 'desktop-choice',
    'mobile-text', 'mobile-written', 'mobile-choice'];
  const failedNames = ids.map(id => `${id}: no console/page errors`);
  assert.equal(report.stageExit, 1);
  assert.equal(firstReceipt.exitCode, 1);
  assert.equal(firstReceipt.stage, report.firstStage.name);
  assert.equal(recoveryReceipt.exitCode, 0);
  assert.equal(recoveryReceipt.stage, report.recovery.name);
  for (const receipt of [firstReceipt, recoveryReceipt]) {
    assert.equal(receipt.cwd, repo);
    assert.equal(receipt.command, 'node');
    assert.equal(receipt.error, null);
    assert.equal(receipt.signal, null);
    Object.values(receipt.outputs).forEach(verify);
  }
  assert.deepEqual(firstReceipt.args, [path.relative(repo,
    report.bindings.checker.path)]);
  assert.deepEqual(recoveryReceipt.args, [path.relative(repo,
    report.bindings.recoveryChecker.path)]);
  assert.equal(first.assertionVerdict, 'FAIL');
  assert.equal(first.assertions.length, 213);
  assert.equal(first.assertions.filter(row => row.verdict === 'PASS').length, 207);
  assert.deepEqual(first.assertions.filter(row => row.verdict !== 'PASS'),
    first.failures);
  assert.deepEqual(first.failures.map(row => row.name), failedNames);
  for (const failure of first.failures) {
    assert.equal(failure.verdict, 'FAIL');
    assert.equal(failure.actual.length, 1);
    assert(failure.actual[0].message.includes(
      "'file:' URLs are treated as unique security origins."));
  }
  assert.deepEqual(recovery.preservedFirstFailures, first.failures);
  verify(recovery.firstFailureEvidence);
  assert.equal(recovery.firstFailureEvidence.sha256,
    report.bindings.evidence.sha256);
  assert.equal(recovery.assertionVerdict, 'PASS');
  assert.deepEqual(recovery.failures, []);
  assert.deepEqual(recovery.cleanupErrors, []);
  assert.equal(recovery.diagnosis.instrumentationOriginConfirmed, true);
  assert.deepEqual(recovery.diagnosis.beforeCDP, []);
  assert.equal(recovery.diagnosis.allErrors.length, 1);
  assert.equal(recovery.diagnosis.allErrors[0].phase, 'CSS.enable');
  assert.deepEqual(recovery.recovery.map(row => row.assertion), failedNames);
  recovery.recovery.forEach(row => {
    assert.equal(row.verdict, 'PASS');
    assert.deepEqual(row.beforeCDP, []);
    assert.deepEqual(row.allErrors, []);
  });
  assert.equal(report.assertionVerdict,
    'PASS_WITH_AFFECTED_ONLY_TECHNICAL_RECOVERY');
  assert.equal(report.visualVerdict,
    'PASS_WITH_PERMITTED_LOCAL_FORMULA_SCROLLING');
  assert.deepEqual(report.unresolvedFailures, []);
  assert.deepEqual(report.failures.map(row => row.name), failedNames);
  report.failures.forEach(row => {
    assert.equal(row.firstVerdict, 'FAIL');
    assert.equal(row.status, 'RECOVERED');
    assert.equal(row.recoveryVerdict, 'PASS');
  });
  assert.equal(report.recovery.exit, 0);
  assert.equal(report.recovery.recoveredAssertions, 6);
  assert.equal(report.recovery.instrumentationOriginConfirmed, true);
  assert.equal(report.recovery.screenshotsCreated, 0);
  assert.equal(report.recovery.imageToolViews, 0);
  for (const network of [first.network, recovery.network, report.network]) {
    assert.equal(network.remoteDependencies, 0);
    assert.equal(network.offline, true);
  }
  for (const network of [first.network, recovery.network]) {
    assert.deepEqual(network.blockedRequests, []);
    assert.deepEqual(network.remoteResponses, []);
    assert(network.observedRequests.every(row => /^(file|data|about):/.test(row.url)));
  }
  assert.equal(report.accounting.actualImageToolViews, 6);
  assert.equal(report.accounting.screenshotCreationCount, 6);
  assert.equal(report.accounting.parentImagesOrDecodes, 0);
  assert.equal(report.accounting.visualStageReplays, 0);
  assert.equal(report.accounting.passedProductionStageReplays, 0);
  assert.equal(report.accounting.hiddenRendererBrowserInternalImageLoads, 'UNKNOWN');
  assert.equal(report.accounting.hiddenRendererBrowserInternalImageDecodes, 'UNKNOWN');
  assert.equal(first.accounting.screenshotCreationCount, 6);
  assert.equal(first.accounting.actualImageToolViews, 0);
  assert.equal(recovery.accounting.screenshotCreationCount, 0);
  assert.equal(recovery.accounting.actualImageToolViews, 0);
  assert.equal(first.cleanup.browserClosed, true);
  assert.equal(first.cleanup.contextsClosed, first.accounting.browserContextsCreated);
  assert.deepEqual(first.cleanup.errors, []);
  assert.equal(recovery.accounting.browserClosed, recovery.accounting.browserLaunches);
  assert.equal(recovery.accounting.browserContextsClosed,
    recovery.accounting.browserContextsCreated);
  assert.deepEqual(first.views.map(row => row.id), ids);
  assert.deepEqual(report.screenshots.map(row => row.id), ids);
  assert.equal(report.screenshots.length, 6);
  let clicks = 0;
  first.views.forEach((view, index) => {
    const screenshot = report.screenshots[index];
    assert.equal(screenshot.actualToolViews, 1);
    assert.equal(screenshot.fullPage, true);
    assert(screenshot.observation.length > 100);
    assert.equal(screenshot.sha256, view.screenshot.sha256);
    assert.equal(screenshot.bytes, view.screenshot.bytes);
    assert.equal(view.screenshot.captured, true);
    assert.deepEqual(view.errors, []);
    assert.deepEqual(view.dom.overlaps, []);
    assert.deepEqual(view.dom.clipping, []);
    assert.deepEqual(view.dom.mathProblems, []);
    assert(view.dom.ends.every(row => row.reachable));
    assert(view.localScrollers.every(row => row.left.reachable
      && row.right.reachable && row.right.position === row.right.max));
    for (const question of view.interactions ?? []) {
      assert.equal(question.crossQuestionIsolation, true);
      for (const click of question.nativeClicks) {
        clicks++;
        assert.equal(click.isolated, true);
        assert.deepEqual(click.otherQuestionsAfter, click.otherQuestionsBefore);
        const option = click.optionId.charCodeAt(0) - 97;
        const expected = click.before.map((value, position) =>
          question.mode === 'single' ? position === option
            : position === option ? click.action === 'select' : value);
        assert.deepEqual(click.after, expected);
      }
    }
  });
  assert.equal(clicks, 80);
  assert.equal(report.nativeInteractions.taskNativeClickTotal, clicks);
  assert.equal(first.counts.proseBlocks, 7);
  assert.equal(first.counts.displayedParagraphs, 8);
  assert.equal(first.counts.totalOptions, 26);
  assert.deepEqual(first.counts.writtenNumbers, ['375', '376', '377']);
  const bindings = [...Object.values(report.bindings.inputs),
    ...Object.entries(report.bindings).filter(([key]) => key !== 'inputs')
      .map(([, row]) => row), ...report.screenshots];
  bindings.forEach(verify);
  verify(recovery.checker);
  Object.values(recovery.inputs).forEach(verify);
  Object.values(first.bindings.inputs).forEach(verify);
  const countTree = value => value !== null && typeof value === 'object'
    ? 1 + Object.values(value).reduce((sum, child) => sum + countTree(child), 0) : 1;
  return {
    assertionVerdict: report.assertionVerdict,
    visualVerdict: report.visualVerdict,
    firstStageExit: 1, recoveredStageExit: 0,
    firstAssertions: 213, firstPasses: 207, preservedFirstFailures: 6,
    recoveredAssertions: 6, nativeClicks: clicks,
    bindingsVerified: bindings.length,
    structuredEvidenceNodesConsumed: countTree(first) + countTree(recovery),
    firstEvidenceBytes: report.bindings.evidence.bytes,
    verbatimFullLargeEvidenceReadClaimed: false,
    fullFinalReportsAndStageStreamsReadByParent: true,
    parentImagesOrDecodes: 0, semanticVisualStageReplays: 0,
  };
}

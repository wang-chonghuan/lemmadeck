import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, absolute, bytes, read, bind, verify, exists, immutableWrite, walk,
} from './retain-d016-evidence.mjs';

const mode = process.argv[2];
assert.ok(['--prepare', '--execute'].includes(mode));
assert.equal(process.argv.length, 3);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const original = `${ticket}/tmp/d447-n72-first-bilingual-text-author`;
const folder = `${ticket}/tmp/d479-n72-first-table-identity-repair`;
const reviewPath = `${ticket}/tmp/d461-n72-first-independent-text-review/report.json`;
const outcomePath = `${ticket}/tmp/d461-n72-first-independent-text-review/zhen-outcome.json`;
const review = await read(reviewPath);
assert.equal(review.SCI, 'PASS');
assert.equal(review.ZHEN, 'FAIL');
const outcome = await read(outcomePath);
assert.equal(outcome.findings.length, 1);
const finding = outcome.findings[0];
assert.equal(finding.id, 'T001');
const changes = finding.literalAffectedReplacements;
assert.equal(changes.length, 12);
const freeze = await read(`${original}/author-freeze.json`);
const inputs = freeze.files.filter(row => row.path.includes('/candidate/'));
assert.equal(inputs.length, 6);
function replaceAt(doc, pointer, replacement) {
  const parts = pointer.split('/').slice(1);
  let value = doc;
  for (const part of parts.slice(0, -1)) value = value[part];
  assert.ok(Object.hasOwn(value, parts.at(-1)), pointer);
  const before = value[parts.at(-1)];
  value[parts.at(-1)] = replacement;
  return before;
}
if (mode === '--prepare') {
  assert.equal(await exists(folder), false);
  for (const row of inputs) {
    await verify(row.path, row.sha256);
    await immutableWrite(`${folder}/${path.relative(absolute(original), row.path)}`, await bytes(row.path));
  }
  await immutableWrite(`${folder}/started.json`, serialize({
    ticket: 'STEMROBIN-181', batch: 'D033', finding: finding.id, changes, inputs,
    previousReview: await bind(reviewPath), previousOutcome: await bind(outcomePath),
    originalFreeze: await bind(`${original}/author-freeze.json`),
    newImages: 0, parentImageCount: 24, firstAndOnlyAffectedRepair: true,
  }));
  console.log(JSON.stringify({ prepared: await bind(`${folder}/started.json`), changes: changes.length }));
} else {
  const started = await read(`${folder}/started.json`);
  await verify(reviewPath, started.previousReview.sha256);
  await verify(outcomePath, started.previousOutcome.sha256);
  assert.equal(await exists(`${folder}/report.json`), false);
  const exactDiff = [], outputs = [];
  for (const input of inputs) {
    const suffix = path.relative(absolute(original), input.path);
    const target = `${folder}/${suffix}`;
    const before = await read(input.path);
    const expected = structuredClone(before);
    const affected = changes.filter(row => row.candidate === suffix);
    for (const change of affected) {
      exactDiff.push({
        candidate: suffix, pointer: change.pointer,
        before: replaceAt(expected, change.pointer, change.replacement), after: change.replacement,
      });
    }
    assert.deepEqual(await read(target), expected);
    if (!affected.length) assert.deepEqual(await bytes(target), await bytes(input.path));
    if (suffix.endsWith('lesson.template.json')) {
      assert.equal(expected.section_breaks[1].before, expected.prose[22].text);
    }
    await verify(input.path, input.sha256);
    outputs.push(await bind(target));
  }
  assert.equal(exactDiff.length, 12);
  await immutableWrite(`${folder}/exactdiff.json`, serialize({
    changes: exactDiff, changedFiles: 4, unchangedFiles: 2,
    onlyReviewerRequiredTableIdentityFieldsChanged: true,
    allSourceSnapshotsRefsMathDataAndOtherFieldsUnchanged: true,
  }));
  const reportPath = `${folder}/report.json`;
  await immutableWrite(reportPath, serialize({
    schema: 'n72-first-table-identity-repair@1', ticket: 'STEMROBIN-181', batch: 'D033',
    status: 'T001-SOLE-IDENTITY-REPAIR-FROZEN-AFFECTED-ZHEN-REVIEW-PENDING',
    previousReview: await bind(reviewPath), previousOutcome: await bind(outcomePath),
    originalFreeze: await bind(`${original}/author-freeze.json`),
    candidateBindings: outputs, exactdiff: await bind(`${folder}/exactdiff.json`),
    finding: 'T001', currentSCI: 'PASS-INHERITED-NO-SCI-CHANGE-OR-REPLAY',
    currentZHEN: 'pending-original-reviewer-affected-only',
    affectedSectionBreakBeforeMatchesCorrectedTableProse: true,
    receiptHelperFirstAttempt: {
      status: 'FAILED-OVERBROAD-UNRELATED-SECTION-AFTER-ASSERTION',
      candidateOrNativeFailure: false,
      correction: 'Limit the assertion to the changed table section-before binding; all other flow was already independently passed.',
      nativeRunsBeforeCorrection: 0,
    },
    originalProseFlowReceiptsRetained: true, proseFlowReruns: 0, nativeReruns: 0,
    sourceSnapshotsRefsMathTableDataAndUnrelatedProseUnchanged: true,
    sourcePagesAdded: 0, completeCardsAdded: 0, completeCard: false,
    SOURCE188: 'HOLD', SOURCE191: 'HOLD', RAW155: 'HOLD', SVG155: 'HOLD',
    newImages: 0, parentImageCount: 24, noImageBudgetReset: true,
    historicalFAILHOLDPreserved: true, newPaidGeneration: 0,
    newPermanentWorkersWorktreesBranches: 0, DBMergeDeployCommitPush: false,
  }));
  const files = [];
  for (const file of await walk(folder)) files.push(await bind(file));
  const freezePath = `${folder}/author-freeze.json`;
  await immutableWrite(freezePath, serialize({
    schema: 'n72-first-table-identity-repair-freeze@1', files, frozen: true, newImages: 0,
  }));
  for (const file of [...files.map(row => row.path), freezePath]) await fs.chmod(absolute(file), 0o444);
  console.log(JSON.stringify({ report: await bind(reportPath), freeze: await bind(freezePath), changedFields: 12 }));
}

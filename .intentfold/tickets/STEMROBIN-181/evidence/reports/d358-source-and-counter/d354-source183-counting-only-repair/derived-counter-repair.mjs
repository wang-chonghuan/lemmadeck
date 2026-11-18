import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, read, bytes, bind, verify, hash,
  exists, immutableWrite, walk,
} from "/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/retain-d016-evidence.mjs";

assert.deepEqual(process.argv.slice(2), ['--execute']);
const base = `${ticket}/tmp`, before = `${base}/d346-source183-first-author`;
const out = `${base}/d354-source183-counting-only-repair`;
assert.equal(await exists(`${out}/started.json`), false);
await verify(`${before}/report.json`, '96bac49749c788a700a05642aad4f733f84513a235a140c45cbe52d560765f6f');
await verify(`${before}/author-freeze.json`, '12160ca25845d731853a0cb2ba818af95dc30849e5dd7083e378b7baccb5f315');
const original = await read(`${before}/report.json`);
const oldPage = await read(`${before}/source/10p/pages/0183/page.json`);
const layoutFile = '.claude/skills/ld-s10y-lesson/tools/layout.py';
const testFile = '.claude/skills/ld-s10y-lesson/tests/test_small_footnote_continuation.py';
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const head = spawnSync('git', ['show', `HEAD:${layoutFile}`], { cwd: root, encoding: 'utf8' });
assert.equal(head.status, 0, head.stderr);
const oldLayout = head.stdout.replace('out[-1][1] = b', 'out[-1][1] = max(out[-1][1], b)');
const expectedOldLayout = original.native_finalize.tools.find(row => row.path.endsWith('/tools/layout.py'));
assert.equal(hash(Buffer.from(oldLayout)), expectedOldLayout.sha256);
await immutableWrite(`${out}/tools/layout.before.py`, oldLayout);
await immutableWrite(`${out}/tools/layout.repaired.py`, await bytes(layoutFile));
await immutableWrite(`${out}/tools/test_small_footnote_continuation.py`, await bytes(testFile));
await immutableWrite(`${out}/started.json`, serialize({
  ticket: 'STEMROBIN-181', page: 183, scope: 'Native counting only; no author-text repair',
  originalNativeFAIL: await bind(`${before}/report.json`),
  originalCounterBytesReconstructedFromHeadAndPreservedDirtyDelta: true,
  reconstructedCounterMatchesOriginalReceiptSHA256: true,
  preexistingNestedIntervalUnionFixPreserved: true,
  affectedBandBefore: [1805, 1880], visiblePrintedFootnoteRows: 2,
  sourceTextAuthorRepairs: 0, counterRepairCount: 1, parentImageOpens: 0,
}));
for (const folder of ['source', 'work']) {
  await fs.cp(absolute(`${before}/${folder}`), absolute(`${out}/${folder}`),
    { recursive: true, errorOnExist: true, force: false });
  for (const file of await walk(`${out}/${folder}`)) await fs.chmod(absolute(file), 0o644);
}
const receipts = [];
for (const [operation, args] of [
  ['focused-counter-tests', ['-B', testFile]],
  ['finalize-183', ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize',
    '--book', '10p', '--page', '183', '--root', absolute(`${out}/source`),
    '--work', absolute(`${out}/work`)]],
]) {
  const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', ...args];
  const startedUtc = new Date().toISOString();
  const result = spawnSync(command[0], command.slice(1), {
    cwd: root, encoding: 'utf8', timeout: 120000,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  const receiptPath = `${out}/native/${operation}.receipt.json`;
  await immutableWrite(receiptPath, serialize({
    command, startedUtc, finishedUtc: new Date().toISOString(),
    exitCode: result.status, stdout: result.stdout, stderr: result.stderr, invocationCount: 1,
  }));
  receipts.push({ operation, ...await bind(receiptPath), exitCode: result.status });
  if (result.status !== 0) {
    await immutableWrite(`${out}/terminal-FAIL.json`, serialize({
      status: 'FAIL-counting-only-repair', failedOperation: operation, receipts,
      originalFAILPreserved: true, authorTextUnchanged: true, sourcePassClaimed: false,
    }));
    console.log(JSON.stringify({ status: 'FAIL', operation, receipt: await bind(receiptPath) }));
    process.exitCode = 1;
    break;
  }
}
if (!process.exitCode) {
  const current = await read(`${out}/source/10p/pages/0183/page.json`);
  const audit = await read(`${out}/source/10p/pages/0183/audit.json`);
  assert.deepEqual(current, oldPage);
  assert.deepEqual(await bytes(`${out}/source/10p/pages/0183/page.md`),
    await bytes(`${before}/source/10p/pages/0183/page.md`));
  assert.equal(audit.lines_printed, 26);
  assert.equal(audit.lines_md, 26);
  assert.deepEqual(audit.errors, []);
  for (const id of ['fig-141', 'fig-142']) {
    const tail = `work/10p/pages/0183/figures/${id}.png`;
    assert.deepEqual(await bytes(`${out}/${tail}`), await bytes(`${before}/${tail}`));
  }
  await immutableWrite(`${out}/report.json`, serialize({
    ticket: 'STEMROBIN-181', batch: 'D033', page: 183,
    status: 'COUNTING-ONLY-REPAIR-NATIVE-26-26-PASS-FIRST-INDEPENDENT-REVIEW-PENDING',
    originalNativeFAIL: await bind(`${before}/report.json`),
    originalRowDiagnosis: await bind(`${before}/affected-row-band-diagnosis.json`),
    receipts, nativePrintedRows: 26, faithfulAuthoredRows: 26,
    authoredTextAndAllMetadataByteIdentical: true,
    RAW141RAW142PNGByteIdentical: true,
    preexistingDirtyNestedIntervalUnionFixPreserved: true,
    counterRepairCount: 1, sourceTextRepairCount: 0,
    vectorizeRuns: 0, independentReviewRuns: 0,
    SOURCE: 'HOLD-first-independent-review', RAW: 'HOLD-first-vectorize-and-independent-review',
    parentImageOpens: 0, parentImageCount: 24,
    originalFAILHOLDAndUncommittedBytesPreserved: true,
    canonicalPromotions: 0, completeCardClaim: false,
    newWorkersWorktreesBranches: 0, paidGeneration: 0,
    DBMergeDeployCommitPushOrWholeProjectChecks: false,
  }));
  const files = await Promise.all((await walk(out)).map(bind));
  await immutableWrite(`${out}/author-freeze.json`, serialize({
    ticket: 'STEMROBIN-181', page: 183, status: 'COUNTING-ONLY-REPAIR-FROZEN',
    report: await bind(`${out}/report.json`), files, newImages: 0, fileMode: '0444',
  }));
  for (const file of await walk(out)) await fs.chmod(absolute(file), 0o444);
  console.log(JSON.stringify({ report: await bind(`${out}/report.json`),
    freeze: await bind(`${out}/author-freeze.json`), native: '26/26',
    sourceTextRepairs: 0, vectorizeRuns: 0 }));
}

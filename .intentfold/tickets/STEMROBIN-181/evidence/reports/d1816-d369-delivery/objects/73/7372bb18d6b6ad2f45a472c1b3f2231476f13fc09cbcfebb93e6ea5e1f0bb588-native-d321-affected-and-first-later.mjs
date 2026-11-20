import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d321-source376-379-affected-recovery`;
const Q = `${T}/tmp/d1816-d322-source376-379-affected-review`;
const root = '.tmp/STEMROBIN-181/d1816-d321/root';
const work = '.tmp/STEMROBIN-181/d1816-d321/source-work';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
  return bind(file);
};
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(to, 0o444);
  assert.equal(bind(from).sha256, bind(to).sha256);
  return bind(to);
};
const splitPage = file => {
  const value = fs.readFileSync(file, 'utf8');
  const delimiter = value.indexOf('\n---\n');
  assert(delimiter > 4);
  return { meta: JSON.parse(value.slice(4, delimiter)), body: value.slice(delimiter + 5) };
};
assert(!fs.existsSync(`${O}/result.json`));
assert(!fs.existsSync(Q));
const testReceipt = `${T}/tmp/d1816-recovery/native/d321-counting-bottom-margin-corrected-fixture-tests/receipt.json`;
assert.equal(read(testReceipt).exitCode, 0);
const prepared = read(`${O}/prepared.json`);
const drafts = prepared.originals.map(({ page, before }) => {
  const current = `${root}/10p/pages/${String(page).padStart(4, '0')}/page.md`;
  const previous = splitPage(before.path);
  const candidate = splitPage(current);
  let body = previous.body;
  if (page === 376) {
    body = body.replace('和$\\mu$介子.', '和$\\pi$介子.')
      .replace('的；基本性是不可改变的', '的；其本性是不可改变的')
      .replace('应当称为基本粒子，也不知道', '应当称为基本粒子. 也不知道');
    const { counting, ...meta } = candidate.meta;
    assert.deepEqual(meta, previous.meta);
    assert.equal(counting.bottom_margin_px, 137);
  } else if (page === 379) {
    body = body.replace('勃纳市首次在世界上实现：', '勒纳市首次在世界上实现；');
    assert.deepEqual(candidate.meta, previous.meta);
  } else {
    assert.equal(bind(current).sha256, before.sha256);
  }
  assert.equal(candidate.body, body, `Only approved defects changed on ${page}`);
  return { page, before, draft: copy(current, `${O}/pre-native/${page}.page.md`) };
});
const code = ['layout.py', 'p2c.py'].map(name =>
  copy(`.claude/skills/ld-s10y-lesson/tools/${name}`, `${O}/input-code/${name}`));
const tests = copy('.claude/skills/ld-s10y-lesson/tests/test_counting_bottom_margin.py',
  `${O}/input-code/test_counting_bottom_margin.py`);
const freeze = save(`${O}/affected-author-freeze.json`, {
  batch: 'D321', prepared: bind(`${O}/prepared.json`), drafts, code, tests,
  testReceipt: bind(testReceipt), firstTestFailure: bind(`${T}/tmp/d1816-recovery/native/d321-counting-bottom-margin-focused-tests/receipt.json`),
  failedTestFixture: bind(`${O}/failed-synthetic-test.py`),
  contentRepairsConsumed: 1, remainingContentRepairs: 0,
  sourcePixelsUnchanged: true, parentImageOpens: 0, sourceApproval: false,
});
const native = [];
let failure = null;
const call = (page, action) => {
  const name = `d321-source${page}-${page === 376 ? 'affected-recovery' : 'first'}-${action}`;
  const result = spawnSync(process.execPath, [
    `${T}/tmp/d1816-recovery/run-native.mjs`, name,
    '.claude/skills/ld-s10y-lesson/.venv/bin/python',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', action,
    '--book', '10p', '--page', String(page), '--root', root, '--work', work,
  ], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  process.stdout.write(result.stdout || '');
  process.stderr.write(result.stderr || '');
  const directory = `${T}/tmp/d1816-recovery/native/${name}`;
  const receipt = read(`${directory}/receipt.json`);
  const row = { page, action, exitCode: receipt.exitCode,
    files: ['receipt.json', 'stdout.txt', 'stderr.txt'].map(name =>
      copy(`${directory}/${name}`, `${O}/native/${page}-${action}/${name}`)) };
  native.push(row);
  if (receipt.exitCode !== 0) failure = row;
};
for (const page of [376, 377, 378, 379]) {
  call(page, 'finalize');
  if (failure) break;
  const parsed = read(`${root}/10p/pages/${String(page).padStart(4, '0')}/page.json`);
  if (parsed.meta.figures.length) {
    call(page, 'vectorize');
    if (failure) break;
  }
}
const current = [376, 377, 378, 379].map(page => {
  const directory = `${root}/10p/pages/${String(page).padStart(4, '0')}`;
  return { page, files: ['page.md', 'page.json', 'audit.json'].filter(name =>
    fs.existsSync(`${directory}/${name}`)).map(name => bind(`${directory}/${name}`)) };
});
const result = save(`${O}/result.json`, {
  batch: 'D321', root, work, affectedAuthorFreeze: freeze, current, native, failure,
  status: failure ? 'native-failure-preserved' : 'native-pass-affected-source-review-pending',
  passedSource377378ReviewsReused: true, firstFailed376ReceiptRetained: true,
  onlyAffectedContentRepairs: [376, 379], laterNativeStagesWereUnexecutedBeforeThisCall: true,
  sourceApproval: false, sourcePagesAdded: 0, completeCoursesAdded: 0,
  parentImageOpens: 0, newPaidCalls: 0, databaseWrites: false,
});
const sourceOnly = save(`${Q}/source-only.json`, {
  batch: 'D322', role: 'AFFECTED_ONLY_FROM_PRIOR_INDEPENDENT_ORIGINAL_PIXELS_NO_REOPEN',
  priorIndependentReview: prepared.report,
  expectedFindings: prepared.intendedContentEdits,
  expectedRows: [21, 25, 25, 25], expectedCountingBoundary: prepared.countingBoundary,
  passed377378SourceReviewsReused: true, originalScriptAndRawFigureHoldsUnchanged: true,
  instructions: 'Freeze expectations from D312 before current candidate. Compare only five text differences on376/379 and new counting-only bottom boundary. No full source rereview, no original image reopen, no RAW/SVG approval.',
});
const afterBaseline = save(`${Q}/after-baseline.json`, {
  result, affectedAuthorFreeze: freeze, current, native,
  sourceReviewOnly: true, sourceApproval: false, repairsAuthorized: false,
});
const input = save(`${Q}/input-freeze.json`, {
  batch: 'D322', sourceOnly, afterBaseline, imagesAuthorized: 0,
  contentRepairsConsumed: 1, remainingContentRepairs: 0,
  completeCoursesAdded: 0, parentImageOpens: 0, paidCalls: 0,
});
const file = `${T}/production-meter.json`;
const meter = read(file);
Object.assign(meter.currentResume1816.D321, {
  status: failure ? 'NATIVE_FAILURE_PRESERVED' : 'AFFECTED376_FIRST377379_NATIVE_PASS_REVIEW_PENDING',
  result, affectedAuthorFreeze: freeze,
});
meter.currentResume1816.D322 = {
  status: 'AFFECTED_SOURCE376_379_ZERO_IMAGE_REVIEW_INPUT_READY',
  inputFreeze: input, reviewer: null, reviewerClosed: false, imagesAuthorized: 0,
  sourcePagesAdded: 0, completeCoursesAdded: 0,
};
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ result, failure, inputFreeze: input, sourceApproval: false }));

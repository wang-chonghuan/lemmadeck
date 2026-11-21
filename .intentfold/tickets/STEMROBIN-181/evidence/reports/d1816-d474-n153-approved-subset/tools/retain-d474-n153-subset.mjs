import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const C = '.tmp/STEMROBIN-181/d1816-d470-n153-nonheld';
const V = `${T}/tmp/d1816-d471-review61-nonheld-package-review`;
const D = `${T}/tmp/d1816-d472-n153-subset-display`;
const O = `${T}/evidence/reports/d1816-d474-n153-approved-subset`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({
  path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
  bytes: fs.statSync(file).size,
});
const combined = read(`${C}/report.json`);
const display = read(`${D}/result.json`);
const native = read(`${D}/native-recovery-result.json`);
assert(!fs.existsSync(`${O}/retained-progress.json`));
assert.equal(display.status, 'offline-approved-subset-display-pass-pixels-pending');
assert.equal(native.failure.exitCode, 2);
assert.equal(read(`${V}/report.json`).status, 'AGGREGATE_RELATIONSHIPS_PASS_CONDITIONAL');
const retained = [];
const copy = (from, suffix, expected) => {
  const original = bind(from);
  if (expected) assert.equal(original.sha256, expected.sha256);
  const target = `${O}/${suffix}`;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(from, target, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(target, 0o444);
  const output = bind(target);
  assert.equal(output.sha256, original.sha256);
  retained.push({ ...output, originalPath: original.path });
  return output;
};
for (const product of combined.products) {
  const locale = product.locale;
  for (const [name, binding] of [
    ['seed.json', product.seed], ['draft.json', product.draft],
    ['answer-keys.json', product.readonly], ['learner-views.json', product.learnerViews],
  ]) copy(binding.path, `${locale}/${name}`, binding);
  copy(`${V}/${locale}-review.json`, `${locale}/review.json`);
  for (const trace of read(product.seed.path).trace) {
    const suffix = trace.path.endsWith('/book.json')
      ? 'book.json' : path.basename(trace.path);
    copy(`${product.repo}/${trace.path}`, `${locale}/source-snapshot/${suffix}`, trace);
  }
}
for (const file of ['report.json', 'review-freeze.json', 'aggregate-relationships.json',
  'transfer-proof.json', 'first-execution-failure.json'])
  copy(`${V}/${file}`, `aggregate/${file}`);
copy(`${C}/report.json`, 'combined-report.json');
for (const file of ['input-freeze.json', 'native-result.json', 'native-recovery-result.json',
  'result.json', 'check-first-execution.mjs'])
  copy(`${D}/${file}`, `display/${file}`);
for (const row of display.records) {
  copy(row.html.path, `display/${path.basename(row.html.path)}`, row.html);
  if (row.screenshot) copy(row.screenshot.path,
    `display/${path.basename(row.screenshot.path)}`, row.screenshot);
}
for (const name of [
  'd472-n153-zh-first-adapt-finalize', 'd472-n153-zh-template-recovery-adapt-finalize',
  'd472-n153-subset-display', 'd472-n153-subset-display-table-recovery',
  'd472-n153-native-template-recovery',
]) for (const file of ['receipt.json', 'stdout.txt', 'stderr.txt'])
  copy(`${T}/tmp/d1816-recovery/native/${name}/${file}`, `native/${name}/${file}`);
for (const name of ['check-d472-n153-approved-subset.mjs', 'recover-d472-native-templates.mjs',
  'retain-d474-n153-subset.mjs'])
  copy(`${T}/tmp/d1816-recovery/${name}`, `tools/${name}`);
const report = {
  stage: 'D474', status: 'approved-subset-retained-whole-course-held',
  lesson: 'phy10-c4-s3', retained,
  perLocale: { written: 59, readonly: 59, choices: 55, options: 220 },
  heldSourceIds: ['2', '10'], readonlyOnlySourceIds: ['1', '6', '35', '43'],
  retentionRoute: 'Exact approved snapshots retained as ticket evidence, not a canonical finalized course.',
  nativeFailure: 'Full61 candidate still references fig08 absent from figures.json; official finalizer exit2 retained after template-only recovery.',
  canonicalChoiceRetention: false,
  canonicalRetentionBoundary: 'retain_choices.py requires the real checkout and its current canonical modern lesson; the approved simulated locale projections are not production checkouts. No ownership bypass or fabricated subset raw course.',
  displayDOM: '12 surfaces pass; two initial surfaces reused after Markdown table assertion recovery.',
  independentPixels: 'PENDING-D473', memberReviewsReplayed: false,
  approvedContentChanged: false, full61Approval: false, wholeCourseApproval: false,
  sourcePagesAdded: 0, completeCoursesAdded: 0, parentImageOpens: 0, paidCalls: 0,
  databaseWrites: false, publisher: false, newCommit: false, newPush: false,
};
fs.writeFileSync(`${O}/retained-progress.json`, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
fs.chmodSync(`${O}/retained-progress.json`, 0o444);
console.log(JSON.stringify({ retained: bind(`${O}/retained-progress.json`), files: retained.length,
  canonicalCourseRetention: false, completeCoursesAdded: 0 }));

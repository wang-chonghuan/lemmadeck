import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d325-source383-385-affected-recovery`;
const Q = `${T}/tmp/d1816-d326-source383-385-affected-review`;
const root = '.tmp/STEMROBIN-181/d1816-d325/root';
const work = '.tmp/STEMROBIN-181/d1816-d325/source-work';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const first = read(`${O}/result.json`);
assert.equal(first.failure.page, 384);
assert.equal(first.native[0].exitCode, 0);
const figure = `${work}/10p/pages/0384/figures/fig-277.png`;
const svg = `${work}/10p/pages/0384/figures/fig-277.svg`;
const before = { png: bind(figure), svg: bind(svg) };
assert.equal(before.png.sha256, bind('.tmp/STEMROBIN-181/d1816-d316/source-work/10p/pages/0384/figures/fig-277.png').sha256);
const native = [];
let failure = null;
for (const page of [384, 385]) {
  const name = `d325-source${page}-${page === 384 ? 'working-png-permission-recovery' : 'first-affected'}-finalize`;
  const result = spawnSync(process.execPath, [
    `${T}/tmp/d1816-recovery/run-native.mjs`, name,
    '.claude/skills/ld-s10y-lesson/.venv/bin/python',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize',
    '--book', '10p', '--page', String(page), '--root', root, '--work', work,
  ], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  process.stdout.write(result.stdout || '');
  process.stderr.write(result.stderr || '');
  const receipt = bind(`${T}/tmp/d1816-recovery/native/${name}/receipt.json`);
  const row = { page, receipt, exitCode: read(receipt.path).exitCode };
  native.push(row);
  if (row.exitCode !== 0) { failure = row; break; }
}
assert.equal(bind(figure).sha256, before.png.sha256, 'Passed raw crop must remain byte-identical');
assert.equal(bind(svg).sha256, before.svg.sha256, 'Passed vectorization was not rerun');
const current = [383, 384, 385].map(page => ({
  page, files: ['page.md', 'page.json', 'audit.json'].filter(name =>
    fs.existsSync(`${root}/10p/pages/0${page}/${name}`)).map(name => bind(`${root}/10p/pages/0${page}/${name}`)),
}));
const value = {
  batch: 'D325', role: 'WORKING_PNG_PERMISSION_ONLY_RECOVERY_NO_CONTENT_REPAIR',
  firstFailure: bind(`${O}/result.json`), firstFailedReceiptUnchanged: first.failure.receipt,
  cause: 'Reused editable working PNG was copied mode0444; finalize writes that crop. Only working PNG chmodu+w, immutable snapshots and original source pixels unchanged.',
  passed383Reused: first.native[0], native, current, failure, before,
  originalPngAndSvgBytesUnchanged: true, vectorizationNotReplayed: true,
  additionalContentRepairs: 0, parentImageOpens: 0,
  sourceApproval: false, sourcePagesAdded: 0, completeCoursesAdded: 0,
};
const output = `${O}/technical-recovery.json`;
fs.writeFileSync(output, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const supplement = `${Q}/native-recovery-supplement.json`;
fs.writeFileSync(supplement, JSON.stringify({
  batch: 'D326', initialInput: bind(`${Q}/input-freeze.json`),
  recovery: bind(output), current, failure, imagesAuthorized: 0,
  instructions: 'Use recovered current candidates and passed383 evidence; preserve initial384permission failure. Compare only seven D317 source findings, no image/native/fullsource replay.',
  sourceApproval: false, completeCoursesAdded: 0,
}, null, 2) + '\n', { flag: 'wx' });
const file = `${T}/production-meter.json`;
const meter = read(file);
Object.assign(meter.currentResume1816.D325, {
  status: failure ? 'PERMISSION_RECOVERY_FAILURE_RETAINED' : 'SOURCE383_385_AFFECTED_NATIVE_PASS_ZERO_IMAGE_REVIEW_PENDING',
  technicalRecovery: bind(output), firstFailureRetained: true,
});
Object.assign(meter.currentResume1816.D326, {
  status: 'ZERO_IMAGE_SEVEN_FINDING_AFFECTED_REVIEW_INPUT_READY',
  nativeRecoverySupplement: bind(supplement),
});
Object.assign(meter.currentResume1816.D320, {
  status: 'FIRST_RAW277_FINE_DETAIL_THREE_IMAGE_REVIEW_ACTIVE',
  reviewer: '01a1fad7-e777-7292-b0ba-11dc6053f7b5',
});
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ recovery: bind(output), supplement: bind(supplement), failure }));

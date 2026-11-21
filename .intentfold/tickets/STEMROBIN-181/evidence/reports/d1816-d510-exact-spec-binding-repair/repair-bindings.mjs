import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/evidence/reports/d1816-d510-exact-spec-binding-repair`;
const R = 'ssot-resources/soviet10year-textbooks/artifacts';
const N = `${T}/tmp/d1816-recovery/native`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({
  path: path.resolve(file), bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
});
const log = `${N}/d509-review-textbook-manifest-validation/stderr.txt`;
const candidates = fs.readFileSync(log, 'utf8').trim().split('\n').map(line =>
  line.match(/^FAIL (?:9p|10p): (\S+) has (?:non-durable FigureSpec path|a stale FigureSpec sha256)/)?.[1])
  .filter(Boolean);
assert.equal(candidates.length, 25);
assert(!fs.existsSync(O));
const plan = [];
const held = [];
for (const file of candidates) {
  assert(file.startsWith(`${R}/9p/`) || file.startsWith(`${R}/10p/`));
  const before = read(file);
  const currentSpec = file.replace(/\.(?:render|review|independent-review)\.json$/, '.spec.json');
  const target = bind(currentSpec);
  if (target.sha256 !== before.spec.sha256) {
    held.push({ file: bind(file), spec: before.spec, currentSpec: target,
      reason: 'Expected approved spec SHA differs; no hash substitution or semantic approval.' });
    continue;
  }
  const after = structuredClone(before);
  after.spec.path = path.relative(repo, target.path);
  const restored = structuredClone(after);
  restored.spec.path = before.spec.path;
  assert.deepEqual(restored, before);
  plan.push({ file, before, after, target });
}
assert.equal(plan.length, 24);
assert.equal(held.length, 1);
fs.mkdirSync(O, { recursive: true });
const changes = [];
for (const row of plan) {
  const original = bind(row.file);
  const relative = path.relative(R, row.file);
  const backup = `${O}/before/${relative}`;
  fs.mkdirSync(path.dirname(backup), { recursive: true });
  fs.copyFileSync(row.file, backup, fs.constants.COPYFILE_EXCL);
  assert.equal(bind(backup).sha256, original.sha256);
  fs.writeFileSync(row.file, JSON.stringify(row.after, null, 2) + '\n');
  const current = read(row.file);
  assert.equal(bind(current.spec.path).sha256, current.spec.sha256);
  const restored = structuredClone(current);
  restored.spec.path = row.before.spec.path;
  assert.deepEqual(restored, row.before);
  changes.push({ before: { ...original, retained: bind(backup) }, after: bind(row.file),
    oldSpecBinding: row.before.spec, currentSpec: row.target,
    changedPointers: ['spec.path'], sourceSpecBytesChanged: false,
    originalApprovalStatus: row.before.status });
}
const duplicateBackups = [];
for (const name of ['fig-278.png', 'fig-278.svg']) {
  const original = `${R}/10p/pages/0404/figures/${name}`;
  const canonical = `${R}/10p/figures/${name}`;
  const source = bind(original);
  const target = bind(canonical);
  if (source.sha256 !== target.sha256) continue;
  const tracked = execFileSync('git', ['ls-files', '--', original], {
    cwd: repo, encoding: 'utf8',
  }).trim();
  assert.equal(tracked, '', 'Do not relocate other tracked or unrelated duplicate files');
  const backup = `${O}/page-0404-duplicates/${name}`;
  fs.mkdirSync(path.dirname(backup), { recursive: true });
  fs.renameSync(original, backup);
  assert.equal(bind(backup).sha256, source.sha256);
  assert.equal(bind(canonical).sha256, target.sha256);
  duplicateBackups.push({ original: source, retained: bind(backup), canonical: target,
    byteIdentical: true, otherPageDuplicatesUntouched: true });
}
const report = {
  stage: 'D510', status: 'EXACT_SPEC_PATH_REPAIR_PASS_STALE_SHA_HOLD_PRESERVED',
  originalValidation: bind(log), changes, held, duplicateBackups,
  specAndImageBytesChanged: false, mathematicalOrVisualReviewsReplayed: false,
  originalFailuresAndApprovalReportsRetained: true, newlyApprovedFigures: 0,
  newCompleteCourses: 0, newSourcePages: 0, paidCalls: 0, parentNewImageOpens: 0,
  wholeResourceAuditPass: false, wholeTextbookValidationPass: false,
  formalHandoffComplete: false, sourcePagesRecounted: false,
};
fs.writeFileSync(`${O}/repair.json`, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
fs.copyFileSync(`${T}/tmp/d1816-recovery/repair-d510-exact-spec-bindings.mjs`,
  `${O}/repair-bindings.mjs`, fs.constants.COPYFILE_EXCL);
const meterPath = `${T}/production-meter.json`;
const meter = read(meterPath);
assert.equal(meter.sourcePagesFinalized, 577);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 146);
meter.currentResume1816.D510 = {
  status: report.status, repair: bind(`${O}/repair.json`),
  specPathBindingsRepaired: changes.length, originalSpecShaMismatchHeld: held.length,
  ownUntrackedPageDuplicateBackups: duplicateBackups.length,
  sourcePagesAdded: 0, completeCoursesAdded: 0, contentReviewsReplayed: false,
  parentNewImageOpens: 0, formalHandoffComplete: false,
};
fs.writeFileSync(meterPath, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ repair: bind(`${O}/repair.json`),
  changedSpecBindings: changes.length, heldSpecShaMismatches: held.length,
  ownDuplicateBackups: duplicateBackups.length, imagesOpened: 0, newCompleteCourses: 0 }));

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/evidence/reports/d1816-d138-delivery`;
const ready = JSON.parse(fs.readFileSync(`${O}/batch-ready.json`));
const previous = JSON.parse(fs.readFileSync(`${T}/tmp/d1816-recovery/d120-approved-scope.json`));
const git = args => execFileSync('git', args, { cwd: repo, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }).trim();
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(row =>
  row.isDirectory() ? walk(`${dir}/${row.name}`) : [`${dir}/${row.name}`]);
const save = (file, value, exclusive = false) =>
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: exclusive ? 'wx' : 'w' });
const scopeFile = `${T}/tmp/d1816-recovery/d138-staged-scope.json`;
assert(!fs.existsSync(scopeFile));
assert.equal(git(['rev-parse', 'HEAD']), previous.parent);
assert.equal(previous.staged, true);
const alreadyStaged = git(['diff', '--cached', '--name-only']).split('\n').filter(Boolean);
assert.deepEqual(new Set(alreadyStaged), new Set(previous.actualStagedFiles));
assert.equal(ready.status, 'complete-retained-unbatched');
assert.deepEqual(ready.cards, ['phy9-c1-s3-t9']);
for (const row of ready.productBindings) assert.equal(bind(row.path).sha256, row.sha256, row.path);
const cards = ['phy9-c1-s2-n19', 'phy9-c1-s3-t9'];
const meterFile = `${T}/production-meter.json`;
const meter = JSON.parse(fs.readFileSync(meterFile));
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 134);
assert.deepEqual(meter.currentCheckpoint.completeUnbatchedCards, [cards[0]]);
meter.currentCheckpoint.completeUnbatchedCards.push(cards[1]);
meter.currentResume1816.D138.status = 'COMPLETE_OFFLINE_TWO_COURSE_BATCH_READY_TO_COMMIT_PUSH';
meter.currentResume1816.D138.completeCoursesAdded = 1;
meter.currentResume1816.D138.canonicalPromotions = 1;
meter.currentResume1816.D138.independentApproval = true;
meter.currentResume1816.D138.readiness = bind(`${O}/batch-ready.json`);
meter.currentResume1816.D138.deliveryCards = cards;
meter.currentResume1816.currentContinuation = '134 complete courses pushed plus2 complete unbatched n19 and T9;561 SOURCE,136 captured book answers. D138 English native tool recovery and44 focused tests PASS. T9 all6 original written tasks,6 bilingual readonly standards,6 bilingual choice units/24options and2 modern figures independently PASS.12 current offline screenshot verdicts composed PASS from original unaffected screenshots and bounded affected-only reviews; original ZH formula-clipping and EN cubic-unit-wrap failures preserved. Two preview-layout-only repairs preserve every TeX annotation and source/answer/choice byte. Approved T9 files retained byte-exact, choice retention native gate PASS, index-only additions preserve unchanged n19. Existing183 staged files reused, source187/307 and all unapproved diagrams/earlier HOLDs excluded. Two-course recovered/text-intensive batch ready for same branch commit/push; no DB, deploy, parent images, paid calls or formal handoff.';
meter.deliveryBatches.push({
  id: 'D138', cards, status: 'complete-ready-to-commit-push', newlyCompletedCards: 2,
  evidence: bind(`${O}/batch-ready.json`), elapsedSeconds: null, inputTokens: null,
  outputTokens: null, costUsd: null,
  batchSizing: 'One recovered prose course plus one complete text-intensive exercise set; unresolved earlier HOLDs stay out.',
});
meter.updatedAt = new Date().toISOString();
save(meterFile, meter);
const indexFile = `${T}/evidence/index.json`;
const index = JSON.parse(fs.readFileSync(indexFile));
index.updatedAt = meter.updatedAt;
for (const file of walk(O)) {
  assert(!index.reports.some(row => row.path === file), file);
  index.reports.push({ ...bind(file), batch: 'D138' });
}
save(indexFile, index);
const addedScope = [...new Set([
  ...ready.productBindings.map(row => row.path), ...walk(O), meterFile, indexFile,
  '.claude/skills/ld-s10y-lesson/tools/edition.py',
  '.claude/skills/ld-s10y-lesson/tests/test_english_edition_identity.py',
])];
const allowed = new Set([...alreadyStaged, ...addedScope]);
for (const file of allowed) {
  assert(!/(^|\/)\.env(?:\/|$)/.test(file), file);
  assert(!/\/pages\/(?:0187|0307)\//.test(file), file);
}
git(['add', '--', ...addedScope]);
const staged = git(['diff', '--cached', '--name-only']).split('\n').filter(Boolean);
assert(staged.every(file => allowed.has(file)));
git(['diff', '--cached', '--check']);
save(scopeFile, {
  parent: previous.parent, cards, staged, previousStagingReused: alreadyStaged.length,
  additionalApprovedScope: addedScope, completeDeliveredBefore: 134,
  excludedExistingSourceChanges: [187, 307], wholeProjectChecks: false,
  databaseWrites: false, formalHandoff: false, commit: false, push: false,
}, true);
console.log(JSON.stringify({ stagedScope: bind(scopeFile), stagedFiles: staged.length,
  previousStagingReused: alreadyStaged.length, cards, deliveredBefore: 134 }));

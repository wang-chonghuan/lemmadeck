import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/evidence/reports/d1816-d144-n8-delivery`;
const parent = '5232d95fa40340e4700959058323f28a37605ac8';
const id = 'phy9-c1-s1-n8';
const read = file => JSON.parse(fs.readFileSync(file));
const git = args => execFileSync('git', args, { cwd: repo, encoding: 'utf8',
  maxBuffer: 16 * 1024 * 1024 }).trim();
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(row =>
  row.isSymbolicLink() ? [] : row.isDirectory() ? walk(`${dir}/${row.name}`) : [`${dir}/${row.name}`]);
const scopeFile = `${T}/tmp/d1816-recovery/d144-staged-scope.json`;
assert(!fs.existsSync(scopeFile));
assert.equal(git(['rev-parse', 'HEAD']), parent);
assert.equal(git(['rev-parse', 'refs/remotes/origin/codex/STEMROBIN-181-textbooks']), parent);
assert.equal(git(['diff', '--cached', '--name-only']), '');
const ready = read(`${O}/batch-ready.json`);
assert.equal(ready.status, 'complete-retained-unbatched');
assert.deepEqual(ready.cards, [id]);
for (const row of ready.productBindings) assert.equal(bind(row.path).sha256, row.sha256, row.path);
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 136);
assert.deepEqual(meter.currentCheckpoint.completeUnbatchedCards, []);
assert(!meter.deliveryBatches.some(row => row.id === 'D144'));
meter.currentCheckpoint.completeUnbatchedCards = [id];
Object.assign(meter.currentResume1816.D144, {
  status: 'COMPLETE_N8_OFFLINE_BATCH_READY_TO_COMMIT_PUSH',
  completeCoursesAdded: 1, canonicalPromotions: 1, independentApproval: true,
  readiness: bind(`${O}/batch-ready.json`), deliveryCards: [id],
});
meter.deliveryBatches.push({
  id: 'D144', cards: [id], status: 'complete-ready-to-commit-push',
  newlyCompletedCards: 1, evidence: bind(`${O}/batch-ready.json`),
  batchSizing: 'One complete bilingual source-rich instructional course; N9 and earlier unresolved HOLDs are independent progress, not complete courses.',
  elapsedSeconds: null, inputTokens: null, outputTokens: null, costUsd: null,
});
meter.currentResume1816.currentContinuation =
  '136 complete courses pushed plus1 complete unbatched N8. N8 first SCI/ZH/EN, current fig05 independent source/geometry/visual, native finalize/render and four offline surfaces/pixels PASS. Author first figure failure and technical preview recovery preserved; parent copy-permission failure recovered only at failed step. N9 text author retained; all ten figures remain pending. N17 fig23 current PASS retained with remaining HOLDs. Source187/307 and unapproved product figures excluded; no source/native/reviewer replay, DB, paid calls, deploy, merge, closure or formal handoff.';
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
const indexFile = `${T}/evidence/index.json`;
const index = read(indexFile);
index.updatedAt = meter.updatedAt;
for (const file of walk(O)) {
  assert(!index.reports.some(row => row.path === file), file);
  index.reports.push({ ...bind(file), batch: 'D144' });
}
fs.writeFileSync(indexFile, JSON.stringify(index, null, 2) + '\n');
const scope = [...new Set([
  ...ready.productBindings.map(row => row.path), ...walk(O),
  ...['d1816-d139-fig23-progress', 'd1816-d140-n8-text-progress',
    'd1816-d142-n9-author-progress'].flatMap(dir => walk(`${T}/evidence/reports/${dir}`)),
  `${T}/evidence/reports/d1816-d138-delivery/actual-push.json`, meterFile, indexFile,
])];
for (const file of scope) {
  assert(!/(^|\/)\.env(?:\/|$)/.test(file), file);
  assert(!/\/pages\/(?:0187|0307)\//.test(file), file);
  assert(!file.startsWith('.tmp/'), file);
}
git(['add', '--', ...scope]);
const staged = git(['diff', '--cached', '--name-only']).split('\n').filter(Boolean);
const allowed = new Set(scope);
assert(staged.every(file => allowed.has(file)));
git(['diff', '--cached', '--check']);
fs.writeFileSync(scopeFile, JSON.stringify({
  batch: 'D144', parent, cards: [id], staged, additionalApprovedScope: scope,
  completeDeliveredBefore: 136, completeUnbatched: [id],
  excludedExistingSourceChanges: [187, 307], originalFailuresPreserved: true,
  wholeProjectChecks: false, formalHandoff: false, databaseWrites: false,
  commit: false, push: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ stagedScope: bind(scopeFile), stagedFiles: staged.length,
  cards: [id], completeDeliveredBefore: 136 }));

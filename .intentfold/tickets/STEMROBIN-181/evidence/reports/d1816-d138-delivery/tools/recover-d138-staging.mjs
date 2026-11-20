import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/evidence/reports/d1816-d138-delivery`;
const read = file => JSON.parse(fs.readFileSync(file));
const git = args => execFileSync('git', args, { cwd: repo, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }).trim();
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(row =>
  row.isDirectory() ? walk(`${dir}/${row.name}`) : [`${dir}/${row.name}`]);
const save = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const scopeFile = `${T}/tmp/d1816-recovery/d138-staged-scope.json`;
assert(!fs.existsSync(scopeFile));
const previous = read(`${T}/tmp/d1816-recovery/d120-approved-scope.json`);
const ready = read(`${O}/batch-ready.json`);
const meterFile = `${T}/production-meter.json`;
const indexFile = `${T}/evidence/index.json`;
const meter = read(meterFile);
assert.equal(git(['rev-parse', 'HEAD']), previous.parent);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 134);
assert.deepEqual(meter.currentCheckpoint.completeUnbatchedCards, ['phy9-c1-s2-n19', 'phy9-c1-s3-t9']);
assert.equal(meter.deliveryBatches.filter(row => row.id === 'D138').length, 1);
const code = ['.claude/skills/ld-s10y-lesson/tools/edition.py',
  '.claude/skills/ld-s10y-lesson/tests/test_english_edition_identity.py'];
const allowed = new Set([...previous.actualStagedFiles,
  ...ready.productBindings.map(row => row.path), ...walk(O), meterFile, indexFile, ...code]);
const stagedBefore = git(['diff', '--cached', '--name-only']).split('\n').filter(Boolean);
assert.deepEqual(new Set(stagedBefore), allowed);
const rawLog = `${T}/evidence/reports/d1816-d120-delivery/native/d120-n19-first-bilingual-native-and-render/stderr.txt`;
const d120 = read(`${T}/evidence/reports/d1816-d120-delivery/batch-ready.json`);
const frozen = d120.retained.find(row => row.path === rawLog);
assert(frozen, 'Raw stderr must already be frozen in D120');
assert.equal(bind(rawLog).sha256, frozen.sha256);
const stagedLog = execFileSync('git', ['show', `:${rawLog}`], { cwd: repo });
assert.equal(crypto.createHash('sha256').update(stagedLog).digest('hex'), frozen.sha256);
git(['diff', '--cached', '--check', '--', '.', `:(exclude)${rawLog}`]);
git(['-c', 'core.whitespace=-blank-at-eof', 'diff', '--cached', '--check', '--', rawLog]);
const added = [];
for (const name of ['d138-stage-first-failure.json', 'recover-d138-staging.mjs']) {
  const from = `${T}/tmp/d1816-recovery/${name}`;
  const to = `${O}/tools/${name}`;
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(bind(from).sha256, bind(to).sha256);
  added.push(to);
}
const recovered = `${O}/staging-recovery.json`;
save(recovered, { batch: 'D138', status: 'pass', firstFailure: bind(added[0]),
  rawFrozenLog: bind(rawLog), inheritedD120Binding: frozen, rawLogBytesChanged: false,
  checks: [
    'git diff --cached --check -- . :(exclude)<the single frozen raw stderr>',
    'git -c core.whitespace=-blank-at-eof diff --cached --check -- <the single frozen raw stderr>',
  ],
  sourceCodeWhitespacePolicyChanged: false, completedStagingReplayed: false,
  duplicateMeterOrIndexAppend: false, wholeProjectChecks: false, imagesOpened: 0 });
added.push(recovered);
meter.currentResume1816.D138.stagingRecovery = bind(recovered);
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
const index = read(indexFile);
index.updatedAt = meter.updatedAt;
for (const file of added) {
  assert(!index.reports.some(row => row.path === file));
  index.reports.push({ ...bind(file), batch: 'D138' });
}
fs.writeFileSync(indexFile, JSON.stringify(index, null, 2) + '\n');
git(['add', '--', ...added, meterFile, indexFile]);
added.forEach(file => allowed.add(file));
const staged = git(['diff', '--cached', '--name-only']).split('\n').filter(Boolean);
assert.deepEqual(new Set(staged), allowed);
for (const file of staged) {
  assert(!/(^|\/)\.env(?:\/|$)/.test(file));
  assert(!/\/pages\/(?:0187|0307)\//.test(file));
}
save(scopeFile, { parent: previous.parent, cards: meter.currentCheckpoint.completeUnbatchedCards,
  staged, previousStagingReused: previous.actualStagedFiles.length,
  additionalApprovedScope: staged.filter(file => !previous.actualStagedFiles.includes(file)),
  stagingRecovery: bind(recovered), completeDeliveredBefore: 134,
  excludedExistingSourceChanges: [187, 307], wholeProjectChecks: false,
  databaseWrites: false, formalHandoff: false, commit: false, push: false });
console.log(JSON.stringify({ stagedScope: bind(scopeFile), stagedFiles: staged.length,
  previousStagingReused: previous.actualStagedFiles.length, rawLogUnchanged: true,
  cards: meter.currentCheckpoint.completeUnbatchedCards }));

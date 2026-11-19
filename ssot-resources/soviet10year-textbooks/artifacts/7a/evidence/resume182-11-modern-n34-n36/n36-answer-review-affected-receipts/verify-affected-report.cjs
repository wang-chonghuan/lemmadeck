'use strict';

const fs = require('node:fs');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const cwd = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
assert.equal(process.cwd(), cwd);
const base = '.intentfold/tickets/STEMROBIN-182/tmp/resume182-11';
const own = `${base}/n36-answer-review-affected-receipts`;
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const read = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const report = read(`${base}/n36-answer-review-affected.json`);
const contract = read(report.mechanicalEvidence.path);
assert.equal(hash(fs.readFileSync(report.mechanicalEvidence.path)), report.mechanicalEvidence.sha256);
assert.equal(report.verdict, 'pass');
assert.equal(report.aggregateContentApproval, true);
assert.equal(report.changed768.subparts.length, 8);
assert.ok(report.changed768.subparts.every(part => part.verdict === 'pass'));
assert.deepEqual(report.inheritance.inheritedPassExercises, contract.inherited15.map(a => a.exercise));
assert.equal(report.inheritance.aggregateApprovedExerciseCount, 16);
assert.deepEqual(report.changeContract.onlyChangedJsonPointers, contract.exactChangedJsonPointers);
assert.equal(report.changed768.newObjectSha256, contract.changed768.newObjectSha256);
assert.equal(report.changed768.newDisplaySha256, contract.changed768.newDisplaySha256);
assert.deepEqual(report.findings, []);
for (const binding of [...Object.values(report.binding).filter(v => v && typeof v === 'object' && v.path), ...contract.unchangedBindings]) {
  assert.equal(hash(fs.readFileSync(binding.path)), binding.sha256, `Changed bound input: ${binding.path}`);
}
const candidate = read(report.binding.candidate.path);
const saved = read(report.binding.preservedFIRSTCandidate.path);
const oldTarget = saved.answers.find(a => a.exercise === '768');
const newTarget = candidate.answers.find(a => a.exercise === '768');
const expected = structuredClone(saved);
expected.answers.find(a => a.exercise === '768').displayAnswer = newTarget.displayAnswer;
assert.deepEqual(candidate, expected);
assert.equal(candidate.status, 'draft');
assert.notEqual(oldTarget.displayAnswer, newTarget.displayAnswer);
assert.equal(read(report.binding.FIRSTReportJson.path).verdict, 'revise');
assert.equal(fs.statSync(report.binding.frozenIndependentSolution.path).mode & 0o222, 0);
const md = fs.readFileSync(`${base}/n36-answer-review-affected.md`, 'utf8');
assert.ok(md.includes('## Verdict: pass, aggregate content approval'));
assert.ok(md.includes(report.binding.candidate.sha256));
const output = {
  schema: 'n36-answer-review-affected/final-report-verification@1',
  cwd,
  checkedAtUtc: new Date().toISOString(),
  result: 'pass-report-integrity-and-current-binding-stability',
  aggregateContentGateVerdict: 'pass',
  currentCandidateSha256: report.binding.candidate.sha256,
  inheritedFIRSTPassCount: 15,
  newlyReviewedExercise: '768',
  FIRSTReviseUnchanged: true,
  only768DisplayChanged: true,
  currentBindingsStillMatch: true,
  sourceSolveOrUnrelatedReviewRerun: false,
  candidateRemainsDraft: true,
  reports: ['md', 'json'].map(extension => {
    const path = `${base}/n36-answer-review-affected.${extension}`;
    return { path, sha256: hash(fs.readFileSync(path)) };
  })
};
const path = `${own}/final-report-verification.json`;
fs.writeFileSync(path, `${JSON.stringify(output, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ path, sha256: hash(fs.readFileSync(path)), ...output }, null, 2));

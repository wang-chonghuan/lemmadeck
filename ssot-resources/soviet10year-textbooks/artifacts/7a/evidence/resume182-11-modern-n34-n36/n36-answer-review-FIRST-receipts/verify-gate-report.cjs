'use strict';

const fs = require('node:fs');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const cwd = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
assert.equal(process.cwd(), cwd);
const base = '.intentfold/tickets/STEMROBIN-182/tmp/resume182-11';
const receipts = `${base}/n36-answer-review-FIRST-receipts`;
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const read = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const report = read(`${base}/n36-answer-review-FIRST.json`);
const mechanical = read(report.mechanicalEvidence.path);
assert.equal(sha256(fs.readFileSync(report.mechanicalEvidence.path)), report.mechanicalEvidence.sha256);
assert.equal(report.verdict, 'revise');
assert.equal(report.mathResultsVerdict, 'pass');
assert.deepEqual(report.coverage.reviseExercises, ['768']);
assert.equal(report.coverage.passExercises.length, 15);
assert.equal(report.perExercise.length, 16);
assert.deepEqual(report.perExercise.map(e => e.exercise), mechanical.perExercise.map(e => e.exercise));
assert.deepEqual(report.perExercise.filter(e => e.verdict === 'pass').map(e => e.exercise), report.coverage.passExercises);
assert.deepEqual(report.perExercise.filter(e => e.verdict === 'revise').map(e => e.exercise), ['768']);
assert.equal(report.findings.length, 1);
assert.equal(report.findings[0].requiredRepresentations.length, 8);
for (const row of report.perExercise) {
  assert.ok(row.evidence.length >= 2);
  assert.equal(mechanical.perExercise.find(e => e.exercise === row.exercise).grading, 'ungraded');
}

const bindings = [
  report.binding.candidate, report.binding.modernLesson, report.binding.modernExercises,
  report.binding.modernFigures, report.binding.namedPrepareTemplate,
  ...report.binding.ruleFiles,
  { path: report.independence.independentReceipt, sha256: report.independence.independentReceiptSha256 },
  { path: report.independence.freezeReceipt, sha256: report.independence.freezeReceiptSha256 },
  { path: report.mechanicalEvidence.path, sha256: report.mechanicalEvidence.sha256 }
];
for (const binding of bindings) {
  assert.equal(sha256(fs.readFileSync(binding.path)), binding.sha256, `Changed bound file: ${binding.path}`);
}
assert.equal(fs.statSync(report.independence.independentReceipt).mode & 0o222, 0);
const candidate = read(report.binding.candidate.path);
const candidateLines = fs.readFileSync(report.binding.candidate.path, 'utf8').split('\n');
for (const row of report.perExercise) {
  assert.ok(candidateLines[row.candidateLine - 1].includes('"displayAnswer"'));
  const preceding = candidateLines.slice(0, row.candidateLine).join('\n');
  const precedingExerciseFields = [...preceding.matchAll(/"exercise": "(\d+)"/g)];
  assert.equal(precedingExerciseFields.at(-1)[1], row.exercise);
}
assert.equal(candidate.status, 'draft');
const md = fs.readFileSync(`${base}/n36-answer-review-FIRST.md`, 'utf8');
assert.ok(md.includes('## Verdict: revise'));
for (const row of report.perExercise) assert.ok(md.includes(`### ${row.exercise}: ${row.verdict}`));
const output = {
  schema: 'n36-answer-review-FIRST/final-verification@1',
  checkedAtUtc: new Date().toISOString(),
  cwd,
  result: 'pass-report-integrity-and-exact-input-stability',
  contentGateVerdict: report.verdict,
  mathematicalResultsVerdict: report.mathResultsVerdict,
  affectedExercise: '768',
  currentInputsMatchReviewHashes: true,
  reports: ['md', 'json'].map(extension => {
    const path = `${base}/n36-answer-review-FIRST.${extension}`;
    return { path, sha256: sha256(fs.readFileSync(path)) };
  }),
  checkedBindings: bindings,
  independentReceiptUnchangedAndReadOnly: true,
  substantiveEvidenceForAll16Exercises: true,
  candidateLineReferencesVerified: true,
  candidateRemainsDraft: true,
  candidateModifiedByReviewer: false,
  newCandidateAfterParentRepairApproved: false
};
const path = `${receipts}/final-input-and-report-verification.json`;
fs.writeFileSync(path, `${JSON.stringify(output, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ path, sha256: sha256(fs.readFileSync(path)), ...output }, null, 2));

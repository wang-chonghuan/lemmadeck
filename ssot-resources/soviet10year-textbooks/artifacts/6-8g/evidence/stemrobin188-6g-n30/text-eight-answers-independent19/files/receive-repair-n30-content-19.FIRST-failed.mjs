import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs';
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs';

assert.equal(process.cwd(), repo);
const root = path.join(tmp, 'n30-text-and-eight-answers-independent-review-18');
const reportFile = path.join(root, 'report.json');
const manifestFile = path.join(root, 'manifest.json');
assert.equal(hash(reportFile), '394c5387bfc986522fa0645c0f6e4732b287d282cda610d92a915ec2cce71351');
assert.equal(hash(manifestFile), '7bff25132c409e0524897bdac9c07d7602aa42319f9f75df7e6037d57f521613');
const report = read(reportFile);
const manifest = read(manifestFile);
assert.equal(manifest.scopeClosed, true);
assert.equal(report.textVerdict, 'pass');
assert.equal(report.answersReview.perAnswer.filter(item => item.status === 'pass').length, 7);
assert.equal(report.findings.length, 1);
assert.equal(report.findings[0].id, 'N30-378-STANDARD-ANSWER-DEFERRAL');
const refs = [bind(reportFile), bind(manifestFile)];
for (const item of [...manifest.files, ...Object.values(report.bindings)]) {
  assert.equal(hash(item.path), item.sha256, item.path);
  if (item.modeOctal === '0444') assert.equal(fs.statSync(item.path).mode & 0o777, 0o444);
  refs.push({ path: item.path, sha256: item.sha256 });
}
assert.equal(fs.statSync(report.sourceFirst.path).mode & 0o777, 0o444);
const reviewed = retainCurrent6g('evidence/stemrobin188-6g-n30/text-eight-answers-independent19',
  [...refs, bind(path.join(tmp, 'receive-repair-n30-content-19.mjs'))],
  ['evidence/stemrobin188-6g-n30/text-author-first18/retention.json',
    'evidence/stemrobin188-6g-n30/eight-answers-author-first18/retention.json',
    'evidence/stemrobin188-6g-n30/errata-registration-and-binding18/retention.json'],
  { status: report.status, textVerdict: report.textVerdict, answersVerdict: report.answersVerdict,
    imageCounts: report.imageCounts, perAnswer: report.answersReview.perAnswer,
    retainedFailures: report.verificationAndFailures, unchangedPassReplays: 0 });
const own = path.join(tmp, 'n30-content-review-collection-19');
fs.mkdirSync(own);
const candidate = read(report.bindings.keys.path);
const original = structuredClone(candidate);
assert.equal(candidate.answers[5].exercise, '378');
const proposals = report.affectedRevisionProposals;
assert.equal(proposals.length, 2);
for (const proposal of proposals) {
  assert.equal(proposal.keyFileSha256, hash(report.bindings.keys.path));
  assert.equal(proposal.independentlyMathematicallySufficientAgainstFIRST, true);
  assert.equal(proposal.operation, 'replace');
  const field = proposal.jsonTarget.split('/').at(-1);
  assert.ok(['displayAnswer', 'notes'].includes(field));
  candidate.answers[5][field] = proposal.proposedValue;
}
const restored = structuredClone(candidate);
restored.answers[5].displayAnswer = original.answers[5].displayAnswer;
restored.answers[5].notes = original.answers[5].notes;
assert.deepEqual(restored, original);
const keysFile = path.join(own, 'answer-keys.approved-exact378-replacement.json');
save(keysFile, candidate);
fs.chmodSync(keysFile, 0o444);
const collectionFile = path.join(own, 'collection.json');
save(collectionFile, {
  status: 'pass', textVerdict: 'pass', answersVerdict: 'pass',
  originalReviewStatus: report.status, originalReview: bind(reportFile), originalRetention: reviewed,
  originalFirst: report.sourceFirst, unchangedSevenAnswerApprovals: report.answersReview.perAnswer
    .filter(item => item.status === 'pass'),
  approvedKeys: bind(keysFile), appliedReplacements: proposals,
  changedFieldsOnly: ['/answers/5/displayAnswer', '/answers/5/notes'],
  answer378RevisionCount: 1,
  approvalBasis: 'Seven unchanged independent PASS verdicts plus exact application of both independently sufficient replacement values approved against the same sealed FIRST. No new mathematical claim or givens added.',
  sourceAndTextUnchanged: true, originalUNKNOWNAndFailureRetained: true,
  reviewOrSolvingReplays: 0, parentImageLoads: 0, wholeLessonApproved: false, published: false,
});
console.log(JSON.stringify({ collection: bind(collectionFile), reviewed,
  repaired: retainCurrent6g('evidence/stemrobin188-6g-n30/answer378-exact-approved-replacement19',
    [bind(keysFile), bind(collectionFile), bind(path.join(tmp, 'receive-repair-n30-content-19.mjs'))],
    ['evidence/stemrobin188-6g-n30/text-eight-answers-independent19/retention.json'],
    read(collectionFile)) }));

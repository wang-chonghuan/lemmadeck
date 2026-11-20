import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const A = `${T}/tmp/d1816-d138-t9-choice-author`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const verified = new Map();
function visit(value) {
  if (!value || typeof value !== 'object') return;
  if (typeof value.path === 'string' && /^[a-f0-9]{64}$/.test(value.sha256 || '')) {
    const actual = verified.get(value.path) || bind(value.path);
    assert.equal(actual.sha256, value.sha256, value.path);
    if (value.bytes !== undefined) assert.equal(actual.bytes, value.bytes, value.path);
    verified.set(value.path, actual);
  }
  for (const child of Object.values(value)) visit(child);
}
const freeze = bind(`${A}/author-freeze.json`);
const answerFreeze = bind(`${A}/answers-author-freeze.json`);
assert.equal(freeze.sha256, 'a6bd1c81ec9f2d02e45181302a16c4e09278e5b3d693d733907d0a47aa36c7fd');
assert.equal(answerFreeze.sha256, 'a38393a5416d975a84ed25078c3a18b59a9b77ea7f75ecfa5aa5c23add545e7e');
visit(read(freeze.path));
visit(read(answerFreeze.path));
const report = bind(`${A}/author-report.json`);
assert.equal(report.sha256, '0a8012f8bc47b7e6891f809edddf5945ca72f916d8383cc998e3e5d5c75f01b5');
const output = `${A}/parent-collected.json`;
assert(!fs.existsSync(output));
fs.writeFileSync(output, JSON.stringify({
  batch: 'D138', status: 'AUTHOR_COLLECTED_CLOSED_SEMANTIC_REVIEW_AND_DISPLAY_PENDING',
  author: '01a1f86b-1fb4-7d90-80c8-ce54030371ca', authorClosed: true,
  authorFreeze: freeze, answersAuthorFreeze: answerFreeze, report,
  verifiedBindings: [...verified.values()],
  sourceTasks: 6, choiceQuestionsPerLocale: 6, choiceOptionsPerLocale: 24,
  readOnlyStandardsPerLocale: 6, actualImageOpens: 4,
  choiceStructuralPass: ['zh', 'en'], nativeAnswerFinalizersPass: ['zh', 'en'],
  independentApproval: false, completeCoursesAdded: 0, sourcePagesAdded: 0,
  canonicalPromotions: 0, passedStagesReplayed: 0,
}, null, 2) + '\n', { flag: 'wx' });
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
Object.assign(meter.currentResume1816.D138, {
  status: 'AUTHOR_COLLECTED_CLOSED_FIRST_SEMANTIC_REVIEW_ACTIVE_OFFLINE_DISPLAY_UNDER_CHECK',
  authorClosed: true, authorFreeze: freeze, answersAuthorFreeze: answerFreeze,
  authorCollected: bind(output), verifiedAuthorBindings: verified.size,
  choiceQuestionsPerLocale: 6, choiceOptionsPerLocale: 24, readOnlyStandardsPerLocale: 6,
  actualAuthorImages: 4, graphTask2FirstActualSolvePending: false,
  semanticReviewer: '01a1f870-e3eb-7ab0-a109-3eb04ecde999', semanticReviewerClosed: false,
});
meter.currentResume1816.currentContinuation = '134 complete courses pushed plus n19 complete unbatched;561 SOURCE and136 book answers retained. D138 EN-only native recovery PASS and both first offline renders PASS;44 focused tool tests PASS without formula-order relaxation or passed-stage replay. All6 T9 source tasks,6 bilingual choice units/24options and6 bilingual readonly standards authored/frozen; native structural choice and answer finalizers PASS. First graph source solution recorded; Q4 retains original mean-square-speed definition and conflicting bookRaw unchanged, Q6 has explicit conditional net-work model. Sole independent semantic review active,12 offline display check underway. No new complete-course count, canonical promotion, commit/push, parent images, paid calls, DB or deploy.';
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ collected: bind(output), verifiedBindings: verified.size,
  sourceTasks: 6, independentApproval: false, completeCoursesAdded: 0 }));

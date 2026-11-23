import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

assert.equal(process.cwd(), '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184');
const work = '.tmp/stemrobin-184-six/c6-resume';
const evidence = 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/nov23-1847-c6';
const canonical = 'ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-ex';
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => ({ path: file,
  sha256: createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
assert.equal(read(`${canonical}/choice-set/review.json`).outcome, 'pass');
assert.equal(read(`${work}/reviewer/display-review.json`).outcome, 'pass');
assert(!fs.existsSync(`${evidence}/completion.json`));
const retained = [];
const copy = (source, target) => {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  if (fs.existsSync(target)) {
    assert(fs.readFileSync(source).equals(fs.readFileSync(target)));
    retained.push({ source, ...bind(target), reused: true });
  } else {
    fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL);
    retained.push({ source, ...bind(target), reused: false });
  }
};
for (const name of fs.readdirSync(`${work}/reviewer`)) {
  assert(/\.(md|json|txt|cjs)$/.test(name), `Unexpected reviewer artifact: ${name}`);
  copy(`${work}/reviewer/${name}`, `${evidence}/reviewer/${name}`);
}
for (const name of ['draft.json', 'review.json', 'repair.json']) {
  copy(`${work}/revision1/${name}`, `${evidence}/snapshots/revision1-${name}`);
}
copy(`${work}/revision2/repair.json`, `${evidence}/snapshots/revision2-repair.json`);
for (const name of ['c6-resume-intake.mjs', 'c6-run.mjs', 'c6-repair.mjs',
  'c6-repair2.mjs', 'c6-record.mjs', 'c6-retain-evidence.mjs']) {
  copy(`.tmp/stemrobin-184-six/${name}`, `${evidence}/${name}`);
}
const priorEvidence = [
  'nov22-1846-c6-edition-affected-finalization',
  'nov22-1846-c6-ready-answers-interactions',
  'nov22-1846-c6-supplement-math-phaseA',
  'nov22-1846-c6-supplement-math-phaseB',
  'nov22-1846-c6-supplement-answer350-affected',
  'nov22-1846-c6-answer338-math-phaseA',
  'nov22-1846-c6-answer338-math-phaseB',
  'nov22-1846-c6-held-context-review-phaseA',
  'nov22-1846-c6-held-context-review-phaseB',
  'nov22-1846-c6-offline-display-recovered',
  'nov22-1846-c6-first-offline-display-failure',
  'nov22-1846-c6-range-recovery-first-failure',
];
const evidenceRoot = path.dirname(evidence);
assert(priorEvidence.every(name => fs.statSync(`${evidenceRoot}/${name}`).isDirectory()));
const receipt = {
  status: 'COMPLETE_FINISH_REVIEW_NOT_PUBLISHED',
  lesson: 'ana10-c6-ex', book: '10c',
  retained,
  canonical: ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json',
    'answer-keys.json', 'answer-keys.audit.json', 'interactions.json',
    'choice-set/seed.json', 'choice-set/draft.json', 'choice-set/review.json']
    .map(name => bind(`${canonical}/${name}`)),
  components: { reviewedWrittenAnswers: 57, reusedFreeInteractions: 57,
    choices: 60, options: 215, newFigures: 0, newKeyboardInteractions: 0 },
  display: {
    priorWrittenDisplay: `${evidenceRoot}/nov22-1846-c6-offline-display-recovered/c6-display-range-recovery/after-range-equality/report.md`,
    newMechanical: bind(`${evidence}/display-new/report.json`),
    newIndependent: bind(`${evidence}/reviewer/display-review.json`),
    scope: 'Original written-display PASS reused with original limits; new desktop/mobile checks and eight representative screenshots, not exhaustive glyph adjudication.',
  },
  originalAndFirstAffectedRevisionsPreserved: true,
  unchangedSourceOrAnswerReviewsReplayed: false,
  priorEvidence: priorEvidence.map(name => `${evidenceRoot}/${name}`),
  databaseWrites: 0, auxiliaryPaidCalls: 0, modelAndHiddenCosts: 'UNKNOWN',
};
fs.writeFileSync(`${evidence}/completion.json`, JSON.stringify(receipt, null, 2) + '\n',
  { flag: 'wx' });
console.log(JSON.stringify({ status: receipt.status, retained: retained.length,
  priorEvidence: receipt.priorEvidence }));

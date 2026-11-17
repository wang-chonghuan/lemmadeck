import assert from 'node:assert/strict';
import {
  ticket, read, bind, verify, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const source = `${ticket}/tmp/d172-t16-text-only-choice-author`;
const output = `${ticket}/tmp/d175-t16-choice-q1-repair`;
const hashes = {
  zh: '303f458a6195cd40989151e86336103ffdcc240bf5a68742c914406ef63fe9e0',
  en: '10e8735742e2f45e68b265089cce35e5ed675286d323e0ebc878ed2ae84cd459',
};
const languages = [];
for (const language of ['zh', 'en']) {
  const originalPath = `${source}/${language}.draft.json`;
  await verify(originalPath, hashes[language]);
  const original = await read(originalPath);
  const patch = await read(`${output}/${language}.q1.json`);
  assert.equal(patch.question.id, original.questions[0].id);
  assert.equal(patch.coverage.source_number, original.coverage[0].source_number);
  const draft = structuredClone(original);
  draft.questions[0] = patch.question;
  draft.coverage[0] = patch.coverage;
  assert.deepEqual(draft.questions.slice(1), original.questions.slice(1));
  assert.deepEqual(draft.coverage.slice(1), original.coverage.slice(1));
  assert.equal(draft.seed_sha256, original.seed_sha256);
  assert.deepEqual(draft.new_figures, []);
  const draftPath = `${output}/${language}.draft.json`;
  await immutableWrite(draftPath, `${JSON.stringify(draft, null, 2)}\n`);
  languages.push({
    language, before: await bind(originalPath), draft: await bind(draftPath),
    manualPatch: await bind(`${output}/${language}.q1.json`),
    changedQuestion: 't16-frame-reason', changedSourceCoverage: '1',
    unchangedQuestions: ['t16-dipole-coupling', 't16-propagation-conditions'],
  });
  await verify(originalPath, hashes[language]);
}
await immutableWrite(`${output}/author-freeze.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D032', card: 'phy10-c1-s6-t16',
  status: 'AUTHOR-ONE-LOCAL-Q1-REPAIR-INDEPENDENT-AFFECTED-REVIEW-PENDING',
  author: 'parent-existing-agent', finding: 'D173-F01', repairCalls: 1,
  solution: await bind(`${output}/independent-model-solution.json`), languages,
  newImageOpens: 0, cumulativeImageCount: 24, imageBudgetReset: false,
  unchangedSourceNumbers: ['2', '5'], deferredSourceNumbers: ['3', '4'],
  originalDraftsAndReviewsPreserved: true, oldPassedQuestionReviewsReusable: true,
  structureOrSemanticPASSClaimed: false, completeCard: false,
  originalWrittenProseOrAnswersChanged: false, nativeFinalizeOrDisplayRun: false,
  limits: 'Mechanical assembly of manually authored q1 patches only. No option generation, original overwrite, replay of unchanged questions, images, DB, Git or product integration.',
}, null, 2)}\n`);
console.log(JSON.stringify({ languages, freeze: await bind(`${output}/author-freeze.json`) }));

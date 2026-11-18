import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  ticket, absolute, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const base = `${ticket}/tmp`;
const folder = `${base}/d328-t18-reviewed-text-assembly`;
assert.equal(await exists(`${folder}/manifest.json`), false);
const meter = await read(`${ticket}/production-meter.json`);
const stage = meter.activeHumanDirection.nextSourceCheckpoints.t18;
await verify(stage.latestProgress.path, stage.latestProgress.sha256);
const progress = await read(stage.latestProgress.path);
assert.equal(progress.cumulative.sourceTasks, 14);
assert.equal(progress.wholeCardApproved, false);
const selected = progress.cumulativeApprovedSourceTasks;
const held = progress.missingFullLessonTasks;
assert.deepEqual(held, ['1', '9']);
const groups = [
  { author: 'd302-t18-text-choice-author', review: stage.choiceReview },
  { author: 'd308-t18-second-text-choice-author', review: stage.secondChoiceReview },
  { author: 'd313-t18-last-four-text-choice-author', review: stage.lastFourChoiceReview },
  { author: 'd320-t18-arc-flame-text-author', review: stage.arcFlameChoiceReview },
];
const bindings = [];
async function input(file, expected) {
  const binding = await bind(file);
  if (expected) await verify(file, expected);
  bindings.push(binding);
  return read(file);
}
const approvedAnswers = [
  { candidate: stage.answerCandidate, review: stage.answerReview },
  { candidate: stage.secondWrittenAnswerCandidate, review: stage.secondWrittenAnswerReview },
  { candidate: stage.lastFourWrittenAnswerCandidate, review: stage.lastFourWrittenAnswerReview },
];
const answers = [];
for (const entry of approvedAnswers) {
  const review = await input(entry.review.path, entry.review.sha256);
  assert.equal(review.outcome ?? review.status, 'pass');
  const candidate = await input(entry.candidate.path, entry.candidate.sha256);
  answers.push(...candidate.answers);
}
const arcReview = await input(stage.arcFlameWrittenAnswerReview.path, stage.arcFlameWrittenAnswerReview.sha256);
assert.equal(arcReview.outcome, 'pass');
const relationships = [];
for (const entry of [stage.firstCrossGroupReview, stage.affectedCrossGroupReview]) {
  const review = await input(entry.path, entry.sha256);
  assert.equal(review.outcome, 'PASS');
  relationships.push(entry);
}
const outputs = [];
const serialize = data => `${JSON.stringify(data, null, 2)}\n`;
for (const language of ['zh', 'en']) {
  const sourcePath = `${base}/d032-t18-text-repair/frozen/${language === 'zh' ? '' : 'english.'}exercises.template.json`;
  const source = await input(sourcePath, language === 'zh'
    ? 'fb4ca6d2d5d7d060c51e2ae8d0e3c8310cc4c67aa72b3d9cbe1e2ac494f392f0'
    : 'fbc806dcc4c5108bfe3bd9bec17931d5bd65df6dd21b745c7474e980b1219f02');
  const sourceRows = new Map(source.exercises.map(row => [String(row.number), row]));
  assert.equal(sourceRows.size, 16);
  const questions = [], inheritedReviews = [];
  for (const group of groups) {
    const review = await input(group.review.path, group.review.sha256);
    assert.equal(review.outcome, 'pass');
    let contractBinding, draftBinding;
    if (review.schema === 'stemrobin/t18-text-choice-independent-review-report@1') {
      const contract = review.reviews.find(row => row.language === language);
      contractBinding = { path: `${review.reviewRoot}/${contract.path}`, sha256: contract.sha256 };
      const draft = review.authorBindings[language].draft;
      draftBinding = { path: `${review.authorRoot}/${draft.path}`, sha256: draft.sha256 };
    } else {
      const validation = review.nativeValidation.find(row => row.language === language);
      assert.equal(validation.exitCode, 0);
      const native = await input(validation.receipt.path, validation.receipt.sha256);
      assert.equal(native.exitCode, 0);
      assert.equal(native.attempts, 1);
      assert.equal(native.reviewSupplied, true);
      contractBinding = native.review;
      draftBinding = native.draft;
    }
    const contract = await input(contractBinding.path, contractBinding.sha256);
    const draft = await input(draftBinding.path, draftBinding.sha256);
    assert.equal(draft.new_figures.length, 0);
    assert.equal(contract.outcome, 'pass');
    assert.deepEqual(contract.question_reviews.map(row => row.question_id),
      draft.questions.map(row => row.id));
    questions.push(...draft.questions);
    inheritedReviews.push({ review: group.review, contract: contractBinding, draft: draftBinding });
  }
  questions.sort((a, b) => Number(a.source_numbers[0]) - Number(b.source_numbers[0]));
  assert.equal(new Set(questions.map(row => row.id)).size, 14);
  assert.deepEqual(questions.flatMap(row => row.source_numbers), selected);
  assert.equal(questions.reduce((sum, row) => sum + row.view.options.length, 0), 59);
  assert.ok(questions.every(row => row.view.figure_ids.length === 0
    && row.view.options.every(option => option.figure_ids.length === 0)));
  const languageAnswers = answers.map(row => ({
    exercise: row.exercise, grading: row.grading, source: row.source,
    displayAnswer: row.displayAnswer[language], parts: row.parts,
    provenance: { id: row.id, source_number: row.source_number, group_id: row.group_id, source_refs: row.source_refs },
  }));
  const arcBinding = stage.arcFlameWrittenAnswerCandidates.find(row => row.language === language);
  const arc = await input(arcBinding.path, arcBinding.sha256);
  languageAnswers.push(...arc.answers);
  languageAnswers.sort((a, b) => Number(a.exercise) - Number(b.exercise));
  assert.deepEqual(languageAnswers.map(row => row.exercise), selected);
  for (const answer of languageAnswers) {
    assert.equal(answer.source, 'derived');
    assert.equal(answer.grading, 'ungraded');
    assert.deepEqual(answer.parts, []);
    assert.ok(answer.displayAnswer.trim());
  }
  const projection = selected.map(number => sourceRows.get(number));
  assert.ok(projection.every(row => row && row.figures.length === 0));
  for (const [name, data] of [
    ['choices.projection.json', {
      schema: 'STEMROBIN-181/reviewed-text-choice-assembly@1',
      card: stage.card, language, questions, inheritedReviews,
      relationships, sourceTasks: selected, omittedHeldSourceTasks: held,
      nativeSeedOrPublishableChoiceSet: false, semanticReviewsRepeated: false,
    }],
    ['visible-only.json', questions.map(row => row.view)],
    ['written-exercises.projection.json', {
      schema: 'STEMROBIN-181/selected-written-exercise-display-projection@1',
      card: stage.card, language, originalSourceTaskCount: 16,
      source: await bind(sourcePath), exercises: projection,
      heldSourceTasks: held, sourceDocumentChanged: false, fullLessonProjection: false,
    }],
    ['answer-keys.partial.json', {
      schema: 'ld-s10y-answer/lesson-answers@1', book: '9p', lesson: stage.card,
      edition: 'modern-us-neutral', status: 'draft', answers: languageAnswers,
      coverage: { selected, held, originalTaskCount: 16, completeAnswerCoverage: false },
    }],
  ]) {
    const file = `${folder}/${language}/${name}`;
    await immutableWrite(file, serialize(data));
    await fs.chmod(absolute(file), 0o444);
    outputs.push({ language, ...await bind(file) });
  }
}
for (const binding of bindings) await verify(binding.path, binding.sha256);
const manifestPath = `${folder}/manifest.json`;
await immutableWrite(manifestPath, serialize({
  schema: 'STEMROBIN-181/reviewed-t18-text-display-inputs@1',
  ticket: 'STEMROBIN-181', batch: 'D033', card: stage.card,
  status: 'REVIEWED-TEXT-ASSEMBLED-FIRST-SCOPED-DISPLAY-PENDING',
  approvedSourceTasks: selected, heldSourceTasks: held,
  choicesPerLanguage: 14, optionsPerLanguage: 59, bilingualWrittenAnswers: 28,
  inputs: bindings, outputs, inheritedProgress: stage.latestProgress,
  noNewAuthoredTextKeysOrMathematicalClaims: true,
  originalFAILHOLDAndSourceBytesPreserved: true,
  semanticReviewsRepeated: false, nativeValidationOrPrepareRepeated: false,
  actualVisualDISPLAY: false, fullGate2PASS: false, wholeCardApproved: false,
  newImagesOpenedByParent: 0, parentImageCount: 24, imageHistoryReset: false,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeployCommitPush: false,
}));
await fs.chmod(absolute(manifestPath), 0o444);
console.log(JSON.stringify({ manifest: await bind(manifestPath), outputs: outputs.length,
  selectedSourceTasks: selected.length, heldSourceTasks: held, newImages: 0 }));

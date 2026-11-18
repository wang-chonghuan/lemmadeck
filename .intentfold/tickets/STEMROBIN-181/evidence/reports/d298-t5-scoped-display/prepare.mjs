import assert from 'node:assert/strict';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  ticket, absolute, bytes, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const base = `${ticket}/tmp`;
const folder = `${base}/d297-t5-scoped-display`;
const card = 'phy10-c2-s2-t5';
assert.equal(await exists(`${folder}/manifest.json`), false);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const nativePath = `${base}/d289-t5-bilingual-native/manifest.json`;
const answerReviewPath = `${base}/d292-n68-t5-written-answer-review/report.json`;
const choiceReviewPath = `${base}/d296-t5-choice-beam-review/report.json`;
const aggregatePath = `${base}/d288-n68-t5-written-answer-author/written-answers.candidate.json`;
const expectedInputs = [
  [nativePath, '44e3a1847aeea72b69073ac82d280137c0e387950bdd44aabafd692b1fb5733b'],
  [answerReviewPath, '6356bf1b5c7666cb2b7ab210632a01532d1bee2956897dd1aa1e012b6c5bfbb3'],
  [choiceReviewPath, 'dbcc1d1963adcc22ba883dc3974b6ad8b419caa70cad90aaa904100fd132dd4d'],
  [aggregatePath, 'f0c8a66ccd9048d873b19f62b52eaa039d411742820a805a02f828d63d506f9b'],
];
for (const [file, sha] of expectedInputs) await verify(file, sha);
const native = await read(nativePath);
const answerReview = await read(answerReviewPath);
const choiceReview = await read(choiceReviewPath);
const aggregate = await read(aggregatePath);
assert.equal(native.card, card);
assert.equal(native.status, 'BILINGUAL-NATIVE-PASS-WITH-SCI-UNIT-HOLD');
assert.equal(answerReview.reviewedWrittenLayerStatus, 'PASS');
assert.equal(choiceReview.selectedOutcome, 'pass');
const approvedIds = answerReview.coverage.t5.exerciseIds;
const heldIds = answerReview.coverage.t5.heldExerciseIds;
assert.deepEqual(approvedIds, ['1', '2', '3', '4', '6', '7']);
assert.deepEqual(heldIds, ['5']);
assert.deepEqual(choiceReview.selectedCoverage.sourceNumbers, approvedIds);
const protectedFiles = await Promise.all([
  `${ticket}/production-meter.json`, `${ticket}/evidence/index.json`,
  '.claude/skills/ld-s10y-lesson/tools/assemble.py',
  '.claude/skills/ld-s10y-lesson/tools/edition.py',
  '.claude/skills/ld-s10y-lesson/tools/layout.py',
].map(bind));
await immutableWrite(`${folder}/protected-files.json`, serialize(protectedFiles));

const originalScriptPath = `${base}/d060-n52-display/check.mjs`;
let script = (await bytes(originalScriptPath)).toString();
const adaptations = [];
function replaceOnce(before, after, reason) {
  assert.equal(script.split(before).length, 2, `Nonunique script adaptation: ${reason}`);
  script = script.replace(before, after);
  adaptations.push({ reason, before, after });
}
replaceOnce(
  '    assert.ok(outline.length, \'Native text surface cannot be empty\');',
  `    assert.ok(outline.length || (lesson.source.data.prose.length === 0
      && exercises.count > 0), 'Empty prose is allowed only for a source-bound exercises-only card');`,
  'Source-bound exercises-only card, with no invented prose.',
);
replaceOnce(
  '  assert.ok(cards.every(card => /^phy10-c1-s6-n(?:52|57|58)$/.test(card)));',
  `  assert.deepEqual(cards, ['${card}'], 'This first scoped display run is t5 only');`,
  'Restrict target to the one unobserved card.',
);
replaceOnce(
  "    assert.equal(keys.status, 'ready');",
  `    assert.equal(keys.status, 'draft', 'Partial answer candidate must not be promoted to ready');
    assert.equal(keys.coverage.completeAnswerCoverage, false);
    assert.deepEqual(keys.coverage.held.map(String), entry.heldExerciseIds);
    assert.equal(entry.completeCardClaim, false);`,
  'Consume reviewed partial candidates without manufacturing a finalized complete answer key.',
);
replaceOnce(
  '    assert.equal(keys.answers.length, target.exercises.count);',
  '    assert.equal(keys.answers.length, entry.approvedExerciseIds.length);',
  'Answer count derives from reviewed subset, not all seven source tasks.',
);
replaceOnce(
  `    const originalNumbers = target.exercises.exercises.map(e => String(nativeHelpers.sourceNumberForArtifact(e)));
    const originalIds = target.exercises.exercises.map(e => String(e.number));`,
  `    const selectedExercises = target.exercises.exercises.filter(e =>
      entry.approvedExerciseIds.includes(String(e.number)));
    const originalNumbers = selectedExercises.map(e => String(nativeHelpers.sourceNumberForArtifact(e)));
    const originalIds = selectedExercises.map(e => String(e.number));
    assert.deepEqual(originalIds, entry.approvedExerciseIds);
    assert.deepEqual(target.exercises.exercises.filter(e =>
      !entry.approvedExerciseIds.includes(String(e.number))).map(e => String(e.number)),
      entry.heldExerciseIds, 'All omitted source tasks must remain explicitly held');`,
  'Bind selected exercises by stable source ID and account for every omitted task.',
);
replaceOnce(
  "'Answer keys must correspond to all original exercises in order'",
  "'Candidate answers must correspond to the approved original exercises in order'",
  'Do not describe partial coverage as complete coverage.',
);
replaceOnce(
  "'Reviewed choice views must collectively cover all six original problems; combined-source questions are allowed'",
  "'Reviewed choice views must exactly cover the six approved source tasks; held exercise5 is not keyed'",
  'Choice coverage inherits the independent selected-task receipt.',
);
replaceOnce(
  '      assert.equal(String(answer.exercise), String(target.exercises.exercises[i].number),',
  '      assert.equal(String(answer.exercise), String(selectedExercises[i].number),',
  'Noncontiguous answer IDs must not use ordinal lookup into all seven exercises.',
);
replaceOnce(
  '    target.supplement = { entry, draft, keys, draftBinding, answerBinding, review: reviewBinding,',
  '    target.supplement = { entry, draft, keys, selectedExercises, draftBinding, answerBinding, review: reviewBinding,',
  'Carry source-ID-selected native prompts into rendering and assertions.',
);
replaceOnce(
  '      language: entry.language, writtenExercises: target.exercises.count, standardAnswers: keys.answers.length,',
  `      language: entry.language, writtenExercises: target.exercises.count, standardAnswers: keys.answers.length,
      approvedExerciseIds: originalIds, heldExerciseIds: entry.heldExerciseIds, completeCardClaim: false,`,
  'Expose the seven-versus-six boundary in the actual execution receipt.',
);
replaceOnce(
  '    const exercise = data.exercises.exercises[index];',
  '    const exercise = data.supplement.selectedExercises[index];',
  'Render source-bound answer prompts without shifting exercises6 and7.',
);
replaceOnce(
  `    return \`<li class="ex" id="ex-\${escape(exercise.number)}"><div class="no">\${index + 1}.</div><div class="body">\${prompt}\${(exercise.figures ?? []).map(figure => figureHtml(figure.id)).join('')}<details open><summary>\${escape(titles.summary)}</summary>\${body}</details></div></li>\`;`,
  `    return \`<li class="ex" id="ex-\${escape(exercise.number)}"><div class="no">\${escape(nativeHelpers.displayNumberForArtifact(exercise))}</div><div class="body">\${prompt}\${(exercise.figures ?? []).map(figure => figureHtml(figure.id)).join('')}<details open><summary>\${escape(titles.summary)}</summary>\${body}</details></div></li>\`;`,
  'Use native displayed source numbering, including suppression of duplicate body prefixes.',
);
replaceOnce(
  `  return {
    texts: data.exercises.exercises.flatMap((e, i) => kind === 'answers' ? [e.text, data.supplement.keys.answers[i].displayAnswer] : [e.text]),
    refs: data.exercises.exercises.flatMap(e => (e.figures ?? []).map(f => f.id)),
  };`,
  `  const exercises = kind === 'answers' ? data.supplement.selectedExercises : data.exercises.exercises;
  return {
    texts: exercises.flatMap((e, i) => kind === 'answers' ? [e.text, data.supplement.keys.answers[i].displayAnswer] : [e.text]),
    refs: exercises.flatMap(e => (e.figures ?? []).map(f => f.id)),
  };`,
  'Expected prompts/formulas derive from the unchanged native selected source, not observed UI.',
);
replaceOnce(
  "    const expectedCount = surface.kind === 'choices' ? data.supplement.draft.questions.length : data.exercises.count;",
  `    const expectedCount = surface.kind === 'choices' ? data.supplement.draft.questions.length
      : surface.kind === 'answers' ? data.supplement.keys.answers.length : data.exercises.count;`,
  'Keep original written count7 and reviewed answer/choice count6 distinct.',
);
replaceOnce(
  `      check(surface, isDeepStrictEqual(observed.exercises.map(e => e.number), data.exercises.exercises.map(e => {
        const n = nativeHelpers.sourceNumberForArtifact(e);
        return n == null ? '' : \`\${n}.\`;
      })), 'Original printed exercise numbers');`,
  `      check(surface, isDeepStrictEqual(observed.exercises.map(e => e.number),
        data.exercises.exercises.map(e => nativeHelpers.displayNumberForArtifact(e))),
      'Native displayed source numbers without duplicate body prefixes');
      check(surface, observed.exercises.every((e, i) => {
        const source = data.exercises.exercises[i];
        const n = nativeHelpers.sourceNumberForArtifact(source);
        return e.number === \`\${n}.\` || (e.number === ''
          && new RegExp(\`^\\\\s*\${n}\\\\.(?=\\\\s|$)\`).test(e.text));
      }), 'Every original source number visible in column or unchanged native body prefix');`,
  'Reuse d218 native numbering contract instead of replaying its known faulty column-only assertion.',
);
replaceOnce(
  'observed.expectedVisibleFragments.length === data.exercises.count * 2',
  'observed.expectedVisibleFragments.length === data.supplement.keys.answers.length * 2',
  'Selected answer fragments account for twelve prompt/answer texts.',
);
replaceOnce(
  "      'All six corresponding original prompts and complete reviewed standard answers open', observed.exercises);",
  `      'All six corresponding original prompts and complete reviewed standard answers open', observed.exercises);
      check(surface, isDeepStrictEqual(observed.exercises.map(e => e.id),
        data.supplement.selectedExercises.map(e => \`ex-\${e.number}\`)),
      'Approved source answer IDs/order; no fabricated exercise5 answer');
      check(surface, isDeepStrictEqual(observed.exercises.map(e => e.number),
        data.supplement.selectedExercises.map(e => nativeHelpers.displayNumberForArtifact(e))),
      'Selected answer source numbering retains6 and7');`,
  'Explicitly prove noncontiguous answer binding and omission of held exercise5.',
);
replaceOnce(
  "      : 'PASS-mechanical-independent-display-review-pending';",
  "      : 'PASS-mechanical-scoped-content-and-independent-display-review-pending';",
  'Mechanical-only partial evidence cannot close the card or its visual review.',
);
await immutableWrite(`${folder}/check.mjs`, script);
await immutableWrite(`${folder}/script-adaptation.json`, serialize({
  original: await bind(originalScriptPath), current: await bind(`${folder}/check.mjs`),
  adaptations, stableScriptChanged: false, substantiveReviewRepeated: false,
  originalFAILPreserved: true, heldExercise5Unchanged: true,
  allOtherLayoutFormulaFontCutoffCaptureAndPixelChecksRetained: true,
}));

const languages = [], supplements = [];
for (const language of native.results) {
  const lang = language.language;
  for (const input of language.outputs) await verify(input.path, input.sha256);
  const byName = name => {
    const matches = language.outputs.filter(row => path.basename(row.path) === name);
    assert.equal(matches.length, 1);
    return matches[0];
  };
  const sourceLesson = await read(byName('lesson.json').path);
  const sourceExercises = await read(byName('exercises.json').path);
  assert.equal(sourceLesson.prose.length, 0);
  assert.equal(sourceExercises.count, 7);
  const displayRoot = `${folder}/${lang}/root`;
  const displayDir = `${displayRoot}/10p/editions/modern-us-neutral/lessons/${card}`;
  const displayLesson = structuredClone(sourceLesson);
  if (lang === 'en') {
    assert.equal(sourceLesson.authoring.localized_title, 'Exercises 6');
    displayLesson.title = displayLesson.printed_title = sourceLesson.authoring.localized_title;
  }
  for (const name of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']) {
    await immutableWrite(`${displayDir}/${name}`, name === 'lesson.json'
      ? serialize(displayLesson) : await bytes(byName(name).path));
  }
  const mapping = {
    nativeLesson: byName('lesson.json'), displayLesson: await bind(`${displayDir}/lesson.json`),
    sourceAndProseUnchanged: true, nativeIdentityUnchanged: true,
    titleOnlyDisplayProjection: true, localizedTitleBasis: sourceLesson.authoring ?? null,
    nativeChromeLocalization: 'UNCHANGED-native-Chinese-crumb-suffix-and-links-not-full-English-acceptance',
    visualReview: 'HOLD-no-authorized-image-capacity', completeCardClaim: false,
  };
  await immutableWrite(`${folder}/${lang}/display-metadata.json`, serialize(mapping));
  const work = `${folder}/${lang}/work`;
  const args = [
    '.claude/skills/ld-s10y-lesson/tools/render_lesson.js',
    `${displayRoot}/10p`, '--out', work, '--edition', 'modern-us-neutral', '--lesson', card,
  ];
  const render = spawnSync(process.execPath, args, { cwd: absolute('.'), encoding: 'utf8' });
  await immutableWrite(`${folder}/${lang}/render.receipt.json`, serialize({
    args, exitCode: render.status, stdout: render.stdout, stderr: render.stderr,
    error: render.error?.message ?? null, invocations: 1, nativeFirstRender: true,
    nativeFinalizationRepeated: false, imagesOpened: 0,
  }));
  assert.equal(render.status, 0, render.stderr);
  const rendered = JSON.parse(render.stdout);
  assert.equal(rendered.ok, true);
  assert.deepEqual(rendered.lessons.map(row => row.lesson), [card]);
  languages.push({
    language: lang, nativeRoot: language.artifactRoot, root: displayRoot, work,
    nativeOutputs: language.outputs, finalize: language.receipt,
    render: await bind(`${folder}/${lang}/render.receipt.json`), displayBinding: mapping,
    html: await Promise.all(['text', 'exercises'].map(kind => bind(`${work}/${card}/${kind}.html`))),
  });
  const answerPath = `${base}/d288-n68-t5-written-answer-author/t5/${lang}/answer-keys.candidate.json`;
  const answer = await read(answerPath);
  const reviewedAnswers = aggregate.answers.filter(row => row.lesson === card);
  assert.deepEqual(answer.answers.map(row => String(row.exercise)), approvedIds);
  for (const [i, item] of answer.answers.entries()) {
    assert.equal(item.displayAnswer, reviewedAnswers[i].displayAnswer[lang]);
    assert.equal(item.evidenceId, reviewedAnswers[i].evidenceId);
    assert.equal(item.prompt, sourceExercises.exercises.find(e => String(e.number) === item.exercise).text);
    assert.equal(item.source, 'derived');
    assert.equal(item.grading, 'ungraded');
    assert.deepEqual(item.parts, []);
  }
  const choicePath = `${base}/d295-t5-choice-beam-repair/${lang}/draft.json`;
  const expectedChoice = choiceReview.inputs.find(row => row.path === `d295-t5-choice-beam-repair/${lang}/draft.json`);
  assert.ok(expectedChoice);
  await verify(choicePath, expectedChoice.sha256);
  const draft = await read(choicePath);
  const consumptionPath = `${folder}/${lang}/consumed-reviews.json`;
  await immutableWrite(consumptionPath, serialize({
    status: 'pass', scope: 'INHERITED-six-reviewed-written-answers-and-six-selected-choices-only',
    choiceDraftSha256: expectedChoice.sha256, answerKeysSha256: (await bind(answerPath)).sha256,
    exerciseIds: approvedIds, questionIds: draft.questions.map(row => row.id),
    inputs: await Promise.all([answerReviewPath, choiceReviewPath, aggregatePath].map(bind)),
    fullAnswerKeyOrGate2Claim: false, completeCardClaim: false,
    heldExercise5: choiceReview.selectedCoverage.unselectedEx5,
    independentSubstantiveReviewRepeated: false, imagesOpened: 0,
  }));
  supplements.push({
    language: lang, root: displayRoot, work,
    choiceDraft: await bind(choicePath), answerKeys: await bind(answerPath),
    review: await bind(consumptionPath), outputs: [await bind(consumptionPath)],
    approvedExerciseIds: approvedIds, heldExerciseIds: heldIds, completeCardClaim: false,
  });
}
await immutableWrite(`${folder}/native-display-inputs.json`, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', card,
  status: 'PASS-native-structure-scoped-display-pending',
  priorNative: await bind(nativePath), languages,
  firstNativeRenders: 2, nativeFinalizationRepeated: false, completeCardClaim: false,
}));
await immutableWrite(`${folder}/supplemental-inputs.json`, serialize({
  ticket: 'STEMROBIN-181', card, languages: supplements,
  status: 'INHERITED-reviewed-selected-subset-with-unit-HOLD',
  originalTasks: 7, reviewedTasks: 6, heldExerciseIds: heldIds, completeCardClaim: false,
}));
for (const [file, sha] of expectedInputs) await verify(file, sha);
for (const row of protectedFiles) await verify(row.path, row.sha256);
await immutableWrite(`${folder}/manifest.json`, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033',
  cards: [{ card, native: await bind(`${folder}/native-display-inputs.json`) }],
  supplemental: await bind(`${folder}/supplemental-inputs.json`),
  scriptAdaptation: await bind(`${folder}/script-adaptation.json`),
  policy: 'First t5 bilingual offline DOM/capture only; no image opens or visual PASS.',
  heldExerciseIds: heldIds, completeCardClaim: false,
  inheritedReviews: await Promise.all([answerReviewPath, choiceReviewPath].map(bind)),
  newWorkersWorktreesBranches: 0, imagesOpened: 0,
  cumulativeImages: { parent: 24, Raman: 24, Galileo: 24, Locke: 24 },
  DBMergeDeployCommitPushOrFormalHandoff: false,
}));
console.log(JSON.stringify(await bind(`${folder}/manifest.json`)));

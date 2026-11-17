import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const cwd = process.cwd();
const ticket = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp');
const own = path.join(ticket, 'd031-n113-prose-author');
const folder = path.join(own, 'work/adapt/9p/modern-us-neutral/lessons/phy9-c2-s4-n113');
const artifacts = path.join(own, 'artifacts/9p');
const finalPath = path.join(ticket, '9p-n113-prose-freeze.json');
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const read = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const bind = async file => {
  const data = await fs.readFile(file);
  return { path: file, bytes: data.length, sha256: hash(data) };
};
const dump = async (file, value) => {
  assert.ok(file.startsWith(`${own}/`) || file === finalPath);
  await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
};
await assert.rejects(fs.access(finalPath), { code: 'ENOENT' });
const lessonPath = path.join(folder, 'lesson.template.json');
const examplesPath = path.join(folder, 'exercises.template.json');
const lesson = await read(lessonPath);
const exercises = await read(examplesPath);
const englishLessonPath = path.join(own, 'lesson.en.json');
const englishExercisesPath = path.join(own, 'exercises.en.json');
const enLesson = await read(englishLessonPath);
const enExercises = await read(englishExercisesPath);
const preparedLesson = await read(path.join(own, 'prepared/lesson.template.json'));
const preparedExercises = await read(path.join(own, 'prepared/exercises.template.json'));
assert.equal(lesson.id, 'phy9-c2-s4-n113');
assert.equal(lesson.card_id, lesson.id);
assert.equal(enLesson.id, lesson.id);
assert.equal(exercises.count, 2);
assert.equal(enExercises.count, 2);
assert.deepEqual(lesson.source, preparedLesson.source);
assert.deepEqual(exercises.source, preparedExercises.source);
assert.deepEqual(enLesson.source, lesson.source);
assert.deepEqual(enExercises.source, exercises.source);
assert.equal(enLesson.chinese_template.sha256, (await bind(lessonPath)).sha256);
assert.equal(enExercises.chinese_template.sha256, (await bind(examplesPath)).sha256);
assert.equal(lesson.prose.length, 13);
assert.equal(enLesson.prose.length, 13);
const perBlock = [];
const mathTokens = text => [...text.matchAll(/\$\$(.*?)\$\$|\$([^$]*?)\$/gs)].map(row => row[0]);
for (const [index, block] of lesson.prose.entries()) {
  const raw = preparedLesson.prose[index];
  const english = enLesson.prose[index];
  for (const field of ['kind', 'id', 'label', 'printed_page', 'source_refs'])
    assert.deepEqual(block[field], raw[field]);
  for (const field of ['kind', 'id', 'printed_page', 'source_refs'])
    assert.deepEqual(english[field], raw[field]);
  assert.equal(block.source_text, raw.source_text);
  assert.equal(english.source_text, raw.source_text);
  assert.deepEqual(block.numeric_changes, []);
  assert.deepEqual(english.numeric_changes, []);
  assert.deepEqual(mathTokens(block.text), mathTokens(english.text));
  if (block.kind === 'p') {
    assert.equal(block.text.split(/\n{2,}/).length, english.text.split(/\n{2,}/).length);
    for (const [paragraphIndex, pair] of english.paragraph_alignment.entries()) {
      assert.equal(pair.chinese_text, block.text.split(/\n{2,}/)[paragraphIndex]);
      assert.equal(pair.english_text, english.text.split(/\n{2,}/)[paragraphIndex]);
    }
  }
  perBlock.push({
    blockIndex: index, source_refs: block.source_refs, kind: block.kind,
    source_text_sha256: hash(block.source_text),
    chinese_text_sha256: hash(block.text), english_text_sha256: hash(english.text),
    source_math: mathTokens(block.source_text), chinese_math: mathTokens(block.text),
    english_math: mathTokens(english.text),
  });
}
const perExample = [];
for (const [index, example] of exercises.exercises.entries()) {
  const raw = preparedExercises.exercises[index];
  const english = enExercises.exercises[index];
  for (const field of ['number', 'source_number', 'group', 'group_id', 'pages', 'figure_refs', 'figures'])
    assert.deepEqual(example[field], raw[field]);
  for (const field of ['number', 'source_number', 'group', 'group_id', 'pages', 'figure_refs'])
    assert.deepEqual(english[field], raw[field]);
  assert.equal(example.source_text, raw.source_text);
  assert.equal(english.source_text, raw.source_text);
  assert.ok(example.text.includes('**解**'));
  assert.ok(english.text.includes('**Solution**'));
  assert.equal(example.lines.join('\n'), example.text);
  assert.equal(english.lines.join('\n'), english.text);
  assert.deepEqual(mathTokens(example.text), mathTokens(english.text));
  const erratum = lesson.errata.find(row => row.target === `exercises[${index}]`);
  assert.ok(erratum);
  assert.deepEqual(mathTokens(example.text), mathTokens(
    raw.source_text.replace(erratum.original, erratum.corrected)));
  for (const object of [example, english]) {
    assert.deepEqual(object.numeric_changes, []);
    for (const key of ['answer', 'answerKey', 'interaction', 'choices', 'correct_index', 'choiceSet'])
      assert.ok(!(key in object));
  }
  for (const [paragraphIndex, pair] of english.paragraph_alignment.entries()) {
    assert.equal(pair.chinese_text, example.text.split(/\n{2,}/)[paragraphIndex]);
    assert.equal(pair.english_text, english.text.split(/\n{2,}/)[paragraphIndex]);
  }
  perExample.push({
    number: example.number, group_id: example.group_id, pages: example.pages,
    source_text_sha256: hash(example.source_text),
    chinese_text_sha256: hash(example.text), english_text_sha256: hash(english.text),
    source_math: mathTokens(example.source_text), chinese_math: mathTokens(example.text),
    english_math: mathTokens(english.text), boundErratum: erratum.id,
  });
}
const python = path.join(cwd, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
const args = [python, '-B', path.join(own, 'text-bindings.py'),
  path.join(cwd, '.claude/skills/ld-s10y-lesson/tools')];
const result = spawnSync(args[0], args.slice(1), {
  cwd, input: JSON.stringify({ book: artifacts, lesson, exercises,
    englishLesson: enLesson, englishExercises: enExercises }),
  encoding: 'utf8', maxBuffer: 4 * 1024 * 1024,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
await dump(path.join(own, 'text-bindings.final.command.json'), {
  command: args, exitCode: result.status, stderr: result.stderr,
});
await fs.writeFile(path.join(own, 'text-bindings.final.result.json'), result.stdout, { flag: 'wx' });
assert.equal(result.status, 0, result.stdout || result.stderr);
const textReport = JSON.parse(result.stdout);
assert.deepEqual(textReport.errors, []);
const native = await read(path.join(own, 'inputs/pages-native.json'));
const figureBindings = [];
for (const figure of native.cropReviewTargets) {
  for (const [extension, binding] of [['png', figure.crop], ['svg', figure.svg]]) {
    const file = path.join(artifacts, 'figures', `${figure.id}.${extension}`);
    const actual = await bind(file);
    assert.equal(actual.sha256, binding.sha256);
    figureBindings.push({ id: figure.id, ...actual,
      approvedInputSha256: binding.sha256, bytesUnchanged: true, visuallyOpened: false });
  }
}
const inputBindings = await read(path.join(own, 'inputs.binding.json'));
for (const binding of [...inputBindings.inputs, ...inputBindings.protectedFiles])
  assert.equal((await bind(binding.path)).sha256, binding.sha256, binding.path);
assert.equal((await bind(path.join(folder, 'figures.template.json'))).sha256,
  (await bind(path.join(own, 'prepared/figures.template.json'))).sha256);
for (const [label, expected] of [['finalize-278', 0], ['assemble', 0], ['adapt-prepare', 0]])
  assert.equal((await read(path.join(own, `${label}.command.json`))).exitCode, expected);
const zhFlow = await read(path.join(own, 'prose-flow.final.zh.json'));
const flowArgs = ['node', path.join(cwd, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs'),
  '--json', englishLessonPath];
const flowResult = spawnSync(flowArgs[0], flowArgs.slice(1), { cwd, encoding: 'utf8' });
await dump(path.join(own, 'prose-flow.final.en.repaired.command.json'), {
  command: flowArgs, exitCode: flowResult.status, stderr: flowResult.stderr,
  repair: 'Move unchanged figure230 away from an English sentence-final period; Chinese and all anchors unchanged.',
});
assert.equal(flowResult.status, 0, flowResult.stderr);
const enFlow = JSON.parse(flowResult.stdout);
await dump(path.join(own, 'prose-flow.final.en.repaired.json'), enFlow);
assert.equal(zhFlow.paragraphs.length, 14);
assert.deepEqual(zhFlow.resolvedBreaks, [5, 8, 12]);
assert.deepEqual(enFlow.resolvedBreaks, zhFlow.resolvedBreaks);
for (const row of zhFlow.boundaries)
  assert.ok(lesson.section_breaks.some(boundary => boundary.before === row.before && boundary.after === row.after));
const calculations = await read(path.join(own, 'calculations.json'));
const exactArea_cm2 = 4 * Math.PI * 5 ** 2;
const exactCharge_C = 0.01 * exactArea_cm2 * 1800;
const exactMass_kg = 0.0635 * exactCharge_C / (2 * 96500);
assert.equal(Number(exactMass_kg.toPrecision(2)), 1.9e-3);
assert.equal(Number(calculations.example2.result_V.toPrecision(2)), 1.4e-20);
await dump(path.join(own, 'author-arithmetic-crosscheck.json'), {
  scope: 'Author arithmetic only, not independent SCI.',
  example1: {
    fromPreservedGivens: '4*pi*5^2; charge0.01*area*1800; mass0.0635*charge/(2*96500)',
    exactArea_cm2, exactCharge_C, exactMass_kg,
    sourceRounding: 'Source prints area314cm2 and charge5652C; use these in the lesson exactly. Computing from pi independently gives the same two-significant-digit mass1.9e-3kg.',
    massUsingPreservedPrintedIntermediates_kg: calculations.example1.result_kg,
  },
  example2: {
    fromPreservedGivens: '1.6e-19*1e4*(3e-3)*(3e-3)*1',
    coefficient: '1.6*3*3=14.4',
    powers: '-19+4-3-3=-21, hence14.4e-21=1.44e-20',
    preservedGivenValuesNotBacksolvedFromPrintedResult: true,
  },
});
const files = [];
async function collect(directory) {
  for (const entry of (await fs.readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await collect(file);
    else if (entry.isFile()) files.push(await bind(file));
    else throw new Error(`Unexpected non-owned file type ${file}`);
  }
}
await collect(own);
const sourceFiles = files.filter(row => row.path.startsWith(`${artifacts}/`));
const preparedFiles = files.filter(row => row.path.startsWith(`${own}/prepared/`));
const freeze = {
  schema: 'ld-s10y-lesson/bounded-prose-author-freeze@1',
  ticket: 'STEMROBIN-181', book: '9p', card: lesson.id, edition: 'modern-us-neutral',
  date: '2026-11-16', workspace: cwd,
  status: 'DRAFT_FROZEN_PENDING_INDEPENDENT_SCI_FIGURES_DISPLAY',
  scope: 'Same active invocation; no new setup. Chinese lesson and two printed solved examples, full aligned English translation, own source-copy metadata errata only.',
  ownedPaths: [own, finalPath],
  isolatedRoots: { artifactRoot: path.join(own, 'artifacts'), workRoot: path.join(own, 'work') },
  source: {
    candidateReport: await bind(path.join(ticket, 'd030-n113-source-candidate/result.json')),
    expectedCandidateReportSHA256: 'ac7f99cedec1d08f1d72b6787e619dbbb28a2420d3373812d6a0a4dc27f6f15c',
    reusedSOURCE: await bind(path.join(ticket, 'd030-source276-279-affected-review.json')),
    reusedCropReviews: await Promise.all(['d030-source276-crop-review.json',
      'd030-source277-278-crop-review.json'].map(name => bind(path.join(ticket, name)))),
    reusedEvidenceNotNewApproval: true,
    fullSnapshotLesson: lesson.source, fullSnapshotExercises: exercises.source,
    ownFinalizedSourceFiles: sourceFiles,
    preparedSnapshots: preparedFiles,
    allSourceSnapshotsPreserved: true, raw113BytesEqualOldCandidate: true,
    allPageBodyBytesUnchanged: true,
    metadataOnlyChangedPage: { physicalPage: 278, printedPage: 269,
      files: await Promise.all(['page.md', 'page.json', 'audit.json'].map(name =>
        bind(path.join(artifacts, 'pages/0278', name)))),
      errata: lesson.errata,
    },
    sourceFigures: figureBindings,
  },
  drafts: {
    chineseLesson: await bind(lessonPath),
    chineseWorkedExamples: await bind(examplesPath),
    englishLesson: await bind(englishLessonPath),
    englishWorkedExamples: await bind(englishExercisesPath),
    unchangedNativeFigureTemplate: await bind(path.join(folder, 'figures.template.json')),
    translationAlignment: await bind(path.join(own, 'translation-alignment.json')),
    perBlockBindings: perBlock, perExampleBindings: perExample,
    completeSourceWorkedExamples: 2, newUnsolvedTasks: 0, numericChanges: [],
    formulaChanges: lesson.errata.map(row => ({ id: row.id, target: row.target,
      original: row.original, corrected: row.corrected, source: row.source })),
    contextChanges: (await read(path.join(own, 'author-notes.json'))).contextChanges,
    sourceDottedEmphasisPreservedAsStrong: true,
    fullAlignedEnglish: true,
  },
  native: {
    finalize278Invocations: 1, sourceAssembleInvocations: 1, adaptPrepare113Invocations: 1,
    paragraphNormalizerInvocations: 1, scopedTextBindingsInvocations: 2,
    nativeParagraphNormalizerBeforeAnchors: true,
    normalizedAdjacentBoundaryObjectsFromActualOutput: lesson.section_breaks,
    paragraphCountPerLanguage: 14, resolvedBreaksPerLanguage: zhFlow.resolvedBreaks,
    metadataCropPreservation: await bind(path.join(own, 'metadata-finalize-preservation.json')),
    prepareReceipt: await bind(path.join(own, 'prepare.result.json')),
    normalizerReceipt: await bind(path.join(own, 'normalizer.command.json')),
    normalizedOutput: await bind(path.join(own, 'normalizer.after.json')),
    beforeAnchorToolOutput: await bind(path.join(own, 'prose-flow.before-anchors.stdout.txt')),
    chineseFlow: await bind(path.join(own, 'prose-flow.final.zh.json')),
    englishFlow: await bind(path.join(own, 'prose-flow.final.en.repaired.json')),
    textBindingCheck: await bind(path.join(own, 'text-bindings.final.result.json')),
    textBindingStatus: textReport.status,
    assembleWarning: 'Bounded t18 source refers to absent older fig-189. This pre-existing bounded-source warning does not authorize t18 authoring or promotion.',
  },
  calculations: {
    detailed: await bind(path.join(own, 'calculations.json')),
    crosscheck: await bind(path.join(own, 'author-arithmetic-crosscheck.json')),
    mass_kg: calculations.example1.result_kg,
    massRounded: '1.9e-3 kg',
    voltage_V: calculations.example2.result_V,
    voltageRounded: '1.4e-20 V',
    registeredOnlyOnOwnSourceCopy: true,
    noNewFalseGivens: true,
    dependencyIfUnsafeRegistration: 'Not triggered; native metadata finalize and authoritative target binding succeeded.',
  },
  authorBrief: await bind(path.join(own, 'brief.json')),
  authorNotes: await bind(path.join(own, 'author-notes.json')),
  primaryReading: {
    cachedOnly: true, freshAcquisitions: 0,
    files: files.filter(row => row.path.startsWith(`${own}/inputs/references/`)),
    prerequisiteN101: await bind(path.join(own, 'inputs/prerequisite-n101.lesson.json')),
  },
  imageOpens: 0, imageOpenLog: [],
  imageAccounting: {
    visualOpens: 0, generatedArtwork: 0, modifiedImageContent: 0,
    modernImagesOrSpecsAuthored: 0, nativeVectorizations: 0,
    sourceFilesCopiedByteForByte: true,
    nativeFinalizeInternalRasterRead: 'Own page278 PNG only; native crop output byte-equal to approved inputs. This is not a visual image open or new figure.',
  },
  failures: [
    ...inputBindings.initialReadFailures,
    {
      stage: 'First scoped text-bindings check, before freeze',
      receipt: await bind(path.join(own, 'text-bindings.command.json')),
      report: await bind(path.join(own, 'text-bindings.result.json')),
      reason: 'Native NUMBER regex excludes a number immediately followed by a period. English prose had Figure230 at sentence end; figure reference was present but not counted.',
      change: 'Rephrase as the Figure230 circuit. Number, source snapshot, Chinese prose, formulas and anchors unchanged. Retained failed receipt; second scoped check is final.',
      sourceNativeReruns: 0, freezeWrittenDuringFailure: false,
    },
  ],
  approvals: {
    independentSCI: 'NOT_SIGNED',
    independentFigureApproval: 'NOT_SIGNED',
    displayApproval: 'NOT_PERFORMED',
    sourceAndCropReviews: 'EXISTING_HASH_BOUND_INPUTS_REUSED_ONLY',
    adaptFinalize: 'NOT_RUN', render: 'NOT_RUN',
    promotion: 'NOT_PERFORMED', publication: 'NOT_PERFORMED',
  },
  requiredDependencies: [
    'Independent SCI must review these exact Chinese and English texts, author arithmetic errata, thermistor/photoconductivity explanations, conditional historical bolometer claim and worked-example assumptions.',
    'Modern figures and independent figure review must be supplied by their owners; inherited source images, including fig-231 Cyrillic text, are not modern display approvals.',
    'Authorized native adapt-finalize after those prerequisites, then authorized offline display review and any later promotion/publication by the coordinating owner.',
  ],
  restrictions: {
    sharedSourceWrites: 0, oldCandidateWrites: 0, sharedModernWrites: 0,
    figureAuthorWrites: 0, t18ModernAuthoring: 0,
    newSetup: 0, databaseOperations: 0, gitOperations: 0,
    appRuns: 0, dependencyChanges: 0, networkOperations: 0,
    bulkValidation: 0, fullTestsOrBuilds: 0,
    newQuestionsOrChoices: 0, standaloneAnswerKeys: 0, keyboardInteraction: 0,
    sourceFormulaChanges: 0, onlyRegisteredModernResultCorrections: 2,
  },
  ownedFileManifest: files,
  protectedFilesVerifiedUnchanged: inputBindings.protectedFiles,
};
await dump(finalPath, freeze);
console.log(JSON.stringify({
  freeze: await bind(finalPath),
  chineseLesson: freeze.drafts.chineseLesson,
  chineseWorkedExamples: freeze.drafts.chineseWorkedExamples,
  englishLesson: freeze.drafts.englishLesson,
  englishWorkedExamples: freeze.drafts.englishWorkedExamples,
  sourcePage278: freeze.source.metadataOnlyChangedPage.files,
  changes: ['Full aligned Chinese/English prose and two solved examples',
    'Own page278 metadata-only arithmetic errata: mass1.9e-3kg; voltage1.4e-20V',
    'Normalized tool-output anchors5/8/12; all source/crop bytes retained; zero visual image opens'],
}, null, 2));

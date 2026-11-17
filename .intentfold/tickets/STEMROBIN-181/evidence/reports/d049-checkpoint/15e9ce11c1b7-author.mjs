import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const folder = path.dirname(import.meta.filename);
assert.equal(folder, path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d049-10p-n43-author'));
assert.equal(process.cwd(), repo);
const card = 'phy10-c1-s5-n43';
const relative = `adapt/10p/modern-us-neutral/lessons/${card}`;
const preparation = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d049-sound-preparation/prepared.json');
const preparationSha = 'e8ebee1ede5d5c86f2b9bed7b00e9638fef5e3a3e548ed0be0e74454eb339516';
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
const flowTool = path.join(repo, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs');
const texts = JSON.parse(await fs.readFile(path.join(folder, 'texts.json'), 'utf8'));
const inputs = JSON.parse(await fs.readFile(path.join(folder, 'input-freeze.json'), 'utf8'));
const bind = async file => ({
  path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex'),
});
const owned = relativePath => {
  const target = path.resolve(folder, relativePath);
  assert.ok(target.startsWith(`${folder}/`));
  return target;
};
const saveBytes = async (relativePath, value) => {
  const target = owned(relativePath);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, value, { flag: 'wx' });
};
const save = async (relativePath, value) => {
  await saveBytes(relativePath, `${JSON.stringify(value, null, 2)}\n`);
};
const receipt = async (name, command, args, input) => {
  const toolBindings = await Promise.all(toolPaths.map(file => bind(path.join(repo, file))));
  const startedAt = new Date().toISOString();
  const result = spawnSync(command, args, {
    cwd: repo, encoding: 'utf8', timeout: 180000, input,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  const toolBindingsAfter = await Promise.all(toolPaths.map(file => bind(path.join(repo, file))));
  await save(`${name}.json`, {
    command, args, cwd: repo, startedAt, finishedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal,
    stdout: result.stdout, stderr: result.stderr, error: result.error?.message ?? null,
    toolBindings, toolBindingsAfter,
    toolDriftDuringInvocation: toolBindings.filter((item, index) =>
      item.sha256 !== toolBindingsAfter[index].sha256),
  });
  return result;
};
const assertBinding = async item => {
  assert.equal((await bind(path.resolve(repo, item.path))).sha256, item.sha256, item.path);
};
const verifyInputs = async () => {
  assert.equal((await bind(preparation)).sha256, preparationSha);
  for (const input of inputs.inputs) {
    if (input.original) {
      await assertBinding(input.original);
      await assertBinding(input.snapshot);
    } else {
      await assertBinding(input);
    }
  }
  await assertBinding(inputs.raw);
  await assertBinding(inputs.exercises);
};
const toolPaths = [
  '.claude/skills/ld-s10y-lesson/tools/edition.py',
  '.claude/skills/ld-s10y-lesson/tools/assemble.py',
  '.claude/skills/ld-s10y-lesson/tools/mathcheck.py',
  '.claude/skills/ld-s10y-lesson/tools/katex_check.js',
  '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs',
  '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js',
  '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json',
];
const contractPaths = [
  'AGENTS.md',
  '.intentfold/readme.md',
  '.intentfold/charter/engineering.md',
  '.intentfold/charter/operations.md',
  '.intentfold/charter/product.md',
  '.intentfold/charter/ui.md',
  '.claude/skills/ld-s10y-lesson/SKILL.md',
  '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md',
  '.intentfold/tickets/STEMROBIN-181/tmp/d044-10p-n38-author/author.mjs',
  '.intentfold/tickets/STEMROBIN-181/tmp/d044-10p-n38-author/validate-text.py',
  '.intentfold/tickets/STEMROBIN-181/tmp/d044-10p-n38-author/normalize-text.py',
];
for (const output of [
  'prepared', 'rawtext', 'native', 'history', 'author-freeze.json',
  'input-verification.json', 'protected-input-bindings.json', 'text-check.json',
  'preservation-check.json', 'prose-coverage.json', 'source-closure.json',
]) {
  await assert.rejects(fs.lstat(owned(output)), { code: 'ENOENT' });
}
await verifyInputs();
assert.equal(texts.length, 14);
const protectedBindings = [];
const captureProtected = async directory => {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    assert.ok(!entry.isSymbolicLink(), 'No symlink targets in the bounded author directory.');
    if (entry.isDirectory()) await captureProtected(target);
    else protectedBindings.push(await bind(target));
  }
};
for (const language of ['en', 'zh']) {
  await captureProtected(path.join(folder, language, 'root'));
  await captureProtected(path.join(folder, language, 'work'));
}
const contractBindings = await Promise.all(contractPaths.map(file => bind(path.join(repo, file))));
await save('protected-input-bindings.json', protectedBindings);
await save('input-verification.json', {
  status: 'pass',
  inputFreeze: await bind(owned('input-freeze.json')),
  prepared: await bind(preparation),
  requiredPreparedSha256: preparationSha,
  verifiedSourceBindings: inputs.inputs.flatMap(item =>
    item.original ? [item.original, item.snapshot] : [item]).length + 2,
  protectedOwnedInputFiles: protectedBindings.length,
  referenceHelper: {
    requested: path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d044-10p-n38-author/check-text.py'),
    requestedPathExists: false,
    inspectedActualHelper: await bind(path.join(repo,
      '.intentfold/tickets/STEMROBIN-181/tmp/d044-10p-n38-author/validate-text.py')),
    adaptation: 'Owned check-text.py reuses the actual n38 native text-only validation subset, one locale per invocation.',
  },
  imagesOpened: 0, imageBytesOnlyHashed: true,
});

const frozen = [];
const reports = [];
for (const language of ['en', 'zh']) {
  const templateDir = path.join(folder, language, 'work', relative);
  let lesson = JSON.parse(await fs.readFile(path.join(templateDir, 'lesson.template.json'), 'utf8'));
  assert.equal(lesson.prose.length, texts.length);
  const raw = JSON.parse(await fs.readFile(
    path.join(folder, language, 'root/10p/lessons', card, 'lesson.json'), 'utf8'));
  assert.deepEqual(lesson.source.data, raw);
  lesson.language = language;
  for (const name of ['lesson.template.json', 'exercises.template.json', 'figures.template.json']) {
    await saveBytes(`prepared/${language}/${name}`, await fs.readFile(path.join(templateDir, name)));
  }
  for (const [index, block] of lesson.prose.entries()) {
    assert.deepEqual(block.source_refs, texts[index].source_refs);
    assert.equal(block.source_text, raw.prose[index].text);
    block.text = texts[index][language];
    block.changes = block.text === block.source_text ? [] : [
      ...(language === 'en' ? ['translation'] : []),
      ...(['p', 'cap'].includes(block.kind) ? ['wording', 'layout'] : []),
    ];
    block.numeric_changes = [];
  }
  await save(`rawtext/${language}/lesson.template.json`, lesson);
  await save(`rawtext/${language}/prose.json`, {
    language, card, prose: lesson.prose, section_breaks: [],
  });
  const title = language === 'zh' ? '乐音和噪音：响度和音调'
    : 'Musical Tones and Noise: Loudness and Pitch';
  await saveBytes(`rawtext/${language}/lesson.md`, [
    `# ${title}`, '',
    ...lesson.prose.filter(item => item.kind !== 'fig').flatMap(item => [item.text, '']),
  ].join('\n'));
  const normalization = await receipt(`history/initial/normalize-${language}`, python,
    ['-B', owned('normalize-text.py')], JSON.stringify(lesson));
  assert.equal(normalization.status, 0, normalization.stderr);
  lesson = JSON.parse(normalization.stdout).document;
  await save(`native/${language}/unsectioned/lesson.template.json`, lesson);
  const candidates = await receipt(`history/initial/prose-flow-${language}-candidates`,
    process.execPath, [flowTool, owned(`native/${language}/unsectioned/lesson.template.json`)]);
  assert.equal(candidates.status, 0, candidates.stderr);
  const boundaryObjects = candidates.stdout.split('\n')
    .filter(line => line.trim().startsWith('break: '))
    .map(line => JSON.parse(line.trim().slice('break: '.length)));
  // Copy production-flow anchors at source-bound concept starts, not block indices.
  lesson.section_breaks = ['p0120#5', 'p0121#7', 'p0121#9', 'p0122#2'].map(ref => {
    const block = lesson.prose.find(item => item.source_refs.includes(ref));
    const matches = boundaryObjects.filter(boundary =>
      boundary.after.startsWith(block.text.split('\n')[0]));
    assert.equal(matches.length, 1, ref);
    return matches[0];
  });
  const templatePath = owned(`native/${language}/lesson.template.json`);
  await save(`native/${language}/lesson.template.json`, lesson);
  for (const name of ['exercises.template.json', 'figures.template.json']) {
    await saveBytes(`native/${language}/${name}`, await fs.readFile(path.join(templateDir, name)));
  }
  const flowResult = await receipt(`history/initial/prose-flow-${language}`, process.execPath,
    [flowTool, '--json', templatePath]);
  assert.equal(flowResult.status, 0, flowResult.stderr);
  const flow = JSON.parse(flowResult.stdout);
  assert.equal(flow.boundaries.length, 4);
  await save(`native/${language}/prose-flow.json`, flow);
  await save(`native/${language}/prose.json`, {
    language, card, prose: lesson.prose, section_breaks: lesson.section_breaks,
  });
  await saveBytes(`native/${language}/lesson.md`, [
    `# ${title}`, '',
    ...lesson.prose.filter(item => item.kind !== 'fig').flatMap(item => [item.text, '']),
  ].join('\n'));
  for (const name of ['lesson.template.json', 'exercises.template.json', 'figures.template.json']) {
    await saveBytes(`history/initial/${language}/${name}`, await fs.readFile(owned(`native/${language}/${name}`)));
  }
  const checkResult = await receipt(`history/initial/text-check-${language}-command`, python,
    ['-B', owned('check-text.py'), language]);
  let check;
  try {
    check = JSON.parse(checkResult.stdout);
    assert.ok(checkResult.status === 0 || checkResult.status === 1);
    assert.equal(checkResult.status, check.status === 'pass' ? 0 : 1);
  } catch (error) {
    check = {
      card, language, status: 'fail', native_text_status: 'not-completed',
      errors: [`Native text invocation did not complete normally: ${error.message}`],
      exitCode: checkResult.status, stdout: checkResult.stdout, stderr: checkResult.stderr,
    };
  }
  await save(`history/initial/text-check-${language}.json`, check);
  await save(`native/${language}/text-check.json`, check);
  reports.push(check);
  frozen.push({
    language,
    template: await bind(templatePath),
    exercisesTemplate: await bind(owned(`native/${language}/exercises.template.json`)),
    figuresTemplate: await bind(owned(`native/${language}/figures.template.json`)),
    rawText: await bind(owned(`rawtext/${language}/lesson.template.json`)),
    currentProse: await bind(owned(`native/${language}/prose.json`)),
    readingText: await bind(owned(`native/${language}/lesson.md`)),
    nativeNormalizationReceipt: await bind(owned(`history/initial/normalize-${language}.json`)),
    nativeFlowReceipt: await bind(owned(`history/initial/prose-flow-${language}.json`)),
    nativeFlow: await bind(owned(`native/${language}/prose-flow.json`)),
    boundaryCandidatesReceipt: await bind(owned(`history/initial/prose-flow-${language}-candidates.json`)),
    nativeTextCommandReceipt: await bind(owned(`history/initial/text-check-${language}-command.json`)),
    nativeTextCheck: await bind(owned(`native/${language}/text-check.json`)),
    nativeTextStatus: check.native_text_status,
    validationStatus: check.status,
    stageStatuses: check.stage_statuses ?? null,
    paragraphs: flow.paragraphs.length,
    sectionBreaks: flow.boundaries.length,
    nativeValidationInvocations: 1,
  });
}
const check = {
  schema: 'ld-s10y-lesson/bounded-text-check@1',
  ticket: 'STEMROBIN-181', card,
  status: reports.every(item => item.status === 'pass') ? 'pass' : 'fail',
  native_text_status: reports.every(item => item.native_text_status === 'pass') ? 'pass' : 'fail',
  languages: reports,
  errors: reports.flatMap(item => item.errors),
  nativeInvocations: { en: 1, zh: 1 },
  imagesOpened: 0, adaptFinalizeRun: false, renderRun: false,
};
await save('text-check.json', check);
await verifyInputs();
for (const item of protectedBindings) await assertBinding(item);
const contractBindingsAfter = await Promise.all(contractPaths.map(file => bind(path.join(repo, file))));
const toolBindingsCurrent = await Promise.all(toolPaths.map(file => bind(path.join(repo, file))));
await save('preservation-check.json', {
  status: 'pass', protectedBindings,
  inputFreeze: await bind(owned('input-freeze.json')),
  prepared: await bind(preparation),
  allFrozenSourceBindingsVerified: true, preparedTemplatesUnchanged: true,
  imagesOpened: 0, imageBytesOnlyHashed: true, externalFilesWritten: false,
  contractBindings, contractBindingsAfter, toolBindingsCurrent,
  contractDrift: contractBindings.filter((item, index) =>
    item.sha256 !== contractBindingsAfter[index].sha256),
});
const rawPath = owned(`zh/root/10p/lessons/${card}/lesson.json`);
const raw = JSON.parse(await fs.readFile(rawPath, 'utf8'));
const counts = {
  rawObjects: raw.prose.length,
  prose: raw.prose.filter(item => item.kind === 'p').length,
  figures: raw.prose.filter(item => item.kind === 'fig').length,
  captions: raw.prose.filter(item => item.kind === 'cap').length,
  tasks: 0, choices: 0, answers: 0,
};
await save('prose-coverage.json', {
  schema: 'ld-s10y-lesson/bounded-author-prose-coverage@1',
  ticket: 'STEMROBIN-181', card,
  status: 'author-declaration-not-independent-SCI-or-ZHEN',
  claims: [
    { source_refs: ['p0120#4'], facts: ['everyday tone/noise contrast', 'singing', 'taut strings', 'whistles', 'explosions', 'internal-combustion engine', 'snake hiss', 'dog barking/howling', 'vocal organs'] },
    { source_refs: ['p0120#5'], facts: ['physical distinction of musical tone and noise', 'differences among tones'], sourceQuestionsRemainProse: true },
    { source_refs: ['p0120#6', 'p0121#1', 'p0121#4'], facts: ['Figure 81', 'tuning fork', 'top-opening wooden box', 'small hammer', 'two arms', 'sound-wave production', 'decay', 'needle on one arm', 'uniform sliding', 'soot-blackened glass', 'near-sine trace', 'Figure 82', 'time trace', 'sand-pendulum analogy', 'near-harmonic vibration'] },
    { source_refs: ['p0120#8'], facts: ['Figure 81 caption identifies the source-described apparatus'], imageInspectionClaim: false },
    { source_refs: ['p0121#3'], facts: ['Figure 82 caption identifies the source-described time trace'], imageInspectionClaim: false },
    { source_refs: ['p0121#5'], facts: ['harmonic vibration', 'pure tone'], qualification: 'Ideal pure sound has a single frequency; general musical tones can have related frequency components.' },
    { source_refs: ['p0121#6'], facts: ['perceived loudness and pitch distinctions'] },
    { source_refs: ['p0121#7'], facts: ['harder strike', 'larger amplitude', 'louder fork'], qualification: 'Same fork, frequency, listening position and conditions; perceived loudness also depends on the ear.' },
    { source_refs: ['p0121#8'], facts: ['frequency-dependent ear sensitivity', 'equal amplitudes do not imply equal loudness', 'unchanged 3500 Hz source quantity'], qualification: 'Source approximation explicitly attributed; not a universal peak for every listener and sound level.' },
    { source_refs: ['p0121#9'], facts: ['different-sized forks', 'needle', 'soot-blackened glass', 'higher pitch', 'shorter period', 'higher frequency'], qualification: 'Same uniform recording speed; direct frequency-to-pitch statement scoped to pure tones.' },
    { source_refs: ['p0121#10', 'p0122#1'], facts: ['vibrating strings', 'greater tension', 'higher free-vibration frequency', 'guitar tuning peg', 'higher pitch'], qualification: 'Same string and vibrating length.' },
    { source_refs: ['p0122#2'], facts: ['mixed frequencies', 'no single stable pitch in typical noise'], qualification: 'Noise is an irregular mixture, not merely any multifrequency sound; musical tones can have a repeating pattern; real sounds can combine tone and noise.' },
  ],
  historicalEntities: [],
  historicalQuantity: {
    source_refs: ['p0121#8'], source: '3500赫兹', en: '3500 Hz', zh: '3500赫兹',
    scientificValueChanged: false, unitChanged: false,
    nativeQuantityBoundaryDefectMustRemainVisible: true,
  },
  metadataTitleUntranslated: 'Raw Chinese title/printed-title identities remain unchanged in both native templates; all English prose/captions and reading title are English.',
  sourceFormulaTokens: 0, changedFormulas: 0, addedFormulas: 0,
  numericChangesDeclared: 0, changedScientificNumbers: 0,
  sourceTasks: 0, authoredTasks: 0, authoredChoices: 0, authoredAnswers: 0,
});
await save('source-closure.json', {
  schema: 'ld-s10y-lesson/bounded-source-closure@1',
  ticket: 'STEMROBIN-181', card, date: '2026-11-17',
  sourceApprovalReused: true, sourceApprovalNew: false,
  approvedPhysicalSpan: [120, 125], lessonPhysicalSpan: [120, 122],
  lessonPrintedSpan: [110, 112],
  targetSourceRefs: raw.prose.flatMap(item => item.source_refs),
  startProseRef: 'p0120#4',
  joinedContinuations: [
    ['p0120#6', 'p0121#1', 'p0121#4'],
    ['p0121#10', 'p0122#1'],
  ],
  finalObjectRef: 'p0122#2', nextHeadingExcluded: 'p0122#3',
  rawLesson: await bind(rawPath),
  rawExercises: await bind(owned(`zh/root/10p/lessons/${card}/exercises.json`)),
  rawSourceUnchanged: true, figureIds: raw.figures.map(item => item.id),
  figureOwnership: 'Figures 81/82 are text-reference placeholders, deferred to independent image authors and review.',
  sourceReviewBindings: inputs.inputs.filter(item => !item.original),
  imagesOpened: 0, prepareRerun: false, sourceFinalizeRerun: false, assembleRerun: false,
});
const historyBindings = [];
const captureHistory = async directory => {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    assert.ok(!entry.isSymbolicLink());
    if (entry.isDirectory()) await captureHistory(target);
    else historyBindings.push(await bind(target));
  }
};
await captureHistory(owned('history/initial'));
const freeze = {
  schema: 'ld-s10y-lesson/bounded-prose-author-freeze@1',
  ticket: 'STEMROBIN-181', card, date: '2026-11-17',
  status: check.status === 'pass' ? 'AUTHOR-FROZEN-AWAITING-INDEPENDENT-REVIEWS'
    : 'AUTHOR-FROZEN-NATIVE-TEXT-BLOCKED',
  ownedAbsoluteRoot: folder, frozen,
  inputFreeze: await bind(owned('input-freeze.json')),
  preparation: await bind(preparation),
  inputVerification: await bind(owned('input-verification.json')),
  source: await bind(rawPath),
  sourceClosure: await bind(owned('source-closure.json')),
  authorCoverage: await bind(owned('prose-coverage.json')),
  preservationCheck: await bind(owned('preservation-check.json')),
  nativeTextCheck: await bind(owned('text-check.json')),
  nativeTextCheckStatus: check.status, nativeTextStatus: check.native_text_status,
  nativeBlockers: check.errors,
  nativeStageStatuses: frozen.map(item => ({ language: item.language, stages: item.stageStatuses })),
  initialAttempt: { files: historyBindings },
  targetedRepairs: 0, laterAffectedAuthorRepairsAllowed: 1,
  repairDecision: 'No self-review repair or typography workaround. Retain every native failure; one affected author repair remains available only after independent review.',
  authorFiles: await Promise.all(['author.mjs', 'texts.json', 'normalize-text.py', 'check-text.py']
    .map(name => bind(owned(name)))),
  contractBindings, toolBindingsCurrent,
  contractBindingsRole: 'Exact inspected references; per-invocation tool hashes are retained in exclusive history receipts.',
  rawProseObjects: counts.rawObjects, proseObjects: counts.prose,
  figureObjects: counts.figures, captionObjects: counts.captions,
  sourceFormulaTokens: 0, sourceFormulaChanges: 0, addedFormulas: 0,
  changedScientificNumbers: 0, numericChangesDeclared: 0,
  sourceTasks: 0, authoredTasks: 0, authoredChoices: 0, authoredAnswers: 0,
  sourceApprovalReused: true, sourceApprovalNew: false,
  SCI: false, ZHEN: false, figureApproval: false, fullCardApproval: false,
  imagesOpened: 0, modernFiguresAuthored: 0, figuresArePlaceholders: true,
  fullFinalizeRun: false, renderRun: false, promotionPerformed: false,
  setupPerformed: false, freshnessRestart: false, grillRestart: false,
  gitCommands: false, databaseAccess: false, networkAccess: false,
  agentSpawned: false, appOrSharedToolsOrCharterEdits: false,
  otherChatMessaging: false, preparedTemplatesUnchanged: true,
  allGeneratedFilesExclusiveCreate: true,
  nextGates: [
    ...(check.status === 'pass' ? [] : ['Parent must resolve the recorded native text blockers; no false numeric_changes.']),
    'Independent SCI and ZHEN review of these exact hash-bound texts.',
    'Separate modern-figure authoring and independent image review; figures remain pending.',
    'Parent owns the one-time post-review finalization; author has not finalized or rendered.',
  ],
};
await save('history/initial/author-freeze.json', freeze);
await save('author-freeze.json', freeze);
console.log(JSON.stringify({
  freeze: await bind(owned('author-freeze.json')),
  nativeTextStatus: check.status,
  languages: frozen.map(item => ({
    language: item.language, nativeTextStatus: item.nativeTextStatus,
    validationStatus: item.validationStatus, paragraphs: item.paragraphs,
    sectionBreaks: item.sectionBreaks, invocations: item.nativeValidationInvocations,
  })),
  counts, blockers: check.errors, imagesOpened: 0,
  SCI: false, ZHEN: false, figureApproval: false, cardComplete: false,
}, null, 2));

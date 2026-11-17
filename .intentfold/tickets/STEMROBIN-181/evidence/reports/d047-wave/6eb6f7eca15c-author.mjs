import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const folder = path.dirname(import.meta.filename);
assert.equal(folder, path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d044-10p-n38-author'));
assert.equal(process.cwd(), repo);
const card = 'phy10-c1-s5-n38';
const relative = `adapt/10p/modern-us-neutral/lessons/${card}`;
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
const save = async (relativePath, value, replace = false) => {
  const target = owned(relativePath);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, `${JSON.stringify(value, null, 2)}\n`, { flag: replace ? 'w' : 'wx' });
};
const receipt = async (name, command, args, input) => {
  const startedAt = new Date().toISOString();
  const result = spawnSync(command, args, {
    cwd: repo, encoding: 'utf8', timeout: 180000, input,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  await save(`${name}.json`, {
    command, args, cwd: repo, startedAt, finishedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal,
    stdout: result.stdout, stderr: result.stderr, error: result.error?.message ?? null,
  });
  return result;
};
const assertBinding = async item => {
  assert.equal((await bind(path.resolve(repo, item.path))).sha256, item.sha256, item.path);
};
const verifyInputs = async () => {
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
await verifyInputs();
assert.equal(texts.length, 13);
const protectedBindings = [];
const captureProtected = async directory => {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    assert.ok(!entry.isSymbolicLink(), 'No symlink targets in this bounded author directory.');
    if (entry.isDirectory()) await captureProtected(target);
    else protectedBindings.push(await bind(target));
  }
};
for (const language of ['zh', 'en']) {
  await captureProtected(path.join(folder, language, 'root'));
  const templateDir = path.join(folder, language, 'work', relative);
  for (const name of ['exercises.template.json', 'figures.template.json']) {
    protectedBindings.push(await bind(path.join(templateDir, name)));
  }
}
const contractPaths = [
  '.claude/skills/ld-s10y-lesson/SKILL.md',
  '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md',
  '.claude/skills/ld-s10y-lesson/tools/edition.py',
  '.claude/skills/ld-s10y-lesson/tools/assemble.py',
  '.claude/skills/ld-s10y-lesson/tools/mathcheck.py',
  '.claude/skills/ld-s10y-lesson/tools/katex_check.js',
  '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs',
  '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js',
  '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json',
  '.intentfold/tickets/STEMROBIN-181/tmp/d039-10p-n35-author/author.mjs',
  '.intentfold/tickets/STEMROBIN-181/tmp/d039-10p-n35-author/validate-text.py',
  '.intentfold/tickets/STEMROBIN-181/tmp/d040-10p-n37-author/author.mjs',
];
const contractBindings = await Promise.all(contractPaths.map(file => bind(path.join(repo, file))));
await save('protected-input-bindings.json', protectedBindings);
const frozen = [];
for (const language of ['zh', 'en']) {
  const templateDir = path.join(folder, language, 'work', relative);
  const templatePath = path.join(templateDir, 'lesson.template.json');
  await fs.cp(templateDir, owned(`prepared/${language}`), {
    recursive: true, errorOnExist: true, force: false,
  });
  let lesson = JSON.parse(await fs.readFile(templatePath, 'utf8'));
  assert.equal(lesson.prose.length, texts.length);
  assert.deepEqual(lesson.source.data, JSON.parse(await fs.readFile(
    path.join(folder, language, 'root/10p/lessons', card, 'lesson.json'), 'utf8')));
  lesson.language = language;
  for (const [index, block] of lesson.prose.entries()) {
    const text = texts[index];
    assert.deepEqual(block.source_refs, text.source_refs);
    block.text = text[language];
    block.changes = block.text === block.source_text ? [] : [
      ...(language === 'en' ? ['translation'] : []),
      ...(block.kind === 'p' ? ['wording', 'layout'] : []),
      ...(text.subfigure_label_changes ? ['notation'] : []),
    ];
    block.numeric_changes = [];
    if (text.subfigure_label_changes) block.subfigure_label_changes = text.subfigure_label_changes;
  }
  const normalization = await receipt(`normalize-${language}`, python,
    ['-B', path.join(folder, 'normalize-text.py')], JSON.stringify(lesson));
  assert.equal(normalization.status, 0, normalization.stderr);
  lesson = JSON.parse(normalization.stdout).document;
  await save(`${language}/work/${relative}/lesson.template.json`, lesson, true);
  const candidates = await receipt(`prose-flow-${language}-candidates`, process.execPath,
    [flowTool, templatePath]);
  assert.equal(candidates.status, 0, candidates.stderr);
  const boundaryObjects = candidates.stdout.split('\n')
    .filter(line => line.trim().startsWith('break: '))
    .map(line => JSON.parse(line.trim().slice('break: '.length)));
  // Copy tool-emitted boundary objects by source-bound concept text, never by an index.
  lesson.section_breaks = ['p0108#1', 'p0108#4', 'p0108#7'].map(ref => {
    const block = lesson.prose.find(item => item.source_refs.includes(ref));
    const matches = boundaryObjects.filter(boundary =>
      boundary.after.startsWith(block.text.split('\n')[0]));
    assert.equal(matches.length, 1);
    return matches[0];
  });
  await save(`${language}/work/${relative}/lesson.template.json`, lesson, true);
  const flowResult = await receipt(`prose-flow-${language}`, process.execPath,
    [flowTool, '--json', templatePath]);
  assert.equal(flowResult.status, 0, flowResult.stderr);
  const flow = JSON.parse(flowResult.stdout);
  assert.equal(flow.boundaries.length, 3);
  await save(`prose-flow-${language}.data.json`, flow);
  await save(`prose-current-${language}.json`, {
    language, card, prose: lesson.prose, section_breaks: lesson.section_breaks,
  });
  const readingPath = owned(`lesson-${language}.md`);
  await fs.writeFile(readingPath, [
    `# ${language === 'zh' ? '机械波的传播' : 'Propagation of Mechanical Waves'}`, '',
    ...lesson.prose.filter(item => item.kind !== 'fig').flatMap(item => [item.text, '']),
  ].join('\n'), { flag: 'wx' });
  const attempt = owned(`attempts/initial/${language}`);
  await fs.cp(templateDir, attempt, { recursive: true, errorOnExist: true, force: false });
  frozen.push({
    language,
    template: await bind(templatePath),
    exercisesTemplate: await bind(path.join(templateDir, 'exercises.template.json')),
    figuresTemplate: await bind(path.join(templateDir, 'figures.template.json')),
    currentProse: await bind(owned(`prose-current-${language}.json`)),
    readingText: await bind(readingPath),
    nativeNormalizationReceipt: await bind(owned(`normalize-${language}.json`)),
    nativeFlowReceipt: await bind(owned(`prose-flow-${language}.json`)),
    nativeFlow: await bind(owned(`prose-flow-${language}.data.json`)),
    boundaryCandidatesReceipt: await bind(owned(`prose-flow-${language}-candidates.json`)),
    paragraphs: flow.paragraphs.length,
    sectionBreaks: flow.boundaries.length,
  });
}
const checkResult = await receipt('attempts/initial/text-check-command', python,
  ['-B', path.join(folder, 'validate-text.py')]);
assert.ok(checkResult.status === 0 || checkResult.status === 1, checkResult.stderr);
const check = JSON.parse(checkResult.stdout);
await save('attempts/initial/text-check.json', check);
await save('text-check.json', check);
await verifyInputs();
for (const item of [...protectedBindings, ...contractBindings]) await assertBinding(item);
await save('preservation-check.json', {
  status: 'pass', protectedBindings, contractBindings,
  inputFreeze: await bind(owned('input-freeze.json')),
  imagesOpened: 0, imageBytesOnlyHashed: true, externalFilesWritten: false,
});
const rawPath = owned(`zh/root/10p/lessons/${card}/lesson.json`);
const raw = JSON.parse(await fs.readFile(rawPath, 'utf8'));
await save('prose-coverage.json', {
  schema: 'ld-s10y-lesson/bounded-author-prose-coverage@1',
  ticket: 'STEMROBIN-181', card,
  status: 'author-declaration-not-independent-SCI-or-ZHEN',
  claims: [
    { source_refs: ['p0107#5'], facts: ['local particle motion', 'transverse elastic-cord wave'] },
    { source_refs: ['p0107#6'], facts: ['mass and elasticity', 'cross-section elastic forces', 'net restoring force', 'inertial overshoot', 'maximum-displacement turning point'] },
    { source_refs: ['p0108#1'], facts: ['Figure 69', 'identical metal balls suspended on strings', 'springs much lighter than balls', 'mass/elasticity separation'], qualification: 'A discrete idealization captures the mechanism, not all real-cord details.' },
    { source_refs: ['p0108#4'], facts: ['leftmost ball', 'horizontal-plane displacement', 'spring deformation', 'second ball follows with delay'], qualification: 'Transverse displacement is perpendicular to the chain; small-amplitude model before appreciable loss or reflection.' },
    { source_refs: ['p0108#5'], facts: ['one unchanged $T$ token', 'hand/mechanical periodic drive', 'second/third ball phase delays', 'successive coupling', 'common driving frequency', 'transverse wave'], qualification: 'Forced-frequency statement is after the initial transient; outgoing-wave account precedes reflected waves. No universal all-pairs-distinct phase claim.' },
    { source_refs: ['p0108#6'], facts: ['Figure 70', 'six unchanged ordered overhead views', 'quarter-period intervals', 'positions and instantaneous velocity vectors'], labelMapping: texts.find(item => item.source_refs[0] === 'p0108#6').subfigure_label_changes },
    { source_refs: ['p0108#7', 'p0109#3'], facts: ['Figure 71a/b', 'heavy balls/light springs', 'suspension constrained along chain', 'one unchanged $T$ token', 'longitudinal drive', 'compressions/rarefactions', 'local oscillation'], labelMapping: texts.find(item => item.source_refs[0] === 'p0108#7').subfigure_label_changes },
  ],
  historicalEntities: [],
  historicalPolicy: 'No source-bound historical entities occur in this lesson; none were invented or converted to unsourced present-day claims.',
  metadataTitleUntranslated: 'Raw lesson identity, including Chinese title and section, is preserved in both templates. All English prose/captions are authored in English.',
  sourceFormulaTokens: 2, changedFormulas: 0, addedFormulas: 0,
  numericChangesDeclared: 0, changedScientificNumbers: 0,
  sourceTasks: 0, authoredTasks: 0, authoredChoices: 0, authoredAnswers: 0,
});
await save('source-closure.json', {
  schema: 'ld-s10y-lesson/bounded-source-closure@1',
  ticket: 'STEMROBIN-181', card, date: '2026-11-17',
  sourceApprovalReused: true, sourceApprovalNew: false,
  approvedPhysicalSpan: [104, 115], lessonPhysicalSpan: [107, 110],
  targetSourceRefs: raw.prose.flatMap(item => item.source_refs),
  startProseRef: 'p0107#5', joinedContinuation: ['p0108#7', 'p0109#3'],
  finalObjectRef: 'p0110#2', nextHeadingExcluded: 'p0110#3',
  rawLesson: await bind(rawPath),
  rawExercises: await bind(owned(`zh/root/10p/lessons/${card}/exercises.json`)),
  rawSourceUnchanged: true,
  figureIds: raw.figures.map(item => item.id),
  figureOwnership: 'Only the prepared n38 references are preserved; no exclusive ownership of shared Figures 70/71 is inferred.',
  sourceReviewBindings: inputs.inputs.filter(item => !item.original),
  imagesOpened: 0, prepareRerun: false, sourceFinalizeRerun: false, assembleRerun: false,
});
await save('author-freeze.json', {
  schema: 'ld-s10y-lesson/bounded-prose-author-freeze@1',
  ticket: 'STEMROBIN-181', card, date: '2026-11-17',
  status: check.status === 'pass' ? 'AUTHOR-FROZEN-AWAITING-INDEPENDENT-REVIEWS'
    : 'AUTHOR-FROZEN-NATIVE-TEXT-BLOCKED',
  ownedAbsoluteRoot: folder, frozen,
  inputFreeze: await bind(owned('input-freeze.json')),
  source: await bind(rawPath),
  sourceClosure: await bind(owned('source-closure.json')),
  authorCoverage: await bind(owned('prose-coverage.json')),
  preservationCheck: await bind(owned('preservation-check.json')),
  nativeTextCheck: await bind(owned('text-check.json')),
  nativeTextCheckStatus: check.status,
  nativeTextStatus: check.native_text_status,
  nativeBlockers: check.errors,
  initialAttempt: {
    commandReceipt: await bind(owned('attempts/initial/text-check-command.json')),
    check: await bind(owned('attempts/initial/text-check.json')),
    templates: await Promise.all(['zh', 'en'].flatMap(language =>
      ['lesson.template.json', 'exercises.template.json', 'figures.template.json']
        .map(name => bind(owned(`attempts/initial/${language}/${name}`))))),
  },
  targetedRepairs: 0,
  repairDecision: 'No text workaround for a shared native number-signature defect. Native FAIL is retained without filtering or false numeric_changes.',
  authorFiles: await Promise.all(['author.mjs', 'texts.json', 'normalize-text.py', 'validate-text.py']
    .map(name => bind(owned(name)))),
  contractBindings,
  rawProseObjects: 13, proseObjects: 7, figureObjects: 3, captionObjects: 3,
  sourceFormulaTokens: 2, sourceFormulaChanges: 0, addedFormulas: 0,
  changedScientificNumbers: 0, numericChangesDeclared: 0,
  sourceTasks: 0, authoredTasks: 0, authoredChoices: 0, authoredAnswers: 0,
  sourceApprovalReused: true, sourceApprovalNew: false,
  SCI: false, ZHEN: false, figureApproval: false, fullCardApproval: false,
  imagesOpened: 0, modernFiguresAuthored: 0, figuresArePlaceholders: true,
  fullFinalizeRun: false, renderRun: false, promotionPerformed: false,
  setupPerformed: false, gitCommands: false, databaseAccess: false,
  appOrSharedToolsOrCharterEdits: false, otherChatMessaging: false,
  nextGates: [
    'Resolve the native multilingual figure-number tokenization blocker in the separately owned pipeline.',
    'Independent SCI and ZHEN review of these exact hash-bound texts.',
    'Separate modern-figure authoring/review; figures here remain placeholders.',
  ],
});
console.log(JSON.stringify({
  freeze: await bind(owned('author-freeze.json')),
  nativeTextStatus: check.status,
  nativeErrors: check.errors,
  counts: { rawObjects: 13, prose: 7, figures: 3, captions: 3, tasks: 0 },
  paragraphs: frozen.map(item => ({ language: item.language, count: item.paragraphs })),
  imagesOpened: 0, SCI: false, targetedRepairs: 0,
}, null, 2));

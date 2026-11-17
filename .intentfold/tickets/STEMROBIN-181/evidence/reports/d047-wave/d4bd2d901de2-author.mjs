import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const folder = path.dirname(import.meta.filename);
assert.equal(folder, path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d044-10p-n40-author'));
assert.equal(process.cwd(), repo);
const card = 'phy10-c1-s5-n40';
const relative = `work/adapt/10p/modern-us-neutral/lessons/${card}`;
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
const flowTool = path.join(repo, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs');
const require = createRequire(import.meta.url);
const { proseFlow } = require(path.join(repo, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'));
const texts = JSON.parse(await fs.readFile(path.join(folder, 'texts.json'), 'utf8'));
assert.equal(texts.length, 22);
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
const receipt = async (name, command, args, expectedCodes = [0]) => {
  const result = spawnSync(command, args, {
    cwd: repo, encoding: 'utf8', timeout: 180000,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  await save(`${name}.json`, {
    command, args, exitCode: result.status, signal: result.signal,
    stdout: result.stdout, stderr: result.stderr, error: result.error?.message ?? null,
  });
  assert.ok(expectedCodes.includes(result.status), result.stderr || result.stdout);
  return JSON.parse(result.stdout);
};
const inputs = JSON.parse(await fs.readFile(owned('input-freeze.json'), 'utf8'));
const inputBindings = inputs.inputs.flatMap(item =>
  item.original ? [item.original, item.snapshot] : [item]);
const imageBindingsReused = inputBindings.filter(item => /\.(png|svg)$/.test(item.path));
const textInputBindings = inputBindings.filter(item => !/\.(png|svg)$/.test(item.path));
for (const item of textInputBindings) {
  assert.equal((await bind(path.resolve(repo, item.path))).sha256, item.sha256);
}
const preserved = [];
for (const language of ['zh', 'en']) {
  const collectText = async directory => {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      assert.ok(!entry.isSymbolicLink(), 'No linked input or external write target.');
      if (entry.isDirectory()) await collectText(file);
      else if (/\.(json|md)$/.test(entry.name)) preserved.push(await bind(file));
    }
  };
  await collectText(owned(`${language}/root`));
  preserved.push(await bind(owned(`${language}/work/adapt/10p/modern-us-neutral/book.template.json`)));
}
const toolBindings = await Promise.all([
  '.claude/skills/ld-s10y-lesson/SKILL.md',
  '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md',
  '.claude/skills/ld-s10y-lesson/tools/edition.py',
  '.claude/skills/ld-s10y-lesson/tools/assemble.py',
  '.claude/skills/ld-s10y-lesson/tools/mathcheck.py',
  '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs',
  '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js',
  '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json',
  '.intentfold/tickets/STEMROBIN-181/tmp/d039-10p-n35-author/author.mjs',
  '.intentfold/tickets/STEMROBIN-181/tmp/d039-10p-n35-author/validate-text.py',
  '.intentfold/tickets/STEMROBIN-181/tmp/d040-10p-n37-author/author.mjs',
  '.intentfold/tickets/STEMROBIN-181/tmp/d040-10p-n37-author/validate-text.py',
].map(file => bind(path.join(repo, file))));
await save('preservation-before.json', {
  sourceAndIndexTextFiles: preserved, toolAndContractBindings: toolBindings,
  frozenTextInputs: textInputBindings, imageBindingsReusedWithoutOpening: imageBindingsReused,
});
const frozen = [];
for (const language of ['zh', 'en']) {
  const templatePath = owned(`${language}/${relative}/lesson.template.json`);
  const figuresPath = owned(`${language}/${relative}/figures.template.json`);
  const exercisesPath = owned(`${language}/${relative}/exercises.template.json`);
  const prepared = {};
  for (const name of ['lesson', 'figures', 'exercises']) {
    const file = owned(`${language}/${relative}/${name}.template.json`);
    const document = JSON.parse(await fs.readFile(file, 'utf8'));
    prepared[name] = document;
    await save(`prepared/${language}/${name}.template.json`, document);
  }
  // The prepared n40 already exhibits semicolon splitting; retain the native observation.
  await receipt(`prepared-normalization-${language}`, python, [
    '-B', owned('validate-text.py'), '--normalize',
    owned(`prepared/${language}/lesson.template.json`),
  ]);
  const lesson = prepared.lesson;
  const exercisesBefore = await bind(exercisesPath);
  const raw = JSON.parse(await fs.readFile(owned(`${language}/root/10p/lessons/${card}/lesson.json`), 'utf8'));
  assert.deepEqual(lesson.source.data, raw);
  lesson.language = language;
  lesson.section_breaks = [];
  for (const [index, block] of lesson.prose.entries()) {
    assert.deepEqual(block.source_refs, texts[index].source_refs);
    block.text = texts[index][language];
    block.changes = block.text === block.source_text ? [] : [
      ...(language === 'en' ? ['translation'] : []), 'wording', 'modernized', 'layout',
    ];
    block.numeric_changes = [];
    if (index === 3) {
      block.figures = [{ id: 'fig-64', label: language === 'en' ? 'Figure 64' : '\u56fe 64' }];
    }
  }
  await save(`${language}/${relative}/lesson.template.json`, lesson, true);
  const normalized = await receipt(`native-normalization-${language}`, python, [
    '-B', owned('validate-text.py'), '--normalize', templatePath,
  ]);
  await save(`${language}/${relative}/lesson.template.json`, normalized.document, true);
  const initialFlow = await receipt(`prose-flow-${language}-initial`, process.execPath, [
    flowTool, '--json', templatePath,
  ]);
  const finalLesson = normalized.document;
  finalLesson.section_breaks = [3, 5, 10, 15, 17, 20, 21].map(blockIndex => {
    const paragraph = initialFlow.paragraphs.find(item => item.blockIndex === blockIndex);
    assert.ok(paragraph && paragraph.index > 0);
    return {
      before: initialFlow.paragraphs[paragraph.index - 1].text,
      after: paragraph.text,
    };
  });
  await save(`${language}/${relative}/lesson.template.json`, finalLesson, true);
  const flow = await receipt(`prose-flow-${language}`, process.execPath, [
    flowTool, '--json', templatePath,
  ]);
  assert.equal(flow.resolvedBreaks.length, 7);
  const nativeFlow = proseFlow(finalLesson.prose, finalLesson.section_breaks);
  assert.equal(nativeFlow.filter(item => item.kind === 'fig' && item.id === 'fig-64').length, 1);
  const sharedIndex = nativeFlow.findIndex(item => item.kind === 'fig' && item.id === 'fig-64');
  const lastSharedParagraph = initialFlow.paragraphs.filter(item => item.blockIndex === 3).at(-1);
  assert.equal(nativeFlow[sharedIndex - 1].text, lastSharedParagraph.text);
  await save(`native-prose-flow-${language}.json`, {
    native_api: 'htmlfrag.js.proseFlow',
    flow: nativeFlow,
    sharedFigure64Occurrences: 1,
    sharedFigure64AfterFinalReferencingParagraph: true,
  });
  const manifest = prepared.figures;
  assert.deepEqual(manifest.figures.map(item => item.id), ['fig-73', 'fig-74', 'fig-75']);
  const source = {};
  for (const extension of ['png', 'svg']) {
    const sourcePath = `figures/fig-64.${extension}`;
    const entry = inputs.inputs.find(item =>
      item.original?.path.endsWith(`/10p/${sourcePath}`));
    assert.ok(entry && entry.original.sha256 === entry.snapshot.sha256);
    source[extension] = { path: sourcePath, sha256: entry.original.sha256 };
  }
  manifest.figures.push({
    id: 'fig-64', label: '\u56fe 64', spec: 'figures/fig-64.spec.json',
    changes: ['modernized'], source,
  });
  await save(`${language}/${relative}/figures.template.json`, manifest, true);
  assert.deepEqual(manifest.figures.slice(0, 3), JSON.parse(
    await fs.readFile(owned(`prepared/${language}/figures.template.json`), 'utf8')).figures);
  assert.equal((await bind(exercisesPath)).sha256, exercisesBefore.sha256);
  await fs.writeFile(owned(`lesson-${language}.md`), [
    `# ${language === 'zh' ? '\u4ecb\u8d28\u4e2d\u7684\u6ce2' : 'Waves in Media'}`, '',
    ...finalLesson.prose.filter(item => item.kind === 'p' || item.kind === 'cap')
      .flatMap(item => [item.text, '']),
  ].join('\n'), { flag: 'wx' });
  frozen.push({
    language, rawLesson: await bind(owned(`${language}/root/10p/lessons/${card}/lesson.json`)),
    rawReadingText: await bind(owned(`${language}/root/10p/lessons/${card}/lesson.md`)),
    template: await bind(templatePath), figuresTemplate: await bind(figuresPath),
    exercisesTemplate: exercisesBefore, readingText: await bind(owned(`lesson-${language}.md`)),
    normalizationReceipt: await bind(owned(`native-normalization-${language}.json`)),
    proseFlowReceipt: await bind(owned(`prose-flow-${language}.json`)),
    nativeProseFlowReceipt: await bind(owned(`native-prose-flow-${language}.json`)),
  });
}
const check = await receipt('text-check-command-initial', python,
  ['-B', owned('validate-text.py')], [0, 1]);
await save('text-check-initial.json', check);
await save('text-check.json', check);
// No numeric-signature bypass, source rewrite, or further author repair is performed.
for (const item of [...preserved, ...toolBindings]) {
  assert.equal((await bind(item.path)).sha256, item.sha256);
}
for (const item of textInputBindings) {
  assert.equal((await bind(path.resolve(repo, item.path))).sha256, item.sha256);
}
await save('preservation-after.json', {
  status: 'pass', textInputCount: textInputBindings.length,
  unchangedSourceAndIndexTextFiles: preserved, unchangedToolsAndContracts: toolBindings,
  imageContentsRead: false, imageBindingsReusedWithoutOpening: imageBindingsReused,
});
await save('prose-coverage.json', {
  schema: 'ld-s10y-lesson/bounded-author-prose-coverage@1',
  ticket: 'STEMROBIN-181', card,
  status: 'author-declaration-not-independent-SCI-or-ZHEN',
  claims: [
    { source_refs: texts[0].source_refs, facts: ['cord/string/rod axial propagation'], caveats: ['one-dimensional approximation', 'either direction along the axis'] },
    { source_refs: texts[1].source_refs, facts: ['gas/liquid/solid continuous media', 'local interactions spread disturbances'], caveats: ['directions depend on source and medium'] },
    { source_refs: texts[3].source_refs, facts: ['expanding region', 'explicit figure64 reference', 'energy flux over one second', 'amplitude-squared energy', 'section11 and spring/pendulum/medium oscillations'], caveats: ['water surface is not liquid-bulk spherical propagation', 'steady uniform spreading without added energy', 'same medium/frequency and small oscillations'] },
    { source_refs: texts[4].source_refs, facts: ['amplitude decrease without mechanical-to-internal-energy conversion'], caveats: ['geometric spreading is distinct from absorption'] },
    { source_refs: texts[5].source_refs, facts: ['normally driven plate', 'equal amplitude/phase', 'wavefront definition', 'figure73'], caveats: ['uniform isotropic model', 'uniform driving', 'finite-plate edge diffraction'] },
    { source_refs: texts[8].source_refs, facts: ['normal rays', 'parallel plane-wave rays', 'energy along rays'], caveats: ['uniform isotropic ray model'] },
    { source_refs: texts[9].source_refs, facts: ['plane-wave fixed cross section', 'no geometric spreading', 'dissipation'], caveats: ['ideal lossless constant amplitude', 'finite beams can spread'] },
    { source_refs: texts[10].source_refs, facts: ['rod-driven surface line waves', 'equal phase parallel to rod', 'figure74'], caveats: ['away from ends', 'surface analogy does not imply liquid-bulk shear waves'] },
    { source_refs: texts[15].source_refs, facts: ['pulsating sphere', 'spherical wavefronts', 'radial rays', 'figure75'], caveats: ['uniform isotropic medium and driving'] },
    { source_refs: texts[16].source_refs, facts: ['energy distributed over growing spheres', 'decreasing flux and amplitude'], caveats: ['steady uniform lossless spreading', 'fixed medium/frequency', 'no invented inverse-radius formula or numerical examples'] },
    { source_refs: texts[17].source_refs, facts: ['transverse displacement', 'shear deformation', 'relative layer shifts', 'solid restoring elasticity'], caveats: ['small pure shear has no first-order volume change'] },
    { source_refs: texts[18].source_refs, facts: ['fluid vs solid shear', 'footnote marker'], caveats: ['ordinary-fluid model and static shear stiffness', 'bulk elastic shear waves only'] },
    { source_refs: texts[19].source_refs, facts: ['independent explanatory footnote ①', 'liquid-surface transverse displacement'], caveats: ['mixed vertical/horizontal particle motion', 'gravity/surface tension rather than bulk shear elasticity'] },
    { source_refs: texts[20].source_refs, facts: ['longitudinal motion', 'section37', 'solid/liquid/gas restoring response'], caveats: ['fluid compression/rarefaction does not require sustained tensile stress'] },
    { source_refs: texts[21].source_refs, facts: ['P faster than S', 'same-earthquake arrivals', 'arrival delay gives distance'], caveats: ['usual isotropic rock model', 'appropriate speeds/path model', 'distance is not unique location'] },
  ],
  rawObjects: 22, proseObjects: 16, explanatoryFootnotes: 1, figureObjects: 3, captionObjects: 3,
  sourceFigures: [73, 74, 75], sharedProseFigures: [64],
  sourceFormulas: 0, addedFormulas: 0, sourceFormulaChanges: 0,
  sourceNumericChanges: 0, numericChangesDeclared: 0, tasks: 0,
});
await save('author-freeze.json', {
  schema: 'ld-s10y-lesson/bounded-prose-author-freeze@1',
  ticket: 'STEMROBIN-181', card, date: '2026-11-17',
  ownedAbsoluteRoot: folder,
  status: check.author_integrity_status === 'pass'
    ? 'TEXT-ONLY-AUTHOR-FROZEN-NATIVE-TEXT-BLOCKED'
    : 'TEXT-ONLY-AUTHOR-FROZEN-WITH-UNRESOLVED-AUTHOR-BLOCKERS',
  frozen, inputFreeze: await bind(owned('input-freeze.json')),
  textCheck: await bind(owned('text-check.json')),
  initialTextCheck: await bind(owned('text-check-initial.json')),
  authorIntegrityStatus: check.author_integrity_status,
  nativeTextStatus: check.native_text_status, nativeBlockers: check.native_text_errors,
  authorBlockers: check.author_errors,
  nativeTextLimitation: check.native_text_limitation,
  coverage: await bind(owned('prose-coverage.json')),
  preservation: await bind(owned('preservation-after.json')),
  authorFiles: await Promise.all(['author.mjs', 'texts.json', 'validate-text.py']
    .map(file => bind(owned(file)))),
  reusedPatterns: toolBindings.filter(item => /d039|d040/.test(item.path)),
  sourceReviewsReused: true, sourceReviewRerun: false,
  sourceClosure: {
    physicalPages: [112, 113, 114, 115], printedPages: [102, 103, 104, 105],
    firstProseRef: 'p0112#11', lastProseRef: 'p0115#2', excludedNextHeading: 'p0115#3',
    joinedRefs: [['p0112#14', 'p0113#1'], ['p0113#3', 'p0113#6'], ['p0113#9', 'p0114#1']],
    footnoteRef: 'p0114#10', footnoteLabel: 'footnote',
    externalSourceReviews: inputs.inputs.filter(item => item.path),
    neighboringRawObjectsPreserved: true, exclusiveFigureOwnershipInferred: false,
  },
  rawObjects: 22, proseObjects: 16, explanatoryFootnotes: 1,
  figureObjects: 3, captionObjects: 3, sharedProseFigures: 1,
  manifestFigures: 4, placeholderFigureIds: ['fig-73', 'fig-74', 'fig-75', 'fig-64'],
  sectionBreaksPerLanguage: 7, modernFiguresAuthored: 0, tasks: 0,
  addedTasks: 0, addedChoices: 0, answersAuthored: 0,
  sourceFormulas: 0, addedFormulas: 0, sourceFormulaChanges: 0,
  sourceNumericChanges: 0, numericChangesDeclared: 0,
  initialCheckRuns: 1, targetedRepairRuns: 0,
  preparedSemicolonObservation: await Promise.all(['zh', 'en'].map(language =>
    bind(owned(`prepared-normalization-${language}.json`)))),
  scientificApproval: false, bilingualApproval: false, fullCardApproval: false,
  imagesOpened: 0, imageContentsRead: false, artAuthored: false,
  adaptFinalizeRun: false, renderRun: false, promotionPerformed: false,
  nativePrepareRerun: false, nativeSourceFinalizeRerun: false,
  scope: {
    gitCommands: false, databaseAccess: false, appToolsCharterEdits: false,
    ticketBackendWrites: false, externalMessages: false, sharedWrites: false,
  },
  nextGates: [
    'Independent SCI and ZHEN against these exact bilingual text hashes',
    'Resolve native multilingual reference-number tokenization outside this bounded text author task',
    'Modern figure authorship and independent figure gates for 73/74/75 and shared64',
    'Full adapt-finalize/render only in a separately authorized downstream phase',
  ],
});
console.log(JSON.stringify({
  freeze: await bind(owned('author-freeze.json')),
  authorIntegrity: check.author_integrity_status, nativeText: check.native_text_status,
  nativeBlockers: check.native_text_errors, authorBlockers: check.author_errors,
  counts: { rawObjects: 22, prose: 16, footnotes: 1, figures: 3, captions: 3, sharedFigures: 1, tasks: 0 },
  repairs: 0, imagesOpened: 0, adaptFinalizeRun: false, renderRun: false,
}, null, 2));

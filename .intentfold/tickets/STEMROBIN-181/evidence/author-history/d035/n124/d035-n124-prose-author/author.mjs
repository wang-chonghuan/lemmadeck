import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const cwd = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
assert.equal(process.cwd(), cwd);
const ticket = `${cwd}/.intentfold/tickets/STEMROBIN-181`;
const folder = `${ticket}/tmp/d035-n124-prose-author`;
const root = `${folder}/root`;
const work = `${folder}/work`;
const book = `${root}/9p`;
const card = 'phy9-c2-s6-n124';
const native = `${ticket}/tmp/d035-source304-305-307-native`;
const toolRoot = `${cwd}/.claude/skills/ld-s10y-lesson/tools`;
const python = `${cwd}/.claude/skills/ld-s10y-lesson/.venv/bin/python`;
const toc = `${cwd}/ssot-resources/soviet10year-textbooks/toc/9p/zh.json`;
const templates = `${work}/adapt/9p/modern-us-neutral/lessons/${card}`;
const template = name => `${templates}/${name}.template.json`;
const englishPath = `${folder}/english/lesson.json`;
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const encode = value => `${JSON.stringify(value, null, 2)}\n`;
const read = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const bind = async file => ({ path: file, sha256: hash(await fs.readFile(file)) });
const exists = async file => fs.access(file).then(() => true, () => false);
async function write(file, bytes, replace = false) {
  assert.ok(path.resolve(file).startsWith(`${folder}/`), `Forbidden write: ${file}`);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, bytes, { flag: replace ? 'w' : 'wx' });
}
const json = (file, value, replace = false) => write(file, encode(value), replace);
async function retain(file, destination) {
  await write(destination, await fs.readFile(file));
  return { originalPath: file, ...await bind(destination) };
}
async function verify(binding) {
  assert.equal((await bind(path.resolve(cwd, binding.path))).sha256,
    binding.sha256, binding.path);
}
async function runOnce(name, executable, args, input, allowFailure = false) {
  const stem = `${folder}/commands/${name}`;
  assert.ok(!await exists(`${stem}.started.json`), `${name} already invoked`);
  if (input !== undefined) await json(`${stem}.stdin.json`, input);
  const tools = await Promise.all([
    'p2c.py', 'assemble.py', 'edition.py', 'blocks.py', 'normalize.py',
    'mathcheck.py', 'prose_flow.mjs', 'htmlfrag.js'
  ].map(name => bind(`${toolRoot}/${name}`)));
  await json(`${stem}.started.json`, { cwd, executable, args, invocations: 1, tools });
  const result = spawnSync(executable, args, {
    cwd, input: input === undefined ? undefined : encode(input), encoding: 'utf8',
    timeout: 180000, maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' }
  });
  await write(`${stem}.stdout.txt`, result.stdout ?? '');
  await write(`${stem}.stderr.txt`, result.stderr ?? '');
  for (const binding of tools) await verify(binding);
  await json(`${stem}.json`, {
    cwd, executable, args, invocations: 1, exitCode: result.status,
    signal: result.signal, error: result.error?.message ?? null,
    stdin: input === undefined ? null : await bind(`${stem}.stdin.json`),
    stdout: await bind(`${stem}.stdout.txt`), stderr: await bind(`${stem}.stderr.txt`),
    invokedToolBindings: tools, toolBytesStableDuringInvocation: true
  });
  console.log(`${name}: exit ${result.status}`);
  if (name === 'assemble' || name === 'adapt-prepare' || result.status !== 0) {
    console.log(`${result.stdout}${result.stderr}`);
  }
  if (!allowFailure) assert.equal(result.status, 0, name);
  return result;
}
const nativeArgs = action => [
  '-B', `${toolRoot}/p2c.py`, action, '--book', '9p', '--root', root, '--work', work
];
const [phase] = process.argv.slice(2);
if (phase === 'prepare') {
  assert.ok(!await exists(`${folder}/inputs/input-freeze.json`));
  const evidence = [
    { path: `${native}/pages-native.json`,
      sha256: '62a26cbd30de4e36014dc56b18056fa82c956125b91addca499f2aa1a702d868' },
    { path: `${ticket}/tmp/d035-source304-307-source-review.json`,
      sha256: '8c6ca25decb0a667b2537c99ab7ac4f1cfdce3a2613a3910270af2395b213efd' }
  ];
  for (const row of evidence) await verify(row);
  const supplied = await read(evidence[0].path);
  const page = supplied.pages.find(row => row.page === 307);
  const repairBinding = supplied.glyphRepair;
  await verify(repairBinding);
  const repair = await read(path.resolve(cwd, repairBinding.path));
  assert.equal(repair.soleDelta, '\\bar{B} -> \\vec{B} in p0307#10 row2; all other bytes unchanged');
  const crop = supplied.cropReviewTargets.find(row => row.id === 'fig-283');
  const immutable = [...evidence, repairBinding, ...page.outputs, crop.crop, crop.svg];
  for (const row of immutable) await verify(row);
  const snapshots = [];
  for (const row of [...evidence, repairBinding]) {
    snapshots.push(await retain(path.resolve(cwd, row.path),
      `${folder}/inputs/evidence/${path.basename(row.path)}`));
  }
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    snapshots.push(await retain(`${native}/root/9p/pages/0307/${name}`,
      `${book}/pages/0307/${name}`));
  }
  for (const suffix of ['png', 'svg']) {
    snapshots.push(await retain(`${native}/work/9p/pages/0307/figures/fig-283.${suffix}`,
      `${work}/9p/pages/0307/figures/fig-283.${suffix}`));
  }
  const contracts = [
    ...['p2c.py', 'assemble.py', 'edition.py', 'blocks.py', 'normalize.py',
      'mathcheck.py', 'prose_flow.mjs', 'htmlfrag.js'].map(name => `${toolRoot}/${name}`),
    `${cwd}/.claude/skills/ld-s10y-lesson/SKILL.md`,
    `${cwd}/.claude/skills/ld-s10y-lesson/references/edition-text-contract.md`,
    `${cwd}/.agents/skills/ld-s10y-image/SKILL.md`,
    `${cwd}/.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json`,
    `${cwd}/.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json`, toc,
    `${cwd}/ssot-resources/soviet10year-textbooks/sources/manifest.json`
  ];
  for (const [index, file] of contracts.entries()) {
    snapshots.push(await retain(file,
      `${folder}/inputs/contracts-and-tools/${index}-${path.basename(file)}`));
  }
  assert.ok((await fs.readFile(`${toolRoot}/assemble.py`, 'utf8'))
    .includes('identity_title = title[2:-2] if title.startswith("**") and title.endswith("**") else title'));
  await json(`${folder}/inputs/input-freeze.json`, {
    card, immutable, snapshots, isolatedRoot: root, isolatedWork: work,
    pagesCopied: [307], figuresCopied: ['fig-283'], fullPageImageCopied: false,
    provisionalRawCopyNotApproval: true, sourceReviewReplayed: false,
    sourceApproval: false, RAWApproval: false, page306Approval: false
  });
  const assembly = await runOnce('assemble', python, [
    '-B', `${folder}/native-entry.py`, 'assemble',
    '--book', '9p', '--root', root, '--work', work, '--toc', toc
  ], undefined, true);
  const source = await read(`${book}/lessons/${card}/lesson.json`);
  assert.equal(source.card_id, card);
  assert.equal(source.number, '124');
  assert.equal(source.title, '磁通量');
  assert.equal(source.printed_title, '**124. 磁通量**');
  assert.equal(source.prose.length, 7);
  assert.equal(source.prose.filter(row => row.kind === 'p').length, 5);
  assert.deepEqual(source.prose.map(row => row.source_refs), [
    ['p0307#3'], ['p0307#4', 'p0307#7'], ['p0307#5'], ['p0307#6'],
    ['p0307#8'], ['p0307#9'], ['p0307#10']
  ]);
  assert.equal(source.exercise_count, 0);
  assert.deepEqual(source.figures.map(row => row.id), ['fig-283']);
  const index = await read(`${book}/book.json`);
  await json(`${folder}/source-candidate.json`, {
    card, sourceRefs: source.prose.map(row => row.source_refs),
    assemblyExit: assembly.status, assemblyErrors: index.audit.errors,
    assemblyWarnings: index.audit.warnings, sourceApproval: false,
    lastTextRef: 'p0307#10', rightBoundaryRef: 'p0307#11',
    rightBoundaryHeading: '**125. 感生电流的方向　楞次定律**',
    incoming123AndOutgoing125ExcludedFrom124: true,
    incidentalUnownedAssemblyOutputsNotAuthoredOrApproved: true,
    nativeAncestorIdentity: { chapter: source.chapter, section: source.section },
    noAncestorHeadingFabricated: true, noPage306Input: true
  });
  for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) {
    snapshots.push(await retain(`${book}/lessons/${card}/${name}`,
      `${folder}/inputs/source/${name}`));
  }
  await runOnce('adapt-prepare', python, [...nativeArgs('adapt-prepare'),
    '--edition', 'modern-us-neutral', '--lesson', card]);
  const generated = [];
  for (const name of ['lesson', 'exercises', 'figures']) {
    generated.push(await retain(template(name), `${folder}/before/${name}.template.json`));
  }
  await json(`${folder}/preparation.json`, {
    card, snapshots, generated, sourceCandidate: await bind(`${folder}/source-candidate.json`),
    loadedAssembler: await bind(`${folder}/commands/assemble.loaded-modules.json`),
    sourceApproval: false, RAWApproval: false, fullCardApproval: false
  });
} else if (phase === 'author') {
  assert.ok(!await exists(`${folder}/authored.json`));
  const texts = await read(`${folder}/texts.json`);
  const lesson = await read(template('lesson'));
  const english = structuredClone(lesson);
  const replacements = new Map(texts.blocks.map(row => [row.source_refs.join('|'), row]));
  for (const [index, block] of lesson.prose.entries()) {
    if (block.kind === 'p') {
      const authored = replacements.get(block.source_refs.join('|'));
      assert.ok(authored);
      block.text = authored.zh;
      block.changes = authored.changes;
      block.historical_entities = authored.historical_entities ?? [];
      english.prose[index].text = authored.en;
      english.prose[index].changes = ['translation', 'wording', 'layout'];
      english.prose[index].historical_entities = [];
      if (authored.historical_translation) {
        english.prose[index].historical_translation = authored.historical_translation;
      }
    } else if (block.kind === 'cap') {
      english.prose[index].text = 'Figure 283';
      english.prose[index].changes = ['translation', 'layout'];
    }
  }
  english.language = 'en';
  english.translated_title = 'Magnetic Flux';
  english.translated_section = null;
  english.translation_status = 'full-source-bound-author-translation-pending-independent-ZHEN';
  await json(template('lesson'), lesson, true);
  await json(englishPath, english);
  await retain(template('lesson'), `${folder}/authored-before-normalization.lesson.json`);
  await retain(englishPath, `${folder}/authored-before-normalization.english.json`);
  await json(`${folder}/english/exercises.json`, {
    language: 'en', lesson: card, count: 0, exercises: [],
    source: (await read(template('exercises'))).source
  });
  await json(`${folder}/authored.json`, {
    lesson: await bind(template('lesson')), english: await bind(englishPath),
    text: await bind(`${folder}/texts.json`), sourceApproval: false, SCIApproval: false
  });
} else if (phase === 'normalize') {
  const result = await runOnce('normalize', python, ['-B', `${folder}/native-text.py`], {
    mode: 'normalize', documents: [await read(template('lesson')), await read(englishPath)]
  });
  const normalized = JSON.parse(result.stdout);
  await json(`${folder}/normalized-candidate.json`, normalized);
  await json(template('lesson'), normalized.documents[0], true);
  await json(englishPath, normalized.documents[1], true);
} else if (phase === 'flow') {
  const texts = await read(`${folder}/texts.json`);
  const reports = {};
  for (const [language, file] of [['zh', template('lesson')], ['en', englishPath]]) {
    await retain(file, `${folder}/flow-input.${language}.lesson.json`);
    const result = await runOnce(`prose-flow-${language}`, process.execPath,
      [`${toolRoot}/prose_flow.mjs`, file]);
    const paragraphs = [], boundaries = [];
    let current;
    for (const line of result.stdout.trimEnd().split('\n')) {
      const header = /^\[(\d+)\] (.*)$/.exec(line);
      if (header) {
        current = { index: Number(header[1]), text: header[2] };
        paragraphs.push(current);
      } else if (line.startsWith('    break: ')) {
        const boundary = JSON.parse(line.slice('    break: '.length));
        assert.equal(boundary.before, paragraphs.at(-2).text);
        assert.equal(boundary.after, current.text);
        boundaries.push(boundary);
      } else {
        assert.ok(current);
        current.text += `\n${line}`;
      }
    }
    const prefixes = language === 'zh' ? texts.concept_starts : texts.english_concept_starts;
    const selected = prefixes.map(prefix => {
      const matches = boundaries.filter(row => row.after.startsWith(prefix));
      assert.equal(matches.length, 1, prefix);
      return matches[0];
    });
    const document = await read(file);
    document.section_breaks = selected;
    await json(file, document, true);
    reports[language] = { paragraphs, allEmittedBoundaries: boundaries,
      selectedBoundaries: selected, origin: 'Exact native adjacent paragraph objects.' };
    console.log(result.stdout);
  }
  await json(`${folder}/native-flow.json`, reports);
} else if (phase === 'validate') {
  const result = await runOnce('validate-text', python, ['-B', `${folder}/native-text.py`], {
    mode: 'validate', book, lesson: await read(template('lesson')),
    exercises: await read(template('exercises')), english: await read(englishPath),
    profile: await read(`${cwd}/.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json`)
  }, true);
  if (result.stdout) await json(`${folder}/native-text-result.json`, JSON.parse(result.stdout));
  assert.equal(result.status, 0, 'Text validation failed; do not rerun blindly.');
} else if (phase === 'freeze') {
  const freezePath = `${folder}/9p-n124-prose-freeze.json`;
  assert.ok(!await exists(freezePath));
  const preparation = await read(`${folder}/preparation.json`);
  const input = await read(`${folder}/inputs/input-freeze.json`);
  for (const binding of input.immutable) await verify(binding);
  for (const row of preparation.snapshots) {
    await verify(row);
    await verify({ path: row.originalPath, sha256: row.sha256 });
  }
  const lesson = await read(template('lesson'));
  const english = await read(englishPath);
  const initial = await read(`${folder}/before/lesson.template.json`);
  assert.deepEqual(lesson.source, initial.source);
  assert.deepEqual(english.source, initial.source);
  for (const [index, block] of lesson.prose.entries()) {
    for (const field of ['kind', 'id', 'label', 'printed_page', 'source_refs',
      'source_text', 'numeric_changes']) {
      assert.deepEqual(block[field], initial.prose[index][field]);
      assert.deepEqual(english.prose[index][field], initial.prose[index][field]);
    }
  }
  for (const name of ['exercises', 'figures']) {
    assert.equal((await bind(template(name))).sha256,
      (await bind(`${folder}/before/${name}.template.json`)).sha256);
  }
  const frozenFiles = {};
  for (const name of ['lesson', 'exercises', 'figures']) {
    frozenFiles[`${name}Template`] = await retain(template(name),
      `${folder}/frozen/${name}.template.json`);
  }
  frozenFiles.englishLesson = await retain(englishPath, `${folder}/frozen/english.lesson.json`);
  frozenFiles.englishExercises = await retain(`${folder}/english/exercises.json`,
    `${folder}/frozen/english.exercises.json`);
  frozenFiles.texts = await retain(`${folder}/texts.json`, `${folder}/frozen/texts.json`);
  await json(`${folder}/translation-alignment.json`, {
    card, alignmentUnit: 'Complete source-bound object in native order.',
    objects: lesson.prose.map((block, index) => ({
      kind: block.kind, id: block.id, source_refs: block.source_refs,
      source_text_sha256: hash(block.source_text),
      chinese_text_sha256: hash(block.text), english_text_sha256: hash(english.prose[index].text),
      chineseText: block.text, englishText: english.prose[index].text
    })),
    historicalTranslation: english.prose[0].historical_translation,
    culturalAdaptations: [], paragraphCountsNeedNotMatch: true,
    sourceApproval: false, SCIApproval: false, ZHENApproval: false
  });
  const flow = await read(`${folder}/native-flow.json`);
  const checked = await read(`${folder}/native-text-result.json`);
  assert.deepEqual(checked.errors, []);
  assert.deepEqual(lesson.section_breaks, flow.zh.selectedBoundaries);
  assert.deepEqual(english.section_breaks, flow.en.selectedBoundaries);
  const counts = {
    sourceProseObjects: 7, sourceParagraphObjects: 5, sourceFigures: 1, sourceCaptions: 1,
    chineseNativeParagraphs: flow.zh.paragraphs.length,
    englishNativeParagraphs: flow.en.paragraphs.length,
    chineseSectionAnchors: lesson.section_breaks.length,
    englishSectionAnchors: english.section_breaks.length,
    sourceExercises: 0, chineseExercises: 0, englishExercises: 0,
    mathAtoms: checked.mathAtoms, sourceRefs: lesson.prose.map(row => row.source_refs),
    chineseBodyCharactersIncludingMath: lesson.prose.filter(row => row.kind === 'p')
      .reduce((sum, row) => sum + [...row.text].length, 0),
    englishBodyWordsIncludingMath: english.prose.filter(row => row.kind === 'p')
      .reduce((sum, row) => sum + row.text.trim().split(/\s+/).length, 0),
    nativeSourceRowsReused: [25, 25], newPageCountCommands: 0
  };
  await json(`${folder}/counts.json`, counts);
  const report = await bind(`${folder}/report.md`);
  const approval = {
    source: false, RAW: false, crop: false, SCI: false, ZHEN: false,
    modernFigure: false, fullCard: false, display: false, adaptFinalize: false,
    canonicalPromotion: false, publication: false
  };
  const commands = await Promise.all([
    'assemble', 'adapt-prepare', 'normalize', 'prose-flow-zh', 'prose-flow-en', 'validate-text'
  ].map(name => bind(`${folder}/commands/${name}.json`)));
  const bindings = {};
  for (const name of ['preparation.json', 'source-candidate.json', 'native-flow.json',
    'native-text-result.json', 'counts.json', 'translation-alignment.json',
    'inputs/input-freeze.json', 'commands/assemble.loaded-modules.json']) {
    bindings[name] = await bind(`${folder}/${name}`);
  }
  await json(freezePath, {
    schema: 'ld-s10y-lesson/bounded-prose-author-freeze@1',
    ticket: 'STEMROBIN-181', batch: 'D035', card, date: '2026-11-17',
    status: 'provisional-bilingual-prose-frozen-pending-independent-SCI-ZHEN-and-fig283',
    ownedRoot: folder, isolatedRoots: { root, work, frozen: `${folder}/frozen` },
    frozenFiles, bindings, commands, report, proseFacts: counts,
    sourceAndContractSnapshots: preparation.snapshots,
    originalNativeTemplates: preparation.generated,
    immutableOriginalBindings: input.immutable,
    helpers: await Promise.all(['author.mjs', 'native-entry.py', 'native-text.py', 'texts.json']
      .map(name => bind(`${folder}/${name}`))),
    reusedPatterns: await Promise.all([
      'd034-n119-prose-author/author.mjs', 'd034-n119-prose-author/native-text.py',
      'd032-n115-prose-author/author.mjs', 'd032-n115-prose-author/native-text.py'
    ].map(name => bind(`${ticket}/tmp/${name}`))),
    sourceConditionsAndNotation: {
      uniformMagneticField: true, planeClosedWireLoop: true, areaSymbol: 'S',
      alpha: 'Angle between vector B and the plane normal vector n, not the angle to the plane.',
      scalarVersusVector: 'B is the magnitude; vector B and vector n retain their arrow accents.',
      exactEquations: ['$\\Phi=BS\\cos\\alpha$', '$B\\cos\\alpha=B_n$', '$\\Phi=B_nS$'],
      equationTags: ['12-1', '12-2'],
      normalProjection: 'Source B_n retained, not a magnitude or an absolute value.',
      fieldLineCondition: 'Unit area perpendicular to vector B; field-line count convention equal to magnitude B.',
      orientationUncertainty: 'Source does not specify the choice of normal or a directed-count convention for obtuse alpha. Do not read its conditional field-line count as permission to replace signed projection by an absolute value.',
      glyphUncertainty: 'Historical bar-arrow author note remains in copied page metadata, but current literal text is vector B, exactly bound by affected-binding.json. No new SOURCE approval.',
      culturalAdaptations: [], historicalTranslation: english.prose[0].historical_translation,
      addedExamples: [], addedTasks: [], addedChoices: [], addedSolutions: [],
      sourceErrata: [], scientificApproval: false
    },
    figureManifestStatus: 'Byte-unchanged native draft for fig-283. Source PNG/SVG copies are provisional, no modern output or review file exists here.',
    boundary: { startHeading: 'p0307#2', lastText: 'p0307#10', lastOpen: false,
      nextHeadingExcluded: 'p0307#11', incoming123Excluded: 'p0307#1',
      outgoing125Excluded: 'p0307#12', page306NotImported: true },
    approval,
    execution: { nativeAssemble: 1, nativeAdaptPrepare: 1, nativeNormalize: 1,
      nativeProseFlowPerLanguage: 1, nativeTextCheck: 1, pageFinalize: 0,
      pageCounting: 0, vectorize: 0, adaptFinalize: 0, render: 0, figureRender: 0,
      imageOpens: 0, newChildren: 0, sourcePixelWrites: 0,
      canonicalWrites: 0, DB: 0, Plane: 0, Git: 0, fullTests: 0, build: 0,
      appWrites: 0, dependencyWrites: 0, IntentFoldRefresh: 0 },
    limits: 'Only this isolated directory is written. Native assembly diagnostics and historical review FAIL are retained as evidence, not waived or relabelled. Prose freeze is not payload or completed card.'
  });
  const frozen = await read(freezePath);
  for (const binding of [...Object.values(frozen.frozenFiles), ...Object.values(bindings),
    ...commands, ...frozen.helpers, report]) await verify(binding);
  await json(`${folder}/verification.json`, {
    freeze: await bind(freezePath), hashAndStructureOnly: true,
    immutableSourceSnapshotsPreserved: true, sourceRefsAndIdentityPreserved: true,
    exactMathTokensAndLiteralNumbersPreserved: true,
    figuresAndExercisesByteUnchanged: true, approval,
    noCommandReplayed: true, noPayloadCreated: true
  });
  console.log(encode({ freeze: await bind(freezePath), frozenFiles, counts, approval }));
} else {
  throw new Error('Expected prepare, author, normalize, flow, validate or freeze.');
}

import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const cwd = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
assert.equal(process.cwd(), cwd);
const folder = `${cwd}/.intentfold/tickets/STEMROBIN-181/tmp/d031-n114-prose-author`;
const freezePath = `${cwd}/.intentfold/tickets/STEMROBIN-181/tmp/9p-n114-prose-freeze.json`;
const candidate = `${cwd}/.intentfold/tickets/STEMROBIN-181/tmp/d030-n114-source-candidate`;
const sourceRoot = `${candidate}/artifacts`;
const book = `${sourceRoot}/9p`;
const card = 'phy9-c2-s5-n114';
const work = `${folder}/work`;
const templates = `${work}/adapt/9p/modern-us-neutral/lessons/${card}`;
const python = `${cwd}/.claude/skills/ld-s10y-lesson/.venv/bin/python`;
const toolRoot = `${cwd}/.claude/skills/ld-s10y-lesson/tools`;
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const encode = value => `${JSON.stringify(value, null, 2)}\n`;
const read = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const exists = async file => fs.access(file).then(() => true, () => false);
const bind = async file => ({ path: file, sha256: hash(await fs.readFile(file)) });
const writable = file => assert.ok(
  path.resolve(file).startsWith(`${folder}/`) || path.resolve(file) === freezePath,
  `Forbidden write: ${file}`
);
async function write(file, bytes, replace = false) {
  writable(file);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, bytes, { flag: replace ? 'w' : 'wx' });
}
async function json(file, value, replace = false) {
  await write(file, encode(value), replace);
}
async function retain(file, destination) {
  await write(destination, await fs.readFile(file));
  return { originalPath: file, ...await bind(destination) };
}
async function verify(binding) {
  assert.equal((await bind(binding.path)).sha256, binding.sha256, binding.path);
}
async function runOnce(name, executable, args, input) {
  const stem = `${folder}/commands/${name}`;
  assert.ok(!await exists(`${stem}.started.json`), `${name} already invoked`);
  const stdin = input === undefined ? null : `${stem}.stdin.json`;
  if (stdin) await write(stdin, encode(input));
  await json(`${stem}.started.json`, {
    cwd, executable, args, stdin: stdin ? await bind(stdin) : null, invocations: 1
  });
  const result = spawnSync(executable, args, {
    cwd, input: input === undefined ? undefined : encode(input), encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' }
  });
  await write(`${stem}.stdout.txt`, result.stdout ?? '');
  await write(`${stem}.stderr.txt`, result.stderr ?? '');
  await json(`${stem}.json`, {
    cwd, executable, args, invocations: 1, exitCode: result.status,
    stdin: stdin ? await bind(stdin) : null,
    stdout: await bind(`${stem}.stdout.txt`), stderr: await bind(`${stem}.stderr.txt`),
    error: result.error?.message ?? null
  });
  assert.equal(result.status, 0, `${name}: ${result.stderr || result.error?.message}`);
  return result.stdout;
}
const names = ['lesson', 'exercises', 'figures'];
const template = name => `${templates}/${name}.template.json`;
const englishPath = `${folder}/english/lesson.json`;
const texts = await read(`${folder}/texts.json`);
const [phase] = process.argv.slice(2);

if (phase === 'prepare') {
  assert.ok(!await exists(`${folder}/preparation.json`));
  const resultBinding = await bind(`${candidate}/result.json`);
  assert.equal(resultBinding.sha256,
    '1cf738fc840c8f2f755c37647b16161671b343c9eeb1dedad43281a2df058180');
  const result = await read(resultBinding.path);
  assert.equal(result.card, card);
  assert.equal(result.status, 'source-closed-native-and-crops-approved');
  for (const output of result.outputs) await verify({
    path: path.resolve(cwd, output.path), sha256: output.sha256
  });
  const snapshots = [];
  for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) {
    snapshots.push(await retain(`${book}/lessons/${card}/${name}`,
      `${folder}/inputs/source/${name}`));
  }
  for (const page of ['0280', '0281']) {
    for (const name of ['page.json', 'page.md', 'audit.json']) {
      snapshots.push(await retain(`${book}/pages/${page}/${name}`,
        `${folder}/inputs/pages/${page}/${name}`));
    }
  }
  for (const name of ['result.json', 'command.json']) {
    snapshots.push(await retain(`${candidate}/${name}`, `${folder}/inputs/candidate/${name}`));
  }
  snapshots.push(await retain(`${book}/book.json`, `${folder}/inputs/source/book.json`));
  const toolFiles = [
    `${toolRoot}/p2c.py`, `${toolRoot}/edition.py`, `${toolRoot}/normalize.py`,
    `${toolRoot}/assemble.py`, `${toolRoot}/blocks.py`,
    `${toolRoot}/prose_flow.mjs`, `${toolRoot}/htmlfrag.js`,
    `${cwd}/.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json`,
    `${cwd}/.claude/skills/ld-s10y-lesson/SKILL.md`,
    `${cwd}/.claude/skills/ld-s10y-lesson/references/edition-text-contract.md`,
    '/Users/yong/.agents/skills/ips-content-design/SKILL.md',
    '/Users/yong/.agents/skills/ips-content-design/references/copy.md',
    `${cwd}/.intentfold/readme.md`, `${cwd}/.intentfold/charter/engineering.md`,
    `${cwd}/.intentfold/charter/product.md`
  ];
  for (const [index, file] of toolFiles.entries()) {
    snapshots.push(await retain(file,
      `${folder}/inputs/contracts-and-tools/${index}-${path.basename(file)}`));
  }
  const source = await read(`${book}/lessons/${card}/lesson.json`);
  assert.equal(source.exercise_count, 0);
  assert.equal(source.prose.filter(block => block.kind === 'p').length, texts.blocks.length);
  await runOnce('adapt-prepare', python, [
    '-B', `${toolRoot}/p2c.py`, 'adapt-prepare',
    '--book', '9p', '--edition', 'modern-us-neutral', '--lesson', card,
    '--root', sourceRoot, '--work', work
  ]);
  const generated = [];
  for (const name of names) {
    generated.push(await retain(template(name), `${folder}/before/${name}.template.json`));
  }
  generated.push(await retain(`${work}/adapt/9p/modern-us-neutral/book.template.json`,
    `${folder}/before/book.template.json`));
  for (const snapshot of snapshots) await verify({
    path: snapshot.originalPath, sha256: snapshot.sha256
  });
  await json(`${folder}/preparation.json`, {
    card, sourceCandidate: resultBinding, snapshots, generated,
    nativePrepare: await bind(`${folder}/commands/adapt-prepare.json`),
    sourceRoot, workRoot: work, invocations: 1,
    imageReads: 0,
    note: 'Inherited closed source and crop evidence; only source text read. Native figure manifest is an author placeholder, not review approval.'
  });
  console.log(encode({ preparation: await bind(`${folder}/preparation.json`),
    templates: await Promise.all(names.map(name => bind(template(name)))) }));
} else if (phase === 'author') {
  assert.ok(!await exists(`${folder}/authored.json`));
  const lesson = await read(template('lesson'));
  const english = structuredClone(lesson);
  const replacements = new Map(texts.blocks.map(block => [block.source_refs.join('|'), block]));
  for (const [index, block] of lesson.prose.entries()) {
    if (block.kind === 'p') {
      const authored = replacements.get(block.source_refs.join('|'));
      assert.ok(authored);
      block.text = authored.zh;
      block.changes = authored.changes;
      english.prose[index].text = authored.en;
      english.prose[index].changes = ['translation', 'context', 'layout'];
    } else if (block.kind === 'cap') {
      english.prose[index].text = block.text.replace(/^图 /, 'Figure ');
      english.prose[index].changes = ['translation'];
    }
  }
  lesson.section_breaks = [];
  english.section_breaks = [];
  english.language = 'en';
  english.translated_title = 'Magnetic Interaction';
  english.translated_section = 'Chapter Eleven: The Magnetic Field of Electric Current';
  english.translation_status = 'complete-aligned-author-translation-not-finalized';
  await json(template('lesson'), lesson, true);
  await json(englishPath, english);
  await retain(template('lesson'), `${folder}/authored-before-normalization.lesson.json`);
  await retain(englishPath, `${folder}/authored-before-normalization.english.json`);
  await json(`${folder}/english/exercises.json`, {
    language: 'en', lesson: card, count: 0, exercises: [],
    source: (await read(template('exercises'))).source
  });
  await json(`${folder}/authored.json`, {
    chinese: await bind(template('lesson')), english: await bind(englishPath),
    planAndText: await bind(`${folder}/texts.json`),
    changes: texts.blocks.map(({ source_refs, changes, reason }) => ({
      source_refs, changes, reason
    })),
    figuresManifestUntouched: await bind(template('figures')),
    exercisesUntouched: await bind(template('exercises'))
  });
  console.log(encode(await read(`${folder}/authored.json`)));
} else if (phase === 'normalize') {
  assert.ok(!await exists(`${folder}/normalization.json`));
  const documents = [await read(template('lesson')), await read(englishPath)];
  const output = JSON.parse(await runOnce('normalize', python,
    ['-B', `${folder}/native-text.py`], { mode: 'normalize', documents }));
  await json(`${folder}/normalized-candidate.json`, output);
  await json(template('lesson'), output.documents[0], true);
  await json(englishPath, output.documents[1], true);
  await json(`${folder}/normalization.json`, {
    command: await bind(`${folder}/commands/normalize.json`),
    chinese: await bind(template('lesson')), english: await bind(englishPath),
    invocations: 1, sequence: 'Native normalize_lesson_layout before any prose_flow anchors.'
  });
  console.log(encode(await read(`${folder}/normalization.json`)));
} else if (phase === 'flow') {
  assert.ok(await exists(`${folder}/normalization.json`));
  const reports = {};
  for (const [language, file] of [['zh', template('lesson')], ['en', englishPath]]) {
    const flowInput = `${folder}/flow-input.${language}.lesson.json`;
    if (await exists(flowInput)) {
      assert.equal((await bind(file)).sha256, (await bind(flowInput)).sha256);
    } else {
      await retain(file, flowInput);
    }
    const receiptPath = `${folder}/commands/prose-flow-${language}.json`;
    let stdout;
    if (await exists(receiptPath)) {
      const receipt = await read(receiptPath);
      assert.equal(receipt.exitCode, 0);
      await verify(receipt.stdout);
      stdout = await fs.readFile(receipt.stdout.path, 'utf8');
    } else {
      stdout = await runOnce(`prose-flow-${language}`, process.execPath,
        [`${toolRoot}/prose_flow.mjs`, file]);
    }
    const paragraphs = [];
    const boundaries = [];
    let current;
    for (const line of stdout.trimEnd().split('\n')) {
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
    assert.equal(boundaries.length, paragraphs.length - 1);
    const prefixes = language === 'zh'
      ? texts.concept_starts.map(prefix =>
        prefix === '图 237 中' ? '两根导线靠得很近' : prefix)
      : texts.english_concept_starts;
    const selected = prefixes.map(prefix => {
      const matches = boundaries.filter(boundary => boundary.after.startsWith(prefix));
      assert.equal(matches.length, 1, `Missing or ambiguous native boundary: ${prefix}`);
      return matches[0];
    });
    const document = await read(file);
    document.section_breaks = selected;
    await json(file, document, true);
    reports[language] = {
      paragraphs, allEmittedBoundaries: boundaries, selectedBoundaries: selected,
      command: await bind(`${folder}/commands/prose-flow-${language}.json`),
      input: await bind(`${folder}/flow-input.${language}.lesson.json`),
      anchorOrigin: 'Exact adjacent boundary JSON objects from native prose_flow stdout after native normalization; no hand indices or raw-paragraph anchors.'
    };
    console.log(stdout);
  }
  await json(`${folder}/native-flow.json`, reports);
  await json(`${folder}/flow-selection-note.json`, {
    originalRequestedConceptStart: '图 237 中',
    actualSelectedNativeParagraphStart: '两根导线靠得很近',
    reason: 'Native Chinese normalization groups the figure 237 introduction with the preceding current-off qualification. Select the next exact emitted adjacent boundary, where close equal opposite currents and their external cancellation are explained; do not split a native paragraph or invent an anchor.',
    chineseCommandInvocations: 1, chineseFlowOutputReusedAfterSelectionMiss: true,
    normalizationReruns: 0
  });
} else if (phase === 'validate') {
  assert.ok(await exists(`${folder}/native-flow.json`));
  const checked = JSON.parse(await runOnce('validate-text', python,
    ['-B', `${folder}/native-text.py`], {
      mode: 'validate', book,
      lesson: await read(template('lesson')), exercises: await read(template('exercises')),
      english: await read(englishPath),
      profile: await read(`${cwd}/.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json`)
    }));
  await json(`${folder}/native-text-result.json`, checked);
  assert.deepEqual(checked.errors, []);
  await json(`${folder}/calculation.json`, {
    card, status: 'author-signature-record-no-calculation-in-source',
    sourceCalculations: [], authoredCalculations: [], addedFormulae: [],
    addedNumericalValues: [], numericChanges: [],
    signatures: checked.signatures,
    sourceMathAtoms: checked.mathAtoms,
    sourceTasks: 0, authoredTasks: 0,
    note: 'All source and translated literal digit tokens match in each source-bound block. Native Chinese number signatures also match. Current-direction statements remain qualitative; no new numerical example, force equation or math erratum.'
  });
  console.log(encode(checked));
} else if (phase === 'freeze') {
  assert.ok(!await exists(freezePath));
  const preparation = await read(`${folder}/preparation.json`);
  for (const snapshot of preparation.snapshots) {
    await verify(snapshot);
    await verify({ path: snapshot.originalPath, sha256: snapshot.sha256 });
  }
  const lesson = await read(template('lesson'));
  const english = await read(englishPath);
  const initial = await read(`${folder}/before/lesson.template.json`);
  assert.deepEqual(lesson.source, initial.source);
  assert.deepEqual(english.source, initial.source);
  for (const [index, block] of lesson.prose.entries()) {
    for (const field of ['kind', 'id', 'label', 'printed_page', 'source_refs', 'source_text',
      'numeric_changes', 'historical_entities']) {
      assert.deepEqual(block[field], initial.prose[index][field]);
      assert.deepEqual(english.prose[index][field], initial.prose[index][field]);
    }
    const emphasis = text => [...text.matchAll(/\*\*(.+?)\*\*/gs)]
      .map(match => match[1]);
    assert.deepEqual(emphasis(block.text), emphasis(initial.prose[index].text));
    assert.deepEqual(emphasis(english.prose[index].text),
      emphasis(initial.prose[index].text).map(term => ({
        '磁相互作用': 'magnetic interaction', '磁力': 'magnetic force'
      })[term]));
  }
  for (const name of ['exercises', 'figures']) {
    assert.equal((await bind(template(name))).sha256,
      (await bind(`${folder}/before/${name}.template.json`)).sha256);
  }
  const flow = await read(`${folder}/native-flow.json`);
  for (const [language, document] of [['zh', lesson], ['en', english]]) {
    assert.deepEqual(document.section_breaks, flow[language].selectedBoundaries);
    for (const boundary of document.section_breaks) {
      assert.equal(flow[language].allEmittedBoundaries.filter(item =>
        item.before === boundary.before && item.after === boundary.after).length, 1);
    }
  }
  const result = await read(`${folder}/native-text-result.json`);
  assert.deepEqual(result.errors, []);
  const snapshots = [];
  for (const name of names) {
    snapshots.push(await retain(template(name), `${folder}/frozen/${name}.template.json`));
  }
  snapshots.push(await retain(englishPath, `${folder}/frozen/english.lesson.json`));
  const bindings = {
    lessonTemplate: await bind(template('lesson')),
    exercisesTemplate: await bind(template('exercises')),
    figuresTemplate: await bind(template('figures')),
    englishLesson: await bind(englishPath),
    englishFullTranslationBeforeNormalization: await bind(
      `${folder}/authored-before-normalization.english.json`),
    englishExercises: await bind(`${folder}/english/exercises.json`),
    calculation: await bind(`${folder}/calculation.json`)
  };
  await json(`${folder}/translation-alignment.json`, {
    card, chinese: bindings.lessonTemplate, english: bindings.englishLesson,
    fullEnglishBeforeNormalization: bindings.englishFullTranslationBeforeNormalization,
    alignmentUnit: 'Complete original source-bound prose object, not equal native paragraph counts.',
    objects: lesson.prose.map((block, index) => ({
      kind: block.kind, id: block.id, label: block.label,
      source_refs: block.source_refs, source_text: block.source_text,
      chineseText: block.text, englishText: english.prose[index].text
    })),
    retainedNativeLayoutObservation: 'Native normalization groups Chinese sentences in threes and splits some English semicolon clauses across paragraphs. Exact emitted paragraphs and boundaries are retained; the complete pre-normalization English translation is also frozen. No display acceptance claimed.'
  });
  bindings.translationAlignment = await bind(`${folder}/translation-alignment.json`);
  const proseFacts = {
    sourceProseObjects: initial.prose.length,
    sourceParagraphObjects: initial.prose.filter(block => block.kind === 'p').length,
    chineseNativeParagraphs: flow.zh.paragraphs.length,
    englishNativeParagraphs: flow.en.paragraphs.length,
    sourceTasks: 0, authoredTasks: 0, mathAtoms: result.mathAtoms,
    sourceFigurePositions: initial.prose.filter(block => block.kind === 'fig')
      .map(block => ({ id: block.id, source_refs: block.source_refs })),
    preservedEmphasis: {
      source: ['磁相互作用', '磁力'],
      chinese: ['磁相互作用', '磁力'],
      english: ['magnetic interaction', 'magnetic force'],
      printedForm: 'Source page note records emphasis dots; Markdown preserves the same emphasis scope.'
    }
  };
  const commands = [];
  for (const name of ['adapt-prepare', 'normalize', 'prose-flow-zh', 'prose-flow-en',
    'validate-text']) {
    commands.push(await bind(`${folder}/commands/${name}.json`));
  }
  const authorHelpers = await Promise.all(['author.mjs', 'native-text.py', 'texts.json',
    'preflight-note.json']
    .map(name => bind(`${folder}/${name}`)));
  await json(freezePath, {
    ticket: 'STEMROBIN-181', batch: 'D031', card,
    status: 'bounded-text-authored-frozen-not-independent-SCI-or-delivery',
    sourceCandidate: preparation.sourceCandidate,
    sourceRoot, ownedRoot: folder,
    bindings, snapshots, sourceAndContractSnapshots: preparation.snapshots,
    preparation: await bind(`${folder}/preparation.json`),
    authored: await bind(`${folder}/authored.json`),
    normalization: await bind(`${folder}/normalization.json`),
    nativeFlow: await bind(`${folder}/native-flow.json`),
    flowSelectionNote: await bind(`${folder}/flow-selection-note.json`),
    nativeText: await bind(`${folder}/native-text-result.json`),
    commands, authorHelpers, changes: texts.blocks.map(block => ({
      source_refs: block.source_refs, changes: block.changes, reason: block.reason
    })),
    proseFacts,
    sourceClosure: { lastProse: 'p0281#3', nextHeadingExcluded: 'p0281#8',
      nextCardExcluded: 'phy9-c2-s5-n115' },
    boundaries: { chinese: lesson.section_breaks, english: english.section_breaks,
      origin: 'Exact native adjacent boundary objects, after native paragraph normalization.' },
    execution: { nativeAdaptPrepare: 1, nativeNormalizeCommand: 1,
      nativeProseFlowPerLanguage: 1, nativeTextCheck: 1, imageOpens: 0,
      externalResearch: 0, newSetup: 0 },
    pending: ['Independent SCI', 'Independent figure author source-image inspection and approval',
      'Native finalization and display acceptance by the owning agent'],
    figureManifestStatus: 'Native author placeholder only; unchanged and not review approval.',
    limits: 'Only the owned author directory and this final freeze written. No shared modern/raw/book/page/index/meter writes, app, DB, Git, dependency changes, full tests, image opens or figure work. Source/crop approvals inherited without re-review; no independent SCI, figure, display or completed-delivery claim.'
  });
  const frozen = await read(freezePath);
  for (const binding of [...Object.values(frozen.bindings), ...frozen.snapshots,
    ...frozen.commands, ...frozen.authorHelpers]) await verify(binding);
  await json(`${folder}/verification.json`, {
    freeze: await bind(freezePath),
    status: 'hash-and-structure-only',
    sourceSnapshotsPreserved: true, sourceRefsAndIdentityPreserved: true,
    exercisesAndFigureManifestUnchanged: true,
    anchorsCopiedFromActualNativeAdjacentBoundaries: true,
    scope: 'No native command rerun, source review, SCI or figure/display acceptance.'
  });
  console.log(encode({ freeze: await bind(freezePath), bindings, proseFacts }));
} else {
  throw new Error('Expected prepare, author, normalize, flow, validate or freeze.');
}

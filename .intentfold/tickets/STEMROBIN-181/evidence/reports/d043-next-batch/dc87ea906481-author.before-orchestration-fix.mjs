import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const owned = path.dirname(import.meta.filename);
const parent = path.dirname(owned);
const repo = process.cwd();
const card = 'phy10-c1-s4-n36';
const edition = 'modern-us-neutral';
const tools = path.join(repo, '.claude/skills/ld-s10y-lesson/tools');
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
const require = createRequire(import.meta.url);
const { proseOutline, sectionBreakIndices, proseFlow } = require(path.join(tools, 'htmlfrag.js'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = async file => ({ path: path.resolve(file), sha256: hash(await fs.readFile(file)) });
const read = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const save = async (relative, value) => {
  const target = path.join(owned, relative);
  assert.ok(target.startsWith(`${owned}/`));
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
  return bind(target);
};
const copy = async (source, relative) => {
  const target = path.join(owned, relative);
  assert.ok(target.startsWith(`${owned}/`));
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.copyFile(source, target, 1);
  const original = await bind(source);
  const snapshot = await bind(target);
  assert.equal(original.sha256, snapshot.sha256);
  return { original, snapshot };
};
const walk = async folder => {
  const files = [];
  for (const item of await fs.readdir(folder, { withFileTypes: true })) {
    const file = path.join(folder, item.name);
    if (file === owned) continue;
    if (item.isDirectory()) files.push(...await walk(file));
    else if (item.isFile()) files.push(file);
    else throw new Error(`Unexpected non-regular input: ${file}`);
  }
  return files.sort();
};
const run = async (name, command, args, input) => {
  const started = await save(`commands/${name}.started.json`, {
    command, args, cwd: repo, startedAt: new Date().toISOString(),
    stdinSha256: input === undefined ? null : hash(input),
  });
  if (input !== undefined) {
    await fs.writeFile(path.join(owned, `commands/${name}.stdin.json`), input, { flag: 'wx' });
  }
  const result = spawnSync(command, args, {
    cwd: repo, encoding: 'utf8', input, timeout: 180000,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  const receipt = await save(`commands/${name}.initial.json`, {
    command, args, cwd: repo, started, exitCode: result.status,
    signal: result.signal, stdout: result.stdout, stderr: result.stderr,
    error: result.error?.message ?? null, completedAt: new Date().toISOString(),
    originalErrorsPreserved: true,
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return { receipt, stdout: result.stdout };
};

assert.equal(owned, path.join(repo,
  '.intentfold/tickets/STEMROBIN-181/tmp/d042-10p-n36-author/complete'));
const initialResult = await bind(path.join(parent, 'result.json'));
assert.equal(initialResult.sha256,
  'a1a5b013d864ef1e34067381bc94c81ed3ad1024ccde3c28ba93956b53aa9a4d');
const hold = await read(initialResult.path);
assert.equal(hold.status, 'HOLD-unexpected-source-tasks');
const protectedHistory = [];
for (const file of await walk(parent)) protectedHistory.push(await bind(file));
const inputSnapshots = [];
for (const item of hold.rawSnapshots) {
  assert.equal((await bind(item.snapshot.path)).sha256, item.snapshot.sha256);
  inputSnapshots.push(await copy(item.snapshot.path,
    `frozen/raw/${path.basename(item.snapshot.path)}`));
}
inputSnapshots.push(await copy(hold.sourceClosure.path, 'inputs/initial-source-closure.json'));
inputSnapshots.push(await copy(hold.assembly.path, 'inputs/initial-assemble.json'));
const nativeTools = [];
for (const name of ['p2c.py', 'edition.py', 'assemble.py', 'blocks.py',
  'normalize.py', 'mathcheck.py', 'prose_flow.mjs', 'htmlfrag.js']) {
  nativeTools.push(await bind(path.join(tools, name)));
  inputSnapshots.push(await copy(path.join(tools, name), `inputs/native/${name}`));
}
const textsPath = path.join(owned, 'texts.json');
const texts = await read(textsPath);
const raw = await read(path.join(owned, 'frozen/raw/lesson.json'));
const rawExercises = await read(path.join(owned, 'frozen/raw/exercises.json'));
assert.equal(texts.card, card);
assert.equal(texts.prose.length, raw.prose.length);
assert.equal(texts.questions.length, rawExercises.count);
const relatives = ['lesson.template.json', 'exercises.template.json', 'figures.template.json'];
const templateRelative = `adapt/10p/${edition}/lessons/${card}`;
const locations = ['zh', 'en'].map(language => ({
  language, root: path.join(owned, language, 'root'),
  work: path.join(owned, language, 'work'),
}));
for (const item of locations) {
  for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) {
    inputSnapshots.push(await copy(path.join(owned, 'frozen/raw', name),
      `${item.language}/root/10p/lessons/${card}/${name}`));
  }
  for (const page of [101, 102, 103, 104]) {
    const number = String(page).padStart(4, '0');
    for (const name of ['page.md', 'page.json', 'audit.json']) {
      inputSnapshots.push(await copy(path.join(parent, 'root/10p/pages', number, name),
        `${item.language}/root/10p/pages/${number}/${name}`));
    }
  }
  inputSnapshots.push(await copy(path.join(parent, 'root/10p/book.json'),
    `${item.language}/root/10p/book.json`));
}
const prepare = await run('adapt-prepare', python, [
  '-B', path.join(tools, 'p2c.py'), 'adapt-prepare', '--book', '10p',
  '--edition', edition, '--lesson', card,
  '--root', locations[0].root, '--work', locations[0].work,
]);
const preparedBindings = [];
for (const name of relatives) {
  const prepared = path.join(locations[0].work, templateRelative, name);
  preparedBindings.push(await copy(prepared, `prepared/${name}`));
  await copy(prepared, `en/work/${templateRelative}/${name}`);
}
inputSnapshots.push(await copy(
  path.join(locations[0].work, `adapt/10p/${edition}/book.template.json`),
  `en/work/adapt/10p/${edition}/book.template.json`));
const documents = [];
for (const item of locations) {
  const lesson = await read(path.join(owned, 'prepared/lesson.template.json'));
  const exercises = await read(path.join(owned, 'prepared/exercises.template.json'));
  lesson.language = exercises.language = item.language;
  for (const [index, block] of lesson.prose.entries()) {
    const draft = texts.prose[index];
    assert.deepEqual(draft.source_refs, block.source_refs);
    block.text = draft[item.language];
    block.changes = ['historical-attribution', 'layout'];
    if (item.language === 'en') block.changes.push('translation');
    block.historical_entities = item.language === 'zh'
      ? draft.entities.map(entity => ({
        term: entity.zh,
        reason: `Historical identity explicitly present in ${draft.source_refs.join(', ')}; retained as a source-bound historical report, not a present-day assertion.`,
      })) : [];
    for (const entity of block.historical_entities) {
      assert.ok(block.source_text.includes(entity.term), entity.term);
      assert.ok(block.text.includes(entity.term), entity.term);
    }
  }
  for (const [index, question] of exercises.exercises.entries()) {
    const draft = texts.questions[index];
    assert.equal(draft.number, question.number);
    assert.deepEqual(draft.pages, question.pages);
    question.text = draft[item.language];
    question.lines = question.text.splitlines();
    question.changes = question.text === question.source_text ? []
      : item.language === 'en' ? ['translation']
        : index === 0 ? ['context-qualification'] : ['wording'];
  }
  documents.push({ language: item.language, lesson, exercises });
}
const normalize = await run('native-normalize', python,
  ['-B', path.join(owned, 'native-text.py')],
  JSON.stringify({ mode: 'normalize', documents }));
const normalized = JSON.parse(normalize.stdout);
for (const document of normalized) {
  const item = locations.find(location => location.language === document.language);
  for (const [name, value] of [
    ['lesson.template.json', document.lesson],
    ['exercises.template.json', document.exercises],
  ]) {
    const target = path.join(item.work, templateRelative, name);
    await fs.writeFile(target, `${JSON.stringify(value, null, 2)}\n`);
  }
}
const flows = [];
const languageArtifacts = [];
for (const item of locations) {
  const target = path.join(item.work, templateRelative);
  const lessonPath = path.join(target, 'lesson.template.json');
  const lesson = await read(lessonPath);
  const exercises = await read(path.join(target, 'exercises.template.json'));
  const flowCommand = await run(`prose-flow-${item.language}`, 'node',
    [path.join(tools, 'prose_flow.mjs'), lessonPath]);
  const reportedBoundaries = flowCommand.stdout.split('\n')
    .filter(line => line.startsWith('    break: '))
    .map(line => JSON.parse(line.slice('    break: '.length)));
  const outline = proseOutline(lesson.prose);
  const breaks = [];
  for (const [index, paragraph] of outline.entries()) {
    if (index === 0 || ![4, 7].includes(paragraph.blockIndex)) continue;
    if (outline[index - 1].blockIndex === paragraph.blockIndex) continue;
    const expected = { before: outline[index - 1].text, after: paragraph.text };
    const reported = reportedBoundaries.find(boundary =>
      boundary.before === expected.before && boundary.after === expected.after);
    assert.ok(reported, JSON.stringify(expected));
    breaks.push(reported);
  }
  assert.equal(breaks.length, 2);
  lesson.section_breaks = breaks;
  await fs.writeFile(lessonPath, `${JSON.stringify(lesson, null, 2)}\n`);
  const resolvedBreaks = new Set(sectionBreakIndices(lesson.prose, breaks));
  assert.equal(resolvedBreaks.size, 2);
  flows.push(await save(`prose-flow-${item.language}.json`, {
    paragraphs: outline, boundaries: breaks, resolvedBreaks: [...resolvedBreaks],
    nativeFlow: proseFlow(lesson.prose, breaks), command: flowCommand.receipt,
    boundaryProvenance: 'Copied exact adjacent-paragraph objects from native prose_flow.mjs stdout.',
  }));
  const questionDisplay = await save(`${item.language}/question-display.json`, {
    card, language: item.language, mode: 'read-only', legacyInputInteractions: false,
    independentAnswers: 'pending', choiceCreation: 'pending',
    sourceGroup: '问题',
    displayGroup: item.language === 'zh' ? '复习问题' : 'Review Questions',
    questions: exercises.exercises.map(question => ({
      number: question.number, source_number: question.source_number,
      group: question.group, group_id: question.group_id,
      pages: question.pages, source_text: question.source_text, text: question.text,
    })),
    binding: await bind(path.join(target, 'exercises.template.json')),
    status: 'author-display-intent-only-not-published',
    nativeTemplateFieldsAddedForReadonlyOrChoices: false,
  });
  const displayTitle = await save(`${item.language}/display-title.json`, {
    card, language: item.language,
    title: texts.displayTitle[item.language],
    printed_title: `36. ${texts.displayTitle[item.language]}`,
    validatedIdentity: { title: lesson.title, printed_title: lesson.printed_title },
    validatedTemplate: await bind(lessonPath),
    status: 'display-sidecar-only-no-render-clone',
  });
  const markdown = [
    `# 36. ${texts.displayTitle[item.language]}`, '',
    ...outline.flatMap(paragraph => [
      ...(resolvedBreaks.has(paragraph.index) ? ['---', ''] : []),
      paragraph.text, '',
    ]),
    `## ${item.language === 'zh' ? '复习问题' : 'Review Questions'}`, '',
    ...exercises.exercises.flatMap(question => [question.text, '']),
  ].join('\n');
  const markdownPath = path.join(owned, `lesson-${item.language}.md`);
  await fs.writeFile(markdownPath, markdown, { flag: 'wx' });
  languageArtifacts.push({
    ...item, templates: await Promise.all(relatives.map(name => bind(path.join(target, name)))),
    markdown: await bind(markdownPath), questionDisplay, displayTitle,
    outputs: [], html: [], finalize: null, render: null,
  });
}
const entityBindings = [];
for (const [index, block] of texts.prose.entries()) {
  for (const entity of block.entities) entityBindings.push({
    prose_index: index, source_refs: block.source_refs, source_term: entity.source,
    zh: entity.zh, en: entity.en, reason: 'Literal source identity; translation only.',
  });
}
for (const index of [0, 1]) entityBindings.push({
  prose_index: index, source_refs: texts.prose[index].source_refs,
  source_term: 'В·И·列宁', zh: 'V. I. 列宁', en: 'V. I. Lenin',
  reason: 'Latin transliteration of the original initials; same historical person.',
});
for (const index of [3, 7]) entityBindings.push({
  prose_index: index, source_refs: texts.prose[index].source_refs,
  source_term: '我国', zh: '该国', en: 'Soviet Union',
  context_refs: ['p0101#6', 'p0102#2', 'p0102#3'],
  reason: 'The source narrator uses 我国 for the Soviet Union, explicitly named in neighboring source prose. No country substitution.',
});
const quantitativeBindings = [
  [0, '第一个', '第一个', 'first long-term'],
  [2, '半个世纪', '半个世纪', 'half-century'],
  [2, '翻一番', '翻一番', 'to double'],
  [2, '欧洲第一位', '欧洲第一位', 'first in Europe'],
  [2, '世界第二位', '世界第二位', 'second in the world'],
  [3, '将近五倍', '五倍', 'nearly five times'],
  [3, '第一年', '第一年', 'first year'],
  [4, '六百万千瓦', '六百万千瓦', 'six million kilowatts'],
  [5, '一百万千瓦', '一百万千瓦', 'one million kilowatts'],
  [5, '二百万千瓦', '二百万千瓦', 'two million kilowatts'],
  [5, '三百万千瓦', '三百万千瓦', 'three million kilowatts'],
  [6, '第二十五次', '第二十五次', 'twenty-fifth'],
].map(([index, source, zh, en]) => ({
  prose_index: index, source_refs: texts.prose[index].source_refs,
  source, zh, en, reason: 'Preserved source quantity or ordering; words translated, value unchanged.',
}));
const history = await save('historical-bindings.json', {
  card, rawLesson: await bind(path.join(owned, 'frozen/raw/lesson.json')),
  entities: entityBindings, quantities: quantitativeBindings,
  policy: 'All statistics, capacities, rankings, political judgments and infrastructure plans are source-bound historical reports, not current facts.',
  scientificQualifications: [
    { source_refs: ['p0101#5'], topic: 'Historical political/economic judgment, not a physical law.' },
    { source_refs: ['p0101#7', 'p0102#1'], topic: 'Electrical energy totals, not generating power.' },
    { source_refs: ['p0102#5'], topic: 'Grid benefits depend on operation; a planning requirement does not establish completion.' },
    { source_refs: ['p0102#7'], topic: 'AC advantages are asked within chapter conditions, not asserted as universally superior to DC.' },
  ],
  independentSCIApproval: false,
});
const textCheck = await run('native-text-contract', python,
  ['-B', path.join(owned, 'native-text.py')], JSON.stringify({ mode: 'validate' }));
const textReport = JSON.parse(textCheck.stdout);
assert.equal(textReport.status, 'pass');
const textChecks = await save('text-checks.json', {
  ...textReport,
  proseFlowBindings: flows,
  command: textCheck.receipt,
});
const sourceClosure = await save('source-closure.json', {
  ...await read(hold.sourceClosure.path),
  status: 'PASS-bilingual-author-stage-four-questions-retained',
  routingCorrection: true, defectiveTextRepair: false,
  supersedesInitialHoldForRoutingOnly: initialResult,
  sourceReports: hold.inputs.slice(0, 2),
  rawFiles: inputSnapshots.slice(0, 3).map(item => item.snapshot),
  languages: languageArtifacts,
  authorTextChecks: textChecks,
  independentAnswers: 'pending', choiceCreation: 'pending',
  independentSCI: 'pending', wholeCardComplete: false,
  finalization: 'not-run', render: 'not-run',
});
for (const item of protectedHistory) {
  assert.equal((await bind(item.path)).sha256, item.sha256, item.path);
}
for (const item of nativeTools) {
  assert.equal((await bind(item.path)).sha256, item.sha256, item.path);
}
for (const item of inputSnapshots) {
  assert.equal((await bind(item.original.path)).sha256, item.original.sha256);
  assert.equal((await bind(item.snapshot.path)).sha256, item.snapshot.sha256);
}
for (const item of preparedBindings) {
  assert.equal((await bind(item.snapshot.path)).sha256, item.snapshot.sha256);
}
const files = [];
for (const file of await walk(owned)) files.push(await bind(file));
const freeze = await save('author-freeze.json', {
  schema: 'ld-s10y-lesson/bilingual-author-freeze@1',
  ticket: 'STEMROBIN-181', card,
  status: 'PASS-bilingual-author-stage-independent-work-pending',
  initialHold: initialResult, initialHistoryPreserved: true, protectedHistory,
  raw3: inputSnapshots.slice(0, 3).map(item => item.snapshot),
  inputSnapshots, preparedBindings, nativeTools, authorSources: [
    await bind(textsPath), await bind(import.meta.filename),
    await bind(path.join(owned, 'native-text.py')),
  ],
  languages: languageArtifacts,
  sourceClosure, historicalBindings: history,
  commands: { prepare: prepare.receipt, normalize: normalize.receipt,
    proseFlow: flows, textContract: textCheck.receipt },
  textChecks, frozenFiles: files,
  counts: {
    sourceProseObjects: 8, sourceExercises: 4, modernProseObjectsPerLanguage: 8,
    modernExercisesPerLanguage: 4, modernFigures: 0, bilingualTemplates: 6,
    rawFiles: 3, normalizedMarkdown: 2, modernOutputs: 0, renderHTML: 0,
  },
  nativeInvocationCounts: {
    assemble: 0, adaptPrepare: 1, nativeNormalize: 1,
    proseFlowPerLanguage: 1, bilingualTextContract: 1,
    adaptFinalize: 0, render: 0, defectiveTextRepair: 0,
  },
  readonlyDisplay: 'sidecar-and-markdown-only; no legacy inputs or unsupported native fields',
  strictRawIdentity: true,
  englishDisplayTitle: languageArtifacts.find(item => item.language === 'en').displayTitle,
  independentAnswers: 'pending', choiceCreation: 'pending',
  independentSCI: 'pending', wholeCardComplete: false,
  sourceSubstantiveReplay: false, imagesOpened: 0, canonicalPromotion: false,
  finalize: 'not-run', render: 'not-run',
  limits: 'Author stage only. Initial HOLD and raw freeze are unchanged. No source/SCI review, answers, choices, old input interactions, images, DB, Git, canonical edits, app changes, finalization or rendering.',
});
console.log(JSON.stringify({
  status: 'PASS-bilingual-author-stage-independent-work-pending',
  freeze, counts: { prosePerLanguage: 8, unsolvedQuestionsPerLanguage: 4, figures: 0 },
  finalize: 'not-run', render: 'not-run',
}));

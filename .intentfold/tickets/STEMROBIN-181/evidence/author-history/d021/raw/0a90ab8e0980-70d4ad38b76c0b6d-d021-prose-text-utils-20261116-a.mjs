import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

export const root = process.cwd();
export const T = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp');
export const work = path.join(T, 'd021-n83-n84-text-20261116-a');
export const book = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/9p');
const tools = path.join(root, '.claude/skills/ld-s10y-lesson/tools');
const python = path.join(root, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
const native = path.join(T, 'd021-n83-n84-native-text-20261116-a.py');
export const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const json = value => `${JSON.stringify(value, null, 2)}\n`;
export const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, sha256: crypto.createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length };
};
export const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, json(value), { flag: 'wx' });
};
const snapshot = (file, destination) => {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  if (!fs.existsSync(destination)) fs.copyFileSync(file, destination, fs.constants.COPYFILE_EXCL);
  assert.equal(bind(file).sha256, bind(destination).sha256);
  return { active: bind(file), snapshot: bind(destination) };
};
const runNative = payload => JSON.parse(execFileSync(python, [native], {
  cwd: root, input: json({ book, ...payload }), encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
}));
export const folder = number => path.join(root,
  '.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons', `phy9-c2-s2-n${number}`);
export const paths = number => ({
  lesson: path.join(folder(number), 'lesson.template.json'),
  exercises: path.join(folder(number), 'exercises.template.json'),
  figures: path.join(folder(number), 'figures.template.json'),
});
const verifyPreserved = () => {
  const before = read(path.join(work, 'before.json'));
  for (const item of [...before.sourceCards, before.sourceIndex,
    ...before.sourcePages.filter(item => !item.path.includes('/pages/0207/'))]) {
    assert.deepEqual(bind(item.path), item, `Concurrent source drift: ${item.path}`);
  }
  for (const item of before.archived) assert.deepEqual(bind(item.snapshot.path), item.snapshot);
  return before;
};

export function author(number, edit, authorFile) {
  verifyPreserved();
  const p = paths(number);
  const baselineDir = number === 83
    ? path.join(work, 'before/templates/phy9-c2-s2-n83')
    : path.join(work, 'prepared84');
  for (const key of ['lesson', 'exercises', 'figures']) {
    assert.equal(bind(p[key]).sha256, bind(path.join(baselineDir, `${key}.template.json`)).sha256);
  }
  const lesson = read(p.lesson);
  const exercises = read(p.exercises);
  edit(lesson, exercises);
  save(path.join(work, `n${number}/authored-before-native-layout.json`), { lesson, exercises });
  const normalized = runNative({ mode: 'normalize', lesson, exercises });
  const result = runNative({ mode: 'validate-text', ...normalized,
    profile: read(path.join(root, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json')) });
  save(path.join(work, `n${number}/native-text-result.json`), result);
  assert.deepEqual(result.errors, [], 'Native text contract failed; candidates retained, live templates untouched.');
  fs.writeFileSync(p.lesson, json(normalized.lesson));
  if (number === 84) fs.writeFileSync(p.exercises, json(normalized.exercises));
  else assert.deepEqual(normalized.exercises, exercises);
  assert.equal(bind(p.figures).sha256, bind(path.join(baselineDir, 'figures.template.json')).sha256);
  save(path.join(work, `n${number}/author-result.json`), { author: bind(authorFile),
    helper: bind(import.meta.filename), nativeHelper: bind(native),
    nativeResult: bind(path.join(work, `n${number}/native-text-result.json`)),
    templates: Object.values(p).map(bind), originalSourceBindingsUnchanged: true,
    noNumericValueChanges: true, noSCI: true, noFiguresAuthored: true });
  console.log(json(result));
}

export function flow(number) {
  const p = paths(number);
  const before = bind(p.lesson);
  const command = [path.join(tools, 'prose_flow.mjs'), '--json', p.lesson];
  const output = execFileSync(process.execPath, command, { cwd: root, encoding: 'utf8' });
  save(path.join(work, `n${number}/native-flow.json`), JSON.parse(output));
  save(path.join(work, `n${number}/native-flow-command.json`), {
    command: [process.execPath, ...command], input: before, output,
    tool: bind(command[0]), runs: 1,
  });
  assert.deepEqual(bind(p.lesson), before);
  for (const item of JSON.parse(output).paragraphs) console.log(`[${item.index}] ${item.text}`);
}

export function freeze(number, selectedIndices, authorFile) {
  const before = verifyPreserved();
  const p = paths(number);
  const authorResult = read(path.join(work, `n${number}/author-result.json`));
  for (const item of authorResult.templates) assert.deepEqual(bind(item.path), item);
  const report = read(path.join(work, `n${number}/native-flow.json`));
  const anchors = selectedIndices.map(index => {
    assert.ok(Number.isInteger(index) && index > 0 && index < report.paragraphs.length);
    return { before: report.paragraphs[index - 1].text, after: report.paragraphs[index].text };
  });
  const lesson = read(p.lesson);
  lesson.section_breaks = anchors;
  fs.writeFileSync(p.lesson, json(lesson));
  const templates = Object.entries(p).map(([key, file]) =>
    snapshot(file, path.join(work, `n${number}/frozen/${key}.template.json`)));
  const rawDir = path.join(book, 'lessons', `phy9-c2-s2-n${number}`);
  const sources = ['lesson.json', 'lesson.md', 'exercises.json'].map(file =>
    snapshot(path.join(rawDir, file), path.join(work, `n${number}/frozen/source/${file}`)));
  const pageNumbers = number === 83 ? ['0204', '0205', '0206'] : ['0206', '0207', '0208'];
  const sourcePages = pageNumbers.flatMap(page => ['page.md', 'page.json', 'audit.json'].map(file =>
    snapshot(path.join(book, 'pages', page, file),
      path.join(work, `n${number}/frozen/source-pages/${page}/${file}`))));
  const authoritativeStream = fs.readdirSync(path.join(book, 'pages')).map(page =>
    snapshot(path.join(book, 'pages', page, 'page.json'),
      path.join(work, 'frozen-authoritative-page-stream', `${page}.page.json`)));
  const toolFiles = ['p2c.py', 'assemble.py', 'blocks.py', 'edition.py', 'normalize.py',
    'layout.py', 'mathcheck.py', 'katex_check.js', 'prose_flow.mjs', 'htmlfrag.js']
    .map(file => path.join(tools, file));
  toolFiles.push(native, import.meta.filename, authorFile,
    path.join(T, 'd021-n83-n84-text-20261116-a.mjs'),
    path.join(root, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json'),
    path.join(root, '.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json'),
    path.join(root, '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md'),
    path.join(root, '.claude/skills/ld-s10y-lesson/SKILL.md'),
    path.join(root, 'ssot-resources/soviet10year-textbooks/toc/9p/zh.json'),
    path.join(root, 'ssot-resources/soviet10year-textbooks/sources/manifest.json'));
  const frozenTools = toolFiles.map(file =>
    snapshot(file, path.join(work, `n${number}/frozen/tools`,
      `${crypto.createHash('sha256').update(file).digest('hex').slice(0, 12)}-${path.basename(file)}`)));
  const results = ['native-text-result.json', 'author-result.json', 'native-flow.json', 'native-flow-command.json']
    .map(file => bind(path.join(work, `n${number}`, file)));
  const textResult = read(path.join(work, `n${number}/native-text-result.json`));
  const exercises = read(p.exercises);
  const record = {
    ticket: 'STEMROBIN-181', batch: 'D021', lesson: `phy9-c2-s2-n${number}`,
    status: 'text-authored-frozen-awaiting-independent-SCI-and-figure-work',
    templates, sources, sourcePages, authoritativeStream, tools: frozenTools, results,
    sourceIndex: snapshot(path.join(book, 'book.json'), path.join(work, `n${number}/frozen/source/book.json`)),
    beforeArchive: bind(path.join(work, 'before.json')),
    metadata: bind(path.join(work, 'metadata-native-assembly.json')),
    proseFlow: { paragraphs: report.paragraphs, resolvedBreaks: selectedIndices,
      boundaries: anchors, nativeRuns: 1, anchorsCopiedFromActualNativeParagraphs: true },
    counts: { sourceProseBlocks: lesson.prose.length, modernSourceObjects: lesson.prose.length,
      publishedParagraphs: report.paragraphs.length, tasks: exercises.count,
      mathAtoms: textResult.mathAtoms, nonMathNumbers: textResult.nonMathNumbers,
      numericChanges: 0, registeredErrata: lesson.errata.length,
      existingFigureReferences: lesson.figures.map(item => item.id) },
    errata: lesson.errata,
    preservedSourceCardFileCount: before.sourceCards.length,
    originalSourceCardsAndIndexExactBytesUnchanged: true,
    sourcePage207BodyBlocksRowsAndPixelsUnchanged: true,
    sourcePixelFilesNeverOpenedOrModified: true,
    independentSourceObservation: before.independentSourceObservation,
    deliveryConvention: number === 84
      ? 'Two original solution-bearing exercise objects are worked-example teaching objects, following n64 D018. Full solutions retained; not unsolved practice. No choices, keys, or interactions. Independent SCI must derive both.'
      : 'Zero original tasks; no invented practice.',
    sharedFigureContext: number === 83
      ? 'Main reports n80 prose[13] explicitly references fig-158. Upcoming fig-158 author must use BOTH complete n80 and n83 modern text contexts. This freeze does not authorize figure creation, shared-display edits, or promotion.'
      : null,
    limits: 'Text authoring and native source/text mechanical checks only. No self SCI, images, figure authoring/promotion, adapt-finalize, source gates/vectorize, DB, git writes, full tests/build, browser, or other chats.',
    findings: [{ code: 'scratch-guard-derived-figure-id',
      note: 'Initial metadata attempt failed before writes because blocks.parse omits derived figure id. Scratch helper corrected with native blocks.fig_id; no shared-tool fix. Prior helper archived.' }],
  };
  const destination = path.join(T, `9p-n${number}-prose-freeze.json`);
  save(destination, record);
  console.log(json({ freeze: bind(destination), counts: record.counts,
    lessonTemplate: bind(p.lesson), exercisesTemplate: bind(p.exercises),
    figuresTemplate: bind(p.figures), sectionBreaks: selectedIndices }));
}

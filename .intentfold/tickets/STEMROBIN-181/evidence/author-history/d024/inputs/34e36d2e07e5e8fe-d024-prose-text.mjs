import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import {
  ticket, book, read, bind, verify, bytes, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

const [phase, number, ...breakIndices] = process.argv.slice(2);
assert.ok(['normalize', 'freeze'].includes(phase));
assert.ok(['93', '94', '95'].includes(number));
const tmp = `${ticket}/tmp`;
const card = `phy9-c2-s3-n${number}`;
const folder = `${tmp}/d024-n${number}-prose-author`;
const templates = Object.fromEntries(['lesson', 'exercises', 'figures'].map(name =>
  [name, `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${card}/${name}.template.json`]));
const native = `${tmp}/d021-n83-n84-native-text-20261116-a.py`;
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
const sourceFiles = await Promise.all(['lesson.json', 'lesson.md', 'exercises.json'].map(name =>
  bind(`${book}/lessons/${card}/${name}`)));
const preparation = await read(`${tmp}/d024-modern-preparation.json`);
assert.ok(preparation.cards.includes(card));
const nativeRun = payload => JSON.parse(execFileSync(python, ['-B', native], {
  input: JSON.stringify({ book, ...payload }), encoding: 'utf8',
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
}));
if (phase === 'normalize') {
  assert.deepEqual(breakIndices, []);
  assert.ok(!await exists(`${folder}/native-text-result.json`) && !await exists(`${folder}/normalize-started.json`));
  const lesson = await read(templates.lesson);
  const exercises = await read(templates.exercises);
  assert.deepEqual(lesson.section_breaks, []);
  assert.equal(exercises.count, number === '94' ? 3 : 0);
  const initialInputs = await Promise.all(Object.values(templates).map(bind));
  await immutableWrite(`${folder}/normalize-started.json`, `${JSON.stringify({
    inputs: initialInputs, sources: sourceFiles, nativeHelper: await bind(native),
    helper: await bind(`${tmp}/d024-prose-text.mjs`),
    scope: 'One native normalization and text check only; host-authored prose. No SCI, image or source gate.',
  }, null, 2)}\n`);
  await immutableWrite(`${folder}/authored-before-normalization.json`, `${JSON.stringify({ lesson, exercises }, null, 2)}\n`);
  const normalized = nativeRun({ mode: 'normalize', lesson, exercises });
  const result = nativeRun({ mode: 'validate-text', ...normalized,
    profile: await read('.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json') });
  await immutableWrite(`${folder}/native-text-result.json`, `${JSON.stringify(result, null, 2)}\n`);
  assert.deepEqual(result.errors, []);
  for (const input of initialInputs) await verify(input.path, input.sha256);
  await fs.writeFile(templates.lesson, `${JSON.stringify(normalized.lesson, null, 2)}\n`);
  await fs.writeFile(templates.exercises, `${JSON.stringify(normalized.exercises, null, 2)}\n`);
  const flowInput = await bind(templates.lesson);
  const command = ['.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--json', templates.lesson];
  const output = execFileSync(process.execPath, command, { encoding: 'utf8' });
  await verify(flowInput.path, flowInput.sha256);
  await immutableWrite(`${folder}/native-flow.json`, output);
  await immutableWrite(`${folder}/native-flow-command.json`, `${JSON.stringify({
    command, input: flowInput, output, tool: await bind(command[0]), runs: 1,
  }, null, 2)}\n`);
  await immutableWrite(`${folder}/normalized-bindings.json`, `${JSON.stringify({
    templates: await Promise.all(Object.values(templates).map(bind)),
    sources: sourceFiles, nativeResult: await bind(`${folder}/native-text-result.json`),
    flow: await bind(`${folder}/native-flow.json`),
  }, null, 2)}\n`);
  for (const paragraph of JSON.parse(output).paragraphs) console.log(`[${paragraph.index}] ${paragraph.text}`);
} else {
  const freezePath = `${tmp}/9p-n${number}-prose-freeze.json`;
  assert.ok(!await exists(freezePath));
  const state = await read(`${folder}/normalized-bindings.json`);
  for (const input of [...state.templates, ...state.sources]) await verify(input.path, input.sha256);
  const flow = await read(state.flow.path);
  const indices = breakIndices.map(Number);
  assert.equal(new Set(indices).size, indices.length);
  const boundaries = indices.map(index => {
    assert.ok(Number.isInteger(index) && index > 0 && index < flow.paragraphs.length);
    return { before: flow.paragraphs[index - 1].text, after: flow.paragraphs[index].text };
  });
  const lesson = await read(templates.lesson);
  lesson.section_breaks = boundaries;
  await fs.writeFile(templates.lesson, `${JSON.stringify(lesson, null, 2)}\n`);
  const bindings = {};
  const snapshots = [];
  for (const [name, file] of Object.entries(templates)) {
    const snapshot = `${folder}/frozen/${name}.template.json`;
    await immutableWrite(snapshot, await bytes(file));
    bindings[`${name}Template`] = await bind(file);
    snapshots.push({ originalPath: file, ...await bind(snapshot) });
  }
  for (const source of sourceFiles) {
    const snapshot = `${folder}/frozen/source/${path.basename(source.path)}`;
    await immutableWrite(snapshot, await bytes(source.path));
    snapshots.push({ originalPath: source.path, ...await bind(snapshot) });
  }
  const sourceLesson = await read(`${book}/lessons/${card}/lesson.json`);
  const sourceExercises = await read(`${book}/lessons/${card}/exercises.json`);
  const refs = [...sourceLesson.prose.flatMap(block => block.source_refs),
    ...sourceExercises.exercises.flatMap(exercise => exercise.pages)];
  const pages = [...new Set(refs.map(ref => /^p(\d+)#/.exec(ref)[1]))].sort();
  const pageBindings = [];
  for (const page of pages) {
    for (const name of ['page.md', 'page.json', 'audit.json']) {
      const original = `${book}/pages/${page}/${name}`;
      const snapshot = `${folder}/frozen/pages/${page}/${name}`;
      await immutableWrite(snapshot, await bytes(original));
      pageBindings.push({ originalPath: original, ...await bind(snapshot) });
    }
  }
  const indexSnapshot = `${folder}/frozen/source-book.json`;
  await immutableWrite(indexSnapshot, await bytes(`${book}/book.json`));
  const result = await read(`${folder}/native-text-result.json`);
  await immutableWrite(freezePath, `${JSON.stringify({
    ticket: 'STEMROBIN-181', batch: 'D024', lesson: card,
    status: 'text-authored-frozen-awaiting-independent-SCI-and-figure-work',
    bindings, snapshots, sources: sourceFiles, sourcePages: pageBindings,
    sourceIndex: { originalPath: `${book}/book.json`, ...await bind(indexSnapshot) },
    preparation: await bind(`${tmp}/d024-modern-preparation.json`),
    nativeText: await bind(`${folder}/native-text-result.json`),
    nativeFlow: state.flow, nativeFlowCommand: await bind(`${folder}/native-flow-command.json`),
    authorInputs: await bind(`${folder}/authored-before-normalization.json`),
    nativeHelpers: await Promise.all([native, `${tmp}/d024-prose-text.mjs`,
      '.claude/skills/ld-s10y-lesson/tools/edition.py',
      '.claude/skills/ld-s10y-lesson/tools/normalize.py',
      '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs',
      '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js',
      '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md'].map(bind)),
    proseFlow: { paragraphs: flow.paragraphs, resolvedBreaks: indices, boundaries,
      nativeRuns: 1, anchorsCopiedFromActualNativeParagraphs: true },
    counts: { sourceProseBlocks: lesson.prose.length, publishedParagraphs: flow.paragraphs.length,
      solvedTeachingExamples: sourceExercises.count, newUnsolvedTasks: 0,
      mathAtoms: result.mathAtoms, nonMathNumbers: result.nonMathNumbers,
      registeredErrata: lesson.errata.length, figures: sourceLesson.figures.map(figure => figure.id) },
    deliveryConvention: number === '94'
      ? 'All three original complete solutions remain worked teaching examples. Independent SCI must derive them. No new unsolved practice, choices, standalone answer keys or interactions.'
      : 'Zero original tasks; no invented practice, choices, answers or interactions.',
    limits: 'Host-authored text and one native normalize/text-check/flow only. Original source unchanged. No SCI, image opens, figure work, finalize, source review/count, browser, DB, Git, full checks or other chats.',
  }, null, 2)}\n`);
  console.log(JSON.stringify(await bind(freezePath)));
}

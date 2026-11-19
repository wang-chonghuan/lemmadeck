import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const cwd = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
assert.equal(process.cwd(), cwd);
const sourceRoot = path.join(cwd, '.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n46-n47-source-stage/artifacts/7a');
const reviewRoot = path.dirname(new URL(import.meta.url).pathname);
const require = createRequire(import.meta.url);
const { proseOutline, proseFlow, sectionBreakIndices } = require(path.join(cwd, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'));
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const compact = (text) => text.replace(/\s|↵/gu, '').replace(/\*\*/g, '');
const math = (text) => [...text.matchAll(/\$([^$]+)\$/gs)].map((m) => compact(m[1]));
const outsideMath = (text) => text.replace(/\$([^$]+)\$/gs, '');
const latin = (text) => text.replace(/[абвгдежзик]\)/g, (label) => 'abcdefghij'['абвгдежзик'.indexOf(label[0])] + ')');
const sources = read(path.join(reviewRoot, 'source-solutions.json'));
assert.equal(sources.independence.modern_outputs_read_before_solution_freeze, false);
assert.equal(sources.independence.author_answers_read, false);
const sourceSolutionBindings = ['source-solutions.json', 'source-solutions.md'].map((name) => {
  const file = path.join(reviewRoot, name);
  assert.equal(fs.statSync(file).mode & 0o777, 0o444);
  return { name, sha256: hash(file), mode: '0444' };
});
assert.equal(sourceSolutionBindings[0].sha256, 'c2ff0e265e0f7c6a374689470298c7705906eb297c1b98d8d7845f6b8b41539c');
assert.equal(sourceSolutionBindings[1].sha256, 'ca711878ba4171a39b1ae8e4eefd4906dd9f5b341fee7470734d6c9165dec3f1');

// Canonical metadata and text bindings are reused; no pixels are opened or re-reviewed.
const pages = new Map();
const canonicalPageInventory = [];
for (let number = 273; number <= 281; number += 1) {
  const file = path.join(sourceRoot, 'pages', String(number).padStart(4, '0'), 'page.json');
  const document = read(file);
  assert.equal(document.meta.book, '7a');
  assert.equal(document.meta.page, number);
  assert.equal(document.meta.source.pdf_page, number);
  assert.equal(document.meta.source.pdf_sha256, '8070c333ee46fb0dc650cb32d4d898f605ed308559b6cc430425d908dae6b052');
  pages.set(number, document);
  canonicalPageInventory.push({ page: number, path: path.relative(cwd, file), sha256: hash(file) });
}
function canonicalText(refs) {
  return refs.map((ref) => {
    const match = /^p(\d{4})#(\d+)$/.exec(ref);
    assert.ok(match, ref);
    const block = pages.get(Number(match[1])).blocks[Number(match[2]) - 1];
    assert.ok(block, ref);
    return block.lines.join('');
  }).join('');
}
const page274 = pages.get(274);
assert.equal(page274.meta.errata.length, 1);
const registryErratum = page274.meta.errata[0];
const lessons = [];
for (const reference of sources.lessons) {
  const id = reference.id;
  const rawDir = path.join(sourceRoot, 'lessons', id);
  const modernDir = path.join(sourceRoot, 'editions/modern-us-neutral/lessons', id);
  const filenames = ['adaptation.audit.json', 'exercises.json', 'figures.json', 'lesson.json'];
  assert.deepEqual(fs.readdirSync(modernDir).sort(), filenames);
  const inventory = filenames.map((name) => {
    const file = path.join(modernDir, name);
    return { name, path: path.relative(cwd, file), bytes: fs.statSync(file).size, sha256: hash(file) };
  });
  const rawLesson = read(path.join(rawDir, 'lesson.json'));
  const rawExercises = read(path.join(rawDir, 'exercises.json'));
  const lesson = read(path.join(modernDir, 'lesson.json'));
  const exercises = read(path.join(modernDir, 'exercises.json'));
  const figures = read(path.join(modernDir, 'figures.json'));
  const audit = read(path.join(modernDir, 'adaptation.audit.json'));
  for (const [name, expected] of Object.entries(reference.source_hashes)) {
    assert.equal(hash(path.join(rawDir, name)), expected);
  }
  assert.equal(lesson.id, id);
  assert.equal(lesson.card_id, rawLesson.card_id);
  assert.equal(lesson.number, rawLesson.number);
  assert.equal(lesson.title, rawLesson.title);
  assert.equal(lesson.printed_title, rawLesson.printed_title);
  assert.equal(lesson.start_page, rawLesson.start_page);
  assert.equal(lesson.start_printed, rawLesson.start_printed);
  assert.equal(lesson.prose.length, reference.counts.raw_prose_blocks);
  assert.equal(exercises.exercises.length, reference.counts.original_exercises);
  assert.equal(exercises.count, rawExercises.count);
  assert.equal(lesson.exercise_count, rawLesson.exercise_count);
  assert.equal(lesson.source.sha256, reference.source_hashes['lesson.json']);
  assert.equal(lesson.source.path, `lessons/${id}/lesson.json`);
  assert.deepEqual(lesson.source.data, rawLesson);
  assert.equal(exercises.source.sha256, reference.source_hashes['exercises.json']);
  assert.equal(exercises.source.path, `lessons/${id}/exercises.json`);
  assert.deepEqual(exercises.source.data, rawExercises);
  for (const document of [lesson, exercises, figures]) {
    assert.equal(document.edition, 'modern-us-neutral');
    assert.equal(document.status, 'ready');
  }
  assert.equal(exercises.lesson, id);
  assert.equal(figures.lesson, id);
  assert.equal(audit.lesson, id);
  assert.deepEqual(figures.figures, []);
  assert.deepEqual(lesson.figures, []);
  assert.deepEqual(rawLesson.figures, []);
  let mathCorrections = 0;
  let historicalDeclarations = 0;
  const proseCoverage = [];
  for (let i = 0; i < rawLesson.prose.length; i += 1) {
    const raw = rawLesson.prose[i];
    const modern = lesson.prose[i];
    assert.equal(compact(raw.text), compact(canonicalText(raw.source_refs)), `${id} canonical prose ${i}`);
    assert.deepEqual(modern.source_refs, raw.source_refs);
    assert.equal(modern.source_text, raw.text);
    for (const field of ['kind', 'id', 'label', 'printed_page']) assert.deepEqual(modern[field], raw[field]);
    assert.deepEqual(modern.numeric_changes, []);
    let expected = raw.text;
    if (id === 'alg7-c4-s3-n46' && i === 4) {
      assert.ok(raw.text.includes('$x_2=\\frac{-b+\\sqrt{b}}{2a}$'));
      expected = expected.replace('$x_2=\\frac{-b+\\sqrt{b}}{2a}$', '$x_2=\\frac{-b+\\sqrt{D}}{2a}$');
      assert.ok(modern.changes.includes('math-correction'));
      mathCorrections += 1;
    }
    assert.equal(compact(modern.text), compact(expected), `${id} prose ${i} changed more than layout/registered erratum`);
    assert.deepEqual(math(modern.text), math(expected), `${id} prose math ${i}`);
    assert.ok(modern.changes.every((change) => ['layout', 'math-correction'].includes(change)));
    if (compact(raw.text) !== compact(modern.text)) assert.ok(modern.changes.includes('math-correction'));
    if (raw.text !== modern.text) assert.ok(modern.changes.length > 0);
    historicalDeclarations += modern.historical_entities.length;
    proseCoverage.push({ index: i, source_refs: raw.source_refs, status: 'pass' });
  }
  const exerciseCoverage = [];
  let taskCount = 0;
  for (let i = 0; i < rawExercises.exercises.length; i += 1) {
    const raw = rawExercises.exercises[i];
    const modern = exercises.exercises[i];
    const solution = reference.exercises[i];
    assert.equal(solution.number, raw.number);
    assert.equal(compact(raw.text), compact(canonicalText(raw.pages)), `${id} canonical exercise ${raw.number}`);
    for (const field of ['number', 'source_number', 'group', 'group_id', 'pages', 'figure_refs', 'figures']) {
      assert.deepEqual(modern[field], raw[field]);
    }
    assert.equal(modern.source_text, raw.text);
    assert.equal(compact(modern.text), compact(latin(raw.text)), `${id} exercise ${raw.number} content`);
    assert.deepEqual(math(modern.text), math(raw.text), `${id} exercise ${raw.number} math`);
    assert.deepEqual(modern.numeric_changes, []);
    assert.deepEqual(modern.historical_entities, []);
    assert.ok(modern.changes.every((change) => change === 'layout'));
    assert.deepEqual(modern.lines, modern.text.split('\n'));
    assert.ok(modern.lines[0].startsWith(raw.number + '.'));
    assert.equal((outsideMath(modern.lines[0]).match(/[a-z]\)/g) ?? []).length, 0);
    const labels = modern.lines.slice(1).map((line) => {
      const match = /^([a-z])\) /.exec(line);
      assert.ok(match, `${id} exercise ${raw.number} line ${line}`);
      assert.equal((outsideMath(line).match(/[a-z]\)/g) ?? []).length, 1);
      return match[1];
    });
    const expectedLabels = solution.tasks[0].label === null
      ? []
      : solution.tasks.map((task) => task.label);
    assert.deepEqual(labels, expectedLabels);
    assert.equal(solution.task_count, solution.tasks.length);
    assert.deepEqual(raw.figure_refs, []);
    assert.deepEqual(raw.figures, []);
    taskCount += solution.task_count;
    exerciseCoverage.push({ number: raw.number, source_refs: raw.pages, labels, tasks: solution.task_count, status: 'pass' });
  }
  assert.equal(taskCount, reference.counts.exercise_tasks);
  assert.equal(lesson.section_breaks.length, 2);
  const outline = proseOutline(lesson.prose);
  const flow = proseFlow(lesson.prose, lesson.section_breaks);
  const indices = sectionBreakIndices(lesson.prose, lesson.section_breaks);
  assert.deepEqual(indices, id === 'alg7-c4-s3-n46' ? [14, 22] : [3, 13]);
  assert.equal(flow.length, outline.length);
  const boundaries = indices.map((index, position) => {
    const boundary = {
      index,
      before: outline[index - 1].text,
      after: outline[index].text,
      before_block: outline[index - 1].blockIndex,
      after_block: outline[index].blockIndex,
    };
    assert.equal(lesson.section_breaks[position].before, boundary.before);
    assert.equal(lesson.section_breaks[position].after, boundary.after);
    assert.equal(flow[index].sectionBreak, true);
    return boundary;
  });
  assert.equal(audit.status, 'pass');
  assert.deepEqual(audit.errors, []);
  assert.equal(audit.sourceLessonSha256, reference.source_hashes['lesson.json']);
  assert.equal(audit.sourceExercisesSha256, reference.source_hashes['exercises.json']);
  assert.equal(audit.proseBlocks, rawLesson.prose.length);
  assert.equal(audit.changedProseBlocks, lesson.prose.filter((p) => p.text !== p.source_text).length);
  assert.equal(audit.exercises, exercises.count);
  assert.equal(audit.changedExercises, exercises.exercises.filter((e) => e.text !== e.source_text).length);
  assert.equal(audit.figures, 0);
  assert.equal(audit.sectionBreaks, 2);
  assert.deepEqual(audit.resolvedSectionBreaks, boundaries.map(({ index, before, after }) => ({ index, before, after })));
  assert.equal(audit.errata, mathCorrections);
  if (id === 'alg7-c4-s3-n46') {
    assert.equal(mathCorrections, 1);
    assert.equal(lesson.errata.length, 1);
    const erratum = lesson.errata[0];
    assert.equal(erratum.id, registryErratum.id);
    assert.equal(erratum.target, 'lesson.prose[4]');
    assert.equal(erratum.source.block, registryErratum.block);
    assert.equal(erratum.original, registryErratum.original);
    assert.equal(erratum.reason, registryErratum.reason);
    assert.equal(erratum.corrected, '$x_2=\\frac{-b+\\sqrt{D}}{2a}$');
    assert.equal(erratum.source.page, 274);
    assert.equal(erratum.source.printed_page, 268);
    assert.equal(erratum.source.sha256, canonicalPageInventory.find((p) => p.page === 274).sha256);
    assert.equal(erratum.source.pdf_sha256, page274.meta.source.pdf_sha256);
    assert.ok(page274.blocks[4].lines.join('').includes(erratum.original));
    const historical = lesson.prose[11];
    assert.equal(historical.text, rawLesson.prose[11].text);
    assert.ok(historical.text.includes('法国数学家弗兰苏阿·韦达（1540－1603）'));
    assert.deepEqual(historical.source_refs, ['p0275#5']);
    assert.equal(historicalDeclarations, 1);
    assert.equal(historical.historical_entities[0].term, '弗兰苏阿·韦达');
    assert.ok(historical.historical_entities[0].reason.includes('p0275#5'));
  } else {
    assert.equal(mathCorrections, 0);
    assert.deepEqual(lesson.errata, []);
    assert.equal(historicalDeclarations, 0);
  }
  // The hash inventory and inspected parsed outputs must describe one stable snapshot.
  for (const entry of inventory) assert.equal(hash(path.join(cwd, entry.path)), entry.sha256);
  lessons.push({
    id,
    status: 'pass',
    original_exercises: reference.counts.original_exercises,
    source_solution_tasks: taskCount,
    prose_mathematics_checks: reference.counts.prose_mathematics_checks,
    raw_prose_blocks: rawLesson.prose.length,
    modern_prose_blocks: lesson.prose.length,
    actual_prose_flow_paragraphs: outline.length,
    changed_prose_blocks: audit.changedProseBlocks,
    changed_exercises: audit.changedExercises,
    math_corrections: mathCorrections,
    historical_declarations: historicalDeclarations,
    figure_count: figures.figures.length,
    four_output_inventory: inventory,
    source_hashes: reference.source_hashes,
    section_boundaries: boundaries,
    prose_coverage: proseCoverage,
    exercise_coverage: exerciseCoverage,
  });
}
console.log(JSON.stringify({
  status: 'pass',
  source_solution_bindings: sourceSolutionBindings,
  counts: sources.counts,
  canonical_page_inventory: canonicalPageInventory,
  lessons,
  findings: [],
  check_script_sha256: hash(new URL(import.meta.url)),
}, null, 2));

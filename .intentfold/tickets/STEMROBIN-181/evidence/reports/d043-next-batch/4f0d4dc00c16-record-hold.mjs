import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repo = process.cwd();
const owned = path.dirname(import.meta.filename);
const card = 'phy10-c1-s4-n36';
const root = path.join(owned, 'root');
const work = path.join(owned, 'work');
const book = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const tools = '.claude/skills/ld-s10y-lesson/tools';
const toc = 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json';
const resolve = file => path.resolve(repo, file);
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = async file => ({
  path: resolve(file), sha256: digest(await fs.readFile(resolve(file))),
});
const read = async file => JSON.parse(await fs.readFile(resolve(file), 'utf8'));
const save = async (relative, value) => {
  const target = path.join(owned, relative);
  assert.ok(target.startsWith(`${owned}/`));
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
  return bind(target);
};
const copy = async (original, relative) => {
  const target = path.join(owned, relative);
  assert.ok(target.startsWith(`${owned}/`));
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.copyFile(resolve(original), target, 1);
  const source = await bind(original);
  const snapshot = await bind(target);
  assert.equal(source.sha256, snapshot.sha256);
  return { original: source, snapshot };
};

assert.equal(owned, resolve('.intentfold/tickets/STEMROBIN-181/tmp/d042-10p-n36-author'));
const reportSpecs = [
  ['d040-10p-source-consumed.json',
    'b64ed00e26e0999cad09e632ddf26bc930eca3edbee7e07902ba3c501934898b'],
  ['d040-source104-107-consumed.json',
    '27bb8ac0505451de28046ee5a3f9c254216aed69e535ba254ef1d3e2a2549ce5'],
];
const inputs = [];
const inputSnapshots = [];
const reports = [];
for (const [name, expected] of reportSpecs) {
  const file = `.intentfold/tickets/STEMROBIN-181/evidence/reports/${name}`;
  const binding = await bind(file);
  assert.equal(binding.sha256, expected);
  const report = await read(file);
  assert.equal(report.status, 'PASS-source-consumed');
  reports.push(report);
  inputs.push(binding);
  inputSnapshots.push(await copy(file, `inputs/reports/${name}`));
}
for (const page of [101, 102, 103, 104]) {
  const number = String(page).padStart(4, '0');
  const accepted = reports[page === 104 ? 1 : 0];
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const file = `${book}/pages/${number}/${name}`;
    const approval = accepted.outputs.find(item => item.path === file);
    assert.ok(approval, file);
    const binding = await bind(file);
    assert.equal(binding.sha256, approval.sha256, file);
    inputs.push(binding);
    inputSnapshots.push(await copy(file, `root/10p/pages/${number}/${name}`));
  }
}
for (const file of [
  toc,
  '.claude/skills/ld-s10y-lesson/SKILL.md',
  '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md',
  '.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json',
  '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json',
  `${tools}/p2c.py`, `${tools}/assemble.py`, `${tools}/blocks.py`,
  `${tools}/normalize.py`, `${tools}/mathcheck.py`, `${tools}/edition.py`,
]) {
  inputs.push(await bind(file));
  inputSnapshots.push(await copy(file,
    `inputs/contracts-and-tools/${path.basename(file)}`));
}
const protectedFiles = [];
for (const file of [
  `${book}/book.json`, `${book}/editions/modern-us-neutral/book.json`,
  '.intentfold/tickets/STEMROBIN-181/production-meter.json',
  '.intentfold/tickets/STEMROBIN-181/evidence/index.json',
]) {
  protectedFiles.push(await bind(file));
}
const catalog = await read(toc);
const cards = catalog.contents.flatMap(chapter =>
  chapter.lessons.flatMap(section => section.topics ?? [section]));
const index = cards.findIndex(item => item.id === card);
assert.ok(index >= 0);
assert.deepEqual(cards[index], {
  id: card, printedNumber: 36, title: '苏联电气化的成就和远景', page: 91,
});
assert.equal(cards[index + 1].id, 'phy10-c1-s4-t7');
assert.equal(cards[index + 2].id, 'phy10-c1-s5-n37');
const inputFreeze = await save('input-freeze.json', {
  ticket: 'STEMROBIN-181', card, inputs, inputSnapshots, protectedFiles,
  physicalPages: [101, 102, 103, 104], tocEntry: cards[index],
  followingEntries: cards.slice(index + 1, index + 3),
  sourceSubstantiveReplay: false, imagesOpened: 0,
});

await fs.mkdir(work, { recursive: true });
const command = resolve('.claude/skills/ld-s10y-lesson/.venv/bin/python');
const args = ['-B', resolve(`${tools}/p2c.py`), 'assemble',
  '--book', '10p', '--root', root, '--work', work, '--toc', resolve(toc)];
await save('commands/assemble.started.json', {
  command, args, cwd: repo, startedAt: new Date().toISOString(),
  nativeEntryUnmodified: true, exactPageFacts: [101, 102, 103, 104],
});
const run = spawnSync(command, args, {
  cwd: repo, encoding: 'utf8', timeout: 180000,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
const assemble = await save('commands/assemble.initial.json', {
  command, args, cwd: repo, exitCode: run.status, signal: run.signal,
  stdout: run.stdout, stderr: run.stderr, error: run.error?.message ?? null,
  completedAt: new Date().toISOString(), originalErrorsPreserved: true,
});
assert.ok([0, 1].includes(run.status), run.stderr || run.stdout);
const lessonDir = path.join(root, '10p/lessons', card);
const lesson = await read(path.join(lessonDir, 'lesson.json'));
const exercises = await read(path.join(lessonDir, 'exercises.json'));
const rawBook = await read(path.join(root, '10p/book.json'));
assert.equal(lesson.id, card);
assert.equal(lesson.title, '苏联电气化的成就和远景');
assert.equal(lesson.printed_title, '36. 苏联电气化的成就和远景');
assert.equal(lesson.prose.length, 8);
assert.deepEqual(lesson.figures, []);
assert.equal(exercises.count, 4);
assert.equal(lesson.exercise_count, 4);
assert.deepEqual(exercises.exercises.map(item => item.pages),
  [['p0102#7'], ['p0102#8'], ['p0102#9'], ['p0102#10']]);
assert.ok(exercises.exercises.every(item => item.group === '问题'));
assert.ok(exercises.exercises.every(item => item.figure_refs.length === 0));
const rawFiles = [];
const rawSnapshots = [];
for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) {
  const file = path.join(lessonDir, name);
  rawFiles.push(await bind(file));
  rawSnapshots.push(await copy(file, `frozen/raw/${name}`));
}
const closure = await save('source-closure.json', {
  ticket: 'STEMROBIN-181', card,
  status: 'HOLD-unexpected-source-tasks',
  structuralTargetClosed: true, sourceApprovalInheritedFromAcceptedReports: true,
  newSourceApproval: false, sourceReports: inputs.slice(0, 2),
  physicalInputs: [101, 102, 103, 104], printedInputs: [91, 92, 93, 94],
  heading: { sourceRef: 'p0101#3', text: lesson.printed_title },
  proseSourceRefs: lesson.prose.map(item => item.source_refs),
  joinedContinuation: ['p0101#7', 'p0102#1'],
  lastProseRef: 'p0102#5',
  exerciseHeading: { sourceRef: 'p0102#6', text: '问题' },
  sourceExercises: exercises.exercises,
  sourceFigureReferences: [],
  immediateRightBoundary: { sourceRef: 'p0103#1', heading: '练习 3',
    card: cards[index + 1].id },
  numberedRightBoundary: { sourceRef: 'p0104#2', heading: '37. 波动现象',
    card: cards[index + 2].id },
  neighboringExercise3Excluded: true, neighboringFigure64Excluded: true,
  nativeAncestorIdentity: { chapter: lesson.chapter, section: lesson.section },
  ancestorHeadingsFabricated: false,
  assembly: assemble, assemblyExit: run.status,
  assemblyErrors: rawBook.audit.errors, assemblyWarnings: rawBook.audit.warnings,
  rawFiles, rawSnapshots,
  rawBook: await bind(path.join(root, '10p/book.json')),
  scope: 'Native assembly only. Boundary and neighboring outputs are not authored or approved.',
});
const checks = [];
for (const binding of inputs) {
  const current = await bind(binding.path);
  assert.equal(current.sha256, binding.sha256, binding.path);
  checks.push({ ...binding, unchanged: true });
}
for (const item of inputSnapshots) {
  assert.equal((await bind(item.snapshot.path)).sha256, item.original.sha256);
}
const protectedObservations = [];
for (const binding of protectedFiles) {
  const current = await bind(binding.path);
  protectedObservations.push({
    path: binding.path, before: binding.sha256, after: current.sha256,
    unchanged: binding.sha256 === current.sha256,
    writtenByThisInvocation: false,
  });
}
const verification = await save('binding-verification.json', {
  inputs: checks, snapshotsByteIdentical: true, protectedObservations,
  writesRestrictedTo: `${owned}/**`, imagesOpened: 0,
});
const result = await save('result.json', {
  ticket: 'STEMROBIN-181', card, status: 'HOLD-unexpected-source-tasks',
  inputs, protectedFiles, inputFreeze, sourceClosure: closure,
  rawFiles, rawSnapshots, assembly: assemble, verification,
  languages: ['zh', 'en'].map(language => ({
    language, root: null, work: null, outputs: [], html: [],
    finalize: null, render: null,
    status: 'not-started-unexpected-source-tasks',
  })),
  counts: {
    sourceProseObjects: 8, sourceFigures: 0, sourceExercises: 4,
    modernFigures: 0, modernExercises: 0,
    bilingualTemplates: 0, modernOutputs: 0, renderHTML: 0,
  },
  nativeInvocationCounts: {
    assemble: 1, adaptPrepare: 0, adaptFinalize: 0, render: 0, targetedTextRepair: 0,
  },
  science: { status: 'independent-pending', approval: false },
  fullCardApproval: false, canonicalPromotion: false,
  originalErrorsPreserved: true, sourceSubstantiveReplay: false,
  imagesOpened: 0, authoringRoot: root, assemblyWork: work,
  reason: 'Canonical physical page 102 contains four unsolved numbered review questions under 问题, owned by n36. The expected zero-task premise fails. Stopped before adaptation; no tasks omitted, rewritten, answered, moved or fabricated.',
  retention: {
    raw3: 'frozen', bilingualTemplates: 'not-produced',
    bilingualOutput4PerLanguage: 'not-produced', renderHTML2PerLanguage: 'not-produced',
    commandReceipts: 'frozen', sourceClosure: 'frozen', bindings: 'frozen',
  },
});
console.log(JSON.stringify({
  status: 'HOLD-unexpected-source-tasks', result,
  counts: { sourceProseObjects: 8, sourceExercises: 4, sourceFigures: 0,
    modernExercises: 0, modernFigures: 0 },
  assemblyExit: run.status, assemblyErrors: rawBook.audit.errors,
}));

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const B = '.tmp/STEMROBIN-181/d1816-d492';
const O = `${T}/tmp/d1816-d492-laboratory-assembly-repair`;
const bind = file => ({
  path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
});
const read = file => JSON.parse(fs.readFileSync(file));
const previous = `${T}/tmp/d1816-d489-laboratory-first-assembly`;
const freeze = read(`${previous}/input-freeze.json`);
const boundaryFile = `${T}/tmp/d1816-d490-source410-lab-right-boundary/report.json`;
const boundary = read(boundaryFile);
assert.equal(boundary.status, 'PASS');
assert.equal(boundary.boundary.laboratoryContinuesOnSource410, false);
assert(!fs.existsSync(`${O}/result.json`));
const copies = [];
for (const row of freeze.copies) {
  const from = row.to.path.endsWith('/book.json') ? row.from : row.to;
  assert.equal(bind(from.path).sha256, from.sha256);
  const relative = path.relative(path.resolve('.tmp/STEMROBIN-181/d1816-d489/root'), row.to.path);
  const to = `${B}/root/${relative}`;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from.path, to, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(to, 0o644);
  copies.push({ from, to: bind(to) });
}
const stages = [];
const native = (name, action, args) => {
  execFileSync('node', [
    `${T}/tmp/d1816-recovery/run-native.mjs`, name,
    '.claude/skills/ld-s10y-lesson/.venv/bin/python',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', action,
    '--book', '10p', '--root', `${B}/root`, '--work', `${B}/source-work`, ...args,
  ], { cwd: repo, stdio: 'inherit' });
  stages.push(bind(`${T}/tmp/d1816-recovery/native/${name}/receipt.json`));
};
native('d492-laboratory-affected-assemble', 'assemble', [
  '--toc', 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json',
]);
const index = read(`${B}/root/10p/book.json`);
assert.equal(index.lessons.length, 1);
assert.equal(index.lessons[0].id, 'phy10-c4-s4');
assert.equal(index.lessons[0].title, '实验作业');
const course = read(`${B}/root/10p/lessons/phy10-c4-s4/lesson.json`);
assert.equal(course.prose.filter(block => block.kind === 'h3').length, 10);
assert.equal(course.exercise_count, 0);
assert.equal(course.figures.length, 1);
assert.equal(course.figures[0].id, 'fig-278');
assert.deepEqual(index.audit.errors, []);
assert.deepEqual(index.audit.warnings, []);
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']])
  native(`d492-laboratory-${locale}-affected-adapt-prepare`, 'adapt-prepare', [
    '--edition', edition, '--lesson', course.id,
  ]);
fs.mkdirSync(O, { recursive: true });
fs.writeFileSync(`${O}/result.json`, JSON.stringify({
  stage: 'D492', course: course.id, status: 'ASSEMBLY_PASS_MODERN_AUTHOR_PENDING',
  copies, previousFirstIncorrectAssembly: bind(`${previous}/result.json`),
  rightBoundary: bind(boundaryFile), stages,
  tooling: bind('.claude/skills/ld-s10y-lesson/tools/assemble.py'),
  targetedTests: bind(`${T}/tmp/d1816-recovery/native/d492-laboratory-assembly-targeted-tests/receipt.json`),
  facts: { courses: 1, experiments: 10, proseBlocks: course.prose.length, exercises: 0, figures: 1 },
  answerChoiceApplicability: 'No independently numbered exercise objects: numbered procedures remain prose; no invented answer keys or choices.',
  sourceReviewsReplayed: false, sourceContentChanged: false,
  parentImageOpens: 0, completeCoursesAdded: 0, sourcePagesAdded: 0,
  paidCalls: 0, databaseWrites: false, wholeCourseApproval: false,
}, null, 2) + '\n', { flag: 'wx' });

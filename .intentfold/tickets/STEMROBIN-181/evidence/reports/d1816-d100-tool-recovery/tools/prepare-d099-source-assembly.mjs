import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const R = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const B = '.tmp/STEMROBIN-181/d1816-d099';
const O = `${T}/tmp/d1816-d099-n131-t11-source-assembly`;
const read = p => JSON.parse(fs.readFileSync(p));
const bind = p => ({ path: p, sha256: crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex') });
const verify = r => assert.equal(bind(r.path).sha256, r.sha256, r.path);
const copies = [];
const copy = (from, to) => {
  assert(!fs.existsSync(to), to);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  copies.push({ source: bind(from), snapshot: bind(to) });
};
assert(!fs.existsSync(`${O}/prepared.json`));
assert(!fs.existsSync(`${B}/root`));
const approvals = [
  `${T}/evidence/reports/d1816-d095-affected128-source320321/consumed.json`,
  `${T}/evidence/reports/d1816-d097-source322323/consumed.json`,
  `${T}/evidence/reports/d1816-d094-retained-source-paths/retained.json`,
];
for (const p of approvals) {
  for (const row of read(p).products) if (!row.path.endsWith('/book.json')) verify(row);
}
const author324325 = read(`${T}/tmp/d1816-d094-source324325-author/author-freeze.json`);
for (const row of author324325.pages) for (const key of ['pageMd', 'pageJson', 'audit']) verify(row[key]);
for (const page of [320, 321, 322, 323, 324, 325]) {
  for (const name of ['page.json', 'page.md', 'audit.json']) {
    copy(`${R}/pages/0${page}/${name}`, `${B}/root/9p/pages/0${page}/${name}`);
  }
}
for (const id of [279, 280, 282, 284, 295, 296, 297, 298]) {
  for (const ext of ['png', 'svg']) {
    copy(`${R}/figures/fig-${id}.${ext}`, `${B}/root/9p/figures/fig-${id}.${ext}`);
  }
}
fs.mkdirSync(O, { recursive: true });
fs.writeFileSync(`${O}/input-freeze.json`, JSON.stringify({
  batch: 'D099', ticket: 'STEMROBIN-181', workdir: repo,
  status: 'approved-source-snapshots-prepared-no-new-review',
  sourcePages: [320, 321, 322, 323, 324, 325], copies,
  reusedSourceApprovals: approvals.map(bind),
  original324325Author: bind(`${T}/tmp/d1816-d094-source324325-author/author-freeze.json`),
  preservedHolds: ['fig296-upper-endpoint-case', 'SOURCE323-BS_n-scientific-distinction'],
  nextCards: ['phy9-c2-s6-n131', 'phy9-c2-s6-t11'],
  chapter132BoundaryOnly: true, existingLessonsNotRewritten: true,
  sourcePageRecounts: 0, sourceVectorizations: 0, independentApprovals: 0,
  newImages: 0, canonicalWrites: 0, completeCoursesAdded: 0,
}, null, 2) + '\n', { flag: 'wx' });
execFileSync('node', [`${T}/tmp/d1816-recovery/run-native.mjs`, 'd099-n131-t11-first-isolated-source-assembly',
  '.claude/skills/ld-s10y-lesson/.venv/bin/python', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
  'assemble', '--book', '9p', '--root', `${B}/root`, '--work', `${B}/work`,
  '--toc', 'ssot-resources/soviet10year-textbooks/toc/9p/zh.json'],
{ cwd: repo, stdio: 'inherit' });
const targets = ['phy9-c2-s6-n131', 'phy9-c2-s6-t11'];
const outputs = [];
for (const id of targets) {
  const directory = `${B}/root/9p/lessons/${id}`;
  const lesson = read(`${directory}/lesson.json`), exercises = read(`${directory}/exercises.json`);
  assert.equal(lesson.id, id);
  assert.equal(exercises.lesson, id);
  outputs.push({
    id, proseEntries: lesson.prose.length, writtenQuestions: exercises.count,
    figures: lesson.figures,
    files: ['lesson.json', 'lesson.md', 'exercises.json'].map(p => bind(`${directory}/${p}`)),
  });
}
const sideEffects = [];
for (const name of fs.readdirSync(`${B}/root/9p/lessons`)) {
  if (targets.includes(name)) continue;
  const from = `${B}/root/9p/lessons/${name}`, to = `${B}/assembly-side-effects/lessons/${name}`;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.renameSync(from, to);
  sideEffects.push({ from, to, status: 'boundary-draft-not-delivered-not-approved' });
}
fs.writeFileSync(`${O}/prepared.json`, JSON.stringify({
  batch: 'D099', status: 'first-isolated-source-assembly-pass-not-modern-or-course-approval',
  inputFreeze: bind(`${O}/input-freeze.json`), outputs, sideEffects,
  assemblyReceipt: bind(`${T}/tmp/d1816-recovery/native/d099-n131-t11-first-isolated-source-assembly/receipt.json`),
  sourcePagesAdded: 0, completeCoursesAdded: 0, canonicalWrites: 0,
  independentReview: false, databaseWrites: false, formalHandoff: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ status: 'source-assembly-only', outputs }));

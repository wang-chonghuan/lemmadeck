import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const B = '.tmp/STEMROBIN-181/d1816-d350';
const O = `${T}/tmp/d1816-d350-n151-preparation`;
const id = 'phy10-c4-s1';
assert(!fs.existsSync(B));
const bind = file => ({ path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const copies = [];
for (const [page, stage] of [[388, 319], [389, 335], [390, 335], [391, 348], [392, 345]]) {
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const from = `.tmp/STEMROBIN-181/d1816-d${stage}/root/10p/pages/${String(page).padStart(4, '0')}/${name}`;
    const to = `${B}/root/10p/pages/${String(page).padStart(4, '0')}/${name}`;
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
    copies.push({ from: bind(from), to: bind(to) });
  }
}
fs.mkdirSync(O, { recursive: true });
fs.writeFileSync(`${O}/input-freeze.json`, JSON.stringify({
  stage: 'D350', id, copies, sourcePages: [388, 389, 390, 391, 392],
  inheritedReviews: [
    bind(`${T}/tmp/d1816-d327-source386-388-review/report.json`),
    bind(`${T}/tmp/d1816-d336-source389-391-review/report.json`),
    bind(`${T}/tmp/d1816-d348-source391-marker-repair/author-freeze.json`),
  ],
  scope: 'N151 only. Source392 next heading closes this course; N152 beginning is excluded.',
  sourcePunctuationReviewPending: true, fullSourceApproval: false,
  originalTableAndOtherLessonsNotImported: true,
}, null, 2) + '\n');
const native = (name, action, extra = []) => execFileSync('node', [
  `${T}/tmp/d1816-recovery/run-native.mjs`, name,
  '.claude/skills/ld-s10y-lesson/.venv/bin/python',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', action,
  '--book', '10p', '--root', `${B}/root`, '--work', `${B}/source-work`, ...extra,
], { cwd: repo, stdio: 'inherit' });
native('d350-n151-first-assembly', 'assemble',
  ['--toc', 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json']);
const sourceFile = `${B}/root/10p/lessons/${id}/lesson.json`;
const source = JSON.parse(fs.readFileSync(sourceFile));
assert.equal(source.id, id);
assert.equal(source.exercise_count, 0);
assert.equal(source.figures.length, 0);
for (const [locale, edition] of [
  ['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en'],
]) native(`d350-n151-${locale}-first-adapt-prepare`, 'adapt-prepare', [
  '--edition', edition, '--lesson', id,
]);
fs.writeFileSync(`${O}/prepared.json`, JSON.stringify({
  stage: 'D350', id, root: `${B}/root`, work: `${B}/source-work`,
  source: bind(sourceFile),
  exercises: bind(`${B}/root/10p/lessons/${id}/exercises.json`),
  proseEntries: source.prose.length, figures: [], originalTasks: 0,
  inheritedNecessarySourcePending: true,
  imagesOpened: 0, paidCalls: 0, sourcePagesAdded: 0, completeCoursesAdded: 0,
}, null, 2) + '\n');
console.log(JSON.stringify({ prepared: bind(`${O}/prepared.json`) }));

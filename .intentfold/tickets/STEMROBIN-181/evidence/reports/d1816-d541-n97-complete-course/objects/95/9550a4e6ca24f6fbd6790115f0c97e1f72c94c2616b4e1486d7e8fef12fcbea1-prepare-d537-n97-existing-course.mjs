import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const H = `${T}/evidence/reports/d1238-current-progress`;
const B = '.tmp/STEMROBIN-181/d1816-d537';
const O = `${T}/tmp/d1816-d537-n97-existing-course`;
const ID = 'phy10-c2-s4-n97';
const raw = `${H}/d1202-n97-first-bilingual-text-author/source-freeze`;
const canonical = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const bind = file => ({ path: file, bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  if (!fs.existsSync(to)) fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(bind(from).sha256, bind(to).sha256);
  return { original: bind(from), copy: bind(to) };
};
const native = (name, action, extra = []) => execFileSync('node', [
  `${T}/tmp/d1816-recovery/run-native.mjs`, name,
  '.claude/skills/ld-s10y-lesson/.venv/bin/python',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', action,
  '--book', '10p', '--root', `${B}/root`, '--work', `${B}/source-work`, ...extra,
], { cwd: repo, stdio: 'inherit' });
assert(!fs.existsSync(O));
const preparation = JSON.parse(fs.readFileSync(
  `${T}/evidence/reports/d1208-current-progress/cards/${ID}/preparation.json`));
assert.equal(bind(`${raw}/lesson.json`).sha256, preparation.rawLesson.sha256);
assert.equal(bind(`${raw}/exercises.json`).sha256, preparation.rawExercises.sha256);
const copies = ['lesson.json', 'exercises.json'].map(name =>
  copy(`${raw}/${name}`, `${B}/root/10p/lessons/${ID}/${name}`));
for (const page of [259, 260, 261, 262])
  for (const name of ['page.md', 'page.json', 'audit.json'])
    copies.push(copy(`${canonical}/pages/${String(page).padStart(4, '0')}/${name}`,
      `${B}/root/10p/pages/${String(page).padStart(4, '0')}/${name}`));
for (const figure of ['fig-223', 'fig-224', 'fig-225'])
  for (const extension of ['png', 'svg']) {
    const from = `${canonical}/figures/${figure}.${extension}`;
    if (fs.existsSync(from)) copies.push(copy(from, `${B}/root/10p/figures/${figure}.${extension}`));
  }
if (!fs.existsSync(`${B}/root/10p/book.json`))
  native('d537-n97-existing-source-reindex', 'reindex',
    ['--toc', 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json']);
const candidateTemplates = [];
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  if (!fs.existsSync(`${B}/source-work/adapt/10p/${edition}/lessons/${ID}/figures.template.json`))
    native(`d537-n97-${locale}-existing-adapt-preparation`, 'adapt-prepare',
      ['--edition', edition, '--lesson', ID]);
  for (const name of ['lesson', 'exercises']) {
    const from = name === 'lesson'
      ? `${H}/d1218-n97-rigid-rod-affected-repair/${locale}/${name}.template.json`
      : `${H}/d1202-n97-first-bilingual-text-author/FIRST/${locale}/${name}.template.json`;
    if (name === 'exercises') {
      const expected = locale === 'zh'
        ? 'ed02c32857222bfb43935afb4442a9497502a8efe82758c9c2b310343f0aaf08'
        : '0d0b4b35fe0ace344ec8bcaeb3fd79dff7df10cd1464e1f82c06197a901a2ab6';
      assert.equal(bind(from).sha256, expected);
    }
    const to = `${B}/source-work/adapt/10p/${edition}/lessons/${ID}/${name}.template.json`;
    const value = JSON.parse(fs.readFileSync(from));
    const beforeEdition = value.edition;
    value.edition = edition;
    fs.writeFileSync(to, JSON.stringify(value, null, 2) + '\n');
    candidateTemplates.push({ original: bind(from), copy: bind(to),
      onlyTransportChange: beforeEdition === edition ? null : { edition: [beforeEdition, edition] },
      reviewedProseExercisesAndSourceSnapshotsUnchanged: true });
  }
}
fs.mkdirSync(O, { recursive: true });
fs.writeFileSync(`${O}/preparation.json`, JSON.stringify({
  course: ID, status: 'EXISTING_APPROVED_TEXT_AND_SOURCE_PREPARED_FIGURE_REVIEW_PENDING',
  root: `${B}/root`, work: `${B}/source-work`, copies, candidateTemplates,
  missingD1218ExerciseAliasResolvedByExactFirstSnapshot: true,
  firstPreparationFailureRetained: `${T}/tmp/d1816-recovery/native/d537-n97-existing-course-preparation/receipt.json`,
  sourcePagesAdded: 0, coursesAdded: 0, sourceOrTextReviewReplayed: false,
  paidCalls: 0, databaseWrites: false, canonicalWrites: false
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ course: ID, restoredExactRawLesson: true,
  sourcePagesReused: 4, bilingualReviewedTemplatesReused: true, figureReview: 'PENDING' }));

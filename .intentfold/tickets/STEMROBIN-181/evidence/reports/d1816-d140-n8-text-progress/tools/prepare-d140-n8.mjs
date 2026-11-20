import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const source = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const root = '.tmp/STEMROBIN-181/d1816-d140/root';
const work = '.tmp/STEMROBIN-181/d1816-d140/work';
const O = `${T}/tmp/d1816-d140-n8-text-author`;
const id = 'phy9-c1-s1-n8';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};
assert(!fs.existsSync(root));
assert(!fs.existsSync(O));
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 136);
assert.equal(meter.currentResume1816.D138.status, 'COMPLETE_OFFLINE_TWO_COURSE_BATCH_COMMITTED_PUSHED');
const evidence = ['source-review-9p-0023-0030.json', 'source-review-9p-0023-0027-corrections.json']
  .map(name => `${T}/evidence/reports/${name}`);
assert.equal(read(evidence[1]).status, 'pass');
const lesson = read(`${source}/lessons/${id}/lesson.json`);
const exercises = read(`${source}/lessons/${id}/exercises.json`);
assert.equal(lesson.id, id);
assert.equal(lesson.exercise_count, 0);
assert.equal(exercises.count, 0);
assert.deepEqual(lesson.prose.filter(row => row.kind === 'fig').map(row => row.id), ['fig-05']);
const reused = evidence.map(bind);
const pages = [...new Set(lesson.prose.flatMap(row => row.source_refs).map(ref => {
  const match = ref.match(/^p(\d+)#/);
  assert(match, ref);
  return Number(match[1]);
}))].sort((a, b) => a - b);
for (const page of pages) {
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const from = `${source}/pages/${String(page).padStart(4, '0')}/${name}`;
    const to = `${root}/9p/pages/${String(page).padStart(4, '0')}/${name}`;
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.symlinkSync(path.resolve(from), to);
    reused.push(bind(from));
  }
}
for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) {
  const from = `${source}/lessons/${id}/${name}`;
  const to = `${root}/9p/lessons/${id}/${name}`;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(bind(from).sha256, bind(to).sha256);
  reused.push(bind(from));
}
for (const suffix of ['png', 'svg']) {
  const from = `${source}/figures/fig-05.${suffix}`;
  const to = `${root}/9p/figures/fig-05.${suffix}`;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.symlinkSync(path.resolve(from), to);
  reused.push(bind(from));
}
const book = read(`${source}/book.json`);
const entry = book.lessons.find(row => row.id === id);
assert(entry);
save(`${root}/9p/book.json`, { ...book, lessons: [entry] });
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  execFileSync(process.execPath, [`${T}/tmp/d1816-recovery/run-native.mjs`,
    `d140-n8-${locale}-first-isolated-prepare`,
    '.claude/skills/ld-s10y-lesson/.venv/bin/python',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'adapt-prepare',
    '--book', '9p', '--edition', edition, '--lesson', id, '--root', root, '--work', work],
  { cwd: repo, stdio: 'inherit' });
}
const prepared = `${O}/prepared.json`;
save(prepared, { batch: 'D140', ticket: 'STEMROBIN-181', lesson: id, book: '9p',
  status: 'FIRST_BILINGUAL_TEXT_CARRIER_PREPARED', root, work, pages, reused,
  originalTasks: 0, modernFigurePending: ['fig-05'], sourceReviewReplayed: false,
  firstIndependentScienceAndLanguageReviewPending: true, sourceFilesChanged: false,
  completeCoursesAdded: 0, imageOpens: 0, canonicalWrites: 0, paidCalls: 0,
  databaseWrites: false, formalHandoff: false });
meter.currentResume1816.D140 = { status: 'FIRST_N8_BILINGUAL_TEXT_AUTHOR_PREPARED',
  prepared: bind(prepared), root, work, originalTasks: 0,
  figuresPending: ['fig-05'], completeCoursesAdded: 0, canonicalPromotions: 0, parentImageOpens: 0 };
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ prepared: bind(prepared), pages, originalTasks: 0,
  figuresPending: 1, imagesOpened: 0, completeCoursesAdded: 0 }));

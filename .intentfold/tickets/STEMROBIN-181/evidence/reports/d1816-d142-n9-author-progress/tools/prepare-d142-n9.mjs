import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const source = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const root = '.tmp/STEMROBIN-181/d1816-d142/root';
const work = '.tmp/STEMROBIN-181/d1816-d142/work';
const O = `${T}/tmp/d1816-d142-n9-text-author`;
const id = 'phy9-c1-s1-n9';
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
assert(!fs.existsSync(`${source}/editions/modern-us-neutral/lessons/${id}`));
assert(!fs.existsSync(`${source}/editions/modern-us-neutral-en/lessons/${id}`));
const lesson = read(`${source}/lessons/${id}/lesson.json`);
assert.equal(lesson.id, id);
assert.equal(lesson.exercise_count, 0);
assert.equal(read(`${source}/lessons/${id}/exercises.json`).count, 0);
const firstReviewPath = `${T}/evidence/reports/source-review-9p-0023-0030.json`;
const correctionsPath = `${T}/evidence/reports/source-review-9p-0023-0027-corrections.json`;
const first = read(firstReviewPath);
const corrections = read(correctionsPath);
assert.equal(corrections.status, 'pass');
const pages = [...new Set(lesson.prose.flatMap(row => row.source_refs).map(ref => {
  const match = ref.match(/^p(\d+)#/);
  assert(match, ref);
  return Number(match[1]);
}))].sort((a, b) => a - b);
assert.deepEqual(pages, [26, 27, 28, 29, 30]);
const reused = [bind(firstReviewPath), bind(correctionsPath)];
for (const page of pages) {
  if (!first.summary.source_pages_pass.includes(page)) {
    assert(first.summary.source_pages_revise.includes(page));
    const correction = corrections.corrections.find(row => row.pdf_page === page);
    assert(correction && correction.status === 'pass');
    assert.equal(bind(correction.md_path).sha256, correction.md_sha256);
  }
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
const figures = lesson.prose.filter(row => row.kind === 'fig').map(row => row.id);
assert.equal(figures.length, 10);
for (const figure of figures) {
  for (const suffix of ['png', 'svg']) {
    const from = `${source}/figures/${figure}.${suffix}`;
    const to = `${root}/9p/figures/${figure}.${suffix}`;
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.symlinkSync(path.resolve(from), to);
    reused.push(bind(from));
  }
}
const book = read(`${source}/book.json`);
const entry = book.lessons.find(row => row.id === id);
assert(entry);
save(`${root}/9p/book.json`, { ...book, lessons: [entry] });
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  execFileSync(process.execPath, [`${T}/tmp/d1816-recovery/run-native.mjs`,
    `d142-n9-${locale}-first-isolated-prepare`,
    '.claude/skills/ld-s10y-lesson/.venv/bin/python',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'adapt-prepare',
    '--book', '9p', '--edition', edition, '--lesson', id, '--root', root, '--work', work],
  { cwd: repo, stdio: 'inherit' });
}
const prepared = `${O}/prepared.json`;
save(prepared, {
  batch: 'D142', ticket: 'STEMROBIN-181', book: '9p', lesson: id,
  status: 'FIRST_N9_BILINGUAL_TEXT_PREPARED_FIGURES_NOT_AUTHORED',
  root, work, pages, reused, originalTasks: 0, modernFiguresPending: figures,
  sourceReviewReplayed: false, sourceBlocks: lesson.prose.length,
  sourceFilesChanged: false, parentImageOpens: 0, authorImagesAuthorized: 0,
  independentScienceAndLanguageReviewPending: true, historicalIdentity: 'Yakov I. Frenkel',
  portraitGenerationAuthorized: false, paidCalls: 0, canonicalWrites: 0,
  completeCoursesAdded: 0, databaseWrites: false, productAcceptance: false, formalHandoff: false,
});
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
meter.currentResume1816.D142 = {
  status: 'FIRST_N9_BILINGUAL_TEXT_PREPARED', prepared: bind(prepared),
  root, work, originalTasks: 0, figuresPending: figures,
  imagesAuthorized: 0, completeCoursesAdded: 0, canonicalPromotions: 0,
};
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ prepared: bind(prepared), sourceBlocks: lesson.prose.length,
  figuresPending: figures.length, imagesOpened: 0, completeCoursesAdded: 0 }));

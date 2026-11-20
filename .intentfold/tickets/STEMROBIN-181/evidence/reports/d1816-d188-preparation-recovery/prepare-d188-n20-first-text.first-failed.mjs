import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const source = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const root = '.tmp/STEMROBIN-181/d1816-d188/root';
const work = '.tmp/STEMROBIN-181/d1816-d188/work';
const O = `${T}/tmp/d1816-d188-n20-text-author`;
const id = 'phy10-c1-s3-n20';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
  return bind(file);
};
assert(!fs.existsSync(root));
assert(!fs.existsSync(O));
for (const edition of ['modern-us-neutral', 'modern-us-neutral-en']) {
  assert(!fs.existsSync(`${source}/editions/${edition}/lessons/${id}`));
}
const lesson = read(`${source}/lessons/${id}/lesson.json`);
const exercises = read(`${source}/lessons/${id}/exercises.json`);
assert.equal(lesson.exercise_count, 4);
assert.equal(exercises.count, 4);
assert.equal(lesson.prose.length, 22);
const evidence = [
  `${T}/evidence/reports/source-review-10p-0052-0055.json`,
  `${T}/evidence/reports/source-review-10p-0052-0055-repair.json`,
  `${T}/evidence/reports/source-review-10p-0052-0055-crops.json`,
  `${T}/evidence/reports/source-review-10p-0056-0059.json`,
  `${T}/evidence/reports/source-review-10p-0056-0059-padding-repair.json`,
  `${T}/evidence/reports/source-review-10p-0056-0059-finalization-trace.json`,
];
const reports = evidence.map(read);
assert.equal(reports[2].status, 'pass');
assert.equal(reports[4].status, 'pass');
assert.equal(reports[5].status, 'pass');
const currentBindings = [];
const verify = (file, expected) => {
  const current = bind(file);
  assert.equal(current.sha256, expected, file);
  currentBindings.push(current);
  return current;
};
const sourcePassComposition = [];
for (const [page, archive] of [
  [54, `${T}/evidence/author-history/d021/raw/d5061d91865c-c14ba32e7bf25dd1-0054.page.json`],
  [55, `${T}/evidence/author-history/d021/raw/56044eda0ad1-6aef77cbf9e1ecc5-0055.page.json`],
]) {
  const sourceRow = reports[2].pages.find(row => row.pdf_page === page);
  assert.equal(sourceRow.status, 'pass');
  const currentFile = `${source}/pages/${String(page).padStart(4, '0')}/page.json`;
  const current = read(currentFile);
  assert.equal(current.meta.render.sha256, sourceRow.source.sha256);
  sourcePassComposition.push({
    page, reports: evidence.slice(0, 3).map(bind),
    archivedFinalizedPage: bind(archive),
    currentPage: verify(currentFile, bind(archive).sha256),
    scope: 'Existing source/boundary PASS and exact crop PASS inherited. Finalized structured page equals retained D021 bytes; no source review or finalizer replay.',
  });
}
for (const page of [56, 57, 58]) {
  const row = reports[5].pages.find(item => item.pdf_page === page);
  sourcePassComposition.push({
    page, reports: evidence.slice(3).map(bind),
    bindings: ['page_md', 'page_json', 'audit'].map(key =>
      verify(`${source}/pages/${String(page).padStart(4, '0')}/${{
        page_md: 'page.md', page_json: 'page.json', audit: 'audit.json',
      }[key]}`, row[key].sha256)),
    scope: 'Full SOURCE and affected fig32 padding PASS composed with retained finalization; no stage replay.',
  });
}
assert.deepEqual(lesson.prose.at(-1).source_refs, ['p0057#5']);
assert.deepEqual(exercises.exercises.at(-1).pages, ['p0058#2']);
assert.equal(read(`${source}/pages/0058/page.json`).blocks[2].kind, 'h3');
const pages = [...new Set([
  ...lesson.prose.flatMap(item => item.source_refs),
  ...exercises.exercises.flatMap(item => item.pages),
].map(ref => Number(ref.match(/^p(\d+)#/)[1])))].sort((a, b) => a - b);
assert.deepEqual(pages, [54, 55, 56, 57, 58]);
const reused = evidence.map(bind);
for (const page of pages) {
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const from = `${source}/pages/${String(page).padStart(4, '0')}/${name}`;
    const to = `${root}/10p/pages/${String(page).padStart(4, '0')}/${name}`;
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.symlinkSync(path.resolve(from), to);
    reused.push(bind(from));
  }
}
for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) {
  const from = `${source}/lessons/${id}/${name}`;
  const to = `${root}/10p/lessons/${id}/${name}`;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(bind(from).sha256, bind(to).sha256);
  reused.push(bind(from));
}
const figures = lesson.prose.filter(item => item.kind === 'fig').map(item => item.id);
assert.deepEqual(figures, ['fig-30', 'fig-31']);
for (const figure of figures) {
  for (const suffix of ['png', 'svg']) {
    const from = `${source}/figures/${figure}.${suffix}`;
    const to = `${root}/10p/figures/${figure}.${suffix}`;
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.symlinkSync(path.resolve(from), to);
    reused.push(bind(from));
  }
}
const book = read(`${source}/book.json`);
const entry = book.lessons.find(item => item.id === id);
assert(entry);
save(`${root}/10p/book.json`, { ...book, lessons: [entry] });
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  execFileSync(process.execPath, [
    `${T}/tmp/d1816-recovery/run-native.mjs`, `d188-n20-${locale}-first-isolated-prepare`,
    '.claude/skills/ld-s10y-lesson/.venv/bin/python',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'adapt-prepare',
    '--book', '10p', '--edition', edition, '--lesson', id, '--root', root, '--work', work,
  ], { cwd: repo, stdio: 'inherit' });
}
const prepared = save(`${O}/prepared.json`, {
  batch: 'D188', ticket: 'STEMROBIN-181', book: '10p', lesson: id,
  status: 'FIRST_N20_BILINGUAL_TEXT_PREPARED_FIGURES_NOT_AUTHORED',
  root, work, pages, reused, sourcePassComposition, currentBindings,
  originalTasks: 4, sourceBlocks: 22, modernFiguresPending: figures,
  sourceReviewReplayed: false, sourceFilesChanged: false,
  parentImageOpens: 0, authorImagesAuthorized: 0, firstScienceAndLanguageReviewPending: true,
  sourceScientificLimitsToJudge: [
    'Undamped LC and oscillator analogy use ideal linear elements, constant L and C and negligible resistance.',
    'Charge and current sign convention is consistent with q prime equals i; division by Li is not performed at current zeros, where the resulting equation holds by continuity.',
    'Cosine solution has specified maximum initial charge and zero initial current; phase and minus sign retained.',
    'Damped period statement is restricted to the oscillatory RLC regime; large resistance removes sign-reversing oscillation.',
    'Original four questions remain complete, including pendulum analogy and both series/parallel capacitor cases; do not leak answers into task prose.',
  ],
  noNewErrataRegistrationOrSourceScientificNumberChangesAuthorized: true,
  paidCalls: 0, canonicalWrites: 0, completeCoursesAdded: 0,
  databaseWrites: false, productAcceptance: false, formalHandoff: false,
});
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
assert(!meter.currentResume1816.D188);
meter.currentResume1816.D188 = {
  status: 'FIRST_N20_BILINGUAL_TEXT_PREPARED', prepared, root, work,
  figuresPending: figures, originalTasks: 4, imagesAuthorized: 0,
  completeCoursesAdded: 0, canonicalPromotions: 0,
};
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ prepared, sourceBlocks: 22,
  figuresPending: figures.length, originalTasks: 4, imagesOpened: 0, completeCoursesAdded: 0 }));

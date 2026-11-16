import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { ticket, book, read, bind, verify } from './retain-d016-evidence.mjs';

const work = `${ticket}/tmp`;
const tool = '.claude/skills/ld-s10y-lesson/tools/p2c.py';
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
const run = args => {
  const output = execFileSync(python, args, { encoding: 'utf8' });
  process.stdout.write(output);
  return { command: args, output };
};
const tracePath = `${work}/source-review-9p-0160-0163-finalization-trace.json`;
assert.equal(await fs.access(tracePath).then(() => true, () => false), false);
const initialPath = `${work}/source-review-9p-0160-0163.json`;
const correctionPath = `${work}/source-review-9p-0160-0163-correction.json`;
const initial = await read(initialPath);
const correction = await read(correctionPath);
assert.equal(correction.status, 'pass');
assert.deepEqual(initial.findings.map(item => item.id), ['F1', 'F2']);
const initialBinding = correction.initial_report ?? correction.initialReport;
await verify(initialPath, initialBinding.sha256);
await verify(initial.author_freeze.path, initial.author_freeze.sha256);
const before = [];
for (const card of ['phy9-c1-s7-t4', 'phy9-c2-s1', ...[59, 60, 61, 62, 63].map(n => `phy9-c2-s2-n${n}`)]) {
  for (const name of ['lesson.json', 'exercises.json']) before.push(await bind(`${book}/lessons/${card}/${name}`));
}
const prior64 = await bind(`${book}/lessons/phy9-c2-s2-n64/lesson.json`);
const pages = [];
for (const page of initial.pages) {
  const current = correction.pages.find(item => item.pdf_page === page.pdf_page);
  assert.equal(current.status, 'pass');
  await verify(current.draft.path, current.draft.sha256);
  await verify(page.source.path, page.source.sha256);
  const folder = `${book}/pages/${String(page.pdf_page).padStart(4, '0')}`;
  await fs.mkdir(folder);
  await fs.copyFile(current.draft.path, `${folder}/page.md`, fs.constants.COPYFILE_EXCL);
  const finalization = run([tool, 'finalize', '--book', '9p', '--page', String(page.pdf_page)]);
  const audit = await read(`${folder}/audit.json`);
  assert.deepEqual(audit.errors, []);
  assert.equal(audit.lines_md, page.independent_printed_lines_including_footer);
  assert.equal(audit.lines_printed, audit.lines_md);
  const figures = [];
  for (const figure of initial.figures.filter(item => item.pdf_page === page.pdf_page)) {
    const image = `.tmp/ld-s10y-lesson/9p/pages/${String(page.pdf_page).padStart(4, '0')}/figures/${figure.id}.png`;
    await verify(image, figure.candidate_sha256);
    figures.push({
      id: figure.id, croppedImage: await bind(image),
      independentCandidate: { path: figure.candidate_path, sha256: figure.candidate_sha256 },
    });
  }
  const vectorization = figures.length ? run([tool, 'vectorize', '--book', '9p', '--page', String(page.pdf_page)]) : null;
  pages.push({
    pdfPage: page.pdf_page, source: page.source, draft: current.draft,
    finalization, vectorization, figures, pageMd: await bind(`${folder}/page.md`),
    pageJson: await bind(`${folder}/page.json`), audit: await bind(`${folder}/audit.json`),
  });
}
const assembly = run([tool, 'assemble', '--book', '9p',
  '--toc', 'ssot-resources/soviet10year-textbooks/toc/9p/zh.json']);
for (const binding of before) await verify(binding.path, binding.sha256);
const n64 = await read(`${book}/lessons/phy9-c2-s2-n64/exercises.json`);
const t7 = await read(`${book}/lessons/phy9-c2-s2-t7/exercises.json`);
assert.equal(n64.exercises.length, 0);
assert.equal(t7.exercises.length, 11);
assert.deepEqual(t7.exercises.map(item => item.number), Array.from({ length: 11 }, (_, i) => String(i + 1)));
await fs.writeFile(tracePath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'pass', initialReview: await bind(initialPath),
  affectedCorrectionReview: await bind(correctionPath), pages,
  assembly: { ...assembly, book: await bind(`${book}/book.json`) },
  unchangedPreviousSources: before, prior64,
  currentSourceIndex: await read(`${book}/book.json`),
  boundaries: '64 prose closes161 before independent exercise9; t7 contains11 original tasks and closes162.65 starts162 and remains provisional pending its next source boundary.',
  limits: 'Unique source gate and its sole two-location correction consumed. Native finalize160-163/vectorize160,163/assemble once. No repeated source/SCI/figure gate, browser, full-project checks or production write.',
}, null, 2)}\n`, { flag: 'wx' });

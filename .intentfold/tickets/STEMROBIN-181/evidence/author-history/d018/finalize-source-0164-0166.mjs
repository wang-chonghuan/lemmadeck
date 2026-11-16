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
const tracePath = `${work}/source-review-9p-0164-0166-finalization-trace.json`;
assert.equal(await fs.access(tracePath).then(() => true, () => false), false);
const reportPath = `${work}/source-review-9p-0164-0167.json`;
const report = await read(reportPath);
assert.equal(report.status, 'blocked');
assert.equal(report.pages.find(page => page.pdf_page === 167).status, 'blocked');
assert.deepEqual(report.pages.filter(page => page.status === 'pass').map(page => page.pdf_page), [164, 165, 166]);
await verify(report.author_freeze.path, report.author_freeze.sha256);
const before = [];
for (const card of ['phy9-c1-s7-t4', 'phy9-c2-s1', 'phy9-c2-s2-t7', ...[59, 60, 61, 62, 63, 64].map(n => `phy9-c2-s2-n${n}`)]) {
  for (const name of ['lesson.json', 'exercises.json']) before.push(await bind(`${book}/lessons/${card}/${name}`));
}
const beforeDirectory = `${work}/d018-native-before`;
await fs.mkdir(beforeDirectory, { recursive: true });
const prior65Path = `${beforeDirectory}/source65-before164.lesson.json`;
await fs.copyFile(`${book}/lessons/phy9-c2-s2-n65/lesson.json`, prior65Path, fs.constants.COPYFILE_EXCL);
const pages = [];
for (const page of report.pages.filter(page => page.status === 'pass')) {
  await verify(page.draft.path, page.draft.sha256);
  await verify(page.source.path, page.source.sha256);
  const folder = `${book}/pages/${String(page.pdf_page).padStart(4, '0')}`;
  await fs.mkdir(folder);
  await fs.copyFile(page.draft.path, `${folder}/page.md`, fs.constants.COPYFILE_EXCL);
  const finalization = run([tool, 'finalize', '--book', '9p', '--page', String(page.pdf_page)]);
  const audit = await read(`${folder}/audit.json`);
  assert.deepEqual(audit.errors, []);
  assert.equal(audit.lines_md, page.independent_printed_lines_including_footer);
  assert.equal(audit.lines_printed, audit.lines_md);
  const figures = [];
  for (const figure of report.figures.filter(item => item.pdf_page === page.pdf_page)) {
    const image = `.tmp/ld-s10y-lesson/9p/pages/${String(page.pdf_page).padStart(4, '0')}/figures/${figure.id}.png`;
    await verify(image, figure.candidate_sha256);
    figures.push({
      id: figure.id, croppedImage: await bind(image),
      independentCandidate: { path: figure.candidate_path, sha256: figure.candidate_sha256 },
    });
  }
  const vectorization = figures.length ? run([tool, 'vectorize', '--book', '9p', '--page', String(page.pdf_page)]) : null;
  pages.push({
    pdfPage: page.pdf_page, source: page.source, draft: page.draft,
    finalization, vectorization, figures, pageMd: await bind(`${folder}/page.md`),
    pageJson: await bind(`${folder}/page.json`), audit: await bind(`${folder}/audit.json`),
  });
}
const assembly = run([tool, 'assemble', '--book', '9p',
  '--toc', 'ssot-resources/soviet10year-textbooks/toc/9p/zh.json']);
for (const binding of before) await verify(binding.path, binding.sha256);
assert.equal((await read(`${book}/lessons/phy9-c2-s2-n65/exercises.json`)).exercises.length, 0);
assert.equal(await fs.access(`${book}/pages/0167/page.json`).then(() => true, () => false), false);
await fs.writeFile(tracePath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'pass-approved-prefix-only',
  originalReport: await bind(reportPath), pages,
  assembly: { ...assembly, book: await bind(`${book}/book.json`) },
  unchangedPreviousSources: before, prior65: await bind(prior65Path),
  currentSourceIndex: await read(`${book}/book.json`),
  excludedPage: report.pages.find(page => page.pdf_page === 167),
  boundaries: '65 closes164 before66 starts165.66 is provisional through166;167 unconfirmed footnote separator not integrated.',
  limits: 'Only the independently passed164-166 prefix finalized/vectorized/assembled once. Original four-page report remains blocked. No repeat or guessed separator, new gate, modern finalization, browser, full-project check or production write.',
}, null, 2)}\n`, { flag: 'wx' });

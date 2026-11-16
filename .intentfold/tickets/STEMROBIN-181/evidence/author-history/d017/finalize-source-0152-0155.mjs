import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const root = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const tool = '.claude/skills/ld-s10y-lesson/tools/p2c.py';
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
const read = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const bind = async path => ({
  path, sha256: crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex'),
});
const run = args => {
  const output = execFileSync(python, args, { encoding: 'utf8' });
  process.stdout.write(output);
  return { command: args, output };
};
const initialPath = `${work}/source-review-9p-0152-0155.json`;
const correctionPath = `${work}/source-review-9p-0152-0155-correction.json`;
const initial = await read(initialPath);
const correction = await read(correctionPath);
assert.equal(correction.status, 'pass');
assert.equal(initial.findings.length, 1);
assert.equal((await bind(initialPath)).sha256, correction.initial_report.sha256);
assert.equal((await bind(correction.initial_author_freeze.path)).sha256, correction.initial_author_freeze.sha256);
const before = [];
for (const card of ['phy9-c1-s6-n54', 'phy9-c1-s6-t8', 'phy9-c1-s7-n55',
  'phy9-c1-s7-n56', 'phy9-c1-s7-n57', 'phy9-c1-s7-t4', 'phy9-c2-s1', 'phy9-c2-s2-n59']) {
  for (const name of ['lesson.json', 'exercises.json']) before.push(await bind(`${root}/lessons/${card}/${name}`));
}
const pages = [];
for (const page of initial.pages) {
  const currentPage = correction.pages.find(item => item.pdf_page === page.pdf_page);
  assert.ok(currentPage);
  assert.equal(currentPage.status, 'pass');
  const currentDraft = currentPage.draft;
  assert.equal((await bind(currentDraft.path)).sha256, currentDraft.sha256);
  assert.equal((await bind(page.source.path)).sha256, page.source.sha256);
  const folder = `${root}/pages/${String(page.pdf_page).padStart(4, '0')}`;
  await fs.mkdir(folder);
  await fs.copyFile(currentDraft.path, `${folder}/page.md`, fs.constants.COPYFILE_EXCL);
  const finalization = run([tool, 'finalize', '--book', '9p', '--page', String(page.pdf_page)]);
  const audit = await read(`${folder}/audit.json`);
  assert.deepEqual(audit.errors, []);
  assert.equal(audit.lines_md, page.independent_printed_lines_including_footer);
  assert.equal(audit.lines_printed, audit.lines_md);
  const figures = [];
  for (const figure of initial.figures.filter(item => item.pdf_page === page.pdf_page)) {
    const image = `.tmp/ld-s10y-lesson/9p/pages/${String(page.pdf_page).padStart(4, '0')}/figures/${figure.id}.png`;
    assert.equal((await bind(image)).sha256, figure.candidate_sha256);
    figures.push({
      id: figure.id, croppedImage: await bind(image),
      independentCandidate: { path: figure.candidate_path, sha256: figure.candidate_sha256 },
    });
  }
  const vectorization = figures.length ? run([tool, 'vectorize', '--book', '9p', '--page', String(page.pdf_page)]) : null;
  pages.push({
    pdfPage: page.pdf_page, source: page.source, draft: currentDraft,
    finalization, vectorization, figures,
    pageMd: await bind(`${folder}/page.md`), pageJson: await bind(`${folder}/page.json`),
    audit: await bind(`${folder}/audit.json`),
  });
}
const assembly = run([tool, 'assemble', '--book', '9p',
  '--toc', 'ssot-resources/soviet10year-textbooks/toc/9p/zh.json']);
for (const binding of before) assert.deepEqual(await bind(binding.path), binding);
await fs.writeFile(`${work}/source-review-9p-0152-0155-finalization-trace.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'pass', initialReview: await bind(initialPath),
  affectedCorrectionReview: await bind(correctionPath), pages,
  assembly: { ...assembly, book: await bind(`${root}/book.json`) },
  unchangedPreviousSources: before, currentSourceIndex: await read(`${root}/book.json`),
  boundaries: '152 closes60 and fully contains61.62 closes155;63 outgoing155. No original written tasks added.',
  limits: 'Consumed existing first gate and one emphasis-only correction. Native finalize/vectorize only152-155 and one assembly; prior source bytes unchanged. No repeated gate, browser, full-project checks or production write.',
}, null, 2) + '\n', { flag: 'wx' });

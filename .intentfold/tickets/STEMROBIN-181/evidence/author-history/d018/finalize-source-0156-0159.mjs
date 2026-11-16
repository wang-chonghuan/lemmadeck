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
const meter = await read(`${ticket}/production-meter.json`);
assert.equal(meter.deliveryBatches.find(item => item.id === 'D-017').status, 'complete-committed-pushed');
const initialPath = `${work}/source-review-9p-0156-0159.json`;
const correctionPath = `${work}/source-review-9p-0156-0159-correction.json`;
const initial = await read(initialPath);
const correction = await read(correctionPath);
assert.equal(correction.status, 'pass');
assert.equal(initial.findings.length, 2);
await verify(initialPath, correction.initial_report.sha256);
await verify(correction.initial_author_freeze.path, correction.initial_author_freeze.sha256);
const before = [];
for (const card of ['phy9-c1-s7-t4', 'phy9-c2-s1', ...[59, 60, 61, 62].map(n => `phy9-c2-s2-n${n}`)]) {
  for (const name of ['lesson.json', 'exercises.json']) before.push(await bind(`${book}/lessons/${card}/${name}`));
}
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
  for (const figure of correction.figures.filter(item => item.pdf_page === page.pdf_page)) {
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
await fs.writeFile(`${work}/source-review-9p-0156-0159-finalization-trace.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'pass', initialReview: await bind(initialPath),
  affectedCorrectionReview: await bind(correctionPath), pages,
  assembly: { ...assembly, book: await bind(`${book}/book.json`) },
  unchangedPreviousSources: before, currentSourceIndex: await read(`${book}/book.json`),
  boundaries: '63 closes157;64 starts158 and is outgoing159 in worked example3. All three worked examples stay prose, zero original tasks added.',
  limits: 'Consumed the unique initial gate and one emphasis-only correction. Native finalize156-159/vectorize159/assemble once; no repeated source/SCI/figure gate, browser, full-project checks or production write.',
}, null, 2)}\n`, { flag: 'wx' });

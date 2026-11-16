import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const root = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const tool = '.claude/skills/ld-s10y-lesson/tools/p2c.py';
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
const read = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const bind = async file => ({
  path: file, sha256: crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex'),
});
const run = args => {
  const output = execFileSync(python, args, { encoding: 'utf8' });
  process.stdout.write(output);
  return { command: args, output };
};
const reportPath = `${work}/source-review-9p-0148-0151-correction.json`;
const report = await read(reportPath);
assert.equal(report.status, 'pass');
assert.deepEqual(await bind(report.prior_initial_report.path), {
  path: report.prior_initial_report.path, sha256: report.prior_initial_report.sha256,
});
const toolCorrection = report.resolutions.find(item => item.id === 'F2');
assert.deepEqual(await bind(toolCorrection.tool_current.path), toolCorrection.tool_current);
const before = [];
for (const id of ['phy9-c1-s6-n54', 'phy9-c1-s6-t8', 'phy9-c1-s7-n55',
  'phy9-c1-s7-n56', 'phy9-c1-s7-n57', 'phy9-c1-s7-t4', 'phy9-c2-s1']) {
  for (const name of ['lesson.json', 'exercises.json']) before.push(await bind(`${root}/lessons/${id}/${name}`));
}
const pages = [];
for (const page of report.pages) {
  assert.equal(page.status, 'pass');
  assert.deepEqual(await bind(page.source.path), page.source);
  assert.deepEqual(await bind(page.draft.path), page.draft);
  const folder = `${root}/pages/${String(page.pdf_page).padStart(4, '0')}`;
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
    assert.equal((await bind(image)).sha256, figure.candidate_sha256);
    figures.push({
      id: figure.id, croppedImage: await bind(image),
      independentCandidate: { path: figure.candidate_path, sha256: figure.candidate_sha256 },
    });
  }
  const vectorization = figures.length ? run([tool, 'vectorize', '--book', '9p', '--page', String(page.pdf_page)]) : null;
  pages.push({
    pdfPage: page.pdf_page, source: page.source, draft: page.draft, finalization, vectorization, figures,
    pageMd: await bind(`${folder}/page.md`), pageJson: await bind(`${folder}/page.json`),
    audit: await bind(`${folder}/audit.json`),
  });
}
const assembly = run([tool, 'assemble', '--book', '9p',
  '--toc', 'ssot-resources/soviet10year-textbooks/toc/9p/zh.json']);
for (const binding of before) assert.deepEqual(await bind(binding.path), binding);
const book = await read(`${root}/book.json`);
await fs.writeFile(`${work}/source-review-9p-0148-0151-finalization-trace.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'pass', initialReview: report.prior_initial_report,
  affectedCorrectionReview: await bind(reportPath), focusedToolCorrection: toolCorrection.tool_current,
  pages, assembly: { ...assembly, book: await bind(`${root}/book.json`) },
  unchangedPreviousSources: before, currentSourceIndex: book,
  boundaries: '59 closes on149;60 begins149 and remains outgoing-open at151. Original erroneous原子数 remains faithful. Modern source105 interface ambiguity remains nonblocking source-ink limit, not a guessed particle/arrow inventory.',
  limits: 'Consumed existing initial and affected-only source gates; native finalization/vectorization only148-151 and one assembly. No independent gate repeated, app/dependency/Charter change, browser, full-project checks or production write.',
}, null, 2) + '\n', { flag: 'wx' });

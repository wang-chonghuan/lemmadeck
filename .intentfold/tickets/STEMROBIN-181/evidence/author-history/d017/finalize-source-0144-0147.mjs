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
const meter = await read('.intentfold/tickets/STEMROBIN-181/production-meter.json');
assert.equal(meter.deliveryBatches.find(batch => batch.id === 'D-016').status, 'complete-committed-pushed',
  'Finish D016 commit/push before changing the next source checkpoint');
const reviewPath = `${work}/source-review-9p-0144-0147.json`;
const review = await read(reviewPath);
assert.equal(review.status, 'pass');
assert.equal((await bind(review.author_freeze.path)).sha256, review.author_freeze.sha256);
const before = [];
for (const id of ['phy9-c1-s6-n54', 'phy9-c1-s6-t8', 'phy9-c1-s7-n55', 'phy9-c1-s7-n56', 'phy9-c1-s7-n57']) {
  for (const name of ['lesson.json', 'exercises.json']) before.push(await bind(`${root}/lessons/${id}/${name}`));
}
const pages = [];
for (const page of review.pages) {
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
  for (const figure of review.figures.filter(item => item.pdf_page === page.pdf_page)) {
    const file = `.tmp/ld-s10y-lesson/9p/pages/${String(page.pdf_page).padStart(4, '0')}/figures/${figure.id}.png`;
    assert.equal((await bind(file)).sha256, figure.candidate_sha256);
    figures.push({ id: figure.id, croppedImage: await bind(file),
      independentCandidate: { path: figure.candidate_path, sha256: figure.candidate_sha256 } });
  }
  const vectorization = figures.length ? run([tool, 'vectorize', '--book', '9p', '--page', String(page.pdf_page)]) : null;
  pages.push({
    pdfPage: page.pdf_page, source: page.source, draft: page.draft, finalization, vectorization, figures,
    pageMd: await bind(`${folder}/page.md`), pageJson: await bind(`${folder}/page.json`),
    audit: await bind(`${folder}/audit.json`),
  });
}
const assembly = run([tool, 'assemble', '--book', '9p', '--toc', 'ssot-resources/soviet10year-textbooks/toc/9p/zh.json']);
for (const binding of before) assert.deepEqual(await bind(binding.path), binding);
assert.equal((await read(`${root}/lessons/phy9-c1-s7-t4/exercises.json`)).count, 7);
await fs.writeFile(`${work}/source-review-9p-0144-0147-finalization-trace.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'pass', sourceReview: await bind(reviewPath), pages,
  assembly: { ...assembly, book: await bind(`${root}/book.json`) },
  unchangedPreviousSources: before,
  boundaries: 'Exercise8/t4 has7 complete tasks. Source58 closes on146;59 remains outgoing-open at147. Unnumbered Maxwell portrait is original source media, not an approved modern illustration.',
  limits: 'Consumed the one initial independent source gate; native finalization/vectorization only144-147. No source rereview, app/dependency/Charter change, browser, full-project checks or production write.',
}, null, 2) + '\n', { flag: 'wx' });

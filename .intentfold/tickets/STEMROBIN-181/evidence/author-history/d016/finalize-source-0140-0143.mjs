import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const root = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const tool = '.claude/skills/ld-s10y-lesson/tools/p2c.py';
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
const read = async p => JSON.parse(await fs.readFile(p, 'utf8'));
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
const bind = async path => ({ path, sha256: sha(await fs.readFile(path)) });
const run = args => {
  const output = execFileSync(python, args, { encoding: 'utf8' });
  process.stdout.write(output);
  return { command: args, output };
};
const reviewPath = `${work}/source-review-9p-0140-0143-correction.json`;
const review = await read(reviewPath);
assert.equal(review.status, 'pass');
assert.deepEqual(await bind(review.prior_initial_report.path), {
  path: review.prior_initial_report.path, sha256: review.prior_initial_report.sha256,
});
const before = [];
for (const id of ['phy9-c1-s5-t6', 'phy9-c1-s6-n52', 'phy9-c1-s6-n53', 'phy9-c1-s6-n54', 'phy9-c1-s6-t8']) {
  for (const file of ['lesson.json', 'exercises.json']) before.push(await bind(`${root}/lessons/${id}/${file}`));
}
const trace = [];
for (const page of review.pages) {
  assert.deepEqual(await bind(page.source.path), page.source);
  assert.deepEqual(await bind(page.draft.path), page.draft);
  const folder = `${root}/pages/${String(page.pdf_page).padStart(4, '0')}`;
  const copied = await fs.readFile(`${folder}/page.md`, 'utf8');
  const reviewed = await fs.readFile(page.draft.path, 'utf8');
  const body = text => text.split('\n---\n')[1];
  assert.equal(body(copied), body(reviewed), 'Raw printed body changed');
  if (page.pdf_page !== 140) assert.equal(copied, reviewed);
  const finalization = run([tool, 'finalize', '--book', '9p', '--page', String(page.pdf_page)]);
  const audit = await read(`${folder}/audit.json`);
  assert.deepEqual(audit.errors, []);
  assert.equal(audit.lines_md, page.independent_printed_lines_including_footer);
  assert.equal(audit.lines_printed, audit.lines_md);
  const figures = [];
  for (const figure of review.figures.filter(f => f.pdf_page === page.pdf_page)) {
    const scratch = `.tmp/ld-s10y-lesson/9p/pages/${String(page.pdf_page).padStart(4, '0')}/figures/${figure.id}`;
    assert.equal((await bind(`${scratch}.png`)).sha256, figure.candidate_sha256);
    figures.push({ id: figure.id, croppedImage: await bind(`${scratch}.png`),
      independentlyInspectedCandidate: await bind(figure.candidate_path) });
  }
  const vectorization = figures.length
    ? run([tool, 'vectorize', '--book', '9p', '--page', String(page.pdf_page)])
    : null;
  trace.push({
    pdfPage: page.pdf_page, source: page.source, draft: page.draft, finalization, vectorization, figures,
    pageMd: await bind(`${folder}/page.md`), pageJson: await bind(`${folder}/page.json`),
    audit: await bind(`${folder}/audit.json`),
    erratum: page.pdf_page === 140 ? 'One metadata-only reference-length erratum; raw source body equals reviewed body exactly.' : null,
  });
}
const assembly = run([tool, 'assemble', '--book', '9p', '--toc', 'ssot-resources/soviet10year-textbooks/toc/9p/zh.json']);
for (const binding of before) assert.deepEqual(await bind(binding.path), binding);
await fs.writeFile(`${work}/source-review-9p-0140-0143-finalization-trace.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'pass',
  initialSourceGate: await bind(review.prior_initial_report.path), correctionGate: await bind(reviewPath),
  pages: trace, assembly: { ...assembly, book: await bind(`${root}/book.json`) },
  unchangedPreviousSources: before,
  boundary: 'n55 closes before56; n56 closes before57; n57 closes before actual exercise8 h3. Exercise8 only two tasks on143, not complete-group delivery.',
  limits: 'One initial source gate and five affected-only text corrections; native source finalization/vectorization restricted140-143. One source-bound erratum preserves raw formula. No repeated crop/source gate, app/dependency/Charter changes, browser, whole-project checks or production write.',
}, null, 2) + '\n', { flag: 'wx' });

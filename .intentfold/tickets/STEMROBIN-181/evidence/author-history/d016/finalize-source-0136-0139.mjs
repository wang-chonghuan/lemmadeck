import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const root = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
const tool = '.claude/skills/ld-s10y-lesson/tools/p2c.py';
const bind = async path => ({
  path, sha256: crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex'),
});
const read = async path => JSON.parse(await fs.readFile(path, 'utf8'));
const run = command => {
  const output = execFileSync(python, command, { encoding: 'utf8' });
  process.stdout.write(output);
  return { command, output };
};
const reviewPath = `${work}/source-review-9p-0136-0139.json`;
const review = await read(reviewPath);
assert.equal(review.status, 'pass');
assert.equal((await bind(reviewPath)).sha256, 'ea2f11e7e6d0470448c52c77c98e12e9f482328dc40f13ccb0aba522a3eb4bc6');
assert.deepEqual(await bind(review.author_freeze.path), review.author_freeze);
const before = [];
for (const id of ['phy9-c1-s6-n50', 'phy9-c1-s6-n51', 'phy9-c1-s6-n52', 'phy9-c1-s6-n53', 'phy9-c1-s5-t6']) {
  for (const file of ['lesson.json', 'exercises.json']) before.push(await bind(`${root}/lessons/${id}/${file}`));
}
const trace = [];
for (const page of review.pages) {
  assert.equal(page.status, 'pass');
  assert.deepEqual(await bind(page.source.path), page.source);
  assert.deepEqual(await bind(page.draft.path), page.draft);
  const folder = `${root}/pages/${String(page.pdf_page).padStart(4, '0')}`;
  await fs.mkdir(folder, { recursive: false });
  await fs.copyFile(page.draft.path, `${folder}/page.md`, fs.constants.COPYFILE_EXCL);
  const finalization = run([tool, 'finalize', '--book', '9p', '--page', String(page.pdf_page)]);
  const audit = await read(`${folder}/audit.json`);
  assert.deepEqual(audit.errors, []);
  assert.equal(audit.lines_md, page.independent_printed_lines_including_footer);
  assert.equal(audit.lines_printed, audit.lines_md);
  const crops = [];
  for (const figure of review.figures.filter(f => f.pdf_page === page.pdf_page)) {
    assert.equal(figure.status, 'pass');
    const generated = `.tmp/ld-s10y-lesson/9p/pages/${String(page.pdf_page).padStart(4, '0')}/figures/${figure.id}.png`;
    const binding = await bind(generated);
    assert.equal(binding.sha256, figure.candidate_sha256);
    crops.push({ id: figure.id, generated: binding, alreadyInspected: await bind(figure.candidate_path) });
  }
  const vectorization = crops.length
    ? run([tool, 'vectorize', '--book', '9p', '--page', String(page.pdf_page)])
    : null;
  trace.push({
    page: page.pdf_page, finalization, vectorization, crops,
    draft: page.draft, source: page.source,
    pageMd: await bind(`${folder}/page.md`),
    pageJson: await bind(`${folder}/page.json`),
    audit: await bind(`${folder}/audit.json`),
  });
}
const assembly = run([tool, 'assemble', '--book', '9p', '--toc', 'ssot-resources/soviet10year-textbooks/toc/9p/zh.json']);
for (const binding of before) assert.deepEqual(await bind(binding.path), binding);
const n54Tasks = await read(`${root}/lessons/phy9-c1-s6-n54/exercises.json`);
const t7Tasks = await read(`${root}/lessons/phy9-c1-s6-t7/exercises.json`);
assert.equal(n54Tasks.exercises.length, 0);
assert.equal(t7Tasks.exercises.length, 11);
await fs.writeFile(`${work}/source-review-9p-0136-0139-finalization-trace.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'pass',
  sourceReview: await bind(reviewPath), pages: trace,
  assembly: { ...assembly, book: await bind(`${root}/book.json`) },
  unchangedPreviouslyBoundSources: before,
  figures: 'Seven new source crops are byte-identical to already independently inspected candidates. Native vectorization only on137-139; no old-page vectorization or repeated crop gate.',
  boundary: 'Exercise7 closes11 tasks and naturally splits from n54, which now has zero tasks. Source n55 is not yet claimed complete.',
  limits: 'Consumed existing independent source gate and executed native finalization/vectorization/assembly. No source rereview, browser, full-project checks, app/dependency/Charter or production writes.',
}, null, 2) + '\n', { flag: 'wx' });

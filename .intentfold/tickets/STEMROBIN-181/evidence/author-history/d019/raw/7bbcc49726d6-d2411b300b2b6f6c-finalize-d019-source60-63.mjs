import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { ticket, read, bind, verify, immutableWrite } from './retain-d016-evidence.mjs';

const work = `${ticket}/tmp`;
const book = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const correctionPath = `${work}/source-review-10p-0060-0063-correction.json`;
const tracePath = `${work}/source-review-10p-0060-0063-finalization-trace.json`;
assert.equal(await fs.access(tracePath).then(() => true, () => false), false);
const correction = await read(correctionPath);
assert.equal(correction.status, 'pass');
await verify(correction.initial_review.path, correction.initial_review.sha256);
const original = await read(correction.initial_review.path);
assert.equal(original.status, 'revise');
assert.deepEqual(correction.pages.map(page => page.pdf_page), [60, 61, 62, 63]);
const preserved = await Promise.all([
  `${book}/book.json`,
  `${book}/editions/modern-us-neutral/book.json`,
].map(bind));
const tool = '.claude/skills/ld-s10y-lesson/tools/p2c.py';
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
const run = args => {
  const output = execFileSync(python, ['-B', tool, ...args], {
    encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  process.stdout.write(output);
  return { command: args, output };
};
const pages = [];
for (const page of correction.pages) {
  assert.equal(page.status, 'pass');
  const id = String(page.pdf_page).padStart(4, '0');
  const folder = `${book}/pages/${id}`;
  assert.equal(await fs.access(folder).then(() => true, () => false), false);
  await verify(page.draft.path, page.draft.sha256);
  await verify(page.source.path, page.source.sha256);
  await immutableWrite(`${folder}/page.md`, await fs.readFile(page.draft.path));
  const finalization = run(['finalize', '--book', '10p', '--page', String(page.pdf_page)]);
  const audit = await read(`${folder}/audit.json`);
  assert.deepEqual(audit.errors, []);
  assert.equal(audit.lines_md, original.pages.find(item => item.pdf_page === page.pdf_page).actual_rows_including_footer);
  const figures = original.candidate_figures.filter(item => item.page === page.pdf_page);
  for (const figure of figures) {
    assert.equal(figure.status, 'pass');
    await verify(`.tmp/ld-s10y-lesson/10p/pages/${id}/figures/${figure.id}.png`, figure.candidate.sha256);
  }
  const vectorization = figures.length
    ? run(['vectorize', '--book', '10p', '--page', String(page.pdf_page)]) : null;
  pages.push({ page: page.pdf_page, draft: page.draft, source: page.source, finalization,
    vectorization, audit: await bind(`${folder}/audit.json`), pageJson: await bind(`${folder}/page.json`) });
}
for (const item of preserved) await verify(item.path, item.sha256);
await immutableWrite(tracePath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D019', status: 'pass-pages-only-assembly-pending',
  correction: await bind(correctionPath), initialReview: correction.initial_review,
  pages, preservedIndices: preserved,
  assemblyPerformed: false,
  limits: 'Source48-51 crop blockers remain. Native page outputs consumed one initial gate plus one delimiter correction; no incomplete lesson promotion, modern finalization, browser, DB write or full-project checks.',
}, null, 2)}\n`);

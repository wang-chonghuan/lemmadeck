import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { ticket, book, read, bind, verify, bytes, exists, immutableWrite } from './retain-d016-evidence.mjs';

const work = `${ticket}/tmp`;
const reviewPath = `${work}/source-review-9p-0176-0179.json`;
const tracePath = `${work}/source-review-9p-0176-0179-finalization-trace.json`;
assert.ok(!await exists(tracePath), 'New-page finalization already consumed');
const review = await read(reviewPath);
assert.equal(review.status, 'pass');
await verify(review.bindings.authorFreeze.path, review.bindings.authorFreeze.sha256);
const freeze = await read(review.bindings.authorFreeze.path);
assert.equal(freeze.status, 'frozen-pending-unique-independent-source-gate');
assert.deepEqual(freeze.pages.map(page => page.pdf_page), [176, 177, 178, 179]);
for (const binding of [
  freeze.pdf, freeze.skill, freeze.profile, freeze.manifest, freeze.toc,
  freeze.author_notes, freeze.effective_author_check,
  ...freeze.pages.flatMap(page => [page.draft, page.source, page.grid, page.layout,
    ...page.figures.map(figure => figure.candidate)]),
  ...review.detailObservations,
]) await verify(binding.path, binding.sha256);

const priorIndex = await bind(`${book}/book.json`);
const priorSnapshot = `${work}/d019-source-before176/book-${priorIndex.sha256.slice(0, 12)}.json`;
await immutableWrite(priorSnapshot, await bytes(priorIndex.path));
const protectedFiles = [];
for (const card of (await read(priorIndex.path)).lessons) {
  if (card.id === 'phy9-c2-s2-n70') continue;
  for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) {
    protectedFiles.push(await bind(`${book}/lessons/${card.id}/${name}`));
  }
}
const run = args => {
  const output = execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python',
    ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', ...args], {
      encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
    });
  process.stdout.write(output);
  return { command: args, output };
};
const pages = [];
for (const page of freeze.pages) {
  const checked = review.pages.find(item => item.pdfPage === page.pdf_page);
  assert.equal(checked.status, 'pass');
  assert.equal(page.author_visible_rows_including_footer, checked.independentPrintedRows);
  const id = String(page.pdf_page).padStart(4, '0');
  const folder = `${book}/pages/${id}`;
  assert.ok(!await exists(folder), `Preserve existing page: ${id}`);
  await immutableWrite(`${folder}/page.md`, await bytes(page.draft.path));
  const finalization = run(['finalize', '--book', '9p', '--page', String(page.pdf_page)]);
  const audit = await read(`${folder}/audit.json`);
  assert.deepEqual(audit.errors, []);
  assert.equal(audit.lines_md, checked.independentPrintedRows);
  for (const figure of page.figures) {
    assert.equal(review.figures.find(item => item.id === figure.id).status, 'pass');
    await verify(`.tmp/ld-s10y-lesson/9p/pages/${id}/figures/${figure.id}.png`, figure.candidate.sha256);
  }
  const vectorization = page.figures.length
    ? run(['vectorize', '--book', '9p', '--page', String(page.pdf_page)]) : null;
  pages.push({ page: page.pdf_page, finalization, vectorization,
    audit: await bind(`${folder}/audit.json`), pageJson: await bind(`${folder}/page.json`) });
}
const assembly = run(['assemble', '--book', '9p',
  '--toc', 'ssot-resources/soviet10year-textbooks/toc/9p/zh.json']);
for (const binding of protectedFiles) await verify(binding.path, binding.sha256);
assert.ok(!await exists(`${book}/pages/0167/page.json`));
await immutableWrite(tracePath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D019', status: 'pass-approved-pages-only',
  review: await bind(reviewPath), authorFreeze: review.bindings.authorFreeze,
  priorIndex: { ...priorIndex, snapshot: await bind(priorSnapshot) },
  pages, assembly, protectedFiles,
  closedSources: ['phy9-c2-s2-n70', 'phy9-c2-s2-n71'],
  provisionalSource: 'phy9-c2-s2-n72', missing167Excluded: true,
  limits: 'Unique initial source gate consumed once; no modern completion, source re-review, browser, DB or full-project tests.',
}, null, 2)}\n`);

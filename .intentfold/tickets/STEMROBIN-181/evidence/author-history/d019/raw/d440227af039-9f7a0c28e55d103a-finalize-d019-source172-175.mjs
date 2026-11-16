import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { ticket, book, bytes, read, bind, verify, immutableWrite } from './retain-d016-evidence.mjs';

const work = `${ticket}/tmp`;
const correctionPath = `${work}/source-review-9p-0172-0175-correction.json`;
const tracePath = `${work}/source-review-9p-0172-0175-finalization-trace.json`;
assert.equal(await fs.access(tracePath).then(() => true, () => false), false);
const correction = await read(correctionPath);
assert.equal(correction.status, 'pass');
await verify(correction.bindings.initialReview.path, correction.bindings.initialReview.sha256);
const original = await read(correction.bindings.initialReview.path);
assert.equal(original.status, 'revise');
assert.deepEqual(original.pages.map(page => page.pdfPage), [172, 173, 174, 175]);
const priorIndexBinding = await bind(`${book}/book.json`);
const priorIndexSnapshot = `${work}/d019-source-before172/book-${priorIndexBinding.sha256.slice(0, 12)}.json`;
await immutableWrite(priorIndexSnapshot, await bytes(priorIndexBinding.path));
const protectedFiles = [];
for (const card of (await read(`${book}/book.json`)).lessons) {
  if (card.id === 'phy9-c2-s2-n68') continue;
  for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) {
    protectedFiles.push(await bind(`${book}/lessons/${card.id}/${name}`));
  }
}
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
for (const page of original.pages) {
  const corrected = correction.pages.find(item => item.pdfPage === page.pdfPage);
  assert.ok(page.status === 'pass' || corrected?.status === 'pass');
  const draft = corrected?.bindings.current ?? page.bindings.draft;
  const source = corrected?.bindings.source ?? page.bindings.source;
  const id = String(page.pdfPage).padStart(4, '0');
  const folder = `${book}/pages/${id}`;
  assert.equal(await fs.access(folder).then(() => true, () => false), false);
  await verify(draft.path, draft.sha256);
  await verify(source.path, source.sha256);
  await immutableWrite(`${folder}/page.md`, await bytes(draft.path));
  const finalization = run(['finalize', '--book', '9p', '--page', String(page.pdfPage)]);
  const audit = await read(`${folder}/audit.json`);
  assert.deepEqual(audit.errors, []);
  assert.equal(audit.lines_md, page.independentPrintedRows);
  const figures = original.figures.filter(item => item.sourcePage === page.pdfPage);
  for (const figure of figures) {
    assert.equal(figure.status, 'pass');
    await verify(`.tmp/ld-s10y-lesson/9p/pages/${id}/figures/${figure.id}.png`, figure.candidate.sha256);
  }
  const vectorization = figures.length
    ? run(['vectorize', '--book', '9p', '--page', String(page.pdfPage)]) : null;
  pages.push({ page: page.pdfPage, draft, source, finalization, vectorization,
    audit: await bind(`${folder}/audit.json`), pageJson: await bind(`${folder}/page.json`) });
}
const assembly = run(['assemble', '--book', '9p',
  '--toc', 'ssot-resources/soviet10year-textbooks/toc/9p/zh.json']);
for (const item of protectedFiles) await verify(item.path, item.sha256);
assert.equal(await fs.access(`${book}/pages/0167/page.json`).then(() => true, () => false), false);
await immutableWrite(tracePath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D019', status: 'pass-approved-pages-only',
  correction: await bind(correctionPath), initialReview: correction.bindings.initialReview,
  priorIndex: { ...priorIndexBinding, snapshot: await bind(priorIndexSnapshot) },
  pages, assembly, protectedFiles, source66IncompletePage167Excluded: true, source70Provisional: true,
  limits: 'Initial source decisions plus two metadata-only counting corrections consumed once; source67 and earlier closed sources preserved. No modern promotion, new substantive source gate, browser, DB or full-project checks.',
}, null, 2)}\n`);

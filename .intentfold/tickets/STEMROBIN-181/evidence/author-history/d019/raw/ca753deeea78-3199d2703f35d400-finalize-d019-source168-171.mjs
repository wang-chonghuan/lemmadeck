import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { ticket, book, read, bind, verify, immutableWrite } from './retain-d016-evidence.mjs';

const work = `${ticket}/tmp`;
const reviewPath = `${work}/source-review-9p-0168-0171.json`;
const tracePath = `${work}/source-review-9p-0168-0171-finalization-trace.json`;
assert.equal(await fs.access(tracePath).then(() => true, () => false), false);
const report = await read(reviewPath);
assert.equal(report.status, 'pass');
assert.deepEqual(report.pages.map(page => page.pdf_page), [168, 169, 170, 171]);
await verify(report.bindings.author_freeze.path, report.bindings.author_freeze.sha256);
const tool = '.claude/skills/ld-s10y-lesson/tools/p2c.py';
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
const run = args => {
  const output = execFileSync(python, ['-B', tool, ...args], {
    encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  process.stdout.write(output);
  return { command: args, output };
};
const priorIndex = await read(`${book}/book.json`);
const protectedFiles = [];
for (const card of priorIndex.lessons) {
  if (card.id === 'phy9-c2-s2-n66') continue;
  for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) {
    protectedFiles.push(await bind(`${book}/lessons/${card.id}/${name}`));
  }
}
const pages = [];
for (const page of report.pages) {
  assert.equal(page.status, 'pass');
  const id = String(page.pdf_page).padStart(4, '0');
  const folder = `${book}/pages/${id}`;
  assert.equal(await fs.access(folder).then(() => true, () => false), false);
  await verify(page.bindings.draft.path, page.bindings.draft.sha256);
  await verify(page.bindings.source.path, page.bindings.source.sha256);
  await immutableWrite(`${folder}/page.md`, await fs.readFile(page.bindings.draft.path));
  const finalization = run(['finalize', '--book', '9p', '--page', String(page.pdf_page)]);
  const audit = await read(`${folder}/audit.json`);
  assert.deepEqual(audit.errors, []);
  assert.equal(audit.lines_md, page.line_agreement.independent_visible_rows_including_footer);
  const figures = report.figures.filter(item => item.pdf_page === page.pdf_page);
  for (const figure of figures) {
    assert.equal(figure.status, 'pass');
    await verify(`.tmp/ld-s10y-lesson/9p/pages/${id}/figures/${figure.id}.png`, figure.binding.sha256);
  }
  const vectorization = figures.length
    ? run(['vectorize', '--book', '9p', '--page', String(page.pdf_page)]) : null;
  pages.push({ page: page.pdf_page, original: page.bindings, finalization, vectorization,
    audit: await bind(`${folder}/audit.json`), pageJson: await bind(`${folder}/page.json`) });
}
const assembly = run(['assemble', '--book', '9p',
  '--toc', 'ssot-resources/soviet10year-textbooks/toc/9p/zh.json']);
for (const item of protectedFiles) await verify(item.path, item.sha256);
assert.equal(await fs.access(`${book}/pages/0167/page.json`).then(() => true, () => false), false);
const source67 = await read(`${book}/lessons/phy9-c2-s2-n67/lesson.json`);
assert.ok(source67.prose.flatMap(item => item.source_refs).every(ref => Number(ref.slice(1, 5)) >= 168));
await immutableWrite(tracePath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D019', status: 'pass-approved-pages-only',
  originalReport: await bind(reviewPath), pages, assembly, protectedFiles,
  source67: await bind(`${book}/lessons/phy9-c2-s2-n67/lesson.json`),
  source66IncompletePage167Excluded: true,
  source68Provisional: true,
  limits: 'Existing initial source gate consumed once; no original source re-review, modern completion, DB write or full-project check.',
}, null, 2)}\n`);

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { ticket, book, read, bind, verify, bytes, exists, immutableWrite } from './retain-d016-evidence.mjs';

const work = `${ticket}/tmp`;
const tracePath = `${work}/d020-source196-199-finalization.json`;
const reportPath = `${work}/source-review-9p-0196-0199-correction.json`;
const freezePath = `${work}/9p-next-source-0196-0199/author-freeze.json`;
assert.ok(!await exists(tracePath));
await verify(reportPath, '933be721838e7b18999694826413b5c64a481e1220093ef77ee1c9a8dafc7382');
await verify(freezePath, '89d490e90702e380a5640f2389cfd49e04b3841ce289c35b7363e6cb357200b1');
const report = await read(reportPath);
const freeze = await read(freezePath);
assert.equal(report.status, 'pass');
const dependencies = new Set();
async function consume(value) {
  if (!value || typeof value !== 'object') return;
  if (value.path && value.sha256) {
    const key = `${value.path}:${value.sha256}`;
    if (!dependencies.has(key)) {
      await verify(value.path, value.sha256);
      dependencies.add(key);
    }
    return;
  }
  for (const child of Object.values(value)) await consume(child);
}
await consume(report);
await consume(freeze);
const snapshot = `${work}/d020-source-before196/book-${(await bind(`${book}/book.json`)).sha256.slice(0, 12)}.json`;
await immutableWrite(snapshot, await bytes(`${book}/book.json`));
const protectedFiles = [];
for (const card of (await read(snapshot)).lessons) {
  if (['phy9-c2-s2-n75', 'phy9-c2-s2-n77'].includes(card.id)) continue;
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
for (const checked of report.pages) {
  assert.equal(checked.status, 'pass');
  const pdfPage = checked.pdf_page;
  const folder = `${book}/pages/${String(pdfPage).padStart(4, '0')}`;
  const journal = `${work}/d020-source196-199-native-${pdfPage}.json`;
  assert.ok(!await exists(folder));
  assert.ok(!await exists(journal));
  await immutableWrite(`${folder}/page.md`, await bytes(checked.draft.path));
  const finalization = run(['finalize', '--book', '9p', '--page', String(pdfPage)]);
  await immutableWrite(journal, `${JSON.stringify({ pdfPage, finalization }, null, 2)}\n`);
  const audit = await read(`${folder}/audit.json`);
  assert.deepEqual(audit.errors, []);
  assert.equal(audit.lines_md, checked.independent_rows);
  assert.equal(audit.lines_printed, checked.independent_rows);
  const sourcePage = freeze.pages.find(page => page.pdf_page === pdfPage);
  const figures = [];
  for (const original of sourcePage.figures) {
    const approved = report.inheritedFigures.find(figure => figure.id === original.id);
    assert.equal(approved.status, 'pass');
    const nativeCrop = `.tmp/ld-s10y-lesson/9p/pages/${String(pdfPage).padStart(4, '0')}/figures/${original.id}.png`;
    await verify(nativeCrop, approved.candidate.sha256);
    figures.push({ id: original.id, candidate: approved.candidate, nativeCrop: await bind(nativeCrop) });
  }
  const vectorization = figures.length
    ? run(['vectorize', '--book', '9p', '--page', String(pdfPage)]) : null;
  const completed = {
    pdfPage, draft: checked.draft, finalization, vectorization, figures,
    audit: await bind(`${folder}/audit.json`), pageJson: await bind(`${folder}/page.json`),
  };
  await immutableWrite(`${work}/d020-source196-199-complete-${pdfPage}.json`,
    `${JSON.stringify(completed, null, 2)}\n`);
  pages.push(completed);
}
const assembly = run(['assemble', '--book', '9p',
  '--toc', 'ssot-resources/soviet10year-textbooks/toc/9p/zh.json']);
await immutableWrite(`${work}/d020-source196-199-native-assembly.json`,
  `${JSON.stringify({ assembly }, null, 2)}\n`);
for (const binding of protectedFiles) await verify(binding.path, binding.sha256);
for (const page of [167, 187, 193, 194, 195, 200]) {
  assert.ok(!await exists(`${book}/pages/${String(page).padStart(4, '0')}/page.json`));
}
const complete = await read(`${book}/lessons/phy9-c2-s2-n79/lesson.json`);
assert.equal(complete.exercise_count, 0);
assert.equal(complete.figures.length, 0);
const sourcePages = [...new Set(complete.prose.flatMap(block => block.source_refs)
  .map(ref => Number(/^p(\d+)#/.exec(ref)[1])))].sort();
assert.deepEqual(sourcePages, [198, 199]);
await immutableWrite(tracePath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D020', status: 'pass-approved-pages-only',
  sourceReview: await bind(reportPath), authorFreeze: await bind(freezePath),
  priorIndex: { path: `${book}/book.json`, sha256: (await bind(snapshot)).sha256, snapshot: await bind(snapshot) },
  pages, assembly, protectedFiles, closedSources: ['phy9-c2-s2-n79'],
  provisionalSources: ['phy9-c2-s2-n75', 'phy9-c2-s2-n77', 'phy9-c2-s2-n78', 'phy9-c2-s2-n80'],
  missingAndUnresolvedPagesExcluded: [167, 187, 193, 194, 195, 200],
  limits: 'Four new page finalizations, two vectorizations, one assembly. Existing pixel/counter correction gates consumed once. No image reopen, browser, DB or whole-project test.',
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(tracePath)));

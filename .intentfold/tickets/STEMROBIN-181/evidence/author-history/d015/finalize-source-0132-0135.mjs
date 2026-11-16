import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const root = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const bind = async path => ({
  path, sha256: crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex'),
});
const read = async path => JSON.parse(await fs.readFile(path, 'utf8'));
const reviewPath = `${work}/source-review-9p-0132-0135.json`;
const review = await read(reviewPath);
assert.equal(review.status, 'pass');
assert.equal(review.figures.length, 0);
assert.deepEqual(await bind(review.author_freeze.path), review.author_freeze);
const before = [];
for (const id of ['phy9-c1-s6-n50', 'phy9-c1-s6-n51', 'phy9-c1-s6-n52', 'phy9-c1-s5-t6']) {
  before.push(await bind(`${root}/lessons/${id}/lesson.json`));
  before.push(await bind(`${root}/lessons/${id}/exercises.json`));
}
const trace = [];
for (const page of review.pages) {
  assert.equal(page.status, 'pass');
  assert.deepEqual(await bind(page.source.path), page.source);
  assert.deepEqual(await bind(page.draft.path), page.draft);
  const folder = `${root}/pages/${String(page.pdf_page).padStart(4, '0')}`;
  await fs.mkdir(folder, { recursive: false });
  await fs.copyFile(page.draft.path, `${folder}/page.md`, fs.constants.COPYFILE_EXCL);
  const command = [
    '.claude/skills/ld-s10y-lesson/tools/p2c.py',
    'finalize', '--book', '9p', '--page', String(page.pdf_page),
  ];
  const output = execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', command, { encoding: 'utf8' });
  process.stdout.write(output);
  const audit = await read(`${folder}/audit.json`);
  assert.deepEqual(audit.errors, []);
  assert.equal(audit.lines_md, page.independent_printed_lines_including_footer);
  assert.equal(audit.lines_printed, audit.lines_md);
  trace.push({
    page: page.pdf_page, command, output,
    draft: page.draft, source: page.source,
    pageMd: await bind(`${folder}/page.md`),
    pageJson: await bind(`${folder}/page.json`),
    audit: await bind(`${folder}/audit.json`),
  });
}
const assemble = [
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'assemble',
  '--book', '9p', '--toc', 'ssot-resources/soviet10year-textbooks/toc/9p/zh.json',
];
const output = execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', assemble, { encoding: 'utf8' });
process.stdout.write(output);
for (const binding of before) assert.deepEqual(await bind(binding.path), binding);
await fs.writeFile(`${work}/source-review-9p-0132-0135-finalization-trace.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'pass',
  sourceReview: await bind(reviewPath), pages: trace,
  assembly: { command: assemble, output, book: await bind(`${root}/book.json`) },
  unchangedCurrentCardSources: before,
  figures: 'No actual new figure in132-135; old fig77 is a reference only. Existing vector assets reused, no repeated vectorization.',
  boundary: 'n53 and n54 source prose closes; exercise7 task5 remains outgoing open. Finalized source is not modern-card delivery.',
  limits: 'Consumed one independent source gate and executed only native finalization/assembly. No source rereview, browser, whole-project checks, app/dependency/Charter or production write.',
}, null, 2) + '\n', { flag: 'wx' });

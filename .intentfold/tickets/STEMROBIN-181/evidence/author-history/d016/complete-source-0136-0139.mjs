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
const reviewPath = `${work}/source-review-9p-0136-0139.json`;
const review = await read(reviewPath);
assert.equal(review.status, 'pass');
const correctionPath = `${work}/source-review-9p-0135-exercise7-heading-correction.json`;
const correction = await read(correctionPath);
assert.equal(correction.status, 'pass');
assert.equal((await bind(correction.bindings.durable_page.path)).sha256, correction.bindings.durable_page.current_sha256);
const mismatch = { 'fig-92': 0.001, 'fig-93': 0.099, 'fig-94': 0, 'fig-95': 0, 'fig-96': 0.007, 'fig-97': 0.544, 'fig-98': 0.009 };
const pages = [];
for (const page of review.pages) {
  assert.deepEqual(await bind(page.source.path), page.source);
  assert.deepEqual(await bind(page.draft.path), page.draft);
  const folder = `${root}/pages/${String(page.pdf_page).padStart(4, '0')}`;
  const audit = await read(`${folder}/audit.json`);
  assert.deepEqual(audit.errors, []);
  assert.equal(audit.lines_md, page.independent_printed_lines_including_footer);
  assert.equal(audit.lines_printed, audit.lines_md);
  const figures = [];
  for (const figure of review.figures.filter(f => f.pdf_page === page.pdf_page)) {
    const scratch = `.tmp/ld-s10y-lesson/9p/pages/${String(page.pdf_page).padStart(4, '0')}/figures/${figure.id}`;
    assert.equal((await bind(`${scratch}.png`)).sha256, figure.candidate_sha256);
    figures.push({
      id: figure.id, croppedImage: await bind(`${scratch}.png`), originalSvg: await bind(`${scratch}.svg`),
      independentlyInspectedCandidate: await bind(figure.candidate_path),
      nativeVectorizationObservedPass: true, observedMismatchPercent: mismatch[figure.id],
    });
  }
  pages.push({
    pdfPage: page.pdf_page, pageMd: await bind(`${folder}/page.md`),
    pageJson: await bind(`${folder}/page.json`), audit: await bind(`${folder}/audit.json`), figures,
    operationEvidence: 'Native finalize and page-filtered vectorize already completed in exec session31430; no rerun. Report recovered after wrong anticipated t7 identity assertion.',
  });
}
const affectedFinalization = run([tool, 'finalize', '--book', '9p', '--page', '135']);
const assembly = run([tool, 'assemble', '--book', '9p', '--toc', 'ssot-resources/soviet10year-textbooks/toc/9p/zh.json']);
const unchanged = [];
for (const id of ['phy9-c1-s6-n50', 'phy9-c1-s6-n51', 'phy9-c1-s6-n52', 'phy9-c1-s6-n53', 'phy9-c1-s5-t6']) {
  for (const file of ['lesson.json', 'exercises.json']) {
    const path = `${root}/lessons/${id}/${file}`;
    assert.equal((await bind(path)).sha256, sha(execFileSync('git', ['show', `HEAD:${path}`])));
    unchanged.push(await bind(path));
  }
}
assert.equal((await read(`${root}/lessons/phy9-c1-s6-n54/exercises.json`)).count, 0);
assert.equal((await read(`${root}/lessons/phy9-c1-s6-t8/exercises.json`)).count, 11);
await fs.writeFile(`${work}/source-review-9p-0136-0139-finalization-trace.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'pass', sourceReview: await bind(reviewPath), pages,
  initialAssemblyObservation: '61 source cards,75 written tasks,98 figures; all11 exercise7 tasks incorrectly attached to n54. Wrong assumed ID t7 assertion failed after native commands completed; no failed source/native operation.',
  affectedHeadingGate: await bind(correctionPath), affectedFinalization,
  assembly: { ...assembly, book: await bind(`${root}/book.json`) },
  unchangedPreviouslyBoundSources: unchanged,
  boundary: 'Actual h3 exercise7 source marker produces authoritative TOC card phy9-c1-s6-t8 with11 complete tasks; n54 has zero tasks. No assembler/index changes. Source n55 not yet claimed complete.',
  limits: 'Initial136-139 source/crop approval reused. Only source135 heading marker finalized after affected-only gate; no other source rerun, browser, full-project test, production or app/dependency/Charter writes.',
}, null, 2) + '\n', { flag: 'wx' });

import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import {
  ticket, book, read, bind, verify, bytes, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

const work = `${ticket}/tmp`;
const tracePath = `${work}/d020-source188-191-finalization.json`;
const reportPath = `${work}/source-review-9p-0188-0191-correction.json`;
const freezePath = `${work}/9p-next-source-0188-0191/author-freeze.json`;
const resume = process.argv.slice(2).join(' ') === '--resume';
assert.ok(resume || process.argv.length === 2);
assert.ok(!await exists(tracePath), 'Native finalization already consumed');
await verify(reportPath, '79c2e299196f82ce90df18e76b26939c0dd100fe1fde6151cb52b45a146d2f27');
const report = await read(reportPath);
assert.equal(report.status, 'pass');
const historicalSkill = {
  path: `${work}/skill-policy-before185/lesson.SKILL.md`,
  sha256: 'fb0640bcc42c532d44b9627e0d2b3f65e3fe38d9cf05301a01fe278813a2b38d',
};
const dependencies = new Map();
async function consumeBindings(value) {
  if (!value || typeof value !== 'object') return;
  if (value.path && value.sha256) {
    const binding = value.path === '.claude/skills/ld-s10y-lesson/SKILL.md'
      && value.sha256 === historicalSkill.sha256 ? historicalSkill : value;
    const key = `${binding.path}:${binding.sha256}`;
    if (!dependencies.has(key)) {
      await verify(binding.path, binding.sha256);
      dependencies.set(key, binding);
    }
    return;
  }
  for (const child of Object.values(value)) await consumeBindings(child);
}
await consumeBindings(report);
const freeze = await read(freezePath);
await consumeBindings(freeze);
const gapEvidencePath = `${work}/merge-page-contiguity-20261116.outcome.json`;
await verify(gapEvidencePath, '0b67068328b4ff49e1ac172c9b6374fe046e9f06bbcc2ea688dc8bd6cef9c026');
const snapshotFolder = `${work}/d020-source-before188`;
const snapshot = resume
  ? `${snapshotFolder}/${(await fs.readdir(snapshotFolder)).find(name => /^book-[a-f0-9]{12}\.json$/.test(name))}`
  : `${snapshotFolder}/book-${(await bind(`${book}/book.json`)).sha256.slice(0, 12)}.json`;
if (!resume) await immutableWrite(snapshot, await bytes(`${book}/book.json`));
const priorIndex = { path: `${book}/book.json`, sha256: (await bind(snapshot)).sha256 };
const protectedFiles = [];
for (const card of (await read(snapshot)).lessons) {
  if (card.id === 'phy9-c2-s2-n75') continue;
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
  const pdfPage = checked.pdf_page;
  assert.ok([188, 189, 190, 191].includes(pdfPage));
  assert.equal(checked.status, 'pass');
  const folder = `${book}/pages/${String(pdfPage).padStart(4, '0')}`;
  const journal = `${work}/d020-source188-191-native-${pdfPage}.json`;
  const completedPath = `${work}/d020-source188-191-complete-${pdfPage}.json`;
  if (resume) {
    const completed = await read(completedPath);
    await consumeBindings(completed);
    assert.deepEqual(completed.draft, checked.draft);
    pages.push(completed);
    continue;
  }
  assert.ok(!await exists(folder), `Preserve existing page:${pdfPage}`);
  assert.ok(!await exists(journal), `Native page step consumed:${pdfPage}`);
  await immutableWrite(`${folder}/page.md`, await bytes(checked.draft.path));
  const finalization = run(['finalize', '--book', '9p', '--page', String(pdfPage)]);
  await immutableWrite(journal, `${JSON.stringify({ pdfPage, finalization }, null, 2)}\n`);
  const audit = await read(`${folder}/audit.json`);
  assert.deepEqual(audit.errors, []);
  assert.equal(audit.lines_md, checked.actual_printed_rows_including_footer_inherited);
  assert.equal(audit.lines_printed, checked.actual_printed_rows_including_footer_inherited);
  const sourcePage = freeze.pages.find(page => page.pdf_page === pdfPage);
  const figures = [];
  for (const original of sourcePage.figures) {
    const approved = original.id === 'fig-140'
      ? report.findings.find(finding => finding.id === 'F3')
      : report.inherited_figures.find(figure => figure.id === original.id);
    assert.ok(approved);
    assert.ok(['pass', 'closed'].includes(approved.status));
    const candidate = approved.candidate;
    const nativeCrop = `.tmp/ld-s10y-lesson/9p/pages/${String(pdfPage).padStart(4, '0')}/figures/${original.id}.png`;
    await verify(nativeCrop, candidate.sha256);
    figures.push({ id: original.id, candidate, nativeCrop: await bind(nativeCrop) });
  }
  const vectorization = figures.length
    ? run(['vectorize', '--book', '9p', '--page', String(pdfPage)]) : null;
  const completed = {
    pdfPage, draft: checked.draft, finalization, vectorization, figures,
    audit: await bind(`${folder}/audit.json`), pageJson: await bind(`${folder}/page.json`),
  };
  await immutableWrite(completedPath,
    `${JSON.stringify(completed, null, 2)}\n`);
  pages.push(completed);
}
const assemblyPath = `${work}/d020-source188-191-native-assembly.json`;
const assembly = resume ? (await read(assemblyPath)).assembly
  : run(['assemble', '--book', '9p',
    '--toc', 'ssot-resources/soviet10year-textbooks/toc/9p/zh.json']);
await immutableWrite(assemblyPath,
  `${JSON.stringify({ assembly }, null, 2)}\n`);
for (const binding of protectedFiles) await verify(binding.path, binding.sha256);
for (const page of [167, 187, 193, 195]) {
  assert.ok(!await exists(`${book}/pages/${String(page).padStart(4, '0')}/page.json`));
}
const complete = await read(`${book}/lessons/phy9-c2-s2-n76/lesson.json`);
assert.equal(complete.exercise_count, 0);
const sourcePages = [...new Set(complete.prose.flatMap(block => block.source_refs)
  .map(ref => Number(/^p(\d+)#/.exec(ref)[1])))].sort();
assert.deepEqual(sourcePages, [188, 189, 190, 191]);
await immutableWrite(tracePath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D020', status: 'pass-approved-pages-only',
  sourceReview: await bind(reportPath), authorFreeze: await bind(freezePath),
  gapFixEvidence: await bind(gapEvidencePath),
  priorIndex: { ...priorIndex, snapshot: await bind(snapshot) },
  pages, assembly, protectedFiles, closedSources: ['phy9-c2-s2-n76'],
  provisionalSources: ['phy9-c2-s2-n75', 'phy9-c2-s2-n77'],
  recovery: resume ? {
    reason: 'Record-only field-shape failure after all native stages passed; source pages derive from prose source_refs, not an absent pages field.',
    reusedNativeSteps: 8, nativeStepsRepeated: 0,
  } : null,
  missingAndUnresolvedPagesExcluded: [167, 187, 193, 195],
  limits: 'Four new native page finalizations, three vectorizations, one assembly. Existing independent source gates consumed, not repeated. No image opened, browser, DB, or full-project tests.',
}, null, 2)}\n`);
console.log(`D020 source188-191 complete: ${tracePath}`);

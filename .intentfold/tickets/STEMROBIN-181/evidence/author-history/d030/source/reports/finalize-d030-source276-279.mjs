import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import {
  ticket, absolute, read, bind, verify, exists, immutableWrite, bytes,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const folder = `${ticket}/tmp/d030-source276-279-native`;
const reviewPath = `${ticket}/tmp/d030-source276-279-affected-review.json`;
const review = await read(reviewPath);
assert.equal(review.status, 'SOURCE-PASS');
assert.deepEqual(review.effectivePassPages, [276, 277, 278, 279]);
assert.deepEqual(review.effectiveFailPages, []);
const book = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const selections = review.pages.map(row => {
  assert.equal(row.sourceApproval, true);
  assert.equal(row.status, 'PASS');
  return {
    page: row.pdfPage, candidate: row.candidate, source: row.source,
    expectedRows: row.candidateRows, expectedFigures: row.figures.map(figure => figure.id),
  };
});
assert.ok(!await exists(`${folder}/started.json`));
const protectedFiles = await Promise.all([
  `${book}/book.json`, `${book}/editions/modern-us-neutral/book.json`,
  ...['lesson.json', 'lesson.md', 'exercises.json'].map(name =>
    `${book}/lessons/phy9-c2-s4-n107/${name}`),
  `${ticket}/production-meter.json`, `${ticket}/evidence/index.json`,
  `${ticket}/tmp/d030-source276-279-author/author-freeze.json`,
].map(bind));
for (const selection of selections) {
  await verify(selection.candidate.path, selection.candidate.sha256);
  await verify(selection.source.path, selection.source.sha256);
  assert.ok(!await exists(`${book}/pages/${String(selection.page).padStart(4, '0')}/page.md`));
}
await immutableWrite(`${folder}/started.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', startedAt: new Date().toISOString(), selections,
  review: await bind(reviewPath), protectedFiles, noAssembly: true,
}, null, 2)}\n`);
const pages = [];
const cropReviewTargets = [];
for (const selection of selections) {
  const stem = String(selection.page).padStart(4, '0');
  const target = `${book}/pages/${stem}`;
  await fs.mkdir(absolute(target), { recursive: true });
  await fs.copyFile(absolute(selection.candidate.path), absolute(`${target}/page.md`));
  await fs.chmod(absolute(`${target}/page.md`), 0o644);
  const commands = [];
  for (const action of ['finalize', 'vectorize']) {
    const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
      '.claude/skills/ld-s10y-lesson/tools/p2c.py', action,
      '--book', '9p', '--page', String(selection.page)];
    const result = spawnSync(command[0], command.slice(1), {
      cwd: process.cwd(), encoding: 'utf8', timeout: 180000, maxBuffer: 8 * 1024 * 1024,
      env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
    });
    const receipt = `${folder}/${action}-${selection.page}.json`;
    await immutableWrite(receipt, `${JSON.stringify({
      command, exitCode: result.status, signal: result.signal,
      stdout: result.stdout, stderr: result.stderr,
    }, null, 2)}\n`);
    commands.push(await bind(receipt));
    assert.equal(result.status, 0, result.stderr);
  }
  const audit = await read(`${target}/audit.json`);
  assert.deepEqual(audit.errors, []);
  assert.equal(audit.lines_printed, selection.expectedRows);
  assert.equal(audit.lines_md, selection.expectedRows);
  assert.deepEqual(audit.figures.map(row => row.id), selection.expectedFigures);
  for (const figure of audit.figures) {
    const crop = `.tmp/ld-s10y-lesson/9p/pages/${stem}/figures/${figure.id}.png`;
    const data = await bytes(crop);
    cropReviewTargets.push({
      page: selection.page, id: figure.id, box: figure.box, source: selection.source,
      crop: await bind(crop),
      svg: await bind(`.tmp/ld-s10y-lesson/9p/pages/${stem}/figures/${figure.id}.svg`),
      dimensions: [data.readUInt32BE(16), data.readUInt32BE(20)],
    });
  }
  pages.push({
    page: selection.page, expectedRows: selection.expectedRows, commands,
    outputs: await Promise.all(['page.md', 'page.json', 'audit.json'].map(name =>
      bind(`${target}/${name}`))),
    sourceMathWarnings: audit.katex_warnings,
  });
}
for (const selection of selections) {
  await verify(selection.candidate.path, selection.candidate.sha256);
  await verify(selection.source.path, selection.source.sha256);
}
for (const binding of protectedFiles) await verify(binding.path, binding.sha256);
const output = `${folder}/pages-native.json`;
await immutableWrite(output, `${JSON.stringify({
  ticket: 'STEMROBIN-181', book: '9p', status: 'source-native-pass-crop-review-pending',
  pages, cropReviewTargets, protectedFiles, review: await bind(reviewPath),
  limits: 'Only276-279 finalized/vectorized once each. No assembly, source-library or modern promotion, meter/index update, scientific or complete-card approval. Printed numerical results preserved.',
}, null, 2)}\n`);
console.log(JSON.stringify({ result: await bind(output),
  pages: pages.map(row => ({ page: row.page, rows: row.expectedRows })),
  crops: cropReviewTargets.length }));

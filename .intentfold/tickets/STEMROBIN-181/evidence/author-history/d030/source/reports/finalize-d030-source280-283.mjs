import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import {
  ticket, absolute, read, bytes, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const folder = `${ticket}/tmp/d030-source280-283-native`;
const reviewPath = `${ticket}/tmp/d030-source280-283-effective-review.json`;
await verify(reviewPath, '4fade4784fbe9af844ee751a8d23096588f57772fdf3a192b374a4d467cd5360');
const review = await read(reviewPath);
assert.equal(review.status, 'PASS');
assert.deepEqual(review.effectivePassPages, [280, 281, 282, 283]);
const book = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
assert.ok(!await exists(`${folder}/started.json`));
const protectedFiles = await Promise.all([
  `${book}/book.json`,
  ...['lesson.json', 'lesson.md', 'exercises.json'].map(name =>
    `${book}/lessons/phy9-c2-s4-n107/${name}`),
  `${ticket}/production-meter.json`, `${ticket}/evidence/index.json`,
  `${ticket}/tmp/d030-source280-283-author/author-freeze.json`,
].map(bind));
for (const page of review.pages) {
  assert.equal(page.sourceApproval, true);
  await verify(page.candidate.path, page.candidate.sha256);
  await verify(page.sourceImageBinding.path, page.sourceImageBinding.sha256);
  assert.ok(!await exists(`${book}/pages/${String(page.physicalPage).padStart(4, '0')}/page.md`));
}
await immutableWrite(`${folder}/started.json`, `${JSON.stringify({
  review: await bind(reviewPath), protectedFiles, pages: review.effectivePassPages, noAssembly: true,
}, null, 2)}\n`);
const pages = [];
const cropReviewTargets = [];
for (const page of review.pages) {
  const number = page.physicalPage;
  const stem = String(number).padStart(4, '0');
  const target = `${book}/pages/${stem}`;
  await fs.mkdir(absolute(target), { recursive: true });
  await fs.copyFile(absolute(page.candidate.path), absolute(`${target}/page.md`));
  await fs.chmod(absolute(`${target}/page.md`), 0o644);
  const commands = [];
  for (const action of ['finalize', 'vectorize']) {
    const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
      '.claude/skills/ld-s10y-lesson/tools/p2c.py', action, '--book', '9p', '--page', String(number)];
    const result = spawnSync(command[0], command.slice(1), {
      encoding: 'utf8', timeout: 180000, maxBuffer: 8 * 1024 * 1024,
      env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
    });
    const receipt = `${folder}/${action}-${number}.json`;
    await immutableWrite(receipt, `${JSON.stringify({
      command, exitCode: result.status, signal: result.signal,
      stdout: result.stdout, stderr: result.stderr,
    }, null, 2)}\n`);
    commands.push(await bind(receipt));
    assert.equal(result.status, 0, result.stderr);
  }
  const audit = await read(`${target}/audit.json`);
  assert.deepEqual(audit.errors, []);
  assert.equal(audit.lines_printed, page.independentVisualRowInventory.total);
  assert.equal(audit.lines_md, page.independentVisualRowInventory.total);
  assert.deepEqual(audit.figures.map(row => row.id), page.figures.map(row => row.id));
  for (const figure of audit.figures) {
    const crop = `.tmp/ld-s10y-lesson/9p/pages/${stem}/figures/${figure.id}.png`;
    const data = await bytes(crop);
    cropReviewTargets.push({
      page: number, id: figure.id, box: figure.box, source: page.sourceImageBinding,
      crop: await bind(crop),
      svg: await bind(`.tmp/ld-s10y-lesson/9p/pages/${stem}/figures/${figure.id}.svg`),
      dimensions: [data.readUInt32BE(16), data.readUInt32BE(20)],
    });
  }
  pages.push({
    page: number, rows: page.independentVisualRowInventory.total, commands,
    outputs: await Promise.all(['page.md', 'page.json', 'audit.json'].map(name => bind(`${target}/${name}`))),
    sourceMathWarnings: audit.katex_warnings,
  });
}
for (const binding of protectedFiles) await verify(binding.path, binding.sha256);
const output = `${folder}/pages-native.json`;
await immutableWrite(output, `${JSON.stringify({
  ticket: 'STEMROBIN-181', book: '9p', status: 'source-native-pass-crop-review-pending',
  pages, cropReviewTargets, protectedFiles, review: await bind(reviewPath),
  limits: 'Only280-283 finalized/vectorized once each. Original SOURCE and initial count failures preserved; no assembly, index/meter, source-library/modern promotion or complete114/115 claim.284 boundary remains unread.',
}, null, 2)}\n`);
console.log(JSON.stringify({ result: await bind(output), crops: cropReviewTargets.length }));

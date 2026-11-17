import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, evidence, indexPath, absolute, relative, read, bytes, bind, verify,
  immutableWrite, walk, hash, exists,
} from './retain-d016-evidence.mjs';

const [action] = process.argv.slice(2);
assert.ok(['--vectorize', '--consume'].includes(action));
const author = `${ticket}/tmp/d042-10p-source112-115-author`;
const folder = `${ticket}/tmp/d043-source112-115`;
const reviewPath = `${ticket}/tmp/d042-10p-source112-115-review.json`;
const freezePath = `${author}/complete-freeze.json`;
await verify(reviewPath, '198268d1ee490cc40d15e1533f0c376d0c303e8f41d565367b701d8932e9ce8a');
await verify(freezePath, '1dc3dca6e106836279a31c077c654d74485b1178e0f8144754096b79b7d029d1');
const review = await read(reviewPath);
const freeze = await read(freezePath);
assert.equal(review.summary.defectCount, 0);
assert.deepEqual(review.summary.recommendedRepairs, []);
const figures = [[113, 'fig-73'], [114, 'fig-74'], [114, 'fig-75'], [115, 'fig-76']];
for (const page of freeze.pages) {
  for (const row of [...page.native, ...page.crops]) await verify(row.path, row.sha256);
  assert.equal(page.linesPrinted, page.linesMd);
  assert.deepEqual(page.errors, []);
}
if (action === '--vectorize') {
  assert.equal(await exists(`${folder}/vectorize.json`), false);
  for (const [page, id] of figures)
    await immutableWrite(`${folder}/work/10p/pages/${String(page).padStart(4, '0')}/figures/${id}.png`,
      await bytes(`${author}/work/10p/pages/${String(page).padStart(4, '0')}/figures/${id}.png`));
  const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'vectorize', '--book', '10p',
    '--root', absolute(`${folder}/root`), '--work', absolute(`${folder}/work`)];
  const result = spawnSync(command[0], command.slice(1), {
    cwd: root, encoding: 'utf8', timeout: 180000, maxBuffer: 16 * 1024 * 1024,
  });
  await immutableWrite(`${folder}/vectorize.json`, `${JSON.stringify({
    command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  }, null, 2)}\n`);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /4 张通过, 0 张不匹配超限/);
  console.log(JSON.stringify({ vectorization: await bind(`${folder}/vectorize.json`) }));
} else {
  assert.equal((await read(`${folder}/vectorize.json`)).exitCode, 0);
  const raw = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
  const indexBefore = await bytes(indexPath);
  const meterPath = `${ticket}/production-meter.json`;
  const meterBefore = await bytes(meterPath);
  const protectedFiles = await Promise.all([
    `${raw}/book.json`, `${raw}/editions/modern-us-neutral/book.json`,
    '.claude/skills/ld-s10y-lesson/tools/assemble.py',
  ].map(bind));
  const outputs = [];
  let exercises = 0;
  for (const page of [112, 113, 114, 115]) {
    const stem = String(page).padStart(4, '0');
    const source = `${author}/source/10p/pages/${stem}`;
    const audit = await read(`${source}/audit.json`);
    assert.equal(audit.lines_printed, audit.lines_md);
    assert.deepEqual(audit.errors, []);
    exercises += (await read(`${source}/page.json`)).blocks.filter(row => row.kind === 'ex' && !row.cont).length;
    for (const name of ['page.md', 'page.json', 'audit.json']) {
      const target = `${raw}/pages/${stem}/${name}`;
      assert.equal(await exists(target), false);
      await immutableWrite(target, await bytes(`${source}/${name}`));
      outputs.push(await bind(target));
    }
  }
  assert.equal(exercises, 6);
  for (const [page, id] of figures)
    for (const suffix of ['png', 'svg']) {
      const target = `${raw}/figures/${id}.${suffix}`;
      assert.equal(await exists(target), false);
      await immutableWrite(target, await bytes(`${folder}/work/10p/pages/${String(page).padStart(4, '0')}/figures/${id}.${suffix}`));
      outputs.push(await bind(target));
    }
  const index = JSON.parse(indexBefore);
  const retained = [];
  for (const file of [
    ...await walk(author),
    ...await walk(`${ticket}/tmp/d042-10p-source112-115-review-evidence`),
    reviewPath, `${folder}/vectorize.json`, process.argv[1],
  ]) {
    if (file.endsWith('page.grid.png')) continue;
    const target = `${evidence}/reports/d043-source112-115/${hash(Buffer.from(relative(file))).slice(0, 12)}-${path.basename(file)}`;
    await immutableWrite(target, await bytes(file));
    const row = { ...await bind(target), originalPath: relative(file), role: 'verbatim SOURCE/RAW evidence' };
    retained.push(row);
    index.reports.push(row);
  }
  for (const row of protectedFiles) await verify(row.path, row.sha256);
  const receipt = `${evidence}/reports/d043-source112-115-consumed.json`;
  await immutableWrite(receipt, `${JSON.stringify({
    ticket: 'STEMROBIN-181', status: 'PASS-source-consumed',
    physicalPages: [112, 113, 114, 115], sourceFigures: figures.map(row => row[1]),
    sourceExerciseObjectsAdded: exercises, SOURCE: 'PASS', RAW: 'PASS', outputs, retained,
    vectorization: await bind(`${folder}/vectorize.json`),
    nonexclusiveFigureReferences: review.nonexclusiveFigureReferences,
    section41Complete: false, bookIndexesUnchanged: true, newCompleteCards: 0,
    originalFailuresPreserved: true, noGateReplay: true, newImageOpens: 0,
  }, null, 2)}\n`);
  index.reports.push(await bind(receipt));
  index.updatedAt = new Date().toISOString();
  const meter = JSON.parse(meterBefore);
  const cp = meter.currentCheckpoint;
  assert.equal(cp.sourcePagesFinalized, 379);
  assert.equal(cp.sourceWrittenExercises, 213);
  cp.sourcePagesFinalized = meter.sourcePagesFinalized = 383;
  cp.sourceWrittenExercises = meter.sourceWrittenExercises = 219;
  cp.sourcePagesBasis = '291 confirmed9p+92 confirmed10p;112-115 SOURCE/RAW/native/vectorization consumed; references nonexclusive; section41 remains open.';
  cp.nextBatch.sourceTotals = { pages: 383, exerciseObjects: 219 };
  cp.nextBatch.latestSourceConsumption = await bind(receipt);
  meter.updatedAt = new Date().toISOString();
  assert.deepEqual(await bytes(indexPath), indexBefore);
  assert.deepEqual(await bytes(meterPath), meterBefore);
  await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
  await fs.writeFile(absolute(meterPath), `${JSON.stringify(meter, null, 2)}\n`);
  console.log(JSON.stringify({ receipt: await bind(receipt), sourcePages: 383, sourceExercises: 219 }));
}

import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, evidence, indexPath, absolute, relative, read, bytes, bind, verify,
  exists, immutableWrite, walk, hash,
} from './retain-d016-evidence.mjs';

const [action, expectedRawHash] = process.argv.slice(2);
assert.ok(['--vectorize', '--consume'].includes(action));
const author = 'tmp/d040-10p-source104-107-author';
const folder = `${ticket}/tmp/d040-source104-107-native`;
const reviewPath = `${ticket}/tmp/d040-10p-source104-107-review.json`;
await verify(reviewPath, '9a0e9af22001b40da12fc53645fc30cde7901b03c95ad7913089cd416bb62486');
await verify(`${author}/author-freeze.json`, '3923b7e3391d79c2b0da5e9238a8be99b234cf713bcf196686f5f33bef0b0b46');
const review = await read(reviewPath);
assert.ok(review.pages.every(row => row.status === 'PASS'));
const figures = [[104, 'fig-64'], [105, 'fig-65'], [106, 'fig-66'], [106, 'fig-67'], [106, 'fig-68']];
if (action === '--vectorize') {
  assert.equal(expectedRawHash, undefined);
  assert.equal(await exists(`${folder}/vectorize.json`), false, 'No vectorization replay');
  for (const [page, id] of figures)
    await immutableWrite(`${folder}/work/10p/pages/${String(page).padStart(4, '0')}/figures/${id}.png`,
      await bytes(`${author}/native-work/10p/pages/${String(page).padStart(4, '0')}/figures/${id}.png`));
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
  assert.match(result.stdout, /5 张通过, 0 张不匹配超限/);
  console.log(JSON.stringify({ vectorization: await bind(`${folder}/vectorize.json`) }));
} else {
  const rawPath = `${ticket}/tmp/d040-10p-raw65-review.json`;
  await verify(rawPath, expectedRawHash);
  const rawReview = await read(rawPath);
  assert.match(rawReview.status, /^PASS/i);
  const vectorization = await read(`${folder}/vectorize.json`);
  assert.equal(vectorization.exitCode, 0);
  const indexBefore = await bytes(indexPath);
  const meterBefore = await bytes(`${ticket}/production-meter.json`);
  const raw = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
  const unchanged = await Promise.all([
    `${raw}/book.json`, `${raw}/editions/modern-us-neutral/book.json`,
    '.claude/skills/ld-s10y-lesson/tools/assemble.py',
  ].map(bind));
  const outputs = [];
  for (const page of [104, 105, 106, 107]) {
    const stem = String(page).padStart(4, '0');
    const source = await read(`${author}/native/10p/pages/${stem}/page.json`);
    const audit = await read(`${author}/native/10p/pages/${stem}/audit.json`);
    assert.equal(audit.lines_printed, audit.lines_md);
    assert.deepEqual(audit.errors, []);
    assert.equal(source.blocks.filter(row => row.kind === 'ex' && !row.cont).length, 0);
    for (const name of ['page.md', 'page.json', 'audit.json']) {
      const destination = `${raw}/pages/${stem}/${name}`;
      assert.equal(await exists(destination), false);
      await immutableWrite(destination, await bytes(`${author}/native/10p/pages/${stem}/${name}`));
      outputs.push(await bind(destination));
    }
  }
  for (const [page, id] of figures)
    for (const suffix of ['png', 'svg']) {
      const destination = `${raw}/figures/${id}.${suffix}`;
      assert.equal(await exists(destination), false);
      await immutableWrite(destination,
        await bytes(`${folder}/work/10p/pages/${String(page).padStart(4, '0')}/figures/${id}.${suffix}`));
      outputs.push(await bind(destination));
    }
  const index = JSON.parse(indexBefore);
  const retained = [];
  for (const file of [
    ...await walk(author), ...await walk(`${ticket}/tmp/d040-10p-source104-107-review-evidence`),
    ...await walk(`${ticket}/tmp/d040-10p-raw65-review-evidence`),
    reviewPath, rawPath, `${folder}/vectorize.json`, process.argv[1],
  ]) {
    if (file.endsWith('page.grid.png')) continue;
    const destination = `${evidence}/reports/d040-source104-107/${hash(Buffer.from(relative(file))).slice(0, 12)}-${path.basename(file)}`;
    await immutableWrite(destination, await bytes(file));
    const row = { ...(await bind(destination)), originalPath: relative(file), role: 'verbatim source and exact-crop history' };
    retained.push(row);
    index.reports.push(row);
  }
  for (const row of unchanged) await verify(row.path, row.sha256);
  const receipt = `${evidence}/reports/d040-source104-107-consumed.json`;
  await immutableWrite(receipt, `${JSON.stringify({
    ticket: 'STEMROBIN-181', status: 'PASS-source-consumed',
    physicalPages: [104, 105, 106, 107], sourceFigures: figures.map(row => row[1]),
    sourceExerciseObjectsAdded: 0, SOURCE: 'PASS', RAW: 'PASS',
    outputs, retained, vectorization: await bind(`${folder}/vectorize.json`),
    bookIndexesUnchanged: true, newCompleteCards: 0, completeDeliveredCards: 86,
    originalFailuresPreserved: true, noGateReplay: true,
  }, null, 2)}\n`);
  index.reports.push(await bind(receipt));
  index.updatedAt = new Date().toISOString();
  assert.deepEqual(await bytes(indexPath), indexBefore);
  await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
  const meter = JSON.parse(meterBefore);
  const cp = meter.currentCheckpoint;
  assert.equal(cp.sourcePagesFinalized, 371);
  assert.equal(cp.sourceWrittenExercises, 213);
  cp.sourcePagesFinalized = meter.sourcePagesFinalized = 375;
  cp.sourcePagesBasis = '291 confirmed9p+84 confirmed10p;104–107 SOURCE/native/RAW/vectorization consumed; olderHOLDs unchanged.';
  cp.nextBatch.sourceTotals = { pages: 375, exerciseObjects: 213 };
  cp.nextBatch.latestSourceConsumption = await bind(receipt);
  meter.updatedAt = new Date().toISOString();
  assert.deepEqual(await bytes(`${ticket}/production-meter.json`), meterBefore);
  await fs.writeFile(absolute(`${ticket}/production-meter.json`), `${JSON.stringify(meter, null, 2)}\n`);
  console.log(JSON.stringify({ receipt: await bind(receipt), sourcePages: 375, sourceExercises: 213 }));
}

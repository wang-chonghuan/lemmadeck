import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, evidence, indexPath, absolute, relative, read, bytes, bind, verify,
  immutableWrite, walk, hash, exists,
} from './retain-d016-evidence.mjs';

const [action] = process.argv.slice(2);
assert.ok(['--repair-vectorize', '--consume'].includes(action));
const author = `${ticket}/tmp/d041-10p-source108-111-author`;
const folder = `${ticket}/tmp/d042-source108-111`;
const reviewPath = `${ticket}/tmp/d041-10p-source108-111-review.json`;
await verify(reviewPath, '002f651545c5c78e62c3526c9da12b5a1ba3cb052acf68d432863b5d98df2909');
await verify(`${author}/evidence-freeze.json`, '8e49e0093c00c9e908f8664d215b3504ecaf035f6df740c6ed6eb90cfbaa84c4');
const review = await read(reviewPath);
assert.equal(review.summary.source_transcription_defect_count, 0);
assert.equal(review.summary.raw_defect_count, 0);
assert.equal(review.findings.length, 1);
const figures = [[108, 'fig-69'], [109, 'fig-70'], [110, 'fig-71'], [111, 'fig-72']];
if (action === '--repair-vectorize') {
  assert.equal(await exists(`${folder}/repair.json`), false);
  const originalPage = await read(`${author}/root/10p/pages/0110/page.json`);
  const originalNote = originalPage.meta.notes[0];
  const correctedNote = '图71及图题在39节标题前排印；38节引用图71а、图71б，39节亦引用图71б。保留原始排印位置与全部引用，不能据此确定排他语义归属。';
  const outputs = [];
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const from = `${author}/root/10p/pages/0110/${name}`;
    const target = `${folder}/root/10p/pages/0110/${name}`;
    if (name === 'audit.json') await immutableWrite(target, await bytes(from));
    else if (name === 'page.json') {
      const page = structuredClone(originalPage);
      page.meta.notes[0] = correctedNote;
      const reversed = structuredClone(page);
      reversed.meta.notes[0] = originalNote;
      assert.deepEqual(reversed, originalPage);
      await immutableWrite(target, `${JSON.stringify(page, null, 2)}\n`);
    } else {
      const text = (await bytes(from)).toString();
      const match = /^---\r?\n([\s\S]*?)\r?\n---(\r?\n)/.exec(text);
      assert.ok(match);
      const meta = JSON.parse(match[1]);
      assert.equal(meta.notes[0], originalNote);
      const beforeMeta = structuredClone(meta);
      meta.notes[0] = correctedNote;
      const body = text.slice(match[0].length);
      const rewritten = `---\n${JSON.stringify(meta, null, 2)}\n---${match[2]}${body}`;
      const reversed = structuredClone(meta);
      reversed.notes[0] = originalNote;
      assert.deepEqual(reversed, beforeMeta);
      assert.equal(rewritten.slice(rewritten.indexOf('\n---\n') + 5), body);
      await immutableWrite(target, rewritten);
    }
    outputs.push(await bind(target));
  }
  await immutableWrite(`${folder}/repair.json`, `${JSON.stringify({
    ticket: 'STEMROBIN-181', status: 'PASS-affected-metadata-only',
    review: await bind(reviewPath), finding: review.findings[0].id,
    before: originalNote, after: correctedNote, outputs,
    literalBlocksUnchanged: true, auditBytesUnchanged: true, figurePositionsUnchanged: true,
    exclusiveFigureOwnership: 'NOT_ESTABLISHED', originalFreezeUnchanged: true,
    sourceOrCropReviewReplayed: false, nativeFinalizeReplayed: false, newImageOpens: 0,
  }, null, 2)}\n`);
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
  console.log(JSON.stringify({ repair: await bind(`${folder}/repair.json`),
    vectorization: await bind(`${folder}/vectorize.json`) }));
} else {
  assert.equal((await read(`${folder}/vectorize.json`)).exitCode, 0);
  assert.equal((await read(`${folder}/repair.json`)).status, 'PASS-affected-metadata-only');
  const raw = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
  const indexBefore = await bytes(indexPath);
  const meterPath = `${ticket}/production-meter.json`;
  const meterBefore = await bytes(meterPath);
  const protectedFiles = await Promise.all([
    `${raw}/book.json`, `${raw}/editions/modern-us-neutral/book.json`,
    '.claude/skills/ld-s10y-lesson/tools/assemble.py',
  ].map(bind));
  const outputs = [];
  for (const page of [108, 109, 110, 111]) {
    const stem = String(page).padStart(4, '0');
    const source = `${page === 110 ? folder : author}/root/10p/pages/${stem}`;
    const audit = await read(`${source}/audit.json`);
    assert.equal(audit.lines_printed, audit.lines_md);
    assert.deepEqual(audit.errors, []);
    assert.equal((await read(`${source}/page.json`)).blocks.filter(row => row.kind === 'ex' && !row.cont).length, 0);
    for (const name of ['page.md', 'page.json', 'audit.json']) {
      const target = `${raw}/pages/${stem}/${name}`;
      assert.equal(await exists(target), false);
      await immutableWrite(target, await bytes(`${source}/${name}`));
      outputs.push(await bind(target));
    }
  }
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
    ...await walk(`${ticket}/tmp/d041-10p-source108-111-review-evidence`),
    reviewPath, `${folder}/repair.json`, `${folder}/vectorize.json`, process.argv[1],
  ]) {
    if (file.endsWith('page.grid.png')) continue;
    const target = `${evidence}/reports/d042-source108-111/${hash(Buffer.from(relative(file))).slice(0, 12)}-${path.basename(file)}`;
    await immutableWrite(target, await bytes(file));
    const row = { ...await bind(target), originalPath: relative(file), role: 'verbatim SOURCE/RAW and metadata-repair evidence' };
    retained.push(row);
    index.reports.push(row);
  }
  for (const row of protectedFiles) await verify(row.path, row.sha256);
  const receipt = `${evidence}/reports/d042-source108-111-consumed.json`;
  await immutableWrite(receipt, `${JSON.stringify({
    ticket: 'STEMROBIN-181', status: 'PASS-source-consumed',
    physicalPages: [108, 109, 110, 111], sourceFigures: figures.map(row => row[1]),
    sourceExerciseObjectsAdded: 0, SOURCE: 'PASS', RAW: 'PASS', outputs, retained,
    metadataRepair: await bind(`${folder}/repair.json`),
    vectorization: await bind(`${folder}/vectorize.json`),
    sharedFigures: { 'fig-70': [38, 39], 'fig-71': [38, 39], exclusiveOwner: false },
    section39Complete: false, bookIndexesUnchanged: true, newCompleteCards: 0,
    originalFailuresPreserved: true, noGateReplay: true,
  }, null, 2)}\n`);
  index.reports.push(await bind(receipt));
  index.updatedAt = new Date().toISOString();
  const meter = JSON.parse(meterBefore);
  const cp = meter.currentCheckpoint;
  assert.equal(cp.sourcePagesFinalized, 375);
  assert.equal(cp.sourceWrittenExercises, 213);
  cp.sourcePagesFinalized = meter.sourcePagesFinalized = 379;
  cp.sourcePagesBasis = '291 confirmed9p+88 confirmed10p;108-111 SOURCE/RAW/native/vectorization consumed; shared figure ownership is nonexclusive; older HOLDs retained.';
  cp.nextBatch.sourceTotals = { pages: 379, exerciseObjects: 213 };
  cp.nextBatch.latestSourceConsumption = await bind(receipt);
  meter.updatedAt = new Date().toISOString();
  assert.deepEqual(await bytes(indexPath), indexBefore);
  assert.deepEqual(await bytes(meterPath), meterBefore);
  await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
  await fs.writeFile(absolute(meterPath), `${JSON.stringify(meter, null, 2)}\n`);
  console.log(JSON.stringify({ receipt: await bind(receipt), sourcePages: 379, sourceExercises: 213 }));
}

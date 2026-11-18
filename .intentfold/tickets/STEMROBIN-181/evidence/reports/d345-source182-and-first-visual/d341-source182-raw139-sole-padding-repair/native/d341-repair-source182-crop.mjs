import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, read, bytes, bind, verify, exists, immutableWrite, walk,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const base = `${ticket}/tmp`;
const initial = `${base}/d333-source182-first-author`;
const out = `${base}/d341-source182-raw139-sole-padding-repair`;
assert.equal(await exists(`${out}/started.json`), false);
await verify(`${initial}/report.json`, '69b6f176d7d82b9e5323cad9828039f11f03ec78fb78d0965abf64e751abd8bd');
await verify(`${initial}/author-freeze.json`, 'a38157def5b9bc65c2791fd3f2005b1e54aeb08a49cd5ba1dc17e1437a69f6c7');
const initialFreeze = await read(`${initial}/author-freeze.json`);
for (const binding of initialFreeze.files) await verify(binding.path, binding.sha256);
const originalPage = await read(`${initial}/source/10p/pages/0182/page.json`);
assert.equal(originalPage.blocks[0].id, 'fig-139');
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
await immutableWrite(`${out}/started.json`, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', page: 182,
  preservedAuthorFreeze: await bind(`${initial}/author-freeze.json`),
  preservedInitialFAIL: await bind(`${initial}/crop-observations.json`),
  status: 'SOLE-RAW139-PADDING-REPAIR-CANDIDATE', parentImageOpens: 0,
}));
for (const folder of ['source', 'work']) {
  await fs.cp(absolute(`${initial}/${folder}`), absolute(`${out}/${folder}`),
    { recursive: true, errorOnExist: true, force: false });
  for (const file of await walk(`${out}/${folder}`)) await fs.chmod(absolute(file), 0o644);
}
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
const helper = `${base}/d341-repair-source182-crop.py`;
const receipts = [];
function invoke(args) {
  const command = [python, '-B', ...args];
  const startedUtc = new Date().toISOString();
  const result = spawnSync(command[0], command.slice(1), {
    cwd: root, encoding: 'utf8', timeout: 120000,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  return { command, startedUtc, finishedUtc: new Date().toISOString(),
    exitCode: result.status, stdout: result.stdout, stderr: result.stderr, invocationCount: 1 };
}
for (const [name, args] of [
  ['metadata', [helper, 'prepare', absolute(out)]],
  ['finalize', ['.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize',
    '--book', '10p', '--page', '182', '--root', absolute(`${out}/source`), '--work', absolute(`${out}/work`)]],
  ['vectorize-raw139-only', [helper, 'vectorize', absolute(out)]],
]) {
  const result = invoke(args);
  const file = `${out}/native/${name}.receipt.json`;
  await immutableWrite(file, serialize(result));
  receipts.push({ operation: name, ...await bind(file), exitCode: result.exitCode });
  assert.equal(result.exitCode, 0, result.stderr || result.stdout);
}
const current = await read(`${out}/source/10p/pages/0182/page.json`);
assert.deepEqual(current.blocks, originalPage.blocks);
assert.equal(current.meta.figure_crops['fig-139'].padding_px, 4);
const withoutCrops = ({ figure_crops, ...meta }) => meta;
assert.deepEqual(withoutCrops(current.meta), withoutCrops(originalPage.meta));
const audit = await read(`${out}/source/10p/pages/0182/audit.json`);
assert.equal(audit.lines_printed, 21);
assert.equal(audit.lines_md, 21);
assert.equal(audit.errors.length, 0);
for (const name of ['fig-140.png', 'fig-140.svg']) {
  assert.deepEqual(await bytes(`${out}/work/10p/pages/0182/figures/${name}`),
    await bytes(`${initial}/work/10p/pages/0182/figures/${name}`));
}
for (const binding of initialFreeze.files) await verify(binding.path, binding.sha256);
const reportPath = `${out}/report.json`;
await immutableWrite(reportPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', page: 182, status: 'AUTHOR-REPAIR-NATIVE-PASS-INDEPENDENT-VISUAL-PENDING',
  initialAuthorFreeze: await bind(`${initial}/author-freeze.json`),
  preservedInitialFAIL: await bind(`${initial}/crop-observations.json`),
  affectedFigure: 'fig-139', paddingBefore: 12, paddingAfter: 4,
  exactBoxUnchanged: [513, 259, 551, 278], drawingBottom: 537, captionStarts: 543,
  repairedCropBottom: 541, receipts,
  unchangedTextBlocks: true, unchangedRAW140PNGAndSVG: true,
  originalFilesVerifiedUnchanged: initialFreeze.files.length,
  parentImageOpens: 0, parentImageCount: 24, soleAuthorRepairCount: 1,
  newSourcePages: 0, confirmedSourcePages: 419, completeDeliveredCards: 98,
  SOURCE182: 'HOLD-independent-text-review-pending',
  RAW139: 'HOLD-independent-crop-and-SVG-review-pending',
  RAW140: 'HOLD-independent-review-pending',
  allOriginalFAILHOLDPreserved: true, noFurtherAuthorRepair: true,
  nativeUnchangedFigureVectorizations: 0, fullCardClaim: false,
  modelTokenUsage: null, costUsd: null,
}));
const files = [];
for (const file of await walk(out)) files.push(await bind(file));
const freezePath = `${out}/author-freeze.json`;
await immutableWrite(freezePath, serialize({
  ticket: 'STEMROBIN-181', page: 182, status: 'SOLE-PADDING-REPAIR-FROZEN-VISUAL-PENDING',
  files, report: await bind(reportPath), actualImageOpens: 0, fileMode: '0444',
}));
for (const file of await walk(out)) await fs.chmod(absolute(file), 0o444);
console.log(JSON.stringify({ report: await bind(reportPath), freeze: await bind(freezePath),
  nativeExitCodes: receipts.map(row => row.exitCode), paddingPx: 4,
  parentImageOpens: 0, RAW139: 'HOLD-independent-visual-pending' }));

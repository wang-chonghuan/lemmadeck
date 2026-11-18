import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, bytes, read, bind, verify, exists, immutableWrite, walk,
} from './retain-d016-evidence.mjs';

const [action] = process.argv.slice(2);
assert.ok(['prepare', 'finalize'].includes(action));
const old = `${ticket}/tmp/d207-source172-173-first-author`;
const folder = `${ticket}/tmp/d220-source173-affected-repair`;
const reviewPath = `${ticket}/tmp/d213-source172-173-first-review/report.json`;
const freeze = await read(`${old}/author-freeze.json`);
await verify(`${old}/author-freeze.json`, 'd981b766e1f7bbdcaa1afe34d2cf1c62cf051654467ee7275c465c49b377ff33');
const page = freeze.pages.find(row => row.physicalPage === 173);
const original = [];
for (const name of ['md', 'json', 'audit', 'nativeReceipt', 'vectorizeReceipt']) {
  await verify(`${old}/${page[name].path}`, page[name].sha256);
  original.push(await bind(`${old}/${page[name].path}`));
}
for (const figure of page.figures) for (const key of ['nativeCrop', 'nativeVector']) {
  await verify(`${old}/${figure[key].path}`, figure[key].sha256);
  original.push(await bind(`${old}/${figure[key].path}`));
}
const review = await read(reviewPath);
assert.equal(review.pages.find(row => row.physicalPage === 173).sourceContentStatus, 'FAIL');
assert.deepEqual(review.pages.find(row => row.physicalPage === 173).blockingFindings.map(row => row.id),
  ['SOURCE173-F1', 'SOURCE173-F2', 'SOURCE173-F3']);
if (action === 'prepare') {
  assert.equal(await exists(folder), false);
  await fs.mkdir(absolute(folder), { recursive: true });
  await fs.cp(absolute(`${old}/source/10p/pages/0173`), absolute(`${folder}/source/10p/pages/0173`),
    { recursive: true, force: false, errorOnExist: true });
  await fs.cp(absolute(`${old}/work/10p/pages/0173`), absolute(`${folder}/work/10p/pages/0173`),
    { recursive: true, force: false, errorOnExist: true });
  await immutableWrite(`${folder}/prepared.json`, `${JSON.stringify({
    authorFreeze: await bind(`${old}/author-freeze.json`), review: await bind(reviewPath),
    original, onlyAffectedPageCopied: 173, originalFAILPreserved: true,
    imagesOpened: 0, prepareRerun: false, repairCountBefore: 0,
  }, null, 2)}\n`);
  console.log(JSON.stringify({ prepared: await bind(`${folder}/prepared.json`) }));
} else {
  assert.equal(await exists(`${folder}/native.json`), false);
  const before = await bytes(`${old}/${page.md.path}`);
  const candidate = await bytes(`${folder}/source/10p/pages/0173/page.md`);
  const expected = before.toString().replaceAll('一部分', '一部份')
    .replace('房子和其他物体', '房子和其它物体')
    .replace('观点需用', '观点需要用');
  assert.equal(candidate.toString(), expected);
  assert.notDeepEqual(candidate, before);
  const temp = absolute(`${folder}/work/system-temp`);
  await fs.mkdir(temp, { recursive: true });
  const command = [
    '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize',
    '--book', '10p', '--page', '173', '--root', absolute(`${folder}/source`),
    '--work', absolute(`${folder}/work`),
  ];
  const result = spawnSync(command[0], command.slice(1), { cwd: root, encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024, timeout: 180000,
    env: { ...process.env, TMPDIR: temp, TMP: temp, TEMP: temp, PYTHONDONTWRITEBYTECODE: '1' } });
  await immutableWrite(`${folder}/native.json`, `${JSON.stringify({
    command, exitCode: result.status, signal: result.signal, stdout: result.stdout,
    stderr: result.stderr, error: result.error?.message ?? null, attempt: 1,
    sourceTextRepair: true, imageRecapture: false, vectorizeRerun: false,
  }, null, 2)}\n`);
  for (const row of original) await verify(row.path, row.sha256);
  for (const figure of page.figures) for (const key of ['nativeCrop', 'nativeVector']) {
    const file = figure[key].path.replace(/^work\//, `${folder}/work/`);
    await verify(file, figure[key].sha256);
  }
  const outputs = await Promise.all((await walk(`${folder}/source/10p/pages/0173`)).map(bind));
  await immutableWrite(`${folder}/author-freeze.json`, `${JSON.stringify({
    ticket: 'STEMROBIN-181', batch: 'D032', page: 173, original: await bind(`${old}/author-freeze.json`),
    independentFirstFAIL: await bind(reviewPath), repair: ['SOURCE173-F1', 'SOURCE173-F2', 'SOURCE173-F3'],
    outputs, native: await bind(`${folder}/native.json`), exitCode: result.status,
    originalUnchanged: original, rawPixelsAndSVGUnchanged: true, newImageOpens: 0,
    independentAffectedReview: 'PENDING', soleRepairUsed: true, completeCardClaim: false,
    source172NativeHOLDUnchanged: true, stableSkillsEdited: false,
  }, null, 2)}\n`);
  console.log(JSON.stringify({ authorFreeze: await bind(`${folder}/author-freeze.json`),
    nativeExit: result.status, outputs: outputs.length }));
  process.exitCode = result.status ?? 2;
}

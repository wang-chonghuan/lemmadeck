import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, bytes, read, bind, verify, exists, immutableWrite, walk,
} from './retain-d016-evidence.mjs';

const mode = process.argv[2];
assert.ok(['--prepare', '--execute'].includes(mode));
assert.equal(process.argv.length, 3);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const original = `${ticket}/tmp/d508-source198-first-punctuation-repair`;
const folder = `${ticket}/tmp/d512-source198-first-style-repair`;
const reviewPath = `${ticket}/tmp/d507-source198-style-first-detail-review/report.json`;
await verify(reviewPath, '76b2407c209de0cc55d7d8c28b7ef8b67ce1dd97df4216f865ba121d29735422');
const review = await read(reviewPath);
assert.equal(review.finding.verdict, 'FAIL');
assert.equal(review.finding.md_line, 78);
assert.equal(review.finding.json_pointer, '/blocks/7/lines/1');
const { before, after } = review.finding.exact_local_markup_difference;
const freezePath = `${original}/author-freeze.json`;
await verify(freezePath, 'd742939cad20d0a47ba96f94e9fc181c1720ede82da044fb312a7c88926d30ba');
const freeze = await read(freezePath);
const prefixes = ['source', 'work'].map(name => absolute(`${original}/${name}/10p/pages/0198/`) + '/');
const inputs = freeze.files.filter(row => prefixes.some(prefix => absolute(row.path).startsWith(prefix)));
assert.ok(inputs.length >= 9);
const page = `${folder}/source/10p/pages/0198`;
const originalPage = `${original}/source/10p/pages/0198`;

if (mode === '--prepare') {
  assert.equal(await exists(folder), false);
  for (const row of inputs) {
    await verify(row.path, row.sha256);
    await immutableWrite(`${folder}/${path.relative(absolute(original), row.path)}`, await bytes(row.path));
  }
  await immutableWrite(`${folder}/started.json`, serialize({
    ticket: 'STEMROBIN-181', inputs, finding: review.finding,
    previousReview: await bind(reviewPath), originalFreeze: await bind(freezePath),
    firstAndOnlyStyleRepair: true, priorPunctuationPASSUnchanged: true,
    newImages: 0, parentImageCount: 24,
  }));
  console.log(JSON.stringify({ prepared: await bind(`${folder}/started.json`) }));
} else {
  const started = await read(`${folder}/started.json`);
  await verify(reviewPath, started.previousReview.sha256);
  assert.equal(await exists(`${folder}/native-started.json`), false);
  const originalMD = (await bytes(`${originalPage}/page.md`)).toString('utf8');
  const originalJSON = await read(`${originalPage}/page.json`);
  assert.equal(originalMD.split(before).length, 2);
  assert.equal(originalMD.split('\n')[77], before);
  assert.equal(originalJSON.blocks[7].lines[1], before);
  const expectedMD = originalMD.replace(before, after);
  const expectedJSON = structuredClone(originalJSON);
  expectedJSON.blocks[7].lines[1] = after;
  assert.equal((await bytes(`${page}/page.md`)).toString('utf8'), expectedMD);
  assert.deepEqual(await read(`${page}/page.json`), originalJSON);
  const command = [
    '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize',
    '--book', '10p', '--page', '198',
    '--root', absolute(`${folder}/source`), '--work', absolute(`${folder}/work`),
  ];
  await immutableWrite(`${folder}/native-started.json`, serialize({ command, invocations: 1 }));
  const result = spawnSync(command[0], command.slice(1), {
    cwd: root, encoding: 'utf8', timeout: 120000,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  const nativePath = `${folder}/native.json`;
  await immutableWrite(nativePath, serialize({
    command, invocations: 1, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  }));
  assert.equal(result.status, 0, result.stderr);
  assert.equal((await bytes(`${page}/page.md`)).toString('utf8'), expectedMD);
  assert.deepEqual(await read(`${page}/page.json`), expectedJSON);
  assert.deepEqual(await bytes(`${page}/audit.json`), await bytes(`${originalPage}/audit.json`));
  const audit = await read(`${page}/audit.json`);
  assert.equal(audit.lines_md, 26);
  assert.equal(audit.lines_printed, 26);
  assert.deepEqual(audit.errors, []);
  for (const row of inputs) {
    await verify(row.path, row.sha256);
    if (!/\/(?:page\.md|page\.json)$/.test(row.path)) {
      await verify(`${folder}/${path.relative(absolute(original), row.path)}`, row.sha256);
    }
  }
  const reportPath = `${folder}/report.json`;
  await immutableWrite(reportPath, serialize({
    schema: 'source198-first-style-repair@1', ticket: 'STEMROBIN-181', batch: 'D033',
    status: 'ONE-STYLE-LEAF-REPAIR-NATIVE-PASS-FIRST-AFFECTED-REVIEW-PENDING',
    finding: review.finding, previousReview: await bind(reviewPath),
    originalFreeze: await bind(freezePath),
    pageMD: await bind(`${page}/page.md`), pageJSON: await bind(`${page}/page.json`),
    audit: await bind(`${page}/audit.json`), native: await bind(nativePath),
    nativeInvocations: 1, rows: [26, 26], onlyChangedMDLine: 78,
    onlyChangedJSONLeaf: '/blocks/7/lines/1',
    originalInputsUnchanged: true, allOtherSourceWorkFilesUnchanged: true,
    priorPunctuationPASSUnchanged: true, historicalFAILHOLDPreserved: true,
    sourcePagesAdded: 0, completeCardsAdded: 0, completeCard: false,
    newImages: 0, parentImageCount: 24, noImageBudgetReset: true,
    newPaidGeneration: 0, newPermanentWorkersWorktreesBranches: 0,
    DBMergeDeployCommitPush: false,
  }));
  const outputs = [];
  for (const file of await walk(folder)) outputs.push(await bind(file));
  const outputFreeze = `${folder}/author-freeze.json`;
  await immutableWrite(outputFreeze, serialize({
    schema: 'source198-first-style-repair-freeze@1', files: outputs, frozen: true,
    firstAndOnlyStyleRepair: true, newImages: 0, parentImageCount: 24,
  }));
  for (const file of [...outputs.map(row => row.path), outputFreeze]) await fs.chmod(absolute(file), 0o444);
  console.log(JSON.stringify({ report: await bind(reportPath), freeze: await bind(outputFreeze) }));
}

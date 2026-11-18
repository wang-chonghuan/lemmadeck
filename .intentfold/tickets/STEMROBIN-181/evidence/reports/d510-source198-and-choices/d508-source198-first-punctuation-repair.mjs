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
const original = `${ticket}/tmp/d496-source198-first-author`;
const folder = `${ticket}/tmp/d508-source198-first-punctuation-repair`;
const reviewPath = `${ticket}/tmp/d497-source198-first-independent-text-review/report.json`;
await verify(reviewPath, 'f2dc5dd12af27d32b3e66fbbbbbf9e7249980c3eda65950ac48e9fbd15f2b44c');
const review = await read(reviewPath);
const repairs = [
  { finding: 'D497-PUNCT-01', block: 8, line: 0, mdLine: 86,
    before: '观察：把', after: '观察。把' },
  { finding: 'D497-PUNCT-02', block: 8, line: 1, mdLine: 87,
    before: '中心，首先', after: '中心。首先' },
];
assert.equal(review.findings.filter(row => row.verdict === 'FAIL').length, 2);
for (const repair of repairs) {
  const finding = review.findings.find(row => row.id === repair.finding);
  assert.equal(finding.verdict, 'FAIL');
  assert.equal(finding.json_pointer, `/blocks/${repair.block}/lines/${repair.line}`);
  assert.equal(finding.md_line, repair.mdLine);
}
await verify(`${original}/report.json`,
  '08940bb5560173d18bac2fc76171cf07873a5931174b4497bccf0b16e09b9c79');
const authorFreeze = await read(`${original}/author-freeze.json`);
const prefixes = ['source', 'work'].map(name => absolute(`${original}/${name}/10p/pages/0198/`) + '/');
const inputs = authorFreeze.files.filter(row => prefixes.some(prefix => absolute(row.path).startsWith(prefix)));
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
    ticket: 'STEMROBIN-181', batch: 'D033', repairs, inputs,
    previousReview: await bind(reviewPath), originalFreeze: await bind(`${original}/author-freeze.json`),
    firstAndOnlyPunctuationRepair: true, unrelatedStyleHOLDPreserved: true,
    newImages: 0, parentImageCount: 24,
  }));
  console.log(JSON.stringify({ prepared: await bind(`${folder}/started.json`), repairs }));
} else {
  const started = await read(`${folder}/started.json`);
  await verify(reviewPath, started.previousReview.sha256);
  assert.equal(await exists(`${folder}/native-started.json`), false);
  const originalMD = (await bytes(`${originalPage}/page.md`)).toString('utf8');
  const originalJSON = await read(`${originalPage}/page.json`);
  let expectedMD = originalMD;
  const expectedJSON = structuredClone(originalJSON);
  for (const repair of repairs) {
    assert.equal(originalMD.split(repair.before).length, 2);
    assert.ok(originalMD.split('\n')[repair.mdLine - 1].includes(repair.before));
    assert.ok(originalJSON.blocks[repair.block].lines[repair.line].includes(repair.before));
    expectedMD = expectedMD.replace(repair.before, repair.after);
    expectedJSON.blocks[repair.block].lines[repair.line] =
      expectedJSON.blocks[repair.block].lines[repair.line].replace(repair.before, repair.after);
  }
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
  assert.deepEqual(await read(`${page}/page.json`), expectedJSON);
  assert.equal((await bytes(`${page}/page.md`)).toString('utf8'), expectedMD);
  assert.deepEqual(await bytes(`${page}/audit.json`), await bytes(`${originalPage}/audit.json`));
  const audit = await read(`${page}/audit.json`);
  assert.equal(audit.lines_printed, 26);
  assert.equal(audit.lines_md, 26);
  assert.deepEqual(audit.errors, []);
  for (const row of inputs) {
    await verify(row.path, row.sha256);
    if (!/\/(?:page\.md|page\.json)$/.test(row.path)) {
      await verify(`${folder}/${path.relative(absolute(original), row.path)}`, row.sha256);
    }
  }
  const reportPath = `${folder}/report.json`;
  await immutableWrite(reportPath, serialize({
    schema: 'source198-first-punctuation-repair@1', ticket: 'STEMROBIN-181', batch: 'D033',
    status: 'TWO-LEAF-PUNCTUATION-REPAIR-NATIVE-PASS-AFFECTED-TEXT-REVIEW-PENDING',
    repairs, previousReview: await bind(reviewPath),
    originalFreeze: await bind(`${original}/author-freeze.json`),
    pageMD: await bind(`${page}/page.md`), pageJSON: await bind(`${page}/page.json`),
    audit: await bind(`${page}/audit.json`), native: await bind(nativePath),
    nativeInvocations: 1, rows: [26, 26], originalInputsUnchanged: true,
    figureFilesAndAuditUnchanged: true, onlyTwoMDLinesAndTwoJSONLeavesChanged: true,
    unrelatedStyleHOLDPreserved: true, historicalFAILHOLDPreserved: true,
    sourcePagesAdded: 0, completeCardsAdded: 0, completeCard: false,
    newImages: 0, parentImageCount: 24, noImageBudgetReset: true,
    newPaidGeneration: 0, newPermanentWorkersWorktreesBranches: 0,
    DBMergeDeployCommitPush: false,
  }));
  const outputs = [];
  for (const file of await walk(folder)) outputs.push(await bind(file));
  const freezePath = `${folder}/author-freeze.json`;
  await immutableWrite(freezePath, serialize({
    schema: 'source198-first-punctuation-repair-freeze@1', files: outputs, frozen: true,
    newImages: 0, parentImageCount: 24, unrelatedStyleHOLDPreserved: true,
  }));
  for (const file of [...outputs.map(row => row.path), freezePath]) await fs.chmod(absolute(file), 0o444);
  console.log(JSON.stringify({ report: await bind(reportPath), freeze: await bind(freezePath) }));
}

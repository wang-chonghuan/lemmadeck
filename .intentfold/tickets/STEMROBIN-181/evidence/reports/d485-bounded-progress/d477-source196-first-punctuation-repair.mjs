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
const original = `${ticket}/tmp/d453-source196-first-author`;
const folder = `${ticket}/tmp/d477-source196-first-punctuation-repair`;
const reviewPath = `${ticket}/tmp/d462-source196-first-independent-text-review/report.json`;
const review = await read(reviewPath);
assert.equal(review.checks.SOURCE196_TEXT, 'FAIL');
assert.equal(review.findings.length, 2);
const repairs = [
  { finding: 'D462-S196-PUNCT-01', block: 0, line: 0, mdLine: 74,
    before: '的折射角$\\varphi$，棱镜材料的折射率',
    after: '的折射角$\\varphi$、棱镜材料的折射率' },
  { finding: 'D462-S196-Q5-PUNCT-01', block: 13, line: 1, mdLine: 125,
    before: '通过另一个短边，能看到报上的文章吗；通过长边能看到吗？',
    after: '通过另一个短边；能看到报上的文章吗？通过长边能看到吗？' },
];
for (const repair of repairs) {
  const finding = review.findings.find(row => row.id === repair.finding);
  assert.equal(finding.verdict, 'FAIL');
  assert.equal(finding.pointer, `/blocks/${repair.block}/lines/${repair.line}`);
  assert.equal(finding.md_line, repair.mdLine);
}
const authorFreeze = await read(`${original}/author-freeze.json`);
const inputs = authorFreeze.files.filter(row => /\/(?:source|work)\/10p\/pages\/0196\//.test(row.path));
assert.equal(inputs.length, 17);
const page = `${folder}/source/10p/pages/0196`;
const originalPage = `${original}/source/10p/pages/0196`;
await verify(`${original}/report.json`, '56f63ecde0bf7e9d27397c67c7738eaf2158fa9c4091c1e2107c4e4bb201b6e9');

if (mode === '--prepare') {
  assert.equal(await exists(folder), false);
  for (const row of inputs) {
    await verify(row.path, row.sha256);
    await immutableWrite(`${folder}/${path.relative(absolute(original), row.path)}`, await bytes(row.path));
  }
  await immutableWrite(`${folder}/started.json`, serialize({
    ticket: 'STEMROBIN-181', batch: 'D033', repairs, inputs,
    previousReview: await bind(reviewPath), originalFreeze: await bind(`${original}/author-freeze.json`),
    proceduralHOLDPreserved: review.independent_basis.permission_seal_qualification,
    firstAndOnlyAffectedRepair: true, newImages: 0, parentImageCount: 24,
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
    '--book', '10p', '--page', '196',
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
  assert.equal(audit.lines_printed, 22);
  assert.equal(audit.lines_md, 22);
  assert.deepEqual(audit.errors, []);
  for (const row of inputs) {
    await verify(row.path, row.sha256);
    if (!/\/(?:page\.md|page\.json)$/.test(row.path)) {
      await verify(`${folder}/${path.relative(absolute(original), row.path)}`, row.sha256);
    }
  }
  const reportPath = `${folder}/report.json`;
  await immutableWrite(reportPath, serialize({
    schema: 'source196-first-punctuation-repair@1', ticket: 'STEMROBIN-181', batch: 'D033',
    status: 'TWO-LEAF-LITERAL-REPAIR-NATIVE-PASS-AFFECTED-TEXT-REVIEW-PENDING',
    repairs, previousReview: await bind(reviewPath), originalFreeze: await bind(`${original}/author-freeze.json`),
    pageMD: await bind(`${page}/page.md`), pageJSON: await bind(`${page}/page.json`),
    audit: await bind(`${page}/audit.json`), native: await bind(nativePath),
    nativeInvocations: 1, rows: [22, 22], originalInputsUnchanged: true,
    figureFilesAndAuditUnchanged: true, onlyTwoMDLinesAndTwoJSONLeavesChanged: true,
    proceduralHOLDPreserved: review.independent_basis.permission_seal_qualification,
    historicalFAILHOLDPreserved: true, sourcePagesAdded: 0, completeCardsAdded: 0,
    completeCard: false, newImages: 0, parentImageCount: 24, noImageBudgetReset: true,
    newPaidGeneration: 0, newPermanentWorkersWorktreesBranches: 0, DBMergeDeployCommitPush: false,
  }));
  const outputs = [];
  for (const file of await walk(folder)) outputs.push(await bind(file));
  const freezePath = `${folder}/author-freeze.json`;
  await immutableWrite(freezePath, serialize({
    schema: 'source196-first-punctuation-repair-freeze@1', files: outputs, frozen: true,
    newImages: 0, parentImageCount: 24, proceduralHOLDPreserved: true,
  }));
  for (const file of [...outputs.map(row => row.path), freezePath]) await fs.chmod(absolute(file), 0o444);
  console.log(JSON.stringify({ report: await bind(reportPath), freeze: await bind(freezePath),
    pageMD: await bind(`${page}/page.md`), pageJSON: await bind(`${page}/page.json`) }));
}

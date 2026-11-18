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
const original = `${ticket}/tmp/d435-source193195-first-author`;
const folder = `${ticket}/tmp/d459-source193194-first-literal-repair`;
const reviewPath = `${ticket}/tmp/d448-source193195-first-independent-text-review/report.json`;
const freezePath = `${original}/author-freeze.json`;
await verify(freezePath, 'd526a03674eb2b4bc8de98cd420bdb5d6812ac94d135832f6ba3589bf30e2cab');
const review = await read(reviewPath);
assert.equal(review.SOURCE193_TEXT, 'FAIL');
assert.equal(review.SOURCE194_TEXT, 'FAIL');
assert.equal(review.SOURCE195_TEXT, 'PASS');
assert.equal(review.findings.length, 2);
const repairs = [
  { page: 193, block: 1, line: 3, mdLine: 70, rows: 24,
    finding: 'D448-S193-PUNCT-01',
    before: '遵循着反射定律。反射角等于入射',
    after: '遵循着反射定律：反射角等于入射' },
  { page: 194, block: 3, line: 2, mdLine: 70, rows: 16,
    finding: 'D448-S194-WORD-01',
    before: '在上述所有情况下，空', after: '在上述所有情况中，空' },
];
for (const repair of repairs) {
  const finding = review.findings.find(row => row.id === repair.finding);
  assert.equal(finding.status, 'FIRST-TEXT-FAIL-OPEN');
  assert.equal(finding.candidate_literal, repair.before);
  assert.equal(finding.required_literal, repair.after);
}
const freeze = await read(freezePath);
const inputs = freeze.files.filter(row => /\/(?:source|work)\/10p\/pages\/019[34]\//.test(row.path));
assert.equal(inputs.length, 28);

if (mode === '--prepare') {
  assert.equal(await exists(folder), false);
  for (const row of inputs) {
    await verify(row.path, row.sha256);
    await immutableWrite(`${folder}/${path.relative(absolute(original), row.path)}`, await bytes(row.path));
  }
  await immutableWrite(`${folder}/started.json`, serialize({
    ticket: 'STEMROBIN-181', batch: 'D033', repairs,
    previousReview: await bind(reviewPath), originalFreeze: await bind(freezePath), inputs,
    opportunity: 'FIRST-AND-ONLY-AFFECTED-LITERAL-REPAIR',
    newImages: 0, parentImageCount: 24, historicalFAILHOLDPreserved: true,
  }));
  console.log(JSON.stringify({ prepared: await bind(`${folder}/started.json`), repairs }));
} else {
  const started = await read(`${folder}/started.json`);
  assert.deepEqual(started.repairs, repairs);
  await verify(reviewPath, started.previousReview.sha256);
  assert.equal(await exists(`${folder}/native-started.json`), false);
  const rows = [];
  for (const repair of repairs) {
    const name = String(repair.page).padStart(4, '0');
    const page = `${folder}/source/10p/pages/${name}`;
    const originalPage = `${original}/source/10p/pages/${name}`;
    const originalMD = (await bytes(`${originalPage}/page.md`)).toString('utf8');
    const originalJSON = await read(`${originalPage}/page.json`);
    assert.ok(originalJSON.blocks[repair.block].lines[repair.line].includes(repair.before));
    assert.equal(originalMD.split(repair.before).length, 2);
    assert.ok(originalMD.split('\n')[repair.mdLine - 1].includes(repair.before));
    assert.equal((await bytes(`${page}/page.md`)).toString('utf8'),
      originalMD.replace(repair.before, repair.after));
    assert.deepEqual(await read(`${page}/page.json`), originalJSON);
  }
  await immutableWrite(`${folder}/native-started.json`, serialize({
    pages: repairs.map(row => row.page), attemptsPerPage: 1, newImages: 0,
    noVectorizePrepareOrWholePipeline: true,
  }));
  for (const repair of repairs) {
    const name = String(repair.page).padStart(4, '0');
    const page = `${folder}/source/10p/pages/${name}`;
    const originalPage = `${original}/source/10p/pages/${name}`;
    const command = [
      '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
      '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize',
      '--book', '10p', '--page', String(repair.page),
      '--root', absolute(`${folder}/source`), '--work', absolute(`${folder}/work`),
    ];
    const result = spawnSync(command[0], command.slice(1), {
      cwd: root, encoding: 'utf8', timeout: 120000,
      env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
    });
    const nativePath = `${folder}/native-${name}.json`;
    await immutableWrite(nativePath, serialize({
      command, invocations: 1, exitCode: result.status,
      stdout: result.stdout, stderr: result.stderr,
    }));
    assert.equal(result.status, 0, result.stderr);
    const beforeJSON = await read(`${originalPage}/page.json`);
    const expectedJSON = structuredClone(beforeJSON);
    expectedJSON.blocks[repair.block].lines[repair.line] =
      expectedJSON.blocks[repair.block].lines[repair.line].replace(repair.before, repair.after);
    assert.deepEqual(await read(`${page}/page.json`), expectedJSON);
    assert.deepEqual(await bytes(`${page}/audit.json`), await bytes(`${originalPage}/audit.json`));
    const audit = await read(`${page}/audit.json`);
    assert.equal(audit.lines_printed, repair.rows);
    assert.equal(audit.lines_md, repair.rows);
    assert.deepEqual(audit.errors, []);
    rows.push({
      ...repair, pointer: `/blocks/${repair.block}/lines/${repair.line}`,
      pageMD: await bind(`${page}/page.md`), pageJSON: await bind(`${page}/page.json`),
      audit: await bind(`${page}/audit.json`), native: await bind(nativePath),
      rows: [repair.rows, repair.rows], auditUnchanged: true,
      onlyLiteralAndMatchingJSONLineChanged: true, nativeInvocations: 1,
    });
  }
  for (const row of inputs) await verify(row.path, row.sha256);
  for (const row of inputs.filter(row => !/\/(?:page\.md|page\.json)$/.test(row.path))) {
    await verify(`${folder}/${path.relative(absolute(original), row.path)}`, row.sha256);
  }
  const reportPath = `${folder}/report.json`;
  await immutableWrite(reportPath, serialize({
    schema: 'source193194-first-literal-repair@1', ticket: 'STEMROBIN-181', batch: 'D033',
    status: 'TWO-AFFECTED-NATIVE-PASS-ORIGINAL-INDEPENDENT-REVIEW-PENDING',
    pages: rows, previousReview: await bind(reviewPath), originalFreeze: await bind(freezePath),
    untouchedSOURCE195_TEXT: 'PASS-existing-d448-no-replay',
    originalInputsUnchanged: true, figureFilesUnchanged: true,
    sourcePagesAdded: 0, completeCardsAdded: 0, completeCard: false,
    newImages: 0, parentImageCount: 24, noImageBudgetReset: true,
    historicalFAILHOLDPreserved: true, DBMergeDeployCommitPush: false,
    newPaidGeneration: 0, newPermanentWorkersWorktreesBranches: 0,
  }));
  const outputs = [];
  for (const file of await walk(folder)) outputs.push(await bind(file));
  const repairedFreeze = `${folder}/author-freeze.json`;
  await immutableWrite(repairedFreeze, serialize({
    schema: 'source193194-first-repair-freeze@1', files: outputs, frozen: true,
    newImages: 0, parentImageCount: 24, previousFAILHOLDUnchanged: true,
  }));
  for (const file of [...outputs.map(row => row.path), repairedFreeze]) {
    await fs.chmod(absolute(file), 0o444);
  }
  console.log(JSON.stringify({ report: await bind(reportPath), freeze: await bind(repairedFreeze), pages: rows }));
}

import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, bytes, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

const mode = process.argv[2];
assert.ok(['--stage', '--finalize'].includes(mode));
assert.equal(process.argv.length, 3);
const folder = `${ticket}/tmp/d186-source168-emphasis-repair`;
const author = `${ticket}/tmp/d160-source168-author`;
const reviewPath = `${ticket}/tmp/d180-source168-first-review/report.json`;
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
await verify(reviewPath, '4aa8d530630e54617e78b2ac69d9e04d8f6e564313e2cd94e8f06187ee0ba280');
const review = await read(reviewPath);
assert.equal(review.SOURCE, 'HOLD');
assert.equal(review.RAW, 'PASS');
assert.equal(review.findings.length, 1);
assert.equal(review.findings[0].exactText, '\u6ce2\u7684\u901a\u91cf');
assert.deepEqual(review.findings[0].codePointRange0BasedHalfOpen, [4, 8]);
if (mode === '--stage') {
  assert.equal(await exists(`${folder}/started.json`), false);
  await fs.mkdir(absolute(folder), { recursive: true });
  for (const name of ['source', 'work']) {
    await fs.cp(absolute(`${author}/${name}`), absolute(`${folder}/${name}`),
      { recursive: true, force: false, errorOnExist: true });
  }
  await immutableWrite(`${folder}/started.json`, serialize({
    ticket: 'STEMROBIN-181', batch: 'D032', role: 'affected-source-notes-author',
    review: await bind(reviewPath),
    original: await bind(`${author}/source/10p/pages/0168/page.md`),
    scope: 'One exact under-dot span in existing notes. All source words, blocks, original author HOLD and pixels unchanged.',
    imagesOpened: 0, repairsPreviouslyUsed: 0, maximumLocalRepairs: 1,
  }));
  console.log(serialize({ staged: folder, next: 'Apply notes-only patch, then --finalize.' }));
} else {
  assert.equal(await exists(`${folder}/author-freeze.json`), false);
  const started = await read(`${folder}/started.json`);
  await verify(started.original.path, started.original.sha256);
  const page = `${folder}/source/10p/pages/0168/page.md`;
  const candidateBytes = await bytes(page);
  const originalBytes = await bytes(started.original.path);
  const split = buffer => buffer.toString('utf8').split('\n---\n');
  const before = split(originalBytes), after = split(candidateBytes);
  assert.equal(before.length, 2);
  assert.equal(after.length, 2);
  assert.equal(after[1], before[1]);
  const meta = text => JSON.parse(text.slice(4));
  const oldMeta = meta(before[0]), newMeta = meta(after[0]);
  assert.equal(newMeta.notes.length, oldMeta.notes.length + 1);
  assert.deepEqual(newMeta.notes.slice(1), oldMeta.notes);
  assert.deepEqual({ ...newMeta, notes: oldMeta.notes }, oldMeta);
  assert.ok(newMeta.notes[0].includes('under-dot'));
  assert.ok(newMeta.notes[0].includes('p0168#9'));
  assert.ok(newMeta.notes[0].includes('0-based half-open[4,8)'));
  const candidateBeforeFinalize = await bind(page);
  const command = [
    '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize',
    '--book', '10p', '--page', '168',
    '--root', absolute(`${folder}/source`), '--work', absolute(`${folder}/work`),
  ];
  const result = spawnSync(command[0], command.slice(1), {
    cwd: root, encoding: 'utf8', timeout: 120000,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  await immutableWrite(`${folder}/finalize.receipt.json`, serialize({
    command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  }));
  assert.equal(result.status, 0, result.stderr);
  const document = await read(`${folder}/source/10p/pages/0168/page.json`);
  const originalDocument = await read(`${author}/source/10p/pages/0168/page.json`);
  assert.deepEqual(document.blocks, originalDocument.blocks);
  assert.deepEqual(document.meta.notes, newMeta.notes);
  const unchangedFigures = [];
  for (const id of ['fig-128', 'fig-129']) {
    for (const suffix of ['png', 'svg']) {
      const path = `${folder}/work/10p/pages/0168/figures/${id}.${suffix}`;
      assert.deepEqual(await bytes(path),
        await bytes(`${author}/work/10p/pages/0168/figures/${id}.${suffix}`));
      unchangedFigures.push(await bind(path));
    }
  }
  await immutableWrite(`${folder}/author-freeze.json`, serialize({
    ticket: 'STEMROBIN-181', batch: 'D032', role: 'affected-source-notes-author',
    status: 'NATIVE-PASS-affected-independent-review-pending',
    original: started.original, firstReview: started.review,
    candidateBeforeFinalize,
    candidates: await Promise.all(['page.md', 'page.json', 'audit.json'].map(name =>
      bind(`${folder}/source/10p/pages/0168/${name}`))),
    receipt: await bind(`${folder}/finalize.receipt.json`),
    changedPointers: ['/meta/notes/0'],
    sourceBlocksUnchanged: true, originalHOLDUnchanged: true, unchangedFigures,
    repairsUsed: 1, sourceApproval: false, imagesOpened: 0,
    introductionRightOpenUnchanged: true, canonicalWrites: false,
  }));
  console.log(serialize({ freeze: await bind(`${folder}/author-freeze.json`),
    exitCode: result.status, sourceApproval: false, imagesOpened: 0 }));
}

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const folder = `${ticket}/tmp/d494-source198-first-preparation`;
const prior = `${ticket}/tmp/d487-source197-punctuation-first-detail-review/report.json`;
const previous = await read(prior);
assert.equal(previous.current_content_composition.SOURCE197_TEXT_content, 'PASS');
assert.equal(previous.current_content_composition.n75_right_tail,
  'OPEN after 两边缘; no unseen-page content supplied.');
const author = `${ticket}/tmp/d467-source197-first-author/report.json`;
await verify(author, 'c843c7d61f846da55ccf40d5bbba2ef0554e8ad4d87ffbe1a5897965631dcd17');
assert.equal((await read(author)).boundaries.future198_or_toc_inference, false);
assert.equal(await exists(folder), false);
await immutableWrite(`${folder}/started.json`, serialize({
  ticket: 'STEMROBIN-181', book: '10p', page: 198,
  reason: 'First next physical page only: n75 body is open and fig167 has not been observed.',
  priorLocalText: await bind(prior), priorAuthor: await bind(author),
  SOURCE197Wholepage: 'pending-first-composition', n75Complete: false,
  noImageOpens: true, noImageBudgetReset: true, humanResumeRemainsEffective: true,
}));
const command = [
  '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'prepare',
  '--book', '10p', '--page', '198',
  '--root', absolute(`${folder}/source`), '--work', absolute(`${folder}/work`),
];
const result = spawnSync(command[0], command.slice(1), {
  cwd: root, encoding: 'utf8', timeout: 120000,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
await immutableWrite(`${folder}/prepare-198.receipt.json`, serialize({
  command, invocations: 1, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
}));
assert.equal(result.status, 0, result.stderr);
const inputs = [];
for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) {
  inputs.push(await bind(`${folder}/work/10p/pages/0198/${name}`));
}
const manifestPath = `${folder}/manifest.json`;
await immutableWrite(manifestPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', book: '10p', pages: [198],
  status: 'FIRST-PREPARED-NOT-READ-NOT-AUTHORED-NOT-APPROVED',
  sourceRoot: `${folder}/source`, sourceWork: `${folder}/work`,
  inputs, prepareInvocations: 1, newImages: 0, parentImageCount: 24,
  noImageBudgetReset: true, sourcePagesAdded: 0, completeCardsAdded: 0,
  n75Complete: false, fig167Observed: false, newPaidGeneration: 0,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeployCommitPush: false,
}));
console.log(JSON.stringify(await bind(manifestPath)));

import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, read, bind, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const folder = `${ticket}/tmp/d644-source210-first-preparation`;
assert.equal(await exists(folder), false);
assert.equal(await exists('ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0210'), false);
const previous = await read('ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0209/page.json');
assert.equal(previous.blocks[7].open, true);
const tail = previous.blocks[7].lines.join('');
assert.ok(tail.endsWith('特殊'));
await fs.mkdir(absolute(`${folder}/source`), { recursive: true });
const command = [
  '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'prepare',
  '--book', '10p', '--page', '210', '--root', absolute(`${folder}/source`),
  '--work', absolute(`${folder}/work`),
];
await immutableWrite(`${folder}/started.json`, serialize({
  ticket: 'STEMROBIN-181', command, invocationsAuthorized: 1,
  reason: 'First actual continuation page after independently accepted SOURCE209; no guessed n79 text.',
  toc: await bind('ssot-resources/soviet10year-textbooks/toc/10p/zh.json'),
  previousSource209: await bind('ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0209/page.json'),
  previousTail: tail, priorRef: 'p0209#8', parentImageOpens: 0,
  n79Complete: false, previousOpenHOLDPreserved: true,
}));
const result = spawnSync(command[0], command.slice(1), {
  cwd: root, encoding: 'utf8', timeout: 120000,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
await immutableWrite(`${folder}/prepare-210.receipt.json`, serialize({
  command, invocations: 1, exitCode: result.status, signal: result.signal,
  error: result.error?.message ?? null, stdout: result.stdout, stderr: result.stderr,
}));
assert.equal(result.status, 0, result.stderr);
const inputs = [];
for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) {
  inputs.push(await bind(`${folder}/work/10p/pages/0210/${name}`));
}
await immutableWrite(`${folder}/manifest.json`, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', book: '10p', pages: [210],
  status: 'FIRST-PREPARED-NOT-READ-NOT-AUTHORED-NOT-APPROVED',
  sourceRoot: `${folder}/source`, sourceWork: `${folder}/work`, inputs,
  previousSource: await bind('ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0209/page.json'),
  priorTail: tail, priorRef: 'p0209#8', sourcePagesAdded: 0, completeCardsAdded: 0,
  parentImageCount: 24, newParentImages: 0, oldBudgetReset: false,
}));
console.log(JSON.stringify({ manifest: await bind(`${folder}/manifest.json`) }));

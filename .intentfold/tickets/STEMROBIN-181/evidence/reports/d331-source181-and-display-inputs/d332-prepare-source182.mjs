import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, read, bind, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const folder = `${ticket}/tmp/d332-source182-preparation`;
assert.equal(await exists(`${folder}/started.json`), false);
const previousPath = `${ticket}/evidence/reports/d285-bounded-progress/d279-source181-first-author/source/10p/pages/0181/page.json`;
const previousPage = await read(previousPath);
const last = previousPage.blocks.at(-2);
assert.equal(last.kind, 'p');
assert.equal(last.open, true);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const sourceRoot = `${folder}/source`, sourceWork = `${folder}/work`;
const previousObject = { ref: 'p0181#9', block: last };
await immutableWrite(`${folder}/started.json`, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', pages: [182],
  previousPage: await bind(previousPath), previousObject,
  previousPageStatus: 'SOURCE181-TEXT-PASS-RAW138-LOCAL-LABEL-HOLD',
  status: 'FIRST-PREPARATION-NOT-READ', newImageOpens: 0, canonicalWrites: false,
}));
const command = [
  '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'prepare',
  '--book', '10p', '--page', '182',
  '--root', absolute(sourceRoot), '--work', absolute(sourceWork),
];
const startedUtc = new Date().toISOString();
const result = spawnSync(command[0], command.slice(1), {
  cwd: root, encoding: 'utf8', timeout: 120000,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
await immutableWrite(`${folder}/prepare-182.receipt.json`, serialize({
  command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  startedUtc, finishedUtc: new Date().toISOString(), invocationCount: 1,
}));
assert.equal(result.status, 0, result.stderr);
const directory = `${sourceWork}/10p/pages/0182`;
await immutableWrite(`${folder}/manifest.json`, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', book: '10p', pages: [182],
  status: 'PREPARED-NOT-READ-NOT-AUTHORED-NOT-APPROVED',
  sourceRoot, sourceWork, previousPage: await bind(previousPath), previousObject,
  receipt: await bind(`${folder}/prepare-182.receipt.json`),
  inputs: await Promise.all(['page.png', 'page.grid.png', 'layout.json', 'page.template.md']
    .map(name => bind(`${directory}/${name}`))),
  sourcePagesAdded: 0, newImageOpens: 0, canonicalWrites: false,
  SOURCE182: 'not-observed', RAW139: 'not-observed', n69Complete: false,
}));
console.log(JSON.stringify({ manifest: await bind(`${folder}/manifest.json`), pages: [182] }));

import assert from 'node:assert/strict';
import {
  ticket, read, bytes, bind, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const base = `${ticket}/tmp/d031-n113-unit-repair`;
const folder = `${base}/attempt-2`;
assert.ok(!await exists(`${folder}/failure.json`));
const helper = `${ticket}/tmp/repair-d031-n113-unit-wrap.mjs`;
await immutableWrite(`${folder}/helper.mjs`, await bytes(helper));
assert.equal((await read(`${base}/render.json`)).exitCode, 0);
await immutableWrite(`${folder}/failure.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card: 'phy9-c2-s4-n113',
  status: 'fail-before-new-page-unit-count-assertion',
  command: ['node', helper, '--execute'], observedExitCode: 1,
  failedHelper: await bind(`${folder}/helper.mjs`),
  assertion: 'Old DOM normalization was expected to move four metric unit text nodes.',
  expected: 4, actual: 5,
  observedUnits: [
    { unit: '厘米', tex: '^2' }, { unit: '厘米', tex: '^2' },
    { unit: '厘米', tex: '^2\\times1800' },
    { unit: '米', tex: '^2' }, { unit: '米', tex: '^3' },
  ],
  successfulRenderReusedNext: await bind(`${base}/render.json`),
  nativeRuns: 1, browserRuns: 1, newPageChecks: 0, imageOpens: 0,
  disposition: 'Verify the five actual bound unit/power pairs; reuse the successful render and preserve all original files.',
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(`${folder}/failure.json`)));

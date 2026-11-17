import assert from 'node:assert/strict';
import {
  ticket, bytes, bind, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const folder = `${ticket}/tmp/d031-n113-unit-repair/attempt-1`;
assert.ok(!await exists(`${folder}/failure.json`));
const helper = `${ticket}/tmp/repair-d031-n113-unit-wrap.mjs`;
await immutableWrite(`${folder}/helper.mjs`, await bytes(helper));
await immutableWrite(`${folder}/failure.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card: 'phy9-c2-s4-n113',
  status: 'fail-pre-render-scope-assertion',
  command: ['node', helper, '--execute'], observedExitCode: 1,
  failedHelper: await bind(`${folder}/helper.mjs`),
  assertion: 'Changed source fields were expected to include only exercise-0.',
  expected: [['phy9-c2-s4-n113', 'exercise-0']],
  actual: [['phy9-c2-s4-n113', 'exercise-0'], ['phy9-c2-s4-n113', 'exercise-1']],
  disposition: 'Include both existing solved examples and four unit-power occurrences in focused display verification; keep approved exercise bytes unchanged.',
  nativeRuns: 0, browserRuns: 0, imageOpens: 0,
  limits: 'Records the observed assertion failure before rendering; original helper bytes preserved.',
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(`${folder}/failure.json`)));

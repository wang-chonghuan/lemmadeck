import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import {
  ticket, bind, immutableWrite,
} from '../retain-d016-evidence.mjs';
const require = createRequire(import.meta.url);
const { displayNumberForArtifact, sourceNumberForArtifact } =
  require('../../../../../.claude/skills/ld-s10y-lesson/tools/publish_merge.js');
const cases = [
  [{ number: '1', source_number: 1, text: '1. What is a wave?' }, ''],
  [{ number: 'g2-1', source_number: 1, text: ' 1.\nWhat is a wave?' }, ''],
  [{ number: '1', source_number: 1, text: 'What is a wave?' }, '1.'],
  [{ number: '1', source_number: 1, text: '1.25 m is the length.' }, '1.'],
  [{ number: '1', source_number: 1, text: '10. What is a wave?' }, '1.'],
  [{ number: 'q1', source_number: null, text: 'A question without a printed number.' }, ''],
  [{ number: '6', text: '6. What is the phase difference?' }, ''],
  [{ number: '6', text: 'What is the phase difference?' }, '6.'],
];
for (const [exercise, expected] of cases) {
  const before = structuredClone(exercise);
  const sourceNumber = sourceNumberForArtifact(exercise);
  assert.equal(displayNumberForArtifact(exercise), expected);
  assert.deepEqual(exercise, before);
  assert.equal(sourceNumberForArtifact(exercise), sourceNumber);
}
const report = `${ticket}/tmp/d048-numbering-repair/focused-result.json`;
await immutableWrite(report, `${JSON.stringify({
  status: 'PASS', cases: cases.length, textAndSourceIdentityUnchanged: true,
  script: await bind(process.argv[1]),
  tool: await bind('.claude/skills/ld-s10y-lesson/tools/publish_merge.js'),
  fullProjectTestsOrBuildRun: false,
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(report)));

import assert from 'node:assert/strict';
import {
  ticket, read, verify, bind, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const oldPath = `${ticket}/tmp/d172-t16-text-only-choice-author/zh-en.mapping.json`;
await verify(oldPath, '4a214bf0d7c497342dbe8b5df32e107f9d546c1018a4ac392b5ed6a2aed22a9a');
const original = await read(oldPath);
const output = `${ticket}/tmp/d175-t16-choice-q1-repair`;
const mapping = structuredClone(original);
mapping.entries[0] = await read(`${output}/q1.mapping-entry.json`);
assert.equal(mapping.entries[0].question_id, original.entries[0].question_id);
assert.deepEqual(mapping.entries.slice(1), original.entries.slice(1));
mapping.scope = 'Internal author mapping aligned to the sole q1 repair; original mapping preserved';
const outputPath = `${output}/zh-en.mapping.json`;
await immutableWrite(outputPath, `${JSON.stringify(mapping, null, 2)}\n`);
console.log(JSON.stringify({ mapping: await bind(outputPath), changedEntry: 't16-frame-reason',
  unchangedEntries: ['t16-dipole-coupling', 't16-propagation-conditions'] }));

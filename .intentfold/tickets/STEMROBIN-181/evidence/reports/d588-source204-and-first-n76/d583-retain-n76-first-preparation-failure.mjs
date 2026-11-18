import assert from 'node:assert/strict';
import {
  ticket, bytes, bind, exists, immutableWrite, walk,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const base = `${ticket}/tmp`;
const folder = `${base}/d581-n76-first-source-preparation`;
const receipt = `${base}/d583-n76-first-preparation-failure.json`;
assert.equal(await exists(receipt), false);
for (const file of ['started.json', 'assemble.json', 'adapt-prepare.json', 'manifest.json']) {
  assert.equal(await exists(`${folder}/${file}`), false);
}
const helper = `${base}/d581-prepare-n76-first-scoped-source.mjs`;
const frozenHelper = `${base}/d583-n76-first-preparation-failed-helper.mjs`;
await immutableWrite(frozenHelper, await bytes(helper));
const partialFiles = [];
for (const file of await walk(folder)) partialFiles.push(await bind(file));
await immutableWrite(receipt, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card: 'phy10-c2-s2-n76',
  status: 'FIRST-PREPARATION-FAILED-BEFORE-NATIVE-COMMANDS',
  command: ['node', helper, '--execute'], exitCode: 1,
  failure: {
    type: 'AssertionError', location: `${helper}:59`,
    assertion: "doc.blocks[0].lines.join('').startsWith('77. ')",
    reason: 'Verified faithful heading uses ideographic whitespace after 77.; ASCII-space-only assertion was wrong.',
    sourceChanged: false, sourceOrImageGateFailure: false,
  },
  helper: await bind(frozenHelper), partialFiles,
  nativeAssemblyRuns: 0, nativeModernPreparationRuns: 0,
  previousWritesPreserved: true, completeCard: false,
  historicalFAILHOLDPreserved: true, parentImageCount: 24,
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(receipt)));

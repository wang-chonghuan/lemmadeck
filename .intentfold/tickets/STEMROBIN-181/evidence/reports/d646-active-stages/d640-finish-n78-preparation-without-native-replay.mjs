import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  ticket, absolute, bytes, read, bind, immutableWrite, walk,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`, folder = `${base}/d639-n78-first-source-preparation`;
const card = 'phy10-c2-s2-n78';
const lessonPath = `${folder}/root/10p/lessons/${card}/lesson.json`;
const exercisesPath = `${folder}/root/10p/lessons/${card}/exercises.json`;
const lesson = await read(lessonPath), exercises = await read(exercisesPath);
const runs = [];
for (const stage of ['assemble', 'adapt-prepare']) {
  const file = `${folder}/${stage}.receipt.json`, receipt = await read(file);
  assert.equal(receipt.exitCode, 0);
  runs.push(await bind(file));
}
assert.equal(lesson.card_id, card);
assert.equal(lesson.prose.length, 15);
assert.equal(exercises.exercises.length, 0);
assert.deepEqual(lesson.figures.map(row => row.id), ['fig-181', 'fig-182', 'fig-183']);
assert.ok(lesson.prose.every(row => !row.source_refs.some(ref => /^p0209#[4-9]$/.test(ref))));
const failurePath = `${folder}/postcondition-helper-failure.json`;
await immutableWrite(failurePath, serialize({
  status: 'FAIL-HELPER-FIGURE-RECORD-TYPE-ASSUMPTION',
  helper: await bind(`${base}/d639-prepare-n78-first-scoped-source.mjs`),
  source: lesson.figures, expectedByFailedHelper: ['fig-181', 'fig-182', 'fig-183'],
  commandExitCode: 1, nativeRuns: runs, nativeSuccessful: true,
  cause: 'The helper compared figure records directly to string IDs. Native output conforms to its record contract.',
  sourceOrNativeBytesModified: false, nativeReruns: 0,
}));
const started = await read(`${folder}/started.json`);
await immutableWrite(`${folder}/manifest.json`, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', card,
  status: 'FIRST-SCOPED-SOURCE-CLOSED-MODERN-TEXT-PENDING-HELPER-FAIL-PRESERVED',
  inputs: started.inputs, projections: started.projections,
  sourceAuthority: started.sourceAuthority, runs,
  sourceLesson: await bind(lessonPath), sourceExercises: await bind(exercisesPath),
  rawRoot: `${folder}/root`, work: `${folder}/work`,
  templateDirectory: `${folder}/work/adapt/10p/modern-us-neutral/lessons/${card}`,
  sourceQuestions: 0, proseBlocks: lesson.prose.length, figures: lesson.figures.map(row => row.id),
  originalPreauthorBaseline: await bind(`${base}/d619-n78-preauthor-source206207-requirements/source-requirements.json`),
  sourceRefMapping: 'Scoped source206 refs #1,#2,#3 map to canonical #12,#13,#14; footer #4 maps #15. Other refs unchanged.',
  originalHelperFailure: await bind(failurePath), helperTypeRepairOnly: true,
  sourcePagesAdded: 0, completeCardsAdded: 0, incompleteN79Excluded: true,
  SCI: 'NOT-AUTHORED', ZHEN: 'NOT-AUTHORED', FIG: 'PENDING-FIRST-MODERN', DISPLAY: 'NOT-RUN',
  imageOpens: 0, parentImageCount: 24, oldBudgetReset: false, historicalFAILHOLDPreserved: true,
  nativeReruns: 0, DBMergeDeploy: false,
}));
const files = [];
for (const file of await walk(folder)) files.push(await bind(file));
await immutableWrite(`${folder}/preparation-freeze.json`, serialize({ files, status: 'FROZEN-NATIVE-PASS-HELPER-FAIL-PRESERVED' }));
for (const file of [...files.map(row => row.path), `${folder}/preparation-freeze.json`,
  `${base}/d639-prepare-n78-first-scoped-source.mjs`]) await fs.chmod(absolute(file), 0o444);
console.log(JSON.stringify({ manifest: await bind(`${folder}/manifest.json`), nativeReruns: 0 }));

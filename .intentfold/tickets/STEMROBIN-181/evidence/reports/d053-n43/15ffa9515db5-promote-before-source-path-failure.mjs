import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, evidence, indexPath, absolute, relative, bytes, read,
  bind, verify, exists, immutableWrite, walk, hash,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const card = 'phy10-c1-s5-n43';
const nativePath = `${ticket}/tmp/d050-n43-native/result.json`;
const displayPath = `${ticket}/tmp/d053-n43-display-review.json`;
await verify(displayPath, '9d581cf2aef3313b1f832e5a33955eff55f12ebb5d38e136bd68959d4791004f');
const display = await read(displayPath);
assert.equal(display.status, 'PASS');
assert.equal(display.allRequiredTilesActuallyOpened, true);
const native = await read(nativePath);
assert.equal(native.card, card);
assert.equal(native.counts.tasks, 0);
assert.equal(native.status, 'PASS-native-bilingual-display-pending');
await verify(native.manifest.path, native.manifest.sha256);
const manifest = await read(native.manifest.path);
assert.equal(manifest.SCI, 'PASS');
assert.equal(manifest.ZHEN, 'PASS');
for (const row of [...native.inputs, ...manifest.reports]) await verify(row.path, row.sha256);
const raw = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const modern = `${raw}/editions/modern-us-neutral`;
const folder = `${ticket}/tmp/d053-n43-promotion`;
assert.equal(await exists(`${folder}/started.json`), false);
const meterPath = `${ticket}/production-meter.json`;
const protectedPaths = [
  '.claude/skills/ld-s10y-lesson/tools/assemble.py',
  '.claude/skills/ld-s10y-lesson/tools/edition.py',
];
const protectedFiles = await Promise.all(protectedPaths.map(bind));
const before = await Promise.all([`${raw}/book.json`, `${modern}/book.json`,
  indexPath, meterPath].map(async file => ({ file, data: await bytes(file) })));
const index = JSON.parse(before[2].data);
const meter = JSON.parse(before[3].data);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 93);
assert.deepEqual(meter.currentCheckpoint.completeUnbatchedCards, []);
await immutableWrite(`${folder}/started.json`, `${JSON.stringify({
  card, native: await bind(nativePath), display: await bind(displayPath), protectedFiles,
  policy: 'Consume exact existing approvals. No native rerender, SOURCE replay, DB or Git action.',
}, null, 2)}\n`);
const retention = new Map();
async function retain(file) {
  file = relative(file);
  if (!retention.has(file)) {
    const target = `${evidence}/reports/d053-n43/${hash(Buffer.from(file)).slice(0, 12)}-${path.basename(file)}`;
    await immutableWrite(target, await bytes(file));
    const row = { ...await bind(target), originalPath: file, batch: 'D030' };
    index.reports.push(row);
    retention.set(file, row);
  }
  return retention.get(file);
}
for (const directory of [
  `${ticket}/tmp/d050-n43-native`,
  `${ticket}/tmp/d051-n43-independent-figure-review`,
  `${ticket}/tmp/d051-n43-browser-figure-diagnostic`,
  `${ticket}/tmp/d053-sound-display/run-f06381fd734a-2026-11-17T13-56-14-800Z`,
]) for (const file of await walk(directory)) await retain(file);
for (const file of [native.manifest.path, displayPath, display.contractAdjudication.path,
  ...manifest.reports.map(row => row.path),
  ...manifest.languages.flatMap(row => ['lesson', 'exercises', 'figures'].map(kind => row[kind].path)),
]) await retain(file);
const outputs = [];
async function output(target, data) {
  assert.equal(await exists(target), false, `Refuse overwrite: ${target}`);
  await immutableWrite(target, data);
  const binding = await bind(target);
  outputs.push(binding);
  return binding;
}
async function command(name, argv) {
  const result = spawnSync(argv[0], argv.slice(1), {
    cwd: root, encoding: 'utf8', timeout: 180000, maxBuffer: 16 * 1024 * 1024,
  });
  const file = `${folder}/${name}.json`;
  await immutableWrite(file, `${JSON.stringify({
    command: argv, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  }, null, 2)}\n`);
  assert.equal(result.status, 0, `${name}: ${result.stdout}\n${result.stderr}`);
  return retain(file);
}
const zh = native.languages.find(row => row.language === 'zh');
for (const row of zh.nativeOutputs) await verify(row.path, row.sha256);
for (const name of ['lesson.json', 'lesson.md', 'exercises.json'])
  await output(`${raw}/lessons/${card}/${name}`,
    await bytes(`${zh.nativeRoot}/10p/lessons/${card}/${name}`));
for (const name of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json'])
  await output(`${modern}/lessons/${card}/${name}`,
    await bytes(`${zh.root}/10p/editions/modern-us-neutral/lessons/${card}/${name}`));
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
for (const figure of manifest.figures) {
  assert.equal(figure.mode, 'deterministic');
  const file = name => figure.files.find(row => row.name === `${figure.id}.${name}`).path;
  for (const row of [...figure.files, figure.independentReview]) await verify(row.path, row.sha256);
  const spec = await read(file('spec.json'));
  assert.ok(!relative(spec.source.image.path).startsWith(`${ticket}/tmp/`));
  await verify(spec.source.image.path, spec.source.image.sha256);
  const specBinding = await output(`${modern}/figures/${figure.id}.spec.json`, await bytes(file('spec.json')));
  const svgBinding = await output(`${modern}/figures/${figure.id}.svg`, await bytes(file('svg')));
  const render = await read(file('render.json'));
  render.spec = specBinding;
  render.output.svg = svgBinding;
  const renderBinding = await output(`${modern}/figures/${figure.id}.render.json`,
    `${JSON.stringify(render, null, 2)}\n`);
  const independentPath = `${modern}/figures/${figure.id}.independent-review.json`;
  await output(independentPath, `${JSON.stringify({
    schema: 'ld-s10y-image/promoted-independent-review@1', figure: figure.id, status: 'pass',
    originalReport: await retain(figure.independentReview.path),
    fullCardDisplay: await retain(displayPath), spec: specBinding,
    output: svgBinding, render: renderBinding, geometryUnchanged: true,
  }, null, 2)}\n`);
  const reviewPath = `${modern}/figures/${figure.id}.review.json`;
  await command(`${figure.id}-durable-review`, [python, '-B',
    '.agents/skills/ld-s10y-image/scripts/record_review.py',
    '--spec', specBinding.path, '--render', renderBinding.path, '--output', reviewPath,
    '--status', 'pass', '--notes',
    `Exact independent figure and full-card display receipts consumed: ${independentPath}. No new substantive review or render.`,
  ]);
  outputs.push(await bind(reviewPath));
}
const sourceIndex = JSON.parse(before[0].data);
const candidateIndex = await read(`${zh.nativeRoot}/10p/book.json`);
const sourceRow = candidateIndex.lessons.find(row => row.id === card);
assert.ok(sourceRow);
assert.ok(!sourceIndex.lessons.some(row => row.id === card));
sourceIndex.lessons.push(sourceRow);
sourceIndex.audit.exercise_count = sourceIndex.lessons.reduce((sum, row) => sum + row.exercises, 0);
sourceIndex.audit.figure_numbers = [...new Set([
  ...sourceIndex.audit.figure_numbers, 81, 82,
])].sort((a, b) => a - b);
const candidateModernIndex = await read(`${zh.nativeRoot}/10p/editions/modern-us-neutral/book.json`);
const modernRow = candidateModernIndex.lessons.find(row => (row.card_id ?? row.id ?? row.lesson) === card);
assert.ok(modernRow);
await immutableWrite(`${folder}/modern-rows.json`, `${JSON.stringify([modernRow], null, 2)}\n`);
for (const row of before) assert.deepEqual(await bytes(row.file), row.data);
await fs.writeFile(absolute(`${raw}/book.json`), `${JSON.stringify(sourceIndex, null, 2)}\n`);
const code = [
  'import sys,json', 'from pathlib import Path',
  "sys.path.insert(0,'.claude/skills/ld-s10y-lesson/tools')", 'import edition',
  'book,modern,rows,profile=map(Path,sys.argv[1:])',
  'edition.update_book_index(book,modern,profile,json.loads(rows.read_text()))',
].join('\n');
const indexCommand = await command('native-modern-index', [python, '-B', '-c', code,
  raw, modern, `${folder}/modern-rows.json`, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json']);
assert.deepEqual((await read(`${modern}/book.json`)).lessons.filter(row =>
  (row.card_id ?? row.id ?? row.lesson) !== card), JSON.parse(before[1].data).lessons);
for (const row of protectedFiles) await verify(row.path, row.sha256);
const readyPath = `${evidence}/reports/d053-n43-readiness.json`;
await immutableWrite(readyPath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card, status: 'complete-unbatched-local-only',
  SOURCE: 'PASS', SCI: 'PASS', ZHEN: 'PASS', fullCardDisplayPASS: true,
  native: await retain(nativePath), manifest: await retain(native.manifest.path),
  displayReview: await retain(displayPath), outputs, indexCommand,
  counts: { tasks: 0, choiceQuestions: 0, choiceOptions: 0,
    readOnlyStandardAnswers: 0, modernFigures: 2 },
  existingGatesConsumed: true, parentImageOpens: 21, canonicalPromotion: true,
  limits: 'Offline completion only. Not yet committed or pushed; no DB, formal handoff, merge or deploy.',
}, null, 2)}\n`);
index.reports.push(await bind(readyPath));
index.updatedAt = new Date().toISOString();
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
meter.currentCheckpoint.completeUnbatchedCards.push(card);
meter.currentCheckpoint.modernReadyArtifacts = 94;
meter.currentCheckpoint.nextBatch.completeCards = [card];
meter.currentCheckpoint.nextBatch.latestReadiness = await bind(readyPath);
meter.currentCheckpoint.readyDoesNotMeanDelivered = '93 delivered cards; n43 is complete offline and awaits D030 batch commit/push.';
meter.updatedAt = new Date().toISOString();
await fs.writeFile(absolute(meterPath), `${JSON.stringify(meter, null, 2)}\n`);
await immutableWrite(`${folder}/result.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D030', status: 'PASS-local-promotion',
  readiness: await bind(readyPath), retained: [...retention.values()],
}, null, 2)}\n`);
console.log(JSON.stringify({ readiness: await bind(readyPath), outputs: outputs.length }));

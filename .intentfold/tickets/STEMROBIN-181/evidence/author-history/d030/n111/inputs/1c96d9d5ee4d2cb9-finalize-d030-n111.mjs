import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  ticket, absolute, read, bytes, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const card = 'phy9-c2-s4-n111';
const folder = `${ticket}/tmp/d030-n111-native`;
const raw = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const modern = `${raw}/editions/modern-us-neutral`;
const candidate = `${ticket}/tmp/d029-n111-source-candidate/artifacts/9p`;
const build = `${ticket}/tmp/d030-n111-build`;
const inputRoot = `${build}/work/adapt/9p/modern-us-neutral/lessons/${card}`;
const work = `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${card}`;
const sciencePath = `${ticket}/tmp/9p-n111-science-effective-review.json`;
const gatePath = `${ticket}/tmp/9p-n111-figure-review.json`;
await verify(sciencePath, 'fbb5591c9a1c11a547074dffb7c2cee01bfc4a66be2bb03ca569805a0a89a620');
await verify(gatePath, 'c6fae1157df8439fcfc3cd844379af03ca772521a803d9552ed5000b90dc5a8d');
const science = await read(sciencePath);
const gate = await read(gatePath);
assert.equal(science.status, 'PASS');
assert.equal(science.effectiveLessonTextSCIApproval, true);
assert.equal(gate.status, 'PASS');
assert.deepEqual(gate.figures.map(row => row.figure), ['fig-224', 'fig-225', 'fig-226']);
assert.ok(!await exists(`${folder}/started.json`));
for (const binding of science.fileBindings)
  await verify(path.resolve(science.roots[binding.base], binding.path), binding.sha256);
for (const binding of [gate.inputs.completeChinese, gate.inputs.completeEnglish, gate.inputs.authorFreeze])
  await verify(binding.path, binding.sha256);
const protectedFiles = await Promise.all([
  ...['lesson.json', 'lesson.md', 'exercises.json'].map(name =>
    `${raw}/lessons/phy9-c2-s4-n107/${name}`),
  ...['lesson.json', 'lesson.md', 'exercises.json'].map(name =>
    `${candidate}/lessons/${card}/${name}`),
  `${ticket}/production-meter.json`, `${ticket}/evidence/index.json`,
].map(bind));
const sourceLesson = await read(`${candidate}/lessons/${card}/lesson.json`);
assert.equal((await read(`${candidate}/lessons/${card}/exercises.json`)).count, 0);
assert.deepEqual(sourceLesson.figures.map(row => row.id), ['fig-224', 'fig-225', 'fig-226']);
assert.deepEqual(sourceLesson.prose.at(-1).source_refs, ['p0274#6']);
assert.ok(!await exists(`${raw}/lessons/${card}/lesson.json`));
assert.ok(!await exists(`${work}/lesson.template.json`));
for (const row of gate.figures) {
  assert.equal(row.status, 'pass');
  for (const binding of [row.source, row.spec, row.render, row.outputs.svg])
    await verify(binding.path, binding.sha256);
  assert.ok(!await exists(`${modern}/figures/${row.figure}.spec.json`));
}
const priorSourceIndex = `${folder}/before/source-book.json`;
const priorModernIndex = `${folder}/before/modern-book.json`;
await immutableWrite(priorSourceIndex, await bytes(`${raw}/book.json`));
await immutableWrite(priorModernIndex, await bytes(`${modern}/book.json`));
await immutableWrite(`${folder}/started.json`, `${JSON.stringify({
  card, science: await bind(sciencePath), gate: await bind(gatePath),
  inputs: await Promise.all(['lesson', 'exercises', 'figures'].map(name =>
    bind(`${inputRoot}/${name}.template.json`))),
  protectedFiles, priorSourceIndex: await bind(priorSourceIndex),
  priorModernIndex: await bind(priorModernIndex),
  sourceClosure: { lastRef: 'p0274#6', nextHeadingRef: 'p0274#7', tasks: 0 },
  metadataPolicy: 'Preserve exact isolated source bytes and null ancestors, not reconstruct gap-contaminated107.',
}, null, 2)}\n`);
for (const name of ['lesson.json', 'lesson.md', 'exercises.json'])
  await immutableWrite(`${raw}/lessons/${card}/${name}`, await bytes(`${candidate}/lessons/${card}/${name}`));
for (const name of ['lesson', 'exercises', 'figures']) {
  await immutableWrite(`${work}/${name}.template.json`, await bytes(`${inputRoot}/${name}.template.json`));
  await fs.chmod(absolute(`${work}/${name}.template.json`), 0o644);
}
const sourceIndex = await read(`${raw}/book.json`);
assert.ok(!sourceIndex.lessons.some(row => row.id === card));
const sourceEntry = (await read(`${candidate}/book.json`)).lessons.find(row => row.id === card);
assert.ok(sourceEntry);
sourceIndex.lessons.push(sourceEntry);
sourceIndex.audit.figure_numbers = [...new Set([
  ...sourceIndex.audit.figure_numbers, 224, 225, 226,
])].sort((a, b) => a - b);
await fs.writeFile(absolute(`${raw}/book.json`), `${JSON.stringify(sourceIndex, null, 2)}\n`);
const adapterPath = `${ticket}/tmp/d030-n111-promotion-review.json`;
const adapter = {
  schema: 'ld-s10y-image/promotion-input-adapter@1', status: 'pass',
  independentReview: await bind(gatePath), scientificReview: await bind(sciencePath),
  noNewSemanticReview: true,
  figures: gate.figures.map(row => ({
    ...row, id: row.figure, contextKind: 'lesson',
    bindings: {
      source: row.source, spec: row.spec, render: row.render, svg: row.outputs.svg,
      context: gate.inputs.completeChinese, lesson: gate.inputs.completeChinese,
    },
  })),
};
await immutableWrite(adapterPath, `${JSON.stringify(adapter, null, 2)}\n`);
for (const report of [gatePath, sciencePath, adapterPath])
  await immutableWrite(report.replace('/tmp/', '/evidence/reports/'), await bytes(report));
const run = async (name, command) => {
  const result = spawnSync(command[0], command.slice(1), {
    encoding: 'utf8', timeout: 180000, maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  const receipt = `${folder}/${name}.json`;
  await immutableWrite(receipt, `${JSON.stringify({
    command, exitCode: result.status, signal: result.signal,
    stdout: result.stdout ?? '', stderr: result.stderr ?? '',
  }, null, 2)}\n`);
  assert.equal(result.status, 0, `${name}: ${result.stderr}\n${result.stdout}`);
  return bind(receipt);
};
const promotions = [];
for (const row of gate.figures)
  promotions.push(await run(`promote-${row.figure}`, [process.execPath,
    `${ticket}/tmp/promote-d005-figure.mjs`, '9p', card, row.figure, adapterPath]));
const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py'];
const finalize = await run('adapt-finalize', [...command, 'adapt-finalize',
  '--book', '9p', '--edition', 'modern-us-neutral', '--lesson', card]);
assert.equal((await read(`${modern}/lessons/${card}/adaptation.audit.json`)).status, 'pass');
assert.equal((await read(`${modern}/lessons/${card}/exercises.json`)).count, 0);
const render = await run('render', [...command, 'render',
  '--book', '9p', '--edition', 'modern-us-neutral', '--lesson', card]);
for (const binding of protectedFiles) await verify(binding.path, binding.sha256);
const output = `${folder}/result.json`;
await immutableWrite(output, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card, status: 'pass-native-display-and-retention-pending',
  science: await bind(sciencePath), gate: await bind(gatePath),
  adapter: await bind(adapterPath), promotions, finalize, render, protectedFiles,
  outputs: await Promise.all(['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
    .map(name => bind(`${modern}/lessons/${card}/${name}`))),
  html: await Promise.all(['text', 'exercises'].map(name =>
    bind(`.tmp/ld-s10y-lesson/render/9p/modern-us-neutral/${card}/${name}.html`))),
  sourceIndexAfter: await bind(`${raw}/book.json`), modernIndexAfter: await bind(`${modern}/book.json`),
  priorSourceIndex: await bind(priorSourceIndex), priorModernIndex: await bind(priorModernIndex),
  counts: { workedExamples: 0, sourceTasks: 0, newUnsolvedTasks: 0 },
  limits: 'One current SCI/figure approval consumed, byte-exact isolated source retained and indexed without main assembly, three promotions and one native finalize/render. No image reopened, DB/app/dependency/full tests, delivery or formalhandoff claim. Historic evidence path retention still required.',
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(output)));

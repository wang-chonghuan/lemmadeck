import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  ticket, read, bytes, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

const [execute, number, scienceSha, gateSha] = process.argv.slice(2);
assert.equal(execute, '--execute');
assert.ok(['101', '105'].includes(number));
for (const sha of [scienceSha, gateSha]) assert.match(sha ?? '', /^[a-f0-9]{64}$/);
const card = `phy9-c2-s4-n${number}`;
const sourceRoot = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const modernRoot = `${sourceRoot}/editions/modern-us-neutral`;
const tmp = `${ticket}/tmp`;
const folder = `${tmp}/d025-${number}-native`;
assert.ok(!await exists(`${folder}/started.json`), 'Do not replay finalization.');
const effective = `${tmp}/9p-n${number}-science-effective-review.json`;
const sciencePath = await exists(effective) ? effective : `${tmp}/9p-n${number}-science-review.json`;
const effectiveGate = `${tmp}/9p-n${number}-figure-effective-review.json`;
const gatePath = await exists(effectiveGate) ? effectiveGate : `${tmp}/9p-n${number}-figure-review.json`;
await verify(sciencePath, scienceSha);
await verify(gatePath, gateSha);
const science = await read(sciencePath);
const gate = await read(gatePath);
assert.equal(science.status, 'pass');
assert.equal(gate.status, 'pass');
await immutableWrite(gatePath.replace('/tmp/', '/evidence/reports/'), await bytes(gatePath));
const templateRoot = `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${card}`;
const source = await read(`${sourceRoot}/lessons/${card}/lesson.json`);
const sourceExercises = await read(`${sourceRoot}/lessons/${card}/exercises.json`);
assert.equal(sourceExercises.count, 0);
assert.equal((await read(`${templateRoot}/exercises.template.json`)).count, 0);
assert.deepEqual(gate.figures.map(row => row.id).sort(), source.figures.map(row => row.id).sort());
const consumedBindings = [];
for (const [name, binding] of Object.entries(science.bindings)) {
  if (!binding?.path || !binding.sha256) continue;
  await verify(binding.path, binding.sha256);
  const snapshot = `${folder}/before/${name}.snapshot`;
  await immutableWrite(snapshot, await bytes(binding.path));
  consumedBindings.push({ name, originalPath: binding.path, ...await bind(snapshot) });
}
const lessonBinding = await bind(`${templateRoot}/lesson.template.json`);
for (const figure of gate.figures) {
  assert.equal(figure.status, 'pass');
  assert.equal((figure.bindings.lesson ?? figure.bindings.context).sha256, lessonBinding.sha256);
  assert.ok(!await exists(`${modernRoot}/figures/${figure.id}.spec.json`));
}
const priorIndex = `${folder}/before/book.json`;
await immutableWrite(priorIndex, await bytes(`${modernRoot}/book.json`));
const commandRunner = async (name, command) => {
  assert.ok(!await exists(`${folder}/${name}.json`));
  const result = spawnSync(command[0], command.slice(1), {
    encoding: 'utf8', timeout: 180000, maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  await immutableWrite(`${folder}/${name}.json`, `${JSON.stringify({
    command, exitCode: result.status, signal: result.signal,
    stdout: result.stdout ?? '', stderr: result.stderr ?? '',
  }, null, 2)}\n`);
  assert.equal(result.status, 0, `${name}: ${result.stderr}\n${result.stdout}`);
  return bind(`${folder}/${name}.json`);
};
const inputs = await Promise.all(['lesson', 'exercises', 'figures'].map(name =>
  bind(`${templateRoot}/${name}.template.json`)));
await immutableWrite(`${folder}/started.json`, `${JSON.stringify({
  card, inputs, consumedBindings, science: await bind(sciencePath), gate: await bind(gatePath),
  source: await bind(`${sourceRoot}/lessons/${card}/lesson.json`),
  sourceExercises: await bind(`${sourceRoot}/lessons/${card}/exercises.json`),
  priorIndex: await bind(priorIndex), helper: await bind(`${tmp}/finalize-d025-card.mjs`),
}, null, 2)}\n`);
const promoted = [];
for (const figure of gate.figures) {
  const command = [process.execPath, `${tmp}/promote-d005-figure.mjs`, '9p', card, figure.id, gatePath];
  promoted.push({ id: figure.id, command: await commandRunner(`promote-${figure.id}`, command) });
}
const native = await commandRunner('adapt-finalize', [
  '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'adapt-finalize',
  '--book', '9p', '--edition', 'modern-us-neutral', '--lesson', card,
]);
const outputRoot = `${modernRoot}/lessons/${card}`;
assert.equal((await read(`${outputRoot}/adaptation.audit.json`)).status, 'pass');
const outputs = await Promise.all(['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
  .map(name => bind(`${outputRoot}/${name}`)));
const render = await commandRunner('render', [
  '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'render',
  '--book', '9p', '--edition', 'modern-us-neutral', '--lesson', card,
]);
const html = await Promise.all(['text', 'exercises'].map(surface =>
  bind(`.tmp/ld-s10y-lesson/render/9p/modern-us-neutral/${card}/${surface}.html`)));
const receiptPath = `${folder}/result.json`;
await immutableWrite(receiptPath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D025', card, status: 'pass-native-display-pending',
  science: await bind(sciencePath), gate: await bind(gatePath), consumedBindings,
  promoted, native, render, outputs, html, priorIndex: await bind(priorIndex),
  counts: { workedExamples: 0, sourceTasks: 0, newUnsolvedTasks: 0 },
  limits: 'Owning independent SCI/figure results consumed. One promotion/finalize/render per new candidate; no repeated review, n5 rerender, DB, full tests or card-delivery claim.',
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(receiptPath)));

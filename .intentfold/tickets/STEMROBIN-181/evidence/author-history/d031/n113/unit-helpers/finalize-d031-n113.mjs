import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  ticket, read, bytes, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const card = 'phy9-c2-s4-n113';
const tmp = `${ticket}/tmp`;
const folder = `${tmp}/d031-n113-native`;
const raw = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const modern = `${raw}/editions/modern-us-neutral`;
const template = `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${card}`;
assert.ok(!await exists(`${folder}/started.json`));
assert.ok(!await exists(`${modern}/lessons/${card}/lesson.json`));
const sciencePath = `${tmp}/9p-n113-science-review.json`;
await verify(sciencePath, 'a737213742ab0bb257fe29a829b7c75f1e16d1bfcee376870208add938906fe7');
assert.equal((await read(sciencePath)).status, 'SCI-PASS');
await verify(`${template}/lesson.template.json`, '02f5ac696bc97024c53f1b54d76ff930ee1a5a798794a22e3e995e7b2d24adcc');
await verify(`${template}/exercises.template.json`, 'a8823035c2fccf544a51273b4a258c7354c0fdbaa4a1693a06d521720b433c99');
const gates = [
  `${tmp}/d031-n113-figures-a-independent-review.json`,
  `${tmp}/d031-n113-figures-b-effective-review.json`,
];
const reviews = await Promise.all(gates.map(read));
assert.ok(reviews.every(row => row.status === 'pass'));
assert.deepEqual(reviews.flatMap(row => row.figures.map(figure => figure.id)),
  ['fig-229', 'fig-230', 'fig-231', 'fig-232']);
for (const review of reviews) {
  for (const figure of review.figures) {
    assert.equal(figure.status, 'pass');
    for (const binding of Object.values(figure.bindings))
      if (binding.path && binding.sha256) await verify(binding.path, binding.sha256);
    assert.ok(await exists(`${modern}/figures/${figure.id}.review.json`));
    const bindingPath = `${ticket}/evidence/reports/d031-${figure.id}-promotion-binding.json`;
    assert.equal((await read(bindingPath)).status, 'pass-promotion-path-only-binding');
  }
}
const protectedFiles = await Promise.all([
  `${raw}/book.json`, `${ticket}/production-meter.json`, `${ticket}/evidence/index.json`,
  ...['phy9-c2-s4-n107', card, 'phy9-c2-s5-n114'].flatMap(id =>
    ['lesson.json', 'lesson.md', 'exercises.json'].map(name => `${raw}/lessons/${id}/${name}`)),
  ...['phy9-c2-s4-n111', 'phy9-c2-s5-n114'].flatMap(id =>
    ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
      .map(name => `${modern}/lessons/${id}/${name}`)),
].map(bind));
const beforeIndex = await read(`${modern}/book.json`);
await immutableWrite(`${folder}/before/modern-book.json`, await bytes(`${modern}/book.json`));
await immutableWrite(`${folder}/started.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card, science: await bind(sciencePath),
  figures: await Promise.all(gates.map(bind)), protectedFiles,
  inputs: await Promise.all(['lesson', 'exercises', 'figures'].map(name =>
    bind(`${template}/${name}.template.json`))),
}, null, 2)}\n`);
async function run(name, command) {
  const result = spawnSync(command[0], command.slice(1), {
    encoding: 'utf8', timeout: 180000, maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  const file = `${folder}/${name}.json`;
  await immutableWrite(file, `${JSON.stringify({
    command, exitCode: result.status, signal: result.signal,
    stdout: result.stdout ?? '', stderr: result.stderr ?? '',
  }, null, 2)}\n`);
  assert.equal(result.status, 0, `${name}: ${result.stderr}\n${result.stdout}`);
  return bind(file);
}
const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py'];
const finalize = await run('adapt-finalize', [...command, 'adapt-finalize',
  '--book', '9p', '--edition', 'modern-us-neutral', '--lesson', card]);
const outputRoot = `${modern}/lessons/${card}`;
assert.equal((await read(`${outputRoot}/adaptation.audit.json`)).status, 'pass');
assert.equal((await read(`${outputRoot}/exercises.json`)).count, 2);
const afterIndex = await read(`${modern}/book.json`);
assert.deepEqual(afterIndex.lessons.filter(row => row.id !== card), beforeIndex.lessons);
const render = await run('render', [...command, 'render',
  '--book', '9p', '--edition', 'modern-us-neutral', '--lesson', card]);
for (const binding of protectedFiles) await verify(binding.path, binding.sha256);
await immutableWrite(`${folder}/result.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card, status: 'pass-native-display-pending',
  science: await bind(sciencePath), figures: await Promise.all(gates.map(bind)),
  finalize, render, protectedFiles,
  outputs: await Promise.all(['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
    .map(name => bind(`${outputRoot}/${name}`))),
  html: await Promise.all(['text', 'exercises'].map(name =>
    bind(`.tmp/ld-s10y-lesson/render/9p/modern-us-neutral/${card}/${name}.html`))),
  modernIndexAfter: await bind(`${modern}/book.json`),
  workedExamples: 2, sourceTasks: 0, newUnsolvedTasks: 0,
  limits: 'Existing SCI and four independent figure approvals consumed; one native finalize and render. Raw and unselected modern artifacts unchanged. No new SCI/figure/browser/pixel review, DB, commit/push or complete-card claim.',
}, null, 2)}\n`);
console.log(JSON.stringify({ receipt: await bind(`${folder}/result.json`) }));

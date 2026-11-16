import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  ticket, read, bytes, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const tmp = `${ticket}/tmp`;
const folder = `${tmp}/d025-105-native`;
const resultPath = `${folder}/result.json`;
assert.ok(!await exists(resultPath));
const failurePath = `${folder}/adapt-finalize.json`;
assert.equal((await read(failurePath)).exitCode, 2);
const correctionPath = `${tmp}/9p-n105-prose-native-layout-correction.json`;
const correction = await read(correctionPath);
assert.equal(correction.exactNonWhitespaceProseUnchanged, true);
assert.equal(correction.nativeRepairsUsed, 1);
await verify(correction.currentLesson.path, correction.currentLesson.sha256);
const sciencePath = `${tmp}/9p-n105-science-effective-review.json`;
const gatePath = `${tmp}/9p-n105-figure-effective-review.json`;
const science = await read(sciencePath);
const gate = await read(gatePath);
assert.equal(science.status, 'pass');
assert.equal(gate.status, 'pass');
assert.deepEqual(gate.figures, []);
for (const [name, binding] of Object.entries(science.bindings)) {
  if (!binding?.path || !binding.sha256) continue;
  await verify(binding.path, binding.sha256);
  await immutableWrite(`${folder}/after-layout-repair/inputs/${name}.snapshot`, await bytes(binding.path));
}
await immutableWrite(`${folder}/after-layout-repair/started.json`, `${JSON.stringify({
  originalFailure: await bind(failurePath), correction: await bind(correctionPath),
  science: await bind(sciencePath), figures: await bind(gatePath),
}, null, 2)}\n`);
async function run(name, args) {
  const file = `${folder}/${name}.json`;
  assert.ok(!await exists(file));
  const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', ...args];
  const result = spawnSync(command[0], command.slice(1), {
    encoding: 'utf8', timeout: 180000, maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  await immutableWrite(file, `${JSON.stringify({
    command, exitCode: result.status, signal: result.signal,
    stdout: result.stdout, stderr: result.stderr,
  }, null, 2)}\n`);
  assert.equal(result.status, 0, result.stderr + result.stdout);
  return bind(file);
}
const card = 'phy9-c2-s4-n105';
const selection = ['--book', '9p', '--edition', 'modern-us-neutral', '--lesson', card];
const native = await run('adapt-finalize-after-layout-repair', ['adapt-finalize', ...selection]);
const outputRoot = `ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/lessons/${card}`;
assert.equal((await read(`${outputRoot}/adaptation.audit.json`)).status, 'pass');
const outputs = await Promise.all(['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
  .map(name => bind(`${outputRoot}/${name}`)));
const render = await run('render', ['render', ...selection]);
const html = await Promise.all(['text', 'exercises'].map(name =>
  bind(`.tmp/ld-s10y-lesson/render/9p/modern-us-neutral/${card}/${name}.html`)));
await immutableWrite(resultPath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D025', card, status: 'pass-native-display-pending',
  science: await bind(sciencePath), gate: await bind(gatePath), native, render, outputs, html,
  originalNativeFailure: await bind(failurePath), correction: await bind(correctionPath),
  counts: { workedExamples: 0, sourceTasks: 0, newUnsolvedTasks: 0 },
  limits: 'Initial native failure retained; one affected native title/layout correction checked. Existing SCI reused with unchanged non-whitespace prose. First and only successful native finalization and first render, no source/figure/SCI replay.',
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(resultPath)));

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import {
  ticket, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

const folder = `${ticket}/tmp/d021-caption-affected`;
const output = `${folder}/native-layout-fix.json`;
assert.ok(!await exists(output));
const archivePath = `${ticket}/tmp/d021-caption-before/archive.json`;
const archive = await read(archivePath);
for (const alias of archive.aliases) await verify(alias.snapshot.path, alias.snapshot.sha256);
const protectedFiles = [...archive.unchangedProducts, ...archive.unchangedFigures];
for (const number of [83, 84]) {
  const native = await read(`${ticket}/tmp/d021-n${number}-native-finalization.json`);
  protectedFiles.push(...native.outputs);
  for (const surface of ['text', 'exercises']) {
    protectedFiles.push(await bind(
      `.tmp/ld-s10y-lesson/render/9p/modern-us-neutral/phy9-c2-s2-n${number}/${surface}.html`));
  }
}
for (const binding of protectedFiles) await verify(binding.path, binding.sha256);
const tool = '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js';
const tests = '.claude/skills/ld-s10y-lesson/tools/htmlfrag-caption.test.mjs';
const testCommand = ['--test', tests];
const testOutput = execFileSync(process.execPath, testCommand, { encoding: 'utf8' });
process.stdout.write(testOutput);
const { proseFlow } = createRequire(import.meta.url)(
  '../../../../.claude/skills/ld-s10y-lesson/tools/htmlfrag.js');
const lesson = await read(
  'ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/lessons/phy9-c2-s2-n82/lesson.json');
const flow = proseFlow(lesson.prose, lesson.section_breaks);
const pairs = [];
for (const [index, item] of flow.entries()) {
  if (item.kind !== 'fig') continue;
  const next = flow[index + 1];
  assert.equal(next?.kind, 'cap');
  assert.equal(next.label, item.label);
  pairs.push({ id: item.id, label: next.label });
}
assert.deepEqual(pairs.map(item => item.id), ['fig-153', 'fig-154', 'fig-155', 'fig-156', 'fig-157']);
const command = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'render',
  '--book', '9p', '--edition', 'modern-us-neutral', '--lesson', 'phy9-c2-s2-n82'];
const nativeOutput = execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', command, {
  encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
process.stdout.write(nativeOutput);
for (const binding of protectedFiles) await verify(binding.path, binding.sha256);
const html = await Promise.all(['text', 'exercises'].map(surface => bind(
  `.tmp/ld-s10y-lesson/render/9p/modern-us-neutral/phy9-c2-s2-n82/${surface}.html`)));
assert.equal(html[1].sha256, archive.aliases[2].original.sha256);
await immutableWrite(output, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D021', status: 'pass-caption-layout-only-render',
  before: await bind(archivePath),
  toolFixOutputs: await Promise.all([tool, tests].map(bind)),
  testCommand, testOutput, command, nativeOutput, pairs, html,
  protectedFiles, unchangedLessonSourceScienceFigureAndOtherCardBytes: true,
  focusedTests: 5, nativeAffectedRenderCalls: 1,
  repeatedSourceScienceFigureOrFinalizationGates: 0,
  scope: 'Associate existing captions with their own consecutive media labels in display flow only. Final screenshot correction approval remains pending.',
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(output)));

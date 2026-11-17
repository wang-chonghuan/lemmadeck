import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  ticket, read, bind, verify, exists, immutableWrite, bytes,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const folder = `${ticket}/tmp/d030-n113-source-candidate`;
const artifactRoot = `${folder}/artifacts`;
const workRoot = `${folder}/work`;
const nativePath = `${ticket}/tmp/d030-source276-279-native/pages-native.json`;
await verify(nativePath, '134cbbb5686a74a02dab0d7e4348bf496cc4f120301a07c42f00086039210fc1');
const native = await read(nativePath);
assert.ok(!await exists(`${folder}/started.json`));
const book = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const protectedFiles = await Promise.all([
  `${book}/book.json`, `${book}/editions/modern-us-neutral/book.json`,
  ...['lesson.json', 'lesson.md', 'exercises.json'].map(name =>
    `${book}/lessons/phy9-c2-s4-n107/${name}`),
  `${ticket}/production-meter.json`, `${ticket}/evidence/index.json`,
].map(bind));
const inputs = [];
for (const page of native.pages) {
  for (const binding of page.outputs) {
    await verify(binding.path, binding.sha256);
    inputs.push(binding);
    await immutableWrite(`${artifactRoot}/9p/pages/${String(page.page).padStart(4, '0')}/${binding.path.split('/').at(-1)}`,
      await bytes(binding.path));
  }
}
for (const figure of native.cropReviewTargets) {
  for (const binding of [figure.crop, figure.svg]) {
    await verify(binding.path, binding.sha256);
    inputs.push(binding);
    await immutableWrite(`${workRoot}/9p/pages/${String(figure.page).padStart(4, '0')}/figures/${binding.path.split('/').at(-1)}`,
      await bytes(binding.path));
  }
}
const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'assemble', '--book', '9p',
  '--root', artifactRoot, '--work', workRoot,
  '--toc', 'ssot-resources/soviet10year-textbooks/toc/9p/zh.json'];
await immutableWrite(`${folder}/started.json`, `${JSON.stringify({
  command, startedAt: new Date().toISOString(), inputs, protectedFiles,
  native: await bind(nativePath), exactCropApproval: false,
  scope: 'Isolated source candidate113/t18 only. No main-book assembly.',
}, null, 2)}\n`);
const result = spawnSync(command[0], command.slice(1), {
  cwd: process.cwd(), encoding: 'utf8', timeout: 180000, maxBuffer: 8 * 1024 * 1024,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
await immutableWrite(`${folder}/command.json`, `${JSON.stringify({
  command, exitCode: result.status, signal: result.signal,
  stdout: result.stdout, stderr: result.stderr,
}, null, 2)}\n`);
assert.equal(result.status, 0, result.stderr);
for (const binding of [...inputs, ...protectedFiles]) await verify(binding.path, binding.sha256);
const cards = [];
for (const [id, expectedCount] of [['phy9-c2-s4-n113', 2], ['phy9-c2-s4-t18', 16]]) {
  const root = `${artifactRoot}/9p/lessons/${id}`;
  const lesson = await read(`${root}/lesson.json`);
  const exercises = await read(`${root}/exercises.json`);
  assert.equal(lesson.id, id);
  assert.equal(exercises.count, expectedCount);
  if (id.endsWith('n113')) {
    assert.deepEqual(lesson.figures.map(row => row.id), ['fig-229', 'fig-230', 'fig-231', 'fig-232']);
    assert.ok(!lesson.prose.some(row => row.source_refs?.includes('p0276#1')));
  }
  cards.push({
    id, sourceExerciseObjects: expectedCount,
    outputs: await Promise.all(['lesson.json', 'lesson.md', 'exercises.json'].map(name =>
      bind(`${root}/${name}`))),
  });
}
const output = `${folder}/result.json`;
await immutableWrite(output, `${JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'source-assembly-candidate-crop-review-pending',
  sourceRoot: artifactRoot, workRoot, cards, command: await bind(`${folder}/command.json`),
  protectedFiles, candidateBook: await bind(`${artifactRoot}/9p/book.json`),
  counts: { workedExamples: 2, unsolvedSourceTasks: 16 },
  limits: 'Isolated113 andt18 source only; numerical printed results preserved, not scientifically approved. No promotion, index/meter or complete-card claim.',
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(output)));

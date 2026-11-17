import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  ticket, read, bytes, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const folder = `${ticket}/tmp/d030-n114-source-candidate`;
const artifactRoot = `${folder}/artifacts`;
const workRoot = `${folder}/work`;
const nativePath = `${ticket}/tmp/d030-source280-283-native/pages-native.json`;
const cropPath = `${ticket}/tmp/d030-source280-281-crop-review.json`;
await verify(nativePath, '38c9d8904ee34cceb2ccc4791a9d770f5351c00d1715bdcde7179e0787fbd76b');
await verify(cropPath, '44ab01fde2bd06775ac30126cb2225f6185351ccf4dcc89ca9af2ef27ce2bcb6');
const native = await read(nativePath);
const crop = await read(cropPath);
assert.ok(['PASS', 'SOURCE-PASS', 'SOURCE-CROP-PASS'].includes(crop.status));
assert.ok(!await exists(`${folder}/started.json`));
const book = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const protectedFiles = await Promise.all([
  `${book}/book.json`, `${book}/editions/modern-us-neutral/book.json`,
  ...['lesson.json', 'lesson.md', 'exercises.json'].map(name =>
    `${book}/lessons/phy9-c2-s4-n107/${name}`),
  `${ticket}/production-meter.json`, `${ticket}/evidence/index.json`,
].map(bind));
const inputs = [];
for (const page of native.pages.filter(row => [280, 281].includes(row.page))) {
  for (const binding of page.outputs) {
    await verify(binding.path, binding.sha256);
    inputs.push(binding);
    await immutableWrite(`${artifactRoot}/9p/pages/${String(page.page).padStart(4, '0')}/${binding.path.split('/').at(-1)}`,
      await bytes(binding.path));
  }
}
for (const figure of native.cropReviewTargets.filter(row => [280, 281].includes(row.page))) {
  const reviewed = crop.figureResults.find(row => row.id === figure.id);
  assert.ok(reviewed && reviewed.status.toLowerCase().endsWith('pass'));
  assert.equal(reviewed.crop.sha256, figure.crop.sha256);
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
  command, inputs, protectedFiles, native: await bind(nativePath), crop: await bind(cropPath),
}, null, 2)}\n`);
const result = spawnSync(command[0], command.slice(1), {
  encoding: 'utf8', timeout: 180000, maxBuffer: 8 * 1024 * 1024,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
await immutableWrite(`${folder}/command.json`, `${JSON.stringify({
  command, exitCode: result.status, signal: result.signal,
  stdout: result.stdout, stderr: result.stderr,
}, null, 2)}\n`);
assert.equal(result.status, 0, result.stderr);
for (const binding of [...inputs, ...protectedFiles]) await verify(binding.path, binding.sha256);
const id = 'phy9-c2-s5-n114';
const root = `${artifactRoot}/9p/lessons/${id}`;
const lesson = await read(`${root}/lesson.json`);
assert.equal((await read(`${root}/exercises.json`)).count, 0);
assert.deepEqual(lesson.figures.map(row => row.id), ['fig-233', 'fig-234', 'fig-235', 'fig-236', 'fig-237']);
assert.deepEqual(lesson.prose.filter(row => row.kind === 'p').at(-1).source_refs, ['p0281#3']);
assert.ok(!lesson.prose.some(row => row.source_refs?.includes('p0281#9')));
const output = `${folder}/result.json`;
await immutableWrite(output, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card: id, status: 'source-closed-native-and-crops-approved',
  sourceRoot: artifactRoot, workRoot, protectedFiles, sourceTasks: 0,
  figures: lesson.figures.map(row => row.id), closure: {
    lastProse: 'p0281#3', nextHeading: 'p0281#8', nextCard: 'phy9-c2-s5-n115',
  },
  outputs: await Promise.all(['lesson.json', 'lesson.md', 'exercises.json'].map(name => bind(`${root}/${name}`))),
  command: await bind(`${folder}/command.json`), crop: await bind(cropPath),
  limits: '114-only isolated source candidate; partial115 not promoted. No main assembly, modern, sourcebook/index/meter, SCI or delivery claim.',
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(output)));

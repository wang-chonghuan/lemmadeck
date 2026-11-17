import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  ticket, absolute, read, bytes, bind, verify, exists, immutableWrite, walk,
} from './retain-d016-evidence.mjs';

const [authorization, short, expectedScienceSha] = process.argv.slice(2);
assert.equal(authorization, '--execute');
assert.ok(['n127', 'n130'].includes(short));
assert.match(expectedScienceSha, /^[a-f0-9]{64}$/);
const card = `phy9-c2-s6-${short}`;
const folder = `${ticket}/tmp/d035-${short}-native`;
const author = `${ticket}/tmp/d035-${short}-prose-author`;
const repairPath = `${ticket}/tmp/d035-${short}-science-repair/repair-freeze.json`;
const freezePath = await exists(repairPath) ? repairPath : `${author}/prose-freeze.json`;
const affectedPath = `${ticket}/tmp/d035-${short}-science-affected-review.json`;
const sciencePath = await exists(affectedPath) ? affectedPath : `${ticket}/tmp/d035-${short}-science-review.json`;
await verify(sciencePath, expectedScienceSha);
const science = await read(sciencePath);
assert.equal(science.SCI.status, 'PASS');
assert.equal(science.ZHEN.status, 'PASS');
const freeze = await read(freezePath);
assert.equal(freeze.card, card);
assert.equal(freeze.sourceFigures, 0);
assert.equal(freeze.sourceTasks, 0);
assert.ok(!await exists(`${folder}/started.json`), 'No native full-card replay');
for (const binding of [freeze.source, freeze.exercisesSource, ...Object.values(freeze.frozenFiles)])
  await verify(binding.path, binding.sha256);
const raw = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const protectedFiles = await Promise.all([
  `${raw}/book.json`, `${raw}/editions/modern-us-neutral/book.json`,
  `${ticket}/production-meter.json`, `${ticket}/evidence/index.json`,
].map(bind));
const preservation = await read(`${ticket}/tmp/d032-start/preservation.json`);
const sourceRoot = `${author}/root/9p`;
const sourceFiles = await walk(sourceRoot);
assert.ok(sourceFiles.every(file => !file.includes('/editions/')));
const inputs = await Promise.all([
  freezePath, sciencePath, ...sourceFiles, ...Object.values(freeze.frozenFiles).map(row => row.path),
].map(bind));
async function guard() {
  for (const row of [...inputs, ...protectedFiles, ...preservation.files]) {
    await verify(row.path, row.sha256);
    if (row.mode != null) assert.equal((await fs.stat(absolute(row.path))).mode & 0o777, row.mode);
  }
}
await guard();
await immutableWrite(`${folder}/started.json`, `${JSON.stringify({
  card, inputs, protectedFiles, sourceRoot, sourceFiles,
  science: await bind(sciencePath), sourceClosure: freeze.closure,
  preservedUnownedFiles: preservation.files.length,
}, null, 2)}\n`);
async function run(name, command) {
  const result = spawnSync(command[0], command.slice(1), {
    encoding: 'utf8', timeout: 180000, maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  const receipt = `${folder}/${name}.json`;
  await immutableWrite(receipt, `${JSON.stringify({
    command, exitCode: result.status, signal: result.signal,
    stdout: result.stdout ?? '', stderr: result.stderr ?? '', error: result.error?.message ?? null,
  }, null, 2)}\n`);
  assert.equal(result.status, 0, `${name}: ${result.stderr}\n${result.stdout}`);
  return bind(receipt);
}
const languages = [];
for (const language of ['zh', 'en']) {
  const root = `${folder}/${language}/root`;
  const work = `${folder}/${language}/work`;
  const book = `${root}/9p`;
  for (const file of sourceFiles)
    await immutableWrite(`${book}/${path.relative(sourceRoot, file)}`, await bytes(file));
  const target = `${work}/adapt/9p/modern-us-neutral/lessons/${card}`;
  const lessonInput = freeze.frozenFiles[language === 'zh' ? 'lessonTemplate' : 'englishLesson'];
  for (const [name, binding] of [
    ['lesson', lessonInput],
    ['exercises', freeze.frozenFiles.exercisesTemplate],
    ['figures', freeze.frozenFiles.figuresTemplate],
  ]) await immutableWrite(`${target}/${name}.template.json`, await bytes(binding.path));
  const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py'];
  const options = ['--book', '9p', '--edition', 'modern-us-neutral',
    '--lesson', card, '--root', root, '--work', work];
  const finalize = await run(`${language}-adapt-finalize`, [...command, 'adapt-finalize', ...options]);
  const output = `${book}/editions/modern-us-neutral/lessons/${card}`;
  assert.equal((await read(`${output}/adaptation.audit.json`)).status, 'pass');
  assert.deepEqual((await read(`${output}/lesson.json`)).prose, (await read(lessonInput.path)).prose);
  assert.equal((await read(`${output}/exercises.json`)).count, 0);
  assert.equal((await read(`${output}/figures.json`)).figures.length, 0);
  const render = await run(`${language}-render`, [...command, 'render', ...options]);
  languages.push({
    language, root, work, finalize, render,
    outputs: await Promise.all(['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
      .map(name => bind(`${output}/${name}`))),
    html: await Promise.all(['text', 'exercises']
      .map(name => bind(`${work}/render/9p/modern-us-neutral/${card}/${name}.html`))),
  });
}
await guard();
await immutableWrite(`${folder}/result.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card, status: 'PASS-native-bilingual-full-card-display-pending',
  inputs, protectedFiles, languages, science: await bind(sciencePath),
  counts: { sourceProseObjects: freeze.sourceObjects, sourceExercises: 0, modernExercises: 0, modernFigures: 0 },
  sourceClosure: freeze.closure, preservedUnownedFiles: preservation.files.length,
  fullCardApproval: false, canonicalPromotion: false, parentNewImageOpens: 0,
  limits: 'First real native bilingual no-figure full-card finalize/render only. Existing source/text reviews consumed, no reruns. Full-card display and durable retention pending; no canonical/DB/Git/tests/build/handoff.',
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(`${folder}/result.json`)));

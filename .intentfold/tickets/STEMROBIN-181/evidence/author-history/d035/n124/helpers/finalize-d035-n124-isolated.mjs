import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  ticket, absolute, read, bytes, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const card = 'phy9-c2-s6-n124';
const folder = `${ticket}/tmp/d035-n124-native`;
const raw = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const author = `${ticket}/tmp/d035-n124-prose-author`;
const repair = `${ticket}/tmp/d035-n124-directed-flux-repair/frozen`;
const figureAuthor = `${ticket}/tmp/d035-n124-fig283-native-label-author`;
const sciencePath = `${ticket}/tmp/d035-n124-directed-flux-affected-review.json`;
const reviewPath = `${ticket}/tmp/d035-n124-fig283-independent-review.json`;
const figureReviewPath = `${ticket}/tmp/d035-n124-fig283-independent-evidence/fig-283.review.json`;
const fixed = [
  [sciencePath, '22a67fb1d6e4a711359b2c7b956fc28bb1cc35bd67aadb6658ce9d321177ce04'],
  [reviewPath, '2f930bc0e82507a41316dd9f1a0e29e49d7c65ccf4672118ef94eb7104b4dd85'],
  [figureReviewPath, '82ed0932d016b1dd9d895ed2b740be297deb3307969f331fabaafeaebec0d8d0'],
  [`${author}/9p-n124-prose-freeze.json`, '252e902b86a0216b1d48901f88102891750e50fcd33c84c266daf9b28da2c156'],
  [`${figureAuthor}/figure-author-freeze.json`, 'd269d04ff27463f61e39ed4bd244d04c7956b4821be93b708c975694ba62c1c0'],
  [`${repair}/lesson.template.json`, 'ce18e30fc98cbc6458c3db80b2dd205748a4d3ed650cfe751de3a27635051871'],
  [`${repair}/english.lesson.json`, 'a2203fff45f239e85331a4b3f6c3c7041277b91614af906053f28680ff2212c4'],
];
for (const [file, sha] of fixed) await verify(file, sha);
assert.ok(!await exists(`${folder}/started.json`));
const science = await read(sciencePath);
const review = await read(reviewPath);
assert.equal(science.effectiveSCI, 'PASS');
assert.equal(science.effectiveZHEN, 'PASS');
assert.equal(review.status, 'PASS');
assert.equal(review.approval.exactCurrentNativeFigure, true);
assert.deepEqual(review.requiredAuthorFixes, []);
const freeze = await read(`${author}/9p-n124-prose-freeze.json`);
const figureFreeze = await read(`${figureAuthor}/figure-author-freeze.json`);
const sourceRoot = `${author}/root/9p`;
const sourceLessonPath = `${sourceRoot}/lessons/${card}/lesson.json`;
const sourceLesson = await read(sourceLessonPath);
const closure = await read(`${author}/source-candidate.json`);
assert.equal(closure.rightBoundaryRef, 'p0307#11');
assert.equal(closure.incoming123AndOutgoing125ExcludedFrom124, true);
assert.deepEqual(sourceLesson.prose.at(-1).source_refs, ['p0307#10']);
assert.equal((await read(`${sourceRoot}/lessons/${card}/exercises.json`)).count, 0);
for (const name of ['page.md', 'page.json', 'audit.json']) {
  assert.deepEqual(await bytes(`${sourceRoot}/pages/0307/${name}`),
    await bytes(`${raw}/pages/0307/${name}`));
}
for (const [name, key] of [['exercises', 'exercisesTemplate'], ['figures', 'figuresTemplate']])
  await verify(`${author}/frozen/${name}.template.json`, freeze.frozenFiles[key].sha256);
const specBinding = figureFreeze.output.spec;
const svgBinding = figureFreeze.output.svg;
const renderBinding = figureFreeze.output.render;
for (const row of [specBinding, svgBinding, renderBinding])
  await verify(row.path, row.sha256);
const protectedFiles = await Promise.all([
  `${raw}/book.json`, `${raw}/editions/modern-us-neutral/book.json`,
  'ssot-resources/soviet10year-textbooks/artifacts/10p/book.json',
  'ssot-resources/soviet10year-textbooks/artifacts/10p/editions/modern-us-neutral/book.json',
  `${ticket}/production-meter.json`, `${ticket}/evidence/index.json`,
].map(bind));
const preservation = await read(`${ticket}/tmp/d032-start/preservation.json`);
for (const row of preservation.files) {
  await verify(row.path, row.sha256);
  assert.equal((await fs.stat(absolute(row.path))).mode & 0o777, row.mode);
}
const inputs = await Promise.all([
  ...fixed.map(([file]) => file), sourceLessonPath, `${author}/source-candidate.json`,
  `${sourceRoot}/book.json`, `${sourceRoot}/lessons/${card}/lesson.md`,
  `${sourceRoot}/lessons/${card}/exercises.json`,
  ...['page.md', 'page.json', 'audit.json'].map(name => `${sourceRoot}/pages/0307/${name}`),
  `${author}/frozen/exercises.template.json`, `${author}/frozen/figures.template.json`,
  specBinding.path, svgBinding.path, renderBinding.path,
].map(bind));
await immutableWrite(`${folder}/started.json`, `${JSON.stringify({
  card, inputs, protectedFiles, preservation: await bind(`${ticket}/tmp/d032-start/preservation.json`),
  policy: 'Native finalization in isolated roots only. Exact original assembled source and reviewed bilingual templates; figure-manifest mode fields only bound to approved outputs.',
}, null, 2)}\n`);
async function run(name, command) {
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
}
const languages = [];
for (const language of ['zh', 'en']) {
  const root = `${folder}/${language}/root`;
  const work = `${folder}/${language}/work`;
  const book = `${root}/9p`;
  const edition = `${book}/editions/modern-us-neutral`;
  for (const name of ['book.json', ...['lesson.json', 'lesson.md', 'exercises.json']
    .map(name => `lessons/${card}/${name}`), ...['page.md', 'page.json', 'audit.json']
    .map(name => `pages/0307/${name}`)])
    await immutableWrite(`${book}/${name}`, await bytes(`${sourceRoot}/${name}`));
  for (const name of ['fig-283.png', 'fig-283.svg'])
    await immutableWrite(`${book}/figures/${name}`, await bytes(`${raw}/figures/${name}`));
  for (const [name, binding] of [
    ['fig-283.spec.json', specBinding], ['fig-283.svg', svgBinding],
    ['fig-283.render.json', renderBinding],
  ]) await immutableWrite(`${edition}/figures/${name}`, await bytes(binding.path));
  await immutableWrite(`${edition}/figures/fig-283.review.json`, await bytes(figureReviewPath));
  const target = `${work}/adapt/9p/modern-us-neutral/lessons/${card}`;
  const lessonInput = `${repair}/${language === 'zh' ? 'lesson.template.json' : 'english.lesson.json'}`;
  await immutableWrite(`${target}/lesson.template.json`, await bytes(lessonInput));
  await immutableWrite(`${target}/exercises.template.json`, await bytes(`${author}/frozen/exercises.template.json`));
  const figures = await read(`${author}/frozen/figures.template.json`);
  const entry = figures.figures.find(row => row.id === 'fig-283');
  assert.ok(entry);
  Object.assign(entry, {
    svg: 'figures/fig-283.svg', spec: 'figures/fig-283.spec.json',
    render: 'figures/fig-283.render.json', review: 'figures/fig-283.review.json',
  });
  await immutableWrite(`${target}/figures.template.json`, `${JSON.stringify(figures, null, 2)}\n`);
  const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py'];
  const options = ['--book', '9p', '--edition', 'modern-us-neutral',
    '--lesson', card, '--root', root, '--work', work];
  const finalize = await run(`${language}-adapt-finalize`, [...command, 'adapt-finalize', ...options]);
  const output = `${edition}/lessons/${card}`;
  assert.equal((await read(`${output}/adaptation.audit.json`)).status, 'pass');
  assert.equal((await read(`${output}/exercises.json`)).count, 0);
  const finalLesson = await read(`${output}/lesson.json`);
  assert.deepEqual(finalLesson.prose, (await read(lessonInput)).prose);
  assert.deepEqual((await read(`${edition}/book.json`)).lessons.map(row => row.id), [card]);
  const render = await run(`${language}-render`, [...command, 'render', ...options]);
  languages.push({
    language, root, work, finalize, render,
    outputs: await Promise.all(['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
      .map(name => bind(`${output}/${name}`))),
    html: await Promise.all(['text', 'exercises']
      .map(name => bind(`${work}/render/9p/modern-us-neutral/${card}/${name}.html`))),
  });
}
for (const row of [...inputs, ...protectedFiles, ...preservation.files]) {
  await verify(row.path, row.sha256);
  if (row.mode != null) assert.equal((await fs.stat(absolute(row.path))).mode & 0o777, row.mode);
}
await immutableWrite(`${folder}/result.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card, status: 'PASS-native-bilingual-full-card-display-pending',
  inputs, protectedFiles, languages,
  science: await bind(sciencePath), figure: await bind(reviewPath),
  counts: { sourceProseObjects: 7, sourceParagraphObjects: 5, sourceExercises: 0,
    modernExercises: 0, modernFigures: 1 },
  sourceClosure: closure, preservedUnownedFiles: preservation.files.length,
  fullCardApproval: false, canonicalPromotion: false, parentNewImageOpens: 0,
  limits: 'Real bilingual templates and exercises finalized/rendered in isolated roots. No fake preview exercises used. Full-card display and durable retention still pending; no canonical/index/meter/DB/Git/tests/build/handoff.',
}, null, 2)}\n`);
console.log(JSON.stringify({ receipt: await bind(`${folder}/result.json`) }));

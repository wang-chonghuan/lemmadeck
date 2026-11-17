import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, bytes, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const folder = `${ticket}/tmp/d202-t16-native`;
assert.equal(await exists(`${folder}/started.json`), false);
const card = 'phy10-c1-s6-t16';
const preparationPath = `${ticket}/tmp/d181-t16-native/inputs.json`;
await verify(preparationPath, 'edba1bd14c2e84e0740d5d53fa90e87474f574102a66ecae358b57037f76adea');
const preparation = await read(preparationPath);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const reviewedFigures = [];
const first = (await read(`${ticket}/tmp/d185-t16-fig120-127-first-review/report.json`))
  .figures.find(row => row.id === 'fig-120');
const repaired = await read(`${ticket}/tmp/d198-t16-fig127-affected-review/affected-findings.json`);
assert.equal(repaired.status, 'pass');
for (const figure of [
  { id: 'fig-120', spec: first.spec, svg: first.svg, render: first.render, review: first.review },
  { id: 'fig-127', ...repaired.currentArtifacts,
    review: await bind(`${ticket}/tmp/d198-t16-fig127-affected-review/fig-127.affected-review.json`) },
]) {
  const review = await read(figure.review.path);
  assert.equal(review.status, 'pass');
  for (const name of ['spec', 'svg', 'render', 'review']) {
    await verify(figure[name].path, figure[name].sha256);
  }
  assert.equal(review.spec.sha256, figure.spec.sha256);
  assert.equal(review.render.sha256, figure.render.sha256);
  assert.equal(review.outputs.svg.sha256, figure.svg.sha256);
  reviewedFigures.push(figure);
}
const inputs = [await bind(preparationPath), ...preparation.inheritedGates,
  await bind(`${ticket}/tmp/d198-t16-fig127-affected-review/affected-findings.json`),
  ...reviewedFigures.flatMap(row => ['spec', 'svg', 'render', 'review'].map(name => row[name]))];
for (const row of inputs) await verify(row.path, row.sha256);
const protectedFiles = await Promise.all([
  `${ticket}/production-meter.json`, `${ticket}/evidence/index.json`,
  'ssot-resources/soviet10year-textbooks/artifacts/10p/book.json',
  'ssot-resources/soviet10year-textbooks/artifacts/10p/answers.json',
  '.claude/skills/ld-s10y-lesson/tools/edition.py',
].map(bind));
await immutableWrite(`${folder}/started.json`, serialize({
  ticket: 'STEMROBIN-181', card, batch: 'D032', inputs, protectedFiles,
  scope: 'First native finalize/render on staged d181 roots; no passed-stage replay or canonical promotion.',
}));
async function run(name, args, localTemp) {
  await fs.mkdir(absolute(localTemp), { recursive: true });
  const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', ...args];
  const result = spawnSync(command[0], command.slice(1), {
    cwd: root, encoding: 'utf8', timeout: 180000, maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: absolute(localTemp) },
  });
  const file = `${folder}/${name}.json`;
  await immutableWrite(file, serialize({
    command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  }));
  assert.equal(result.status, 0, `${name}: ${result.stdout}\n${result.stderr}`);
  return bind(file);
}
const languages = [];
for (const entry of preparation.languages) {
  const { language, root: nativeRoot, work, templates } = entry;
  const edition = `${nativeRoot}/10p/editions/modern-us-neutral`;
  for (const kind of ['lesson', 'exercises', 'figures']) {
    const row = entry.candidates[kind].staged;
    await verify(row.path, row.sha256);
    await immutableWrite(`${folder}/${language}/before/${kind}.template.json`, await bytes(row.path));
  }
  for (const figure of reviewedFigures) {
    for (const name of ['spec', 'svg', 'render', 'review']) {
      const extension = name === 'svg' ? 'svg' : `${name}.json`;
      await immutableWrite(`${edition}/figures/${figure.id}.${extension}`, await bytes(figure[name].path));
    }
  }
  const figures = await read(entry.candidates.figures.staged.path);
  assert.deepEqual(figures.figures.map(row => row.id), ['fig-120', 'fig-127']);
  for (const row of figures.figures) Object.assign(row, {
    mode: 'deterministic', svg: `figures/${row.id}.svg`,
    spec: `figures/${row.id}.spec.json`, render: `figures/${row.id}.render.json`,
    review: `figures/${row.id}.review.json`,
  });
  await fs.writeFile(absolute(`${templates}/figures.template.json`), serialize(figures));
  inputs.push(await bind(`${templates}/figures.template.json`));
  const options = ['--book', '10p', '--edition', 'modern-us-neutral',
    '--lesson', card, '--root', absolute(nativeRoot), '--work', absolute(work)];
  const finalize = await run(`${language}-adapt-finalize`, ['adapt-finalize', ...options], `${work}/system-temp`);
  const output = `${edition}/lessons/${card}`;
  assert.equal((await read(`${output}/adaptation.audit.json`)).status, 'pass');
  assert.equal((await read(`${output}/exercises.json`)).count, 5);
  const nativeOutputs = await Promise.all(['lesson.json', 'exercises.json', 'figures.json',
    'adaptation.audit.json'].map(name => bind(`${output}/${name}`)));
  let renderRoot = nativeRoot, displayBinding = null;
  if (language === 'en') {
    renderRoot = `${folder}/en/display-root`;
    const displayEdition = `${renderRoot}/10p/editions/modern-us-neutral`;
    const nativeLesson = await read(`${output}/lesson.json`);
    for (const row of nativeOutputs) {
      const name = row.path.split('/').at(-1);
      await immutableWrite(`${displayEdition}/lessons/${card}/${name === 'lesson.json'
        ? 'native-lesson.json' : name}`, await bytes(row.path));
    }
    for (const figure of reviewedFigures) {
      for (const name of ['spec', 'svg', 'render', 'review']) {
        const extension = name === 'svg' ? 'svg' : `${name}.json`;
        await immutableWrite(`${displayEdition}/figures/${figure.id}.${extension}`, await bytes(figure[name].path));
      }
    }
    const displayLesson = { ...nativeLesson, title: 'Exercise 5', printed_title: 'Exercise 5' };
    assert.deepEqual({ ...displayLesson, title: nativeLesson.title,
      printed_title: nativeLesson.printed_title }, nativeLesson);
    const displayPath = `${displayEdition}/lessons/${card}/lesson.json`;
    await immutableWrite(displayPath, serialize(displayLesson));
    displayBinding = { nativeLesson: nativeOutputs[0], displayLesson: await bind(displayPath),
      sourceAndProseUnchanged: true, canonical: false, changedFields: ['title', 'printed_title'] };
  }
  const render = await run(`${language}-render`, ['render', '--book', '10p',
    '--edition', 'modern-us-neutral', '--lesson', card,
    '--root', absolute(renderRoot), '--work', absolute(work)], `${work}/system-temp`);
  languages.push({ language, root: renderRoot, nativeRoot, work,
    finalize, render, nativeOutputs, displayBinding,
    html: await Promise.all(['text', 'exercises']
      .map(name => bind(`${work}/render/10p/modern-us-neutral/${card}/${name}.html`))) });
}
for (const row of [...inputs, ...protectedFiles]) await verify(row.path, row.sha256);
await immutableWrite(`${folder}/result.json`, serialize({
  ticket: 'STEMROBIN-181', card, batch: 'D032',
  status: 'PASS-native-bilingual-answers-choices-display-pending',
  inputs, protectedFiles, languages, reviewedFigures,
  counts: { tasks: 5, modernFigures: 2 }, imagesOpened: 0,
  parentCumulative: 24, completeCardClaim: false, canonicalPromotion: false,
  answersChoicesNativeReady: false, allHistoricalFailHoldBytesRetained: true,
}));
console.log(serialize({ native: await bind(`${folder}/result.json`), imagesOpened: 0 }));

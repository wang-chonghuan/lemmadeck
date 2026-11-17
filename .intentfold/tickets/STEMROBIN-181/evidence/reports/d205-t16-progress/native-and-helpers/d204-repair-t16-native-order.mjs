import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, bytes, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const folder = `${ticket}/tmp/d204-t16-native-order-repair`;
assert.equal(await exists(`${folder}/started.json`), false);
const card = 'phy10-c1-s6-t16';
const stage = await read(`${ticket}/tmp/d181-t16-native/inputs.json`);
const failed = await read(`${ticket}/tmp/d202-t16-native/started.json`);
const failPath = `${ticket}/tmp/d202-t16-native/zh-adapt-finalize.json`;
assert.equal((await read(failPath)).exitCode, 2);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const inputs = [...failed.inputs, await bind(failPath)];
const protectedFiles = await Promise.all(failed.protectedFiles.map(row => bind(row.path)));
for (const row of inputs) await verify(row.path, row.sha256);
const first = (await read(`${ticket}/tmp/d185-t16-fig120-127-first-review/report.json`))
  .figures.find(row => row.id === 'fig-120');
const affected = await read(`${ticket}/tmp/d198-t16-fig127-affected-review/affected-findings.json`);
const figures = [
  { id: 'fig-120', spec: first.spec, svg: first.svg, render: first.render, review: first.review },
  { id: 'fig-127', ...affected.currentArtifacts,
    review: await bind(`${ticket}/tmp/d198-t16-fig127-affected-review/fig-127.affected-review.json`) },
];
await immutableWrite(`${folder}/started.json`, serialize({
  ticket: 'STEMROBIN-181', card, batch: 'D032', inputs, protectedFiles,
  scope: 'One native figure-list order repair; preserve failed d202 and staged d181 bytes. No content/figure repair.',
}));
async function run(name, args, temporary) {
  await fs.mkdir(absolute(temporary), { recursive: true });
  const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', ...args];
  const result = spawnSync(command[0], command.slice(1), {
    cwd: root, encoding: 'utf8', timeout: 180000, maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: absolute(temporary) },
  });
  const file = `${folder}/${name}.json`;
  await immutableWrite(file, serialize({ command, exitCode: result.status,
    stdout: result.stdout, stderr: result.stderr }));
  assert.equal(result.status, 0, `${name}: ${result.stdout}\n${result.stderr}`);
  return bind(file);
}
const languages = [];
for (const entry of stage.languages) {
  const language = entry.language;
  const nativeRoot = `${folder}/${language}/root`, work = `${folder}/${language}/work`;
  await fs.cp(absolute(entry.root), absolute(nativeRoot), {
    recursive: true, force: false, errorOnExist: true,
  });
  const templates = `${work}/adapt/10p/modern-us-neutral/lessons/${card}`;
  for (const name of ['lesson', 'exercises']) {
    await verify(entry.candidates[name].staged.path, entry.candidates[name].staged.sha256);
    await immutableWrite(`${templates}/${name}.template.json`, await bytes(entry.candidates[name].staged.path));
  }
  const figureTemplate = await read(entry.candidates.figures.source.path);
  const before = await bind(entry.candidates.figures.source.path);
  await immutableWrite(`${folder}/${language}/before/figures.template.json`, await bytes(before.path));
  const raw = await read(`${nativeRoot}/10p/lessons/${card}/lesson.json`);
  const rawIds = raw.figures.map(row => row.id);
  const orderedIds = [...rawIds, ...figureTemplate.figures.map(row => row.id).filter(id => !rawIds.includes(id))];
  assert.deepEqual(orderedIds, ['fig-127', 'fig-120']);
  figureTemplate.figures = orderedIds.map(id => figureTemplate.figures.find(row => row.id === id));
  const edition = `${nativeRoot}/10p/editions/modern-us-neutral`;
  for (const row of figureTemplate.figures) Object.assign(row, {
    mode: 'deterministic', svg: `figures/${row.id}.svg`,
    spec: `figures/${row.id}.spec.json`, render: `figures/${row.id}.render.json`,
    review: `figures/${row.id}.review.json`,
  });
  for (const figure of figures) {
    for (const name of ['spec', 'svg', 'render', 'review']) {
      const extension = name === 'svg' ? 'svg' : `${name}.json`;
      await immutableWrite(`${edition}/figures/${figure.id}.${extension}`, await bytes(figure[name].path));
    }
  }
  await immutableWrite(`${templates}/figures.template.json`, serialize(figureTemplate));
  inputs.push(await bind(`${templates}/figures.template.json`));
  const options = ['--book', '10p', '--edition', 'modern-us-neutral', '--lesson', card,
    '--root', absolute(nativeRoot), '--work', absolute(work)];
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
    for (const figure of figures) {
      for (const name of ['spec', 'svg', 'render', 'review']) {
        const extension = name === 'svg' ? 'svg' : `${name}.json`;
        await immutableWrite(`${displayEdition}/figures/${figure.id}.${extension}`, await bytes(figure[name].path));
      }
    }
    const displayPath = `${displayEdition}/lessons/${card}/lesson.json`;
    await immutableWrite(displayPath, serialize({
      ...nativeLesson, title: 'Exercise 5', printed_title: 'Exercise 5',
    }));
    displayBinding = { nativeLesson: nativeOutputs[0], displayLesson: await bind(displayPath),
      sourceAndProseUnchanged: true, changedFields: ['title', 'printed_title'], canonical: false };
  }
  const render = await run(`${language}-render`, ['render', '--book', '10p',
    '--edition', 'modern-us-neutral', '--lesson', card,
    '--root', absolute(renderRoot), '--work', absolute(work)], `${work}/system-temp`);
  languages.push({ language, root: renderRoot, nativeRoot, work, finalize, render,
    nativeOutputs, displayBinding,
    html: await Promise.all(['text', 'exercises']
      .map(name => bind(`${work}/render/10p/modern-us-neutral/${card}/${name}.html`))) });
}
for (const row of [...inputs, ...protectedFiles]) await verify(row.path, row.sha256);
await immutableWrite(`${folder}/result.json`, serialize({
  ticket: 'STEMROBIN-181', card, batch: 'D032',
  status: 'PASS-native-bilingual-answers-choices-display-pending',
  inputs, protectedFiles, languages, reviewedFigures: figures,
  counts: { tasks: 5, modernFigures: 2 }, imagesOpened: 0,
  metadataRepair: 'Figure list order only: owned fig127, then referenced shared fig120.',
  parentCumulative: 24, completeCardClaim: false, canonicalPromotion: false,
  answersChoicesNativeReady: false, allHistoricalFailHoldBytesRetained: true,
}));
console.log(serialize({ native: await bind(`${folder}/result.json`), imagesOpened: 0 }));

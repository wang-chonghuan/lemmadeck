import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, relative, bytes, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

const [execute, number, manifestPath, manifestSha] = process.argv.slice(2);
assert.equal(execute, '--execute');
assert.ok(['38', '39', '40', '44'].includes(number));
await verify(manifestPath, manifestSha);
const manifest = await read(manifestPath);
const card = `phy10-c1-s5-n${number}`;
assert.equal(manifest.card, card);
assert.equal(manifest.SCI, 'PASS');
assert.equal(manifest.ZHEN, 'PASS');
assert.equal(manifest.status, 'PASS-independent-figures-and-text');
const author = `${ticket}/tmp/${number === '44' ? 'd045' : 'd044'}-10p-n${number}-author`;
const folder = `${ticket}/tmp/d046-n${number}-native`;
assert.equal(await exists(`${folder}/started.json`), false);
const raw = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const textFolder = number === '39' || number === '40'
  ? `${ticket}/tmp/d045-n${number}-text-repair/frozen`
  : number === '44' ? `${ticket}/tmp/d046-n44-text-repair/frozen` : null;
const templatesFor = language => textFolder ? `${textFolder}/${language}`
  : `${author}/${language}/work/adapt/10p/modern-us-neutral/lessons/${card}`;
const inputs = [await bind(manifestPath)];
for (const row of manifest.reports) {
  await verify(row.path, row.sha256);
  inputs.push(row);
}
for (const figure of manifest.figures) {
  for (const row of [...figure.files, figure.independentReview]) {
    await verify(row.path, row.sha256);
    inputs.push(row);
  }
  const review = await read(figure.files.find(row => row.name === `${figure.id}.review.json`).path);
  assert.equal(review.schema, 'ld-s10y-image/review@1');
  assert.equal(review.status, 'pass');
  assert.equal(review.figure, figure.id);
}
const protectedFiles = await Promise.all([
  `${raw}/book.json`, `${raw}/editions/modern-us-neutral/book.json`,
  `${ticket}/production-meter.json`, `${ticket}/evidence/index.json`,
  '.claude/skills/ld-s10y-lesson/tools/assemble.py',
  '.claude/skills/ld-s10y-lesson/tools/edition.py',
].map(bind));
await immutableWrite(`${folder}/started.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card, inputs, protectedFiles,
  policy: 'Existing substantive approvals consumed; one native bilingual finalize/render, full-batch display still pending.',
}, null, 2)}\n`);
async function run(name, args) {
  const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', ...args];
  const result = spawnSync(command[0], command.slice(1), {
    cwd: root, encoding: 'utf8', timeout: 180000, maxBuffer: 16 * 1024 * 1024,
  });
  await immutableWrite(`${folder}/${name}.json`, `${JSON.stringify({
    command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  }, null, 2)}\n`);
  assert.equal(result.status, 0, `${name}: ${result.stdout}\n${result.stderr}`);
  return bind(`${folder}/${name}.json`);
}
const displayTitles = {
  38: 'Wave Propagation', 39: 'Wavelength and Wave Speed',
  40: 'Waves in Media', 44: 'Sound Resonance',
};
const languages = [];
for (const language of ['zh', 'en']) {
  const localRoot = `${folder}/${language}/root`;
  const work = `${folder}/${language}/work`;
  const book = `${localRoot}/10p`;
  const edition = `${book}/editions/modern-us-neutral`;
  await fs.mkdir(absolute(localRoot), { recursive: true });
  await fs.cp(absolute(`${author}/${language}/root/10p`), absolute(book),
    { recursive: true, force: false, errorOnExist: true });
  const templates = `${work}/adapt/10p/modern-us-neutral/lessons/${card}`;
  for (const name of ['lesson', 'exercises']) {
    const source = `${templatesFor(language)}/${name}.template.json`;
    inputs.push(await bind(source));
    await immutableWrite(`${templates}/${name}.template.json`, await bytes(source));
  }
  const figures = await read(`${templatesFor(language)}/figures.template.json`);
  assert.deepEqual([...figures.figures.map(row => row.id)].sort(),
    [...manifest.figures.map(row => row.id)].sort());
  for (const figure of manifest.figures)
    for (const file of figure.files)
      await immutableWrite(`${edition}/figures/${file.name}`, await bytes(file.path));
  for (const entry of figures.figures) {
    const figure = manifest.figures.find(row => row.id === entry.id);
    for (const field of ['png', 'svg', 'artwork', 'generation', 'render', 'review']) delete entry[field];
    entry.mode = figure.mode;
    entry.spec = `figures/${entry.id}.spec.json`;
    entry.review = `figures/${entry.id}.review.json`;
    if (figure.mode === 'generated') {
      entry.png = `figures/${entry.id}.png`;
      entry.generation = `figures/${entry.id}.generation.json`;
    } else {
      entry.svg = `figures/${entry.id}.svg`;
      entry.render = `figures/${entry.id}.render.json`;
      if (figure.mode === 'hybrid') entry.artwork = `figures/${entry.id}.artwork.png`;
    }
  }
  await immutableWrite(`${templates}/figures.template.json`, `${JSON.stringify(figures, null, 2)}\n`);
  const options = ['--book', '10p', '--edition', 'modern-us-neutral', '--lesson', card,
    '--root', absolute(localRoot), '--work', absolute(work)];
  const finalize = await run(`${language}-adapt-finalize`, ['adapt-finalize', ...options]);
  const output = `${edition}/lessons/${card}`;
  assert.equal((await read(`${output}/adaptation.audit.json`)).status, 'pass');
  const finalLesson = await read(`${output}/lesson.json`);
  const template = await read(`${templates}/lesson.template.json`);
  assert.deepEqual(finalLesson.source, template.source);
  const textProjection = rows => rows.map(row => ({ ...row, text: row.text?.replace(/\s+/g, '') }));
  assert.deepEqual(textProjection(finalLesson.prose), textProjection(template.prose));
  const nativeOutputs = await Promise.all(
    ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
      .map(name => bind(`${output}/${name}`)));
  let renderRoot = localRoot;
  let displayBinding = null;
  if (language === 'en') {
    renderRoot = `${folder}/${language}/display-root`;
    const displayEdition = `${renderRoot}/10p/editions/modern-us-neutral`;
    for (const file of nativeOutputs)
      await immutableWrite(`${displayEdition}/lessons/${card}/${file.path.split('/').at(-1) === 'lesson.json'
        ? 'native-lesson.json' : file.path.split('/').at(-1)}`, await bytes(file.path));
    for (const figure of manifest.figures)
      for (const file of figure.files)
        await immutableWrite(`${displayEdition}/figures/${file.name}`, await bytes(file.path));
    const displayLesson = {
      ...finalLesson, title: displayTitles[number],
      printed_title: `${number}. ${displayTitles[number]}`,
    };
    assert.deepEqual({ ...displayLesson, title: finalLesson.title,
      printed_title: finalLesson.printed_title }, finalLesson);
    const displayPath = `${displayEdition}/lessons/${card}/lesson.json`;
    await immutableWrite(displayPath, `${JSON.stringify(displayLesson, null, 2)}\n`);
    displayBinding = { nativeLesson: nativeOutputs[0], displayLesson: await bind(displayPath),
      sourceAndProseUnchanged: true, canonical: false };
  }
  const renderOptions = ['--book', '10p', '--edition', 'modern-us-neutral', '--lesson', card,
    '--root', absolute(renderRoot), '--work', absolute(work)];
  const render = await run(`${language}-render`, ['render', ...renderOptions]);
  languages.push({
    language, root: relative(renderRoot), nativeRoot: relative(localRoot), work: relative(work),
    finalize, render, nativeOutputs, displayBinding,
    html: await Promise.all(['text', 'exercises']
      .map(name => bind(`${work}/render/10p/modern-us-neutral/${card}/${name}.html`))),
  });
}
for (const row of [...inputs, ...protectedFiles]) await verify(row.path, row.sha256);
await immutableWrite(`${folder}/result.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card, status: 'PASS-native-bilingual-display-pending',
  inputs, protectedFiles, languages, manifest: await bind(manifestPath),
  counts: { tasks: number === '39' ? 6 : 0, modernFigures: manifest.figures.length },
  canonicalPromotion: false, fullCardApproval: false, imagesOpened: 0,
  answersAndChoices: number === '39' ? 'PENDING' : 'NOT-APPLICABLE',
}, null, 2)}\n`);
console.log(JSON.stringify({ result: await bind(`${folder}/result.json`) }));

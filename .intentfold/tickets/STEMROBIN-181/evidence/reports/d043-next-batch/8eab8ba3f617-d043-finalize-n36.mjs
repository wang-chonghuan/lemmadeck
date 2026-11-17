import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, relative, read, bytes, bind, verify, exists, immutableWrite, walk,
} from './retain-d016-evidence.mjs';

const [execute, scienceHash] = process.argv.slice(2);
assert.equal(execute, '--execute');
const card = 'phy10-c1-s4-n36';
const author = `${ticket}/tmp/d042-10p-n36-author/complete`;
const freezePath = `${author}/author-freeze.json`;
const sciencePath = `${ticket}/tmp/d043-10p-n36-science-review.json`;
const folder = `${ticket}/tmp/d043-n36-native`;
await verify(freezePath, '9aa558e9044043d45890bf9bfb7a9f7c5df81176490669f8eb3d154c2eb0e0bf');
await verify(sciencePath, scienceHash);
const freeze = await read(freezePath);
const science = await read(sciencePath);
assert.ok(science.effectiveSCI === 'PASS' || science.SCI === true || science.SCI === 'PASS');
assert.ok(science.effectiveZHEN === 'PASS' || science.ZHEN === true || science.ZHEN === 'PASS');
assert.equal(freeze.counts.sourceExercises, 4);
assert.equal(freeze.counts.modernFigures, 0);
const inputs = [await bind(freezePath), await bind(sciencePath), ...freeze.frozenFiles];
for (const row of inputs) await verify(row.path, row.sha256);
const protectedFiles = await Promise.all([
  'ssot-resources/soviet10year-textbooks/artifacts/9p/book.json',
  'ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/book.json',
  'ssot-resources/soviet10year-textbooks/artifacts/10p/book.json',
  'ssot-resources/soviet10year-textbooks/artifacts/10p/editions/modern-us-neutral/book.json',
  `${ticket}/production-meter.json`, `${ticket}/evidence/index.json`,
].map(bind));
assert.equal(await exists(`${folder}/started.json`), false);
await immutableWrite(`${folder}/started.json`, `${JSON.stringify({
  card, inputs, protectedFiles, policy: 'Initial native bilingual finalization; no answers, choices, display check or canonical promotion.',
}, null, 2)}\n`);
async function run(name, args) {
  const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', ...args];
  const result = spawnSync(command[0], command.slice(1), {
    cwd: root, encoding: 'utf8', timeout: 180000, maxBuffer: 16 * 1024 * 1024,
  });
  const receipt = `${folder}/${name}.json`;
  await immutableWrite(receipt, `${JSON.stringify({
    command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  }, null, 2)}\n`);
  assert.equal(result.status, 0, `${name}: ${result.stdout}\n${result.stderr}`);
  return bind(receipt);
}
const languages = [];
for (const language of freeze.languages) {
  const lang = language.language;
  const localRoot = `${folder}/${lang}/root`;
  const work = `${folder}/${lang}/work`;
  for (const file of await walk(language.root)) {
    const suffix = relative(file).slice(relative(language.root).length + 1);
    await immutableWrite(`${localRoot}/${suffix}`, await bytes(file));
  }
  const templates = `${work}/adapt/10p/modern-us-neutral/lessons/${card}`;
  for (const row of language.templates)
    await immutableWrite(`${templates}/${row.path.split('/').at(-1)}`, await bytes(row.path));
  const options = ['--book', '10p', '--edition', 'modern-us-neutral', '--lesson', card,
    '--root', absolute(localRoot), '--work', absolute(work)];
  const finalize = await run(`${lang}-adapt-finalize`, ['adapt-finalize', ...options]);
  const output = `${localRoot}/10p/editions/modern-us-neutral/lessons/${card}`;
  assert.equal((await read(`${output}/adaptation.audit.json`)).status, 'pass');
  assert.equal((await read(`${output}/exercises.json`)).count, 4);
  assert.deepEqual((await read(`${output}/figures.json`)).figures, []);
  const finalLesson = await read(`${output}/lesson.json`);
  const template = await read(language.templates.find(row => row.path.endsWith('/lesson.template.json')).path);
  assert.deepEqual(finalLesson.source, template.source);
  const nativeOutputs = await Promise.all(['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
    .map(name => bind(`${output}/${name}`)));
  const sidecar = await read(language.displayTitle.path);
  assert.equal(finalLesson.title, sidecar.validatedIdentity.title);
  assert.equal(finalLesson.printed_title, sidecar.validatedIdentity.printed_title);
  let displayRoot = localRoot;
  let displayOutput = output;
  let displayBinding = null;
  if (lang === 'en') {
    displayRoot = `${folder}/${lang}/display-root`;
    displayOutput = `${displayRoot}/10p/editions/modern-us-neutral/lessons/${card}`;
    for (const row of nativeOutputs)
      await immutableWrite(`${displayOutput}/${row.path.split('/').at(-1) === 'lesson.json'
        ? 'native-lesson.json' : row.path.split('/').at(-1)}`, await bytes(row.path));
    const displayLesson = { ...finalLesson, title: sidecar.title, printed_title: sidecar.printed_title };
    assert.deepEqual({ ...displayLesson, title: finalLesson.title, printed_title: finalLesson.printed_title }, finalLesson);
    await immutableWrite(`${displayOutput}/lesson.json`, `${JSON.stringify(displayLesson, null, 2)}\n`);
    displayBinding = { nativeLesson: nativeOutputs[0], displayLesson: await bind(`${displayOutput}/lesson.json`),
      sidecar: language.displayTitle, sourceAndProseUnchanged: true, canonical: false };
  }
  const renderOptions = options.map((value, index) =>
    index === options.indexOf('--root') + 1 ? absolute(displayRoot) : value);
  const render = await run(`${lang}-render`, ['render', ...renderOptions]);
  languages.push({
    language: lang, root: relative(displayRoot), work: relative(work),
    finalize, render, nativeOutputs, displayBinding,
    outputs: await Promise.all(['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
      .map(name => bind(`${displayOutput}/${name}`))),
    html: await Promise.all(['text', 'exercises']
      .map(name => bind(`${work}/render/10p/modern-us-neutral/${card}/${name}.html`))),
  });
}
for (const row of [...inputs, ...protectedFiles]) await verify(row.path, row.sha256);
const resultPath = `${folder}/result.json`;
await immutableWrite(resultPath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card, status: 'PASS-native-bilingual-answers-choices-display-pending',
  inputs, protectedFiles, languages, science: await bind(sciencePath), author: await bind(freezePath),
  counts: { sourceExercises: 4, modernExercises: 4, modernFigures: 0 },
  sourceClosure: freeze.sourceClosure, fullCardApproval: false,
  answers: 'pending-independent-derivation', choices: 'pending-whitelist-seed',
  canonicalPromotion: false, newImageOpens: 0, englishDisplayIdentitySeparated: true,
}, null, 2)}\n`);
console.log(JSON.stringify({ result: await bind(resultPath) }));

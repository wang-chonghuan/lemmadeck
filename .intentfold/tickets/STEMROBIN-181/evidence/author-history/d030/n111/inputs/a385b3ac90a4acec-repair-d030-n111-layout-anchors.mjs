import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import {
  ticket, absolute, read, bytes, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const card = 'phy9-c2-s4-n111';
const folder = `${ticket}/tmp/d030-n111-layout-repair`;
const nativeFolder = `${ticket}/tmp/d030-n111-native`;
const template = `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${card}/lesson.template.json`;
const approved = `${ticket}/tmp/d030-n111-build/work/adapt/9p/modern-us-neutral/lessons/${card}/lesson.template.json`;
await verify(approved, '1536716796ffab6a6204f52c813f17d1ddc2bafc991629368112d8cde3478d14');
await verify(template, '1536716796ffab6a6204f52c813f17d1ddc2bafc991629368112d8cde3478d14');
assert.ok(!await exists(`${folder}/result.json`));
const failed = await read(`${nativeFolder}/adapt-finalize.json`);
assert.equal(failed.exitCode, 2);
assert.ok(failed.stdout.includes('section_breaks[0]'));
const original = await read(template);
await immutableWrite(`${folder}/before/lesson.template.json`, await bytes(template));
const normalizedCommand = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B', '-c',
  'import json,sys; sys.path.insert(0,".claude/skills/ld-s10y-lesson/tools"); import edition; doc=json.load(sys.stdin); edition.normalize_lesson_layout(doc); doc["section_breaks"]=[]; print(json.dumps(doc,ensure_ascii=False))'];
const normalizedRun = spawnSync(normalizedCommand[0], normalizedCommand.slice(1), {
  encoding: 'utf8', input: JSON.stringify(original), timeout: 30000,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
await immutableWrite(`${folder}/normalize.command.json`, `${JSON.stringify({
  command: normalizedCommand, exitCode: normalizedRun.status,
  stdout: normalizedRun.stdout, stderr: normalizedRun.stderr,
}, null, 2)}\n`);
assert.equal(normalizedRun.status, 0, normalizedRun.stderr);
const normalized = JSON.parse(normalizedRun.stdout);
const normalizeSpace = value => value.replace(/\s+/g, '');
for (let index = 0; index < original.prose.length; index++)
  assert.equal(normalizeSpace(normalized.prose[index].text), normalizeSpace(original.prose[index].text));
const flowCommand = [process.execPath, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--stdin'];
const flowRun = spawnSync(flowCommand[0], flowCommand.slice(1), {
  encoding: 'utf8', input: JSON.stringify(normalized), timeout: 30000,
});
await immutableWrite(`${folder}/flow.command.json`, `${JSON.stringify({
  command: flowCommand, exitCode: flowRun.status, stdout: flowRun.stdout, stderr: flowRun.stderr,
}, null, 2)}\n`);
assert.equal(flowRun.status, 0, flowRun.stderr);
const outline = JSON.parse(flowRun.stdout).paragraphs;
const anchors = [5, 7, 10].map(blockIndex => {
  const paragraph = outline.find(row => row.blockIndex === blockIndex && row.paragraphInBlock === 0);
  assert.ok(paragraph?.index > 0);
  return { before: outline[paragraph.index - 1].text, after: paragraph.text };
});
const repaired = { ...original, section_breaks: anchors };
assert.deepEqual(repaired.prose, original.prose);
await fs.writeFile(absolute(template), `${JSON.stringify(repaired, null, 2)}\n`);
await immutableWrite(`${folder}/correction.json`, `${JSON.stringify({
  approvedOriginal: await bind(approved), before: await bind(`${folder}/before/lesson.template.json`),
  after: await bind(template), onlyChangedJSONField: '/section_breaks',
  originalSCIAndFigureProseBytesUnchanged: true,
  nativeNormalizationChangesWhitespaceOnly: true, actualNativeAnchors: anchors,
  nativeNormalization: await bind(`${folder}/normalize.command.json`),
  flow: await bind(`${folder}/flow.command.json`),
  originalFailedNative: await bind(`${nativeFolder}/adapt-finalize.json`),
  noScienceOrFigureReviewRerun: true,
}, null, 2)}\n`);
const run = async (name, command) => {
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
};
const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py'];
const finalize = await run('adapt-finalize', [...command, 'adapt-finalize',
  '--book', '9p', '--edition', 'modern-us-neutral', '--lesson', card]);
const modern = 'ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral';
assert.equal((await read(`${modern}/lessons/${card}/adaptation.audit.json`)).status, 'pass');
const render = await run('render', [...command, 'render',
  '--book', '9p', '--edition', 'modern-us-neutral', '--lesson', card]);
await immutableWrite(`${folder}/result.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card, status: 'pass-native-display-and-retention-pending',
  correction: await bind(`${folder}/correction.json`), finalize, render,
  outputs: await Promise.all(['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
    .map(name => bind(`${modern}/lessons/${card}/${name}`))),
  html: await Promise.all(['text', 'exercises'].map(name =>
    bind(`.tmp/ld-s10y-lesson/render/9p/modern-us-neutral/${card}/${name}.html`))),
  zeroTasksPreserved: true, promotionsRepeated: 0,
  limits: 'Section-anchor-only repair; original reviewed prose, frozen inputs and three figure outputs unchanged. No science/figure rerun, image opens, DB, tests, delivery or formalhandoff.',
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(`${folder}/result.json`)));

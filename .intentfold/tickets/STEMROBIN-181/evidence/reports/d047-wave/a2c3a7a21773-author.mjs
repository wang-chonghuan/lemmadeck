import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, bytes, read, bind, verify, exists, immutableWrite,
} from '../retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const folder = `${ticket}/tmp/d045-10p-n44-author`;
const card = 'phy10-c1-s5-n44';
assert.equal(await exists(`${folder}/author-freeze.json`), false);
await verify(`${ticket}/tmp/d045-n44-preparation/prepared.json`,
  '76ecbeb337db3262a0b04b43a08c244f90c51dc40ebb3541a0335684d479a4c0');
const texts = await read(`${folder}/texts.json`);
const outputs = [];
async function run(name, command, input) {
  const result = spawnSync(command[0], command.slice(1), {
    cwd: root, encoding: 'utf8', input, timeout: 180000, maxBuffer: 16 * 1024 * 1024,
  });
  await immutableWrite(`${folder}/commands/${name}.json`, `${JSON.stringify({
    command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  }, null, 2)}\n`);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return JSON.parse(result.stdout);
}
for (const language of ['zh', 'en']) {
  const directory = `${folder}/${language}/work/adapt/10p/modern-us-neutral/lessons/${card}`;
  const target = `${directory}/lesson.template.json`;
  const before = await bytes(target);
  await immutableWrite(`${folder}/prepared/${language}/lesson.template.json`, before);
  let lesson = JSON.parse(before);
  lesson.language = language;
  lesson.section_breaks = [];
  assert.equal(lesson.prose.length, texts.length);
  for (const [index, block] of lesson.prose.entries()) {
    block.text = texts[index][language];
    block.changes = block.text === block.source_text ? [] : [
      ...(language === 'en' ? ['translation'] : []), 'wording', 'modernized', 'layout',
    ];
    block.numeric_changes = [];
  }
  lesson = await run(`normalize-${language}`, [
    '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B', '-c',
    ['import json,sys', "sys.path.insert(0,'.claude/skills/ld-s10y-lesson/tools')",
      'from edition import normalize_lesson_layout', 'document=json.load(sys.stdin)',
      'normalize_lesson_layout(document)',
      'json.dump(document,sys.stdout,ensure_ascii=False,indent=2)'].join('\n'),
  ], JSON.stringify(lesson));
  const preliminary = `${folder}/preliminary/${language}/lesson.template.json`;
  await immutableWrite(preliminary, `${JSON.stringify(lesson, null, 2)}\n`);
  const flow = await run(`flow-initial-${language}`,
    [process.execPath, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--json', preliminary]);
  const experiment = flow.paragraphs.find(row => row.blockIndex === 1);
  assert.ok(experiment?.index > 0);
  lesson.section_breaks = [{
    before: flow.paragraphs[experiment.index - 1].text, after: experiment.text,
  }];
  assert.deepEqual(await bytes(target), before);
  await fs.writeFile(absolute(target), `${JSON.stringify(lesson, null, 2)}\n`);
  for (const name of ['lesson', 'exercises', 'figures']) {
    const file = `${directory}/${name}.template.json`;
    await immutableWrite(`${folder}/frozen/${language}/${name}.template.json`, await bytes(file));
  }
  const finalFlow = await run(`flow-${language}`,
    [process.execPath, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--json', target]);
  await immutableWrite(`${folder}/frozen/${language}/prose.md`,
    `# 44. ${language === 'zh' ? '声的共鸣' : 'Sound Resonance'}\n\n${
      lesson.prose.filter(block => block.kind === 'p' || block.kind === 'cap')
        .map(block => block.text).join('\n\n')}\n`);
  outputs.push({
    language, template: await bind(target),
    frozen: await bind(`${folder}/frozen/${language}/lesson.template.json`),
    prose: await bind(`${folder}/frozen/${language}/prose.md`),
    flow: await bind(`${folder}/commands/flow-${language}.json`),
    paragraphs: finalFlow.paragraphs.length,
    raw: await bind(`${folder}/${language}/root/10p/lessons/${card}/lesson.json`),
    exercises: await bind(`${directory}/exercises.template.json`),
    figures: await bind(`${directory}/figures.template.json`),
  });
}
const native = await run('native-text-initial',
  ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B', `${folder}/check-text.py`]);
assert.equal(native.status, 'pass');
await immutableWrite(`${folder}/author-freeze.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card, status: 'text-author-only-awaiting-independent-SCI-ZHEN',
  input: await bind(`${folder}/input-freeze.json`), outputs,
  native: await bind(`${folder}/commands/native-text-initial.json`),
  authorFiles: await Promise.all(['texts.json', 'check-text.py', 'author.mjs']
    .map(name => bind(`${folder}/${name}`))),
  objects: 5, prose: 3, figures: ['fig-83'], captions: 1, tasks: 0,
  addedTasks: 0, addedFormulas: 0, numericChanges: 0, repairs: 0,
  sourceReviewPendingAtPreparation: true, canonicalWrites: 0,
  imagesOpened: 0, nativeFinalizeRun: false, cardComplete: false,
}, null, 2)}\n`);
console.log(JSON.stringify({ freeze: await bind(`${folder}/author-freeze.json`),
  outputs: outputs.map(({ language, paragraphs }) => ({ language, paragraphs })) }));

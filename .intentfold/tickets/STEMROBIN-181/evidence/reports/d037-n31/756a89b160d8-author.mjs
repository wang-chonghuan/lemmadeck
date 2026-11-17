import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const folder = path.dirname(import.meta.filename);
const card = 'phy10-c1-s4-n31';
const relativeTemplates = `adapt/10p/modern-us-neutral/lessons/${card}`;
const texts = JSON.parse(await fs.readFile(path.join(folder, 'texts.json'), 'utf8'));
const bind = async file => ({
  path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex'),
});
const save = async (file, value, replace = false) => {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, { flag: replace ? 'w' : 'wx' });
};
await fs.cp(path.join(folder, 'root'), path.join(folder, 'root-en'),
  { errorOnExist: true, recursive: true });
await fs.cp(path.join(folder, 'work'), path.join(folder, 'work-en'),
  { errorOnExist: true, recursive: true });
const frozen = [];
for (const language of ['zh', 'en']) {
  const work = path.join(folder, language === 'zh' ? 'work' : 'work-en');
  const root = path.join(folder, language === 'zh' ? 'root' : 'root-en');
  const template = path.join(work, relativeTemplates, 'lesson.template.json');
  const lesson = JSON.parse(await fs.readFile(template, 'utf8'));
  assert.equal(lesson.prose.length, texts.length);
  lesson.language = language;
  for (const [index, block] of lesson.prose.entries()) {
    block.text = texts[index][language];
    block.changes = language === 'en'
      ? ['translation', 'wording', 'modernized', 'layout']
      : ['wording', 'modernized', 'layout'];
  }
  await save(template, lesson, true);
  const flowArgs = ['.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', template];
  const flow = spawnSync(process.execPath, flowArgs, { encoding: 'utf8', timeout: 60000 });
  await save(path.join(folder, `prose-flow-${language}.json`),
    { args: flowArgs, exitCode: flow.status, stdout: flow.stdout, stderr: flow.stderr });
  assert.equal(flow.status, 0, flow.stderr);
  const args = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'adapt-finalize',
    '--book', '10p', '--edition', 'modern-us-neutral', '--lesson', card,
    '--root', root, '--work', work];
  const result = spawnSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', args,
    { encoding: 'utf8', timeout: 180000 });
  await save(path.join(folder, `finalize-${language}.json`),
    { args, exitCode: result.status, stdout: result.stdout, stderr: result.stderr });
  assert.equal(result.status, 0, result.stderr);
  frozen.push({
    language, template: await bind(template),
    lesson: await bind(path.join(root, `10p/editions/modern-us-neutral/lessons/${card}/lesson.json`)),
  });
}
await save(path.join(folder, 'prose-freeze.json'), {
  schema: 'ld-s10y-lesson/bounded-prose-author-freeze@1',
  ticket: 'STEMROBIN-181', card, frozen,
  source: await bind(path.join(folder, `root/10p/lessons/${card}/lesson.json`)),
  sourceReviewPending: true, SCI: false, ZHEN: false, fullCardApproval: false,
  figures: 0, tasks: 0, addedTasks: 0, addedChoices: 0, sourceFormulaChanges: 0,
  changes: 'Modern wording removes dated development predictions and narrows sweeping efficiency/capacity claims; all seven source prose objects and the thermopile footnote are retained.',
});
console.log(JSON.stringify(frozen));

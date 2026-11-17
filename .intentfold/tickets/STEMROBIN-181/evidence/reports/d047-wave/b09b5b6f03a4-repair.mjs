import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const folder = path.dirname(import.meta.filename);
assert.equal(folder, path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d044-10p-n38-author'));
assert.equal(process.cwd(), repo);
const card = 'phy10-c1-s5-n38';
const relative = `en/work/adapt/10p/modern-us-neutral/lessons/${card}/lesson.template.json`;
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
const flowTool = path.join(repo, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs');
const owned = name => {
  const target = path.resolve(folder, name);
  assert.ok(target.startsWith(`${folder}/`));
  return target;
};
const load = async name => JSON.parse(await fs.readFile(owned(name), 'utf8'));
const bind = async file => ({
  path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex'),
});
const save = async (name, value, replace = false) => {
  const target = owned(name);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, `${JSON.stringify(value, null, 2)}\n`, { flag: replace ? 'w' : 'wx' });
};
const receipt = async (name, command, args, input) => {
  const startedAt = new Date().toISOString();
  const result = spawnSync(command, args, {
    cwd: repo, encoding: 'utf8', timeout: 180000, input,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  await save(`attempts/repair-1/${name}.json`, {
    command, args, cwd: repo, startedAt, finishedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, stdout: result.stdout,
    stderr: result.stderr, error: result.error?.message ?? null,
  });
  return result;
};
const initialCheck = await load('attempts/initial/text-check.json');
assert.equal(initialCheck.status, 'fail');
assert.deepEqual(initialCheck.languages.find(item => item.language === 'en').stage_errors.flow,
  ['en: paragraph 8 must contain 2-3 complete sentences.']);
const initialFreeze = await load('attempts/initial/author-freeze.json');
assert.equal(initialFreeze.targetedRepairs, 0);
const initialTexts = await load('attempts/initial/texts.json');
const texts = await load('texts.json');
const target = texts.find(item => item.source_refs[0] === 'p0108#4');
const before = 'This is an ideal small-amplitude model, before appreciable loss or reflection.';
const after = 'We use a small-amplitude model, before appreciable loss or reflection.';
const expected = structuredClone(initialTexts);
expected.find(item => item.source_refs[0] === 'p0108#4').en =
  target.en.replace(after, before);
assert.deepEqual(expected, initialTexts);
assert.equal(target.en.split('\n').at(-1), after);
const expectedTexts = structuredClone(initialTexts);
expectedTexts.find(item => item.source_refs[0] === 'p0108#4').en =
  expectedTexts.find(item => item.source_refs[0] === 'p0108#4').en.replace(before, after);
assert.deepEqual(texts, expectedTexts, 'Only the sole targeted English sentence may change.');

let lesson = await load(relative);
const initialTemplate = structuredClone(lesson);
const block = lesson.prose.find(item => item.source_refs[0] === 'p0108#4');
assert.equal(block.kind, 'p');
assert.equal(block.text.split('\n').at(-1), before);
block.text = target.en;
const normalization = await receipt('normalize-en', python,
  ['-B', path.join(folder, 'normalize-text.py')], JSON.stringify(lesson));
assert.equal(normalization.status, 0, normalization.stderr);
lesson = JSON.parse(normalization.stdout).document;
const expectedTemplate = structuredClone(initialTemplate);
expectedTemplate.prose.find(item => item.source_refs[0] === 'p0108#4').text =
  lesson.prose.find(item => item.source_refs[0] === 'p0108#4').text;
assert.deepEqual(lesson, expectedTemplate, 'Other blocks, identities, conditions and anchors must stay unchanged.');
await save(relative, lesson, true);
const candidates = await receipt('prose-flow-en-candidates', process.execPath,
  [flowTool, owned(relative)]);
assert.equal(candidates.status, 0, candidates.stderr);
const boundaries = candidates.stdout.split('\n')
  .filter(line => line.trim().startsWith('break: '))
  .map(line => JSON.parse(line.trim().slice('break: '.length)));
lesson.section_breaks = ['p0108#1', 'p0108#4', 'p0108#7'].map(ref => {
  const sourceBlock = lesson.prose.find(item => item.source_refs.includes(ref));
  const matches = boundaries.filter(boundary =>
    boundary.after.startsWith(sourceBlock.text.split('\n')[0]));
  assert.equal(matches.length, 1);
  return matches[0];
});
assert.deepEqual(lesson.section_breaks, initialTemplate.section_breaks);
await save(relative, lesson, true);
const flowResult = await receipt('prose-flow-en', process.execPath,
  [flowTool, '--json', owned(relative)]);
assert.equal(flowResult.status, 0, flowResult.stderr);
const flow = JSON.parse(flowResult.stdout);
await save('attempts/repair-1/prose-flow-en.data.json', flow);
await save('prose-current-en.json', {
  language: 'en', card, prose: lesson.prose, section_breaks: lesson.section_breaks,
}, true);
await fs.writeFile(owned('lesson-en.md'), [
  '# Propagation of Mechanical Waves', '',
  ...lesson.prose.filter(item => item.kind !== 'fig').flatMap(item => [item.text, '']),
].join('\n'));
for (const language of ['zh', 'en']) {
  await fs.cp(owned(`${language}/work/adapt/10p/modern-us-neutral/lessons/${card}`),
    owned(`attempts/repair-1/${language}`),
    { recursive: true, errorOnExist: true, force: false });
}
const result = await receipt('text-check-command', python,
  ['-B', path.join(folder, 'validate-text.py')]);
assert.equal(result.status, 1, 'Native number-signature failures must not be bypassed.');
const check = JSON.parse(result.stdout);
await save('attempts/repair-1/text-check.json', check);
await save('text-check.json', check, true);
for (const report of check.languages) {
  assert.deepEqual(report.stage_errors.flow, []);
  for (const [name, values] of Object.entries(report.stage_errors)) {
    if (name !== 'native_text') assert.deepEqual(values, []);
  }
}
const oldNativeErrors = initialCheck.languages.flatMap(item => item.stage_errors.native_text);
assert.deepEqual(check.errors, oldNativeErrors);
assert.equal(check.errors.length, 5);
for (const binding of (await load('protected-input-bindings.json'))) {
  assert.equal((await bind(binding.path)).sha256, binding.sha256);
}
for (const binding of initialFreeze.contractBindings) {
  assert.equal((await bind(binding.path)).sha256, binding.sha256);
}
const inputs = await load('input-freeze.json');
for (const item of inputs.inputs) {
  for (const binding of item.original ? [item.original, item.snapshot] : [item]) {
    assert.equal((await bind(path.resolve(repo, binding.path))).sha256, binding.sha256);
  }
}
const freeze = structuredClone(initialFreeze);
const en = freeze.frozen.find(item => item.language === 'en');
en.template = await bind(owned(relative));
en.currentProse = await bind(owned('prose-current-en.json'));
en.readingText = await bind(owned('lesson-en.md'));
en.nativeNormalizationReceipt = await bind(owned('attempts/repair-1/normalize-en.json'));
en.nativeFlowReceipt = await bind(owned('attempts/repair-1/prose-flow-en.json'));
en.nativeFlow = await bind(owned('attempts/repair-1/prose-flow-en.data.json'));
en.boundaryCandidatesReceipt = await bind(owned('attempts/repair-1/prose-flow-en-candidates.json'));
en.paragraphs = flow.paragraphs.length;
freeze.nativeTextCheck = await bind(owned('text-check.json'));
freeze.nativeBlockers = check.errors;
freeze.targetedRepairs = 1;
freeze.repairDecision = 'Sole repair after actual initial FAIL: shorten one English sentence without removing the small-amplitude/loss/reflection conditions, then reapply native normalization. Figure-number signature FAIL is unchanged and unfiltered.';
freeze.initialAttempt.authorFreeze = await bind(owned('attempts/initial/author-freeze.json'));
freeze.initialAttempt.retainedFiles = await Promise.all([
  'texts.json', 'author.mjs', 'normalize-text.py', 'validate-text.py',
  'prose-current-zh.json', 'prose-current-en.json', 'lesson-zh.md', 'lesson-en.md',
].map(name => bind(owned(`attempts/initial/${name}`))));
freeze.repairAttempt = {
  commandReceipt: await bind(owned('attempts/repair-1/text-check-command.json')),
  check: await bind(owned('attempts/repair-1/text-check.json')),
  source_refs: ['p0108#4'], language: 'en', before, after,
  templates: await Promise.all(['zh', 'en'].flatMap(language =>
    ['lesson.template.json', 'exercises.template.json', 'figures.template.json']
      .map(name => bind(owned(`attempts/repair-1/${language}/${name}`))))),
};
freeze.authorFiles = await Promise.all([
  'author.mjs', 'texts.json', 'normalize-text.py', 'validate-text.py', 'repair.mjs',
].map(name => bind(owned(name))));
freeze.nativeStageStatuses = check.languages.map(item => ({
  language: item.language, stages: item.stage_statuses,
}));
await save('author-freeze.json', freeze, true);
console.log(JSON.stringify({
  freeze: await bind(owned('author-freeze.json')),
  nativeTextStatus: check.status, nativeBlockers: check.errors,
  paragraphs: freeze.frozen.map(item => ({ language: item.language, count: item.paragraphs })),
  rawObjects: 13, prose: 7, figures: 3, captions: 3, tasks: 0,
  targetedRepairs: 1, bothAttemptsRetained: true, imagesOpened: 0, SCI: false,
}, null, 2));

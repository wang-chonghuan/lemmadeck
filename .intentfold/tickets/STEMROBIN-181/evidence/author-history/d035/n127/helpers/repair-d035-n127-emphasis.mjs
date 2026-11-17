import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import {
  ticket, absolute, read, bytes, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const folder = `${ticket}/tmp/d035-n127-emphasis-repair`;
const previousFreezePath = `${ticket}/tmp/d035-n127-science-repair/repair-freeze.json`;
const sciencePath = `${ticket}/tmp/d035-n127-science-affected-review.json`;
const displayPath = `${ticket}/tmp/d035-n127-display-review.json`;
await verify(previousFreezePath, 'aeb2b30aaeb6b21f65f0b18324467504d68b5814c0b27dfae298a8e34e86e374');
await verify(sciencePath, 'cac6f240429861337adf11b08ad04234ca68c785c3d828fc01f9b5a88a7ba893');
await verify(displayPath, 'cdf3cb942f2d14a5dab4055dc0daa4c5d7a2db7f1b3891172965855ebb321683');
assert.ok(!await exists(`${folder}/repair-freeze.json`));
const previous = await read(previousFreezePath);
const display = await read(displayPath);
assert.equal(display.status, 'FAIL');
assert.deepEqual(display.defects.map(row => row.id), ['DISPLAY-001']);
const require = createRequire(absolute('.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'));
const { proseOutline } = require('./htmlfrag.js');
const plain = text => text.replaceAll('**', '').replace(/\s+/g, '');
const docs = [];
for (const key of ['lessonTemplate', 'englishLesson']) {
  const binding = previous.frozenFiles[key];
  await verify(binding.path, binding.sha256);
  const before = await read(binding.path);
  const after = structuredClone(before);
  const original = before.prose[1].text;
  const stripped = original.replaceAll('**', '').trim();
  const definition = key === 'lessonTemplate'
    ? '如果穿过一个闭合回路所围面积的磁通量'
    : 'If the magnetic flux through the area enclosed by a closed loop';
  const unit = key === 'lessonTemplate' ? '1 韦伯 = 1 伏特·1 秒' : '1 weber = 1 volt·1 second';
  const punctuation = key === 'lessonTemplate' ? '。' : '.';
  const start = stripped.indexOf(definition);
  const end = stripped.indexOf(`${unit}${punctuation}`);
  assert.ok(start >= 0 && end > start);
  const definitionEnd = stripped.indexOf(punctuation, start);
  assert.ok(definitionEnd < end);
  after.prose[1].text = [
    stripped.slice(0, start),
    '**', stripped.slice(start, definitionEnd), '**',
    stripped.slice(definitionEnd, end),
    '**', unit, '**', stripped.slice(end + unit.length),
  ].join('');
  assert.equal(plain(after.prose[1].text), plain(original));
  docs.push({ key, before, after });
}
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
const command = [python, '-B', '-c', [
  'import json,sys',
  "sys.path.insert(0,'.claude/skills/ld-s10y-lesson/tools')",
  'import edition',
  'payload=json.load(sys.stdin)',
  "for doc in payload['documents']:",
  "    doc['prose'][1]['text']=edition.normalize_prose_layout(doc['prose'][1]['text'])",
  'print(json.dumps(payload,ensure_ascii=False))',
].join('\n')];
const normalized = spawnSync(command[0], command.slice(1), {
  input: JSON.stringify({ documents: docs.map(row => row.after) }),
  encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
await immutableWrite(`${folder}/normalize.json`, `${JSON.stringify({
  command, exitCode: normalized.status, stdout: normalized.stdout, stderr: normalized.stderr,
}, null, 2)}\n`);
assert.equal(normalized.status, 0);
const outputs = JSON.parse(normalized.stdout).documents;
const frozenFiles = { ...previous.frozenFiles };
const comparisons = [];
for (const [index, row] of docs.entries()) {
  const after = outputs[index];
  assert.equal(plain(after.prose[1].text), plain(row.before.prose[1].text));
  for (const proseIndex of [0, 2, 3])
    assert.deepEqual(after.prose[proseIndex], row.before.prose[proseIndex]);
  const outline = proseOutline(after.prose);
  const boundaryIndex = outline.findIndex(item => item.blockIndex === 2);
  assert.ok(boundaryIndex > 0);
  after.section_breaks = [{ before: outline[boundaryIndex - 1].text, after: outline[boundaryIndex].text }];
  const definitions = outline.filter(item => item.blockIndex === 1);
  assert.ok(definitions.every(item => (item.text.match(/\*\*/g) ?? []).length % 2 === 0));
  assert.ok(!definitions.some(item => item.text.trim() === '**'));
  const output = `${folder}/${row.key === 'lessonTemplate' ? 'lesson.template.json' : 'english.lesson.json'}`;
  await immutableWrite(output, `${JSON.stringify(after, null, 2)}\n`);
  frozenFiles[row.key] = await bind(output);
  comparisons.push({
    language: after.language, changedProseIndices: [1],
    allWordsNumbersFormulasAndConditionsUnchangedIgnoringBoldAndWhitespace: true,
    otherThreeProseObjectsByteStructureUnchanged: true,
    paragraphs: definitions, boundary: after.section_breaks[0],
  });
}
await immutableWrite(`${folder}/repair-freeze.json`, `${JSON.stringify({
  ...previous,
  status: 'affected-emphasis-layout-frozen-display-repair-pending',
  frozenFiles,
  precedingScienceRepair: await bind(previousFreezePath),
  precedingEffectiveScience: await bind(sciencePath),
  originalDisplayFailure: await bind(displayPath),
  changedProseIndices: [1, 2],
  newlyAffectedProseIndices: [1],
  substantiveScienceChangedByThisRepair: false,
  mathNumbersUnitsAndPlainMeaningChangedByThisRepair: false,
  sourceFigureOrTaskChanges: 0,
  comparisons,
  nativeNormalize: await bind(`${folder}/normalize.json`),
  priorScienceChangedProseIndices: [2],
  sourceGateReplayed: false, parentNewImageOpens: 0,
  fullCardApproval: false, canonicalPromotion: false,
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(`${folder}/repair-freeze.json`)));

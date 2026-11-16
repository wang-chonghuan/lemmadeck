import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import {
  ticket, absolute, read, bytes, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const tmp = `${ticket}/tmp`;
const folder = `${tmp}/d025-n105-native-layout-repair`;
const output = `${tmp}/9p-n105-prose-native-layout-correction.json`;
assert.ok(!await exists(output));
const originalSciencePath = `${tmp}/9p-n105-science-review.json`;
const originalScience = await read(originalSciencePath);
assert.equal(originalScience.status, 'pass');
const templatePath = originalScience.bindings.lessonTemplate.path;
await verify(templatePath, originalScience.bindings.lessonTemplate.sha256);
const beforeBytes = await bytes(templatePath);
const before = JSON.parse(beforeBytes);
const failedPath = `${tmp}/d025-105-native/adapt-finalize.json`;
const failed = await read(failedPath);
assert.equal(failed.exitCode, 2);
assert.match(failed.stdout, /lesson\.title/);
assert.match(failed.stdout, /section_breaks/);
await immutableWrite(`${folder}/before.lesson.template.json`, beforeBytes);
await immutableWrite(`${folder}/before.adaptation.audit.json`,
  await bytes('ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/lessons/phy9-c2-s4-n105/adaptation.audit.json'));
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
const normalizedRun = spawnSync(python, ['-B', '-c',
  "import json,sys; sys.path.insert(0,'.claude/skills/ld-s10y-lesson/tools'); import edition; doc=json.load(sys.stdin); edition.normalize_lesson_layout(doc); print(json.dumps(doc,ensure_ascii=False))"],
{ input: beforeBytes, encoding: 'utf8', timeout: 60000 });
assert.equal(normalizedRun.status, 0, normalizedRun.stderr);
const corrected = JSON.parse(normalizedRun.stdout);
const source = await read(originalScience.bindings.source.path);
corrected.title = source.title;
corrected.section_breaks = [];
const flowRun = spawnSync(process.execPath, [
  '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--stdin',
], { input: JSON.stringify(corrected), encoding: 'utf8', timeout: 60000 });
assert.equal(flowRun.status, 0, flowRun.stderr);
const flow = JSON.parse(flowRun.stdout);
const prefixes = [
  '**\u6c14\u4f53\u653e\u7535\u7b49\u79bb\u5b50\u4f53\u7684\u5e94\u7528',
  '**\u91d1\u5c5e\u4e2d\u7684\u5e26\u7535\u7c92\u5b50',
  '**\u5929\u4f53\u4e2d\u7684\u7b49\u79bb\u5b50\u4f53',
  '\u5728\u5730\u7403\u4e0a\uff0c\u4eba\u4eec\u4e5f\u5728\u7814\u7a76',
];
for (const prefix of prefixes) {
  const matches = flow.paragraphs.filter(row => row.text.startsWith(prefix));
  assert.equal(matches.length, 1, prefix);
  const paragraph = matches[0];
  assert.ok(paragraph.index > 0);
  corrected.section_breaks.push({
    before: flow.paragraphs[paragraph.index - 1].text, after: paragraph.text,
  });
}
const stripSpace = text => text.replace(/\s+/g, '');
assert.deepEqual(corrected.prose.map(row => stripSpace(row.text)),
  before.prose.map(row => stripSpace(row.text)));
const reversed = structuredClone(corrected);
reversed.title = before.title;
reversed.section_breaks = before.section_breaks;
reversed.prose.forEach((row, index) => { row.text = before.prose[index].text; });
assert.deepEqual(reversed, before);
const resolvedRun = spawnSync(process.execPath, [
  '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--stdin',
], { input: JSON.stringify(corrected), encoding: 'utf8', timeout: 60000 });
assert.equal(resolvedRun.status, 0, resolvedRun.stderr);
const resolved = JSON.parse(resolvedRun.stdout);
await immutableWrite(`${folder}/normalization-command.json`, `${JSON.stringify({
  status: normalizedRun.status, stderr: normalizedRun.stderr,
  domainApi: 'edition.normalize_lesson_layout', sourceProseNotChanged: true,
}, null, 2)}\n`);
await immutableWrite(`${folder}/native-flow.json`, `${JSON.stringify(resolved, null, 2)}\n`);
await fs.writeFile(absolute(templatePath), `${JSON.stringify(corrected, null, 2)}\n`);
const currentLesson = await bind(templatePath);
await immutableWrite(output, `${JSON.stringify({
  ticket: 'STEMROBIN-181', lesson: corrected.id, status: 'native-layout-corrected-SCI-unchanged',
  originalScience: await bind(originalSciencePath), initialNativeFailure: await bind(failedPath),
  before: await bind(`${folder}/before.lesson.template.json`), currentLesson,
  flow: await bind(`${folder}/native-flow.json`),
  changedFields: ['title', 'section_breaks', 'prose[].text whitespace only'],
  exactNonWhitespaceProseUnchanged: true, titleRestoredToSourceIdentity: true,
  paragraphs: resolved.paragraphs.length, sectionBreaks: resolved.boundaries.length,
  nativeRepairsUsed: 1, scientificContentChanges: 0,
  limits: 'Only the affected native identity/layout contract corrected. Original authored freeze, SCI and failed native evidence retained. No new science gate, source operation, image, figure or rendered surface.',
}, null, 2)}\n`);
const effectiveSciencePath = `${tmp}/9p-n105-science-effective-review.json`;
await immutableWrite(effectiveSciencePath, `${JSON.stringify({
  ...originalScience, status: 'pass',
  bindings: { ...originalScience.bindings,
    lessonTemplate: currentLesson, nativeLayoutCorrection: await bind(output) },
  counts: { ...originalScience.counts, reviewedPublishedParagraphs: resolved.paragraphs.length },
  affectedOnlyBindingUpdate: {
    initialSCI: await bind(originalSciencePath), correction: await bind(output),
    exactNonWhitespaceProseUnchanged: true, scientificReviewRepeated: false,
    titleOnlyRestoresStableSourceIdentity: true,
  },
}, null, 2)}\n`);
const originalGatePath = `${tmp}/9p-n105-figure-review.json`;
const gate = await read(originalGatePath);
assert.deepEqual(gate.figures, []);
const effectiveGatePath = `${tmp}/9p-n105-figure-effective-review.json`;
await immutableWrite(effectiveGatePath, `${JSON.stringify({
  ...gate, currentLesson, originalApplicability: await bind(originalGatePath),
  correction: await bind(output), scientificReviewOrFigureGateRepeated: false,
}, null, 2)}\n`);
console.log(JSON.stringify({ correction: await bind(output),
  science: await bind(effectiveSciencePath), figures: await bind(effectiveGatePath) }));

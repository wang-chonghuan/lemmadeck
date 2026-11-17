import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import {
  absolute, read, bytes, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

const [card, id, reportPath] = process.argv.slice(2);
assert.equal(card, 'phy9-c2-s5-n114');
assert.ok(['fig-233', 'fig-234', 'fig-235', 'fig-236', 'fig-237'].includes(id));
const report = await read(reportPath);
assert.equal(report.status.toLowerCase(), 'pass');
const reviewed = report.figures.find(row => row.id === id);
assert.equal(reviewed.status, 'pass');
const binding = reviewed.bindings;
for (const key of ['source', 'context', 'lesson', 'english', 'spec', 'render', 'svg'])
  await verify(binding[key].path, binding[key].sha256);
const template = `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${card}/lesson.template.json`;
await verify(template, binding.lesson.sha256);
const chinese = await read(template);
const english = await read(binding.english.path);
const spec = await read(binding.spec.path);
assert.equal(spec.id, id);
assert.equal(spec.mode, 'deterministic');
assert.equal(spec.source.image.sha256, binding.source.sha256);
const normalize = text => text.replace(/\s+/g, '');
const allText = lesson => lesson.prose.map(row => row.text).filter(Boolean).join('\n\n');
const paragraphText = lesson => lesson.prose.filter(row => row.kind === 'p')
  .map(row => row.text).filter(Boolean).join('\n\n');
const completeVariants = lesson => [
  allText(lesson),
  [lesson.printed_title, allText(lesson)].filter(Boolean).join('\n\n'),
  [lesson.title, allText(lesson)].filter(Boolean).join('\n\n'),
  paragraphText(lesson),
];
const contexts = spec.source.authoritativeText.filter(row => row.lesson === card);
assert.ok(contexts.length);
assert.ok(contexts.every(row => row.exercise == null));
const joined = normalize(contexts.map(row => row.text).join('\n\n'));
const chineseVariants = completeVariants(chinese);
const englishVariants = completeVariants(english);
const legalCompleteContexts = [
  ...chineseVariants,
  ...chineseVariants.flatMap(zh => englishVariants.map(en => `${zh}\n\n${en}`)),
];
assert.ok(legalCompleteContexts.some(text => normalize(text) === joined),
  'Figure context must match complete approved Chinese text, optionally followed by complete approved English.');
const render = await read(binding.render.path);
assert.equal(render.status, 'pass');
assert.equal(render.spec.sha256, binding.spec.sha256);
assert.equal(render.output.svg.sha256, binding.svg.sha256);
const durable = 'ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/figures';
const destinations = {
  spec: `${durable}/${id}.spec.json`, svg: `${durable}/${id}.svg`,
  render: `${durable}/${id}.render.json`,
  independent: `${durable}/${id}.independent-review.json`,
  review: `${durable}/${id}.review.json`,
};
for (const destination of Object.values(destinations)) assert.ok(!await exists(destination));
await fs.mkdir(absolute(durable), { recursive: true });
for (const key of ['spec', 'svg']) await immutableWrite(destinations[key], await bytes(binding[key].path));
const currentRender = structuredClone(render);
currentRender.spec.path = destinations.spec;
currentRender.output.svg.path = destinations.svg;
await immutableWrite(destinations.render, `${JSON.stringify(currentRender, null, 2)}\n`);
const retainedReportPath = reportPath.replace('/tmp/', '/evidence/reports/');
await verify(retainedReportPath, (await bind(reportPath)).sha256);
await immutableWrite(destinations.independent, `${JSON.stringify({
  ...reviewed,
  originalReport: await bind(retainedReportPath),
  promotion: {
    sourceSpecBytesUnchanged: true, mediaBytesUnchanged: true,
    evidenceOnlyPathRebound: true, completeBilingualContextBound: true,
    durable: destinations,
  },
}, null, 2)}\n`);
execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', [
  '.agents/skills/ld-s10y-image/scripts/record_review.py',
  '--spec', destinations.spec, '--render', destinations.render,
  '--output', destinations.review, '--status', 'pass',
  '--notes', 'Existing independent original/full-text/actual-width pixel review consumed. Complete Chinese and English context bound; approved spec/media unchanged, render paths only rebound.',
], { stdio: 'inherit' });
const manifestPath = template.replace('lesson.template.json', 'figures.template.json');
const manifest = await read(manifestPath);
const entry = manifest.figures.find(row => row.id === id);
assert.ok(entry);
for (const key of ['png', 'svg', 'artwork', 'render', 'generation', 'review', 'spec']) delete entry[key];
Object.assign(entry, {
  spec: `figures/${id}.spec.json`, svg: `figures/${id}.svg`,
  render: `figures/${id}.render.json`, review: `figures/${id}.review.json`,
});
await fs.writeFile(absolute(manifestPath), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ id, outputs: await Promise.all(Object.values(destinations).map(bind)) }));

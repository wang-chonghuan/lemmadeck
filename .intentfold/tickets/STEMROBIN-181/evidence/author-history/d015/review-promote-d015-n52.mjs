import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const ticket = '.intentfold/tickets/STEMROBIN-181';
const work = '.tmp/STEMROBIN-181/9p-n52-figures';
const rebound = `${work}/science-f1-binding`;
const read = async p => JSON.parse(await fs.readFile(p, 'utf8'));
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const bind = async path => ({ path, sha256: hash(await fs.readFile(path)) });
const verify = async b => assert.deepEqual(await bind(b.path), { path: b.path, sha256: b.sha256 });
const saveNew = async (p, value) => fs.writeFile(p, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const freeze = await read(`${rebound}/author-freeze.json`);
assert.equal(freeze.currentTemplate.sha256, '2d0e484cb71846a1ccd24800af4cdc0ef99d28c69fcdd64bb51f5b86ab926baa');
await verify(freeze.currentTemplate);
await verify(freeze.sourceLesson);
const current = await read(freeze.currentTemplate.path);
const science = await read(`${ticket}/tmp/9p-n52-science-correction.json`);
assert.equal(science.status, 'pass');
await verify(science.bindings.template);
const observations = {
  'fig-89': [
    'Original89 and all actual640/331/342 previews were opened in the preceding continuation, before this context-only rebind. No repeat pixel inspection.',
    'Six ascending stress labels200..1200, sigma and x10^5 N/m^2, only decimal-comma0,1/0,5 strain labels preserved. Four horizontal guides600/800/1000/1200 and three vertical projections800/1000/1200 match the source.',
    'The solid increasing concave-down curve begins at the origin and ends near0.5% at1200. No fracture dot or continuation is invented. The prose0.45% and graph are expressly unreconciled, not a validated material dataset.',
    'English labels are contained, no visible construction points or overlap; minimum mobile text16.55px at331. One label repair already used, no further geometry edit.',
  ],
  'fig-90': [
    'Original90 and all actual640/331/342 previews were opened in the preceding continuation, before this context-only rebind. No repeat pixel inspection.',
    'Five stress labels200..1000, five horizontal plus five vertical guides, and only0,1/0,5 strain labels match the source. The near-straight solid curve ends unlabelled above1000.',
    'No15% fracture, ultimate stress, necking or later branch is inserted into the initial graph. Current prose explicitly bars quantitative reconciliation or combining these curves with preceding Young moduli.',
    'English labels are contained, no visible construction points or overlap; minimum mobile text16.55px at331. One label repair already used, no further geometry edit.',
  ],
};
const figures = [];
for (const item of freeze.figures) {
  for (const b of [item.current.spec, item.current.context, item.current.template, item.before.spec,
    item.retainedSvg, item.retainedNativeRender, item.rebindRecord, ...item.retainedPreviews]) await verify(b);
  const old = await read(item.before.spec.path);
  const spec = await read(item.current.spec.path);
  const reversed = structuredClone(spec);
  reversed.source.authoritativeText = old.source.authoritativeText;
  assert.deepEqual(reversed, old);
  assert.deepEqual(spec.source.authoritativeText, [{
    lesson: current.id, text: [current.printed_title, ...current.prose.map(p => p.text)].join('\n\n'),
  }]);
  const render = await read(item.retainedNativeRender.path);
  assert.equal(render.status, 'pass');
  assert.equal(render.spec.sha256, item.before.spec.sha256);
  assert.equal(render.output.svg.sha256, item.retainedSvg.sha256);
  render.spec = item.current.spec;
  render.contextOnlyRebind = {
    originalNativeReport: item.retainedNativeRender,
    previousSpec: item.before.spec,
    currentSpec: item.current.spec,
    evidence: item.rebindRecord,
    changedOnly: '/source/authoritativeText',
    geometryAndDisplayDeepEqual: true, svgAndPreviewBytesUnchanged: true,
    rerendered: false, newRepair: false,
  };
  const renderPath = `${rebound}/${item.figure}.rebound.render.json`;
  await saveNew(renderPath, render);
  execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', [
    '.agents/skills/ld-s10y-image/scripts/validate_spec.py', item.current.spec.path, '--stage', 'draft',
  ], { stdio: 'inherit' });
  figures.push({
    id: item.figure, status: 'pass', reviewer: 'Main, independent of Einstein author',
    bindings: {
      source: await bind(spec.source.image.path), context: item.current.context,
      lesson: item.current.template, spec: item.current.spec, svg: item.retainedSvg,
      render: await bind(renderPath),
    },
    inspectedPixels: item.retainedPreviews,
    independentSourceAndPixelObservations: observations[item.figure],
    affectedOnlyContextCheck: 'Only corrected prose6 changed. No source, display, inventory, assertion, geometry, SVG or preview change; prior single inspection retained.',
    retainedContextRebind: item.rebindRecord, initialRepairsUsed: 1, remainingRepairs: 0,
    findings: [],
  });
}
const reportPath = `${ticket}/tmp/9p-n52-figure-review.json`;
await saveNew(reportPath, {
  ticket: 'STEMROBIN-181', lesson: current.id, status: 'pass',
  review: 'Unique initial independent source/figure/pixel inspection from preceding continuation; only current prose/spec binding completed now.',
  authorFreeze: await bind(`${rebound}/author-freeze.json`), figures,
  noRepeatedPixelGateOrRender: true,
});
for (const item of figures) execFileSync(process.execPath, [
  `${ticket}/tmp/promote-d005-figure.mjs`, '9p', current.id, item.id, reportPath,
], { stdio: 'inherit' });

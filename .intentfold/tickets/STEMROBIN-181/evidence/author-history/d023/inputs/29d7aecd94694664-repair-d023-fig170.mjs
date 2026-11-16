import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { ticket, read, bytes, bind, verify, exists, immutableWrite, absolute } from './retain-d016-evidence.mjs';

const tmp = `${ticket}/tmp`;
const work = `${tmp}/d023-n90-fig170-repair`;
const originalPath = `${tmp}/d023-n90-fig170-independent-review.json`;
await verify(originalPath, 'e97c19e2e1abdb693d5c3a6542b7039f38f7cb41a1590dbbefce2c205a8a59f8');
const original = await read(originalPath);
const figure = original.figures[0];
assert.equal(original.status, 'fail');
assert.equal(figure.repairBudget.authorUsed, 0);
assert.equal(figure.findings.length, 1);
assert.equal(figure.findings[0].id, 'FIG170-01');
assert.ok(!await exists(`${work}/started.json`));
const prior = await read(figure.bindings.spec.path);
const current = structuredClone(prior);
const links = [
  ['junction-1-label', 'label-1-anchor', 'label-1-above'],
  ['junction-2-label', 'label-2-anchor', 'label-2-above'],
  ['resistor-label', 'label-r-anchor', 'label-r-below'],
  ['current-label', 'label-i-anchor', 'label-i-above'],
  ['ammeter-label', 'label-a-anchor', 'label-a-at-center'],
  ['voltmeter-label', 'label-v-anchor', 'label-v-at-center'],
];
for (const [labelId, anchorId, assertionId] of links) {
  const label = current.objects.find(row => row.id === labelId);
  const at = structuredClone(label.at);
  current.objects.push({ id: anchorId, type: 'point', at, visible: false, stroke: 'ink', fill: 'ink' });
  label.at = anchorId;
  const assertion = current.assertions.find(row => row.id === assertionId);
  if (assertion) assertion.to = anchorId;
  else current.assertions.push({
    id: assertionId, type: 'displacement',
    from: labelId === 'ammeter-label' ? 'a-center' : 'v-center',
    to: anchorId, dx: 0, dy: 0,
  });
}
for (const [group, assertions] of [
  ['src-ammeter', ['label-a-at-center']], ['src-voltmeter', ['label-v-at-center']],
  ['src-resistor', ['label-r-below']], ['src-current', ['label-i-above']],
  ['src-labels', ['label-a-at-center', 'label-v-at-center']],
]) current.source.inventory.find(row => row.id === group).assertions.push(...assertions);
await immutableWrite(`${work}/spec.json`, `${JSON.stringify(current, null, 2)}\n`);
const paths = { spec: `${work}/spec.json`, render: `${work}/render.json`, svg: `${work}/fig-170.svg` };
await immutableWrite(`${work}/started.json`, `${JSON.stringify({
  original: await bind(originalPath), priorSpec: figure.bindings.spec, currentSpec: await bind(paths.spec),
  change: 'Six unchanged label coordinates now use shared invisible point anchors referenced by mapped displacements; two zero-displacements attach A/V anchors to their own meter centers. Hidden construction anchors are not source-visible inventory objects.',
  links, targetedRepairUsed: 1, targetedRepairMaximum: 1, mainImageOpens: 0,
}, null, 2)}\n`);
const run = (name, executable, args) => {
  const output = execFileSync(executable, args, { encoding: 'utf8',
    env: { ...process.env, PLAYWRIGHT_HTML_OPEN: 'never', PWDEBUG: undefined } });
  return immutableWrite(`${work}/${name}-command.json`, `${JSON.stringify({
    executable, args, exitCode: 0, stdout: output,
  }, null, 2)}\n`);
};
await run('render', process.execPath, ['.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '--spec', paths.spec, '--svg', paths.svg, '--report', paths.render]);
await run('validation', '.claude/skills/ld-s10y-lesson/.venv/bin/python',
  ['-B', '.agents/skills/ld-s10y-image/scripts/validate_spec.py', paths.spec, '--stage', 'rendered', '--json']);
assert.equal((await read(paths.render)).status, 'pass');
delete process.env.PWDEBUG;
process.env.PLAYWRIGHT_HTML_OPEN = 'never';
const require = createRequire(absolute('app/package.json'));
const { chromium } = require('playwright');
const browser = await chromium.launch({ headless: true });
const svg = (await bytes(paths.svg)).toString('utf8');
const previews = [];
try {
  for (const width of current.display.widths) {
    const context = await browser.newContext({ viewport: { width, height: 480 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
      html,body{margin:0;padding:0;background:white;}
      figure{margin:0;width:100%;max-width:${current.display.maxWidthPx}px;}
      figure>svg{display:block;width:100%;height:auto;}
    </style></head><body><figure aria-label="Circuit section from point 1 to point 2">${svg}</figure></body></html>`);
    const filename = `${work}/w${width}.png`;
    await page.locator('figure').screenshot({ path: absolute(filename) });
    const old = figure.previews.find(row => row.width === width);
    await verify(old.path, old.sha256);
    previews.push({ width, prior: { path: old.path, sha256: old.sha256 }, current: await bind(filename),
      identicalPNGBytes: Buffer.compare(await bytes(filename), await bytes(old.path)) === 0 });
    await context.close();
  }
} finally {
  await browser.close();
}
assert.ok(previews.every(row => row.identicalPNGBytes), 'Stop: exact prior pixels cannot be reused.');
const visible = object => object.visible !== false;
const oldObjects = prior.objects.filter(visible);
const newObjects = current.objects.filter(visible).map(object => {
  if (object.type !== 'text') return object;
  return { ...object, at: current.objects.find(row => row.id === object.at).at };
});
assert.deepEqual(newObjects, oldObjects);
assert.deepEqual(current.source.authoritativeText, prior.source.authoritativeText);
for (const name of ['source', 'context', 'lesson']) await verify(figure.bindings[name].path, figure.bindings[name].sha256);
await immutableWrite(`${work}/author-correction-freeze.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D023', figure: 'fig-170',
  status: 'one-assertion-repair-frozen-affected-independent-review-pending',
  original: await bind(originalPath), originalAuthor: figure.bindings.authoredFreeze,
  bindings: {
    source: figure.bindings.source, context: figure.bindings.context, lesson: figure.bindings.lesson,
    spec: await bind(paths.spec), render: await bind(paths.render), svg: await bind(paths.svg),
    repairHelper: await bind(`${tmp}/repair-d023-fig170.mjs`),
    renderCommand: await bind(`${work}/render-command.json`),
    validationCommand: await bind(`${work}/validation-command.json`),
    started: await bind(`${work}/started.json`),
  },
  links, previews, sourceAndContextAndVisibleCoordinatesAndStylesUnchanged: true,
  exactPriorVisualPixelsReusable: true, targetedRepairsUsed: 1, targetedRepairMaximum: 1,
  nativeCorrection: { render: 1, explicitValidation: 1, previewWidths: previews.length },
  mainImageOpens: 0, owningVisualAndSourceObservationsReplayed: false,
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(`${work}/author-correction-freeze.json`)));

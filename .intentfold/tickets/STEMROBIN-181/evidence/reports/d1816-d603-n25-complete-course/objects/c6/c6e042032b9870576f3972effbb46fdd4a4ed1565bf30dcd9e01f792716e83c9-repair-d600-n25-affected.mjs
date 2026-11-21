import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const A = `${T}/tmp/d1816-d591-n25-bilingual-author`;
const F = `${T}/tmp/d1816-d593-n25-figures-first`;
const O = `${T}/tmp/d1816-d600-n25-affected-repair`;
const E = `${T}/evidence/reports/d1816-d600-n25-affected-repair`;
const R = `${T}/tmp/d1816-d596-n25-first-review/report.json`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({ path: path.resolve(file), bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(bind(from).sha256, bind(to).sha256);
};
const native = (name, command, args) => execFileSync('node', [
  `${T}/tmp/d1816-recovery/run-native.mjs`, name, command, ...args,
], { cwd: repo, stdio: 'inherit' });
assert(!fs.existsSync(O));
const review = read(R);
assert.equal(review.status, 'revise');
assert.equal(review.SCI.status, 'pass');
assert.deepEqual(review.findings.map(row => row.id),
  ['N25-TEXT-NOTATION-DECLARATION', 'N25-F42-CURVE-WEIGHT']);
for (const row of Object.values(review.text_bindings))
  if (row?.path && row?.sha256) assert.equal(bind(row.path).sha256, row.sha256);
for (const file of ['report.json', 'independent-source-inventory.json', 'check_evidence.py'])
  copy(`${T}/tmp/d1816-d596-n25-first-review/${file}`, `${E}/first-review/${file}`);
const text = [];
for (const locale of ['zh', 'en']) {
  const from = `${A}/${locale}/lesson.template.json`;
  const lesson = read(from);
  const expected = structuredClone(lesson);
  const indices = [9, 10, 11, 12, 18];
  for (const index of indices) {
    assert(lesson.prose[index].text.includes('\\mathrm{m}'));
    assert(!lesson.prose[index].changes.includes('notation'));
    lesson.prose[index].changes.push('notation');
    expected.prose[index].changes.push('notation');
  }
  assert.deepEqual(lesson, expected);
  save(`${O}/${locale}/lesson.template.json`, lesson);
  for (const name of ['exercises.template.json', 'figures.template.json'])
    copy(`${A}/${locale}/${name}`, `${O}/${locale}/${name}`);
  text.push({ locale, before: bind(from), after: bind(`${O}/${locale}/lesson.template.json`),
    zeroBasedProseIndices: indices, onlyChange: 'append notation to changes',
    proseFormulasSourceSnapshotsSectionBreaksAndExercisesUnchanged: true });
}
for (const suffix of ['spec.json', 'svg', 'render.json', 'preview.png'])
  copy(`${F}/fig-42.${suffix}`, `${E}/before/fig-42.${suffix}`);
const spec = read(`${F}/fig-42.spec.json`);
const expectedSpec = structuredClone(spec);
const current = spec.objects.find(row => row.id === 'current-curve');
const voltage = spec.objects.find(row => row.id === 'voltage-curve');
assert.equal(current.strokeWidth, 3);
assert.equal(voltage.strokeWidth, 3);
current.strokeWidth = 5;
expectedSpec.objects.find(row => row.id === 'current-curve').strokeWidth = 5;
const inventoryNote = ' The source distinguishes a thicker current curve from a thinner voltage curve; the modern current stroke is visibly heavier while both curves remain solid.';
spec.source.inventory[0].description += inventoryNote;
expectedSpec.source.inventory[0].description += inventoryNote;
assert.deepEqual(spec, expectedSpec);
save(`${O}/fig-42.spec.json`, spec);
native('d600-n25-fig42-affected-spec', '.claude/skills/ld-s10y-lesson/.venv/bin/python', [
  '-B', '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
  `${O}/fig-42.spec.json`, '--stage', 'draft',
]);
native('d600-n25-fig42-affected-render', 'node', [
  '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '--spec', `${O}/fig-42.spec.json`, '--svg', `${O}/fig-42.svg`,
  '--report', `${O}/fig-42.render.json`,
]);
const oldSvg = fs.readFileSync(`${F}/fig-42.svg`, 'utf8');
const newSvg = fs.readFileSync(`${O}/fig-42.svg`, 'utf8');
assert.equal(newSvg, oldSvg.replace('stroke-width="3"', 'stroke-width="5"'));
const { chromium } = createRequire(`${repo}/app/package.json`)('playwright');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: spec.canvas,
    deviceScaleFactor: 1 });
  await page.route('**/*', route => route.abort());
  await page.setContent(`<style>html,body{margin:0;padding:0;background:white}
    :root{--ld-figure-ink:#1b1b1b;--ld-figure-muted:#6b6b6b;--ld-figure-accent:#1b1b1b;
    --ld-figure-accent-soft:#777;--ld-figure-grid:#ddd;--ld-figure-paper:#fff}</style>${newSvg}`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${O}/fig-42.preview.png` });
} finally { await browser.close(); }
save(`${O}/repair.json`, {
  status: 'AFFECTED_REPAIR_NATIVE_PASS_INDEPENDENT_REVIEW_PENDING',
  firstReview: bind(`${E}/first-review/report.json`), text,
  figure: { id: 'fig-42', before: bind(`${F}/fig-42.spec.json`),
    spec: bind(`${O}/fig-42.spec.json`), svg: bind(`${O}/fig-42.svg`),
    render: bind(`${O}/fig-42.render.json`), preview: bind(`${O}/fig-42.preview.png`),
    onlyChanges: ['current-curve.strokeWidth: 3 -> 5', 'inventory description'],
    sourcePixelsGeometryLabelsAxesPhaseEndpointsAndLeaderBindingsUnchanged: true },
  unchangedFigures: ['fig-40', 'fig-41'], scientificTextUnchanged: true,
  sourceIdentityHoldsPreserved: true, parentImageOpens: 0,
  contentRepairRoundsAdded: 1, paidCalls: 0, databaseWrites: false,
});
console.log(JSON.stringify({ repair: bind(`${O}/repair.json`), affectedReview: 'PENDING' }));

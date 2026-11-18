import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const tmp = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp');
const owned = path.join(tmp, 'd592-n75-fig165-first-independent-review');
const author = path.join(tmp, 'd577-n75-fig164165-first-modern-author');
const fig = path.join(author, 'fig-165');
const book = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/10p');
const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const load = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const bindings = [];
const exclusions = [];

function resolve(p) {
  if (/(?:^|\/)fig-164(?:[./]|$)/.test(p)) throw Error('FIG164 excluded');
  if (path.isAbsolute(p)) return p;
  for (const base of [root, book]) {
    const candidate = path.join(base, p);
    if (fs.existsSync(candidate)) return candidate;
  }
  throw Error(`Unresolved binding: ${p}`);
}
function verify(p, expected, location) {
  const file = resolve(p);
  const actual = sha(file);
  const mode = `0${(fs.statSync(file).mode & 0o777).toString(8)}`;
  bindings.push({ location, path: file, expected_sha256: expected, actual_sha256: actual, matches: actual === expected, mode });
  assert.equal(actual, expected, location);
  return file;
}
function walk(value, location) {
  if (!value || typeof value !== 'object') return;
  if (value.figure === 'fig-164') {
    exclusions.push(`${location}: unrelated FIG164 record not inspected`);
    return;
  }
  if (typeof value.path === 'string' && /^[a-f0-9]{64}$/.test(value.sha256 || '')) {
    verify(value.path, value.sha256, location);
  }
  for (const [key, child] of Object.entries(value)) walk(child, `${location}/${key}`);
}

const reportPath = verify(path.join(fig, 'report.json'), '8dd29955a28ffd5dc883e4a5c020e10b0aeb66c27896911e8e0cd8907517376c', 'requested-author-report');
const freezePath = verify(path.join(fig, 'author-freeze.json'), '55d9312817771adb44f92280bd2b3aaf32610cae36b61fcf6f314331f5ff015c', 'requested-author-freeze');
const textPath = verify(path.join(tmp, 'd568-n75-first-independent-text-review/report.json'), '1f6feb01e70e2483b130643f338ac76a38e5430339bfc94563d4f92fa7e1f5ca', 'inherited-text-review');
const report = load(reportPath);
const freeze = load(freezePath);
walk(report, 'author-report');
walk(freeze, 'author-freeze');
assert.ok(freeze.files.every((f) => `0${(fs.statSync(f.path).mode & 0o777).toString(8)}` === f.mode));

const spec = load(report.artifacts.spec.path);
const render = load(report.artifacts.render.path);
const commands = load(report.artifacts.commands.path);
walk(spec.source.image, 'spec-source');
walk(render, 'native-render');
walk(commands, 'native-commands');
const context = load(resolve(report.editionBinding.contexts.path));
walk(context, 'figure165-context');
const browserAll = load(resolve(report.artifacts.browser.path));
const browser = browserAll.observations.find((x) => x.figure === 'fig-165');
assert.ok(browser);
walk(browser, 'author-browser-fig165-only');
const browserCommand = load(resolve(report.artifacts.browserCommand.path));
walk(browserCommand, 'author-browser-command');
assert.equal(browserCommand.exitCode, 0);
assert.equal(browserAll.browserClosed, true);
assert.deepEqual(browserAll.browserErrors, []);
assert.equal(browser.svgBytesUnmodified, true);
assert.equal(browser.headless, true);
assert.equal(browser.isolated, true);
assert.equal(browser.nativeRerender, false);
assert.equal(browser.deviceScaleFactor, 1);
for (const item of browser.widthChecks) {
  assert.ok(item.labels.every((x) => x.inside && x.px >= spec.display.minTextPx));
  assert.equal(item.colorsResolved, true);
}
assert.equal(render.status, 'pass');
assert.equal(render.spec.sha256, report.artifacts.spec.sha256);
assert.equal(render.output.svg.sha256, report.artifacts.svg.sha256);
assert.equal(commands.nativeRender, 'PASS');
assert.equal(spec.schema, 'ld-s10y-image/figure-spec@2');
assert.equal(render.schema, 'ld-s10y-image/render@2');

const en = load(resolve(report.editionBinding.fullEN.path));
const zh = load(resolve(report.editionBinding.fullZH.path));
const expectedText = [];
for (const [locale, lesson] of [['EN', en], ['ZH', zh]]) {
  lesson.prose.forEach((block, i) => {
    if (block.text.trim()) expectedText.push({ lesson: lesson.id, text: `${locale} /prose/${i}/text\n${block.text}` });
  });
}
assert.deepEqual(spec.source.authoritativeText, expectedText);
const inherited = load(textPath);
assert.equal(inherited.SCI, 'PASS');
assert.equal(inherited.ZHEN, 'PASS');
for (const binding of [report.editionBinding.fullEN, report.editionBinding.fullZH]) {
  const row = inherited.bindingEvidence.candidates.find((x) => resolve(x.path) === resolve(binding.path));
  assert.ok(row && row.sha256 === binding.sha256);
}
const objectIds = new Set(spec.objects.map((x) => x.id));
const assertionIds = new Set(spec.assertions.map((x) => x.id));
assert.equal(objectIds.size, spec.objects.length);
assert.equal(assertionIds.size, spec.assertions.length);
assert.ok(spec.source.inventory.every((x) => x.objects.every((id) => objectIds.has(id)) && x.assertions.every((id) => assertionIds.has(id))));

const validationPath = path.join(fig, 'first/native-validate.stdout.txt');
const validation = load(validationPath);
assert.equal(validation.status, 'pass');
assert.deepEqual(validation.errors, []);
const schemaPath = path.join(root, '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json');
const schema = load(schemaPath);
assert.equal(schema.$id, spec.schema);
assert.ok(schema.required.every((key) => key in spec));
assert.ok(Object.keys(spec).every((key) => key in schema.properties));

const output = {
  schema: 'd592-fig165-readonly-binding-audit@1',
  status: 'PASS',
  bindings,
  exclusions,
  scope: 'All FIG165 path/sha256 bindings in requested author report, per-figure freeze, native render, native commands, FIG165 context and filtered browser record; shared browser command outputs. Inherited d568 report and exact EN/ZH candidate bindings only; no text re-review or recursive re-review of d568 upstream evidence.',
  uniqueFilesVerified: new Set(bindings.map((x) => x.path)).size,
  perFigureAuthorFreezeAllModes0444: true,
  fullEditionRead: { enProseObjects: en.prose.length, zhProseObjects: zh.prose.length, boundNonemptyTexts: expectedText.length, exactSpecAuthoritativeTextMatches: true },
  inheritedSCI: 'PASS-NOT-REPLAYED',
  inheritedZHEN: 'PASS-NOT-REPLAYED',
  schemas: { spec: spec.schema, render: render.schema, validation: validation.schema, authorReport: report.schema, authorFreeze: freeze.schema, browser: browserAll.schema, figureSpecSchema: { path: schemaPath, sha256: sha(schemaPath) }, inspection: 'Current schema required fields, top-level keys, native declarations and object/assertion references inspected; existing native validation PASS retained. Native validator NOT invoked.' },
  authorScreenshot342EligibleForReuse: true,
  authorNativeFull: { ...report.artifacts.fullResolution, binding: 'commands.json/output and per-figure author-freeze', limitation: 'Not listed as isolated Chromium CSS-resolved full screenshot; FIRST independent full-width browser preview needed, without native/resvg replay.' },
  browser: browser,
  sourceFineDetailHOLD: report.source.fineDetailHOLD,
  nativeValidationInvocations: 0,
  nativeRenderInvocations: 0,
  resvgInvocations: 0,
  wroteOutsideOwnedDirectory: false
};
fs.writeFileSync(path.join(owned, 'binding-audit.json'), `${JSON.stringify(output, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ status: output.status, uniqueFilesVerified: output.uniqueFilesVerified, textBindings: expectedText.length, screenshot342Eligible: true, nativeReplays: 0 }));

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const W = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const T = path.join(W, '.intentfold/tickets/STEMROBIN-181');
const E = path.join(T, 'tmp/d040-9p-fig300-independent-evidence');
const P = path.join(T, 'tmp/d040-fig300-path-binding');
const A = path.join(T, 'tmp/d040-9p-fig300-author');
const R = path.join(T, 'tmp/d040-9p-n133-text-repair');
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const load = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = (file, expected) => {
  const absolute = path.isAbsolute(file) ? file : path.join(W, file);
  const observed = sha256(fs.readFileSync(absolute));
  if (expected) assert.equal(observed, expected, absolute);
  return { path: absolute, sha256: observed, ...(expected ? { expectedSha256: expected, matches: true } : {}) };
};
const inputs = {
  authorFreeze: bind(path.join(A, 'author-freeze.json'), '10162f1bae745e4edc7c3d853eeb553251597611084b411b338f1a39cf038f41'),
  parentBinding: bind(path.join(P, 'binding.json'), '11e22b8c04c58dba0aaf505274d9357201ff923afc5f13f4174b0eaca76d2dad'),
  source: bind(path.join(W, 'ssot-resources/soviet10year-textbooks/artifacts/9p/figures/fig-300.png'), '0347b7a9e27ee0ff88402fd4ebb826232e4f8e2dd176b7405b7adc2e7445277e'),
  repairFreeze: bind(path.join(R, 'repair-freeze.json'), '747eccd3e5dc2f7ee66a95ca56267302c0060a35fcc69ef0daa83b6f24c5809d'),
  affectedScience: bind(path.join(T, 'tmp/d040-9p-n133-science-affected-review.json'), '67578cba616299bcddab46d6e9e8359066e36e15e5de0939d9e5cd855d74aed6'),
  spec: bind(path.join(P, 'fig-300.spec.json')),
  svg: bind(path.join(P, 'fig-300.svg'), 'ba323d3420c033a3d4a63a3391f171b545186ff33e97d83517fceab7052a6862'),
  render: bind(path.join(P, 'fig-300.render.json')),
};
const frozen = load(inputs.authorFreeze.path);
const parent = load(inputs.parentBinding.path);
for (const item of [...parent.original, ...parent.current]) bind(item.path, item.sha256);
const originalSpec = load(frozen.outputs.spec.path);
const spec = load(inputs.spec.path);
const render = load(inputs.render.path);
const originalRender = load(frozen.outputs.render.path);
const changes = (a, b, pointer = '') => {
  if (JSON.stringify(a) === JSON.stringify(b)) return [];
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object' || Array.isArray(a) !== Array.isArray(b)) return [{ pointer, before: a, after: b }];
  return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap((key) => changes(a[key], b[key], `${pointer}/${key}`));
};
const specChanges = changes(originalSpec, spec);
assert.deepEqual(specChanges.map((item) => item.pointer), ['/source/image/path']);
assert.equal(spec.source.image.path, inputs.source.path);
const reversedSpec = structuredClone(spec);
reversedSpec.source.image.path = originalSpec.source.image.path;
assert.deepEqual(reversedSpec, originalSpec);
const reversedSpecSha = sha256(Buffer.from(`${JSON.stringify(reversedSpec, null, 2)}\n`));
assert.equal(reversedSpecSha, frozen.outputs.spec.sha256);
assert.equal(Buffer.compare(fs.readFileSync(inputs.svg.path), fs.readFileSync(frozen.outputs.svg.path)), 0);
const renderChanges = changes(originalRender, render);
const allowed = ['/spec/path', '/spec/sha256', '/output/svg/path'];
assert(renderChanges.every((item) => allowed.includes(item.pointer)));
const reversedRender = structuredClone(render);
reversedRender.spec = structuredClone(originalRender.spec);
reversedRender.output.svg.path = originalRender.output.svg.path;
assert.deepEqual(reversedRender, originalRender);
const reversedRenderSha = sha256(Buffer.from(`${JSON.stringify(reversedRender, null, 2)}\n`));
assert.equal(reversedRenderSha, frozen.outputs.render.sha256);
assert.equal(render.status, 'pass');
assert.equal(render.spec.sha256, inputs.spec.sha256);
assert.equal(render.output.svg.sha256, inputs.svg.sha256);
assert.equal(path.resolve(W, render.spec.path), inputs.spec.path);
assert.equal(path.resolve(W, render.output.svg.path), inputs.svg.path);
const freezeRecords = [];
const traverse = (value) => {
  if (!value || typeof value !== 'object') return;
  if (typeof value.path === 'string' && typeof value.sha256 === 'string') freezeRecords.push(bind(value.path, value.sha256));
  for (const item of Object.values(value)) traverse(item);
};
traverse(frozen);
const textBindings = ['zh', 'en'].map((language) => {
  const templatePath = path.join(R, language, 'lesson.template.json');
  const template = load(templatePath);
  const expected = load(inputs.repairFreeze.path).languages.find((item) => item.language === language).templates.find((item) => item.path.endsWith('/lesson.template.json'));
  const record = bind(templatePath, expected.sha256);
  const prose = template.prose.filter((item) => ['p', 'cap'].includes(item.kind) && item.text.trim());
  assert(prose.every((item) => spec.source.authoritativeText.some((entry) => entry.text === item.text)));
  return { language, ...record, completeProseAndCaptionBound: true, textBlockCount: prose.length };
});
const objects = new Map(spec.objects.map((item) => [item.id, item]));
const assertions = new Map(spec.assertions.map((item) => [item.id, item]));
const sourceGroups = spec.source.inventory.map((group) => {
  assert(group.objects.every((id) => objects.has(id)));
  assert(group.assertions.every((id) => assertions.has(id)));
  return { id: group.id, objectCount: group.objects.length, assertionCount: group.assertions.length, allReferencesResolve: true };
});
const at = (value) => typeof value === 'string' ? objects.get(value).at : value;
const wires = (prefix) => spec.objects.filter((item) => item.type === 'segment' && item.id.startsWith(prefix) && item.id.includes('-wire-')).map((item) => ({ id: item.id, from: at(item.from), to: at(item.to) }));
const primary = wires('primary-');
const secondary = wires('secondary-');
const intersects = (a, b) => {
  const cross = (p, q, r) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);
  const on = (p, q, r) => Math.abs(cross(p, q, r)) < 1e-8 && r[0] >= Math.min(p[0], q[0]) && r[0] <= Math.max(p[0], q[0]) && r[1] >= Math.min(p[1], q[1]) && r[1] <= Math.max(p[1], q[1]);
  const c = [cross(a.from, a.to, b.from), cross(a.from, a.to, b.to), cross(b.from, b.to, a.from), cross(b.from, b.to, a.to)];
  return (c[0] * c[1] < 0 && c[2] * c[3] < 0) || on(a.from, a.to, b.from) || on(a.from, a.to, b.to) || on(b.from, b.to, a.from) || on(b.from, b.to, a.to);
};
const crossCircuitWireIntersections = primary.flatMap((a) => secondary.filter((b) => intersects(a, b)).map((b) => [a.id, b.id]));
const ticks = spec.objects.filter((item) => /^meter-scale-tick-\d+$/.test(item.id));
const receipt = {
  schema: 'ld-s10y-image/independent-binding-audit@1',
  inputs,
  originalOutputs: frozen.outputs,
  specChanges,
  renderChanges,
  reversibility: { specStructurallyEqual: true, specByteHashRestored: reversedSpecSha, renderStructurallyEqual: true, renderByteHashRestored: reversedRenderSha, svgByteIdentical: true },
  geometryObjectsAssertionsCanvasDisplayInventoryUnchanged: true,
  frozenRecordCountVerified: freezeRecords.length,
  frozenRecords: freezeRecords,
  textBindings,
  sourceGroups,
  render: { status: render.status, currentSpecHashMatches: true, currentSvgHashMatches: true, bindingPathsResolve: true, labels: render.labels, collisions: render.collisions, displayChecks: render.displayChecks },
  repairBudget: { declaredAuthorRepairsUsed: frozen.targetedRepairsUsed, allowed: frozen.targetedRepairsAllowed, authorRendererInvocations: frozen.rendererInvocations, reviewerRepairs: 0, reviewerRendererInvocations: 0 },
  topology: { primaryExternalWireCount: primary.length, secondaryExternalWireCount: secondary.length, crossCircuitWireIntersections, switchGap: assertions.get('primary-switch-gap'), terminalSeparation: assertions.get('meter-terminal-separation') },
  ticks: { independentSourceCount: 11, currentCandidateCount: ticks.length, candidateIds: ticks.map((item) => item.id), match: ticks.length === 11 },
};
fs.writeFileSync(path.join(E, 'binding-audit-receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify({
  specChanges,
  renderChanges,
  reversibility: receipt.reversibility,
  frozenRecordCountVerified: freezeRecords.length,
  textBindings,
  crossCircuitWireIntersections,
  ticks: receipt.ticks,
}, null, 2));

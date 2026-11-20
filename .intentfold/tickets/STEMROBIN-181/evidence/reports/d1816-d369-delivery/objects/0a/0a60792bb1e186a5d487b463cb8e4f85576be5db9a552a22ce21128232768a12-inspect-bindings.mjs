import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { isDeepStrictEqual } from 'node:util';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
if (process.cwd() !== repo) throw new Error('Wrong working directory');
const tmp = resolve(repo, '.intentfold/tickets/STEMROBIN-181/tmp');
const out = resolve(tmp, 'd1816-d355-fig277-first-review');
const read = path => JSON.parse(readFileSync(path, 'utf8'));
const hash = path => createHash('sha256').update(readFileSync(path)).digest('hex');
const bindings = [];
function bind(item) {
  const path = resolve(repo, item.path);
  const actualSha256 = hash(path);
  bindings.push({ path, sha256: item.sha256, actualSha256, matches: actualSha256 === item.sha256 });
}
const contextPath = resolve(tmp, 'd1816-d352-current-figure-context/context.json');
bind({ path: contextPath, sha256: '392b337a396b3ad5b230b083745cee6f1723a3e3044ba1c5a515f0b3a0ad59b2' });
const context = read(contextPath);
for (const key of ['source', 'spec', 'render', 'svg', 'preview', 'originalAuthor', 'repairedText']) bind(context[key]);
const spec = read(context.spec.path);
const render = read(context.render.path);
bind(spec.source.image);
bind(render.spec);
bind(render.output.svg);
const author = read(context.originalAuthor.path);
for (const key of ['spec', 'render', 'svg', 'preview']) bind(author[key]);
for (const item of author.mechanicalEvidence.nativeReceipts) bind(item);
const oldSpec = read(author.spec.path);
const textFreeze = read(context.repairedText.path);
const authoritative = [];
const locales = [];
for (const record of textFreeze.records) {
  bind(record.after);
  bind(record.working);
  const template = read(record.working.path);
  const prefix = `${template.id}/${template.edition}`;
  for (const key of ['chapter', 'title', 'printed_title']) authoritative.push({ lesson: `${prefix}/${key}`, text: template[key] });
  template.prose.forEach((block, index) => {
    if (block.text) authoritative.push({ lesson: `${prefix}/prose/${String(index + 1).padStart(3, '0')}`, text: block.text });
  });
  locales.push({
    locale: record.locale,
    proseBlocks: template.prose.length,
    nonemptyTextBlocks: template.prose.filter(block => block.text).length,
    figureBlocks: template.prose.filter(block => block.kind === 'fig').map(block => block.id),
    exerciseCount: template.exercise_count,
    frozenAndWorkingEqual: hash(record.after.path) === hash(record.working.path)
  });
}
const objectMap = new Map(spec.objects.map(object => [object.id, object]));
const assertionMap = new Map(spec.assertions.map(assertion => [assertion.id, assertion]));
const missingRefs = [];
const inventory = spec.source.inventory.map(group => {
  for (const id of group.objects) if (!objectMap.has(id)) missingRefs.push(`inventory ${group.id}: object ${id}`);
  for (const id of group.assertions) if (!assertionMap.has(id)) missingRefs.push(`inventory ${group.id}: assertion ${id}`);
  const mappedPoints = group.objects.filter(id => objectMap.get(id)?.type === 'point');
  const relations = group.assertions.map(id => assertionMap.get(id)).filter(a => a?.type === 'displacement');
  const pointRelationshipCoverage = (group.requires ?? []).includes('pointRelationships')
    ? mappedPoints.every(id => relations.some(a => [a.from, a.to].includes(id) && group.objects.includes(a.from) && group.objects.includes(a.to)))
    : null;
  return { id: group.id, objects: group.objects.length, assertions: group.assertions.length, pointRelationshipCoverage };
});
const edgeObjects = spec.objects.filter(object => ['arrow', 'segment'].includes(object.type));
const unassertedEdges = edgeObjects.filter(object => !spec.assertions.some(a =>
  a.type === 'connects' && a.arrow === object.id && a.from === object.from && a.to === object.to
)).map(object => object.id);
for (const object of spec.objects) {
  for (const key of ['from', 'to', 'center']) {
    if (typeof object[key] === 'string' && !objectMap.has(object[key])) missingRefs.push(`${object.id}.${key}: ${object[key]}`);
  }
}
const point = id => objectMap.get(id).at;
const residuals = spec.assertions.map(a => {
  const tolerance = a.tolerance ?? 1e-6;
  if (a.type === 'connects') {
    const object = objectMap.get(a.arrow);
    return { id: a.id, type: a.type, passes: object?.from === a.from && object?.to === a.to && objectMap.has(a.from) && objectMap.has(a.to) };
  }
  if (a.type === 'objectCount') return { id: a.id, type: a.type, passes: spec.objects.filter(o => o.type === a.objectType).length === a.count };
  if (a.type === 'displacement') {
    const [x, y] = point(a.from), [u, v] = point(a.to);
    const residual = Math.max(Math.abs(u - x - a.dx), Math.abs(v - y - a.dy));
    return { id: a.id, type: a.type, residual, tolerance, passes: residual <= tolerance };
  }
  if (a.type === 'pointOnCircle') {
    const [x, y] = point(a.point), [u, v] = point(a.center);
    const residual = Math.abs(Math.hypot(x - u, y - v) - a.radius);
    return { id: a.id, type: a.type, residual, tolerance, passes: residual <= tolerance };
  }
  if (a.type === 'collinear') {
    const [x, y] = point(a.a), [u, v] = point(a.b), [r, s] = point(a.c);
    const residual = Math.abs((u - x) * (s - y) - (v - y) * (r - x));
    return { id: a.id, type: a.type, residual, tolerance, passes: residual <= tolerance };
  }
  return { id: a.id, type: a.type, passes: false, reason: 'Unknown assertion type' };
});
const mappedObjectIds = new Set(spec.source.inventory.flatMap(group => group.objects));
const unmappedVisibleObjects = spec.objects.filter(o => o.visible !== false && !mappedObjectIds.has(o.id)).map(o => o.id);
const labels = spec.objects.filter(o => o.type === 'text').map(o => ({
  id: o.id, text: o.text, fontSize: o.fontSize,
  codepoints: Array.from(o.text).map(c => `U+${c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`)
}));
const neutronEdges = edgeObjects.filter(o => o.id.startsWith('neutron-leg-'));
const contiguousNeutronChain = neutronEdges.every((o, i) => i === 0 ? o.from === 'A' : neutronEdges[i - 1].to === o.from);
const positronEdges = ['positron-first', 'positron-arrow', 'positron-tail'].map(id => objectMap.get(id));
const positronDirection = positronEdges[0].from === 'A' && positronEdges.at(-1).to === 'B'
  && positronEdges.every((o, i) => i === 0 || positronEdges[i - 1].to === o.from)
  && point('positron-direction-tip')[0] < point('positron-bend')[0];
const png = readFileSync(context.preview.path);
const outputDimensions = [png.readUInt32BE(16), png.readUInt32BE(20)];
const geometryUnchanged = ['objects', 'assertions', 'canvas', 'display', 'layout'].every(key => isDeepStrictEqual(spec[key], oldSpec[key]))
  && isDeepStrictEqual(spec.source.inventory, oldSpec.source.inventory);
const observation = {
  schema: 'stemrobin181/figure-read-only-comparison@1',
  generatedAtUtc: new Date().toISOString(),
  method: 'Read-only hash, JSON equality, inventory/reference and arithmetic inspection. No native validator, renderer, browser, producer, test or build invoked.',
  bindings,
  allBindingsMatch: bindings.every(item => item.matches),
  currentBilingualTextExactlyMatchesAllNonemptyTemplateText: isDeepStrictEqual(authoritative, spec.source.authoritativeText),
  authoritativeTextEntries: authoritative.length,
  locales,
  geometryInventoryAndAssertionsUnchangedFromD344: geometryUnchanged,
  inventory,
  uniqueObjectIds: objectMap.size === spec.objects.length,
  uniqueAssertionIds: assertionMap.size === spec.assertions.length,
  objectCount: spec.objects.length,
  assertionCount: spec.assertions.length,
  missingRefs,
  semanticEdges: edgeObjects.length,
  unassertedEdges,
  unmappedVisibleObjects,
  assertionArithmetic: { total: residuals.length, failures: residuals.filter(a => !a.passes), nonConnects: residuals.filter(a => a.type !== 'connects') },
  directedPositronAToB: positronDirection,
  directedNeutronAToCRim: contiguousNeutronChain && neutronEdges.at(-1).to === 'C-neutron-join',
  neutronBends: spec.objects.filter(o => /^neutron-bend-\d+$/.test(o.id)).length,
  neutronArrowheads: neutronEdges.filter(o => o.type === 'arrow').length,
  gammaArrowheads: {
    B: edgeObjects.filter(o => o.type === 'arrow' && o.id.startsWith('B-gamma-')).length,
    C: edgeObjects.filter(o => o.type === 'arrow' && o.id.startsWith('C-gamma-')).length
  },
  labels,
  canvas: spec.canvas,
  display: spec.display,
  existingPNGDimensionsPx: outputDimensions,
  fullResolutionEqualsDeclaredWidth: outputDimensions[0] === 640 && spec.canvas.width === 640 && isDeepStrictEqual(spec.display.widths, [640]),
  nativeMechanicalEvidenceReused: { status: render.status, labels: render.labels, collisions: render.collisions, displayChecks: render.displayChecks },
  usage: { imageOpens: 2, browserCalls: 0, nativeValidatorCalls: 0, nativeRendererCalls: 0, tests: 0, builds: 0, paidCalls: 0 }
};
writeFileSync(resolve(out, 'comparison-observations.json'), `${JSON.stringify(observation, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ ...observation, bindings: undefined, labels: undefined, assertionArithmetic: { total: residuals.length, failures: residuals.filter(a => !a.passes) } }, null, 2));

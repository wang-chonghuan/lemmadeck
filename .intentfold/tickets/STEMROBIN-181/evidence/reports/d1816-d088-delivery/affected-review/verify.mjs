import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), root);
const owned = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d085-n126-affected-review');
const author = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d083-n126-affected-author');
const prior = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d078-n126-first-review');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return {path: path.resolve(file), sha256: sha(bytes), bytes: bytes.length};
};
const verified = new Map();
function checkBinding(row) {
  const current = bind(row.path);
  assert.equal(current.sha256, row.sha256, row.path);
  if (row.bytes !== undefined) assert.equal(current.bytes, row.bytes, row.path);
  verified.set(current.path, current);
}
function checkReferences(value) {
  if (!value || typeof value !== 'object') return;
  if (typeof value.path === 'string' && /^[a-f0-9]{64}$/.test(value.sha256 ?? '')) checkBinding(value);
  Object.values(value).forEach(checkReferences);
}
function diff(a, b, pointer = '') {
  if (JSON.stringify(a) === JSON.stringify(b)) return [];
  if (a && b && typeof a === 'object' && typeof b === 'object' &&
      Array.isArray(a) === Array.isArray(b)) {
    return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap(key =>
      diff(a[key], b[key], `${pointer}/${key.replaceAll('~', '~0').replaceAll('/', '~1')}`));
  }
  return [{pointer, before: a ?? null, after: b ?? null}];
}
const sorted = values => [...values].sort();
const wholeText = doc => `${doc.locale.toUpperCase()}: ${doc.title}\n` +
  doc.prose.filter(block => block.text).map(block => block.text).join('\n\n');
const math = doc => doc.prose.flatMap(block =>
  [...(block.text ?? '').matchAll(/\$\$[\s\S]*?\$\$|\$[^$]*?\$/g)].map(match => match[0]));
const close = (a, b) => assert.ok(Math.abs(a - b) < 0.00001, `${a} != ${b}`);

const input = bind(path.join(author, 'author-freeze.json'));
assert.equal(input.sha256, '8e1e31e8027c1f1e0392d655e08d0a0c7e574ea03be8cc3a39fd39b7fdfc1e5c');
checkBinding(input);
const freeze = load(input.path);
checkReferences(freeze);
const whitelist = load(freeze.exactDiffWhitelist.path);
checkReferences(whitelist);
checkReferences(load(freeze.beforeBindings.path));
assert.equal(bind(path.join(prior, 'report.json')).sha256,
  '145168200da4878a86d6ed681c494158b2c4136ad32d2d2afb3d909e22e04548');
assert.equal(bind(path.join(prior, 'review-freeze.json')).sha256,
  '9a374972875683330b27977278a22c56796422e84d6fb8869f0e06789975096a');
const previous = load(path.join(prior, 'report.json'));
assert.equal(previous.verdicts.SCI.proseAndMathVerdict, 'PASS');
assert.equal(previous.verdicts.ZH.verdict, 'PASS');
assert.ok(previous.verdicts.EN.otherwisePass);
const beforeEN = load(whitelist.lessonTemplate.before.path);
const afterEN = load(whitelist.lessonTemplate.after.path);
assert.deepEqual(diff(beforeEN, afterEN), whitelist.lessonTemplate.actualDifferences);
assert.deepEqual(diff(beforeEN, afterEN).map(row => row.pointer), ['/prose/11/text']);
assert.deepEqual(math(beforeEN), math(afterEN));
assert.equal(math(afterEN).length, 21);
const r3 = load(path.join(author, 'R3-exact-text-diff.json'));
assert.ok(afterEN.prose[11].text.includes(r3.exactSentence));
const flowBinding = load(freeze.affectedFlowBinding.path);
checkReferences(flowBinding);
assert.deepEqual(diff(load(flowBinding.before.path), load(flowBinding.after.path)),
  flowBinding.exactDifference);
assert.deepEqual(flowBinding.exactDifference.map(row => row.pointer), ['/paragraphs/12/text']);
assert.deepEqual(beforeEN.section_breaks, afterEN.section_breaks);

const localeResults = [];
const scopes = {
  objectIDs: sorted(whitelist.figureChangedObjectIDs),
  changedInventoryIDs: ['source-labels', 'source-left-circulation',
    'source-right-circulation', 'text-applied-field', 'text-induced-field'],
};
for (const figure of freeze.figures) {
  const scope = whitelist.specs.find(row => row.edition === figure.edition);
  const before = load(scope.before.path);
  const spec = load(figure.spec.path);
  const actual = diff(before, spec);
  assert.deepEqual(actual, scope.diff);
  assert.deepEqual(sorted(actual.map(row => row.pointer)), sorted(scope.exactPermittedPointers));
  assert.deepEqual(before.canvas, spec.canvas);
  assert.deepEqual(before.display, spec.display);
  assert.deepEqual(before.layout, spec.layout);
  assert.deepEqual(before.source.image, spec.source.image);
  const oldObjects = new Map(before.objects.map(object => [object.id, object]));
  const objects = new Map(spec.objects.map(object => [object.id, object]));
  assert.equal(objects.size, spec.objects.length);
  const changedIDs = [...new Set([...oldObjects.keys(), ...objects.keys()])]
    .filter(id => diff(oldObjects.get(id), objects.get(id)).length);
  assert.deepEqual(sorted(changedIDs), scopes.objectIDs);
  assert.ok([...oldObjects.keys()].every(id => objects.has(id)));
  const oldGroups = new Map(before.source.inventory.map(group => [group.id, group]));
  const groups = new Map(spec.source.inventory.map(group => [group.id, group]));
  assert.deepEqual(sorted([...oldGroups.keys()]), sorted([...groups.keys()]));
  const changedGroups = [...groups.keys()].filter(id => diff(oldGroups.get(id), groups.get(id)).length);
  assert.deepEqual(sorted(changedGroups), sorted(scopes.changedInventoryIDs));
  const assertions = new Map(spec.assertions.map(row => [row.id, row]));
  assert.equal(assertions.size, spec.assertions.length);
  const mapped = new Set();
  for (const group of groups.values()) {
    group.objects.forEach(id => { assert.ok(objects.has(id), id); mapped.add(id); });
    group.assertions.forEach(id => assert.ok(assertions.has(id), id));
  }
  assert.equal(mapped.size, objects.size);
  for (const row of assertions.values()) {
    if (row.type === 'connects') {
      assert.deepEqual(objects.get(row.arrow).from, row.from);
      assert.deepEqual(objects.get(row.arrow).to, row.to);
    } else if (row.type === 'displacement') {
      close(row.to[0] - row.from[0], row.dx);
      close(row.to[1] - row.from[1], row.dy);
    } else if (row.type === 'pointOnLine') {
      close((row.point[0] - row.a[0]) * (row.b[1] - row.a[1]) -
        (row.point[1] - row.a[1]) * (row.b[0] - row.a[0]), 0);
    } else if (row.type === 'parallel') {
      close((row.b[0] - row.a[0]) * (row.d[1] - row.c[1]) -
        (row.b[1] - row.a[1]) * (row.d[0] - row.c[0]), 0);
    } else assert.fail(`Unexpected affected assertion type: ${row.type}`);
  }
  const left = objects.get('source-left-circulation-upper-3');
  const right = objects.get('source-right-circulation-upper-9');
  const dx = left.to[0] - left.from[0], dy = left.to[1] - left.from[1];
  assert.ok(dx > 0 && dy > 0);
  assert.ok(right.to[0] > right.from[0] && right.to[1] < right.from[1]);
  const upper = [...objects.values()].filter(object => object.id.startsWith('source-left-circulation-upper-'));
  const chain = [];
  let segment = left;
  while (segment) {
    assert.ok(!chain.includes(segment.id));
    chain.push(segment.id);
    segment = upper.find(object => JSON.stringify(object.from) === JSON.stringify(segment.to));
  }
  assert.equal(chain.length, upper.length);
  for (const side of ['left', 'right']) {
    const group = groups.get(`source-${side}-circulation`);
    assert.ok(group.description.includes('UNLABELLED structural detail'));
    assert.ok(group.description.includes('no asserted current or local-field identity'));
    assert.ok(group.objects.every(id => !id.includes('label')));
    const lower = [...objects.values()].filter(object => object.id.startsWith(`source-${side}-circulation-lower-`));
    assert.ok(lower.length);
    lower.forEach(object => {
      assert.deepEqual(object, oldObjects.get(object.id));
      assert.equal(object.type, 'segment');
    });
    const label = objects.get(`source-${side}-B-prime-label`);
    const leader = objects.get(`modern-relocated-${side}-B-prime-leader`);
    const induced = objects.get('text-induced-field-direction');
    assert.equal(label.text, "B'");
    assert.equal(label.at[0], leader.from[0]);
    assert.ok(label.at[1] > leader.from[1] && leader.from[1] > leader.to[1]);
    assert.equal(leader.to[1], induced.from[1]);
    assert.ok(leader.to[0] > induced.from[0] && leader.to[0] < induced.to[0]);
  }
  assert.ok(groups.get('source-labels').description.includes('NOT source-pixel placement'));
  assert.deepEqual(objects.get('text-induced-field-direction'), oldObjects.get('text-induced-field-direction'));
  assert.deepEqual(objects.get('text-applied-field-direction'), oldObjects.get('text-applied-field-direction'));
  const binding = load(figure.textBinding.path);
  checkReferences(binding);
  const template = load(binding.template.path);
  const text = wholeText(template);
  assert.equal(template.locale, figure.locale);
  assert.equal(binding.edition, figure.edition);
  assert.equal(binding.locale, figure.locale);
  assert.equal(binding.authoritativeText.text, text);
  assert.equal(binding.authoritativeText.sha256, sha(text));
  assert.equal(binding.sourceContextSHA256, sha(JSON.stringify(spec.source)));
  assert.deepEqual(spec.source.authoritativeText, [{lesson: freeze.lesson, text}]);
  assert.equal(binding.currentSpec.sha256, figure.spec.sha256);
  const render = load(figure.nativeRenderReport.path);
  assert.equal(render.status, 'pass');
  assert.equal(render.spec.sha256, figure.spec.sha256);
  assert.equal(render.output.svg.sha256, figure.svg.sha256);
  assert.equal(path.resolve(root, render.spec.path), figure.spec.path);
  assert.equal(path.resolve(root, render.output.svg.path), figure.svg.path);
  assert.equal(render.collisions.length, 0);
  assert.equal(render.displayChecks[0].width, 640);
  assert.equal(render.displayChecks[0].status, 'pass');
  assert.equal(render.displayChecks[0].measuredMinPx, 22);
  localeResults.push({
    edition: figure.edition, locale: figure.locale,
    spec: figure.spec, textBinding: figure.textBinding, template: binding.template,
    svg: figure.svg, preview: figure.preview, nativeRenderReport: figure.nativeRenderReport,
    authoritativeTextSHA256: sha(text), sourceContextSHA256: sha(JSON.stringify(spec.source)),
    exactPointerDiffCount: actual.length, stableChangedObjectIDs: sorted(changedIDs),
    objects: objects.size, assertions: assertions.size, inventoryGroups: groups.size,
    leftRiseDegrees: Math.atan2(dy, dx) * 180 / Math.PI,
    leftArrowLengthPx: Math.hypot(dx, dy), restoredCurveSegments: chain.length,
    nativeEvidenceReusedNotApproval: true,
  });
}
assert.notEqual(localeResults[0].authoritativeTextSHA256, localeResults[1].authoritativeTextSHA256);
assert.notEqual(localeResults[0].sourceContextSHA256, localeResults[1].sourceContextSHA256);
assert.notEqual(localeResults[0].spec.sha256, localeResults[1].spec.sha256);
assert.equal(localeResults[0].svg.sha256, localeResults[1].svg.sha256);
assert.equal(localeResults[0].preview.sha256, localeResults[1].preview.sha256);
const result = {
  status: 'PASS', scope: 'n126 R1-R4 affected-only independent byte and relationship checks',
  input, verifiedUniqueFiles: verified.size, sourcePagesReviewed: 0,
  ENChangedPointer: '/prose/11/text', ENMathTokensUnchanged: 21,
  ENFlowChangedPointer: '/paragraphs/12/text', localeResults,
  nativeReruns: 0, candidateWrites: 0,
};
if (process.argv.includes('--seal')) {
  const reportPath = path.join(owned, 'report.json');
  const ledgerPath = path.join(owned, 'image-ledger.json');
  const report = load(reportPath), ledger = load(ledgerPath);
  assert.equal(report.status, 'PASS');
  assert.equal(ledger.n126.imageOpens, 3);
  assert.ok(ledger.totalImageOpens <= 8 && ledger.totalImageOpens <= 24);
  const output = {
    schema: 'STEMROBIN-181/independent-affected-review-freeze@1',
    ticket: 'STEMROBIN-181', batch: 'D085',
    role: 'SOLE_INDEPENDENT_AFFECTED_ONLY_REVIEWER',
    lesson: freeze.lesson, figure: 'fig-286', workdir: root,
    frozenAt: new Date().toISOString(), status: 'PASS',
    authorFreeze: input, originalD078Report: freeze.base.D078Report,
    originalD078ReviewFreeze: freeze.base.originalD078ReviewFreeze,
    verdicts: report.verdicts, findings: report.findings,
    unresolvedHold: null, wholeSCIReReview: false, whole126Approval: false,
    offlineLessonDisplayReviewed: false, parentConsumptionPending: true,
    nativeRecordReviewAndPromotionOwner: 'parent',
    independentChecks: result,
    currentHashVerifiedInputs: [...verified.values()],
    ownedEvidence: ['report.json', 'image-ledger.json', 'grill.md', 'verify.mjs']
      .map(name => bind(path.join(owned, name))),
    imageOpens: 3, imageReopens: 0, imageCrops: 0,
    combinedContextImageOpensAtSeal: ledger.totalImageOpens,
    sourcePagesAdded: 0, coursesAdded: 0, productFilesWritten: 0,
    nativeProducersFinalizersRenderersOrReviewRecordsInvoked: 0,
    backendOrFreshnessCalls: 0, paidCalls: 0, commits: 0, promotions: 0,
    boundary: 'Only D085 evidence was written. Original failures are immutable; current affected PASS does not approve their historical bytes or constitute promotion.',
  };
  const file = path.join(owned, 'review-freeze.json');
  fs.writeFileSync(file, JSON.stringify(output, null, 2) + '\n', {flag: 'wx'});
  console.log(JSON.stringify({status: 'PASS', output: bind(file), verifiedUniqueFiles: verified.size}, null, 2));
} else console.log(JSON.stringify(result, null, 2));

import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const out = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
assert.equal(process.cwd(), root);
assert.equal(out, `${root}/.tmp/STEMROBIN-181/9p-d021-n84-fig160`);
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const bind = p => ({ path: p, sha256: sha(p), bytes: fs.statSync(p).size });
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const write = (p, data) => {
  assert(p.startsWith(`${out}/`));
  fs.writeFileSync(p, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' });
};
const construction = read(`${out}/native/construction-bindings.json`);
const spec = read(`${out}/spec/fig-160.spec.json`);
const render = read(`${out}/native/fig-160.render.json`);
const previews = read(`${out}/native/preview-evidence.json`);
const repair = read(`${out}/native/repair-history.json`);
assert.equal(render.status, 'pass');
assert.equal(render.spec.sha256, sha(`${out}/spec/fig-160.spec.json`));
assert.equal(render.output.svg.sha256, sha(`${out}/native/fig-160.svg`));
assert.equal(repair.repairCount, 0);
assert.equal(repair.nativeRenderInvocations, 1);
assert.equal(repair.nativeValidationInvocations, 1);
for (const pair of [...construction.inputs, ...construction.tools]) {
  assert.equal(sha(pair.active.path), pair.active.sha256, `Drift: ${pair.active.path}`);
  assert.equal(sha(pair.snapshot.path), pair.active.sha256);
}
const context = read(`${out}/spec/context.json`);
assert.equal(context.contextKind, 'exercises');
assert.deepEqual(context.lessons[0].authoritativeText, spec.source.authoritativeText);
assert.equal(spec.display.maxWidthPx, 640);
assert.deepEqual(spec.display.widths, [640, 331, 342]);
assert.equal(spec.display.minTextPx, 16);
assert.equal(spec.display.purpose, 'instructional');
const viewed = [
  { open: 1, role: 'original', file: bind(spec.source.image.path),
    observation: 'Three vertical conductors: two thin outer plates with outward mid-height leads and one full-height hatched finite-thickness slab. Printed dimensions d at top, x above l at bottom. Both gaps are open. d/x outside arrows point inward to their boundary extensions; l inside arrows point outward to the two outer-plate extensions. No numeric values, formulas, electric field arrows, or charge symbols. Accepted speck at (205,9) is scan noise only.' },
  ...[640, 331, 342].map((width, index) => ({
    open: index + 2, role: 'product-width-preview', width,
    file: bind(`${out}/previews/width-${width}.png`),
    observation: 'Actually inspected: white nonblank raster, both complete outer plates, two outward terminal leads, closed full-height inserted slab and rising diagonal hatching. Two positive vacuum gaps, no contacts to the slab. All six arrowheads and d/x/l endpoint relationships visible. All three labels distinct, unobscured and inside canvas. No formula, derived right-gap label, supply, ground, or induced-charge marking.',
  })),
];
write(`${out}/native/author-observations.json`, {
  schema: 'ld-s10y-image/author-observations@1',
  ticket: 'STEMROBIN-181', batch: 'D021', figure: 'fig-160',
  status: 'author-inspected-native-pass-not-independent-approval',
  observerRole: 'author', contextKind: 'exercises',
  source: bind(spec.source.image.path), context: bind(`${out}/spec/context.json`),
  spec: bind(`${out}/spec/fig-160.spec.json`), svg: bind(`${out}/native/fig-160.svg`),
  render: bind(`${out}/native/fig-160.render.json`),
  imageBudget: { batchMax: 8, lifetimeMax: 24, batchOpens: 4, lifetimeOpens: 4,
    originalOpens: 1, previewOpens: 3, reopens: 0, crops: 0, noMainImagePayload: true },
  images: viewed,
  minTextPx: previews.widths.map(item => ({ width: item.width, px: item.minTextPx })),
  sourceRegularization: 'Same topology, vertical orientation, relative thickness/gaps and hatch direction; straightening and hatch spacing are modern regularizations, not new source facts.',
  workedSolution: 'Complete solution is retained only in bound authoritative exercise 1. The single registered source207 C-to-C1 subscript erratum stays in text; no formula enters the diagram.',
  independentReview: 'pending; author has not granted independent PASS',
  scientificReview: 'in flight elsewhere; no SCI performed or claimed',
  browser: { explicitHeadlessOnly: true, PWDEBUG: 'unset', HTMLAutoOpen: 'never',
    freshEphemeralContext: true, userWindowOrProfile: false, CDP: false,
    systemInput: false, allOwnedBrowserInstancesClosed: true },
  repairCount: 0,
});
write(`${out}/spec/review-requirements.json`, {
  schema: 'ld-s10y-image/review-requirements@1',
  figure: 'fig-160', contextKind: 'exercises',
  status: 'independent-review-required-before-promotion',
  standardReviewSchema: 'ld-s10y-image/review@1',
  standardReviewContextKind: 'exercises',
  reviewerMustBind: ['original source PNG', 'complete exercise 1 with embedded worked solution',
    'complete modern lesson prose', 'registered source207 erratum', 'FigureSpec',
    'native validation/render evidence', 'SVG', 'all three width previews',
    'author observations', 'repair history', 'exact tool bindings'],
  constraints: ['Check all three conductors, hatching, plate orientation and six real dimension arrows.',
    'The accepted (205,9) speck is harmless scan noise, not missing-content permission.',
    'No added solution formula, derived right-gap label, or charge annotations.',
    'Author evidence is not an independent review PASS.',
    'Promoter must retain contextKind exercises in its final standard figure review and bind durable outputs.'],
});
const files = directory => fs.readdirSync(directory, { withFileTypes: true })
  .flatMap(item => item.isDirectory()
    ? files(path.join(directory, item.name))
    : [path.join(directory, item.name)])
  .sort();
const frozenFiles = files(out).map(bind);
const freezePath = `${out}/author-freeze.json`;
write(freezePath, {
  schema: 'ld-s10y-image/author-freeze@1',
  ticket: 'STEMROBIN-181', batch: 'D021', book: '9p',
  lesson: 'phy9-c2-s2-n84', figure: 'fig-160', contextKind: 'exercises',
  status: 'author-frozen-native-pass-independent-review-pending',
  ownership: out,
  source: bind(spec.source.image.path),
  context: bind(`${out}/spec/context.json`),
  sourceInventory: bind(`${out}/spec/source-inventory.json`),
  spec: bind(`${out}/spec/fig-160.spec.json`),
  svg: bind(`${out}/native/fig-160.svg`),
  render: bind(`${out}/native/fig-160.render.json`),
  nativeValidation: bind(`${out}/native/validation.json`),
  nativeInvocations: ['validation', 'render'].map(name => bind(`${out}/native/${name}-invocation.json`)),
  previews: previews.widths.map(item => item.preview),
  previewEvidence: bind(`${out}/native/preview-evidence.json`),
  constructionBindings: bind(`${out}/native/construction-bindings.json`),
  observations: bind(`${out}/native/author-observations.json`),
  repairHistory: bind(`${out}/native/repair-history.json`),
  reviewRequirements: bind(`${out}/spec/review-requirements.json`),
  textFreeze: context.bindings.textFreeze,
  completionBindings: context.bindings.completion,
  inputs: construction.inputs, tools: construction.tools,
  scriptBindings: ['author.mjs', 'freeze.mjs'].map(name => bind(`${out}/scripts/${name}`)),
  executable: construction.executable,
  nativeStatus: 'pass',
  independentReviewStatus: 'pending-not-authorized-to-self-approve',
  scientificReviewStatus: 'in-flight-elsewhere',
  finalReviewContract: { schema: 'ld-s10y-image/review@1', contextKind: 'exercises',
    reviewer: 'independent', status: 'not-issued-by-author' },
  counts: { sourceConductors: 3, printedLabels: 3, realDimensionArrows: 6,
    sourceOpens: 1, allWidthPreviewOpens: 3, imageOpens: 4,
    reopens: 0, crops: 0, repairCount: 0, explicitNativeValidations: 1,
    nativeRenderInvocations: 1, objects: spec.objects.length, assertions: spec.assertions.length },
  display: spec.display,
  environment: { ...construction.environment, allOwnedBrowserInstancesClosed: true },
  observationsScope: 'Author inspected original and all width previews once each. No separate independent figure PASS and no SCI.',
  boundFullTextsUnchanged: true,
  sourceNoiseException: { pixel: [205, 9], status: 'accepted-harmless-scan-noise-only' },
  writes: { ownedScratchOnly: true, templateOrSourceWrites: 0, durableWrites: 0,
    promotion: 0, adaptFinalize: 0, SCI: 0, DBOrGitWrites: 0, sharedFixes: 0, fullChecks: 0 },
  frozenFiles,
});
console.log(JSON.stringify({ freeze: bind(freezePath),
  status: 'author-frozen-native-pass-independent-review-pending',
  openCount: 4, repairCount: 0 }));

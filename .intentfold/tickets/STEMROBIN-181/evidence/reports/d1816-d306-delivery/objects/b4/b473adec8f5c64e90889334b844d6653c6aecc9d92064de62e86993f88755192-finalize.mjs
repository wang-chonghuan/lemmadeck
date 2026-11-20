import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), root);
const own = path.dirname(fileURLToPath(import.meta.url));
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: path.resolve(file), sha256: sha(file), bytes: fs.statSync(file).size });
const write = (file, payload) => fs.writeFileSync(file, `${JSON.stringify(payload, null, 2)}\n`, { flag: 'wx' });
const inputs = read(path.join(own, 'input-freeze.json'));
const currentBindings = inputs.inputs.map(row => ({
  ...row, currentSha256: sha(row.path), unchanged: sha(row.path) === row.sha256,
}));
assert(currentBindings.every(row => row.unchanged), 'A bound source/text/tool changed during the author run');
const loads = [
  {
    index: 1, kind: 'original-source', figure: 'fig-28',
    path: '.tmp/STEMROBIN-181/d1816-d276/root/10p/figures/fig-28.png',
    purpose: 'Original reopened before independent inventory and drawing/spec.',
  },
  {
    index: 2, kind: 'original-source', figure: 'fig-29',
    path: '.tmp/STEMROBIN-181/d1816-d276/root/10p/figures/fig-29.png',
    purpose: 'Original reopened before independent inventory and drawing/spec.',
  },
  {
    index: 3, kind: 'source-detail-crop', figure: 'fig-29',
    path: path.join(own, 'fig-29.spring-top.crop.png'),
    purpose: 'Disambiguate source maximum-velocity v_m and unarrowed horizontal position extension.',
    crop: { sourceRow: 20, sourceColumn: 690, height: 215, width: 340 },
  },
  {
    index: 4, kind: 'source-detail-crop', figure: 'fig-29',
    path: path.join(own, 'fig-29.spring-bottom.crop.png'),
    purpose: 'Confirm mass ABOVE equilibrium reference and source x_m vertical marker.',
    crop: { sourceRow: 315, sourceColumn: 685, height: 235, width: 345 },
  },
  {
    index: 5, kind: 'author-preview', figure: 'fig-28',
    path: path.join(own, 'first', 'fig-28', 'fig-28.w640.png'),
    purpose: 'Opened unchanged SVG Playwright white-background screenshot at actual 640px media width.',
  },
  {
    index: 6, kind: 'author-preview', figure: 'fig-29',
    path: path.join(own, 'first', 'fig-29', 'fig-29.w640.png'),
    purpose: 'Opened unchanged SVG Playwright white-background screenshot; inspect all six LC states and both springs.',
  },
].map(row => ({ ...row, tool: 'functions.view_image', ...bind(row.path) }));
const ledger = {
  schema: 'd281/actual-image-load-ledger@1',
  totalLoadedIntoAgentContext: loads.length,
  batchLimit: 8,
  cumulativeLimit: 24,
  originalLoads: 2, detailCropLoads: 2, previewLoads: 2,
  loads,
  generatedButNotLoaded: ['fig-28', 'fig-29'].map(id => ({
    ...bind(path.join(own, 'first', id, `${id}.w331.png`)),
    purpose: 'Isolated mobile 331px viewport with unchanged 640px SVG at horizontal scroll end.',
  })),
  accounting: 'Count every original open, crop open and preview open in this author context. Screenshot creation/DOM inspection is not an image payload loaded into this context. No other image loads occurred.',
  paidCalls: 0, delegatedImageLoads: 0, contentRepairs: { 'fig-28': 0, 'fig-29': 0 },
};
assert(ledger.totalLoadedIntoAgentContext <= 8);
write(path.join(own, 'image-ledger.json'), ledger);

const figures = ['fig-28', 'fig-29'].map(id => {
  const folder = path.join(own, 'first', id);
  const specFile = path.join(folder, 'spec.json');
  const spec = read(specFile);
  const render = read(path.join(folder, `${id}.render.json`));
  const semantic = read(path.join(folder, 'semantic-assertions.json'));
  const preview = read(path.join(folder, 'preview-receipt.json'));
  assert.equal(render.status, 'pass');
  assert.equal(semantic.status, 'pass');
  assert.equal(preview.status, 'pass');
  assert.equal(render.spec.sha256, sha(specFile));
  assert.equal(render.output.svg.sha256, sha(path.join(folder, `${id}.svg`)));
  const draftName = id === 'fig-28' ? 'd281-002-fig28-draft' : 'd281-003-fig29-draft';
  const draft = read(path.join(own, 'native', draftName, 'stdout.txt'));
  assert.equal(draft.status, 'pass');
  return {
    id, stage: 'first', mode: spec.mode, canonicalPromotion: false,
    independentInventory: bind(path.join(own, `${id}.inventory.json`)),
    inventoryBindings: bind(path.join(folder, 'inventory-bindings.json')),
    spec: bind(specFile),
    svg: bind(path.join(folder, `${id}.svg`)),
    draftValidation: { status: draft.status, errors: draft.errors,
      receipt: bind(path.join(own, 'native', draftName, 'receipt.json')) },
    nativeAssertions: { status: 'pass', count: spec.assertions.length,
      scope: 'Executable geometry, connects/topology, polarity-associated object mapping, coil diameters, mass/reference displacement.' },
    semanticAssertions: { ...bind(path.join(folder, 'semantic-assertions.json')),
      status: semantic.status, groups: semantic.tests.length, tests: semantic.tests },
    render: { ...bind(path.join(folder, `${id}.render.json`)), status: render.status,
      objects: render.objects, labels: render.labels, collisions: render.collisions,
      displayChecks: render.displayChecks, renderer: render.renderer },
    preview: bind(path.join(folder, 'preview-receipt.json')),
    previews: preview.previews,
    authorVisualObservation: id === 'fig-28'
      ? 'Opened full 640px preview. Nonblank. One a label covers the two circuit drawings; contact 1 charging and contact 2 LC blade endpoints, two cells each, four lobes each, q_m/-q_m and sign marks preserved. Mechanical b has fixed support, vertical spring, solid mass below dashed equilibrium reference and x_m marker. No visible collisions/clipping in author inspection.'
      : 'Opened full 640px preview. Nonblank. Two rows of three circuits retained with first/second quarter-period headings, initial and reversed maximum-charge signs, two intermediate charged states, both blank-plate maximum-current states and four downward current arrows. Both spring pictures retained below with corresponding headings: v_m mass on reference and x_m mass above reference. Horizontal position extensions are plain segments. No visible collisions/clipping in author inspection.',
    contentRepairsUsed: 0, geometryRenderCalls: 1,
    independentReview: { status: 'pending', reviewAt1FileCreated: false },
  };
});
const text = read(path.join(own, 'text-freeze.json'));
assert.deepEqual(read(figures[0].spec.path).source.authoritativeText, text.authoritativeText);
assert.deepEqual(read(figures[1].spec.path).source.authoritativeText, text.authoritativeText);
const report = {
  schema: 'd281/first-modern-deterministic-author-report@1',
  ticket: 'STEMROBIN-181', book: '10p', scope: ['fig-28', 'fig-29'],
  status: 'first-author-candidates-ready-for-parent-final-text-binding-and-independent-review',
  ownDirectory: own, checkout: root,
  textFreeze: bind(path.join(own, 'text-freeze.json')),
  inputFreeze: bind(path.join(own, 'input-freeze.json')),
  imageLedger: bind(path.join(own, 'image-ledger.json')),
  authoritativeContext: {
    n18: 'Complete nonfigure text and captions from both current ZH/EN N18 lesson.template.json drafts.',
    n19: 'All ten actual retained ZH N19 proseFlow paragraphs are embedded in both specs.',
    rawN19: 'Read as shared spring-comparison source context only; not modern authority.',
    englishN19: 'not-yet-bound',
    finalSharedBilingualText: 'pending-parent-binding',
  },
  raw28: 'Affected review was running at assignment. No approval inferred or recorded; parent must resolve it independently.',
  figures,
  totals: {
    draftValidationCalls: 2, geometryRenderCalls: 2,
    nativeEmbeddedDraftGuards: 2,
    semanticAssertionGroups: figures.reduce((sum, figure) => sum + figure.semanticAssertions.groups, 0),
    previewChromiumSessions: 2, screenshotFiles: 4, imageContextLoads: loads.length,
    previewGeometryRerenders: 0, resvgCalls: 0, svgEdits: 0,
    contentRepairs: 0, paidCalls: 0, reviewAt1PassWrites: 0, promotions: 0,
    sourceEdits: 0, manifestEdits: 0, meterEdits: 0, databaseCalls: 0,
    publications: 0, gitOperations: 0, projectTests: 0, agentMessages: 0,
  },
  preservation: {
    boundInputs: currentBindings, unchanged: true,
    blankPreviewProduced: false,
    failedFigureStages: [],
    attemptPolicy: 'First candidate only; no content repair used. Original inventories, first specs, native stdout/stderr/receipts and all previews retained.',
    access: 'No writes outside the newly owned directory; original source PNGs unchanged.',
  },
  pending: [
    'Parent binds shared full final bilingual N18/N19 text and creates new hash-current bindings as needed; English N19 is not yet bound here.',
    'Parent resolves the RAW28 affected review without inferring approval from these candidates.',
    'Separate independent source/mathematical/visual/cultural review; no ld-s10y-image/review@1 pass is supplied.',
    'Final headed lesson/product display and promotion/manifest checks belong to the later authorized parent phase.',
  ],
  authorFreezePath: path.join(own, 'author-freeze.json'),
};
write(path.join(own, 'report.json'), report);
const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(file) : [file];
});
const files = walk(own);
assert(!files.some(file => file.endsWith('.review.json')));
const freeze = {
  schema: 'd281/immutable-author-output-freeze@1',
  status: report.status,
  report: bind(path.join(own, 'report.json')),
  inputs: currentBindings,
  bindings: files.map(bind),
  finalizationReceipt: {
    path: path.join(own, 'native', 'd281-008-finalize-freeze', 'receipt.json'),
    note: 'Self-finalizing command receipt is written by run-native.mjs after this child exits, outside the payload freeze to avoid a cyclic binding.',
  },
  reviewStatus: 'independent-review-pending',
  promotionApproved: false,
};
write(path.join(own, 'author-freeze.json'), freeze);
fs.writeFileSync(path.join(own, 'author-freeze.sha256'),
  `${sha(path.join(own, 'author-freeze.json'))}  author-freeze.json\n`, { flag: 'wx' });
for (const file of walk(own)) fs.chmodSync(file, 0o444);
console.log(JSON.stringify({
  status: report.status,
  report: bind(path.join(own, 'report.json')),
  authorFreeze: bind(path.join(own, 'author-freeze.json')),
  textFreeze: bind(path.join(own, 'text-freeze.json')),
  imageLedger: bind(path.join(own, 'image-ledger.json')),
  figures: figures.map(figure => ({
    id: figure.id, draft: figure.draftValidation.status,
    semantic: figure.semanticAssertions.status, nativeAssertions: figure.nativeAssertions.count,
    render: figure.render.status, minTextPx: figure.render.displayChecks[0].measuredMinPx,
  })),
  imageLoads: loads.length, contentRepairs: 0, independentReview: 'pending',
}));

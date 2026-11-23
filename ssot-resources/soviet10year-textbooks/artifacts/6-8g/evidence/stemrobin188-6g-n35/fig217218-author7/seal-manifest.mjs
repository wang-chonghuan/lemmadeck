import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const cwd = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188';
const relativeOwn = '.intentfold/tickets/STEMROBIN-188/tmp/n35-fig217218-author7';
const own = path.join(cwd, relativeOwn);
if (process.cwd() !== cwd) throw new Error('Wrong cwd');
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const binding = p => ({ path: p, sha256: hash(p) });
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const files = folder => fs.readdirSync(folder, { withFileTypes: true }).flatMap(item =>
  item.isDirectory() ? files(path.join(folder, item.name)) : [path.join(folder, item.name)]);
const displayPath = path.join(own, 'display-check.json');
const display = read(displayPath);
if (display.status !== 'pass-author-offline-display-only' || !display.browserClosed) {
  throw new Error('Display or browser closure incomplete');
}
const E = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/editions/modern-us-neutral';
const figures = ['fig-217', 'fig-218'].map(id => {
  const spec = read(path.join(own, `${id}.spec.json`));
  const render = read(path.join(own, `${id}.render.json`));
  const semantic = read(path.join(own, `${id}.semantic-check.json`));
  const execution = read(path.join(own, `${id}.execution.json`));
  if (render.status !== 'pass' || semantic.status !== 'pass') throw new Error('Unresolved candidate');
  return {
    id, mode: 'deterministic', status: 'candidate-ready-for-independent-review',
    independentReview: 'not performed', approvedForPromotion: false,
    finalRoot: E,
    finalContract: { spec: `figures/${id}.spec.json`, svg: `figures/${id}.svg`,
      render: `figures/${id}.render.json`, review: `figures/${id}.review.json` },
    source: binding(path.join(cwd, spec.source.image.path)),
    current: Object.fromEntries(['spec.json', 'svg', 'render.json', 'semantic-check.json', 'execution.json']
      .map(suffix => [suffix, binding(path.join(own, `${id}.${suffix}`))])),
    authoritativeTemplates: spec.source.authoritativeText.map(entry => {
      const envelope = JSON.parse(entry.text);
      return { path: path.join(cwd, envelope.path), sha256: envelope.sha256,
        exactCompleteJsonTextBound: true };
    }),
    sourceOpenCount: 1, nativeRendererInvocations: execution.rendererInvocation,
    authorObserved: {
      sourceInventoryBeforeSpecs: true, noReviewerInventoriesRead: true,
      noAnswerKeysOrSolutionsRead: true,
      geometryAndLabelsVisibleOnDesktop: true,
      normalWidthAndMobileScrollInspected: true,
      noAnswerAnnotations: true, noCulturalGlyphLeakage: true,
      originalGlyphScriptPrintingDash: 'UNKNOWN',
      originalSourceFidelity: 'author candidate observations, not independent PASS',
    },
    failures: files(path.join(own, 'first-failure', id)).map(binding),
    revisions: id === 'fig-217' ? files(path.join(own, 'revision-1', id)).map(binding) : [],
  };
});
const loads = [
  { sequence: 1, kind: 'source', figure: 'fig-217',
    ...figures[0].source, method: 'view_image', crop: false, reopen: false },
  { sequence: 2, kind: 'source', figure: 'fig-218',
    ...figures[1].source, method: 'view_image', crop: false, reopen: false },
  { sequence: 3, kind: 'desktop-both-figures', ...binding(path.join(own, 'desktop.png')),
    method: 'view_image', crop: false, reopen: false },
  { sequence: 4, kind: 'mobile-both-figures', ...binding(path.join(own, 'mobile.png')),
    method: 'view_image', crop: false, reopen: false },
];
const manifest = {
  schema: 'n35-modern-figure-author-candidate@1', ticket: 'STEMROBIN-188',
  date: '2026-11-23', lesson: 'geo68-c3-s2-n35', batch: ['fig-217', 'fig-218'],
  cwd, ownedDirectory: own, mode: 'deterministic-JSXGraph',
  status: 'candidate-ready-for-independent-review', independentPASSClaim: false,
  canonicalEdits: 0, finalizeCalls: 0, databaseCalls: 0, environmentChanges: 0,
  networkCalls: 0, dependencyChanges: 0, gitWorktreeChatPeerSupervisorActions: 0,
  figures, sourceInventory: binding(path.join(own, 'source-inventory.md')),
  display: binding(displayPath),
  screenshots: ['desktop.png', 'mobile.png'].map(name => binding(path.join(own, name))),
  preservedFirstDisplayFailure: binding(path.join(own, 'first-failure/display-check.json')),
  sourceImageInventoriesOrPixelsFromOtherBatches: 0,
  counters: {
    sourceImageOpens: 2, sourceImageOpensByFigure: { 'fig-217': 1, 'fig-218': 1 },
    renderedScreenshotFiles: 2, renderedScreenshotContextLoads: 2,
    totalImageContextLoads: 4, batchImageLimit: 8, contextImageLimit: 24,
    crops: 0, reopens: 0, nativePreviewPngs: 0,
    nativeRendererInvocations: 5, nativeRendererInvocationsByFigure: { 'fig-217': 3, 'fig-218': 2 },
    failedNativeRenders: 3, passedNativeRenders: 2, passedNativeRendersRepeated: 0,
    offlineDesktopAttempts: 1, offlineMobileAttempts: 2,
    firstFailedMobileScreenshotProduced: false,
    finalScreenshotLoads: 2, paidImageCalls: 0,
  },
  imageLoadLog: loads,
  displayContract: { purpose: 'instructional', layout: 'scroll',
    desktopUsablePx: 640, mobileUsablePx: 358, fixedMediaPx: 640,
    declaredMinTextPx: 16, observedMinTextPx: 22, mobileScrollEndPx: 282,
    browserMode: 'headed offline', ownedBrowsersClosed: true,
    scope: 'Only newly authored media; prior stable container contract reused, no whole-lesson acceptance claim.' },
  failureSummary: [
    { figure: 'fig-217', attempt: 1, status: 'fail-label-clearance',
      labels: ['A', 'A1', 'O'], retained: 'first-failure/fig-217' },
    { figure: 'fig-218', attempt: 1, status: 'fail-label-clearance',
      labels: ['A', 'B', 'C', 'D', 'P', 'Q', 'E'], retained: 'first-failure/fig-218' },
    { figure: 'fig-217', attempt: 2, status: 'fail-A1-ray-clearance',
      retained: 'revision-1/fig-217', repair: 'Only A1 label moved N to NE, gap 28 retained.' },
    { stage: 'offline-mobile', attempt: 1, status: 'fail-usable-width',
      retained: 'first-failure/display-check.json',
      repair: 'Only mobile viewport height changed; desktop and native geometry reused.' },
  ],
  requiredRemaining: ['Independent source/math/visual figure review and authorized durable retention/promotion by owner.'],
  tooling: files(own).filter(p => p.endsWith('.mjs')).map(binding),
};
fs.writeFileSync(path.join(own, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ manifest: binding(path.join(own, 'manifest.json')),
  status: manifest.status, counters: manifest.counters,
  current: figures.map(f => ({ id: f.id, current: f.current })) }, null, 2));

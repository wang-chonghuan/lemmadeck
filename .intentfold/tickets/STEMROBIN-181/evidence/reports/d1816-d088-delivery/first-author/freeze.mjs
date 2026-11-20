import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const W = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), W);
const E = path.join(W, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d073-n126-author');
const O = path.join(W, '.tmp/STEMROBIN-181/d1816-d073');
const ID = 'phy9-c2-s6-n126';
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({path: file, sha256: hash(file), bytes: fs.statSync(file).size});
const load = file => JSON.parse(fs.readFileSync(file));
const save = (file, data) => {
  assert.ok(file.startsWith(E + '/') || file.startsWith(O + '/'));
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', {flag: 'wx'});
};
const carrier = load(path.join(E, 'carrier.json'));
for (const row of carrier.completePageCopies) {
  assert.equal(hash(row.source.path), row.source.sha256);
  assert.equal(hash(row.copy.path), row.source.sha256);
}
const sourceConsumed = path.join(W, '.intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-d069-source310313/consumed.json');
const consumed = load(sourceConsumed);
assert.equal(consumed.sourcePagesAfter, 553);
for (const row of carrier.completePageCopies) {
  const approved = consumed.products.find(x => path.join(W, x.path) === row.source.path);
  assert.equal(approved.sha256, row.source.sha256);
}
const raw = path.join(O, 'root/9p/lessons', ID);
const doc = load(path.join(raw, 'lesson.json'));
assert.equal(doc.prose.length, 15);
assert.equal(doc.prose.filter(b => b.kind === 'p').length, 13);
assert.equal(doc.exercise_count, 0);
assert.deepEqual(doc.prose[11].source_refs, ['p0311#5', 'p0311#8', 'p0312#1']);
assert.equal(doc.prose[8].label, 'footnote');
assert.ok(doc.prose[8].text.includes('$\\mathcal{E}_i$'));
assert.deepEqual(fs.readdirSync(path.join(O, 'root/9p/lessons')), [ID]);
assert.deepEqual(fs.readdirSync(path.join(O, 'root/9p/figures')).sort(),
  ['fig-286.png', 'fig-286.svg']);
const textValidation = load(path.join(E, 'native-text-validation.json'));
const figureValidation = load(path.join(E, 'native-figure-author-validation.json'));
const display = load(path.join(E, 'author-figure-display-proof.json'));
assert.equal(textValidation.status, 'pass');
assert.equal(figureValidation.status, 'pass');
assert.equal(display.status, 'pass');
const figures = [];
const editions = [];
for (const [locale, name] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  const folder = path.join(O, 'work/adapt/9p', name, 'lessons', ID);
  const figureFolder = path.join(O, 'figures', name);
  const spec = load(path.join(figureFolder, 'fig-286.spec.json'));
  const candidate = load(path.join(folder, 'lesson.template.json'));
  assert.equal(candidate.source.sha256, hash(path.join(raw, 'lesson.json')));
  assert.deepEqual(candidate.source.data, doc);
  assert.equal(candidate.locale, locale);
  assert.equal(candidate.status, 'draft');
  const whole = `${locale.toUpperCase()}: ${candidate.title}\n` +
    candidate.prose.filter(b => b.text).map(b => b.text).join('\n\n');
  assert.equal(spec.source.authoritativeText.find(x => x.text.startsWith(locale.toUpperCase() + ':')).text, whole);
  assert.ok(spec.source.authoritativeText.length === 2);
  assert.ok(!fs.existsSync(path.join(figureFolder, 'fig-286.review.json')));
  editions.push({locale, edition: name,
    templates: ['lesson.template.json', 'exercises.template.json', 'figures.template.json'].map(file => bind(path.join(folder, file))),
    sourceSnapshot: bind(path.join(raw, 'lesson.json')),
    rawEntries: candidate.prose.length,
    proseEntries: candidate.prose.filter(b => b.kind === 'p').length,
    finalProseParagraphs: textValidation.reports.find(x => x.locale === locale).paragraphs,
    mathTokens: textValidation.reports.find(x => x.locale === locale).mathTokens,
    derivedSourceRefs: candidate.prose.map(b => b.source_refs),
    sectionBreaks: candidate.section_breaks});
  figures.push({edition: name, figure: 'fig-286',
    spec: bind(path.join(figureFolder, 'fig-286.spec.json')),
    svg: bind(path.join(figureFolder, 'fig-286.svg')),
    nativeRenderReport: bind(path.join(figureFolder, 'fig-286.render.json')),
    preview: bind(path.join(figureFolder, 'fig-286.preview.png')),
    objects: spec.objects.length, assertions: spec.assertions.length,
    inventoryGroups: spec.source.inventory.length, visibleLabels: 7,
    nativeReviewRecord: null, independentApproval: false});
}
assert.equal(figures[0].spec.sha256, figures[1].spec.sha256);
assert.equal(figures[0].svg.sha256, figures[1].svg.sha256);
const oldZh = path.join(E, 'rim-visual-before/modern-us-neutral/fig-286.preview.png');
const oldEn = path.join(E, 'rim-visual-before/modern-us-neutral-en/fig-286.preview.png');
const ledger = [
  {order: 1, openedPath: path.join(W, '.tmp/ld-s10y-lesson/9p/pages/0311/figures/fig-286.png'),
    currentBytes: bind(path.join(W, '.tmp/ld-s10y-lesson/9p/pages/0311/figures/fig-286.png')), kind: 'original-source'},
  ...['left-circulation', 'right-circulation'].map((name, i) => ({
    order: i + 2, openedPath: path.join(O, 'source-details', name + '.png'),
    currentBytes: bind(path.join(O, 'source-details', name + '.png')),
    kind: 'source-derived-nearest-neighbor-crop', scale: 4})),
  {order: 4, openedPath: figures[0].preview.path, readTimeBytesPreserved: bind(oldZh),
    kind: 'zh-native-render-before-left-rim-repair'},
  {order: 5, openedPath: figures[1].preview.path, readTimeBytesPreserved: bind(oldEn),
    kind: 'en-native-render-before-left-rim-repair'},
  {order: 6, openedPath: figures[0].preview.path, currentBytes: figures[0].preview,
    kind: 'zh-final-native-render', countsAsReopen: true},
  {order: 7, openedPath: figures[1].preview.path, currentBytes: figures[1].preview,
    kind: 'en-final-native-render', countsAsReopen: true},
  {order: 8, openedPath: path.join(O, 'previews/modern-us-neutral-390-end.png'),
    currentBytes: bind(path.join(O, 'previews/modern-us-neutral-390-end.png')),
    kind: 'mobile640px-scroll-end-author-projection'},
];
save(path.join(E, 'image-ledger.json'), {role: 'FIRST_AUTHOR',
  actualImageOpens: ledger.length, batches: 1, batchLimit: 8, contextLimit: 24,
  previousImagesInThisAuthorContext: 0, actualContextImageOpens: 8,
  reopens: 2, ledger, noFurtherImageOpens: true, otherAgentImagesIncluded: false});
const receipts = fs.readdirSync(path.join(E, 'native'), {withFileTypes: true})
  .filter(x => x.isDirectory())
  .map(x => path.join(E, 'native', x.name, 'receipt.json'))
  .filter(file => fs.existsSync(file))
  .map(file => ({...bind(file), data: load(file)}));
const failures = receipts.filter(x => x.data.exitCode !== 0);
const ownedFiles = [];
function inventory(root) {
  for (const row of fs.readdirSync(root, {withFileTypes: true})) {
    const file = path.join(root, row.name);
    if (row.isDirectory()) inventory(file);
    else if (row.isFile() && !file.endsWith('/author-freeze.json')) ownedFiles.push(bind(file));
  }
}
inventory(E);
inventory(O);
const freeze = {
  schema: 'STEMROBIN-181/bilingual-lesson-first-author-freeze@1',
  ticket: 'STEMROBIN-181', batch: 'D073', role: 'FIRST_AUTHOR', lesson: ID,
  frozenAt: new Date().toISOString(), workdir: W,
  status: 'first-author-frozen-mechanical-pass-modern-figure-semantic-HOLD-independent-review-pending',
  sourceApprovalPending: false, sourceApprovalAuthority: bind(sourceConsumed),
  sourceApprovalUpdate: 'D069 closed, parent consumed source-only PASS once; current310/311/312 hashes match consumed products. No new source review.',
  globalSourceCountFromParentReceipt: 553,
  newGlobalSourcePagesInThisAuthorRun: 0, deliveredOrPushedCoursesInThisAuthorRun: 0,
  independentSCIApproval: false, independentZHENApproval: false,
  independentFigureApproval: false, whole126Approval: false,
  reviewPending: true,
  hold: {
    phase: 'modern-figure-semantic-review', affects: ['fig-286'],
    reason: 'Source small circulation traces have clear upper arrow direction and dashed lower geometry, but their detailed physical identity is unresolved. They are retained as visual structure, not relabelled as a local field/current. No source or raw-trace proof is used to waive this semantic uncertainty.',
    sourceProofIsNotModernFigureApproval: true,
  },
  counts: {completeIsolatedRawLessons: 1, rawEntries: 15, proseEntries: 13,
    captionEntries: 1, footnotes: 1, figures: 1, writtenTasks: 0,
    locales: 2, finalProseParagraphsEach: 15, mathTokensEach: 21,
    figureObjectsEach: 219, figureAssertionsEach: 10, inventoryGroupsEach: 12,
    visibleFigureLabelsEach: 7, actualImageOpens: 8, paidCalls: 0},
  sourceFiles: carrier.completePageCopies.map(x => bind(x.source.path)),
  isolatedSourceCopies: carrier.completePageCopies.map(x => bind(x.copy.path)),
  authoritativeRawLesson: ['lesson.json', 'lesson.md', 'exercises.json'].map(file => bind(path.join(raw, file))),
  sourceFigure: {
    originalPNG: bind(path.join(W, '.tmp/ld-s10y-lesson/9p/pages/0311/figures/fig-286.png')),
    approvedRawSVG: bind(path.join(W, '.tmp/ld-s10y-lesson/9p/pages/0311/figures/fig-286.svg')),
    isolatedLibrary: ['fig-286.png', 'fig-286.svg'].map(file => bind(path.join(O, 'root/9p/figures', file))),
  },
  fullTOC: bind(path.join(W, 'ssot-resources/soviet10year-textbooks/toc/9p/zh.json')),
  nativeAssemblyIndex: bind(path.join(O, 'root/9p/book.json')),
  targetSelection: bind(path.join(E, 'target-selection.json')),
  excludedBoundaryDrafts: load(path.join(E, 'target-selection.json')).excluded,
  unusedNativeFigureSideEffects: bind(path.join(E, 'unused-native-figures-excluded.json')),
  unusedNativeFigureFilesExcluded: 96,
  editions, figures, sameGeometryAndLabelsForBothEditions: true,
  identicalSpecsAndSVGsProveDeterminismOnly: true,
  authoritativeBilingualBindings: bind(path.join(E, 'bilingual-text-bindings.json')),
  mechanicalTextValidation: bind(path.join(E, 'native-text-validation.json')),
  firstAuthorFigureValidation: bind(path.join(E, 'native-figure-author-validation.json')),
  authorDisplayProof: bind(path.join(E, 'author-figure-display-proof.json')),
  actualMinMeasuredTextPx: 22, mediaWidthDesktopAndMobile: 640,
  displayEvidenceLimitation: display.limitation,
  figurePreviews: display.results.flatMap(x => x.captures.flatMap(y => [y.startPreview, y.endPreview])),
  imageLedger: bind(path.join(E, 'image-ledger.json')),
  selfGrill: bind(path.join(E, 'self-grill.json')),
  primaryReading: {required: false, opened: false, reason: 'Faithful native text is sufficient; circulation ambiguity remains HOLD, no generic outside source substituted.'},
  authority: {
    latest179Comment: '830251c5-4c6f-48af-9bae-6e3a22118c80',
    finish: 'review', grill: 'self', sameCapabilityInvocation: true, freshnessUpdates: 0,
    reusedReceipts: ['d061-live181-read', 'd061-live179-comments-read'].map(name =>
      bind(path.join(W, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/native', name, 'stdout.txt'))),
  },
  reusedAuthorAndReviewRecords: [
    'd1816-d066-source310311-author/author-freeze.json',
    'd1816-d067-source310311-review/report.json',
    'd1816-d067-source311-subscript-repair/author-freeze.json',
    'd1816-d068-source312313-author/author-freeze.json',
  ].map(file => bind(path.join(W, '.intentfold/tickets/STEMROBIN-181/tmp', file))),
  nativeReceipts: receipts, nativeFailures: failures,
  failureCount: failures.length,
  recoveryHistory: [
    'First anchor extraction treated native paragraph objects as strings: technical correction only.',
    'First text diagnostics retained: EN math order corrected to source order; raw printed_title retained; source literal1. preserved; no math or numeral omitted.',
    'Parallel assertion field format repaired before rendering.',
    'Missing worktree playwright-core: read-only byte-identical pre-existing runtime reused; no installation.',
    'Short circulation arrow marker execution fault: increased the same observed-direction span; no renderer or SVG edits.',
    'One visual-content repair: restored source heavy-left-rim distinction; before/current specs and renders retained.',
    'Unused native shared-work figure copies moved out of target carrier; no successful assembly rerun.',
  ],
  retainedOwnedFiles: ownedFiles,
  execution: {
    canonicalWrites: false, sharedMeterOrEvidenceIndexWrites: false,
    sourcePageWrites: false, sourceFinalization: false, sourceReviewReruns: 0,
    modernAdaptFinalize: false, nativeRecordReview: false,
    figurePromotion: false, offlineLessonRender: false,
    databaseConnections: 0, databaseWrites: false, deployments: false,
    dependencyWrites: false, modelChanges: false, paidCalls: 0,
    skillWrites: false, branchesOrWorktreesChanged: false, commitOrPush: false,
    EStarted: false, otherChatsMessaged: 0, reviewersDispatched: 0,
    wholeSourceOrCardApprovalDeclared: false,
    existingChinese124And127Touched: false, formalHandoff: false,
  },
};
save(path.join(E, 'author-freeze.json'), freeze);
console.log(JSON.stringify({freeze: bind(path.join(E, 'author-freeze.json')),
  counts: freeze.counts, failureCount: failures.length,
  rawLessonSHA256: hash(path.join(raw, 'lesson.json')),
  templates: editions.map(x => x.templates[0]),
  figures: figures.map(x => ({edition: x.edition, spec: x.spec, svg: x.svg, render: x.nativeRenderReport})),
  status: freeze.status}));

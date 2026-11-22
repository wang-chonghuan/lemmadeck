import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const cwd = process.cwd();
const root = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n32-fig204206-author-first-10');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size });
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
const filesUnder = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(directory, entry.name);
  return entry.isDirectory() ? filesUnder(file) : [file];
}).sort();
const figures = ['fig-204', 'fig-205', 'fig-206'];
const finals = {
  'fig-204': { revision: 0, suffix: '', contextSuffix: '', reason: 'Native geometry/render completed, but the contradiction supposition c-does-not-meet-b has no scoped executable representation in the unchanged FigureSpec contract. Stroke-only checks are not full semantic approval.' },
  'fig-205': { revision: 1, suffix: '.r1', contextSuffix: '', reason: 'Native B-label stroke collision persists with score 10000 after the one allowed content revision. Both failed attempts are retained; no second revision or renderer override.' },
  'fig-206': { revision: 1, suffix: '.r1', contextSuffix: '.r1', reason: 'Full turned-path contradiction schematic has no executable assertion scope for two parallels meeting at P. Native stroke render completed, not semantic approval. The 358px mobile screenshot also has an unresolved lower-region visual inconsistency.' },
};
const mobileEvidence = path.join(root, 'mobile.evidence.json');
write(path.join(root, 'mobile.firstfailure.json'), {
  schema: 'author-observed-preview-hold@1', role: 'AUTHOR_ONLY_NOT_REVIEW',
  affectedPreview: bind(path.join(root, 'mobile-358.png')),
  affectedFigure: 'fig-206', mobileEvidence: bind(mobileEvidence),
  observed: 'The loaded 358px screenshot appears to show a diagonal in the lower c-region that is absent from the native fig-206 preview. DOM text-size and nonblank measurements do not settle this visual discrepancy.',
  status: 'HOLD', diagnosedCause: null,
  sourceOrNativeAssetsChanged: false, recoveryPerformed: false,
  furtherImageLoads: 0, imageBudgetExhausted: true,
});
const observations = {
  'fig-204': 'Native preview retains a/b/c/A, actual upper crossing, parallel solid horizontal portions and finite diagonal ending above b. No extra intersection, angle mark, answer annotation or hypothetical-parallel annotation was drawn.',
  'fig-205': 'Revision-1 native preview retains all five labels, all four solid straight strokes, the unnamed a/c foot and both local right-angle elbows, with B common to b/c/p. Native collision remains authoritative despite the glyph appearing separated in the preview.',
  'fig-206': 'Native preview retains a/b/c/P, three horizontal solid portions, both direction-changing straight dashed continuations and their crossing. No impossible full-line parallelism is asserted as actual geometry.',
};
const imageReads = [
  ['source-original', 'fig-204', path.join(cwd, 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-204.png')],
  ['source-original', 'fig-205', path.join(cwd, 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-205.png')],
  ['source-original', 'fig-206', path.join(cwd, 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-206.png')],
  ['native-author-sanity', 'fig-204', path.join(root, 'fig-204/fig-204.native.png')],
  ['native-author-sanity-failed-render', 'fig-205', path.join(root, 'fig-205/fig-205.r1.native.png')],
  ['native-author-sanity', 'fig-206', path.join(root, 'fig-206/fig-206.r1.native.png')],
  ['mobile-author-sanity', 'fig-204+fig-206', path.join(root, 'mobile-300.png')],
  ['mobile-author-sanity-unresolved', 'fig-204+fig-206', path.join(root, 'mobile-358.png')],
].map(([purpose, figure, file], index) => ({ ordinal: index + 1, chargedImages: 1, purpose, figure, file: bind(file), independentReview: false }));
const figureEntries = [];
for (const id of figures) {
  const dir = path.join(root, id);
  const final = finals[id];
  const specFile = path.join(dir, `spec${final.suffix}.json`);
  const spec = read(specFile);
  const sourceFile = path.resolve(cwd, spec.source.image.path);
  if (hash(sourceFile) !== spec.source.image.sha256) throw new Error(`Source hash mismatch: ${id}`);
  const firstFile = path.join(dir, 'FIRST.json');
  const frozen = read(path.join(dir, 'FIRST.freeze.json'));
  if ((fs.statSync(firstFile).mode & 0o777) !== 0o444 || hash(firstFile) !== frozen.first.sha256) throw new Error(`FIRST freeze drift: ${id}`);
  const reportFile = path.join(dir, `${id}${final.suffix}.render.json`);
  const svgFile = path.join(dir, `${id}${final.suffix}.svg`);
  const previewFile = path.join(dir, `${id}${final.suffix}.native.png`);
  const native = read(reportFile);
  const calls = filesUnder(dir).filter(file => file.endsWith('.call.json')).map(file => ({ receipt: bind(file), ...read(file) }));
  const renderCalls = calls.filter(call => call.stage.startsWith('render'));
  const validatorCalls = calls.filter(call => call.stage.startsWith('validate'));
  write(path.join(dir, 'author-sanity.json'), {
    schema: 'author-preview-observation@1', role: 'AUTHOR_ONLY_NOT_REVIEW',
    disposition: 'HOLD', source: bind(sourceFile), first: bind(firstFile),
    spec: bind(specFile), nativePreview: bind(previewFile), nativeRender: bind(reportFile),
    observation: observations[id], nativeRenderStatus: native.status,
    sourceReadCount: 1, candidatePreviewReadCount: 1,
    independentReview: false, reviewFile: null, promotion: false,
  });
  write(path.join(dir, 'hold.json'), {
    schema: 'localized-author-hold@1', figure: id, disposition: 'HOLD',
    reason: final.reason, contentRevisions: final.revision, maximumContentRevisions: 1,
    finalSpec: bind(specFile), finalRender: bind(reportFile), renderStatus: native.status,
    rendererContractChanged: false, remainingRequiredWork: 'Separate human/independent review and resolution of localized HOLD; not authorized in this assignment.',
  });
  const failureFiles = filesUnder(dir).filter(file => /(?:firstfailure|failure\.r1)\.json$/.test(file));
  figureEntries.push({
    id, book: '6-8g', lesson: 'geo68-c3-s1-n32', disposition: 'HOLD', reason: final.reason,
    source: bind(sourceFile), first: bind(firstFile), firstFreeze: bind(path.join(dir, 'FIRST.freeze.json')),
    context: bind(path.join(dir, `context${final.contextSuffix}.json`)),
    spec: bind(specFile), svg: bind(svgFile), render: bind(reportFile), nativePreview: bind(previewFile),
    authorSemantics: bind(path.join(dir, `author-semantics${final.suffix}.json`)),
    authorSanity: bind(path.join(dir, 'author-sanity.json')), hold: bind(path.join(dir, 'hold.json')),
    failures: failureFiles.map(bind),
    revisionEvidence: final.revision ? bind(path.join(dir, 'revision.r1.json')) : null,
    calls, validatorInvocations: validatorCalls.length, rendererInvocations: renderCalls.length,
    contentRevisions: final.revision, technicalRecoveries: 0,
    nativeValidationExitCode: validatorCalls.at(-1).exitCode,
    nativeRenderExitCode: renderCalls.at(-1).exitCode,
    nativeRenderStatus: native.status,
    actualDisplayWidths: spec.display.widths,
    nativeReadabilityChecks: native.displayChecks,
    allMappedPointsCovered: read(path.join(dir, `author-semantics${final.suffix}.json`)).allMappedPointsCovered,
    pointRelationshipsRequirement: id === 'fig-205' ? 'native mapped foot/B group; both covered wholly inside source inventory' : 'single named source point; explicit incident-stroke assertions; no invented labelled points',
    review: null, finalization: false, lessonCompletion: false, modernCanonicalPromotion: false,
  });
}
const ledgerFile = path.join(root, 'ledger.json');
write(ledgerFile, {
  schema: 'bounded-author-usage-ledger@1',
  assignment: 'STEMROBIN-188 SAME188-6 OFFLINE finish=review; SOURCE-FAITHFUL MODERN FIGURE AUTHOR only',
  ownedRoot: root, imageLimitAssignment: 8, imageLimitContext: 24,
  chargedImagesTotal: 8, currentContextImageLoads: 8, imageReads, sourceReopens: 0,
  firstFailed205PreviewImageLoads: 0, parentImagePayloadReturns: 0,
  contentRevisions: { 'fig-204': 0, 'fig-205': 1, 'fig-206': 1 },
  maxContentRevisionsPerFigure: 1, technicalRecoveries: 0,
  validatorInvocations: { 'fig-204': 1, 'fig-205': 2, 'fig-206': 2 },
  rendererInvocations: { 'fig-204': 1, 'fig-205': 2, 'fig-206': 1 },
  paidModelCalls: 0, externalNetworkToolCalls: 0,
  dbOrEnvAccessCommands: 0, appOrServerCommands: 0, gitOrSetupOrFreshnessCommands: 0,
  reviewerOrWorkerSpawns: 0, globalChecks: 0, activeExecSessions: [],
  firstFailureAndRevisionCountsReset: false, nativeToolsContractsChanged: false,
  noIndependentReviewGenerated: true, noCanonicalModernPromotion: true,
});
const externalContext = [
  '.intentfold/tickets/STEMROBIN-188/tmp/n32-text-candidate-10/lesson.template.json',
  '.intentfold/tickets/STEMROBIN-188/tmp/n32-text-candidate-10/exercises.template.json',
  '.intentfold/tickets/STEMROBIN-188/tmp/n32-text-candidate-10/record.json',
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.agents/skills/ld-s10y-image/references/routing.md',
  '.agents/skills/ld-s10y-image/references/figure-spec.md',
  '.agents/skills/ld-s10y-image/references/quality-gate.md',
  '.claude/skills/ld-s10y-lesson/references/production-resume.md',
  '.intentfold/readme.md', '.intentfold/project.json',
  '.intentfold/charter/engineering.md', '.intentfold/charter/operations.md',
].map(file => path.join(cwd, file));
const toolFiles = [
  '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
  '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json',
].map(file => path.join(cwd, file));
const sourceFiles = figureEntries.map(figure => figure.source.path);
const manifestFile = path.join(root, 'figures.manifest.json');
const hashesFile = path.join(root, 'hashes.json');
const allBeforeManifest = [...new Set([...filesUnder(root), ...externalContext, ...toolFiles, ...sourceFiles])].sort();
write(manifestFile, {
  schema: 'source-faithful-modern-figure-author-manifest@1',
  ticket: 'STEMROBIN-188', run: 'SAME188-6', mode: 'OFFLINE', finish: 'review',
  role: 'SOURCE_FAITHFUL_MODERN_FIGURE_AUTHOR_ONLY',
  book: '6-8g', number: 'N32', lesson: 'geo68-c3-s1-n32',
  ownedRoot: root, scope: figures, figures: figureEntries,
  textRecordExpectedSha256: 'ec41479a2e7166be2e3b5a22374d7eac82abc2fe8ad5b6e593147bb417c04fc1',
  commonReadOnlyContext: externalContext.map(bind), unchangedNativeTools: toolFiles.map(bind),
  ledger: bind(ledgerFile), imageBudget: { used: 8, maximumAssignment: 8, maximumContext: 24 },
  mobileEvidence: bind(mobileEvidence),
  mobileFailure: bind(path.join(root, 'mobile.firstfailure.json')),
  mobilePreviews: [300, 358].map(width => bind(path.join(root, `mobile-${width}.png`))),
  files: allBeforeManifest.map(bind),
  hashesPath: hashesFile,
  hashesBinding: 'hashes.json binds this manifest; hashes.json itself is SHA-bound in the final text response to avoid circular hashes.',
  candidateAssetsSeparateFromModernCanonical: true,
  independentReview: false, reviewAt1Generated: false, promotion: false,
  finalization: false, lessonCompletion: false, activeExecSessions: [],
  scopeOutcome: 'AUTHOR CANDIDATES RETAINED; THREE LOCALIZED HOLDs; NOT REVIEWED OR PROMOTED',
});
const allFiles = [...new Set([...filesUnder(root), ...externalContext, ...toolFiles, ...sourceFiles])].filter(file => file !== hashesFile).sort();
write(hashesFile, {
  schema: 'author-artifact-sha256-index@1', algorithm: 'SHA-256', ownedRoot: root,
  files: allFiles.map(bind),
  selfHash: 'Provided in final response; including it here would be circular.',
});
console.log(JSON.stringify({
  manifest: bind(manifestFile), hashes: bind(hashesFile),
  dispositions: Object.fromEntries(figures.map(id => [id, 'HOLD'])),
  chargedImages: 8, contentRevisions: { 'fig-204': 0, 'fig-205': 1, 'fig-206': 1 },
  activeExecSessions: [],
}, null, 2));

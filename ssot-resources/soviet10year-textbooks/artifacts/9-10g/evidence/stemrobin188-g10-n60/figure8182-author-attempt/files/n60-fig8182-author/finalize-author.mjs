import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = path.dirname(new URL(import.meta.url).pathname);
const repo = process.cwd();
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, sha256: crypto.createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length };
};
const save = (file, value) => fs.writeFileSync(path.join(root, file), JSON.stringify(value, null, 2) + '\n');
const before = read(path.join(root, 'inputs.before.json'));
const after = read(path.join(root, 'inputs.after.json'));
const observations = read(path.join(root, 'author-observations.json'));
const manifest = read(path.join(path.dirname(root), 'n60-fig8182-author-inputs-01/manifest.json'));
const admission = read(path.join(path.dirname(root), 'n60-modern-text-admission-01.json'));
const fields = {
  distance: ['a', 'b'], equalDistance: ['a', 'b', 'c', 'd'],
  collinear: ['a', 'b', 'c'], parallel: ['a', 'b', 'c', 'd'],
  perpendicular: ['a', 'b', 'c', 'd'], displacement: ['from', 'to'],
  connects: ['from', 'to'], pointOnLine: ['point', 'a', 'b'], pointOnCircle: ['point', 'center'],
};
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const figures = [];
const coverages = [];
for (const number of ['81', '82']) {
  const figure = `fig-g10-${number}`;
  const currentAttempt = number === '81' ? 'draft-02' : 'draft-01';
  const dir = path.join(root, figure, currentAttempt);
  const spec = read(path.join(dir, 'spec.json'));
  const mapping = read(path.join(dir, 'mapping.json'));
  const first = read(mapping.first.path);
  const assertions = new Map(spec.assertions.map(item => [item.id, item]));
  const objects = new Map(spec.objects.map(item => [item.id, item]));
  const named = mapping.namedSourcePoints;
  const literals = mapping.unmarkedConstructionLoci;
  const rows = first.points.map(sourcePoint => {
    const mapped = [...named, ...literals].find(item => item.firstId === sourcePoint.id);
    if (!mapped) throw new Error(`Missing defining point ${sourcePoint.id}`);
    const group = spec.source.inventory.find(item => item.id === mapped.groupId);
    const groupPointIds = group.objects.filter(id => objects.get(id).type === 'point');
    const groupCoordinates = literals.filter(item => item.groupId === group.id).map(item => item.coordinate);
    const coveredBy = mapped.assertions.filter(id => {
      const assertion = assertions.get(id);
      if (!assertion || !group.assertions.includes(id) || !fields[assertion.type]) return false;
      const references = fields[assertion.type].map(field => assertion[field]);
      if (mapped.objectId) {
        return references.includes(mapped.objectId) && references.length >= 2 &&
          references.every(value => typeof value === 'string' && groupPointIds.includes(value));
      }
      return references.some(value => equal(value, mapped.coordinate)) && references.length >= 2 &&
        references.every(value => groupCoordinates.some(coordinate => equal(value, coordinate)));
    });
    const representedBy = mapped.objectId ? [mapped.objectId] : mapped.visibleBoundaryObjects.filter(id => {
      const object = objects.get(id);
      return object && group.objects.includes(id) && object.type !== 'text';
    });
    if (!coveredBy.length || !representedBy.length) throw new Error(`Uncovered source point ${sourcePoint.id}`);
    return { sourcePoint: sourcePoint.id, group: group.id, representedBy, coveredBy, noUnmappedOrOutsidePoint: true };
  });
  if (bind(mapping.first.path).sha256 !== mapping.first.sha256 ||
      (fs.statSync(mapping.first.path).mode & 0o777) !== 0o444) throw new Error('FIRST inventory drift');
  const render = read(path.join(dir, 'render.json'));
  const specBinding = bind(path.join(dir, 'spec.json'));
  if (render.spec.sha256 !== specBinding.sha256 ||
      render.output.svg.sha256 !== bind(path.join(dir, 'figure.svg')).sha256) throw new Error('Current draft/report drift');
  const attempts = (number === '81' ? ['draft-01', 'draft-02'] : ['draft-01']).map(attempt => {
    const attemptDir = path.join(root, figure, attempt);
    const receipt = read(path.join(attemptDir, 'native.commands.json'));
    return {
      attempt,
      spec: bind(path.join(attemptDir, 'spec.json')),
      nativeCommands: { binding: bind(path.join(attemptDir, 'native.commands.json')), ...receipt },
      renderReport: { binding: bind(path.join(attemptDir, 'render.json')), report: read(path.join(attemptDir, 'render.json')) },
      svg: bind(path.join(attemptDir, 'figure.svg')),
      snapshot: bind(path.join(attemptDir, 'snapshot.png')),
      explicitDraftValidations: 1,
      nativeRenderExecutions: 1,
      rendererEmbeddedDraftValidationExecutions: 1,
    };
  });
  const failurePath = path.join(root, figure, 'FIRST.native-fail.json');
  const contentFailurePath = path.join(root, figure, 'FIRST.content-fail.json');
  const contentFailure = fs.existsSync(contentFailurePath) ? read(contentFailurePath) : null;
  if (contentFailure && (fs.statSync(contentFailurePath).mode & 0o777) !== 0o444) throw new Error('FIRST content failure must be sealed');
  const coverage = {
    figure, spec: specBinding, first: mapping.first, status: 'covered',
    allDefiningSourcePoints: first.points.length, rows,
    objectCountUsedAsSubstitute: false,
    gridOrTablePresent: false,
    nativeAssertionsAlreadyExecuted: true,
    additionalNativeOrFormalTestRerun: false,
    literalPointContract: mapping.literalPointContract || null,
  };
  coverages.push(coverage);
  figures.push({
    id: figure,
    status: contentFailure ? 'localHOLD-author-source-label-FAIL-one-repair-exhausted' : 'author-draft-native-pass-pending-independent-review',
    inventories: {
      first: { ...bind(mapping.first.path), mode: '0444' },
      mapping: bind(path.join(dir, 'mapping.json')),
      supplementalDiagnosticInventory: contentFailure ? {
        binding: bind(contentFailurePath),
        observations: contentFailure.correctedAuthorObservationsNotNewSpec,
        supersedesIncorrectFirstReadingWithoutEditingIt: true,
        noNewSpecAuthored: true,
      } : null,
      pointCoverageDoesNotProveSourceLabelFidelity: true,
    },
    route: {
      chosen: 'deterministic',
      reason: 'Geometry, bases, generator and/or unfolded net have established pixel structures and admitted text roles; no semantic artwork is required.',
      renderer: render.renderer,
      ellipseFallback: 'Analytic curve-only svgPath because FigureSpec@2 lacks ellipse; no point, label, measurement, axis or source defining relation is drawn in the path.',
      noServiceRequired: true,
    },
    currentDraftBinding: {
      attempt: currentAttempt, spec: specBinding, render: bind(path.join(dir, 'render.json')),
      svg: bind(path.join(dir, 'figure.svg')), snapshot: bind(path.join(dir, 'snapshot.png')),
      nativeStatus: render.status, authorContentStatus: contentFailure ? 'fail' : 'no-author-failure-observed-not-independent-review',
      usableAsSourceFaithfulCandidate: !contentFailure,
      displayChecks: render.displayChecks,
    },
    attempts,
    FIRSTfails: fs.existsSync(failurePath) ? [{
      ...bind(failurePath), receipt: read(failurePath), preservationMode: '0444',
      firstSnapshotObservation: observations.observations.find(item => item.figure === figure && item.attempt === 'draft-01'),
    }] : [],
    FIRSTcontentFails: contentFailure ? [{
      ...bind(contentFailurePath), receipt: contentFailure, preservationMode: '0444',
      diagnostic: bind(path.join(root, contentFailure.diagnostic.path)),
    }] : [],
    oneRepair: number === '81' ? mapping.oneRepair : { count: 0, remaining: 1 },
    pointCoverage: coverage,
    localHOLDs: contentFailure ? [{
      id: 'H81-SOURCE-LABEL-FAIL-REPAIR-EXHAUSTED',
      reason: contentFailure.finding,
      dependentStagesStopped: contentFailure.dependentStagesStopped,
      remainingRepairs: 0,
    }] : [],
    inheritedSourceHOLDs: mapping.sourceHolds,
    modernRegularization: mapping.modernRegularization,
    glyphBinding: mapping.glyphBinding || null,
    panelTransliteration: mapping.panelTransliteration || null,
    independentReviewPASS: false,
    promoted: false,
  });
}
if (after.status !== 'unchanged') throw new Error('Bound input changed');
if (figures.some(item => item.currentDraftBinding.nativeStatus !== 'pass')) throw new Error('Native gap');
const repairOld = read(path.join(root, 'fig-g10-81/draft-01/spec.json'));
const repairNew = read(path.join(root, 'fig-g10-81/draft-02/spec.json'));
const changed = [];
const diff = (a, b, location = '') => {
  if (equal(a, b)) return;
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) diff(a[key], b[key], `${location}/${key}`);
  } else changed.push({ path: location, before: a, after: b });
};
diff(repairOld, repairNew);
const lowerIndex = repairOld.objects.findIndex(item => item.id === 'bottom-center');
if (changed.length !== 2 || changed.some(item => !item.path.startsWith(`/objects/${lowerIndex}/labelPlacement/`))) throw new Error('Unrelated repair drift');
save('coverage.author.json', { schema: 'stemrobin188-author-executable-point-coverage@1', coverages, repairDiff: changed });
const result = {
  schema: 'stemrobin188-bounded-figure-author-result@1',
  ticket: 'STEMROBIN-188',
  assignment: 'SAME188-6',
  role: 'BOUNDED N60 FIG81/82 MODERN FIGURE AUTHOR ONLY, NOT reviewer',
  status: 'partial-author-result-fig81-localHOLD-source-label-FAIL-fig82-native-pass-no-independent-review',
  root,
  onlyOwnedNewDirectory: root,
  inputManifest: bind(path.join(path.dirname(root), 'n60-fig8182-author-inputs-01/manifest.json')),
  supplementalTextAdmissionBinding: before.supplementalTextAdmission,
  supplementalTextAdmission: admission,
  beforeAfterInputs: {
    before: { binding: bind(path.join(root, 'inputs.before.json')), snapshot: before },
    after: { binding: bind(path.join(root, 'inputs.after.json')), snapshot: after },
    unchanged: true,
    historicalPendingContextsEdited: false,
  },
  figures,
  authorObservations: { binding: bind(path.join(root, 'author-observations.json')), observations },
  counters: {
    ...observations.counters,
    actualDrafts: 3,
    explicitDraftValidations: 3,
    nativeRenders: 3,
    rendererEmbeddedDraftValidations: 3,
    contentRepairsTotal: 1,
    FIRSTnativeFailures: 1,
    FIRSTcontentFailures: 1,
    unaffectedPASSReruns: 0,
    generatedSVGEdits: 0,
    openExecSessions: 0,
  },
  preservedHistoricalHOLDs: manifest.sourceHolds,
  localHOLDs: figures.flatMap(figure => figure.localHOLDs.map(hold => ({ figure: figure.id, ...hold }))),
  remainingHOLDs: [
    { id: 'H-N60-FIG82-LEADING-GLYPH', reason: 'Source C-like glyph semantic/codepoint identities unresolved and preserved literally; no conventional circumference meaning assigned, no replacement symbol.' },
    { id: 'H-N60-PANEL-AND-FINE-FONT', reason: 'Modern English a/b profile choice does not resolve source panel codepoints; all inherited fine-font/source-glyph HOLDs remain.' },
    { id: 'H-N60-INDEPENDENT-FIGURE-REVIEW', reason: 'Author native reports are not canonical independent review PASS. Parent must collect and close before reading, then independently review current bound drafts.' },
    { id: 'H-N60-LESSON-LAYOUT-ASSEMBLY-PROMOTION', reason: 'No template application, whole-lesson approval, product-surface render, promotion, publication or ticket closure.' },
  ],
  runtimeAndContractFilesReadLocally: [
    '.agents/skills/ld-s10y-image/SKILL.md',
    '.agents/skills/ld-s10y-image/references/routing.md',
    '.agents/skills/ld-s10y-image/references/figure-spec.md',
    '.agents/skills/ld-s10y-image/references/quality-gate.md',
    '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json',
    '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
    '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
    '.claude/skills/ld-s10y-lesson/references/production-resume.md',
  ].map(file => bind(path.join(repo, file))),
  forbiddenActionsPerformed: [],
  record_reviewCalled: false,
  canonicalIndependentReviewPASS: false,
  templatesApplied: false,
  wholeLessonApproved: false,
  promoted: false,
  published: false,
  ticketClosed: false,
  outputIndex: {
    path: 'output-index.json',
    digestPath: 'output-index.sha256',
    selfExcluded: ['output-index.json', 'output-index.sha256'],
    externalDigestReturnedAfterIndexCreation: true,
  },
  parentProtocol: 'Parent COLLECTS+CLOSES author before reading outputs. Return only external SHA and terse text, no image payload.',
};
save('author-result.json', result);
console.log(JSON.stringify({ result: bind(path.join(root, 'author-result.json')), status: result.status, figures: figures.map(item => ({ id: item.id, draft: item.currentDraftBinding.attempt, native: item.currentDraftBinding.nativeStatus })), imageOpens: result.counters.actualBatchImageOpens }));

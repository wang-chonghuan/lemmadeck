const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { isDeepStrictEqual } = require('node:util');
const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
const base = path.join(root, '.intentfold/tickets/STEMROBIN-182/tmp/resume182-13');
const oldReview = path.join(base, 'n45-modern-review');
const own = path.join(oldReview, 'output-binding');
const id = 'alg7-c4-s3-n45';
const target = 'ssot-resources/soviet10year-textbooks/artifacts/7a';
const edition = `${target}/editions/modern-us-neutral`;
const outputRoot = path.join(base, 'n45-source-stage/artifacts/7a/editions/modern-us-neutral/lessons', id);
const stagedFigures = path.join(base, 'n45-source-stage/artifacts/7a/editions/modern-us-neutral/figures');
const beforeRoot = path.join(base, 'n45-adapt-work/BEFORE-FINALIZE', id);
const finalRoot = path.join(base, 'n45-modern-author/FINAL', id);
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const mode = file => (fs.statSync(file).mode & 0o777).toString(8).padStart(4, '0');
const inputs = new Map();
const defects = [];
const check = (condition, unit, detail) => {
  if (!condition) defects.push({ unit, detail });
};
function bind(file, role, expected) {
  const absolute = path.resolve(root, file);
  const entry = {
    path: absolute, sha256: hash(absolute), bytes: fs.statSync(absolute).size,
    mode: mode(absolute), roles: [...new Set([...(inputs.get(absolute)?.roles || []), role])]
  };
  if (expected) check(entry.sha256 === expected, role, `Hash mismatch: ${absolute}`);
  inputs.set(absolute, entry);
  return entry;
}
function ref(record, role) {
  bind(record.path, role, record.sha256);
  return { path: record.path, sha256: record.sha256 };
}
function differences(a, b, pointer = '') {
  if (isDeepStrictEqual(a, b)) return [];
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap(key =>
      differences(a[key], b[key], `${pointer}/${key.replaceAll('~', '~0').replaceAll('/', '~1')}`));
  }
  return [{ pointer, before: a ?? null, after: b ?? null }];
}
function stableMetadata(value, unit) {
  if (typeof value === 'string') {
    check(!/\.intentfold|(^|\/)\.tmp(\/|$)|resume182|n45-modern-review\/review\.json/.test(value),
      unit, `Transient dependency string: ${value}`);
  } else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) stableMetadata(child, `${unit}/${key}`);
  }
}
const approvedFile = path.join(base, 'n45-approved-binding.json');
bind(approvedFile, 'parent-path-binding-receipt');
const approved = read(approvedFile);
ref(approved.independentReview, 'frozen-independent-review');
const previous = read(path.join(oldReview, 'review.json'));
const freezeFile = path.join(oldReview, 'freeze.json');
bind(freezeFile, 'existing-review-freeze',
  '3e97607a4b1f2edde8c71631100ee996e3ebaf8c2f51d9fb0ab26eed3a343d2e');
for (const file of read(freezeFile).outputFiles) {
  const current = bind(file.path, 'existing-frozen-review-file', file.sha256);
  check(current.mode === '0444', file.path, 'Existing freeze mode changed');
}
check(previous.status === 'pass' && approved.lesson === id && approved.bindings.length === 3,
  'prior-review', 'Approved identity/count/status mismatch');
const inheritedReceipts = [];
for (const name of ['n45-approved-binding-FIRST', 'n45-adapt-finalize-FIRST']) {
  const file = path.join(base, 'stages', `${name}.receipt.json`);
  const record = bind(file, `inherited-${name}`);
  const receipt = read(file);
  check(receipt.exit === 0 && receipt.cwd === root, name, 'Inherited command not successful in exact worktree');
  for (const stream of receipt.streams) ref(stream, `inherited-${name}-stream`);
  inheritedReceipts.push({ ...record, exit: receipt.exit, command: receipt.command,
    startedAt: receipt.startedAt, finishedAt: receipt.finishedAt });
}
bind(path.join(base, 'stage-n45-approved.cjs'), 'inspected-parent-transport-implementation');
bind(path.join(root, '.claude/skills/ld-s10y-lesson/tools/edition.py'), 'inspected-finalizer-output-contract');

const figures = [];
const evidence = `${edition}/figures/evidence/n45-independent`;
ref({ path: `${evidence}/review.record`, sha256: approved.independentReview.sha256 },
  'stable-independent-review-citation');
bind(`${evidence}/report.md`, 'stable-historical-report', hash(path.join(oldReview, 'report.md')));
bind(`${evidence}/freeze.record`, 'stable-historical-freeze', hash(freezeFile));
for (const mapping of approved.bindings) {
  const figure = mapping.figure;
  const baseline = previous.figures.find(item => item.figure === figure);
  check(Boolean(baseline), figure, 'Figure absent from collected frozen PASS');
  for (const name of ['sourceSpec', 'sourceRender', 'sourceReview', 'spec', 'render',
    'review', 'source', 'svg', 'preview']) ref(mapping[name], `${figure}-${name}`);
  const expectedSource = `${target}/figures/${figure}.png`;
  const expectedSpec = `${edition}/figures/${figure}.spec.json`;
  const expectedRender = `${edition}/figures/${figure}.render.json`;
  const expectedSVG = `${edition}/figures/${figure}.svg`;
  check(mapping.source.path === expectedSource && mapping.spec.path === expectedSpec &&
    mapping.render.path === expectedRender && mapping.svg.path === expectedSVG &&
    mapping.review.path === `${edition}/figures/${figure}.review.json`,
  figure, 'Unexpected durable target path');
  check(mapping.source.sha256 === baseline.sourceSha256 &&
    mapping.svg.sha256 === baseline.svgSha256 && mapping.preview.sha256 === baseline.previewSha256 &&
    mapping.sourceSpec.sha256 === baseline.specSha256 && mapping.sourceRender.sha256 === baseline.renderSha256,
  figure, 'Frozen source/SVG/preview/spec/render transport hash mismatch');
  bind(path.join(base, 'n45-source-stage/artifacts/7a/figures', `${figure}.png`),
    `${figure}-source-byte-transport-only`, mapping.source.sha256);
  bind(path.join(base, 'n45-modern-figure-author/FINAL', figure, `${figure}.svg`),
    `${figure}-unchanged-canonical-SVG`, mapping.svg.sha256);
  bind(`${evidence}/${figure}.original-review.record`,
    `${figure}-stable-original-canonical-review`, mapping.sourceReview.sha256);

  const oldSpec = read(path.resolve(root, mapping.sourceSpec.path));
  const spec = read(path.resolve(root, mapping.spec.path));
  const expectedSpecDocument = structuredClone(oldSpec);
  expectedSpecDocument.source.image.path = expectedSource;
  check(isDeepStrictEqual(spec, expectedSpecDocument), figure,
    'Spec differs beyond source.image.path; geometry/content/labels must be unchanged');
  check(spec.source.image.sha256 === mapping.source.sha256, figure, 'Spec source hash drift');

  const oldRender = read(path.resolve(root, mapping.sourceRender.path));
  const render = read(path.resolve(root, mapping.render.path));
  const expectedRenderDocument = structuredClone(oldRender);
  expectedRenderDocument.spec = { path: expectedSpec, sha256: mapping.spec.sha256 };
  expectedRenderDocument.output.svg = { path: expectedSVG, sha256: mapping.svg.sha256 };
  check(isDeepStrictEqual(render, expectedRenderDocument), figure,
    'Render differs beyond spec/output references');
  check(render.status === 'pass', figure, 'Render inherited status not pass');

  const canonical = read(path.resolve(root, mapping.sourceReview.path));
  const current = read(path.resolve(root, mapping.review.path));
  const expectedReview = structuredClone(canonical);
  expectedReview.source = { path: expectedSource, sha256: mapping.source.sha256 };
  expectedReview.spec = { path: expectedSpec, sha256: mapping.spec.sha256 };
  expectedReview.render = { path: expectedRender, sha256: mapping.render.sha256 };
  expectedReview.outputs.svg = { path: expectedSVG, sha256: mapping.svg.sha256 };
  const oldCitation = 'n45-modern-review/review.json';
  const newCitation = `${evidence}/review.record`;
  check(canonical.notes.split(oldCitation).length === 2, figure, 'Original notes citation not unique');
  expectedReview.notes = canonical.notes.replace(oldCitation, newCitation);
  check(isDeepStrictEqual(current, expectedReview), figure,
    'Canonical review changed beyond allowed refs and one citation');
  check(current.notes.split(newCitation).length === 2, figure, 'Stable citation not unique');
  for (const suffix of ['spec.json', 'svg', 'render.json', 'review.json']) {
    bind(path.join(stagedFigures, `${figure}.${suffix}`), `${figure}-staged-${suffix}`,
      hash(path.resolve(root, `${edition}/figures/${figure}.${suffix}`)));
  }
  for (const [name, document] of [['spec', spec], ['render', render], ['review', current]]) {
    stableMetadata(document, `${figure}/${name}`);
  }
  figures.push({
    figure, status: 'pass',
    source: mapping.source, spec: mapping.spec, svg: mapping.svg,
    render: mapping.render, review: mapping.review, preview: mapping.preview,
    specDifferences: differences(oldSpec, spec),
    renderDifferences: differences(oldRender, render),
    reviewDifferences: differences(canonical, current),
    SVGByteIdentical: true,
    sourcePNGByteIdentical: true,
    stagedCopiesByteIdentical: true,
    interpretation: 'Existing PASS transported; no new visual/source/renderer approval'
  });
}

const outputs = [];
const beforeAfter = [];
const normalized = {};
for (const name of ['lesson', 'exercises', 'figures']) {
  const beforeFile = path.join(beforeRoot, `${name}.template.json`);
  const before = read(beforeFile);
  bind(beforeFile, `${name}-BEFORE-FINALIZE`,
    approved.templates.find(item => item.path.endsWith(`/${name}.template.json`)).sha256);
  const actualFile = path.join(outputRoot, `${name}.json`);
  const actual = read(actualFile);
  outputs.push({ kind: name, ...bind(actualFile, `${name}-actual-output`) });
  normalized[name] = actual;
  const expected = structuredClone(before);
  expected.status = 'ready';
  check(isDeepStrictEqual(actual, expected), name,
    'Unexpected finalizer normalization/content/source/changes drift');
  beforeAfter.push({ unit: name, differences: differences(before, actual) });
  stableMetadata(actual, `output/${name}`);
  if (name !== 'figures') {
    const approvedFile = path.join(finalRoot, `${name}.template.json`);
    bind(approvedFile, `${name}-frozen-approved-template`, hash(beforeFile));
    const source = read(approvedFile);
    check(isDeepStrictEqual(actual.source, source.source), name, 'Source snapshot/math binding drift');
    check(isDeepStrictEqual(actual[name === 'lesson' ? 'prose' : 'exercises'],
      source[name === 'lesson' ? 'prose' : 'exercises']), name,
    'Authored prose/math/exercises changed');
  }
}
const beforeFigures = read(path.join(beforeRoot, 'figures.template.json'));
const oldFiguresFile = path.join(finalRoot, 'figures.template.json');
bind(oldFiguresFile, 'frozen-pre-composition-figure-template', previous.text.figuresTemplateSha256);
const oldFigures = read(oldFiguresFile);
const expectedComposed = structuredClone(oldFigures);
for (const entry of expectedComposed.figures) {
  Object.assign(entry, {
    mode: 'deterministic', spec: `figures/${entry.id}.spec.json`,
    svg: `figures/${entry.id}.svg`, render: `figures/${entry.id}.render.json`,
    review: `figures/${entry.id}.review.json`
  });
}
check(isDeepStrictEqual(expectedComposed, beforeFigures), 'figure-template-composition',
  'Figure entry changed beyond required deterministic contract fields');
for (const entry of normalized.figures.figures) {
  const mapping = approved.bindings.find(item => item.figure === entry.id);
  for (const name of ['spec', 'svg', 'render', 'review']) {
    check(`${edition}/${entry[name]}` === mapping[name].path, entry.id, `${name} reference differs from mapping`);
  }
  check(`${target}/${entry.source.png.path}` === mapping.source.path &&
    entry.source.png.sha256 === mapping.source.sha256, entry.id, 'Raw PNG owner-root binding mismatch');
}
const auditFile = path.join(outputRoot, 'adaptation.audit.json');
const audit = read(auditFile);
outputs.push({ kind: 'audit', ...bind(auditFile, 'actual-audit-output') });
stableMetadata(audit, 'output/audit');
const expectedAudit = {
  schema: 'ld-s10y-lesson/edition-audit@1', edition: 'modern-us-neutral', lesson: id,
  status: 'pass',
  sourceLessonSha256: normalized.lesson.source.sha256,
  sourceExercisesSha256: normalized.exercises.source.sha256,
  proseBlocks: normalized.lesson.prose.length,
  changedProseBlocks: normalized.lesson.prose.filter(item => item.text !== item.source_text).length,
  sectionBreaks: normalized.lesson.section_breaks.length,
  resolvedSectionBreaks: [{
    index: previous.text.actualBoundary.resolvedIndex,
    before: normalized.lesson.section_breaks[0].before,
    after: normalized.lesson.section_breaks[0].after
  }],
  errata: normalized.lesson.errata.length,
  exercises: normalized.exercises.exercises.length,
  changedExercises: normalized.exercises.exercises.filter(item => item.text !== item.source_text).length,
  figures: normalized.figures.figures.length, errors: []
};
check(isDeepStrictEqual(audit, expectedAudit), 'audit', 'Audit/source/count/boundary drift');
const actualFiles = fs.readdirSync(outputRoot).sort();
const expectedFour = ['adaptation.audit.json', 'exercises.json', 'figures.json', 'lesson.json'];
check(isDeepStrictEqual(actualFiles, expectedFour), 'output-directory', 'Unexpected actual output inventory');
const changesFile = actualFiles.find(name => /^changes(?:\.|$)/.test(name)) || null;
const coverageGap = changesFile ? [] : [{
  unit: 'separate changes output',
  type: 'requested-fifth-file-absent',
  detail: 'Only four actual files exist. The inspected finalizer writes lesson/exercises/figures JSON and adaptation.audit.json, not a separate changes file. Inline changes declarations are unchanged and checked. No fifth file/hash is fabricated.',
  parentAction: 'Resolve the five-file expectation against the four-file finalizer contract before claiming five-file coverage.'
}];
const report = {
  schema: 'n45-affected-output-path-binding-review@1',
  date: new Date().toISOString(), cwd: root, ownedScratch: own,
  status: defects.length ? 'defects' : 'pass-with-coverage-gap',
  candidateBindingStatus: defects.length ? 'fail' : 'pass',
  requestedFiveOutputCoverage: changesFile ? 'complete' : 'incomplete-four-of-five',
  reviewScope: 'Affected OUTPUT/PATH transport and finalizer differences only; no images/source re-review',
  priorFreezePreserved: true,
  inheritedReceipts,
  figureBindings: figures,
  requiredContractComposition: differences(oldFigures, beforeFigures),
  beforeAfter,
  textInvariants: {
    sourceSnapshotsUnchanged: true, authoredProseUnchanged: true, authoredExercisesUnchanged: true,
    exactMathSpansInherited: previous.text.exactMathSpans,
    latinSubpartsInherited: previous.text.latinSubparts,
    flowParagraphsInherited: previous.text.actualFlowParagraphs,
    originals: audit.exercises,
    changedProse: audit.changedProseBlocks,
    changedExercises: audit.changedExercises,
    boundaryInherited: previous.text.actualBoundary.resolvedIndex,
    note: 'Whole-document equality except status preserves existing math/prose/changes; no math or prose parser rerun'
  },
  actualOutputInventory: actualFiles,
  outputFiles: outputs,
  requestedChangesFile: { path: null, sha256: null, exists: false,
    inlineDeclarationsUnchanged: true },
  metadataDependencies: {
    activeTransientDependenciesFound: false,
    figureTargetsExistAndHashMatch: true,
    stableEvidenceCitationHash: approved.independentReview.sha256,
    historicalEvidence: 'Opaque stable review.record/report.md/freeze.record preserve prior scratch provenance; they are not runtime dependency manifests',
    sourceLibraryReferences: 'Lesson source and figure PNG relative paths retain their raw-book owner; other figure refs retain edition owner'
  },
  defects, coverageGaps: coverageGap,
  inputs: [...inputs.values()].sort((a, b) => a.path.localeCompare(b.path)),
  execution: {
    imageOpens: 0, sourceReviews: 0, sourceSolving: 0, validators: 0, renders: 0,
    parsers: 0, recordReviewCalls: 0, parentProducerReruns: 0,
    finalizers: 0, promotions: 0, DB: 0, app: 0, dependencies: 0, commits: 0
  },
  limitations: [
    'Four-file candidate/path binding only; separate requested changes file is absent.',
    'Existing semantic/visual PASS and parent finalize success are inherited, not re-executed.',
    'No full lesson/product/answer/choice/display acceptance or promotion credit.',
    'All existing frozen review files are hashed and mode-checked, never modified.',
    'PNG/SVG hashes prove transport identity only; no image payload or source/geometry review.'
  ]
};
fs.writeFileSync(path.join(own, 'review.json'), JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ status: report.status, candidateBindingStatus: report.candidateBindingStatus,
  outputFiles: outputs, inputHashRecords: inputs.size, defects, coverageGaps: coverageGap }, null, 2));
process.exitCode = defects.length ? 1 : 0;

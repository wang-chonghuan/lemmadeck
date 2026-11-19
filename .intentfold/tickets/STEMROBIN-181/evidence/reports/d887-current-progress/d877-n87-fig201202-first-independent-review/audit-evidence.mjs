import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const T = path.join(R, '.intentfold/tickets/STEMROBIN-181');
const A = path.join(T, 'tmp/d848-n87-fig201202-first-author');
const D = path.join(T, 'tmp/d858-n87-text-first-repair');
const W = path.join(T, 'tmp/d877-n87-fig201202-first-independent-review');
if (process.cwd() !== R) throw new Error('Wrong workdir');
const within = p => {
  const absolute = path.resolve(R, p);
  if (!absolute.startsWith(`${R}/`)) throw new Error(`Outside sole root: ${p}`);
  return absolute;
};
const read = p => fs.readFileSync(within(p));
const json = p => JSON.parse(read(p));
const hash = p => crypto.createHash('sha256').update(read(p)).digest('hex');
const textHash = t => crypto.createHash('sha256').update(t).digest('hex');
const bind = p => ({ path: within(p), sha256: hash(p), bytes: read(p).length });
const write = (name, data) => {
  const target = path.join(W, name);
  if (fs.existsSync(target)) throw new Error(`Preserve existing file: ${target}`);
  fs.writeFileSync(target, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' });
};
const manifest = json(path.join(A, 'frozen-artifacts.json'));
const frozenChecks = manifest.artifacts.map(a => {
  if (a.type === 'symlink') {
    const actual = fs.readlinkSync(within(a.path));
    return { path: a.path, type: a.type, target: actual, pass: actual === a.target };
  }
  const actual = bind(a.path);
  return { ...actual, type: a.type, expectedSha256: a.sha256, pass: actual.sha256 === a.sha256 && actual.bytes === a.bytes };
});
const drift = frozenChecks.filter(c => !c.pass);
write('frozen-input-verification.json', {
  manifest: bind(path.join(A, 'frozen-artifacts.json')),
  checked: frozenChecks.length, failures: drift, status: drift.length ? 'HOLD' : 'PASS',
  checks: frozenChecks
});
if (drift.length) throw new Error('Frozen author input drift');
const author = json(path.join(A, 'author-report.json'));
const d858 = json(path.join(D, 'report.json'));
const currentChecks = d858.candidates.map(c => ({
  ...bind(c.path), locale: c.locale, kind: c.kind,
  expectedSha256: c.sha256, pass: hash(c.path) === c.sha256
}));
if (currentChecks.some(c => !c.pass)) throw new Error('Current candidate binding drift');
const images = [
  ...author.figures.map(f => ({ figure: f.figure, purpose: 'bound-original-reopened-once', path: within(f.source.path) })),
  ...author.figures.flatMap(f => [
    { figure: f.figure, purpose: 'existing-exercise-probe', width: 331, path: path.join(A, `display/${f.figure}.exercise-probe.331.png`) },
    { figure: f.figure, purpose: 'existing-prose-display', width: 342, path: path.join(A, `display/${f.figure}.prose.342.png`) },
    { figure: f.figure, purpose: 'existing-native-final-preview', width: 640, path: f.finalCandidate.preview.path }
  ])
];
const imageLedger = images.map((i, index) => ({ load: index + 1, ...i, ...bind(i.path) }));
const contexts = [];
const metadataDeltas = [];
const actualUsages = [];
for (const locale of ['zh', 'en']) {
  const lessonPath = path.join(D, `candidate/${locale}/lesson.template.json`);
  const exercisePath = path.join(D, `candidate/${locale}/exercises.template.json`);
  const lesson = json(lessonPath);
  const before = json(path.join(D, `before/${locale}/lesson.template.json`));
  const exercises = json(exercisePath);
  const selected = [3, 8, 11, 14, 15, 16, 17, 18, 19, 21];
  contexts.push({
    locale, lesson: bind(lessonPath), exercises: bind(exercisePath),
    reviewScope: 'Figure-adjacent model and affected-context comparison only, not a full text review',
    relevantText: selected.map(index => ({
      pointer: `/prose/${index}/text`,
      source_refs: lesson.prose[index].source_refs,
      text: lesson.prose[index].text,
      textSha256: textHash(lesson.prose[index].text)
    }))
  });
  for (const [index, item] of lesson.prose.entries()) {
    if (item.text !== before.prose[index].text) {
      const oldEntry = `[${locale}; lesson; source refs ${item.source_refs.join(',')}] ${before.prose[index].text}`;
      metadataDeltas.push({
        locale, pointer: `/prose/${index}/text`, source_refs: item.source_refs,
        oldTextSha256: textHash(before.prose[index].text),
        currentTextSha256: textHash(item.text),
        embeddedInFrozenSpecs: author.figures.filter(f =>
          json(f.finalCandidate.spec.path).source.authoritativeText.some(t => t.text === oldEntry)
        ).map(f => f.figure)
      });
    }
    if (['fig-201', 'fig-202'].includes(item.id)) {
      actualUsages.push({
        locale, figure: item.id, owner: bind(lessonPath),
        pointer: `/prose/${index}`, kind: item.kind,
        source_refs: item.source_refs, entry: item,
        catalogEntry: lesson.figures.find(f => f.id === item.id),
        surface: 'lesson-prose', currentProductApproval: false
      });
    }
  }
  actualUsages.push({
    locale, owner: bind(exercisePath), surface: 'exercises',
    count: exercises.exercises.length,
    figureAssociations: exercises.exercises.flatMap((e, index) =>
      [...(e.figures ?? []), ...(e.figure_refs ?? [])].map(f => ({ index, figure: f }))),
    fixtureDisposition: '331px exercise screenshots are preventive probes, not actual exercise figure usages.'
  });
}
write('current-authoritative-context.json', {
  schema: 'd877/current-figure-context@1',
  authority: 'Current d858 candidates, not d837 FIRST author text',
  currentCandidates: currentChecks, contexts, metadataDeltas, actualUsages,
  changedContextDisposition: 'Both specs require metadata rebinding. No spec was modified and no current figure approval is claimed.',
  separateGates: ['SCI', 'ZHEN', 'Current repaired-text independent review']
});

const validations = [];
const geometry = [];
for (const f of author.figures) {
  const spec = json(f.finalCandidate.spec.path);
  const call = spawnSync('python3', [
    path.join(R, '.agents/skills/ld-s10y-image/scripts/validate_spec.py'),
    f.finalCandidate.spec.path, '--stage', 'rendered', '--json'
  ], { cwd: R, env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' }, encoding: 'utf8' });
  if (call.error) throw call.error;
  const validation = {
    figure: f.figure, command: ['python3', '.agents/skills/ld-s10y-image/scripts/validate_spec.py', f.finalCandidate.spec.path, '--stage', 'rendered', '--json'],
    workdir: R, exitCode: call.status, stdout: call.stdout, stderr: call.stderr,
    result: JSON.parse(call.stdout), spec: bind(f.finalCandidate.spec.path)
  };
  write(`${f.figure}.validation-FIRST.json`, validation);
  validations.push({ figure: f.figure, exitCode: call.status, status: validation.result.status });
  const render = json(f.finalCandidate.render.path);
  const pointMap = new Map(spec.objects.filter(o => o.type === 'point').map(o => [o.id, o.at]));
  const objectIds = new Set(spec.objects.map(o => o.id));
  const assertionIds = new Set(spec.assertions.map(a => a.id));
  const resolve = p => Array.isArray(p) ? p : pointMap.get(p);
  const arrows = spec.objects.filter(o => o.type === 'arrow');
  const arrowCoverage = arrows.map(o => ({
    object: o.id,
    covered: spec.assertions.some(a =>
      a.type === 'connects' && a.arrow === o.id && a.from === o.from && a.to === o.to)
  }));
  const independentMaps = json(path.join(W, 'independent-findings-FIRST.json')).inventoryMappings
    .filter(m => m.requirement.startsWith(f.figure === 'fig-201' ? 'ind201' : 'ind202'));
  const mapResolution = independentMaps.map(m => ({
    requirement: m.requirement,
    missingObjects: m.objects.filter(id => !objectIds.has(id)),
    missingAssertions: m.assertions.filter(id => !assertionIds.has(id))
  }));
  const lines = spec.objects.filter(o => ['arrow', 'segment'].includes(o.type))
    .map(o => {
      const a = resolve(o.from), b = resolve(o.to);
      return { id: o.id, from: a, to: b, dx: b[0] - a[0], dy: b[1] - a[1], length: Math.hypot(b[0] - a[0], b[1] - a[1]) };
    });
  const diagram = {
    figure: f.figure, spec: bind(f.finalCandidate.spec.path),
    svg: bind(f.finalCandidate.svg.path), render: bind(f.finalCandidate.render.path),
    source: bind(f.source.path), assertionCount: spec.assertions.length,
    nativeAssertionStatus: validation.result.status, arrowCoverage, mapResolution,
    renderedSpecHashMatches: render.spec.sha256 === hash(f.finalCandidate.spec.path),
    renderedSvgHashMatches: render.output.svg.sha256 === hash(f.finalCandidate.svg.path),
    renderStatus: render.status, displayChecks: render.displayChecks,
    collisions: render.collisions, theme: render.theme, segmentGeometry: lines
  };
  if (f.figure === 'fig-202') {
    const forward = lines.find(l => l.id === 'film-forward');
    const back = lines.find(l => l.id === 'film-return');
    diagram.currentModelCheck = {
      interfaceVector: [340, 0], thickness: 80,
      incidentVector: lines.find(l => l.id === 'incident-ray'),
      forward, back,
      normalIncidenceDepicted: lines.find(l => l.id === 'incident-ray').dx === 0 && forward.dx === 0 && back.dx === 0,
      diagramRoundTripLength: forward.length + back.length,
      modelTwoH: 160,
      interpretation: 'Coordinate diagnostic, not a measured physical distance: the schematic legs are not normal to the interface. G01 is visible model ambiguity, not a claimed source metric discrepancy.'
    };
  }
  geometry.push(diagram);
}
write('geometry-and-bindings-FIRST.json', {
  schema: 'd877/independent-geometry-binding-audit@1',
  validator: bind(path.join(R, '.agents/skills/ld-s10y-image/scripts/validate_spec.py')),
  validations, figures: geometry,
  scope: 'No renderer invoked. Native assertions checked; semantic model gate remains independent of native validation.'
});
const svgCheck = spawnSync('python3', ['-c', `
import json, sys, xml.etree.ElementTree as ET
results = []
for p in sys.argv[1:]:
    root = ET.parse(p).getroot()
    texts = ["".join(e.itertext()) for e in root.iter() if e.tag.rsplit("}", 1)[-1] == "text"]
    paints = sorted({v for e in root.iter() for k,v in e.attrib.items() if k in ("stroke", "fill", "color")})
    results.append({"path": p, "viewBox": root.get("viewBox"), "texts": texts, "paintAttributes": paints})
print(json.dumps(results, indent=2))
`, ...author.figures.map(f => f.finalCandidate.svg.path)], {
  cwd: R, env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' }, encoding: 'utf8'
});
if (svgCheck.status !== 0) throw new Error(svgCheck.stderr);
write('svg-structure-FIRST.json', { parser: 'Python standard-library ElementTree, no rendering', results: JSON.parse(svgCheck.stdout) });
const failures = [
  ...author.figures.flatMap(f => [
    { figure: f.figure, stage: 'FIRST-validation', artifact: f.first.validation },
    { figure: f.figure, stage: 'repair-1-render', artifact: { path: path.join(A, `calls/${f.figure}-repair-1-render.json`) } }
  ]),
  { stage: 'FIRST-display', artifact: { path: path.join(A, 'display/report.json') } },
  { stage: 'd858-text-repair-history', artifact: { path: path.join(D, 'failures-FIRST.json') } }
].map(item => ({ ...item, artifact: bind(item.artifact.path), payload: json(item.artifact.path), untouched: true }));
write('original-failures-preserved.json', { failures, rule: 'No failure input overwritten; no failed preview loaded. Later passes are not retroactive FIRST approvals.' });
write('usage.json', {
  schema: 'd877/bounded-review-usage@1', independentReviewRounds: 1,
  imageLoads: 8, uniqueImages: 8, sourceOriginalReopens: 2, eachOriginalReopenedOnce: true,
  screenshotAndPreviewImages: 6, repeatLoadsWithinThisReview: 0, crops: 0,
  imageLoadLedger: imageLedger,
  directNativeValidatorCalls: 2, nativeRendererCalls: 0, buildContextCalls: 0,
  nativeOfflineLessonRenderCalls: 0, browserCalls: 0, paidCalls: 0, paidImageCalls: 0,
  paidCostUSD: 0, recordReviewCalls: 0, repairs: 0, fullTextReviews: 0,
  canonicalAssetWrites: 0, sharedIndexWrites: 0, sharedMeterWrites: 0,
  gitCommands: 0, databaseCalls: 0, publisherCalls: 0, deployCalls: 0,
  otherChatCalls: 0, newChats: 0,
  tokenUsage: 'Not exposed; not estimated',
  ledgerOrdering: 'Actual load order: originals 201,202; 201 widths 331,342,640; 202 widths 331,342,640.'
});
const findings = json(path.join(W, 'independent-findings-FIRST.json'));
write('report.json', {
  schema: 'd877/bounded-first-independent-review@1',
  batch: 'd877', ticket: 'STEMROBIN-181', card: 'phy10-c2-s3-n87', round: 'FIRST',
  soleRoot: R, onlyWriteRoot: W, result: findings.result,
  figures: findings.figures,
  authorReport: bind(path.join(A, 'author-report.json')),
  frozenAuthorManifest: bind(path.join(A, 'frozen-artifacts.json')),
  currentCandidates: currentChecks,
  originalInputHashChecks: { checked: frozenChecks.length, drift: drift.length },
  actualUsages, findings: bind(path.join(W, 'independent-findings-FIRST.json')),
  inventory: bind(path.join(W, 'source-inventory-FIRST.json')),
  context: bind(path.join(W, 'current-authoritative-context.json')),
  geometry: bind(path.join(W, 'geometry-and-bindings-FIRST.json')),
  svgStructure: bind(path.join(W, 'svg-structure-FIRST.json')),
  usage: bind(path.join(W, 'usage.json')),
  preservedFailures: bind(path.join(W, 'original-failures-preserved.json')),
  validations,
  recordReviewDisposition: findings.receiptDisposition,
  pendingSeparateGates: findings.remainingSeparateGates,
  limits: findings.limitations,
  stop: 'Bounded FIRST independent review complete. No repair, rebind, receipt, promotion, next batch, SCI/ZHEN decision or publication performed.'
});
const outputs = fs.readdirSync(W).filter(name => name !== 'output-hashes.json')
  .map(name => bind(path.join(W, name)));
write('output-hashes.json', { schema: 'd877/output-hashes@1', artifacts: outputs, note: 'Self-hash excluded; report.json binds the principal evidence. No outside input permissions or contents were changed.' });
console.log(JSON.stringify({
  report: bind(path.join(W, 'report.json')),
  manifest: bind(path.join(W, 'output-hashes.json')),
  substantive: findings.figures.map(f => ({ figure: f.figure, status: f.substantiveStatus, context: f.affectedContextStatus })),
  verifiedFrozenArtifacts: frozenChecks.length, nativeValidations: validations,
  imageLoads: 8, recordReviewCalls: 0
}, null, 2));

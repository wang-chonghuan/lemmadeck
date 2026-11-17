import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const owned = path.dirname(fileURLToPath(import.meta.url));
const scratch = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp');
assert.equal(owned, path.join(scratch, 'd051-n43-independent-figure-review'));
const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const hash = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
function binding(p) {
  const absolute = path.resolve(root, p);
  const buf = fs.readFileSync(absolute);
  return { path: absolute, sha256: hash(buf), bytes: buf.length };
}
function write(name, data) {
  const target = path.join(owned, name);
  assert.ok(target.startsWith(`${owned}/`));
  assert.equal(fs.existsSync(target), false, `Refuse overwrite: ${target}`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(data, null, 2)}\n`);
}

const authorPath = path.join(scratch, 'd051-n43-figure-author/author-freeze.json');
const browserPath = path.join(scratch, 'd051-n43-browser-figure-diagnostic/result.json');
const textPath = path.join(scratch, 'd050-n43-text-repair/repair-freeze.json');
const affectedPath = path.join(scratch, 'd050-n43-affected-review.json');
const author = read(authorPath);
const browser = read(browserPath);
const text = read(textPath);
const affected = read(affectedPath);
assert.equal(binding(authorPath).sha256, '8935a9a835c900eab32a066f80f99660821d0fec82fa1ea69f3bbf6ee60bfc45');
assert.equal(binding(browserPath).sha256, '0cf10f90b6dc29ef52576946de1ce98659a694b22d01ed83de610cf02f467dfa');
assert.equal(binding(textPath).sha256, '47b0ce81aebfec738cf53e70b7679968d05dd04b68524c17e83dfa963433234a');
assert.equal(binding(affectedPath).sha256, '60764f9dd8f0105490223dcd32dca9b8a673763be8d342ccdd526d591727785c');

const records = new Map();
function collect(value) {
  if (!value || typeof value !== 'object') return;
  if (typeof value.path === 'string' && typeof value.sha256 === 'string') {
    const absolute = path.resolve(root, value.path);
    const prior = records.get(absolute);
    if (prior) assert.equal(prior.sha256, value.sha256, `Conflicting binding: ${absolute}`);
    records.set(absolute, { ...value, path: absolute });
  }
  for (const child of Object.values(value)) collect(child);
}
collect(author);
collect(browser);
collect(text);
for (const p of [authorPath, browserPath, textPath, affectedPath]) collect(binding(p));
const frozenRecords = [...records.values()].map((expected) => {
  const actual = binding(expected.path);
  assert.equal(actual.sha256, expected.sha256, `Hash mismatch: ${actual.path}`);
  if (expected.bytes !== undefined) assert.equal(actual.bytes, expected.bytes);
  return { ...actual, expectedSha256: expected.sha256, status: 'pass' };
});

function traceGeometry(spec) {
  const d = spec.objects.find((o) => o.id === 'source82-time-trace').d;
  const tokens = d.trim().split(/\s+/);
  assert.equal(tokens.length % 3, 0);
  const points = [];
  for (let i = 0; i < tokens.length; i += 3) {
    assert.equal(tokens[i], i === 0 ? 'M' : 'L');
    const point = [Number(tokens[i + 1]), Number(tokens[i + 2])];
    assert.ok(point.every(Number.isFinite));
    points.push(point);
  }
  const crests = [];
  const troughs = [];
  for (let i = 1; i < points.length - 1; i++) {
    assert.ok(points[i][0] > points[i - 1][0]);
    const y = points[i][1];
    if (y < points[i - 1][1] && y < points[i + 1][1]) crests.push(points[i]);
    if (y > points[i - 1][1] && y > points[i + 1][1]) troughs.push(points[i]);
  }
  assert.equal(crests.length, 6);
  assert.equal(troughs.length, 7);
  assert.ok(points[1][1] > points[0][1]);
  assert.ok(points.at(-1)[1] < points.at(-2)[1]);
  return {
    basis: 'Current spec M/L source-screen coordinates, derived independently of its assertions; source/browser pixel counts were reviewed separately.',
    sampledPoints: points.length,
    crests,
    troughs,
    first: points[0],
    last: points.at(-1),
    leftDirection: 'descending',
    rightDirection: 'ascending',
    coordinateConvention: 'SVG screen y increases downward',
    status: 'pass'
  };
}

const figureBindings = author.figures.map((figure) => {
  const spec = read(figure.spec.path);
  const render = read(figure.render.path);
  const svg = fs.readFileSync(figure.svg.path, 'utf8');
  assert.equal(spec.schema, 'ld-s10y-image/figure-spec@2');
  assert.equal(render.schema, 'ld-s10y-image/render@2');
  assert.equal(render.status, 'pass');
  assert.equal(render.spec.sha256, binding(figure.spec.path).sha256);
  assert.equal(render.output.svg.sha256, binding(figure.svg.path).sha256);
  assert.equal(spec.source.image.sha256, binding(figure.actualSource.path).sha256);
  assert.equal(binding(spec.source.image.path).sha256, binding(figure.actualSource.path).sha256);
  assert.equal(spec.display.purpose, 'instructional');
  const validation = read(figure.validationOutput.path);
  assert.equal(validation.status, 'pass');
  const validationCommand = read(figure.validationCommand.path);
  const nativeCommand = read(figure.nativeCommand.path);
  for (const command of [validationCommand, nativeCommand]) assert.equal(command.exitCode, 0);
  for (const language of ['en', 'zh']) {
    const templatePath = text.outputs.find((o) => o.language === language && o.kind === 'lesson').path;
    const template = read(path.resolve(root, templatePath));
    const prose = template.prose.filter((b) => b.text).map((b) => b.text).join('\n\n');
    assert.ok(spec.source.authoritativeText.some((entry) => entry.text === prose));
  }
  const captures = browser.observations.filter((o) => o.figure === figure.id);
  assert.deepEqual(captures.map((o) => o.width), [640, 331, 342]);
  const browserInput = browser.inputs.find((i) => path.resolve(root, i.path) === figure.svg.path);
  assert.equal(browserInput.sha256, figure.svg.sha256);
  for (const capture of captures) {
    assert.ok(capture.metrics.pathStrokes.every((stroke) => stroke === 'rgb(21, 32, 31)'));
    assert.ok(capture.metrics.labels.every((label) => label.pixels >= spec.display.minTextPx));
    const png = fs.readFileSync(path.resolve(root, capture.screenshot.path));
    assert.equal(png.subarray(1, 4).toString(), 'PNG');
    assert.equal(png.readUInt32BE(16), capture.width);
  }
  assert.ok(svg.includes('var(--ld-figure-ink'));
  return {
    id: figure.id,
    source: binding(figure.actualSource.path),
    spec: binding(figure.spec.path),
    render: binding(figure.render.path),
    svg: binding(figure.svg.path),
    nativePreview: { ...binding(figure.nativePreview.path), imageOpened: false },
    validation: {
      receipt: binding(figure.validationOutput.path),
      command: binding(figure.validationCommand.path),
      status: validation.status,
      receiptReused: true,
      commandRerun: false
    },
    nativeRender: { command: binding(figure.nativeCommand.path), status: render.status, commandRerun: false },
    authoritativeENAndZHTextMatches: true,
    displayChecks: render.displayChecks,
    chromium: captures,
    geometry: figure.id === 'fig-82' ? traceGeometry(spec) : {
      basis: 'Current coordinates read alongside the actual source and browser pixels.',
      forkBottomScreenY: 283,
      stemScreenY: [281, 305],
      mountFootScreenCenter: [305, 305],
      visibleContactAtEveryInspectedWidth: true
    }
  };
});

const repairPath = author.repairs.evidence.path;
const repair = read(repairPath);
assert.equal(repair.count, 1);
assert.equal(repair.maximum, 1);
assert.equal(repair.furtherRepairsAllowed, false);
const oldSpec = read(repair.oldSpec.path);
const activeSpec = read(repair.repairedSpec.path);
const comparableOld = structuredClone(oldSpec);
const comparableActive = structuredClone(activeSpec);
delete comparableOld.assertions;
delete comparableActive.assertions;
assert.deepEqual(comparableOld, comparableActive);
const oldStem = oldSpec.assertions.find((a) => a.id === 'source81-stem-centered');
const newStem = activeSpec.assertions.find((a) => a.id === 'source81-stem-centered');
assert.deepEqual(oldStem.points, [newStem.a, newStem.b, newStem.c]);
assert.equal(affected.effectiveSCI, 'PASS');
assert.equal(affected.effectiveZHEN, 'PASS');

if (process.argv.includes('--finalize')) {
  const before = read(path.join(owned, 'input-bindings.json'));
  const unchanged = before.records.map((record) => {
    const after = binding(record.path);
    assert.equal(after.sha256, record.sha256, `Input changed during review: ${record.path}`);
    assert.equal(after.bytes, record.bytes);
    return { ...after, unchanged: true };
  });
  const gates = author.figures.map((figure) => {
    const gatePath = path.join(owned, `${figure.id}.review.json`);
    const gate = read(gatePath);
    assert.equal(gate.schema, 'ld-s10y-image/review@1');
    assert.equal(gate.status, 'pass');
    assert.equal(gate.spec.sha256, figure.spec.sha256);
    assert.equal(gate.render.sha256, figure.render.sha256);
    assert.equal(gate.outputs.svg.sha256, figure.svg.sha256);
    return binding(gatePath);
  });
  const observationsPath = path.join(owned, 'observations.json');
  const observations = read(observationsPath);
  write('preservation-after.json', {
    status: 'pass',
    checkedAt: new Date().toISOString(),
    borrowedInputFiles: unchanged.length,
    allBorrowedInputsByteUnchanged: true,
    records: unchanged
  });
  write('report.json', {
    schema: 'ld-s10y-image/independent-bounded-figure-review@1',
    ticket: 'STEMROBIN-181',
    batch: 'D030',
    continuation: 'D051',
    card: 'phy10-c1-s5-n43',
    reviewedAt: new Date().toISOString(),
    status: 'PASS-independent-figures-exact-SVG-browser-review',
    verdict: 'FIG81 and FIG82 independently pass source/edition semantic fidelity and visual inspection of the exact unchanged SVGs at 640, 331 and 342 px. The original generic width-preview FAIL is retained and diagnosed as a CSS-variable raster paint-handling mismatch, not an actual browser-rendered figure defect.',
    ownership: owned,
    pathClarification: 'The user-supplied tmp/... names resolve beneath .intentfold/tickets/STEMROBIN-181/, as confirmed by exact requested freeze hashes. No substitute historical n43 binding was used.',
    qualityContract: [
      binding(path.join(root, '.agents/skills/ld-s10y-image/SKILL.md')),
      binding(path.join(root, '.agents/skills/ld-s10y-image/references/quality-gate.md')),
      binding(path.join(root, '.agents/skills/ld-s10y-image/references/figure-spec.md'))
    ],
    inputFreezes: [authorPath, browserPath, textPath, affectedPath].map(binding),
    observations: binding(observationsPath),
    figures: figureBindings.map((f) => ({ ...f, independentStatus: 'pass', gate: gates.find((g) => path.basename(g.path) === `${f.id}.review.json`) })),
    reviewGates: gates,
    authorVerdict: { status: author.status, retainedUnchanged: true, visualFailure: author.files.authorVisualReview },
    rasterDiagnostic: observations.rasterDiagnostic,
    exactFailureCopies: read(path.join(owned, 'retained-failures.json')),
    repairBudget: { count: 1, maximum: 1, newRepairs: 0, furtherRepairsAllowed: false, evidence: binding(repairPath), originalFailure: binding(repair.oldFailure.path), onlyAssertionEncodingChanged: true },
    text: { repairFreeze: binding(textPath), affectedReview: binding(affectedPath), effectiveSCI: 'PASS-inherited', effectiveZHEN: 'PASS-inherited', rereviewed: false, retainedNumericDeclarationBlockers: author.retainedTextBlockers, blockersRevalidatedOrCleared: false },
    preservation: { before: binding(path.join(owned, 'input-bindings.json')), after: binding(path.join(owned, 'preservation-after.json')), allBorrowedInputsByteUnchanged: true },
    execution: {
      imageOpens: 8, sourceImageOpens: 2, chromiumScreenshotOpens: 6,
      genericResvgRasterImageOpens: 0, nativePreviewImageOpens: 0, parentPageOpens: 0,
      independentVisualReviewRounds: 1, recordReviewInvocations: 2,
      separateNativeValidatorInvocations: 0, rendererInvocations: 0, rasterizerInvocations: 0, browserInvocations: 0,
      recordReviewIntegrityCheck: 'Standard record_review.py in-process validate(spec, rendered) only; no separately invoked native validation/render command.',
      svgEdits: 0, specEdits: 0, artworkEdits: 0, toolEdits: 0, canonicalWrites: 0,
      indexWrites: 0, meterWrites: 0, appWrites: 0, dependencyChanges: 0,
      databaseAccess: false, gitAccess: false, backendAccess: false, descendants: 0
    },
    fullCardApproval: false,
    displayAcceptance: 'pending',
    promotionAllowed: false,
    limits: observations.gateLimits,
    remaining: ['Full-card offline/edition validation and headed product/display acceptance are not approved by this isolated SVG review.', 'No canonical promotion or manifest/index/meter changes were made.', 'The inherited numeric-declaration blocker remains outside this assignment and is not cleared.']
  });
  console.log(JSON.stringify({ report: binding(path.join(owned, 'report.json')), gates, preservation: binding(path.join(owned, 'preservation-after.json')) }, null, 2));
} else {
  write('input-bindings.json', {
    schema: 'ld-s10y-image/independent-exact-byte-bindings@1',
    checkedAt: new Date().toISOString(),
    status: 'pass',
    nativeChecksRerun: false,
    records: frozenRecords,
    figureBindings
  });
  const retainPaths = [
    authorPath,
    author.files.authorVisualReview.path,
    author.files.observations.path,
    repairPath,
    repair.oldSpec.path,
    repair.oldFailure.path,
    path.join(root, '.claude/skills/ld-s10y-lesson/tools/svg_raster.js')
  ];
  for (const figure of author.figures) {
    retainPaths.push(figure.rasterSummary.path);
    for (const width of figure.widthRasters) retainPaths.push(width.raster.path, width.receipt.path);
  }
  const copies = [...new Set(retainPaths)].map((p) => {
    const source = binding(p);
    const relative = path.relative(root, source.path);
    assert.ok(!relative.startsWith('..'));
    const target = path.join(owned, 'retained-failures', relative);
    assert.equal(fs.existsSync(target), false);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source.path, target, fs.constants.COPYFILE_EXCL);
    const copy = binding(target);
    assert.equal(copy.sha256, source.sha256);
    return { original: source, retainedExactByteCopy: copy, imageOpened: false };
  });
  write('retained-failures.json', { status: 'pass-exact-bytes-retained', copies, rasterImagesReopened: false, originalFilesModified: false });
  console.log(JSON.stringify({ status: 'pass', boundInputFiles: frozenRecords.length, retainedFailureFiles: copies.length, figures: figureBindings.map((f) => ({ id: f.id, nativeRender: f.nativeRender.status, authoritativeTextMatches: f.authoritativeENAndZHTextMatches, geometry: f.geometry })) }, null, 2));
}

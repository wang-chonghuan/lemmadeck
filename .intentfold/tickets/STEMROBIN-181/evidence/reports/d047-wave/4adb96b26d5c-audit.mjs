import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const evidence = path.dirname(fileURLToPath(import.meta.url));
const workspace = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const ticket = path.resolve(workspace, '.intentfold/tickets/STEMROBIN-181');
const author = path.join(ticket, 'tmp/d045-10p-n44-author');
const reportPath = path.join(ticket, 'tmp/d045-n44-science-review.json');
const resolve = p => path.resolve(workspace, p);
const read = p => JSON.parse(fs.readFileSync(resolve(p), 'utf8'));
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(resolve(p))).digest('hex');
const writeNew = (name, value) => {
  const destination = path.join(evidence, name);
  fs.writeFileSync(destination, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
  return { path: destination, sha256: sha(destination) };
};

const requested = [
  [path.join(author, 'author-freeze.json'), 'f604f1ebd5774cc9d94998118fee8a15e1ae801ff991dd96893f2586296d338c'],
  [path.join(ticket, 'tmp/d045-source120-123-review.json'), '312b9cfb05bac48a3f258c868e11f4452d9a609493b4e5361ac4d45edc10c774'],
  [path.join(ticket, 'evidence/reports/d045-source120-123-consumed.json'), '2d49381b19c80f91f64eb1e1ebdd332b9cfa485a7eb29683dd0ff175cd19c604'],
];
const freeze = read(requested[0][0]);
const inputs = read(freeze.input.path);
const sourceReview = read(requested[1][0]);
const consumed = read(requested[2][0]);
const expected = new Map(requested);
function collect(value) {
  if (!value || typeof value !== 'object') return;
  if (typeof value.path === 'string' && typeof value.sha256 === 'string') {
    const absolute = resolve(value.path);
    assert(!expected.has(absolute) || expected.get(absolute) === value.sha256);
    expected.set(absolute, value.sha256);
  }
  for (const child of Object.values(value)) collect(child);
}
collect(freeze);
collect(inputs);
collect(consumed.outputs);
const bindings = [...expected].map(([p, expectedSha256]) => {
  const actualSha256 = sha(p);
  return { path: p, expectedSha256, actualSha256, matches: actualSha256 === expectedSha256 };
});
assert(bindings.every(binding => binding.matches), 'Frozen or consumed input hash mismatch');
assert.equal(sourceReview.overallSourceStatus, 'SOURCE PASS');
assert.equal(sourceReview.overallRawStatus, 'RAW PASS');
assert.equal(consumed.status, 'PASS-source-consumed');
assert.equal(consumed.review.sha256, requested[1][1]);
const source122 = sourceReview.pages.find(page => page.physicalPage === 122);
assert.equal(source122.sourceStatus, 'SOURCE PASS');
assert.equal(source122.rawStatus, 'RAW PASS');

const raw = read(inputs.raw.path);
const page = read(path.join(author, '../d044-10p-source120-123-author/source/10p/pages/0122/page.json'));
assert.equal(raw.prose.length, 5);
assert.deepEqual(raw.prose.map(block => block.kind), ['p', 'p', 'fig', 'cap', 'p']);
assert.equal(raw.exercise_count, 0);
const objects = raw.prose.map((block, index) => {
  const sourceBlocks = block.source_refs.map(ref => {
    const match = /^p0122#([0-9]+)$/.exec(ref);
    assert(match, 'Unexpected source block identity');
    return page.blocks[Number(match[1]) - 1];
  });
  assert(sourceBlocks.every(source => source.kind === block.kind));
  assert.equal(sourceBlocks.flatMap(source => source.lines).join(''), block.text);
  if (block.kind === 'fig') assert.equal(sourceBlocks[0].id, block.id);
  return { objectIndex0: index, kind: block.kind, sourceRefs: block.source_refs, sourceText: block.text };
});

const texts = freeze.outputs.map(output => {
  const template = read(output.frozen.path);
  const markdown = fs.readFileSync(resolve(output.prose.path), 'utf8');
  const flowRecord = read(output.flow.path);
  const flow = JSON.parse(flowRecord.stdout);
  assert.deepEqual(template.source.data, raw);
  assert.equal(template.source.sha256, sha(inputs.raw.path));
  assert.equal(template.prose.length, 5);
  template.prose.forEach((block, index) => {
    assert.equal(block.kind, raw.prose[index].kind);
    assert.deepEqual(block.source_refs, raw.prose[index].source_refs);
    assert.equal(block.source_text, raw.prose[index].text);
  });
  assert.equal(flowRecord.exitCode, 0);
  assert.equal(flow.paragraphs.length, 6);
  assert.deepEqual(flow.resolvedBreaks, [1]);
  assert.deepEqual(template.section_breaks, flow.boundaries.map(({ before, after }) => ({ before, after })));
  assert.equal(flow.boundaries[0].before, flow.paragraphs[0].text);
  assert.equal(flow.boundaries[0].after, flow.paragraphs[1].text);
  assert.deepEqual(flow.paragraphs.map(p => p.text.split('\n').length), [3, 3, 3, 3, 3, 2]);
  const proseBlocks = template.prose.filter(block => block.kind === 'p');
  assert.equal(flow.paragraphs.map(p => p.text).join('\n\n'), proseBlocks.map(p => p.text).join('\n\n'));
  const body = template.prose.map(block => block.text).filter(Boolean).join('\n\n');
  const heading = output.language === 'zh' ? '# 44. 声的共鸣' : '# 44. Sound Resonance';
  assert.equal(markdown, heading + '\n\n' + body + '\n');
  return {
    language: output.language,
    template: { path: resolve(output.frozen.path), sha256: sha(output.frozen.path) },
    prose: { path: resolve(output.prose.path), sha256: sha(output.prose.path) },
    flowRecord: { path: resolve(output.flow.path), sha256: sha(output.flow.path) },
    paragraphs: flow.paragraphs,
    sentencesPerParagraph: [3, 3, 3, 3, 3, 2],
    sectionBreak: template.section_breaks[0],
    sourceSnapshotAndObjectIdentityMatch: true,
    markdownBodyMatchesTemplate: true,
    nativeFlowReplay: false,
    metadataTitle: template.title,
    metadataPrintedTitle: template.printed_title,
    markdownHeading: heading,
  };
});

const mode = process.argv[2];
assert(['initial', 'final'].includes(mode));
const integrity = {
  recordedAt: new Date().toISOString(),
  phase: mode,
  verifiedUniqueBindings: bindings.length,
  allMatch: true,
  bindings,
  source122: {
    sourceStatus: source122.sourceStatus,
    rawStatus: source122.rawStatus,
    figureId: source122.rawFigureId,
    reusedExistingReviewOnly: true,
    imagesOpened: 0,
  },
  immutableAuthorInputsOnly: true,
  globalSharedWorktreeUnchangedClaimed: false,
  imagePayloadHashingOnly: true,
  imageDecodingOrVisualOpening: false,
  candidateEdits: 0,
  nativeCommandsReplayed: 0,
};
writeNew(`integrity-${mode}.json`, integrity);
if (mode === 'initial') {
  writeNew('text-bindings.json', { recordedAt: new Date().toISOString(), objects, texts });
  const amplitude = (drive, natural, gamma) =>
    1 / Math.hypot(natural * natural - drive * drive, 2 * gamma * drive);
  const gamma = 0.001;
  const base = amplitude(1, 1, gamma);
  const nearRatio = amplitude(1, 1.000001, gamma) / base;
  const fartherRatio = amplitude(1, 1.01, gamma) / base;
  assert(nearRatio > 0.99999 && fartherRatio < 0.1);
  writeNew('detuning-counterexample.json', {
    purpose: 'Independent analytical counterexample to the universal MUCH weaker claim, not measured tuning-fork data or a new learner formula.',
    authority: 'OpenStax University Physics Volume 1, 15.6, equation 15.29; independently corroborated by UNSW Physclips Forced Oscillations/Resonance.',
    equation: 'A=(F0/m)/sqrt((omegaNatural^2-omegaDrive^2)^2+(2*gamma*omegaDrive)^2)',
    assumptions: 'Linear single-mode receiver, positive damping, fixed nonzero forcing amplitude and drive frequency; modal amplitude units normalized to F0/m=1.',
    omegaDrive: 1,
    gamma,
    referenceOmegaNatural: 1,
    slightlyDifferentOmegaNatural: 1.000001,
    slightlyDetunedAmplitudeRatio: nearRatio,
    fartherOmegaNatural: 1.01,
    fartherDetunedAmplitudeRatio: fartherRatio,
    conclusion: 'Even low damping leaves a finite bandwidth. A nonzero frequency difference can leave the amplitude essentially unchanged; larger detuning can reduce it greatly. No audibility threshold follows from inequality alone.',
    imageGeneration: false,
    nativeValidationReplay: false,
    learnerArtifactEdits: 0,
  });
} else {
  const initial = read(path.join(evidence, 'integrity-initial.json'));
  assert.deepEqual(initial.bindings, bindings);
  const report = read(reportPath);
  const names = fs.readdirSync(evidence).filter(name => name !== 'report-hash.json').sort();
  report.evidenceBindings = names.map(name => {
    const p = path.join(evidence, name);
    return { path: p, sha256: sha(p) };
  });
  report.integrity = {
    allInitialAndFinalBindingsMatch: true,
    verifiedUniqueBindings: bindings.length,
    frozenAuthorAndBoundInputsUnchanged: true,
    sourceReviewAndConsumedRecordMatchRequestedHashes: true,
    sourceSnapshotsAndSourceRefsMatch: true,
    candidateEdits: 0,
    nativeCheckReplay: false,
    globalSharedWorktreeImmutabilityClaimed: false,
  };
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
  const result = { path: reportPath, sha256: sha(reportPath), status: report.status, SCI: report.SCI, ZHEN: report.ZHEN };
  writeNew('report-hash.json', result);
  console.log(JSON.stringify(result, null, 2));
}

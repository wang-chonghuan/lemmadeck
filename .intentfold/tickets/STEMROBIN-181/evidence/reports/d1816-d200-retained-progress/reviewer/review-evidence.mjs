import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), cwd);
const out = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d200-n20-figures30-31-review');
const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const record = (p) => {
  const absolute = path.resolve(cwd, p);
  const bytes = fs.readFileSync(absolute);
  return { path: absolute, bytes: bytes.length, sha256: hash(bytes) };
};
const writeNew = (name, value) => {
  const p = path.join(out, name);
  assert.equal(path.dirname(p), out);
  fs.writeFileSync(p, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
  return record(p);
};
const intake = record(path.join(out, 'input-freeze.json'));
assert.equal(intake.sha256, '61ff3221fb8706d49a5733b279d0328923189df602f9f2e18115edcae7e6cae2');
const after = read(path.join(out, 'after-inventory.json'));
const source = read(path.join(out, 'source-only.json'));
const assessment = read(path.join(out, 'review-assessment.json'));
const commandMode = process.argv[2];

if (commandMode === 'bind') {
  const bindings = new Map();
  const bind = (ref, role) => {
    const actual = record(ref.path);
    if (ref.sha256) assert.equal(actual.sha256, ref.sha256, `stale ${actual.path}`);
    if (ref.bytes !== undefined) assert.equal(actual.bytes, ref.bytes, `byte mismatch ${actual.path}`);
    const previous = bindings.get(actual.path);
    if (previous) {
      assert.equal(previous.sha256, actual.sha256);
      if (!previous.roles.includes(role)) previous.roles.push(role);
    } else {
      bindings.set(actual.path, { ...actual, roles: [role] });
    }
    return actual;
  };
  const walkRefs = (v, role) => {
    if (!v || typeof v !== 'object') return;
    if (typeof v.path === 'string' && typeof v.sha256 === 'string') bind(v, role);
    for (const [key, item] of Object.entries(v)) walkRefs(item, `${role}/${key}`);
  };
  for (const name of ['input-freeze.json', 'source-only.json', 'after-inventory.json', 'dispatch-record.json']) {
    bind({ path: path.join(out, name) }, 'current-intake');
  }
  walkRefs(read(intake.path), 'frozen-intake-reference');
  walkRefs(source, 'source-only-reference');
  walkRefs(after, 'after-inventory-reference');
  bind(assessment.sourceInventory, 'independent-original-pixels-before-candidates');
  bind({ path: path.join(out, 'review-assessment.json') }, 'independent-assessment');
  bind({ path: path.join(out, 'review-evidence.mjs') }, 'review-evidence-tool');
  bind({ path: path.join(out, 'fig-31-source-local-stroke.png') }, 'supplemental-original-crop');
  for (const p of [
    'AGENTS.md',
    '.intentfold/readme.md',
    '.intentfold/project.json',
    '.intentfold/charter/product.md',
    '.intentfold/charter/engineering.md',
    '.intentfold/charter/operations.md',
    '.intentfold/charter/ui.md',
    '.agents/skills/ld-s10y-image/SKILL.md',
    '.agents/skills/ld-s10y-image/references/quality-gate.md',
    '.agents/skills/ld-s10y-image/references/figure-spec.md',
    '.agents/skills/ld-s10y-image/references/routing.md',
    '.claude/skills/ld-s10y-lesson/references/production-resume.md',
    '.agents/skills/ld-s10y-image/scripts/record_review.py',
    '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
    '/Users/yong/.agents/skills/intentfold/SKILL.md',
  ]) bind({ path: p }, 'rules-or-native-review-tool');

  const author = read(after.authorReport.path);
  walkRefs(author, 'author-current-explicit-references');
  const approval = read(after.currentBilingualTextApproval.path);
  assert.equal(approval.independentTextApproval, true);
  assert.equal(approval.reviewerClosed, true);
  for (const key of ['scienceVerdict', 'zhVerdict', 'enVerdict']) assert.equal(approval[key], 'pass');
  bind(approval.report, 'existing-text-approval-report-metadata');
  bind(approval.freeze, 'existing-text-approval-freeze-metadata');
  const textReport = read(path.resolve(cwd, approval.report.path));
  walkRefs(textReport.reviewedTextInputs, 'existing-approved-frozen-text');
  const textChecks = [];
  const figureChecks = [];
  for (const f of after.figures) {
    const c = f.candidate;
    const spec = read(c.spec.path);
    const render = read(c.nativeRenderReport.path);
    const geometry = read(c.currentGeometryEvidence.path);
    const textBinding = read(c.textBinding.path);
    walkRefs(textBinding, `${f.figure}/current-text-binding`);
    walkRefs(geometry, `${f.figure}/used-geometry-receipt`);
    assert.equal(render.schema, 'ld-s10y-image/render@2');
    assert.equal(render.status, 'pass');
    assert.equal(render.figure, f.figure);
    assert.equal(render.spec.sha256, record(c.spec.path).sha256);
    assert.equal(render.output.svg.sha256, record(c.svg.path).sha256);
    assert.equal(spec.source.image.sha256, record(f.sourceImage.path).sha256);
    assert.equal(geometry.status, 'pass');
    assert.equal(geometry.candidateUnchangedSinceFirstChecker, true);
    assert(geometry.checks.every((check) => check.status === 'pass'));
    assert.deepEqual(spec.display.widths, [640]);
    assert(render.displayChecks.every((check) => check.status === 'pass' && check.measuredMinPx >= 16));
    for (const t of textBinding.frozenTexts) {
      const approved = textReport.reviewedTextInputs[t.language === 'zh' ? 'zhLesson' : 'enLesson'];
      assert.equal(record(t.carrier.path).sha256, approved.sha256);
      const prose = read(t.carrier.path).prose.map((b) => b.text || '').filter(Boolean).join('\n\n');
      assert.equal(prose, t.fullText);
      assert.equal(hash(Buffer.from(prose)), t.fullTextSha256);
      assert.equal(Buffer.byteLength(prose), t.fullTextUtf8Bytes);
      assert.equal(spec.source.authoritativeText[t.language === 'zh' ? 0 : 1].text, prose);
      textChecks.push({
        figure: f.figure,
        language: t.language,
        approved: bind(approved, 'existing-approved-text'),
        carrier: bind(t.carrier, 'current-authoritative-text-carrier'),
        fullProseSha256: t.fullTextSha256,
        fullProseUtf8Bytes: t.fullTextUtf8Bytes,
        carrierBytesEqualApprovedText: true,
        specAndTextBindingEqualCompleteCarrierProse: true,
        existingApprovalReusedNoFullTextReview: true,
      });
    }
    const dimensions = {};
    for (const key of ['nativePreview', 'media640Preview']) {
      const png = fs.readFileSync(c[key].path);
      assert.equal(png.subarray(1, 4).toString(), 'PNG');
      dimensions[key] = { width: png.readUInt32BE(16), height: png.readUInt32BE(20) };
    }
    assert.equal(dimensions.nativePreview.width, spec.canvas.width);
    assert.equal(dimensions.media640Preview.width, 640);
    figureChecks.push({
      figure: f.figure,
      candidateSpecSvgSourceAndReceiptsCurrent: true,
      usedNativeRender: c.nativeRenderReport,
      reusedInternalDraftValidation: c.nativeRenderCommand,
      usedGeometry: c.currentGeometryEvidence,
      reusedPassedFirstChecks: geometry.reusedPassedFirstChecks,
      recoveryCallsReplayed: 0,
      renderDisplayChecks: render.displayChecks,
      previewDimensions: dimensions,
    });
  }
  const payload = {
    schema: 'd200/current-input-binding-verification@1',
    cwd,
    checkedAt: new Date().toISOString(),
    inputFreeze: intake,
    status: 'pass',
    bindingPolicy: 'Explicit current inputs and actually used receipts only. Historical author/text report or freeze files are bound as metadata, without traversing their old mutable dependencies or replaying a passed stage. PNG header/hash reads do not load image pixels into context.',
    bindings: [...bindings.values()].sort((a, b) => a.path.localeCompare(b.path)),
    textApprovalChecks: textChecks,
    currentFigureReceiptChecks: figureChecks,
    nativeProducerCheckerOrTextReviewReplays: 0,
  };
  payload.bindingCount = payload.bindings.length;
  const saved = writeNew('current-input-bindings.json', payload);
  console.log(JSON.stringify({ status: 'pass', bindingCount: payload.bindingCount, output: saved }, null, 2));
} else if (commandMode === 'record-and-freeze') {
  const verification = read(path.join(out, 'current-input-bindings.json'));
  assert.equal(verification.status, 'pass');
  for (const ref of verification.bindings) assert.deepEqual(record(ref.path), {
    path: ref.path, bytes: ref.bytes, sha256: ref.sha256,
  }, `input changed since binding: ${ref.path}`);
  const nativeReviews = [];
  const nativeCommands = [];
  for (const a of assessment.figures) {
    const input = after.figures.find((f) => f.figure === a.figure);
    if (a.verdict !== 'PASS') {
      assert.equal(a.nativeReviewAuthorized, false);
      assert.equal(fs.existsSync(path.join(out, `${a.figure}.review.json`)), false);
      continue;
    }
    assert.equal(a.holdReasons.length, 0);
    assert.equal(a.nativeReviewAuthorized, true);
    const target = path.join(out, `${a.figure}.review.json`);
    assert.equal(fs.existsSync(target), false);
    const args = [
      '.agents/skills/ld-s10y-image/scripts/record_review.py',
      '--spec', input.candidate.spec.path,
      '--render', input.candidate.nativeRenderReport.path,
      '--output', target,
      '--status', 'pass',
      '--notes', a.nativeReviewNotes,
    ];
    const startedAt = new Date().toISOString();
    const result = spawnSync('python3', args, {
      cwd,
      env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
      encoding: 'utf8',
    });
    const commandReceipt = writeNew(`${a.figure}.record-review-command.json`, {
      schema: 'd200/native-review-command-receipt@1',
      command: ['python3', ...args],
      cwd,
      startedAt,
      finishedAt: new Date().toISOString(),
      exitCode: result.status,
      signal: result.signal,
      stdout: result.stdout,
      stderr: result.stderr,
      error: result.error?.message || null,
      firstInvocationForFigure: true,
      nativeCalls: 1,
      standaloneValidationReplay: false,
      internalRenderedStageValidation: true,
      writesRestrictedToReviewerOutput: true,
      bytecodeWritesDisabled: true,
    });
    nativeCommands.push(commandReceipt);
    assert.equal(result.status, 0, `native review failed; receipt preserved: ${commandReceipt.path}`);
    const review = read(target);
    assert.equal(review.schema, 'ld-s10y-image/review@1');
    assert.equal(review.status, 'pass');
    assert.equal(review.figure, a.figure);
    assert.equal(review.spec.sha256, input.candidate.spec.sha256);
    assert.equal(review.source.sha256, input.sourceImage.sha256);
    assert.equal(review.render.sha256, input.candidate.nativeRenderReport.sha256);
    assert.equal(review.outputs.svg.sha256, input.candidate.svg.sha256);
    nativeReviews.push(record(target));
  }
  for (const ref of verification.bindings) assert.equal(record(ref.path).sha256, ref.sha256);
  const report = {
    ...assessment,
    completedAt: new Date().toISOString(),
    inputFreeze: intake,
    currentInputBindings: record(path.join(out, 'current-input-bindings.json')),
    existingBilingualTextApproval: after.currentBilingualTextApproval,
    nativeReviewCommands: nativeCommands,
    nativeReviews,
    figures: assessment.figures.map((a) => ({
      ...a,
      source: after.figures.find((f) => f.figure === a.figure).sourceImage,
      candidate: after.figures.find((f) => f.figure === a.figure).candidate,
      nativeReview: nativeReviews.find((r) => path.basename(r.path) === `${a.figure}.review.json`) || null,
      counters: { ...a.counters, nativeRecordReviewCalls: a.verdict === 'PASS' ? 1 : 0 },
    })),
    counters: { ...assessment.counters, nativeRecordReviewCalls: nativeReviews.length },
    independentlyApprovedFigures: nativeReviews.map((r) => read(r.path).figure),
    heldFigures: assessment.figures.filter((a) => a.verdict === 'HOLD').map((a) => a.figure),
    reportScope: 'Offline figure review evidence only. No whole-course, canonical promotion, product acceptance, handoff or closure claim.',
  };
  const reportRef = writeNew('report.json', report);
  const outputs = [
    'observed-source-inventory.json',
    'review-assessment.json',
    'review-evidence.mjs',
    'fig-31-source-local-stroke.png',
    'current-input-bindings.json',
  ].map((name) => record(path.join(out, name)));
  outputs.push(...nativeCommands, ...nativeReviews, reportRef);
  const freezeRef = writeNew('review-freeze.json', {
    schema: 'd200/independent-figure-review-freeze@1',
    ticket: assessment.ticket,
    batch: assessment.batch,
    book: assessment.book,
    lesson: assessment.lesson,
    cwd,
    frozenAt: new Date().toISOString(),
    status: assessment.status,
    inputFreeze: intake,
    perFigureVerdicts: assessment.figures.map((a) => ({
      figure: a.figure, verdict: a.verdict, holdReasons: a.holdReasons,
      nativeReview: nativeReviews.find((r) => path.basename(r.path) === `${a.figure}.review.json`) || null,
    })),
    sourceInventory: record(assessment.sourceInventory.path),
    report: reportRef,
    inputs: verification.bindings,
    reviewerOutputs: outputs,
    currentInputCount: verification.bindings.length,
    everyCurrentInputHashMatchesBeforeAndAfterNativeReview: true,
    usedNativeReceiptsAndCandidates: verification.currentFigureReceiptChecks,
    existingTextApprovalReused: after.currentBilingualTextApproval,
    nativeReviews,
    nativeReviewCommands: nativeCommands,
    counters: report.counters,
    allExistingHoldsPreserved: true,
    scopeExclusions: assessment.scopeExclusions,
    selfHashPolicy: 'No recursive self binding. Actual report and freeze SHA256 are returned after both files are saved.',
  });
  console.log(JSON.stringify({ status: assessment.status, report: reportRef, freeze: freezeRef, nativeReviewCalls: nativeReviews.length }, null, 2));
} else {
  throw new Error('Expected bind or record-and-freeze.');
}

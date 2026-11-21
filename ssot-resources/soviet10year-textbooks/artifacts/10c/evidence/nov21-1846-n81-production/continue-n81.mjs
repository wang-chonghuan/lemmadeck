import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const base = path.join(root, '.tmp/stemrobin-184-six');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.relative(root, file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const write = (file, data) => fs.writeFileSync(file,
  JSON.stringify(data, null, 2) + '\n', { flag: 'wx' });
const match = (file, expected) => {
  const actual = bind(file);
  assert.equal(actual.sha256, expected.sha256);
  if (expected.bytes !== undefined) assert.equal(actual.bytes, expected.bytes);
  return actual;
};
const book = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/10c');
const evidenceRoot = path.join(book, 'evidence/nov21-1846-n81-production');
const retain = file => {
  assert(file.startsWith(base + path.sep));
  const target = path.join(evidenceRoot, path.relative(base, file));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  if (fs.existsSync(target)) {
    assert.equal(bind(target).sha256, bind(file).sha256);
  } else {
    fs.copyFileSync(file, target, fs.constants.COPYFILE_EXCL);
    fs.chmodSync(target, 0o444);
  }
  return bind(target);
};

if (process.argv[2] === 'intake-final13') {
  const dir = path.join(base, 'n81-fig13-minus-one-review');
  const manifestPath = path.join(dir, 'self-excluded-manifest.json');
  assert.equal(bind(manifestPath).sha256,
    'e5ac0fead001dbf52822153ebfb0cbd56c3a4df0b9bb36c084ae9f6af26582b5');
  const manifest = read(manifestPath);
  assert(manifest.visualVerdict.startsWith('PASS'));
  const owned = ['RESULT.md', 'comparison.json', 'comparison.execution.json',
    'usage-ledger.json'].map(name => {
    const file = path.join(dir, name);
    return match(file, manifest.owned.find(row => row.path === file));
  });
  const comparison = read(path.join(dir, 'comparison.json'));
  const execution = read(path.join(dir, 'comparison.execution.json'));
  assert.equal(execution.cwd, root);
  assert.equal(execution.exitCode, 0);
  const candidates = comparison.bindings.filter(row =>
    /n81-fig13-y-label-recovery\/(?:spec\.json|render\.json|fig-13\.svg)$/.test(row.path))
    .map(row => match(row.path, row));
  const receipts = comparison.existingExecutions.map(row => {
    match(row.receipt.path, row.receipt);
    const actual = read(row.receipt.path);
    assert.equal(actual.cwd, root);
    assert.equal(actual.exitCode, 0);
    match(path.resolve(root, actual.stdout.path), actual.stdout);
    match(path.resolve(root, actual.stderr.path), actual.stderr);
    return { receipt: bind(row.receipt.path), exitCode: 0 };
  });
  const out = path.join(base, 'n81-fig13-final-intake.json');
  write(out, { status: 'FIG13_CURRENT_CAPTURED_PASS',
    at: new Date().toISOString(), agent: '01a1fe9c-21af-74c1-bbdc-3d155726d5cd',
    manifest: bind(manifestPath), owned, candidates, receipts, execution,
    verdicts: { 'fig-13': 'PASS' },
    findings: 'Readable -1 separated from solid trough/axis/tick and clearly tied to y=-1; no second scale. Prior accepted O/pi3 and source/math PASS reused unchanged.',
    views: 3, sourceMathProofReplays: 0, parentViewsOrDecodes: 0,
    originalFailuresPreserved: true, sourceOriginCodepoint: 'O/0 UNKNOWN',
    wholeLessonAcceptance: false, actualClosure: 'PENDING_TOOL_CALL' });
  console.log(JSON.stringify({ intake: bind(out), verdicts: read(out).verdicts }));
} else if (process.argv[2] === 'intake-origin') {
  const dir = path.join(base, 'n81-origin-review');
  const manifestPath = path.join(dir, 'self-excluded-manifest.json');
  assert.equal(bind(manifestPath).sha256,
    '1360ec887bdee98099514daf7915813ec6bc413bcd64589a5ee93a457a9f06dd');
  const manifest = read(manifestPath);
  const owned = ['affected-review.md', 'source13-freeze.md', 'evidence-bindings.json']
    .map(name => {
      const file = path.join(dir, name);
      return match(file, manifest.entries.find(row => row.path === path.relative(root, file)));
    });
  const evidence = read(path.join(dir, 'evidence-bindings.json'));
  assert.deepEqual(evidence.verdicts, {
    'fig-12': 'PASS', 'fig-13': 'FAIL', 'fig-14': 'PASS', 'fig-15': 'PASS', 'fig-16': 'PASS',
  });
  assert.equal(evidence.imageLimits.totalActualViews, 8);
  const candidateBindings = evidence.rawBindings.filter(row =>
    /n81-origin-repair\/fig-\d+\/(spec\.json|render\.json|fig-\d+\.svg)$/.test(row.path))
    .map(row => match(path.resolve(root, row.path), row));
  const executions = evidence.actualExecutions.map(row => {
    const file = path.resolve(root, row.path);
    match(file, { sha256: row.hash });
    const actual = read(file);
    assert.equal(actual.cwd, root);
    assert.equal(actual.exitCode, 0);
    match(path.resolve(root, actual.stdout.path), actual.stdout);
    match(path.resolve(root, actual.stderr.path), actual.stderr);
    return { receipt: bind(file), cwd: actual.cwd, command: actual.command,
      argv: actual.argv, exitCode: actual.exitCode };
  });
  const out = path.join(base, 'n81-origin-review-intake.json');
  write(out, { status: 'FOUR_AFFECTED_PASSES_FIG13_VISUAL_FAIL_PRESERVED',
    at: new Date().toISOString(), agent: '01a1fe7c-b360-7570-b1cb-d5102169c8c7',
    manifest: bind(manifestPath), owned, candidateBindings, executions,
    verdicts: evidence.verdicts, sourceFreeze: evidence.stage1Freeze,
    fig13MathSourceProvenancePassed: true,
    fig13Defects: ['Painted dashed stroke crowds O.', 'Solid stroke crosses pi/3 text.'],
    sourceOriginCodepoint: 'O/0 UNKNOWN; modern O is explicitly editorial.',
    actualViews: 8, reopensCropsDecodes: 0, parentViewsOrDecodes: 0,
    previousFailuresPreserved: true, wholeLessonAcceptance: false,
    actualClosure: 'PENDING_TOOL_CALL' });
  console.log(JSON.stringify({ intake: bind(out), verdicts: evidence.verdicts }));
} else if (process.argv[2] === 'intake-two-origins') {
  const dir = path.join(base, 'n81-two-origin-affected-review');
  const manifestPath = path.join(dir, 'self-excluded-manifest.json');
  const manifest = read(manifestPath);
  const owned = ['RESULT.md', 'comparison.json', 'comparison.execution.json',
    'comparison-first-failure.receipt.json', 'usage-ledger.json'].map(name => {
    const file = path.join(dir, name);
    return match(file, manifest.ownedOutputs.find(row => row.path === file));
  });
  assert.equal(manifest.actualViews, 6);
  assert(manifest.verdicts['fig-13'].startsWith('FAIL:'));
  assert(manifest.verdicts['fig-17'].startsWith('PASS'));
  const comparison = read(path.join(dir, 'comparison.json'));
  const execution = read(path.join(dir, 'comparison.execution.json'));
  assert.equal(execution.cwd, root);
  assert.equal(execution.exitCode, 0);
  const candidates = comparison.bindings.filter(row =>
    /n81-fig(?:13|17)-label-recovery\/(?:spec\.json|render\.json|fig-\d+\.svg)$/.test(row.path))
    .map(row => match(row.path, row));
  const receipts = comparison.existingExecutions.map(row => {
    match(row.receipt.path, row.receipt);
    const actual = read(row.receipt.path);
    assert.equal(actual.cwd, root);
    assert.equal(actual.exitCode, 0);
    match(path.resolve(root, actual.stdout.path), actual.stdout);
    match(path.resolve(root, actual.stderr.path), actual.stderr);
    return { receipt: bind(row.receipt.path), exitCode: 0 };
  });
  const out = path.join(base, 'n81-two-origin-review-intake.json');
  write(out, { status: 'FIG17_PASS_FIG13_RESIDUAL_MINUS_ONE_VISUAL_FAIL',
    at: new Date().toISOString(), agent: '01a1fe93-b8dd-7c42-9c41-a70682c6b204',
    manifest: bind(manifestPath), owned, candidates, receipts, execution,
    verdicts: { 'fig-13': 'FAIL', 'fig-17': 'PASS' },
    fig13OPi3Display: 'PASS; reuse without further alteration.',
    fig13ResidualDefect: 'Unchanged -1 digit upper/right portion joins the solid trough.',
    scienceSourceReuse: 'PASS for both; no new proof or source view.',
    views: 6, parentViewsOrDecodes: 0, oldFailuresPreserved: true,
    wholeLessonAcceptance: false, actualClosure: 'PENDING_TOOL_CALL' });
  console.log(JSON.stringify({ intake: bind(out), verdicts: read(out).verdicts }));
} else if (process.argv[2] === 'intake-second') {
  const dir = path.join(base, 'n81-second-figure-review');
  const manifestPath = path.join(dir, 'manifest.json');
  assert.equal(bind(manifestPath).sha256,
    '7f424cf3eed4437836e888d6d1a29f849419ce2c0f0b58811ffcf948d515f431');
  const manifest = read(manifestPath);
  const owned = ['RESULT.md', 'source-freeze.md', 'geometry-evidence.json',
    'usage-ledger.json', 'inspection.execution.json', 'inspection-first-failure.receipt.json']
    .map(name => {
      const file = path.join(dir, name);
      return match(file, manifest.files.find(row => row.path === file));
    });
  const geometry = read(path.join(dir, 'geometry-evidence.json'));
  const execution = read(path.join(dir, 'inspection.execution.json'));
  assert.equal(execution.cwd, root);
  assert.equal(execution.exitCode, 0);
  const ledger = read(path.join(dir, 'usage-ledger.json'));
  assert.equal(ledger.batchImages, 8);
  const candidates = geometry.figures.map(row => ({
    figure: row.figure, spec: match(row.spec.path, row.spec),
    svg: match(row.svg.path, row.svg), render: match(row.render.path, row.render),
  }));
  const existingReceipts = geometry.existingExecutionReceiptsChecked.map(row => {
    const file = row.binding.path;
    match(file, row.binding);
    const actual = read(file);
    assert.equal(actual.cwd, root);
    assert.equal(actual.exitCode, row.record.exitCode);
    match(path.resolve(root, actual.stdout.path), actual.stdout);
    match(path.resolve(root, actual.stderr.path), actual.stderr);
    return { receipt: bind(file), exitCode: actual.exitCode };
  });
  const out = path.join(base, 'n81-second-figure-review-intake.json');
  write(out, { status: 'THREE_PASSES_FIG17_VISUAL_FAIL_PRESERVED',
    at: new Date().toISOString(), agent: '01a1fe87-5f2b-78c0-94bd-51a3da92e4ff',
    manifest: bind(manifestPath), owned, candidates, existingReceipts, execution,
    verdicts: { 'fig-17': 'FAIL', 'fig-18': 'PASS', 'fig-19': 'PASS', 'fig-20': 'PASS' },
    fig17MathSourcePassed: true, fig17VisualDefect: geometry.figure17OriginCollision,
    views: 8, reopensCropsDecodes: 0, parentViewsOrDecodes: 0,
    reviewerScriptFirstExit1Preserved: true, wholeLessonAcceptance: false,
    actualClosure: 'PENDING_TOOL_CALL' });
  console.log(JSON.stringify({ intake: bind(out), verdicts: read(out).verdicts }));
} else if (process.argv[2] === 'intake-science2') {
  const dir = path.join(base, 'n81-cold-science');
  const manifestPath = path.join(dir, 'stage2-manifest.json');
  assert.equal(bind(manifestPath).sha256,
    '56338604f0d9ef2a658a1ae32d7ee006c5c2269b2f576bbae35c0a081a2bd2ed');
  const manifest = read(manifestPath);
  const files = ['stage2-report.md', 'stage2-comparison.json', 'stage2-mechanical-receipt.json']
    .map(name => {
      const file = path.join(dir, name);
      return match(file, manifest.files.find(row => row.path === path.relative(root, file)));
    });
  const comparison = read(path.join(dir, 'stage2-comparison.json'));
  assert.equal(comparison.summary.semantic_pass, 9);
  assert.equal(comparison.summary.response_units_pass, 9);
  assert.equal(comparison.summary.semantic_fail, 0);
  const receipt = read(path.join(dir, 'stage2-mechanical-receipt.json'));
  assert.equal(receipt.cwd, root);
  assert.equal(receipt.exit_code, 0);
  assert.equal(receipt.execution_count, 1);
  assert.equal(receipt.stderr, '');
  assert.equal(bind(path.join(base, 'n81-answer-draft.json')).sha256,
    'ac985aed5b846317b4a2489db22375919b30c2418359624f89e5c688907c3fe7');
  const out = path.join(base, 'n81-science-stage2-intake.json');
  write(out, { status: 'EXACT_NINE_ANSWERS_AND_RESPONSE_UNITS_PASS',
    at: new Date().toISOString(), agent: '01a1fe78-0c25-7001-9527-9c8ef6f77860',
    manifest: bind(manifestPath), files, summary: comparison.summary,
    actualExecution: receipt, draft: bind(path.join(base, 'n81-answer-draft.json')),
    sourceLimitations: comparison.retained_limitations_and_holds,
    fig67Order: 'Exact equivalent point map, not operation-count equality.',
    grading: 'Eight ungraded chains; exercise68 final-expression auto only.',
    images: 0, sourceProofReplays: 0, runtimeCertification: false,
    finalizerExecuted: false, actualClosure: 'PENDING_TOOL_CALL' });
  console.log(JSON.stringify({ intake: bind(out), summary: comparison.summary }));
} else if (process.argv[2] === 'closure') {
  const [name, agent, previousStatus] = process.argv.slice(3);
  assert(['origin-review', 'science-stage2', 'second-figure-review', 'fig13-review',
    'two-origin-review'].includes(name));
  const out = path.join(base, `n81-${name}-closure.json`);
  write(out, { status: 'ACTUAL_CLOSE_AGENT_COMPLETED', agent, previousStatus,
    at: new Date().toISOString(), afterIntake: true, parentViewsOrDecodes: 0 });
  console.log(JSON.stringify({ closure: bind(out) }));
} else if (process.argv[2] === 'prepare-modern-finalize') {
  const finalDir = path.join(book, 'editions/modern-us-neutral/figures');
  for (const n of [12, 13, 14, 15, 16, 17, 18, 19, 20]) {
    const review = read(path.join(finalDir, `fig-${n}.review.json`));
    assert.equal(review.status, 'pass');
    match(path.resolve(root, review.spec.path), review.spec);
    match(path.resolve(root, review.render.path), review.render);
    match(path.resolve(root, review.outputs.svg.path), review.outputs.svg);
  }
  const lessonDir = path.join(book, 'editions/modern-us-neutral/lessons/ana10-c6-s2-n81');
  const snapshot = path.join(base, 'n81-before-modern');
  fs.mkdirSync(snapshot);
  const before = [];
  for (const name of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']) {
    const source = path.join(lessonDir, name);
    if (!fs.existsSync(source)) continue;
    const target = path.join(snapshot, name);
    fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL);
    before.push({ source: bind(source), retained: retain(target) });
  }
  const template = path.join(base,
    'n81-n82-work/adapt/10c/modern-us-neutral/lessons/ana10-c6-s2-n81/figures.template.json');
  fs.copyFileSync(template, template + '.before-reviewed-outputs', fs.constants.COPYFILE_EXCL);
  const figures = read(template);
  for (const figure of figures.figures) {
    figure.svg = `figures/${figure.id}.svg`;
    figure.render = `figures/${figure.id}.render.json`;
    figure.review = `figures/${figure.id}.review.json`;
    for (const key of ['png', 'artwork', 'generation']) delete figure[key];
  }
  fs.writeFileSync(template, JSON.stringify(figures, null, 2) + '\n');
  const out = path.join(base, 'n81-modern-finalize-inputs.json');
  write(out, { status: 'ALL_NINE_REVIEWED_OUTPUT_CONTRACTS_FIRST_FINALIZER_PENDING',
    before, figureTemplate: bind(template), figureModes: 'deterministic only',
    approvedTextImport: bind(path.join(base, 'n81-n82-approved-text-import.json')),
    sourceNotationHoldPreserved: true, n82Excluded: true, replays: 0 });
  retain(out);
  console.log(JSON.stringify({ inputs: bind(out) }));
} else if (process.argv[2] === 'prepare-answer-finalize') {
  assert.equal(read(path.join(base, 'n81-science-stage2-intake.json')).status,
    'EXACT_NINE_ANSWERS_AND_RESPONSE_UNITS_PASS');
  assert.equal(read(path.join(base, 'n81-science-stage2-closure.json')).status,
    'ACTUAL_CLOSE_AGENT_COMPLETED');
  const source = path.join(book, 'editions/modern-us-neutral/lessons/ana10-c6-s2-n81/exercises.json');
  assert(read(source).exercises.every(row => row.figure_refs.length === 0));
  const target = path.join(base,
    'n81-answer-work/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-s2-n81');
  fs.mkdirSync(target, { recursive: true });
  fs.copyFileSync(source, path.join(target, 'exercises.json'), fs.constants.COPYFILE_EXCL);
  const draft = path.join(base, 'n81-answer-draft.json');
  assert.equal(bind(draft).sha256,
    'ac985aed5b846317b4a2489db22375919b30c2418359624f89e5c688907c3fe7');
  fs.copyFileSync(draft, path.join(target, 'answer-keys.json'), fs.constants.COPYFILE_EXCL);
  const out = path.join(base, 'n81-answer-work/input-manifest.json');
  write(out, { status: 'EXACT_APPROVED_ANSWERS_READY_FOR_FIRST_FINALIZER',
    inputs: [bind(source), bind(draft)], target,
    exerciseFigures: 0, modernLessonFinalization: false, sourceNotationResolution: false });
  console.log(JSON.stringify({ input: bind(out), target }));
} else if (process.argv[2] === 'prepare-interactions') {
  const target = path.join(base,
    'n81-answer-work/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-s2-n81');
  assert.equal(read(path.join(target, 'answer-keys.json')).status, 'ready');
  const template = path.join(base,
    'n81-n82-work/adapt/10c/modern-us-neutral/lessons/ana10-c6-s2-n81/figures.template.json');
  fs.copyFileSync(template, path.join(target, 'figures.json'), fs.constants.COPYFILE_EXCL);
  const out = path.join(base, 'n81-answer-work/interactions-inputs.json');
  write(out, { status: 'APPROVED_ANSWERS_NO_EXERCISE_FIGURES_FIRST_INTERACTIONS_PENDING',
    answers: bind(path.join(target, 'answer-keys.json')),
    exercises: bind(path.join(target, 'exercises.json')),
    figures: bind(path.join(target, 'figures.json')),
    sourceFigureTemplate: bind(template), figuresRemainDraftUnapproved: true,
    figureDependentWidgets: 0 });
  console.log(JSON.stringify({ input: bind(out) }));
} else if (['promote-origin4', 'promote-second3', 'promote17', 'promote13'].includes(process.argv[2])) {
  const second = process.argv[2] === 'promote-second3';
  const final13 = process.argv[2] === 'promote13';
  const affected = process.argv[2] === 'promote17' || final13;
  const intakePath = path.join(base, final13 ? 'n81-fig13-final-intake.json'
    : affected ? 'n81-two-origin-review-intake.json' : second
    ? 'n81-second-figure-review-intake.json' : 'n81-origin-review-intake.json');
  const intake = read(intakePath);
  assert.equal(read(path.join(base, final13 ? 'n81-fig13-review-closure.json'
    : affected ? 'n81-two-origin-review-closure.json' : second
    ? 'n81-second-figure-review-closure.json' : 'n81-origin-review-closure.json')).status,
    'ACTUAL_CLOSE_AGENT_COMPLETED');
  const reviewEvidence = (final13 ? [
    'n81-fig13-minus-one-review/RESULT.md', 'n81-fig13-minus-one-review/comparison.json',
    'n81-fig13-minus-one-review/comparison.execution.json',
    'n81-fig13-minus-one-review/usage-ledger.json',
    'n81-fig13-minus-one-review/self-excluded-manifest.json',
    'n81-fig13-minus-one-review/compare.py',
    'n81-fig13-final-intake.json', 'n81-fig13-review-closure.json',
  ] : affected ? [
    'n81-two-origin-affected-review/RESULT.md', 'n81-two-origin-affected-review/comparison.json',
    'n81-two-origin-affected-review/comparison.execution.json',
    'n81-two-origin-affected-review/comparison-first-failure.receipt.json',
    'n81-two-origin-affected-review/usage-ledger.json',
    'n81-two-origin-affected-review/self-excluded-manifest.json',
    'n81-two-origin-affected-review/compare.py',
    'n81-two-origin-review-intake.json', 'n81-two-origin-review-closure.json',
  ] : second ? [
    'n81-second-figure-review/RESULT.md', 'n81-second-figure-review/source-freeze.md',
    'n81-second-figure-review/geometry-evidence.json', 'n81-second-figure-review/manifest.json',
    'n81-second-figure-review/usage-ledger.json', 'n81-second-figure-review/inspection.execution.json',
    'n81-second-figure-review/inspection-first-failure.receipt.json',
    'n81-second-figure-review/inspect-output.py',
    'n81-second-figure-review-intake.json', 'n81-second-figure-review-closure.json',
  ] : [
    'n81-origin-review/affected-review.md', 'n81-origin-review/source13-freeze.md',
    'n81-origin-review/evidence-bindings.json', 'n81-origin-review/self-excluded-manifest.json',
    'n81-origin-review-intake.json', 'n81-origin-review-closure.json',
  ]).map(name => retain(path.join(base, name)));
  const rows = [];
  const finalDir = path.join(book, 'editions/modern-us-neutral/figures');
  fs.mkdirSync(finalDir, { recursive: true });
  for (const n of final13 ? [13] : affected ? [17] : second ? [18, 19, 20] : [12, 14, 15, 16]) {
    const id = `fig-${n}`;
    assert.equal(intake.verdicts[id], 'PASS');
    const candidateDir = final13 ? path.join(base, 'n81-fig13-y-label-recovery')
      : affected ? path.join(base, 'n81-fig17-label-recovery') : second
      ? path.join(base, 'n81-second-render', id, ...(n === 20 ? ['label-recovery'] : []))
      : path.join(base, 'n81-origin-repair', id);
    const candidateSpec = path.join(candidateDir, 'spec.json');
    const candidateSvg = path.join(candidateDir, `${id}.svg`);
    const originalRender = path.join(candidateDir, 'render.json');
    for (const file of [candidateSpec, candidateSvg, originalRender]) {
      const expected = second
        ? Object.values(intake.candidates.find(row => row.figure === id))
          .find(row => row?.path === path.relative(root, file))
        : (affected ? intake.candidates : intake.candidateBindings)
          .find(row => row.path === path.relative(root, file));
      match(file, expected);
    }
    const report = read(originalRender);
    assert.equal(report.status, 'pass');
    const spec = path.join(finalDir, `${id}.spec.json`);
    const svg = path.join(finalDir, `${id}.svg`);
    const render = path.join(finalDir, `${id}.render.json`);
    fs.copyFileSync(candidateSpec, spec, fs.constants.COPYFILE_EXCL);
    fs.copyFileSync(candidateSvg, svg, fs.constants.COPYFILE_EXCL);
    const metadata = structuredClone(report);
    metadata.spec.path = path.relative(root, spec);
    metadata.output.svg.path = path.relative(root, svg);
    write(render, metadata);
    assert.equal(metadata.spec.sha256, bind(spec).sha256);
    assert.equal(metadata.output.svg.sha256, bind(svg).sha256);
    assert(!fs.readFileSync(spec, 'utf8').includes('.tmp/'));
    const renderName = final13 ? 'fig13-minus-one-clearance-render'
      : affected ? 'fig17-origin-clearance-render'
      : second ? (n === 20 ? 'fig20-label-recovery-render' : `fig${n}-first-new-render`)
      : `fig${n}-origin-render`;
    const history = [
      retain(originalRender),
      ...(fs.existsSync(path.join(candidateDir, 'changes.json'))
        ? [retain(path.join(candidateDir, 'changes.json'))] : []),
      ...['receipt.json', 'stdout.txt', 'stderr.txt'].map(ext =>
        retain(path.join(base, 'n81-n82-stages', `${renderName}.${ext}`))),
    ];
    if (second && n === 20) {
      for (const name of ['spec.json', 'fig-20.svg', 'render.json'])
        history.push(retain(path.join(base, 'n81-second-render/fig-20', name)));
      for (const ext of ['receipt.json', 'stdout.txt', 'stderr.txt'])
        history.push(retain(path.join(base, 'n81-n82-stages', `fig20-first-new-render.${ext}`)));
    }
    if (final13) {
      for (const previous of ['n81-origin-repair/fig-13', 'n81-fig13-label-recovery'])
        for (const name of ['spec.json', 'fig-13.svg', 'render.json', 'changes.json'])
          history.push(retain(path.join(base, previous, name)));
      for (const name of ['native640.png', 'surface-1440.png', 'surface-390.png', 'display-evidence.json'])
        history.push(retain(path.join(candidateDir, name)));
      for (const stage of ['fig13-origin-render', 'fig13-two-label-recovery-render',
        'fig13-recovery-draft-offline-render', 'fig13-recovery-headed-capture',
        'fig13-minus-one-draft-offline-render', 'fig13-minus-one-headed-capture'])
        for (const ext of ['receipt.json', 'stdout.txt', 'stderr.txt'])
          history.push(retain(path.join(base, 'n81-n82-stages', `${stage}.${ext}`)));
    } else if (affected) {
      for (const previous of ['n81-second-render/fig-17', 'n81-second-render/fig-17/label-recovery'])
        for (const name of ['spec.json', 'fig-17.svg', 'render.json'])
          history.push(retain(path.join(base, previous, name)));
      for (const name of ['native640.png', 'surface-1440.png', 'surface-390.png', 'display-evidence.json'])
        history.push(retain(path.join(candidateDir, name)));
      for (const stage of ['fig17-first-new-render', 'fig17-label-recovery-render',
        'fig17-recovery-draft-offline-render', 'fig17-recovery-headed-capture'])
        for (const ext of ['receipt.json', 'stdout.txt', 'stderr.txt'])
          history.push(retain(path.join(base, 'n81-n82-stages', `${stage}.${ext}`)));
    }
    rows.push({ figure: id, spec: bind(spec), svg: bind(svg), render: bind(render),
      originalSpec: bind(candidateSpec), originalSvg: bind(candidateSvg),
      history, independentReview: reviewEvidence[0],
      onlyRenderMetadataPathsRelocated: true, renderReplays: 0,
      reviewRecordPending: true });
  }
  const out = path.join(base, final13 ? 'n81-fig13-promotion.json' : affected ? 'n81-fig17-promotion.json'
    : second ? 'n81-second3-promotion.json' : 'n81-origin4-promotion.json');
  write(out, { status: 'APPROVED_ASSETS_RETAINED_REVIEW_RECORD_PENDING',
    rows, reviewEvidence, parentViewsOrDecodes: 0, wholeLessonComplete: false });
  retain(out);
  console.log(JSON.stringify({ promotion: bind(out), figures: rows.map(row => row.figure) }));
} else if (process.argv[2] === 'promote-answers') {
  const target = path.join(book, 'editions/modern-us-neutral/lessons/ana10-c6-s2-n81');
  const source = path.join(base,
    'n81-answer-work/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-s2-n81');
  const actual = read(path.join(source, 'answer-keys.json'));
  const draft = read(path.join(base, 'n81-answer-draft.json'));
  assert.equal(actual.status, 'ready');
  assert.deepEqual(actual.answers, draft.answers);
  assert.equal(read(path.join(source, 'interactions.json')).status, 'ready');
  const files = ['answer-keys.json', 'answer-keys.audit.json', 'interactions.json'].map(name => {
    fs.copyFileSync(path.join(source, name), path.join(target, name), fs.constants.COPYFILE_EXCL);
    return bind(path.join(target, name));
  });
  const history = [
    'n81-cold-science/source-solutions.json', 'n81-cold-science/findings.md',
    'n81-cold-science/mechanical-receipt.json', 'n81-cold-science/access-receipt.json',
    'n81-cold-science/manifest.json', 'n81-cold-science/stage2-report.md',
    'n81-cold-science/stage2-comparison.json', 'n81-cold-science/stage2-mechanical-receipt.json',
    'n81-cold-science/stage2-manifest.json', 'n81-cold-science-intake.json',
    'n81-science-stage2-intake.json', 'n81-science-stage2-closure.json',
    'n81-answer-draft.json', 'n81-answer-draft-release.json',
    'n81-answer-work/input-manifest.json', 'n81-answer-work/interactions-inputs.json',
  ].map(name => retain(path.join(base, name)));
  for (const stage of ['n81-first-answer-finalizer', 'n81-first-interactions-prepare',
    'n81-first-interactions-finalize']) {
    const receipt = path.join(base, 'n81-n82-stages', `${stage}.receipt.json`);
    assert.equal(read(receipt).exitCode, 0);
    for (const ext of ['receipt.json', 'stdout.txt', 'stderr.txt'])
      history.push(retain(path.join(base, 'n81-n82-stages', `${stage}.${ext}`)));
  }
  const out = path.join(base, 'n81-answers-promotion.json');
  write(out, { status: 'NINE_APPROVED_ANSWERS_AND_INTERACTIONS_RETAINED',
    files, history, mathAnswersUnchangedFromReviewedDraft: true,
    grading: { ungraded: 8, expressionAuto: 1 }, widgets: { free: 8, math: 1 },
    finalizerReplays: 0, sourceNotationHoldPreserved: true, modernLessonCompletion: false,
    parentViewsOrDecodes: 0, dbOrPublication: 0 });
  retain(out);
  console.log(JSON.stringify({ promotion: bind(out) }));
} else if (process.argv[2] === 'checkpoint') {
  const file = path.join(root, '.intentfold/tickets/STEMROBIN-184/usage.json');
  const usage = read(file);
  const current = usage.nov21_1846_n81_n82_resume;
  current.status = process.argv[3];
  current.at = new Date().toISOString();
  current.originReviewer = {
    ...current.originReviewer, status: 'INTAKEN_ACTUAL_CLOSED',
    intake: bind(path.join(base, 'n81-origin-review-intake.json')),
    closure: bind(path.join(base, 'n81-origin-review-closure.json')),
    actualUsage: 8, verdicts: read(path.join(base, 'n81-origin-review-intake.json')).verdicts,
  };
  current.zeroImageScience = {
    ...current.zeroImageScience, status: 'EXACT_NINE_DRAFTS_PASS_ACTUAL_CLOSED',
    stage2Intake: bind(path.join(base, 'n81-science-stage2-intake.json')),
    closure: bind(path.join(base, 'n81-science-stage2-closure.json')),
    sourceNotationHold: 'Literal k=1/A remains unresolved; no erratum invented.',
  };
  const secondIntake = path.join(base, 'n81-second-figure-review-intake.json');
  const secondClosure = path.join(base, 'n81-second-figure-review-closure.json');
  current.secondReviewer = {
    id: '01a1fe87-5f2b-78c0-94bd-51a3da92e4ff', actualForkContext: false,
    scope: bind(path.join(base, 'n81-second-figure-review-scope.md')),
    maxViews: 8, status: fs.existsSync(secondClosure) ? 'INTAKEN_ACTUAL_CLOSED' : 'ACTIVE',
    ...(fs.existsSync(secondIntake) ? { intake: bind(secondIntake) } : {}),
    ...(fs.existsSync(secondClosure) ? { closure: bind(secondClosure) } : {}),
    ...(fs.existsSync(secondIntake) ? { verdicts: read(secondIntake).verdicts } : {}),
  };
  const recovery = path.join(base, 'n81-fig13-label-recovery');
  current.fig13Recovery = {
    changes: bind(path.join(recovery, 'changes.json')),
    spec: bind(path.join(recovery, 'spec.json')),
    render: bind(path.join(recovery, 'render.json')),
    originalVisualFailPreserved: true, affectedVisualApproval: false,
    ...(fs.existsSync(path.join(recovery, 'display-evidence.json'))
      ? { display: bind(path.join(recovery, 'display-evidence.json')) } : {}),
  };
  current.unviewedDisplayCaptures = fs.existsSync(path.join(base, 'n81-fig17-label-recovery/display-evidence.json'))
    ? 17 : fs.existsSync(path.join(recovery, 'display-evidence.json')) ? 14 : 11;
  if (fs.existsSync(path.join(base, 'n81-two-origin-affected-review-scope.md'))) {
    const closed = path.join(base, 'n81-two-origin-review-closure.json');
    current.twoOriginReviewer = {
      id: '01a1fe93-b8dd-7c42-9c41-a70682c6b204', actualForkContext: false,
      scope: bind(path.join(base, 'n81-two-origin-affected-review-scope.md')),
      maxViews: 6, status: fs.existsSync(closed) ? 'INTAKEN_ACTUAL_CLOSED' : 'ACTIVE',
      sourceMathPassReused: true,
      ...(fs.existsSync(closed) ? {
        intake: bind(path.join(base, 'n81-two-origin-review-intake.json')),
        closure: bind(closed), actualViews: 6,
        verdicts: read(path.join(base, 'n81-two-origin-review-intake.json')).verdicts,
      } : {}),
    };
  }
  current.promotions = ['n81-origin4-promotion.json', 'n81-second3-promotion.json',
    'n81-fig17-promotion.json', 'n81-fig13-promotion.json', 'n81-answers-promotion.json']
    .filter(name => fs.existsSync(path.join(base, name)))
    .map(name => bind(path.join(base, name)));
  current.durableReviewedFigures = [12, 13, 14, 15, 16, 17, 18, 19, 20].filter(n =>
    fs.existsSync(path.join(book, `editions/modern-us-neutral/figures/fig-${n}.review.json`)));
  if (fs.existsSync(path.join(base, 'n81-fig13-y-label-recovery/display-evidence.json'))) {
    const dir = path.join(base, 'n81-fig13-y-label-recovery');
    current.fig13MinusOneRecovery = {
      spec: bind(path.join(dir, 'spec.json')), render: bind(path.join(dir, 'render.json')),
      changes: bind(path.join(dir, 'changes.json')), display: bind(path.join(dir, 'display-evidence.json')),
      approval: fs.existsSync(path.join(book, 'editions/modern-us-neutral/figures/fig-13.review.json')),
      oldOPi3DisplayPassReused: true, originalFailuresPreserved: true,
    };
    current.minusOneReviewer = {
      id: '01a1fe9c-21af-74c1-bbdc-3d155726d5cd', actualForkContext: false,
      status: fs.existsSync(path.join(base, 'n81-fig13-review-closure.json'))
        ? 'INTAKEN_ACTUAL_CLOSED' : 'ACTIVE',
      scope: bind(path.join(base, 'n81-fig13-minus-one-review-scope.md')), maxViews: 3,
      ...(fs.existsSync(path.join(base, 'n81-fig13-review-closure.json')) ? {
        intake: bind(path.join(base, 'n81-fig13-final-intake.json')),
        closure: bind(path.join(base, 'n81-fig13-review-closure.json')),
        actualViews: 3, verdict: 'PASS',
      } : {}),
    };
    current.unviewedDisplayCaptures = 20;
  }
  if (fs.existsSync(path.join(base, 'n81-answers-promotion.json'))) {
    current.answerFinalizer = { firstExit: 0, replays: 0, answers: 9, ungraded: 8, expressionAuto: 1,
      interactionsReady: true, widgets: { free: 8, math: 1 }, sourceNotationHoldPreserved: true,
      runtimeExpressionEquivalenceOrLiveProductCertification: false,
      receipt: bind(path.join(base, 'n81-n82-stages/n81-first-answer-finalizer.receipt.json')) };
  }
  const modernReceipt = path.join(base, 'n81-n82-stages/n81-first-modern-finalizer.receipt.json');
  if (fs.existsSync(modernReceipt)) {
    current.modernFinalizer = {
      receipt: bind(modernReceipt), firstExit: read(modernReceipt).exitCode,
      replays: 0, n82Excluded: true, completedLesson: false,
    };
  }
  const seed = path.join(base, 'n81-choice-source/seed.json');
  if (fs.existsSync(seed)) {
    current.choices = {
      seed: bind(seed), definitionBlocks: [5, 12], selectedExercises: 9,
      requiredGroupProjectionLimitationPreserved: true, views: 0,
      author: { id: '01a1fea2-55f6-70c1-bb9e-e5b61122fac8',
        actualForkContext: false,
        status: fs.existsSync(path.join(base, 'n81-choice-author-closure.json'))
          ? 'INTAKEN_ACTUAL_CLOSED' : 'ACTIVE',
        ...(fs.existsSync(path.join(base, 'n81-choice-author-intake.json')) ? {
          intake: bind(path.join(base, 'n81-choice-author-intake.json')),
        } : {}),
        ...(fs.existsSync(path.join(base, 'n81-choice-author-closure.json')) ? {
          closure: bind(path.join(base, 'n81-choice-author-closure.json')),
        } : {}),
        scope: bind(path.join(base, 'n81-choice-author-scope.md')) },
      reviewer: { id: '01a1fea2-ff64-7433-963a-30d891eb8a47',
        actualForkContext: false,
        status: fs.existsSync(path.join(base, 'n81-choice-review-closure.json'))
          ? 'INTAKEN_ACTUAL_CLOSED'
          : fs.existsSync(path.join(base, 'n81-choice-stage2-intake.json'))
          ? 'STAGE3_KEY_COMPARISON_ACTIVE'
          : fs.existsSync(path.join(base, 'n81-choice-view-release.json'))
          ? 'STAGE2_VISIBLE_REVIEW_ACTIVE' : 'STAGE1_SOURCE_FREEZE_ACTIVE',
        stages: [1, 2, 3].map(n => path.join(base, `n81-choice-stage${n}-intake.json`))
          .filter(file => fs.existsSync(file)).map(bind),
        ...(fs.existsSync(path.join(base, 'n81-choice-review-closure.json')) ? {
          closure: bind(path.join(base, 'n81-choice-review-closure.json')),
        } : {}),
        scope: bind(path.join(base, 'n81-choice-review-scope.md')) },
      semanticApproval: fs.existsSync(path.join(base, 'n81-choice-stage3-intake.json'))
        && read(path.join(base, 'n81-choice-stage3-intake.json')).outcome === 'pass',
      retained: fs.existsSync(path.join(book,
        'editions/modern-us-neutral/lessons/ana10-c6-s2-n81/choice-set/review.json')),
    };
  }
  const renderRecovery = path.join(base,
    'n81-n82-stages/n81-final-offline-render-argument-recovery.receipt.json');
  if (fs.existsSync(renderRecovery)) {
    current.finalOfflineRender = {
      originalArgumentFailure: bind(path.join(base,
        'n81-n82-stages/n81-first-final-offline-render.receipt.json')),
      recovery: bind(renderRecovery), recoveryExit: read(renderRecovery).exitCode,
      passedProducerReplays: 0, finalAcceptance: false,
    };
  }
  const finalNative = path.join(base,
    'n81-final-preview/ana10-c6-s2-n81/browser-evidence.json');
  if (fs.existsSync(finalNative)) {
    const native = read(finalNative);
    const intake = path.join(base, 'n81-final-visual-intake.json');
    const closure = path.join(base, 'n81-final-visual-review-closure.json');
    current.finalOffline = {
      evidence: bind(finalNative), status: native.status,
      captures: native.captures.length, nativeClicks: native.nativeClicks,
      browserClosed: native.browserClosed,
      reviewer: { id: '01a1febc-b770-7522-ad32-253f7c81b5e8',
        actualForkContext: false, maxImages: 6,
        scope: bind(path.join(base, 'n81-final-visual-scope.md')),
        status: fs.existsSync(closure) ? 'INTAKEN_ACTUAL_CLOSED' : 'ACTIVE',
        ...(fs.existsSync(intake) ? { intake: bind(intake) } : {}),
        ...(fs.existsSync(closure) ? { closure: bind(closure) } : {}) },
      visualApproval: fs.existsSync(intake) && read(intake).accepted,
      liveProductOrDatabaseCertification: false,
    };
    current.unviewedDisplayCaptures = 20 + native.captures.length;
  }
  current.completedLesson = fs.existsSync(path.join(base, 'n81-completion.json'));
  fs.writeFileSync(file, JSON.stringify(usage, null, 2) + '\n');
  console.log(JSON.stringify({ usage: bind(file), status: current.status }));
} else if (process.argv[2] === 'repair13') {
  const intake = path.join(base, 'n81-origin-review-intake.json');
  assert.equal(read(intake).verdicts['fig-13'], 'FAIL');
  const previous = path.join(base, 'n81-origin-repair/fig-13');
  const original = read(path.join(previous, 'spec.json'));
  const candidate = structuredClone(original);
  const origin = candidate.objects.find(row => row.id === 'origin-editorial');
  origin.labelPlacement = { position: 'NW', offset: [-8, -10] };
  const pi = candidate.objects.find(row => row.id === 'x-tick-0-value');
  pi.at = [Math.PI / 3, 0];
  pi.labelPlacement = { position: 'SE', offset: [8, 10] };
  const unchanged = value => ({ ...value,
    objects: value.objects.filter(row => !['origin-editorial', 'x-tick-0-value'].includes(row.id)) });
  assert.deepEqual(unchanged(candidate), unchanged(original));
  assert.equal(origin.fontSize, 18);
  assert.equal(pi.fontSize, 18);
  const dir = path.join(base, 'n81-fig13-label-recovery');
  fs.mkdirSync(dir);
  write(path.join(dir, 'spec.json'), candidate);
  write(path.join(dir, 'changes.json'), {
    status: 'AFFECTED_TWO_LABEL_CANDIDATE_NOT_APPROVED', intake: bind(intake),
    previousSpec: bind(path.join(previous, 'spec.json')),
    previousRender: bind(path.join(previous, 'render.json')),
    previousSvg: bind(path.join(previous, 'fig-13.svg')),
    candidate: bind(path.join(dir, 'spec.json')),
    changes: ['O NW offset[-8,-10], anchor stays(0,0).',
      'pi/3 anchored to its exact tick(pi/3,0), SE offset[8,10].'],
    unchanged: ['18px labels', 'Curves, windows, formulas, values', 'Axes, ticks and leaders',
      'All mathematical assertions', 'Complete source and authoritative text'],
    originalFailPreserved: true, sourceMathEvidenceReused: true,
    parentViewsOrDecodes: 0, paidCalls: 0 });
  console.log(JSON.stringify({ candidate: bind(path.join(dir, 'spec.json')) }));
} else if (process.argv[2] === 'repair13-y-label') {
  const intake = path.join(base, 'n81-two-origin-review-intake.json');
  assert.equal(read(intake).verdicts['fig-13'], 'FAIL');
  const previous = path.join(base, 'n81-fig13-label-recovery');
  const original = read(path.join(previous, 'spec.json'));
  const candidate = structuredClone(original);
  const label = candidate.objects.find(row => row.id === 'y-tick-4-value');
  assert.equal(label.text, '-1');
  label.at = [0, -1];
  label.labelPlacement = { position: 'E', offset: [8, 0] };
  assert.equal(label.fontSize, 18);
  assert.deepEqual(candidate.objects.filter(row => row.id !== label.id),
    original.objects.filter(row => row.id !== label.id));
  assert.deepEqual(candidate.source, original.source);
  assert.deepEqual(candidate.assertions, original.assertions);
  const dir = path.join(base, 'n81-fig13-y-label-recovery');
  fs.mkdirSync(dir);
  write(path.join(dir, 'spec.json'), candidate);
  write(path.join(dir, 'changes.json'), { status: 'AFFECTED_MINUS_ONE_LABEL_CANDIDATE_NOT_APPROVED',
    intake: bind(intake), previousSpec: bind(path.join(previous, 'spec.json')),
    previousSvg: bind(path.join(previous, 'fig-13.svg')),
    previousRender: bind(path.join(previous, 'render.json')),
    candidate: bind(path.join(dir, 'spec.json')),
    changes: ['-1 anchored to its actual y tick(0,-1), E[8,0], still18px.'],
    modernTypography: 'Only the printed value placement moves to the clear right side of its y-axis tick; no source numeral, sign, ordinate or curve changes.',
    unchanged: ['All other objects, including accepted O/pi3 placements',
      'Source, complete text, all mathematical assertions, canvas/display and curve paths'],
    sourceMathAndOPi3PassReused: true, originalVisualFailuresPreserved: true,
    parentViewsOrDecodes: 0, paidCalls: 0 });
  console.log(JSON.stringify({ candidate: bind(path.join(dir, 'spec.json')) }));
} else if (process.argv[2] === 'repair17') {
  const intake = path.join(base, 'n81-second-figure-review-intake.json');
  assert.equal(read(intake).verdicts['fig-17'], 'FAIL');
  const previous = path.join(base, 'n81-second-render/fig-17/label-recovery');
  const original = read(path.join(previous, 'spec.json'));
  const candidate = structuredClone(original);
  const origin = candidate.objects.find(row => row.id === 'f17-origin-modern-O');
  assert.equal(origin.label, 'O');
  assert.deepEqual(origin.at, [0, 0]);
  origin.fontSize = 26;
  origin.labelPlacement = { position: 'SW', offset: [10, 6] };
  assert.deepEqual(candidate.objects.filter(row => row.id !== origin.id),
    original.objects.filter(row => row.id !== origin.id));
  assert.deepEqual(candidate.source, original.source);
  assert.deepEqual(candidate.assertions, original.assertions);
  const dir = path.join(base, 'n81-fig17-label-recovery');
  fs.mkdirSync(dir);
  write(path.join(dir, 'spec.json'), candidate);
  write(path.join(dir, 'changes.json'), { status: 'AFFECTED_ORIGIN_LABEL_CANDIDATE_NOT_APPROVED',
    intake: bind(intake), previousSpec: bind(path.join(previous, 'spec.json')),
    previousRender: bind(path.join(previous, 'render.json')),
    previousSvg: bind(path.join(previous, 'fig-17.svg')),
    candidate: bind(path.join(dir, 'spec.json')),
    changes: ['O font26 (17.333px at640); SW offset[10,6], still anchored(0,0).'],
    unchanged: ['All other objects, curves, guides, ticks, text and windows',
      'Source, complete authoritative text, canvas/display and assertions'],
    placementReason: 'Keep the narrower O within the axis-to-first-zero horizontal gap and below the x-axis; do not move the mathematical point.',
    originalVisualFailPreserved: true, sourceMathEvidenceReused: true,
    parentViewsOrDecodes: 0, paidCalls: 0 });
  console.log(JSON.stringify({ candidate: bind(path.join(dir, 'spec.json')) }));
} else if (['preview13', 'preview17', 'preview13-y'].includes(process.argv[2])) {
  const n = process.argv[2] === 'preview17' ? 17 : 13;
  const yRecovery = process.argv[2] === 'preview13-y';
  const dir = path.join(base, yRecovery ? 'n81-fig13-y-label-recovery' : `n81-fig${n}-label-recovery`);
  assert.equal(read(path.join(dir, 'render.json')).status, 'pass');
  const edition = path.join(dir, 'preview-book/editions/modern-us-neutral');
  const lessonDir = path.join(edition, 'lessons/ana10-c6-s2-n81');
  const figures = path.join(edition, 'figures');
  fs.mkdirSync(lessonDir, { recursive: true });
  fs.mkdirSync(figures, { recursive: true });
  const prior = path.join(base, yRecovery
    ? 'n81-fig17-label-recovery/preview-book/editions/modern-us-neutral' : n === 13
    ? 'n81-second-render/preview-book/editions/modern-us-neutral'
    : 'n81-fig13-label-recovery/preview-book/editions/modern-us-neutral');
  for (const name of ['lesson.json', 'exercises.json']) fs.copyFileSync(
    path.join(prior, 'lessons/ana10-c6-s2-n81', name), path.join(lessonDir, name),
    fs.constants.COPYFILE_EXCL);
  for (const name of fs.readdirSync(path.join(prior, 'figures'))) {
    if (name.startsWith(`fig-${n}.`)) continue;
    fs.copyFileSync(path.join(prior, 'figures', name), path.join(figures, name),
      fs.constants.COPYFILE_EXCL);
  }
  for (const [input, output] of [['spec.json', `fig-${n}.spec.json`], [`fig-${n}.svg`, `fig-${n}.svg`]])
    fs.copyFileSync(path.join(dir, input), path.join(figures, output), fs.constants.COPYFILE_EXCL);
  console.log(JSON.stringify({ status: 'AFFECTED_DRAFT_PREVIEW_PREPARED', edition }));
} else if (['capture13', 'capture17', 'capture13-y'].includes(process.argv[2])) {
  const n = process.argv[2] === 'capture17' ? 17 : 13;
  const dir = path.join(base, process.argv[2] === 'capture13-y'
    ? 'n81-fig13-y-label-recovery' : `n81-fig${n}-label-recovery`);
  const htmlPath = path.join(dir, 'preview/ana10-c6-s2-n81/text.html');
  const require = createRequire(path.join(root, 'app/package.json'));
  const { chromium } = require('playwright');
  const captures = [];
  const observations = [];
  const browser = await chromium.launch({ channel: 'chrome', headless: false });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
    await context.route('**/*', route =>
      route.request().url().startsWith('data:') ? route.continue() : route.abort());
    const page = await context.newPage();
    await page.setContent(fs.readFileSync(htmlPath, 'utf8'), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('.err').count(), 0);
    const figure = page.locator(`#fig-${n}`);
    const native = path.join(dir, 'native640.png');
    assert(!fs.existsSync(native));
    await figure.locator('.figure-media').screenshot({ path: native });
    captures.push(bind(native));
    for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport);
      await figure.scrollIntoViewIfNeeded();
      const metrics = await figure.evaluate(element => {
        const media = element.querySelector('.figure-media');
        const svg = media.querySelector('svg');
        const scale = svg.getBoundingClientRect().width / svg.viewBox.baseVal.width;
        return { mediaWidth: media.getBoundingClientRect().width,
          containerWidth: element.clientWidth,
          minTextPx: Math.min(...[...svg.querySelectorAll('text')]
            .map(node => Number(node.getAttribute('font-size')) * scale)),
          before: element.scrollLeft, expectedEnd: element.scrollWidth - element.clientWidth,
          pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth };
      });
      assert.equal(metrics.mediaWidth, 640);
      assert(metrics.minTextPx >= 16);
      assert.equal(metrics.pageOverflow, false);
      const file = path.join(dir, `surface-${viewport.width}.png`);
      assert(!fs.existsSync(file));
      await figure.screenshot({ path: file });
      captures.push({ viewport, ...bind(file) });
      if (metrics.expectedEnd > 0) {
        const bounds = await figure.boundingBox();
        await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
        await page.mouse.wheel(2000, 0);
        await figure.evaluate(element => new Promise((resolve, reject) => {
          const deadline = performance.now() + 3000;
          const poll = () => {
            if (Math.abs(element.scrollLeft - (element.scrollWidth - element.clientWidth)) <= 1)
              return resolve();
            if (performance.now() > deadline) return reject(new Error('Native wheel end not reached'));
            requestAnimationFrame(poll);
          };
          poll();
        }));
      }
      metrics.actualEnd = await figure.evaluate(element => element.scrollLeft);
      assert.equal(metrics.actualEnd, metrics.expectedEnd);
      observations.push({ viewport, ...metrics });
    }
    await context.close();
  } finally {
    await browser.close();
  }
  const out = path.join(dir, 'display-evidence.json');
  write(out, { status: 'AFFECTED_MECHANICAL_DISPLAY_PASS_VISUAL_REVIEW_PENDING',
    html: bind(htmlPath), captures, observations, headed: true, browserClosed: true,
    screenshots: 3, parentViewsOrDecodes: 0, hiddenCharges: 'UNKNOWN',
    wholeLessonAcceptance: false });
  console.log(JSON.stringify({ evidence: bind(out), observations }));
} else {
  throw new Error('Unknown continuation action');
}

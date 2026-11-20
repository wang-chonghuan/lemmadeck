import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const root = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n68-answer-choice-review-01');
const manifestPath = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n68-answer-choice-review-inputs-01/manifest.json');
const auditPath = path.join(root, 'input-hashes-before.json');
const now = () => new Date().toISOString();
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (name, value) => {
  const file = path.resolve(root, name);
  if (path.dirname(file) !== root) throw new Error('Output outside owned root');
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
};
const stat = file => {
  const bytes = fs.readFileSync(file);
  return {
    path: file,
    sha256: sha(bytes),
    bytes: bytes.length,
    mode: fs.statSync(file).mode.toString(8).slice(-4),
  };
};
const canonical = value => {
  const sorted = item => Array.isArray(item) ? item.map(sorted) :
    item && typeof item === 'object' ? Object.fromEntries(
      Object.keys(item).sort().map(key => [key, sorted(item[key])])) : item;
  return JSON.stringify(sorted(value)).replace(/[\u0080-\uffff]/g,
    character => `\\u${character.charCodeAt(0).toString(16).padStart(4, '0')}`);
};
const verifyBefore = () => {
  const before = load(auditPath);
  const changed = before.inputs.filter(entry => {
    const current = stat(entry.path);
    return current.sha256 !== entry.sha256 || current.bytes !== entry.bytes ||
      current.mode !== entry.mode;
  });
  if (changed.length) throw new Error(`Inputs changed: ${JSON.stringify(changed)}`);
  return before;
};
const command = process.argv[2];
const manifest = load(manifestPath);

if (command === 'baseline') {
  const seed = load(manifest.seed.path);
  const additional = [
    manifestPath,
    path.join(repo, 'AGENTS.md'),
    path.join(repo, '.intentfold/readme.md'),
    path.join(repo, '.intentfold/charter/engineering.md'),
    path.join(repo, '.intentfold/charter/operations.md'),
    '/Users/yong/.agents/skills/intentfold/SKILL.md',
    path.join(repo, '.agents/skills/ld-s10y-choice/SKILL.md'),
    path.join(repo, '.agents/skills/ld-s10y-choice/references/contract.md'),
    path.join(repo, '.agents/skills/ld-s10y-choice/references/review.md'),
    path.join(repo, '.claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md'),
    path.join(repo, '.agents/skills/ld-s10y-choice/scripts/validate.py'),
  ];
  const files = [...new Set([
    ...manifest.inputs.map(entry => entry.path),
    ...seed.trace.map(entry => path.join(repo, entry.path)),
    ...additional,
  ])];
  const inputs = files.map(stat);
  const mismatches = manifest.inputs.filter(expected => {
    const actual = inputs.find(entry => entry.path === expected.path);
    return ['sha256', 'bytes', 'mode'].some(key => expected[key] !== actual[key]);
  });
  const traceMismatches = seed.trace.filter(expected =>
    inputs.find(entry => entry.path === path.join(repo, expected.path)).sha256 !== expected.sha256);
  write('input-hashes-before.json', {
    schema: 'same188-6-input-hashes@1',
    recordedAt: now(),
    keyFilesHashedAsOpaqueBytesOnly: true,
    manifestMatches: mismatches.length === 0,
    traceMatches: traceMismatches.length === 0,
    inputs,
    mismatches,
    traceMismatches,
  });
  if (mismatches.length || traceMismatches.length) process.exitCode = 2;
  console.log(JSON.stringify({ inputCount: inputs.length, mismatches, traceMismatches }));
} else if (command === 'add-input') {
  verifyBefore();
  const input = path.resolve(process.argv[3]);
  if (input.startsWith(`${root}/`)) throw new Error('Owned outputs are not inputs');
  const name = process.argv[4];
  write(name, { schema: 'same188-6-additional-input@1', recordedAt: now(), inputs: [stat(input)] });
  console.log(JSON.stringify(stat(input)));
} else if (command === 'seal') {
  const before = verifyBefore();
  const name = process.argv[3];
  if (!['source-first-solutions.json', 'view-first-findings.json'].includes(name)) {
    throw new Error('Unexpected seal target');
  }
  const file = path.join(root, name);
  const value = load(file);
  if (value.sealedAt) throw new Error('Stage already sealed');
  if (name === 'view-first-findings.json') {
    const sourcePath = path.join(root, 'source-first-solutions.json');
    const source = load(sourcePath);
    if (!source.sealedAt || stat(sourcePath).mode !== '0444') throw new Error('Source not sealed');
    value.sourceSealBinding = stat(sourcePath);
  }
  value.sealedAt = now();
  value.inputBindings = before.inputs;
  value.seedCanonicalSha256 = sha(Buffer.from(canonical(load(manifest.seed.path))));
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
  fs.chmodSync(file, 0o444);
  const receipt = {
    schema: 'same188-6-stage-seal@1',
    recordedAt: now(),
    stage: name,
    output: stat(file),
    authorKeysSemanticallyUnread: true,
  };
  write(name.replace('.json', '.seal-receipt.json'), receipt);
  fs.chmodSync(path.join(root, name.replace('.json', '.seal-receipt.json')), 0o444);
  console.log(JSON.stringify(receipt));
} else if (command === 'digests') {
  for (const selector of ['seed', 'draftKeyLast']) {
    const file = manifest[selector].path;
    console.log(JSON.stringify({ selector, ...stat(file), canonicalSha256: sha(Buffer.from(canonical(load(file)))) }));
  }
} else if (command === 'retain-losses') {
  verifyBefore();
  const sourcePath = path.join(root, 'source-first-solutions.json');
  const viewPath = path.join(root, 'view-first-findings.json');
  if ([sourcePath, viewPath].some(file => stat(file).mode !== '0444' || !load(file).sealedAt)) {
    throw new Error('Both independent stages must be sealed before keys');
  }
  const draft = load(manifest.draftKeyLast.path);
  write('retained-capacity-losses.json', {
    schema: 'same188-6-retained-capacity-losses@1',
    recordedAt: now(),
    draftBinding: stat(manifest.draftKeyLast.path),
    sourceSealBinding: stat(sourcePath),
    viewSealBinding: stat(viewPath),
    authorLimitationsVerbatim: draft.questions.map(question => ({
      question_id: question.id,
      source_numbers: question.source_numbers,
      limitations: question.intent.limitations,
    })),
    authorCoverageVerbatim: draft.coverage,
    independentCapacityLosses: load(viewPath).packageRelationships.capacityLosses,
    sourceHolds: load(sourcePath).solutions.filter(row => row.sourceHolds).map(row => ({
      exercise: row.exercise,
      observations: row.sourceHolds,
    })),
    gradingCapacityLoss: 'All eight written answers remain ungraded; no automatic correctness determination, including for individually determinate numeric components, is claimed.',
  });
  console.log(JSON.stringify({ retainedQuestionCount: draft.questions.length, sourceCount: draft.coverage.length }));
} else if (command === 'project-choice-review') {
  verifyBefore();
  const sourcePath = path.join(root, 'source-first-solutions.json');
  const viewPath = path.join(root, 'view-first-findings.json');
  const source = load(sourcePath);
  const view = load(viewPath);
  if ([sourcePath, viewPath].some(file => stat(file).mode !== '0444' || !load(file).sealedAt)) {
    throw new Error('Independent stages must already be sealed');
  }
  if (!fs.existsSync(path.join(root, 'key-last-comparison.json'))) {
    throw new Error('Actual semantic key comparison required first');
  }
  // Project the manually authored sealed findings; do not generate new judgments.
  const review = {
    schema: 's10y-choice-review-v1',
    seed_sha256: sha(Buffer.from(canonical(load(manifest.seed.path)))),
    draft_sha256: sha(Buffer.from(canonical(load(manifest.draftKeyLast.path)))),
    reviewer: source.reviewer,
    source_reviews: source.solutions.map(row => {
      const coverage = view.sourceCoverage.find(item => item.source_number === row.exercise);
      return {
        source_number: row.exercise,
        independent_solution: row.independentSolution,
        coverage: { verdict: coverage.verdict, evidence: coverage.evidence },
      };
    }),
    figure_checks: [],
    new_figure_reviews: [],
    question_reviews: view.question_reviews,
    outcome: view.provisionalOutcome,
  };
  write('review.json', review);
  write('choice-review-projection-receipt.json', {
    schema: 'same188-6-choice-review-projection@1',
    recordedAt: now(),
    sourceSealBinding: stat(sourcePath),
    viewSealBinding: stat(viewPath),
    comparisonBinding: stat(path.join(root, 'key-last-comparison.json')),
    reviewBinding: stat(path.join(root, 'review.json')),
    meaning: 'Mechanical native-schema projection of already-authored independent semantic findings; no new solutions/options/verdicts produced and no native seed/draft/answer producer run.',
  });
  console.log(JSON.stringify({ ...stat(path.join(root, 'review.json')), outcome: review.outcome }));
} else if (command === 'probe-evidence') {
  const owner = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n68-answer-author');
  const recoveredPath = path.join(owner, 'offline-judge-results-recovered.json');
  const initialPath = path.join(owner, 'offline-judge-results.json');
  const casesPath = path.join(owner, 'offline-judge-cases.json');
  const recovered = load(recoveredPath);
  const initial = load(initialPath);
  const cases = load(casesPath);
  const slim = row => ({
    id: row.id,
    exercise: row.exercise,
    part: row.part,
    submitted: row.submitted,
    mathematicallyCorrect: row.mathematicallyCorrect,
    actual: row.actual,
    matchesMathematics: row.matchesMathematics,
    errorFirstLine: row.error ? row.error.split('\n')[0] : null,
  });
  const mismatches = recovered.results.filter(row => row.actual !== row.mathematicallyCorrect);
  write('author-probe-evidence.json', {
    schema: 'same188-6-author-probe-evidence@1',
    recordedAt: now(),
    provenance: 'Read-only review of author-supplied current behavior receipts after both independent seals. No probe or production judge was rerun.',
    inputBindings: [stat(recoveredPath), stat(initialPath), stat(casesPath)],
    extraction: recovered.extraction,
    caseBindingMatches: recovered.extraction.caseSha256 === stat(casesPath).sha256,
    recoveredCount: recovered.results.length,
    caseIdsMatch: canonical(cases.map(row => row.id)) === canonical(recovered.results.map(row => row.id)),
    executionFailures: recovered.results.filter(row => row.error).length,
    falseRejections: mismatches.filter(row => row.mathematicallyCorrect === true && row.actual === false).length,
    falseAcceptances: mismatches.filter(row => row.mathematicallyCorrect === false && row.actual === true).length,
    results: recovered.results.map(slim),
    initialFailurePreserved: {
      binding: stat(initialPath),
      count: initial.results.length,
      executionFailures: initial.results.filter(row => row.error).length,
      firstExecutionError: initial.results.find(row => row.error)?.error.split('\n')[0],
      enginePath: initial.extraction.enginePath,
      engineSha256: initial.extraction.engineSha256,
      interpretation: 'The initial UMD import had 27 execution failures. Its aggregate 30 mismatches are not 30 established mathematical judge failures; the three non-error exact cases were false rejections. The later ESM receipt has actual booleans for all 30.',
      nonErrorResults: initial.results.filter(row => !row.error).map(slim),
    },
    rerunCount: 0,
    runtimeOrMathLivePassClaimed: false,
  });
  console.log(JSON.stringify({
    cases: cases.length,
    recoveredResults: recovered.results.length,
    falseRejections: mismatches.filter(row => row.mathematicallyCorrect && row.actual === false).length,
    falseAcceptances: mismatches.filter(row => !row.mathematicallyCorrect && row.actual === true).length,
    initialExecutionFailures: initial.results.filter(row => row.error).length,
  }));
} else if (command === 'verify-review') {
  const sourcePath = path.join(root, 'source-first-solutions.json');
  const viewPath = path.join(root, 'view-first-findings.json');
  const source = load(sourcePath);
  const view = load(viewPath);
  const review = load(path.join(root, 'review.json'));
  const answerReview = load(path.join(root, 'answer-review.json'));
  const draft = load(manifest.draftKeyLast.path);
  const visible = load(manifest.visible.path);
  const candidate = load(manifest.answersKeyLast.path);
  const sealIntact = name => {
    const receipt = load(path.join(root, name.replace('.json', '.seal-receipt.json')));
    return receipt.output.sha256 === stat(path.join(root, name)).sha256 &&
      stat(path.join(root, name)).mode === '0444';
  };
  const checks = {
    sourceSealIntact: sealIntact('source-first-solutions.json'),
    viewSealIntact: sealIntact('view-first-findings.json'),
    sourceBeforeView: Date.parse(source.sealedAt) < Date.parse(view.sealedAt),
    visibleProjectionUnchanged: canonical(visible.questions) === canonical(draft.questions.map(
      question => ({ id: question.id, source_numbers: question.source_numbers, view: question.view }))),
    independentQuestionEvidencePreserved: canonical(view.question_reviews) === canonical(review.question_reviews),
    independentCoverageVerdictsPreserved: view.sourceCoverage.every(row =>
      review.source_reviews.find(item => item.source_number === row.source_number)?.coverage.verdict === row.verdict),
    seedDigestMatches: review.seed_sha256 === sha(Buffer.from(canonical(load(manifest.seed.path)))),
    draftDigestMatches: review.draft_sha256 === sha(Buffer.from(canonical(draft))),
    eightSources: source.solutions.length === 8 && review.source_reviews.length === 8,
    eightQuestions: review.question_reviews.length === 8,
    thirtyTwoOptionChecks: review.question_reviews.reduce((count, row) => count + row.mathematics.option_checks.length, 0) === 32,
    allIndependentKeysAgree: review.question_reviews.every(row =>
      canonical(row.mathematics.correct) === canonical(draft.questions.find(q => q.id === row.question_id).key.correct)),
    eightCandidateAnswers: candidate.answers.length === 8 && new Set(candidate.answers.map(row => row.exercise)).size === 8,
    eightAnswerReviews: answerReview.perExercise.length === 8,
    allCandidateAnswersUngraded: candidate.answers.every(row => row.grading === 'ungraded' && row.parts.length === 0),
    noExactFallback: candidate.answers.every(row => !row.parts.some(part => part.judge === 'exact')),
    zeroReferencedImages: load(manifest.seed.path).figures.length === 0 && draft.new_figures.length === 0 &&
      draft.questions.every(question => question.view.figure_ids.length === 0 &&
        question.view.options.every(option => option.figure_ids.length === 0)),
    beforeInputsStillUnchanged: Boolean(verifyBefore()),
  };
  const receipt = {
    schema: 'same188-6-review-delivery-verification@1',
    recordedAt: now(),
    checks,
    passed: Object.values(checks).every(Boolean),
    meaning: 'Delivery bindings/counts and preservation of already-sealed semantic findings; not another native structural run or a semantic, source, figure, behavior or lesson PASS.',
    nativeValidatorRunsHere: 0,
    probeRunsHere: 0,
  };
  write('review-delivery-verification.json', receipt);
  if (!receipt.passed) process.exitCode = 2;
  console.log(JSON.stringify(receipt));
} else if (command === 'validate-once') {
  verifyBefore();
  const receiptName = 'structural-validation.json';
  if (fs.existsSync(path.join(root, receiptName))) throw new Error('Validation already recorded');
  const args = [
    path.join(repo, '.agents/skills/ld-s10y-choice/scripts/validate.py'),
    '--repo', repo,
    '--seed', manifest.seed.path,
    '--draft', manifest.draftKeyLast.path,
    '--review', path.join(root, 'review.json'),
  ];
  const startedAt = now();
  const result = spawnSync('python3', args, {
    cwd: repo,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
    encoding: 'utf8',
    maxBuffer: 4 * 1024 * 1024,
  });
  const receipt = {
    schema: 'same188-6-structural-validation@1',
    startedAt,
    finishedAt: now(),
    executable: 'python3',
    args,
    cwd: repo,
    runs: 1,
    exitCode: result.status,
    signal: result.signal,
    stdout: result.stdout,
    stderr: result.stderr,
    error: result.error ? String(result.error) : null,
    rerun: false,
    nativeProducersRun: false,
    meaning: 'Structural/input consistency only; not a source, text, figure, behavior or lesson PASS.',
  };
  write(receiptName, receipt);
  console.log(JSON.stringify(receipt));
} else if (command === 'final-inputs') {
  const before = load(auditPath);
  const extra = fs.readdirSync(root).filter(name => name.startsWith('additional-input-'))
    .flatMap(name => load(path.join(root, name)).inputs);
  const expected = [...before.inputs, ...extra];
  const inputs = expected.map(entry => {
    const after = stat(entry.path);
    return { ...after, before: entry, unchanged: ['sha256', 'bytes', 'mode'].every(key => after[key] === entry[key]) };
  });
  write('input-hashes-after.json', {
    schema: 'same188-6-input-hashes-after@1',
    recordedAt: now(),
    inputCount: inputs.length,
    unchanged: inputs.every(entry => entry.unchanged),
    inputs,
  });
  console.log(JSON.stringify({ inputCount: inputs.length, unchanged: inputs.every(entry => entry.unchanged) }));
} else if (command === 'index') {
  const files = fs.readdirSync(root).filter(name => name !== 'output-index.json').sort();
  const outputs = files.map(name => ({ ...stat(path.join(root, name)), path: name }));
  write('output-index.json', {
    schema: 'same188-6-output-index@1',
    recordedAt: now(),
    outputRoot: root,
    outputs,
    excludesItself: true,
  });
  console.log(JSON.stringify({ ...stat(path.join(root, 'output-index.json')), outputCount: outputs.length }));
} else {
  throw new Error('Unknown audit command');
}

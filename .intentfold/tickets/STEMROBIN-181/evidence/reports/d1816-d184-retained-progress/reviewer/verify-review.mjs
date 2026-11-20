import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), root, 'Exact assigned cwd is required');
const review = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d184-n21-text-review');
const author = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d183-n21-text-author');
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const record = (file, role) => {
  const absolute = path.resolve(root, file);
  assert.ok(!/\.(png|svg|jpg|jpeg|webp|pdf)$/i.test(absolute), 'No image or PDF bytes may be read');
  const bytes = fs.readFileSync(absolute);
  return { role, path: absolute, bytes: bytes.length, sha256: digest(bytes) };
};
const match = binding => {
  const actual = record(binding.path, binding.role);
  assert.equal(actual.bytes, binding.bytes, `Bytes changed: ${binding.path}`);
  assert.equal(actual.sha256, binding.sha256, `Hash changed: ${binding.path}`);
  return actual;
};
const writeNew = (name, data) => {
  const target = path.join(review, name);
  fs.writeFileSync(target, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' });
  return record(target, 'new reviewer mechanical output');
};
const sourceOnly = read(path.join(review, 'source-only.json'));
const after = read(path.join(review, 'after-baseline.json'));
const inputFreeze = read(path.join(review, 'input-freeze.json'));
const source = read(sourceOnly.originalLesson.path);
const baseline = read(path.join(review, 'source-baseline.json'));
assert.equal(baseline.blocks.length, 21);
assert.equal(baseline.readOrder.afterBaselineReadAtCreation, false);
assert.equal(digest(fs.readFileSync(path.join(review, 'source-baseline.json'))),
  'ddb217f353cd7a72e9ba90025e28c29011cf3862ab0a5f67de428d3f3da8d1a8');
const counters = {
  actualImageOpens: 0, repairs: 0, nativeCalls: 0, paidCalls: 0,
  imageBytesRead: 0, networkCalls: 0, modelAPICalls: 0, databaseAccesses: 0,
  publisherCalls: 0, gitCalls: 0, browserCalls: 0, otherChatMessages: 0,
  setupReplays: 0, freshnessReplays: 0, grillReplays: 0,
  sourceReviewReplays: 0, authorReplays: 0, nativeFinalizers: 0,
  nativeRenders: 0, recordReviewCalls: 0
};

if (process.argv[2] === '--capture') {
  match(inputFreeze.sourceOnly);
  match(inputFreeze.afterBaseline);
  const sourceInputs = [];
  const sourceSeen = new Set();
  for (const binding of [
    sourceOnly.originalLesson, sourceOnly.originalExercises,
    ...sourceOnly.sourceReviewComposition.flatMap(item => [...item.reports, ...item.bindings])
  ]) {
    const actual = match(binding);
    if (sourceSeen.has(actual.path)) continue;
    sourceSeen.add(actual.path);
    sourceInputs.push({ ...actual, role: 'immutable original source text or inherited source provenance file' });
  }
  const currentInputs = [];
  for (const [edition, binding] of Object.entries(after.languages)) {
    currentInputs.push({ ...match(binding), role: `exact frozen authored lesson: ${edition}` });
  }
  const authorFreeze = read(after.authorFreeze.path);
  for (const binding of authorFreeze.frozenCopies.filter(item => item.path.endsWith('/exercises.template.json'))) {
    currentInputs.push({ ...match(binding), role: 'exact frozen zero-task exercise carrier' });
  }
  const metadataNames = [
    'author-notes.json', 'input-bindings.json', 'final-bindings.json',
    'parent-binding-verification.json', 'intake-recovery/diagnosis.json'
  ];
  const metadataInputs = [
    record(path.join(review, 'input-freeze.json'), 'review dispatch freeze'),
    record(path.join(review, 'source-only.json'), 'source-first manifest'),
    record(path.join(review, 'after-baseline.json'), 'post-baseline current input manifest'),
    ...[after.collectedAuthor, after.authorReport, after.authorFreeze].map(binding => ({
      ...match(binding), role: 'author or parent historical metadata file; contents not recursively current inputs'
    })),
    ...metadataNames.map(name => record(path.join(author, name),
      'author or intake historical metadata file; contents not recursively current inputs'))
  ];
  const diagnosis = read(path.join(author, 'intake-recovery/diagnosis.json'));
  assert.equal(diagnosis.sourceOrTextChanges, false);
  assert.equal(diagnosis.contentApproval, false);
  metadataInputs.push({
    ...match(diagnosis.failedFirstIntake),
    role: 'retained failed first intake metadata; not content repair or approval'
  });
  const historicalInputs = diagnosis.historical.map(item => ({
    ...match(item.recoveredOriginal),
    role: 'exact reconstructed original template bytes, historical only; not the current authored template'
  }));
  const collection = read(after.collectedAuthor.path);
  const parentVerification = read(path.join(author, 'parent-binding-verification.json'));
  assert.equal(collection.authorClosed, true);
  assert.equal(collection.verifiedCurrentBindingsBeforeClosure, 84);
  assert.equal(parentVerification.verifiedBindings, 84);
  const perEdition = [];
  const mathTokens = text => [...text.matchAll(/\$([^$]+)\$/g)].map(item => item[1]);
  const numbers = text => text.match(/\d+(?:\.\d+)?/g) ?? [];
  const subsequence = (expected, actual) => {
    let cursor = 0;
    for (const token of actual) if (token === expected[cursor]) cursor++;
    return cursor === expected.length;
  };
  for (const [edition, binding] of Object.entries(after.languages)) {
    const lesson = read(binding.path);
    assert.equal(lesson.prose.length, 21);
    assert.equal(lesson.exercise_count, 0);
    assert.deepEqual(lesson.source.data, source);
    assert.equal(lesson.source.sha256, sourceOnly.originalLesson.sha256);
    assert.deepEqual(lesson.figures, source.figures);
    for (const key of ['id', 'card_id', 'number', 'start_page', 'start_printed']) {
      assert.equal(lesson[key], source[key]);
    }
    const blocks = lesson.prose.map((block, index) => {
      const original = source.prose[index];
      assert.deepEqual(block.source_refs, original.source_refs);
      assert.deepEqual(baseline.blocks[index].source_refs, original.source_refs);
      for (const key of ['kind', 'id', 'printed_page']) assert.equal(block[key], original[key]);
      assert.equal(block.source_text, original.text);
      if (block.kind !== 'cap') assert.equal(block.label, original.label);
      assert.deepEqual(block.numeric_changes, []);
      if (original.kind === 'fig') {
        for (const [key, value] of Object.entries(original)) assert.deepEqual(block[key], value);
      }
      const originalMath = mathTokens(original.text);
      const currentMath = mathTokens(block.text);
      assert.ok(subsequence(originalMath, currentMath), `Source math missing in ${edition} block ${index + 1}`);
      assert.deepEqual(currentMath.filter(token => token.includes('=')),
        originalMath.filter(token => token.includes('=')));
      assert.deepEqual(numbers(block.text), numbers(original.text));
      assert.equal((block.text.match(/_м/g) ?? []).length, (original.text.match(/_м/g) ?? []).length);
      return {
        block: index + 1, kind: block.kind, source_refs: block.source_refs,
        sourceRefsPreserved: true, sourceTextExact: true, kindIdPrintedPagePreserved: true,
        sourceMathTokens: originalMath, currentMathTokens: currentMath,
        sourceMathPreservedInOrder: true, sourceEquationsByteExact: true,
        numericTokens: numbers(block.text), sourceNumericTokensPreserved: true,
        bareCyrillicAmplitudeSubscripts: (block.text.match(/_м/g) ?? []).length,
        textBytes: Buffer.byteLength(block.text), textSha256: digest(Buffer.from(block.text)),
        figureSemanticApproval: false
      };
    });
    const exercise = read(currentInputs.find(item => item.path.endsWith(`/${edition}/exercises.template.json`)).path);
    assert.equal(exercise.count, 0);
    assert.deepEqual(exercise.exercises, []);
    assert.ok(lesson.prose[16].text.includes('①'));
    assert.ok(lesson.prose[17].text.includes('①'));
    assert.equal(lesson.prose[17].label, 'footnote');
    assert.deepEqual(lesson.prose[17].source_refs, ['p0060#14']);
    perEdition.push({
      edition, blocks: 21, tasks: 0, embeddedOriginalSourceExact: true,
      rootFigureMetadataPreserved: true, ownedFootnotePreserved: true,
      bareCyrillicAmplitudeSubscriptsTotal: blocks.reduce((sum, block) => sum + block.bareCyrillicAmplitudeSubscripts, 0),
      results: blocks
    });
  }
  const bindings = {
    schema: 'd184-review-input-bindings@1', batch: 'D184', cwd: root,
    currentInputs, sourceInputs, metadataInputs, historicalInputs,
    bindingPolicy: 'Explicit flat file list only. Historical manifests are sealed as files, never recursively interpreted as current paths. Image/PDF bytes are not read.',
    parentCollection: {
      authorClosed: true, reportedPreviouslyVerifiedBindings: 84,
      parentBindingVerificationReplayed: false,
      historicalVsCurrentIntakeResolved: true, contentRepairOrApproval: false
    },
    counters
  };
  const evidence = {
    schema: 'd184-independent-mechanical-text-evidence@1', batch: 'D184',
    cwd: root, status: 'pass', semanticVerdictsNotInferredFromMechanicalChecks: true,
    originalBlocks: 21, originalTasks: 0, perEdition, counters
  };
  console.log(JSON.stringify({
    bindings: writeNew('review-input-bindings.json', bindings),
    evidence: writeNew('mechanical-evidence.json', evidence),
    currentInputs: currentInputs.length, sourceInputs: sourceInputs.length,
    metadataInputs: metadataInputs.length, historicalInputs: historicalInputs.length
  }, null, 2));
} else if (process.argv[2] === '--seal') {
  const bindings = read(path.join(review, 'review-input-bindings.json'));
  for (const group of ['currentInputs', 'sourceInputs', 'metadataInputs', 'historicalInputs']) {
    bindings[group].forEach(match);
  }
  const report = read(path.join(review, 'report.json'));
  assert.equal(report.perBlockResults.length, 21);
  for (const key of ['scienceVerdict', 'zhVerdict', 'enVerdict']) {
    assert.ok(['pass', 'hold'].includes(report[key]));
  }
  assert.deepEqual(report.counters, counters);
  const freeze = {
    schema: 'd184-independent-text-review-freeze@1', batch: 'D184',
    ticket: 'STEMROBIN-181', book: '10p', lesson: 'phy10-c1-s3-n21', cwd: root,
    date: '2026-11-20', status: 'sole independent text review completed; parent collection pending',
    scienceVerdict: report.scienceVerdict, zhVerdict: report.zhVerdict, enVerdict: report.enVerdict,
    report: record(path.join(review, 'report.json'), 'manual independent report'),
    sourceBaseline: record(path.join(review, 'source-baseline.json'), 'original-only baseline saved before author exposure'),
    reviewEvidence: [
      record(path.join(review, 'verify-review.mjs'), 'mechanical verifier, no semantic approval generation'),
      record(path.join(review, 'review-input-bindings.json'), 'flat current/historical input inventory'),
      record(path.join(review, 'mechanical-evidence.json'), 'independent block and exact-math preservation checks')
    ],
    currentInputs: bindings.currentInputs, originalSourceInputs: bindings.sourceInputs,
    metadataInputs: bindings.metadataInputs, historicalReconstructedInputs: bindings.historicalInputs,
    bindingPolicy: bindings.bindingPolicy, parentCollection: bindings.parentCollection,
    approvalScope: 'SCI/ZH/EN text only; hold is not approval',
    figures: [
      { id: 'fig-32', status: 'unapproved', pixelsOpened: false, semanticsReviewed: false },
      { id: 'fig-33', status: 'unapproved', pixelsOpened: false, semanticsReviewed: false }
    ],
    sourceOrAuthorInputsEdited: false, wholeCourseApproved: false,
    productAcceptance: false, nativeFinalization: false, parentCollectionPending: true,
    counters,
    hashCyclePolicy: 'Freeze seals report, baseline, evidence and explicit input files. The freeze does not self-hash; its exact hash is returned externally.'
  };
  console.log(JSON.stringify(writeNew('review-freeze.json', freeze), null, 2));
} else if (process.argv[2] === '--verify') {
  const freeze = read(path.join(review, 'review-freeze.json'));
  const targets = [
    freeze.report, freeze.sourceBaseline, ...freeze.reviewEvidence,
    ...freeze.currentInputs, ...freeze.originalSourceInputs, ...freeze.metadataInputs,
    ...freeze.historicalReconstructedInputs
  ];
  targets.forEach(match);
  console.log(JSON.stringify({
    status: 'pass', verifiedFlatBindings: targets.length,
    report: match(freeze.report), baseline: match(freeze.sourceBaseline),
    freeze: record(path.join(review, 'review-freeze.json'), 'review freeze'),
    counters
  }, null, 2));
} else {
  throw new Error('Use --capture, --seal or --verify');
}

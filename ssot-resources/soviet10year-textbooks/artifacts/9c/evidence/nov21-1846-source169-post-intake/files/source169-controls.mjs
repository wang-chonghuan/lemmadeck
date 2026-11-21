import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), repo);
const base = path.join(repo, '.tmp/stemrobin-184-six');
const progressFile = path.join(base, 'source-progress.json');
const usageFile = path.join(repo, '.intentfold/tickets/STEMROBIN-184/usage.json');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.relative(repo, file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const verify = row => {
  const actual = bind(path.resolve(repo, row.path));
  assert.equal(actual.bytes, row.bytes);
  assert.equal(actual.sha256, row.sha256);
  return actual;
};
const absent = file => {
  try {
    fs.lstatSync(file);
    assert.fail(`Serial source destination already exists: ${file}`);
  } catch (error) {
    assert.equal(error.code, 'ENOENT', file);
  }
  return path.relative(repo, file);
};
const write = (file, value) => fs.writeFileSync(file,
  JSON.stringify(value, null, 2) + '\n', { flag: 'wx', mode: 0o444 });
const retain = (name, entry, output) => {
  const retained = path.join(repo,
    'ssot-resources/soviet10year-textbooks/artifacts/9c/evidence', name);
  assert(!fs.existsSync(retained));
  fs.mkdirSync(retained);
  const rows = [...entry.files, bind(output)].map(row => {
    const target = path.join(retained, 'files', row.path);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.resolve(repo, row.path), target, fs.constants.COPYFILE_EXCL);
    fs.chmodSync(target, 0o444);
    assert.equal(bind(target).sha256, row.sha256);
    return { origin: row.path, path: path.relative(retained, target),
      bytes: row.bytes, sha256: row.sha256 };
  });
  const manifest = path.join(retained, 'manifest.json');
  write(manifest, { status: entry.status, rows, files: rows.length,
    externalReferences: entry.externalReferences,
    sourcePNGPDFAndRuntimeReferencesNotCopied: true });
  return bind(manifest);
};
const progress = read(progressFile), usage = read(usageFile);
const previous = progress.source168;
assert.equal(previous.review.closed, true);
assert.equal(previous.countRepair.nativeStatus, 'PASS14_14');
assert(previous.canonical);
const mode = process.argv[2];
const entry = { at: new Date().toISOString(), book: '9c', physicalPage: 169,
  parentImagesOrDecodes: 0, parentPermanentBudget: '24/24; not reset',
  completeLessonDelta: 0, groupComplete: false, finish: 'review',
  forbiddenOperations: 0, bootstrapOrBackendOrPassedStageReplays: 0 };
let suffix;
if (mode === 'preflight') {
  assert(!progress.source169);
  entry.previousCanonicalRetention = verify(previous.canonical);
  entry.previousCanonicalFiles = read(path.resolve(repo, previous.canonical.path)).files.map(verify);
  entry.absentTargets = [
    '.tmp/ld-s10y-lesson/9c/pages/0169',
    'ssot-resources/soviet10year-textbooks/artifacts/9c/pages/0169',
    '.tmp/stemrobin-184-six/source169-active',
    '.tmp/stemrobin-184-six/source169-review',
  ].map(file => absent(path.join(repo, file)));
  entry.status = 'SOURCE169_ACTUAL_SERIAL_ABSENCE_PREFLIGHT_NO_PREPARATION';
  entry.knownPrevious164168 = 32 + previous.knownCharge;
  entry.incomingSource168 = 'Exercise381 complete and folio161; n47 boundary still unknown. No next-page content or TOC inference.';
  const output = path.join(base, 'source169-parent-preflight.json');
  write(output, entry);
  suffix = 'serial_preflight';
} else if (mode === 'dispatch') {
  assert(!progress.source169);
  const preflight = path.join(base, 'source169-parent-preflight.json');
  entry.preflight = bind(preflight);
  assert.equal(read(preflight).status, 'SOURCE169_ACTUAL_SERIAL_ABSENCE_PREFLIGHT_NO_PREPARATION');
  entry.agent = process.argv[3];
  entry.name = process.argv[4];
  assert(entry.agent && entry.name);
  entry.status = 'SOURCE169_ACTUAL_SERIAL_SOURCE_FIRST_AUTHOR_DISPATCHED';
  entry.root = '.tmp/stemrobin-184-six/source169-active';
  entry.closed = false;
  entry.forkContext = false;
  entry.budget = 'Fresh context max24; task max8, expected5: prepare3 + native source view1 + first finalize1. Actual separately accounted.';
  entry.previousKnown164168 = 32 + previous.knownCharge;
  entry.source170Plus = 'UNREAD_UNPREPARED_NOT_PREFETCHED';
  entry.scope = 'Own physical169/book9c only; source-first freeze before layout/template. Prove actual n47 boundary, never infer closure from completed381 or TOC.';
  const output = path.join(base, 'source169-dispatch-parent-receipt.json');
  write(output, entry);
  progress.source169 = { ...entry, dispatch: bind(output) };
  progress.status = '1846 SOURCE168 canonical retained; actual serial169 author active, n47 OPEN until source boundary proved';
  suffix = 'actual_source_dispatch';
} else if (mode === 'author-intake') {
  const source = progress.source169, author = path.join(base, 'source169-active');
  assert.equal(source.closed, false);
  assert(!source.intake);
  const manifestFile = path.join(author, 'manifest.json'), manifest = read(manifestFile);
  const sealFile = path.join(author, 'seal.receipt.json'), seal = read(sealFile);
  assert.equal(bind(manifestFile).sha256,
    'ef4d6e4bbda55d69574c66b3225bdf812adf7268110c67c61a344c09f19a699f');
  assert.equal(bind(sealFile).sha256,
    '88b0d4fef2a1730c09f19a722e02c1d5063e5ed8d1b6dc79db11c3fd68b5cc51');
  verify(seal.manifest);
  const parts = manifest.file_parts.map(verify);
  const records = parts.flatMap(row => read(path.resolve(repo, row.path)).records);
  assert.equal(records.length, 43);
  assert.equal(new Set(records.map(row => row.path)).size, 43);
  const textFiles = [], references = [];
  for (const row of records) {
    if (row.kind === 'symlink') {
      assert.equal(fs.readlinkSync(row.path), row.link);
      assert.equal(fs.realpathSync(row.path), row.realpath);
      assert.equal(bind(row.path).sha256, row.target_sha256);
      references.push(row);
      continue;
    }
    const actual = verify(row);
    assert.equal((fs.statSync(row.path).mode & 0o777).toString(8), row.mode);
    (row.path.endsWith('.png') ? references : textFiles).push(actual);
  }
  assert.equal(textFiles.length, 40);
  const checkDirectories = directory => {
    assert.equal(fs.statSync(directory).mode & 0o777, 0o555);
    for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
      if (item.isDirectory()) checkDirectories(path.join(directory, item.name));
    }
  };
  checkDirectories(author);
  const integrity = read(path.join(author, 'integrity.external.json'));
  entry.externalReferences = [...references, ...integrity.verification.map(row =>
    verify({ path: row.path, bytes: row.bytes, sha256: row.sha256 })),
    ...read(path.join(author, 'integrity.code.json')).code.map(verify)];
  for (const name of ['source169-first-prepare-nov21-active', 'source169-first-native-nov21-active']) {
    const stage = read(path.join(base, 'stages', `${name}.receipt.json`));
    assert.equal(stage.exitCode, 0);
    Object.values(stage.outputs).forEach(verify);
  }
  const invariance = read(path.join(author, 'invariance.json'));
  assert(Object.values(invariance.checks).every(value => value === true));
  assert.deepEqual([manifest.audit.lines_printed, manifest.audit.lines_md], [23, 23]);
  assert.equal(manifest.native_exit, 0);
  assert.equal(read(path.join(author, 'native.invocation.json')).attempts, 1);
  for (const key of ['normalizations', 'count_exclusions', 'errors', 'figures']) {
    assert.deepEqual(manifest.audit[key], []);
  }
  assert.equal(manifest.known_image_operations, 5);
  const operations = read(path.join(author, 'operations.final.json'));
  assert.equal(operations.known_new_total, 5);
  assert.equal(operations.historical_plus_new_known_total, 45);
  assert.equal(32 + previous.knownCharge + operations.known_new_total, 45);
  entry.files = [...textFiles, ...parts, bind(manifestFile), bind(sealFile)];
  entry.fullTextConsumption = process.argv[3];
  assert(entry.fullTextConsumption);
  entry.agent = source.agent;
  entry.status = 'SOURCE169_FULL_AUTHOR_TEXT_INTAKEN_FIRST_NATIVE_PASS23_23_INDEPENDENT_APPROVAL_OPEN';
  entry.enumeratedRecordsVerified = 43;
  entry.fullTextBindings = 45;
  entry.binaryAndSymlinkReferencesHashOnly = 3;
  entry.counts = { blocks: 8, sourceRows: 23, nativeRows: 23, figures: 0, exercises: 0 };
  entry.knownSourceCharge = 5;
  entry.knownTracked164169 = 45;
  entry.hiddenImageInternals = 'UNKNOWN';
  entry.nativeStatus = 'FIRST_PASS23_23';
  entry.fidelityApproval = 'NOT_GRANTED';
  entry.n47Boundary = 'AUTHOR_OBSERVED_TOP_H3_ONLY_INDEPENDENT_APPROVAL_OPEN';
  entry.holds = manifest.uncertainties;
  entry.provenanceQualification = 'Immutable incoming_direct_user_fact and direct-user labels are parent-agent dispatch facts under existing human authority, not new direct human prompts.';
  const output = path.join(base, 'source169-author-parent-intake.json');
  write(output, entry);
  source.intake = bind(output);
  source.retained = retain('nov21-1846-source169', entry, output);
  source.nativeStatus = entry.nativeStatus;
  source.knownCharge = 5;
  source.status = entry.status;
  source.holds = entry.holds;
  progress.status = '1846 SOURCE169 full author intake PASS23/23; n47 independent boundary approval OPEN';
  suffix = 'author_FULL_text_intake';
} else if (mode === 'author-close') {
  const source = progress.source169;
  assert(source.intake);
  assert.equal(source.closed, false);
  entry.agent = source.agent;
  entry.toolReceipt = process.argv[3];
  assert(entry.toolReceipt);
  entry.intake = verify(source.intake);
  entry.status = 'SOURCE169_AUTHOR_ACTUALLY_CLOSED_AFTER_FULL_TEXT_INTAKE';
  const output = path.join(base, 'source169-author-closure.json');
  write(output, entry);
  source.closed = true;
  source.closure = bind(output);
  suffix = 'author_actual_close';
} else if (mode === 'review-dispatch') {
  const source = progress.source169;
  assert.equal(source.closed, true);
  assert(!source.review);
  entry.agent = process.argv[3];
  entry.name = process.argv[4];
  assert(entry.agent && entry.name);
  entry.status = 'SOURCE169_ONE_FRESH_INDEPENDENT_SOURCE_FIRST_REVIEW_DISPATCHED';
  entry.sourcePNG = verify(read(path.join(base, 'source169-active/source.freeze.json')).source_image);
  entry.imagesAuthorized = 1;
  entry.authorReleased = false;
  entry.closed = false;
  entry.forkContext = false;
  entry.knownTrackedBefore = 45;
  source.review = entry;
  progress.status = '1846 SOURCE169 author closed; one blind independent source review active; n47 OPEN';
  suffix = 'independent_source_first_actual_dispatch';
} else if (mode === 'review-zero-view-intake') {
  const source = progress.source169, review = source.review;
  assert.equal(review.closed, false);
  assert.equal(review.authorReleased, false);
  assert(!review.zeroViewIntake);
  const packet = path.join(base, 'source169-review/stage1-zero-view-20261121-a8c7e1');
  const manifestFile = path.join(packet, 'manifest.json'), manifest = read(manifestFile);
  assert.equal(bind(manifestFile).sha256,
    'd65fc070a3a9acaa86048bbd45dfcb72666b91c5cd12dac45dca7194da16cd33');
  entry.files = [...manifest.evidenceFiles.map(verify), bind(manifestFile)];
  entry.externalReferences = manifest.sourceReferencesOnly.map(verify);
  entry.files.forEach(row =>
    assert.equal(fs.statSync(path.resolve(repo, row.path)).mode & 0o777, 0o444));
  assert.equal(fs.statSync(packet).mode & 0o777, 0o555);
  const receipt = read(path.join(packet, 'stage1-receipt.json'));
  assert.equal(receipt.imageViews, 0);
  assert.equal(receipt.imageDecodes, 0);
  assert.equal(receipt.sourceInventoryComplete, false);
  assert.equal(receipt.authorComparisonReleased, false);
  entry.agent = review.agent;
  entry.fullTextConsumption = process.argv[3];
  assert(entry.fullTextConsumption);
  entry.status = 'SOURCE169_ZERO_VIEW_ROLE_SCOPE_HOLD_FULL_TEXT_INTAKEN_NOT_SOURCE_REVIEW_APPROVAL';
  entry.originalHold = receipt.holdReason;
  entry.scopeDiagnosis = 'Zero further views/decodes applies to the parent permanent24/24 context. The fresh independent child was assigned one original view, not a zero-view limit. No source content or passed stage exists to replay.';
  entry.knownTracked164169 = 45;
  entry.knownReviewCharge = 0;
  entry.hiddenImageInternals = 'UNKNOWN';
  entry.provenanceQualification = 'Original direct-user and inherited-direct-instruction labels identify parent-agent dispatch facts; no new human prompt occurred.';
  const output = path.join(base, 'source169-review-zero-view-parent-intake.json');
  write(output, entry);
  review.zeroViewIntake = bind(output);
  review.zeroViewRetained = retain('nov21-1846-source169-review-zero-view', entry, output);
  review.knownCharge = 0;
  review.status = entry.status;
  suffix = 'zero_view_role_scope_HOLD_FULL_intake';
} else if (mode === 'review-original-view-clarification') {
  const source = progress.source169, review = source.review;
  assert(review.zeroViewIntake);
  assert.equal(review.authorReleased, false);
  assert.equal(review.closed, false);
  assert(!review.originalViewClarification);
  entry.agent = review.agent;
  entry.toolReceipt = process.argv[3];
  assert(entry.toolReceipt);
  entry.status = 'SOURCE169_SAME_BLIND_REVIEWER_PARENT_ONLY_ZERO_LIMIT_CLARIFIED';
  entry.parentViewsDecodesAuthorized = 0;
  entry.childOriginalViewsAuthorized = 1;
  entry.childOriginalViewsConsumedBefore = 0;
  entry.stage1StillRequired = true;
  entry.authorReleased = false;
  entry.knownTrackedBefore = 45;
  review.originalViewClarification = entry;
  suffix = 'parent_only_zero_limit_clarification';
} else if (mode === 'review-stage1-intake') {
  const source = progress.source169, review = source.review;
  assert(review.originalViewClarification);
  assert.equal(review.authorReleased, false);
  assert.equal(review.closed, false);
  assert(!review.stage1Intake);
  const packet = path.join(base, 'source169-review/stage1-observed-20261121-b3e8d4');
  const manifestFile = path.join(packet, 'manifest.json'), manifest = read(manifestFile);
  assert.equal(bind(manifestFile).sha256,
    '3d7a306450a874da2905583d016e272b862574e3ffda1755e95417c209d6a054');
  entry.files = [...manifest.evidenceFiles.map(verify), bind(manifestFile)];
  assert.equal(entry.files.length, 27);
  entry.externalReferences = manifest.referencesOnly.map(verify);
  entry.files.forEach(row => {
    assert(row.bytes <= 15360);
    assert.equal(fs.statSync(path.resolve(repo, row.path)).mode & 0o777, 0o444);
  });
  assert.equal(fs.statSync(packet).mode & 0o777, 0o555);
  const receipt = read(path.join(packet, 'stage1-receipt.json'));
  assert.equal(receipt.childViews, 1);
  assert.equal(receipt.parentAdditionalViewsAndDecodes, 0);
  assert.equal(receipt.authorContentReads, 0);
  assert.equal(receipt.originalFirstContentSource, true);
  assert.equal(receipt.sourceInventoryAndBodyFrozen, true);
  assert.equal(receipt.apparentPhysicalLineGroupsIncludingFolio, 23);
  assert.equal(receipt.trackedImageOperations, 46);
  assert.equal(receipt.exactAlgebraAssertions.count, 577);
  for (const stage of receipt.actualUniqueStages) {
    const actual = read(stage.receipt);
    assert.equal(actual.exitCode, 0);
    Object.values(actual.outputs).forEach(verify);
  }
  const freeze = read(path.join(packet, 'source-freeze.json'));
  freeze.contentEvidence.forEach(verify);
  entry.agent = review.agent;
  entry.fullTextConsumption = process.argv[3];
  assert(entry.fullTextConsumption);
  entry.status = 'SOURCE169_BLIND_STAGE1_FULL_TEXT_INTAKEN_DOMAIN_HOLD_PRESERVED_NO_AUTHOR_RELEASE';
  entry.holds = freeze.residualHolds;
  entry.apparentPhysicalLineGroups = 23;
  entry.exactRegistration = 'UNKNOWN; not measured, no coordinate claim';
  entry.observedHeading = read(path.join(packet, 'source-inventory.json')).heading.literal;
  entry.boundary = 'Independently observed top h3; n47 assembly approval still awaits author comparison disposition';
  entry.knownSourceCharge = 6;
  entry.knownReviewCharge = 1;
  entry.knownTracked164169 = 46;
  entry.hiddenImageInternals = 'UNKNOWN';
  entry.provenanceQualification = 'Immutable direct role-scope clarification and direct assignment labels refer to parent-agent dispatch, not a new human prompt.';
  const output = path.join(base, 'source169-review-stage1-parent-intake.json');
  write(output, entry);
  review.stage1Intake = bind(output);
  review.stage1Retained = retain('nov21-1846-source169-review-stage1', entry, output);
  review.knownCharge = 1;
  review.status = entry.status;
  source.knownCharge = 6;
  source.holds = [...source.holds, ...entry.holds];
  suffix = 'blind_stage1_FULL_text_intake';
} else if (mode === 'review-stage2-release') {
  const source = progress.source169, review = source.review;
  assert(review.stage1Intake);
  assert.equal(review.authorReleased, false);
  assert.equal(review.closed, false);
  assert(!review.stage2Release);
  entry.agent = review.agent;
  entry.stage1Intake = verify(review.stage1Intake);
  entry.authorIntake = verify(source.intake);
  const author = path.join(base, 'source169-active');
  const master = read(path.join(author, 'manifest.json'));
  entry.authorManifest = bind(path.join(author, 'manifest.json'));
  entry.authorSeal = bind(path.join(author, 'seal.receipt.json'));
  entry.authorParts = master.file_parts.map(verify);
  entry.authorTextWhitelist = [
    'report.md', 'source.inventory.md', 'source.body.md', 'source.freeze.json',
    'band-ownership.md', 'band.freeze.json', 'native.input.page.md',
    'native/9c/pages/0169/page.md', 'native/9c/pages/0169/page.json',
    'native/9c/pages/0169/audit.json', 'invariance.json', 'native-inputs.json',
    'native.invocation.json', 'operations.final.json', 'continuity.md',
    'predecessor.continuity.json',
  ].map(name => bind(path.join(author, name)));
  entry.status = 'SOURCE169_ONE_AUTHOR_COMPARISON_RELEASED_AFTER_BLIND_FULL_STAGE1_INTAKE';
  entry.newImagesAuthorized = 0;
  entry.newDecodesAuthorized = 0;
  entry.holdsPreserved = source.holds;
  entry.scope = 'Source fidelity, real physical-wrap correspondence, and actual top-heading n47 boundary; n=1 interpretation and exact typography/registration uncertainty remain explicit, no new source review or claim of full strict compliance.';
  const output = path.join(base, 'source169-review-stage2-release.json');
  write(output, entry);
  review.stage2Release = bind(output);
  review.authorReleased = true;
  suffix = 'one_author_comparison_release';
} else if (mode === 'review-stage2-intake') {
  const source = progress.source169, review = source.review;
  assert(review.stage2Release);
  assert.equal(review.authorReleased, true);
  assert.equal(review.closed, false);
  assert(!review.stage2Intake);
  const packet = path.join(base, 'source169-review/stage2-author-comparison-20261121-c7a9f2');
  const manifestFile = path.join(packet, 'manifest.json'), manifest = read(manifestFile);
  assert.equal(bind(manifestFile).sha256,
    '73812414ce388b53a228e2b3486d8a79c49c6daaf1f51a84098ce080bddb302b');
  const parts = manifest.evidenceParts.map(verify);
  const records = parts.flatMap(row => read(path.resolve(repo, row.path)).records);
  assert.equal(records.length, 26);
  entry.files = [...records.map(verify), ...parts, bind(manifestFile)];
  assert.equal(entry.files.length, 30);
  entry.files.forEach(row => {
    assert(row.bytes <= 15360);
    assert.equal(fs.statSync(path.resolve(repo, row.path)).mode & 0o777, 0o444);
  });
  assert.equal(fs.statSync(packet).mode & 0o777, 0o555);
  const authorInputs = read(path.join(packet, 'inputs.author.json'));
  const independentInputs = read(path.join(packet, 'inputs.stage1.json'));
  const releaseInputs = read(path.join(packet, 'inputs.release.json'));
  const runtimeInputs = read(path.join(packet, 'inputs.runtime.json'));
  const references = [...authorInputs.references, ...independentInputs.references,
    independentInputs.manifestReference, releaseInputs.releaseReference,
    ...runtimeInputs.references];
  references.forEach(verify);
  entry.externalReferences = ['inputs.author.json', 'inputs.stage1.json',
    'inputs.release.json', 'inputs.runtime.json'].map(name => bind(path.join(packet, name)));
  entry.verifiedExternalReferenceCount = references.length;
  const receipt = read(path.join(packet, 'final-review-receipt.json'));
  assert.equal(receipt.comparisonCompleted, true);
  assert.equal(receipt.transcription, 'PASS WITH DIPLOMATIC DISCLOSURES');
  assert.equal(receipt.n48InterpretationHoldBlocksN47Boundary, false);
  assert.equal(receipt.comparisonAssertions, 421);
  assert.equal(receipt.newImagesOrDecodes, 0);
  assert.equal(receipt.sourceCounterFinalizerMath577Reruns, 0);
  const boundary = read(path.join(packet, 'boundary-disposition.json'));
  assert.equal(boundary.n47SourceRightBoundary, 'INDEPENDENTLY_CONFIRMED');
  assert.equal(boundary.boundaryStartsSection48InsteadOfContinuingN47, true);
  assert.equal(boundary.section48Complete, 'NOT ASSERTED');
  for (const stage of receipt.actualUniqueStages) {
    const actual = read(stage.receipt);
    assert.equal(actual.exitCode, 0);
    Object.values(actual.outputs).forEach(verify);
  }
  const map = read(path.join(packet, 'comparison-band-map.json'));
  const rows = map.parts.map(verify).flatMap(row => read(path.resolve(repo, row.path)).rows);
  assert.equal(rows.length, 23);
  entry.agent = review.agent;
  entry.fullTextConsumption = process.argv[3];
  assert(entry.fullTextConsumption);
  entry.status = 'SOURCE169_FULL_STAGE2_TEXT_INTAKEN_FAITHFUL_TRANSCRIPTION_WRAPS_N47_BOUNDARY_APPROVED_WITH_QUALIFICATIONS';
  entry.approvedScope = 'Faithful legible transcription and native physical-wrap correspondence with diplomatic disclosures; independently confirmed prior n47 source right boundary only. Not full strict compliance or section48 completion.';
  entry.holds = receipt.retainedUncertainties;
  entry.strictCompliance = false;
  entry.boundaryApproved = true;
  entry.knownSourceCharge = 6;
  entry.knownReviewCharge = 1;
  entry.knownTracked164169 = 46;
  entry.hiddenImageInternals = 'UNKNOWN';
  entry.provenanceQualification = 'Direct/user labels in immutable evidence are parent-agent dispatch facts; no new direct human prompts or invisible-runtime approval inferred.';
  const output = path.join(base, 'source169-review-stage2-parent-intake.json');
  write(output, entry);
  review.stage2Intake = bind(output);
  review.stage2Retained = retain('nov21-1846-source169-review-stage2', entry, output);
  review.approved = true;
  review.boundaryApproved = true;
  review.approvedScope = entry.approvedScope;
  review.status = entry.status;
  source.holds = [...new Set([...source.holds, ...entry.holds])];
  progress.status = '1846 SOURCE169 qualified fidelity/wraps and n47 boundary approved; reviewer actual closure and canonical retention pending';
  suffix = 'stage2_FULL_text_intake_qualified_boundary_approval';
} else if (mode === 'review-close') {
  const source = progress.source169, review = source.review;
  assert(review.stage2Intake);
  assert.equal(review.closed, false);
  assert.equal(review.boundaryApproved, true);
  entry.agent = review.agent;
  entry.toolReceipt = process.argv[3];
  assert(entry.toolReceipt);
  entry.stage2Intake = verify(review.stage2Intake);
  entry.status = 'SOURCE169_REVIEWER_ACTUALLY_CLOSED_AFTER_FULL_STAGE2_INTAKE';
  entry.holdsPreserved = source.holds;
  entry.knownTracked164169 = 46;
  const output = path.join(base, 'source169-review-closure.json');
  write(output, entry);
  review.closed = true;
  review.closure = bind(output);
  suffix = 'reviewer_actual_close';
} else {
  throw new Error('Explicit source169 control mode required');
}
const key = `nov21_1846_source169_${suffix}`;
assert(!Object.hasOwn(usage, key));
usage[key] = entry;
progress.observed_at = entry.at;
fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2) + '\n');
fs.writeFileSync(usageFile, JSON.stringify(usage, null, 2) + '\n');
console.log(JSON.stringify({ status: entry.status, agent: entry.agent,
  page: 169, suffix, parentImagesOrDecodes: 0,
  knownTracked: entry.knownTracked164169 ?? entry.knownTrackedBefore,
  files: entry.files?.length, completeLessonDelta: 0 }));

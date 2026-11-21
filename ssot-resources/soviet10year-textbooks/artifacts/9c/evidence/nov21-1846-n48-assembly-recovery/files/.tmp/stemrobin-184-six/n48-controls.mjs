import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const base = path.join(root, '.tmp/stemrobin-184-six');
const progressPath = path.join(base, 'source-progress.json');
const usagePath = path.join(root, '.intentfold/tickets/STEMROBIN-184/usage.json');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.relative(root, file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const progress = read(progressPath), usage = read(usagePath);
const [mode] = process.argv.slice(2);
const output = path.join(base, `n48-${mode}-parent-receipt.json`);
assert(!fs.existsSync(output));
assert(progress.source171.canonical);
assert.equal(progress.source171.qualifiedFidelityAccepted, true);
assert.equal(progress.source171.review.approved, false);
const entry = {
  schema: 'stemrobin1846/n48-scoped-assembly@1', at: new Date().toISOString(),
  mode, lesson: 'ana9-c4-s2-n48', finish: 'review', sameInvocation: true,
  parentNewImagesOrDecodes: 0, parentPermanentBudget: '24/24 unchanged',
  paidCalls: 0, sourceMathNativeGateReplays: 0, completeLessonDelta: 0,
  databasePublicationGitMergeDeployOrTicketClosure: 0,
  allHistoricalFailHoldUnknownPreserved: true, strictCompliance: false,
};
if (mode === 'first-fail-intake') {
  assert(!progress.n48);
  const folder = path.join(base, 'n48-assembly/9c');
  const stage = path.join(base, 'stages/n48-first-raw-text-assembly-nov21.receipt.json');
  assert.equal(read(stage).exitCode, 1);
  const exercises = read(path.join(folder, 'lessons/ana9-c4-s2-n48/exercises.json'));
  assert.equal(exercises.count, 7);
  assert.deepEqual(exercises.exercises.map(item => item.number),
    ['382', '383', '384', '385', '386', '387', 'q1']);
  assert.deepEqual(exercises.exercises[5].pages, ['p0170#16']);
  assert.deepEqual(exercises.exercises[6].pages, ['p0171#1']);
  const files = [
    path.join(folder, 'book.json'),
    ...['lesson.json', 'lesson.md', 'exercises.json']
      .map(name => path.join(folder, 'lessons/ana9-c4-s2-n48', name)),
    ...['stdout', 'stderr', 'receipt.json']
      .map(name => path.join(base, 'stages', `n48-first-raw-text-assembly-nov21.${name}`)),
    path.join(base, 'assemble-n48.py'),
    path.join(base, 'n48-controls.mjs'),
  ];
  const target = path.join(root,
    'ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov21-1846-n48-first-assembly-fail');
  assert(!fs.existsSync(target));
  fs.mkdirSync(target);
  const rows = files.map(file => {
    const input = bind(file);
    fs.readFileSync(file, 'utf8');
    if (file.endsWith('.json')) read(file);
    const destination = path.join(target, 'files', input.path);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(file, destination, fs.constants.COPYFILE_EXCL);
    fs.chmodSync(destination, 0o444);
    const retained = bind(destination);
    assert.equal(retained.sha256, input.sha256);
    return { origin: input.path, ...retained };
  });
  entry.status = 'N48_FIRST_ASSEMBLY_FAIL_RETAINED_UNNUMBERED_CONTINUATION_NOT_MERGED';
  entry.stage = bind(stage);
  entry.actualToolResult = 'Assembler printed mechanical PASS but produced7 exercises and unresolved387/q1; wrapper semantic count assertion failed exit1';
  entry.cause = 'Existing merge_across_pages requires equal exercise labels and rejects ex-cont labelnull after387, despite the already bound predecessor identity';
  entry.dependentStagesStopped = ['raw promotion', 'edition', 'answer', 'choice', 'offline completion'];
  entry.rows = rows;
  entry.sourceReferences = [169, 170, 171].map(page => bind(path.join(root,
    `ssot-resources/soviet10year-textbooks/artifacts/9c/pages/${String(page).padStart(4, '0')}/page.json`)));
  const manifest = path.join(target, 'manifest.json');
  fs.writeFileSync(manifest, JSON.stringify(entry, null, 2) + '\n', { flag: 'wx', mode: 0o444 });
  const freeze = folder => {
    for (const item of fs.readdirSync(folder, { withFileTypes: true })) {
      if (item.isDirectory()) freeze(path.join(folder, item.name));
    }
    fs.chmodSync(folder, 0o555);
  };
  freeze(target);
  entry.manifest = bind(manifest);
  progress.n48 = { status: entry.status, firstFailure: entry, completeLessonDelta: 0 };
} else if (mode === 'recovery-intake') {
  assert(progress.n48.firstFailure && !progress.n48.recovery);
  const stage = path.join(base, 'stages/n48-saved-assembly-text-check-recovery-first.receipt.json');
  assert.equal(read(stage).exitCode, 0);
  const folder = path.join(base, 'n48-assembly-recovery/9c');
  const identity = read(path.join(folder, 'continuation-identity.json'));
  const exercises = read(path.join(folder, 'lessons/ana9-c4-s2-n48/exercises.json'));
  assert.equal(exercises.count, 6);
  assert.deepEqual(exercises.exercises.map(item => item.number),
    ['382', '383', '384', '385', '386', '387']);
  assert.deepEqual(exercises.exercises[5].pages, ['p0170#16', 'p0171#1']);
  assert.equal(identity.sourceLabelOn171, null);
  assert.equal(identity.assemblyPredecessorIdentity, '387');
  assert.equal(identity.canonicalPageEdits, 0);
  assert.equal(identity.sharedToolEdits, 0);
  assert.equal(identity.assemblerReplays, 0);
  assert.equal(identity.status, 'SAVED_N48_ASSEMBLY_TEXT_CHECK_PASS_NO_ASSEMBLER_REPLAY');
  entry.status = 'N48_RAW_TEXT_ASSEMBLY_RECOVERED_ONLY_SCIENTIFIC_PHASES_PENDING';
  entry.stage = bind(stage);
  entry.identity = bind(path.join(folder, 'continuation-identity.json'));
  entry.originalRecoveryCheckFailure = identity.originalRecoveryCheckFailure;
  entry.recoveryFailureCause = identity.recoveryFailureCause;
  entry.files = ['book.json', 'continuation-identity.json',
    'lessons/ana9-c4-s2-n48/lesson.json',
    'lessons/ana9-c4-s2-n48/lesson.md',
    'lessons/ana9-c4-s2-n48/exercises.json'].map(name => bind(path.join(folder, name)));
  entry.originalFailure = progress.n48.firstFailure.manifest;
  entry.scientificHolds = {
    exercise386: 'Bound formula(1) now available in assembled source; zero-power and derivative-at-zero convention still requires qualified new answer interpretation, not retrospective old-HOLD promotion',
    exercise387: 'Both operands now bound to387, but graph-specific shape/answer proof is still a missing stage',
    historicalClaimsAndExactGlyphs: 'Preserved UNKNOWN, not inferred from mathematics',
  };
  entry.rawPromotionAndModernizationApproved = false;
  progress.n48.recovery = entry;
  progress.n48.status = entry.status;
} else throw new Error(`Unsupported mode: ${mode}`);
fs.writeFileSync(output, JSON.stringify(entry, null, 2) + '\n', { flag: 'wx', mode: 0o444 });
usage[`nov21_1846_n48_${mode}`] = entry;
progress.status = `${entry.status}; serial SOURCE172 work remains independent`;
fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2) + '\n');
fs.writeFileSync(usagePath, JSON.stringify(usage, null, 2) + '\n');
console.log(JSON.stringify({ status: entry.status, receipt: bind(output),
  manifest: entry.manifest, completeLessonDelta: 0, parentNewImagesOrDecodes: 0 }));

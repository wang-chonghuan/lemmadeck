import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const base = path.join(root, '.tmp/stemrobin-184-six');
const raw = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/9c');
const folder = path.join(base, 'n48-assembly-recovery/9c');
const output = path.join(folder, 'continuation-identity.json');
assert(!fs.existsSync(output));
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.relative(root, file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const progress = read(path.join(base, 'source-progress.json'));
const references = progress.n48.firstFailure.sourceReferences;
references.forEach(reference => assert.deepEqual(bind(path.join(root, reference.path)), reference));
const page170 = read(path.join(raw, 'pages/0170/page.json'));
const page171 = read(path.join(raw, 'pages/0171/page.json'));
const predecessor = page170.blocks[15], continuation = page171.blocks[0];
assert.equal(predecessor.kind, 'ex');
assert.equal(predecessor.label, '387');
assert.equal(predecessor.open, true);
assert.equal(continuation.label, null);
assert.equal(continuation.cont, true);
assert.equal(continuation.open, false);
const [binding] = page171.meta.continuation_bindings;
assert.equal(binding.predecessorPrintedExerciseNumber, '387');
assert.equal(binding.sourceNumberOnThisPage, null);
assert.equal(binding.predecessorCanonicalSha256, bind(path.join(raw, 'pages/0170/page.md')).sha256);
const expectedLines = [...predecessor.lines, ...continuation.lines];
const exercises = read(path.join(folder, 'lessons/ana9-c4-s2-n48/exercises.json'));
const index = read(path.join(folder, 'book.json'));
assert.equal(exercises.count, 6);
assert.deepEqual(exercises.exercises.map(item => item.number),
  ['382', '383', '384', '385', '386', '387']);
assert.deepEqual(exercises.exercises[5].pages, ['p0170#16', 'p0171#1']);
assert.deepEqual(exercises.exercises[5].lines, expectedLines);
assert.deepEqual(index.lessons.map(item => item.id), ['ana9-c4-s2-n48']);
assert.equal(index.audit.exercise_count, 6);
assert.deepEqual(index.audit.errors, []);
assert(!index.audit.warnings.some(warning => warning.includes('cont 接不上') || warning.includes('open 没接上')));
const priorStage = path.join(base, 'stages/n48-continuation-identity-assembly-recovery-first.receipt.json');
assert.equal(read(priorStage).exitCode, 1);
const stderr = fs.readFileSync(path.join(base,
  'stages/n48-continuation-identity-assembly-recovery-first.stderr'), 'utf8');
assert(stderr.includes('previous["lines"] + continuation["lines"]'));
const record = {
  status: 'SAVED_N48_ASSEMBLY_TEXT_CHECK_PASS_NO_ASSEMBLER_REPLAY',
  at: new Date().toISOString(),
  sourceLabelOn171: null, assemblyPredecessorIdentity: '387',
  sourceReferences: references, source171Binding: binding,
  expectedLinesFromUnmodifiedCanonicalSources: expectedLines,
  canonicalPageEdits: 0, sharedToolEdits: 0, sourceMathNativeGateReplays: 0,
  assemblerReplays: 0, imageViewsOrDecodes: 0, completeLessonDelta: 0,
  originalFirstFailurePreserved: true, originalRecoveryCheckFailure: bind(priorStage),
  recoveryFailureCause: 'Shallow block-copy aliases lines; merge extends predecessor lines in-place, so the post-run previous.lines + continuation.lines expected expression double-counted the continuation',
  savedAssemblyResult: 'Original producer stdout6exercises, correct387joinedrefs and intactsource-derivedlines; check-only recovery against immutable canonical blocks',
  scientificApproval: false, boundary: 'Heading49 and outgoing n49 prose excluded',
};
fs.writeFileSync(output, JSON.stringify(record, null, 2) + '\n', { flag: 'wx', mode: 0o444 });
console.log(JSON.stringify({ status: record.status, output: bind(output),
  assemblerReplays: 0, sourceMathNativeGateReplays: 0, completeLessonDelta: 0 }));

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const base = path.join(root, '.tmp/stemrobin-184-six');
const raw = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/9c');
const progressPath = path.join(base, 'source-progress.json');
const usagePath = path.join(root, '.intentfold/tickets/STEMROBIN-184/usage.json');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.relative(root, file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const progress = read(progressPath), usage = read(usagePath);
assert(progress.n48.missingScienceDraft && !progress.n48.sourceWhitelist);
assert(!progress.n48.missingScienceReview);
const sourcePath = path.join(base, 'n48-assembly-recovery/9c/lessons/ana9-c4-s2-n48/exercises.json');
assert.deepEqual(bind(sourcePath), progress.n48.missingScienceDraft.sourceExercises);
const exercises = read(sourcePath).exercises.filter(item => ['386', '387'].includes(item.number));
assert.deepEqual(exercises.map(item => item.number), ['386', '387']);
const theoremPath = path.join(raw, 'pages/0169/page.json');
const theoremPage = read(theoremPath);
assert.equal(theoremPage.blocks[0].lines[0], '48. 有理分式函数的导数');
const theorem = theoremPage.blocks[1];
assert.equal(theorem.kind, 'p');
assert(theorem.lines.some(line => line.includes("(x^n)'")));
const whitelistPath = path.join(base, 'n48-missing-science-source-whitelist.json');
assert(!fs.existsSync(whitelistPath));
const whitelist = {
  schema: 'stemrobin1846/n48-new-missing-science-source-whitelist@1',
  at: new Date().toISOString(),
  status: 'BOUND_SOURCE_PROBLEM_TEXT_ONLY_NOT_EXPECTED_ANSWERS_OR_NEW_PIXEL_FIDELITY',
  lesson: 'ana9-c4-s2-n48',
  theoremStatementForFormulaIdentityOnly: {
    lines: theorem.lines, sourceRef: 'p0169#2', source: bind(theoremPath),
    existingProofReplayAuthorized: false,
  },
  exercises: exercises.map(item => ({
    number: item.number, source_number: item.source_number,
    lines: item.lines, text: item.text, pages: item.pages,
  })),
  sourceExercises: bind(sourcePath),
  qualifications: 'Source-derived text is already bound; no new image-fidelity certification. Zero-power convention, strict glyphs and every historical HOLD/FAIL/UNKNOWN remain unchanged. This release supplies problems, not parent solutions or independent approval.',
  hiddenImageInternals: 'UNKNOWN', newImageViewsOrDecodesAuthorized: 0,
  priorSourceMathNativeGateReplaysAuthorized: 0,
  fullLessonApprovalAuthorized: false, completeLessonDelta: 0,
};
fs.writeFileSync(whitelistPath, JSON.stringify(whitelist, null, 2) + '\n', { flag: 'wx', mode: 0o444 });
const target = path.join(raw, 'evidence/nov21-1846-n48-missing-science-parent-draft');
assert(!fs.existsSync(target));
const inputs = new Map(progress.n48.missingScienceDraft.outputs.map(item => [item.path, item]));
inputs.set(progress.n48.missingScienceDraft.manifest.path, progress.n48.missingScienceDraft.manifest);
for (const file of [whitelistPath,
  path.join(base, 'prepare-n48-science-text-review.mjs'),
  path.join(base, 'n48-missing-science-review-instructions.md')]) {
  inputs.set(path.relative(root, file), bind(file));
}
for (const stage of ['n48-missing-science-preregister-first', 'n48-missing-science-draft-intake-first']) {
  for (const suffix of ['stdout', 'stderr', 'receipt.json']) {
    const file = path.join(base, `stages/${stage}.${suffix}`);
    inputs.set(path.relative(root, file), bind(file));
  }
}
fs.mkdirSync(target);
const rows = [...inputs.values()].map(item => {
  assert(!item.path.endsWith('.png'));
  assert.deepEqual(bind(path.join(root, item.path)), item);
  const output = path.join(target, 'files', item.path);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.copyFileSync(path.join(root, item.path), output, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(output, 0o444);
  return { origin: item.path, path: path.relative(target, output),
    bytes: item.bytes, sha256: item.sha256 };
});
const record = {
  schema: 'stemrobin1846/n48-new-missing-science-draft-retention@1',
  at: new Date().toISOString(), rows,
  status: 'NEW_N48_MISSING_SCIENCE_PARENT_DRAFT_RETAINED_NOT_INDEPENDENT_APPROVAL',
  priorAssemblyEvidenceReferenceOnly: progress.n48.assemblyEvidence,
  originalAssemblyFailureReferenceOnly: progress.n48.firstFailure.manifest,
  sourceWhitelist: bind(whitelistPath), independentReviewDispatched: false,
  oldPackagesCopied: false, newImagesOrDecodes: 0,
  sourceMathNativeGateReplays: 0, completeLessonDelta: 0,
  scientificApproval: false, zeroPowerConvention: 'HOLD/UNKNOWN_PRESERVED',
  strictCompliance: false, finish: 'review',
};
const manifest = path.join(target, 'manifest.json');
fs.writeFileSync(manifest, JSON.stringify(record, null, 2) + '\n', { flag: 'wx', mode: 0o444 });
const freeze = folder => {
  for (const item of fs.readdirSync(folder, { withFileTypes: true })) {
    if (item.isDirectory()) freeze(path.join(folder, item.name));
  }
  fs.chmodSync(folder, 0o555);
};
freeze(target);
progress.n48.sourceWhitelist = record.sourceWhitelist;
progress.n48.missingScienceDraft.evidence = bind(manifest);
usage.nov21_1846_n48_missing_science_draft_retention_and_text_whitelist = {
  at: record.at, status: record.status, manifest: bind(manifest),
  whitelist: record.sourceWhitelist, filesRetained: rows.length,
  independentReviewDispatched: false, completeLessonDelta: 0, newImagesOrDecodes: 0,
};
fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2) + '\n');
fs.writeFileSync(usagePath, JSON.stringify(usage, null, 2) + '\n');
console.log(JSON.stringify(usage.nov21_1846_n48_missing_science_draft_retention_and_text_whitelist));

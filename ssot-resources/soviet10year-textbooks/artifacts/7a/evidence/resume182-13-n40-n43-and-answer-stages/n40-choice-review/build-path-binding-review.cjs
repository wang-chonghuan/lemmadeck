const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { isDeepStrictEqual } = require("node:util");

const root = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
const scratch = path.join(root, ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13");
const owner = path.join(scratch, "n40-choice-review");
const destination = path.join(scratch, "n40-choice-path-bound");
const author = path.join(scratch, "n40-choice-affected-author/RECOVERY-BINDING");
const bindingPath = path.join(scratch, "n40-choice-evidence-binding.json");
const outputPath = path.join(destination, "review.json");
const receiptPath = path.join(destination, "binding-receipt.json");
const retainedRoot = path.join(root,
  "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s2-n40/choice-set/evidence");

for (const target of [outputPath, receiptPath]) {
  assert(!fs.existsSync(target), `Write-once output already exists: ${target}`);
}

const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const read = target => fs.readFileSync(target);
const load = target => JSON.parse(read(target).toString("utf8"));
const fileSha = target => sha(read(target));
const mode = target => (fs.statSync(target).mode & 0o777).toString(8).padStart(4, "0");

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.keys(value).sort().map(key =>
      `${canonical(key)}:${canonical(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value).replace(/[\u007f-\uffff]/g, character =>
    `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`);
}

function inDirectory(directory, candidate) {
  const relative = path.relative(directory, candidate);
  return relative !== "" && !relative.startsWith(`..${path.sep}`) &&
    relative !== ".." && !path.isAbsolute(relative);
}

function resolveRepo(reference) {
  const target = path.resolve(root, reference);
  assert(inDirectory(root, target), `Reference outside checkout: ${reference}`);
  assert(inDirectory(root, fs.realpathSync(target)),
    `Resolved reference outside checkout: ${reference}`);
  return target;
}

function structuredDiff(before, after, pointer = "") {
  if (isDeepStrictEqual(before, after)) return [];
  if (Array.isArray(before) && Array.isArray(after)) {
    assert.equal(before.length, after.length, `Changed array length: ${pointer}`);
    return before.flatMap((value, index) =>
      structuredDiff(value, after[index], `${pointer}/${index}`));
  }
  if (before !== null && after !== null &&
      typeof before === "object" && typeof after === "object" &&
      !Array.isArray(before) && !Array.isArray(after)) {
    assert.deepEqual(Object.keys(before).sort(), Object.keys(after).sort(),
      `Changed field set: ${pointer}`);
    return Object.keys(before).flatMap(key =>
      structuredDiff(before[key], after[key],
        `${pointer}/${key.replace(/~/g, "~0").replace(/\//g, "~1")}`));
  }
  return [{ pointer, before, after }];
}

const binding = load(bindingPath);
assert.equal(binding.records.length, 33);
assert.equal(binding.seedAndDraftBytesUnchanged, true);
assert.equal(binding.inheritedFIRST17Approvals, true);
assert.equal(binding.affectedQuestions, 3);

const preserved = [...fs.readdirSync(owner).map(name => path.join(owner, name))
  .filter(target => target !== __filename),
  bindingPath, ...binding.candidate.map(item => resolveRepo(item.path))].map(target => ({
  path: target, sha256: fileSha(target), mode: mode(target),
}));

const records = binding.records.map(record => {
  const original = resolveRepo(record.original.path);
  const retained = resolveRepo(record.retained.path);
  assert(inDirectory(retainedRoot, retained), "Retained reference outside n40 evidence");
  assert(inDirectory(retainedRoot, fs.realpathSync(retained)),
    "Retained resolved reference outside n40 evidence");
  const originalBytes = read(original);
  const retainedBytes = read(retained);
  assert.equal(sha(originalBytes), record.original.sha256);
  assert.equal(sha(retainedBytes), record.retained.sha256);
  assert(originalBytes.equals(retainedBytes), "Retained record changed bytes");
  return {
    original: { path: original, sha256: sha(originalBytes), mode: mode(original) },
    retained: { path: retained, sha256: sha(retainedBytes), mode: mode(retained) },
    byteIdentical: true,
  };
});
assert.equal(new Set(records.map(item => item.original.path)).size, 33);
assert.equal(new Set(records.map(item => item.retained.path)).size, 33);

const candidates = binding.candidate.map(item => {
  const target = resolveRepo(item.path);
  assert(inDirectory(destination, target));
  assert.equal(fileSha(target), item.sha256);
  return { path: target, sha256: item.sha256 };
});
assert.deepEqual(candidates.map(item => path.basename(item.path)).sort(),
  ["draft.json", "review.inherited.json", "seed.json"]);

const originalPath = resolveRepo(binding.originalReview.path);
assert.equal(fileSha(originalPath), binding.originalReview.sha256);
assert.equal(binding.originalReview.sha256,
  "7abe5fe3c8320793a2fb0aa4a1b45ee2962bf1237e99f5bd996b4adf3def748a");
const original = load(originalPath);
const inheritedPath = path.join(destination, "review.inherited.json");
const inheritedBytes = read(inheritedPath);
const inherited = JSON.parse(inheritedBytes.toString("utf8"));
const differences = structuredDiff(original, inherited);
assert.equal(differences.length, 0,
  "This disclosed inherited review has no authorized content/citation differences");
assert(read(originalPath).equals(inheritedBytes));

const pathCitations = [];
function collectCitations(value, pointer = "") {
  if (typeof value === "string" &&
      /(?:\.intentfold\/|ssot-resources\/|\/Users\/|[\w-]+\.(?:json|record|sha256|md|txt)\b)/.test(value)) {
    pathCitations.push({ pointer, value });
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => collectCitations(item, `${pointer}/${index}`));
  } else if (value !== null && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) =>
      collectCitations(item, `${pointer}/${key}`));
  }
}
collectCitations(inherited);
assert.equal(pathCitations.length, 0);

const seedPath = path.join(destination, "seed.json");
const draftPath = path.join(destination, "draft.json");
for (const name of ["seed.json", "draft.json"]) {
  assert(read(path.join(destination, name)).equals(read(path.join(author, name))));
}
const seed = load(seedPath);
const draft = load(draftPath);
assert.equal(sha(canonical(seed)),
  "b09b1b3cd77b2721598378c273403291ac0863758200f6a5539182263866d6e7");
assert.equal(sha(canonical(draft)),
  "db0819e76a9eb146bf14ca6f803b4c7b72d4b3826356f24123da477a3c3fe5c3");
assert.equal(inherited.seed_sha256, sha(canonical(seed)));
assert.equal(inherited.draft_sha256, sha(canonical(draft)));
assert.equal(inherited.outcome, "pass");

const first = load(path.join(owner, "review-FIRST.json"));
const truths = load(path.join(owner,
  "affected-every-option-true-sets-RECOVERY-BINDING.json"));
const affectedIds = new Set(truths.questions.map(question => question.question_id));
assert.equal(affectedIds.size, 3);
const firstById = new Map(first.question_reviews.map(question =>
  [question.question_id, question]));
const inheritedById = new Map(inherited.question_reviews.map(question =>
  [question.question_id, question]));
const carried = inherited.question_reviews.filter(question =>
  !affectedIds.has(question.question_id));
assert.equal(carried.length, 17);
for (const question of carried) {
  assert.deepEqual(question, firstById.get(question.question_id));
}
for (const frozen of truths.questions) {
  assert.deepEqual(inheritedById.get(frozen.question_id).mathematics, frozen.mathematics);
}
for (const question of draft.questions) {
  assert.deepEqual(question.key.correct,
    inheritedById.get(question.id).mathematics.correct);
}
const optionCount = review => review.question_reviews.reduce((total, question) =>
  total + question.mathematics.option_checks.length, 0);
assert.equal(first.outcome, "blocked");
assert.equal(first.question_reviews.length, 20);
assert.equal(optionCount(first), 87);
assert.equal(inherited.question_reviews.length, 20);
assert.equal(draft.questions.length, 20);
assert.equal(optionCount(inherited), 84);
assert.equal(draft.questions.reduce((total, question) =>
  total + question.view.options.length, 0), 84);

const receipt = {
  schema: "stemrobin182/n40-choice-path-binding-review@1",
  ticket: "STEMROBIN-182",
  status: "PASS",
  frozenAtUtc: new Date().toISOString(),
  mode: "0444",
  writeOnce: true,
  bindingInput: { path: bindingPath, sha256: fileSha(bindingPath) },
  bindingScript: { path: __filename, sha256: fileSha(__filename), mode: "0444" },
  candidates,
  retainedRecords: records,
  retainedRecordCount: 33,
  retainedReferencesExistAndResolveWithinN40Evidence: true,
  retainedRecordsByteIdenticalToOriginals: true,
  inheritedReview: { path: inheritedPath, sha256: sha(inheritedBytes) },
  originalReview: { path: originalPath, sha256: fileSha(originalPath) },
  outputReview: {
    path: outputPath,
    sha256: sha(inheritedBytes),
    canonicalSha256: sha(canonical(inherited)),
  },
  structuredDifferencesOriginalToInherited: differences,
  structuredDifferencesInheritedToOutput: [],
  citationDifferenceCount: 0,
  pathCitationCountInCanonicalReview: 0,
  citationOnlyGate: "PASS_NO_DIFFERENCE",
  citationBindingObservation: "The disclosed inherited review is byte-identical to the frozen canonical review and contains no path citation strings. Therefore no citation replacement is needed or performed. Durable references are bound and verified by this receipt; metadata is not treated as proof that citation edits occurred.",
  sourceAndKeysInheritedByExactSeedAndDraftByteEquality: true,
  seedCanonicalSha256: sha(canonical(seed)),
  draftCanonicalSha256: sha(canonical(draft)),
  unchangedFIRSTApprovals: carried.map(question => question.question_id),
  affectedTruthSetsInheritedExactly: [...affectedIds],
  currentQuestionCount: 20,
  currentOptionCount: 84,
  FIRSTQuestionCount: 20,
  FIRSTOptionCount: 87,
  FIRSTOutcomeRetained: "blocked",
  originalSemanticReviewOutcomeInherited: "pass",
  imagesOpened: 0,
  validatorInvocations: 0,
  sourceReviewRepeats: 0,
  mathematicsReviewRepeats: 0,
  preservedInputsAndFreezes: preserved,
  findings: [],
  scope: "Offline path/hash/structured inheritance verification only. No product/DB writes, publication, promotion, finalizer, app, network or commit.",
};

for (const item of preserved) {
  assert.equal(fileSha(item.path), item.sha256);
  assert.equal(mode(item.path), item.mode);
}
for (const item of records) {
  for (const side of [item.original, item.retained]) {
    assert.equal(fileSha(side.path), side.sha256);
    assert.equal(mode(side.path), side.mode);
  }
}
fs.writeFileSync(outputPath, inheritedBytes, { flag: "wx", mode: 0o444 });
fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`,
  { flag: "wx", mode: 0o444 });
fs.chmodSync(outputPath, 0o444);
fs.chmodSync(receiptPath, 0o444);
fs.chmodSync(__filename, 0o444);
assert.equal(fileSha(outputPath), receipt.outputReview.sha256);
assert.equal(mode(outputPath), "0444");
assert.equal(mode(receiptPath), "0444");
console.log(JSON.stringify({
  status: receipt.status,
  currentQuestionCount: 20,
  currentOptionCount: 84,
  FIRSTOptionCount: 87,
  retainedRecordCount: 33,
  inheritedFIRSTApprovals: carried.length,
  affectedTruthSetsInherited: affectedIds.size,
  citationDifferenceCount: 0,
  review: receipt.outputReview,
  bindingReceipt: { path: receiptPath, sha256: fileSha(receiptPath) },
  mode: "0444",
  validatorInvocations: 0,
}, null, 2));

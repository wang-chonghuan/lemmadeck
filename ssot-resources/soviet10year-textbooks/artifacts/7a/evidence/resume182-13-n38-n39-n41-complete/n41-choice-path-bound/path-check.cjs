"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
const BASE = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const OWN = `${BASE}/n41-choice-path-bound`;
const ORIGINAL = `${BASE}/n41-choice-review/review.json`;
const INHERITED = `${OWN}/review.inherited.json`;
const STAGE3 = `${BASE}/n41-choice-review/stage3-receipt.json`;
const CANDIDATE = `${BASE}/n41-choice-position-affected`;
const EVIDENCE =
  "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s2-n41/choice-set/evidence";
const OUTPUTS = [`${OWN}/review.json`, `${OWN}/path-review.json`, `${OWN}/path-check.cjs`];
const PINNED = {
  binding: "725710fb6efadab6cf7bc088579909032701c075cf1e1f03828bd699c765d856",
  stage3: "9a05fe2ce89bc2b4e82bb9ad663d9e8557f39a6d27b6e38cf23c0ed8c052848a",
  original: "69349f61d7059b0ad200b0c9aff8bfe7f9c32ac3fd6be80244476018f44dff49",
  inherited: "1ab42a8a0be46d652f7d30c8050288144530141d8e262e6770f3043bd7d782ac",
};
const EXPECTED_SUBSTITUTIONS = [
  {
    from: {
      path: `${BASE}/n41-n42-figure-author/fig-56/fig-56-width640-REPAIR-1.png`,
      sha256: "c33620eab37e416985daa2f33ed661ba1daf4a75d94dabceb28c5cbcec7aad4d",
    },
    to: {
      path: `${EVIDENCE}/fig-56-current-preview.png`,
      sha256: "c33620eab37e416985daa2f33ed661ba1daf4a75d94dabceb28c5cbcec7aad4d",
    },
  },
  {
    from: {
      path: `${BASE}/n41-n42-figure-author/fig-57/fig-57-width640-ASSOCIATION-2.png`,
      sha256: "9a1f2205d05fcb6d02c19d40a4a611718e96ddacf05411e6e3694117a4d73f62",
    },
    to: {
      path: `${EVIDENCE}/fig-57-current-preview.png`,
      sha256: "9a1f2205d05fcb6d02c19d40a4a611718e96ddacf05411e6e3694117a4d73f62",
    },
  },
];
const READABLE = new Set([
  `${OWN}/binding.json`,
  INHERITED,
  ORIGINAL,
  STAGE3,
  `${OWN}/seed.json`,
  `${OWN}/draft.json`,
  `${CANDIDATE}/seed.json`,
  `${CANDIDATE}/draft.json`,
  ...OUTPUTS,
  ...EXPECTED_SUBSTITUTIONS.flatMap((entry) => [entry.from.path, entry.to.path]),
]);

function absolute(relative) {
  assert(READABLE.has(relative), `Not an authorized input/output: ${relative}`);
  const target = path.resolve(ROOT, relative);
  const resolved = fs.realpathSync(target);
  assert.equal(resolved, target, `Refusing a redirected path: ${relative}`);
  assert(fs.statSync(target).isFile(), `Not a regular file: ${relative}`);
  return target;
}

function read(relative) {
  return fs.readFileSync(absolute(relative));
}

function sha256(bytes) {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

function snapshot(relative, expected) {
  const bytes = read(relative);
  const actual = sha256(bytes);
  if (expected) assert.equal(actual, expected, `SHA mismatch: ${relative}`);
  return { path: relative, sha256: actual, byte_length: bytes.length, bytes };
}

function hashRecord(entry) {
  return { path: entry.path, sha256: entry.sha256, byte_length: entry.byte_length };
}

// Match the choice contract's sorted, ASCII-escaped compact JSON digest.
// These snapshots contain no numeric values; fail on unsafe numeric additions.
function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value !== null && typeof value === "object") {
    const keys = Object.keys(value).sort();
    assert(keys.every((key) => /^[\x20-\x7e]*$/.test(key)), "Non-ASCII object key");
    return `{${keys.map((key) => `${canonicalJson(key)}:${canonicalJson(value[key])}`).join(",")}}`;
  }
  if (typeof value === "number") assert(Number.isSafeInteger(value), "Unsafe canonical number");
  return JSON.stringify(value).replace(/[\u007f-\uffff]/g, (character) =>
    `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`,
  );
}

function canonicalHash(value) {
  return sha256(Buffer.from(canonicalJson(value), "utf8"));
}

function strings(value, pointer = "", result = []) {
  if (typeof value === "string") result.push({ pointer, value });
  else if (Array.isArray(value)) value.forEach((item, index) => strings(item, `${pointer}/${index}`, result));
  else if (value !== null && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      const escaped = key.replace(/~/g, "~0").replace(/\//g, "~1");
      strings(item, `${pointer}/${escaped}`, result);
    }
  }
  return result;
}

assert.equal(process.cwd(), ROOT, "Run only from the explicitly assigned checkout");
assert(process.argv.length === 2 || (process.argv.length === 3 && process.argv[2] === "--seal"));
const seal = process.argv[2] === "--seal";
const bindingSnapshot = snapshot(`${OWN}/binding.json`, PINNED.binding);
const stage3Snapshot = snapshot(STAGE3, PINNED.stage3);
const originalSnapshot = snapshot(ORIGINAL, PINNED.original);
const inheritedSnapshot = snapshot(INHERITED, PINNED.inherited);
const binding = JSON.parse(bindingSnapshot.bytes);
const stage3 = JSON.parse(stage3Snapshot.bytes);
const original = JSON.parse(originalSnapshot.bytes);
const inherited = JSON.parse(inheritedSnapshot.bytes);
assert.deepStrictEqual(binding.originalReview, { path: ORIGINAL, sha256: PINNED.original });
assert.deepStrictEqual(binding.inheritedReview, { path: INHERITED, sha256: PINNED.inherited });
assert.deepStrictEqual(binding.substitutions, EXPECTED_SUBSTITUTIONS);
assert.equal(binding.seedDraftBytesUnchanged, true);
assert.equal(binding.onlyPreviewCitationPathsChanged, true);
assert.equal(binding.imagesOpened, 0);
assert.equal(binding.independentPathOnlyReviewPending, true);
assert.equal(stage3.checkout, ROOT);
assert.equal(stage3.ticket, "STEMROBIN-182");
assert.equal(stage3.stage, 3);
assert.equal(stage3.result, "OFFLINE_CANONICAL_INDEPENDENT_REVIEW_PASS_VALIDATOR_EXIT_0");
assert.equal(stage3.formal_review.sha256, PINNED.original);
assert.equal(stage3.formal_review.outcome, "pass");
assert.equal(stage3.formal_review.reviewer_kind, "independent_agent");
assert.equal(stage3.validator.exit_code, 0);
assert.equal(stage3.validator.with_review_invocations_this_stage, 1);
assert.equal(original.schema, "s10y-choice-review-v1");
assert.equal(original.outcome, "pass");
assert.equal(original.reviewer.kind, "independent_agent");
assert.deepStrictEqual(inherited.reviewer, original.reviewer);

const replacementCounts = [0, 0];
const changedFields = [];
function substitute(value, pointer = "") {
  if (typeof value === "string") {
    let rewritten = value;
    const applied = [];
    binding.substitutions.forEach((entry, index) => {
      const count = rewritten.split(entry.from.path).length - 1;
      replacementCounts[index] += count;
      if (count) applied.push(index);
      rewritten = rewritten.split(entry.from.path).join(entry.to.path);
    });
    if (rewritten !== value) changedFields.push({ json_pointer: pointer, substitution_indices: applied });
    return rewritten;
  }
  if (Array.isArray(value)) return value.map((item, index) => substitute(item, `${pointer}/${index}`));
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, substitute(item, `${pointer}/${key}`)]),
    );
  }
  return value;
}

const expectedInherited = substitute(original);
assert.deepStrictEqual(replacementCounts, [1, 1], "Exactly two literal path substitutions required");
assert.deepStrictEqual(changedFields, [
  { json_pointer: "/figure_checks/0/observation", substitution_indices: [0] },
  { json_pointer: "/figure_checks/1/observation", substitution_indices: [1] },
]);
assert.deepStrictEqual(inherited, expectedInherited, "Non-path review change detected");
const scratchCitations = strings(inherited).filter(({ value }) =>
  /(?:\.tmp\/|\/tmp\/|\/(?:private\/)?var\/folders\/|(?:^|\s|[`"'(])tmp\/)/.test(value),
);
assert.equal(scratchCitations.length, 0, "Unresolved explicit scratch citation");
for (const entry of binding.substitutions) {
  assert.equal(strings(inherited).filter(({ value }) => value.includes(entry.from.path)).length, 0);
  const count = strings(inherited).reduce((total, { value }) =>
    total + value.split(entry.to.path).length - 1, 0);
  assert.equal(count, 1, "Retained preview citation must occur exactly once");
}

// PNGs are read solely as opaque bytes for SHA-256, never decoded or displayed.
const pngBindings = binding.substitutions.map((entry, index) => {
  const from = snapshot(entry.from.path, entry.from.sha256);
  const to = snapshot(entry.to.path, entry.to.sha256);
  assert.equal(from.sha256, to.sha256, "Preview bytes changed during relocation");
  return {
    substitution_index: index,
    original: hashRecord(from),
    retained: hashRecord(to),
    identical_sha256: true,
    image_decoded_or_displayed: false,
  };
});

const sourceSnapshots = [];
const boundObjects = {};
const seedDraft = ["seed", "draft"].map((name) => {
  // Original candidates are read for raw byte comparison only, never parsed.
  const candidate = snapshot(`${CANDIDATE}/${name}.json`);
  const bound = snapshot(`${OWN}/${name}.json`);
  assert(candidate.bytes.equals(bound.bytes), `${name} bytes changed`);
  const parsed = JSON.parse(bound.bytes);
  boundObjects[name] = parsed;
  const canonical = canonicalHash(parsed);
  const byteField = name === "seed" ? "seed_byte_sha256" : "candidate_draft_byte_sha256";
  const canonicalField = name === "seed" ? "seed_canonical_sha256" : "candidate_draft_canonical_sha256";
  assert.equal(candidate.sha256, stage3.reviewed_snapshot[byteField]);
  assert.equal(canonical, stage3.reviewed_snapshot[canonicalField]);
  assert.equal(original[`${name}_sha256`], canonical);
  assert.equal(inherited[`${name}_sha256`], canonical);
  sourceSnapshots.push(candidate, bound);
  return {
    kind: name,
    original_candidate: hashRecord(candidate),
    bound_input: hashRecord(bound),
    byte_exact_equal: true,
    canonical_sha256: canonical,
    stage3_and_both_review_digests_match: true,
    original_candidate_parsed: false,
    solutions_or_keys_recomputed: false,
  };
});
assert.equal(boundObjects.draft.seed_sha256, inherited.seed_sha256);

// Digest retained review evidence without judging any proof or answer set again.
const unchangedEvidence = [
  ["reviewer", original.reviewer, inherited.reviewer],
  ["source_reviews", original.source_reviews, inherited.source_reviews],
  ["question_reviews", original.question_reviews, inherited.question_reviews],
  ["mathematics", original.question_reviews.map((item) => item.mathematics),
    inherited.question_reviews.map((item) => item.mathematics)],
  ["true_sets", original.question_reviews.map((item) => item.mathematics.correct),
    inherited.question_reviews.map((item) => item.mathematics.correct)],
  ["new_figure_reviews", original.new_figure_reviews, inherited.new_figure_reviews],
  ["figure_checks_except_observations",
    original.figure_checks.map(({ observation, ...rest }) => rest),
    inherited.figure_checks.map(({ observation, ...rest }) => rest)],
  ["figure_observations_after_exact_path_substitutions",
    expectedInherited.figure_checks.map((item) => item.observation),
    inherited.figure_checks.map((item) => item.observation)],
].map(([field, before, after]) => {
  assert.deepStrictEqual(before, after, `Inherited evidence changed: ${field}`);
  const beforeHash = canonicalHash(before);
  const afterHash = canonicalHash(after);
  assert.equal(beforeHash, afterHash);
  return {
    field,
    original_or_path_normalized_sha256: beforeHash,
    inherited_sha256: afterHash,
    deep_equal: true,
    semantic_recheck_performed: false,
  };
});
const checkSnapshot = snapshot(`${OWN}/path-check.cjs`);
const preserved = [bindingSnapshot, stage3Snapshot, originalSnapshot, inheritedSnapshot, ...sourceSnapshots];

const receipt = {
  schema: "stemrobin182/n41-choice-independent-path-binding-receipt@1",
  ticket: "STEMROBIN-182",
  checkout: ROOT,
  branch: "codex/STEMROBIN-182-textbooks",
  result: "PASS_PATH_ONLY_INDEPENDENT_BINDING",
  scope: "Independent byte/path binding only; canonical independent content approval is inherited unchanged.",
  checked_at: new Date().toISOString(),
  inputs: {
    binding: hashRecord(bindingSnapshot),
    original_approved_review: hashRecord(originalSnapshot),
    inherited_approved_review: hashRecord(inheritedSnapshot),
    stage3_receipt: hashRecord(stage3Snapshot),
    seed_draft: seedDraft,
  },
  inherited_stage3: {
    outcome: stage3.formal_review.outcome,
    canonical_independent_review_sha256: stage3.formal_review.sha256,
    recorded_validator_exit_code: stage3.validator.exit_code,
    recorded_with_review_invocations: stage3.validator.with_review_invocations_this_stage,
    validator_invocations_this_path_binding: 0,
    validation_of_retention_snapshot: "Not run; later parent-owned.",
  },
  path_comparison: {
    full_json_deep_equal_after_only_declared_substitutions: true,
    literal_substitution_counts: replacementCounts,
    changed_string_fields: changedFields,
    png_bindings: pngBindings,
    unresolved_explicit_scratch_citations: [],
    noncitation_observation_content_unchanged: true,
    new_pixel_claim: false,
  },
  unchanged_evidence: unchangedEvidence,
  retained_content_counts_not_resolved_again: {
    source_reviews: inherited.source_reviews.length,
    complete_true_sets: inherited.question_reviews.length,
    option_proofs: inherited.question_reviews.reduce((sum, item) => sum + item.mathematics.option_checks.length, 0),
    existing_figure_observations: inherited.figure_checks.length,
  },
  preservation: {
    approved_review_output: {
      path: `${OWN}/review.json`,
      sha256: PINNED.inherited,
      byte_length: inheritedSnapshot.bytes.length,
      byte_exact_to_inherited: true,
    },
    first_and_original_review_untouched: true,
    first_package_opened_or_modified: false,
    all_authorized_inputs_unchanged: true,
    other_edits_preserved: true,
    no_preexisting_output_overwritten: true,
  },
  check: {
    ...hashRecord(checkSnapshot),
    command: `node ${OWN}/path-check.cjs --seal`,
    read_only_recheck_command: `node ${OWN}/path-check.cjs`,
    subprocesses_or_external_dependencies: 0,
  },
  prohibited_operations: {
    image_opens_decodes_renders_or_screenshots: 0,
    source_reopens: 0,
    new_source_math_key_or_option_proof_solves: 0,
    validators_tests_or_app_runs: 0,
    network_env_database_dependency_or_paid_operations: 0,
    promotion_retention_publication_or_commit_operations: 0,
    semantic_or_automatic_proof_claimed: false,
  },
  freeze: {
    exclusive_written_files: OUTPUTS,
    mode: "0444",
    output_hashes_and_modes_verified_after_seal: true,
    receipt_sha256: "Printed by path-check.cjs after final bytes; no self-referential hash embedded.",
  },
  stop: "Path-only PASS sealed. Do not rerun proofs, reopen images or run the parent-owned retention validator.",
};

if (seal) {
  assert.equal(fs.realpathSync(path.resolve(ROOT, OWN)), path.resolve(ROOT, OWN));
  for (const relative of OUTPUTS.slice(0, 2)) {
    assert(!fs.existsSync(path.resolve(ROOT, relative)), `Preserve existing output: ${relative}`);
  }
  for (const entry of preserved) assert.equal(sha256(read(entry.path)), entry.sha256, `Input changed: ${entry.path}`);
  fs.writeFileSync(path.resolve(ROOT, `${OWN}/review.json`), inheritedSnapshot.bytes, { flag: "wx", mode: 0o600 });
  fs.writeFileSync(path.resolve(ROOT, `${OWN}/path-review.json`), `${JSON.stringify(receipt, null, 2)}\n`, {
    flag: "wx",
    mode: 0o600,
  });
  for (const relative of OUTPUTS) fs.chmodSync(absolute(relative), 0o444);
} else {
  const saved = JSON.parse(read(`${OWN}/path-review.json`));
  receipt.checked_at = saved.checked_at;
  assert.deepStrictEqual(saved, receipt, "Saved path receipt differs from checked inputs");
}

assert(read(`${OWN}/review.json`).equals(inheritedSnapshot.bytes), "Output is not byte-exact inherited review");
assert.equal(sha256(read(`${OWN}/path-check.cjs`)), checkSnapshot.sha256);
for (const entry of preserved) assert.equal(sha256(read(entry.path)), entry.sha256, `Input changed: ${entry.path}`);
const outputHashes = OUTPUTS.map((relative) => {
  const mode = fs.statSync(absolute(relative)).mode & 0o777;
  assert.equal(mode, 0o444, `Output not frozen: ${relative}`);
  return { ...hashRecord(snapshot(relative)), mode: "0444" };
});
console.log(JSON.stringify({
  result: receipt.result,
  operation: seal ? "sealed" : "read_only_binding_check",
  path_substitutions: replacementCounts.reduce((sum, count) => sum + count, 0),
  pngs_decoded_or_displayed: 0,
  validator_invocations: 0,
  original_review_unchanged_sha256: originalSnapshot.sha256,
  outputs: outputHashes,
}, null, 2));

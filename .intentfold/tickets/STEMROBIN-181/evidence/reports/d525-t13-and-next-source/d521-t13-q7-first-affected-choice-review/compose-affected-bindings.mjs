import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const out = path.dirname(fileURLToPath(import.meta.url));
const tmp = path.dirname(out);
const oldRoot = path.join(tmp, "d502-t13-q367-first-bilingual-choice-author");
const firstRoot = path.join(tmp, "d503-t13-q367-first-independent-choice-review/first-semantic-review");
const repairRoot = path.join(tmp, "d520-t13-q7-first-choice-stem-repair");
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const read = (name) => JSON.parse(fs.readFileSync(name, "utf8"));

// These snapshots contain ASCII field names and integer-only numeric metadata.
function canonical(value) {
  const sorted = (item) => {
    if (Array.isArray(item)) return item.map(sorted);
    if (item && typeof item === "object") {
      return Object.fromEntries(Object.keys(item).sort().map((key) => [key, sorted(item[key])]));
    }
    return item;
  };
  return JSON.stringify(sorted(value)).replace(/[\u007f-\uffff]/g, (character) =>
    `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`);
}

const digest = (value) => hash(canonical(value));
const binding = (name) => {
  const bytes = fs.readFileSync(name);
  return {
    path: name,
    sha256: hash(bytes),
    bytes: bytes.length,
    mode: (fs.statSync(name).mode & 0o777).toString(8).padStart(4, "0"),
  };
};

function verifyFreeze(name, expected) {
  const seal = binding(name);
  assert.equal(seal.sha256, expected);
  assert.equal(seal.mode, "0444");
  const data = read(name);
  for (const file of data.files) assert.deepEqual(binding(file.path), file);
  return { ...seal, verified_declared_files: data.files.length };
}

function differences(before, after, pointer = "") {
  if (canonical(before) === canonical(after)) return [];
  if (before && after && typeof before === "object" && typeof after === "object" &&
      Array.isArray(before) === Array.isArray(after)) {
    const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])];
    return keys.flatMap((key) => differences(
      before[key], after[key], `${pointer}/${key.replace(/~/g, "~0").replace(/\//g, "~1")}`));
  }
  return [{ pointer, before, after }];
}

function createJSON(relative, value) {
  const target = path.join(out, relative);
  assert.ok(target.startsWith(`${out}${path.sep}`));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
  fs.chmodSync(target, 0o444);
  return binding(target);
}

const repairSeal = verifyFreeze(
  path.join(repairRoot, "author-freeze.json"),
  "0d7a28c51e1d4e4fb5432e86ce06991ccf2de3e794e105329b74f2cafd35b837");
const firstSeal = verifyFreeze(
  path.join(firstRoot, "review-freeze.json"),
  "2c3677b44093649e77f6f6dea1ba06de0d9fb52c70e44ddc68fb904810336cc2");
const oldSeal = verifyFreeze(
  path.join(oldRoot, "author-freeze.json"),
  "1e071a971ba9627fc9a1a40ab64e4aa3c61f4aa3c3c05aa3c624c20b14ca61c2");
const affected = read(path.join(out, "affected-review.json"));
assert.equal(affected.affected_outcome, "pass");
const sealedVisible = read(path.join(firstRoot, "visible-assessment.json"));
const result = {
  schema: "stemrobin181/t13-q7-first-affected-diff-inheritance-bindings@1",
  ticket: "STEMROBIN-181",
  batch: "d521",
  checked_at: new Date().toISOString(),
  canonical_rule: 'json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(",", ":"))',
  known_previous_canonical_digests_checked: true,
  repair_seal: repairSeal,
  original_first_semantic_seal: firstSeal,
  original_author_seal: oldSeal,
  affected_evidence: binding(path.join(out, "affected-review.json")),
  locales: [],
  native_validate_calls: { zh: 0, en: 0 },
  semantic_re_review_of_Q3_Q6: false,
  source_rederivations: 0,
  image_totals: { old: 24, new: 0, cumulative: 24, reset: false },
};
const pendingWrites = [];

for (const locale of ["zh", "en"]) {
  const info = affected.locales[locale];
  const oldDraftPath = path.join(oldRoot, locale, "draft.json");
  const newDraftPath = path.join(repairRoot, locale, "draft.json");
  const originalReviewPath = path.join(firstRoot, locale, "review.json");
  const oldDraft = read(oldDraftPath);
  const newDraft = read(newDraftPath);
  const originalReview = read(originalReviewPath);
  assert.equal(digest(oldDraft), originalReview.draft_sha256);
  assert.equal(hash(fs.readFileSync(newDraftPath)), info.raw_sha256);
  assert.equal(digest(newDraft), info.canonical_sha256);
  assert.equal(newDraft.seed_sha256, originalReview.seed_sha256);
  const delta = differences(oldDraft, newDraft);
  assert.equal(delta.length, 1);
  assert.equal(delta[0].pointer, "/questions/2/view/stem");
  assert.equal(delta[0].after.split(info.insertion).length, 2);
  assert.equal(
    delta[0].after.replace(info.insertion + (locale === "en" ? " " : ""), ""),
    delta[0].before);
  assert.deepEqual(
    sealedVisible.locales[locale][2].conditional_true_set_if_direct_unreflected_route_added, ["a"]);
  const unchanged = [0, 1].map((index) => {
    assert.equal(digest(oldDraft.questions[index]), digest(newDraft.questions[index]));
    return {
      source_number: oldDraft.questions[index].source_numbers[0],
      complete_old_question_sha256: digest(oldDraft.questions[index]),
      complete_new_question_sha256: digest(newDraft.questions[index]),
      inherited_source_review_sha256: digest(originalReview.source_reviews[index]),
      inherited_question_review_sha256: digest(originalReview.question_reviews[index]),
      copied_records_unchanged: true,
      new_semantic_review: false,
    };
  });
  const review = structuredClone(originalReview);
  review.draft_sha256 = digest(newDraft);
  review.source_reviews[2].coverage = structuredClone(affected.native_Q7_source_coverage);
  review.question_reviews[2] = structuredClone(affected.native_Q7_question_review);
  review.outcome = "pass";
  for (const index of [0, 1]) {
    assert.deepEqual(review.source_reviews[index], originalReview.source_reviews[index]);
    assert.deepEqual(review.question_reviews[index], originalReview.question_reviews[index]);
  }
  assert.deepEqual(review.mathematics, undefined);
  assert.deepEqual(review.question_reviews[2].mathematics.correct, ["a"]);
  assert.deepEqual(newDraft.questions[2].key.correct, ["a"]);
  for (const check of review.question_reviews[2].mathematics.option_checks) {
    const rationale = newDraft.questions[2].key.rationales.find(
      (item) => item.option_id === check.option_id);
    assert.equal(check.truth, rationale.truth);
  }
  result.locales.push({
    locale,
    original_draft: binding(oldDraftPath),
    repaired_draft: binding(newDraftPath),
    original_review: binding(originalReviewPath),
    old_canonical_sha256: digest(oldDraft),
    new_canonical_sha256: digest(newDraft),
    seed_canonical_sha256: originalReview.seed_sha256,
    exact_changed_leaf_count: delta.length,
    diff: delta,
    insertion: info.insertion,
    Q3_Q6_inherited_fingerprints: unchanged,
    Q7_source_independent_solution_inherited_sha256: digest(originalReview.source_reviews[2].independent_solution),
    unchanged_Q7_nonstem_fields: true,
    native_review_schema: review.schema,
    native_review_outcome: review.outcome,
    native_review_canonical_sha256: digest(review),
  });
  pendingWrites.push({ relative: `${locale}/review.json`, review });
}

// Only materialize the mechanically composed snapshots after every input check.
for (const item of pendingWrites) {
  const file = createJSON(item.relative, item.review);
  result.locales.find((locale) => item.relative.startsWith(`${locale.locale}/`)).native_review_file = file;
}
const evidence = createJSON("affected-bindings.json", result);
console.log(JSON.stringify({ evidence, locales: result.locales.map((locale) => ({
  locale: locale.locale,
  draft_raw_sha256: locale.repaired_draft.sha256,
  draft_canonical_sha256: locale.new_canonical_sha256,
  native_review_file: locale.native_review_file,
})), native_validate_calls: result.native_validate_calls }, null, 2));

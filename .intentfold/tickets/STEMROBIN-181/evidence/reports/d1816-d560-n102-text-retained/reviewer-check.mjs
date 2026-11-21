import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { isDeepStrictEqual } from "node:util";

const ticket = ".intentfold/tickets/STEMROBIN-181/tmp/";
const firstReviewPath = `${ticket}d1816-d557-n102-first-text-review/report.json`;
const freezePath = `${ticket}d1816-d558-n102-affected-text/author-freeze.json`;
const nativeBase = `${ticket}d1816-recovery/native/d558-n102-affected-text-native`;
const bindings = {};
const checks = {};
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
const read = (path, expected) => {
  const bytes = readFileSync(path);
  const binding = { path, bytes: bytes.length, sha256: sha(bytes) };
  if (expected?.sha256) assert.equal(binding.sha256, expected.sha256, path);
  if (expected?.bytes !== undefined) assert.equal(binding.bytes, expected.bytes, path);
  bindings[path] = binding;
  return bytes;
};
const json = (path, expected) => JSON.parse(read(path, expected));
const firstReview = json(firstReviewPath, {
  sha256: "e71fd853a17a4aee1c70d85883032767fb03133b53d05e676d63aad461d5197e",
});
const freeze = json(freezePath);
const firstFreeze = json(freeze.firstAuthor.path, freeze.firstAuthor);
read(freeze.firstReview.path, freeze.firstReview);
assert.equal(firstReview.status, "REVISE_TEXT_MODERN_PORTRAIT_LOCAL_HOLD");
const manifest = json(freeze.changes.path, freeze.changes);
assert.equal(manifest.length, 9);
const receipt = json(`${nativeBase}/receipt.json`);
const stdout = json(`${nativeBase}/stdout.txt`);
assert.equal(receipt.exitCode, 0);
assert.equal(receipt.error, null);
assert.equal(stdout.portraitApproval, false);
assert.equal(stdout.wholeCourseApproval, false);

function diff(before, after, pointer = "") {
  if (isDeepStrictEqual(before, after)) return [];
  if (before && after && !Array.isArray(before) && !Array.isArray(after)
      && typeof before === "object" && typeof after === "object") {
    return [...new Set([...Object.keys(before), ...Object.keys(after)])]
      .flatMap((key) => diff(before[key], after[key], `${pointer}/${key}`));
  }
  if (pointer === "/prose") {
    assert.equal(before.length, after.length);
    return before.flatMap((block, index) => diff(block, after[index], `${pointer}/${index}`));
  }
  return [{ pointer, before, after }];
}

const locales = {};
for (const record of freeze.records) {
  const locale = record.locale;
  const original = firstFreeze.records.find((entry) => entry.locale === locale);
  const r557 = firstReview.bindings.candidates[locale];
  const beforeBytes = read(original.firstAuthor.path, original.firstAuthor);
  assert.equal(sha(beforeBytes), original.lesson.sha256);
  assert.equal(sha(beforeBytes), r557.lesson.sha256);
  assert.equal(sha(beforeBytes), r557.authorSnapshot.sha256);
  assert.deepEqual(read(record.before.path, record.before), beforeBytes);
  assert.deepEqual(read(original.lesson.path, original.lesson), beforeBytes);
  const before = JSON.parse(beforeBytes);
  const afterBytes = read(record.lesson.path, record.lesson);
  const after = JSON.parse(afterBytes);
  const beforeExercisesBytes = read(original.exercises.path, original.exercises);
  assert.equal(sha(beforeExercisesBytes), r557.exercises.sha256);
  const afterExercisesBytes = read(record.exercises.path, record.exercises);
  assert.deepEqual(beforeExercisesBytes, afterExercisesBytes);
  const exercises = JSON.parse(afterExercisesBytes);
  const actual = diff(before, after);
  const expected = manifest.filter((entry) => entry.locale === locale)
    .map(({ pointer, before, after }) => ({ pointer, before, after }));
  const sort = (changes) => changes.sort((a, b) => a.pointer.localeCompare(b.pointer));
  assert.deepEqual(sort(actual), sort(expected));
  const expectedPointers = locale === "zh"
    ? ["/prose/6/historical_entities", "/prose/15/text"]
    : ["/prose/6/historical_entities", ...[1, 3, 5, 6, 11, 15].map((i) => `/prose/${i}/text`)];
  assert.deepEqual(actual.map((entry) => entry.pointer).sort(), expectedPointers.sort());
  assert.deepEqual(after.source, before.source);
  assert.deepEqual(after.section_breaks, before.section_breaks);
  assert.equal(after.prose.length, 16);
  assert.equal(exercises.count, 0);
  assert.deepEqual(exercises.exercises, []);
  assert.equal(exercises.source.data.count, 0);
  assert.deepEqual(exercises.source.data.exercises, []);
  assert.equal(after.exercise_count, 0);
  assert.equal(after.source.data.exercise_count, 0);
  assert.deepEqual(after.prose[7], before.prose[7]);
  assert.equal(after.prose[7].kind, "fig");
  assert.equal(after.prose[7].id, "tbl-p0274-01");
  assert.equal(after.prose[7].text, "");
  assert.equal(after.prose[7].source_text, "");
  assert.deepEqual(after.prose[7].changes, []);
  for (let i = 0; i < 16; i++) {
    for (const key of ["source_refs", "source_text", "kind", "id", "label", "printed_page",
      "changes", "numeric_changes"]) {
      assert.deepEqual(after.prose[i][key], before.prose[i][key], `${locale}:${i}:${key}`);
    }
    const math = (text) => text.match(/\$[^$]*\$/g) ?? [];
    assert.deepEqual(math(after.prose[i].text), math(before.prose[i].text));
    assert.deepEqual(after.prose[i].text.match(/\d+/g), before.prose[i].text.match(/\d+/g));
  }
  const oldEntities = before.prose[6].historical_entities;
  const newEntities = after.prose[6].historical_entities;
  assert.equal(newEntities.length, oldEntities.length + 1);
  assert.deepEqual(newEntities.slice(0, -1), oldEntities);
  const institution = newEntities.at(-1);
  assert.equal(institution.term, locale === "zh" ? "\u82cf\u8054\u79d1\u5b66\u9662" : "Soviet Academy of Sciences");
  assert.equal(institution.source_term, "\u82cf\u8054\u79d1\u5b66\u9662");
  assert.equal(institution.reason, "This source block names the historical institution whose presidency Vavilov held from 1945 to 1951.");
  assert.ok(after.prose[6].text.includes(institution.term));
  assert.ok(after.prose[6].source_text.includes(institution.source_term));
  if (locale === "en") assert.ok(after.prose[6].changes.includes("translation"));
  const paragraphCounts = {};
  if (locale === "en") {
    for (const index of [1, 3, 5, 6, 11, 15]) {
      const normalize = (text) => text.replace(/\s+/gu, " ").trim();
      assert.equal(normalize(after.prose[index].text), normalize(before.prose[index].text));
      const paragraphs = after.prose[index].text.split(/\n\s*\n/);
      paragraphCounts[index] = paragraphs.map((paragraph) => {
        const lines = paragraph.split("\n");
        for (const line of lines) {
          assert.ok(/^[A-Z*]/.test(line), `${index}: sentence start`);
          assert.ok(line.endsWith("."), `${index}: complete sentence`);
          assert.equal((line.match(/\.(?:\s|$)/g) ?? []).length, 1, `${index}: one sentence per line`);
        }
        assert.ok(lines.length >= 2 && lines.length <= 3, `${index}: paragraph size`);
        return lines.length;
      });
    }
    assert.ok(after.prose[1].text.includes("waves; such particles"));
    assert.ok(after.prose[1].text.includes("struck; an atom"));
  } else {
    assert.ok(after.prose[15].text.includes("\u4e00\u822c\u767d\u70bd\u706f\u7684\u8017\u7535\u91cf\u7ea6\u4e3a\u65e5\u5149\u706f\u7684\u8017\u7535\u91cf\u7684\u4e00\u500d\u534a\u5230\u4e8c\u500d"));
    assert.ok(before.prose[15].text.includes("\u4e00\u500d\u534a\u5230\u4e8c\u500d"));
    assert.equal(after.prose[15].text.split("\n").at(-1), before.prose[15].text.split("\n").at(-1));
    assert.equal(after.prose[6].text, before.prose[6].text);
  }
  const native = stdout.results.find((entry) => entry.locale === locale);
  assert.equal(native.candidateSHA, sha(afterBytes));
  assert.equal(native.affectedTextNativeStatus, "PASS");
  assert.deepEqual(native.errors, []);
  assert.equal(native.fullNativeFinalization, false);
  const affected = locale === "zh" ? [6, 15] : [1, 3, 5, 6, 11, 15];
  const reusable = firstReview.sourceBoundObservations
    .filter(({ blockIndex }) => !affected.includes(blockIndex));
  for (const observation of reusable) {
    assert.equal(observation.SCI[locale], "PASS");
    assert.equal(observation.ZHEN[locale], "PASS");
    assert.deepEqual(after.prose[observation.blockIndex], before.prose[observation.blockIndex]);
  }
  locales[locale] = {
    actualFieldChanges: actual.map(({ pointer }) => pointer),
    affectedBlocks: affected,
    reusableUnaffectedPassBlocks: reusable.map(({ blockIndex }) => blockIndex),
    paragraphSentenceCounts: paragraphCounts,
    institution,
    originalQuestions: 0,
    newQuestions: 0,
  };
}
checks.status = "PASS";
checks.exactlyNineManifestedFieldChanges = true;
checks.firstFailureRetained = firstReview.status;
checks.allOtherFieldsDeepEqual = true;
checks.sourceSnapshotsAndRefsUnchanged = true;
checks.exercisesByteIdentical = true;
checks.blockCountOrderAndPortraitUnchanged = true;
checks.formulasDigitTokensSectionBreaksAndIdentitiesPreserved = true;
checks.nativeEvidenceHashBoundButNotReviewerApproval = true;
read(firstReviewPath, bindings[firstReviewPath]);
console.log(JSON.stringify({ checks, locales, bindings: Object.values(bindings) }, null, 2));

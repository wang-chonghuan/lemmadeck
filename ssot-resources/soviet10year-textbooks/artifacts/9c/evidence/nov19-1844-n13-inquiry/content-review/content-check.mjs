import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(root, "../../..");
const contract = JSON.parse(fs.readFileSync(path.join(root, "review-contract.json"), "utf8"));
const results = [];
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const load = (relative) => JSON.parse(fs.readFileSync(path.join(repo, relative), "utf8"));

function check(name, action) {
  try {
    const detail = action() ?? null;
    results.push({ name, verdict: "PASS", detail });
    console.log(`PASS ${name}`);
  } catch (error) {
    results.push({ name, verdict: "FAIL", error: error.message });
    console.error(`FAIL ${name}\n${error.message}`);
  }
}

function checkBinding(input) {
  const bytes = fs.readFileSync(path.join(repo, input.path));
  assert.equal(bytes.length, input.bytes, `${input.role} byte drift`);
  assert.equal(sha(bytes), input.sha256, `${input.role} hash drift`);
  if (input.snapshot) {
    const copy = fs.readFileSync(path.join(root, input.snapshot));
    assert.equal(sha(copy), input.sha256, `${input.role} frozen-copy mismatch`);
  }
}

for (const input of [...contract.inputs, ...contract.first_evidence]) {
  check(`input binding: ${input.role}`, () => checkBinding(input));
}
const byRole = (role) => contract.inputs.find((input) => input.role === role);
const firstRole = (role) => contract.first_evidence.find((input) => input.role === role);
const modernLesson = JSON.parse(fs.readFileSync(path.join(root, byRole("modern_lesson").snapshot), "utf8"));
const modernExercises = JSON.parse(fs.readFileSync(path.join(root, byRole("modern_exercises").snapshot), "utf8"));
const rawLesson = load(byRole("raw_lesson").path);
const rawExercises = load(byRole("raw_exercises").path);
const firstScope = load(firstRole("first_scope").path);
const firstExpectations = load(firstRole("first_expectations").path);

check("canonical source-page bindings remain the FIRST source versions", () => {
  for (const input of firstScope.source_files) {
    const bytes = fs.readFileSync(path.join(repo, input.path));
    assert.equal(bytes.length, input.bytes);
    assert.equal(sha(bytes), input.sha256);
  }
});

check("embedded source snapshots, source paths/hashes and draft status", () => {
  for (const [modern, raw, role, kind] of [
    [modernLesson, rawLesson, "raw_lesson", "lesson"],
    [modernExercises, rawExercises, "raw_exercises", "exercises"],
  ]) {
    assert.equal(modern.source.path, `lessons/${contract.lesson}/${kind}.json`);
    assert.equal(modern.source.sha256, byRole(role).sha256);
    assert.deepEqual(modern.source.data, raw, `${kind} source.data is the actual snapshot`);
    assert.equal(modern.status, "draft");
    assert.equal(modern.edition, "modern-us-neutral");
    assert.ok(!Object.hasOwn(modern, "source_snapshot"));
  }
});

function sourceBlock(ref) {
  const match = /^p(\d{4})#([1-9]\d*)$/.exec(ref);
  assert.ok(match, `invalid source ref ${ref}`);
  const page = Number(match[1]);
  const pointer = `/blocks/${Number(match[2]) - 1}`;
  const found = firstScope.blocks.find((block) => block.page === page && block.pointer === pointer);
  assert.ok(found, `ref outside FIRST n13 source scope: ${ref}`);
  return found;
}

function joinedSource(refs) {
  let text = "";
  for (const ref of refs) {
    const next = sourceBlock(ref).semantic_text;
    if (text.endsWith("$") && next.startsWith("$")) text += " ";
    text += next;
  }
  return text;
}

function segments(text) {
  assert.ok(!text.includes("\\$"), "escaped dollars require a different parser");
  const parts = text.split("$");
  assert.equal(parts.length % 2, 1, "unbalanced math delimiters");
  return {
    math: parts.filter((_, i) => i % 2 === 1),
    outside: parts.filter((_, i) => i % 2 === 0).join(""),
    parts,
  };
}

const normalizeProse = (text) => text.replace(/\s/g, "").replace(/[.。,，;；:：!！?？]/g, "");
const normalizeLayout = (text) => text.replace(/\s/g, "");
const perBlock = [];
let mathEdits = 0;

check("lesson identity, 14 prose entries and count are unchanged", () => {
  for (const key of ["id", "card_id", "chapter", "section", "number", "title", "printed_title", "start_page", "start_printed", "exercise_count"]) {
    assert.deepEqual(modernLesson[key], rawLesson[key], `metadata ${key}`);
  }
  assert.equal(rawLesson.prose.length, 14);
  assert.equal(modernLesson.prose.length, 14);
  assert.equal(rawLesson.exercise_count, 1);
  assert.equal(rawExercises.count, 1);
  assert.equal(modernExercises.count, 1);
  assert.deepEqual(modernLesson.errata, []);
});

for (const binding of contract.blocks) {
  const before = results.length;
  check(`prose${binding.index}: canonical refs, snapshot, text and exact mathematical spans`, () => {
    const raw = rawLesson.prose[binding.index];
    const modern = modernLesson.prose[binding.index];
    assert.equal(raw.kind, binding.kind);
    assert.equal(modern.kind, binding.kind);
    assert.deepEqual(raw.source_refs, binding.refs);
    assert.deepEqual(modern.source_refs, binding.refs);
    assert.equal(raw.text, joinedSource(binding.refs), "raw text must equal the scoped canonical semantic stream");
    assert.equal(modern.source_text, raw.text);
    for (const key of ["id", "label", "printed_page"]) assert.deepEqual(modern[key], raw[key], `prose metadata ${key}`);
    const page = sourceBlock(binding.refs[0]).page;
    assert.equal(raw.printed_page, page - 7);
    if (binding.kind === "fig") {
      assert.equal(modern.text, "");
      assert.equal(modern.id, "tbl-p0056-01");
      assert.equal(modern.label, "长除法");
      assert.deepEqual(modern.changes, []);
      return { classification: "IDENTITY_ONLY", figure_visual_and_math: "PENDING" };
    }
    const rawSegments = segments(raw.text);
    const modernSegments = segments(modern.text);
    assert.equal(modernSegments.math.length, rawSegments.math.length, "no added or removed mathematical spans");
    for (let i = 0; i < rawSegments.math.length; i += 1) {
      const allowance = contract.approved_mathematical_span_edits.find((edit) => edit.block === binding.index && edit.span === i);
      if (allowance) {
        assert.equal(rawSegments.math[i], allowance.source);
        assert.equal(modernSegments.math[i], allowance.candidate);
        assert.ok(modernSegments.parts[i * 2 + 2].startsWith("，"), "moved comma must immediately follow the formula outside math");
        mathEdits += 1;
      } else {
        assert.equal(modernSegments.math[i], rawSegments.math[i], `unregistered mathematical token edit in span${i}`);
      }
    }
    let withoutAdditions = modern.text;
    for (const addition of binding.additions) {
      assert.equal(withoutAdditions.split(addition).length - 1, 1, "each reviewed addition must appear exactly once");
      withoutAdditions = withoutAdditions.replace(addition, "");
    }
    assert.equal(normalizeProse(segments(withoutAdditions).outside), normalizeProse(rawSegments.outside), "unreviewed prose/digit/glyph change outside math");
    assert.deepEqual(modern.numeric_changes, []);
    assert.deepEqual(modern.historical_entities, []);
    assert.ok(modern.changes.every((change) => ["layout", "clarification"].includes(change)));
    assert.equal(modern.changes.includes("clarification"), binding.additions.length > 0);
    return {
      math_spans: rawSegments.math.length,
      mathematical_edits: contract.approved_mathematical_span_edits.filter((edit) => edit.block === binding.index).length,
      clarification_sentences: binding.additions.length,
    };
  });
  perBlock.push({
    index: binding.index,
    source_refs: binding.refs,
    verdict: results[before].verdict,
    reviewed_assessment: binding.assessment,
    detail: results[before].detail ?? null,
    error: results[before].error ?? null,
  });
}

check("exactly two declared trailing formula-comma moves and five clarification blocks", () => {
  assert.equal(mathEdits, contract.expected_math_span_edits);
  assert.deepEqual(
    contract.blocks.filter((block) => block.additions.length > 0).map((block) => block.index),
    contract.expected_clarification_blocks,
  );
  assert.equal(contract.blocks.reduce((sum, block) => sum + block.additions.length, 0), 9);
});

check("source-glyph and literal full-width k annotations preserved; FIRST scopes reused, not reproved", () => {
  assert.ok(rawLesson.prose[6].text.includes("象余数那样"));
  assert.ok(modernLesson.prose[6].text.includes("象余数那样"));
  const label = String.raw`\underbrace{2399\cdots9}_{k\text{ 位}}`;
  const text = modernLesson.prose[13].text;
  assert.equal(text.split(label).length - 1, 2);
  assert.ok(text.includes(`${label}=10^{-k}`));
  assert.ok(!text.includes("\\u21b5"));
  assert.ok(!text.includes("\u21b5"));
  assert.equal(firstExpectations.inequality.difference_exponent, "-k");
  assert.equal(firstExpectations.inequality.displayed_domain, "integer k >= 3");
});

check("figure source identity only, no figure paths or visual/figure-math interpretation", () => {
  const source = JSON.parse(fs.readFileSync(path.join(repo, firstScope.source_files.find((input) => input.page === 56).path), "utf8")).blocks[2];
  assert.equal(source.kind, "fig");
  assert.equal(source.id, "tbl-p0056-01");
  assert.equal(source.label, "长除法");
  assert.deepEqual(source.lines, []);
  assert.deepEqual(modernLesson.figures, rawLesson.figures);
  assert.deepEqual(modernLesson.figures, [{ id: "tbl-p0056-01", label: "长除法", page: 56 }]);
});

check("exercise115 complete canonical source, embedded text, identities and Latin five-line layout", () => {
  assert.equal(rawExercises.lesson, contract.lesson);
  assert.equal(modernExercises.lesson, contract.lesson);
  assert.equal(rawExercises.exercises.length, 1);
  assert.equal(modernExercises.exercises.length, 1);
  const raw = rawExercises.exercises[0];
  const modern = modernExercises.exercises[0];
  assert.equal(raw.text, joinedSource(contract.exercise.refs));
  assert.equal(modern.source_text, raw.text);
  assert.equal(sourceBlock(contract.exercise.group_ref).block.kind, "exhead");
  assert.equal(sourceBlock(contract.exercise.group_ref).semantic_text, raw.group);
  for (const key of ["number", "source_number", "group", "group_id", "pages", "figure_refs", "figures"]) {
    assert.deepEqual(modern[key], raw[key], `exercise metadata ${key}`);
  }
  assert.equal(modern.number, "115");
  assert.deepEqual(modern.pages, contract.exercise.refs);
  assert.deepEqual(modern.figure_refs, []);
  assert.deepEqual(modern.figures, []);
  assert.deepEqual(modern.numeric_changes, []);
  assert.deepEqual(modern.historical_entities, []);
  assert.deepEqual(modern.changes, ["layout"]);
  assert.equal(modern.lines.length, 5);
  assert.equal(modern.text, modern.lines.join("\n"));
  assert.ok(!/[\u0400-\u04ff]/.test(modern.text));
  let canonicalLatin = raw.text;
  firstExpectations.exercise115.forEach((item, index) => {
    canonicalLatin = canonicalLatin.replace(`${item.source_label})`, `${contract.exercise.labels[index]})`);
  });
  assert.equal(normalizeProse(canonicalLatin), normalizeProse(modern.text), "only label/layout/ordinary punctuation changes");
  assert.ok(!/^[a-d]\)/.test(modern.lines[0]));
});

const exerciseParts = [];
for (let i = 0; i < contract.exercise.labels.length; i += 1) {
  const label = contract.exercise.labels[i];
  const before = results.length;
  check(`115${label}: exact input formula and natural Latin label retained`, () => {
    const raw = rawExercises.exercises[0];
    const modern = modernExercises.exercises[0];
    const premise = contract.exercise.formulas[i];
    assert.equal(segments(raw.text).math[i], premise);
    assert.equal(segments(modern.text).math[i], premise);
    assert.ok(modern.lines[i + 1].startsWith(`${label}) $${premise}$`));
    const first = firstExpectations.exercise115[i];
    assert.equal(first.part, label);
    assert.ok(raw.text.includes(`${first.source_label}) $${premise}$`));
    // The given premise is compared to prior expectations without solving it.
    const sign = first.numerator.startsWith("-") ? "-" : "";
    assert.equal(premise, `${sign}\\frac{${first.numerator.replace("-", "")}}{${first.denominator}}`);
  });
  exerciseParts.push({ label, formula: contract.exercise.formulas[i], verdict: results[before].verdict });
}

check("no answer/key/choice/interaction fields are present in the disclosed templates", () => {
  const forbidden = new Set(["answerKey", "answer_key", "correct_index", "interaction", "choiceSet", "choices", "accept"]);
  function visit(value) {
    if (value === null || typeof value !== "object") return;
    for (const [key, child] of Object.entries(value)) {
      assert.ok(!forbidden.has(key), `unexpected disclosed field ${key}`);
      visit(child);
    }
  }
  visit(modernLesson);
  visit(modernExercises);
});

const failures = results.filter((result) => result.verdict === "FAIL");
console.log(JSON.stringify({
  phase: contract.phase,
  verdict: failures.length === 0 ? "PASS_TEXT_ONLY" : "FAIL_TEXT",
  checks: results.length,
  failed_checks: failures.length,
  per_block: perBlock,
  exercise_parts: exerciseParts,
  figure_approval: false,
  figure_visual_and_mathematics: "PENDING",
  whole_lesson_approval: false,
  first_tests_or_proofs_replayed: false,
  images_opened: 0,
}));
process.exitCode = failures.length === 0 ? 0 : 1;

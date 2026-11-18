import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { zh, en } from "./prose.mjs";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
assert.equal(process.cwd(), repo, "Use the sole authorized checkout.");
const card = "phy10-c2-s3-n82";
const tmp = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp");
const input = path.join(tmp, "d730-source221222-consume-prepare82");
const output = path.join(tmp, "d732-n82-first-bilingual-text-author");
const rawDir = path.join(input, "root/10p/lessons", card);
const preparedDir = path.join(input, "work/adapt/10p/modern-us-neutral/lessons", card);
const tools = path.join(repo, ".claude/skills/ld-s10y-lesson/tools");
const require = createRequire(import.meta.url);
const { proseOutline, sectionBreakIndices } = require(path.join(tools, "htmlfrag.js"));
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const fileHash = (file) => hash(fs.readFileSync(file));
const objectHash = (value) => hash(JSON.stringify(value));
const save = (file, value) => {
  assert.ok(file.startsWith(`${output}/`), "Write outside owned output refused.");
  assert.ok(!fs.existsSync(file), `Existing output must be preserved: ${file}`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, typeof value === "string" ? value : `${JSON.stringify(value, null, 2)}\n`);
};
const inputs = [
  path.join(input, "preparation.json"),
  path.join(input, "preauthor-source-requirements.json"),
  ...["lesson.json", "lesson.md", "exercises.json"].map((name) => path.join(rawDir, name)),
  ...["lesson.template.json", "exercises.template.json", "figures.template.json"]
    .map((name) => path.join(preparedDir, name)),
  path.join(tools, "edition.py"),
  path.join(tools, "prose_flow.mjs"),
  path.join(tools, "htmlfrag.js"),
  path.join(output, "scripts/prose.mjs"),
  path.join(output, "scripts/normalize.py"),
  path.join(output, "scripts/author.mjs"),
];
const preservationBefore = inputs.map((file) => ({ path: file, sha256: fileHash(file) }));
assert.ok(!fs.existsSync(path.join(output, "candidates")), "Do not redo existing authors.");
const preparation = read(path.join(input, "preparation.json"));
const requirements = read(path.join(input, "preauthor-source-requirements.json"));
const raw = read(path.join(rawDir, "lesson.json"));
const exercises = read(path.join(rawDir, "exercises.json"));
const prepared = read(path.join(preparedDir, "lesson.template.json"));
const preparedExercises = read(path.join(preparedDir, "exercises.template.json"));
assert.equal(fileHash(path.join(input, "preauthor-source-requirements.json")),
  "ed9514490ad63cbd124a41fd7634dbc27dcbfa490320153097e5596342b39744");
assert.equal(fileHash(path.join(rawDir, "lesson.json")), preparation.rawLesson.sha256);
assert.equal(fileHash(path.join(rawDir, "exercises.json")), preparation.rawExercises.sha256);
assert.deepEqual(requirements.boundary,
  { first: "p0220#4", last: "p0222#4", nextHeading: "p0222#5" });
assert.equal(requirements.sourceQuestions, 0);
assert.equal(exercises.count, 0);
assert.deepEqual(exercises.exercises, []);
assert.deepEqual(prepared.source.data, raw);
assert.deepEqual(preparedExercises.source.data, exercises);

const mathTokens = (text) => [...text.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs)]
  .map((match) => match[0]);
const outsideMath = (text) => text.replace(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs, "");
const numberTokens = (text) => [...outsideMath(text).matchAll(/(?<![\w.])-?\d+(?:\.\d+)?(?![\w.])/g)]
  .map((match) => match[0]);
const equationTokens = (text) => [...outsideMath(text).matchAll(/[（(](7\.[1-5])[）)]/g)]
  .map((match) => match[1]);
const wholeSequence = (lesson) => lesson.prose.flatMap((block) => [
  { kind: block.kind, id: block.id, refs: block.source_refs },
  ...mathTokens(block.text).map((literal) => ({ math: literal })),
  ...numberTokens(block.text).map((number) => ({ number })),
]);
const sourceMap = raw.prose.map((block, index) => ({
  target: `prose[${index}]`,
  kind: block.kind,
  source_refs: block.source_refs,
  source_text_sha256: hash(block.text),
  source_block_sha256: objectHash(block),
  math_tokens: mathTokens(block.text),
  nonmath_number_tokens: numberTokens(block.text),
}));
const localeResults = [];
for (const [locale, texts] of [["zh", zh], ["en", en]]) {
  assert.equal(texts.length, raw.prose.length);
  const candidate = structuredClone(prepared);
  candidate.locale = locale;
  candidate.status = "draft";
  candidate.title = locale === "en" ? "Deriving the Law of Refraction of Light" : raw.title;
  candidate.authoring = {
    stage: "FIRST-BILINGUAL-TEXT-AUTHOR",
    review_status: "NOT-REVIEWED",
    whole_card_approved: false,
    images_authored: 0,
  };
  candidate.prose.forEach((block, index) => {
    block.text = texts[index];
    block.changes = block.kind === "p"
      ? ["wording", "layout", ...(locale === "en" ? ["translation"] : [])]
      : block.text !== block.source_text ? ["translation"] : [];
    if (block.source_text.includes("惠更斯")) {
      block.historical_entities = [{
        term: "惠更斯",
        localized_term: locale === "en" ? "Huygens" : "惠更斯",
        source_refs: [...block.source_refs],
        reason: `${block.source_refs.join(", ")} names the historical wave-theory scientist `
          + "Huygens (惠更斯); the retained identity is instructional, not a fictional cultural setting.",
      }];
    }
  });
  // stdin/stdout avoids a second hand-authored layout or temporary source copy.
  const normalized = spawnSync(path.join(repo, ".claude/skills/ld-s10y-lesson/.venv/bin/python"),
    ["-B", path.join(output, "scripts/normalize.py")], {
      cwd: repo,
      input: JSON.stringify(candidate),
      encoding: "utf8",
      env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
      maxBuffer: 4 * 1024 * 1024,
    });
  assert.equal(normalized.status, 0, normalized.stderr);
  const lesson = JSON.parse(normalized.stdout);
  const localeDir = path.join(output, "candidates", locale, card);
  const lessonPath = path.join(localeDir, "lesson.template.json");
  const normalizedPath = path.join(output, "reports", `${locale}-normalized-input.json`);
  save(normalizedPath, lesson);
  // Copy the actual boundary objects printed by the edition's prose_flow command.
  const flow = spawnSync("node", [path.join(tools, "prose_flow.mjs"), normalizedPath], {
    cwd: repo,
    encoding: "utf8",
    maxBuffer: 4 * 1024 * 1024,
  });
  assert.equal(flow.status, 0, flow.stderr);
  const adjacent = flow.stdout.split("\n")
    .filter((line) => line.startsWith("    break: "))
    .map((line) => JSON.parse(line.slice("    break: ".length)));
  const outlineResult = { paragraphs: proseOutline(lesson.prose), boundary_objects: adjacent };
  const transitionRefs = ["p0220#10", "p0221#7", "p0222#1", "p0222#3"];
  lesson.section_breaks = transitionRefs.map((ref) => {
    const targetBlock = lesson.prose.findIndex((block) => block.source_refs.includes(ref));
    const target = outlineResult.paragraphs.find((p) =>
      p.blockIndex === targetBlock && p.paragraphInBlock === 0);
    assert.ok(target, `Missing first actual paragraph for ${ref}`);
    const matches = adjacent.filter((pair) => pair.after === target.text);
    assert.equal(matches.length, 1, `Missing or ambiguous semantic boundary for ${ref}`);
    const { before, after } = matches[0];
    return { before, after };
  });
  const resolved = sectionBreakIndices(lesson.prose, lesson.section_breaks);
  assert.deepEqual(proseOutline(lesson.prose), outlineResult.paragraphs);
  assert.deepEqual(lesson.source, prepared.source);
  assert.equal(lesson.printed_title, raw.printed_title);
  assert.deepEqual(lesson.figures, raw.figures);
  assert.deepEqual(wholeSequence(lesson), wholeSequence(raw));
  const mapped = lesson.prose.map((block, index) => {
    const source = raw.prose[index];
    assert.equal(block.source_text, source.text);
    for (const field of ["kind", "id", "label", "printed_page", "source_refs"]) {
      assert.deepEqual(block[field], source[field], `${locale} prose[${index}].${field}`);
    }
    assert.deepEqual(mathTokens(block.text), mathTokens(source.text),
      `${locale} prose[${index}] literal math drift`);
    assert.deepEqual(numberTokens(block.text), numberTokens(source.text),
      `${locale} prose[${index}] numeric drift`);
    assert.deepEqual(equationTokens(block.text), equationTokens(source.text));
    assert.deepEqual(block.numeric_changes, []);
    assert.ok(!block.changes.includes("math-correction"));
    for (const entity of block.historical_entities) {
      assert.ok(block.source_text.includes(entity.term));
      assert.ok(block.text.includes(entity.term));
      assert.deepEqual(entity.source_refs, block.source_refs);
      if (locale === "en") assert.ok(block.text.includes(entity.localized_term));
    }
    return {
      ...sourceMap[index],
      modern_text_sha256: hash(block.text),
      paragraph_indices: outlineResult.paragraphs.filter((p) => p.blockIndex === index).map((p) => p.index),
      historical_entities: block.historical_entities,
    };
  });
  const candidateExercises = structuredClone(preparedExercises);
  candidateExercises.locale = locale;
  assert.equal(candidateExercises.count, 0);
  assert.equal(candidateExercises.exercises.length, 0);
  const proseText = `# ${lesson.title}\n\n${lesson.prose.map((block) =>
    block.kind === "fig"
      ? `<!-- source figure ${block.id}; deferred, no image opened or generated -->`
      : block.text).join("\n\n")}\n`;
  save(lessonPath, lesson);
  save(path.join(localeDir, "lesson.md"), proseText);
  save(path.join(localeDir, "exercises.template.json"), candidateExercises);
  const paragraphGroups = outlineResult.paragraphs.map((paragraph) => {
    const text = outsideMath(paragraph.text);
    const sentenceCount = locale === "zh"
      ? [...text.matchAll(/[。！？]/g)].length
      : [...text.matchAll(/[.!?](?=\s|$)/g)].length;
    assert.ok(sentenceCount >= 2 && sentenceCount <= 3,
      `${locale} paragraph ${paragraph.index}: ${sentenceCount} complete sentences`);
    return { ...paragraph, complete_sentence_count: sentenceCount };
  });
  save(path.join(output, "reports", `${locale}-prose-flow.json`), {
    command: ["node", path.join(tools, "prose_flow.mjs"), normalizedPath],
    invocations: 1,
    stdout: flow.stdout,
    parsed: outlineResult,
    selected_section_breaks: lesson.section_breaks,
    resolved_indices_from_existing_api: resolved,
    paragraph_groups: paragraphGroups,
  });
  save(path.join(output, "reports", `${locale}-source-mapping.json`), mapped);
  localeResults.push({
    locale,
    lesson: { path: lessonPath, sha256: fileHash(lessonPath) },
    text: { path: path.join(localeDir, "lesson.md"), sha256: fileHash(path.join(localeDir, "lesson.md")) },
    exercises: {
      path: path.join(localeDir, "exercises.template.json"),
      sha256: fileHash(path.join(localeDir, "exercises.template.json")),
      actual_count: candidateExercises.exercises.length,
      declared_count: candidateExercises.count,
    },
    source_mapping: {
      path: path.join(output, "reports", `${locale}-source-mapping.json`),
      sha256: fileHash(path.join(output, "reports", `${locale}-source-mapping.json`)),
    },
    prose_paragraphs: paragraphGroups.length,
    section_breaks: lesson.section_breaks.length,
    normalizer_passes: 1,
    normalizer_calls_per_source_p_block: 1,
    prose_flow_invocations: 1,
  });
}
const frozenBlockMapping = requirements.blocks.map((block) => ({
  ref: block.ref,
  frozen_block_sha256: objectHash(block),
  role: block.kind === "h3" ? "exact-printed-title"
    : block.kind === "foot" ? "page-folio-preserved-in-frozen-source-not-learner-prose"
      : "mapped-to-assembled-source-block",
  targets: raw.prose.flatMap((item, index) =>
    item.source_refs.includes(block.ref) ? [`prose[${index}]`] : []),
}));
for (const block of frozenBlockMapping) {
  if (block.role === "mapped-to-assembled-source-block") assert.equal(block.targets.length, 1);
}
const requirementTargets = [
  ["all-prose", "exact-math-and-number-sequence", "fig-195", "zero-exercises"],
  ["p0220#6", "p0220#7", "p0222#1"],
  ["p0220#8", "p0220#9"],
  ["p0220#10", "p0221#1", "p0221#4", "p0221#5", "p0221#6", "p0221#7", "p0221#8"],
  ["p0220#8", "p0221#4", "p0221#6", "p0221#7", "p0221#8", "p0222#1", "p0222#2", "p0222#3", "p0222#4"],
  ["p0221#4", "p0221#5", "p0221#7", "p0221#8", "p0221#9", "p0222#1", "p0222#3", "p0222#4"],
  ["zh-prose-flow", "en-prose-flow", "SCI-pending", "ZHEN-pending", "FIG-pending", "display-pending"],
  ["no-out-of-scope-writes", "source218-H/Н-HOLD-unmodified"],
];
assert.equal(requirementTargets.length, requirements.requirements.length);
const preservationAfter = inputs.map((file) => ({ path: file, sha256: fileHash(file) }));
assert.deepEqual(preservationAfter, preservationBefore, "Read-only input preservation failed.");
const report = {
  ticket: "STEMROBIN-181",
  card,
  stage: "d732-FIRST-BILINGUAL-TEXT-AUTHOR",
  status: "AUTHORED-NOT-REVIEWED",
  review_pass: false,
  whole_card_approved: false,
  scope: { checkout: repo, output, boundary: requirements.boundary },
  preparation_sha256: fileHash(path.join(input, "preparation.json")),
  frozen_requirements_sha256: fileHash(path.join(input, "preauthor-source-requirements.json")),
  source_snapshot_sha256: objectHash(prepared.source),
  literal_math_sequence_sha256: objectHash(raw.prose.flatMap((block) => mathTokens(block.text))),
  literal_math_token_count: raw.prose.reduce((count, block) => count + mathTokens(block.text).length, 0),
  source_order_sha256: objectHash(wholeSequence(raw)),
  preservation: { before: preservationBefore, after: preservationAfter, unchanged: true },
  frozen_block_mapping: frozenBlockMapping,
  requirements_mapping: requirements.requirements.map((text, index) => ({
    requirement: text,
    requirement_sha256: hash(text),
    authored_or_preserved_at: requirementTargets[index],
    status: "AUTHOR-COVERAGE-ONLY-NOT-REVIEW-PASS",
  })),
  candidates: localeResults,
  counts: { source_exercises: 0, zh_exercises: 0, en_exercises: 0, images_opened: 0, images_authored: 0 },
  preserved_figure_slot: {
    id: "fig-195",
    assembled_prose_order: raw.prose.map((block) => ({ kind: block.kind, id: block.id, refs: block.source_refs })),
    explanation: "Raw assembly merges p0220#10, p0221#1 and p0221#4 before its fig/cap slot; "
      + "both candidates preserve this exact supplied source-layer block order and all literal tokens. "
      + "Frozen page-level refs remain exact; no image placement or fidelity approval is made.",
  },
  unresolved_SCI: [
    {
      id: "SCI-INDEPENDENT-REVIEW",
      status: "PENDING",
      detail: "Independent science review has not run. Review homogeneous/isotropic linear "
        + "phase-wavefront assumptions, fixed frequency/color and media, normal angles, "
        + "the causal A/B construction, and the right-triangle explanation.",
    },
    {
      id: "SCI-QUOTIENT-RECIPROCAL",
      status: "PENDING",
      refs: ["p0221#9"],
      detail: "Printed prose says divide 7.2 by 7.1 before displaying the reciprocal in 7.3. "
        + "Both candidates explicitly add taking reciprocals, without changing any source formula "
        + "or its order; this author clarification requires independent SCI confirmation.",
    },
    {
      id: "SCI-NORMAL-INCIDENCE",
      status: "PENDING",
      refs: ["p0221#9"],
      detail: "Both candidates qualify the ratio form to nonzero angles and use the pre-division "
        + "relations at normal incidence, retaining the literal source ratio unchanged.",
    },
  ],
  pending_gates: ["SCI", "ZHEN", "FIG", "display"],
  prohibited_operations_performed: [],
  exclusions: ["canonical", "tool-edits", "meter", "index", "Git", "backend", "DB", "paid-calls",
    "new-agents", "freshness", "other-chats", "full-tests", "adapt-finalize", "renderer", "image-open",
    "solved-examples", "choices", "answers"],
};
save(path.join(output, "reports", "author-report.json"), report);
save(path.join(output, "reports", "hashes.json"), {
  candidates: localeResults,
  author_report: {
    path: path.join(output, "reports", "author-report.json"),
    sha256: fileHash(path.join(output, "reports", "author-report.json")),
  },
});
process.stdout.write(`${JSON.stringify({
  status: report.status,
  candidates: localeResults,
  counts: report.counts,
  report: path.join(output, "reports", "author-report.json"),
  report_sha256: fileHash(path.join(output, "reports", "author-report.json")),
  unresolved_SCI: report.unresolved_SCI.map((item) => item.id),
}, null, 2)}\n`);

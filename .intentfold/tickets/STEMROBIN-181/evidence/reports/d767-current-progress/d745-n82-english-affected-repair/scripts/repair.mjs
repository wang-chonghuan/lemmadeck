import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
assert.equal(process.cwd(), repo);
const tmp = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp");
const owner = path.join(tmp, "d745-n82-english-affected-repair");
const previous = path.join(tmp, "d732-n82-first-bilingual-text-author");
const firstFail = path.join(tmp, "d742-n82-first-bilingual-text-review/review.json");
const card = "phy10-c2-s3-n82";
const tools = path.join(repo, ".claude/skills/ld-s10y-lesson/tools");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const fileHash = (file) => hash(fs.readFileSync(file));
const objectHash = (value) => hash(JSON.stringify(value));
const record = (file) => ({ path: file, sha256: fileHash(file) });
const reportPath = (name) => path.join(owner, "reports", name);
const candidatePath = (locale, name) => path.join(owner, "candidates", locale, card, name);
const previousPath = (locale, name) => path.join(previous, "candidates", locale, card, name);
const names = ["lesson.template.json", "lesson.md", "exercises.template.json"];
const write = (file, value, replace = false) => {
  assert.ok(file.startsWith(`${owner}/`), "Write outside owned directory refused.");
  assert.ok(replace || !fs.existsSync(file), `Preserve existing evidence: ${file}`);
  fs.writeFileSync(file, typeof value === "string" ? value : `${JSON.stringify(value, null, 2)}\n`);
};
const files = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(directory, entry.name);
  return entry.isDirectory() ? files(file) : [file];
});
const referencedPaths = (value) => {
  if (Array.isArray(value)) return value.flatMap(referencedPaths);
  if (!value || typeof value !== "object") return [];
  return [
    ...(typeof value.path === "string" && path.isAbsolute(value.path) ? [value.path] : []),
    ...Object.values(value).flatMap(referencedPaths),
  ];
};
const mathTokens = (text) => [...text.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs)]
  .map((match) => match[0]);
const outsideMath = (text) => text.replace(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs, "");
const numberTokens = (text) => [...outsideMath(text).matchAll(/(?<![\w.])-?\d+(?:\.\d+)?(?![\w.])/g)]
  .map((match) => match[0]);
const textIndices = [10, 11, 15];
const expectedDiff = [
  "figures[0].label", "prose[6].label", "prose[7].label",
  "prose[10].text", "prose[11].text", "prose[15].text", "section_breaks[3].after",
];
function diffPaths(before, after, prefix = "") {
  if (JSON.stringify(before) === JSON.stringify(after)) return [];
  if (before && after && typeof before === "object" && typeof after === "object") {
    assert.equal(Array.isArray(before), Array.isArray(after));
    assert.deepEqual(Object.keys(before), Object.keys(after));
    return Object.keys(before).flatMap((key) => diffPaths(before[key], after[key],
      Array.isArray(before) ? `${prefix}[${key}]` : `${prefix}${prefix ? "." : ""}${key}`));
  }
  return [prefix];
}
function assertImmutable() {
  for (const entry of read(reportPath("preservation-before.json")).immutable) {
    assert.equal(fileHash(entry.path), entry.sha256, `Immutable input changed: ${entry.path}`);
  }
  for (const name of names) {
    assert.equal(fileHash(candidatePath("zh", name)), fileHash(previousPath("zh", name)));
  }
  assert.equal(fileHash(candidatePath("en", "exercises.template.json")),
    fileHash(previousPath("en", "exercises.template.json")));
}
function assertTextContract(lesson) {
  const original = read(previousPath("en", "lesson.template.json"));
  assert.deepEqual(lesson.source, original.source);
  assert.equal(lesson.printed_title, original.printed_title);
  assert.equal(lesson.prose.length, original.prose.length);
  for (const [index, block] of lesson.prose.entries()) {
    const prior = original.prose[index];
    assert.deepEqual(mathTokens(block.text), mathTokens(prior.text), `Math drift in prose[${index}]`);
    assert.deepEqual(numberTokens(block.text), numberTokens(prior.text), `Number drift in prose[${index}]`);
    assert.deepEqual(mathTokens(block.text), mathTokens(block.source_text));
    assert.deepEqual(numberTokens(block.text), numberTokens(block.source_text));
    if (!textIndices.includes(index)) assert.equal(block.text, prior.text);
  }
  assert.ok(lesson.prose[10].text.includes("CB opposite the incidence angle at A"));
  assert.ok(lesson.prose[11].text.includes("AD is opposite the refraction angle at B"));
  assert.ok(lesson.prose[15].text.includes(
    "we can use the **absolute refractive indices** $n_1$ and $n_2$ of the first and second media to express the relative refractive index $n$"));
  assert.equal(lesson.figures[0].label, "Figure 195");
  assert.equal(lesson.prose[6].label, "Figure 195");
  assert.equal(lesson.prose[7].label, "Figure 195");
}
function native(name, executable, args, options, stdoutFile) {
  const receiptFile = reportPath(`${name}-receipt.json`);
  assert.ok(!fs.existsSync(receiptFile), "Do not repeat a retained native invocation.");
  const result = spawnSync(executable, args, {
    cwd: repo,
    encoding: "utf8",
    maxBuffer: 4 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
    ...options,
  });
  write(stdoutFile, result.stdout ?? "");
  const stderrFile = reportPath(`${name}-stderr.txt`);
  write(stderrFile, result.stderr ?? "");
  write(receiptFile, {
    executable, args, cwd: repo, exit_status: result.status, signal: result.signal,
    error: result.error?.message ?? null,
    stdin_sha256: options.input ? hash(options.input) : null,
    stdout: record(stdoutFile), stderr: record(stderrFile),
    bytecode_writes_disabled: true, invocation: 1, locale: "en",
  });
  assert.equal(result.status, 0, result.stderr || result.error?.message);
  return result;
}

const mode = process.argv[2];
if (mode === "snapshot") {
  const review = read(firstFail);
  assert.equal(review.status, "FAIL");
  assert.deepEqual(review.findings.map((finding) => finding.id), ["D742-01", "D742-02", "D742-03"]);
  for (const locale of ["zh", "en"]) {
    for (const name of names) {
      const source = previousPath(locale, name);
      const copy = candidatePath(locale, name);
      assert.equal(fileHash(copy), fileHash(source));
      assert.ok(fs.statSync(copy).mode & 0o200);
    }
  }
  const author = read(path.join(previous, "reports/author-report.json"));
  const immutable = [...new Set([
    firstFail, ...referencedPaths(review.inputs), ...author.preservation.before.map((entry) => entry.path),
    ...files(previous), ...files(path.dirname(firstFail)),
  ])].map(record);
  write(reportPath("preservation-before.json"), {
    immutable,
    candidate_copies: ["zh", "en"].flatMap((locale) => names.map((name) => record(candidatePath(locale, name)))),
    copied_byte_identically: true, copied_permissions_writable: true,
  });
  console.log("Six writable candidate copies are byte-identical; immutable input hashes recorded.");
} else if (mode === "normalize") {
  assertImmutable();
  const input = read(candidatePath("en", "lesson.template.json"));
  assertTextContract(input);
  const manualChanges = diffPaths(read(previousPath("en", "lesson.template.json")), input);
  assert.deepEqual(manualChanges, expectedDiff.filter((field) => !field.startsWith("section_breaks")));
  // The old fourth anchor contains repaired text; derive all anchors after layout.
  input.section_breaks = [];
  const inputFile = reportPath("en-normalizer-input.json");
  write(inputFile, input);
  native("en-normalizer", path.join(repo, ".claude/skills/ld-s10y-lesson/.venv/bin/python"),
    ["-B", path.join(previous, "scripts/normalize.py")],
    { input: fs.readFileSync(inputFile, "utf8") }, reportPath("en-normalized-input.json"));
  const normalized = read(reportPath("en-normalized-input.json"));
  assertTextContract(normalized);
  assert.deepEqual(normalized, input, "Unexpected layout changes require technical diagnosis.");
  console.log(`Normalizer succeeded once: ${normalized.prose.filter((block) => block.kind === "p").length} p-block calls.`);
} else if (mode === "flow") {
  assertImmutable();
  const normalizedFile = reportPath("en-normalized-input.json");
  assertTextContract(read(normalizedFile));
  native("en-prose-flow", process.execPath, [path.join(tools, "prose_flow.mjs"), normalizedFile],
    {}, reportPath("en-prose-flow.stdout.txt"));
  console.log("prose_flow succeeded once; full stdout and stderr receipts retained.");
} else if (mode === "finish") {
  assertImmutable();
  const normalizedFile = reportPath("en-normalized-input.json");
  const lesson = read(normalizedFile);
  assertTextContract(lesson);
  const stdout = fs.readFileSync(reportPath("en-prose-flow.stdout.txt"), "utf8");
  const adjacent = stdout.split("\n").filter((line) => line.startsWith("    break: "))
    .map((line) => JSON.parse(line.slice("    break: ".length)));
  const require = createRequire(import.meta.url);
  const { proseOutline, sectionBreakIndices } = require(path.join(tools, "htmlfrag.js"));
  const paragraphs = proseOutline(lesson.prose);
  const printedIndices = [...stdout.matchAll(/^\[(\d+)\] /gm)].map((match) => Number(match[1]));
  assert.deepEqual(printedIndices, paragraphs.map((paragraph) => paragraph.index));
  assert.equal(adjacent.length, paragraphs.length - 1);
  for (const [position, boundary] of adjacent.entries()) {
    assert.deepEqual(boundary, { before: paragraphs[position].text, after: paragraphs[position + 1].text });
  }
  const transitionRefs = ["p0220#10", "p0221#7", "p0222#1", "p0222#3"];
  lesson.section_breaks = transitionRefs.map((ref) => {
    const blockIndex = lesson.prose.findIndex((block) => block.source_refs.includes(ref));
    const paragraph = paragraphs.find((entry) => entry.blockIndex === blockIndex && entry.paragraphInBlock === 0);
    assert.ok(paragraph);
    const boundaries = adjacent.filter((entry) => entry.after === paragraph.text);
    assert.equal(boundaries.length, 1);
    return boundaries[0];
  });
  const resolved = sectionBreakIndices(lesson.prose, lesson.section_breaks);
  const groups = paragraphs.map((paragraph) => {
    const count = [...outsideMath(paragraph.text).matchAll(/[.!?](?=\s|$)/g)].length;
    assert.ok(count >= 2 && count <= 3);
    return { ...paragraph, complete_sentence_count: count };
  });
  assert.deepEqual(diffPaths(read(previousPath("en", "lesson.template.json")), lesson), expectedDiff);
  write(candidatePath("en", "lesson.template.json"), lesson, true);
  const markdown = `# ${lesson.title}\n\n${lesson.prose.map((block) => block.kind === "fig"
    ? `<!-- source figure ${block.id}; deferred, no image opened or generated -->`
    : block.text).join("\n\n")}\n`;
  write(candidatePath("en", "lesson.md"), markdown, true);
  write(reportPath("en-prose-flow.json"), {
    stdout: record(reportPath("en-prose-flow.stdout.txt")),
    receipt: record(reportPath("en-prose-flow-receipt.json")),
    invocations: 1, parsed: { paragraphs, boundary_objects: adjacent },
    selected_section_breaks: lesson.section_breaks,
    transition_refs_reused_from_d732: transitionRefs,
    resolved_indices_from_existing_api: resolved, paragraph_groups: groups,
    guessed_indices: false,
  });
  const originalMap = read(path.join(previous, "reports/en-source-mapping.json"));
  const mapping = originalMap.map((entry, index) => ({
    ...entry, modern_text_sha256: hash(lesson.prose[index].text),
    paragraph_indices: paragraphs.filter((paragraph) => paragraph.blockIndex === index).map((paragraph) => paragraph.index),
  }));
  write(reportPath("en-source-mapping.json"), mapping);
  const affected = read(firstFail).findings.map((finding) => {
    const fields = finding.id === "D742-01" ? ["prose[10].text", "prose[11].text"]
      : finding.id === "D742-02" ? ["figures[0].label", "prose[6].label", "prose[7].label"]
        : ["prose[15].text", "section_breaks[3].after"];
    const indices = finding.id === "D742-01" ? [10, 11] : finding.id === "D742-02" ? [6, 7] : [15];
    return {
      finding: finding.id, locale: "en", source_refs: finding.source_refs, changed_fields: fields,
      status: "REPAIRED-BY-AUTHOR-NOT-INDEPENDENTLY-REVIEWED",
      paragraphs: paragraphs.filter((entry) => indices.includes(entry.blockIndex)
        && (finding.id !== "D742-01" || entry.text.includes("opposite the"))),
      blocks: indices.map((index) => ({
        ...mapping[index], previous_modern_text_sha256: originalMap[index].modern_text_sha256,
        modern_label: lesson.prose[index].label,
      })),
    };
  });
  write(reportPath("affected-mapping.json"), affected);
  assertImmutable();
  const candidates = ["zh", "en"].map((locale) => ({
    locale, lesson: record(candidatePath(locale, "lesson.template.json")),
    text: record(candidatePath(locale, "lesson.md")),
    exercises: record(candidatePath(locale, "exercises.template.json")),
  }));
  const immutable = read(reportPath("preservation-before.json")).immutable;
  const math = lesson.prose.flatMap((block) => mathTokens(block.text));
  const author = read(path.join(previous, "reports/author-report.json"));
  assert.equal(math.length, author.literal_math_token_count);
  assert.equal(objectHash(math), author.literal_math_sequence_sha256);
  write(reportPath("repair-report.json"), {
    schema: "ld-s10y-lesson/affected-only-text-repair@1",
    ticket: "STEMROBIN-181", production: "production181-3", stage: "d745-n82-english-affected-repair",
    date: "2026-11-18", card, checkout: repo, owner,
    status: "REPAIRED-AWAITING-AFFECTED-ONLY-REVIEW", whole_card_approved: false,
    new_science_review_approval: false,
    first_FAIL_preserved: record(firstFail), previous_author: record(path.join(previous, "reports/author-report.json")),
    candidates, changed_fields: expectedDiff, affected_mapping: record(reportPath("affected-mapping.json")),
    en_source_mapping: record(reportPath("en-source-mapping.json")),
    en_saved_flow: record(reportPath("en-prose-flow.json")),
    zh: {
      reused_text_PASS: ["SCI", "ZHEN"], first_review: record(firstFail), copied_byte_identically: true,
      reused_flow: record(path.join(previous, "reports/zh-prose-flow.json")),
      reused_source_mapping: record(path.join(previous, "reports/zh-source-mapping.json")),
      native_invocations_this_repair: 0,
    },
    mechanical_checks: {
      exact_per_block_math_tokens_and_nonmath_number_sequences: "PASS",
      exact_changed_field_allowlist: "PASS", embedded_source_and_source_text_unchanged: true,
      literal_math_token_count: math.length, literal_math_sequence_sha256: objectHash(math),
      source_wrapper_sha256: objectHash(lesson.source),
      paragraph_count: paragraphs.length, sentence_counts: groups.map((entry) => entry.complete_sentence_count),
      section_breaks_derived_from_actual_saved_stdout: true, resolved_section_breaks: resolved,
      zero_exercises: true, immutable_hashes_preserved: true,
    },
    revisions_and_calls: {
      new_English_content_revision_rounds: 1, new_Chinese_content_revision_rounds: 0,
      new_findings_addressed: 3, English_text_blocks_changed: 3, English_label_fields_changed: 3,
      new_normalizer_invocations: { en: 1, zh: 0 },
      new_normalize_prose_layout_calls: { en: lesson.prose.filter((block) => block.kind === "p").length, zh: 0 },
      new_prose_flow_invocations: { en: 1, zh: 0 },
      new_technical_recovery_calls: 0,
      retained_d732_normalizer_invocations: { en: 1, zh: 1 },
      retained_d732_prose_flow_invocations: { en: 1, zh: 1 },
      d732_preflight_failures_retained: record(path.join(previous, "reports/preflight-recovery.json")),
      known_d732_plus_d745_normalizer_invocations: { en: 2, zh: 1 },
      known_d732_plus_d745_prose_flow_invocations: { en: 2, zh: 1 },
      earlier_production_revision_counts: "Not recalculated or reset; the retained historical receipts remain authoritative.",
      images_opened: 0, images_authored: 0, image_reviews: 0, paid_calls: 0, external_calls: 0,
      science_review_calls: 0, source_gate_replays: 0, new_agents: 0, whole_tests: 0,
      answers_or_choices_created: 0, database_calls: 0, publish_calls: 0, git_calls: 0,
    },
    pending: ["English affected-only independent text review", "FIG", "display"],
    no_canonical_meter_index_tool_backend_chat_database_publish_git_writes: true,
    preservation: { before: immutable, after: immutable.map((entry) => record(entry.path)), unchanged: true },
  });
  const manifest = files(owner).filter((file) => !file.endsWith("/hashes.json")).map(record);
  write(reportPath("hashes.json"), {
    algorithm: "sha256", files: manifest, manifest_excludes_itself: true,
  });
  console.log(JSON.stringify({
    status: "REPAIRED-AWAITING-AFFECTED-ONLY-REVIEW", candidates,
    report: record(reportPath("repair-report.json")), hashes: record(reportPath("hashes.json")),
    changed_fields: expectedDiff, paragraph_count: paragraphs.length, resolved_section_breaks: resolved,
    normalizer_invocations: { en: 1, zh: 0 }, prose_flow_invocations: { en: 1, zh: 0 },
  }, null, 2));
} else if (mode === "verify-final") {
  assertImmutable();
  const report = read(reportPath("repair-report.json"));
  assertTextContract(read(candidatePath("en", "lesson.template.json")));
  for (const entry of read(reportPath("hashes.json")).files) assert.equal(fileHash(entry.path), entry.sha256);
  assert.deepEqual(report.changed_fields, expectedDiff);
  console.log(JSON.stringify({
    final_hash_manifest: record(reportPath("hashes.json")),
    report: record(reportPath("repair-report.json")), candidates: report.candidates,
    mechanical_verification: "PASS", new_review_approval: false,
  }, null, 2));
} else {
  throw new Error("Use snapshot, normalize, flow, finish, or verify-final.");
}

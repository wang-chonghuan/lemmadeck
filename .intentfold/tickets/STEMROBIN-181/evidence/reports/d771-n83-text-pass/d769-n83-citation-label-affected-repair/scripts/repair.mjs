import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
assert.equal(process.cwd(), repo);
const tmp = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp");
const original = path.join(tmp, "d757-n83-first-bilingual-text-author");
const output = path.join(tmp, "d769-n83-citation-label-affected-repair");
const reviewPath = path.join(tmp, "d766-n83-first-bilingual-text-review/review-report.json");
const tools = path.join(repo, ".claude/skills/ld-s10y-lesson/tools");
const python = path.join(repo, ".claude/skills/ld-s10y-lesson/.venv/bin/python");
const card = "phy10-c2-s3-n83";
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const fileHash = (file) => hash(fs.readFileSync(file));
const bind = (file) => ({ path: file, sha256: fileHash(file) });
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const save = (file, value) => {
  assert.ok(file.startsWith(`${output}/`));
  assert.ok(!fs.existsSync(file), `Preserve existing output: ${file}`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, typeof value === "string" ? value : json(value));
};
const rewrite = (file, value) => {
  assert.ok(file.startsWith(`${output}/candidates/`));
  fs.writeFileSync(file, typeof value === "string" ? value : json(value));
};
const require = createRequire(import.meta.url);
const { sectionBreakIndices } = require(path.join(tools, "htmlfrag.js"));
const math = (text) => [...text.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs)].map((m) => m[0]);
const outsideMath = (text) => text.replace(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs, "");
const numbers = (text) => [...outsideMath(text).matchAll(/(?<![\w.])-?\d+(?:\.\d+)?(?!\w)/g)]
  .map((m) => m[0]);
const calls = [];
const call = (name, command, args, stdin) => {
  const started = new Date().toISOString();
  const result = spawnSync(command, args, {
    cwd: repo, input: stdin, encoding: "utf8", maxBuffer: 4 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
  });
  const stdinPath = path.join(output, "calls", `${name}.stdin.json`);
  if (stdin !== undefined) save(stdinPath, stdin);
  const stdoutPath = path.join(output, "calls", `${name}.stdout.json`);
  const stderrPath = path.join(output, "calls", `${name}.stderr.txt`);
  save(stdoutPath, result.stdout ?? "");
  save(stderrPath, result.stderr ?? "");
  const receipt = {
    name, argv: [command, ...args], cwd: repo, started_at: started,
    completed_at: new Date().toISOString(), exit_code: result.status,
    signal: result.signal, error: result.error?.message ?? null,
    stdin: stdin === undefined ? null : bind(stdinPath),
    stdout: bind(stdoutPath), stderr: bind(stderrPath),
    environment_override: { PYTHONDONTWRITEBYTECODE: "1" },
  };
  save(path.join(output, "calls", `${name}.receipt.json`), receipt);
  calls.push(receipt);
  assert.equal(result.status, 0, `${name}: ${result.stderr || result.error}`);
  return result.stdout;
};
const replacements = {
  zh: [
    ["，原书对此保留了引用“彩图 I”", "，可参看“彩图 I”"],
    ["，原书把这一步与“彩图 II”相联系，", "，可参看“彩图 II”，"],
  ],
  en: [
    [", and the source retains the reference 彩图 I (Color Plate I) for this step",
      " (see 彩图 I (Color Plate I))"],
    [", linked in the source to 彩图 II (Color Plate II),",
      " (see 彩图 II (Color Plate II)),"],
  ],
};
const allChanges = [];
const candidates = [];

try {
  assert.equal(fileHash(reviewPath),
    "b44ef84c2952fcf668e84ae638fe980f778fea20091038fefdb89fb5c3626f55");
  const review = read(reviewPath);
  const authorPath = path.join(original, "reports/author-report.json");
  const author = read(authorPath);
  assert.equal(author.candidate_revision, "d757-r1");
  assert.equal(review.candidate_revision, "d757-r1");
  assert.equal(review.review_pass, false);
  assert.deepEqual(review.findings.map((finding) => finding.id),
    ["d766-ZHEN-01", "d766-ZHEN-02"]);
  assert.ok(!fs.existsSync(path.join(output, "candidates")));
  const originalFiles = ["zh", "en"].flatMap((locale) =>
    fs.readdirSync(path.join(original, "candidates", locale, card))
      .map((name) => path.join(original, "candidates", locale, card, name)));
  assert.ok(originalFiles.every((file) => fs.statSync(file).isFile()));
  const readOnlyInputs = [
    reviewPath, authorPath, path.join(original, "reports/hashes.json"),
    author.frozen_requirements.path, author.preparation.path,
    author.source_lesson.path, author.source_exercises.path,
    author.preserved_figures.upstream_figure_template.path,
    path.join(tools, "edition.py"), path.join(tools, "prose_flow.mjs"),
    path.join(tools, "htmlfrag.js"), ...originalFiles,
    ...["zh", "en"].flatMap((locale) => [
      path.join(original, "reports", `${locale}-source-mapping.json`),
      path.join(original, "reports", `${locale}-prose-flow.json`),
    ]),
    ...["first-failure.json", "attempt-2-failure.json", "preflight-recovery.json"]
      .map((name) => path.join(original, "reports", name)),
  ];
  const before = readOnlyInputs.map(bind);
  save(path.join(output, "reports/input-bindings.json"), before);
  fs.cpSync(path.join(original, "candidates"), path.join(output, "candidates"), {
    recursive: true, force: false, errorOnExist: true, preserveTimestamps: true,
  });
  for (const file of originalFiles) {
    const copy = file.replace(`${original}/`, `${output}/`);
    assert.equal(fileHash(copy), fileHash(file));
    fs.chmodSync(copy, fs.statSync(copy).mode | 0o200);
  }

  for (const locale of ["zh", "en"]) {
    assert.equal(review.locales[locale].SCI, "PASS");
    assert.equal(review.locales[locale].SOURCE_MATH_COVERAGE, "PASS");
    const dir = path.join(output, "candidates", locale, card);
    const lessonPath = path.join(dir, "lesson.template.json");
    const lesson = read(lessonPath);
    const first = structuredClone(lesson);
    assert.equal(fileHash(lessonPath), review.locales[locale].files.lesson.sha256);
    const mappingPath = path.join(original, "reports", `${locale}-source-mapping.json`);
    const firstMapping = read(mappingPath);
    for (const [from, to] of replacements[locale]) {
      assert.equal(lesson.prose[5].text.split(from).length - 1, 1);
      lesson.prose[5].text = lesson.prose[5].text.replace(from, to);
      allChanges.push({ locale, finding: "d766-ZHEN-01", target: "prose[5].text",
        source_refs: ["p0223#5"], from, to });
    }
    const revisedText = lesson.prose[5].text;
    const normalizationInput = json({ locale, target: "prose[5].text",
      source_refs: lesson.prose[5].source_refs, text: revisedText });
    const normalizationCode = [
      "import json, sys",
      `sys.path.insert(0, ${JSON.stringify(tools)})`,
      "from edition import normalize_prose_layout",
      "payload = json.load(sys.stdin)",
      'payload["text"] = normalize_prose_layout(payload["text"])',
      "json.dump(payload, sys.stdout, ensure_ascii=False, indent=2)",
      'sys.stdout.write("\\n")',
    ].join("\n");
    const normalized = JSON.parse(call(`${locale}-normalize-prose5`, python,
      ["-B", "-c", normalizationCode], normalizationInput));
    assert.equal(normalized.target, "prose[5].text");
    assert.deepEqual(normalized.source_refs, first.prose[5].source_refs);
    lesson.prose[5].text = normalized.text;

    if (locale === "en") {
      const localize = (object, target, sourceRefs) => {
        const match = /^图 (196|197)$/.exec(object.label);
        assert.ok(match, target);
        const from = object.label;
        object.label = `Figure ${match[1]}`;
        allChanges.push({ locale, finding: "d766-ZHEN-02", target,
          source_refs: sourceRefs, from, to: object.label });
      };
      lesson.figures.forEach((figure, index) => localize(figure,
        `figures[${index}].label`, first.prose.find((b) => b.id === figure.id).source_refs));
      for (const index of [3, 4, 8, 9]) {
        localize(lesson.prose[index], `prose[${index}].label`, first.prose[index].source_refs);
      }
      const manifestPath = path.join(dir, "figures.template.json");
      if (fs.existsSync(manifestPath)) {
        const manifest = read(manifestPath);
        const initial = structuredClone(manifest);
        manifest.figures.forEach((figure, index) =>
          localize(figure, `figures.template.figures[${index}].label`, []));
        const restored = structuredClone(manifest);
        restored.figures.forEach((figure, index) => { figure.label = initial.figures[index].label; });
        assert.deepEqual(restored, initial);
        rewrite(manifestPath, manifest);
      }
    }

    const flowInput = structuredClone(lesson);
    flowInput.section_breaks = [];
    const flowInputPath = path.join(output, "reports", `${locale}-flow-input.json`);
    save(flowInputPath, flowInput);
    const flow = JSON.parse(call(`${locale}-prose-flow`, "node",
      [path.join(tools, "prose_flow.mjs"), "--json", flowInputPath]));
    const paragraphs = flow.paragraphs;
    const adjacent = paragraphs.slice(1).map((paragraph, index) => ({
      before: paragraphs[index].text, after: paragraph.text,
    }));
    const transitions = ["p0223#1", "p0223#5", "p0223#6", "p0224#2", "p0224#5", "p0224#6"];
    lesson.section_breaks = transitions.map((ref) => {
      const blockIndex = lesson.prose.findIndex((block) => block.source_refs.includes(ref));
      const firstParagraph = paragraphs.find((paragraph) =>
        paragraph.blockIndex === blockIndex && paragraph.paragraphInBlock === 0);
      assert.ok(firstParagraph, ref);
      const pair = adjacent.filter((boundary) => boundary.after === firstParagraph.text);
      assert.equal(pair.length, 1);
      return pair[0];
    });
    const resolved = sectionBreakIndices(lesson.prose, lesson.section_breaks);
    const paragraphGroups = paragraphs.map((paragraph) => {
      const clean = outsideMath(paragraph.text);
      const count = locale === "zh" ? (clean.match(/[。！？]/g) ?? []).length
        : (clean.match(/[.!?](?=\s|$)/g) ?? []).length;
      assert.ok(count >= 2 && count <= 3, `${locale} paragraph ${paragraph.index}: ${count}`);
      return { ...paragraph, complete_sentence_count: count };
    });
    assert.deepEqual(lesson.source, first.source);
    assert.equal(lesson.printed_title, first.printed_title);
    assert.deepEqual(lesson.external_dependencies, first.external_dependencies);
    assert.deepEqual(lesson.authoring, first.authoring);
    assert.deepEqual(math(lesson.prose[5].text), math(first.prose[5].text));
    assert.deepEqual(numbers(lesson.prose[5].text), numbers(first.prose[5].text));
    assert.deepEqual(lesson.prose.map((block) => block.source_refs),
      first.prose.map((block) => block.source_refs));
    assert.deepEqual(lesson.prose.map((block) => block.source_text),
      first.prose.map((block) => block.source_text));
    assert.deepEqual(lesson.prose.map((block) => block.historical_entities),
      first.prose.map((block) => block.historical_entities));
    assert.deepEqual(lesson.section_breaks, first.section_breaks);
    for (const literal of ["彩图 I", "彩图 II"]) {
      const matches = (text) => [...text.matchAll(new RegExp(`${literal}(?!I)`, "g"))].length;
      assert.equal(matches(lesson.prose[5].text), 1);
      assert.equal(matches(first.prose[5].text), 1);
    }
    const restored = structuredClone(lesson);
    restored.prose[5].text = first.prose[5].text;
    if (locale === "en") {
      restored.figures.forEach((figure, index) => { figure.label = first.figures[index].label; });
      for (const index of [3, 4, 8, 9]) restored.prose[index].label = first.prose[index].label;
    }
    assert.deepEqual(restored, first, "No unrelated candidate field changes.");

    rewrite(lessonPath, lesson);
    const textPath = path.join(dir, "lesson.md");
    const oldMarkdown = fs.readFileSync(textPath, "utf8");
    assert.equal(oldMarkdown.split(first.prose[5].text).length - 1, 1);
    rewrite(textPath, oldMarkdown.replace(first.prose[5].text, lesson.prose[5].text));
    for (const name of ["exercises.template.json", "exercises.md"]) {
      assert.equal(fileHash(path.join(dir, name)),
        fileHash(path.join(original, "candidates", locale, card, name)));
    }
    const mapping = structuredClone(firstMapping);
    mapping.prose.forEach((entry, index) => {
      entry.modern_text_sha256 = hash(lesson.prose[index].text);
      entry.paragraph_indices = paragraphs.filter((p) => p.blockIndex === index).map((p) => p.index);
      assert.deepEqual(entry.source_refs, firstMapping.prose[index].source_refs);
      assert.equal(entry.source_text_sha256, firstMapping.prose[index].source_text_sha256);
      assert.equal(entry.source_block_sha256, firstMapping.prose[index].source_block_sha256);
    });
    const newMappingPath = path.join(output, "reports", `${locale}-source-mapping.json`);
    save(newMappingPath, mapping);
    const flowReportPath = path.join(output, "reports", `${locale}-prose-flow.json`);
    save(flowReportPath, { input: bind(flowInputPath),
      stdout: bind(path.join(output, "calls", `${locale}-prose-flow.stdout.json`)),
      all_tool_derived_adjacent_boundaries: adjacent,
      selected_section_breaks: lesson.section_breaks, resolved_indices: resolved,
      paragraph_groups: paragraphGroups, all_paragraphs_have_2_or_3_complete_sentences: true,
      anchors_derived_from_saved_output: true, native_prose_flow_invocations: 1 });
    candidates.push({
      locale, revision: "d769-r1", base_revision: "d757-r1",
      lesson: bind(lessonPath), text: bind(textPath),
      exercises: bind(path.join(dir, "exercises.template.json")),
      written_questions: bind(path.join(dir, "exercises.md")),
      source_mapping: bind(newMappingPath), prose_flow: bind(flowReportPath),
      figures_template_present: fs.existsSync(path.join(dir, "figures.template.json")),
      affected_source_mapping: { before: firstMapping.prose[5], after: mapping.prose[5] },
      affected_paragraphs: paragraphGroups.filter((p) => p.blockIndex === 5),
      section_breaks_unchanged: true, resolved_indices: resolved,
      paragraph_count: paragraphs.length, normalizer_invocations: 1, prose_flow_invocations: 1,
      approval: "PENDING-AFFECTED-ONLY-INDEPENDENT-TEXT-REVIEW",
    });
  }
  const preservation = before.map((entry) => ({
    ...entry, sha256_after: fileHash(entry.path), unchanged: fileHash(entry.path) === entry.sha256,
  }));
  assert.ok(preservation.every((entry) => entry.unchanged));
  const report = {
    schema: "d769/affected-text-repair@1", ticket: "STEMROBIN-181", card, author: "d769",
    status: "REPAIRED-NOT-REVIEWED", review_pass: false, whole_card_approved: false,
    scope: { checkout: repo, only_writable_root: output },
    revision: "d769-r1", base_revision: "d757-r1",
    first_independent_failure: { ...bind(reviewPath), status: review.status,
      findings: review.findings, preserved_not_overwritten: true },
    revision_history: [
      { revision: "d757-r1", semantic_revisions_after_first_emission:
        author.semantic_revisions_after_first_emission, author_report: bind(authorPath),
        first_review: bind(reviewPath), unchanged: true },
      { revision: "d769-r1", affected_content_repair_round: 1, new_author_emissions: 1,
        changed_prose_blocks_per_locale: 1, finding_ids: ["d766-ZHEN-01", "d766-ZHEN-02"] },
    ],
    changes: allChanges, candidates,
    inherited_passes: ["zh", "en"].map((locale) => ({
      locale, basis: bind(reviewPath), SCI: review.locales[locale].SCI,
      SOURCE_MATH_COVERAGE: review.locales[locale].SOURCE_MATH_COVERAGE,
      source_wrapper: review.locales[locale].source_wrapper_and_per_block_source_text,
      exercises: "REUSED-UNCHANGED-3-UNANSWERED-WRITTEN-QUESTIONS",
      scope: "Existing PASSes only; changed citations and English labels await affected review.",
    })),
    history_preserved_by_reference: {
      author_counts: author.counts, author_calls: author.author_calls,
      prior_exact_calls: author.exact_calls, prior_call_receipts: author.call_receipts,
      first_author_failure: author.local_first_failed_receipt,
      prior_author_attempt2_failure: bind(path.join(original, "reports/attempt-2-failure.json")),
      upstream_first_failure: author.upstream_first_failed_receipt,
      first_review_usage: review.actual_usage,
    },
    exact_calls: calls,
    actual_repair_usage: {
      author_emissions: 1, affected_content_revision_rounds: 1,
      changed_prose_blocks: { zh: 1, en: 1 },
      normalize_prose_layout_calls: 2, prose_flow_cli_calls: 2, native_finalize_calls: 0,
      images_opened: 0, images_authored: 0, figure_reviews: 0, paid_calls: 0,
      answers_consulted: 0, answers_authored: 0, choices_consulted: 0, choices_authored: 0,
      renders: 0, review_approvals: 0, full_tests: 0, git_operations: 0,
      database_calls: 0, service_operations: 0, chats_messaged: 0, children_created: 0,
    },
    limits: review.dependency_limits,
    preservation,
    metadata_note: "Copied d757 authoring and external-dependency metadata remain historical; "
      + "this report identifies the repair revision. No FIG/native/colour/display approval is inferred.",
  };
  const reportPath = path.join(output, "reports/repair-report.json");
  save(reportPath, report);
  const files = [];
  const collect = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) collect(file);
      else files.push(bind(file));
    }
  };
  collect(output);
  save(path.join(output, "reports/hashes.json"), files);
  console.log(json({ report: bind(reportPath),
    hashes: bind(path.join(output, "reports/hashes.json")),
    candidates: candidates.map(({ locale, lesson, text, source_mapping, resolved_indices }) =>
      ({ locale, lesson, text, source_mapping, resolved_indices })),
    exact_call_count: calls.length, status: report.status }));
} catch (error) {
  const failurePath = path.join(output, "reports/repair-failure.json");
  if (!fs.existsSync(failurePath)) save(failurePath, {
    status: "FAIL-NOT-APPROVAL", error: String(error.stack ?? error), exact_calls: calls,
  });
  throw error;
}

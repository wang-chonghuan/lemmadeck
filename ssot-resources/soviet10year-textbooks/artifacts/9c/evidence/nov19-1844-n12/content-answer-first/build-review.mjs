import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { chmodSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = "/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck";
const out = path.dirname(fileURLToPath(import.meta.url));
const scratch = ".tmp/stemrobin-184-resume";
const frozenRoot = `${scratch}/n12-independent`;
const bookRoot = "ssot-resources/soviet10year-textbooks/artifacts/9c";
const lessonId = "ana9-c3-s1-n12";
const canonical = `${bookRoot}/editions/modern-us-neutral/lessons/${lessonId}`;
const templates = `.tmp/ld-s10y-lesson/adapt/9c/modern-us-neutral/lessons/${lessonId}`;
const assembled = `${bookRoot}/lessons/${lessonId}`;
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const inputMap = new Map();
function input(relative, role, parse = true) {
  const absolute = path.join(root, relative);
  const bytes = readFileSync(absolute);
  const entry = { path: absolute, role, sha256: hash(bytes), bytes: bytes.length };
  inputMap.set(absolute, { entry, bytes });
  return parse ? JSON.parse(bytes.toString("utf8")) : bytes.toString("utf8");
}
const frozenManifest = input(`${frozenRoot}/freeze.json`, "Independent source freeze manifest");
const frozen = input(`${frozenRoot}/independent-source.json`, "Frozen independent solution oracle; not rerun");
input(`${frozenRoot}/independent-source.md`, "Frozen independent readable solution", false);
const inquiryManifest = input(`${frozenRoot}/inquiry-hashes.json`, "Prior inquiry hash manifest");
input(`${frozenRoot}/inquiry.json`, "Completed frozen prior inquiry; not rerun");
input(`${frozenRoot}/inquiry.md`, "Completed frozen prior inquiry Markdown", false);
for (const item of [...frozenManifest.artifacts, ...inquiryManifest.artifacts]) {
  const bytes = readFileSync(item.file);
  assert.equal(hash(bytes), item.sha256, `Independent freeze mismatch: ${item.file}`);
}
assert.equal(hash(readFileSync(path.join(root, `${frozenRoot}/freeze.json`))), inquiryManifest.independent_freeze_manifest_sha256);

const sourcePages = Object.fromEntries(["0052", "0053", "0054", "0055"].map((id) => [
  id, input(`${bookRoot}/pages/${id}/page.json`, "Current source binding/unchanged-body verification; no new source mathematics or count review"),
]));
const source53md = input(`${bookRoot}/pages/0053/page.md`, "Current source frontmatter erratum registration", false);
const sourceLesson = input(`${assembled}/lesson.json`, "Current assembled source lesson and source_refs");
const sourceExercises = input(`${assembled}/exercises.json`, "Current assembled exercise identity/pages");
const modern = input(`${canonical}/lesson.json`, "Current canonical modern lesson, all 15 prose blocks");
const exercises = input(`${canonical}/exercises.json`, "Current canonical modern exercises 113/114");
const figures = input(`${canonical}/figures.json`, "Current canonical empty figure manifest");
const audit = input(`${canonical}/adaptation.audit.json`, "Existing adaptation audit; not rerun");
const templateLesson = input(`${templates}/lesson.template.json`, "Current modern lesson template");
const templateExercises = input(`${templates}/exercises.template.json`, "Current modern exercise template");
const templateFigures = input(`${templates}/figures.template.json`, "Current modern figure template");
const candidate = input(`${scratch}/n12-answer-candidate.json`, "Parent current answer candidate under formal Gate2 review");
const firstCandidate = input(`${scratch}/n12-answer-first-candidate.json`, "Preserved first candidate; only compare delta, never finalize");
const editionContract = input(".claude/skills/ld-s10y-lesson/references/edition-text-contract.md", "Source-bound propagation contract", false);
input(".claude/skills/ld-s10y-lesson/SKILL.md", "Modern content and source identity contract", false);
input(".claude/skills/ld-s10y-answer/SKILL.md", "Answer production, ungraded and actual exact-input contract", false);
const gateText = input(".claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md", "All nine formal Gate2 criteria", false);
const htmlfragPath = ".claude/skills/ld-s10y-lesson/tools/htmlfrag.js";
input(htmlfragPath, "Authoritative proseOutline/proseFlow helper; no rendering or image APIs invoked", false);
const require = createRequire(import.meta.url);
const { proseOutline, proseFlow } = require(path.join(root, htmlfragPath));

const entry = (relative) => inputMap.get(path.join(root, relative)).entry;
const whitespace = (text) => String(text).replace(/\s+/gu, "");
const mathSpans = (text) => Array.from(String(text).matchAll(/\$\$[\s\S]*?\$\$|\$[^$]*\$/g), (m) => m[0]);
const count = (text, span) => String(text).split(span).length - 1;
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const checks = [];
function check(id, condition, description, evidence = {}) {
  const item = { id, status: condition ? "PASS" : "FAIL", description, evidence };
  checks.push(item);
  return item.status;
}
const old53 = frozen.source_pages.find((page) => page.physical_page === 53);
const newHash = entry(`${bookRoot}/pages/0053/page.json`).sha256;
const expectedNewHash = "6595b44ba1ef99984d652a52a683d353c02dd8c12712975e4970bad160f6cf39";
const registration = sourcePages["0053"].meta.errata ?? [];
const actualErratum = registration[0];
const actualRecord = modern.errata?.[0];
const original = frozen.domain_inquiry.binding.actual_original_span;
const corrected = frozen.domain_inquiry.minimal_modern_replacement_proposal;
const expectedRefOrder = frozen.source_pages.flatMap((page) => page.actual_blocks
  .filter((item) => item.n12_scope && item.block.kind === "p")
  .map((item) => item.source_ref));
const rawSourceText = (refs) => refs.map((ref) => {
  const m = /^p(\d{4})#(\d+)$/.exec(ref);
  return sourcePages[m[1]].blocks[Number(m[2]) - 1].lines.join("\n");
}).join("\n");

check("C01", newHash === expectedNewHash, "Registered source page hash equals the supplied current hash", { sha256: newHash });
check("C02", same(sourcePages["0053"].blocks, old53.actual_blocks.map((item) => item.block)), "Every p0053 source block is unchanged from the independent freeze");
const { errata: newErrata, ...otherMeta } = sourcePages["0053"].meta;
check("C03", same(otherMeta, old53.metadata_snapshot), "All p0053 metadata except newly added errata is unchanged");
for (const id of ["0052", "0054", "0055"]) {
  const old = frozen.source_pages.find((page) => page.physical_page === Number(id));
  check(`C04-${id}`, entry(`${bookRoot}/pages/${id}/page.json`).sha256 === old.page_json_sha256,
    `Source p${id} exact bytes match the old frozen page`, { sha256: old.page_json_sha256 });
}
const frontmatter = /^\s*---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(source53md);
const frontmatterMeta = frontmatter ? JSON.parse(frontmatter[1]) : null;
check("C05", same(frontmatterMeta, sourcePages["0053"].meta), "Source page.md frontmatter matches current page.json meta");
check("C06", registration.length === 1
  && actualErratum.id === "p0053-decimal-digit-domain"
  && actualErratum.block === "p0053#6"
  && actualErratum.original === original
  && count(sourcePages["0053"].blocks[5].lines.join("\n"), original) === 1,
  "Exactly the authorized source erratum is registered; faithful strict <9 remains", { registered: registration });
check("C07", modern.prose.length === 15 && sourceLesson.prose.length === 15
  && same(modern.prose.flatMap((block) => block.source_refs), expectedRefOrder)
  && same(sourceLesson.prose.flatMap((block) => block.source_refs), expectedRefOrder),
  "All fifteen prose identities/source_refs match frozen source order", { expected_refs: expectedRefOrder });
check("C08", modern.source.sha256 === entry(`${assembled}/lesson.json`).sha256
  && same(modern.source.data, sourceLesson)
  && modern.source.path === `lessons/${lessonId}/lesson.json`,
  "Modern raw lesson snapshot and hash bind the current assembled source");
check("C09", exercises.source.sha256 === entry(`${assembled}/exercises.json`).sha256
  && same(exercises.source.data, sourceExercises)
  && exercises.source.path === `lessons/${lessonId}/exercises.json`,
  "Modern raw exercise snapshot and hash bind the current assembled source");
const blockReviews = modern.prose.map((block, index) => {
  const raw = sourceLesson.prose[index];
  const beforeMath = mathSpans(raw.text);
  const afterMath = mathSpans(block.text);
  const expectedMath = beforeMath.map((span) => index === 10 ? span.replace(original, corrected) : span);
  const sourceMatch = whitespace(raw.text) === whitespace(rawSourceText(raw.source_refs));
  const identity = same(block.source_refs, raw.source_refs)
    && block.printed_page === raw.printed_page && block.kind === raw.kind;
  const formulaPreservation = same(afterMath, expectedMath);
  const originalSnapshot = block.source_text === raw.text;
  check(`C10-block-${index}`, identity && sourceMatch && formulaPreservation && originalSnapshot,
    `All-block identity, source_text and formula audit: ${block.source_refs.join(",")}`);
  let assessment = "Only sentence/line layout changes, or text unchanged; original knowledge and every formula remain intact.";
  if (index === 0) assessment = "Counting/measuring meanings unchanged; Cyrillic sublabels become Latin a/b, no numbers or formulas altered.";
  if (index === 8) assessment = "Added bar-scope clarification is accurate and limited: bar affects only the negative integer part, fractional part stays nonnegative.";
  if (index === 10) assessment = "Only registered <9 -> <=9 replacement; raw source_text stays strict <9; target and corrected occurrence are exact.";
  if (index === 12) assessment = "Added comparison convention excludes eventual all-9 alternatives; existing strict comparison formula is unchanged and limited to standard zero-tail expansion.";
  return {
    index, target: `lesson.prose[${index}]`, source_refs: block.source_refs,
    printed_page: block.printed_page,
    status: identity && sourceMatch && formulaPreservation && originalSnapshot ? "PASS" : "FAIL",
    source_text: raw.text, canonical_text: block.text,
    source_formulas: beforeMath, canonical_formulas: afterMath,
    changes: block.changes, numeric_changes: block.numeric_changes,
    assessment,
  };
});
check("C11", (modern.errata ?? []).length === 1 && actualRecord.id === actualErratum.id
  && actualRecord.target === "lesson.prose[10]"
  && same(actualRecord.source, {
    page: 53, printed_page: 46, block: "p0053#6", sha256: newHash,
    pdf_sha256: sourcePages["0053"].meta.source.pdf_sha256,
  })
  && actualRecord.original === original && actualRecord.corrected === corrected
  && actualRecord.reason === actualErratum.reason
  && count(sourceLesson.prose[10].text, original) === 1
  && count(modern.prose[10].text, original) === 0
  && count(modern.prose[10].text, corrected) === 1
  && modern.prose[10].changes.includes("math-correction"),
  "Source-bound erratum propagates exactly once into the correct modern target with current hash", { modern_erratum: actualRecord });
check("C12", same(modern.prose.filter((block) => block.changes.includes("math-correction")).map((block) => block.source_refs), [["p0053#6"]])
  && modern.prose.every((block) => (block.numeric_changes ?? []).length === 0)
  && exercises.exercises.every((exercise) => (exercise.numeric_changes ?? []).length === 0),
  "No unrelated formula or context-number correction is declared");
const barClarification = "横线只作用于整数部分，小数部分仍为非负数。";
const comparisonClarification = "本节采用有限小数补无穷个零的标准展开，不使用最终全为九的另一种等值展开。\n以下比较法则均在这一约定下使用。";
check("C13", count(modern.prose[8].text, barClarification) === 1
  && whitespace(modern.prose[8].text.replace(barClarification, "")) === whitespace(sourceLesson.prose[8].text)
  && modern.prose[8].changes.includes("clarification")
  && count(modern.prose[12].text, comparisonClarification) === 1
  && whitespace(modern.prose[12].text.replace(comparisonClarification, "")) === whitespace(sourceLesson.prose[12].text)
  && modern.prose[12].changes.includes("clarification"),
  "Both new explanatory spans are source-consistent and narrowly scoped");
const outline = proseOutline(modern.prose);
const flow = proseFlow(modern.prose, modern.section_breaks);
check("C14", outline.length === 17 && flow.length === 17 && modern.section_breaks.length === 0,
  "Authoritative local prose helper yields 17 final paragraphs from 15 source-bound blocks", {
    method: "htmlfrag.js proseOutline/proseFlow only; no image/render/browser operation",
    paragraphs: outline,
  });
check("C15", audit.status === "pass" && audit.proseBlocks === 15 && audit.errata === 1
  && audit.exercises === 2 && audit.figures === 0 && audit.errors.length === 0
  && audit.sourceLessonSha256 === modern.source.sha256
  && audit.sourceExercisesSha256 === exercises.source.sha256,
  "Existing adaptation audit matches the actual current inputs, not used as substitute for this review");
check("C16", exercises.count === 2 && modern.exercise_count === 2
  && same(exercises.exercises.map((exercise) => exercise.number), ["113", "114"])
  && same(exercises.exercises.map((exercise) => exercise.pages), [["p0054#6"], ["p0054#7", "p0055#1"]]),
  "113/114 identity, order and cross-page ownership remain exact");
const exerciseReviews = exercises.exercises.map((exercise, index) => {
  const raw = sourceExercises.exercises[index];
  const layout = exercise.text.split("\n");
  const expectedLabels = index === 0 ? ["a", "b", "c", "d", "e", "f"] : ["a", "b", "c", "d"];
  const labels = layout.slice(1).map((line) => /^([a-z])\)/.exec(line)?.[1]);
  const valid = exercise.number === raw.number && exercise.source_number === raw.source_number
    && exercise.group === raw.group && exercise.group_id === raw.group_id
    && same(exercise.pages, raw.pages) && exercise.source_text === raw.text
    && same(mathSpans(exercise.text), mathSpans(raw.text))
    && whitespace(raw.text) === whitespace(rawSourceText(raw.pages))
    && same(labels, expectedLabels) && exercise.text.indexOf("\u3000") === -1
    && !/[\u0400-\u04ff]/.test(exercise.text)
    && same(exercise.figures, []) && same(exercise.figure_refs, []);
  check(`C17-exercise-${exercise.number}`, valid,
    "Exercise knowledge, values, group, source identity and ordered Latin subpart layout are preserved");
  return { exercise: exercise.number, status: valid ? "PASS" : "FAIL", pages: exercise.pages,
    group: exercise.group, group_id: exercise.group_id, source_number: exercise.source_number,
    actual_text: exercise.text, source_text: raw.text, actual_subpart_labels: labels,
    original_formulas: mathSpans(raw.text), canonical_formulas: mathSpans(exercise.text) };
});
const frozenUnknown = frozen.exercise_114[3].count_unknown;
check("C18", sourcePages["0055"].meta.notes === frozenUnknown.original_page_note_preserved
  && exercises.exercises[1].lines.at(-1) === frozen.exercise_114[3].actual_source_subpart_span
  && exercises.exercises[1].text.endsWith(frozen.exercise_114[3].actual_source_subpart_span.replace("г)", "d)")),
  "Unknown printed repeated-4 count and its faithful candidate remain unchanged", {
    status_retained: "UNKNOWN", mathematical_sign_reused_from_freeze: ">",
    exact_count_inferred: false, actual_candidate: frozenUnknown.actual_candidate_preserved,
  });
check("C19", same(modern.figures, []) && same(figures.figures, [])
  && exercises.exercises.every((exercise) => exercise.figures.length === 0),
  "Zero figures; no image review obligation is invented for these actual zero-figure inputs");
const withoutStatus = (document) => {
  const { status, ...data } = document;
  return data;
};
check("C20", same(withoutStatus(templateExercises), withoutStatus(exercises))
  && same(withoutStatus(templateFigures), withoutStatus(figures)),
  "Exercise and figure templates differ from canonical only by draft -> ready status");
const templateProseWithoutText = templateLesson.prose.map(({ text, ...metadata }) => metadata);
const canonicalProseWithoutText = modern.prose.map(({ text, ...metadata }) => metadata);
const { prose: tp, status: ts, ...templateOther } = templateLesson;
const { prose: cp, status: cs, ...canonicalOther } = modern;
check("C21", same(templateOther, canonicalOther)
  && same(templateProseWithoutText, canonicalProseWithoutText)
  && modern.prose.every((block, index) => {
    if ([0, 8].includes(index)) return block.text === templateLesson.prose[index].text.replace(
      index === 0 ? "\nb) " : "\n横线只", index === 0 ? "\n\nb) " : "\n\n横线只",
    );
    return block.text === templateLesson.prose[index].text;
  }),
  "Lesson template/canonical delta is only draft->ready and two paragraph-preserving newline insertions", {
    changed_text_targets: ["lesson.prose[0]", "lesson.prose[8]"], no_formula_delta: true,
  });
check("C22", modern.id === lessonId && modern.edition === "modern-us-neutral"
  && !modern.prose.some((block) => /[\u0400-\u04ff]/.test(block.text))
  && modern.prose.every((block) => (block.historical_entities ?? []).length === 0),
  "Published prose has no unresolved Cyrillic labels or invented historical/cultural substitutions");
check("C23", editionContract.includes("stale page hash") && gateText.includes("真实 MathLive")
  && gateText.includes("9. 全 lesson"),
  "Read actual current propagation and all-nine Gate2 contracts");

const answerChecks = [];
const answerCheck = (id, condition, description, evidence = {}) => {
  const item = { id, status: condition ? "PASS" : "FAIL", description, evidence };
  answerChecks.push(item);
  return item;
};
answerCheck("A01", candidate.schema === "ld-s10y-answer/lesson-answers@1" && candidate.book === "9c"
  && candidate.lesson === lessonId && candidate.edition === modern.edition && candidate.status === "draft",
  "Current candidate schema, book, lesson and edition match canonical; it remains an unfinalized draft");
answerCheck("A02", candidate.answers.length === 2 && same(candidate.answers.map((item) => item.exercise), ["113", "114"])
  && candidate.answers.every((item) => item.source === "derived" && !Object.hasOwn(item, "bookRaw")),
  "Exact two-exercise coverage, no duplicate/missing key, derived not mixed with bookRaw");
const answer113 = candidate.answers[0];
const answer114 = candidate.answers[1];
const latin = ["a", "b", "c", "d", "e", "f"];
const parts113 = frozen.exercise_113.map((item, index) => {
  const expectedDisplay = `${latin[index]}) $${item.primary_answer_latex}$`;
  const matched = count(answer113.displayAnswer, expectedDisplay) === 1;
  answerCheck(`A03-113-${latin[index]}`, matched, "Current displayed answer equals the pre-author independent frozen solution");
  return { label: `${latin[index]})`, frozen_label: item.subpart,
    status: matched ? "PASS" : "FAIL", source_ref: item.source_ref,
    frozen_answer_latex: item.primary_answer_latex, expected_display_span: expectedDisplay,
    tail: item.tail, integer_part: item.integer_part, fractional_part: item.fractional_part_exact,
    frozen_derivation_reused: item.derivation, source_mathematics_rerun: false };
});
answerCheck("A04", answer113.grading === "ungraded" && same(answer113.parts, [])
  && answer113.notes.includes("not merely the same numerical value")
  && answer113.notes.includes("overbar sign scope")
  && answer113.notes.includes("full six-part")
  && answer113.displayAnswer.includes("前五问的小数末尾补无穷个零；第六问末尾无限重复数字三。")
  && answer113.displayAnswer.includes("不能把上横线扩展为整个小数的负号。"),
  "113 ungraded rationale is substantive: numerical equivalence alone does not test required infinite-tail/bar-scope representation; all six answers and tail conventions are displayed");
const parts114 = frozen.exercise_114.map((item, index) => {
  const part = answer114.parts[index];
  const expectedKey = [item.comparison_symbol];
  const actualDisplay = index === 3
    ? frozen.exercise_114[3].actual_source_subpart_span.match(/\$(.*?)\$/)[1] + ">0.244"
    : (["17.586631<17.586897", "-2.37561>-2.37571", "-0.786<0.687"])[index];
  const passed = part?.label === `${latin[index]}) 比较符号` && part.judge === "exact"
    && same(part.expected, expectedKey)
    && count(answer114.displayAnswer, `${latin[index]}) $${actualDisplay}$`) === 1;
  answerCheck(`A05-114-${latin[index]}`, passed,
    "Current symbol key and display relation match the independent frozen comparison, not a new source solution");
  return { label: part?.label, frozen_label: item.subpart, source_ref: item.source_ref,
    content_status: passed ? "PASS" : "FAIL", judge: part?.judge,
    expected: part?.expected, frozen_symbol: item.comparison_symbol,
    actual_display_relation: actualDisplay, frozen_first_difference: item.first_difference,
    real_mathlive_input_status: "BLOCKED_PENDING_OFFICIAL_FINALIZER",
    source_mathematics_rerun: false };
});
answerCheck("A06", answer114.grading === "auto" && answer114.parts.length === 4
  && answer114.parts.every((part) => part.expected.length === 1 && ["<", ">"].includes(part.expected[0]))
  && answer114.notes.includes("printed count remains UNKNOWN")
  && answer114.notes.includes("official MathLive real-edit serialization gate"),
  "114 only grades symbols; uncertain repeated-4 count is display evidence, not an exact key");
answerCheck("A07", answer114.displayAnswer.includes("$-3+0.62439$")
  && answer114.displayAnswer.includes("$-3+0.62429$")
  && answer114.displayAnswer.includes("左数这一位为四")
  && answer114.displayAnswer.includes("右数补无穷个零"),
  "114 display explanations correctly preserve negative integer-part scope and the zero-tail deciding position");
const first114 = firstCandidate.answers[1];
const { parts: firstParts, notes: firstNotes, ...first114Other } = first114;
const { parts: currentParts, notes: currentNotes, ...current114Other } = answer114;
answerCheck("A08", same(firstCandidate.answers[0], answer113)
  && same(first114Other, current114Other)
  && same(Object.fromEntries(Object.entries(firstCandidate).filter(([key]) => key !== "answers")),
    Object.fromEntries(Object.entries(candidate).filter(([key]) => key !== "answers")))
  && firstCandidate.status === "draft",
  "First candidate is retained; delta is 114 parts/labels and their contract notes, not answers, source mathematics or display");
answerCheck("A09", firstParts[3].expected.includes("0.2444444444\\ldots>0.244")
  && same(currentParts[3].expected, [">"]),
  "The uncertain printed repeated-4 candidate was removed from the exact response key; preserved first candidate is not approved/finalized");

const criteria = [
  "exercise 与题面、插图、书后答案属于同一题号。",
  "有 bookRaw 时已实际验算；原书答案不是未经检查直接复制。",
  "没有书后答案时已完整求解，source 为 derived。",
  "多小问和多个待求量已拆成独立 parts，标签和单位清楚。",
  "expected 是实际可输入答案；exact 必须通过官方 finalizer 的真实 MathLive 编辑检查。",
  "displayAnswer 足以让学生理解标准答案，含必要作法或理由。",
  "只有可靠 exact/numeric/expression 判定的题才标 auto。",
  "无法可靠自动判定的开放/表示任务不被硬判正误，合理标 ungraded。",
  "全 lesson 无漏题、重题，书后来源和模型推导来源不混淆。",
];
const c = (number, status, rationale) => ({ criterion: number, contract: criteria[number - 1], status, rationale });
const gate113 = [
  c(1, "PASS", "canonical 113 / source_number 113 / g1 / p0054#6，a-f 六问顺序一致；实际无图，无 bookRaw 声称。"),
  c(2, "NOT_APPLICABLE", "没有 bookRaw 字段；不声称查阅原书答案或从 bookRaw 复制。"),
  c(3, "PASS", "六问全部逐项匹配先于作者产出的独立冻解；source=derived，不重新求解源题。"),
  c(4, "PASS", "ungraded 不制造自动 parts；parts=[] 合法，displayAnswer 明确分列 a-f 六个独立答案，非漏拆待求量。无单位任务。"),
  c(5, "NOT_APPLICABLE", "ungraded 无 expected，不声称自动输入或格式判定；没有 exact 键需要 MathLive gate。"),
  c(6, "PASS", "六个无穷小数写法完整；前五问无限零尾、第六问无限重复三，并解释三个负数的整数部分上横线。"),
  c(7, "PASS", "没有标 auto；表示形式不是数值等价，现合同不能可靠判定尾部写法和上横线范围，ungraded 理由充分。"),
  c(8, "PASS", "合理采用 ungraded，未因全覆盖强造表示法自动正误；依 cap2 ungraded 展示标准答案合同。"),
  c(9, "PASS", "113 恰一键，lesson 两题总清单匹配，derived 与书后证据无混淆。"),
];
const gate114 = [
  c(1, "PASS", "canonical 114 / source_number 114 / g1 / p0054#7+p0055#1，a-d 四问身份与接续一致；实际无图。"),
  c(2, "NOT_APPLICABLE", "没有 bookRaw 字段；未编造原书答案来源。"),
  c(3, "PASS", "四个显示比较与四个符号逐项匹配冻结独立解：<、>、<、>；source=derived。"),
  c(4, "PASS", "四个独立 exact parts，标签 a)-d) 比较符号；每键仅一符号，无单位和 UNKNOWN 4-count 参与 exact 键。"),
  c(5, "BLOCKED", "当前只有 draft 候选；缺少官方 finalizer 的真实键盘编辑/删除、input event、数学内容保持及重新序列化 .value 判分证据。本次禁浏览器，未执行；静态匹配冻解不是输入链验证。"),
  c(6, "PASS", "四问展示完整比较及决定理由；负数用 -3+正小数解释，d 用第4位4>0和右数无限零尾，UNKNOWN 不关闭。"),
  c(7, "BLOCKED", "符号题数学上适合 exact auto，但该候选可靠输入合同必须由第5条官方 gate 证明；尚不能无条件批准 auto/runtime grading。"),
  c(8, "NOT_APPLICABLE", "实际是四个封闭比较符号，不是开放图形/证明题；不因此强迫 ungraded，但 auto 仍受第5/7条阻断。"),
  c(9, "PASS", "114 恰一键，四 parts；两题 lesson 全覆盖，无 source derived/book 混淆。"),
];
const mathFailure = checks.some((item) => item.status === "FAIL")
  || answerChecks.some((item) => item.status === "FAIL");
if (mathFailure) {
  for (const list of [gate113, gate114]) {
    for (const item of list) {
      if (item.status === "PASS") {
        item.status = "FAIL";
        item.rationale += " Static consistency checks found a failure; do not approve this criterion without resolving recorded failures.";
      }
    }
  }
}
// Detect changing inputs within this read-only review transaction, not a pipeline freshness/setup run.
for (const { entry: item, bytes } of inputMap.values()) {
  check(`input-stability:${item.path}`, hash(readFileSync(item.path)) === hash(bytes),
    "Input bytes remained stable during this review", { input_sha256: item.sha256 });
}
const manifest = [...inputMap.values()].map((item) => item.entry);
const contentStatus = checks.every((item) => item.status === "PASS") ? "PASS" : "FAIL";
const answerStatus = answerChecks.some((item) => item.status === "FAIL") || contentStatus !== "PASS" ? "FAIL" : "BLOCKED";
const constraints = {
  only_write_directory: out,
  rerun_independent_inquiry_or_source_mathematics: false,
  recount_or_source_finalize: false,
  adapt_finalize_or_render_rerun: false,
  answer_finalizer_or_mathlive_real_edit_run: false,
  browser_or_network_calls: 0, image_reads: 0, new_images: 0,
  database_publisher_git_peer_calls: 0,
  source_modern_candidate_or_prior_frozen_files_written: false,
};
const content = {
  schema: "stemrobin-184B/n12-review-content@1",
  ticket: "STEMROBIN-184B", lesson: lessonId, edition: "modern-us-neutral",
  created_at: new Date().toISOString(), verdict: contentStatus,
  verdict_scope: "Formal offline n12 modern content and source-bound propagation review of all 15 prose blocks and exercises 113/114; not visual acceptance, publication, or whole-lesson release PASS",
  independently_frozen_before_author_review: true,
  prior_freeze: frozenManifest,
  inputs: manifest,
  parent_supplied_not_rerun: {
    durable_parent_intake: "evidence/nov19-1844-n12/inquiry/parent-intake.json",
    durable_intake_files: 13, durable_intake_bytes: 160676,
    source_finalize_exit: 0, count: "24/24", source_normalization: 0,
    modern_adapt_finalize_first_exit: 0, modern_render_first_exit: 0,
    final_paragraphs: 17, exercises: 2, figures: 0,
    premise_verification_limit: "No old pipeline/intake/count run is reopened; content and current registered hashes are inspected directly.",
  },
  source_registration_delta: {
    old_frozen_page_json_sha256: old53.page_json_sha256,
    current_registered_page_json_sha256: newHash,
    blocks_unchanged: checks.find((item) => item.id === "C02").status,
    other_meta_unchanged: checks.find((item) => item.id === "C03").status,
    actual_registered_erratum: actualErratum,
    registration_id_need_not_equal_old_proposed_id: true,
    preserved_historical_notes: "Existing source notes still describe historical capture observations; their text was deliberately not rewritten as new approval.",
  },
  source_bound_propagation: {
    target: "lesson.prose[10]", source_ref: "p0053#6",
    actual_record: actualRecord,
    source_original_span_retained: original,
    modern_replacement: corrected,
    changed_formula_count: 1,
    all_other_formula_spans_identical: blockReviews.filter((block) => block.index !== 10).every((block) => same(block.source_formulas, block.canonical_formulas))
      && exerciseReviews.every((item) => same(item.original_formulas, item.canonical_formulas)),
  },
  all_15_block_reviews: blockReviews,
  exercise_identity_reviews: exerciseReviews,
  final_paragraphs: { count: outline.length, outline, authoritative_helper: path.join(root, htmlfragPath) },
  unknown_preservation: {
    repeated_4_printed_count: "UNKNOWN",
    source_candidate_unchanged: frozenUnknown.actual_candidate_preserved,
    source_notes_unchanged: true,
    comparison_reused_from_freeze: ">",
    count_inferred_or_unknown_closed: false,
    other_old_glyph_science_unknowns: "UNCHANGED; no approval outside this formal content scope",
  },
  checks, failures: checks.filter((item) => item.status === "FAIL"),
  constraints,
};
const answer = {
  schema: "stemrobin-184B/n12-review-answer@1",
  ticket: "STEMROBIN-184B", lesson: lessonId, edition: "modern-us-neutral",
  created_at: new Date().toISOString(),
  verdict: answerStatus, formal_gate2_pass: false,
  content_math_verdict: mathFailure ? "FAIL" : "PASS",
  verdict_scope: "Formal all-nine-criteria Gate2 assessment of the current parent draft candidate; full gate BLOCKED until official exact MathLive input evidence",
  inputs: manifest,
  frozen_independent_solution_hash: entry(`${frozenRoot}/independent-source.json`).sha256,
  source_current_page53_sha256: newHash,
  candidate_sha256: entry(`${scratch}/n12-answer-candidate.json`).sha256,
  first_candidate_sha256: entry(`${scratch}/n12-answer-first-candidate.json`).sha256,
  first_candidate_preserved_not_finalized: true,
  first_to_current_delta: {
    unchanged: ["lesson/book/edition/status", "all of 113", "114 identity/grading/source/displayAnswer"],
    changed: ["114 parts labels/expected: full inequalities -> four comparison symbols", "114 notes: updated exact-key/UNKNOWN/runtime-contract rationale"],
    source_mathematics_redone: false,
  },
  exercise_reviews: [
    { exercise: "113", verdict: mathFailure ? "FAIL" : "PASS", grading: "ungraded",
      parts: parts113, all_nine_criteria: gate113,
      grading_rationale: "Complete six-part required representations are shown. Infinite tail formatting and source integer-bar scope are representational properties not reliably tested by numeric/expression equality; no auto-format judge or fabricated parts.",
    },
    { exercise: "114", verdict: answerStatus, grading: "auto",
      static_symbols: ["<", ">", "<", ">"],
      parts: parts114, all_nine_criteria: gate114,
      grading_suitability: "Four closed comparison symbols are suitable exact-key candidates, but actual input reliability is not certified before official finalizer.",
    },
  ],
  lesson_criterion9: c(9, answerChecks.find((item) => item.id === "A02").status,
    "Canonical exercise ids [113,114] equal candidate ids [113,114], each exactly once; 6 displayed manual subanswers +4 exact symbol parts; all sources derived without fabricated bookRaw."),
  exact_input_contract: {
    status: "BLOCKED_PENDING_OFFICIAL_FINALIZER",
    impacted_criteria: [5, 7],
    impacted_exercise: "114",
    impacted_keys: currentParts.map((part) => ({ label: part.label, expected: part.expected })),
    real_edit_attempts_in_this_review: 0,
    mathlive_documents_opened: 0,
    input_events_captured: 0,
    setter_cache_used_as_validation: false,
    string_comparison_claimed_as_input_chain: false,
    required_later_evidence: "Official lesson_answers.py finalize: independently initialized real MathLive candidate document per key, actual keyboard insert/delete and input event, unchanged mathematical content, reserialized .value passed to shared grading normalization; preserve attempt counts per contract.",
    finalizer_executed_here: false,
  },
  unknown_preservation: {
    repeated_4_count: "UNKNOWN",
    last_exact_key: [">"],
    full_candidate_display_retained: candidate.answers[1].displayAnswer,
    unknown_count_not_in_any_current_exact_expected: currentParts.every((part) => part.expected.every((key) => !key.includes("244"))),
    closed: false,
  },
  checks: answerChecks,
  failures: answerChecks.filter((item) => item.status === "FAIL"),
  blockers: [
    { exercise: "114", criteria: [5, 7], status: "BLOCKED",
      reason: "Official MathLive real-edit serialization gate has not been run; this read-only, no-browser review cannot supply that evidence.",
      content_fix_required_by_this_review: false },
  ],
  constraints,
};

const inputLines = manifest.map((item) => `- \`${item.path}\`\n  SHA-256 \`${item.sha256}\`；${item.bytes} bytes；${item.role}。`);
const contentMd = [
  "# n12 Modern Content Review",
  "",
  `结论：**${content.verdict}**，限定于正式离线 n12 内容及 source-bound propagation；不是视觉验收、发布或整课 release PASS。`,
  "",
  "旧 independent-source/inquiry 的四份冻结哈希先核对；没有重跑 inquiry、源数学或计数。当前 canonical 的十五块和两题全部实际读取。",
  "",
  "## Source Registration And Propagation",
  "",
  `登记前 page53 SHA-256：\`${old53.page_json_sha256}\`。`,
  `当前登记后 page53 SHA-256：\`${newHash}\`（与用户给定当前 hash 相等）。`,
  "",
  "与冻结源 JSON 比较：所有 blocks、其它 meta 严格不变，仅新增 errata。page.md frontmatter 与 JSON meta 相同。52/54/55 的 JSON 字节仍与旧冻解绑定完全一致；这是内容增量核验，不是重做计数/glyph/source 解。",
  "",
  `源登记 id \`${actualErratum.id}\`，block \`${actualErratum.block}\`，原式 \`${original}\` 精确保留。`,
  `现代记录 target \`${actualRecord.target}\`，物理页53/印刷页46，page hash为当前新hash，PDF hash为源 metadata 声明；original严格<9，corrected为 \`${corrected}\`。`,
  "",
  "原式在 authoritative raw target 恰好一次，现代 target 中原式零次、corrected一次，目标带 math-correction。没有把旧 inquiry 页哈希误当登记后的 hash。实际登记 id 与旧提案 id 不同，但源登记/现代记录相互一致，合同不要求采用提案 id。",
  "",
  "## All Fifteen Blocks",
  "",
  "| index / target | source_refs | 结论 | 实质检查 |",
  "| --- | --- | --- | --- |",
  ...blockReviews.map((block) => `| ${block.index} | ${block.source_refs.join(", ")} | ${block.status} | ${block.assessment} |`),
  "",
  "十五块的 source_text、printed_page、kind、source_refs 均逐项绑定 assembled source，再与 frozen/current page blocks 对照；每一数学 span 按顺序比对。唯一公式差异是第10块登记的 <9 -> <=9。全部其它公式、数字、补零、整数横线范围严格保留。",
  "",
  "第8块新解释只说横线作用于整数部分，小数部分非负；第12块新解释明确“本节”标准零尾展开，不使用最终全九的等值另写法，随后比较法则限定在这一约定下。两处都是 clarification，不冒充第二条 math-correction。",
  "",
  "## Exercises And Paragraphs",
  "",
  "113：source_number113 / group习题 / group_id g1 / p0054#6，六问 a-f 顺序、数值和公式完整。",
  "114：source_number114 / group习题 / group_id g1 / p0054#7+p0055#1，四问 a-d 顺序完整；不是 n13 的题，也未把页55其它循环小数块纳入 n12。",
  "",
  "每个题干和小问独占一行；canonical text Latin 标号，无西里尔发布标号、全角多栏空格或新人物/文化映射。canonical 的 legacy lines/source_text 保留源证据，不据其西里尔字母误判发布 text。",
  "",
  "htmlfrag.js 的 proseOutline/proseFlow（只调用文本解析，无图/HTML渲染/浏览器）实际得到 **17 最终段 / 15 源绑定块 / 2题 / 0图**；不手算段落。现有 adaptation.audit.status=pass 且来源 hashes匹配，但它没有替代本次实质内容对照。",
  "",
  "模板对照：exercises/figures 仅 draft->ready；lesson 另外在第0和第8块插入保留独立段的空行，所有其它字段、公式、errata/source快照均一致。",
  "",
  "## UNKNOWN Retained",
  "",
  `页55候选：\`${frozenUnknown.actual_candidate_preserved}\`。重复4精确印出数量仍 **UNKNOWN**，source notes原样保留，canonical候选未改。比较 > 直接沿用旧独立冻解，不重做求解，不关闭 glyph UNKNOWN。`,
  "",
  "其它旧 science/glyph 状态不因本次内容审查获全页/全教材批准。历史 notes中“未作勘误”是此前捕获观察文字，本次只新增明确 errata而不改其历史文本。",
  "",
  "## Checks And Inputs",
  "",
  `可失败的局部检查 ${checks.length} 项：PASS ${checks.filter((item) => item.status === "PASS").length}，FAIL ${checks.filter((item) => item.status === "FAIL").length}。全部当前输入在写review前做同事务字节稳定性核验。`,
  "",
  ...checks.filter((item) => item.status === "FAIL").map((item) => `- FAIL ${item.id}: ${item.description}`),
  ...inputLines,
  "",
  "只写 n12-independent/review；零新图片/图片读取/browser/network/DB/publisher/Git/peer；不改源、现代、模板、候选或旧冻结文件；不执行任何 finalize/render。",
  "",
].join("\n");
const criterionTable = (items) => [
  "| 条 | 状态 | 实质判断 |",
  "| --- | --- | --- |",
  ...items.map((item) => `| ${item.criterion} | ${item.status} | ${item.rationale} |`),
];
const answerMd = [
  "# n12 Formal Gate2 Answer Review",
  "",
  `正式 Gate2 总结论：**${answer.verdict}**，**不是 PASS**。当前候选的数学、显示、覆盖和静态符号键检查为 ${answer.content_math_verdict}；114 第5条真实MathLive输入合同未执行，第7条可靠auto批准依赖它。`,
  "",
  `当前候选：\`${entry(`${scratch}/n12-answer-candidate.json`).path}\``,
  `SHA-256：\`${answer.candidate_sha256}\``,
  `旧独立解：SHA-256 \`${answer.frozen_independent_solution_hash}\`，产出并冻结在作者候选之前；此轮不重新求解源数学。`,
  "",
  "## 113: All Six Parts",
  "",
  "| 问 | 冻解及当前display一致 | 表示检查 |",
  "| --- | --- | --- |",
  ...parts113.map((item) => `| ${item.label} | $${item.frozen_answer_latex}$ (${item.status}) | 整数部分${item.integer_part}，小数部分${item.fractional_part}；${item.tail} |`),
  "",
  "grading=ungraded、parts=[] 有充分合同理由：题目要求本书无穷小数表示而不是仅数值等价；无限尾显示长度及上横线负号范围不是当前 numeric/expression 等价判定能可靠测试的格式。六问分别完整展示，不把 ungraded 当漏题。前五问无限零尾，第六问无限重复3；三个负数附 -8+0.065、-1+0.75、-1+1/3 解释，横线不扩到全数。",
  "",
  ...criterionTable(gate113),
  "",
  "## 114: Four Exact Symbol Candidates",
  "",
  "| 问 | expected | 显示比较与冻解 | 内容判断 | 实际输入合同 |",
  "| --- | --- | --- | --- | --- |",
  ...parts114.map((item) => `| ${item.label} | \`${JSON.stringify(item.expected)}\` | $${item.actual_display_relation}$ | ${item.content_status} | BLOCKED：待官方finalizer |`),
  "",
  "expected仅是四个比较符号 <、>、<、>；labels明确要求“比较符号”。没有完整不等式/展示说明/重复4候选数量混入 exact 键。displayAnswer保留四问完整不等式和决定理由，负数使用同整数部分 -3 +正小数的解释。最后问仅沿用冻结的第4位4>0证据，UNKNOWN不关闭。",
  "",
  ...criterionTable(gate114),
  "",
  "## First Candidate Preservation",
  "",
  `首候选 SHA-256：\`${answer.first_candidate_sha256}\`；仍为draft，只读，未finalize。`,
  "",
  "实际 delta 只有114.parts（含labels：完整不等式改四符号）和说明这些键/UNKNOWN合同的114.notes；113全部字段、114身份/来源/grading/displayAnswer、顶层lesson/edition/status均原样不变。没有因UNKNOWN重做源解。",
  "",
  "首候选d expected含0.2444444444…全不等式，不能把未经确认的印出重复4数量作为exact答案必需字符串；当前d expected=[\">\" ]排除了这个风险。首候选不获批准，也不被覆盖。",
  "",
  "## Mandatory Blocker",
  "",
  "官方 lesson_answers.py finalize 的真实MathLive gate仍待父执行。必须真实键盘插入/删除并触发input事件，确认数学内容未变，再读重新序列化.value，调用共享规范化判分；每键独立文档并保留尝试次数。此轮0次编辑/0输入事件/0浏览器，不能把setter缓存、静态expected自比或冻解字符串匹配当输入链证据。",
  "",
  "因此114第5条BLOCKED、第7条可靠auto批准BLOCKED，全Gate2必须BLOCKED。静态内容未发现需返修的数学/覆盖缺陷，不等于正式ready、可发布或整课PASS。若官方输入gate失败，应按其实际证据修键，不凭本review预判通过。",
  "",
  "## Full-Lesson Criterion9 And Inputs",
  "",
  "canonical exercises=[113,114]，candidate answers=[113,114]，每题恰一键；113完整6个手动展示问、114恰4个独立符号parts，全部source=derived，无bookRaw伪造或来源混淆。criterion9 PASS。未打开书后答案包，不声称书后有/无题号的独立核验。",
  "",
  ...inputLines,
  "",
  "仅写新review目录；无图/浏览器/网络/DB/publisher/Git/同伴消息；不改任何候选、源、现代或旧冻解。不调用finalizer。等待父收存与后续官方输入合同。",
  "",
].join("\n");

const outputs = [
  ["review.content.json", `${JSON.stringify(content, null, 2)}\n`],
  ["review.content.md", contentMd],
  ["review.answer.json", `${JSON.stringify(answer, null, 2)}\n`],
  ["review.answer.md", answerMd],
];
for (const [name, text] of outputs) {
  writeFileSync(path.join(out, name), text, { flag: "wx" });
  chmodSync(path.join(out, name), 0o444);
}
const outputHashes = {
  schema: "stemrobin-184B/n12-review-hashes@1",
  created_at: new Date().toISOString(),
  input_count: manifest.length,
  all_input_bytes_stable_during_review: !checks.some((item) => item.id.startsWith("input-stability:") && item.status === "FAIL"),
  artifacts: outputs.map(([name]) => {
    const bytes = readFileSync(path.join(out, name));
    return { file: path.join(out, name), sha256: hash(bytes), bytes: bytes.length };
  }),
  content_verdict: content.verdict,
  answer_verdict: answer.verdict,
  official_mathlive_gate_executed: false,
};
writeFileSync(path.join(out, "review-hashes.json"), `${JSON.stringify(outputHashes, null, 2)}\n`, { flag: "wx" });
chmodSync(path.join(out, "review-hashes.json"), 0o444);
console.log(JSON.stringify({
  ...outputHashes,
  failed_content_checks: content.failures,
  failed_answer_checks: answer.failures,
  independent_frozen_answers_reused_not_rerun: true,
  new_images: 0,
}, null, 2));

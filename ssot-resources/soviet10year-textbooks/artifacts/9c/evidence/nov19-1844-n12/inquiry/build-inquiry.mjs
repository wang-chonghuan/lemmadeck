import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { chmodSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = "/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck";
const out = path.dirname(fileURLToPath(import.meta.url));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const freezePath = path.join(out, "freeze.json");
const freezeBytes = readFileSync(freezePath);
const freeze = JSON.parse(freezeBytes.toString("utf8"));
assert.equal(freeze.phase, "independent source solutions complete; inquiry not yet written");
for (const entry of freeze.artifacts) {
  assert.equal(sha256(readFileSync(entry.file)), entry.sha256);
  assert.equal(statSync(entry.file).mode & 0o222, 0);
}
const independent = JSON.parse(readFileSync(path.join(out, "independent-source.json"), "utf8"));
const contractPath = path.join(root, ".claude/skills/ld-s10y-lesson/references/edition-text-contract.md");
const contractBytes = readFileSync(contractPath);
const contract = contractBytes.toString("utf8");
for (const premise of [
  "remains unchanged in the faithful page block",
  "recorded\nin that page's frontmatter",
  "page JSON SHA-256, PDF SHA-256",
  "math-correction",
  "stale page hash",
  "original` that no longer appears exactly once",
]) {
  assert.ok(contract.includes(premise), `Missing contract premise: ${premise}`);
}
const binding = independent.domain_inquiry.binding;
const page53 = independent.source_pages.find((page) => page.physical_page === 53);
assert.equal(binding.block, "p0053#6");
assert.equal(binding.page_json_sha256, page53.page_json_sha256);
assert.equal(page53.actual_blocks[5].block.lines[3], binding.actual_original_span);
assert.equal(independent.exercise_113.length, 6);
assert.equal(independent.exercise_114.length, 4);
assert.equal(independent.exercise_114[3].count_unknown.status, "UNKNOWN");
assert.equal(independent.exercise_114[3].count_unknown.affects_comparison, false);

const suggestedRegistration = {
  id: "p0053-math-1",
  block: binding.block,
  original: binding.actual_original_span,
  reason: "The stated base-ten digit domain excludes 9, but the same page gives -0.789 and claims decimal representation for every nonnegative rational. Long division requires integer digits 0 through 9.",
};
const contractComparison = [
  {
    requirement: "Confirmed mathematics stays unchanged in the faithful source block; a source-bound erratum is recorded in that page's frontmatter.",
    evidence: "独立推导充分支持 {0,...,9}；冻结 actual block 仍逐字保留 $0\\leqslant a_k<9$。",
    outcome: "SUPPORTED_PROPOSAL_ONLY",
    not_done: "No source frontmatter edit or registration is executed. The parsed page.json meta snapshot has no errata field; no global registry is queried.",
  },
  {
    requirement: "The source block exists and contains original; exact original span must be unique in the authoritative raw lesson/exercise target.",
    evidence: "源 p0053#6 实际存在，/blocks/5/lines/3 正好是原式；本 block 和本页正文各一次。",
    outcome: "SOURCE_SPAN_VERIFIED_TARGET_NOT_CHECKED",
    not_done: "Authoritative assembled lesson/exercise target has not been reconstructed or inspected; source-page uniqueness is not target uniqueness.",
  },
  {
    requirement: "Authoritative bindings preserve physical/printed page, page JSON SHA-256, PDF SHA-256 and the source block reference; stale bindings fail.",
    evidence: `本 inquiry 精确绑定 physical 53 / printed 46、p0053#6、页 JSON ${binding.page_json_sha256}。PDF hash 仅来自源 meta，未读取 PDF。`,
    outcome: "INQUIRY_BOUND_TO_CURRENT_SOURCE_SNAPSHOT",
    not_done: "No assemble/adapt binding reconstruction, PDF-byte verification or publication revalidation is performed.",
  },
  {
    requirement: "The edition author fills corrected, updates the target text and adds math-correction to that target's changes.",
    evidence: `最小现代候选是 ${independent.domain_inquiry.minimal_modern_replacement_proposal}，保留十进制数字集合的等价 <=9 边界。`,
    outcome: "MINIMAL_REPLACEMENT_PROPOSED_NOT_APPLIED",
    not_done: "No modern draft is read/edited, no corrected field or changes array is written to a formal artifact.",
  },
  {
    requirement: "Missing records, stale hashes, mismatches, unchanged propagation and formula changes outside registered replacements fail.",
    evidence: "inquiry 将独立数学结论与正式登记/传播证据分开；既有计数排除不能代替科学认可。",
    outcome: "NO_FORMAL_PIPELINE_APPROVAL",
    not_done: "No finalize, assemble, adapt-finalize, author keys, official Gate2 or lesson PASS is called or claimed.",
  },
  {
    requirement: "Section breaks use actual adjacent final-paragraph anchors from the authoritative prose flow, not independently counted blocks.",
    evidence: "本次只从实际 JSON 识别 114 的跨页 continuation 与下一个 n13 标题；#block 只是 source binding。",
    outcome: "NOT_IN_SCOPE_NO_SECTION_BREAK_AUTHORED",
    not_done: "No prose_flow command, section_breaks edit or substitute paragraph numbering is used.",
  },
];
const minimalRecommendations = [
  {
    id: "R1",
    action: "Preserve faithful source and all existing UNKNOWN states.",
    detail: "Do not change p0053#6's strict <9 source span, the p0055#1 repeated-4 candidate/count UNKNOWN, any original displayed tails or the bar scope. Do not treat metadata 24/24 as science approval.",
    scope: "This inquiry has already preserved them; no source edit.",
  },
  {
    id: "R2",
    action: "If applied later, register exactly one source-bound erratum in the authorized source workflow.",
    detail: "Suggested frontmatter entry below uses the contract's source shape. The id is a proposal and collision/authoritative registry status is not checked. Keep original exact and the faithful block unchanged.",
    proposed_frontmatter_entry: suggestedRegistration,
    executed: false,
  },
  {
    id: "R3",
    action: "Replace only the registered original span in the authoritative modern target with 0<=a_k<=9.",
    detail: "Resolve the actual n12 lesson/exercise target from authoritative source bindings first; require original exactly once there, nonempty corrected, original removed from that target, and math-correction in changes. Do not hand-fill an invented target identity or source_refs.",
    original: binding.actual_original_span,
    corrected: independent.domain_inquiry.minimal_modern_replacement_proposal,
    expected_change_tag: "math-correction",
    target_identity: null,
    target_identity_status: "NOT_READ_OR_RECONSTRUCTED",
    executed: false,
  },
  {
    id: "R4",
    action: "Keep the pre-registration page hash distinct from any later authoritative page hash.",
    detail: "A later frontmatter errata edit changes page.json bytes even if blocks are unchanged. This inquiry's current hash is pre-registration evidence, not an authorized post-registration live binding. A later normal workflow must derive its own authoritative registered hash; no freshness/setup or pipeline re-run is performed here.",
    pre_registration_inquiry_page_json_sha256: binding.page_json_sha256,
    executed: false,
  },
  {
    id: "R5",
    action: "Use the independent ten solutions as a limited comparison oracle, not formal answer keys.",
    detail: "113 primary answers follow the source's signed integer-part notation; ordinary whole-sign forms are only explicit value-equivalent cross-checks. 114 signs are <, >, <, >. No author modern/keys comparison has been performed.",
    scope: "Only 113/114; not other exercises, lesson science or glyph review.",
  },
  {
    id: "R6",
    action: "For explanatory context only, keep the zero-tail convention when stating strict digit-by-digit comparison.",
    detail: "The local source already appends infinite zeros to terminating decimals. Eventual all-9 alternatives can equal a different zero-tail expansion. Do not turn this note into an unregistered second formula correction or a claim that all of p0054#2 has been formally approved.",
    example: "0.249999... = 0.250000...",
    relation_to_R3: "No additional source formula replacement proposed; this is a limited modern explanation suggestion.",
    executed: false,
  },
];
const unknowns = [
  {
    subject: "p0055#1 exact printed repeated-4 count",
    status: "UNKNOWN_PRESERVED",
    original_candidate: independent.exercise_114[3].actual_source_subpart_span,
    affects_comparison: false,
    explanation: "At the first differing fractional position k=4, 4>0. The known prefix 0.2444 alone gives a positive gap >=1/2500; no number of repeated glyphs is inferred.",
  },
  {
    subject: "Existing science/glyph status outside this limited scope",
    status: "UNCHANGED_NOT_APPROVED",
    explanation: "No historical audit is read and no previous unknown is converted to a PASS.",
  },
  {
    subject: "Source glyph behind strict <9",
    status: "NO_NEW_GLYPH_INFERENCE",
    explanation: "Source text is taken as strict <9; a mathematical inconsistency does not justify re-reading it as <=9 or asserting an author's intention.",
  },
  {
    subject: "Official registration, target identity/uniqueness, modern propagation and formal acceptance",
    status: "NOT_EXECUTED_NOT_CLAIMED",
    explanation: "Mathematical context is sufficient; formal application remains pending outside this scratch-only inquiry. This is not a missing-context mathematical HOLD or an official gate verdict.",
  },
];
const inquiry = {
  schema: "stemrobin-184B/n12-independent-inquiry@1",
  session_date: "2026-11-19",
  ticket: "STEMROBIN-184B",
  phase_order: {
    independent_artifacts_completed_and_frozen_first: true,
    independent_freeze_manifest_path: freezePath,
    independent_freeze_manifest_sha256: sha256(freezeBytes),
    independent_frozen_at: freeze.created_at,
    verified_independent_artifact_hashes: freeze.artifacts,
    inquiry_created_at: new Date().toISOString(),
    frozen_source_files_revised: false,
  },
  conclusion: {
    domain_math_context: "SUFFICIENT",
    context_insufficiency_hold: false,
    unique_integer_digit_domain: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    minimal_modern_replacement: independent.domain_inquiry.minimal_modern_replacement_proposal,
    decision: "PROPOSE_SOURCE_BOUND_ERRATUM_NOT_APPLIED",
    source_strict_less_than_9_preserved: true,
    source_glyph_or_author_intent_claim: false,
    registered_status_claim: false,
    pipeline_status: "NOT_RUN",
    formal_gate2_status: "NOT_EVALUATED",
    whole_lesson_or_page_pass: false,
    authors_modern_or_keys_compared: false,
  },
  exact_source_binding: binding,
  supporting_derivation: independent.domain_inquiry.derivation,
  contract_binding: {
    path: contractPath,
    sha256: sha256(contractBytes),
    sections_used: ["Source-Bound Errata", "Section Boundaries (scope exclusion only)"],
    scope: "Contract text comparison, not an invocation of its pipeline.",
  },
  contract_comparison: contractComparison,
  minimal_recommendations: minimalRecommendations,
  exercise_comparison_oracle: {
    author_comparison_status: "NOT_PERFORMED_AUTHOR_OUTPUTS_NOT_READ",
    role: "Frozen independent source-derived inquiry, not official author answer keys",
    "113": independent.exercise_113.map((item) => ({
      subpart: item.subpart, source_ref: item.source_ref,
      source_span: item.actual_source_subpart_span,
      primary_source_notation: item.primary_answer_latex,
      ordinary_whole_sign_equivalent: item.ordinary_whole_sign_equivalent_latex,
      integer_part: item.integer_part, fractional_part: item.fractional_part_exact,
      tail: item.tail,
    })),
    "114": independent.exercise_114.map((item) => ({
      subpart: item.subpart, source_ref: item.source_ref,
      source_span: item.actual_source_subpart_span,
      symbol: item.comparison_symbol, first_difference: item.first_difference,
      tail_note: item.subpart === "г"
        ? "Right has infinite zero tail; printed count of repeated 4s on left stays UNKNOWN, comparison unaffected."
        : "Finite inputs extend with infinite zero tails.",
    })),
  },
  preserved_unknowns_and_limits: unknowns,
  actual_source_span_status: {
    p0053_original_occurrences_in_block: 1,
    p0053_original_occurrences_in_source_page_body: 1,
    authoritative_modern_raw_target_occurrences: null,
    authoritative_modern_raw_target_status: "NOT_CHECKED",
    frontmatter_errata_present_in_parsed_page53_meta: Object.hasOwn(page53.metadata_snapshot, "errata"),
    global_registration_status: "NOT_QUERIED",
    section_breaks_authored: false,
  },
  constraints: independent.budget_and_exclusions,
  output_boundary: {
    only_write_root: out,
    source_writes: 0,
    new_images: 0,
    old_science_or_glyph_unknowns_closed: 0,
    source_page_json_hash_changes_by_this_task: 0,
    formal_keys_or_gate_claims: 0,
  },
};

const md = [
  "# n12 Independent Inquiry",
  "",
  "STEMROBIN-184B；2026-11-19。只读源后的离线数学/勘误 inquiry；scratch-only，零新图片。",
  "",
  "## Decision",
  "",
  "本页上下文足以支持十进制整数数字域 **{0,...,9}**，最小现代勘误候选 **0<=a_k<=9**。数学依据不处于上下文不足的 HOLD；正式登记/target 核验/传播未执行，不是正式 Gate2，也没有整课或全页 PASS。",
  "",
  "源式严格 <9 必须保留。不重新猜源 glyph <=，不声称原作者意图，不声称已登记；未读作者 modern/keys，故没有作者产物通过/不通过结论。",
  "",
  "## Independent Freeze First",
  "",
  `独立结果先完成并冻结于 \`${freeze.created_at}\`；inquiry 从冻结文件生成，不反向调整独立解。`,
  "",
  ...freeze.artifacts.map((entry) => `- ${path.basename(entry.file)} SHA-256: \`${entry.sha256}\`。`),
  `- freeze.json SHA-256: \`${sha256(freezeBytes)}\`。`,
  `- edition-text-contract SHA-256: \`${sha256(contractBytes)}\`。`,
  "",
  "## Exact Source Binding",
  "",
  `9c physical **53** / printed **46**，**p0053#6**，zero-based block index **5**，原式 pointer \`/blocks/5/lines/3\`。`,
  "",
  `page.json SHA-256: \`${binding.page_json_sha256}\``,
  "",
  `PDF SHA-256（仅页 metadata 声明，未读取 PDF）: \`${binding.pdf_sha256_declared_not_rehashed}\``,
  "",
  `原式精确 span: \`${binding.actual_original_span}\``,
  "",
  `最小现代候选: \`${independent.domain_inquiry.minimal_modern_replacement_proposal}\``,
  "",
  "原式在本 block 和源页正文各出现一次；没有读取/重建 assembled authoritative target，故不把源页唯一性当作正式 target 唯一性。",
  "",
  "## Local Mathematical Basis",
  "",
  ...independent.domain_inquiry.derivation.flatMap((step, index) => [
    `${index + 1}. ${step.argument}（${step.refs.join(", ")}）`, "",
  ]),
  "这确定的是数字集合，不是唯一文字或印刷意图；<10 也等价，但 <=9 保留源式的 9，替换范围最小。",
  "",
  "## Contract Comparison",
  "",
  ...contractComparison.flatMap((entry, index) => [
    `${index + 1}. **${entry.outcome}**`,
    `契约：${entry.requirement}`,
    `证据：${entry.evidence}`,
    `未执行/不声称：${entry.not_done}`,
    "",
  ]),
  "本 inquiry 只比较已读取的 edition-text-contract 文本，不运行 finalize、assemble、adapt-prepare、adapt-finalize、author keys、发布或 backend freshness。",
  "",
  "## Minimal Recommendation",
  "",
  "1. 不改忠实 block。保留严格 <9、已有条尾和上横线范围，保留 p0055 重复 4 count UNKNOWN。24/24 metadata exclusion 不算科学批准。",
  "2. 日后若正式应用，只在授权源流程中登记这一条 source-bound erratum。以下是契约形状的提案，**未写入源 frontmatter**，id 没有做全局碰撞核验：",
  "",
  "```json",
  JSON.stringify({ errata: [suggestedRegistration] }, null, 2),
  "```",
  "",
  "3. 日后通过 authoritative source binding 确定实际 n12 target，核验 original 在该 raw target 恰好一次，再填 corrected、仅替换对应原式并给该 target 加 math-correction。不得猜造 target id、source_refs 或用本 inquiry 代替正式传播证据。",
  "4. 若登记 frontmatter 改变 page.json 字节，当前页哈希只能保留为前登记证据。登记后的 authoritative hash 必须由后续正常流程产生；不能把 body 未变当作 raw page hash 未变。本次没有重跑任何 setup/freshness。",
  "5. 十问结果仅供有限范围的独立比较，不是正式 keys；源上横线仅负整数部分。保留终止小数无限零尾约定。",
  "6. 如写现代解释，说明严格逐位比较使用标准展开，不使用最终全 9 的另写法。0.249999…=0.250000… 是局部边界提醒，不在此提议第二个 source formula 改动，也不声称 p0054#2 已正式获批。",
  "",
  "## Independent Exercise Oracle",
  "",
  "**113（p0054#6；六问）**",
  "",
  "| 问 | 本书无穷小数写法 | 普通全数负号等值写法 | 尾部 |",
  "| --- | --- | --- | --- |",
  ...independent.exercise_113.map((item) => `| ${item.subpart} | $${item.primary_answer_latex}$ | $${item.ordinary_whole_sign_equivalent_latex}$ | ${item.tail === "infinite_zero_tail" ? "无限零尾；终止值" : "无限重复 3"} |`),
  "",
  "例如 -7.935=-8+0.065，不是 -8.065；-1/4=-1+0.75，不是 -1.75。第六问 -2/3=-1+1/3，不能将有限个 3 后面补零当作精确答案。",
  "",
  "**114（p0054#7 + p0055#1；四问）**",
  "",
  "| 问 | 源数比较结论 | 本书记法的决定证据 |",
  "| --- | --- | --- |",
  "| а | $17.586631<17.586897$ | 整数部分 17 相同，小数第 4 位 6<8 |",
  "| б | $-2.37561>-2.37571$ | $\\overline{3}.6243900000\\ldots>\\overline{3}.6242900000\\ldots$，第 4 位 3>2 |",
  "| в | $-0.786<0.687$ | $\\overline{1}.21400000\\ldots<0.68700000\\ldots$，整数部分 -1<0 |",
  "| г | $0.2444444444\\ldots>0.244$ | 右数为 0.244000…；第 4 位 4>0，不依赖重复 4 印出数量 |",
  "",
  "114 的跨页接续只由实际 p0054#7 open=true、p0055#1 cont=true/open=false 判断；p0055#2 是 n13 标题，不扩展到循环小数节。",
  "",
  "## UNKNOWN And Nonclaims",
  "",
  "p0055#1 候选逐字保留：",
  "",
  "```text",
  independent.exercise_114[3].actual_source_subpart_span,
  "```",
  "",
  "重复 4 的精确印出数量仍 UNKNOWN。仅用已知前缀 0.2444 就有左数 >=0.2444>0.244、差 >=1/2500，因此比较可定 >。无需确认重复数量、无需证明省略号后永远是 4。若采用无限循环 4 的常规读法，左数 11/45、差 1/2250，但不据此关闭 glyph UNKNOWN。",
  "",
  "其他旧 science/glyph UNKNOWN 原状保留；未读其历史包，未作额外页面/全教材审查。没有新图片/浏览器/网络/Git/DB/发布/同伴消息，没有正式 Gate2 或整课 PASS。所有新文件只在当前 n12-independent scratch 目录。",
  "",
].join("\n");

const jsonText = `${JSON.stringify(inquiry, null, 2)}\n`;
writeFileSync(path.join(out, "inquiry.json"), jsonText, { flag: "wx" });
writeFileSync(path.join(out, "inquiry.md"), md, { flag: "wx" });
for (const entry of freeze.artifacts) assert.equal(sha256(readFileSync(entry.file)), entry.sha256);
const outputManifest = {
  schema: "stemrobin-184B/n12-inquiry-hashes@1",
  independent_freeze_manifest_sha256: sha256(freezeBytes),
  created_at: new Date().toISOString(),
  phase_order: "independent-source JSON/MD and freeze.json existed and were verified before inquiry JSON/MD were created",
  artifacts: ["inquiry.json", "inquiry.md"].map((name) => ({
    file: path.join(out, name),
    sha256: sha256(readFileSync(path.join(out, name))),
    bytes: readFileSync(path.join(out, name)).length,
  })),
};
writeFileSync(path.join(out, "inquiry-hashes.json"), `${JSON.stringify(outputManifest, null, 2)}\n`, { flag: "wx" });
for (const name of ["inquiry.json", "inquiry.md", "inquiry-hashes.json"]) {
  chmodSync(path.join(out, name), 0o444);
}
console.log(JSON.stringify({
  phase: "inquiry-complete",
  math_context: inquiry.conclusion.domain_math_context,
  source_original: binding.actual_original_span,
  modern_proposal: inquiry.conclusion.minimal_modern_replacement,
  page_json_sha256: binding.page_json_sha256,
  inquiry_artifacts: outputManifest.artifacts,
  independent_hashes_unchanged: true,
  unknown_count_preserved: true,
  formal_gate2_or_whole_lesson_pass: false,
  new_images: 0,
}, null, 2));

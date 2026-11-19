import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { chmodSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = "/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck";
const out = path.dirname(fileURLToPath(import.meta.url));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const read = (relative) => readFileSync(path.join(root, relative));
const pagesRoot = "ssot-resources/soviet10year-textbooks/artifacts/9c/pages";
const tocPath = "ssot-resources/soviet10year-textbooks/sources/toc/9c.md";
const pageIds = ["0052", "0053", "0054", "0055"];
const pageBytes = new Map();
const sources = pageIds.map((id) => {
  const jsonPath = `${pagesRoot}/${id}/page.json`;
  const mdPath = `${pagesRoot}/${id}/page.md`;
  const bytes = read(jsonPath);
  const mdBytes = read(mdPath);
  const page = JSON.parse(bytes.toString("utf8"));
  assert.equal(page.meta.book, "9c");
  assert.equal(page.meta.page, Number(id));
  pageBytes.set(id, bytes);
  return {
    physical_page: Number(id),
    printed_page: page.meta.printed_page,
    page_json_path: path.join(root, jsonPath),
    page_json_sha256: sha256(bytes),
    page_md_path: path.join(root, mdPath),
    page_md_sha256: sha256(mdBytes),
    blocks_sha256: sha256(JSON.stringify(page.blocks)),
    blocks_hash_definition: "SHA-256 of UTF-8 JSON.stringify(parsedPage.blocks), no trailing newline",
    metadata_snapshot: page.meta,
    actual_blocks: page.blocks.map((block, index) => {
      const text = block.lines.join("\n");
      assert.ok(mdBytes.toString("utf8").includes(text), `${id}#${index + 1} differs from page.md`);
      return {
        source_ref: `p${id}#${index + 1}`,
        block_index_zero_based: index,
        json_pointer: `/blocks/${index}`,
        n12_scope: id !== "0055" || index === 0,
        scope_note: id === "0055" && index > 0
          ? "Read-only page snapshot; section 13/footer is not independently reviewed here."
          : "n12 source context; this is not a full-page glyph/science review.",
        block,
      };
    }),
  };
});
const byPage = Object.fromEntries(sources.map((page) => [String(page.physical_page).padStart(4, "0"), page]));
const getBlock = (id, oneBased) => byPage[id].actual_blocks[oneBased - 1].block;
const getText = (id, oneBased) => getBlock(id, oneBased).lines.join("\n");
const occurrences = (text, span) => text.split(span).length - 1;
const original = "$0\\leqslant a_k<9$";
const corrected = "$0\\leqslant a_k\\leqslant9$";
assert.equal(occurrences(getText("0053", 6), original), 1);
assert.equal(occurrences(byPage["0053"].actual_blocks.map((item) => item.block.lines.join("\n")).join("\n"), original), 1);
assert.equal(getBlock("0054", 6).label, "113");
assert.equal(getBlock("0054", 6).open, false);
assert.equal(getBlock("0054", 7).label, "114");
assert.equal(getBlock("0054", 7).open, true);
assert.equal(getBlock("0055", 1).label, "114");
assert.equal(getBlock("0055", 1).cont, true);
assert.equal(getBlock("0055", 1).open, false);
assert.equal(getBlock("0055", 2).lines[0], "13. 循环小数");
const tocBytes = read(tocPath);
const tocText = tocBytes.toString("utf8");
const tocAnchors = ["    - 12. 引言 ...... 45", "    - 13. 循环小数 ...... 48"];
for (const anchor of tocAnchors) assert.ok(tocText.includes(anchor));

function gcd(a, b) {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}
function rational(n, d = 1n) {
  n = BigInt(n);
  d = BigInt(d);
  assert.ok(d > 0n);
  const divisor = gcd(n, d);
  return { n: n / divisor, d: d / divisor };
}
const eq = (a, b) => a.n * b.d === b.n * a.d;
const add = (a, b) => rational(a.n * b.d + b.n * a.d, a.d * b.d);
const subtract = (a, b) => rational(a.n * b.d - b.n * a.d, a.d * b.d);
const fraction = (a) => `${a.n}/${a.d}`;
function floor(a) {
  const q = a.n / a.d;
  return a.n < 0n && a.n % a.d !== 0n ? q - 1n : q;
}
function decimal(text) {
  const match = /^(-?)(\d+)(?:\.(\d+))?$/.exec(text);
  assert.ok(match, text);
  const digits = match[3] ?? "";
  const d = 10n ** BigInt(digits.length);
  return rational((match[1] ? -1n : 1n) * (BigInt(match[2]) * d + BigInt(digits || "0")), d);
}
function expansion(a) {
  const integer = floor(a);
  let remainder = a.n - integer * a.d;
  const initialRemainder = remainder;
  const seen = new Map();
  const digits = [];
  let repeatStart = null;
  while (remainder !== 0n && !seen.has(remainder)) {
    assert.ok(digits.length < 100, "Unexpectedly long period");
    seen.set(remainder, digits.length);
    const numerator = 10n * remainder;
    const digit = numerator / a.d;
    assert.ok(digit >= 0n && digit <= 9n);
    digits.push(String(digit));
    remainder = numerator % a.d;
  }
  if (remainder !== 0n) repeatStart = seen.get(remainder);
  const result = {
    integer_part: String(integer),
    fractional_part_exact: fraction(rational(initialRemainder, a.d)),
    finite_fractional_digits: repeatStart === null ? digits.join("") : null,
    preperiod: repeatStart === null ? null : digits.slice(0, repeatStart).join(""),
    period: repeatStart === null ? null : digits.slice(repeatStart).join(""),
    tail: repeatStart === null ? "infinite_zero_tail" : "nonzero_periodic_infinite_tail",
  };
  const integerLatex = integer < 0n ? `\\overline{${-integer}}` : String(integer);
  const decimalTail = repeatStart === null ? `${digits.join("")}00000` : `${digits.slice(0, repeatStart).join("")}${digits.slice(repeatStart).join("").repeat(6)}`;
  result.source_convention_latex = `${integerLatex}.${decimalTail}\\ldots`;
  return result;
}

const items113 = [
  ["а", "$7$", rational(7), "7.00000\\ldots", "7.00000\\ldots", "7=7+0；整数在小数点后补无穷个 0。"],
  ["б", "$12.38$", rational(619, 50), "12.3800000\\ldots", "12.3800000\\ldots", "12.38=12+0.38；有限小数保留 38，后补无穷个 0。"],
  ["в", "$-7.935$", rational(-1587, 200), "\\overline{8}.06500000\\ldots", "-7.93500000\\ldots", "-7.935=-8+0.065；上横线只作用于 8，不作用于小数部分 0.065。"],
  ["г", "$\\frac{1}{4}$", rational(1, 4), "0.2500000\\ldots", "0.2500000\\ldots", "1/4=0.25；有限小数的无限写法为 0.25 后接无穷个 0。"],
  ["д", "$-\\frac{1}{4}$", rational(-1, 4), "\\overline{1}.7500000\\ldots", "-0.2500000\\ldots", "-1/4=-1+3/4=-1+0.75；不是把整个 1.75 取负。"],
  ["е", "$-\\frac{2}{3}$", rational(-2, 3), "\\overline{1}.333333\\ldots", "-0.666666\\ldots", "-2/3=-1+1/3；小数部分无限重复 3，不是有限个 3 后接零。"],
].map(([label, raw, value, primary, ordinary, reasoning]) => {
  assert.equal(occurrences(getText("0054", 6), `${label}) ${raw}`), 1);
  const e = expansion(value);
  assert.equal(e.source_convention_latex, primary);
  const reconstituted = add(rational(e.integer_part), rational(
    value.n - BigInt(e.integer_part) * value.d, value.d,
  ));
  assert.ok(eq(value, reconstituted));
  const ordinaryExpansion = expansion(rational(value.n < 0n ? -value.n : value.n, value.d));
  const expectedOrdinary = `${value.n < 0n ? "-" : ""}${ordinaryExpansion.source_convention_latex}`;
  assert.equal(expectedOrdinary, ordinary);
  return {
    exercise: "113", subpart: label,
    source_ref: "p0054#6", source_page_json_sha256: byPage["0054"].page_json_sha256,
    actual_source_subpart_span: `${label}) ${raw}`,
    exact_value: fraction(value),
    ...e,
    primary_answer_latex: primary,
    ordinary_whole_sign_equivalent_latex: ordinary,
    ordinary_equivalent_role: "Value-equivalent cross-check only; not the source bar notation or an authorized modern formula edit.",
    derivation: reasoning,
  };
});

const pairs = [
  {
    label: "а", page: "0054", block: 7, raw: "а) $17.586631$ 和 $17.586897$；",
    left: decimal("17.586631"), right: decimal("17.586897"), symbol: "<",
    leftNotation: "17.58663100000\\ldots", rightNotation: "17.58689700000\\ldots",
    witness: { index: 4, left: "6", right: "8", equal_prefix: "integer part 17; fractional digits 586" },
    reasoning: "整数部分都是 17；小数前三位 586 相同，第 4 位 6<8，所以左数小。有限小数均补无限零尾。",
  },
  {
    label: "б", page: "0054", block: 7, raw: "б) $-2.37561$ 和 $-2.37571$；",
    left: decimal("-2.37561"), right: decimal("-2.37571"), symbol: ">",
    leftNotation: "\\overline{3}.6243900000\\ldots", rightNotation: "\\overline{3}.6242900000\\ldots",
    witness: { index: 4, left: "3", right: "2", equal_prefix: "integer part -3; fractional digits 624" },
    reasoning: "-2.37561=-3+0.62439；-2.37571=-3+0.62429。负整数部分相同，第 4 位 3>2，所以左数大；若直接比较普通全数负号写法，则绝对值较小的负数较大。",
  },
  {
    label: "в", page: "0054", block: 7, raw: "в) $-0.786$ 和 $0.687$；",
    left: decimal("-0.786"), right: decimal("0.687"), symbol: "<",
    leftNotation: "\\overline{1}.21400000\\ldots", rightNotation: "0.68700000\\ldots",
    witness: { index: 0, left: "-1", right: "0", equal_prefix: "none; compare signed integer parts first" },
    reasoning: "-0.786=-1+0.214，0.687=0+0.687；整数部分 -1<0，故左数小。两者是有限小数，补无穷个零不改变值。",
  },
];
const items114 = pairs.map((item) => {
  assert.equal(occurrences(getText(item.page, item.block), item.raw), 1);
  const left = expansion(item.left);
  const right = expansion(item.right);
  assert.equal(left.source_convention_latex, item.leftNotation);
  assert.equal(right.source_convention_latex, item.rightNotation);
  const difference = subtract(item.left, item.right);
  assert.equal(difference.n < 0n ? "<" : difference.n > 0n ? ">" : "=", item.symbol);
  if (item.witness.index === 0) {
    assert.equal(left.integer_part, item.witness.left);
    assert.equal(right.integer_part, item.witness.right);
  } else {
    assert.equal(left.integer_part, right.integer_part);
    const k = item.witness.index - 1;
    assert.equal(left.finite_fractional_digits.slice(0, k), right.finite_fractional_digits.slice(0, k));
    assert.equal(left.finite_fractional_digits[k], item.witness.left);
    assert.equal(right.finite_fractional_digits[k], item.witness.right);
  }
  return {
    exercise: "114", subpart: item.label,
    source_ref: `p${item.page}#${item.block}`,
    source_page_json_sha256: byPage[item.page].page_json_sha256,
    actual_source_subpart_span: item.raw,
    left_exact: fraction(item.left), right_exact: fraction(item.right),
    left_source_convention_latex: item.leftNotation,
    right_source_convention_latex: item.rightNotation,
    comparison_symbol: item.symbol,
    exact_left_minus_right: fraction(difference),
    first_difference: item.witness,
    left_tail: left.tail, right_tail: right.tail,
    derivation: item.reasoning,
  };
});
const lastRaw = "г) $0.2444444444\\ldots$ 和 $0.244$。";
assert.equal(getText("0055", 1), lastRaw);
const candidate = /\$(0\.\d+)\\ldots\$/.exec(lastRaw)[1];
assert.ok(candidate.startsWith("0.2444"));
const right114g = decimal("0.244");
const prefixLowerBound = decimal("0.2444");
const lowerBoundGap = subtract(prefixLowerBound, right114g);
assert.ok(lowerBoundGap.n > 0n);
assert.equal(fraction(lowerBoundGap), "1/2500");
const repeatingFourValue = add(decimal("0.2"), rational(4, 90));
assert.equal(fraction(repeatingFourValue), "11/45");
assert.equal(fraction(subtract(repeatingFourValue, right114g)), "1/2250");
items114.push({
  exercise: "114", subpart: "г",
  source_ref: "p0055#1",
  source_page_json_sha256: byPage["0055"].page_json_sha256,
  actual_source_subpart_span: lastRaw,
  comparison_symbol: ">",
  right_exact: fraction(right114g),
  right_source_convention_latex: "0.24400000\\ldots",
  first_difference: { index: 4, left: "4", right: "0", equal_prefix: "integer part 0; fractional digits 244" },
  left_tail: "ellipsis after a printed repeated-4 candidate; exact displayed count remains UNKNOWN",
  right_tail: "infinite_zero_tail",
  count_unknown: {
    status: "UNKNOWN",
    scope: "Exact number of visibly printed repeated 4s, not mathematical comparison.",
    actual_candidate_preserved: lastRaw,
    exact_displayed_repeated_4_count: null,
    original_page_note_preserved: byPage["0055"].metadata_snapshot.notes,
    new_image_or_glyph_verification: false,
    affects_comparison: false,
  },
  derivation: "左数已知前缀 0.2444，右数 0.244=0.244000…；第 4 位 4>0。即使不假定省略号后的数字全是 4，后续十进制位非负，左数也至少是 0.2444，比右数大 1/2500。重复 4 的印出数量 UNKNOWN 不影响符号，不能据此把 UNKNOWN 关闭。",
  tail_independent_lower_bound: "0.2444",
  tail_independent_gap_lower_bound: fraction(lowerBoundGap),
  optional_periodic_reading: {
    condition: "Only if the ellipsis is read as repeating 4 forever; not needed for the comparison or used to settle glyph count.",
    left_latex: "0.2\\overline{4}",
    left_exact: fraction(repeatingFourValue),
    exact_left_minus_right: "1/2250",
  },
});

const domainSteps = [
  {
    refs: ["p0052#7", "p0052#8", "p0053#1", "p0053#2", "p0053#3", "p0053#6"],
    argument: "本段谈的是十进制位值小数，不是另一个进制；给定 r=m/n，整数部分取 a0=floor(r)，小数部分 t=r-a0 满足 0<=t<1。有限小数按已写出的约定补无限个零。",
  },
  {
    refs: ["p0052#7", "p0053#2", "p0053#3"],
    argument: "逐位除法令 0<=R<n，则下一位 ak=floor(10R/n)，所以 0<=ak<=9，且新余数仍在 [0,n)。数字不能为 10；0 和 9 都是合法且可实际出现的十进制数字。",
  },
  {
    refs: ["p0053#5", "p0053#2", "p0053#6"],
    argument: "本页实际写出 -0.789；取其相反数得到非负有理数 789/1000。依十进制位值提取，a1=7、a2=8、a3=9，随后补零。故同页“任何非负有理数”与排除数字 9 的域不相容；这不把 -0.789 的全数负号误读成整数部分上横线。",
  },
  {
    refs: ["p0053#2", "p0053#5", "p0053#6"],
    argument: "排除 9 也不能靠另一个展开避开矛盾：若所有位仅允许 0..8，为表示 0.789，首位只能为 7、次位只能为 8，此后尾数最大为 sum(k>=3,8/10^k)=8/900。因此总值至多 0.78+8/900=71/90=0.788888…，仍严格小于 789/1000，差 1/9000。",
  },
  {
    refs: ["p0053#6"],
    argument: "唯一被上下文支持的是整数数字集合 {0,1,2,3,4,5,6,7,8,9}。边界可等价写为 0<=ak<=9 或 0<=ak<10；选择 <=9 是保持原式数字 9 的最小现代替换，不是唯一可能的文字，也不是对源 glyph 或原作者意图的判断。",
  },
];
assert.equal(fraction(subtract(decimal("0.789"), add(decimal("0.78"), rational(8, 900)))), "1/9000");
assert.ok(eq(add(rational(-2), rational(1, 2)), rational(-3, 2)));
assert.ok(eq(add(rational(-1), decimal("0.211")), decimal("-0.789")));
assert.ok(eq(add(rational(-118), rational(2, 3)), rational(-352, 3)));

const document = {
  schema: "stemrobin-184B/n12-independent-source@1",
  session_date: "2026-11-19",
  task: "Independent, offline, zero-image n12 mathematics and erratum inquiry",
  authorization: {
    ticket: "STEMROBIN-184B",
    basis: "Human authorization in this chat; no backend/setup/freshness recheck.",
    artifact_only: true,
    write_root: out,
  },
  independence: {
    source_only_solution_before_inquiry: true,
    author_modern_or_answer_keys_read: false,
    historical_packages_or_unfinished_outputs_read: false,
    old_science_glyph_status_inherited_without_approval: true,
    formal_gate2_claim: false,
    whole_lesson_or_page_pass_claim: false,
  },
  budget_and_exclusions: {
    new_images: 0, image_reads: 0, browser_calls: 0, network_calls: 0,
    git_calls: 0, database_calls: 0, publication_calls: 0, peer_messages: 0,
    finalized_or_assembled: false, formal_author_keys_written: false,
    source_files_written: false, worker_replacement_or_unknown_reopen: false,
    scope: "Only n12 exercises 113 (6) and 114 (4), source notation, and p0053#6 domain inquiry.",
  },
  counting_boundary: {
    user_supplied_premise: "p0053/p0055 counting was once 24/24 via metadata exclusion only; body strictly unchanged.",
    new_counting_verification_performed: false,
    historical_count_evidence_read: false,
    implication: "Metadata count exclusion does not approve mathematics/science/glyphs. No source body or metadata is edited here.",
  },
  source_pages: sources,
  toc_binding: {
    path: path.join(root, tocPath),
    sha256: sha256(tocBytes),
    actual_lines: tocAnchors,
    scope_derivation: "n12 starts at printed 45 / physical 52. Exercise 114 continues at p0055#1 and closes before p0055#2, the n13 heading. Section 13 is not solved or approved.",
  },
  source_provenance_limit: {
    pdf_sha256_declared_by_page_metadata: byPage["0053"].metadata_snapshot.source.pdf_sha256,
    pdf_bytes_opened_or_hashed: false,
    page_render_hashes: "Copied from metadata only; no render opened, generated, or independently revalidated.",
    page_json_hashes: "Computed from exact current page.json bytes read for this inquiry.",
    block_ref_convention: "pNNNN#B means 1-based ordinal in actual page.json blocks, including headings and footer blocks; JSON pointers are also supplied.",
  },
  negative_integer_notation: {
    refs: ["p0053#4", "p0053#5", "p0054#3", "p0054#4"],
    actual_evidence: [
      getText("0053", 4),
      getText("0053", 5),
      getText("0054", 3),
      getText("0054", 4),
    ],
    meaning: "For a positive integer m, overline(m).d1d2... means -m + 0.d1d2..., NOT -(m + 0.d1d2...). The small fractional part is nonnegative.",
    definition: "a0=floor(r), t=r-a0 in [0,1); when a0<0 write overline(|a0|) over the entire integer magnitude only.",
    checked_examples: [
      "-3/2=-2+1/2=overline(2).5000...",
      "-0.789=-1+0.211=overline(1).211000...",
      "-117(1/3)=-118+2/3=overline(118).6666...",
    ],
    source_vs_ordinary: "Both representations may encode the same value but their sign scope differs. Primary answers below follow the source notation.",
  },
  domain_inquiry: {
    status: "MATHEMATICAL_CONTEXT_SUFFICIENT_FOR_SOURCE_BOUND_MODERN_ERRATUM_PROPOSAL",
    source_glyph_status: "Accepted supplied/read source text is strict <9; no new glyph inference.",
    hold_for_missing_mathematical_context: false,
    registration_status: "NOT_REGISTERED_BY_THIS_INQUIRY",
    author_intent_claim: false,
    binding: {
      book: "9c", physical_page: 53, printed_page: 46,
      block: "p0053#6", block_index_zero_based: 5,
      original_json_pointer: "/blocks/5/lines/3",
      page_json_path: byPage["0053"].page_json_path,
      page_json_sha256: byPage["0053"].page_json_sha256,
      pdf_sha256_declared_not_rehashed: byPage["0053"].metadata_snapshot.source.pdf_sha256,
      actual_original_span: original,
      original_occurrences_in_bound_block: 1,
      original_occurrences_in_source_page_body: 1,
      actual_bound_block: getBlock("0053", 6),
    },
    supported_integer_digit_set: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    minimal_modern_replacement_proposal: corrected,
    equivalent_boundary_not_selected: "$0\\leqslant a_k<10$",
    derivation: domainSteps,
    preserved_source: "Keep the exact strict <9 span in the faithful source block; no source formula is rewritten here.",
    strictly_limited_conclusion: "Modern mathematical correction has sufficient local context, conditional on proper contract binding/registration. This neither claims a source glyph typo nor identifies the original author's intention.",
  },
  exercise_boundary: {
    "113": { parts: 6, source_refs: ["p0054#6"], closed: true },
    "114": { parts: 4, source_refs: ["p0054#7", "p0055#1"], observed_open_then_cont_closed: true },
    next_section_ref: "p0055#2",
    assembler_or_formal_keys_used: false,
  },
  exercise_113: items113,
  exercise_114: items114,
  local_comparison_convention: {
    refs: ["p0052#8", "p0053#1", "p0054#2"],
    convention: "Use the zero-tail expansion for a terminating decimal; do not substitute the alternative expansion eventually all 9s when applying the strict lexicographic rule.",
    reason: "0.249999...=0.250000... despite their first different digit. Allowing digit 9 is necessary, but strict lexicographic comparison requires this conventional exclusion of eventual 9 tails.",
    scope: "A local consistency note for this erratum and these comparisons only; not a review or approval of later sections.",
  },
  verification: {
    method: "Node built-ins; exact reduced BigInt rationals, floor decomposition and long-division remainder cycle; no floating point, external toolchain, network, or author keys.",
    solved_part_count: 10,
    asserted_part_counts: { "113": items113.length, "114": items114.length },
    asserted_source_span_binding: true,
    asserted_source_bar_and_ordinary_values: true,
    asserted_comparison_signs_and_first_different_places: true,
    unknown_repeat_count_closed: false,
  },
};
assert.equal(items113.length, 6);
assert.equal(items114.length, 4);
assert.equal(byPage["0053"].metadata_snapshot.printed_lines, 24);
assert.equal(byPage["0055"].metadata_snapshot.printed_lines, 24);

const md = [
  "# n12 Independent Source Mathematics",
  "",
  "日期：2026-11-19。STEMROBIN-184B 用户授权下的离线独立 inquiry，仅 scratch，不是正式答案 keys、Gate2、整课或全页 PASS。",
  "",
  "## Scope And Evidence",
  "",
  "- 只解 113 六问、114 四问；只判断 p0053#6 数字域现代勘误的上下文充分性。",
  "- 零新图片、零图片读取、零浏览器、零网络、零 Git、零 DB、零发布、零同伴消息。未读作者 modern/keys、历史包或未完成输出。",
  "- p0053/p0055 一次 24/24、仅 metadata exclusion、正文严格未变是用户给定前提，不重做计数，不将它作为科学或 glyph 批准。",
  "- p0055 重复 4 的印出数量 UNKNOWN 保留；其他旧 science/glyph UNKNOWN 不因本 inquiry 关闭。",
  "- JSON 的 actual_blocks 全量来自实际 page.json 数组，不按摘要凑 block。# 为数组的 1-based ordinal，另附 zero-based pointer。section 13 的快照不是 review。",
  "",
  "### Input Hashes",
  "",
  ...sources.map((page) => `- physical ${page.physical_page} / printed ${page.printed_page}: page.json SHA-256 \`${page.page_json_sha256}\`; page.md SHA-256 \`${page.page_md_sha256}\`; blocks SHA-256 \`${page.blocks_sha256}\`.`),
  `- TOC9c SHA-256 \`${sha256(tocBytes)}\`；实际边界：\`${tocAnchors[0].trim()}\`，\`${tocAnchors[1].trim()}\`。`,
  `- PDF SHA-256 \`${byPage["0053"].metadata_snapshot.source.pdf_sha256}\` 仅由源 metadata 声明；未打开/重 hash PDF，未读取任何 render。`,
  "",
  "## Source Integer Bar Notation",
  "",
  "取 a0=floor(r)，t=r-a0，0<=t<1。整数部分为负时，上横线只在整数绝对值之上：",
  "",
  "$$\\overline{m}.d_1d_2\\ldots=-m+0.d_1d_2\\ldots.$$",
  "",
  "这不是对整个小数取负的语义；小数部分非零时，它与 -(m+0.d1d2...) 的数值也不同。",
  "",
  "实际证据 p0053#4、#5：",
  "",
  "```text",
  getText("0053", 4),
  getText("0053", 5),
  "```",
  "",
  "已用精确有理数核对 -3/2=-2+1/2、-0.789=-1+0.211、-117(1/3)=-118+2/3。p0054#3 同负整数部分的小数仍按正的小数部分比较；不是普通全数负号比较法。",
  "",
  "## Digit Domain Erratum Inquiry",
  "",
  `结论：上下文充分支持整数数字域 **{0,...,9}**，最小现代替换为 \`${corrected}\`。不是 glyph 重猜，不声称原作者意图，不声称已经登记。`,
  "",
  `绑定：9c physical 53 / printed 46，**p0053#6**，JSON pointer \`/blocks/5/lines/3\`，page.json SHA-256 \`${byPage["0053"].page_json_sha256}\`。`,
  "",
  `原式精确 span：\`${original}\`；本 block 及本页正文各出现一次。忠实源式必须保留严格 \`<9\`。`,
  "",
  "实际绑定 block：",
  "",
  "```text",
  getText("0053", 6),
  "```",
  "",
  ...domainSteps.flatMap((step, i) => [`${i + 1}. ${step.argument}（${step.refs.join(", ")}）`, ""]),
  "这里只对数学上下文作充分性判断。正式登记、lesson/exercise target 唯一匹配、assembly 来源与现代传播尚未执行；这些不是数学 UNKNOWN，也不由此自动完成。",
  "",
  "## 113: Six Independent Solutions",
  "",
  `源：p0054#6，page.json SHA-256 \`${byPage["0054"].page_json_sha256}\`。`,
  "",
  "```text",
  getText("0054", 6),
  "```",
  "",
  "| 问 | 源输入 | 按本书的无穷小数写法 | 普通全数负号的等值写法 | 尾部 |",
  "| --- | --- | --- | --- | --- |",
  ...items113.map((item) => `| ${item.subpart} | ${item.actual_source_subpart_span} | $${item.primary_answer_latex}$ | $${item.ordinary_whole_sign_equivalent_latex}$ | ${item.tail === "infinite_zero_tail" ? "有限值；无限零尾" : "无限循环 3，不能补零"} |`),
  "",
  ...items113.map((item) => `- ${item.subpart}: ${item.derivation} 精确值 ${item.exact_value}，整数部分 ${item.integer_part}，小数部分 ${item.fractional_part_exact}。`),
  "",
  "普通写法只是等值交叉核验；不能将本书上横线延伸成全数负号。113 的前五问是终止小数（包括整数）扩展为无限零尾，第六问才是非零循环尾。",
  "",
  "## 114: Four Independent Comparisons",
  "",
  `p0054#7 实际 open；p0055#1 实际 cont=true / open=false；p0055#2 才是 n13。p0055 page.json SHA-256 \`${byPage["0055"].page_json_sha256}\`。`,
  "",
  "```text",
  getText("0054", 7),
  getText("0055", 1),
  "```",
  "",
  "| 问 | 比较结论 | 第一个决定位置 |",
  "| --- | --- | --- |",
  "| а | $17.586631<17.586897$ | 小数第 4 位：6<8 |",
  "| б | $-2.37561>-2.37571$ | 本书写法同为负整数部分 -3，小数第 4 位：3>2 |",
  "| в | $-0.786<0.687$ | 整数部分：-1<0 |",
  "| г | $0.2444444444\\ldots>0.244$ | 小数第 4 位：4>0；候选印出数量仍 UNKNOWN |",
  "",
  ...items114.map((item) => `- ${item.subpart}: ${item.derivation}`),
  "",
  "前两问精确差值（左减右）分别为 -133/500000、1/10000；第三问为 -1473/1000。第四问仅用已知前缀给出差值下界 1/2500 即可；若按无限循环 4 解读，则值为 11/45、精确差 1/2250，但这个附加解读不用于确认印出数量。",
  "",
  "### Preserved UNKNOWN",
  "",
  "候选原行逐字保留：",
  "",
  "```text",
  lastRaw,
  "```",
  "",
  "原 page notes 逐字保留：",
  "",
  "```text",
  byPage["0055"].metadata_snapshot.notes,
  "```",
  "",
  "UNKNOWN 是印出的重复 4 精确数量；没有新图片依据，不填数字、不替换候选、不重开 worker。比较符号不依赖该数量，故可独立确定 >，但 UNKNOWN 不关闭。",
  "",
  "## Local Comparison Convention",
  "",
  "有限小数按 p0052#8、p0053#1 统一补无限零尾。严格逐位比较时使用这种标准展开，不改用最终全 9 的等值另写法；例如 0.249999…=0.250000…，不能由第一个不同数字推成严格小于。允许数字 9 必要，但不能借此无条件认可所有 9 尾的严格比较。此项只记录与本次域修正有关的局部约定，不是全教材审核。",
  "",
  "## Verification And Freeze",
  "",
  "build-independent.mjs 使用 Node 内置 BigInt 精确分数、向下取整和带余除法循环；断言实际输入 span、6+4 小问、上横线及普通写法等值、比较符号和决定位。没有依赖作者 keys，也没有浮点近似。",
  "",
  "完整 actual blocks、页 metadata 和逐问推导见 independent-source.json。JSON/MD 写入后，以 freeze.json 记录 SHA-256，并设为只读；这是 hash-based evidence freeze，不宣称操作系统永久不可修改。inquiry 必须在此 freeze 之后另写。",
  "",
].join("\n");

const jsonText = `${JSON.stringify(document, null, 2)}\n`;
writeFileSync(path.join(out, "independent-source.json"), jsonText, { flag: "wx" });
writeFileSync(path.join(out, "independent-source.md"), md, { flag: "wx" });
// Hash-bound source snapshots must still match the bytes used for the independent derivation.
for (const id of pageIds) assert.deepEqual(read(`${pagesRoot}/${id}/page.json`), pageBytes.get(id));
const manifest = {
  schema: "stemrobin-184B/n12-independent-freeze@1",
  created_at: new Date().toISOString(),
  phase: "independent source solutions complete; inquiry not yet written",
  artifacts: ["independent-source.json", "independent-source.md"].map((name) => ({
    file: path.join(out, name),
    sha256: sha256(readFileSync(path.join(out, name))),
    bytes: readFileSync(path.join(out, name)).length,
  })),
  source_page_json_hashes: Object.fromEntries(sources.map((page) => [page.physical_page, page.page_json_sha256])),
  source_files_written: false,
  freeze_semantics: "SHA-256 manifest plus read-only mode; frozen artifacts are never revised to match a later inquiry.",
};
writeFileSync(path.join(out, "freeze.json"), `${JSON.stringify(manifest, null, 2)}\n`, { flag: "wx" });
for (const name of ["independent-source.json", "independent-source.md", "freeze.json"]) {
  chmodSync(path.join(out, name), 0o444);
}
console.log(JSON.stringify({
  phase: "independent-frozen",
  solved: { "113": 6, "114": 4 },
  artifacts: manifest.artifacts,
  p0053_binding: document.domain_inquiry.binding,
  image_budget_used: 0,
}, null, 2));

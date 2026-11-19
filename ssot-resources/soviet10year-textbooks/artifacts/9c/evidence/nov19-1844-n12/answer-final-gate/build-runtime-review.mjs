import { createHash } from "node:crypto";
import { chmodSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = "/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck";
const out = path.dirname(fileURLToPath(import.meta.url));
const lesson = "ana9-c3-s1-n12";
const book = "ssot-resources/soviet10year-textbooks/artifacts/9c";
const durableRoot = `${book}/evidence/nov19-1844-n12`;
const runtimeRoot = `${durableRoot}/answer-runtime`;
const priorRoot = `${durableRoot}/content-answer-first`;
const localPrior = ".tmp/stemrobin-184-resume/n12-independent/review";
const canonical = `${book}/editions/modern-us-neutral/lessons/${lesson}`;
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const inputs = new Map();
const missing = [];
const checks = [];
function load(relative, role, mode = "json") {
  const absolute = path.isAbsolute(relative) ? relative : path.join(root, relative);
  try {
    const bytes = readFileSync(absolute);
    inputs.set(absolute, {
      path: absolute, sha256: hash(bytes), bytes: bytes.length, role,
    });
    if (mode === "bytes") return bytes;
    if (mode === "text") return bytes.toString("utf8");
    return JSON.parse(bytes.toString("utf8"));
  } catch (error) {
    missing.push({ path: absolute, reason: String(error.message) });
    return null;
  }
}
const info = (relative) => inputs.get(path.isAbsolute(relative) ? relative : path.join(root, relative));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function check(id, condition, description, evidence = {}) {
  checks.push({ id, status: condition ? "PASS" : "BLOCKED", description, evidence });
}
const intake = load(`${runtimeRoot}/parent-intake.json`, "Durable eight-item runtime custody manifest");
for (const row of intake?.rows ?? []) {
  const bytes = load(row.path, "Durable native runtime evidence, verified against parent intake", "bytes");
  check(`custody:${path.basename(row.path)}`, bytes !== null
    && hash(bytes) === row.sha256 && bytes.length === row.bytes,
    "Exact bytes and SHA-256 match the already captured runtime intake", row);
}
const priorIntake = load(`${priorRoot}/parent-intake.json`, "Durable pre-runtime review custody manifest");
for (const row of priorIntake?.rows ?? []) {
  const bytes = load(row.path, "Preserved original review evidence; hash only, not re-executed", "bytes");
  const local = load(`${localPrior}/${path.basename(row.path)}`, "Original local review remains byte-identical to durable custody", "bytes");
  check(`prior-custody:${path.basename(row.path)}`, bytes !== null && local !== null
    && hash(bytes) === row.sha256 && bytes.length === row.bytes && same(bytes, local),
    "Original six review files remain unchanged and match durable custody", { sha256: row.sha256 });
}
const prior = load(`${priorRoot}/review.answer.json`, "Prior all-nine Gate2 decisions reused without new judgments");
const priorContent = load(`${priorRoot}/review.content.json`, "Prior content PASS reused; no 15-block review replay");
const priorHashes = load(`${priorRoot}/review-hashes.json`, "Prior immutable four-output hash manifest");
const candidate = load(`${priorRoot}/answer-input-candidate.json`, "Exact candidate bound before the official finalizer");
const localCandidate = load(".tmp/stemrobin-184-resume/n12-answer-candidate.json", "Original parent draft candidate unchanged");
const prepare = load(`${priorRoot}/answer-keys.template.json`, "Retained first official prepare result; not rerun");
const receipt = load(`${runtimeRoot}/receipt.json`, "Native official main/child execution receipt");
const native = load(`${runtimeRoot}/child-2.stdout`, "Native MathLive exact report from the recorded official child");
const expression = load(`${runtimeRoot}/child-1.stdout`, "Native numeric/expression report from the same recorded invocation");
const wrapper = load(`${runtimeRoot}/capture-wrapper.py`, "Transparent wrapper source; read only", "text");
const durableReady = load(`${runtimeRoot}/answer-keys.finalized.json`, "Ready output captured atomically with the runtime report");
const durableAudit = load(`${runtimeRoot}/answer-keys.audit.json`, "Captured official finalizer audit");
const ready = load(`${canonical}/answer-keys.json`, "Current canonical ready answers, identity/delta only");
const audit = load(`${canonical}/answer-keys.audit.json`, "Current canonical answer audit, exact custody comparison");
const officialPath = ".claude/skills/ld-s10y-answer/tools/lesson_answers.py";
const mathlivePath = ".claude/skills/ld-s10y-answer/tools/check_mathlive_exact.mjs";
const expressionPath = ".claude/skills/ld-s10y-answer/tools/check_math_expressions.mjs";
const normalizerPath = "app/src/lib/answer-normalize.ts";
const official = load(officialPath, "Current official producer; receipt captures its SHA-256", "text");
const mathliveTool = load(mathlivePath, "Read-only child implementation interpretation; never imported or run", "text");
const expressionTool = load(expressionPath, "Read-only zero-checked report interpretation; never imported or run", "text");
load(normalizerPath, "Current shared exact matcher source; not executed", "text");
load(".claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md", "Current contract text, only criteria 5/7 affected", "text");

check("R01", intake?.rows?.length === 8 && intake.actualFinalizeExit === 0
  && intake.invocations === 1 && receipt?.invocations === 1
  && receipt.official_actual_exit === 0 && receipt.exception === null,
  "One recorded official main finalize invocation exited zero; no replay");
check("R02", prior?.verdict === "BLOCKED" && prior.formal_gate2_pass === false
  && prior.content_math_verdict === "PASS" && priorContent?.verdict === "PASS"
  && same(prior.blockers.map((blocker) => [blocker.exercise, blocker.criteria]), [["114", [5, 7]]]),
  "The only prior outstanding judgments were 114 criteria 5 and 7");
check("R03", priorHashes?.artifacts?.every((row) => {
  const retained = info(`${priorRoot}/${path.basename(row.file)}`);
  return retained?.sha256 === row.sha256 && retained.bytes === row.bytes;
}) && priorHashes?.answer_verdict === "BLOCKED",
  "Original BLOCKED and content PASS output hashes remain preserved");
const candidateHash = info(`${priorRoot}/answer-input-candidate.json`)?.sha256;
check("R04", candidateHash === priorIntake?.candidateSha256
  && candidateHash === prior?.candidate_sha256
  && candidateHash === info(".tmp/stemrobin-184-resume/n12-answer-candidate.json")?.sha256
  && candidate?.status === "draft" && same(candidate, localCandidate),
  "Exact pre-finalizer candidate is the previously reviewed draft, with no candidate edits", { candidate_sha256: candidateHash });
const reusedContentHashes = [];
for (const item of priorContent?.inputs ?? []) {
  const relevant = item.path.includes(`${canonical}/`)
    || item.path.includes(`${book}/pages/`)
    || item.path.includes(`${book}/lessons/${lesson}/`)
    || item.path.includes(`/adapt/9c/modern-us-neutral/lessons/${lesson}/`);
  if (!relevant) continue;
  const bytes = load(item.path, "Prior content/source/template PASS reuse eligibility: hash only, no semantic review", "bytes");
  const matched = bytes !== null && hash(bytes) === item.sha256;
  reusedContentHashes.push({ path: item.path, prior_sha256: item.sha256, matched });
  check(`reuse-hash:${item.path}`, matched, "Prior content inputs unchanged; prior PASS can be reused without replay");
}
const frozenHashesRetained = [];
for (const item of prior?.inputs ?? []) {
  if (!/(independent-source|inquiry)\.(json|md)$/.test(item.path)) continue;
  const bytes = load(item.path, "Prior independent frozen artifacts: hash only, no source solving", "bytes");
  const matched = bytes !== null && hash(bytes) === item.sha256;
  frozenHashesRetained.push({ path: item.path, sha256: item.sha256, matched });
  check(`frozen:${path.basename(item.path)}`, matched, "Independent frozen artifacts remain unchanged; not rerun");
}
check("R05", reusedContentHashes.length === 14 && frozenHashesRetained.length === 4,
  "All prior content/source/template hashes and four independent artifact hashes can be reused");
check("R06", info(officialPath)?.sha256 === receipt?.tool_sha256
  && receipt.tool === path.join(root, officialPath)
  && same(receipt.argv, [path.join(root, officialPath), "finalize", "--book", "9c",
    "--edition", "modern-us-neutral", "--lesson", lesson]),
  "Official producer bytes match the execution receipt and the exact main finalize arguments",
  { recorded_tool_sha256: receipt?.tool_sha256, current_tool_sha256: info(officialPath)?.sha256 });
const wrapperSemantics = wrapper?.includes("result = original_run(command, *args, **kwargs)")
  && wrapper.includes("return result")
  && wrapper.includes("exit_code = module.main()")
  && wrapper.includes("subprocess.run = original_run")
  && wrapper.includes('assert not OUT.exists(), "Do not replay a completed official finalizer"');
check("R07", Boolean(wrapperSemantics),
  "Wrapper only records completed child streams and returns the original CompletedProcess; official main and producer are not replaced", {
    wrapper_sha256: info(`${runtimeRoot}/capture-wrapper.py`)?.sha256,
    source_interpretation: "The capture layer delegates to the original subprocess.run with original args/kwargs, writes captured results, returns result unchanged, invokes module.main(), restores subprocess.run, and refuses completed-run replay.",
  });
const children = receipt?.children ?? [];
check("R08", children.length === 2
  && same(children[0].command, ["node", path.join(root, expressionPath), `${canonical}/answer-keys.json`])
  && same(children[1].command, ["node", path.join(root, mathlivePath), "--answer-key", `${canonical}/answer-keys.json`])
  && children.every((child) => child.actual_exit === 0),
  "Both recorded child commands are the official atomic expression/exact checks against this lesson");
for (const child of children) {
  for (const stream of ["stdout", "stderr"]) {
    const item = info(`${runtimeRoot}/${child[stream]}`);
    check(`receipt-stream:${child[stream]}`, item?.sha256 === child[`${stream}_sha256`],
      "Native child stream matches its execution receipt hash");
  }
}
check("R09", Boolean(official?.includes("result = subprocess.run(command, cwd=REPO, text=True, capture_output=True)"))
  && official.includes('document["status"] = "ready"')
  && official.includes('document["count"] = len(document["answers"])')
  && official.includes("if failed:\n        return 2"),
  "Official producer refuses child failures and only then writes ready/count/audit");
check("R10", candidate !== null && ready !== null && same(candidate.answers, ready.answers)
  && ready.status === "ready" && ready.count === 2
  && same(Object.fromEntries(Object.entries(ready).filter(([key]) => !["status", "count"].includes(key))),
    Object.fromEntries(Object.entries(candidate).filter(([key]) => !["status", "count"].includes(key)))),
  "Canonical answers are strictly unchanged from the bound draft; only status=ready and count=2 differ");
check("R11", same(ready, durableReady)
  && info(`${canonical}/answer-keys.json`)?.sha256 === info(`${runtimeRoot}/answer-keys.finalized.json`)?.sha256
  && same(audit, durableAudit)
  && info(`${canonical}/answer-keys.audit.json`)?.sha256 === info(`${runtimeRoot}/answer-keys.audit.json`)?.sha256
  && audit?.status === "pass" && audit.answerCount === 2 && audit.auto === 1 && audit.ungraded === 1,
  "Current canonical ready/audit exactly equal the durable atomic outputs", {
    ready_sha256: info(`${canonical}/answer-keys.json`)?.sha256,
    audit_sha256: info(`${canonical}/answer-keys.audit.json`)?.sha256,
  });
check("R12", prepare?.answers?.length === 2
  && same(prepare.answers.map((answer) => answer.exercise), ["113", "114"])
  && prepare.answers.every((answer) => answer.source === "derived" && !Object.hasOwn(answer, "bookRaw")
    && answer.figureEvidence.length === 0),
  "Retained first prepare declares both derived/no bookRaw/zero figures; prepare is not repeated");
const inputsExpected = (candidate?.answers ?? []).flatMap((answer) => (answer.parts ?? []).flatMap((part) =>
  answer.grading === "auto" && part.judge === "exact"
    ? part.expected.map((value) => ({ name: `${lesson}/${answer.exercise}/${part.label}`, value, label: part.label }))
    : []));
check("R13", native?.schema === "ld-s10y-answer/mathlive-exact-report@1"
  && native.status === "pass" && native.caseCount === 4 && native.failures === 0
  && native.results.length === 4 && inputsExpected.length === 4,
  "Native recorded report is pass4/4 with no failures; exact input inventory is fully covered");
const runtimeCases = (native?.results ?? []).map((result, index) => {
  const expected = inputsExpected[index];
  const passed = expected !== undefined && result.name === expected.name
    && result.source === `${canonical}/answer-keys.json`
    && result.input === expected.value && result.initialized === expected.value
    && result.expanded === expected.value && result.emitted === expected.value
    && result.insertedExpanded === `${expected.value}+1`
    && result.inserted === true && result.preserved === true && result.accepted === true
    && result.attempts === 1 && result.inputEvents === [4, 2, 2, 2][index]
    && Array.isArray(result.rejected) && result.rejected.length === 0;
  check(`case:${result.name}`, passed,
    "Native real insertion/deletion/restored serialization result maps exactly to its unchanged candidate expected", result);
  return { ...result, verification: passed ? "PASS" : "BLOCKED",
    expected_binding: expected ?? null,
    document_isolation: "New navigation/document in editMathLiveValue for every case; one reusable browser page, not a claim of four separate tabs",
  };
});
const keyboardSemantics = mathliveTool?.includes("await page.goto(url)")
  && mathliveTool.includes("const element = new MathfieldElement()")
  && mathliveTool.includes("element.dataset.inputEvents = '0'")
  && mathliveTool.includes("await page.keyboard.type('+1')")
  && mathliveTool.includes("await page.keyboard.press('Backspace')")
  && mathliveTool.includes("value: element.value")
  && mathliveTool.includes("initialized.expanded === edited.expanded")
  && mathliveTool.includes("exactMathAnswersMatch(item.expected, positive.emitted)");
check("R14", Boolean(keyboardSemantics),
  "Read-only native tool audit confirms fresh per-case documents, real keyboard input/delete, event tracking, final emitted value and shared exact grading", {
    child_source_sha256_at_review: info(mathlivePath)?.sha256,
    shared_exact_matcher_source_sha256_at_review: info(normalizerPath)?.sha256,
    runtime_receipt_producer_sha256: receipt?.tool_sha256,
    hash_time_limit: "Receipt captures official Python producer hash; child/matcher hashes here bind the implementation read in this affected review, not an invented historical child hash.",
    no_checker_execution_in_this_review: true,
  });
check("R15", expression?.status === "pass" && expression.checked === 0
  && same(expression.failures, [])
  && inputsExpected.length === 4
  && candidate?.answers?.flatMap((answer) => answer.parts).every((part) => part.judge === "exact")
  && expressionTool?.includes("if(!['numeric','expression'].includes(part.judge))continue"),
  "Expression child checked0 is appropriate because all graded parts are exact symbols; no expression evidence is fabricated");

const priorReused = (prior?.exercise_reviews ?? []).map((review) => ({
  exercise: review.exercise,
  prior_verdict: review.verdict,
  reused_pass_criteria: review.all_nine_criteria.filter((item) => item.status === "PASS").map((item) => item.criterion),
  reused_not_applicable_criteria: review.all_nine_criteria.filter((item) => item.status === "NOT_APPLICABLE").map((item) => item.criterion),
  affected_criteria: review.all_nine_criteria.filter((item) => item.status === "BLOCKED").map((item) => item.criterion),
  previously_evaluated_statuses_reused_without_new_judgments: true,
}));
check("R16", priorReused.length === 2
  && same(priorReused[0].affected_criteria, [])
  && same(priorReused[1].affected_criteria, [5, 7])
  && prior?.exercise_reviews.every((review) => review.all_nine_criteria.every((item) =>
    ["PASS", "NOT_APPLICABLE", "BLOCKED"].includes(item.status))),
  "Only 114 criteria5/7 are reconsidered; all other prior PASS/N/A remain reused");
check("R17", missing.length === 0, "No required durable/official/canonical evidence is missing", { missing });
for (const item of inputs.values()) {
  try {
    check(`stable:${item.path}`, hash(readFileSync(item.path)) === item.sha256,
      "Read-only evidence transaction retained the same input bytes");
  } catch {
    check(`stable:${item.path}`, false, "Evidence became unavailable during the read-only review");
  }
}
const pass = checks.every((item) => item.status === "PASS");
const verdict = pass ? "PASS" : "BLOCKED";
const affected = [
  { exercise: "114", criterion: 5, prior_status: "BLOCKED", status: verdict,
    reason: "Hash-bound native child-2 report shows all four actual per-document keyboard insert/delete transactions with input events, preserved math content and emitted values accepted by the official shared matcher. No setter-cache or pure expected-self-comparison substitutes for this evidence.",
    evidence_path: path.join(root, `${runtimeRoot}/child-2.stdout`),
    evidence_sha256: info(`${runtimeRoot}/child-2.stdout`)?.sha256,
  },
  { exercise: "114", criterion: 7, prior_status: "BLOCKED", status: verdict,
    reason: "Prior mathematical suitability of four symbol-only exact parts is reused, unchanged candidate answers are bound to the now-completed criterion5 input contract, and the recorded official finalizer writes ready with auto1/ungraded1. This resolves the dependent exact-auto reliability blocker.",
    evidence_path: path.join(root, `${runtimeRoot}/answer-keys.audit.json`),
    evidence_sha256: info(`${runtimeRoot}/answer-keys.audit.json`)?.sha256,
  },
];
const report = {
  schema: "stemrobin-184B/n12-review-answer-runtime@1",
  ticket: "STEMROBIN-184B", lesson, edition: "modern-us-neutral",
  created_at: new Date().toISOString(),
  verdict, formal_gate2_final_verdict: verdict, formal_gate2_pass: pass,
  scope: "Affected-only resolution of prior 114 Gate2 criteria5/7, combined with hash-preserved prior PASS/N/A; not a repeated all-nine/source/content review, release, DB publish or ticket close",
  prior_answer_verdict_preserved: "BLOCKED",
  prior_answer_sha256: info(`${priorRoot}/review.answer.json`)?.sha256,
  prior_content_pass_reused: priorContent?.verdict === "PASS",
  prior_content_sha256: info(`${priorRoot}/review.content.json`)?.sha256,
  prior_decisions_reused: priorReused,
  prior_content_hash_reuse: reusedContentHashes,
  independent_freeze_hashes_preserved: frozenHashesRetained,
  affected_judgments: affected,
  actual_execution_custody: {
    receipt, receipt_sha256: info(`${runtimeRoot}/receipt.json`)?.sha256,
    intake_sha256: info(`${runtimeRoot}/parent-intake.json`)?.sha256,
    exact_report_sha256: info(`${runtimeRoot}/child-2.stdout`)?.sha256,
    wrapper_sha256: info(`${runtimeRoot}/capture-wrapper.py`)?.sha256,
    recorded_finalizer_invocations: receipt?.invocations,
    invocations_by_this_review: 0,
    wrapper_interpretation: checks.find((item) => item.id === "R07"),
    official_tool_interpretation: checks.find((item) => item.id === "R14"),
  },
  actual_input_bindings: runtimeCases,
  actual_input_summary: {
    cases: native?.caseCount, native_status: native?.status, native_failures: native?.failures,
    inputs: runtimeCases.map((item) => item.input),
    emitted: runtimeCases.map((item) => item.emitted),
    input_events: runtimeCases.map((item) => item.inputEvents),
    attempts: runtimeCases.map((item) => item.attempts),
    all_inserted_preserved_accepted: runtimeCases.length === 4
      && runtimeCases.every((item) => item.inserted && item.preserved && item.accepted),
    distinct_documents_not_distinct_tabs: true,
    no_negative_cases_claimed: true,
  },
  canonical_delta: {
    candidate_sha256: candidateHash,
    finalized_sha256: info(`${canonical}/answer-keys.json`)?.sha256,
    audit_sha256: info(`${canonical}/answer-keys.audit.json`)?.sha256,
    answers_strictly_equal: same(candidate?.answers, ready?.answers),
    only_official_top_level_changes: { status: "draft -> ready", count: "absent -> 2" },
    official_audit: audit,
  },
  expression_native_report: expression,
  unknown_repeat4_preserved: {
    status: "UNKNOWN",
    provenance: "Reused prior preserved UNKNOWN; unchanged candidate.answers and exact symbol-only runtime inputs. No new glyph inference.",
    exact_d_key: candidate?.answers?.[1]?.parts?.[3]?.expected,
    count_closed: false,
  },
  inputs: [...inputs.values()], checks,
  blockers: checks.filter((item) => item.status !== "PASS"),
  constraints: {
    write_directory: out,
    old_reports_and_freeze_edited: false,
    independent_inquiry_math_content_criteria_replayed: false,
    source_or_content_rendered: false,
    browser_calls: 0, checker_or_finalizer_executions: 0, new_images: 0, image_reads: 0,
    source_canonical_candidate_writes: 0, peer_messages: 0, database_publish_git_calls: 0,
    publication_or_ticket_completion_claim: false,
  },
};
const md = [
  "# n12 Gate2 Runtime Resolution",
  "",
  `正式 Gate2 最终 verdict：**${verdict}**。只消解原114 criteria **5/7**，与已冻结原 PASS/N/A 合并；不是重做九条、十个源小问或十五现代块，也不是发布/DB/ticket关闭。`,
  "",
  "原 review.answer BLOCKED 原样永久保留，本增量报告不覆盖它。原 content PASS 与全部源数学、内容、显示、覆盖及来源判断只做 hash 复用，不重新审查。",
  "",
  "## Prior Decisions Reused",
  "",
  ...priorReused.map((item) => `- ${item.exercise}：复用 PASS criteria ${item.reused_pass_criteria.join(",")}；复用 N/A ${item.reused_not_applicable_criteria.join(",")}；本轮只处理 ${item.affected_criteria.join(",") || "无"}。`),
  `- 原 content JSON SHA-256 \`${report.prior_content_sha256}\`；原 answer JSON SHA-256 \`${report.prior_answer_sha256}\`。`,
  "- 原六审查文件与 durable content-answer-first intake逐字节/hash相同；14个源/content/template输入及4个 independent冻结文件 hash仍相同。",
  "",
  "## Native Execution And Wrapper",
  "",
  `durable receipt SHA-256 \`${report.actual_execution_custody.receipt_sha256}\`；child-2.stdout SHA-256 \`${report.actual_execution_custody.exact_report_sha256}\`。`,
  `wrapper SHA-256 \`${report.actual_execution_custody.wrapper_sha256}\`；official Python producer SHA-256 \`${receipt?.tool_sha256}\`，与当前文件相同。`,
  "",
  "runtime intake八项逐条核对bytes和SHA；receipt中的两个原native子进程命令、真实exit0、stdout/stderr hash与streams相同。一次已完成官方 main finalize，无异常。wrapper调用original_run原args/kwargs，保存已完成stdout/stderr后原样return result；调用module.main，结束恢复subprocess.run，并有拒绝已完成任务重放的guard。未改producer。本轮不执行wrapper/producer/任何check。",
  "",
  "官方producer只有检查全部成功后才写ready/count/audit。ready canonical与durable finalized完全同字节，audit同字节；candidate.answers严格不变，顶层只status draft->ready、新增count2。audit是pass、answerCount2、auto1、ungraded1。",
  "",
  "## Actual Input Binding",
  "",
  "| 实际case | input / emitted | insertedExpanded | inputEvents | attempts | inserted / preserved / accepted |",
  "| --- | --- | --- | --- | --- | --- |",
  ...runtimeCases.map((item) => `| ${item.name} | \`${item.input}\` / \`${item.emitted}\` | \`${item.insertedExpanded}\` | ${item.inputEvents} | ${item.attempts} | ${item.inserted} / ${item.preserved} / ${item.accepted} |`),
  "",
  "四case分别绑定未变canonical的114 a-d“比较符号”expected，完整覆盖 <、>、<、>。native报告pass4/4、failures0，每case一attempt；没有虚构负例检查。",
  "",
  "阅读官方check_mathlive_exact实现确认：每次edit先page.goto创建新文档和MathfieldElement，再setter初始化、清零事件计数；真实键盘输入+1并观察expanded变化，再真实Backspace两次恢复，最后读实际element.value与expanded，通过共享exactMathAnswersMatch判分。虽然复用一个browser page，但每case使用独立导航文档，不能描述成四个独立tab。",
  "",
  "因此报告中的inputEvents、insertedExpanded、preserved与emitted不是setter原串缓存。此review只阅读现有native报告和代码，没有新浏览器或编辑动作。receipt绑定执行时Python producerhash；child和共享matcherhash在此review绑定当前所读实现，不冒充不存在的历史childhash。",
  "",
  "## Criteria5/7 Resolution",
  "",
  ...affected.map((item) => `- 114 criterion${item.criterion}：原 ${item.prior_status} -> **${item.status}**。${item.reason}`),
  "",
  "表达式child的native checked0/pass也与实际全exact parts吻合；没有numeric/expression键，不把checked0虚称做了四个表达式数学验算。",
  "",
  "## Preserved Limits",
  "",
  "113 ungraded理由及六问正确性全部复用，不新求解；114四个数学符号正确性复用，runtime仅证明这些键实际输入可靠。重复4数量仍UNKNOWN，d exact key仍仅[\">\"]，没有关闭glyph未知。官方prepare首次derived/nobookRaw/0figures模板保留，仅确认其已留存字段，不重prepare。",
  "",
  `当前答案 SHA-256 \`${report.canonical_delta.finalized_sha256}\`；candidate SHA-256 \`${candidateHash}\`；audit SHA-256 \`${report.canonical_delta.audit_sha256}\`。`,
  "",
  "## Inputs And Checks",
  "",
  `输入hash绑定${inputs.size}项；局部证据/字节稳定性checks ${checks.length}项；待消解blockers ${report.blockers.length}项。`,
  ...report.blockers.map((item) => `- BLOCKED ${item.id}: ${item.description}`),
  "",
  ...[...inputs.values()].map((item) => `- \`${item.path}\`\n  SHA-256 \`${item.sha256}\`；${item.bytes}bytes；${item.role}。`),
  "",
  "新文件只写n12-independent/review-runtime，原BLOCKED、旧冻解、canonical/source/candidate不动。零browser/check/finalize/newimage/peer/DB/Git。本次结论只供父收存关闭，未自行发布或关闭ticket。",
  "",
].join("\n");
const outputs = [
  ["review.answer.runtime.json", `${JSON.stringify(report, null, 2)}\n`],
  ["review.answer.runtime.md", md],
];
for (const [name, text] of outputs) {
  writeFileSync(path.join(out, name), text, { flag: "wx" });
  chmodSync(path.join(out, name), 0o444);
}
const manifest = {
  schema: "stemrobin-184B/n12-review-answer-runtime-hashes@1",
  verdict,
  artifacts: outputs.map(([name]) => {
    const bytes = readFileSync(path.join(out, name));
    return { path: path.join(out, name), sha256: hash(bytes), bytes: bytes.length };
  }),
  prior_blocked_preserved: true,
  official_invocations_by_this_review: 0,
};
writeFileSync(path.join(out, "runtime-review-hashes.json"), `${JSON.stringify(manifest, null, 2)}\n`, { flag: "wx" });
chmodSync(path.join(out, "runtime-review-hashes.json"), 0o444);
console.log(JSON.stringify({ ...manifest, blockers: report.blockers, input_count: inputs.size }, null, 2));

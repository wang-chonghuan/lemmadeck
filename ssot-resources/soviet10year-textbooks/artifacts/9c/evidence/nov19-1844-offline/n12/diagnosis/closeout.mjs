import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const out = path.dirname(fileURLToPath(import.meta.url));
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const json = (name) => JSON.parse(readFileSync(path.join(out, name), "utf8"));
const bind = (file) => { const bytes = readFileSync(file); return { path: file, bytes: bytes.length, sha256: hash(bytes) }; };
const localBind = (name) => bind(path.join(out, name));
const write = (name, value) => writeFileSync(path.join(out, name), value, { flag: "wx" });
const writeJson = (name, value) => write(name, `${JSON.stringify(value, null, 2)}\n`);
const data = json("measurements.json");
const receipt = json("diagnose.native-exit.json");
const stderr = readFileSync(path.join(out, "diagnose.native.stderr"), "utf8");
assert.equal(receipt.actual_exit, 0);
assert.equal(receipt.signal, null);
assert.equal(receipt.spawn_error, null);
assert.equal(receipt.script_sha256, localBind("diagnose.mjs").sha256);
assert.equal(receipt.wrapper_sha256, localBind("run-native.mjs").sha256);
assert.equal(receipt.stdout_sha256, localBind("diagnose.native.stdout").sha256);
assert.equal(receipt.stderr_sha256, localBind("diagnose.native.stderr").sha256);
assert.equal(data.fatal, null);
assert.equal(data.measurements.length, 3);
assert.equal(data.launch.headless, false);
assert.equal(data.launch.status, "SUCCESS");
assert.equal(data.browser_closed, true);
assert.equal(data.local_server.closed, true);
assert.equal(data.images.new_screenshots, 0);
assert.equal(data.images.new_opens, 0);
assert.equal(data.images.raster_draw_calls, 0);
assert.equal(data.input_files_unchanged, true);
for (const entry of data.inputBindings) assert.equal(bind(entry.path).sha256, entry.sha256);

const pid = Number(stderr.match(/<launched> pid=(\d+)/)?.[1]);
const port = new URL(data.local_server.base).port;
assert.ok(Number.isInteger(pid) && pid > 0);
assert.match(stderr, new RegExp(`\\[pid=${pid}\\] <process did exit: exitCode=0, signal=null>`));
const probe = (command, args) => {
  const result = spawnSync(command, args, { encoding: "utf8" });
  return { command, args, actual_exit: result.status, signal: result.signal,
    spawn_error: result.error?.message ?? null, stdout: result.stdout ?? "", stderr: result.stderr ?? "" };
};
const processProbe = probe("/bin/ps", ["-p", String(pid), "-o", "pid=,comm="]);
const portProbe = probe("/usr/sbin/lsof", ["-nP", `-iTCP:${port}`, "-sTCP:LISTEN"]);
for (const entry of [processProbe, portProbe]) {
  assert.equal(entry.actual_exit, 1);
  assert.equal(entry.signal, null);
  assert.equal(entry.spawn_error, null);
  assert.equal(entry.stdout.trim(), "");
}
const closure = { browser_pid: pid, browser_native_exit: 0, browser_native_log: localBind("diagnose.native.stderr"),
  loopback_port: port, browser_closed: true, local_server_closed: true,
  process_probe: processProbe, listener_probe: portProbe,
  probe_interpretation: "Exit 1 with empty stdout means no matching PID / listening socket. No other processes were inspected or stopped." };
writeJson("closure.json", closure);

// Use measured subpixel scroll ranges, not rounded integer scrollHeight differences.
const autoScrollbar = (style, scroll, axis) =>
  ["auto", "scroll"].includes(style[axis === "x" ? "overflowX" : "overflowY"])
    && scroll[axis === "x" ? "maximumScrollLeft" : "maximumScrollTop"] > 0.01;
const inkMargins = (entry) => ({ left: entry.inkBounds.left - entry.box.x,
  top: entry.inkBounds.top - entry.box.y, right: entry.box.right - entry.inkBounds.right,
  bottom: entry.box.bottom - entry.inkBounds.bottom });
const fractions = data.measurements.filter((entry) => entry.kind === "F002").map((entry) => {
  assert.equal(entry.clone_baseline_matches_original, true);
  assert.equal(entry.original_target_DOM_unchanged, true);
  const before = entry.original.map((item, index) => ({
    target: entry.target_identity[index],
    scroll: item.scroll, overflow: { x: item.style.overflowX, y: item.style.overflowY },
    scrollbar_gutter_estimate_from_rounded_client_width: Math.max(0, item.box.width - item.scroll.clientWidth),
    root_font: item.math.style.fontFamily, math_px: item.math.style.fontSize, ratio: item.math.ratio,
    range_rectangles: item.textRanges, font_outline_estimated_ink: item.inkBounds,
    estimated_ink_margins: inkMargins(item),
    nonpainting_layout_descendants_outside_wrapper: item.overflowDescendants,
    actual_scrollbar_condition: autoScrollbar(item.style, item.scroll, "y"),
    metric_verdict: autoScrollbar(item.style, item.scroll, "y") ? "FAIL" : "PASS"
  }));
  assert.ok(before.every((item) => item.metric_verdict === "FAIL"));
  const variants = entry.variants.map((variant) => {
    const correctedPass = variant.tokens_and_font_unchanged && variant.measurements.every((item) =>
      !autoScrollbar(item.style, item.scroll, "x") && !autoScrollbar(item.style, item.scroll, "y")
      && !autoScrollbar(item.body.style, item.body.scroll, "x") && !autoScrollbar(item.body.style, item.body.scroll, "y")
      && item.estimated_ink_within_wrapper);
    return {
      name: variant.name, one_property_change: variant.property ? { property: variant.property, value: variant.value } : null,
      raw_native_heuristic_verdict_preserved: variant.hypothesis_metric_verdict,
      corrected_scroll_range_metric_verdict: correctedPass ? "PASS_HYPOTHESIS_METRICS" : "FAIL",
      measurements: variant.measurements.map((item, index) => ({
        target: entry.target_identity[index], scroll: item.scroll,
        overflow: { x: item.style.overflowX, y: item.style.overflowY },
        wrapper_width: item.box.width, wrapper_height: item.box.height,
        scrollbar_gutter_estimate_from_rounded_client_width: Math.max(0, item.box.width - item.scroll.clientWidth),
        wrapper_width_reduction_from_original: entry.original[index].box.width - item.box.width,
        parent_scroll: item.body.scroll, parent_overflow: { x: item.body.style.overflowX, y: item.body.style.overflowY },
        font_outline_estimated_ink: item.inkBounds, estimated_ink_margins: inkMargins(item),
        root_font: item.math.style.fontFamily, root_font_px: item.math.style.fontSize, root_ratio: item.math.ratio,
        rendered_math_tokens: item.rendered_token_text, wrapper_tokens_including_punctuation: item.rendered_wrapper_text,
        estimated_ink_contained: item.estimated_ink_within_wrapper,
        original_math_baseline_offset: entry.original[index].math.box.y - entry.original[index].box.y,
        clone_math_baseline_offset: item.math.box.y - item.box.y
      })),
      tokens_annotation_font_and_punctuation_unchanged: variant.tokens_and_font_unchanged
    };
  });
  const accepted = variants.find((variant) => variant.name === "overflow-y-hidden");
  const rejected = variants.find((variant) => variant.name === "overflow-x-visible");
  assert.equal(accepted.corrected_scroll_range_metric_verdict, "PASS_HYPOTHESIS_METRICS");
  assert.equal(rejected.corrected_scroll_range_metric_verdict, "FAIL");
  assert.ok(accepted.measurements.every((item) => item.root_ratio === 1.1
    && Math.abs(item.clone_math_baseline_offset - item.original_math_baseline_offset) < 0.01
    && item.estimated_ink_margins.bottom > 3));
  return { viewport: entry.viewport, original_and_clone_baseline_match: true, before, variants };
});
writeJson("derived-diagnostic-metrics.json", {
  source: localBind("measurements.json"), fractions,
  correction: "The retained native heuristic used scrollHeight > clientHeight + 1 and called the unchanged F002 clone PASS. Rounded heights 33/32 miss a measured maximumScrollTop=2. The final diagnostic uses the captured nonzero scroll range and computed overflow:auto, without replay or alteration of the raw data.",
  raw_native_data_or_logs_modified: false, new_browser_observations: 0
});

const chain = data.measurements.find((entry) => entry.kind === "F001");
assert.equal(chain.original_target_DOM_unchanged, true);
assert.equal(chain.token_font_bar_invariants, true);
assert.equal(chain.hypothesis_metric_verdict, "PASS");
assert.equal(chain.clone_after.scroll.maximumScrollLeft, 0);
assert.ok(chain.clone_before.scroll.maximumScrollLeft > 99);
assert.equal(chain.deliberate_break.reconstructed_tex, chain.deliberate_break.source_tex);
const recommendation = {
  F002: {
    cause: "The horizontal auto overflow declaration makes the unspecified vertical overflow compute to auto. Each short fraction wrapper has small vertical scrollable-layout overflow (rounded heights 33/32 but actual maximumScrollTop=2) and a native 15px scrollbar gutter. This is not a wide fraction or a wrong 1.1em font. The estimated numerator/denominator, minus signs, rules and punctuation stay inside the wrapper.",
    confidence: "Confirmed at the computed-style and scroll-container level. The exact anonymous layout box / rounding contribution is not individually isolated.",
    smallest_measured_change: { property: "overflow-y", value: "hidden", affected: "Only the three fraction wrappers in exercise 113d/e/f",
      illustrative_selector_not_applied: "#ex-113 .body .nb:has(.mfrac)" },
    why_supported: "One declaration removes the auto vertical scrollbar/gutter while retaining overflow-x:auto. Parent body stays unscrollable, root font/1.1em and 5px relative baseline offset are unchanged, and estimated ink retains more than 3px bottom margin.",
    programmatic_scroll_limitation: "overflow-y:hidden still permits programmatic scrollTop=2; the hypothesis removes UI scrollbars and contains nonpainting overflow, not the underlying scrollHeight. No claim that scrollHeight becomes clientHeight is made.",
    rejected_alternative: "overflow-x:visible removes local gutters but propagates layout overflow to the outer .body: maximumScrollTop=1.5, scrollHeight/clientHeight=244/242, and body clientWidth shrinks by 15px in both viewports.",
    scope_guard: "Do not apply overflow-y:hidden to all lesson math wrappers based on these three fractions. Other tall/subscript/formula types and any actual ink clipping remain untested.",
    implemented: false, repaired_visual_acceptance: "NOT_RUN"
  },
  F001: {
    prior_FAIL_reused: true, exact_bound_tex: chain.deliberate_break.source_tex,
    smallest_deliberate_break: "One break before the second equality sign; preserve a single original annotation/MathML and the visual token order.",
    proposed_visual_tex_lines: chain.deliberate_break.proposed_tex_lines,
    reconstructed_tex_exact: chain.deliberate_break.reconstructed_tex === chain.deliberate_break.source_tex,
    measured_clone_operation: chain.deliberate_break,
    before: { client_width: chain.clone_before.scroll.clientWidth, scroll_width: chain.clone_before.scroll.scrollWidth,
      maximum_scroll_left: chain.clone_before.scroll.maximumScrollLeft, wrapper: chain.clone_before.box },
    after: { client_width: chain.clone_after.scroll.clientWidth, scroll_width: chain.clone_after.scroll.scrollWidth,
      maximum_scroll_left: chain.clone_after.scroll.maximumScrollLeft, wrapper: chain.clone_after.box, lines: chain.line_boxes,
      font: chain.clone_after.math.style.fontFamily, ratio: chain.clone_after.math.ratio,
      integer_bar_payload: chain.clone_after.bars.map((bar) => bar.payload),
      bar_rule_widths: chain.clone_after.bars.map((bar) => bar.rule.width),
      estimated_ink: chain.clone_after.inkBounds, paragraph_scroll: chain.clone_after.body.scroll,
      overflow: { x: chain.clone_after.style.overflowX, y: chain.clone_after.style.overflowY } },
    no_renderer_or_math_engine_replay: true,
    before_metric_verdict: "FAIL", after_metric_verdict: "PASS_HYPOTHESIS_HORIZONTAL_METRICS",
    limits: "Both line containers measure about 233.953px, below the original 343px content column. Font-outline estimated bottom is about 0.038px beyond the wrapper box; overflow is visible, not clipped, and the paragraph's scrollHeight includes additional nonpainting layout extent. Full adjacent-paragraph collisions and painted pixels were not rechecked.",
    scope_guard: "Keep normal desktop presentation unchanged if implementing a mobile-only repair. The clone proved the 390px target only, not a breakpoint policy or all narrower screens.",
    implemented: false, repaired_visual_acceptance: "NOT_RUN"
  }
};
const diagnosis = {
  schema: "stemrobin-184B/n12-layout-diagnosis-recommendation@1", lesson: data.lesson,
  status: "COMPLETE_RECOMMENDATION_ONLY", original_visual_gate_verdict: "FAIL",
  prior_check_native_exit: 1, new_diagnostic_native_exit: 0,
  semantic_verdict: "NOT_REVIEWED_AWAITING_FRANKLIN", whole_lesson_PASS: false,
  scope: data.scope, recommendation, evidence_bindings: [
    "diagnose.mjs", "run-native.mjs", "measurements.json", "diagnose.native-exit.json",
    "diagnose.native.stdout", "diagnose.native.stderr", "derived-diagnostic-metrics.json", "closure.json"
  ].map(localBind),
  durable_input_bindings: data.inputBindings,
  browser: { ...data.launch, app_playwright: data.app_playwright, launches: 1, native_exit: 0 },
  requests: data.requests, blocked_external_requests: data.blockedRequests,
  closure,
  images: { prior_open_count: 6, new_opens: 0, captures: 0, crops: 0, reopened: 0,
    cumulative_opens: 6, maximum: 6, canvas_text_metrics_only_no_draw: true },
  original_target_DOMs_unchanged: data.measurements.every((entry) => entry.original_target_DOM_unchanged),
  input_files_unchanged: true,
  untouched: { canonical: true, original_HTML: true, generator: true, first_review_bundle: true,
    no_full_lesson_review_replay: true, no_renderer: true, no_Gate2: true, no_source_math: true,
    no_choice_review: true, no_DB_Git_publisher_peer_messages: true },
  measurement_adjudication: "The raw F002 unchanged-clone PASS was a coarse integer-height predicate, not visual acceptance. derived-diagnostic-metrics.json records corrected failing-before/passing-after judgments based solely on retained maximum scroll ranges; no rerun or raw-report amendment.",
  native_read_helper_note: "One terminal-only node -e summary command returned exit 1 due to an extra closing brace. It performed no browser or file writes; a corrected read-only summary returned 0. This did not affect the one diagnostic observation or its actual receipt.",
  limitations: data.limitations,
  await_parent: "Parent durable intake and Franklin semantic final precede any input modification. No repair permission, semantic PASS or repaired visual PASS is implied."
};
writeJson("diagnosis.json", diagnosis);
writeJson("images-ledger.json", { schema: "stemrobin-184B/n12-zero-image-diagnostic@1",
  original_ledger: data.inputBindings.find((entry) => entry.path.endsWith("/images-ledger.json")),
  before_opens: 6, maximum: 6, this_batch_screenshots: 0, this_batch_image_opens: 0,
  crops: 0, reopens: 0, after_opens: 6, font_outline_text_metrics_without_drawing: true });

const tables = fractions.map((entry) => {
  const after = entry.variants.find((variant) => variant.name === "overflow-y-hidden");
  return entry.before.map((before, index) => {
    const item = after.measurements[index];
    return `| ${entry.viewport.width} ${before.target.subpart} | ${before.scroll.scrollHeight}/${before.scroll.clientHeight} | ${before.scroll.maximumScrollTop} | ${item.wrapper_width_reduction_from_original.toFixed(3)} | ${item.estimated_ink_margins.bottom.toFixed(3)} |`;
  }).join("\n");
}).join("\n");
write("diagnosis.md", `# N12 Targeted Layout Diagnosis

**COMPLETE_RECOMMENDATION_ONLY.** Original visual FAIL / check exit 1 remain unchanged. This diagnostic's actual exit is 0; it is not repaired visual or semantic acceptance. Franklin semantics still await parent intake.

## F002 Cause

The three short fraction wrappers in 113d/e/f compute \`overflow-x:auto; overflow-y:auto\`. Their rounded vertical sizes are scrollHeight/clientHeight **33/32**, but their actual maximum scrollTop is **2px**, producing a **15px** native vertical scrollbar gutter. Horizontal scrollWidth equals clientWidth and maximum scrollLeft is zero. Thus the local problem is small vertical scrollable-layout overflow plus cross-axis auto overflow, not a wide fraction or incorrect mathematical font sizing.

Range rectangles and font-outline ink estimates keep the numerator, denominator, rules, minus signs and final punctuation inside the wrapper. Nonpainting positioned KaTeX layout helpers have unusual extents; no specific anonymous box or rounding contribution was individually removed/isolated, so that deeper attribution remains limited.

## Smallest Measured F002 Repair

Only for the three matched fraction wrappers, add **\`overflow-y:hidden\`**, retaining \`overflow-x:auto\`. An illustrative scoped selector is \`#ex-113 .body .nb:has(.mfrac)\`; no selector, CSS or HTML change was persisted.

| View/subpart | Before scroll/client height | Before max scrollTop | Removed wrapper/gutter width | After estimated ink bottom margin |
| --- | --- | --- | --- | --- |
${tables}

The parent body remains non-scrollable, font stays KaTeX_Main **18.304px / 1.1em**, relative mathematical baseline offset stays 5px, all annotation/rendered characters/punctuation are unchanged, and estimated ink bottom margin exceeds 3px. Hidden overflow remains programmatically scrollable by 2px; the candidate removes UI scrollbar/gutter, not the underlying scrollHeight.

Rejected alternative: \`overflow-x:visible\` makes both axes visible locally but transfers overflow to the outer question body: max scrollTop 1.5px, scrollHeight/clientHeight 244/242, and a 15px loss of parent client width at both viewports. It is not the smallest adequate repair.

Do not apply this hidden overflow to all formulas or alter KaTeX internals/font/em. Only these three fraction types were measured, with font-ink estimates rather than new pixels.

## F001 Deliberate Break

Reuse the original bound failure. Keep one original annotation/MathML and place a single visual line break **before the second equality sign**:

\`\`\`tex
${chain.deliberate_break.proposed_tex_lines.join("\n")}
\`\`\`

Concatenating the two lines reconstructs the source TeX exactly. The isolated clone reused existing KaTeX DOM nodes; no renderer or math engine ran. Client/scroll width changed from **328/427**, max scrollLeft **99.5px**, to **234/234**, max scrollLeft **0**. Both line containers are about **233.953px**, within the 343px content column.

Root font remains KaTeX_Main **1.1em**. The overline payload is still exactly **118**, and its rule width remains **27.984px**. Keep overflow visible on this two-line wrapper; do not reuse the fraction-only hidden-overflow repair here. Estimated ink has a 0.038px bottom overhang and the paragraph includes nonpainting scroll-height extent; neither is new pixel clipping evidence. Adjacent full-lesson blocks, other mobile widths and an eventual production implementation were not tested.

## Evidence And Closure

One headed Chromium ${data.launch.version} launch using app Playwright ${data.app_playwright.version}. Only the exercises target at 1440x960 and 390x844, and the bound long formula at 390x844 were measured. Exactly three loopback HTML requests; no choice page, navigation, screenshots, crops, image opens or renderer replay.

Native \`diagnose.native-exit.json\` binds script and unaltered stdout/stderr, actual exit **0**. Browser PID ${pid} closed with native exit **0**; port ${port} is closed. Final ps/lsof probes return expected no-match exit **1** with empty stdout. Full records are in \`closure.json\`.

The native raw unchanged-clone heuristic said PASS because \`scrollHeight > clientHeight + 1\` misses 33/32 after rounding. That raw result and streams remain unchanged. The final diagnosis uses recorded **nonzero maximumScrollTop plus computed auto overflow**, giving before FAIL, \`overflow-x:visible\` FAIL and \`overflow-y:hidden\` PASS_HYPOTHESIS_METRICS at both viewports. This is data adjudication, not a browser rerun or a false visual PASS.

All necessary durable inputs were hash-checked unchanged again. Original target DOMs were untouched; only disposable in-memory iframe clones changed. Cumulative image opens remain **6/6**, this batch **0**. Font-outline TextMetrics were measured without canvas drawing or raster inspection.

The original first-review bundle, HTML, canonical, generator and prior source/math/Gate2 results remain unchanged. Full lesson and choice semantics were not reviewed. Wait for parent durable intake and Franklin final before any input modifications.
`);
console.log(JSON.stringify({ diagnostic_closeout: "COMPLETE", repairs_applied: false, original_visual_gate: "FAIL",
  F002_before: "FAIL", F002_after: "PASS_HYPOTHESIS_METRICS", F001_after: "PASS_HYPOTHESIS_HORIZONTAL_METRICS",
  new_image_operations: 0, browser_server_closed: true,
  report: localBind("diagnosis.json"), markdown: localBind("diagnosis.md"),
  raw_measurements: localBind("measurements.json"), native_receipt: localBind("diagnose.native-exit.json")
}, null, 2));

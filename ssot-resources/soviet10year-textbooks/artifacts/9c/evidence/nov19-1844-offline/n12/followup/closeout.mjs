import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const out = path.dirname(fileURLToPath(import.meta.url));
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const bind = (file) => { const bytes = readFileSync(file); return { path: file, bytes: bytes.length, sha256: hash(bytes) }; };
const localBind = (name) => bind(path.join(out, name));
const json = (name) => JSON.parse(readFileSync(path.join(out, name), "utf8"));
const write = (name, value) => writeFileSync(path.join(out, name), value, { flag: "wx" });
const writeJson = (name, value) => write(name, `${JSON.stringify(value, null, 2)}\n`);
const data = json("actual-measurements.json");
const native = json("check.native-exit.json");
const stderr = readFileSync(path.join(out, "check.native.stderr"), "utf8");
assert.equal(native.script_sha256, localBind("check.mjs").sha256);
assert.equal(native.wrapper_sha256, localBind("run-native.mjs").sha256);
assert.equal(native.stdout_sha256, localBind("check.native.stdout").sha256);
assert.equal(native.stderr_sha256, localBind("check.native.stderr").sha256);
assert.equal(native.actual_exit, data.native_exit);
assert.equal(native.signal, null);
assert.equal(native.spawn_error, null);
assert.equal(data.fatal, null);
assert.equal(data.results.length, 4);
assert.equal(data.launch.headless, false);
assert.equal(data.browser_closed, true);
assert.equal(data.local_server.closed, true);
assert.equal(data.images.new_opens, 0);
assert.equal(data.images.after_opens, 6);
assert.equal(data.inputs_unchanged_during_followup, true);
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
  assert.equal(entry.stdout.trim(), "");
  assert.equal(entry.signal, null);
  assert.equal(entry.spawn_error, null);
}
const closure = { browser_pid: pid, browser_native_exit: 0, browser_closed: true,
  browser_native_log: localBind("check.native.stderr"),
  loopback_port: port, local_server_closed: true, process_probe: processProbe, listener_probe: portProbe,
  probe_interpretation: "Expected exit 1 with empty stdout: no matching PID or listening socket. Only this observation's PID/port were inspected." };
writeJson("closure.json", closure);

const pages = data.results.map((result) => {
  const gaps = {
    previous_box: result.adjacent[1].box.y - result.adjacent[0].box.bottom,
    next_box: result.adjacent[2].box.y - result.adjacent[1].box.bottom,
    previous_font_ink_estimate: result.adjacent[1].glyphs.bounds.top - result.adjacent[0].glyphs.bounds.bottom,
    next_font_ink_estimate: result.adjacent[2].glyphs.bounds.top - result.adjacent[1].glyphs.bounds.bottom
  };
  return {
    name: result.name, viewport: result.viewport, scoped_actual_verdict: result.scoped_actual_verdict,
    assertions: result.checks.length, failed: result.checks.filter((entry) => entry.verdict === "FAIL"),
    target_count: result.target_count, loaded_DOM_unchanged: result.loaded_DOM_unchanged_by_followup,
    adjacent: result.adjacent.map((entry) => ({ role: entry.role, tag: entry.tag, class: entry.class, id: entry.id,
      box: entry.box, font_ink_estimate: entry.glyphs.bounds })),
    gaps,
    F001: result.name === "text" ? result.measurements.map((entry) => ({
      tex: entry.tex, wrapper_style: entry.style, scroll: entry.scroll, font: entry.math.style,
      font_ratio: entry.math.ratio, column: entry.column, bars: entry.bars,
      lines: entry.lines.map((line) => ({ box: line.box, scroll: line.scroll, font_ink_estimate: line.glyphs.bounds }))
    })) : [],
    F002: result.name === "exercises" ? result.measurements.map((entry) => ({
      identity: entry.identity, tex: entry.tex, wrapper_style: entry.style, scroll: entry.scroll,
      font: entry.math.style, font_ratio: entry.math.ratio, ink_margins: entry.ink_margins,
      wrapper_gutter_estimate: entry.wrapper_gutter_estimate, parent_scroll: entry.parent_scroll,
      parent_style: entry.parent_style, fraction_rules: entry.glyphs.rules
    })) : []
  };
});
const verdict = data.scoped_actual_verdict;
const report = {
  schema: "stemrobin-184B/n12-layout-followup-review@1", lesson: data.lesson,
  verdict, verdict_scope: "Actual repaired F001/F002 and immediately adjacent block geometry at the two requested viewports, using DOM/computed-style/font-outline estimates.",
  native_check_exit: native.actual_exit,
  fresh_pixel_proof: false, whole_lesson_visual_PASS_declared: false, whole_lesson_semantic_review_replayed: false,
  input_bindings: data.inputBindings,
  evidence_bindings: ["check.mjs", "run-native.mjs", "actual-measurements.json", "check.native.stdout",
    "check.native.stderr", "check.native-exit.json", "closure.json"].map(localBind),
  actual_HTML_byte_scope_verified: data.byte_scope,
  choice_hash_only_unchanged: data.choices_hash_only_unchanged,
  pages,
  assertions: { total: pages.reduce((total, page) => total + page.assertions, 0),
    failed: pages.reduce((total, page) => total + page.failed.length, 0) },
  F001_conclusion: {
    verdict: pages.filter((page) => page.name === "text").every((page) => page.scoped_actual_verdict === "PASS") ? "PASS" : "FAIL",
    actual_not_clone: true, deliberate_two_lines: true, line_widths_px: [233.953, 233.953],
    maximum_horizontal_scroll_px: 0, annotation_and_MathML_preserved: true,
    original_visible_tokens_preserved: true, KaTeX_Main_font_ratio: 1.1,
    integer_only_bar_payload: "118", bar_width_px: 27.984,
    no_hidden_horizontal_ancestor_found: true,
    close_line_box_note: "Each font-outline estimate extends about 0.037px below its line box, but overflow is visible and the estimated ink-to-ink gap between the lines is positive. This is not newly viewed pixel proof."
  },
  F002_conclusion: {
    verdict: pages.filter((page) => page.name === "exercises").every((page) => page.scoped_actual_verdict === "PASS") ? "PASS" : "FAIL",
    actual_not_clone: true, identities: ["113d", "113e", "113f"], fraction_innerHTML_and_punctuation_preserved: true,
    font_ratio: 1.1, overflow_y: "hidden", estimated_bottom_margins_px: [3.305, 3.305, 3.022],
    no_UI_vertical_scrollbar_condition: true, no_15px_gutter_measured: true,
    no_outer_body_scrollbar_condition: true,
    retained_nonpainting_scroll_extent: "scrollHeight/clientHeight still 33/32 and programmatic maximum scrollTop still 2px. Hidden overflow suppresses UI scrollbar, not the stored vertical scroll range."
  },
  adjacent_conclusion: {
    verdict: pages.every((page) => page.failed.every((entry) => !entry.id.startsWith("adjacent-"))) ? "PASS" : "FAIL",
    no_new_box_collision: true, positive_font_outline_vertical_clearances: true,
    minimum_estimated_ink_gap_px: Math.min(...pages.flatMap((page) =>
      [page.gaps.previous_font_ink_estimate, page.gaps.next_font_ink_estimate])),
    touching_exercise_row_boxes_allowed: "113 and 114 row borders touch without overlapping; their estimated ink remains separated."
  },
  prior_results: data.previous_reviews,
  no_original_report_amendments: true,
  reuse_contract: {
    other_layout_and_control_results: "Previous PASS evidence reused only for byte-unchanged regions. No choices/navigation/radio/whole-page review rerun.",
    original_first_visual_FAIL: "Retained as first-version evidence; its native exit 1 and all screenshots remain frozen.",
    subscript_2px_advisories: "Original unconfirmed internal-geometry flags retained without remeasurement or a new glyph/font verdict.",
    Franklin: "Human reports retained final semantic PASS; not independently re-reviewed in this scoped followup.",
    Gate2_and_source_mathematics: "Frozen prior results left unchanged."
  },
  browser: { ...data.launch, app_playwright: data.app_playwright, launch_count: 1, native_exit: 0 },
  local_requests: data.requests, blocked_external_requests: data.blocked_external_requests,
  images: data.images, closure,
  limitations: [
    "No new screenshots, crops, image opens or raster drawing. Cumulative opens stay 6/6; no fresh painted-pixel proof.",
    "TextMetrics estimates font outlines with an estimated baseline. Range rectangles and CSS rules provide geometry, not pixel inspection.",
    "Only F001/F002 targets and immediately adjacent paragraph/exercise blocks were checked at 1440x960 and 390x844.",
    "A 1px tolerance is used for line-box/column geometry, not as permission to discard source tokens or alter font sizing.",
    "This scoped actual PASS does not rewrite the original first visual FAIL or claim a new whole-lesson screenshot/semantic/Gate2 PASS."
  ],
  this_reviewer_modified_HTML_canonical_generator: false,
  no_control_choice_math_Gate2_renderer_replay: true,
  next_action: "Return exact paths/hashes for parent intake and stop this scoped task. No further browser or pixel actions."
};
writeJson("review.json", report);
writeJson("images-ledger.json", { schema: "stemrobin-184B/n12-actual-followup-zero-image-ledger@1",
  prior_ledger: data.inputBindings.find((entry) => entry.path.endsWith("/first/images-ledger.json")),
  before_opens: 6, maximum: 6, actual_new_screenshots: 0, actual_image_opens: 0, crops: 0,
  reopens: 0, raster_draw_calls: 0, after_opens: 6, font_outline_metrics_only: true });
const table = pages.map((page) => `| ${page.viewport.width}x${page.viewport.height} ${page.name} | ${page.scoped_actual_verdict} | ${page.assertions - page.failed.length}/${page.assertions} | ${page.gaps.previous_font_ink_estimate.toFixed(3)} / ${page.gaps.next_font_ink_estimate.toFixed(3)} |`).join("\n");
const HTMLs = data.inputBindings.filter((entry) => entry.path.includes("/.tmp/ld-s10y-lesson/render/")).map((entry) =>
  `- \`${path.basename(entry.path)}\`: \`${entry.sha256}\``).join("\n");
write("review.md", `# N12 Actual Layout Followup

**Scoped Actual ${verdict}**, native check exit **${native.actual_exit}**. This applies only to repaired F001/F002 and their immediately adjacent block geometry. It is not a new screenshot or whole-lesson visual/semantic/Gate2 PASS. Original first visual FAIL, native exit 1, all pixels and 2px subscript advisories remain frozen.

## Actual Targets

| Actual view | Verdict | Assertions | Previous / next estimated ink gap, px |
| --- | --- | --- | --- |
${table}

${report.assertions.total} target assertions, ${report.assertions.failed} failures. The observation used actual changed HTML, not hypothetical clones.

F001: Two deliberate lines, each about **233.953px**, have client/scroll width **234/234** and maximum horizontal scroll **0**. They fit the actual content columns at both viewports, with no hidden horizontal ancestor. A single original annotation and MathML remain exact; original visible tokens are unchanged, second line begins the second equality, KaTeX_Main stays **1.1em**, and the bar covers only **118**, width **27.984px**.

Each line's font-outline estimate extends about 0.037px below its box, with visible overflow and a positive estimated ink-to-ink gap between lines. Neither this internal box overhang nor unused scroll-height extent is treated as a pixel defect or font-size error.

F002: Only the actual 113d/e/f fraction wrappers have \`overflow-y:hidden\`. Their innerHTML, annotation, minus signs and final punctuation match the preserved before-fragments. Root font stays **1.1em**. Estimated ink bottom margins are **3.305 / 3.305 / 3.022px**, with positive numerator/denominator/rule/side margins. The measured gutter estimate is under 1px rounding tolerance, not the former 15px native scrollbar gutter; no auto vertical scrollbar condition or parent body scroll condition remains.

The hidden wrappers still report scrollHeight/clientHeight **33/32** and a programmatic maximum scrollTop **2px**. UI scrollbar suppression is not described as elimination of the underlying scrollable layout extent.

Immediately neighboring paragraph/exercise boxes do not overlap and estimated ink clearance is positive. 113/114 row border boxes touch without collision; their estimated ink remains about 39.697px apart.

## Bindings And Reuse

The changed files match the parent repair receipt exactly: one text wrapper and three fraction wrappers, with every other HTML byte unchanged. Choices were hash-checked only; no choice HTML navigation or semantic/control review was replayed.

${HTMLs}

Input hashes also bind the repair script/receipt, durable original reports/HTML and diagnosis. Other layout/control PASS evidence is reused for unchanged regions only. Original first FAIL and all native/pixel evidence remain unchanged. The human reports retained Franklin final semantic PASS; this reviewer did not re-review it. No source mathematics, Gate2 or renderer rerun.

## Native Closure

One headed Chromium ${data.launch.version} launch using app Playwright ${data.app_playwright.version}; four loopback page loads at **1440x960 / 390x844**. No fallback, clones, screenshots, crops, controls, external requests or image opens.

Actual native stdout/stderr and exit are bound by \`check.native-exit.json\`. Browser PID ${pid} closed with native exit **0**, and loopback port ${port} is closed. Final ps/lsof probes returned expected no-match exit **1** with empty stdout; exact outputs are in \`closure.json\`.

## Limits

This is DOM/computed-style/font-outline evidence on the actual changed HTML, with estimated baselines and 1px line-box tolerance. There is **no fresh painted-pixel proof**. Cumulative opens stay **6/6**, this followup **0**. No HTML, canonical, generator or prior report was modified by this reviewer. Return paths/hashes for parent intake and stop this scoped task.
`);
console.log(JSON.stringify({ closeout: "COMPLETE", scoped_actual_verdict: verdict, native_check_exit: native.actual_exit,
  assertions: report.assertions, fresh_pixel_proof: false, new_images: 0, cumulative_image_opens: 6,
  browser_server_closed: true, report: localBind("review.json"), markdown: localBind("review.md"),
  actual_measurements: localBind("actual-measurements.json"), native_receipt: localBind("check.native-exit.json")
}, null, 2));

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const out = path.dirname(fileURLToPath(import.meta.url));
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const readJson = (name) => JSON.parse(readFileSync(path.join(out, name), "utf8"));
const write = (name, bytes) => writeFileSync(path.join(out, name), bytes, { flag: "wx" });
const writeJson = (name, data) => write(name, `${JSON.stringify(data, null, 2)}\n`);
const bind = (file) => {
  const bytes = readFileSync(file);
  return { path: file, bytes: bytes.length, sha256: hash(bytes) };
};
const dom = readJson("dom-report.json");
const visual = readJson("visual-observations.json");
const native = readJson("check.native-exit.json");
const screenshots = readJson("screenshots.json");
const stderr = readFileSync(path.join(out, "check.native.stderr"), "utf8");

assert.equal(dom.pages.length, 6);
assert.equal(dom.screenshots.length, 6);
assert.equal(dom.native_exit, 1);
assert.equal(native.actual_exit, 1);
assert.equal(native.script_sha256, bind(native.script).sha256);
assert.equal(native.stdout_sha256, bind(path.join(out, "check.native.stdout")).sha256);
assert.equal(native.stderr_sha256, bind(path.join(out, "check.native.stderr")).sha256);
assert.equal(visual.actual_opens_this_batch, 6);
assert.equal(visual.images_reopened, 0);
assert.equal(visual.crops_or_additional_images, 0);
assert.equal(dom.fatal, null);
assert.equal(dom.inputs_unchanged, true);
assert.equal(dom.browser_closed, true);
assert.equal(dom.local_server.closed, true);
assert.equal(dom.launches.length, 1);
assert.equal(dom.launches[0].headless, false);
assert.equal(dom.blocked_external_requests.length, 0);

const currentInputs = dom.inputBindings.map((input) => {
  const current = bind(input.path);
  assert.equal(current.sha256, input.sha256, `Input changed: ${input.name}`);
  assert.equal(current.bytes, input.bytes);
  return { ...current, name: input.name, original_sha256: input.sha256, unchanged: true };
});

const ledgerEntries = screenshots.map((image, index) => {
  const observation = visual.pages[index];
  assert.equal(path.basename(image.path), observation.image);
  assert.equal(image.sha256, observation.sha256);
  assert.equal(observation.open_index, index + 1);
  assert.equal(observation.open_count, 1);
  const current = bind(image.path);
  assert.equal(current.sha256, image.sha256);
  assert.equal(current.bytes, image.bytes);
  const bytes = readFileSync(image.path);
  assert.equal(bytes.readUInt32BE(16), image.width);
  assert.equal(bytes.readUInt32BE(20), image.height);
  return { ...image, image_open_count: 1, open_index: index + 1, observation: observation.image,
    unchanged_since_capture: true, pixel_reopen_or_crop: false };
});

const pid = Number(stderr.match(/<launched> pid=(\d+)/)?.[1]);
assert.ok(Number.isInteger(pid) && pid > 0);
assert.match(stderr, new RegExp(`\\[pid=${pid}\\] <process did exit: exitCode=0, signal=null>`));
const port = new URL(dom.local_server.base).port;
const probe = (command, args) => {
  const result = spawnSync(command, args, { encoding: "utf8" });
  return { command, args, actual_exit: result.status, signal: result.signal,
    spawn_error: result.error?.message ?? null, stdout: result.stdout ?? "", stderr: result.stderr ?? "" };
};
const processProbe = probe("/bin/ps", ["-p", String(pid), "-o", "pid=,comm="]);
const serverProbe = probe("/usr/sbin/lsof", ["-nP", `-iTCP:${port}`, "-sTCP:LISTEN"]);
assert.equal(processProbe.actual_exit, 1, "Review browser PID must be absent");
assert.equal(processProbe.stdout.trim(), "");
assert.equal(processProbe.spawn_error, null);
assert.equal(serverProbe.actual_exit, 1, "Review server port must have no listening process");
assert.equal(serverProbe.stdout.trim(), "");
assert.equal(serverProbe.spawn_error, null);
const closure = {
  browser_pid: pid, native_browser_exit: 0, browser_log: bind(path.join(out, "check.native.stderr")),
  browser_closed_in_capture: true, loopback_server_closed_in_capture: true,
  process_probe: processProbe, server_probe: serverProbe,
  probe_exit_one_means: "ps: no matching PID; lsof: no matching listener. These are expected absence results, not a gate failure.",
  no_other_processes_inspected_or_stopped: true
};
writeJson("closure.json", closure);

const pageSummaries = dom.pages.map((page, index) => {
  const observed = visual.pages[index];
  const d = page.final_dom;
  assert.equal(page.name, screenshots[index].page);
  assert.equal(page.viewport.name, screenshots[index].viewport);
  assert.equal(page.errors.length, 0);
  assert.equal(page.page_closed, true);
  assert.equal(d.images, 0);
  assert.equal(d.image_tags, 0);
  assert.equal(d.katex_errors.length, 0);
  assert.equal(d.scripts, 0);
  assert.ok(d.local_main_font_loaded);
  if (page.name === "text") assert.equal(d.paragraphs.length, 17);
  if (page.name === "exercises") {
    assert.deepEqual(d.exerciseRows.map((row) => row.number), ["113.", "114."]);
    assert.deepEqual(d.exerciseRows.map((row) => row.subpart_labels),
      [["a", "b", "c", "d", "e", "f"], ["a", "b", "c", "d"]]);
    assert.equal(d.input_count, 0);
  }
  if (page.name === "choices") {
    assert.equal(d.exerciseRows.length, 10);
    assert.equal(d.options.length, 38);
    assert.equal(page.actions.length, 38);
    assert.deepEqual(d.exerciseRows.map((row) => row.radios.length), [4, 4, 4, 4, 4, 4, 4, 3, 3, 4]);
    assert.ok(page.actions.every((action) => action.radios.filter((radio) => radio.checked).length === 1
      && action.radios[action.option_index].checked));
    assert.equal(d.options.some((option) => option.cell_collision), false);
  }
  return {
    page: page.name, viewport: page.viewport, screenshot: bind(screenshots[index].path),
    screenshot_dimensions: { width: screenshots[index].width, height: screenshots[index].height },
    dom_verdict_unaltered: page.dom_verdict, visual_verdict: observed.visual_verdict,
    assertions: page.checks.length, passed_assertions: page.checks.filter((check) => check.status === "PASS").length,
    failed_assertions: page.checks.filter((check) => check.status === "FAIL").map((check) => check.id),
    paragraphs: d.paragraphs.length, exercises: d.exerciseRows.length, options: d.options.length,
    rendered_formulas: d.formulas.length, ascii_labels: d.ascii.length, rendered_bars: d.bars.length,
    loaded_font_faces: d.font_faces.filter((face) => face.status === "loaded"),
    no_page_horizontal_overflow: d.document.scroll_width <= page.viewport.width + 1
      && d.document.body_scroll_width <= page.viewport.width + 1,
    native_label_selection_assertions: page.actions.length,
    finding_ids: observed.finding_ids
  };
});

// This supplement indexes captured geometry; it does not launch or re-evaluate a page.
const optionGeometry = dom.pages.filter((page) => page.name === "choices").map((page) => ({
  viewport: page.viewport,
  source: "dom-report.json final_dom, captured before its one full-page screenshot",
  options: page.final_dom.options.map((option) => ({
    index: option.index, name: option.name, letter: option.letter, box: option.box,
    radio_box: option.cells[0], letter_box: option.cells[1], text_box: option.cells[2],
    visible: option.visible, cell_collision: option.cell_collision,
    explicit_choice_lines: option.lines, formulas: option.formulas,
    scroll_reachable: page.reachability[option.index].reachable
  })),
  bottom: page.bottom,
  no_horizontal_option_overflow_flags: page.final_dom.overflow.length === 0,
  actual_label_clicks: page.actions.length
}));
writeJson("option-geometry.json", optionGeometry);
writeJson("images-ledger.json", {
  schema: "stemrobin-184B/n12-images-ledger@1",
  prior_opens: 0, capture_budget: 6, actual_captures: 6, open_budget: 6,
  actual_opens: 6, lifetime_opens_in_this_independent_context: 6,
  batch_within_eight: true, reopened: 0, crops: 0, additional_captures: 0,
  capture_phase_ledger_preserved: bind(path.join(out, "images-ledger.pending.json")),
  screenshot_capture_manifest_preserved: bind(path.join(out, "screenshots.json")),
  entries: ledgerEntries,
  no_images_to_parent_or_peer: true,
  no_further_image_activity_authorized_in_this_batch: true
});

const provenance = [
  "dom-report.json", "check.mjs", "run-native.mjs", "check.native.stdout", "check.native.stderr",
  "check.native-exit.json", "browser-launch.json", "screenshots.json", "visual-observations.json",
  "images-ledger.pending.json", "images-ledger.json", "closure.json", "option-geometry.json"
].map((name) => bind(path.join(out, name)));
const report = {
  schema: "stemrobin-184B/n12-offline-visual-review@1", lesson: dom.lesson,
  ticket: "STEMROBIN-184B", verdict: "FAIL", visual_gate_verdict: "FAIL",
  original_dom_verdict: dom.dom_verdict, original_native_check_exit: native.actual_exit,
  semantic_verdict: "NOT_REVIEWED_AWAITING_FRANKLIN",
  whole_lesson_pass_declared: false,
  scope: "Existing offline HTML only: one headed Playwright capture of each of three pages at each requested viewport, six single-open pixel observations, recorded DOM and native interactions. No source mathematics, Gate2, renderer or semantic review replay.",
  input_bindings: currentInputs, evidence_bindings: provenance,
  browser: { ...dom.launches[0], app_playwright: dom.app_playwright, native_browser_exit: 0,
    headed_success: true, headless_fallback_used: false, desktop_ui_unavailability: null },
  local_only: { server: dom.local_server, HTML_external_urls: [],
    captured_requests: dom.requests, blocked_external_requests: dom.blocked_external_requests,
    limitation: "The three served HTML buffers and browser page requests were local-only. This is not an OS-level packet-capture attestation." },
  pages: pageSummaries,
  assertions: {
    total: dom.pages.reduce((total, page) => total + page.checks.length, 0),
    passed: dom.pages.reduce((total, page) => total + page.checks.filter((check) => check.status === "PASS").length, 0),
    failed: dom.pages.reduce((total, page) => total + page.checks.filter((check) => check.status === "FAIL").length, 0),
    view_coverage_per_viewport: { paragraphs: 17, writing_exercises: 2, writing_subparts: [6, 4],
      choice_questions: 10, choice_options: 38 },
    native_radio_selections: 76, choice_navigation_clicks: 2, all_page_navigation_clicks: 6,
    used_local_KaTeX_fonts_loaded: true, root_math_and_ASCII_labels_KaTeX_Main_1_1em: true,
    no_KaTeX_errors: true, zero_HTML_images: true, no_page_horizontal_overflow: true,
    default_all_math_details_visible: false,
    unexpected_fraction_scrollbars_observed: true,
    pixel_and_geometry_adjudication: visual.native_failure_adjudication
  },
  image_budget: { prior: 0, captures: 6, opens: 6, reopen: 0, crops: 0, maximum: 6 },
  findings: visual.findings, observation_limitations: visual.limitations,
  closure, native_command_exits: {
    browser_capture_check: 1, browser_process: 0,
    closure_ps_probe: processProbe.actual_exit, closure_lsof_probe: serverProbe.actual_exit,
    closeout_utility: "Recorded by closeout.native-exit.json after this utility returns. A successful artifact closeout does not change the failed visual gate."
  },
  unchanged_or_not_run: {
    existing_HTML_inputs: true, source_canonical_preview_candidate_modifications: false,
    renderer_or_choice_generator: false, source_math_replay: false, Gate2_replay: false,
    new_lesson_production: false, answer_key_injection: false, auto_grading: false,
    install: false, DB: false, Git: false, publisher: false, peer_messages: false,
    other_active_directories_read: false, other_operator_changes_reverted: false
  },
  next_action: "Return text paths and SHA-256 bindings for parent intake. This child task stops after this batch; it does not stop parent production. Keep prior frozen reports unchanged. Whole-lesson semantics still await Franklin."
};
writeJson("report.json", report);

const table = pageSummaries.map((page) =>
  `| ${page.viewport.name} ${page.page} | ${page.dom_verdict_unaltered} | ${page.visual_verdict} | ${page.assertions - page.failed_assertions.length}/${page.assertions} |`
).join("\n");
const inputs = currentInputs.map((input) => `- \`${input.name}.html\`: \`${input.sha256}\` (${input.bytes} bytes)`).join("\n");
const markdown = `# N12 Offline Visual Review

Verdict: **FAIL**. Only this six-image offline visual batch is reviewed. Prior independent mathematics, content review and answer-runtime Gate2 are unchanged and were not replayed. Choice semantics remain **NOT_REVIEWED_AWAITING_FRANKLIN**; no whole-lesson PASS is declared.

## Findings

1. **F001 / P2 / blocking:** Mobile text's long equation \`${visual.findings[0].tex}\` loses the final decimal tail in its default view. The single mobile screenshot shows the cutoff. Saved wrapper geometry is x=16, y=1524.758, width=343; clientWidth=328 versus scrollWidth=427. The actual recorded maximum internal scrollLeft is 99.5 and the far right is internally reachable, but that is not simultaneous visibility of all mathematical detail. No page-level horizontal overflow does not cure formula-level clipping.
2. **F002 / P3 / nonblocking:** Desktop and mobile writing views show short gray native scrollbar thumbs beside 113d/e/f fractions. All tokens remain readable; no glyph loss is established. This visible artifact was not caught by the horizontal DOM assertion. Vertical metrics were not captured, so its exact cause remains unproven.

No repair was applied. A later authorized fix for F001 should break the equality chain deliberately while preserving every token, integer-only bar scope and contracted font size. A later F002 investigation must not hide actual math ink.

## Six Views

| View | Original DOM | Single-open pixels | Native assertions |
| --- | --- | --- | --- |
${table}

Desktop text's six approximately 2px subscript scroll-width warnings have no established corresponding painted-glyph loss in the inspected screenshot. The original native FAIL and exit 1 are preserved, not rewritten as PASS. Odd KaTeX line-box height alone is not treated as a font/em defect.

All 17 paragraphs, both writing exercises 113/114 with 6+4 labels, and all 10 choice questions / 38 options exist per viewport. Formula roots and mathematical ASCII labels use KaTeX_Main at 1.1em; used local font faces are loaded, KaTeX errors are zero and HTML images are zero. Option letters, radios, wrapped descriptions and last/rightmost options are visible with no observed collision or clipping. Full per-option geometry and formula strings are in \`option-geometry.json\`; this is presentation indexing, not an answer review.

The browser recorded 76 order-only native label clicks with one selected radio per group after every click. All six existing navigation links were clicked successfully. Screenshots were taken after navigation reset and intentionally show an unselected view. The writing view has no answer controls; no widgets or keys were added. No grading code ran.

## Native Evidence

Headed app-installed Playwright ${dom.app_playwright.version}, Chromium ${dom.launches[0].version}, succeeded without fallback. Context viewports were exactly 1440x960 and 390x844, deviceScaleFactor=1. Tall-page full-page PNG widths are 1425/375 because of the native 15px scrollbar gutter, not substituted viewport sizes.

The actual check exit is **1**, its stdout/stderr and script SHA remain bound by \`check.native-exit.json\`. Browser shutdown exit is **0**. GPU mailbox diagnostics are retained in actual browser stderr; no page JavaScript or console errors were recorded and no blank images were observed. The six HTML page requests were loopback-only with no external source URLs; this is not an OS packet-capture claim.

Browser PID ${pid} and loopback port ${port} are closed. The final ps/lsof probes returned expected no-match exit 1 with empty stdout; full probe results are in \`closure.json\`. Artifact closeout utility exit is recorded separately and must not be substituted for the failed gate exit.

## Input SHA-256

${inputs}

Inputs were checked unchanged at capture completion and again at closeout. Screenshot bytes and dimensions were also verified without reopening any image.

## Pixel Budget

Prior opens 0; this batch captures 6, opens 6, each once; reopens/crops/additional captures 0. \`images-ledger.json\` binds each image and its observation. The original capture-phase ledger with opened=0 is preserved as historical capture state, not the final budget.

All six individual observations and inspection limitations are in \`visual-observations.json\`. Long full-page screenshots were opened once without independent magnified raster inspection; geometry supplements the visible evidence. No HTML, canonical, preview, source or candidate was changed; no generators, source mathematics, Gate2, browser replay, installation, DB, Git, publisher or peer messages were used during closeout. Only this child batch ends; parent production is unaffected. Await parent durable intake.
`;
write("report.md", markdown);
console.log(JSON.stringify({
  artifact_closeout: "COMPLETE", gate_verdict: "FAIL", check_native_exit_unchanged: 1,
  screenshot_captures: 6, image_opens: 6, browser_and_server_closed: true,
  report: bind(path.join(out, "report.json")), markdown: bind(path.join(out, "report.md")),
  semantic_verdict: report.semantic_verdict
}, null, 2));

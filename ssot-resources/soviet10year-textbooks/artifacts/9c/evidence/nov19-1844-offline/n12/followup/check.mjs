import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { createServer } from "node:http";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = "/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck";
const out = path.dirname(fileURLToPath(import.meta.url));
const evidenceRoot = path.join(root, "ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov19-1844-offline/n12");
const htmlRoot = path.join(root, ".tmp/ld-s10y-lesson/render/9c/modern-us-neutral/ana9-c3-s1-n12");
const require = createRequire(path.join(root, "app/package.json"));
const { chromium } = require("@playwright/test");
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const bind = (file) => { const bytes = readFileSync(file); return { path: file, bytes: bytes.length, sha256: hash(bytes) }; };
const readJson = (file) => JSON.parse(readFileSync(file, "utf8"));
const writeJson = (name, value) => writeFileSync(path.join(out, name), `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
const repairPath = path.join(root, ".tmp/stemrobin-184-resume/n12-layout-repair/receipt.json");
const repair = readJson(repairPath);
const first = readJson(path.join(evidenceRoot, "first/report.json"));
const diagnosis = readJson(path.join(evidenceRoot, "diagnosis/diagnosis.json"));
const chain = first.findings.find((finding) => finding.id === "F001").tex;
const expected = {
  text: "ae3ad1b4a16c4ba66df3183abd110c0b776afd1797648f5c1cb6426fd5ba0418",
  exercises: "ab8e99c2ee041f442e54a8efdb8de1eab0725c37d6bfb4db0d6cd659c9007a38",
  choices: "d8bea6d6e3a93be49cd28e1d948920be38ba4794e665c306becfa2f4c9c52182"
};
const inputs = [
  repairPath, path.join(root, ".tmp/stemrobin-184-resume/repair-n12-layout.mjs"),
  path.join(evidenceRoot, "first/report.json"), path.join(evidenceRoot, "first/dom-report.json"),
  path.join(evidenceRoot, "first/images-ledger.json"),
  path.join(evidenceRoot, "diagnosis/diagnosis.json"), path.join(evidenceRoot, "diagnosis/parent-intake.json"),
  ...Object.keys(expected).map((name) => path.join(htmlRoot, `${name}.html`)),
  path.join(evidenceRoot, "first/html/text.html"), path.join(evidenceRoot, "first/html/exercises.html")
].map(bind);
assert.equal(bind(path.join(evidenceRoot, "first/report.json")).sha256, "d20ce72cb6c2a3c92b99051d0ca32c8490497cf21344d57525d2282a0e4e2d8a");
assert.equal(bind(path.join(evidenceRoot, "diagnosis/diagnosis.json")).sha256, "b983049fd1ef804683d216c6f909df935b61d0dc95217795f40b2e86db5860d9");
assert.equal(first.original_native_check_exit, 1);
assert.equal(diagnosis.original_visual_gate_verdict, "FAIL");
assert.equal(repair.edits.text.length, 1);
assert.equal(repair.edits.exercises.length, 3);
const buffers = new Map();
const byteScope = [];
for (const name of Object.keys(expected)) {
  const file = path.join(htmlRoot, `${name}.html`);
  assert.equal(bind(file).sha256, expected[name]);
  if (name === "choices") continue;
  const original = readFileSync(path.join(evidenceRoot, "first/html", `${name}.html`), "utf8");
  const row = repair.rows.find((entry) => path.resolve(root, entry.path) === file);
  assert.equal(hash(Buffer.from(original)), row.beforeSha256);
  assert.equal(row.afterSha256, expected[name]);
  let reconstructed = original;
  for (const edit of repair.edits[name]) {
    assert.equal(reconstructed.split(edit.before).length, 2);
    reconstructed = reconstructed.replace(edit.before, edit.after);
  }
  const actual = readFileSync(file);
  assert.equal(hash(Buffer.from(reconstructed)), hash(actual));
  buffers.set(name, actual);
  byteScope.push({ name, exact_receipt_edits_only: true, changed_wrappers: repair.edits[name].length,
    before_sha256: row.beforeSha256, actual_sha256: hash(actual) });
}
const results = [];
const requests = [];
const blockedRequests = [];
let browser;
let server;
let base;
let fatal = null;
let browserClosed = false;
let serverClosed = false;
let launch = null;

function inspectAffected({ name, edits, chain }) {
  const round = (number) => Math.round(number * 1000) / 1000;
  const rect = (element) => {
    const r = element.getBoundingClientRect();
    return { x: round(r.x + scrollX), y: round(r.y + scrollY), width: round(r.width), height: round(r.height),
      right: round(r.right + scrollX), bottom: round(r.bottom + scrollY) };
  };
  const style = (element) => {
    const s = getComputedStyle(element);
    return { display: s.display, overflowX: s.overflowX, overflowY: s.overflowY,
      whiteSpace: s.whiteSpace, fontFamily: s.fontFamily, fontSize: parseFloat(s.fontSize),
      lineHeight: s.lineHeight, verticalAlign: s.verticalAlign };
  };
  const scroll = (element) => {
    const oldX = element.scrollLeft;
    const oldY = element.scrollTop;
    element.scrollLeft = 1e6;
    element.scrollTop = 1e6;
    const x = element.scrollLeft;
    const y = element.scrollTop;
    element.scrollLeft = oldX;
    element.scrollTop = oldY;
    return { clientWidth: element.clientWidth, scrollWidth: element.scrollWidth,
      clientHeight: element.clientHeight, scrollHeight: element.scrollHeight,
      maximumScrollLeft: x, maximumScrollTop: y, originalScrollLeft: oldX, originalScrollTop: oldY };
  };
  const nativeScrollbar = (element, axis) => {
    const s = style(element);
    const data = scroll(element);
    return ["auto", "scroll"].includes(axis === "x" ? s.overflowX : s.overflowY)
      && (axis === "x" ? data.maximumScrollLeft : data.maximumScrollTop) > 0.01;
  };
  const fontContext = document.createElement("canvas").getContext("2d");
  const glyphs = (element, verticalOnly = false) => {
    const ranges = [];
    const ink = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const parent = node.parentElement;
      if (!node.textContent.replace(/\u200b/g, "").trim()
        || parent.closest(".katex-mathml,.pstrut,.strut,.vlist-s,script,style")) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      const s = getComputedStyle(parent);
      fontContext.font = `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
      const m = fontContext.measureText(node.textContent);
      for (const r of range.getClientRects()) {
        if (!r.width || !r.height) continue;
        const baseline = r.y + m.fontBoundingBoxAscent + (r.height - m.fontBoundingBoxAscent - m.fontBoundingBoxDescent) / 2;
        ranges.push({ text: node.textContent, x: round(r.x + scrollX), y: round(r.y + scrollY),
          right: round(r.right + scrollX), bottom: round(r.bottom + scrollY), font: fontContext.font });
        ink.push({ text: node.textContent, x: round((verticalOnly ? r.x : r.x - m.actualBoundingBoxLeft) + scrollX),
          right: round((verticalOnly ? r.right : r.x + m.actualBoundingBoxRight) + scrollX),
          y: round(baseline - m.actualBoundingBoxAscent + scrollY),
          bottom: round(baseline + m.actualBoundingBoxDescent + scrollY) });
      }
    }
    const rules = [...element.querySelectorAll(".frac-line,.overline-line")].map((node) =>
      ({ ...rect(node), class: node.className, borderBottomWidth: parseFloat(getComputedStyle(node).borderBottomWidth) }));
    const all = [...ink, ...rules];
    return { ranges, font_outline_estimates: ink, rules,
      bounds: { left: Math.min(...all.map((r) => r.x)), right: Math.max(...all.map((r) => r.right)),
        top: Math.min(...all.map((r) => r.y)), bottom: Math.max(...all.map((r) => r.bottom)) } };
  };
  const parse = (html) => new DOMParser().parseFromString(html, "text/html").querySelector(".nb");
  const visibleText = (element) => {
    const copy = element.cloneNode(true);
    copy.querySelectorAll(".katex-mathml").forEach((node) => node.remove());
    return copy.textContent;
  };
  const body = (element) => element.closest("p.para,.body");
  const math = (element) => {
    const node = element.querySelector(".katex");
    const s = style(node);
    return { style: s, ratio: round(s.fontSize / style(body(element)).fontSize),
      local_main_loaded: document.fonts.check(`${s.fontSize}px "KaTeX_Main"`, "1181234<>"),
      annotation: node.querySelector("annotation").textContent,
      mathml: node.querySelector(".katex-mathml").outerHTML };
  };
  const checkRows = [];
  const check = (id, value, evidence = {}) => checkRows.push({ id, verdict: value ? "PASS" : "FAIL", evidence });
  let targets;
  if (name === "text") targets = [...document.querySelectorAll(".nb")]
    .filter((node) => node.querySelector("annotation")?.textContent === chain);
  else targets = [...document.querySelectorAll("#ex-113 .body .nb")]
    .filter((node) => node.querySelector(".mfrac"));
  check("exact-affected-target-count", targets.length === edits.length, { actual: targets.length, expected: edits.length });
  const measurements = targets.map((target, index) => {
    const edit = edits[index];
    const before = parse(edit.before);
    const expected = parse(edit.after);
    const m = math(target);
    const g = glyphs(target);
    const box = rect(target);
    const container = body(target);
    const column = rect(container);
    const overflowAncestors = [];
    for (let node = target; node; node = node.parentElement) {
      const s = style(node);
      if (s.overflowX !== "visible" || s.overflowY !== "visible")
        overflowAncestors.push({ tag: node.tagName, class: node.className, box: rect(node), style: s });
      if (node.matches(".sheet")) break;
    }
    check(`actual-wrapper-${index}-matches-repair-receipt`, target.outerHTML === expected.outerHTML);
    check(`annotation-mathml-${index}-preserved`, m.annotation === before.querySelector("annotation").textContent
      && m.mathml === before.querySelector(".katex-mathml").outerHTML);
    check(`visible-tokens-${index}-preserved`, visibleText(target) === visibleText(before));
    check(`font-${index}-main-1.1em-loaded`, m.style.fontFamily.includes("KaTeX_Main")
      && m.ratio === 1.1 && m.local_main_loaded);
    const measurement = { index, tex: m.annotation, box, style: style(target), scroll: scroll(target),
      math: m, column, glyphs: g, overflowAncestors };
    if (name === "text") {
      const lines = [...target.querySelector(".katex-html").children];
      measurement.lines = lines.map((line) => ({ box: rect(line), style: style(line), scroll: scroll(line),
        text: line.textContent, glyphs: glyphs(line) }));
      check("exact-two-deliberate-lines", lines.length === 2
        && lines.every((line) => line.matches(".equation-line") && style(line).display === "block"));
      check("second-line-begins-second-equality", lines.length === 2
        && lines[0].querySelectorAll(".mrel").length === 1 && lines[1].textContent.trim().startsWith("=")
        && target.querySelectorAll(".mrel").length === 3);
      check("each-line-fits-actual-column", measurement.lines.every((line) =>
        line.scroll.scrollWidth <= line.scroll.clientWidth + 1
        && line.box.x >= column.x - 1 && line.box.right <= column.right + 1));
      check("each-line-horizontal-ink-visible", measurement.lines.every((line) =>
        line.glyphs.bounds.left >= column.x - 1 && line.glyphs.bounds.right <= column.right + 1
        && line.glyphs.bounds.left >= line.box.x - 1 && line.glyphs.bounds.right <= line.box.right + 1));
      check("no-hidden-horizontal-formula-ancestor", overflowAncestors.every((entry) =>
        entry.style.overflowX === "visible") && scroll(target).maximumScrollLeft === 0);
      check("formula-wrapper-visible-overflow", style(target).overflowX === "visible"
        && style(target).overflowY === "visible" && style(target).whiteSpace === "normal");
      measurement.bars = [...target.querySelectorAll(".katex-html .overline")].map((bar) => {
        const rule = bar.querySelector(".overline-line");
        return { payload: bar.textContent.replace(/\u200b/g, "").trim(), box: rect(bar),
          rule: rect(rule), rule_width: parseFloat(getComputedStyle(rule).borderBottomWidth) };
      });
      check("bar-118-integer-only-scope", measurement.bars.length === 1
        && measurement.bars[0].payload === "118"
        && Math.abs(measurement.bars[0].rule.width - measurement.bars[0].box.width) < 1
        && measurement.bars[0].rule_width > 0);
      check("two-line-vertical-ink-no-new-overlap", measurement.lines.length === 2
        && measurement.lines[0].glyphs.bounds.bottom <= measurement.lines[1].glyphs.bounds.top + 1,
      measurement.lines.map((line) => line.glyphs.bounds));
    } else {
      let label = target.previousElementSibling;
      while (label && !label.matches(".prose-math")) label = label.previousElementSibling;
      measurement.identity = { exercise: target.closest("li.ex").id, subpart: label?.textContent };
      measurement.ink_margins = { left: g.bounds.left - box.x, right: box.right - g.bounds.right,
        top: g.bounds.top - box.y, bottom: box.bottom - g.bounds.bottom };
      measurement.parent_scroll = scroll(container);
      measurement.parent_style = style(container);
      measurement.wrapper_gutter_estimate = Math.max(0, box.width - target.clientWidth);
      check(`fraction-${index}-innerHTML-unchanged`, target.innerHTML === before.innerHTML);
      check(`fraction-${index}-glyph-and-rule-margins`, Object.values(measurement.ink_margins).every((margin) => margin >= -0.05)
        && measurement.ink_margins.bottom > 3
        && g.rules.length === 1 && g.rules[0].borderBottomWidth > 0, measurement.ink_margins);
      check(`fraction-${index}-no-UI-vertical-gutter`, style(target).overflowY === "hidden"
        && !nativeScrollbar(target, "y") && measurement.wrapper_gutter_estimate < 1);
      check(`fraction-${index}-no-horizontal-scroll-or-parent-gutter`, !nativeScrollbar(target, "x")
        && !nativeScrollbar(container, "x") && !nativeScrollbar(container, "y"));
      check(`fraction-${index}-label-font-unchanged`, label && style(label).fontFamily.includes("KaTeX_Main")
        && Math.abs(style(label).fontSize / style(container).fontSize - 1.1) < 0.01);
    }
    return measurement;
  });
  const block = name === "text" ? targets[0]?.closest("p.para") : document.querySelector("#ex-113");
  const previous = block?.previousElementSibling ?? block?.parentElement.previousElementSibling;
  const next = block?.nextElementSibling;
  const adjacent = [previous, block, next].map((element, index) => element ? {
    role: ["previous", "affected", "next"][index], tag: element.tagName, class: element.className,
    id: element.id, box: rect(element), glyphs: glyphs(element, true)
  } : null);
  check("adjacent-block-targets-present", adjacent.every(Boolean));
  if (adjacent.every(Boolean)) {
    check("adjacent-block-boxes-no-new-collision", adjacent[0].box.bottom <= adjacent[1].box.y + 1
      && adjacent[1].box.bottom <= adjacent[2].box.y + 1, adjacent.map((entry) => entry.box));
    check("adjacent-block-font-ink-vertical-clearance", adjacent[0].glyphs.bounds.bottom <= adjacent[1].glyphs.bounds.top + 1
      && adjacent[1].glyphs.bounds.bottom <= adjacent[2].glyphs.bounds.top + 1,
    adjacent.map((entry) => entry.glyphs.bounds));
  }
  if (name === "exercises") check("fraction-target-identities-d-e-f", JSON.stringify(measurements.map((entry) => entry.identity))
    === JSON.stringify(["d", "e", "f"].map((subpart) => ({ exercise: "ex-113", subpart }))));
  return { target_count: targets.length, measurements, adjacent, checks: checkRows,
    scoped_actual_verdict: checkRows.every((entry) => entry.verdict === "PASS") ? "PASS" : "FAIL",
    limitations: "Font-outline TextMetrics and CSS rule/range geometry only, with an estimated baseline and 1px line-box tolerance. Adjacent multiline prose uses range widths and font-outline vertical estimates. No raster drawing, screenshot, pixel opening or fresh painted-pixel proof." };
}

async function checkPage(context, viewport, name) {
  const page = await context.newPage();
  const result = { name, viewport, console_errors: [], page_errors: [] };
  page.on("console", (message) => { if (message.type() === "error") result.console_errors.push(message.text()); });
  page.on("pageerror", (error) => result.page_errors.push(String(error)));
  try {
    const response = await page.goto(`${base}/${name}.html`, { waitUntil: "load" });
    assert.equal(response.status(), 200);
    await page.evaluate(async () => { await document.fonts.ready; });
    const before = await page.locator(".sheet").evaluate((element) => element.outerHTML);
    Object.assign(result, await page.evaluate(inspectAffected, { name, edits: repair.edits[name], chain }));
    result.loaded_DOM_unchanged_by_followup = before === await page.locator(".sheet").evaluate((element) => element.outerHTML);
    if (!result.loaded_DOM_unchanged_by_followup || result.page_errors.length || result.console_errors.length)
      result.scoped_actual_verdict = "FAIL";
  } catch (error) {
    result.error = String(error.stack ?? error);
    result.scoped_actual_verdict = "FAIL";
  } finally {
    await page.close();
    result.page_closed = true;
    results.push(result);
    console.log(JSON.stringify({ viewport, name, scoped_actual_verdict: result.scoped_actual_verdict,
      failed_checks: result.checks?.filter((entry) => entry.verdict === "FAIL"), error: result.error ?? null,
      line_widths: result.measurements?.flatMap((entry) => entry.lines?.map((line) => line.box.width) ?? []),
      fraction_margins: result.measurements?.filter((entry) => entry.ink_margins).map((entry) => entry.ink_margins) }));
  }
}

try {
  server = createServer((request, response) => {
    const url = new URL(request.url, "http://127.0.0.1");
    const name = ["text", "exercises"].find((name) => url.pathname === `/${name}.html`);
    requests.push({ method: request.method, path: url.pathname, local_only: true });
    response.writeHead(name ? 200 : url.pathname === "/favicon.ico" ? 204 : 404,
      { "Content-Type": "text/html; charset=utf-8" });
    response.end(name ? buffers.get(name) : "");
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ headless: false, args: ["--disable-background-networking", "--disable-component-update",
    "--disable-sync", "--no-first-run"] });
  launch = { headless: false, status: "SUCCESS", version: browser.version(), executable: chromium.executablePath() };
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1, serviceWorkers: "block" });
    await context.route("**/*", async (route) => {
      if (route.request().url().startsWith(`${base}/`)) await route.continue();
      else { blockedRequests.push(route.request().url()); await route.abort(); }
    });
    for (const name of ["text", "exercises"]) await checkPage(context, viewport, name);
    await context.close();
  }
} catch (error) {
  fatal = String(error.stack ?? error);
} finally {
  if (browser) { await browser.close(); browserClosed = true; }
  if (server) { await new Promise((resolve) => server.close(resolve)); serverClosed = true; }
  const unchanged = inputs.every((entry) => bind(entry.path).sha256 === entry.sha256);
  const verdict = !fatal && unchanged && results.length === 4 && results.every((entry) => entry.scoped_actual_verdict === "PASS") ? "PASS" : "FAIL";
  writeJson("actual-measurements.json", {
    schema: "stemrobin-184B/n12-actual-layout-followup@1", lesson: "ana9-c3-s1-n12",
    scoped_actual_verdict: verdict, native_exit: fatal ? 2 : verdict === "PASS" ? 0 : 1,
    scope: "Actual repaired F001/F002 only, two unchanged-on-disk served HTML pages at two viewports plus immediately adjacent blocks. No clones, new screenshots, whole-browser/control/choice/math/Gate2 or renderer replay.",
    inputBindings: inputs, byte_scope: byteScope, choices_hash_only_unchanged: expected.choices,
    launch, app_playwright: { module: require.resolve("@playwright/test"), version: require("@playwright/test/package.json").version },
    results, requests, blocked_external_requests: blockedRequests, fatal,
    browser_closed: browserClosed, local_server: { base, closed: serverClosed }, inputs_unchanged_during_followup: unchanged,
    previous_reviews: { first_visual_verdict_preserved: "FAIL", first_check_native_exit_preserved: 1,
      first_2px_subscript_flags: "Preserved unconfirmed native geometry advisories; not remeasured or reclassified.",
      other_layout_and_control_PASS: "Reused only where the receipt proves other HTML bytes unchanged; no full replay.",
      semantic_final: "Human reports retained Franklin semantic PASS; this followup does not inspect or re-review semantics.",
      Gate2_source_math: "Prior frozen results preserved and not replayed." },
    images: { before_opens: 6, new_opens: 0, captures: 0, crops: 0, reopens: 0,
      raster_draw_calls: 0, after_opens: 6, maximum: 6 },
    fresh_pixel_proof: false, whole_lesson_PASS_declared: false, original_files_modified_by_this_followup: false
  });
  process.exitCode = fatal ? 2 : verdict === "PASS" ? 0 : 1;
}

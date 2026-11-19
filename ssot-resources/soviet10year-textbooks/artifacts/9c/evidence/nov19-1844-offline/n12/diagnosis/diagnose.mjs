import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { createServer } from "node:http";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = "/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck";
const out = path.dirname(fileURLToPath(import.meta.url));
const prior = path.join(root, "ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov19-1844-offline/n12/first");
const require = createRequire(path.join(root, "app/package.json"));
const { chromium } = require("@playwright/test");
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const bind = (file) => { const bytes = readFileSync(file); return { path: file, bytes: bytes.length, sha256: hash(bytes) }; };
const write = (name, value) => writeFileSync(path.join(out, name), value, { flag: "wx" });
const writeJson = (name, value) => write(name, `${JSON.stringify(value, null, 2)}\n`);
const intake = JSON.parse(readFileSync(path.join(prior, "parent-intake.json"), "utf8"));
const priorReport = JSON.parse(readFileSync(path.join(prior, "report.json"), "utf8"));
const priorDom = JSON.parse(readFileSync(path.join(prior, "dom-report.json"), "utf8"));
const inputBindings = ["parent-intake.json", "report.json", "dom-report.json", "images-ledger.json", "visual-observations.json",
  "html/text.html", "html/exercises.html"].map((name) => {
  const entry = bind(path.join(prior, name));
  if (name !== "parent-intake.json") {
    const expected = intake.rows.find((row) => path.join(root, row.path) === entry.path);
    assert.ok(expected, `Missing durable binding: ${name}`);
    assert.equal(entry.sha256, expected.sha256);
    assert.equal(entry.bytes, expected.bytes);
  }
  return entry;
});
const buffers = new Map(["text", "exercises"].map((name) => [name, readFileSync(path.join(prior, "html", `${name}.html`))]));
const chain = priorReport.findings.find((finding) => finding.id === "F001").tex;
const requests = [];
const blockedRequests = [];
const measurements = [];
const launch = { headless: false, status: "NOT_LAUNCHED" };
let browser;
let server;
let base;
let fatal = null;
let browserClosed = false;
let serverClosed = false;
let nativeExit = 0;

function measureTarget(wrapper) {
  const round = (number) => Math.round(number * 1000) / 1000;
  const rect = (element) => {
    const box = element.getBoundingClientRect();
    return { x: round(box.x), y: round(box.y), width: round(box.width), height: round(box.height),
      right: round(box.right), bottom: round(box.bottom) };
  };
  const style = (element) => {
    const s = getComputedStyle(element);
    return Object.fromEntries(["display", "position", "overflowX", "overflowY", "whiteSpace", "fontFamily", "fontSize",
      "fontStyle", "fontWeight", "lineHeight", "verticalAlign", "height", "maxHeight", "width",
      "paddingTop", "paddingBottom", "borderTopWidth", "borderBottomWidth", "scrollbarWidth", "boxSizing"]
      .map((key) => [key, s[key]]));
  };
  const scroll = (element) => {
    const oldX = element.scrollLeft;
    const oldY = element.scrollTop;
    element.scrollLeft = 1e6;
    element.scrollTop = 1e6;
    const maximumX = element.scrollLeft;
    const maximumY = element.scrollTop;
    element.scrollLeft = oldX;
    element.scrollTop = oldY;
    return { clientWidth: element.clientWidth, scrollWidth: element.scrollWidth,
      clientHeight: element.clientHeight, scrollHeight: element.scrollHeight,
      initialScrollLeft: oldX, initialScrollTop: oldY, maximumScrollLeft: maximumX, maximumScrollTop: maximumY };
  };
  const rootMath = wrapper.querySelector(".katex");
  const html = rootMath.querySelector(".katex-html");
  const body = wrapper.closest(".body,p.para");
  const box = rect(wrapper);
  const context = document.createElement("canvas").getContext("2d");
  const textRanges = [];
  const estimatedInk = [];
  const walker = document.createTreeWalker(wrapper, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const parent = node.parentElement;
    if (!node.textContent.replace(/\u200b/g, "").trim() || parent.closest(".katex-mathml,.pstrut,.strut,.vlist-s")) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    const s = getComputedStyle(parent);
    context.font = `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
    const m = context.measureText(node.textContent);
    for (const r of range.getClientRects()) {
      if (!r.width || !r.height) continue;
      const baseline = r.y + m.fontBoundingBoxAscent
        + (r.height - m.fontBoundingBoxAscent - m.fontBoundingBoxDescent) / 2;
      textRanges.push({ text: node.textContent, class: parent.className,
        x: round(r.x), y: round(r.y), right: round(r.right), bottom: round(r.bottom),
        width: round(r.width), height: round(r.height), font: context.font });
      estimatedInk.push({ text: node.textContent, x: round(r.x - m.actualBoundingBoxLeft),
        y: round(baseline - m.actualBoundingBoxAscent), right: round(r.x + m.actualBoundingBoxRight),
        bottom: round(baseline + m.actualBoundingBoxDescent), baseline_estimate: round(baseline),
        textMetrics: { ascent: round(m.actualBoundingBoxAscent), descent: round(m.actualBoundingBoxDescent),
          fontAscent: round(m.fontBoundingBoxAscent), fontDescent: round(m.fontBoundingBoxDescent) } });
    }
  }
  const rules = [...html.querySelectorAll(".frac-line,.overline-line")].map((element) => ({
    class: element.className, ...rect(element), borderBottom: getComputedStyle(element).borderBottomWidth
  }));
  const allInk = [...estimatedInk, ...rules];
  const inkBounds = { left: Math.min(...allInk.map((r) => r.x)), top: Math.min(...allInk.map((r) => r.y)),
    right: Math.max(...allInk.map((r) => r.right)), bottom: Math.max(...allInk.map((r) => r.bottom)) };
  const descendants = [...html.querySelectorAll("*")].map((element) => ({
    class: element.className, text: element.textContent.replace(/\u200b/g, "").trim().slice(0, 30),
    box: rect(element), style: style(element)
  })).filter((entry) => entry.box.bottom > box.bottom + 1 || entry.box.y < box.y - 1
    || entry.box.right > box.right + 1 || entry.box.x < box.x - 1);
  const scrollData = scroll(wrapper);
  const bars = [...html.querySelectorAll(".overline")].map((element) => ({
    payload: element.textContent.replace(/\u200b/g, "").trim(), box: rect(element),
    rule: rect(element.querySelector(".overline-line"))
  }));
  const visibleCopy = wrapper.cloneNode(true);
  visibleCopy.querySelectorAll(".katex-mathml").forEach((element) => element.remove());
  return {
    tex: rootMath.querySelector("annotation").textContent, box, style: style(wrapper), scroll: scrollData,
    math: { style: style(rootMath), box: rect(rootMath), ratio: round(parseFloat(getComputedStyle(rootMath).fontSize)
      / parseFloat(getComputedStyle(body).fontSize)) },
    body: { box: rect(body), style: style(body), scroll: scroll(body) },
    rendered_token_text: html.textContent.replace(/\u200b/g, "").replace(/\s/g, ""),
    rendered_wrapper_text: visibleCopy.textContent.replace(/\u200b/g, "").replace(/\s/g, ""),
    textRanges, estimatedInk, inkBounds, paintedRules: rules, overflowDescendants: descendants, bars,
    estimated_ink_within_wrapper: inkBounds.left >= box.x - 1 && inkBounds.right <= box.right + 1
      && inkBounds.top >= box.y - 1 && inkBounds.bottom <= box.bottom + 1,
    metrics_limit: "Range rectangles are text line boxes. Ink bounds use font outline TextMetrics plus an estimated baseline, and CSS fraction/overline rule rectangles. No canvas drawing, raster capture, screenshot or pixel inspection occurred.",
    vertical_auto_scrollbar_eligible: ["auto", "scroll"].includes(getComputedStyle(wrapper).overflowY)
      && scrollData.scrollHeight > scrollData.clientHeight + 1,
    horizontal_auto_scrollbar_eligible: ["auto", "scroll"].includes(getComputedStyle(wrapper).overflowX)
      && scrollData.scrollWidth > scrollData.clientWidth + 1
  };
}

async function makeClone(page, kind) {
  const handle = await page.evaluateHandle(async ({ kind, chain }) => {
    const target = kind === "fractions" ? document.querySelector("#ex-113") :
      [...document.querySelectorAll(".nb")].find((node) => node.querySelector("annotation")?.textContent === chain).closest("p.para");
    const content = kind === "fractions" ? `<ol class="ex">${target.outerHTML}</ol>` : target.outerHTML;
    const iframe = document.createElement("iframe");
    iframe.style.cssText = `position:fixed;left:0;top:0;width:${innerWidth}px;height:${innerHeight}px;border:0;z-index:2147483647`;
    const loaded = new Promise((resolve) => iframe.addEventListener("load", resolve, { once: true }));
    iframe.srcdoc = `<!doctype html><html><head><meta charset="utf-8">${[...document.querySelectorAll("style")].map((node) => node.outerHTML).join("")}</head><body style="width:${document.documentElement.clientWidth}px"><div class="sheet">${content}</div></body></html>`;
    document.body.append(iframe);
    await loaded;
    await iframe.contentDocument.fonts.ready;
    return iframe;
  }, { kind, chain });
  const element = handle.asElement();
  return { element, frame: await element.contentFrame() };
}

async function measure(frame, kind) {
  await frame.evaluate(measureTarget.toString().startsWith("function") ? `window.measureDiagnostic = ${measureTarget.toString()}` : "");
  return frame.evaluate(({ kind, chain }) => {
    const targets = kind === "fractions" ? [...document.querySelectorAll("#ex-113 .body .nb")]
      .filter((node) => node.querySelector("annotation")?.textContent.includes("\\frac")) :
      [[...document.querySelectorAll(".nb")].find((node) => node.querySelector("annotation")?.textContent === chain)];
    return targets.map((target) => window.measureDiagnostic(target));
  }, { kind, chain });
}

async function diagnoseFractions(viewport) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, serviceWorkers: "block" });
  await context.route("**/*", async (route) => {
    if (route.request().url().startsWith(`${base}/`)) await route.continue();
    else { blockedRequests.push(route.request().url()); await route.abort(); }
  });
  const page = await context.newPage();
  const result = { kind: "F002", viewport, page_errors: [], console_errors: [], variants: [] };
  page.on("pageerror", (error) => result.page_errors.push(String(error)));
  page.on("console", (message) => { if (message.type() === "error") result.console_errors.push(message.text()); });
  try {
    assert.equal((await page.goto(`${base}/exercises.html`)).status(), 200);
    await page.evaluate(async () => { await document.fonts.ready; });
    const originalMarkup = await page.locator("#ex-113").evaluate((node) => node.outerHTML);
    result.original = await measure(page.mainFrame(), "fractions");
    assert.equal(result.original.length, 3);
    result.target_identity = await page.locator("#ex-113 .body .nb").evaluateAll((nodes) => nodes
      .filter((node) => node.querySelector("annotation")?.textContent.includes("\\frac")).map((node) => {
        let sibling = node.previousElementSibling;
        while (sibling && !sibling.matches(".prose-math")) sibling = sibling.previousElementSibling;
        return { exercise: node.closest("li.ex").id, subpart: sibling.textContent,
          tex: node.querySelector("annotation").textContent };
      }));
    assert.deepEqual(result.target_identity.map((target) => target.subpart), ["d", "e", "f"]);
    for (const variant of [
      { name: "unchanged-isolated-clone", property: null, value: null },
      { name: "overflow-x-visible", property: "overflowX", value: "visible" },
      { name: "overflow-y-hidden", property: "overflowY", value: "hidden" }
    ]) {
      const clone = await makeClone(page, "fractions");
      if (variant.property) await clone.frame.evaluate(({ property, value }) => {
        for (const node of document.querySelectorAll("#ex-113 .body .nb")) {
          if (node.querySelector("annotation")?.textContent.includes("\\frac")) node.style[property] = value;
        }
      }, variant);
      const after = await measure(clone.frame, "fractions");
      const invariant = after.every((entry, index) => entry.tex === result.original[index].tex
        && entry.rendered_token_text === result.original[index].rendered_token_text
        && entry.rendered_wrapper_text === result.original[index].rendered_wrapper_text
        && entry.math.ratio === 1.1 && entry.math.style.fontFamily.includes("KaTeX_Main"));
      const noScrollbars = after.every((entry) => !entry.vertical_auto_scrollbar_eligible && !entry.horizontal_auto_scrollbar_eligible
        && !(["auto", "scroll"].includes(entry.body.style.overflowY)
          && entry.body.scroll.scrollHeight > entry.body.scroll.clientHeight + 1));
      result.variants.push({ ...variant, measurements: after, tokens_and_font_unchanged: invariant,
        no_wrapper_or_parent_scrollbar_eligible: noScrollbars,
        estimated_ink_contained: after.every((entry) => entry.estimated_ink_within_wrapper),
        hypothesis_metric_verdict: invariant && noScrollbars && after.every((entry) => entry.estimated_ink_within_wrapper) ? "PASS" : "FAIL" });
      await clone.element.evaluate((element) => element.remove());
      await clone.element.dispose();
    }
    result.clone_baseline_matches_original = result.variants[0].measurements.every((entry, index) => {
      const original = result.original[index];
      return Math.abs(entry.box.width - original.box.width) < 1 && Math.abs(entry.box.height - original.box.height) < 1
        && JSON.stringify(entry.scroll) === JSON.stringify(original.scroll)
        && entry.rendered_wrapper_text === original.rendered_wrapper_text;
    });
    assert.equal(result.clone_baseline_matches_original, true);
    assert.equal(await page.locator("#ex-113").evaluate((node) => node.outerHTML), originalMarkup);
    result.original_target_DOM_unchanged = true;
    measurements.push(result);
    console.log(JSON.stringify({ target: "F002", viewport, before: result.original.map((entry) => entry.scroll),
      variants: result.variants.map((variant) => ({ name: variant.name, verdict: variant.hypothesis_metric_verdict })) }));
  } finally { await context.close(); }
}

async function diagnoseChain() {
  const viewport = { width: 390, height: 844 };
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, serviceWorkers: "block" });
  await context.route("**/*", async (route) => {
    if (route.request().url().startsWith(`${base}/`)) await route.continue();
    else { blockedRequests.push(route.request().url()); await route.abort(); }
  });
  const page = await context.newPage();
  const result = { kind: "F001", viewport, page_errors: [], console_errors: [],
    prior_observations_reused: priorReport.findings.find((finding) => finding.id === "F001") };
  page.on("pageerror", (error) => result.page_errors.push(String(error)));
  page.on("console", (message) => { if (message.type() === "error") result.console_errors.push(message.text()); });
  try {
    assert.equal((await page.goto(`${base}/text.html`)).status(), 200);
    await page.evaluate(async () => { await document.fonts.ready; });
    const originalMarkup = await page.evaluate((chain) => [...document.querySelectorAll(".nb")]
      .find((node) => node.querySelector("annotation")?.textContent === chain).outerHTML, chain);
    result.original_targeted_metrics = (await measure(page.mainFrame(), "chain"))[0];
    const clone = await makeClone(page, "chain");
    result.clone_before = (await measure(clone.frame, "chain"))[0];
    result.deliberate_break = await clone.frame.evaluate((chain) => {
      const wrapper = [...document.querySelectorAll(".nb")].find((node) => node.querySelector("annotation")?.textContent === chain);
      const html = wrapper.querySelector(".katex-html");
      const equalityNodes = [...html.querySelectorAll(".mrel")].filter((node) => node.textContent === "=");
      if (equalityNodes.length !== chain.split("=").length - 1 || equalityNodes.length !== 3)
        throw new Error("Rendered equality boundaries do not match this bound source annotation");
      const originalText = html.textContent.replace(/\u200b/g, "").replace(/\s/g, "");
      const range = document.createRange();
      range.setStartBefore(equalityNodes[1]);
      range.setEnd(html, html.childNodes.length);
      const second = range.extractContents();
      const firstLine = document.createElement("span");
      const secondLine = document.createElement("span");
      for (const line of [firstLine, secondLine]) {
        line.className = "diagnostic-equation-line";
        line.style.display = "block";
        line.style.whiteSpace = "nowrap";
      }
      firstLine.append(...html.childNodes);
      secondLine.append(second);
      html.append(firstLine, secondLine);
      wrapper.style.overflow = "visible";
      wrapper.style.whiteSpace = "normal";
      const terms = chain.split("=");
      return {
        boundary: "Before the second equality sign; two intentional lines, continuation begins with =",
        source_tex: chain, proposed_tex_lines: [terms.slice(0, 2).join("="), `=${terms.slice(2).join("=")}`],
        reconstructed_tex: terms.slice(0, 2).join("=") + `=${terms.slice(2).join("=")}`,
        original_rendered_tokens: originalText,
        after_rendered_tokens: html.textContent.replace(/\u200b/g, "").replace(/\s/g, ""),
        MathML_and_annotation_unchanged: wrapper.querySelector("annotation").textContent === chain,
        no_KaTeX_renderer_invoked: true,
        clone_only_styles: { wrapper: { overflow: "visible", whiteSpace: "normal" },
          line: { display: "block", whiteSpace: "nowrap" } }
      };
    }, chain);
    result.clone_after = (await measure(clone.frame, "chain"))[0];
    result.line_boxes = await clone.frame.locator(".diagnostic-equation-line").evaluateAll((lines) => lines.map((line) => {
      const box = line.getBoundingClientRect();
      return { x: box.x, y: box.y, width: box.width, height: box.height,
        scrollWidth: line.scrollWidth, clientWidth: line.clientWidth, text: line.textContent.replace(/\u200b/g, "").trim() };
    }));
    result.token_font_bar_invariants = result.deliberate_break.reconstructed_tex === chain
      && result.deliberate_break.original_rendered_tokens === result.deliberate_break.after_rendered_tokens
      && result.clone_after.math.ratio === 1.1 && result.clone_after.math.style.fontFamily.includes("KaTeX_Main")
      && JSON.stringify(result.clone_before.bars.map((bar) => bar.payload)) === JSON.stringify(result.clone_after.bars.map((bar) => bar.payload))
      && result.clone_after.bars.every((bar) => bar.payload === "118" && Math.abs(bar.rule.width - bar.box.width) < 1);
    result.hypothesis_metric_verdict = result.token_font_bar_invariants
      && result.line_boxes.every((line) => line.scrollWidth <= line.clientWidth + 1)
      && result.clone_after.estimated_ink_within_wrapper ? "PASS" : "FAIL";
    await clone.element.evaluate((element) => element.remove());
    await clone.element.dispose();
    assert.equal(await page.evaluate((chain) => [...document.querySelectorAll(".nb")]
      .find((node) => node.querySelector("annotation")?.textContent === chain).outerHTML, chain), originalMarkup);
    result.original_target_DOM_unchanged = true;
    measurements.push(result);
    console.log(JSON.stringify({ target: "F001", clone_before: result.clone_before.scroll,
      clone_after: result.clone_after.scroll, lines: result.line_boxes, hypothesis_metric_verdict: result.hypothesis_metric_verdict }));
  } finally { await context.close(); }
}

try {
  server = createServer((request, response) => {
    const url = new URL(request.url, "http://127.0.0.1");
    const name = ["text", "exercises"].find((name) => url.pathname === `/${name}.html`);
    requests.push({ method: request.method, path: url.pathname, local_only: true });
    response.writeHead(name ? 200 : url.pathname === "/favicon.ico" ? 204 : 404, { "Content-Type": "text/html; charset=utf-8" });
    response.end(name ? buffers.get(name) : "");
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ headless: false, args: ["--disable-background-networking", "--disable-component-update", "--disable-sync", "--no-first-run"] });
  Object.assign(launch, { status: "SUCCESS", version: browser.version(), executable: chromium.executablePath() });
  await diagnoseFractions({ width: 1440, height: 960 });
  await diagnoseFractions({ width: 390, height: 844 });
  await diagnoseChain();
} catch (error) {
  fatal = String(error.stack ?? error);
  nativeExit = 2;
} finally {
  if (browser) { await browser.close(); browserClosed = true; }
  if (server) { await new Promise((resolve) => server.close(resolve)); serverClosed = true; }
  const unchanged = inputBindings.every((entry) => bind(entry.path).sha256 === entry.sha256);
  if (!unchanged || measurements.length !== 3 || blockedRequests.length) nativeExit = nativeExit || 1;
  writeJson("measurements.json", { schema: "stemrobin-184B/n12-targeted-layout-diagnosis@1",
    lesson: "ana9-c3-s1-n12", inputBindings, prior_first_visual_verdict: "FAIL", prior_native_exit: 1,
    scope: "F001 bound long formula and F002 113d/e/f only. One headed browser launch; unchanged original buffers, isolated in-memory iframe clones. No full lesson/Gate2/math/choice review or rendering replay.",
    launch, app_playwright: { module: require.resolve("@playwright/test"), version: require("@playwright/test/package.json").version },
    measurements, requests, blockedRequests, local_server: { base, closed: serverClosed },
    browser_closed: browserClosed, input_files_unchanged: unchanged, fatal, native_exit: nativeExit,
    images: { prior_opens: 6, maximum: 6, new_screenshots: 0, new_opens: 0, crops: 0, raster_draw_calls: 0, cumulative_opens: 6 },
    semantic_review: "NOT_REVIEWED_AWAITING_FRANKLIN", formal_visual_gate_replay: false,
    original_files_modified: false, hypothetical_clones_persisted_as_HTML: false,
    reused_prior_mobile_DOM_chain: priorDom.pages.find((page) => page.name === "text" && page.viewport.name === "mobile").final_dom
      .overflow.find((entry) => entry.tex.includes(chain)),
    limitations: ["No new pixels were viewed; passing hypothesis metrics do not constitute repaired visual acceptance.",
      "Font-outline ink bounds estimate the baseline from text range/font metrics; they are not measured painted pixels.",
      "Clone documents contain the affected paragraph or exercise 113 only, with original CSS and content-column width. Adjacent full-lesson layout and broader generator behavior are untested."]
  });
  process.exitCode = nativeExit;
}

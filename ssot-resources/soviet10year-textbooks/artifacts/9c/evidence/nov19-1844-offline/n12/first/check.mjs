import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { createServer } from "node:http";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = "/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck";
const out = path.dirname(fileURLToPath(import.meta.url));
const htmlRoot = ".tmp/ld-s10y-lesson/render/9c/modern-us-neutral/ana9-c3-s1-n12";
const require = createRequire(path.join(root, "app/package.json"));
const { chromium } = require("@playwright/test");
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const write = (name, data) => writeFileSync(path.join(out, name), `${JSON.stringify(data, null, 2)}\n`, { flag: "wx" });
const names = ["text", "exercises", "choices"];
const inputBindings = names.map((name) => {
  const file = path.join(root, htmlRoot, `${name}.html`);
  const bytes = readFileSync(file);
  return { name, path: file, bytes: bytes.length, sha256: sha256(bytes),
    external_source_urls: [...bytes.toString().matchAll(/(?:src|href)="(https?:[^"]*)"/g)].map((match) => match[1]),
    embedded_font_faces: (bytes.toString().match(/@font-face/g) ?? []).length };
});
const buffers = new Map(inputBindings.map((input) => [input.name, readFileSync(input.path)]));
const requests = [];
const launches = [];
const blockedRequests = [];
const pages = [];
const screenshots = [];
let browser = null;
let server = null;
let serverClosed = false;
let browserClosed = false;
let fatal = null;
let base;
const viewports = [
  { name: "desktop", width: 1440, height: 960 },
  { name: "mobile", width: 390, height: 844 },
];

function inspectDom() {
  const round = (value) => Math.round(value * 1000) / 1000;
  const rect = (element) => {
    const box = element.getBoundingClientRect();
    return { x: round(box.x + scrollX), y: round(box.y + scrollY), width: round(box.width),
      height: round(box.height), right: round(box.right + scrollX), bottom: round(box.bottom + scrollY) };
  };
  const visible = (element) => {
    const style = getComputedStyle(element);
    const box = element.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && box.width > 0 && box.height > 0;
  };
  const visibleText = (element) => {
    const copy = element.cloneNode(true);
    copy.querySelectorAll(".katex-mathml,script,style").forEach((node) => node.remove());
    return copy.textContent.replace(/\u200b/g, "").trim();
  };
  const overlap = (a, b) => Math.min(a.right, b.right) - Math.max(a.x, b.x) > 1
    && Math.min(a.bottom, b.bottom) - Math.max(a.y, b.y) > 1;
  const formulas = [...document.querySelectorAll(".katex")].map((element, index) => {
    const style = getComputedStyle(element);
    const body = element.closest(".para,.body") ?? element.closest("li.ex")?.querySelector(".body") ?? document.body;
    const bodyStyle = getComputedStyle(body);
    return { index, tex: element.querySelector("annotation")?.textContent ?? null, box: rect(element),
      visible: visible(element), font: style.fontFamily, size_px: parseFloat(style.fontSize),
      body_size_px: parseFloat(bodyStyle.fontSize),
      ratio: round(parseFloat(style.fontSize) / parseFloat(bodyStyle.fontSize)) };
  });
  const ascii = [...document.querySelectorAll(".prose-math,.sr-prose-math,.option-letter,.no")].map((element) => {
    const anchor = element.closest(".para,.body") ?? element.closest("li.ex")?.querySelector(".body") ?? document.body;
    const style = getComputedStyle(element);
    return { text: visibleText(element), class: element.className, box: rect(element), font: style.fontFamily,
      size_px: parseFloat(style.fontSize), ratio: round(parseFloat(style.fontSize) / parseFloat(getComputedStyle(anchor).fontSize)) };
  });
  const bars = [...document.querySelectorAll(".katex-html .overline")].map((element) => {
    const rule = element.querySelector(".overline-line");
    const texts = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) if (walker.currentNode.textContent.trim()) {
      const range = document.createRange();
      range.selectNodeContents(walker.currentNode);
      for (const box of range.getClientRects()) if (box.width && box.height) texts.push({
        text: walker.currentNode.textContent, x: box.x, right: box.right, y: box.y, bottom: box.bottom,
      });
    }
    const glyphLeft = texts.length ? Math.min(...texts.map((box) => box.x)) : null;
    const glyphRight = texts.length ? Math.max(...texts.map((box) => box.right)) : null;
    const ruleBox = rule?.getBoundingClientRect();
    return {
      formula: element.closest(".katex").querySelector("annotation")?.textContent,
      payload_display: visibleText(element), box: rect(element),
      rule: rule ? rect(rule) : null,
      rule_border_px: rule ? parseFloat(getComputedStyle(rule).borderBottomWidth) : null,
      glyph_range_width: glyphLeft === null ? null : round(glyphRight - glyphLeft),
      line_covers_payload_not_entire_formula: Boolean(ruleBox && glyphLeft !== null
        && Math.abs(ruleBox.left - glyphLeft) <= 2 && Math.abs(ruleBox.right - glyphRight) <= 2),
      scope_type: /^\d+$/.test(visibleText(element)) ? "integer-only rendered payload" : "noninteger payload: rendering only, no distractor semantics judged",
    };
  });
  const overflow = [...document.querySelectorAll(".nb,.option-text,li.ex .body")].map((element, index) => ({
    index, class: element.className, box: rect(element), client_width: element.clientWidth,
    scroll_width: element.scrollWidth, scroll_left: element.scrollLeft,
    overflow_x: getComputedStyle(element).overflowX,
    text: visibleText(element), tex: [...element.querySelectorAll("annotation")].map((node) => node.textContent),
  })).filter((item) => item.scroll_width > item.client_width + 1);
  const paragraphs = [...document.querySelectorAll("p.para")].map((element, index) => ({
    index, text: visibleText(element), box: rect(element), visible: visible(element),
    formulas: [...element.querySelectorAll("annotation")].map((node) => node.textContent),
  }));
  const exerciseRows = [...document.querySelectorAll("li.ex")].map((element, index) => {
    const body = element.querySelector(".body");
    const no = element.querySelector(".no");
    return { index, number: no ? visibleText(no) : null, box: rect(element),
      no_box: no ? rect(no) : null, body_box: body ? rect(body) : null,
      label_body_collision: no && body ? overlap(rect(no), rect(body)) : null,
      body_text: body ? visibleText(body) : null, visible: visible(element),
      subpart_labels: body ? [...body.querySelectorAll(".prose-math")].map((node) => node.textContent.trim())
        .filter((text) => /^[a-f]$/.test(text)) : [],
      radios: [...element.querySelectorAll('input[type="radio"]')].map((radio) => ({
        name: radio.name, value: radio.value, checked: radio.checked,
        has_native_label: radio.labels.length === 1,
      })),
    };
  });
  const options = [...document.querySelectorAll("label.option")].map((element, index) => {
    const radio = element.querySelector("input");
    const letter = element.querySelector(".option-letter");
    const text = element.querySelector(".option-text");
    const boxes = [radio, letter, text].filter(Boolean).map(rect);
    return { index, name: radio?.name, value: radio?.value, text: text ? visibleText(text) : null,
      box: rect(element), visible: visible(element), cells: boxes,
      cell_collision: boxes.some((a, i) => boxes.slice(i + 1).some((b) => overlap(a, b))),
      letter: letter ? visibleText(letter) : null,
      lines: text ? text.querySelectorAll(".choice-line").length : 0,
      formulas: [...element.querySelectorAll("annotation")].map((node) => node.textContent),
    };
  });
  const blockCollisions = [];
  for (const [kind, items] of [["paragraphs", paragraphs], ["exercises", exerciseRows], ["options", options]]) {
    for (let i = 1; i < items.length; i++) if (overlap(items[i - 1].box, items[i].box))
      blockCollisions.push({ kind, first: i - 1, second: i });
  }
  const glyphs = [];
  const walker = document.createTreeWalker(document.querySelector(".sheet") ?? document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const parent = node.parentElement;
    if (!node.textContent.trim() || parent.closest(".katex-mathml,style,script,.pstrut,.strut,.vlist-s")) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    const boxes = [...range.getClientRects()].filter((box) => box.width > 0 && box.height > 0);
    glyphs.push({
      text: node.textContent, math: Boolean(parent.closest(".katex")), font: getComputedStyle(parent).fontFamily,
      rects: boxes.map((box) => ({ x: round(box.x + scrollX), y: round(box.y + scrollY),
        width: round(box.width), height: round(box.height), right: round(box.right + scrollX), bottom: round(box.bottom + scrollY) })),
    });
  }
  return {
    title: document.title, h1: document.querySelector("h1")?.textContent,
    document: { width: innerWidth, height: innerHeight, scroll_width: document.documentElement.scrollWidth,
      scroll_height: document.documentElement.scrollHeight, body_scroll_width: document.body.scrollWidth },
    paragraphs, exerciseRows, options, formulas, ascii, bars, overflow, blockCollisions, glyphs,
    images: document.querySelectorAll("img,svg:not(.katex svg),canvas").length,
    image_tags: document.querySelectorAll("img").length,
    katex_errors: [...document.querySelectorAll(".katex-error,.err,.sr-tex-err")].map((element) => visibleText(element)),
    font_faces: [...document.fonts].map((face) => ({ family: face.family, status: face.status, style: face.style, weight: face.weight })),
    local_main_font_loaded: document.fonts.check('18px "KaTeX_Main"', "ABC123<>"),
    scripts: document.querySelectorAll("script").length,
    input_count: document.querySelectorAll("input,textarea,math-field,button").length,
    jumps: [...document.querySelectorAll("a[href]")].map((element) => ({ text: visibleText(element), href: element.getAttribute("href"), box: rect(element) })),
  };
}

async function checkPage(context, viewport, name) {
  const page = await context.newPage();
  const result = { viewport, name, checks: [], errors: [], actions: [], console: [], page_errors: [] };
  const check = (id, condition, evidence = {}) => result.checks.push({ id, status: condition ? "PASS" : "FAIL", evidence });
  page.on("console", (message) => result.console.push({ type: message.type(), text: message.text() }));
  page.on("pageerror", (error) => result.page_errors.push(String(error)));
  try {
    const response = await page.goto(`${base}/${name}.html`, { waitUntil: "load" });
    check("http-ok", response?.status() === 200);
    await page.evaluate(async () => { await document.fonts.ready; });
    result.dom = await page.evaluate(inspectDom);
    const dom = result.dom;
    check("nonempty-actual-view", Boolean(dom.h1 && dom.formulas.length && dom.document.scroll_height > 100));
    check("no-page-horizontal-overflow", dom.document.scroll_width <= viewport.width + 1
      && dom.document.body_scroll_width <= viewport.width + 1, dom.document);
    check("zero-images", dom.images === 0 && dom.image_tags === 0);
    check("no-katex-error", dom.katex_errors.length === 0);
    check("local-font-loaded", dom.local_main_font_loaded
      && dom.font_faces.some((face) => face.family.replace(/"/g, "") === "KaTeX_Main" && face.status === "loaded"));
    check("math-root-katex-main-1.1em", dom.formulas.every((formula) =>
      formula.font.includes("KaTeX_Main") && Math.abs(formula.ratio - 1.1) < 0.01),
    dom.formulas.filter((formula) => !formula.font.includes("KaTeX_Main") || Math.abs(formula.ratio - 1.1) >= 0.01));
    check("ascii-labels-katex-main-1.1em", dom.ascii.every((item) =>
      item.font.includes("KaTeX_Main") && Math.abs(item.ratio - 1.1) < 0.01),
    dom.ascii.filter((item) => !item.font.includes("KaTeX_Main") || Math.abs(item.ratio - 1.1) >= 0.01));
    check("no-block-or-grid-cell-collision", dom.blockCollisions.length === 0
      && dom.options.every((option) => !option.cell_collision)
      && dom.exerciseRows.every((row) => !row.label_body_collision),
    { blockCollisions: dom.blockCollisions, option_collisions: dom.options.filter((option) => option.cell_collision) });
    check("integer-bar-rendered-scope", dom.bars.every((bar) => bar.line_covers_payload_not_entire_formula && bar.rule_border_px > 0),
      dom.bars);
    // Overflow in a nonbreakable wrapper is not page overflow, but it does hide default-view math details.
    check("all-default-math-details-unclipped", dom.overflow.length === 0, dom.overflow);
    check("view-only-no-auto-grading", dom.scripts === 0);
    if (name === "text") check("all-17-paragraphs", dom.paragraphs.length === 17 && dom.paragraphs.every((item) => item.visible));
    if (name === "exercises") {
      check("two-writing-exercises", dom.exerciseRows.length === 2);
      check("six-plus-four-subparts", JSON.stringify(dom.exerciseRows.map((row) => row.subpart_labels))
        === JSON.stringify([["a", "b", "c", "d", "e", "f"], ["a", "b", "c", "d"]]),
      dom.exerciseRows.map((row) => ({ number: row.number, labels: row.subpart_labels })));
      result.writing_input_scope = "Existing offline writing view has no answer input controls; not invented or filled by this visual review.";
    }
    if (name === "choices") {
      check("10-choices-38-options", dom.exerciseRows.length === 10 && dom.options.length === 38);
      check("native-label-associations", dom.exerciseRows.every((row) => row.radios.length >= 2
        && row.radios.every((radio) => radio.has_native_label)));
      for (let i = 0; i < dom.exerciseRows.length; i++) {
        const row = page.locator("li.ex").nth(i);
        const options = row.locator("label.option");
        for (let j = 0; j < await options.count(); j++) {
          await options.nth(j).click();
          const radios = await row.getByRole("radio").evaluateAll((elements) => elements.map((radio) =>
            ({ name: radio.name, value: radio.value, checked: radio.checked })));
          check(`native-radio-${i}-${j}`, radios.filter((radio) => radio.checked).length === 1 && radios[j].checked, radios);
          result.actions.push({ question_index: i, option_index: j, operation: "native label click; order-only selection, not an answer key", radios });
        }
      }
    }
    result.reachability = [];
    const targets = name === "text" ? page.locator("p.para") : name === "choices" ? page.locator("label.option") : page.locator("li.ex");
    for (let index = 0; index < await targets.count(); index++) {
      await targets.nth(index).scrollIntoViewIfNeeded();
      const box = await targets.nth(index).boundingBox();
      const reachable = box && box.x >= -1 && box.x + box.width <= viewport.width + 1
        && box.y + box.height > 0 && box.y < viewport.height;
      result.reachability.push({ index, box, reachable: Boolean(reachable) });
    }
    check("all-content-scroll-reachable", result.reachability.every((item) => item.reachable), result.reachability);
    result.horizontal_reachability = await page.evaluate(() => [...document.querySelectorAll(".nb,.option-text,.body")]
      .filter((element) => element.scrollWidth > element.clientWidth + 1).map((element) => {
        const initial = element.scrollLeft;
        element.scrollLeft = element.scrollWidth;
        const maximumReached = element.scrollLeft;
        element.scrollLeft = initial;
        return { class: element.className, clientWidth: element.clientWidth, scrollWidth: element.scrollWidth,
          maxScrollLeft: maximumReached, far_right_accessible_by_internal_scroll: maximumReached >= element.scrollWidth - element.clientWidth - 1 };
      }));
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    result.bottom = await page.evaluate(() => ({
      scrollY, maximum: document.documentElement.scrollHeight - innerHeight,
      lastContentBottom: (document.querySelector("a.jump") ?? document.body.lastElementChild).getBoundingClientRect().bottom,
    }));
    check("bottom-jump-visible", result.bottom.lastContentBottom <= viewport.height + 1 && result.bottom.lastContentBottom > 0, result.bottom);
    const jumps = await page.locator("a[href]").count();
    for (let index = 0; index < jumps; index++) {
      const link = page.locator("a[href]").nth(index);
      const href = await link.getAttribute("href");
      await link.click();
      await page.waitForURL(`${base}/${href}`);
      check(`jump-${index}`, Boolean(await page.getByRole("heading", { level: 1 }).textContent()), { href, actual_url: page.url() });
      await page.goto(`${base}/${name}.html`, { waitUntil: "load" });
      await page.evaluate(async () => { await document.fonts.ready; });
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    result.final_dom = await page.evaluate(inspectDom);
    check("no-js-or-console-errors", result.page_errors.length === 0 && !result.console.some((item) => item.type === "error"),
      { page_errors: result.page_errors, console: result.console });
    const screenshot = path.join(out, `${viewport.name}-${name}.png`);
    if (screenshots.length >= 6) throw new Error("Six-image screenshot budget reached");
    await page.screenshot({ path: screenshot, fullPage: true, animations: "disabled" });
    const bytes = readFileSync(screenshot);
    const image = { path: screenshot, viewport: viewport.name, page: name, sha256: sha256(bytes), bytes: bytes.length,
      width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20), full_page: true,
      capture_index: screenshots.length + 1, image_open_count: 0 };
    screenshots.push(image);
    result.screenshot = image;
  } catch (error) {
    result.errors.push(String(error.stack ?? error));
  } finally {
    await page.close();
    result.page_closed = true;
    result.dom_verdict = result.errors.length || result.checks.some((item) => item.status === "FAIL") ? "FAIL" : "PASS";
    pages.push(result);
    console.log(JSON.stringify({ viewport: viewport.name, page: name, verdict: result.dom_verdict,
      failed_checks: result.checks.filter((item) => item.status === "FAIL").map((item) => item.id),
      errors: result.errors, screenshot: result.screenshot?.path }));
  }
}

try {
  server = createServer((request, response) => {
    const url = new URL(request.url, "http://127.0.0.1");
    const name = names.find((item) => url.pathname === `/${item}.html`);
    requests.push({ method: request.method, path: url.pathname, local_only: true });
    if (name) {
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(buffers.get(name));
    } else {
      response.writeHead(url.pathname === "/favicon.ico" ? 204 : 404);
      response.end();
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
  for (const headless of [false, true]) {
    try {
      const started = new Date().toISOString();
      browser = await chromium.launch({ headless, args: ["--disable-background-networking", "--disable-component-update", "--disable-sync", "--no-first-run"] });
      launches.push({ headless, status: "success", started, version: browser.version(), executable: chromium.executablePath() });
      break;
    } catch (error) {
      launches.push({ headless, status: "failed", actual_error: String(error.stack ?? error) });
      if (headless || !/display|X server|WindowServer|no GUI|cannot connect.*server/i.test(String(error))) throw error;
    }
  }
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1, serviceWorkers: "block" });
    await context.route("**/*", async (route) => {
      if (route.request().url().startsWith(`${base}/`)) await route.continue();
      else {
        blockedRequests.push({ url: route.request().url(), resource: route.request().resourceType() });
        await route.abort("blockedbyclient");
      }
    });
    for (const name of names) await checkPage(context, viewport, name);
    await context.close();
  }
} catch (error) {
  fatal = String(error.stack ?? error);
} finally {
  if (browser) { await browser.close(); browserClosed = true; }
  if (server) { await new Promise((resolve) => server.close(resolve)); serverClosed = true; }
  const stable = inputBindings.every((input) => sha256(readFileSync(input.path)) === input.sha256);
  const report = {
    schema: "stemrobin-184B/n12-offline-dom-review@1", lesson: "ana9-c3-s1-n12",
    scope: "Visual/DOM/interaction only. Franklin choice semantic review remains pending; no mathematical/semantic/Gate2 review replay.",
    inputBindings, inputs_unchanged: stable, launches, local_server: { base, closed: serverClosed }, browser_closed: browserClosed,
    app_playwright: { module: require.resolve("@playwright/test"), version: require("@playwright/test/package.json").version },
    pages, requests, blocked_external_requests: blockedRequests, screenshots, screenshot_budget: 6,
    screenshot_count: screenshots.length, opened_images_this_command: 0, fatal,
    dom_verdict: !fatal && stable && screenshots.length === 6 && pages.every((page) => page.dom_verdict === "PASS") ? "PASS" : "FAIL",
    visual_verdict: "PENDING_SIX_SINGLE_OPEN_OBSERVATIONS",
    semantic_verdict: "NOT_REVIEWED_AWAITING_FRANKLIN",
    native_exit: fatal ? 2 : pages.some((page) => page.dom_verdict === "FAIL") ? 1 : 0,
    renderer_or_choice_generator_executed: false, HTML_source_canonical_modified: false,
    no_grading_or_answer_key_injection: true,
  };
  write("dom-report.json", report);
  write("browser-launch.json", launches);
  write("screenshots.json", screenshots);
  write("images-ledger.pending.json", { prior_image_opens: 0, budget: 6, generated: screenshots.length, opened: 0,
    planned_single_opens: screenshots.map((item) => ({ path: item.path, sha256: item.sha256, maximum_opens: 1 })) });
  process.exitCode = report.native_exit;
}

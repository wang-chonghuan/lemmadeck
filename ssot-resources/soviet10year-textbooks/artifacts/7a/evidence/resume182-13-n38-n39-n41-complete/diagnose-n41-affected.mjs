import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const require = createRequire(path.join(cwd, "app/package.json"));
const { chromium } = require("playwright");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/display";
const out = `${base}/n41-affected-FIRST`;
assert(!fs.existsSync(out));
fs.mkdirSync(out);
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = file => ({ path: path.resolve(file), sha256: sha(file) });
const originalFile = `${base}/next-batch-choices-FIRST/result.json`;
const original = JSON.parse(fs.readFileSync(originalFile, "utf8"));
const first = original.checks.find(check => check.lesson.endsWith("n41")
  && check.viewport.width === 390);
assert.equal(sha(first.html.path), first.html.sha256);
const result = { status: "running", first: ref(originalFile), html: first.html,
  startedAt: new Date().toISOString(), viewport: first.viewport,
  parentImagesOpened: 1, contentChanged: false, sourceMathReviewsRepeated: false,
  checks: [], checked_images: [] };
const browser = await chromium.launch({ headless: false });
try {
  const context = await browser.newContext({ viewport: first.viewport });
  try {
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(pathToFileURL(path.resolve(first.html.path)).href);
    await page.evaluate(() => document.fonts.ready);
    for (const index of [5, 24, 25]) {
      const owner = page.locator("section.choice").nth(index);
      await owner.scrollIntoViewIfNeeded();
      if (index === 5) await owner.evaluate(element => {
        for (const child of [element, ...element.querySelectorAll("*")]) {
          if (["auto", "scroll"].includes(getComputedStyle(child).overflowX)) {
            child.scrollLeft = child.scrollWidth;
          }
        }
      });
      const geometry = await owner.evaluate(element => {
        const box = node => {
          const r = node.getBoundingClientRect();
          return { left: r.left, right: r.right, top: r.top, bottom: r.bottom,
            width: r.width, clientWidth: node.clientWidth, scrollWidth: node.scrollWidth,
            scrollLeft: node.scrollLeft, overflowX: getComputedStyle(node).overflowX };
        };
        const terminal = element.querySelector(".choice-option-body .katex-html")
          ?.lastElementChild?.lastElementChild;
        const clips = [];
        for (let p = terminal; p && p !== element.parentElement; p = p.parentElement) {
          if (p === terminal || ["auto", "scroll", "hidden", "clip"]
            .includes(getComputedStyle(p).overflowX)) clips.push({ className: p.className,
            text: p === terminal ? p.textContent : undefined, ...box(p) });
        }
        return { owner: box(element), terminal: terminal ? box(terminal) : null, clips,
          math: element.querySelector(".choice-option-body annotation")?.textContent,
          svgLabels: [...element.querySelectorAll("svg text")].map(text =>
            ({ text: text.textContent, ...box(text) })),
          rootOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
      });
      assert(geometry.rootOverflow <= 1);
      const file = `${out}/n41-q${index + 1}-${index === 5 ? "right" : "left"}-mobile.png`;
      await owner.screenshot({ path: file });
      result.checks.push({ index, geometry, screenshot: ref(file),
        existingRight: first.rightEnds.find(item => item.index === index) });
      result.checked_images.push(ref(file));
    }
    assert.deepEqual(errors, []);
    assert.equal(sha(first.html.path), first.html.sha256);
    result.status = "pass";
    result.consoleErrors = errors;
  } finally {
    await context.close();
  }
} catch (error) {
  result.status = "fail";
  result.error = error.stack;
  process.exitCode = 1;
} finally {
  await browser.close();
  result.finishedAt = new Date().toISOString();
  const file = `${out}/result.json`;
  fs.writeFileSync(file, `${JSON.stringify(result, null, 2)}\n`, { flag: "wx" });
  fs.chmodSync(file, 0o444);
  console.log(JSON.stringify({ status: result.status, result: ref(file),
    q6: result.checks[0]?.geometry, error: result.error }));
}

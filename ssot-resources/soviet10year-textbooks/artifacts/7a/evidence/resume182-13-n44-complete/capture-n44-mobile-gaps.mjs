import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const require = createRequire(path.resolve("app/package.json"));
const { chromium } = require("playwright");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const output = `${base}/display/n44-mobile-gaps-FIRST`;
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const priorFile = `${base}/display/n44-complete-RECOVERY1/result.json`;
const prior = JSON.parse(fs.readFileSync(priorFile, "utf8"));
const approved = prior.checks.find(check => check.surface === "choices" && check.viewport.width === 390);
const firstReview = `${base}/display/n44-pixel-review/batch-02/review.json`;
assert.equal(JSON.parse(fs.readFileSync(firstReview, "utf8")).outcome, "blocked");
assert.equal(hash(approved.html.path), approved.html.sha256);
assert(!fs.existsSync(output));
fs.mkdirSync(output);
const result = {
  status: "running", startedAt: new Date().toISOString(),
  html: approved.html, inheritedRuntime: { path: priorFile, sha256: hash(priorFile) },
  firstReview: { path: firstReview, sha256: hash(firstReview) },
  purpose: "Only seven named typography observation gaps; no content or full-browser-check rerun.",
  viewport: { width: 390, height: 844 }, images: [],
};
const browser = await chromium.launch({ headless: false });
try {
  const context = await browser.newContext({ viewport: result.viewport });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto(pathToFileURL(path.resolve(approved.html.path)).href);
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator("section.choice").count(), 33);
  for (const section of [3, 4, 5, 6, 7, 14, 15]) {
    const owner = page.locator("section.choice").nth(section - 1);
    await owner.evaluate(container => {
      for (const element of [container, ...container.querySelectorAll("*")]) element.scrollLeft = 0;
    });
    const file = `${output}/choices-390-section-${section}.png`;
    await owner.screenshot({ path: file });
    const geometry = await owner.evaluate(container => {
      const rect = container.getBoundingClientRect();
      return {
        width: rect.width, height: rect.height,
        options: container.querySelectorAll(".choice-options>li").length,
        scrolls: [container, ...container.querySelectorAll("*")]
          .filter(element => element.scrollWidth > element.clientWidth + 1
            && ["auto", "scroll"].includes(getComputedStyle(element).overflowX))
          .map(element => ({ width: element.clientWidth, contentWidth: element.scrollWidth, left: element.scrollLeft })),
      };
    });
    assert(geometry.width > 0 && geometry.height > 0 && geometry.height < 6000);
    result.images.push({ section, path: path.resolve(file), sha256: hash(file), geometry });
  }
  assert.deepEqual(errors, []);
  assert.equal(hash(approved.html.path), approved.html.sha256);
  await context.close();
  result.status = "pass";
} catch (error) {
  result.status = "fail";
  result.error = error.stack || String(error);
  process.exitCode = 1;
} finally {
  await browser.close();
  result.finishedAt = new Date().toISOString();
  fs.writeFileSync(`${output}/result.json`, `${JSON.stringify(result, null, 2)}\n`, { flag: "wx" });
  console.log(JSON.stringify({ status: result.status, images: result.images.length, result: `${output}/result.json` }));
}

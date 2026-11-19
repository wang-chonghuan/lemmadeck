import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const require = createRequire(path.join(cwd, "app/package.json"));
const { chromium, expect } = require("playwright/test");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12";
const output = `${base}/display/n37-q31-mobile-affected1`;
const html = `${base}/render-affected/alg7-c4-s2-n37/choices.html`;
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const first = JSON.parse(fs.readFileSync(`${base}/display/n37-choices-FIRST/result.json`, "utf8"));
const firstPixel = `${base}/display/n37-choices-FIRST/pixel-review/result.json`;
const finding = JSON.parse(fs.readFileSync(firstPixel, "utf8"));
assert.equal(finding.status, "revise");
assert.equal(finding.findings[0].id, "PIXEL-01");
assert.equal(hash(html), first.checks.find((check) => check.viewport.width === 390).html.sha256);
assert(!fs.existsSync(output));
fs.mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: false });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto(pathToFileURL(path.resolve(html)).href);
  await page.evaluate(() => document.fonts.ready);
  const finalQuestion = page.locator("section.choice").nth(30);
  await expect(finalQuestion.locator(".choice-heading")).toContainText("31");
  await expect(finalQuestion.locator(".choice-options > li")).toHaveCount(4);
  await finalQuestion.scrollIntoViewIfNeeded();
  const geometry = await finalQuestion.evaluate((node) => {
    const rect = node.getBoundingClientRect();
    return {
      left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom,
      width: rect.width, height: rect.height,
      heading: node.querySelector(".choice-heading").textContent,
      optionLabels: [...node.querySelectorAll(".choice-options > li")].map((option) =>
        option.querySelector(".choice-option-label")?.textContent ?? option.textContent.slice(0, 2)),
      rootOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  assert(geometry.height > 0 && geometry.height < 844);
  assert(geometry.top >= 0 && geometry.bottom <= 844);
  assert(geometry.rootOverflow <= 1);
  assert.deepEqual(errors, []);
  const screenshot = `${output}/q31-mobile.png`;
  await finalQuestion.screenshot({ path: screenshot });
  assert.equal(hash(html), first.checks[0].html.sha256);
  fs.writeFileSync(`${output}/result.json`, `${JSON.stringify({
    status: "pass", headed: true, viewport: { width: 390, height: 844 },
    finding: "PIXEL-01", questionId: "q31", geometry,
    html: { path: html, sha256: hash(html) },
    screenshot: { path: screenshot, sha256: hash(screenshot) },
    firstReview: { path: firstPixel, sha256: hash(firstPixel) },
    firstCommandReused: true, candidateChanged: false, parentImageOpens: 0,
    scope: "Only q31 mobile pixels omitted from the FIRST tall capture; no whole-page rerun.",
    captureCause: "Not established; the bounded locator capture avoids the tall-page capture.",
  }, null, 2)}\n`, { flag: "wx" });
  console.log(JSON.stringify({ status: "pass", geometry, screenshot }));
} finally {
  await browser.close();
}

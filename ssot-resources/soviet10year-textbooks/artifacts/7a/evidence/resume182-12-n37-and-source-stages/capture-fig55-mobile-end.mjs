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
const output = `${base}/display/n39-fig55-mobile-right-end`;
assert(!fs.existsSync(output));
fs.mkdirSync(output, { recursive: true });
const html = `${base}/render-ready/alg7-c4-s2-n39/exercises.html`;
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const browser = await chromium.launch({ headless: false });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(pathToFileURL(path.resolve(html)).href);
  await page.evaluate(() => document.fonts.ready);
  const figure = page.locator("#fig-55");
  await figure.scrollIntoViewIfNeeded();
  await figure.evaluate((node) => { node.scrollLeft = node.scrollWidth; });
  await expect.poll(() => figure.evaluate((node) =>
    node.scrollLeft >= node.scrollWidth - node.clientWidth - 1)).toBe(true);
  const geometry = await figure.evaluate((node) => {
    const media = node.querySelector(".figure-media");
    const textMinPx = Math.min(...[...media.querySelectorAll("svg text")].map((text) => {
      const matrix = text.getScreenCTM();
      return parseFloat(getComputedStyle(text).fontSize) * Math.hypot(matrix.a, matrix.b);
    }));
    return { scrollLeft: node.scrollLeft, scrollWidth: node.scrollWidth,
      clientWidth: node.clientWidth, mediaWidth: media.getBoundingClientRect().width, textMinPx };
  });
  assert.equal(geometry.mediaWidth, 640);
  assert(geometry.textMinPx >= 16);
  const screenshot = `${output}/fig-55-mobile-right-end.png`;
  await figure.screenshot({ path: screenshot });
  fs.writeFileSync(`${output}/result.json`, `${JSON.stringify({
    status: "pass", viewport: { width: 390, height: 844 }, geometry,
    html: { path: html, sha256: hash(html) },
    screenshot: { path: screenshot, sha256: hash(screenshot) },
    scope: "One already-tested figure's visible mobile right-end state, not a repeated lesson gate.",
    parentImageOpens: 0,
  }, null, 2)}\n`, { flag: "wx" });
  console.log(JSON.stringify({ status: "pass", geometry, screenshot }));
} finally {
  await browser.close();
}

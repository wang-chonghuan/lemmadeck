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
const output = `${base}/display/n44-right-frames-FIRST`;
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const prior = JSON.parse(fs.readFileSync(`${base}/display/n44-complete-RECOVERY1/result.json`, "utf8"));
const approved = prior.checks.find(check => check.surface === "choices" && check.viewport.width === 390);
assert.equal(hash(approved.html.path), approved.html.sha256);
assert(!fs.existsSync(output));
fs.mkdirSync(output);
const result = {
  status: "running", html: approved.html, images: [],
  purpose: "Affected right-edge framing only; unchanged HTML, view/key/source content and inherited runtime.",
  viewport: { width: 390, height: 844 }, authorOrRendererRepairs: 0,
};
const browser = await chromium.launch({ headless: false });
try {
  const context = await browser.newContext({ viewport: result.viewport });
  const page = await context.newPage();
  await page.goto(pathToFileURL(path.resolve(approved.html.path)).href);
  await page.evaluate(() => document.fonts.ready);
  for (const section of [15, 16, 17, 18, 28]) {
    const owner = page.locator("section.choice").nth(section - 1);
    await owner.scrollIntoViewIfNeeded();
    const state = await owner.evaluate(container => {
      const elements = [container, ...container.querySelectorAll("*")];
      const scrolls = elements.filter(element => element.scrollWidth > element.clientWidth + 1
        && ["auto", "scroll"].includes(getComputedStyle(element).overflowX));
      for (const element of scrolls) element.scrollLeft = element.scrollWidth;
      const rect = container.getBoundingClientRect();
      return {
        top: Math.floor(rect.top + window.scrollY), height: Math.ceil(rect.height) + 2,
        documentWidth: document.documentElement.clientWidth,
        ownerLeft: rect.left, ownerRight: rect.right,
        scrolls: scrolls.map(element => ({
          width: element.clientWidth, contentWidth: element.scrollWidth, left: element.scrollLeft,
          maximumReached: element.scrollLeft >= element.scrollWidth - element.clientWidth - 1,
        })),
      };
    });
    assert(state.scrolls.length > 0 && state.scrolls.every(item => item.maximumReached));
    const file = `${output}/choices-390-section-${section}-right-frame.png`;
    await page.screenshot({ path: file, clip: { x: 0, y: state.top, width: 390, height: state.height } });
    const after = await owner.evaluate(container => ({
      documentWidth: document.documentElement.clientWidth,
      ownerWidth: container.getBoundingClientRect().width,
      maximumReached: [container, ...container.querySelectorAll("*")]
        .filter(element => element.scrollWidth > element.clientWidth + 1
          && ["auto", "scroll"].includes(getComputedStyle(element).overflowX))
        .every(element => element.scrollLeft >= element.scrollWidth - element.clientWidth - 1),
    }));
    assert.equal(after.documentWidth, state.documentWidth);
    assert(after.maximumReached);
    result.images.push({ section, path: path.resolve(file), sha256: hash(file), state, after });
  }
  assert.equal(hash(approved.html.path), approved.html.sha256);
  await context.close();
  result.status = "pass";
} catch (error) {
  result.status = "fail"; result.error = error.stack || String(error); process.exitCode = 1;
} finally {
  await browser.close();
  fs.writeFileSync(`${output}/result.json`, `${JSON.stringify(result, null, 2)}\n`, { flag: "wx" });
  console.log(JSON.stringify({ status: result.status, images: result.images.length, result: `${output}/result.json` }));
}

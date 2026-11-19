import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { chromium } from "/Users/yong/.codex/worktrees/00b1/lemmadeck/app/node_modules/playwright/index.mjs";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const root = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d910-n87-first-dom-capture");
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const write = (name, value) => fs.writeFileSync(path.join(root, name), `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
assert.equal(process.cwd(), repo);
const firstFailure = { path: path.join(root, "FIRST-failure.json"), sha256: hash(path.join(root, "FIRST-failure.json")) };
write("overflow-diagnosis-started.json", { firstFailure, nativeHtmlChanged: false, imageLoads: 0 });
const browser = await chromium.launch({ channel: "chrome", headless: false });
let result;
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(path.join(root, "zh/text.html")).href);
  await page.evaluate(() => document.fonts.ready);
  result = await page.evaluate(() => [...document.querySelectorAll(".nb")]
    .filter((node) => node.scrollWidth > node.clientWidth + 1).map((node) => {
      const box = (element) => {
        const r = element.getBoundingClientRect();
        return { x: r.x, y: r.y + scrollY, width: r.width, height: r.height, right: r.right };
      };
      const outer = box(node);
      const walker = document.createTreeWalker(node.querySelector(".katex-html"), NodeFilter.SHOW_TEXT);
      const texts = [];
      while (walker.nextNode()) {
        const text = walker.currentNode;
        if (!text.textContent.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(text);
        const r = range.getBoundingClientRect();
        if (r.width && r.height) texts.push({
          text: text.textContent, x: r.x, y: r.y + scrollY, width: r.width, height: r.height, right: r.right,
          rightOutsideWrapper: r.right > outer.right + 1,
        });
      }
      return {
        tex: node.querySelector("annotation").textContent, outer,
        clientWidth: node.clientWidth, scrollWidth: node.scrollWidth,
        katex: box(node.querySelector(".katex")), css: getComputedStyle(node).cssText,
        texts, textClipped: texts.some((text) => text.rightOutsideWrapper),
        descendantsOutside: [...node.querySelectorAll(".katex-html *")]
          .filter((element) => box(element).width > 0 && box(element).right > outer.right + 1)
          .map((element) => ({ className: element.className, ...box(element), text: element.textContent })),
      };
    }));
  assert.equal(result.length, 1);
  const target = result[0].outer;
  await page.evaluate((y) => scrollTo(0, Math.max(0, y - 160)), target.y);
  const screenshot = path.join(root, "screenshots/zh-text-1440-FIRST-overflow-region.png");
  fs.mkdirSync(path.dirname(screenshot), { recursive: true });
  assert.ok(!fs.existsSync(screenshot));
  await page.screenshot({ path: screenshot, fullPage: false, scale: "css" });
  write("overflow-diagnosis.json", {
    firstFailure, measurements: result, nativeHtmlChanged: false,
    screenshot: { path: screenshot, sha256: hash(screenshot), openedIntoModel: false, screenshotInvocations: 1 },
    mathematicalOrVisualVerdict: "Not reviewed", browserClosedAfterEvidence: true,
  });
  console.log(JSON.stringify({ measurements: result, screenshot: { path: screenshot, sha256: hash(screenshot) }, imageLoads: 0 }));
} finally {
  await browser.close();
}
for (const name of ["overflow-diagnosis-started.json", "overflow-diagnosis.json",
  "diagnose-first-overflow.mjs", "screenshots/zh-text-1440-FIRST-overflow-region.png"]) {
  fs.chmodSync(path.join(root, name), 0o444);
}

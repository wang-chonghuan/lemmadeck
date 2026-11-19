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
const output = `${base}/display/n44-edge-diagnosis-FIRST`;
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const priorFile = `${base}/display/n44-complete-RECOVERY1/result.json`;
const approved = JSON.parse(fs.readFileSync(priorFile, "utf8")).checks
  .find(check => check.surface === "choices" && check.viewport.width === 390);
assert.equal(hash(approved.html.path), approved.html.sha256);
assert(!fs.existsSync(output));
fs.mkdirSync(output);
const result = { status: "running", html: approved.html, sections: [], screenshotCount: 0 };
const browser = await chromium.launch({ headless: false });
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(pathToFileURL(path.resolve(approved.html.path)).href);
  await page.evaluate(() => document.fonts.ready);
  for (const section of [15, 16, 17, 18, 28]) {
    const owner = page.locator("section.choice").nth(section - 1);
    await owner.scrollIntoViewIfNeeded();
    const geometry = await owner.evaluate(container => {
      const all = [container, ...container.querySelectorAll("*")];
      const scrolls = all.filter(element => element.scrollWidth > element.clientWidth + 1
        && ["auto", "scroll"].includes(getComputedStyle(element).overflowX));
      for (const element of scrolls) element.scrollLeft = element.scrollWidth;
      const rect = element => {
        const box = element.getBoundingClientRect();
        return { left: box.left, right: box.right, width: box.width };
      };
      return {
        container: rect(container), scrolls: scrolls.map(element => ({
          className: element.className, rect: rect(element),
          clientWidth: element.clientWidth, scrollWidth: element.scrollWidth, left: element.scrollLeft,
        })),
        formulaEnds: [...container.querySelectorAll(".choice-option-body .katex-html")].map(formula => {
          const walker = document.createTreeWalker(formula, NodeFilter.SHOW_TEXT);
          let node, last;
          while ((node = walker.nextNode())) if (node.textContent.trim()) last = node;
          const range = document.createRange();
          range.selectNodeContents(last);
          const box = range.getBoundingClientRect();
          const ancestors = [];
          for (let element = last.parentElement; element; element = element.parentElement) {
            const style = getComputedStyle(element);
            if (["auto", "scroll", "hidden", "clip"].includes(style.overflowX)) {
              ancestors.push({ className: element.className, overflow: style.overflowX,
                rect: rect(element), clippedRight: box.right - element.getBoundingClientRect().right });
            }
            if (element === container) break;
          }
          return { formula: formula.textContent, lastGlyph: last.textContent,
            glyph: { left: box.left, right: box.right }, ancestors };
        }),
      };
    });
    result.sections.push({ section, geometry });
  }
  await context.close();
  assert.equal(hash(approved.html.path), approved.html.sha256);
  result.status = "pass";
} catch (error) {
  result.status = "fail"; result.error = error.stack || String(error); process.exitCode = 1;
} finally {
  await browser.close();
  fs.writeFileSync(`${output}/result.json`, `${JSON.stringify(result, null, 2)}\n`, { flag: "wx" });
  console.log(JSON.stringify(result, null, 2));
}

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
const output = `${base}/display/n44-right-frames-RECOVERY1`;
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
  for (const [section, region] of [
    [14, "table-header"], [15, "table-header"],
    [15, "options"], [16, "options"], [17, "options"], [18, "options"], [28, "options"],
  ]) {
    const owner = page.locator("section.choice").nth(section - 1);
    const target = region === "options" ? owner.locator(".choice-options")
      : owner.locator("table tr").first();
    await target.evaluate(element => element.scrollIntoView({ block: "start", inline: "nearest" }));
    await page.evaluate(() => window.scrollBy(0, -8));
    const state = await owner.evaluate(container => {
      const elements = [container, ...container.querySelectorAll("*")];
      const scrolls = elements.filter(element => element.scrollWidth > element.clientWidth + 1
        && ["auto", "scroll"].includes(getComputedStyle(element).overflowX));
      for (const element of scrolls) element.scrollLeft = element.scrollWidth;
      return {
        documentWidth: document.documentElement.clientWidth,
        ownerLeft: container.getBoundingClientRect().left,
        ownerRight: container.getBoundingClientRect().right,
        scrolls: scrolls.map(element => ({
          width: element.clientWidth, contentWidth: element.scrollWidth, left: element.scrollLeft,
          maximumReached: element.scrollLeft >= element.scrollWidth - element.clientWidth - 1,
        })),
      };
    });
    assert(state.scrolls.length > 0 && state.scrolls.every(item => item.maximumReached));
    const geometry = await target.boundingBox();
    const clip = {
      x: 0, y: Math.max(0, Math.floor(geometry.y) - 2),
      width: state.documentWidth, height: Math.ceil(geometry.height) + 4,
    };
    assert(clip.y + clip.height <= 844, `${section}/${region}: region must fit the real viewport`);
    const file = `${output}/choices-390-section-${section}-${region}-right-frame.png`;
    await page.screenshot({ path: file, clip });
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
    result.images.push({ section, region, path: path.resolve(file), sha256: hash(file), state, clip, after });
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

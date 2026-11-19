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
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const out = `${base}/display/current-batch-FIRST/scroll-ends-RECOVERY2`;
const lesson = "alg7-c4-s3-n42";
const first = JSON.parse(fs.readFileSync(`${base}/display/current-batch-FIRST/result.json`, "utf8"));
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
assert(!fs.existsSync(out));
fs.mkdirSync(out, { recursive: true });
const result = { status: "running", startedAt: new Date().toISOString(), lesson,
  inheritedCheck: { path: `${base}/display/current-batch-FIRST/result.json`,
    sha256: sha(`${base}/display/current-batch-FIRST/result.json`) },
  purpose: "Missing right-end pixels only; no content or figure changes and no repeated batch check",
  viewport: { width: 390, height: 844 }, checks: [] };
const browser = await chromium.launch({ headless: false });
try {
  const context = await browser.newContext({ viewport: result.viewport });
  const page = await context.newPage();
  try {
    for (const surface of ["text", "choices"]) {
      const inherited = first.checks.find(check => check.lesson === lesson
        && check.surface === surface && check.viewport.width === 390);
      assert(inherited);
      assert.equal(sha(inherited.html.path), inherited.html.sha256);
      await page.goto(pathToFileURL(path.resolve(inherited.html.path)).href);
      await page.evaluate(() => document.fonts.ready);
      const figures = page.locator(".fig[data-figure-layout=scroll]");
      assert.equal(await figures.count(), surface === "text" ? 1 : 2);
      for (let index = 0; index < await figures.count(); index++) {
        const figure = figures.nth(index);
        const geometry = await figure.evaluate(element => {
          element.scrollLeft = element.scrollWidth;
          const media = element.querySelector(".figure-media");
          return { id: element.id || null, clientWidth: element.clientWidth,
            scrollWidth: element.scrollWidth, scrollLeft: element.scrollLeft,
            mediaWidth: media.getBoundingClientRect().width,
            htmlHeight: element.getBoundingClientRect().height };
        });
        assert(geometry.scrollLeft >= geometry.scrollWidth - geometry.clientWidth - 1);
        assert(geometry.scrollLeft <= geometry.clientWidth,
          "Left and right captures must cover the entire media with overlap");
        assert.equal(geometry.mediaWidth, 640);
        const file = `${out}/${surface}-figure-${index + 1}-right-390.png`;
        await figure.screenshot({ path: file });
        const afterScreenshot = await figure.evaluate(element => ({
          scrollLeft: element.scrollLeft, scrollWidth: element.scrollWidth,
          clientWidth: element.clientWidth,
        }));
        assert(afterScreenshot.scrollLeft >= afterScreenshot.scrollWidth
          - afterScreenshot.clientWidth - 1);
        assert(afterScreenshot.scrollLeft <= afterScreenshot.clientWidth);
        result.checks.push({ surface, index, html: inherited.html, geometry, afterScreenshot,
          screenshot: { path: file, sha256: sha(file) } });
      }
    }
    result.status = "pass";
  } finally {
    await context.close();
  }
} catch (error) {
  result.status = "fail";
  result.error = error.stack || String(error);
  process.exitCode = 1;
} finally {
  await browser.close();
  result.finishedAt = new Date().toISOString();
  fs.writeFileSync(`${out}/result.json`, `${JSON.stringify(result, null, 2)}\n`, { flag: "wx" });
  console.log(JSON.stringify(result));
}

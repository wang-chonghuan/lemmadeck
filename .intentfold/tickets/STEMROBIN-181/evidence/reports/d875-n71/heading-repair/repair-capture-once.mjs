import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { chromium } from "/Users/yong/.codex/worktrees/00b1/lemmadeck/app/node_modules/playwright/index.mjs";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const ticket = path.join(repo, ".intentfold/tickets/STEMROBIN-181");
const root = path.join(ticket, "tmp/d863-n71-preview-heading-repair");
const first = path.join(ticket, "tmp/d852-n71-first-dom-capture");
const bind = (file) => ({ path: file, sha256: crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex") });
const sha = (text) => crypto.createHash("sha256").update(text).digest("hex");
const report = {
  card: "phy10-c2-s2-n71", status: "AFFECTED_HEADING_REPAIR_STARTED",
  FIRST: bind(path.join(ticket, "tmp/d854-n71-first-choices-answers-display-review/report.json")),
  textContentChanged: false, sourceAndNativeChanged: false,
  html: [], checks: [], screenshots: [], imagesOpened: 0, paidCalls: 0,
};
assert.equal(process.cwd(), repo);
function write(file, value) {
  assert.ok(file.startsWith(`${root}/`));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, typeof value === "string" ? value : `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
}
write(path.join(root, "started.json"), report);
const browser = await chromium.launch({ channel: "chrome", headless: false });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  for (const [surface, label] of [["choices", "\u9009\u62e9\u9898"], ["answers", "\u53c2\u8003\u7b54\u6848"]]) {
    const source = path.join(first, "zh", `${surface}.html`);
    const html = fs.readFileSync(source, "utf8");
    const token = `| ${surface}`;
    assert.equal(html.split(token).length, 3);
    const repaired = html.replaceAll(token, `| ${label}`);
    assert.equal(repaired.replaceAll(`| ${label}`, token), html);
    const target = path.join(root, "zh", `${surface}.html`);
    write(target, repaired);
    report.html.push({ surface, input: bind(source), output: bind(target), changedOnly: ["title", "h1"] });
    for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport);
      await page.goto(pathToFileURL(source).href);
      await page.evaluate(() => document.fonts.ready);
      const before = await page.locator("ol.ex").evaluate((element) => element.innerHTML);
      await page.goto(pathToFileURL(target).href);
      await page.evaluate(() => document.fonts.ready);
      const after = await page.locator("ol.ex").evaluate((element) => element.innerHTML);
      assert.equal(after, before);
      const dom = await page.evaluate(() => ({
        heading: document.querySelector("h1").textContent,
        title: document.title,
        overflow: document.documentElement.scrollWidth - innerWidth,
        headingOverflow: document.querySelector("h1").scrollWidth - document.querySelector("h1").clientWidth,
        errors: [...document.querySelectorAll(".katex-error,.err")].map((n) => n.textContent),
      }));
      assert.ok(dom.heading.endsWith(`| ${label}`));
      assert.ok(dom.title.endsWith(`| ${label}`));
      assert.ok(dom.overflow <= 1);
      assert.ok(dom.headingOverflow <= 1);
      assert.deepEqual(dom.errors, []);
      assert.deepEqual(errors, []);
      const screenshot = path.join(root, "screenshots", `zh-${surface}-${viewport.width}-heading.png`);
      fs.mkdirSync(path.dirname(screenshot), { recursive: true });
      await page.screenshot({ path: screenshot });
      report.checks.push({ surface, viewport, dom, bodyShaBefore: sha(before), bodyShaAfter: sha(after) });
      report.screenshots.push({ surface, viewport, ...bind(screenshot) });
    }
  }
  report.status = "AFFECTED_CHINESE_HEADINGS_DOM_CAPTURE_PASS_VISUAL_PENDING";
  write(path.join(root, "report.json"), report);
} catch (error) {
  write(path.join(root, "FIRST-repair-failure.json"), { error: String(error.stack || error), report });
  throw error;
} finally {
  await browser.close();
}
console.log(JSON.stringify({ status: report.status, screenshots: report.screenshots.length }));

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
const out = `${base}/n39-q24-affected-RECOVERY1`;
assert(!fs.existsSync(out));
fs.mkdirSync(out);
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = file => ({ path: path.resolve(file), sha256: sha(file) });
const firstFile = `${base}/next-batch-choices-FIRST/result.json`;
const first = JSON.parse(fs.readFileSync(firstFile, "utf8"));
const inherited = first.checks.find(check => check.lesson === "alg7-c4-s2-n39"
  && check.viewport.width === 1440);
const draftFile = "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s2-n39/choice-set/draft.json";
const draft = JSON.parse(fs.readFileSync(draftFile, "utf8"));
assert.equal(first.status, "pass");
assert.equal(sha(inherited.html.path), inherited.html.sha256);
const result = { status: "running", startedAt: new Date().toISOString(),
  first: ref(firstFile), failedAffectedAttempt: ref(`${base}/n39-q24-affected-FIRST/result.json`),
  draft: ref(draftFile), html: inherited.html, viewport: inherited.viewport,
  scope: "Only final question 24 capture continuity; no content or mathematical review repeated.",
  parentImagesOpened: 0, contentChanged: false, originalFailurePreserved: true };
const browser = await chromium.launch({ headless: false });
try {
  const context = await browser.newContext({ viewport: inherited.viewport });
  try {
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(pathToFileURL(path.resolve(inherited.html.path)).href);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(await page.locator("section.choice").count(), 24);
    assert.equal(await page.locator(".katex-error,.err").count(), 0);
    const owner = page.locator("section.choice").nth(23);
    await owner.scrollIntoViewIfNeeded();
    const geometry = await owner.evaluate(element => {
      const r = element.getBoundingClientRect();
      return { width: r.width, height: r.height, text: element.textContent,
        options: element.querySelectorAll(".choice-options>li").length,
        figures: [...element.querySelectorAll(".figure-media")].map(figure => ({
          width: figure.getBoundingClientRect().width,
          objects: figure.querySelectorAll("svg path,svg line,svg circle,svg rect").length,
        })),
        duplicateHeading: element.querySelectorAll("h1").length,
        rootOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
    });
    assert(geometry.width > 0 && geometry.height > 0 && geometry.height < 960);
    assert.equal(geometry.options, draft.questions[23].view.options.length);
    assert.equal(geometry.figures.length, 1);
    assert(geometry.figures.every(figure => figure.width > 0 && figure.objects > 0));
    assert.equal(geometry.duplicateHeading, 0);
    assert(geometry.rootOverflow <= 1);
    const file = `${out}/n39-q24-desktop.png`;
    await owner.screenshot({ path: file });
    assert.deepEqual(errors, []);
    assert.equal(sha(inherited.html.path), inherited.html.sha256);
    result.status = "pass";
    result.geometry = geometry;
    result.checked_images = [ref(file)];
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
  console.log(JSON.stringify({ status: result.status, result: ref(file), error: result.error }));
}

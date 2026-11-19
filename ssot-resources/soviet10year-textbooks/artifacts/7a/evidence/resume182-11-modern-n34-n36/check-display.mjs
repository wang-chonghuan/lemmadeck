import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const require = createRequire(path.join(cwd, "app/package.json"));
const { chromium } = require("playwright");
const { proseFlow } = require(path.join(cwd, ".claude/skills/ld-s10y-lesson/tools/htmlfrag.js"));
const args = process.argv.slice(2);
const label = args.shift();
const surfacesArg = args.find((arg) => arg.startsWith("--surfaces="));
const surfaces = surfacesArg ? surfacesArg.slice(11).split(",") : ["text", "exercises", "choices"];
const renderArg = args.find((arg) => arg.startsWith("--render="));
const lessons = args.filter((arg) => !arg.startsWith("--"));
assert(label && lessons.length);
assert(surfaces.length && surfaces.every((surface) => ["text", "exercises", "choices"].includes(surface)));
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11";
const render = renderArg ? renderArg.slice(9) : `${base}/render`;
const output = `${base}/display/${label}`;
assert(!fs.existsSync(output));
fs.mkdirSync(output, { recursive: true });
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const edition = "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral";
const result = { startedAt: new Date().toISOString(), cwd, status: "running", checks: [] };
const browser = await chromium.launch({ headless: false });
try {
  for (const lesson of lessons) {
    const folder = `${edition}/lessons/${lesson}`;
    const L = read(`${folder}/lesson.json`);
    const X = read(`${folder}/exercises.json`);
    const draft = read(`${folder}/choice-set/draft.json`);
    const review = read(`${folder}/choice-set/review.json`);
    assert.equal(review.outcome, "pass");
    for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
      try {
        for (const surface of surfaces) {
          const file = `${render}/${lesson}/${surface}.html`;
          await page.goto(pathToFileURL(path.resolve(file)).href);
          await page.evaluate(() => document.fonts.ready);
          assert.equal(await page.locator("h1").count(), 1);
          assert.equal(await page.locator(".err,.katex-error").count(), 0);
          assert.equal(await page.locator(".sheet").isVisible(), true);
          assert.equal(await page.locator("input,textarea,button,select,a.jump,[role=button],[role=link]").count(), 0);
          const html = fs.readFileSync(file, "utf8");
          for (const field of ["source_solution", "source_numbers", "seed_sha256", "rationales", "correct_option_ids"]) {
            assert(!html.includes(field), `${lesson}/${surface}: private field ${field}`);
          }
          if (surface === "text") {
            const count = proseFlow(L.prose, L.section_breaks).filter((b) => !["fig", "cap"].includes(b.kind)).length;
            assert.equal(await page.locator("p.para").count(), count);
            assert.equal(await page.locator("p.para.section").count(), L.section_breaks.length);
            assert(await page.locator(".sheet > .figcap").evaluateAll((captions) =>
              captions.every((caption) => {
                const match = caption.textContent.replace(/\s/g, "").match(/^图(\d+)$/);
                return match && caption.previousElementSibling?.id === `fig-${match[1]}`;
              })), `${lesson}: detached caption`);
          } else if (surface === "exercises") {
            assert.equal(await page.locator("li.ex").count(), X.exercises.length);
            for (const exercise of X.exercises) assert.equal(await page.locator(`#ex-${exercise.number}`).count(), 1);
          } else {
            assert.equal(await page.locator("section.choice").count(), draft.questions.length);
            assert.equal(await page.locator(".choice-options>li").count(),
              draft.questions.reduce((sum, question) => sum + question.view.options.length, 0));
          }
          const layout = await page.evaluate(() => {
            const scrolls = [];
            for (const element of document.querySelectorAll(".nb,.sr-nb,.fig[data-figure-layout=scroll],.choice-stem,.choice-option-body")) {
              if (element.scrollWidth <= element.clientWidth + 1) continue;
              element.scrollLeft = element.scrollWidth;
              scrolls.push({ className: element.className, reachable: element.scrollLeft >= element.scrollWidth - element.clientWidth - 1 });
              element.scrollLeft = 0;
            }
            const figures = [...document.querySelectorAll(".figure-media")].map((element) => ({
              width: element.getBoundingClientRect().width,
              textMinPx: Math.min(...[...element.querySelectorAll("svg text")].map((text) => {
                const m = text.getScreenCTM();
                return parseFloat(getComputedStyle(text).fontSize) * Math.hypot(m.a, m.b);
              })),
              objects: element.querySelectorAll("svg path,svg line,svg circle,svg rect").length,
            }));
            return {
              rootOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
              scrolls, figures,
            };
          });
          assert(layout.rootOverflow <= 1, `${lesson}/${surface}: root overflow ${layout.rootOverflow}`);
          assert(layout.scrolls.every((item) => item.reachable), `${lesson}/${surface}: inaccessible scroll end`);
          assert(layout.figures.every((item) => item.width > 0 && item.textMinPx >= 16 && item.objects > 0));
          assert.deepEqual(errors, []);
          const screenshot = `${output}/${lesson}-${surface}-${viewport.width}.png`;
          await page.screenshot({ path: screenshot, fullPage: true });
          result.checks.push({ lesson, surface, viewport, layout, html: { path: file, sha256: hash(file) },
            screenshot: { path: screenshot, sha256: hash(screenshot) }, consoleErrors: [] });
        }
      } finally {
        await context.close();
      }
    }
  }
  result.status = "pass";
} catch (error) {
  result.status = "fail";
  result.error = error.stack || String(error);
  process.exitCode = 1;
} finally {
  await browser.close();
  result.finishedAt = new Date().toISOString();
  fs.writeFileSync(`${output}/result.json`, `${JSON.stringify(result, null, 2)}\n`, { flag: "wx" });
  console.log(JSON.stringify({ status: result.status, completedSurfaces: result.checks.length,
    result: `${output}/result.json`, error: result.error || null }));
}

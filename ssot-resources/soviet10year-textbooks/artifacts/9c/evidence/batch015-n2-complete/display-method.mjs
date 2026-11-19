import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { choiceHtml } from "../../../../.claude/skills/ld-s10y-lesson/tools/choice_html.mjs";

const repo = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
assert.equal(process.cwd(), repo);
const { chromium } = createRequire(path.join(repo, "app/package.json"))("playwright");
const id = "ana9-c1-s1-n2";
const draftPath = path.join(repo, ".tmp/s10y-choice/batch015-ana9-n2-zh/draft.json");
const draft = JSON.parse(fs.readFileSync(draftPath));
assert.equal(draft.questions.length, 7);
assert.deepEqual(draft.new_figures, []);
for (const question of draft.questions) {
  assert.deepEqual(question.view.figure_ids, []);
  for (const option of question.view.options) assert.deepEqual(option.figure_ids, []);
}
const base = path.join(repo, ".tmp/ld-s10y-lesson/render/9c/modern-us-neutral", id, "exercises.html");
const output = path.join(repo, ".intentfold/tickets/STEMROBIN-184/tmp/offline-batch015", id);
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const results = [];
const resultPath = path.join(output, "result.json");
fs.mkdirSync(path.dirname(output), { recursive: true });
const resume = process.argv.includes("--resume");
if (resume) {
  const prior = JSON.parse(fs.readFileSync(resultPath));
  assert.equal(prior.draft.sha256, hash(draftPath));
  results.push(...prior.results.filter(result => result.status === "pass"));
} else {
  fs.mkdirSync(output);
}
const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    if (results.some(result => result.viewport.width === viewport.width)) continue;
    const context = await browser.newContext({ viewport });
    await context.setOffline(true);
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.goto(pathToFileURL(base).href);
    const visible = draft.questions.map(({ view: question }, index) =>
      `<li class="ex" data-question="${index + 1}"><div class="no">${index + 1}.</div><div class="body">`
      + `<div class="choice-stem">${choiceHtml(question.stem)}</div>`
      + `<fieldset class="choice-options"><legend>${question.mode === "single" ? "单选" : "多选"}</legend>`
      + question.options.map((option, optionIndex) =>
        `<label class="choice-option"><input type="${question.mode === "single" ? "radio" : "checkbox"}" `
        + `name="question-${index}" value="${optionIndex}"><span class="choice-option-text">${choiceHtml(option.text)}</span></label>`
      ).join("") + "</fieldset></div></li>"
    ).join("");
    await page.evaluate(html => {
      const sheet = document.querySelector(".sheet");
      const title = sheet.querySelector("h1");
      title.textContent = `${title.textContent.replace(/ · 习题$/, "")} · 选择题`;
      const list = document.createElement("ol");
      list.className = "ex choice-projection";
      list.innerHTML = html;
      sheet.replaceChildren(title, list);
    }, visible);
    await page.addStyleTag({
      content: `
        .choice-projection>li.ex{grid-template-columns:minmax(0,1fr)}
        .choice-stem{min-width:0;overflow-x:auto}
        .choice-options{min-inline-size:0;max-width:100%}
        .choice-option{display:grid;grid-template-columns:1.2em minmax(0,1fr);gap:.3em}
        .choice-option>input{margin:.5em 0 0}
        .choice-option-text{min-width:0;overflow-x:auto}
      `
    });
    await page.evaluate(() => document.fonts.ready);
    await page.locator("h1").waitFor({ state: "visible" });
    assert.equal(await page.locator(".err,.katex-error").count(), 0);
    assert.equal(await page.locator("li.ex").count(), 7);
    for (let index = 0; index < draft.questions.length; index++) {
      const inputs = page.locator(`[data-question="${index + 1}"] input`);
      assert.equal(await inputs.count(), 4);
      await inputs.nth(0).check();
      await inputs.nth(1).check();
      assert.equal(await inputs.nth(0).isChecked(), draft.questions[index].view.mode === "multiple");
      assert.ok(await inputs.nth(1).isChecked());
      if (draft.questions[index].view.mode === "multiple") await inputs.nth(0).uncheck();
    }
    const html = await page.content();
    for (const field of ["source_solution", "seed_sha256", "rationales", "correct_index", "misconception"]) {
      assert.ok(!html.includes(field), `internal field leaked: ${field}`);
    }
    const dimensions = await page.evaluate(() => ({
      client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth
    }));
    assert.ok(dimensions.scroll <= dimensions.client + 1, JSON.stringify(dimensions));
    const geometry = await page.locator(".choice-stem,.choice-option-text").evaluateAll(elements =>
      elements.map(element => {
        const bounds = element.getBoundingClientRect();
        const input = element.parentElement.querySelector(":scope > input");
        const before = element.scrollLeft;
        element.scrollLeft = element.scrollWidth - element.clientWidth;
        const endReachable = element.scrollLeft + element.clientWidth >= element.scrollWidth - 1;
        element.scrollLeft = before;
        return {
          kind: element.className, left: bounds.left, right: bounds.right,
          inputRight: input?.getBoundingClientRect().right,
          client: element.clientWidth, scroll: element.scrollWidth,
          overflow: getComputedStyle(element).overflowX,
          fontSize: Number.parseFloat(getComputedStyle(element).fontSize), endReachable,
          bases: Array.from(element.querySelectorAll(".katex-html > .base"), base => {
            const rect = base.getBoundingClientRect();
            return { left: rect.left, right: rect.right };
          })
        };
      })
    );
    assert.equal(geometry.length, 35);
    for (const element of geometry) {
      assert.ok(element.client > 0 && element.fontSize >= 16 && element.endReachable, JSON.stringify(element));
      assert.ok(element.left >= 0 && element.right <= viewport.width, JSON.stringify(element));
      if (element.inputRight !== undefined) assert.ok(element.inputRight <= element.left);
      for (const base of element.bases) {
        assert.ok(base.left >= element.left - 1 && base.right <= element.left + element.scroll + 1);
        if (base.right > element.right + 1) assert.equal(element.overflow, "auto");
      }
    }
    assert.deepEqual(errors, []);
    const screenshot = path.join(output, `choices-${viewport.width}.png`);
    await page.screenshot({ path: screenshot, fullPage: true });
    if (viewport.width === 1440) fs.writeFileSync(path.join(output, "choices.html"), "<!DOCTYPE html>" + html);
    results.push({ view: "choices", viewport, dimensions, geometry,
      screenshot: { path: path.relative(repo, screenshot), sha256: hash(screenshot) }, status: "pass" });
    fs.writeFileSync(resultPath, JSON.stringify({
      lesson: id, browser: "headless isolated Chromium", offline: true,
      draft: { path: path.relative(repo, draftPath), sha256: hash(draftPath) }, results, status: "partial"
    }, null, 2) + "\n");
    await context.close();
  }
  fs.writeFileSync(resultPath, JSON.stringify({
    lesson: id, browser: "headless isolated Chromium", offline: true,
    draft: { path: path.relative(repo, draftPath), sha256: hash(draftPath) }, results, status: "pass",
    scope: "Only missing choice display; existing prose/written display is not rerun"
  }, null, 2) + "\n");
  console.log(JSON.stringify({ lesson: id, views: results.length, status: "pass", output }));
} catch (error) {
  fs.writeFileSync(resultPath, JSON.stringify({
    lesson: id, draft: { path: path.relative(repo, draftPath), sha256: hash(draftPath) },
    results, status: "fail", error: error.stack
  }, null, 2) + "\n");
  throw error;
} finally {
  await browser.close();
}

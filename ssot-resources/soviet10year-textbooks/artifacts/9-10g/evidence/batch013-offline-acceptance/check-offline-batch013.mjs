import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { choiceHtml } from "../../../../.claude/skills/ld-s10y-lesson/tools/choice_html.mjs";

const repo = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
assert.equal(process.cwd(), repo);
const appRequire = createRequire(path.join(repo, "app/package.json"));
const { chromium } = appRequire("playwright");
const contentRequire = createRequire(path.join(repo, ".claude/skills/ld-s10y-lesson/package.json"));
const { proseFlow } = contentRequire("./tools/htmlfrag.js");
const id = process.argv[2];
assert.ok(/^geo910-c1-s3-n(32|33|34|35)$/.test(id), "select one batch013 lesson");
const edition = path.join(repo, "ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral");
const lesson = JSON.parse(fs.readFileSync(path.join(edition, "lessons", id, "lesson.json")));
const exercises = JSON.parse(fs.readFileSync(path.join(edition, "lessons", id, "exercises.json")));
const rendered = path.join(repo, ".tmp/ld-s10y-lesson/render/9-10g/modern-us-neutral", id);
const draft = JSON.parse(fs.readFileSync(path.join(edition, "lessons", id, "choice-set", "draft.json")));
const output = path.join(repo, ".intentfold/tickets/STEMROBIN-184/tmp/offline-batch013", id);
fs.mkdirSync(path.dirname(output), { recursive: true });
const resume = process.argv.includes("--resume");
const recheckIndex = process.argv.indexOf("--recheck");
const rechecks = new Set(recheckIndex < 0 ? [] : process.argv[recheckIndex + 1].split(","));
assert.ok(!rechecks.size || resume, "affected checks require preserved prior evidence and resume");
for (const key of rechecks) assert.ok(/^(text|exercises|choices):(1440|390)$/.test(key));
const resultPath = path.join(output, "result.json");
if (!resume) fs.mkdirSync(output, { recursive: false });
const results = resume && fs.existsSync(resultPath)
  ? JSON.parse(fs.readFileSync(resultPath)).results.filter(result =>
    !rechecks.has(`${result.view}:${result.viewport.width}`)) : [];
assert.ok(!resume || fs.existsSync(output), "resume only the actual interrupted check");
const browser = await chromium.launch({ headless: false });
try {
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport });
    await context.setOffline(true);
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => {
      if (message.type() === "error") errors.push(message.text());
    });
    for (const view of ["text", "exercises", "choices"]) {
      if (results.some(result => result.view === view && result.viewport.width === viewport.width
        && result.status === "pass")) continue;
      const file = path.join(rendered, `${view === "choices" ? "exercises" : view}.html`);
      assert.ok(fs.existsSync(file), file);
      await page.goto(pathToFileURL(file).href);
      if (view === "choices") {
        const visible = draft.questions.map(({ view: question }, index) => {
          const figure = figureId => {
            const spec = JSON.parse(fs.readFileSync(path.join(edition, "figures", `${figureId}.spec.json`)));
            const svg = fs.readFileSync(path.join(edition, "figures", `${figureId}.svg`), "utf8")
              .replace(/<\?xml[^>]*\?>/, "");
            const maxWidth = spec.display.maxWidthPx;
            const style = maxWidth ? ` style="width:${maxWidth}px;max-width:100%"` : "";
            return `<figure class="fig" id="${figureId}" data-figure-layout="${spec.display.layout}" `
              + `data-figure-purpose="${spec.display.purpose}"><div class="figure-media"${style}>${svg}</div></figure>`;
          };
          return `<li class="ex" data-question="${index + 1}"><div class="no">${index + 1}.</div><div class="body">`
            + `<div>${choiceHtml(question.stem)}</div>${question.figure_ids.map(figure).join("")}`
            + `<fieldset><legend>${question.mode === "single" ? "单选" : "多选"}</legend>`
            + question.options.map((option, optionIndex) =>
              `<label style="display:block"><input type="${question.mode === "single" ? "radio" : "checkbox"}" `
              + `name="question-${index}" value="${optionIndex}"> ${choiceHtml(option.text)}</label>`
              + option.figure_ids.map(figure).join("")).join("")
            + "</fieldset></div></li>";
        }).join("");
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
          content: ".choice-projection>li.ex{grid-template-columns:minmax(0,1fr)}",
        });
        if (viewport.width === 1440) {
          fs.writeFileSync(path.join(output, "choices.html"),
            "<!DOCTYPE html>" + await page.evaluate(() => document.documentElement.outerHTML));
        }
      }
      await page.evaluate(() => document.fonts.ready);
      await page.locator("h1").waitFor({ state: "visible" });
      assert.ok((await page.locator("h1").innerText()).includes(id.match(/\d+$/)[0]));
      assert.equal(await page.locator(".err,.katex-error").count(), 0);
      const dimensions = await page.evaluate(() => ({
        client: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
      }));
      assert.ok(dimensions.scroll <= dimensions.client + 1, JSON.stringify(dimensions));
      if (view === "text") {
        const expected = proseFlow(lesson.prose, lesson.section_breaks)
          .filter(block => !["fig", "cap"].includes(block.kind));
        const observed = await page.locator("p.para").evaluateAll(elements => {
          const text = node => {
            if (node.nodeType === Node.TEXT_NODE) return node.textContent;
            if (node.nodeType !== Node.ELEMENT_NODE) return "";
            if (node.matches(".katex")) {
              return `$${node.querySelector('annotation[encoding="application/x-tex"]').textContent}$`;
            }
            if (node.tagName === "BR") return "\n";
            return Array.from(node.childNodes, text).join("");
          };
          return elements.map(element => ({
            text: text(element).replace(/\s+/g, " ").trim(),
            section: element.classList.contains("section"),
            indent: getComputedStyle(element).textIndent,
          }));
        });
        assert.equal(observed.length, expected.length);
        for (let index = 0; index < expected.length; index++) {
          assert.equal(observed[index].text, expected[index].text
            .replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\s+/g, " ").trim());
          assert.equal(observed[index].section, Boolean(expected[index].sectionBreak));
          assert.equal(observed[index].indent, "0px");
        }
      } else if (view === "exercises") {
        assert.equal(await page.locator("li.ex").count(), exercises.count);
        const numbers = await page.locator("li.ex .no").evaluateAll(elements =>
          elements.map(element => element.querySelector(".katex-html")?.textContent ?? element.innerText));
        assert.deepEqual(numbers.map(text => text.replace(/\D/g, "")),
          exercises.exercises.map(exercise => String(exercise.source_number)));
        for (const number of await page.locator("li.ex .no .nb").evaluateAll(elements =>
          elements.map(element => {
            const label = element.getBoundingClientRect();
            const body = element.closest("li.ex").querySelector(".body").getBoundingClientRect();
            return { scroll: element.scrollWidth, client: element.clientWidth,
              overflow: getComputedStyle(element).overflowX, right: label.right, bodyLeft: body.left };
          }))) {
          assert.equal(number.overflow, "visible", JSON.stringify(number));
          assert.ok(number.right <= number.bodyLeft, JSON.stringify(number));
        }
        if (id.endsWith("n35")) {
          const formulas = await page.locator('annotation[encoding="application/x-tex"]').allTextContents();
          assert.ok(formulas.includes("|AB|=\\sqrt{m^2+d^2+n^2\\pm2mn\\cos\\varphi}"));
        }
      } else {
        assert.equal(await page.locator("li.ex").count(), draft.questions.length);
        for (let index = 0; index < draft.questions.length; index++) {
          const question = draft.questions[index].view;
          const inputs = page.locator(`[data-question="${index + 1}"] input`);
          assert.equal(await inputs.count(), question.options.length);
          await inputs.nth(0).check();
          await inputs.nth(1).check();
          assert.equal(await inputs.nth(0).isChecked(), question.mode === "multiple");
          assert.equal(await inputs.nth(1).isChecked(), true);
          if (question.mode === "multiple") await inputs.nth(0).uncheck();
        }
        const html = await page.content();
        for (const field of ["source_solution", "seed_sha256", "rationales", "correct_index"]) {
          assert.ok(!html.includes(field), `internal field leaked: ${field}`);
        }
      }
      if (view !== "choices") {
        const expectedIds = view === "text"
          ? proseFlow(lesson.prose, lesson.section_breaks).filter(block => block.kind === "fig").map(block => block.id)
          : exercises.exercises.flatMap(exercise => exercise.figures || []).map(figure => figure.id);
        assert.deepEqual(await page.locator("figure.fig").evaluateAll(elements => elements.map(element => element.id)),
          expectedIds);
      }
      const figures = await page.locator("figure.fig").evaluateAll(elements => elements.map(element => ({
        id: element.id,
        visible: element.getBoundingClientRect().width > 0,
        svg: element.querySelectorAll("svg").length,
      })));
      for (const figure of figures) {
        assert.ok(figure.visible && figure.svg === 1, JSON.stringify(figure));
        const spec = JSON.parse(fs.readFileSync(path.join(edition, "figures", `${figure.id}.spec.json`)));
        const observed = await page.locator(`figure#${figure.id}`).first().evaluate(element => {
          const svg = element.querySelector("svg");
          const matrix = svg.getScreenCTM();
          const scale = Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b);
          const labels = Array.from(svg.querySelectorAll("text"), text => ({
            text: text.textContent,
            size: Number.parseFloat(getComputedStyle(text).fontSize) * scale,
          }));
          element.scrollLeft = element.scrollWidth - element.clientWidth;
          return {
            labels,
            width: svg.getBoundingClientRect().width,
            height: svg.getBoundingClientRect().height,
            endReachable: element.scrollLeft + element.clientWidth >= element.scrollWidth - 1,
          };
        });
        assert.ok(observed.width > 0 && observed.height > 0);
        if (spec.display.layout === "scroll") {
          assert.ok(Math.abs(observed.width - 640) < 1, JSON.stringify(observed));
        }
        assert.ok(observed.endReachable, figure.id);
        assert.ok(observed.labels.length > 0, figure.id);
        for (const label of observed.labels) {
          assert.ok(label.size >= spec.display.minTextPx - 0.1, JSON.stringify(label));
        }
      }
      const screenshot = path.join(output, `${view}-${viewport.width}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      assert.deepEqual(errors, []);
      if (view === "text" || view === "exercises") {
        await page.locator("a.jump").click();
        assert.ok(page.url().endsWith(view === "text" ? "exercises.html" : "text.html"));
        await page.locator("h1").waitFor({ state: "visible" });
      }
      results.push({ view, viewport, figures, dimensions, screenshot, status: "pass" });
      fs.writeFileSync(path.join(output, "result.json"), JSON.stringify({
        lesson: id, browser: "headed isolated Chromium", offline: true,
        results, errors, status: "partial",
      }, null, 2) + "\n");
    }
    assert.deepEqual(errors, []);
    await context.close();
  }
  fs.writeFileSync(path.join(output, "result.json"), JSON.stringify({
    lesson: id, browser: "headed isolated Chromium", offline: true,
    results, status: "pass",
  }, null, 2) + "\n");
  console.log(JSON.stringify({ lesson: id, views: results.length, status: "pass", output }));
} catch (error) {
  fs.writeFileSync(resultPath, JSON.stringify({
    lesson: id, browser: "headed isolated Chromium", offline: true,
    results, status: "fail", error: error.stack,
  }, null, 2) + "\n");
  throw error;
} finally {
  await browser.close();
}

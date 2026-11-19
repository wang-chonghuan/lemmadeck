import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const repo = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
assert.equal(process.cwd(), repo);
const { chromium } = createRequire(path.join(repo, "app/package.json"))("playwright");
const { proseFlow } = createRequire(path.join(repo, ".claude/skills/ld-s10y-lesson/package.json"))("./tools/htmlfrag.js");
const id = "geo68-c1-s14";
const edition = path.join(repo, "ssot-resources/soviet10year-textbooks/artifacts/6-8g/editions/modern-us-neutral");
const lessonPath = path.join(edition, "lessons", id, "lesson.json");
const lesson = JSON.parse(fs.readFileSync(lessonPath));
const exercises = JSON.parse(fs.readFileSync(path.join(edition, "lessons", id, "exercises.json")));
const rendered = path.join(repo, ".tmp/ld-s10y-lesson/render/6-8g/modern-us-neutral", id);
const output = path.join(repo, ".intentfold/tickets/STEMROBIN-184/tmp/offline-batch015", id);
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const results = [];
const resume = process.argv.includes("--resume");
const resultPath = path.join(output, "result.json");
fs.mkdirSync(path.dirname(output), { recursive: true });
if (resume) {
  const prior = JSON.parse(fs.readFileSync(resultPath));
  assert.equal(prior.lesson_sha256, hash(lessonPath));
  results.push(...prior.results.filter(result => result.status === "pass"));
} else {
  fs.mkdirSync(output);
}
assert.equal(exercises.exercises.length, 0);
const browser = await chromium.launch({ headless: true });
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
    for (const view of ["text", "exercises"]) {
      if (results.some(result => result.view === view && result.viewport.width === viewport.width)) continue;
      const file = path.join(rendered, `${view}.html`);
      await page.goto(pathToFileURL(file).href);
      await page.evaluate(() => document.fonts.ready);
      await page.locator("h1").waitFor({ state: "visible" });
      assert.ok((await page.locator("h1").innerText()).includes("几何学的历史简述"));
      assert.equal(await page.locator(".err,.katex-error").count(), 0);
      const dimensions = await page.evaluate(() => ({
        client: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth
      }));
      assert.ok(dimensions.scroll <= dimensions.client + 1, JSON.stringify(dimensions));
      const expected = proseFlow(lesson.prose, lesson.section_breaks);
      if (view === "text") {
        const paragraphs = expected.filter(block => !["fig", "cap"].includes(block.kind));
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
            indent: getComputedStyle(element).textIndent
          }));
        });
        assert.equal(observed.length, paragraphs.length);
        for (let index = 0; index < paragraphs.length; index++) {
          assert.equal(observed[index].text, paragraphs[index].text.replace(/\s+/g, " ").trim());
          assert.equal(observed[index].section, Boolean(paragraphs[index].sectionBreak));
          assert.equal(observed[index].indent, "0px");
        }
      } else {
        assert.equal(await page.locator("li.ex").count(), 0);
      }
      const expectedFigures = view === "text"
        ? expected.filter(block => block.kind === "fig").map(block => block.id) : [];
      assert.deepEqual(await page.locator("figure.fig").evaluateAll(elements => elements.map(element => element.id)), expectedFigures);
      const figureGeometry = [];
      for (const figureId of expectedFigures) {
        const spec = JSON.parse(fs.readFileSync(path.join(edition, "figures", `${figureId}.spec.json`)));
        const observed = await page.locator(`figure#${figureId}`).evaluate(element => {
          const media = element.querySelector("svg,img");
          const rect = media.getBoundingClientRect();
          const svg = element.querySelector("svg");
          const labels = svg ? Array.from(svg.querySelectorAll("text"), text => {
            const matrix = svg.getScreenCTM();
            const scale = Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b);
            return { text: text.textContent, size: Number.parseFloat(getComputedStyle(text).fontSize) * scale };
          }) : [];
          const images = Array.from(element.querySelectorAll("img"), image => ({
            complete: image.complete, width: image.naturalWidth, height: image.naturalHeight
          }));
          const before = element.scrollLeft;
          element.scrollLeft = element.scrollWidth - element.clientWidth;
          const endReachable = element.scrollLeft + element.clientWidth >= element.scrollWidth - 1;
          element.scrollLeft = before;
          return { width: rect.width, height: rect.height, labels, images, endReachable };
        });
        assert.ok(observed.width > 0 && observed.height > 0 && observed.endReachable, figureId);
        for (const image of observed.images) assert.ok(image.complete && image.width > 0 && image.height > 0);
        for (const label of observed.labels) {
          assert.ok(label.size >= spec.display.minTextPx - 0.1, JSON.stringify({ figureId, label }));
        }
        figureGeometry.push({ id: figureId, ...observed });
      }
      const screenshot = path.join(output, `${view}-${viewport.width}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      assert.deepEqual(errors, []);
      await page.locator("a.jump").click();
      assert.ok(page.url().endsWith(view === "text" ? "exercises.html" : "text.html"));
      await page.locator("h1").waitFor({ state: "visible" });
      results.push({ view, viewport, dimensions, figureGeometry,
        screenshot: { path: path.relative(repo, screenshot), sha256: hash(screenshot) }, status: "pass" });
      fs.writeFileSync(resultPath, JSON.stringify({
        lesson: id, lesson_sha256: hash(lessonPath), browser: "headless isolated Chromium",
        offline: true, choice_stage: "not_applicable", results, status: "partial"
      }, null, 2) + "\n");
    }
    assert.deepEqual(errors, []);
    await context.close();
  }
  fs.writeFileSync(resultPath, JSON.stringify({
    lesson: id, lesson_sha256: hash(lessonPath), browser: "headless isolated Chromium",
    offline: true, choice_stage: "not_applicable", results, status: "pass",
    qualification: "Scoped offline candidate display, not headed live-product acceptance"
  }, null, 2) + "\n");
  console.log(JSON.stringify({ lesson: id, views: results.length, status: "pass", output }));
} catch (error) {
  fs.writeFileSync(resultPath, JSON.stringify({
    lesson: id, lesson_sha256: hash(lessonPath), browser: "headless isolated Chromium",
    offline: true, results, status: "fail", error: error.stack
  }, null, 2) + "\n");
  throw error;
} finally {
  await browser.close();
}

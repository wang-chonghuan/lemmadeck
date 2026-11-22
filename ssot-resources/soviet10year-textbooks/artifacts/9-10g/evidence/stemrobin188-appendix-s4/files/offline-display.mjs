import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { choiceHtml } from "../../../../.claude/skills/ld-s10y-lesson/tools/choice_html.mjs";

const root = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
assert.equal(fs.realpathSync(process.cwd()), root);
const requireApp = createRequire(path.join(root, "app/package.json"));
const { chromium } = requireApp("playwright");
const scrollOnly = process.argv.includes("--scroll-only");
const textOnly = process.argv.includes("--text-only");
const surfacesOnly = process.argv.includes("--surfaces-only") || textOnly;
const layoutRepair = process.argv.includes("--layout-repair-01");
const renderWorkArgument = process.argv.find(value => value.startsWith("--render-work="));
const renderWork = renderWorkArgument
  ? path.resolve(renderWorkArgument.slice("--render-work=".length))
  : path.join(root, ".tmp/ld-s10y-lesson");
assert.ok(renderWork.startsWith(path.join(root, ".tmp") + path.sep)
  || renderWork.startsWith(path.join(root, ".intentfold/tickets/STEMROBIN-188/tmp") + path.sep));
const choicesOnly = process.argv.includes("--choices-only");
const recovery = process.argv.includes("--recovery-01");
assert.ok(!(surfacesOnly && choicesOnly));
assert.ok(!layoutRepair || textOnly);
const kinds = textOnly ? ["text"] : surfacesOnly ? ["text", "exercises"]
  : choicesOnly ? ["choices"] : ["text", "exercises", "choices"];
const targets = process.argv.slice(2).filter(value =>
  !value.startsWith("--render-work=") && !["--scroll-only", "--surfaces-only", "--choices-only", "--recovery-01",
    "--text-only", "--layout-repair-01"].includes(value)).map(value => {
  const [book, lesson] = value.split(":");
  assert.ok(["6-8g", "9-10g"].includes(book) && /^[a-z0-9-]+$/.test(lesson));
  return { book, lesson };
});
assert.ok(targets.length);
const output = path.join(root, ".intentfold/tickets/STEMROBIN-188/tmp",
  `offline-display-${targets.map(target => `${target.book}_${target.lesson}`).join("--")}`
    + (surfacesOnly ? "-surfaces" : choicesOnly ? "-choices" : "")
    + (layoutRepair ? "-layout-repair-01" : "")
    + (recovery ? "-repair-01" : ""));
if (recovery) {
  assert.ok(choicesOnly && !scrollOnly);
  const firstFailure = JSON.parse(fs.readFileSync(
    path.join(output.replace(/-repair-01$/, ""), "first-failure.json"), "utf8"));
  assert.notEqual(firstFailure.exitCode, 0);
}
if (scrollOnly) assert.ok(fs.existsSync(path.join(output, "result.json")));
else fs.mkdirSync(output);
const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const json = file => JSON.parse(fs.readFileSync(file, "utf8"));
const htmlText = text => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const target of targets) {
    const { book, lesson } = target;
    const resource = path.join(root, "ssot-resources/soviet10year-textbooks/artifacts",
      book, "editions/modern-us-neutral/lessons", lesson);
    const rendered = path.join(renderWork, "render", book,
      "modern-us-neutral", lesson);
    if (!surfacesOnly) {
      const review = json(path.join(resource, "choice-set/review.json"));
      assert.equal(review.outcome, "pass");
    }
    const sourceLesson = json(path.join(resource, "lesson.json"));
    const sourceExercises = json(path.join(resource, "exercises.json"));
    const draft = surfacesOnly ? { questions: [], new_figures: [] }
      : json(path.join(resource, "choice-set/draft.json"));
    const seed = surfacesOnly ? { figures: [] }
      : json(path.join(resource, "choice-set/seed.json"));
    const views = draft.questions.map(question => question.view);
    if (!surfacesOnly) assert.ok(views.length);
    assert.equal(draft.new_figures.length, 0);
    const figures = new Map(seed.figures.map(figure => [figure.id, figure]));
    const figureHtml = ids => ids.map(id => {
      const figure = figures.get(id);
      assert.ok(figure);
      const asset = figure.assets.find(asset => asset.path.endsWith(".svg"));
      assert.ok(asset, "This bounded preview uses the retained SVG rendition");
      const bytes = fs.readFileSync(path.join(root, asset.path));
      assert.equal(sha(bytes), asset.sha256);
      const svg = bytes.toString("utf8").replace(/<\?xml[^>]*\?>/, "");
      const spec = json(path.join(resource, "../../figures", `${id}.spec.json`));
      assert.equal(spec.mode, "deterministic");
      const display = spec.display;
      const width = display.layout === "scroll" ? 640 : display.maxWidthPx;
      const style = width ? ` style="width:${width}px;max-width:${
        display.layout === "scroll" ? "none" : "100%"}"` : "";
      return `<figure class="fig" id="${htmlText(id)}" data-figure-layout="${
        display.layout}" aria-label="${htmlText(figure.label || id)}">`
        + `<div class="figure-media"${style}>${svg}</div></figure>`;
    }).join("");
    const targetOutput = path.join(output, lesson);
    if (!scrollOnly) fs.mkdirSync(targetOutput);
    const viewports = scrollOnly ? [{ width: 390, height: 844 }]
      : [{ width: 1440, height: 960 }, { width: 390, height: 844 }];
    for (const viewport of viewports) {
      const context = await browser.newContext({ viewport });
      await context.route(/^https?:/, route => route.abort());
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      for (const kind of kinds) {
        if (kind !== "choices") {
          await page.goto(pathToFileURL(path.join(rendered, `${kind}.html`)).href);
        } else {
          await page.goto(pathToFileURL(path.join(rendered, "text.html")).href);
          const css = await page.locator("head > style").textContent();
          const body = views.map((view, index) => {
            const options = view.options.map(option =>
              `<label class="choice-option"><input type="${view.mode === "single" ? "radio" : "checkbox"}" `
              + `name="question-${index}"><span class="choice-letter">${htmlText(option.id)}</span>`
              + `<span class="choice-content">${choiceHtml(option.text)}`
              + `${figureHtml(option.figure_ids)}</span></label>`).join("");
            return `<section class="choice-question"><div class="choice-stem">`
              + `${choiceHtml(view.stem)}${figureHtml(view.figure_ids)}</div>${options}</section>`;
          }).join("");
          await page.setContent(`<!doctype html><meta charset="utf-8">`
            + `<meta name="viewport" content="width=device-width,initial-scale=1">`
            + `<title>${htmlText(sourceLesson.title)}</title><style>${css}
              .choice-question{padding:1.2em 0;border-bottom:1px solid #ddd}
              .choice-stem{font-size:17px;line-height:1.9;margin-bottom:12px}
              .choice-option{display:flex;align-items:flex-start;gap:8px;margin:12px 0;
                font-size:16px;line-height:1.8;min-width:0}
              .choice-option input{flex:none;margin:8px 0 0;width:16px;height:16px}
              .choice-letter{flex:none;font-family:KaTeX_Main,serif}
              .choice-content{min-width:0;flex:1;overflow-x:auto}
              table{border-collapse:collapse;width:100%;font-size:16px}
              th,td{border:1px solid #ccc;padding:8px;text-align:left;vertical-align:top}
              .choice-content p{margin:0}
              </style><main class="sheet"><h1>${choiceHtml(sourceLesson.title)}</h1>${body}</main>`);
        }
        await page.evaluate(() => document.fonts.ready);
        if (scrollOnly) {
          const endpoints = await page.locator('figure[data-figure-layout="scroll"]')
            .evaluateAll(nodes => nodes.map(node => {
              node.scrollLeft = node.scrollWidth;
              const viewport = node.getBoundingClientRect();
              const svg = node.querySelector("svg").getBoundingClientRect();
              return {
                id: node.id,
                clientWidth: node.clientWidth,
                scrollWidth: node.scrollWidth,
                scrollLeft: node.scrollLeft,
                rightEdge: svg.right,
                viewportRight: viewport.right,
              };
            }));
          assert.ok(endpoints.length);
          for (const endpoint of endpoints) {
            assert.ok(Math.abs(endpoint.scrollLeft + endpoint.clientWidth
              - endpoint.scrollWidth) <= 1);
            assert.ok(Math.abs(endpoint.rightEdge - endpoint.viewportRight) <= 1);
          }
          const screenshot = path.join(targetOutput, `${kind}-right-390.png`);
          assert.equal(fs.existsSync(screenshot), false);
          await page.screenshot({ path: screenshot, fullPage: true });
          results.push({ ...target, kind, viewport, endpoints, screenshot,
            screenshotSha256: sha(fs.readFileSync(screenshot)),
            status: "scroll right endpoints reached; prior non-scroll display checks reused" });
          continue;
        }
        assert.equal(await page.locator(".err, .katex-error").count(), 0);
        if (kind === "exercises") {
          assert.equal(await page.locator("li.ex").count(), sourceExercises.count);
        }
        if (kind === "choices") {
          assert.equal(await page.locator(".choice-question").count(), views.length);
          assert.equal(await page.locator("input").count(),
            views.reduce((total, view) => total + view.options.length, 0));
          const first = page.locator("input").first();
          await first.check();
          assert.equal(await first.isChecked(), true);
          await page.locator("input").last().scrollIntoViewIfNeeded();
          assert.equal(await page.locator("input").last().isVisible(), true);
          await page.evaluate(() => window.scrollTo(0, 0));
        }
        const layout = await page.evaluate(() => {
          const widths = [...document.querySelectorAll(".figure-media")].map(node =>
            ({ id: node.closest("figure").id, width: node.getBoundingClientRect().width }));
          const svgText = [...document.querySelectorAll(".figure-media svg text")].map(node => {
            const svg = node.ownerSVGElement;
            const scale = svg.getBoundingClientRect().width / svg.viewBox.baseVal.width;
            return Number.parseFloat(getComputedStyle(node).fontSize) * scale;
          });
          return {
            viewport: innerWidth,
            documentWidth: document.documentElement.scrollWidth,
            titleWidth: document.querySelector("h1").getBoundingClientRect().width,
            figures: widths,
            minFigureTextPx: svgText.length ? Math.min(...svgText) : null,
          };
        });
        assert.ok(layout.documentWidth <= viewport.width + 1,
          `${lesson}/${kind}: document overflows`);
        if (layout.minFigureTextPx !== null) {
          assert.ok(layout.minFigureTextPx >= 16, `${lesson}/${kind}: small figure text`);
        }
        assert.deepEqual(errors, []);
        const screenshot = path.join(targetOutput, `${kind}-${viewport.width}.png`);
        await page.screenshot({ path: screenshot, fullPage: true });
        results.push({ ...target, kind, viewport, layout, screenshot,
          screenshotSha256: sha(fs.readFileSync(screenshot)),
          questionCount: kind === "choices" ? views.length : null,
          sourceHashes: Object.fromEntries((surfacesOnly ? ["lesson.json", "exercises.json"]
            : ["lesson.json", "exercises.json",
              "choice-set/seed.json", "choice-set/draft.json", "choice-set/review.json"])
            .map(file => [file, sha(fs.readFileSync(path.join(resource, file)))])),
          status: "mechanical display pass; visual inspection pending" });
      }
      await context.close();
    }
  }
} finally {
  await browser.close();
  fs.writeFileSync(path.join(output, scrollOnly ? "scroll-result.json" : "result.json"), JSON.stringify({
    headless: true, offline: true, results,
  }, null, 2));
}
console.log(JSON.stringify({ output, observations: results.length }, null, 2));

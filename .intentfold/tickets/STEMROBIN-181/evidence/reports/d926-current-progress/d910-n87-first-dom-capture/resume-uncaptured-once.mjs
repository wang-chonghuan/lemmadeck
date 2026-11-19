import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { chromium } from "/Users/yong/.codex/worktrees/00b1/lemmadeck/app/node_modules/playwright/index.mjs";
import { choiceHtml } from "/Users/yong/.codex/worktrees/00b1/lemmadeck/.claude/skills/ld-s10y-lesson/tools/choice_html.mjs";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const tmp = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp");
const root = path.join(tmp, "d910-n87-first-dom-capture");
const nativeRoot = path.join(tmp, "d900-n87-first-bilingual-native");
const bindingRoot = path.join(tmp, "d909-n87-native-choice-binding");
const require = createRequire(path.join(repo, ".claude/skills/ld-s10y-lesson/tools/htmlfrag.js"));
const { inline, proseFlow } = require("./htmlfrag.js");
const card = "phy10-c2-s3-n87";
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const bind = (file) => ({ path: file, sha256: sha(fs.readFileSync(file)) });
const protectedFiles = new Map();
const viewports = [{ width: 1440, height: 960 }, { width: 390, height: 844 }];
const report = read(path.join(root, "capture-report.json"));
report.status = "FIRST-OFFLINE-DOM-CAPTURE-TECHNICAL-RECOVERY";
report.browser.closed = false;
report.technicalRecovery = {
  firstFailure: bind(path.join(root, "FIRST-failure.json")),
  firstReport: bind(path.join(root, "report.json")),
  firstHarness: bind(path.join(root, "capture-once.mjs")),
  diagnosis: bind(path.join(root, "overflow-diagnosis.json")),
  dimensionFailure: bind(path.join(root, "recovery-failure.json")),
  dimensionFailureReport: bind(path.join(root, "recovery-report.json")),
  inlineWrapperFailure: bind(path.join(root, "capture-completion-failure.json")),
  inlineWrapperFailureReport: bind(path.join(root, "capture-report.json")),
  inlineWrapperDiagnosis: "htmlfrag uses sr-nb; the native offline renderer uses nb. Compare browser-normalized HTML with only this known layout class normalized on the expected original written prose. No source prose, math, HTML evidence, selector or substantive review is changed.",
  dimensionDiagnosis: "Headed Chrome reserves a 15px vertical scrollbar. Full-page PNG width is the measured document scrollWidth, while the requested viewport remains 1440/390. Reuse the saved zh desktop text PNG without any screenshot replay.",
  contentChanged: false, passedSurfacesReplayed: false, screenshotReplays: 0,
  diagnosisSummary: "Native n_{\\text{膜}} has a zero-width KaTeX vlist-s layout spacer, not overflowing text. Exempt only spacer-accounted overflow with every nonblank visible text range inside its wrapper. Real content overflow still fails.",
  commands: [
    { command: ["node", path.join(root, "capture-once.mjs")], cwd: repo, exit: 1 },
    { command: ["node", path.join(root, "diagnose-first-overflow.mjs")], cwd: repo, exit: 0 },
    { command: ["node", path.join(root, "recovery-once.mjs")], cwd: repo, exit: 1 },
    { command: ["node", path.join(root, "complete-capture-once.mjs")], cwd: repo, exit: 1 },
  ],
};
assert.equal(report.checks.length, 2);
assert.equal(report.screenshots.length, 2);
assert.equal(process.cwd(), repo);
function write(file, value) {
  assert.ok(path.resolve(file).startsWith(`${root}/`));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, typeof value === "string" ? value : `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
}
function protect(file) {
  const binding = bind(file);
  protectedFiles.set(file, binding.sha256);
  return binding;
}
function copyExact(source, destination) {
  const before = protect(source);
  assert.ok(path.resolve(destination).startsWith(`${root}/`));
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  if (!fs.existsSync(destination)) fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL);
  assert.equal(bind(destination).sha256, before.sha256);
  return before;
}
function listFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(file) : [file];
  }).sort();
}
function freeze() {
  const manifest = listFiles(root).map((file) => ({ ...bind(file), relativePath: path.relative(root, file) }));
  write(path.join(root, "final-freeze.json"), {
    schema: "d910-freeze-v1", timestamp: new Date().toISOString(), files: manifest,
    report: bind(path.join(root, "final-report.json")), readonlyFiles: true,
    excludes: ["final-freeze.json", "SHA256SUMS-final"], visualPassClaimed: false,
  });
  write(path.join(root, "SHA256SUMS-final"), listFiles(root).map((file) =>
    `${bind(file).sha256}  ${path.relative(root, file)}`).join("\n") + "\n");
  for (const file of listFiles(root)) fs.chmodSync(file, 0o444);
}
function pngDimensions(file) {
  const data = fs.readFileSync(file);
  assert.equal(data.subarray(1, 4).toString(), "PNG");
  return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
}
function recipe(screenshot, region, label, criterion) {
  const dimensions = screenshot.dimensions;
  const x = Math.max(0, Math.floor(region.x));
  const y = Math.max(0, Math.floor(region.y));
  return {
    id: `${screenshot.locale}-${screenshot.surface}-${screenshot.viewport.width}-${label}`,
    source: { path: screenshot.path, sha256: screenshot.sha256 },
    crop: {
      left: x, top: y,
      width: Math.min(dimensions.width - x, Math.ceil(region.width)),
      height: Math.min(dimensions.height - y, Math.ceil(region.height)),
    },
    criterion, locale: screenshot.locale, surface: screenshot.surface, viewport: screenshot.viewport,
    countsAsOneLoadedImage: true, notMaterializedOrOpenedByThisAgent: true,
  };
}
write(path.join(root, "resume-uncaptured-started.json"), report);
let browser;
let currentAttempt;
try {
  const native = read(path.join(nativeRoot, "report.json"));
  report.native = protect(path.join(nativeRoot, "report.json"));
  assert.equal(native.status, "FIRST-BILINGUAL-NATIVE-PASS");
  const bindings = read(path.join(bindingRoot, "report.json"));
  report.choiceBindings = protect(path.join(bindingRoot, "report.json"));
  assert.equal(bindings.binding, "PASS");
  report.patternCodeOnly = protect(path.join(tmp, "d852-n71-first-dom-capture/FIRST-capture-harness.mjs"));
  report.reusedRenderingCode = [
    protect(path.join(repo, ".claude/skills/ld-s10y-lesson/tools/htmlfrag.js")),
    protect(path.join(repo, ".claude/skills/ld-s10y-lesson/tools/choice_html.mjs")),
  ];
  browser = await chromium.launch({ channel: "chrome", headless: false });
  report.browser.version = browser.version();
  const context = await browser.newContext({ viewport: viewports[0], deviceScaleFactor: 1 });
  const networkAttempts = [];
  await context.route(/https?:\/\//, (route) => {
    networkAttempts.push(route.request().url());
    return route.abort();
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push({ kind: "pageerror", message: String(error) }));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push({ kind: "console", message: message.text() });
  });
  page.on("requestfailed", (request) => errors.push({
    kind: "requestfailed", url: request.url(), message: request.failure()?.errorText,
  }));
  const crops = [];
  for (const check of report.checks) {
    const screenshot = check.screenshot;
    for (let y = 0, index = 0; y < screenshot.dimensions.height; y += check.viewport.height, index++) {
      crops.push(recipe(screenshot, { x: 0, y, width: check.viewport.width,
        height: Math.min(check.viewport.height, screenshot.dimensions.height - y) },
      `coverage-${index + 1}`, "Full top-to-bottom visual coverage at native CSS-pixel scale"));
    }
    for (const figure of check.dom.figures) {
      crops.push(recipe(screenshot, {
        x: Math.max(0, figure.x - 16), y: Math.max(0, figure.y - 16),
        width: figure.width + 32, height: figure.height + 72,
      }, figure.id, "Current fig201/202 actual pixels: label readability, geometry/label relationship and composition; DOM is not visual proof"));
    }
  }
  for (const locale of ["zh", "en"]) {
    const packet = native.outputs[locale];
    for (const phase of ["adapt", "render", "answers", "interactionPrepare", "interactions"]) {
      assert.equal(packet[phase], true);
    }
    const lesson = read(path.join(packet.target, "lesson.json"));
    const exercises = read(path.join(packet.target, "exercises.json"));
    const answers = read(path.join(packet.target, "answer-keys.json"));
    const figures = read(path.join(packet.target, "figures.json")).figures;
    const viewFile = bindings.outputs[locale].clientViews.path;
    const views = read(viewFile);
    assert.equal(lesson.id, card);
    assert.equal(lesson.locale, locale);
    assert.equal(exercises.exercises.length, 6);
    assert.equal(answers.answers.length, 6);
    assert.equal(views.length, 6);
    assert.equal(views.reduce((count, view) => count + view.options.length, 0), 26);
    const numbers = exercises.exercises.map((exercise) => exercise.number);
    assert.deepEqual(numbers, ["1", "2", "3", "4", "5", "6"]);
    assert.deepEqual(answers.answers.map((answer) => answer.exercise), numbers);
    for (const answer of answers.answers) {
      assert.equal(answer.grading, "ungraded");
      assert.deepEqual(answer.parts, []);
      assert.equal(typeof answer.displayAnswer, "string");
      assert.ok(answer.displayAnswer.length > 0);
    }
    for (const view of views) {
      assert.deepEqual(Object.keys(view).sort(), ["figure_ids", "mode", "options", "stem"]);
      assert.deepEqual(view.figure_ids, []);
      for (const option of view.options) assert.deepEqual(option.figure_ids, []);
    }
    const sources = {
      lesson: protect(path.join(packet.target, "lesson.json")),
      exercises: protect(path.join(packet.target, "exercises.json")),
      answers: protect(path.join(packet.target, "answer-keys.json")),
      interactions: protect(path.join(packet.target, "interactions.json")),
      figures: protect(path.join(packet.target, "figures.json")), clientViews: protect(viewFile),
    };
    const render = path.join(packet.work, "render/10p/modern-us-neutral", card);
    const surfaces = {};
    for (const surface of ["text", "exercises"]) {
      const file = path.join(root, locale, `${surface}.html`);
      const original = copyExact(path.join(render, `${surface}.html`), file);
      surfaces[surface] = file;
      if (!report.html.some((item) => item.locale === locale && item.surface === surface)) {
        report.html.push({ locale, surface, ...bind(file), original, byteIdentical: true });
      }
    }

    const expectedProse = proseFlow(lesson.prose, lesson.section_breaks)
      .filter((block) => !["fig", "cap"].includes(block.kind)).map((block) => inline(block.text));
    const nativeExerciseHtml = exercises.exercises.map((exercise) => inline(exercise.text));
    const nativeAnswerHtml = answers.answers.map((answer) => inline(answer.displayAnswer));
    const viewHtml = views.map((view) => ({
      stem: choiceHtml(view.stem), mode: view.mode,
      options: view.options.map((option) => ({ label: option.id, html: choiceHtml(option.text) })),
    }));
    for (const surface of ["choices", "answers"]) {
      const existing = path.join(root, locale, `${surface}.html`);
      if (fs.existsSync(existing)) {
        assert.equal(bind(existing).sha256, report.html.find((item) => item.locale === locale && item.surface === surface).sha256);
        surfaces[surface] = existing;
        continue;
      }
      await page.setContent(fs.readFileSync(surfaces.exercises, "utf8"));
      await page.evaluate(() => document.fonts.ready);
      const baseTitle = locale === "en" ? lesson.title : lesson.printed_title || lesson.title;
      const label = locale === "en" ? surface === "choices" ? "Choices" : "Answers"
        : surface === "choices" ? "\u9009\u62e9\u9898" : "\u7b54\u6848";
      const title = `${baseTitle} | ${label}`;
      const content = surface === "choices" ? viewHtml.map((view, index) =>
        `<li class="ex" id="choice-${index + 1}" data-mode="${view.mode}"><div class="no">${index + 1}.</div><div class="body"><div class="prompt">${view.stem}</div><ol class="options">${view.options.map((option) =>
          `<li><span class="option-label">${option.label}.</span><div>${option.html}</div></li>`).join("")}</ol></div></li>`).join("")
        : answers.answers.map((answer, index) =>
          `<li class="ex" id="answer-${index + 1}" data-grading="ungraded" data-parts-count="0"><div class="no">${index + 1}.</div><div class="body"><div class="prompt">${nativeExerciseHtml[index]}</div><div class="answer">${nativeAnswerHtml[index]}</div></div></li>`).join("");
      await page.evaluate(({ locale, title, content }) => {
        document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
        document.title = title;
        const sheet = document.querySelector(".sheet");
        const heading = sheet.querySelector("h1");
        heading.textContent = title;
        for (const child of [...sheet.children]) if (child !== heading) child.remove();
        const list = document.createElement("ol");
        list.className = "ex";
        list.innerHTML = content;
        sheet.append(list);
        const style = document.createElement("style");
        style.textContent = ".answer{border-top:1px solid var(--rule);margin-top:.8em;padding-top:.8em}.options{list-style:none;margin:.7em 0 0;padding:0}.options>li{display:grid;grid-template-columns:1.8em minmax(0,1fr);gap:.4em;margin:.5em 0}.options>li>div{min-width:0;overflow-x:auto}.body .katex{font-size:1.1em}.prompt,.answer{min-width:0}.option-label{font-family:KaTeX_Main,serif}";
        document.head.append(style);
      }, { locale, title, content });
      const file = surfaces[surface] = path.join(root, locale, `${surface}.html`);
      write(file, await page.content());
      const html = fs.readFileSync(file, "utf8");
      if (surface === "choices") {
        assert.doesNotMatch(html, /seed_sha256|draft_sha256|source_numbers|source_number|source_solution|concept_blocks|question_ids|correct_index|rationales|independent_solution|data-source|phy10-c2-s3-n87|n87-u[1-6]/);
        assert.doesNotMatch(html, /<(?:script|input|textarea|math-field)\b/i);
      }
      report.html.push({
        locale, surface, ...bind(file), title, derivation: surface === "choices" ? "Only d909 question.view, native locale/title and native HTML shell" : "Six d900 native displayAnswer values and original native exercise prompts; no grading parts",
        sources,
      });
    }

    for (const surface of ["text", "exercises", "choices", "answers"]) {
      for (const viewport of viewports) {
        if (report.checks.some((check) => check.locale === locale && check.surface === surface && check.viewport.width === viewport.width)) continue;
        const name = `${locale}-${surface}-${viewport.width}`;
        currentAttempt = { locale, surface, viewport, html: bind(surfaces[surface]), timestamp: new Date().toISOString() };
        report.attempts.push(currentAttempt);
        write(path.join(root, "final-receipts", `${name}-started.json`), currentAttempt);
        await page.setViewportSize(viewport);
        await page.goto(pathToFileURL(surfaces[surface]).href, { waitUntil: "load" });
        await page.evaluate(() => document.fonts.ready);
        const dom = await page.evaluate(({ surface, expectedProse, nativeExerciseHtml, nativeAnswerHtml, viewHtml }) => {
          const rect = (node) => {
            const r = node.getBoundingClientRect();
            return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height };
          };
          const visible = (node) => {
            const r = node.getBoundingClientRect(), s = getComputedStyle(node);
            return r.width > 0 && r.height > 0 && s.display !== "none" && s.visibility !== "hidden";
          };
          const overlap = (a, b) => Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x) > 1
            && Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y) > 1;
          const textOnly = (html) => {
            const element = document.createElement("div");
            element.innerHTML = html;
            return element.textContent;
          };
          const normalizedHtml = (html, nativeLayout = false) => {
            const element = document.createElement("div");
            element.innerHTML = html;
            if (nativeLayout) {
              for (const wrapper of element.querySelectorAll(".sr-nb")) wrapper.className = "nb";
            }
            return element.innerHTML;
          };
          const regions = [...document.querySelectorAll("h1,.para,.fig,.figcap,.exgroup,li.ex,.jump")]
            .filter(visible).map((node, index) => ({ index, selector: node.id ? `#${node.id}` : node.className || node.tagName, ...rect(node) }));
          const siblingCollisions = [];
          for (const parent of [document.querySelector(".sheet"), ...document.querySelectorAll("ol.ex,.body,.options")]) {
            const children = [...parent.children].filter(visible);
            for (let i = 0; i < children.length; i++) {
              for (let j = i + 1; j < children.length; j++) {
                if (overlap(rect(children[i]), rect(children[j]))) siblingCollisions.push({
                  parent: parent.className, first: children[i].id || children[i].className || children[i].tagName,
                  second: children[j].id || children[j].className || children[j].tagName,
                });
              }
            }
          }
          for (const row of document.querySelectorAll("li.ex,.options>li")) {
            const children = [...row.children].filter(visible);
            if (children.length === 2 && overlap(rect(children[0]), rect(children[1]))) siblingCollisions.push({
              parent: row.id || row.className, first: children[0].className, second: children[1].className,
            });
          }
          const prose = [...document.querySelectorAll(".para")];
          const exerciseBodies = [...document.querySelectorAll("li.ex>.body")];
          const fontFaces = [...document.fonts].map((face) => ({
            family: face.family, style: face.style, weight: face.weight, status: face.status,
          }));
          const figureMeasurements = [...document.querySelectorAll(".fig")].map((node) => {
            const svg = node.querySelector("svg");
            const media = node.querySelector(".figure-media");
            const sr = rect(svg);
            const vb = svg.viewBox.baseVal;
            const labels = [...svg.querySelectorAll("text")].filter((text) => text.textContent.trim()).map((text) => {
              const matrix = text.getScreenCTM();
              return {
                text: text.textContent, ...rect(text),
                effectiveFontPx: parseFloat(getComputedStyle(text).fontSize) * Math.hypot(matrix.a, matrix.b),
              };
            });
            const labelCollisions = [];
            for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++) {
              if (overlap(labels[i], labels[j])) labelCollisions.push([labels[i].text, labels[j].text]);
            }
            return {
              id: node.id, ...sr, mediaWidth: rect(media).width, containerWidth: rect(node).width,
              declaredWidth: parseFloat(media.style.width), expectedWidth: Math.min(parseFloat(media.style.width), rect(node).width),
              viewBox: { x: vb.x, y: vb.y, width: vb.width, height: vb.height },
              minTextPx: Math.min(...labels.map((label) => label.effectiveFontPx)), labels, labelCollisions,
              labelsOutsideSvg: labels.filter((label) => label.x < sr.x - 1 || label.y < sr.y - 1
                || label.x + label.width > sr.x + sr.width + 1 || label.y + label.height > sr.y + sr.height + 1),
              geometry: svg.querySelectorAll("path,line,polygon,polyline,circle,ellipse,rect").length,
              outerSvg: svg.outerHTML,
            };
          });
          const textBlocks = [...document.querySelectorAll(".para,.prompt,.answer,.options>li>div,li.ex>.body")]
            .filter(visible);
          const inlineLineCollisions = [];
          for (let index = 0; index < textBlocks.length; index++) {
            const block = textBlocks[index];
            if (block.classList.contains("body") && block.querySelector(".prompt")) continue;
            const range = document.createRange();
            range.selectNodeContents(block);
            const fragments = [...range.getClientRects()].filter((r) => r.width > 0 && r.height > 0)
              .map((r) => ({ x: r.x, y: r.y, width: r.width, height: r.height }));
            const lines = [];
            for (const fragment of fragments) {
              const center = fragment.y + fragment.height / 2;
              if (!lines.some((line) => Math.abs(line.center - center) < 5)) lines.push({ center });
            }
            // KaTeX has nested intentional boxes; ordinary prose line height is checked separately.
            const style = getComputedStyle(block);
            if (parseFloat(style.lineHeight) < parseFloat(style.fontSize)) inlineLineCollisions.push(index);
          }
          const nonInkSpacerOverflows = [];
          const horizontalOverflows = [...document.querySelectorAll(".sheet,.para,li.ex,.body,.prompt,.answer,.options,.options>li>div,.fig,.figure-media,.nb,.sr-nb")]
            .filter(visible).filter((node) => node.scrollWidth > node.clientWidth + 1)
            .filter((node) => {
              const html = node.querySelector(".katex-html");
              if (!node.classList.contains("nb") || !html) return true;
              const box = node.getBoundingClientRect();
              const spacers = [...html.querySelectorAll(".vlist-s")].filter((spacer) =>
                !spacer.textContent.replace(/\u200b/g, "").trim());
              const spacerWidth = Math.max(0, ...spacers.map((spacer) => spacer.getBoundingClientRect().width));
              if (!spacerWidth || node.scrollWidth - node.clientWidth > Math.ceil(spacerWidth) + 1) return true;
              const walker = document.createTreeWalker(html, NodeFilter.SHOW_TEXT);
              const textBoxes = [];
              while (walker.nextNode()) {
                const text = walker.currentNode;
                if (!text.textContent.replace(/\u200b/g, "").trim()) continue;
                const range = document.createRange();
                range.selectNodeContents(text);
                const r = range.getBoundingClientRect();
                if (r.width > 0 && r.height > 0) textBoxes.push({
                  text: text.textContent, left: r.left, right: r.right,
                  insideWrapper: r.left >= box.left - 1 && r.right <= box.right + 1,
                });
              }
              if (!textBoxes.length || textBoxes.some((text) => !text.insideWrapper)) return true;
              nonInkSpacerOverflows.push({
                tex: node.querySelector("annotation").textContent, scrollWidth: node.scrollWidth,
                clientWidth: node.clientWidth, spacerWidth, textBoxes,
                classification: "Only KaTeX zero-width layout spacer; every visible nonblank text range contained",
              });
              return false;
            }).map((node) => ({ node: node.id || node.className, scrollWidth: node.scrollWidth, clientWidth: node.clientWidth }));
          const formulaVerticalOverflows = [...document.querySelectorAll(".nb")]
            .filter((node) => node.scrollHeight > node.clientHeight + 1).map((node) => rect(node));
          return {
            lang: document.documentElement.lang, title: document.title, heading: document.querySelector("h1").textContent,
            paragraphs: prose.length, exerciseIds: [...document.querySelectorAll("li.ex")].map((node) => node.id),
            choices: [...document.querySelectorAll('li.ex[id^="choice-"]')].map((node) => ({
              id: node.id, mode: node.dataset.mode, options: node.querySelectorAll(".options>li").length,
            })),
            options: document.querySelectorAll(".options>li").length,
            answers: [...document.querySelectorAll('li.ex[id^="answer-"]')].map((node) => ({
              id: node.id, grading: node.dataset.grading, parts: node.dataset.partsCount,
            })),
            inputs: document.querySelectorAll("input,textarea,math-field,button,[contenteditable=true]").length,
            runtimeScripts: document.scripts.length,
            errors: [...document.querySelectorAll(".err,.sr-tex-err,.katex-error")].map((node) => node.textContent),
            groupLabels: [...document.querySelectorAll(".exgroup")].map((node) => node.textContent),
            fontStatus: document.fonts.status, fontFaces, katexMainLoaded: document.fonts.check("16px KaTeX_Main"),
            katex: document.querySelectorAll(".katex").length,
            katexBoxesNonzero: [...document.querySelectorAll(".katex")].every((node) => {
              const r = node.getBoundingClientRect(); return r.width > 0 && r.height > 0;
            }),
            bodyFont: getComputedStyle(document.body).fontFamily,
            mainProseFontSizes: textBlocks.filter((node) => !node.classList.contains("body") || !node.querySelector(".prompt"))
              .map((node) => parseFloat(getComputedStyle(node).fontSize)),
            pageOverflow: document.documentElement.scrollWidth - innerWidth, horizontalOverflows, nonInkSpacerOverflows, formulaVerticalOverflows,
            siblingCollisions, inlineLineCollisions, figures: figureMeasurements, regions,
            writtenPreserved: surface !== "exercises" || exerciseBodies.every((node, index) => node.innerHTML === normalizedHtml(nativeExerciseHtml[index], true)),
            prosePreserved: surface !== "text" || prose.every((node, index) => node.textContent === textOnly(expectedProse[index])),
            choicesViewOnlyPreserved: surface !== "choices" || exerciseBodies.every((node, index) =>
              node.querySelector(".prompt").innerHTML === normalizedHtml(viewHtml[index].stem)
              && [...node.querySelectorAll(".options>li>div")].every((option, j) => option.innerHTML === normalizedHtml(viewHtml[index].options[j].html))),
            actualNativeAnswersPreserved: surface !== "answers" || exerciseBodies.every((node, index) =>
              node.querySelector(".prompt").innerHTML === normalizedHtml(nativeExerciseHtml[index])
              && node.querySelector(".answer").innerHTML === normalizedHtml(nativeAnswerHtml[index])),
          };
        }, { surface, expectedProse, nativeExerciseHtml, nativeAnswerHtml, viewHtml });
        for (const figure of dom.figures) {
          figure.svgSha256 = sha(figure.outerSvg);
          const nativeFigure = figures.find((item) => item.id === figure.id);
          assert.ok(nativeFigure);
          figure.nativeAsset = protect(path.join(packet.raw, "editions/modern-us-neutral", nativeFigure.svg));
          // Compare DOM-normalized SVG against the current native asset, never re-render it.
          const nativeSvg = fs.readFileSync(figure.nativeAsset.path, "utf8");
          const nativeNormalized = await page.evaluate((svg) => {
            const container = document.createElement("div");
            container.innerHTML = svg;
            return container.querySelector("svg").outerHTML;
          }, nativeSvg);
          const actualGeometry = await page.evaluate((svg) => {
            const container = document.createElement("div");
            container.innerHTML = svg;
            const root = container.querySelector("svg");
            return [...root.children].filter((node) => !["title", "desc"].includes(node.tagName.toLowerCase()))
              .map((node) => node.outerHTML).join("");
          }, figure.outerSvg);
          const nativeGeometry = await page.evaluate((svg) => {
            const container = document.createElement("div");
            container.innerHTML = svg;
            const root = container.querySelector("svg");
            return [...root.children].filter((node) => !["title", "desc"].includes(node.tagName.toLowerCase()))
              .map((node) => node.outerHTML).join("");
          }, nativeNormalized);
          assert.equal(actualGeometry, nativeGeometry, `${figure.id}: rendered geometry is not current native SVG`);
          figure.nativeGeometryPreserved = true;
          delete figure.outerSvg;
        }
        write(path.join(root, "final-receipts", `${name}-dom.json`), { ...currentAttempt, dom, errors: [...errors] });
        assert.deepEqual(errors, [], `${name}: browser errors`);
        assert.deepEqual(networkAttempts, [], `${name}: network request attempted`);
        assert.deepEqual(dom.errors, [], `${name}: error markup`);
        assert.equal(dom.lang, locale === "zh" ? "zh-CN" : "en");
        const expectedTitle = surface === "text" ? locale === "en" ? lesson.title : lesson.printed_title || lesson.title
          : surface === "exercises" ? locale === "en" ? `${lesson.title} \u00b7 Exercises`
            : `${lesson.printed_title || lesson.title} \u00b7 \u4e60\u9898`
            : report.html.find((item) => item.locale === locale && item.surface === surface).title;
        assert.equal(dom.title, expectedTitle, `${name}: current lesson locale/title`);
        assert.ok(dom.heading.startsWith(locale === "en" ? lesson.title : lesson.printed_title || lesson.title));
        assert.equal(dom.paragraphs, surface === "text" ? expectedProse.length : 0);
        assert.deepEqual(dom.exerciseIds, surface === "text" ? [] : numbers.map((_, index) =>
          `${surface === "exercises" ? "ex" : surface === "choices" ? "choice" : "answer"}-${index + 1}`));
        assert.equal(dom.options, surface === "choices" ? 26 : 0);
        assert.equal(dom.answers.length, surface === "answers" ? 6 : 0);
        assert.equal(dom.choices.length, surface === "choices" ? 6 : 0);
        assert.equal(dom.inputs, 0);
        assert.equal(dom.runtimeScripts, 0);
        assert.equal(dom.fontStatus, "loaded");
        assert.ok(dom.katexMainLoaded);
        assert.ok(dom.fontFaces.some((font) => font.family.includes("KaTeX_Main") && font.status === "loaded"));
        assert.ok(dom.fontFaces.every((font) => font.status === "loaded" || font.status === "unloaded"));
        assert.ok(dom.katex > 0 && dom.katexBoxesNonzero);
        assert.ok(dom.mainProseFontSizes.every((size) => size >= 16));
        assert.ok(dom.pageOverflow <= 1);
        assert.deepEqual(dom.horizontalOverflows, []);
        assert.deepEqual(dom.formulaVerticalOverflows, []);
        assert.deepEqual(dom.siblingCollisions, []);
        assert.deepEqual(dom.inlineLineCollisions, []);
        assert.ok(dom.writtenPreserved && dom.prosePreserved && dom.choicesViewOnlyPreserved && dom.actualNativeAnswersPreserved);
        assert.deepEqual(dom.figures.map((figure) => figure.id), surface === "text" ? ["fig-201", "fig-202"] : []);
        for (const figure of dom.figures) {
          assert.ok(Math.abs(figure.width - figure.expectedWidth) < 1);
          assert.ok(figure.width >= 330 && figure.geometry > 0);
          assert.ok(figure.minTextPx >= 16);
          assert.deepEqual(figure.labelCollisions, []);
          assert.deepEqual(figure.labelsOutsideSvg, []);
        }
        for (const answer of dom.answers) {
          assert.equal(answer.grading, "ungraded");
          assert.equal(answer.parts, "0");
        }
        for (const [index, choice] of dom.choices.entries()) {
          assert.equal(choice.mode, views[index].mode);
          assert.equal(choice.options, views[index].options.length);
        }
        if (locale === "en" && surface === "exercises") assert.deepEqual(dom.groupLabels, ["Questions"]);

        const reaches = [];
        for (const region of dom.regions) {
          reaches.push(await page.evaluate((region) => {
            scrollTo(0, Math.max(0, region.y - 24));
            return { selector: region.selector, documentY: region.y, scrollY,
              intersectsViewport: region.y + region.height > scrollY && region.y < scrollY + innerHeight };
          }, region));
        }
        assert.ok(reaches.length > 0 && reaches.every((reach) => reach.intersectsViewport));
        const bottom = await page.evaluate(() => {
          scrollTo(0, document.documentElement.scrollHeight);
          const height = document.documentElement.scrollHeight;
          const last = document.querySelector(".sheet").lastElementChild.getBoundingClientRect();
          return { scrollY, viewportHeight: innerHeight, documentHeight: height,
            reached: scrollY + innerHeight >= height - 1, lastRegionVisible: last.bottom > 0 && last.bottom <= innerHeight + 1 };
        });
        assert.ok(bottom.reached && bottom.lastRegionVisible);
        await page.evaluate(() => scrollTo(0, 0));
        const screenshot = path.join(root, "screenshots", `${name}.png`);
        fs.mkdirSync(path.dirname(screenshot), { recursive: true });
        const reusedScreenshot = fs.existsSync(screenshot);
        if (reusedScreenshot) assert.equal(name, "zh-text-1440");
        else await page.screenshot({ path: screenshot, fullPage: true, scale: "css" });
        const screenshotBinding = {
          locale, surface, viewport, ...bind(screenshot), dimensions: pngDimensions(screenshot),
          fullCoverage: true, screenshotInvocations: 1, openedIntoModel: false,
          reusedWithoutRecapture: reusedScreenshot,
          requestedViewport: viewport, capturedDocumentWidth: viewport.width + dom.pageOverflow,
          excludedScrollbarWidth: -dom.pageOverflow,
        };
        assert.equal(screenshotBinding.dimensions.width, viewport.width + dom.pageOverflow);
        assert.equal(screenshotBinding.dimensions.height, bottom.documentHeight);
        report.screenshots.push(screenshotBinding);
        const check = {
          ...currentAttempt, sources, dom, reaches, bottom, screenshot: screenshotBinding,
          assertions: "PASS", visualVerdict: "HOLD",
        };
        report.checks.push(check);
        write(path.join(root, "final-receipts", `${name}-PASS.json`), check);
        const coverageRecipeIds = [];
        for (let y = 0, index = 0; y < screenshotBinding.dimensions.height; y += viewport.height, index++) {
          const crop = recipe(screenshotBinding, {
            x: 0, y, width: viewport.width, height: Math.min(viewport.height, screenshotBinding.dimensions.height - y),
          }, `coverage-${index + 1}`, "Full top-to-bottom visual coverage at native CSS-pixel scale");
          crops.push(crop);
          coverageRecipeIds.push(crop.id);
        }
        check.visualCoverageRecipeIds = coverageRecipeIds;
        for (const figure of dom.figures) {
          const crop = recipe(screenshotBinding, {
            x: Math.max(0, figure.x - 16), y: Math.max(0, figure.y - 16),
            width: figure.width + 32, height: figure.height + 72,
          }, figure.id, "Current fig201/202 actual pixels: label readability, geometry/label relationship and composition; DOM is not visual proof");
          crops.push(crop);
        }
        console.log(JSON.stringify({ surface: name, dom: "PASS", screenshot: screenshotBinding.sha256,
          documentHeight: bottom.documentHeight, visual: "HOLD" }));
      }
    }
  }
  assert.equal(report.checks.length, 16);
  assert.equal(report.screenshots.length, 16);
  for (const [file, expected] of protectedFiles) assert.equal(bind(file).sha256, expected);
  report.inputSnapshotsUnmodified = [...protectedFiles].map(([file, sha256]) => ({ path: file, sha256 }));
  write(path.join(root, "crop-recipes.json"), {
    schema: "d910-crop-recipes-v1", recipes: crops, coordinateSystem: "PNG CSS pixels, origin upper left",
    notMaterializedOrLoadedByThisAgent: true,
    materializationExample: "sharp(source.path).extract(crop).png().toFile(newReviewerOutputPath)",
  });
  const coverage = crops.filter((crop) => crop.id.includes("-coverage-"));
  const figures = crops.filter((crop) => !crop.id.includes("-coverage-"));
  const batches = [];
  for (let index = 0; index < coverage.length; index += 8) {
    batches.push({ id: `full-coverage-${batches.length + 1}`, recipeIds: coverage.slice(index, index + 8).map((crop) => crop.id) });
  }
  for (let index = 0; index < figures.length; index += 8) {
    batches.push({ id: `figure-detail-${index / 8 + 1}`, recipeIds: figures.slice(index, index + 8).map((crop) => crop.id) });
  }
  const plan = {
    schema: "d910-visual-review-plan-v1", status: "HOLD", completeCard: false,
    noReviewerDispatched: true, imagesOpenedByCaptureAgent: 0,
    originalScreenshots: report.screenshots, cropRecipes: bind(path.join(root, "crop-recipes.json")),
    freshReviewerRules: [
      "Use one fresh reviewer per batch, with only current native lesson/locale context and the listed paths/hashes. Do not forward image-bearing history.",
      "Materialize only the listed crop recipes in separately authorized reviewer scratch; verify the source PNG SHA-256 first.",
      "Load at most 8 images total in the batch, including reopens/crops; never exceed 24 loaded images in any context.",
      "The source PNG is not an additional permitted image load: read the listed crops only. Return text, paths and hashes, not image payloads.",
      "Review real pixels for readable text/formula/figure labels, clipping, overlap, whitespace and complete surface coverage. DOM PASS is not visual PASS.",
      "Check the 16 surfaces and fig201/202 in both locale/viewports; all batches must return honest independent visual verdicts before display approval.",
      "This plan does not authorize another chat, paid calls, content editing, re-rendering, publication or promotion.",
    ],
    batches: batches.map((batch) => ({ ...batch, freshReviewerRequired: true, maximumImages: 8, assignedImages: batch.recipeIds.length })),
    coverage: report.checks.map((check) => ({
      locale: check.locale, surface: check.surface, viewport: check.viewport,
      screenshot: { path: check.screenshot.path, sha256: check.screenshot.sha256 },
      recipeIds: check.visualCoverageRecipeIds, everyDocumentPixelCoveredByRecipe: true,
    })),
  };
  write(path.join(root, "visual-review-plan.json"), plan);
  report.visualReviewPlan = bind(path.join(root, "visual-review-plan.json"));
  report.capture = "PASS";
  report.status = "FIRST-SIXTEEN-SURFACE-OFFLINE-DOM-CAPTURE-PASS-VISUAL-HOLD";
  report.networkRequests = networkAttempts;
} catch (error) {
  report.firstFailure = {
    message: String(error.stack || error), attempt: currentAttempt ?? null,
    timestamp: new Date().toISOString(), dependentStagesStopped: true,
    passedSurfacesReplayed: false, screenshotsReplayed: false,
  };
  report.status = "FIRST-OFFLINE-DOM-CAPTURE-HOLD";
  write(path.join(root, "resume-uncaptured-failure.json"), { ...report.firstFailure, report });
  process.exitCode = 1;
} finally {
  if (browser) {
    await browser.close();
    report.browser.closed = true;
  }
  report.technicalRecovery.commands.push({
    command: ["node", path.join(root, "resume-uncaptured-once.mjs")], cwd: repo, exit: process.exitCode || 0,
  });
  write(path.join(root, "final-report.json"), report);
  freeze();
}
console.log(JSON.stringify({
  binding: report.binding, capture: report.capture, visualReview: report.visualReview,
  surfaces: report.checks.length, screenshots: report.screenshots.length,
  report: bind(path.join(root, "final-report.json")), browserClosed: report.browser.closed,
  imagesLoadedIntoModel: 0, completeCard: false, firstFailure: report.firstFailure?.message ?? null,
}));

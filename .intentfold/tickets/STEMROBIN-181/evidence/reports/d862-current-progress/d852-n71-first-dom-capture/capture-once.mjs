import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { chromium } from "/Users/yong/.codex/worktrees/00b1/lemmadeck/app/node_modules/playwright/index.mjs";
import { choiceHtml } from "/Users/yong/.codex/worktrees/00b1/lemmadeck/.claude/skills/ld-s10y-lesson/tools/choice_html.mjs";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const ticket = path.join(repo, ".intentfold/tickets/STEMROBIN-181");
const root = path.join(ticket, "tmp/d852-n71-first-dom-capture");
const nativeRoot = path.join(ticket, "tmp/d846-n71-native-recovery");
const card = "phy10-c2-s2-n71";
const require = createRequire(path.join(repo, ".claude/skills/ld-s10y-lesson/tools/htmlfrag.js"));
const { inline, proseFlow } = require("./htmlfrag.js");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const bind = (file) => ({ path: file, sha256: crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex") });
const native = read(path.join(nativeRoot, "report.json"));
const recovery = process.argv.includes("--recover-after-first-failure");
const report = recovery ? read(path.join(root, "FIRST-failure.json")).report : {
  card, status: "FIRST_DOM_CAPTURE_STARTED", native: bind(path.join(nativeRoot, "report.json")),
  choiceBindings: bind(path.join(nativeRoot, "choice-rebinding/report.json")),
  browser: { channel: "chrome", headless: false, isolated: true },
  checks: [], screenshots: [], html: [], imagesOpened: 0,
  semanticReviewReplayed: false, displayApproved: false, completeCard: false,
};
if (recovery) report.technicalRecovery = {
  firstFailure: bind(path.join(root, "FIRST-failure.json")),
  firstHarness: bind(path.join(root, "FIRST-capture-harness.mjs")),
  diagnosis: "Added preview document explicitly uses zh; native pages use zh-CN. Both are valid Chinese locale values. Surface-specific harness expectation repaired.",
  contentChanged: false, previouslyPassedSurfacesReplayed: false,
};
assert.equal(process.cwd(), repo);
function write(file, value) {
  assert.ok(file.startsWith(`${root}/`));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, typeof value === "string" ? value : `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
}
write(path.join(root, recovery ? "recovery-started.json" : "started.json"), report);
const browser = await chromium.launch({ channel: "chrome", headless: false });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  for (const locale of ["zh", "en"]) {
    const packet = native.outputs[locale];
    assert.equal(packet.interactions, "PASS");
    const lesson = read(path.join(packet.target, "lesson.json"));
    const exercises = read(path.join(packet.target, "exercises.json"));
    const answers = read(path.join(packet.target, "answer-keys.json"));
    const figures = read(path.join(packet.target, "figures.json")).figures;
    const expectedProse = proseFlow(lesson.prose, lesson.section_breaks).filter((b) => !["fig", "cap"].includes(b.kind));
    const draftQuestions = ["q12", "q3"].flatMap((pack) => read(path.join(nativeRoot, locale, "current-choice-set", pack, "draft.json")).questions);
    assert.equal(exercises.exercises.length, 3);
    assert.equal(answers.answers.length, 3);
    assert.equal(draftQuestions.length, 4);
    const render = path.join(packet.work, "render/10p/modern-us-neutral", card);
    const surfaces = {
      text: path.join(render, "text.html"),
      exercises: path.join(render, "exercises.html"),
    };
    for (const surface of ["answers", "choices"]) {
      const existing = path.join(root, locale, `${surface}.html`);
      if (recovery && fs.existsSync(existing)) {
        surfaces[surface] = existing;
        continue;
      }
      await page.goto(pathToFileURL(surfaces.exercises).href);
      await page.evaluate(() => document.fonts.ready);
      const content = surface === "answers" ? answers.answers.map((answer, i) => {
        assert.equal(answer.grading, "ungraded");
        const exercise = exercises.exercises.find((item) => String(item.number) === String(answer.exercise));
        assert.ok(exercise);
        return `<li class="ex" id="answer-${i + 1}"><div class="no">${i + 1}.</div><div class="body"><div class="prompt">${inline(exercise.text)}</div><div class="answer">${inline(answer.displayAnswer)}</div></div></li>`;
      }).join("") : draftQuestions.map((question, i) =>
        `<li class="ex" id="choice-${i + 1}"><div class="no">${i + 1}.</div><div class="body"><div class="prompt">${choiceHtml(question.view.stem)}</div><ol class="options">${question.view.options.map((option, j) =>
          `<li><span class="option-label">${String.fromCharCode(65 + j)}.</span><div>${choiceHtml(option.text)}</div></li>`).join("")}</ol></div></li>`).join("");
      const title = `${locale === "en" ? lesson.title : lesson.printed_title || lesson.title} | ${surface}`;
      await page.evaluate(({ title, content, locale }) => {
        document.documentElement.lang = locale;
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
      }, { title, content, locale });
      surfaces[surface] = path.join(root, locale, `${surface}.html`);
      write(surfaces[surface], await page.content());
    }
    for (const [surface, file] of Object.entries(surfaces)) {
      const html = bind(file);
      if (!report.html.some((item) => item.locale === locale && item.surface === surface)) report.html.push({ locale, surface, ...html });
      for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
        if (recovery && report.checks.some((item) => item.locale === locale && item.surface === surface && item.viewport.width === viewport.width)) continue;
        await page.setViewportSize(viewport);
        await page.goto(pathToFileURL(file).href);
        await page.evaluate(() => document.fonts.ready);
        const dom = await page.evaluate(() => ({
          lang: document.documentElement.lang,
          paragraphs: document.querySelectorAll(".para").length,
          questions: document.querySelectorAll("li.ex").length,
          options: document.querySelectorAll(".options>li").length,
          answers: document.querySelectorAll(".answer").length,
          inputs: document.querySelectorAll("input,textarea,math-field").length,
          groupLabels: [...document.querySelectorAll(".exgroup")].map((n) => n.textContent),
          overflow: document.documentElement.scrollWidth - innerWidth,
          errors: [...document.querySelectorAll(".err,.katex-error")].map((n) => n.textContent),
          figures: [...document.querySelectorAll(".fig")].map((n) => {
            const svg = n.querySelector("svg");
            return {
              id: n.id, width: svg?.getBoundingClientRect().width,
              minTextPx: svg ? Math.min(...[...svg.querySelectorAll("text")].filter((t) => t.textContent.trim()).map((t) => {
                const m = t.getScreenCTM();
                return parseFloat(getComputedStyle(t).fontSize) * Math.hypot(m.a, m.b);
              })) : null,
              geometry: svg?.querySelectorAll("path,line,polygon,circle,ellipse").length,
            };
          }),
          formulaVerticalOverflows: [...document.querySelectorAll(".nb")].filter((n) => n.scrollHeight > n.clientHeight + 1).map((n) => n.textContent),
        }));
        assert.deepEqual(errors, []);
        assert.deepEqual(dom.errors, []);
        assert.equal(dom.lang, locale === "en" ? "en" : ["answers", "choices"].includes(surface) ? "zh" : "zh-CN");
        assert.ok(dom.overflow <= 1);
        assert.deepEqual(dom.formulaVerticalOverflows, []);
        assert.equal(dom.paragraphs, surface === "text" ? expectedProse.length : 0);
        assert.equal(dom.questions, surface === "text" ? 0 : surface === "choices" ? 4 : 3);
        if (surface === "answers") {
          assert.equal(dom.answers, 3);
          assert.equal(dom.inputs, 0);
        }
        if (surface === "choices") {
          assert.equal(dom.options, draftQuestions.reduce((n, q) => n + q.view.options.length, 0));
          assert.equal(dom.inputs, 0);
        }
        assert.deepEqual(dom.figures.map((f) => f.id), surface === "text" ? figures.map((f) => f.id) : []);
        for (const f of dom.figures) {
          assert.ok(f.width >= 330);
          assert.ok(f.geometry > 0);
          assert.ok(f.minTextPx >= 15.99);
        }
        if (locale === "en" && surface === "exercises") assert.deepEqual(dom.groupLabels, ["Questions"]);
        const screenshot = path.join(root, "screenshots", `${locale}-${surface}-${viewport.width}.png`);
        fs.mkdirSync(path.dirname(screenshot), { recursive: true });
        await page.screenshot({ path: screenshot, fullPage: true });
        report.checks.push({ locale, surface, viewport, html, dom });
        report.screenshots.push({ locale, surface, viewport, ...bind(screenshot) });
      }
    }
  }
  assert.equal(report.checks.length, 16);
  report.status = "FIRST_SIXTEEN_SURFACE_DOM_CAPTURE_PASS_VISUAL_PENDING";
  write(path.join(root, "report.json"), report);
} catch (e) {
  write(path.join(root, recovery ? "recovery-failure.json" : "FIRST-failure.json"), { error: String(e.stack || e), report });
  throw e;
} finally {
  await browser.close();
}
console.log(JSON.stringify({ status: report.status, screenshots: report.screenshots.length }));

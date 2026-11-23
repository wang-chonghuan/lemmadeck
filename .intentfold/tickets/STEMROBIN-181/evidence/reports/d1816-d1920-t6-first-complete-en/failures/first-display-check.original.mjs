import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { choiceHtml } from '../../../../../.claude/skills/ld-s10y-lesson/tools/choice_html.mjs';
import { repo, ticket, bind, read, save } from './n42-native.mjs';

const require = createRequire(`${repo}/app/package.json`);
const { chromium } = require('playwright');
const config = process.argv[2] ? read(process.argv[2]) : {
  card: 'phy9-c1-s1-t10', title: 'Exercise 1',
  nativeFile: `${ticket}/tmp/d1816-d1890-ex1-first-en-native/result.json`,
  viewFile: `${ticket}/tmp/d1816-d1891-ex1-en-choice-review-inputs/views.json`,
  firstFile: `${ticket}/tmp/d1816-d1892-ex1-first-en-display/report.json`,
  out: `${ticket}/tmp/d1816-d1895-ex1-display-selector-recovery`,
  images: `${repo}/.tmp/STEMROBIN-181/d1816-d1895/display`,
};
const { card, title, nativeFile, viewFile, out, images } = config;
const native = read(nativeFile);
const answerFile = `${native.target}/answer-keys.json`;
const answers = read(answerFile).answers;
const views = read(viewFile);
const first = config.firstFile ? read(config.firstFile) : null;
if (first) assert([1, 8].includes(first.views.length));
fs.mkdirSync(images, { recursive: true });
const report = {
  card, status: 'IN_PROGRESS', views: [], requests: [],
  native: bind(nativeFile),
  firstFailure: first?.status === 'FAIL' ? bind(config.firstFile) : null,
  reusedDisplayEvidence: first && first.views.length === 8 ? bind(config.firstFile) : null,
  recoveryScope: first ? first.views.length === 1
    ? 'Count the actual li.ex nodes; unchanged successful desktop text capture reused.'
    : 'Only text/written breadcrumb metadata changed; answer/choice captures and focused viewports reused unchanged.' : null,
  answerFile: bind(answerFile), publicChoiceViews: bind(viewFile),
  browserMode: 'isolated-headless-offline',
  headedAcceptanceClaimed: false, completeEnglishAccessibilityApproval: false,
  inputOrJudgingInteractionTested: false, databaseWrites: 0, paidCalls: 0,
};
const css = `
  *{letter-spacing:0}
  .question,.answer{border-top:1px solid var(--rule);margin-top:24px;padding-top:20px;
    font-size:17px;line-height:1.9;min-width:0}
  .stem{margin:0 0 12px}
  .option{display:flex;gap:12px;align-items:flex-start;padding:10px 0}
  .option input{flex:none;width:18px;height:18px;margin:7px 0 0}
  .option-text{min-width:0;flex:1}
  .option-id{flex:none;width:20px}
  .sr-nb{display:inline-block;box-sizing:border-box;max-width:100%;overflow-x:auto;
    overflow-y:hidden;vertical-align:middle;white-space:nowrap;padding:.15em .1em .25em}
`;
const answerHtml = answers.map(answer =>
  `<section class="answer" data-number="${answer.exercise}"><h2>${answer.exercise}</h2>${choiceHtml(answer.displayAnswer)}</section>`).join('');
const choiceBody = views.map((view, index) =>
  `<section class="question" data-mode="${view.mode}"><p class="stem">${index + 1}. ${choiceHtml(view.stem)}</p>${view.options.map(option =>
    `<label class="option"><input type="${view.mode === 'single' ? 'radio' : 'checkbox'}" name="question-${index}" value="${option.id}"><span class="option-id">${option.id}</span><span class="option-text">${choiceHtml(option.text)}</span></label>`).join('')}</section>`).join('');
assert.equal(answers.length, native.readonlyAnswers);
assert.equal(views.length, native.choiceQuestions);
assert.equal(views.reduce((sum, view) => sum + view.options.length, 0), native.choiceOptions ?? 32);
const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of [
    { name: 'desktop', width: 1440, height: 960 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    const context = await browser.newContext({ viewport });
    await context.route('**/*', route => {
      report.requests.push(route.request().url());
      return route.abort();
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const surface of ['text', 'written', 'answers', 'choices']) {
      if (first && ((first.views.length === 1 && viewport.name === 'desktop' && surface === 'text')
        || (first.views.length === 8 && !config.changedSurfaces.includes(surface)))) {
        const previous = first.views.find(view => view.surface === surface && view.viewport.name === viewport.name);
        assert(previous);
        report.views.push({ ...previous, unchangedSuccessfulCaptureReused: true });
        continue;
      }
      await page.setContent(fs.readFileSync(native.html[surface === 'written' ? 1 : 0].path, 'utf8'), { waitUntil: 'load' });
      if (surface === 'answers' || surface === 'choices') {
        await page.evaluate(({ surface, body, css, title }) => {
          document.documentElement.lang = 'en';
          const sheet = document.querySelector('.sheet');
          sheet.innerHTML = `<h1>${title}</h1><h2>${surface === 'answers' ? 'Answers' : 'Choices'}</h2>${body}`;
          const style = document.createElement('style');
          style.textContent = css;
          document.head.append(style);
        }, { surface, body: surface === 'answers' ? answerHtml : choiceBody, css, title });
      }
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('.katex-error,.err,.sr-tex-err').count(), 0);
      const count = surface === 'written' ? await page.locator('li.ex').count()
        : surface === 'answers' ? await page.locator('.answer').count()
          : surface === 'choices' ? await page.locator('.question').count() : 0;
      assert.equal(count, surface === 'text' ? 0 : surface === 'choices' ? native.choiceQuestions : native.sourceQuestions);
      if (surface === 'choices') {
        assert.equal(await page.locator('.option').count(), views.reduce((sum, view) => sum + view.options.length, 0));
        assert.equal(await page.locator('input[type=radio]').count(), views.filter(view => view.mode === 'single').reduce((sum, view) => sum + view.options.length, 0));
        assert.equal(await page.locator('input[type=checkbox]').count(), views.filter(view => view.mode === 'multiple').reduce((sum, view) => sum + view.options.length, 0));
        assert.equal(await page.locator('input:checked,button,form,textarea').count(), 0);
        const html = await page.content();
        assert(!/correct_index|displayAnswer|rationales|independent_solution|source_solution/.test(html));
      }
      const geometry = await page.evaluate(() => ({
        pageWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth,
        units: [...document.querySelectorAll('.answer,.question,li.ex')].map(node => {
          const box = node.getBoundingClientRect();
          return { left: box.left, right: box.right, top: box.top, bottom: box.bottom };
        }),
        wrappers: [...document.querySelectorAll('.nb,.sr-nb')].map(node => {
          const box = node.getBoundingClientRect();
          return { left: box.left, right: box.right, width: box.width,
            clientHeight: node.clientHeight, scrollHeight: node.scrollHeight,
            clientWidth: node.clientWidth, scrollWidth: node.scrollWidth };
        }),
      }));
      assert(geometry.pageWidth <= viewport.width + 1);
      for (const unit of geometry.units)
        assert(unit.left >= -1 && unit.right <= viewport.width + 1 && unit.bottom > unit.top);
      for (const wrapper of geometry.wrappers) {
        assert(wrapper.left >= -1 && wrapper.right <= viewport.width + 1);
        assert(wrapper.scrollHeight <= wrapper.clientHeight + 1);
      }
      const htmlFile = `${images}/en-${viewport.name}-${surface}.html`;
      fs.writeFileSync(htmlFile, await page.content(), { flag: 'wx' });
      const image = `${images}/en-${viewport.name}-${surface}.png`;
      await page.screenshot({ path: image, fullPage: true });
      const focused = [];
      if (surface === 'answers' || surface === 'choices') {
        for (const index of [0, 1]) {
          await page.locator(surface === 'answers' ? '.answer' : '.question').nth(index)
            .evaluate(node => node.scrollIntoView({ block: 'start', behavior: 'instant' }));
          const file = `${images}/en-${viewport.name}-${surface}-${index + 1}-viewport.png`;
          await page.screenshot({ path: file });
          focused.push(bind(file));
        }
      }
      report.views.push({ surface, viewport, count, geometry, html: bind(htmlFile),
        screenshot: bind(image), focused, errors: [...errors] });
    }
    assert.deepEqual(errors, []);
    await context.close();
  }
  assert.deepEqual(report.requests, []);
  report.status = 'FIRST_EN_EIGHT_SURFACE_DOM_PASS_PIXEL_REVIEW_PENDING';
} catch (error) {
  report.status = 'FAIL';
  report.error = { name: error.name, message: error.message };
  process.exitCode = 1;
} finally {
  await browser.close();
  report.browserClosed = true;
  save(`${out}/report.json`, report);
}
console.log(JSON.stringify({ card, status: report.status, report: bind(`${out}/report.json`) }));

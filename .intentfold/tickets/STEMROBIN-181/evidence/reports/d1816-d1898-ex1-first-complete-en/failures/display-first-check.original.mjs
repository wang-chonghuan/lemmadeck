import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { choiceHtml } from '../../../../../.claude/skills/ld-s10y-lesson/tools/choice_html.mjs';
import { repo, ticket, bind, read, save } from './n42-native.mjs';

const require = createRequire(`${repo}/app/package.json`);
const { chromium } = require('playwright');
const card = 'phy9-c1-s1-t10';
const native = read(`${ticket}/tmp/d1816-d1890-ex1-first-en-native/result.json`);
const answerFile = `${native.target}/answer-keys.json`;
const answers = read(answerFile).answers;
const viewFile = `${ticket}/tmp/d1816-d1891-ex1-en-choice-review-inputs/views.json`;
const views = read(viewFile);
const out = `${ticket}/tmp/d1816-d1892-ex1-first-en-display`;
const images = `${repo}/.tmp/STEMROBIN-181/d1816-d1892/display`;
fs.mkdirSync(images, { recursive: true });
const report = {
  card, status: 'IN_PROGRESS', views: [], requests: [],
  native: bind(`${ticket}/tmp/d1816-d1890-ex1-first-en-native/result.json`),
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
assert.equal(answers.length, 8);
assert.equal(views.length, 8);
assert.equal(views.filter(view => view.mode === 'multiple').length, 1);
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
      await page.setContent(fs.readFileSync(native.html[surface === 'written' ? 1 : 0].path, 'utf8'), { waitUntil: 'load' });
      if (surface === 'answers' || surface === 'choices') {
        await page.evaluate(({ surface, body, css }) => {
          document.documentElement.lang = 'en';
          const sheet = document.querySelector('.sheet');
          sheet.innerHTML = `<h1>Exercise 1</h1><h2>${surface === 'answers' ? 'Answers' : 'Choices'}</h2>${body}`;
          const style = document.createElement('style');
          style.textContent = css;
          document.head.append(style);
        }, { surface, body: surface === 'answers' ? answerHtml : choiceBody, css });
      }
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('.katex-error,.err,.sr-tex-err').count(), 0);
      const count = surface === 'written' ? await page.locator('ol.ex > li').count()
        : surface === 'answers' ? await page.locator('.answer').count()
          : surface === 'choices' ? await page.locator('.question').count() : 0;
      assert.equal(count, surface === 'text' ? 0 : 8);
      if (surface === 'choices') {
        assert.equal(await page.locator('.option').count(), 32);
        assert.equal(await page.locator('input[type=radio]').count(), 28);
        assert.equal(await page.locator('input[type=checkbox]').count(), 4);
        assert.equal(await page.locator('input:checked,button,form,textarea').count(), 0);
        const html = await page.content();
        assert(!/correct_index|displayAnswer|rationales|independent_solution|source_solution/.test(html));
      }
      const geometry = await page.evaluate(() => ({
        pageWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth,
        units: [...document.querySelectorAll('.answer,.question,ol.ex > li')].map(node => {
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

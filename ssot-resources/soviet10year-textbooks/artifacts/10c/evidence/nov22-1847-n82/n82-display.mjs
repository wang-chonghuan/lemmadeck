import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { choiceHtml } from '../../.claude/skills/ld-s10y-lesson/tools/choice_html.mjs';

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184';
assert.equal(process.cwd(), root);
const base = '.tmp/stemrobin-184-six/n82-resume';
const lessonDir = 'ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-s2-n82';
const rendered = `${base}/render-work/render/10c/modern-us-neutral/ana10-c6-s2-n82`;
const out = `${base}/display`;
assert(!fs.existsSync(out));
fs.mkdirSync(out);
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => ({ path: file,
  sha256: createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const write = (file, value) => fs.writeFileSync(file, typeof value === 'string'
  ? value : JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const answers = read(`${lessonDir}/answer-keys.json`);
const choices = read(`${lessonDir}/choice-set/draft.json`);
assert.equal(answers.status, 'ready');
const require = createRequire(path.join(root, 'app/package.json'));
const { chromium } = require('playwright');
const { inline } = require(path.join(root, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'));
const evidence = { status: 'RUNNING', cwd: root, startedAt: new Date().toISOString(),
  scope: 'Complete offline display only; not DB, live application, keyboard or grading.',
  inputs: ['lesson.json', 'exercises.json', 'figures.json', 'answer-keys.json',
    'answer-keys.audit.json', 'choice-set/seed.json', 'choice-set/draft.json',
    'choice-set/review.json'].map(name => bind(`${lessonDir}/${name}`)),
  observations: [], captures: [], clicks: 0, parentImageOpens: 0,
  hiddenRasterAndModelCosts: 'UNKNOWN' };
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => /^(file:|data:)/.test(route.request().url())
    ? route.continue() : route.abort());
  let figureHtml;
  let choiceBase;
  for (const name of ['text', 'exercises']) {
    await page.setContent(fs.readFileSync(`${rendered}/${name}.html`, 'utf8'));
    await page.evaluate(() => {
      const style = document.createElement('style');
      style.textContent = 'h1{letter-spacing:0}nav{display:flex;gap:20px;margin-bottom:20px}details{border-top:1px solid #ddd;padding:14px 0}summary{cursor:pointer}.answer{padding:12px 0;line-height:1.9;overflow-x:auto}';
      document.head.append(style);
      const nav = document.createElement('nav');
      nav.setAttribute('aria-label', '课程');
      for (const [href, label] of [['text.html', '课文'], ['exercises.html', '习题'], ['choices.html', '选择题']]) {
        const a = document.createElement('a');
        a.href = href; a.textContent = label; nav.append(a);
      }
      document.querySelector('.sheet').prepend(nav);
    });
    if (name === 'exercises') {
      figureHtml = await page.locator('.fig').evaluate(el => el.outerHTML);
      await page.evaluate(items => {
        for (const item of items) {
          const details = document.createElement('details');
          details.dataset.exercise = item.exercise;
          const summary = document.createElement('summary');
          summary.textContent = `${item.exercise} · 标准答案`;
          const body = document.createElement('div');
          body.className = 'answer'; body.innerHTML = item.html;
          details.append(summary, body); document.querySelector('.sheet').append(details);
        }
      }, answers.answers.map(a => ({ exercise: a.exercise, html: inline(a.displayAnswer) })));
    } else choiceBase = await page.content();
    write(`${out}/${name}.html`, await page.content());
  }
  await page.setContent(choiceBase);
  await page.evaluate(({ questions, figure }) => {
    const sheet = document.querySelector('.sheet');
    const nav = sheet.querySelector('nav'), title = sheet.querySelector('h1');
    sheet.replaceChildren(nav, title);
    for (const q of questions) {
      const section = document.createElement('section');
      section.dataset.question = q.id;
      const stem = document.createElement('div');
      stem.className = 'stem'; stem.innerHTML = q.stem; section.append(stem);
      if (q.figures.length) {
        const div = document.createElement('div');
        div.innerHTML = figure; div.querySelector('.fig').removeAttribute('id');
        section.append(div);
      }
      const fieldset = document.createElement('fieldset');
      for (const option of q.options) {
        const label = document.createElement('label');
        label.dataset.option = option.id;
        const input = document.createElement('input');
        input.type = q.mode === 'single' ? 'radio' : 'checkbox'; input.name = q.id;
        input.setAttribute('aria-label', option.id);
        const span = document.createElement('span'); span.innerHTML = option.html;
        label.append(input, span); fieldset.append(label);
      }
      section.append(fieldset); sheet.append(section);
    }
    const style = document.createElement('style');
    style.textContent = 'section{border-top:1px solid #ddd;padding:20px 0}.stem{font-size:18px;line-height:1.9}fieldset{border:0;margin:12px 0;padding:0;min-width:0}label{display:flex;gap:12px;align-items:flex-start;padding:12px 0;line-height:1.8}label>span{min-width:0;max-width:100%;overflow-wrap:anywhere}input{flex-shrink:0;margin-top:7px}';
    document.head.append(style);
  }, { figure: figureHtml, questions: choices.questions.map(q => ({
    id: q.id, mode: q.view.mode, stem: choiceHtml(q.view.stem),
    figures: q.view.figure_ids, options: q.view.options.map(o => ({
      id: o.id, html: choiceHtml(o.text) })),
  })) });
  write(`${out}/choices.html`, await page.content());
  evidence.html = ['text', 'exercises', 'choices'].map(n => bind(`${out}/${n}.html`));
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 960 });
    for (const name of ['text', 'exercises', 'choices']) {
      await page.goto(pathToFileURL(path.resolve(out, `${name}.html`)).href);
      await page.evaluate(() => document.fonts.ready);
      if (name === 'exercises') {
        assert.equal(await page.locator('li.ex').count(), 2);
        assert.equal(await page.locator('.fig').count(), 1);
        for (const a of answers.answers) {
          await page.locator(`details[data-exercise="${a.exercise}"] summary`).click();
          evidence.clicks++;
          assert(await page.locator(`details[data-exercise="${a.exercise}"] .answer`).isVisible());
        }
      } else if (name === 'choices') {
        assert.equal(await page.locator('[data-question]').count(), 2);
        assert.equal(await page.locator('input').count(), 10);
        for (const q of choices.questions) {
          for (const o of q.view.options) {
            const input = page.locator(`[data-question="${q.id}"] [data-option="${o.id}"] input`);
            await input.click(); evidence.clicks++;
            assert(await input.isChecked());
            if (q.view.mode === 'single') {
              assert.equal(await page.locator(`[data-question="${q.id}"] input:checked`).count(), 1);
            } else {
              await input.click(); evidence.clicks++;
              assert(!(await input.isChecked()));
            }
          }
        }
      }
      const metrics = await page.evaluate(() => ({
        pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        formulaErrors: document.querySelectorAll('.err,.katex-error,.sr-tex-err').length,
        formulas: document.querySelectorAll('.katex').length,
        fonts: document.fonts.status,
        figures: [...document.querySelectorAll('.fig')].map(el => {
          const media = el.querySelector('.figure-media'), svg = el.querySelector('svg');
          const labels = [...svg.querySelectorAll('text')].map(t => {
            const m = t.getScreenCTM();
            return parseFloat(getComputedStyle(t).fontSize) * Math.hypot(m.a, m.b);
          });
          const end = el.scrollWidth - el.clientWidth;
          el.scrollLeft = end;
          const reachable = Math.abs(el.scrollLeft - end) <= 1;
          el.scrollLeft = 0;
          return { width: media.getBoundingClientRect().width, labels: labels.length,
            minLabelPx: Math.min(...labels), end, reachable };
        }),
      }));
      assert.equal(metrics.pageOverflow, false);
      assert.equal(metrics.formulaErrors, 0);
      assert.equal(metrics.fonts, 'loaded');
      assert(metrics.formulas > 0);
      for (const fig of metrics.figures) {
        assert.equal(fig.width, 640);
        assert.equal(fig.labels, 17);
        assert(fig.minLabelPx >= 16);
        assert(fig.reachable);
      }
      evidence.observations.push({ name, width, ...metrics });
      await page.evaluate(() => scrollTo(0, 0));
      const screenshot = `${out}/${name}-${width}.png`;
      await page.screenshot({ path: screenshot, fullPage: true });
      evidence.captures.push({ name, width, ...bind(screenshot) });
      await page.getByRole('navigation', { name: '课程' }).getByRole('link',
        { name: name === 'text' ? '习题' : '课文', exact: true }).click();
      assert(page.url().endsWith(name === 'text' ? '/exercises.html' : '/text.html'));
      evidence.clicks++;
    }
  }
  assert.deepEqual(errors, []);
  evidence.status = 'MECHANICAL_PASS_VISUAL_REVIEW_PENDING';
} catch (error) {
  evidence.status = 'FAIL'; evidence.failure = error.stack; process.exitCode = 1;
} finally {
  await browser.close();
  evidence.browserClosed = true; evidence.endedAt = new Date().toISOString();
  write(`${out}/browser-evidence.json`, evidence);
}
console.log(JSON.stringify({ status: evidence.status, captures: evidence.captures.length,
  clicks: evidence.clicks, failure: evidence.failure, report: `${out}/browser-evidence.json` }));

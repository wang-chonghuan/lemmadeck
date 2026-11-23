import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { choiceHtml } from '../../.claude/skills/ld-s10y-lesson/tools/choice_html.mjs';

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184';
assert.equal(process.cwd(), root);
const lessonDir = 'ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-ex';
const evidence = 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/nov23-1847-c6';
const out = `${evidence}/display-new`;
assert(!fs.existsSync(out));
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => ({ path: file,
  sha256: createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const write = (file, value) => fs.writeFileSync(file, typeof value === 'string'
  ? value : JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const draft = read(`${lessonDir}/choice-set/draft.json`);
const answers = read(`${lessonDir}/answer-keys.json`);
assert.equal(answers.status, 'ready');
assert.equal(answers.answers.length, 57);
assert.equal(draft.new_figures.length, 0, 'New figures require their actual reviewed display contract');
assert(draft.questions.every(q => !q.view.figure_ids.length &&
  q.view.options.every(o => !o.figure_ids.length)));
const oldHtml = '.tmp/stemrobin-184-six/c6-modern-representation-repair/work/render/10c/modern-us-neutral/ana10-c6-ex';
assert.equal(bind(`${oldHtml}/exercises.html`).sha256,
  'cc33a1856682c63224b915f912d0ff8be6e2dc2144c0aef7285ec2d9f8f6784d');
assert.equal(bind(`${oldHtml}/text.html`).sha256,
  'd04e59931019614e84795f559e30f2dcd6f29bd64fa32ba3a0d55acd465de952');
fs.mkdirSync(out, { recursive: true });
const prior = `${evidence}/display-prior`;
fs.mkdirSync(prior);
for (const name of ['text.html', 'exercises.html']) {
  fs.copyFileSync(`${oldHtml}/${name}`, `${prior}/${name}`, fs.constants.COPYFILE_EXCL);
}
const require = createRequire(path.join(root, 'app/package.json'));
const { chromium } = require('playwright');
const { inline } = require(path.join(root, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'));
const css = fs.readFileSync(`${oldHtml}/text.html`, 'utf8').match(/<style>([\s\S]*?)<\/style>/)?.[1];
assert(css);
const esc = value => String(value).replace(/[&<>"']/g,
  c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pageHtml = (title, body) => `<!doctype html><html lang="zh-CN"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><style>${css}
h1{font-size:24px;letter-spacing:0;line-height:1.5}
nav{display:flex;gap:20px;flex-wrap:wrap;margin-bottom:20px}
article{border-top:1px solid #ddd;padding:18px 0;min-width:0}
.stem,.answer{font-size:17px;line-height:1.9;overflow-wrap:anywhere;min-width:0}
fieldset{border:0;padding:0;margin:12px 0;min-width:0}
label{display:grid;grid-template-columns:22px minmax(0,1fr);gap:10px;align-items:start;padding:12px 0}
label>span{min-width:0;max-width:100%;overflow-wrap:anywhere}
input{width:18px;height:18px;margin:6px 0 0}
.sr-nb{display:inline-block;max-width:100%;overflow-x:auto;overflow-y:hidden;white-space:nowrap;vertical-align:middle;padding-block:.3em}
.answer .nb{overflow-y:hidden;padding-block:.3em}
</style></head><body><div class="sheet">
<nav aria-label="课程"><a href="../display-prior/exercises.html">习题</a><a href="choices.html">选择题</a><a href="answers.html">标准答案</a></nav>
<h1>${esc(title)}</h1>${body}</div></body></html>`;
write(`${out}/choices.html`, pageHtml('补充习题 · 选择题',
  draft.questions.map((q, i) => `<article data-question="${esc(q.id)}">
<div class="stem">${i + 1}. ${choiceHtml(q.view.stem)}</div>
<fieldset>${q.view.options.map(o => `<label data-option="${esc(o.id)}">
<input type="${q.view.mode === 'single' ? 'radio' : 'checkbox'}" name="${esc(q.id)}" aria-label="${esc(o.id)}">
<span>${choiceHtml(o.text)}</span></label>`).join('')}</fieldset></article>`).join('')));
write(`${out}/answers.html`, pageHtml('补充习题 · 标准答案',
  answers.answers.map(a => `<article data-exercise="${esc(a.exercise)}">
<h2>${esc(a.exercise)}</h2><div class="answer">${inline(a.displayAnswer)}</div></article>`).join('')));
const report = { cwd: root, status: 'RUNNING', startedAt: new Date().toISOString(),
  scope: 'Only new choices and answer display; unchanged written display reused. No DB, keyboard, live app or grading.',
  oldWrittenReview: 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/nov22-1846-c6-offline-display-recovered/c6-display-range-recovery/after-range-equality/report.md',
  inputs: ['lesson.json', 'exercises.json', 'answer-keys.json', 'answer-keys.audit.json',
    'interactions.json', 'choice-set/seed.json', 'choice-set/draft.json',
    'choice-set/review.json'].map(name => bind(`${lessonDir}/${name}`)),
  html: ['choices', 'answers'].map(name => bind(`${out}/${name}.html`)),
  priorHtml: ['text.html', 'exercises.html'].map(name => bind(`${prior}/${name}`)),
  observations: [], captures: [], clicks: 0, actualImageOpens: 0,
  pixelScope: 'Eight representative viewport captures, not an exhaustive painted-glyph adjudication.',
  hiddenRasterAndModelCosts: 'UNKNOWN' };
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.route('**/*', route => /^(file:|data:)/.test(route.request().url())
    ? route.continue() : route.abort());
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 960 });
    for (const name of ['choices', 'answers']) {
      const url = pathToFileURL(path.resolve(out, `${name}.html`)).href;
      await page.goto(url); await page.evaluate(() => document.fonts.ready);
      if (name === 'choices') {
        assert.equal(await page.locator('[data-question]').count(), draft.questions.length);
        for (const q of draft.questions) {
          const field = page.locator(`[data-question="${q.id}"]`);
          assert.equal(await field.locator('input').count(), q.view.options.length);
          for (const o of q.view.options) {
            const input = field.locator(`[data-option="${o.id}"] input`);
            await input.click(); report.clicks++; assert(await input.isChecked());
            if (q.view.mode === 'single') {
              assert.equal(await field.locator('input:checked').count(), 1);
            } else {
              await input.click(); report.clicks++; assert(!(await input.isChecked()));
            }
          }
        }
        await page.goto(url); await page.evaluate(() => document.fonts.ready);
      } else assert.equal(await page.locator('[data-exercise]').count(), 57);
      const metrics = await page.evaluate(() => {
        const ports = [...document.querySelectorAll('.nb,.sr-nb')]
          .filter(el => el.scrollWidth > el.clientWidth + 1)
          .map(el => {
            const before = el.scrollLeft;
            const end = el.scrollWidth - el.clientWidth;
            el.scrollLeft = end;
            const frame = el.getBoundingClientRect();
            const math = el.querySelector('.katex-html');
            const terminalRight = math?.getBoundingClientRect().right;
            const reached = Math.abs(el.scrollLeft - end) <= 1;
            el.scrollLeft = before;
            return { end, reached, terminalRight, frameRight: frame.right,
              tailInside: terminalRight === undefined || terminalRight <= frame.right + 1 };
          });
        return { pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          errors: document.querySelectorAll('.err,.katex-error,.sr-tex-err').length,
          math: document.querySelectorAll('.katex').length, fonts: document.fonts.status,
          ports, articles: document.querySelectorAll('article').length };
      });
      assert.equal(metrics.pageOverflow, false);
      assert.equal(metrics.errors, 0); assert.equal(metrics.fonts, 'loaded');
      assert(metrics.math > 0);
      assert(metrics.ports.every(p => p.reached && p.tailInside));
      report.observations.push({ width, name, ...metrics });
      const samples = name === 'choices'
        ? [0, draft.questions.length - 1] : [0, answers.answers.length - 1];
      for (const [sample, index] of samples.entries()) {
        await page.evaluate(last => scrollTo(0,
          last ? document.documentElement.scrollHeight : 0), sample === 1);
        const screenshot = `${out}/${name}-${width}-${sample}.png`;
        await page.screenshot({ path: screenshot });
        report.captures.push({ name, width, articleIndex: index, ...bind(screenshot) });
      }
    }
  }
  assert.deepEqual(errors, []);
  report.status = 'MECHANICAL_PASS_REPRESENTATIVE_VISUAL_REVIEW_PENDING';
} catch (error) {
  report.status = 'FAIL'; report.failure = error.stack; process.exitCode = 1;
} finally {
  await browser.close(); report.browserClosed = true;
  report.endedAt = new Date().toISOString(); write(`${out}/report.json`, report);
}
console.log(JSON.stringify({ status: report.status, captures: report.captures.length,
  failure: report.failure, report: `${out}/report.json` }));

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { choiceHtml } from '../../../../../.claude/skills/ld-s10y-lesson/tools/choice_html.mjs';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const require = createRequire(`${repo}/app/package.json`);
const { chromium } = require('playwright');
const { inline, esc } = require(`${repo}/.claude/skills/ld-s10y-lesson/tools/htmlfrag.js`);
const T = '.intentfold/tickets/STEMROBIN-181';
const ID = 'phy9-c1-s3-t9';
const C = '.tmp/STEMROBIN-181/d1816-d138/root/9p';
const D = '.tmp/STEMROBIN-181/d1816-d138/display';
const A = `${T}/tmp/d1816-d138-t9-choice-author`;
const O = `${T}/tmp/d1816-d138-t9-display`;
const read = file => JSON.parse(fs.readFileSync(file));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => ({ path: file, sha256: hash(fs.readFileSync(file)), bytes: fs.statSync(file).size });
const plain = text => text.replaceAll('**', '').replace(/\s+/g, '').trim();
assert(!fs.existsSync(`${O}/result.json`));
fs.mkdirSync(O, { recursive: true });
const partialFile = `${O}/partial-result.json`;
const records = fs.existsSync(partialFile) ? read(partialFile).records : [];
for (const row of records) for (const entry of [row.html, row.screenshot]) {
  assert.equal(bind(entry.path).sha256, entry.sha256);
}
const requests = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const viewport of [
    { name: 'desktop', width: 1440, height: 960 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    const context = await browser.newContext({ viewport });
    await context.route('**/*', route => { requests.push(route.request().url()); return route.abort(); });
    try {
      for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
        const dir = `${C}/editions/${edition}/lessons/${ID}`;
        const exercises = read(`${dir}/exercises.json`);
        const lesson = read(`${dir}/lesson.json`);
        const answers = read(`${dir}/answer-keys.json`);
        const draft = read(`${A}/draft.${locale}.json`);
        assert.equal(read(`${dir}/adaptation.audit.json`).status, 'pass');
        assert.equal(lesson.prose.length, 0);
        assert.equal(exercises.count, 6);
        assert.equal(answers.answers.length, 6);
        assert(answers.answers.every(row => row.grading === 'ungraded' && row.parts.length === 0));
        const nativeHtml = fs.readFileSync(`${D}/render/9p/${edition}/${ID}/exercises.html`, 'utf8');
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
        await page.setContent(fs.readFileSync(`${D}/render/9p/${edition}/${ID}/text.html`, 'utf8'), { waitUntil: 'load' });
        assert.equal(await page.locator('p.para,figure.fig,li.ex').count(), 0);
        assert((await page.locator('a.jump').innerText()).includes('6'));
        const supplementaryCss = '.sr-nb{display:inline-block;box-sizing:border-box;max-width:100%;overflow-x:auto;overflow-y:hidden;padding:.15em .1em .25em;vertical-align:middle;white-space:nowrap}.answer{margin-top:.7em;line-height:1.8}.choice-option{display:grid;grid-template-columns:1.8em minmax(0,1fr);gap:.4em;padding:.6em 0}.choice-option table{max-width:100%;border-collapse:collapse}.choice-option td,.choice-option th{border:1px solid var(--rule);padding:.3em}.choice-stem{line-height:1.8}.choice-figures .fig{overflow-x:auto}.body{min-width:0}';
        for (const surface of ['written', 'answers', 'choices']) {
          if (records.some(row => row.locale === locale && row.viewport.name === viewport.name && row.surface === surface)) continue;
          await page.setContent(nativeHtml, { waitUntil: 'load' });
          await page.addStyleTag({ content: supplementaryCss });
          await page.evaluate(() => document.fonts.ready);
          if (surface === 'answers') {
            const rendered = answers.answers.map(row => ({ exercise: row.exercise, html: inline(row.displayAnswer) }));
            await page.evaluate(rows => {
              for (const row of rows) {
                const target = document.querySelector(`[id="ex-${row.exercise}"] .body`);
                if (!target) throw new Error(`Missing exercise ${row.exercise}`);
                const answer = document.createElement('div');
                answer.className = 'answer';
                answer.dataset.exercise = row.exercise;
                answer.innerHTML = row.html;
                target.append(answer);
              }
            }, rendered);
            assert.equal(await page.locator('.answer').count(), 6);
          }
          if (surface === 'choices') {
            const media = await page.locator('figure.fig').evaluateAll(nodes => nodes.map(node => ({ id: node.id, html: node.outerHTML })));
            const byId = new Map(media.map(row => [row.id, row.html]));
            const figure = id => { assert(byId.has(id)); return byId.get(id); };
            const body = draft.questions.map(question => {
              const view = question.view;
              const stem = `<div class="choice-stem">${choiceHtml(view.stem)}</div>`;
              const figures = view.figure_ids.map(figure).join('');
              const options = view.options.map((option, index) =>
                `<div class="choice-option" data-option="${esc(option.id)}"><span>${String.fromCharCode(65 + index)}</span><div>${choiceHtml(option.text)}${option.figure_ids.map(figure).join('')}</div></div>`).join('');
              return `<li class="ex" data-question="${esc(question.id)}" data-mode="${view.mode}"><div class="no">${draft.questions.indexOf(question) + 1}</div><div class="body">${stem}<div class="choice-figures">${figures}</div>${options}</div></li>`;
            }).join('');
            await page.evaluate(({ html, title }) => {
              document.querySelector('.sheet').innerHTML = `<h1>${title}</h1><ol class="ex">${html}</ol>`;
            }, { html: body, title: esc(lesson.title) });
            assert.equal(await page.locator('[data-question]').count(), draft.questions.length);
            assert.equal(await page.locator('.choice-option').count(), draft.questions.reduce((sum, row) => sum + row.view.options.length, 0));
            assert(!body.includes('source_solution') && !body.includes('seed_sha256'));
          } else {
            const observed = await page.locator('li.ex').evaluateAll(nodes => nodes.map(node => {
              const clone = node.querySelector('.body').cloneNode(true);
              for (const extra of clone.querySelectorAll('figure,.answer')) extra.remove();
              for (const formula of clone.querySelectorAll('.katex')) {
                formula.replaceWith(document.createTextNode(`$${formula.querySelector('annotation').textContent}$`));
              }
              return { id: node.id, text: clone.textContent };
            }));
            assert.equal(observed.length, 6);
            for (const [index, row] of observed.entries()) {
              assert.equal(row.id, `ex-${exercises.exercises[index].number}`);
              assert.equal(plain(row.text), plain(exercises.exercises[index].text));
            }
            assert.equal(await page.locator('figure[id="fig-24"]').count(), 1);
            assert.equal(await page.locator('figure[id="fig-30"]').count(), 1);
          }
          assert.equal(await page.locator('.err,.katex-error,.sr-tex-err,input,textarea,script').count(), 0);
          const figureChecks = await page.locator('figure.fig').evaluateAll(nodes => nodes.map(node => {
            const svg = node.querySelector('svg');
            if (!svg) throw new Error('Missing SVG');
            const bbox = svg.getBBox();
            node.scrollLeft = node.scrollWidth;
            return { id: node.id, width: svg.getBoundingClientRect().width, height: svg.getBoundingClientRect().height,
              inkWidth: bbox.width, inkHeight: bbox.height,
              labels: [...svg.querySelectorAll('text')].map(text => {
                const m = text.getScreenCTM();
                return parseFloat(getComputedStyle(text).fontSize) * Math.hypot(m.a, m.b);
              }), scrollEndReachable: node.scrollLeft >= node.scrollWidth - node.clientWidth - 1 };
          }));
          for (const row of figureChecks) {
            const spec = read(`${C}/editions/${edition}/figures/${row.id}.spec.json`);
            assert(row.width > 0 && row.height > 0 && row.inkWidth > 5 && row.inkHeight > 5);
            assert(row.labels.length > 0 && row.labels.every(size => size >= spec.display.minTextPx - .05));
            assert(row.scrollEndReachable);
          }
          const geometry = await page.evaluate(() => ({
            width: document.documentElement.scrollWidth,
            boxes: [...document.querySelectorAll('li.ex')].map(node => {
              const box = node.getBoundingClientRect();
              return { x: box.x, right: box.right, y: box.y, bottom: box.bottom, width: box.width, height: box.height };
            }),
          }));
          assert(geometry.width <= viewport.width + 1);
          assert(geometry.boxes.every(box => box.x >= -1 && box.right <= viewport.width + 1 && box.width > 0 && box.height > 0));
          for (let index = 1; index < geometry.boxes.length; index++) assert(geometry.boxes[index].y >= geometry.boxes[index - 1].bottom - 1);
          if (locale === 'en') assert(!/[\u3400-\u9fff]/.test((await page.locator('h1,.crumb').allInnerTexts()).join('\n')));
          assert.deepEqual(errors, []);
          const htmlFile = `${O}/${locale}-${viewport.name}-${surface}.html`;
          fs.writeFileSync(htmlFile, await page.content(), { flag: 'wx' });
          const screenshotFile = `${O}/${locale}-${viewport.name}-${surface}.png`;
          await page.screenshot({ path: screenshotFile, fullPage: true });
          records.push({ locale, edition, viewport, surface, html: bind(htmlFile), screenshot: bind(screenshotFile),
            figureChecks, geometry, status: 'pass' });
          fs.writeFileSync(partialFile, JSON.stringify({ records }, null, 2) + '\n');
        }
        await page.close();
      }
    } finally { await context.close(); }
  }
} finally { await browser.close(); }
assert.equal(records.length, 12);
assert.deepEqual(requests, []);
fs.writeFileSync(`${O}/result.json`, JSON.stringify({
  batch: 'D138', status: 'pass', offline: true, headless: true, productAcceptance: false,
  records, requests, independentPixels: 'PENDING', parentImageOpens: 0,
  sourcePagesAdded: 0, completeCoursesAdded: 0,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ batch: 'D138', surfaces: 12, status: 'pass', independentPixels: 'PENDING' }));

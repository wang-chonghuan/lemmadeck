import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(`${process.cwd()}/app/package.json`);
const { chromium } = require('playwright');
const { proseFlow, proseInline, esc } = require(path.resolve('.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'));
const { choiceHtml } = await import(path.resolve('.claude/skills/ld-s10y-lesson/tools/choice_html.mjs'));
const base = '.tmp/STEMROBIN-181/d1815';
const book = `${base}/root/10p`;
const render = `${base}/display/render/10p`;
const output = '.intentfold/tickets/STEMROBIN-181/tmp/d1815-offline-display';
const ids = ['phy10-c2-s5-n107', 'phy10-c2-s5-n110', 'phy10-c2-s6-n113', 'phy10-c2-s6-n114'];
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const viewports = [{ name: 'desktop', width: 1440, height: 960 }, { name: 'mobile', width: 390, height: 844 }];
assert(!fs.existsSync(`${output}/result.json`), 'Preserve earlier batch result');
fs.mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const records = [];
const externalRequests = [];
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport });
    await context.route('**/*', route => {
      externalRequests.push(route.request().url());
      return route.abort();
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    const load = async html => {
      assert(!/<(?:script|link)\b/i.test(html), 'Offline HTML must not load a runtime');
      assert(html.includes('data:font/woff2;base64,'), 'Inline math fonts required');
      await page.setContent(html, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('.err,.katex-error,.sr-tex-err,input,textarea').count(), 0);
    };
    const inspect = async (edition, id, surface, html, expected) => {
      const geometry = await page.evaluate(() => {
        const boxes = [...document.querySelector('.sheet').children].map(node => {
          const r = node.getBoundingClientRect();
          return { tag: node.tagName, x: r.x, y: r.y, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
        });
        return { viewport: innerWidth, width: document.documentElement.scrollWidth, boxes,
          indent: [...document.querySelectorAll('p.para')].map(x => getComputedStyle(x).textIndent) };
      });
      assert(geometry.width <= viewport.width + 1, `${edition}/${id}/${surface} page overflow`);
      assert(geometry.boxes.every(x => x.width > 0 && x.height > 0 && x.x >= -1 && x.right <= viewport.width + 1));
      for (let i = 1; i < geometry.boxes.length; i++) {
        assert(geometry.boxes[i].y >= geometry.boxes[i - 1].bottom - 1, 'Overlapping page regions');
      }
      assert(geometry.indent.every(x => parseFloat(x) === 0));
      const tables = await page.locator('.table-scroll').evaluateAll(nodes => nodes.map(node => ({
        width: node.clientWidth, scrollWidth: node.scrollWidth,
        finalCellPresent: !!node.querySelector('tbody tr:last-child td:last-child')?.textContent.trim(),
      })));
      for (const table of await page.locator('.table-scroll').all()) {
        await table.evaluate(node => { node.scrollLeft = node.scrollWidth; });
        assert(await table.evaluate(node => node.scrollWidth - node.clientWidth - node.scrollLeft <= 1), 'Final table column unreachable');
        await table.evaluate(node => { node.scrollLeft = 0; });
      }
      assert(tables.every(x => x.finalCellPresent), 'Missing final detector table row or column');
      assert.equal(errors.length, 0, errors.join('\n'));
      const file = `${output}/${edition}-${id}-${surface}-${viewport.name}.png`;
      assert(!fs.existsSync(file), 'Preserve first screenshots');
      const image = await page.screenshot({ path: file, fullPage: true });
      assert(image.length > 8000, 'Blank screenshot');
      const htmlFile = `${output}/${edition}-${id}-${surface}-${viewport.name}.html`;
      fs.writeFileSync(htmlFile, html, { flag: 'wx' });
      records.push({ edition, id, surface, viewport, expected, geometry, tables,
        screenshot: file, screenshotHash: hash(image), html: htmlFile, htmlHash: hash(Buffer.from(html)), status: 'pass' });
    };
    for (const [lang, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
      for (const id of ids) {
        const dir = `${book}/editions/${edition}/lessons/${id}`;
        const lesson = read(`${dir}/lesson.json`);
        const exercises = read(`${dir}/exercises.json`);
        assert.equal(read(`${dir}/adaptation.audit.json`).status, 'pass');
        assert.equal(read(`${dir}/figures.json`).figures.length, 0);
        const flow = proseFlow(lesson.prose, lesson.section_breaks);
        const text = fs.readFileSync(`${render}/${edition}/${id}/text.html`, 'utf8');
        await load(text);
        assert.equal(await page.locator('p.para').count(), flow.filter(x => x.kind === 'p').length);
        const plain = x => x.replace(/\s+/g, ' ').trim();
        const paragraphs = await page.locator('p.para').allInnerTexts();
        let index = 0;
        for (const block of flow) {
          if (block.kind !== 'p') continue;
          const actual = plain(paragraphs[index++]);
          for (const segment of block.text.replace(/\*\*/g, '').split(/\$\$.*?\$\$|\$.*?\$/gs).map(plain).filter(Boolean)) {
            assert(actual.includes(segment), `Missing prose: ${segment}`);
          }
        }
        const font = await page.locator('p.para').evaluateAll(nodes => nodes.flatMap(node => {
          const baseSize = parseFloat(getComputedStyle(node).fontSize);
          return [...node.querySelectorAll('.prose-math,.katex')].map(x => ({
            family: getComputedStyle(x).fontFamily, ratio: parseFloat(getComputedStyle(x).fontSize) / baseSize,
          }));
        }));
        assert(font.every(x => x.family.includes('KaTeX') && x.ratio >= 1.09), 'Inconsistent prose math font');
        assert.equal(await page.locator('figure.fig,input,textarea').count(), 0);
        await inspect(edition, id, 'text', text, { sourceBlocks: lesson.prose.length, flowParagraphs: paragraphs.length, exercises: exercises.count });
        const written = fs.readFileSync(`${render}/${edition}/${id}/exercises.html`, 'utf8');
        await load(written);
        assert.equal(await page.locator('li.ex').count(), exercises.count);
        assert.equal(await page.locator('figure.fig').count(), 0);
        if (!exercises.count) continue;
        assert.equal(exercises.count, 7);
        for (const item of exercises.exercises) {
          assert((await page.locator('li.ex').allInnerTexts()).some(text => text.replace(/\s+/g, ' ').includes(item.text.replace(/^\d+\.\s*/, '').replace(/\s+/g, ' '))));
        }
        await inspect(edition, id, 'written', written, { writtenQuestions: 7 });
        const draft = read(`${base}/choice/${lang}/.tmp/n110/draft.json`);
        const answers = read(`${dir}/answer-keys.json`);
        assert.equal(answers.status, 'ready');
        assert.equal(answers.answers.length, 7);
        assert(answers.answers.every(x => x.grading === 'ungraded' && x.source === 'derived' && x.parts.length === 0));
        for (const [surface, body] of [
          ['choices', `<h1>${lang === 'en' ? 'Choice Questions' : '选择题'}</h1>` + draft.questions.map((q, i) =>
            `<article class="unit" data-question-id="${q.id}"><h2>${i + 1}. ${choiceHtml(q.view.stem)}</h2>`
            + `<p class="mode">${lang === 'en' ? q.view.mode : q.view.mode === 'multiple' ? '多选' : '单选'}</p>`
            + `<ol class="choice-options">${q.view.options.map(o => `<li data-option-id="${o.id}">${choiceHtml(o.text)}</li>`).join('')}</ol></article>`).join('')],
          ['standards', `<h1>${lang === 'en' ? 'Reference Answers' : '标准答案'}</h1>` + answers.answers.map(a =>
            `<article class="unit" data-exercise="${esc(a.exercise)}"><h2>${esc(a.exercise)}</h2>`
            + `<p class="para">${proseInline(a.displayAnswer)}</p></article>`).join('')],
        ]) {
          await load(text);
          await page.evaluate(({ body, title, lang }) => {
            document.title = title;
            document.documentElement.lang = lang;
            document.querySelector('.sheet').innerHTML = body;
            const style = document.createElement('style');
            style.textContent = '*{letter-spacing:0}.unit{padding:1.3rem 0;border-bottom:1px solid #ddd}.unit h2{font-size:1.06rem;line-height:1.7;margin:0 0 .6rem}.mode{font-size:.85rem;color:#666;margin:.4rem 0}.choice-options{padding-left:1.8rem;list-style-type:upper-alpha}.choice-options li{padding:.45rem 0;line-height:1.8;overflow-wrap:anywhere}.table-scroll{width:100%;max-width:100%;overflow-x:auto}table{border-collapse:collapse;width:100%;font-size:16px}th,td{padding:.45rem;border:1px solid #ccc;text-align:left;vertical-align:top;overflow-wrap:anywhere}th:first-child,td:first-child{min-width:5rem}';
            document.head.append(style);
            for (const table of document.querySelectorAll('.choice-options table')) {
              const wrapper = document.createElement('div');
              wrapper.className = 'table-scroll';
              table.before(wrapper);
              wrapper.append(table);
            }
          }, { body, title: `${lesson.title} - ${surface}`, lang });
          assert.equal(await page.locator('article.unit').count(), 7);
          if (surface === 'choices') {
            assert.equal(await page.locator('.choice-options>li').count(), 29);
            assert.equal(await page.locator('table').count(), 4);
            assert.equal(await page.locator('.mode').filter({ hasText: lang === 'en' ? 'multiple' : '多选' }).count(), 1);
          }
          assert.equal(await page.locator('input,textarea,button,.katex-error,.sr-tex-err').count(), 0);
          await inspect(edition, id, surface, await page.content(),
            surface === 'choices' ? { questions: 7, options: 29, singles: 6, multiples: 1 } : { readonlyStandards: 7, gradedInputs: 0 });
        }
      }
    }
    await context.close();
  }
} finally {
  await browser.close();
}
assert.equal(externalRequests.length, 0, 'Offline page requested external resources');
fs.writeFileSync(`${output}/result.json`, JSON.stringify({
  schema: 'STEMROBIN-181/offline-bilingual-complete-batch-display@1',
  batch: 'D039', status: 'pass', headless: true, isolated: true, productAcceptance: false,
  records, externalRequests, parentImageOpens: 0, independentVisualInspection: 'pending',
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ batch: 'D039', pass: true, screenshots: records.length, visualReviewPending: true }));

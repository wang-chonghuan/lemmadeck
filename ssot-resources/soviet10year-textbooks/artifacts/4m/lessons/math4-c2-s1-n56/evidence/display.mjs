import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(path.resolve('app/package.json'));
const { chromium } = require('playwright');
const { inline, proseFlow } = require(path.resolve('.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'));
const { choiceHtml } = await import(pathToFileURL(path.resolve('.claude/skills/ld-s10y-lesson/tools/choice_html.mjs')));
const id = 'math4-c2-s1-n56';
const book = path.resolve('ssot-resources/soviet10year-textbooks/artifacts/4m');
const lesson = path.join(book, 'editions/modern-us-neutral/lessons', id);
const html = path.resolve('.tmp/ld-s10y-lesson/render/4m/modern-us-neutral', id);
const output = path.join(book, 'lessons', id, 'evidence/display');
fs.mkdirSync(output, { recursive: true });
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const load = name => JSON.parse(fs.readFileSync(path.join(lesson, name), 'utf8'));
const prose = load('lesson.json');
const exercises = load('exercises.json');
const draft = load('choice-set/draft.json');
const answers = load('answer-keys.json');
const normalize = text => text.replace(/\*\*/g, '').replace(/\s+/g, '');
const records = [];
const errors = [];
const browser = await chromium.launch({ headless: true });
async function sourceText(locator) {
  return locator.evaluate(element => {
    const copy = element.cloneNode(true);
    copy.querySelectorAll('figure').forEach(node => node.remove());
    copy.querySelectorAll('.katex').forEach(node => {
      const tex = node.querySelector('annotation[encoding="application/x-tex"]')?.textContent;
      node.replaceWith(document.createTextNode(`$${tex}$`));
    });
    return copy.textContent;
  });
}
async function markupText(markup, page) {
  return page.evaluate(html => {
    const copy = document.createElement('div');
    copy.innerHTML = html;
    copy.querySelectorAll('.katex').forEach(node => {
      const tex = node.querySelector('annotation[encoding="application/x-tex"]')?.textContent;
      node.replaceWith(document.createTextNode(`$${tex}$`));
    });
    return copy.textContent;
  }, markup);
}
try {
  const page = await browser.newPage();
  page.on('pageerror', error => errors.push(String(error)));
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 960 });
    for (const view of ['text', 'exercises', 'choices', 'answers']) {
      const file = path.join(html, `${view}.html`);
      if (view === 'answers') {
        await page.goto(pathToFileURL(path.join(html, 'text.html')).href);
        const body = `<h1>${inline(prose.title)}：标准答案</h1>`
          + answers.answers.map(answer => `<section class="choice" data-answer="${answer.exercise}">`
            + `<h2 class="choice-heading">${answer.exercise}${answer.grading === 'ungraded' ? '：不判定正误' : ''}</h2>`
            + `<div class="answer-body">${inline(answer.displayAnswer)}</div></section>`).join('');
        await page.locator('.sheet').evaluate((sheet, content) => { sheet.innerHTML = content; }, body);
        if (width === 1440) fs.writeFileSync(file, await page.content());
      } else {
        await page.goto(pathToFileURL(file).href);
      }
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('.err,.katex-error').count(), 0);
      assert.equal(await page.locator('h1').count(), 1);
      if (view === 'text') {
        const paragraphs = proseFlow(prose.prose, prose.section_breaks).filter(block => block.kind === 'p');
        assert.equal(await page.locator('p.para').count(), paragraphs.length);
        for (const [index, paragraph] of paragraphs.entries()) {
          const node = page.locator('p.para').nth(index);
          assert.equal(normalize(await sourceText(node)), normalize(paragraph.text));
          assert.equal(await node.evaluate(element => element.classList.contains('section')), !!paragraph.sectionBreak);
        }
        assert.deepEqual(await page.locator('figure.fig').evaluateAll(nodes => nodes.map(node => node.id)),
          prose.prose.filter(block => block.kind === 'fig').map(block => block.id));
      }
      if (view === 'exercises') {
        assert.equal(await page.locator('li.ex').count(), exercises.count);
        for (const exercise of exercises.exercises) {
          const node = page.locator(`#ex-${exercise.number} .body`);
          assert.equal(normalize(await sourceText(node)), normalize(exercise.text.replace(/^\d+\.\s*/, '')));
        }
        assert.deepEqual(await page.locator('figure.fig').evaluateAll(nodes => nodes.map(node => node.id)),
          exercises.exercises.flatMap(exercise => exercise.figures.map(figure => figure.id)));
        assert.equal(await page.locator('input,textarea,button,[data-answer],.answer-body').count(), 0);
      }
      if (view === 'choices') {
        assert.equal(await page.locator('section.choice').count(), draft.questions.length);
        for (const [index, question] of draft.questions.entries()) {
          const node = page.locator('section.choice').nth(index);
          assert.equal(normalize(await sourceText(node.locator('.choice-stem'))), normalize(question.view.stem));
          assert.equal(await node.locator('.choice-option-body').count(), question.view.options.length);
          for (const [optionIndex, option] of question.view.options.entries()) {
            const optionNode = node.locator('.choice-option-body').nth(optionIndex);
            assert.equal(normalize(await sourceText(optionNode)), normalize(await markupText(choiceHtml(option.text), page)));
            if (option.text.includes('| --- |')) {
              assert.equal(await optionNode.locator('thead tr').count(), 1);
              assert.equal(await optionNode.locator('tbody tr').count(), 2);
              assert.equal(await optionNode.locator('th').count(), 8);
              assert.equal(await optionNode.locator('td').count(), 16);
            }
          }
        }
        assert.equal(await page.locator('[data-correct],.rationale,.answer-body').count(), 0);
      }
      if (view === 'answers') {
        assert.equal(await page.locator('[data-answer]').count(), answers.answers.length);
        for (const answer of answers.answers) {
          assert.equal(normalize(await sourceText(page.locator(`[data-answer="${answer.exercise}"] .answer-body`))), normalize(answer.displayAnswer));
        }
      }
      const geometry = await page.evaluate(() => {
        const blocks = [...document.querySelectorAll('.para,li.ex,.choice-stem,.choice-option-body,.answer-body')];
        return {
          documentWidth: document.documentElement.scrollWidth,
          blocks: blocks.map(element => {
            const box = element.getBoundingClientRect();
            return { width: box.width, height: box.height, left: box.left, right: box.right, indent: getComputedStyle(element).textIndent };
          }),
          proseFonts: [...document.querySelectorAll('p.para .katex,p.para .prose-math')].map(element => ({
            math: Number.parseFloat(getComputedStyle(element).fontSize),
            paragraph: Number.parseFloat(getComputedStyle(element.closest('p.para')).fontSize),
          })),
        };
      });
      assert.ok(geometry.documentWidth <= width + 1, `${view} page overflow at ${width}`);
      for (const block of geometry.blocks) {
        assert.ok(block.width > 0 && block.height > 0 && block.left >= -1 && block.right <= width + 1);
        if (view === 'text') assert.equal(block.indent, '0px');
      }
      for (const font of geometry.proseFonts) assert.ok(font.math >= font.paragraph && font.math >= 16);
      const scrolls = [];
      for (const node of await page.locator('.fig[data-figure-layout="scroll"],.nb,.choice-stem,.choice-option-body').all()) {
        const extent = await node.evaluate(element => element.scrollWidth - element.clientWidth);
        if (extent <= 1) continue;
        await node.evaluate(element => { element.scrollTo({ left: element.scrollWidth, behavior: 'instant' }); });
        await node.evaluate(element => {
          if (Math.abs(element.scrollLeft + element.clientWidth - element.scrollWidth) > 1) throw new Error('Unreachable horizontal end');
        });
        scrolls.push({ extent, endReached: true });
        await node.evaluate(element => { element.scrollTo({ left: 0, behavior: 'instant' }); });
      }
      const figures = await page.locator('figure.fig').evaluateAll(nodes => nodes.map(figure => {
        const svg = figure.querySelector('svg');
        const box = svg.getBoundingClientRect();
        return {
          id: figure.id, width: box.width, height: box.height,
          paths: svg.querySelectorAll('path,line,polygon,circle,rect').length,
          labels: [...svg.querySelectorAll('text')].map(text => {
            const matrix = text.getScreenCTM();
            return Number.parseFloat(text.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b);
          }),
        };
      }));
      for (const figure of figures) {
        const spec = JSON.parse(fs.readFileSync(path.join(book, 'editions/modern-us-neutral/figures', `${figure.id}.spec.json`)));
        assert.ok(figure.width > 0 && figure.height > 0 && figure.paths > 0);
        assert.equal(Math.round(figure.width), 640);
        assert.ok(figure.labels.length && Math.min(...figure.labels) >= spec.display.minTextPx - 0.1);
      }
      await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
      const last = page.locator(view === 'text' ? 'p.para' : view === 'exercises' ? 'li.ex' : 'section.choice').last();
      assert.ok(await last.isVisible());
      const lastBox = await last.boundingBox();
      assert.ok(lastBox.y + lastBox.height > 0 && lastBox.y + lastBox.height <= (width === 390 ? 844 : 960) + 1);
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      const screenshot = path.join(output, `${view}-${width}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      records.push({ width, view, fileSha256: hash(file), screenshot: path.basename(screenshot), screenshotSha256: hash(screenshot), geometry, figures, scrolls });
    }
  }
  assert.deepEqual(errors, []);
  fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify({
    status: 'pass', browser: 'isolated headless Chromium', lesson: id,
    counts: { written: exercises.count, choices: draft.questions.length, answers: answers.answers.length },
    inputs: Object.fromEntries(['lesson.json', 'exercises.json', 'figures.json', 'choice-set/draft.json', 'answer-keys.json']
      .map(name => [name, hash(path.join(lesson, name))])),
    records, visualReviewPending: true,
  }, null, 2) + '\n');
  console.log(JSON.stringify({ status: 'pass', observations: records.length, visualReviewPending: true }));
} catch (error) {
  fs.writeFileSync(path.join(output, 'failure.json'), JSON.stringify({ status: 'fail', error: String(error), stack: error.stack, records }, null, 2) + '\n');
  throw error;
} finally {
  await browser.close();
}

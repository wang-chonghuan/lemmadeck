import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { choiceHtml } from '../../../../../.claude/skills/ld-s10y-lesson/tools/choice_html.mjs';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const require = createRequire(`${repo}/app/package.json`);
const { chromium } = require('playwright');
const { inline, esc } = require(`${repo}/.claude/skills/ld-s10y-lesson/tools/htmlfrag.js`);
const T = '.intentfold/tickets/STEMROBIN-181';
const C = '.tmp/STEMROBIN-181/d1816-d470-n153-nonheld';
const V = `${T}/tmp/d1816-d471-review61-nonheld-package-review`;
const B = '.tmp/STEMROBIN-181/d1816-d472';
const O = `${T}/tmp/d1816-d472-n153-subset-display`;
const ID = 'phy10-c4-s3';
const R = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({
  path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
});
const verify = row => assert.equal(bind(row.path).sha256, row.sha256, row.path);
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(to, 0o644);
  return { from: bind(from), to: bind(to) };
};
const selected = Array.from({ length: 61 }, (_, i) => String(i + 1))
  .filter(number => !['2', '10'].includes(number));
assert(!fs.existsSync(B));
assert(!fs.existsSync(O));
const combined = read(`${C}/report.json`);
const review = read(`${V}/report.json`);
verify(review.inputs.authority);
for (const row of review.outputs) verify(row);
assert.equal(review.status, 'AGGREGATE_RELATIONSHIPS_PASS_CONDITIONAL');
const inputs = [];
for (const product of combined.products) {
  for (const row of [product.seed, product.draft, product.readonly, product.learnerViews]) {
    verify(row);
    inputs.push(row);
  }
}

// Preserve the full 61-task source and candidate for the official native call.
const copies = [];
const sourceRoot = '.tmp/STEMROBIN-181/d1816-d408/root/10p';
copies.push(copy(`${sourceRoot}/book.json`, `${B}/root/10p/book.json`));
for (const number of [27, 397, 398, 399, 400, 401])
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const suffix = `pages/${String(number).padStart(4, '0')}/${name}`;
    copies.push(copy(`${sourceRoot}/${suffix}`, `${B}/root/10p/${suffix}`));
  }
for (const name of ['lesson.json', 'lesson.md', 'exercises.json'])
  copies.push(copy(`${sourceRoot}/lessons/${ID}/${name}`, `${B}/root/10p/lessons/${ID}/${name}`));
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']])
  for (const name of ['lesson.json', 'exercises.json', 'figures.json'])
    copies.push(copy(`${C}/${locale}/repo/${R}/editions/modern-us-neutral/lessons/${ID}/${name}`,
      `${B}/root/10p/editions/${edition}/lessons/${ID}/${name}`));
save(`${O}/input-freeze.json`, {
  stage: 'D472', combined: bind(`${C}/report.json`), review: bind(`${V}/report.json`),
  inputs, copies, selectedSourceIds: selected, heldSourceIds: ['2', '10'],
  originalTasks: 61, wholeCourseApproval: false, memberReviewsReplayed: false,
});
let nativeFailure = null;
try {
  execFileSync('node', [
    `${T}/tmp/d1816-recovery/run-native.mjs`, 'd472-n153-zh-first-adapt-finalize',
    '.claude/skills/ld-s10y-lesson/.venv/bin/python',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'adapt-finalize',
    '--book', '10p', '--root', `${B}/root`, '--work', `${B}/source-work`,
    '--edition', 'modern-us-neutral', '--lesson', ID,
  ], { cwd: repo, stdio: 'inherit' });
} catch (error) {
  nativeFailure = { exitCode: error.status ?? null, message: error.message };
}
const nativeReceipt = bind(`${T}/tmp/d1816-recovery/native/d472-n153-zh-first-adapt-finalize/receipt.json`);
save(`${O}/native-result.json`, {
  stage: 'D472', nativeReceipt, failure: nativeFailure,
  status: nativeFailure ? 'native-failure-whole-course-held' : 'native-mechanical-only-whole-course-held',
  fullTaskCount: 61, dependentWholeCourseStagesStopped: true,
  candidateOrSourceEdits: 0, sourcePagesAdded: 0, completeCoursesAdded: 0,
});

// Reuse the established native sheet and shared renderers, not a subset course schema.
const nativeHtmlFile = '.tmp/STEMROBIN-181/d1816-d138/display/render/9p/modern-us-neutral/phy9-c1-s3-t9/exercises.html';
const nativeHtml = fs.readFileSync(nativeHtmlFile, 'utf8');
const supplementaryCss = '.sr-nb{display:inline-block;box-sizing:border-box;max-width:100%;overflow-x:auto;overflow-y:hidden;padding:.15em .1em .25em;vertical-align:middle;white-space:nowrap}.answer{margin-top:.7em;line-height:1.8}.choice-option{display:grid;grid-template-columns:1.8em minmax(0,1fr);gap:.4em;padding:.6em 0}.choice-option table{max-width:100%;border-collapse:collapse}.choice-option td,.choice-option th{border:1px solid var(--rule);padding:.3em}.choice-stem{line-height:1.8}.body{min-width:0}';
const plain = text => text.replaceAll('**', '').replace(/\s+/g, '').trim();
const unnumber = (number, text) => text.replace(new RegExp(`^${number}\\.[ \\n]*`), '');
const requests = [];
const records = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const viewport of [
    { name: 'desktop', width: 1440, height: 960 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    const context = await browser.newContext({ viewport });
    await context.route('**/*', route => { requests.push(route.request().url()); return route.abort(); });
    try {
      for (const locale of ['zh', 'en']) {
        const product = combined.products.find(row => row.locale === locale);
        const seed = read(product.seed.path);
        const draft = read(product.draft.path);
        const answers = read(product.readonly.path);
        const lesson = read(`${C}/${locale}/repo/${R}/editions/modern-us-neutral/lessons/${ID}/lesson.json`);
        assert.deepEqual(seed.exercises.map(row => row.number), selected);
        assert.deepEqual(answers.answers.map(row => row.exercise), selected);
        assert.equal(draft.questions.length, 55);
        assert(answers.answers.every(row => row.grading === 'ungraded' && row.parts.length === 0));
        assert.deepEqual(seed.figures, []);
        assert.deepEqual(draft.new_figures, []);
        for (const surface of ['written', 'answers', 'choices']) {
          const page = await context.newPage();
          const errors = [];
          page.on('pageerror', error => errors.push(error.message));
          page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
          await page.setContent(nativeHtml, { waitUntil: 'load' });
          await page.addStyleTag({ content: supplementaryCss });
          const rows = surface === 'choices' ? draft.questions : seed.exercises;
          const body = rows.map((row, index) => {
            if (surface === 'choices') {
              const options = row.view.options.map((option, optionIndex) =>
                `<div class="choice-option" data-option="${esc(option.id)}"><span>${String.fromCharCode(65 + optionIndex)}</span><div class="option-text">${choiceHtml(option.text)}</div></div>`).join('');
              return `<li class="ex" data-question="${esc(row.id)}" data-source="${esc(row.source_numbers[0])}" data-mode="${esc(row.view.mode)}"><div class="no">${index + 1}</div><div class="body"><div class="choice-stem">${choiceHtml(row.view.stem)}</div>${options}</div></li>`;
            }
            const answer = answers.answers.find(item => item.exercise === row.number);
            return `<li class="ex" data-source="${esc(row.number)}" id="ex-${esc(row.number)}"><div class="no">${esc(row.number)}</div><div class="body"><div class="written-stem">${inline(unnumber(row.number, row.text))}</div>${surface === 'answers' ? `<div class="answer">${inline(answer.displayAnswer)}</div>` : ''}</div></li>`;
          }).join('');
          await page.evaluate(({ html, title, locale }) => {
            document.documentElement.lang = locale;
            document.title = title;
            document.querySelector('.sheet').innerHTML = `<h1>${title}</h1><ol class="ex">${html}</ol>`;
          }, { html: body, title: esc(lesson.title), locale });
          await page.evaluate(() => document.fonts.ready);
          assert.equal(await page.locator('li.ex').count(), rows.length);
          assert.equal(await page.locator('[data-source="2"],[data-source="10"]').count(), 0);
          assert.equal(await page.locator('.choice-option').count(), surface === 'choices' ? 220 : 0);
          assert.equal(await page.locator('.answer').count(), surface === 'answers' ? 59 : 0);
          assert.equal(await page.locator('.err,.katex-error,.sr-tex-err,input,textarea,script,figure').count(), 0);
          const observed = await page.locator(surface === 'choices' ? '.choice-stem,.option-text' : '.written-stem,.answer')
            .evaluateAll(nodes => nodes.map(node => {
              const clone = node.cloneNode(true);
              for (const formula of clone.querySelectorAll('.katex'))
                formula.replaceWith(document.createTextNode(`$${formula.querySelector('annotation').textContent}$`));
              return clone.textContent;
            }));
          const expected = surface === 'choices'
            ? draft.questions.flatMap(row => [row.view.stem, ...row.view.options.map(option => option.text)])
            : seed.exercises.flatMap(row => [unnumber(row.number, row.text),
              ...(surface === 'answers' ? [answers.answers.find(item => item.exercise === row.number).displayAnswer] : [])]);
          assert.deepEqual(observed.map(plain), expected.map(plain));
          const html = await page.content();
          assert(!/source_solution|seed_sha256|correct_option_ids|HOLD:p0397/.test(html));
          const geometry = await page.evaluate(() => ({
            width: document.documentElement.scrollWidth,
            fontsLoaded: document.fonts.check('16px "KaTeX_Main"'),
            boxes: [...document.querySelectorAll('li.ex,.choice-option')].map(node => {
              const box = node.getBoundingClientRect();
              return { className: node.className, x: box.x, right: box.right,
                y: box.y, bottom: box.bottom, width: box.width, height: box.height };
            }),
          }));
          assert(geometry.fontsLoaded);
          assert(geometry.width <= viewport.width + 1);
          assert(geometry.boxes.every(box => box.x >= -1 && box.right <= viewport.width + 1 && box.width > 0 && box.height > 0));
          for (const className of ['ex', 'choice-option']) {
            const boxes = geometry.boxes.filter(box => box.className === className);
            for (let index = 1; index < boxes.length; index++)
              assert(boxes[index].y >= boxes[index - 1].bottom - 1);
          }
          assert.deepEqual(errors, []);
          const htmlFile = `${O}/${locale}-${viewport.name}-${surface}.html`;
          fs.writeFileSync(htmlFile, html, { flag: 'wx' });
          let screenshot = null;
          if (surface === 'choices' || (locale === 'zh' && viewport.name === 'desktop')
            || (locale === 'en' && viewport.name === 'mobile')) {
            if (surface === 'choices' && viewport.name === 'mobile') {
              const table = page.locator('.choice-option table').first();
              if (await table.count()) await table.scrollIntoViewIfNeeded();
            }
            const screenshotFile = `${O}/${locale}-${viewport.name}-${surface}.png`;
            await page.screenshot({ path: screenshotFile, fullPage: false });
            screenshot = bind(screenshotFile);
          }
          records.push({ locale, viewport, surface, rows: rows.length,
            options: surface === 'choices' ? 220 : 0, html: bind(htmlFile), screenshot,
            geometry, errors, status: 'pass' });
          save(`${O}/record-${records.length}.json`, records.at(-1));
          await page.close();
        }
      }
    } finally { await context.close(); }
  }
} finally { await browser.close(); }
assert.equal(records.length, 12);
assert.equal(records.filter(row => row.screenshot).length, 8);
assert.deepEqual(requests, []);
for (const row of inputs) verify(row);
save(`${O}/result.json`, {
  stage: 'D472', status: 'offline-approved-subset-display-pass-pixels-pending',
  inputs, nativeResult: bind(`${O}/native-result.json`), reusedNativeSheet: bind(nativeHtmlFile),
  records, requests, offline: true, headless: true, selectedSourceIds: selected,
  heldSourceIds: ['2', '10'], readonlyOnlySourceIds: ['1', '6', '35', '43'],
  perLocale: { written: 59, readonly: 59, choices: 55, options: 220 },
  memberReviewsReplayed: false, wholeCourseApproval: false, canonicalCourseRetention: false,
  productAcceptance: false, independentPixels: 'PENDING', parentImageOpens: 0,
  sourcePagesAdded: 0, completeCoursesAdded: 0, paidCalls: 0, databaseWrites: false,
});
console.log(JSON.stringify({ result: bind(`${O}/result.json`), surfaces: records.length, nativeFailure }));

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const W = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188';
assert.equal(fs.realpathSync(process.cwd()), W);
const require = createRequire(`${W}/app/package.json`);
const { chromium } = require('playwright');
const { choiceHtml } = await import(`${W}/.claude/skills/ld-s10y-lesson/tools/choice_html.mjs`);
const B = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g';
const L = 'geo68-c2-s4-n30';
const E = `${B}/editions/modern-us-neutral`;
const D = `${E}/lessons/${L}`;
const R = `.tmp/ld-s10y-lesson/render/6-8g/modern-us-neutral/${L}`;
const O = `${B}/evidence/stemrobin188-6g-n30/display7`;
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const onlyChoices = process.argv.includes('--choices-only');
const kinds = onlyChoices ? ['choices'] : ['text', 'exercises'];
const keys = read(`${D}/answer-keys.json`);
const lesson = read(`${D}/lesson.json`);
const exercises = read(`${D}/exercises.json`);
const draft = onlyChoices ? read(`${D}/choice-set/draft.json`) : null;
if (onlyChoices) assert.equal(read(`${D}/choice-set/review.json`).outcome, 'pass');
fs.mkdirSync(O, { recursive: true });
const results = [];
const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport });
    await context.route(/^https?:/, route => route.abort());
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    for (const kind of kinds) {
      await page.goto(pathToFileURL(path.resolve(R, `${kind === 'choices' ? 'text' : kind}.html`)).href);
      if (kind === 'exercises') {
        for (const answer of keys.answers) {
          const html = choiceHtml(answer.displayAnswer);
          await page.locator(`#ex-${answer.exercise} .body`).evaluate((node, html) => {
            const support = document.createElement('div');
            support.className = 'answer-support';
            support.innerHTML = html;
            node.append(support);
          }, html);
        }
        await page.addStyleTag({ content: '.answer-support{margin-top:16px;padding-top:12px;border-top:1px solid #ddd;overflow-x:auto;font-size:16px;line-height:1.8}.answer-support p{margin:8px 0}' });
      } else if (kind === 'choices') {
        assert.equal(draft.new_figures.length, 0);
        assert.ok(draft.questions.every(q => q.view.figure_ids.length === 0 && q.view.options.every(o => o.figure_ids.length === 0)));
        const css = await page.locator('head > style').textContent();
        const body = draft.questions.map(q => `<section class="choice-question"><div class="choice-stem">${choiceHtml(q.view.stem)}</div>${
          q.view.options.map(o => `<label class="choice-option"><input type="${q.view.mode === 'single' ? 'radio' : 'checkbox'}" name="${q.id}"><span class="choice-letter">${o.id}</span><span class="choice-content">${choiceHtml(o.text)}</span></label>`).join('')
        }</section>`).join('');
        await page.setContent(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}
          .choice-question{padding:20px 0;border-bottom:1px solid #ddd}
          .choice-stem{font-size:17px;line-height:1.9;margin-bottom:12px}
          .choice-option{display:flex;align-items:flex-start;gap:8px;margin:12px 0;font-size:16px;line-height:1.8;min-width:0}
          .choice-option input{flex:none;margin:8px 0 0;width:16px;height:16px}
          .choice-letter{flex:none;font-family:KaTeX_Main,serif}
          .choice-content{min-width:0;flex:1;overflow-x:auto}.choice-content p{margin:0}
          </style><main class="sheet"><h1>${choiceHtml(lesson.title)}</h1>${body}</main>`);
      }
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('.katex-error').count(), 0);
      if (kind === 'text') assert.equal(await page.locator('figure').count(), 4);
      if (kind === 'exercises') {
        assert.equal(await page.locator('li.ex').count(), exercises.exercises.length);
        assert.equal(await page.locator('.answer-support').count(), keys.answers.length);
      }
      if (kind === 'choices') {
        assert.equal(await page.locator('.choice-question').count(), draft.questions.length);
        assert.equal(await page.locator('input').count(), draft.questions.reduce((n, q) => n + q.view.options.length, 0));
      }
      const geometry = await page.evaluate(() => ({
        width: document.documentElement.scrollWidth,
        media: [...document.querySelectorAll('figure svg')].map(svg => ({
          figure: svg.closest('figure').id,
          width: svg.getBoundingClientRect().width,
          minLabelPx: Math.min(...[...svg.querySelectorAll('text')].map(t => parseFloat(getComputedStyle(t).fontSize) * Math.hypot(t.getScreenCTM().a, t.getScreenCTM().b))),
        })),
      }));
      assert.ok(geometry.width <= viewport.width + 1, `${kind} page overflows`);
      for (const media of geometry.media) {
        const spec = read(`${E}/figures/${media.figure}.spec.json`);
        assert.ok(media.width > 0 && media.minLabelPx >= spec.display.minTextPx - 0.1, `${media.figure} unreadable`);
      }
      assert.deepEqual(errors, []);
      const clips = kind === 'choices' ? await page.evaluate(() => {
        const height = document.documentElement.scrollHeight;
        const starts = [...document.querySelectorAll('.choice-question')].map(node => Math.floor(node.getBoundingClientRect().top + scrollY));
        const cuts = [0];
        while (height - cuts.at(-1) > 5500) {
          const next = starts.filter(y => y > cuts.at(-1) && y <= cuts.at(-1) + 5500).at(-1);
          if (next === undefined) throw new Error('Choice question exceeds bounded screenshot height');
          cuts.push(next);
        }
        cuts.push(height);
        return cuts.slice(0, -1).map((y, i) => ({ x: 0, y, width: innerWidth, height: cuts[i + 1] - y }));
      }) : [null];
      assert.ok(results.length + clips.length <= 8, 'Display batch exceeds eight images');
      for (const [index, clip] of clips.entries()) {
        const suffix = clips.length === 1 ? '' : `-part${index + 1}`;
        const screenshot = `${O}/${kind}-${viewport.width}${suffix}.png`;
        assert.ok(!fs.existsSync(screenshot), `Existing evidence: ${screenshot}`);
        await page.screenshot({ path: screenshot, ...(clip ? { clip } : { fullPage: true }) });
        results.push({ kind, viewport, geometry, ...(clip ? { clip } : {}), screenshot, sha256: sha(fs.readFileSync(screenshot)) });
      }
    }
    await context.close();
  }
} finally {
  await browser.close();
}
fs.writeFileSync(`${O}/${onlyChoices ? 'choices' : 'surfaces'}.json`, `${JSON.stringify({
  lesson: L, headless: true, offline: true, productFunctionalityTested: false,
  sourceHashes: Object.fromEntries(['lesson.json', 'exercises.json', 'answer-keys.json', ...(onlyChoices ? ['choice-set/draft.json'] : [])].map(file => [file, sha(fs.readFileSync(`${D}/${file}`))])),
  results, status: 'mechanical-pass-visual-review-pending',
}, null, 2)}\n`);
console.log(JSON.stringify({ status: 'mechanical-pass-visual-review-pending', screenshots: results.map(r => r.screenshot) }));

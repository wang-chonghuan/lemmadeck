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
const L = 'geo68-c3-s2-n35';
const E = `${B}/editions/modern-us-neutral`;
const D = `${E}/lessons/${L}`;
const R = `.tmp/ld-s10y-lesson/render/6-8g/modern-us-neutral/${L}`;
const O = `${B}/evidence/stemrobin188-6g-n35/display7`;
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const affected = process.argv[2] === 'exercises-layout';
const kind = affected ? 'exercises' : process.argv[2];
const outputName = affected ? 'exercises-layout7' : kind;
const fragmentMathCss = '.sr-nb{display:inline-block;max-width:100%;overflow-x:auto;scrollbar-width:none;text-indent:0;vertical-align:middle;white-space:nowrap}.sr-nb::-webkit-scrollbar{display:none}';
assert.ok(['text', 'exercises', 'choices'].includes(kind), 'Select one display batch');
const keys = read(`${D}/answer-keys.json`);
const lesson = read(`${D}/lesson.json`);
const exercises = read(`${D}/exercises.json`);
const draft = kind === 'choices' ? read(`${D}/choice-set/draft.json`) : null;
const seed = draft ? read(`${D}/choice-set/seed.json`) : null;
if (draft) assert.equal(read(`${D}/choice-set/review.json`).outcome, 'pass');
fs.mkdirSync(O, { recursive: true });
assert.ok(!fs.existsSync(`${O}/${outputName}.json`), 'Existing display evidence');
const results = [];
const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport });
    await context.route(/^https?:/, route => route.abort());
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(pathToFileURL(path.resolve(R, `${kind === 'choices' ? 'text' : kind}.html`)).href);
    if (kind === 'exercises') {
      for (const answer of keys.answers) {
        await page.locator(`#ex-${answer.exercise} .body`).evaluate((node, html) => {
          const support = document.createElement('div');
          support.className = 'answer-support';
          support.innerHTML = html;
          node.append(support);
        }, choiceHtml(answer.displayAnswer));
      }
      await page.addStyleTag({ content: `${fragmentMathCss}.answer-support{margin-top:16px;padding-top:12px;border-top:1px solid #ddd;overflow-x:auto;font-size:16px;line-height:1.8}.answer-support p{margin:8px 0}` });
      if (affected) {
        await page.locator('li.ex').evaluateAll(nodes => {
          for (const node of nodes) {
            if (!['ex-451', 'ex-454', 'ex-456', 'ex-459'].includes(node.id)) node.remove();
            else if (node.id !== 'ex-451') node.querySelector('.answer-support').remove();
          }
        });
      }
    } else if (kind === 'choices') {
      const css = await page.locator('head > style').textContent();
      const media = ids => ids.map(id => {
        const existing = seed.figures.find(figure => figure.id === id);
        const authored = draft.new_figures.find(figure => figure.id === id);
        assert.ok(existing || authored, `Unknown choice asset ${id}`);
        const assets = existing ? existing.assets : [{ path: authored.path, sha256: authored.sha256 }];
        const specFile = `${E}/figures/${id}.spec.json`;
        const display = fs.existsSync(specFile) ? read(specFile).display : {};
        const content = assets.map(asset => {
          assert.equal(sha(asset.path), asset.sha256, `Choice asset drift: ${asset.path}`);
          if (path.extname(asset.path) === '.svg') return fs.readFileSync(asset.path, 'utf8');
          const extension = path.extname(asset.path).slice(1);
          const type = extension === 'jpg' ? 'jpeg' : extension;
          return `<img alt="" src="data:image/${type};base64,${fs.readFileSync(asset.path).toString('base64')}">`;
        }).join('');
        const width = display.maxWidthPx;
        return `<figure id="${id}" class="choice-figure ${display.layout === 'scroll' ? 'scroll' : ''}"${width ? ` style="max-width:${width}px"` : ''}>${content}</figure>`;
      }).join('');
      const body = draft.questions.map(q => `<section class="choice-question"><div class="choice-stem">${choiceHtml(q.view.stem)}</div>${media(q.view.figure_ids)}${
        q.view.options.map(o => `<label class="choice-option"><input type="${q.view.mode === 'single' ? 'radio' : 'checkbox'}" name="${q.id}"><span class="choice-letter">${o.id}</span><span class="choice-content">${choiceHtml(o.text)}${media(o.figure_ids)}</span></label>`).join('')
      }</section>`).join('');
      await page.setContent(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}${fragmentMathCss}
        .choice-question{padding:20px 0;border-bottom:1px solid #ddd}
        .choice-stem{font-size:17px;line-height:1.9;margin-bottom:12px}
        .choice-option{display:flex;align-items:flex-start;gap:8px;margin:12px 0;font-size:16px;line-height:1.8;min-width:0}
        .choice-option input{flex:none;margin:8px 0 0;width:16px;height:16px}
        .choice-letter{flex:none;font-family:KaTeX_Main,serif}
        .choice-content{min-width:0;flex:1;overflow-x:auto}.choice-content p{margin:0}
        .choice-figure{margin:12px 0;overflow-x:auto}.choice-figure svg{width:100%;height:auto}
        .choice-figure.scroll svg{width:640px;max-width:none}
        </style><main class="sheet"><h1>${choiceHtml(lesson.title)}</h1>${body}</main>`);
    }
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('.katex-error').count(), 0);
    if (kind === 'text') {
      const count = lesson.prose.filter(block => block.kind === 'fig').length;
      assert.equal(await page.locator('figure').count(), count);
    }
    if (kind === 'exercises') {
      assert.equal(await page.locator('li.ex').count(), affected ? 4 : exercises.exercises.length);
      assert.equal(await page.locator('.answer-support').count(), affected ? 1 : keys.answers.length);
      assert.equal(await page.locator('figure').count(),
        affected ? 0 : exercises.exercises.reduce((count, exercise) => count + exercise.figures.length, 0));
    }
    if (kind === 'choices') {
      assert.equal(await page.locator('.choice-question').count(), draft.questions.length);
      assert.equal(await page.locator('input').count(),
        draft.questions.reduce((count, q) => count + q.view.options.length, 0));
    }
    const geometry = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      media: [...document.querySelectorAll('figure svg')].map(svg => {
        const labels = [...svg.querySelectorAll('text')];
        let scroll = svg.parentElement;
        while (scroll && scroll.tagName !== 'FIGURE'
          && scroll.scrollWidth <= scroll.clientWidth + 1) scroll = scroll.parentElement;
        const before = scroll.scrollLeft;
        const end = Math.max(0, scroll.scrollWidth - scroll.clientWidth);
        scroll.scrollLeft = end;
        const reached = scroll.scrollLeft;
        scroll.scrollLeft = before;
        return {
          figure: svg.closest('figure').id,
          width: svg.getBoundingClientRect().width,
          scroll: { clientWidth: scroll.clientWidth, end, reached },
          labelCount: labels.length,
          minLabelPx: labels.length ? Math.min(...labels.map(text =>
            parseFloat(getComputedStyle(text).fontSize) * Math.hypot(text.getScreenCTM().a, text.getScreenCTM().b))) : null,
        };
      }),
    }));
    assert.ok(geometry.width <= viewport.width + 1, `${kind} page overflows`);
    for (const media of geometry.media) {
      const specFile = `${E}/figures/${media.figure}.spec.json`;
      const minTextPx = fs.existsSync(specFile) ? read(specFile).display.minTextPx : 16;
      assert.ok(media.width > 0, `${media.figure} blank`);
      assert.ok(Math.abs(media.scroll.end - media.scroll.reached) <= 1,
        `${media.figure} cannot reach scroll end`);
      if (media.labelCount)
        assert.ok(media.minLabelPx >= minTextPx - 0.1, `${media.figure} unreadable`);
    }
    assert.deepEqual(errors, []);
    const clips = await page.evaluate(kind => {
      const height = document.documentElement.scrollHeight;
      const selector = kind === 'choices' ? '.choice-question' : kind === 'exercises' ? 'li.ex' : '.sheet > p, .sheet > figure, .sheet > .fig';
      const starts = [...document.querySelectorAll(selector)].map(node => Math.floor(node.getBoundingClientRect().top + scrollY));
      const cuts = [0];
      while (height - cuts.at(-1) > 5500) {
        const next = starts.filter(y => y > cuts.at(-1) && y <= cuts.at(-1) + 5500).at(-1);
        if (next === undefined) throw new Error('Content object exceeds bounded screenshot height');
        cuts.push(next);
      }
      cuts.push(height);
      return cuts.slice(0, -1).map((y, index) => ({ x: 0, y, width: innerWidth, height: cuts[index + 1] - y }));
    }, kind);
    assert.ok(results.length + clips.length <= 8, 'Display batch exceeds eight images');
    for (const [index, clip] of clips.entries()) {
      const suffix = clips.length === 1 ? '' : `-part${index + 1}`;
      const screenshot = `${O}/${outputName}-${viewport.width}${suffix}.png`;
      assert.ok(!fs.existsSync(screenshot), `Existing evidence: ${screenshot}`);
      await page.screenshot({ path: screenshot, fullPage: true, clip });
      results.push({ kind, viewport, geometry, clip, screenshot, sha256: sha(screenshot) });
    }
    await context.close();
  }
} finally {
  await browser.close();
}
fs.writeFileSync(`${O}/${outputName}.json`, `${JSON.stringify({
  lesson: L, headless: true, offline: true, productFunctionalityTested: false,
  scope: affected ? { prompts: ['454', '456', '459'], answers: ['451'],
    reusedCompleteCoverage: `${O}/exercises.json` } : 'complete',
  sourceHashes: Object.fromEntries(['lesson.json', 'exercises.json', 'answer-keys.json',
    ...(draft ? ['choice-set/draft.json'] : [])].map(file => [file, sha(`${D}/${file}`)])),
  results, status: 'mechanical-pass-visual-review-pending',
}, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ status: 'mechanical-pass-visual-review-pending',
  screenshots: results.map(result => result.screenshot) }));

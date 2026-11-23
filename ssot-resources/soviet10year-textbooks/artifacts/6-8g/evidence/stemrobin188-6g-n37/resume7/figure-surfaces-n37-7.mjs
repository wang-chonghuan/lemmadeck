import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const W = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188';
assert.equal(fs.realpathSync(process.cwd()), W);
const require = createRequire(`${W}/app/package.json`);
const { chromium } = require('playwright');
const { choiceHtml } = await import(`${W}/.claude/skills/ld-s10y-lesson/tools/choice_html.mjs`);
const N = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n37';
const O = `${N}/figure-surfaces7`;
const T = `${N}/text-author7/candidate`;
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const cssFile = 'app/src/styles/app.css';
const routeFile = 'app/src/routes/_app/card.$id.tsx';
const css = fs.readFileSync(cssFile, 'utf8');
const katexRoot = '.claude/skills/ld-s10y-lesson/node_modules/katex/dist';
const mathCss = fs.readFileSync(`${katexRoot}/katex.min.css`, 'utf8')
  .replace(/src:[^;}]*(?=[;}])/g, src => {
    const match = src.match(/url\(fonts\/(KaTeX_[\w-]+)\.woff2\)/);
    if (!match) return src;
    return `src:url(data:font/woff2;base64,${fs.readFileSync(`${katexRoot}/fonts/${match[1]}.woff2`).toString('base64')}) format('woff2')`;
  });
const lesson = read(`${T}/lesson.template.json`);
const exercises = read(`${T}/exercises.template.json`);
const sourceFiles = [cssFile, routeFile, `${T}/lesson.template.json`, `${T}/exercises.template.json`];
function media(id, role) {
  const root = `${N}/${id === 'fig-229' ? 'figure-provenance-repair7' : 'fig229231-author7'}`;
  const spec = read(`${root}/${id}.spec.json`);
  sourceFiles.push(`${root}/${id}.spec.json`, `${root}/${id}.svg`);
  const svg = fs.readFileSync(`${root}/${id}.svg`, 'utf8');
  const className = role === 'prose' ? 'sr-read-fig' : 'sr-ex-fig';
  return `<figure class="${className}" data-figure-id="${id}" data-figure-layout="${spec.display.layout}" data-figure-purpose="${spec.display.purpose}"><div class="sr-figure-media" data-figure-mode="${spec.mode}" data-figure-purpose="${spec.display.purpose}" data-figure-theme="neutral" style="width:${spec.display.maxWidthPx}px;max-width:100%"><div class="sr-figure-vector" aria-hidden="true">${svg}</div></div></figure>`;
}
const prose = `<div class="sr-read"><p class="sr-read-p">${choiceHtml(lesson.prose[0].text)}</p>${media('fig-229', 'prose')}</div>`;
const tasks = ['479', '486'].map(number => {
  const exercise = exercises.exercises.find(item => item.number === number);
  assert.equal(exercise.figures.length, 1);
  return `<section class="sr-ex-wrap"><article class="sr-ex" id="ex-${number}"><div class="sr-ex-n sr-num">${number}</div><div class="sr-ex-body"><div>${choiceHtml(exercise.text)}</div>${media(exercise.figures[0].id, 'exercise')}</div></article></section>`;
}).join('');
const html = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${mathCss}${css}</style><div class="sr-page sr-app"><main class="sr-detail"><div class="sr-d-top"><span class="sr-d-title">${lesson.title}</span></div><div class="sr-d-scroll"><article class="sr-deck"><h1 class="sr-deck-title">${lesson.title}</h1>${prose}<div class="sr-ex-list">${tasks}</div></article></div></main></div>`;
fs.mkdirSync(O, { recursive: true });
assert.ok(!fs.existsSync(`${O}/manifest.json`), 'Existing affected surface evidence');
fs.writeFileSync(`${O}/surface.html`, html, { flag: 'wx' });
const results = [];
const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport });
    await context.route(/^https?:/, route => route.abort());
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setContent(html);
    await page.evaluate(() => document.fonts.ready);
    const geometry = await page.locator('figure').evaluateAll(nodes => nodes.map(figure => {
      const svg = figure.querySelector('svg');
      const labels = [...svg.querySelectorAll('text')];
      const rect = svg.getBoundingClientRect();
      return {
        id: figure.dataset.figureId,
        role: figure.classList.contains('sr-read-fig') ? 'prose' : 'exercise',
        containerWidth: figure.getBoundingClientRect().width,
        mediaWidth: figure.querySelector('.sr-figure-media').getBoundingClientRect().width,
        svgWidth: rect.width, svgHeight: rect.height,
        labels: labels.map(text => ({
          text: text.textContent,
          pixels: parseFloat(getComputedStyle(text).fontSize)
            * Math.hypot(text.getScreenCTM().a, text.getScreenCTM().b),
        })),
      };
    }));
    assert.equal(geometry.length, 3);
    for (const figure of geometry) {
      assert.ok(figure.svgWidth > 0 && figure.svgHeight > 0);
      assert.ok(figure.svgWidth <= figure.containerWidth + 1);
      assert.ok(figure.labels.every(label => label.pixels >= 16));
    }
    assert.deepEqual(errors, []);
    await page.addStyleTag({ content: 'html,body{height:auto;overflow:visible}.sr-app{height:auto;min-height:100dvh;overflow:visible}.sr-d-scroll{overflow:visible}' });
    const after = await page.locator('figure svg').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().width));
    assert.deepEqual(after, geometry.map(figure => figure.svgWidth), 'Full-height capture must not change media widths');
    const screenshot = `${O}/surface-${viewport.width}.png`;
    assert.ok(!fs.existsSync(screenshot));
    await page.screenshot({ path: screenshot, fullPage: true });
    results.push({ viewport, geometry, screenshot, sha256: sha(screenshot),
      fullHeightCaptureChangesHeightOnly: true, widthsUnchangedAfterCaptureAdjustment: true });
    await context.close();
  }
} finally {
  await browser.close();
}
fs.writeFileSync(`${O}/manifest.json`, `${JSON.stringify({
  status: 'affected-mechanical-pass-visual-review-pending',
  scope: 'Only candidate figures229/prose and230231/exercise in current app DOM/CSS media containers.',
  offlineAppContainerFixture: true, runningProductOrDbTested: false,
  sourceHashes: Object.fromEntries([...new Set(sourceFiles)].map(file => [file, sha(file)])),
  html: { path: `${O}/surface.html`, sha256: sha(`${O}/surface.html`) },
  results, imagesOpenedByParent: 0, rendererReplays: 0,
}, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ status: 'affected-mechanical-pass-visual-review-pending', results }));

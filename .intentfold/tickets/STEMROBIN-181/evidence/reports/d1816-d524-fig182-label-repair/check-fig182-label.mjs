import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const O = '.intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-d524-fig182-label-repair';
const require = createRequire(path.join(repo, 'app/package.json'));
const { chromium } = require('playwright');
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({ path: file, bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const spec = read(`${O}/candidate/spec.json`);
const native = read(`${O}/candidate/render.json`);
const oldSvg = fs.readFileSync(`${O}/before/figure.svg`, 'utf8');
const svg = fs.readFileSync(`${O}/candidate/figure.svg`, 'utf8');
assert.equal(native.status, 'pass');
assert.equal(bind(`${O}/candidate/figure.svg`).sha256, native.output.svg.sha256);
assert(!fs.existsSync(`${O}/width-check.json`));
const executablePath = [process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']
  .filter(Boolean).find(fs.existsSync);
assert(executablePath);
const browser = await chromium.launch({ executablePath, headless: true });
const startedAt = new Date().toISOString();
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const svgDifferences = await page.evaluate(({ oldSvg, svg }) => {
    const parse = text => new DOMParser().parseFromString(text, 'image/svg+xml').documentElement;
    const differences = [];
    const walk = (a, b, address) => {
      if (a.tagName !== b.tagName) differences.push({ address, kind: 'tag' });
      const attrs = new Set([...a.getAttributeNames(), ...b.getAttributeNames()]);
      for (const attribute of attrs)
        if (a.getAttribute(attribute) !== b.getAttribute(attribute))
          differences.push({ address, id: b.id, label: b.getAttribute('data-label-id'),
            attribute, before: a.getAttribute(attribute), after: b.getAttribute(attribute) });
      if (a.children.length !== b.children.length) differences.push({ address, kind: 'children' });
      if (!a.children.length && a.textContent !== b.textContent) differences.push({ address, kind: 'text' });
      for (let i = 0; i < Math.min(a.children.length, b.children.length); i++)
        walk(a.children[i], b.children[i], `${address}/${i}`);
    };
    walk(parse(oldSvg), parse(svg), '');
    return differences;
  }, { oldSvg, svg });
  assert.equal(svgDifferences.length, 2, JSON.stringify(svgDifferences));
  assert(svgDifferences.every(row => row.label === 's182-d-panel-name-label' && ['x', 'y'].includes(row.attribute)));
  const style = `
    :root { --ld-figure-ink:#15201f; --ld-figure-muted:#4c5a58;
      --ld-figure-accent:#15201f; --ld-figure-accent-soft:#8a9795;
      --ld-figure-grid:#e3eae9; --ld-figure-paper:#fff; }
    html,body { margin:0; background:#fff; }
    .media svg { display:block; width:100%; height:auto; }`;
  const receipts = [];
  for (const width of spec.display.widths) {
    await page.setViewportSize({ width, height: Math.ceil(spec.canvas.height * width / spec.canvas.width) });
    await page.setContent(`<!doctype html><style>${style}</style><div class="media" style="width:${width}px">${svg}</div>`);
    const dom = await page.evaluate(() => {
      const svg = document.querySelector('.media svg'), media = svg.getBoundingClientRect();
      const labels = [...svg.querySelectorAll('text')].map(node => {
        const box = node.getBoundingClientRect(), ctm = node.getScreenCTM();
        return { id: node.getAttribute('data-label-id'), text: node.textContent,
          px: Number(node.getAttribute('font-size')) * Math.hypot(ctm.a, ctm.b),
          left: box.left, top: box.top, right: box.right, bottom: box.bottom,
          inMedia: box.left >= media.left && box.top >= media.top && box.right <= media.right && box.bottom <= media.bottom };
      });
      const d = labels.find(label => label.id === 's182-d-panel-name-label');
      const title = labels.find(label => label.id === 'opening-small-label');
      const overlap = labels.filter(label => label !== d && Math.min(d.right, label.right) > Math.max(d.left, label.left)
        && Math.min(d.bottom, label.bottom) > Math.max(d.top, label.top)).map(label => label.id);
      return { mediaWidth: media.width, mediaHeight: media.height, labels, d, title, overlap };
    });
    assert.equal(dom.mediaWidth, width);
    assert.equal(dom.labels.length, native.labels);
    assert(dom.labels.every(label => label.px >= spec.display.minTextPx && label.inMedia));
    assert.deepEqual(dom.overlap, []);
    const screenshot = `${O}/candidate/display-${width}.png`;
    assert(!fs.existsSync(screenshot));
    const png = await page.locator('.media').screenshot({ path: screenshot, animations: 'disabled' });
    const pixels = await page.evaluate(async ({ base64, rect }) => {
      const image = new Image();
      image.src = `data:image/png;base64,${base64}`;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d'); context.drawImage(image, 0, 0);
      const rgba = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let dark = 0, nonwhite = 0, dDark = 0;
      for (let i = 0; i < rgba.length; i += 4) {
        const x = (i / 4) % canvas.width, y = Math.floor(i / 4 / canvas.width);
        if (rgba[i] < 245 || rgba[i + 1] < 245 || rgba[i + 2] < 245) nonwhite++;
        if (rgba[i] < 100 && rgba[i + 1] < 100 && rgba[i + 2] < 100) {
          dark++;
          if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) dDark++;
        }
      }
      return { width: canvas.width, height: canvas.height, dark, nonwhite, dDark,
        nonwhiteFraction: nonwhite / (canvas.width * canvas.height) };
    }, { base64: png.toString('base64'), rect: dom.d });
    assert(pixels.dark > 100 && pixels.nonwhiteFraction < 0.45);
    assert(pixels.dDark > 15, 'd-label has no dark glyph pixels');
    receipts.push({ width, screenshot: bind(screenshot), dom, pixels, mechanical: 'PASS' });
  }
  fs.writeFileSync(`${O}/width-check.json`, JSON.stringify({
    stage: 'D525', figure: '10p fig-182', status: 'AFFECTED_LABEL_DOM_AND_PIXEL_PASS',
    startedAt, finishedAt: new Date().toISOString(), headless: true,
    scope: 'Local figure candidate only, not formal full-card DISPLAY or independent review.',
    svgDifferences, receipts, rendererRerun: false, oldApprovalsInherited: false,
    semanticApertureSideHold: true, independentReview: 'PENDING',
  }, null, 2) + '\n', { flag: 'wx' });
  fs.copyFileSync(import.meta.filename, `${O}/check-fig182-label.mjs`, fs.constants.COPYFILE_EXCL);
  console.log(JSON.stringify({ stage: 'D525', svgChanges: 'Only d-label x/y',
    widths: spec.display.widths, mechanical: 'PASS', browserClosed: true, independentReview: 'PENDING' }));
} finally {
  await browser.close();
}

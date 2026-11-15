import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

delete process.env.PWDEBUG;
process.env.PLAYWRIGHT_HTML_OPEN = 'never';
process.env.PW_TEST_HTML_REPORT_OPEN = 'never';
const repo = process.cwd();
const dir = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.join(repo, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs'));
const { chromium } = require('playwright-core');
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const launchOptions = fs.existsSync(chrome) ? { executablePath: chrome, headless: true } : { headless: true };
const seed = JSON.parse(fs.readFileSync(path.join(dir, 'seed.json'), 'utf8'));
const figure = seed.figures.find(f => f.id === 'fig-135');
const pngAsset = figure.assets.find(a => a.path.endsWith('.png'));
const svgAsset = figure.assets.find(a => a.path.endsWith('.svg'));
const svgBytes = fs.readFileSync(path.join(repo, svgAsset.path));
const pngBytes = fs.readFileSync(path.join(repo, pngAsset.path));
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
if (sha256(svgBytes) !== svgAsset.sha256 || sha256(pngBytes) !== pngAsset.sha256) {
  throw new Error('Source asset bytes no longer match prepared seed');
}
const outputDir = path.join(dir, 'figure-previews');
fs.mkdirSync(outputDir, { recursive: true });
const report = {
  identity: 'STEMROBIN-182-Session-A-5m-n38-author',
  launch_options: launchOptions,
  pwdebug_unset_before_playwright_import: true,
  html_report_open: 'never',
  isolated_nonpersistent_context: true,
  external_network: 'aborted',
  assets: figure.assets.map(a => ({ ...a, byte_sha256_confirmed: true })),
  renders: [],
  browser_closed: false,
};
const browser = await chromium.launch(launchOptions);
try {
  const context = await browser.newContext({ viewport: { width: 1040, height: 980 }, deviceScaleFactor: 1 });
  await context.route('**/*', route => route.abort());
  const page = await context.newPage();
  const imageMarkup = `<img src="data:image/png;base64,${pngBytes.toString('base64')}" alt="">`;
  const svgMarkup = svgBytes.toString('utf8');
  for (const [name, markup] of [
    ['fig-135-svg-full-1000', svgMarkup],
    ['fig-135-artwork-full-1000', imageMarkup],
    ['fig-135-composite-full-1000', `<div class="composite">${imageMarkup}${svgMarkup}</div>`],
  ]) {
    await page.setContent(`<html><head><style>
      html,body{margin:0;background:white;}
      body{padding:16px;width:1000px;}
      svg,img{display:block;width:1000px;height:auto;}
      svg{height:937.5px;}
      .composite{position:relative;width:1000px;height:937.5px;}
      .composite>svg,.composite>img{position:absolute;left:0;top:0;width:1000px;height:937.5px;}
    </style></head><body>${markup}</body></html>`);
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map(img => img.decode()));
    });
    const dimensions = await page.evaluate(() => [...document.querySelectorAll('svg,img')].map(e => {
      const b = e.getBoundingClientRect();
      return {
        tag: e.tagName,
        x: b.x, y: b.y, width: b.width, height: b.height,
        right: b.right, bottom: b.bottom,
        natural_width: e instanceof HTMLImageElement ? e.naturalWidth : null,
        natural_height: e instanceof HTMLImageElement ? e.naturalHeight : null,
        view_box: e.tagName.toLowerCase() === 'svg' ? e.getAttribute('viewBox') : null,
        entire_extent_inside_viewport: b.x >= 0 && b.y >= 0 && b.right <= innerWidth && b.bottom <= innerHeight,
      };
    }));
    if (dimensions.some(d => d.width !== 1000 || !d.entire_extent_inside_viewport)) {
      throw new Error('Actual source render is cropped or does not have requested width');
    }
    const screenshot = path.join(outputDir, `${name}.png`);
    await page.screenshot({ path: screenshot, fullPage: true });
    report.renders.push({ name, screenshot: path.relative(repo, screenshot), dimensions });
  }
  await context.close();
} finally {
  await browser.close();
  report.browser_closed = true;
  fs.writeFileSync(path.join(dir, 'source-figure-render.json'), `${JSON.stringify(report, null, 2)}\n`);
}
console.log(JSON.stringify(report, null, 2));

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire('/Users/yong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/');
const { chromium } = require('playwright');
const own = path.dirname(new URL(import.meta.url).pathname);
const seed = JSON.parse(fs.readFileSync(path.join(own, 'seed.json'), 'utf8'));
const browser = await chromium.launch({ headless: true });
const records = [];
try {
  const context = await browser.newContext({ offline: true });
  await context.route('**/*', route => {
    const url = route.request().url();
    return url.startsWith('file:') || url.startsWith('data:')
      ? route.continue() : route.abort();
  });
  for (const figure of seed.figures) {
    for (const asset of figure.assets) {
      const page = await context.newPage();
      await page.goto(pathToFileURL(path.resolve(asset.path)).href);
      const size = await page.evaluate(() => {
        const svg = document.documentElement;
        const box = svg.viewBox.baseVal;
        return {
          width: Math.ceil(box.width || svg.width.baseVal.value),
          height: Math.ceil(box.height || svg.height.baseVal.value),
          viewBox: [box.x, box.y, box.width, box.height],
        };
      });
      console.log(JSON.stringify({ figure_id: figure.id, size }));
      await page.setViewportSize({ width: size.width, height: size.height });
      const html = path.join(own, `${figure.id}-wrapper.html`);
      fs.writeFileSync(html, `<html><body style="margin:0;background:white"><img width="${size.width}" height="${size.height}" src="${pathToFileURL(path.resolve(asset.path)).href}"></body></html>`);
      await page.goto(pathToFileURL(html).href);
      await page.locator('img').evaluate(img => img.decode());
      const output = path.join(own, `${figure.id}-full.png`);
      await page.screenshot({ path: output, fullPage: true, animations: 'disabled', timeout: 60000 });
      records.push({ figure_id: figure.id, asset, output, size, full_page: true });
      await page.close();
    }
  }
} finally {
  await browser.close();
}
fs.writeFileSync(path.join(own, 'CAPTURE-RESULT.json'), JSON.stringify({
  runtime: 'app-installed Playwright; headless; offline; file/data only',
  records,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify(records, null, 2));

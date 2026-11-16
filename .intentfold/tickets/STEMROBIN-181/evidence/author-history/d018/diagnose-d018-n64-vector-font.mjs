import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { bind, ticket, absolute } from './retain-d016-evidence.mjs';

delete process.env.PWDEBUG;
process.env.PLAYWRIGHT_HTML_OPEN = 'never';
const { chromium } = createRequire(absolute('app/package.json'))('playwright');
const folder = `${ticket}/tmp/d018-n64-vector-font-diagnosis`;
await fs.mkdir(folder, { recursive: true });
const file = '.tmp/ld-s10y-lesson/render/9p/modern-us-neutral/phy9-c2-s2-n64/text.html';
const browser = await chromium.launch({ headless: true });
const observations = [];
try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 960 } });
    const page = await context.newPage();
    await page.goto(pathToFileURL(absolute(file)).href);
    await page.evaluate(() => document.fonts.ready);
    const collect = () => page.evaluate(() => [...document.querySelectorAll('figure svg text')]
      .filter(text => text.textContent.includes('\u20d7')).map(text => {
        const box = text.getBBox();
        return {
          id: text.dataset.labelId, text: text.textContent, font: getComputedStyle(text).fontFamily,
          fontSize: getComputedStyle(text).fontSize, bbox: { x: box.x, y: box.y, width: box.width, height: box.height },
        };
      }));
    const before = await collect();
    await page.addStyleTag({ content: '.figure-media svg text[data-label-id]{font-family:Arial,KaTeX_Main,Helvetica,sans-serif}' });
    await page.evaluate(() => document.fonts.ready);
    const after = await collect();
    const images = [];
    for (const id of ['fig-108', 'fig-109']) {
      const image = `${folder}/${id}-fallback-${width}.png`;
      await page.locator(`#${id}`).screenshot({ path: absolute(image) });
      images.push(await bind(image));
    }
    observations.push({ width, before, after, images });
    await context.close();
  }
} finally {
  await browser.close();
}
await fs.writeFile(path.join(folder, 'diagnosis.json'), `${JSON.stringify({
  role: 'Confirmed F1 only: compare original SVG-label font fallback after adding existing bundled KaTeX_Main as fallback. No source/spec/media edit or acceptance result.',
  originalHtml: await bind(file), observations, browserClosed: true,
}, null, 2)}\n`, { flag: 'wx' });
console.log(folder);

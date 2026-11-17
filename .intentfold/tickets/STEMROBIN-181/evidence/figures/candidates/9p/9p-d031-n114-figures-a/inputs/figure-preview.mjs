import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(path.resolve('app/package.json'));
const { chromium } = require('playwright');
const [file, output, ...requestedWidths] = process.argv.slice(2);
const raster = file.endsWith('.png');
const content = raster
  ? `<img src="data:image/png;base64,${(await fs.readFile(file)).toString('base64')}">`
  : await fs.readFile(file, 'utf8');
const widths = requestedWidths.length ? requestedWidths.map(Number) : [640, 331, 342];
const browser = await chromium.launch({ headless: false });
try {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width: 700, height: 900 } });
    await page.setContent(`<style>
      body{margin:0;background:white}
      svg,img{display:block;width:${width}px;height:auto;--ld-figure-ink:#1b1b1b;
      --ld-figure-muted:#6b6b6b;--ld-figure-accent:#1b1b1b;--ld-figure-accent-soft:#6b6b6b;
      --ld-figure-grid:#e3e3e3;--ld-figure-paper:#fff}
    </style>${content}`);
    await page.evaluate(() => document.fonts.ready);
    await page.locator(raster ? 'img' : 'svg').screenshot({ path: `${output}-${width}.png` });
    await page.close();
  }
} finally {
  await browser.close();
}

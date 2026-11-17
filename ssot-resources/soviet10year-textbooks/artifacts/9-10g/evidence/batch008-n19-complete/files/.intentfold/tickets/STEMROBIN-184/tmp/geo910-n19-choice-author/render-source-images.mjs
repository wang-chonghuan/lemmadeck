import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const own = dirname(fileURLToPath(import.meta.url));
const repo = resolve(own, '../../../../..');
const require = createRequire(resolve(repo, 'app/package.json'));
const { chromium } = require('playwright');
const seedBytes = await readFile(resolve(own, '../geo910-n19-choice-seed.json'));
const seed = JSON.parse(seedBytes);
const canonical = value => {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value).replace(/[\u007f-\uffff]/g, char =>
    `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`);
};
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const seedDigest = hash(canonical(seed));
assert.equal(seedDigest, '21aba5ade30915e19ae40469c14a891e7b70f16f33ac4e9c32f7fe14536de2f4');
console.log(JSON.stringify({ seedDigest, seedFileSha256: hash(seedBytes), cwd: process.cwd(), width: 640 }));

const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 672, height: 1200 }, deviceScaleFactor: 1 });
  await context.route('**/*', route => route.abort());
  for (const figure of seed.figures) {
    for (const asset of figure.assets) {
      const bytes = await readFile(resolve(repo, asset.path));
      assert.equal(hash(bytes), asset.sha256);
      const page = await context.newPage();
      await page.setContent(`<html><head><style>html,body{margin:0;background:#fff}img{display:block;width:640px;height:auto;margin:16px}</style></head><body><img src="data:image/svg+xml;base64,${bytes.toString('base64')}"></body></html>`);
      await page.locator('img').evaluate(async image => { await image.decode(); });
      const dimensions = await page.locator('img').evaluate(image => ({
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
        renderedWidth: image.getBoundingClientRect().width,
        renderedHeight: image.getBoundingClientRect().height
      }));
      assert.equal(dimensions.renderedWidth, 640);
      const screenshot = resolve(own, `${figure.id}-normal-640.png`);
      await page.locator('img').screenshot({ path: screenshot });
      console.log(JSON.stringify({ figureId: figure.id, assetPath: asset.path, assetSha256: hash(bytes), ...dimensions, screenshot, screenshotSha256: hash(await readFile(screenshot)) }));
      await page.close();
    }
  }
  await context.close();
} finally {
  await browser.close();
}

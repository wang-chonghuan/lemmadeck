import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const renderer = path.resolve('.agents/skills/ld-s10y-image/scripts/render_spec.mjs');
const require = createRequire(renderer);
const { chromium } = require('playwright-core');
const launch = chromium.launch.bind(chromium);
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
delete process.env.PWDEBUG;
process.env.PLAYWRIGHT_HTML_OPEN = 'never';
let launches = 0;

// Capture widths in the native renderer's isolated browser, without changing SVG bytes.
chromium.launch = async options => {
  assert.equal(options.headless, true);
  assert.equal(++launches, 1);
  const browser = await launch(options);
  const newPage = browser.newPage.bind(browser);
  browser.newPage = async options => {
    const page = await newPage(options);
    await page.route(/https?:\/\//, route => route.abort());
    const screenshot = page.screenshot.bind(page);
    page.screenshot = async options => {
      const result = await screenshot(options);
      if (!options.path?.endsWith('candidate.png')) return result;
      const folder = path.dirname(options.path);
      const manifest = path.join(folder, 'width-previews.json');
      assert(!fs.existsSync(manifest));
      const box = await page.evaluate(() => {
        const b = document.querySelector('svg').viewBox.baseVal;
        return { width: b.width, height: b.height };
      });
      const outputs = [];
      for (const width of [640, 331, 342]) {
        const height = Math.ceil(width * box.height / box.width);
        await page.setViewportSize({ width, height });
        await page.evaluate(({ width, height }) => {
          const svg = document.querySelector('svg');
          svg.setAttribute('width', String(width));
          svg.setAttribute('height', String(height));
          svg.style.width = `${width}px`;
          svg.style.height = `${height}px`;
        }, { width, height: width * box.height / box.width });
        const labels = await page.evaluate(() =>
          [...document.querySelectorAll('text[data-label-id]')].map(node => {
            const m = node.getScreenCTM();
            return { id: node.getAttribute('data-label-id'), text: node.textContent,
              finalPx: Number(node.getAttribute('font-size')) * Math.hypot(m.a, m.b) };
          }));
        const file = path.join(folder, `width-${width}.png`);
        assert(!fs.existsSync(file));
        await screenshot({ path: file, type: 'png', animations: 'disabled' });
        outputs.push({ path: file, sha256: sha(file), width, height, labels,
          minimumTextPx: Math.min(...labels.map(label => label.finalPx)),
          actuallyOpened: false, captureOnlyNotIndependentApproval: true });
      }
      fs.writeFileSync(manifest, `${JSON.stringify({
        schema: 'ld-s10y-image/author-width-previews@1',
        renderer: { path: renderer, sha256: sha(renderer) },
        headless: true, nativeRendererSessionOnly: true, networkBlocked: true,
        outputs,
      }, null, 2)}\n`, { flag: 'wx' });
      return result;
    };
    return page;
  };
  return browser;
};

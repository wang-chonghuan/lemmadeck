import { chromium } from '../../../../../app/node_modules/playwright/index.mjs';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const scratch = dirname(fileURLToPath(import.meta.url));
const browserTmp = join(scratch, 'browser-tmp');
mkdirSync(browserTmp, { recursive: true });
delete process.env.PWDEBUG;
process.env.PLAYWRIGHT_HTML_OPEN = 'never';
process.env.TMPDIR = browserTmp;
const seed = JSON.parse(readFileSync(join(scratch, 'seed.json'), 'utf8'));
const requests = [];
const evidence = [];
let browser;
try {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  await context.route(/^https?:/, async (route) => {
    requests.push(route.request().url());
    await route.abort();
  });
  const page = await context.newPage();
  for (const figure of seed.figures) {
    for (const width of [640, 390]) {
      await page.setViewportSize({ width, height: 844 });
      const asset = figure.assets[0];
      const source = resolve(root, asset.path);
      const svg = readFileSync(source, 'utf8');
      await page.setContent(`<html><head><style>
        html,body{margin:0;padding:0;background:white}
        svg{max-width:100%;height:auto;display:block}
      </style></head><body>${svg}</body></html>`);
      const geometry = await page.locator('svg').evaluate((svg) => {
        const rect = svg.getBoundingClientRect();
        return {
          left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom,
          width: rect.width, height: rect.height,
          viewportWidth: window.innerWidth,
          pageHeight: document.documentElement.scrollHeight,
          viewBox: svg.getAttribute('viewBox'),
          labels: [...svg.querySelectorAll('text')].map((node) => node.textContent),
        };
      });
      if (geometry.left < 0 || geometry.right > width + 0.1 ||
          geometry.bottom > geometry.pageHeight + 0.1) {
        throw new Error(`Unreachable figure ends: ${figure.id} at ${width}`);
      }
      const screenshot = join(scratch, `${figure.id}-${width}-full.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      evidence.push({
        id: figure.id,
        asset: asset.path,
        asset_sha256: createHash('sha256').update(readFileSync(source)).digest('hex'),
        screenshot: relative(root, screenshot),
        screenshot_sha256: createHash('sha256').update(readFileSync(screenshot)).digest('hex'),
        geometry,
      });
    }
  }
  await context.close();
} finally {
  if (browser) await browser.close();
}
const report = {
  headless: true,
  isolated: true,
  closed_in_finally: true,
  external_requests: requests,
  full_figure_renditions: evidence,
  original_pngs_opened_with_native_view: [
    'ssot-resources/soviet10year-textbooks/artifacts/5m/figures/fig-136.png',
    'ssot-resources/soviet10year-textbooks/artifacts/5m/figures/fig-137.png',
  ],
};
writeFileSync(join(scratch, 'image-observation-evidence.json'),
  `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify(report));

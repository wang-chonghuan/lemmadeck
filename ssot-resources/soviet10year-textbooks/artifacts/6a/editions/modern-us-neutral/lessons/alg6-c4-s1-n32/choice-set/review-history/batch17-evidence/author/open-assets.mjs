import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { chromium } from '../../../../../.agents/skills/node_modules/playwright-core/index.mjs';

delete process.env.PWDEBUG;
process.env.PLAYWRIGHT_HTML_OPEN = 'never';
const root = path.dirname(fileURLToPath(import.meta.url));
const seed = JSON.parse(fs.readFileSync(path.join(root, 'seed.json'), 'utf8'));
const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
if (!fs.existsSync(executablePath)) throw new Error('Authorized headless Chrome unavailable');
const browser = await chromium.launch({ executablePath, headless: true });
const captures = [];
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  for (const figure of seed.figures) for (const asset of figure.assets) {
    const bytes = fs.readFileSync(asset.path);
    if (createHash('sha256').update(bytes).digest('hex') !== asset.sha256) throw new Error('Asset changed');
    await page.setContent('<!doctype html><html><head><style>html,body{margin:0;background:white}:root{--ld-figure-ink:#15201f;--ld-figure-paper:#fff}</style></head><body>' + bytes.toString('utf8') + '</body></html>');
    await page.evaluate(() => document.fonts.ready);
    const svg = page.locator('svg');
    const bounds = await svg.boundingBox();
    await page.setViewportSize({ width: Math.ceil(bounds.width), height: Math.ceil(bounds.height) });
    const output = path.join(root, `${figure.id}-actual-full.png`);
    await svg.screenshot({ path: output });
    const texts = await svg.locator('text').allTextContents();
    captures.push({ figure_id: figure.id, asset, bounds, texts, screenshot: path.relative(process.cwd(), output), screenshot_sha256: createHash('sha256').update(fs.readFileSync(output)).digest('hex') });
  }
  await context.close();
} finally {
  await browser.close();
}
fs.writeFileSync(path.join(root, 'asset-capture.json'), JSON.stringify({
  launch: { executablePath, headless: true }, channel: 'isolated official playwright-core',
  PWDEBUG: null, html_report_open: 'never', user_ui_used: false, browser_closed: true, captures,
}, null, 2) + '\n');
console.log(JSON.stringify(captures, null, 2));

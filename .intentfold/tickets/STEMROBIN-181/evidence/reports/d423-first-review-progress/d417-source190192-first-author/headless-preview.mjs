import fs from 'node:fs';
import assert from 'node:assert/strict';
import { chromium } from '/Users/yong/.codex/worktrees/00b1/lemmadeck/app/node_modules/playwright/index.mjs';

const [svgPath, output] = process.argv.slice(2);
assert(svgPath && output);
assert(!fs.existsSync(output));
const svg = fs.readFileSync(svgPath, 'utf8');
const width = Number(svg.match(/\bwidth="(\d+)"/)?.[1]);
const height = Number(svg.match(/\bheight="(\d+)"/)?.[1]);
assert(width > 0 && height > 0);
delete process.env.PWDEBUG;
process.env.PLAYWRIGHT_HTML_OPEN = 'never';
const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  try {
    const page = await context.newPage();
    await page.setContent(`<html><head><style>html,body{margin:0;background:white}svg{display:block}</style></head><body>${svg}</body></html>`);
    assert.equal(await page.locator('svg').count(), 1);
    await page.locator('svg').screenshot({ path: output });
    console.log(JSON.stringify({ ok: true, width, height, headless: true,
      isolated_context: true, preview_saved: output, opened_in_image_context: false }));
  } finally {
    await context.close();
  }
} finally {
  await browser.close();
}

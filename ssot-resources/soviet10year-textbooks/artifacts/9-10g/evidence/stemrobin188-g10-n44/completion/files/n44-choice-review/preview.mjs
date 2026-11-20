import fs from 'node:fs';
import { createRequire } from 'node:module';
import { absolute, choice, binding, write, now, seedPath, read } from './audit-lib.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require(absolute('app/node_modules/playwright'));
const context = await chromium.launchPersistentContext(absolute(`${choice}/previews/browser-profile`), {
  headless: true, viewport: { width: 960, height: 920 }, deviceScaleFactor: 1,
});
const records = [];
try {
  await context.route('**/*', route => route.abort());
  const page = await context.newPage();
  for (const figure of read(seedPath).figures) {
    const input = figure.assets[0].path;
    const before = binding(input);
    const svg = fs.readFileSync(absolute(input), 'utf8');
    await page.setContent(`<html><body style="margin:0;background:white">${svg}</body></html>`);
    await page.evaluate(() => document.fonts.ready);
    const output = `${choice}/previews/${figure.id}.png`;
    await page.locator('svg').screenshot({ path: absolute(output) });
    const after = binding(input);
    if (before.sha256 !== after.sha256) throw new Error('SVG changed during preview');
    records.push({ figure_id: figure.id, source_svg: before, png: binding(output), rendered_at: now(), method: 'Local Chromium renders the complete current SVG; all network requests aborted.' });
  }
} finally {
  await context.close();
}
write(`${choice}/preview-bindings.json`, { schema: 'same188-6/offline-svg-preview@1', created_at: now(), records });
console.log(JSON.stringify(records, null, 2));

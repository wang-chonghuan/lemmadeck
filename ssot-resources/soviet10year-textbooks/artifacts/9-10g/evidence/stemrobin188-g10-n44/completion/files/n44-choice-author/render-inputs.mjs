import { chromium } from '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.agents/skills/node_modules/playwright-core/index.mjs';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const root = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const owned = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n44-choice-author');
const seed = JSON.parse(await readFile(path.join(owned, 'seed.json'), 'utf8'));
const previews = path.join(owned, 'previews');
await mkdir(previews, { recursive: true });
const context = await chromium.launchPersistentContext(path.join(owned, 'browser-profile'), {
  headless: true,
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  viewport: { width: 1600, height: 1200 },
  args: ['--disable-background-networking', '--disable-component-update', '--no-first-run'],
});
const records = [];
try {
  await context.route(/^https?:/, route => route.abort());
  const page = await context.newPage();
  for (const figure of seed.figures) {
    for (const asset of figure.assets) {
      const bytes = await readFile(path.join(root, asset.path));
      await page.setContent(`<html><body style="margin:0;background:white"><img id="figure" src="data:image/svg+xml;base64,${bytes.toString('base64')}"></body></html>`);
      await page.locator('#figure').evaluate(async image => { await image.decode(); });
      const size = await page.locator('#figure').evaluate(image => ({
        width: image.naturalWidth, height: image.naturalHeight,
      }));
      const output = path.join(previews, `${figure.id}.png`);
      await page.locator('#figure').screenshot({ path: output });
      const png = await readFile(output);
      records.push({
        figure_id: figure.id, source_path: asset.path,
        source_sha256: createHash('sha256').update(bytes).digest('hex'),
        preview_path: path.relative(root, output),
        preview_sha256: createHash('sha256').update(png).digest('hex'),
        size, complete_element_screenshot: true,
      });
    }
  }
} finally {
  await context.close();
}
await writeFile(path.join(owned, 'input-render-record.json'), JSON.stringify(records, null, 2) + '\n');
console.log(JSON.stringify(records, null, 2));

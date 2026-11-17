import { readFile, writeFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { chromium } from '../../../../app/node_modules/playwright/index.mjs';

const root = new URL('../../../../', import.meta.url);
const scratch = new URL('./', import.meta.url);
const seedUrl = new URL('geo910-n16-choice-seed.json', scratch);
const logUrl = new URL('geo910-n16-choice-independent-raster-log.md', scratch);
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const sortJson = (value) => Array.isArray(value)
  ? value.map(sortJson)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, sortJson(value[key])]))
    : value;
const canonical = (value) => JSON.stringify(sortJson(value)).replace(
  /[\u007f-\uffff]/g,
  (character) => `\\u${character.charCodeAt(0).toString(16).padStart(4, '0')}`,
);
const requireAbsent = async (url) => {
  try {
    await access(url);
  } catch (error) {
    if (error.code === 'ENOENT') return;
    throw error;
  }
  throw new Error(`Refusing to overwrite ${fileURLToPath(url)}`);
};

await requireAbsent(logUrl);
const seedBytes = await readFile(seedUrl);
const seed = JSON.parse(seedBytes);
if (seed.figures.length !== 2 ||
    seed.figures.map((figure) => figure.id).join(',') !== 'fig-62,fig-63') {
  throw new Error('Unexpected selected figure inventory');
}
const lines = [
  '# Independent Full-Frame Raster Log',
  '',
  `Started UTC: ${new Date().toISOString()}`,
  `Seed byte SHA-256: ${sha256(seedBytes)}`,
  `Seed canonical SHA-256: ${sha256(canonical(seed))}`,
  '',
  'Headless existing Chromium only; no application, server, remote page, dependency installation, or source SVG modification.',
  'Each SVG is loaded as an image from its actual bytes, at intrinsic dimensions, with zero page margin. The complete image element is rasterized without cropping.',
  'Raster loads and later model image opens are counted separately; a conservative combined image-attempt count includes both.',
  '',
];
let browser;
let attempted = 0;
let succeeded = 0;
try {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ deviceScaleFactor: 1, offline: true });
  await context.route(/^https?:/, (route) => route.abort());
  const page = await context.newPage();
  for (const figure of seed.figures) {
    if (figure.assets.length !== 1) throw new Error('Unexpected asset alternatives');
    const asset = figure.assets[0];
    const bytes = await readFile(new URL(asset.path, root));
    const actualHash = sha256(bytes);
    if (actualHash !== asset.sha256) throw new Error(`Asset hash mismatch: ${figure.id}`);
    const output = new URL(`geo910-n16-choice-independent-${figure.id}-full.png`, scratch);
    await requireAbsent(output);
    attempted += 1;
    lines.push(`## Raster Attempt ${attempted}: ${figure.id}`, '', `Asset: ${asset.path}`, `Actual SVG SHA-256: ${actualHash}`);
    await page.setContent(`<html><body style="margin:0;background:white"><img style="display:block" src="data:image/svg+xml;base64,${bytes.toString('base64')}" /></body></html>`);
    const dimensions = await page.locator('img').evaluate(async (image) => {
      await image.decode();
      if (!image.complete || image.naturalWidth <= 0 || image.naturalHeight <= 0) {
        throw new Error('Incomplete or empty SVG image');
      }
      return { width: image.naturalWidth, height: image.naturalHeight };
    });
    await page.setViewportSize(dimensions);
    const box = await page.locator('img').boundingBox();
    if (!box || box.x !== 0 || box.y !== 0 ||
        box.width !== dimensions.width || box.height !== dimensions.height) {
      throw new Error('Image frame does not match intrinsic SVG frame');
    }
    await page.locator('img').screenshot({ path: fileURLToPath(output), type: 'png' });
    succeeded += 1;
    const pngHash = sha256(await readFile(output));
    lines.push(
      `Status: successful full-frame rasterization; ${dimensions.width} x ${dimensions.height} px.`,
      `PNG: ${fileURLToPath(output)}`,
      `PNG SHA-256: ${pngHash}`,
      '',
    );
    console.log(`${figure.id}: ${dimensions.width}x${dimensions.height}; SVG ${actualHash}; PNG ${pngHash}`);
  }
} catch (error) {
  lines.push('', `Failure: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  lines.push(
    '',
    `Finished UTC: ${new Date().toISOString()}`,
    `Raster image attempts: ${attempted}; successful: ${succeeded}; failed: ${attempted - succeeded}.`,
    'Model image-open attempts at raster-log creation: 0. Subsequent opens are recorded in the source-first freeze.',
    '',
  );
  await writeFile(logUrl, lines.join('\n'), { flag: 'wx' });
}
console.log(`Seed canonical SHA-256: ${sha256(canonical(seed))}`);
console.log(`Raster log: ${fileURLToPath(logUrl)}`);

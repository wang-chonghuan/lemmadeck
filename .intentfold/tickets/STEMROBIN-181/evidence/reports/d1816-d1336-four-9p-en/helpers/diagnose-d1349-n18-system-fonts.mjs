import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { repo, ticket, bind, read, save } from './n42-native.mjs';

const require = createRequire(`${repo}/app/package.json`);
const { chromium } = require('playwright');
const nativePath = `${ticket}/tmp/d1816-d1325-n18-first-en-native/result.json`;
const native = read(nativePath), out = `${ticket}/tmp/d1816-d1349-n18-system-font-diagnostic`;
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const observations = [], requests = [];
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 },
    offline: true, serviceWorkers: 'block' });
  await context.route('**/*', route => { requests.push(route.request().url()); return route.abort(); });
  const page = await context.newPage();
  await page.setContent(fs.readFileSync(native.rows[0].textHtml.path, 'utf8'), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const cdp = await context.newCDPSession(page);
  await cdp.send('DOM.enable');
  await cdp.send('CSS.enable');
  const { root } = await cdp.send('DOM.getDocument');
  const { nodeIds } = await cdp.send('DOM.querySelectorAll', {
    nodeId: root.nodeId, selector: 'figure [data-label-id]',
  });
  for (const nodeId of nodeIds) {
    const { node } = await cdp.send('DOM.describeNode', { nodeId });
    const attributes = Object.fromEntries(Array.from({ length: node.attributes.length / 2 },
      (_, index) => [node.attributes[index * 2], node.attributes[index * 2 + 1]]));
    const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
    observations.push({ labelId: attributes['data-label-id'], declaredFont: attributes['font-family'], fonts });
  }
  const fontFaces = await page.evaluate(() => [...document.fonts].map(face =>
    ({ family: face.family, status: face.status })));
  assert.equal(requests.length, 0);
  save(`${out}/result.json`, {
    task: 'D1349', originalDisplayFailure: bind(`${ticket}/tmp/d1816-d1326-n18-first-en-full-course-display/report.json`),
    native: bind(nativePath), observations, fontFaces,
    diagnosis: 'CSS FontFaceSet enumerates document webfonts, not installed platform fonts. CDP records fonts actually rendering each SVG label.',
    noProductOrSvgEdits: true, noScreenshots: true, parentImagesOpened: 0,
    offline: true, requests, browserMode: 'isolated-headless', headedAcceptanceClaimed: false,
    pixelOrCourseApproval: false, databaseWrites: 0, paidCalls: 0,
  });
  console.log(JSON.stringify({ result: bind(`${out}/result.json`), observations }));
  await context.close();
} finally { await browser.close(); }

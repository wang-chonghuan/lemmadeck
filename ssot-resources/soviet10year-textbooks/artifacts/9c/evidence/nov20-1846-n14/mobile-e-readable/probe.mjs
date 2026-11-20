import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { chromium } from '../../../app/node_modules/playwright-core/index.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const input = '/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck/.tmp/stemrobin-184-resume/n14-choice-preview-revision1/choices.html';
const expected = '3a598748a6ab0d13f5c883a2ce70769c0d311c5fe6748819d5721c99ce6a3776';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const save = (name, value) => fs.writeFileSync(path.join(root, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const state = {
  schema: 'stemrobin-184/n14-mobile-e-readability-probe@1',
  startedAt: new Date().toISOString(),
  input,
  expectedSha256: expected,
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  headless: true,
  maximumScreenshots: 2,
  screenshots: [],
  requests: [],
  pageErrors: [],
  cleanup: {},
  visualVerdict: 'UNKNOWN',
  note: 'DOM geometry is capture metadata, not proof of readability.',
};
let server;
let browser;
let context;
let exitCode = 0;

try {
  const bytes = fs.readFileSync(input);
  state.inputBytes = bytes.length;
  state.frozenSha256 = hash(bytes);
  state.hashFrozenBeforeBrowser = true;
  save('input-freeze.json', {
    input, bytes: bytes.length, expectedSha256: expected,
    sha256: state.frozenSha256, frozenAt: new Date().toISOString(),
    hashFrozenBeforeBrowser: true,
  });
  if (state.frozenSha256 !== expected) throw new Error('Input hash mismatch; browser not opened.');

  server = http.createServer((req, res) => {
    const allowed = req.method === 'GET' && req.url === '/choices.html';
    state.requests.push({ kind: 'server', method: req.method, path: req.url, allowed });
    res.writeHead(allowed ? 200 : 404, allowed
      ? { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }
      : { 'Content-Type': 'text/plain' });
    res.end(allowed ? bytes : 'Not found');
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const origin = `http://127.0.0.1:${server.address().port}`;
  const url = `${origin}/choices.html`;
  state.localUrl = url;
  browser = await chromium.launch({
    headless: true,
    args: ['--disable-background-networking', '--disable-component-update',
      '--no-first-run', '--disable-sync', '--no-default-browser-check',
      '--disable-breakpad', '--disable-crash-reporter', '--disable-gpu-shader-disk-cache'],
  });
  context = await browser.newContext({
    viewport: state.viewport,
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
    serviceWorkers: 'block',
  });
  await context.route('**/*', async route => {
    const request = route.request();
    const allowed = request.url() === url && request.method() === 'GET';
    state.requests.push({ kind: 'browser', url: request.url(), allowed });
    if (allowed) await route.continue();
    else await route.abort('blockedbyclient');
  });
  const page = await context.newPage();
  page.on('pageerror', error => state.pageErrors.push(error.message));
  await page.goto(url, { waitUntil: 'load', timeout: 15000 });
  await page.evaluate(() => document.fonts.ready);

  // Identify only the visible E-labelled table; do not read scripts or internal keys.
  state.discovery = await page.evaluate(() => {
    const visible = element => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 &&
        getComputedStyle(element).visibility !== 'hidden' &&
        getComputedStyle(element).display !== 'none';
    };
    const letters = [...document.querySelectorAll('body *')].filter(element =>
      !['SCRIPT', 'STYLE', 'TEMPLATE'].includes(element.tagName) &&
      element.children.length === 0 && element.textContent.trim() === 'E' &&
      visible(element));
    const candidates = [];
    for (const letter of letters) {
      for (let ancestor = letter.parentElement; ancestor; ancestor = ancestor.parentElement) {
        const tables = [...ancestor.querySelectorAll('table')].filter(visible);
        if (tables.length === 1) {
          candidates.push({ table: tables[0], region: ancestor, letter });
          break;
        }
        if (tables.length > 1) break;
      }
    }
    const distinct = candidates.filter((item, index) =>
      candidates.findIndex(other => other.table === item.table) === index);
    if (distinct.length !== 1) {
      return { candidateCount: distinct.length, visibleELabelCount: letters.length };
    }
    const { table, region, letter } = distinct[0];
    let scroll = table.parentElement;
    while (scroll && scroll !== region &&
      !(scroll.scrollWidth > scroll.clientWidth &&
        ['auto', 'scroll'].includes(getComputedStyle(scroll).overflowX))) {
      scroll = scroll.parentElement;
    }
    if (!scroll || scroll.scrollWidth <= scroll.clientWidth) {
      return { candidateCount: 1, error: 'No E horizontal scroll container observed.' };
    }
    const tables = [...document.querySelectorAll('table')];
    const elements = [...document.querySelectorAll('body *')];
    return {
      candidateCount: 1,
      tableIndex: tables.indexOf(table),
      regionElementIndex: elements.indexOf(region),
      scrollElementIndex: elements.indexOf(scroll),
      label: letter.textContent.trim(),
      regionTag: region.tagName,
      regionClass: region.className,
      tableTag: table.tagName,
      scrollTag: scroll.tagName,
      scrollClass: scroll.className,
      rows: [...table.rows].map((row, index) => ({
        index, kind: row.parentElement.tagName, cellCount: row.cells.length,
        visibleCells: [...row.cells].map(cell => cell.innerText),
      })),
      tableWidth: table.getBoundingClientRect().width,
      scrollClientWidth: scroll.clientWidth,
      scrollWidth: scroll.scrollWidth,
      maxScrollLeft: scroll.scrollWidth - scroll.clientWidth,
    };
  });
  console.log(JSON.stringify({ stage: 'observed-E-DOM', discovery: state.discovery }));
  if (state.discovery.candidateCount !== 1 || state.discovery.error) {
    throw new Error('E table not uniquely identified from observed DOM.');
  }
  const bodyRows = state.discovery.rows.filter(row => row.kind === 'TBODY');
  if (bodyRows.length !== 8 || bodyRows.some(row => row.cellCount !== 3)) {
    throw new Error('Observed E table does not contain eight body rows and three columns.');
  }
  const table = page.locator('table').nth(state.discovery.tableIndex);
  const region = page.locator('body *').nth(state.discovery.regionElementIndex);
  const scroll = page.locator('body *').nth(state.discovery.scrollElementIndex);
  await region.scrollIntoViewIfNeeded();
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() =>
    requestAnimationFrame(resolve))));

  for (const endpoint of ['left', 'right']) {
    await scroll.evaluate((element, endpointName) => {
      element.scrollLeft = endpointName === 'left' ? 0 : element.scrollWidth;
    }, endpoint);
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() =>
      requestAnimationFrame(resolve))));
    const metadata = await table.evaluate((element, scrollIndex) => {
      const scroller = document.querySelectorAll('body *')[scrollIndex];
      const bounds = node => {
        const rect = node.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      };
      return {
        scrollLeft: scroller.scrollLeft,
        maxScrollLeft: scroller.scrollWidth - scroller.clientWidth,
        scrollBounds: bounds(scroller),
        tableBounds: bounds(element),
        rowBounds: [...element.rows].map(row => bounds(row)),
      };
    }, state.discovery.scrollElementIndex);
    const regionBounds = await region.boundingBox();
    if (!regionBounds || regionBounds.x < 0 || regionBounds.y < 0 ||
      regionBounds.x + regionBounds.width > 390 ||
      regionBounds.y + regionBounds.height > 844) {
      throw new Error('E region does not fit the viewport; no expanded screenshot allowed.');
    }
    const filename = `e-mobile-390x844-${endpoint}.png`;
    const screenshot = await region.screenshot({
      path: path.join(root, filename),
      scale: 'css',
      timeout: 10000,
    });
    state.screenshots.push({
      endpoint, path: path.join(root, filename),
      sha256: hash(screenshot), bytes: screenshot.length,
      regionBounds, ...metadata,
      captures: 1, inspections: 0,
      enhancement: 'none',
    });
    console.log(JSON.stringify({ stage: 'capture', ...state.screenshots.at(-1) }));
  }
  state.status = 'CAPTURED_PENDING_VISUAL_REVIEW';
} catch (error) {
  exitCode = 1;
  state.status = 'HOLD';
  state.error = error.stack;
  console.error(error.stack);
} finally {
  for (const [name, resource] of [['context', context], ['browser', browser]]) {
    try {
      if (resource) await resource.close();
      state.cleanup[name] = resource ? 'closed' : 'not opened';
    } catch (error) {
      exitCode = 1;
      state.cleanup[name] = { error: error.message };
      console.error(`${name} close: ${error.stack}`);
    }
  }
  try {
    if (server?.listening) {
      await new Promise((resolve, reject) => {
        server.close(error => error ? reject(error) : resolve());
        server.closeAllConnections();
      });
    }
    state.cleanup.server = server ? 'closed' : 'not opened';
  } catch (error) {
    exitCode = 1;
    state.cleanup.server = { error: error.message };
    console.error(`server close: ${error.stack}`);
  }
  state.finalInputSha256 = hash(fs.readFileSync(input));
  state.inputUnchanged = state.finalInputSha256 === expected;
  if (!state.inputUnchanged) exitCode = 1;
  state.exitCode = exitCode;
  state.finishedAt = new Date().toISOString();
  save('probe.json', state);
  console.log(JSON.stringify({
    stage: 'finished', status: state.status, exitCode,
    screenshots: state.screenshots.length, inputUnchanged: state.inputUnchanged,
    cleanup: state.cleanup,
  }));
  process.exitCode = exitCode;
}

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188';
assert.equal(process.cwd(), root);
const own = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n35-450-author7');
const require = createRequire(path.join(root, 'app/package.json'));
const { chromium } = require('playwright');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const book = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g';
const edition = `${book}/editions/modern-us-neutral`;
const lesson = `${edition}/lessons/geo68-c3-s2-n35`;
const inputs = [
  `${lesson}/lesson.json`,
  `${lesson}/exercises.json`,
  '.tmp/ld-s10y-answer/6-8g/modern-us-neutral/lessons/geo68-c3-s2-n35/answer-keys.template.json',
  `${book}/figures/fig-218.png`,
  `${edition}/figures/fig-218.spec.json`,
  `${edition}/figures/fig-218.review.json`,
  `${edition}/figures/fig-218.render.json`,
  `${edition}/figures/fig-218.svg`,
].map(relative => ({
  path: path.join(root, relative),
  sha256: hash(fs.readFileSync(path.join(root, relative))),
}));
const svg = fs.readFileSync(path.join(root, `${edition}/figures/fig-218.svg`));
const screenshotPath = path.join(own, 'fig-218.actual-svg.png');
const recordPath = path.join(own, 'capture-218.json');
assert(!fs.existsSync(screenshotPath));
assert(!fs.existsSync(recordPath));
const startedAt = new Date().toISOString();
const requests = [];
let browser;
let result;
try {
  browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 640, height: 420 },
    deviceScaleFactor: 1,
    offline: true,
  });
  await context.route(/^https?:/, route => {
    requests.push(route.request().url());
    return route.abort();
  });
  const page = await context.newPage();
  await page.setContent(
    `<style>html,body{margin:0;background:white}img{display:block;width:640px;height:420px}</style>` +
    `<img alt="Figure 218" src="data:image/svg+xml;base64,${svg.toString('base64')}">`,
  );
  const dimensions = await page.locator('img').evaluate(async image => {
    await image.decode();
    return { width: image.naturalWidth, height: image.naturalHeight };
  });
  assert.deepEqual(dimensions, { width: 640, height: 420 });
  assert.equal(requests.length, 0);
  await page.locator('img').screenshot({ path: screenshotPath });
  result = {
    status: 'captured-not-reviewed',
    exercise: '450',
    figure: 'fig-218',
    startedAt,
    inputs,
    screenshot: { path: screenshotPath, sha256: hash(fs.readFileSync(screenshotPath)) },
    headed: true,
    offline: true,
    externalRequests: requests.length,
    dimensions,
    browserAttempts: 1,
    browserFailures: 0,
    figureRendererInvocations: 0,
  };
} finally {
  if (browser) await browser.close();
}
assert(result);
result.browserClosed = true;
result.finishedAt = new Date().toISOString();
fs.writeFileSync(recordPath, `${JSON.stringify(result, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({
  recordPath,
  recordSha256: hash(fs.readFileSync(recordPath)),
  screenshot: result.screenshot,
  browserClosed: result.browserClosed,
  browserFailures: result.browserFailures,
}));

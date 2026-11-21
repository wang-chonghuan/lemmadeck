import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const base = path.join(root, '.tmp/stemrobin-184-six');
const candidate = path.join(base, 'n48-display-resume');
const out = path.join(candidate, 'affected');
assert(!fs.existsSync(out));
fs.mkdirSync(out);
const receipt = JSON.parse(fs.readFileSync(path.join(candidate, 'receipt.json'), 'utf8'));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.relative(root, file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const inputs = Object.fromEntries(receipt.outputs.map(row => {
  const file = path.resolve(root, row.path);
  assert.equal(bind(file).sha256, row.sha256);
  return [row.surface, file];
}));
const report = {
  schema: 'stemrobin1846/n48-affected-display-execution@1',
  status: 'RUNNING', candidateReceipt: bind(path.join(candidate, 'receipt.json')),
  inputs: receipt.outputs, assertions: [], screenshots: [], nativeHorizontalWheelActions: 0,
  consoleErrors: [], pageErrors: [], remoteRequests: [],
  priorSixStateNativeAndSemanticReplays: 0, parentImageViewsOrDecodes: 0,
  hiddenBrowserRasterInternals: 'UNKNOWN', visualReviewPending: true,
};
const require = createRequire(path.join(root, 'app/package.json'));
const { chromium } = require('playwright');
const server = http.createServer((req, res) => {
  const surface = new URL(req.url, 'http://127.0.0.1').pathname.slice(1).replace('.html', '');
  if (!inputs[surface]) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(fs.readFileSync(inputs[surface]));
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.route('**/*', route => {
    const url = route.request().url();
    if (!url.startsWith(origin) && !url.startsWith('data:')) {
      report.remoteRequests.push(url);
      return route.abort();
    }
    return route.continue();
  });
  const page = await context.newPage();
  page.on('pageerror', error => report.pageErrors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') report.consoleErrors.push(message.text());
  });
  const goto = async surface => {
    await page.goto(`${origin}/${surface}.html`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
  };
  const save = async (name, locator, details) => {
    const output = path.join(out, `${name}.png`);
    await locator.screenshot({ path: output });
    report.screenshots.push({ name, ...details, ...bind(output) });
  };
  await goto('text');
  const index = receipt.metadata.proof.index;
  const proof = page.locator('p.para .nb').nth(index);
  assert.equal(await proof.locator('annotation').textContent(), receipt.metadata.proof.tex);
  await proof.scrollIntoViewIfNeeded();
  const initial = await proof.evaluate(element => ({
    clientWidth: element.clientWidth, scrollWidth: element.scrollWidth,
    scrollLeft: element.scrollLeft, overflowX: getComputedStyle(element).overflowX,
  }));
  assert.equal(initial.overflowX, 'auto');
  assert(initial.scrollWidth > initial.clientWidth);
  const box = await proof.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.wheel(2000, 0);
  report.nativeHorizontalWheelActions++;
  await page.waitForFunction(index => {
    const element = document.querySelectorAll('p.para .nb')[index];
    return element.scrollLeft >= element.scrollWidth - element.clientWidth - 1;
  }, index, { timeout: 5000 });
  const reached = await proof.evaluate(element => {
    const frame = element.getBoundingClientRect();
    const tail = element.querySelector('.katex-html > .base:last-child').getBoundingClientRect();
    return { clientWidth: element.clientWidth, scrollWidth: element.scrollWidth,
      scrollLeft: element.scrollLeft, frame: { left: frame.left, right: frame.right },
      tail: { left: tail.left, right: tail.right },
      documentWidth: Math.max(document.body.scrollWidth, document.documentElement.scrollWidth) };
  });
  assert(reached.tail.left >= reached.frame.left - 1 && reached.tail.right <= reached.frame.right + 1);
  assert.equal(reached.documentWidth, 390);
  report.assertions.push({ finding: 'V1', initial, reached, status: 'PASS_REACHABLE_RIGHT_END_NATIVE_WHEEL' });
  await save('proof-right-end-390', page.locator('p.para').nth(1),
    { finding: 'V1', viewport: { width: 390, height: 844 }, state: 'Right end reached by actual horizontal wheel; visual legibility still requires independent observation' });

  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await goto('exercises');
    const rows = await page.evaluate(() => ['382', '383', '384', '385'].map(number => {
      const row = document.getElementById(`ex-${number}`);
      const body = row.querySelector('.body');
      const box = row.getBoundingClientRect();
      return { number, outer: row.querySelector('.no').textContent.trim(),
        duplicatePrefixes: [...body.childNodes].filter(node => node.nodeType === Node.TEXT_NODE && node.data.startsWith(number + '.')).length,
        math: body.querySelectorAll('.katex').length,
        box: { top: box.top + scrollY, bottom: box.bottom + scrollY } };
    }));
    assert(rows.every(row => row.outer === row.number + '.' && row.duplicatePrefixes === 0 && row.math === 1));
    const output = path.join(out, `exercise-prefixes-${viewport.width}.png`);
    await page.screenshot({ path: output, clip: {
      x: 0, y: rows[0].box.top, width: viewport.width,
      height: rows.at(-1).box.bottom - rows[0].box.top,
    } });
    report.assertions.push({ finding: 'V2', viewport, rows, status: 'PASS_SOURCE_NUMBERS_RETAINED_DUPLICATE_PREFIXES_REMOVED' });
    report.screenshots.push({ name: `exercise-prefixes-${viewport.width}`,
      finding: 'V2', viewport, scope: 'Only affected rows382-385; new native screenshot, not a crop/reopen of an old PNG', ...bind(output) });
  }
  await goto('choices');
  for (const [question, option] of [['n48-q6', 'A'], ['n48-q8', 'A'], ['n48-q8', 'B']]) {
    const label = page.locator(`[data-question="${question}"] [data-option="${option}"]`);
    const ending = label.locator('[data-n48-ending]');
    const placement = await ending.evaluate(element => {
      const textNode = element.lastChild;
      const range = document.createRange();
      range.setStart(textNode, textNode.textContent.length - 1);
      range.setEnd(textNode, textNode.textContent.length);
      const dot = range.getBoundingClientRect();
      const math = element.querySelector('.katex').getBoundingClientRect();
      const frame = element.getBoundingClientRect();
      return { terminal: textNode.textContent.slice(-1),
        nowrap: getComputedStyle(element).whiteSpace, scrollWidth: element.scrollWidth,
        clientWidth: element.clientWidth,
        dot: { top: dot.top, bottom: dot.bottom, left: dot.left, right: dot.right },
        math: { top: math.top, bottom: math.bottom, left: math.left, right: math.right },
        frame: { left: frame.left, right: frame.right },
        documentWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) };
    });
    assert.equal(placement.terminal, '。');
    assert.equal(placement.nowrap, 'nowrap');
    assert(placement.dot.top < placement.math.bottom && placement.dot.bottom > placement.math.top);
    assert(placement.dot.right <= placement.frame.right + 1);
    assert.equal(placement.documentWidth, 390);
    report.assertions.push({ finding: 'V3', question, option, placement, status: 'PASS_TERMINAL_ON_FORMULA_LINE' });
    await save(`${question}-${option}-390`, label,
      { finding: 'V3', question, option, viewport: { width: 390, height: 844 } });
  }
  assert.equal(report.screenshots.length, 6);
  assert.equal(report.remoteRequests.length + report.pageErrors.length + report.consoleErrors.length, 0);
  await context.close();
  report.status = 'PASS_AFFECTED_NATIVE_EXECUTION_INDEPENDENT_VISUAL_REVIEW_PENDING';
} catch (error) {
  report.status = 'FAIL_AFFECTED_DISPLAY_EXECUTION';
  report.failure = { message: error.message, stack: error.stack };
  process.exitCode = 1;
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
  report.browserAndServerClosed = true;
  fs.writeFileSync(path.join(out, 'execution.json'), JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
}
console.log(JSON.stringify({ status: report.status, execution: bind(path.join(out, 'execution.json')),
  screenshots: report.screenshots, nativeHorizontalWheelActions: report.nativeHorizontalWheelActions,
  browserAndServerClosed: true }));

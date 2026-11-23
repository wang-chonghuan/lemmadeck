import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188';
assert.equal(fs.realpathSync(process.cwd()), root);
const own = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n35-exercises-display-independent7');
const html = path.join(root, '.tmp/ld-s10y-lesson/render/6-8g/modern-us-neutral/geo68-c3-s2-n35/exercises.html');
const answers = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/editions/modern-us-neutral/lessons/geo68-c3-s2-n35/answer-keys.json');
const helper = path.join(root, '.claude/skills/ld-s10y-lesson/tools/choice_html.mjs');
const captureScript = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/display-n35-7.mjs');
const screenshot = path.join(own, 'exercise-459-mobile-scroll-end.png');
const output = path.join(own, 'exercise-459-scroll.json');
for (const file of [screenshot, output]) assert.ok(!fs.existsSync(file));
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const answer = JSON.parse(fs.readFileSync(answers, 'utf8')).answers.find(row => row.exercise === '459');
assert.equal(answer.grading, 'ungraded');
const { chromium } = createRequire(path.join(root, 'app/package.json'))('playwright');
const { choiceHtml } = await import(pathToFileURL(helper).href);
const browser = await chromium.launch({ headless: true });
let result;
let networkBlocked = 0;
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.route(/^https?:/, route => {
    networkBlocked += 1;
    return route.abort();
  });
  const page = await context.newPage();
  await page.goto(pathToFileURL(html).href);
  await page.locator('#ex-459 .body').evaluate((node, rendered) => {
    const support = document.createElement('div');
    support.className = 'answer-support';
    support.innerHTML = rendered;
    node.append(support);
  }, choiceHtml(answer.displayAnswer));
  await page.addStyleTag({ content: '.answer-support{margin-top:16px;padding-top:12px;border-top:1px solid #ddd;overflow-x:auto;font-size:16px;line-height:1.8}.answer-support p{margin:8px 0}' });
  await page.evaluate(() => document.fonts.ready);
  result = await page.locator('#ex-459 .answer-support').evaluate(support => {
    const formulas = [...support.querySelectorAll('.katex')].filter(node => {
      const source = node.querySelector('annotation')?.textContent ?? '';
      return source.startsWith('(0,0),(3,0)');
    });
    if (formulas.length !== 4) throw new Error('Expected four affected coordinate rows');
    const rect = node => {
      const r = node.getBoundingClientRect();
      return { x: r.x, y: r.y + scrollY, width: r.width, height: r.height, right: r.right };
    };
    const left = support.getBoundingClientRect().left;
    const right = left + support.clientWidth;
    const before = formulas.map(node => ({
      tex: node.querySelector('annotation').textContent,
      bounds: rect(node),
      rightHiddenPx: Math.max(0, node.getBoundingClientRect().right - right),
    }));
    const initialScrollLeft = support.scrollLeft;
    const end = Math.max(0, support.scrollWidth - support.clientWidth);
    support.scrollLeft = end;
    const reached = support.scrollLeft;
    const after = formulas.map(node => ({
      tex: node.querySelector('annotation').textContent,
      bounds: rect(node),
      rightHiddenPx: Math.max(0, node.getBoundingClientRect().right - right),
      leftHiddenPx: Math.max(0, left - node.getBoundingClientRect().left),
    }));
    const top = Math.floor(Math.min(...after.map(row => row.bounds.y)) - 45);
    const bottom = Math.ceil(Math.max(...after.map(row => row.bounds.y + row.bounds.height)) + 70);
    return {
      selector: '#ex-459 .answer-support',
      paragraphReference: 'displayAnswer: 1), c) six-sided polygon coordinate examples, 0/1/2/3 parallel pairs',
      viewport: { width: innerWidth, height: innerHeight },
      pageWidth: document.documentElement.scrollWidth,
      computedOverflowX: getComputedStyle(support).overflowX,
      supportBounds: rect(support),
      clientWidth: support.clientWidth,
      scrollWidth: support.scrollWidth,
      initialScrollLeft,
      end,
      reached,
      before,
      after,
      screenshotClip: { x: 0, y: top, width: innerWidth, height: bottom - top },
      affectedAnswerInputControls: support.querySelectorAll('input,textarea,select,[contenteditable="true"]').length,
    };
  });
  assert.equal(result.pageWidth, 390);
  assert.equal(result.computedOverflowX, 'auto');
  assert.ok(result.end > 0);
  assert.ok(Math.abs(result.end - result.reached) <= 1);
  assert.ok(result.after.every(row => row.rightHiddenPx <= 1));
  assert.equal(result.affectedAnswerInputControls, 0);
  await page.screenshot({ path: screenshot, fullPage: true, clip: result.screenshotClip });
  await context.close();
} finally {
  await browser.close();
}
const report = {
  status: 'pass',
  scope: 'Affected exercise 459 mobile answer horizontal-scroll diagnosis only',
  productFunctionalityTested: false,
  offline: true,
  headless: true,
  browserClosed: true,
  networkBlocked,
  bindings: [html, answers, helper, captureScript].map(file => ({ path: file, sha256: sha(file) })),
  result,
  screenshot: { path: screenshot, sha256: sha(screenshot) },
};
fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx', mode: 0o444 });
console.log(JSON.stringify(report, null, 2));

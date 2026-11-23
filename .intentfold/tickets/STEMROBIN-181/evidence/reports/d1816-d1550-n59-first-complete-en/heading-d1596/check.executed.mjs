import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { repo, ticket, read, bind, save, copy, run } from './n42-native.mjs';

const card = 'phy9-c2-s2-n59', edition = 'modern-us-neutral-en';
const source = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/9p`;
const canonical = `${source}/editions/${edition}`;
const root = `${repo}/.tmp/STEMROBIN-181/d1816-d1596/root`;
const work = `${repo}/.tmp/STEMROBIN-181/d1816-d1596/work`;
const out = `${ticket}/tmp/d1816-d1596-n59-heading-only`;
const authorFile = `${ticket}/tmp/d1816-d1588-n59-affected-heading/authored.json`;
const reviewFile = `${ticket}/tmp/d1816-d1546-n59-first-en-review/heading-review.json`;
assert.equal(bind(reviewFile).sha256, '82dd66ddb3e54eb20f5c6141c6c60c0ebf80f7afc179aa6791818869f5cd5c8b');
assert.equal(read(reviewFile).status, 'PASS');
const author = read(authorFile), candidate = read(author.englishDraft.path);
const before = read(`${canonical}/lessons/${card}/lesson.json`);
const expected = { ...before, chapter: candidate.chapter };
const comparable = { ...candidate };
comparable.status = before.status;
assert.deepEqual(comparable, expected);
assert.equal(candidate.chapter, 'Part Two. Foundations of Electrodynamics');
assert(!fs.existsSync(root));
fs.mkdirSync(`${root}/9p/lessons`, { recursive: true });
for (const name of ['book.json', 'pages', 'figures', `lessons/${card}`])
  fs.symlinkSync(`${source}/${name}`, `${root}/9p/${name}`,
    fs.statSync(`${source}/${name}`).isDirectory() ? 'dir' : 'file');
const figures = `${root}/9p/editions/${edition}/figures`;
fs.mkdirSync(figures, { recursive: true });
for (const suffix of ['spec.json', 'svg', 'render.json', 'review.json'])
  fs.symlinkSync(`${canonical}/figures/fig-103.${suffix}`, `${figures}/fig-103.${suffix}`);
const templates = `${work}/adapt/9p/${edition}/lessons/${card}`;
fs.mkdirSync(templates, { recursive: true });
copy(author.englishDraft.path, `${templates}/lesson.template.json`);
copy(`${canonical}/lessons/${card}/exercises.json`, `${templates}/exercises.template.json`);
copy(`${canonical}/lessons/${card}/figures.json`, `${templates}/figures.template.json`);
save(`${out}/inputs.json`, { author: bind(authorFile), review: bind(reviewFile),
  beforeLesson: bind(`${canonical}/lessons/${card}/lesson.json`),
  bodyFlowMathSourceFiguresAndUnchangedApprovalsReused: true });
const receipts = [];
for (const command of ['adapt-finalize', 'render'])
  receipts.push(run(`d1596-n59-heading-${command}`, [
    `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
    `${repo}/.claude/skills/ld-s10y-lesson/tools/p2c.py`, command,
    '--book', '9p', '--root', root, '--work', work, '--edition', edition, '--lesson', card,
  ]));
const lessonFile = `${root}/9p/editions/${edition}/lessons/${card}/lesson.json`;
assert.deepEqual(read(lessonFile), expected);
for (const name of ['exercises.json', 'figures.json'])
  assert.equal(bind(`${root}/9p/editions/${edition}/lessons/${card}/${name}`).sha256,
    bind(`${canonical}/lessons/${card}/${name}`).sha256);
const htmlFile = `${work}/render/9p/${edition}/${card}/text.html`;
const html = fs.readFileSync(htmlFile, 'utf8');
assert(!/<(?:script|link|iframe|object|embed)\b/i.test(html));
const require = createRequire(`${repo}/app/package.json`);
const { chromium } = require('playwright');
const views = [], requests = [];
let browser, failure;
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  for (const viewport of [{ name: 'desktop', width: 1440, height: 960 },
    { name: 'mobile', width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport: { width: viewport.width,
      height: viewport.height }, deviceScaleFactor: 1, offline: true, serviceWorkers: 'block' });
    try {
      await context.route('**/*', route => {
        requests.push(route.request().url());
        return route.abort();
      });
      const page = await context.newPage(), errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.setContent(html, { waitUntil: 'load' });
      await page.locator('a.jump').evaluateAll(nodes => nodes.forEach(node => node.remove()));
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('h1').innerText(), before.title);
      const crumb = await page.locator('.crumb').innerText();
      assert(crumb.startsWith(`${candidate.chapter} · Chapter 8. Electrostatics ·`));
      const geometry = await page.evaluate(() => {
        const boxes = ['h1', '.crumb', '.para'].map(selector => {
          const element = document.querySelector(selector), r = element.getBoundingClientRect();
          return { selector, left: r.left, right: r.right, top: r.top, bottom: r.bottom,
            scrollWidth: element.scrollWidth, clientWidth: element.clientWidth };
        });
        return { boxes, width: innerWidth, scrollWidth: document.documentElement.scrollWidth };
      });
      assert(geometry.scrollWidth <= viewport.width + 1);
      const [heading, crumbBox, paragraph] = geometry.boxes;
      for (const box of [heading, crumbBox]) {
        assert(box.left >= 0 && box.right <= viewport.width + 1);
        assert(box.scrollWidth <= box.clientWidth + 1);
      }
      assert(heading.bottom <= crumbBox.top && crumbBox.bottom <= paragraph.top);
      assert.equal(errors.length, 0);
      const screenshot = `${out}/${viewport.name}-header.png`;
      await page.screenshot({ path: screenshot, clip: { x: 0, y: 0,
        width: viewport.width, height: Math.ceil(paragraph.top) } });
      views.push({ viewport, heading: before.title, crumb, geometry, errors,
        screenshot: bind(screenshot), captureScope: 'new original header-region capture only' });
    } finally { await context.close(); }
  }
} catch (error) { failure = { message: error.message, stack: error.stack }; }
finally { if (browser) await browser.close(); }
save(`${out}/result.json`, { status: failure ? 'FAIL' : 'HEADING_NATIVE_AND_AFFECTED_DOM_PASS',
  card, edition, author: bind(authorFile), review: bind(reviewFile), receipts,
  lesson: bind(lessonFile),
  audit: bind(`${root}/9p/editions/${edition}/lessons/${card}/adaptation.audit.json`),
  html: bind(htmlFile), views, requests, failure, browserClosed: true,
  expectedOnlyChapterChanged: true, originalParagraphs: 40, originalBoundaries: 3,
  unchangedBodyAndFigureDisplayReused: `${ticket}/evidence/reports/d1816-d1550-n59-first-complete-en/display-review.json`,
  fullReviewReplayed: false, headerPixelReviewPending: true, producerDatabaseWrites: 0,
  paidCalls: 0, parentImageOpens: 0, formalHeadedProductAcceptance: false });
assert.equal(failure, undefined);
assert.equal(requests.length, 0);
console.log(JSON.stringify({ result: bind(`${out}/result.json`), headerImages: views.length }));

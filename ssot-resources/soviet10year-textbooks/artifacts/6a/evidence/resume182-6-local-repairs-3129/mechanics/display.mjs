import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const root = '/Users/yong/.codex/worktrees/stemrobin-182-six-3129/lemmadeck';
assert.equal(process.cwd(), root);
const out = path.join(root, '.tmp/ld-s10y-lesson/resume182-6-3129/local-repairs-FIRST/display-FIRST');
assert.ok(!fs.existsSync(out));
fs.mkdirSync(out, { recursive: true });
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const read = filename => JSON.parse(fs.readFileSync(filename));
const appRequire = createRequire(path.join(root, 'app/package.json'));
const { chromium } = appRequire('playwright');
const { PNG } = appRequire(path.join(root, 'app/node_modules/playwright-core/lib/utilsBundle.js'));
const { inline, proseOutline } = createRequire(path.join(root,
  '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'))('./htmlfrag.js');
const lessonBase = book => path.join(root,
  `ssot-resources/soviet10year-textbooks/artifacts/${book}/editions/modern-us-neutral/lessons`);
const n8 = path.join(lessonBase('6a'), 'alg6-c2-s1-n8');
const n20 = path.join(lessonBase('8a'), 'alg8-c3-s3-n20');
const before = path.join(root, '.tmp/ld-s10y-lesson/resume182-6-3129/local-repairs-FIRST/before');
const report = {
  startedAt: new Date().toISOString(), status: 'RUNNING',
  scopes: ['6a-N8-written188-and-standard-answer', '8a-N20-p0114#4'],
  screenshots: [], viewports: [], ownedBrowsersClosed: false,
  independentContentReview: 'PENDING_AGENT_THREAD_LIMIT',
  newFigureReviews: 0, unchangedChoiceViewsRechecked: 0,
};
let browser;
try {
  browser = await chromium.launch({ headless: true });
  report.browser = { version: browser.version(), headless: true, isolated: true };
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  const page = await context.newPage();
  const remoteRequests = [];
  const pageErrors = [];
  page.on('request', request => {
    if (/^https?:/.test(request.url())) remoteRequests.push(request.url());
  });
  page.on('pageerror', error => pageErrors.push(error.message));
  await context.route(/^https?:/, route => route.abort());

  const n8Rendered = path.join(root,
    '.tmp/ld-s10y-lesson/resume182-6-3129/local-repairs-FIRST/render/6a/alg6-c2-s1-n8/exercises.html');
  await page.goto(pathToFileURL(n8Rendered).href);
  const answer = read(path.join(n8, 'answer-keys.json')).answers.find(item => item.exercise === '188');
  const fragment = inline(answer.displayAnswer);
  assert.ok(!/katex-error/.test(fragment));
  await page.evaluate(fragment => {
    const exercise = document.getElementById('ex-188');
    const body = exercise.querySelector('.body');
    const prompt = document.createElement('div');
    prompt.className = 'repair-prompt';
    for (const node of Array.from(body.childNodes)) {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'FIGURE') continue;
      prompt.append(node);
    }
    body.prepend(prompt);
    const standard = document.createElement('div');
    standard.className = 'standard-display';
    const label = document.createElement('p');
    label.className = 'standard-label';
    label.textContent = '标准答案';
    const text = document.createElement('div');
    text.className = 'standard-text';
    text.innerHTML = fragment;
    standard.append(label, text);
    exercise.append(standard);
    const style = document.createElement('style');
    style.textContent = '.standard-display{grid-column:2;min-width:0;line-height:1.9}'
      + '.standard-label{font-size:.85em;color:var(--sub);margin:.3em 0}'
      + '.standard-text{min-width:0;overflow-x:auto;overflow-y:hidden;padding-block:calc(.2em + 1px);margin-block:-.2em}';
    document.head.append(style);
  }, fragment);
  const n8Html = await page.content();
  fs.writeFileSync(path.join(out, '6a-exercises.html'), n8Html, { flag: 'wx' });

  const oldLesson = read(path.join(before, '8a/lesson.json'));
  const newLesson = read(path.join(n20, 'lesson.json'));
  const oldIndices = proseOutline(oldLesson.prose).filter(item => item.blockIndex === 6).map(item => item.index);
  const newIndices = proseOutline(newLesson.prose).filter(item => item.blockIndex === 6).map(item => item.index);
  assert.equal(oldIndices.length, 1);
  assert.equal(newIndices.length, 4);
  const renderedN20 = path.join(root,
    '.tmp/ld-s10y-lesson/resume182-6-3129/local-repairs-FIRST/render/8a/alg8-c3-s3-n20/text.html');
  await page.goto(pathToFileURL(renderedN20).href);
  const newParagraphs = await page.locator('p.para').evaluateAll((items, indices) =>
    indices.map(index => items[index].outerHTML), newIndices);
  const oldN20 = path.join(before, '8a/offline/text.html');
  await page.goto(pathToFileURL(oldN20).href);
  const oldDom = await page.content();
  report.priorN20Dom = { sha256: hash(oldDom), preservedStyleAndUnaffectedDom: true };
  const replacement = await page.evaluate(({ index, paragraphs }) => {
    const items = Array.from(document.querySelectorAll('p.para'));
    const affected = items[index];
    const before = items.filter((_, at) => at !== index).map(item => item.outerHTML);
    const wrapper = document.createElement('div');
    wrapper.className = 'repair-proof';
    wrapper.innerHTML = paragraphs.join('');
    affected.replaceWith(wrapper);
    const after = Array.from(document.querySelectorAll('p.para')).filter(item =>
      !item.closest('.repair-proof')).map(item => item.outerHTML);
    return { before, after, styles: Array.from(document.querySelectorAll('style')).map(item => item.textContent) };
  }, { index: oldIndices[0], paragraphs: newParagraphs });
  assert.deepEqual(replacement.before, replacement.after);
  const n20Html = await page.content();
  fs.writeFileSync(path.join(out, '8a-text.html'), n20Html, { flag: 'wx' });
  report.n20ChangedParagraphs = { old: oldIndices, current: newIndices, unaffectedParagraphsEqual: true };

  const scopes = [
    { name: '6a-exercises', file: '6a-exercises.html', targets: [
      { name: 'prompt188', selector: '#ex-188 .repair-prompt', text: '如果只把确实有交点' },
      { name: 'answer188', selector: '#ex-188 .standard-display', text: '不能构成整个圆周' },
    ] },
    { name: '8a-text', file: '8a-text.html', targets: [
      { name: 'proof-supplement', selector: '.repair-proof', text: '现代版补充' },
    ] },
  ];
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    for (const scope of scopes) {
      const filename = path.join(out, scope.file);
      await page.goto(pathToFileURL(filename).href);
      await page.evaluate(() => document.fonts.ready);
      const bodyWidth = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth, width: window.innerWidth,
      }));
      assert.ok(bodyWidth.scroll <= bodyWidth.width + 1, JSON.stringify(bodyWidth));
      for (const target of scope.targets) {
        const locator = page.locator(target.selector);
        assert.equal(await locator.count(), 1);
        assert.ok((await locator.innerText()).includes(target.text));
        assert.equal(await locator.locator('.katex-error,.err').count(), 0);
        const geometry = await locator.evaluate(element => {
          const rect = element.getBoundingClientRect();
          const words = Array.from(element.querySelectorAll('.nb,.sr-nb')).map(item => ({
            client: item.clientWidth, scroll: item.scrollWidth,
            overflow: getComputedStyle(item).overflowX,
          }));
          return { width: rect.width, height: rect.height, left: rect.left, right: rect.right,
            scrollWidth: element.scrollWidth, clientWidth: element.clientWidth, words };
        });
        assert.ok(geometry.width > 100 && geometry.height > 40);
        assert.ok(geometry.left >= -1 && geometry.right <= viewport.width + 1);
        for (const word of geometry.words) {
          assert.ok(word.scroll <= word.client + 1 || ['auto', 'scroll'].includes(word.overflow));
        }
        await locator.scrollIntoViewIfNeeded();
        const imagePath = path.join(out, `${viewport.width}-${target.name}.png`);
        await locator.screenshot({ path: imagePath });
        const bytes = fs.readFileSync(imagePath);
        const png = PNG.sync.read(bytes);
        let nonWhite = 0;
        for (let i = 0; i < png.data.length; i += 4) {
          if (Math.min(png.data[i], png.data[i + 1], png.data[i + 2]) < 220) nonWhite++;
        }
        assert.ok(nonWhite > 500);
        report.screenshots.push({
          path: imagePath, sha256: hash(bytes), bytes: bytes.length, viewport, target: target.name,
          geometry, nonWhitePixels: nonWhite, status: 'RUNTIME_PASS_VISUAL_PENDING',
        });
      }
      report.viewports.push({ viewport, scope: scope.name, status: 'RUNTIME_PASS', bodyWidth });
    }
  }
  assert.deepEqual(remoteRequests, []);
  assert.deepEqual(pageErrors, []);
  report.networkRequests = remoteRequests.length;
  report.pageErrors = pageErrors;
  report.surfaces = scopes.map(scope => {
    const filename = path.join(out, scope.file);
    const bytes = fs.readFileSync(filename);
    return { path: filename, sha256: hash(bytes), bytes: bytes.length };
  });
  report.status = 'RUNTIME_PASS_VISUAL_PENDING';
} catch (error) {
  report.status = 'FAILED';
  report.error = { message: error.message, stack: error.stack };
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  report.ownedBrowsersClosed = true;
  report.endedAt = new Date().toISOString();
  fs.writeFileSync(path.join(out, 'result.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' });
  console.log(JSON.stringify({ status: report.status, screenshots: report.screenshots.length,
    ownedBrowsersClosed: report.ownedBrowsersClosed, error: report.error?.message }));
}

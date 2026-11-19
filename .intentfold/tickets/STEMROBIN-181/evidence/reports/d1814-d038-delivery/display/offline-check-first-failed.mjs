import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(`${process.cwd()}/app/package.json`);
const { chromium } = require('playwright');
const { proseFlow } = require(path.resolve('.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'));
const root = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const renderRoot = '.tmp/STEMROBIN-181/d1814/display/render/10p';
const output = '.intentfold/tickets/STEMROBIN-181/tmp/d1814-offline-display';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const read = file => JSON.parse(fs.readFileSync(file));
const ids = [103, 104, 106].map(n => `phy10-c2-s5-n${n}`);
const editions = ['modern-us-neutral', 'modern-us-neutral-en'];
const viewports = [
  { name: 'desktop', width: 1440, height: 960 },
  { name: 'mobile', width: 390, height: 844 },
];
if (fs.existsSync(`${output}/result.json`)) throw new Error('Preserve the completed display check');
fs.mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const records = [];
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport });
    await context.route('**/*', route => route.abort());
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error') errors.push(message.text());
    });
    for (const edition of editions) {
      for (const id of ids) {
        const lesson = read(`${root}/editions/${edition}/lessons/${id}/lesson.json`);
        const exercises = read(`${root}/editions/${edition}/lessons/${id}/exercises.json`);
        const manifest = read(`${root}/editions/${edition}/lessons/${id}/figures.json`);
        assert.equal(exercises.count, 0);
        assert.equal(exercises.exercises.length, 0);
        const flow = proseFlow(lesson.prose, lesson.section_breaks);
        const textFile = `${renderRoot}/${edition}/${id}/text.html`;
        const textHtml = fs.readFileSync(textFile, 'utf8');
        assert(!/<(?:script|link)\b/i.test(textHtml), 'No online runtime in offline HTML');
        assert(textHtml.includes('data:font/woff2;base64,'), 'Inline fonts required');
        await page.setContent(textHtml, { waitUntil: 'load' });
        await page.evaluate(() => document.fonts.ready);
        assert.equal(await page.locator('.err,.katex-error').count(), 0);
        assert.equal(await page.locator('p.para').count(), flow.filter(block => block.kind === 'p').length);
        assert.equal(await page.locator('.figcap').count(), flow.filter(block => block.kind === 'cap').length);
        const paragraphs = await page.locator('p.para').allTextContents();
        const plain = text => text.replace(/\s+/g, ' ').trim();
        let paragraphIndex = 0;
        for (const block of flow) {
          if (block.kind !== 'p') continue;
          const actual = plain(paragraphs[paragraphIndex++]);
          const segments = block.text.replace(/\*\*/g, '').split(/\$\$.*?\$\$|\$.*?\$/gs)
            .map(plain).filter(Boolean);
          for (const segment of segments) {
            assert(actual.includes(segment), `Missing prose at ${edition}/${id}: ${segment}`);
          }
        }
        const geometry = await page.evaluate(() => {
          const box = node => {
            const r = node.getBoundingClientRect();
            return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom };
          };
          const elements = [...document.querySelectorAll('.sheet>h1,.sheet>.crumb,.sheet>p,.sheet>figure,.sheet>.figcap,.sheet>.jump')];
          return {
            viewport: innerWidth,
            width: document.documentElement.scrollWidth,
            boxes: elements.map(box),
            indent: [...document.querySelectorAll('p.para')].map(node => getComputedStyle(node).textIndent),
            breaks: [...document.querySelectorAll('p.para.section')].map(node => ({
              before: node.previousElementSibling?.textContent,
              after: node.textContent,
              border: getComputedStyle(node).borderTopWidth,
            })),
          };
        });
        assert(geometry.width <= viewport.width + 1, `${id} page overflow`);
        assert(geometry.boxes.every(box => box.width > 0 && box.height > 0
          && box.x >= -1 && box.right <= viewport.width + 1), `${id} off-page or invisible region`);
        for (let i = 1; i < geometry.boxes.length; i++) {
          assert(geometry.boxes[i].y >= geometry.boxes[i - 1].bottom - 1, `${id} overlapping regions`);
        }
        assert(geometry.indent.every(indent => parseFloat(indent) === 0), `${id} paragraph indentation`);
        assert.equal(geometry.breaks.length, lesson.section_breaks.length);
        assert(geometry.breaks.every(boundary => parseFloat(boundary.border) > 0));
        const media = [];
        assert.equal(await page.locator('figure.fig').count(), manifest.figures.length);
        for (const figure of manifest.figures) {
          const spec = read(`${root}/editions/${edition}/${figure.spec}`);
          const container = page.locator(`figure[id="${figure.id}"]`);
          assert.equal(await container.count(), 1);
          const checked = await container.evaluate(node => {
            const svg = node.querySelector('svg');
            const screen = svg?.getScreenCTM();
            const r = svg?.getBoundingClientRect();
            return {
              width: r?.width, height: r?.height,
              geometry: svg?.querySelectorAll('path,polygon,line,ellipse').length,
              texts: [...(svg?.querySelectorAll('[data-label-id]') || [])].map(label => ({
                text: label.textContent,
                px: parseFloat(getComputedStyle(label).fontSize) * Math.hypot(screen.a, screen.b),
              })),
              scrollWidth: node.scrollWidth, clientWidth: node.clientWidth,
              layout: node.dataset.figureLayout,
            };
          });
          assert(checked.width > 0 && checked.height > 0 && checked.geometry > 5, `${id} blank media`);
          assert(checked.texts.length > 0 && checked.texts.every(label => label.px >= spec.display.minTextPx - 0.1),
            `${id} small figure labels`);
          assert(spec.display.widths.some(width => Math.abs(width - checked.width) < 1), `${id} undeclared media width`);
          if (checked.scrollWidth > checked.clientWidth + 1) {
            await container.evaluate(node => { node.scrollLeft = node.scrollWidth; });
            const end = await container.evaluate(node => node.scrollWidth - node.clientWidth - node.scrollLeft);
            assert(end <= 1, `${id} unreachable figure right edge`);
            await container.evaluate(node => { node.scrollLeft = 0; });
          }
          media.push({ id: figure.id, ...checked });
        }
        const screenshot = `${output}/${edition}-${id}-${viewport.name}.png`;
        if (fs.existsSync(screenshot)) throw new Error(`Preserve first screenshot: ${screenshot}`);
        const pixels = await page.screenshot({ path: screenshot, fullPage: true });
        assert(pixels.length > 8000, 'Nonempty full display screenshot required');
        const link = page.getByRole('link', { name: edition.endsWith('-en') ? /Exercises.*0/ : /去做题.*0/ });
        assert.equal(await link.count(), 1);
        assert.equal(await link.getAttribute('href'), 'exercises.html');
        const exercisesFile = `${renderRoot}/${edition}/${id}/exercises.html`;
        await page.setContent(fs.readFileSync(exercisesFile, 'utf8'), { waitUntil: 'load' });
        assert.equal(await page.locator('li.ex,input,textarea,figure.fig,.err,.katex-error').count(), 0);
        assert.equal(await page.getByRole('link', { name: edition.endsWith('-en') ? /Back to text/ : /回课文/ }).count(), 1);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
        assert.equal(errors.length, 0, errors.join('\n'));
        records.push({ edition, id, viewport, proseBlocks: flow.length, exercises: 0,
          screenshot, screenshotHash: hash(pixels), textHtml: textFile,
          textHtmlHash: hash(fs.readFileSync(textFile)),
          exercisesHtml: exercisesFile, exercisesHtmlHash: hash(fs.readFileSync(exercisesFile)),
          media, geometry, status: 'pass' });
      }
    }
    await context.close();
  }
} finally {
  await browser.close();
}
fs.writeFileSync(`${output}/result.json`, JSON.stringify({
  schema: 'STEMROBIN-181/offline-bilingual-batch-display@1',
  batch: 'D038', headless: true, isolated: true, externalRequestsBlocked: true,
  productAcceptance: false, displayInspection: 'pending-independent-screenshot-review',
  records, status: 'pass',
}, null, 2) + '\n');
console.log(`PASS: ${records.length} text and ${records.length} empty-exercise surfaces; screenshot inspection pending.`);

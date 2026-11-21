import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { pathToFileURL, fileURLToPath } from 'node:url';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const out = path.dirname(fileURLToPath(import.meta.url));
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const freeze = read(path.join(out, 'input-freeze.json'));
for (const row of freeze.inputBindings)
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(row.path)).digest('hex'), row.sha256);
const authority = read(freeze.authority.path);
const { chromium } = createRequire(path.join(repo, 'app/package.json'))('playwright');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const records = [];
try {
  for (const record of authority.records) {
    const context = await browser.newContext({ viewport: {
      width: record.viewport.width, height: record.viewport.height,
    } });
    const url = pathToFileURL(record.html.path).href;
    await context.route('**/*', route =>
      route.request().url() === url ? route.continue() : route.abort());
    try {
      const page = await context.newPage();
      await page.goto(url, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      const evidence = await page.evaluate(() => {
        const paras = [...document.querySelectorAll('p.para')];
        const canonical = node => {
          const clone = node.cloneNode(true);
          for (const formula of clone.querySelectorAll('.katex')) {
            const annotation = formula.querySelector('annotation');
            formula.replaceWith(document.createTextNode(`$${annotation.textContent}$`));
          }
          return clone.textContent;
        };
        const headings = paras.map(node => ({ node, text: canonical(node) }))
          .filter(row => /^(?:[IVX]+\.\s|[一二三四五六七八九十]+、)/.test(row.text))
          .map(row => ({ text: row.text, strong: !!row.node.querySelector('strong'),
            fontWeight: getComputedStyle(row.node.querySelector('strong') ?? row.node).fontWeight }));
        const caption = document.querySelector('figure').nextElementSibling;
        const content = [...document.querySelector('.sheet').children].filter(node =>
          node.matches('p.para,figure') || node === caption);
        const normalized = paras.map(canonical);
        window.scrollTo(0, document.documentElement.scrollHeight);
        const tail = paras.at(-1).getBoundingClientRect();
        const forward = document.querySelector('a[href="exercises.html"]').getBoundingClientRect();
        return { experiments: headings, structuralContentBlocks: content.length,
          canonicalTail: normalized.slice(-5),
          footnoteCount: normalized.filter(text => text.startsWith('①')).length,
          caption: { text: caption.textContent, className: caption.className },
          scroll: { top: scrollY, documentHeight: document.documentElement.scrollHeight,
            viewportHeight: innerHeight, finalParagraph: { top: tail.top, bottom: tail.bottom },
            forwardLink: { top: forward.top, bottom: forward.bottom },
            tailAndForwardFullyVisible: tail.top >= 0 && tail.bottom <= innerHeight &&
              forward.top >= 0 && forward.bottom <= innerHeight } };
      });
      assert.equal(evidence.experiments.length, 10);
      assert(evidence.experiments.every(row => row.strong));
      assert.equal(evidence.structuralContentBlocks, 110);
      assert.equal(evidence.footnoteCount, 1);
      assert(evidence.canonicalTail.at(-1).startsWith('①'));
      assert(evidence.scroll.tailAndForwardFullyVisible);
      records.push({ locale: record.locale, viewport: record.viewport, ...evidence });
    } finally { await context.close(); }
  }
} finally { await browser.close(); }
const file = path.join(out, 'completeness-evidence.json');
fs.writeFileSync(file, `${JSON.stringify({
  status: 'PASS', authority: freeze.authority, checkedAt: new Date().toISOString(),
  sourceSemanticReviewReplayed: false, screenshotsCreated: 0, imageOpens: 0, records,
}, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ status: 'PASS', path: file,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'), records }, null, 2));

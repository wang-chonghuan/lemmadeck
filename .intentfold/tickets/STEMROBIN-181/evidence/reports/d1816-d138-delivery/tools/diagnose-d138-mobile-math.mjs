import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const { chromium } = createRequire(`${repo}/app/package.json`)('playwright');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
try {
  await page.setContent(fs.readFileSync('.intentfold/tickets/STEMROBIN-181/tmp/d1816-d138-t9-display/zh-mobile-answers.html', 'utf8'));
  await page.evaluate(() => document.fonts.ready);
  const measure = () => page.locator('.answer[data-exercise]').evaluateAll(nodes =>
    nodes.filter(node => ['4', '5', '6'].includes(node.dataset.exercise)).map(node => ({
      exercise: node.dataset.exercise,
      formulas: [...node.querySelectorAll('.sr-nb')].filter(span => span.querySelector('annotation')?.textContent.includes('\\displaystyle')).map(span => ({
        text: span.querySelector('annotation').textContent,
        width: span.getBoundingClientRect().width, scrollWidth: span.scrollWidth, clientWidth: span.clientWidth,
        overflow: getComputedStyle(span).overflowX, display: getComputedStyle(span).display,
        baseWidths: [...span.querySelectorAll('.base')].map(base => base.getBoundingClientRect().width),
      })),
    })));
  console.log(JSON.stringify({ before: await measure() }));
  await page.addStyleTag({ content: '.answer .sr-nb:has(.katex){display:inline;white-space:normal;overflow:visible;padding:0}' });
  console.log(JSON.stringify({ wrappingTrial: await measure(), pageWidth: await page.evaluate(() => document.documentElement.scrollWidth) }));
} finally { await browser.close(); }

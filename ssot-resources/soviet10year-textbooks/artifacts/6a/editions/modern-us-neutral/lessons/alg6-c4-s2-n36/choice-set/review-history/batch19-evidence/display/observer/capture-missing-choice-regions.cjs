const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { createRequire } = require('node:module');
const { pathToFileURL } = require('node:url');

delete process.env.PWDEBUG;
process.env.PLAYWRIGHT_HTML_OPEN = 'never';
process.env.PLAYWRIGHT_HTML_REPORT_OPEN = 'never';
const repo = path.resolve(__dirname, '../../../../..');
const requireApp = createRequire(path.join(repo, 'app/package.json'));
const { chromium } = requireApp('@playwright/test');
const html = path.join(repo,
  '.tmp/ld-s10y-lesson/render/6a/modern-us-neutral/alg6-c4-s2-n36/choices.html');
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const beforeHash = sha256(fs.readFileSync(html));
const launch = { headless: true };
const captures = [];
const positions = [];

async function record(locator, name, context) {
  const filename = path.join(__dirname, name + '.png');
  await locator.screenshot({ path: filename, animations: 'disabled', scale: 'css' });
  const bytes = fs.readFileSync(filename);
  captures.push({
    path: filename,
    sha256: sha256(bytes),
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
    ...context,
  });
}

async function run() {
  const browser = await chromium.launch(launch);
  let closed = false;
  try {
    for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
      const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
      try {
        await context.route(/https?:\/\//, route => route.abort());
        const page = await context.newPage();
        await page.goto(pathToFileURL(html).href);
        await page.evaluate(() => document.fonts.ready);
        const questions = page.locator('.choice');
        if (viewport.width === 390) {
          await record(questions.nth(1).locator('.choice-stem'),
            'choices-390-q2-stem', { viewport, question: 2, region: 'complete stem' });
          await record(questions.nth(3), 'choices-390-q4-complete',
            { viewport, question: 4, region: 'complete question and four options' });
        }
        await record(questions.nth(2).locator('.choice-stem'),
          `choices-${viewport.width}-q3-stem`,
          { viewport, question: 3, region: 'complete stem' });
        for (const q of [1, 2]) {
          const options = questions.nth(q).locator('.choice-options>li');
          for (let o = 0; o < 3; o++) {
            const option = options.nth(o);
            const body = option.locator('.choice-option-body');
            const label = String.fromCharCode(65 + o);
            await body.evaluate(node => {
              node.scrollLeft = 0;
              for (const child of node.querySelectorAll('.sr-nb,.nb')) child.scrollLeft = 0;
            });
            const max = await body.evaluate(node => node.scrollWidth - node.clientWidth);
            await record(option, `choices-${viewport.width}-q${q + 1}-${label}-left`,
              { viewport, question: q + 1, option: label, horizontal_position: 'left' });
            if (max > 0) {
              const actual = await body.evaluate(node => {
                node.scrollLeft = node.scrollWidth;
                return node.scrollLeft;
              });
              positions.push({ viewport, question: q + 1, option: label, max, actual });
              await record(option, `choices-${viewport.width}-q${q + 1}-${label}-right`,
                { viewport, question: q + 1, option: label, horizontal_position: 'right', max, actual });
            }
            const nested = await body.locator('.sr-nb,.nb').evaluateAll(nodes =>
              nodes.filter(node => node.scrollWidth > node.clientWidth)
                .map(node => ({ width: node.clientWidth, scroll_width: node.scrollWidth })));
            if (nested.length) {
              await body.locator('.sr-nb,.nb').evaluateAll(nodes => {
                for (const node of nodes) node.scrollLeft = node.scrollWidth;
              });
              await record(option, `choices-${viewport.width}-q${q + 1}-${label}-formula-ends`,
                { viewport, question: q + 1, option: label, nested_formula_scroll_regions: nested });
            }
          }
        }
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
    closed = true;
    const result = {
      scope: 'Same immutable choices HTML missing-region pixels only; no renderer/checker or semantic rerun.',
      html,
      before_sha256: beforeHash,
      after_sha256: sha256(fs.readFileSync(html)),
      launch,
      dependency: requireApp.resolve('@playwright/test'),
      custom_launcher: false,
      isolated_contexts: true,
      device_scale_factor: 1,
      PWDEBUG_present: Boolean(process.env.PWDEBUG),
      PLAYWRIGHT_HTML_OPEN: process.env.PLAYWRIGHT_HTML_OPEN,
      PLAYWRIGHT_HTML_REPORT_OPEN: process.env.PLAYWRIGHT_HTML_REPORT_OPEN,
      external_http_requests_blocked: true,
      user_profile_or_cdp_or_system_input: false,
      browser_closed: closed,
      captures,
      horizontal_capture_positions: positions,
      model_usage: null,
    };
    fs.writeFileSync(path.join(__dirname, 'supplement-capture-record.json'),
      JSON.stringify(result, null, 2) + '\n');
  }
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});

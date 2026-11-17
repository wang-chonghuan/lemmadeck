import assert from 'node:assert/strict';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import {
  root, ticket, absolute, read, bytes, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const folder = `${ticket}/tmp/d030-n111-heading-repair`;
const card = 'phy9-c2-s4-n111';
assert.ok(!await exists(`${folder}/result.json`));
const tool = '.claude/skills/ld-s10y-lesson/tools/render_lesson.js';
const before = await bytes(`${folder}/before/render_lesson.js`);
assert.equal((await bytes(tool)).toString('utf8'),
  before.toString('utf8').replace('<h1>${esc(title)}</h1>', '<h1>${inline(title)}</h1>'));
const failurePath = `${ticket}/tmp/d030-n111-pixel-review.json`;
await verify(failurePath, '6ef46a88979ba7fe1e6db44c8b0f166156f52a0c59fc253baa5646a0da842955');
const failure = await read(failurePath);
assert.equal(failure.status, 'fail');
assert.deepEqual(failure.findings.map(row => row.id), ['PIXEL-1']);
const oldDisplayPath = `${ticket}/tmp/offline-d024/result-${card}.json`;
const oldDisplay = await read(oldDisplayPath);
assert.equal(oldDisplay.status, 'pass');
const protectedFiles = await Promise.all([
  ...oldDisplay.results.flatMap(row => [row.sourceHtml.path, row.screenshot]),
  ...['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json'].map(name =>
    `ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/lessons/${card}/${name}`),
].map(bind));
const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'render', '--book', '9p',
  '--edition', 'modern-us-neutral', '--lesson', card, '--work', `${folder}/work`];
const native = spawnSync(command[0], command.slice(1), {
  encoding: 'utf8', timeout: 180000,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
await immutableWrite(`${folder}/render.json`, `${JSON.stringify({
  command, exitCode: native.status, signal: native.signal,
  stdout: native.stdout, stderr: native.stderr,
}, null, 2)}\n`);
assert.equal(native.status, 0, native.stderr);
const htmlChanges = [];
for (const surface of ['text', 'exercises']) {
  const old = oldDisplay.results.find(row => row.surface === surface).sourceHtml;
  await verify(old.path, old.sha256);
  const current = `${folder}/work/render/9p/modern-us-neutral/${card}/${surface}.html`;
  const oldHtml = (await bytes(old.path)).toString('utf8');
  const newHtml = (await bytes(current)).toString('utf8');
  const h1 = /<h1>[\s\S]*?<\/h1>/;
  assert.equal(newHtml.replace(h1, '<h1></h1>'), oldHtml.replace(h1, '<h1></h1>'));
  assert.notEqual(newHtml.match(h1)[0], oldHtml.match(h1)[0]);
  htmlChanges.push({ surface, before: old, after: await bind(current), onlyChangedElement: 'h1' });
}
const require = createRequire(path.join(root, 'app/package.json'));
const { chromium } = require('playwright');
const browser = await chromium.launch({ headless: true });
const headers = [];
try {
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport });
    for (const surface of ['text', 'exercises']) {
      const current = htmlChanges.find(row => row.surface === surface).after;
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(pathToFileURL(absolute(current.path)).href);
      await page.evaluate(() => document.fonts.ready);
      const metrics = await page.locator('h1').evaluate(heading => {
        const rect = heading.getBoundingClientRect();
        const clone = heading.cloneNode(true);
        const math = [...clone.querySelectorAll('.katex')];
        const formulas = math.map(element => {
          const tex = element.querySelector('annotation[encoding="application/x-tex"]').textContent;
          element.replaceWith(document.createTextNode(`$${tex}$`));
          return tex;
        });
        const following = heading.nextElementSibling.getBoundingClientRect();
        return {
          text: heading.textContent, markdownText: clone.textContent, formulas,
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          formulaErrors: heading.querySelectorAll('.err,.sr-tex-err,.katex-error').length,
          rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height, bottom: rect.bottom },
          fits: rect.left >= 0 && rect.right <= innerWidth && heading.scrollWidth <= heading.clientWidth + 1,
          followingTop: following.top, noFollowingOverlap: following.top >= rect.bottom - 1,
          headerScreenshotHeight: Math.ceil(following.bottom + 28),
        };
      });
      const suffix = surface === 'exercises' ? ' · 习题' : '';
      assert.equal(metrics.markdownText, `111. 通过 $p$ 型和 $n$ 型半导体交接面的电流${suffix}`);
      assert.deepEqual(metrics.formulas, ['p', 'n']);
      assert.equal(metrics.text.includes('$'), false);
      assert.equal(metrics.formulaErrors, 0);
      assert.equal(metrics.fits, true);
      assert.equal(metrics.overflow, false);
      assert.equal(metrics.noFollowingOverlap, true);
      assert.deepEqual(errors, []);
      const screenshot = `${folder}/${surface}-${viewport.width}-heading.png`;
      await page.screenshot({ path: absolute(screenshot),
        clip: { x: 0, y: 0, width: viewport.width, height: metrics.headerScreenshotHeight } });
      headers.push({
        surface, viewport, status: 'pass', metrics,
        sourceHtml: current, screenshot: await bind(screenshot),
        bodyMetricsReused: oldDisplay.results.find(row =>
          row.surface === surface && row.viewport.width === viewport.width).metrics,
      });
      await page.close();
    }
    await context.close();
  }
} finally {
  await browser.close();
}
for (const binding of protectedFiles) await verify(binding.path, binding.sha256);
await immutableWrite(`${folder}/result.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card, status: 'pass-heading-browser-pixels-pending',
  failure: await bind(failurePath), initialDisplay: await bind(oldDisplayPath),
  toolBefore: await bind(`${folder}/before/render_lesson.js`), toolAfter: await bind(tool),
  nativeRender: await bind(`${folder}/render.json`), htmlChanges, headers,
  protectedFiles, browser: { isolated: true, headless: true, userProfileUsed: false },
  limits: 'One-line existing inline-math heading fix, one render to a fresh work root, four affected heading checks. All non-h1 HTML bytes and original reviewed body/figures/screenshots unchanged. No SCI/figure/native-finalize rerun, new pixel inspection, DB/fulltests or complete-card/delivery claim.',
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(`${folder}/result.json`)));

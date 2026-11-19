import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';

const script = fileURLToPath(import.meta.url);
const own = path.dirname(script);
const root = path.resolve(own, '../../..');
const app = path.join(root, 'app');
const renderRoot = path.join(root, '.tmp/ld-s10y-lesson/render/9c/modern-us-neutral/ana9-c3-s1-n13');
const first = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov19-1844-offline/n13/first');
const repairRoot = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov19-1844-offline/n13/repair-native');
const beforeHash = '8894feeed9eeb821e40581be39e21f5e439fccfd0a20647dc80c29d2f5d30a7c';
const afterHash = 'c4bda9ebac846577bd1332857dcff7209e316f25213accabc6b66301abddf33b';
const firstFreezeHash = 'cc5aa2d99cc87cc34d6286e9f7e9f18433062c742bd40c58fb9d3782504840fd';
const allowedTex = [
  'r>0.\\underbrace{2399\\cdots9}_{k\\text{ 位}}',
  '0.24-0.\\underbrace{2399\\cdots9}_{k\\text{ 位}}=10^{-k}',
];
const viewports = [{ id: 'desktop-text', width: 1440, height: 960 }, { id: 'mobile-text', width: 390, height: 844 }];
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const json = value => JSON.stringify(value, null, 2) + '\n';
const save = (name, value) => fs.writeFile(path.join(own, name), json(value), { flag: 'wx' });
const imageUsage = { newImages: 0, screenshots: 0, loads: 0, crops: 0, reopens: 0, payloads: 0, cumulative: '6/6', cumulativeCap: 6, parentPayloads: 0, parentPermanent: '24/24' };

if (process.argv.includes('--freeze')) {
  const result = JSON.parse(await fs.readFile(path.join(own, 'results.json'), 'utf8'));
  const native = JSON.parse(await fs.readFile(path.join(own, 'native-receipt.json'), 'utf8'));
  const files = [];
  for (const name of (await fs.readdir(own)).sort()) {
    if (name === 'freeze.json') continue;
    const bytes = await fs.readFile(path.join(own, name));
    files.push({ path: path.join(own, name), bytes: bytes.length, sha256: sha(bytes) });
  }
  await save('freeze.json', {
    status: result.status, scope: result.scope, files, selfHashExcluded: true,
    inputFiles: result.inputs, repair: result.repair, image_usage: imageUsage,
    nativeExit: native.exitCode, nativeStreams: { stdout: native.stdout, stderr: native.stderr },
    closure: result.closure, passedReviewReplay: 0, wholeLessonApproval: false,
    authorReview: 'pending', independentKeyReview: 'pending', semanticOptionCorrectness: 'UNKNOWN',
  });
  console.log(JSON.stringify({ manifest: path.join(own, 'freeze.json'), status: result.status, files: files.length, image_usage: imageUsage, closure: result.closure }));
} else if (!process.argv.includes('--check')) {
  assert.ok(!(await fs.readdir(own)).includes('native-receipt.json'), 'This one-use invocation is already retained; do not replay');
  const startedAt = new Date().toISOString();
  const child = spawn(process.execPath, [script, '--check'], { cwd: app, stdio: ['ignore', 'pipe', 'pipe'] });
  const out = [], err = [];
  child.stdout.on('data', chunk => { out.push(chunk); process.stdout.write(chunk); });
  child.stderr.on('data', chunk => { err.push(chunk); process.stderr.write(chunk); });
  const exitCode = await new Promise((resolve, reject) => { child.once('error', reject); child.once('close', resolve); });
  const stdout = Buffer.concat(out), stderr = Buffer.concat(err);
  await fs.writeFile(path.join(own, 'native.stdout.log'), stdout, { flag: 'wx' });
  await fs.writeFile(path.join(own, 'native.stderr.log'), stderr, { flag: 'wx' });
  await save('native-receipt.json', {
    startedAt, finishedAt: new Date().toISOString(), cwd: app,
    command: [process.execPath, script], childCommand: [process.execPath, script, '--check'],
    exitCode, invocations: 1, reruns: 0,
    stdout: { path: path.join(own, 'native.stdout.log'), bytes: stdout.length, sha256: sha(stdout) },
    stderr: { path: path.join(own, 'native.stderr.log'), bytes: stderr.length, sha256: sha(stderr) },
    image_usage: imageUsage,
  });
  process.exitCode = exitCode ?? 1;
} else {
  const result = {
    scope: 'STEMROBIN-184 B n13 affected-only follow-up after two-wrapper repair',
    startedAt: new Date().toISOString(), status: 'UNKNOWN', nativeExit: 1,
    inputs: [], checks: [], views: viewports.map(v => ({ ...v, checks: [] })),
    network: { requests: [], deniedRequests: [], outsideAccess: 'deny' },
    image_usage: imageUsage, closure: { browser: 'not-started', server: 'not-started' },
    passedReviewReplay: 0, canonicalWrites: 0, htmlWrites: 0,
  };
  const bytesByPath = new Map();
  let browser, server;
  const openContexts = [];
  async function input(filename, expectedSha) {
    assert.ok(filename.startsWith(root + path.sep), 'Input outside workspace');
    const bytes = await fs.readFile(filename);
    const hash = sha(bytes);
    result.inputs.push({ path: filename, bytes: bytes.length, sha256: hash, expectedSha256: expectedSha ?? null });
    if (expectedSha) assert.equal(hash, expectedSha, `Input hash drift: ${filename}`);
    bytesByPath.set(filename, bytes);
    return bytes;
  }
  function pass(view, criterion, evidence) {
    const entry = { view: view?.id ?? 'preflight', criterion, status: 'PASS', evidence };
    result.checks.push(entry);
    if (view) view.checks.push(entry);
    console.log(JSON.stringify(entry));
  }
  function requireEvidence(view, criterion, value, evidence) {
    if (value) return pass(view, criterion, evidence);
    const entry = { view: view?.id ?? 'preflight', criterion, status: 'FAIL', evidence };
    result.checks.push(entry);
    if (view) view.checks.push(entry);
    console.error(JSON.stringify(entry));
    throw new Error(`${entry.view}: ${criterion}`);
  }
  try {
    const frozen = JSON.parse((await input(path.join(first, 'freeze.json'), firstFreezeHash)).toString('utf8'));
    const intake = JSON.parse((await input(path.join(repairRoot, 'parent-intake.json'))).toString('utf8'));
    const repairNative = JSON.parse((await input(path.join(repairRoot, 'receipt.json'), intake.rows.find(row => row.path.endsWith('/repair-native/receipt.json')).sha256)).toString('utf8'));
    assert.equal(repairNative.actualExit, 0);
    const receiptPath = path.join(root, '.tmp/stemrobin-184-resume/n13-layout-repair/receipt.json');
    const receipt = JSON.parse((await input(receiptPath, repairNative.outputs.find(o => o.path.endsWith('/receipt.json')).sha256)).toString('utf8'));
    assert.equal(receipt.beforeSha256, beforeHash);
    assert.equal(receipt.afterSha256, afterHash);
    assert.equal(receipt.wrapperChanges, 2);
    assert.equal(receipt.reverseExact, true);
    assert.equal(receipt.canonicalChanged, false);
    assert.equal(receipt.edits.length, 2);
    assert.deepEqual(receipt.edits.map(e => e.tex), allowedTex);
    assert.deepEqual(receipt.edits.map(e => e.ordinal), [56, 59]);
    const target = path.join(root, receipt.target);
    assert.equal(target, path.join(renderRoot, 'text.html'));
    for (const file of frozen.inputFiles) {
      assert.ok(!/\.(png|jpe?g|webp)$/i.test(file.path), 'No image inputs may be opened');
      await input(file.path, file.path === target ? afterHash : file.sha256);
    }
    const repaired = bytesByPath.get(target).toString('utf8');
    let offset = 0;
    const replacements = receipt.edits.map(edit => {
      assert.equal(edit.before, '<span class="nb">');
      assert.equal(edit.after, '<span class="nb" style="padding-bottom: 0.25em; overflow-y: hidden;">');
      assert.equal(edit.innerHTMLUnchanged, true);
      const index = edit.index + offset;
      assert.equal(repaired.slice(index, index + edit.after.length), edit.after);
      offset += edit.after.length - edit.before.length;
      return { ...edit, repairedIndex: index };
    });
    let reversed = repaired;
    for (const edit of replacements.toReversed()) reversed = reversed.slice(0, edit.repairedIndex) + edit.before + reversed.slice(edit.repairedIndex + edit.after.length);
    assert.equal(sha(Buffer.from(reversed)), beforeHash);
    const beforeEntry = frozen.inputFiles.find(file => file.path === target);
    assert.equal(Buffer.byteLength(repaired) - beforeEntry.bytes, 104);
    result.repair = { beforeSha256: beforeHash, afterSha256: afterHash, beforeBytes: beforeEntry.bytes, afterBytes: Buffer.byteLength(repaired),
      wrapperChanges: 2, reverseExact: true, allOtherOriginalInputsUnchanged: true, changes: replacements, repairedInput: target };
    pass(null, 'exact-two-wrapper-repair-and-input-hashes', result.repair);
    await save('input-validation.json', { status: 'PASS', repair: result.repair, inputs: result.inputs, image_usage: imageUsage });

    const html = new Map([
      ['/text.html', bytesByPath.get(target)],
      ['/exercises.html', bytesByPath.get(path.join(renderRoot, 'exercises.html'))],
    ]);
    server = http.createServer((req, res) => {
      const body = req.method === 'GET' ? html.get(req.url) : null;
      result.network.requests.push({ method: req.method, path: req.url, status: body ? 200 : 404 });
      res.writeHead(body ? 200 : 404, {
        'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store',
        'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; font-src data:; img-src data:; script-src 'none'; connect-src 'none'; base-uri 'none'; form-action 'none'",
      });
      res.end(body ?? 'Not in offline allowlist');
    });
    await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
    result.closure.server = 'running';
    const origin = `http://127.0.0.1:${server.address().port}`;
    result.origin = origin;
    const ready = await fetch(`${origin}/text.html`);
    assert.equal(ready.status, 200);
    await ready.arrayBuffer();
    const { chromium } = createRequire(path.join(app, 'package.json'))('playwright');
    browser = await chromium.launch({ headless: true, args: ['--disable-background-networking', '--disable-component-update', '--no-first-run'] });
    result.closure.browser = 'running';
    const windows = [];
    for (const view of result.views) {
      const context = await browser.newContext({ viewport: { width: view.width, height: view.height }, deviceScaleFactor: 1, serviceWorkers: 'block' });
      openContexts.push(context);
      await context.route('**/*', route => {
        const request = route.request();
        if (request.method() === 'GET' && [...html.keys()].some(name => request.url() === origin + name)) return route.continue();
        result.network.deniedRequests.push({ url: request.url(), method: request.method() });
        return route.abort('blockedbyclient');
      });
      const page = await context.newPage();
      // This follow-up has no screenshot or image API, including accidental calls.
      page.screenshot = async () => { throw new Error('Image budget exhausted: screenshots prohibited'); };
      await page.goto(`${origin}/text.html`, { waitUntil: 'load' });
      await page.evaluate(async ordinals => {
        await document.fonts.ready;
        const wrappers = ordinals.map(i => document.querySelectorAll('.katex')[i].closest('.nb'));
        let previous = '', stable = 0;
        for (let frame = 0; frame < 120; frame++) {
          await new Promise(requestAnimationFrame);
          const value = JSON.stringify(wrappers.flatMap(w => [w, w.closest('p.para')]).map(e => {
            const r = e.getBoundingClientRect(); return [r.x, r.y, r.width, r.height];
          }));
          stable = value === previous ? stable + 1 : 0;
          previous = value;
          if (stable >= 4 && document.fonts.status === 'loaded') return;
        }
        throw new Error('Affected formula geometry did not stabilize');
      }, receipt.edits.map(e => e.ordinal));
      const geometry = await page.evaluate(edits => {
        const measure = document.createElement('canvas').getContext('2d');
        const rect = element => { const r = element.getBoundingClientRect(); return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height }; };
        return edits.map(edit => {
          const math = document.querySelectorAll('.katex')[edit.ordinal];
          const host = math.closest('.nb'), outer = rect(host), style = getComputedStyle(host);
          const paragraph = host.closest('p.para');
          const neighbors = { previous: paragraph.previousElementSibling, current: paragraph, next: paragraph.nextElementSibling };
          const nearby = Object.fromEntries(Object.entries(neighbors).map(([name, element]) => [name, {
            tag: element.tagName, className: element.className, bounds: rect(element),
          }]));
          const leaves = [...math.querySelectorAll('.katex-html span')].filter(e => e.childNodes.length === 1 && e.firstChild.nodeType === Node.TEXT_NODE && e.textContent.replace(/\u200b/g, '').trim());
          const glyphs = leaves.map(node => {
            const css = getComputedStyle(node);
            measure.font = `${css.fontStyle} ${css.fontWeight} ${css.fontSize} ${css.fontFamily}`;
            const metrics = measure.measureText(node.textContent);
            const range = document.createRange();
            range.selectNodeContents(node);
            const r = range.getBoundingClientRect();
            const baseline = r.top + metrics.fontBoundingBoxAscent;
            const top = baseline - metrics.actualBoundingBoxAscent, bottom = baseline + metrics.actualBoundingBoxDescent;
            const left = r.left - metrics.actualBoundingBoxLeft, right = r.left + metrics.actualBoundingBoxRight;
            return { text: node.textContent, font: measure.font, rangeHeight: r.height,
              fontBoxHeight: metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent,
              baseline, glyphTop: top, glyphBottom: bottom, glyphLeft: left, glyphRight: right,
              hostTop: outer.top, hostBottom: outer.bottom, bottomClearance: outer.bottom - bottom,
              metricsAgree: Math.abs(r.height - metrics.fontBoundingBoxAscent - metrics.fontBoundingBoxDescent) <= 1,
              verticallyContained: top >= outer.top - 0.5 && bottom <= outer.bottom + 0.5,
              horizontallyReachable: left >= outer.left - 0.5 && right <= outer.left + host.scrollWidth + 0.5,
            };
          });
          return { ordinal: edit.ordinal, tex: math.querySelector('annotation').textContent, expectedTex: edit.tex,
            inlineStyle: host.getAttribute('style'), paddingBottom: style.paddingBottom, overflowY: style.overflowY,
            bounds: outer, neighbors: nearby, glyphs,
            minimumBottomClearance: Math.min(...glyphs.map(g => g.bottomClearance)),
            previousGap: nearby.current.bounds.top - nearby.previous.bounds.bottom,
            nextGap: nearby.next.bounds.top - nearby.current.bounds.bottom,
            glyphsContainedByParagraph: glyphs.every(g => g.glyphTop >= nearby.current.bounds.top - 0.5 && g.glyphBottom <= nearby.current.bounds.bottom + 0.5),
          };
        });
      }, receipt.edits);
      requireEvidence(view, 'two-repaired-formulas-actual-font-ink-geometry', geometry.length === 2 && geometry.every(f =>
        f.tex === f.expectedTex && f.overflowY === 'hidden' && parseFloat(f.paddingBottom) > 0 &&
        f.glyphs.length > 0 && f.glyphs.every(g => g.metricsAgree && g.verticallyContained && g.horizontallyReachable)), geometry);
      requireEvidence(view, 'immediate-neighboring-paragraph-geometry', geometry.every(f =>
        f.neighbors.previous.tag === 'P' && f.neighbors.next.tag === 'P' &&
        f.previousGap >= -0.5 && f.nextGap >= -0.5 && f.glyphsContainedByParagraph), geometry.map(f => ({
          ordinal: f.ordinal, previousGap: f.previousGap, nextGap: f.nextGap,
          glyphsContainedByParagraph: f.glyphsContainedByParagraph, neighbors: f.neighbors,
        })));
      windows.push({ view, page });
    }
    // Both affected viewport/neighbor premises passed before previously UNKNOWN checks run.
    for (const { view, page } of windows) {
      const scrolling = await page.evaluate(async () => {
        const math = [...document.querySelectorAll('.katex')];
        const hosts = new Set();
        const uncontained = [];
        for (let index = 0; index < math.length; index++) {
          const visual = math[index].querySelector('.katex-html');
          const right = visual.getBoundingClientRect().right;
          const local = [];
          for (let parent = math[index].parentElement; parent && parent !== document.body; parent = parent.parentElement) {
            const css = getComputedStyle(parent), r = parent.getBoundingClientRect();
            if (['auto', 'scroll'].includes(css.overflowX) && parent.scrollWidth > parent.clientWidth + 1) local.push(parent);
            if (['hidden', 'clip'].includes(css.overflowX) && right > r.right + 1) uncontained.push({ index, host: parent.className, right, hostRight: r.right });
          }
          local.forEach(host => hosts.add(host));
        }
        const rows = [];
        for (const host of hosts) {
          host.scrollIntoView({ block: 'center' });
          const previous = host.scrollLeft;
          host.scrollLeft = host.scrollWidth;
          await new Promise(requestAnimationFrame);
          const hostRight = host.getBoundingClientRect().right, max = host.scrollWidth - host.clientWidth;
          const ends = [...host.querySelectorAll('.katex-html')].map(e => ({ right: e.getBoundingClientRect().right, tex: e.parentElement.querySelector('annotation')?.textContent }));
          rows.push({ host: host.className, clientWidth: host.clientWidth, scrollWidth: host.scrollWidth, max, actualEnd: host.scrollLeft,
            reachableEnd: Math.abs(host.scrollLeft - max) <= 1, hostRight, ends, finalInkBoxesAccessible: ends.every(e => e.right <= hostRight + 1) });
          host.scrollLeft = previous;
        }
        return { overflowHosts: rows.length, rows, uncontained, outcome: rows.length ? 'exercised nested scroll ends' : 'no overflowing math host; all ends fit at this viewport' };
      });
      requireEvidence(view, 'previously-UNKNOWN-text-nested-scroll-end', scrolling.uncontained.length === 0 &&
        scrolling.rows.every(row => row.reachableEnd && row.finalInkBoxesAccessible), scrolling);
      const reach = await page.evaluate(async () => {
        const paragraphs = [...document.querySelectorAll('p.para')];
        const rowResults = [];
        for (let index = 0; index < paragraphs.length; index++) {
          const paragraph = paragraphs[index];
          paragraph.scrollIntoView({ block: 'center' });
          await new Promise(requestAnimationFrame);
          const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT);
          const bands = [];
          while (walker.nextNode()) {
            const text = walker.currentNode;
            if (!text.textContent.replace(/\u200b/g, '').trim() || text.parentElement.closest('.katex-mathml,svg')) continue;
            const range = document.createRange();
            range.selectNodeContents(text);
            for (const box of range.getClientRects()) if (box.width > 0 && box.height > 0) bands.push({
              top: box.top + scrollY, bottom: box.bottom + scrollY,
            });
          }
          const unique = [...new Map(bands.map(b => [`${b.top.toFixed(3)}:${b.bottom.toFixed(3)}`, b])).values()];
          for (const band of unique) {
            scrollTo(0, band.top - innerHeight / 2);
            await new Promise(requestAnimationFrame);
            if (band.bottom - scrollY <= 0 || band.top - scrollY >= innerHeight) throw new Error(`Unreachable paragraph ${index} row ${band.top}`);
          }
          rowResults.push({ paragraph: index, reachedRows: unique.length });
        }
        const link = document.querySelector('a.jump');
        link.scrollIntoView({ block: 'center' });
        await new Promise(requestAnimationFrame);
        const r = link.getBoundingClientRect();
        const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return { paragraphCount: paragraphs.length, rowsReached: rowResults.reduce((sum, row) => sum + row.reachedRows, 0),
          paragraphs: rowResults, linkReached: r.top >= 0 && r.bottom <= innerHeight && (hit === link || link.contains(hit)),
          documentScrollYAtLink: scrollY };
      });
      requireEvidence(view, 'previously-UNKNOWN-text-row-reachability', reach.paragraphs.every(p => p.reachedRows > 0) && reach.linkReached, reach);
      const link = page.getByRole('link');
      const href = await link.getAttribute('href');
      assert.equal(href, 'exercises.html');
      const responsePromise = page.waitForResponse(response => response.url() === `${origin}/exercises.html` && response.request().method() === 'GET');
      await link.click();
      const response = await responsePromise;
      await page.waitForURL(`${origin}/exercises.html`);
      requireEvidence(view, 'previously-UNKNOWN-text-forward-navigation', response.status() === 200 && page.url() === `${origin}/exercises.html`,
        { target: href, responseStatus: response.status(), finalUrl: page.url(), exerciseContentReviewed: false });
    }
    result.status = 'PASS';
    result.nativeExit = 0;
  } catch (error) {
    result.status = 'FAIL';
    result.error = { message: error.message, stack: error.stack };
    result.dependentChecks = 'Stopped at first failure; unexecuted checks remain UNKNOWN';
    console.error(error.stack);
  } finally {
    for (const context of openContexts) await context.close();
    if (browser) { await browser.close(); result.closure.browser = browser.isConnected() ? 'FAIL-still-connected' : 'closed'; }
    if (server) { await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve())); result.closure.server = server.listening ? 'FAIL-still-listening' : 'closed'; }
    for (const view of result.views) {
      view.status = view.checks.some(c => c.status === 'FAIL') ? 'FAIL' : view.checks.length === 5 ? 'PASS' : 'UNKNOWN';
    }
    result.finishedAt = new Date().toISOString();
    await save('results.json', result);
    console.log(JSON.stringify({ status: result.status, nativeExit: result.nativeExit, checks: result.checks.length,
      views: result.views.map(v => ({ id: v.id, status: v.status })), image_usage: imageUsage, closure: result.closure }));
    process.exitCode = result.nativeExit;
  }
}

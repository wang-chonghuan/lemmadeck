import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const W = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188';
assert.equal(fs.realpathSync(process.cwd()), W);
const O = `${W}/.intentfold/tickets/STEMROBIN-188/tmp/n38-choices-display-independent7`;
const captureHorizontal = process.argv[2] === '--capture-horizontal';
const B = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g';
const E = `${B}/editions/modern-us-neutral`;
const D = `${E}/lessons/geo68-c3-s2-n38`;
const evidence = `${B}/evidence/stemrobin188-6g-n38`;
const producerPath = '.intentfold/tickets/STEMROBIN-188/tmp/display-n38-7.mjs';
const renderPath = '.tmp/ld-s10y-lesson/render/6-8g/modern-us-neutral/geo68-c3-s2-n38/text.html';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const sha = file => hash(fs.readFileSync(file));
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'));
assert.equal(sha(`${evidence}/display7/choices.json`), '93f617a7118714689fffb3cf6e89800c22d08ab57c2265afb81dba39a8cf70e6');
assert.equal(sha(`${evidence}/choices-repair7/view-only.json`), '24a583e352284d24a3602def7d0241434a658068dd80adb95f42fa5b61683457');
const manifest = json(`${evidence}/display7/choices.json`);
const views = json(`${evidence}/choices-repair7/view-only.json`);
assert.equal(views.questions.length, 20);
assert.equal(views.questions.reduce((n, q) => n + q.options.length, 0), 83);
const lesson = { title: json(`${D}/lesson.json`).title };
assert.equal(sha(`${D}/lesson.json`), manifest.sourceHashes['lesson.json']);

// Only IDs are projected from draft; no intent, coverage, or key is exported.
const ids = json(`${D}/choice-set/draft.json`).questions.map(q => q.id);
assert.equal(sha(`${D}/choice-set/draft.json`), manifest.sourceHashes['choice-set/draft.json']);
assert.equal(ids.length, views.questions.length);
const draft = {
  questions: views.questions.map((view, index) => ({ id: ids[index], view })),
  new_figures: [],
};
const seed = { figures: json(`${D}/choice-set/seed.json`).figures.map(({ id, assets }) => ({ id, assets })) };
assert.deepEqual(
  views.figures.map(f => ({ id: f.id, assets: f.assets.map(a => a.path) })),
  seed.figures.map(f => ({ id: f.id, assets: f.assets.map(a => a.path) })),
);
const read = file => {
  assert.ok(file.startsWith(`${E}/figures/`) && file.endsWith('.spec.json'));
  return { display: json(file).display };
};
const producer = fs.readFileSync(producerPath, 'utf8');
const start = producer.indexOf("      const css = await page.locator('head > style').textContent();");
const end = producer.indexOf('\n    }\n    await page.evaluate', start);
assert.ok(start >= 0 && end > start);
const branch = producer.slice(start, end);
const fragmentMathCss = JSON.parse(
  producer.match(/const fragmentMathCss = '([^']+)';/)[1]
    .replaceAll('\\', '\\\\')
    .replaceAll('"', '\\"')
    .replace(/^/, '"')
    .replace(/$/, '"'),
);
const baseCss = fs.readFileSync(renderPath, 'utf8').match(/<style[^>]*>([\s\S]*?)<\/style>/)[1];
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const exactChoicesBranch = new AsyncFunction(
  'page', 'seed', 'draft', 'E', 'read', 'sha', 'fs', 'path', 'assert', 'choiceHtml', 'lesson', 'fragmentMathCss',
  branch,
);
const require = createRequire(`${W}/app/package.json`);
const { chromium } = require('playwright');
const { choiceHtml } = await import(`${W}/.claude/skills/ld-s10y-lesson/tools/choice_html.mjs`);
const bindings = {
  manifest: { path: `${evidence}/display7/choices.json`, sha256: sha(`${evidence}/display7/choices.json`) },
  viewOnly: { path: `${evidence}/choices-repair7/view-only.json`, sha256: sha(`${evidence}/choices-repair7/view-only.json`) },
  producer: { path: producerPath, sha256: sha(producerPath), choicesBranchSha256: hash(branch) },
  baseCss: { from: renderPath, sha256: hash(baseCss) },
  fragmentMathCssSha256: hash(fragmentMathCss),
  choiceHtml: { path: '.claude/skills/ld-s10y-lesson/tools/choice_html.mjs', sha256: sha('.claude/skills/ld-s10y-lesson/tools/choice_html.mjs') },
  title: lesson.title,
  lessonSha256: sha(`${D}/lesson.json`),
  draftIdProjectionOnly: true,
  draftSha256: sha(`${D}/choice-set/draft.json`),
  seedSha256: sha(`${D}/choice-set/seed.json`),
  assets: seed.figures.map(f => ({
    id: f.id,
    assets: f.assets.map(a => {
      assert.equal(sha(a.path), a.sha256);
      return { path: a.path, sha256: a.sha256 };
    }),
    displaySha256: hash(JSON.stringify(read(`${E}/figures/${f.id}.spec.json`).display)),
  })),
};
const results = [];
const windows = [];
let contactSheet = null;
const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport });
    const blockedRequests = [];
    await context.route(/^https?:/, route => {
      blockedRequests.push(route.request().url());
      return route.abort();
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setContent(`<!doctype html><meta charset="utf-8"><style>${baseCss}</style>`);
    await exactChoicesBranch(page, seed, draft, E, read, sha, fs, path, assert, choiceHtml, lesson, fragmentMathCss);
    await page.evaluate(() => document.fonts.ready);
    const surfaceSha256 = hash(await page.content());
    const observed = await page.evaluate(() => {
      const rect = node => {
        const r = node.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom };
      };
      const questions = [...document.querySelectorAll('.choice-question')];
      const identify = node => ({
        question: questions.indexOf(node.closest('.choice-question')) + 1,
        option: node.closest('.choice-option')?.dataset.option ?? null,
      });
      const endpoints = [...document.querySelectorAll('.sr-nb, .nb, .choice-content, .choice-stem, .choice-figure')].map((node, index) => {
        const before = node.scrollLeft;
        const expectedEnd = Math.max(0, node.scrollWidth - node.clientWidth);
        node.scrollLeft = expectedEnd;
        const actualEnd = node.scrollLeft;
        const descendants = [...node.querySelectorAll('.katex-html, table')];
        const rightmost = descendants.length ? Math.max(...descendants.map(n => n.getBoundingClientRect().right)) : null;
        const result = {
          index, ...identify(node), className: node.className,
          clientWidth: node.clientWidth, scrollWidth: node.scrollWidth,
          initial: before, expectedEnd, actualEnd,
          boxAtEnd: rect(node), rightmostAtEnd: rightmost,
        };
        node.scrollLeft = before;
        return result;
      });
      const tables = [...document.querySelectorAll('.choice-content table')].map(table => {
        const lastColumn = [...table.querySelectorAll('tr')].map(row => rect(row.lastElementChild));
        return {
          ...identify(table), headerColumns: table.querySelectorAll('thead th').length,
          rows: table.querySelectorAll('tbody tr').length,
          rowColumns: [...table.querySelectorAll('tbody tr')].map(row => row.children.length),
          box: rect(table), container: rect(table.closest('.choice-content')),
          lastColumn,
        };
      });
      return {
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
        katexErrors: document.querySelectorAll('.katex-error').length,
        mathFragments: document.querySelectorAll('.sr-nb, .nb').length,
        controls: {
          radio: document.querySelectorAll('input[type="radio"]').length,
          checkbox: document.querySelectorAll('input[type="checkbox"]').length,
        },
        questions: questions.map((q, index) => ({
          number: index + 1, box: rect(q), stemBox: rect(q.querySelector('.choice-stem')),
          options: [...q.querySelectorAll(':scope > .choice-option')].map(o => ({
            id: o.dataset.option, type: o.querySelector('input').type,
            control: rect(o.querySelector('input')), letter: rect(o.querySelector('.choice-letter')),
            content: rect(o.querySelector('.choice-content')),
          })),
        })),
        endpoints,
        overflow: endpoints.filter(e => e.expectedEnd > 1),
        tables,
        figures: [...document.querySelectorAll('figure')].map(f => ({ id: f.id, box: rect(f) })),
      };
    });
    const originals = manifest.results.filter(r => r.viewport.width === viewport.width);
    assert.equal(observed.width, viewport.width);
    assert.equal(observed.height, originals.at(-1).clip.y + originals.at(-1).clip.height);
    assert.equal(observed.questions.length, 20);
    assert.deepEqual(observed.controls, { radio: 72, checkbox: 11 });
    assert.equal(observed.katexErrors, 0);
    assert.deepEqual(errors, []);
    assert.deepEqual(blockedRequests, []);
    for (const endpoint of observed.endpoints)
      assert.ok(Math.abs(endpoint.expectedEnd - endpoint.actualEnd) <= 1);
    for (const table of observed.tables) {
      assert.equal(table.headerColumns, 3);
      assert.equal(table.rows, 3);
      assert.deepEqual(table.rowColumns, [3, 3, 3]);
      assert.ok(table.lastColumn.every(cell => cell.right <= table.container.right + 1));
    }
    for (const [index, question] of observed.questions.entries()) {
      const view = views.questions[index];
      assert.deepEqual(question.options.map(o => o.id), view.options.map(o => o.id));
      assert.ok(question.options.every(o => o.type === (view.mode === 'single' ? 'radio' : 'checkbox')));
      assert.ok(question.options.every(o => o.control.width === 16 && o.control.height === 16));
    }
    results.push({ viewport, surfaceSha256, ...observed, pageErrors: errors, networkRequests: blockedRequests.length });
    if (captureHorizontal) {
      const originalEndpoints = json(`${O}/endpoints.json`).results.find(r => r.viewport.width === viewport.width);
      assert.equal(surfaceSha256, originalEndpoints.surfaceSha256);
      assert.deepEqual(observed.overflow, originalEndpoints.overflow);
      assert.equal(observed.overflow.length, 3);
      for (const endpoint of observed.overflow) {
        assert.equal(endpoint.question, 20);
        assert.equal(endpoint.expectedEnd, 2);
        const target = page.locator('.sr-nb, .nb, .choice-content, .choice-stem, .choice-figure').nth(endpoint.index);
        await target.scrollIntoViewIfNeeded();
        const clip = await target.evaluate(node => {
          node.scrollLeft = node.scrollWidth - node.clientWidth;
          const box = node.getBoundingClientRect();
          return {
            x: Math.max(0, Math.floor(box.x) - 8),
            y: Math.max(0, Math.floor(box.y) - 6),
            width: Math.ceil(box.width) + 16,
            height: Math.ceil(box.height) + 12,
          };
        });
        assert.equal(await target.evaluate(node => node.scrollLeft), endpoint.actualEnd);
        const bytes = await page.screenshot({ clip });
        windows.push({
          viewport: viewport.width, question: 20, option: endpoint.option,
          endpointIndex: endpoint.index, expectedEnd: 2, actualEnd: 2,
          scrollY: await page.evaluate(() => scrollY), clip,
          sha256: hash(bytes), png: bytes.toString('base64'),
        });
      }
    }
    await context.close();
  }
  if (captureHorizontal) {
    assert.equal(windows.length, 6);
    const context = await browser.newContext({ viewport: { width: 480, height: 168 } });
    const page = await context.newPage();
    await page.setContent('<!doctype html><style>body{margin:0}canvas{display:block}</style><canvas width="480" height="168"></canvas>');
    await page.evaluate(async windows => {
      const canvas = document.querySelector('canvas');
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '12px sans-serif';
      for (const [index, window] of windows.entries()) {
        const x = (index % 3) * 160;
        const y = Math.floor(index / 3) * 84;
        ctx.fillStyle = '#111111';
        ctx.fillText(`${window.viewport} q20 ${window.option ?? 'stem'} end=2`, x + 8, y + 16);
        const image = new Image();
        image.src = `data:image/png;base64,${window.png}`;
        await image.decode();
        ctx.drawImage(image, x + 8, y + 26);
      }
    }, windows);
    const file = `${O}/horizontal-ends-contact.png`;
    assert.ok(!fs.existsSync(file));
    await page.locator('canvas').screenshot({ path: file });
    contactSheet = { path: file, sha256: sha(file), width: 480, height: 168, scale: 1 };
    await context.close();
  }
} finally {
  await browser.close();
}
const report = {
  scope: 'exact-producer choices display endpoints only',
  headless: true, offline: true, productFunctionalityTested: false,
  baseStylesOnly: true, originalModernTextNotLoaded: true,
  contentOrStylesChanged: false,
  bindings, results, newScreenshotCount: captureHorizontal ? 1 : 0,
  contactSheet,
  windows: windows.map(({ png, ...window }) => window),
  ...(captureHorizontal ? { initialEndpointsSha256: sha(`${O}/endpoints.json`) } : {}),
};
const reportFile = `${O}/${captureHorizontal ? 'horizontal-windows' : 'endpoints'}.json`;
fs.writeFileSync(reportFile, `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({
  status: results.some(r => r.overflow.length) ? 'uncovered-horizontal-windows' : 'no-uncovered-horizontal-windows',
  results: results.map(r => ({
    viewport: r.viewport, height: r.height, mathFragments: r.mathFragments,
    controls: r.controls, overflow: r.overflow, tables: r.tables.map(t => ({ question: t.question, option: t.option, lastColumnFits: true })),
  })),
  report: reportFile, sha256: sha(reportFile), contactSheet,
}, null, 2));

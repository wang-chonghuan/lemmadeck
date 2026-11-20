import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';

const W = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), W);
const E = path.join(W, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d073-n126-author');
const O = path.join(W, '.tmp/STEMROBIN-181/d1816-d073');
const load = file => JSON.parse(fs.readFileSync(file));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({path: file, sha256: hash(file)});
const save = (file, data) => {
  assert.ok(file.startsWith(E + '/') || file.startsWith(O + '/'));
  fs.mkdirSync(path.dirname(file), {recursive: true});
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', {flag: 'wx'});
};
const unused = [];
for (const name of fs.readdirSync(path.join(O, 'root/9p/figures'))) {
  if (name === 'fig-286.png' || name === 'fig-286.svg') continue;
  const from = path.join(O, 'root/9p/figures', name);
  const to = path.join(O, 'native-unused-figures-excluded', name);
  fs.mkdirSync(path.dirname(to), {recursive: true});
  assert.ok(!fs.existsSync(to));
  unused.push({file: bind(from), retainedOnlyAsUnusedNativeSideEffect: to});
  fs.renameSync(from, to);
}
save(path.join(E, 'unused-native-figures-excluded.json'), {
  role: 'FIRST_AUTHOR', files: unused, count: unused.length, deliveryFigureIds: ['fig-286'],
  cause: 'Native promote_figures copies every prepared figure in the explicit shared work root, not only the3 copied page JSON files.',
  recovery: 'Moved unrelated native copies out of the target carrier; no shared bytes changed and no successful assembly rerun.',
  unusedImagesOpened: 0,
});
const runtime = path.join(W, '.tmp/STEMROBIN-181/d1816-d057/n22-figure-author/runtime/ld-s10y-image/scripts');
save(path.join(E, 'runtime-reuse.json'), {
  role: 'FIRST_AUTHOR', readOnlyExistingRuntime: runtime, newDependencies: false,
  packageWrites: false, skillWrites: false,
  files: ['render_spec.mjs', 'validate_spec.py', 'materialize_arrowheads.mjs'].map(name => {
    const source = path.join(W, '.agents/skills/ld-s10y-image/scripts', name);
    const reused = path.join(runtime, name);
    assert.equal(hash(source), hash(reused));
    return {source: bind(source), readOnlyReusedCopy: bind(reused)};
  }),
});
const require = createRequire(import.meta.url);
const {chromium} = require('/Users/yong/work/lemmadeck-ws/lemmadeck/.agents/skills/node_modules/playwright-core');
const browser = await chromium.launch({headless: true,
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const results = [];
try {
  for (const edition of ['modern-us-neutral', 'modern-us-neutral-en']) {
    const folder = path.join(O, 'figures', edition);
    const specFile = path.join(folder, 'fig-286.spec.json');
    const svgFile = path.join(folder, 'fig-286.svg');
    const reportFile = path.join(folder, 'fig-286.render.json');
    const spec = load(specFile);
    const report = load(reportFile);
    assert.equal(report.status, 'pass');
    assert.equal(report.spec.sha256, hash(specFile));
    assert.equal(report.output.svg.sha256, hash(svgFile));
    assert.equal(spec.objects.some(x => x.type === 'svgPath'), false);
    assert.equal(spec.source.inventory.filter(x => x.id.startsWith('source-field-trace-')).length, 5);
    for (const prefix of ['text-applied-field', 'text-induced-field']) {
      const arrow = spec.objects.find(x => x.id === prefix + '-direction');
      assert.equal(arrow.to[0] - arrow.from[0], 145);
      assert.equal(arrow.to[1] - arrow.from[1], 0);
    }
    const captures = [];
    for (const viewport of [{width: 1440, height: 960}, {width: 390, height: 844}]) {
      const page = await browser.newPage({viewport, deviceScaleFactor: 1});
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      const svg = fs.readFileSync(svgFile, 'utf8');
      await page.setContent(`<style>
        html,body{margin:0;background:white;overflow-x:hidden}
        main{max-width:860px;margin:24px auto;padding:16px;box-sizing:border-box}
        .scroll{width:100%;overflow-x:auto}
        .media{width:640px;min-width:640px}
        svg{display:block;width:640px;height:640px}
      </style><main><div class="scroll"><div class="media">${svg}</div></div></main>`);
      const geometry = await page.locator('svg').evaluate(svg => ({
        mediaWidth: svg.getBoundingClientRect().width,
        labels: [...svg.querySelectorAll('text')].map(node => {
          const matrix = node.getScreenCTM();
          const px = parseFloat(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b);
          const box = node.getBoundingClientRect();
          return {id: node.id, text: node.textContent, px,
            box: {x: box.x, y: box.y, width: box.width, height: box.height}};
        }),
      }));
      assert.equal(geometry.mediaWidth, 640);
      assert.ok(geometry.labels.every(x => x.px >= 16));
      const pngPath = path.join(O, 'previews', `${edition}-${viewport.width}-start.png`);
      fs.mkdirSync(path.dirname(pngPath), {recursive: true});
      await page.screenshot({path: pngPath});
      const scroll = await page.locator('.scroll').evaluate(node => {
        const max = node.scrollWidth - node.clientWidth;
        node.scrollLeft = max;
        return {width: node.clientWidth, scrollWidth: node.scrollWidth,
          maxScrollLeft: max, actualScrollLeft: node.scrollLeft,
          noPageOverflow: document.documentElement.scrollWidth === innerWidth};
      });
      assert.equal(scroll.actualScrollLeft, scroll.maxScrollLeft);
      assert.ok(scroll.noPageOverflow);
      const endPath = path.join(O, 'previews', `${edition}-${viewport.width}-end.png`);
      await page.screenshot({path: endPath});
      const pixelCheck = await page.evaluate(async svgText => {
        const image = new Image();
        image.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgText)));
        await image.decode();
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
        let ink = 0;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] > 100 && Math.min(data[i], data[i+1], data[i+2]) < 170) ink++;
        }
        return {width: image.naturalWidth, height: image.naturalHeight, inkPixels: ink};
      }, svg);
      assert.ok(pixelCheck.inkPixels > 1000 && pixelCheck.inkPixels < 640 * 640 * 0.5);
      assert.deepEqual(errors, []);
      captures.push({viewport, geometry, scroll, pixelCheck, pageErrors: errors,
        startPreview: bind(pngPath), endPreview: bind(endPath)});
      await page.close();
    }
    results.push({edition, spec: bind(specFile), svg: bind(svgFile),
      nativeRender: bind(reportFile), captures});
  }
} finally {
  await browser.close();
}
save(path.join(E, 'author-figure-display-proof.json'), {
  schema: 'STEMROBIN-181/author-figure-display-proof@1', role: 'FIRST_AUTHOR',
  status: 'pass', results, actualMediaWidth: 640, mobileScrollEndReachable: true,
  firstAuthorValidatorWithoutRequireReview: true,
  limitation: 'Isolated figure-host projection of the documented640px scroll contract, not headed product acceptance or finalized lesson rendering.',
  independentApproval: false, semanticHold: 'Source circulation detail physical identity remains unresolved.',
});
console.log(JSON.stringify({status: 'pass', editions: results.length, viewports: 4,
  unusedNativeFilesExcluded: unused.length, minMeasuredTextPx: Math.min(
    ...results.flatMap(x => x.captures.flatMap(y => y.geometry.labels.map(z => z.px))))}));

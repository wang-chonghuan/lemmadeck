import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), root);
const own = path.dirname(fileURLToPath(import.meta.url));
const [figure, stage = 'first'] = process.argv.slice(2);
assert(['fig-28', 'fig-29'].includes(figure));
assert(['first', 'repair'].includes(stage));
const folder = path.join(own, stage, figure);
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: path.resolve(file), sha256: hash(file), bytes: fs.statSync(file).size });
const write = (file, payload) => fs.writeFileSync(file, `${JSON.stringify(payload, null, 2)}\n`, { flag: 'wx' });
const inventoryFile = path.join(own, `${figure}.inventory.json`);
const inventory = read(inventoryFile);
const specFile = path.join(folder, 'spec.json');
const renderFile = path.join(folder, `${figure}.render.json`);
const svgFile = path.join(folder, `${figure}.svg`);
const spec = read(specFile);
const render = read(renderFile);
const byId = new Map(spec.objects.map(object => [object.id, object]));
const tests = [];
const test = (id, run, detail) => {
  try { run(); tests.push({ id, status: 'pass', detail }); }
  catch (error) { tests.push({ id, status: 'fail', detail, error: error.message }); }
};
const symbol = value => ({
  q_m: 'q\u2098', '-q_m': '\u2212q\u2098',
  q: 'q', '-q': '\u2212q', I_m: 'I\u2098', i: 'i',
}[value] || value);
const matching = pattern => spec.objects.filter(object => pattern.test(object.id));
const obj = id => { assert(byId.has(id), `Missing object ${id}`); return byId.get(id); };
const label = (id, text) => assert.equal(obj(id).text, text);
const coil = prefix => {
  const lobes = matching(new RegExp(`^${prefix}-coil-lobe-\\d+$`));
  assert.equal(lobes.length, 4);
  assert(lobes.every(lobe => lobe.type === 'arc'));
  for (let n = 0; n < 4; n++) {
    const lobe = obj(`${prefix}-coil-lobe-${n + 1}`);
    assert.equal(lobe.start[0], lobe.end[0]);
    assert.equal(lobe.center[0], lobe.end[0]);
    assert(lobe.start[1] < lobe.end[1], 'Arc must bulge right, not left');
    assert.equal(lobe.center[1], (lobe.start[1] + lobe.end[1]) / 2);
    if (n > 0) assert.deepEqual(lobe.end, obj(`${prefix}-coil-lobe-${n}`).start);
  }
};
const capSigns = (prefix, count, upper, lower) => {
  const upperObjects = matching(new RegExp(`^${prefix}-sign-upper-\\d+$`));
  const lowerObjects = matching(new RegExp(`^${prefix}-sign-lower-\\d+$`));
  assert.equal(upperObjects.length, count);
  assert.equal(lowerObjects.length, count);
  const convert = value => value === '-' ? '\u2212' : value;
  assert(upperObjects.every(object => object.text === convert(upper)));
  assert(lowerObjects.every(object => object.text === convert(lower)));
  assert(upperObjects.every(object => object.at[1] > lowerObjects[0].at[1]));
};
test('source-current-and-native-bindings', () => {
  assert.equal(hash(inventory.source.path), inventory.source.sha256);
  assert.equal(spec.source.image.sha256, inventory.source.sha256);
  assert.equal(render.spec.sha256, hash(specFile));
  assert.equal(render.output.svg.sha256, hash(svgFile));
  assert.equal(render.status, 'pass');
}, 'Source PNG, spec and unchanged SVG match native render hashes; native status must pass.');
test('complete-nonfig-bilingual-and-retained-n19-text', () => {
  const freeze = read(path.join(own, 'text-freeze.json'));
  assert.deepEqual(spec.source.authoritativeText, freeze.authoritativeText);
  for (const lang of ['zh', 'en']) {
    const source = read(freeze.n18[lang].path);
    assert.deepEqual(freeze.n18[lang].nonfig, source.prose.filter(block => block.kind !== 'fig'));
    for (const block of freeze.n18[lang].nonfig) {
      if (block.text) assert(spec.source.authoritativeText[lang === 'zh' ? 0 : 1].text.includes(block.text));
    }
  }
  const paragraphs = read(freeze.n19.retainedZh.path).proseFlow.paragraphs;
  assert.equal(paragraphs.length, 10);
  for (const paragraph of paragraphs) assert(spec.source.authoritativeText[2].text.includes(paragraph.text));
  assert.equal(freeze.n19.english.status, 'not-yet-bound');
}, 'All N18 nonfigure prose/captions in ZH and EN plus all ten actual retained ZH N19 paragraphs; English N19 remains unbound.');

if (figure === 'fig-28') {
  test('f28-one-a-two-circuits-one-b', () => {
    label('f28-a-label', 'a');
    label('f28-b-label', 'b');
    assert.equal(spec.source.inventory.filter(group => group.id === 'f28-a').length, 1);
    for (const prefix of ['f28-a-contact1', 'f28-a-contact2']) {
      assert(spec.source.inventory.find(group => group.id === 'f28-a').objects.includes(`${prefix}-switch-blade`));
    }
  }, 'Both circuits remain in one a group; mechanical apparatus remains b.');
  for (const active of [1, 2]) {
    const prefix = `f28-a-contact${active}`;
    test(`${prefix}-topology-polarity-coil-cells`, () => {
      coil(prefix);
      capSigns(prefix, 4, '+', '-');
      label(`${prefix}-charge-upper`, symbol('q_m'));
      label(`${prefix}-charge-lower`, symbol('-q_m'));
      assert.deepEqual(obj(`${prefix}-switch-blade`).from, obj(`${prefix}-pivot`).center);
      assert.deepEqual(obj(`${prefix}-switch-blade`).to, obj(`${prefix}-contact${active}`).center);
      assert.notDeepEqual(obj(`${prefix}-switch-blade`).to, obj(`${prefix}-contact${3 - active}`).center);
      assert.deepEqual(obj(`${prefix}-battery-top-wire`).to, obj(`${prefix}-contact1`).center);
      assert.deepEqual(obj(`${prefix}-coil-top-wire`).from, obj(`${prefix}-contact2`).center);
      assert.equal(matching(new RegExp(`^${prefix}-cell-\\d+-positive-plate$`)).length, 2);
      assert.equal(matching(new RegExp(`^${prefix}-cell-\\d+-negative-plate$`)).length, 2);
      for (const cell of [1, 2]) {
        const positive = obj(`${prefix}-cell-${cell}-positive-plate`);
        const negative = obj(`${prefix}-cell-${cell}-negative-plate`);
        assert(positive.from[1] > negative.from[1]);
        assert(positive.to[0] - positive.from[0] > negative.to[0] - negative.from[0]);
        label(`${prefix}-cell-${cell}-positive-sign`, '+');
        label(`${prefix}-cell-${cell}-negative-sign`, '\u2212');
      }
      assert.equal(obj(`${prefix}-cap-bottom-link`).to[1], obj(`${prefix}-bottom-wire`).from[1]);
      assert.equal(obj(`${prefix}-cap-bottom-link`).to[1], obj(`${prefix}-coil-bottom-link`).to[1]);
      assert.equal(matching(new RegExp(`^${prefix}-.*current.*$`)).length, 0);
    }, `Contact ${active} closed, contact ${3 - active} open; battery on contact 1 / LC on contact 2; upper positive and lower negative maximum charges, two correctly oriented series cells and four coil lobes.`);
  }
  test('f28-b-initial-mass-below-reference', () => {
    const mass = obj('f28-b-mass').center;
    const reference = obj('f28-b-equilibrium-reference').from;
    assert(mass[1] < reference[1]);
    label('f28-b-maximum-displacement', 'x\u20d7\u2098');
    assert.equal(matching(/^f28-b-.*$/).filter(object => object.type === 'arrow').length, 0);
    assert.equal(obj('f28-b-mass-position-extension').from[1], mass[1]);
    assert.equal(obj('f28-b-displacement-marker').from[0], obj('f28-b-displacement-marker').to[0]);
  }, 'Spring, round mass below broken equilibrium reference, initial x_m and vertical marker retained without invented velocity/force arrows.');
} else {
  test('f29-six-source-states-and-two-quarter-rows', () => {
    assert.equal(inventory.states.length, 6);
    assert.equal(matching(/^f29-a-.*-cap-upper$/).length, 6);
    assert.equal(matching(/^f29-a-.*-cap-lower$/).length, 6);
    label('f29-a-first-heading', 'First quarter-period');
    label('f29-a-second-heading', 'Second quarter-period');
    label('f29-a-label', 'a');
    label('f29-b-label', 'b');
    assert.equal(matching(/^f29-b-(first|second)-mass$/).length, 2);
  }, 'Exactly six separate LC drawings in two rows of three, including repeated zero-charge state, and exactly two spring masses.');
  for (const state of inventory.states) {
    test(`${state.id}-source-charge-and-current`, () => {
      coil(state.id);
      if (state.signsPerPlate) {
        capSigns(state.id, state.signsPerPlate, state.upperSigns, state.lowerSigns);
        label(`${state.id}-charge-upper`, symbol(state.upperLabel));
        label(`${state.id}-charge-lower`, symbol(state.lowerLabel));
      } else {
        assert.equal(matching(new RegExp(`^${state.id}-(sign|charge)-.*$`)).length, 0);
      }
      if (state.currentArrow) {
        const arrow = obj(`${state.id}-current-arrow`);
        assert.equal(arrow.type, 'arrow');
        assert.equal(arrow.from[0], arrow.to[0]);
        assert(arrow.from[1] > arrow.to[1], 'Source current arrow points downward');
        label(`${state.id}-current-label`, symbol(state.currentLabel));
      } else {
        assert(!byId.has(`${state.id}-current-arrow`));
        assert(!byId.has(`${state.id}-current-label`));
      }
    }, `${state.row}, column ${state.column}: ${state.chargeState}; ${state.currentState}; ${state.currentArrow ? state.currentLabel + ' arrow downward' : 'no arrow/current label'}.`);
  }
  test('f29-four-downward-arrows-only', () => {
    assert.equal(spec.objects.filter(object => object.type === 'arrow').length, 4);
    const firstEnd = obj('f29-a-first-end-current-arrow');
    const secondStart = obj('f29-a-second-start-current-arrow');
    assert(firstEnd.from[1] > firstEnd.to[1]);
    assert(secondStart.from[1] > secondStart.to[1]);
  }, 'All four arrows represent the source downward current, including both zero-charge pictures; no invented spring velocity arrow.');
  test('f29-b-first-velocity-at-equilibrium', () => {
    const mass = obj('f29-b-first-mass').center;
    assert.equal(mass[1], obj('f29-b-first-equilibrium-reference').from[1]);
    label('f29-b-first-maximum-velocity', 'v\u20d7\u2098');
    assert.equal(obj('f29-b-first-mass-position-extension').type, 'segment');
  }, 'Top spring is at equilibrium with source maximum velocity v_m; solid horizontal extension is not an arrow.');
  test('f29-b-second-mass-above-equilibrium', () => {
    const mass = obj('f29-b-second-mass').center;
    assert(mass[1] > obj('f29-b-second-equilibrium-reference').from[1]);
    label('f29-b-second-maximum-displacement', 'x\u20d7\u2098');
    assert.equal(obj('f29-b-second-mass-position-extension').from[1], mass[1]);
    assert.equal(obj('f29-b-second-displacement-marker').type, 'segment');
  }, 'Lower source picture is above the equilibrium reference, with x_m, solid position extension and vertical displacement marker.');
}
test('every-semantic-segment-and-arrow-covered', () => {
  for (const object of spec.objects.filter(object => ['segment', 'arrow'].includes(object.type))) {
    assert(spec.assertions.some(check => check.type === 'connects' && check.arrow === object.id),
      `Missing connects assertion for ${object.id}`);
  }
}, 'Every wire, marker, support/spring segment and current arrow has an executable connects assertion.');
const semantic = {
  schema: 'd281/source-semantic-assertions@1', figure, stage,
  independentInventory: bind(inventoryFile), spec: bind(specFile),
  status: tests.some(test => test.status === 'fail') ? 'fail' : 'pass',
  tests, independentReview: 'not-performed',
};
write(path.join(folder, 'semantic-assertions.json'), semantic);
if (semantic.status !== 'pass') {
  console.log(JSON.stringify(semantic));
  process.exitCode = 2;
} else {
  const original = [specFile, renderFile, svgFile].map(bind);
  const require = createRequire(`${root}/app/package.json`);
  const { chromium } = require('playwright');
  const requests = [];
  const previews = [];
  const svg = fs.readFileSync(svgFile, 'utf8');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    for (const width of [640, 331]) {
      const context = await browser.newContext({
        viewport: { width, height: spec.canvas.height }, deviceScaleFactor: 1,
      });
      try {
        await context.route('**/*', route => {
          requests.push(route.request().url());
          return route.abort();
        });
        const page = await context.newPage();
        await page.setContent(`<!doctype html><html><head><style>
          :root {
            --ld-figure-ink:#15201f;--ld-figure-muted:#4c5a58;
            --ld-figure-accent:#15201f;--ld-figure-accent-soft:#8a9795;
            --ld-figure-grid:#e3eae9;--ld-figure-paper:#ffffff;
          }
          html,body{margin:0;padding:0;background:#ffffff}
          #media{width:100%;overflow-x:auto;overflow-y:hidden}
          svg{width:640px;height:auto;display:block;max-width:none}
        </style></head><body><div id="media">${svg}</div></body></html>`);
        await page.evaluate(() => document.fonts.ready);
        const geometry = await page.locator('svg').evaluate(node => {
          const media = node.parentElement;
          const sizes = [...node.querySelectorAll('text')].map(text => {
            const matrix = text.getScreenCTM();
            return parseFloat(getComputedStyle(text).fontSize) * Math.hypot(matrix.a, matrix.b);
          });
          const primitives = [...node.querySelectorAll('path,line,ellipse,polygon')]
            .filter(item => getComputedStyle(item).display !== 'none' &&
              ['stroke', 'fill'].some(property => !['none', 'rgba(0, 0, 0, 0)'].includes(getComputedStyle(item)[property])));
          return {
            mediaWidth: node.getBoundingClientRect().width,
            background: getComputedStyle(node).backgroundColor,
            minTextPx: Math.min(...sizes),
            visiblePrimitives: primitives.length,
            clientWidth: media.clientWidth, scrollWidth: media.scrollWidth,
          };
        });
        assert.equal(geometry.mediaWidth, 640);
        assert.equal(geometry.background, 'rgb(255, 255, 255)');
        assert(geometry.minTextPx >= 16);
        assert(geometry.visiblePrimitives > 10);
        const file = path.join(folder, `${figure}.w${width}.png`);
        assert(!fs.existsSync(file));
        if (width === 331) {
          await page.locator('#media').evaluate(node => { node.scrollLeft = node.scrollWidth; });
          const end = await page.locator('#media').evaluate(node => ({
            scrollLeft: node.scrollLeft, maxScroll: node.scrollWidth - node.clientWidth,
          }));
          assert.equal(end.scrollLeft, end.maxScroll);
          assert(end.maxScroll > 0);
          geometry.scrollEnd = end;
        }
        await page.screenshot({ path: file, type: 'png', animations: 'disabled' });
        previews.push({ ...bind(file), viewportWidth: width, geometry,
          capture: width === 331 ? 'mobile-scroll-end' : 'full-fixed-media' });
      } finally { await context.close(); }
    }
  } finally { await browser.close(); }
  assert.deepEqual(requests, []);
  for (const row of original) assert.equal(hash(row.path), row.sha256);
  const receipt = {
    schema: 'd281/unchanged-svg-playwright-preview@1', figure, stage,
    status: 'pass', previews, originals: original, networkRequests: requests,
    semanticAssertions: bind(path.join(folder, 'semantic-assertions.json')),
    renderer: 'existing app Playwright Chromium; native CSS semantic variables, opaque white background',
    geometryRerenders: 0, svgEdits: 0, resvgCalls: 0, paidCalls: 0,
    headless: true, imageLoadsIntoAgentContext: 0,
    limitation: 'Isolated 640px scroll-media preview, not headed final lesson/product acceptance or independent review.',
  };
  write(path.join(folder, 'preview-receipt.json'), receipt);
  console.log(JSON.stringify({
    figure, stage, semanticAssertions: semantic.status, assertionGroups: tests.length,
    preview: bind(path.join(folder, 'preview-receipt.json')), previews,
  }));
}

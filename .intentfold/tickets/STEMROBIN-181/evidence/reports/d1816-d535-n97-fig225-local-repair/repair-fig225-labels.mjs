import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const H = `${T}/evidence/reports/d1238-current-progress`;
const oldRoot = `${H}/d1214-n97-fig223225-first-author/figures/fig-225`;
const O = `${T}/evidence/reports/d1816-d535-n97-fig225-local-repair`;
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => ({ path: file, bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const write = (file, data) => fs.writeFileSync(`${O}/${file}`, JSON.stringify(data, null, 2) + '\n', { flag: 'wx' });
assert(!fs.existsSync(O));
const spec = read(`${oldRoot}/fig-225.repair1.spec.json`);
const before = structuredClone(spec);
assert.equal(bind(`${oldRoot}/fig-225.repair1.spec.json`).sha256,
  '9b49d056a610b9a6ea81a25b3da894e739b7a69e1a25c3f1581db4dedb360c48');
const oldRender = read(`${oldRoot}/fig-225.repair1.render.json`);
assert.equal(oldRender.status, 'fail');
const priorReview = `${H}/d1226-n97-fig223225-first-independent-review/report.json`;
const review = read(priorReview).figures.find(figure => figure.id === spec.id);
assert.equal(review.gates.independentSourceFidelity, 'PASS');
assert.equal(review.gates.mathematicalOpticalTiming, 'PASS-SEMANTICS-ONLY');
const source = 'ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-225.png';
assert.equal(bind(source).sha256, spec.source.image.sha256);
spec.source.image.path = source;
const approved = ['zh', 'en'].map(locale => {
  const file = `${H}/d1218-n97-rigid-rod-affected-repair/${locale}/lesson.template.json`;
  const expected = locale === 'zh'
    ? '15004a3cd21dcb279a7d0ccf3ff4b0bc9a7616f300b05a51e3d1ff475c774364'
    : '4033bc45572426d1c21925779c768811d1239dac7e3948a11efeca9ce961eb09';
  assert.equal(bind(file).sha256, expected);
  return { ...bind(file), opening: read(file).prose[0].text };
});
spec.source.authoritativeText[0].text = approved[0].opening;
spec.source.authoritativeText[16].text = approved[1].opening;
const changes = [];
for (const id of ['k-x-tip', 'k1-x-tip', 'rod-a', 'rod-b']) {
  const object = spec.objects.find(item => item.id === id);
  const old = structuredClone(object.labelPlacement);
  if (id.includes('x-tip')) object.labelPlacement.gap = 24;
  else object.labelPlacement.offset = [0, -24];
  changes.push({ id, before: old, after: structuredClone(object.labelPlacement) });
}
const guard = structuredClone(spec);
guard.source = before.source;
for (const change of changes)
  guard.objects.find(object => object.id === change.id).labelPlacement = change.before;
assert.deepEqual(guard, before);
fs.mkdirSync(`${O}/candidate`, { recursive: true });
write('candidate/spec.json', spec);
write('repair.json', {
  stage: 'D535', figure: '10p fig-225', status: 'LOCAL_LABEL_REPAIR_NOT_APPROVAL',
  previousSpec: bind(`${oldRoot}/fig-225.repair1.spec.json`),
  previousSvg: bind(`${oldRoot}/fig-225.repair1.svg`),
  previousRender: bind(`${oldRoot}/fig-225.repair1.render.json`),
  previousReview: bind(priorReview), source: bind(source),
  approvedText: approved.map(({ opening, ...binding }) => binding),
  approvedDescriptorReview: bind(`${H}/d1219-n97-rigid-rod-affected-review/report.json`),
  labelChanges: changes, textSnapshotChanges: [0, 16], sourcePathOnlyAtSameSha: true,
  allGeometryAssertionsInventoryDisplayAndOtherFieldsUnchanged: true,
  freshSourcePixelInventory: {
    actualImageOpens: 1,
    facts: [
      'Two perspective frames K and K1 share one horizontal baseline; O1 is right of O and left of A.',
      'Y/Y1 point upward and Z/Z1 point down-left; the velocity arrow points right from the K1 vertical axis.',
      'Three equal horizontal rod states AB, A1B1 and A2B2 move right down the illustration.',
      'The first rod is hatched; the two later rods are outlines. A/B label the first rod endpoints, above its baseline.',
      'The upper double-ended dimension is l + v tau1; shifts are v tau1 and v tau2; the lower dimension is l - v tau2.',
      'A, A1 and A2 have vertical dimension guides; one shared vertical B1 guide reaches both long dimensions.',
      'No numeric lengths, times or clock dials occur in the original.'
    ],
    mappedInventoryGroup: 'moving-clock-successive-positions-panel',
    sourceInventoryReusedAfterPixelComparison: true,
    modernAdditionsNotSourceFacts: ['Coordinate event-time labels', 'Separate one-way c cues', 'Regularized neutral vector geometry']
  },
  inheritedSourceRelationshipAndOpticalPassOnly: true,
  historicalFailAndRepair1Preserved: true, previousRepairCount: 1,
  additionalLocalRepairCount: 1, manualSvgEdits: 0,
  independentReview: 'PENDING', promoted: false, coursesAdded: 0, pagesAdded: 0, paidCalls: 0
});
const args = ['.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '--spec', `${O}/candidate/spec.json`, '--svg', `${O}/candidate/figure.svg`,
  '--report', `${O}/candidate/render.json`];
const startedAt = new Date().toISOString();
const renderCall = spawnSync('node', args, { cwd: repo, encoding: 'utf8',
  timeout: 120000, maxBuffer: 12 * 1024 * 1024 });
write('render-receipt.json', { command: ['node', ...args], startedAt,
  finishedAt: new Date().toISOString(), exitCode: renderCall.status,
  error: renderCall.error?.message || null, stdout: renderCall.stdout, stderr: renderCall.stderr });
assert.equal(renderCall.status, 0, renderCall.stderr || renderCall.stdout);
const native = read(`${O}/candidate/render.json`);
assert.equal(native.status, 'pass');
assert.deepEqual(native.collisions, []);
assert.equal(native.objects, oldRender.objects);
assert.equal(native.labels, oldRender.labels);
assert.deepEqual(native.displayChecks, oldRender.displayChecks);
const require = createRequire(path.join(repo, 'app/package.json'));
const { chromium } = require('playwright');
const executablePath = [chromium.executablePath(),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(fs.existsSync);
assert(executablePath);
const browser = await chromium.launch({ executablePath, headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 });
  await page.route('**/*', route => route.abort());
  const svg = fs.readFileSync(`${O}/candidate/figure.svg`, 'utf8');
  const oldSvg = fs.readFileSync(`${oldRoot}/fig-225.repair1.svg`, 'utf8');
  const svgChanges = await page.evaluate(({ svg, oldSvg }) => {
    const parse = text => new DOMParser().parseFromString(text, 'image/svg+xml').documentElement;
    const changes = [];
    const walk = (a, b) => {
      if (a.tagName !== b.tagName || a.children.length !== b.children.length) throw Error('SVG structure changed');
      for (const key of new Set([...a.getAttributeNames(), ...b.getAttributeNames()]))
        if (a.getAttribute(key) !== b.getAttribute(key))
          changes.push({ id: b.getAttribute('data-label-id'), attribute: key,
            before: a.getAttribute(key), after: b.getAttribute(key) });
      if (!a.children.length && a.textContent !== b.textContent) throw Error('SVG text changed');
      for (let i = 0; i < a.children.length; i++) walk(a.children[i], b.children[i]);
    };
    walk(parse(oldSvg), parse(svg));
    return changes;
  }, { svg, oldSvg });
  assert.equal(svgChanges.length, 4);
  assert(svgChanges.every(change => changes.some(item => `${item.id}-label` === change.id)
    && change.attribute === 'y'));
  const style = ':root{--ld-figure-ink:#15201f;--ld-figure-muted:#4c5a58;--ld-figure-accent:#15201f;--ld-figure-accent-soft:#8a9795;--ld-figure-grid:#e3eae9;--ld-figure-paper:#fff}html,body{margin:0;background:#fff}.scroll{width:min(640px,100%);overflow:auto}.media{width:640px}.media svg{display:block;width:640px;height:auto}';
  await page.setContent(`<!doctype html><style>${style}</style><div class="scroll"><div class="media">${svg}</div></div>`);
  const dom = await page.evaluate(() => {
    const svg = document.querySelector('svg'), media = svg.getBoundingClientRect();
    const labels = [...svg.querySelectorAll('text')].map(node => {
      const r = node.getBoundingClientRect(), ctm = node.getScreenCTM();
      return { id: node.getAttribute('data-label-id'), text: node.textContent,
        px: Number(node.getAttribute('font-size')) * Math.hypot(ctm.a, ctm.b),
        x: r.x, y: r.y, right: r.right, bottom: r.bottom,
        inMedia: r.x >= media.x && r.y >= media.y && r.right <= media.right && r.bottom <= media.bottom };
    });
    const affected = labels.filter(row => ['k-x-tip-label', 'k1-x-tip-label', 'rod-a-label', 'rod-b-label'].includes(row.id));
    const overlaps = affected.flatMap(a => labels.filter(b => a !== b
      && Math.min(a.right, b.right) > Math.max(a.x, b.x)
      && Math.min(a.bottom, b.bottom) > Math.max(a.y, b.y)).map(b => [a.id, b.id]));
    return { mediaWidth: media.width, labels, affected, overlaps };
  });
  assert.equal(dom.mediaWidth, 640);
  assert.equal(dom.labels.length, native.labels);
  assert(dom.labels.every(label => label.px >= 16 && label.inMedia));
  assert.deepEqual(dom.overlaps, []);
  const endpoints = dom.affected.filter(label => label.id.startsWith('rod-'));
  assert(endpoints.every(label => label.bottom < 219), 'A/B still cross the horizontal axis');
  const screenshot = `${O}/candidate/display-640.png`;
  const png = await page.locator('.media').screenshot({ path: screenshot });
  const pixels = await page.evaluate(async base64 => {
    const image = new Image(); image.src = `data:image/png;base64,${base64}`; await image.decode();
    const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
    const ctx = canvas.getContext('2d'); ctx.drawImage(image, 0, 0);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let nonwhite = 0, dark = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (Math.min(data[i], data[i + 1], data[i + 2]) < 245) nonwhite++;
      if (Math.max(data[i], data[i + 1], data[i + 2]) < 100) dark++;
    }
    return { width: canvas.width, height: canvas.height, dark, nonwhite,
      nonwhiteFraction: nonwhite / (canvas.width * canvas.height) };
  }, png.toString('base64'));
  assert(pixels.dark > 100 && pixels.nonwhiteFraction < 0.45);
  await page.setViewportSize({ width: 390, height: 844 });
  const mobile = await page.evaluate(() => {
    const scroll = document.querySelector('.scroll'); scroll.scrollLeft = scroll.scrollWidth;
    return { mediaWidth: document.querySelector('svg').getBoundingClientRect().width,
      clientWidth: scroll.clientWidth, scrollWidth: scroll.scrollWidth,
      reachedEnd: scroll.scrollLeft, expectedEnd: scroll.scrollWidth - scroll.clientWidth };
  });
  assert.equal(mobile.mediaWidth, 640);
  assert.equal(mobile.reachedEnd, mobile.expectedEnd);
  write('width-check.json', { status: 'AFFECTED_LABEL_DOM_AND_PIXEL_PASS', headless: true,
    fixedMediaWidth: 640, svgChanges, dom, pixels, mobile, screenshot: bind(screenshot),
    spec: bind(`${O}/candidate/spec.json`), svg: bind(`${O}/candidate/figure.svg`),
    render: bind(`${O}/candidate/render.json`), independentReview: 'PENDING',
    fullCourseDisplayApproval: false, historicalFailurePreserved: true });
  fs.copyFileSync(import.meta.filename, `${O}/repair-fig225-labels.mjs`, fs.constants.COPYFILE_EXCL);
  console.log(JSON.stringify({ stage: 'D535', native: native.status, collisions: 0,
    objects: native.objects, labels: native.labels, changedSvgLabels: 4,
    width: 640, mobileScrollReached: true, independentReview: 'PENDING' }));
} finally {
  await browser.close();
}

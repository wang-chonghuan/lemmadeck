import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { repo, ticket, bind, read, save } from './n42-native.mjs';

const require = createRequire(`${repo}/app/package.json`);
const { chromium } = require('playwright');
const { proseFlow } = require(`${repo}/.claude/skills/ld-s10y-lesson/tools/htmlfrag.js`);
const card = process.argv[2] || 'phy9-c2-s2-n72';
const unlabeledRecovery = process.argv[3] === '--unlabeled-figure-recovery';
const sectionlessRecovery = process.argv[3] === '--sectionless-crumb-recovery';
const sourceAriaRecovery = process.argv[3] === '--source-aria-recovery';
const sharedAriaRecovery = process.argv[3] === '--shared-aria-recovery';
assert(process.argv[3] === undefined || unlabeledRecovery || sectionlessRecovery || sourceAriaRecovery || sharedAriaRecovery);
const configurations = {
  'phy9-c1-s2-n10': { task: 'D1312', native: 'd1816-d1311-n10-first-en-native',
    directory: 'd1816-d1312-n10-first-en-full-course-display', objects: 9, figures: 2,
    nextFourAdapter: true, headless: true, chapterCrumb: 'Chapter 2. Fundamentals of thermodynamics',
    sourceProseAria: true, screenshots: 8, paragraphs: 17, sectionBreaks: 0 },
  'phy9-c1-s2-n15': { task: 'D1319', native: 'd1816-d1318-n15-first-en-native',
    directory: 'd1816-d1319-n15-first-en-full-course-display', objects: 14, figures: 1,
    nextFourAdapter: true, headless: true, chapterCrumb: 'Chapter 2. Fundamentals of thermodynamics',
    sourceProseAria: true, screenshots: 6, paragraphs: 29, sectionBreaks: 0 },
  'phy9-c1-s2-n18': { task: 'D1350', native: 'd1816-d1325-n18-first-en-native',
    directory: 'd1816-d1350-n18-platform-font-display-recovery', objects: 14, figures: 1,
    originalFontFailure: 'd1816-d1326-n18-first-en-full-course-display',
    nextFourAdapter: true, headless: true, chapterCrumb: 'Chapter 2. Fundamentals of thermodynamics',
    sourceProseAria: true, screenshots: 6, paragraphs: 17, sectionBreaks: 2 },
  'phy9-c1-s2-n20': { task: 'D1333', native: 'd1816-d1332-n20-first-en-native',
    directory: 'd1816-d1333-n20-first-en-full-course-display', objects: 35, figures: 2,
    nextFourAdapter: true, headless: true, chapterCrumb: 'Chapter 2. Fundamentals of thermodynamics',
    sourceProseAria: true, screenshots: 8, paragraphs: 42, sectionBreaks: 5 },
  'phy9-c1-s1-n1': { task: 'D1278', native: 'd1816-d1306-n1-source-label-native-recovery',
    directory: 'd1816-d1278-n1-first-en-full-course-display', objects: 10, figures: 2,
    focus: 'Thermal phenomena', headless: true, chapterCrumb: 'Chapter 1.',
    generatedPng: true, sourceProseAria: true, screenshots: 8 },
  'phy9-c1-s1-n2': { task: 'D1285', native: 'd1816-d1284-n2-first-en-native',
    directory: 'd1816-d1285-n2-first-en-full-course-display', objects: 13, figures: 1,
    focus: 'A competing view', headless: true, chapterCrumb: 'Chapter 1.',
    generatedPng: true, sourceProseAria: true, screenshots: 6 },
  'phy9-c1-s1-n3': { task: 'D1292', native: 'd1816-d1303-n3-caption-label-native-recovery',
    directory: 'd1816-d1292-n3-first-en-full-course-display', objects: 13, figures: 1,
    focus: 'Thermodynamics describes', headless: true, chapterCrumb: 'Chapter 1.',
    generatedPng: true, sourceProseAria: true, screenshots: 6 },
  'phy9-c2-s4-n97': { task: 'D1268', native: 'd1816-d1267-n97-first-en-native',
    directory: 'd1816-d1268-n97-first-en-full-course-display', objects: 7, figures: 0,
    focus: 'Another important class', headless: true, chapterCrumb: 'Chapter 10.',
    sourceSectionNull: true },
  'phy9-c1-s1-n4': { task: 'D1241', native: 'd1816-d1239-n4-first-en-native',
    directory: 'd1816-d1241-n4-first-en-full-course-display', objects: 4, figures: 0,
    focus: 'Thermal processes', headless: true, chapterCrumb: 'Chapter 1.' },
  'phy9-c1-s2-n16': { task: 'D1242', native: 'd1816-d1240-n16-first-en-native',
    directory: 'd1816-d1242-n16-first-en-full-course-display', objects: 4, figures: 0,
    focus: "According to Avogadro's law", headless: true, chapterCrumb: 'Chapter 2.' },
  'phy9-c1-s1-n7': { task: 'D1253', native: 'd1816-d1251-n7-first-en-native',
    directory: 'd1816-d1253-n7-first-en-full-course-display', objects: 6, figures: 1,
    focus: 'Kinetic theory explains', headless: true, chapterCrumb: 'Chapter 1.',
    sourceProseAria: true },
  'phy9-c1-s6-n49': { task: 'D1254', native: 'd1816-d1252-n49-first-en-native',
    directory: 'd1816-d1254-n49-first-en-full-course-display', objects: 7, figures: 1,
    focus: 'Under an external force', headless: true,
    chapterCrumb: 'Chapter 6.', sourceSectionNull: true, sourceProseAria: true },
  'phy10-c1-s2-n2': { task: 'D1221', native: 'd1816-d1220-n2-first-en-native',
    directory: 'd1816-d1221-n2-first-en-full-course-display', objects: 15, figures: 3,
    focus: 'For the mechanical systems', headless: true, chapterCrumb: 'Oscillations and Waves',
    sourceProseAria: true },
  'phy10-c1-s2-n4': { task: 'D1205', native: 'd1816-d1204-n4-first-en-native',
    directory: 'd1816-d1205-n4-first-en-full-course-display', objects: 6, figures: 1,
    focus: 'For the ball moving', headless: true, chapterCrumb: 'Oscillations and Waves',
    sourceManifestAria: true },
  'phy10-c1-s2-n1': { task: 'D1210', native: 'd1816-d1209-n1-first-en-native',
    directory: 'd1816-d1210-n1-first-en-full-course-display', objects: 16, figures: 2,
    focus: '**Free oscillations**', headless: true, chapterCrumb: 'Oscillations and Waves',
    sourceManifestAria: true },
  'phy9-c2-s2-n72': { task: 'D998', native: 'd1816-d997-n72-first-en-native',
    directory: 'd1816-d998-n72-first-en-full-course-display', objects: 13, figures: 4,
    focus: '**Electric polarization and the internal field**' },
  'phy9-c2-s2-n73': { task: 'D1008', native: 'd1816-d1007-n73-first-en-native',
    directory: 'd1816-d1008-n73-first-en-full-course-display', objects: 22, figures: 2,
    focus: '**Work and the change in potential energy**', headless: true },
  'phy9-c2-s2-n64': { task: 'D1018', native: 'd1816-d1017-n64-first-en-native',
    directory: 'd1816-d1018-n64-first-en-full-course-display', objects: 42, figures: 2,
    focus: '**Worked examples**', headless: true, englishFigureAliases: true },
  'phy9-c2-s2-n81': { task: 'D1030', native: 'd1816-d1029-n81-first-en-native',
    directory: 'd1816-d1030-n81-first-en-full-course-display', objects: 17, figures: 1,
    focus: '**Experimental check**', headless: true },
  'phy9-c2-s3-n89': { task: 'D1038', native: 'd1816-d1037-n89-first-en-native',
    directory: 'd1816-d1038-n89-first-en-full-course-display', objects: 4, figures: 0,
    focus: '**Use formula (9-2)', headless: true,
    chapterCrumb: 'Chapter 9. Steady electric current' },
  'phy9-c2-s4-n105': { task: 'D1044', native: 'd1816-d1043-n105-first-en-native',
    directory: 'd1816-d1044-n105-first-en-full-course-display', objects: 9, figures: 0,
    focus: '**Charged particles in metals**', headless: true,
    chapterCrumb: 'Chapter 10. Electric current in various media' },
  'phy9-c2-s6-n130': { task: 'D1052', native: 'd1816-d1064-n130-source-chapter-native-recovery',
    nativeStatus: 'APPROVED_EN_BODY_METADATA_RECONCILED_NATIVE_RENDER_PASS',
    directory: 'd1816-d1052-n130-current-en-metadata-full-course-display', objects: 7, figures: 0,
    focus: 'Equation (12-8)', headless: true,
    chapterCrumb: 'Printed page 309' },
  'phy9-c2-s2-n61': { task: 'D1057', native: 'd1816-d1056-n61-first-en-native',
    directory: 'd1816-d1057-n61-first-en-full-course-display', objects: 6, figures: 0,
    focus: 'Electrification obeys', headless: true },
  'phy9-conclusion': { task: 'D1061', native: 'd1816-d1060-conclusion-approved-en-metadata-native',
    nativeStatus: 'APPROVED_EN_BODY_METADATA_RECONCILED_NATIVE_RENDER_PASS',
    directory: 'd1816-d1061-conclusion-current-en-metadata-full-course-display', objects: 2, figures: 0,
    focus: 'We will also explore', headless: true, chapterCrumb: 'Printed page 322' },
  'phy9-c1-s1-n6': { task: 'D1071', native: 'd1816-d1070-n6-first-en-native',
    directory: 'd1816-d1071-n6-first-en-full-course-display', objects: 19, figures: 0,
    focus: '**Amount of substance**', headless: true, chapterCrumb: 'Chapter 1.' },
  'phy9-c1-s2-n13': { task: 'D1075', native: 'd1816-d1074-n13-first-en-native',
    directory: 'd1816-d1075-n13-first-en-full-course-display', objects: 5, figures: 0,
    focus: 'When gas molecules', headless: true, chapterCrumb: 'Chapter 2.' },
  'phy9-c1-s2-n27': { task: 'D1091', native: 'd1816-d1090-n27-first-en-native',
    directory: 'd1816-d1091-n27-first-en-full-course-display', objects: 9, figures: 0,
    focus: 'Over one complete cycle', headless: true, chapterCrumb: 'Chapter 2.' },
  'phy9-c1-s2-n28': { task: 'D1093', native: 'd1816-d1092-n28-first-en-native',
    directory: 'd1816-d1093-n28-first-en-full-course-display', objects: 17, figures: 0,
    focus: '**Worked examples**', headless: true, chapterCrumb: 'Chapter 2.' },
  'phy9-c1-s3-n30': { task: 'D1095', native: 'd1816-d1094-n30-first-en-native',
    directory: 'd1816-d1095-n30-first-en-full-course-display', objects: 5, figures: 0,
    focus: 'When molecules approach', headless: true,
    chapterCrumb: 'Part One. Thermal Phenomena', sourceSectionNull: true },
  'phy9-c1-s3-n31': { task: 'D1097', native: 'd1816-d1096-n31-first-en-native',
    directory: 'd1816-d1097-n31-first-en-full-course-display', objects: 17, figures: 0,
    focus: 'To study average translational kinetic energy', headless: true,
    chapterCrumb: 'Part One. Thermal Phenomena', sourceSectionNull: true },
  'phy9-c1-s3-n33': { task: 'D1113', native: 'd1816-d1112-n33-first-en-native',
    directory: 'd1816-d1113-n33-first-en-full-course-display', objects: 12, figures: 0,
    focus: 'Equations $(3-13)$', headless: true,
    chapterCrumb: 'Part One. Thermal Phenomena', sourceSectionNull: true },
  'phy9-c1-s3-n36': { task: 'D1115', native: 'd1816-d1114-n36-first-en-native',
    directory: 'd1816-d1115-n36-first-en-full-course-display', objects: 18, figures: 0,
    focus: '**Worked examples**', headless: true,
    chapterCrumb: 'Part One. Thermal Phenomena', sourceSectionNull: true },
  'phy9-c1-s4-n37': { task: 'D1117', native: 'd1816-d1116-n37-first-en-native',
    directory: 'd1816-d1117-n37-first-en-full-course-display', objects: 15, figures: 0,
    focus: '**The heat required to turn', headless: true,
    chapterCrumb: 'Part One. Thermal Phenomena', sourceSectionNull: true },
  'phy9-c1-s5-n45': { task: 'D1127', native: 'd1816-d1126-n45-first-en-native',
    directory: 'd1816-d1127-n45-first-en-full-course-display', objects: 10, figures: 0,
    focus: 'Under fixed temperature', headless: true,
    chapterCrumb: 'Part One. Thermal Phenomena', sourceSectionNull: true },
  'phy9-c1-s6-n54': { task: 'D1133', native: 'd1816-d1132-n54-first-en-native',
    directory: 'd1816-d1133-n54-first-en-full-course-display', objects: 38, figures: 0,
    focus: '**Worked examples**', headless: true,
    chapterCrumb: 'Part One. Thermal Phenomena', sourceSectionNull: true },
  'phy9-c1-s7-n56': { task: 'D1141', native: 'd1816-d1140-n56-first-en-native',
    directory: 'd1816-d1141-n56-first-en-full-course-display', objects: 9, figures: 1,
    focus: 'The proportionality coefficient', headless: true,
    chapterCrumb: 'Part One. Thermal Phenomena', sourceSectionNull: true },
  'phy9-c1-s7-n57': { task: 'D1145', native: 'd1816-d1144-n57-first-en-native',
    directory: 'd1816-d1145-n57-first-en-full-course-display', objects: 27, figures: 1,
    focus: '**Worked examples**', headless: true,
    chapterCrumb: 'Part One. Thermal Phenomena', sourceSectionNull: true },
  'phy10-c1-s2-n5': { task: 'D1162', native: 'd1816-d1161-n5-first-en-native',
    directory: 'd1816-d1162-n5-first-en-full-course-display', objects: 10, figures: 0,
    focus: 'The preceding sine relation', headless: true, chapterCrumb: 'Oscillations and Waves' },
  'phy10-c1-s2-n10': { task: 'D1165', native: 'd1816-d1164-n10-first-en-native',
    directory: 'd1816-d1165-n10-first-en-full-course-display', objects: 10, figures: 0,
    focus: 'The small-angle motion', headless: true, chapterCrumb: 'Oscillations and Waves' },
  'phy10-c2-s4-n92': { task: 'D1171', native: 'd1816-d1170-n92-approved-en-metadata-native',
    nativeStatus: 'APPROVED_EN_BODY_METADATA_RECONCILED_NATIVE_RENDER_PASS',
    directory: 'd1816-d1171-n92-current-en-metadata-full-course-display', objects: 13, figures: 0,
    focus: '**The first historical approach**', headless: true, chapterCrumb: 'Optics', sourceSectionNull: true },
  'phy10-c1-s2-n9': { task: 'D1185', native: 'd1816-d1183-n9-first-en-native',
    directory: 'd1816-d1185-n9-first-en-full-course-display', objects: 8, figures: 1,
    focus: 'The acceleration component of simple harmonic oscillation', headless: true,
    chapterCrumb: 'Oscillations and Waves', sourceManifestAria: true },
  'phy10-c1-s2-n15': { task: 'D1186', native: 'd1816-d1184-n15-first-en-native',
    directory: 'd1816-d1186-n15-first-en-full-course-display', objects: 11, figures: 2,
    focus: 'The electromagnet converts', headless: true,
    chapterCrumb: 'Oscillations and Waves', sourceManifestAria: true },
};
assert(configurations[card]);
const config = { ...configurations[card] };
const originalFontFailure = config.originalFontFailure
  ? bind(`${ticket}/tmp/${config.originalFontFailure}/report.json`) : null;
if (originalFontFailure) {
  const first = read(originalFontFailure.path);
  assert.equal(first.status, 'FAIL');
  assert.equal(first.views.length, 0);
  assert.equal(first.savedImages, 0);
  assert(first.failure.message.includes('geometry.loadedFontFaces.some'));
}
if (unlabeledRecovery) {
  assert.equal(card, 'phy9-c2-s2-n81');
  const first = read(`${ticket}/tmp/${config.directory}/report.json`);
  assert.equal(first.status, 'FAIL');
  assert.equal(first.views.length, 0);
  assert(first.failure.message.includes('figure.labels.length > 0'));
  config.task = 'D1033';
  config.directory = 'd1816-d1033-n81-unlabeled-figure-display-recovery';
}
if (sectionlessRecovery) {
  assert.equal(card, 'phy9-c2-s4-n105');
  const first = read(`${ticket}/tmp/${config.directory}/report.json`);
  assert.equal(first.status, 'FAIL');
  assert.equal(first.views.length, 0);
  assert(first.failure.message.includes('crumb.includes'));
  config.task = 'D1049';
  config.directory = 'd1816-d1049-n105-sectionless-crumb-display-recovery';
  config.chapterCrumb = 'Part Two. Foundations of Electrodynamics';
}
let originalAriaFailure;
if (sourceAriaRecovery) {
  assert(['phy9-c1-s7-n56', 'phy9-c1-s7-n57', 'phy10-c1-s2-n2'].includes(card));
  originalAriaFailure = bind(`${ticket}/tmp/${config.directory}/report.json`);
  const first = read(originalAriaFailure.path);
  assert.equal(first.status, 'FAIL');
  assert.equal(first.views.length, 0);
  assert(first.failure.message.includes('!=='));
  assert.equal(first.browserClosed, true);
  config.task = card.endsWith('n2') ? 'D1226' : card.endsWith('n56') ? 'D1154' : 'D1155';
  config.directory = `d1816-${config.task.toLowerCase()}-${card.split('-').at(-1)}-source-aria-display-recovery`;
}
if (sharedAriaRecovery) {
  assert.equal(card, 'phy10-c1-s2-n4');
  originalAriaFailure = bind(`${ticket}/tmp/${config.directory}/report.json`);
  const first = read(originalAriaFailure.path);
  assert.equal(first.status, 'FAIL');
  assert.equal(first.views.length, 0);
  assert.equal(first.browserClosed, true);
  assert(first.failure.message.includes("'Figure 3' !=="));
  config.task = 'D1216';
  config.directory = 'd1816-d1216-n4-shared-aria-display-recovery';
}
const executedHelper = bind(import.meta.filename);
const executedHelperSnapshot = `${ticket}/tmp/${config.directory}/check.executed-original.mjs`;
fs.mkdirSync(`${ticket}/tmp/${config.directory}`, { recursive: true });
fs.copyFileSync(import.meta.filename, executedHelperSnapshot, fs.constants.COPYFILE_EXCL);
assert.equal(bind(executedHelperSnapshot).sha256, executedHelper.sha256);
const nativePath = `${ticket}/tmp/${config.native}/result.json`;
const native = read(nativePath);
assert.equal(native.status, config.nativeStatus || 'FIRST_MISSING_EN_NATIVE_FINALIZE_RENDER_PASS');
const row = native.rows[0], lesson = read(row.lesson.path);
const assetMode = asset => config.nextFourAdapter ? read(asset.spec.path).mode
  : config.generatedPng ? 'generated' : 'deterministic';
const generatedAssets = row.assets.filter(asset => assetMode(asset) === 'generated');
const deterministicAssets = row.assets.filter(asset => assetMode(asset) === 'deterministic');
const allowsImages = config.nextFourAdapter ? generatedAssets.length > 0 : !!config.generatedPng;
if (config.nextFourAdapter) {
  assert.equal(generatedAssets.length + deterministicAssets.length, config.figures);
  for (const asset of row.assets) {
    assert.equal(asset.mode, assetMode(asset));
    for (const key of asset.mode === 'generated' ? ['spec', 'png', 'generation', 'review'] : ['spec', 'svg', 'render', 'review'])
      assert.equal(bind(asset[key].path).sha256, asset[key].sha256);
  }
}
assert.equal(lesson.prose.length, config.objects);
if (config.sourceSectionNull) assert.equal(lesson.section, null);
if (sectionlessRecovery) {
  assert.equal(lesson.section, null);
  assert.equal(lesson.chapter, config.chapterCrumb);
}
const out = `${repo}/.tmp/STEMROBIN-181/d1816-${config.task.toLowerCase()}/full-course-display`;
assert(!fs.existsSync(out));
fs.mkdirSync(out, { recursive: true });
const comparable = text => text.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\s/g, '');
const views = [], requests = [];
let browser, activeView, failure = null;
try {
  browser = await chromium.launch({ channel: 'chrome', headless: config.headless ?? false });
  for (const viewport of [
    { name: 'desktop', width: 1440, height: 960 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    activeView = `en-${viewport.name}`;
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1, offline: true, serviceWorkers: 'block',
    });
    try {
      await context.route('**/*', route => {
        requests.push({ view: activeView, url: route.request().url() });
        return route.abort();
      });
      const page = await context.newPage(), errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      const html = fs.readFileSync(row.textHtml.path, 'utf8');
      assert(!(allowsImages ? /<(?:script|link|iframe|object|embed)\b/i
        : /<(?:script|link|iframe|object|embed|img)\b/i).test(html));
      assert(html.includes('data:font/woff2;base64,'));
      await page.setContent(html, { waitUntil: 'load' });
      await page.locator('a.jump').evaluateAll(nodes => nodes.forEach(node => node.remove()));
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator(allowsImages
        ? 'a,input,textarea,button,script,link,iframe,.err,.katex-error,.sr-tex-err'
        : 'a,input,textarea,button,script,link,iframe,img,.err,.katex-error,.sr-tex-err').count(), 0);
      const exactPngHashes = {};
      if (allowsImages) {
        assert.equal(await page.locator('img').count(), generatedAssets.length);
        assert.equal(await page.locator('figure .figure-media > img').count(), generatedAssets.length);
        assert.equal(await page.locator('figure .figure-media svg').count(), deterministicAssets.length);
        for (const asset of generatedAssets) {
          assert.equal(asset.mode, 'generated');
          assert.equal(assetMode(asset), 'generated');
          const src = await page.locator(`figure#${asset.id} .figure-media > img`).getAttribute('src');
          assert(src.startsWith('data:image/png;base64,'));
          const sha = createHash('sha256').update(Buffer.from(src.slice('data:image/png;base64,'.length), 'base64')).digest('hex');
          assert.equal(sha, asset.png.sha256);
          exactPngHashes[asset.id] = sha;
        }
        await page.locator('figure .figure-media > img').evaluateAll(nodes =>
          Promise.all(nodes.map(node => node.decode())));
      }
      const expected = proseFlow(lesson.prose, lesson.section_breaks).filter(block => block.kind === 'p');
      const paragraphs = await page.locator('p.para').evaluateAll(nodes => nodes.map(node => {
        const clone = node.cloneNode(true);
        for (const formula of clone.querySelectorAll('.katex')) {
          const annotation = formula.querySelector('annotation');
          if (!annotation) throw Error('Missing KaTeX annotation');
          formula.replaceWith(document.createTextNode(`$${annotation.textContent}$`));
        }
        return clone.textContent;
      }));
      assert(expected.length > 0);
      assert.equal(paragraphs.length, expected.length);
      if (config.nextFourAdapter) {
        assert.equal(paragraphs.length, config.paragraphs);
        assert.equal(lesson.section_breaks.length, config.sectionBreaks);
      }
      for (let index = 0; index < expected.length; index++)
        assert.equal(comparable(paragraphs[index]), comparable(expected[index].text));
      const heading = await page.locator('h1').innerText(), crumb = await page.locator('.crumb').innerText();
      assert(heading.includes(lesson.title));
      assert(crumb.includes(config.chapterCrumb || 'Chapter 8. Electrostatics'));
      const visibleText = await page.locator('.sheet').innerText();
      assert(!/[\u3400-\u9fff]/.test(visibleText));
      assert(!/correct_index|answerKey|answer-keys|displayAnswer|independent_solution|source_solution/.test(html));
      const captions = await page.locator('.figcap').allTextContents();
      assert.deepEqual(captions, proseFlow(lesson.prose, lesson.section_breaks)
        .filter(block => block.kind === 'cap').map(block => block.text));
      const figureIds = await page.locator('figure').evaluateAll(nodes => nodes.map(node => node.id));
      assert.deepEqual(figureIds, row.assets.map(asset => asset.id));
      assert.equal(await page.locator('figure .figure-media > svg').count(), deterministicAssets.length);
      const geometry = await page.evaluate(() => ({
        pageWidth: document.documentElement.scrollWidth,
        boxes: [...document.querySelector('.sheet').children].map(node => {
          const rect = node.getBoundingClientRect();
          return { tag: node.tagName, x: rect.x, y: rect.y, right: rect.right,
            bottom: rect.bottom, width: rect.width, height: rect.height };
        }),
        fontsLoaded: document.fonts.status === 'loaded',
        loadedFontFaces: [...document.fonts].map(face => ({ family: face.family, status: face.status })),
        figures: [...document.querySelectorAll('figure')].map(node => {
          const media = node.querySelector('.figure-media'), svg = media.querySelector('svg');
          const image = media.querySelector('img');
          const rect = media.getBoundingClientRect();
          const labels = [...(svg?.querySelectorAll('[data-label-id]') || [])].map(label => {
            const matrix = label.getScreenCTM(), box = label.getBoundingClientRect();
            return { id: label.getAttribute('data-label-id'),
              pixels: parseFloat(getComputedStyle(label).fontSize) * Math.hypot(matrix.a, matrix.b),
              fontFamily: getComputedStyle(label).fontFamily,
              fontSizePx: parseFloat(getComputedStyle(label).fontSize),
              fontCheck: document.fonts.check(
                `${getComputedStyle(label).fontSize} ${getComputedStyle(label).fontFamily}`, label.textContent),
              box: { x: box.x, y: box.y, width: box.width, height: box.height },
              text: label.textContent };
          });
          const actual = (image || svg).getBoundingClientRect();
          return { id: node.id, width: rect.width, height: rect.height,
            actualMediaWidth: actual.width, actualMediaHeight: actual.height,
            ariaLabel: node.getAttribute('aria-label'),
            graphicElements: svg?.querySelectorAll('path,line,circle,ellipse,polygon,polyline,rect').length || 0,
            ...(image ? {
              mode: media.dataset.figureMode, purpose: node.dataset.figurePurpose,
              image: {
                complete: image.complete, naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight,
                width: image.getBoundingClientRect().width, height: image.getBoundingClientRect().height,
                alt: image.alt,
              },
            } : {}),
            labels };
        }),
      }));
      if (config.nextFourAdapter && deterministicAssets.length) {
        const cdp = await context.newCDPSession(page);
        await cdp.send('DOM.enable');
        await cdp.send('CSS.enable');
        const { root: documentRoot } = await cdp.send('DOM.getDocument');
        for (const figure of geometry.figures) {
          for (const label of figure.labels) {
            const { nodeId } = await cdp.send('DOM.querySelector', {
              nodeId: documentRoot.nodeId,
              selector: `figure#${figure.id} [data-label-id="${label.id}"]`,
            });
            assert(nodeId > 0);
            const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
            label.renderedFonts = fonts;
          }
        }
        await cdp.detach();
      }
      assert(geometry.pageWidth <= viewport.width + 1);
      assert(geometry.fontsLoaded);
      assert(geometry.boxes.every(box => box.width > 0 && box.height > 0
        && box.x >= -1 && box.right <= viewport.width + 1));
      for (let index = 1; index < geometry.boxes.length; index++)
        assert(geometry.boxes[index].y >= geometry.boxes[index - 1].bottom - 1, 'Sheet item overlap');
      for (const figure of geometry.figures) {
        assert(figure.width > 0 && figure.height > 0);
        const asset = row.assets.find(asset => asset.id === figure.id);
        assert(asset);
        if (assetMode(asset) === 'generated') {
          const spec = read(asset.spec.path), generation = read(asset.generation.path);
          assert.equal(figure.mode, 'generated');
          assert.equal(figure.purpose, spec.display.purpose);
          assert(figure.image.complete && figure.image.naturalWidth > 0 && figure.image.naturalHeight > 0);
          assert.equal(figure.image.naturalWidth, generation.output.width);
          assert.equal(figure.image.naturalHeight, generation.output.height);
          assert(Math.abs(figure.image.width - figure.width) < 0.01);
          assert(Math.abs(figure.image.height - figure.height) < 0.01);
          assert(Math.abs(figure.image.height - figure.image.width * figure.image.naturalHeight
            / figure.image.naturalWidth) < 0.1, 'Generated PNG aspect ratio changed');
          assert(figure.width <= spec.display.maxWidthPx + 0.01);
          if (spec.display.purpose === 'decorative') assert.equal(figure.width, 160);
          assert.equal(figure.labels.length, 0);
          if (config.nextFourAdapter) {
            figure.image.sha256 = exactPngHashes[figure.id];
            assert.equal(figure.image.sha256, asset.png.sha256);
            assert.equal(figure.actualMediaWidth, figure.image.width);
          }
          const label = read(row.figures.path).figures.find(entry => entry.id === figure.id).label;
          assert(typeof label === 'string' && label.trim() && !/[\u3400-\u9fff\u0400-\u04ff]/.test(label));
        } else {
          assert(figure.graphicElements > 0);
          assert.equal(figure.labels.length, read(asset.render.path).labels);
          if (config.nextFourAdapter) {
            const spec = read(asset.spec.path);
            assert(Math.abs(figure.actualMediaWidth - figure.width) < 0.01);
            assert(figure.actualMediaWidth <= spec.display.maxWidthPx + 0.01);
            assert(figure.labels.every(label => label.fontCheck
              && label.renderedFonts.length > 0
              && label.renderedFonts.every(font => font.glyphCount > 0 && font.familyName)));
            assert(figure.labels.every(label => label.pixels >= spec.display.minTextPx - 0.01));
          }
        }
        assert(figure.labels.every(label => label.pixels >= 16 - 0.01));
        const sharedLabel = sharedAriaRecovery || config.englishProseAria || config.sourceProseAria
          ? lesson.prose.flatMap(block => block.figures || (block.kind === 'fig' ? [block] : []))
            .find(item => item.id === figure.id)?.label
          : null;
        const expectedAria = config.nextFourAdapter && assetMode(asset) === 'generated'
          ? read(row.figures.path).figures.find(entry => entry.id === figure.id).label
          : sharedLabel || (sourceAriaRecovery || config.sourceManifestAria
          ? read(row.figures.path).figures.find(entry => entry.id === figure.id).label
          : config.englishFigureAliases ? `Figure ${figure.id.slice(4)}` : `\u56fe${figure.id.slice(4)}`);
        assert.equal(figure.ariaLabel, expectedAria);
        if (assetMode(asset) === 'generated') assert.equal(figure.image.alt, expectedAria);
      }
      assert.deepEqual(requests, []);
      assert.deepEqual(errors, []);
      const standalone = await page.content(), htmlFile = `${out}/${activeView}.html`;
      fs.writeFileSync(htmlFile, standalone, { flag: 'wx' });
      const screenshot = `${out}/${activeView}-whole.png`;
      await page.screenshot({ path: screenshot, fullPage: true });
      const definitionIndex = config.nextFourAdapter ? 0 : expected.findIndex(block =>
        block.text.startsWith(config.focus));
      assert(definitionIndex >= 0);
      await page.locator('p.para').nth(definitionIndex).scrollIntoViewIfNeeded();
      const definitionScreenshot = `${out}/${activeView}-polarization-viewport.png`;
      await page.screenshot({ path: definitionScreenshot, fullPage: false });
      const figureScreenshots = [];
      for (const id of figureIds) {
        const locator = page.locator(`figure#${id}`);
        await locator.scrollIntoViewIfNeeded();
        const file = `${out}/${activeView}-${id}.png`;
        await locator.screenshot({ path: file });
        figureScreenshots.push({ id, image: bind(file),
          actualMediaWidth: geometry.figures.find(figure => figure.id === id).width });
      }
      views.push({
        id: activeView, locale: row.locale, edition: row.edition, viewport,
        status: 'FIRST_COMPLETE_EN_COURSE_DOM_PASS_PIXELS_PENDING',
        lesson: row.lesson, nativeHtml: row.textHtml, html: bind(htmlFile),
        screenshot: bind(screenshot), definitionScreenshot: bind(definitionScreenshot),
        figureScreenshots, heading, crumb, captions, paragraphs: paragraphs.length, geometry, errors,
        allOriginalSourceObjectsRetained: true, originalObjects: config.objects,
        originalTasks: 0, originalFigures: config.figures,
        completeEnglishAccessibilityApproval: false,
        machineChineseAriaLabelsRetainedAndDisclosed: config.generatedPng
          ? geometry.figures.some(figure => /[\u3400-\u9fff]/.test(figure.ariaLabel))
          : config.figures > 0 && !config.englishFigureAliases,
        ...(config.generatedPng ? {
          generatedPngBytesAndAspectRatioBound: true, englishManifestLabelsChecked: true,
          embeddedRasterGlyphCertificationClaimed: false,
        } : {}),
        ...(config.nextFourAdapter ? {
          perAssetModes: Object.fromEntries(row.assets.map(asset => [asset.id, assetMode(asset)])),
          deterministicActualFontEvidenceRecorded: true,
          deterministicPlatformFontsActuallyRenderedRecorded: true,
          generatedExactPngHashesAndDimensionsRecorded: generatedAssets.length > 0,
          embeddedRasterGlyphCertificationClaimed: false,
          machineChineseAriaLabelsRetainedAndDisclosed: geometry.figures.some(figure => /[\u3400-\u9fff]/.test(figure.ariaLabel)),
        } : {}),
      });
    } finally { await context.close(); }
  }
} catch (error) {
  failure = { view: activeView, message: error.message, stack: error.stack };
} finally { if (browser) await browser.close(); }
const report = `${ticket}/tmp/${config.directory}/report.json`;
save(report, {
  task: config.task, card, status: failure ? 'FAIL' : 'TWO_COMPLETE_EN_COURSE_DOM_VIEWS_PASS_BOUNDED_PIXELS_PENDING',
  views, requests, failure, browserClosed: true, headed: !config.headless, parentImagesOpened: 0,
  browserMode: config.headless ? 'isolated-headless' : 'isolated-headed',
  headedAcceptanceClaimed: !config.headless,
  executedHelper, executedHelperSnapshot: bind(executedHelperSnapshot),
  originalAriaFailure,
  originalFontFailure,
  native: bind(nativePath), offline: true, databaseWrites: 0, paidCalls: 0,
  completeCourseApproval: false, completeEnglishAccessibilityApproval: false,
  sourceAndZhReviewReplayed: false, newCompleteCourses: 0, newSourcePages: 0,
  ...(config.nextFourAdapter ? {
    maximumSavedImages: config.screenshots,
    savedImages: views.reduce((count, view) => count + 2 + view.figureScreenshots.length, 0),
    noNetwork: requests.length === 0, headedAcceptanceClaimed: false,
    limitation: 'Isolated offline headless native course HTML only; not production, headed acceptance, or pixel approval',
  } : {}),
});
assert.equal(failure, null, failure?.message);
assert.equal(views.length, 2);
if (config.screenshots) assert.equal(views.reduce((count, view) =>
  count + 2 + view.figureScreenshots.length, 0), config.screenshots);
console.log(JSON.stringify({ report: bind(report), views: 2,
  screenshots: 2 * (2 + config.figures), browserClosed: true }));

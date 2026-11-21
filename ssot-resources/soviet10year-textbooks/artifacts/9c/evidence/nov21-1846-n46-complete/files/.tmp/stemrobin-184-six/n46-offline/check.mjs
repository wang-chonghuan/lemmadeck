import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { choiceHtml } from '../../../.claude/skills/ld-s10y-lesson/tools/choice_html.mjs';

const ROOT = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), ROOT);
const BASE = path.join(ROOT, '.tmp/stemrobin-184-six');
const OUT = path.join(BASE, 'n46-offline');
const LESSON = 'ana9-c4-s2-n46';
const retained = path.join(ROOT, 'ssot-resources/soviet10year-textbooks/artifacts/9c/editions/modern-us-neutral/lessons', LESSON);
const render = path.join(ROOT, '.tmp/ld-s10y-lesson/render/9c/modern-us-neutral', LESSON);
const appRequire = createRequire(path.join(ROOT, 'app/package.json'));
const helperRequire = createRequire(path.join(ROOT, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'));
const { chromium } = appRequire('playwright');
const { proseFlow } = helperRequire('./htmlfrag.js');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length, sha256: hash(bytes) };
};
const save = (name, value) => {
  const file = path.join(OUT, name);
  fs.writeFileSync(file, typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
  return bind(file);
};
const inputs = {
  scope: path.join(BASE, 'n46-offline-scope.md'),
  retentionReceipt: path.join(BASE, 'stages/n46-choice-first-retention-nov21.receipt.json'),
  lesson: path.join(retained, 'lesson.json'),
  exercises: path.join(retained, 'exercises.json'),
  figures: path.join(retained, 'figures.json'),
  retainedChoiceDraft: path.join(retained, 'choice-set/draft.json'),
  text: path.join(render, 'text.html'),
  written: path.join(render, 'exercises.html'),
  implementationReferenceReadOnly: path.join(BASE, 'n45-offline/check.mjs'),
  choiceHtmlHelper: path.join(ROOT, '.claude/skills/ld-s10y-lesson/tools/choice_html.mjs'),
  htmlFragmentHelper: path.join(ROOT, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'),
  markedModule: path.join(ROOT, '.agents/skills/node_modules/marked/lib/marked.esm.js'),
  katexModule: helperRequire.resolve('katex'),
  playwrightPackage: appRequire.resolve('playwright/package.json'),
  runner: path.join(BASE, 'run-stage.mjs'),
};
const failures = [];
const assertions = [];
function check(name, passed, actual) {
  const record = { name, verdict: passed ? 'PASS' : 'FAIL', ...(actual === undefined ? {} : { actual }) };
  assertions.push(record);
  if (!passed) failures.push(record);
}
const inputBindings = Object.fromEntries(Object.entries(inputs).map(([name, file]) => [name, bind(file)]));
const lesson = JSON.parse(fs.readFileSync(inputs.lesson));
const exercises = JSON.parse(fs.readFileSync(inputs.exercises)).exercises;
const figures = JSON.parse(fs.readFileSync(inputs.figures)).figures;
// Only this whitelisted projection is passed to the renderer; no author fields leave the file parse.
const publicViews = JSON.parse(fs.readFileSync(inputs.retainedChoiceDraft)).questions.map(({ view }) => ({
  mode: view.mode,
  stem: view.stem,
  figure_ids: [...view.figure_ids],
  options: view.options.map(({ id, text, figure_ids }) => ({ id, text, figure_ids: [...figure_ids] })),
}));
const projection = save('public-view-only.json', publicViews);
inputs.publicViewScratch = projection.path;
inputBindings.publicViewScratch = projection;
const prose = proseFlow(lesson.prose, lesson.section_breaks);
const norm = text => text.replace(/\*\*([^*]+)\*\*/gu, '$1').replace(/\s+/gu, ' ').trim();
const formulas = text => [...text.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs)].map(match => match[1] ?? match[2]);
const expectedFormulas = {
  text: lesson.prose.flatMap(block => formulas(block.text)),
  written: exercises.flatMap(exercise => formulas(exercise.text)),
  choice: publicViews.flatMap(view => [...formulas(view.stem), ...view.options.flatMap(option => formulas(option.text))]),
};
const counts = {
  proseBlocks: lesson.prose.length,
  displayedParagraphs: prose.length,
  sectionBreaks: lesson.section_breaks.length,
  writtenNumbers: exercises.map(exercise => exercise.number),
  writtenSubparts: exercises.map(exercise => ({
    number: exercise.number,
    ids: [...exercise.text.matchAll(/^([a-z])\)/gmu)].map(match => match[1]),
  })),
  choices: publicViews.map((view, index) => ({ question: index + 1, mode: view.mode, optionIds: view.options.map(option => option.id), optionCount: view.options.length })),
  totalOptions: publicViews.reduce((sum, view) => sum + view.options.length, 0),
  formulaCounts: Object.fromEntries(Object.entries(expectedFormulas).map(([name, items]) => [name, items.length])),
  figures: figures.length,
};
check('input: retention prerequisite exit0', JSON.parse(fs.readFileSync(inputs.retentionReceipt)).exitCode === 0);
check('input: n46 only, seven blocks/eight paragraphs', lesson.id === LESSON && lesson.prose.length === 7 && prose.length === 8, counts);
check('input: one adjacent approved section break', lesson.section_breaks.length === 1 && prose.filter(item => item.sectionBreak).length === 1, lesson.section_breaks);
check('input: written order 375/376/377', JSON.stringify(counts.writtenNumbers) === '["375","376","377"]', counts.writtenNumbers);
check('input: seven written subparts 3/2/2', JSON.stringify(counts.writtenSubparts.map(item => item.ids)) === '[["a","b","c"],["a","b"],["a","b"]]', counts.writtenSubparts);
check('input: three single/two multiple and 26 options', JSON.stringify(publicViews.map(view => view.mode)) === '["single","single","single","multiple","multiple"]' && counts.totalOptions === 26, counts.choices);
check('input: no figures anywhere', figures.length === 0 && lesson.figures.length === 0 && exercises.every(item => item.figures.length === 0 && item.figure_refs.length === 0) && publicViews.every(view => view.figure_ids.length === 0 && view.options.every(option => option.figure_ids.length === 0)));

const evidence = {
  schema: 'stemrobin184/n46-offline-display-evidence@1',
  scope: 'STEMROBIN-184 / 184-6; ana9-c4-s2-n46; book9c; ONE fresh independent offline display batch',
  started: new Date().toISOString(),
  counts,
  bindings: { inputs: inputBindings, checker: bind(path.join(OUT, 'check.mjs')), publicProjection: projection },
  accounting: {
    fork_context: false,
    freshIndependentContext: true,
    screenshotCreationCount: 0,
    actualImageToolViews: 0,
    actualToolViewsStatus: 'PENDING subsequent six one-time image-tool views',
    taskScreenshotCreations: 0,
    taskImageToolViews: 0,
    contextImageToolViewsBefore: 0,
    contextImageToolViews: 0,
    batchScreenshotLimit: 6,
    batchImageViewLimit: 8,
    contextImageViewLimit: 24,
    parentContextImageToolViews: '24/24 permanently; unchanged',
    parentImagesOrDecodes: 0,
    rawSourceScanViewsOrDecodes: 0,
    screenshotReadsForHashing: 0,
    screenshotDecodesByChecker: 0,
    hiddenRendererBrowserInternalImageLoads: 'UNKNOWN',
    hiddenRendererBrowserInternalImageDecodes: 'UNKNOWN',
    browserContextsCreated: 0,
    pagesCreated: 0,
    initialAboutBlankDocuments: 0,
    targetNavigations: 0,
    targetReloads: 0,
    detachedDocumentParses: 0,
    fragmentParses: 0,
    temporaryServersStarted: 0,
    paidCalls: 0,
    moneySpentUSD: 0,
  },
  browser: {
    package: appRequire.resolve('playwright'),
    version: appRequire('playwright/package.json').version,
    headless: true,
    limitation: 'Explicitly authorized isolated HEADLESS offline batch using retained artifacts; not live app acceptance, DB validation, answer reveal, mathematical/source approval, production or publication authorization.',
  },
  network: {
    remoteDependencies: 0,
    offline: true,
    serviceWorkers: 'blocked',
    routePolicy: 'Only file:/data:/about: allowed. All other schemes aborted.',
    allowedRequests: [],
    blockedRequests: [],
    observedRequests: [],
    failedRequests: [],
    remoteResponses: [],
    hiddenBrowserBackgroundActivity: 'UNKNOWN; background networking disabled',
  },
  views: [],
  assertions,
  failures,
};
let browser;
const contexts = new Set();
try {
  const runtime = path.join(OUT, 'browser-runtime');
  fs.mkdirSync(runtime, { recursive: true });
  browser = await chromium.launch({
    headless: true,
    downloadsPath: runtime,
    env: { ...process.env, TMPDIR: runtime },
    args: ['--disable-background-networking', '--disable-component-update', '--disable-domain-reliability', '--disable-sync', '--no-pings'],
  });
  evidence.browser.executable = chromium.executablePath();
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, offline: true, serviceWorkers: 'block' });
  contexts.add(context);
  evidence.accounting.browserContextsCreated++;
  await context.route('**/*', async route => {
    const request = route.request();
    const record = { url: request.url(), resourceType: request.resourceType() };
    if (/^(file|data|about):/u.test(record.url)) {
      evidence.network.allowedRequests.push(record);
      await route.continue();
    } else {
      evidence.network.blockedRequests.push(record);
      await route.abort('internetdisconnected');
    }
  });
  context.on('request', request => evidence.network.observedRequests.push({ url: request.url(), resourceType: request.resourceType() }));
  context.on('requestfailed', request => evidence.network.failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
  context.on('response', response => {
    if (!/^(file|data|about):/u.test(response.url())) evidence.network.remoteResponses.push({ url: response.url(), status: response.status() });
  });
  const page = await context.newPage();
  evidence.accounting.pagesCreated++;
  evidence.accounting.initialAboutBlankDocuments++;
  let activeView = null;
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push({ view: activeView, kind: 'pageerror', message: error.message }));
  page.on('console', message => {
    if (message.type() === 'error') pageErrors.push({ view: activeView, kind: 'console', message: message.text() });
  });
  const fragments = publicViews.map(view => ({
    mode: view.mode,
    stem: choiceHtml(view.stem),
    options: view.options.map(option => ({ id: option.id, html: choiceHtml(option.text) })),
  }));
  const generated = await page.evaluate(({ canonicalHtml, title, fragments }) => {
    const doc = new DOMParser().parseFromString(canonicalHtml, 'text/html');
    const sheet = doc.querySelector('.sheet');
    if (!sheet || doc.querySelector('script')) throw new Error('Canonical text lacks sheet or contains scripts');
    const sourceStyles = [...doc.querySelectorAll('style')].map(style => style.textContent);
    sheet.replaceChildren();
    doc.title = title;
    const heading = doc.createElement('h1');
    heading.textContent = title;
    sheet.append(heading);
    const form = doc.createElement('form');
    form.id = 'learner-choices';
    sheet.append(form);
    const insert = (parent, markup) => {
      const range = doc.createRange();
      range.selectNodeContents(parent);
      parent.append(range.createContextualFragment(markup));
    };
    fragments.forEach((view, index) => {
      const section = doc.createElement('section');
      section.className = 'choice-question';
      const h2 = doc.createElement('h2');
      h2.className = 'choice-title';
      h2.id = `q-${index + 1}`;
      section.setAttribute('aria-labelledby', h2.id);
      const number = doc.createElement('span');
      number.className = 'choice-number';
      number.textContent = `${index + 1}.`;
      const stem = doc.createElement('span');
      stem.className = 'choice-stem';
      insert(stem, view.stem);
      h2.append(number, stem);
      section.append(h2);
      view.options.forEach(option => {
        const label = doc.createElement('label');
        label.className = 'choice-option';
        const control = doc.createElement('input');
        control.type = view.mode === 'single' ? 'radio' : 'checkbox';
        control.name = `q-${index + 1}`;
        control.id = `q-${index + 1}-${option.id}`;
        control.value = option.id;
        const id = doc.createElement('span');
        id.className = 'choice-id';
        id.textContent = `${option.id}.`;
        const text = doc.createElement('span');
        text.className = 'choice-text';
        insert(text, option.html);
        label.append(control, id, text);
        section.append(label);
      });
      form.append(section);
    });
    sheet.querySelectorAll('.sr-nb').forEach(node => node.classList.add('nb'));
    const style = doc.createElement('style');
    style.textContent = `
.choice-question{margin:1.5em 0 0;padding:1.1em 0 0;border-top:1px solid var(--rule)}
.choice-title{display:grid;grid-template-columns:2em minmax(0,1fr);font:inherit;line-height:1.95;margin:0 0 .65em;letter-spacing:0}
.choice-option{display:grid;grid-template-columns:1.1em 1.3em minmax(0,1fr);gap:.45em;align-items:start;padding:.4em 0;line-height:1.95}
.choice-option input{width:1em;height:1em;margin:.45em 0 0;accent-color:var(--accent)}
.choice-stem,.choice-text{min-width:0}
.choice-id,.choice-number{font-family:KaTeX_Main,serif}
.choice-question .katex{font-size:1.1em}
`;
    doc.head.append(style);
    return { html: '<!DOCTYPE html>\n' + doc.documentElement.outerHTML, sourceStyles, choiceStyle: style.textContent };
  }, { canonicalHtml: fs.readFileSync(inputs.text, 'utf8'), title: lesson.printed_title, fragments });
  evidence.accounting.detachedDocumentParses++;
  evidence.accounting.fragmentParses = fragments.reduce((sum, view) => sum + 1 + view.options.length, 0);
  const choiceHtmlBinding = save('choices.html', generated.html);
  evidence.bindings.generatedChoiceHtml = choiceHtmlBinding;
  evidence.styleReuse = {
    canonical: generated.sourceStyles.map(style => ({ bytes: Buffer.byteLength(style), sha256: hash(style) })),
    appended: { bytes: Buffer.byteLength(generated.choiceStyle), sha256: hash(generated.choiceStyle) },
    projection: 'Whitelisted public mode/stem/option id/text only; local sequential control names; no internal payload',
  };

  for (const [viewportName, viewport] of [['desktop', { width: 1440, height: 960 }], ['mobile', { width: 390, height: 844 }]]) {
    await page.setViewportSize(viewport);
    for (const [surface, file] of [['text', inputs.text], ['written', inputs.written], ['choice', choiceHtmlBinding.path]]) {
      const id = `${viewportName}-${surface}`;
      activeView = id;
      const entry = { id, surface, viewport, file, errors: [], screenshot: { path: path.join(OUT, `${id}.png`), fullPage: true, actualToolViews: 0, observation: 'PENDING one actual image-tool view' } };
      evidence.views.push(entry);
      try {
        evidence.accounting.targetNavigations++;
        await page.goto(pathToFileURL(file).href, { waitUntil: 'load', timeout: 30000 });
        await page.locator('.sheet').waitFor({ state: 'visible' });
        await page.evaluate(async () => { await document.fonts.ready; });
        entry.dom = await page.evaluate(() => {
          const sheet = document.querySelector('.sheet');
          const rect = element => {
            const box = element.getBoundingClientRect();
            return { left: box.left, top: box.top, right: box.right, bottom: box.bottom, width: box.width, height: box.height };
          };
          const visible = element => {
            if (!element) return false;
            const box = rect(element), css = getComputedStyle(element);
            return box.width > 0 && box.height > 0 && css.display !== 'none' && css.visibility !== 'hidden';
          };
          const logical = element => {
            const clone = element.cloneNode(true);
            clone.querySelectorAll('.katex').forEach(math => math.replaceWith(document.createTextNode('$' + math.querySelector('annotation[encoding="application/x-tex"]')?.textContent + '$')));
            clone.querySelectorAll('br').forEach(br => br.replaceWith(document.createTextNode('\n')));
            return clone.textContent.replace(/\s+/gu, ' ').trim();
          };
          const overlaps = [];
          const ordered = (elements, role) => {
            elements.forEach((element, index) => {
              if (!visible(element)) overlaps.push({ role, index, issue: 'invisible' });
              if (index && rect(elements[index - 1]).bottom > rect(element).top + 1) overlaps.push({ role, index, issue: 'vertical sibling overlap' });
            });
          };
          ordered([...sheet.children], 'sheet');
          ordered([...document.querySelectorAll('p.para')], 'paragraphs');
          ordered([...document.querySelectorAll('li.ex')], 'written');
          ordered([...document.querySelectorAll('.choice-question')], 'questions');
          document.querySelectorAll('.choice-question').forEach((question, index) => ordered([...question.children], `question${index + 1}`));
          document.querySelectorAll('li.ex,.choice-title,.choice-option').forEach((row, index) => {
            const columns = [...row.children];
            for (let column = 1; column < columns.length; column++) {
              const left = rect(columns[column - 1]), right = rect(columns[column]);
              if (left.right > right.left + 1 && Math.min(left.bottom, right.bottom) > Math.max(left.top, right.top) + 1) overlaps.push({ role: row.className, index, issue: 'adjacent columns overlap' });
            }
          });
          const clipping = [], rawDollars = [], typography = [];
          const walker = document.createTreeWalker(sheet, NodeFilter.SHOW_TEXT);
          for (let node = walker.nextNode(); node; node = walker.nextNode()) {
            const parent = node.parentElement;
            if (!node.textContent.trim() || parent.closest('.katex') || !visible(parent)) continue;
            if (node.textContent.includes('$')) rawDollars.push(node.textContent);
            const region = parent.closest('.choice-text,.choice-stem,.choice-id,.choice-number,.body,.no,p.para,h1,.crumb,.jump,.exgroup') ?? parent;
            const css = getComputedStyle(parent), regionCss = getComputedStyle(region);
            if (/[A-Za-z0-9]/u.test(node.textContent) && !parent.closest('h1,.crumb,.jump')) {
              const range = document.createRange();
              range.selectNodeContents(node);
              typography.push({
                text: node.textContent.trim().slice(0, 80), region: region.className,
                family: css.fontFamily, size: parseFloat(css.fontSize),
                regionSize: parseFloat(regionCss.fontSize),
                ratio: parseFloat(css.fontSize) / parseFloat(regionCss.fontSize),
                range: [...range.getClientRects()].map(box => ({ width: box.width, height: box.height })),
                fontAvailable: document.fonts.check(`${css.fontStyle} ${css.fontWeight} ${css.fontSize} ${css.fontFamily}`),
              });
            }
            if (parent.closest('.nb,.sr-nb')) continue;
            const range = document.createRange();
            range.selectNodeContents(node);
            const box = rect(region);
            for (const glyphBox of range.getClientRects()) {
              if (glyphBox.left < box.left - 1 || glyphBox.right > box.right + 1 || glyphBox.top < box.top - 2 || glyphBox.bottom > box.bottom + 2)
                clipping.push({ region: region.className, text: node.textContent.slice(0, 70), glyph: { left: glyphBox.left, top: glyphBox.top, right: glyphBox.right, bottom: glyphBox.bottom }, regionBox: box });
            }
          }
          const math = [...sheet.querySelectorAll('.katex')];
          const mathProblems = [];
          math.forEach((formula, index) => {
            const html = formula.querySelector('.katex-html');
            if (!visible(html) || !formula.querySelector('annotation')?.textContent) mathProblems.push({ index, issue: 'missing math HTML/annotation' });
            if (!html) return;
            const wrapper = formula.closest('.nb,.sr-nb') ?? formula;
            const box = rect(wrapper), css = getComputedStyle(wrapper);
            html.querySelectorAll('*').forEach(leaf => {
              if (leaf.children.length || !leaf.textContent.trim() || !visible(leaf)) return;
              const glyph = rect(leaf);
              if ((css.overflowY !== 'visible' && (glyph.top < box.top - 2 || glyph.bottom > box.bottom + 2)) ||
                  (!['auto', 'scroll'].includes(css.overflowX) && (glyph.left < box.left - 2 || glyph.right > box.right + 2)))
                mathProblems.push({ index, issue: 'clipped formula glyph', text: leaf.textContent, glyph, wrapper: box, overflowX: css.overflowX, overflowY: css.overflowY });
            });
          });
          const usedFonts = new Map();
          document.querySelectorAll('.katex-html *,.prose-math,.choice-id,.choice-number').forEach(element => {
            if (!visible(element)) return;
            const css = getComputedStyle(element);
            const family = css.fontFamily.split(',')[0].replace(/["']/gu, '').trim();
            if (!family.startsWith('KaTeX_')) return;
            const spec = `${css.fontStyle} ${css.fontWeight} ${css.fontSize} "${family}"`;
            usedFonts.set(spec, { spec, available: document.fonts.check(spec), loadedMatchingFaces: [...document.fonts].filter(face => face.family.replace(/["']/gu, '') === family && face.status === 'loaded').length });
          });
          const cssRules = [...document.styleSheets].flatMap(style => [...style.cssRules]);
          const fontRules = cssRules.filter(rule => rule.type === CSSRule.FONT_FACE_RULE);
          const paragraphs = [...document.querySelectorAll('p.para')];
          const reach = (element, label) => {
            if (!element) return { label, exists: false, reachable: false };
            element.scrollIntoView({ block: 'end', inline: 'nearest' });
            const box = rect(element);
            return { label, exists: true, scrollY, box, reachable: box.bottom <= innerHeight + 1 && box.bottom > 0 && box.right <= innerWidth + 1 && box.left >= -1 };
          };
          const ends = [
            ...(paragraphs.length ? [reach(paragraphs.at(-1), 'final paragraph')] : []),
            ...(document.querySelector('li.ex') ? [reach(document.querySelector('li.ex:last-child'), 'last written task')] : []),
            ...(document.querySelector('.choice-option') ? [reach(document.querySelector('.choice-question:last-child .choice-option:last-child'), 'last choice option')] : []),
            ...(document.querySelector('.jump') ? [reach(document.querySelector('.jump'), 'exercise/text navigation')] : []),
          ];
          const navigation = [...document.querySelectorAll('.jump')].map(link => ({ text: link.innerText, href: link.getAttribute('href'), resolved: link.href, visible: visible(link), box: rect(link) }));
          window.scrollTo(0, 0);
          return {
            url: location.href, heading: sheet.querySelector('h1')?.innerText,
            contentVisible: visible(sheet) && sheet.innerText.trim().length > 100,
            pageWidth: innerWidth, documentWidth: document.documentElement.scrollWidth, bodyWidth: document.body.scrollWidth,
            paragraphs: paragraphs.map(paragraph => ({ text: logical(paragraph), sectionBreak: paragraph.classList.contains('section'), textIndent: getComputedStyle(paragraph).textIndent, box: rect(paragraph) })),
            boundaries: paragraphs.flatMap((paragraph, index) => paragraph.classList.contains('section') ? [{ index, before: logical(paragraphs[index - 1]), after: logical(paragraph), borderTopWidth: getComputedStyle(paragraph).borderTopWidth, gap: rect(paragraph).top - rect(paragraphs[index - 1]).bottom }] : []),
            written: [...document.querySelectorAll('li.ex')].map(item => ({ id: item.id, number: item.querySelector('.no').innerText, text: logical(item.querySelector('.body')), subpartIds: [...logical(item.querySelector('.body')).matchAll(/(?:^|\s)([a-z])\)/gu)].map(match => match[1]), visible: visible(item), box: rect(item) })),
            choices: [...document.querySelectorAll('.choice-question')].map(question => ({
              number: question.querySelector('.choice-number').innerText, stem: logical(question.querySelector('.choice-stem')),
              options: [...question.querySelectorAll('.choice-option')].map(label => ({ id: label.querySelector('.choice-id').innerText, text: logical(label.querySelector('.choice-text')), type: label.querySelector('input').type, name: label.querySelector('input').name, checked: label.querySelector('input').checked, visible: visible(label) && visible(label.querySelector('input')), box: rect(label), controlBox: rect(label.querySelector('input')) })),
            })),
            formulaAnnotations: math.map(formula => formula.querySelector('annotation')?.textContent),
            formulaErrors: document.querySelectorAll('.katex-error,.sr-tex-err,.err').length,
            mathProblems, overlaps, clipping, rawDollars, typography, ends, navigation,
            fonts: { status: document.fonts.status, fontFaceCount: fontRules.length, allFacesInline: fontRules.every(rule => /url\(["']?data:/u.test(rule.style.getPropertyValue('src'))), used: [...usedFonts.values()], loadedFaces: [...document.fonts].filter(face => face.status === 'loaded').map(face => ({ family: face.family, style: face.style, weight: face.weight })) },
            figures: [...sheet.querySelectorAll('img,svg,.fig,.figure-media,[data-figure-id]')].filter(element => !element.closest('.katex')).length,
            brokenAssets: [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.src),
            remoteCss: cssRules.filter(rule => rule.type === CSSRule.IMPORT_RULE || /url\(\s*["']?(?:https?:|\/\/)/iu.test(rule.cssText)).map(rule => rule.cssText),
            remoteResources: performance.getEntriesByType('resource').filter(item => /^https?:/u.test(item.name)).map(item => item.name),
            scripts: document.querySelectorAll('script').length,
            internalFieldLeaks: [...sheet.querySelectorAll('*')].flatMap(element => {
              const attrs = [...element.attributes].filter(attr => /intent|correct|rationale|source.?map|source.?refs|review|coverage|answer.?key|correct.?set/iu.test(attr.name + ' ' + attr.value));
              return attrs.length || element.matches('template,input[type=hidden],[hidden]') ? [{ tag: element.tagName, attrs: attrs.map(attr => [attr.name, attr.value]) }] : [];
            }),
            internalTextLeak: /correct_(?:index|set)|answer[-_ ]?key|source_refs|source_mapping|self_review|"intent"\s*:|"rationale"\s*:|正确答案|答案解析/iu.test(sheet.textContent),
            styles: [...document.querySelectorAll('style')].map(style => style.textContent),
          };
        });
        const dom = entry.dom;
        dom.styleBindings = dom.styles.map(style => ({ bytes: Buffer.byteLength(style), sha256: hash(style) }));
        delete dom.styles;
        check(`${id}: actual local content`, dom.contentVisible && dom.url === pathToFileURL(file).href && dom.heading.startsWith(lesson.printed_title), { url: dom.url, heading: dom.heading });
        check(`${id}: no page horizontal overflow`, dom.documentWidth <= viewport.width && dom.bodyWidth <= viewport.width, { viewport: viewport.width, document: dom.documentWidth, body: dom.bodyWidth });
        check(`${id}: no flow/control overlap`, dom.overlaps.length === 0, dom.overlaps);
        check(`${id}: ordinary text and options unclipped`, dom.clipping.length === 0, dom.clipping);
        check(`${id}: all formulas preserved/rendered/unclipped`, JSON.stringify(dom.formulaAnnotations) === JSON.stringify(expectedFormulas[surface]) && dom.formulaErrors === 0 && dom.mathProblems.length === 0 && dom.rawDollars.length === 0, { expectedCount: expectedFormulas[surface].length, actualCount: dom.formulaAnnotations.length, errors: dom.formulaErrors, problems: dom.mathProblems, rawDollars: dom.rawDollars });
        check(`${id}: inline math fonts complete`, dom.fonts.status === 'loaded' && dom.fonts.fontFaceCount > 0 && dom.fonts.allFacesInline && dom.fonts.used.length > 0 && dom.fonts.used.every(font => font.available && font.loadedMatchingFaces > 0), dom.fonts);
        check(`${id}: numeric/Latin prose not undersized`, dom.typography.length > 0 && dom.typography.every(sample => sample.fontAvailable && sample.size >= 15 && sample.ratio >= 0.95 && sample.ratio <= 1.15), dom.typography);
        check(`${id}: no figures or broken assets`, dom.figures === 0 && dom.brokenAssets.length === 0, { figures: dom.figures, brokenAssets: dom.brokenAssets });
        check(`${id}: end and navigation reachable`, dom.ends.length > 0 && dom.ends.every(end => end.reachable), dom.ends);
        check(`${id}: no remote CSS or resource loads`, dom.remoteCss.length === 0 && dom.remoteResources.length === 0, { css: dom.remoteCss, resources: dom.remoteResources });

        const cdp = await context.newCDPSession(page);
        try {
          await cdp.send('DOM.enable');
          await cdp.send('CSS.enable');
          const { root: documentNode } = await cdp.send('DOM.getDocument');
          entry.platformFonts = [];
          for (const selector of ['p.para', '.prose-math', '.body', '.no', '.choice-stem', '.choice-text', '.choice-id', '.katex-html .mathnormal']) {
            const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: documentNode.nodeId, selector });
            if (!nodeId) continue;
            const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
            entry.platformFonts.push({ selector, fonts });
          }
          check(`${id}: actual platform fonts resolve glyphs`, entry.platformFonts.length > 0 && entry.platformFonts.every(sample => sample.fonts.some(font => font.glyphCount > 0)), entry.platformFonts);
        } finally {
          await cdp.detach();
        }
        if (surface === 'text') {
          check(`${id}: exact eight n46 paragraphs, no n47 prose`, JSON.stringify(dom.paragraphs.map(item => item.text)) === JSON.stringify(prose.map(item => norm(item.text))) && dom.paragraphs.length === 8);
          check(`${id}: approved visible section boundary`, dom.boundaries.length === 1 && dom.boundaries[0].before === norm(lesson.section_breaks[0].before) && dom.boundaries[0].after === norm(lesson.section_breaks[0].after) && parseFloat(dom.boundaries[0].borderTopWidth) > 0 && dom.boundaries[0].gap > 0, dom.boundaries);
          check(`${id}: zero first-line indent`, dom.paragraphs.every(item => parseFloat(item.textIndent) === 0), dom.paragraphs.map(item => item.textIndent));
          check(`${id}: exercise navigation resolves existing local file`, dom.navigation.length === 1 && dom.navigation[0].resolved === pathToFileURL(inputs.written).href && fs.existsSync(inputs.written), dom.navigation);
        }
        if (surface === 'written') {
          check(`${id}: exact ordered written prose/subparts`, JSON.stringify(dom.written.map(item => item.number)) === '["375.","376.","377."]' && JSON.stringify(dom.written.map(item => item.text)) === JSON.stringify(exercises.map(item => norm(item.text))) && JSON.stringify(dom.written.map(item => item.subpartIds)) === '[["a","b","c"],["a","b"],["a","b"]]', dom.written);
          const shared = norm(exercises[0].text.split('\n')[0]);
          const drawing = norm(exercises[2].text.split('\n')[0]);
          check(`${id}: shared request only 375/376; 377 drawing request`, dom.written.length === 3 && dom.written[0].text.startsWith(shared) && dom.written[1].text.startsWith(shared) && dom.written[2].text.startsWith(drawing) && !dom.written[2].text.includes(shared), { shared, drawing });
          check(`${id}: text return navigation`, dom.navigation.length === 1 && dom.navigation[0].resolved === pathToFileURL(inputs.text).href, dom.navigation);
          check(`${id}: written has no choice/input controls`, await page.locator('input,textarea,button,select').count() === 0);
        }
        if (surface === 'choice') {
          check(`${id}: exact public five-question/26-option view`, dom.choices.length === 5 && dom.choices.reduce((sum, item) => sum + item.options.length, 0) === 26 && dom.choices.every((question, index) => question.stem === norm(publicViews[index].stem) && question.number === `${index + 1}.` && question.options.length === publicViews[index].options.length && question.options.every((option, optionIndex) => option.id === `${publicViews[index].options[optionIndex].id}.` && option.text === norm(publicViews[index].options[optionIndex].text) && option.type === (publicViews[index].mode === 'single' ? 'radio' : 'checkbox') && option.visible && !option.checked)), counts.choices);
          check(`${id}: no internal fields/scripts/keys/rationale`, dom.scripts === 0 && dom.internalFieldLeaks.length === 0 && !dom.internalTextLeak && !/\b(?:correct_(?:index|set)|answer[-_]key|source_refs|source_mapping|self_review|rationale|coverage)\b/iu.test(generated.html), { scripts: dom.scripts, fields: dom.internalFieldLeaks, textLeak: dom.internalTextLeak });
          check(`${id}: canonical style/font exact reuse`, JSON.stringify(dom.styleBindings.slice(0, -1)) === JSON.stringify(evidence.styleReuse.canonical), dom.styleBindings);
          entry.interactions = [];
          const allState = () => page.locator('.choice-question').evaluateAll(questions => questions.map(question => [...question.querySelectorAll('input')].map(input => input.checked)));
          for (let questionIndex = 0; questionIndex < publicViews.length; questionIndex++) {
            const view = publicViews[questionIndex];
            const controls = page.locator('.choice-question').nth(questionIndex).locator('input');
            const record = { question: questionIndex + 1, mode: view.mode, nativeClicks: [], crossQuestionIsolation: true };
            entry.interactions.push(record);
            for (let optionIndex = 0; optionIndex < view.options.length; optionIndex++) {
              const before = await allState();
              await controls.nth(optionIndex).click();
              const after = await allState();
              const expected = before[questionIndex].map((value, index) => view.mode === 'single' ? index === optionIndex : index === optionIndex ? !value : value);
              const isolated = after.every((state, index) => index === questionIndex || JSON.stringify(state) === JSON.stringify(before[index]));
              record.crossQuestionIsolation &&= isolated;
              record.nativeClicks.push({ optionId: view.options[optionIndex].id, action: 'select', before: before[questionIndex], after: after[questionIndex], otherQuestionsBefore: before.filter((_, index) => index !== questionIndex), otherQuestionsAfter: after.filter((_, index) => index !== questionIndex), isolated });
              check(`${id}: q${questionIndex + 1} ${view.options[optionIndex].id} native ${view.mode} selection and isolation`, JSON.stringify(after[questionIndex]) === JSON.stringify(expected) && isolated, record.nativeClicks.at(-1));
            }
            if (view.mode === 'multiple') {
              record.allIndependentlySelected = (await allState())[questionIndex].every(Boolean);
              check(`${id}: q${questionIndex + 1} all checkboxes independently selected`, record.allIndependentlySelected);
              for (let optionIndex = 0; optionIndex < view.options.length; optionIndex++) {
                const before = await allState();
                await controls.nth(optionIndex).click();
                const after = await allState();
                const isolated = after.every((state, index) => index === questionIndex || JSON.stringify(state) === JSON.stringify(before[index]));
                const expected = before[questionIndex].map((value, index) => index === optionIndex ? false : value);
                record.crossQuestionIsolation &&= isolated;
                record.nativeClicks.push({ optionId: view.options[optionIndex].id, action: 'deselect', before: before[questionIndex], after: after[questionIndex], otherQuestionsBefore: before.filter((_, index) => index !== questionIndex), otherQuestionsAfter: after.filter((_, index) => index !== questionIndex), isolated });
                check(`${id}: q${questionIndex + 1} ${view.options[optionIndex].id} independent deselection and isolation`, JSON.stringify(after[questionIndex]) === JSON.stringify(expected) && isolated, record.nativeClicks.at(-1));
              }
            }
          }
          await page.locator('form').evaluate(form => form.reset());
          check(`${id}: neutral native form reset`, (await allState()).every(state => state.every(value => !value)));
          await page.locator('input').evaluateAll(controls => controls.forEach(control => control.blur()));
        }
        entry.localScrollers = await page.evaluate(() => {
          const sheet = document.querySelector('.sheet');
          const candidates = [...sheet.querySelectorAll('*')].filter(element => element.scrollWidth > element.clientWidth + 1 && ['auto', 'scroll'].includes(getComputedStyle(element).overflowX) && !element.closest('.katex'));
          return candidates.map((element, index) => {
            const box = () => element.getBoundingClientRect();
            const leaves = [...element.querySelectorAll('.katex-html *')].filter(child => child.children.length === 0 && child.textContent.trim());
            const first = leaves[0], last = leaves.at(-1);
            const inside = child => {
              if (!child) return false;
              const glyph = child.getBoundingClientRect(), container = box();
              return glyph.left >= container.left - 2 && glyph.right <= container.right + 2;
            };
            element.scrollLeft = 0;
            const left = { position: element.scrollLeft, text: first?.textContent, reachable: inside(first) };
            element.scrollLeft = element.scrollWidth;
            const right = { position: element.scrollLeft, max: element.scrollWidth - element.clientWidth, text: last?.textContent, reachable: inside(last) };
            element.scrollLeft = 0;
            return { index, className: element.className, clientWidth: element.clientWidth, scrollWidth: element.scrollWidth, overflowX: getComputedStyle(element).overflowX, left, right, screenshotAt: 'left; right edge proved by actual scroll, not another screenshot' };
          });
        });
        check(`${id}: every intentional local scroller reaches both formula ends`, entry.localScrollers.every(scroller => scroller.left.reachable && scroller.right.reachable && Math.abs(scroller.right.position - scroller.right.max) <= 1), entry.localScrollers);
        check(`${id}: no console/page errors`, pageErrors.filter(error => error.view === id).length === 0, pageErrors.filter(error => error.view === id));
      } catch (error) {
        entry.errors.push(error.message);
        check(`${id}: execution`, false, { message: error.message, stack: error.stack });
      } finally {
        try {
          await page.evaluate(() => { window.scrollTo(0, 0); });
          await page.screenshot({ path: entry.screenshot.path, fullPage: true, timeout: 30000 });
          evidence.accounting.screenshotCreationCount++;
          evidence.accounting.screenshotReadsForHashing++;
          Object.assign(entry.screenshot, bind(entry.screenshot.path), { captured: true });
        } catch (error) {
          entry.screenshot.captured = false;
          check(`${id}: screenshot creation`, false, error.message);
        }
      }
      console.log(JSON.stringify({ view: id, paragraphs: entry.dom?.paragraphs.length, written: entry.dom?.written.length, choices: entry.dom?.choices.length, formulas: entry.dom?.formulaAnnotations.length, localScrollers: entry.localScrollers?.length, screenshot: entry.screenshot.path, failures: failures.filter(failure => failure.name.startsWith(id)) }));
    }
  }
  evidence.browser.pageErrors = pageErrors;
  check('batch: exactly six fresh full-page screenshot creations', evidence.accounting.screenshotCreationCount === 6, evidence.accounting.screenshotCreationCount);
  check('batch: exactly six target navigations and zero reloads', evidence.accounting.targetNavigations === 6 && evidence.accounting.targetReloads === 0);
  check('network: zero remote attempts/responses/dependencies', evidence.network.blockedRequests.length === 0 && evidence.network.remoteResponses.length === 0 && evidence.network.observedRequests.every(request => /^(file|data|about):/u.test(request.url)), evidence.network);
} catch (error) {
  check('stage: execution', false, { message: error.message, stack: error.stack });
} finally {
  evidence.cleanup = { contextsClosed: 0, browserClosed: false, temporaryServersStarted: 0, temporaryServersClosed: 0, errors: [] };
  for (const context of contexts) {
    try { await context.close(); evidence.cleanup.contextsClosed++; }
    catch (error) { evidence.cleanup.errors.push(error.message); }
  }
  if (browser) {
    try { await browser.close(); evidence.cleanup.browserClosed = true; }
    catch (error) { evidence.cleanup.errors.push(error.message); }
  }
  check('cleanup: context/browser closed in finally; no temporary servers', evidence.cleanup.contextsClosed === evidence.accounting.browserContextsCreated && evidence.cleanup.browserClosed && evidence.cleanup.errors.length === 0, evidence.cleanup);
  for (const [name, original] of Object.entries(inputBindings)) {
    try { check(`binding: ${name} unchanged`, bind(original.path).sha256 === original.sha256); }
    catch (error) { check(`binding: ${name} readable`, false, error.message); }
  }
  evidence.accounting.taskScreenshotCreations = evidence.accounting.screenshotCreationCount;
  evidence.network.remoteDependencies = evidence.network.remoteResponses.length + evidence.views.reduce((sum, view) => sum + (view.dom?.remoteCss.length ?? 0) + (view.dom?.remoteResources.length ?? 0), 0);
  evidence.network.allowedRequestCount = evidence.network.allowedRequests.length;
  evidence.network.blockedRequestCount = evidence.network.blockedRequests.length;
  evidence.network.observedRequestCount = evidence.network.observedRequests.length;
  evidence.ended = new Date().toISOString();
  evidence.assertionVerdict = failures.length ? 'FAIL' : 'PASS';
  evidence.visualVerdict = 'PENDING actual six one-time image-tool views; no metadata-based visual approval';
  save('evidence.json', evidence);
  console.log(JSON.stringify({ assertionVerdict: evidence.assertionVerdict, assertions: assertions.length, failures: failures.length, remoteDependencies: evidence.network.remoteDependencies, screenshotCreations: evidence.accounting.screenshotCreationCount, evidence: path.join(OUT, 'evidence.json'), cleanup: evidence.cleanup }));
  process.exitCode = failures.length ? 1 : 0;
}

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { choiceHtml } from '../../../.claude/skills/ld-s10y-lesson/tools/choice_html.mjs';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const scratch = path.join(root, '.tmp/stemrobin-184-six/n44-offline');
const canonical = path.join(root, '.tmp/ld-s10y-lesson/render/9c/modern-us-neutral/ana9-c4-s2-n44');
const artifacts = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/9c/editions/modern-us-neutral/lessons/ana9-c4-s2-n44');
const requireApp = createRequire(path.join(root, 'app/package.json'));
const { chromium } = requireApp('playwright');
const sha = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const inputFiles = {
  text: path.join(canonical, 'text.html'),
  written: path.join(canonical, 'exercises.html'),
  lesson: path.join(artifacts, 'lesson.json'),
  exercises: path.join(artifacts, 'exercises.json'),
  draft: path.join(artifacts, 'choice-set/draft.json'),
  choiceHtml: path.join(root, '.claude/skills/ld-s10y-lesson/tools/choice_html.mjs'),
  htmlfrag: path.join(root, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'),
  script: path.join(scratch, 'check.mjs'),
};
const inputBytes = Object.fromEntries(Object.entries(inputFiles).map(([name, file]) => [name, fs.readFileSync(file)]));
const bindings = Object.fromEntries(Object.entries(inputFiles).map(([name, file]) => [
  name, { path: file, bytes: inputBytes[name].length, sha256: sha(inputBytes[name]) },
]));
const lesson = JSON.parse(inputBytes.lesson);
const exercises = JSON.parse(inputBytes.exercises).exercises;
const views = JSON.parse(inputBytes.draft).questions.map(({ view }) => ({
  mode: view.mode,
  stem: view.stem,
  figure_ids: view.figure_ids,
  options: view.options.map(({ id, text, figure_ids }) => ({ id, text, figure_ids })),
}));
const failures = [];
const evidence = {
  scope: 'STEMROBIN-184/184-6 n44 offline presentation only',
  started: new Date().toISOString(),
  semanticVerdict: 'Inherited parent self_review PASS; no new mathematical approval',
  finalizedAnswersAndInteractions: 'Inherited 3 auto/1 ungraded and 3 math/1 free; not read or recomputed',
  inputs: bindings,
  accounting: {
    batch: 'NEW n44 offline artifact image batch',
    batchLimit: 8,
    contextLimit: 24,
    screenshotsCaptured: 0,
    screenshotFilesReadByThisScript: 0,
    screenshotDecodesByThisScript: 0,
    actualImageToolViews: 'PENDING after stage completion',
    originalSourceImageViewsOrDecodes: 0,
    parentImageViews: 'Permanently 24/24, unchanged',
    historicalNativeTechnical: '4/8, unchanged',
    historicalNativePage: '7/page, unchanged',
    browserContextsCreated: 0,
    browserPagesCreated: 0,
    initialAboutBlankDocuments: 0,
    targetNavigations: 0,
    targetReloads: 0,
    detachedCanonicalDocumentParses: 0,
    learnerFragmentParses: 0,
    hiddenRendererInternalLoadsAndDecodes: 'UNKNOWN',
  },
  browser: { package: requireApp.resolve('playwright'), version: requireApp('playwright/package.json').version, headless: false },
  network: {
    contextOffline: true,
    serviceWorkers: 'blocked',
    routePolicy: 'Allow file:, data:, about: only; abort every other scheme',
    requests: [],
    failedRequests: [],
    remoteAttempts: [],
    remoteResponses: [],
    dependencyCount: 0,
    hiddenBrowserBackgroundActivity: 'UNKNOWN; browser background-networking disabled',
  },
  views: [],
  failures,
};
function check(name, condition, actual) {
  if (!condition) failures.push({ name, actual });
}
function writeJson(name, value) {
  fs.writeFileSync(path.join(scratch, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
}
const norm = (value) => value.replace(/\s+/gu, ' ').trim();
const formulaCount = (value) => [...value.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs)].length;
const expectedModes = ['single', 'multiple', 'single', 'single', 'multiple'];
check('input: nine prose blocks', lesson.prose.length === 9, lesson.prose.length);
check('input: two boundaries', lesson.section_breaks.length === 2, lesson.section_breaks.length);
check('input: written numbers', JSON.stringify(exercises.map(({ number }) => number)) === '["363","364","365","366"]', exercises.map(({ number }) => number));
check('input: choice modes', JSON.stringify(views.map(({ mode }) => mode)) === JSON.stringify(expectedModes), views.map(({ mode }) => mode));
check('input: twenty options', views.reduce((n, view) => n + view.options.length, 0) === 20);
check('input: no choice figures', views.every((view) => view.figure_ids.length === 0 && view.options.every((option) => option.figure_ids.length === 0)));
check('input: no lesson/written figures', lesson.figures.length === 0 && exercises.every((exercise) => exercise.figures.length === 0 && exercise.figure_refs.length === 0));

let browser;
try {
  fs.mkdirSync(path.join(scratch, 'browser-runtime'), { recursive: true });
  browser = await chromium.launch({
    headless: false,
    downloadsPath: path.join(scratch, 'browser-runtime'),
    env: { ...process.env, TMPDIR: path.join(scratch, 'browser-runtime') },
    args: ['--disable-background-networking', '--disable-component-update', '--disable-domain-reliability', '--disable-sync', '--no-pings'],
  });
  evidence.browser.executable = chromium.executablePath();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    offline: true,
    serviceWorkers: 'block',
  });
  evidence.accounting.browserContextsCreated++;
  await context.route('**/*', async (route) => {
    const url = route.request().url();
    if (/^(file|data|about):/u.test(url)) await route.continue();
    else await route.abort('internetdisconnected');
  });
  context.on('request', (request) => {
    const entry = { url: request.url(), resourceType: request.resourceType() };
    evidence.network.requests.push(entry);
    if (!/^(file|data|about):/u.test(entry.url)) evidence.network.remoteAttempts.push(entry);
  });
  context.on('requestfailed', (request) => {
    evidence.network.failedRequests.push({ url: request.url(), error: request.failure()?.errorText });
  });
  context.on('response', (response) => {
    if (!/^(file|data|about):/u.test(response.url())) evidence.network.remoteResponses.push({ url: response.url(), status: response.status() });
  });
  const page = await context.newPage();
  evidence.accounting.browserPagesCreated++;
  evidence.accounting.initialAboutBlankDocuments++;
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') pageErrors.push(message.text());
  });
  const fragments = views.map((view) => ({
    mode: view.mode,
    stem: choiceHtml(view.stem),
    options: view.options.map((option) => ({ id: option.id, html: choiceHtml(option.text) })),
  }));
  const generated = await page.evaluate(({ html, title, fragments }) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const sheet = doc.querySelector('.sheet');
    if (!sheet || doc.querySelector('script')) throw new Error('Canonical document lacks sheet or has scripts');
    const sourceStyles = [...doc.querySelectorAll('style')].map((style) => style.textContent);
    const h1 = doc.createElement('h1');
    h1.textContent = title;
    sheet.replaceChildren(h1);
    doc.title = title;
    const fragment = (parent, markup) => {
      const range = doc.createRange();
      range.selectNodeContents(parent);
      parent.append(range.createContextualFragment(markup));
    };
    fragments.forEach((view, index) => {
      const section = doc.createElement('section');
      section.className = 'choice-question';
      section.setAttribute('aria-labelledby', `choice-title-${index + 1}`);
      const heading = doc.createElement('h2');
      heading.className = 'choice-title';
      heading.id = `choice-title-${index + 1}`;
      const number = doc.createElement('span');
      number.className = 'choice-number';
      number.textContent = `${index + 1}.`;
      const stem = doc.createElement('span');
      stem.className = 'choice-stem';
      fragment(stem, view.stem);
      heading.append(number, stem);
      section.append(heading);
      view.options.forEach((option) => {
        const label = doc.createElement('label');
        label.className = 'choice-option';
        const input = doc.createElement('input');
        input.type = view.mode === 'single' ? 'radio' : 'checkbox';
        input.name = `choice-${index + 1}`;
        input.id = `choice-${index + 1}-${option.id}`;
        input.value = option.id;
        const id = doc.createElement('span');
        id.className = 'choice-id';
        id.textContent = `${option.id}.`;
        const text = doc.createElement('span');
        text.className = 'choice-text';
        fragment(text, option.html);
        label.append(input, id, text);
        section.append(label);
      });
      sheet.append(section);
    });
    // Reuse the canonical no-break math scroller without changing production fragments.
    sheet.querySelectorAll('.sr-nb').forEach((element) => element.classList.add('nb'));
    const style = doc.createElement('style');
    style.id = 'offline-choice-layout';
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
    const media = [...doc.querySelectorAll('img,svg')].filter((element) => !element.closest('.katex'));
    if (media.length) throw new Error('Non-mathematical image in choices');
    return { html: '<!DOCTYPE html>\n' + doc.documentElement.outerHTML, sourceStyles, appendedStyle: style.textContent };
  }, { html: inputBytes.text.toString('utf8'), title: lesson.printed_title, fragments });
  evidence.accounting.detachedCanonicalDocumentParses++;
  evidence.accounting.learnerFragmentParses += views.reduce((n, view) => n + 1 + view.options.length, 0);
  const choicePath = path.join(scratch, 'choices.html');
  fs.writeFileSync(choicePath, generated.html, { flag: 'wx' });
  evidence.choices = { path: choicePath, bytes: Buffer.byteLength(generated.html), sha256: sha(generated.html), projection: 'Only draft.questions[].view; local sequential control identifiers' };
  evidence.styleReuse = {
    method: 'Detached browser DOMParser; retained canonical style elements unchanged; replaced sheet children',
    canonicalStyles: generated.sourceStyles.map((text) => ({ bytes: Buffer.byteLength(text), sha256: sha(text) })),
    appendedStyle: { bytes: Buffer.byteLength(generated.appendedStyle), sha256: sha(generated.appendedStyle) },
  };

  for (const [viewportName, viewport] of [
    ['desktop', { width: 1440, height: 960 }],
    ['mobile', { width: 390, height: 844 }],
  ]) {
    await page.setViewportSize(viewport);
    for (const [viewName, file] of [['text', inputFiles.text], ['written', inputFiles.written], ['choice', choicePath]]) {
      const id = `${viewportName}-${viewName}`;
      const entry = { id, viewport, file, errors: [], screenshot: { path: path.join(scratch, `${id}.png`), fullPage: true } };
      evidence.views.push(entry);
      try {
        evidence.accounting.targetNavigations++;
        await page.goto(pathToFileURL(file).href, { waitUntil: 'load', timeout: 30000 });
        await page.locator('.sheet').waitFor({ state: 'visible' });
        await page.evaluate(async () => { await document.fonts.ready; });
        entry.dom = await page.evaluate(() => {
          const logical = (element) => {
            const clone = element.cloneNode(true);
            clone.querySelectorAll('.katex').forEach((math) => {
              math.replaceWith(document.createTextNode('$' + (math.querySelector('annotation[encoding="application/x-tex"]')?.textContent ?? 'MISSING') + '$'));
            });
            clone.querySelectorAll('br').forEach((br) => br.replaceWith(document.createTextNode('\n')));
            return clone.textContent.replace(/\s+/gu, ' ').trim();
          };
          const visible = (element) => {
            const rect = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
          };
          const rectOf = (element) => {
            const rect = element.getBoundingClientRect();
            return { x: rect.x, y: rect.y, width: rect.width, height: rect.height, right: rect.right, bottom: rect.bottom };
          };
          const overlaps = [];
          const ordered = (elements, label) => {
            elements.forEach((element, index) => {
              if (!visible(element)) overlaps.push({ label, index, issue: 'not visible' });
              if (index && elements[index - 1].getBoundingClientRect().bottom > element.getBoundingClientRect().top + 1)
                overlaps.push({ label, index, issue: 'sibling flow overlap' });
            });
          };
          ordered([...document.querySelectorAll('.sheet > *')], 'sheet');
          ordered([...document.querySelectorAll('li.ex')], 'written');
          ordered([...document.querySelectorAll('.choice-question')], 'questions');
          document.querySelectorAll('.choice-question').forEach((section, index) => {
            ordered([...section.children], `question-${index + 1}`);
          });
          document.querySelectorAll('li.ex,.choice-option,.choice-title').forEach((row, index) => {
            const children = [...row.children];
            for (let i = 1; i < children.length; i++) {
              const a = children[i - 1].getBoundingClientRect();
              const b = children[i].getBoundingClientRect();
              if (a.right > b.left + 1 && Math.min(a.bottom, b.bottom) > Math.max(a.top, b.top) + 1)
                overlaps.push({ label: row.className, index, issue: 'adjacent labels overlap' });
            }
          });
          const clipping = [];
          const walker = document.createTreeWalker(document.querySelector('.sheet'), NodeFilter.SHOW_TEXT);
          for (let node = walker.nextNode(); node; node = walker.nextNode()) {
            const parent = node.parentElement;
            if (!node.textContent.trim() || parent.closest('.katex,.nb,.sr-nb') || !visible(parent)) continue;
            const range = document.createRange();
            range.selectNodeContents(node);
            const container = parent.closest('.choice-text,.choice-stem,.choice-id,.choice-number,.body,.no,p.para,h1,.crumb,.jump') ?? parent;
            const box = container.getBoundingClientRect();
            for (const rect of range.getClientRects()) {
              if (rect.left < box.left - 1 || rect.right > box.right + 1)
                clipping.push({ parent: container.className || container.tagName, text: node.textContent.slice(0, 60), rect: { left: rect.left, right: rect.right }, box: { left: box.left, right: box.right } });
            }
          }
          const math = [...document.querySelectorAll('.katex')];
          const mathProblems = math.flatMap((element, index) => {
            const html = element.querySelector('.katex-html');
            const annotation = element.querySelector('annotation[encoding="application/x-tex"]');
            return !html || !visible(html) || !annotation?.textContent ? [{ index, issue: 'missing/nonvisible math render or annotation' }] : [];
          });
          const mathFontUse = new Map();
          document.querySelectorAll('.katex-html,.katex-html *').forEach((element) => {
            if (!visible(element)) return;
            const css = getComputedStyle(element);
            const family = css.fontFamily.split(',')[0].replace(/["']/gu, '').trim();
            if (family.startsWith('KaTeX_')) {
              const spec = `${css.fontStyle} ${css.fontWeight} ${css.fontSize} "${family}"`;
              mathFontUse.set(spec, {
                spec,
                available: document.fonts.check(spec),
                loadedMatchingFaces: [...document.fonts].filter((face) => face.family.replace(/["']/gu, '') === family && face.status === 'loaded').length,
              });
            }
          });
          const styles = [...document.querySelectorAll('style')];
          const fontRules = [...document.styleSheets].flatMap((sheet) => [...sheet.cssRules]).filter((rule) => rule.type === CSSRule.FONT_FACE_RULE);
          const remoteCSS = [...document.styleSheets].flatMap((sheet) => [...sheet.cssRules]).filter((rule) =>
            rule.type === CSSRule.IMPORT_RULE || /url\(\s*["']?(?:https?:|\/\/)/iu.test(rule.cssText));
          const paragraphs = [...document.querySelectorAll('p.para')];
          const last = document.querySelector('.sheet').lastElementChild;
          window.scrollTo(0, document.documentElement.scrollHeight);
          const endRect = last.getBoundingClientRect();
          const reachedEnd = endRect.bottom <= innerHeight + 1 && endRect.top >= -1;
          const endPosition = { scrollY, maxScrollY: document.documentElement.scrollHeight - innerHeight, last: rectOf(last), reachedEnd };
          window.scrollTo(0, 0);
          return {
            url: location.href,
            title: document.title,
            heading: document.querySelector('h1')?.textContent,
            reachedContent: visible(document.querySelector('.sheet')) && document.querySelector('.sheet').innerText.trim().length > 100,
            prose: paragraphs.map((element) => ({ text: logical(element), section: element.classList.contains('section'), rect: rectOf(element) })),
            boundaries: paragraphs.flatMap((element, index) => element.classList.contains('section') ? [{
              index, before: logical(paragraphs[index - 1]), after: logical(element),
              borderTopWidth: getComputedStyle(element).borderTopWidth,
              gap: element.getBoundingClientRect().top - paragraphs[index - 1].getBoundingClientRect().bottom,
            }] : []),
            written: [...document.querySelectorAll('li.ex')].map((element) => ({
              id: element.id,
              number: element.querySelector('.no')?.textContent,
              text: logical(element.querySelector('.body')),
              visible: visible(element),
            })),
            choices: [...document.querySelectorAll('.choice-question')].map((section) => ({
              number: section.querySelector('.choice-number')?.textContent,
              stem: logical(section.querySelector('.choice-stem')),
              options: [...section.querySelectorAll('.choice-option')].map((label) => ({
                id: label.querySelector('.choice-id')?.textContent,
                text: logical(label.querySelector('.choice-text')),
                type: label.querySelector('input')?.type,
                name: label.querySelector('input')?.name,
                visible: visible(label) && visible(label.querySelector('input')),
                checked: label.querySelector('input')?.checked,
              })),
            })),
            mathCount: math.length,
            formulaErrorCount: document.querySelectorAll('.katex-error,.sr-tex-err,.err').length,
            mathProblems,
            figures: [...document.querySelectorAll('img,svg,.fig,.figure-media,[data-figure-id]')].filter((element) => !element.closest('.katex')).length,
            fonts: {
              ready: document.fonts.status,
              embeddedFontFaces: fontRules.length,
              allFontFacesInline: fontRules.every((rule) => /url\(["']?data:/u.test(rule.style.getPropertyValue('src'))),
              loadedFaces: [...document.fonts].filter((face) => face.status === 'loaded').map((face) => ({ family: face.family, style: face.style, weight: face.weight })),
              used: [...mathFontUse.values()],
              proseFamily: getComputedStyle(document.body).fontFamily,
            },
            styleTexts: styles.map((style) => style.textContent),
            remoteCSSCount: remoteCSS.length,
            remoteResourceTimings: performance.getEntriesByType('resource').filter((entry) => /^https?:/u.test(entry.name)).map((entry) => entry.name),
            pageWidth: innerWidth,
            documentWidth: document.documentElement.scrollWidth,
            bodyWidth: document.body.scrollWidth,
            overlaps,
            clipping,
            endPosition,
            scriptCount: document.querySelectorAll('script').length,
            suspiciousHiddenOrCorrectness: [...document.querySelectorAll('.sheet *')].flatMap((element) => {
              const attrs = [...element.attributes].filter((attr) => /intent|coverage|source.?id|correct|answer.?key|solution/iu.test(attr.name + ' ' + attr.value));
              if (element.hasAttribute('hidden') || element.matches('input[type=hidden],template') || attrs.length)
                return [{ tag: element.tagName, attrs: attrs.map((attr) => [attr.name, attr.value]) }];
              return [];
            }),
            sheetTextLeak: /correct_(?:index|set)|answer[-_ ]?key|source_refs|coverage|self_review|"intent"\s*:|正确答案|答案解析/iu.test(document.querySelector('.sheet').textContent),
          };
        });
        const dom = entry.dom;
        dom.styleHashes = dom.styleTexts.map((text) => ({ bytes: Buffer.byteLength(text), sha256: sha(text) }));
        delete dom.styleTexts;
        check(`${id}: actual file content`, dom.reachedContent && dom.url === pathToFileURL(file).href, dom.url);
        check(`${id}: lesson heading`, dom.heading?.startsWith(lesson.printed_title), dom.heading);
        check(`${id}: nonerror math`, dom.formulaErrorCount === 0 && dom.mathProblems.length === 0, { errors: dom.formulaErrorCount, problems: dom.mathProblems });
        check(`${id}: no figures`, dom.figures === 0, dom.figures);
        check(`${id}: inline fonts resolved`, dom.fonts.ready === 'loaded' && dom.fonts.embeddedFontFaces > 0 && dom.fonts.allFontFacesInline && dom.fonts.used.length > 0 && dom.fonts.used.every((font) => font.available && font.loadedMatchingFaces > 0), dom.fonts);
        check(`${id}: zero page horizontal overflow`, dom.documentWidth <= viewport.width && dom.bodyWidth <= viewport.width, { doc: dom.documentWidth, body: dom.bodyWidth, viewport: viewport.width });
        check(`${id}: flow and labels do not overlap`, dom.overlaps.length === 0, dom.overlaps);
        check(`${id}: ordinary text fits`, dom.clipping.length === 0, dom.clipping);
        check(`${id}: content end reachable`, dom.endPosition.reachedEnd, dom.endPosition);
        check(`${id}: no remote dependency`, dom.remoteCSSCount === 0 && dom.remoteResourceTimings.length === 0, { css: dom.remoteCSSCount, timings: dom.remoteResourceTimings });
        if (viewName === 'text') {
          check(`${id}: nine rendered prose blocks`, dom.prose.length === 9, dom.prose.length);
          check(`${id}: prose preserved`, JSON.stringify(dom.prose.map(({ text }) => text)) === JSON.stringify(lesson.prose.map(({ text }) => norm(text))));
          check(`${id}: two correct adjacent boundaries`, dom.boundaries.length === 2 && dom.boundaries.every((boundary, index) =>
            boundary.before === norm(lesson.section_breaks[index].before)
            && boundary.after === norm(lesson.section_breaks[index].after)
            && parseFloat(boundary.borderTopWidth) > 0 && boundary.gap > 0), dom.boundaries);
          check(`${id}: expected formulas`, dom.mathCount === lesson.prose.reduce((n, block) => n + formulaCount(block.text), 0), dom.mathCount);
        }
        if (viewName === 'written') {
          check(`${id}: four numbered exercises`, JSON.stringify(dom.written.map(({ number }) => number)) === '["363.","364.","365.","366."]', dom.written);
          check(`${id}: written prose preserved`, JSON.stringify(dom.written.map(({ text }) => text)) === JSON.stringify(exercises.map(({ text }) => norm(text))));
          const shared = norm(exercises[0].text.split('\n')[0]);
          check(`${id}: shared request only 363-365`, dom.written.length === 4 && dom.written.slice(0, 3).every(({ text }) => text.startsWith(shared)) && !dom.written[3].text.includes(shared));
          check(`${id}: expected formulas`, dom.mathCount === exercises.reduce((n, exercise) => n + formulaCount(exercise.text), 0), dom.mathCount);
          check(`${id}: no input controls`, await page.locator('input,textarea,select,button').count() === 0);
        }
        if (viewName === 'choice') {
          check(`${id}: canonical style/font exact reuse`, JSON.stringify(dom.styleHashes.slice(0, -1)) === JSON.stringify(evidence.styleReuse.canonicalStyles));
          check(`${id}: five questions twenty options`, dom.choices.length === 5 && dom.choices.reduce((n, question) => n + question.options.length, 0) === 20);
          check(`${id}: native types and visible text`, dom.choices.length === views.length && dom.choices.every((question, index) =>
            question.number === `${index + 1}.` && question.stem === norm(views[index].stem)
            && question.options.length === 4 && question.options.every((option, optionIndex) =>
              option.visible && !option.checked && option.id === `${views[index].options[optionIndex].id}.`
              && option.text === norm(views[index].options[optionIndex].text)
              && option.type === (expectedModes[index] === 'single' ? 'radio' : 'checkbox'))), dom.choices);
          check(`${id}: expected formulas`, dom.mathCount === views.reduce((n, view) => n + formulaCount(view.stem) + view.options.reduce((sum, option) => sum + formulaCount(option.text), 0), 0), dom.mathCount);
          check(`${id}: no author payload or hidden correctness`, dom.scriptCount === 0 && dom.suspiciousHiddenOrCorrectness.length === 0 && !dom.sheetTextLeak, dom.suspiciousHiddenOrCorrectness);
          entry.interactions = [];
          for (let index = 0; index < views.length; index++) {
            const controls = page.locator('.choice-question').nth(index).locator('input');
            await controls.nth(0).check();
            await controls.nth(1).check();
            const afterTwo = await controls.evaluateAll((inputs) => inputs.map((input) => input.checked));
            const expected = expectedModes[index] === 'single' ? [false, true, false, false] : [true, true, false, false];
            check(`${id}: native selection ${index + 1}`, JSON.stringify(afterTwo) === JSON.stringify(expected), afterTwo);
            let afterUncheck = null;
            if (expectedModes[index] === 'multiple') {
              await controls.nth(0).uncheck();
              afterUncheck = await controls.evaluateAll((inputs) => inputs.map((input) => input.checked));
              check(`${id}: independent checkbox ${index + 1}`, JSON.stringify(afterUncheck) === '[false,true,false,false]', afterUncheck);
            }
            entry.interactions.push({ question: index + 1, type: expectedModes[index], afterTwo, afterUncheck });
          }
          // Restore neutral presentation only, after recording actual native interactions.
          await page.locator('input').evaluateAll((inputs) => inputs.forEach((input) => { input.checked = false; input.blur(); }));
          check(`${id}: no selection/correctness marker in saved HTML`, !/\bchecked(?:\s|=|>)/iu.test(generated.html) && !/\b(?:correct_(?:index|set)|answer[-_]key|source_refs)\b/iu.test(generated.html));
        }
        entry.innerScrollers = await page.evaluate(({ screenshotAtRight }) => {
          return [...document.querySelectorAll('.nb')].filter((element) => element.scrollWidth > element.clientWidth + 1).map((element, index) => {
            const html = element.querySelector('.katex-html');
            const leaves = [...html.querySelectorAll('*')].filter((child) => child.children.length === 0 && child.textContent.trim());
            const first = leaves[0], last = leaves.at(-1);
            const inHorizontalBox = (child) => {
              const box = element.getBoundingClientRect(), rect = child.getBoundingClientRect();
              return rect.left >= box.left - 1 && rect.right <= box.right + 1;
            };
            element.scrollLeft = 0;
            const left = { scrollLeft: element.scrollLeft, first: first?.textContent, reachable: !!first && inHorizontalBox(first) };
            element.scrollLeft = element.scrollWidth;
            const right = { scrollLeft: element.scrollLeft, last: last?.textContent, reachable: !!last && inHorizontalBox(last) };
            const overflowX = getComputedStyle(element).overflowX;
            const width = { client: element.clientWidth, scroll: element.scrollWidth };
            element.scrollLeft = screenshotAtRight ? element.scrollWidth : 0;
            return { index, overflowX, width, left, right, screenshotAt: screenshotAtRight ? 'right' : 'left' };
          });
        }, { screenshotAtRight: viewportName === 'mobile' && viewName === 'text' });
        check(`${id}: permitted math scroller both ends reachable`, entry.innerScrollers.every((scroller) =>
          ['auto', 'scroll'].includes(scroller.overflowX) && scroller.left.reachable && scroller.right.reachable), entry.innerScrollers);
      } catch (error) {
        entry.errors.push(error.message);
        failures.push({ name: `${id}: execution`, actual: error.message });
      } finally {
        try {
          await page.evaluate(() => { window.scrollTo(0, 0); });
          await page.screenshot({ path: entry.screenshot.path, fullPage: true, timeout: 30000 });
          evidence.accounting.screenshotsCaptured++;
          entry.screenshot.captured = true;
        } catch (error) {
          entry.screenshot.captured = false;
          failures.push({ name: `${id}: screenshot`, actual: error.message });
        }
      }
      console.log(JSON.stringify({
        view: id, formulas: entry.dom?.mathCount, prose: entry.dom?.prose.length,
        written: entry.dom?.written.length, choices: entry.dom?.choices.length,
        innerScrollers: entry.innerScrollers?.length, screenshot: entry.screenshot.path,
        failures: failures.filter(({ name }) => name.startsWith(id)),
      }));
    }
  }
  evidence.browser.pageErrors = pageErrors;
  check('browser: no page errors', pageErrors.length === 0, pageErrors);
  check('network: zero remote dependency/attempt/response', evidence.network.remoteAttempts.length === 0 && evidence.network.remoteResponses.length === 0, evidence.network);
  check('screenshots: exactly six', evidence.accounting.screenshotsCaptured === 6, evidence.accounting.screenshotsCaptured);
  check('loads: exactly six target navigations no reload', evidence.accounting.targetNavigations === 6 && evidence.accounting.targetReloads === 0, evidence.accounting);
  await context.close();
} catch (error) {
  failures.push({ name: 'stage execution', actual: error.message });
} finally {
  if (browser) await browser.close();
  for (const [name, file] of Object.entries(inputFiles)) {
    const current = fs.readFileSync(file);
    check(`binding: ${name} unchanged during stage`, sha(current) === bindings[name].sha256, { bytes: current.length, sha256: sha(current) });
  }
  evidence.ended = new Date().toISOString();
  evidence.network.dependencyCount = evidence.network.remoteAttempts.length
    + evidence.views.reduce((count, view) => count + (view.dom?.remoteCSSCount ?? 0), 0);
  evidence.assertionVerdict = failures.length ? 'FAIL' : 'PASS';
  evidence.visualVerdict = 'PENDING actual post-stage image tool inspection; metadata is not visual approval';
  evidence.charge = {
    scriptRuns: 1, imageBatchCaptures: evidence.accounting.screenshotsCaptured,
    imageViews: 0, batchViewsLimit: 8, contextLimit: 24,
    networkModelPaidCalls: 0, monetary: 0, unit: 'USD',
  };
  writeJson('evidence.json', evidence);
  console.log(JSON.stringify({ assertionVerdict: evidence.assertionVerdict, failureCount: failures.length, evidence: path.join(scratch, 'evidence.json'), charge: evidence.charge }));
  process.exitCode = failures.length ? 1 : 0;
}

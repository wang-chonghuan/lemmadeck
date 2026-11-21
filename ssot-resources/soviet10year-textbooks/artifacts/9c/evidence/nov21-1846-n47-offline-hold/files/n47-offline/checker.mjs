import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from '../../../app/node_modules/playwright/index.mjs';

const ROOT = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), ROOT);
const OUT = path.join(ROOT, '.tmp/stemrobin-184-six/n47-offline');
const PREVIEW = path.join(ROOT, '.tmp/stemrobin-184-six/n47-preview');
const MODERN = path.join(ROOT,
  'ssot-resources/soviet10year-textbooks/artifacts/9c/editions/modern-us-neutral/lessons/ana9-c4-s2-n47');
const evidencePath = path.join(OUT, 'browser-evidence-first.json');
assert(!fs.existsSync(evidencePath), 'First gate may not be replayed.');
fs.mkdirSync(path.join(OUT, 'captures'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const relative = file => path.relative(ROOT, file);
const evidence = {
  schema: 'stemrobin1846/n47-offline-browser-first@1',
  started: new Date().toISOString(), cwd: ROOT,
  scope: 'Offline file previews only. Not live app, server judging, keyboard, DB, publication, mathematical re-review or strict full-source approval.',
  reads: [], bindings: [], assertions: [], views: [], nativeClicks: [],
  requests: [], errors: [], launchAttempts: [], screenshots: [],
  cleanup: { browserClosed: false, contextsClosed: [] },
  accounting: {
    browserTransactions: 0, screenshotCreations: 0, actualImageToolViews: 0,
    plannedContextImages: 6, maxContextImages: 8,
    reserveImages: '2 only after parent clarification of a concrete affected defect',
    manualPNGOrPillowDecodesOrOpens: 0, parentImagesOrDecodes: 0,
    hiddenBrowserImageInternals: 'UNKNOWN',
  },
};
function read(file, purpose, parse = false) {
  const bytes = fs.readFileSync(file);
  const binding = { path: relative(file), bytes: bytes.length, sha256: hash(bytes) };
  evidence.reads.push({ ...binding, purpose });
  evidence.bindings.push(binding);
  return parse ? JSON.parse(bytes.toString('utf8')) : bytes;
}
function check(id, passed, actual, classification = 'assertion') {
  const item = { id, passed: Boolean(passed), actual, classification };
  evidence.assertions.push(item);
  if (!item.passed) console.error(JSON.stringify({ failure: item }));
  return item.passed;
}
const manifest = read(path.join(PREVIEW, 'manifest.json'), 'Preview bindings, not its claimed verdict', true);
const lesson = read(path.join(MODERN, 'lesson.json'), 'Top-level final prose only; embedded historical source ignored', true);
const exercises = read(path.join(MODERN, 'exercises.json'), 'Top-level final written text only; embedded historical source ignored', true);
const answers = read(path.join(MODERN, 'answer-keys.json'), 'DisplayAnswer rendering preservation only; no semantic solving or grading', true);
read(path.join(MODERN, 'interactions.json'), 'Hash binding only');
read(path.join(ROOT, '.tmp/stemrobin-184-six/n47-preview.mjs'), 'Projection and local navigation construction');
for (const binding of manifest.inputs) {
  const file = path.resolve(ROOT, binding.path);
  assert(file.startsWith(MODERN + path.sep));
  const bytes = read(file, binding.path.includes('/choice-set/')
    ? 'Hash only, no JSON parse or choice semantics' : 'Manifest binding only');
  check(`binding:${binding.path}`, bytes.length === binding.bytes && hash(bytes) === binding.sha256,
    { expected: binding, actual: { bytes: bytes.length, sha256: hash(bytes) } });
}
const previewBytes = {};
for (const name of ['text', 'written', 'choices']) {
  const file = path.join(PREVIEW, `${name}.html`);
  previewBytes[name] = read(file, 'Authorized first browser input');
  const binding = manifest.files.find(item => item.path === relative(file));
  check(`preview-binding:${name}`, binding && hash(previewBytes[name]) === binding.sha256
    && previewBytes[name].length === binding.bytes, { binding, sha256: hash(previewBytes[name]) });
}
// Use the official fragment renderer for preservation, never derive answers.
const tool = path.join(ROOT, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js');
read(tool, 'Official preservation helper code');
const { inline, proseInline } = createRequire(import.meta.url)(tool);
const expected = {
  prose: lesson.prose.filter(item => item.kind === 'p').map(item => ({
    text: item.text, html: proseInline(item.text),
  })),
  exercises: exercises.exercises.map(item => ({
    number: item.number, text: item.text,
    html: inline(item.text.replace(new RegExp(`^\\s*${item.number}\\.\\s*`), '')),
  })),
  answers: answers.answers.map(item => ({
    exercise: item.exercise, text: item.displayAnswer, html: inline(item.displayAnswer),
    paragraphs: item.displayAnswer.split(/\n{2,}/).map(text => ({
      text, html: inline(text),
    })),
  })),
};
check('derived-final-content-counts',
  expected.prose.length === 6 && expected.exercises.length === 4 && expected.answers.length === 4,
  { prose: expected.prose.length, written: expected.exercises.map(x => x.number),
    answers: expected.answers.map(x => x.exercise) });

async function ready(page, name) {
  await page.waitForLoadState('load');
  await page.evaluate(async () => {
    await document.fonts.ready;
    const used = new Map();
    for (const el of document.querySelectorAll('.katex-html span,.katex,.prose-math,.sr-prose-math')) {
      const style = getComputedStyle(el);
      const family = style.fontFamily.split(',')[0].replaceAll('"', '');
      if (family.startsWith('KaTeX_')) {
        const spec = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} "${family}"`;
        used.set(spec, el.textContent || 'x012');
      }
    }
    for (const [spec, sample] of used) await document.fonts.load(spec, sample);
    await document.fonts.ready;
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
  const result = await page.evaluate(() => {
    const faces = [...document.fonts].map(f => ({
      family: f.family, status: f.status, style: f.style, weight: f.weight,
    }));
    const used = [...document.querySelectorAll('.katex-html span,.katex,.prose-math,.sr-prose-math')]
      .map(el => {
        const s = getComputedStyle(el);
        const family = s.fontFamily.split(',')[0].replaceAll('"', '');
        return { family, style: s.fontStyle, weight: s.fontWeight,
          size: parseFloat(s.fontSize),
          ready: document.fonts.check(`${s.fontStyle} ${s.fontWeight} ${s.fontSize} "${family}"`, el.textContent || 'x012') };
      }).filter(x => x.family.startsWith('KaTeX_'));
    return { documentReady: document.readyState, fontsReady: document.fonts.status,
      loadedFaces: faces.filter(f => f.status === 'loaded'),
      usedFamilies: [...new Set(used.map(x => x.family))],
      failedUsedFonts: used.filter(x => !x.ready),
      bodyFont: getComputedStyle(document.body).fontFamily,
      bodySize: parseFloat(getComputedStyle(document.body).fontSize),
      title: document.title, katexCount: document.querySelectorAll('.katex').length };
  });
  check(`${name}:dom-font-ready`, result.documentReady === 'complete'
    && result.fontsReady === 'loaded' && result.katexCount > 0 && !result.failedUsedFonts.length
    && result.loadedFaces.some(x => x.family.replaceAll('"', '') === 'KaTeX_Main'),
  result);
  return result;
}

async function preserveContent(page, name, kind) {
  const result = await page.evaluate(({ expected, kind }) => {
    const normalize = text => text.replace(/\s+/g, ' ').trim();
    const signature = root => {
      const clone = root.cloneNode(true);
      for (const math of clone.querySelectorAll('.katex')) {
        const tex = math.querySelector('annotation[encoding="application/x-tex"]')?.textContent;
        math.replaceWith(document.createTextNode(`$${tex ?? 'MISSING_TEX'}$`));
      }
      for (const br of clone.querySelectorAll('br')) br.replaceWith(document.createTextNode('\n'));
      return normalize(clone.textContent);
    };
    const expectedSignature = html => {
      const div = document.createElement('div');
      div.innerHTML = html;
      return signature(div);
    };
    const compare = (el, item) => ({
      present: Boolean(el), expected: expectedSignature(item.html),
      actual: el ? signature(el) : null,
      matched: Boolean(el) && signature(el) === expectedSignature(item.html),
      tex: el ? [...el.querySelectorAll('annotation')].map(x => x.textContent) : [],
      breakCount: el?.querySelectorAll('br').length ?? null,
    });
    const allVisibleText = document.body.cloneNode(true);
    for (const el of allVisibleText.querySelectorAll('style,script,.katex-mathml')) el.remove();
    const result = {
      rawDollars: allVisibleText.textContent.includes('$'),
      errors: [...document.querySelectorAll('.katex-error,.err,.sr-tex-err')]
        .map(x => ({ text: x.textContent, title: x.getAttribute('title') })),
      rawTexLeak: /\\(?:frac|Delta|lim|mathbb|ne)\b/.test(allVisibleText.textContent),
    };
    if (kind === 'text') {
      const blocks = [...document.querySelectorAll('p.para')];
      result.count = blocks.length;
      result.blocks = expected.prose.map((item, i) => ({ index: i, ...compare(blocks[i], item) }));
    }
    if (kind === 'written') {
      result.writtenIds = [...document.querySelectorAll('li.ex')].map(x => x.id);
      result.written = expected.exercises.map(item => {
        const row = document.getElementById(`ex-${item.number}`);
        return { number: item.number, numberLabel: row?.querySelector('.no')?.textContent.trim(),
          ...compare(row?.querySelector('.body'), item) };
      });
      result.answerIds = [...document.querySelectorAll('[data-answer-exercise]')]
        .map(x => x.dataset.answerExercise);
      result.answers = expected.answers.map(item => {
        const section = document.querySelector(`[data-answer-exercise="${item.exercise}"]`);
        const body = section?.querySelector(':scope > div');
        const parts = [];
        if (body) {
          let group = document.createElement('div');
          let consecutiveBreak = false;
          for (const child of body.childNodes) {
            if (child.nodeName === 'BR' && consecutiveBreak) {
              parts.push(group); group = document.createElement('div'); consecutiveBreak = false;
            } else {
              if (child.nodeName === 'BR') consecutiveBreak = true;
              else consecutiveBreak = false;
              group.append(child.cloneNode(true));
            }
          }
          parts.push(group);
        }
        return { exercise: item.exercise, ...compare(body, item),
          expectedBreakCount: (item.text.match(/\n/g) || []).length,
          paragraphs: item.paragraphs.map((p, i) => ({ index: i, ...compare(parts[i], p) })),
          actualParagraphCount: parts.length };
      });
    }
    if (kind === 'choices') {
      result.questions = [...document.querySelectorAll('[data-question-id]')].map(q => ({
        id: q.dataset.questionId, mode: q.dataset.mode,
        stemPresent: Boolean(q.querySelector('h2')?.textContent.trim()),
        options: [...q.querySelectorAll('[data-option-id]')].map(o => ({
          id: o.dataset.optionId, type: o.querySelector('input')?.type,
          name: o.querySelector('input')?.name,
          label: o.querySelector('input')?.getAttribute('aria-label'),
          textPresent: Boolean(o.querySelector('.option-text')?.textContent.trim()),
        })),
      }));
      result.projection = {
        scriptCount: document.scripts.length,
        templateCount: document.querySelectorAll('template').length,
        hiddenPayloadCount: document.querySelectorAll('[hidden],input[type=hidden]').length,
        inlineHandlers: [...document.querySelectorAll('*')].flatMap(el =>
          [...el.attributes].filter(a => /^on/i.test(a.name)).map(a => a.name)),
        dataAttributes: [...new Set([...document.querySelectorAll('*')].flatMap(el =>
          [...el.attributes].filter(a => a.name.startsWith('data-')).map(a => a.name)))],
        disallowedPayloadAttributes: [...document.querySelectorAll('*')].flatMap(el =>
          [...el.attributes].filter(a => /answer|rationale|correct|source|intent|review|key/i.test(a.name))
            .map(a => ({ element: el.tagName, attribute: a.name }))),
        nonViewPayloadText: /"(?:answer|rationale|correct|source|intent|review|key)"\s*:/
          .test(document.body.textContent),
      };
    }
    return result;
  }, { expected, kind });
  check(`${name}:no-raw-math-errors`, !result.rawDollars && !result.errors.length
    && !result.rawTexLeak, { rawDollars: result.rawDollars, errors: result.errors,
    rawTexLeak: result.rawTexLeak }, 'content');
  if (kind === 'text') {
    check(`${name}:all-derived-prose-blocks`, result.count === expected.prose.length
      && result.blocks.every(x => x.matched), result, 'content');
  }
  if (kind === 'written') {
    check(`${name}:all-derived-written-exercises`,
      result.writtenIds.length === expected.exercises.length
      && result.written.every(x => x.matched && x.numberLabel === `${x.number}.`),
    result.written, 'content');
    check(`${name}:all-derived-display-answers`,
      result.answerIds.length === expected.answers.length
      && result.answers.every(x => x.matched && x.breakCount === x.expectedBreakCount
        && x.actualParagraphCount === x.paragraphs.length && x.paragraphs.every(p => p.matched)),
    result.answers, 'content');
    const answer381 = result.answers.find(x => x.exercise === '381');
    check(`${name}:381-conditional-zero-empty-domain-paragraphs`,
      answer381?.paragraphs.length === 3 && answer381.paragraphs.every(x => x.matched),
    answer381, 'content');
  }
  if (kind === 'choices') {
    const ids = result.questions.map(x => x.id);
    const count = result.questions.reduce((sum, x) => sum + x.options.length, 0);
    check(`${name}:derived-native-choice-inventory`,
      ids.length === 4 && new Set(ids).size === ids.length && count === 16
      && result.questions.every(q => q.mode === 'single' && q.stemPresent
        && new Set(q.options.map(o => o.id)).size === q.options.length
        && q.options.every(o => o.type === 'radio' && o.name === q.id
          && o.label === o.id && o.textPresent)),
    { questions: result.questions, optionCount: count });
    const p = result.projection;
    check(`${name}:view-id-only-no-internal-payload`,
      !p.scriptCount && !p.templateCount && !p.hiddenPayloadCount
      && !p.inlineHandlers.length && !p.disallowedPayloadAttributes.length
      && !p.nonViewPayloadText && p.dataAttributes.every(x =>
        ['data-question-id', 'data-mode', 'data-option-id'].includes(x)),
    p);
  }
  return result;
}

async function geometry(page, name) {
  const result = await page.evaluate(() => {
    const rect = el => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height,
        right: r.right, bottom: r.bottom };
    };
    const meaningful = el => {
      const s = getComputedStyle(el), r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && s.visibility === 'visible' && s.display !== 'none';
    };
    const overlap = (a, b) => Math.min(a.right, b.right) - Math.max(a.x, b.x) > 1
      && Math.min(a.bottom, b.bottom) - Math.max(a.y, b.y) > 1;
    const collisions = [];
    for (const selector of ['p.para', 'li.ex', '.standard-answer', '.preview-question', '.preview-option', '.sheet']) {
      const list = [...document.querySelectorAll(selector)];
      for (let i = 1; i < list.length; i++) {
        if (overlap(rect(list[i - 1]), rect(list[i]))) {
          collisions.push({ selector, a: i - 1, b: i, rectA: rect(list[i - 1]), rectB: rect(list[i]) });
        }
      }
    }
    for (const section of document.querySelectorAll('.standard-answer,.preview-question')) {
      const heading = section.querySelector(':scope > h2');
      const next = heading?.nextElementSibling;
      if (heading && next && overlap(rect(heading), rect(next))) {
        collisions.push({ type: 'heading-next', id: section.dataset, a: rect(heading), b: rect(next) });
      }
    }
    for (const option of document.querySelectorAll('.preview-option')) {
      const input = option.querySelector('input'), text = option.querySelector('.option-text');
      if (input && text && overlap(rect(input), rect(text))) {
        collisions.push({ type: 'control-text', id: option.dataset.optionId });
      }
    }
    const indentation = [...document.querySelectorAll('p.para,li.ex .body,.standard-answer > div,.preview-question h2,.option-text')]
      .map((el, index) => ({ index, selector: el.className, textIndent: getComputedStyle(el).textIndent }));
    const proseScale = [...document.querySelectorAll('.prose-math,.sr-prose-math')].map(el => ({
      text: el.textContent, size: parseFloat(getComputedStyle(el).fontSize),
      parentSize: parseFloat(getComputedStyle(el.closest('p.para') || el.parentElement).fontSize),
      family: getComputedStyle(el).fontFamily,
    }));
    const latinNumericRuns = [];
    const clipping = [];
    const rawOverflow = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let text;
    while ((text = walker.nextNode())) {
      const parent = text.parentElement;
      if (!text.textContent.trim() || !parent || parent.closest('style,script,.katex-mathml')
        || !meaningful(parent)) continue;
      if (!parent.closest('.katex') && /[A-Za-z0-9]/.test(text.textContent)) {
        const s = getComputedStyle(parent);
        latinNumericRuns.push({ text: text.textContent.trim(), size: parseFloat(s.fontSize),
          family: s.fontFamily, proseClass: parent.className });
      }
      const range = document.createRange();
      range.selectNodeContents(text);
      for (const r of range.getClientRects()) {
        let localX = false;
        for (let ancestor = parent; ancestor && ancestor !== document.documentElement; ancestor = ancestor.parentElement) {
          const s = getComputedStyle(ancestor), ar = ancestor.getBoundingClientRect();
          if (['auto', 'scroll'].includes(s.overflowX) && ancestor.scrollWidth > ancestor.clientWidth + 1) localX = true;
          if (['hidden', 'clip', 'auto', 'scroll'].includes(s.overflowX) && ar.width > 0
            && !localX && (r.left < ar.left - 2 || r.right > ar.right + 2)) {
            clipping.push({ axis: 'x', text: text.textContent, ancestor: ancestor.className,
              range: { left: r.left, right: r.right }, box: { left: ar.left, right: ar.right } });
          }
          if (['hidden', 'clip', 'auto', 'scroll'].includes(s.overflowY) && ar.height > 0
            && (r.top < ar.top - 2 || r.bottom > ar.bottom + 2)) {
            clipping.push({ axis: 'y', text: text.textContent, ancestor: ancestor.className,
              range: { top: r.top, bottom: r.bottom }, box: { top: ar.top, bottom: ar.bottom } });
          }
        }
        if (!localX && (r.left < -2 || r.right > innerWidth + 2)) {
          rawOverflow.push({ text: text.textContent, left: r.left, right: r.right });
        }
      }
    }
    return { viewport: { width: innerWidth, height: innerHeight },
      document: { clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        bodyScrollWidth: document.body.scrollWidth, height: document.documentElement.scrollHeight },
      collisions, indentation, proseScale, latinNumericRuns, clipping, rawOverflow };
  });
  check(`${name}:document-no-horizontal-overflow`, result.document.scrollWidth <= result.document.clientWidth + 1
    && result.document.bodyScrollWidth <= result.document.clientWidth + 1 && !result.rawOverflow.length,
  { document: result.document, rawOverflow: result.rawOverflow }, 'layout');
  check(`${name}:no-incoherent-flow-overlap`, !result.collisions.length, result.collisions, 'layout');
  check(`${name}:no-ink-clipping`, !result.clipping.length, result.clipping, 'layout');
  check(`${name}:paragraph-indentation-zero`, result.indentation.every(x => parseFloat(x.textIndent) === 0),
    result.indentation, 'layout');
  check(`${name}:numeric-latin-prose-font-scale`,
    result.proseScale.every(x => Math.abs(x.size / x.parentSize - 1.1) < .005 && x.family.includes('KaTeX_Main'))
    && result.latinNumericRuns.every(x => x.size >= 12),
  { proseScale: result.proseScale, latinNumericRuns: result.latinNumericRuns },
  'layout');
  return result;
}

async function scrollEndpoints(page, name) {
  const result = await page.evaluate(async () => {
    const scrollers = [...document.querySelectorAll('.nb,.sr-nb,li.ex .body,.option-text')]
      .filter(el => el.scrollWidth > el.clientWidth + 1
        && ['auto', 'scroll'].includes(getComputedStyle(el).overflowX));
    const results = [];
    const frame = () => new Promise(resolve => requestAnimationFrame(resolve));
    for (const [index, el] of scrollers.entries()) {
      const masked = [];
      for (let p = el; p; p = p.parentElement) {
        const s = getComputedStyle(p);
        if ((s.maskImage && s.maskImage !== 'none') || (s.clipPath && s.clipPath !== 'none')) masked.push(p.className);
      }
      el.scrollIntoView({ block: 'center', inline: 'nearest' });
      el.scrollLeft = 0;
      await frame();
      const inkRanges = () => {
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        const all = [];
        let n;
        while ((n = walker.nextNode())) {
          if (!n.textContent.trim() || n.parentElement.closest('.katex-mathml')) continue;
          const r = document.createRange(); r.selectNodeContents(n);
          for (const box of r.getClientRects()) if (box.width > .1 && box.height > .1) {
            all.push({ left: box.left, right: box.right, top: box.top, bottom: box.bottom, text: n.textContent });
          }
        }
        return all;
      };
      const hit = (range, endpoint) => {
        if (!range) return { reachable: false, reason: 'No visible ink range' };
        const r = el.getBoundingClientRect();
        const x = endpoint === 'left' ? Math.max(r.left + 2, range.left + 1)
          : Math.min(r.left + el.clientWidth - 2, range.right - 1);
        const y = Math.min(innerHeight - 2, Math.max(2, (range.top + range.bottom) / 2));
        const top = document.elementFromPoint(x, y);
        const reachable = endpoint === 'left' ? range.left >= r.left - 2
          : range.right <= r.left + el.clientWidth + 2;
        return { reachable, unmaskedHit: top === el || el.contains(top), point: { x, y },
          hitElement: top?.tagName, text: range.text,
          range: { left: range.left, right: range.right }, box: { left: r.left, right: r.left + el.clientWidth } };
      };
      const leftRanges = inkRanges();
      const first = leftRanges.reduce((a, b) => !a || b.left < a.left ? b : a, null);
      const left = hit(first, 'left');
      el.scrollLeft = el.scrollWidth - el.clientWidth;
      await frame();
      const rightRanges = inkRanges();
      const last = rightRanges.reduce((a, b) => !a || b.right > a.right ? b : a, null);
      const right = hit(last, 'right');
      const maxScroll = el.scrollWidth - el.clientWidth;
      const actualRightScroll = el.scrollLeft;
      el.scrollLeft = 0;
      await frame();
      results.push({ index, className: el.className, tex: [...el.querySelectorAll('annotation')].map(n => n.textContent),
        clientWidth: el.clientWidth, scrollWidth: el.scrollWidth, maxScroll, actualRightScroll,
        left, right, masked, resetLeft: el.scrollLeft,
        passed: !masked.length && left.reachable && left.unmaskedHit && right.reachable
          && right.unmaskedHit && Math.abs(actualRightScroll - maxScroll) <= 1 && el.scrollLeft === 0 });
    }
    window.scrollTo(0, 0);
    return results;
  });
  check(`${name}:local-scroll-both-endpoints-reachable-unmasked-reset-left`,
    result.every(x => x.passed), result, 'layout');
  return result;
}

async function choicesBehavior(page, name, inventory) {
  const state = () => page.evaluate(() => Object.fromEntries(
    [...document.querySelectorAll('[data-question-id]')].map(q => [
      q.dataset.questionId,
      [...q.querySelectorAll('[data-option-id]')].filter(o => o.querySelector('input').checked)
        .map(o => o.dataset.optionId),
    ])));
  const initial = await state();
  check(`${name}:initial-native-selection-empty`, Object.values(initial).every(x => !x.length), initial);
  for (const question of inventory.questions) {
    for (const option of question.options) {
      for (const action of ['select', 'repeat-click']) {
        const before = await state();
        const input = page.locator(`[data-question-id="${question.id}"] [data-option-id="${option.id}"] input`);
        const beforeEvents = await page.evaluate(() => window.__nativeOptionEvents.length);
        await input.click();
        const after = await state();
        const nativeEvent = await page.evaluate(i => window.__nativeOptionEvents.slice(i), beforeEvents);
        const item = { view: name, questionId: question.id, optionId: option.id, action,
          before, after, nativeEvents: nativeEvent,
          clickedAt: new Date().toISOString() };
        evidence.nativeClicks.push(item);
        check(`${name}:${question.id}:${option.id}:${action}:actual-exclusive-isolated`,
          after[question.id]?.length === 1 && after[question.id][0] === option.id
          && Object.keys(before).filter(id => id !== question.id)
            .every(id => JSON.stringify(before[id]) === JSON.stringify(after[id]))
          && nativeEvent.length === 1 && nativeEvent[0].isTrusted
          && nativeEvent[0].questionId === question.id && nativeEvent[0].optionId === option.id,
        item);
      }
    }
  }
  return { derivedQuestionIds: inventory.questions.map(q => q.id),
    derivedOptionCount: inventory.questions.reduce((sum, q) => sum + q.options.length, 0),
    actualClicks: evidence.nativeClicks.filter(x => x.view === name).length,
    finalSelection: await state() };
}

async function endVisible(page, name, kind) {
  const result = await page.evaluate(kind => {
    const root = kind === 'text' ? document.querySelector('.jump')
      : kind === 'written' ? [...document.querySelectorAll('.standard-answer > div')].at(-1)
        : [...document.querySelectorAll('.option-text')].at(-1);
    const walker = document.createTreeWalker(root || document.body, NodeFilter.SHOW_TEXT);
    let n, last;
    while ((n = walker.nextNode())) {
      if (n.textContent.trim() && !n.parentElement.closest('.katex-mathml,style,script')) last = n;
    }
    if (!last) return { visible: false, reason: 'Missing end content' };
    last.parentElement.scrollIntoView({ block: 'end', inline: 'nearest' });
    const range = document.createRange(); range.selectNodeContents(last);
    const r = [...range.getClientRects()].at(-1);
    const x = Math.max(2, Math.min(innerWidth - 2, (r.left + r.right) / 2));
    const y = Math.max(2, Math.min(innerHeight - 2, (r.top + r.bottom) / 2));
    const top = document.elementFromPoint(x, y);
    const visible = r.top >= -2 && r.bottom <= innerHeight + 2
      && (top === last.parentElement || root?.contains(top));
    const result = { visible, endText: last.textContent,
      rect: { x: r.x, y: r.y, width: r.width, height: r.height },
      viewport: { width: innerWidth, height: innerHeight }, scrollY,
      hit: top?.tagName };
    for (const el of document.querySelectorAll('.nb,.sr-nb,.body,.option-text')) el.scrollLeft = 0;
    window.scrollTo(0, 0);
    return result;
  }, kind);
  check(`${name}:actual-end-content-visible`, result.visible, result, 'layout');
  return result;
}

let browser;
try {
  try {
    browser = await chromium.launch({ headless: false, timeout: 30000 });
    evidence.launchAttempts.push({ mode: 'headed', succeeded: true });
    evidence.gui = { mode: 'headed', limitation: null };
  } catch (error) {
    evidence.launchAttempts.push({ mode: 'headed', succeeded: false, error: error.stack });
    if (!/display|xserver|x server|window server|gui|headed|cannot open/i.test(error.message)) throw error;
    evidence.gui = { mode: 'headless', limitation: error.message };
    browser = await chromium.launch({ headless: true, timeout: 30000 });
    evidence.launchAttempts.push({ mode: 'headless', succeeded: true });
  }
  evidence.accounting.browserTransactions = 1;
  evidence.browserVersion = browser.version();
  for (const viewport of [
    { id: 'desktop', width: 1440, height: 960, isMobile: false },
    { id: 'mobile', width: 390, height: 844, isMobile: true },
  ]) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      screen: { width: viewport.width, height: viewport.height },
      isMobile: viewport.isMobile, hasTouch: viewport.isMobile,
      deviceScaleFactor: 1, offline: true, serviceWorkers: 'block',
    });
    await context.route('**/*', route => {
      const url = route.request().url();
      const allowed = url.startsWith('data:') || url === 'about:blank'
        || (url.startsWith('file:') && ['text.html', 'written.html', 'choices.html']
          .some(file => fileURLToPath(url) === path.join(PREVIEW, file)));
      evidence.requests.push({ view: viewport.id, url, allowed, at: new Date().toISOString() });
      return allowed ? route.continue() : route.abort('blockedbyclient');
    });
    const page = await context.newPage();
    page.on('pageerror', error => evidence.errors.push({ view: viewport.id, type: 'pageerror', message: error.message }));
    page.on('console', message => {
      if (message.type() === 'error') evidence.errors.push({ view: viewport.id, type: 'console', message: message.text() });
    });
    await page.addInitScript(() => {
      window.__nativeOptionEvents = [];
      document.addEventListener('click', event => {
        const input = event.target;
        if (input instanceof HTMLInputElement && input.closest('[data-question-id]')) {
          window.__nativeOptionEvents.push({
            isTrusted: event.isTrusted, questionId: input.closest('[data-question-id]').dataset.questionId,
            optionId: input.closest('[data-option-id]').dataset.optionId, checked: input.checked,
          });
        }
      }, true);
    });
    try {
      for (const kind of ['text', 'written', 'choices']) {
        const name = `${viewport.id}-${kind}`;
        const url = pathToFileURL(path.join(PREVIEW, `${kind}.html`)).href;
        if (page.url() !== url) await page.goto(url);
        const fonts = await ready(page, name);
        const content = await preserveContent(page, name, kind);
        const layout = await geometry(page, name);
        const localScroll = await scrollEndpoints(page, name);
        const behavior = kind === 'choices' ? await choicesBehavior(page, name, content) : null;
        const end = await endVisible(page, name, kind);
        const screenshotPath = path.join(OUT, 'captures', `${name}.png`);
        assert(!fs.existsSync(screenshotPath));
        await page.screenshot({ path: screenshotPath, fullPage: true, animations: 'disabled' });
        evidence.accounting.screenshotCreations++;
        const bytes = fs.readFileSync(screenshotPath);
        const capture = { path: relative(screenshotPath), bytes: bytes.length, sha256: hash(bytes),
          view: name, viewport, fullPage: true,
          documentHeight: layout.document.height, imageViewed: false,
          note: 'PNG bytes hashed only; no explicit PNG decode/open.' };
        evidence.screenshots.push(capture);
        evidence.views.push({ name, fonts, content, layout, localScroll, behavior, end, capture });
        console.log(JSON.stringify({ captured: name, sha256: capture.sha256,
          nativeClicks: behavior?.actualClicks ?? 0,
          failuresSoFar: evidence.assertions.filter(x => !x.passed).length }));
        if (kind === 'text' || kind === 'written') {
          const expectedTarget = kind === 'text' ? 'written' : 'text';
          const link = page.locator('a.jump');
          const href = await link.getAttribute('href');
          await link.click();
          await page.waitForLoadState('load');
          check(`${name}:ordinary-static-link-navigation`,
            href === `${expectedTarget}.html`
            && page.url() === pathToFileURL(path.join(PREVIEW, `${expectedTarget}.html`)).href,
          { href, actualUrl: page.url(), expectedTarget });
        }
      }
    } finally {
      await context.close();
      evidence.cleanup.contextsClosed.push(viewport.id);
    }
  }
  check('all-six-first-screenshots-created', evidence.accounting.screenshotCreations === 6,
    evidence.screenshots.map(x => ({ view: x.view, path: x.path, sha256: x.sha256 })));
  check('no-remote-dependencies-or-page-errors',
    evidence.requests.every(x => x.allowed && !/^https?:/.test(x.url)) && !evidence.errors.length,
    { requests: evidence.requests, errors: evidence.errors });
} catch (error) {
  evidence.errors.push({ type: 'technical', message: error.message, stack: error.stack });
  check('checker-technical-completion', false, { message: error.message, stack: error.stack }, 'technical');
  console.error(error.stack);
} finally {
  if (browser) {
    try {
      await browser.close();
      evidence.cleanup.browserClosed = !browser.isConnected();
    } catch (error) {
      evidence.errors.push({ type: 'cleanup', message: error.message });
    }
  }
  evidence.ended = new Date().toISOString();
  evidence.nativeClickCount = evidence.nativeClicks.length;
  evidence.unresolvedFailures = evidence.assertions.filter(x => !x.passed);
  evidence.assertionVerdict = !evidence.unresolvedFailures.length
    && evidence.accounting.screenshotCreations === 6 && evidence.cleanup.browserClosed ? 'PASS' : 'FAIL';
  evidence.visualVerdict = 'PENDING_ACTUAL_SIX_IMAGE_OBSERVATIONS';
  fs.writeFileSync(evidencePath, JSON.stringify(evidence, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify({ assertionVerdict: evidence.assertionVerdict,
    visualVerdict: evidence.visualVerdict, actualNativeClicks: evidence.nativeClickCount,
    screenshotsCreated: evidence.accounting.screenshotCreations,
    browserClosed: evidence.cleanup.browserClosed,
    unresolvedFailures: evidence.unresolvedFailures.map(x => x.id) }));
  process.exitCode = evidence.assertionVerdict === 'PASS' ? 0 : 1;
}

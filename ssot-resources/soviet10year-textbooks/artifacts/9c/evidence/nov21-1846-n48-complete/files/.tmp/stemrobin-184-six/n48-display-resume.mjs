import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { choiceHtml } from '../../.claude/skills/ld-s10y-lesson/tools/choice_html.mjs';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const base = path.join(root, '.tmp/stemrobin-184-six');
const out = path.join(base, 'n48-display-resume');
assert(!fs.existsSync(out));
fs.mkdirSync(out);
const canonical = path.join(root,
  'ssot-resources/soviet10year-textbooks/artifacts/9c/editions/modern-us-neutral/lessons/ana9-c4-s2-n48');
const render = path.join(base, 'n48-resume-work/render/9c/modern-us-neutral/ana9-c4-s2-n48');
const evidence = path.join(root,
  'ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov21-1846-n48-visual-hold');
const retained = JSON.parse(fs.readFileSync(path.join(evidence, 'manifest.json'), 'utf8'));
const oldNative = retained.files.find(row => row.origin.endsWith('/n48-offline/report.json'));
const native = JSON.parse(fs.readFileSync(path.resolve(root, oldNative.path), 'utf8'));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.relative(root, file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const protectedFiles = ['lesson.json', 'exercises.json', 'figures.json',
  'answer-keys.json', 'answer-keys.audit.json', 'interactions.json',
  'choice-set/seed.json', 'choice-set/draft.json', 'choice-set/review.json']
  .map(name => bind(path.join(canonical, name)));
const draft = JSON.parse(fs.readFileSync(path.join(canonical, 'choice-set/draft.json'), 'utf8'));
assert.equal(bind(path.join(canonical, 'choice-set/draft.json')).sha256, native.bindings.draft.sha256);
assert.equal(draft.new_figures.length, 0);
const textPath = path.join(render, 'text.html');
const exercisesPath = path.join(render, 'exercises.html');
assert.equal(bind(textPath).sha256, native.bindings.text.sha256);
assert.equal(bind(exercisesPath).sha256, native.bindings.exercises.sha256);
const text = fs.readFileSync(textPath, 'utf8');
const css = text.match(/<style>([\s\S]*?)<\/style>/)?.[1];
assert(css);
const esc = value => String(value).replace(/[&<>"']/g, char =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const questions = draft.questions.map((question, index) => {
  const view = question.view;
  const type = view.mode === 'single' ? 'radio' : 'checkbox';
  return `<article class="question" data-question="${esc(question.id)}" data-mode="${esc(view.mode)}">
<h2>${index + 1}. ${view.mode === 'single' ? '单选' : '多选'}</h2>
<div class="stem">${choiceHtml(view.stem)}</div>
<fieldset>${view.options.map(option => `<label class="option" data-option="${esc(option.id)}">
<input type="${type}" name="${esc(question.id)}" value="${esc(option.id)}">
<span class="option-id">${esc(option.id)}</span>
<div class="option-text">${choiceHtml(option.text)}</div></label>`).join('')}</fieldset></article>`;
}).join('');
const choiceDocument = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>48. 有理分式函数的导数 · 选择题</title>
<style>${css}
body{margin:0;background:#fff;color:#252525;font-family:system-ui,sans-serif;font-size:16px;line-height:1.7;letter-spacing:0}
main{max-width:960px;margin:0 auto;padding:24px 20px}h1{font-size:24px;line-height:1.4;margin:0 0 24px}h2{font-size:16px;margin:0 0 12px;color:#176b61}
.question{border-top:1px solid #ddd;padding:20px 0}.stem{margin-bottom:16px}fieldset{border:0;padding:0;margin:0;min-width:0}
.option{display:grid;grid-template-columns:22px 24px minmax(0,1fr);gap:8px;padding:12px 8px;align-items:start;cursor:pointer}
.option:hover{background:#f5f8f7}.option:has(input:checked){background:#eef7f4}.option input{width:18px;height:18px;margin:5px 0 0;accent-color:#176b61}
.option-id{font-weight:600}.option-text,.stem{min-width:0;overflow-wrap:anywhere}.katex{max-width:100%;overflow-x:auto;overflow-y:hidden}
table{width:100%;border-collapse:collapse;font-size:15px}th,td{padding:8px;border:1px solid #d9d9d9;vertical-align:top}
a{color:#176b61}@media(max-width:600px){main{padding:18px 12px}h1{font-size:22px}.option{padding:12px 2px;gap:6px}}
</style></head><body><main><h1>48. 有理分式函数的导数</h1>${questions}
<a href="text.html">回课文</a></main></body></html>`;
assert.equal(crypto.createHash('sha256').update(choiceDocument).digest('hex'), native.bindings.choices.sha256);
const receipt = {
  schema: 'stemrobin1846/n48-affected-display-resume@1',
  status: 'CANDIDATE_AFFECTED_REVIEW_PENDING', oldHold: bind(path.join(evidence, 'manifest.json')),
  reusedNativeReport: bind(path.resolve(root, oldNative.path)),
  installation: bind(path.join(root, '.intentfold/tmp/repair-189-install/installed.json')),
  oldIgnoredMetadataAndDraftRecovered: false, missingRenderTechnicalStageRebuilt: true,
  rebuiltOriginalHtmlMatchesPriorNativeBindings: true,
  protectedFiles, outputs: [], changes: [], metadata: null,
  parentImageViewsOrDecodes: 0, completeLessonDelta: 0, strictCompliance: false,
  originalImages: 'Six successful views plus one failed no-image request preserved; hidden charges UNKNOWN',
};
const require = createRequire(path.join(root, 'app/package.json'));
const { chromium } = require('playwright');
let browser;
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.route('**/*', route => route.request().url().startsWith('data:') ? route.continue() : route.abort());
  const page = await context.newPage();
  await page.setContent(text, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  receipt.metadata = await page.evaluate(() => {
    const elements = [...document.querySelectorAll('p.para .nb')];
    const matches = elements.map((element, index) => ({
      index, tex: element.querySelector('annotation')?.textContent,
      clientWidth: element.clientWidth, scrollWidth: element.scrollWidth,
      overflowX: getComputedStyle(element).overflowX,
    })).filter(item => item.tex?.startsWith("(x^n)'=(x^{-m})'"));
    if (matches.length !== 1) throw new Error('Proof target is not unique');
    return { proof: matches[0], actualScrollEndTested: false, screenshots: 0 };
  });
  fs.copyFileSync(textPath, path.join(out, 'text.html'), fs.constants.COPYFILE_EXCL);
  for (const [surface, html] of [['exercises', fs.readFileSync(exercisesPath, 'utf8')], ['choices', choiceDocument]]) {
    await page.setContent(html, { waitUntil: 'load' });
    const change = await page.evaluate(surface => {
      const math = () => [...document.querySelectorAll('.katex')].map(element => element.outerHTML);
      const before = math();
      const changes = [];
      if (surface === 'exercises') {
        for (const number of ['382', '383', '384', '385']) {
          const row = document.getElementById(`ex-${number}`);
          if (row.querySelector('.no').textContent.trim() !== number + '.') throw new Error('Source label changed');
          const nodes = [...row.querySelector('.body').childNodes]
            .filter(node => node.nodeType === Node.TEXT_NODE && node.data === number + '. ');
          if (nodes.length !== 1) throw new Error(`Exact duplicate prefix missing for ${number}`);
          nodes[0].data = '';
          changes.push({ number, duplicatePresentationPrefixRemoved: true, sourceNumberRetained: true });
        }
      } else {
        for (const [question, option] of [['n48-q6', 'A'], ['n48-q8', 'A'], ['n48-q8', 'B']]) {
          const text = document.querySelector(`[data-question="${question}"] [data-option="${option}"] .option-text`);
          const ending = text.lastElementChild;
          if (!ending.classList.contains('sr-nb') || !ending.textContent.endsWith('。')) throw new Error('Expected existing punctuation wrapper');
          ending.dataset.n48Ending = '';
          changes.push({ question, option, existingFormulaPunctuationWrapperMadeAtomic: true });
        }
        const style = document.createElement('style');
        style.dataset.n48DisplayRepair = '';
        style.textContent = '.sr-nb[data-n48-ending]{display:inline-block;max-width:100%;white-space:nowrap;overflow-x:auto;overflow-y:hidden;vertical-align:baseline}';
        document.head.append(style);
      }
      if (JSON.stringify(before) !== JSON.stringify(math())) throw new Error('Math rendering changed');
      return { changes, unchangedMathRenderings: before.length, html: '<!doctype html>\n' + document.documentElement.outerHTML };
    }, surface);
    fs.writeFileSync(path.join(out, surface + '.html'), change.html, { flag: 'wx' });
    receipt.changes.push({ surface, changes: change.changes, unchangedMathRenderings: change.unchangedMathRenderings });
  }
  await context.close();
  for (const file of protectedFiles) assert.equal(bind(path.resolve(root, file.path)).sha256, file.sha256);
  receipt.mathOptionsKeysSourceNumbersAndConditionsUnchanged = true;
  receipt.outputs = ['text', 'exercises', 'choices'].map(surface => ({ surface, ...bind(path.join(out, surface + '.html')) }));
} catch (error) {
  receipt.status = 'CANDIDATE_BUILD_FAILED';
  receipt.failure = { message: error.message, stack: error.stack };
  process.exitCode = 1;
} finally {
  await browser?.close();
  receipt.browserClosed = true;
  fs.writeFileSync(path.join(out, 'receipt.json'), JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
}
console.log(JSON.stringify({ status: receipt.status, receipt: bind(path.join(out, 'receipt.json')),
  metadata: receipt.metadata, outputs: receipt.outputs }));

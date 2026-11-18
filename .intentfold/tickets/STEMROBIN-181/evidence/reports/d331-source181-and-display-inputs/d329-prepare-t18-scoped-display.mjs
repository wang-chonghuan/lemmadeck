import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import {
  ticket, absolute, read, bind, verify, exists, immutableWrite, hash,
} from './retain-d016-evidence.mjs';
import { choiceHtml } from '../../../../.claude/skills/ld-s10y-lesson/tools/choice_html.mjs';

const require = createRequire(absolute('app/package.json'));
const { chromium } = require('playwright');
const requireNative = createRequire(absolute('.claude/skills/ld-s10y-lesson/tools/render_lesson.js'));
const { esc } = requireNative('./htmlfrag.js');
const { displayNumberForArtifact } = requireNative('./publish_merge.js');
assert.deepEqual(process.argv.slice(2), ['--execute']);
const base = `${ticket}/tmp`;
const folder = `${base}/d329-t18-scoped-display`;
assert.equal(await exists(`${folder}/manifest.json`), false);
const inputPath = `${base}/d328-t18-reviewed-text-assembly/manifest.json`;
await verify(inputPath, '5c85c17433f6b5df33f735b6ddf7a8d3324dd582d3b40b1f4df191acf3070c61');
const inputs = await read(inputPath);
assert.equal(inputs.wholeCardApproved, false);
assert.equal(inputs.actualVisualDISPLAY, false);
const styleProvenance = {
  path: `${base}/d297-t5-scoped-display/zh/work/phy10-c2-s2-t5/exercises.html`,
  sha256: '66fa375e9e8fed5c806a825bb6dab9fe718b161544b43f30707ba729e21eb74f',
};
await verify(styleProvenance.path, styleProvenance.sha256);
let browser, nativeCss;
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();
  await context.route('**/*', route => {
    const url = route.request().url();
    return /^(?:file|data|about):/.test(url) ? route.continue() : route.abort();
  });
  const page = await context.newPage();
  await page.goto(pathToFileURL(absolute(styleProvenance.path)).href, { waitUntil: 'load' });
  nativeCss = await page.evaluate(() => [...document.querySelectorAll('style')].map(node => node.textContent).join('\n'));
  assert.ok(nativeCss.includes('@font-face'));
  assert.ok(nativeCss.includes('data:font/woff2;base64,'));
} finally {
  await browser?.close();
}
const css = `${nativeCss}
.sr-nb{display:inline-block;max-width:100%;overflow-x:auto;vertical-align:middle;white-space:nowrap}
.options{list-style:none;margin:.75em 0 0;padding:0}
.option{display:flex;align-items:flex-start;gap:.6em;margin:.6em 0}
.option input{flex:none;margin-top:.65em}
.option span{min-width:0}
details{margin-top:.75em}`;
const escape = value => esc(String(value)).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const outputs = [], titles = [], expectations = [];
for (const language of ['zh', 'en']) {
  const row = name => inputs.outputs.find(item => item.language === language && path.basename(item.path) === name);
  for (const output of inputs.outputs.filter(item => item.language === language)) {
    await verify(output.path, output.sha256);
  }
  const choices = await read(row('choices.projection.json').path);
  const answers = await read(row('answer-keys.partial.json').path);
  const written = await read(row('written-exercises.projection.json').path);
  assert.deepEqual(answers.answers.map(item => item.exercise), written.exercises.map(item => String(item.number)));
  const titlePath = `${base}/d032-t18-text-repair/frozen/${language === 'zh' ? '' : 'english.'}lesson.template.json`;
  const titleBinding = await bind(titlePath);
  const lesson = await read(titlePath);
  const title = lesson.title;
  assert.ok(title);
  titles.push({ language, title, input: titleBinding });
  const labels = language === 'en'
    ? { choices: 'Choices', answers: 'Written Questions and Standard Answers', summary: 'Standard answer' }
    : { choices: '\u9009\u62e9\u9898', answers: '\u4e66\u5199\u9898\u4e0e\u6807\u51c6\u7b54\u6848', summary: '\u6807\u51c6\u7b54\u6848' };
  const choiceBody = choices.questions.map((question, index) => {
    const view = question.view;
    const type = view.mode === 'single' ? 'radio' : 'checkbox';
    assert.equal(view.figure_ids.length, 0);
    const options = view.options.map((option, optionIndex) => {
      assert.equal(option.figure_ids.length, 0);
      const label = String.fromCharCode(65 + optionIndex);
      return `<li class="option"><input disabled type="${type}" name="question-${index}" aria-label="${label}"><span>${label}. ${choiceHtml(option.text)}</span></li>`;
    }).join('');
    return `<li class="ex" data-question-id="${escape(question.id)}"><div class="no">${index + 1}.</div><div class="body">${choiceHtml(view.stem)}<ul class="options">${options}</ul></div></li>`;
  }).join('');
  const answerBody = answers.answers.map((answer, index) => {
    const exercise = written.exercises[index];
    assert.equal(exercise.figures.length, 0);
    return `<li class="ex" id="ex-${escape(exercise.number)}"><div class="no">${escape(displayNumberForArtifact(exercise))}</div><div class="body">${choiceHtml(exercise.text)}<details open><summary>${escape(labels.summary)}</summary>${choiceHtml(answer.displayAnswer)}</details></div></li>`;
  }).join('');
  for (const [surface, body] of [['choices', choiceBody], ['answers', answerBody]]) {
    const heading = `${title} - ${labels[surface]}`;
    const html = `<!DOCTYPE html><html lang="${language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(heading)}</title><style>${css}</style></head><body><main class="sheet"><h1>${escape(heading)}</h1><ol class="ex">${body}</ol></main></body></html>`;
    const file = `${folder}/${language}/${surface}.html`;
    await immutableWrite(file, html);
    await fs.chmod(absolute(file), 0o444);
    outputs.push({ language, surface, ...await bind(file) });
    expectations.push({
      language, surface, heading, exercises: 14,
      choiceOptions: surface === 'choices' ? 59 : 0,
      ids: surface === 'choices' ? choices.questions.map(item => item.id) : written.exercises.map(item => `ex-${item.number}`),
      sourceTasks: inputs.approvedSourceTasks, heldSourceTasks: inputs.heldSourceTasks,
      contentInput: row(surface === 'choices' ? 'choices.projection.json' : 'answer-keys.partial.json'),
      promptInput: row('written-exercises.projection.json'),
    });
  }
}
for (const output of inputs.outputs) await verify(output.path, output.sha256);
for (const title of titles) await verify(title.input.path, title.input.sha256);
await verify(styleProvenance.path, styleProvenance.sha256);
const manifestPath = `${folder}/manifest.json`;
await immutableWrite(manifestPath, `${JSON.stringify({
  schema: 'STEMROBIN-181/t18-scoped-display-html@1',
  ticket: 'STEMROBIN-181', batch: 'D033', card: inputs.card,
  status: 'FIRST-SCOPED-HTML-PREPARED-DISPLAY-NOT-YET-CHECKED',
  assembly: await bind(inputPath), styleProvenance, nativeCSSSha256: hash(Buffer.from(nativeCss)),
  renderer: await bind('.claude/skills/ld-s10y-lesson/tools/choice_html.mjs'),
  titles, outputs, expectations,
  originalSourceTasks: 16, selectedSourceTasks: 14, omittedHeldSourceTasks: ['1', '9'],
  firstSupplementalHTMLAssemblies: 2, headlessOfflineStyleExtraction: true,
  nativeRendererReplayed: false, semanticReviewsRepeated: false, nativeValidationRepeated: false,
  screenshotsCreated: 0, imagesOpenedByParent: 0, parentImageCount: 24,
  actualVisualDISPLAY: false, completeCardClaim: false, fullGate2PASS: false,
  nativeFullLessonFinalizeOrReadySeedInvented: false,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeployCommitPush: false,
}, null, 2)}\n`);
await fs.chmod(absolute(manifestPath), 0o444);
console.log(JSON.stringify({ manifest: await bind(manifestPath), htmlFiles: outputs.length,
  completeCardClaim: false, parentImagesOpened: 0 }));

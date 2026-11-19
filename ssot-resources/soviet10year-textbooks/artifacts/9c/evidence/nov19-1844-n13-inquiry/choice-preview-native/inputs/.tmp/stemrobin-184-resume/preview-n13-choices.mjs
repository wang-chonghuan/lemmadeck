import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const require = createRequire(path.resolve('.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'));
const { proseInline, esc } = require('./htmlfrag.js');
const source = '.tmp/stemrobin-184-resume/n13-choices/draft.json';
const outputRoot = '.tmp/ld-s10y-lesson/render/9c/modern-us-neutral/ana9-c3-s1-n13';
const projectionFile = '.tmp/stemrobin-184-resume/n13-choice-view-only.json';
const outputFile = `${outputRoot}/choices.html`;
const receiptFile = `${outputRoot}/choices.render.json`;
assert(!fs.existsSync(projectionFile) && !fs.existsSync(outputFile) && !fs.existsSync(receiptFile));
const bytes = fs.readFileSync(source);
const draft = JSON.parse(bytes);
const projection = { questions: draft.questions.map(({ id, view }) => ({ id, view })) };
const htmlSource = fs.readFileSync(`${outputRoot}/text.html`, 'utf8');
const styles = [...htmlSource.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(match => match[1]);
assert.equal(styles.length, 1);
assert(styles[0].includes('data:font/woff2;base64,'));
assert(!/url\((?:https?:|fonts\/)/u.test(styles[0]));
const lines = text => text.split('\n').map(line => `<span class="choice-line">${proseInline(line)}</span>`).join('');
const items = projection.questions.map(({ id, view }, index) => {
  assert(['single', 'multiple'].includes(view.mode));
  assert.equal(view.figure_ids.length, 0);
  const options = view.options.map(option => {
    assert.equal(option.figure_ids.length, 0);
    return `<label class="option"><input type="${view.mode === 'single' ? 'radio' : 'checkbox'}" name="${esc(id)}" value="${esc(option.id)}"><span class="option-letter">${proseInline(option.id.toUpperCase() + '.')}</span><span class="option-text">${lines(option.text)}</span></label>`;
  }).join('\n');
  return `<li class="ex" data-question-id="${esc(id)}"><span class="no">${index + 1}</span><div class="body"><p class="stem">${lines(view.stem)}</p><div class="options">${options}</div></div></li>`;
}).join('\n');
const css = '.option{display:grid;grid-template-columns:20px 1.5em minmax(0,1fr);gap:.4em;align-items:start;padding:.5em 0;cursor:pointer}.option input{width:18px;height:18px;margin:.35em 0 0;accent-color:var(--accent)}.option-text{min-width:0;overflow-x:auto}.option-letter{font-weight:600;font-family:KaTeX_Main,serif;font-size:1.1em}.sr-prose-math{font-family:KaTeX_Main,serif;font-size:1.1em}.option-letter .sr-prose-math{font-size:1em}.stem{margin:0 0 .5em}.options{min-width:0}.nb{max-width:100%;overflow-x:auto}.choice-line{display:block}';
const html = `<!DOCTYPE html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>循环小数：选择题</title><style>${styles[0]}\n${css}</style><main class="sheet"><h1>循环小数：选择题</h1><ol class="ex">${items}</ol><a class="jump" href="text.html">回课文</a></main>`;
assert(!html.includes('source_solution') && !html.includes('correct_set') && !html.includes('displayAnswer'));
const serialized = JSON.stringify(projection, null, 2) + '\n';
fs.writeFileSync(projectionFile, serialized, { flag: 'wx' });
fs.writeFileSync(outputFile, html, { flag: 'wx' });
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const receipt = {
  schema: 'n13-choice-view-only-render@1', source, sourceSha256: hash(bytes),
  projectionFile, projectionSha256: hash(serialized), outputFile, outputSha256: hash(html),
  questionCount: projection.questions.length,
  optionCount: projection.questions.reduce((n, row) => n + row.view.options.length, 0),
  renderer: 'Existing htmlfrag.proseInline and official embedded lesson CSS/fonts; only id/view exposed.',
  explicitViewNewlinesPreserved: true, images: 0, semanticApproval: false,
};
fs.writeFileSync(receiptFile, JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify(receipt));

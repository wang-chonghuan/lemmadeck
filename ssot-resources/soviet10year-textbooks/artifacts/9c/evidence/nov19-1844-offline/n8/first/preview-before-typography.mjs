import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck';
const require = createRequire(path.join(root, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'));
const { proseInline, esc } = require('./htmlfrag.js');
const lesson = 'ana9-c2-s2-n8';
const source = '.tmp/stemrobin-184-resume/n8-choices/draft.json';
const out = `.tmp/stemrobin-184-resume/offline/render/9c/modern-us-neutral/${lesson}`;
const read = relative => fs.readFileSync(path.join(root, relative));
const draft = JSON.parse(read(source));
const sourceHtml = read(`${out}/text.html`).toString();
const styles = [...sourceHtml.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(match => match[1]);
assert.equal(styles.length, 1);
assert(styles[0].includes('data:font/woff2;base64,'));
assert(!/url\((?:https?:|fonts\/)/.test(styles[0]));
const projected = draft.questions.map(({ id, view }) => ({ id, view }));
const lines = text => text.split('\n').map(line => `<span class="choice-line">${proseInline(line)}</span>`).join('');
const items = projected.map(({ id, view }, index) => {
  assert.equal(view.figure_ids.length, 0);
  assert(['single', 'multiple'].includes(view.mode));
  const options = view.options.map(option => {
    assert.equal(option.figure_ids.length, 0);
    return `<label class="option"><input type="${view.mode === 'single' ? 'radio' : 'checkbox'}" name="${esc(id)}" value="${esc(option.id)}"><span class="option-letter">${proseInline(option.id.toUpperCase() + '.')}</span><span class="option-text">${lines(option.text)}</span></label>`;
  }).join('\n');
  return `<li class="ex" data-question-id="${esc(id)}"><span class="no">${index + 1}</span><div class="body"><p class="stem">${lines(view.stem)}</p><div class="options">${options}</div></div></li>`;
}).join('\n');
const css = '.option{display:grid;grid-template-columns:20px 1.5em minmax(0,1fr);gap:.4em;align-items:start;padding:.5em 0;cursor:pointer}.option input{width:18px;height:18px;margin:.35em 0 0;accent-color:var(--accent)}.option-text{min-width:0;overflow-x:auto}.option-letter{font-weight:600;font-family:KaTeX_Main,serif;font-size:1.1em}.option-letter .prose-math{font-size:1em}.stem{margin:0 0 .5em}.options{min-width:0}.nb{max-width:100%;overflow-x:auto}.choice-line{display:block}';
const html = `<!DOCTYPE html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>组合数的计算：选择题</title><style>${styles[0]}\n${css}</style><main class="sheet"><h1>组合数的计算：选择题</h1><ol class="ex">${items}</ol><a class="jump" href="text.html">回课文</a></main>`;
assert(!html.includes('source_solution') && !html.includes('correct_index') && !html.includes('independent_solution'));
fs.writeFileSync(path.join(root, `${out}/choices.html`), html, { flag: 'wx' });
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const receipt = {
  lesson, questionCount: projected.length,
  optionCount: projected.reduce((n, item) => n + item.view.options.length, 0),
  projection: 'Only question id/view; no keys, source solutions, intent, coverage or answer payload',
  renderer: 'Existing htmlfrag.proseInline and official self-contained lesson CSS/fonts; explicit view newlines preserved',
  inputDraftSha256: hash(read(source)),
  output: `${out}/choices.html`, outputSha256: hash(Buffer.from(html)),
  newImagesOpened: 0,
};
fs.writeFileSync(path.join(root, `${out}/choices.render.json`), JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify(receipt));

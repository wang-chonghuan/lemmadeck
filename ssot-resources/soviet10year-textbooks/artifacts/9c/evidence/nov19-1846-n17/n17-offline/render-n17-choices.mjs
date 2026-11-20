import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { choiceHtml } from '../../.claude/skills/ld-s10y-lesson/tools/choice_html.mjs';

const require = createRequire(path.resolve('.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'));
const { proseInline, esc } = require('./htmlfrag.js');
const directory = '.tmp/ld-s10y-lesson/render/9c/modern-us-neutral/ana9-c3-s1-n17';
const source = '.tmp/stemrobin-184-six/n17-choices/draft.json';
const draft = JSON.parse(fs.readFileSync(source));
const view = { questions: draft.questions.map(({ id, view }) => ({ id, view })) };
const text = fs.readFileSync(`${directory}/text.html`, 'utf8');
const styles = [...text.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(match => match[1]);
assert.equal(styles.length, 1);
assert(styles[0].includes('data:font/woff2;base64,'));
const lines = value => value.split('\n').map(line => `<span class="choice-line">${proseInline(line)}</span>`).join('');
const contentHtml = value => /^[ \t]*\|.*\|[ \t]*$/m.test(value) ? choiceHtml(value) : lines(value);
const questions = view.questions.map(({ id, view }, index) => {
  assert.equal(view.figure_ids.length, 0);
  const options = view.options.map(option => {
    assert.equal(option.figure_ids.length, 0);
    return `<label class="option"><input type="${view.mode === 'single' ? 'radio' : 'checkbox'}" name="${esc(id)}" value="${esc(option.id)}"><span class="option-letter">${proseInline(option.id.toUpperCase() + '.')}</span><span class="option-text">${contentHtml(option.text)}</span></label>`;
  }).join('\n');
  return `<li class="ex" data-question-id="${esc(id)}"><span class="no">${index + 1}</span><div class="body"><div class="stem">${contentHtml(view.stem)}</div><div class="options">${options}</div></div></li>`;
}).join('\n');
const css = '.option{display:grid;grid-template-columns:20px 1.5em minmax(0,1fr);gap:.4em;align-items:start;padding:.5em 0;cursor:pointer}.option input{width:18px;height:18px;margin:.35em 0 0;accent-color:var(--accent)}.option-text{min-width:0;overflow-x:auto}.option-letter{font-weight:600;font-family:KaTeX_Main,serif;font-size:1.1em}.option-letter .sr-prose-math{font-size:1em}.stem{margin:0 0 .5em}.stem table{border-collapse:collapse;margin:.7em 0;max-width:100%}.stem th,.stem td{border:1px solid var(--rule);padding:.35em .7em;text-align:left}.options{min-width:0}.choice-line{display:block}';
const html = `<!DOCTYPE html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>17. 数直线和数平面 · 选择题</title><style>${styles[0]}\n${css}</style><main class="sheet"><h1>17. 数直线和数平面 · 选择题</h1><ol class="ex">${questions}</ol><a class="jump" href="text.html">回课文</a></main>`;
assert(!html.includes('source_solution') && !html.includes('displayAnswer'));
fs.writeFileSync('.tmp/stemrobin-184-six/n17-choices/view.json', JSON.stringify(view, null, 2) + '\n', { flag: 'wx' });
fs.writeFileSync(`${directory}/choices.html`, html, { flag: 'wx' });
console.log(JSON.stringify({
  output: `${directory}/choices.html`,
  questions: view.questions.length,
  options: view.questions.reduce((count, item) => count + item.view.options.length, 0),
  onlyIdAndView: true,
}));

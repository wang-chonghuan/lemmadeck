import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { choiceHtml } from '../../.claude/skills/ld-s10y-lesson/tools/choice_html.mjs';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const base = path.join(root, '.tmp/stemrobin-184-six');
const lesson = 'ana9-c4-s2-n47';
const modern = path.join(root,
  'ssot-resources/soviet10year-textbooks/artifacts/9c/editions/modern-us-neutral/lessons',
  lesson);
const rendered = path.join(base, 'n47-work/render/9c/modern-us-neutral', lesson);
const output = path.join(base, 'n47-preview');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.relative(root, file), bytes: bytes.length, sha256: hash(bytes) };
};
const { inline, esc } = createRequire(import.meta.url)(
  '../../.claude/skills/ld-s10y-lesson/tools/htmlfrag.js');
assert(!fs.existsSync(output));
const draft = read(path.join(modern, 'choice-set/draft.json'));
const keys = read(path.join(modern, 'answer-keys.json'));
assert.equal(draft.new_figures.length, 0);
assert.equal(keys.status, 'ready');
const text = fs.readFileSync(path.join(rendered, 'text.html'), 'utf8');
const written = fs.readFileSync(path.join(rendered, 'exercises.html'), 'utf8');
const styles = text.match(/<style>([\s\S]*?)<\/style>/);
assert(styles?.[1].includes('data:font/woff2'));
const extraCss = `
.sr-nb{display:inline-block;max-width:100%;overflow-x:auto;vertical-align:middle;white-space:nowrap}
.preview-question{padding:1.1em 0;border-top:1px solid #e3e3e3;min-width:0}
.preview-question h2{font-size:1.05em;line-height:1.95;margin:0 0 .65em;font-weight:400}
.preview-option{display:grid;grid-template-columns:22px minmax(0,1fr);gap:10px;
 align-items:start;line-height:1.95;padding:.55em 0;min-width:0}
.preview-option input{width:18px;height:18px;margin:6px 0 0;accent-color:#2b5f8e}
.preview-option .option-text{min-width:0;overflow-x:auto}
.standard-answer{padding:1em 0;border-top:1px solid #e3e3e3;line-height:1.95}
.standard-answer h2{font-size:1.05em;margin:0 0 .6em}
.preview-question table{border-collapse:collapse;min-width:fit-content}
.preview-question th,.preview-question td{padding:.5em;border:1px solid #ccc}
h1{letter-spacing:0}
`;
const visible = draft.questions.map(q => ({
  id: q.id, view: q.view,
}));
for (const question of visible) {
  assert.equal(question.view.figure_ids.length, 0);
  question.view.options.forEach(option => assert.equal(option.figure_ids.length, 0));
}
const choiceBody = visible.map((question, index) =>
  `<section class="preview-question" data-question-id="${esc(question.id)}" `
  + `data-mode="${question.view.mode}"><h2>${index + 1}. `
  + `${choiceHtml(question.view.stem)}</h2><div role="group" `
  + `aria-label="${index + 1}">${question.view.options.map(option =>
    `<label class="preview-option" data-option-id="${esc(option.id)}">`
    + `<input type="${question.view.mode === 'single' ? 'radio' : 'checkbox'}" `
    + `name="${esc(question.id)}" aria-label="${esc(option.id)}">`
    + `<span class="option-text">${choiceHtml(option.text)}</span></label>`
  ).join('')}</div></section>`
).join('');
const choices = `<!DOCTYPE html><meta charset="utf-8"><title>商的导数</title>`
  + `<meta name="viewport" content="width=device-width,initial-scale=1">`
  + `<style>${styles[1]}${extraCss}</style><main class="sheet">`
  + `<h1>商的导数</h1>${choiceBody}</main>`;
const answers = keys.answers.map(answer =>
  `<section class="standard-answer" data-answer-exercise="${esc(answer.exercise)}">`
  + `<h2>${esc(answer.exercise)}</h2>`
  + `<div>${inline(answer.displayAnswer)}</div></section>`).join('');
fs.mkdirSync(output);
fs.writeFileSync(path.join(output, 'text.html'),
  text.replaceAll('href="exercises.html"', 'href="written.html"'), { flag: 'wx' });
fs.writeFileSync(path.join(output, 'written.html'),
  written + `<style>${extraCss}</style><main class="sheet">${answers}</main>`,
  { flag: 'wx' });
fs.writeFileSync(path.join(output, 'choices.html'), choices, { flag: 'wx' });
const manifest = {
  schema: 'stemrobin1846/offline-preview@1', book: '9c', lesson,
  at: new Date().toISOString(),
  inputs: ['lesson.json', 'exercises.json', 'figures.json', 'answer-keys.json',
    'interactions.json', 'choice-set/seed.json', 'choice-set/draft.json',
    'choice-set/review.json'].map(name => bind(path.join(modern, name))),
  renders: ['text.html', 'exercises.html'].map(name => bind(path.join(rendered, name))),
  files: ['text.html', 'written.html', 'choices.html'].map(name => bind(path.join(output, name))),
  counts: { prose: 6, written: 4, automaticParts: 10,
    choices: visible.length,
    options: visible.reduce((sum, q) => sum + q.view.options.length, 0) },
  scope: 'Offline visual/native selection preview, not product server judging, keyboard or DB acceptance',
  choicesProjection: 'view plus local id only; no source, intent, key, rationales or review',
  imagesReadOrDecodedByParent: 0, nativeRenderReplays: 0,
};
fs.writeFileSync(path.join(output, 'manifest.json'),
  JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify(manifest));

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const directory = '.tmp/stemrobin-184-six/n17-choices';
const read = filename => JSON.parse(fs.readFileSync(filename));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const original = read(`${directory}/draft.json`);
const repaired = read(`${directory}/draft.repaired.json`);
const reviewPath = '.tmp/stemrobin-184-six/n17-choice-review/review.json';
const review = read(reviewPath);
assert.equal(review.outcome, 'pass');
assert.equal(review.reviewer.kind, 'independent_agent');
assert.deepEqual(repaired.coverage, original.coverage);
assert.equal(repaired.seed_sha256, original.seed_sha256);
for (let index = 0; index < original.questions.length; index++) {
  if (index === 1) continue;
  assert.deepEqual(repaired.questions[index], original.questions[index]);
}
const before = structuredClone(original.questions[1]);
const after = structuredClone(repaired.questions[1]);
assert.equal(before.id, 'n17-distance-results');
for (const question of [before, after]) {
  delete question.view.options[1].text;
  delete question.key.rationales[1].derivation;
  delete question.key.rationales[1].misconception;
}
assert.deepEqual(after, before);

const approved = `${directory}/approved`;
assert(!fs.existsSync(approved));
fs.mkdirSync(approved);
const outputs = [];
for (const [source, name] of [
  [`${directory}/seed.json`, 'seed.json'],
  [`${directory}/draft.repaired.json`, 'draft.json'],
  [reviewPath, 'review.json'],
]) {
  const bytes = fs.readFileSync(source);
  const target = `${approved}/${name}`;
  fs.writeFileSync(target, bytes, { flag: 'wx' });
  outputs.push({ path: target, sha256: hash(bytes), bytes: bytes.length });
}

const require = createRequire(path.resolve('.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'));
const { proseInline, esc } = require('./htmlfrag.js');
const optionHtml = (question, option) =>
  `<label class="option"><input type="radio" name="${esc(question.id)}" value="${esc(option.id)}"><span class="option-letter">${proseInline(option.id.toUpperCase() + '.')}</span><span class="option-text">${option.text.split('\n').map(line => `<span class="choice-line">${proseInline(line)}</span>`).join('')}</span></label>`;
const oldOption = optionHtml(original.questions[1], original.questions[1].view.options[1]);
const newOption = optionHtml(repaired.questions[1], repaired.questions[1].view.options[1]);
const htmlPath = '.tmp/ld-s10y-lesson/render/9c/modern-us-neutral/ana9-c3-s1-n17/choices.html';
const oldHtml = fs.readFileSync(htmlPath, 'utf8');
assert.equal(oldHtml.split(oldOption).length, 2);
const newHtml = oldHtml.replace(oldOption, newOption);
assert.equal(newHtml.replace(newOption, oldOption), oldHtml);
assert(!newHtml.includes('source_solution') && !newHtml.includes('displayAnswer'));
const initialPath = htmlPath.replace('choices.html', 'choices.initial.html');
assert(!fs.existsSync(initialPath));
fs.renameSync(htmlPath, initialPath);
fs.writeFileSync(htmlPath, newHtml, { flag: 'wx' });
console.log(JSON.stringify({
  approved, outputs, html: htmlPath,
  initialHtml: initialPath,
  beforeSha256: hash(oldHtml),
  afterSha256: hash(newHtml),
  optionFragmentsChanged: 1,
  unchangedOutsideOption: true,
  semanticRepairCount: 1,
}));

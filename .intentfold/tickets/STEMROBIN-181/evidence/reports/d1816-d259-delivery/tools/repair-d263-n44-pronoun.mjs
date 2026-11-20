import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d263-n44-pronoun-author`;
const A = `${T}/tmp/d1816-d256-n44-author`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({ path: file,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};
const prior = read(`${A}/bilingual-figure-bindings.json`);
const file = prior.templates.en.path;
const before = read(file);
const after = structuredClone(before);
const oldText = 'Molecule 1 also exerts the repulsive force $F_1$ on molecule 2.';
const newText = 'Molecule 1 also exerts the repulsive force $F_1$ on it.';
assert.equal(before.prose.filter(row => row.text.includes(oldText)).length, 1);
after.prose[3].text = after.prose[3].text.replace(oldText, newText);
const comparison = structuredClone(after);
comparison.prose[3].text = comparison.prose[3].text.replace(newText, oldText);
assert.deepEqual(comparison, before);
save(`${O}/before.template.json`, before);
fs.writeFileSync(file, JSON.stringify(after, null, 2) + '\n');
const numbers = JSON.parse(execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', [
  '-c', [
    'import sys,json',
    'sys.path.insert(0,".claude/skills/ld-s10y-lesson/tools")',
    'from edition import prose_number_signature',
    'd=json.load(sys.stdin)',
    'b=d["prose"][3]',
    'print(json.dumps({"source":prose_number_signature(b["source_text"])[0],',
    '"english":prose_number_signature(b["text"])[0]}))',
  ].join('\n'),
], { cwd: repo, input: JSON.stringify(after), encoding: 'utf8' }));
assert.deepEqual(numbers.source, numbers.english);
const spec = read(prior.spec.path);
const originalSpec = structuredClone(spec);
spec.source.authoritativeText[1].text =
  `${after.printed_title}\n\n${after.prose.map(row => row.text).join('\n\n')}`;
assert.deepEqual(spec.objects, originalSpec.objects);
assert.deepEqual(spec.assertions, originalSpec.assertions);
assert.deepEqual(spec.source.inventory, originalSpec.source.inventory);
const specFile = `${O}/fig-68.spec.json`;
save(specFile, spec);
const render = read(prior.render.path);
assert.equal(render.status, 'pass');
render.spec = bind(specFile);
save(`${O}/fig-68.render.json`, render);
save(`${O}/bindings.json`, {
  spec: bind(specFile), render: bind(`${O}/fig-68.render.json`), svg: prior.svg,
  templates: { zh: prior.templates.zh, en: bind(file) },
  original: prior, before: bind(`${O}/before.template.json`),
  changedSentence: { from: oldText, to: newText },
  changedBlock: 3, exactNumericSignatures: numbers,
  geometryChanged: false, svgChanged: false, chineseTextChanged: false,
  actualImageOpens: 0, paidCalls: 0, affectedEnglishReviewPending: true,
  priorEnglishReview: bind(`${T}/tmp/d1816-d258-n44-review/english-review.json`),
  priorFigureReview: bind(`${T}/tmp/d1816-d262-n44-affected-visual/fig-68.review.json`),
});
console.log(JSON.stringify({ bindings: bind(`${O}/bindings.json`), numbers }));

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d343-n149-text-repair`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({ path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const reviewFile = `${T}/tmp/d1816-d332-n149-first-text-review/report.json`;
const review = read(reviewFile);
const prepared = read(`${T}/tmp/d1816-d330-n149-first-preparation/prepared.json`);
assert.equal(review.overall, 'FAIL');
assert(!fs.existsSync(O));
fs.mkdirSync(O, { recursive: true });
const require = createRequire(import.meta.url);
const { proseFlow } = require(path.resolve('.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'));
const changes = [];
const replacements = [
  ['at$300000$', 'at $300000$'],
  ['nuclear$\\beta$', 'nuclear $\\beta$'],
  ['as16', 'as 16'],
  ['symbol$\\nu$', 'symbol $\\nu$'],
  ['symbol$\\bar{\\nu}$', 'symbol $\\bar{\\nu}$'],
  ['About26', 'About 26'],
  ['short-lived$\\beta$', 'short-lived $\\beta$'],
  ['in1956', 'in 1956'],
  ['describes200', 'describes 200'],
  ['about300', 'about 300'],
  ['A$\\gamma$', 'A $\\gamma$'],
  ['point$A$', 'point $A$'],
  ['at$B$', 'at $B$'],
  ['producing2$\\gamma$', 'producing 2 $\\gamma$'],
  ['These$\\gamma$', 'These $\\gamma$'],
  ['at$C$', 'at $C$'],
  ['several$\\gamma$', 'several $\\gamma$'],
  ['early$\\gamma$', 'early $\\gamma$'],
  ['later$\\gamma$', 'later $\\gamma$'],
];
const math = text => [...text.matchAll(/\$\$?[^$]*\$\$?/g)].map(match => match[0]);
const digits = text => text.match(/\d+/g) || [];
for (const locale of ['zh', 'en']) {
  const binding = review.input_bindings.find(item => item.key === `${locale}_template`);
  assert.equal(bind(binding.path).sha256, binding.sha256);
  const before = read(binding.path);
  const after = structuredClone(before);
  fs.copyFileSync(binding.path, `${O}/${locale}.before.template.json`);
  const f1 = review.findings.find(item => item.id === 'D332-F1');
  const f2 = review.findings.find(item => item.id === 'D332-F2');
  after.prose[4].text += `${locale === 'en' ? '\n' : ''}${f1[`suggested_${locale}_sentence`]}`;
  after.prose[17].text += `${locale === 'en' ? '\n' : ''}${f2[`suggested_${locale}_sentence`]}`;
  for (const [index, term, sourceTerm, ref] of [
    [2, 'Pauli', '泡利', 'p0382#3'], [3, 'Pauli', '泡利', 'p0382#4'],
    [4, 'Fermi', '费米', 'p0382#5'], [11, 'United States', '美国', 'p0383#7'],
  ]) {
    const entry = { term: locale === 'en' ? term : sourceTerm,
      ...(locale === 'en' ? { source_term: sourceTerm } : {}),
      reason: `${ref} identifies this person or place in the historical account.` };
    after.prose[index].historical_entities = [
      ...(after.prose[index].historical_entities || []), entry,
    ];
  }
  if (locale === 'en') {
    for (const block of after.prose) {
      for (const [from, to] of replacements) block.text = block.text.split(from).join(to);
    }
  }
  for (const [i, block] of after.prose.entries()) {
    assert.equal(block.source_text, before.prose[i].source_text);
    assert.deepEqual(math(block.text), math(before.prose[i].text));
    assert.deepEqual(digits(block.text), digits(before.prose[i].text));
    if (JSON.stringify(block) !== JSON.stringify(before.prose[i])) {
      changes.push({ locale, index: i, source_refs: block.source_refs,
        before: before.prose[i], after: block });
    }
  }
  after.section_breaks = [];
  const flow = proseFlow(after.prose, []).filter(row => row.kind === 'p');
  const prefixes = locale === 'zh'
    ? ['**泡利的假设**', '**自由中子的衰变**', '**中微子的实验发现**', '**粒子衰变的实质**']
    : ['**Pauli\'s hypothesis**', '**Free-neutron decay**', '**Experimental discovery**', '**What particle decay means**'];
  after.section_breaks = prefixes.map(prefix => {
    const index = flow.findIndex(row => row.text.startsWith(prefix));
    assert(index > 0, prefix);
    return { before: flow[index - 1].text, after: flow[index].text };
  });
  fs.writeFileSync(binding.path, JSON.stringify(after, null, 2) + '\n');
  fs.copyFileSync(binding.path, `${O}/${locale}.after.template.json`);
}
fs.writeFileSync(`${O}/author-freeze.json`, JSON.stringify({
  stage: 'D343', review: bind(reviewFile),
  raw: bind(prepared.source.path), rawExercises: bind(prepared.exercises.path),
  records: ['zh', 'en'].map(locale => ({
    locale, before: bind(`${O}/${locale}.before.template.json`),
    after: bind(`${O}/${locale}.after.template.json`),
    working: bind(review.input_bindings.find(item => item.key === `${locale}_template`).path),
  })),
  findingsAddressed: ['D332-F1', 'D332-F2', 'D332-F3', 'D332-F4'],
  changes, sectionAnchorsRederived: true,
  rawTextMathAndDigitsUnchanged: true,
  contentRepairs: 1, imagesOpened: 0, paidCalls: 0,
  sourcePagesAdded: 0, completeCoursesAdded: 0, independentApproval: false,
}, null, 2) + '\n');
console.log(JSON.stringify({ freeze: bind(`${O}/author-freeze.json`), changedEntries: changes.length }));

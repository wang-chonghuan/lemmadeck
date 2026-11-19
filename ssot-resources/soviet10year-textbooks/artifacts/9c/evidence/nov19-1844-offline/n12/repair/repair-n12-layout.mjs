import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const root = process.cwd();
const require = createRequire(path.join(root, 'app/package.json'));
const { chromium } = require('@playwright/test');
const htmlRoot = '.tmp/ld-s10y-lesson/render/9c/modern-us-neutral/ana9-c3-s1-n12';
const output = '.tmp/stemrobin-184-resume/n12-layout-repair';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const chain = '-117\\frac{1}{3}=-117.3333\\ldots=-118+\\frac{2}{3}=\\overline{118}.66666\\ldots.';
const expected = {
  text: '3fd08b66b4a9bab84f115b0c1a559450e6bdaee2152865b3836cd0b902d81ba8',
  exercises: 'bcc1f1540f905748c85bfdc2d474bef802e4be763eaed3a5c8a9a0a3229c6f42',
  choices: 'd8bea6d6e3a93be49cd28e1d948920be38ba4794e665c306becfa2f4c9c52182',
};
assert(!fs.existsSync(output), 'No repair replay');
assert(fs.existsSync('ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov19-1844-offline/n12/diagnosis/parent-intake.json'));
const inputs = Object.fromEntries(Object.keys(expected).map(name => {
  const html = fs.readFileSync(`${htmlRoot}/${name}.html`, 'utf8');
  assert.equal(hash(html), expected[name], name);
  return [name, html];
}));
fs.mkdirSync(output);
for (const name of ['text', 'exercises']) fs.writeFileSync(`${output}/${name}.before.html`, inputs[name], { flag: 'wx' });
const browser = await chromium.launch({ headless: true });
let edits;
try {
  const page = await browser.newPage();
  edits = await page.evaluate(({ inputs, chain }) => {
    const parse = html => new DOMParser().parseFromString(html, 'text/html');
    const text = parse(inputs.text);
    const exercises = parse(inputs.exercises);
    const wrappers = [...text.querySelectorAll('.nb')].filter(node => node.querySelector('annotation')?.textContent === chain);
    if (wrappers.length !== 1) throw new Error('Expected one exact chain wrapper');
    const wrapper = wrappers[0];
    const beforeChain = wrapper.outerHTML;
    const html = wrapper.querySelector('.katex-html');
    const tokens = html.textContent;
    const equalities = [...html.querySelectorAll('.mrel')].filter(node => node.textContent === '=');
    if (equalities.length !== 3) throw new Error('Expected three source equality signs');
    const range = text.createRange();
    range.setStartBefore(equalities[1]);
    range.setEndAfter(html.lastChild);
    const trailing = range.extractContents();
    const first = text.createElement('span');
    const second = text.createElement('span');
    for (const line of [first, second]) {
      line.className = 'equation-line';
      line.style.display = 'block';
      line.style.whiteSpace = 'nowrap';
    }
    first.append(...html.childNodes);
    second.append(trailing);
    html.replaceChildren(first, second);
    wrapper.style.overflow = 'visible';
    wrapper.style.whiteSpace = 'normal';
    if (html.textContent !== tokens || wrapper.querySelector('annotation').textContent !== chain) {
      throw new Error('Chain tokens or annotation changed');
    }
    const fractions = [...exercises.querySelectorAll('#ex-113 .body .nb')].filter(node => node.querySelector('.mfrac'));
    if (fractions.length !== 3) throw new Error('Expected exactly three113fraction wrappers');
    const changes = fractions.map(node => {
      const before = node.outerHTML;
      const contents = node.innerHTML;
      const tex = node.querySelector('annotation').textContent;
      node.style.overflowY = 'hidden';
      if (node.innerHTML !== contents) throw new Error('Fraction contents changed');
      return { before, after: node.outerHTML, tex };
    });
    return {
      text: [{ before: beforeChain, after: wrapper.outerHTML, tex: chain }],
      exercises: changes,
      annotationsBefore: {
        text: [...parse(inputs.text).querySelectorAll('annotation')].map(node => node.textContent),
        exercises: [...parse(inputs.exercises).querySelectorAll('annotation')].map(node => node.textContent),
      },
    };
  }, { inputs, chain });
} finally {
  await browser.close();
}
const rows = [];
for (const name of ['text', 'exercises']) {
  let changed = inputs[name];
  for (const edit of edits[name]) {
    assert.equal(changed.split(edit.before).length, 2, `Expected one exact original fragment: ${name}`);
    changed = changed.replace(edit.before, edit.after);
  }
  fs.writeFileSync(`${output}/${name}.after.html`, changed, { flag: 'wx' });
  fs.writeFileSync(`${htmlRoot}/${name}.html`, changed);
  rows.push({ path: `${htmlRoot}/${name}.html`, beforeSha256: hash(inputs[name]), afterSha256: hash(changed),
    changedWrappers: edits[name].length });
}
assert.equal(hash(fs.readFileSync(`${htmlRoot}/choices.html`)), expected.choices);
fs.writeFileSync(`${output}/receipt.json`, JSON.stringify({
  schema: 'n12-static-dom-layout-repair@1',
  recordedAt: new Date().toISOString(), rows, edits,
  actualExecution: 'Headless browser used only as a detached DOMParser/Range serializer; no HTML navigation, rendering, math engine, image or acceptance check.',
  browserClosed: true, sourceOrCanonicalOrChoiceChanged: false,
  F001: 'Exact original KaTeX nodes split before second equality, one original annotation andMathML retained.',
  F002: 'Only3matched113fraction outerwrappers addoverflow-y:hidden; allfractioninnerHTML unchanged.',
  visualApproval: false,
  next: 'Same-reviewer affected-only check on actual changedHTML.',
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ status: 'Repair applied, approval pending', rows, choicesUnchanged: true,
  canonicalUnchanged: true, images: 0, browserClosed: true }));

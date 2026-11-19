import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const root = process.cwd();
const require = createRequire(path.join(root, 'app/package.json'));
const { chromium } = require('playwright');
const target = '.tmp/ld-s10y-lesson/render/9c/modern-us-neutral/ana9-c3-s1-n13/text.html';
const output = '.tmp/stemrobin-184-resume/n13-layout-repair';
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const initial = fs.readFileSync(target, 'utf8');
assert.equal(digest(initial), '8894feeed9eeb821e40581be39e21f5e439fccfd0a20647dc80c29d2f5d30a7c');
assert(!fs.existsSync(output), 'Existing repair protected');
assert(fs.existsSync('ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov19-1844-offline/n13/first/parent-result.md'));
const tex = [
  'r>0.\\underbrace{2399\\cdots9}_{k\\text{ 位}}',
  '0.24-0.\\underbrace{2399\\cdots9}_{k\\text{ 位}}=10^{-k}',
];
const browser = await chromium.launch({ headless: true });
let edits;
try {
  const page = await browser.newPage();
  edits = await page.evaluate(({ initial, tex }) => {
    const doc = new DOMParser().parseFromString(initial, 'text/html');
    return tex.map(source => {
      const matches = [...doc.querySelectorAll('.nb')].filter(node =>
        node.querySelector('annotation')?.textContent === source);
      if (matches.length !== 1) throw new Error('Expected exactly one exact formula wrapper');
      const node = matches[0];
      const before = node.outerHTML;
      const contents = node.innerHTML;
      node.style.paddingBottom = '0.25em';
      node.style.overflowY = 'hidden';
      if (node.innerHTML !== contents) throw new Error('Formula markup changed');
      return { tex: source, before, after: node.outerHTML, innerHTMLUnchanged: true };
    });
  }, { initial, tex });
} finally {
  await browser.close();
}
let changed = initial;
for (const edit of edits) {
  assert.equal(changed.split(edit.before).length, 2, 'Expected one exact original wrapper');
  changed = changed.replace(edit.before, edit.after);
}
let reverse = changed;
for (const edit of edits) reverse = reverse.replace(edit.after, edit.before);
assert.equal(reverse, initial, 'Only two wrappers may change');
fs.mkdirSync(output);
fs.writeFileSync(`${output}/text.before.html`, initial, { flag: 'wx', mode: 0o444 });
fs.writeFileSync(`${output}/text.after.html`, changed, { flag: 'wx', mode: 0o444 });
fs.writeFileSync(target, changed);
fs.writeFileSync(`${output}/receipt.json`, JSON.stringify({
  schema: 'n13-two-underbrace-html-repair@1',
  target, beforeSha256: digest(initial), afterSha256: digest(changed),
  edits, wrapperChanges: 2, reverseExact: true,
  execution: 'Detached DOMParser only; no navigation/render/math/acceptance/image check',
  browserClosed: true, images: 0, parentImageUsage: 'Permanent24/24',
  canonicalChanged: false, passedChecksReplayed: false, approval: 'pending affected-only follow-up',
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ status: 'Two-wrapper repair applied, not approved',
  beforeSha256: digest(initial), afterSha256: digest(changed), browserClosed: true, images: 0 }));

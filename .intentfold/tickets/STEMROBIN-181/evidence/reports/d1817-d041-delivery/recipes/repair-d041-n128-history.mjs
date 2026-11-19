import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck');
const scratch = '.intentfold/tickets/STEMROBIN-181/tmp/d1814-recovery';
const base = '.tmp/STEMROBIN-181/d1817';
const id = 'phy10-c3-s3-n128';
const reportPath = '.intentfold/tickets/STEMROBIN-181/tmp/d1817-n128-text-review/report.json';
const read = file => JSON.parse(fs.readFileSync(file));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file) });
const review = read(reportPath);
assert.equal(hash(reportPath), 'dca8fd80e588f1638d358f7aeb0881be3d5856359e579e4977003dc701153b16');
assert.equal(review.SCI.verdict, 'PASS');
assert.equal(review.ZHEN.verdict, 'FAIL');
for (const binding of review.finalFileBindings) assert.equal(hash(binding.path), binding.sha256);
const displayPath = '.intentfold/tickets/STEMROBIN-181/tmp/d1817-n128-display/result.json';
const display = read(displayPath);
const priorDisplay = [];
for (const html of new Map(display.records.map(record => [record.html.path, record.html])).values()) {
  assert.equal(hash(html.path), html.sha256);
  const edition = html.path.includes('/modern-us-neutral-en/') ? 'modern-us-neutral-en' : 'modern-us-neutral';
  const target = `${scratch}/d041-n128-history-first-candidate/${edition}/text.before.html`;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(html.path, target, fs.constants.COPYFILE_EXCL);
  priorDisplay.push({ originalPath: html.path, snapshot: bind(target) });
}
const records = [];
for (const edition of ['modern-us-neutral', 'modern-us-neutral-en']) {
  const directory = `${base}/n128-root/10p/editions/${edition}/lessons/${id}`;
  const file = `${base}/author-work/adapt/10p/${edition}/lessons/${id}/lesson.template.json`;
  const history = `${scratch}/d041-n128-history-first-candidate/${edition}`;
  fs.mkdirSync(history, { recursive: true });
  const originals = [];
  for (const name of ['lesson.json', 'adaptation.audit.json']) {
    const target = `${history}/${name}`;
    fs.copyFileSync(`${directory}/${name}`, target, fs.constants.COPYFILE_EXCL);
    originals.push(bind(target));
  }
  fs.copyFileSync(file, `${history}/lesson.template.json`, fs.constants.COPYFILE_EXCL);
  const document = read(file);
  const previous = structuredClone(document);
  const zh = edition === 'modern-us-neutral';
  document.prose[4].historical_entities[0].reason =
    'Historical naming credit clarified from the source Curie couple to Marie Curie herself, as stated in her1911 Nobel lecture; this is not spelling localization alone.';
  const beforeText = zh ? '镭的原子序数是 88。'
    : 'Radium has atomic number 88 in the periodic table.';
  const afterText = zh ? '镭的原子序数是 88，周期表是在门捷列夫等人的工作基础上发展起来的。'
    : 'Radium has atomic number 88 in the periodic table, developed from the work of Mendeleev and others.';
  assert(document.prose[5].text.includes(beforeText));
  document.prose[5].text = document.prose[5].text.replace(beforeText, afterText);
  document.prose[5].historical_entities = [{
    source_term: '门捷列夫', term: zh ? '门捷列夫' : 'Mendeleev',
    reason: 'Preserve the source-bound historical scientist associated with the development of the periodic table; no Soviet cultural deletion.',
  }];
  for (const [index, block] of document.prose.entries()) {
    if (![4, 5].includes(index)) assert.deepEqual(block, previous.prose[index]);
  }
  document.section_breaks = [];
  fs.writeFileSync(file, JSON.stringify(document, null, 2) + '\n');
  const label = `d041-${edition}-n128-history-affected-outline`;
  execFileSync('node', [`${scratch}/run-native.mjs`, label, 'node',
    '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--json', file], { stdio: 'inherit' });
  const outline = read(`${scratch}/native/${label}/stdout.txt`);
  const prefixes = zh ? ['贝克勒尔想知道', '研究者接着', '镭在周期表']
    : ['Becquerel asked', 'Researchers then', 'A periodic-table entry'];
  document.section_breaks = prefixes.map(prefix => {
    const matches = outline.paragraphs.filter(row => row.text.startsWith(prefix));
    assert.equal(matches.length, 1);
    const after = matches[0];
    const before = outline.paragraphs.find(row => row.index === after.index - 1);
    assert(before);
    return { before: before.text, after: after.text };
  });
  fs.writeFileSync(file, JSON.stringify(document, null, 2) + '\n');
  records.push({ edition, originals, beforeTemplate: bind(`${history}/lesson.template.json`),
    afterTemplate: bind(file), outline: bind(`${scratch}/native/${label}/stdout.txt`),
    paragraphs: outline.paragraphs.length, affectedProse: [4, 5] });
}
const file = `${scratch}/d041-n128-history-repair.json`;
fs.writeFileSync(file, JSON.stringify({
  batch: 'D041', id, originalReview: bind(reportPath), records, priorDisplay,
  firstDOMReport: bind(displayPath), substantiveRevision: 1,
  findings: ['ZHEN-01', 'ZHEN-02'],
  action: 'Restore Mendeleev in both visible modern texts and source-bound declarations. Correct naming-credit reason without changing the accepted Marie Curie naming fact.',
  unchangedSCI: 'Retain first independent SCI PASS for untouched claims; only the historical reference and explanatory declaration need new review.',
  sourceUnchanged: true, numericChanges: [], originalDISPLAY: 'DOM PASS retained historically; no independent pixels yet. Current changed block needs affected rerender.',
  parentNewImageOpens: 0, paidCalls: 0, addedDeliveredCards: 0, databaseWrites: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ repair: bind(file), substantiveRevision: 1 }));

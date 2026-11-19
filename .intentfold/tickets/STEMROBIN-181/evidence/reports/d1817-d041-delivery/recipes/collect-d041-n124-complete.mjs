import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck');
const ticket = '.intentfold/tickets/STEMROBIN-181';
const scratch = `${ticket}/tmp/d1814-recovery`;
const root = '.tmp/STEMROBIN-181/d1817/root/10p';
const id = 'phy10-c3-s2-n124';
const read = file => JSON.parse(fs.readFileSync(file));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file) });
const sourcePath = `${scratch}/d041-n124-source-pass.json`;
const textPath = `${ticket}/tmp/d1817-n124-text-review/report.json`;
const domPath = `${ticket}/tmp/d1817-n124-display/result.json`;
const pixelsPath = `${ticket}/tmp/d1817-n124-display-review/report.json`;
const source = read(sourcePath), text = read(textPath), dom = read(domPath), pixels = read(pixelsPath);
assert.equal(source.status, 'PASS-complete-object');
assert.equal(text.overall, 'PASS');
assert.equal(text.SCI.verdict, 'PASS');
assert.equal(text.ZHEN.verdict, 'PASS');
assert.equal(dom.status, 'pass');
assert.equal(dom.records.length, 4);
assert.equal(pixels.overall, 'PASS');
assert.equal(pixels.DISPLAY, 'PASS');
assert.equal(pixels.image_accounting.actual_total_image_opens, 4);
assert.equal(hash(pixels.image_accounting.ledger.path), pixels.image_accounting.ledger.current_sha256);
for (const file of [...source.bindings, ...text.binding.files]) assert.equal(hash(file.path), file.sha256, file.path);
for (const file of pixels.inputs.screenshot_hash_bindings) assert.equal(hash(file.path), file.current_sha256, file.path);
for (const row of dom.records) {
  assert.equal(hash(row.screenshot.path), row.screenshot.sha256);
  assert.equal(hash(row.html.path), row.html.sha256);
}
const products = [];
for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) products.push(bind(`${root}/lessons/${id}/${name}`));
for (const edition of ['modern-us-neutral', 'modern-us-neutral-en']) {
  const dir = `${root}/editions/${edition}/lessons/${id}`;
  assert.equal(read(`${dir}/adaptation.audit.json`).status, 'pass');
  assert.equal(read(`${dir}/exercises.json`).count, 0);
  assert.equal(read(`${dir}/figures.json`).figures.length, 0);
  for (const name of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']) products.push(bind(`${dir}/${name}`));
}
const native = ['d041-n124-zh-first-finalize', 'd041-n124-en-first-finalize',
  'd041-n124-zh-first-render', 'd041-n124-en-first-render', 'd041-n124-first-offline-display']
  .map(name => bind(`${scratch}/native/${name}/receipt.json`));
for (const file of native) assert.equal(read(file.path).exitCode, 0);
assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  '5df63b92ec08385d9b934530483c90019e39b62d');
const file = `${scratch}/d041-n124-complete-ready.json`;
assert(!fs.existsSync(file));
fs.writeFileSync(file, JSON.stringify({
  schema: 'STEMROBIN-181/offline-card-ready@1', batch: 'D041', id,
  status: 'complete-offline-card-awaiting-small-batch',
  gates: { SOURCE: bind(sourcePath), SCI_ZHEN: bind(textPath), DOM: bind(domPath), DISPLAY: bind(pixelsPath), native },
  products, counts: { completeUnbatchedCards: 1, addedDeliveredCards: 0, proseBlocks: 6,
    readingParagraphs: 9, sectionBreaks: 2, writtenQuestions: 0, standards: 0, choices: 0, figures: 0 },
  sourceScope: 'Only p0323#6,#7 and p0324#1,#2,#3,#6; adjacent unit123 glyph HOLD and whole-page approval remain separate.',
  closedAgents: ['01a1f54c-9d24-71a0-8f27-3e760f12877a', '01a1f551-824c-7821-821c-25a817ac2992'],
  parentCollectionRecovery: {
    failedStage: 'First inline DISPLAY receipt collection assumed image_accounting.ledger was an array.',
    actualError: 'TypeError: r.image_accounting.ledger is not iterable',
    diagnosis: 'Report field is a hash-bound ledger-file object; screenshot bindings are in inputs.screenshot_hash_bindings.',
    resolution: 'Read the actual schema and collect those bound bytes. No image reopen, DOM rerun or review repeat.',
  },
  imageUsage: { parentCumulative: 24, parentNewOpens: 0, textReviewerOpens: 0, displayReviewerOpens: 4 },
  paidCalls: 0, databaseWrites: false, productPromotion: false, newCommitOrPush: false,
  wholeProjectChecks: false, deployment: false, formalHandoff: false,
  continue: 'SOURCE330333 observation is active; collect it before another image batch. Target about four complete cards for next selected commit/push.',
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ ready: bind(file), id, completeUnbatchedCards: 1, addedDeliveredCards: 0 }));

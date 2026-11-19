import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck');
const ticket = '.intentfold/tickets/STEMROBIN-181';
const scratch = `${ticket}/tmp/d1814-recovery`;
const root = '.tmp/STEMROBIN-181/d1817/nuclear-root/10p';
const id = 'phy10-c3-s3-n126';
const read = file => JSON.parse(fs.readFileSync(file));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file) });
const sourcePath = `${scratch}/d041-n126-source-pass.json`;
const textPath = `${ticket}/tmp/d1817-n126-text-review/report.json`;
const domPath = `${ticket}/tmp/d1817-n126-display/result.json`;
const pixelsPath = `${ticket}/tmp/d1817-n126-display-review/report.json`;
const ledgerPath = `${ticket}/tmp/d1817-n126-display-review/image-usage-ledger.json`;
const source = read(sourcePath), text = read(textPath), dom = read(domPath), pixels = read(pixelsPath);
assert.equal(source.status, 'PASS-complete-object');
assert.equal(text.overall, 'PASS');
assert.equal(text.SCI.verdict, 'PASS');
assert.equal(text.ZHEN.verdict, 'PASS');
assert.equal(dom.status, 'pass');
assert.equal(dom.records.length, 4);
assert.equal(pixels.overall, 'PASS');
assert.equal(pixels.DISPLAY.verdict, 'PASS');
assert.equal(pixels.boundaryCompliance.imageOpens, 4);
assert.equal(hash(pixelsPath), 'b30bd1ccf2838ba86b5f9c36d7545c8d5ea4bfd8507574b16acb5d53e1d5d69a');
assert.equal(hash(ledgerPath), '51d71a583cb075d2f7ec65ea3d6446ef800bcc3c514ec26b684cd0bb1fc8d3ca');
for (const file of [...source.bindings, ...text.binding.files]) assert.equal(hash(file.path), file.sha256);
for (const image of pixels.images) {
  assert.equal(hash(image.screenshot.path), image.screenshot.currentSHA256);
  assert.equal(hash(image.html.path), image.html.currentSHA256);
}
for (const record of dom.records) {
  assert.equal(hash(record.screenshot.path), record.screenshot.sha256);
  assert.equal(hash(record.html.path), record.html.sha256);
}
const products = ['lesson.json', 'lesson.md', 'exercises.json'].map(name => bind(`${root}/lessons/${id}/${name}`));
for (const edition of ['modern-us-neutral', 'modern-us-neutral-en']) {
  const directory = `${root}/editions/${edition}/lessons/${id}`;
  assert.equal(read(`${directory}/adaptation.audit.json`).status, 'pass');
  for (const name of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']) {
    products.push(bind(`${directory}/${name}`));
  }
}
const native = ['d041-n126-zh-first-finalize', 'd041-n126-en-first-finalize',
  'd041-n126-zh-first-render', 'd041-n126-en-first-render', 'd041-n126-first-offline-display']
  .map(name => bind(`${scratch}/native/${name}/receipt.json`));
for (const record of native) assert.equal(read(record.path).exitCode, 0);
const file = `${scratch}/d041-n126-complete-ready.json`;
fs.writeFileSync(file, JSON.stringify({
  schema: 'STEMROBIN-181/offline-card-ready@1', batch: 'D041', id,
  status: 'complete-offline-card-awaiting-small-batch',
  gates: { SOURCE: bind(sourcePath), SCI_ZHEN: bind(textPath), DOM: bind(domPath),
    DISPLAY: bind(pixelsPath), imageLedger: bind(ledgerPath), native },
  products, counts: { completeUnbatchedCards: 2, addedDeliveredCards: 0, proseBlocks: 3,
    readingParagraphs: { zh: 4, en: 5 }, sectionBreaks: 2, writtenQuestions: 0, standards: 0, choices: 0, figures: 0 },
  sourceScope: 'Only330#3,#4,#5 before actual127 heading330#6; other atomic/nuclear HOLDs unchanged.',
  closedDisplayAgent: '01a1f56b-a87c-73a0-bd28-bc9a3986486c',
  imageUsage: { parentCumulative: 24, parentNewOpens: 0, textReviewerOpens: 0, displayReviewerOpens: 4 },
  paidCalls: 0, databaseWrites: false, productPromotion: false, newCommitOrPush: false,
  wholeProjectChecks: false, deployment: false, formalHandoff: false,
  continue: 'n128 authoring; next SOURCE338341 after closed DISPLAY batch. Around four eligible cards per push.',
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ ready: bind(file), id, completeUnbatchedCards: 2, addedDeliveredCards: 0 }));

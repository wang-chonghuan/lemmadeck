import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck');
const ticket = '.intentfold/tickets/STEMROBIN-181';
const scratch = `${ticket}/tmp/d1814-recovery`;
const root = '.tmp/STEMROBIN-181/d1817/n128-root/10p';
const id = 'phy10-c3-s3-n128';
const read = file => JSON.parse(fs.readFileSync(file));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file) });
const verify = row => assert.equal(hash(row.path), row.sha256, row.path);
const sourcePath = `${scratch}/d041-n128-source-pass.json`;
const originalPath = `${ticket}/tmp/d1817-n128-text-review/report.json`;
const affectedPath = `${ticket}/tmp/d1817-n128-history-review/report.json`;
const repairPath = `${scratch}/d041-n128-history-repair.json`;
const domPath = `${ticket}/tmp/d1817-n128-display-affected/result.json`;
const displayPath = `${ticket}/tmp/d1817-n128-display-review/report.json`;
const ledgerPath = `${ticket}/tmp/d1817-n128-display-review/image-usage-ledger.json`;
const source = read(sourcePath), first = read(originalPath), affected = read(affectedPath);
const repair = read(repairPath), dom = read(domPath), display = read(displayPath), ledger = read(ledgerPath);
assert.equal(hash(sourcePath), 'f81dd84cb9c14441916f9c788865c48b93612cc727b17a117565176386cb60ec');
assert.equal(hash(originalPath), 'dca8fd80e588f1638d358f7aeb0881be3d5856359e579e4977003dc701153b16');
assert.equal(hash(affectedPath), 'af2b12278332a898d65b9342a81a40493c9f806fe865d33ea25eba8a61b4a22d');
assert.equal(hash(displayPath), '884bc006282994c6d47e4a7bc46e469b56a64082a55bad9471d748cbce76d965');
assert.equal(hash(ledgerPath), '327d7d6cfbe1e3b1d037b4b0ad48dc70f66549305ab8defe3b02fdcb6e9651e8');
assert.equal(source.status, 'PASS-complete-object');
assert.equal(first.SCI.verdict, 'PASS');
assert.equal(first.ZHEN.verdict, 'FAIL');
assert.equal(affected.overall, 'PASS');
assert.equal(affected.affectedSCI.verdict, 'PASS');
assert.equal(affected.affectedZHEN.verdict, 'PASS');
verify(affected.composeWith);
verify(affected.repairReceipt);
assert.deepEqual(affected.resolvedFindings.map(row => row.id).sort(), ['ZHEN-01', 'ZHEN-02']);
assert(affected.resolvedFindings.every(row => row.verdict === 'RESOLVED'));
assert.deepEqual(affected.changeScopeProof.outsideScopeChanges, []);
for (const row of [...source.bindings, ...affected.finalFileBindings]) verify(row);
for (const row of first.finalFileBindings) {
  if (hash(row.path) === row.sha256) continue;
  const edition = row.path.includes('/modern-us-neutral-en/') ? 'modern-us-neutral-en' : 'modern-us-neutral';
  const snapshot = `${scratch}/d041-n128-history-first-candidate/${edition}/${row.path.split('/').at(-1)}`;
  assert.equal(hash(snapshot), row.sha256, snapshot);
}
const snapshots = [];
for (const record of repair.records) {
  for (const row of [...record.originals, record.beforeTemplate, record.afterTemplate, record.outline]) {
    verify(row);
    snapshots.push(row);
  }
}
for (const row of repair.priorDisplay) {
  verify(row.snapshot);
  snapshots.push(row.snapshot);
}
verify(repair.firstDOMReport);
const oldDom = read(repair.firstDOMReport.path);
for (const row of oldDom.records) {
  verify(row.screenshot);
  const archived = repair.priorDisplay.find(item => item.originalPath === row.html.path);
  assert(archived);
  assert.equal(archived.snapshot.sha256, row.html.sha256);
}
assert.equal(dom.status, 'pass');
assert.equal(dom.records.length, 4);
assert.equal(display.overall, 'PASS');
assert.equal(display.DISPLAY.verdict, 'PASS');
assert.equal(ledger.totalOpens, 4);
assert.equal(ledger.reopens, 0);
verify(display.authority);
for (const row of dom.records) {
  verify(row.screenshot);
  verify(row.html);
  assert.equal(row.sourceBlocks, 7);
  assert.equal(row.sectionBreaks, 3);
  assert.equal(row.paragraphs, row.locale === 'zh' ? 12 : 13);
}
for (const row of display.images) {
  assert.equal(hash(row.screenshot.path), row.screenshot.actualSha256);
  assert.equal(hash(row.html.path), row.html.actualSha256);
}
const products = ['lesson.json', 'lesson.md', 'exercises.json'].map(name => bind(`${root}/lessons/${id}/${name}`));
for (const edition of ['modern-us-neutral', 'modern-us-neutral-en']) {
  const directory = `${root}/editions/${edition}/lessons/${id}`;
  assert.equal(read(`${directory}/adaptation.audit.json`).status, 'pass');
  for (const name of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']) {
    products.push(bind(`${directory}/${name}`));
  }
}
const native = ['d041-n128-zh-history-affected-finalize', 'd041-n128-en-history-affected-finalize',
  'd041-n128-zh-history-affected-render', 'd041-n128-en-history-affected-render',
  'd041-n128-history-affected-offline-display'].map(name => bind(`${scratch}/native/${name}/receipt.json`));
for (const row of native) assert.equal(read(row.path).exitCode, 0);
const output = `${scratch}/d041-n128-complete-ready.json`;
fs.writeFileSync(output, JSON.stringify({
  schema: 'STEMROBIN-181/offline-card-ready@1', batch: 'D041', id,
  status: 'complete-offline-card-awaiting-small-batch',
  gates: { SOURCE: bind(sourcePath), SCI_ZHEN: [bind(originalPath), bind(affectedPath)],
    HISTORY: bind(repairPath), DOM: bind(domPath), DISPLAY: bind(displayPath), imageLedger: bind(ledgerPath), native },
  reviewComposition: {
    SCI: 'Original independent SCI PASS plus affected historical-relation PASS.',
    ZHEN: 'Original unaffected decisions plus affected PASS resolving ZHEN-01 and ZHEN-02 only.',
    originalFailureRetained: true, fullReviewRepeated: false, substantiveRevisions: 1,
  },
  products, snapshots, counts: { completeUnbatchedCards: 3, addedDeliveredCards: 0,
    proseBlocks: 7, readingParagraphs: { zh: 12, en: 13 }, sectionBreaks: 3,
    writtenQuestions: 0, standards: 0, choices: 0, figures: 0 },
  sourceScope: '335#7;336#1,#2;336#3+337#1;337#2,#3,#4. Actual heading335#6, right boundary337#5. All other HOLDs unchanged.',
  closedDisplayAgent: '01a1f57d-7bce-7d43-9117-55c19ed26441',
  imageUsage: { parentCumulative: 24, parentNewOpens: 0, textReviewerOpens: 0,
    affectedTextReviewerOpens: 0, displayReviewerOpens: 4 },
  paidCalls: 0, databaseWrites: false, productPromotion: false, newCommitOrPush: false,
  wholeProjectChecks: false, deployment: false, formalHandoff: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ ready: bind(output), id, completeUnbatchedCards: 3, addedDeliveredCards: 0 }));

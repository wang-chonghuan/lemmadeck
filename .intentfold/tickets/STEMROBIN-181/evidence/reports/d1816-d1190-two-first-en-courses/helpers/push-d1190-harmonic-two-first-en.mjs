import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const task = 'D1190', tag = task.toLowerCase();
const branch = 'codex/STEMROBIN-181-textbooks';
const previous = `${ticket}/evidence/reports/d1816-d1167-three-first-en-courses/actual-push.json`;
const base = read(previous).head;
const book = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/10p`;
const edition = `${book}/editions/modern-us-neutral-en`;
const batches = [
  ['phy10-c1-s2-n9', 'd1816-d1188-n9-first-complete-en'],
  ['phy10-c1-s2-n15', 'd1816-d1189-n15-first-complete-en'],
];
const cards = batches.map(([card]) => card);
const readyFiles = batches.map(([, directory]) => `${ticket}/evidence/reports/${directory}/batch-ready.json`);
const ready = readyFiles.map(read);
const imageLedger = read(ready[0].imageLedger.path);
assert.equal(imageLedger.actualLifetimeImagesOpened, 15);
const gitRead = argv => {
  const result = spawnSync('git', argv, { cwd: repo, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
};
assert.equal(gitRead(['rev-parse', 'HEAD']), base);
assert.equal(gitRead(['diff', '--cached', '--name-only']), '');
for (const [index, item] of ready.entries()) {
  assert.deepEqual(item.cards, [cards[index]]);
  assert.equal(item.newCompleteCourses, 0);
  assert.equal(item.newSourcePages, 0);
  assert.equal(read(item.pixelReview.path).status, 'PASS');
  for (const file of [item.pixelReview, item.imageLedger,
    ...item.products.filter(product => !product.path.endsWith('/book.json'))])
    assert.equal(bind(file.path).sha256, file.sha256);
}
const indexFile = `${edition}/book.json`;
const before = JSON.parse(gitRead(['show', `${base}:${path.relative(repo, indexFile)}`]));
const after = read(indexFile);
assert.deepEqual(after.lessons.filter(row => !cards.includes(row.id)), before.lessons);
assert.deepEqual({ ...after, lessons: [] }, { ...before, lessons: [] });
assert(cards.every(card => after.lessons.filter(row => row.id === card).length === 1));
const out = `${ticket}/evidence/reports/d1816-d1190-two-first-en-courses`;
const scratch = `${ticket}/tmp/d1816-d1190-delivery`;
fs.mkdirSync(out, { recursive: false });
fs.mkdirSync(scratch, { recursive: false });
const previousCall = read(read(previous).nativeReceipt.path);
copy(read(previous).nativeReceipt.path, `${out}/previous-push/receipt.original.json`);
for (const [key, file] of Object.entries(previousCall.streams))
  copy(file.path, `${out}/previous-push/${key}.original.txt`);
for (const name of [
  'n42-native.mjs', 'correct-d1193-n9-turning-point-sentence.mjs',
  'finalize-d997-n72-first-en.mjs', 'display-d998-n72-first-en-full-course.mjs',
  'bind-d1015-n73-original-svg-display-widths.mjs', 'retain-d1000-n72-first-complete-en.mjs',
  'check-d1024-n73-mobile-equation-scroll-end.mjs',
  'validate-d1000-n72-retained-tuples.py', 'update-edition-index.py',
  'record-ordinary-en-extension-push.mjs', 'push-d1190-harmonic-two-first-en.mjs',
]) copy(`${ticket}/tmp/d1816-recovery/${name}`, `${out}/helpers/${name}`);
save(`${out}/batch-ready.json`, {
  task, base, branch, cards, ready: readyFiles.map(bind), previousPushReceipt: bind(previous),
  nativeIndex: bind(indexFile), originalObjects: 19, originalTasks: 0, originalFigures: 3,
  actualIndependentImages: imageLedger.actualLifetimeImagesOpened, batches: [8, 6, 1],
  newCompleteCourses: 0, newSourcePages: 0, totals: { completeCourses: 153, sourcePages: 581 },
  originalN9SentenceSplitFindingAndAffectedOnlyRepairRetained: true,
  originalN9MobileFormulaPixelReviseRetained: true,
  mobileFormulaCompleteThroughExistingHorizontalScroll: true,
  entireLongFormulaFitsSimultaneouslyInMobileFrame: false,
  unchangedSourceChineseAndSvgGeometryReused: true, rendererCallsForExistingFigures: 0,
  actualMediaWidths: [358, 640], browserMode: 'isolated-headless',
  headedAcceptanceClaimed: false, fullResolutionAllGlyphCertification: false,
  completeEnglishAccessibilityApproval: false, force: false, databaseWrites: 0, paidCalls: 0,
  formalHandoff: false, scopeCompleted: false, continuousProduction: true,
});
const meterFile = `${ticket}/production-meter.json`, reviewFile = `${ticket}/review.md`;
copy(meterFile, `${scratch}/production-meter.before.json`);
copy(reviewFile, `${scratch}/review.before.md`);
const meter = read(meterFile);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 153);
assert.equal(meter.sourcePagesFinalized, 581);
for (const [index, item] of ready.entries())
  meter.currentResume1816[item.task] = {
    status: 'FIRST_COMPLETE_EN_EDITION_CANONICAL_RETAINED_READY',
    ready: bind(readyFiles[index]), newCompleteCourses: 0, newSourcePages: 0,
  };
meter.currentResume1816.D1190 = {
  status: 'TWO_FIRST_COMPLETE_EN_EDITIONS_READY_FOR_ORDINARY_PUSH',
  ready: bind(`${out}/batch-ready.json`), newCompleteCourses: 0, newSourcePages: 0,
};
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
fs.appendFileSync(reviewFile,
  '\nD1175-D1194: 10pN9/N15 FIRST complete English editions retained;19originalobjects/33savedparagraphs/0tasks/3unchangedSVGfigures. Exact D005/D006 source/Chinese/native/science/figure approvals reused. N9 first text REVISE and original drafts retained; only positive/negative turning-point sentence punctuation/capitalization repaired with affected-only native/independent PASS. N15 first English text PASS. N9 original mobile formula PX1 REVISE retained; only existing horizontal-scroll terminal reachability checked with one new affected screenshot and independent PASS, no simultaneous whole-formula containment claim or content/HTML/renderer change. FIRST nativefinalize/render/desktop1440x960/mobile390x844 isolatedheadlessDOM/composed savedpixels PASS; actual358/640mediawidth metadata bound without rerender. Literal Chinese source section fields retained; completeEnglishaccessibility/headed/allglyph approval not claimed. Canonical/index bindings PASS, all source/Chinese/otherEnglish rows/header unchanged. Previous actualpushreceipt included in substantive delivery, no receipt-onlycommit. Totals153/581 unchanged; all genuine HOLDs retained, no unrelateddirty/skill/broadtests/DB/paid/force/merge/deploy/formalhandoff/scopecompletion.\n');
const files = new Set();
function collect(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    assert(!entry.isSymbolicLink());
    if (entry.isDirectory()) collect(file);
    else { assert(entry.isFile()); files.add(path.relative(repo, file)); }
  }
}
for (const directory of [
  ...readyFiles.map(file => path.dirname(file)), out, ...cards.map(card => `${edition}/lessons/${card}`),
]) collect(directory);
for (const item of ready)
  for (const product of item.products) files.add(path.relative(repo, product.path));
for (const file of [previous, indexFile, meterFile, reviewFile]) files.add(path.relative(repo, file));
const list = [...files].sort();
assert(list.every(file => !/(^|\/)\.env($|\/)|\/skills\/|\/tmp\//.test(file)));
save(`${scratch}/manifest.json`, list);
run(`${tag}-sync-existing-delivery-branch`, ['git', 'fetch', 'origin', branch]);
assert.equal(gitRead(['rev-parse', 'FETCH_HEAD']), base);
const pathspec = `${scratch}/delivery.pathspec`;
fs.writeFileSync(pathspec, list.join('\0') + '\0', { flag: 'wx' });
run(`${tag}-stage-exact-manifest`, ['git', 'add', '--pathspec-from-file', pathspec, '--pathspec-file-nul']);
const staged = gitRead(['diff', '--cached', '--name-only']).split('\n').filter(Boolean);
assert(staged.length && staged.every(file => list.includes(file)));
run(`${tag}-ordinary-substantive-commit`, [
  'git', 'commit', '-m', 'STEMROBIN-181: complete N9 and N15 English editions offline',
]);
const head = gitRead(['rev-parse', 'HEAD']);
save(`${scratch}/committed.json`, { task, base, head, branch, files: staged.length });
run(`${tag}-explicit-ordinary-push`, ['git', 'push', 'origin', `HEAD:refs/heads/${branch}`]);
save(`${scratch}/push-exited.json`, {
  task, head, branch, files: staged.length, force: false, exitCode: 0,
  independentRemoteVerificationPending: true,
});
console.log(JSON.stringify({ head, files: staged.length, independentRemoteVerificationPending: true }));

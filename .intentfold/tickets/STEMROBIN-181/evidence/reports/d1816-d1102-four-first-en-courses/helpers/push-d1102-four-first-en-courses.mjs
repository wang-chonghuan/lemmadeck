import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const kineticNext = process.argv[2] === 'kinetic-four';
assert(process.argv[2] === undefined || kineticNext);
const task = kineticNext ? 'D1121' : 'D1102', tag = task.toLowerCase();
const branch = 'codex/STEMROBIN-181-textbooks';
const previous = `${ticket}/evidence/reports/${kineticNext
  ? 'd1816-d1102-four-first-en-courses' : 'd1816-d1078-two-first-en-courses'}/actual-push.json`;
const base = read(previous).head;
const out = `${ticket}/evidence/reports/d1816-${tag}-four-first-en-courses`;
const scratch = `${ticket}/tmp/d1816-${tag}-delivery`;
const reviewerTask = kineticNext ? 'D1110' : 'D1089';
const batches = kineticNext ? [
  ['phy9-c1-s3-n33', 'd1816-d1118-n33-first-complete-en'],
  ['phy9-c1-s3-n36', 'd1816-d1119-n36-first-complete-en'],
  ['phy9-c1-s4-n37', 'd1816-d1120-n37-first-complete-en'],
  ['phy9-c1-s5-n45', 'd1816-d1128-n45-first-complete-en'],
] : [
  ['phy9-c1-s2-n27', 'd1816-d1098-n27-first-complete-en'],
  ['phy9-c1-s2-n28', 'd1816-d1099-n28-first-complete-en'],
  ['phy9-c1-s3-n30', 'd1816-d1100-n30-first-complete-en'],
  ['phy9-c1-s3-n31', 'd1816-d1101-n31-first-complete-en'],
];
const cards = batches.map(([card]) => card);
const readyFiles = batches.map(([, directory]) => `${ticket}/evidence/reports/${directory}/batch-ready.json`);
const gitRead = args => {
  const result = spawnSync('git', args, { cwd: repo, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
};
assert.equal(gitRead(['rev-parse', 'HEAD']), base);
const ready = readyFiles.map(read);
for (const [index, item] of ready.entries()) {
  assert.deepEqual(item.cards, [cards[index]]);
  assert.equal(item.newCompleteCourses, 0);
  assert.equal(item.newSourcePages, 0);
  assert.equal(read(item.pixelReview.path).status, 'PASS');
  assert.equal(bind(item.pixelReview.path).sha256, item.pixelReview.sha256);
  assert.equal(bind(item.imageLedger.path).sha256, item.imageLedger.sha256);
  for (const product of item.products.filter(product => !product.path.endsWith('/book.json')))
    assert.equal(bind(product.path).sha256, product.sha256);
}
const book = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/9p`;
const indexFile = `${book}/editions/modern-us-neutral-en/book.json`;
const before = JSON.parse(gitRead(['show', `${base}:${path.relative(repo, indexFile)}`]));
const after = read(indexFile);
assert.deepEqual(after.lessons.filter(row => !cards.includes(row.id)), before.lessons);
assert.deepEqual({ ...after, lessons: [] }, { ...before, lessons: [] });
assert(cards.every(card => after.lessons.filter(row => row.id === card).length === 1));
const reviewerClose = `${ticket}/tmp/d1816-${kineticNext ? 'd1128' : 'd1101'}-reviewer-closed.json`;
const closure = read(reviewerClose);
assert.equal(closure.closed, true);
assert(closure.actualImages <= 24);
assert.equal(closure.actualImages, closure.batches.reduce((sum, count) => sum + count, 0));
assert(closure.batches.every(count => count <= 8));
fs.mkdirSync(out, { recursive: false });
fs.mkdirSync(scratch, { recursive: false });
copy(reviewerClose, `${out}/reviewer-closed.original.json`);
const receivedHandoffs = [];
for (const handoff of closure.receivedHandoffs || []) {
  assert.equal(bind(handoff.path).sha256, handoff.sha256);
  const destination = `${out}/review/${path.basename(handoff.path)}`;
  copy(handoff.path, destination);
  receivedHandoffs.push({ original: handoff, retained: bind(destination) });
}
const previousNative = read(previous).nativeReceipt, previousCall = read(previousNative.path);
copy(previousNative.path, `${out}/previous-push/receipt.original.json`);
for (const [key, file] of Object.entries(previousCall.streams)) {
  assert.equal(bind(file.path).sha256, file.sha256);
  copy(file.path, `${out}/previous-push/${key}.original.txt`);
}
for (const name of [
  'n42-native.mjs', 'prepare-d1067-early-9p-first-en.mjs', 'author-d1068-early-9p-first-en.mjs',
  'finalize-d997-n72-first-en.mjs', 'display-d998-n72-first-en-full-course.mjs',
  'retain-d1000-n72-first-complete-en.mjs', 'update-edition-index.py',
  'record-ordinary-en-extension-push.mjs', 'push-d1102-four-first-en-courses.mjs',
  ...(kineticNext ? ['correct-d1111-n36-three-citation-identities.mjs'] : []),
  ...(!kineticNext ? ['correct-d1123-n30-interaction-effects.mjs'] : []),
]) copy(`${ticket}/tmp/d1816-recovery/${name}`, `${out}/helpers/${name}`);
save(`${out}/batch-ready.json`, {
  task, base, branch, cards, ready: readyFiles.map(bind),
  previousPushReceipt: bind(previous), nativeIndex: bind(indexFile),
  originalObjects: ready.reduce((sum, item) => sum + item.originalObjects, 0),
  originalTasks: 0, originalFigures: 0,
  actualIndependentImages: closure.actualImages, batches: closure.batches, parentNewImages: 0,
  newCompleteCourses: 0, newSourcePages: 0, totals: { completeCourses: 153, sourcePages: 581 },
  reviewerClosed: bind(`${out}/reviewer-closed.original.json`),
  receivedHandoffs,
  historicalChineseScienceNativeAndDeliveryReused: kineticNext ? ['D-010', 'D-011', 'D-013'] : ['D-009', 'D-010'],
  ...(kineticNext
    ? { n36OriginalThreeBareCitationIdentityFailuresPreservedAndAffectedOnlyRepaired: true }
    : { registeredCalorimeterAndCarnotPublicationCorrectionsPreserved: true,
      n30OriginalInteractionEffectsFindingPreservedAndAffectedOnlyReviewed: true }),
  sourceNullSectionsRetained: kineticNext ? ['n33', 'n36', 'n37', 'n45'] : ['n30', 'n31'],
  sourceAndAllChineseProductsAndOtherEnglishRowsUnchanged: true,
  firstEnglishScienceZhEnNativeAndDisplay: true,
  browserMode: 'isolated-headless', headedAcceptanceClaimed: false,
  suppliedViewLimitsPreserved: true, fullResolutionAllGlyphCertification: false,
  completeEnglishAccessibilityApproval: false,
  noSkillOrUnrelatedDirtyBytes: true, force: false, databaseWrites: 0, paidCalls: 0,
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
    status: 'FIRST_COMPLETE_EN_CANONICAL_RETAINED_READY', cards: item.cards,
    ready: bind(readyFiles[index]), newCompleteCourses: 0, newSourcePages: 0,
  };
Object.assign(meter.currentResume1816, {
  [reviewerTask]: { status: 'FIRST_EN_INDEPENDENT_SCI_ZHEN_READABILITY_AND_BOUNDED_PIXELS_PASS',
    actualImages: closure.actualImages, closed: bind(`${out}/reviewer-closed.original.json`) },
  [task]: { status: 'FIRST_COMPLETE_VISIBLE_EN_EDITIONS_READY_FOR_ORDINARY_PUSH',
    ready: bind(`${out}/batch-ready.json`), newCompleteCourses: 0, newSourcePages: 0 },
  ...(!kineticNext ? {
    D1123: { status: 'N30_ONE_INTERACTION_EFFECTS_PHRASE_AND_MATCHING_ANCHOR_AFFECTED_ONLY_NATIVE_REVIEW_PASS',
      originalFindingPreserved: true },
    D1094: { status: 'FIRST_NATIVE_FINALIZE_RENDER_PASS_AFTER_PRE_NATIVE_REVIEW_HASH_DRIFT_INTAKE_RECOVERY',
      firstCLIHashFailureNativeCalls: 0, firstFailurePreserved: true },
  } : {}),
  currentContinuation: kineticNext
    ? `N33/N36/N37/N45 first complete English editions retained;55 original objects,0tasks/figures. Exact D010/D011/D013 source/Chinese/native/SCI approvals reused. N36 original three bare-citation failures preserved, citation-only affected native repair passed before first independent EN review. Source null sections retained. FIRST EN SCI/ZHEN/native/headless DOM/supplied pixels PASS. Reviewer closed${closure.actualImages}/24,batches${closure.batches.join('+')},parent0. Totals153/581 unchanged; genuine HOLDs and authorized production continue.`
    : `N27/N28/N30/N31 first complete English editions retained;48 original objects,0tasks/figures. Exact D009/D010 source/Chinese/native/SCI approvals reused. Calorimeter700-to420 and publication1832-to1824 corrections retained; birth1796/death1832 remain. Source null section N30/N31 retained. FIRST EN SCI/ZHEN/native/headless DOM/supplied pixels PASS. Reviewer closed${closure.actualImages}/24,batches${closure.batches.join('+')},parent0. Totals153/581 unchanged; genuine HOLDs and authorized production continue.`,
});
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
fs.appendFileSync(reviewFile,
  kineticNext
    ? `\nD1104-D1121,D1124-D1128: N33/N36/N37/N45 FIRST complete visible English editions retained;55originalobjects,0tasks/figures. D010/D011/D013 delivered source/Chinese/native/science and original mechanical corrections reused, not replayed. N36 first bare-citation identity failures retained and only three citations repaired before independent first EN review. All four source sectionnull retained. First EN SCI/ZHEN/readability/nativefinalize/render/desktop1440x960/mobile390x844 isolatedheadless DOM/suppliedpixels PASS. Reviewer closed${closure.actualImages}/24,batches${closure.batches.join('+')},parent0reopens/crops. Nativecanonicalbindings/index insertions PASS. Exactmanifest substantive delivery retains failures/affected repairs and previous actualpushreceipt. Totals153/581 unchanged; all HOLDs/cost/headless/longpreview/fineglyph limits retained. No receipt-onlycommit/unrelateddirty/skills/force/DB/paid/broadtests/merge/deploy/formalhandoff/scopecompletion; continuousproduction continues.\n`
    : `\nD1081-D1102: N27/N28/N30/N31 FIRST complete visible English editions retained;48originalobjects,0tasks/figures. D009/D010 delivered source/Chinese/native/science and original corrections reused, not replayed. N28 calorimeter700-to420 and Carnot publication1832-to1824 retained; birth1796/death1832 unchanged. N30/N31 source sectionnull preserved without invented Chapter3 crumb. First EN SCI/ZHEN/readability/nativefinalize/render/desktop1440x960/mobile390x844 isolatedheadless DOM/suppliedpixels PASS. Reviewer closed${closure.actualImages}/24,batches${closure.batches.join('+')},parent0reopens/crops. Nativecanonicalbindings/index insertions PASS. Exactmanifest substantive delivery includes original failures and affected repairs where required plus previous actualpushreceipt, not a receipt-onlycommit. Totals153/581 unchanged; original HOLDs/cost telemetry and headless/longpreview/fineglyph limits remain. No unrelateddirty/skills/force/DB/paid/broadtests/merge/deploy/formalhandoff/scopecompletion; continuousproduction continues.\n`);
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
  ...readyFiles.map(file => path.dirname(file)), out,
  ...cards.map(card => `${book}/editions/modern-us-neutral-en/lessons/${card}`),
]) collect(directory);
for (const item of ready)
  for (const product of item.products) files.add(path.relative(repo, product.path));
for (const file of [previous, indexFile, meterFile, reviewFile]) files.add(path.relative(repo, file));
const list = [...files].sort();
assert(list.every(file => !/(^|\/)\.env($|\/)|\/skills\/|\/tmp\//.test(file)));
save(`${scratch}/manifest.json`, list);
assert.equal(gitRead(['diff', '--cached', '--name-only']), '');
run(`${tag}-sync-existing-delivery-branch`, ['git', 'fetch', 'origin', branch]);
assert.equal(gitRead(['rev-parse', 'FETCH_HEAD']), base);
const pathspec = `${scratch}/delivery.pathspec`;
fs.writeFileSync(pathspec, list.join('\0') + '\0', { flag: 'wx' });
run(`${tag}-stage-exact-manifest`, ['git', 'add', '--pathspec-from-file', pathspec, '--pathspec-file-nul']);
const staged = gitRead(['diff', '--cached', '--name-only']).split('\n').filter(Boolean);
assert(staged.length && staged.every(file => list.includes(file)));
assert(staged.every(file => !/(^|\/)\.env($|\/)|\/skills\/|\/tmp\//.test(file)));
run(`${tag}-ordinary-substantive-commit`, [
  'git', 'commit', '-m', kineticNext
    ? 'STEMROBIN-181: complete four first kinetic and surface-physics English editions offline'
    : 'STEMROBIN-181: complete four first thermal-physics English editions offline',
]);
const head = gitRead(['rev-parse', 'HEAD']);
save(`${scratch}/committed.json`, { task, base, head, branch, files: staged.length });
run(`${tag}-explicit-ordinary-push`, ['git', 'push', 'origin', `HEAD:${branch}`]);
save(`${scratch}/push-exited.json`, {
  task, head, branch, files: staged.length, force: false, exitCode: 0,
  independentRemoteVerificationPending: true,
});
console.log(JSON.stringify({ head, files: staged.length, independentRemoteVerificationPending: true }));

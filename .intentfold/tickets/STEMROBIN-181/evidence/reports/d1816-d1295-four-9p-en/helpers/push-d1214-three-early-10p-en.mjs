import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const task = process.argv[2] || 'D1214', tag = task.toLowerCase(), branch = 'codex/STEMROBIN-181-textbooks';
assert(['D1214', 'D1229', 'D1259', 'D1295'].includes(task));
const currentFour = task === 'D1259';
const generatedFour = task === 'D1295', four9p = currentFour || generatedFour;
const previous = `${ticket}/evidence/reports/${generatedFour ? 'd1816-d1259-four-9p-en'
  : currentFour ? 'd1816-d1229-n2-first-complete-en' : task === 'D1229'
  ? 'd1816-d1214-three-early-10p-en' : 'd1816-d1190-two-first-en-courses'}/actual-push.json`;
const base = read(previous).head;
const edition = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/${four9p ? '9p' : '10p'}/editions/modern-us-neutral-en`;
const batchPaths = (generatedFour ? [
  'd1816-d1269-n97-first-complete-en', 'd1816-d1280-n1-first-complete-en',
  'd1816-d1287-n2-first-complete-en', 'd1816-d1294-n3-first-complete-en',
] : currentFour ? [
  'd1816-d1243-n4-first-complete-en', 'd1816-d1244-n16-first-complete-en',
  'd1816-d1257-n7-first-complete-en', 'd1816-d1258-n49-first-complete-en',
] : task === 'D1229' ? ['d1816-d1223-n2-first-complete-en'] : [
  'd1816-d1201-introduction-first-complete-en',
  'd1816-d1213-n1-first-complete-en',
  'd1816-d1212-n4-first-complete-en',
]).map(name => `${ticket}/evidence/reports/${name}/batch-ready.json`);
const ready = batchPaths.map(read), cards = ready.flatMap(item => item.cards);
const gitRead = args => {
  const result = spawnSync('git', args, { cwd: repo, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
};
assert.equal(gitRead(['rev-parse', 'HEAD']), base);
assert.equal(gitRead(['diff', '--cached', '--name-only']), '');
for (const item of ready) {
  assert.equal(item.newCompleteCourses, 0);
  assert.equal(item.newSourcePages, 0);
  assert.equal(read(item.pixelReview.path).status, 'PASS');
  for (const file of [item.pixelReview, item.imageLedger,
    ...item.products.filter(product => !product.path.endsWith('/book.json'))])
    assert.equal(bind(file.path).sha256, file.sha256);
}
const indexFile = `${edition}/book.json`;
const before = JSON.parse(gitRead(['show', `${base}:${path.relative(repo, indexFile)}`])), after = read(indexFile);
assert.deepEqual(after.lessons.filter(row => !cards.includes(row.id)), before.lessons);
assert.deepEqual({ ...after, lessons: [] }, { ...before, lessons: [] });
assert(cards.every(card => after.lessons.filter(row => row.id === card).length === 1));
const out = `${ticket}/evidence/reports/${generatedFour ? 'd1816-d1295-four-9p-en'
  : currentFour ? 'd1816-d1259-four-9p-en' : task === 'D1229'
  ? 'd1816-d1229-n2-first-complete-en' : 'd1816-d1214-three-early-10p-en'}`;
const scratch = `${ticket}/tmp/d1816-${tag}-delivery`;
fs.mkdirSync(out, { recursive: false });
fs.mkdirSync(scratch, { recursive: false });
if (task === 'D1214')
  copy(`${ticket}/tmp/d1816-recovery/d1213-display-helper-recovery.json`,
    `${out}/n1-retention-helper-recovery.original.json`);
if (currentFour)
  copy(`${ticket}/tmp/d1816-d1245-next-two-en-inventory/result.json`,
    `${out}/received-n7-n49-evidence-inventory.original.json`);
if (generatedFour) {
  copy(`${ticket}/tmp/d1816-d1272-next-three-en-inventory/result.json`,
    `${out}/received-n1-n2-n3-evidence-inventory.original.json`);
  copy(`${ticket}/tmp/d1816-d1273-n97-progress/result.json`,
    `${out}/n97-current-progress.original.json`);
}
const previousCall = read(read(previous).nativeReceipt.path);
copy(read(previous).nativeReceipt.path, `${out}/previous-push/receipt.original.json`);
for (const [key, file] of Object.entries(previousCall.streams))
  copy(file.path, `${out}/previous-push/${key}.original.txt`);
for (const name of generatedFour ? [
  'n42-native.mjs', 'prepare-d1067-early-9p-first-en.mjs',
  'author-d1068-early-9p-first-en.mjs', 'texts-d1275-n1-n2-n3.mjs',
  'texts-d1247-n7-n49.mjs', 'texts-d1136-n56-n57.mjs',
  'texts-d1158-10p-n10.mjs', 'texts-d1179-n9-n15.mjs',
  'repair-d1271-n97-two-findings.mjs', 'record-d1273-n97-progress.mjs',
  'repair-d1299-n3-three-readability-findings.mjs',
  'repair-d1300-n1-two-findings.mjs',
  'repair-d1301-n2-four-findings.mjs',
  'repair-d1302-n3-caption-label.mjs',
  'repair-d1304-unnumbered-source-labels.mjs',
  'finalize-d997-n72-first-en.mjs', 'display-d998-n72-first-en-full-course.mjs',
  'bind-d1015-n73-original-svg-display-widths.mjs',
  'retain-d1000-n72-first-complete-en.mjs', 'validate-d1000-n72-retained-tuples.py',
  'update-edition-index.py', 'record-ordinary-en-extension-push.mjs',
  'push-d1214-three-early-10p-en.mjs',
] : currentFour ? [
  'n42-native.mjs', 'prepare-d1067-early-9p-first-en.mjs',
  'author-d1068-early-9p-first-en.mjs', 'texts-d1247-n7-n49.mjs',
  'texts-d1136-n56-n57.mjs', 'texts-d1158-10p-n10.mjs', 'texts-d1179-n9-n15.mjs',
  'recover-d1233-n16-delivered-science-binding.mjs', 'finalize-d997-n72-first-en.mjs',
  'repair-d1265-n49-source-chapter.mjs',
  'display-d998-n72-first-en-full-course.mjs', 'bind-d1015-n73-original-svg-display-widths.mjs',
  'retain-d1000-n72-first-complete-en.mjs', 'validate-d1000-n72-retained-tuples.py',
  'update-edition-index.py', 'record-ordinary-en-extension-push.mjs',
  'push-d1214-three-early-10p-en.mjs',
] : [
  'n42-native.mjs', 'intro-first-en.mjs', 'display-d1200-introduction-first-en.mjs',
  'retain-d1201-introduction-first-en.mjs', 'prepare-author-d1202-early-oscillators-en.mjs',
  'finalize-d997-n72-first-en.mjs', 'display-d998-n72-first-en-full-course.mjs',
  'display-d1205-n4-first-failed-original.mjs',
  'bind-d1015-n73-original-svg-display-widths.mjs', 'retain-d1000-n72-first-complete-en.mjs',
  'validate-d1000-n72-retained-tuples.py', 'update-edition-index.py',
  'record-ordinary-en-extension-push.mjs', 'push-d1214-three-early-10p-en.mjs',
]) copy(`${ticket}/tmp/d1816-recovery/${name}`, `${out}/helpers/${name}`);
if (task === 'D1229')
  for (const name of ['repair-d1225-n2-horizontal-referent.mjs', 'compose-d1228-n2-pixels.mjs',
    'correct-d1224-n2-paragraph-start.mjs', 'capture-d1231-n2-fig05-caption.mjs'])
    copy(`${ticket}/tmp/d1816-recovery/${name}`, `${out}/helpers/${name}`);
const imageLedgers = ready.map(item => bind(item.imageLedger.path));
save(`${out}/batch-ready.json`, {
  task, base, branch, cards, ready: batchPaths.map(bind), previousPushReceipt: bind(previous),
  nativeIndex: bind(indexFile), originalObjects: ready.reduce((sum, item) => sum + item.originalObjects, 0),
  englishParagraphs: four9p ? ready.reduce((sum, item) => sum + item.views[0].paragraphs, 0)
    : task === 'D1229' ? 18 : 35,
  originalTasks: 0, originalFigures: ready.reduce((sum, item) => sum + item.originalFigures, 0), imageLedgers,
  newCompleteCourses: 0, newSourcePages: 0, totals: { completeCourses: 153, sourcePages: 581 },
  firstEnglishScientificFidelityAndReadabilityReviews: true,
  historicalScienceApprovalInvented: false,
  ...(generatedFour ? {
    historicalChineseScienceGapsPreservedNotPromotedToApproval: true,
    firstAuthorBoundaryPrefixFailuresPreservedAndSelectorOnlyRepaired: true,
    n97TwoTextFindingsPreservedAndAffectedOnlyRepaired: true,
    firstEnglishScienceDoesNotReplayOrApproveHistoricalChineseScience: true,
    unchangedSourceChineseAndGeneratedPixelsReused: true,
    generatedRequestPromptReferenceProvenancePreserved: true,
    n3CaptionLabelRenderFailurePreservedAndMetadataOnlyRepaired: true,
    n1UnnumberedSourceLabelFinalizeFailurePreserved: true,
    n1N2SourceIdentityLabelsRestoredEnglishManifestLabelsRetained: true,
    completeEnglishAriaAccessibilityApproval: false,
  } : currentFour ? {
    n16HistoricalBindingGapRetainedNotPromotedToApproval: true,
    n49FirstChapterMetadataFailurePreservedAndAffectedOnlyRepaired: true,
    firstEnglishScienceDoesNotReplayOrApproveHistoricalChineseScience: true,
  } : {
    introductionGradeDigitNativeFailureAndWordRecoveryPreserved: true,
    n4FirstSharedFigureLabelExpectationFailureAndAffectedDisplayRecoveryPreserved: true,
  }),
  ...(!generatedFour ? { unchangedSourceChineseAndSvgGeometryReused: true } : {}),
  existingFigureRendererCalls: 0, browserMode: 'isolated-headless',
  headedAcceptanceClaimed: false, fullResolutionAllGlyphCertification: false,
  completeEnglishAccessibilityApproval: false,
  force: false, databaseWrites: 0, paidCalls: 0, inputTokens: null, outputTokens: null, costUsd: null,
  formalHandoff: false, scopeCompleted: false, continuousProduction: true,
});
const meterFile = `${ticket}/production-meter.json`, reviewFile = `${ticket}/review.md`;
copy(meterFile, `${scratch}/production-meter.before.json`);
copy(reviewFile, `${scratch}/review.before.md`);
const meter = read(meterFile);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 153);
assert.equal(meter.sourcePagesFinalized, 581);
for (const [i, item] of ready.entries()) meter.currentResume1816[item.task] = {
  status: 'FIRST_COMPLETE_EN_EDITION_CANONICAL_RETAINED_READY',
  ready: bind(batchPaths[i]), newCompleteCourses: 0, newSourcePages: 0,
};
meter.currentResume1816[task] = {
  status: generatedFour ? 'FIRST_COMPLETE_EN_EDITIONS_READY_FOR_ORDINARY_PUSH'
    : 'EARLY_10P_EN_EDITIONS_READY_FOR_ORDINARY_PUSH',
  ready: bind(`${out}/batch-ready.json`), newCompleteCourses: 0, newSourcePages: 0,
};
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
if (task === 'D1214') fs.appendFileSync(reviewFile,
  '\nD1196-D1214: 10p introduction/N1/N4 first complete English editions retained: 26 original objects, 35 final English paragraphs, zero tasks, three unchanged approved SVGs. Exact D002/D003 source/Chinese/native/figure evidence reused; no historical introduction/N1/N4 science approval invented. First English scientific fidelity/readability reviews genuinely assess model-limited mechanical/electromagnetic analogy, free/driven oscillations and damping, signed restoring-force equations and zero acceleration vs velocity. Introduction first grade-digit native failure and English-word recovery retained. N4 source raw figure list is empty but its approved shared fig03 attachment is explicitly preserved; only its own shared-context row translated, other lesson contexts unchanged. First native finalize/render and isolated headless desktop1440x960/mobile390x844 DOM plus independent saved-pixel reviews passed. Existing source/SVG geometry never rerendered; actual media-width bindings retained. Canonical/index exact native bindings passed; all raw/Chinese/otherEnglish rows/header unchanged. Totals153/581 unchanged. No receipt-onlycommit/unrelateddirty/skill/broadtests/DB/paid/force/merge/deploy/formalhandoff/scopecompletion; all genuine source/figure/paid HOLDs and headed/allglyph/accessibility limitations remain.\n');
else if (generatedFour) fs.appendFileSync(reviewFile,
  `\nD1263-D1303: N97/N1/N2/N3 FIRST complete English editions retained offline:43 original objects,${ready.reduce((sum, item) => sum + item.views[0].paragraphs, 0)} final paragraphs,zero tasks,four unchanged independently reviewed generated PNGs. N97/N1/N2/N3 original text findings and affected-only repairs preserved; N1/N2 original ambiguous boundary-prefix failures preserved, unique-selector recovery changes no prose. N3 original finalize PASS/render caption-label failure preserved; only caption metadata repaired and independently reviewed, prose approval reused. FIRST English science/fidelity/readability and generated-context applicability are new reviews, not invented recovery of historical Chinese science. Exact delivered source/Chinese/native bytes and valid generated-image source/inventory/visual/provenance chains reused unchanged. Portrait remains decorative160px; actual instructional and portrait desktop/mobile widths bound independently without regeneration. FIRST native finalize/render, isolated-headless DOM,bounded saved pixels and canonical bindings/index PASS. Prior D1259 actualpushreceipt included in substantive manifest, no receipt-onlycommit. Totals153/581 unchanged; genuine HOLDs and headless/tallpreview/fineglyph/accessibility limits remain. Continue missing authorized production; no unrelateddirty/skills/force/DB/paid/broadtests/merge/deploy/formalhandoff/scopecompletion.\n`);
else if (currentFour) fs.appendFileSync(reviewFile,
  '\nD1233-D1259: 9p N4/N16/N7/N49 FIRST complete English editions retained offline with native source/identity/math/layout/index, desktop1440x960/mobile390x844 isolated-headless DOM and bounded independent saved-pixel evidence. Exact delivered source/fourChineseproducts and unchanged reviewed figures reused; no source/Chinese/figure review replay. N16 exact historical template alias remains unavailable, its gap and first binding result preserved; FIRST English science/fidelity is genuinely new and does not manufacture a recovered Chinese approval. N4 likewise has FIRST English science without assumed historical approval. N7/N49 reuse exact valid independent science/figure chains. All original conditions/examples/registered erratum retained, no tasks invented. Explicit-manifest substantive delivery includes prior actualpushreceipt, no receipt-onlycommit. Totals153/581 unchanged; all genuine HOLDs and headless/preview/fineglyph/accessibility limitations remain. No unrelateddirty/skills/force/DB/paid/broadtests/merge/deploy/formalhandoff/scopecompletion. Continue authorized missing stages after push.\n');
else fs.appendFileSync(reviewFile,
  '\nD1217-D1229/D1231-D1232: N2 first English edition completed offline: 15 original objects, 18 final paragraphs, zero tasks and three unchanged approved SVGs. First independent English REVISE resolved only by explicitly limiting spring-force direction to the horizontal example and mirroring its section anchor; earlier punctuation repair and all unchanged text preserved. First context-shape and source-ARIA expectation failures retained, affected technical recovery only. Native finalize/render and isolated headless desktop/mobile DOM passed; twelve supplied images reviewed in disjoint bounded batches8+2+2 with original preview limits. Fig05 apparatus PASS and missing-caption REVISE retained; only two first caption-inclusive views close that evidence gap. Actual per-figure358/400/640widths bound without rerender. Shared fig03 preserves N4 English context and all four N4 lesson products while adding approved N2 context; prior shared tuple retained. Native canonical bindings/index passed; all source/Chinese/otherEnglish rows/header unchanged. Already D003-counted, totals153/581 unchanged. No DB/paid/skill/broadtest/force/merge/deploy/formalhandoff/scopecompletion; production continues.\n');
const files = new Set();
if (generatedFour) fs.appendFileSync(reviewFile,
  '\nD1304-D1306: N1 first native finalization rejected translated unnumbered source-identity figure labels; actual failure receipt preserved. N1/N2 restore only source label metadata and retain the already-reviewed English labels separately in the display manifest, with independent affected-only metadata review and unchanged text/science/PNG approval reused. N2 known equivalent identity defect fixed before first native finalization; its helper wrong-pointer assertion failure before output/native call is recorded, not a science verdict. N3 caption-only label recovery D1302/D1303 preserves its initial native PASS and render failure. Source ARIA labels for unnumbered figures remain Chinese, so no complete English accessibility approval is claimed.\n');
function collect(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    assert(!entry.isSymbolicLink());
    if (entry.isDirectory()) collect(file);
    else { assert(entry.isFile()); files.add(path.relative(repo, file)); }
  }
}
for (const directory of [...batchPaths.map(file => path.dirname(file)), out,
  ...cards.map(card => `${edition}/lessons/${card}`)]) collect(directory);
for (const item of ready) for (const product of item.products) files.add(path.relative(repo, product.path));
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
  'git', 'commit', '-m', generatedFour
    ? 'STEMROBIN-181: complete N1, N2, N3 and N97 English editions offline'
    : currentFour
    ? 'STEMROBIN-181: complete N4, N7, N16 and N49 English editions offline'
    : task === 'D1229'
    ? 'STEMROBIN-181: complete N2 English edition and preserve shared N4 figure context'
    : 'STEMROBIN-181: complete introduction, N1 and N4 English editions offline',
]);
const head = gitRead(['rev-parse', 'HEAD']);
save(`${scratch}/committed.json`, { task, base, head, branch, files: staged.length });
run(`${tag}-explicit-ordinary-push`, ['git', 'push', 'origin', `HEAD:refs/heads/${branch}`]);
save(`${scratch}/push-exited.json`, {
  task, head, branch, files: staged.length, force: false, exitCode: 0, independentRemoteVerificationPending: true,
});
console.log(JSON.stringify({ head, files: staged.length, independentRemoteVerificationPending: true }));

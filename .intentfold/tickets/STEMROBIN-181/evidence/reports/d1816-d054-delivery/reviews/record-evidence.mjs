import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const W = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), W);
assert.equal(process.env.W, W);
const own = path.join(W, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d059-n14-review');
const tmp = path.join(W, '.intentfold/tickets/STEMROBIN-181/tmp');
const author = path.join(tmp, 'd1816-d054-n14-author');
const repair = path.join(tmp, 'd1816-d058-source307-arrow-repair');
const absolute = p => path.isAbsolute(p) ? p : path.join(W, p);
const read = p => JSON.parse(fs.readFileSync(absolute(p)));
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(absolute(p))).digest('hex');
const bind = p => ({ path: absolute(p), sha256: hash(p) });
const save = (name, value) => {
  const file = path.join(own, name);
  if (fs.existsSync(file)) {
    assert.deepEqual(read(file), value, `Refuse to overwrite different evidence: ${file}`);
    return;
  }
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};
const inputBindings = new Map();
function checkBindings(value) {
  if (!value || typeof value !== 'object') return;
  if (typeof value.path === 'string' && /^[a-f0-9]{64}$/.test(value.sha256 || '')) {
    const p = absolute(value.path);
    assert.equal(hash(p), value.sha256, p);
    inputBindings.set(p, bind(p));
  }
  for (const child of Object.values(value)) checkBindings(child);
}
function diff(a, b, pointer = '') {
  if (JSON.stringify(a) === JSON.stringify(b)) return [];
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    return [...new Set([...Object.keys(a), ...Object.keys(b)])]
      .flatMap(k => diff(a[k], b[k], `${pointer}/${k}`));
  }
  return [{ pointer, before: a, after: b }];
}

const freezeFile = path.join(author, 'author-freeze.json');
assert.equal(hash(freezeFile), 'a5cc41d4ea0f074839c5b804e4ae74e28247e63181b863512758ec7aed9305d7');
const freeze = read(freezeFile);
const repairFile = path.join(repair, 'author-freeze.json');
const repairFreeze = read(repairFile);
const sourceReuse = read(freeze.sourceReuseProof.path);
const beforeManifest = read(repairFreeze.before.path);
const runtime = read(path.join(author, 'technical-runtime-reuse.json'));
for (const value of [freeze, repairFreeze, sourceReuse, beforeManifest, runtime]) checkBindings(value);
for (const p of [freezeFile, repairFile]) inputBindings.set(p, bind(p));
assert.equal(freeze.authority.comment, '830251c5-4c6f-48af-9bae-6e3a22118c80');
assert.equal(freeze.questions, 0);
const observation = read(path.join(own, 'review-observations.json'));
assert.equal(observation.SCI, 'pass');
assert.equal(observation.ZHEN, 'pass');
assert.equal(observation.reviewerIsAuthor, false);
assert.equal(observation.failures.length, 0);

const raw = read(freeze.raw.find(x => x.path.endsWith('/lesson.json')).path);
const coverage = [];
for (const text of freeze.text) {
  const file = text.templates.find(x => x.path.endsWith('/lesson.template.json')).path;
  const lesson = read(file);
  assert.deepEqual(lesson.source.data, raw);
  assert.equal(lesson.source.sha256, hash(freeze.raw[0].path));
  assert.equal(lesson.prose.length, 19);
  assert.equal(lesson.prose.filter(x => x.kind === 'p').length, 15);
  assert.equal(lesson.exercise_count, 0);
  for (const key of ['id', 'card_id', 'chapter', 'section', 'number',
    'printed_title', 'start_page', 'start_printed']) assert.deepEqual(lesson[key], raw[key], key);
  for (let i = 0; i < raw.prose.length; i++) {
    const entry = lesson.prose[i];
    assert.deepEqual(entry.source_refs, raw.prose[i].source_refs);
    assert.equal(entry.kind, raw.prose[i].kind);
    assert.equal(entry.source_text, raw.prose[i].text);
    assert.deepEqual(entry.numeric_changes, []);
  }
  const exercises = read(text.templates.find(x => x.path.endsWith('/exercises.template.json')).path);
  assert.deepEqual(exercises.exercises, []);
  assert.equal(exercises.count, 0);
  const figures = read(text.templates.find(x => x.path.endsWith('/figures.template.json')).path);
  assert.deepEqual(figures.figures.map(x => x.id), ['fig-18', 'fig-19']);
  for (const f of figures.figures) {
    for (const k of ['svg', 'render', 'review', 'spec']) assert.equal(typeof f[k], 'string');
    for (const k of ['artwork', 'png', 'generation']) assert.equal(f[k], undefined);
  }
  coverage.push({ locale: text.locale, edition: text.edition, status: 'pass',
    template: bind(file), entries: 19, proseEntries: 15, questions: 0,
    exactSourceSnapshotsRefsKindsAndOrdering: true, formulaAndNumericContentUnchanged: true });
}
const page = n => read(`ssot-resources/soviet10year-textbooks/artifacts/10p/pages/${n}/page.json`);
assert.deepEqual(page('0040').blocks[3].lines, ['14. 共振']);
assert.equal(page('0040').blocks[4].kind, 'p');
assert.equal(page('0042').blocks[6].kind, 'p');
assert.equal(page('0042').blocks[6].open, false);
assert.deepEqual(page('0042').blocks[7].lines, ['15. 共振的利用和防止']);
assert.deepEqual(read(freeze.raw.find(x => x.path.endsWith('/exercises.json')).path).exercises, []);
const referenceReads = freeze.primaryReferences.passages.map(p => {
  const full = fs.readFileSync(p.fullRenderedRead.path);
  const passage = fs.readFileSync(p.passage.path);
  assert.deepEqual(full.subarray(p.byteStart, p.byteEnd), passage);
  return { id: p.id, fulltext: bind(p.fullRenderedRead.path), passage: bind(p.passage.path),
    byteStart: p.byteStart, byteEnd: p.byteEnd, retainedSliceExact: true, actuallyRead: true };
});
const figureBindings = freeze.figures.map(f => {
  const spec = read(f.spec.path);
  const render = read(f.nativeRender.path);
  assert.equal(render.status, 'pass');
  assert.equal(render.spec.sha256, hash(f.spec.path));
  assert.equal(render.output.svg.sha256, hash(f.svg.path));
  const texts = freeze.text.map(t => {
    const lesson = read(t.templates[0].path);
    return `[${t.locale}; ${t.edition}; ${lesson.title}]\n${lesson.prose
      .filter(x => x.kind !== 'fig').map(x => x.text).join('\n\n')}`;
  });
  assert.deepEqual(spec.source.authoritativeText.map(x => x.text), texts);
  const old = read(path.join(author, `${f.id}.before-label-repair.spec.json`));
  const labelDelta = diff(old, spec);
  assert.deepEqual(labelDelta, [{ pointer: '/objects/11/at/1', before: 67, after: 73 }]);
  return { id: f.id, status: 'pass', mode: 'deterministic', sourcePng: bind(f.sourcePng.path),
    spec: bind(f.spec.path), svg: bind(f.svg.path), nativeRender: bind(f.nativeRender.path),
    native640: bind(f.native640.path), preview331: bind(f.preview331.path),
    authoritativeBilingualContextExact: true, existingNativeStatus: 'pass',
    displayChecks: render.displayChecks, labelRepairDelta: labelDelta };
});

const prior = read(repairFreeze.independentFailure.path);
const beforePage = read(path.join(repair, 'before/page.json'));
const afterFile = 'ssot-resources/soviet10year-textbooks/artifacts/9p/pages/0307/page.json';
const afterPage = read(afterFile);
const repairDelta = diff(beforePage, afterPage);
assert.deepEqual(repairDelta.map(x => x.pointer).sort(),
  ['/blocks/9/lines/1', '/meta/notes/7']);
assert.equal(afterPage.blocks[9].lines[1],
  beforePage.blocks[9].lines[1].replace('\\bar{B}', '\\vec{B}'));
const beforeMd = fs.readFileSync(path.join(repair, 'before/page.md'), 'utf8');
const afterMd = fs.readFileSync(absolute(afterFile.replace('page.json', 'page.md')), 'utf8');
assert.equal(afterMd, beforeMd.replace(beforePage.meta.notes[7], afterPage.meta.notes[7])
  .replace(beforePage.blocks[9].lines[1], afterPage.blocks[9].lines[1]));
assert.equal(prior.conclusions.glyphConclusion.actualVisibleMark, 'RIGHT_POINTING_VECTOR_ARROW');
assert.equal(prior.conclusions.glyphConclusion.genuineRemainingAmbiguity, false);
assert.equal(prior.conclusions.glyphConclusion.status, 'FAIL');
assert(prior.conclusions.emphasisConclusions.every(x => x.status === 'PASS'));
for (const i of [7, 8]) assert.deepEqual(beforePage.blocks[i], afterPage.blocks[i]);
const auditFile = afterFile.replace('page.json', 'audit.json');
assert.equal(hash(auditFile), hash(path.join(repair, 'before/audit.json')));
const audit = read(auditFile);
assert.equal(audit.lines_printed, 25);
assert.equal(audit.lines_md, 25);
assert.deepEqual(audit.errors, []);
const nativeReceipt = read(repairFreeze.native.path);
assert.equal(nativeReceipt.exitCode, 0);
const stdoutFile = absolute(repairFreeze.native.path).replace('receipt.json', 'stdout.txt');
const stdout = fs.readFileSync(stdoutFile, 'utf8');
assert(stdout.includes('25 行（印刷 25）'));
assert(stdout.includes('通过 行数对账'));
const affectedReport = {
  schema: 'STEMROBIN-181/d059-source307-arrow-affected-review@1',
  ticket: 'STEMROBIN-181', reviewer: 'D059', reviewerIsAuthor: false, status: 'pass',
  scope: 'ONLY p0307#10 row2 B arrow and its associated source-recognition note',
  authorFreeze: bind(repairFile), beforeManifest: bind(repairFreeze.before.path),
  priorIndependentFinding: bind(repairFreeze.independentFailure.path),
  before: beforeManifest.before.map(x => bind(x.path)),
  actualCurrentFiles: repairFreeze.after.map(x => bind(x.path)),
  exactStructuredDelta: repairDelta, exactMarkdownDeltaMatchesStructuredDelta: true,
  sourceContentChangedBlocks: 1, sourceContentChangedRows: 1,
  approvedReplacement: { ref: 'p0307#10', row: 2, before: '\\bar{B}', after: '\\vec{B}',
    basis: 'D058 actual source detail observation: horizontal shaft plus distinct filled right-pointing arrowhead; no remaining ambiguity. Reused without reopening image or inferring from physics.' },
  allOtherBlocksDeepEqual: true, oneRelatedNoteChanged: '/meta/notes/7',
  reusedEmphasisPass: prior.conclusions.emphasisConclusions,
  emphasisBlocksExactlyUnchanged: true,
  nativeEvidenceReused: { receipt: bind(repairFreeze.native.path), stdout: bind(stdoutFile),
    exitCode: 0, audit: bind(auditFile), printedRows: 25, markdownRows: 25,
    errors: [], auditByteIdentical: true },
  unchangedFigure283: beforeManifest.figures.map(x => ({ ...bind(x.path), inspectedAsImage: false })),
  failures: [], sourceImageOpens: 0, sourceDetailOpens: 0, figureImageOpens: 0,
  sourcePageCountAdd: 0, sourcePagesAdded: 0, completeCoursesAdded: 0,
  nativeFinalizersRunByReviewer: 0, figureRerenders: 0, paidCalls: 0,
  whole307Approval: false, SOURCE307status: 'NOT_REVIEWED_AS_WHOLE_PAGE',
  source124Approval: false, course124Approval: false,
  priorWholeCourseDecisions: 'UNCHANGED; outside assigned scope',
  canonical307Decision: 'PARENT_ONLY', promotion: false
};
save('source307-arrow-affected-report.json', affectedReport);

// Approval is recorded only after substantive inspection; the native recorder's
// internal validator is the only native validation invoked in this review.
for (const f of figureBindings) {
  const reviewFile = path.join(own, `${f.id}.review.json`);
  const receiptFile = path.join(own, `${f.id}.record-review.receipt.json`);
  if (fs.existsSync(reviewFile)) {
    const issued = read(reviewFile);
    assert.equal(issued.status, 'pass');
    assert.equal(issued.figure, f.id);
    assert.equal(issued.spec.sha256, f.spec.sha256);
    assert.equal(issued.render.sha256, f.nativeRender.sha256);
    assert.equal(read(receiptFile).exitCode, 0);
    checkBindings(issued);
    f.review = bind(reviewFile);
    f.recordReviewReceipt = bind(receiptFile);
    continue;
  }
  const args = [path.join(W, '.agents/skills/ld-s10y-image/scripts/record_review.py'),
    '--spec', f.spec.path, '--render', f.nativeRender.path,
    '--output', path.join(own, `${f.id}.review.json`), '--status', 'pass',
    '--notes', `D059 independent reviewer, not author. Compared original source pixels first, both exact current ZH/EN templates, retained primary references, native640 and preview331. Counts, identities, arrows, shared frame, positive intercepts/tails, peak shape and declared lower-frequency damped regularization pass. See review-observations.json. Scratch approval only; no promotion or lesson finalization.`];
  assert(!fs.existsSync(path.join(own, `${f.id}.review.json`)));
  const result = spawnSync(path.join(W, '.claude/skills/ld-s10y-lesson/.venv/bin/python'),
    args, { cwd: W, env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' }, encoding: 'utf8' });
  save(`${f.id}.record-review.receipt.json`, {
    schema: 'STEMROBIN-181/d059-native-review-receipt@1', cwd: W,
    command: [path.join(W, '.claude/skills/ld-s10y-lesson/.venv/bin/python'), ...args],
    exitCode: result.status, error: result.error?.message || null,
    stdout: result.stdout, stderr: result.stderr,
    standaloneValidators: 0, internalValidatorOnly: true, renderCalls: 0
  });
  assert.equal(result.status, 0, result.stderr);
  const issued = read(path.join(own, `${f.id}.review.json`));
  assert.equal(issued.status, 'pass');
  checkBindings(issued);
  f.review = bind(path.join(own, `${f.id}.review.json`));
  f.recordReviewReceipt = bind(path.join(own, `${f.id}.record-review.receipt.json`));
}
const actualImageLedger = {
  schema: 'STEMROBIN-181/d059-actual-image-ledger@1',
  batchCount: 1, batchImages: 6, contextImages: 6, uniqueImages: 6,
  reopens: 0, cropsCreated: 0, sourcePageImages: 0, source307Images: 0,
  referenceImages: 0, maxBatch: 8, maxContext: 24,
  events: [
    ['fig-18', 'sourcePng'], ['fig-19', 'sourcePng'],
    ['fig-18', 'native640'], ['fig-18', 'preview331'],
    ['fig-19', 'native640'], ['fig-19', 'preview331']
  ].map(([id, key], i) => ({
    event: i + 1, batch: 1, figure: id, kind: key,
    ...figureBindings.find(x => x.id === id)[key], loads: 1
  }))
};
save('image-ledger.json', actualImageLedger);
const report = {
  schema: 'STEMROBIN-181/d059-n14-independent-review@1',
  ticket: 'STEMROBIN-181', reviewer: 'D059', role: 'INDEPENDENT_REVIEWER',
  reviewerIsAuthor: false, soleActiveIndependentReviewer: true,
  finish: 'review', Grill: 'self', lesson: 'phy10-c1-s2-n14', book: '10p',
  status: 'pass', SCI: 'pass', ZHEN: 'pass', sourceCoverage: 'pass',
  firstFullIndependentModernReview: true, authorFreeze: bind(freezeFile),
  authority: { comment: freeze.authority.comment, suppliedByParent: true,
    retainedRead: freeze.authority.liveRead, newestDirectRequestOverridesBroaderProduction: true },
  sourceBoundary: freeze.sourceBoundary, sourceEntries: 19, proseEntries: 15,
  questions: 0, figuresCount: 2, coverage,
  primaryReferences: { actualRetainedFulltextReads: 2, actualPassageReads: 5,
    refetches: 0, entries: referenceReads,
    derivationAndKnownReferenceCaveats: bind(path.join(own, 'review-observations.json')) },
  sourceInventory: bind(path.join(own, 'source-pixel-inventory.json')),
  observations: bind(path.join(own, 'review-observations.json')),
  figures: figureBindings,
  authorHistory: { originalHistory: bind(path.join(author, 'repair-history.json')),
    originalFailuresAndRepairs: freeze.failuresAndRepairs,
    genuineContentRepairEvents: 1, reviewerRepairs: 0,
    runtimeEvidence: bind(path.join(author, 'technical-runtime-reuse.json')),
    policy: observation.authorHistoryPolicy },
  reviewerPackagingRecovery: bind(path.join(own, 'technical-recovery.json')),
  affectedSource307: bind(path.join(own, 'source307-arrow-affected-report.json')),
  actualImageLedger, imageLedger: bind(path.join(own, 'image-ledger.json')),
  exactBindings: [...inputBindings.values()],
  nativeApprovalRecorders: 2, nativeStandaloneValidators: 0,
  nativeRenders: 0, nativeLessonFinalizers: 0, referenceRefetches: 0,
  sourcePageOpens: 0, sourcePagesAdded: 0, completeCoursesAdded: 0,
  paidCalls: 0, failures: [],
  boundaries: { ownedDirectory: own, writesOnlyOwned: true, inputEdits: false,
    database: false, Git: false, promotion: false, app: false, E: false,
    dependencies: false, cloud: false, worktreeOperations: false, otherChats: false,
    whole307Approval: false, source124Approval: false, course124Approval: false,
    batchOfflineLessonDisplayApproval: false },
  conclusion: 'First independent scratch SCI, ZHEN, source-coverage and fig18/19 review pass on exact frozen bindings. Source307 arrow-only repair passes separately with unchanged emphasis/geometry and reused25/25 native evidence. Parent consumes reports; no promotion or publication approval.'
};
save('report.json', report);
const outputs = fs.readdirSync(own).filter(n => n !== 'review-freeze.json')
  .sort().map(n => bind(path.join(own, n)));
save('review-freeze.json', {
  schema: 'STEMROBIN-181/d059-review-freeze@1', reviewer: 'D059', reviewerIsAuthor: false,
  status: 'pass', SCI: 'pass', ZHEN: 'pass', source307ArrowAffectedStatus: 'pass',
  cwd: W, ownedDirectory: own, authorFreeze: bind(freezeFile),
  source307RepairFreeze: bind(repairFile), report: bind(path.join(own, 'report.json')),
  source307ArrowAffectedReport: bind(path.join(own, 'source307-arrow-affected-report.json')),
  exactInputBindings: [...inputBindings.values()], outputs,
  actualImageLedger, promoted: false, stoppedAfterReview: true
});
console.log(JSON.stringify({
  status: 'pass', SCI: 'pass', ZHEN: 'pass', source307ArrowAffected: 'pass',
  reports: ['report.json', 'review-freeze.json', 'source307-arrow-affected-report.json',
    'fig-18.review.json', 'fig-19.review.json', 'image-ledger.json']
    .map(n => bind(path.join(own, n))),
  inputBindings: inputBindings.size,
  imageLoads: 6, reopens: 0, source307ImageLoads: 0
}, null, 2));

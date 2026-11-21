import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const A = `${T}/evidence/reports/d1816-d474-n153-approved-subset`;
const B = `${T}/evidence/reports/d1816-d482-current-approved-progress`;
const O = `${T}/evidence/reports/d1816-d508-n153-final-bindings`;
const meterPath = `${T}/production-meter.json`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({
  path: path.resolve(file), bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
});
const verify = row => assert.equal(bind(row.path).sha256, row.sha256, row.path);
const save = (name, value) => fs.writeFileSync(`${O}/${name}`,
  JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
assert(!fs.existsSync(O));
const archive = read(`${A}/retained-progress.json`);
const correction = read(`${B}/retained-progress.json`);
assert.equal(archive.status, 'approved-subset-retained-whole-course-held');
assert.equal(correction.n153CanonicalCourseOrChoiceRetention, false);
assert.equal(correction.n153ApprovedContentUnchanged, true);
for (const row of archive.retained) verify(row);
const firstPixelsPath = `${B}/reviews/d473-n153-subset-first-pixels/report.json`;
const affectedPixelsPath = `${B}/reviews/d480-n153-en-mobile-table-affected-review/report.json`;
for (const file of [firstPixelsPath, affectedPixelsPath, `${B}/display/en-mobile-choices.html`]) {
  const row = correction.retained.find(row => row.path === path.resolve(file));
  assert(row, file);
  verify(row);
}
assert.equal(read(firstPixelsPath).status, 'sampled-first-display-pixels-fail');
assert.equal(read(affectedPixelsPath).status, 'affected-en-mobile-choice-layout-pixels-pass');
const selected = Array.from({ length: 61 }, (_, index) => String(index + 1))
  .filter(number => !['2', '10'].includes(number));
const locales = [];
for (const locale of ['zh', 'en']) {
  const files = Object.fromEntries(['seed', 'draft', 'answer-keys', 'learner-views', 'review']
    .map(name => [name, bind(`${A}/${locale}/${name}.json`)]));
  const seed = read(files.seed.path);
  const draft = read(files.draft.path);
  const answers = read(files['answer-keys'].path);
  const review = read(files.review.path);
  const canonicalDigests = JSON.parse(execFileSync(
    '.claude/skills/ld-s10y-lesson/.venv/bin/python', [
      '-c',
      'import json,sys; sys.path.insert(0,".agents/skills/ld-s10y-choice/scripts"); from prepare import digest,load_json; print(json.dumps([digest(load_json(p)) for p in sys.argv[1:]]))',
      files.seed.path, files.draft.path,
    ], { cwd: repo, encoding: 'utf8' }));
  assert.equal(draft.seed_sha256, canonicalDigests[0]);
  assert.equal(review.seed_sha256, canonicalDigests[0]);
  assert.equal(review.draft_sha256, canonicalDigests[1]);
  assert.equal(review.outcome, 'pass');
  assert.deepEqual(seed.exercises.map(row => row.number), selected);
  assert.deepEqual(answers.answers.map(row => row.exercise), selected);
  assert.equal(draft.questions.length, 55);
  assert.equal(draft.questions.reduce((sum, row) => sum + row.view.options.length, 0), 220);
  assert(answers.answers.every(row => row.grading === 'ungraded' && row.parts.length === 0));
  assert.deepEqual(seed.figures, []);
  assert(seed.exercises.every(row => row.figure_ids.length === 0));
  assert.deepEqual(draft.new_figures, []);
  const traceAliases = seed.trace.map(row => {
    const suffix = row.path.endsWith('/book.json') ? 'book.json' : path.basename(row.path);
    const snapshot = bind(`${A}/${locale}/source-snapshot/${suffix}`);
    assert.equal(snapshot.sha256, row.sha256);
    return { declaredSnapshotPath: row.path, expectedSha256: row.sha256, retained: snapshot,
      currentCanonicalFileClaim: false };
  });
  const surfaces = [];
  for (const viewport of ['desktop', 'mobile']) {
    for (const surface of ['written', 'answers', 'choices']) {
      const name = `${locale}-${viewport}-${surface}.html`;
      const original = archive.retained.find(row => path.basename(row.path) === name);
      assert(original, name);
      const affected = name === 'en-mobile-choices.html';
      const html = bind(affected ? `${B}/display/${name}` : original.path);
      if (!affected) assert.equal(html.sha256, original.sha256);
      surfaces.push({ viewport, surface, html, originalBinding: original,
        evidence: affected ? bind(affectedPixelsPath) : bind(firstPixelsPath),
        judgment: affected ? 'REUSED_AFFECTED_PASS' : 'REUSED_UNCHANGED_DOM_AND_SAMPLED_PIXELS',
        allRowPixelCertification: false });
    }
  }
  locales.push({ locale, files, canonicalDigests, traceAliases, surfaces,
    figuresNeededByApprovedSubset: [], sourceFigureDependenciesResolvedByNewArtwork: false });
}
const before = read(`${T}/tmp/d1816-recovery/d506-before-continuation.production-meter.json`);
const meter = read(meterPath);
const restored = structuredClone(meter);
restored.currentResume1816.currentContinuation = before.currentResume1816.currentContinuation;
assert.deepEqual(restored, before);
assert.equal(meter.sourcePagesFinalized, 577);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 146);
assert.deepEqual(meter.currentCheckpoint.completeUnbatchedCards, []);
fs.mkdirSync(O, { recursive: true });
save('continuation-correction.json', {
  stage: 'D506', before: bind(`${T}/tmp/d1816-recovery/d506-before-continuation.production-meter.json`),
  previousDescription: before.currentResume1816.currentContinuation,
  currentDescription: meter.currentResume1816.currentContinuation,
  fieldsChanged: ['currentResume1816.currentContinuation'],
  countersRecounted: false, newlyDeliveredD500Courses: 1, newlyConsumedD500LocalPages: 2,
  previouslyConsumedD482PagesNotRecounted: [404, 405, 406, 407, 408, 409],
});
save('final-bindings.json', {
  stage: 'D508', status: 'APPROVED_SUBSET_FINAL_DURABLE_BINDINGS_COMPLETE_WHOLE_COURSE_HELD',
  lesson: 'phy10-c4-s3', archive: bind(`${A}/retained-progress.json`),
  affectedDisplayRetention: bind(`${B}/retained-progress.json`),
  locales, selectedSourceIds: selected, heldSourceIds: ['2', '10'],
  readonlyOnlySourceIds: ['1', '6', '35', '43'],
  perLocale: { written: 59, readonly: 59, choices: 55, options: 220 },
  unresolvedWholeCourseFigureDependency: 'fig08',
  nativeFailure: bind(`${A}/display/native-recovery-result.json`),
  scope: 'Exact approved snapshots and existing display bytes only; trace aliases resolve archived snapshots, not current canonical production ownership.',
  canonicalRetentionBoundary: archive.canonicalRetentionBoundary,
  firstPixelFailure: bind(firstPixelsPath), affectedPixelPass: bind(affectedPixelsPath),
  semanticReviewsReplayed: false, displayChecksReplayed: false, originalContentChanged: false,
  imagesOpened: 0, paidCalls: 0, newSourcePages: 0, newCompleteCourses: 0,
  wholeCourseApproval: false, canonicalCourseOrChoicePromotion: false,
  databaseWrites: false, formalHandoffComplete: false,
});
fs.copyFileSync(`${T}/tmp/d1816-recovery/bind-d508-n153-review-package.mjs`,
  `${O}/bind-package.mjs`, fs.constants.COPYFILE_EXCL);
meter.currentResume1816.D506 = {
  status: 'STALE_CONTINUATION_DESCRIPTION_CORRECTED_NO_RECOUNT',
  correction: bind(`${O}/continuation-correction.json`), sourcePagesAdded: 0, completeCoursesAdded: 0,
};
meter.currentResume1816.D508 = {
  status: 'N153_APPROVED_SUBSET_FINAL_DURABLE_BINDINGS_COMPLETE_WHOLE_COURSE_HELD',
  bindings: bind(`${O}/final-bindings.json`), sourcePagesAdded: 0, completeCoursesAdded: 0,
  memberReviewsReplayed: false, displayChecksReplayed: false, parentNewImageOpens: 0,
};
meter.currentResume1816.N153NonheldSubset.finalDurableBindings = bind(`${O}/final-bindings.json`);
meter.currentResume1816.N153NonheldSubset.nextMissingStage =
  'Approved59-source/55-choice subset final durable bindings complete; full61 native/canonical retention remains source2-model/source10-glyph/fig08-dependency held. No approved content or passed display replay.';
fs.writeFileSync(meterPath, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ bindings: bind(`${O}/final-bindings.json`),
  sourceSnapshotAliases: locales.flatMap(row => row.traceAliases).length,
  existingHtmlSurfacesBound: locales.flatMap(row => row.surfaces).length,
  newCompleteCourses: 0, deliveredCoursesUnchanged: 146, sourcePagesUnchanged: 577 }));

import assert from 'node:assert/strict';
import fs from 'node:fs';
import { repo, ticket, bind, read, save, copy } from './n42-native.mjs';

const out = `${ticket}/evidence/reports/d1816-d1420-n39-first-complete-en`;
const directory = `${ticket}/tmp/d1816-d1480-n39-partial-retention-recovery`;
const helper = `${ticket}/tmp/d1816-recovery/retain-d1000-n72-first-complete-en.mjs`;
const edition = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral-en`;
const ready38 = read(`${ticket}/evidence/reports/d1816-d1413-n38-first-complete-en/batch-ready.json`);
const canonical55 = `${edition}/figures/fig-55.spec.json`;
assert.equal(bind(canonical55).sha256, ready38.products.find(file => file.path === canonical55).sha256);
const native = read(`${ticket}/tmp/d1816-d1470-n39-unchanged-figure-width-rebinding/result.json`);
assert.equal(native.rows[0].assets[0].id, 'fig-56');
for (const key of ['spec', 'svg']) {
  const file = bind(`${edition}/figures/fig-56.${key === 'spec' ? 'spec.json' : 'svg'}`);
  assert.equal(file.sha256, native.rows[0].assets[0][key].sha256);
}
assert(!fs.existsSync(`${out}/batch-ready.json`));
assert(!fs.existsSync(`${edition}/lessons/phy9-c1-s4-n39`));
copy(helper, `${directory}/retainer.failed-original.mjs`);
save(`${directory}/first-failure.json`, {
  task: 'D1480', card: 'phy9-c1-s4-n39',
  execution: { chunk: 'ab9417', cwd: repo, exitCode: 1, invocationUnchangedFromD1479: true },
  error: 'ENOENT at retainer line1039: scratch-relative enReview was incorrectly used as a retained review path.',
  exactFailedHelper: bind(`${directory}/retainer.failed-original.mjs`),
  firstAsset: 'fig-56', partialCanonicalSpecAndSvgMatchApprovedNativeExactly: true,
  sharedFigure55UntouchedAndMatchesN38Ready: bind(canonical55),
  retainedApprovedReview: bind(`${out}/review/saved-pixels/value-line-text-review.json`),
  retainedPartialFilesReusedWithExactHashChecks: true,
  failedBeforeCanonicalRenderReviewLessonOrIndexWritesAndNativeCalls: true,
  recoveryHelperFirstFailure: {
    chunk: '8105ad', exitCode: 1,
    error: 'ENOENT reading assumed fig55 prior tuple before any output or write.',
    diagnosis: 'Actual native asset order is fig56 first; no shared fig55 change had occurred.',
    restoredOrDiscardedFiles: 0,
  },
  contentFailure: false, newImages: 0, databaseWrites: 0,
});
console.log(JSON.stringify({ failure: bind(`${directory}/first-failure.json`), restoredOrDiscardedFiles: 0 }));

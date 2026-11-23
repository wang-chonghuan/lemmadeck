import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, run } from './n42-native.mjs';

const native = read(`${ticket}/tmp/d1816-d1890-ex1-first-en-native/result.json`);
const out = `${ticket}/tmp/d1816-d1905-ex1-en-section-repair`;
const current = read(`${native.target}/lesson.json`), before = read(`${out}/before/lesson.json`);
assert.deepEqual({ ...current, section: before.section }, before);
for (const item of native.products.filter(item =>
  !['lesson.json', 'adaptation.audit.json'].some(name => item.path.endsWith(`/${name}`))))
  assert.equal(bind(item.path).sha256, item.sha256);
const render = run('d1905-ex1-English-section-render-recovery', [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
  `${repo}/.claude/skills/ld-s10y-lesson/tools/p2c.py`,
  'render', '--book', '9p', '--edition', 'modern-us-neutral-en', '--lesson', native.card,
  '--root', native.root, '--work', native.work,
]);
save(`${out}/result.json`, {
  ...native, status: 'NATIVE_EN_METADATA_RECOVERY_PASS_AFFECTED_REVIEW_REQUIRED',
  products: fs.readdirSync(native.target).map(name => bind(`${native.target}/${name}`)),
  html: native.html.map(item => bind(item.path)),
  originalNative: bind(`${ticket}/tmp/d1816-d1890-ex1-first-en-native/result.json`),
  failedEnglishReview: bind(`${ticket}/tmp/d1816-d1894-ex1-first-en-review/english-review.json`),
  metadataRepair: { field: 'section', previous: before.section, current: current.section },
  tests: bind(`${ticket}/tmp/d1816-recovery/native/d1905-English-section-six-focused-tests/receipt.json`),
  finalize: bind(`${ticket}/tmp/d1816-recovery/native/d1905-ex1-affected-English-section-adapt-finalize/receipt.json`),
  firstRenderFailure: bind(`${ticket}/tmp/d1816-recovery/native/d1905-ex1-affected-English-section-render/receipt.json`),
  render, originalExercisesAnswersAndChoicesUnchanged: true, sourceSnapshotUnchanged: true,
  affectedEnglishMetadataReviewPending: true, databaseWrites: 0, paidCalls: 0, imagesOpened: 0,
});
console.log(JSON.stringify({ card: native.card, repaired: bind(`${out}/result.json`) }));

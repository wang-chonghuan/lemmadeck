import fs from 'node:fs';
import { ticket, bind, read, save, copy } from './n42-native.mjs';

const directory = `${ticket}/tmp/d1816-d1493-surface-humidity-local-progress`;
const states = [
  ['D1439', 'd1816-d1439-n40-first-en-native/result.json', 'FIRST_EN_NATIVE_PASS'],
  ['D1440', 'd1816-d1440-n40-first-en-full-course-display/report.json', 'FIRST_EN_DESKTOP_MOBILE_DOM_PASS_PIXELS_RUNNING'],
  ['D1441', 'd1816-d1441-n40-original-figure-width-bindings/result.json', 'ACTUAL_WIDTHS358_640_PASS'],
  ['D1460', 'd1816-d1460-n46-first-en-native/result.json', 'FIRST_EN_NATIVE_PASS'],
  ['D1461', 'd1816-d1461-n46-first-en-full-course-display/report.json', 'FIRST_EN_DESKTOP_MOBILE_DOM_PASS_PIXELS_RUNNING'],
  ['D1462', 'd1816-d1462-n46-original-figure-width-bindings/result.json', 'ACTUAL_WIDTHS358_640_PASS'],
  ['D1491', 'd1816-d1491-n42-sentence-affected-text/authored.json', 'ONE_SENTENCE_NATIVE_PASS_REVIEW_RUNNING'],
  ['D1492', 'd1816-d1492-n43-sentence-affected-text/authored.json', 'ONE_SUBJECT_NATIVE_PASS_REVIEW_RUNNING'],
].map(([task, file, status]) => ({ task, status, evidence: bind(`${ticket}/tmp/${file}`) }));
const result = {
  task: 'D1493', status: 'N40_N46_FIRST_DOM_WIDTH_PASS_PIXELS_RUNNING_N42_N43_SENTENCE_REVIEW_RUNNING',
  states, priorProgress: bind(`${ticket}/tmp/d1816-d1484-surface-humidity-progress/result.json`),
  originalAffectedRevisions: [
    bind(`${ticket}/tmp/d1816-d1445-n42-first-en-review/affected-review.json`),
    bind(`${ticket}/tmp/d1816-d1452-n43-first-en-review/affected-review.json`),
  ],
  firstOriginalReviewsAndFailuresPreserved: true, parentNewImages: 0,
  assignedIndependentImages: 14, actualIndependentImageOpensNotAssumedFromAssignment: true,
  providerInputTokens: null, providerOutputTokens: null, costUsd: null,
  databaseWrites: 0, paidCalls: 0, counts: { completeCourses: 153, sourcePages: 581 },
  newCompleteCourses: 0, newSourcePages: 0, canonicalRetentionAndPushPending: true,
  formalHandoff: false, scopeCompleted: false, continuousProduction: true,
};
save(`${directory}/result.json`, result);
copy(`${ticket}/production-meter.json`, `${directory}/production-meter.before.json`);
copy(`${ticket}/review.md`, `${directory}/review.before.md`);
const meter = read(`${ticket}/production-meter.json`);
for (const state of states) meter.currentResume1816[state.task] = state;
meter.currentResume1816.D1493 = { status: result.status, evidence: bind(`${directory}/result.json`) };
meter.currentResume1816.currentContinuation =
  'N40/N46 affectedtext/native/render/DOM/actualwidthPASS,firstbounded6/8pixelreviewsrunning. N42affectedREVISE sentencefragment and N43affectedREVISE ambiguoussubject preserved;onlynamedprose25/prose7 sentencechangesnativePASS,originalreviewerscheckingonlyaffectedchange. Parentimages0;actualassignedimageopensnotassumed. Canonicalretention/pushpending;counts153/581unchanged;continuousproductionactive.';
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(`${ticket}/production-meter.json`, JSON.stringify(meter, null, 2) + '\n');
fs.appendFileSync(`${ticket}/review.md`,
  '\nD1491-D1493: N42affectedREVISE6e699cb6 (one semicolon-split sentence) and N43affectedREVISE809fedb7 (one ambiguous It subject) preserved. Onlyprose25/prose7 sentences changed;native math/numbers/metadata/flowPASS,originalreviewerscheckingsentenceonly. N40/N46native/render/desktopmobileDOM/actualwidths358/640PASS;first6/8savedpixelsassignedandrunning,actualopensnotassumedfromassignment,parent0. No canonicalretention/push/DB/paid/skills/broadtests/force/merge/deploy/handoff;153/581unchanged,continuousproductionactive.\n');
console.log(JSON.stringify({ progress: bind(`${directory}/result.json`) }));

import fs from 'node:fs';
import { ticket, bind, read, save, copy } from './n42-native.mjs';

const scratch = `${ticket}/tmp/d1816-d1158-first-stage-progress`;
copy(`${ticket}/production-meter.json`, `${scratch}/production-meter.before.json`);
copy(`${ticket}/review.md`, `${scratch}/review.before.md`);
const meter = read(`${ticket}/production-meter.json`);
const stages = [
  ['D1153', 'N54_ONE_EQUATION_LEAD_IN_AFFECTED_NATIVE_AND_REVIEW_PASS',
    'd1816-d1153-n54-equation-lead-in/authored.json'],
  ['D1154', 'N56_FAILED_DISPLAY_ARIA_SPACE_ASSUMPTION_RECOVERED_SOURCE_MANIFEST_LABEL_PASS',
    'd1816-d1154-n56-source-aria-display-recovery/report.json'],
  ['D1155', 'N57_FAILED_DISPLAY_ARIA_SPACE_ASSUMPTION_RECOVERED_SOURCE_MANIFEST_LABEL_PASS',
    'd1816-d1155-n57-source-aria-display-recovery/report.json'],
  ['D1156', 'N10_HISTORICAL_REVIEW_TO_DELIVERED_ZH_STATUS_ONLY_BINDING_PASS',
    'd1816-d1156-n10-delivered-science-binding/result.json'],
  ['D1157', 'FIRST_10P_N10_MISSING_EN_PREPARED',
    'd1816-d1157-n10-first-missing-en/prepared.json'],
  ['D1158', 'FIRST_10P_N10_MISSING_EN_AUTHOR_NATIVE_PASS_REVIEW_PENDING',
    'd1816-d1158-n10-first-missing-en/authored.json'],
];
for (const [task, status, file] of stages)
  meter.currentResume1816[task] = { status, result: bind(`${ticket}/tmp/${file}`),
    parentImages: 0, paidCalls: 0, databaseWrites: 0, newCompleteCourses: 0, newSourcePages: 0 };
meter.currentResume1816.D1131 = {
  status: 'FIRST_EN_TEXT_REVIEW_AND_N54_AFFECTED_REPAIR_COMPLETE_SAVED_PIXELS_RUNNING',
  textHandoff: bind(`${ticket}/tmp/d1816-d1131-n54-first-en-independent-review/final-handoff.json`),
  affectedHandoff: bind(`${ticket}/tmp/d1816-d1131-n54-first-en-independent-review/affected-final-handoff.json`),
  authorizedImageBatches: [4, 6, 6], authorizedTotal: 16, actualFinalUsagePending: true,
};
meter.currentResume1816.N11InventoryCorrection = {
  card: 'phy10-c1-s2-n11', rawDeclaredFigureCount: 0, actualApprovedManifestFigureCount: 1,
  reason: 'An approved contextual fig-03 is attached by the edition manifest despite raw lesson.figures being empty.',
  disposition: 'Historical science-template-to-current binding still needs targeted recovery. No new permanent content HOLD; no English authoring or invented approval.',
};
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(`${ticket}/production-meter.json`, JSON.stringify(meter, null, 2) + '\n');
fs.appendFileSync(`${ticket}/review.md`,
  '\nD1153-D1158: N54 first REVISE kept intact; only one equation lead-in repaired and independently affected-reviewed PASS. N56/N57 first ARIA-space display-assumption failures retained, failed display stages recovered against actual source manifest labels; native content/SVG unchanged, media358/640px bound without rerender. D1131 saved-pixel work now explicitly authorized4+6+6, actual final usage pending. 10p N10 D004 science template maps to current delivered Chinese exactly after draft-to-ready status only; D1156 binding, D1157 prepare and D1158 first EN author-native PASS,28paragraphs,0tasks/figures, independent EN review pending. N11 raw figure-free inventory corrected: approved edition manifest attaches one contextualfig03; retained science binding gap remains bounded recovery work, not invented approval or permanent HOLD. Existing10pN5 author PASS reused. No parent images/DB/paid/broadtests/receipt-onlydelivery/merge/deploy/formalhandoff; totals153/581 unchanged, production continues.\n');
save(`${scratch}/recorded.json`, { stages, parentImages: 0, newCompleteCourses: 0, newSourcePages: 0 });
console.log(JSON.stringify({ recorded: bind(`${scratch}/recorded.json`) }));

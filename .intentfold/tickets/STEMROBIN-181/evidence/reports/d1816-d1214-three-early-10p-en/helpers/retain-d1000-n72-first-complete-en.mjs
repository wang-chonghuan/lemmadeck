import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const [pixelPath, pixelHash, ledgerPath, ledgerHash, requestedCard = 'phy9-c2-s2-n72', resumeMode] = process.argv.slice(2);
assert(resumeMode === undefined || resumeMode === '--resume-canonical-source-binding');
const resumeCanonical = resumeMode === '--resume-canonical-source-binding';
assert.equal(bind(pixelPath).sha256, pixelHash);
assert.equal(bind(ledgerPath).sha256, ledgerHash);
assert.equal(read(pixelPath).status, 'PASS');
const configurations = {
  'phy10-c1-s2-n4': { book: '10p', task: 'D1212', native: 'd1816-d1206-n4-original-svg-width-bindings',
    firstNative: 'd1816-d1204-n4-first-en-native', display: 'd1816-d1216-n4-shared-aria-display-recovery',
    prepared: 'd1816-d1202-n4-first-missing-en', out: 'd1816-d1212-n4-first-complete-en',
    reviewer: 'd1816-d1198-introduction-independent-review', enReview: 'n4-first-en-review.json',
    reviewPrefix: 'n4-', authorStage: 'd1203', widthStage: 'd1206',
    historicalBatch: 'D-003', objects: 6, figures: 1,
    authorStages: [
      ['d1202', 'd1816-d1202-n4-first-missing-en'], ['d1203', 'd1816-d1203-n4-first-missing-en'],
      ['d1204', 'd1816-d1204-n4-first-en-native'], ['d1206', 'd1816-d1206-n4-original-svg-width-bindings'],
      ['d1205', 'd1816-d1205-n4-first-en-full-course-display'],
    ], nativePattern: /^d(?:1202|1203|1204|1205|1206|1212)-/ },
  'phy10-c1-s2-n1': { book: '10p', task: 'D1213', native: 'd1816-d1211-n1-original-svg-width-bindings',
    firstNative: 'd1816-d1209-n1-first-en-native', display: 'd1816-d1210-n1-first-en-full-course-display',
    prepared: 'd1816-d1207-n1-first-missing-en', out: 'd1816-d1213-n1-first-complete-en',
    reviewer: 'd1816-d1198-introduction-independent-review', enReview: 'n1-first-en-review.json',
    reviewPrefix: 'n1-', authorStage: 'd1208', widthStage: 'd1211',
    historicalBatch: 'D-003', objects: 16, figures: 2,
    authorStages: [
      ['d1207', 'd1816-d1207-n1-first-missing-en'], ['d1208', 'd1816-d1208-n1-first-missing-en'],
      ['d1209', 'd1816-d1209-n1-first-en-native'], ['d1211', 'd1816-d1211-n1-original-svg-width-bindings'],
    ], nativePattern: /^d(?:1207|1208|1209|1210|1211|1213)-/ },
  'phy9-c2-s2-n72': { task: 'D1000', native: 'd1816-d1003-n72-original-svg-width-bindings',
    firstNative: 'd1816-d997-n72-first-en-native', display: 'd1816-d998-n72-first-en-full-course-display',
    prepared: 'd1816-d993-n72-first-missing-en', out: 'd1816-d1000-n72-first-complete-en',
    reviewer: 'd1816-d990-n63-first-en-independent-review', enReview: 'n72-first-en-review.json',
    authorStage: 'd995', widthStage: 'd1003', historicalBatch: 'D020', objects: 13, figures: 4,
    authorStages: [
      ['d993', 'd1816-d993-n72-first-missing-en'], ['d994', 'd1816-d994-n72-first-missing-en'],
      ['d995', 'd1816-d995-n72-label-identity'], ['d997', 'd1816-d997-n72-first-en-native'],
      ['d1003', 'd1816-d1003-n72-original-svg-width-bindings'],
    ], nativePattern: /^d(?:993|994|995|997|998|999|1000)-/ },
  'phy9-c2-s2-n73': { task: 'D1016', native: 'd1816-d1015-n73-original-svg-width-bindings',
    firstNative: 'd1816-d1007-n73-first-en-native', display: 'd1816-d1008-n73-first-en-full-course-display',
    prepared: 'd1816-d1002-n73-first-missing-en', out: 'd1816-d1016-n73-first-complete-en',
    reviewer: 'd1816-d1006-n73-first-en-independent-review', enReview: 'affected-text-review.json',
    excludedReviewPrefix: 'n64-',
    authorStage: 'd1012', widthStage: 'd1015', historicalBatch: 'D019', objects: 22, figures: 2,
    affectedDisplay: 'd1816-d1024-n73-mobile-equation-scroll-end',
    authorStages: [
      ['d1002', 'd1816-d1002-n73-first-missing-en'], ['d1004', 'd1816-d1004-n73-first-missing-en'],
      ['d1005', 'd1816-d1005-n73-two-text-signatures'], ['d1012', 'd1816-d1012-n73-two-review-findings'],
      ['d1007', 'd1816-d1007-n73-first-en-native'], ['d1015', 'd1816-d1015-n73-original-svg-width-bindings'],
      ['d1024', 'd1816-d1024-n73-mobile-equation-scroll-end'],
    ], nativePattern: /^d(?:1002|1004|1005|1007|1008|1012|1015|1016)-/ },
  'phy9-c2-s2-n64': { task: 'D1021', native: 'd1816-d1020-n64-original-svg-width-bindings',
    firstNative: 'd1816-d1017-n64-first-en-native', display: 'd1816-d1018-n64-first-en-full-course-display',
    prepared: 'd1816-d1013-n64-first-missing-en', out: 'd1816-d1021-n64-first-complete-en',
    reviewer: 'd1816-d1006-n73-first-en-independent-review', enReview: 'n64-first-en-review.json',
    reviewPrefix: 'n64-', authorStage: 'd1019', widthStage: 'd1020',
    historicalBatch: 'D018', objects: 42, figures: 2,
    authorStages: [
      ['d1013', 'd1816-d1013-n64-first-missing-en'], ['d1014', 'd1816-d1014-n64-first-missing-en'],
      ['d1019', 'd1816-d1019-n64-unchanged-block-metadata'], ['d1017', 'd1816-d1017-n64-first-en-native'],
      ['d1020', 'd1816-d1020-n64-original-svg-width-bindings'],
    ], nativePattern: /^d(?:1013|1014|1017|1018|1019|1020|1021)-/ },
  'phy9-c2-s2-n81': { task: 'D1032', native: 'd1816-d1031-n81-original-svg-width-bindings',
    firstNative: 'd1816-d1029-n81-first-en-native', display: 'd1816-d1033-n81-unlabeled-figure-display-recovery',
    prepared: 'd1816-d1025-n81-first-missing-en', out: 'd1816-d1032-n81-first-complete-en',
    reviewer: 'd1816-d1028-n81-first-en-independent-review', enReview: 'report.json',
    authorStage: 'd1027', widthStage: 'd1031', historicalBatch: 'D020', objects: 17, figures: 1,
    authorStages: [
      ['d1025', 'd1816-d1025-n81-first-missing-en'], ['d1026', 'd1816-d1026-n81-first-missing-en'],
      ['d1027', 'd1816-d1027-n81-first-missing-en'], ['d1029', 'd1816-d1029-n81-first-en-native'],
      ['d1030', 'd1816-d1030-n81-first-en-full-course-display'],
      ['d1033', 'd1816-d1033-n81-unlabeled-figure-display-recovery'],
      ['d1031', 'd1816-d1031-n81-original-svg-width-bindings'],
    ], nativePattern: /^d(?:1025|1026|1027|1029|1030|1031|1032)-/ },
  'phy9-c2-s3-n89': { task: 'D1039', native: 'd1816-d1037-n89-first-en-native',
    firstNative: 'd1816-d1037-n89-first-en-native', display: 'd1816-d1038-n89-first-en-full-course-display',
    prepared: 'd1816-d1034-n89-first-missing-en', out: 'd1816-d1039-n89-first-complete-en',
    reviewer: 'd1816-d1028-n81-first-en-independent-review', enReview: 'n89-affected-text-review.json',
    reviewPrefix: 'n89-', authorStage: 'd1040', historicalBatch: 'D022', objects: 4, figures: 0,
    authorStages: [
      ['d1034', 'd1816-d1034-n89-first-missing-en'], ['d1035', 'd1816-d1035-n89-first-missing-en'],
      ['d1040', 'd1816-d1040-n89-two-readability-findings'],
      ['d1037', 'd1816-d1037-n89-first-en-native'],
    ], nativePattern: /^d(?:1034|1035|1037|1038|1039|1040)-/ },
  'phy9-c2-s4-n105': { task: 'D1045', native: 'd1816-d1043-n105-first-en-native',
    firstNative: 'd1816-d1043-n105-first-en-native', display: 'd1816-d1049-n105-sectionless-crumb-display-recovery',
    prepared: 'd1816-d1041-n105-first-missing-en', out: 'd1816-d1045-n105-first-complete-en',
    reviewer: 'd1816-d1028-n81-first-en-independent-review', enReview: 'n105-first-en-review.json',
    reviewPrefix: 'n105-', authorStage: 'd1042', historicalBatch: 'D025', objects: 9, figures: 0,
    authorStages: [
      ['d1041', 'd1816-d1041-n105-first-missing-en'], ['d1042', 'd1816-d1042-n105-first-missing-en'],
      ['d1043', 'd1816-d1043-n105-first-en-native'],
      ['d1044', 'd1816-d1044-n105-first-en-full-course-display'],
      ['d1049', 'd1816-d1049-n105-sectionless-crumb-display-recovery'],
    ], nativePattern: /^d(?:1041|1042|1043|1044|1045)-/ },
  'phy9-c2-s6-n130': { task: 'D1053', native: 'd1816-d1064-n130-source-chapter-native-recovery',
    nativeStatus: 'APPROVED_EN_BODY_METADATA_RECONCILED_NATIVE_RENDER_PASS',
    firstNative: 'd1816-d1064-n130-source-chapter-native-recovery',
    display: 'd1816-d1052-n130-current-en-metadata-full-course-display',
    prepared: 'd1816-d1048-n130-approved-en-metadata', out: 'd1816-d1053-n130-current-complete-en',
    reviewer: 'd1816-d1051-n130-independent-metadata-review', enReview: 'n130-chapter-identity-affected-review.json',
    reviewPrefix: 'n130-', authorStage: 'd1063', historicalBatch: 'D035', objects: 7, figures: 0,
    authorStages: [
      ['d1048', 'd1816-d1048-n130-approved-en-metadata'],
      ['d1050', 'd1816-d1050-n130-approved-en-metadata-native'],
      ['d1063', 'd1816-d1063-n130-source-chapter-identity'],
      ['d1064', 'd1816-d1064-n130-source-chapter-native-recovery'],
    ], nativePattern: /^d(?:1048|1050|1052|1053|1064)-/ },
  'phy9-c2-s2-n61': { task: 'D1058', native: 'd1816-d1056-n61-first-en-native',
    firstNative: 'd1816-d1056-n61-first-en-native', display: 'd1816-d1057-n61-first-en-full-course-display',
    prepared: 'd1816-d1054-n61-first-missing-en', out: 'd1816-d1058-n61-first-complete-en',
    reviewer: 'd1816-d1051-n130-independent-metadata-review', enReview: 'n61-first-en-review.json',
    reviewPrefix: 'n61-', authorStage: 'd1055', historicalBatch: 'D017', objects: 6, figures: 0,
    authorStages: [
      ['d1054', 'd1816-d1054-n61-first-missing-en'], ['d1055', 'd1816-d1055-n61-first-missing-en'],
      ['d1056', 'd1816-d1056-n61-first-en-native'],
    ], nativePattern: /^d(?:1054|1055|1056|1057|1058)-/ },
  'phy9-conclusion': { task: 'D1062', native: 'd1816-d1060-conclusion-approved-en-metadata-native',
    nativeStatus: 'APPROVED_EN_BODY_METADATA_RECONCILED_NATIVE_RENDER_PASS',
    firstNative: 'd1816-d1060-conclusion-approved-en-metadata-native',
    display: 'd1816-d1061-conclusion-current-en-metadata-full-course-display',
    prepared: 'd1816-d1059-conclusion-approved-en-metadata', out: 'd1816-d1062-conclusion-current-complete-en',
    reviewer: 'd1816-d1051-n130-independent-metadata-review', enReview: 'conclusion-metadata-review.json',
    reviewPrefix: 'conclusion-', authorStage: 'd1059', historicalBatch: 'D028', objects: 2, figures: 0,
    authorStages: [
      ['d1059', 'd1816-d1059-conclusion-approved-en-metadata'],
      ['d1060', 'd1816-d1060-conclusion-approved-en-metadata-native'],
    ], nativePattern: /^d(?:1059|1060|1061|1062)-/ },
  'phy9-c1-s1-n6': { task: 'D1076', native: 'd1816-d1070-n6-first-en-native',
    firstNative: 'd1816-d1070-n6-first-en-native', display: 'd1816-d1071-n6-first-en-full-course-display',
    prepared: 'd1816-d1067-n6-first-missing-en', out: 'd1816-d1076-n6-first-complete-en',
    reviewer: 'd1816-d1069-early-9p-first-en-independent-review', enReview: 'n6-affected-text-review.json',
    reviewPrefix: 'n6-', authorStage: 'd1080', historicalBatch: 'D-002', objects: 19, figures: 0,
    authorStages: [
      ['d1067', 'd1816-d1067-n6-first-missing-en'], ['d1068', 'd1816-d1068-n6-first-missing-en'],
      ['d1080', 'd1816-d1080-n6-two-flow-findings'],
      ['d1070', 'd1816-d1070-n6-first-en-native'],
    ], nativePattern: /^d(?:1067|1068|1070|1071|1076|1080)-/ },
  'phy9-c1-s2-n13': { task: 'D1077', native: 'd1816-d1074-n13-first-en-native',
    firstNative: 'd1816-d1074-n13-first-en-native', display: 'd1816-d1075-n13-first-en-full-course-display',
    prepared: 'd1816-d1072-n13-first-missing-en', out: 'd1816-d1077-n13-first-complete-en',
    reviewer: 'd1816-d1069-early-9p-first-en-independent-review', enReview: 'n13-first-en-review.json',
    reviewPrefix: 'n13-', authorStage: 'd1073', historicalBatch: 'D-002', objects: 5, figures: 0,
    authorStages: [
      ['d1072', 'd1816-d1072-n13-first-missing-en'], ['d1073', 'd1816-d1073-n13-first-missing-en'],
      ['d1074', 'd1816-d1074-n13-first-en-native'],
    ], nativePattern: /^d(?:1072|1073|1074|1075|1077)-/ },
  'phy9-c1-s2-n27': { task: 'D1098', native: 'd1816-d1090-n27-first-en-native',
    firstNative: 'd1816-d1090-n27-first-en-native', display: 'd1816-d1091-n27-first-en-full-course-display',
    prepared: 'd1816-d1081-n27-first-missing-en', out: 'd1816-d1098-n27-first-complete-en',
    reviewer: 'd1816-d1089-thermal-four-first-en-independent-review', enReview: 'n27-first-en-review.json',
    reviewPrefix: 'n27-', authorStage: 'd1082', historicalBatch: 'D-009', objects: 9, figures: 0,
    authorStages: [
      ['d1081', 'd1816-d1081-n27-first-missing-en'], ['d1082', 'd1816-d1082-n27-first-missing-en'],
      ['d1090', 'd1816-d1090-n27-first-en-native'],
    ], nativePattern: /^d(?:1081|1082|1090|1091|1098)-/ },
  'phy9-c1-s2-n28': { task: 'D1099', native: 'd1816-d1092-n28-first-en-native',
    firstNative: 'd1816-d1092-n28-first-en-native', display: 'd1816-d1093-n28-first-en-full-course-display',
    prepared: 'd1816-d1083-n28-first-missing-en', out: 'd1816-d1099-n28-first-complete-en',
    reviewer: 'd1816-d1089-thermal-four-first-en-independent-review', enReview: 'n28-first-en-review.json',
    reviewPrefix: 'n28-', authorStage: 'd1084', historicalBatch: 'D-009', objects: 17, figures: 0,
    authorStages: [
      ['d1083', 'd1816-d1083-n28-first-missing-en'], ['d1084', 'd1816-d1084-n28-first-missing-en'],
      ['d1092', 'd1816-d1092-n28-first-en-native'],
    ], nativePattern: /^d(?:1083|1084|1092|1093|1099)-/ },
  'phy9-c1-s3-n30': { task: 'D1100', native: 'd1816-d1094-n30-first-en-native',
    firstNative: 'd1816-d1094-n30-first-en-native', display: 'd1816-d1095-n30-first-en-full-course-display',
    prepared: 'd1816-d1085-n30-first-missing-en', out: 'd1816-d1100-n30-first-complete-en',
    reviewer: 'd1816-d1089-thermal-four-first-en-independent-review', enReview: 'n30-affected-text-review.json',
    reviewPrefix: 'n30-', authorStage: 'd1123', historicalBatch: 'D-010', objects: 5, figures: 0,
    authorStages: [
      ['d1085', 'd1816-d1085-n30-first-missing-en'], ['d1086', 'd1816-d1086-n30-first-missing-en'],
      ['d1123', 'd1816-d1123-n30-interaction-effects'],
      ['d1094', 'd1816-d1094-n30-first-en-native'],
    ], nativePattern: /^d(?:1085|1086|1094|1095|1100|1123)-/ },
  'phy9-c1-s3-n31': { task: 'D1101', native: 'd1816-d1096-n31-first-en-native',
    firstNative: 'd1816-d1096-n31-first-en-native', display: 'd1816-d1097-n31-first-en-full-course-display',
    prepared: 'd1816-d1087-n31-first-missing-en', out: 'd1816-d1101-n31-first-complete-en',
    reviewer: 'd1816-d1089-thermal-four-first-en-independent-review', enReview: 'n31-first-en-review.json',
    reviewPrefix: 'n31-', authorStage: 'd1088', historicalBatch: 'D-010', objects: 17, figures: 0,
    authorStages: [
      ['d1087', 'd1816-d1087-n31-first-missing-en'], ['d1088', 'd1816-d1088-n31-first-missing-en'],
      ['d1096', 'd1816-d1096-n31-first-en-native'],
    ], nativePattern: /^d(?:1087|1088|1096|1097|1101)-/ },
  'phy9-c1-s3-n33': { task: 'D1118', native: 'd1816-d1112-n33-first-en-native',
    firstNative: 'd1816-d1112-n33-first-en-native', display: 'd1816-d1113-n33-first-en-full-course-display',
    prepared: 'd1816-d1104-n33-first-missing-en', out: 'd1816-d1118-n33-first-complete-en',
    reviewer: 'd1816-d1110-kinetic-four-first-en-independent-review', enReview: 'n33-first-en-review.json',
    reviewPrefix: 'n33-', authorStage: 'd1105', historicalBatch: 'D-010', objects: 12, figures: 0,
    authorStages: [
      ['d1104', 'd1816-d1104-n33-first-missing-en'], ['d1105', 'd1816-d1105-n33-first-missing-en'],
      ['d1112', 'd1816-d1112-n33-first-en-native'],
    ], nativePattern: /^d(?:1104|1105|1112|1113|1118)-/ },
  'phy9-c1-s3-n36': { task: 'D1119', native: 'd1816-d1114-n36-first-en-native',
    firstNative: 'd1816-d1114-n36-first-en-native', display: 'd1816-d1115-n36-first-en-full-course-display',
    prepared: 'd1816-d1106-n36-first-missing-en', out: 'd1816-d1119-n36-first-complete-en',
    reviewer: 'd1816-d1110-kinetic-four-first-en-independent-review', enReview: 'n36-first-en-review.json',
    reviewPrefix: 'n36-', authorStage: 'd1111', historicalBatch: 'D-011', objects: 18, figures: 0,
    authorStages: [
      ['d1106', 'd1816-d1106-n36-first-missing-en'], ['d1107', 'd1816-d1107-n36-first-missing-en'],
      ['d1111', 'd1816-d1111-n36-three-citation-identities'],
      ['d1114', 'd1816-d1114-n36-first-en-native'],
    ], nativePattern: /^d(?:1106|1107|1111|1114|1115|1119)-/ },
  'phy9-c1-s4-n37': { task: 'D1120', native: 'd1816-d1116-n37-first-en-native',
    firstNative: 'd1816-d1116-n37-first-en-native', display: 'd1816-d1117-n37-first-en-full-course-display',
    prepared: 'd1816-d1108-n37-first-missing-en', out: 'd1816-d1120-n37-first-complete-en',
    reviewer: 'd1816-d1110-kinetic-four-first-en-independent-review', enReview: 'n37-first-en-review.json',
    reviewPrefix: 'n37-', authorStage: 'd1109', historicalBatch: 'D-011', objects: 15, figures: 0,
    authorStages: [
      ['d1108', 'd1816-d1108-n37-first-missing-en'], ['d1109', 'd1816-d1109-n37-first-missing-en'],
      ['d1116', 'd1816-d1116-n37-first-en-native'],
    ], nativePattern: /^d(?:1108|1109|1116|1117|1120)-/ },
  'phy9-c1-s5-n45': { task: 'D1128', native: 'd1816-d1126-n45-first-en-native',
    firstNative: 'd1816-d1126-n45-first-en-native', display: 'd1816-d1127-n45-first-en-full-course-display',
    prepared: 'd1816-d1124-n45-first-missing-en', out: 'd1816-d1128-n45-first-complete-en',
    reviewer: 'd1816-d1110-kinetic-four-first-en-independent-review', enReview: 'n45-first-en-review.json',
    reviewPrefix: 'n45-', authorStage: 'd1125', historicalBatch: 'D-013', objects: 10, figures: 0,
    authorStages: [
      ['d1124', 'd1816-d1124-n45-first-missing-en'], ['d1125', 'd1816-d1125-n45-first-missing-en'],
      ['d1126', 'd1816-d1126-n45-first-en-native'],
    ], nativePattern: /^d(?:1124|1125|1126|1127|1128)-/ },
  'phy9-c1-s6-n54': { task: 'D1134', native: 'd1816-d1132-n54-first-en-native',
    firstNative: 'd1816-d1132-n54-first-en-native', display: 'd1816-d1173-n54-affected-mobile-tail',
    captureTailRecovery: 'd1816-d1173-n54-affected-mobile-tail',
    prepared: 'd1816-d1129-n54-first-missing-en', out: 'd1816-d1134-n54-first-complete-en',
    reviewer: 'd1816-d1131-n54-first-en-independent-review', enReview: 'n54-affected-en-review.json',
    reviewPrefix: 'n54-', authorStage: 'd1153', historicalBatch: 'D-016', objects: 38, figures: 0,
    authorStages: [
      ['d1129', 'd1816-d1129-n54-first-missing-en'], ['d1130', 'd1816-d1130-n54-first-missing-en'],
      ['d1153', 'd1816-d1153-n54-equation-lead-in'],
      ['d1173', 'd1816-d1173-n54-affected-mobile-tail'],
      ['d1132', 'd1816-d1132-n54-first-en-native'],
    ], nativePattern: /^d(?:1129|1130|1132|1133|1134|1153|1173)-/ },
  'phy9-c1-s7-n56': { task: 'D1143', native: 'd1816-d1142-n56-original-svg-width-bindings',
    firstNative: 'd1816-d1140-n56-first-en-native', display: 'd1816-d1154-n56-source-aria-display-recovery',
    prepared: 'd1816-d1135-n56-first-missing-en', out: 'd1816-d1143-n56-first-complete-en',
    reviewer: 'd1816-d1131-n54-first-en-independent-review', enReview: 'n56-first-en-review.json',
    reviewPrefix: 'n56-', authorStage: 'd1136', widthStage: 'd1142',
    historicalBatch: 'D-016', objects: 9, figures: 1,
    authorStages: [
      ['d1135', 'd1816-d1135-n56-first-missing-en'], ['d1136', 'd1816-d1136-n56-first-missing-en'],
      ['d1140', 'd1816-d1140-n56-first-en-native'], ['d1142', 'd1816-d1142-n56-original-svg-width-bindings'],
      ['d1141', 'd1816-d1141-n56-first-en-full-course-display'],
    ], nativePattern: /^d(?:1135|1136|1140|1141|1142|1143|1154)-/ },
  'phy9-c1-s7-n57': { task: 'D1147', native: 'd1816-d1146-n57-original-svg-width-bindings',
    firstNative: 'd1816-d1144-n57-first-en-native', display: 'd1816-d1155-n57-source-aria-display-recovery',
    prepared: 'd1816-d1137-n57-first-missing-en', out: 'd1816-d1147-n57-first-complete-en',
    reviewer: 'd1816-d1131-n54-first-en-independent-review', enReview: 'n57-first-en-review.json',
    reviewPrefix: 'n57-', authorStage: 'd1139', widthStage: 'd1146',
    historicalBatch: 'D-016', objects: 27, figures: 1,
    authorStages: [
      ['d1137', 'd1816-d1137-n57-first-missing-en'], ['d1138', 'd1816-d1138-n57-first-missing-en'],
      ['d1139', 'd1816-d1139-n57-first-missing-en'], ['d1144', 'd1816-d1144-n57-first-en-native'],
      ['d1146', 'd1816-d1146-n57-original-svg-width-bindings'],
      ['d1145', 'd1816-d1145-n57-first-en-full-course-display'],
    ], nativePattern: /^d(?:1137|1138|1139|1144|1145|1146|1147|1155)-/ },
  'phy10-c1-s2-n5': { book: '10p', task: 'D1163', native: 'd1816-d1161-n5-first-en-native',
    firstNative: 'd1816-d1161-n5-first-en-native', display: 'd1816-d1162-n5-first-en-full-course-display',
    prepared: 'd1816-d1150-n5-first-missing-en', out: 'd1816-d1163-n5-first-complete-en',
    reviewer: 'd1816-d1159-10p-three-en-independent-review', enReview: 'n5-first-en-review.json',
    reviewPrefix: 'n5-', authorStage: 'd1152', historicalBatch: 'D-025', objects: 10, figures: 0,
    authorStages: [
      ['d1150', 'd1816-d1150-n5-first-missing-en'], ['d1151', 'd1816-d1151-n5-first-missing-en'],
      ['d1152', 'd1816-d1152-n5-first-missing-en'], ['d1161', 'd1816-d1161-n5-first-en-native'],
    ], nativePattern: /^d(?:1150|1151|1152|1161|1162|1163)-/ },
  'phy10-c1-s2-n10': { book: '10p', task: 'D1166', native: 'd1816-d1164-n10-first-en-native',
    firstNative: 'd1816-d1164-n10-first-en-native', display: 'd1816-d1165-n10-first-en-full-course-display',
    prepared: 'd1816-d1157-n10-first-missing-en', out: 'd1816-d1166-n10-first-complete-en',
    reviewer: 'd1816-d1159-10p-three-en-independent-review', enReview: 'n10-first-en-review.json',
    reviewPrefix: 'n10-', authorStage: 'd1158', historicalBatch: 'D-004', objects: 10, figures: 0,
    authorStages: [
      ['d1156', 'd1816-d1156-n10-delivered-science-binding'],
      ['d1157', 'd1816-d1157-n10-first-missing-en'], ['d1158', 'd1816-d1158-n10-first-missing-en'],
      ['d1164', 'd1816-d1164-n10-first-en-native'],
    ], nativePattern: /^d(?:1157|1158|1164|1165|1166)-/ },
  'phy10-c2-s4-n92': { book: '10p', task: 'D1172', native: 'd1816-d1170-n92-approved-en-metadata-native',
    firstNative: 'd1816-d1170-n92-approved-en-metadata-native',
    nativeStatus: 'APPROVED_EN_BODY_METADATA_RECONCILED_NATIVE_RENDER_PASS',
    display: 'd1816-d1171-n92-current-en-metadata-full-course-display',
    prepared: 'd1816-d1169-n92-approved-en-metadata', out: 'd1816-d1172-n92-first-complete-en',
    reviewer: 'd1816-d1159-10p-three-en-independent-review', enReview: 'n92-metadata-review.json',
    reviewPrefix: 'n92-', authorStage: 'd1169', historicalBatch: 'D-035', objects: 13, figures: 0,
    authorStages: [
      ['d1169', 'd1816-d1169-n92-approved-en-metadata'],
      ['d1170', 'd1816-d1170-n92-approved-en-metadata-native'],
    ], nativePattern: /^d(?:1169|1170|1171|1172)-/ },
  'phy10-c1-s2-n9': { book: '10p', task: 'D1188', native: 'd1816-d1191-n9-original-svg-width-bindings',
    firstNative: 'd1816-d1183-n9-first-en-native', display: 'd1816-d1185-n9-first-en-full-course-display',
    prepared: 'd1816-d1176-n9-first-missing-en', out: 'd1816-d1188-n9-first-complete-en',
    reviewer: 'd1816-d1181-n9-n15-first-en-independent-review', enReview: 'n9-affected-sentence-review.json',
    reviewPrefix: 'n9-', authorStage: 'd1193', widthStage: 'd1191', figureGateAuthorStage: 'd1175',
    affectedDisplay: 'd1816-d1194-n9-mobile-equation-scroll-end', affectedDisplayStage: 'd1194',
    sharedReviewNames: ['native-received.json'],
    historicalBatch: 'D-005', objects: 8, figures: 1,
    authorStages: [
      ['d1175', 'd1816-d1175-n9-delivered-science-binding'],
      ['d1176', 'd1816-d1176-n9-first-missing-en'], ['d1179', 'd1816-d1179-n9-first-missing-en'],
      ['d1182', 'd1816-d1182-n9-emphasis-boundary'], ['d1183', 'd1816-d1183-n9-first-en-native'],
      ['d1193', 'd1816-d1193-n9-turning-point-sentence'],
      ['d1194', 'd1816-d1194-n9-mobile-equation-scroll-end'],
      ['d1191', 'd1816-d1191-n9-original-svg-width-bindings'],
    ], nativePattern: /^d(?:1176|1179|1182|1183|1185|1188|1191|1193|1194)-/ },
  'phy10-c1-s2-n15': { book: '10p', task: 'D1189', native: 'd1816-d1192-n15-original-svg-width-bindings',
    firstNative: 'd1816-d1184-n15-first-en-native', display: 'd1816-d1186-n15-first-en-full-course-display',
    prepared: 'd1816-d1178-n15-first-missing-en', out: 'd1816-d1189-n15-first-complete-en',
    reviewer: 'd1816-d1181-n9-n15-first-en-independent-review', enReview: 'n15-first-en-review.json',
    reviewPrefix: 'n15-', authorStage: 'd1180', widthStage: 'd1192', figureGateAuthorStage: 'd1177',
    sharedReviewNames: ['native-received.json'],
    historicalBatch: 'D-006', objects: 11, figures: 2,
    authorStages: [
      ['d1177', 'd1816-d1177-n15-delivered-science-binding'],
      ['d1178', 'd1816-d1178-n15-first-missing-en'], ['d1180', 'd1816-d1180-n15-first-missing-en'],
      ['d1184', 'd1816-d1184-n15-first-en-native'], ['d1192', 'd1816-d1192-n15-original-svg-width-bindings'],
    ], nativePattern: /^d(?:1178|1180|1184|1186|1189|1192)-/ },
};
const config = configurations[requestedCard];
assert(config);
const card = requestedCard, edition = 'modern-us-neutral-en';
const bookId = config.book || '9p';
assert(card.startsWith(`phy${bookId.slice(0, -1)}-`));
const tag = `${config.task.toLowerCase()}-${card.split('-').at(-1)}`;
const target = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/${bookId}`;
const nativePath = `${ticket}/tmp/${config.native}/result.json`;
const firstNativePath = `${ticket}/tmp/${config.firstNative}/result.json`;
const displayPath = `${ticket}/tmp/${config.display}/report.json`;
const preparedPath = `${ticket}/tmp/${config.prepared}/prepared.json`;
const native = read(nativePath), display = read(displayPath), prepared = read(preparedPath);
assert.equal(native.status, config.nativeStatus || 'FIRST_MISSING_EN_NATIVE_FINALIZE_RENDER_PASS');
if (config.figures)
  assert.equal(native.actualCourseWidthContractsPassed ?? native.actual343And480BrowserWidthContractsPassed, true);
else assert.equal(native.rows[0].assets.length, 0);
assert.equal(display.status, 'TWO_COMPLETE_EN_COURSE_DOM_VIEWS_PASS_BOUNDED_PIXELS_PENDING');
assert.equal(display.browserClosed, true);
const protectedFiles = [prepared.source, ...prepared.sourcePages, ...prepared.productsReusedExactly,
  ...prepared.existingFigureTupleInventory.flatMap(figure => Object.values(figure.files))];
for (const file of protectedFiles) assert.equal(bind(file.path).sha256, file.sha256);
const out = `${ticket}/evidence/reports/${config.out}`;
const products = [], canonicalAssets = [], views = [], additionalSavedDisplay = [];
if (!resumeCanonical) {
copy(pixelPath, `${out}/full-course-pixel-review.original.json`);
copy(ledgerPath, `${out}/image-ledger.original.json`);
copy(nativePath, `${out}/native-result.original.json`);
copy(firstNativePath, `${out}/first-native-result.original.json`);
copy(displayPath, `${out}/full-course-dom.original.json`);
const displayHelpers = [
  `${ticket}/evidence/reports/d1816-d1212-n4-first-complete-en/display/check.retained-current.mjs`,
  `${ticket}/tmp/d1816-recovery/display-d998-n72-first-en-full-course.mjs`,
  `${ticket}/tmp/d1816-recovery/display-d1071-n6-n13.executed-original.mjs`,
  `${ticket}/tmp/d1816-recovery/display-d1097-three.executed-original.mjs`,
  `${ticket}/tmp/d1816-recovery/display-d1154-d1155.executed-original.mjs`,
  `${ticket}/tmp/d1816-recovery/display-d1133.executed-original.mjs`,
  `${ticket}/tmp/d1816-recovery/display-d1162-d1165-d1171.executed-original.mjs`,
  `${ticket}/evidence/reports/d1816-d1058-n61-first-complete-en/display/check.retained-current.mjs`,
];
const executedDisplayHelper = display.executedHelper
  ? displayHelpers.find(file => fs.existsSync(file) && bind(file).sha256 === display.executedHelper.sha256)
  : displayHelpers[0];
assert(executedDisplayHelper, 'The exact executed display helper must remain available');
copy(executedDisplayHelper, `${out}/display/check.retained-current.mjs`);
const reviewer = `${ticket}/tmp/${config.reviewer}`;
const reviewNames = card.endsWith('n72')
  ? ['n72-review.freeze.json', 'n72-first-en-review.json', 'n72-pixel.freeze.json']
  : fs.readdirSync(reviewer).filter(name => name.endsWith('.json')
    && (!config.reviewPrefix || name.startsWith(config.reviewPrefix))
    && (!config.excludedReviewPrefix || !name.startsWith(config.excludedReviewPrefix))
    && `${reviewer}/${name}` !== path.resolve(pixelPath) && `${reviewer}/${name}` !== path.resolve(ledgerPath))
    .concat(config.sharedReviewNames || []);
for (const name of reviewNames)
  copy(`${reviewer}/${name}`, `${out}/review/${name}`);
const aliases = [];
for (const [stage, directory] of config.authorStages) {
  for (const name of fs.readdirSync(`${ticket}/tmp/${directory}`).filter(name =>
    name.endsWith('.json') || name.endsWith('.helper.original.mjs'))) {
    const original = `${ticket}/tmp/${directory}/${name}`, retained = `${out}/author/${stage}/${name}`;
    copy(original, retained);
    aliases.push({ original: bind(original), retained: bind(retained) });
  }
}
for (const asset of read(firstNativePath).rows[0].assets)
  for (const key of ['spec', 'render', 'review'])
    copy(asset[key].path, `${out}/first-english-tuples/${asset.id}/${path.basename(asset[key].path)}`);
if (card.endsWith('n72'))
  for (const extension of ['spec.json', 'svg', 'render.json'])
    copy(`${repo}/.tmp/STEMROBIN-181/d1816-d999/figures/fig-134.${extension}`,
      `${out}/unused-first-width-rerender/fig-134.${extension}`);
save(`${out}/author-aliases.json`, aliases);
for (const view of display.views) {
  const retained = {};
  for (const key of ['html', 'screenshot', 'definitionScreenshot']) {
    const source = view[key];
    assert.equal(bind(source.path).sha256, source.sha256);
    const destination = `${out}/display/${path.basename(source.path)}`;
    copy(source.path, destination);
    retained[key] = bind(destination);
  }
  retained.figureScreenshots = view.figureScreenshots.map(figure => {
    assert.equal(bind(figure.image.path).sha256, figure.image.sha256);
    const destination = `${out}/display/${path.basename(figure.image.path)}`;
    copy(figure.image.path, destination);
    return { ...figure, retained: bind(destination) };
  });
  views.push({ ...view, retained });
}
save(`${out}/display-aliases.json`, views);
if (config.captureTailRecovery) {
  const recoveryFile = `${ticket}/tmp/${config.captureTailRecovery}/tail-recovery.json`;
  const recovery = read(recoveryFile);
  assert.equal(recovery.status, 'AFFECTED_MOBILE_CAPTURE_TAIL_REPLACED_DOM_PASS_PIXELS_PENDING');
  assert.equal(recovery.originalHtmlNativeContentAndOtherCapturesUnchanged, true);
  assert.equal(bind(recovery.correctedScreenshot.path).sha256, recovery.correctedScreenshot.sha256);
  assert.equal(display.views.find(view => view.viewport.name === 'mobile').screenshot.sha256,
    recovery.correctedScreenshot.sha256);
  for (const [key, name] of [
    ['bottomScreenshot', 'en-mobile-bottom-viewport.png'],
    ['originalBrokenScreenshot', 'en-mobile-whole.failed-original.png'],
  ]) {
    assert.equal(bind(recovery[key].path).sha256, recovery[key].sha256);
    copy(recovery[key].path, `${out}/display/${name}`);
    additionalSavedDisplay.push({ role: key, original: recovery[key],
      retained: bind(`${out}/display/${name}`), retainedRecovery: bind(`${out}/author/d1173/tail-recovery.json`) });
  }
  copy(recovery.originalReport.path, `${out}/display/first-full-course-dom.original.json`);
  copy(`${ticket}/tmp/d1816-recovery/capture-d1173-n54-affected-mobile-tail.mjs`,
    `${out}/display/capture-tail.retained-current.mjs`);
  save(`${out}/capture-tail-aliases.json`, additionalSavedDisplay);
}
if (config.affectedDisplay) {
  const originalReport = `${ticket}/tmp/${config.affectedDisplay}/report.json`;
  const affected = read(originalReport);
  assert.equal(affected.status, 'AFFECTED_MOBILE_EQUATION_TERMINAL_SCROLL_DOM_PASS_PIXELS_PENDING');
  assert.equal(affected.originalContentAndHtmlAndFiguresUnchanged, true);
  assert.equal(bind(affected.screenshot.path).sha256, affected.screenshot.sha256);
  const destination = `${out}/display/${path.basename(affected.screenshot.path)}`;
  copy(affected.screenshot.path, destination);
  additionalSavedDisplay.push({
    originalReport: bind(originalReport),
    retainedReport: bind(`${out}/author/${config.affectedDisplayStage || 'd1024'}/report.json`),
    originalImage: affected.screenshot, retainedImage: bind(destination),
    onlyAffectedFormulaScrollReachabilityChecked: true,
  });
  save(`${out}/affected-display-aliases.json`, additionalSavedDisplay);
}
for (const asset of native.rows[0].assets) {
  const directory = `${target}/editions/${edition}/figures`;
  const specFile = `${directory}/${asset.id}.spec.json`;
  const svgFile = `${directory}/${asset.id}.svg`;
  const renderFile = `${directory}/${asset.id}.render.json`;
  const reviewFile = `${directory}/${asset.id}.review.json`;
  copy(asset.spec.path, specFile);
  copy(asset.svg.path, svgFile);
  const render = read(asset.render.path);
  render.spec = { path: path.relative(repo, specFile), sha256: bind(specFile).sha256 };
  render.output.svg = { path: path.relative(repo, svgFile), sha256: bind(svgFile).sha256 };
  render.contextLocalization.englishApplicabilityReview = bind(`${out}/review/${config.enReview}`);
  for (const check of render.displayChecks)
    if (check.evidence) check.evidence = bind(`${out}/full-course-dom.original.json`);
  render.unchangedOutputWidthReconciliation.originalRender =
    bind(`${out}/first-english-tuples/${asset.id}/${asset.id}.render.json`);
  render.unchangedOutputWidthReconciliation.firstAuthoritativeCourseDomWidthEvidence =
    bind(`${out}/full-course-dom.original.json`);
  if (render.unchangedOutputWidthReconciliation.firstFailedRerender)
    render.unchangedOutputWidthReconciliation.firstFailedRerender =
      bind(`${out}/author/${config.widthStage}/first-failure.json`);
  assert(!JSON.stringify(render).includes('.tmp/'));
  assert(!JSON.stringify(render).includes('/STEMROBIN-181/tmp/'));
  save(renderFile, render);
  const review = read(asset.review.path);
  review.spec = { path: path.relative(repo, specFile), sha256: bind(specFile).sha256 };
  review.render = { path: path.relative(repo, renderFile), sha256: bind(renderFile).sha256 };
  review.outputs.svg = { path: path.relative(repo, svgFile), sha256: bind(svgFile).sha256 };
  review.localeContextReconciliation.englishApplicabilityReview =
    bind(`${out}/review/${config.enReview}`);
  review.localeContextReconciliation.currentEnglish =
    bind(`${out}/author/${config.authorStage}/en.lesson.draft.json`);
  if (config.figureGateAuthorStage)
    review.localeContextReconciliation.originalFigureGate =
      bind(`${out}/author/${config.figureGateAuthorStage}/result.json`);
  review.actualWidthReconciliation.originalNative = bind(`${out}/first-native-result.original.json`);
  review.actualWidthReconciliation.actualDisplay = bind(`${out}/full-course-dom.original.json`);
  if (review.actualWidthReconciliation.firstFailedRerender)
    review.actualWidthReconciliation.firstFailedRerender = bind(`${out}/author/${config.widthStage}/first-failure.json`);
  review.actualWidthReconciliation.currentSuppliedSavedPixelReviewPending = false;
  review.currentSavedPixelEvidence = bind(`${out}/full-course-pixel-review.original.json`);
  review.currentSavedPixelLedger = bind(`${out}/image-ledger.original.json`);
  review.completeEnglishAccessibilityApproval = false;
  assert(!JSON.stringify(review).includes('.tmp/'));
  assert(!JSON.stringify(review).includes('/STEMROBIN-181/tmp/'));
  save(reviewFile, review);
  const canonical = { id: asset.id, spec: bind(specFile), svg: bind(svgFile),
    render: bind(renderFile), review: bind(reviewFile) };
  canonicalAssets.push(canonical);
  products.push(...Object.values(canonical).filter(value => typeof value === 'object'));
}
const row = native.rows[0], directory = `${target}/editions/${edition}/lessons/${card}`;
assert(!fs.existsSync(directory));
for (const key of ['lesson', 'exercises', 'figures', 'audit']) {
  assert.equal(bind(row[key].path).sha256, row[key].sha256);
  assert(!fs.readFileSync(row[key].path, 'utf8').includes('.tmp/'));
  const destination = `${directory}/${path.basename(row[key].path)}`;
  copy(row[key].path, destination);
  products.push(bind(destination));
}
} else {
  assert.equal(card, 'phy9-c2-s2-n64');
  assert.equal(bind(`${out}/full-course-pixel-review.original.json`).sha256, pixelHash);
  assert.equal(bind(`${out}/image-ledger.original.json`).sha256, ledgerHash);
  assert.equal(bind(`${out}/native-result.original.json`).sha256, bind(nativePath).sha256);
  assert.equal(bind(`${out}/full-course-dom.original.json`).sha256, bind(displayPath).sha256);
  views.push(...read(`${out}/display-aliases.json`));
  for (const asset of native.rows[0].assets) {
    const directory = `${target}/editions/${edition}/figures`;
    const canonical = { id: asset.id };
    for (const [key, extension] of [['spec', 'spec.json'], ['svg', 'svg'],
      ['render', 'render.json'], ['review', 'review.json']])
      canonical[key] = bind(`${directory}/${asset.id}.${extension}`);
    assert.equal(canonical.spec.sha256, asset.spec.sha256);
    assert.equal(canonical.svg.sha256, asset.svg.sha256);
    canonicalAssets.push(canonical);
    products.push(...Object.values(canonical).filter(value => typeof value === 'object'));
  }
  for (const key of ['lesson', 'exercises', 'figures', 'audit']) {
    const original = native.rows[0][key];
    const canonical = bind(`${target}/editions/${edition}/lessons/${card}/${path.basename(original.path)}`);
    assert.equal(canonical.sha256, original.sha256);
    products.push(canonical);
  }
}
const tupleReceipt = run(`${tag}-first-en-canonical-tuple-bindings${resumeCanonical ? '-source-path-recovery' : ''}`,
  config.figures ? [
    `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
    `${ticket}/tmp/d1816-recovery/validate-d1000-n72-retained-tuples.py`,
    card, config.task, bookId,
  ] : [
    `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
    `${ticket}/tmp/d1816-d823-approved-en-integration/check.py`,
    target, card, read(native.rows[0].lesson.path).title, `${out}/affected-bindings.json`,
  ]);
const indexFile = `${target}/editions/${edition}/book.json`, before = read(indexFile);
assert(!before.lessons.some(lesson => lesson.id === card));
copy(indexFile, `${out}/before.english-book.json`);
const indexReceipt = run(`${tag}-first-en-canonical-index`, [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
  `${ticket}/tmp/d1816-recovery/update-edition-index.py`,
  '--book', target, '--carrier', `${native.root}/${bookId}`, '--edition', edition, '--lesson', card,
]);
const after = read(indexFile);
assert.deepEqual(after.lessons.filter(lesson => lesson.id !== card), before.lessons);
assert.deepEqual({ ...after, lessons: [] }, { ...before, lessons: [] });
assert.equal(after.lessons.filter(lesson => lesson.id === card).length, 1);
products.push(bind(indexFile));
for (const file of protectedFiles) assert.equal(bind(file.path).sha256, file.sha256);
const nativeAliases = [], nativeRoot = `${ticket}/tmp/d1816-recovery/native`;
for (const name of fs.readdirSync(nativeRoot).filter(name => config.nativePattern.test(name))) {
  const file = `${nativeRoot}/${name}/receipt.json`, receipt = read(file);
  const retained = `${out}/native/${name}/receipt.original.json`;
  copy(file, retained);
  const streams = {};
  for (const [key, source] of Object.entries(receipt.streams)) {
    assert.equal(bind(source.path).sha256, source.sha256);
    const destination = `${out}/native/${name}/${key}.original.txt`;
    copy(source.path, destination);
    streams[key] = { original: source, retained: bind(destination) };
  }
  nativeAliases.push({ original: bind(file), retained: bind(retained), streams });
}
save(`${out}/native-aliases.json`, nativeAliases);
save(`${out}/canonical-binding-proof.json`, {
  status: 'PASS', products, canonicalAssets, tupleReceipt, indexReceipt,
  sourceAllChineseNativeAndFigureProductsUnchanged: true,
  englishCanonicalLessonProductsExactNativeBytes: true, otherEnglishRowsAndHeaderUnchanged: true,
  originalObjects: config.objects, originalTasks: 0, originalFigures: config.figures,
  actualCourseWidths: native.actualCourseWidths, allApprovedSvgBytesUnchanged: true,
  completeEnglishAccessibilityApproval: false,
  headedAcceptanceClaimed: display.headed,
  newCompleteCourses: 0, newSourcePages: 0, parentImageOpens: 0,
});
save(`${out}/batch-ready.json`, {
  task: config.task, status: `FIRST_COMPLETE_VISIBLE_EN_EDITION_OF_ALREADY_COUNTED_${card.split('-').at(-1).toUpperCase()}_READY`,
  cards: [card], alreadyCountedInHistoricalBatch: config.historicalBatch, newCompleteCourses: 0, newSourcePages: 0,
  originalObjects: config.objects, originalTasks: 0, originalFigures: config.figures, products, views,
  additionalSavedDisplay,
  pixelReview: bind(`${out}/full-course-pixel-review.original.json`),
  imageLedger: bind(`${out}/image-ledger.original.json`), tupleReceipt, indexReceipt,
  nativeResult: bind(`${out}/native-result.original.json`),
  retainedDisplayHelper: bind(`${out}/display/check.retained-current.mjs`),
  retainedHelperExactExecutedVersionClaimed: display.executedHelper
    ? display.executedHelper.sha256 === bind(`${out}/display/check.retained-current.mjs`).sha256 : false,
  suppliedPixelPreviewLimitsPreserved: true, fullResolutionAllGlyphPixelCertificationClaimed: false,
  completeEnglishAccessibilityApproval: false,
  headedAcceptanceClaimed: display.headed,
  browserMode: display.browserMode ?? 'isolated-headed',
  protectedChineseMachineAriaLabelsRetainedAndDisclosed: display.views.some(view => view.machineChineseAriaLabelsRetainedAndDisclosed),
  noSourceZhFigureReviewReplay: true, parentNewImages: 0, databaseWrites: 0, paidCalls: 0,
  formalHandoff: false, scopeComplete: false,
});
console.log(JSON.stringify({ ready: bind(`${out}/batch-ready.json`), products: products.length }));

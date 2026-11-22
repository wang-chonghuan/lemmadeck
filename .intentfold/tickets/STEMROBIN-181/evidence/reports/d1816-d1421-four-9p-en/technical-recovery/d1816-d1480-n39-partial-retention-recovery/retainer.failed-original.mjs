import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save as saveNew, copy as copyNew, run } from './n42-native.mjs';

const [pixelPath, pixelHash, ledgerPath, ledgerHash, requestedCard = 'phy9-c2-s2-n72', resumeMode] = process.argv.slice(2);
assert(resumeMode === undefined || resumeMode === '--resume-canonical-source-binding'
  || resumeMode === '--resume-generated-history-reference');
const resumeCanonical = resumeMode === '--resume-canonical-source-binding';
const resumeGeneratedHistory = resumeMode === '--resume-generated-history-reference';
if (resumeGeneratedHistory) {
  assert.equal(requestedCard, 'phy9-c1-s2-n26');
  assert.equal(read(`${ticket}/tmp/d1816-d1391-n26-retention-history-reference-recovery/first-failure.json`)
    .execution.chunk, '17c7e9');
}
// Reuse only exact partial artifacts from the identified failed retention call.
const copy = (from, to) => {
  if (resumeGeneratedHistory && fs.existsSync(to)) {
    assert.equal(bind(from).sha256, bind(to).sha256);
    return;
  }
  copyNew(from, to);
};
const save = (file, data) => {
  if (resumeGeneratedHistory && fs.existsSync(file)) {
    assert.equal(fs.readFileSync(file, 'utf8'), JSON.stringify(data, null, 2) + '\n');
    return;
  }
  saveNew(file, data);
};
assert.equal(bind(pixelPath).sha256, pixelHash);
assert.equal(bind(ledgerPath).sha256, ledgerHash);
assert.equal(read(pixelPath).status, 'PASS');
const configurations = {
  'phy9-c1-s3-n34': { task: 'D1399', native: 'd1816-d1398-n34-original-figure-width-bindings',
    firstNative: 'd1816-d1396-n34-first-en-native', display: 'd1816-d1397-n34-first-en-full-course-display',
    prepared: 'd1816-d1393-n34-first-missing-en', out: 'd1816-d1399-n34-first-complete-en',
    reviewer: 'd1816-d1395-n34-first-en-review', enReview: 'affected-review.json', receivedEnglishReview: true,
    authorStage: 'd1425', widthStage: 'd1398', historicalBatch: 'D-011',
    objects: 20, figures: 1, sourceFigureCount: 1, screenshots: 6,
    nextFourAdapter: true, retainHistoricalScienceChain: true, generatedAssetHistoryReference: true,
    inventoryHash: '62db9a883b5d1fddbf2f493bc2ca24105cb03255ec363172d5cbf118f919f6b3',
    authorStages: [
      ['d1393', 'd1816-d1393-n34-first-missing-en'], ['d1394', 'd1816-d1394-n34-first-missing-en'],
      ['d1425', 'd1816-d1425-n34-affected-text'], ['d1396', 'd1816-d1396-n34-first-en-native'],
      ['d1398', 'd1816-d1398-n34-original-figure-width-bindings'],
    ], nativePattern: /^d(?:1393|1394|1396|1397|1398|1399|1425)-/ },
  'phy9-c1-s3-n35': { task: 'D1406', native: 'd1816-d1405-n35-original-figure-width-bindings',
    firstNative: 'd1816-d1403-n35-first-en-native', display: 'd1816-d1430-n35-caption-dom-display-recovery',
    prepared: 'd1816-d1400-n35-first-missing-en', out: 'd1816-d1406-n35-first-complete-en',
    reviewer: 'd1816-d1402-n35-first-en-review', enReview: 'affected-review.json', receivedEnglishReview: true,
    authorStage: 'd1427', widthStage: 'd1405', historicalBatch: 'D-012',
    additionalAuthorEvidence: [{ stage: 'd1427', file: 'd1816-d1427-repair-lookup-first-failure.json' }],
    objects: 21, figures: 3, sourceFigureCount: 3, screenshots: 10,
    nextFourAdapter: true, retainHistoricalScienceChain: true,
    inventoryHash: '62db9a883b5d1fddbf2f493bc2ca24105cb03255ec363172d5cbf118f919f6b3',
    authorStages: [
      ['d1400', 'd1816-d1400-n35-first-missing-en'], ['d1401', 'd1816-d1401-n35-first-missing-en'],
      ['d1427', 'd1816-d1427-n35-affected-text'], ['d1403', 'd1816-d1403-n35-first-en-native'],
      ['d1404', 'd1816-d1404-n35-first-en-full-course-display'],
      ['d1430', 'd1816-d1430-n35-caption-dom-display-recovery'],
      ['d1405', 'd1816-d1405-n35-original-figure-width-bindings'],
    ], nativePattern: /^d(?:1400|1401|1403|1404|1405|1406|1427|1430)-/ },
  'phy9-c1-s4-n38': { task: 'D1413', native: 'd1816-d1412-n38-original-figure-width-bindings',
    firstNative: 'd1816-d1410-n38-first-en-native', display: 'd1816-d1411-n38-first-en-full-course-display',
    prepared: 'd1816-d1407-n38-first-missing-en', out: 'd1816-d1413-n38-first-complete-en',
    reviewer: 'd1816-d1409-n38-first-en-review', enReview: 'affected-review.json', receivedEnglishReview: true,
    authorStage: 'd1428', widthStage: 'd1412', historicalBatch: 'D-012',
    objects: 16, figures: 2, sourceFigureCount: 2, screenshots: 8,
    nextFourAdapter: true, retainHistoricalScienceChain: true,
    inventoryHash: '62db9a883b5d1fddbf2f493bc2ca24105cb03255ec363172d5cbf118f919f6b3',
    scienceContextCards: ['phy9-c1-s4-n38', 'phy9-c1-s4-n39'],
    sharedCanonicalFigures: ['fig-55'], sharedCanonicalLesson: 'phy9-c1-s4-n39',
    protectExistingSharedLesson: true, mergeSharedCanonicalContext: true,
    authorStages: [
      ['d1407', 'd1816-d1407-n38-first-missing-en'], ['d1408', 'd1816-d1408-n38-first-missing-en'],
      ['d1423', 'd1816-d1423-n38-first-missing-en'], ['d1428', 'd1816-d1428-n38-affected-text'],
      ['d1410', 'd1816-d1410-n38-first-en-native'],
      ['d1412', 'd1816-d1412-n38-original-figure-width-bindings'],
    ], nativePattern: /^d(?:1407|1408|1410|1411|1412|1413|1423|1428)-/ },
  'phy9-c1-s4-n39': { task: 'D1420', native: 'd1816-d1470-n39-unchanged-figure-width-rebinding',
    firstNative: 'd1816-d1476-n39-value-line-native', display: 'd1816-d1477-n39-value-line-affected-display',
    prepared: 'd1816-d1414-n39-first-missing-en', out: 'd1816-d1420-n39-first-complete-en',
    reviewer: 'd1816-d1416-n39-first-en-review',
    enReview: '../d1816-d1467-n39-unit-review/value-line-text-review.json', receivedEnglishReview: true,
    externalPixelReviewer: 'd1816-d1467-n39-unit-review',
    affectedUnitDisplay: 'd1816-d1477-n39-value-line-affected-display',
    authorStage: 'd1474', widthStage: 'd1470', historicalBatch: 'D-012',
    objects: 12, figures: 2, sourceFigureCount: 1, screenshots: 8,
    nextFourAdapter: true, retainHistoricalScienceChain: true,
    inventoryHash: '62db9a883b5d1fddbf2f493bc2ca24105cb03255ec363172d5cbf118f919f6b3',
    scienceContextCards: ['phy9-c1-s4-n38', 'phy9-c1-s4-n39'],
    sharedCanonicalFigures: ['fig-55'], sharedCanonicalLesson: 'phy9-c1-s4-n38',
    protectExistingSharedLesson: true, mergeSharedCanonicalContext: true,
    authorStages: [
      ['d1414', 'd1816-d1414-n39-first-missing-en'], ['d1415', 'd1816-d1415-n39-first-missing-en'],
      ['d1424', 'd1816-d1424-n39-first-missing-en'], ['d1429', 'd1816-d1429-n39-affected-text'],
      ['d1417', 'd1816-d1417-n39-first-en-native'],
      ['d1418', 'd1816-d1418-n39-first-en-full-course-display'],
      ['d1433', 'd1816-d1433-n39-source-subscript-display-recovery'],
      ['d1434', 'd1816-d1434-n39-prose-figure-order-display-recovery'],
      ['d1419', 'd1816-d1419-n39-original-figure-width-bindings'],
      ['d1466', 'd1816-d1466-n39-unit-joiners'], ['d1468', 'd1816-d1468-n39-unit-native'],
      ['d1472', 'd1816-d1472-n39-unit-native-recovery'],
      ['d1469', 'd1816-d1469-n39-affected-unit-display'],
      ['d1473', 'd1816-d1473-n39-unit-selector-display-recovery'],
      ['d1474', 'd1816-d1474-n39-unit-value-lines'], ['d1476', 'd1816-d1476-n39-value-line-native'],
      ['d1477', 'd1816-d1477-n39-value-line-affected-display'],
      ['d1470', 'd1816-d1470-n39-unchanged-figure-width-rebinding'],
      ['d1479', 'd1816-d1479-n39-retention-review-path-recovery'],
    ], nativePattern: /^d(?:1414|1415|1417|1418|1419|1420|1424|1429|1433|1434|1466|1468|1469|1470|1472|1473|1474|1476|1477)-/ },
  'phy9-c1-s2-n22': { task: 'D1359', native: 'd1816-d1358-n22-original-figure-width-bindings',
    firstNative: 'd1816-d1356-n22-first-en-native', display: 'd1816-d1357-n22-first-en-full-course-display',
    prepared: 'd1816-d1353-n22-first-missing-en', out: 'd1816-d1359-n22-first-complete-en',
    reviewer: 'd1816-d1355-n22-first-en-review', enReview: 'affected-review.json',
    authorStage: 'd1387', widthStage: 'd1358', historicalBatch: 'D-008',
    objects: 25, figures: 2, screenshots: 8, nextFourAdapter: true, retainHistoricalScienceChain: true,
    authorStages: [
      ['d1353', 'd1816-d1353-n22-first-missing-en'], ['d1354', 'd1816-d1354-n22-first-missing-en'],
      ['d1383', 'd1816-d1383-n22-first-missing-en'], ['d1387', 'd1816-d1387-n22-affected-text'],
      ['d1356', 'd1816-d1356-n22-first-en-native'], ['d1358', 'd1816-d1358-n22-original-figure-width-bindings'],
    ], nativePattern: /^d(?:1353|1354|1356|1357|1358|1359|1383|1387)-/ },
  'phy9-c1-s2-n25': { task: 'D1366', native: 'd1816-d1365-n25-original-figure-width-bindings',
    firstNative: 'd1816-d1363-n25-first-en-native', display: 'd1816-d1364-n25-first-en-full-course-display',
    prepared: 'd1816-d1360-n25-first-missing-en', out: 'd1816-d1366-n25-first-complete-en',
    reviewer: 'd1816-d1362-n25-first-en-review', enReview: 'affected-review.json',
    authorStage: 'd1384', widthStage: 'd1365', historicalBatch: 'D-008',
    objects: 16, figures: 2, screenshots: 8, nextFourAdapter: true, retainHistoricalScienceChain: true,
    authorStages: [
      ['d1360', 'd1816-d1360-n25-first-missing-en'], ['d1361', 'd1816-d1361-n25-first-missing-en'],
      ['d1384', 'd1816-d1384-n25-paragraph-opening'], ['d1363', 'd1816-d1363-n25-first-en-native'],
      ['d1365', 'd1816-d1365-n25-original-figure-width-bindings'],
    ], nativePattern: /^d(?:1360|1361|1363|1364|1365|1366|1384)-/ },
  'phy9-c1-s2-n26': { task: 'D1373', native: 'd1816-d1372-n26-original-figure-width-bindings',
    firstNative: 'd1816-d1389-n26-asset-path-native-recovery',
    display: 'd1816-d1390-n26-source-aria-display-recovery',
    prepared: 'd1816-d1367-n26-first-missing-en', out: 'd1816-d1373-n26-first-complete-en',
    reviewer: 'd1816-d1369-n26-first-en-review', enReview: 'affected-review.json',
    authorStage: 'd1385', widthStage: 'd1372', historicalBatch: 'D-009',
    objects: 13, figures: 2, screenshots: 8, nextFourAdapter: true, retainHistoricalScienceChain: true,
    authorStages: [
      ['d1367', 'd1816-d1367-n26-first-missing-en'], ['d1368', 'd1816-d1368-n26-first-missing-en'],
      ['d1385', 'd1816-d1385-n26-affected-text'], ['d1370', 'd1816-d1370-n26-first-en-native'],
      ['d1388', 'd1816-d1388-n26-asset-path-native-recovery'],
      ['d1389', 'd1816-d1389-n26-asset-path-native-recovery'],
      ['d1371', 'd1816-d1371-n26-first-en-full-course-display'],
      ['d1390', 'd1816-d1390-n26-source-aria-display-recovery'],
      ['d1372', 'd1816-d1372-n26-original-figure-width-bindings'],
    ], nativePattern: /^d(?:1367|1368|1370|1371|1372|1373|1385|1388|1389|1390)-/ },
  'phy9-c1-s3-n29': { task: 'D1380', native: 'd1816-d1379-n29-original-figure-width-bindings',
    firstNative: 'd1816-d1377-n29-first-en-native', display: 'd1816-d1378-n29-first-en-full-course-display',
    prepared: 'd1816-d1374-n29-first-missing-en', out: 'd1816-d1380-n29-first-complete-en',
    reviewer: 'd1816-d1376-n29-first-en-review', enReview: 'affected-review.json',
    authorStage: 'd1386', widthStage: 'd1379', historicalBatch: 'D-010',
    objects: 15, figures: 2, screenshots: 8, nextFourAdapter: true, retainHistoricalScienceChain: true,
    authorStages: [
      ['d1374', 'd1816-d1374-n29-first-missing-en'], ['d1375', 'd1816-d1375-n29-first-missing-en'],
      ['d1386', 'd1816-d1386-n29-affected-text'], ['d1377', 'd1816-d1377-n29-first-en-native'],
      ['d1379', 'd1816-d1379-n29-original-figure-width-bindings'],
    ], nativePattern: /^d(?:1374|1375|1377|1378|1379|1380|1386)-/ },
  'phy9-c1-s2-n10': { task: 'D1314', native: 'd1816-d1313-n10-original-figure-width-bindings',
    firstNative: 'd1816-d1311-n10-first-en-native', display: 'd1816-d1312-n10-first-en-full-course-display',
    prepared: 'd1816-d1308-n10-first-missing-en', out: 'd1816-d1314-n10-first-complete-en',
    reviewer: 'd1816-d1310-n10-independent-review', enReview: 'n10-affected-text-review.json',
    reviewPrefix: 'n10-', authorStage: 'd1343', widthStage: 'd1313',
    historicalBatch: 'D-005', objects: 9, figures: 2, screenshots: 8, nextFourAdapter: true,
    authorStages: [
      ['d1308', 'd1816-d1308-n10-first-missing-en'], ['d1309', 'd1816-d1309-n10-first-missing-en'],
      ['d1341', 'd1816-d1341-n10-two-readability-findings'],
      ['d1343', 'd1816-d1343-n10-two-readability-recovery'],
      ['d1311', 'd1816-d1311-n10-first-en-native'], ['d1313', 'd1816-d1313-n10-original-figure-width-bindings'],
    ], nativePattern: /^d(?:1308|1309|1311|1312|1313|1314|1341|1343)-/ },
  'phy9-c1-s2-n15': { task: 'D1321', native: 'd1816-d1320-n15-original-figure-width-bindings',
    firstNative: 'd1816-d1318-n15-first-en-native', display: 'd1816-d1319-n15-first-en-full-course-display',
    prepared: 'd1816-d1315-n15-first-missing-en', out: 'd1816-d1321-n15-first-complete-en',
    reviewer: 'd1816-d1317-n15-independent-review', enReview: 'n15-affected-text-review.json',
    sharedReviewNames: ['freeze.json'],
    reviewPrefix: 'n15-', authorStage: 'd1346', widthStage: 'd1320',
    historicalBatch: 'D-004', objects: 14, figures: 1, screenshots: 6, nextFourAdapter: true,
    authorStages: [
      ['d1315', 'd1816-d1315-n15-first-missing-en'], ['d1316', 'd1816-d1316-n15-first-missing-en'],
      ['d1344', 'd1816-d1344-n15-readability'], ['d1346', 'd1816-d1346-n15-readability'],
      ['d1318', 'd1816-d1318-n15-first-en-native'], ['d1320', 'd1816-d1320-n15-original-figure-width-bindings'],
    ], nativePattern: /^d(?:1315|1316|1318|1319|1320|1321|1344|1346)-/ },
  'phy9-c1-s2-n18': { task: 'D1328', native: 'd1816-d1327-n18-original-figure-width-bindings',
    firstNative: 'd1816-d1325-n18-first-en-native', display: 'd1816-d1350-n18-platform-font-display-recovery',
    prepared: 'd1816-d1322-n18-first-missing-en', out: 'd1816-d1328-n18-first-complete-en',
    reviewer: 'd1816-d1324-n18-independent-review', enReview: 'n18-affected-text-review.json',
    reviewPrefix: 'n18-', authorStage: 'd1345', widthStage: 'd1327',
    historicalBatch: 'D-007', objects: 14, figures: 1, screenshots: 6, nextFourAdapter: true,
    authorStages: [
      ['d1322', 'd1816-d1322-n18-first-missing-en'], ['d1323', 'd1816-d1323-n18-first-missing-en'],
      ['d1345', 'd1816-d1345-n18-readability'],
      ['d1326', 'd1816-d1326-n18-first-en-full-course-display'],
      ['d1349', 'd1816-d1349-n18-system-font-diagnostic'],
      ['d1325', 'd1816-d1325-n18-first-en-native'], ['d1327', 'd1816-d1327-n18-original-figure-width-bindings'],
    ], nativePattern: /^d(?:1322|1323|1325|1326|1327|1328|1345|1349|1350)-/ },
  'phy9-c1-s2-n20': { task: 'D1335', native: 'd1816-d1334-n20-original-figure-width-bindings',
    firstNative: 'd1816-d1332-n20-first-en-native', display: 'd1816-d1333-n20-first-en-full-course-display',
    prepared: 'd1816-d1329-n20-first-missing-en', out: 'd1816-d1335-n20-first-complete-en',
    reviewer: 'd1816-d1331-n20-independent-review', enReview: 'n20-affected-text-review.json',
    reviewPrefix: 'n20-', authorStage: 'd1347', widthStage: 'd1334',
    historicalBatch: 'D-007', objects: 35, figures: 2, screenshots: 8, nextFourAdapter: true,
    authorStages: [
      ['d1329', 'd1816-d1329-n20-first-missing-en'], ['d1330', 'd1816-d1330-n20-first-missing-en'],
      ['d1339', 'd1816-d1339-n20-first-missing-en'],
      ['d1347', 'd1816-d1347-n20-readability'],
      ['d1332', 'd1816-d1332-n20-first-en-native'], ['d1334', 'd1816-d1334-n20-original-figure-width-bindings'],
    ], nativePattern: /^d(?:1329|1330|1332|1333|1334|1335|1339|1347)-/ },
  'phy9-c1-s1-n1': { task: 'D1280', native: 'd1816-d1279-n1-original-png-width-bindings',
    firstNative: 'd1816-d1306-n1-source-label-native-recovery', display: 'd1816-d1278-n1-first-en-full-course-display',
    prepared: 'd1816-d1274-n1-first-missing-en', out: 'd1816-d1280-n1-first-complete-en',
    reviewer: 'd1816-d1276-n1-independent-review', enReview: 'n1-source-label-review.json',
    reviewPrefix: 'n1-', authorStage: 'd1304', widthStage: 'd1279',
    historicalBatch: 'D-001', objects: 10, figures: 2, generatedPng: true, screenshots: 8,
    authorStages: [
      ['d1274', 'd1816-d1274-n1-first-missing-en'], ['d1275', 'd1816-d1275-n1-first-missing-en'],
      ['d1297', 'd1816-d1297-n1-first-missing-en'], ['d1277', 'd1816-d1277-n1-first-en-native'],
      ['d1300', 'd1816-d1300-n1-two-findings'],
      ['d1304', 'd1816-d1304-n1-source-figure-labels'],
      ['d1306', 'd1816-d1306-n1-source-label-native-recovery'],
      ['d1279', 'd1816-d1279-n1-original-png-width-bindings'],
    ], nativePattern: /^d(?:1274|1275|1277|1278|1279|1280|1297|1300|1304|1306)-/ },
  'phy9-c1-s1-n2': { task: 'D1287', native: 'd1816-d1286-n2-original-png-width-bindings',
    firstNative: 'd1816-d1284-n2-first-en-native', display: 'd1816-d1285-n2-first-en-full-course-display',
    prepared: 'd1816-d1281-n2-first-missing-en', out: 'd1816-d1287-n2-first-complete-en',
    reviewer: 'd1816-d1283-n2-independent-review', enReview: 'n2-source-label-review.json',
    reviewPrefix: 'n2-', authorStage: 'd1305', widthStage: 'd1286',
    historicalBatch: 'D-001', objects: 13, figures: 1, generatedPng: true, screenshots: 6,
    authorStages: [
      ['d1281', 'd1816-d1281-n2-first-missing-en'], ['d1282', 'd1816-d1282-n2-first-missing-en'],
      ['d1298', 'd1816-d1298-n2-first-missing-en'], ['d1284', 'd1816-d1284-n2-first-en-native'],
      ['d1301', 'd1816-d1301-n2-four-findings'],
      ['d1305', 'd1816-d1305-n2-source-figure-labels'],
      ['d1286', 'd1816-d1286-n2-original-png-width-bindings'],
    ], nativePattern: /^d(?:1281|1282|1284|1285|1286|1287|1298|1301|1305)-/ },
  'phy9-c1-s1-n3': { task: 'D1294', native: 'd1816-d1293-n3-original-png-width-bindings',
    firstNative: 'd1816-d1303-n3-caption-label-native-recovery', display: 'd1816-d1292-n3-first-en-full-course-display',
    prepared: 'd1816-d1288-n3-first-missing-en', out: 'd1816-d1294-n3-first-complete-en',
    reviewer: 'd1816-d1290-n3-independent-review', enReview: 'n3-caption-label-review.json',
    reviewPrefix: 'n3-', authorStage: 'd1302', widthStage: 'd1293',
    historicalBatch: 'D-001', objects: 13, figures: 1, generatedPng: true, screenshots: 6,
    authorStages: [
      ['d1288', 'd1816-d1288-n3-first-missing-en'], ['d1289', 'd1816-d1289-n3-first-missing-en'],
      ['d1299', 'd1816-d1299-n3-three-readability-findings'],
      ['d1291', 'd1816-d1291-n3-first-en-native'],
      ['d1302', 'd1816-d1302-n3-caption-label'],
      ['d1303', 'd1816-d1303-n3-caption-label-native-recovery'],
      ['d1293', 'd1816-d1293-n3-original-png-width-bindings'],
    ], nativePattern: /^d(?:1288|1289|1291|1292|1293|1294|1299|1302|1303)-/ },
  'phy9-c2-s4-n97': { task: 'D1269', native: 'd1816-d1267-n97-first-en-native',
    firstNative: 'd1816-d1267-n97-first-en-native', display: 'd1816-d1268-n97-first-en-full-course-display',
    prepared: 'd1816-d1263-n97-first-missing-en', out: 'd1816-d1269-n97-first-complete-en',
    reviewer: 'd1816-d1266-n97-independent-review', enReview: 'n97-affected-text-review.json',
    reviewPrefix: 'n97-', authorStage: 'd1271', historicalBatch: 'D-024', objects: 7, figures: 0,
    authorStages: [
      ['d1263', 'd1816-d1263-n97-first-missing-en'], ['d1264', 'd1816-d1264-n97-first-missing-en'],
      ['d1271', 'd1816-d1271-n97-two-findings'],
      ['d1267', 'd1816-d1267-n97-first-en-native'],
    ], nativePattern: /^d(?:1263|1264|1267|1268|1269|1271)-/ },
  'phy9-c1-s1-n4': { task: 'D1243', native: 'd1816-d1239-n4-first-en-native',
    firstNative: 'd1816-d1239-n4-first-en-native', display: 'd1816-d1241-n4-first-en-full-course-display',
    prepared: 'd1816-d1234-n4-first-missing-en', out: 'd1816-d1243-n4-first-complete-en',
    reviewer: 'd1816-d1238-n4-n16-independent-review', enReview: 'n4-first-en-review.json',
    reviewPrefix: 'n4-', authorStage: 'd1235', historicalBatch: 'D-001', objects: 4, figures: 0,
    authorStages: [
      ['d1234', 'd1816-d1234-n4-first-missing-en'], ['d1235', 'd1816-d1235-n4-first-missing-en'],
      ['d1239', 'd1816-d1239-n4-first-en-native'],
    ], nativePattern: /^d(?:1234|1235|1239|1241|1243)-/ },
  'phy9-c1-s2-n16': { task: 'D1244', native: 'd1816-d1240-n16-first-en-native',
    firstNative: 'd1816-d1240-n16-first-en-native', display: 'd1816-d1242-n16-first-en-full-course-display',
    prepared: 'd1816-d1236-n16-first-missing-en', out: 'd1816-d1244-n16-first-complete-en',
    reviewer: 'd1816-d1238-n4-n16-independent-review', enReview: 'n16-first-en-review.json',
    externalPixelReviewer: 'd1816-d1261-n16-pixel-review',
    reviewPrefix: 'n16-', authorStage: 'd1237', historicalBatch: 'D-004', objects: 4, figures: 0,
    authorStages: [
      ['d1233', 'd1816-d1233-n16-delivered-science-binding'],
      ['d1236', 'd1816-d1236-n16-first-missing-en'], ['d1237', 'd1816-d1237-n16-first-missing-en'],
      ['d1240', 'd1816-d1240-n16-first-en-native'],
    ], nativePattern: /^d(?:1236|1237|1240|1242|1244)-/ },
  'phy9-c1-s1-n7': { task: 'D1257', native: 'd1816-d1255-n7-original-svg-width-bindings',
    firstNative: 'd1816-d1251-n7-first-en-native', display: 'd1816-d1253-n7-first-en-full-course-display',
    prepared: 'd1816-d1246-n7-first-missing-en', out: 'd1816-d1257-n7-first-complete-en',
    reviewer: 'd1816-d1250-n7-n49-independent-review', enReview: 'n7-first-en-review.json',
    reviewPrefix: 'n7-', authorStage: 'd1247', widthStage: 'd1255',
    historicalBatch: 'D-002', objects: 6, figures: 1,
    authorStages: [
      ['d1246', 'd1816-d1246-n7-first-missing-en'], ['d1247', 'd1816-d1247-n7-first-missing-en'],
      ['d1251', 'd1816-d1251-n7-first-en-native'], ['d1255', 'd1816-d1255-n7-original-svg-width-bindings'],
    ], nativePattern: /^d(?:1246|1247|1251|1253|1255|1257)-/ },
  'phy9-c1-s6-n49': { task: 'D1258', native: 'd1816-d1256-n49-original-svg-width-bindings',
    firstNative: 'd1816-d1252-n49-first-en-native', display: 'd1816-d1254-n49-first-en-full-course-display',
    prepared: 'd1816-d1248-n49-first-missing-en', out: 'd1816-d1258-n49-first-complete-en',
    reviewer: 'd1816-d1250-n7-n49-independent-review', enReview: 'n49-affected-chapter-review.json',
    externalPixelReviewer: 'd1816-d1262-n49-pixel-review',
    reviewPrefix: 'n49-', authorStage: 'd1265', widthStage: 'd1256',
    historicalBatch: 'D-014', objects: 7, figures: 1,
    authorStages: [
      ['d1248', 'd1816-d1248-n49-first-missing-en'], ['d1249', 'd1816-d1249-n49-first-missing-en'],
      ['d1265', 'd1816-d1265-n49-source-chapter'],
      ['d1252', 'd1816-d1252-n49-first-en-native'], ['d1256', 'd1816-d1256-n49-original-svg-width-bindings'],
    ], nativePattern: /^d(?:1248|1249|1252|1254|1256|1258|1265)-/ },
  'phy10-c1-s2-n2': { book: '10p', task: 'D1223', native: 'd1816-d1222-n2-original-svg-width-bindings',
    firstNative: 'd1816-d1220-n2-first-en-native', display: 'd1816-d1226-n2-source-aria-display-recovery',
    prepared: 'd1816-d1217-n2-first-missing-en', out: 'd1816-d1223-n2-first-complete-en',
    reviewer: 'd1816-d1219-n2-first-en-independent-review', enReview: 'affected-text-review.json',
    authorStage: 'd1225', widthStage: 'd1222', historicalBatch: 'D-003', objects: 15, figures: 3,
    sharedCanonicalFigures: ['fig-03'], sharedCanonicalLesson: 'phy10-c1-s2-n4',
    captionDisplay: 'd1816-d1231-n2-fig05-caption',
    authorStages: [
      ['d1217', 'd1816-d1217-n2-first-missing-en'], ['d1218', 'd1816-d1218-n2-first-missing-en'],
      ['d1224', 'd1816-d1224-n2-paragraph-start'], ['d1225', 'd1816-d1225-n2-horizontal-referent'],
      ['d1220', 'd1816-d1220-n2-first-en-native'], ['d1222', 'd1816-d1222-n2-original-svg-width-bindings'],
      ['d1221', 'd1816-d1221-n2-first-en-full-course-display'],
      ['d1231', 'd1816-d1231-n2-fig05-caption'],
    ], nativePattern: /^d(?:1217|1218|1220|1222|1223|1224|1225|1226)-/ },
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
if (config.receivedEnglishReview) {
  const first = read(firstNativePath);
  if (config.enReview) {
    assert.equal(path.resolve(first.review.path),
      path.resolve(`${ticket}/tmp/${config.reviewer}`, config.enReview));
  } else {
    assert.equal(path.dirname(path.resolve(first.review.path)), `${ticket}/tmp/${config.reviewer}`);
    config.enReview = path.basename(first.review.path);
  }
  assert.equal(bind(first.review.path).sha256, first.review.sha256);
}
assert.equal(native.status, config.nativeStatus || 'FIRST_MISSING_EN_NATIVE_FINALIZE_RENDER_PASS');
if (config.figures)
  assert.equal(native.actualCourseWidthContractsPassed ?? native.actual343And480BrowserWidthContractsPassed, true);
else assert.equal(native.rows[0].assets.length, 0);
assert.equal(display.status, 'TWO_COMPLETE_EN_COURSE_DOM_VIEWS_PASS_BOUNDED_PIXELS_PENDING');
assert.equal(display.browserClosed, true);
const protectedFiles = [prepared.source, ...prepared.sourcePages, ...prepared.productsReusedExactly,
  ...prepared.existingFigureTupleInventory.flatMap(figure => [
    ...Object.values(figure.files), ...(config.nextFourAdapter
      ? [figure.sourceImage, figure.sourceFigureGate, figure.independentFigureReview, figure.receivedInventory]
      : config.generatedPng ? [figure.independentFigureReview] : []),
  ])];
for (const item of config.additionalAuthorEvidence || [])
  protectedFiles.push(bind(`${ticket}/tmp/${item.file}`));
const historicalScienceBindings = [];
if (config.retainHistoricalScienceChain) {
  assert.equal(prepared.receivedHistoricalEvidenceInventory.sha256,
    config.inventoryHash ?? '6e70336e54880dd2aa6b912061221f1ccca7f993ae87acc2a28262d468a28e46');
  protectedFiles.push(prepared.receivedHistoricalEvidenceInventory);
  const received = read(prepared.receivedHistoricalEvidenceInventory.path);
  const selected = received.courses.find(row => row.card === card);
  assert(selected);
  const science = selected.science;
  const rows = science.correction
    ? ['firstReview', 'correction', 'anchorBinding'].map(role => ({ role, declaration: science[role] }))
    : [{ role: 'science', declaration: science },
      ...(science.finalizationBinding ? [{ role: 'finalizationBinding', declaration: science.finalizationBinding }] : [])];
  for (const relatedCard of config.scienceContextCards || []) {
    if (relatedCard === card) continue;
    const related = received.courses.find(row => row.card === relatedCard);
    assert(related);
    rows.push({ role: `related-science-${relatedCard}`, declaration: related.science });
  }
  for (const { role, declaration } of rows) {
    assert.equal(declaration.base, 'reports');
    const original = bind(`${ticket}/evidence/reports/${declaration.path}`);
    assert.equal(original.sha256, declaration.sha256);
    protectedFiles.push(original);
    historicalScienceBindings.push({ role, original });
  }
}
for (const file of protectedFiles) assert.equal(bind(file.path).sha256, file.sha256);
if (config.generatedPng || config.nextFourAdapter) {
  const enReview = `${ticket}/tmp/${config.reviewer}/${config.enReview}`;
  assert.equal(read(enReview).status ?? read(enReview).result, 'PASS');
  assert.equal(bind(enReview).sha256, read(firstNativePath).review.sha256);
  assert.equal(display.views.reduce((count, view) => count + 2 + view.figureScreenshots.length, 0),
    config.screenshots);
}
if (config.nextFourAdapter) {
  assert.equal(display.views.length, 2);
  assert.equal(display.requests.length, 0);
  assert.equal(display.browserMode, 'isolated-headless');
  assert.equal(display.headedAcceptanceClaimed, false);
  assert.equal(prepared.historicalScienceApprovalAssumed, false);
  assert.equal(read(firstNativePath).review.sha256, native.review.sha256);
}
const out = `${ticket}/evidence/reports/${config.out}`;
const products = [], canonicalAssets = [], views = [], additionalSavedDisplay = [];
const sharedLessonDirectory = `${target}/editions/${edition}/lessons/${config.sharedCanonicalLesson}`;
const sharedLessonFiles = config.sharedCanonicalLesson
  && (!config.protectExistingSharedLesson || fs.existsSync(sharedLessonDirectory))
  ? ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json'].map(name =>
    bind(`${sharedLessonDirectory}/${name}`))
  : [];
const sharedReconciliations = [];
if (!resumeCanonical) {
copy(pixelPath, `${out}/full-course-pixel-review.original.json`);
copy(ledgerPath, `${out}/image-ledger.original.json`);
copy(nativePath, `${out}/native-result.original.json`);
copy(firstNativePath, `${out}/first-native-result.original.json`);
copy(displayPath, `${out}/full-course-dom.original.json`);
if (config.nextFourAdapter) {
  copy(prepared.receivedHistoricalEvidenceInventory.path, `${out}/received-inventory.original.json`);
  copy(prepared.retainedUnboundHistoricalScience.path, `${out}/unbound-historical-science.original.json`);
  copy(prepared.completeChineseHistoricalNative.path, `${out}/original-chinese-native.original.json`);
  const retainedHistoricalEvidence = historicalScienceBindings.map(({ role, original }) => {
    const destination = original.sha256 === prepared.retainedUnboundHistoricalScience.sha256
      ? `${out}/unbound-historical-science.original.json`
      : `${out}/historical-evidence/${role}-${path.basename(original.path)}`;
    if (destination !== `${out}/unbound-historical-science.original.json`) copy(original.path, destination);
    return { role, original, retained: bind(destination), historicalOnly: true, recoveredApproval: false };
  });
  const retainedPreparationFailures = new Map();
  const originalTuples = [];
  for (const item of prepared.existingFigureTupleInventory) {
    const relocation = item.historicalIndependentReviewRelocation;
    if (config.retainHistoricalScienceChain && relocation?.firstPreparationFailure) {
      const failure = relocation.firstPreparationFailure;
      assert.equal(bind(failure.path).sha256, failure.sha256);
      if (!retainedPreparationFailures.has(failure.sha256)) {
        const destination = `${out}/historical-evidence/preparation-failure.original.json`;
        copy(failure.path, destination);
        retainedPreparationFailures.set(failure.sha256, { original: failure, retained: bind(destination) });
      }
    }
    originalTuples.push({ id: item.id, mode: item.mode, original: item.files,
      independentFigureReview: item.independentFigureReview, sourceFigureGate: item.sourceFigureGate,
      sourceImage: item.sourceImage, declaredHistoricalSourceImage: item.declaredHistoricalSourceImage,
      ...(config.retainHistoricalScienceChain ? { historicalIndependentReviewRelocation: relocation } : {}),
      existingDurableTuplesReferencedWithoutDuplication: true, sourcePixelsNotReopenedOrCopied: true });
  }
  save(`${out}/original-tuple-provenance.json`, {
    originalTuples, prepared: bind(preparedPath),
    receivedInventory: bind(`${out}/received-inventory.original.json`),
    historicalChineseScienceApprovalRecovered: false,
    ...(config.retainHistoricalScienceChain ? {
      retainedHistoricalEvidence, historicalScienceBindingGap: prepared.historicalScienceBindingGap,
      retainedPreparationFailures: [...retainedPreparationFailures.values()],
    } : {}),
    firstEnglishScienceReviewOriginal: bind(`${ticket}/tmp/${config.reviewer}/${config.enReview}`),
  });
}
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
const executedDisplayHelper = display.executedHelperSnapshot?.path || (display.executedHelper
  ? displayHelpers.find(file => fs.existsSync(file) && bind(file).sha256 === display.executedHelper.sha256)
  : displayHelpers[0]);
assert(executedDisplayHelper, 'The exact executed display helper must remain available');
if (display.executedHelper)
  assert.equal(bind(executedDisplayHelper).sha256, display.executedHelper.sha256);
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
if (config.externalPixelReviewer) {
  const external = `${ticket}/tmp/${config.externalPixelReviewer}`;
  for (const name of fs.readdirSync(external).filter(name => name.endsWith('.json'))) {
    const file = `${external}/${name}`;
    if ([path.resolve(pixelPath), path.resolve(ledgerPath)].includes(file)) continue;
    copy(file, `${out}/review/saved-pixels/${name}`);
  }
}
const aliases = [];
for (const item of config.additionalAuthorEvidence || []) {
  const original = `${ticket}/tmp/${item.file}`;
  const retained = `${out}/author/${item.stage}/${path.basename(item.file)}`;
  copy(original, retained);
  aliases.push({ original: bind(original), retained: bind(retained) });
}
for (const [stage, directory] of config.authorStages) {
  for (const name of fs.readdirSync(`${ticket}/tmp/${directory}`).filter(name =>
    name.endsWith('.json') || name.endsWith('.helper.original.mjs')
      || name === 'check.executed-original.mjs' || name === 'helper.executed-original.mjs')) {
    const original = `${ticket}/tmp/${directory}/${name}`, retained = `${out}/author/${stage}/${name}`;
    copy(original, retained);
    aliases.push({ original: bind(original), retained: bind(retained) });
  }
}
for (const asset of read(firstNativePath).rows[0].assets)
  for (const key of config.nextFourAdapter
    ? read(asset.spec.path).mode === 'generated' ? ['spec', 'generation', 'review'] : ['spec', 'render', 'review']
    : config.generatedPng ? ['spec', 'generation', 'review'] : ['spec', 'render', 'review'])
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
if (config.affectedUnitDisplay) {
  const affected = read(`${ticket}/tmp/${config.affectedUnitDisplay}/affected-report.json`);
  assert.equal(affected.status, 'AFFECTED_N39_UNITS_DOM_PASS_PIXELS_PENDING');
  assert.equal(affected.sourceMathAndNumbersUnchanged, true);
  assert.equal(affected.originalFigurePixelsAndWidthEvidenceReused, true);
  for (const view of affected.views) {
    const destination = `${out}/display/${path.basename(view.screenshot.path)}`;
    copy(view.screenshot.path, destination);
    additionalSavedDisplay.push({ originalImage: view.screenshot, retainedImage: bind(destination),
      geometry: view.units, scope: 'Affected pressure-unit line association only' });
    copy(view.html.path, `${out}/display/affected-unit-${path.basename(view.html.path)}`);
  }
  save(`${out}/affected-unit-display-aliases.json`, additionalSavedDisplay);
}
if (config.captionDisplay) {
  const captionReport = read(`${ticket}/tmp/${config.captionDisplay}/report.json`);
  assert.equal(captionReport.status, 'AFFECTED_FIG05_AND_CAPTION_SAME_VIEWPORT_DOM_PASS_PIXELS_PENDING');
  assert.equal(captionReport.originalContentHtmlFiguresAndPassedDisplayUnchanged, true);
  for (const view of captionReport.views) {
    assert.equal(bind(view.screenshot.path).sha256, view.screenshot.sha256);
    const destination = `${out}/display/${path.basename(view.screenshot.path)}`;
    copy(view.screenshot.path, destination);
    additionalSavedDisplay.push({ originalImage: view.screenshot, retainedImage: bind(destination),
      geometry: view.geometry, scope: 'First missing caption pixels only' });
  }
  save(`${out}/caption-display-aliases.json`, additionalSavedDisplay);
}
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
  const generated = read(asset.spec.path).mode === 'generated';
  if (!config.nextFourAdapter) assert.equal(generated, !!config.generatedPng);
  if (config.nextFourAdapter) assert.equal(asset.mode, generated ? 'generated' : 'deterministic');
  if (generated) {
    assert.equal(asset.mode, 'generated');
    const pngFile = `${directory}/${asset.id}.png`;
    const generationFile = `${directory}/${asset.id}.png.json`;
    const reviewFile = `${directory}/${asset.id}.review.json`;
    for (const key of ['spec', 'png', 'generation', 'review'])
      assert.equal(bind(asset[key].path).sha256, asset[key].sha256);
    assert.equal(asset.png.sha256, asset.original.png.sha256);
    assert.equal(asset.generation.sha256, asset.original.generation.sha256);
    copy(asset.spec.path, specFile);
    copy(asset.png.path, pngFile);
    // The generation record remains historical, including its original output and request paths.
    copy(asset.generation.path, generationFile);
    const generation = read(generationFile);
    assert.equal(generation.output.sha256, bind(pngFile).sha256);
    if (!config.nextFourAdapter) {
      assert(!JSON.stringify(generation).includes('.tmp/'));
      assert(!JSON.stringify(generation).includes('/STEMROBIN-181/tmp/'));
    }
    const review = read(asset.review.path);
    assert.equal(review.status, 'pass');
    review.spec = { path: path.relative(repo, specFile), sha256: bind(specFile).sha256 };
    review.generation = { path: path.relative(repo, generationFile), sha256: bind(generationFile).sha256 };
    review.outputs.png = { path: path.relative(repo, pngFile), sha256: bind(pngFile).sha256 };
    review.localeContextReconciliation.englishApplicabilityReview = bind(`${out}/review/${config.enReview}`);
    review.localeContextReconciliation.currentEnglish =
      bind(`${out}/author/${config.authorStage}/en.lesson.draft.json`);
    if (config.nextFourAdapter)
      review.localeContextReconciliation.receivedInventory = bind(`${out}/received-inventory.original.json`);
    review.actualWidthReconciliation.originalNative = bind(`${out}/first-native-result.original.json`);
    review.actualWidthReconciliation.actualDisplay = bind(`${out}/full-course-dom.original.json`);
    for (const check of review.actualWidthReconciliation.checks)
      check.evidence = bind(`${out}/full-course-dom.original.json`);
    review.actualWidthReconciliation.currentSuppliedSavedPixelReviewPending = false;
    review.currentSavedPixelEvidence = bind(`${out}/full-course-pixel-review.original.json`);
    review.currentSavedPixelLedger = bind(`${out}/image-ledger.original.json`);
    if (config.nextFourAdapter) {
      review.localeContextReconciliation.englishMetadataChanges.independentEnglishContextAndPixelReviewPending = false;
      review.originalGenerationDeclarationsRetainedWithoutReplay = true;
    }
    if (card === 'phy9-c1-s2-n26' || config.generatedAssetHistoryReference) {
      const relocation = review.localeContextReconciliation.englishMetadataChanges.generatedAssetRelocation;
      const snapshot = bind(`${out}/first-english-tuples/${asset.id}/${path.basename(asset.review.path)}`);
      const pointer = '/localeContextReconciliation/englishMetadataChanges/generatedAssetRelocation/original';
      assert.deepEqual(read(snapshot.path).localeContextReconciliation.englishMetadataChanges
        .generatedAssetRelocation.original, relocation.original);
      relocation.original = { evidence: snapshot, pointer, historicalDeclarationRetainedUnchanged: true };
    }
    review.completeEnglishAccessibilityApproval = false;
    review.embeddedRasterGlyphCertificationClaimed = false;
    assert(!JSON.stringify(review).includes('.tmp/'));
    assert(!JSON.stringify(review).includes('/STEMROBIN-181/tmp/'));
    save(reviewFile, review);
    const canonical = { id: asset.id, mode: 'generated', spec: bind(specFile), png: bind(pngFile),
      generation: bind(generationFile), review: bind(reviewFile) };
    canonicalAssets.push(canonical);
    products.push(...Object.values(canonical).filter(value => typeof value === 'object'));
    continue;
  }
  const svgFile = `${directory}/${asset.id}.svg`;
  const renderFile = `${directory}/${asset.id}.render.json`;
  const reviewFile = `${directory}/${asset.id}.review.json`;
  const replacesShared = config.sharedCanonicalFigures?.includes(asset.id) && fs.existsSync(specFile);
  let priorTuple, sharedContextReconciliation;
  if (replacesShared) {
    for (const key of ['spec', 'svg', 'render', 'review'])
      assert.equal(bind(asset[key].path).sha256, asset[key].sha256);
    priorTuple = Object.fromEntries([['spec', specFile], ['svg', svgFile], ['render', renderFile], ['review', reviewFile]]
      .map(([key, file]) => [key, bind(file)]));
    const priorSpec = read(specFile), nextSpec = read(asset.spec.path), staticComparison = structuredClone(nextSpec);
    staticComparison.source.authoritativeText = priorSpec.source.authoritativeText;
    staticComparison.display.widths = priorSpec.display.widths;
    assert.deepEqual(staticComparison, priorSpec);
    if (config.mergeSharedCanonicalContext) {
      assert.equal(nextSpec.source.authoritativeText.length, priorSpec.source.authoritativeText.length);
      const reviewedOwnRows = nextSpec.source.authoritativeText.filter(row => row.lesson === card);
      assert.equal(reviewedOwnRows.length, 1);
      nextSpec.source.authoritativeText = nextSpec.source.authoritativeText.map((row, index) => {
        const prior = priorSpec.source.authoritativeText[index];
        assert.equal(prior.lesson, row.lesson);
        return row.lesson === card ? row : prior;
      });
      assert.deepEqual(nextSpec.source.authoritativeText.filter(row => row.lesson === card), reviewedOwnRows);
      nextSpec.display.widths = [...new Set([...priorSpec.display.widths, ...nextSpec.display.widths])]
        .sort((a, b) => a - b);
    }
    assert.deepEqual(nextSpec.source.authoritativeText.filter(row => row.lesson !== card),
      priorSpec.source.authoritativeText.filter(row => row.lesson !== card));
    assert.equal(priorTuple.svg.sha256, asset.svg.sha256);
    assert.equal(read(priorTuple.review.path).status, 'pass');
    const retainedPriorTuple = {};
    for (const [key, file] of Object.entries(priorTuple)) {
      const retained = `${out}/previous-shared-tuples/${asset.id}/${asset.id}.${key === 'svg' ? 'svg' : `${key}.json`}`;
      copy(file.path, retained);
      retainedPriorTuple[key] = bind(retained);
    }
    if (config.mergeSharedCanonicalContext) {
      sharedContextReconciliation = {
        affectedLesson: card, otherLessonContextsPreservedAtRetention: true,
        reviewedOwnLessonContextUnchanged: true, priorTuple: retainedPriorTuple,
        inheritedLessonProducts: sharedLessonFiles,
        unchangedSvgSha256: asset.svg.sha256, rendererCalls: 0,
      };
    }
    sharedReconciliations.push({
      id: asset.id, changedLessonContextOnly: card,
      inheritedEnglishLesson: config.sharedCanonicalLesson, inheritedContextUnchanged: true,
      geometrySourceLabelsAndSvgUnchanged: true, priorTuple: retainedPriorTuple,
    });
    assert.equal(bind(specFile).sha256, priorTuple.spec.sha256);
    if (config.mergeSharedCanonicalContext)
      fs.writeFileSync(specFile, JSON.stringify(nextSpec, null, 2) + '\n');
    else {
      fs.copyFileSync(asset.spec.path, specFile);
      assert.equal(bind(specFile).sha256, asset.spec.sha256);
    }
  } else {
    copy(asset.spec.path, specFile);
    copy(asset.svg.path, svgFile);
  }
  const saveCanonicalMetadata = (file, data, key) => {
    if (!replacesShared) return save(file, data);
    assert.equal(bind(file).sha256, priorTuple[key].sha256);
    fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
  };
  const render = read(asset.render.path);
  render.spec = { path: path.relative(repo, specFile), sha256: bind(specFile).sha256 };
  render.output.svg = { path: path.relative(repo, svgFile), sha256: bind(svgFile).sha256 };
  render.contextLocalization.englishApplicabilityReview = bind(`${out}/review/${config.enReview}`);
  for (const check of render.displayChecks)
    if (check.evidence) check.evidence = bind(`${out}/full-course-dom.original.json`);
  if (sharedContextReconciliation) {
    const priorRender = read(sharedContextReconciliation.priorTuple.render.path);
    for (const check of priorRender.displayChecks)
      if (!render.displayChecks.some(current => current.width === check.width))
        render.displayChecks.push(check);
    render.displayChecks.sort((a, b) => a.width - b.width);
    render.sharedCanonicalContextReconciliation = sharedContextReconciliation;
  }
  render.unchangedOutputWidthReconciliation.originalRender =
    bind(`${out}/first-english-tuples/${asset.id}/${asset.id}.render.json`);
  render.unchangedOutputWidthReconciliation.firstAuthoritativeCourseDomWidthEvidence =
    bind(`${out}/full-course-dom.original.json`);
  if (render.unchangedOutputWidthReconciliation.firstFailedRerender)
    render.unchangedOutputWidthReconciliation.firstFailedRerender =
      bind(`${out}/author/${config.widthStage}/first-failure.json`);
  if (config.nextFourAdapter) {
    assert(!render.spec.path.includes('.tmp/'));
    assert(!render.output.svg.path.includes('.tmp/'));
    assert.deepEqual(render.contextRebinding, read(asset.original.render.path).contextRebinding);
    render.historicalContextRebindingDeclarationsPreservedNotDependencies = true;
  } else {
    assert(!JSON.stringify(render).includes('.tmp/'));
    assert(!JSON.stringify(render).includes('/STEMROBIN-181/tmp/'));
  }
  saveCanonicalMetadata(renderFile, render, 'render');
  const review = read(asset.review.path);
  review.spec = { path: path.relative(repo, specFile), sha256: bind(specFile).sha256 };
  review.render = { path: path.relative(repo, renderFile), sha256: bind(renderFile).sha256 };
  review.outputs.svg = { path: path.relative(repo, svgFile), sha256: bind(svgFile).sha256 };
  review.localeContextReconciliation.englishApplicabilityReview =
    bind(`${out}/review/${config.enReview}`);
  review.localeContextReconciliation.currentEnglish =
    bind(`${out}/author/${config.authorStage}/en.lesson.draft.json`);
  if (config.nextFourAdapter)
    review.localeContextReconciliation.receivedInventory = bind(`${out}/received-inventory.original.json`);
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
  if (sharedContextReconciliation)
    review.sharedCanonicalContextReconciliation = sharedContextReconciliation;
  if (config.nextFourAdapter)
    review.localeContextReconciliation.englishMetadataChanges.independentEnglishContextAndPixelReviewPending = false;
  review.completeEnglishAccessibilityApproval = false;
  assert(!JSON.stringify(review).includes('.tmp/'));
  assert(!JSON.stringify(review).includes('/STEMROBIN-181/tmp/'));
  saveCanonicalMetadata(reviewFile, review, 'review');
  const canonical = { id: asset.id, ...(config.nextFourAdapter ? { mode: 'deterministic' } : {}),
    spec: bind(specFile), svg: bind(svgFile),
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
const tupleReceipt = run(`${tag}-first-en-canonical-tuple-bindings${resumeCanonical ? '-source-path-recovery'
  : resumeGeneratedHistory ? '-history-reference-recovery' : ''}`,
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
for (const file of sharedLessonFiles) assert.equal(bind(file.path).sha256, file.sha256);
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
  sharedReconciliations, inheritedSharedLessonProductsUnchanged: sharedLessonFiles,
  englishCanonicalLessonProductsExactNativeBytes: true, otherEnglishRowsAndHeaderUnchanged: true,
  originalObjects: config.objects, originalTasks: 0, originalFigures: config.figures,
  ...(config.sourceFigureCount !== undefined ? { sourceFigureCount: config.sourceFigureCount,
    manifestFigureCount: config.figures } : {}),
  actualCourseWidths: native.actualCourseWidths, allApprovedSvgBytesUnchanged: !config.generatedPng,
  ...(config.generatedPng ? {
    allApprovedPngBytesAndGenerationEvidenceUnchanged: true, embeddedRasterGlyphCertificationClaimed: false,
  } : {}),
  ...(config.nextFourAdapter ? {
    receivedInventory: bind(`${out}/received-inventory.original.json`),
    originalTupleProvenance: bind(`${out}/original-tuple-provenance.json`),
    perAssetModes: Object.fromEntries(canonicalAssets.map(asset => [asset.id, asset.mode])),
    firstEnglishReview: bind(`${out}/review/${config.enReview}`),
    historicalChineseScienceApprovalRecovered: false,
    allApprovedSvgBytesUnchanged: true,
    allApprovedPngBytesAndGenerationEvidenceUnchanged: canonicalAssets.some(asset => asset.mode === 'generated'),
    embeddedRasterGlyphCertificationClaimed: false,
  } : {}),
  completeEnglishAccessibilityApproval: false,
  headedAcceptanceClaimed: display.headed,
  newCompleteCourses: 0, newSourcePages: 0, parentImageOpens: 0,
});
save(`${out}/batch-ready.json`, {
  task: config.task, status: `FIRST_COMPLETE_VISIBLE_EN_EDITION_OF_ALREADY_COUNTED_${card.split('-').at(-1).toUpperCase()}_READY`,
  cards: [card], alreadyCountedInHistoricalBatch: config.historicalBatch, newCompleteCourses: 0, newSourcePages: 0,
  originalObjects: config.objects, originalTasks: 0, originalFigures: config.figures, products, views,
  ...(config.sourceFigureCount !== undefined ? { sourceFigureCount: config.sourceFigureCount,
    manifestFigureCount: config.figures, maximumImagesPerReviewerBatch: 8,
    maximumImagesPerReviewerContext: 24 } : {}),
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
  ...(config.nextFourAdapter ? {
    receivedInventory: bind(`${out}/received-inventory.original.json`),
    originalTupleProvenance: bind(`${out}/original-tuple-provenance.json`),
    firstEnglishReview: bind(`${out}/review/${config.enReview}`),
    historicalChineseScienceApprovalRecovered: false,
    unchangedCompleteCourses: 153, unchangedSourcePages: 581,
    maximumSavedImages: config.screenshots,
  } : {}),
  formalHandoff: false, scopeComplete: false,
});
console.log(JSON.stringify({ ready: bind(`${out}/batch-ready.json`), products: products.length }));

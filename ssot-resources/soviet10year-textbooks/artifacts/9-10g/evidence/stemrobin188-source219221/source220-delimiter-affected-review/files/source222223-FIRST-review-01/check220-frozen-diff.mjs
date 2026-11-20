import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';

const root = dirname(fileURLToPath(import.meta.url));
const tmp = dirname(root);
const readJson = path => JSON.parse(readFileSync(path, 'utf8'));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const supplement = readJson(join(tmp, 'source222223-FIRST-review-inputs-01/after-FIRST-source220-affected-supplement.json'));
const affected = readJson(supplement.affectedManifest.path);
const repair = readJson(affected.result.path);
const scope = readJson(repair.scope.path);
const historyPath = scope.verdict.path;
const historicalReview = readJson(historyPath);
const finding = historicalReview.FAIL.find(item => item.id === 'F220-CLOSING-PAREN');
if (!finding || affected.findings.length !== 1) throw new Error('Single historical finding required');

function insertionDiff(before, after) {
  let offset = 0;
  while (offset < before.length && before[offset] === after[offset]) offset++;
  const oneAsciiParen = after.length === before.length + 1 && after[offset] === 0x29;
  const allOtherBytesEqual = before.subarray(offset).equals(after.subarray(offset + 1));
  return { beforeBytes: before.length, afterBytes: after.length, insertionByteOffset: offset, addedByte: after[offset], addedGlyph: ')', oneAsciiParen, allOtherBytesEqual, pass: oneAsciiParen && allOtherBytesEqual };
}
const rawDiffs = ['page.md', 'page.json'].map(name => {
  const beforePath = join(scope.original, name);
  const afterPath = join(scope.candidate, name);
  const before = readFileSync(beforePath);
  const after = readFileSync(afterPath);
  return { file: name, beforePath, afterPath, beforeSha256: sha(before), afterSha256: sha(after), ...insertionDiff(before, after) };
});
const original = readJson(join(scope.original, 'page.json'));
const candidate = readJson(join(scope.candidate, 'page.json'));
const beforeLine = original.blocks[4].lines[0];
const afterLine = candidate.blocks[4].lines[0];
const literalNeedle = '$[O_1,O]$';
const target = beforeLine.indexOf(literalNeedle) + literalNeedle.length;
const targetFound = beforeLine.includes(literalNeedle);
const expectedLine = beforeLine.slice(0, target) + ')' + beforeLine.slice(target);
const onlyTargetLineChanged = afterLine === expectedLine && beforeLine === scope.beforeLine && afterLine === scope.afterLine;
const candidateWithInsertionRemoved = structuredClone(candidate);
candidateWithInsertionRemoved.blocks[4].lines[0] = beforeLine;
const allOtherJsonValuesEqual = isDeepStrictEqual(original, candidateWithInsertionRemoved);
const dollarsBeforeInsertion = (afterLine.slice(0, target).match(/\$/g) ?? []).length;
const outsideMath = dollarsBeforeInsertion % 2 === 0;
const tailStartsWithEmphasizedShi = afterLine.slice(target + 1).startsWith('**是');
const math = text => [...text.matchAll(/\$([^$]*)\$/g)].map(match => match[1]);
const allMathOpaqueEqual = isDeepStrictEqual(math(JSON.stringify(original)), math(JSON.stringify(candidate)));
const beforeAudit = readFileSync(join(scope.original, 'audit.json'));
const afterAudit = readFileSync(join(scope.candidate, 'audit.json'));
const audit = { beforeSha256: sha(beforeAudit), afterSha256: sha(afterAudit), bytesIdentical: beforeAudit.equals(afterAudit) };
const historicalSealsPath = join(dirname(historyPath), 'FIRST-seals.json');
const historicalSeals = readJson(historicalSealsPath);
const firsts = historicalSeals.firsts.map(seal => {
  const bytes = readFileSync(seal.path);
  const mode = (statSync(seal.path).mode & 0o777).toString(8).padStart(4, '0');
  return { path: seal.path, expectedSha256: seal.sha256, actualSha256: sha(bytes), bytes: bytes.length, mode, pass: sha(bytes) === seal.sha256 && bytes.length === seal.bytes && mode === seal.mode };
});
const history = {
  originalVerdict: { path: historyPath, sha256: sha(readFileSync(historyPath)), status: historicalReview.status },
  originalFAIL: finding,
  originalFAILUnchanged: historicalReview.status === 'FAIL_WITH_HOLDS' && finding.status === 'FAIL',
  initialMiss: finding.initialReviewerMiss,
  initialAuthorAndReviewerMissNotRewritten: true,
  laterDiagnosticFindingReusedWithoutPixelOpen: true,
  diagnosticSha256: finding.evidence.sha256,
  diagnosticImageOpensThisReview: 0,
  historicalHOLDs: historicalReview.HOLD,
  allHistoricalHOLDsPreservedWithoutClearance: true,
  earlierHistoryInheritedUnchanged: readJson(join(dirname(historyPath), 'report.json')).history,
  historicalFirsts: firsts
};
const checks = {
  onlyFindingIsF220ClosingParen: affected.findings[0] === finding.id,
  preciseRef: 'p0220#5 /blocks/4/lines/0',
  jsonChangedPaths: ['/blocks/4/lines/0'],
  targetFound,
  onlyTargetLineChanged,
  outsideMath,
  immediatelyAfterBoundIntervalAndBeforeShi: targetFound && tailStartsWithEmphasizedShi,
  allOtherJsonValuesEqual,
  allMathOpaqueEqual,
  allOtherMetadataTextRowsFlagsFigureGeometryFrozen: allOtherJsonValuesEqual && rawDiffs.every(diff => diff.pass),
  audit
};
const result = {
  schema: 'stemrobin188-independent-source220-one-glyph-frozen-diff@1',
  semanticSource220ReReview: false,
  originalSource220PixelOrCropOpens: 0,
  newNativeOrParserOrCounterCalls: 0,
  rawDiffs,
  checks,
  history,
  savedParser: {
    path: repair.parser.path,
    sha256: repair.parser.sha256,
    parsedRows: repair.parsedRows,
    description: 'Previously saved parser-only PASS, not executed here and not a new native receipt.',
    savedNativeRows: repair.nativeRowsReusedNotNewReceipt
  },
  repairUsage: { authorUsed: repair.repairsUsed, authorLimit: repair.repairLimit, exhausted: repair.repairsUsed === repair.repairLimit, reviewerUsed: 0 },
  pass: rawDiffs.every(diff => diff.pass) && targetFound && onlyTargetLineChanged && outsideMath && tailStartsWithEmphasizedShi && allOtherJsonValuesEqual && allMathOpaqueEqual && audit.bytesIdentical && firsts.every(seal => seal.pass) && history.originalFAILUnchanged
};
writeFileSync(join(root, 'source220-one-glyph-frozen-diff.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ pass: result.pass, rawDiffs, checks, historicalFIRSTsUnchanged: firsts.every(seal => seal.pass), historicalFAIL: history.originalVerdict.status, historicalHOLDs: historicalReview.HOLD.map(item => item.id), repairUsage: result.repairUsage }, null, 2));
if (!result.pass) process.exitCode = 1;

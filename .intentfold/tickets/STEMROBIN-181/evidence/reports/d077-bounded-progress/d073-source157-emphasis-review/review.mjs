import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { fileURLToPath } from 'node:url';

const cwd = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const tmp = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp');
const output = path.join(tmp, 'd073-source157-emphasis-review');
const reportPath = path.join(output, 'report.json');
const scriptPath = fileURLToPath(import.meta.url);
if (path.dirname(scriptPath) !== output || process.cwd() !== cwd) {
  throw new Error('Unexpected review workspace');
}
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const bindings = [];
const checks = [];
const check = (id, passed, evidence) => {
  checks.push({ id, status: passed ? 'PASS' : 'FAIL', evidence });
};
const bind = (role, entry, freezeRef) => {
  const absolute = path.resolve(cwd, entry.path);
  const bytes = fs.readFileSync(absolute);
  const actualSHA = sha256(bytes);
  const matches = actualSHA === entry.sha256
    && (entry.bytes === undefined || bytes.length === entry.bytes);
  bindings.push({
    role, path: absolute, freezeRef,
    expectedSHA: entry.sha256, actualSHA, actualBytes: bytes.length,
    expectedBytes: entry.bytes, status: matches ? 'PASS' : 'FAIL',
  });
  check(`binding:${role}`, matches, { actualSHA, actualBytes: bytes.length });
  return bytes;
};
const freezeBytes = bind('repairFreeze', {
  path: path.join(tmp, 'd072-source157-emphasis-repair/author-freeze.json'),
  sha256: 'abc7c9f1943f07e308bbc611e0f45c12b9bba07d761fe58c103c9a8ba46e22ee',
});
const freeze = JSON.parse(freezeBytes);
const reviewBytes = bind('originalIndependentReview', {
  path: path.join(tmp, 'd067-source156-157-review/report.json'),
  sha256: '607a2bd69981056ffce0eaa849892b23c9a64abec5ddf8fa757dd483bf38da66',
}, '/originalReview');
const originalReview = JSON.parse(reviewBytes);
const authorBytes = bind('originalAuthorFreeze', freeze.originalAuthor, '/originalAuthor');
const originalAuthor = JSON.parse(authorBytes);
const originalPage = originalAuthor.pages.find((p) => p.physicalPage === 157);
const reviewedPage = originalReview.pages.find((p) => p.physicalPage === 157);
const originalFinding = originalReview.findings.find((f) => f.id === 'F-157-BOLD-AND');
const oldSpan = '**\u5438\u6536**\u548c**\u6563\u5c04**';
const newSpan = '**\u5438\u6536\u548c\u6563\u5c04**';
check('authorizedObservationAndScope', freeze.ticket === 'STEMROBIN-181'
  && freeze.physicalPage === 157 && freeze.finding === originalFinding.id
  && originalFinding.status === 'FAIL'
  && originalFinding.frozenJsonPointer === '/blocks/9/lines/0'
  && originalFinding.observedSourceEmphasisSpan === newSpan.replaceAll('**', '')
  && freeze.oldSpan === oldSpan && freeze.newSpan === newSpan
  && freeze.changedJsonPointer === '/blocks/9/lines/0'
  && freeze.originalReview.sha256 === sha256(reviewBytes)
  && originalReview.freezeBinding.actualSHA === sha256(authorBytes),
{ sourceRef: originalFinding.sourceRef, observationReusedWithoutImages: true });

const beforeMdBytes = bind('beforePageMd', freeze.before.pageMd, '/before/pageMd');
const beforeJsonBytes = bind('beforePageJson', freeze.before.pageJson, '/before/pageJson');
const afterMdBytes = bind('afterPageMd', freeze.page.files['page.md'], '/page/files/page.md');
const afterJsonBytes = bind('afterPageJson', freeze.page.files['page.json'], '/page/files/page.json');
const beforeMd = beforeMdBytes.toString('utf8');
const afterMd = afterMdBytes.toString('utf8');
const beforeJsonText = beforeJsonBytes.toString('utf8');
const afterJsonText = afterJsonBytes.toString('utf8');
const beforeJson = JSON.parse(beforeJsonText);
const afterJson = JSON.parse(afterJsonText);
check('baselineMatchesPreviouslyReviewedSnapshot',
  sha256(beforeMdBytes) === reviewedPage.pageMd.actualSHA
  && sha256(beforeJsonBytes) === reviewedPage.pageJson.actualSHA
  && sha256(beforeMdBytes) === originalPage.files.pageMd.sha256
  && sha256(beforeJsonBytes) === originalPage.files.pageJson.sha256,
{ originalReviewPage: 157 });
bind('repairBeforePageMdCopy', {
  path: path.join(tmp, 'd072-source157-emphasis-repair/root/10p/pages/0157/before-page.md'),
  sha256: sha256(beforeMdBytes), bytes: beforeMdBytes.length,
});
const count = (text, span) => text.split(span).length - 1;
check('pageMdExactSingleSpanReplacement',
  count(beforeMd, oldSpan) === 1 && count(afterMd, oldSpan) === 0
  && count(afterMd, newSpan) === 1
  && Buffer.from(beforeMd.replace(oldSpan, newSpan)).equals(afterMdBytes),
{ oldSpan, newSpan, byteDelta: afterMdBytes.length - beforeMdBytes.length });
check('pageJsonExactSingleSpanReplacement',
  count(beforeJsonText, oldSpan) === 1 && count(afterJsonText, oldSpan) === 0
  && count(afterJsonText, newSpan) === 1
  && Buffer.from(beforeJsonText.replace(oldSpan, newSpan)).equals(afterJsonBytes),
{ byteDelta: afterJsonBytes.length - beforeJsonBytes.length });
const differences = [];
function compare(before, after, pointer = '') {
  if (isDeepStrictEqual(before, after)) return;
  if (before === null || after === null || typeof before !== 'object'
    || typeof after !== 'object' || Array.isArray(before) !== Array.isArray(after)) {
    differences.push(pointer);
    return;
  }
  for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
    const escaped = key.replaceAll('~', '~0').replaceAll('/', '~1');
    compare(before[key], after[key], `${pointer}/${escaped}`);
  }
}
compare(beforeJson, afterJson);
check('onlyAuthorizedJsonPointerChanged',
  isDeepStrictEqual(differences, ['/blocks/9/lines/0']),
{ changedJsonPointers: differences });
const changedMdLines = [];
const beforeLines = beforeMd.split('\n');
const afterLines = afterMd.split('\n');
for (let i = 0; i < Math.max(beforeLines.length, afterLines.length); i++) {
  if (beforeLines[i] !== afterLines[i]) changedMdLines.push(i + 1);
}
check('onlyAffectedMarkdownLineChanged',
  isDeepStrictEqual(changedMdLines, [originalFinding.frozenMdLine])
  && beforeLines.length === afterLines.length,
{ changedMdLines, lineCounts: [beforeLines.length, afterLines.length] });
check('plainTextAndWrapsUnchanged',
  beforeMd.replaceAll('**', '') === afterMd.replaceAll('**', '')
  && beforeJsonText.replaceAll('**', '') === afterJsonText.replaceAll('**', ''),
{ removedMarkup: 'Only ** delimiters; whitespace and punctuation retained exactly.' });
const otherBlocksUnchanged = beforeJson.blocks.length === afterJson.blocks.length
  && beforeJson.blocks.every((block, i) => i === 9
    || isDeepStrictEqual(block, afterJson.blocks[i]));
const adjustedBlock = structuredClone(beforeJson.blocks[9]);
adjustedBlock.lines[0] = adjustedBlock.lines[0].replace(oldSpan, newSpan);
check('remainingBlocksAndAffectedBlockFieldsUnchanged', otherBlocksUnchanged
  && isDeepStrictEqual(adjustedBlock, afterJson.blocks[9]),
{ totalBlocks: beforeJson.blocks.length, unaffectedBlocks: beforeJson.blocks.length - 1 });
check('allMetadataAndSourceBindingsUnchanged',
  isDeepStrictEqual(beforeJson.meta, afterJson.meta),
{ source: afterJson.meta.source, render: afterJson.meta.render,
  profile: afterJson.meta.profile, figures: afterJson.meta.figures });

bind('beforeAudit', freeze.before.audit, '/before/audit');
bind('afterAudit', freeze.page.files['audit.json'], '/page/files/audit.json');
check('auditBytesUnchanged',
  freeze.before.audit.sha256 === freeze.page.files['audit.json'].sha256, {});
const repairWork = path.join(tmp, 'd072-source157-emphasis-repair/work/10p/pages/0157');
for (const name of ['layout.json', 'page.template.md']) {
  const oldEntry = name === 'layout.json' ? freeze.before.layout : freeze.before.preparedTemplate;
  bind(`repair:${name}`, { ...oldEntry, path: path.join(repairWork, name) });
}
// Hash repair figure bytes only; no image decoder, renderer or source image read.
for (const [i, figure] of originalPage.figures.entries()) {
  for (const format of ['png', 'svg']) {
    const original = figure[format];
    const current = bind(`repairFigure:${i}:${format}`, {
      ...original, path: path.join(repairWork, 'figures', path.basename(original.path)),
    }, `/originalAuthor/pages/1/figures/${i}/${format}`);
    const entry = originalReview.actualFileBindings.entries.find(([ref]) =>
      ref === `/pages/1/figures/${i}/${format}`);
    check(`figureMatchesPriorIndependentBinding:${i}:${format}`,
      sha256(current) === entry[1] && current.length === entry[2], { hashOnly: true });
    if (format === 'png') {
      const declared = freeze.figures[i];
      check(`repairFigureDeclaration:${i}`, path.resolve(cwd, declared.path)
        === path.join(repairWork, 'figures', path.basename(original.path))
        && declared.sha256 === sha256(current), {});
    }
  }
}
const beforeReceiptEntry = originalPage.nativeReceipts.find((r) => r.path.includes('/finalize-'));
const beforeReceipt = JSON.parse(bind('beforeNativeFinalize', beforeReceiptEntry));
const afterReceipt = JSON.parse(bind('afterNativeFinalize', freeze.nativeFinalize, '/nativeFinalize'));
const expectedCommand = [
  '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize', '--book', '10p',
  '--page', '157', '--root',
  path.join(tmp, 'd072-source157-emphasis-repair/root'), '--work',
  path.join(tmp, 'd072-source157-emphasis-repair/work'),
];
check('nativeFinalizeReceiptsConsistent',
  beforeReceipt.stage === 'finalize' && beforeReceipt.exitCode === 0
  && afterReceipt.exitCode === 0 && afterReceipt.stderr === ''
  && beforeReceipt.stdout === afterReceipt.stdout
  && isDeepStrictEqual(afterReceipt.command, expectedCommand),
{ receiptReadOnly: true, nativeExecutedInThisReview: false,
  beforeStdout: beforeReceipt.stdout, afterStdout: afterReceipt.stdout,
  receiptLimit: 'Repair receipt has no output hash list; after files are independently hash-bound to the repair freeze.' });
const holds = originalReview.findings.filter((f) => f.status === 'HOLD');
check('allRemainingHoldObjectsPreservedExactly',
  isDeepStrictEqual(freeze.remainingHolds, holds),
{ holdIds: holds.map((f) => f.id) });
const preservedHold = originalReview.preserved157EmphasisHold;
check('originalOpeningHoldFragmentAndObjectPreserved',
  sha256(Buffer.from(preservedHold.rawJsonFragmentVerbatim))
    === preservedHold.rawJsonFragmentActualSHA
  && authorBytes.includes(Buffer.from(preservedHold.rawJsonFragmentVerbatim))
  && isDeepStrictEqual(originalAuthor.holds[0], preservedHold.originalObject), {});
check('repairHasNoFullPagePromotion', freeze.fullPageSOURCE === 'HOLD-pending-remaining-findings'
  && freeze.imagesOpened === 0 && freeze.sourcePagesAdded === 0
  && freeze.canonicalWrites === false && freeze.vectorizeReplay === false, {});
const status = checks.every((c) => c.status === 'PASS') ? 'PASS' : 'FAIL';
const report = {
  schema: 'STEMROBIN-181/affected-emphasis-independent-review@1',
  ticket: 'STEMROBIN-181', book: '10p', physicalPage: 157,
  reviewedAt: new Date().toISOString(), cwd, reportPath, status,
  statusScope: 'affectedGate only; not SOURCE or full-page approval',
  reviewer: 'temporary-authorized-independent-affected-text-reviewer',
  newADWorker: false,
  affectedGate: {
    id: 'F-157-BOLD-AND', sourceRef: 'p0157#10', status,
    jsonPointer: '/blocks/9/lines/0', mdLine: originalFinding.frozenMdLine,
    oldSpan, newSpan, beforeLine: beforeJson.blocks[9].lines[0],
    afterLine: afterJson.blocks[9].lines[0],
    observationBasis: 'Previously actually observed continuous bold span in hash-bound d067; no new source observation.',
    historicalFAILRetained: true, historicalSnapshotFinding: originalFinding,
  },
  fullPageSOURCE: 'HOLD',
  originalReviewStatus: originalReview.status,
  originalVerdicts: originalReview.verdicts,
  originalFindings: originalReview.findings,
  remainingFindings: holds,
  originalUnresolved: originalReview.unresolved,
  preserved157EmphasisHold: preservedHold,
  originalAuthorHolds: originalAuthor.holds,
  originalAuthorPriorHolds: originalAuthor.priorHolds,
  unresolved: {
    remainingSourceHolds: holds.map((f) => f.id),
    figure117InterpretationHold: originalReview.unresolved.figure117InterpretationHold,
    remainingBoundaryHold: originalReview.unresolved.remainingBoundaryHold,
    untouchedPriorScope: originalReview.unresolved.untouchedPriorScope,
    affectedRepairVerification: status,
    historicalConfirmedRepairGapRetainedInOriginalUnresolved: true,
  },
  fileBindings: bindings, checks,
  scriptBinding: { path: scriptPath, sha256: sha256(fs.readFileSync(scriptPath)) },
  imagesOpened: 0, cumulativeImageCount: 0,
  imageBudget: {
    imagesOpened: 0, cumulativeImageCount: 0, fullPageSourceImagesRead: 0,
    imageDecodes: 0, figureAssetHashOnlyReads: 4,
    historicalD067ImageCountNotReissuedOrAdded: true,
  },
  restrictionsObserved: {
    writesRestrictedTo: output, independentAffectedReviewOnly: true,
    fullPageReviewed: false, sourceImagesReopened: false,
    nativeCommandsExecuted: false, databaseAccessed: false,
    canonicalWritten: false, sharedMeterModified: false, sharedIndexModified: false,
    othersChangesReverted: false, commitCreated: false,
    sourcePagePASSIssued: false, newRAWOrSVGApprovalIssued: false,
    publicationApproval: false,
  },
};
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({
  status, fullPageSOURCE: report.fullPageSOURCE, checks: checks.length,
  failures: checks.filter((c) => c.status === 'FAIL'),
  reportPath, sha256: sha256(fs.readFileSync(reportPath)),
}, null, 2));
if (status !== 'PASS') process.exitCode = 1;

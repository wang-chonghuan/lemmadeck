import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), root);
const out = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d216-source71-73-review');
const records = new Map();
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
function read(file, role) {
  const absolute = path.resolve(root, file);
  const bytes = fs.readFileSync(absolute);
  const previous = records.get(absolute);
  records.set(absolute, {
    path: absolute,
    bytes: bytes.length,
    sha256: digest(bytes),
    roles: [...new Set([...(previous?.roles ?? []), role])],
  });
  return bytes.toString('utf8');
}
const json = (file, role) => JSON.parse(read(file, role));
const binding = (entry, role) => {
  read(entry.path, role);
  const actual = records.get(entry.path);
  return { path: entry.path, expectedSha256: entry.sha256, actualSha256: actual.sha256,
    expectedBytes: entry.bytes, actualBytes: actual.bytes,
    matches: actual.sha256 === entry.sha256 && actual.bytes === entry.bytes };
};

// This is a literal saved-file comparison, not a native finalize, render or gate replay.
function literalBlocks(markdown) {
  const [, frontmatter, body] = markdown.split('---', 3);
  const blocks = [];
  let current;
  for (const raw of body.split(/\r?\n/)) {
    const match = raw.trim().match(/^<!--\s+(h1|h2|h3|p|exhead|ex|fig|cap|foot)\b(.*?)\s*-->$/);
    if (match) {
      const rest = match[2];
      current = { kind: match[1], lines: [],
        cont: /\bcont\b/.test(rest), open: /\bopen\b/.test(rest),
        samerow: /\bsamerow\b/.test(rest) };
      blocks.push(current);
    } else if (current && raw.trim() && !raw.trim().startsWith('![')) {
      current.lines.push(raw);
    }
  }
  return { meta: JSON.parse(frontmatter), blocks };
}
const comparable = blocks => blocks.map(({ kind, lines, cont, open, samerow }) =>
  ({ kind, lines, cont, open, samerow }));
const printedRows = blocks => blocks.reduce((count, block) => {
  if (block.kind === 'fig') return count;
  const wraps = block.lines.reduce((sum, line) => sum + [...line].filter(c => c === '\u21b5').length, 0);
  return count + block.lines.length + wraps -
    (block.samerow ? (block.kind === 'cap' ? block.lines.length : 1) : 0);
}, 0);

for (const file of [
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.claude/skills/ld-s10y-lesson/references/production-resume.md',
  '.intentfold/readme.md',
  '.intentfold/charter/engineering.md',
  '/Users/yong/.agents/skills/intentfold/SKILL.md',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py',
  '.claude/skills/ld-s10y-lesson/tools/blocks.py',
  '.claude/skills/ld-s10y-lesson/tools/layout.py',
  '.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json',
]) read(file, 'consulted-instruction-or-readonly-counting-contract');
read(path.join(out, 'review-audit.mjs'), 'readonly-review-audit');
const input = json(path.join(out, 'input-freeze.json'), 'original-dispatch-freeze');
assert.equal(records.get(path.join(out, 'input-freeze.json')).sha256,
  'df4acedc7c409740e4789c0823acc4a906d6ce036c35c638c65b7371cc797316');
const sourceOnly = json(path.join(out, 'source-only.json'), 'source-only-before-comparison');
const after = json(path.join(out, 'after-inventory.json'), 'comparison-inventory-after-baselines');
assert(binding(input.sourceOnly, 'dispatch-source-binding').matches);
assert(binding(input.afterInventory, 'dispatch-after-binding').matches);
const originalBindings = sourceOnly.pages.map(page => binding(page.original, 'opened-original'));
assert(originalBindings.every(entry => entry.matches));
const predecessor = binding(sourceOnly.precedingText, 'predecessor70-hash-only-not-approval');
const seal = json(path.join(out, 'independent-baseline-seal.json'), 'immutable-independent-seal');
for (const entry of seal.baselines) {
  const baseline = json(entry.path, 'immutable-independent-pixel-baseline');
  assert.equal(records.get(entry.path).sha256, entry.sha256);
  assert.equal(baseline.independence.afterInventoryRead, false);
  assert.equal(baseline.independence.candidateRead, false);
}
const author = json(after.authorReport.path, 'reused-author-facts-after-baselines');
assert(binding(after.authorReport, 'current-author-report-binding').matches);
assert(binding(after.nativeState, 'preserved-native-state-binding').matches);
const native = json(after.nativeState.path, 'preserved-native-state');
const receipts = native.stages.filter(stage => stage.receipt).map(stage =>
  binding(stage.receipt, 'preserved-first-native-receipt'));
assert(receipts.every(entry => entry.matches));
const failedReceipt = json(native.firstFailure.receipt.path, 'first-failure-never-replayed');
const layout = json('.tmp/STEMROBIN-181/d1816-d207/source-work/10p/pages/0072/layout.json',
  'saved-preparation-layout-not-finalize-replay');
read('.intentfold/tickets/STEMROBIN-181/tmp/d1816-d209-source68-70-review/report.json',
  'preserved-predecessor-independent-fail-and-holds');
read('.intentfold/tickets/STEMROBIN-181/tmp/d1816-d221-source69-70-text-repair/report.json',
  'current-predecessor-author-repair-nativepass-not-approval');

const pages = [];
for (const entry of after.pages) {
  const files = entry.files.map(file => binding(file, 'current-page-candidate-or-saved-audit'));
  assert(files.every(file => file.matches));
  const mdFile = entry.files.find(file => file.path.endsWith('/page.md'));
  const jsonFile = entry.files.find(file => file.path.endsWith('/page.json'));
  const parsed = literalBlocks(read(mdFile.path, 'all-literal-md-rows-and-boundaries'));
  const saved = json(jsonFile.path, 'all-literal-json-rows-and-boundaries');
  assert.deepEqual(parsed.meta, saved.meta);
  assert.deepEqual(parsed.blocks, comparable(saved.blocks));
  const authorPage = author.pages.find(page => page.page === entry.page);
  const draft = json(authorPage.immutableOriginalDraft.immutableParsedCandidate.path,
    'immutable-author-draft-comparison-only');
  read(authorPage.immutableOriginalDraft.immutableMarkdown.path, 'immutable-author-md-hash');
  assert.deepEqual(comparable(draft.blocks), comparable(saved.blocks));
  const frozenMatches = authorPage.currentCandidatesAndFrozenCopies.map(pair =>
    binding(pair.frozen, 'immutable-author-final-snapshot'));
  assert(frozenMatches.every(file => file.matches));
  const bodyRows = saved.blocks.filter(block => ['p', 'h1', 'h2', 'h3'].includes(block.kind))
    .flatMap(block => block.lines);
  pages.push({
    page: entry.page,
    mdJsonAllLiteralRowsAndBoundaryFlags: 'PASS',
    immutableAuthorDraftBodyUnchanged: 'PASS',
    currentFrozenFinalBytesMatch: 'PASS',
    bodyRows: bodyRows.length,
    printedPhysicalRowsIncludingCaptionBandsAndFooter: printedRows(saved.blocks),
    captionEntries: saved.blocks.filter(block => block.kind === 'cap').length,
    sharedCaptionRows: saved.blocks.filter(block => block.kind === 'cap' && block.samerow).length,
    footerRows: saved.blocks.filter(block => block.kind === 'foot').flatMap(block => block.lines).length,
    vectorArrowMacrosInBody: bodyRows.reduce((count, line) =>
      count + (line.match(/\\vec\b/g)?.length ?? 0), 0),
    exerciseBlocks: saved.blocks.filter(block => ['ex', 'exhead'].includes(block.kind)).length,
    headers: saved.blocks.filter(block => /^h[123]$/.test(block.kind)).map(block => block.lines),
  });
}
for (const figure of after.figures) {
  for (const kind of ['raster', 'svg', 'svgPreview']) {
    if (figure[kind]) assert(binding(figure[kind], 'available-raw-current-' + kind).matches);
  }
}
read(path.join(out, 'source72-r14-punctuation.png'), 'eighth-open-original-only-punctuation-crop');
const source72 = json(path.join(out, 'independent-source72.json'), 'immutable-row-count-basis');
const results = {
  inputFreezeMatches: true,
  originalBindingsMatch: true,
  currentReviewTargetBindingsMatch: true,
  predecessor70OriginalDispatchBinding: predecessor,
  pages,
  source72RowCount: {
    body: source72.countBasis.bodyPhysicalRows,
    captionPhysicalBands: source72.countBasis.captionPhysicalBands,
    footerPhysicalBands: source72.countBasis.footerPageNumberBands,
    actualExcludingFooter: source72.actualPrintedRowCount,
    actualIncludingFooter: source72.actualPrintedRowCount + source72.countBasis.footerPageNumberBands,
    nativeFirstDetected: 20,
    nativeFirstTranscribed: 21,
    savedUnmaskedJoinedBand: layout.line_bands.find(([top, bottom]) => top === 1715 && bottom === 1816),
    finalMaskedBandListAvailable: false,
  },
  firstNative72Failure: { exitCode: failedReceipt.exitCode, retriesThisReview: 0 },
};

const reportPath = path.join(out, 'report.json');
if (fs.existsSync(reportPath)) {
  const report = json(reportPath, 'final-review-report');
  assert.equal(report.actual72rows.nativeComparableIncludingFooter, 21);
  assert.equal(report.counters.actualImageOpens, 8);
  assert.equal(report.sourceApproval, false);
  assert.equal(report.courseApproval, false);
}
if (process.argv.includes('--verify-final')) {
  const freezePath = path.join(out, 'review-freeze.json');
  const freeze = JSON.parse(fs.readFileSync(freezePath, 'utf8'));
  assert.equal(freeze.entries.length, records.size);
  for (const record of freeze.entries) {
    assert.deepEqual(record, records.get(record.path));
  }
  console.log(JSON.stringify({ status: 'PASS_BINDINGS_ONLY_NO_REVIEW_REPLAY',
    files: records.size, reportSha256: records.get(reportPath).sha256,
    freezeSha256: digest(fs.readFileSync(freezePath)),
    independentBaselinesUnchanged: true, candidateBytesUnchanged: true }));
} else if (process.argv.includes('--freeze-entries')) {
  for (const record of records.values()) console.log(JSON.stringify(record) + ',');
  console.log(JSON.stringify({ entryCount: records.size, results }));
} else {
  console.log(JSON.stringify(results, null, 2));
}

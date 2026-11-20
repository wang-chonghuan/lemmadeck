import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
const root = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d234-source83-85-review');
const freezePath = path.join(root, 'review-freeze.json');
const receiptPath = path.join(root, 'freeze-verification.json');
const inputSha = '714a7c229441ff54990cce4420f12013e029f9e4388dc9c303ab86eb5a324f8c';
const readJson = filename => JSON.parse(fs.readFileSync(filename, 'utf8'));
const digest = filename => {
  const bytes = fs.readFileSync(filename);
  return { path: filename, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const writeNew = (filename, data) => {
  if (path.dirname(filename) !== root) throw new Error('Write outside permitted review directory');
  fs.writeFileSync(filename, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' });
};

if (process.cwd() !== repo || path.dirname(fileURLToPath(import.meta.url)) !== root) {
  throw new Error('Wrong review checkout or script directory');
}

if (process.argv[2] === 'seal') {
  const inputPath = path.join(root, 'input-freeze.json');
  const input = readJson(inputPath);
  const source = readJson(input.sourceOnly.path);
  const after = readJson(input.afterInventory.path);
  const author = readJson(after.authorReport.path);
  const reportPath = path.join(root, 'report.json');
  const report = readJson(reportPath);
  const baseline = readJson(path.join(root, 'precomparison-freeze.json'));
  const entries = new Map();
  const add = (binding, category) => {
    const absolute = path.resolve(repo, binding.path);
    if (!absolute.startsWith(`${repo}/`)) throw new Error('Input outside checkout');
    const actual = digest(absolute);
    if ((binding.bytes !== undefined && actual.bytes !== binding.bytes) ||
        (binding.sha256 !== undefined && actual.sha256 !== binding.sha256)) {
      throw new Error(`Changed bound evidence: ${absolute}`);
    }
    if (entries.has(absolute)) throw new Error(`Duplicate freeze entry: ${absolute}`);
    entries.set(absolute, { ...actual, category });
  };

  add({ path: inputPath, sha256: inputSha }, 'authoritative-input-freeze');
  add(input.sourceOnly, 'source-only-manifest');
  add(input.afterInventory, 'after-inventory-manifest');
  add(source.precedingText, 'preceding-text-only');
  for (const page of source.pages) {
    add(page.original, 'original-page-viewed');
    add(page.grid, 'prepared-grid-hash-only-not-viewed');
  }
  for (const key of ['authorReport', 'authorFreeze', 'authorCollected', 'prepared']) {
    add(after[key], 'author-native-comparison-metadata');
  }
  for (const page of author.currentOperativeDrafts) {
    add(page.snapshotMd, 'immutable-author-md');
    add(page.snapshotJson, 'immutable-author-json');
  }
  for (const page of after.candidates) {
    for (const file of page.files) add(file, 'frozen-native-current-text-or-audit');
  }
  for (const stage of after.stages.filter(stage => stage.stage !== 'preview')) {
    for (const file of stage.evidence) add(file, 'existing-native-receipt-only-not-replayed');
  }
  for (const file of baseline.files) add(file, 'independent-precomparison-baseline');
  add(report.independence.precomparisonFreeze, 'precomparison-freeze');
  for (const name of ['source83-row24-detail.png', 'source84-row5-detail.png']) {
    add({ path: path.join(root, name) }, 'original-source-text-crop-viewed');
  }
  add({ path: path.join(root, 'source-clarifications.json') }, 'affected-source-clarification');
  add({ path: reportPath }, 'review-report');
  add({ path: fileURLToPath(import.meta.url) }, 'freeze-tool');
  if (entries.size !== report.counters.ownFreezeExpectedEntryCount) throw new Error('Wrong freeze size');
  const freeze = {
    schema: 'STEMROBIN-181/first-independent-review-freeze@1',
    batch: 'D234',
    ticket: 'STEMROBIN-181',
    book: '10p',
    finish: 'review',
    cwd: repo,
    writeRoot: root,
    status: report.status,
    inputFreezeSha256: inputSha,
    report: digest(reportPath),
    precomparisonFreeze: report.independence.precomparisonFreeze,
    scope: report.scope,
    counters: report.counters,
    entryCount: entries.size,
    files: [...entries.values()],
    sourceApproval: false,
    rawOrSvgApproval: false,
    nativeReplayed: false,
    formalHandoff: false,
    verification: {
      requiredRuns: 1,
      command: ['node', fileURLToPath(import.meta.url), 'verify'],
      receiptPath,
      receiptExcludedToAvoidSelfHashCycle: true,
      imageReadsDuringVerification: 0
    }
  };
  writeNew(freezePath, freeze);
  console.log(JSON.stringify({ sealed: true, entryCount: entries.size, report: freeze.report, reviewFreeze: digest(freezePath) }, null, 2));
} else if (process.argv[2] === 'verify') {
  if (fs.existsSync(receiptPath)) throw new Error('Own freeze verification already performed');
  const freeze = readJson(freezePath);
  const seen = new Set();
  let verified = 0;
  for (const expected of freeze.files) {
    if (!path.isAbsolute(expected.path) || seen.has(expected.path)) throw new Error('Invalid frozen path');
    seen.add(expected.path);
    const actual = digest(expected.path);
    if (actual.bytes !== expected.bytes || actual.sha256 !== expected.sha256) {
      throw new Error(`Freeze mismatch: ${expected.path}`);
    }
    verified += 1;
  }
  if (verified !== freeze.entryCount || verified !== 56) throw new Error('Wrong verified count');
  const report = digest(freeze.report.path);
  if (report.bytes !== freeze.report.bytes || report.sha256 !== freeze.report.sha256) {
    throw new Error('Report binding mismatch');
  }
  const receipt = {
    schema: 'STEMROBIN-181/review-freeze-verification@1',
    batch: 'D234',
    status: 'PASS',
    verificationRuns: 1,
    verifiedEntryCount: verified,
    verifiedManifestDigest: digest(freezePath),
    report,
    counters: freeze.counters,
    actualImageOpens: 5,
    contextImageOpens: 5,
    rawOrSvgImageOpens: 0,
    sourceApproval: false,
    repairsPerformed: 0,
    reviewOnlyBoundedStop: true
  };
  writeNew(receiptPath, receipt);
  console.log(JSON.stringify({ ...receipt, verificationReceipt: digest(receiptPath) }, null, 2));
} else {
  throw new Error('Expected seal or verify');
}

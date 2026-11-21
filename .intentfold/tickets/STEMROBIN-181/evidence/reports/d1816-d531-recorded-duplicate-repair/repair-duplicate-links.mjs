import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/evidence/reports/d1816-d531-recorded-duplicate-repair`;
const require = createRequire(path.join(repo, 'app/package.json'));
const { marked } = require('marked');
const read = file => JSON.parse(fs.readFileSync(file));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => ({ path: file, bytes: fs.statSync(file).size, sha256: hash(fs.readFileSync(file)) });
const write = (name, value) => fs.writeFileSync(`${O}/${name}`, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const plan = read(`${O}/plan.json`);
const ready = plan.candidates.filter(row => row.status === 'EXACT_DUPLICATE_READY_TO_RETAIN_AND_REMOVE');
assert.equal(ready.length, 48);
assert(!fs.existsSync(`${O}/repair.json`));
assert.equal(read(`${O}/dependencies.json`).matches.length, 0);
const failedRoot = `${O}/native/d531-recorded-exact-page-duplicates`;
fs.mkdirSync(failedRoot, { recursive: true });
for (const file of ['receipt.json', 'stdout.txt', 'stderr.txt'])
  fs.copyFileSync(`${T}/tmp/d1816-recovery/native/d531-recorded-exact-page-duplicates/${file}`,
    `${failedRoot}/${file}`, fs.constants.COPYFILE_EXCL);
assert.equal(read(`${failedRoot}/receipt.json`).exitCode, 1);
fs.copyFileSync(`${T}/tmp/d1816-recovery/repair-d531-recorded-duplicates.mjs`,
  `${failedRoot}/first-failed-script.mjs`, fs.constants.COPYFILE_EXCL);
const pages = [...new Set(ready.map(row => row.pageDirectory))];
const markdownChanges = [];
const ownerPins = [];
const pendingMarkdown = new Map();
const tokenShape = tokens => tokens.map(token => {
  const { raw, tokens: children, text, ...other } = token;
  return { ...other, ...(children ? { tokens: tokenShape(children) }
    : text === undefined ? {} : { text }) };
});
for (const directory of pages) {
  const metadata = `${directory}/page.json`, markdown = `${directory}/page.md`;
  if (fs.existsSync(metadata)) ownerPins.push(bind(metadata));
  if (!fs.existsSync(markdown)) continue;
  const before = fs.readFileSync(markdown, 'utf8');
  const originals = ready.filter(row => row.pageDirectory === directory);
  let after = before;
  const changes = [];
  for (const row of originals) {
    const from = `figures/${path.basename(row.original)}`;
    const to = `../../figures/${path.basename(row.original)}`;
    const images = [];
    marked.walkTokens(marked.lexer(before), token => {
      if (token.type === 'image' && token.href === from) images.push(token);
    });
    if (!images.length) continue;
    for (const image of images) {
      const updated = image.raw.replace(`](${from})`, `](${to})`);
      assert.notEqual(updated, image.raw, 'Only simple existing generated image links are in scope.');
      assert(after.includes(image.raw));
      after = after.replace(image.raw, updated);
      changes.push({ from, to, beforeRaw: image.raw, afterRaw: updated, canonical: row.canonical,
        expectedSha256: row.canonicalBinding.sha256 });
    }
  }
  if (!changes.length) continue;
  const beforeTokens = marked.lexer(before);
  marked.walkTokens(beforeTokens, token => {
    if (token.type === 'image') {
      const change = changes.find(row => row.from === token.href);
      if (change) token.href = change.to;
    }
  });
  assert.deepEqual(tokenShape(marked.lexer(after)), tokenShape(beforeTokens),
    'Markdown content other than exact image hrefs changed.');
  let restored = after;
  for (const change of changes) restored = restored.replace(change.afterRaw, change.beforeRaw);
  assert.equal(restored, before);
  const backup = `${O}/before/${markdown}`;
  assert(!fs.existsSync(backup));
  const tracked = spawnSync('git', ['ls-files', '--error-unmatch', '--', markdown],
    { cwd: repo, stdio: 'ignore' }).status === 0;
  assert(tracked, 'Do not add an unrelated untracked draft page to delivery.');
  const head = execFileSync('git', ['show', `HEAD:${markdown}`], { cwd: repo, encoding: 'utf8' });
  let stagedAfter = head;
  const stagedChanges = [];
  for (const change of changes) {
    if (stagedAfter.includes(change.beforeRaw)) {
      stagedAfter = stagedAfter.replace(change.beforeRaw, change.afterRaw);
      stagedChanges.push(change);
    }
  }
  assert.equal(stagedChanges.length, changes.length, 'Working-only changed links cannot be silently staged as source content.');
  markdownChanges.push({ file: markdown,
    before: { path: backup, bytes: Buffer.byteLength(before), sha256: hash(before) }, afterSha256: hash(after),
    headSha256: hash(head), stagedSha256: hash(stagedAfter),
    unrelatedWorkingChangesPreserved: before !== head, changes });
  pendingMarkdown.set(markdown, { before, after, backup });
}
for (const [file, pending] of pendingMarkdown) {
  assert.equal(fs.readFileSync(file, 'utf8'), pending.before);
  fs.mkdirSync(path.dirname(pending.backup), { recursive: true });
  fs.writeFileSync(pending.backup, pending.before, { flag: 'wx' });
  fs.writeFileSync(file, pending.after);
}
const moved = [];
for (const row of ready) {
  assert.equal(bind(row.original).sha256, row.originalBinding.sha256);
  assert.equal(bind(row.canonical).sha256, row.originalBinding.sha256);
  const backup = `${O}/before/${row.original}`;
  fs.mkdirSync(path.dirname(backup), { recursive: true });
  assert(!fs.existsSync(backup));
  fs.renameSync(row.original, backup);
  assert.equal(bind(backup).sha256, row.originalBinding.sha256);
  moved.push({ ...row, backup: bind(backup) });
}
for (const owner of ownerPins) assert.equal(bind(owner.path).sha256, owner.sha256);
for (const change of markdownChanges) {
  assert.equal(bind(change.file).sha256, change.afterSha256);
  for (const link of change.changes)
    assert.equal(bind(path.resolve(path.dirname(change.file), link.to)).sha256, link.expectedSha256);
}
for (const row of moved) {
  assert(!fs.existsSync(row.original));
  assert.equal(bind(row.canonical).sha256, row.canonicalBinding.sha256);
}
const unresolved = plan.candidates.filter(row => row.originalBinding && !ready.includes(row));
assert.equal(unresolved.length, 31);
for (const row of unresolved) assert.equal(bind(row.original).sha256, row.originalBinding.sha256);
write('repair.json', {
  stage: 'D532', status: 'EXACT_DUPLICATES_RETAINED_AND_REMOVED_WITH_MARKDOWN_HREF_REBINDING',
  failedPrecheckPreserved: bind(`${failedRoot}/receipt.json`), firstPrecheckMovedNoFiles: true,
  changes: moved, markdownChanges, unchangedPageJson: ownerPins,
  originalCanonicalBytesUnchanged: true, sourceTextExceptLinksUnchanged: true,
  removedDuplicateFiles: 48, trackedRemovals: 34, untrackedCopiesRetained: 14,
  markdownFilesChanged: markdownChanges.length,
  exactMarkdownLinksChanged: markdownChanges.reduce((sum, row) => sum + row.changes.length, 0),
  remainingRecordedDraftFiles: 31, remainingDrafts: unresolved,
  scopeMechanicalCheck: 'PASS', wholeResourceAuditPassed: false,
  sourceOrContentApprovalsInherited: false, newSourcePageApprovalIssued: false,
  courseOrPageMeterDelta: 0, imagesOpened: 0, globalAuditReplayed: false,
});
fs.copyFileSync(import.meta.filename, `${O}/repair-duplicate-links.mjs`, fs.constants.COPYFILE_EXCL);
console.log(JSON.stringify({ stage: 'D532', removedExactDuplicates: 48,
  tracked: 34, markdownFiles: markdownChanges.length,
  imageHrefs: markdownChanges.reduce((sum, row) => sum + row.changes.length, 0),
  remainingLocalDraftFiles: 31, wholeResourceGatePassed: false }));

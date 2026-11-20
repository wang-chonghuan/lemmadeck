import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import path from 'node:path';

const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), root);
const work = `${root}/.intentfold/tickets/STEMROBIN-181/tmp/d1816-d173-n5-radian-text-review`;
const bindingMap = new Map();
const json = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = (file, expected) => {
  assert.ok(path.isAbsolute(file));
  assert.ok(!/\.(png|jpe?g|webp|svg|pdf|gif)$/i.test(file), 'No image or PDF reads');
  const bytes = fs.readFileSync(file);
  const result = {
    path: file,
    bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
  };
  if (expected) {
    assert.equal(result.bytes, expected.bytes, file);
    assert.equal(result.sha256, expected.sha256, file);
  }
  bindingMap.set(file, result);
  return result;
};
const checkReferences = (value) => {
  if (!value || typeof value !== 'object') return;
  if (value.path && Number.isInteger(value.bytes) && value.sha256) {
    bind(value.path, value);
    return;
  }
  Object.values(value).forEach(checkReferences);
};
const input = bind(`${work}/input-freeze.json`);
assert.equal(input.sha256, 'fe769994256ac2185a78346a027234b972a216da8d5ee856aa1362333660d8d8');
checkReferences(json(input.path));
const source = json(`${work}/source-only.json`);
const after = json(`${work}/after-baseline.json`);
checkReferences(source);
checkReferences(after);
const baseline = bind(`${work}/source-baseline.json`);
assert.equal(json(baseline.path).savedBeforeAfterBaselineOrRepairedAuthorMaterialRead, true);
const prior = json(after.previousReview.path);
assert.deepEqual([prior.scienceVerdict, prior.zhVerdict, prior.enVerdict], ['FAIL', 'FAIL', 'FAIL']);
assert.deepEqual(prior.findings.map((f) => f.id), ['D167-n5-text-01']);
const original = json(source.originalLesson.path);
const author = json(after.authorReport.path);
bind(author.prepared.path, author.prepared);
const prepared = json(author.prepared.path);
const inheritedRoot = path.dirname(after.previousReview.path);
bind(`${inheritedRoot}/review-freeze.json`);
bind(prior.bindingEvidence.path, prior.bindingEvidence);
const inheritedEvidence = json(prior.bindingEvidence.path);
const inheritedSelection = inheritedEvidence.currentBindings.filter((b) =>
  /\/artifacts\/9p\/pages\/00(17|18|19)\/(page\.(md|json)|audit\.json)$/.test(b.path)
);
inheritedSelection.forEach((b) => bind(b.path, b));
assert.equal(inheritedSelection.length, 9);

const differences = (a, b, pointer = '') => {
  if (Object.is(a, b)) return [];
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object' ||
      Array.isArray(a) !== Array.isArray(b)) return [pointer];
  return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap((key) =>
    differences(a[key], b[key], `${pointer}/${key}`)
  );
};
const tokens = (text) => text.match(/\$[^$]*\$/g) ?? [];
const numerals = (text) => text.match(/\d+(?:\.\d+)?/g) ?? [];
const comparisons = [];
const protectedCarriers = [];
const reused = prior.blocks.filter((b) => b.sourceIndex !== 7);
assert.equal(reused.length, 13);
assert.equal(new Set(reused.map((b) => b.sourceIndex)).size, 13);
for (const block of reused) {
  for (const key of ['scienceVerdict', 'zhVerdict', 'enVerdict']) {
    assert.ok(block[key].startsWith('PASS_TEXT'));
  }
  assert.deepEqual(block.findings, []);
}
for (const change of author.changes) {
  const beforeBinding = bind(change.before.path, change.before);
  const frozenBinding = bind(change.frozen.path, change.frozen);
  bind(change.current.path, change.current);
  const before = json(beforeBinding.path);
  const current = json(frozenBinding.path);
  assert.deepEqual(differences(before, current), ['/prose/7/text']);
  const priorBinding = prior.templateBindings.find((b) => b.edition === change.edition);
  assert.equal(priorBinding.sha256, beforeBinding.sha256);
  assert.equal(current.prose.length, 14);
  assert.deepEqual(current.source.data, original);
  current.prose.forEach((block, index) => {
    assert.equal(block.source_text, original.prose[index].text);
    assert.deepEqual(block.source_refs, original.prose[index].source_refs);
  });
  const beforeText = before.prose[7].text;
  const currentText = current.prose[7].text;
  assert.deepEqual(tokens(currentText), tokens(beforeText));
  assert.deepEqual(tokens(currentText), tokens(original.prose[7].text));
  assert.deepEqual(numerals(currentText), numerals(beforeText));
  reused.forEach((block) => assert.deepEqual(current.prose[block.sourceIndex], before.prose[block.sourceIndex]));
  for (const name of ['exercises.template.json', 'figures.template.json']) {
    const preparedCopy = prepared.copies.find((c) =>
      c.workingBeforeRepair.path.includes(`/${change.edition}/`) &&
      c.workingBeforeRepair.path.endsWith(`/${name}`)
    );
    assert.ok(preparedCopy);
    const old = bind(preparedCopy.before.path, preparedCopy.before);
    const frozen = bind(`${path.dirname(frozenBinding.path)}/${name}`, old);
    const working = bind(preparedCopy.workingBeforeRepair.path, old);
    protectedCarriers.push({ edition: change.edition, name, before: old, frozen, working });
  }
  const language = change.edition === 'modern-us-neutral' ? 'zh' : 'en';
  const receiptBinding = author.changedProseFlowReceipts.find((b) =>
    b.path.includes(`d172-n5-${language}-`) && b.path.endsWith('/receipt.json')
  );
  const receipt = json(receiptBinding.path);
  assert.equal(receipt.exitCode, 0);
  assert.equal(receipt.cwd, root);
  assert.equal(path.resolve(root, receipt.command.at(-1)), change.current.path);
  const output = json(`${path.dirname(receiptBinding.path)}/stdout.txt`);
  assert.deepEqual(output.resolvedBreaks, [2, 8, 13, 21, 25]);
  assert.equal(output.paragraphs.filter((p) => p.blockIndex === 7).map((p) => p.text).join('\n\n'), currentText);
  const clarification = output.paragraphs.find((p) =>
    p.blockIndex === 7 && (p.text.includes('radians') || p.text.includes('\u5f27\u5ea6'))
  );
  assert.equal(clarification.index, 9);
  assert.ok(clarification.text.indexOf(language === 'zh' ? '\u5f27\u5ea6' : 'radians') <
    clarification.text.indexOf('$AB=R\\alpha$'));
  comparisons.push({
    edition: change.edition,
    changedPointers: ['/prose/7/text'],
    formulasUnchanged: true,
    numbersUnchanged: true,
    sourceSnapshotsAndReferencesUnchanged: true,
    unchangedReviewedBlocks: 13,
    reusedD172ProseFlow: { exitCode: 0, affectedParagraphIndex: 9, resolvedBreaks: output.resolvedBreaks },
  });
}
author.changedProseFlowReceipts.forEach((b) => bind(b.path, b));
bind(`${work}/dispatch-record.json`);
bind(`${work}/verify-bindings.mjs`);
if (fs.existsSync(`${work}/report.json`)) {
  const report = json(`${work}/report.json`);
  assert.deepEqual([report.scienceVerdict, report.zhVerdict, report.enVerdict], ['pass', 'pass', 'pass']);
  assert.equal(report.resolvedFinding, 'D167-n5-text-01');
  assert.equal(report.reusedUnaffectedBlocksPerLocale, 13);
  assert.equal(report.composedTextApproval, true);
  report.templateBindings.forEach((b) => bind(b.path, b));
  bind(`${work}/report.json`);
}
if (fs.existsSync(`${work}/review-freeze.json`)) {
  const freeze = json(`${work}/review-freeze.json`);
  checkReferences(freeze);
  assert.equal(freeze.composedTextApproval, true);
  bind(`${work}/review-freeze.json`);
}
console.log(JSON.stringify({
  allMatch: true,
  comparisons,
  originalD167FailurePreserved: true,
  reusedObservationPointers: reused.map((b) => `/blocks/${b.sourceIndex}`),
  protectedCarriers,
  inheritedPageBindingsVerified: inheritedSelection.length,
  bindings: [...bindingMap.values()],
}, null, 2));

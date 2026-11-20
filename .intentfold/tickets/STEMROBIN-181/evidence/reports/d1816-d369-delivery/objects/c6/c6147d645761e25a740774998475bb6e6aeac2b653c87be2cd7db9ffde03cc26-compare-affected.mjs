import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
const tmp = resolve(repo, '.intentfold/tickets/STEMROBIN-181/tmp');
const review = resolve(tmp, 'd1816-d347-n149-affected-text-review');
const read = path => JSON.parse(readFileSync(path, 'utf8'));
const save = (name, value) => writeFileSync(resolve(review, name), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
const hash = path => createHash('sha256').update(readFileSync(path)).digest('hex');
const author = read(resolve(tmp, 'd1816-d343-n149-text-repair/author-freeze.json'));
const first = read(resolve(tmp, 'd1816-d332-n149-first-text-review/report.json'));
const expectations = read(resolve(review, 'expectations.json'));
const fixedBindings = [
  author.review, author.raw, author.rawExercises,
  ...author.records.flatMap(record => [record.before, record.after, record.working]),
  ...first.input_bindings.filter(item => ['mass_primary_text','mass_primary_receipt','beta_primary_receipt','expectations','expectations_freeze'].includes(item.key)),
];
const bindings = fixedBindings.map(binding => ({
  ...binding, actualSha256: hash(binding.path), match: hash(binding.path) === binding.sha256,
}));
if (!bindings.every(binding => binding.match)) throw new Error('Input binding changed; no flow executed');
const tokens = text => text.match(/\$[^$]*\$/g) ?? [];
const digits = text => text.match(/\d+/g) ?? [];
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const records = author.records.map(record => {
  const before = read(record.before.path);
  const after = read(record.after.path);
  const changed = after.prose.flatMap((entry, index) => equal(before.prose[index], entry) ? [] : [index]);
  if (!equal(changed, expectations.expectedChangedEntries[record.locale])) throw new Error('Unexpected changed set');
  const protectedEntry = ({ text, historical_entities, ...entry }) => entry;
  const changedEntries = changed.map(index => ({
    index,
    source_refs: after.prose[index].source_refs,
    changedFields: Object.keys(after.prose[index]).filter(key => !equal(before.prose[index][key], after.prose[index][key])),
    beforeText: before.prose[index].text,
    afterText: after.prose[index].text,
    sourceText: after.prose[index].source_text,
    beforeEntities: before.prose[index].historical_entities,
    afterEntities: after.prose[index].historical_entities,
    changes: after.prose[index].changes,
    mathTokensUnchanged: equal(tokens(before.prose[index].text), tokens(after.prose[index].text)),
    digitSequenceUnchanged: equal(digits(before.prose[index].text), digits(after.prose[index].text)),
  }));
  const { prose: beforeProse, section_breaks: beforeBreaks, ...beforeTop } = before;
  const { prose: afterProse, section_breaks: afterBreaks, ...afterTop } = after;
  return {
    locale: record.locale,
    working: record.working,
    beforeBoundToD332: record.before.sha256 === first.input_bindings.find(item => item.key === `${record.locale}_template`).sha256,
    expectedChangedIndices: expectations.expectedChangedEntries[record.locale],
    actualChangedIndices: changed,
    proseEntryCountUnchanged: beforeProse.length === afterProse.length,
    allProtectedEntryFieldsUnchanged: beforeProse.every((entry, index) => equal(protectedEntry(entry), protectedEntry(afterProse[index]))),
    allMathTokenSequencesUnchanged: beforeProse.every((entry, index) => equal(tokens(entry.text), tokens(afterProse[index].text))),
    allDigitSequencesUnchanged: beforeProse.every((entry, index) => equal(digits(entry.text), digits(afterProse[index].text))),
    otherTopFieldsUnchanged: equal(beforeTop, afterTop),
    beforeSectionBreaks: beforeBreaks,
    afterSectionBreaks: afterBreaks,
    changedEntries,
  };
});
save('comparison-observations.json', {
  schema: 'stemrobin181/affected-n149-comparison@1',
  generatedAt: new Date().toISOString(),
  method: 'Affected text/declaration diffs and raw/source/math/digit identity binding only. Does not rerun source, equations or 18-entry scientific review.',
  bindings,
  records,
});
const flowReceipts = records.map(record => {
  const tool = resolve(repo, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs');
  const startedAt = new Date().toISOString();
  const execution = spawnSync(process.execPath, [tool, '--json', record.working.path], {
    cwd: repo, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024,
  });
  const receipt = {
    locale: record.locale,
    cwd: repo,
    command: [process.execPath, tool, '--json', record.working.path],
    inputSha256: hash(record.working.path),
    startedAt, finishedAt: new Date().toISOString(),
    exitCode: execution.status,
    error: execution.error?.message ?? null,
    stderr: execution.stderr,
    stdout: execution.stdout,
    purpose: 'Permitted text-only final prose-flow anchor validation; no producer, math check, render or test.',
  };
  save(`${record.locale}.prose-flow.receipt.json`, receipt);
  if (execution.status !== 0) return { locale: record.locale, exitCode: execution.status, error: execution.stderr };
  const flow = JSON.parse(execution.stdout);
  save(`${record.locale}.prose-flow.json`, flow);
  return {
    locale: record.locale,
    exitCode: execution.status,
    resolvedBreaks: flow.resolvedBreaks,
    affectedBoundaries: flow.boundaries.filter(boundary =>
      record.afterSectionBreaks.some((anchor, index) =>
        !equal(anchor, record.beforeSectionBreaks[index]) && equal(anchor, { before: boundary.before, after: boundary.after }))),
  };
});
save('flow-observations.json', flowReceipts);
console.log(JSON.stringify({
  bindingsMatch: bindings.every(binding => binding.match),
  records: records.map(({ changedEntries, ...record }) => ({
    ...record, changedEntries,
  })),
  flowReceipts,
}, null, 2));

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
if (process.cwd() !== repo) throw new Error('Wrong working directory');
const tmp = resolve(repo, '.intentfold/tickets/STEMROBIN-181/tmp');
const names = ['d1816-d355-fig277-first-review', 'd1816-d356-source388390-affected-review'];
const read = path => JSON.parse(readFileSync(path, 'utf8'));
const receipt = path => {
  const bytes = readFileSync(path);
  return { path, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') };
};
function collect(value, items = []) {
  if (!value || typeof value !== 'object') return items;
  if (value.path && value.sha256) items.push(value);
  for (const [key, child] of Object.entries(value)) if (key !== 'path' && key !== 'sha256') collect(child, items);
  return items;
}
const plans = names.map(name => {
  const directory = resolve(tmp, name);
  const report = read(resolve(directory, 'report.json'));
  const observations = read(resolve(directory, 'comparison-observations.json'));
  const expected = collect(report);
  for (const binding of observations.bindings) expected.push({ path: binding.path, sha256: binding.sha256 });
  const unique = new Map();
  for (const item of expected) {
    const path = resolve(repo, item.path);
    const actual = receipt(path);
    if (actual.sha256 !== item.sha256) throw new Error(`Input changed before freeze: ${path}`);
    unique.set(path, actual);
  }
  const files = readdirSync(directory).filter(name => name !== 'review-freeze.json').sort().map(name => receipt(resolve(directory, name)));
  return {
    directory,
    freeze: {
      schema: 'stemrobin181/reviewer-file-freeze@1',
      ticket: 'STEMROBIN-181',
      batch: report.batch,
      frozenAtUtc: new Date().toISOString(),
      repository: repo,
      status: report.status,
      scope: report.scope,
      files,
      inputs: Array.from(unique.values()),
      allInputBindingsRecheckedAtFreeze: true,
      usage: { ...report.usage, reviewFreezeScriptCalls: 1 },
      approvals: { scopedReviewOnly: true, wholeCourse: false, wholeLessonDisplay: false, canonicalPromotion: false, exactArchivalScriptIdentity: false },
      stop: true
    }
  };
});
for (const { directory, freeze } of plans) {
  const path = resolve(directory, 'review-freeze.json');
  writeFileSync(path, `${JSON.stringify(freeze, null, 2)}\n`, { flag: 'wx' });
  console.log(JSON.stringify({ batch: freeze.batch, status: freeze.status, files: freeze.files, reviewFreeze: receipt(path), usage: freeze.usage }, null, 2));
}

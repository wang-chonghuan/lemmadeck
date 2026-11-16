import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, evidence, indexPath, durableFigures, absolute, relative, hash, bytes, read, exists,
  bind, verify, lookup, activePaths, scratch, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute'], 'Prepared only. Main must authorize execution; then pass --execute.');
const indexBytes = await bytes(indexPath);
const index = JSON.parse(indexBytes);
const plans = [];
const protectedFiles = [];
for (const id of ['fig-77', 'fig-99', 'fig-100']) {
  const file = `${durableFigures}/${id}.independent-review.json`;
  const beforeBytes = await bytes(file);
  const before = JSON.parse(beforeBytes);
  assert.equal(before.id, id);
  assert.equal(before.status, 'pass');
  const current = structuredClone(before);
  const references = [];
  activePaths(current, (owner, key, sha256, trail) => references.push({ owner, key, sha256, trail }));
  const replacements = [];
  for (const reference of references) {
    const original = reference.owner[reference.key];
    const expected = reference.sha256 ?? hash(await bytes(original));
    if (!scratch(original)) {
      await verify(original, expected);
      continue;
    }
    const retained = lookup(index, original, expected);
    assert.ok(retained, `Missing retained ${id} binding: ${original} (${expected})`);
    assert.ok(!scratch(retained) && relative(retained).startsWith(`${evidence}/`));
    await verify(retained, expected);
    if (await exists(original)) await verify(original, expected);
    reference.owner[reference.key] = retained;
    replacements.push({ field: reference.trail.join('.'), original: { path: original, sha256: expected },
      retained: { path: retained, sha256: expected } });
  }
  // Reverse precisely the path edits: every non-path field, status and byte hash must be unchanged.
  const reversed = structuredClone(current);
  for (const replacement of replacements) {
    const trail = replacement.field.split('.');
    let owner = reversed;
    for (const key of trail.slice(0, -1)) owner = owner[key];
    owner[trail.at(-1)] = replacement.original.path;
  }
  assert.deepEqual(reversed, before, `Non-path mutation: ${id}`);
  const afterReferences = [];
  activePaths(current, (owner, key, sha256) => afterReferences.push({ path: owner[key], sha256 }));
  for (const reference of afterReferences) {
    assert.ok(!scratch(reference.path), `Unresolved active scratch path: ${reference.path}`);
    assert.ok(await exists(reference.path), `Missing active path: ${reference.path}`);
    if (reference.sha256) await verify(reference.path, reference.sha256);
  }
  assert.ok(current.originalReport?.sha256, `No immutable original gate: ${id}`);
  await verify(current.originalReport.path, current.originalReport.sha256);
  protectedFiles.push(await bind(current.originalReport.path));
  const entries = await fs.readdir(absolute(durableFigures));
  for (const name of entries.filter(name => name.startsWith(`${id}.`) && name !== `${id}.independent-review.json`)) {
    protectedFiles.push(await bind(`${durableFigures}/${name}`));
  }
  const afterBytes = replacements.length ? Buffer.from(`${JSON.stringify(current, null, 2)}\n`) : beforeBytes;
  const backup = `${evidence}/author-history/d016/${id}-before-durable-paths.independent-review.json`;
  if (await exists(backup)) assert.deepEqual(await bytes(backup), beforeBytes, `Refuse replace original snapshot: ${backup}`);
  plans.push({ id, file, beforeBytes, afterBytes, backup, replacements,
    before: { path: file, sha256: hash(beforeBytes) }, after: { path: file, sha256: hash(afterBytes) },
    originalGate: current.originalReport, activePathsVerified: afterReferences.length });
}
const reportPath = `${ticket}/tmp/d016-durable-path-binding.json`;
assert.ok(!(await exists(reportPath)), `Already recorded; do not rerun: ${reportPath}`);
const trace = {
  ticket: 'STEMROBIN-181', batch: 'D-016', status: 'path-bindings-verified',
  scope: 'Byte-identical evidence retention; no independent approval, media/spec change or repeated native review.',
  evidenceIndexBefore: { path: indexPath, sha256: hash(indexBytes) },
  figures: plans.map(({ id, before, after, backup, replacements, originalGate, activePathsVerified }) => ({
    id, before, current: after, preservedBefore: { path: backup, sha256: before.sha256 },
    replacements, originalGate, activePathsVerified,
  })),
  protectedFiles, originalGateReportsPreservedVerbatim: true,
  specsMediaRenderGenerationNativeReviewsUnchanged: true,
  repeatedSourceScienceFigureGateOrNativeReview: false, rendererOrBrowserCalls: 0,
  inFlightProcesses: [],
};
assert.deepEqual(await bytes(indexPath), indexBytes, 'Shared index changed during preflight');
for (const plan of plans) assert.deepEqual(await bytes(plan.file), plan.beforeBytes, `Shared review changed: ${plan.file}`);
for (const binding of protectedFiles) await verify(binding.path, binding.sha256);
for (const plan of plans) await immutableWrite(plan.backup, plan.beforeBytes);
for (const plan of plans) {
  assert.deepEqual(await bytes(plan.file), plan.beforeBytes, `Shared review changed before write: ${plan.file}`);
  if (plan.replacements.length) await fs.writeFile(absolute(plan.file), plan.afterBytes);
}
for (const binding of protectedFiles) await verify(binding.path, binding.sha256);
for (const plan of plans) await verify(plan.file, plan.after.sha256);
const traceBytes = Buffer.from(`${JSON.stringify(trace, null, 2)}\n`);
await immutableWrite(reportPath, traceBytes);
const retainedReport = `${evidence}/reports/d016-durable-path-binding.json`;
await immutableWrite(retainedReport, traceBytes);
for (const plan of plans) {
  const record = { path: plan.backup, sha256: plan.before.sha256, originalPath: plan.file, batch: 'D-016',
    role: 'Historical before snapshot, never an active gate binding' };
  const previous = index.reports.find(item => item.path === record.path);
  if (previous) assert.equal(previous.sha256, record.sha256);
  else index.reports.push(record);
}
index.reports.push({ path: retainedReport, sha256: hash(traceBytes), originalPath: reportPath, batch: 'D-016' });
assert.deepEqual(await bytes(indexPath), indexBytes, 'Shared index changed before update');
index.updatedAt = new Date().toISOString();
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
console.log(`Rebound ${plans.reduce((sum, plan) => sum + plan.replacements.length, 0)} active paths for77/99/100.`);
console.log(`${reportPath} SHA256 ${hash(traceBytes)}`);

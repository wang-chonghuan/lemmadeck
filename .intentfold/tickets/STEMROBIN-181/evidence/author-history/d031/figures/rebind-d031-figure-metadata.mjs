import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  ticket, evidence, indexPath, absolute, read, bytes, bind, hash,
  verify, exists, immutableWrite, lookup, scratch, activePaths,
} from './retain-d016-evidence.mjs';

const [execute, ...ids] = process.argv.slice(2);
assert.equal(execute, '--execute');
assert.ok(ids.length);
const beforeIndex = await bytes(indexPath);
const index = JSON.parse(beforeIndex);
const figureRoot = 'ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/figures';
const results = [];
for (const id of ids) {
  assert.ok(['fig-233', 'fig-234', 'fig-235', 'fig-236', 'fig-237'].includes(id));
  const receiptPath = `${evidence}/reports/d031-${id}-promotion-binding.json`;
  assert.ok(!await exists(receiptPath));
  const file = `${figureRoot}/${id}.independent-review.json`;
  const before = await bytes(file);
  const current = JSON.parse(before);
  assert.equal(current.status, 'pass');
  const protectedAssets = await Promise.all(['spec.json', 'svg', 'render.json', 'review.json']
    .map(extension => bind(`${figureRoot}/${id}.${extension}`)));
  const references = [];
  activePaths(current, (owner, key, sha256, trail) =>
    references.push({ owner, key, sha256, trail }));
  const replacements = [];
  for (const reference of references) {
    const original = reference.owner[reference.key];
    if (!scratch(original)) {
      if (reference.sha256) await verify(original, reference.sha256);
      continue;
    }
    const sha256 = reference.sha256 ?? hash(await bytes(original));
    const retained = lookup(index, original, sha256);
    assert.ok(retained, `Historical figure reference not retained: ${original}`);
    await verify(retained, sha256);
    reference.owner[reference.key] = retained;
    replacements.push({ field: reference.trail, original, retained: { path: retained, sha256 } });
  }
  const reversed = structuredClone(current);
  for (const replacement of replacements) {
    let owner = reversed;
    for (const key of replacement.field.slice(0, -1)) owner = owner[key];
    owner[replacement.field.at(-1)] = replacement.original;
  }
  assert.deepEqual(reversed, JSON.parse(before), 'Only historical reference paths may change.');
  const beforePath = `${evidence}/author-history/d031/figures/${id}-before-durable-paths.independent-review.json`;
  await immutableWrite(beforePath, before);
  index.reports.push({ ...await bind(beforePath), originalPath: file,
    batch: 'D-031', deliveryClaim: false });
  await fs.writeFile(absolute(file), `${JSON.stringify(current, null, 2)}\n`);
  for (const binding of protectedAssets) await verify(binding.path, binding.sha256);
  await immutableWrite(receiptPath, `${JSON.stringify({
    ticket: 'STEMROBIN-181', figure: id, status: 'pass-promotion-path-only-binding',
    previousIndependentMetadata: await bind(beforePath),
    currentIndependentMetadata: await bind(file), replacements, protectedAssets,
    limits: 'Approved source/spec/SVG/render/review bytes unchanged. Independent sidecar historical paths alone rebound to exact retained evidence; no new scientific/pixel/native/browser check, card completion, DB, commit/push or handoff.',
  }, null, 2)}\n`);
  index.reports.push({ ...await bind(receiptPath), batch: 'D-031', deliveryClaim: false });
  results.push(await bind(receiptPath));
}
for (const name of ['promote-d031-n114-figure.mjs', 'rebind-d031-figure-metadata.mjs']) {
  const source = `${ticket}/tmp/${name}`;
  const destination = `${evidence}/author-history/d031/figures/${name}`;
  await immutableWrite(destination, await bytes(source));
  if (!index.reports.some(row => row.path === destination))
    index.reports.push({ ...await bind(destination), originalPath: source,
      batch: 'D-031', deliveryClaim: false });
}
assert.deepEqual(await bytes(indexPath), beforeIndex);
index.updatedAt = new Date().toISOString();
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
console.log(JSON.stringify({ promotionBindings: results }));

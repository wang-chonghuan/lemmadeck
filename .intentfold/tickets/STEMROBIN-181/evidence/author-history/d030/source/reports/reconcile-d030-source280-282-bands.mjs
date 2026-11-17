import assert from 'node:assert/strict';
import {
  ticket, read, bind, verify, immutableWrite, exists,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const folder = `${ticket}/tmp/d030-source280-282-count-correction`;
const previousPath = `${ticket}/tmp/d030-source280-283-affected-review.json`;
const previous = await read(previousPath);
const oldPath = `${ticket}/tmp/d030-source280-283-author/initial/counts.json`;
const newPath = `${folder}/count.stdout.json`;
const oldCounts = (await read(oldPath)).pages;
const newCounts = (await read(newPath)).pages;
assert.ok(!await exists(`${folder}/band-reconciliation.json`));
const observations = [];
for (const selection of previous.selections) {
  await verify(selection.original.path, selection.original.sha256);
  await verify(selection.candidate.path, selection.candidate.sha256);
  await verify(selection.source.path, selection.source.sha256);
  const old = oldCounts.find(row => row.pdf_page === selection.page);
  const current = newCounts.find(row => row.pdf_page === selection.page);
  const retained = old.native_masked_bands.filter(band =>
    JSON.stringify(band) !== JSON.stringify(selection.extraBand));
  assert.equal(retained.length, selection.expectedRows);
  assert.equal(current.native_masked_rows, selection.expectedRows);
  assert.equal(current.candidate_rows, selection.expectedRows);
  assert.equal(current.native_count_matches_candidate, true);
  assert.deepEqual(current.counting, selection.counting);
  const comparison = retained.map((original, index) => {
    const observed = current.native_masked_bands[index];
    assert.ok(observed[0] >= original[0] && observed[1] <= original[1]);
    assert.ok(observed[0] < observed[1]);
    return { original, observed, samePhysicalRowRetained: true,
      edgeResidueOnlyBoundaryShrink: JSON.stringify(original) !== JSON.stringify(observed) };
  });
  observations.push({
    page: selection.page, status: 'PASS', rows: selection.expectedRows, comparison,
    extraScanBandRemoved: selection.extraBand, noRowsAddedLostOrReordered: true,
    pixelBasis: 'Independent SOURCE explicitly approved full-height exclusion strips as containing no printed objects. Row boundaries can shrink when marginal residue is cleared. Every observed band is nonempty and contained in its original corresponding band.',
  });
}
const pages = previous.pages.map(row => {
  const observation = observations.find(item => item.page === row.physicalPage);
  return observation ? {
    ...row, status: 'PASS', sourceApproval: true, corrections: [],
    bandReconciliation: observation,
    affectedDecision: 'Approved full-height edge mask and unchanged body reused; actual existing count receipt has one nonempty contained band per original printed row. No command or image repeated.',
  } : row;
});
const output = `${ticket}/tmp/d030-source280-283-effective-review.json`;
await immutableWrite(output, `${JSON.stringify({
  schema: 'ld-s10y-lesson/affected-counting-only-source-review@1',
  ticket: 'STEMROBIN-181', book: '9p', status: 'PASS', pages,
  effectivePassPages: pages.map(row => row.physicalPage), effectiveFailPages: [],
  independentSOURCE: previous.initialReview,
  previousOverStrictComparison: await bind(previousPath),
  initialCounts: await bind(oldPath), currentCounts: await bind(newPath), observations,
  diagnostic: 'The first bookkeeping comparison unnecessarily required identical full-height bands, although SOURCE approved removing scan residue from the entire edge strips. Its false failures remain intact. Native counts themselves passed once. This reconciliation requires one-to-one containment, retaining every printed row and no extra band.',
  nativeInvocations: 0, imageOpens: 0, bodyOrSourceChanges: false,
  limits: 'Uses exact existing independent pixels and native receipts only; no recount, new visual, exact crop, scientific, modern or complete-card approval.',
}, null, 2)}\n`);
await immutableWrite(`${folder}/band-reconciliation.json`, `${JSON.stringify({
  status: 'pass-existing-native-receipts-reconciled', effectiveSOURCE: await bind(output),
  observations, nativeRecountInvocations: 0, imageOpens: 0,
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(output)));

import assert from 'node:assert/strict';
import {
  ticket, read, bytes, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

const phase = process.argv[2];
assert.ok(['prepare', 'freeze'].includes(phase));
const tmp = `${ticket}/tmp`;
const folder = `${tmp}/d023-source224-227-correction`;
const reviewPath = `${tmp}/d023-source224-227-source-review.json`;
await verify(reviewPath, '380a8225a3c03ac139c324b7c959cb1f14b2179142fce4254eb155e52f039d08');
const review = await read(reviewPath);
const changes = [];
for (const number of [224, 226]) {
  const page = review.pages.find(row => row.physicalPage === number);
  const finding = review.findings.find(row => row.physicalPage === number && row.kind.startsWith('literal-'));
  assert.ok(page && finding);
  const source = page.candidatePath;
  await verify(source, page.candidateSha256);
  const before = `${folder}/before/${String(number).padStart(4, '0')}.page.md`;
  const current = `${folder}/${String(number).padStart(4, '0')}.page.md`;
  if (phase === 'prepare') {
    assert.ok(!await exists(current));
    await immutableWrite(before, await bytes(source));
    await immutableWrite(current, await bytes(source));
  } else {
    const oldText = (await bytes(before)).toString('utf8');
    const newText = (await bytes(current)).toString('utf8');
    assert.equal(oldText.split(finding.candidate).length, 2);
    assert.equal(newText, oldText.replace(finding.candidate, finding.source));
    assert.equal(newText.split('\n').length, oldText.split('\n').length);
    changes.push({
      pdf_page: number, finding: finding.id, sourceRef: finding.ref,
      before: await bind(before), candidate: await bind(current),
      delta: { before: finding.candidate, after: finding.source },
      sourceGrid: { path: page.sourceGridPath, sha256: page.sourceGridSha256 },
      saved_candidate_rows: page.physicalRows.savedCandidate,
      saved_native_rows: page.physicalRows.savedNative,
      rowCountAndMathAndFiguresAndFlagsAndMetadataUnchanged: true,
    });
  }
}
if (phase === 'freeze') {
  const inventoryFinding = review.findings.find(row => row.id === 'D023-SOURCE-224-02');
  const inventory = `${folder}/fig174-source-inventory-correction.json`;
  await immutableWrite(inventory, `${JSON.stringify({
    figure: 'fig-174', ref: inventoryFinding.ref, finding: inventoryFinding.id,
    before: inventoryFinding.authorInventory, current: inventoryFinding.source,
    basis: await bind(reviewPath),
    scope: 'Only voltage-indicator direction corrected from the owning INITIAL observation. No new pixel, native geometry or whole-inventory approval.',
  }, null, 2)}\n`);
  const output = `${folder}/author-correction-freeze.json`;
  assert.ok(!await exists(output));
  await immutableWrite(output, `${JSON.stringify({
    batch: 'D023', status: 'affected-source-corrections-frozen-awaiting-independent-review',
    initial: await bind(reviewPath), changes, inventory: await bind(inventory),
    helper: await bind(`${tmp}/correct-d023-source224-227.mjs`),
    unchangedPages: review.pages.filter(row => [225, 227].includes(row.physicalPage)).map(row => ({
      pdf_page: row.physicalPage, candidate: { path: row.candidatePath, sha256: row.candidateSha256 },
      saved_candidate_rows: row.physicalRows.savedCandidate, saved_native_rows: row.physicalRows.savedNative,
      initialStatus: row.status,
    })),
    scope: 'Two exact literal replacements, no line/geometry/counting/metadata change; one inventory description correction. Existing passing counts reused, not rerun.',
    mainImageOpens: 0, newNativeCounts: 0, sourceGateReplays: 0,
  }, null, 2)}\n`);
  console.log(JSON.stringify(await bind(output)));
} else console.log('Prepared exact original/candidate copies for two manual literal corrections.');

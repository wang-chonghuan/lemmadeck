import assert from 'node:assert/strict';
import path from 'node:path';
import { ticket, read, bind, verify, bytes, exists, immutableWrite } from './retain-d016-evidence.mjs';

const work = `${ticket}/tmp`;
const initial = `${work}/9p-next-source-0204-0207`;
const output = `${work}/9p-next-source-0204-0207-correction-1`;
const reviewPath = `${work}/source-review-9p-0204-0207.json`;
const reviewSha = '018cc5c7e5c4db55312a23862b0d4da3e860e2936f458af7667118b8ea7961df';
const freezeSha = '0cefcbb06e96ef22eee2c130d59cf752da54604722fefbf977664dd94c00effa';
assert.ok(!await exists(`${output}/author-correction-freeze.json`));
await verify(reviewPath, reviewSha);
await verify(`${initial}/author-freeze.json`, freezeSha);
const review = await read(reviewPath);
const freeze = await read(`${initial}/author-freeze.json`);
assert.equal(review.status, 'needs-correction');
await immutableWrite(`${output}/before/source-review.json`, await bytes(reviewPath));
await immutableWrite(`${output}/before/author-freeze.json`, await bytes(`${initial}/author-freeze.json`));
const pages = [];
for (const page of review.pages) {
  const original = `${initial}/${String(page.pdf_page).padStart(4, '0')}.page.md`;
  await verify(original, page.draft.sha256);
  await verify(page.source.path, page.source.sha256);
  const before = await bytes(original);
  const text = before.toString('utf8');
  const ending = text.indexOf('\n---\n', 4);
  assert.ok(text.startsWith('---\n') && ending > 4);
  const metadata = JSON.parse(text.slice(4, ending));
  const corrections = page.authorized_corrections;
  let after = before;
  if (corrections.length) {
    assert.ok([204, 206].includes(page.pdf_page));
    assert.equal(corrections.length, 1);
    const correction = corrections[0];
    assert.equal(correction.kind, 'counting-metadata-only');
    assert.equal(correction.bound_draft_sha256, page.draft.sha256);
    assert.equal(correction.bound_source_sha256, page.source.sha256);
    assert.deepEqual(Object.keys(correction.value).sort(), ['edge_margin_px', 'reason']);
    assert.equal(correction.value.edge_margin_px, 120);
    assert.ok(!Object.hasOwn(metadata, 'counting'));
    const oldTail = '  "errata": []\n}\n---\n';
    const newTail = `  "errata": [],\n  "counting": ${JSON.stringify(correction.value, null, 2).replaceAll('\n', '\n  ')}\n}\n---\n`;
    assert.equal(text.split(oldTail).length, 2);
    after = Buffer.from(text.replace(oldTail, newTail));
    assert.equal(after.toString('utf8').replace(newTail, oldTail), text);
    const correctedEnd = after.toString('utf8').indexOf('\n---\n', 4);
    const correctedMetadata = JSON.parse(after.toString('utf8').slice(4, correctedEnd));
    assert.deepEqual(correctedMetadata.counting, correction.value);
    delete correctedMetadata.counting;
    assert.deepEqual(correctedMetadata, metadata);
    assert.equal(after.toString('utf8').slice(correctedEnd), text.slice(ending));
  } else {
    assert.ok([205, 207].includes(page.pdf_page));
  }
  const name = path.basename(original);
  await immutableWrite(`${output}/before/${name}`, before);
  await immutableWrite(`${output}/${name}`, after);
  pages.push({
    pdf_page: page.pdf_page,
    source: page.source,
    original: await bind(original),
    before: await bind(`${output}/before/${name}`),
    corrected: await bind(`${output}/${name}`),
    authorizedCorrections: corrections,
    sourceBodyByteIdentical: true,
    metadataOnly: corrections.length > 0,
    approvedIndependentRows: page.independent_rows,
    configuredCounterProof: page.counting.configured_probe_calls ? review.configured_counter_proof : null,
  });
}
const figures = [];
for (const figure of freeze.pages.flatMap(page => page.figures)) {
  const candidate = figure.candidate_png ?? figure.candidate ?? figure.crop;
  assert.ok(candidate?.path && candidate.sha256, `Missing actual candidate binding ${figure.id}`);
  await verify(candidate.path, candidate.sha256);
  figures.push({ id: figure.id, candidate, unchanged: true });
}
await immutableWrite(`${output}/author-correction-freeze.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181',
  batch: 'D021-source-preparation',
  status: 'authorized-metadata-only-correction-independent-delta-and-crop160-review-pending',
  originalFreeze: await bind(`${initial}/author-freeze.json`),
  preservedFreeze: await bind(`${output}/before/author-freeze.json`),
  independentReview: await bind(reviewPath),
  preservedReview: await bind(`${output}/before/source-review.json`),
  helper: await bind(`${work}/prepare-source204-207-metadata-correction.mjs`),
  pages,
  figures,
  limits: 'No image opened, counter rerun, source/crop pixel change, text/row/geometry change, native finalization, SCI, promotion, DB or Git operation. Source review156-159 reused; actual160 crop remains unapproved.',
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(`${output}/author-correction-freeze.json`)));

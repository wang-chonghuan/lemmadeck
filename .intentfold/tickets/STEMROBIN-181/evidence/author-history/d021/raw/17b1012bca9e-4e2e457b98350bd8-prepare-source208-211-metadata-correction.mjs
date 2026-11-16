import assert from 'node:assert/strict';
import { ticket, read, bind, verify, bytes, exists, immutableWrite } from './retain-d016-evidence.mjs';

const work = `${ticket}/tmp`;
const initial = `${work}/9p-next-source-0208-0211`;
const output = `${work}/9p-next-source-0208-0211-correction-1`;
const reviewPath = `${work}/source-review-9p-0208-0211.json`;
const reviewSha = '32b9fda4bbf03ce5ec5ceb726aad839a8feeddc0a1a2fff31ecbd9be3f6d8a3a';
const freezeSha = '242f28dd4e675c1a6abbfcbdc6c091bd46f58b2f7e38a59f7e29d80f3ce56f47';
assert.ok(!await exists(`${output}/author-correction-freeze.json`));
await verify(reviewPath, reviewSha);
await verify(`${initial}/author-freeze.json`, freezeSha);
const review = await read(reviewPath);
const freeze = await read(`${initial}/author-freeze.json`);
assert.equal(review.status, 'needs-correction');
assert.deepEqual(review.required_corrections.map(item => item.pdf_page), [208, 210]);
await immutableWrite(`${output}/before/source-review.json`, await bytes(reviewPath));
await immutableWrite(`${output}/before/author-freeze.json`, await bytes(`${initial}/author-freeze.json`));
const pages = [];
for (const page of review.pages) {
  const name = `${String(page.pdf_page).padStart(4, '0')}.page.md`;
  const original = `${initial}/${name}`;
  await verify(original, page.draft.sha256);
  await verify(page.source.path, page.source.sha256);
  const before = await bytes(original);
  const text = before.toString('utf8');
  const ending = text.indexOf('\n---\n', 4);
  assert.ok(text.startsWith('---\n') && ending > 4);
  const metadata = JSON.parse(text.slice(4, ending));
  const correction = review.required_corrections.find(item => item.pdf_page === page.pdf_page);
  let after = before;
  if (correction) {
    assert.equal(correction.kind, 'frontmatter-counting-metadata-only');
    assert.equal(correction.bound_draft_sha256, page.draft.sha256);
    assert.deepEqual(Object.keys(correction.authorized_metadata), ['counting']);
    const counting = correction.authorized_metadata.counting;
    assert.deepEqual(Object.keys(counting).sort(), ['edge_margin_px', 'reason']);
    assert.equal(counting.edge_margin_px, 90);
    assert.ok(!Object.hasOwn(metadata, 'counting'));
    const oldTail = '  "errata": []\n}\n---\n';
    const newTail = `  "errata": [],\n  "counting": ${JSON.stringify(counting, null, 2).replaceAll('\n', '\n  ')}\n}\n---\n`;
    assert.equal(text.split(oldTail).length, 2);
    after = Buffer.from(text.replace(oldTail, newTail));
    assert.equal(after.toString('utf8').replace(newTail, oldTail), text);
    const correctedEnd = after.toString('utf8').indexOf('\n---\n', 4);
    const correctedMetadata = JSON.parse(after.toString('utf8').slice(4, correctedEnd));
    assert.deepEqual(correctedMetadata.counting, counting);
    delete correctedMetadata.counting;
    assert.deepEqual(correctedMetadata, metadata);
    assert.equal(after.toString('utf8').slice(correctedEnd), text.slice(ending));
  }
  await immutableWrite(`${output}/before/${name}`, before);
  await immutableWrite(`${output}/${name}`, after);
  pages.push({
    pdf_page: page.pdf_page,
    source: page.source,
    original: await bind(original),
    before: await bind(`${output}/before/${name}`),
    corrected: await bind(`${output}/${name}`),
    authorizedCorrection: correction ?? null,
    sourceBodyByteIdentical: true,
    approvedIndependentRows: page.independent_printed_rows_including_footer,
  });
}
const figures = [];
for (const figure of freeze.pages.flatMap(page => page.figures)) {
  await verify(figure.candidate.path, figure.candidate.sha256);
  figures.push({ id: figure.id, candidate: figure.candidate, unchanged: true });
}
await immutableWrite(`${output}/author-correction-freeze.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181',
  batch: 'D021-source-preparation',
  status: 'authorized-metadata-only-correction-independent-delta-review-pending',
  originalFreeze: await bind(`${initial}/author-freeze.json`),
  preservedFreeze: await bind(`${output}/before/author-freeze.json`),
  independentReview: await bind(reviewPath),
  preservedReview: await bind(`${output}/before/source-review.json`),
  helper: await bind(`${work}/prepare-source208-211-metadata-correction.mjs`),
  pages,
  figures,
  configuredCounterProof: review.configured_counter_proof,
  limits: 'No image, counter rerun, source/crop pixel change, text/row/geometry change, native finalization, SCI, promotion, DB or Git. Existing independent SOURCE and crop approvals reused.',
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(`${output}/author-correction-freeze.json`)));

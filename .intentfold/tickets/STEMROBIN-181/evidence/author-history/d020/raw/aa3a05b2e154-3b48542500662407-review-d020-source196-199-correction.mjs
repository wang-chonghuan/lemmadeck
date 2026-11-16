import assert from 'node:assert/strict';
import { ticket, read, bind, verify, bytes, exists, immutableWrite } from './retain-d016-evidence.mjs';

const work = `${ticket}/tmp`;
const initialPath = `${work}/source-review-9p-0196-0199.json`;
const freezePath = `${work}/9p-next-source-0196-0199-correction-1/author-correction-freeze.json`;
const output = `${work}/source-review-9p-0196-0199-correction.json`;
assert.ok(!await exists(output));
await verify(initialPath, 'bbb48baf6a54d10f570c317646eba1fbe0ef6a06ddf3c2ae5fa976c362b7196d');
await verify(freezePath, '729622e3ee97f8721908898eace7bedd7f2a42903916208906f6ba59482c5e6f');
const initial = await read(initialPath);
const freeze = await read(freezePath);
const verified = new Set();
async function consume(value) {
  if (!value || typeof value !== 'object') return;
  if (value.path && value.sha256) {
    const key = `${value.path}:${value.sha256}`;
    if (!verified.has(key)) {
      await verify(value.path, value.sha256);
      verified.add(key);
    }
    return;
  }
  for (const child of Object.values(value)) await consume(child);
}
await consume(freeze);
const parse = data => {
  const text = data.toString('utf8');
  const match = /^---\n([\s\S]*?)\n---\n/.exec(text);
  assert.ok(match);
  return { meta: JSON.parse(match[1]), body: text.slice(match[0].length) };
};
const pages = [];
for (const page of freeze.pages) {
  const approved = initial.pages.find(item => item.pdf_page === page.pdf_page);
  assert.ok(approved);
  assert.deepEqual(page.initial_draft, approved.draft);
  const beforeBytes = await bytes(page.before.path);
  const afterBytes = await bytes(page.after.path);
  const before = parse(beforeBytes);
  const after = parse(afterBytes);
  const corrections = approved.authorized_corrections;
  const reversedMeta = structuredClone(after.meta);
  let reversedBody = after.body;
  if (corrections.length) {
    const expected = approved.rows.single_independent_configured_probe.configuration;
    assert.deepEqual(reversedMeta.counting, expected);
    assert.equal(Object.hasOwn(before.meta, 'counting'), false);
    delete reversedMeta.counting;
  }
  if (page.pdf_page === 196) {
    assert.deepEqual(corrections.map(item => item.id), ['p0196-counting', 'p0196-dotted-emphasis']);
    const marked = corrections[1].corrected_block_lines.join('\n');
    const unmarked = marked.replaceAll('**', '');
    assert.equal(reversedBody.split(marked).length, 2);
    assert.equal(before.body.split(unmarked).length, 2);
    reversedBody = reversedBody.replace(marked, unmarked);
  }
  assert.deepEqual(reversedMeta, before.meta);
  assert.equal(reversedBody, before.body);
  const restored = `---\n${JSON.stringify(reversedMeta, null, 2)}\n---\n${reversedBody}`;
  assert.deepEqual(Buffer.from(restored), beforeBytes, 'Reverse must restore all original bytes');
  if (page.pdf_page === 197) assert.deepEqual(afterBytes, beforeBytes);
  pages.push({
    pdf_page: page.pdf_page, status: 'pass', draft: page.after,
    independent_rows: approved.rows.independently_visible_including_footer,
    authorizedFindingIds: corrections.map(item => item.id),
    metadataExact: true, reverseEntireFileByteIdentical: true,
    originalWordsMathFlagsBoxesRowBreaksAndOtherMetadataInherited: true,
    newCounterOrImageReview: false,
  });
}
assert.deepEqual(pages.map(page => page.pdf_page), [196, 197, 198, 199]);
assert.ok(initial.figures.every(figure => figure.status === 'pass'));
for (const figure of initial.figures) await consume(figure.candidate);
await immutableWrite(output, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D020', status: 'pass',
  role: 'Main independent of Cicero correction author',
  reviewRound: 'unique-affected-only-correction-review',
  initialIndependentReview: await bind(initialPath), correctionAuthorFreeze: await bind(freezePath),
  pages, inheritedFigures: initial.figures.map(figure => ({
    id: figure.id, status: 'pass', candidate: figure.candidate,
    existingIndependentPixelsInherited: true, reopened: false,
  })),
  imagesLoaded: 0, nativeCounterCalls: 0,
  initialConfiguredCounterProbesInherited: [196, 198, 199],
  statusOf197FullSourceGate: 'pass-inherited-byte-identical',
  checkedBindings: verified.size, findings: [],
  preservesBlocked193And195AndUnfinalized194: true,
  readyForNativePageFinalization: true,
  limits: 'Literal metadata and strong-marker reversal only. No interpretation, source/candidate edit, full-source recheck, native counter rerun, finalize, assembly, SCI, browser, DB or Git.',
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(output)));

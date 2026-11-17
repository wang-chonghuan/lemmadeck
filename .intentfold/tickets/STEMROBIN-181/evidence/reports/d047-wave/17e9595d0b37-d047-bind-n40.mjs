import assert from 'node:assert/strict';
import {
  ticket, read, bytes, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const folder = `${ticket}/tmp/d046-wave-bindings`;
const manifestPath = `${folder}/n40.json`;
assert.equal(await exists(manifestPath), false);
const affectedPath = `${ticket}/tmp/d045-n40-affected-review.json`;
const generatedPath = `${ticket}/tmp/d046-fig64-independent-review.json`;
const deterministicPath = `${ticket}/tmp/d046-fig737475-independent-review.json`;
await verify(affectedPath, '475d71e4fcb72e6f0c3cd7b3e60030c36c8a1ad062e24d350994909f25995500');
await verify(generatedPath, '2a869319c6e921ed300fe7527cdcf316e3ff47075c1a138e855ce69d43e226bf');
await verify(deterministicPath, '1e820aa3fc9ecc44c891db65239ce3e90a0e745b1a360c85788e3cc9b547739b');
const affected = await read(affectedPath);
assert.equal(affected.status, 'AFFECTED-PASS');
assert.equal(affected.affectedZHEN, 'PASS');
assert.equal(affected.inherited.originalSCI, 'PASS');
assert.equal(affected.inherited.unaffectedZHEN, 'PASS');
assert.deepEqual(affected.defects, []);
for (const file of [generatedPath, deterministicPath])
  assert.equal((await read(file)).status, 'PASS');
const generated = `${ticket}/tmp/d045-10p-fig64-author`;
const deterministic = `${ticket}/tmp/d045-10p-fig737475-author`;
await verify(`${generated}/author-freeze.json`,
  'ad92bb174ccaf934e400a66a9479413570f8e6a70d6f54224463cd4d6aeaab67');
await verify(`${deterministic}/author-freeze.json`,
  '970d931673c995c89677e46bed4847bbb73aa176ee6da73bbb4bd46dc85ae506');
const definitions = [
  [64, 'generated', `${generated}/candidate`,
    `${ticket}/tmp/d046-fig64-independent-review-evidence`, generatedPath],
  ...[73, 74, 75].map(number => [number, 'deterministic',
    `${deterministic}/fig-${number}/final`,
    `${ticket}/tmp/d046-fig737475-independent-review-evidence`, deterministicPath]),
];
const figures = [];
for (const [number, mode, candidate, gateFolder, reportPath] of definitions) {
  const id = `fig-${number}`;
  const specPath = `${candidate}/${id}.spec.json`;
  const evidencePath = `${candidate}/${id}.${mode === 'generated' ? 'png' : 'render'}.json`;
  const outputPath = `${candidate}/${id}.${mode === 'generated' ? 'png' : 'svg'}`;
  const reviewPath = `${gateFolder}/${id}.review.json`;
  const spec = await read(specPath);
  const gate = await read(reviewPath);
  assert.equal(spec.id, id);
  assert.equal(spec.mode, mode);
  assert.equal(gate.status, 'pass');
  assert.equal(gate.figure, id);
  assert.equal(gate.spec.sha256, (await bind(specPath)).sha256);
  assert.equal(gate[mode === 'generated' ? 'generation' : 'render'].sha256,
    (await bind(evidencePath)).sha256);
  assert.equal(gate.outputs[mode === 'generated' ? 'png' : 'svg'].sha256,
    (await bind(outputPath)).sha256);
  if (mode === 'deterministic') assert.equal((await read(evidencePath)).status, 'pass');
  await verify(spec.source.image.path, spec.source.image.sha256);
  const files = [];
  for (const [name, source] of [
    [`${id}.spec.json`, specPath], [`${id}.${mode === 'generated' ? 'png' : 'svg'}`, outputPath],
    [`${id}.${mode === 'generated' ? 'generation' : 'render'}.json`, evidencePath],
    [`${id}.review.json`, reviewPath],
  ]) {
    const destination = `${folder}/figures/${name}`;
    await immutableWrite(destination, await bytes(source));
    files.push({ name, ...(await bind(destination)), original: await bind(source) });
  }
  figures.push({
    id, mode, files, independentReview: await bind(reportPath),
    source: spec.source.image, geometryAndOutputUnchanged: true,
  });
}
await immutableWrite(manifestPath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card: 'phy10-c1-s5-n40',
  status: 'PASS-independent-figures-and-text', SCI: 'PASS', ZHEN: 'PASS',
  reports: await Promise.all([affectedPath, generatedPath, deterministicPath,
    `${ticket}/tmp/d044-localized-reference-checks/resolution.json`].map(bind)),
  figures,
  evidenceFolders: [generated, deterministic,
    `${ticket}/tmp/d046-fig64-independent-review-evidence`,
    `${ticket}/tmp/d046-fig737475-independent-review-evidence`],
  existingApprovalsConsumed: true, nativeRerenders: 0, imagesOpened: 0,
  canonicalPromotion: false, cardComplete: false,
}, null, 2)}\n`);
console.log(JSON.stringify({ manifest: await bind(manifestPath) }));

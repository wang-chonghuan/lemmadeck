import assert from 'node:assert/strict';
import {
  ticket, read, bytes, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const folder = `${ticket}/tmp/d046-wave-bindings`;
const manifestPath = `${folder}/n44.json`;
const author = `${ticket}/tmp/d045-10p-fig83-author`;
const candidate = `${author}/frozen`;
const affectedPath = `${ticket}/tmp/d047-n44-affected-review.json`;
const independentPath = `${ticket}/tmp/d047-fig83-independent-review.json`;
const reviewPath = `${ticket}/tmp/d047-fig83-independent-review-evidence/fig-83.review.json`;
assert.equal(await exists(manifestPath), false);
await verify(`${author}/author-freeze.json`,
  '4b7a5546aca31c6720b8db16a2be319d1910040c7b1be2caa2a79583dbe6202c');
await verify(affectedPath, 'cd3a778c7bfbdf650dd654e92efe5713feb837174434035f3d0cc22373e220c2');
await verify(independentPath, 'c2f7c821f0248d1595ae540b91ccf7899465930a84376d4d58b581a88c823e94');
await verify(reviewPath, '68f73d85b503ef683faf9d90a53daef9f0a232c8bdf1f152cbb4ca4fed93e8d7');
const affected = await read(affectedPath);
assert.equal(affected.status, 'affectedPASS');
assert.equal(affected.effectiveSCI.status, 'PASS');
assert.equal(affected.effectiveZHEN.status, 'PASS');
const specPath = `${candidate}/fig-83.spec.json`;
const renderPath = `${candidate}/fig-83.render.json`;
const spec = await read(specPath);
const render = await read(renderPath);
const review = await read(reviewPath);
assert.equal(spec.mode, 'hybrid');
assert.equal(render.status, 'pass');
assert.equal(review.status, 'pass');
assert.equal(review.spec.sha256, (await bind(specPath)).sha256);
assert.equal(review.render.sha256, (await bind(renderPath)).sha256);
await verify(spec.source.image.path, spec.source.image.sha256);
const files = [];
const paths = [
  ['fig-83.spec.json', specPath], ['fig-83.render.json', renderPath],
  ['fig-83.svg', `${candidate}/fig-83.svg`],
  ['fig-83.artwork.png', `${candidate}/fig-83.artwork.png`],
  ['fig-83.review.json', reviewPath],
];
for (const asset of spec.assets) {
  paths.push([`fig-83.${asset.id}.png`, asset.path],
    [`fig-83.${asset.id}.generation.json`, asset.metadata]);
}
for (const [name, source] of paths) {
  const destination = `${folder}/figures/${name}`;
  await immutableWrite(destination, await bytes(source));
  files.push({ name, ...await bind(destination), original: await bind(source) });
}
for (const [kind, suffix] of [['svg', 'svg'], ['artwork', 'artwork.png']])
  assert.equal(review.outputs[kind].sha256, (await bind(`${candidate}/fig-83.${suffix}`)).sha256);
await immutableWrite(manifestPath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card: 'phy10-c1-s5-n44',
  status: 'PASS-independent-figures-and-text', SCI: 'PASS', ZHEN: 'PASS',
  reports: await Promise.all([affectedPath, independentPath,
    `${ticket}/tmp/d046-n44-text-repair/repair-freeze.json`].map(bind)),
  figures: [{
    id: 'fig-83', mode: 'hybrid', files, independentReview: await bind(independentPath),
    source: spec.source.image, geometryAndOutputUnchanged: true,
  }],
  evidenceFolders: [author, `${ticket}/tmp/d047-fig83-independent-review-evidence`,
    `${ticket}/tmp/d046-n44-text-repair`, `${ticket}/tmp/d047-n44-affected-review-evidence`],
  existingApprovalsConsumed: true, nativeRerenders: 0, imagesOpened: 0,
  canonicalPromotion: false, cardComplete: false,
}, null, 2)}\n`);
console.log(JSON.stringify({ manifest: await bind(manifestPath) }));

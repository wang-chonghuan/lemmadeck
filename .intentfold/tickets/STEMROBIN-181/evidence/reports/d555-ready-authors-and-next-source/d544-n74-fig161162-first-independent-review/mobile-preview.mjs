import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const own = path.dirname(fileURLToPath(import.meta.url));
const author = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d533-n74-first-modern-figure-author');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bound = [
  ['READY.json', '3c03a682e55276ae4ae3a6a4122ea0fc0d99c54902b4cf80e7bbe21c0e206c7d'],
  ['author-freeze.json', '39ed97b932909080385f928962bdf793aa5daafef510e46888599ecc7fc77c8e'],
  ['report.json', '315b62236120279e3027dc7c1d28c4c8c4f7455e7198fb0957b0e101ead7d067']
];
for (const [name, expected] of bound) {
  assert.equal(hash(fs.readFileSync(path.join(author, name))), expected, name);
}
const freeze = JSON.parse(fs.readFileSync(path.join(author, 'author-freeze.json')));
const require = createRequire(path.join(root, '.claude/skills/ld-s10y-lesson/package.json'));
const { Resvg } = require('@resvg/resvg-js');
const metadata = {
  schema: 'd544/frozen-svg-mobile-preview@1',
  generatedAt: new Date().toISOString(),
  command: 'node .intentfold/tickets/STEMROBIN-181/tmp/d544-n74-fig161162-first-independent-review/mobile-preview.mjs',
  script: { path: fileURLToPath(import.meta.url), sha256: hash(fs.readFileSync(fileURLToPath(import.meta.url))) },
  renderer: {
    name: '@resvg/resvg-js',
    version: require('@resvg/resvg-js/package.json').version,
    modulePath: require.resolve('@resvg/resvg-js')
  },
  options: { fitTo: { mode: 'width', value: 342 }, background: '#ffffff' },
  inputHandling: 'Exact frozen SVG bytes passed to Resvg; no CSS substitution, SVG edit, spec rendering, validator, or browser.',
  firstMobileGenerationInThisReview: true,
  actualAppDisplay: false,
  figures: []
};
const metadataPath = path.join(own, 'mobile-preview-generation.json');
assert.equal(fs.existsSync(metadataPath), false, 'do not overwrite prior preview evidence');
for (const figure of ['fig-161', 'fig-162']) {
  const relative = `candidates/${figure}/repair1/figure.svg`;
  const inputPath = path.join(author, relative);
  const entry = freeze.files.find(item => item.path === relative);
  assert.ok(entry);
  const bytes = fs.readFileSync(inputPath);
  assert.equal(hash(bytes), entry.sha256, figure);
  assert.equal(fs.statSync(inputPath).mode & 0o777, 0o444);
  const outputPath = path.join(own, `${figure}.mobile-342.png`);
  assert.equal(fs.existsSync(outputPath), false, 'one generation only');
  const png = Buffer.from(new Resvg(bytes, metadata.options).render().asPng());
  assert.equal(png.readUInt32BE(16), 342);
  assert.equal(png.readUInt32BE(20), 342);
  fs.writeFileSync(outputPath, png, { flag: 'wx' });
  assert.equal(hash(fs.readFileSync(inputPath)), entry.sha256, 'source unchanged');
  metadata.figures.push({
    figure,
    input: { path: inputPath, sha256: entry.sha256 },
    output: { path: outputPath, sha256: hash(png), bytes: png.length, width: 342, height: 342 },
    inputUnchangedAfterGeneration: true
  });
}
fs.writeFileSync(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify(metadata, null, 2));

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { Resvg } = require('../../../../../../.claude/skills/ld-s10y-lesson/node_modules/@resvg/resvg-js');

const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
if (process.cwd() !== root) throw new Error('Wrong cwd');
const own = path.relative(root, __dirname);
const seedPath = '.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-choice-author/seed.json';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const seedBytes = fs.readFileSync(seedPath);
const seed = JSON.parse(seedBytes);
if (seed.exercises.map(item => item.number).join(',') !== '746,747,748,749,750,751,752,753') {
  throw new Error('Unexpected source selection');
}
if (seed.figures.map(item => item.id).join(',') !== 'fig-52,fig-53') {
  throw new Error('Unexpected image selection');
}
const trace = seed.trace.map(item => {
  const actual = hash(fs.readFileSync(item.path));
  if (actual !== item.sha256) throw new Error(`Source hash changed: ${item.path}`);
  return { ...item, actual_sha256: actual };
});
const images = seed.figures.map(figure => {
  if (figure.assets.length !== 1) throw new Error('Unexpected asset count');
  const asset = figure.assets[0];
  const bytes = fs.readFileSync(asset.path);
  const assetHash = hash(bytes);
  if (assetHash !== asset.sha256) throw new Error(`Image hash changed: ${figure.id}`);
  const rendered = new Resvg(bytes, {
    fitTo: { mode: 'width', value: 640 },
    background: '#ffffff',
  }).render();
  const png = rendered.asPng();
  const pngPath = `${own}/${figure.id}.full-640.png`;
  fs.writeFileSync(pngPath, png, { flag: 'wx' });
  return {
    figure_id: figure.id,
    asset_path: asset.path,
    asset_sha256: assetHash,
    converted_image_path: pngPath,
    converted_image_sha256: hash(png),
    width_px: rendered.width,
    height_px: rendered.height,
    full_image: true,
    crops: 0,
    opens_before_receipt: 0,
  };
});
const receipt = {
  stage: 'SOURCE-FIRST PRE-OPEN',
  recorded_at: new Date().toISOString(),
  cwd: root,
  seed_path: seedPath,
  seed_file_sha256: hash(seedBytes),
  seed_canonical_sha256: '2379eaac29b0f067ffc5469a178c69e92fb2d4dab09b140e44eb728f362a6c73',
  source_numbers: seed.exercises.map(item => item.number),
  concept_blocks: seed.concepts.map(item => item.block),
  trace,
  converter: '.claude/skills/ld-s10y-lesson/node_modules/@resvg/resvg-js',
  images,
  author_draft_reads: 0,
  author_internal_reads: 0,
  answer_file_reads: 0,
};
const receiptPath = `${own}/source-preopen.json`;
fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx' });
fs.chmodSync(receiptPath, 0o444);
console.log(JSON.stringify(receipt, null, 2));

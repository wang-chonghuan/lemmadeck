const fs = require('node:fs');
const crypto = require('node:crypto');

const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
if (process.cwd() !== root) throw new Error('Wrong cwd');
const own = '.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-choice-review-FIRST';
const source = '.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const seed = JSON.parse(fs.readFileSync('.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-choice-author/seed.json', 'utf8'));
const images = seed.figures.map(figure => {
  const asset = figure.assets[0];
  const durable = fs.readFileSync(asset.path);
  const siblingPath = `${source}/${figure.id}/${figure.id}.svg`;
  const sibling = fs.readFileSync(siblingPath);
  if (!durable.equals(sibling) || hash(durable) !== asset.sha256) {
    throw new Error(`SVG binding mismatch: ${figure.id}`);
  }
  const previewPath = `${source}/${figure.id}/complete-preview.png`;
  const png = fs.readFileSync(previewPath);
  if (!png.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    throw new Error('Not a PNG');
  }
  return {
    figure_id: figure.id,
    asset_path: asset.path,
    asset_sha256: hash(durable),
    preview_source_svg_path: siblingPath,
    preview_source_svg_sha256: hash(sibling),
    svg_byte_equal_to_seed_asset: true,
    preview_path: previewPath,
    preview_sha256: hash(png),
    width_px: png.readUInt32BE(16),
    height_px: png.readUInt32BE(20),
    preview_opens_before_receipt: 0,
  };
});
const receipt = {
  stage: 'AUTHORIZED SOURCE VISUAL RECOVERY PRE-OPEN',
  recorded_at: new Date().toISOString(),
  cwd: root,
  seed_sha256: '2379eaac29b0f067ffc5469a178c69e92fb2d4dab09b140e44eb728f362a6c73',
  original_hold_preserved: true,
  original_image_loads: 2,
  authorized_additional_image_loads: 2,
  projected_total_image_loads: 4,
  draft_reads: 0,
  images,
};
const output = `${own}/recovery-preopen.json`;
fs.writeFileSync(output, `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx' });
fs.chmodSync(output, 0o444);
console.log(JSON.stringify(receipt, null, 2));

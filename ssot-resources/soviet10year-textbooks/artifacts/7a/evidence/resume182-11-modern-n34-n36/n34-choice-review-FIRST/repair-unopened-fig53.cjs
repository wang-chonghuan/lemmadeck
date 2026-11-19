const fs = require('node:fs');
const crypto = require('node:crypto');
const { Resvg } = require('../../../../../../.claude/skills/ld-s10y-lesson/node_modules/@resvg/resvg-js');

const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
if (process.cwd() !== root) throw new Error('Wrong cwd');
const own = '.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-choice-review-FIRST';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const assetPath = 'ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/figures/fig-53.svg';
const bytes = fs.readFileSync(assetPath);
const expected = '0837b07d3cc374b0ea8d1f906f57464775f9e9b780ddec669b58a4a9a18a9d16';
if (hash(bytes) !== expected) throw new Error('Source image changed');
// resvg does not resolve CSS variables; use only each declared color fallback.
const svg = bytes.toString('utf8').replace(/var\(--ld-figure-[a-zA-Z]+,\s*(#[a-fA-F0-9]{6})\)/g, '$1');
if (svg.includes('var(')) throw new Error('Unresolved CSS variable');
const rendered = new Resvg(svg, {
  fitTo: { mode: 'width', value: 640 },
  background: '#ffffff',
}).render();
const png = rendered.asPng();
const pngPath = `${own}/fig-53.full-640.fallback.png`;
fs.writeFileSync(pngPath, png, { flag: 'wx' });
const receipt = {
  stage: 'SOURCE-FIRST FIG53 PRE-OPEN TECHNICAL RECOVERY',
  recorded_at: new Date().toISOString(),
  asset_path: assetPath,
  asset_sha256: hash(bytes),
  converted_image_path: pngPath,
  converted_image_sha256: hash(png),
  width_px: rendered.width,
  height_px: rendered.height,
  method: 'Existing resvg; declared CSS color fallbacks only; unchanged geometry, text, aspect ratio, and full canvas',
  fig53_previous_opens: 0,
  images_already_opened: 1,
  fig52_reopens: 0,
  draft_reads: 0,
};
const receiptPath = `${own}/fig53-preopen-recovery.json`;
fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx' });
fs.chmodSync(receiptPath, 0o444);
console.log(JSON.stringify(receipt, null, 2));

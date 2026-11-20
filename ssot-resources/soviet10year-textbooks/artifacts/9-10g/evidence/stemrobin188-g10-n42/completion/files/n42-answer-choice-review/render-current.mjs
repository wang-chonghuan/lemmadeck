import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const root = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
if (process.cwd() !== root) throw new Error('Unexpected cwd');
const out = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n42-answer-choice-review');
const require = createRequire(path.join(root, '.claude/skills/ld-s10y-lesson/package.json'));
const { Resvg } = require('@resvg/resvg-js');
const source = JSON.parse(fs.readFileSync(path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n42-review-inputs/source-only.json')));
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const receipts = [];
for (const image of source.imageInputs) {
  const bytes = fs.readFileSync(image.modern);
  if (hash(bytes) !== image.modernSha256) throw new Error(`Changed SVG: ${image.id}`);
  // Resolve existing semantic-color fallbacks in memory for resvg, not on disk.
  const text = bytes.toString('utf8').replace(/var\(--[^,()]+,\s*([^()]+)\)/g, '$1');
  const png = new Resvg(text, {
    fitTo: { mode: 'width', value: 480 },
    background: '#ffffff',
    font: { loadSystemFonts: true },
  }).render().asPng();
  const output = path.join(out, `${image.id}-current-480.png`);
  fs.writeFileSync(output, png, { flag: 'wx' });
  receipts.push({
    id: image.id,
    input: image.modern,
    svg_sha256: hash(bytes),
    output,
    png_sha256: hash(png),
    width: png.readUInt32BE(16),
    height: png.readUInt32BE(20),
    method: 'Installed resvg; complete current SVG viewBox; fallback CSS colors resolved only in memory; no FigureSpec renderer.',
  });
}
fs.writeFileSync(path.join(out, 'render-receipt.json'), JSON.stringify(receipts, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify(receipts, null, 2));

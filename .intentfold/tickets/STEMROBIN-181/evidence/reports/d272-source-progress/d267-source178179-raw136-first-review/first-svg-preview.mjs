import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const out = path.dirname(fileURLToPath(import.meta.url));
const source = path.resolve(out, '../d260-source178179-first-author/work/10p/pages/0178/figures/fig-136.svg');
const dependency = path.resolve('.claude/skills/ld-s10y-lesson/node_modules/@resvg/resvg-js');
const { Resvg } = require(dependency);
const destination = path.join(out, 'raw136-current-svg-first-preview.png');
if (fs.existsSync(destination)) throw new Error('Refusing a second SVG preview');
const bytes = fs.readFileSync(source);
const inputHash = crypto.createHash('sha256').update(bytes).digest('hex');
if (inputHash !== 'c2dd0b0e245bc5c569edd4c4855d71d2220efd1a09fe6a396be4eafa1a6d44f8') throw new Error('Stale SVG');
const rendered = new Resvg(bytes, { background: '#ffffff' }).render();
const png = rendered.asPng();
fs.writeFileSync(destination, png, { flag: 'wx' });
const receipt = {
  schema: 'd267-first-current-svg-preview@1', date: '2026-11-18', exitCode: 0,
  engine: 'Existing @resvg/resvg-js', dependency,
  input: { path: source, sha256: inputHash },
  output: { path: destination, sha256: crypto.createHash('sha256').update(png).digest('hex'), width: rendered.width, height: rendered.height },
  svgPreviewInvocations: 1, vectorizeInvocations: 0, finalizeInvocations: 0,
  authorSVGModified: false, imageOpens: 0,
};
fs.writeFileSync(path.join(out, 'svg-preview-receipt.json'), JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify(receipt));

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const here = dirname(fileURLToPath(import.meta.url));
const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const require = createRequire(import.meta.url);
const { Resvg } = require(join(repo, '.claude/skills/ld-s10y-lesson/node_modules/@resvg/resvg-js'));
const author = join(here, '../d160-source168-author');
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const bind = path => {
  const bytes = readFileSync(path);
  return { path, sha256: sha256(bytes), bytes: bytes.length };
};
const request = JSON.parse(readFileSync(join(here, 'request.json'), 'utf8'));
const boundInputs = [
  bind(join(repo, request.sourcePage.path)),
  bind(join(repo, request.transcription.path)),
  bind(join(author, 'source/10p/pages/0168/page.json')),
  bind(join(author, 'source/10p/pages/0168/audit.json')),
  bind(join(author, 'receipts/finalize-0168-initial/receipt.json')),
  bind(join(author, 'receipts/finalize-0168-initial/stdout.txt')),
];
assert.equal(boundInputs[0].sha256, request.sourcePage.sha256);
assert.equal(boundInputs[1].sha256, request.transcription.sha256);
const renders = [];
for (const id of request.rawFigures) {
  const png = bind(join(author, `work/10p/pages/0168/figures/${id}.png`));
  const svg = bind(join(author, `work/10p/pages/0168/figures/${id}.svg`));
  boundInputs.push(png, svg);
  const options = { fitTo: { mode: 'original' }, background: 'white', font: { loadSystemFonts: false } };
  const raster = new Resvg(readFileSync(svg.path), options).render();
  const path = join(here, `${id}.svg-render.png`);
  assert(!existsSync(path), 'Do not overwrite existing evidence');
  writeFileSync(path, raster.asPng(), { flag: 'wx' });
  renders.push({
    id,
    originalPng: png,
    sourceSvg: svg,
    renderedPng: bind(path),
    dimensions: [raster.width, raster.height],
    renderer: '@resvg/resvg-js',
    options,
    imageOpened: false,
  });
}
const output = join(here, 'render-evidence.json');
assert(!existsSync(output), 'Do not overwrite existing receipt');
writeFileSync(output, JSON.stringify({
  status: 'rendered-not-yet-opened',
  boundInputs,
  renders,
  note: 'Rasterization and hashes do not constitute visual SOURCE or RAW approval.',
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ status: 'rendered-not-yet-opened', boundInputs, renders }, null, 2));

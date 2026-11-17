import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from '/Users/yong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/dist/index.cjs';

const own = path.dirname(fileURLToPath(import.meta.url));
for (const language of ['en', 'zh']) {
  const binding = JSON.parse(fs.readFileSync(
    path.join(own, language, 'fig-70-render-binding.json'), 'utf8'));
  const target = path.join(own, language, 'fig-70.on-white.full.png');
  if (fs.existsSync(target)) throw new Error('Inspection rendering already exists');
  await sharp(fs.readFileSync(binding.source_svg))
    .flatten({ background: '#ffffff' }).png().toFile(target);
  fs.writeFileSync(path.join(own, language, 'fig-70-white-render-binding.json'),
    JSON.stringify({
      source_svg: binding.source_svg,
      source_sha256: binding.source_sha256,
      inspection_png: target,
      inspection_sha256: crypto.createHash('sha256').update(fs.readFileSync(target)).digest('hex'),
      width: binding.width, height: binding.height,
      transform: 'Full intrinsic SVG rasterization composited on white paper. No crop, resize, label changes, or new figure.',
    }, null, 2) + '\n', { flag: 'wx' });
}

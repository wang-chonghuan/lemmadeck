import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import sharp from '/Users/yong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/dist/index.cjs';

const own = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(own, '../../../../..');
const selection = JSON.parse(fs.readFileSync(path.join(own, 'selection.json'), 'utf8'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const write = (target, value) =>
  fs.writeFileSync(target, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });

for (const language of ['en', 'zh']) {
  const projection = path.join(own, language, 'repo');
  const candidates = JSON.parse(fs.readFileSync(
    path.join(own, language, 'n38-definition-candidates.json'), 'utf8'));
  const definitions = selection.n38_concept_blocks.map(index => {
    const block = candidates.concept_candidates.find(item => item.block === index);
    if (!block) throw new Error(`Missing n38 definition ${index}`);
    return block;
  });
  write(path.join(own, language, 'n38-context.json'), {
    schema: 'offline-bound-concept-context-v1',
    source: candidates.source,
    source_sha256: candidates.source_sha256,
    source_lesson: candidates.lesson,
    language,
    concepts: definitions,
    bindings: selection.n38_bindings,
    provenance_note: 'Separate concept context only. All six seed exercises remain n39 source problems; this context is outside the native seed/draft schema.',
  });
  const seed = path.join(projection, '.tmp/choice/seed.json');
  const args = [path.join(repo, '.agents/skills/ld-s10y-choice/scripts/prepare.py'),
    'prepare', '--repo', projection, '--book', '10p', '--lesson', selection.source_lesson,
    ...selection.selected_exercises.flatMap(number => ['--exercise', number]),
    ...selection.n39_concept_blocks.flatMap(block => ['--concept-block', String(block)]),
    '--out', seed];
  const result = spawnSync('python3', args, {
    encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  write(path.join(own, language, 'prepare-result.json'), {
    command: ['env', 'PYTHONDONTWRITEBYTECODE=1', 'python3', ...args],
    exit_code: result.status, stdout: result.stdout, stderr: result.stderr,
  });
  if (result.status !== 0) throw new Error(result.stderr);
  const svg = path.join(projection,
    'ssot-resources/soviet10year-textbooks/artifacts/10p/editions/modern-us-neutral/figures/fig-70.svg');
  const png = path.join(own, language, 'fig-70.full.png');
  if (fs.existsSync(png)) throw new Error(`Existing rendering: ${png}`);
  const svgBytes = fs.readFileSync(svg);
  const metadata = await sharp(svgBytes).metadata();
  await sharp(svgBytes).png().toFile(png);
  write(path.join(own, language, 'fig-70-render-binding.json'), {
    source_svg: svg, source_sha256: hash(svgBytes),
    inspection_png: png, inspection_sha256: hash(fs.readFileSync(png)),
    width: metadata.width, height: metadata.height,
    transform: 'Full intrinsic SVG rasterization; no resizing, cropping, or authored diagram changes.',
  });
  console.log(`${language}: ${result.stdout.trim()}`);
  console.log(`${language}: full figure raster ${metadata.width}x${metadata.height}`);
}

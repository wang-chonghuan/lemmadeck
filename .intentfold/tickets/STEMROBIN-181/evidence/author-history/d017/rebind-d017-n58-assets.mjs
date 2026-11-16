import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const root = 'ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral';
const id = 'tbl-p0146-01';
const specFile = `${root}/figures/${id}.spec.json`;
const reviewFile = `${root}/figures/${id}.review.json`;
const independentFile = `${root}/figures/${id}.independent-review.json`;
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = async path => ({ path, sha256: hash(await fs.readFile(path)) });
const read = async path => JSON.parse(await fs.readFile(path, 'utf8'));
const save = (path, data) => fs.writeFile(path, JSON.stringify(data, null, 2) + '\n');
const originalRoot = `${work}/d017-n58-path-original`;
await fs.mkdir(originalRoot);
const originals = [];
for (const path of [specFile, reviewFile, independentFile]) {
  const destination = `${originalRoot}/${path.split('/').at(-1)}`;
  await fs.copyFile(path, destination, fs.constants.COPYFILE_EXCL);
  originals.push({ active: path, preserved: await bind(destination) });
}
const originalBytes = await fs.readFile(specFile);
const spec = JSON.parse(originalBytes);
const originalAsset = structuredClone(spec.assets[0]);
const png = `${root}/figures/${id}.png`;
const generation = `${root}/figures/${id}.png.json`;
assert.equal((await bind(originalAsset.path)).sha256, (await bind(png)).sha256);
const oldGeneration = await read(originalAsset.metadata);
const durableGeneration = await read(generation);
durableGeneration.output.path = oldGeneration.output.path;
assert.deepEqual(durableGeneration, oldGeneration);
spec.assets[0].path = png;
spec.assets[0].metadata = generation;
const restored = structuredClone(spec);
restored.assets[0] = originalAsset;
assert.equal(JSON.stringify(restored, null, 2) + '\n', originalBytes.toString());
const mediaBefore = await bind(png);
const generationBefore = await bind(generation);
await save(specFile, spec);
const review = await read(reviewFile);
review.spec = await bind(specFile);
review.notes = 'Existing independent source/context/pixel approval reused. Only assets[0].path and metadata rebound to durable files; reverse substitution restores original FigureSpec bytes. Source, artwork pixels, generation content, geometry and authoritative text unchanged.';
await save(reviewFile, review);
const independent = await read(independentFile);
independent.bindings.spec = await bind(specFile);
independent.bindings.png = mediaBefore;
independent.bindings.generation = generationBefore;
independent.promotion.sourceSpecBytesUnchanged = false;
independent.promotion.sourceSpecBytesUnchangedAtInitialPromotion = true;
independent.promotion.assetPathCorrection = {
  originalSpec: originals[0].preserved, currentSpec: await bind(specFile),
  fields: ['assets[0].path', 'assets[0].metadata'],
  reversePathSubstitutionRestoresOriginalBytes: true,
  mediaGeometryContextUnchanged: true,
};
await save(independentFile, independent);
const code = [
  "import sys,json; from pathlib import Path",
  "sys.path.insert(0,'.claude/skills/ld-s10y-lesson/tools')",
  "from edition import load,validate_figure_spec,validate_generation_metadata,validate_review",
  `root=Path('${root}'); fid='${id}'`,
  "sp=root/'figures'/f'{fid}.spec.json'; gp=root/'figures'/f'{fid}.png.json'; png=root/'figures'/f'{fid}.png'; rp=root/'figures'/f'{fid}.review.json'",
  "spec,errors=validate_figure_spec(sp,fid,True)",
  "figure=load(root/'lessons/phy9-c2-s1/figures.json')['figures'][0]",
  "errors+=validate_generation_metadata(gp,spec,figure,png)",
  "errors+=validate_review(rp,sp,'generation',gp,{'png':png},fid)",
  "print(json.dumps({'status':'fail' if errors else 'pass','scope':'affected n58 asset/spec/generation/review metadata only','errors':errors},ensure_ascii=False))",
  "assert not errors",
].join('\n');
const output = execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', ['-c', code], { encoding: 'utf8' });
process.stdout.write(output);
assert.deepEqual(await bind(png), mediaBefore);
assert.deepEqual(await bind(generation), generationBefore);
await fs.writeFile(`${work}/d017-n58-path-correction.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'pass', scope: 'path-only affected metadata correction',
  preservedOriginals: originals, currentSpec: await bind(specFile),
  currentNativeReview: await bind(reviewFile), currentIndependentReview: await bind(independentFile),
  metadataValidation: JSON.parse(output), mediaUnchanged: mediaBefore, generationUnchanged: generationBefore,
  reversePathSubstitutionRestoresOriginalSpecBytes: true,
  changedFields: ['assets[0].path', 'assets[0].metadata'],
  limits: 'No image generation, pixel or SCI gate repeated, lesson/source edit or second adapt-finalize. Original approval bytes preserved verbatim; current spec SHA explicitly differs.',
}, null, 2) + '\n', { flag: 'wx' });

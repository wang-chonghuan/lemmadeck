import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const T = path.join(R, '.intentfold/tickets/STEMROBIN-181');
const D = path.join(T, 'tmp/d910-n87-first-dom-capture');
const O = path.join(T, 'tmp/d939-n87-first-display-coverage05');
const script = fileURLToPath(import.meta.url);
const batchId = 'full-coverage-5';
const expectedInputs = {
  'visual-review-plan.json': '4f53432d9b98c262f23491e32415613798a367cbea2fca158f8ffc3afae800cc',
  'crop-recipes.json': '65f36b384d4ac2b0aee732e59d2a8faf82fde5c18e3537d2be57cfdd460a0ab7',
  'offline-report.json': 'ea4867adda3b785f39d8e4933d3c19046714f97311db4fc144e246a1ed935d65',
};
const native = path.join(T, 'tmp/d900-n87-first-bilingual-native/en/artifacts/10p/editions/modern-us-neutral/lessons/phy10-c2-s3-n87');
const expectedContext = {
  'lesson.json': '169e482be3dcfca616b95a76f06aff4a8037cdd8def81338880d060f8bf1eab9',
  'exercises.json': '15cf5d385456132e106ed799ff07376b2be195f495af1bf1ec2994b50a8dd640',
};
const sha = p => createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const verifiedFile = (p, expected) => {
  assert.equal(sha(p), expected, `Hash mismatch: ${p}`);
  return { path: p, sha256: expected };
};
const json = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const writeJson = (name, value) => fs.writeFileSync(path.join(O, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const checksums = () => {
  const names = fs.readdirSync(O).filter(n => n !== 'SHA256SUMS').sort();
  for (const name of names) assert(fs.lstatSync(path.join(O, name)).isFile());
  fs.writeFileSync(path.join(O, 'SHA256SUMS'), names.map(n => `${sha(path.join(O, n))}  ${n}\n`).join(''));
};

assert.equal(process.cwd(), R);
assert.equal(path.dirname(script), O);
assert.equal(fs.realpathSync(O), O);
const action = process.argv[2];
assert(['materialize', 'seal'].includes(action));
const inputs = Object.entries(expectedInputs).map(([n, h]) => verifiedFile(path.join(D, n), h));
const context = Object.entries(expectedContext).map(([n, h]) => verifiedFile(path.join(native, n), h));
const plan = json(path.join(D, 'visual-review-plan.json'));
const recipesFile = json(path.join(D, 'crop-recipes.json'));
const offline = json(path.join(D, 'offline-report.json'));
const batches = plan.batches.filter(b => b.id === batchId);
assert.equal(batches.length, 1);
const batch = batches[0];
assert.equal(batch.recipeIds.length, 8);
assert.equal(batch.maximumImages, 8);
assert.equal(new Set(batch.recipeIds).size, 8);
const recipes = batch.recipeIds.map(id => {
  const matches = recipesFile.recipes.filter(r => r.id === id);
  assert.equal(matches.length, 1);
  const r = matches[0];
  assert.equal(r.locale, 'en');
  assert.equal(r.surface, 'text');
  assert.equal(r.viewport.width, 1440);
  assert.equal(r.source.path, path.join(D, 'screenshots/en-text-1440.png'));
  assert.equal(fs.realpathSync(r.source.path), r.source.path);
  const receipt = offline.screenshots.find(s => s.path === r.source.path);
  const planned = plan.originalScreenshots.find(s => s.path === r.source.path);
  assert(receipt && planned);
  assert.equal(receipt.sha256, r.source.sha256);
  assert.equal(planned.sha256, r.source.sha256);
  verifiedFile(r.source.path, r.source.sha256);
  return { ...r, outputPath: path.join(O, `${id}.png`), sourceDimensions: receipt.dimensions };
});
let y = 0;
for (const r of recipes) {
  const { left, top, width, height } = r.crop;
  for (const v of [left, top, width, height]) assert(Number.isInteger(v));
  assert.equal(left, 0);
  assert.equal(top, y);
  assert.equal(width, 1425);
  assert(height > 0);
  y += height;
}
assert.equal(y, 7345);

if (action === 'materialize') {
  assert.deepEqual(fs.readdirSync(O), ['materialize.mjs']);
  const python = path.join(R, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
  const code = `
import hashlib, json, sys
from PIL import Image
recipes = json.load(sys.stdin)
source_path = recipes[0]["source"]["path"]
with open(source_path, "rb") as stream:
    assert hashlib.sha256(stream.read()).hexdigest() == recipes[0]["source"]["sha256"]
results = []
with Image.open(source_path) as source:
    assert source.format == "PNG"
    assert source.size == (1425, 7345)
    for r in recipes:
        c = r["crop"]
        rect = (c["left"], c["top"], c["left"] + c["width"], c["top"] + c["height"])
        crop = source.crop(rect)
        crop.save(r["outputPath"], format="PNG")
        with Image.open(r["outputPath"]) as saved:
            assert saved.size == (c["width"], c["height"])
            assert saved.mode == source.mode
            assert crop.tobytes() == saved.tobytes()
        results.append({"recipeId": r["id"], "dimensions": {"width": crop.width, "height": crop.height}, "nativeScale": True, "pixelEqualityVerified": True})
print(json.dumps({"pillowVersion": Image.__version__, "sourcesDecodedMechanically": 1, "modelImageLoads": 0, "crops": results}))
`;
  const result = spawnSync(python, ['-B', '-c', code], {
    cwd: R,
    input: JSON.stringify(recipes),
    encoding: 'utf8',
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  assert.equal(result.status, 0, result.stderr);
  const mechanical = JSON.parse(result.stdout);
  assert.equal(mechanical.crops.length, 8);
  for (const input of [...inputs, ...context]) verifiedFile(input.path, input.sha256);
  const frozenRecipes = recipes.map((r, i) => ({
    recipeId: r.id,
    locale: r.locale,
    surface: r.surface,
    viewport: r.viewport,
    source: verifiedFile(r.source.path, r.source.sha256),
    sourceDimensions: r.sourceDimensions,
    rectangle: r.crop,
    crop: { path: r.outputPath, sha256: sha(r.outputPath), dimensions: mechanical.crops[i].dimensions },
    nativeScale: true,
    pixelEqualityVerified: true,
  }));
  const freeze = {
    schema: 'd939-n87-first-display-coverage05-freeze-v1',
    reviewer: 'd939',
    ticket: 'STEMROBIN-181',
    successor: 'successor181-3',
    batchId,
    frozenAt: new Date().toISOString(),
    frozenBeforeImageInspection: true,
    modelImageLoadsAtFreeze: 0,
    originalsLoadedIntoModel: 0,
    fullDISPLAY: false,
    completeCard: false,
    inputs,
    context,
    recipes: frozenRecipes,
    materializer: { path: script, sha256: sha(script), pillowVersion: mechanical.pillowVersion },
    coverage: { sourceWidth: 1425, sourceHeight: 7345, rectangleCount: 8, contiguousWithoutGapsOrOverlap: true, allSourcePixelsIncluded: true },
    restrictions: { offlineOnly: true, writesOnly: O, imageLoadLimitBatch: 8, imageLoadLimitContext: 24, noOriginalImageLoads: true, noExtraCropsOrReopens: true, noSemanticReviewReplay: true, noRenderCaptureBrowser: true, noBackendPublisherPromotionMeterGitTestsBuild: true },
  };
  writeJson('freeze.json', freeze);
  checksums();
  console.log(JSON.stringify({ freezePath: path.join(O, 'freeze.json'), freezeSha256: sha(path.join(O, 'freeze.json')), recipes: frozenRecipes }, null, 2));
} else {
  const freezePath = path.join(O, 'freeze.json');
  const sumsPath = path.join(O, 'SHA256SUMS');
  for (const line of fs.readFileSync(sumsPath, 'utf8').trim().split('\n')) {
    const match = line.match(/^([a-f0-9]{64})  ([A-Za-z0-9.-]+)$/);
    assert(match);
    verifiedFile(path.join(O, match[2]), match[1]);
  }
  const freeze = json(freezePath);
  const report = json(path.join(O, 'report.json'));
  const usage = json(path.join(O, 'usage.json'));
  assert.equal(report.batchId, batchId);
  assert.equal(report.fullDISPLAY, false);
  assert.equal(report.completeCard, false);
  assert.equal(report.freeze.sha256, sha(freezePath));
  assert.deepEqual(report.recipes.map(r => r.recipeId), batch.recipeIds);
  assert.equal(report.recipes.length, 8);
  for (const [i, reviewed] of report.recipes.entries()) {
    const frozen = freeze.recipes[i];
    assert.deepEqual(reviewed.source, frozen.source);
    assert.deepEqual(reviewed.crop, frozen.crop);
    assert.deepEqual(reviewed.rectangle, frozen.rectangle);
    verifiedFile(reviewed.crop.path, reviewed.crop.sha256);
    assert.equal(reviewed.imageLoads, 1);
    assert.equal(reviewed.detail, 'original');
  }
  assert.equal(usage.actualImageLoads, 8);
  assert.equal(usage.originalScreenshotImageLoads, 0);
  assert.equal(usage.reopens, 0);
  assert.equal(usage.additionalCrops, 0);
  assert.equal(usage.tokens, null);
  assert.equal(usage.costUsd, null);
  assert.deepEqual(usage.imageLoads.map(x => x.recipeId), batch.recipeIds);
  assert(usage.imageLoads.every(x => x.loads === 1 && x.detail === 'original'));
  const expectedNames = ['materialize.mjs', 'freeze.json', 'report.json', 'usage.json', 'SHA256SUMS', ...batch.recipeIds.map(id => `${id}.png`)].sort();
  assert.deepEqual(fs.readdirSync(O).sort(), expectedNames);
  checksums();
  for (const n of ['report.json', 'usage.json', 'freeze.json', 'SHA256SUMS']) console.log(`${sha(path.join(O, n))}  ${path.join(O, n)}`);
}

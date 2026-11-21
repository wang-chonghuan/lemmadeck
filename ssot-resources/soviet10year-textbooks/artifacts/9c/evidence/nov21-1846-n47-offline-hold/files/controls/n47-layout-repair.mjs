import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const base = path.join(root, '.tmp/stemrobin-184-six');
const diagnosis = path.join(base, 'n47-offline-diagnosis');
const original = path.join(base, 'n47-preview');
const target = path.join(base, 'n47-preview-repaired');
assert(!fs.existsSync(target));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.relative(root, file), bytes: bytes.length, sha256: sha(bytes) };
};
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const diagnosisManifest = read(path.join(diagnosis, 'hash-manifest.json'));
const diagnosisFiles = [];
const structured = {};
const leafCount = v => v !== null && typeof v === 'object'
  ? Object.values(v).reduce((n, child) => n + leafCount(child), 0) : 1;
function walk(folder) {
  assert.equal(fs.statSync(folder).mode & 0o777, 0o555);
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    assert(!entry.isSymbolicLink());
    const file = path.join(folder, entry.name);
    if (entry.isDirectory()) walk(file);
    else {
      assert.equal(fs.statSync(file).mode & 0o777, 0o444);
      const row = bind(file);
      if (entry.name.endsWith('.json')) {
        const data = read(file);
        structured[path.relative(diagnosis, file)] = data;
        row.scalarLeaves = leafCount(data);
      } else row.intake = 'Complete UTF-8 read, no browser/image';
      diagnosisFiles.push(row);
    }
  }
}
walk(diagnosis);
assert.equal(diagnosisManifest.schema, 'stemrobin1846/n47-diagnosis-complete-bindings@1');
for (const binding of diagnosisManifest.outputs) {
  const row = diagnosisFiles.find(x => x.path === binding.path);
  assert(row);
  assert.equal(row.sha256, binding.sha256);
  assert.equal(row.bytes, binding.bytes);
}
assert.equal(diagnosisFiles.length, diagnosisManifest.outputs.length + 1);
const evidence = structured['diagnosis-evidence.json'];
const report = structured['report.json'];
assert.equal(evidence.cleanup.browserClosed, true);
assert(evidence.technicalAssertions.every(x => x.passed));
assert.equal(evidence.accounting.screenshotCreations, 0);
assert.equal(evidence.accounting.actualImageToolViews, 0);
assert.equal(evidence.accounting.nativeClicks, 0);
for (const view of evidence.views) {
  assert(view.after.containers.every(x => x.containsFullRangeBoundsExactly));
  assert(view.afterEndpoints.every(x => x.passed));
}
assert.deepEqual(evidence.custody.before, evidence.custody.after);
const css = fs.readFileSync(path.join(diagnosis, 'recommended.css'), 'utf8');
assert.equal(css, 'p.para .nb {\n  overflow-y: hidden;\n  padding-block: 0.3em;\n}\n\n'
  + '.preview-question .sr-nb,\n.preview-option .option-text {\n'
  + '  overflow-y: hidden;\n  padding-block: 0.3em;\n}\n');
const rendererPath = path.join(root, '.claude/skills/ld-s10y-lesson/tools/render_lesson.js');
assert(fs.readFileSync(rendererPath, 'utf8')
  .includes('p.para .nb{overflow-y:hidden;padding-block:.3em}'));
fs.mkdirSync(target);
const originals = [], outputs = [];
for (const name of ['text', 'choices']) {
  const source = path.join(original, `${name}.html`);
  const before = fs.readFileSync(source, 'utf8');
  const bound = read(path.join(original, 'manifest.json')).files.find(x => x.path === path.relative(root, source));
  assert.equal(sha(Buffer.from(before)), bound.sha256);
  const scopedCss = name === 'text' ? css.split('\n\n')[0] + '\n' : css.split('\n\n')[1];
  const after = before.replace('</style>', scopedCss + '</style>');
  assert.notEqual(after, before);
  assert.equal(after.replace(scopedCss, ''), before);
  assert.equal(after.slice(after.indexOf('</style>')), before.slice(before.indexOf('</style>')));
  const output = path.join(target, `${name}.html`);
  fs.writeFileSync(output, after, { flag: 'wx', mode: 0o444 });
  originals.push(bind(source));
  outputs.push(bind(output));
}
fs.symlinkSync('../n47-preview/written.html', path.join(target, 'written.html'));
const manifest = {
  schema: 'stemrobin1846/n47-css-only-affected-repair@1',
  at: new Date().toISOString(), originals, outputs,
  css, renderer: bind(rendererPath),
  diagnosisManifest: bind(path.join(diagnosis, 'hash-manifest.json')),
  diagnosisIntake: {
    files: diagnosisFiles,
    completeJSONParseAndLeafTraversal: true,
    checks: evidence.technicalAssertions.map(x => ({ id: x.id, passed: x.passed })),
    views: evidence.views.map(v => ({
      view: v.name, measured: v.after.containers.length,
      originalAffected: v.affectedIndices.length,
      afterRangeProtrusions: v.after.containers.filter(x => !x.containsFullRangeBoundsExactly).length,
      endpoints: v.afterEndpoints.length,
    })),
    primaryParentRead: 'Full diagnosis report Markdown and diagnostic checker; detailed large evidence mechanically parsed in full, not falsely claimed verbatim-printed',
    outputQualifications: ['wc glob included a directory and exited1; no producer failure',
      'A guessed source169-control.mjs lookup was absent; actual source169-controls.mjs consulted as tooling only',
      'Historical plan tail and broad rg were displayed but no historical lesson/render/review/count stage replayed'],
    structuredReportKeys: Object.keys(report),
  },
  originalFirstFailPackage: bind(path.join(base, 'n47-offline/hash-manifest.json')),
  technicalMaterializationRecovery: {
    originalFailure: bind(path.join(base, 'stages/n47-affected-css-repair-materialize-first.receipt.json')),
    failedImplementation: bind(path.join(base, 'n47-layout-repair-first-failed.mjs')),
    diagnosis: 'Diagnosis manifest uses outputs, not ownedFiles; first call stopped before any preview writes or browser/image action',
    passedStageReplays: 0,
  },
  bodyFormulaControlAndPayloadBytesUnchanged: true,
  originalFirstPreviewsUnchanged: true,
  writtenPreview: {
    link: '../n47-preview/written.html',
    target: bind(path.join(original, 'written.html')),
    purpose: 'Reference unchanged passed navigation target, not new render or copied package',
  },
  visualVerdict: 'PENDING_AFFECTED_RECOVERY',
  actualParentImagesOrDecodes: 0, nativeRenderReplays: 0,
  reserve2ReleasedNextOnly: 'One combined text+choices screenshot per actual viewport; two total new image observations maximum',
};
const manifestPath = path.join(target, 'manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx', mode: 0o444 });
fs.chmodSync(target, 0o555);
const receipt = {
  at: manifest.at, manifest: bind(manifestPath),
  diagnosisManifest: manifest.diagnosisManifest,
  assertions: manifest.diagnosisIntake.checks,
  originalFailPreserved: true, accepted: false,
  parentImagesOrDecodes: 0, renderer: manifest.renderer,
};
fs.writeFileSync(path.join(base, 'n47-layout-repair-parent-receipt.json'),
  JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify(receipt));

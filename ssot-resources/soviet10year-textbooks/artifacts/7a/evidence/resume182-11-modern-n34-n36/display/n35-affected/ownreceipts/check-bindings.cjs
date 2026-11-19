const fs = require('node:fs');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');

const cwd = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
assert.equal(process.cwd(), cwd);
const base = '.intentfold/tickets/STEMROBIN-182/tmp/resume182-11';
const own = `${base}/display/n35-affected/ownreceipts`;
const phase = process.argv[2];
assert.ok(['pre-open', 'post-observation'].includes(phase));
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bindings = new Map();
function bind(p, expectedSha256) {
  const bytes = fs.readFileSync(p);
  const value = { path: p, sha256: hash(bytes), bytes: bytes.length };
  if (expectedSha256) {
    value.expectedSha256 = expectedSha256;
    value.matches = value.sha256 === expectedSha256;
    assert.ok(value.matches, `Hash mismatch: ${p}`);
  }
  const prior = bindings.get(p);
  if (prior) assert.equal(prior.sha256, value.sha256);
  bindings.set(p, value);
  return value;
}

const firstPath = `${base}/display/n35-FIRST/visual-review.json`;
const resultPath = `${base}/display/n35-affected/result.json`;
const repairPath = `${base}/alg7-c4-s1-n35-display-repair.json`;
bind(firstPath, 'f4f9d061ae868c8bfe851cb657ce9bf57cf71cb68b22606eed0b57208142dcfd');
bind(`${base}/display/n35-FIRST/visual-review.md`, '90eca64c3849c76238f0fbbd801f477f3babec8eb2eb41d9c390e93f31a53032');
bind(resultPath, '6114da206cf23def49cf057e47fe07a8fbe7fe407d4ff0051999e1cfdedf804a');
bind(repairPath, '018f8b52dbb970899387330e30d642cee744dcc943e04593491e01a68aa0b4c2');
const first = read(firstPath);
const result = read(resultPath);
const repair = read(repairPath);
assert.equal(first.status, 'revise');
assert.equal(result.status, 'pass');
assert.equal(result.checks.length, 4);
assert.equal(result.cwd, cwd);
const screenshots = result.checks.map(c => {
  bind(c.html.path, c.html.sha256);
  const image = bind(c.screenshot.path, c.screenshot.sha256);
  const bytes = fs.readFileSync(image.path);
  return {
    id: `${c.surface}-${c.viewport.width}`, surface: c.surface,
    viewport: c.viewport, ...image,
    pngSize: { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) }
  };
});
repair.changes.forEach(c => {
  bind(c.input.path, c.input.sha256);
  bind(c.output.path, c.output.sha256);
});
repair.sources.forEach(s => bind(s.path, s.sha256));
bind(repair.inheritedChoices.path, repair.inheritedChoices.sha256);
const choices = first.surfaces.filter(s => s.surface === 'choices');
assert.equal(choices.length, 2);
choices.forEach(s => {
  assert.equal(s.status, 'pass');
  bind(s.screenshot.path, s.screenshot.sha256);
});
bind(first.inheritedFigureGate.review.path, first.inheritedFigureGate.review.sha256);
const inheritedBindingPath = `${base}/display/n35-FIRST/ownreceipts/post-observation-binding.json`;
bind(inheritedBindingPath);
const inherited = read(inheritedBindingPath);
const figures = inherited.inheritedFigures.map(f => ({
  id: f.id, status: f.inheritedStatus,
  approvedCandidateSvg: bind(f.approvedCandidateSvg.path, f.approvedCandidateSvg.sha256),
  currentDurableSvg: bind(f.currentDurableSvg.path, f.currentDurableSvg.sha256),
  sourceHashInheritedWithoutPixelOpen: f.source.sha256
}));
const snapshot = {
  schema: 'offline-display-affected-bindings@1', phase,
  recordedAt: new Date().toISOString(), cwd, status: 'pass',
  imagePixelLoadsInThisCommand: 0, rendererBrowserDomExecutions: 0,
  screenshots, figures, bindings: [...bindings.values()]
};
if (phase === 'post-observation') {
  const before = read(`${own}/pre-open.json`);
  assert.deepEqual(snapshot.bindings, before.bindings);
  assert.deepEqual(snapshot.screenshots, before.screenshots);
  snapshot.allBindingsUnchangedSincePreOpen = true;
}
const output = `${own}/${phase}.json`;
assert.ok(!fs.existsSync(output), 'Preserve existing receipt');
fs.writeFileSync(output, `${JSON.stringify(snapshot, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ path: output, sha256: hash(fs.readFileSync(output)), status: 'pass', bindings: bindings.size, imagePixelLoads: 0 }));

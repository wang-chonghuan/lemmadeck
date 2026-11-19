const fs = require('node:fs');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
assert.equal(process.cwd(), root);
const base = '.intentfold/tickets/STEMROBIN-182/tmp/resume182-12';
const owned = `${base}/n39-fig55-review`;
const final = 'ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/figures';
const durableReview = `${final}/fig-55.review.json`;
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const ref = file => ({ path: path.resolve(file), sha256: digest(file) });
const originalReview = `${owned}/fig-55.review.json`;
const original = read(originalReview);
assert.equal(digest(originalReview), 'b51f7ddb70c4c621bf0b89ca226781b02edb6cdd8b3cddb3520ee79c2ac58906');
assert.equal(original.status, 'pass');
assert.equal(digest(`${owned}/review.md`), '119f96da968b6572c460b6796486113841f21f33c393a3c7375cd260de48a27a');
for (const record of [original.source, original.spec, original.render, original.outputs.svg]) {
  assert.equal(digest(record.path), record.sha256);
}
const receiptPath = `${base}/n39-fig55-path-promotion.json`;
const receipt = read(receiptPath);
assert.equal(receipt.independentApproval.path, originalReview);
assert.equal(receipt.independentApproval.sha256, digest(originalReview));
assert.equal(receipt.exactSpecAndSvgBytes, true);
assert.deepEqual(receipt.renderChanges, ['spec.path', 'output.svg.path']);
const durableSpec = `${final}/fig-55.spec.json`;
const durableSvg = `${final}/fig-55.svg`;
const durableRender = `${final}/fig-55.render.json`;
assert.deepEqual(receipt.final.map(f => f.path), [durableSpec, durableSvg, durableRender]);
for (const f of receipt.final) assert.equal(digest(f.path), f.sha256);
assert.ok(fs.readFileSync(durableSpec).equals(fs.readFileSync(original.spec.path)));
assert.ok(fs.readFileSync(durableSvg).equals(fs.readFileSync(original.outputs.svg.path)));
const currentSpec = read(durableSpec);
const render = read(durableRender);
const approvedRender = read(original.render.path);
assert.equal(render.spec.path, durableSpec);
assert.equal(render.output.svg.path, durableSvg);
assert.equal(render.spec.sha256, original.spec.sha256);
assert.equal(render.output.svg.sha256, original.outputs.svg.sha256);
assert.equal(render.status, 'pass');
assert.deepEqual(currentSpec.source.image, original.source);
const normalized = structuredClone(render);
normalized.spec.path = approvedRender.spec.path;
normalized.output.svg.path = approvedRender.output.svg.path;
assert.deepEqual(normalized, approvedRender);

const protectedFiles = [originalReview, `${owned}/review.md`, `${owned}/result.json`,
  original.source.path, original.spec.path, original.render.path, original.outputs.svg.path,
  durableSpec, durableSvg, durableRender, receiptPath, `${base}/promote-fig55-candidate.cjs`];
const protectedBefore = protectedFiles.map(ref);
function retain(file, copy) {
  assert.ok(copy.startsWith(`${owned}/`));
  if (fs.existsSync(copy)) assert.ok(fs.readFileSync(file).equals(fs.readFileSync(copy)));
  else fs.copyFileSync(file, copy, fs.constants.COPYFILE_EXCL);
  return ref(copy);
}
const first = {
  review: retain(originalReview, `${owned}/fig-55.review-FIRST.json`),
  approvedRender: retain(original.render.path, `${owned}/fig-55.render-approved-FIRST.json`),
};
assert.ok(!fs.existsSync(durableReview), 'Delegated durable review already exists; preserve other work.');
const notes = [
  'Fig55 path/hash rebinding only; existing independent semantic PASS is reused, not repeated.',
  `Original semantic review SHA256=${digest(originalReview)}; substantive report SHA256=${digest(`${owned}/review.md`)}.`,
  `Source SHA256=${original.source.sha256}; durable spec SHA256=${digest(durableSpec)}; durable SVG SHA256=${digest(durableSvg)}.`,
  `Durable render SHA256=${digest(durableRender)}; normalized metadata exactly matches approved FIRST render SHA256=${original.render.sha256} after restoring only spec.path and output.svg.path.`,
  'Approved spec and SVG are byte-identical to the reviewed versions; geometry and all nonpath producer metadata are unchanged.',
  'Additional image opens=0; rerenders=0; no semantic re-review.',
  'Human-approved R1 wording SHA256=dac34df757bb08a2e0275b9b0239ff88f4086caf6a5c2131482275311840fda9; unchanged exercise template approval SHA256=e50a97986c1e4f115049e9ae5003c4ff5b658f3fb25ad8a83a4e3aa48c14d907.',
  'No finalized819 text binding is asserted; parent must bind after finalization. No whole-lesson, answer, choice, app, publication, deployment or closure approval.',
].join(' ');
assert.ok(!/\.intentfold|\.tmp|\/tmp\//.test(notes));
const command = ['.agents/skills/ld-s10y-image/scripts/record_review.py',
  '--spec', durableSpec, '--render', durableRender, '--output', durableReview,
  '--status', 'pass', '--notes', notes];
const recorded = spawnSync('python3', command, {
  cwd: root, encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
assert.equal(recorded.status, 0, recorded.stderr || recorded.stdout);
const rebound = read(durableReview);
assert.equal(rebound.schema, 'ld-s10y-image/review@1');
assert.equal(rebound.status, 'pass');
assert.deepEqual(rebound.source, original.source);
assert.equal(rebound.spec.path, durableSpec);
assert.equal(rebound.render.path, durableRender);
assert.equal(rebound.outputs.svg.path, durableSvg);
for (const f of [rebound.source, rebound.spec, rebound.render, rebound.outputs.svg]) {
  assert.ok(f.path.startsWith('ssot-resources/'));
  assert.equal(digest(f.path), f.sha256);
}
assert.ok(!/\.intentfold|\.tmp|\/tmp\//.test(rebound.notes));
for (const f of protectedBefore) assert.equal(digest(f.path), f.sha256);
const result = {
  schema: 'ld-s10y-image/path-binding-result@1', ticket: 'STEMROBIN-182', figure: 'fig-55', status: 'pass',
  cwd: root, scope: 'Affected path/hash rebinding only; no repeated semantic review or finalized819 claim.',
  semanticPassReused: true, semanticReviewFirst: first.review, approvedRenderFirst: first.approvedRender,
  normalizedRenderComparedTo: original.render.sha256,
  exactSpecBytes: true, exactSvgBytes: true, renderOnlyChanges: ['spec.path', 'output.svg.path'],
  notesTemporaryDependencies: false, durableReview: ref(durableReview),
  durableBindings: [rebound.source, rebound.spec, rebound.render, rebound.outputs.svg].map(f => ref(f.path)),
  promotionReceipt: ref(receiptPath), promotionScriptReadOnly: ref(`${base}/promote-fig55-candidate.cjs`),
  substantiveReportSha256: digest(`${owned}/review.md`),
  actualAdditionalImageOpens: 0, additionalScreenshotCaptures: 0, producerRerenders: 0,
  semanticReviewRepeated: false, finalized819Claim: false, finalizedTextBindingOwner: 'parent-after-finalize',
  humanApprovedR1WordingSha256: 'dac34df757bb08a2e0275b9b0239ff88f4086caf6a5c2131482275311840fda9',
  exerciseTemplateApprovalSha256: 'e50a97986c1e4f115049e9ae5003c4ff5b658f3fb25ad8a83a4e3aa48c14d907',
  originalsUnchanged: true, protectedFiles: protectedBefore,
  recorder: { command: ['python3', ...command], exit: recorded.status, stdout: recorded.stdout.trim() },
};
const output = `${owned}/path-binding-result.json`;
assert.ok(!fs.existsSync(output), 'Binding result already exists; preserve other work.');
fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({status:'pass',durableReview:ref(durableReview),result:ref(output),
  findings:result.renderOnlyChanges,actualAdditionalImageOpens:0,firstRetained:first},null,2));

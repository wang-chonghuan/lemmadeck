import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
const own = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d280-fig2425-author');
assert.equal(process.cwd(), repo);
const bind = p => {
  const file = path.resolve(p);
  const bytes = fs.readFileSync(file);
  return {path: file, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex')};
};
const inventory = JSON.parse(fs.readFileSync(path.join(own, 'source-inventory.json')));
const sources = inventory.figures.map(f => {
  const item = bind(f.sourceImage);
  assert.equal(item.sha256, f.expectedApprovedRawSha256);
  return {id: f.id, ...item};
});
const texts = [];
const drafts = [];
let priorRead = '';
for (const edition of ['modern-us-neutral', 'modern-us-neutral-en']) {
  const file = `.tmp/STEMROBIN-181/d1816-d276/source-work/adapt/10p/${edition}/lessons/phy10-c1-s3-n17/lesson.template.json`;
  const data = JSON.parse(fs.readFileSync(file));
  assert.equal(data.id, 'phy10-c1-s3-n17');
  assert.equal(data.status, 'draft');
  const nonfig = data.prose.map((b, index) => ({...b, index})).filter(b => b.kind !== 'fig');
  assert.equal(nonfig.length, 12);
  const text = [data.chapter, data.printed_title, ...nonfig.map(b => b.text)].join('\n\n');
  texts.push({lesson: `${data.id}:${edition}:draft-not-approved`, text});
  drafts.push({...bind(file), edition, status: data.status, nonfigBlocks: nonfig.map(b => ({
    index: b.index, kind: b.kind, source_refs: b.source_refs, text: b.text,
  })), textSha256: crypto.createHash('sha256').update(text).digest('hex')});
  priorRead += `LANG: ${edition}\n${data.chapter}\n${data.printed_title}\n`;
  for (const b of nonfig) priorRead += `\nBLOCK ${b.index} [${b.kind}] ${JSON.stringify(b.source_refs)}\n${b.text}\n`;
}
assert.equal(fs.readFileSync(path.join(own, 'native/d280-read-all-nonfig-text/stdout.txt'), 'utf8'), priorRead);
const contracts = [
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.agents/skills/ld-s10y-image/references/figure-spec.md',
  '.agents/skills/ld-s10y-image/references/routing.md',
  '.agents/skills/ld-s10y-image/references/quality-gate.md',
  '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json',
  '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
  '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '.agents/skills/ld-s10y-image/scripts/materialize_arrowheads.mjs',
  '.claude/skills/ld-s10y-lesson/references/production-resume.md',
  '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d271-raw-source49-review/report.json',
  '.intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/run-native.mjs',
  '.intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/preview-d118-n19-existing-svg.mjs',
  '.intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/recover-d261-n44-preview.mjs',
].map(bind);
const originalRunner = fs.readFileSync(contracts.find(c => c.path.endsWith('/run-native.mjs')).path, 'utf8');
assert.equal(fs.readFileSync(path.join(own, 'run-native.mjs'), 'utf8'),
  originalRunner.replace('tmp/d1816-recovery/native', 'tmp/d1816-d280-fig2425-author/native'));
const output = {
  schema: 'd280-input-freeze@1', ticket: 'STEMROBIN-181', createdAt: new Date().toISOString(),
  sources, drafts, authoritativeText: texts, sourceInventory: bind(path.join(own, 'source-inventory.json')),
  contracts, runner: bind(path.join(own, 'run-native.mjs')),
  runnerReuse: 'Existing run-native.mjs, changed output directory only; exact comparison passed.',
  draftTextReadBeforeInventory: true, sourceInventoriedBeforeSpecs: true,
  approvedRawHashesMatchD271: true, backendRefresh: 'Excluded by direct offline author-only scope.',
  bootstrapExceptions: [
    'Five initial read-only exec calls (pwd, rg file discovery, read specialized runner, rg generic runner, read generic runner) occurred before a usable owned receipt runner was located. Tool outputs remain in chat but were not captured through run-native at execution time.',
    'The first apply_patch creates the owned path-only runner copy. apply_patch and view_image are not subprocess tools and cannot be invoked by run-native. Their changed-file receipts and image-open ledger are retained separately; not represented as native receipts.',
    'No live backend, skillhost freshness, Git, or project-wide checks were run because this is directly authorized bounded offline candidate authoring.',
  ],
};
fs.writeFileSync(path.join(own, 'input-freeze.json'), JSON.stringify(output, null, 2) + '\n', {flag: 'wx'});
console.log(JSON.stringify({freeze: bind(path.join(own, 'input-freeze.json')), sourceInventory: output.sourceInventory, sources, drafts: drafts.map(({nonfigBlocks, ...d}) => d)}));

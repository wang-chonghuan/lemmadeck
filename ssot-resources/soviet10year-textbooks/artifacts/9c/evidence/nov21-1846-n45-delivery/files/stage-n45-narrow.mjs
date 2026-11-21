import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), repo);
const run = (args, input) => {
  const result = spawnSync('git', args, {
    cwd: repo, input, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
  });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
};
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
assert.equal(run(['diff', '--cached', '--name-only']).trim(), '');
const refs = run(['rev-parse', 'HEAD', 'FETCH_HEAD']).trim().split('\n');
assert.equal(refs[0], refs[1], 'Remote differs; do not force/rebase/switch.');
assert.equal(refs[0], '39e5f6d1e747901724ba43964803ce011521d436');
const branch = spawnSync('git', ['symbolic-ref', '-q', 'HEAD'], {
  cwd: repo, encoding: 'utf8',
});
assert.equal(branch.status, 1, 'HEAD must stay detached.');
const raw = 'ssot-resources/soviet10year-textbooks/artifacts/9c';
const lesson = 'ana9-c4-s2-n45';
const completion = JSON.parse(fs.readFileSync(`${raw}/evidence/nov21-1846-n45-complete/completion.json`));
assert.equal(completion.completeLessonDelta, 1);
assert.equal(completion.completeGroup, false);
assert.equal(completion.n46.startsWith('OPEN_NOT_COMPLETE'), true);
const protectedFiles = ['0104', '0122', '0135'].flatMap(page =>
  ['page.md', 'page.json', 'audit.json'].map(name => `${raw}/pages/${page}/${name}`));
const protectedBindings = protectedFiles.map(file => ({
  path: file, sha256: hash(fs.readFileSync(file)),
}));
const indexRows = [];
const stageBlob = (file, bytes) => {
  const oid = run(['hash-object', '-w', '--stdin'], bytes).trim();
  run(['update-index', '--add', '--cacheinfo', '100644', oid, file]);
  indexRows.push({ path: file, gitBlob: oid, sha256: hash(bytes) });
};
const usagePath = '.intentfold/tickets/STEMROBIN-184/usage.json';
const workingUsage = fs.readFileSync(usagePath);
const oldText = run(['show', `HEAD:${usagePath}`]).trimEnd();
const oldUsage = JSON.parse(oldText);
const working = JSON.parse(workingUsage);
const additions = Object.entries(working).filter(([key]) =>
  /^nov21_1846_(?:source164165|source166|n45)_/.test(key) && !Object.hasOwn(oldUsage, key));
assert(additions.some(([key]) => key === 'nov21_1846_n45_COMPLETE_retention'));
const suffix = additions.map(([key, value]) =>
  `  ${JSON.stringify(key)}: ${JSON.stringify(value, null, 2)
    .split('\n').map((line, index) => index ? `  ${line}` : line).join('\n')}`).join(',\n');
const replacement = oldText.slice(0, -1).trimEnd() + ',\n' + suffix + '\n}\n';
const stagedUsage = JSON.parse(replacement);
for (const [key, value] of Object.entries(oldUsage)) assert.deepEqual(stagedUsage[key], value);
assert.deepEqual(stagedUsage.nov21_1846_n44_narrow_delivery_authorized,
  oldUsage.nov21_1846_n44_narrow_delivery_authorized);
stageBlob(usagePath, replacement);
const planPath = '.intentfold/tickets/STEMROBIN-184/plan.md';
const workingPlan = fs.readFileSync(planPath);
const oldPlan = run(['show', `HEAD:${planPath}`]);
const firstSection = oldPlan.indexOf('\n## ');
assert(firstSection > 0);
const finalSection = `## 184-6 n45 offline-complete tail delivery (2026-11-21)

n45 complete offline:17proseblocks/21displayedparagraphs,8written367-374,
8derivedanswers(7auto/1ungraded,10expressionparts),7math/1free interactions,
7choices(5single/2multiple)/34options,0figures. FIRST source-first/view-first/
key-last independent semantic review PASS, then official reviewed retention.
One fresh desktop1440x960/mobile390x844 offline batch: text/written/choices,
six actual child screenshot views, assertions and visual PASS, zero remote
dependencies. Explicit isolated/headless authorization; not live acceptance.
Source16425/25,16521/21,16622/22 PASS and prior independent mathematics/
actual closures reused. Only165 ownership annotation367->367-373 and two166
n>1 glyphs plus confirmed bottom scan-artifact counting metadata changed.
OriginalFIRST23/22 FAIL, glyphHOLD, immutable source freezes and UNKNOWN
charges preserved. Pipeline intake first naming failure and exact-name recovery
retained; no native/assembly/adaptation/render or semantic review replay.
FIRST offline comparator missed374's separate number label on both widths;
two saved-DOM comparisons alone recovered PASS with negative controls.
Original browser exit1/evidence/diagnosis retained; no browser replay.
Original374 retains BOTH graph constructions as ungraded, not auto choices.
Parent permanent24/24; new displaychild6/8,6/24;166known12/164165known6perpage.
n44 delivered39e5f6d1 and its strictCompliance=false are not recounted/reviewed.
n46 open tail remains incomplete. This is1complete tail lesson, not a group
or ticket handoff. Narrow normal push tocodex/STEMROBIN-184-textbooks,
detachedHEAD, no force/rebase.104/122/135 dirt and allHEAD usage keys preserved.
After normal delivery immediately continue actual serialSOURCE167 for open46,
not speculative future prefetch. No paid/DB/publication/merge/deploy/closure
or supervisor/peer messages;finish=review.

`;
stageBlob(planPath, oldPlan.slice(0, firstSection + 1) + finalSection + oldPlan.slice(firstSection + 1));
for (const file of [`${raw}/book.json`, `${raw}/editions/modern-us-neutral/book.json`]) {
  const original = JSON.parse(run(['show', `HEAD:${file}`]));
  const current = JSON.parse(fs.readFileSync(file));
  const row = current.lessons.find(item => item.id === lesson);
  assert(row && !original.lessons.some(item => item.id === lesson));
  original.lessons.push(row);
  if (file === `${raw}/book.json`) {
    const tracked = run(['ls-files', `${raw}/pages/*/page.json`]).trim().split('\n').filter(Boolean);
    assert.equal(original.pages, tracked.length);
    original.pages += 3;
  }
  stageBlob(file, JSON.stringify(original, null, 2) + '\n');
}
const selected = [
  ...['0164', '0165', '0166'].map(page => `${raw}/pages/${page}`),
  `${raw}/lessons/${lesson}`, `${raw}/editions/modern-us-neutral/lessons/${lesson}`,
];
run(['add', '--', ...selected]);
const evidence = [
  'nov21-1846-source164165', 'nov21-1846-native164165', 'nov21-1846-n45-math',
  'nov21-1846-source166', 'nov21-1846-source166-affected',
  'nov21-1846-source166-glyph', 'nov21-1846-n45-complete',
].map(name => `${raw}/evidence/${name}`);
run(['add', '-f', '--', ...evidence]);
const staged = run(['diff', '--cached', '--name-only']).trim().split('\n');
assert(!staged.some(file => /(?:^|\/)\.env(?:$|[./])/.test(file)));
assert(!staged.some(file => /pages\/(?:0104|0122|0135)\//.test(file)));
for (const row of protectedBindings) assert.equal(hash(fs.readFileSync(row.path)), row.sha256);
assert.deepEqual(fs.readFileSync(usagePath), workingUsage);
assert.deepEqual(fs.readFileSync(planPath), workingPlan);
run(['diff', '--cached', '--check']);
const result = { at: new Date().toISOString(), base: refs[0],
  status: 'N45_TAIL_ONLY_STAGED_ORIGINAL_DIRT_AND_HEAD_KEYS_PRESERVED',
  deliveryBranch: 'codex/STEMROBIN-184-textbooks', detached: true,
  staged, indexRows, usageAdditions: additions.map(([key]) => key),
  protectedBindings, completeLessonDelta: 1, parentImagesOrDecodes: 0,
  sourceOrGroupComplete: false, finish: 'review' };
fs.writeFileSync(path.join(repo, '.tmp/stemrobin-184-six/n45-narrow-stage.json'),
  JSON.stringify(result, null, 2) + '\n', { flag: 'wx', mode: 0o444 });
console.log(JSON.stringify({ status: result.status, files: staged.length,
  protectedFiles: protectedBindings.length, indexOnlyBlobs: indexRows.length,
  usageAdditions: additions.length }));

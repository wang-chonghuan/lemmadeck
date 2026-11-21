import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), repo);
const base = path.join(repo, '.tmp/stemrobin-184-six');
const git = (args, input) => {
  const result = spawnSync('git', args, {
    cwd: repo, input, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout;
};
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => ({ path: file, sha256: hash(fs.readFileSync(path.join(repo, file))) });
const raw = 'ssot-resources/soviet10year-textbooks/artifacts/9c';
const lesson = 'ana9-c4-s2-n46';
const historicalBranch = 'bd853c8f2e1d762ce9b92d19dd4bc8eeb4bf434d';
assert.equal(git(['diff', '--cached', '--name-only']).trim(), '');
const refs = git(['rev-parse', 'HEAD', 'FETCH_HEAD']).trim().split('\n');
assert.equal(refs[0], refs[1], 'Remote differs; no force/rebase/switch.');
assert.equal(refs[0], 'b805588d98f51d272fed4a820877459e7e857ad3');
assert.equal(git(['rev-parse', 'refs/heads/codex/STEMROBIN-184-textbooks']).trim(),
  historicalBranch);
assert.equal(spawnSync('git', ['symbolic-ref', '-q', 'HEAD'], { cwd: repo }).status, 1);
const completion = JSON.parse(fs.readFileSync(path.join(repo, raw,
  'evidence/nov21-1846-n46-complete/completion.json')));
assert.equal(completion.completeLessonDelta, 1);
assert.equal(completion.completeGroup, false);
assert.equal(completion.offline.screenshots, 6);
assert.equal(completion.choices.questions, 5);
assert.equal(completion.choices.options, 26);
const protectedFiles = ['0104', '0122', '0135'].flatMap(page =>
  ['page.md', 'page.json', 'audit.json'].map(name => `${raw}/pages/${page}/${name}`));
const protectedBindings = protectedFiles.map(bind);
const indexRows = [];
const stageBlob = (file, bytes) => {
  const oid = git(['hash-object', '-w', '--stdin'], bytes).trim();
  git(['update-index', '--add', '--cacheinfo', '100644', oid, file]);
  indexRows.push({ path: file, gitBlob: oid, sha256: hash(bytes) });
};
const usagePath = '.intentfold/tickets/STEMROBIN-184/usage.json';
const workingUsage = fs.readFileSync(path.join(repo, usagePath));
const oldText = git(['show', `HEAD:${usagePath}`]).trimEnd();
const oldUsage = JSON.parse(oldText), working = JSON.parse(workingUsage);
const additions = Object.entries(working).filter(([key]) =>
  (/^nov21_1846_(?:source167|n46)_/.test(key)
    || key === 'nov21_1846_n45_normal_delivery_remote_confirmed')
  && !Object.hasOwn(oldUsage, key));
assert(additions.some(([key]) => key === 'nov21_1846_n46_COMPLETE_retention'));
assert(additions.some(([key]) => key === 'nov21_1846_n46_COMPLETE_FULL_intake'));
const suffix = additions.map(([key, value]) =>
  `  ${JSON.stringify(key)}: ${JSON.stringify(value, null, 2)
    .split('\n').map((line, index) => index ? `  ${line}` : line).join('\n')}`).join(',\n');
const replacement = oldText.slice(0, -1).trimEnd() + ',\n' + suffix + '\n}\n';
const stagedUsage = JSON.parse(replacement);
for (const [key, value] of Object.entries(oldUsage)) assert.deepEqual(stagedUsage[key], value);
stageBlob(usagePath, replacement);
const planPath = '.intentfold/tickets/STEMROBIN-184/plan.md';
const workingPlan = fs.readFileSync(path.join(repo, planPath));
const oldPlan = git(['show', `HEAD:${planPath}`]);
const boundary = oldPlan.indexOf('\n## ');
assert(boundary > 0);
const section = `## 184-6 n46 offline-complete narrow delivery (2026-11-21)

n46:7proseblocks/8paragraphs,3written375-377/7subparts,2auto/1ungraded,
5expressionparts,2math/1free,5choices(3single/2multiple)/26options,0figures.
SOURCE167 corrected376b has BOTH ninth powers;4x^3-45x^8 retained.
One affected choice repair changed4options, reused22, source-first then
changed-view then internal review PASS; originalREVISE/semanticexit3,
strictCompliance object and old-key exposure remain disclosed.
FIRST official retention and read-only current publication gate PASS.
One independent fresh offline batch:6new full-page screenshots,6actual
views,80native clicks,remoteDependencies0. First exit1 retained six CDP
file-origin console failures; diagnosis plus console-only recovery exit0,
without content/control/geometry/visual replay. Local formula scrolling
explicitly qualified. Parent permanent24/24,zero new views/decodes.
Completion retained254files/3557525bytes; increment1, after-n17 total4;
not whole-group/ticket completion or live acceptance. Source167known8,
164165166167known32; all originalFAIL/HOLD/UNKNOWN and n44strictCompliance
false preserved. Parent outer-shell127 follows successfulintake0;
exact unquoted-annotation error preserved and successfulstage not replayed.
The previous no-Git continuation and extra-approval statement remain
historical, not a new human pause. Existing human2026-11-19T23:25:08.393Z
supervision delegation plus original production scope authorize this narrow
ordinary commit/push and immediate source continuation. Coordination
clarification is not represented as a new direct human message.
Only this complete n46 tail, source167, dependent evidence and new usage
keys staged. Oldn17 working record,104/122/135 dirt and allHEAD keys
preserved. HEAD stays detached; historical local branchbd853c8f does not
move. Normal fast-forward push tocodex/STEMROBIN-184-textbooks;no force,
rebase,newbranch,DB,paidcall,publication,merge,deploy,ticketclosure or
supervisor/peer messages. Then actual serialSOURCE168 for OPEN47 ending
this-time on167; source determines closure, no future-page prefetch.

`;
stageBlob(planPath, oldPlan.slice(0, boundary + 1) + section + oldPlan.slice(boundary + 1));
for (const file of [`${raw}/book.json`, `${raw}/editions/modern-us-neutral/book.json`]) {
  const previous = JSON.parse(git(['show', `HEAD:${file}`]));
  const current = JSON.parse(fs.readFileSync(path.join(repo, file)));
  const row = current.lessons.find(item => item.id === lesson);
  assert(row && !previous.lessons.some(item => item.id === lesson));
  previous.lessons.push(row);
  if (file === `${raw}/book.json`) {
    const tracked = git(['ls-files', `${raw}/pages/*/page.json`]).trim().split('\n').filter(Boolean);
    assert.equal(previous.pages, tracked.length);
    previous.pages += 1;
  }
  stageBlob(file, JSON.stringify(previous, null, 2) + '\n');
}
const selected = [`${raw}/pages/0167`, `${raw}/lessons/${lesson}`,
  `${raw}/editions/modern-us-neutral/lessons/${lesson}`];
const evidence = ['nov21-1846-source167', 'nov21-1846-source167-review',
  'nov21-1846-n46-complete'].map(name => `${raw}/evidence/${name}`);
git(['add', '--', ...selected]);
git(['add', '-f', '--', ...evidence]);
const staged = git(['diff', '--cached', '--name-only']).trim().split('\n');
const allowed = file => indexRows.some(row => row.path === file)
  || [...selected, ...evidence].some(root => file.startsWith(root + '/'));
assert(staged.every(allowed));
assert(!staged.some(file => /(?:^|\/)\.env(?:$|[./])|pages\/(?:0104|0122|0135)\//.test(file)));
protectedBindings.forEach(row => assert.equal(bind(row.path).sha256, row.sha256));
assert.deepEqual(fs.readFileSync(path.join(repo, usagePath)), workingUsage);
assert.deepEqual(fs.readFileSync(path.join(repo, planPath)), workingPlan);
const result = { at: new Date().toISOString(), base: refs[0],
  status: 'N46_TAIL_ONLY_STAGED_PENDING_WHITESPACE_GATE',
  deliveryBranch: 'codex/STEMROBIN-184-textbooks', historicalBranch,
  detached: true, staged, indexRows, usageAdditions: additions.map(([key]) => key),
  protectedBindings, completeLessonDeltaAlreadyRecorded: 1,
  newCompleteLessonDelta: 0, parentImagesOrDecodes: 0, sourceOrGroupComplete: false,
  finish: 'review', source168Dispatched: false };
fs.writeFileSync(path.join(base, 'n46-narrow-stage.json'),
  JSON.stringify(result, null, 2) + '\n', { flag: 'wx', mode: 0o444 });
git(['diff', '--cached', '--check']);
console.log(JSON.stringify({ status: 'N46_NARROW_STAGING_PASS',
  files: staged.length, protectedFiles: protectedBindings.length,
  indexOnlyBlobs: indexRows.length, usageAdditions: additions.length,
  originalWorkingPlanAndUsageBytesUnchanged: true }));

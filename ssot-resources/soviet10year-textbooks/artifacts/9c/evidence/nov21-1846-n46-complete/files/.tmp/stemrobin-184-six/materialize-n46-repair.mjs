import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), repo);
const base = path.join(repo, '.tmp/stemrobin-184-six');
const progress = JSON.parse(fs.readFileSync(path.join(base, 'source-progress.json'), 'utf8'));
assert.equal(progress.n46.independentChoice.closed, false);
assert(progress.n46.independentChoice.stage3Intake);
assert.equal(JSON.parse(fs.readFileSync(path.join(base,
  'n46-choice-independent/review.json'), 'utf8')).outcome, 'revise');
const target = path.join(base, 'n46-choice-repair');
assert(!fs.existsSync(target));
fs.mkdirSync(target);
const rows = [];
for (const [name, expected] of [
  ['seed.json', '33b82a6e5f10cdc1f33a9624ba2407952076923998cf25704fc07174dc250a4c'],
  ['draft.json', '5113bf73ae9f52e5b3311dc828302bd9977046b551d2d483db70cf9acd50dcef'],
]) {
  const source = path.join(base, 'n46-choices-recovered', name);
  const bytes = fs.readFileSync(source);
  const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
  assert.equal(sha256, expected);
  const destination = path.join(target, name);
  fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(destination, name === 'draft.json' ? 0o644 : 0o444);
  rows.push({ source: path.relative(repo, source),
    destination: path.relative(repo, destination), bytes: bytes.length, sha256 });
}
console.log(JSON.stringify({
  status: 'ONE_NEW_WRITABLE_AFFECTED_REPAIR_COPY_CREATED',
  scope: ['n46-choice-04', 'n46-choice-05', 'source377 dependent coverage'],
  originalAuthorAndRejectedReviewUnchanged: true,
  contentRevisionsAtMaterialization: 0, parentImagesOrDecodes: 0,
  passedStageReplays: 0, completeLessonDelta: 0, rows,
}, null, 2));

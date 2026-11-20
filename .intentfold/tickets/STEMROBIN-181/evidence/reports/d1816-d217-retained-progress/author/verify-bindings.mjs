import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
const author = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d217-10p-source74-76-author');
if (process.cwd() !== repo) throw new Error('D217 exact cwd required');
const digest = data => crypto.createHash('sha256').update(data).digest('hex');
const checked = new Map();
let count = 0;
function verify(value) {
  if (!value || typeof value !== 'object') return;
  if (typeof value.path === 'string' && typeof value.sha256 === 'string') {
    if (!path.isAbsolute(value.path)) throw new Error(`Nonabsolute bound path: ${value.path}`);
    const data = fs.readFileSync(value.path);
    if (digest(data) !== value.sha256 || (value.bytes !== undefined && data.length !== value.bytes)) {
      throw new Error(`SHA256/size binding mismatch: ${value.path}`);
    }
    checked.set(value.path, value.sha256);
    count += 1;
  }
  for (const nested of Object.values(value)) verify(nested);
}
for (const name of ['report.json', 'author-freeze.json', 'current-output-bindings.json', 'prefinalize-freeze.json']) {
  verify(JSON.parse(fs.readFileSync(path.join(author, name), 'utf8')));
}
const report = JSON.parse(fs.readFileSync(path.join(author, 'report.json'), 'utf8'));
const sealed = JSON.parse(fs.readFileSync(path.join(author, 'author-freeze.json'), 'utf8'));
if (report.actualCounters.implicitReadOnlyGitCalls !== 6 || sealed.permissionBoundaryFullySatisfied !== false) {
  throw new Error('Actual Git boundary violation must remain explicit');
}
if (report.actualCounters.actualImageOpens !== 8 || report.actualCounters.canonicalConsumedPageCount !== 0 ||
    report.actualCounters.courseApproval !== 0 || report.figure47.totalContentRepairs !== 0) {
  throw new Error('Actual production/image/repair counters mismatch');
}
console.log(JSON.stringify({
  status: 'TICKET_SCOPED_BYTE_BINDINGS_VERIFIED_NOT_SOURCE_APPROVAL',
  boundReferencesChecked: count,
  uniqueBoundFilesChecked: checked.size,
  report: { path: path.join(author, 'report.json'), sha256: digest(fs.readFileSync(path.join(author, 'report.json'))) },
  authorFreeze: { path: path.join(author, 'author-freeze.json'), sha256: digest(fs.readFileSync(path.join(author, 'author-freeze.json'))) },
  canonicalConsumedPageCount: 0, courseApproval: 0, actualImageOpens: 8,
  figureContentRepairs: 0, implicitReadOnlyGitCalls: 6, holds: sealed.holdIds,
}, null, 2));

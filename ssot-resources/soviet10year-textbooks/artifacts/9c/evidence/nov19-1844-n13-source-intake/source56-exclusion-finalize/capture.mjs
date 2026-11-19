import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const source = 'ssot-resources/soviet10year-textbooks/artifacts/9c/pages/0056';
const before = 'ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov19-1844-n13-source-intake/source56-finalize-first/native-outputs';
const output = '.tmp/stemrobin-184-resume/n13-source56-exclusion-finalize';
const read = file => fs.readFileSync(file);
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const split = bytes => {
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/u.exec(bytes.toString());
  assert(match, 'Expected page JSON frontmatter');
  return { meta: JSON.parse(match[1]), body: match[2] };
};
assert(!fs.existsSync(output), 'No affected-finalize replay');
const prior = split(read(`${before}/page.md`));
const candidate = split(read(`${source}/page.md`));
const withoutExclusion = structuredClone(candidate.meta);
delete withoutExclusion.count_exclusions;
assert.deepEqual(withoutExclusion, prior.meta);
assert.equal(candidate.body, prior.body);
assert.equal(candidate.meta.count_exclusions.length, 1);
assert.deepEqual(candidate.meta.count_exclusions[0].box, [0, 817, 49, 77]);
assert.equal(candidate.meta.count_exclusions[0].kind, 'scan-artifact');
fs.mkdirSync(output);
fs.writeFileSync(`${output}/candidate.page.md`, read(`${source}/page.md`), { flag: 'wx' });
const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize', '--book', '9c', '--page', '56'];
const stdout = fs.openSync(`${output}/native.stdout`, 'wx');
const stderr = fs.openSync(`${output}/native.stderr`, 'wx');
const startedAt = new Date().toISOString();
let actual;
try {
  actual = spawnSync(command[0], command.slice(1), { cwd: process.cwd(), stdio: ['ignore', stdout, stderr] });
} finally {
  fs.closeSync(stdout);
  fs.closeSync(stderr);
}
const rows = [];
for (const name of ['page.md', 'page.json', 'audit.json']) {
  const file = `${source}/${name}`;
  const bytes = read(file);
  fs.writeFileSync(`${output}/${name}`, bytes, { flag: 'wx' });
  rows.push({ path: file, sha256: hash(bytes), bytes: bytes.length });
}
const after = split(read(`${source}/page.md`));
const afterWithoutExclusion = structuredClone(after.meta);
delete afterWithoutExclusion.count_exclusions;
const nativeOnlyExclusion = JSON.stringify(afterWithoutExclusion) === JSON.stringify(prior.meta);
const audit = JSON.parse(read(`${source}/audit.json`));
const figure = '.tmp/ld-s10y-lesson/9c/pages/0056/figures/tbl-p0056-01.png';
const figureSame = read(figure).equals(read(`${before}/tbl-p0056-01.png`));
fs.writeFileSync(`${output}/receipt.json`, JSON.stringify({
  schema: 'source56-affected-exclusion-finalize@1',
  command, cwd: process.cwd(), startedAt, endedAt: new Date().toISOString(),
  actualExit: actual.status, signal: actual.signal, error: actual.error?.message ?? null,
  affectedInvocations: 1, firstFailedInvocationPreserved: true,
  candidateSha256: hash(read(`${output}/candidate.page.md`)),
  stdoutSha256: hash(read(`${output}/native.stdout`)), stderrSha256: hash(read(`${output}/native.stderr`)),
  rows, audit, bodyExactlyUnchanged: after.body === prior.body,
  nativeMetadataOnlyExclusion: nativeOnlyExclusion,
  figureExactFirstBytes: figureSame, figureSha256: hash(read(figure)),
  unknownInteriorPixels: '7pixelsremainunmasked; physicalorigin/U01/wholepageocclusionUNKNOWN preserved.',
  sourceOrMathOrLessonApproval: false,
  next: actual.status === 0 ? 'Receive/hash-bind completed affected mechanical result before assembly.' : 'Stop dependent stages; preserve actual failure, no replay.',
  parentImages: 'Permanent24/24;0newopens/payloads.',
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ actualExit: actual.status, printed: audit.lines_printed, logical: audit.lines_md,
  bodyExactlyUnchanged: after.body === prior.body, nativeMetadataOnlyExclusion: nativeOnlyExclusion,
  figureExactFirstBytes: figureSame, sourceApproval: false }));
process.exitCode = actual.status ?? 1;

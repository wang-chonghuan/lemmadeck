import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), repo);
const file = '.intentfold/tickets/STEMROBIN-184/usage.json';
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const git = (args, input) => {
  const result = spawnSync('git', args, { cwd: repo, input, encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024 });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout;
};
const working = fs.readFileSync(file);
const headText = git(['show', `HEAD:${file}`]).trimEnd();
const head = JSON.parse(headText);
const before = git(['show', `:${file}`]);
const staged = JSON.parse(before);
const additions = Object.entries(staged).filter(([key]) => !Object.hasOwn(head, key));
assert(additions.every(([key]) => /^nov21_1846_(?:source164165|source166|n45)_/.test(key)));
assert(additions.some(([key]) => key === 'nov21_1846_n45_narrow_stage_technical_recovery'));
const prefix = headText.slice(0, -1).trimEnd();
const suffix = additions.map(([key, value]) =>
  `  ${JSON.stringify(key)}: ${JSON.stringify(value, null, 2)
    .split('\n').map((line, index) => index ? `  ${line}` : line).join('\n')}`).join(',\n');
const replacement = prefix + ',\n' + suffix + '\n}\n';
assert(replacement.startsWith(prefix));
assert.deepEqual(JSON.parse(replacement), staged);
const oid = git(['hash-object', '-w', '--stdin'], replacement).trim();
git(['update-index', '--add', '--cacheinfo', '100644', oid, file]);
assert.deepEqual(fs.readFileSync(file), working);
git(['diff', '--cached', '--check', '--', file]);
const evidence = path.join(repo,
  'ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov21-1846-n45-delivery');
const source = import.meta.filename;
const target = path.join(evidence, 'files', path.basename(source));
fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL);
fs.chmodSync(target, 0o444);
const record = {
  at: new Date().toISOString(), status: 'INDEX_ONLY_OLD_USAGE_BYTES_AND_VALUES_PRESERVED',
  beforeIndexSha256: hash(before), finalIndexSha256: hash(replacement),
  originalHeadPrefixBytes: Buffer.byteLength(prefix), originalHeadPrefixSha256: hash(prefix),
  newScopedKeys: additions.map(([key]) => key), workingFileUnchanged: true,
  oldHeadValuesUnchanged: true, originalHeadOnlyKeyPreserved: true,
  protectedDirtyPagesUnstaged: true, parentImagesOrDecodes: 0,
};
fs.writeFileSync(path.join(evidence, 'index-usage-bytes.json'),
  JSON.stringify(record, null, 2) + '\n', { flag: 'wx', mode: 0o444 });
git(['add', '-f', '--', evidence]);
console.log(JSON.stringify(record));

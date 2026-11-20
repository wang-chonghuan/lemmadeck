import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const root = path.dirname(fileURLToPath(import.meta.url));
const input = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n47-text-fig1617-n46-choice-review-inputs-01/manifest.json');
if (process.cwd() !== repo) throw new Error('Wrong cwd');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const binding = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size });
const write = (name, value) => fs.writeFileSync(path.join(root, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });

if (process.argv[2] === 'freeze') {
  const stage = process.argv[3];
  if (!['before', 'after'].includes(stage)) throw new Error('Invalid stage');
  const manifest = read(input);
  const records = manifest.bindings.map(expected => {
    const actual = binding(expected.path);
    return { ...actual, expectedSha256: expected.sha256, matchesManifest: actual.sha256 === expected.sha256 };
  });
  const before = stage === 'after' ? read(path.join(root, 'bindings-before.json')) : null;
  const changes = before ? records.filter((r, i) => r.sha256 !== before.bindings[i].sha256) : [];
  const payload = {
    schema: 'same188-6/independent-review-bindings@1',
    stage, recordedAt: new Date().toISOString(), cwd: repo,
    manifest: binding(input), expectedBindingCount: 98, bindingCount: records.length,
    allMatchManifest: records.every(r => r.matchesManifest),
    unchangedSinceBefore: before ? changes.length === 0 : null,
    changes, bindings: records,
  };
  write(`bindings-${stage}.json`, payload);
  console.log(JSON.stringify({ stage, count: records.length, match: payload.allMatchManifest, unchanged: payload.unchangedSinceBefore }));
  if (records.length !== 98 || !payload.allMatchManifest || changes.length) process.exitCode = 1;
} else if (process.argv[2] === 'index') {
  const files = fs.readdirSync(root, { recursive: true }).filter(p => fs.statSync(path.join(root, p)).isFile() && p !== 'output-index.json').sort();
  write('output-index.json', {
    schema: 'same188-6/independent-review-output-index@1',
    root, recordedAt: new Date().toISOString(),
    selfHashExcluded: true,
    files: files.map(p => binding(path.join(root, p))),
  });
  console.log(JSON.stringify(binding(path.join(root, 'output-index.json'))));
} else {
  throw new Error('Use freeze before|after or index');
}

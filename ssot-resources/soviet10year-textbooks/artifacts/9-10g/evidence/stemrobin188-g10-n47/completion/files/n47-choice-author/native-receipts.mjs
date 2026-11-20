import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { chmodSync, copyFileSync, constants, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const root = dirname(fileURLToPath(import.meta.url));
if (process.cwd() !== repo) throw new Error('Exact assigned cwd required');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const save = (name, value) => writeFileSync(join(root, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const action = process.argv[2];

if (action === 'prepare' || action === 'validate') {
  const args = action === 'prepare'
    ? ['.agents/skills/ld-s10y-choice/scripts/prepare.py', 'prepare', '--repo', '.', '--book', '9-10g',
       '--lesson', 'geo910-c2-s2-n47', ...['49', '50', '51', '52', '53', '54'].flatMap(n => ['--exercise', n]),
       ...[5, 6, 7, 11, 12, 13, 14, 15, 16, 17, 18, 23].flatMap(n => ['--concept-block', String(n)]),
       '--out', join(root, 'seed.json')]
    : ['.agents/skills/ld-s10y-choice/scripts/validate.py', '--repo', '.', '--seed', join(root, 'seed.json'),
       '--draft', join(root, 'draft.json')];
  const result = spawnSync('python3', args, { cwd: repo, encoding: 'utf8',
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } });
  save(`${action}.FIRST.receipt.json`, {
    cwd: repo, executable: 'python3', argv: args, invocation: 1,
    exit_code: result.status, signal: result.signal, stdout: result.stdout,
    stderr: result.stderr, error: result.error?.message ?? null,
    with_review: false, semantic_approval: false
  });
  process.stdout.write(result.stdout ?? '');
  process.stderr.write(result.stderr ?? '');
  process.exitCode = result.status ?? 2;
} else if (action === 'freeze-seed' || action === 'freeze-draft') {
  const name = action === 'freeze-seed' ? 'seed' : 'draft';
  copyFileSync(join(root, `${name}.json`), join(root, `${name}.FIRST.json`), constants.COPYFILE_EXCL);
  chmodSync(join(root, `${name}.FIRST.json`), 0o444);
  if (name === 'seed') chmodSync(join(root, 'independent-solutions.FIRST.md'), 0o444);
  console.log(`${name}.FIRST.json frozen; sha256=${hash(readFileSync(join(root, `${name}.FIRST.json`)))}`);
} else if (action === 'index') {
  const files = readdirSync(root).filter(name => name !== 'output-index.json').sort();
  const outputs = files.map(name => {
    const path = resolve(root, name);
    if (!statSync(path).isFile()) throw new Error('Unexpected nested output');
    const bytes = readFileSync(path);
    return { path, bytes: bytes.length, sha256: hash(bytes) };
  });
  const index = { schema: 'n47-choice-author-output-index-v1', root,
    hash_algorithm: 'SHA-256 of exact file bytes', self_excluded: 'A file cannot contain its own byte hash',
    outputs };
  save('output-index.json', index);
  console.log(JSON.stringify({ outputs, index_path: join(root, 'output-index.json'),
    index_sha256: hash(readFileSync(join(root, 'output-index.json'))) }, null, 2));
} else {
  throw new Error('Use prepare, validate, freeze-seed, freeze-draft or index');
}

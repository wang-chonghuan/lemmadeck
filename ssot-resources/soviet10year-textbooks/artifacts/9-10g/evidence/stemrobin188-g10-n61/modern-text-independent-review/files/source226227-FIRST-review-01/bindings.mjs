import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp');
const own = path.join(tmp, 'source226227-FIRST-review-01');
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeOwn = (name, value) => fs.writeFileSync(path.join(own, name), JSON.stringify(value, null, 2) + '\n');
const mode = process.argv[2];

if (mode === 'before') {
  const manifests = [
    'source226227-n61-fig77-review-inputs-01/blind-intake.json',
    'source226227-n61-fig77-review-inputs-01/manifest.json',
    'source226227-FIRST-review-inputs-01/manifest.json',
    'n61-modern-text-review-inputs-01/manifest.json',
    'n60-fig7778-author-inputs-01/manifest.json'
  ];
  const descriptors = new Map();
  const relativeContractReferences = [];
  function collect(value, origin) {
    if (!value || typeof value !== 'object') return;
    if (typeof value.path === 'string' && /^[a-f0-9]{64}$/.test(value.sha256 ?? '')) {
      if (!path.isAbsolute(value.path)) {
        relativeContractReferences.push({origin, ...value, interpretation: 'Lesson-relative contract reference, not an absolute review input'});
      } else {
        const entry = descriptors.get(value.path) ?? {path: value.path, expected: [], origins: []};
        if (!entry.expected.includes(value.sha256)) entry.expected.push(value.sha256);
        if (!entry.origins.includes(origin)) entry.origins.push(origin);
        descriptors.set(value.path, entry);
      }
    }
    for (const child of Object.values(value)) collect(child, origin);
  }
  for (const name of manifests) {
    const full = path.join(tmp, name);
    collect(read(full), name);
    if (!descriptors.has(full)) descriptors.set(full, {path: full, expected: [sha(fs.readFileSync(full))], origins: ['explicit manifest']});
  }
  const files = [...descriptors.values()].sort((a, b) => a.path.localeCompare(b.path)).map(entry => {
    const bytes = fs.readFileSync(entry.path);
    const stat = fs.statSync(entry.path);
    const actual = sha(bytes);
    return {...entry, sha256: actual, bytes: bytes.length, mode: (stat.mode & 0o777).toString(8).padStart(4, '0'), expectedMatch: entry.expected.every(expected => expected === actual)};
  });
  writeOwn('input-bindings.before.json', {
    schema: 'independent-review-bindings@1',
    phase: 'before-semantic-comparisons-after-four-FIRST-hash-seals',
    imageBytesHashedWithoutDisplay: true,
    manifests,
    relativeContractReferences,
    files,
    mismatches: files.filter(file => !file.expectedMatch),
    note: 'SHA reads of referenced bytes are integrity checks, not image opens. No referenced scripts are executed.'
  });
  console.log(JSON.stringify({files: files.length, mismatches: files.filter(file => !file.expectedMatch)}));
} else if (mode === 'after') {
  const before = read(path.join(own, 'input-bindings.before.json'));
  const files = before.files.map(entry => {
    const bytes = fs.readFileSync(entry.path);
    return {path: entry.path, sha256: sha(bytes), bytes: bytes.length, unchanged: sha(bytes) === entry.sha256 && bytes.length === entry.bytes};
  });
  writeOwn('input-bindings.after.json', {schema: 'independent-review-bindings@1', phase: 'after-all-comparisons', files, changed: files.filter(file => !file.unchanged)});
  console.log(JSON.stringify({files: files.length, changed: files.filter(file => !file.unchanged)}));
} else if (mode === 'index') {
  const outputs = fs.readdirSync(own).filter(name => name !== 'output-index.json' && name !== 'output-index.sha256').sort().map(name => {
    const full = path.join(own, name);
    if (!fs.statSync(full).isFile()) throw new Error(`Unexpected output directory: ${name}`);
    const bytes = fs.readFileSync(full);
    return {path: name, sha256: sha(bytes), bytes: bytes.length};
  });
  writeOwn('output-index.json', {schema: 'independent-output-index@1', outputs, selfExcluded: ['output-index.json', 'output-index.sha256']});
  const digest = sha(fs.readFileSync(path.join(own, 'output-index.json')));
  fs.writeFileSync(path.join(own, 'output-index.sha256'), digest + '\n');
  console.log(digest);
} else {
  throw new Error('Use before, after, or index.');
}

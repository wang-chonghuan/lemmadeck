import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp');
const own = path.join(tmp, 'source226227-FIRST-review-01');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
const mode = process.argv[2];
let result;
if (mode === 'before') {
  const earlier = new Set(read(path.join(own, 'input-bindings.before.json')).files.map(file => file.path));
  const descriptors = new Map();
  const nested = [
    'n61-modern-text-author-inputs-01/manifest.json',
    'n61-source-admission-01.json',
    'n60-modern-text-admission-01.json'
  ];
  function collect(value, origin) {
    if (!value || typeof value !== 'object') return;
    if (typeof value.path === 'string' && path.isAbsolute(value.path) && /^[a-f0-9]{64}$/u.test(value.sha256 ?? '') && !earlier.has(value.path)) {
      const prior = descriptors.get(value.path) ?? {path: value.path, expected: [], origins: []};
      if (!prior.expected.includes(value.sha256)) prior.expected.push(value.sha256);
      if (!prior.origins.includes(origin)) prior.origins.push(origin);
      descriptors.set(value.path, prior);
    }
    for (const child of Object.values(value)) collect(child, origin);
  }
  for (const name of nested) collect(read(path.join(tmp, name)), name);
  const contracts = [
    '.claude/skills/ld-s10y-lesson/SKILL.md',
    '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md',
    '.claude/skills/ld-s10y-lesson/references/production-resume.md',
    '.agents/skills/ld-s10y-image/SKILL.md',
    '.agents/skills/ld-s10y-image/references/figure-spec.md',
    '.agents/skills/ld-s10y-image/references/quality-gate.md'
  ];
  for (const name of contracts) descriptors.set(path.join(repo, name), {path: path.join(repo, name), expected: [], origins: ['read-only local contract']});
  const files = [...descriptors.values()].sort((a, b) => a.path.localeCompare(b.path)).map(entry => {
    const bytes = fs.readFileSync(entry.path);
    const actual = sha(bytes);
    return {...entry, sha256: actual, bytes: bytes.length, expectedMatch: entry.expected.every(expected => expected === actual)};
  });
  result = {
    schema: 'independent-transitive-bindings@1',
    phase: 'first-integrity-check-of-transitive-metadata-and-contracts',
    limitation: 'Primary 147 input hashes were bound before comparisons. These transitive descriptors were discovered from already-bound admissions after FIRSTs; this file is not backdated to before their textual read.',
    nested, files, mismatches: files.filter(file => !file.expectedMatch),
    imageMetadataOnlyNoImageDisplay: true,
    unaffectedPrimaryBindingsRechecked: 0
  };
} else if (mode === 'after') {
  const prior = read(path.join(own, 'transitive-bindings.before.json'));
  const files = prior.files.map(file => {
    const bytes = fs.readFileSync(file.path);
    return {path: file.path, sha256: sha(bytes), bytes: bytes.length, unchanged: sha(bytes) === file.sha256 && bytes.length === file.bytes};
  });
  result = {schema: 'independent-transitive-bindings@1', phase: 'after', files, changed: files.filter(file => !file.unchanged)};
} else throw new Error('Use before or after.');
fs.writeFileSync(path.join(own, `transitive-bindings.${mode}.json`), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({files: result.files.length, mismatches: result.mismatches ?? [], changed: result.changed ?? []}));

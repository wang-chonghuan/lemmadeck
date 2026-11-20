import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const cwd = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const root = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n47-answer-choice-surfaces-review-01');
const manifestPath = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n47-answer-choice-surfaces-review-inputs-01/manifest.json');
if (process.cwd() !== cwd) throw new Error('Wrong cwd');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const phase = process.argv[2];
if (!['before', 'after', 'index'].includes(phase)) throw new Error('Use before, after, or index');
const manifestBytes = fs.readFileSync(manifestPath);
const manifest = JSON.parse(manifestBytes);
const save = (name, value) => fs.writeFileSync(path.join(root, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
if (phase === 'index') {
  const files = fs.readdirSync(root).filter(name => name !== 'output-index.json').sort();
  const outputs = files.map(name => {
    const p = path.join(root, name);
    if (!fs.statSync(p).isFile()) throw new Error(`Unexpected directory: ${p}`);
    const bytes = fs.readFileSync(p);
    return { path: p, sha256: sha(bytes), bytes: bytes.length };
  });
  save('output-index.json', { schema: 'bounded-review-output-index-v1', excludes_self: true, outputs });
  console.log(JSON.stringify({ outputs, index: { path: path.join(root, 'output-index.json'), sha256: sha(fs.readFileSync(path.join(root, 'output-index.json'))) } }, null, 2));
} else {
  const check = binding => {
    const bytes = fs.readFileSync(binding.path);
    return { path: binding.path, sha256: binding.sha256, actual_sha256: sha(bytes), bytes: bytes.length, matches: binding.sha256 === sha(bytes) };
  };
  const bindings = manifest.bindings.map(check);
  const direct = [manifest.sourceOnly, manifest.visibleQuestions, manifest.keyLast.draft, manifest.keyLast.answerCandidate, ...manifest.images].map(check);
  const prior = phase === 'after' ? JSON.parse(fs.readFileSync(path.join(root, 'bindings-before.json'), 'utf8')) : null;
  const changed = prior ? bindings.filter((x, i) => x.path !== prior.bindings[i].path || x.actual_sha256 !== prior.bindings[i].actual_sha256) : [];
  const result = {
    phase,
    manifest: { path: manifestPath, sha256: sha(manifestBytes), unchanged_from_before: prior ? prior.manifest.sha256 === sha(manifestBytes) : null },
    binding_count: bindings.length,
    bindings,
    direct,
    mismatches: [...bindings, ...direct].filter(x => !x.matches),
    changed_since_before: changed,
    status: [...bindings, ...direct].every(x => x.matches) && changed.length === 0 && (!prior || prior.manifest.sha256 === sha(manifestBytes)) ? 'pass' : 'blocked',
    content_interpreted: false
  };
  save(`bindings-${phase}.json`, result);
  console.log(JSON.stringify({ phase, status: result.status, binding_count: bindings.length, mismatches: result.mismatches, changed_since_before: changed }, null, 2));
  if (result.status !== 'pass') process.exitCode = 1;
}

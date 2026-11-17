import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const workspace = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const author = path.join(workspace, '.intentfold/tickets/STEMROBIN-181/tmp/d038-10p-source96-99-author');
const evidence = path.dirname(new URL(import.meta.url).pathname);
const expected = '9ffe8748458a3efeef932f1b993d53e5da943ac34eeeba41b96d126935611214';
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const freezeBytes = fs.readFileSync(path.join(author, 'author-freeze.json'));
if (sha256(freezeBytes) !== expected) throw new Error('Author freeze mismatch');
const verified = new Map();
function verify(value) {
  if (!value || typeof value !== 'object') return;
  if (typeof value.path === 'string' && typeof value.sha256 === 'string') {
    const bytes = fs.readFileSync(value.path);
    if (sha256(bytes) !== value.sha256) throw new Error(`Binding mismatch: ${value.path}`);
    verified.set(value.path, {path: value.path, sha256: value.sha256, bytes: bytes.length});
  }
  for (const item of Object.values(value)) verify(item);
}
verify(JSON.parse(freezeBytes));
verify(JSON.parse(fs.readFileSync(path.join(author, 'input-freeze.json'))));
const snapshots = [];
function capture(directory) {
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    const source = path.join(directory, entry.name);
    if (entry.isDirectory()) capture(source);
    else if (entry.isFile()) {
      const bytes = fs.readFileSync(source);
      const relative = path.relative(author, source);
      const destination = path.join(evidence, 'inputs', relative);
      if (fs.existsSync(destination)) throw new Error(`Snapshot already exists: ${destination}`);
      fs.mkdirSync(path.dirname(destination), {recursive: true});
      fs.writeFileSync(destination, bytes, {flag: 'wx'});
      snapshots.push({source, path: destination, sha256: sha256(bytes), bytes: bytes.length});
    }
  }
}
capture(author);
const manifest = {
  schema: 'stemrobin-181/source-review-inputs@1',
  authorFreeze: {path: path.join(author, 'author-freeze.json'), sha256: expected},
  verifiedFrozenBindings: verified.size,
  verifiedBindings: [...verified.values()],
  snapshots,
  method: 'Read-only SHA-256 verification and byte-identical snapshot; no prepare, counter, finalize, PDF rendering, or image opening.',
};
fs.writeFileSync(path.join(evidence, 'input-bindings.json'), `${JSON.stringify(manifest, null, 2)}\n`, {flag: 'wx'});
console.log(JSON.stringify({verifiedFrozenBindings: verified.size, snapshotFiles: snapshots.length}));

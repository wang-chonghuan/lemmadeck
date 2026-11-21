import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const cwd = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
const root = path.join(cwd, '.tmp/stemrobin-184-six/source166-active');
const stages = path.join(cwd, '.tmp/stemrobin-184-six/stages');
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const walk = dir => fs.readdirSync(dir).sort().flatMap(n => {
  const p = path.join(dir, n);
  return fs.lstatSync(p).isDirectory() ? walk(p) : [p];
});
const json = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const front = p => JSON.parse(fs.readFileSync(p, 'utf8').match(/^---\n([\s\S]*?)\n---/)[1]);
const stageFiles = () => fs.readdirSync(stages).sort()
  .filter(n => n.startsWith('source166-active-')).map(n => path.join(stages, n));
const native = path.join(root, 'native/9c/pages/0166');
const stage = 'source166-active-byte-json-grammar-seal-nov21';

if (process.argv.includes('--check')) {
  for (const p of walk(root).filter(p => p.endsWith('.json'))) json(p);
  const frozen = json(path.join(root, 'source.freeze.json'));
  for (const k of ['body', 'inventory', 'binding']) {
    const b = fs.readFileSync(frozen[k].path);
    assert.equal(b.length, frozen[k].bytes);
    assert.equal(sha(b), frozen[k].sha256);
  }
  const expected = front(path.join(root, 'original-page.template.md'));
  expected.printed_page = 159;
  assert.deepEqual(front(path.join(root, 'native-input.md')), expected);
  const body = fs.readFileSync(path.join(root, 'source.body.md'), 'utf8');
  const input = fs.readFileSync(path.join(root, 'native-input.md'), 'utf8');
  assert.equal(input.slice(input.indexOf('\n---\n') + 6).trimStart(), body);
  const headers = body.match(/^<!-- .* -->$/gm);
  assert.equal(headers.length, 13);
  for (const h of headers) assert.match(h, /^<!-- (?:ex \d+(?: samerow)?|h3|p(?: open)?|foot) -->$/);
  for (const p of stageFiles().filter(p => p.endsWith('.receipt.json'))) {
    const r = json(p);
    assert.equal(r.cwd, cwd);
    for (const o of Object.values(r.outputs)) {
      const b = fs.readFileSync(path.join(cwd, o.path));
      assert.equal(b.length, o.bytes);
      assert.equal(sha(b), o.sha256);
    }
  }
  assert.equal(json(path.join(stages, 'source166-active-first-prepare-nov21.receipt.json')).exitCode, 0);
  assert.equal(json(path.join(stages, 'source166-active-first-native-nov21.receipt.json')).exitCode, 1);
  console.log(JSON.stringify({
    mechanicalOnly: true, rasterLoads: 0, frozenBytesAndGrammar: 'unchanged',
    audit: json(path.join(native, 'audit.json')),
    nativePage: json(path.join(native, 'page.json')),
    nativeMdEqualsInput: fs.readFileSync(path.join(native, 'page.md')).equals(Buffer.from(input)),
  }, null, 2));
} else {
  const r = spawnSync(process.execPath, [
    path.join(cwd, '.tmp/stemrobin-184-six/run-stage.mjs'), stage,
    process.execPath, path.join(root, 'seal.mjs'), '--check',
  ], { cwd, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  process.stdout.write(r.stdout ?? '');
  process.stderr.write(r.stderr ?? '');
  const files = [...walk(root), ...stageFiles()].map(p => {
    if (fs.lstatSync(p).isSymbolicLink()) {
      const target = fs.readlinkSync(p);
      return { path: p, kind: 'symlink', target, linkBytes: Buffer.byteLength(target),
        linkSha256: sha(target), targetBinding: 'pre-view-bindings.json:png' };
    }
    const b = fs.readFileSync(p);
    fs.chmodSync(p, 0o444);
    return { path: p, bytes: b.length, sha256: sha(b), mode: '0444' };
  });
  const ownedBytes = files.filter(f => f.path.startsWith(root + '/') && f.bytes
    && !f.path.startsWith(native + '/')).reduce((s, f) => s + f.bytes, 0);
  const manifest = { status: r.status === 0 ? 'MECHANICAL_SEALED_NATIVE_FAILED' : 'SEAL_FAILED',
    acceptance: 'Not source or math acceptance. Parent full intake/actual close pending.',
    selfExcluded: path.join(root, 'manifest.json'), knownImageCharges: 5,
    actualInternalLoads: 'UNKNOWN', authoredBytesBeforeSelf: ownedBytes,
    referencedStageBytes: files.filter(f => f.path.startsWith(stages + '/'))
      .reduce((s, f) => s + f.bytes, 0), files };
  const text = JSON.stringify(manifest) + '\n';
  const mp = path.join(root, 'manifest.json');
  fs.writeFileSync(mp, text, { flag: 'wx', mode: 0o444 });
  const directories = dir => {
    for (const n of fs.readdirSync(dir)) {
      const p = path.join(dir, n);
      if (fs.lstatSync(p).isDirectory()) directories(p);
    }
    fs.chmodSync(dir, 0o555);
  };
  directories(root);
  console.log(JSON.stringify({ manifest: { path: mp, bytes: Buffer.byteLength(text), sha256: sha(text) },
    authoredBytesIncludingManifest: ownedBytes + Buffer.byteLength(text),
    scriptsBytes: files.filter(f => f.path.startsWith(root + '/') && f.path.endsWith('.mjs'))
      .reduce((s, f) => s + f.bytes, 0), rootMode: '0555', sealExit: r.status }));
  process.exitCode = r.status ?? 1;
}

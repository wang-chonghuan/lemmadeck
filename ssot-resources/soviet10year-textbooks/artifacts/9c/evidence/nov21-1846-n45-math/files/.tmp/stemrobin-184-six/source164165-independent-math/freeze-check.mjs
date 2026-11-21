import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const dir = path.join(root, '.tmp/stemrobin-184-six/source164165-independent-math');
const stage = 'source164165-independent-math-freeze-nov21';
const names = ['freeze-check.mjs', 'report.json', 'report.md'];
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const mode = p => (fs.statSync(p).mode & 0o777).toString(8).padStart(4, '0');
assert.deepEqual(fs.readdirSync(dir).sort(), names);
const md = fs.readFileSync(path.join(dir, 'report.md'));
const jb = fs.readFileSync(path.join(dir, 'report.json'));
const sb = fs.readFileSync(path.join(dir, 'freeze-check.mjs'));
assert(md.length <= 10000);
assert(jb.length <= 7000);
assert(sb.length <= 4000);
const report = JSON.parse(jb.toString('utf8'));
assert.equal(report.mathematical_error_count, 0);
assert.deepEqual(report.mathematical_errors, []);
assert.equal(report.independence.parent_draft_read, false);
assert.equal(report.independence.derivations_completed_before_parent_disclosure, true);
assert.equal(report.open_items.n45_closed, false);
assert.equal(report.open_items.owners_beyond_visible_367, 'UNKNOWN');
const expected = [
  ['S164', '.tmp/stemrobin-184-six/source164165-source/0164.body.md'],
  ['S165', '.tmp/stemrobin-184-six/source164165-source/0165.body.md'],
  ['T163', '.tmp/stemrobin-184-six/source164165-native-nov21/preparation.json'],
];
assert.equal(report.references.length, expected.length);
const refs = expected.map(([id, relative], i) => {
  const p = path.join(root, relative);
  assert.equal(report.references[i].id, id);
  assert.equal(report.references[i].path, p);
  const b = fs.readFileSync(p);
  return { id, path: p, bytes: b.length, sha256: hash(b) };
});
const ids = new Set(refs.map(r => r.id));
assert.equal(ids.size, 3);
for (const c of report.claims) {
  assert(c.id && c.claim && c.verdict && c.refs.length);
  for (const id of c.refs) assert(ids.has(id));
}
assert.equal(new Set(report.claims.map(c => c.id)).size, report.claims.length);
const files = names.map(name => {
  const p = path.join(dir, name);
  const b = fs.readFileSync(p);
  fs.chmodSync(p, 0o444);
  return { path: p, bytes: b.length, sha256: hash(b), mode: mode(p) };
});
const mp = path.join(dir, 'manifest.json');
const manifest = {
  stage, scope: 'mathematical_text_only', self_excluded: mp,
  files, references: refs, directory_mode: '0555',
  counts: { files: files.length, references: refs.length, claims: report.claims.length,
    mathematical_errors: 0, integrity_errors: 0, image_decodes: 0, check_invocations: 1 },
};
fs.writeFileSync(mp, JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx', mode: 0o444 });
fs.chmodSync(mp, 0o444);
fs.chmodSync(dir, 0o555);
assert.equal(mode(dir), '0555');
for (const f of files) assert.equal(f.mode, '0444');
assert.equal(mode(mp), '0444');
const mb = fs.readFileSync(mp);
assert.deepEqual(JSON.parse(mb.toString('utf8')), manifest);
console.log(JSON.stringify({
  stage, status: 'frozen_baseline_parent_text_close_pending',
  directory: dir, directory_mode: mode(dir), files,
  manifest: { path: mp, bytes: mb.length, sha256: hash(mb), mode: mode(mp) },
  counts: manifest.counts, errors: [],
}, null, 2));

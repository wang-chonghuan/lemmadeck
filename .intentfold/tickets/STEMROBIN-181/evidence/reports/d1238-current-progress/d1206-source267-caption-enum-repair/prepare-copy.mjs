import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scratch = path.dirname(fileURLToPath(import.meta.url));
const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
assert.equal(process.cwd(), repo);
assert.equal(scratch, path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1206-source267-caption-enum-repair'));
const tmp = path.dirname(scratch);
const author = path.join(tmp, 'd1188-source267-first-author');
const reviewPath = path.join(tmp, 'd1197-source267-first-independent-review/report.json');
const digest = filename => crypto.createHash('sha256').update(fs.readFileSync(filename)).digest('hex');
const reviewSha = 'bd8a43aacb8925a782ea7d7bbef7ae5039336dc3c3066dcb961bbcc1075845ae';
assert.equal(digest(reviewPath), reviewSha);
const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));
for (const entry of [...review.candidate_hashes, ...review.evidence_hashes]) {
  assert.equal(digest(entry.path), entry.sha256, entry.path);
}
const files = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const filename = path.join(directory, entry.name);
  assert.ok(!entry.isSymbolicLink(), filename);
  return entry.isDirectory() ? files(filename) : [filename];
}).sort();
const preserved = [
  ...files(path.join(author, 'root')),
  ...files(path.join(author, 'work')),
  ...files(path.join(author, 'first')),
  ...files(path.join(tmp, 'd1194-source267-first-native/finalize')),
  ...review.evidence_hashes.map(entry => entry.path),
  reviewPath,
];
const baseline = {
  schema: 'source267-caption-enum-repair-baseline/v1',
  createdAt: new Date().toISOString(),
  independent_review: { path: reviewPath, sha256: reviewSha },
  original_author: author,
  original_failure: path.join(tmp, 'd1194-source267-first-native/finalize'),
  preserved: [...new Set(preserved)].map(filename => ({
    path: filename, sha256: digest(filename), bytes: fs.statSync(filename).size,
  })),
  p2c_before: {
    path: path.join(repo, '.claude/skills/ld-s10y-lesson/tools/p2c.py'),
    sha256: '0caa2d0bfea5feb3dcef94cfb783db9f645a77d4f7fb52143498054ca5832a5b',
  },
};
assert.ok(!fs.existsSync(path.join(scratch, 'baseline.json')));
for (const directory of ['root', 'work']) {
  const source = path.join(author, directory);
  const destination = path.join(scratch, directory);
  assert.ok(!fs.existsSync(destination), destination);
  fs.cpSync(source, destination, { recursive: true, errorOnExist: true, force: false });
  for (const filename of files(destination)) {
    fs.chmodSync(filename, fs.statSync(filename).mode | 0o200);
    assert.equal(digest(filename), digest(path.join(source, path.relative(destination, filename))));
  }
}
const toolBefore = path.join(scratch, 'p2c.before.py');
// Preserve the exact pre-edit tool from the approved two-site change, not Git.
const currentTool = fs.readFileSync(baseline.p2c_before.path, 'utf8');
const helperStart = currentTool.indexOf('def _validate_page_enums(');
const helperEnd = currentTool.indexOf('def _validate_page_errata(', helperStart);
assert.ok(helperStart >= 0 && helperEnd > helperStart);
const originalLoop = [
  '    for i, b in enumerate(blks):',
  '        if profile.get("enum_marker_script") != "cyrillic":',
  '            break',
  '        for key in ENUM_LINE.findall(B.text_of(b, join="\\n")):',
  '            if nz.enum_key_script(key) not in ("cyrillic", "numeric"):',
  '                errors.append(f"{b[\'kind\']}#{i+1}: 小问标号 {key!r} 不是西里尔")',
  '',
  '',
].join('\n');
const beforeTool = (
  currentTool.slice(0, helperStart) + currentTool.slice(helperEnd)
).replace('    errors += _validate_page_enums(blks, profile)\n', originalLoop);
assert.equal(crypto.createHash('sha256').update(beforeTool).digest('hex'), baseline.p2c_before.sha256);
fs.writeFileSync(toolBefore, beforeTool, { flag: 'wx' });
fs.writeFileSync(path.join(scratch, 'baseline.json'), `${JSON.stringify(baseline, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({
  copied: ['root', 'work'].map(directory => path.join(scratch, directory)),
  preserved_files: baseline.preserved.length,
  independent_review_sha256: reviewSha,
}, null, 2));

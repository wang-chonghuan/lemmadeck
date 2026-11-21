import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
const directory = path.join(root, '.tmp/stemrobin-184-six/source166-glyph-recovery');
const stageDirectory = path.join(root, '.tmp/stemrobin-184-six/stages');
assert.equal(process.cwd(), root);
const manifest = path.join(directory, 'manifest.sha256.txt');
assert(!fs.existsSync(manifest), 'One-shot zero-decode seal.');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length, sha256: hash(bytes) };
};
const check = expected => {
  const actual = bind(expected.path);
  assert.equal(actual.bytes, expected.bytes, expected.path);
  assert.equal(actual.sha256, expected.sha256, expected.path);
};
const report = JSON.parse(fs.readFileSync(path.join(directory, 'report.json'), 'utf8'));

// All PNG verification here is encoded byte hashing, never image decoding.
check(report.source);
check(report.prior_intake.original_manifest);
const oldManifest = fs.readFileSync(report.prior_intake.original_manifest.path, 'utf8');
for (const line of oldManifest.split('\n').filter(line => line && !line.startsWith('#'))) {
  const [sha256, bytes, file] = line.split('\t');
  check({ path: file, bytes: Number(bytes), sha256 });
  assert.equal(fs.statSync(file).mode & 0o777, 0o444, file);
}
assert.equal(fs.statSync(path.dirname(report.prior_intake.original_manifest.path)).mode & 0o777, 0o555);
for (const expected of [
  report.input_delta.original_input, report.input_delta.original_body,
  ...report.native_bindings, report.native.stdout, report.native.stderr,
]) check(expected);
for (const roi of report.glyph_observations) {
  check({ path: roi.path, bytes: roi.encoded_bytes, sha256: roi.encoded_sha256 });
  assert.equal(roi.observed, 'n>1');
  assert.equal(roi.native_roi_views, 1);
  assert.equal(roi.unequivocal, true);
}

const parse = file => {
  const text = fs.readFileSync(file, 'utf8');
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  assert(match, file);
  return { meta: JSON.parse(match[1]), body: match[2] };
};
const input = parse(path.join(directory, 'native-input.md'));
const output = parse(path.join(directory, 'native/9c/pages/0166/page.md'));
assert.equal(input.body, output.body);
for (const [key, value] of Object.entries(input.meta)) assert.deepEqual(output.meta[key], value);
assert.equal(input.meta.printed_page, 159);
assert.deepEqual(input.meta.notes, []);
assert.deepEqual(input.meta.errata, []);
assert.equal(input.meta.count_exclusions.length, 1);
assert.deepEqual(input.meta.count_exclusions[0].box, [0, 2377, 1695, 4]);
assert.equal(input.meta.count_exclusions[0].kind, 'scan-artifact');
const audit = JSON.parse(fs.readFileSync(path.join(directory, 'native/9c/pages/0166/audit.json'), 'utf8'));
assert.equal(audit.lines_printed, 22);
assert.equal(audit.lines_md, 22);
assert.deepEqual(audit.errors, []);
assert.deepEqual(audit.normalizations, []);
assert.deepEqual(audit.count_exclusions, input.meta.count_exclusions);
const receipt = JSON.parse(fs.readFileSync(report.native.receipt, 'utf8'));
assert.equal(receipt.stage, 'source166-affected-native-count-recovery-nov21');
assert.equal(receipt.cwd, root);
assert.equal(receipt.exitCode, 0);
assert.equal(report.native.actual_invocations, 1);
assert.equal(report.budget.conservative_task_and_same_context.total, 7);
assert.equal(report.budget.cumulative_source166_known, 12);

const files = [];
const directories = [];
const links = [];
const walk = folder => {
  directories.push(folder);
  for (const name of fs.readdirSync(folder).sort()) {
    const file = path.join(folder, name);
    const stat = fs.lstatSync(file);
    if (stat.isSymbolicLink()) {
      assert.equal(file, report.input_delta.original_png_symlink.path);
      const target = fs.readlinkSync(file);
      assert.equal(target, report.source.path);
      links.push({ ...bind(target), path: file, kind: 'symlink', target });
    } else if (stat.isDirectory()) {
      walk(file);
    } else {
      assert(stat.isFile(), file);
      if (file.endsWith('.json')) JSON.parse(fs.readFileSync(file, 'utf8'));
      files.push(file);
    }
  }
};
walk(directory);
assert.equal(files.filter(file => file.endsWith('.png')).length, 2);
assert.equal(links.length, 1);
const completedStages = [
  'source166-affected-glyph-rois-nov21',
  'source166-affected-glyph-native-input-nov21',
  'source166-affected-native-count-recovery-nov21',
];
const stageFiles = completedStages.flatMap(stage =>
  ['stdout', 'stderr', 'receipt.json'].map(suffix => path.join(stageDirectory, `${stage}.${suffix}`)));
for (const file of stageFiles) assert(fs.lstatSync(file).isFile(), file);
const rows = [
  ...files.map(file => ({ ...bind(file), kind: 'regular' })),
  ...stageFiles.map(file => ({ ...bind(file), kind: 'stage' })),
  ...links,
].sort((a, b) => a.path.localeCompare(b.path));
fs.writeFileSync(manifest,
  '# SHA-256\tbytes\tabsolute-path\tkind\tlink-target; self-excluding; encoded hashes; zero image decodes\n'
  + rows.map(row => `${row.sha256}\t${row.bytes}\t${row.path}\t${row.kind}\t${row.target ?? ''}`).join('\n') + '\n',
  { flag: 'wx', mode: 0o444 });
for (const file of [...files, ...stageFiles, manifest]) fs.chmodSync(file, 0o444);
for (const folder of directories.reverse()) fs.chmodSync(folder, 0o555);
console.log(JSON.stringify({
  verdict: 'PASS_AFFECTED_GLYPHS_NATIVE22_22_TEXT_SEAL',
  mechanicalSealRuns: 1,
  imageDecodes: 0,
  oldSealedManifestVerifiedUnchanged: true,
  filesMode: '0444',
  ownedDirectoriesMode: '0555',
  encodedRoiFiles: 2,
  originalPngSymlinks: 1,
  taskContextKnown: 7,
  cumulativeSource166Known: 12,
  report: bind(path.join(directory, 'report.json')),
  textReport: bind(path.join(directory, 'report.md')),
  nativeAudit: bind(path.join(directory, 'native/9c/pages/0166/audit.json')),
  manifest: bind(manifest),
  manifestEntries: rows.length,
  completeStageReceipts: stageFiles.filter(file => file.endsWith('.receipt.json')).map(bind),
}, null, 2));

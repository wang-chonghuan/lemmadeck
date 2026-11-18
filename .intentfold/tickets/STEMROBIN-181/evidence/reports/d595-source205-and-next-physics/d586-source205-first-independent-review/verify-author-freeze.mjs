import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const own = path.dirname(new URL(import.meta.url).pathname);
const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const author = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d579-source205-first-author');
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const inventoryPath = path.join(own, 'source-inventory.json');
const inventoryHash = '427ecc435db63a6b3ac6532e9fd0dd4a29cf7809c46668f3af8380e250399045';
if (digest(fs.readFileSync(inventoryPath)) !== inventoryHash ||
    (fs.statSync(inventoryPath).mode & 0o777) !== 0o444) {
  throw new Error('Independent source inventory is not the sealed version.');
}
const freezePath = path.join(author, 'author-freeze.json');
const freezeBytes = fs.readFileSync(freezePath);
const freezeHash = '11cbf4f9393eba7562d39f2f0ff736c7045407bbba1ddbf580fb8747ba38c824';
if (digest(freezeBytes) !== freezeHash) throw new Error('Author freeze hash mismatch.');
const freeze = JSON.parse(freezeBytes);
if (freeze.schema !== 's10y/author-freeze@1' || !Array.isArray(freeze.files)) {
  throw new Error('Unexpected author freeze schema.');
}
const pins = freeze.files.map(entry => {
  if (!path.isAbsolute(entry.path) ||
      !entry.path.startsWith(author + path.sep) ||
      !/^[0-9a-f]{64}$/.test(entry.sha256) ||
      !Number.isInteger(entry.bytes) || entry.mode !== '0444') {
    throw new Error('Unexpected manifest entry shape or ownership.');
  }
  const real = fs.realpathSync(entry.path);
  if (real !== entry.path) throw new Error('Manifest path is not its literal resolved path.');
  const stat = fs.statSync(real);
  const actual = digest(fs.readFileSync(real));
  return {
    path: real, expected_sha256: entry.sha256, actual_sha256: actual,
    sha256_match: actual === entry.sha256,
    bytes: stat.size, expected_bytes: entry.bytes, bytes_match: stat.size === entry.bytes,
    mode: '0' + (stat.mode & 0o777).toString(8), mode_match: (stat.mode & 0o777) === 0o444,
  };
});
const special = [
  ['report.json', '45deae31d2b6907fa8af00bdd9d374fe7986b876834c3e7860699606acc342f2'],
  ['pre-native-freeze.json', '5ea792195fe46154b1b657bbbbe30d105697024451d0e3edab5f46fe1462ac11'],
].map(([name, expected]) => {
  const pin = pins.find(item => item.path === path.join(author, name));
  if (!pin) throw new Error('Required pin missing.');
  return {path: pin.path, expected_sha256: expected, actual_sha256: pin.actual_sha256,
    match: pin.actual_sha256 === expected && pin.expected_sha256 === expected};
});
const result = {
  schema: 'source205-independent-author-hash-verification@1',
  verifiedAt: new Date().toISOString(),
  sourceInventory: {path: inventoryPath, sha256: inventoryHash, mode: '0444'},
  ordering: 'Independent inventory was sealed and receipt emitted before author-freeze schema inspection; manifest schema inspected before resolving file paths; file hashes verified before reading prose/report/native artifacts.',
  authorFreeze: {path: freezePath, sha256: freezeHash, schema: freeze.schema},
  special, pins,
  all_pass: special.every(x => x.match) &&
    pins.every(x => x.sha256_match && x.bytes_match && x.mode_match),
  image_opens_added: 0,
  image_byte_hashing_is_not_visual_inspection: true,
};
const output = path.join(own, 'author-hash-verification.json');
if (fs.existsSync(output)) throw new Error('Refusing to overwrite verification.');
fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n', {flag: 'wx'});
console.log(JSON.stringify({path: output, sha256: digest(fs.readFileSync(output)),
  checked_files: pins.length, all_pass: result.all_pass, special}, null, 2));
if (!result.all_pass) process.exitCode = 1;

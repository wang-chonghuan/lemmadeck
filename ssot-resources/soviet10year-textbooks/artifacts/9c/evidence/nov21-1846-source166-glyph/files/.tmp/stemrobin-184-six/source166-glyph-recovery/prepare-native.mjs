import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
const dest = path.join(root, '.tmp/stemrobin-184-six/source166-glyph-recovery');
const original = path.join(root, '.tmp/stemrobin-184-six/source166-active/native-input.md');
const sourceBody = path.join(root, '.tmp/stemrobin-184-six/source166-active/source.body.md');
const sourcePng = path.join(root, '.tmp/ld-s10y-lesson/9c/pages/0166/page.png');
assert.equal(process.cwd(), root);
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const input = fs.readFileSync(original, 'utf8');
assert.equal(hash(input), '854ca61d2abe1a4be46737f7450ce2fcf02bccbf50e5fd87cdbcf1bffb7466ee');
const oldBody = fs.readFileSync(sourceBody, 'utf8');
assert.equal(hash(oldBody), '43a6dbde5cff79de0f8ce811de7e028c5267fea8f969cac01e6f7c2eb86012ae');
const match = input.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
assert(match);
assert.equal(match[2], '\n' + oldBody);
const oldMeta = JSON.parse(match[1]);
assert.equal(oldMeta.printed_page, 159);
assert.deepEqual(oldMeta.notes, []);
assert.deepEqual(oldMeta.errata, []);
assert(!Object.hasOwn(oldMeta, 'count_exclusions'));

const changes = [
  ['定理．以自然数 $n\\geq1$ 为指数的幂函数', '定理．以自然数 $n>1$ 为指数的幂函数'],
  ['由此，根据数学归纳法得出，公式(1)对一切自然数 $n\\geq1$ 都', '由此，根据数学归纳法得出，公式(1)对一切自然数 $n>1$ 都'],
];
let body = match[2];
for (const [before, after] of changes) {
  assert.equal(body.split(before).length, 2);
  body = body.replace(before, after);
}
assert.equal(body, match[2].replaceAll('n\\geq1', 'n>1'));
assert.equal(body.split('n>1').length, 3);
const exclusion = {
  kind: 'scan-artifact',
  box: [0, 2377, 1695, 4],
  reason: 'The original single native source166 view and frozen independent inventory.json SHA256 302a66f91f2c50735274cbf115a07356529fc7e102c0ca202207990884721095 identify 21 content baselines plus folio159 = 22. Disclosed layout band [2377,2380] is separate bottom-edge scan ink in a no-body margin below all content and folio; no new bottom view or source-pixel edit.',
};
const closing = match[1].lastIndexOf('\n}');
assert.equal(closing, match[1].length - 2);
const entry = JSON.stringify([exclusion], null, 2).split('\n')
  .map((line, index) => index ? '  ' + line : line).join('\n');
const header = match[1].slice(0, closing)
  + ',\n  "count_exclusions": ' + entry + match[1].slice(closing);
const meta = JSON.parse(header);
const { count_exclusions, ...unchanged } = meta;
assert.deepEqual(unchanged, oldMeta);
assert.deepEqual(count_exclusions, [exclusion]);
const nativeInput = `---\n${header}\n---\n${body}`;
assert.equal(nativeInput.replace(header, match[1])
  .replace(changes[0][1], changes[0][0])
  .replace(changes[1][1], changes[1][0]), input);

const pageDir = path.join(dest, 'native/9c/pages/0166');
const workDir = path.join(dest, 'work/9c/pages/0166');
const snapshot = path.join(dest, 'native-input.md');
const page = path.join(pageDir, 'page.md');
const link = path.join(workDir, 'page.png');
for (const file of [snapshot, page, link, path.join(dest, 'input-delta.json')]) {
  assert(!fs.existsSync(file), file);
}
fs.mkdirSync(pageDir, { recursive: true });
fs.mkdirSync(workDir, { recursive: true });
fs.writeFileSync(snapshot, nativeInput, { flag: 'wx', mode: 0o444 });
fs.writeFileSync(page, nativeInput, { flag: 'wx', mode: 0o644 });
fs.symlinkSync(sourcePng, link);
fs.chmodSync(path.join(dest, 'glyph-observations.md'), 0o444);
const result = {
  originalInput: { path: original, bytes: Buffer.byteLength(input), sha256: hash(input) },
  originalBody: { path: sourceBody, bytes: Buffer.byteLength(oldBody), sha256: hash(oldBody) },
  correctedBody: { bytes: Buffer.byteLength(body.slice(1)), sha256: hash(body.slice(1)) },
  inputSnapshot: { path: snapshot, bytes: Buffer.byteLength(nativeInput), sha256: hash(nativeInput), mode: '0444' },
  nativePageBeforeFinalize: { path: page, bytes: Buffer.byteLength(nativeInput), sha256: hash(nativeInput) },
  glyphChanges: changes.map(([before, after]) => ({ before, after, count: 1 })),
  metadataChange: { count_exclusions: [exclusion] },
  otherBodyBytesUnchanged: true,
  otherMetadataBytesUnchanged: true,
  printedPage: 159,
  notes: [],
  errata: [],
  expectedCountOverride: false,
  sourcePngSymlink: { path: link, target: sourcePng },
  imageOpenCalls: 0,
  imageDecodes: 0,
};
fs.writeFileSync(path.join(dest, 'input-delta.json'), JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify(result, null, 2));
